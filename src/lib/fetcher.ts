// Safe HTTP fetch: SSRF-guarded on every redirect hop, honest User-Agent, hard
// timeout, and a response-size cap. No proxy rotation, no fingerprint spoofing.
import { assertPublicUrl } from './ssrf';
import { USER_AGENT } from './ua';

const MAX_BYTES = 3_000_000;
const TIMEOUT_MS = 15_000;
const MAX_HOPS = 5;

export interface FetchResult {
  status: number;
  ok: boolean;
  finalUrl: string;
  contentType: string;
  body: string;
  bytes: number;
  error?: string;
}

function fail(url: string, error: string): FetchResult {
  return { status: 0, ok: false, finalUrl: url, contentType: '', body: '', bytes: 0, error };
}

export async function safeFetch(url: string): Promise<FetchResult> {
  let current = url;

  for (let hop = 0; hop <= MAX_HOPS; hop++) {
    const guard = await assertPublicUrl(current);
    if (!guard.ok) return fail(current, guard.reason ?? 'blocked URL');

    let res: Response;
    try {
      res = await fetch(current, {
        headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml,text/plain' },
        redirect: 'manual',
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (e) {
      return fail(current, e instanceof Error ? e.message : 'fetch failed');
    }

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location');
      if (!loc) return fail(current, `redirect without location (HTTP ${res.status})`);
      try {
        current = new URL(loc, current).toString();
      } catch {
        return fail(current, 'invalid redirect target');
      }
      continue;
    }

    const contentType = res.headers.get('content-type') ?? '';
    const reader = res.body?.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;
    if (reader) {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.length;
        if (received > MAX_BYTES) {
          await reader.cancel();
          break;
        }
        chunks.push(value);
      }
    }
    const buf = new Uint8Array(received > MAX_BYTES ? MAX_BYTES : received);
    let offset = 0;
    for (const c of chunks) {
      if (offset + c.length > buf.length) {
        buf.set(c.subarray(0, buf.length - offset), offset);
        break;
      }
      buf.set(c, offset);
      offset += c.length;
    }
    const body = new TextDecoder('utf-8', { fatal: false }).decode(buf);
    return { status: res.status, ok: res.status >= 200 && res.status < 300, finalUrl: res.url || current, contentType, body, bytes: received };
  }

  return fail(current, 'too many redirects');
}
