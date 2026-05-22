"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Position } from "@/types";
import { CountrySelector } from "@/components/CountrySelector";
import { PositionSelector } from "@/components/PositionSelector";
import { SiteHeader } from "@/components/SiteHeader";
import { ClubLogo, Flag } from "@/components/Logo";
import { ResumeBanner } from "@/components/ResumeBanner";
import { Hero } from "@/components/Hero";
import { randomName } from "@/lib/names";
import { LEAGUES, allClubs, clubById } from "@/lib/leagues";
import { ALL_COMPETITIONS, NATIONAL_TOURNAMENTS } from "@/lib/competitions";
import { squadNumber, POSITION_LABEL } from "@/lib/squadNumbers";
import { clubLogoUrl, leagueLogoUrl, leagueLogoUrlByName } from "@/lib/logos";
import { pick } from "@/lib/random";
import { useCareer } from "@/lib/store";
import { COUNTRY_BY_CODE } from "@/lib/countries";

export default function LandingPage() {
  const router = useRouter();
  const startCareer = useCareer((s) => s.startCareer);
  const existingCareer = useCareer((s) => s.career);
  const reset = useCareer((s) => s.reset);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [countryCode, setCountry] = useState<string | null>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [name, setName] = useState<{ first: string; last: string } | null>(null);
  const [clubId, setClubId] = useState<string | null>(null);
  const [number, setNumber] = useState<number | null>(null);
  const [showClubModal, setShowClubModal] = useState(false);

  useEffect(() => {
    if (!countryCode) return;
    setName(randomName(countryCode));
    const league = LEAGUES[countryCode];
    if (league) setClubId(pick(league.clubs).id);
  }, [countryCode]);

  useEffect(() => {
    if (position) setNumber(squadNumber(position));
  }, [position]);

  const ready = countryCode && position && name && clubId && number;
  const club = useMemo(() => {
    if (!clubId) return null;
    return clubById(clubId) ?? null;
  }, [clubId]);

  const clubLeague = useMemo(() => {
    if (!clubId) return null;
    return Object.values(LEAGUES).find((l) => l.clubs.some((c) => c.id === clubId)) ?? null;
  }, [clubId]);

  const country = countryCode ? COUNTRY_BY_CODE[countryCode] : null;

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <SiteHeader
        rightSlot={
          <>
            <span className="hidden sm:inline">New career</span>
            <span className="size-1.5 rounded-full bg-pitch anim-pulse-ring" />
            <span>{new Date().getFullYear()}</span>
          </>
        }
      />

      {hydrated && existingCareer && (
        <ResumeBanner
          career={existingCareer}
          onResume={() => {
            if (existingCareer.finished) router.push("/career/retire");
            else if (existingCareer.pendingOffers) router.push("/career/season");
            else router.push("/career");
          }}
          onDiscard={() => {
            if (
              confirm(
                `Discard the career of ${existingCareer.player.firstName} ${existingCareer.player.lastName}? This cannot be undone.`,
              )
            ) {
              reset();
            }
          }}
        />
      )}

      <main className="flex-1">
        {/* Hero section */}
        <Hero
          totalClubs={allClubs().length}
          totalCompetitions={ALL_COMPETITIONS.length + NATIONAL_TOURNAMENTS.length}
        />

        {/* Setup section — REVERSED: preview left, form right */}
        <div id="start" className="scroll-mt-16 bg-pitch-grid">
          <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* LEFT — Live identity preview (was on right) */}
            <aside className="lg:col-span-4 order-2 lg:order-1">
              <div className="sticky top-20">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-bone-3 font-mono mb-3 px-1">
                  <span>Live preview</span>
                  <span>identity card</span>
                </div>

                <div
                  className="relative rounded-2xl border border-line/60 overflow-hidden p-7 card-diagonal"
                  style={{
                    background:
                      "linear-gradient(155deg, var(--color-ink-3), var(--color-ink-2) 50%, var(--color-ink-4))",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pitch/50 to-transparent" />

                  {/* Big squad number */}
                  <div className="flex items-end justify-between mb-1">
                    <span
                      className="font-display font-bold text-[96px] leading-none text-pitch/20"
                      aria-hidden
                    >
                      {number ?? "—"}
                    </span>
                    {country && (
                      <div className="text-right pb-2">
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <Flag code={country.code} width={24} height={17} className="rounded-sm" />
                          <span className="text-bone-2 text-xs font-semibold">{country.name}</span>
                        </div>
                        <div className="text-[10px] text-bone-3 font-mono uppercase tracking-widest">
                          {country.confederation}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-line/60 mb-4" />

                  {/* Name */}
                  <div className="mb-4">
                    <div className="text-[10px] text-bone-3 font-mono uppercase tracking-widest mb-1">Identity</div>
                    <div className="font-display font-bold text-3xl text-bone tracking-tight leading-tight">
                      {name ? (
                        <>
                          {name.first}
                          <br />
                          <span className="text-bone-2">{name.last}</span>
                        </>
                      ) : (
                        <span className="text-bone-3">unknown</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-bone-2 mt-1">
                      {position ? POSITION_LABEL[position] : "no role"}
                      <span className="opacity-40">·</span>
                      {(clubLeague ? leagueLogoUrlByName(clubLeague.name) : leagueLogoUrl(countryCode ?? "")) && (
                        <img
                          src={(clubLeague ? leagueLogoUrlByName(clubLeague.name) : leagueLogoUrl(countryCode ?? ""))!}
                          alt={clubLeague?.name ?? country?.league ?? ""}
                          width={18}
                          height={18}
                          className="object-contain shrink-0"
                        />
                      )}
                      {clubLeague?.name ?? country?.league ?? "—"}
                    </div>
                  </div>

                  {/* Club */}
                  {club ? (
                    <div className="flex items-center gap-3 rounded-xl border border-line/60 bg-ink-3 p-3">
                      <ClubLogo name={club.name} url={clubLogoUrl(club.id)} size={44} clubId={club.id} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-bone-3 font-mono uppercase tracking-widest">
                          Starting club
                        </div>
                        <div className="font-display font-bold text-xl text-bone leading-tight tracking-tight truncate">
                          {club.name}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowClubModal(true)}
                        className="shrink-0 px-2.5 py-1.5 rounded-lg border border-pitch/40 bg-pitch/10 text-pitch text-[10px] font-mono uppercase tracking-widest hover:bg-pitch/20 transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-line/60 bg-ink-3 p-4 text-center text-bone-3 text-sm font-mono">
                      Select a country to preview your club
                    </div>
                  )}

                  {/* Career stats */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <MiniStat label="Start" value="18 y" />
                    <MiniStat label="Seasons" value="22" />
                    <MiniStat label="Retire" value="40 y" />
                  </div>
                </div>

                <p className="mt-3 text-bone-3 text-[10px] font-mono px-1">
                  * Names invented per federation — coincidence only.
                </p>
              </div>
            </aside>

            {/* RIGHT — Form (was on left) */}
            <section className="lg:col-span-8 order-1 lg:order-2 space-y-10">
              <div className="anim-rise">
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-pitch font-mono mb-4">
                  <span className="w-8 h-px bg-pitch" />
                  3 steps to kick off
                </div>
                <h2 className="font-display font-bold text-[clamp(36px,5vw,64px)] leading-[0.9] tracking-tight text-bone">
                  Build your{" "}
                  <span className="text-pitch">footballer.</span>
                </h2>
                <p className="mt-3 text-bone-2 text-base max-w-lg leading-relaxed">
                  Pick a country, choose a role, take a name. The simulator handles the other 22 years.
                </p>
              </div>

              <div className="space-y-8 anim-rise delay-200">
                {/* Step 01 */}
                <FormStep index="01" title="Where were you born?" hint="Picks your federation and starter league.">
                  <CountrySelector value={countryCode} onChange={setCountry} />
                </FormStep>

                {/* Step 02 */}
                <FormStep index="02" title="Pick your role." hint="Position shapes your stats every season.">
                  <PositionSelector value={position} onChange={setPosition} />
                </FormStep>

                {/* Step 03 */}
                <FormStep index="03" title="Your name." hint="Auto-generated from your country. Roll again if you want.">
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[260px] rounded-xl border border-line bg-ink-2 px-5 py-4">
                      <div className="text-[10px] text-bone-3 font-mono uppercase tracking-widest mb-1">Footballer</div>
                      <div className="font-display font-bold text-3xl text-bone tracking-tight leading-tight">
                        {name ? (
                          <>
                            {name.first} <span className="text-bone-2">{name.last}</span>
                          </>
                        ) : (
                          <span className="text-bone-3">— choose a country</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={!countryCode}
                      onClick={() => countryCode && setName(randomName(countryCode))}
                      className="px-4 py-3.5 rounded-xl border border-line bg-ink-2 hover:bg-ink-3 hover:border-bone-3/40 text-bone-2 text-xs uppercase tracking-widest font-mono disabled:opacity-40 transition-colors"
                    >
                      🎲 Otro nombre
                    </button>
                  </div>
                </FormStep>
              </div>

              {/* CTA */}
              <div className="pt-2 anim-rise delay-400">
                <button
                  disabled={!ready}
                  onClick={() => {
                    if (!ready) return;
                    if (existingCareer && !existingCareer.finished) {
                      const ok = confirm(
                        `This will discard the career of ${existingCareer.player.firstName} ${existingCareer.player.lastName} (age ${existingCareer.currentAge}). Start fresh?`,
                      );
                      if (!ok) return;
                    }
                    startCareer({
                      firstName: name!.first,
                      lastName: name!.last,
                      position: position!,
                      countryCode: countryCode!,
                      number: number!,
                      clubId: clubId!,
                    });
                    router.push("/career");
                  }}
                  className="group relative overflow-hidden bg-pitch text-ink px-10 py-5 rounded-2xl font-display font-bold text-2xl tracking-tight disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pitch-2 transition-all duration-200 hover:scale-[1.01]"
                >
                  {existingCareer && !existingCareer.finished
                    ? "Start over →"
                    : "Start career →"}
                </button>
                <div className="mt-2 text-[11px] text-bone-3 font-mono uppercase tracking-widest">
                  Saved locally to this browser
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />

      {showClubModal && countryCode && (
        <ClubModal
          countryCode={countryCode}
          selectedId={clubId}
          onSelect={(id) => { setClubId(id); setShowClubModal(false); }}
          onClose={() => setShowClubModal(false)}
        />
      )}
    </div>
  );
}

const TIER_LABEL: Record<number, string> = { 1: "Elite", 2: "Top", 3: "Mid", 4: "Lower" };

const CM_STYLES = `
@keyframes cm-backdrop-in  { from { opacity: 0; } to { opacity: 1; } }
@keyframes cm-backdrop-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes cm-panel-in  { from { opacity: 0; transform: translateY(28px) scale(0.96); } to   { opacity: 1; transform: translateY(0)    scale(1);    } }
@keyframes cm-panel-out { from { opacity: 1; transform: translateY(0)    scale(1);    } to   { opacity: 0; transform: translateY(28px) scale(0.96); } }
`;
const CM_DUR = 260;

function ClubModal({
  countryCode,
  selectedId,
  onSelect,
  onClose,
}: {
  countryCode: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);

  function dismiss() {
    setClosing(true);
    setTimeout(onClose, CM_DUR);
  }

  function pick(id: string) {
    setClosing(true);
    setTimeout(() => onSelect(id), CM_DUR);
  }

  const ease = "cubic-bezier(0.22,1,0.36,1)";
  const dur = `${CM_DUR}ms`;

  // All leagues for this country, primary first
  const countryLeagues = Object.values(LEAGUES)
    .filter((l) => l.countryCode === countryCode)
    .sort((a, b) => {
      // Primary league (id === countryCode) first
      if (a.id === countryCode) return -1;
      if (b.id === countryCode) return 1;
      return 0;
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{
        backdropFilter: "blur(6px)",
        animation: `${closing ? "cm-backdrop-out" : "cm-backdrop-in"} ${dur} ease both`,
        background: "rgba(7,9,15,0.85)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <style>{CM_STYLES}</style>

      <div
        className="w-full max-w-lg rounded-2xl border border-line bg-ink-2 overflow-hidden"
        style={{
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          animation: `${closing ? "cm-panel-out" : "cm-panel-in"} ${dur} ${ease} both`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line/60">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-bone-3 mb-0.5">Identity card</div>
            <h3 className="font-display font-bold text-lg text-bone tracking-tight">Choose your starting club</h3>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="size-8 flex items-center justify-center rounded-lg border border-line text-bone-3 hover:text-bone hover:border-bone-3/40 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto p-5 space-y-6">
          {countryLeagues.map((league) => {
            const byTier = league.clubs.reduce<Record<number, typeof league.clubs>>((acc, c) => {
              (acc[c.tier] ??= []).push(c);
              return acc;
            }, {});
            const tiers = Object.keys(byTier).map(Number).sort();

            return (
              <div key={league.id}>
                {/* League header */}
                {countryLeagues.length > 1 && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-pitch font-bold">
                      {league.name}
                    </span>
                    <span className="flex-1 h-px bg-pitch/25" />
                  </div>
                )}

                <div className="space-y-4">
                  {tiers.map((tier) => (
                    <div key={tier}>
                      <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-bone-3 mb-2 flex items-center gap-2">
                        <span className="flex-1 h-px bg-line/60" />
                        {TIER_LABEL[tier] ?? `Tier ${tier}`}
                        <span className="flex-1 h-px bg-line/60" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {byTier[tier].map((c) => {
                          const active = c.id === selectedId;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              title={c.shortName}
                              onClick={() => pick(c.id)}
                              className={`size-14 flex items-center justify-center rounded-xl border transition-all ${
                                active
                                  ? "border-pitch bg-pitch/10 shadow-[0_0_12px_rgba(45,212,191,0.35)]"
                                  : "border-line bg-ink-3 hover:border-bone-3/40 hover:bg-ink-4"
                              }`}
                            >
                              <ClubLogo name={c.name} url={clubLogoUrl(c.id)} size={36} clubId={c.id} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FormStep({
  index,
  title,
  hint,
  children,
}: {
  index: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-ink-3 border border-line text-[11px] font-mono text-bone-3 font-bold shrink-0">
          {index}
        </span>
        <h3 className="font-display font-bold text-2xl text-bone tracking-tight">{title}</h3>
        <div className="flex-1 h-px bg-line/60" />
      </div>
      <p className="text-bone-3 text-xs font-mono uppercase tracking-widest mb-3 pl-10">{hint}</p>
      <div className="pl-0">{children}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line/60 bg-ink-4 px-2 py-2 text-center">
      <div className="text-[9px] text-bone-3 font-mono uppercase tracking-widest">{label}</div>
      <div className="font-display font-bold text-lg text-bone leading-none mt-0.5">{value}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line/60 py-6 bg-ink">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-bone-3 uppercase tracking-widest">
        <span>Career Sim · single-player football life-sim</span>
        <span>
          logos ·{" "}
          <a
            className="underline hover:text-pitch transition-colors"
            href="https://github.com/Leo4815162342/football-logos"
            target="_blank"
            rel="noreferrer"
          >
            football-logos
          </a>
        </span>
      </div>
    </footer>
  );
}
