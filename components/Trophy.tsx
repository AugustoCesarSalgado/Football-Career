import Image from "next/image";
import { competitionLogoUrl } from "@/lib/logos";
import { NATIONAL_TOURNAMENT_LOGO } from "@/lib/competitions";

export type TrophyKind =
  | { kind: "league"; name: string; year: number }
  | { kind: "cup"; name: string; year: number }
  | { kind: "continental"; compId: string; name: string; year: number }
  | { kind: "bonus"; compId: string; name: string; year: number }
  | { kind: "national"; name: string; year: number }
  | { kind: "award"; name: string; year: number };

export function TrophyTile({ trophy }: { trophy: TrophyKind }) {
  const color =
    trophy.kind === "continental" || trophy.kind === "bonus"
      ? "border-gold/40 bg-gold/5"
      : trophy.kind === "national"
      ? "border-gold/40 bg-gold/5"
      : trophy.kind === "award"
      ? "border-gold-2/40 bg-gold/5"
      : "border-pitch/40 bg-pitch-deep/20";

  const icon = renderIcon(trophy);

  return (
    <div className={`flex items-center gap-3 px-3 py-2 border ${color}`} title={trophy.name}>
      <div className="shrink-0 size-9 flex items-center justify-center">{icon}</div>
      <div className="min-w-0">
        <div className="text-[9px] uppercase tracking-[0.25em] text-bone-3 font-mono">
          {labelFor(trophy)} · {trophy.year}
        </div>
        <div className="text-sm font-medium truncate text-bone">{trophy.name}</div>
      </div>
    </div>
  );
}

function renderIcon(t: TrophyKind) {
  if (t.kind === "continental" || t.kind === "bonus") {
    const src = competitionLogoUrl(t.compId);
    if (src) return <Image src={src} alt={t.name} width={36} height={36} unoptimized />;
    return <CupIcon className="size-7 text-gold" />;
  }
  if (t.kind === "national") {
    const slug = NATIONAL_TOURNAMENT_LOGO[t.name];
    if (slug)
      return (
        <Image src={`/tournaments/${slug}.svg`} alt={t.name} width={36} height={36} unoptimized />
      );
    return <FlagIcon className="size-7 text-gold" />;
  }
  if (t.kind === "award") {
    if (t.name === "Golden Boot")
      return <BootIcon className="size-7 text-gold" />;
    return <BallonIcon className="size-7 text-gold" />;
  }
  if (t.kind === "league") return <CupIcon className="size-7 text-pitch" />;
  return <CupIcon className="size-7 text-gold" />;
}

function labelFor(t: TrophyKind): string {
  switch (t.kind) {
    case "league":
      return "League";
    case "cup":
      return "Cup";
    case "continental":
      return "Continental";
    case "bonus":
      return "Bonus";
    case "national":
      return "National team";
    case "award":
      return "Award";
  }
}

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

export function BallonIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
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

/** Stylized football boot — for the Golden Boot award */
export function BootIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 18" className={className} aria-label="Football boot">
      {/* heel + upper */}
      <path
        d="M2 12 L2 9.5 C2 8.2 3 7.5 4.2 7.5 L7 7.5 L9.5 4.5 C10.2 3.6 11.2 3 12.4 3 L17 3 C20.5 3 23.5 5 25.2 8 C25.7 8.9 26 9.9 26 10.9 L26 12 Z"
        fill="currentColor"
      />
      {/* lace strip detail */}
      <path
        d="M10.5 5 L20 5"
        stroke="rgba(0,0,0,0.45)"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M11 6.8 L20 6.8"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="0.7"
        strokeLinecap="round"
        fill="none"
      />
      {/* sole */}
      <path
        d="M1 12 L27 12 L26.5 13.5 L1.5 13.5 Z"
        fill="currentColor"
        opacity="0.85"
      />
      {/* studs */}
      <rect x="3.2" y="13.5" width="2" height="3.2" rx="0.4" fill="currentColor" />
      <rect x="7.4" y="13.5" width="2" height="3.2" rx="0.4" fill="currentColor" />
      <rect x="11.6" y="13.5" width="2" height="3.2" rx="0.4" fill="currentColor" />
      <rect x="15.8" y="13.5" width="2" height="3.2" rx="0.4" fill="currentColor" />
      <rect x="20" y="13.5" width="2" height="3.2" rx="0.4" fill="currentColor" />
      <rect x="23.4" y="13.5" width="1.8" height="3.2" rx="0.4" fill="currentColor" />
    </svg>
  );
}
