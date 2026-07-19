// Polite per-host rate limiting. Honours a site's Crawl-delay (capped) and never
// goes below a courteous floor. This is the opposite of "go as fast as possible
// without getting blocked".
const lastAt = new Map<string, number>();

const FLOOR_MS = 1000; // never hit the same host more than once per second
const CEIL_MS = 30_000; // ignore absurd crawl-delays

export async function politeWait(host: string, crawlDelaySec: number | null): Promise<void> {
  const delay = Math.min(CEIL_MS, Math.max(FLOOR_MS, (crawlDelaySec ?? 0) * 1000));
  const prev = lastAt.get(host) ?? 0;
  const now = Date.now();
  const wait = Math.max(0, prev + delay - now);
  lastAt.set(host, now + wait);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
}
