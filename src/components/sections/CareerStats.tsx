"use client";

import { motion } from "framer-motion";
import { PlayerStats, SeasonStats } from "@/lib/types";
import { isGoalie } from "@/lib/hockey";

interface CareerStatsProps {
  seasons: SeasonStats[];
  position: string;
}

type StatItem = {
  key: keyof PlayerStats;
  label: string;
  decimals?: number;
  prefixPlus?: boolean;
  accent?: boolean;
};

const playerStatItems: StatItem[] = [
  { key: "gamesPlayed", label: "GP" },
  { key: "goals", label: "G" },
  { key: "assists", label: "A" },
  { key: "points", label: "PTS", accent: true },
  { key: "plusMinus", label: "+/-", prefixPlus: true },
  { key: "pim", label: "PIM" },
];

const goalieStatItems: StatItem[] = [
  { key: "gamesPlayed", label: "GP" },
  { key: "wins", label: "W", accent: true },
  { key: "losses", label: "L" },
  { key: "goalsAgainstAverage", label: "GAA", decimals: 2 },
  { key: "savePercentage", label: "SV%", decimals: 3 },
  { key: "shutouts", label: "SO" },
];

function formatStat(stats: PlayerStats, item: StatItem) {
  const value = Number(stats[item.key] ?? 0);
  const formatted = item.decimals !== undefined ? value.toFixed(item.decimals) : Math.round(value).toString();
  return `${item.prefixPlus && value > 0 ? "+" : ""}${formatted}`;
}

export default function CareerStats({ seasons, position }: CareerStatsProps) {
  const goalie = isGoalie(position);
  const statItems = goalie ? goalieStatItems : playerStatItems;
  const featuredStat = goalie ? goalieStatItems[3] : playerStatItems[3];

  return (
    <section className="px-5 py-12 lg:max-w-4xl lg:mx-auto lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-1 h-6 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">
            Career Stats
          </h2>
        </div>

        <div className="space-y-3 lg:hidden">
          {seasons.map((season, i) => (
            <motion.div
              key={`${season.season}-${season.team}-${season.league}-${i}`}
              className="bg-white/5 rounded-xl p-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="min-w-0">
                  <span className="text-sm font-bold">{season.season}</span>
                  <div className="text-xs text-white/40 truncate">
                    {season.team} &middot; {season.league}
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: "var(--accent)", opacity: 0.8 }}
                >
                  {formatStat(season.stats, featuredStat)} {featuredStat.label}
                </span>
              </div>

              <div className="grid grid-cols-6 gap-2 text-center">
                {statItems.map((item) => (
                  <div key={item.key}>
                    <div className="text-base font-bold tabular-nums">
                      {formatStat(season.stats, item)}
                    </div>
                    <div className="text-[9px] text-white/30 uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

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
                  {statItems.map((item) => (
                    <th key={item.key} className="text-center py-3 px-3 font-medium text-xs uppercase tracking-wider">{item.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {seasons.map((season, i) => (
                  <motion.tr
                    key={`${season.season}-${season.team}-${season.league}-${i}`}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                  >
                    <td className="py-3 px-4 font-bold">{season.season}</td>
                    <td className="py-3 px-4 text-white/70">{season.team}</td>
                    <td className="py-3 px-4 text-white/50">{season.league}</td>
                    {statItems.map((item) => (
                      <td
                        key={item.key}
                        className={`py-3 px-3 text-center tabular-nums ${item.accent ? "font-bold" : "font-medium text-white/70"}`}
                        style={item.accent ? { color: "var(--accent)" } : undefined}
                      >
                        {formatStat(season.stats, item)}
                      </td>
                    ))}
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
