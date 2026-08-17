import type { PlayerStats } from "@/lib/types";

export const playerStatFields = [
  ["gamesPlayed", "GP", "number"],
  ["goals", "G", "number"],
  ["assists", "A", "number"],
  ["points", "PTS", "number"],
  ["plusMinus", "+/-", "number"],
  ["pim", "PIM", "number"],
] as const;

export const goalieStatFields = [
  ["gamesPlayed", "GP", "number"],
  ["wins", "W", "number"],
  ["losses", "L", "number"],
  ["goalsAgainstAverage", "GAA", "decimal"],
  ["savePercentage", "SV%", "decimal"],
  ["shutouts", "SO", "number"],
] as const;

export type StatField = (typeof playerStatFields | typeof goalieStatFields)[number];

export function createEmptyStats(): PlayerStats {
  return {
    gamesPlayed: 0,
    goals: 0,
    assists: 0,
    points: 0,
    plusMinus: 0,
    pim: 0,
    wins: 0,
    losses: 0,
    goalsAgainstAverage: 0,
    savePercentage: 0,
    shutouts: 0,
  };
}

export function isGoalie(position?: string) {
  return position?.trim().toLowerCase() === "goalie";
}

export function statFieldsForPosition(position?: string) {
  return isGoalie(position) ? goalieStatFields : playerStatFields;
}

export function hasStatsForPosition(stats: PlayerStats, position?: string) {
  return statFieldsForPosition(position).some(([key]) => Number(stats[key] ?? 0) !== 0);
}

export function formatSeasonLabel(startYear: number) {
  return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

export function currentSeasonLabel(date = new Date()) {
  const startYear = date.getUTCMonth() >= 6 ? date.getUTCFullYear() : date.getUTCFullYear() - 1;
  return formatSeasonLabel(startYear);
}

export function seasonOptions(existing: string[] = [], date = new Date()) {
  const currentStartYear = date.getUTCMonth() >= 6 ? date.getUTCFullYear() : date.getUTCFullYear() - 1;
  const generated = Array.from({ length: 17 }, (_, index) => formatSeasonLabel(currentStartYear + 1 - index));
  return Array.from(new Set([...generated, ...existing.map((value) => value.trim()).filter(Boolean)]));
}
