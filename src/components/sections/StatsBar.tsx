"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { PlayerStats } from "@/lib/types";

interface StatsBarProps {
  stats: PlayerStats;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
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
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {value >= 0 && suffix === "±" ? (display > 0 ? "+" : "") : ""}
      {display}
    </span>
  );
}

const statItems: { key: keyof PlayerStats; label: string; suffix?: string }[] = [
  { key: "gamesPlayed", label: "GP" },
  { key: "goals", label: "G" },
  { key: "assists", label: "A" },
  { key: "points", label: "PTS" },
  { key: "plusMinus", label: "+/-", suffix: "±" },
  { key: "pim", label: "PIM" },
];

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <section className="px-5 pt-6 pb-2 lg:max-w-4xl lg:mx-auto lg:pt-10 lg:pb-4">
      <motion.div
        className="grid grid-cols-6 gap-1 lg:gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {statItems.map((item, i) => (
          <motion.div
            key={item.key}
            className="flex flex-col items-center justify-center bg-white/5 rounded-lg py-3 lg:py-5 lg:rounded-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <span className="text-lg lg:text-2xl font-black tabular-nums">
              <AnimatedNumber value={stats[item.key]} suffix={item.suffix} />
            </span>
            <span className="text-[10px] lg:text-xs text-white/40 font-medium tracking-wider mt-1">
              {item.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
