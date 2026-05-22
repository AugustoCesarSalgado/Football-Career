"use client";

import type { Offer } from "@/types";
import { ClubLogo, Flag } from "./Logo";
import { clubLogoUrl, leagueLogoUrlByName } from "@/lib/logos";
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
  const tierLabel = ["Elite", "Top", "Mid", "Small"][offer.clubTier - 1] ?? "Club";
  const salaryDelta =
    current && current.salaryEur > 0
      ? Math.round(((offer.salaryEur - current.salaryEur) / current.salaryEur) * 100)
      : 0;

  return (
    <button
      type="button"
      onClick={onAccept}
      className={`group relative w-full text-left rounded-2xl border overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:shadow-2xl ${
        isRenew
          ? "bg-pitch-deep/20 border-pitch/30 hover:border-pitch/60 hover:shadow-pitch/10"
          : "bg-gold-deep/20 border-gold/30 hover:border-gold/60 hover:shadow-gold/10"
      }`}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: isRenew
            ? "linear-gradient(90deg, transparent, var(--color-pitch), transparent)"
            : "linear-gradient(90deg, transparent, var(--color-gold), transparent)",
        }}
      />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <span
            className={`text-[11px] uppercase tracking-widest font-mono font-bold px-3 py-1 rounded-full border ${
              isRenew
                ? "text-pitch border-pitch/40 bg-pitch/10"
                : "text-gold border-gold/40 bg-gold/10"
            }`}
          >
            {isRenew ? "Renew" : "Transfer"}
          </span>
          <span className="text-[10px] uppercase tracking-widest font-mono text-bone-3 px-2.5 py-1 rounded-full border border-line bg-ink-3">
            {tierLabel}
          </span>
        </div>

        {/* Club identity */}
        <div className="flex items-center gap-4 mb-6">
          <ClubLogo
            name={offer.clubName}
            url={clubLogoUrl(offer.clubId)}
            size={64}
            className="shrink-0"
            clubId={offer.clubId}
          />
          <div className="min-w-0">
            <h3 className="font-display font-bold text-2xl leading-tight tracking-tight text-bone">
              {offer.clubName}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-bone-3 text-[11px] font-mono">
              <Flag code={offer.clubCountry} width={16} height={11} className="rounded-sm" />
              {leagueLogoUrlByName(offer.clubLeague) && (
                <img
                  src={leagueLogoUrlByName(offer.clubLeague)!}
                  alt={offer.clubLeague}
                  width={16}
                  height={16}
                  className="object-contain shrink-0"
                />
              )}
              <span className="text-bone">{offer.clubLeague}</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <OfferField
            label="Salary / yr"
            value={fmtMoney(offer.salaryEur)}
            sub={salaryDelta !== 0 ? `${salaryDelta > 0 ? "+" : ""}${salaryDelta}%` : undefined}
            accent={isRenew ? "pitch" : "gold"}
          />
          <OfferField
            label={isRenew ? "Stay" : "Contract"}
            value={`${offer.contractYears}y`}
          />
          {!isRenew && offer.transferFeeEur ? (
            <OfferField label="Fee" value={fmtMoney(offer.transferFeeEur)} />
          ) : (
            <OfferField label="Loyalty" value="—" />
          )}
        </div>

        {/* CTA */}
        <div
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-display font-bold text-base tracking-tight transition-colors ${
            isRenew
              ? "bg-pitch/15 text-pitch group-hover:bg-pitch group-hover:text-ink"
              : "bg-gold/15 text-gold group-hover:bg-gold group-hover:text-ink"
          }`}
        >
          {isRenew ? "Re-sign →" : "Accept transfer →"}
        </div>
      </div>
    </button>
  );
}

function OfferField({
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
    <div className="rounded-xl border border-line bg-ink-3 px-3 py-2.5">
      <div className="text-[9px] uppercase tracking-widest text-bone-3 font-mono">{label}</div>
      <div
        className={`num text-base font-bold leading-tight mt-1 ${
          accent === "pitch" ? "text-pitch" : accent === "gold" ? "text-gold" : "text-bone"
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
