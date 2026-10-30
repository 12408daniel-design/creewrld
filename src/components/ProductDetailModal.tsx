import React, { useEffect } from 'react';
import { X, MessageCircle, ShieldCheck, Truck, Sparkles, Trash2 } from 'lucide-react';
import type { Product } from '../types/product';
import { WHATSAPP_TELLERS } from '../config';
import { formatKsh } from '../utils/whatsapp';
import Magnet from './Magnet';
import StarBorder from './StarBorder';

interface ProductDetailModalProps {
  product: Product | null;
  isAdmin: boolean;
  isTellerModalOpen?: boolean;
  onClose: () => void;
  onOrderViaWhatsApp: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isAdmin,
  isTellerModalOpen = false,
  onClose,
  onOrderViaWhatsApp,
  onRequestDelete,
}) => {
  useEffect(() => {
    if (!product || isTellerModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, isTellerModalOpen, onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0A1118]/90 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
    >
      <div
        className="relative w-full max-w-4xl bg-[#132238] border border-[#F4EFEA]/25 overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[92vh] overflow-y-auto shadow-[0_24px_70px_rgba(10,17,24,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product modal"
          className="absolute top-3 right-3 z-20 w-10 h-10 bg-[#0A1118]/90 border border-[#F4EFEA]/25 text-white hover:border-[#F4EFEA] hover:text-[#F4EFEA] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image */}
        <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[480px] bg-[#0A1118]">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-3 py-1 bg-[#0A1118]/90 border border-[#F4EFEA]/25 font-cinzel font-semibold text-xs uppercase tracking-[0.18em] text-[#F4EFEA]">
              {product.category}
            </span>
          </div>
        </div>

        {/* Right Details */}
        <div className="p-6 sm:p-8 flex flex-col justify-between gap-6 bg-[#132238]">
          <div className="space-y-5">
            <div>
              <p className="font-cinzel font-semibold text-[11px] uppercase tracking-[0.2em] text-slate-300 mb-2">
                CREEWRLD // 1-OF-1 THRIFT ARCHIVE
              </p>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#F4EFEA] leading-tight">
                {product.title}
              </h2>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wider text-[#F4EFEA]">
                  KSh {formatKsh(product.price_ksh)}
                </span>
                <span className="font-sans text-xs uppercase tracking-wider text-slate-400">
                  M-Pesa / Cash on Pickup
                </span>
              </div>
            </div>

            {/* Technical Specs Box */}
            <div className="grid grid-cols-2 gap-3 border-y border-[#F4EFEA]/15 py-4">
              <div className="bg-[#0A1118] p-3 border border-[#F4EFEA]/14">
                <span className="block font-cinzel text-[10px] uppercase tracking-[0.18em] text-slate-400">
                  TAG / FIT SIZE
                </span>
                <span className="font-sans text-sm font-bold text-[#F4EFEA] mt-1 block">
                  {product.size}
                </span>
              </div>
              <div className="bg-[#0A1118] p-3 border border-[#F4EFEA]/14">
                <span className="block font-cinzel text-[10px] uppercase tracking-[0.18em] text-slate-400">
                  CONDITION GRADE
                </span>
                <span className="font-sans text-sm font-bold text-[#F4EFEA] mt-1 block">
                  {product.condition}
                </span>
              </div>
            </div>

            {/* Kenyan Thrift Assurance */}
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans text-slate-200">
              <li className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#F4EFEA] shrink-0" />
                <span>Single-piece curation — once claimed on WhatsApp, it’s gone.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#F4EFEA] shrink-0" />
                <span>Same-day rider dispatch across Nairobi &amp; 24hr nationwide courier.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#F4EFEA] shrink-0" />
                <span>Steam-sanitized, authenticated &amp; quality-checked in Nairobi.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <Magnet
              padding={75}
              magnetStrength={2.6}
              maxOffset={14}
              tilt={4}
              scale={1.02}
              wrapperClassName="w-full creewrld-magnet-glow"
            >
              <StarBorder
                onClick={() => onOrderViaWhatsApp(product)}
                color="#FFFFFF"
                trailColor="#F4EFEA"
                duration={3.8}
                stars={2}
                trailLength={0.34}
                thickness={1.4}
                radius={6}
                glow={0.7}
                sparkle
                hover="lap"
                clickPulse
                backgroundColor="#F4EFEA"
                textColor="#000000"
                borderColor="rgba(255, 255, 255, 0.75)"
                style={{ color: '#000000' }}
                className="w-full py-4 px-5 rounded-md bg-[#F4EFEA] text-black font-bold hover:bg-white transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer font-sans text-xs sm:text-sm tracking-wider uppercase"
              >
                <MessageCircle
                  className="w-4 h-4 shrink-0 text-black"
                  style={{ color: '#000000' }}
                />
                <span className="text-black font-bold" style={{ color: '#000000' }}>
                  Order via WhatsApp
                </span>
              </StarBorder>
            </Magnet>

            <p className="text-center font-sans text-[11px] text-slate-400">
              {WHATSAPP_TELLERS.length} Active WhatsApp Tellers · Pre-fills item title, size &amp; KSh price
            </p>

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestDelete(product);
                }}
                className="admin-only w-full py-2.5 px-4 bg-[#FF3B30]/15 hover:bg-[#FF3B30] border border-[#FF3B30] text-[#FF3B30] hover:text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Admin: Delete From Supabase</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
