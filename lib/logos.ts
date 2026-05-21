import type React from "react";
import { LEAGUES, clubById } from "./leagues";
import { COMP_BY_ID } from "./competitions";
import { COUNTRY_FOLDER, NATIONAL_TEAM_URL, flagIso } from "./countries";

const SVG_CLUB_SLUGS = new Set(["juventus"]);

/** Club IDs whose PNG logo needs a white filter (dark logo on transparent bg) */
const WHITE_FILTER_CLUBS = new Set(["EN-tottenham"]);

export function clubLogoStyle(clubId: string): React.CSSProperties | undefined {
  return WHITE_FILTER_CLUBS.has(clubId)
    ? { filter: "brightness(0) invert(1)" }
    : undefined;
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

/** League logos are not part of the local pack — return null. */
export function leagueLogoUrl(_countryCode: string): string | null {
  return null;
}

/** /public/tournaments/{slug}.svg */
export function competitionLogoUrl(compId: string): string | null {
  const comp = COMP_BY_ID[compId];
  if (!comp?.logoSlug) return null;
  return `/tournaments/${comp.logoSlug}.svg`;
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
