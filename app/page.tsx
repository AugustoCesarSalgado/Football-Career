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
import { LEAGUES, allClubs } from "@/lib/leagues";
import { ALL_COMPETITIONS, NATIONAL_TOURNAMENTS } from "@/lib/competitions";
import { squadNumber, POSITION_LABEL } from "@/lib/squadNumbers";
import { clubLogoUrl } from "@/lib/logos";
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
    if (!clubId || !countryCode) return null;
    return LEAGUES[countryCode]?.clubs.find((c) => c.id === clubId) ?? null;
  }, [clubId, countryCode]);

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
                    <div className="text-sm text-bone-2 mt-1">
                      {position ? POSITION_LABEL[position] : "no role"} ·{" "}
                      {country?.league ?? "—"}
                    </div>
                  </div>

                  {/* Club */}
                  {club ? (
                    <div className="flex items-center gap-3 rounded-xl border border-line/60 bg-ink-3 p-3">
                      <ClubLogo name={club.name} url={clubLogoUrl(club.id)} size={44} />
                      <div>
                        <div className="text-[10px] text-bone-3 font-mono uppercase tracking-widest">
                          Starting club
                        </div>
                        <div className="font-display font-bold text-xl text-bone leading-tight tracking-tight">
                          {club.name}
                        </div>
                      </div>
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
