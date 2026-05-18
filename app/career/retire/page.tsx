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
        goals: 0,
        assists: 0,
        apps: 0,
        cleanSheets: 0,
        saves: 0,
        tackles: 0,
        intercepts: 0,
        yellow: 0,
        red: 0,
        ratingSum: 0,
        caps: 0,
        ntGoals: 0,
      },
    );
    const avgRating = +(totals.ratingSum / Math.max(1, career.seasons.length)).toFixed(2);

    type Stint = {
      id: string;
      name: string;
      league: string;
      from: number;
      to: number;
      transferFeeEur?: number;
    };
    const stints: Stint[] = [];
    let current: Stint | null = null;
    for (const s of career.seasons) {
      const year = career.startYear + (s.age - 18);
      if (!current || current.id !== s.clubId) {
        current = {
          id: s.clubId,
          name: s.clubName,
          league: s.league,
          from: year,
          to: year,
        };
        stints.push(current);
      } else {
        current.to = year;
      }
      // The transfer fee on the *last* season of a stint is the fee paid
      // by the *next* club to acquire the player.
      if (s.transferFeeEur && current) {
        current.transferFeeEur = s.transferFeeEur;
      }
    }
    // Attach the fee to the *destination* of the transfer (next stint),
    // since that's the club that paid.
    for (let i = 0; i < stints.length - 1; i++) {
      const next = stints[i + 1];
      const lastSeasonOfStint = career.seasons.findLast(
        (s) =>
          s.clubId === stints[i].id &&
          career.startYear + (s.age - 18) === stints[i].to,
      );
      if (lastSeasonOfStint?.transferFeeEur) {
        next.transferFeeEur = lastSeasonOfStint.transferFeeEur;
      }
    }
    const clubs = stints;

    const trophies: TrophyKind[] = [];
    for (const s of career.seasons) {
      const year = career.startYear + (s.age - 18);
      if (s.club.leagueWin)
        trophies.push({ kind: "league", name: s.league, year });
      if (s.club.nationalCupWon)
        trophies.push({
          kind: "cup",
          name: NATIONAL_CUPS[s.clubCountry]?.name ?? "Domestic Cup",
          year,
        });
      if (s.club.continentalResult === "champion" && s.club.continentalCompetition) {
        const comp = COMP_BY_ID[s.club.continentalCompetition];
        if (comp)
          trophies.push({
            kind: "continental",
            compId: comp.id,
            name: comp.name,
            year,
          });
      }
      for (const bonusId of s.club.bonusTrophies ?? []) {
        const comp = COMP_BY_ID[bonusId];
        if (comp)
          trophies.push({ kind: "bonus", compId: comp.id, name: comp.name, year });
      }
      if (s.national.tournament?.result === "champion")
        trophies.push({
          kind: "national",
          name: s.national.tournament.name,
          year,
        });
      for (const a of s.awards)
        trophies.push({ kind: "award", name: a, year });
    }
    return { totals, avgRating, clubs, trophies };
  }, [career]);

  if (!hydrated || !career || !aggregates) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-bone-3 uppercase tracking-[0.3em] text-xs">
          loading career…
        </span>
      </div>
    );
  }

  const { totals, avgRating, clubs, trophies } = aggregates;
  const verdict = makeVerdict(trophies.length, avgRating, totals.goals);

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <SiteHeader rightSlot={<span>Retired</span>} />

      <main className="flex-1 bg-pitch-grid">
        <div className="max-w-[1500px] mx-auto px-8 py-14 space-y-12">
          {/* Hero */}
          <div className="grid grid-cols-12 gap-8 items-end anim-rise">
            <div className="col-span-12 lg:col-span-8">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-gold font-mono">
                <span className="inline-block w-10 h-px bg-gold" />
                {career.startYear} — {career.startYear + 22} · final whistle
              </div>
              <h1 className="font-display text-[clamp(64px,10vw,170px)] leading-[0.84] tracking-tight text-bone uppercase mt-2">
                {career.player.firstName}
                <br />
                <span className="text-gold">{career.player.lastName}</span>
              </h1>
              <p className="mt-4 text-bone-2 text-lg max-w-2xl">
                Hangs up the boots at 40. {verdict}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4">
              <div className="border border-gold/40 bg-gold/5 p-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold-2 font-mono">
                  Legacy verdict
                </div>
                <div className="font-display text-5xl text-gold leading-none mt-2 tracking-wide">
                  {scoreLabel(trophies.length, avgRating)}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-bone">
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                      Avg rating
                    </div>
                    <div className="num text-xl">{avgRating.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                      Trophies
                    </div>
                    <div className="num text-xl text-gold">{trophies.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Career totals */}
          <section>
            <h2 className="font-display text-3xl uppercase tracking-wide text-bone mb-4">
              Career totals
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <BigStat label="Goals" value={totals.goals} accent="pitch" />
              <BigStat label="Assists" value={totals.assists} />
              <BigStat label="Apps" value={totals.apps} />
              <BigStat label="Caps (NT)" value={totals.caps} accent="gold" />
              <BigStat label="NT goals" value={totals.ntGoals} accent="gold" />
              <BigStat
                label="Yellow"
                value={totals.yellow}
              />
              {totals.cleanSheets > 0 && (
                <BigStat label="Clean sheets" value={totals.cleanSheets} />
              )}
              {totals.saves > 0 && (
                <BigStat label="Saves" value={totals.saves} />
              )}
              {totals.tackles > 0 && (
                <BigStat label="Tackles" value={totals.tackles} />
              )}
              {totals.intercepts > 0 && (
                <BigStat label="Intercepts" value={totals.intercepts} />
              )}
            </div>
          </section>

          {/* Clubs journey */}
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display text-3xl uppercase tracking-wide text-bone">
                The journey
              </h2>
              <span className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                {clubs.length} stop{clubs.length === 1 ? "" : "s"} · {career.seasons.length} seasons
              </span>
            </div>

            <div className="border border-line bg-ink-2 px-6 py-8 overflow-x-auto">
              <ol className="flex items-stretch min-w-max">
                {clubs.map((c, i) => (
                  <li key={`${c.id}-${i}`} className="flex items-stretch">
                    <div
                      className="flex flex-col items-center gap-2 w-44 anim-rise"
                      style={{ animationDelay: `${120 + i * 90}ms` }}
                    >
                      <div className="relative flex items-center justify-center size-20 border border-line bg-ink-3">
                        <ClubLogo
                          name={c.name}
                          url={clubLogoUrl(c.id)}
                          size={56}
                        />
                        {i === 0 && (
                          <span className="absolute -top-2 -left-2 text-[9px] font-mono uppercase tracking-[0.25em] text-pitch bg-ink px-1.5">
                            start
                          </span>
                        )}
                        {i === clubs.length - 1 && i > 0 && (
                          <span className="absolute -top-2 -right-2 text-[9px] font-mono uppercase tracking-[0.25em] text-gold bg-ink px-1.5">
                            final
                          </span>
                        )}
                      </div>
                      <div className="font-display text-base text-bone leading-tight text-center px-1">
                        {c.name}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-bone-3 font-mono">
                        {c.league}
                      </div>
                      <div className="num text-bone-2 text-xs tracking-widest">
                        {c.from === c.to ? `${c.from}` : `${c.from} — ${c.to}`}
                      </div>
                      <div className="text-[10px] text-bone-3 font-mono">
                        {c.to - c.from + 1}y
                      </div>
                    </div>
                    {i < clubs.length - 1 && (
                      <TransferArrow fee={clubs[i + 1].transferFeeEur} />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Trophy room */}
          <section>
            <h2 className="font-display text-3xl uppercase tracking-wide text-bone mb-4">
              Trophy room
            </h2>
            <TrophyShelf trophies={trophies} />
          </section>

          {/* Action */}
          <div className="pt-4 flex flex-wrap items-center gap-4 anim-rise">
            <button
              onClick={() => {
                reset();
                router.push("/");
              }}
              className="bg-pitch text-ink px-8 py-5 font-display text-3xl tracking-wider uppercase hover:bg-pitch-2 transition-colors"
            >
              Begin a new career →
            </button>
            <span className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
              This career will be wiped.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

function TransferArrow({ fee }: { fee?: number }) {
  return (
    <div className="flex flex-col items-center justify-center mx-2 sm:mx-4 min-w-[68px] sm:min-w-[100px] pt-6">
      <div className="text-[9px] uppercase tracking-[0.3em] text-bone-3 font-mono mb-1">
        Transfer
      </div>
      <div className="relative w-full h-px bg-gradient-to-r from-bone-3/40 via-bone-3 to-pitch">
        <svg
          viewBox="0 0 16 12"
          className="absolute -right-1 top-1/2 -translate-y-1/2 w-4 h-3 text-pitch"
          fill="currentColor"
          aria-hidden
        >
          <path d="M0 5 H10 V2 L16 6 L10 10 V7 H0 Z" />
        </svg>
      </div>
      <div className="num text-xs text-gold mt-1 whitespace-nowrap">
        {fee ? fmtMoney(fee) : "free"}
      </div>
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
