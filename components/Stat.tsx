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
  return (
    <div className="border border-line bg-ink-2 p-4 relative overflow-hidden anim-rise bg-noise" style={{ animationDelay: `${delayMs}ms` }}>
      <div className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <CountUp
          value={value}
          delayMs={delayMs + 150}
          format={format ?? ((n) => `${Math.round(n)}`)}
          className={`font-display text-6xl leading-none tracking-wide ${color}`}
        />
        {unit && (
          <span className="text-bone-3 text-xs uppercase tracking-widest font-mono">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
