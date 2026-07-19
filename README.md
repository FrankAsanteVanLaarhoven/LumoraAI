# LumoraAI

An **ethical, self-hosted web-data extraction & OSINT** engine — turn public web
pages into clean Markdown / structured JSON, and crawl sites politely, with
governance built in.

[![CI](https://github.com/FrankAsanteVanLaarhoven/LumoraAI/actions/workflows/ci.yml/badge.svg)](https://github.com/FrankAsanteVanLaarhoven/LumoraAI/actions/workflows/ci.yml)
&nbsp;Next.js 15 · React 19 · TypeScript (strict)

---

## What it is

A compliant alternative to “scrape-anything” tooling. It competes on **extraction
quality, breadth, and governance** — not on evasion. Every fetch is:

- **robots.txt-enforced** — disallowed paths are not fetched; on error/5xx it fails *closed*.
- **rate-limited** — honours `Crawl-delay` (capped) with a courteous per-host floor.
- **SSRF-guarded** — refuses private/loopback/link-local/reserved addresses, re-checked on every redirect hop.
- **authorization-gated** — the API requires an explicit attestation that you’re permitted to fetch the target.
- **audited** — every request is recorded in an append-only log.

### What it deliberately does **not** do

No detection evasion, browser-fingerprint spoofing, residential/Tor proxy rotation,
or CAPTCHA solving. No command-and-control, no exploitation, no wireless attacks,
no surveillance of people. Those are out of scope by design — that boundary is what
makes this *ethical* rather than a “stealth” scraper.

## Features

- **Extract** a single URL → title, clean Markdown, plain text, `<meta>` map, and absolute links.
- **Crawl** a site (bounded depth/page-count, same-origin by default) with the same per-request governance.
- Honest `User-Agent` that identifies the crawler and points at this repo.
- A minimal workbench UI plus a JSON API.

## Getting started

```bash
git clone https://github.com/FrankAsanteVanLaarhoven/LumoraAI.git
cd LumoraAI
npm install
npm run dev        # http://localhost:3000  (falls back if in use)
```

## API

| Route | Method | Body | Description |
| --- | --- | --- | --- |
| `/api/extract` | POST | `{ url, authorized: true }` | Extract one page |
| `/api/crawl` | POST | `{ url, authorized: true, depth?, limit?, sameOrigin? }` | Bounded site crawl |
| `/api/audit` | GET | `?n=` | Recent audit entries |

`authorized: true` is a required attestation — without it the request is refused
(and the refusal is logged). Caps: depth ≤ 3, pages ≤ 50, response ≤ 3 MB, 15 s timeout.

```bash
curl -X POST http://localhost:3000/api/extract \
  -H 'content-type: application/json' \
  -d '{"url":"https://example.com","authorized":true}'
```

## Project structure

```
src/
  app/
    page.tsx  layout.tsx  globals.css  error.tsx  not-found.tsx
    api/extract/route.ts  api/crawl/route.ts  api/audit/route.ts
  components/Workbench.tsx
  lib/
    ua.ts         # honest User-Agent
    ssrf.ts       # private-address guard (per redirect hop)
    robots.ts     # robots.txt fetch + parse + longest-match matcher
    ratelimit.ts  # polite per-host limiter
    fetcher.ts    # SSRF-guarded fetch, size cap, timeout
    extract.ts    # HTML -> Markdown/text/meta/links (cheerio + turndown)
    crawl.ts      # single-page + bounded site crawl
    audit.ts      # append-only audit log
tests/            # Vitest: robots matcher, SSRF classifier, extraction
```

## Roadmap

- **JS rendering** (optional, via a headless browser) for dynamic pages — pluggable, off by default.
- **OSINT module** over public sources (DNS, RDAP/WHOIS, certificate transparency, passive subdomains).
- **Control-plane** UI: job scheduler, results browser, and a governance panel (allowlist, attestations, audit).

## Testing

```bash
npm test        # Vitest — robots matcher, SSRF classifier, HTML extraction
npm run lint
npm run typecheck
```

## License

Proprietary. Copyright © 2026 Frank Asante Van Laarhoven. All rights reserved. See
[LICENSE](./LICENSE).
