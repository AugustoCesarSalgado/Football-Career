"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCareer, CAREER_CONFIG } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { Marquee } from "@/components/Marquee";
import { PlayerCard } from "@/components/PlayerCard";
import { SeasonRow } from "@/components/SeasonRow";
import { fmtMoney } from "@/lib/format";

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
        <span className="font-mono text-bone-3 uppercase tracking-[0.3em] text-xs">
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
    career.seasons.filter((s) => s.national.tournament?.result === "champion")
      .length;
  const seasonsPlayed = career.seasons.length;
  const yearsLeft = CAREER_CONFIG.RETIREMENT_AGE - career.currentAge + 1;

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
              className="ml-3 px-2 py-1 border border-line hover:border-pitch hover:text-pitch transition-colors"
              title="Saved locally — you can resume later"
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
              className="px-2 py-1 border border-line hover:border-blood hover:text-blood transition-colors"
              title="Wipe career permanently"
            >
              Discard
            </button>
          </>
        }
      />
      <Marquee
        items={[
          `${career.player.firstName} ${career.player.lastName}`,
          career.player.currentClubName,
          `Season ${seasonsPlayed + 1}/22`,
          `${totalGoals}G · ${totalAssists}A`,
          totalAwards > 0 ? `${totalAwards} individual awards` : "Hungry for silverware",
        ]}
      />

      <main className="flex-1 bg-pitch-grid">
        <div className="max-w-[1500px] mx-auto px-8 py-10 grid grid-cols-12 gap-8">
          {/* Left: player card + simulate */}
          <section className="col-span-12 lg:col-span-5 space-y-6">
            <PlayerCard player={career.player} age={career.currentAge} overall={overall} />

            <button
              onClick={simulateNext}
              className="group relative w-full overflow-hidden bg-pitch text-ink py-8 font-display text-4xl tracking-wider uppercase hover:bg-pitch-2 transition-colors anim-rise"
            >
              <span className="relative z-10">Simulate next season →</span>
              <span className="absolute -top-2 left-6 text-ink/60 text-[10px] uppercase tracking-[0.3em] font-mono">
                Season {seasonsPlayed + 1}
              </span>
            </button>

            <div className="grid grid-cols-4 gap-2">
              <KPI label="Seasons" value={String(seasonsPlayed)} />
              <KPI label="Years left" value={String(yearsLeft)} />
              <KPI label="Salary" value={fmtMoney(career.player.salaryEur)} accent="gold" />
              <KPI label="Awards" value={String(totalAwards)} accent="gold" />
            </div>
          </section>

          {/* Right: career stats + timeline */}
          <section className="col-span-12 lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-3xl tracking-wide uppercase text-bone">
                  Career numbers
                </h2>
                <span className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                  Cumulative
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <BigKPI label="Goals" value={totalGoals} color="text-pitch" />
                <BigKPI label="Assists" value={totalAssists} />
                <BigKPI label="Appearances" value={totalApps} />
                <BigKPI label="Trophies" value={trophies} color="text-gold" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-3xl tracking-wide uppercase text-bone">
                  Timeline
                </h2>
                <span className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                  {seasonsPlayed} season{seasonsPlayed === 1 ? "" : "s"}
                </span>
              </div>
              <div className="max-h-[520px] overflow-y-auto pr-1 space-y-1.5">
                {seasonsPlayed === 0 ? (
                  <div className="border border-dashed border-line bg-ink-2 px-5 py-10 text-center">
                    <div className="font-display text-3xl text-bone-3 uppercase tracking-wide">
                      Your career awaits
                    </div>
                    <div className="text-bone-3 text-xs font-mono mt-2 uppercase tracking-widest">
                      Hit simulate to play your first season
                    </div>
                  </div>
                ) : (
                  [...career.seasons].reverse().map((s, i) => (
                    <SeasonRow
                      key={s.index}
                      season={s}
                      startYear={career.startYear}
                      highlight={i === 0}
                    />
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function KPI({
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
    <div className="border border-line bg-ink-2 px-3 py-2">
      <div className="text-[9px] uppercase tracking-[0.3em] text-bone-3 font-mono">
        {label}
      </div>
      <div className={`num text-lg leading-tight ${c}`}>{value}</div>
    </div>
  );
}

function BigKPI({
  label,
  value,
  color = "text-bone",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="border border-line bg-ink-2 p-4 bg-noise relative overflow-hidden">
      <div className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
        {label}
      </div>
      <div className={`font-display text-6xl leading-none mt-2 ${color}`}>
        {value}
      </div>
    </div>
  );
}
