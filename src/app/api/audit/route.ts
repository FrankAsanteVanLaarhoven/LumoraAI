import type { NextRequest } from 'next/server';
import { recentAudit } from '@/lib/audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const n = Number(req.nextUrl.searchParams.get('n')) || 100;
  const entries = recentAudit(Math.min(Math.max(1, n), 500));
  return Response.json({ entries, count: entries.length, ts: Date.now() });
}
