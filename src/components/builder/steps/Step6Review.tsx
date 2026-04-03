"use client";

import { useState } from "react";
import Image from "next/image";
import { WizardState } from "@/lib/types";

interface Props {
  data: WizardState;
  onFinish: (bio: string) => void;
  onBack: () => void;
  saving: boolean;
}

const MAX_BIO = 500;

export default function Step6Review({ data, onFinish, onBack, saving }: Props) {
  const [bio, setBio] = useState(data.bio || "");

  const s = data.currentStats;
  const hasHeadshot = data.headshotUrl && !data.headshotUrl.includes("placeholder");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Almost done</h2>
        <p className="text-white/40 text-sm">Add a bio and review your profile</p>
      </div>

      {/* Bio */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs text-white/40">Bio <span className="text-white/20">(optional)</span></label>
          <span className={`text-[10px] ${bio.length > MAX_BIO ? "text-red-400" : "text-white/20"}`}>
            {bio.length}/{MAX_BIO}
          </span>
        </div>
        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none h-24"
          placeholder="Tell your story — goals, what drives you, where you want to play..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={MAX_BIO + 50}
        />
      </div>

      {/* Summary card */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-4 space-y-3">
        {/* Name + headshot */}
        <div className="flex items-center gap-3">
          {hasHeadshot ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image src={data.headshotUrl} alt="Headshot" fill className="object-cover" unoptimized />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-white/30 font-bold">{data.firstName?.[0] || "?"}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold truncate">{data.firstName} {data.lastName}</p>
            <p className="text-white/40 text-xs">{data.position} · #{data.number} · {data.team}</p>
          </div>
          <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: data.themeColor }} />
        </div>

        {/* Stats */}
        {s && (
          <div className="grid grid-cols-6 gap-1 pt-1 border-t border-white/5">
            {([["GP", s.gamesPlayed], ["G", s.goals], ["A", s.assists], ["PTS", s.points], ["+/-", s.plusMinus], ["PIM", s.pim]] as [string, number][]).map(([label, val]) => (
              <div key={label} className="text-center">
                <p className="text-white font-bold text-sm">{val}</p>
                <p className="text-white/25 text-[9px]">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Reel + socials */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
          {data.highlightReelUrl && (
            <span className="text-[11px] bg-white/5 px-2 py-1 rounded-lg text-white/40">🎬 Reel</span>
          )}
          {data.socialLinks?.map((l) => (
            <span key={l.platform} className="text-[11px] bg-white/5 px-2 py-1 rounded-lg text-white/40 capitalize">
              {l.platform}
            </span>
          ))}
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
          type="button"
          onClick={() => onFinish(bio)}
          disabled={saving}
          className="flex-1 py-4 bg-[#b91c1c] hover:bg-[#991b1b] active:scale-95 rounded-2xl text-white font-bold text-sm transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save My Profile →"}
        </button>
      </div>
    </div>
  );
}
