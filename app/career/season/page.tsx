"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCareer, CAREER_CONFIG } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { OfferCard } from "@/components/OfferCard";
import { TrophyTile, type TrophyKind } from "@/components/Trophy";
import { TransferAnimation } from "@/components/TransferAnimation";
import { ClubLogo, Flag } from "@/components/Logo";
import { clubLogoUrl, nationalTeamLogoUrl } from "@/lib/logos";
import { COMP_BY_ID, NATIONAL_CUPS } from "@/lib/competitions";
import { COUNTRY_BY_CODE } from "@/lib/countries";
import { ordinal, fmtMoney } from "@/lib/format";
import { POSITION_LABEL } from "@/lib/squadNumbers";
import type { Offer } from "@/types";

export default function SeasonResultPage() {
  const router = useRouter();
  const { career, acceptOffer } = useCareer();
  const [hydrated, setHydrated] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState<Offer | null>(null);

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

  const onTransferDone = useCallback(() => {
    if (!pendingTransfer || !career) return;
    const age = career.seasons[career.seasons.length - 1].age;
    acceptOffer(pendingTransfer);
    navigateNext(router, age);
  }, [pendingTransfer, career, acceptOffer, router]);

  if (!hydrated || !career || !career.pendingOffers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-bone-3 uppercase tracking-widest text-xs">
          loading…
        </span>
      </div>
    );
  }

  const season = career.seasons[career.seasons.length - 1];
  const year = career.startYear + (season.age - 18);
  const { renew, transfer } = career.pendingOffers;
  const trophies = buildTrophies(season, year, career.player.currentCountry);

  const ratingColor =
    season.stats.rating >= 8.5
      ? "text-pitch border-pitch/40 bg-pitch/10"
      : season.stats.rating >= 7.5
      ? "text-gold border-gold/40 bg-gold/10"
      : season.stats.rating < 6.5
      ? "text-blood border-blood/40 bg-blood/10"
      : "text-bone-2 border-line bg-ink-3";

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      {pendingTransfer && (
        <TransferAnimation
          from={{
            clubId: season.clubId,
            clubName: season.clubName,
            league: season.league,
            countryCode: season.clubCountry,
          }}
          to={pendingTransfer}
          onDone={onTransferDone}
        />
      )}

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
        <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">

          {/* ── Season header ── */}
          <div className="flex flex-wrap items-end justify-between gap-4 anim-rise">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] text-pitch font-mono uppercase tracking-widest mb-3">
                <span className="w-8 h-px bg-pitch" />
                Season {year - 1}/{String(year).slice(2)} · debrief
              </div>
              <h1 className="font-display font-bold text-[clamp(40px,6vw,88px)] leading-[0.88] tracking-tight text-bone">
                The {season.age}-year-old
                <br />
                <span className="text-pitch glow-teal">{cardline(season)}</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Club pill */}
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-ink-2 px-4 py-3">
                <ClubLogo name={season.clubName} url={clubLogoUrl(season.clubId)} size={36} clubId={season.clubId} />
                <div>
                  <div className="text-[10px] text-bone-3 font-mono uppercase tracking-widest">
                    {ordinal(season.club.leaguePosition)} in
                  </div>
                  <div className="font-display font-bold text-lg text-bone leading-tight tracking-tight">
                    {season.league}
                  </div>
                </div>
              </div>

              {/* Rating badge */}
              <div className={`flex flex-col items-center justify-center size-20 rounded-2xl border-2 font-display font-bold ${ratingColor}`}>
                <span className="text-3xl leading-none">{season.stats.rating.toFixed(1)}</span>
                <span className="text-[9px] font-mono uppercase tracking-widest mt-1 opacity-70">rating</span>
              </div>
            </div>
          </div>

          {/* ── Transfer window (moved to TOP for higher prominence) ── */}
          <section className="anim-rise delay-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-2xl tracking-tight text-bone">
                Transfer window
              </h2>
              <span className="text-[11px] text-bone-3 font-mono uppercase tracking-widest">
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
                onAccept={() => setPendingTransfer(transfer)}
              />
            </div>
          </section>

          {/* ── Stats row (horizontal scroll cards) ── */}
          <section className="anim-rise delay-200">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display font-bold text-2xl tracking-tight text-bone">
                Individual stats
              </h2>
              <span className="text-[11px] text-bone-3 font-mono uppercase tracking-widest">
                {POSITION_LABEL[career.player.position]} · #{career.player.number}
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
              <StatCard label="Apps" value={season.stats.appearances} />
              <StatCard label="Goals" value={season.stats.goals} accent="pitch" />
              <StatCard label="Assists" value={season.stats.assists} accent="pitch" />
              <StatCard label="Rating" value={season.stats.rating} accent="gold" format={(n) => n.toFixed(1)} />
              {season.stats.cleanSheets !== undefined && (
                <StatCard label="Clean sheets" value={season.stats.cleanSheets} />
              )}
              {season.stats.saves !== undefined && (
                <StatCard label="Saves" value={season.stats.saves} />
              )}
              {season.stats.tackles !== undefined && (
                <StatCard label="Tackles" value={season.stats.tackles} />
              )}
              {season.stats.interceptions !== undefined && (
                <StatCard label="Interceptions" value={season.stats.interceptions} />
              )}
              <StatCard label="Yellow" value={season.stats.yellowCards} />
              <StatCard
                label="Red"
                value={season.stats.redCards}
                accent={season.stats.redCards > 0 ? "blood" : undefined}
              />
            </div>
          </section>

          {/* ── National team (left) + Trophy room (right) — order swapped vs old ── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 anim-rise delay-300">
            {/* National team — now on the LEFT */}
            <div className="lg:col-span-5">
              <h2 className="font-display font-bold text-xl tracking-tight text-bone mb-3">
                National team
              </h2>
              <div className="rounded-2xl border border-line bg-ink-2 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <ClubLogo
                    name={COUNTRY_BY_CODE[career.player.countryCode]?.name ?? career.player.countryCode}
                    url={nationalTeamLogoUrl(career.player.countryCode)}
                    size={36}
                  />
                  <div className="font-display font-bold text-xl text-bone tracking-tight">
                    {COUNTRY_BY_CODE[career.player.countryCode]?.name ?? career.player.countryCode}
                  </div>
                </div>
                {!season.national.called ? (
                  <p className="text-bone-3 text-sm font-mono uppercase tracking-widest">
                    Not called up this cycle.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="rounded-xl border border-line bg-ink-3 px-3 py-2.5">
                        <div className="text-[9px] text-bone-3 font-mono uppercase tracking-widest">Caps</div>
                        <div className="font-display font-bold text-3xl text-bone leading-none mt-0.5">
                          {season.national.caps}
                        </div>
                      </div>
                      <div className="rounded-xl border border-line bg-ink-3 px-3 py-2.5">
                        <div className="text-[9px] text-bone-3 font-mono uppercase tracking-widest">NT Goals</div>
                        <div className="font-display font-bold text-3xl text-pitch leading-none mt-0.5">
                          {season.national.goals}
                        </div>
                      </div>
                    </div>
                    {season.national.tournament && (
                      <div className="rounded-xl border border-gold/30 bg-gold/5 px-3 py-2.5">
                        <div className="text-[9px] text-gold font-mono uppercase tracking-widest">
                          {season.national.tournament.name}
                        </div>
                        <div className="text-bone font-semibold text-sm mt-0.5">
                          {labelTour(season.national.tournament.result)}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Trophy room — now on the RIGHT */}
            <div className="lg:col-span-7">
              <h2 className="font-display font-bold text-xl tracking-tight text-bone mb-3">
                Trophy room
              </h2>
              {trophies.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line/60 bg-ink-2 p-8 text-center">
                  <div className="font-display font-bold text-xl text-bone-3 tracking-tight">
                    No silverware this year
                  </div>
                  <div className="text-bone-3 text-xs font-mono mt-2 uppercase tracking-widest">
                    Keep grinding
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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

function StatCard({
  label,
  value,
  accent,
  format,
}: {
  label: string;
  value: number;
  accent?: "pitch" | "gold" | "blood";
  format?: (n: number) => string;
}) {
  const color =
    accent === "pitch" ? "text-pitch glow-teal" :
    accent === "gold" ? "text-gold glow-amber" :
    accent === "blood" ? "text-blood" :
    "text-bone";

  return (
    <div className="shrink-0 w-28 rounded-2xl border border-line bg-ink-2 p-4">
      <div className="text-[9px] text-bone-3 font-mono uppercase tracking-widest mb-2">{label}</div>
      <div className={`font-display font-bold text-4xl leading-none ${color}`}>
        {format ? format(value) : value}
      </div>
    </div>
  );
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
    case "champion": return "🏆 Champions";
    case "runner-up": return "🥈 Runner-up";
    case "semifinal": return "Semifinal";
    case "quarterfinal": return "Quarterfinal";
    default: return "Group stage";
  }
}

function buildTrophies(
  season: import("@/types").Season,
  year: number,
  countryCode: string,
): TrophyKind[] {
  const list: TrophyKind[] = [];
  if (season.club.leagueWin) list.push({ kind: "league", name: season.league, year });
  if (season.club.nationalCupWon)
    list.push({ kind: "cup", name: NATIONAL_CUPS[countryCode]?.name ?? "Domestic Cup", year });
  if (season.club.continentalResult === "champion" && season.club.continentalCompetition) {
    const comp = COMP_BY_ID[season.club.continentalCompetition];
    if (comp) list.push({ kind: "continental", compId: comp.id, name: comp.name, year });
  }
  for (const bonusId of season.club.bonusTrophies ?? []) {
    const comp = COMP_BY_ID[bonusId];
    if (comp) list.push({ kind: "bonus", compId: comp.id, name: comp.name, year });
  }
  if (season.national.tournament?.result === "champion")
    list.push({ kind: "national", name: season.national.tournament.name, year });
  for (const a of season.awards) list.push({ kind: "award", name: a, year });
  return list;
}
