// Append-only, in-memory audit log. Every fetch the tool performs is recorded
// (target, action, outcome). Persisted on globalThis so it survives module reloads
// within a running server. For durable retention, back this with a database.
import type { AuditEntry } from './types';

const g = globalThis as unknown as { __lumoraAudit?: AuditEntry[]; __lumoraSeq?: number };

function store(): AuditEntry[] {
  return (g.__lumoraAudit ??= []);
}

export function audit(action: string, target: string, outcome: string, detail?: string): AuditEntry {
  g.__lumoraSeq = (g.__lumoraSeq ?? 0) + 1;
  const entry: AuditEntry = {
    id: `a${Date.now().toString(36)}-${g.__lumoraSeq.toString(36)}`,
    ts: new Date().toISOString(),
    action,
    target,
    outcome,
    detail,
  };
  const s = store();
  s.unshift(entry);
  if (s.length > 500) s.length = 500;
  return entry;
}

export function recentAudit(n = 100): AuditEntry[] {
  return store().slice(0, n);
}
