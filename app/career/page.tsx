"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCareer, CAREER_CONFIG } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { SeasonRow } from "@/components/SeasonRow";
import { ClubLogo, Flag } from "@/components/Logo";
import { clubLogoUrl } from "@/lib/logos";
import { fmtMoney } from "@/lib/format";
import { COUNTRY_BY_CODE } from "@/lib/countries";
import { POSITION_SHORT } from "@/lib/squadNumbers";

export default function CareerDashboard() {
  const router = useRouter();
  const { career, simulateNext, reset } = useCareer();
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
    if (career.pendingOffers) router.replace("/career/season");
    else if (career.finished) router.replace("/career/retire");
  }, [career, hydrated, router]);

  if (!hydrated || !career) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-bone-3 uppercase tracking-widest text-xs">
          loading career…
        </span>
      </div>
    );
  }

  const totalGoals = career.seasons.reduce((s, x) => s + x.stats.goals, 0);
  const totalAssists = career.seasons.reduce((s, x) => s + x.stats.assists, 0);
  const totalApps = career.seasons.reduce((s, x) => s + x.stats.appearances, 0);
  const totalAwards = career.seasons.reduce((s, x) => s + x.awards.length, 0);
  const trophies =
    career.seasons.filter((s) => s.club.leagueWin).length +
    career.seasons.filter((s) => s.club.nationalCupWon).length +
    career.seasons.filter((s) => s.club.continentalResult === "champion").length +
    career.seasons.filter((s) => s.national.tournament?.result === "champion").length;
  const seasonsPlayed = career.seasons.length;
  const yearsLeft = CAREER_CONFIG.RETIREMENT_AGE - career.currentAge + 1;
  const country = COUNTRY_BY_CODE[career.player.countryCode];

  const overall = Math.min(
    99,
    Math.round(
      63 +
        seasonsPlayed * 0.6 +
        totalGoals * 0.03 +
        totalAssists * 0.02 +
        totalAwards * 1.6 +
        trophies * 0.4,
    ),
  );

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <SiteHeader
        rightSlot={
          <>
            <span>Age {career.currentAge}</span>
            <span className="text-bone-3">/</span>
            <span>{CAREER_CONFIG.RETIREMENT_AGE}</span>
            <button
              onClick={() => router.push("/")}
              className="ml-2 px-3 py-1.5 rounded-lg border border-line hover:border-pitch/50 hover:text-pitch transition-colors text-bone-2"
            >
              Exit
            </button>
            <button
              onClick={() => {
                if (
                  confirm(
                    `Discard the career of ${career.player.firstName} ${career.player.lastName}? This cannot be undone.`,
                  )
                ) {
                  reset();
                  router.push("/");
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-line hover:border-blood/60 hover:text-blood transition-colors text-bone-3"
            >
              Discard
            </button>
          </>
        }
      />

      <main className="flex-1 bg-pitch-grid">
        <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">

          {/* ── Player identity banner (full width, horizontal) ── */}
          <div
            className="relative rounded-2xl border border-line/60 overflow-hidden p-6 card-diagonal anim-rise"
            style={{
              background:
                "linear-gradient(135deg, var(--color-ink-3), var(--color-ink-2) 55%, var(--color-ink-4))",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pitch/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            <div className="flex flex-wrap items-center gap-6">
              {/* OVR */}
              <div className="flex items-center justify-center size-16 rounded-full border-2 border-pitch/40 bg-pitch-deep/30 shrink-0">
                <span className="font-display font-bold text-3xl text-pitch leading-none glow-teal">
                  {overall}
                </span>
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {country && <Flag code={country.code} width={18} height={13} className="rounded-sm shrink-0" />}
                  <span className="text-[11px] text-bone-3 font-mono uppercase tracking-widest">
                    {country?.name ?? career.player.countryCode} · {POSITION_SHORT[career.player.position]} · #{career.player.number}
                  </span>
                </div>
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-bone tracking-tight leading-tight">
                  {career.player.firstName}{" "}
                  <span className="text-bone-2">{career.player.lastName}</span>
                </h1>
              </div>

              {/* Club */}
              <div className="flex items-center gap-3">
                <ClubLogo
                  name={career.player.currentClubName}
                  url={clubLogoUrl(career.player.currentClubId)}
                  size={48}
                />
                <div>
                  <div className="text-sm font-semibold text-bone">{career.player.currentClubName}</div>
                  <div className="text-[11px] text-bone-3 font-mono">{career.player.currentLeague}</div>
                </div>
              </div>

              {/* Contract + salary chips */}
              <div className="flex flex-wrap gap-2 ml-auto">
                <InfoChip label="Salary / yr" value={fmtMoney(career.player.salaryEur)} accent="gold" />
                <InfoChip label="Contract" value={`${career.player.contractYearsLeft}y`} />
                <InfoChip label="Potential" value={String(career.player.potential)} accent="pitch" />
              </div>
            </div>
          </div>

          {/* ── Simulate CTA + season KPIs row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 anim-rise delay-100">
            {/* Simulate button takes 2/3 width */}
            <button
              onClick={simulateNext}
              className="lg:col-span-2 group relative overflow-hidden bg-pitch text-ink py-6 rounded-2xl font-display font-bold text-3xl tracking-tight hover:bg-pitch-2 transition-all duration-200 hover:scale-[1.01]"
            >
              <span className="relative z-10">Simulate season {seasonsPlayed + 1} →</span>
              <span className="absolute top-2 left-5 text-ink/50 text-[10px] font-mono uppercase tracking-widest">
                Season {seasonsPlayed + 1} / 22
              </span>
            </button>

            {/* KPIs in 1/3 */}
            <div className="grid grid-cols-2 gap-3">
              <KpiTile label="Years left" value={String(yearsLeft)} />
              <KpiTile label="Awards" value={String(totalAwards)} accent="gold" />
              <KpiTile label="Salary" value={fmtMoney(career.player.salaryEur)} accent="pitch" />
              <KpiTile label="Trophies" value={String(trophies)} accent="gold" />
            </div>
          </div>

          {/* ── Career totals (full width) ── */}
          <div className="anim-rise delay-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-2xl tracking-tight text-bone">Career numbers</h2>
              <span className="text-[11px] text-bone-3 font-mono uppercase tracking-widest">Cumulative</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <BigKpi label="Goals" value={totalGoals} color="text-pitch" glow="glow-teal" />
              <BigKpi label="Assists" value={totalAssists} />
              <BigKpi label="Appearances" value={totalApps} />
              <BigKpi label="Trophies" value={trophies} color="text-gold" glow="glow-amber" />
            </div>
          </div>

          {/* ── Timeline (full width) ── */}
          <div className="anim-rise delay-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-2xl tracking-tight text-bone">Timeline</h2>
              <span className="text-[11px] text-bone-3 font-mono uppercase tracking-widest">
                {seasonsPlayed} season{seasonsPlayed === 1 ? "" : "s"}
              </span>
            </div>

            {seasonsPlayed === 0 ? (
              <div className="rounded-2xl border border-dashed border-line/60 bg-ink-2 px-6 py-14 text-center">
                <div className="font-display font-bold text-3xl text-bone-3 tracking-tight">
                  Your career awaits
                </div>
                <div className="text-bone-3 text-xs font-mono mt-2 uppercase tracking-widest">
                  Hit simulate to play your first season
                </div>
              </div>
            ) : (
              <div className="max-h-[480px] overflow-y-auto space-y-2 pr-1">
                {[...career.seasons].reverse().map((s, i) => (
                  <SeasonRow
                    key={s.index}
                    season={s}
                    startYear={career.startYear}
                    highlight={i === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoChip({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "pitch" | "gold";
}) {
  const c = accent === "pitch" ? "text-pitch" : accent === "gold" ? "text-gold" : "text-bone";
  return (
    <div className="rounded-xl border border-line bg-ink-3 px-3 py-2">
      <div className="text-[9px] text-bone-3 font-mono uppercase tracking-widest">{label}</div>
      <div className={`num text-sm font-bold ${c}`}>{value}</div>
    </div>
  );
}

function KpiTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "pitch" | "gold";
}) {
  const c = accent === "pitch" ? "text-pitch" : accent === "gold" ? "text-gold" : "text-bone";
  return (
    <div className="rounded-xl border border-line bg-ink-2 px-3 py-3">
      <div className="text-[9px] text-bone-3 font-mono uppercase tracking-widest">{label}</div>
      <div className={`num text-xl font-bold mt-1 leading-tight ${c}`}>{value}</div>
    </div>
  );
}

function BigKpi({
  label,
  value,
  color = "text-bone",
  glow = "",
}: {
  label: string;
  value: number;
  color?: string;
  glow?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-ink-2 p-5 relative overflow-hidden">
      <div className="text-[10px] text-bone-3 font-mono uppercase tracking-widest mb-2">{label}</div>
      <div className={`font-display font-bold text-6xl leading-none ${color} ${glow}`}>{value}</div>
    </div>
  );
}
