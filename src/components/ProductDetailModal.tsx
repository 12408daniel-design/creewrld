import React, { useEffect } from 'react';
import {
  X,
  MessageCircle,
  ArrowUpRight,
  Trash2,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import type { Product } from '../types/product';
import { buildWhatsAppOrderUrl, formatKsh, CREEWRLD_WHATSAPP_DISPLAY } from '../utils/whatsapp';
import Magnet from './Magnet';

interface ProductDetailModalProps {
  product: Product | null;
  isAdmin: boolean;
  onClose: () => void;
  onRequestDelete: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isAdmin,
  onClose,
  onRequestDelete,
}) => {
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const whatsappUrl = buildWhatsAppOrderUrl(product);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div
        className="relative w-full max-w-4xl bg-[#181818] border border-white/20 overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product modal"
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-[#0D0D0D]/90 border border-white/20 text-white hover:border-[#CCFF00] hover:text-[#CCFF00] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="relative bg-[#0D0D0D] aspect-[4/5] md:aspect-auto md:min-h-[480px] border-b md:border-b-0 md:border-r border-white/12 overflow-hidden">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-[#0D0D0D]/90 border border-white/20 px-3 py-1 font-mono-spec text-[11px] uppercase tracking-[0.2em] text-white">
              {product.category}
            </span>
            <span className="bg-[#CCFF00] px-3 py-1 font-mono-spec text-[11px] font-bold uppercase tracking-[0.15em] text-[#0D0D0D]">
              1-OF-1 PIECE
            </span>
          </div>
        </div>

        {/* Right: Specs & Direct WhatsApp Ordering */}
        <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <p className="font-mono-spec text-[11px] uppercase tracking-[0.24em] text-neutral-400 mb-2">
              CREEWRLD ARCHIVE // LOT #{product.id.slice(0, 8).toUpperCase()}
            </p>

            <h2
              id="modal-product-title"
              className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight"
            >
              {product.title}
            </h2>

            <div className="mt-4 pb-5 border-b border-white/12 flex items-baseline justify-between gap-4">
              <div className="font-mono-spec text-2xl sm:text-3xl font-bold text-[#CCFF00]">
                KSh {formatKsh(product.price_ksh)}
              </div>
              <span className="font-mono-spec text-xs uppercase tracking-widest text-neutral-400">
                M-PESA / CASH ON PICKUP
              </span>
            </div>

            {/* Technical Spec Grid */}
            <div className="grid grid-cols-2 gap-3 my-5">
              <div className="bg-[#0D0D0D] border border-white/10 p-3.5">
                <span className="block font-mono-spec text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                  TAGGED SIZE
                </span>
                <span className="mt-1 block font-mono-spec text-sm font-bold text-white">
                  {product.size}
                </span>
              </div>

              <div className="bg-[#0D0D0D] border border-white/10 p-3.5">
                <span className="block font-mono-spec text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                  CONDITION GRADE
                </span>
                <span className="mt-1 inline-flex items-center gap-1.5 font-mono-spec text-sm font-bold text-[#CCFF00]">
                  <Sparkles className="w-3.5 h-3.5" />
                  {product.condition}
                </span>
              </div>
            </div>

            {/* Fulfillment Assurance */}
            <div className="space-y-2.5 text-xs text-neutral-300 border-t border-white/10 pt-4">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
                <span>
                  Steam-sanitized, inspected, and graded by CREEWRLD Nairobi curators. Single piece
                  only — first confirmed WhatsApp claim secures it.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
                <span>
                  Same-day rider dispatch across Nairobi &amp; 24hr Wells Fargo / Fargo Courier nationwide across Kenya.
                </span>
              </div>
            </div>
          </div>

          {/* Action Block: Direct WhatsApp Order + Subtle Delete */}
          <div className="space-y-3 pt-2">
            <Magnet
              padding={65}
              magnetStrength={2.8}
              maxOffset={10}
              tilt={5}
              scale={1.02}
              wrapperClassName="w-full creewrld-magnet-glow"
              innerClassName="w-full"
              style={{ display: 'block', width: '100%' }}
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-5 bg-[#CCFF00] text-[#0D0D0D] hover:bg-white font-mono-spec font-bold text-xs sm:text-sm uppercase tracking-[0.18em] flex items-center justify-center gap-2.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-[#0D0D0D] stroke-[#0D0D0D]" />
                <span>Order via WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </Magnet>

            <div className="flex items-center justify-between pt-1">
              <span className="font-mono-spec text-[11px] text-neutral-400">
                Direct Line: {CREEWRLD_WHATSAPP_DISPLAY}
              </span>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestDelete(product);
                  }}
                  className="admin-only inline-flex items-center gap-1.5 font-mono-spec text-[11px] uppercase tracking-wider text-neutral-400 hover:text-[#FF3B30] transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Listing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
