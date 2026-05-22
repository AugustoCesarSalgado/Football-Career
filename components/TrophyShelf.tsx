import { useEffect, useState } from "react";
import { TrophyKind, labelFor, CupIcon, BallonIcon, FlagIcon, BootIcon, LeagueMvpIcon } from "./Trophy";
import { competitionLogoUrl, competitionLogoStyle, nationalTournamentLogoUrl, tournamentLogoStyle, leagueLogoUrlByName, cupLogoUrlByName, cupLogoStyle, LEAGUE_NO_GLOW } from "@/lib/logos";
import { NATIONAL_TOURNAMENT_LOGO } from "@/lib/competitions";

interface GroupedTrophy {
  key: string;
  kind: TrophyKind["kind"];
  name: string;
  compId?: string;
  count: number;
  years: number[];
}

const PRESTIGE_KINDS: TrophyKind["kind"][] = ["award", "national", "continental", "bonus"];

export function groupTrophies(trophies: TrophyKind[]): GroupedTrophy[] {
  const map = new Map<string, GroupedTrophy>();
  for (const t of trophies) {
    const key = `${t.kind}:${t.name}`;
    const compId = t.kind === "continental" || t.kind === "bonus" ? t.compId : undefined;
    const existing = map.get(key);
    if (existing) {
      existing.count++;
      existing.years.push(t.year);
    } else {
      map.set(key, { key, kind: t.kind, name: t.name, compId, count: 1, years: [t.year] });
    }
  }
  const order: Record<TrophyKind["kind"], number> = {
    award: 0, national: 1, continental: 2, bonus: 3, league: 4, cup: 5,
  };
  return Array.from(map.values()).sort((a, b) => {
    if (order[a.kind] !== order[b.kind]) return order[a.kind] - order[b.kind];
    return b.count - a.count;
  });
}

