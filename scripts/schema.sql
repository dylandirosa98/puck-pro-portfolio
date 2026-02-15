-- Puck Pro Portfolio: Database Schema
-- Run this in the Supabase SQL Editor

-- 1. Create the players table
create table if not exists public.players (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  first_name text not null,
  last_name text not null,
  position text not null default 'Forward',
  number integer not null default 0,
  team text not null default '',
  league text not null default '',
  hometown text default '',
  height text default '',
  weight text default '',
  shoots text default 'Left' check (shoots in ('Left', 'Right')),
  birth_year integer default 2000,
  bio text default '',
  headshot_url text default '/images/headshot-placeholder.svg',
  hero_image_url text default '/images/hero-placeholder.svg',
  current_stats jsonb default '{}',
  season_history jsonb default '[]',
  highlights jsonb default '[]',
  social_links jsonb default '[]',
  theme_color text default '#b91c1c',
  highlight_reel_url text,
  resume_url text,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Auto-update updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_players_updated
  before update on public.players
  for each row execute procedure public.handle_updated_at();

-- 3. Enable RLS
alter table public.players enable row level security;

-- 4. RLS policies
-- Public: read published players
create policy "Public can view published players"
  on public.players for select
  using (is_published = true);

-- Authenticated: full CRUD
create policy "Authenticated users have full access"
  on public.players for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 5. Create storage bucket for player images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'player-images',
  'player-images',
  true,
  10485760,  -- 10MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do nothing;

-- 6. Storage policies
-- Public read
create policy "Public can view player images"
  on storage.objects for select
  using (bucket_id = 'player-images');

-- Authenticated write
create policy "Authenticated users can upload player images"
  on storage.objects for insert
  with check (bucket_id = 'player-images' and auth.role() = 'authenticated');

create policy "Authenticated users can update player images"
  on storage.objects for update
  using (bucket_id = 'player-images' and auth.role() = 'authenticated');

create policy "Authenticated users can delete player images"
  on storage.objects for delete
  using (bucket_id = 'player-images' and auth.role() = 'authenticated');
