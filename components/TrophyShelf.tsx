import Image from "next/image";
import { TrophyKind, CupIcon, BallonIcon, FlagIcon, BootIcon } from "./Trophy";
import { competitionLogoUrl } from "@/lib/logos";
import { NATIONAL_TOURNAMENT_LOGO } from "@/lib/competitions";

interface GroupedTrophy {
  key: string;
  kind: TrophyKind["kind"];
  name: string;
  compId?: string;
  count: number;
  years: number[];
}

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
      map.set(key, {
        key,
        kind: t.kind,
        name: t.name,
        compId,
        count: 1,
        years: [t.year],
      });
    }
  }
  // Sort by prestige then by count desc
  const order: Record<TrophyKind["kind"], number> = {
    award: 0,
    national: 1,
    continental: 2,
    bonus: 3,
    league: 4,
    cup: 5,
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
      <div className="border border-dashed border-line bg-ink-2 p-10 text-center">
        <div className="font-display text-2xl text-bone-3 uppercase tracking-wide">
          An empty cabinet
        </div>
        <div className="text-bone-3 text-[10px] font-mono mt-2 uppercase tracking-widest">
          No silverware. No tears.
        </div>
      </div>
    );
  }

  const totalCount = grouped.reduce((s, g) => s + g.count, 0);
  const totalTitles = grouped.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-l-2 border-gold pl-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
            Trophies won
          </div>
          <div className="font-display text-5xl text-gold leading-none">{totalCount}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
            Distinct titles
          </div>
          <div className="font-display text-5xl text-bone leading-none">{totalTitles}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {grouped.map((g, i) => (
          <TrophyShelfCard key={g.key} g={g} index={i} />
        ))}
      </div>
    </div>
  );
}

function TrophyShelfCard({ g, index }: { g: GroupedTrophy; index: number }) {
  const accent =
    g.kind === "continental" || g.kind === "bonus" || g.kind === "national" || g.kind === "award"
      ? "gold"
      : "pitch";
  const borderCls = accent === "gold" ? "border-gold/40" : "border-pitch/40";
  const bgCls = accent === "gold" ? "bg-gold/5" : "bg-pitch-deep/15";
  const accentText = accent === "gold" ? "text-gold" : "text-pitch";

  return (
    <div
      className={`relative border ${borderCls} ${bgCls} px-4 py-5 anim-rise overflow-hidden bg-noise`}
      style={{ animationDelay: `${100 + index * 60}ms` }}
    >
      {/* count badge */}
      <span
        className={`absolute top-3 right-3 num text-2xl ${accentText} leading-none`}
      >
        ×{g.count}
      </span>

      <div className="flex items-start gap-4">
        <div className="shrink-0 size-16 flex items-center justify-center bg-ink-2 border border-line">
          {renderShelfIcon(g)}
        </div>
        <div className="min-w-0 pt-1">
          <div className="text-[9px] uppercase tracking-[0.3em] text-bone-3 font-mono">
            {kindLabel(g.kind)}
          </div>
          <div className="font-display text-lg text-bone leading-tight tracking-wide">
            {g.name}
          </div>
          <div className="text-[10px] text-bone-3 font-mono mt-1 num tracking-widest">
            {summarizeYears(g.years)}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderShelfIcon(g: GroupedTrophy) {
  if ((g.kind === "continental" || g.kind === "bonus") && g.compId) {
    const url = competitionLogoUrl(g.compId);
    if (url) return <Image src={url} alt={g.name} width={56} height={56} unoptimized />;
    return <CupIcon className="size-9 text-gold" />;
  }
  if (g.kind === "national") {
    const slug = NATIONAL_TOURNAMENT_LOGO[g.name];
    if (slug)
      return <Image src={`/tournaments/${slug}.svg`} alt={g.name} width={56} height={56} unoptimized />;
    return <FlagIcon className="size-9 text-gold" />;
  }
  if (g.kind === "award") {
    if (g.name === "Golden Boot")
      return <BootIcon className="size-10 text-gold" />;
    return <BallonIcon className="size-9 text-gold" />;
  }
  return <CupIcon className={`size-9 ${g.kind === "league" ? "text-pitch" : "text-gold"}`} />;
}

function kindLabel(k: TrophyKind["kind"]): string {
  switch (k) {
    case "league":
      return "Domestic league";
    case "cup":
      return "Domestic cup";
    case "continental":
      return "Continental";
    case "bonus":
      return "Honorary";
    case "national":
      return "National team";
    case "award":
      return "Individual";
  }
}

function summarizeYears(years: number[]): string {
  const sorted = [...years].sort((a, b) => a - b);
  if (sorted.length <= 4) return sorted.join(" · ");
  return `${sorted[0]}…${sorted[sorted.length - 1]}`;
}
