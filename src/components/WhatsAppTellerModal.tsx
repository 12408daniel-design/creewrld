import React, { useEffect } from 'react';
import { X, MessageCircle, ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';
import type { Product } from '../types/product';
import { WHATSAPP_TELLERS } from '../config';
import {
  buildWhatsAppOrderUrl,
  formatKsh,
  formatWhatsAppPhoneDisplay,
} from '../utils/whatsapp';
import { CreewrldEmblem } from './CreewrldLogo';

interface WhatsAppTellerModalProps {
  product: Product | null;
  onClose: () => void;
}

export const WhatsAppTellerModal: React.FC<WhatsAppTellerModalProps> = ({
  product,
  onClose,
}) => {
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0A1118]/88 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-teller-modal-title"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#132238] border border-[#F4EFEA]/30 shadow-[0_24px_70px_rgba(10,17,24,0.92)] overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Yacht Club Navy Gradient Hairline */}
        <div aria-hidden="true" className="h-[3px] w-full yacht-club-gradient" />

        <div className="p-5 sm:p-7 space-y-5">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close WhatsApp agent selection modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center bg-[#0A1118] border border-[#F4EFEA]/25 text-slate-300 hover:text-[#F4EFEA] hover:border-[#F4EFEA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-start gap-3.5 pr-10">
            <div className="w-11 h-11 rounded-xl bg-[#0A1118] border border-[#F4EFEA]/30 flex items-center justify-center shrink-0">
              <CreewrldEmblem size={30} />
            </div>
            <div className="min-w-0 space-y-1">
              <span className="font-cinzel font-semibold text-[10px] uppercase tracking-[0.2em] text-[#F4EFEA]/80 block">
                WHATSAPP ORDER DESK // SELECT AN AGENT
              </span>
              <h2
                id="whatsapp-teller-modal-title"
                className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#F4EFEA] leading-snug"
              >
                Choose WhatsApp Teller
              </h2>
            </div>
          </div>

          <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
            Select any active CREEWRLD teller below to open WhatsApp with your item details, size,
            and KSh price pre-filled for instant M-Pesa lock-in.
          </p>

          {/* Selected Product Summary Strip */}
          <div className="flex items-center gap-3.5 bg-[#0A1118] border border-[#F4EFEA]/18 p-3 rounded-xl">
            <div className="w-14 h-16 bg-[#132238] border border-[#F4EFEA]/15 overflow-hidden shrink-0 rounded-lg">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#F4EFEA]">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-cinzel font-bold text-xs sm:text-sm uppercase tracking-wider text-[#F4EFEA] truncate">
                {product.title}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="font-cinzel font-bold text-xs sm:text-sm tracking-wider text-white">
                  KSh {formatKsh(product.price_ksh)}
                </span>
                <span className="text-[#F4EFEA]/30">•</span>
                <span className="font-sans text-[11px] font-semibold text-slate-300">
                  Size {product.size}
                </span>
                <span className="text-[#F4EFEA]/30">•</span>
                <span className="font-sans text-[11px] text-slate-400">
                  {product.condition}
                </span>
              </div>
            </div>
          </div>

          {/* Three Distinct WhatsApp Teller Agent Options */}
          <div className="space-y-3" role="list" aria-label="Available WhatsApp Tellers">
            {WHATSAPP_TELLERS.map((teller) => {
              const tellerHref = buildWhatsAppOrderUrl(product, teller.number, teller.name);
              const formattedNumber = formatWhatsAppPhoneDisplay(teller.number);

              return (
                <a
                  key={teller.id}
                  role="listitem"
                  href={tellerHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="group w-full bg-[#0A1118] hover:bg-[#0A1118]/80 border border-[#F4EFEA]/22 hover:border-[#F4EFEA] rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#132238] border border-[#F4EFEA]/25 group-hover:bg-[#F4EFEA] flex items-center justify-center shrink-0 transition-colors">
                      <MessageCircle className="w-4 h-4 text-[#F4EFEA] group-hover:text-black transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span className="font-cinzel font-bold text-xs sm:text-sm uppercase tracking-wider text-[#F4EFEA] group-hover:text-white truncate">
                          {teller.name}
                        </span>
                      </div>
                      <p className="font-mono-spec text-[11px] sm:text-xs text-slate-300 mt-0.5">
                        WhatsApp: {formattedNumber}
                      </p>
                    </div>
                  </div>

                  <span
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#F4EFEA] group-hover:bg-white text-black font-sans font-bold text-[11px] uppercase tracking-wider transition-colors"
                    style={{ color: '#000000' }}
                  >
                    <span className="text-black" style={{ color: '#000000' }}>
                      Order
                    </span>
                    <ArrowUpRight
                      className="w-3.5 h-3.5 text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: '#000000' }}
                    />
                  </span>
                </a>
              );
            })}
          </div>

          {/* Bottom Trust Note */}
          <div className="pt-2 border-t border-[#F4EFEA]/12 flex items-center justify-between gap-3 text-[11px] font-sans text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F4EFEA] shrink-0" />
              <span>Official CREEWRLD Verified Kenyan Numbers</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-[#F4EFEA] uppercase tracking-wider font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
