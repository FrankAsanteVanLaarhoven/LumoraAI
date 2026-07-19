// OSINT recon over public sources only: DNS, RDAP (registry), certificate
// transparency. All read-only and passive — no port scanning, no brute forcing.

export interface DnsRecords {
  a: string[];
  aaaa: string[];
  mx: string[];
  ns: string[];
  txt: string[];
  cname: string[];
}

export interface RdapInfo {
  handle?: string;
  registrar?: string;
  status: string[];
  created?: string;
  updated?: string;
  expires?: string;
  nameservers: string[];
  error?: string;
}

export interface ReconSource {
  name: string;
  ok: boolean;
  detail?: string;
}

export interface ReconResult {
  domain: string;
  dns: DnsRecords;
  rdap: RdapInfo;
  subdomains: string[];
  fetchedAt: string;
  sources: ReconSource[];
}
