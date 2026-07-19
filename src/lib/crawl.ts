// Single-page extraction and bounded site crawl. Every fetch passes through the
// robots check, polite rate limiter, and SSRF-guarded fetcher. Hard caps bound
// depth, page count, and the frontier so a crawl can never run away.
import { safeFetch } from './fetcher';
import { checkRobots } from './robots';
import { politeWait } from './ratelimit';
import { extractFromHtml } from './extract';
import type { PageResult, CrawlOptions, CrawlResult } from './types';

const MAX_DEPTH = 3;
const MAX_PAGES = 50;

function normalize(u: string): string {
  try {
    const x = new URL(u);
    x.hash = '';
    return x.toString();
  } catch {
    return u;
  }
}

export async function extractOne(url: string): Promise<PageResult> {
  const fetchedAt = new Date().toISOString();
  const base: PageResult = {
    url,
    status: 0,
    ok: false,
    title: null,
    markdown: '',
    text: '',
    meta: {},
    links: [],
    bytes: 0,
    fetchedAt,
    rendered: false,
  };

  const robots = await checkRobots(url).catch(() => null);
  if (!robots) return { ...base, error: 'could not evaluate robots.txt' };
  if (!robots.allowed) return { ...base, error: robots.reason };

  await politeWait(new URL(url).hostname, robots.crawlDelay);

  const res = await safeFetch(url);
  if (!res.ok) {
    return { ...base, finalUrl: res.finalUrl, status: res.status, bytes: res.bytes, error: res.error ?? `HTTP ${res.status}` };
  }
  if (!res.contentType.toLowerCase().includes('html')) {
    return { ...base, finalUrl: res.finalUrl, status: res.status, bytes: res.bytes, error: `unsupported content-type: ${res.contentType || 'unknown'}` };
  }

  const ext = extractFromHtml(res.body, res.finalUrl);
  return { ...base, finalUrl: res.finalUrl, status: res.status, ok: true, bytes: res.bytes, ...ext };
}

export async function crawlSite(seed: string, opts: CrawlOptions = {}): Promise<CrawlResult> {
  const depth = Math.min(Math.max(0, opts.depth ?? 1), MAX_DEPTH);
  const limit = Math.min(Math.max(1, opts.limit ?? 10), MAX_PAGES);
  const sameOrigin = opts.sameOrigin ?? true;

  let seedOrigin = '';
  try {
    seedOrigin = new URL(seed).origin;
  } catch {
    return { seed, pages: [], visited: 0, skipped: [{ url: seed, reason: 'invalid seed URL' }] };
  }

  const start = normalize(seed);
  const queue: { url: string; d: number }[] = [{ url: start, d: 0 }];
  const seen = new Set<string>([start]);
  const pages: PageResult[] = [];
  const skipped: { url: string; reason: string }[] = [];

  while (queue.length && pages.length < limit) {
    const { url, d } = queue.shift()!;
    const page = await extractOne(url);
    if (page.ok) pages.push(page);
    else skipped.push({ url, reason: page.error ?? 'failed' });

    if (page.ok && d < depth) {
      for (const link of page.links) {
        const n = normalize(link);
        if (seen.has(n)) continue;
        try {
          if (sameOrigin && new URL(n).origin !== seedOrigin) continue;
        } catch {
          continue;
        }
        seen.add(n);
        queue.push({ url: n, d: d + 1 });
        if (seen.size > limit * 5) break; // bound the frontier
      }
    }
  }

  return { seed, pages, visited: pages.length, skipped };
}
