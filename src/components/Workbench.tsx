'use client';

import { useState, type ReactNode } from 'react';
import type { PageResult, CrawlResult } from '@/lib/types';

type Mode = 'extract' | 'crawl';

function hostOf(u: string): string {
  try {
    return new URL(u).hostname;
  } catch {
    return u;
  }
}

function Tile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="tile">
      <div className="tile-label">{label}</div>
      <div className="tile-value t-accent">{value}</div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="btn"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1200);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}

function ExtractView({ page }: { page: PageResult }) {
  const metaEntries = Object.entries(page.meta).slice(0, 12);
  return (
    <>
      <div className="tiles">
        <Tile label="Status" value={page.status || '—'} />
        <Tile label="Bytes" value={page.bytes.toLocaleString()} />
        <Tile label="Links" value={page.links.length} />
        <Tile label="Markdown chars" value={page.markdown.length.toLocaleString()} />
      </div>

      {page.error && (
        <div className="panel">
          <div className="panel-body pad err">{page.error}</div>
        </div>
      )}

      {page.title && (
        <div className="panel">
          <div className="panel-body pad">
            <b>{page.title}</b>
            <div className="mono muted-txt" style={{ fontSize: '.75rem', marginTop: 4 }}>
              {page.finalUrl ?? page.url}
            </div>
          </div>
        </div>
      )}

      {page.markdown && (
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Markdown</h2>
            <div className="panel-actions">
              <CopyButton text={page.markdown} />
            </div>
          </div>
          <pre className="md">{page.markdown}</pre>
        </div>
      )}

      {metaEntries.length > 0 && (
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Metadata</h2>
          </div>
          <table className="kv">
            <tbody>
              {metaEntries.map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {page.links.length > 0 && (
        <div className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Links ({page.links.length})</h2>
          </div>
          <div className="panel-body pad" style={{ maxHeight: 220, overflow: 'auto' }}>
            {page.links.slice(0, 100).map((l, i) => (
              <div key={i} className="mono" style={{ fontSize: '.75rem', padding: '2px 0' }}>
                <a className="link" href={l} target="_blank" rel="noreferrer noopener">
                  {l}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function Workbench() {
  const [mode, setMode] = useState<Mode>('extract');
  const [url, setUrl] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [depth, setDepth] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<PageResult | null>(null);
  const [crawl, setCrawl] = useState<CrawlResult | null>(null);
  const [selected, setSelected] = useState(0);

  async function run() {
    setError(null);
    setPage(null);
    setCrawl(null);
    setSelected(0);
    if (!url.trim()) {
      setError('Enter a URL.');
      return;
    }
    if (!authorized) {
      setError('Confirm you are authorized to fetch this target.');
      return;
    }
    setLoading(true);
    try {
      const endpoint = mode === 'extract' ? '/api/extract' : '/api/crawl';
      const payload =
        mode === 'extract' ? { url, authorized } : { url, authorized, depth, limit };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? `HTTP ${res.status}`);
        return;
      }
      if (mode === 'extract') setPage(json.page);
      else setCrawl(json.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'request failed');
    } finally {
      setLoading(false);
    }
  }

  const selPage = crawl?.pages[selected];

  return (
    <div className="wb">
      <div className="wb-brand">
        <span className="brand-mark" />
        <b>
          LUMORA<span>AI</span>
        </b>
      </div>
      <p className="wb-tag">
        Ethical web-data extraction &amp; OSINT — robots-respecting, SSRF-guarded, authorization-gated,
        audited.
      </p>

      <div className="wb-form">
        <div className="row">
          <div className="seg" role="tablist">
            <button className={mode === 'extract' ? 'on' : ''} onClick={() => setMode('extract')}>
              Extract page
            </button>
            <button className={mode === 'crawl' ? 'on' : ''} onClick={() => setMode('crawl')}>
              Crawl site
            </button>
          </div>
          {mode === 'crawl' && (
            <>
              <label className="muted-txt" style={{ fontSize: '.78rem' }}>
                depth
                <input
                  type="number"
                  min={0}
                  max={3}
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  style={{ width: 64, marginLeft: 6 }}
                />
              </label>
              <label className="muted-txt" style={{ fontSize: '.78rem' }}>
                limit
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  style={{ width: 72, marginLeft: 6 }}
                />
              </label>
            </>
          )}
        </div>

        <div className="row">
          <input
            className="grow"
            type="text"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
          />
          <button className="btn primary" onClick={run} disabled={loading}>
            {loading ? 'Working…' : mode === 'extract' ? 'Extract' : 'Crawl'}
          </button>
        </div>

        <label className="authz">
          <input type="checkbox" checked={authorized} onChange={(e) => setAuthorized(e.target.checked)} />
          I am authorized to fetch this target and will respect its terms.
        </label>

        <div className="gov">
          <span className="badge ok">robots.txt enforced</span>
          <span className="badge ok">rate-limited</span>
          <span className="badge ok">SSRF-guarded</span>
          <span className="badge info">audited</span>
          <span className="badge muted">no evasion · no proxies</span>
        </div>
      </div>

      {error && (
        <div className="panel">
          <div className="panel-body pad err">{error}</div>
        </div>
      )}
      {loading && <div className="spin">Fetching politely (honoring crawl-delay)…</div>}

      {page && <ExtractView page={page} />}

      {crawl && (
        <>
          <div className="tiles">
            <Tile label="Pages" value={crawl.visited} />
            <Tile label="Skipped" value={crawl.skipped.length} />
            <Tile label="Host" value={hostOf(crawl.seed)} />
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">Pages</h2>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>URL</th>
                    <th style={{ textAlign: 'right' }}>Bytes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {crawl.pages.map((p, i) => (
                    <tr
                      key={i}
                      onClick={() => setSelected(i)}
                      style={{ cursor: 'pointer', background: i === selected ? 'rgba(94,130,190,.08)' : undefined }}
                    >
                      <td>{p.title ?? '—'}</td>
                      <td className="mono" style={{ maxWidth: 340, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.url}
                      </td>
                      <td className="num" style={{ textAlign: 'right' }}>
                        {p.bytes.toLocaleString()}
                      </td>
                      <td>
                        <span className="badge ok">{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {crawl.skipped.length > 0 && (
            <div className="panel">
              <div className="panel-head">
                <h2 className="panel-title">Skipped</h2>
              </div>
              <div className="tbl-wrap">
                <table className="tbl">
                  <tbody>
                    {crawl.skipped.map((s, i) => (
                      <tr key={i}>
                        <td className="mono" style={{ maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.url}
                        </td>
                        <td className="muted-txt">{s.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selPage && <ExtractView key={selected} page={selPage} />}
        </>
      )}
    </div>
  );
}
