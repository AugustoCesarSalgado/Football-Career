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
  if (season.club.leagueWin) trophyBits.push("🏆");
  if (season.club.nationalCupWon) trophyBits.push("🥇");
  if (season.club.continentalResult === "champion") trophyBits.push("🌍");
  if (season.national.tournament?.result === "champion") trophyBits.push("🌐");
  season.awards.forEach(() => trophyBits.push("⭐"));

  const ratingColor =
    season.stats.rating >= 8.5
      ? "bg-pitch/20 text-pitch border-pitch/40"
      : season.stats.rating >= 7.5
      ? "bg-gold/15 text-gold border-gold/40"
      : season.stats.rating < 6.5
      ? "bg-blood/15 text-blood border-blood/40"
      : "bg-ink-3 text-bone-2 border-line";

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-colors ${
        highlight
          ? "border-pitch/30 bg-pitch-deep/20"
          : "border-line bg-ink-2 hover:bg-ink-3"
      }`}
    >
      <div className="num text-bone-3 text-xs w-10 shrink-0 text-right">
        '{String(year).slice(2)}
      </div>

      <ClubLogo
        name={season.clubName}
        url={clubLogoUrl(season.clubId)}
        size={32}
        className="shrink-0"
        clubId={season.clubId}
      />

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-bone truncate leading-tight">
          {season.clubName}
          {trophyBits.length > 0 && (
            <span className="ml-2 text-sm">{trophyBits.join("")}</span>
          )}
        </div>
        <div className="text-[11px] text-bone-3 font-mono mt-0.5 truncate">
          {season.stats.appearances} apps · {season.stats.goals}G · {season.stats.assists}A
          <span className="mx-1 opacity-40">·</span>
          {ordinal(season.club.leaguePosition)} in {season.league}
        </div>
      </div>

      <div className={`shrink-0 rounded-full border px-2.5 py-0.5 num text-sm font-bold ${ratingColor}`}>
        {season.stats.rating.toFixed(1)}
      </div>

      <div className="num text-[11px] text-bone-3 w-10 text-right shrink-0">
        {season.age}y
      </div>
    </div>
  );
}
