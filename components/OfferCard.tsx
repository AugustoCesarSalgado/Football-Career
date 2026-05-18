"use client";

import type { Offer } from "@/types";
import { ClubLogo, Flag } from "./Logo";
import { clubLogoUrl } from "@/lib/logos";
import { fmtMoney } from "@/lib/format";

export function OfferCard({
  offer,
  onAccept,
  current,
}: {
  offer: Offer;
  onAccept: () => void;
  current?: { salaryEur: number };
}) {
  const isRenew = offer.type === "renew";
  const accent = isRenew ? "pitch" : "gold";
  const accentRing =
    accent === "pitch"
      ? "hover:ring-pitch hover:border-pitch"
      : "hover:ring-gold hover:border-gold";
  const tierLabel = ["Elite", "Top", "Mid", "Small"][offer.clubTier - 1] ?? "Club";
  const salaryDelta =
    current && current.salaryEur > 0
      ? Math.round(((offer.salaryEur - current.salaryEur) / current.salaryEur) * 100)
      : 0;

  return (
    <button
      type="button"
      onClick={onAccept}
      className={`group relative w-full overflow-hidden text-left border bg-ink-2 hover:bg-ink-3 transition-all ring-0 hover:ring-1 ${
        isRenew ? "border-pitch/50" : "border-gold/50"
      } ${accentRing}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-60"
        style={{ color: isRenew ? "var(--color-pitch)" : "var(--color-gold)" }}
      />
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] uppercase tracking-[0.3em] font-mono ${
              isRenew ? "text-pitch" : "text-gold"
            }`}
          >
            {isRenew ? "Option A · Renew" : "Option B · Transfer"}
          </span>
          <span className="text-[10px] uppercase tracking-widest font-mono text-bone-3 px-2 py-0.5 border border-line">
            {tierLabel}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <ClubLogo
            name={offer.clubName}
            url={clubLogoUrl(offer.clubId)}
            size={72}
            className="shrink-0"
          />
          <div className="min-w-0">
            <h3 className="font-display text-3xl leading-tight tracking-wide text-bone">
              {offer.clubName}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-bone-3 text-[10px] uppercase tracking-[0.25em] font-mono">
              <Flag code={offer.clubCountry} width={18} height={12} />
              <span>{offer.clubLeague}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <Field
            label="Salary / yr"
            value={fmtMoney(offer.salaryEur)}
            accent={accent === "pitch" ? "pitch" : "gold"}
            sub={
              salaryDelta !== 0
                ? `${salaryDelta > 0 ? "+" : ""}${salaryDelta}%`
                : undefined
            }
          />
          <Field
            label={isRenew ? "Stay" : "Contract"}
            value={`${offer.contractYears}y`}
          />
          {!isRenew && offer.transferFeeEur ? (
            <Field label="Transfer fee" value={fmtMoney(offer.transferFeeEur)} />
          ) : (
            <Field label="Loyalty" value="—" />
          )}
        </div>

        <div
          className={`mt-6 inline-flex items-center gap-2 px-4 py-2 text-[11px] uppercase tracking-[0.25em] font-mono ${
            isRenew
              ? "text-pitch border border-pitch/60 group-hover:bg-pitch group-hover:text-ink"
              : "text-gold border border-gold/60 group-hover:bg-gold group-hover:text-ink"
          } transition-colors`}
        >
          {isRenew ? "Re-sign →" : "Accept transfer →"}
        </div>
      </div>
    </button>
  );
}

function Field({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "pitch" | "gold";
}) {
  return (
    <div className="border border-line bg-ink-3 px-3 py-2">
      <div className="text-[9px] uppercase tracking-[0.3em] text-bone-3 font-mono">
        {label}
      </div>
      <div
        className={`num text-lg leading-tight ${
          accent === "pitch"
            ? "text-pitch"
            : accent === "gold"
            ? "text-gold"
            : "text-bone"
        }`}
      >
        {value}
      </div>
      {sub && (
        <div
          className={`text-[10px] font-mono mt-0.5 ${
            sub.startsWith("+") ? "text-pitch" : "text-bone-3"
          }`}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
