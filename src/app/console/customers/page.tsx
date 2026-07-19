import { SectionHeader, Tiles, StatTile, Panel, DataTable, StatusBadge, Mono } from '@/components/ui';
import type { Column } from '@/components/ui';
import { CUSTOMERS } from '@/lib/data';
import { fmtNum } from '@/lib/format';
import type { Customer } from '@/lib/types';

export default function CustomersPage() {
  const active = CUSTOMERS.filter((c) => c.status === 'active').length;
  const seats = CUSTOMERS.reduce((s, c) => s + c.seats, 0);
  const regions = new Set(CUSTOMERS.map((c) => c.region)).size;

  const columns: Column<Customer>[] = [
    { header: 'ID', width: '96px', render: (c) => <Mono>{c.id}</Mono> },
    { header: 'Customer', render: (c) => <span style={{ fontWeight: 600 }}>{c.name}</span> },
    { header: 'Plan', render: (c) => c.plan },
    { header: 'Seats', align: 'right', render: (c) => <span className="num">{fmtNum(c.seats)}</span> },
    { header: 'Region', render: (c) => <Mono>{c.region}</Mono> },
    { header: 'Since', render: (c) => <Mono>{c.since}</Mono> },
    { header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
  ];

  return (
    <>
      <SectionHeader
        title="Customers"
        sub="Accounts, plans, and their footprint."
        actions={<button className="btn">Invite</button>}
      />
      <Tiles>
        <StatTile label="Customers" value={CUSTOMERS.length} />
        <StatTile label="Active" value={active} accent="ok" />
        <StatTile label="Seats" value={fmtNum(seats)} accent="accent" />
        <StatTile label="Regions" value={regions} />
      </Tiles>
      <Panel title="Accounts">
        <DataTable columns={columns} rows={CUSTOMERS} />
      </Panel>
    </>
  );
}
