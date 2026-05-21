"use client";

import type { Player } from "@/types";
import { ClubLogo, Flag } from "./Logo";
import { POSITION_SHORT } from "@/lib/squadNumbers";
import { COUNTRY_BY_CODE } from "@/lib/countries";
import { clubLogoUrl } from "@/lib/logos";

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
      className={`relative rounded-2xl overflow-hidden border border-line bg-ink-2 card-diagonal ${
        compact ? "p-4" : "p-6"
      }`}
      style={{
        background:
          "linear-gradient(135deg, var(--color-ink-3) 0%, var(--color-ink-2) 60%, var(--color-ink-4) 100%)",
      }}
    >
      {/* Teal glow top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pitch/60 to-transparent" />
      {/* Gold glow bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Top row: OVR + position + flag/name */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* OVR circle */}
          <div className="relative flex flex-col items-center">
            <div
              className={`flex items-center justify-center rounded-full border-2 border-pitch/40 bg-pitch-deep/30 ${
                compact ? "size-16" : "size-20"
              }`}
            >
              <span
                className={`font-display font-bold leading-none text-pitch glow-teal ${
                  compact ? "text-3xl" : "text-4xl"
                }`}
              >
                {overall ?? 78}
              </span>
            </div>
            <span className="mt-1 text-[9px] uppercase tracking-widest text-bone-3 font-mono">
              {POSITION_SHORT[player.position]}
            </span>
          </div>

          {/* Name + flag */}
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-1">
              <Flag code={player.countryCode} width={18} height={13} className="rounded-sm" />
              <span className="text-[11px] text-bone-3 font-mono uppercase tracking-widest">
                {country?.name ?? player.countryCode}
              </span>
            </div>
            <h2
              className={`font-display font-bold leading-tight tracking-tight text-bone ${
                compact ? "text-2xl" : "text-3xl"
              }`}
            >
              {player.firstName}{" "}
              <span className="text-bone-2">{player.lastName}</span>
            </h2>
            <div className="mt-1 text-[11px] text-bone-3 font-mono">
              #{player.number} · {age} yrs
            </div>
          </div>
        </div>

        {/* Club logo + name */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <ClubLogo
            name={player.currentClubName}
            url={clubLogoUrl(player.currentClubId)}
            size={compact ? 40 : 52}
            clubId={player.currentClubId}
          />
          <div className="text-right">
            <div className="text-sm font-medium text-bone leading-tight">
              {player.currentClubName}
            </div>
            <div className="text-[10px] text-bone-3 font-mono uppercase tracking-widest">
              {player.currentLeague}
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <StatChip label="Salary / yr" value={fmtEur(player.salaryEur)} />
          <StatChip label="Contract" value={`${player.contractYearsLeft}y`} />
          <StatChip label="Potential" value={String(player.potential)} accent />
        </div>
      )}
    </div>
  );
}

function StatChip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 ${
        accent ? "border-gold/40 bg-gold/5" : "border-line bg-ink-3"
      }`}
    >
      <div className="text-[9px] uppercase tracking-widest text-bone-3 font-mono">{label}</div>
      <div className={`mt-1 num text-base font-bold ${accent ? "text-gold" : "text-bone"}`}>
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
