"use client";

import { ClubLogo, Flag } from "./Logo";
import { clubLogoUrl } from "@/lib/logos";
import type { CareerState } from "@/types";
import { POSITION_LABEL } from "@/lib/squadNumbers";

export function ResumeBanner({
  career,
  onResume,
  onDiscard,
}: {
  career: CareerState;
  onResume: () => void;
  onDiscard: () => void;
}) {
  const { player, currentAge, seasons, finished } = career;
  const totalGoals = seasons.reduce((s, x) => s + x.stats.goals, 0);
  const totalAssists = seasons.reduce((s, x) => s + x.stats.assists, 0);
  const yearsLeft = 40 - currentAge + 1;
  const status = finished ? "Retired" : "In progress";

  return (
    <div className="border-b border-pitch/20 bg-pitch-deep/15 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-wrap items-center gap-5 anim-rise">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-pitch font-mono">
          <span className="size-1.5 bg-pitch rounded-full anim-pulse-ring" />
          {status}
        </div>

        <div className="w-px h-8 bg-line hidden sm:block" />

        <div className="flex items-center gap-3 min-w-0">
          <ClubLogo
            name={player.currentClubName}
            url={clubLogoUrl(player.currentClubId)}
            size={36}
            className="shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] text-bone-3 font-mono">
              <Flag code={player.countryCode} width={14} height={10} className="rounded-sm" />
              <span>{POSITION_LABEL[player.position]} · #{player.number}</span>
            </div>
            <div className="font-display font-bold text-lg text-bone leading-tight tracking-tight truncate">
              {player.firstName} <span className="text-bone-2">{player.lastName}</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-auto flex-wrap">
          <Chip label="Age" value={`${currentAge}`} />
          <Chip label="Seasons" value={`${seasons.length}`} />
          <Chip label="Goals" value={`${totalGoals}`} accent="pitch" />
          <Chip label="Assists" value={`${totalAssists}`} />
          <Chip label="Yrs left" value={`${yearsLeft}`} accent="gold" />
        </div>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <button
            type="button"
            onClick={onResume}
            className="bg-pitch text-ink px-4 py-2 rounded-lg font-display font-bold text-sm tracking-tight hover:bg-pitch-2 transition-colors"
          >
            {finished ? "Open →" : "Resume →"}
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="px-3 py-2 rounded-lg border border-line hover:border-blood/60 hover:text-blood text-bone-3 text-[10px] uppercase tracking-widest font-mono transition-colors"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}

function Chip({
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
    <div className="rounded-lg border border-line bg-ink-2 px-2.5 py-1.5">
      <div className="text-[8px] uppercase tracking-widest text-bone-3 font-mono">{label}</div>
      <div className={`num text-sm font-bold leading-tight ${c}`}>{value}</div>
    </div>
  );
}
