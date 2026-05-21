"use client";

import { useEffect } from "react";
import { ClubLogo, Flag } from "./Logo";
import { clubLogoUrl } from "@/lib/logos";
import { fmtMoney } from "@/lib/format";
import type { Offer } from "@/types";

const DURATION_MS = 4600;
const SHAFT = 112;

const STYLES = `
@keyframes ta-flash {
  0%   { opacity: 1; }
  60%  { opacity: 0.6; }
  100% { opacity: 0; }
}
@keyframes ta-crash {
  0%   { opacity: 0; transform: translateY(-90px) scaleY(1.25); }
  55%  { opacity: 1; transform: translateY(8px) scaleY(0.96); }
  78%  { transform: translateY(-3px) scaleY(1.01); }
  100% { opacity: 1; transform: translateY(0) scaleY(1); }
}
@keyframes ta-left {
  0%   { opacity: 0; transform: translateX(-150px) skewX(10deg); }
  55%  { opacity: 1; transform: translateX(10px) skewX(-3deg); }
  100% { opacity: 1; transform: translateX(0) skewX(0); }
}
@keyframes ta-right {
  0%   { opacity: 0; transform: translateX(150px) skewX(-10deg); }
  55%  { opacity: 1; transform: translateX(-10px) skewX(3deg); }
  100% { opacity: 1; transform: translateX(0) skewX(0); }
}
@keyframes ta-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes ta-stroke {
  to { stroke-dashoffset: 0; }
}
@keyframes ta-pop {
  0%   { opacity: 0; transform: scale(0.3); }
  55%  { opacity: 1; transform: scale(1.28); }
  78%  { transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes ta-expand {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes ta-ring {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.2); opacity: 0; }
}
`;

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

  const ease = "cubic-bezier(0.22,1,0.36,1)";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#07090f" }}
    >
      <style>{STYLES}</style>

      {/* Green burst flash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(45,212,191,0.42) 0%, transparent 65%)",
          animation: "ta-flash 0.75s ease-out both",
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)",
        }}
      />

      {/* ── LIVE badge ── */}
      <div
        className="absolute top-5 left-5 z-30 flex items-center gap-2"
        style={{ animation: "ta-fade 0.3s ease 0.4s both" }}
      >
        <span
          className="size-2 rounded-full bg-blood inline-block shrink-0"
          style={{ animation: "flicker 1s linear 0.8s infinite" }}
        />
        <span className="text-[10px] font-mono uppercase tracking-widest text-blood font-bold">
          Live
        </span>
      </div>

      {/* ── CONFIRMED badge ── */}
      <div
        className="absolute top-5 right-5 z-30"
        style={{ animation: "ta-fade 0.3s ease 0.5s both" }}
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pitch border border-pitch/40 bg-pitch/10 px-3 py-1 rounded-full">
          ✓&nbsp;Confirmed
        </span>
      </div>

      {/* ── HEADER ── */}
      <div
        className="relative z-10 text-center mb-10"
        style={{ animation: `ta-crash 0.6s ${ease} 0.05s both` }}
      >
        <div className="flex items-center justify-center gap-4 mb-1">
          <div
            className="h-[3px] w-14 bg-pitch rounded-full"
            style={{
              transformOrigin: "right",
              animation: "ta-expand 0.45s ease 0.68s both",
            }}
          />
          <h1
            className="font-display font-bold uppercase text-bone"
            style={{ fontSize: "clamp(26px,5vw,54px)", letterSpacing: "0.14em", lineHeight: 1 }}
          >
            Move Confirmed
          </h1>
          <div
            className="h-[3px] w-14 bg-pitch rounded-full"
            style={{
              transformOrigin: "left",
              animation: "ta-expand 0.45s ease 0.68s both",
            }}
          />
        </div>
        <div
          className="text-[11px] font-mono uppercase tracking-[0.3em] text-pitch"
          style={{ animation: "ta-fade 0.3s ease 0.92s both" }}
        >
          ● deal done ●
        </div>
      </div>

      {/* ── CLUBS + ARROW ── */}
      <div className="relative z-10 flex items-center gap-4 md:gap-8">

        {/* FROM club */}
        <div
          className="flex flex-col items-center gap-3"
          style={{ animation: `ta-left 0.55s ${ease} 0.22s both` }}
        >
          <div
            className="size-24 flex items-center justify-center rounded-2xl border border-line bg-ink-2"
            style={{ filter: "grayscale(0.55) brightness(0.7)" }}
          >
            <ClubLogo name={from.clubName} url={clubLogoUrl(from.clubId)} size={70} clubId={from.clubId} />
          </div>
          <div className="text-center">
            <div className="text-[9px] text-bone-3 font-mono uppercase tracking-widest mb-0.5">From</div>
            <div className="font-display font-bold text-sm text-bone-2 max-w-[110px] leading-tight">
              {from.clubName}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <Flag code={from.countryCode} width={12} height={9} className="rounded-sm shrink-0 opacity-50" />
              <span className="text-[10px] text-bone-3 font-mono truncate max-w-[90px] opacity-60">
                {from.league}
              </span>
            </div>
          </div>
        </div>

        {/* ── GREEN ARROW ── */}
        <div className="flex flex-col items-center gap-3">
          <svg
            width="170"
            height="50"
            viewBox="0 0 170 50"
            className="overflow-visible"
            style={{ filter: "drop-shadow(0 0 10px rgba(45,212,191,0.8))" }}
          >
            <line
              x1="8" y1="25"
              x2={8 + SHAFT} y2="25"
              stroke="var(--color-pitch)"
              strokeWidth="5"
              strokeLinecap="round"
              style={{
                strokeDasharray: SHAFT,
                strokeDashoffset: SHAFT,
                animation: "ta-stroke 0.52s ease-out 1.05s forwards",
              }}
            />
            <polygon
              points={`${8 + SHAFT - 4},12 162,25 ${8 + SHAFT - 4},38`}
              fill="var(--color-pitch)"
              style={{ opacity: 0, animation: "ta-pop 0.38s cubic-bezier(0.34,1.56,0.64,1) 1.52s forwards" }}
            />
          </svg>

          {to.transferFeeEur ? (
            <div
              className="rounded-full border-2 border-gold/50 bg-gold/10 px-5 py-1.5"
              style={{ opacity: 0, animation: "ta-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) 1.82s forwards" }}
            >
              <span className="text-sm text-gold font-mono font-bold tracking-wide">
                {fmtMoney(to.transferFeeEur)}
              </span>
            </div>
          ) : (
            <div
              className="rounded-full border border-pitch/45 bg-pitch/10 px-5 py-1.5"
              style={{ opacity: 0, animation: "ta-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) 1.82s forwards" }}
            >
              <span className="text-sm text-pitch font-mono font-bold tracking-wide">Free transfer</span>
            </div>
          )}
        </div>

        {/* TO club */}
        <div
          className="flex flex-col items-center gap-3"
          style={{ animation: `ta-right 0.55s ${ease} 0.34s both` }}
        >
          <div
            className="relative size-28 flex items-center justify-center rounded-2xl border-2 border-pitch/55 bg-pitch/5"
            style={{ boxShadow: "0 0 36px rgba(45,212,191,0.28), inset 0 0 20px rgba(45,212,191,0.05)" }}
          >
            <ClubLogo name={to.clubName} url={clubLogoUrl(to.clubId)} size={84} clubId={to.clubId} />
            <div
              className="absolute inset-0 rounded-2xl border-2 border-pitch/40"
              style={{ animation: "ta-ring 1.7s ease-out 1.55s infinite" }}
            />
          </div>
          <div className="text-center">
            <div className="text-[9px] text-pitch font-mono uppercase tracking-widest mb-0.5">To</div>
            <div className="font-display font-bold text-base text-bone max-w-[120px] leading-tight">
              {to.clubName}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <Flag code={to.clubCountry} width={14} height={10} className="rounded-sm shrink-0" />
              <span className="text-[11px] text-bone-3 font-mono truncate max-w-[100px]">
                {to.clubLeague}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── BOTTOM TICKER ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30"
        style={{ animation: "ta-fade 0.4s ease 2.3s both" }}
      >
        <div className="h-px bg-pitch/25" />
        <div className="bg-pitch/8 border-t border-pitch/15 py-2 overflow-hidden">
          <div className="whitespace-nowrap font-mono text-[11px] text-pitch uppercase tracking-widest anim-ticker">
            {Array(7).fill(null).map((_, i) => (
              <span key={i} className="mr-20">
                ●&nbsp;&nbsp;{from.clubName}&nbsp;→&nbsp;{to.clubName}
                &nbsp;&nbsp;&nbsp;
                {to.transferFeeEur ? fmtMoney(to.transferFeeEur) : "Free transfer"}
                &nbsp;&nbsp;&nbsp;Deal confirmed&nbsp;&nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
