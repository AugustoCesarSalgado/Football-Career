import type {
  ClubResult,
  IndividualAward,
  NationalTeamResult,
  Player,
  Season,
  SeasonStats,
  StandingRow,
} from "@/types";
import { LEAGUES, clubById, leagueByName } from "./leagues";
import { COUNTRY_BY_CODE } from "./countries";
import {
  tournamentForYear,
  continentalForConfederation,
} from "./competitions";
import { chance, clamp, rndInt, rndRange } from "./random";

/**
 * Age curve multiplier — 1.0 at peak (24-30), declines after.
 */
function ageMultiplier(age: number): number {
  if (age <= 19) return 0.78;
  if (age <= 21) return 0.88;
  if (age <= 23) return 0.95;
  if (age <= 30) return 1.0;
  if (age <= 33) return 0.96;
  if (age <= 36) return 0.88;
  return 0.78;
}

function tierForm(tier: number): number {
  // higher tier club → better stats overall
  return { 1: 1.15, 2: 1.05, 3: 0.95, 4: 0.85 }[tier as 1 | 2 | 3 | 4] ?? 1;
}

export function simulateStats(player: Player, age: number): SeasonStats {
  const club = clubById(player.currentClubId);
  const tier = club?.tier ?? 3;
  const mult =
    ageMultiplier(age) * tierForm(tier) * (0.75 + (player.potential - 60) / 100);

  const appearances = rndInt(24, 40);
  let goals = 0;
  let assists = 0;
  let yellow = rndInt(0, 8);
  let red = chance(0.06) ? rndInt(1, 2) : 0;
  let cleanSheets: number | undefined;
  let saves: number | undefined;
  let tackles: number | undefined;
  let interceptions: number | undefined;

  switch (player.position) {
    case "GK": {
      goals = chance(0.04) ? 1 : 0;
      assists = rndInt(0, 2);
      cleanSheets = Math.round(rndRange(6, 22) * mult);
      saves = Math.round(rndRange(60, 140) * mult);
      yellow = rndInt(0, 4);
      red = chance(0.03) ? 1 : 0;
      break;
    }
    case "DEF": {
      goals = Math.round(rndRange(1, 10) * mult);
      assists = Math.round(rndRange(1, 9) * mult);
      tackles = Math.round(rndRange(40, 110) * mult);
      interceptions = Math.round(rndRange(25, 80) * mult);
      yellow = rndInt(2, 10);
      break;
    }
    case "MID": {
      goals = Math.round(rndRange(5, 20) * mult);
      assists = Math.round(rndRange(5, 18) * mult);
      yellow = rndInt(1, 9);
      break;
    }
    case "FWD": {
      goals = Math.round(rndRange(12, 42) * mult);
      assists = Math.round(rndRange(3, 14) * mult);
      yellow = rndInt(1, 7);
      break;
    }
  }

  const rating = computeRating(player.position, {
    appearances,
    goals,
    assists,
    yellowCards: yellow,
    redCards: red,
    cleanSheets,
    saves,
    tackles,
    interceptions,
    rating: 0,
  });

  return {
    appearances,
    goals,
    assists,
    yellowCards: yellow,
    redCards: red,
    cleanSheets,
    saves,
    tackles,
    interceptions,
    rating: Math.round(rating * 10) / 10,
  };
}

function computeRating(
  position: Player["position"],
  s: SeasonStats,
): number {
  let r = 6.0;
  switch (position) {
    case "GK":
      r += (s.cleanSheets ?? 0) * 0.12 + (s.saves ?? 0) * 0.01;
      break;
    case "DEF":
      r +=
        s.goals * 0.18 +
        s.assists * 0.1 +
        (s.tackles ?? 0) * 0.012 +
        (s.interceptions ?? 0) * 0.015;
      break;
    case "MID":
      r += s.goals * 0.12 + s.assists * 0.12;
      break;
    case "FWD":
      r += s.goals * 0.08 + s.assists * 0.06;
      break;
  }
  r -= s.redCards * 0.3 + s.yellowCards * 0.02;
  return clamp(r, 5.5, 9.6);
}

/** FIFA Club World Cup runs every 4 years, 3 years after each World Cup
 * (World Cup years: 2026, 2030, 2034, …). */
export function isFifaClubWorldCupYear(year: number): boolean {
  return year >= 2029 && (year - 2029) % 4 === 0;
}

