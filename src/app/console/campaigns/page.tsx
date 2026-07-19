import { SectionHeader, Tiles, StatTile, Panel, DataTable, StatusBadge, Bar, Mono } from '@/components/ui';
import type { Column } from '@/components/ui';
import { CAMPAIGNS } from '@/lib/data';
import type { Campaign } from '@/lib/types';

export default function CampaignsPage() {
  const active = CAMPAIGNS.filter((c) => c.status === 'active').length;
  const running = CAMPAIGNS.filter((c) => c.status === 'active');
  const avg = running.length ? Math.round(running.reduce((s, c) => s + c.progress, 0) / running.length) : 0;

  const columns: Column<Campaign>[] = [
    { header: 'ID', width: '84px', render: (c) => <Mono>{c.id}</Mono> },
    { header: 'Campaign', render: (c) => <span style={{ fontWeight: 600 }}>{c.name}</span> },
    { header: 'Channel', render: (c) => c.channel },
    { header: 'Owner', render: (c) => <span className="muted-txt">{c.owner}</span> },
    { header: 'Window', render: (c) => <Mono>{c.start} → {c.end}</Mono> },
    {
      header: 'Progress',
      width: '170px',
      render: (c) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bar value={c.progress} tone="accent" />
          <span className="num" style={{ minWidth: 36, textAlign: 'right' }}>{c.progress}%</span>
        </div>
      ),
    },
    { header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
  ];

  return (
    <>
      <SectionHeader
        title="Campaigns"
        sub="Structured initiatives and their progress."
        actions={<button className="btn primary">New campaign</button>}
      />
      <Tiles>
        <StatTile label="Total" value={CAMPAIGNS.length} />
        <StatTile label="Active" value={active} accent="ok" />
        <StatTile label="Avg. progress" value={`${avg}%`} accent="accent" hint="active campaigns" />
        <StatTile label="Draft" value={CAMPAIGNS.filter((c) => c.status === 'draft').length} accent="warn" />
      </Tiles>
      <Panel title="All campaigns">
        <DataTable columns={columns} rows={CAMPAIGNS} />
      </Panel>
    </>
  );
}
