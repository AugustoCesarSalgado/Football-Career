"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCareer } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { ClubLogo } from "@/components/Logo";
import { type TrophyKind } from "@/components/Trophy";
import { TrophyShelf } from "@/components/TrophyShelf";
import { BigStat } from "@/components/Stat";
import { clubLogoUrl } from "@/lib/logos";
import { COMP_BY_ID, NATIONAL_CUPS } from "@/lib/competitions";
import { fmtMoney } from "@/lib/format";

export default function RetirePage() {
  const router = useRouter();
  const { career, reset } = useCareer();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!career) router.replace("/");
  }, [career, hydrated, router]);

  const aggregates = useMemo(() => {
    if (!career) return null;
    const totals = career.seasons.reduce(
      (acc, s) => {
        acc.goals += s.stats.goals;
        acc.assists += s.stats.assists;
        acc.apps += s.stats.appearances;
        acc.cleanSheets += s.stats.cleanSheets ?? 0;
        acc.saves += s.stats.saves ?? 0;
        acc.tackles += s.stats.tackles ?? 0;
        acc.intercepts += s.stats.interceptions ?? 0;
        acc.yellow += s.stats.yellowCards;
        acc.red += s.stats.redCards;
        acc.ratingSum += s.stats.rating;
        acc.caps += s.national.caps;
        acc.ntGoals += s.national.goals;
        return acc;
      },
      {
        goals: 0, assists: 0, apps: 0, cleanSheets: 0, saves: 0,
        tackles: 0, intercepts: 0, yellow: 0, red: 0,
        ratingSum: 0, caps: 0, ntGoals: 0,
      },
    );
    const avgRating = +(totals.ratingSum / Math.max(1, career.seasons.length)).toFixed(2);

    type Stint = {
      id: string; name: string; league: string;
      from: number; to: number; transferFeeEur?: number;
    };
    const stints: Stint[] = [];
    let current: Stint | null = null;
    for (const s of career.seasons) {
      const year = career.startYear + (s.age - 18);
      if (!current || current.id !== s.clubId) {
        current = { id: s.clubId, name: s.clubName, league: s.league, from: year, to: year };
        stints.push(current);
      } else {
        current.to = year;
      }
    }
    for (let i = 0; i < stints.length - 1; i++) {
      const lastSeasonOfStint = career.seasons.findLast(
        (s) => s.clubId === stints[i].id && career.startYear + (s.age - 18) === stints[i].to,
      );
      if (lastSeasonOfStint?.transferFeeEur) {
        stints[i + 1].transferFeeEur = lastSeasonOfStint.transferFeeEur;
      }
    }

    const trophies: TrophyKind[] = [];
    for (const s of career.seasons) {
      const year = career.startYear + (s.age - 18);
      if (s.club.leagueWin) trophies.push({ kind: "league", name: s.league, year });
      if (s.club.nationalCupWon)
        trophies.push({ kind: "cup", name: NATIONAL_CUPS[s.clubCountry]?.name ?? "Domestic Cup", year });
      if (s.club.continentalResult === "champion" && s.club.continentalCompetition) {
        const comp = COMP_BY_ID[s.club.continentalCompetition];
        if (comp) trophies.push({ kind: "continental", compId: comp.id, name: comp.name, year });
      }
      for (const bonusId of s.club.bonusTrophies ?? []) {
        const comp = COMP_BY_ID[bonusId];
        if (comp) trophies.push({ kind: "bonus", compId: comp.id, name: comp.name, year });
      }
      if (s.national.tournament?.result === "champion")
        trophies.push({ kind: "national", name: s.national.tournament.name, year });
      for (const a of s.awards) trophies.push({ kind: "award", name: a, year });
    }

    return { totals, avgRating, clubs: stints, trophies };
  }, [career]);

  if (!hydrated || !career || !aggregates) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-bone-3 uppercase tracking-widest text-xs">
          loading career…
        </span>
      </div>
    );
  }

  const { totals, avgRating, clubs, trophies } = aggregates;
  const verdict = makeVerdict(trophies.length, avgRating, totals.goals);
  const label = scoreLabel(trophies.length, avgRating);

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <SiteHeader rightSlot={<span className="text-gold">Retired</span>} />

      <main className="flex-1 bg-pitch-grid">
        <div className="max-w-[1400px] mx-auto px-6 py-14 space-y-12">

          {/* ── Hero — CENTERED (not left-heavy like before) ── */}
          <div className="text-center anim-rise">
            <div className="inline-flex items-center gap-2 text-[11px] text-gold font-mono uppercase tracking-widest mb-5">
              <span className="w-8 h-px bg-gold" />
              {career.startYear} — {career.startYear + 22} · final whistle
              <span className="w-8 h-px bg-gold" />
            </div>
            <h1 className="font-display font-bold text-[clamp(56px,10vw,160px)] leading-[0.88] tracking-tight">
              <span className="text-bone">{career.player.firstName}</span>
              <br />
              <span className="text-gold glow-amber">{career.player.lastName}</span>
            </h1>
            <p className="mt-5 text-bone-2 text-lg max-w-2xl mx-auto leading-relaxed">
              Hangs up the boots at 40. {verdict}
            </p>

            {/* Verdict card — centered, full-width max */}
            <div className="mt-8 max-w-md mx-auto rounded-2xl border border-gold/30 bg-gold/5 p-6">
              <div className="text-[11px] text-gold font-mono uppercase tracking-widest mb-2">
                Legacy verdict
              </div>
              <div className="font-display font-bold text-5xl text-gold leading-none glow-amber">
                {label}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-line bg-ink-3 px-3 py-2">
                  <div className="text-[9px] text-bone-3 font-mono uppercase tracking-widest">Avg rating</div>
                  <div className="num text-xl font-bold text-bone mt-0.5">{avgRating.toFixed(2)}</div>
                </div>
                <div className="rounded-xl border border-gold/30 bg-gold/5 px-3 py-2">
                  <div className="text-[9px] text-bone-3 font-mono uppercase tracking-widest">Trophies</div>
                  <div className="num text-xl font-bold text-gold mt-0.5">{trophies.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Career totals ── */}
          <section>
            <h2 className="font-display font-bold text-2xl tracking-tight text-bone mb-4">
              Career totals
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <BigStat label="Goals" value={totals.goals} accent="pitch" />
              <BigStat label="Assists" value={totals.assists} />
              <BigStat label="Apps" value={totals.apps} />
              <BigStat label="Caps (NT)" value={totals.caps} accent="gold" />
              <BigStat label="NT goals" value={totals.ntGoals} accent="gold" />
              <BigStat label="Yellow" value={totals.yellow} />
              {totals.cleanSheets > 0 && <BigStat label="Clean sheets" value={totals.cleanSheets} />}
              {totals.saves > 0 && <BigStat label="Saves" value={totals.saves} />}
              {totals.tackles > 0 && <BigStat label="Tackles" value={totals.tackles} />}
              {totals.intercepts > 0 && <BigStat label="Intercepts" value={totals.intercepts} />}
            </div>
          </section>

          {/* ── Club journey — VERTICAL list (was horizontal scroll) ── */}
          <section>
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-display font-bold text-2xl tracking-tight text-bone">The journey</h2>
              <span className="text-[11px] text-bone-3 font-mono uppercase tracking-widest">
                {clubs.length} stop{clubs.length === 1 ? "" : "s"} · {career.seasons.length} seasons
              </span>
            </div>

            <div className="relative space-y-0">
              {/* Vertical timeline line */}
              <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-pitch/40 via-line to-line/20" />

              {clubs.map((c, i) => (
                <div key={`${c.id}-${i}`} className="relative flex items-start gap-5 pl-[60px] pb-6 anim-rise" style={{ animationDelay: `${100 + i * 90}ms` }}>
                  {/* Circle on timeline */}
                  <div
                    className={`absolute left-3 top-4 size-6 rounded-full border-2 flex items-center justify-center z-10 ${
                      i === 0
                        ? "border-pitch bg-pitch-deep"
                        : i === clubs.length - 1
                        ? "border-gold bg-gold-deep"
                        : "border-line bg-ink-3"
                    }`}
                  >
                    <span className={`font-mono text-[9px] font-bold ${
                      i === 0 ? "text-pitch" : i === clubs.length - 1 ? "text-gold" : "text-bone-3"
                    }`}>{i + 1}</span>
                  </div>

                  {/* Card */}
                  <div className="flex-1 rounded-2xl border border-line bg-ink-2 p-4 flex items-center gap-4">
                    <ClubLogo name={c.name} url={clubLogoUrl(c.id)} size={48} className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-lg text-bone leading-tight tracking-tight">
                        {c.name}
                      </div>
                      <div className="text-[11px] text-bone-3 font-mono uppercase tracking-widest">
                        {c.league}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="num text-bone-2 text-sm font-bold">
                        {c.from === c.to ? `${c.from}` : `${c.from} – ${c.to}`}
                      </div>
                      <div className="text-[11px] text-bone-3 font-mono">
                        {c.to - c.from + 1}y
                      </div>
                      {c.transferFeeEur && (
                        <div className="text-[10px] text-gold font-mono mt-0.5">
                          {fmtMoney(c.transferFeeEur)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Trophy room ── */}
          <section>
            <h2 className="font-display font-bold text-2xl tracking-tight text-bone mb-5">
              Trophy room
            </h2>
            <TrophyShelf trophies={trophies} />
          </section>

          {/* ── CTA ── */}
          <div className="pt-4 flex flex-wrap items-center gap-4 anim-rise">
            <button
              onClick={() => {
                reset();
                router.push("/");
              }}
              className="bg-pitch text-ink px-8 py-5 rounded-2xl font-display font-bold text-2xl tracking-tight hover:bg-pitch-2 transition-all hover:scale-[1.01]"
            >
              Begin a new career →
            </button>
            <span className="text-[11px] text-bone-3 font-mono uppercase tracking-widest">
              This career will be wiped.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

function scoreLabel(trophies: number, rating: number): string {
  if (trophies >= 12 && rating >= 8) return "Immortal";
  if (trophies >= 7 && rating >= 7.4) return "Legend";
  if (trophies >= 3 && rating >= 7) return "Star";
  if (trophies >= 1) return "Veteran";
  return "Journeyman";
}

function makeVerdict(trophies: number, rating: number, goals: number): string {
  if (trophies >= 10) return `A trophy cabinet that bends the lights. ${goals} goals to remember.`;
  if (trophies >= 5) return `A decorated career — multiple silverware nights and ${goals} goals.`;
  if (trophies >= 1) return `Some glory, plenty of grind, ${goals} goals scored.`;
  if (rating >= 7) return `Solid every Sunday, ${goals} goals across two decades.`;
  return `A career that came and went quietly — ${goals} goals to your name.`;
}
