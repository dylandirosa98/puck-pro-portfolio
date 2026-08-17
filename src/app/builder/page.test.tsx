import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import BuilderPage from "@/app/builder/page";
import { currentSeasonLabel } from "@/lib/hockey";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a href={String(href)} {...props}>{children}</a>,
}));

vi.mock("@/components/PlayerTemplate", () => ({ default: () => <div data-testid="preview" /> }));
vi.mock("@/components/admin/ImageUpload", () => ({ default: () => <div /> }));
vi.mock("@/components/admin/MediaPhotoUpload", () => ({ default: () => <div /> }));
vi.mock("@/components/admin/MediaVideoUpload", () => ({ default: () => <div /> }));

describe("builder season history", () => {
  it("adds editable goalie seasons with goalie-specific stat fields", async () => {
    const user = userEvent.setup();
    render(<BuilderPage />);

    await user.click(screen.getByRole("button", { name: "Goalie" }));
    await user.click(screen.getByRole("button", { name: "Stats" }));
    expect(await screen.findByRole("heading", { name: "Player stats" })).toBeInTheDocument();
    expect(screen.getAllByText("GAA")).toHaveLength(1);
    expect(screen.queryByText("PTS")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add Season" }));
    const season = screen.getByLabelText("Season");
    expect(season).toHaveValue(currentSeasonLabel());
    expect(screen.getAllByText("GAA")).toHaveLength(2);
    expect(screen.getAllByText("SV%")).toHaveLength(2);

    await user.clear(season);
    await user.type(season, "2027-28");
    expect(season).toHaveValue("2027-28");

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem("puckpro_builder_draft_v2") ?? "{}");
      expect(saved.seasonHistory[0].season).toBe("2027-28");
      expect(saved.position).toBe("Goalie");
    });
  });
});
