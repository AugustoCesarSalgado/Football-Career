import type React from "react";
import { LEAGUES, clubById, leagueByName } from "./leagues";
import { COMP_BY_ID } from "./competitions";
import { COUNTRY_FOLDER, NATIONAL_TEAM_URL, flagIso } from "./countries";

const SVG_CLUB_SLUGS = new Set([
  "juventus",
  // España — Segunda División
  "albacete", "almeria", "burgos", "cadiz", "castellon", "ceuta",
  "cultural-leonesa", "cordoba", "deportivo-la-coruna", "eibar",
  "fc-andorra", "granada", "huesca", "las-palmas", "leganes",
  "malaga", "mirandes", "racing", "sporting-gijon", "valladolid", "zaragoza",
]);


/** Club IDs whose crest has dark fills and needs brightness(0) invert(1) on dark backgrounds */
const CLUB_INVERT = new Set([
  "EN-tottenham",
  "EN-liverpool",
]);

export function clubLogoStyle(clubId: string): React.CSSProperties | undefined {
  return CLUB_INVERT.has(clubId) ? { filter: "brightness(0) invert(1)" } : undefined;
}

/** /public/clubs/{country}/{slug}.{png|svg} */
export function clubLogoUrl(clubId: string): string | null {
  const club = clubById(clubId);
  if (!club || !club.logoSlug) return null;
  const league = Object.values(LEAGUES).find((l) =>
    l.clubs.some((c) => c.id === clubId),
  );
  if (!league) return null;
  const folder = COUNTRY_FOLDER[league.countryCode];
  if (!folder) return null;
  const ext = SVG_CLUB_SLUGS.has(club.logoSlug) ? "svg" : "png";
  return `/clubs/${folder}/${club.logoSlug}.${ext}`;
}

const LEAGUE_LOGO_EXT: Record<string, string> = {
  AR: "png", BR: "svg", ES: "svg", EN: "svg", SC: "svg",
  IT: "svg", FR: "svg", DE: "svg", PT: "svg", NL: "svg",
  BE: "svg", TR: "svg", US: "svg", SA: "svg",
};

export function leagueLogoUrl(countryCode: string): string | null {
  const ext = LEAGUE_LOGO_EXT[countryCode];
  return ext ? `/leagues/${countryCode}.${ext}` : null;
}

/** Per-league-name overrides — used when multiple leagues share a countryCode */
const LEAGUE_LOGO_BY_NAME: Record<string, string> = {
  "LaLiga Hypermotion": "/leagues/ES2.svg",
};

export function leagueLogoUrlByName(name: string): string | null {
  if (LEAGUE_LOGO_BY_NAME[name]) return LEAGUE_LOGO_BY_NAME[name];
  const league = leagueByName(name);
  return league ? leagueLogoUrl(league.countryCode) : null;
}

const CUP_LOGO: Record<string, string> = {
  "FA Cup":             "/leagues/EN-cup.svg",
  "EFL Cup":            "/tournaments/en-efl-cup.svg",
  "Copa del Rey":       "/leagues/ES-cup.svg",
  "Copa do Brasil":     "/leagues/BR-cup.svg",
  "Coppa Italia":       "/leagues/IT-cup.svg",
  "DFB-Pokal":          "/leagues/DE-cup.svg",
  "Coupe de France":    "/leagues/FR-cup.svg",
  "Taça de Portugal":   "/leagues/PT-cup.svg",
  "KNVB Beker":         "/leagues/NL-cup.svg",
  "Croky Cup":          "/leagues/BE-cup.svg",
  "Copa Argentina":     "/leagues/AR-cup.png",
};

/** Cup logos that are dark PNGs and need brightness(0) invert(1) on dark backgrounds */
const CUP_INVERT = new Set(["Copa Argentina", "FA Cup", "Copa do Brasil"]);

/** League logos that should be shown as-is with no glow filter */
export const LEAGUE_NO_GLOW = new Set(["MLS"]);

export function cupLogoUrlByName(name: string): string | null {
  return CUP_LOGO[name] ?? null;
}

export function cupLogoStyle(name: string): React.CSSProperties | undefined {
  return CUP_INVERT.has(name) ? { filter: "brightness(0) invert(1)" } : undefined;
}

const COMP_LOGO_EXT: Record<string, string> = {
  "conmebol-recopa": "png",
  "it-supercopa":    "png",
  "finalissima":     "png",
};

const COMP_INVERT = new Set(["conmebol-recopa", "finalissima"]);

export function competitionLogoStyle(compId: string): React.CSSProperties | undefined {
  return COMP_INVERT.has(compId) ? { filter: "brightness(0) invert(1)" } : undefined;
}

/** /public/tournaments/{slug}.{svg|png} */
export function competitionLogoUrl(compId: string): string | null {
  const comp = COMP_BY_ID[compId];
  if (!comp?.logoSlug) return null;
  const ext = COMP_LOGO_EXT[compId] ?? "svg";
  return `/tournaments/${comp.logoSlug}.${ext}`;
}

const TOURNAMENT_LOGO_EXT: Record<string, string> = {
  "copa-america": "png",
};

export function nationalTournamentLogoUrl(slug: string): string {
  const ext = TOURNAMENT_LOGO_EXT[slug] ?? "svg";
  return `/tournaments/${slug}.${ext}`;
}

/** Tournament slugs whose embedded PNG has a black background — use mix-blend-mode:screen */
const TOURNAMENT_SCREEN_BLEND = new Set<string>([]);

export function tournamentLogoStyle(slug: string): React.CSSProperties | undefined {
  return TOURNAMENT_SCREEN_BLEND.has(slug) ? { mixBlendMode: "screen" } : undefined;
}

/** /public/national-teams/{slug}.{png|svg} — falls back to null if unavailable */
export function nationalTeamLogoUrl(countryCode: string): string | null {
  return NATIONAL_TEAM_URL[countryCode] ?? null;
}

export function flagUrl(code: string): string {
  return `https://flagcdn.com/w160/${flagIso(code)}.png`;
}

export function tournamentSvgPath(slug: string | null | undefined): string | null {
  return slug ? `/tournaments/${slug}.svg` : null;
}

// Deterministic color from string
export function clubColors(name: string): { primary: string; secondary: string } {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  const sat = 55 + ((h >> 8) % 30);
  return {
    primary: `hsl(${hue} ${sat}% 38%)`,
    secondary: `hsl(${(hue + 35) % 360} ${sat}% 70%)`,
  };
}

export function clubInitials(name: string): string {
  const words = name.replace(/[^A-Za-zÀ-ÿ\s']/g, "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
