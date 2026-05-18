"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Position } from "@/types";
import { CountrySelector } from "@/components/CountrySelector";
import { PositionSelector } from "@/components/PositionSelector";
import { SiteHeader } from "@/components/SiteHeader";
import { Marquee } from "@/components/Marquee";
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
            <span className="hidden md:inline">New career</span>
            <span className="inline-block size-1 bg-pitch animate-pulse rounded-full" />
            <span>{new Date().getFullYear()} season</span>
          </>
        }
      />

      <Marquee
        items={[
          "Select a federation",
          "Forge a name",
          "Lift the Champions",
          "Win the Ballon d'Or",
          "Retire at 40",
          "Hall of fame seats await",
        ]}
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
        <Hero
          totalClubs={allClubs().length}
          totalCompetitions={ALL_COMPETITIONS.length + NATIONAL_TOURNAMENTS.length}
        />

        <div id="start" className="bg-pitch-grid scroll-mt-4">
        <div className="max-w-[1500px] mx-auto px-8 py-16 grid grid-cols-12 gap-8">
          {/* Form column */}
          <section className="col-span-12 lg:col-span-7 space-y-10">
            <div className="anim-rise">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-pitch font-mono">
                <span className="inline-block w-10 h-px bg-pitch" />
                Set up · 3 steps
              </div>
              <h2 className="mt-3 font-display text-[clamp(40px,5vw,72px)] leading-[0.9] tracking-tight text-bone uppercase">
                Build your<br />
                <span className="text-pitch">footballer.</span>
              </h2>
              <p className="mt-4 max-w-xl text-bone-2 text-base leading-relaxed">
                Pick a country, choose a role, take a name. The simulator does
                the other 22 years.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-8 anim-rise delay-200">
              <Step
                index="01"
                title="Where were you born?"
                hint="Picks your federation and starter league."
              >
                <CountrySelector value={countryCode} onChange={setCountry} />
              </Step>

              <Step
                index="02"
                title="Pick your role."
                hint="Your position shapes your stats every season."
              >
                <PositionSelector value={position} onChange={setPosition} />
              </Step>

              <Step
                index="03"
                title="Your name."
                hint="Auto-generated from your country. Roll again if you want."
              >
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex-1 min-w-[280px] border border-line bg-ink-2 px-5 py-4">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                      Footballer
                    </div>
                    <div className="font-display text-4xl text-bone tracking-wide leading-tight">
                      {name ? (
                        <>
                          {name.first}{" "}
                          <span className="text-bone-2">{name.last}</span>
                        </>
                      ) : (
                        <span className="text-bone-3">— choose a country</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!countryCode}
                    onClick={() =>
                      countryCode && setName(randomName(countryCode))
                    }
                    className="px-4 py-3 border border-line bg-ink-2 hover:bg-ink-3 hover:border-bone-3 text-bone-2 text-xs uppercase tracking-[0.25em] font-mono disabled:opacity-40 transition-colors"
                  >
                    🎲 Otro nombre
                  </button>
                </div>
              </Step>
            </div>

            <div className="pt-4 anim-rise delay-400">
              <button
                disabled={!ready}
                onClick={() => {
                  if (!ready) return;
                  if (existingCareer && !existingCareer.finished) {
                    const ok = confirm(
                      `This will discard the career of ${existingCareer.player.firstName} ${existingCareer.player.lastName} (age ${existingCareer.currentAge}). Start a fresh one?`,
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
                className="group relative overflow-hidden bg-pitch text-ink px-10 py-5 font-display text-3xl tracking-wider uppercase disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pitch-2 transition-colors"
              >
                <span className="relative z-10">
                  {existingCareer && !existingCareer.finished
                    ? "Start over →"
                    : "Start career →"}
                </span>
                <span className="absolute inset-0 anim-pulse-ring rounded-none pointer-events-none" />
              </button>
              <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                Saved locally to this browser
              </div>
            </div>
          </section>

          {/* Preview column */}
          <aside className="col-span-12 lg:col-span-5">
            <div className="sticky top-6 space-y-4 anim-rise delay-300">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-bone-3 font-mono">
                <span>Live identity</span>
                <span>preview</span>
              </div>
              <div className="relative border border-line bg-ink-2 p-8 bg-noise overflow-hidden">
                <div
                  aria-hidden
                  className="absolute -top-24 -right-16 size-72 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(245,197,66,0.18), transparent 60%)",
                  }}
                />
                {/* Number plate */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-[140px] leading-none text-pitch">
                      {number ?? "—"}
                    </span>
                  </div>
                  <div className="text-right">
                    {country ? (
                      <>
                        <div className="flex items-center gap-2 justify-end mb-2">
                          <Flag code={country.code} width={28} height={20} />
                          <span className="text-bone-2 text-xs uppercase tracking-[0.25em] font-mono">
                            {country.name}
                          </span>
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                          {country.confederation}
                        </div>
                      </>
                    ) : (
                      <div className="text-bone-3 text-xs font-mono uppercase tracking-widest">
                        federation
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 h-px bg-line" />

                <div className="mt-4">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                    Identity
                  </div>
                  <div className="font-display text-5xl text-bone leading-tight tracking-wide mt-1">
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
                  <div className="mt-2 text-bone-2 text-sm">
                    {position ? POSITION_LABEL[position] : "no role"} ·{" "}
                    {country?.league ?? "—"}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-4 border border-line bg-ink-3 p-3">
                  {club ? (
                    <>
                      <ClubLogo
                        name={club.name}
                        url={clubLogoUrl(club.id)}
                        size={56}
                      />
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
                          Cantera
                        </div>
                        <div className="font-display text-2xl text-bone leading-none">
                          {club.name}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-bone-3 text-sm font-mono uppercase tracking-widest">
                      Starter club
                    </div>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                  <Mini label="Start" value="18 y" />
                  <Mini label="Seasons" value="22" />
                  <Mini label="Retire" value="40 y" />
                </div>
              </div>

              <div className="text-bone-3 text-[10px] uppercase tracking-[0.35em] font-mono px-1">
                * Names are invented per federation — any resemblance is coincidence.
              </div>
            </div>
          </aside>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Step({
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
      <div className="flex items-baseline gap-4 mb-3">
        <span className="font-mono text-[10px] tracking-[0.3em] text-bone-3 uppercase">
          {index}
        </span>
        <h2 className="font-display text-3xl text-bone tracking-wide uppercase">
          {title}
        </h2>
        <div className="flex-1 h-px bg-line translate-y-2" />
      </div>
      <p className="text-bone-3 text-xs uppercase tracking-[0.2em] font-mono mb-3">
        {hint}
      </p>
      {children}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-ink-2 px-2 py-2">
      <div className="text-[9px] uppercase tracking-[0.3em] text-bone-3 font-mono">
        {label}
      </div>
      <div className="font-display text-2xl text-bone leading-none mt-1">
        {value}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line py-6 bg-ink">
      <div className="max-w-[1500px] mx-auto px-8 flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
        <span>Career Sim · single-player football life-sim</span>
        <span>
          logos · <a className="underline hover:text-pitch" href="https://github.com/Leo4815162342/football-logos" target="_blank" rel="noreferrer">football-logos</a>
        </span>
      </div>
    </footer>
  );
}
