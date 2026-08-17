import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CareerStats from "@/components/sections/CareerStats";
import { createEmptyStats } from "@/lib/hockey";

describe("CareerStats", () => {
  it("renders goalie season-history columns and decimal values", () => {
    render(
      <CareerStats
        position="Goalie"
        seasons={[{
          season: "2026-27",
          team: "Ice Wolves",
          league: "U18 AAA",
          stats: {
            ...createEmptyStats(),
            gamesPlayed: 24,
            wins: 18,
            losses: 4,
            goalsAgainstAverage: 2.17,
            savePercentage: 0.925,
            shutouts: 3,
          },
        }]}
      />,
    );

    expect(screen.getAllByText("GAA").length).toBeGreaterThan(0);
    expect(screen.getAllByText("SV%").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2.17").length).toBeGreaterThan(0);
    expect(screen.getAllByText("0.925").length).toBeGreaterThan(0);
    expect(screen.queryByText("PTS")).not.toBeInTheDocument();
    expect(screen.queryByText("PIM")).not.toBeInTheDocument();
  });
});
