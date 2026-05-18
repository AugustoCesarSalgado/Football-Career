"use client";

import type { Season } from "@/types";
import { ClubLogo } from "./Logo";
import { clubLogoUrl } from "@/lib/logos";
import { ordinal } from "@/lib/format";

export function SeasonRow({
  season,
  startYear,
  highlight = false,
}: {
  season: Season;
  startYear: number;
  highlight?: boolean;
}) {
  const year = startYear + (season.age - 18);
  const trophyBits: string[] = [];
  if (season.club.leagueWin) trophyBits.push("🏆 League");
  if (season.club.nationalCupWon) trophyBits.push("🏆 Cup");
  if (season.club.continentalResult === "champion")
    trophyBits.push("🌍 Continental");
  if (season.national.tournament?.result === "champion")
    trophyBits.push("🌐 NT");
  season.awards.forEach((a) => trophyBits.push(`✨ ${a}`));

  return (
    <div
      className={`grid grid-cols-[64px_44px_1fr_auto] items-center gap-4 px-4 py-3 border-l-2 ${
        highlight ? "border-pitch bg-ink-3" : "border-line bg-ink-2"
      } hover:bg-ink-3 transition-colors`}
    >
      <div className="num text-bone-2 text-sm tracking-tight">
        <span className="text-bone-3">'</span>
        {String(year).slice(2)}
      </div>
      <ClubLogo
        name={season.clubName}
        url={clubLogoUrl(season.clubId)}
        size={36}
      />
      <div className="min-w-0">
        <div className="text-bone font-medium truncate">
          {season.clubName}
          <span className="text-bone-3 ml-2 text-xs font-mono uppercase tracking-widest">
            {season.league} · {ordinal(season.club.leaguePosition)}
          </span>
        </div>
        <div className="text-bone-3 text-xs font-mono mt-0.5 truncate">
          {season.stats.appearances} apps · {season.stats.goals}G ·{" "}
          {season.stats.assists}A · ★ {season.stats.rating.toFixed(1)}
          {trophyBits.length > 0 && (
            <span className="ml-2 text-bone-2">{trophyBits.join(" · ")}</span>
          )}
        </div>
      </div>
      <div className="text-right num text-xs text-bone-3 uppercase tracking-widest">
        age {season.age}
      </div>
    </div>
  );
}
