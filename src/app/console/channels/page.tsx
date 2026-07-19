import { SectionHeader, Tiles, StatTile, Panel, DataTable, StatusBadge, Mono } from '@/components/ui';
import type { Column } from '@/components/ui';
import { CHANNELS } from '@/lib/data';
import type { Channel } from '@/lib/types';

export default function ChannelsPage() {
  const healthy = CHANNELS.filter((c) => c.status === 'healthy').length;
  const degraded = CHANNELS.filter((c) => c.status === 'degraded' || c.status === 'down').length;
  const paused = CHANNELS.filter((c) => c.status === 'paused').length;

  const columns: Column<Channel>[] = [
    { header: 'ID', width: '150px', render: (c) => <Mono>{c.id}</Mono> },
    { header: 'Channel', render: (c) => <span style={{ fontWeight: 600 }}>{c.name}</span> },
    { header: 'Kind', render: (c) => c.kind },
    { header: 'Throughput', align: 'right', render: (c) => <span className="num">{c.throughput}</span> },
    { header: 'Last seen', render: (c) => <Mono>{c.lastSeen.slice(0, 16).replace('T', ' ')}</Mono> },
    { header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
  ];

  return (
    <>
      <SectionHeader title="Channels" sub="Distribution and delivery channels and their health." />
      <Tiles>
        <StatTile label="Channels" value={CHANNELS.length} />
        <StatTile label="Healthy" value={healthy} accent="ok" />
        <StatTile label="Degraded" value={degraded} accent={degraded ? 'bad' : 'ok'} />
        <StatTile label="Paused" value={paused} accent="warn" />
      </Tiles>
      <Panel title="Channel health">
        <DataTable columns={columns} rows={CHANNELS} />
      </Panel>
    </>
  );
}
