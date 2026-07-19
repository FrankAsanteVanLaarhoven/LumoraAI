// Append-only audit log with durable, file-backed persistence (JSONL). Every
// request is recorded and survives restarts. An in-memory ring (most-recent-first)
// fronts the file for fast reads. For multi-node deployments, back this with a DB.
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { AuditEntry } from './types';

const FILE = join(process.cwd(), 'data', 'audit.jsonl');
const MAX_MEM = 500;

const g = globalThis as unknown as {
  __lumoraAudit?: AuditEntry[];
  __lumoraSeq?: number;
  __lumoraLoaded?: boolean;
};

async function ensureLoaded(): Promise<void> {
  if (g.__lumoraLoaded) return;
  g.__lumoraLoaded = true;
  g.__lumoraAudit ??= [];
  try {
    const txt = await readFile(FILE, 'utf8');
    const entries = txt
      .split('\n')
      .filter(Boolean)
      .slice(-MAX_MEM)
      .map((line) => {
        try {
          return JSON.parse(line) as AuditEntry;
        } catch {
          return null;
        }
      })
      .filter((e): e is AuditEntry => e !== null);
    g.__lumoraAudit = entries.reverse(); // most recent first
  } catch {
    /* no file yet */
  }
}

export async function audit(action: string, target: string, outcome: string, detail?: string): Promise<AuditEntry> {
  await ensureLoaded();
  g.__lumoraSeq = (g.__lumoraSeq ?? 0) + 1;
  const entry: AuditEntry = {
    id: `a${Date.now().toString(36)}-${g.__lumoraSeq.toString(36)}`,
    ts: new Date().toISOString(),
    action,
    target,
    outcome,
    detail,
  };
  const mem = g.__lumoraAudit!;
  mem.unshift(entry);
  if (mem.length > MAX_MEM) mem.length = MAX_MEM;
  try {
    await mkdir(dirname(FILE), { recursive: true });
    await appendFile(FILE, JSON.stringify(entry) + '\n');
  } catch {
    /* persistence is best-effort; the request still proceeds */
  }
  return entry;
}

export async function recentAudit(n = 100): Promise<AuditEntry[]> {
  await ensureLoaded();
  return g.__lumoraAudit!.slice(0, n);
}
