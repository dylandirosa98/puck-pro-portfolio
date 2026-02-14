"use client";

import { useEffect } from "react";
import { Player } from "@/lib/types";
import HeroSection from "./sections/HeroSection";
import StatsBar from "./sections/StatsBar";
import BioSection from "./sections/BioSection";
import CareerStats from "./sections/CareerStats";
import HighlightsSection from "./sections/HighlightsSection";
import SocialFooter from "./sections/SocialFooter";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

interface PlayerTemplateProps {
  player: Player;
}

export default function PlayerTemplate({ player }: PlayerTemplateProps) {
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
      className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden"
      style={{ "--accent": player.themeColor } as React.CSSProperties}
    >
      <HeroSection player={player} />
      <StatsBar stats={player.currentStats} />
      <BioSection player={player} />
      <CareerStats seasons={player.seasonHistory} />
      <HighlightsSection highlights={player.highlights} />
      <SocialFooter socialLinks={player.socialLinks} />
    </main>
  );
}
