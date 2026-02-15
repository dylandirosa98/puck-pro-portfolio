"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPlayer, updatePlayer } from "@/lib/actions/player-actions";
import ImageUpload from "./ImageUpload";
import type { PlayerWithMeta, PlayerStats, SeasonStats, Highlight, SocialLink } from "@/lib/types";

interface PlayerFormProps {
  player?: PlayerWithMeta;
}

function slugify(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

const emptyStats: PlayerStats = {
  gamesPlayed: 0,
  goals: 0,
  assists: 0,
  points: 0,
  plusMinus: 0,
  pim: 0,
};

const emptySeason: SeasonStats = {
  season: "",
  team: "",
  league: "",
  stats: { ...emptyStats },
};

const emptyHighlight: Highlight = { title: "", url: "" };

const platformOptions: SocialLink["platform"][] = [
  "instagram",
  "twitter",
  "youtube",
  "tiktok",
  "email",
];

export default function PlayerForm({ player }: PlayerFormProps) {
  const router = useRouter();
  const isEdit = !!player;

  // Basic fields
  const [firstName, setFirstName] = useState(player?.firstName ?? "");
  const [lastName, setLastName] = useState(player?.lastName ?? "");
  const [position, setPosition] = useState(player?.position ?? "Forward");
  const [number, setNumber] = useState(player?.number ?? 0);
  const [team, setTeam] = useState(player?.team ?? "");
  const [league, setLeague] = useState(player?.league ?? "");
  const [hometown, setHometown] = useState(player?.hometown ?? "");
  const [height, setHeight] = useState(player?.height ?? "");
  const [weight, setWeight] = useState(player?.weight ?? "");
  const [shoots, setShoots] = useState<"Left" | "Right">(player?.shoots ?? "Left");
  const [birthYear, setBirthYear] = useState(player?.birthYear ?? 2010);
  const [bio, setBio] = useState(player?.bio ?? "");

  // Slug
  const [slug, setSlug] = useState(player?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!player);

  // Images
  const [headshotUrl, setHeadshotUrl] = useState(player?.headshotUrl ?? "/images/headshot-placeholder.svg");
  const [heroImageUrl, setHeroImageUrl] = useState(player?.heroImageUrl ?? "/images/hero-placeholder.svg");

  // Stats
  const [currentStats, setCurrentStats] = useState<PlayerStats>(player?.currentStats ?? { ...emptyStats });

  // Season History
  const [seasonHistory, setSeasonHistory] = useState<SeasonStats[]>(
    player?.seasonHistory ?? []
  );

  // Highlights — auto-include highlight reel URL if not already in the array
  const [highlights, setHighlights] = useState<Highlight[]>(() => {
    const existing = player?.highlights ?? [];
    if (player?.highlightReelUrl && !existing.some((h) => h.url === player.highlightReelUrl)) {
      return [{ title: "Highlight Reel", url: player.highlightReelUrl }, ...existing];
    }
    return existing;
  });

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    player?.socialLinks ?? []
  );

  // Settings
  const [themeColor, setThemeColor] = useState(player?.themeColor ?? "#b91c1c");
  const [highlightReelUrl, setHighlightReelUrl] = useState(player?.highlightReelUrl ?? "");
  const [resumeUrl, setResumeUrl] = useState(player?.resumeUrl ?? "");
  const [isPublished, setIsPublished] = useState(player?.isPublished ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManual && firstName && lastName) {
      setSlug(slugify(firstName, lastName));
    }
  }, [firstName, lastName, slugManual]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.set("firstName", firstName);
    formData.set("lastName", lastName);
    formData.set("slug", slug);
    formData.set("position", position);
    formData.set("number", String(number));
    formData.set("team", team);
    formData.set("league", league);
    formData.set("hometown", hometown);
    formData.set("height", height);
    formData.set("weight", weight);
    formData.set("shoots", shoots);
    formData.set("birthYear", String(birthYear));
    formData.set("bio", bio);
    formData.set("headshotUrl", headshotUrl);
    formData.set("heroImageUrl", heroImageUrl);
    formData.set("currentStats", JSON.stringify(currentStats));
    formData.set("seasonHistory", JSON.stringify(seasonHistory));
    formData.set("highlights", JSON.stringify(highlights));
    formData.set("socialLinks", JSON.stringify(socialLinks));
    formData.set("themeColor", themeColor);
    formData.set("highlightReelUrl", highlightReelUrl);
    formData.set("resumeUrl", resumeUrl);
    formData.set("isPublished", String(isPublished));

    const result = isEdit
      ? await updatePlayer(player!.id, formData)
      : await createPlayer(formData);

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 transition-colors";
  const labelClass = "block text-xs font-medium text-white/50 mb-1.5";
  const sectionClass = "space-y-4 p-5 bg-white/[0.02] rounded-xl border border-white/5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <fieldset className={sectionClass}>
        <legend className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 px-2">
          Basic Info
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input className={inputClass} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input className={inputClass} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Position</label>
            <select className={inputClass} value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="Forward">Forward</option>
              <option value="Defense">Defense</option>
              <option value="Goalie">Goalie</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Number</label>
            <input className={inputClass} type="number" value={number} onChange={(e) => setNumber(parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label className={labelClass}>Team</label>
            <input className={inputClass} value={team} onChange={(e) => setTeam(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>League</label>
            <input className={inputClass} value={league} onChange={(e) => setLeague(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Hometown</label>
            <input className={inputClass} value={hometown} onChange={(e) => setHometown(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Height</label>
            <input className={inputClass} value={height} onChange={(e) => setHeight(e.target.value)} placeholder='5&apos;10"' />
          </div>
          <div>
            <label className={labelClass}>Weight</label>
            <input className={inputClass} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="170 lbs" />
          </div>
          <div>
            <label className={labelClass}>Shoots</label>
            <select className={inputClass} value={shoots} onChange={(e) => setShoots(e.target.value as "Left" | "Right")}>
              <option value="Left">Left</option>
              <option value="Right">Right</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Birth Year</label>
            <input className={inputClass} type="number" value={birthYear} onChange={(e) => setBirthYear(parseInt(e.target.value) || 2000)} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Bio</label>
          <textarea className={`${inputClass} min-h-[100px]`} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
      </fieldset>

      {/* URL Slug */}
      <fieldset className={sectionClass}>
        <legend className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 px-2">
          URL Slug
        </legend>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/30">/</span>
          <input
            className={inputClass}
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManual(true);
            }}
            placeholder="auto-generated-from-name"
          />
          {slugManual && (
            <button
              type="button"
              onClick={() => {
                setSlugManual(false);
                setSlug(slugify(firstName, lastName));
              }}
              className="text-xs text-white/30 hover:text-white/50 whitespace-nowrap"
            >
              Auto
            </button>
          )}
        </div>
      </fieldset>

      {/* Images */}
      <fieldset className={sectionClass}>
        <legend className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 px-2">
          Images
        </legend>
        <div className="flex gap-8">
          <div>
            <label className={labelClass}>Headshot</label>
            <ImageUpload
              slug={slug}
              folder="headshot"
              currentUrl={headshotUrl}
              onUpload={setHeadshotUrl}
            />
          </div>
          <div>
            <label className={labelClass}>Hero Image</label>
            <ImageUpload
              slug={slug}
              folder="hero"
              currentUrl={heroImageUrl}
              onUpload={setHeroImageUrl}
            />
          </div>
        </div>
      </fieldset>

      {/* Current Stats */}
      <fieldset className={sectionClass}>
        <legend className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 px-2">
          Current Stats
        </legend>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {(
            [
              ["gamesPlayed", "GP"],
              ["goals", "G"],
              ["assists", "A"],
              ["points", "PTS"],
              ["plusMinus", "+/-"],
              ["pim", "PIM"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                className={inputClass}
                type="number"
                value={currentStats[key]}
                onChange={(e) =>
                  setCurrentStats((prev) => ({
                    ...prev,
                    [key]: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Season History */}
      <fieldset className={sectionClass}>
        <legend className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 px-2">
          Season History
        </legend>
        {seasonHistory.map((season, i) => (
          <div key={i} className="p-4 bg-white/[0.03] rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Season {i + 1}</span>
              <button
                type="button"
                onClick={() => setSeasonHistory((prev) => prev.filter((_, j) => j !== i))}
                className="text-xs text-white/30 hover:text-red-400"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Season</label>
                <input
                  className={inputClass}
                  value={season.season}
                  onChange={(e) => {
                    const updated = [...seasonHistory];
                    updated[i] = { ...updated[i], season: e.target.value };
                    setSeasonHistory(updated);
                  }}
                  placeholder="2024-25"
                />
              </div>
              <div>
                <label className={labelClass}>Team</label>
                <input
                  className={inputClass}
                  value={season.team}
                  onChange={(e) => {
                    const updated = [...seasonHistory];
                    updated[i] = { ...updated[i], team: e.target.value };
                    setSeasonHistory(updated);
                  }}
                />
              </div>
              <div>
                <label className={labelClass}>League</label>
                <input
                  className={inputClass}
                  value={season.league}
                  onChange={(e) => {
                    const updated = [...seasonHistory];
                    updated[i] = { ...updated[i], league: e.target.value };
                    setSeasonHistory(updated);
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {(
                [
                  ["gamesPlayed", "GP"],
                  ["goals", "G"],
                  ["assists", "A"],
                  ["points", "PTS"],
                  ["plusMinus", "+/-"],
                  ["pim", "PIM"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <input
                    className={inputClass}
                    type="number"
                    value={season.stats[key]}
                    onChange={(e) => {
                      const updated = [...seasonHistory];
                      updated[i] = {
                        ...updated[i],
                        stats: {
                          ...updated[i].stats,
                          [key]: parseInt(e.target.value) || 0,
                        },
                      };
                      setSeasonHistory(updated);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setSeasonHistory((prev) => [...prev, { ...emptySeason, stats: { ...emptyStats } }])}
          className="text-xs text-white/40 hover:text-white/70 px-3 py-2 border border-dashed border-white/10 rounded-lg hover:border-white/30 transition-colors w-full"
        >
          + Add Season
        </button>
      </fieldset>

      {/* Highlights */}
      <fieldset className={sectionClass}>
        <legend className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 px-2">
          Highlights
        </legend>
        {highlights.map((hl, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Title</label>
                <input
                  className={inputClass}
                  value={hl.title}
                  onChange={(e) => {
                    const updated = [...highlights];
                    updated[i] = { ...updated[i], title: e.target.value };
                    setHighlights(updated);
                  }}
                />
              </div>
              <div>
                <label className={labelClass}>URL</label>
                <input
                  className={inputClass}
                  value={hl.url}
                  onChange={(e) => {
                    const updated = [...highlights];
                    updated[i] = { ...updated[i], url: e.target.value };
                    setHighlights(updated);
                  }}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHighlights((prev) => prev.filter((_, j) => j !== i))}
              className="text-xs text-white/30 hover:text-red-400 mt-6"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setHighlights((prev) => [...prev, { ...emptyHighlight }])}
          className="text-xs text-white/40 hover:text-white/70 px-3 py-2 border border-dashed border-white/10 rounded-lg hover:border-white/30 transition-colors w-full"
        >
          + Add Highlight
        </button>
      </fieldset>

      {/* Social Links */}
      <fieldset className={sectionClass}>
        <legend className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 px-2">
          Social Links
        </legend>
        {socialLinks.map((link, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Platform</label>
                <select
                  className={inputClass}
                  value={link.platform}
                  onChange={(e) => {
                    const updated = [...socialLinks];
                    updated[i] = { ...updated[i], platform: e.target.value as SocialLink["platform"] };
                    setSocialLinks(updated);
                  }}
                >
                  {platformOptions.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>URL</label>
                <input
                  className={inputClass}
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...socialLinks];
                    updated[i] = { ...updated[i], url: e.target.value };
                    setSocialLinks(updated);
                  }}
                  placeholder={link.platform === "email" ? "mailto:player@example.com" : "https://..."}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSocialLinks((prev) => prev.filter((_, j) => j !== i))}
              className="text-xs text-white/30 hover:text-red-400 mt-6"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setSocialLinks((prev) => [...prev, { platform: "instagram", url: "" }])}
          className="text-xs text-white/40 hover:text-white/70 px-3 py-2 border border-dashed border-white/10 rounded-lg hover:border-white/30 transition-colors w-full"
        >
          + Add Social Link
        </button>
      </fieldset>

      {/* Settings */}
      <fieldset className={sectionClass}>
        <legend className="text-xs font-bold tracking-[0.15em] uppercase text-white/40 px-2">
          Settings
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Theme Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
              />
              <input
                className={inputClass}
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                placeholder="#b91c1c"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Highlight Reel URL</label>
            <input
              className={inputClass}
              value={highlightReelUrl}
              onChange={(e) => setHighlightReelUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="text-[10px] text-white/20 mt-1">Shows as hero button. Auto-added to Highlights on first load — edit or remove it there independently.</p>
          </div>
          <div>
            <label className={labelClass}>Resume URL</label>
            <input
              className={inputClass}
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={labelClass}>Published</label>
            <label className="flex items-center gap-3 mt-1 cursor-pointer">
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPublished ? "bg-green-500" : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublished ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-white/50">
                {isPublished ? "Live" : "Draft"}
              </span>
            </label>
          </div>
        </div>
      </fieldset>

      {/* Error + Submit */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update Player" : "Create Player"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-6 py-2.5 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/15 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
