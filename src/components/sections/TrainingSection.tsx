"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Player } from "@/lib/types";
import VideoModal from "@/components/VideoModal";
import { detectVideo, getEmbedUrl } from "@/lib/video";

export default function TrainingSection({ player }: { player: Player }) {
  const [showVideo, setShowVideo] = useState(false);
  if (!player.trainingVideoUrl && !player.trainingDescription) return null;

  const video = player.trainingVideoUrl ? detectVideo(player.trainingVideoUrl) : null;
  const embedUrl = video ? getEmbedUrl(video) : null;

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
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-white/50">Training</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 lg:gap-10 items-start">
          {/* Video thumbnail / embed */}
          {player.trainingVideoUrl && (
            <motion.div
              className="relative w-full sm:w-64 lg:w-80 flex-shrink-0 aspect-video rounded-xl overflow-hidden bg-white/5 cursor-pointer group"
              onClick={() => setShowVideo(true)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {embedUrl ? (
                <iframe
                  src={embedUrl.replace("autoplay=1", "autoplay=0")}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${player.themeColor}40` }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ color: player.themeColor }}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center opacity-90"
                  style={{ backgroundColor: player.themeColor }}
                >
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}

          {/* Description */}
          {player.trainingDescription && (
            <div className="flex-1">
              <p className="text-white/70 text-sm lg:text-base leading-relaxed">
                {player.trainingDescription}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {player.trainingVideoUrl && (
        <VideoModal
          url={player.trainingVideoUrl}
          isOpen={showVideo}
          onClose={() => setShowVideo(false)}
        />
      )}
    </section>
  );
}
