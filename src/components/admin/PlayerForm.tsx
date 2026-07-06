"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPlayer, updatePlayer } from "@/lib/actions/player-actions";
import ImageUpload from "./ImageUpload";
import PdfUpload from "./PdfUpload";
import MediaPhotoUpload from "./MediaPhotoUpload";
import MediaVideoUpload from "./MediaVideoUpload";
import type { PlayerWithMeta, PlayerStats, SeasonStats, Highlight, SocialLink, MediaItem, Skillset } from "@/lib/types";

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
  wins: 0,
  losses: 0,
  goalsAgainstAverage: 0,
  savePercentage: 0,
  shutouts: 0,
};

const emptySeason: SeasonStats = {
  season: "",
  team: "",
  league: "",
  stats: { ...emptyStats },
};

const emptyHighlight: Highlight = { title: "", url: "" };

const playerStatFields = [
  ["gamesPlayed", "GP", "number"],
  ["goals", "G", "number"],
  ["assists", "A", "number"],
  ["points", "PTS", "number"],
  ["plusMinus", "+/-", "number"],
  ["pim", "PIM", "number"],
] as const;

const goalieStatFields = [
  ["gamesPlayed", "GP", "number"],
  ["wins", "W", "number"],
  ["losses", "L", "number"],
  ["goalsAgainstAverage", "GAA", "decimal"],
  ["savePercentage", "SV%", "decimal"],
  ["shutouts", "SO", "number"],
] as const;

type StatField = (typeof playerStatFields | typeof goalieStatFields)[number];

function parseStatInput(value: string, inputType: StatField[2]) {
  const parsed = inputType === "decimal" ? parseFloat(value) : parseInt(value);
  return Number.isFinite(parsed) ? parsed : 0;
}


const platformOptions: SocialLink["platform"][] = [
  "instagram",
  "twitter",
  "youtube",
  "tiktok",
  "email",
  "eliteprospects",
  "ncsa",
  "hudl",
  "neutralzone",
];

const platformLabels: Record<SocialLink["platform"], string> = {
  instagram: "Instagram",
  twitter: "Twitter",
  youtube: "YouTube",
  tiktok: "TikTok",
  email: "Email",
  eliteprospects: "Elite Prospects",
  ncsa: "NCSA",
  hudl: "HUDL",
  neutralzone: "Neutral Zone",
};

