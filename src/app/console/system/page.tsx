import { SectionHeader, Tiles, StatTile, Panel, DataTable, StatusBadge, Mono } from '@/components/ui';
import type { Column } from '@/components/ui';
import { SERVICES, FLAGS, BUILD } from '@/lib/data';
import type { Service } from '@/lib/types';

export default function SystemPage() {
  const healthy = SERVICES.filter((s) => s.status === 'healthy').length;
  const degraded = SERVICES.filter((s) => s.status !== 'healthy').length;

  const columns: Column<Service>[] = [
    { header: 'Service', render: (s) => <span className="mono" style={{ fontWeight: 600 }}>{s.name}</span> },
    { header: 'Version', render: (s) => <Mono>{s.version}</Mono> },
    { header: 'Uptime', render: (s) => <span className="num">{s.uptime}</span> },
    { header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
  ];

  return (
    <>
      <SectionHeader title="System" sub="Services, configuration, and build health." />
      <Tiles>
        <StatTile label="Services" value={SERVICES.length} />
        <StatTile label="Healthy" value={healthy} accent="ok" />
        <StatTile label="Degraded" value={degraded} accent={degraded ? 'warn' : 'ok'} />
        <StatTile label="Build" value={<Mono>{BUILD.version}</Mono>} accent="accent" hint={BUILD.env} />
      </Tiles>

      <div className="grid-2">
        <Panel title="Services">
          <DataTable columns={columns} rows={SERVICES} />
        </Panel>
        <Panel title="Feature flags">
          {FLAGS.map((f) => (
            <div className="flag-row" key={f.key}>
              <span className={`toggle ${f.enabled ? 'on' : ''}`} aria-hidden />
              <span className="flag-key">{f.key}</span>
              <span className="flag-scope badge muted">{f.scope}</span>
            </div>
          ))}
        </Panel>
      </div>

      <Panel title="Build">
        <div style={{ padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
            <div>
              <div className="tile-label">Version</div>
              <div className="mono" style={{ marginTop: 6 }}>{BUILD.version}</div>
            </div>
            <div>
              <div className="tile-label">Commit</div>
              <div className="mono" style={{ marginTop: 6 }}>{BUILD.commit}</div>
            </div>
            <div>
              <div className="tile-label">Environment</div>
              <div className="mono" style={{ marginTop: 6 }}>{BUILD.env}</div>
            </div>
            <div>
              <div className="tile-label">Built at</div>
              <div className="mono" style={{ marginTop: 6 }}>{BUILD.builtAt.replace('T', ' ').replace('Z', ' UTC')}</div>
            </div>
          </div>
        </div>
      </Panel>
    </>
  );
}
