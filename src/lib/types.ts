// Domain types for the console. All data is stubbed (see data.ts) — this is a
// shell that defines the information architecture, not a live backend.

export type Status =
  | 'active'
  | 'healthy'
  | 'degraded'
  | 'down'
  | 'paused'
  | 'draft'
  | 'expired'
  | 'pending'
  | 'suspended'
  | 'sealed'
  | 'verified';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Operation {
  id: string;
  name: string;
  phase: string;
  status: Status;
  owner: string;
  region: string;
  updated: string;
}

export interface ActivityEvent {
  id: string;
  ts: string;
  actor: string;
  action: string;
  target: string;
  kind: 'info' | 'ok' | 'warn' | 'bad';
}

export interface Product {
  id: string;
  name: string;
  version: string;
  tier: string;
  status: Status;
  entitlements: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: Status;
  owner: string;
  channel: string;
  start: string;
  end: string;
  progress: number;
}

export interface Channel {
  id: string;
  name: string;
  kind: string;
  status: Status;
  throughput: string;
  lastSeen: string;
}

export interface Customer {
  id: string;
  name: string;
  plan: string;
  status: Status;
  seats: number;
  region: string;
  since: string;
}

export interface Entitlement {
  id: string;
  customer: string;
  product: string;
  scope: string;
  used: number;
  limit: number;
  status: Status;
  expires: string;
}

export interface Signal {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  confidence: number;
  ts: string;
}

export interface EvidenceRecord {
  seq: number;
  ts: string;
  actor: string;
  action: string;
  target: string;
  prev: string;
  hash: string;
}

export interface Service {
  name: string;
  status: Status;
  version: string;
  uptime: string;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  scope: string;
}
