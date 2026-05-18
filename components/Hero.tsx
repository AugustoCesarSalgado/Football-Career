"use client";

import Image from "next/image";
import Link from "next/link";

const FLOATING_BADGES: Array<{
  src: string;
  className: string;
  style: React.CSSProperties;
  size: number;
}> = [
  // Top-right elite cluster
  {
    src: "/clubs/spain/real-madrid.png",
    className: "anim-float-a opacity-[0.18] hover:opacity-40",
    style: { top: "8%", right: "6%", transform: "rotate(-9deg)" },
    size: 160,
  },
  {
    src: "/tournaments/champions-league.svg",
    className: "anim-float-b opacity-[0.22] hover:opacity-50",
    style: { top: "20%", right: "22%", transform: "rotate(6deg)" },
    size: 140,
  },
  // Left side
  {
    src: "/clubs/argentina/boca-juniors.png",
    className: "anim-float-c opacity-[0.18] hover:opacity-40",
    style: { top: "14%", left: "4%", transform: "rotate(11deg)" },
    size: 130,
  },
  {
    src: "/tournaments/conmebol-libertadores.svg",
    className: "anim-float-a opacity-[0.20] hover:opacity-45",
    style: { bottom: "26%", left: "9%", transform: "rotate(-14deg)" },
    size: 110,
  },
  // Mid-low decorative
  {
    src: "/clubs/italy/juventus.png",
    className: "anim-float-b opacity-[0.14] hover:opacity-35",
    style: { bottom: "12%", right: "12%", transform: "rotate(7deg)" },
    size: 96,
  },
  {
    src: "/tournaments/world-cup.svg",
    className: "anim-float-c opacity-[0.20] hover:opacity-45",
    style: { top: "44%", right: "3%", transform: "rotate(-4deg)" },
    size: 120,
  },
  {
    src: "/clubs/germany/bayern-munchen.png",
    className: "anim-float-a opacity-[0.14] hover:opacity-35",
    style: { bottom: "8%", left: "30%", transform: "rotate(-9deg)" },
    size: 90,
  },
];

