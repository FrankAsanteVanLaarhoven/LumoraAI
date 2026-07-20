<div align="center">

# LumoraAI

### Governance-first web-data extraction & OSINT — self-hosted

Turn any public URL, site, or domain into clean, structured intelligence —
Markdown / JSON extraction (static **and** JavaScript-rendered), bounded crawling,
and passive domain reconnaissance — with robots.txt, SSRF protection,
authorization, and audit enforced on **every** request.

[![CI](https://github.com/FrankAsanteVanLaarhoven/LumoraAI/actions/workflows/ci.yml/badge.svg)](https://github.com/FrankAsanteVanLaarhoven/LumoraAI/actions/workflows/ci.yml)
&nbsp;![Next.js 15](https://img.shields.io/badge/Next.js-15-000000)
&nbsp;![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178C6)
&nbsp;![Tests](https://img.shields.io/badge/tests-12%20passing-2ea44f)
&nbsp;![Vulnerabilities](https://img.shields.io/badge/prod%20vulns-0-2ea44f)
&nbsp;![License](https://img.shields.io/badge/license-Proprietary-lightgrey)

</div>

---

## Overview

LumoraAI is a compliant alternative to “scrape-anything” tooling. It competes on
**extraction quality, breadth, and governance — not evasion.** Every request is
robots-respecting, rate-limited, SSRF-guarded, authorization-gated, and audited,
and the whole system runs on your own infrastructure with no third-party data
egress.

- **Clean, LLM-ready output** — HTML → Markdown / structured JSON.
- **Static and dynamic** — plain fetch or a headless-browser render for JavaScript / SPA pages.
- **Passive OSINT** — DNS, RDAP (registry), and Certificate-Transparency subdomains, public sources only.
- **Governed by construction** — the safeguards are in the request path, not bolted on.
- **Self-hosted & auditable** — an append-only audit trail persisted to disk.

## Capabilities

| Capability | What it does |
| --- | --- |
| **Extract** | A URL → title, clean Markdown, plain text, `<meta>` map, and absolute links |
| **Crawl** | Bounded same-origin site crawl (depth ≤ 3, ≤ 50 pages), each page fully governed |
| **Dynamic rendering** | Optional headless-Chromium rendering for JS / SPA pages — honest User-Agent, robots still enforced |
| **OSINT recon** | Passive domain profiling: DNS · RDAP registry · Certificate-Transparency subdomains |
| **Audit** | Append-only, on-disk record of every request (`data/audit.jsonl`) |

## Governance & security

Enforced on **every** request — this is the core of the product:

| Control | Behaviour |
| --- | --- |
| **robots.txt** | Honoured; disallowed paths are never fetched. Fails **closed** on 5xx / error. |
| **Rate limiting** | Polite per-host; honours `Crawl-delay` (capped 1–30 s), never below a 1 s floor. |
| **SSRF protection** | Blocks private / loopback / link-local / reserved addresses, re-checked on every redirect hop. |
| **Authorization** | Each request requires an explicit attestation; refusals are recorded. |
| **Audit** | Append-only log, persisted to disk, fronted by an in-memory ring. |
| **Identity** | Honest `LumoraCrawler` User-Agent — no spoofing, even when rendering. |
| **Limits** | depth ≤ 3 · pages ≤ 50 · response ≤ 3 MB · 15 s fetch / 25 s render timeout. |

### Out of scope — by design

No detection evasion, proxy / fingerprint rotation, or CAPTCHA solving. No
command-and-control, exploitation, wireless attacks, or surveillance of people.
That boundary is what makes LumoraAI a governed intelligence tool rather than a
stealth scraper.

## Quick start

```bash
git clone https://github.com/FrankAsanteVanLaarhoven/LumoraAI.git
cd LumoraAI
npm install
npm run dev        # http://localhost:3000  (falls back if the port is in use)
```

> **Dynamic rendering** needs a Chromium once: `npx playwright install chromium`.
> Without it, `render: true` degrades gracefully with a clear message — static
> extraction is unaffected.

The web console opens on **Workbench**; **Activity** shows the live audit log and
**Governance** documents the enforced controls.

## API reference

| Method & path | Body | Description |
| --- | --- | --- |
| `POST /api/extract` | `{ url, authorized: true, render? }` | Extract one page (`render: true` = headless browser) |
| `POST /api/crawl` | `{ url, authorized: true, depth?, limit?, sameOrigin?, render? }` | Bounded site crawl |
| `POST /api/osint` | `{ domain, authorized: true }` | Passive domain recon (DNS + RDAP + CT subdomains) |
| `GET /api/audit` | `?n=` | Recent audit entries |

`authorized: true` is a **required attestation** — without it the request is
refused (`403`) and the refusal is logged.

```bash
# Static extraction
curl -X POST http://localhost:3000/api/extract \
  -H 'content-type: application/json' \
  -d '{"url":"https://example.com","authorized":true}'

# JavaScript-rendered extraction
curl -X POST http://localhost:3000/api/extract \
  -H 'content-type: application/json' \
  -d '{"url":"https://example.com/app","authorized":true,"render":true}'

# Passive domain recon
curl -X POST http://localhost:3000/api/osint \
  -H 'content-type: application/json' \
  -d '{"domain":"example.com","authorized":true}'
```

## Architecture

Every request follows one governed path:

```
request → authorization gate → robots.txt → rate limiter
        → [ static fetch (SSRF-guarded) | headless render ]
        → extract (Markdown / JSON / links) → audit
```

```
src/
  app/
    page.tsx  layout.tsx  globals.css  error.tsx  not-found.tsx
    activity/page.tsx  governance/page.tsx        # control-plane sections
    api/{extract,crawl,osint,audit}/route.ts
  components/
    Workbench.tsx                                 # extract / crawl / OSINT UI
    Shell.tsx                                     # control-plane shell (sidebar)
  lib/
    ua.ts         # honest User-Agent
    ssrf.ts       # private-address guard (per redirect hop)
    robots.ts     # robots.txt fetch + parse + longest-match matcher
    ratelimit.ts  # polite per-host limiter
    fetcher.ts    # SSRF-guarded fetch, size cap, timeout
    render.ts     # headless-browser JS rendering (playwright-core)
    extract.ts    # HTML → Markdown / text / meta / links (cheerio + turndown)
    crawl.ts      # single-page + bounded site crawl (static or rendered)
    audit.ts      # append-only audit log → data/audit.jsonl
    osint/        # domain recon: dns · rdap · certs (CT) · recon · domain-validate
tests/            # Vitest: robots matcher, SSRF classifier, extraction, domain-validate
```

## Configuration

All optional:

| Variable | Purpose |
| --- | --- |
| `LUMORA_CHROMIUM_PATH` | Explicit Chromium executable for JS rendering |
| `PLAYWRIGHT_BROWSERS_PATH` | Alternative Playwright browser cache directory |

## Interfaces

- **Web console** — Workbench (extract / crawl / OSINT), Activity (live audit), Governance.
- **REST API** — `/api/extract`, `/api/crawl`, `/api/osint`, `/api/audit`.

## Wiring real data & scale

Pages are Server Components; the engine is plain TypeScript modules. Extraction
returns typed results (`src/lib/types.ts`) suitable for direct ingestion into a
vector store or data pipeline. The audit log is file-backed today; back it with a
database for multi-node deployments.

## Quality & CI

| | |
| --- | --- |
| **Language** | TypeScript 5 (`strict`) |
| **Tests** | 12 Vitest unit tests (robots matcher, SSRF classifier, HTML extraction, domain validation) |
| **Lint** | ESLint (`next/core-web-vitals`, `next/typescript`) |
| **CI** | GitHub Actions — install · lint · typecheck · test · build on every push & PR |
| **Supply chain** | 0 production-dependency vulnerabilities; zero runtime UI dependencies |

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Vitest
npm run build       # production build
```

## Roadmap

- **Job scheduler & results browser** in the control plane (persist crawl / extract results, not just the audit trail).
- **OSINT depth** — passive DNS history and additional public registries (read-only).
- **DB-backed audit** for multi-node deployments (file-backed today).

## License

Proprietary. Copyright © 2026 Frank Asante Van Laarhoven. All rights reserved.
See [LICENSE](./LICENSE).
