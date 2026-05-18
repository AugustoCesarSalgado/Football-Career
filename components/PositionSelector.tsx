"use client";

import type { Position } from "@/types";
import { POSITION_LABEL } from "@/lib/squadNumbers";

const POSITIONS: Array<{ id: Position; label: string; short: string; desc: string }> = [
  { id: "GK", label: "Arquero", short: "GK", desc: "Atajadas · vallas invictas" },
  { id: "DEF", label: "Defensor", short: "DEF", desc: "Marcas · intercepciones" },
  { id: "MID", label: "Mediocampista", short: "MID", desc: "Balance · creación" },
  { id: "FWD", label: "Delantero", short: "FWD", desc: "Goles · finalización" },
];

export function PositionSelector({
  value,
  onChange,
}: {
  value: Position | null;
  onChange: (p: Position) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {POSITIONS.map((p) => {
        const selected = p.id === value;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={`relative flex flex-col items-start gap-1 px-4 py-4 border text-left transition-all ${
              selected
                ? "bg-gold/10 border-gold text-bone"
                : "bg-ink-2 border-line text-bone-2 hover:border-bone-3 hover:bg-ink-3"
            }`}
          >
            <span
              className={`font-display text-3xl tracking-wide leading-none ${
                selected ? "text-gold" : "text-bone"
              }`}
            >
              {p.short}
            </span>
            <span className="text-sm font-medium">{POSITION_LABEL[p.id]}</span>
            <span className="text-[10px] uppercase tracking-widest text-bone-3 font-mono">
              {p.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
