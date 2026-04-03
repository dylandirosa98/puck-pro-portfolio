"use client";

import { useState } from "react";
import { WizardState, SocialLink } from "@/lib/types";

interface Props {
  data: WizardState;
  onNext: (partial: Partial<WizardState>) => void;
  onBack: () => void;
  saving: boolean;
}

type SocialKey = "instagram" | "twitter" | "youtube" | "tiktok";

const SOCIALS: { key: SocialKey; icon: string; placeholder: string }[] = [
  { key: "instagram", icon: "📸", placeholder: "instagram.com/yourhandle" },
  { key: "twitter", icon: "𝕏", placeholder: "x.com/yourhandle" },
  { key: "youtube", icon: "▶", placeholder: "youtube.com/@channel" },
  { key: "tiktok", icon: "♪", placeholder: "tiktok.com/@handle" },
];

export default function Step5Links({ data, onNext, onBack, saving }: Props) {
  const getUrl = (p: SocialKey) =>
    data.socialLinks?.find((l) => l.platform === p)?.url || "";

  const [reelUrl, setReelUrl] = useState(data.highlightReelUrl || "");
  const [socials, setSocials] = useState<Record<SocialKey, string>>({
    instagram: getUrl("instagram"),
    twitter: getUrl("twitter"),
    youtube: getUrl("youtube"),
    tiktok: getUrl("tiktok"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const socialLinks: SocialLink[] = SOCIALS.filter((p) => socials[p.key].trim()).map((p) => ({
      platform: p.key,
      url: socials[p.key].trim().startsWith("http")
        ? socials[p.key].trim()
        : `https://${socials[p.key].trim()}`,
    }));
    onNext({
      highlightReelUrl: reelUrl,
      highlights: reelUrl ? [{ title: "Highlight Reel", url: reelUrl }] : data.highlights || [],
      socialLinks,
    });
  }

  const inputCls =
    "flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Highlights & Socials</h2>
        <p className="text-white/40 text-sm">All optional — add what you have</p>
      </div>

      {/* Reel URL */}
      <div>
        <label className="text-xs text-white/40 mb-1.5 block">Highlight Reel</label>
        <input
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
          placeholder="youtube.com/watch?v=..."
          value={reelUrl}
          onChange={(e) => setReelUrl(e.target.value)}
          inputMode="url"
        />
        <p className="text-[11px] text-white/25 mt-1.5">
          Set YouTube videos to <strong className="text-white/40">Unlisted</strong> — not Private
        </p>
      </div>

      {/* Socials */}
      <div className="space-y-2.5">
        <label className="text-xs text-white/40 block">Social Links</label>
        {SOCIALS.map(({ key, icon, placeholder }) => (
          <div key={key} className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-sm flex-shrink-0">
              {icon}
            </span>
            <input
              className={inputCls}
              placeholder={placeholder}
              value={socials[key]}
              onChange={(e) => setSocials((s) => ({ ...s, [key]: e.target.value }))}
              inputMode="url"
            />
          </div>
        ))}
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
