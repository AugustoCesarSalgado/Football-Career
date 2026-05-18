import type { Country } from "@/types";

export const COUNTRIES: Country[] = [
  { code: "AR", name: "Argentina", flagEmoji: "🇦🇷", confederation: "CONMEBOL", league: "Liga Profesional" },
  { code: "BR", name: "Brasil", flagEmoji: "🇧🇷", confederation: "CONMEBOL", league: "Brasileirão Série A" },
  { code: "ES", name: "España", flagEmoji: "🇪🇸", confederation: "UEFA", league: "LaLiga" },
  { code: "EN", name: "Inglaterra", flagEmoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA", league: "Premier League" },
  { code: "SC", name: "Escocia", flagEmoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", confederation: "UEFA", league: "Scottish Premiership" },
  { code: "IT", name: "Italia", flagEmoji: "🇮🇹", confederation: "UEFA", league: "Serie A" },
  { code: "FR", name: "Francia", flagEmoji: "🇫🇷", confederation: "UEFA", league: "Ligue 1" },
  { code: "DE", name: "Alemania", flagEmoji: "🇩🇪", confederation: "UEFA", league: "Bundesliga" },
  { code: "PT", name: "Portugal", flagEmoji: "🇵🇹", confederation: "UEFA", league: "Primeira Liga" },
  { code: "NL", name: "Países Bajos", flagEmoji: "🇳🇱", confederation: "UEFA", league: "Eredivisie" },
  { code: "BE", name: "Bélgica", flagEmoji: "🇧🇪", confederation: "UEFA", league: "Pro League" },
  { code: "TR", name: "Turquía", flagEmoji: "🇹🇷", confederation: "UEFA", league: "Süper Lig" },
  { code: "US", name: "Estados Unidos", flagEmoji: "🇺🇸", confederation: "CONCACAF", league: "MLS" },
  { code: "SA", name: "Arabia Saudita", flagEmoji: "🇸🇦", confederation: "AFC", league: "Saudi Pro League" },
];

export const COUNTRY_BY_CODE: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c]),
);

/** Maps country code → public/clubs/{folder} */
export const COUNTRY_FOLDER: Record<string, string> = {
  AR: "argentina",
  BE: "belgium",
  BR: "brazil",
  EN: "england",
  ES: "spain",
  FR: "france",
  DE: "germany",
  IT: "italy",
  NL: "netherlands",
  PT: "portugal",
  SA: "saudi-arabia",
  SC: "scotland",
  TR: "turkey",
  US: "usa",
};

/** Maps country code → flagcdn ISO. Honors regions inside GB. */
export function flagIso(code: string): string {
  if (code === "EN") return "gb-eng";
  if (code === "SC") return "gb-sct";
  return code.toLowerCase();
}

/** Maps country code → public national-team logo path (null when not in pack) */
export const NATIONAL_TEAM_URL: Record<string, string | null> = {
  AR: "/national-teams/argentina-national-team.png",
  BE: "/national-teams/belgium-national-team.png",
  BR: "/national-teams/brazil-national-team.png",
  EN: "/national-teams/england-national-team.png",
  ES: "/national-teams/spain-national-team.png",
  FR: "/national-teams/france-national-team.png",
  DE: "/national-teams/germany-national-team.png",
  IT: "/national-teams/italy-national-team.svg",
  NL: "/national-teams/dutch-national-team.png",
  PT: "/national-teams/portuguese-football-federation.png",
  SA: "/national-teams/saudi-arabia-national-team.png",
  SC: "/national-teams/scotland-national-team.png",
  TR: "/national-teams/turkey-national-team.png",
  US: "/national-teams/usa-national-team.png",
};
