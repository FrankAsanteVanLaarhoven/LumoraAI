import { SectionHeader, Tiles, StatTile, Panel, DataTable, StatusBadge, Bar, Mono } from '@/components/ui';
import type { Column } from '@/components/ui';
import { ENTITLEMENTS } from '@/lib/data';
import type { Entitlement } from '@/lib/types';

export default function EntitlementsPage() {
  const active = ENTITLEMENTS.filter((e) => e.status === 'active').length;
  const overLimit = ENTITLEMENTS.filter((e) => e.used > e.limit).length;
  const expired = ENTITLEMENTS.filter((e) => e.status === 'expired').length;

  const columns: Column<Entitlement>[] = [
    { header: 'ID', width: '96px', render: (e) => <Mono>{e.id}</Mono> },
    { header: 'Customer', render: (e) => <span style={{ fontWeight: 600 }}>{e.customer}</span> },
    { header: 'Product', render: (e) => e.product },
    { header: 'Scope', render: (e) => <span className="muted-txt">{e.scope}</span> },
    {
      header: 'Usage',
      width: '190px',
      render: (e) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bar value={e.used} max={e.limit} />
          <span className="num" style={{ minWidth: 58, textAlign: 'right', color: e.used > e.limit ? 'var(--bad)' : undefined }}>
            {e.used}/{e.limit}
          </span>
        </div>
      ),
    },
    { header: 'Expires', render: (e) => <Mono>{e.expires}</Mono> },
    { header: 'Status', render: (e) => <StatusBadge status={e.status} /> },
  ];

  return (
    <>
      <SectionHeader
        title="Entitlements"
        sub="Grants binding customers to products, with limits."
        actions={<button className="btn primary">Grant</button>}
      />
      <Tiles>
        <StatTile label="Entitlements" value={ENTITLEMENTS.length} />
        <StatTile label="Active" value={active} accent="ok" />
        <StatTile label="Over limit" value={overLimit} accent={overLimit ? 'bad' : 'ok'} hint="usage exceeds grant" />
        <StatTile label="Expired" value={expired} accent={expired ? 'warn' : 'ok'} />
      </Tiles>
      <Panel title="Grants">
        <DataTable columns={columns} rows={ENTITLEMENTS} />
      </Panel>
    </>
  );
}
