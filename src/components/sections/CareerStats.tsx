"use client";

import { motion } from "framer-motion";
import { SeasonStats } from "@/lib/types";

interface CareerStatsProps {
  seasons: SeasonStats[];
}

export default function CareerStats({ seasons }: CareerStatsProps) {
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
            Career Stats
          </h2>
        </div>

        {/* Stats cards (mobile-friendly stacked cards instead of table) */}
        <div className="space-y-3">
          {seasons.map((season, i) => (
            <motion.div
              key={season.season}
              className="bg-white/5 rounded-xl p-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {/* Season header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-bold">{season.season}</span>
                  <span className="text-xs text-white/40 ml-2">
                    {season.team} &middot; {season.league}
                  </span>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: "var(--accent)", opacity: 0.8 }}
                >
                  {season.stats.points} PTS
                </span>
              </div>

              {/* Stat grid */}
              <div className="grid grid-cols-6 gap-2 text-center">
                {(
                  [
                    ["GP", season.stats.gamesPlayed],
                    ["G", season.stats.goals],
                    ["A", season.stats.assists],
                    ["PTS", season.stats.points],
                    ["+/-", season.stats.plusMinus],
                    ["PIM", season.stats.pim],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <div className="text-base font-bold tabular-nums">
                      {label === "+/-" && value > 0 ? "+" : ""}
                      {value}
                    </div>
                    <div className="text-[9px] text-white/30 uppercase tracking-wider">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
