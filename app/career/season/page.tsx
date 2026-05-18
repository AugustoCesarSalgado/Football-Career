"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCareer, CAREER_CONFIG } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { BigStat } from "@/components/Stat";
import { OfferCard } from "@/components/OfferCard";
import { TrophyTile, type TrophyKind } from "@/components/Trophy";
import { ClubLogo, Flag } from "@/components/Logo";
import { clubLogoUrl, nationalTeamLogoUrl } from "@/lib/logos";
import { COMP_BY_ID, NATIONAL_CUPS } from "@/lib/competitions";
import { COUNTRY_BY_CODE } from "@/lib/countries";
import { ordinal, fmtMoney } from "@/lib/format";
import { POSITION_LABEL } from "@/lib/squadNumbers";

export default function SeasonResultPage() {
  const router = useRouter();
  const { career, acceptOffer } = useCareer();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!career) {
      router.replace("/");
      return;
    }
    if (!career.pendingOffers) router.replace("/career");
  }, [career, hydrated, router]);

  if (!hydrated || !career || !career.pendingOffers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-bone-3 uppercase tracking-[0.3em] text-xs">
          loading…
        </span>
      </div>
    );
  }

  const season = career.seasons[career.seasons.length - 1];
  const year = career.startYear + (season.age - 18);
  const { renew, transfer } = career.pendingOffers;
  const trophies = buildTrophies(season, year, career.player.currentCountry);

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <SiteHeader
        rightSlot={
          <>
            <span>Season {season.index}</span>
            <span className="text-bone-3">·</span>
            <span>Age {season.age}</span>
          </>
        }
      />

      <main className="flex-1 bg-pitch-grid">
        <div className="max-w-[1500px] mx-auto px-8 py-10 space-y-10">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4 anim-rise">
            <div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-pitch font-mono">
                <span className="inline-block w-10 h-px bg-pitch" />
                Season {year - 1}/{String(year).slice(2)} · debrief
              </div>
              <h1 className="font-display text-[clamp(56px,8vw,124px)] leading-[0.86] tracking-tight text-bone uppercase mt-2">
                The {season.age}-year-old<br />
                <span className="text-pitch">{cardline(season)}</span>
              </h1>
            </div>
            <div className="flex items-center gap-3 border border-line bg-ink-2 px-4 py-3">
              <ClubLogo
                name={season.clubName}
                url={clubLogoUrl(season.clubId)}
                size={44}
              />
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                  Finished {ordinal(season.club.leaguePosition)} in
                </div>
                <div className="font-display text-2xl text-bone leading-none">
                  {season.league}
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-display text-2xl uppercase tracking-wide text-bone">
                Individual stats
              </h2>
              <span className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                {POSITION_LABEL[career.player.position]} · #
                {career.player.number}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <BigStat label="Appearances" value={season.stats.appearances} delayMs={60} />
              <BigStat
                label="Goals"
                value={season.stats.goals}
                accent="pitch"
                delayMs={120}
              />
              <BigStat
                label="Assists"
                value={season.stats.assists}
                accent="pitch"
                delayMs={180}
              />
              <BigStat
                label="Rating"
                value={season.stats.rating}
                accent="gold"
                delayMs={240}
                format={(n) => n.toFixed(1)}
              />
              {season.stats.cleanSheets !== undefined && (
                <BigStat
                  label="Clean sheets"
                  value={season.stats.cleanSheets}
                  delayMs={300}
                />
              )}
              {season.stats.saves !== undefined && (
                <BigStat label="Saves" value={season.stats.saves} delayMs={360} />
              )}
              {season.stats.tackles !== undefined && (
                <BigStat
                  label="Tackles"
                  value={season.stats.tackles}
                  delayMs={300}
                />
              )}
              {season.stats.interceptions !== undefined && (
                <BigStat
                  label="Interceptions"
                  value={season.stats.interceptions}
                  delayMs={360}
                />
              )}
              <BigStat
                label="Yellow"
                value={season.stats.yellowCards}
                delayMs={420}
              />
              <BigStat
                label="Red"
                value={season.stats.redCards}
                accent={season.stats.redCards > 0 ? "blood" : undefined}
                delayMs={480}
              />
            </div>
          </section>

          {/* Trophies + national team */}
          <section className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7">
              <h2 className="font-display text-2xl uppercase tracking-wide text-bone mb-3">
                Trophy room
              </h2>
              {trophies.length === 0 ? (
                <div className="border border-dashed border-line bg-ink-2 p-8 text-center">
                  <div className="font-display text-2xl text-bone-3 uppercase tracking-wide">
                    No silverware this year
                  </div>
                  <div className="text-bone-3 text-xs font-mono mt-2 uppercase tracking-widest">
                    Keep grinding
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trophies.map((t, i) => (
                    <div
                      key={i}
                      className="anim-rise"
                      style={{ animationDelay: `${300 + i * 80}ms` }}
                    >
                      <TrophyTile trophy={t} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="col-span-12 lg:col-span-5">
              <h2 className="font-display text-2xl uppercase tracking-wide text-bone mb-3">
                National team
              </h2>
              <div className="border border-line bg-ink-2 p-5 bg-noise relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <ClubLogo
                    name={COUNTRY_BY_CODE[career.player.countryCode]?.name ?? career.player.countryCode}
                    url={nationalTeamLogoUrl(career.player.countryCode)}
                    size={40}
                  />
                  <div className="font-display text-2xl text-bone tracking-wide">
                    {COUNTRY_BY_CODE[career.player.countryCode]?.name ?? career.player.countryCode}
                  </div>
                </div>
                {!season.national.called ? (
                  <p className="mt-4 text-bone-3 text-sm font-mono uppercase tracking-widest">
                    Not called up this cycle.
                  </p>
                ) : (
                  <>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="border border-line bg-ink-3 px-3 py-2">
                        <div className="text-[9px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                          Caps
                        </div>
                        <div className="font-display text-3xl text-bone leading-none">
                          {season.national.caps}
                        </div>
                      </div>
                      <div className="border border-line bg-ink-3 px-3 py-2">
                        <div className="text-[9px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                          Goals
                        </div>
                        <div className="font-display text-3xl text-pitch leading-none">
                          {season.national.goals}
                        </div>
                      </div>
                    </div>
                    {season.national.tournament && (
                      <div className="mt-4 border border-gold/40 bg-gold/5 px-3 py-2">
                        <div className="text-[9px] uppercase tracking-[0.3em] text-gold-2 font-mono">
                          {season.national.tournament.name}
                        </div>
                        <div className="text-bone font-medium">
                          {labelTour(season.national.tournament.result)}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Offers */}
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display text-3xl uppercase tracking-wide text-bone">
                Transfer window
              </h2>
              <span className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                Pick one offer to advance
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <OfferCard
                offer={renew}
                current={{ salaryEur: career.player.salaryEur }}
                onAccept={() => {
                  acceptOffer(renew);
                  navigateNext(router, season.age);
                }}
              />
              <OfferCard
                offer={transfer}
                current={{ salaryEur: career.player.salaryEur }}
                onAccept={() => {
                  acceptOffer(transfer);
                  navigateNext(router, season.age);
                }}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function navigateNext(router: ReturnType<typeof useRouter>, age: number) {
  if (age + 1 > CAREER_CONFIG.RETIREMENT_AGE) router.push("/career/retire");
  else router.push("/career");
}

function cardline(season: import("@/types").Season): string {
  if (season.awards.includes("Ballon d'Or")) return "Ballon d'Or winner.";
  if (season.club.continentalResult === "champion") return "Continental king.";
  if (season.club.leagueWin) return "League champion.";
  if (season.stats.rating >= 8.4) return "Phenomenon.";
  if (season.stats.goals >= 25) return "Goal machine.";
  if (season.stats.assists >= 15) return "Playmaker supreme.";
  if (season.stats.rating < 6.4) return "Tough year.";
  return "Season debrief.";
}

function labelTour(r: string): string {
  switch (r) {
    case "champion":
      return "🏆 Champions";
    case "runner-up":
      return "🥈 Runner-up";
    case "semifinal":
      return "Semifinal";
    case "quarterfinal":
      return "Quarterfinal";
    default:
      return "Group stage";
  }
}

function buildTrophies(
  season: import("@/types").Season,
  year: number,
  countryCode: string,
): TrophyKind[] {
  const list: TrophyKind[] = [];
  if (season.club.leagueWin) {
    list.push({ kind: "league", name: season.league, year });
  }
  if (season.club.nationalCupWon) {
    list.push({
      kind: "cup",
      name: NATIONAL_CUPS[countryCode]?.name ?? "Domestic Cup",
      year,
    });
  }
  if (season.club.continentalResult === "champion" && season.club.continentalCompetition) {
    const comp = COMP_BY_ID[season.club.continentalCompetition];
    if (comp)
      list.push({
        kind: "continental",
        compId: comp.id,
        name: comp.name,
        year,
      });
  }
  for (const bonusId of season.club.bonusTrophies ?? []) {
    const comp = COMP_BY_ID[bonusId];
    if (comp) list.push({ kind: "bonus", compId: comp.id, name: comp.name, year });
  }
  if (season.national.tournament?.result === "champion") {
    list.push({
      kind: "national",
      name: season.national.tournament.name,
      year,
    });
  }
  for (const a of season.awards) {
    list.push({ kind: "award", name: a, year });
  }
  return list;
}
