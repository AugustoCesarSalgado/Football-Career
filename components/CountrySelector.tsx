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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {COUNTRIES.map((c) => {
        const selected = c.code === value;
        return (
          <button
            key={c.code}
            type="button"
            onClick={() => onChange(c.code)}
            className={`group relative flex items-center gap-2.5 px-3 py-3 rounded-xl border text-left transition-all duration-200 ${
              selected
                ? "bg-pitch/10 border-pitch/60 text-bone ring-1 ring-pitch/30"
                : "bg-ink-2 border-line text-bone-2 hover:border-bone-3/40 hover:bg-ink-3"
            }`}
          >
            <Flag code={c.code} width={24} height={17} className="shrink-0 rounded-sm overflow-hidden" />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate leading-tight">{c.name}</div>
              <div className="text-[10px] text-bone-3 font-mono truncate leading-tight mt-0.5">{c.league}</div>
            </div>
            {selected && (
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-pitch anim-pulse-ring" />
            )}
          </button>
        );
      })}
    </div>
  );
}
