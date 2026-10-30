import type { Product } from '../types/product';

export const CREEWRLD_WHATSAPP_NUMBER = '254719526649';
export const CREEWRLD_WHATSAPP_DISPLAY = '+254 719 526 649';

export function formatKsh(amount: number | string): string {
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return String(amount);
  return numeric.toLocaleString('en-KE');
}

export function resolveAbsoluteImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  if (imageUrl.startsWith('data:')) {
    return '[Uploaded Preview Image]';
  }
  if (typeof window !== 'undefined') {
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${window.location.origin}${cleanPath}`;
  }
  return imageUrl;
}

/**
 * Constructs a pre-filled WhatsApp order URL directed to +254719526649
 * following the exact CREEWRLD order template.
 */
export function buildWhatsAppOrderUrl(product: Pick<
  Product,
  'title' | 'price_ksh' | 'size' | 'category' | 'image_url'
>): string {
  const formattedPrice = formatKsh(product.price_ksh);
  const fullImageUrl = resolveAbsoluteImageUrl(product.image_url);

  const message = `Hello CREEWRLD! I want to order this thrift item:
- Item: ${product.title}
- Price: KSh ${formattedPrice}
- Size: ${product.size}
- Category: ${product.category}
- Image: ${fullImageUrl}`;

  return `https://wa.me/${CREEWRLD_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppUrl(customPrompt?: string): string {
  const message =
    customPrompt ??
    'Hello CREEWRLD! I am browsing your online thrift store and would like to inquire about current drops.';
  return `https://wa.me/${CREEWRLD_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
