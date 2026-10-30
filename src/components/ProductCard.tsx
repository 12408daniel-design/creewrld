import React, { useState } from 'react';
import { Trash2, ArrowUpRight, MessageCircle, Eye } from 'lucide-react';
import type { Product } from '../types/product';
import { buildWhatsAppOrderUrl, formatKsh } from '../utils/whatsapp';
import { CreewrldStackedLogo } from './CreewrldLogo';
import Magnet from './Magnet';
import StarBorder from './StarBorder';

interface ProductCardProps {
  product: Product;
  adminMode: boolean;
  onSelectProduct: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  adminMode,
  onSelectProduct,
  onRequestDelete,
}) => {
  const [imageBroken, setImageBroken] = useState(false);
  const whatsappUrl = buildWhatsAppOrderUrl(product);

  return (
    <article className="group relative bg-[#181818] border border-white/10 hover:border-[#CCFF00] transition-all duration-300 flex flex-col justify-between">
      {/* Image Stage */}
      <div className="relative aspect-[4/5] w-full bg-[#111111] overflow-hidden border-b border-white/10">
        {!imageBroken && product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            onError={() => setImageBroken(true)}
            onClick={() => onSelectProduct(product)}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 cursor-pointer"
          />
        ) : (
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="w-full h-full flex flex-col items-center justify-center bg-[#121212] text-neutral-500 p-6 text-center cursor-pointer"
          >
            <CreewrldStackedLogo width={110} className="opacity-35 mb-3" />
            <span className="font-mono-spec text-[11px] uppercase tracking-widest">
              Archive Visual Unavailable
            </span>
          </button>
        )}

        {/* Top-Left Luxury Category Tag */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="inline-block bg-[#0D0D0D]/90 backdrop-blur-sm border border-white/15 px-2.5 py-1 font-cinzel font-semibold text-[10px] uppercase tracking-[0.18em] text-white">
            {product.category} Archive
          </span>
        </div>

        {/* Top-Right Action Controls: Quick View for shoppers + .admin-only Delete Trash icon when authenticated */}
        <div
          className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 transition-opacity duration-200 ${
            adminMode
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            title="Quick View Item"
            aria-label={`Quick view ${product.title}`}
            className="w-8 h-8 flex items-center justify-center bg-[#0D0D0D]/90 border border-white/20 text-white hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {adminMode && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRequestDelete(product);
              }}
              title="Delete item & storage image"
              aria-label={`Delete ${product.title}`}
              className="admin-only w-8 h-8 flex items-center justify-center bg-[#FF3B30] text-white border border-[#FF3B30] hover:bg-red-700 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Bottom-Left Condition Rating Badge */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 bg-[#0D0D0D]/90 backdrop-blur-sm border border-white/15 px-2.5 py-1 font-mono-spec text-[10px] uppercase tracking-wider text-neutral-200">
            <span className="w-1.5 h-1.5 bg-[#CCFF00] inline-block" />
            {product.condition}
          </span>
        </div>
      </div>

      {/* Card Body & Direct WhatsApp Ordering CTA */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="text-left group/title focus:outline-none cursor-pointer w-full"
          >
            <h3 className="font-cinzel font-bold text-sm sm:text-base uppercase tracking-wider text-white leading-snug line-clamp-2 group-hover/title:text-[#CCFF00] transition-colors">
              {product.title}
            </h3>
          </button>

          {/* Size & KSh Price Spec Row */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-baseline justify-between gap-2">
            <div className="font-sans text-xs text-neutral-400 uppercase tracking-wider">
              SIZE: <span className="text-white font-semibold">{product.size}</span>
            </div>
            <div className="font-cinzel text-base sm:text-lg font-bold text-[#CCFF00] tracking-wider">
              KSh {formatKsh(product.price_ksh)}
            </div>
          </div>
        </div>

        {/* Direct Order via WhatsApp Button */}
        <Magnet
          padding={48}
          magnetStrength={3.4}
          maxOffset={8}
          tilt={4}
          scale={1.02}
          wrapperClassName="w-full creewrld-magnet-glow"
          innerClassName="w-full"
          style={{ display: 'block', width: '100%' }}
        >
          <StarBorder
            as="a"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="#FFFFFF"
            trailColor="#CCFF00"
            duration={4}
            stars={1}
            trailLength={0.28}
            thickness={1.2}
            radius={2}
            glow={0.55}
            hover="reveal"
            clickPulse
            backgroundColor="#CCFF00"
            textColor="#0D0D0D"
            borderColor="rgba(255, 255, 255, 0.35)"
            className="w-full py-3 px-4 hover:bg-white font-sans font-extrabold text-xs uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4 fill-[#0D0D0D] stroke-[#0D0D0D]" />
            <span>Order via WhatsApp</span>
            <ArrowUpRight className="w-4 h-4" />
          </StarBorder>
        </Magnet>
      </div>
    </article>
  );
};
