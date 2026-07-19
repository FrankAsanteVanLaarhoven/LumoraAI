// Presentational primitives shared across sections. Server components (no hooks),
// so pages can render them directly.
import type { ReactNode } from 'react';
import { cx, pct } from '@/lib/format';
import type { Status } from '@/lib/types';

export function SectionHeader({
  title,
  sub,
  actions,
}: {
  title: string;
  sub?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="sec-head">
      <div>
        <h1 className="sec-title">{title}</h1>
        {sub && <p className="sec-sub">{sub}</p>}
      </div>
      {actions && <div className="sec-actions">{actions}</div>}
    </header>
  );
}

export function Tiles({ children }: { children: ReactNode }) {
  return <div className="tiles">{children}</div>;
}

export function StatTile({
  label,
  value,
  hint,
  accent = 'accent',
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: 'accent' | 'ok' | 'warn' | 'bad';
}) {
  return (
    <div className="tile">
      <div className="tile-label">{label}</div>
      <div className={cx('tile-value', `t-${accent}`)}>{value}</div>
      {hint && <div className="tile-hint">{hint}</div>}
    </div>
  );
}

export function Panel({
  title,
  actions,
  children,
}: {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="panel">
      {(title || actions) && (
        <div className="panel-head">
          {title && <h2 className="panel-title">{title}</h2>}
          {actions && <div className="panel-actions">{actions}</div>}
        </div>
      )}
      <div className="panel-body">{children}</div>
    </section>
  );
}

const STATUS_VARIANT: Record<Status, string> = {
  active: 'ok',
  healthy: 'ok',
  verified: 'ok',
  sealed: 'ok',
  degraded: 'warn',
  paused: 'warn',
  pending: 'warn',
  draft: 'muted',
  expired: 'bad',
  down: 'bad',
  suspended: 'bad',
};

export function StatusBadge({ status }: { status: Status }) {
  return <span className={cx('badge', STATUS_VARIANT[status] ?? 'info')}>{status}</span>;
}

export function SeverityBadge({ severity }: { severity: 'low' | 'medium' | 'high' | 'critical' }) {
  const v = { low: 'info', medium: 'warn', high: 'bad', critical: 'bad' }[severity];
  return <span className={cx('badge', v)}>{severity}</span>;
}

export function Bar({ value, max = 100, tone }: { value: number; max?: number; tone?: 'accent' | 'ok' | 'warn' | 'bad' }) {
  const p = pct(value, max);
  const auto: 'ok' | 'warn' | 'bad' = value > max ? 'bad' : p >= 80 ? 'warn' : 'ok';
  return (
    <div className="bar" title={`${value} / ${max}`}>
      <span className={cx('bar-fill', `bg-${tone ?? auto}`)} style={{ width: `${Math.min(100, p)}%` }} />
    </div>
  );
}

export interface Column<T> {
  header: string;
  align?: 'left' | 'right';
  width?: string;
  render: (row: T) => ReactNode;
}

export function DataTable<T>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={{ textAlign: c.align ?? 'left', width: c.width }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {columns.map((c, ci) => (
                <td key={ci} style={{ textAlign: c.align ?? 'left' }}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return <span className="mono">{children}</span>;
}
