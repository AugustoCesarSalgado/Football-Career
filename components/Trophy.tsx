import { competitionLogoUrl, competitionLogoStyle, nationalTournamentLogoUrl, tournamentLogoStyle, leagueLogoUrlByName, cupLogoUrlByName, cupLogoStyle, LEAGUE_NO_GLOW } from "@/lib/logos";
import { NATIONAL_TOURNAMENT_LOGO } from "@/lib/competitions";

export type TrophyKind =
  | { kind: "league"; name: string; year: number }
  | { kind: "cup"; name: string; year: number }
  | { kind: "continental"; compId: string; name: string; year: number }
  | { kind: "bonus"; compId: string; name: string; year: number }
  | { kind: "national"; name: string; year: number }
  | { kind: "award"; name: string; year: number };

/** Portrait badge card — used in the season debrief trophy room */
export function TrophyTile({ trophy }: { trophy: TrophyKind }) {
  const isPrestige =
    trophy.kind === "continental" ||
    trophy.kind === "bonus" ||
    trophy.kind === "national" ||
    trophy.kind === "award";

  const accentColor = isPrestige ? "gold" : "pitch";
  const borderCls = isPrestige
    ? "border-gold/40"
    : "border-pitch/30";
  const bgGradient = isPrestige
    ? "from-gold/10 via-ink-2 to-ink-2"
    : "from-pitch/8 via-ink-2 to-ink-2";
  const shimmer = isPrestige;

  return (
    <div
      className={`relative flex flex-col items-center text-center rounded-2xl border ${borderCls} bg-gradient-to-b ${bgGradient} overflow-hidden p-4 pt-5 gap-2`}
    >
      {/* Shimmer line on top for prestige */}
      {shimmer && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--color-gold) 50%, transparent 100%)",
            animation: "shimmer 3s ease-in-out infinite",
            backgroundSize: "200% 100%",
          }}
        />
      )}

      {/* Kind pill */}
      <span
        className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
          isPrestige
            ? "border-gold/40 text-gold bg-gold/10"
            : "border-pitch/30 text-pitch bg-pitch/8"
        }`}
      >
        {labelFor(trophy)}
      </span>

      {/* Large icon */}
      <div className="flex items-center justify-center size-14 my-1">
        {renderIcon(trophy, "large")}
      </div>

      {/* Name */}
      <div className="font-display font-bold text-sm leading-tight text-bone tracking-tight">
        {trophy.name}
      </div>

      {/* Year */}
      <div className="text-[10px] font-mono text-bone-3">{trophy.year}</div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-4 right-4 h-px opacity-40"
        style={{
          background: isPrestige ? "var(--color-gold)" : "var(--color-pitch)",
        }}
      />
    </div>
  );
}

function renderIcon(t: TrophyKind, size: "small" | "large" = "small") {
  const lg = size === "large";
  if (t.kind === "continental" || t.kind === "bonus") {
    const src = competitionLogoUrl(t.compId);
    const px = t.compId === "conmebol-lib" ? (lg ? 64 : 44) : (lg ? 48 : 32);
    if (src) {
      const invertStyle = competitionLogoStyle(t.compId);
      return (
        <img
          src={src}
          alt={t.name}
          width={px}
          height={px}
          className="object-contain drop-shadow-lg"
          style={invertStyle}
        />
      );
    }
    return <CupIcon className={lg ? "size-10 text-gold" : "size-6 text-gold"} />;
  }
  if (t.kind === "national") {
    const slug = NATIONAL_TOURNAMENT_LOGO[t.name];
    const isWC = t.name === "FIFA World Cup";
    const isCA = t.name === "Copa América";
    const wcW = lg ? 30 : 18;
    const px = isWC ? wcW : (lg ? 48 : 32);
    if (slug)
      return (
        <img
          src={nationalTournamentLogoUrl(slug)}
          alt={t.name}
          width={px}
          height={isWC ? Math.round(px * (350.67 / 227.29)) : px}
          className="object-contain drop-shadow-lg"
          style={(isWC || isCA) && lg ? { filter: "drop-shadow(0 0 14px rgba(245,158,11,0.55))" } : tournamentLogoStyle(slug)}
        />
      );
    return <FlagIcon className={lg ? "size-10 text-gold" : "size-6 text-gold"} />;
  }
  if (t.kind === "award") {
    if (t.name === "Golden Boot") {
      const px = lg ? 48 : 32;
      return (
        <img
          src="/tournaments/golden-boot.png"
          alt="Golden Boot"
          width={px}
          height={px}
          className="object-contain drop-shadow-lg"
          style={lg ? { filter: "drop-shadow(0 0 14px rgba(245,158,11,0.55))" } : undefined}
        />
      );
    }
    if (t.name === "FIFA The Best") {
      const px = lg ? 48 : 32;
      return (
        <img
          src="/tournaments/the-best.png"
          alt="FIFA The Best"
          width={px}
          height={px}
          className="object-contain drop-shadow-lg"
          style={lg ? { filter: "drop-shadow(0 0 14px rgba(245,158,11,0.55))" } : undefined}
        />
      );
    }
    if (t.name === "Ballon d'Or") {
      const px = lg ? 48 : 32;
      return (
        <img
          src="/tournaments/ballon-dor.png"
          alt="Ballon d'Or"
          width={px}
          height={px}
          className="object-contain drop-shadow-lg"
          style={lg ? { filter: "drop-shadow(0 0 14px rgba(245,158,11,0.55))" } : undefined}
        />
      );
    }
    return <BallonIcon className={lg ? "size-10 text-gold" : "size-6 text-gold"} />;
  }
  if (t.kind === "league") {
    const url = leagueLogoUrlByName(t.name);
    const px = lg ? 48 : 32;
    if (url)
      return (
        <img
          src={url}
          alt={t.name}
          width={px}
          height={px}
          className="object-contain"
          style={lg && !LEAGUE_NO_GLOW.has(t.name) ? { filter: "drop-shadow(0 0 8px rgba(45,212,191,0.3))" } : undefined}
        />
      );
    return <CupIcon className={lg ? "size-10 text-pitch" : "size-6 text-pitch"} />;
  }
  if (t.kind === "cup") {
    const url = cupLogoUrlByName(t.name);
    const px = lg ? 48 : 32;
    if (url) {
      const baseFilter = lg ? "drop-shadow(0 0 8px rgba(45,212,191,0.3))" : undefined;
      const invert = cupLogoStyle(t.name);
      const combinedFilter = invert
        ? `brightness(0) invert(1)${baseFilter ? ` ${baseFilter}` : ""}`
        : baseFilter;
      return (
        <img
          src={url}
          alt={t.name}
          width={px}
          height={px}
          className="object-contain"
          style={combinedFilter ? { filter: combinedFilter } : undefined}
        />
      );
    }
    return <CupIcon className={lg ? "size-10 text-gold" : "size-6 text-gold"} />;
  }
  return <CupIcon className={lg ? "size-10 text-gold" : "size-6 text-gold"} />;
}

export function labelFor(t: TrophyKind): string {
  switch (t.kind) {
    case "league": return "League";
    case "cup": return "Cup";
    case "continental": return "Continental";
    case "bonus": return "Bonus";
    case "national": return "National team";
    case "award": return "Award";
  }
}

export { renderIcon as renderTrophyIcon };

export function CupIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.6">
      <path d="M6 3h12v4a6 6 0 1 1-12 0V3Z" />
      <path d="M4 5H2a2 2 0 0 0 2 2" />
      <path d="M20 5h2a2 2 0 0 1-2 2" />
      <path d="M9 14h6l-1 4h-4l-1-4Z" />
      <path d="M8 21h8" />
    </svg>
  );
}

export function BallonIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="10" r="6" />
      <path d="M9 16l-1 5 4-2 4 2-1-5" />
      <path d="M12 4v12M6 10h12" />
    </svg>
  );
}

export function FlagIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
      <path d="M5 21V4l8 2 6-2v11l-6 2-8-2v6" />
    </svg>
  );
}

export function BootIcon({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 28 18" className={className} style={style} aria-label="Football boot">
      <path
        d="M2 12 L2 9.5 C2 8.2 3 7.5 4.2 7.5 L7 7.5 L9.5 4.5 C10.2 3.6 11.2 3 12.4 3 L17 3 C20.5 3 23.5 5 25.2 8 C25.7 8.9 26 9.9 26 10.9 L26 12 Z"
        fill="currentColor"
      />
      <path d="M10.5 5 L20 5" stroke="rgba(0,0,0,0.45)" strokeWidth="0.9" strokeLinecap="round" fill="none" />
      <path d="M11 6.8 L20 6.8" stroke="rgba(0,0,0,0.25)" strokeWidth="0.7" strokeLinecap="round" fill="none" />
      <path d="M1 12 L27 12 L26.5 13.5 L1.5 13.5 Z" fill="currentColor" opacity="0.85" />
      <rect x="3.2" y="13.5" width="2" height="3.2" rx="0.4" fill="currentColor" />
      <rect x="7.4" y="13.5" width="2" height="3.2" rx="0.4" fill="currentColor" />
      <rect x="11.6" y="13.5" width="2" height="3.2" rx="0.4" fill="currentColor" />
      <rect x="15.8" y="13.5" width="2" height="3.2" rx="0.4" fill="currentColor" />
      <rect x="20" y="13.5" width="2" height="3.2" rx="0.4" fill="currentColor" />
      <rect x="23.4" y="13.5" width="1.8" height="3.2" rx="0.4" fill="currentColor" />
    </svg>
  );
}
