// Typed stub data for every section. Deterministic (fixed timestamps, computed
// hash chain) so the shell renders identically on server and client.
import { fnv1a } from './format';
import type {
  Operation,
  ActivityEvent,
  Product,
  Campaign,
  Channel,
  Customer,
  Entitlement,
  Signal,
  EvidenceRecord,
  Service,
  FeatureFlag,
} from './types';

export const OPERATIONS: Operation[] = [
  { id: 'OP-4192', name: 'Perimeter watch — EU-West', phase: 'Steady state', status: 'active', owner: 'F. Van Laarhoven', region: 'eu-west', updated: '2026-07-19T08:40:00Z' },
  { id: 'OP-4188', name: 'Feed reconciliation', phase: 'Verifying', status: 'active', owner: 'ops-svc', region: 'global', updated: '2026-07-19T08:12:00Z' },
  { id: 'OP-4171', name: 'Entitlement drift sweep', phase: 'Remediating', status: 'degraded', owner: 'A. Mensah', region: 'us-east', updated: '2026-07-19T07:55:00Z' },
  { id: 'OP-4160', name: 'Quarterly evidence seal', phase: 'Sealed', status: 'sealed', owner: 'compliance', region: 'global', updated: '2026-07-18T22:00:00Z' },
  { id: 'OP-4143', name: 'Channel failover drill', phase: 'Scheduled', status: 'pending', owner: 'sre', region: 'ap-south', updated: '2026-07-18T16:30:00Z' },
];

export const ACTIVITY: ActivityEvent[] = [
  { id: 'a1', ts: '2026-07-19T08:41:12Z', actor: 'ops-svc', action: 'sealed evidence block', target: 'EV-2231', kind: 'ok' },
  { id: 'a2', ts: '2026-07-19T08:39:04Z', actor: 'F. Van Laarhoven', action: 'acknowledged signal', target: 'SIG-771', kind: 'info' },
  { id: 'a3', ts: '2026-07-19T08:33:47Z', actor: 'entitlement-svc', action: 'flagged over-limit', target: 'ENT-0442', kind: 'warn' },
  { id: 'a4', ts: '2026-07-19T08:20:15Z', actor: 'channel-svc', action: 'channel degraded', target: 'CH-partner-api', kind: 'bad' },
  { id: 'a5', ts: '2026-07-19T08:02:59Z', actor: 'A. Mensah', action: 'promoted product', target: 'PRD-globe 1.4.0', kind: 'ok' },
  { id: 'a6', ts: '2026-07-19T07:48:31Z', actor: 'ops-svc', action: 'reconciled feed', target: 'aircraft/opensky', kind: 'info' },
];

export const PRODUCTS: Product[] = [
  { id: 'PRD-globe', name: 'Geospatial Globe', version: '1.4.0', tier: 'Core', status: 'active', entitlements: 38 },
  { id: 'PRD-intel', name: 'Intelligence Feed', version: '0.9.2', tier: 'Add-on', status: 'active', entitlements: 21 },
  { id: 'PRD-evidence', name: 'Evidence Ledger', version: '2.1.0', tier: 'Core', status: 'active', entitlements: 27 },
  { id: 'PRD-recon', name: 'Recon Toolkit', version: '0.3.0', tier: 'Restricted', status: 'draft', entitlements: 0 },
  { id: 'PRD-report', name: 'Reporting Suite', version: '1.1.4', tier: 'Add-on', status: 'paused', entitlements: 9 },
];

export const CAMPAIGNS: Campaign[] = [
  { id: 'CMP-19', name: 'Q3 design-partner onboarding', status: 'active', owner: 'growth', channel: 'Direct', start: '2026-07-01', end: '2026-09-30', progress: 62 },
  { id: 'CMP-18', name: 'Evidence Ledger GA launch', status: 'active', owner: 'product', channel: 'Web', start: '2026-06-15', end: '2026-08-01', progress: 78 },
  { id: 'CMP-16', name: 'Partner API beta', status: 'paused', owner: 'bizdev', channel: 'Partner', start: '2026-05-01', end: '2026-07-31', progress: 40 },
  { id: 'CMP-14', name: 'Renewal nudge — expiring seats', status: 'active', owner: 'success', channel: 'Email', start: '2026-07-10', end: '2026-07-25', progress: 55 },
  { id: 'CMP-11', name: 'Spring pilot recap', status: 'draft', owner: 'growth', channel: 'Web', start: '2026-08-05', end: '2026-08-20', progress: 0 },
];

export const CHANNELS: Channel[] = [
  { id: 'CH-web', name: 'Web app', kind: 'First-party', status: 'healthy', throughput: '1.2k req/min', lastSeen: '2026-07-19T08:41:00Z' },
  { id: 'CH-api', name: 'Public API', kind: 'First-party', status: 'healthy', throughput: '840 req/min', lastSeen: '2026-07-19T08:41:00Z' },
  { id: 'CH-partner-api', name: 'Partner API', kind: 'Partner', status: 'degraded', throughput: '95 req/min', lastSeen: '2026-07-19T08:20:00Z' },
  { id: 'CH-email', name: 'Email / notifications', kind: 'Outbound', status: 'healthy', throughput: '30 msg/min', lastSeen: '2026-07-19T08:38:00Z' },
  { id: 'CH-marketplace', name: 'Marketplace listing', kind: 'Third-party', status: 'paused', throughput: '—', lastSeen: '2026-07-15T11:00:00Z' },
];