export function TrophyShelf({ trophies }: { trophies: TrophyKind[] }) {
  const grouped = groupTrophies(trophies);

  if (grouped.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-ink-2 py-16 flex flex-col items-center gap-3">
        <CupIcon className="size-12 text-bone-3/30" />
        <div className="font-display font-bold text-2xl text-bone-3 tracking-tight">An empty cabinet</div>
        <div className="text-bone-3 text-[11px] font-mono uppercase tracking-widest">No silverware. No tears.</div>
      </div>
    );
  }

  const totalCount = grouped.reduce((s, g) => s + g.count, 0);
  const prestige = grouped.filter((g) => PRESTIGE_KINDS.includes(g.kind));
  const domestic = grouped.filter((g) => !PRESTIGE_KINDS.includes(g.kind));

  return (
    <div className="space-y-8">
      {/* ── Summary bar ── */}
      <div className="flex items-stretch gap-3">
        <div className="flex-1 rounded-2xl border border-gold/35 bg-gold/5 px-5 py-4 flex items-center gap-4">
          <span className="font-display font-bold text-6xl text-gold leading-none glow-amber">
            {totalCount}
          </span>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-bone-3">Total trophies</div>
            <div className="text-bone-2 text-sm font-medium mt-0.5">{grouped.length} distinct title{grouped.length !== 1 ? "s" : ""}</div>
          </div>
        </div>
        {/* Mini breakdown */}
        <div className="flex flex-col gap-1.5 justify-center">
          {prestige.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gold/25 bg-gold/5">
              <span className="text-[9px] font-mono uppercase tracking-widest text-gold">Prestige</span>
              <span className="num text-gold font-bold text-sm">{prestige.reduce((s, g) => s + g.count, 0)}</span>
            </div>
          )}
          {domestic.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-pitch/25 bg-pitch/5">
              <span className="text-[9px] font-mono uppercase tracking-widest text-pitch">Domestic</span>
              <span className="num text-pitch font-bold text-sm">{domestic.reduce((s, g) => s + g.count, 0)}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Prestige tier (awards, continental, national) — larger cards ── */}
      {prestige.length > 0 && (
        <div>
          <SectionDivider label="Prestige" color="gold" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {prestige.map((g, i) => (
              <PrestigeCard key={g.key} g={g} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Domestic tier (leagues, cups) — compact cards in a tighter grid ── */}
      {domestic.length > 0 && (
        <div>
          <SectionDivider label="Domestic" color="pitch" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {domestic.map((g, i) => (
              <DomesticCard key={g.key} g={g} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function useCountUp(target: number, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target <= 1) { setVal(target); return; }
    const t = setTimeout(() => {
      const steps = Math.min(target, 24);
      const stepMs = Math.min(40, 700 / steps);
      let i = 0;
      const id = setInterval(() => {
        i++;
        setVal(i >= steps ? target : Math.round((target / steps) * i));
        if (i >= steps) clearInterval(id);
      }, stepMs);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return val;
}

/* Prestige card */
function PrestigeCard({ g, index }: { g: GroupedTrophy; index: number }) {
  const count = useCountUp(g.count, 300 + index * 80);
  const sortedYears = [...g.years].sort((a, b) => a - b);

  return (
    <div
      className="relative flex flex-col rounded-2xl border border-gold/35 bg-gradient-to-b from-gold/10 via-ink-2 to-ink-3 overflow-hidden anim-rise"
      style={{ animationDelay: `${80 + index * 70}ms` }}
    >
      {/* Shimmer top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--color-gold), transparent)",
          animation: "shimmer 3.5s ease-in-out infinite",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Watermark count */}
      <div
        className="absolute bottom-0 right-1 font-display font-bold leading-none select-none pointer-events-none"
        style={{ fontSize: "clamp(72px,14vw,110px)", color: "rgba(245,158,11,0.07)" }}
        aria-hidden
      >
        {g.count}
      </div>

      {/* Icon + count row */}
      <div className="flex items-center justify-between px-4 pt-6 pb-3">
        <div className="flex items-center justify-start">
          {renderShelfIcon(g, "large")}
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div
            className="font-display font-bold leading-none num"
            style={{
              fontSize: "clamp(40px,8vw,64px)",
              color: "var(--color-gold)",
              textShadow: "0 0 28px rgba(245,158,11,0.55)",
            }}
          >
            {count}
          </div>
          <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-gold/60">
            {g.count === 1 ? "title" : "titles"}
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="px-4 pb-4 mt-auto space-y-2">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-gold/70 mb-0.5">
            {kindLabel(g.kind)}
          </div>
          <div className="font-display font-bold text-sm text-bone leading-tight tracking-tight">
            {g.name}
          </div>
        </div>

        {/* Year chips */}
        <div className="flex flex-wrap gap-1">
          {sortedYears.map((y) => (
            <span
              key={y}
              className="num text-[9px] font-mono px-1.5 py-0.5 rounded-md border border-gold/25 bg-gold/8 text-gold/80 leading-none"
            >
              {y}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Domestic card */
function DomesticCard({ g, index }: { g: GroupedTrophy; index: number }) {
  const count = useCountUp(g.count, 300 + index * 80);
  const sortedYears = [...g.years].sort((a, b) => a - b);

  return (
    <div
      className="relative flex flex-col rounded-2xl border border-pitch/35 bg-gradient-to-b from-pitch/10 via-ink-2 to-ink-3 overflow-hidden anim-rise"
      style={{ animationDelay: `${80 + index * 70}ms` }}
    >
      {/* Shimmer top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--color-pitch), transparent)",
          animation: "shimmer 3.5s ease-in-out infinite",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Watermark count */}
      <div
        className="absolute bottom-0 right-1 font-display font-bold leading-none select-none pointer-events-none"
        style={{ fontSize: "clamp(72px,14vw,110px)", color: "rgba(45,212,191,0.07)" }}
        aria-hidden
      >
        {g.count}
      </div>

      {/* Icon + count row */}
      <div className="flex items-center justify-between px-4 pt-6 pb-3">
        <div className="flex items-center justify-center">
          {renderShelfIcon(g, "large")}
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div
            className="font-display font-bold leading-none num"
            style={{
              fontSize: "clamp(40px,8vw,64px)",
              color: "var(--color-pitch)",
              textShadow: "0 0 28px rgba(45,212,191,0.55)",
            }}
          >
            {count}
          </div>
          <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-pitch/60">
            {g.count === 1 ? "title" : "titles"}
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="px-4 pb-4 mt-auto space-y-2">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-pitch/70 mb-0.5">
            {kindLabel(g.kind)}
          </div>
          <div className="font-display font-bold text-sm text-bone leading-tight tracking-tight">
            {g.name}
          </div>
        </div>

        {/* Year chips */}
        <div className="flex flex-wrap gap-1">
          {sortedYears.map((y) => (
            <span
              key={y}
              className="num text-[9px] font-mono px-1.5 py-0.5 rounded-md border border-pitch/25 bg-pitch/8 text-pitch/80 leading-none"
            >
              {y}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionDivider({ label, color }: { label: string; color: "gold" | "pitch" }) {
  const cls = color === "gold" ? "text-gold border-gold/30" : "text-pitch border-pitch/30";
  return (
    <div className={`flex items-center gap-3 mb-3 text-[10px] font-mono uppercase tracking-widest ${cls}`}>
      <span className={`flex-1 h-px opacity-30 ${color === "gold" ? "bg-gold" : "bg-pitch"}`} />
      {label}
      <span className={`flex-1 h-px opacity-30 ${color === "gold" ? "bg-gold" : "bg-pitch"}`} />
    </div>
  );
}

function renderShelfIcon(g: GroupedTrophy, size: "small" | "large") {
  const lg = size === "large";
  if ((g.kind === "continental" || g.kind === "bonus") && g.compId) {
    const url = competitionLogoUrl(g.compId);
    const px = g.compId === "conmebol-lib" ? (lg ? 88 : 48) : (lg ? 64 : 36);
    if (url) {
      const invertStyle = competitionLogoStyle(g.compId);
      const glowFilter = lg ? "drop-shadow(0 0 12px rgba(245,158,11,0.4))" : undefined;
      const combinedFilter = invertStyle
        ? `brightness(0) invert(1)${glowFilter ? ` ${glowFilter}` : ""}`
        : glowFilter;
      return (
        <img
          src={url}
          alt={g.name}
          width={px}
          height={px}
          className="object-contain drop-shadow-xl"
          style={combinedFilter ? { filter: combinedFilter } : undefined}
        />
      );
    }
    return <CupIcon className={lg ? "size-12 text-gold" : "size-7 text-pitch"} />;
  }
  if (g.kind === "national") {
    const slug = NATIONAL_TOURNAMENT_LOGO[g.name];
    const isWC = g.name === "FIFA World Cup";
    const isCA = g.name === "Copa América";
    const px = isWC ? (lg ? 62 : 34) : (lg ? 64 : 36);
    if (slug) {
      const blendStyle = tournamentLogoStyle(slug);
      const goldGlow = { filter: "drop-shadow(0 0 14px rgba(245,158,11,0.55))" };
      const softGlow = { filter: "drop-shadow(0 0 10px rgba(245,158,11,0.35))" };
      const style = (isWC || isCA) ? (lg ? goldGlow : undefined) : (blendStyle ?? (lg ? softGlow : undefined));
      const w = px;
      const h = isWC ? Math.round(px * (350.67 / 227.29)) : px;
      return (
        <img
          src={nationalTournamentLogoUrl(slug)}
          alt={g.name}
          width={w}
          height={h}
          className="object-contain"
          style={style}
        />
      );
    }
    return <FlagIcon className={lg ? "size-12 text-gold" : "size-7 text-gold"} />;
  }
  if (g.kind === "award") {
    if (g.name === "Golden Boot") {
      const px = lg ? 84 : 44;
      return (
        <img
          src="/tournaments/golden-boot.png"
          alt="Golden Boot"
          width={px}
          height={px}
          className="object-contain"
          style={lg ? { filter: "drop-shadow(0 0 14px rgba(245,158,11,0.55))" } : undefined}
        />
      );
    }
    if (g.name === "FIFA The Best") {
      const px = lg ? 64 : 36;
      return (
        <img
          src="/tournaments/the-best.png"
          alt="FIFA The Best"
          width={px}
          height={px}
          className="object-contain"
          style={lg ? { filter: "drop-shadow(0 0 14px rgba(245,158,11,0.55))" } : undefined}
        />
      );
    }
    if (g.name === "Ballon d'Or") {
      const px = lg ? 64 : 36;
      return (
        <img
          src="/tournaments/ballon-dor.png"
          alt="Ballon d'Or"
          width={px}
          height={px}
          className="object-contain"
          style={lg ? { filter: "drop-shadow(0 0 14px rgba(245,158,11,0.55))" } : undefined}
        />
      );
    }
    if (g.name === "UEFA Player of the Season") {
      const px = lg ? 64 : 36;
      return (
        <img
          src="/tournaments/uefa-player-of-season.png"
          alt="UEFA Player of the Season"
          width={px}
          height={px}
          className="object-contain"
          style={lg ? { filter: "drop-shadow(0 0 14px rgba(245,158,11,0.55))" } : undefined}
        />
      );
    }
    if (g.name === "League MVP")
      return (
        <LeagueMvpIcon
          className={lg ? "size-12 text-gold" : "size-7 text-gold"}
          style={lg ? { filter: "drop-shadow(0 0 14px rgba(245,158,11,0.55))" } : undefined}
        />
      );
    return (
      <BallonIcon
        className={lg ? "size-12 text-gold" : "size-7 text-gold"}
        style={lg ? { filter: "drop-shadow(0 0 14px rgba(245,158,11,0.55))" } : undefined}
      />
    );
  }
  if (g.kind === "league") {
    const url = leagueLogoUrlByName(g.name);
    const px = lg ? 64 : 36;
    if (url)
      return (
        <img
          src={url}
          alt={g.name}
          width={px}
          height={px}
          className="object-contain"
          style={lg && !LEAGUE_NO_GLOW.has(g.name) ? { filter: "drop-shadow(0 0 8px rgba(45,212,191,0.3))" } : undefined}
        />
      );
    return <CupIcon className={lg ? "size-12 text-pitch" : "size-7 text-pitch"} />;
  }
  if (g.kind === "cup") {
    const url = cupLogoUrlByName(g.name);
    const px = lg ? 64 : 36;
    if (url) {
      const baseFilter = lg ? "drop-shadow(0 0 8px rgba(45,212,191,0.3))" : undefined;
      const invert = cupLogoStyle(g.name);
      const combinedFilter = invert
        ? `brightness(0) invert(1)${baseFilter ? ` ${baseFilter}` : ""}`
        : baseFilter;
      return (
        <img
          src={url}
          alt={g.name}
          width={px}
          height={px}
          className="object-contain"
          style={combinedFilter ? { filter: combinedFilter } : undefined}
        />
      );
    }
    return <CupIcon className={lg ? "size-12 text-gold" : "size-7 text-gold"} />;
  }
  return <CupIcon className={lg ? "size-12 text-gold" : "size-7 text-gold"} />;
}

function kindLabel(k: TrophyKind["kind"]): string {
  switch (k) {
    case "league": return "Domestic league";
    case "cup": return "Domestic cup";
    case "continental": return "Continental";
    case "bonus": return "Honorary";
    case "national": return "National team";
    case "award": return "Individual";
  }
}

function summarizeYears(years: number[]): string {
  const sorted = [...years].sort((a, b) => a - b);
  if (sorted.length <= 4) return sorted.join(" · ");
  return `${sorted[0]} … ${sorted[sorted.length - 1]}`;
}

