// robots.txt fetch + parse + matcher. Enforced by default: this tool will not
// fetch a path a site disallows for our agent. On fetch error or 5xx we fail
// closed (treat as disallowed) rather than assume permission.
import { USER_AGENT, UA_TOKEN } from './ua';

interface Group {
  agents: string[];
  rules: { allow: boolean; path: string }[];
  crawlDelay: number | null;
}

export interface AgentRules {
  rules: { allow: boolean; path: string }[];
  crawlDelay: number | null;
}

export function parseRobots(txt: string): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  let lastWasAgent = false;

  for (const rawLine of txt.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();

    if (field === 'user-agent') {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [], crawlDelay: null };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) {
      current = { agents: ['*'], rules: [], crawlDelay: null };
      groups.push(current);
    }
    if (field === 'disallow' || field === 'allow') {
      current.rules.push({ allow: field === 'allow', path: value });
    } else if (field === 'crawl-delay') {
      const d = Number(value);
      if (!Number.isNaN(d)) current.crawlDelay = d;
    }
  }
  return groups;
}

export function rulesForAgent(groups: Group[], token = UA_TOKEN): AgentRules {
  const t = token.toLowerCase();
  const matched = groups.filter((g) => g.agents.some((a) => a !== '*' && t.includes(a)));
  const use = matched.length ? matched : groups.filter((g) => g.agents.includes('*'));
  return {
    rules: use.flatMap((g) => g.rules),
    crawlDelay: use.map((g) => g.crawlDelay).find((d) => d != null) ?? null,
  };
}

function matchPath(pattern: string, path: string): boolean {
  if (pattern === '') return false;
  let re = '';
  for (const ch of pattern) {
    if (ch === '*') re += '.*';
    else if (ch === '$') re += '$';
    else re += ch.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  }
  try {
    return new RegExp('^' + re).test(path);
  } catch {
    return false;
  }
}

// Google's rule: the most specific (longest) matching pattern wins; Allow beats
// Disallow on an equal-length tie.
export function isAllowed(rules: AgentRules, path: string): boolean {
  let best: { allow: boolean; len: number } | null = null;
  for (const r of rules.rules) {
    if (r.path === '') continue;
    if (!matchPath(r.path, path)) continue;
    const len = r.path.replace(/[*$]/g, '').length;
    if (!best || len > best.len || (len === best.len && r.allow)) {
      best = { allow: r.allow, len };
    }
  }
  return best ? best.allow : true;
}

interface CacheEntry {
  rules: AgentRules;
  expires: number;
}
const cache = new Map<string, CacheEntry>();

export interface RobotsDecision {
  allowed: boolean;
  crawlDelay: number | null;
  reason: string;
}

export async function checkRobots(url: string): Promise<RobotsDecision> {
  const u = new URL(url);
  const origin = u.origin;

  let entry = cache.get(origin);
  if (!entry || Date.now() > entry.expires) {
    try {
      const res = await fetch(origin + '/robots.txt', {
        headers: { 'user-agent': USER_AGENT },
        signal: AbortSignal.timeout(8000),
      });
      if (res.status >= 200 && res.status < 300) {
        const txt = (await res.text()).slice(0, 500_000);
        entry = { rules: rulesForAgent(parseRobots(txt)), expires: Date.now() + 3_600_000 };
      } else if (res.status >= 400 && res.status < 500) {
        // No robots.txt (404 etc.) → crawling permitted.
        entry = { rules: { rules: [], crawlDelay: null }, expires: Date.now() + 600_000 };
      } else {
        // 5xx / unexpected → fail closed.
        entry = { rules: { rules: [{ allow: false, path: '/' }], crawlDelay: null }, expires: Date.now() + 300_000 };
      }
    } catch {
      entry = { rules: { rules: [{ allow: false, path: '/' }], crawlDelay: null }, expires: Date.now() + 300_000 };
    }
    cache.set(origin, entry);
  }

  const allowed = isAllowed(entry.rules, u.pathname + u.search);
  return {
    allowed,
    crawlDelay: entry.rules.crawlDelay,
    reason: allowed ? 'permitted by robots.txt' : 'disallowed by robots.txt',
  };
}
