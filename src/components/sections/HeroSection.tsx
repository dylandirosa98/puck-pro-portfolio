"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Player } from "@/lib/types";

interface HeroSectionProps {
  player: Player;
}

export default function HeroSection({ player }: HeroSectionProps) {
  return (
    <section className="relative min-h-[50svh] flex items-end overflow-hidden" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      {/* Gradient background — covers full area including iOS safe area */}
      <div
        className="absolute inset-0"
        style={{
          top: "calc(-1 * env(safe-area-inset-top, 0px))",
          background: `linear-gradient(to bottom, ${player.themeColor}40 0%, ${player.themeColor}20 40%, #0a0a0a 100%)`,
        }}
      />

      {/* Player cutout image */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative w-full max-w-[440px] h-[95%]">
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

      {/* Content */}
      <div className="relative w-full px-5 pb-10 pt-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Number */}
          <motion.span
            className="text-[8rem] leading-none font-black absolute bottom-0 right-4 select-none"
            style={{ color: player.themeColor }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 0.3, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {player.number}
          </motion.span>

          {/* Name */}
          <h1 className="text-5xl sm:text-7xl font-black leading-[0.9] tracking-tight">
            <span className="block text-white/60 text-2xl sm:text-3xl font-medium mb-1">
              {player.firstName}
            </span>
            {player.lastName}
          </h1>

          {/* Quick Info */}
          <motion.div
            className="flex gap-4 mt-5 text-xs text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span>{player.position}</span>
            <span>|</span>
            <span>{player.height}</span>
            <span>|</span>
            <span>Shoots {player.shoots}</span>
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
            <a
              href={player.highlightReelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white bg-white/10 hover:bg-white/15 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M8 5v14l11-7z" />
              </svg>
              Highlights
            </a>
          )}
          {player.resumeUrl && (
            <a
              href={player.resumeUrl}
              download
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white/70 border border-white/15 hover:bg-white/5 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Resume
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
