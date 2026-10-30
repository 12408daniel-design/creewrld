# CREEWRLD // Nairobi Street-Culture & Vintage Thrift Archive

High-contrast e-commerce landing page and shop web app for **CREEWRLD**, an online 1-of-1 thrift store based in Kenya, powered by **React + Vite + Tailwind CSS + Supabase** (`@supabase/supabase-js`) with direct **WhatsApp ordering**.

## Brand & Visual Identity
- **Backgrounds**: Deep Obsidian (`#0D0D0D`) & Card Surfaces (`#181818`)
- **Typography & Elements**: Stark White (`#FFFFFF`) with custom Interlocking Gothic Emblem (`C × W`) & Blackletter wordmark (`CREE WRLD`)
- **Electric Accent**: Electric Lime (`#CCFF00`)
- **Navigation**: Strictly two streamlined views — **Home** and **Shop** (plus subtle **Admin** management mode)

## Supabase Setup (`products` Table & `product-images` Bucket)

1. Open your Supabase project's **SQL Editor** and run [`supabase/schema.sql`](./supabase/schema.sql). This creates:
   - Public storage bucket: `product-images` (with read/insert/delete RLS policies)
   - Table: `public.products` (`id`, `title`, `category`, `price_ksh`, `size`, `condition`, `image_url`, `created_at`)
2. Configure your Supabase credentials in [`src/supabaseClient.ts`](./src/supabaseClient.ts):
   ```ts
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
   *(Alternatively, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`, or paste them directly via **Admin → Supabase Setup / Keys** in the live UI).*

## Local Development

```bash
npm install
npm run dev
```
