"use client";

import Link from "next/link";

export function Hero({ totalClubs, totalCompetitions }: { totalClubs: number; totalCompetitions: number }) {
  return (
    <section className="relative isolate overflow-hidden bg-pitch-grid border-b border-line/60">
      {/* Radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(45,212,191,0.08), transparent 65%), radial-gradient(ellipse 50% 40% at 80% 100%, rgba(245,158,11,0.05), transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: headline */}
          <div className="anim-rise">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pitch/30 bg-pitch/10 text-pitch text-[11px] font-mono uppercase tracking-widest mb-6">
              <span className="size-1.5 rounded-full bg-pitch anim-pulse-ring" />
              Vol 01 · The football career simulator
            </div>

            <h1 className="font-display font-bold leading-[0.9] tracking-tight">
              <span className="block text-[clamp(64px,10vw,140px)] text-bone">
                Forge
              </span>
              <span className="block text-[clamp(64px,10vw,140px)] text-bone-2 lg:pl-[8%]">
                your
              </span>
              <span
                className="block text-[clamp(64px,10.5vw,148px)] bg-clip-text text-transparent lg:pl-[4%]"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, var(--color-pitch) 10%, var(--color-gold-2) 55%, var(--color-pitch-2) 95%)",
                }}
              >
                legacy.
              </span>
            </h1>

            <p className="mt-6 text-bone-2 text-lg max-w-lg leading-relaxed anim-rise delay-200">
              Pick a country and role. Live every season from{" "}
              <span className="text-bone font-semibold">18 to 40</span>. Choose
              loyalty or the next contract. Retire as a journeyman, a star, or
              a legend.
            </p>

            <div className="mt-8 flex items-center gap-4 anim-rise delay-300">
              <Link
                href="#start"
                className="inline-flex items-center gap-3 bg-pitch text-ink px-7 py-4 rounded-xl font-display font-bold text-xl tracking-tight hover:bg-pitch-2 transition-colors"
              >
                Start career →
              </Link>
              <span className="text-[11px] text-bone-3 font-mono uppercase tracking-widest">
                Saved locally
              </span>
            </div>
          </div>

          {/* Right: stats board */}
          <div className="anim-rise delay-400">
            <div className="rounded-2xl border border-line/60 bg-ink-2/70 backdrop-blur-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-line/60 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest text-bone-3 font-mono">
                  Career scope
                </span>
                <span className="size-2 rounded-full bg-pitch anim-pulse-ring" />
              </div>
              <div className="grid grid-cols-2">
                <ScoreTile label="Seasons" value="22" />
                <ScoreTile label="Leagues" value="14" />
                <ScoreTile label="Clubs" value={`${totalClubs}+`} accent="pitch" />
                <ScoreTile label="Competitions" value={`${totalCompetitions}`} accent="gold" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <InfoPill>Start at 18</InfoPill>
              <InfoPill>Retire at 40</InfoPill>
              <InfoPill>100% browser</InfoPill>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreTile({
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
    <div className="px-5 py-5 border-b border-r border-line/40 last:border-r-0 [&:nth-child(even)]:border-r-0 [&:nth-last-child(-n+2)]:border-b-0">
      <div className="text-[10px] uppercase tracking-widest text-bone-3 font-mono mb-1">{label}</div>
      <div className={`font-display font-bold text-4xl leading-none ${c}`}>{value}</div>
    </div>
  );
}

function InfoPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-ink-2 px-3 py-2.5 text-center">
      <span className="text-[11px] text-bone-2 font-mono uppercase tracking-widest">{children}</span>
    </div>
  );
}
