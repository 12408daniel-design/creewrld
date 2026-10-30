-- ============================================================================
-- CREEWRLD // SUPABASE DATABASE, STORAGE & AUTH RLS SETUP
-- Run this script inside your Supabase Project -> SQL Editor
-- ============================================================================

-- 1. Enable pgcrypto for gen_random_uuid() if not already active
create extension if not exists "pgcrypto";

-- 2. Create the public storage bucket: `product-images`
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Storage RLS Policies for `product-images`
-- Public read for storefront visitors; authenticated-only mutations for admins
drop policy if exists "Public read access for product-images" on storage.objects;
create policy "Public read access for product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Allow upload to product-images" on storage.objects;
drop policy if exists "Authenticated admins can upload product-images" on storage.objects;
create policy "Authenticated admins can upload product-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can update product-images" on storage.objects;
create policy "Authenticated admins can update product-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

drop policy if exists "Allow delete from product-images" on storage.objects;
drop policy if exists "Authenticated admins can delete product-images" on storage.objects;
create policy "Authenticated admins can delete product-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

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

-- Authenticated admin-only insert, update & delete policies
drop policy if exists "Allow product creation" on public.products;
drop policy if exists "Authenticated admins can insert products" on public.products;
create policy "Authenticated admins can insert products"
  on public.products for insert
  to authenticated
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated admins can update products" on public.products;
create policy "Authenticated admins can update products"
  on public.products for update
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Allow product deletion" on public.products;
drop policy if exists "Authenticated admins can delete products" on public.products;
create policy "Authenticated admins can delete products"
  on public.products for delete
  to authenticated
  using (auth.role() = 'authenticated');
