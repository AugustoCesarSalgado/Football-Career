import type { Position } from "@/types";
import { pick } from "./random";

export const NUMBERS_BY_POSITION: Record<Position, number[]> = {
  GK: [1, 12, 13, 22, 23],
  DEF: [2, 3, 4, 5, 6, 15, 16, 24],
  MID: [8, 10, 14, 17, 18, 20],
  FWD: [7, 9, 11, 19, 21],
};

export function squadNumber(position: Position): number {
  return pick(NUMBERS_BY_POSITION[position]);
}

export const POSITION_LABEL: Record<Position, string> = {
  GK: "Arquero",
  DEF: "Defensor",
  MID: "Mediocampista",
  FWD: "Delantero",
};

export const POSITION_SHORT: Record<Position, string> = {
  GK: "GK",
  DEF: "DEF",
  MID: "MID",
  FWD: "FWD",
};
