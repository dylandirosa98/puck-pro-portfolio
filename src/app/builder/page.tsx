"use client";

import { useEffect, useMemo, useState } from "react";
import PlayerTemplate from "@/components/PlayerTemplate";
import ImageUpload from "@/components/admin/ImageUpload";
import MediaPhotoUpload from "@/components/admin/MediaPhotoUpload";
import MediaVideoUpload from "@/components/admin/MediaVideoUpload";
import type { Highlight, MediaItem, Player, PlayerStats, Skillset, SocialLink } from "@/lib/types";

const STORAGE_KEY = "puckpro_builder_draft_v2";

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

const defaultDraft: Player = {
  slug: "preview",
  firstName: "",
  lastName: "",
  position: "Forward",
  number: 0,
  team: "",
  league: "",
  hometown: "",
  height: "",
  weight: "",
  shoots: "Left",
  birthYear: 2008,
  bio: "",
  headshotUrl: "/images/headshot-placeholder.svg",
  heroImageUrl: "/images/hero-placeholder.svg",
  teamLogoUrl: "",
  currentStats: { ...emptyStats },
  seasonHistory: [],
  highlights: [],
  socialLinks: [],
  themeColor: "#b91c1c",
  numberColor: "",
  highlightReelUrl: "",
  resumeUrl: "",
  skillsets: [],
  media: [],
  interests: "",
  interestsMedia: [],
  trainingDescription: "",
  trainingVideos: [],
  timeline: [],
  transcriptUrl: "",
  showStatsBar: true,
  lightMode: false,
  sectionOrder: ["about", "skillsets", "interests", "training", "timeline", "career-stats", "highlights"],
};

type StepId = "info" | "photos" | "style" | "stats" | "content" | "links" | "review";

type Step = {
  id: StepId;
  label: string;
  caption: string;
};

const steps: Step[] = [
  { id: "info", label: "Player Info", caption: "Core roster details" },
  { id: "photos", label: "Photos", caption: "Hero, headshot, logo" },
  { id: "style", label: "Style", caption: "Colors and page mode" },
  { id: "stats", label: "Stats", caption: "Skater or goalie numbers" },
  { id: "content", label: "Content", caption: "Skills, media, training" },
  { id: "links", label: "Links", caption: "Socials and documents" },
  { id: "review", label: "Review", caption: "Check and publish later" },
];

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

const skaterStats: [keyof PlayerStats, string][] = [
  ["gamesPlayed", "GP"],
  ["goals", "G"],
  ["assists", "A"],
  ["points", "PTS"],
  ["plusMinus", "+/-"],
  ["pim", "PIM"],
];

const goalieStats: [keyof PlayerStats, string][] = [
  ["gamesPlayed", "GP"],
  ["wins", "W"],
  ["losses", "L"],
  ["goalsAgainstAverage", "GAA"],
  ["savePercentage", "SV%"],
  ["shutouts", "SO"],
];

const inputClass = "w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/30";
const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40";
const buttonClass = "rounded-lg border border-white/10 px-2.5 py-2 text-xs font-semibold text-white/55 transition hover:border-white/25 hover:text-white sm:px-3";

function mergeDraft(value: unknown): Player {
  if (!value || typeof value !== "object") return defaultDraft;
  return {
    ...defaultDraft,
    ...(value as Partial<Player>),
    currentStats: { ...emptyStats, ...((value as Partial<Player>).currentStats ?? {}) },
    seasonHistory: (value as Partial<Player>).seasonHistory ?? [],
    highlights: (value as Partial<Player>).highlights ?? [],
    socialLinks: (value as Partial<Player>).socialLinks ?? [],
    skillsets: (value as Partial<Player>).skillsets ?? [],
    media: (value as Partial<Player>).media ?? [],
    interestsMedia: (value as Partial<Player>).interestsMedia ?? [],
    trainingVideos: (value as Partial<Player>).trainingVideos ?? [],
    timeline: (value as Partial<Player>).timeline ?? [],
    sectionOrder: (value as Partial<Player>).sectionOrder ?? defaultDraft.sectionOrder,
  };
}

