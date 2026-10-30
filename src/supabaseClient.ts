import {
  createClient,
  type AuthChangeEvent,
  type Session,
  type SupabaseClient,
} from '@supabase/supabase-js';
import type { NewProductInput, Product } from './types/product';

// ============================================================================
// SUPABASE PUBLIC CLIENT CREDENTIALS
// (Override via VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env if desired)
// ============================================================================
const SUPABASE_URL = 'https://wtefokhvofihnroqwsjr.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZWZva2h2b2ZpaG5yb3F3c2pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNTc5MjEsImV4cCI6MjEwODkzMzkyMX0.32NgMil7VGBFEFoQsLdBzVoPujbwdEQsBX_RnAQ5_bc';

export const PRODUCT_IMAGES_BUCKET = 'product-images';
const RUNTIME_URL_STORAGE_KEY = 'creewrld_supabase_url';
const RUNTIME_ANON_STORAGE_KEY = 'creewrld_supabase_anon_key';

export interface SupabaseCredentials {
  url: string;
  anonKey: string;
  source: 'env' | 'runtime' | 'code' | 'placeholder';
}

function isRealSupabaseValue(val: string | undefined | null, placeholder: string): val is string {
  if (!val) return false;
  const trimmed = val.trim();
  return trimmed.length > 0 && trimmed !== placeholder;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function resolveSupabaseCredentials(): SupabaseCredentials {
  // 1. Check Vite environment variables (.env) first
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (
    isRealSupabaseValue(envUrl, 'YOUR_SUPABASE_URL') &&
    isRealSupabaseValue(envKey, 'YOUR_SUPABASE_ANON_KEY') &&
    isValidHttpUrl(envUrl)
  ) {
    return { url: envUrl.trim(), anonKey: envKey.trim(), source: 'env' };
  }

  // 2. Check runtime credentials saved via Admin Connection Modal
  if (typeof window !== 'undefined') {
    const storedUrl = window.localStorage.getItem(RUNTIME_URL_STORAGE_KEY);
    const storedKey = window.localStorage.getItem(RUNTIME_ANON_STORAGE_KEY);
    if (
      isRealSupabaseValue(storedUrl, 'YOUR_SUPABASE_URL') &&
      isRealSupabaseValue(storedKey, 'YOUR_SUPABASE_ANON_KEY') &&
      isValidHttpUrl(storedUrl)
    ) {
      return { url: storedUrl.trim(), anonKey: storedKey.trim(), source: 'runtime' };
    }
  }

  // 3. Check configured project constants at top of file
  if (
    isRealSupabaseValue(SUPABASE_URL, 'YOUR_SUPABASE_URL') &&
    isRealSupabaseValue(SUPABASE_ANON_KEY, 'YOUR_SUPABASE_ANON_KEY') &&
    isValidHttpUrl(SUPABASE_URL)
  ) {
    return { url: SUPABASE_URL.trim(), anonKey: SUPABASE_ANON_KEY.trim(), source: 'code' };
  }

  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY, source: 'placeholder' };
}

let cachedClient: SupabaseClient | null = null;
let cachedSignature = '';

export function getSupabaseClient(): SupabaseClient | null {
  const creds = resolveSupabaseCredentials();
  if (creds.source === 'placeholder') {
    return null;
  }

  const signature = `${creds.url}::${creds.anonKey}`;
  if (!cachedClient || cachedSignature !== signature) {
    cachedClient = createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    cachedSignature = signature;
  }
  return cachedClient;
}

export const supabase = getSupabaseClient();

export function saveRuntimeSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(RUNTIME_URL_STORAGE_KEY, url.trim());
  window.localStorage.setItem(RUNTIME_ANON_STORAGE_KEY, anonKey.trim());
  cachedClient = null;
  cachedSignature = '';
}

export function clearRuntimeSupabaseCredentials(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(RUNTIME_URL_STORAGE_KEY);
  window.localStorage.removeItem(RUNTIME_ANON_STORAGE_KEY);
  cachedClient = null;
  cachedSignature = '';
}

// ============================================================================
// SUPABASE AUTHENTICATION & ADMIN SESSION ENFORCEMENT
// ============================================================================

/**
 * Authenticates an admin using Email + Password via Supabase Auth.
 */
export async function signInAdminWithPassword(email: string, password: string): Promise<Session> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase is not configured. Please configure SUPABASE_URL and SUPABASE_ANON_KEY.');
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    const normalized = error.message.toLowerCase();
    if (
      normalized.includes('invalid login credentials') ||
      normalized.includes('invalid credentials')
    ) {
      throw new Error('Invalid admin credentials');
    }
    throw new Error(error.message);
  }

  if (!data.session) {
    throw new Error('Authentication did not return an active admin session.');
  }

  return data.session;
}

/**
 * Signs out the currently authenticated admin via Supabase Auth.
 */
export async function signOutAdmin(): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const { error } = await client.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Returns the currently persisted Supabase Auth session (if any).
 */
