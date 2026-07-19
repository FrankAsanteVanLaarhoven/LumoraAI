import { SectionHeader, Tiles, StatTile, Panel, DataTable, SeverityBadge, Bar, Mono } from '@/components/ui';
import type { Column } from '@/components/ui';
import { SIGNALS } from '@/lib/data';
import type { Signal } from '@/lib/types';

export default function IntelligencePage() {
  const critical = SIGNALS.filter((s) => s.severity === 'critical').length;
  const high = SIGNALS.filter((s) => s.severity === 'high').length;
  const avgConf = Math.round((SIGNALS.reduce((s, x) => s + x.confidence, 0) / SIGNALS.length) * 100);

  const columns: Column<Signal>[] = [
    { header: 'ID', width: '92px', render: (s) => <Mono>{s.id}</Mono> },
    { header: 'Signal', render: (s) => <span style={{ fontWeight: 600 }}>{s.title}</span> },
    { header: 'Category', render: (s) => <span className="muted-txt">{s.category}</span> },
    { header: 'Severity', render: (s) => <SeverityBadge severity={s.severity} /> },
    {
      header: 'Confidence',
      width: '160px',
      render: (s) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bar value={s.confidence * 100} tone="accent" />
          <span className="num" style={{ minWidth: 38, textAlign: 'right' }}>{Math.round(s.confidence * 100)}%</span>
        </div>
      ),
    },
    { header: 'Raised', render: (s) => <Mono>{s.ts.slice(0, 16).replace('T', ' ')}</Mono> },
  ];

  return (
    <>
      <SectionHeader
        title="Intelligence"
        sub="Signals, insights, and confidence-scored findings."
        actions={<button className="btn">Acknowledge all</button>}
      />
      <Tiles>
        <StatTile label="Open signals" value={SIGNALS.length} />
        <StatTile label="Critical" value={critical} accent={critical ? 'bad' : 'ok'} />
        <StatTile label="High" value={high} accent={high ? 'warn' : 'ok'} />
        <StatTile label="Avg. confidence" value={`${avgConf}%`} accent="accent" />
      </Tiles>
      <Panel title="Signal feed">
        <DataTable columns={columns} rows={SIGNALS} />
      </Panel>
    </>
  );
}
