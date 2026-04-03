"use client";

import { useState } from "react";
import { WizardState } from "@/lib/types";

interface Props {
  data: WizardState;
  onNext: (partial: Partial<WizardState>) => void;
  saving: boolean;
}

const POSITIONS = ["Forward", "Defense", "Goalie"] as const;
type Position = (typeof POSITIONS)[number];

export default function Step1BasicInfo({ data, onNext, saving }: Props) {
  const [firstName, setFirstName] = useState(data.firstName || "");
  const [lastName, setLastName] = useState(data.lastName || "");
  const [position, setPosition] = useState<Position | "">((data.position as Position) || "");
  const [number, setNumber] = useState<number | "">(data.number || "");
  const [shoots, setShoots] = useState<"Left" | "Right">(data.shoots || "Left");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!position) return;
    onNext({ firstName, lastName, position, number: Number(number) || 0, shoots });
  }

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-base placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Who are you?</h2>
        <p className="text-white/40 text-sm">Let&apos;s start with the basics</p>
      </div>

      {/* Name */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">First Name</label>
          <input
            className={inputCls}
            placeholder="Jack"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Last Name</label>
          <input
            className={inputCls}
            placeholder="Smalley"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </div>
      </div>

      {/* Position */}
      <div>
        <label className="text-xs text-white/40 mb-2 block">Position</label>
        <div className="grid grid-cols-3 gap-2">
          {POSITIONS.map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => setPosition(pos)}
              className={`py-4 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${
                position === pos
                  ? "bg-[#b91c1c] border-[#b91c1c] text-white"
                  : "bg-white/5 border-white/10 text-white/50"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Jersey # + Shoots */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Jersey #</label>
          <input
            className={inputCls}
            type="number"
            placeholder="14"
            value={number}
            onChange={(e) => setNumber(e.target.value === "" ? "" : Number(e.target.value))}
            inputMode="numeric"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 mb-1.5 block">Shoots</label>
          <div className="grid grid-cols-2 gap-2">
            {(["Left", "Right"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setShoots(s)}
                className={`py-4 rounded-2xl border text-sm font-bold transition-all active:scale-95 ${
                  shoots === s
                    ? "bg-[#b91c1c] border-[#b91c1c] text-white"
                    : "bg-white/5 border-white/10 text-white/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || !position || !firstName || !lastName}
        className="w-full py-4 bg-[#b91c1c] hover:bg-[#991b1b] active:scale-95 rounded-2xl text-white font-bold text-base transition-all disabled:opacity-50"
      >
        {saving ? "Saving..." : "Next →"}
      </button>
    </form>
  );
}