/** Continental competitions the player has lifted across their career */
function continentalWinsSet(
  priorSeasons: Season[],
  thisSeasonComp: string | undefined,
  thisSeasonResult: ClubResult["continentalResult"],
): Set<string> {
  const set = new Set<string>();
  for (const s of priorSeasons) {
    if (s.club.continentalResult === "champion" && s.club.continentalCompetition) {
      set.add(s.club.continentalCompetition);
    }
  }
  if (thisSeasonResult === "champion" && thisSeasonComp) set.add(thisSeasonComp);
  return set;
}

export function simulateClubResult(
  player: Player,
  year: number,
  priorSeasons: Season[],
): ClubResult {
  const club = clubById(player.currentClubId);
  const tier = club?.tier ?? 3;
  const country = COUNTRY_BY_CODE[player.currentCountry];

  // Probability per tier of finishing top 1, top 4, top 10
  const tierProb: Record<number, [number, number, number]> = {
    1: [0.45, 0.85, 0.99],
    2: [0.15, 0.55, 0.92],
    3: [0.06, 0.3, 0.75],
    4: [0.02, 0.12, 0.55],
  };
  const probs = tierProb[tier] ?? tierProb[3];
  const roll = Math.random();
  let leaguePosition: number;
  if (roll < probs[0]) leaguePosition = 1;
  else if (roll < probs[1]) leaguePosition = rndInt(2, 4);
  else if (roll < probs[2]) leaguePosition = rndInt(5, 10);
  else leaguePosition = rndInt(11, 20);

  const leagueWin = leaguePosition === 1;

  // Continental qualification
  const continentals = country
    ? continentalForConfederation(country.confederation)
    : [];
  let qualifiedToContinental: string | undefined;
  if (continentals.length > 0) {
    if (leaguePosition <= 2) qualifiedToContinental = continentals[0].id;
    else if (leaguePosition <= 5 && continentals[1])
      qualifiedToContinental = continentals[1].id;
    else if (leaguePosition <= 8 && continentals[2])
      qualifiedToContinental = continentals[2].id;
  }

  // National cup
  const cupProb = { 1: 0.32, 2: 0.2, 3: 0.1, 4: 0.04 }[tier as 1 | 2 | 3 | 4] ?? 0.08;
  const nationalCupWon = chance(cupProb);

  // Continental participation result (assume already qualified last year)
  let continentalCompetition: string | undefined;
  let continentalResult: ClubResult["continentalResult"];
  if (tier <= 2 && continentals[0]) {
    continentalCompetition = continentals[0].id;
    const roll2 = Math.random();
    if (tier === 1) {
      if (roll2 < 0.18) continentalResult = "champion";
      else if (roll2 < 0.32) continentalResult = "runner-up";
      else if (roll2 < 0.55) continentalResult = "semifinal";
      else if (roll2 < 0.78) continentalResult = "quarterfinal";
      else continentalResult = "group";
    } else {
      if (roll2 < 0.06) continentalResult = "champion";
      else if (roll2 < 0.16) continentalResult = "runner-up";
      else if (roll2 < 0.32) continentalResult = "semifinal";
      else if (roll2 < 0.62) continentalResult = "quarterfinal";
      else continentalResult = "group";
    }
  } else if (tier === 3 && continentals[1]) {
    continentalCompetition = continentals[1].id;
    const roll2 = Math.random();
    if (roll2 < 0.04) continentalResult = "champion";
    else if (roll2 < 0.12) continentalResult = "semifinal";
    else if (roll2 < 0.35) continentalResult = "quarterfinal";
    else continentalResult = "group";
  }

  // Bonus trophies awarded after winning a continental crown
  const bonusTrophies: string[] = [];
  const isCwcYear = isFifaClubWorldCupYear(year);

  // Awarded the season AFTER winning the corresponding continental crown
  const prevSeason = priorSeasons[priorSeasons.length - 1];
  if (
    prevSeason?.club.continentalResult === "champion" &&
    prevSeason?.club.continentalCompetition === "uefa-cl"
  ) {
    bonusTrophies.push("uefa-supercup");
  }
  if (
    prevSeason?.club.continentalResult === "champion" &&
    prevSeason?.club.continentalCompetition === "conmebol-lib"
  ) {
    bonusTrophies.push("conmebol-recopa");
  }
  if (
    prevSeason?.club.continentalResult === "champion" &&
    (prevSeason?.club.continentalCompetition === "uefa-cl" ||
      prevSeason?.club.continentalCompetition === "conmebol-lib")
  ) {
    bonusTrophies.push("intercontinental");
  }

  if (continentalResult === "champion" && continentalCompetition) {
    const wins = continentalWinsSet(priorSeasons, continentalCompetition, continentalResult);

    const isTopCont =
      continentalCompetition === "uefa-cl" ||
      continentalCompetition === "conmebol-lib" ||
      continentalCompetition === "afc-cl" ||
      continentalCompetition === "concacaf-cc";

    // FIFA Club World Cup — only on CWC years (3 years after a World Cup)
    // and only awarded to top-confederation champions
    if (isCwcYear && isTopCont) {
      const cwcChance = continentalCompetition === "uefa-cl" ? 0.55 : 0.18;
      if (chance(cwcChance)) bonusTrophies.push("fifa-cwc");
    }

  }

  // Promotion / relegation — Spain only for now
  let relegated = false;
  let promoted = false;
  if (player.currentCountry === "ES") {
    if (player.currentLeague === "LaLiga") {
      // Bottom clubs fight relegation
      if (leaguePosition >= 18 && chance(0.72)) relegated = true;
      else if (leaguePosition >= 15 && tier >= 4 && chance(0.38)) relegated = true;
      else if (leaguePosition >= 17 && tier >= 3 && chance(0.45)) relegated = true;
    } else if (player.currentLeague === "LaLiga Hypermotion") {
      // Top clubs earn promotion
      if (leaguePosition <= 2 && chance(0.70)) promoted = true;
      else if (leaguePosition <= 4 && tier <= 3 && chance(0.30)) promoted = true;
    }
  }

  // No continental football in the second division
  if (player.currentLeague === "LaLiga Hypermotion") {
    qualifiedToContinental = undefined;
    continentalCompetition = undefined;
    continentalResult = undefined;
  }

  // Domestic bonus cups — country-specific
  let leagueCupWon: boolean | undefined;
  if (player.currentCountry === "EN") {
    // EFL Cup — open to all English clubs each season
    const eflChance = tier === 1 ? 0.14 : tier === 2 ? 0.07 : 0.03;
    leagueCupWon = chance(eflChance) || undefined;
    // Community Shield — follows a league, FA Cup, or EFL Cup win
    if ((leagueWin || nationalCupWon || leagueCupWon) && chance(0.55)) bonusTrophies.push("en-community-shield");
  }
  if (player.currentCountry === "ES") {
    // Supercopa de España — follows a league or cup win
    if ((leagueWin || nationalCupWon) && chance(0.5)) bonusTrophies.push("es-supercopa");
  }

  return {
    leaguePosition,
    leagueWin,
    qualifiedToContinental,
    nationalCupWon,
    leagueCupWon,
    continentalCompetition,
    continentalResult,
    bonusTrophies: bonusTrophies.length > 0 ? bonusTrophies : undefined,
    relegated: relegated || undefined,
    promoted: promoted || undefined,
  };
}

