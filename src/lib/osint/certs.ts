// Passive subdomain discovery from public Certificate Transparency logs (crt.sh).
// CT logs are a public, append-only record of issued TLS certificates.
interface CrtRow {
  name_value?: string;
}

export async function certSubdomains(
  domain: string,
): Promise<{ subdomains: string[]; ok: boolean; detail?: string }> {
  try {
    const res = await fetch(`https://crt.sh/?q=${encodeURIComponent('%.' + domain)}&output=json`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return { subdomains: [], ok: false, detail: `HTTP ${res.status}` };

    const rows = (await res.json()) as CrtRow[];
    const set = new Set<string>();
    for (const row of rows) {
      for (const raw of String(row.name_value ?? '').split('\n')) {
        const name = raw.trim().toLowerCase().replace(/^\*\./, '');
        if (name && (name === domain || name.endsWith('.' + domain))) set.add(name);
      }
    }
    return { subdomains: [...set].sort(), ok: true };
  } catch (e) {
    return { subdomains: [], ok: false, detail: e instanceof Error ? e.message : 'crt.sh lookup failed' };
  }
}
