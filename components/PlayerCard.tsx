"use client";

import type { Player } from "@/types";
import { ClubLogo, Flag } from "./Logo";
import { Crest } from "./Crest";
import { POSITION_SHORT } from "@/lib/squadNumbers";
import { COUNTRY_BY_CODE } from "@/lib/countries";
import { clubLogoUrl, leagueLogoUrl } from "@/lib/logos";

export function PlayerCard({
  player,
  age,
  overall,
  compact = false,
}: {
  player: Player;
  age: number;
  overall?: number;
  compact?: boolean;
}) {
  const country = COUNTRY_BY_CODE[player.countryCode];
  return (
    <div
      className={`relative isolate overflow-hidden border border-line bg-ink-2 ${
        compact ? "p-4" : "p-6"
      } kit-stripes bg-noise`}
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 40% at 70% -20%, rgba(245,197,66,0.18), transparent 65%), radial-gradient(ellipse 60% 40% at -10% 120%, rgba(109,255,122,0.16), transparent 60%)",
      }}
    >
      {/* notch */}
      <span className="absolute top-0 left-6 w-24 h-1 bg-gold" />
      <span className="absolute top-0 right-6 w-24 h-1 bg-pitch" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <span
              className={`font-display ${
                compact ? "text-5xl" : "text-7xl"
              } leading-none text-bone`}
            >
              {overall ?? 78}
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-bone-3 font-mono">
              {POSITION_SHORT[player.position]}
            </span>
          </div>
          <div className="h-16 w-px bg-line" />
          <div>
            <div className="flex items-center gap-2 text-bone-3 text-[11px] uppercase tracking-[0.25em] font-mono">
              <Flag code={player.countryCode} width={20} height={14} />
              <span>{country?.name ?? player.countryCode}</span>
            </div>
            <h2
              className={`font-display ${
                compact ? "text-2xl" : "text-4xl"
              } leading-tight text-bone tracking-wide`}
            >
              {player.firstName}
              <br className={compact ? "hidden" : ""} />
              <span className="text-bone-2">{player.lastName}</span>
            </h2>
            <div className="mt-1 text-bone-3 text-xs font-mono uppercase tracking-widest">
              #{player.number} · {age} yrs
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <ClubLogo
            name={player.currentClubName}
            url={clubLogoUrl(player.currentClubId)}
            size={compact ? 44 : 64}
          />
          <div className="text-right">
            <div className="text-bone font-medium text-sm leading-tight">
              {player.currentClubName}
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-bone-3 font-mono">
              {player.currentLeague}
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat label="Salary / yr" value={fmtEur(player.salaryEur)} />
          <Stat label="Contract" value={`${player.contractYearsLeft}y`} />
          <Stat label="Potential" value={String(player.potential)} accent />
        </div>
      )}
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
  accent?: boolean;
}) {
  return (
    <div
      className={`border ${
        accent ? "border-gold/50" : "border-line"
      } bg-ink-3 px-3 py-2`}
    >
      <div className="text-[9px] uppercase tracking-[0.3em] text-bone-3 font-mono">
        {label}
      </div>
      <div
        className={`mt-1 num text-xl ${accent ? "text-gold" : "text-bone"}`}
      >
        {value}
      </div>
    </div>
  );
}

function fmtEur(n: number): string {
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `€${Math.round(n / 1_000)}k`;
  return `€${n}`;
}
