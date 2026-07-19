import type { NextRequest } from 'next/server';
import { crawlSite } from '@/lib/crawl';
import { audit } from '@/lib/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  const url = typeof body.url === 'string' ? body.url.trim() : '';
  if (!url) return Response.json({ error: 'url is required' }, { status: 400 });

  if (body.authorized !== true) {
    audit('crawl', url, 'refused', 'missing authorization attestation');
    return Response.json(
      { error: 'authorization attestation required — set "authorized": true to confirm you are permitted to crawl this target' },
      { status: 403 },
    );
  }

  const depth = typeof body.depth === 'number' ? body.depth : 1;
  const limit = typeof body.limit === 'number' ? body.limit : 10;
  const sameOrigin = body.sameOrigin !== false;

  const result = await crawlSite(url, { depth, limit, sameOrigin });
  audit('crawl', url, 'ok', `${result.visited} pages, ${result.skipped.length} skipped`);
  return Response.json({ result, ts: Date.now() });
}
