# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build
pnpm start        # Serve production build
pnpm typecheck    # Type-check without emitting (tsc --noEmit)
```

No test runner is configured. Node >=20 required.

## Architecture

**Career Sim** is a fully client-side football career simulator. No API routes, no server components, no database — all state lives in `localStorage` under the key `career-sim:v1`.

### Route structure

| Route | File | Role |
|-------|------|------|
| `/` | `app/page.tsx` | Landing: country/position picker, resume banner |
| `/career` | `app/career/page.tsx` | Dashboard: player card, season timeline, simulate button |
| `/career/season` | `app/career/season/page.tsx` | Season debrief + transfer offer choices |
| `/career/retire` | `app/career/retire/page.tsx` | Retirement summary + trophy shelf |

All pages use `"use client"` and include a hydration guard to prevent SSR/localStorage mismatches.

### State flow

1. Landing page collects country, position, and starting club → calls `useCareer().startCareer()`
2. Career dashboard calls `useCareer().simulateNext()` → triggers `simulateSeason()` then `generateOffers()`
3. Season debrief shows results; accepting an offer calls `useCareer().acceptOffer(offer)`
4. After season 22 (age 40), `finished` flag routes to `/career/retire`

### Key lib files

| File | What it does |
|------|-------------|
| `lib/store.ts` | Zustand store + localStorage persistence; source of truth for all game state |
| `lib/simulator.ts` | Season logic: age curve, club-tier multipliers, position-specific stats, NT participation, awards |
| `lib/offers.ts` | Renewal and transfer offer generation |
| `lib/leagues.ts` | ~270 clubs across 14 countries, organised by tier 1–4 |
| `lib/competitions.ts` | Continental and national tournament definitions + bonus trophy gates |
| `lib/countries.ts` | Country metadata and flag mapping |
| `lib/random.ts` | RNG helpers (`rndInt`, `chance`, `pick`, `weighted`) used everywhere |

### Styling

Tailwind CSS v4 is configured via `postcss.config.mjs` (`@tailwindcss/postcss`). Custom theme tokens (colors, animations, `.bg-pitch-grid`) live in `app/globals.css` — not in a `tailwind.config.*` file.

Palette: `ink` (dark bg), `bone` (light text), `pitch` (green accent `#6dff7a`), `gold`.

### Images

Club crests are bundled PNGs under `public/clubs/{country}/`. National team and tournament logos are under `public/national-teams/` and `public/tournaments/`. `Logo.tsx` handles `onError` fallback to the `Crest.tsx` SVG placeholder. `next.config.ts` whitelists `flagcdn.com` for remote flag images.

### Types

All shared interfaces are in `types/index.ts`: `Position`, `Club`, `League`, `Season`, `Player`, `CareerState`, etc.