const heroPlatformOptions: SocialLink["platform"][] = [
  "eliteprospects",
  "ncsa",
  "hudl",
  "neutralzone",
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
  const [teamLogoUrl, setTeamLogoUrl] = useState(player?.teamLogoUrl ?? "");

  // Stats
  const [currentStats, setCurrentStats] = useState<PlayerStats>(player?.currentStats ?? { ...emptyStats });

  // Season History
  const [seasonHistory, setSeasonHistory] = useState<SeasonStats[]>(
    player?.seasonHistory ?? []
  );

  const [highlights, setHighlights] = useState<Highlight[]>(player?.highlights ?? []);
  const [media, setMedia] = useState<MediaItem[]>(player?.media ?? []);

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    player?.socialLinks ?? []
  );

  // Settings
  const [themeColor, setThemeColor] = useState(player?.themeColor ?? "#b91c1c");
  const [numberColor, setNumberColor] = useState(player?.numberColor ?? "");
  const [highlightReelUrl, setHighlightReelUrl] = useState(player?.highlightReelUrl ?? "");
  const [resumeUrl, setResumeUrl] = useState(player?.resumeUrl ?? "");
  const [skillsets, setSkillsets] = useState<Skillset[]>(player?.skillsets ?? []);
  const [sectionOrder, setSectionOrder] = useState<string[]>(() => {
    const ALL_SECTIONS = ["about", "skillsets", "interests", "training", "timeline", "career-stats", "highlights"];
    const raw = player?.sectionOrder && player.sectionOrder.length > 0
      ? player.sectionOrder
      : ALL_SECTIONS;
    // Remove legacy "stats" key, ensure "about" is present, add any missing sections
    const cleaned = raw.filter((k) => k !== "stats");
    if (!cleaned.includes("about")) cleaned.unshift("about");
    // Append any newly-added sections that aren't in the saved order
    for (const s of ALL_SECTIONS) {
      if (!cleaned.includes(s)) cleaned.push(s);
    }
    return cleaned;
  });
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [interests, setInterests] = useState(player?.interests ?? "");
  const [interestsMedia, setInterestsMedia] = useState<MediaItem[]>(player?.interestsMedia ?? []);
  const [trainingVideos, setTrainingVideos] = useState<{ url: string; title?: string; description?: string; thumbnailUrl?: string; muxPlaybackId?: string; muxAssetId?: string; muxUploadId?: string }[]>(() => {
    if (player?.trainingVideos && player.trainingVideos.length > 0) {
      return player.trainingVideos.map((v) => ({
        url: v.url,
        title: v.title ?? "",
        description: v.description ?? "",
        thumbnailUrl: v.thumbnailUrl,
        muxPlaybackId: v.muxPlaybackId,
        muxAssetId: v.muxAssetId,
        muxUploadId: v.muxUploadId,
      }));
    }
    if (player?.trainingVideoUrl) return [{ url: player.trainingVideoUrl, title: "", description: "" }];
    return [];
  });
  const [trainingDescription, setTrainingDescription] = useState(player?.trainingDescription ?? "");
  const [usePerTrainingDescriptions, setUsePerTrainingDescriptions] = useState(
    () => !!player?.trainingVideos?.some((v) => v.description?.trim())
  );
  const [timeline, setTimeline] = useState<{ title: string; description: string; media: MediaItem[] }[]>(player?.timeline ?? []);
  const [transcriptUrl, setTranscriptUrl] = useState(player?.transcriptUrl ?? "");
  const [showStatsBar, setShowStatsBar] = useState(player?.showStatsBar ?? true);
  const [lightMode, setLightMode] = useState(player?.lightMode ?? false);
  const [customDomain, setCustomDomain] = useState(player?.customDomain ?? "");
  const [isPublished, setIsPublished] = useState(player?.isPublished ?? false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const statFields = position === "Goalie" ? goalieStatFields : playerStatFields;

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
    formData.set("teamLogoUrl", teamLogoUrl);
    formData.set("currentStats", JSON.stringify(currentStats));
    formData.set("seasonHistory", JSON.stringify(seasonHistory));
    formData.set("highlights", JSON.stringify(highlights));
    formData.set("media", JSON.stringify(media));
    formData.set("socialLinks", JSON.stringify(socialLinks));
    formData.set("themeColor", themeColor);
    formData.set("numberColor", numberColor);
    formData.set("highlightReelUrl", highlightReelUrl);
    formData.set("resumeUrl", resumeUrl);
    formData.set("skillsets", JSON.stringify(skillsets));
    formData.set("sectionOrder", JSON.stringify(sectionOrder));
    formData.set("interests", interests);
    formData.set("interestsMedia", JSON.stringify(interestsMedia));
    formData.set("trainingVideos", JSON.stringify(trainingVideos));
    formData.set("trainingDescription", trainingDescription);
    formData.set("timeline", JSON.stringify(timeline));
    formData.set("transcriptUrl", transcriptUrl);
    formData.set("showStatsBar", String(showStatsBar));
    formData.set("lightMode", String(lightMode));
    formData.set("customDomain", customDomain.trim().toLowerCase());
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
  const selectClass = `${inputClass} bg-neutral-950`;
  const optionClass = "bg-neutral-950 text-white";
  const labelClass = "block text-xs font-medium text-white/50 mb-1.5";
  const sectionClass = "p-5 bg-white/[0.02] rounded-xl border border-white/5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Basic Info
        </summary>
        <div className="mt-4 space-y-4">
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
            <select className={selectClass} value={position} onChange={(e) => setPosition(e.target.value)}>
              <option className={optionClass} value="Forward">Forward</option>
              <option className={optionClass} value="Defense">Defense</option>
              <option className={optionClass} value="Goalie">Goalie</option>
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
            <label className={labelClass}>{position === "Goalie" ? "Catches" : "Shoots"}</label>
            <select className={selectClass} value={shoots} onChange={(e) => setShoots(e.target.value as "Left" | "Right")}>
              <option className={optionClass} value="Left">Left</option>
              <option className={optionClass} value="Right">Right</option>
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
        </div>
      </details>

      {/* Media Carousel */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Media (Photos &amp; Videos)
        </summary>
        <div className="mt-4 space-y-4">
        {media.map((item, i) => (
          <div key={i} className="rounded-lg border border-white/10 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Item {i + 1}</span>
              <button
                type="button"
                onClick={() => setMedia(media.filter((_, j) => j !== i))}
                className="text-xs text-red-400/60 hover:text-red-400"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Type</label>
                <select
                  className={selectClass}
                  value={item.type}
                  onChange={(e) => setMedia(media.map((m, j) => j === i ? { ...m, type: e.target.value as "photo" | "video" } : m))}
                >
                  <option className={optionClass} value="photo">Photo</option>
                  <option className={optionClass} value="video">Video</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Title <span className="text-white/20 font-normal">(optional)</span></label>
                <input
                  className={inputClass}
                  value={item.title ?? ""}
                  onChange={(e) => setMedia(media.map((m, j) => j === i ? { ...m, title: e.target.value } : m))}
                  placeholder="Caption..."
                />
              </div>
            </div>
            {item.type === "photo" ? (
              <div>
                <label className={labelClass}>Photo</label>
                <MediaPhotoUpload
                  slug={slug}
                  index={i}
                  currentUrl={item.url}
                  onUpload={(url) => setMedia(media.map((m, j) => j === i ? { ...m, url } : m))}
                />
              </div>
            ) : (
              <MediaVideoUpload
                item={item}
                slug={slug}
                inputClass={inputClass}
                labelClass={labelClass}
                onChange={(next) => setMedia(media.map((m, j) => j === i ? next : m))}
              />
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setMedia([...media, { type: "photo", url: "", title: "" }])}
          className="w-full py-2 rounded-lg border border-dashed border-white/20 text-xs text-white/40 hover:text-white/60 hover:border-white/30 transition-colors"
        >
          + Add Photo or Video
        </button>
        <p className="text-[10px] text-white/20">Shows as a carousel below the About section. Leave empty to hide.</p>
        </div>
      </details>

      {/* URL Slug */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          URL Slug
        </summary>
        <div className="mt-4 space-y-4">
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
        </div>
      </details>

      {/* Images */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Images
        </summary>
        <div className="mt-4 space-y-4">
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
          <div>
            <label className={labelClass}>Team Logo</label>
            <ImageUpload
              slug={slug}
              folder="logo"
              currentUrl={teamLogoUrl}
              onUpload={setTeamLogoUrl}
            />
          </div>
        </div>
        </div>
      </details>

      {/* Current Stats */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Current Stats
        </summary>
        <div className="mt-4 space-y-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {statFields.map(([key, label, inputType]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                className={inputClass}
                type="number"
                step={inputType === "decimal" ? "0.001" : "1"}
                value={currentStats[key] ?? 0}
                onChange={(e) =>
                  setCurrentStats((prev) => ({
                    ...prev,
                    [key]: parseStatInput(e.target.value, inputType),
                  }))
                }
              />
            </div>
          ))}
        </div>
        </div>
      </details>

      {/* Season History */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Season History
        </summary>
        <div className="mt-4 space-y-4">
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
              {statFields.map(([key, label, inputType]) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <input
                    className={inputClass}
                    type="number"
                    step={inputType === "decimal" ? "0.001" : "1"}
                    value={season.stats[key] ?? 0}
                    onChange={(e) => {
                      const updated = [...seasonHistory];
                      updated[i] = {
                        ...updated[i],
                        stats: {
                          ...updated[i].stats,
                          [key]: parseStatInput(e.target.value, inputType),
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
        </div>
      </details>

      {/* Highlights */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Highlights
        </summary>
        <div className="mt-4 space-y-4">
        {highlights.map((hl, i) => (
          <div key={i} className="rounded-lg border border-white/10 p-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-white/40">Highlight {i + 1}</span>
              <button
                type="button"
                onClick={() => setHighlights((prev) => prev.filter((_, j) => j !== i))}
                className="text-xs text-red-400/60 hover:text-red-400"
              >
                Remove
              </button>
            </div>
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
            <MediaVideoUpload
              item={{
                type: "video",
                url: hl.url,
                title: hl.title,
                thumbnailUrl: hl.thumbnailUrl,
                muxPlaybackId: hl.muxPlaybackId,
                muxAssetId: hl.muxAssetId,
                muxUploadId: hl.muxUploadId,
              }}
              slug={slug}
              inputClass={inputClass}
              labelClass={labelClass}
              onChange={(next) => {
                const updated = [...highlights];
                updated[i] = {
                  ...updated[i],
                  url: next.url,
                  thumbnailUrl: next.thumbnailUrl,
                  muxPlaybackId: next.muxPlaybackId,
                  muxAssetId: next.muxAssetId,
                  muxUploadId: next.muxUploadId,
                };
                setHighlights(updated);
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setHighlights((prev) => [...prev, { ...emptyHighlight }])}
          className="text-xs text-white/40 hover:text-white/70 px-3 py-2 border border-dashed border-white/10 rounded-lg hover:border-white/30 transition-colors w-full"
        >
          + Add Highlight
        </button>
        </div>
      </details>

      {/* Social Links */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Social Links
        </summary>
        <div className="mt-4 space-y-4">
        {socialLinks.map((link, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Platform</label>
                <select
                  className={selectClass}
                  value={link.platform}
                  onChange={(e) => {
                    const updated = [...socialLinks];
                    updated[i] = { ...updated[i], platform: e.target.value as SocialLink["platform"] };
                    setSocialLinks(updated);
                  }}
                >
                  {platformOptions.map((p) => (
                    <option key={p} value={p} className={optionClass}>
                      {platformLabels[p]}
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
              {heroPlatformOptions.includes(link.platform) && (
                <label className="sm:col-span-2 flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!link.showInHero}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[i] = { ...updated[i], showInHero: e.target.checked };
                      setSocialLinks(updated);
                    }}
                  />
                  Show in hero next to Academics
                </label>
              )}
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
        </div>
      </details>

      {/* Skillsets */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Player Profile / Skillsets
        </summary>
        <div className="mt-4 space-y-4">
        {skillsets.map((skill, i) => (
          <div key={i} className="rounded-lg border border-white/10 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Skill {i + 1}</span>
              <button
                type="button"
                onClick={() => setSkillsets(skillsets.filter((_, j) => j !== i))}
                className="text-xs text-red-400/60 hover:text-red-400"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Skill Name</label>
                <input
                  className={inputClass}
                  value={skill.name}
                  onChange={(e) => {
                    const updated = [...skillsets];
                    updated[i] = { ...updated[i], name: e.target.value };
                    setSkillsets(updated);
                  }}
                  placeholder="e.g. Offensive Defenseman"
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input
                  className={inputClass}
                  value={skill.description}
                  onChange={(e) => {
                    const updated = [...skillsets];
                    updated[i] = { ...updated[i], description: e.target.value };
                    setSkillsets(updated);
                  }}
                  placeholder="Brief description of this skill..."
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Video Display</label>
              <select
                className={selectClass}
                value={skill.videoDisplay ?? "button"}
                onChange={(e) => {
                  const updated = [...skillsets];
                  updated[i] = { ...updated[i], videoDisplay: e.target.value as "button" | "embed" };
                  setSkillsets(updated);
                }}
              >
                <option className={optionClass} value="button">Button opens popup</option>
                <option className={optionClass} value="embed">Embed in card</option>
              </select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className={labelClass}>Videos</label>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...skillsets];
                    const videos = updated[i].videos && updated[i].videos!.length > 0
                      ? updated[i].videos!
                      : updated[i].watchUrl
                        ? [{
                            type: "video" as const,
                            url: updated[i].watchUrl ?? "",
                            title: updated[i].name,
                            thumbnailUrl: updated[i].thumbnailUrl,
                            muxPlaybackId: updated[i].muxPlaybackId,
                            muxAssetId: updated[i].muxAssetId,
                            muxUploadId: updated[i].muxUploadId,
                          }]
                        : [];
                    updated[i] = {
                      ...updated[i],
                      videos: [...videos, { type: "video", url: "", title: updated[i].name }],
                    };
                    setSkillsets(updated);
                  }}
                  className="text-xs text-white/40 hover:text-white/70"
                >
                  + Add Video
                </button>
              </div>
              {(skill.videos && skill.videos.length > 0
                ? skill.videos
                : skill.watchUrl
                  ? [{
                      type: "video" as const,
                      url: skill.watchUrl ?? "",
                      title: skill.name,
                      thumbnailUrl: skill.thumbnailUrl,
                      muxPlaybackId: skill.muxPlaybackId,
                      muxAssetId: skill.muxAssetId,
                      muxUploadId: skill.muxUploadId,
                    }]
                  : [{ type: "video" as const, url: "", title: skill.name }]
              ).map((video, vi) => (
                <div key={vi} className="rounded-lg border border-white/10 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Video {vi + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...skillsets];
                        const videos = (updated[i].videos && updated[i].videos!.length > 0
                          ? updated[i].videos!
                          : updated[i].watchUrl
                            ? [{
                                type: "video" as const,
                                url: updated[i].watchUrl ?? "",
                                title: updated[i].name,
                                thumbnailUrl: updated[i].thumbnailUrl,
                                muxPlaybackId: updated[i].muxPlaybackId,
                                muxAssetId: updated[i].muxAssetId,
                                muxUploadId: updated[i].muxUploadId,
                              }]
                            : []
                        ).filter((_, idx) => idx !== vi);
                        updated[i] = {
                          ...updated[i],
                          videos,
                          watchUrl: videos[0]?.url ?? "",
                          thumbnailUrl: videos[0]?.thumbnailUrl,
                          muxPlaybackId: videos[0]?.muxPlaybackId,
                          muxAssetId: videos[0]?.muxAssetId,
                          muxUploadId: videos[0]?.muxUploadId,
                        };
                        setSkillsets(updated);
                      }}
                      className="text-xs text-red-400/60 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                  <MediaVideoUpload
                    item={{ ...video, title: video.title ?? skill.name }}
                    slug={slug}
                    inputClass={inputClass}
                    labelClass={labelClass}
                    onChange={(next) => {
                      const updated = [...skillsets];
                      const videos = updated[i].videos && updated[i].videos!.length > 0
                        ? [...updated[i].videos!]
                        : updated[i].watchUrl
                          ? [{
                              type: "video" as const,
                              url: updated[i].watchUrl ?? "",
                              title: updated[i].name,
                              thumbnailUrl: updated[i].thumbnailUrl,
                              muxPlaybackId: updated[i].muxPlaybackId,
                              muxAssetId: updated[i].muxAssetId,
                              muxUploadId: updated[i].muxUploadId,
                            }]
                          : [{ type: "video" as const, url: "", title: updated[i].name }];
                      videos[vi] = { ...next, title: next.title ?? updated[i].name };
                      updated[i] = {
                        ...updated[i],
                        videos,
                        watchUrl: videos[0]?.url ?? "",
                        thumbnailUrl: videos[0]?.thumbnailUrl,
                        muxPlaybackId: videos[0]?.muxPlaybackId,
                        muxAssetId: videos[0]?.muxAssetId,
                        muxUploadId: videos[0]?.muxUploadId,
                      };
                      setSkillsets(updated);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setSkillsets([...skillsets, { name: "", description: "", watchUrl: "", videoDisplay: "button" }])}
          className="text-xs text-white/40 hover:text-white/70 px-3 py-2 border border-dashed border-white/10 rounded-lg hover:border-white/30 transition-colors w-full"
        >
          + Add Skillset
        </button>
        <p className="text-[10px] text-white/20">Shows as a card grid on the profile. Leave empty to hide the section.</p>
        </div>
      </details>

      {/* Interests */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Outside the Rink
        </summary>
        <div className="mt-4 space-y-4">
        <textarea
          className={inputClass}
          rows={4}
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="Describe the player's interests and life outside hockey..."
        />
        {interestsMedia.map((item, i) => (
          <div key={i} className="rounded-lg border border-white/10 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Item {i + 1}</span>
              <button
                type="button"
                onClick={() => setInterestsMedia(interestsMedia.filter((_, j) => j !== i))}
                className="text-xs text-red-400/60 hover:text-red-400"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Type</label>
                <select
                  className={selectClass}
                  value={item.type}
                  onChange={(e) => setInterestsMedia(interestsMedia.map((m, j) => j === i ? { ...m, type: e.target.value as "photo" | "video" } : m))}
                >
                  <option className={optionClass} value="photo">Photo</option>
                  <option className={optionClass} value="video">Video</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Title <span className="text-white/20 font-normal">(optional)</span></label>
                <input
                  className={inputClass}
                  value={item.title ?? ""}
                  onChange={(e) => setInterestsMedia(interestsMedia.map((m, j) => j === i ? { ...m, title: e.target.value } : m))}
                  placeholder="Caption..."
                />
              </div>
            </div>
            {item.type === "photo" ? (
              <div>
                <label className={labelClass}>Photo</label>
                <MediaPhotoUpload
                  slug={slug}
                  index={i + 100}
                  currentUrl={item.url}
                  onUpload={(url) => setInterestsMedia(interestsMedia.map((m, j) => j === i ? { ...m, url } : m))}
                />
              </div>
            ) : (
              <MediaVideoUpload
                item={item}
                slug={slug}
                inputClass={inputClass}
                labelClass={labelClass}
                onChange={(next) => setInterestsMedia(interestsMedia.map((m, j) => j === i ? next : m))}
              />
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setInterestsMedia([...interestsMedia, { type: "photo", url: "", title: "" }])}
          className="w-full py-2 rounded-lg border border-dashed border-white/20 text-xs text-white/40 hover:text-white/60 hover:border-white/30 transition-colors"
        >
          + Add Photo or Video
        </button>
        <p className="text-[10px] text-white/20">Shows as a separate section on the profile. Leave both blank to hide.</p>
        </div>
      </details>

      {/* Training */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Training
        </summary>
        <div className="mt-4 space-y-4">
        {trainingVideos.map((tv, i) => (
          <div key={i} className="rounded-lg border border-white/10 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Video {i + 1}</span>
              <button
                type="button"
                onClick={() => setTrainingVideos(trainingVideos.filter((_, j) => j !== i))}
                className="text-xs text-red-400/60 hover:text-red-400"
              >
                Remove
              </button>
            </div>
            <MediaVideoUpload
              item={{
                type: "video",
                url: tv.url,
                title: tv.title,
                thumbnailUrl: tv.thumbnailUrl,
                muxPlaybackId: tv.muxPlaybackId,
                muxAssetId: tv.muxAssetId,
                muxUploadId: tv.muxUploadId,
              }}
              slug={slug}
              inputClass={inputClass}
              labelClass={labelClass}
              onChange={(next) => setTrainingVideos(trainingVideos.map((t, j) => j === i ? {
                ...t,
                url: next.url,
                thumbnailUrl: next.thumbnailUrl,
                muxPlaybackId: next.muxPlaybackId,
                muxAssetId: next.muxAssetId,
                muxUploadId: next.muxUploadId,
              } : t))}
            />
            <div>
              <label className={labelClass}>Slide Title <span className="text-white/20 font-normal">(optional)</span></label>
              <input
                className={inputClass}
                value={tv.title ?? ""}
                onChange={(e) => setTrainingVideos(trainingVideos.map((t, j) => j === i ? { ...t, title: e.target.value } : t))}
                placeholder="e.g. Edge Work Session"
              />
            </div>
            {usePerTrainingDescriptions && (
              <div>
                <label className={labelClass}>Slide Description</label>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={tv.description ?? ""}
                  onChange={(e) => setTrainingVideos(trainingVideos.map((t, j) => j === i ? { ...t, description: e.target.value } : t))}
                  placeholder="Description shown only when this training video is selected."
                />
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setTrainingVideos([...trainingVideos, { url: "", title: "", description: "" }])}
          className="w-full py-2 rounded-lg border border-dashed border-white/20 text-xs text-white/40 hover:text-white/60 hover:border-white/30 transition-colors"
        >
          + Add Training Video
        </button>
        <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
          <input
            type="checkbox"
            checked={usePerTrainingDescriptions}
            onChange={(e) => setUsePerTrainingDescriptions(e.target.checked)}
          />
          Use a different description for each training video
        </label>
        {!usePerTrainingDescriptions && (
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={inputClass}
              rows={3}
              value={trainingDescription}
              onChange={(e) => setTrainingDescription(e.target.value)}
              placeholder="e.g. Regularly trains with Coach X, focusing on edge work and shot release."
            />
          </div>
        )}
        {usePerTrainingDescriptions && trainingDescription && (
          <p className="text-[10px] text-white/25">The shared description is saved and will be used as a fallback if a slide description is blank.</p>
        )}
        <p className="text-[10px] text-white/20">Videos carousel shown first, description below. Leave both empty to hide.</p>
        </div>
      </details>

      {/* Academics */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Academics
        </summary>
        <div className="mt-4 space-y-4">
        <div>
          <label className={labelClass}>Transcript URL</label>
          <input
            className={inputClass}
            value={transcriptUrl}
            onChange={(e) => setTranscriptUrl(e.target.value)}
            placeholder="Google Drive link or PDF URL"
          />
          <p className="text-[10px] text-white/20 mt-1">Shows as an &quot;Academics&quot; button in the hero. Leave blank to hide.</p>
        </div>
        </div>
      </details>


      {/* Timeline */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Hockey Timeline
        </summary>
        <div className="mt-4 space-y-4">
        {timeline.map((entry, i) => (
          <div key={i} className="rounded-lg border border-white/10 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Entry {i + 1}</span>
              <button
                type="button"
                onClick={() => setTimeline(timeline.filter((_, j) => j !== i))}
                className="text-xs text-red-400/60 hover:text-red-400"
              >
                Remove
              </button>
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                className={inputClass}
                value={entry.title}
                onChange={(e) => setTimeline(timeline.map((t, j) => j === i ? { ...t, title: e.target.value } : t))}
                placeholder="e.g. 2023-24 Season, AAA Bantam..."
              />
            </div>
            {/* Media items */}
            {entry.media.map((item, mi) => (
              <div key={mi} className="rounded-lg border border-white/5 p-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">Media {mi + 1}</span>
                  <button
                    type="button"
                    onClick={() => setTimeline(timeline.map((t, j) => j === i ? { ...t, media: t.media.filter((_, k) => k !== mi) } : t))}
                    className="text-xs text-red-400/60 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>Type</label>
                    <select
                      className={selectClass}
                      value={item.type}
                      onChange={(e) => setTimeline(timeline.map((t, j) => j === i ? { ...t, media: t.media.map((m, k) => k === mi ? { ...m, type: e.target.value as "photo" | "video" } : m) } : t))}
                    >
                      <option className={optionClass} value="photo">Photo</option>
                      <option className={optionClass} value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Caption <span className="text-white/20 font-normal">(opt)</span></label>
                    <input
                      className={inputClass}
                      value={item.title ?? ""}
                      onChange={(e) => setTimeline(timeline.map((t, j) => j === i ? { ...t, media: t.media.map((m, k) => k === mi ? { ...m, title: e.target.value } : m) } : t))}
                      placeholder="Caption..."
                    />
                  </div>
                </div>
                {item.type === "photo" ? (
                  <div>
                    <label className={labelClass}>Photo</label>
                    <MediaPhotoUpload
                      slug={slug}
                      index={i * 100 + mi + 200}
                      currentUrl={item.url}
                      onUpload={(url) => setTimeline(timeline.map((t, j) => j === i ? { ...t, media: t.media.map((m, k) => k === mi ? { ...m, url } : m) } : t))}
                    />
                  </div>
                ) : (
                  <MediaVideoUpload
                    item={item}
                    slug={slug}
                    inputClass={inputClass}
                    labelClass={labelClass}
                    onChange={(next) => setTimeline(timeline.map((t, j) => j === i ? { ...t, media: t.media.map((m, k) => k === mi ? next : m) } : t))}
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setTimeline(timeline.map((t, j) => j === i ? { ...t, media: [...t.media, { type: "photo" as const, url: "", title: "" }] } : t))}
              className="w-full py-1.5 rounded-lg border border-dashed border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors"
            >
              + Add Photo or Video
            </button>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                className={inputClass}
                rows={3}
                value={entry.description}
                onChange={(e) => setTimeline(timeline.map((t, j) => j === i ? { ...t, description: e.target.value } : t))}
                placeholder="Describe this period in the player's journey..."
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setTimeline([...timeline, { title: "", description: "", media: [] }])}
          className="w-full py-2 rounded-lg border border-dashed border-white/20 text-xs text-white/40 hover:text-white/60 hover:border-white/30 transition-colors"
        >
          + Add Timeline Entry
        </button>
        <p className="text-[10px] text-white/20">Each entry expands as a dropdown. Media carousel shown first, description below.</p>
        </div>
      </details>

      {/* Section Order */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Page Section Order
        </summary>
        <div className="mt-4 space-y-4">
        <p className="text-[10px] text-white/30 mb-3">Drag to reorder. Hero and Stats Bar are always first.</p>
        <div className="space-y-2">
          {/* Fixed */}
          {["Hero", "Stats Bar"].map((label) => (
            <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/5 opacity-40 cursor-not-allowed select-none">
              <span className="text-white/30">⠿</span>
              <span className="text-xs text-white/50">{label}</span>
              <span className="ml-auto text-[10px] text-white/20">locked</span>
            </div>
          ))}
          {/* Draggable */}
          {sectionOrder.map((key, i) => {
            const labels: Record<string, string> = {
              about: "About",
              skillsets: "Player Profile / Skillsets",
              interests: "Outside the Rink",
              training: "Training",
              timeline: "Hockey Timeline",
              "career-stats": "Career Stats",
              highlights: "Highlights",
            };
            return (
              <div
                key={key}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragIndex === null || dragIndex === i) return;
                  const newOrder = [...sectionOrder];
                  newOrder.splice(i, 0, newOrder.splice(dragIndex, 1)[0]);
                  setSectionOrder(newOrder);
                  setDragIndex(i);
                }}
                onDragEnd={() => setDragIndex(null)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-grab active:cursor-grabbing transition-colors select-none ${
                  dragIndex === i
                    ? "bg-white/10 border-white/20"
                    : "bg-white/[0.03] border-white/5 hover:border-white/15"
                }`}
              >
                <span className="text-white/30 text-base">⠿</span>
                <span className="text-xs text-white/70">{labels[key] ?? key}</span>
              </div>
            );
          })}
        </div>
        </div>
      </details>

      {/* Settings */}
      <details className={sectionClass}>
        <summary className="cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-white/40 list-none">
          Settings
        </summary>
        <div className="mt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Custom Domain</label>
            <input
              className={inputClass}
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="www.jacksmalley.com"
            />
            <p className="text-[10px] text-white/25 mt-1">Enter the domain, then add it in Vercel dashboard → Settings → Domains and point a CNAME to cname.vercel-dns.com</p>
          </div>
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
            <label className={labelClass}>Number Color <span className="text-white/25 font-normal">(defaults to theme color)</span></label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={numberColor || themeColor}
                onChange={(e) => setNumberColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
              />
              <input
                className={inputClass}
                value={numberColor}
                onChange={(e) => setNumberColor(e.target.value)}
                placeholder="Same as theme color"
              />
              {numberColor && (
                <button type="button" onClick={() => setNumberColor("")} className="text-xs text-white/30 hover:text-white/60 transition-colors">Reset</button>
              )}
            </div>
          </div>
          <div>
            <label className={labelClass}>Highlight Reel URL</label>
            <input
              className={inputClass}
              value={highlightReelUrl}
              onChange={(e) => setHighlightReelUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/... or YouTube/Vimeo link"
            />
            <p className="text-[10px] text-white/20 mt-1">Supports Google Drive folders, individual Drive files, YouTube, and Vimeo. Shows as hero button.</p>
          </div>
          <div>
            <label className={labelClass}>Resume PDF</label>
            <PdfUpload
              slug={slug}
              currentUrl={resumeUrl}
              onUpload={setResumeUrl}
            />
          </div>
          <div>
            <label className={labelClass}>Stats Bar</label>
            <label className="flex items-center gap-3 mt-1 cursor-pointer">
              <button
                type="button"
                onClick={() => setShowStatsBar(!showStatsBar)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showStatsBar ? "bg-blue-500" : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showStatsBar ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-white/50">
                {showStatsBar ? "Visible" : "Hidden"}
              </span>
            </label>
          </div>
          <div>
            <label className={labelClass}>Light Mode</label>
            <label className="flex items-center gap-3 mt-1 cursor-pointer">
              <button
                type="button"
                onClick={() => setLightMode(!lightMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  lightMode ? "bg-yellow-400" : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    lightMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-white/50">
                {lightMode ? "Light" : "Dark"}
              </span>
            </label>
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
        </div>
      </details>

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
