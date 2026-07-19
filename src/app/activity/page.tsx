'use client';

import { useEffect, useState } from 'react';
import type { AuditEntry } from '@/lib/types';

const VARIANT: Record<string, string> = { ok: 'ok', refused: 'warn', blocked: 'bad' };

export default function ActivityPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    try {
      const res = await fetch('/api/audit?n=200', { cache: 'no-store' });
      const json = await res.json();
      setEntries(json.entries ?? []);
    } catch {
      /* leave previous */
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="wb">
      <h1 className="wb-title">Activity</h1>
      <p className="wb-tag">Append-only audit log — every request, persisted to disk. Auto-refreshes every 5s.</p>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Audit log ({entries.length})</h2>
          <div className="panel-actions">
            <button className="btn" onClick={load}>
              Refresh
            </button>
          </div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Target</th>
                <th>Outcome</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="mono" style={{ whiteSpace: 'nowrap' }}>
                    {e.ts.slice(0, 19).replace('T', ' ')}
                  </td>
                  <td className="mono">{e.action}</td>
                  <td className="mono" style={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.target}
                  </td>
                  <td>
                    <span className={`badge ${VARIANT[e.outcome] ?? 'info'}`}>{e.outcome}</span>
                  </td>
                  <td className="muted-txt" style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.detail ?? '—'}
                  </td>
                </tr>
              ))}
              {loaded && entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted-txt" style={{ padding: 16 }}>
                    No activity yet — run something from the Workbench.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
