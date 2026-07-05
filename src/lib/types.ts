export interface PlayerStats {
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  pim: number;
  wins?: number;
  losses?: number;
  goalsAgainstAverage?: number;
  savePercentage?: number;
  shutouts?: number;
}

export interface SeasonStats {
  season: string;
  team: string;
  league: string;
  stats: PlayerStats;
}

export interface Highlight {
  title: string;
  url: string;
  thumbnailUrl?: string;
  muxPlaybackId?: string;
  muxAssetId?: string;
  muxUploadId?: string;
}

export interface SocialLink {
  platform: "instagram" | "twitter" | "youtube" | "tiktok" | "email" | "eliteprospects" | "ncsa" | "hudl" | "neutralzone";
  url: string;
  showInHero?: boolean;
}

export interface Skillset {
  name: string;
  description: string;
  watchUrl?: string;
  videoDisplay?: "button" | "embed";
  thumbnailUrl?: string;
  muxPlaybackId?: string;
  muxAssetId?: string;
  muxUploadId?: string;
}

export interface MediaItem {
  type: "photo" | "video";
  url: string;
  title?: string;
  thumbnailUrl?: string;
  muxPlaybackId?: string;
  muxAssetId?: string;
  muxUploadId?: string;
}

export interface TimelineEntry {
  title: string;
  description: string;
  media: MediaItem[];
}

export interface Player {
  slug: string;
  firstName: string;
  lastName: string;
  position: string;
  number: number;
  team: string;
  league: string;
  hometown: string;
  height: string;
  weight: string;
  shoots: "Left" | "Right";
  birthYear: number;
  bio: string;
  headshotUrl: string;
  heroImageUrl: string;
  currentStats: PlayerStats;
  seasonHistory: SeasonStats[];
  highlights: Highlight[];
  socialLinks: SocialLink[];
  themeColor: string;
  highlightReelUrl?: string;
  resumeUrl?: string;
  skillsets?: Skillset[];
  sectionOrder?: string[];
  interests?: string;
  interestsMedia?: MediaItem[];
  trainingVideoUrl?: string;
  trainingDescription?: string;
  trainingVideos?: { url: string; title?: string; description?: string; thumbnailUrl?: string; muxPlaybackId?: string; muxAssetId?: string; muxUploadId?: string }[];
  timeline?: TimelineEntry[];
  transcriptUrl?: string;
  showStatsBar?: boolean;
  lightMode?: boolean;
  customDomain?: string;
  teamLogoUrl?: string;
  numberColor?: string;
  media?: MediaItem[];
}

export interface WizardState {
  firstName: string;
  lastName: string;
  position: string;
  number: number;
  team: string;
  league: string;
  hometown: string;
  height: string;
  weight: string;
  shoots: "Left" | "Right";
  birthYear: number;
  bio: string;
  headshotUrl: string;
  heroImageUrl: string;
  themeColor: string;
  currentStats: PlayerStats;
  seasonHistory: SeasonStats[];
  highlightReelUrl: string;
  highlights: Highlight[];
  socialLinks: SocialLink[];
  resumeUrl: string;
}

export interface PlayerWithMeta extends Player {
  id: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
