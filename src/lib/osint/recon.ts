import { resolveDns } from './dns';
import { lookupRdap } from './rdap';
import { certSubdomains } from './certs';
import type { ReconResult } from './types';

const MAX_SUBDOMAINS = 500;

// Passive domain recon: DNS + RDAP + certificate-transparency subdomains, in
// parallel, each failing independently.
export async function reconDomain(domain: string): Promise<ReconResult> {
  const fetchedAt = new Date().toISOString();
  const [dns, rdap, certs] = await Promise.all([
    resolveDns(domain),
    lookupRdap(domain),
    certSubdomains(domain),
  ]);

  return {
    domain,
    dns,
    rdap,
    subdomains: certs.subdomains.slice(0, MAX_SUBDOMAINS),
    fetchedAt,
    sources: [
      { name: 'DNS', ok: dns.a.length + dns.aaaa.length + dns.ns.length > 0 },
      { name: 'RDAP', ok: !rdap.error, detail: rdap.error },
      { name: 'CT logs', ok: certs.ok, detail: certs.detail },
    ],
  };
}
