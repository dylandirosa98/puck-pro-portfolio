"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Player } from "@/lib/types";
import VideoModal from "@/components/VideoModal";
import PdfModal from "@/components/PdfModal";
import { detectVideo } from "@/lib/video";

function blendColor(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const bg = 10; // #0a
  const br = Math.round(bg + (r - bg) * opacity);
  const bgr = Math.round(bg + (g - bg) * opacity);
  const bb = Math.round(bg + (b - bg) * opacity);
  return `#${br.toString(16).padStart(2, "0")}${bgr.toString(16).padStart(2, "0")}${bb.toString(16).padStart(2, "0")}`;
}

interface HeroSectionProps {
  player: Player;
}

export default function HeroSection({ player }: HeroSectionProps) {
  const [showReel, setShowReel] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const reelVideo = player.highlightReelUrl ? detectVideo(player.highlightReelUrl) : null;
  const isGdrive = reelVideo?.platform === "gdrive-folder" || reelVideo?.platform === "gdrive-file";
  const topColor = blendColor(player.themeColor, 0.251);
  const midColor = blendColor(player.themeColor, 0.125);

  return (
    <>
      <section className="relative min-h-[50svh] lg:min-h-[75vh] flex items-end overflow-hidden" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        {/* Gradient background — solid block at top matches theme-color exactly, then fades */}
        <div
          className="absolute inset-0"
          style={{
            top: "calc(-1 * env(safe-area-inset-top, 0px))",
            background: `linear-gradient(to bottom, ${topColor} 0px, ${topColor} 44px, ${midColor} 40%, #0a0a0a 100%)`,
          }}
        />

        {/* Player cutout image */}
        <motion.div
          className="absolute inset-0 flex items-end justify-center lg:justify-end pointer-events-none"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative w-full max-w-[440px] lg:max-w-[520px] xl:max-w-[580px] h-[95%] lg:mr-[10%] xl:mr-[15%]">
            <Image
              src={player.heroImageUrl}
              alt={`${player.firstName} ${player.lastName}`}
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </motion.div>

        {/* Bottom gradient fade over the player image */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />

        {/* Left-side text shadow — sits behind text, improves readability over the player image */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/70 via-[#0a0a0a]/30 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative w-full px-5 pb-10 pt-20 z-10 lg:max-w-5xl lg:mx-auto lg:px-10 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Number */}
            <motion.span
              className="text-[8rem] lg:text-[12rem] leading-none font-black absolute bottom-0 right-4 lg:right-10 select-none"
              style={{ color: player.themeColor }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 0.3, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {player.number}
            </motion.span>

            {/* Name */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.9] tracking-tight">
              <span className="block text-white/40 text-2xl sm:text-3xl lg:text-4xl font-medium mb-1">
                {player.firstName}
              </span>
              {player.lastName}
            </h1>

            {/* Quick Info */}
            <motion.div
              className="flex gap-4 mt-5 text-xs lg:text-sm text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {player.team && <span>{player.team}</span>}
              {player.team && player.league && <span>|</span>}
              {player.league && <span>{player.league}</span>}
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex gap-3 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {player.highlightReelUrl && (
              isGdrive ? (
                <a
                  href={player.highlightReelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full text-xs lg:text-sm font-medium text-white bg-white/10 hover:bg-white/15 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <path d="M15 10l-4 4m0 0l-4-4m4 4V3M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
                  </svg>
                  Game Film
                </a>
              ) : (
                <button
                  onClick={() => setShowReel(true)}
                  className="flex items-center gap-1.5 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full text-xs lg:text-sm font-medium text-white bg-white/10 hover:bg-white/15 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Game Film
                </button>
              )
            )}
            {player.resumeUrl && (
              <button
                onClick={() => setShowResume(true)}
                className="flex items-center gap-1.5 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full text-xs lg:text-sm font-medium text-white/70 border border-white/15 hover:bg-white/5 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Resume
              </button>
            )}
            {player.transcriptUrl && (
              <a
                href={player.transcriptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full text-xs lg:text-sm font-medium text-white/70 border border-white/15 hover:bg-white/5 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
                Academics
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      {player.highlightReelUrl && !isGdrive && (
        <VideoModal
          url={player.highlightReelUrl}
          isOpen={showReel}
          onClose={() => setShowReel(false)}
        />
      )}

      {/* PDF Modal */}
      {player.resumeUrl && (
        <PdfModal
          url={player.resumeUrl}
          isOpen={showResume}
          onClose={() => setShowResume(false)}
        />
      )}
    </>
  );
}
