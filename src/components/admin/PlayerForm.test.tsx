import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PlayerForm from "@/components/admin/PlayerForm";
import { createEmptyStats, currentSeasonLabel } from "@/lib/hockey";
import type { PlayerWithMeta } from "@/lib/types";

const push = vi.fn();
const refresh = vi.fn();
const updatePlayer = vi.hoisted(() => vi.fn<
  (id: string, formData: FormData) => Promise<Record<string, never>>
>(async () => ({})));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

vi.mock("@/lib/actions/player-actions", () => ({
  createPlayer: vi.fn(async () => ({})),
  updatePlayer,
}));

vi.mock("@/components/admin/ImageUpload", () => ({ default: () => <div /> }));
vi.mock("@/components/admin/PdfUpload", () => ({ default: () => <div /> }));
vi.mock("@/components/admin/MediaPhotoUpload", () => ({ default: () => <div /> }));
vi.mock("@/components/admin/MediaVideoUpload", () => ({ default: () => <div /> }));

const player: PlayerWithMeta = {
  id: "player-1",
  slug: "alex-morgan",
  firstName: "Alex",
  lastName: "Morgan",
  position: "Forward",
  number: 18,
  team: "Ice Wolves",
  league: "U18 AAA",
  hometown: "Detroit, MI",
  height: "5'10\"",
  weight: "170 lbs",
  shoots: "Left",
  birthYear: 2008,
  bio: "Player bio",
  headshotUrl: "",
  heroImageUrl: "",
  currentStats: createEmptyStats(),
  seasonHistory: [],
  highlights: [],
  socialLinks: [],
  themeColor: "#b91c1c",
  skillsets: [{ name: "", description: "", videos: [] }],
  isPublished: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("PlayerForm repeatable fields", () => {
  beforeEach(() => {
    push.mockClear();
    refresh.mockClear();
    updatePlayer.mockClear();
  });

  it("keeps skill inputs mounted and focused while typing multiple characters", async () => {
    const user = userEvent.setup();
    render(<PlayerForm player={player} />);

    const name = screen.getByPlaceholderText("e.g. Offensive Defenseman");
    await user.click(name);
    await user.type(name, "Edge control");

    expect(name).toHaveValue("Edge control");
    expect(screen.getByPlaceholderText("e.g. Offensive Defenseman")).toBe(name);
    expect(name).toHaveFocus();

    const description = screen.getByPlaceholderText("Brief description of this skill...");
    await user.click(description);
    await user.type(description, "Quick feet and clean exits");

    expect(description).toHaveValue("Quick feet and clean exits");
    expect(screen.getByPlaceholderText("Brief description of this skill...")).toBe(description);
    expect(description).toHaveFocus();
  });

  it("adds a current, editable season and switches history fields for goalies", async () => {
    const user = userEvent.setup();
    render(<PlayerForm player={player} />);

    await user.selectOptions(screen.getByDisplayValue("Forward"), "Goalie");
    await user.click(screen.getByRole("button", { name: "+ Add Season" }));

    const season = screen.getByPlaceholderText(currentSeasonLabel());
    expect(season).toHaveValue(currentSeasonLabel());
    expect(screen.getAllByText("GAA")).toHaveLength(2);
    expect(screen.getAllByText("SV%")).toHaveLength(2);
    expect(screen.queryByText("PTS")).not.toBeInTheDocument();

    await user.clear(season);
    await user.type(season, "2027-28");
    expect(season).toHaveValue("2027-28");
    expect(season).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Update Player" }));
    await waitFor(() => expect(updatePlayer).toHaveBeenCalledOnce());

    const formData = updatePlayer.mock.calls[0][1] as FormData;
    const savedSeasons = JSON.parse(String(formData.get("seasonHistory")));
    expect(savedSeasons[0].season).toBe("2027-28");
    expect(savedSeasons[0].stats).toMatchObject({
      wins: 0,
      losses: 0,
      goalsAgainstAverage: 0,
      savePercentage: 0,
      shutouts: 0,
    });
  });
});
