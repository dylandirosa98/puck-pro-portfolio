import { Player, PlayerWithMeta } from "@/lib/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PlayerRow {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  position: string;
  number: number;
  team: string;
  league: string;
  hometown: string;
  height: string;
  weight: string;
  shoots: "Left" | "Right";
  birth_year: number;
  bio: string;
  headshot_url: string;
  hero_image_url: string;
  current_stats: any;
  season_history: any;
  highlights: any;
  social_links: any;
  theme_color: string;
  highlight_reel_url: string | null;
  resume_url: string | null;
  skillsets: { name: string; description: string }[] | null;
  section_order: string[] | null;
  interests: string | null;
  training_video_url: string | null;
  training_description: string | null;
  training_videos: { url: string; description: string }[] | null;
  transcript_url: string | null;
  watch_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export function rowToPlayer(row: PlayerRow): PlayerWithMeta {
  return {
    id: row.id,
    slug: row.slug,
    firstName: row.first_name,
    lastName: row.last_name,
    position: row.position,
    number: row.number,
    team: row.team,
    league: row.league,
    hometown: row.hometown,
    height: row.height,
    weight: row.weight,
    shoots: row.shoots,
    birthYear: row.birth_year,
    bio: row.bio,
    headshotUrl: row.headshot_url,
    heroImageUrl: row.hero_image_url,
    currentStats: row.current_stats,
    seasonHistory: row.season_history,
    highlights: row.highlights,
    socialLinks: row.social_links,
    themeColor: row.theme_color,
    highlightReelUrl: row.highlight_reel_url ?? undefined,
    resumeUrl: row.resume_url ?? undefined,
    skillsets: row.skillsets ?? [],
    sectionOrder: row.section_order ?? [],
    interests: row.interests ?? undefined,
    trainingVideoUrl: row.training_video_url ?? undefined,
    trainingDescription: row.training_description ?? undefined,
    trainingVideos: (() => {
      if (row.training_videos && row.training_videos.length > 0) return row.training_videos;
      if (row.training_video_url) return [{ url: row.training_video_url, description: row.training_description ?? "" }];
      return [];
    })(),
    transcriptUrl: row.transcript_url ?? undefined,
    watchUrl: row.watch_url ?? undefined,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function playerToRow(player: Partial<Player>): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (player.slug !== undefined) row.slug = player.slug;
  if (player.firstName !== undefined) row.first_name = player.firstName;
  if (player.lastName !== undefined) row.last_name = player.lastName;
  if (player.position !== undefined) row.position = player.position;
  if (player.number !== undefined) row.number = player.number;
  if (player.team !== undefined) row.team = player.team;
  if (player.league !== undefined) row.league = player.league;
  if (player.hometown !== undefined) row.hometown = player.hometown;
  if (player.height !== undefined) row.height = player.height;
  if (player.weight !== undefined) row.weight = player.weight;
  if (player.shoots !== undefined) row.shoots = player.shoots;
  if (player.birthYear !== undefined) row.birth_year = player.birthYear;
  if (player.bio !== undefined) row.bio = player.bio;
  if (player.headshotUrl !== undefined) row.headshot_url = player.headshotUrl;
  if (player.heroImageUrl !== undefined) row.hero_image_url = player.heroImageUrl;
  if (player.currentStats !== undefined) row.current_stats = player.currentStats;
  if (player.seasonHistory !== undefined) row.season_history = player.seasonHistory;
  if (player.highlights !== undefined) row.highlights = player.highlights;
  if (player.socialLinks !== undefined) row.social_links = player.socialLinks;
  if (player.themeColor !== undefined) row.theme_color = player.themeColor;
  if (player.highlightReelUrl !== undefined) row.highlight_reel_url = player.highlightReelUrl;
  if (player.resumeUrl !== undefined) row.resume_url = player.resumeUrl;
  if (player.skillsets !== undefined) row.skillsets = player.skillsets;
  if (player.sectionOrder !== undefined) row.section_order = player.sectionOrder;
  if (player.interests !== undefined) row.interests = player.interests;
  if (player.trainingVideoUrl !== undefined) row.training_video_url = player.trainingVideoUrl;
  if (player.trainingDescription !== undefined) row.training_description = player.trainingDescription;
  if (player.trainingVideos !== undefined) row.training_videos = player.trainingVideos;
  if (player.transcriptUrl !== undefined) row.transcript_url = player.transcriptUrl;
  if (player.watchUrl !== undefined) row.watch_url = player.watchUrl;

  return row;
}
