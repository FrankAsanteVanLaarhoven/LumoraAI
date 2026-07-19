// Normalise and validate a domain input. Accepts a pasted URL (extracts the
// host) and a leading wildcard; rejects IPs, localhost, and malformed names.
export function normalizeDomain(input: string): string | null {
  let d = input.trim().toLowerCase();
  if (!d) return null;
  if (d.includes('://')) {
    try {
      d = new URL(d).hostname;
    } catch {
      return null;
    }
  }
  d = d.replace(/^\*\./, '').replace(/\/.*$/, '').replace(/:\d+$/, '');
  if (!d || d === 'localhost' || /\s/.test(d)) return null;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(d)) return null; // bare IPv4
  if (!/^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(d)) return null;
  return d;
}
