import type { Confederation, ContinentalCompetition } from "@/types";

// Continental club competitions
export const COMPETITIONS: ContinentalCompetition[] = [
  // UEFA
  { id: "uefa-cl", name: "UEFA Champions League", confederation: "UEFA", prestige: 5, logoSlug: "champions-league" },
  { id: "uefa-el", name: "UEFA Europa League", confederation: "UEFA", prestige: 4, logoSlug: "europa-league" },
  { id: "uefa-cnl", name: "UEFA Conference League", confederation: "UEFA", prestige: 3, logoSlug: "conference-league" },
  // CONMEBOL
  { id: "conmebol-lib", name: "Copa Libertadores", confederation: "CONMEBOL", prestige: 5, logoSlug: "conmebol-libertadores" },
  { id: "conmebol-sud", name: "Copa Sudamericana", confederation: "CONMEBOL", prestige: 4, logoSlug: "sudamericana" },
  // CONCACAF
  { id: "concacaf-cc", name: "CONCACAF Champions Cup", confederation: "CONCACAF", prestige: 4, logoSlug: "concacaf-champions-cup" },
  // AFC
  { id: "afc-cl", name: "AFC Champions League", confederation: "AFC", prestige: 4, logoSlug: "afc-champions-league" },
];

/** Bonus club trophies awarded as a follow-up to a continental crown */
export const BONUS_COMPETITIONS: ContinentalCompetition[] = [
  { id: "uefa-supercup", name: "UEFA Super Cup", confederation: "UEFA", prestige: 3, logoSlug: "uefa-super-cup" },
  { id: "conmebol-recopa", name: "Recopa Sudamericana", confederation: "CONMEBOL", prestige: 3, logoSlug: "conmebol-recopa" },
  { id: "fifa-cwc", name: "FIFA Club World Cup", confederation: "UEFA", prestige: 5, logoSlug: "fifa-club-world-cup" },
  { id: "intercontinental", name: "Intercontinental Cup", confederation: "UEFA", prestige: 4, logoSlug: "intercontinental-cup" },
  { id: "en-community-shield", name: "FA Community Shield", confederation: "UEFA", prestige: 2, logoSlug: "en-community-shield" },
  { id: "es-supercopa", name: "Supercopa de España", confederation: "UEFA", prestige: 3, logoSlug: "es-supercopa" },
  { id: "it-supercopa", name: "Supercoppa Italiana", confederation: "UEFA", prestige: 2, logoSlug: "it-supercopa" },
  { id: "finalissima", name: "Finalissima", confederation: "UEFA", prestige: 4, logoSlug: "finalissima" },
];

export const ALL_COMPETITIONS = [...COMPETITIONS, ...BONUS_COMPETITIONS];

export const COMP_BY_ID: Record<string, ContinentalCompetition> = Object.fromEntries(
  ALL_COMPETITIONS.map((c) => [c.id, c]),
);

export function continentalForConfederation(c: Confederation): ContinentalCompetition[] {
  return COMPETITIONS.filter((x) => x.confederation === c);
}

/** Public SVG path for a competition */
export function competitionSvgPath(slug: string | null | undefined): string | null {
  return slug ? `/tournaments/${slug}.svg` : null;
}

export interface NationalCup {
  name: string;
  countryCode: string;
}

/** Secondary domestic cup per country (in addition to the main cup) */
export const SECONDARY_NATIONAL_CUPS: Record<string, NationalCup> = {
  EN: { name: "EFL Cup", countryCode: "EN" },
};

export const NATIONAL_CUPS: Record<string, NationalCup> = {
  AR: { name: "Copa Argentina", countryCode: "AR" },
  BR: { name: "Copa do Brasil", countryCode: "BR" },
  ES: { name: "Copa del Rey", countryCode: "ES" },
  EN: { name: "FA Cup", countryCode: "EN" },
  SC: { name: "Scottish Cup", countryCode: "SC" },
  IT: { name: "Coppa Italia", countryCode: "IT" },
  FR: { name: "Coupe de France", countryCode: "FR" },
  DE: { name: "DFB-Pokal", countryCode: "DE" },
  PT: { name: "Taça de Portugal", countryCode: "PT" },
  NL: { name: "KNVB Beker", countryCode: "NL" },
  BE: { name: "Croky Cup", countryCode: "BE" },
  TR: { name: "Türkiye Kupası", countryCode: "TR" },
  US: { name: "US Open Cup", countryCode: "US" },
  SA: { name: "King Cup", countryCode: "SA" },
};

export interface NationalTournament {
  name: string;
  confederation: Confederation;
  years: number[];
  logoSlug?: string;
}

// Tournaments active in 2026-2048
export const NATIONAL_TOURNAMENTS: NationalTournament[] = [
  { name: "FIFA World Cup", confederation: "UEFA", years: [2026, 2030, 2034, 2038, 2042, 2046], logoSlug: "world-cup" },
  { name: "UEFA Euro", confederation: "UEFA", years: [2028, 2032, 2036, 2040, 2044, 2048], logoSlug: "uefa-euro" },
  { name: "Copa América", confederation: "CONMEBOL", years: [2028, 2032, 2036, 2040, 2044, 2048], logoSlug: "copa-america" },
  { name: "UEFA Nations League Finals", confederation: "UEFA", years: [2027, 2029, 2031, 2033, 2035, 2037, 2039, 2041, 2043, 2045, 2047], logoSlug: "uefa-nations-league" },
  { name: "CONCACAF Gold Cup", confederation: "CONCACAF", years: [2027, 2029, 2031, 2033, 2035, 2037, 2039, 2041, 2043, 2045, 2047] },
  { name: "AFC Asian Cup", confederation: "AFC", years: [2027, 2031, 2035, 2039, 2043, 2047], logoSlug: "afc-asian-cup" },
];

export const NATIONAL_TOURNAMENT_LOGO: Record<string, string> = Object.fromEntries(
  NATIONAL_TOURNAMENTS.filter((t) => t.logoSlug).map((t) => [t.name, t.logoSlug!]),
);

export function tournamentForYear(
  year: number,
  confederation: Confederation,
): NationalTournament | undefined {
  const wc = NATIONAL_TOURNAMENTS.find(
    (t) => t.name === "FIFA World Cup" && t.years.includes(year),
  );
  if (wc) return { ...wc, confederation };
  return NATIONAL_TOURNAMENTS.find(
    (t) => t.confederation === confederation && t.years.includes(year),
  );
}
