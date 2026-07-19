import { Resolver } from 'node:dns/promises';
import type { DnsRecords } from './types';

// Passive DNS resolution of a domain's public records.
export async function resolveDns(domain: string): Promise<DnsRecords> {
  const r = new Resolver({ timeout: 5000, tries: 2 });
  const list = (p: Promise<string[]>): Promise<string[]> => p.catch(() => []);

  const [a, aaaa, ns, cname] = await Promise.all([
    list(r.resolve4(domain)),
    list(r.resolve6(domain)),
    list(r.resolveNs(domain)),
    list(r.resolveCname(domain)),
  ]);
  const mx = await r
    .resolveMx(domain)
    .then((rows) => rows.sort((x, y) => x.priority - y.priority).map((m) => `${m.exchange} (${m.priority})`))
    .catch(() => []);
  const txt = await r
    .resolveTxt(domain)
    .then((rows) => rows.map((parts) => parts.join('')))
    .catch(() => []);

  return { a, aaaa, mx, ns, cname, txt };
}
