"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rowToPlayer, PlayerRow } from "@/lib/supabase/transforms";
import { WizardState, PlayerWithMeta } from "@/lib/types";
import { revalidatePath } from "next/cache";

function slugify(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export async function getMyPlayer(): Promise<PlayerWithMeta | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!data) return null;
  return rowToPlayer(data as PlayerRow);
}

export async function createBuilderProfile(state: WizardState): Promise<{ id: string; slug: string } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const baseSlug = slugify(state.firstName || "player", state.lastName || user.id.slice(-4));
  const slug = `${baseSlug}-${user.id.slice(-4)}`;

  const { data, error } = await admin
    .from("players")
    .insert({
      slug,
      user_id: user.id,
      first_name: state.firstName,
      last_name: state.lastName,
      position: state.position,
      number: state.number,
      team: state.team,
      league: state.league,
      hometown: state.hometown,
      height: state.height,
      weight: state.weight,
      shoots: state.shoots,
      birth_year: state.birthYear,
      bio: state.bio,
      headshot_url: state.headshotUrl || "/images/headshot-placeholder.svg",
      hero_image_url: state.heroImageUrl || "/images/hero-placeholder.svg",
      current_stats: state.currentStats,
      season_history: state.seasonHistory,
      highlights: state.highlights,
      social_links: state.socialLinks,
      theme_color: state.themeColor,
      highlight_reel_url: state.highlightReelUrl || null,
      resume_url: state.resumeUrl || null,
      is_published: false,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/builder");
  return { id: data.id, slug };
}

export async function updateBuilderProfile(id: string, state: WizardState): Promise<{ success: boolean } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("players")
    .update({
      first_name: state.firstName,
      last_name: state.lastName,
      position: state.position,
      number: state.number,
      team: state.team,
      league: state.league,
      hometown: state.hometown,
      height: state.height,
      weight: state.weight,
      shoots: state.shoots,
      birth_year: state.birthYear,
      bio: state.bio,
      headshot_url: state.headshotUrl || "/images/headshot-placeholder.svg",
      hero_image_url: state.heroImageUrl || "/images/hero-placeholder.svg",
      current_stats: state.currentStats,
      season_history: state.seasonHistory,
      highlights: state.highlights,
      social_links: state.socialLinks,
      theme_color: state.themeColor,
      highlight_reel_url: state.highlightReelUrl || null,
      resume_url: state.resumeUrl || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/builder");
  return { success: true };
}
