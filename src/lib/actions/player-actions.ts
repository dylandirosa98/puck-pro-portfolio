"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export async function createPlayer(formData: FormData) {
  const supabase = await createClient();

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const slugOverride = formData.get("slug") as string;
  const slug = slugOverride || slugify(firstName, lastName);

  const row = {
    slug,
    first_name: firstName,
    last_name: lastName,
    position: formData.get("position") as string,
    number: parseInt(formData.get("number") as string) || 0,
    team: formData.get("team") as string,
    league: formData.get("league") as string,
    hometown: formData.get("hometown") as string,
    height: formData.get("height") as string,
    weight: formData.get("weight") as string,
    shoots: formData.get("shoots") as string,
    birth_year: parseInt(formData.get("birthYear") as string) || 2000,
    bio: formData.get("bio") as string,
    headshot_url: (formData.get("headshotUrl") as string) || "/images/headshot-placeholder.svg",
    hero_image_url: (formData.get("heroImageUrl") as string) || "/images/hero-placeholder.svg",
    current_stats: JSON.parse((formData.get("currentStats") as string) || "{}"),
    season_history: JSON.parse((formData.get("seasonHistory") as string) || "[]"),
    highlights: JSON.parse((formData.get("highlights") as string) || "[]"),
    social_links: JSON.parse((formData.get("socialLinks") as string) || "[]"),
    theme_color: (formData.get("themeColor") as string) || "#b91c1c",
    highlight_reel_url: (formData.get("highlightReelUrl") as string) || null,
    resume_url: (formData.get("resumeUrl") as string) || null,
    is_published: formData.get("isPublished") === "true",
  };

  const { data, error } = await supabase
    .from("players")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { id: data.id, slug };
}

export async function updatePlayer(id: string, formData: FormData) {
  const supabase = await createClient();

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const slugOverride = formData.get("slug") as string;
  const slug = slugOverride || slugify(firstName, lastName);

  const row = {
    slug,
    first_name: firstName,
    last_name: lastName,
    position: formData.get("position") as string,
    number: parseInt(formData.get("number") as string) || 0,
    team: formData.get("team") as string,
    league: formData.get("league") as string,
    hometown: formData.get("hometown") as string,
    height: formData.get("height") as string,
    weight: formData.get("weight") as string,
    shoots: formData.get("shoots") as string,
    birth_year: parseInt(formData.get("birthYear") as string) || 2000,
    bio: formData.get("bio") as string,
    headshot_url: (formData.get("headshotUrl") as string) || "/images/headshot-placeholder.svg",
    hero_image_url: (formData.get("heroImageUrl") as string) || "/images/hero-placeholder.svg",
    current_stats: JSON.parse((formData.get("currentStats") as string) || "{}"),
    season_history: JSON.parse((formData.get("seasonHistory") as string) || "[]"),
    highlights: JSON.parse((formData.get("highlights") as string) || "[]"),
    social_links: JSON.parse((formData.get("socialLinks") as string) || "[]"),
    theme_color: (formData.get("themeColor") as string) || "#b91c1c",
    highlight_reel_url: (formData.get("highlightReelUrl") as string) || null,
    resume_url: (formData.get("resumeUrl") as string) || null,
    is_published: formData.get("isPublished") === "true",
  };

  const { error } = await supabase
    .from("players")
    .update(row)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath(`/${slug}`);
  revalidatePath("/admin");
  return { success: true, slug };
}

export async function deletePlayer(id: string) {
  const supabase = await createClient();

  // Get the player's slug first for storage cleanup
  const { data: player } = await supabase
    .from("players")
    .select("slug")
    .eq("id", id)
    .single();

  if (player) {
    // Clean up storage files
    const { data: files } = await supabase.storage
      .from("player-images")
      .list(player.slug);

    if (files && files.length > 0) {
      const filePaths = files.map((f) => `${player.slug}/${f.name}`);
      await supabase.storage.from("player-images").remove(filePaths);
    }
  }

  const { error } = await supabase
    .from("players")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function togglePublish(id: string, isPublished: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("players")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
