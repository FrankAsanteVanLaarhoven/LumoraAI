import { SectionHeader, Tiles, StatTile, Panel, DataTable, StatusBadge, Mono } from '@/components/ui';
import type { Column } from '@/components/ui';
import { OPERATIONS, ACTIVITY, CHANNELS, EVIDENCE } from '@/lib/data';
import type { Operation } from '@/lib/types';

export default function OperationsPage() {
  const active = OPERATIONS.filter((o) => o.status === 'active').length;
  const incidents = OPERATIONS.filter((o) => o.status === 'degraded' || o.status === 'down').length;
  const healthy = CHANNELS.filter((c) => c.status === 'healthy').length;

  const columns: Column<Operation>[] = [
    { header: 'ID', width: '96px', render: (o) => <Mono>{o.id}</Mono> },
    { header: 'Operation', render: (o) => <span style={{ fontWeight: 600 }}>{o.name}</span> },
    { header: 'Phase', render: (o) => <span className="muted-txt">{o.phase}</span> },
    { header: 'Owner', render: (o) => o.owner },
    { header: 'Region', render: (o) => <Mono>{o.region}</Mono> },
    { header: 'Status', render: (o) => <StatusBadge status={o.status} /> },
  ];

  return (
    <>
      <SectionHeader
        title="Operations"
        sub="Live activity, active operations, and incidents."
        actions={<button className="btn primary">New operation</button>}
      />
      <Tiles>
        <StatTile label="Active operations" value={active} hint="running now" />
        <StatTile label="Incidents" value={incidents} hint="degraded or down" accent={incidents ? 'warn' : 'ok'} />
        <StatTile label="Channels healthy" value={`${healthy}/${CHANNELS.length}`} accent="ok" />
        <StatTile label="Evidence sealed" value={EVIDENCE.length} hint="chain links" accent="accent" />
      </Tiles>
      <div className="grid-2">
        <Panel title="Active operations">
          <DataTable columns={columns} rows={OPERATIONS} />
        </Panel>
        <Panel title="Activity stream">
          <div className="stream">
            {ACTIVITY.map((e) => (
              <div className="stream-item" key={e.id}>
                <span className={`stream-dot dot-${e.kind}`} />
                <div className="stream-body">
                  <div>
                    <b>{e.actor}</b> {e.action} <Mono>{e.target}</Mono>
                  </div>
                  <div className="stream-time">{e.ts.replace('T', ' ').replace('Z', ' UTC')}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