export function Hero({ totalClubs, totalCompetitions }: { totalClubs: number; totalCompetitions: number }) {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden border-b border-line bg-ink bg-pitch-grid"
      style={{ minHeight: "92vh" }}
    >
      {/* Atmospheric layered backgrounds */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 0%, rgba(245,197,66,0.10), transparent 60%), radial-gradient(ellipse 50% 50% at 10% 100%, rgba(109,255,122,0.10), transparent 60%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-noise pointer-events-none" />
      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Floating badges */}
      {FLOATING_BADGES.map((b, i) => (
        <div
          key={i}
          className={`absolute pointer-events-auto transition-opacity duration-500 ease-out ${b.className}`}
          style={b.style}
          aria-hidden
        >
          <Image
            src={b.src}
            alt=""
            width={b.size}
            height={b.size}
            unoptimized
            className="grayscale-[20%] drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]"
          />
        </div>
      ))}

      {/* Side vertical text (left) */}
      <div className="hidden md:block absolute left-3 top-1/2 -translate-y-1/2 z-10 select-none">
        <div className="[writing-mode:vertical-rl] rotate-180 text-[10px] uppercase tracking-[0.45em] text-bone-3 font-mono">
          Single-player · 2026 — 2048 · Anthropic / Career Sim
        </div>
      </div>

      {/* Decorative pitch line (center, vertical) */}
      <div
        aria-hidden
        className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-bone/10 to-transparent"
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1500px] mx-auto px-8 pt-16 pb-20 flex flex-col min-h-[92vh]">
        {/* Top meta strip */}
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.45em] text-bone-3 font-mono anim-rise">
          <div className="flex items-center gap-3">
            <span className="font-display text-bone tracking-[0.05em] text-base">
              Nº 01
            </span>
            <span className="hidden sm:inline">/</span>
            <span className="hidden sm:inline">Volume one · the football career simulator</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-pitch anim-pulse-ring" />
            <span>Press start when ready</span>
          </div>
        </div>

        <div className="mt-2 h-px bg-gradient-to-r from-bone/0 via-bone/30 to-bone/0 anim-rise delay-100" />

        {/* Headline area */}
        <div className="flex-1 grid grid-cols-12 gap-6 items-center mt-12 md:mt-8">
          <div className="col-span-12 lg:col-span-9 relative">
            {/* Issue number plate */}
            <div className="hidden lg:flex absolute -left-2 top-2 flex-col items-center gap-1 text-bone-3 anim-rise delay-200">
              <span className="font-display text-7xl text-bone/15 leading-none">01</span>
              <span className="rotate-90 origin-center text-[9px] uppercase tracking-[0.4em] font-mono mt-4">
                Issue
              </span>
            </div>

            <h1 className="font-display uppercase leading-[0.82] tracking-[-0.02em]">
              <span className="block text-[clamp(72px,12.5vw,220px)] text-bone anim-rise">
                Forge
              </span>
              <span className="block text-[clamp(72px,12.5vw,220px)] text-bone-2 anim-rise delay-200 lg:pl-[12%]">
                your
              </span>
              <span className="block text-[clamp(72px,13vw,230px)] anim-rise delay-300 lg:pl-[6%]">
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(95deg, var(--color-pitch) 20%, var(--color-gold-2) 65%, var(--color-pitch-2) 100%)",
                  }}
                >
                  legacy.
                </span>
              </span>
            </h1>
          </div>

          {/* Right pillar: tagline + scoreboard */}
          <aside className="col-span-12 lg:col-span-3 space-y-6 anim-rise delay-500">
            <div className="border-l-2 border-pitch pl-4 max-w-md">
              <div className="text-[10px] uppercase tracking-[0.35em] text-pitch font-mono">
                The story you'll tell
              </div>
              <p className="mt-2 text-bone-2 text-[15px] leading-relaxed">
                Pick a country and a role. Live every season from{" "}
                <span className="text-bone">18 to 40</span>. Choose between
                loyalty and the next contract. Retire as a journeyman, a star,
                or a legend.
              </p>
            </div>

            <div className="border border-line bg-ink-2/70 backdrop-blur-sm">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-line">
                <span className="text-[9px] uppercase tracking-[0.4em] text-bone-3 font-mono">
                  Scoreboard
                </span>
                <span className="text-[9px] uppercase tracking-[0.4em] text-pitch font-mono">
                  ●
                </span>
              </div>
              <dl className="grid grid-cols-2 divide-x divide-line">
                <Score label="Seasons" value="22" />
                <Score label="Leagues" value="14" />
                <Score label="Clubs" value={`${totalClubs}+`} accent="pitch" />
                <Score label="Trophies" value={`${totalCompetitions}`} accent="gold" />
              </dl>
            </div>
          </aside>
        </div>

        {/* Footer strip */}
        <div className="mt-12 space-y-5">
          <div className="h-px bg-gradient-to-r from-bone/0 via-bone/20 to-bone/0" />

          <div className="flex flex-wrap items-end justify-between gap-6 anim-rise delay-700">
            <div className="flex items-end gap-4">
              <Link
                href="#start"
                className="group relative inline-flex items-center gap-3 bg-pitch text-ink px-8 py-5 hover:bg-pitch-2 transition-colors overflow-hidden"
              >
                <span className="font-display text-3xl tracking-[0.06em] uppercase relative z-10">
                  Press start
                </span>
                <span className="font-mono text-xl relative z-10 translate-y-[1px]">
                  →
                </span>
                {/* corner notches */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-ink/30" />
                <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-ink/30" />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-ink/30" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-ink/30" />
              </Link>

              <Link
                href="#start"
                className="hidden sm:flex flex-col text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono group hover:text-bone transition-colors"
              >
                <span>↓ Scroll</span>
                <span>to begin</span>
              </Link>
            </div>

            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
              <span>BUILD 1.0</span>
              <span className="text-bone-3/40">|</span>
              <span>Made for desktop</span>
              <span className="text-bone-3/40">|</span>
              <span>Save lives in your browser</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Score({
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
    <div className="px-3 py-3 border-b border-line last:border-b-0 [&:nth-child(3)]:border-b-0 [&:nth-child(4)]:border-b-0">
      <div className="text-[9px] uppercase tracking-[0.3em] text-bone-3 font-mono">
        {label}
      </div>
      <div className={`font-display text-3xl leading-none mt-1 ${c}`}>{value}</div>
    </div>
  );
}