function completionFor(step: StepId, draft: Player) {
  switch (step) {
    case "info":
      return [draft.firstName, draft.lastName, draft.position, draft.team, draft.league].filter(Boolean).length;
    case "photos":
      return [draft.headshotUrl && !draft.headshotUrl.includes("placeholder"), draft.heroImageUrl && !draft.heroImageUrl.includes("placeholder"), draft.teamLogoUrl].filter(Boolean).length;
    case "style":
      return [draft.themeColor, draft.numberColor || draft.themeColor].filter(Boolean).length;
    case "stats":
      return Object.values(draft.currentStats).some((value) => Number(value) > 0) ? 1 : 0;
    case "content":
      return [draft.bio, ...(draft.skillsets ?? []).map((skill) => skill.name), (draft.media ?? []).length, draft.highlights.length, (draft.trainingVideos ?? []).length, draft.interests].filter(Boolean).length;
    case "links":
      return [draft.resumeUrl, draft.transcriptUrl, ...draft.socialLinks.map((link) => link.url)].filter(Boolean).length;
    case "review":
      return draft.firstName && draft.lastName ? 1 : 0;
  }
}

function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function uploadSlugFor(draft: Player) {
  return [draft.firstName, draft.lastName]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-") || "builder-draft";
}

export default function BuilderPage() {
  const [draft, setDraft] = useState<Player>(defaultDraft);
  const [activeStep, setActiveStep] = useState<StepId>("info");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDraft(mergeDraft(JSON.parse(saved)));
    } catch {
      setDraft(defaultDraft);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft, loaded]);

  const activeIndex = steps.findIndex((step) => step.id === activeStep);
  const previewPlayer = useMemo<Player>(() => ({ ...draft, slug: draft.slug || "preview" }), [draft]);

  function update(updates: Partial<Player>) {
    setDraft((prev) => ({ ...prev, ...updates }));
  }

  function nextStep() {
    const next = steps[Math.min(steps.length - 1, activeIndex + 1)];
    setActiveStep(next.id);
  }

  function previousStep() {
    const previous = steps[Math.max(0, activeIndex - 1)];
    setActiveStep(previous.id);
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="border-b border-white/10 bg-black/60 px-4 py-3 backdrop-blur lg:sticky lg:top-0 lg:z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">Puck Pro Builder</p>
            <h1 className="text-lg font-bold">Build your portfolio</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-white/35 sm:inline">Draft autosaves locally</span>
            <button type="button" onClick={() => setPreviewOpen(true)} className={`${buttonClass} lg:hidden`}>
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <nav className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
            {steps.map((step, index) => {
              const complete = completionFor(step.id, draft);
              const active = step.id === activeStep;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${active ? "bg-white text-black" : "text-white/60 hover:bg-white/[0.06] hover:text-white"}`}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-black text-white" : "bg-white/10 text-white/50"}`}>{index + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{step.label}</span>
                    <span className={`block truncate text-[11px] ${active ? "text-black/55" : "text-white/30"}`}>{step.caption}</span>
                  </span>
                  {complete > 0 && <span className={`text-[10px] font-bold ${active ? "text-black/45" : "text-white/30"}`}>Done</span>}
                </button>
              );
            })}
          </nav>

          <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <StepEditor draft={draft} step={activeStep} update={update} />
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <button type="button" onClick={previousStep} disabled={activeIndex === 0} className={`${buttonClass} disabled:opacity-30`}>
                Back
              </button>
              <button type="button" onClick={nextStep} disabled={activeIndex === steps.length - 1} className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-white/85 disabled:opacity-30">
                Continue
              </button>
            </div>
          </section>
        </aside>

        <section className="hidden min-h-[calc(100vh-96px)] overflow-hidden rounded-xl border border-white/10 bg-black lg:block">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">Live Preview</span>
            <span className="text-xs text-white/30">Updates before publishing</span>
          </div>
          <div className="h-[calc(100vh-145px)] overflow-y-auto">
            <PlayerTemplate player={previewPlayer} />
          </div>
        </section>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black lg:hidden">
          <div className="flex items-center justify-between border-b border-white/10 bg-black px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Preview</span>
            <button type="button" onClick={() => setPreviewOpen(false)} className={buttonClass}>Close</button>
          </div>
          <div className="h-[calc(100vh-57px)] overflow-y-auto">
            <PlayerTemplate player={previewPlayer} />
          </div>
        </div>
      )}
    </main>
  );
}

function StepEditor({ draft, step, update }: { draft: Player; step: StepId; update: (updates: Partial<Player>) => void }) {
  if (step === "info") return <InfoStep draft={draft} update={update} />;
  if (step === "photos") return <PhotosStep draft={draft} update={update} />;
  if (step === "style") return <StyleStep draft={draft} update={update} />;
  if (step === "stats") return <StatsStep draft={draft} update={update} />;
  if (step === "content") return <ContentStep draft={draft} update={update} />;
  if (step === "links") return <LinksStep draft={draft} update={update} />;
  return <ReviewStep draft={draft} />;
}

