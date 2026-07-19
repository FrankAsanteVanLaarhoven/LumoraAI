// SSRF protection: refuse to fetch anything that resolves to a private,
// loopback, link-local, or otherwise non-public address. Server-side crawlers
// that skip this can be tricked into hitting internal services / cloud metadata.
import { lookup } from 'node:dns/promises';
import net from 'node:net';

function v4ToInt(ip: string): number {
  return ip.split('.').reduce((acc, o) => ((acc << 8) + Number(o)) >>> 0, 0);
}

function inV4(ip: string, cidr: string, bits: number): boolean {
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return ((v4ToInt(ip) & mask) >>> 0) === ((v4ToInt(cidr) & mask) >>> 0);
}

// Non-public IPv4 ranges (RFC 1918, loopback, link-local, CGNAT, reserved, multicast).
const V4_BLOCKS: [string, number][] = [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
];

export function isPrivateV4(ip: string): boolean {
  return V4_BLOCKS.some(([cidr, bits]) => inV4(ip, cidr, bits));
}

export function isPrivateV6(ip: string): boolean {
  const a = ip.toLowerCase();
  if (a === '::1' || a === '::') return true;
  if (a.startsWith('fe80') || a.startsWith('fc') || a.startsWith('fd')) return true;
  const mapped = a.match(/::ffff:(\d+\.\d+\.\d+\.\d+)/);
  if (mapped) return isPrivateV4(mapped[1]);
  return false;
}

export function isPrivateAddr(ip: string): boolean {
  if (net.isIPv4(ip)) return isPrivateV4(ip);
  if (net.isIPv6(ip)) return isPrivateV6(ip);
  return true; // unknown → treat as unsafe
}

export interface UrlGuard {
  ok: boolean;
  host: string;
  reason?: string;
}

export async function assertPublicUrl(raw: string): Promise<UrlGuard> {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return { ok: false, host: '', reason: 'invalid URL' };
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    return { ok: false, host: u.hostname, reason: 'only http/https is allowed' };
  }
  const host = u.hostname;
  const lower = host.toLowerCase();
  if (
    lower === 'localhost' ||
    lower.endsWith('.localhost') ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return { ok: false, host, reason: 'internal/loopback host blocked' };
  }
  if (net.isIP(host)) {
    return isPrivateAddr(host)
      ? { ok: false, host, reason: 'private/reserved address blocked' }
      : { ok: true, host };
  }
  try {
    const addrs = await lookup(host, { all: true });
    if (!addrs.length) return { ok: false, host, reason: 'DNS returned no addresses' };
    for (const a of addrs) {
      if (isPrivateAddr(a.address)) return { ok: false, host, reason: 'host resolves to a private address' };
    }
    return { ok: true, host };
  } catch {
    return { ok: false, host, reason: 'DNS resolution failed' };
  }
}
