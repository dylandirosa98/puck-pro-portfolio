export interface PlayerStats {
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  pim: number;
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
}

export interface SocialLink {
  platform: "instagram" | "twitter" | "youtube" | "tiktok" | "email";
  url: string;
}

export interface MediaItem {
  type: "photo" | "video";
  url: string;
  title?: string;
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
  skillsets?: { name: string; description: string; watchUrl?: string }[];
  sectionOrder?: string[];
  interests?: string;
  interestsMedia?: MediaItem[];
  trainingVideoUrl?: string;
  trainingDescription?: string;
  trainingVideos?: { url: string }[];
  timeline?: TimelineEntry[];
  transcriptUrl?: string;
  showStatsBar?: boolean;
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
