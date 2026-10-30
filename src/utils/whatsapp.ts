import type { Product } from '../types/product';
import { WHATSAPP_TELLERS, type WhatsAppTeller } from '../config';

export { WHATSAPP_TELLERS, type WhatsAppTeller };

export const CREEWRLD_WHATSAPP_NUMBER = WHATSAPP_TELLERS[0].number;
export const CREEWRLD_WHATSAPP_DISPLAY = formatWhatsAppPhoneDisplay(CREEWRLD_WHATSAPP_NUMBER);

/**
 * Strips any leading '+', spaces, dashes, or non-digits and normalizes leading '07...' / '01...'
 * to Kenyan international format '254...' for clean https://wa.me/<number> links.
 */
export function sanitizeWhatsAppNumber(rawNumber: string): string {
  const digitsOnly = rawNumber.replace(/\D/g, '');
  if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
    return `254${digitsOnly.slice(1)}`;
  }
  return digitsOnly;
}

/**
 * Formats an international WhatsApp number like '254719526649' -> '+254 719 526 649' for UI display.
 */
export function formatWhatsAppPhoneDisplay(rawNumber: string): string {
  const clean = sanitizeWhatsAppNumber(rawNumber);
  if (clean.startsWith('254') && clean.length === 12) {
    return `+${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 9)} ${clean.slice(9)}`;
  }
  return `+${clean}`;
}

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
 * Constructs a pre-filled WhatsApp order URL directed to the chosen CREEWRLD teller
 * (defaults to Teller 1: 254719526649) following the CREEWRLD order template.
 */
export function buildWhatsAppOrderUrl(
  product: Pick<Product, 'title' | 'price_ksh' | 'size' | 'category' | 'image_url'>,
  tellerNumber: string = CREEWRLD_WHATSAPP_NUMBER,
  tellerName?: string
): string {
  const cleanNumber = sanitizeWhatsAppNumber(tellerNumber);
  const formattedPrice = formatKsh(product.price_ksh);
  const fullImageUrl = resolveAbsoluteImageUrl(product.image_url);
  const greeting = tellerName
    ? `Hello CREEWRLD (${tellerName})! I want to order this thrift item:`
    : 'Hello CREEWRLD! I want to order this thrift item:';

  const message = `${greeting}
- Item: ${product.title}
- Price: KSh ${formattedPrice}
- Size: ${product.size}
- Category: ${product.category}
- Image: ${fullImageUrl}`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppUrl(
  customPrompt?: string,
  tellerNumber: string = CREEWRLD_WHATSAPP_NUMBER
): string {
  const cleanNumber = sanitizeWhatsAppNumber(tellerNumber);
  const message =
    customPrompt ??
    'Hello CREEWRLD! I am browsing your online thrift store and would like to inquire about current drops.';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
