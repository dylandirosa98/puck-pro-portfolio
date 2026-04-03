"use server";

import { createClient } from "@/lib/supabase/server";
import { rowToPlayer, playerToRow } from "@/lib/supabase/transforms";
import { PlayerWithMeta, WizardState } from "@/lib/types";

function slugify(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export async function getMyPlayer(): Promise<PlayerWithMeta | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;

  return rowToPlayer(data);
}

export async function createBuilderProfile(
  step1Data: Pick<
    WizardState,
    | "firstName"
    | "lastName"
    | "position"
    | "number"
    | "team"
    | "league"
    | "hometown"
    | "height"
    | "weight"
    | "shoots"
    | "birthYear"
  >
): Promise<{ id: string; slug: string } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Check for existing player row first (idempotent)
  const { data: existing } = await supabase
    .from("players")
    .select("id, slug")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // Update with new step1 data
    const row = playerToRow(step1Data);
    await supabase
      .from("players")
      .update(row)
      .eq("user_id", user.id);
    return { id: existing.id, slug: existing.slug };
  }

  // Create new row
  const slug = slugify(step1Data.firstName, step1Data.lastName);

  const row = {
    ...playerToRow(step1Data),
    slug,
    user_id: user.id,
    is_published: false,
    bio: "",
    headshot_url: "/images/headshot-placeholder.svg",
    hero_image_url: "/images/hero-placeholder.svg",
    current_stats: { gamesPlayed: 0, goals: 0, assists: 0, points: 0, plusMinus: 0, pim: 0 },
    season_history: [],
    highlights: [],
    social_links: [],
    theme_color: "#b91c1c",
    highlight_reel_url: null,
    resume_url: null,
  };

  const { data, error } = await supabase
    .from("players")
    .insert(row)
    .select("id, slug")
    .single();

  if (error) {
    // Slug collision — retry with user ID suffix
    if (error.code === "23505") {
      const fallbackSlug = `${slug}-${user.id.slice(-4)}`;
      const { data: data2, error: error2 } = await supabase
        .from("players")
        .insert({ ...row, slug: fallbackSlug })
        .select("id, slug")
        .single();

      if (error2) return { error: error2.message };
      return { id: data2.id, slug: data2.slug };
    }
    return { error: error.message };
  }

  return { id: data.id, slug: data.slug };
}

export async function updateBuilderProfile(
  id: string,
  partialData: Partial<WizardState>
): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const row = playerToRow(partialData);

  const { error } = await supabase
    .from("players")
    .update(row)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  return { success: true };
}
