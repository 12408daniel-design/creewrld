# CREEWRLD // Nairobi Street-Culture & Vintage Thrift Archive

High-contrast e-commerce landing page and shop web app for **CREEWRLD**, an online 1-of-1 thrift store based in Kenya, powered by **React + Vite + Tailwind CSS + Supabase** (`@supabase/supabase-js`) with **Supabase Auth** admin protection and direct **WhatsApp ordering**.

## Brand & Visual Identity
- **Backgrounds**: Deep Obsidian (`#0D0D0D`) & Card Surfaces (`#181818`)
- **Typography & Elements**: Stark White (`#FFFFFF`) with official Interlocking Gothic Emblem & Blackletter wordmark (`CREE WRLD`)
- **Electric Accent**: Electric Lime (`#CCFF00`)
- **Navigation**: Strictly two streamlined views — **Home** and **Shop** — plus a Supabase Auth-gated **Admin** verification trigger

## Supabase Database, Storage & Admin Auth Setup

1. **Database & Storage RLS (`supabase/schema.sql`)**:
   Run [`supabase/schema.sql`](./supabase/schema.sql) inside your Supabase **SQL Editor**. This configures:
   - Public storage bucket: `product-images` (public read; `authenticated`-only upload & delete)
   - Table: `public.products` (public read; `authenticated`-only insert, update & delete)
2. **Create Your Admin Account in Supabase Auth**:
   - In your Supabase Dashboard, go to **Authentication → Users → Add user → Create new user**.
   - Enter your admin email & password and enable **Auto Confirm User**.
   - Click **Admin** in the CREEWRLD site header and sign in via **Verify & Unlock** to reveal all `.admin-only` product upload and deletion controls.
3. **Environment Variables (Optional Override)**:
   Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` (or edit `src/supabaseClient.ts`).

## Local Development

```bash
npm install
npm run dev
```
