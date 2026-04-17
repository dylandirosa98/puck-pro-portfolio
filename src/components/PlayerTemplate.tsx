"use client";

import { useEffect } from "react";
import { Player } from "@/lib/types";
import HeroSection from "./sections/HeroSection";
import StatsBar from "./sections/StatsBar";
import BioSection from "./sections/BioSection";
import SkillsetsSection from "./sections/SkillsetsSection";
import InterestsSection from "./sections/InterestsSection";
import TrainingSection from "./sections/TrainingSection";
import CareerStats from "./sections/CareerStats";
import HighlightsSection from "./sections/HighlightsSection";
import TimelineSection from "./sections/TimelineSection";
import SocialFooter from "./sections/SocialFooter";

const DEFAULT_ORDER = ["about", "skillsets", "interests", "training", "timeline", "career-stats", "highlights"];

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

  const rawOrder = player.sectionOrder && player.sectionOrder.length > 0
    ? player.sectionOrder
    : DEFAULT_ORDER;
  const order = rawOrder
    .filter((k) => k !== "stats")
    .concat(rawOrder.includes("about") ? [] : ["about"])
    .concat(DEFAULT_ORDER.filter((k) => !rawOrder.includes(k))) // add newly-added sections
    .filter((k, i, arr) => arr.indexOf(k) === i); // dedupe

  const infoItems = [
    { label: "Position", value: player.position },
    { label: "Shoots", value: player.shoots },
    { label: "Height", value: player.height },
    { label: "Weight", value: player.weight },
  ].filter((item) => item.value);

  function renderSection(key: string) {
    switch (key) {
      case "about":
        return <BioSection key="about" player={player} />;
      case "skillsets":
        return <SkillsetsSection key="skillsets" player={player} />;
      case "interests":
        return <InterestsSection key="interests" player={player} />;
      case "training":
        return <TrainingSection key="training" player={player} />;
      case "career-stats":
        return player.seasonHistory.length > 0
          ? <CareerStats key="career-stats" seasons={player.seasonHistory} />
          : null;
      case "highlights":
        return <HighlightsSection key="highlights" highlights={player.highlights} />;
      case "timeline":
        return <TimelineSection key="timeline" player={player} />;
      default:
        return null;
    }
  }

  return (
    <main
      className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden"
      style={{ "--accent": player.themeColor } as React.CSSProperties}
    >
      <HeroSection player={player} />

      {/* Player info strip */}
      {infoItems.length > 0 && (
        <div className="px-5 pt-4 pb-1 lg:max-w-4xl lg:mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-0">
            {infoItems.map((item) => (
              <div key={item.label} className="flex justify-between items-baseline gap-3 border-b border-white/5 py-2 min-w-0">
                <span className="text-[11px] text-white/30 uppercase tracking-wider flex-shrink-0">
                  {item.label}
                </span>
                <span className="text-sm font-medium text-right truncate">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(player.showStatsBar ?? true) && <StatsBar stats={player.currentStats} />}
      {order.map(renderSection)}
      <SocialFooter socialLinks={player.socialLinks} />
    </main>
  );
}
