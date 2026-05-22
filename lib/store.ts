"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CareerState, Offer, Player, Position } from "@/types";
import { LEAGUES, clubById } from "./leagues";
import { simulateSeason } from "./simulator";
import { generateOffers } from "./offers";
import { rndInt } from "./random";

const STARTING_AGE = 18;
const RETIREMENT_AGE = 40;
const CAREER_START_YEAR = 2026;

export interface CreatePlayerInput {
  firstName: string;
  lastName: string;
  position: Position;
  countryCode: string;
  number: number;
  clubId: string;
}

interface CareerStoreState {
  career: CareerState | null;
  startCareer: (input: CreatePlayerInput) => void;
  simulateNext: () => void;
  acceptOffer: (offer: Offer) => void;
  reset: () => void;
}

function buildPlayer(input: CreatePlayerInput): Player {
  const club = clubById(input.clubId);
  if (!club) throw new Error("Club not found");
  const league = Object.values(LEAGUES).find((l) =>
    l.clubs.some((c) => c.id === input.clubId),
  );
  if (!league) throw new Error("League not found");
  const potential = rndInt(70, 95);
  const startingSalary = { 1: 800_000, 2: 350_000, 3: 130_000, 4: 60_000 }[
    club.tier as 1 | 2 | 3 | 4
  ];
  return {
    id: Math.random().toString(36).slice(2, 10),
    firstName: input.firstName,
    lastName: input.lastName,
    position: input.position,
    countryCode: input.countryCode,
    number: input.number,
    potential,
    birthYear: CAREER_START_YEAR - STARTING_AGE,
    currentClubId: club.id,
    currentClubName: club.name,
    currentLeague: league.name,
    currentCountry: league.countryCode,
    salaryEur: startingSalary ?? 100_000,
    contractYearsLeft: 2,
  };
}

export const useCareer = create<CareerStoreState>()(
  persist(
    (set, get) => ({
      career: null,
      startCareer: (input) => {
        const player = buildPlayer(input);
        const career: CareerState = {
          player,
          currentAge: STARTING_AGE,
          startYear: CAREER_START_YEAR,
          seasons: [],
          finished: false,
        };
        set({ career });
      },
      simulateNext: () => {
        const career = get().career;
        if (!career || career.finished) return;
        const age = career.currentAge;
        const year = career.startYear + (age - STARTING_AGE);
        const season = simulateSeason(
          career.player,
          age,
          year,
          career.seasons.length + 1,
          career.seasons,
        );
        const updatedSeasons = [...career.seasons, season];

        // Apply promotion / relegation to the player before generating offers
        // so the renew offer reflects the new division
        let playerForOffers = career.player;
        if (season.club.relegated) {
          playerForOffers = { ...playerForOffers, currentLeague: "LaLiga Hypermotion" };
        } else if (season.club.promoted) {
          playerForOffers = { ...playerForOffers, currentLeague: "LaLiga" };
        }

        const offers = generateOffers(playerForOffers, season);
        set({
          career: {
            ...career,
            player: playerForOffers,
            seasons: updatedSeasons,
            pendingOffers: offers,
          },
        });
      },
      acceptOffer: (offer) => {
        const career = get().career;
        if (!career) return;
        const nextAge = career.currentAge + 1;
        const finished = nextAge > RETIREMENT_AGE;

        const seasons = [...career.seasons];
        if (offer.type === "transfer" && offer.transferFeeEur && seasons.length > 0) {
          const idx = seasons.length - 1;
          seasons[idx] = { ...seasons[idx], transferFeeEur: offer.transferFeeEur };
        }

        const updatedPlayer: Player = {
          ...career.player,
          currentClubId: offer.clubId,
          currentClubName: offer.clubName,
          currentLeague: offer.clubLeague,
          currentCountry: offer.clubCountry,
          salaryEur: offer.salaryEur,
          contractYearsLeft: offer.contractYears,
        };

        set({
          career: {
            ...career,
            player: updatedPlayer,
            currentAge: nextAge,
            seasons,
            pendingOffers: undefined,
            finished,
          },
        });
      },
      reset: () => set({ career: null }),
    }),
    {
      name: "career-sim:v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const CAREER_CONFIG = {
  STARTING_AGE,
  RETIREMENT_AGE,
  CAREER_START_YEAR,
};
