import type { NextRequest } from 'next/server';
import { normalizeDomain } from '@/lib/osint/domain';
import { reconDomain } from '@/lib/osint/recon';
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

  const domain = normalizeDomain(typeof body.domain === 'string' ? body.domain : '');
  if (!domain) return Response.json({ error: 'a valid domain is required (e.g. example.com)' }, { status: 400 });

  if (body.authorized !== true) {
    audit('osint', domain, 'refused', 'missing authorization attestation');
    return Response.json(
      { error: 'authorization attestation required — set "authorized": true to confirm you may profile this domain' },
      { status: 403 },
    );
  }

  const recon = await reconDomain(domain);
  audit('osint', domain, 'ok', `${recon.subdomains.length} subdomains, ${recon.dns.a.length} A records`);
  return Response.json({ recon, ts: Date.now() });
}
