import type { Product } from '../types/product';

/**
 * Curated Nairobi Thrift Showcase items displayed ONLY when SUPABASE_URL is still set to
 * 'YOUR_SUPABASE_URL', allowing live preview evaluation of category filtering, quick-view,
 * WhatsApp ordering, and instant DOM deletion before connecting live Supabase credentials.
 */
export const PREVIEW_SHOWCASE_PRODUCTS: Product[] = [
  {
    id: 'cree-001-metallic-runner',
    title: 'Archival Chrome & Volt Mesh Tech Runner',
    category: 'Sneakers',
    price_ksh: 6800,
    size: 'EU 42 / UK 8',
    condition: '9.5/10 Vintage',
    image_url: '/images/drop-sneakers-1.jpg',
    created_at: '2026-10-30T09:30:00.000Z',
  },
  {
    id: 'cree-002-heavyweight-hoodie',
    title: 'Washed Obsidian Box-Fit Gothic Crest Hoodie (480GSM)',
    category: 'Streetwear',
    price_ksh: 4200,
    size: 'L (Boxy Fit)',
    condition: '10/10 Mint',
    image_url: '/images/drop-streetwear-1.jpg',
    created_at: '2026-10-30T08:45:00.000Z',
  },
  {
    id: 'cree-003-cashmere-overcoat',
    title: 'Italian Tailored Double-Breasted Wool Cashmere Overcoat',
    category: 'Old Money',
    price_ksh: 8500,
    size: 'EU 50 / L',
    condition: '9.5/10 Vintage',
    image_url: '/images/drop-oldmoney-1.jpg',
    created_at: '2026-10-29T18:20:00.000Z',
  },
  {
    id: 'cree-004-y2k-moto-jacket',
    title: 'Early-2000s Cropped Moto Leather Racing Jacket',
    category: 'Y2K',
    price_ksh: 7400,
    size: 'M',
    condition: '9/10 Vintage',
    image_url: '/images/drop-y2k-1.jpg',
    created_at: '2026-10-29T15:10:00.000Z',
  },
  {
    id: 'cree-005-selvedge-carpenter',
    title: 'Heavy Contrast-Stitch Washed Black Selvedge Carpenter Denim',
    category: 'Men',
    price_ksh: 3900,
    size: 'W32 L32',
    condition: '9/10 Vintage',
    image_url: '/images/drop-men-1.jpg',
    created_at: '2026-10-29T11:00:00.000Z',
  },
  {
    id: 'cree-006-croc-baguette-bag',
    title: 'Structured Croc-Embossed Leather Buckle Shoulder Baguette',
    category: 'Women',
    price_ksh: 4600,
    size: 'One Size',
    condition: '10/10 Mint',
    image_url: '/images/drop-women-1.jpg',
    created_at: '2026-10-28T19:40:00.000Z',
  },
  {
    id: 'cree-007-retro-high-court',
    title: '1985-Spec Monochrome Leather High-Top Court Grails',
    category: 'Sneakers',
    price_ksh: 7200,
    size: 'EU 43 / UK 9',
    condition: '8.5/10 Thrifted',
    image_url: '/images/drop-sneakers-2.jpg',
    created_at: '2026-10-28T16:15:00.000Z',
  },
  {
    id: 'cree-008-tactical-utility-vest',
    title: 'Ballistic Nylon Multi-Rig Tactical Streetwear Cargo Vest',
    category: 'Streetwear',
    price_ksh: 3800,
    size: 'XL / Adjustable',
    condition: '9.5/10 Vintage',
    image_url: '/images/drop-streetwear-2.jpg',
    created_at: '2026-10-28T13:05:00.000Z',
  },
  {
    id: 'cree-009-chrome-shield-set',
    title: 'Y2K Chrome Wrap Shield Frames + Sterling Gothic Link Set',
    category: 'Women',
    price_ksh: 3200,
    size: 'One Size',
    condition: '10/10 Mint',
    image_url: '/images/drop-women-2.jpg',
    created_at: '2026-10-27T20:00:00.000Z',
  },
];

export const SUPABASE_SETUP_SQL = `-- CREEWRLD Supabase Schema & Storage Bucket Setup
create extension if not exists "pgcrypto";

-- 1. Public Storage Bucket: product-images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

create policy "Public read access for product-images"
  on storage.objects for select using (bucket_id = 'product-images');

create policy "Allow upload to product-images"
  on storage.objects for insert with check (bucket_id = 'product-images');

create policy "Allow delete from product-images"
  on storage.objects for delete using (bucket_id = 'product-images');

-- 2. Database Table: products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  price_ksh numeric not null,
  size text not null,
  condition text not null,
  image_url text not null,
  created_at timestamp with time zone default now()
);

alter table public.products enable row level security;

create policy "Public can view all products"
  on public.products for select using (true);

create policy "Allow product creation"
  on public.products for insert with check (true);

create policy "Allow product deletion"
  on public.products for delete using (true);`;
