"use client";

import { useEffect } from "react";
import { Player } from "@/lib/types";
import HeroSection from "@/components/sections/HeroSection";
import StatsBar from "@/components/sections/StatsBar";
import BioSection from "@/components/sections/BioSection";
import CareerStats from "@/components/sections/CareerStats";
import HighlightsSection from "@/components/sections/HighlightsSection";
import SocialFooter from "@/components/sections/SocialFooter";

export type EditSection = "info" | "details" | "stats" | "career" | "story" | "highlights" | "socials";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

interface EditChipProps {
  label: string;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

function EditChip({ label, onClick, className = "", style }: EditChipProps) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={`absolute ${className} z-30 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/20 rounded-full px-3 py-2 text-white/90 text-xs font-semibold active:scale-95 transition-transform`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      {label}
    </button>
  );
}

interface BuilderProfileProps {
  player: Player;
  onEdit: (section: EditSection) => void;
}

export default function BuilderProfile({ player, onEdit }: BuilderProfileProps) {
  useEffect(() => {
    const { r, g, b } = hexToRgb(player.themeColor);
    const blended = {
      r: Math.round(10 + (r - 10) * 0.25),
      g: Math.round(10 + (g - 10) * 0.25),
      b: Math.round(10 + (b - 10) * 0.25),
    };
    const color = `#${blended.r.toString(16).padStart(2, "0")}${blended.g.toString(16).padStart(2, "0")}${blended.b.toString(16).padStart(2, "0")}`;
    document.documentElement.style.backgroundColor = color;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", color);
    return () => {
      document.documentElement.style.backgroundColor = "";
    };
  }, [player.themeColor]);

  return (
    <main
      className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden pb-32"
      style={{ "--accent": player.themeColor } as React.CSSProperties}
    >
      {/* Hero — chip lower in the hero, not at the very top */}
      <div className="relative">
        <HeroSection player={player} />
        <EditChip label="Edit Info" onClick={() => onEdit("info")} className="bottom-36 right-4" />
      </div>

      {/* Stats — chip straddles the boundary between StatsBar and BioSection */}
      <div className="relative">
        <StatsBar stats={player.currentStats} />
        <EditChip label="Edit Stats" onClick={() => onEdit("stats")} className="left-4" style={{ bottom: "-30px" }} />
      </div>

      {/* About — two chips: Edit About (top-right) + Edit Details (bottom-left near detail grid) */}
      <div className="relative">
        <BioSection player={player} />
        <EditChip label="Edit About" onClick={() => onEdit("story")} className="top-10 right-4" />
      </div>

      {/* Career stats */}
      <div className="relative">
        {player.seasonHistory.length > 0 ? (
          <CareerStats seasons={player.seasonHistory} />
        ) : (
          <section className="px-5 py-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: player.themeColor }} />
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">Career Stats</h2>
            </div>
            <button
              onClick={() => onEdit("career")}
              className="w-full rounded-2xl border-2 border-dashed border-white/10 p-8 text-center active:border-white/30 transition-colors"
            >
              <p className="text-3xl mb-3">📊</p>
              <p className="text-white/50 font-semibold">Tap to add past seasons</p>
              <p className="text-white/25 text-sm mt-1">Show coaches your full career history</p>
            </button>
          </section>
        )}
        <EditChip label="Edit Career" onClick={() => onEdit("career")} className="top-10 right-4" />
      </div>

      {/* Highlights */}
      <div className="relative">
        {player.highlights.filter((h) => h.url).length > 0 ? (
          <HighlightsSection highlights={player.highlights.filter((h) => h.url)} />
        ) : (
          <section className="px-5 py-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: player.themeColor }} />
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">Highlights</h2>
            </div>
            <button
              onClick={() => onEdit("highlights")}
              className="w-full rounded-2xl border-2 border-dashed border-white/10 p-8 text-center active:border-white/30 transition-colors"
            >
              <p className="text-3xl mb-3">🎬</p>
              <p className="text-white/50 font-semibold">Tap to add your highlight reel</p>
              <p className="text-white/25 text-sm mt-1">YouTube or Vimeo links work great</p>
            </button>
          </section>
        )}
        <EditChip label="Edit Video" onClick={() => onEdit("highlights")} className="top-10 right-4" />
      </div>

      {/* Socials — chip at top-left, near the icons */}
      <div className="relative">
        <SocialFooter socialLinks={player.socialLinks} />
        <EditChip label="Edit Socials" onClick={() => onEdit("socials")} className="top-10 left-4" />
      </div>
    </main>
  );
}
