import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const jackSmalley = {
  slug: "jack-smalley",
  first_name: "Jack",
  last_name: "Smalley",
  position: "Forward",
  number: 19,
  team: "NJ Rockets",
  league: "AYHL",
  hometown: "Montclair, NJ",
  height: '5\'6"',
  weight: "140 lbs",
  shoots: "Left",
  birth_year: 2012,
  bio: "A dynamic forward with elite skating ability and a relentless compete level. Known for creating offense in transition and delivering in clutch moments. Committed to constant improvement on and off the ice.",
  headshot_url: "/images/headshot-placeholder.svg",
  hero_image_url: "/images/hero-cutout.png",
  current_stats: {
    gamesPlayed: 42,
    goals: 28,
    assists: 35,
    points: 63,
    plusMinus: 18,
    pim: 22,
  },
  season_history: [
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
  social_links: [
    { platform: "instagram", url: "https://instagram.com" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "email", url: "mailto:player@example.com" },
  ],
  theme_color: "#b91c1c",
  highlight_reel_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  resume_url: "/resume-placeholder.pdf",
  is_published: true,
};

async function seed() {
  console.log("Seeding database...");

  // Check if already exists
  const { data: existing } = await supabase
    .from("players")
    .select("id")
    .eq("slug", "jack-smalley")
    .single();

  if (existing) {
    console.log("Jack Smalley already exists, updating...");
    const { error } = await supabase
      .from("players")
      .update(jackSmalley)
      .eq("id", existing.id);

    if (error) {
      console.error("Update failed:", error.message);
      process.exit(1);
    }
    console.log("Updated successfully!");
  } else {
    console.log("Creating Jack Smalley...");
    const { error } = await supabase
      .from("players")
      .insert(jackSmalley);

    if (error) {
      console.error("Insert failed:", error.message);
      process.exit(1);
    }
    console.log("Created successfully!");
  }

  console.log("Seed complete! Visit /jack-smalley to see the page.");
}

seed();