function SectionHeader({ title, body }: { title: string; body: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold">{title}</h2>
      <p className="mt-1 text-sm text-white/40">{body}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function InfoStep({ draft, update }: { draft: Player; update: (updates: Partial<Player>) => void }) {
  return (
    <div>
      <SectionHeader title="Player Info" body="Start with the details that make the profile feel real." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="First Name"><input className={inputClass} value={draft.firstName} onChange={(e) => update({ firstName: e.target.value })} /></Field>
        <Field label="Last Name"><input className={inputClass} value={draft.lastName} onChange={(e) => update({ lastName: e.target.value })} /></Field>
        <Field label="Position">
          <select className={inputClass} value={draft.position} onChange={(e) => update({ position: e.target.value })}>
            <option value="Forward">Forward</option>
            <option value="Defense">Defense</option>
            <option value="Goalie">Goalie</option>
          </select>
        </Field>
        <Field label="Number"><input className={inputClass} type="number" value={draft.number} onChange={(e) => update({ number: Number(e.target.value) || 0 })} /></Field>
        <Field label="Team"><input className={inputClass} value={draft.team} onChange={(e) => update({ team: e.target.value })} /></Field>
        <Field label="League"><input className={inputClass} value={draft.league} onChange={(e) => update({ league: e.target.value })} /></Field>
        <Field label="Hometown"><input className={inputClass} value={draft.hometown} onChange={(e) => update({ hometown: e.target.value })} /></Field>
        <Field label={draft.position === "Goalie" ? "Catches" : "Shoots"}>
          <select className={inputClass} value={draft.shoots} onChange={(e) => update({ shoots: e.target.value as "Left" | "Right" })}>
            <option value="Left">Left</option>
            <option value="Right">Right</option>
          </select>
        </Field>
        <Field label="Height"><input className={inputClass} value={draft.height} onChange={(e) => update({ height: e.target.value })} placeholder={'5\'10"'} /></Field>
        <Field label="Weight"><input className={inputClass} value={draft.weight} onChange={(e) => update({ weight: e.target.value })} placeholder="170 lbs" /></Field>
        <Field label="Birth Year"><input className={inputClass} type="number" value={draft.birthYear} onChange={(e) => update({ birthYear: Number(e.target.value) || 2008 })} /></Field>
      </div>
    </div>
  );
}

function PhotosStep({ draft, update }: { draft: Player; update: (updates: Partial<Player>) => void }) {
  const uploadSlug = uploadSlugFor(draft);

  return (
    <div>
      <SectionHeader title="Photos" body="Upload the core profile images. Hero and logo uploads can remove backgrounds when needed." />
      <div className="space-y-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <span className={labelClass}>Headshot</span>
          <div className="mt-2">
            <ImageUpload slug={uploadSlug} folder="headshot" currentUrl={draft.headshotUrl} onUpload={(url) => update({ headshotUrl: url })} />
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <span className={labelClass}>Hero Image</span>
          <div className="mt-2">
            <ImageUpload slug={uploadSlug} folder="hero" currentUrl={draft.heroImageUrl} onUpload={(url) => update({ heroImageUrl: url })} />
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <span className={labelClass}>Team Logo</span>
          <div className="mt-2">
            <ImageUpload slug={uploadSlug} folder="logo" currentUrl={draft.teamLogoUrl ?? ""} onUpload={(url) => update({ teamLogoUrl: url })} />
          </div>
        </div>
      </div>
      <details className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <summary className="cursor-pointer text-xs font-semibold text-white/40">Advanced: paste image URLs</summary>
        <div className="mt-3 space-y-3">
          <Field label="Headshot URL"><input className={inputClass} value={draft.headshotUrl} onChange={(e) => update({ headshotUrl: e.target.value })} /></Field>
          <Field label="Hero Image URL"><input className={inputClass} value={draft.heroImageUrl} onChange={(e) => update({ heroImageUrl: e.target.value })} /></Field>
          <Field label="Team Logo URL"><input className={inputClass} value={draft.teamLogoUrl ?? ""} onChange={(e) => update({ teamLogoUrl: e.target.value })} /></Field>
        </div>
      </details>
    </div>
  );
}

function StyleStep({ draft, update }: { draft: Player; update: (updates: Partial<Player>) => void }) {
  return (
    <div>
      <SectionHeader title="Style" body="Set the page colors early so the preview feels close to final." />
      <div className="space-y-3">
        <Field label="Theme Color"><input className={`${inputClass} h-11`} type="color" value={draft.themeColor} onChange={(e) => update({ themeColor: e.target.value })} /></Field>
        <Field label="Number Color"><input className={`${inputClass} h-11`} type="color" value={draft.numberColor || draft.themeColor} onChange={(e) => update({ numberColor: e.target.value })} /></Field>
        <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white/65">
          <input type="checkbox" checked={!!draft.lightMode} onChange={(e) => update({ lightMode: e.target.checked })} />
          Use light mode
        </label>
      </div>
    </div>
  );
}

function StatsStep({ draft, update }: { draft: Player; update: (updates: Partial<Player>) => void }) {
  const fields = draft.position === "Goalie" ? goalieStats : skaterStats;
  return (
    <div>
      <SectionHeader title="Stats" body="The fields change automatically for goalies." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fields.map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              className={inputClass}
              type="number"
              step={key === "savePercentage" || key === "goalsAgainstAverage" ? "0.001" : "1"}
              value={draft.currentStats[key] ?? 0}
              onChange={(e) => update({ currentStats: { ...draft.currentStats, [key]: Number(e.target.value) || 0 } })}
            />
          </Field>
        ))}
      </div>
      <label className="mt-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white/65">
        <input type="checkbox" checked={draft.showStatsBar ?? true} onChange={(e) => update({ showStatsBar: e.target.checked })} />
        Show stats bar on profile
      </label>
    </div>
  );
}

