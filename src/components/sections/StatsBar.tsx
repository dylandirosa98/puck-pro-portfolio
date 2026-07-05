"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { PlayerStats } from "@/lib/types";

interface StatsBarProps {
  stats: PlayerStats;
  position?: string;
}

type StatItem = {
  key: keyof PlayerStats;
  label: string;
  suffix?: string;
  decimals?: number;
  prefixPlus?: boolean;
};

function AnimatedNumber({ value, suffix = "", decimals = 0, prefixPlus = false }: { value: number; suffix?: string; decimals?: number; prefixPlus?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  const rounded = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <span ref={ref}>
      {prefixPlus && value > 0 ? "+" : ""}
      {rounded}
      {suffix}
    </span>
  );
}

const playerStatItems: StatItem[] = [
  { key: "gamesPlayed", label: "GP" },
  { key: "goals", label: "G" },
  { key: "assists", label: "A" },
  { key: "points", label: "PTS" },
  { key: "plusMinus", label: "+/-", prefixPlus: true },
  { key: "pim", label: "PIM" },
];

const goalieStatItems: StatItem[] = [
  { key: "gamesPlayed", label: "GP" },
  { key: "wins", label: "W" },
  { key: "losses", label: "L" },
  { key: "goalsAgainstAverage", label: "GAA", decimals: 2 },
  { key: "savePercentage", label: "SV%", decimals: 3 },
  { key: "shutouts", label: "SO" },
];

export default function StatsBar({ stats, position }: StatsBarProps) {
  const statItems = position === "Goalie" ? goalieStatItems : playerStatItems;

  return (
    <section className="px-5 pt-6 pb-2 lg:max-w-4xl lg:mx-auto lg:pt-10 lg:pb-4">
      <motion.div
        className="grid grid-cols-6 gap-1 lg:gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {statItems.map((item, i) => {
          const value = Number(stats[item.key] ?? 0);
          return (
            <motion.div
              key={item.key}
              className="flex flex-col items-center justify-center bg-white/5 rounded-lg py-3 lg:py-5 lg:rounded-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className="text-lg lg:text-2xl font-black tabular-nums">
                <AnimatedNumber value={value} suffix={item.suffix} decimals={item.decimals} prefixPlus={item.prefixPlus} />
              </span>
              <span className="text-[10px] lg:text-xs text-white/40 font-medium tracking-wider mt-1">
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
