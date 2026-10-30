-- ============================================================================
-- CREEWRLD // SUPABASE DATABASE & STORAGE BUCKET SETUP
-- Run this entire script inside your Supabase Project -> SQL Editor
-- ============================================================================

-- 1. Enable pgcrypto for gen_random_uuid() if not already active
create extension if not exists "pgcrypto";

-- 2. Create the public storage bucket: `product-images`
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Storage RLS Policies for `product-images`
drop policy if exists "Public read access for product-images" on storage.objects;
create policy "Public read access for product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Allow upload to product-images" on storage.objects;
create policy "Allow upload to product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

drop policy if exists "Allow delete from product-images" on storage.objects;
create policy "Allow delete from product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images');

-- 3. Create the `products` table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Sneakers', 'Streetwear', 'Old Money', 'Y2K', 'Men', 'Women')),
  price_ksh numeric not null check (price_ksh >= 0),
  size text not null,
  condition text not null,
  image_url text not null,
  created_at timestamp with time zone default now()
);

-- Index for fast category filtering & newest-first ordering
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_created_at on public.products (created_at desc);

-- Enable Row Level Security (RLS) on `products`
alter table public.products enable row level security;

-- Public read access for all visitors
drop policy if exists "Public can view all products" on public.products;
create policy "Public can view all products"
  on public.products for select
  using (true);

-- Storefront admin insert & delete policies
-- (Note: Restrict `using (auth.role() = 'authenticated')` in production if enabling Supabase Auth)
drop policy if exists "Allow product creation" on public.products;
create policy "Allow product creation"
  on public.products for insert
  with check (true);

drop policy if exists "Allow product deletion" on public.products;
create policy "Allow product deletion"
  on public.products for delete
  using (true);
