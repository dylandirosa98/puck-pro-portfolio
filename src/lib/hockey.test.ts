import { describe, expect, it } from "vitest";
import {
  createEmptyStats,
  currentSeasonLabel,
  formatSeasonLabel,
  hasStatsForPosition,
  isGoalie,
  seasonOptions,
  statFieldsForPosition,
} from "@/lib/hockey";

describe("hockey stats", () => {
  it("selects goalie fields for canonical and legacy goalie values", () => {
    expect(isGoalie("Goalie")).toBe(true);
    expect(isGoalie(" goalie ")).toBe(true);
    expect(statFieldsForPosition("goalie").map(([, label]) => label)).toEqual([
      "GP", "W", "L", "GAA", "SV%", "SO",
    ]);
  });

  it("only counts stats visible for the player's position", () => {
    const stats = { ...createEmptyStats(), goals: 4 };
    expect(hasStatsForPosition(stats, "Forward")).toBe(true);
    expect(hasStatsForPosition(stats, "Goalie")).toBe(false);
    expect(hasStatsForPosition({ ...stats, wins: 2 }, "Goalie")).toBe(true);
  });
});

describe("hockey seasons", () => {
  it("rolls over in July and formats season labels", () => {
    expect(currentSeasonLabel(new Date("2026-06-30T23:59:59.999Z"))).toBe("2025-26");
    expect(currentSeasonLabel(new Date("2026-07-01T00:00:00.000Z"))).toBe("2026-27");
    expect(formatSeasonLabel(2099)).toBe("2099-00");
  });

  it("offers future and historical seasons while preserving custom values", () => {
    const options = seasonOptions(["2024-25", "Spring 2023"], new Date("2026-08-17T12:00:00.000Z"));
    expect(options.slice(0, 4)).toEqual(["2027-28", "2026-27", "2025-26", "2024-25"]);
    expect(options).toContain("Spring 2023");
  });
});
