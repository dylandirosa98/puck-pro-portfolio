"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WizardState, SocialLink, SeasonStats } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { EditSection } from "./BuilderProfile";

interface EditorSheetProps {
  section: EditSection | null;
  data: WizardState;
  slug: string;
  onChange: (updates: Partial<WizardState>) => void;
  onClose: () => void;
}

const SECTION_LABELS: Record<EditSection, string> = {
  info: "Player Info",
  details: "Team & Details",
  stats: "This Season",
  career: "Career Stats",
  story: "Your Story",
  highlights: "Highlights",
  socials: "Socials & Resume",
};

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors";
const labelClass = "text-xs text-white/40 mb-1.5 block";

// ─── Info Editor ───────────────────────────────────────────────────────────

const THEME_COLORS = [
  "#b91c1c",
  "#1d4ed8",
  "#15803d",
  "#7c3aed",
  "#c2410c",
  "#0f766e",
  "#b45309",
  "#be185d",
];

function InfoEditor({
  data,
  onChange,
}: {
  data: WizardState;
  onChange: (u: Partial<WizardState>) => void;
}) {
  return (
    <div className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>First Name</label>
          <input
            className={inputClass}
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="First"
          />
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input
            className={inputClass}
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            placeholder="Last"
          />
        </div>
      </div>

      {/* Position */}
      <div>
        <label className={labelClass}>Position</label>
        <div className="grid grid-cols-3 gap-2">
          {(["Forward", "Defense", "Goalie"] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => onChange({ position: pos })}
              className={`py-3 rounded-2xl text-sm font-semibold border transition-colors ${
                data.position === pos
                  ? "bg-white/15 border-white/30 text-white"
                  : "bg-white/5 border-white/10 text-white/50"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Number + Shoots */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Number</label>
          <input
            type="number"
            className={inputClass}
            value={data.number || ""}
            onChange={(e) => onChange({ number: Number(e.target.value) })}
            placeholder="00"
          />
        </div>
        <div>
          <label className={labelClass}>Shoots</label>
          <div className="grid grid-cols-2 gap-2">
            {(["Left", "Right"] as const).map((side) => (
              <button
                key={side}
                onClick={() => onChange({ shoots: side })}
                className={`py-3.5 rounded-2xl text-sm font-semibold border transition-colors ${
                  data.shoots === side
                    ? "bg-white/15 border-white/30 text-white"
                    : "bg-white/5 border-white/10 text-white/50"
                }`}
              >
                {side}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Color */}
      <div>
        <label className={labelClass}>Theme Color</label>
        <div className="flex gap-3 flex-wrap">
          {THEME_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onChange({ themeColor: color })}
              className={`w-10 h-10 rounded-full border-2 transition-all active:scale-90 ${
                data.themeColor === color ? "border-white scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              aria-label={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Details Editor ────────────────────────────────────────────────────────

function DetailsEditor({
  data,
  onChange,
}: {
  data: WizardState;
  onChange: (u: Partial<WizardState>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Team</label>
          <input
            className={inputClass}
            value={data.team}
            onChange={(e) => onChange({ team: e.target.value })}
            placeholder="Your Team"
          />
        </div>
        <div>
          <label className={labelClass}>League</label>
          <input
            className={inputClass}
            value={data.league}
            onChange={(e) => onChange({ league: e.target.value })}
            placeholder="USHL"
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Hometown</label>
        <input
          className={inputClass}
          value={data.hometown}
          onChange={(e) => onChange({ hometown: e.target.value })}
          placeholder="City, ST"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Height</label>
          <input
            className={inputClass}
            value={data.height}
            onChange={(e) => onChange({ height: e.target.value })}
            placeholder={`6'1"`}
          />
        </div>
        <div>
          <label className={labelClass}>Weight</label>
          <input
            className={inputClass}
            value={data.weight}
            onChange={(e) => onChange({ weight: e.target.value })}
            placeholder="185 lbs"
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Birth Year</label>
        <input
          type="number"
          className={inputClass}
          value={data.birthYear || ""}
          onChange={(e) => onChange({ birthYear: Number(e.target.value) })}
          placeholder="2006"
        />
      </div>
    </div>
  );
}

// ─── Stats Editor ──────────────────────────────────────────────────────────

const STAT_FIELDS: { key: keyof WizardState["currentStats"]; label: string }[] = [
  { key: "gamesPlayed", label: "GP" },
  { key: "goals", label: "Goals" },
  { key: "assists", label: "Assists" },
  { key: "points", label: "Points" },
  { key: "plusMinus", label: "+/-" },
  { key: "pim", label: "PIM" },
];

function StatsEditor({
  data,
  onChange,
}: {
  data: WizardState;
  onChange: (u: Partial<WizardState>) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {STAT_FIELDS.map(({ key, label }) => (
        <div key={key}>
          <label className={labelClass}>{label}</label>
          <input
            type="number"
            className={inputClass}
            value={data.currentStats[key] ?? ""}
            onChange={(e) =>
              onChange({
                currentStats: { ...data.currentStats, [key]: Number(e.target.value) },
              })
            }
            placeholder="0"
          />
        </div>
      ))}
    </div>
  );
}

// ─── Story Editor ──────────────────────────────────────────────────────────

function StoryEditor({
  data,
  slug,
  onChange,
}: {
  data: WizardState;
  slug: string;
  onChange: (u: Partial<WizardState>) => void;
}) {
  const headshotRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);
  const [uploadingHeadshot, setUploadingHeadshot] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  async function handleHeadshotUpload(file: File) {
    setUploadingHeadshot(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${slug || "temp"}/headshot.${ext}`;
      const supabase = createClient();
      const { data: uploadData, error } = await supabase.storage
        .from("player-images")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from("player-images")
        .getPublicUrl(uploadData.path);
      onChange({ headshotUrl: urlData.publicUrl });
    } catch (err) {
      console.error("Headshot upload failed", err);
    } finally {
      setUploadingHeadshot(false);
    }
  }

  async function handleHeroUpload(file: File) {
    setUploadingHero(true);
    try {
      // Try remove-bg endpoint first
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/remove-bg", { method: "POST", body: formData });
      let blob: Blob;
      if (res.ok) {
        blob = await res.blob();
      } else {
        blob = file;
      }
      const ext = res.ok ? "png" : (file.name.split(".").pop() ?? "jpg");
      const path = `${slug || "temp"}/hero.${ext}`;
      const supabase = createClient();
      const { data: uploadData, error } = await supabase.storage
        .from("player-images")
        .upload(path, blob, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from("player-images")
        .getPublicUrl(uploadData.path);
      onChange({ heroImageUrl: urlData.publicUrl });
    } catch (err) {
      console.error("Hero upload failed", err);
    } finally {
      setUploadingHero(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Bio textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={labelClass} style={{ marginBottom: 0 }}>
            Your Story
          </label>
          <span className="text-xs text-white/25">{data.bio.length}/500</span>
        </div>
        <textarea
          className={`${inputClass} resize-none`}
          rows={5}
          maxLength={500}
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Tell your story..."
        />
      </div>

      {/* Photo uploads */}
      <div>
        <label className={labelClass}>Photos</label>
        <div className="flex gap-3 items-start">
          {/* Headshot preview + upload */}
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.headshotUrl || "/images/silhouette-headshot.svg"}
                alt="Headshot"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              ref={headshotRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleHeadshotUpload(file);
              }}
            />
            <button
              onClick={() => headshotRef.current?.click()}
              disabled={uploadingHeadshot}
              className="text-xs px-3 py-2 rounded-full bg-white/10 text-white/70 active:bg-white/20 disabled:opacity-50 transition-colors"
            >
              {uploadingHeadshot ? "Uploading..." : "Headshot"}
            </button>
          </div>

          {/* Hero image upload */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.heroImageUrl || "/images/silhouette-hero.svg"}
                alt="Hero"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              ref={heroRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleHeroUpload(file);
              }}
            />
            <button
              onClick={() => heroRef.current?.click()}
              disabled={uploadingHero}
              className="text-xs px-3 py-2 rounded-full bg-white/10 text-white/70 active:bg-white/20 disabled:opacity-50 transition-colors"
            >
              {uploadingHero ? "Removing BG..." : "Hero Photo"}
            </button>
          </div>
        </div>
        <p className="text-xs text-white/25 mt-2">
          Hero photo will have background removed automatically.
        </p>
      </div>

      {/* Team & Details */}
      <div className="pt-2 border-t border-white/5 space-y-4">
        <label className={labelClass}>Team & Details</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Team</label>
            <input className={inputClass} value={data.team} onChange={(e) => onChange({ team: e.target.value })} placeholder="Your Team" />
          </div>
          <div>
            <label className={labelClass}>League</label>
            <input className={inputClass} value={data.league} onChange={(e) => onChange({ league: e.target.value })} placeholder="USHL" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Hometown</label>
          <input className={inputClass} value={data.hometown} onChange={(e) => onChange({ hometown: e.target.value })} placeholder="City, ST" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Height</label>
            <input className={inputClass} value={data.height} onChange={(e) => onChange({ height: e.target.value })} placeholder={`6'1"`} />
          </div>
          <div>
            <label className={labelClass}>Weight</label>
            <input className={inputClass} value={data.weight} onChange={(e) => onChange({ weight: e.target.value })} placeholder="185 lbs" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Birth Year</label>
          <input type="number" className={inputClass} value={data.birthYear || ""} onChange={(e) => onChange({ birthYear: Number(e.target.value) })} placeholder="2006" />
        </div>
      </div>
    </div>
  );
}

// ─── Career Stats Editor ───────────────────────────────────────────────────

const STAT_KEYS = [
  { key: "gamesPlayed", label: "GP" },
  { key: "goals", label: "G" },
  { key: "assists", label: "A" },
  { key: "points", label: "PTS" },
  { key: "plusMinus", label: "+/-" },
  { key: "pim", label: "PIM" },
] as const;

function CareerStatsEditor({
  data,
  onChange,
}: {
  data: WizardState;
  onChange: (u: Partial<WizardState>) => void;
}) {
  const [adding, setAdding] = useState(false);
  const emptyForm = { season: "", team: "", league: "", gamesPlayed: "", goals: "", assists: "", points: "", plusMinus: "", pim: "" };
  const [form, setForm] = useState(emptyForm);

  function setF(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function removeSeason(i: number) {
    onChange({ seasonHistory: data.seasonHistory.filter((_, idx) => idx !== i) });
  }

  function addSeason() {
    if (!form.season.trim()) return;
    const newSeason: SeasonStats = {
      season: form.season.trim(),
      team: form.team.trim() || data.team,
      league: form.league.trim() || data.league,
      stats: {
        gamesPlayed: Number(form.gamesPlayed) || 0,
        goals: Number(form.goals) || 0,
        assists: Number(form.assists) || 0,
        points: Number(form.points) || 0,
        plusMinus: Number(form.plusMinus) || 0,
        pim: Number(form.pim) || 0,
      },
    };
    onChange({ seasonHistory: [...data.seasonHistory, newSeason] });
    setForm(emptyForm);
    setAdding(false);
  }

  return (
    <div className="space-y-4">
      {/* Existing seasons */}
      {data.seasonHistory.length > 0 ? (
        <div className="space-y-2">
          {data.seasonHistory.map((s, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold">{s.season}</p>
                <p className="text-white/40 text-xs">{s.team} · {s.league}</p>
                <p className="text-white/30 text-xs mt-0.5">
                  {s.stats.gamesPlayed} GP · {s.stats.goals}G · {s.stats.assists}A · {s.stats.points} PTS
                </p>
              </div>
              <button
                onClick={() => removeSeason(i)}
                className="text-red-400/60 text-xs px-2 py-1 active:text-red-400 transition-colors flex-shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/25 text-sm text-center py-6">No past seasons added yet.</p>
      )}

      {/* Add season form */}
      {adding ? (
        <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Season</label>
              <input className={inputClass} placeholder="2023–24" value={form.season} onChange={(e) => setF("season", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Team</label>
              <input className={inputClass} placeholder={data.team} value={form.team} onChange={(e) => setF("team", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>League</label>
            <input className={inputClass} placeholder={data.league} value={form.league} onChange={(e) => setF("league", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {STAT_KEYS.map(({ key, label }) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className={inputClass}
                  placeholder="0"
                  value={form[key]}
                  onChange={(e) => setF(key, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setAdding(false)} className="flex-1 py-3 rounded-2xl bg-white/5 text-white/50 text-sm active:bg-white/10 transition-colors">
              Cancel
            </button>
            <button onClick={addSeason} disabled={!form.season.trim()} className="flex-1 py-3 rounded-2xl bg-[#b91c1c] text-white text-sm font-bold disabled:opacity-40 active:bg-[#991b1b] transition-colors">
              Add Season
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="w-full py-3.5 rounded-2xl border border-dashed border-white/15 text-sm text-white/40 active:border-white/30 transition-colors">
          + Add Season
        </button>
      )}

      {/* Remove entire section */}
      {data.seasonHistory.length > 0 && !adding && (
        <button
          onClick={() => onChange({ seasonHistory: [] })}
          className="w-full py-3 rounded-2xl bg-red-900/20 text-red-400/70 text-sm active:bg-red-900/30 transition-colors"
        >
          Remove Career Stats Section
        </button>
      )}
    </div>
  );
}

// ─── Highlights Editor ─────────────────────────────────────────────────────

function HighlightsEditor({
  data,
  onChange,
}: {
  data: WizardState;
  onChange: (u: Partial<WizardState>) => void;
}) {
  function updateReelUrl(url: string) {
    const updates: Partial<WizardState> = { highlightReelUrl: url };
    // Auto-add first clip if reel URL filled and no clips exist
    if (url && data.highlights.length === 0) {
      updates.highlights = [{ title: "Highlight Reel", url }];
    }
    onChange(updates);
  }

  function updateClip(index: number, field: "title" | "url", value: string) {
    const updated = [...data.highlights];
    if (!updated[index]) {
      updated[index] = { title: "", url: "" };
    }
    updated[index] = { ...updated[index], [field]: value };
    onChange({ highlights: updated });
  }

  function addClip() {
    if (data.highlights.length >= 3) return;
    onChange({ highlights: [...data.highlights, { title: "", url: "" }] });
  }

  function removeClip(index: number) {
    const updated = data.highlights.filter((_, i) => i !== index);
    onChange({ highlights: updated });
  }

  return (
    <div className="space-y-5">
      {/* Reel URL */}
      <div>
        <label className={labelClass}>Highlight Reel URL</label>
        <input
          className={inputClass}
          value={data.highlightReelUrl}
          onChange={(e) => updateReelUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
        <p className="text-xs text-white/25 mt-2">
          Tip: Set YouTube videos to Unlisted so only coaches with the link can view them.
        </p>
      </div>

      {/* Individual clips */}
      <div>
        <label className={labelClass}>Individual Clips (up to 3)</label>
        <div className="space-y-3">
          {data.highlights.slice(0, 3).map((clip, i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Clip {i + 1}</span>
                <button
                  onClick={() => removeClip(i)}
                  className="text-xs text-white/30 active:text-white/60 transition-colors"
                >
                  Remove
                </button>
              </div>
              <input
                className={inputClass}
                value={clip.title}
                onChange={(e) => updateClip(i, "title", e.target.value)}
                placeholder="Clip title"
              />
              <input
                className={inputClass}
                value={clip.url}
                onChange={(e) => updateClip(i, "url", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          ))}
        </div>
        {data.highlights.length < 3 && (
          <button
            onClick={addClip}
            className="w-full mt-3 py-3 rounded-2xl border border-dashed border-white/15 text-sm text-white/40 active:border-white/30 active:text-white/60 transition-colors"
          >
            + Add Clip
          </button>
        )}
      </div>

      {/* Remove entire highlights section */}
      {(data.highlightReelUrl || data.highlights.length > 0) && (
        <button
          onClick={() => onChange({ highlightReelUrl: "", highlights: [] })}
          className="w-full py-3 rounded-2xl bg-red-900/20 text-red-400/70 text-sm active:bg-red-900/30 transition-colors"
        >
          Remove Highlights Section
        </button>
      )}
    </div>
  );
}

// ─── Socials Editor ────────────────────────────────────────────────────────

const SOCIAL_PLATFORMS: {
  platform: SocialLink["platform"];
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}[] = [
  {
    platform: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/yourhandle",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    platform: "twitter",
    label: "Twitter / X",
    placeholder: "https://twitter.com/yourhandle",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    platform: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@yourchannel",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    platform: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@yourhandle",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

function SocialsEditor({
  data,
  slug,
  onChange,
}: {
  data: WizardState;
  slug: string;
  onChange: (u: Partial<WizardState>) => void;
}) {
  const resumeRef = useRef<HTMLInputElement>(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  function getSocialUrl(platform: SocialLink["platform"]) {
    return data.socialLinks.find((l) => l.platform === platform)?.url ?? "";
  }

  function updateSocial(platform: SocialLink["platform"], url: string) {
    const filtered = data.socialLinks.filter((l) => l.platform !== platform);
    const updated: SocialLink[] = url
      ? [...filtered, { platform, url }]
      : filtered;
    onChange({ socialLinks: updated });
  }

  async function handleResumeUpload(file: File) {
    setUploadingResume(true);
    try {
      const path = `${slug || "temp"}/resume.pdf`;
      const supabase = createClient();
      const { data: uploadData, error } = await supabase.storage
        .from("player-images")
        .upload(path, file, { upsert: true, contentType: "application/pdf" });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from("player-images")
        .getPublicUrl(uploadData.path);
      onChange({ resumeUrl: urlData.publicUrl });
    } catch (err) {
      console.error("Resume upload failed", err);
    } finally {
      setUploadingResume(false);
    }
  }

  return (
    <div className="space-y-4">
      {SOCIAL_PLATFORMS.map(({ platform, label, placeholder, icon }) => (
        <div key={platform}>
          <label className={labelClass}>{label}</label>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
              {icon}
            </div>
            <input
              className={inputClass}
              value={getSocialUrl(platform)}
              onChange={(e) => updateSocial(platform, e.target.value)}
              placeholder={placeholder}
            />
          </div>
        </div>
      ))}

      {/* Resume upload */}
      <div className="pt-2 border-t border-white/5">
        <label className={labelClass}>Resume PDF</label>
        <input
          ref={resumeRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleResumeUpload(file);
          }}
        />
        {data.resumeUrl ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white/50 truncate">
              Resume uploaded
            </div>
            <button
              onClick={() => resumeRef.current?.click()}
              disabled={uploadingResume}
              className="px-4 py-3 rounded-2xl bg-white/10 text-white/70 text-sm active:bg-white/20 disabled:opacity-50 transition-colors"
            >
              {uploadingResume ? "..." : "Replace"}
            </button>
            <button
              onClick={() => onChange({ resumeUrl: "" })}
              className="px-4 py-3 rounded-2xl bg-red-900/30 text-red-400 text-sm active:bg-red-900/50 transition-colors"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            onClick={() => resumeRef.current?.click()}
            disabled={uploadingResume}
            className="w-full py-3.5 rounded-2xl border border-dashed border-white/15 text-sm text-white/40 active:border-white/30 disabled:opacity-50 transition-colors"
          >
            {uploadingResume ? "Uploading..." : "Upload Resume PDF"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Sheet ────────────────────────────────────────────────────────────

export default function EditorSheet({
  section,
  data,
  slug,
  onChange,
  onClose,
}: EditorSheetProps) {
  return (
    <AnimatePresence>
      {section && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-white/10 rounded-t-3xl max-h-[75vh] flex flex-col"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
              <h3 className="font-bold text-white">{SECTION_LABELS[section]}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 active:bg-white/20"
              >
                ✕
              </button>
            </div>

            {/* Form content - scrollable */}
            <div className="flex-1 overflow-y-auto px-5 pb-8">
              {section === "info" && <InfoEditor data={data} onChange={onChange} />}
              {section === "details" && <DetailsEditor data={data} onChange={onChange} />}
              {section === "stats" && <StatsEditor data={data} onChange={onChange} />}
              {section === "career" && <CareerStatsEditor data={data} onChange={onChange} />}
              {section === "story" && <StoryEditor data={data} slug={slug} onChange={onChange} />}
              {section === "highlights" && <HighlightsEditor data={data} onChange={onChange} />}
              {section === "socials" && <SocialsEditor data={data} slug={slug} onChange={onChange} />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
