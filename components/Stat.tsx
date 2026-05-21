"use client";

import { useEffect, useState } from "react";

export function CountUp({
  value,
  duration = 900,
  className = "",
  format = (n: number) => `${Math.round(n)}`,
  delayMs = 0,
}: {
  value: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
  delayMs?: number;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start = 0;
    const timeout = window.setTimeout(() => {
      const tick = (t: number) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setV(value * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delayMs);
    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [value, duration, delayMs]);
  return <span className={className}>{format(v)}</span>;
}

export function BigStat({
  label,
  value,
  unit,
  delayMs = 0,
  accent,
  format,
}: {
  label: string;
  value: number;
  unit?: string;
  delayMs?: number;
  accent?: "pitch" | "gold" | "blood";
  format?: (n: number) => string;
}) {
  const color =
    accent === "pitch"
      ? "text-pitch"
      : accent === "gold"
      ? "text-gold"
      : accent === "blood"
      ? "text-blood"
      : "text-bone";

  const glowClass =
    accent === "pitch" ? "glow-teal" : accent === "gold" ? "glow-amber" : "";

  return (
    <div
      className="rounded-2xl border border-line bg-ink-2 p-5 relative overflow-hidden anim-rise"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="text-[10px] uppercase tracking-widest text-bone-3 font-mono mb-3">
        {label}
      </div>
      <div className="flex items-end gap-1.5">
        <CountUp
          value={value}
          delayMs={delayMs + 150}
          format={format ?? ((n) => `${Math.round(n)}`)}
          className={`font-display font-bold text-5xl leading-none ${color} ${glowClass}`}
        />
        {unit && (
          <span className="text-bone-3 text-xs uppercase tracking-widest font-mono pb-1">
            {unit}
          </span>
        )}
      </div>
      {/* subtle gradient accent at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-40"
        style={{
          background: accent === "pitch"
            ? "var(--color-pitch)"
            : accent === "gold"
            ? "var(--color-gold)"
            : accent === "blood"
            ? "var(--color-blood)"
            : "var(--color-bone-3)",
        }}
      />
    </div>
  );
}
