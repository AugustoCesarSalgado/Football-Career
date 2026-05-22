"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCareer, CAREER_CONFIG } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { OfferCard } from "@/components/OfferCard";
import { TrophyTile, type TrophyKind } from "@/components/Trophy";
import { TransferAnimation } from "@/components/TransferAnimation";
import { ClubLogo, Flag } from "@/components/Logo";
import { clubLogoUrl, nationalTeamLogoUrl, leagueLogoUrlByName } from "@/lib/logos";
import { COMP_BY_ID, NATIONAL_CUPS, SECONDARY_NATIONAL_CUPS } from "@/lib/competitions";
import { COUNTRY_BY_CODE } from "@/lib/countries";
import { ordinal, fmtMoney } from "@/lib/format";
import { POSITION_LABEL } from "@/lib/squadNumbers";
import type { Offer, StandingRow } from "@/types";

export default function SeasonResultPage() {
  const router = useRouter();
  const { career, acceptOffer } = useCareer();
  const [hydrated, setHydrated] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState<Offer | null>(null);
  const [showTable, setShowTable] = useState(false);

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

            <div className="flex items-center gap-4 flex-wrap">
              {/* Club pill */}
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-ink-2 px-4 py-3">
                <ClubLogo name={season.clubName} url={clubLogoUrl(season.clubId)} size={36} clubId={season.clubId} />
                <div>
                  <div className="text-[10px] text-bone-3 font-mono uppercase tracking-widest">
                    {ordinal(season.club.leaguePosition)} in
                  </div>
                  <div className="flex items-center gap-1.5 font-display font-bold text-lg text-bone leading-tight tracking-tight">
                    {leagueLogoUrlByName(season.league) && (
                      <img
                        src={leagueLogoUrlByName(season.league)!}
                        alt={season.league}
                        width={22}
                        height={22}
                        className="object-contain shrink-0"
                      />
                    )}
                    {season.league}
                  </div>
                </div>
                {season.standings && season.standings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowTable(true)}
                    className="ml-1 px-2.5 py-1.5 rounded-lg border border-pitch/40 bg-pitch/10 text-pitch text-[10px] font-mono uppercase tracking-widest hover:bg-pitch/20 transition-colors shrink-0"
                  >
                    Tabla
                  </button>
                )}
              </div>

              {/* Promotion / relegation badge */}
              {season.club.promoted && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-pitch/40 bg-pitch/10">
                  <span className="text-lg">↑</span>
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-pitch">Promoted</div>
                    <div className="text-xs font-display font-bold text-bone">LaLiga</div>
                  </div>
                </div>
              )}
              {season.club.relegated && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-blood/40 bg-blood/10">
                  <span className="text-lg">↓</span>
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-blood">Relegated</div>
                    <div className="text-xs font-display font-bold text-bone">LaLiga Hypermotion</div>
                  </div>
                </div>
              )}

              {/* Rating badge */}
              <div className={`flex flex-col items-center justify-center size-20 rounded-2xl border-2 font-display font-bold ${ratingColor}`}>
                <span className="text-3xl leading-none">{season.stats.rating.toFixed(1)}</span>
                <span className="text-[9px] font-mono uppercase tracking-widest mt-1 opacity-70">rating</span>
              </div>
            </div>
          </div>

          {/* ── Transfer window / Retire ── */}
          {season.age >= CAREER_CONFIG.RETIREMENT_AGE ? (
            <section className="anim-rise delay-100">
              <div className="rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/8 via-ink-2 to-ink-3 overflow-hidden">
                <div className="px-8 py-10 flex flex-col items-center text-center gap-5">
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-gold/70">
                    Fin de carrera
                  </div>
                  <h2 className="font-display font-bold text-4xl text-bone tracking-tight leading-tight">
                    {season.age} años.<br />
                    <span className="text-gold">Una leyenda.</span>
                  </h2>
                  <p className="text-bone-3 text-sm max-w-xs">
                    Has llegado al final de tu carrera profesional. Es hora de colgar los botines.
                  </p>
                  <button
                    onClick={() => {
                      acceptOffer(renew);
                      router.push("/career/retire");
                    }}
                    className="mt-2 px-10 py-4 rounded-xl bg-gold text-ink font-display font-bold text-lg tracking-tight hover:bg-gold-2 active:scale-95 transition-all"
                  >
                    Retirarse
                  </button>
                </div>
              </div>
            </section>
          ) : (
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
          )}

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

      {showTable && season.standings && (
        <LeagueTableModal
          league={season.league}
          standings={season.standings}
          playerClubId={season.clubId}
          onClose={() => setShowTable(false)}
        />
      )}
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
  if (season.club.leagueCupWon) {
    const sec = SECONDARY_NATIONAL_CUPS[countryCode];
    if (sec) list.push({ kind: "cup", name: sec.name, year });
  }
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

/* ─────────────────────────────────────────────────────────────── */
/* League Table Modal                                              */
/* ─────────────────────────────────────────────────────────────── */

