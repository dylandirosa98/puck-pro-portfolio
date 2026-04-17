"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { MediaItem } from "@/lib/types";
import { detectVideo } from "@/lib/video";
import VideoModal from "@/components/VideoModal";

function MediaSlide({ item, accentColor }: { item: MediaItem; accentColor: string }) {
  const [showModal, setShowModal] = useState(false);

  if (item.type === "photo") {
    return (
      <div className="w-full">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white/5">
          <Image src={item.url} alt={item.title ?? ""} fill className="object-cover" unoptimized />
        </div>
        {item.title && (
          <p className="mt-3 text-sm font-medium text-white/60 text-center">{item.title}</p>
        )}
      </div>
    );
  }

  const video = detectVideo(item.url);

  return (
    <div className="w-full">
      <div
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-black cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        {video.platform === "youtube" ? (
          <Image
            src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
            alt={item.title ?? ""}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-white/5" />
        )}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: accentColor }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      {item.title && (
        <p className="mt-3 text-sm font-medium text-white/60 text-center">{item.title}</p>
      )}
      <VideoModal url={item.url} isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

interface MediaCarouselProps {
  items: MediaItem[];
  accentColor: string;
}

export default function MediaCarousel({ items, accentColor }: MediaCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (items.length === 0) return null;

  function go(next: number) {
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  }
  function prev() { if (index > 0) go(index - 1); }
  function next() { if (index < items.length - 1) go(index + 1); }

  return (
    <div>
      {items.length > 1 && (
        <div className="flex justify-end mb-3">
          <span className="text-xs text-white/30">{index + 1} / {items.length}</span>
        </div>
      )}

      <div
        className="relative overflow-hidden"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (diff > 50) next();
          else if (diff < -50) prev();
          touchStartX.current = null;
        }}
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <MediaSlide item={items[index]} accentColor={accentColor} />
          </motion.div>
        </AnimatePresence>
      </div>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            onClick={prev}
            disabled={index === 0}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === index ? "20px" : "6px",
                  height: "6px",
                  backgroundColor: i === index ? accentColor : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
          <button
            onClick={next}
            disabled={index === items.length - 1}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