type ContentPanel = "skills" | "media" | "highlights" | "training" | "interests";

type ContentIndexes = Record<ContentPanel, number> & { skillVideos: number };

const contentTabs: { id: ContentPanel; label: string }[] = [
  { id: "skills", label: "Player Profile" },
  { id: "media", label: "Main Media" },
  { id: "highlights", label: "Highlights" },
  { id: "training", label: "Training" },
  { id: "interests", label: "Outside the Rink" },
];

function ContentStep({ draft, update }: { draft: Player; update: (updates: Partial<Player>) => void }) {
  const [activePanel, setActivePanel] = useState<ContentPanel>("skills");
  const [indexes, setIndexes] = useState<ContentIndexes>({
    skills: 0,
    media: 0,
    highlights: 0,
    training: 0,
    interests: 0,
    skillVideos: 0,
  });
  const uploadSlug = uploadSlugFor(draft);

  function setIndex(key: keyof ContentIndexes, value: number) {
    setIndexes((prev) => ({ ...prev, [key]: Math.max(0, value) }));
  }

  function updateAndClamp(updates: Partial<Player>, key: keyof ContentIndexes, nextCount: number) {
    update(updates);
    setIndexes((prev) => ({ ...prev, [key]: Math.min(prev[key], Math.max(0, nextCount - 1)) }));
  }

  return (
    <div>
      <SectionHeader title="Content" body="Edit one section and one slide at a time, the same way visitors move through the site." />
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {contentTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActivePanel(tab.id)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${activePanel === tab.id ? "border-white bg-white text-black" : "border-white/10 bg-white/[0.04] text-white/50 hover:border-white/25 hover:text-white"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activePanel === "skills" && (
        <SkillsContentEditor
          draft={draft}
          uploadSlug={uploadSlug}
          skillIndex={indexes.skills}
          videoIndex={indexes.skillVideos}
          onSkillIndex={(value) => setIndex("skills", value)}
          onVideoIndex={(value) => setIndex("skillVideos", value)}
          update={update}
          updateAndClamp={updateAndClamp}
        />
      )}
      {activePanel === "media" && (
        <MediaContentEditor
          title="Main Media Carousel"
          body="These are the photos and videos shown in the main media carousel."
          items={draft.media ?? []}
          index={indexes.media}
          uploadSlug={uploadSlug}
          uploadOffset={0}
          onIndex={(value) => setIndex("media", value)}
          onChange={(items) => updateAndClamp({ media: items }, "media", items.length)}
        />
      )}
      {activePanel === "highlights" && (
        <HighlightsContentEditor
          highlights={draft.highlights}
          index={indexes.highlights}
          uploadSlug={uploadSlug}
          onIndex={(value) => setIndex("highlights", value)}
          onChange={(highlights) => updateAndClamp({ highlights }, "highlights", highlights.length)}
        />
      )}
      {activePanel === "training" && (
        <TrainingContentEditor
          draft={draft}
          index={indexes.training}
          uploadSlug={uploadSlug}
          onIndex={(value) => setIndex("training", value)}
          onChange={(trainingVideos) => updateAndClamp({ trainingVideos }, "training", trainingVideos.length)}
          update={update}
        />
      )}
      {activePanel === "interests" && (
        <InterestsContentEditor
          draft={draft}
          index={indexes.interests}
          uploadSlug={uploadSlug}
          onIndex={(value) => setIndex("interests", value)}
          onChange={(items) => updateAndClamp({ interestsMedia: items }, "interests", items.length)}
          update={update}
        />
      )}
    </div>
  );
}

function CarouselEditor({
  title,
  count,
  index,
  addLabel,
  emptyText,
  onIndex,
  onAdd,
  onRemove,
  onMove,
  children,
}: {
  title: string;
  count: number;
  index: number;
  addLabel: string;
  emptyText: string;
  onIndex: (index: number) => void;
  onAdd: () => void;
  onRemove: () => void;
  onMove: (direction: number) => void;
  children: React.ReactNode;
}) {
  const hasItems = count > 0;

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-white/85">{title}</h3>
          <p className="text-[11px] text-white/30">{hasItems ? `${index + 1} / ${count}` : emptyText}</p>
        </div>
        <button type="button" className={buttonClass} onClick={onAdd}>{addLabel}</button>
      </div>

      {hasItems ? (
        <>
          <div className="mb-3 flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/20 p-2">
            <button type="button" className={buttonClass} onClick={() => onIndex(index - 1)} disabled={index === 0}>Previous</button>
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" className={buttonClass} onClick={() => onMove(-1)}>Move Earlier</button>
              <button type="button" className={buttonClass} onClick={() => onMove(1)}>Move Later</button>
              <button type="button" className={buttonClass} onClick={onRemove}>Remove</button>
            </div>
            <button type="button" className={buttonClass} onClick={() => onIndex(index + 1)} disabled={index === count - 1}>Next</button>
          </div>
          {children}
        </>
      ) : (
        <button type="button" onClick={onAdd} className="w-full rounded-lg border border-dashed border-white/15 px-3 py-8 text-sm text-white/35 transition hover:border-white/30 hover:text-white/60">
          {emptyText}
        </button>
      )}
    </div>
  );
}

