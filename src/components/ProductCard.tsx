import React, { useState } from 'react';
import { MessageCircle, Trash2, ArrowUpRight, Sparkles } from 'lucide-react';
import type { Product } from '../types/product';
import { formatKsh } from '../utils/whatsapp';
import Magnet from './Magnet';
import StarBorder from './StarBorder';

interface ProductCardProps {
  product: Product;
  adminMode: boolean;
  onSelectProduct: (product: Product) => void;
  onOrderViaWhatsApp: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  adminMode,
  onSelectProduct,
  onOrderViaWhatsApp,
  onRequestDelete,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article
      data-product-id={product.id}
      className="group relative rounded-xl bg-[#132238] border border-[#F4EFEA]/20 hover:border-[#F4EFEA]/65 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_14px_34px_rgba(10,17,24,0.55)]"
    >
      {/* Subtle Yacht Club Navy Gradient Top Hairline Accent */}
      <div aria-hidden="true" className="h-[2px] w-full yacht-club-gradient opacity-80" />

      {/* Top Image Frame */}
      <div
        onClick={() => onSelectProduct(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectProduct(product);
          }
        }}
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#0A1118] cursor-pointer"
      >
        {!imageLoaded && !imageFailed && (
          <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true" />
        )}

        {imageFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0A1118] text-slate-400">
            <Sparkles className="w-7 h-7 text-[#F4EFEA] mb-2" />
            <span className="font-cinzel text-xs uppercase tracking-wider text-[#F4EFEA]">
              CREEWRLD ARCHIVE PIECE
            </span>
          </div>
        ) : (
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
            className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Subtle Navy Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A1118] via-transparent to-black/25 opacity-80" />

        {/* Category Pill & Quick Inspect */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#0A1118]/90 backdrop-blur-sm border border-[#F4EFEA]/25 font-cinzel text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F4EFEA]">
            {product.category}
          </span>

          {/* Admin Delete Trash Icon (Strictly rendered only for authenticated admins) */}
          {adminMode ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRequestDelete(product);
              }}
              title="Delete product from Supabase Storage & Database"
              aria-label={`Delete ${product.title}`}
              className="admin-only w-9 h-9 rounded-lg flex items-center justify-center bg-[#FF3B30] hover:bg-red-600 text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-[#132238]/90 border border-[#F4EFEA]/20 font-cinzel text-[10px] font-semibold uppercase tracking-wider text-[#F4EFEA]">
              1 OF 1
            </span>
          )}
        </div>

        {/* Size & Condition Spec Chips */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-[#0A1118]/90 border border-[#F4EFEA]/20 font-sans font-semibold text-[11px] text-white">
              SIZE: <strong className="text-[#F4EFEA]">{product.size}</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-[#0A1118]/90 border border-[#F4EFEA]/20 font-sans text-[11px] text-slate-200">
              {product.condition}
            </span>
          </div>
          <span className="w-7 h-7 rounded-lg bg-[#0A1118]/85 border border-[#F4EFEA]/25 flex items-center justify-center text-[#F4EFEA] opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Product Body + WhatsApp Direct Order CTA */}
      <div className="p-4 sm:p-5 flex flex-col gap-4 flex-1 justify-between bg-[#132238]">
        <div
          onClick={() => onSelectProduct(product)}
          className="space-y-1.5 cursor-pointer"
        >
          <h3 className="font-cinzel font-bold text-sm sm:text-base uppercase tracking-wider text-[#F4EFEA] leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {product.title}
          </h3>
          <div className="flex items-baseline justify-between pt-1">
            <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-[#F4EFEA]">
              KSh {formatKsh(product.price_ksh)}
            </span>
            <span className="font-sans text-[10px] uppercase tracking-widest text-slate-400">
              Nairobi Stock
            </span>
          </div>
        </div>

        {/* Direct Order via WhatsApp Button (Opens 3-Teller Agent Selection Modal) */}
        <Magnet
          padding={55}
          magnetStrength={3.2}
          maxOffset={9}
          tilt={3}
          scale={1.02}
          wrapperClassName="w-full creewrld-magnet-glow"
        >
          <StarBorder
            onClick={() => onOrderViaWhatsApp(product)}
            color="#FFFFFF"
            trailColor="#F4EFEA"
            duration={4}
            stars={2}
            trailLength={0.32}
            thickness={1.2}
            radius={8}
            glow={0.65}
            sparkle
            hover="lap"
            clickPulse
            backgroundColor="#F4EFEA"
            textColor="#000000"
            borderColor="rgba(255, 255, 255, 0.75)"
            style={{ color: '#000000' }}
            className="w-full py-3.5 px-4 rounded-lg bg-[#F4EFEA] text-black font-bold hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-sans text-xs tracking-wider uppercase active:scale-[0.99]"
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
      </div>
    </article>
  );
};
