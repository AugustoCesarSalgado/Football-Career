# Career Sim — football career simulator

A single-player simulator of a footballer's career, played from age **18 to 40**.
Pick a country and a position, get a name, a shirt number and a starter
club from the local first division — then live 22 seasons of league finishes,
cup runs, continental nights, national-team tournaments and individual awards.
At the end of each season, choose between renewing with your current club or
accepting a transfer offer.

Built with **Next.js 16 (App Router) + TypeScript strict + Tailwind v4 + Zustand**
and designed for the desktop.

## Quickstart

Requires **Node 20+** and **pnpm** (the lockfile is pnpm's; npm/yarn also work).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & serve

```bash
pnpm build
pnpm start
```

Typecheck only:

```bash
pnpm typecheck
```

## Deploy to Vercel

The fastest path:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR-USERNAME%2Fcareer-sim)

Manually, from the repo root:

1. Push this repository to GitHub.
2. On [vercel.com/new](https://vercel.com/new) import the repo.
3. Framework preset is auto-detected as **Next.js** — no config changes needed.
4. **Build command:** `pnpm build` · **Output:** automatic · **Install:** `pnpm install`.
5. No environment variables required — the app is fully client-side, all
   logos are bundled in `public/`, and the career is persisted in
   `localStorage`.

If you're deploying from a monorepo with this app inside a subfolder,
set Vercel's **Root Directory** to `career-sim`.

### Deploying somewhere else

The app is 100% static once built. You can host it on Cloudflare Pages,
Netlify or any static host with Next.js support. The remote images host
(`flagcdn.com`) is already whitelisted in `next.config.ts`.

## How the simulator works

- Per-season stats are weighted by position (GK / DEF / MID / FWD), club tier
  (1–4) and an age curve peaking 24–30.
- Club results draw league position, national-cup wins and a continental run
  (Champions League, Libertadores, Sudamericana, AFC CL, Concacaf CC, …).
- National-team participation grows with rating and age. Tournaments fall on
  real calendar years: World Cup 2026/30/34/38…, UEFA Euro & Copa América on
  even years, UEFA Nations League Finals & AFC Asian Cup on odd years.
- **Bonus club silverware** is gated by history:
  - **UEFA Super Cup** — only awarded once you've lifted both Champions League
    AND Europa League at some point in your career.
  - **Recopa Sudamericana** — same idea: requires both Libertadores AND
    Sudamericana.
  - **FIFA Club World Cup** — only on CWC years (3 years after each World
    Cup: 2029, 2033, 2037…), awarded to top-confederation champions.
  - **Intercontinental Cup** — endgame trophy, only unlocks once you've won
    the max competition of every confederation (UCL + Libertadores + AFC CL
    + Concacaf CC).
- Individual awards (Ballon d'Or, FIFA The Best, Golden Boot, League MVP,
  Continental Player of the Year) are rare and triggered by big seasons paired
  with silverware. The Golden Boot has its own boot-shaped icon.
- Offers at season's end:
  - **Renew** with a 0–30 % salary bump.
  - **Transfer** — a different club, biased upward by rating and downward by
    age, with transfer fee and salary scaled to club tier.
- The whole career is persisted to `localStorage` under `career-sim:v1`. You
  can exit at any time (top-right **Exit** button) and the landing page will
  offer a **Resume career** banner the next time you visit.

## Project layout

```
app/
  page.tsx                  hero + creation screen
  career/page.tsx           dashboard (player card + timeline + simulate)
  career/season/page.tsx    season debrief + transfer offers
  career/retire/page.tsx    retirement summary (journey + trophy shelf)
components/
  Hero.tsx                  presentation hero with floating crests
  PlayerCard.tsx            FIFA-style player card
  ResumeBanner.tsx          landing-page resume strip
  OfferCard.tsx             renew vs transfer
  TrophyShelf.tsx           grouped trophy room
  Trophy.tsx                tile + icons (Cup, Boot, Ballon, Flag)
  Crest.tsx                 generated SVG fallback for missing logos
  Logo.tsx                  ClubLogo + Flag with onError fallback
  SiteHeader, Marquee, Stat, SeasonRow, ...
lib/
  countries.ts              14 supported federations + flag helpers
  leagues.ts                first divisions and clubs (~270)
  names.ts                  invented per-country name pools
  competitions.ts           UEFA / CONMEBOL / CONCACAF / AFC + national cups
  simulator.ts              stats, club results, NT, bonus trophies, awards
  offers.ts                 end-of-season renewal + transfer generation
  store.ts                  Zustand + persist (localStorage)
  logos.ts                  URL helpers, color/initials for SVG fallback
  format.ts                 money + ordinal helpers
  random.ts                 rng helpers
public/
  clubs/                    PNG club crests, 14 countries (~270 files)
  national-teams/           PNG / SVG national-team crests (48 teams)
  tournaments/              SVG continental & national-tournament logos (17)
types/index.ts              shared TypeScript types
```

## Credits

- Club, national-team and competition logos shipped in `public/` come from
  the **football-logos.cc** pack.
- Country flags come from [flagcdn.com](https://flagcdn.com).
- Typography: **Anton** (display), **Manrope** (body), **JetBrains Mono**
  (numbers), all via `next/font/google`.

This is a fictional simulator for entertainment. All club, competition and
federation names are used to identify the real-world entities they refer to;
the simulator's outcomes and the player names it generates are completely
invented.

## License

[MIT](./LICENSE)
