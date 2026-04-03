"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WizardState, Player } from "@/lib/types";
import {
  getMyPlayer,
  updateBuilderProfile,
} from "@/lib/actions/builder-actions";
import { createClient } from "@/lib/supabase/client";
import { BUILDER_DEFAULTS } from "@/lib/builder-defaults";
import BuilderProfile, { EditSection } from "@/components/builder/BuilderProfile";
import EditorSheet from "@/components/builder/EditorSheet";

export const LS_KEY = "puckpro_wizard";

export const EMPTY_WIZARD: WizardState = {
  firstName: "",
  lastName: "",
  position: "",
  number: 0,
  team: "",
  league: "",
  hometown: "",
  height: "",
  weight: "",
  shoots: "Left",
  birthYear: 2005,
  bio: "",
  headshotUrl: "",
  heroImageUrl: "",
  themeColor: "#b91c1c",
  currentStats: { gamesPlayed: 0, goals: 0, assists: 0, points: 0, plusMinus: 0, pim: 0 },
  seasonHistory: [],
  highlightReelUrl: "",
  highlights: [],
  socialLinks: [],
  resumeUrl: "",
};

export default function BuilderPage() {
  const router = useRouter();
  const [data, setData] = useState<WizardState>(BUILDER_DEFAULTS);
  const [editSection, setEditSection] = useState<EditSection | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsAuthed(true);
        const player = await getMyPlayer();
        if (player) {
          setPlayerId(player.id);
          setSlug(player.slug);
          setData({
            firstName: player.firstName,
            lastName: player.lastName,
            position: player.position,
            number: player.number,
            team: player.team,
            league: player.league,
            hometown: player.hometown,
            height: player.height,
            weight: player.weight,
            shoots: player.shoots,
            birthYear: player.birthYear,
            bio: player.bio,
            headshotUrl: player.headshotUrl,
            heroImageUrl: player.heroImageUrl,
            themeColor: player.themeColor,
            currentStats: player.currentStats,
            seasonHistory: player.seasonHistory,
            highlightReelUrl: player.highlightReelUrl ?? "",
            highlights: player.highlights,
            socialLinks: player.socialLinks,
            resumeUrl: player.resumeUrl ?? "",
          });
        }
      } else {
        try {
          const saved = localStorage.getItem(LS_KEY);
          if (saved) {
            setData(JSON.parse(saved));
          }
          // If no saved data, keep BUILDER_DEFAULTS
        } catch {
          /* ignore */
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  // Auto-save to localStorage on every data change
  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data, loading]);

  function handleChange(updates: Partial<WizardState>) {
    setData((prev) => ({ ...prev, ...updates }));
  }

  async function handleSave() {
    if (!isAuthed) {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
      } catch {
        /* ignore */
      }
      router.push("/builder/save");
    } else {
      if (playerId) {
        await updateBuilderProfile(playerId, data);
      }
      router.push("/builder/preview");
    }
  }

  const playerForTemplate: Player = {
    ...data,
    slug: slug || "preview",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-6">
          <div className="h-8 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-4 bg-white/5 rounded-2xl animate-pulse w-2/3" />
          <div className="h-14 bg-white/5 rounded-2xl animate-pulse mt-8" />
          <div className="h-14 bg-white/5 rounded-2xl animate-pulse" />
          <div className="h-14 bg-white/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* The full profile */}
      <BuilderProfile player={playerForTemplate} onEdit={setEditSection} />

      {/* Editor sheet */}
      <EditorSheet
        section={editSection}
        data={data}
        slug={slug}
        onChange={handleChange}
        onClose={() => setEditSection(null)}
      />

      {/* Fixed bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 px-4"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <div className="max-w-lg mx-auto mb-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-3xl px-4 pt-4 pb-3">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-[#b91c1c] hover:bg-[#991b1b] active:scale-95 rounded-2xl text-white font-bold text-base transition-all shadow-lg shadow-[#b91c1c]/30"
          >
            Save My Profile →
          </button>
          <button
            onClick={async () => {
              localStorage.removeItem(LS_KEY);
              setData(BUILDER_DEFAULTS);
              if (isAuthed && playerId) {
                await updateBuilderProfile(playerId, BUILDER_DEFAULTS);
              }
            }}
            className="w-full mt-2 py-2 text-white/25 text-xs active:text-white/50 transition-colors"
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
