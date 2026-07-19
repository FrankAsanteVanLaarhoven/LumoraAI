import { SectionHeader, Tiles, StatTile, Panel, DataTable, Mono } from '@/components/ui';
import type { Column } from '@/components/ui';
import { EVIDENCE, verifyEvidence } from '@/lib/data';
import { shortHash } from '@/lib/format';
import type { EvidenceRecord } from '@/lib/types';

export default function EvidencePage() {
  const intact = verifyEvidence(EVIDENCE);
  const actors = new Set(EVIDENCE.map((e) => e.actor)).size;
  const last = EVIDENCE[EVIDENCE.length - 1];

  const columns: Column<EvidenceRecord>[] = [
    { header: '#', width: '44px', render: (e) => <span className="num muted-txt">{e.seq}</span> },
    { header: 'Time', render: (e) => <Mono>{e.ts.slice(0, 19).replace('T', ' ')}</Mono> },
    { header: 'Actor', render: (e) => e.actor },
    { header: 'Action', render: (e) => <Mono>{e.action}</Mono> },
    { header: 'Target', render: (e) => <span className="muted-txt">{e.target}</span> },
    { header: 'Prev', render: (e) => <span className="hash prev">{shortHash(e.prev)}</span> },
    { header: 'Hash', render: (e) => <span className="hash">{shortHash(e.hash)}</span> },
  ];

  return (
    <>
      <SectionHeader
        title="Evidence"
        sub="Tamper-evident, hash-chained audit trail."
        actions={<button className="btn">Export ledger</button>}
      />
      <Tiles>
        <StatTile label="Records" value={EVIDENCE.length} />
        <StatTile
          label="Chain integrity"
          value={intact ? 'verified' : 'broken'}
          accent={intact ? 'ok' : 'bad'}
          hint="recomputed on load"
        />
        <StatTile label="Distinct actors" value={actors} />
        <StatTile label="Last sealed" value={<Mono>{last?.ts.slice(11, 19)}</Mono>} accent="accent" />
      </Tiles>
      <Panel title="Ledger">
        <div className="chain-note">
          <span className={`led ${intact ? 'ok' : 'bad'}`} />
          <span>
            Each record binds the previous record&rsquo;s hash (FNV-1a, demo). Altering any row breaks every
            hash after it — the chain is recomputed and verified on every render.
          </span>
        </div>
        <DataTable columns={columns} rows={EVIDENCE} />
      </Panel>
    </>
  );
}
