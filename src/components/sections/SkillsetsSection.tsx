"use client";

import { motion } from "framer-motion";
import { Player } from "@/lib/types";

export default function SkillsetsSection({ player }: { player: Player }) {
  const skills = (player.skillsets ?? []).filter((s) => s && typeof s === "object" && s.name?.trim());
  if (skills.length === 0) return null;

  return (
    <section className="px-5 py-10 lg:max-w-4xl lg:mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">
            Player Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill, i) => (
            <motion.div
              key={i}
              className="rounded-xl p-5 border border-white/5 bg-white/[0.03]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: player.themeColor }}
                />
                <h3 className="text-sm font-bold text-white">{skill.name}</h3>
              </div>
              {skill.description.trim() && (
                <p className="text-xs text-white/50 leading-relaxed">{skill.description}</p>
              )}
              {skill.watchUrl?.trim() && (
                <a
                  href={skill.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ backgroundColor: `${player.themeColor}20`, color: player.themeColor }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Here
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
