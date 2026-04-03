"use client";

import { useState } from "react";
import { WizardState } from "@/lib/types";

interface Props {
  data: WizardState;
  onNext: (partial: Partial<WizardState>) => void;
  onBack: () => void;
  saving: boolean;
}

export default function Step2Details({ data, onNext, onBack, saving }: Props) {
  const [team, setTeam] = useState(data.team || "");
  const [league, setLeague] = useState(data.league || "");
  const [hometown, setHometown] = useState(data.hometown || "");
  const [birthYear, setBirthYear] = useState<number | "">(data.birthYear || "");
  const [height, setHeight] = useState(data.height || "");
  const [weight, setWeight] = useState(data.weight || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext({ team, league, hometown, birthYear: Number(birthYear) || 2005, height, weight });
  }

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-base placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Player Details</h2>
        <p className="text-white/40 text-sm">Your team and physical info</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Team</label>
          <input className={inputCls} placeholder="Monarchs" value={team} onChange={(e) => setTeam(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">League</label>
          <input className={inputCls} placeholder="USHL" value={league} onChange={(e) => setLeague(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Hometown</label>
          <input className={inputCls} placeholder="Chicago, IL" value={hometown} onChange={(e) => setHometown(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Birth Year</label>
          <input
            className={inputCls}
            type="number"
            placeholder="2005"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value === "" ? "" : Number(e.target.value))}
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Height</label>
          <input className={inputCls} placeholder={`6'2"`} value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Weight</label>
          <input className={inputCls} placeholder="185 lbs" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 font-bold text-sm active:bg-white/10 transition-all"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-4 bg-[#b91c1c] hover:bg-[#991b1b] active:scale-95 rounded-2xl text-white font-bold text-sm transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : "Next →"}
        </button>
      </div>
    </form>
  );
}
