export type Position = "GK" | "DEF" | "MID" | "FWD";

export type Confederation = "UEFA" | "CONMEBOL" | "CONCACAF" | "AFC";

export interface Country {
  code: string;
  name: string;
  flagEmoji: string;
  confederation: Confederation;
  league: string;
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  country: string;
  league: string;
  tier: number; // 1 = giant, 2 = strong, 3 = mid, 4 = small
  logoSlug?: string;
}

export interface League {
  id: string;
  country: string;
  name: string;
  countryCode: string;
  confederation: Confederation;
  logoSlug?: string | null;
  clubs: Club[];
}

export interface ContinentalCompetition {
  id: string;
  name: string;
  confederation: Confederation;
  prestige: number; // 1-5
  logoSlug?: string;
}

export interface SeasonStats {
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  cleanSheets?: number; // GK
  saves?: number; // GK
  tackles?: number; // DEF
  interceptions?: number; // DEF
  rating: number; // 0-10, single-decimal
}

export interface NationalTeamResult {
  called: boolean;
  caps: number;
  goals: number;
  tournament?: {
    name: string;
    confederation: Confederation;
    result: "champion" | "runner-up" | "semifinal" | "quarterfinal" | "group";
  };
}

export interface ClubResult {
  leaguePosition: number;
  leagueWin: boolean;
  qualifiedToContinental?: string; // continental id
  nationalCupWon: boolean;
  leagueCupWon?: boolean; // secondary domestic cup (e.g. EFL Cup for England)
  continentalCompetition?: string;
  continentalResult?:
    | "champion"
    | "runner-up"
    | "semifinal"
    | "quarterfinal"
    | "group";
  /** Ids of bonus trophies awarded on top of the continental crown
   * (UEFA Super Cup, FIFA Club World Cup, Intercontinental Cup). */
  bonusTrophies?: string[];
  relegated?: boolean;
  promoted?: boolean;
}

export type IndividualAward =
  | "Ballon d'Or"
  | "FIFA The Best"
  | "Golden Boot"
  | "League MVP"
  | "Continental Player of the Year";

export interface StandingRow {
  clubId: string;
  clubName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
}

export interface Season {
  index: number;
  age: number;
  clubId: string;
  clubName: string;
  clubCountry: string;
  league: string;
  stats: SeasonStats;
  club: ClubResult;
  national: NationalTeamResult;
  awards: IndividualAward[];
  salaryEur: number; // yearly
  transferFeeEur?: number; // paid this year (when joined)
  ageAtSeasonStart: number;
  standings?: StandingRow[];
}

export interface Offer {
  type: "renew" | "transfer";
  clubId: string;
  clubName: string;
  clubLeague: string;
  clubCountry: string;
  clubTier: number;
  salaryEur: number;
  transferFeeEur?: number;
  contractYears: number;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: Position;
  countryCode: string;
  number: number;
  birthYear: number; // career year 1 minus 18 essentially; for tournament cycles use career.year
  potential: number; // 60-99 hidden rating
  currentClubId: string;
  currentClubName: string;
  currentLeague: string;
  currentCountry: string;
  salaryEur: number;
  contractYearsLeft: number;
}

export interface CareerState {
  player: Player;
  currentAge: number; // 18..40
  startYear: number; // real-world year the career begins
  seasons: Season[];
  pendingOffers?: { renew: Offer; transfer: Offer };
  finished: boolean;
}
