"use client";

import type { Position } from "@/types";
import { POSITION_LABEL } from "@/lib/squadNumbers";

const POSITIONS: Array<{ id: Position; short: string; desc: string; icon: string }> = [
  { id: "GK", short: "GK", desc: "Atajadas · vallas invictas", icon: "🧤" },
  { id: "DEF", short: "DEF", desc: "Marcas · intercepciones", icon: "🛡️" },
  { id: "MID", short: "MID", desc: "Balance · creación", icon: "⚙️" },
  { id: "FWD", short: "FWD", desc: "Goles · finalización", icon: "⚡" },
];

export function PositionSelector({
  value,
  onChange,
}: {
  value: Position | null;
  onChange: (p: Position) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {POSITIONS.map((p) => {
        const selected = p.id === value;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={`group flex-1 min-w-[80px] flex flex-col items-center gap-2 px-4 py-5 rounded-2xl border text-center transition-all duration-200 ${
              selected
                ? "bg-gold/10 border-gold/60 ring-1 ring-gold/25 text-bone"
                : "bg-ink-2 border-line text-bone-2 hover:border-bone-3/40 hover:bg-ink-3"
            }`}
          >
            <span className="text-2xl">{p.icon}</span>
            <span
              className={`font-display font-bold text-2xl leading-none tracking-tight ${
                selected ? "text-gold glow-amber" : "text-bone"
              }`}
            >
              {p.short}
            </span>
            <span className="text-xs text-bone-3 font-medium leading-tight">{POSITION_LABEL[p.id]}</span>
            <span className="text-[10px] text-bone-3/60 font-mono hidden sm:block">{p.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
