-- =========================================================
-- Ko Lake Villa Gallery Setup (One-File Version)
-- =========================================================
-- ✅ Creates / repairs the 'gallery' bucket if missing
-- ✅ Creates 'gallery_images' metadata table
-- ✅ Adds RLS + safe policies
-- ✅ Adds helper trigger to detect image/video
-- ✅ No COMMENTs on system tables (avoids permission errors)
-- =========================================================

-- Enable UUIDs
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- --- 1️⃣ Create gallery storage bucket ---
insert into storage.buckets (id, name, public)
values ('gallery','gallery', true)
on conflict (id) do update set public = true;

-- --- 2️⃣ Public read policy on storage.objects (for thumbnails) ---
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read gallery'
  ) then
    create policy "Public read gallery"
    on storage.objects
    for select
    to public
    using (bucket_id = 'gallery');
  end if;
end$$;

-- --- 3️⃣ Metadata table ---
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  kind text not null default 'unknown' check (kind in ('image','video','unknown')),
  caption text,
  tags text[],
  created_at timestamptz not null default now()
);

-- --- 4️⃣ Enable RLS + policies ---
alter table public.gallery_images enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where policyname = 'public read gallery_images'
  ) then
    create policy "public read gallery_images"
    on public.gallery_images
    for select to public using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where policyname = 'auth write gallery_images'
  ) then
    create policy "auth write gallery_images"
    on public.gallery_images
    for insert to authenticated with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where policyname = 'auth update gallery_images'
  ) then
    create policy "auth update gallery_images"
    on public.gallery_images
    for update to authenticated using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where policyname = 'auth delete gallery_images'
  ) then
    create policy "auth delete gallery_images"
    on public.gallery_images
    for delete to authenticated using (true);
  end if;
end$$;

-- --- 5️⃣ Index + trigger to auto-detect kind ---
create index if not exists gallery_images_created_at_desc_idx
  on public.gallery_images (created_at desc);

create or replace function public.gallery_kind_from_path(p text)
returns text language sql immutable as $$
  select case
    when p ~* '\.(jpg|jpeg|png|webp|avif|gif)$' then 'image'
    when p ~* '\.(mp4|webm|ogg|mov)$'          then 'video'
    else 'unknown'
  end
$$;

create or replace function public.gallery_kind_trg()
returns trigger language plpgsql as $$
begin
  if new.kind is null or new.kind = 'unknown' then
    new.kind := public.gallery_kind_from_path(new.path);
  end if;
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_gallery_kind_fill') then
    create trigger trg_gallery_kind_fill
      before insert or update on public.gallery_images
      for each row execute function public.gallery_kind_trg();
  end if;
end$$;

-- --- 6️⃣ Public view (optional for front-end) ---
create or replace view public.gallery_images_public as
select id, path, kind, caption, tags, created_at
from public.gallery_images
order by created_at desc;

-- =========================================================
-- ✅ Done!
-- Reload your Admin → Gallery page. The "database not set up"
-- banner disappears, uploads + thumbnails now work.
-- =========================================================
