# LumoraAI

A self-hosted **command console** for cybersecurity operations — nine top-level
sections across three spines, with a dark, forensic "mission-control" aesthetic.

| Spine | Sections |
| --- | --- |
| **Operate** | Operations |
| **Commerce** | Products · Campaigns · Channels · Customers · Entitlements |
| **Assurance** | Intelligence · Evidence · System |

Each section is a real route under `/console/<section>` with stat tiles, tables,
and status — driven by a typed stub-data layer (`src/lib/data.ts`). This is the
**information architecture + shell**: swap the stub data for real services and the
UI stands as-is.

Notable pieces:

- **Evidence** renders a hash-chained, tamper-evident ledger and re-verifies the
  whole chain on every render (`verifyEvidence`).
- **Entitlements / Campaigns / Intelligence** show usage/progress/confidence bars.
- Sidebar highlights the active section; the top bar shows a live UTC clock.

## Quick start

```bash
cd LumoraAI
npm install
npm run dev          # http://localhost:3000 (falls back to :3001 if taken)
```

`/` redirects to `/console/operations`.

## Layout

```
src/
  app/
    layout.tsx  page.tsx (redirect)  globals.css
    console/
      layout.tsx                     # sidebar + top bar shell
      operations/ products/ campaigns/ channels/ customers/
      entitlements/ intelligence/ evidence/ system/   # one page.tsx each
  components/
    Sidebar.tsx  TopBar.tsx          # client (active state, clock)
    ui.tsx                           # Panel, StatTile, DataTable, badges, bars
    icons.tsx                        # dependency-free line icons
  lib/
    nav.ts  types.ts  data.ts  format.ts
```

## Wiring real data

Replace the exports in `src/lib/data.ts` with fetches (server components already,
so `await fetch(...)` in each `page.tsx` works). Keep the `types.ts` contracts and
every component renders unchanged. The `DataTable`/`Column<T>` primitive is generic
over your row type.

## Scope

This is a neutral control-plane UI: catalogue, accounts, entitlements, signals, and
an audit ledger. It carries no data-collection, scraping, or offensive capability —
those stay out of this project.