function SkillsContentEditor({
  draft,
  uploadSlug,
  skillIndex,
  videoIndex,
  onSkillIndex,
  onVideoIndex,
  update,
  updateAndClamp,
}: {
  draft: Player;
  uploadSlug: string;
  skillIndex: number;
  videoIndex: number;
  onSkillIndex: (index: number) => void;
  onVideoIndex: (index: number) => void;
  update: (updates: Partial<Player>) => void;
  updateAndClamp: (updates: Partial<Player>, key: keyof ContentIndexes, nextCount: number) => void;
}) {
  const skills = draft.skillsets ?? [];
  const index = Math.min(skillIndex, Math.max(0, skills.length - 1));
  const skill = skills[index];

  function setSkills(next: Skillset[]) {
    updateAndClamp({ skillsets: next }, "skills", next.length);
  }

  return (
    <div className="space-y-4">
      <Field label="Bio"><textarea className={inputClass} rows={5} value={draft.bio} onChange={(e) => update({ bio: e.target.value })} /></Field>
      <CarouselEditor
        title="Skill Cards"
        count={skills.length}
        index={index}
        addLabel="Add Skill"
        emptyText="Add the first player profile skill card"
        onIndex={(value) => onSkillIndex(Math.max(0, Math.min(skills.length - 1, value)))}
        onAdd={() => {
          setSkills([...skills, { name: "", description: "", videoDisplay: "button", videos: [] }]);
          onSkillIndex(skills.length);
          onVideoIndex(0);
        }}
        onRemove={() => {
          setSkills(skills.filter((_, i) => i !== index));
          onVideoIndex(0);
        }}
        onMove={(direction) => setSkills(moveItem(skills, index, index + direction))}
      >
        {skill && (
          <SkillSlideEditor
            skill={skill}
            uploadSlug={uploadSlug}
            videoIndex={videoIndex}
            onVideoIndex={onVideoIndex}
            onChange={(next) => setSkills(skills.map((item, i) => i === index ? next : item))}
          />
        )}
      </CarouselEditor>
    </div>
  );
}

