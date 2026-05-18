import type { Offer, Player, Season } from "@/types";
import { allClubs, clubById, LEAGUES } from "./leagues";
import { chance, clamp, pick, pickWeighted, rndInt, rndRange } from "./random";

function targetTierFromRating(rating: number, age: number): number {
  // The better the rating + age, the higher chance to land at tier 1
  // Returns expected tier (lower = bigger club)
  let pull = rating - 6.0;
  if (age < 21) pull -= 0.8;
  if (age > 33) pull -= 0.6;
  // pick a tier with bias
  const weights = [
    { item: 1, weight: clamp(pull * 1.4 - 0.3, 0.05, 4) },
    { item: 2, weight: clamp(pull * 1.0 + 0.3, 0.2, 4) },
    { item: 3, weight: clamp(2.5 - pull, 0.4, 4) },
    { item: 4, weight: clamp(3 - pull * 1.2, 0.4, 4) },
  ];
  return pickWeighted(weights);
}

function salaryForTier(tier: number, age: number): number {
  // Yearly salary in EUR
  const base = { 1: 9_000_000, 2: 3_500_000, 3: 1_200_000, 4: 380_000 }[
    tier as 1 | 2 | 3 | 4
  ];
  const youngBonus = age >= 24 && age <= 31 ? 1.4 : 1;
  const noise = rndRange(0.7, 1.6);
  return Math.round((base ?? 500_000) * youngBonus * noise);
}

function feeForTier(tier: number, age: number, rating: number): number {
  if (age >= 33) return Math.round(rndRange(0.5, 6) * 1_000_000);
  const base = { 1: 75_000_000, 2: 28_000_000, 3: 8_000_000, 4: 2_000_000 }[
    tier as 1 | 2 | 3 | 4
  ];
  const ratingMul = 0.4 + (rating - 6) * 0.6;
  const ageMul = age <= 27 ? 1.2 : age <= 30 ? 1 : 0.7;
  return Math.max(
    500_000,
    Math.round((base ?? 1_000_000) * ratingMul * ageMul * rndRange(0.75, 1.4)),
  );
}

export function generateOffers(
  player: Player,
  lastSeason: Season,
): { renew: Offer; transfer: Offer } {
  const renewBump = 1 + rndRange(0, 0.3);
  const renew: Offer = {
    type: "renew",
    clubId: player.currentClubId,
    clubName: player.currentClubName,
    clubLeague: player.currentLeague,
    clubCountry: player.currentCountry,
    clubTier: clubById(player.currentClubId)?.tier ?? 3,
    salaryEur: Math.round(player.salaryEur * renewBump),
    contractYears: rndInt(2, 4),
  };

  // Transfer offer
  const desiredTier = targetTierFromRating(lastSeason.stats.rating, lastSeason.age + 1);
  // Find a candidate club at that tier, not the current one
  const all = allClubs().filter(
    (c) => c.id !== player.currentClubId && c.tier === desiredTier,
  );
  const pool = all.length > 0 ? all : allClubs().filter((c) => c.id !== player.currentClubId);
  // Slight preference for staying in same country sometimes
  const sameCountry = pool.filter((c) => {
    const league = Object.values(LEAGUES).find((l) =>
      l.clubs.some((cl) => cl.id === c.id),
    );
    return league?.countryCode === player.currentCountry;
  });
  const target = chance(0.25) && sameCountry.length > 0 ? pick(sameCountry) : pick(pool);

  const transfer: Offer = {
    type: "transfer",
    clubId: target.id,
    clubName: target.name,
    clubLeague: target.league,
    clubCountry:
      Object.values(LEAGUES).find((l) => l.clubs.some((cl) => cl.id === target.id))
        ?.countryCode ?? player.currentCountry,
    clubTier: target.tier,
    salaryEur: salaryForTier(target.tier, lastSeason.age + 1),
    transferFeeEur: feeForTier(target.tier, lastSeason.age + 1, lastSeason.stats.rating),
    contractYears: rndInt(3, 5),
  };

  return { renew, transfer };
}
