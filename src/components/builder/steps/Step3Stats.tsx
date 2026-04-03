"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { WizardState } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface Props {
  data: WizardState;
  slug: string;
  onNext: (partial: Partial<WizardState>) => void;
  onBack: () => void;
  saving: boolean;
}

const SWATCHES = ["#b91c1c", "#1d4ed8", "#15803d", "#7c3aed", "#c2410c", "#0f766e", "#b45309", "#be185d"];

export default function Step3Photos({ data, slug, onNext, onBack, saving }: Props) {
  const supabase = createClient();
  const headshotRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);

  const [headshotUrl, setHeadshotUrl] = useState(data.headshotUrl || "");
  const [heroImageUrl, setHeroImageUrl] = useState(data.heroImageUrl || "");
  const [heroMode, setHeroMode] = useState<"remove" | "own">("remove");
  const [themeColor, setThemeColor] = useState(data.themeColor || "#b91c1c");
  const [uploadingHeadshot, setUploadingHeadshot] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  async function handleHeadshotChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeadshot(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${slug || "temp"}/headshot.${ext}`;
      await supabase.storage.from("player-images").upload(path, file, { upsert: true });
      const { data: urlData } = supabase.storage.from("player-images").getPublicUrl(path);
      setHeadshotUrl(urlData.publicUrl);
    } catch { alert("Upload failed"); }
    finally { setUploadingHeadshot(false); }
  }

  async function handleHeroChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    try {
      if (heroMode === "remove") {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("slug", slug || "temp");
        const res = await fetch("/api/remove-bg", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setHeroImageUrl(json.url);
      } else {
        const ext = file.name.split(".").pop();
        const path = `${slug || "temp"}/hero.${ext}`;
        await supabase.storage.from("player-images").upload(path, file, { upsert: true });
        const { data: urlData } = supabase.storage.from("player-images").getPublicUrl(path);
        setHeroImageUrl(urlData.publicUrl);
      }
    } catch { alert("Upload failed"); }
    finally { setUploadingHero(false); }
  }

  const hasHeadshot = headshotUrl && !headshotUrl.includes("placeholder");
  const hasHero = heroImageUrl && !heroImageUrl.includes("placeholder");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Photos & Color</h2>
        <p className="text-white/40 text-sm">Add your photos and pick your accent color</p>
      </div>

      {/* Headshot + Hero side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Headshot */}
        <div>
          <label className="text-xs text-white/40 mb-2 block">Headshot</label>
          <button
            type="button"
            onClick={() => !uploadingHeadshot && headshotRef.current?.click()}
            className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 active:bg-white/10 transition-colors flex items-center justify-center"
          >
            {hasHeadshot ? (
              <Image src={headshotUrl} alt="Headshot" fill className="object-cover" unoptimized />
            ) : (
              <span className="text-white/30 text-2xl">{uploadingHeadshot ? "⏳" : "+"}</span>
            )}
            {uploadingHeadshot && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              </div>
            )}
          </button>
          <p className="text-[10px] text-white/25 mt-1 text-center">Face photo</p>
          <input ref={headshotRef} type="file" accept="image/*" onChange={handleHeadshotChange} className="hidden" />
        </div>

        {/* Hero */}
        <div>
          <label className="text-xs text-white/40 mb-2 block">Background</label>
          <button
            type="button"
            onClick={() => !uploadingHero && heroRef.current?.click()}
            className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 active:bg-white/10 transition-colors flex items-center justify-center"
          >
            {hasHero ? (
              <Image src={heroImageUrl} alt="Hero" fill className="object-cover" unoptimized />
            ) : (
              <span className="text-white/30 text-2xl">{uploadingHero ? "⏳" : "+"}</span>
            )}
            {uploadingHero && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              </div>
            )}
          </button>
          <p className="text-[10px] text-white/25 mt-1 text-center">Full body</p>
          <input ref={heroRef} type="file" accept="image/*" onChange={handleHeroChange} className="hidden" />
        </div>
      </div>

      {/* Hero mode toggle */}
      <div>
        <label className="text-xs text-white/40 mb-2 block">Background photo option</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setHeroMode("remove")}
            className={`py-3 rounded-2xl border text-xs font-semibold transition-all active:scale-95 leading-snug px-2 ${
              heroMode === "remove" ? "bg-[#b91c1c] border-[#b91c1c] text-white" : "bg-white/5 border-white/10 text-white/50"
            }`}
          >
            Remove background for me
          </button>
          <button
            type="button"
            onClick={() => setHeroMode("own")}
            className={`py-3 rounded-2xl border text-xs font-semibold transition-all active:scale-95 leading-snug px-2 ${
              heroMode === "own" ? "bg-[#b91c1c] border-[#b91c1c] text-white" : "bg-white/5 border-white/10 text-white/50"
            }`}
          >
            I have a transparent PNG
          </button>
        </div>
        {heroMode === "remove" ? (
          <p className="text-[11px] text-amber-400/70 mt-2 leading-snug">
            ⚠ Must be solo — other players in the photo will show up in your background
          </p>
        ) : (
          <p className="text-[11px] text-white/30 mt-2 leading-snug">
            Use a <strong className="text-white/50">PNG with transparent background</strong> for best results
          </p>
        )}
      </div>

      {/* Color swatches */}
      <div>
        <label className="text-xs text-white/40 mb-2 block">Accent Color</label>
        <div className="flex gap-2.5">
          {SWATCHES.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setThemeColor(color)}
              style={{ backgroundColor: color }}
              className={`w-8 h-8 rounded-full flex-shrink-0 transition-all active:scale-95 ${
                themeColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a] scale-110" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 font-bold text-sm active:bg-white/10 transition-all"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => onNext({ headshotUrl, heroImageUrl, themeColor })}
          disabled={saving}
          className="flex-1 py-4 bg-[#b91c1c] hover:bg-[#991b1b] active:scale-95 rounded-2xl text-white font-bold text-sm transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : "Next →"}
        </button>
      </div>
    </div>
  );
}