function SkillSlideEditor({ skill, uploadSlug, videoIndex, onVideoIndex, onChange }: { skill: Skillset; uploadSlug: string; videoIndex: number; onVideoIndex: (index: number) => void; onChange: (skill: Skillset) => void }) {
  const videos = skill.videos ?? [];
  const index = Math.min(videoIndex, Math.max(0, videos.length - 1));
  const video = videos[index];

  function setVideos(next: MediaItem[]) {
    onChange({
      ...skill,
      videos: next,
      watchUrl: next[0]?.url ?? "",
      thumbnailUrl: next[0]?.thumbnailUrl,
      muxPlaybackId: next[0]?.muxPlaybackId,
      muxAssetId: next[0]?.muxAssetId,
      muxUploadId: next[0]?.muxUploadId,
    });
    onVideoIndex(Math.min(index, Math.max(0, next.length - 1)));
  }

  return (
    <div className="space-y-4">
      <Field label="Skill Name"><input className={inputClass} value={skill.name} onChange={(e) => onChange({ ...skill, name: e.target.value })} /></Field>
      <Field label="Description"><textarea className={inputClass} rows={3} value={skill.description} onChange={(e) => onChange({ ...skill, description: e.target.value })} /></Field>
      <Field label="Display">
        <select className={inputClass} value={skill.videoDisplay ?? "button"} onChange={(e) => onChange({ ...skill, videoDisplay: e.target.value as "button" | "embed" })}>
          <option value="button">Button opens popup</option>
          <option value="embed">Embed in card</option>
        </select>
      </Field>
      <CarouselEditor
        title="Skill Videos"
        count={videos.length}
        index={index}
        addLabel="Add Video"
        emptyText="Add a video for this skill"
        onIndex={(value) => onVideoIndex(Math.max(0, Math.min(videos.length - 1, value)))}
        onAdd={() => {
          setVideos([...videos, { type: "video", url: "", title: skill.name }]);
          onVideoIndex(videos.length);
        }}
        onRemove={() => setVideos(videos.filter((_, i) => i !== index))}
        onMove={(direction) => setVideos(moveItem(videos, index, index + direction))}
      >
        {video && (
          <MediaItemFields
            item={video}
            label={`Skill Video ${index + 1}`}
            uploadSlug={uploadSlug}
            uploadIndex={700 + index}
            lockType="video"
            onChange={(next) => setVideos(videos.map((item, i) => i === index ? next : item))}
            onRemove={() => setVideos(videos.filter((_, i) => i !== index))}
            onMove={(direction) => setVideos(moveItem(videos, index, index + direction))}
          />
        )}
      </CarouselEditor>
    </div>
  );
}

function MediaContentEditor({ title, body, items, index, uploadSlug, uploadOffset, defaultType = "photo", onIndex, onChange }: { title: string; body: string; items: MediaItem[]; index: number; uploadSlug: string; uploadOffset: number; defaultType?: "photo" | "video"; onIndex: (index: number) => void; onChange: (items: MediaItem[]) => void }) {
  const safeIndex = Math.min(index, Math.max(0, items.length - 1));
  const item = items[safeIndex];

  function setItems(next: MediaItem[]) {
    onChange(next);
    onIndex(Math.min(safeIndex, Math.max(0, next.length - 1)));
  }

  return (
    <div className="space-y-4">
      <SectionHeader title={title} body={body} />
      <CarouselEditor
        title={title}
        count={items.length}
        index={safeIndex}
        addLabel="Add Item"
        emptyText="Add the first carousel item"
        onIndex={(value) => onIndex(Math.max(0, Math.min(items.length - 1, value)))}
        onAdd={() => {
          onChange([...items, { type: defaultType, url: "", title: "" }]);
          onIndex(items.length);
        }}
        onRemove={() => setItems(items.filter((_, i) => i !== safeIndex))}
        onMove={(direction) => setItems(moveItem(items, safeIndex, safeIndex + direction))}
      >
        {item && (
          <MediaItemFields
            item={item}
            label={`${title} Item ${safeIndex + 1}`}
            uploadSlug={uploadSlug}
            uploadIndex={uploadOffset + safeIndex}
            lockType={defaultType === "video" ? "video" : undefined}
            onChange={(next) => setItems(items.map((current, i) => i === safeIndex ? next : current))}
            onRemove={() => setItems(items.filter((_, i) => i !== safeIndex))}
            onMove={(direction) => setItems(moveItem(items, safeIndex, safeIndex + direction))}
          />
        )}
      </CarouselEditor>
    </div>
  );
}