export function simulateNationalTeam(
  player: Player,
  age: number,
  year: number,
  rating: number,
): NationalTeamResult {
  const country = COUNTRY_BY_CODE[player.countryCode];
  // Probability called up scales with rating + age window
  let callProb = (rating - 6.5) * 0.35;
  if (age < 20) callProb -= 0.25;
  if (age > 35) callProb -= 0.15;
  callProb = clamp(callProb + 0.3, 0.05, 0.95);
  const called = chance(callProb);
  if (!called) return { called: false, caps: 0, goals: 0 };

  const caps = rndInt(4, 11);
  let goals = 0;
  if (player.position === "FWD") goals = rndInt(0, Math.max(1, Math.floor(caps / 2)));
  else if (player.position === "MID") goals = rndInt(0, Math.max(1, Math.floor(caps / 3)));
  else if (player.position === "DEF") goals = chance(0.5) ? rndInt(0, 2) : 0;

  type TourResult = NonNullable<NationalTeamResult["tournament"]>;
  const tournament = country ? tournamentForYear(year, country.confederation) : undefined;
  let tournamentResult: TourResult | undefined;
  if (tournament && country) {
    const big = ["AR", "BR", "ES", "FR", "EN", "DE", "IT", "PT", "NL", "BE", "UY"];
    const mid = ["CO", "CL", "MX", "US", "TR", "JP"];
    const strength = big.includes(player.countryCode)
      ? 0.22
      : mid.includes(player.countryCode)
      ? 0.1
      : 0.04;
    const roll = Math.random();
    let result: TourResult["result"] = "group";
    if (roll < strength) result = "champion";
    else if (roll < strength + 0.08) result = "runner-up";
    else if (roll < strength + 0.2) result = "semifinal";
    else if (roll < strength + 0.4) result = "quarterfinal";
    tournamentResult = {
      name: tournament.name,
      confederation: country.confederation,
      result,
    };
  }

  return {
    called: true,
    caps,
    goals,
    tournament: tournamentResult,
  };
}

