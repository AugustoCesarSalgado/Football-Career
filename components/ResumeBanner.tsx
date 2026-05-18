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
    <div className="border-b border-pitch/30 bg-gradient-to-b from-pitch-deep/20 to-transparent">
      <div className="max-w-[1500px] mx-auto px-8 py-5 flex flex-wrap items-center gap-6 anim-rise">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-pitch font-mono">
          <span className="inline-block size-1.5 bg-pitch rounded-full anim-pulse-ring" />
          {status} · saved locally
        </div>

        <div className="h-10 w-px bg-pitch/30 hidden sm:block" />

        <div className="flex items-center gap-3 min-w-0">
          <ClubLogo
            name={player.currentClubName}
            url={clubLogoUrl(player.currentClubId)}
            size={44}
            className="shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
              <Flag code={player.countryCode} width={16} height={12} />
              <span>
                {POSITION_LABEL[player.position]} · #{player.number}
              </span>
            </div>
            <div className="font-display text-2xl text-bone leading-tight tracking-wide truncate">
              {player.firstName}{" "}
              <span className="text-bone-2">{player.lastName}</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Stat label="Age" value={`${currentAge}`} />
          <Stat label="Seasons" value={`${seasons.length}`} />
          <Stat label="Goals" value={`${totalGoals}`} accent="pitch" />
          <Stat label="Assists" value={`${totalAssists}`} />
          <Stat label="Years left" value={`${yearsLeft}`} accent="gold" />
        </div>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <button
            type="button"
            onClick={onResume}
            className="bg-pitch text-ink px-5 py-3 font-display text-xl tracking-wider uppercase hover:bg-pitch-2 transition-colors"
          >
            {finished ? "Open career →" : "Resume career →"}
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="px-3 py-3 border border-line hover:border-blood hover:text-blood text-bone-3 text-[10px] uppercase tracking-[0.25em] font-mono transition-colors"
            title="Wipe career and start over"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({
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
    <div className="border border-line bg-ink-2 px-3 py-1.5">
      <div className="text-[8px] uppercase tracking-[0.3em] text-bone-3 font-mono">{label}</div>
      <div className={`num text-base leading-tight ${c}`}>{value}</div>
    </div>
  );
}
