import { Player } from "./types";

export const mockPlayer: Player = {
  slug: "jack-smalley",
  firstName: "Jack",
  lastName: "Smalley",
  position: "Forward",
  number: 19,
  team: "NJ Rockets",
  league: "AYHL",
  hometown: "Montclair, NJ",
  height: "5'6\"",
  weight: "140 lbs",
  shoots: "Left",
  birthYear: 2012,
  bio: "A dynamic forward with elite skating ability and a relentless compete level. Known for creating offense in transition and delivering in clutch moments. Committed to constant improvement on and off the ice.",
  headshotUrl: "/images/headshot-placeholder.svg",
  heroImageUrl: "/images/hero-cutout.png",
  currentStats: {
    gamesPlayed: 42,
    goals: 28,
    assists: 35,
    points: 63,
    plusMinus: 18,
    pim: 22,
  },
  seasonHistory: [
    {
      season: "2024-25",
      team: "NJ Rockets",
      league: "AYHL",
      stats: { gamesPlayed: 42, goals: 28, assists: 35, points: 63, plusMinus: 18, pim: 22 },
    },
    {
      season: "2023-24",
      team: "NJ Rockets",
      league: "AYHL",
      stats: { gamesPlayed: 38, goals: 22, assists: 27, points: 49, plusMinus: 12, pim: 18 },
    },
    {
      season: "2022-23",
      team: "Montclair Blues",
      league: "NJYHL",
      stats: { gamesPlayed: 34, goals: 18, assists: 20, points: 38, plusMinus: 8, pim: 14 },
    },
  ],
  highlights: [
    { title: "Season Highlights 2024-25", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { title: "Tournament MVP Performance", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  ],
  socialLinks: [
    { platform: "instagram", url: "https://instagram.com" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "email", url: "mailto:player@example.com" },
  ],
  themeColor: "#b91c1c",
  highlightReelUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  resumeUrl: "/resume-placeholder.pdf",
};
