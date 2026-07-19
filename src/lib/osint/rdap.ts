import type { RdapInfo } from './types';

// RDAP is the modern, structured replacement for WHOIS. rdap.org bootstraps to
// the authoritative registry server. All data returned is public registration data.
interface RdapJson {
  handle?: string;
  status?: string[];
  events?: { eventAction?: string; eventDate?: string }[];
  entities?: { roles?: string[]; vcardArray?: unknown[] }[];
  nameservers?: { ldhName?: string }[];
}

function registrarName(entities: RdapJson['entities']): string | undefined {
  const reg = entities?.find((e) => e.roles?.includes('registrar'));
  const vcard = reg?.vcardArray;
  if (!Array.isArray(vcard) || vcard.length < 2) return undefined;
  const props = vcard[1];
  if (!Array.isArray(props)) return undefined;
  for (const p of props) {
    if (Array.isArray(p) && p[0] === 'fn' && typeof p[3] === 'string') return p[3];
  }
  return undefined;
}

export async function lookupRdap(domain: string): Promise<RdapInfo> {
  try {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      headers: { accept: 'application/rdap+json' },
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { status: [], nameservers: [], error: `HTTP ${res.status}` };
    const j = (await res.json()) as RdapJson;
    const eventDate = (action: string) => j.events?.find((e) => e.eventAction === action)?.eventDate;
    return {
      handle: j.handle,
      registrar: registrarName(j.entities),
      status: j.status ?? [],
      created: eventDate('registration'),
      updated: eventDate('last changed'),
      expires: eventDate('expiration'),
      nameservers: (j.nameservers ?? [])
        .map((n) => (n.ldhName ?? '').toLowerCase())
        .filter(Boolean),
    };
  } catch (e) {
    return { status: [], nameservers: [], error: e instanceof Error ? e.message : 'RDAP lookup failed' };
  }
}
