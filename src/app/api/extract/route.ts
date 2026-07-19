import type { NextRequest } from 'next/server';
import { extractOne } from '@/lib/crawl';
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
    await audit('extract', url, 'refused', 'missing authorization attestation');
    return Response.json(
      { error: 'authorization attestation required — set "authorized": true to confirm you are permitted to fetch this target' },
      { status: 403 },
    );
  }

  const page = await extractOne(url, body.render === true);
  await audit('extract', page.finalUrl ?? url, page.ok ? 'ok' : 'blocked', page.error);
  return Response.json({ page, ts: Date.now() });
}
