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
}

export interface PlayerWithMeta extends Player {
  id: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