export const CUSTOMERS: Customer[] = [
  { id: 'CUS-201', name: 'Meridian Logistics', plan: 'Enterprise', status: 'active', seats: 48, region: 'eu-west', since: '2025-11-02' },
  { id: 'CUS-198', name: 'Harbor Authority', plan: 'Enterprise', status: 'active', seats: 32, region: 'eu-north', since: '2025-09-18' },
  { id: 'CUS-190', name: 'Northwind Analytics', plan: 'Team', status: 'active', seats: 12, region: 'us-east', since: '2026-01-22' },
  { id: 'CUS-183', name: 'Apex Air', plan: 'Team', status: 'suspended', seats: 8, region: 'us-west', since: '2025-07-30' },
  { id: 'CUS-176', name: 'Coastal Watch Group', plan: 'Pilot', status: 'pending', seats: 4, region: 'ap-south', since: '2026-07-05' },
];

export const ENTITLEMENTS: Entitlement[] = [
  { id: 'ENT-0451', customer: 'Meridian Logistics', product: 'Geospatial Globe', scope: 'org', used: 41, limit: 50, status: 'active', expires: '2026-11-02' },
  { id: 'ENT-0448', customer: 'Meridian Logistics', product: 'Evidence Ledger', scope: 'org', used: 22, limit: 50, status: 'active', expires: '2026-11-02' },
  { id: 'ENT-0442', customer: 'Harbor Authority', product: 'Intelligence Feed', scope: 'team', used: 33, limit: 30, status: 'active', expires: '2026-09-18' },
  { id: 'ENT-0431', customer: 'Northwind Analytics', product: 'Geospatial Globe', scope: 'team', used: 9, limit: 15, status: 'active', expires: '2026-07-24' },
  { id: 'ENT-0419', customer: 'Apex Air', product: 'Reporting Suite', scope: 'org', used: 3, limit: 20, status: 'expired', expires: '2026-06-30' },
];

export const SIGNALS: Signal[] = [
  { id: 'SIG-771', title: 'Entitlement usage exceeds grant', category: 'entitlement', severity: 'high', confidence: 0.92, ts: '2026-07-19T08:33:00Z' },
  { id: 'SIG-769', title: 'Partner channel latency spike', category: 'channel', severity: 'medium', confidence: 0.81, ts: '2026-07-19T08:19:00Z' },
  { id: 'SIG-764', title: 'Anomalous login velocity — CUS-183', category: 'security', severity: 'critical', confidence: 0.88, ts: '2026-07-19T07:41:00Z' },
  { id: 'SIG-758', title: 'Feed staleness above threshold', category: 'operations', severity: 'medium', confidence: 0.74, ts: '2026-07-19T06:58:00Z' },
  { id: 'SIG-751', title: 'Renewal risk — 3 seats lapsing', category: 'commerce', severity: 'low', confidence: 0.69, ts: '2026-07-19T05:30:00Z' },
];

export const SERVICES: Service[] = [
  { name: 'control-plane', status: 'healthy', version: '2.4.1', uptime: '18d 04h' },
  { name: 'feed-ingest', status: 'healthy', version: '1.9.0', uptime: '6d 11h' },
  { name: 'entitlement-svc', status: 'degraded', version: '1.2.3', uptime: '2d 09h' },
  { name: 'evidence-ledger', status: 'healthy', version: '2.1.0', uptime: '18d 04h' },
  { name: 'intelligence-svc', status: 'healthy', version: '0.9.2', uptime: '3d 22h' },
];

export const FLAGS: FeatureFlag[] = [
  { key: 'evidence.strict_chain', enabled: true, scope: 'global' },
  { key: 'entitlements.hard_limit', enabled: false, scope: 'global' },
  { key: 'channels.partner_api', enabled: true, scope: 'partner' },
  { key: 'intelligence.auto_ack', enabled: false, scope: 'global' },
  { key: 'products.recon_toolkit', enabled: false, scope: 'restricted' },
];

export const BUILD = {
  version: '0.1.0',
  commit: 'local',
  env: 'self-hosted',
  builtAt: '2026-07-19T08:00:00Z',
};

// ---- Evidence: build a tamper-evident hash chain from raw records -----------
const RAW_EVIDENCE: Array<Omit<EvidenceRecord, 'seq' | 'prev' | 'hash'>> = [
  { ts: '2026-07-18T22:00:00Z', actor: 'compliance', action: 'seal.block', target: 'quarter/2026-Q2' },
  { ts: '2026-07-19T06:58:12Z', actor: 'ops-svc', action: 'signal.raise', target: 'SIG-758' },
  { ts: '2026-07-19T07:41:03Z', actor: 'intelligence-svc', action: 'signal.raise', target: 'SIG-764' },
  { ts: '2026-07-19T08:02:59Z', actor: 'A. Mensah', action: 'product.promote', target: 'PRD-globe@1.4.0' },
  { ts: '2026-07-19T08:33:47Z', actor: 'entitlement-svc', action: 'entitlement.flag', target: 'ENT-0442' },
  { ts: '2026-07-19T08:41:12Z', actor: 'ops-svc', action: 'seal.block', target: 'EV-2231' },
];

export const EVIDENCE: EvidenceRecord[] = (() => {
  let prev = '00000000';
  const out: EvidenceRecord[] = [];
  RAW_EVIDENCE.forEach((r, i) => {
    const hash = fnv1a(`${i}|${r.ts}|${r.actor}|${r.action}|${r.target}|${prev}`);
    out.push({ seq: i + 1, ...r, prev, hash });
    prev = hash;
  });
  return out;
})();

// Recompute the chain and confirm every link — the shell asserts its own integrity.
export function verifyEvidence(records: EvidenceRecord[]): boolean {
  let prev = '00000000';
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const expected = fnv1a(`${i}|${r.ts}|${r.actor}|${r.action}|${r.target}|${prev}`);
    if (r.prev !== prev || r.hash !== expected) return false;
    prev = r.hash;
  }
  return true;
}