function HighlightsContentEditor({ highlights, index, uploadSlug, onIndex, onChange }: { highlights: Highlight[]; index: number; uploadSlug: string; onIndex: (index: number) => void; onChange: (items: Highlight[]) => void }) {
  const safeIndex = Math.min(index, Math.max(0, highlights.length - 1));
  const highlight = highlights[safeIndex];

  function setHighlights(next: Highlight[]) {
    onChange(next);
    onIndex(Math.min(safeIndex, Math.max(0, next.length - 1)));
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Highlights" body="Edit one highlight video at a time." />
      <CarouselEditor
        title="Highlights"
        count={highlights.length}
        index={safeIndex}
        addLabel="Add Highlight"
        emptyText="Add the first highlight video"
        onIndex={(value) => onIndex(Math.max(0, Math.min(highlights.length - 1, value)))}
        onAdd={() => {
          onChange([...highlights, { title: "", url: "" }]);
          onIndex(highlights.length);
        }}
        onRemove={() => setHighlights(highlights.filter((_, i) => i !== safeIndex))}
        onMove={(direction) => setHighlights(moveItem(highlights, safeIndex, safeIndex + direction))}
      >
        {highlight && (
          <div className="space-y-3">
            <Field label="Title"><input className={inputClass} value={highlight.title} onChange={(e) => setHighlights(highlights.map((item, i) => i === safeIndex ? { ...item, title: e.target.value } : item))} /></Field>
            <MediaVideoUpload
              item={{
                type: "video",
                url: highlight.url,
                title: highlight.title,
                thumbnailUrl: highlight.thumbnailUrl,
                muxPlaybackId: highlight.muxPlaybackId,
                muxAssetId: highlight.muxAssetId,
                muxUploadId: highlight.muxUploadId,
              }}
              slug={uploadSlug}
              inputClass={inputClass}
              labelClass={labelClass}
              allowAudioChoice={false}
              onChange={(next) => setHighlights(highlights.map((item, i) => i === safeIndex ? {
                ...item,
                url: next.url,
                thumbnailUrl: next.thumbnailUrl,
                muxPlaybackId: next.muxPlaybackId,
                muxAssetId: next.muxAssetId,
                muxUploadId: next.muxUploadId,
              } : item))}
            />
          </div>
        )}
      </CarouselEditor>
    </div>
  );
}

function TrainingContentEditor({ draft, index, uploadSlug, onIndex, onChange, update }: { draft: Player; index: number; uploadSlug: string; onIndex: (index: number) => void; onChange: (items: NonNullable<Player["trainingVideos"]>) => void; update: (updates: Partial<Player>) => void }) {
  const training = draft.trainingVideos ?? [];
  const mediaItems = training.map((item) => ({ type: "video" as const, url: item.url, title: item.title, thumbnailUrl: item.thumbnailUrl, muxPlaybackId: item.muxPlaybackId, muxAssetId: item.muxAssetId, muxUploadId: item.muxUploadId }));

  function setMediaItems(items: MediaItem[]) {
    onChange(items.map((item) => ({ url: item.url, title: item.title, thumbnailUrl: item.thumbnailUrl, muxPlaybackId: item.muxPlaybackId, muxAssetId: item.muxAssetId, muxUploadId: item.muxUploadId })));
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Training" body="Edit one training slide at a time." />
      <Field label="Shared Training Description"><textarea className={inputClass} rows={3} value={draft.trainingDescription ?? ""} onChange={(e) => update({ trainingDescription: e.target.value })} /></Field>
      <MediaContentEditor
        title="Training Slides"
        body="Each slide can have its own title and Mux video."
        items={mediaItems}
        index={index}
        uploadSlug={uploadSlug}
        uploadOffset={300}
        defaultType="video"
        onIndex={onIndex}
        onChange={setMediaItems}
      />
    </div>
  );
}

function InterestsContentEditor({ draft, index, uploadSlug, onIndex, onChange, update }: { draft: Player; index: number; uploadSlug: string; onIndex: (index: number) => void; onChange: (items: MediaItem[]) => void; update: (updates: Partial<Player>) => void }) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Outside the Rink" body="Add the section text, then edit one media slide at a time." />
      <Field label="Section Text"><textarea className={inputClass} rows={4} value={draft.interests ?? ""} onChange={(e) => update({ interests: e.target.value })} /></Field>
      <MediaContentEditor
        title="Outside the Rink Media"
        body="Photos and videos for life outside hockey."
        items={draft.interestsMedia ?? []}
        index={index}
        uploadSlug={uploadSlug}
        uploadOffset={500}
        onIndex={onIndex}
        onChange={onChange}
      />
    </div>
  );
}