export function simulateAwards(
  player: Player,
  stats: SeasonStats,
  club: ClubResult,
  national: NationalTeamResult,
): IndividualAward[] {
  const awards: IndividualAward[] = [];
  const greatSeason =
    stats.rating >= 8.6 &&
    (stats.goals + stats.assists >= (player.position === "FWD" ? 25 : 15) ||
      (player.position === "GK" && (stats.cleanSheets ?? 0) >= 18));
  const wonBig = club.leagueWin || club.continentalResult === "champion";
  const wonWithNT = national.tournament?.result === "champion";

  const inBig5 = ["Premier League", "LaLiga", "Serie A", "Ligue 1", "Bundesliga"].includes(
    player.currentLeague,
  );
  if (greatSeason && (wonBig || wonWithNT)) {
    if (inBig5 && chance(0.4)) awards.push("Ballon d'Or");
    if (chance(0.35)) awards.push("FIFA The Best");
  }
  if (player.position === "FWD" && stats.goals >= 28 && chance(0.45)) {
    awards.push("Golden Boot");
  }
  if (stats.rating >= 8.3 && chance(0.35)) awards.push("League MVP");
  if (
    club.continentalResult === "champion" &&
    stats.rating >= 8.0 &&
    chance(0.35)
  ) {
    awards.push("Continental Player of the Year");
  }
  return Array.from(new Set(awards));
}

function buildStandingRow(
  clubId: string,
  clubName: string,
  pts: number,
  n: number,
): StandingRow {
  const mod = pts % 3;
  const maxExtraSets = Math.floor((Math.min(pts, n) - mod) / 3);
  const d = mod + Math.min(rndInt(0, 3), maxExtraSets) * 3;
  const w = (pts - d) / 3;
  const l = Math.max(0, n - w - d);
  const str = clamp(pts / (n * 3), 0, 1);
  const gf = clamp(Math.round(n * (0.7 + str * 1.1) + rndInt(-6, 6)), 10, 120);
  const ga = clamp(Math.round(n * (1.8 - str * 1.1) + rndInt(-6, 6)), 10, 120);
  return { clubId, clubName, played: w + d + l, won: w, drawn: d, lost: l, gf, ga, points: pts };
}

export function simulateLeagueTable(
  player: Player,
  leaguePosition: number,
): StandingRow[] {
  const league = leagueByName(player.currentLeague);
  if (!league || league.clubs.length < 2) return [];

  const clubs = league.clubs;
  const n = (clubs.length - 1) * 2; // home + away round

  const BASE: Record<number, number> = { 1: 78, 2: 62, 3: 48, 4: 34 };

  // Generate points for every club except the player's
  const others = clubs
    .filter((c) => c.id !== player.currentClubId)
    .map((c) => ({
      id: c.id,
      name: c.name,
      pts: clamp((BASE[c.tier] ?? 38) + rndInt(-13, 13), 6, n * 3 - 1),
    }))
    .sort((a, b) => b.pts - a.pts);

  // Determine points for the player's club so they land at leaguePosition
  const targetIdx = clamp(leaguePosition - 1, 0, others.length);
  let playerPts: number;
  if (targetIdx === 0) {
    playerPts = (others[0]?.pts ?? 60) + rndInt(2, 9);
  } else if (targetIdx >= others.length) {
    playerPts = Math.max((others[others.length - 1]?.pts ?? 20) - rndInt(2, 8), 4);
  } else {
    const above = others[targetIdx - 1].pts;
    const below = others[targetIdx].pts;
    playerPts = below + Math.max(1, Math.floor((above - below + 1) / 2));
  }
  playerPts = clamp(playerPts, 4, n * 3 - 1);

  others.splice(targetIdx, 0, {
    id: player.currentClubId,
    name: player.currentClubName,
    pts: playerPts,
  });

  return others.map((e) => buildStandingRow(e.id, e.name, e.pts, n));
}

export function simulateSeason(
  player: Player,
  age: number,
  year: number,
  seasonIndex: number,
  priorSeasons: Season[],
): Season {
  const stats = simulateStats(player, age);
  const club = simulateClubResult(player, year, priorSeasons);
  const national = simulateNationalTeam(player, age, year, stats.rating);
  const awards = simulateAwards(player, stats, club, national);
  const standings = simulateLeagueTable(player, club.leaguePosition);

  return {
    index: seasonIndex,
    age,
    ageAtSeasonStart: age,
    clubId: player.currentClubId,
    clubName: player.currentClubName,
    clubCountry: player.currentCountry,
    league: player.currentLeague,
    stats,
    club,
    national,
    awards,
    salaryEur: player.salaryEur,
    standings: standings.length > 0 ? standings : undefined,
  };
}
