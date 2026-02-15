"use client";

import { useState } from "react";
import { togglePublish } from "@/lib/actions/player-actions";

interface PublishToggleProps {
  playerId: string;
  initialPublished: boolean;
}

export default function PublishToggle({ playerId, initialPublished }: PublishToggleProps) {
  const [published, setPublished] = useState(initialPublished);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    const newState = !published;
    setPublished(newState); // optimistic
    setLoading(true);

    const result = await togglePublish(playerId, newState);
    if (result.error) {
      setPublished(!newState); // revert
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        published ? "bg-green-500" : "bg-white/20"
      } ${loading ? "opacity-50" : ""}`}
      title={published ? "Published" : "Draft"}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          published ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
