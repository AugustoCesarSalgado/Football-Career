"use client";

import { COUNTRIES } from "@/lib/countries";
import { Flag } from "./Logo";

export function CountrySelector({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (code: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {COUNTRIES.map((c) => {
        const selected = c.code === value;
        return (
          <button
            key={c.code}
            type="button"
            onClick={() => onChange(c.code)}
            className={`group relative flex items-center gap-3 px-3 py-2.5 border text-left transition-all ${
              selected
                ? "bg-pitch-deep/40 border-pitch text-bone"
                : "bg-ink-2 border-line text-bone-2 hover:border-bone-3 hover:bg-ink-3"
            }`}
          >
            <Flag code={c.code} width={28} height={20} className="shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{c.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-bone-3 font-mono truncate">
                {c.league}
              </div>
            </div>
            {selected && (
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-pitch anim-pulse-ring" />
            )}
          </button>
        );
      })}
    </div>
  );
}
