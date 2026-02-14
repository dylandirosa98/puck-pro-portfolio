"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Highlight } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPlayer = dynamic(() => import("react-player") as any, { ssr: false }) as any;

interface HighlightsSectionProps {
  highlights: Highlight[];
}

export default function HighlightsSection({ highlights }: HighlightsSectionProps) {
  if (highlights.length === 0) return null;

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
            Highlights
          </h2>
        </div>

        {/* Video cards */}
        <div className="space-y-4">
          {highlights.map((highlight, i) => (
            <motion.div
              key={i}
              className="rounded-xl overflow-hidden bg-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              {/* Video player */}
              <div className="relative w-full aspect-video">
                <ReactPlayer
                  url={highlight.url}
                  width="100%"
                  height="100%"
                  light
                  controls
                  playing={false}
                />
              </div>
              {/* Title */}
              <div className="px-4 py-3">
                <h3 className="text-sm font-medium">{highlight.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
