"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Highlight } from "@/lib/types";
import { detectVideo } from "@/lib/video";

function VideoCard({ highlight }: { highlight: Highlight }) {
  const [playing, setPlaying] = useState(false);
  const video = detectVideo(highlight.url);

  // YouTube: thumbnail preview → click to play
  if (video.platform === "youtube") {
    if (playing) {
      return (
        <VideoWrapper title={highlight.title}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoWrapper>
      );
    }
    return (
      <ThumbnailPreview
        title={highlight.title}
        thumbnailUrl={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
        onPlay={() => setPlaying(true)}
      />
    );
  }

  // Vimeo: direct embed (Vimeo's player has its own built-in thumbnail + play button)
  if (video.platform === "vimeo") {
    return (
      <VideoWrapper title={highlight.title}>
        <iframe
          src={`https://player.vimeo.com/video/${video.id}?title=0&byline=0&portrait=0`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </VideoWrapper>
    );
  }

  // Wistia: direct embed (Wistia's player has its own built-in thumbnail + play button)
  if (video.platform === "wistia") {
    return (
      <VideoWrapper title={highlight.title}>
        <iframe
          src={`https://fast.wistia.net/embed/iframe/${video.id}?seo=true&videoFoam=false`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </VideoWrapper>
    );
  }

  // Unknown platform: link out
  return (
    <div>
      <a
        href={highlight.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full aspect-video flex items-center justify-center bg-white/5 group"
      >
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center mx-auto mb-2 transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5 text-white/70">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="text-xs text-white/40">Watch Video</span>
        </div>
      </a>
      <div className="px-4 py-3">
        <h3 className="text-sm font-medium">{highlight.title}</h3>
      </div>
    </div>
  );
}

function VideoWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="relative w-full aspect-video">{children}</div>
      <div className="px-4 py-3">
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
    </div>
  );
}

function ThumbnailPreview({
  title,
  thumbnailUrl,
  onPlay,
}: {
  title: string;
  thumbnailUrl: string;
  onPlay: () => void;
}) {
  return (
    <div>
      <button
        onClick={onPlay}
        className="relative w-full aspect-video group cursor-pointer block"
      >
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
          <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transition-colors shadow-lg">
            <svg viewBox="0 0 24 24" fill="#0a0a0a" className="w-7 h-7 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>
      <div className="px-4 py-3">
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
    </div>
  );
}

interface HighlightsSectionProps {
  highlights: Highlight[];
}

export default function HighlightsSection({ highlights }: HighlightsSectionProps) {
  if (highlights.length === 0) return null;

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
            Highlights
          </h2>
        </div>

        {/* Video cards */}
        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-5">
          {highlights.map((highlight, i) => (
            <motion.div
              key={highlight.url}
              className="rounded-xl overflow-hidden bg-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <VideoCard highlight={highlight} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
