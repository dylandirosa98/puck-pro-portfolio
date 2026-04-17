"use client";

import { Player } from "@/lib/types";
import PlayerTemplate from "@/components/PlayerTemplate";

export type EditSection =
  | "basic"
  | "story"
  | "stats"
  | "highlights"
  | "socials"
  | "skillsets"
  | "training";

interface BuilderProfileProps {
  player: Player;
  onEdit: (section: EditSection) => void;
}

export default function BuilderProfile({ player, onEdit }: BuilderProfileProps) {
  return (
    <div className="relative">
      <PlayerTemplate player={player} />

      {/* Edit overlays */}
      <div className="fixed top-4 right-4 z-20 flex flex-col gap-2">
        {(["basic", "story", "stats", "highlights", "socials"] as EditSection[]).map((s) => (
          <button
            key={s}
            onClick={() => onEdit(s)}
            className="px-3 py-1.5 bg-black/70 border border-white/20 rounded-lg text-xs text-white/70 hover:text-white hover:border-white/40 backdrop-blur-sm capitalize transition-colors"
          >
            Edit {s}
          </button>
        ))}
      </div>
    </div>
  );
}
