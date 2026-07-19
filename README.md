# LumoraAI

A self-hosted **cybersecurity command console** — operations, commerce, and
assurance in a single control plane. Nine top-level sections across three spines,
rendered in a dark, forensic mission-control interface.

[![CI](https://github.com/FrankAsanteVanLaarhoven/LumoraAI/actions/workflows/ci.yml/badge.svg)](https://github.com/FrankAsanteVanLaarhoven/LumoraAI/actions/workflows/ci.yml)
&nbsp;Next.js 15 · React 19 · TypeScript (strict) · zero runtime UI dependencies

---

## Overview

LumoraAI is the **shell and information architecture** for a control plane: a
consistent, accessible surface over the entities an operator works with day to
day. Each section is a real route with stat tiles, tables, and status, driven by
a typed data layer. Swap the stub data for live services and the interface stands
unchanged.

| Spine | Sections |
| --- | --- |
| **Operate** | Operations |
| **Commerce** | Products · Campaigns · Channels · Customers · Entitlements |
| **Assurance** | Intelligence · Evidence · System |

## Highlights

- **Tamper-evident evidence ledger** — the Evidence section renders a hash-chained
  audit trail and **re-verifies the entire chain on every render**
  (`verifyEvidence`). Altering, removing, or reordering any record breaks
  verification; this behaviour is covered by tests.
- **Typed end to end** — TypeScript in `strict` mode; a generic `DataTable<T>`
  primitive; one source of truth for domain types (`src/lib/types.ts`).
- **Zero runtime UI dependencies** — no component library, no icon package. Icons
  are inline SVGs; the design system is plain CSS variables. Small bundle, no
  supply-chain surface for the UI layer.
- **Accessible & resilient** — keyboard-navigable sidebar with `aria-current`,
  route-level `error`, `not-found`, and `loading` states, and reduced-motion
  support.
- **Verified in CI** — lint, typecheck, unit tests, and a production build run on
  every push and pull request.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, Server Components) |
| Language | TypeScript 5 (`strict`) |
| UI | React 19, plain CSS design system |
| Tests | Vitest |
| Lint | ESLint (`next/core-web-vitals`, `next/typescript`) |
| CI | GitHub Actions |
| Runtime | Node.js ≥ 20 (22 in CI) |

## Getting started

```bash
git clone https://github.com/FrankAsanteVanLaarhoven/LumoraAI.git
cd LumoraAI
npm install
npm run dev        # http://localhost:3000  (falls back to :3001 if in use)
```

`/` redirects to `/console/operations`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the unit test suite (Vitest) |
| `npm run test:watch` | Watch mode |

## Project structure

```
src/
  app/
    layout.tsx  page.tsx (redirect)  globals.css
    error.tsx  not-found.tsx                 # route-level resilience
    console/
      layout.tsx  loading.tsx                # shell (sidebar + top bar) + skeleton
      operations/ products/ campaigns/ channels/ customers/
      entitlements/ intelligence/ evidence/ system/   # one page.tsx each
  components/
    Sidebar.tsx  TopBar.tsx                   # client (active nav, live clock)
    ui.tsx                                    # Panel, StatTile, DataTable, badges, bars
    icons.tsx                                 # dependency-free line icons
  lib/
    nav.ts  types.ts  data.ts  format.ts
tests/                                        # Vitest: evidence chain, invariants, helpers
.github/workflows/ci.yml
```

## Wiring real data

Pages are Server Components, so replacing the stub exports in `src/lib/data.ts`
with `await fetch(...)` (or a database/service client) requires no UI changes.
Keep the `src/lib/types.ts` contracts and every component renders as-is. The
`DataTable<T>` / `Column<T>` primitive is generic over your row type.

## Testing

Unit tests (`tests/`) cover the evidence hash-chain (integrity, tamper detection,
reordering detection, link continuity), navigation integrity, domain invariants,
and formatting helpers.

```bash
npm test
```

## Scope

LumoraAI is a neutral control-plane interface: catalogue, accounts, entitlements,
signals, and an audit ledger. It contains **no data-collection, scraping, network
reconnaissance, or offensive capability** — those are out of scope for this
project by design.

## License

Proprietary. Copyright © 2026 Frank Asante Van Laarhoven. All rights reserved. See
[LICENSE](./LICENSE).
