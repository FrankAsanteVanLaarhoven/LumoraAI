import { SectionHeader, Tiles, StatTile, Panel, DataTable, StatusBadge, Mono } from '@/components/ui';
import type { Column } from '@/components/ui';
import { PRODUCTS } from '@/lib/data';
import { fmtNum } from '@/lib/format';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const active = PRODUCTS.filter((p) => p.status === 'active').length;
  const totalEntitlements = PRODUCTS.reduce((s, p) => s + p.entitlements, 0);
  const notActive = PRODUCTS.filter((p) => p.status !== 'active').length;

  const columns: Column<Product>[] = [
    { header: 'ID', width: '120px', render: (p) => <Mono>{p.id}</Mono> },
    { header: 'Product', render: (p) => <span style={{ fontWeight: 600 }}>{p.name}</span> },
    { header: 'Version', render: (p) => <Mono>{p.version}</Mono> },
    { header: 'Tier', render: (p) => p.tier },
    { header: 'Entitlements', align: 'right', render: (p) => <span className="num">{fmtNum(p.entitlements)}</span> },
    { header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
  ];

  return (
    <>
      <SectionHeader
        title="Products"
        sub="The catalogue of offerings and their versions."
        actions={<button className="btn">Export</button>}
      />
      <Tiles>
        <StatTile label="Products" value={PRODUCTS.length} />
        <StatTile label="Active" value={active} accent="ok" />
        <StatTile label="Entitlements issued" value={fmtNum(totalEntitlements)} accent="accent" />
        <StatTile label="Draft / restricted" value={notActive} accent="warn" />
      </Tiles>
      <Panel title="Catalogue">
        <DataTable columns={columns} rows={PRODUCTS} />
      </Panel>
    </>
  );
}