function MediaItemFields({ item, label, uploadSlug, uploadIndex, lockType, onChange, onRemove, onMove }: { item: MediaItem; label: string; uploadSlug: string; uploadIndex: number; lockType?: "photo" | "video"; onChange: (item: MediaItem) => void; onRemove: () => void; onMove: (direction: number) => void }) {
  const shownType = lockType ?? item.type;

  return (
    <div className="rounded-lg border border-white/10 p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-white/35">{label}</span>
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className={buttonClass} onClick={() => onMove(-1)}>Up</button>
          <button type="button" className={buttonClass} onClick={() => onMove(1)}>Down</button>
          <button type="button" className={buttonClass} onClick={onRemove}>Remove</button>
        </div>
      </div>
      <div className="space-y-3">
        {!lockType && (
          <Field label="Type">
            <select className={inputClass} value={item.type} onChange={(e) => onChange({ ...item, type: e.target.value as "photo" | "video", url: "", thumbnailUrl: undefined, muxPlaybackId: undefined, muxAssetId: undefined, muxUploadId: undefined })}>
              <option value="photo">Photo</option>
              <option value="video">Video</option>
            </select>
          </Field>
        )}
        <Field label="Title"><input className={inputClass} value={item.title ?? ""} onChange={(e) => onChange({ ...item, title: e.target.value })} /></Field>
        {shownType === "photo" ? (
          <div className="space-y-3">
            <div>
              <span className={labelClass}>Upload Photo</span>
              <MediaPhotoUpload slug={uploadSlug} index={uploadIndex} currentUrl={item.url} onUpload={(url) => onChange({ ...item, type: "photo", url })} />
            </div>
            <details className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <summary className="cursor-pointer text-xs font-semibold text-white/40">Advanced: paste photo URL</summary>
              <div className="mt-3">
                <Field label="Photo URL"><input className={inputClass} value={item.url} onChange={(e) => onChange({ ...item, type: "photo", url: e.target.value })} /></Field>
              </div>
            </details>
          </div>
        ) : (
          <MediaVideoUpload
            item={{ ...item, type: "video" }}
            slug={uploadSlug}
            inputClass={inputClass}
            labelClass={labelClass}
            allowAudioChoice={false}
            onChange={(next) => onChange({ ...next, type: "video" })}
          />
        )}
      </div>
    </div>
  );
}

function LinksStep({ draft, update }: { draft: Player; update: (updates: Partial<Player>) => void }) {
  const links = draft.socialLinks;
  return (
    <div>
      <SectionHeader title="Links" body="Add the places coaches should be able to open from the portfolio." />
      <div className="space-y-4">
        <Field label="Resume URL"><input className={inputClass} value={draft.resumeUrl ?? ""} onChange={(e) => update({ resumeUrl: e.target.value })} /></Field>
        <Field label="Transcript URL"><input className={inputClass} value={draft.transcriptUrl ?? ""} onChange={(e) => update({ transcriptUrl: e.target.value })} /></Field>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={labelClass}>Social Links</span>
            <button type="button" className={buttonClass} onClick={() => update({ socialLinks: [...links, { platform: "instagram", url: "" }] })}>Add Link</button>
          </div>
          {links.map((link, index) => (
            <div key={index} className="rounded-lg border border-white/10 p-3">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-white/35">Link {index + 1}</span>
                <button type="button" className={buttonClass} onClick={() => update({ socialLinks: links.filter((_, i) => i !== index) })}>Remove</button>
              </div>
              <div className="space-y-3">
                <Field label="Platform">
                  <select className={inputClass} value={link.platform} onChange={(e) => update({ socialLinks: links.map((item, i) => i === index ? { ...item, platform: e.target.value as SocialLink["platform"] } : item) })}>
                    {platformOptions.map((platform) => <option key={platform} value={platform}>{platformLabels[platform]}</option>)}
                  </select>
                </Field>
                <Field label="URL"><input className={inputClass} value={link.url} onChange={(e) => update({ socialLinks: links.map((item, i) => i === index ? { ...item, url: e.target.value } : item) })} /></Field>
                {(["eliteprospects", "ncsa", "hudl", "neutralzone"] as SocialLink["platform"][]).includes(link.platform) && (
                  <label className="flex items-center gap-3 text-sm text-white/60">
                    <input type="checkbox" checked={!!link.showInHero} onChange={(e) => update({ socialLinks: links.map((item, i) => i === index ? { ...item, showInHero: e.target.checked } : item) })} />
                    Show in hero
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ draft }: { draft: Player }) {
  const checks = [
    ["Name", !!draft.firstName && !!draft.lastName],
    ["Team", !!draft.team],
    ["Hero photo", !!draft.heroImageUrl && !draft.heroImageUrl.includes("placeholder")],
    ["Bio", !!draft.bio],
    ["At least one video or highlight", (draft.media ?? []).length > 0 || draft.highlights.length > 0 || (draft.trainingVideos ?? []).length > 0],
  ] as const;

  return (
    <div>
      <SectionHeader title="Review" body="This fresh builder is isolated from the live admin and public pages. Publishing can be wired in after the shared editor pieces are finalized." />
      <div className="space-y-2">
        {checks.map(([label, done]) => (
          <div key={label} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
            <span className="text-white/65">{label}</span>
            <span className={done ? "text-emerald-300" : "text-white/25"}>{done ? "Ready" : "Missing"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
