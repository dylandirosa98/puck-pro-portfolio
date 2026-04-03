"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function PreviewBanner() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="max-w-lg mx-auto bg-[#111]/95 border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/60 backdrop-blur-md">
        <p className="text-white/55 text-xs text-center mb-3 leading-relaxed">
          This is your <strong className="text-white/80">private preview</strong>.
          Upgrade to publish, share with coaches, and get your own domain.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/builder")}
            className="flex-1 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white/60 text-sm font-medium active:scale-95 transition-all"
          >
            Edit
          </button>
          <button
            onClick={() => router.push("/builder/upgrade")}
            className="flex-[2] py-3.5 bg-[#b91c1c] hover:bg-[#991b1b] active:scale-95 rounded-2xl text-white text-sm font-bold transition-all"
          >
            Make It Public — $29/mo
          </button>
        </div>
      </div>
    </motion.div>
  );
}
