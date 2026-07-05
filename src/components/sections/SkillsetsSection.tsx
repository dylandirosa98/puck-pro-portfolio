"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { Player, Skillset } from "@/lib/types";
import VideoModal from "@/components/VideoModal";
import { detectVideo, getEmbedUrl, getMuxPlaybackId, getMuxThumbnailUrl } from "@/lib/video";

function SkillVideo({ skill, themeColor }: { skill: Skillset; themeColor: string }) {
  const [showModal, setShowModal] = useState(false);
  const url = skill.watchUrl ?? "";
  const video = detectVideo(url);
  const embedUrl = getEmbedUrl(video);
  const muxPlaybackId = getMuxPlaybackId(url, skill.muxPlaybackId);
  const thumbnailUrl = skill.thumbnailUrl || (muxPlaybackId ? getMuxThumbnailUrl(muxPlaybackId) : "");
  const display = skill.videoDisplay ?? "button";

  if (!url.trim() && !muxPlaybackId) return null;

  if (display === "embed") {
    return (
      <div className="mt-4 relative w-full aspect-video rounded-lg overflow-hidden bg-black">
        {muxPlaybackId ? (
          <MuxPlayer
            playbackId={muxPlaybackId}
            metadata={{ video_title: skill.name || "Player profile video" }}
            className="absolute inset-0 h-full w-full"
            style={{ height: "100%", width: "100%" }}
          />
        ) : embedUrl ? (
          <iframe
            src={embedUrl.replace("autoplay=1", "autoplay=0")}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="absolute inset-0 flex items-center justify-center bg-white/5 group"
          >
            {thumbnailUrl && (
              <Image src={thumbnailUrl} alt={skill.name} fill className="object-cover" unoptimized />
            )}
            <span className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
        )}
        <VideoModal url={url} playbackId={skill.muxPlaybackId} title={skill.name} isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
          <path d="M8 5v14l11-7z" />
        </svg>
        Watch Here
      </button>
      <VideoModal url={url} playbackId={skill.muxPlaybackId} title={skill.name} isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

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
              <SkillVideo skill={skill} themeColor={player.themeColor} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
