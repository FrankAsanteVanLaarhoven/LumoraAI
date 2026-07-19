export default function GovernancePage() {
  return (
    <div className="wb">
      <h1 className="wb-title">Governance</h1>
      <p className="wb-tag">The controls enforced on every request, and the boundaries this tool holds.</p>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Enforced on every request</h2>
        </div>
        <table className="kv">
          <tbody>
            <tr>
              <td>robots.txt</td>
              <td>Honoured; disallowed paths are not fetched. Fails <b>closed</b> on 5xx / error.</td>
            </tr>
            <tr>
              <td>rate limiting</td>
              <td>Polite per-host; honours Crawl-delay (capped 1–30s), never below a 1s floor.</td>
            </tr>
            <tr>
              <td>SSRF guard</td>
              <td>Private / loopback / link-local / reserved addresses blocked, re-checked on every redirect hop.</td>
            </tr>
            <tr>
              <td>authorization</td>
              <td>Each request requires an explicit attestation; refusals are recorded.</td>
            </tr>
            <tr>
              <td>audit</td>
              <td>
                Append-only log persisted to <span className="mono">data/audit.jsonl</span>.
              </td>
            </tr>
            <tr>
              <td>identity</td>
              <td>
                Honest User-Agent (<span className="mono">LumoraCrawler</span>) — no spoofing, even when rendering.
              </td>
            </tr>
            <tr>
              <td>limits</td>
              <td>depth ≤ 3 · pages ≤ 50 · response ≤ 3 MB · 15s fetch / 25s render timeout.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2 className="panel-title">Out of scope — by design</h2>
        </div>
        <div className="panel-body pad">
          <div className="gov">
            <span className="badge bad">no detection evasion</span>
            <span className="badge bad">no proxy / fingerprint rotation</span>
            <span className="badge bad">no CAPTCHA solving</span>
            <span className="badge bad">no command-and-control</span>
            <span className="badge bad">no exploitation</span>
            <span className="badge bad">no wireless attacks</span>
            <span className="badge bad">no surveillance of people</span>
          </div>
          <p className="muted-txt" style={{ marginTop: 12, fontSize: '.82rem' }}>
            Dynamic (JavaScript) rendering uses a headless browser to read legitimate content — with the honest
            User-Agent and robots.txt still enforced. It is not used to circumvent access controls or detection.
          </p>
        </div>
      </div>
    </div>
  );
}
