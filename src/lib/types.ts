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
  userId: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WizardState {
  // Step 1
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
  // Step 2
  bio: string;
  headshotUrl: string;
  heroImageUrl: string;
  themeColor: string;
  // Step 3
  currentStats: PlayerStats;
  seasonHistory: SeasonStats[];
  // Step 4
  highlightReelUrl: string;
  highlights: Highlight[];
  // Step 5
  socialLinks: SocialLink[];
  resumeUrl: string;
}