const LT_STYLES = `
@keyframes lt-in  { from { opacity:0; transform:translateY(32px) scale(0.96); } to { opacity:1; transform:none; } }
@keyframes lt-out { from { opacity:1; transform:none; } to { opacity:0; transform:translateY(32px) scale(0.96); } }
@keyframes lt-bd-in  { from { opacity:0; } to { opacity:1; } }
@keyframes lt-bd-out { from { opacity:1; } to { opacity:0; } }
@keyframes lt-row-in { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:none; } }
`;
const LT_DUR = 260;

type ZoneType = "ucl" | "uel" | "uecl" | "promo" | "playoff" | "relegation" | null;

function LeagueTableModal({
  league,
  standings,
  playerClubId,
  onClose,
}: {
  league: string;
  standings: StandingRow[];
  playerClubId: string;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);

  function dismiss() {
    setClosing(true);
    setTimeout(onClose, LT_DUR);
  }

  const ease = "cubic-bezier(0.22,1,0.36,1)";
  const dur = `${LT_DUR}ms`;
  const logoUrl = leagueLogoUrlByName(league);
  const total = standings.length;

  const isHypermotion = league === "LaLiga Hypermotion";
  const isConmebol = league === "Liga Profesional" || league === "Brasileirão";
  const promoAuto = isHypermotion ? 2 : 0;
  const promoPlayoff = isHypermotion ? 4 : 0;
  const relegCount = league === "Liga Profesional" ? 3 : league === "Brasileirão" ? 4 : 2;
  const relegStart = total - relegCount;

  const euZones: { ucl: number; uel: [number, number]; uecl: number } = (() => {
    if (league === "Serie A" || league === "Bundesliga")
      return { ucl: 4, uel: [5, 6], uecl: 7 };
    if (league === "Ligue 1")
      return { ucl: 3, uel: [4, 5], uecl: 6 };
    return { ucl: 5, uel: [6, 6], uecl: 7 };
  })();

  function getZone(pos: number, _isPlayer: boolean): ZoneType {
    const i = pos - 1;
    if (isHypermotion) {
      if (i < promoAuto) return "promo";
      if (i < promoPlayoff) return "playoff";
    } else if (isConmebol) {
      if (pos <= 5) return "uel";
      if (pos >= 6 && pos <= 11) return "ucl";
    } else {
      if (pos <= euZones.ucl) return "ucl";
      if (pos >= euZones.uel[0] && pos <= euZones.uel[1]) return "uel";
      if (pos === euZones.uecl) return "uecl";
    }
    if (i >= relegStart) return "relegation";
    return null;
  }

  const ZONE_STYLES: Record<NonNullable<ZoneType>, { row: string; bar: string; num: string }> = {
    ucl:        { row: "bg-blue-500/8",         bar: "bg-blue-500",       num: "text-blue-400" },
    uel:        { row: "bg-orange-500/8",       bar: "bg-orange-500",     num: "text-orange-400" },
    uecl:       { row: "bg-emerald-500/8",      bar: "bg-emerald-500",    num: "text-emerald-400" },
    promo:      { row: "bg-pitch/12",           bar: "bg-pitch",          num: "text-pitch" },
    playoff:    { row: "bg-pitch/5",            bar: "bg-pitch/40",       num: "text-pitch/60" },
    relegation: { row: "bg-blood/8",            bar: "bg-blood",          num: "text-blood" },
  };

  const leader = standings[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{
        backdropFilter: "blur(8px)",
        background: "rgba(5,7,13,0.92)",
        animation: `${closing ? "lt-bd-out" : "lt-bd-in"} ${dur} ease both`,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <style>{LT_STYLES}</style>

      <div
        className="w-full sm:max-w-2xl sm:rounded-2xl bg-ink overflow-hidden flex flex-col border-0 sm:border border-line/60"
        style={{
          maxHeight: "100dvh",
          animation: `${closing ? "lt-out" : "lt-in"} ${dur} ${ease} both`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* ── Header ── */}
        <div className="relative overflow-hidden shrink-0">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-ink-3 via-ink-2 to-ink pointer-events-none" />
          {/* Large watermark logo */}
          {logoUrl && (
            <img
              src={logoUrl}
              alt=""
              aria-hidden
              className="absolute -right-4 -top-2 opacity-[0.07] pointer-events-none object-contain"
              style={{ width: 120, height: 120 }}
            />
          )}
          <div className="relative flex items-center gap-4 px-5 pt-5 pb-4">
            {logoUrl && (
              <div className="size-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 shrink-0">
                <img src={logoUrl} alt={league} width={28} height={28} className="object-contain" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-bone-3/70 mb-0.5">Clasificación</div>
              <div className="font-display font-bold text-xl text-bone tracking-tight leading-tight">{league}</div>
              {leader && (
                <div className="text-[10px] font-mono text-bone-3/60 mt-0.5">
                  Líder: <span className="text-bone-2">{leader.clubName}</span>
                  <span className="ml-1.5 text-bone-3/40">·</span>
                  <span className="ml-1.5">{leader.points} pts</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="size-9 flex items-center justify-center rounded-xl border border-line/60 text-bone-3 hover:text-bone hover:border-line hover:bg-white/5 text-xl leading-none transition-all shrink-0"
            >
              ×
            </button>
          </div>

          {/* Column headers */}
          <div
            className="grid text-[9px] font-mono uppercase tracking-widest text-bone-3 px-5 pb-2"
            style={{ gridTemplateColumns: "2.5rem 1fr 2.8rem 2rem 2rem 2rem 2.8rem 3rem" }}
          >
            <span className="text-center">#</span>
            <span className="pl-8">Club</span>
            <span className="text-center">PJ</span>
            <span className="text-center">G</span>
            <span className="text-center">E</span>
            <span className="text-center">P</span>
            <span className="text-center hidden sm:block">Dif</span>
            <span className="text-center">Pts</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-line/60 to-transparent mx-5" />
        </div>

        {/* ── Rows ── */}
        <div className="overflow-y-auto flex-1">
          {standings.map((row, i) => {
            const pos = i + 1;
            const isPlayer = row.clubId === playerClubId;
            const zone = getZone(pos, isPlayer);
            const zs = zone ? ZONE_STYLES[zone] : null;
            const gd = row.gf - row.ga;
            const ptsBehindLeader = leader ? leader.points - row.points : 0;

            return (
              <div
                key={row.clubId}
                className={`relative grid items-center px-5 border-b border-line/10 last:border-0 transition-colors group
                  ${zs?.row ?? "hover:bg-white/2"}
                  ${isPlayer ? "hover:bg-pitch/15" : ""}
                `}
                style={{
                  gridTemplateColumns: "2.5rem 1fr 2.8rem 2rem 2rem 2rem 2.8rem 3rem",
                  minHeight: "2.75rem",
                  animationDelay: `${i * 18}ms`,
                }}
              >
                {/* Zone indicator bar */}
                <div
                  className={`absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full transition-all ${zs?.bar ?? "bg-transparent"}`}
                />

                {/* Position */}
                <div className="flex items-center justify-center">
                  <span className={`font-display font-bold text-sm tabular-nums ${zs?.num ?? "text-bone-3/50"}`}>
                    {pos}
                  </span>
                </div>

                {/* Club */}
                <div className="flex items-center gap-2.5 min-w-0 py-2">
                  <div className="shrink-0 size-7 flex items-center justify-center">
                    <ClubLogo
                      name={row.clubName}
                      url={clubLogoUrl(row.clubId)}
                      size={24}
                      clubId={row.clubId}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className={`block truncate text-[13px] font-semibold leading-tight ${isPlayer ? "text-pitch" : "text-bone"}`}>
                      {row.clubName}
                    </span>
                    {isPlayer && (
                      <span className="text-[9px] font-mono text-pitch/50 tracking-widest uppercase">Tú</span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <span className="text-center font-mono text-[11px] text-bone-3/60">{row.played}</span>
                <span className="text-center font-mono text-[11px] text-bone-2">{row.won}</span>
                <span className="text-center font-mono text-[11px] text-bone-3/60">{row.drawn}</span>
                <span className="text-center font-mono text-[11px] text-bone-3/60">{row.lost}</span>
                <span className={`text-center font-mono text-[11px] font-medium hidden sm:block ${gd > 0 ? "text-pitch" : gd < 0 ? "text-blood" : "text-bone-3/40"}`}>
                  {gd > 0 ? `+${gd}` : gd}
                </span>

                {/* Points */}
                <div className="flex flex-col items-center justify-center">
                  <span className={`font-display font-bold text-base tabular-nums ${isPlayer ? "text-pitch" : pos === 1 ? "text-gold" : "text-bone"}`}>
                    {row.points}
                  </span>
                  {pos > 1 && ptsBehindLeader > 0 && (
                    <span className="text-[8px] font-mono text-bone-3/30 leading-none">-{ptsBehindLeader}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Legend ── */}
        <div className="shrink-0 border-t border-line/30">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3">
            {isHypermotion ? (
              <>
                <LegendItem bar="bg-pitch"      logo={null} label="Ascenso directo" />
                <LegendItem bar="bg-pitch/40"   logo={null} label="Play-off" />
              </>
            ) : isConmebol ? (
              <>
                <LegendItem bar="bg-orange-500" logo="/tournaments/conmebol-libertadores.svg"  label="Libertadores" />
                <LegendItem bar="bg-blue-500"   logo="/tournaments/sudamericana.svg"           label="Sudamericana" />
              </>
            ) : (
              <>
                <LegendItem bar="bg-blue-500"     logo="/tournaments/champions-league.svg"    label="Champions League" />
                <LegendItem bar="bg-orange-500"   logo="/tournaments/europa-league.svg"       label="Europa League" />
                <LegendItem bar="bg-emerald-500"  logo="/tournaments/conference-league.svg"   label="Conference League" />
              </>
            )}
            <LegendItem bar="bg-blood" logo={null} label="Descenso" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ bar, logo, label }: { bar: string; logo: string | null; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-[3px] h-3.5 rounded-full shrink-0 ${bar}`} />
      {logo && (
        <img src={logo} alt="" aria-hidden width={12} height={12} className="object-contain opacity-70" />
      )}
      <span className="text-[9px] font-mono uppercase tracking-widest text-bone">{label}</span>
    </div>
  );
}
