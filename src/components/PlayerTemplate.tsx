"use client";

import { Player } from "@/lib/types";
import HeroSection from "./sections/HeroSection";
import StatsBar from "./sections/StatsBar";
import BioSection from "./sections/BioSection";
import CareerStats from "./sections/CareerStats";
import HighlightsSection from "./sections/HighlightsSection";
import SocialFooter from "./sections/SocialFooter";

interface PlayerTemplateProps {
  player: Player;
}

export default function PlayerTemplate({ player }: PlayerTemplateProps) {
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
