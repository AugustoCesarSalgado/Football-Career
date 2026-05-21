"use client";

import { useEffect } from "react";
import { ClubLogo, Flag } from "./Logo";
import { clubLogoUrl } from "@/lib/logos";
import { fmtMoney } from "@/lib/format";
import type { Offer } from "@/types";

const DURATION_MS = 3400;

export function TransferAnimation({
  from,
  to,
  onDone,
}: {
  from: { clubId: string; clubName: string; league: string; countryCode: string };
  to: Offer;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, DURATION_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/97 backdrop-blur-2xl anim-fade">
      {/* Title */}
      <div
        className="text-[11px] text-gold font-mono uppercase tracking-[0.25em] mb-14 opacity-0"
        style={{ animation: "rise-in 0.5s var(--ease-stadium) 0.1s both" }}
      >
        ★&nbsp;&nbsp;Transfer confirmed&nbsp;&nbsp;★
      </div>

      {/* Main row */}
      <div className="flex items-center gap-6 md:gap-10">

        {/* FROM club */}
        <div
          className="flex flex-col items-center gap-4 opacity-0"
          style={{ animation: "rise-in 0.55s var(--ease-stadium) 0.2s both" }}
        >
          <div className="size-28 flex items-center justify-center rounded-2xl border border-line bg-ink-2">
            <ClubLogo name={from.clubName} url={clubLogoUrl(from.clubId)} size={80} />
          </div>
          <div className="text-center">
            <div className="text-[9px] text-bone-3 font-mono uppercase tracking-widest mb-1">From</div>
            <div className="font-display font-bold text-base text-bone-2 leading-tight max-w-[120px]">
              {from.clubName}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <Flag code={from.countryCode} width={14} height={10} className="rounded-sm shrink-0" />
              <span className="text-[11px] text-bone-3 font-mono truncate max-w-[100px]">{from.league}</span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex items-center w-32 md:w-44 h-8">
            {/* Growing line */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-bone-3/15 via-gold to-bone-3/15"
              style={{
                width: "calc(100% - 16px)",
                transformOrigin: "left center",
                animation: "arrow-grow 0.65s var(--ease-stadium) 0.8s both",
                transform: "scaleX(0)",
              }}
            />
            {/* Arrowhead */}
            <svg
              viewBox="0 0 10 10"
              className="absolute right-0 top-1/2 -translate-y-1/2 size-4 text-gold opacity-0"
              fill="currentColor"
              style={{ animation: "fade-in 0.25s ease 1.4s both" }}
            >
              <path d="M0 4.5h7.3L4.6 1.8l.9-.9L10 5l-4.5 4.1-.9-.9 2.7-2.7H0z" />
            </svg>
          </div>

          {/* Fee pill */}
          {to.transferFeeEur ? (
            <div
              className="rounded-full border border-gold/35 bg-gold/10 px-3.5 py-1.5 opacity-0"
              style={{ animation: "rise-in 0.4s var(--ease-stadium) 1.55s both" }}
            >
              <span className="text-[11px] text-gold font-mono font-bold tracking-wide">
                {fmtMoney(to.transferFeeEur)}
              </span>
            </div>
          ) : (
            <div
              className="rounded-full border border-pitch/30 bg-pitch/8 px-3.5 py-1.5 opacity-0"
              style={{ animation: "rise-in 0.4s var(--ease-stadium) 1.55s both" }}
            >
              <span className="text-[11px] text-pitch font-mono font-bold tracking-wide">Free</span>
            </div>
          )}
        </div>

        {/* TO club */}
        <div
          className="flex flex-col items-center gap-4 opacity-0"
          style={{ animation: "rise-in 0.55s var(--ease-stadium) 0.35s both" }}
        >
          <div className="relative size-28 flex items-center justify-center rounded-2xl border-2 border-gold/40 bg-gold/5">
            <ClubLogo name={to.clubName} url={clubLogoUrl(to.clubId)} size={80} />
            {/* Pulse ring */}
            <div
              className="absolute inset-0 rounded-2xl border border-gold/30"
              style={{ animation: "pulse-ring-box 2s ease-out 0.4s infinite" }}
            />
          </div>
          <div className="text-center">
            <div className="text-[9px] text-gold font-mono uppercase tracking-widest mb-1">To</div>
            <div className="font-display font-bold text-base text-bone leading-tight max-w-[120px]">
              {to.clubName}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <Flag code={to.clubCountry} width={14} height={10} className="rounded-sm shrink-0" />
              <span className="text-[11px] text-bone-3 font-mono truncate max-w-[100px]">{to.clubLeague}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Subtitle */}
      <div
        className="mt-14 text-[11px] text-bone-3 font-mono uppercase tracking-[0.2em] opacity-0"
        style={{ animation: "fade-in 0.5s ease 2.2s both" }}
      >
        Starting your new chapter…
      </div>
    </div>
  );
}
