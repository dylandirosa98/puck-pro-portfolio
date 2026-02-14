"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Player } from "@/lib/types";

interface BioSectionProps {
  player: Player;
}

export default function BioSection({ player }: BioSectionProps) {
  return (
    <section className="px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-1 h-6 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">
            About
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Headshot */}
          <motion.div
            className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src={player.headshotUrl}
              alt={`${player.firstName} ${player.lastName}`}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Bio text */}
          <div className="flex-1">
            <p className="text-white/70 text-sm leading-relaxed">{player.bio}</p>

            {/* Quick details */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-5">
              {[
                { label: "Team", value: player.team },
                { label: "League", value: player.league },
                { label: "Position", value: player.position },
                { label: "Shoots", value: player.shoots },
                { label: "Height", value: player.height },
                { label: "Weight", value: player.weight },
              ].map((item) => (
                <div key={item.label} className="flex justify-between border-b border-white/5 py-2">
                  <span className="text-[11px] text-white/30 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
