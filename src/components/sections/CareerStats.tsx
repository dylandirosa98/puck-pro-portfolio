"use client";

import { motion } from "framer-motion";
import { SeasonStats } from "@/lib/types";

interface CareerStatsProps {
  seasons: SeasonStats[];
}

export default function CareerStats({ seasons }: CareerStatsProps) {
  return (
    <section className="px-5 py-12 lg:max-w-4xl lg:mx-auto lg:py-16">
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

        {/* Mobile: Stacked cards */}
        <div className="space-y-3 lg:hidden">
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

        {/* Desktop: Table */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40">
                  <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">Season</th>
                  <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">Team</th>
                  <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider">League</th>
                  <th className="text-center py-3 px-3 font-medium text-xs uppercase tracking-wider">GP</th>
                  <th className="text-center py-3 px-3 font-medium text-xs uppercase tracking-wider">G</th>
                  <th className="text-center py-3 px-3 font-medium text-xs uppercase tracking-wider">A</th>
                  <th className="text-center py-3 px-3 font-medium text-xs uppercase tracking-wider">PTS</th>
                  <th className="text-center py-3 px-3 font-medium text-xs uppercase tracking-wider">+/-</th>
                  <th className="text-center py-3 px-3 font-medium text-xs uppercase tracking-wider">PIM</th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((season, i) => (
                  <motion.tr
                    key={season.season}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                  >
                    <td className="py-3 px-4 font-bold">{season.season}</td>
                    <td className="py-3 px-4 text-white/70">{season.team}</td>
                    <td className="py-3 px-4 text-white/50">{season.league}</td>
                    <td className="py-3 px-3 text-center tabular-nums font-medium">{season.stats.gamesPlayed}</td>
                    <td className="py-3 px-3 text-center tabular-nums font-medium">{season.stats.goals}</td>
                    <td className="py-3 px-3 text-center tabular-nums font-medium">{season.stats.assists}</td>
                    <td className="py-3 px-3 text-center tabular-nums font-bold"
                      style={{ color: "var(--accent)" }}
                    >
                      {season.stats.points}
                    </td>
                    <td className="py-3 px-3 text-center tabular-nums font-medium text-white/70">
                      {season.stats.plusMinus > 0 ? "+" : ""}{season.stats.plusMinus}
                    </td>
                    <td className="py-3 px-3 text-center tabular-nums font-medium text-white/50">{season.stats.pim}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