export async function getActiveAdminSession(): Promise<Session | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const {
    data: { session },
  } = await client.auth.getSession();
  return session;
}

/**
 * Subscribes to Supabase Auth state changes so the UI reacts immediately to sign-in, sign-out, or token expiry.
 */
export function subscribeToAuthState(
  onChange: (event: AuthChangeEvent, session: Session | null) => void
): () => void {
  const client = getSupabaseClient();
  if (!client) {
    return () => {};
  }

  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((event, session) => {
    onChange(event, session);
  });

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Security Guard: Verifies an active authenticated Supabase `session` exists
 * BEFORE allowing any admin Storage or Database write/delete API call.
 */
export async function requireActiveAdminSession(): Promise<{
  client: SupabaseClient;
  session: Session;
}> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client is not configured.');
  }

  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error || !session || !session.access_token) {
    throw new Error('Unauthorized: An active admin session is required to perform this action.');
  }

  return { client, session };
}

// ============================================================================
// PRODUCT QUERIES & SESSION-PROTECTED ADMIN MUTATIONS
// ============================================================================

/**
 * Extracts the storage object path inside the `product-images` bucket from `image_url`.
 */
export function extractStorageFilePath(imageUrl: string): string | null {
  if (!imageUrl) return null;
  const cleanUrl = imageUrl.split('?')[0].split('#')[0].trim();
  if (!cleanUrl) return null;

  const bucketMarker = `/${PRODUCT_IMAGES_BUCKET}/`;
  const markerIndex = cleanUrl.indexOf(bucketMarker);
  if (markerIndex !== -1) {
    const extracted = decodeURIComponent(cleanUrl.slice(markerIndex + bucketMarker.length));
    return extracted || null;
  }

  const segments = cleanUrl.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  return decodeURIComponent(segments[segments.length - 1]);
}

/**
 * Queries all rows from the Supabase `products` table ordered newest first.
 */
export async function fetchProductsFromSupabase(): Promise<Product[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    title: String(row.title ?? ''),
    category: String(row.category ?? 'Streetwear'),
    price_ksh: Number(row.price_ksh ?? 0),
    size: String(row.size ?? 'OS'),
    condition: String(row.condition ?? '9/10 Vintage'),
    image_url: String(row.image_url ?? ''),
    created_at: String(row.created_at ?? new Date().toISOString()),
  }));
}

/**
 * Deletes both:
 *  a) The image file from Supabase Storage (`product-images` bucket)
 *  b) The product record from the `products` database table
 * Enforces an active admin `session` before making any API call.
 */
export async function deleteProductFromSupabase(product: Product): Promise<{
  removedStoragePath: string | null;
}> {
  // Security Enforcement: verify active Supabase session before any API call
  const { client } = await requireActiveAdminSession();
  const filePath = extractStorageFilePath(product.image_url);

  // Step a: Remove image file from Supabase Storage bucket `product-images`
  if (filePath) {
    const { error: storageError } = await client.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove([filePath]);

    if (storageError) {
      console.warn('Supabase storage deletion warning:', storageError.message);
    }
  }

  // Step b: Delete row from `products` table
  const { error: dbError } = await client
    .from('products')
    .delete()
    .eq('id', product.id);

  if (dbError) {
    throw new Error(dbError.message);
  }

  return { removedStoragePath: filePath };
}

/**
 * Uploads an image to `product-images` in Supabase Storage and inserts a new row into `products`.
 * Enforces an active admin `session` before making any API call.
 */
export async function createProductInSupabase(
  input: NewProductInput,
  imageFile: File
): Promise<Product> {
  // Security Enforcement: verify active Supabase session before any API call
  const { client } = await requireActiveAdminSession();

  const sanitizedExt = (imageFile.name.split('.').pop() || 'jpg')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const slugTitle = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const filePath = `${Date.now()}-${slugTitle || 'drop'}.${sanitizedExt || 'jpg'}`;

  const { error: uploadError } = await client.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(filePath, imageFile, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const { data: publicUrlData } = client.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(filePath);

  const publicImageUrl = publicUrlData.publicUrl;

  const { data: insertedRow, error: insertError } = await client
    .from('products')
    .insert([
      {
        title: input.title.trim(),
        category: input.category,
        price_ksh: Number(input.price_ksh),
        size: input.size.trim(),
        condition: input.condition.trim(),
        image_url: publicImageUrl,
      },
    ])
    .select('*')
    .single();

  if (insertError) {
    // Roll back orphan uploaded image if table insert fails
    await client.storage.from(PRODUCT_IMAGES_BUCKET).remove([filePath]);
    throw new Error(`Database insert failed: ${insertError.message}`);
  }

  return {
    id: String(insertedRow.id),
    title: String(insertedRow.title),
    category: String(insertedRow.category),
    price_ksh: Number(insertedRow.price_ksh),
    size: String(insertedRow.size),
    condition: String(insertedRow.condition),
    image_url: String(insertedRow.image_url),
    created_at: String(insertedRow.created_at),
  };
}
