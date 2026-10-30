import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { NewProductInput, Product } from './types/product';

// ============================================================================
// SUPABASE CREDENTIALS — Replace placeholders below with your project keys
// (Or provide VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env, or connect via Admin UI)
// ============================================================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

export const PRODUCT_IMAGES_BUCKET = 'product-images';
const RUNTIME_URL_STORAGE_KEY = 'creewrld_supabase_url';
const RUNTIME_ANON_STORAGE_KEY = 'creewrld_supabase_anon_key';

export interface SupabaseCredentials {
  url: string;
  anonKey: string;
  source: 'code' | 'env' | 'runtime' | 'placeholder';
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
  // 1. Check hardcoded constants at top of file first if replaced by developer
  if (
    isRealSupabaseValue(SUPABASE_URL, 'YOUR_SUPABASE_URL') &&
    isRealSupabaseValue(SUPABASE_ANON_KEY, 'YOUR_SUPABASE_ANON_KEY') &&
    isValidHttpUrl(SUPABASE_URL)
  ) {
    return { url: SUPABASE_URL.trim(), anonKey: SUPABASE_ANON_KEY.trim(), source: 'code' };
  }

  // 2. Check Vite environment variables (.env)
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (
    isRealSupabaseValue(envUrl, 'YOUR_SUPABASE_URL') &&
    isRealSupabaseValue(envKey, 'YOUR_SUPABASE_ANON_KEY') &&
    isValidHttpUrl(envUrl)
  ) {
    return { url: envUrl.trim(), anonKey: envKey.trim(), source: 'env' };
  }

  // 3. Check runtime credentials saved via Admin Connection Modal
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
    cachedClient = createClient(creds.url, creds.anonKey);
    cachedSignature = signature;
  }
  return cachedClient;
}

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

/**
 * Extracts the storage object path inside the `product-images` bucket from `image_url`.
 * Handles full Supabase public URLs (including nested folders & query strings) as well as plain filenames.
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
  const supabase = getSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
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
 */
export async function deleteProductFromSupabase(product: Product): Promise<{
  removedStoragePath: string | null;
}> {
  const supabase = getSupabaseClient();
  const filePath = extractStorageFilePath(product.image_url);

  if (!supabase) {
    return { removedStoragePath: filePath };
  }

  // Step a: Remove image file from Supabase Storage bucket `product-images`
  if (filePath) {
    const { error: storageError } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove([filePath]);

    if (storageError) {
      // Log storage warning while still ensuring DB row cleanup proceeds cleanly
      console.warn('Supabase storage deletion warning:', storageError.message);
    }
  }

  // Step b: Delete row from `products` table
  const { error: dbError } = await supabase
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
 */
export async function createProductInSupabase(
  input: NewProductInput,
  imageFile: File
): Promise<Product> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    // Preview fallback when Supabase placeholders haven't been replaced yet:
    // converts image to data URL so Admin product creation works seamlessly in preview too
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(imageFile);
    });

    return {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      category: input.category,
      price_ksh: Number(input.price_ksh),
      size: input.size.trim(),
      condition: input.condition.trim(),
      image_url: dataUrl,
      created_at: new Date().toISOString(),
    };
  }

  const sanitizedExt = (imageFile.name.split('.').pop() || 'jpg')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const slugTitle = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const filePath = `${Date.now()}-${slugTitle || 'drop'}.${sanitizedExt || 'jpg'}`;

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(filePath, imageFile, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(filePath);

  const publicImageUrl = publicUrlData.publicUrl;

  const { data: insertedRow, error: insertError } = await supabase
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
    await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([filePath]);
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
