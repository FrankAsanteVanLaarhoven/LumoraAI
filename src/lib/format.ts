// Small pure helpers shared across the console.

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function fmtNum(n: number): string {
  return n.toLocaleString('en-US');
}

export function fmtDate(iso: string): string {
  return iso.slice(0, 10);
}

export function pct(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, (value / max) * 100));
}

// FNV-1a 32-bit — a tiny deterministic hash used to build the demo evidence
// chain. Deterministic so the chain verifies identically on every render.
export function fnv1a(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function shortHash(h: string): string {
  return h.length > 12 ? `${h.slice(0, 6)}…${h.slice(-4)}` : h;
}
