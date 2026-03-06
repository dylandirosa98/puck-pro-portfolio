# Puck Pro Portfolio

A web platform that lets a hockey media company generate professional recruiting portfolio websites for players — fast, from a single admin dashboard.

---

## Overview

Puck Pro Portfolio is a full-stack Next.js application that powers individualized player portfolio pages. A media company operator logs into an admin dashboard, fills out a player profile (stats, bio, images, highlights, resume), and immediately gets a shareable, deployment-ready website at a clean URL like `/john-doe`.

Each player page is a self-contained recruiting portfolio — not a generic social media profile, but a focused, professionally designed page built for coaches and scouts to evaluate a player at a glance.

---

## Problem

Hockey players at the junior, college, and minor professional levels often lack a central, professional presence for recruiting. Highlight reels are scattered across YouTube. Stats live on league websites. Resumes are emailed as Word documents. There is no single URL a player can hand a coach that tells their complete story.

At the same time, hockey media companies that cover these players spend time manually building one-off sites or relying on third-party platforms that don't reflect their brand or meet the specific needs of recruiting.

---

## Solution

Puck Pro Portfolio centralizes the entire workflow. The media company manages all player data through a protected admin dashboard. Adding a new player — including uploading a hero photo with automatic background removal, entering career stats, linking highlight videos, and attaching a PDF resume — takes minutes. The player immediately gets a polished, mobile-optimized portfolio page they can share with recruiters.

The system is built to scale: one admin interface manages an unlimited number of players, each with their own themed page and unique URL.

---

## Features

- **Admin dashboard** — protected login with full CRUD operations for all player profiles
- **Dynamic player portfolio pages** — each player gets a unique URL (`/[slug]`) generated from their name
- **Publish/unpublish control** — drafts are invisible to the public until explicitly published
- **Hero image with AI background removal** — uploaded photos are automatically processed to isolate the player cutout
- **Per-player theme color** — customizable accent color applied across the entire page
- **Current season stats** — goals, assists, points, +/-, PIM, games played
- **Career statistics table** — full season-by-season history
- **Highlight video embeds** — supports YouTube, Vimeo, and Wistia with a modal viewer
- **Highlight reel modal** — dedicated full-screen video player for a player's primary reel
- **PDF resume upload and inline viewer** — resumes are stored and rendered in-browser
- **Social media links** — Instagram, Twitter/X, YouTube, TikTok, and email
- **SEO metadata** — per-player title and description tags
- **Mobile-first, iOS-optimized** — dynamic theme-color meta tag, safe-area-inset support, smooth animations

---

## Tech Stack

| Technology | Role | Why |
|---|---|---|
| **Next.js 15 (App Router)** | Framework | File-based routing, server components, server actions, and built-in image optimization — all without additional infrastructure |
| **React 19** | UI | Component model for composable, section-based player page layout |
| **TypeScript** | Language | End-to-end type safety across database rows, form data, and UI props |
| **Tailwind CSS v4** | Styling | Utility-first styling with no build-time class extraction overhead |
| **Framer Motion** | Animations | Scroll-triggered reveal animations on player pages |
| **Supabase** | Database, Auth, Storage | PostgreSQL with row-level security, session-based auth via cookies, and S3-compatible file storage — all in one service |
| **@supabase/ssr** | Session management | Correct server-side cookie handling for Next.js App Router |
| **@imgly/background-removal-node** | AI image processing | On-server background removal for hero player photos without a third-party API dependency |
| **react-player** | Video embeds | Normalized playback for YouTube, Vimeo, and Wistia URLs |

---

## Architecture

```
Browser (Public)
    └── /[slug]  →  Next.js Server Component
                        └── Supabase query (published players only, via RLS)
                            └── PlayerTemplate renders all sections

Browser (Admin)
    └── /admin/*  →  Middleware checks Supabase session cookie
                        └── Admin dashboard lists all players
                            └── PlayerForm  →  Server Action (create/update/delete)
                                                └── Supabase DB + Storage write

POST /api/remove-bg  →  @imgly background removal  →  Upload result to Supabase Storage
```

**Key design decisions:**

- **Row-level security on Supabase** enforces that unauthenticated users can only read `is_published = true` rows — no middleware needed on the public side.
- **Server Actions** handle all mutations (create, update, delete, toggle publish) — no separate API layer required.
- **`/api/remove-bg`** is the only custom API route; it is auth-gated and handles the CPU-intensive background removal on the server so it doesn't block the client.
- **JSONB columns** store variable-length data (stats history, highlights, social links) without requiring schema migrations for every new field.

---

## Example Use Case

1. A media company covers a Junior A forward named Jack Smalley and wants to help him with recruiting.
2. An operator logs into `/admin`, clicks **New Player**, and fills out his name, position, team, stats, and bio.
3. They upload a photo — the system automatically removes the background and saves the cutout to cloud storage.
4. They paste in three YouTube highlight links and upload his PDF resume.
5. They set a red theme color matching his team, then click **Publish**.
6. Jack's portfolio is now live at `/jack-smalley` — a shareable link he can send directly to college coaches.

---

## Screenshots / Demo

> Screenshots and a live demo link will be added here.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with the schema applied

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_postgres_connection_string
```

### Setup

```bash
npm install

# Apply the database schema
npm run schema

# (Optional) Seed with a sample player
npm run seed

# Create an admin user
npm run create-admin your@email.com yourpassword

# Start the development server
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the dashboard.

---

## Project Structure

```
src/
├── app/
│   ├── [slug]/page.tsx          # Public player portfolio pages
│   ├── admin/                   # Protected admin dashboard
│   │   ├── login/               # Auth page
│   │   └── (dashboard)/
│   │       └── players/         # Create/edit player forms
│   └── api/remove-bg/           # Background removal API route
├── components/
│   ├── PlayerTemplate.tsx        # Top-level page layout
│   ├── sections/                 # HeroSection, StatsBar, BioSection, etc.
│   └── admin/                    # Form components, image/PDF upload
├── lib/
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── supabase/                 # Client, server, and admin Supabase instances
│   └── actions/player-actions.ts # Server actions for all mutations
└── middleware.ts                 # Auth guard for /admin routes
```

---

## Future Improvements

- **Player onboarding flow** — allow players to self-submit their own information via a form, reducing admin data entry
- **Analytics** — page view tracking per player so the media company can report reach to clients
- **Custom domain support** — map a player's portfolio to their own domain (e.g., `jacksmalleys.com`)
- **Recruiting integrations** — direct links to NCSA, BeRecruited, or other scouting platforms
- **Multi-template support** — additional page layout options for different sports or visual preferences
- **Role-based access** — allow players or their families to update their own bio and social links without full admin access
- **Export** — generate a static HTML version of a player page for offline or PDF distribution

---

## Author

**Dylan DiRosa**
