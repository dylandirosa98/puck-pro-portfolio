"use client";

import { useState } from "react";
import { WizardState, PlayerStats } from "@/lib/types";

interface Props {
  data: WizardState;
  onNext: (partial: Partial<WizardState>) => void;
  onBack: () => void;
  saving: boolean;
}

const STAT_FIELDS: { key: keyof PlayerStats; label: string; full: string }[] = [
  { key: "gamesPlayed", label: "GP", full: "Games" },
  { key: "goals", label: "G", full: "Goals" },
  { key: "assists", label: "A", full: "Assists" },
  { key: "points", label: "PTS", full: "Points" },
  { key: "plusMinus", label: "+/-", full: "Plus/Minus" },
  { key: "pim", label: "PIM", full: "Penalty Min" },
];

const DEFAULT: PlayerStats = { gamesPlayed: 0, goals: 0, assists: 0, points: 0, plusMinus: 0, pim: 0 };

export default function Step4Stats({ data, onNext, onBack, saving }: Props) {
  const [stats, setStats] = useState<PlayerStats>({ ...DEFAULT, ...data.currentStats });

  function setStat(key: keyof PlayerStats, val: string) {
    setStats((s) => ({ ...s, [key]: Number(val) || 0 }));
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">This Season</h2>
        <p className="text-white/40 text-sm">Enter your current stats</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {STAT_FIELDS.map(({ key, label, full }) => (
          <div key={key}>
            <label className="text-[11px] text-white/40 mb-1.5 block text-center">{full}</label>
            <input
              type="number"
              inputMode="numeric"
              value={stats[key] || ""}
              onChange={(e) => setStat(key, e.target.value)}
              placeholder="0"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-2 py-4 text-white text-center text-xl font-bold focus:outline-none focus:border-white/30 transition-colors"
            />
            <p className="text-[10px] text-white/20 mt-1 text-center">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-white/25 text-center">
        You can add past seasons after publishing
      </p>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 font-bold text-sm active:bg-white/10 transition-all"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => onNext({ currentStats: stats, seasonHistory: data.seasonHistory || [] })}
          disabled={saving}
          className="flex-1 py-4 bg-[#b91c1c] hover:bg-[#991b1b] active:scale-95 rounded-2xl text-white font-bold text-sm transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : "Next →"}
        </button>
      </div>
    </div>
  );
}
