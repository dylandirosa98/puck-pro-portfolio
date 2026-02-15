"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePlayer } from "@/lib/actions/player-actions";

interface DeleteButtonProps {
  playerId: string;
  playerName: string;
  redirectAfter?: boolean;
}

export default function DeleteButton({ playerId, playerName, redirectAfter }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const result = await deletePlayer(playerId);

    if (result.error) {
      alert(`Failed to delete: ${result.error}`);
      setLoading(false);
      setConfirming(false);
      return;
    }

    if (redirectAfter) {
      router.push("/admin");
    }
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-400">Delete {playerName}?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs px-2 py-1 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-white/30 hover:text-red-400 transition-colors"
    >
      Delete
    </button>
  );
}
