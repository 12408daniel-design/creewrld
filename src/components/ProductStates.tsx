import React from 'react';
import { PackageOpen, Plus, MessageCircle, RotateCcw } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '../utils/whatsapp';

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-busy="true"
      aria-label="Loading CREEWRLD thrift drops"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-[#181818] border border-white/10 overflow-hidden flex flex-col"
        >
          <div className="aspect-[4/5] w-full skeleton-pulse-surface border-b border-white/10 relative">
            <div className="absolute top-3 left-3 h-5 w-20 bg-[#0D0D0D]/70" />
            <div className="absolute bottom-3 left-3 h-5 w-28 bg-[#0D0D0D]/70" />
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-4/5 skeleton-pulse-surface" />
              <div className="h-4 w-3/5 skeleton-pulse-surface" />
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
              <div className="h-4 w-20 skeleton-pulse-surface" />
              <div className="h-5 w-24 skeleton-pulse-surface" />
            </div>
            <div className="h-11 w-full bg-[#CCFF00]/20 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface EmptyArchiveStateProps {
  selectedCategory?: string;
  onResetCategory?: () => void;
  onOpenAddModal?: () => void;
  isSupabaseLive: boolean;
}

export const EmptyArchiveState: React.FC<EmptyArchiveStateProps> = ({
  selectedCategory = 'All',
  onResetCategory,
  onOpenAddModal,
  isSupabaseLive,
}) => {
  const isFiltered = selectedCategory !== 'All';

  return (
    <div className="bg-[#181818] border border-white/12 p-8 sm:p-14 text-center max-w-2xl mx-auto my-6">
      <div className="w-14 h-14 mx-auto mb-5 border border-[#CCFF00]/50 bg-[#0D0D0D] flex items-center justify-center text-[#CCFF00]">
        <PackageOpen className="w-7 h-7" />
      </div>

      <p className="font-mono-spec text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-2">
        {isFiltered ? `CATEGORY // ${selectedCategory.toUpperCase()}` : 'ARCHIVE STATUS // 0 LIVE PIECES'}
      </p>

      <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mb-3">
        {isFiltered
          ? `No ${selectedCategory} Drops Available Right Now`
          : 'Vault Currently Empty — Next Drop Incoming'}
      </h3>

      <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-7">
        {isFiltered
          ? `Every CREEWRLD piece is 1-of-1. All items in "${selectedCategory}" have been claimed or haven't been uploaded yet.`
          : isSupabaseLive
          ? 'Connected to Supabase `products` table — 0 rows found yet. Upload your first thrift drop via Admin Mode or message us directly on WhatsApp for early access.'
          : 'No thrift items are currently in the live catalog. Upload a drop in Admin Mode or message our Nairobi studio on WhatsApp.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isFiltered && onResetCategory && (
          <button
            type="button"
            onClick={onResetCategory}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#CCFF00] text-[#0D0D0D] font-mono-spec font-bold text-xs uppercase tracking-[0.18em] hover:bg-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            View All Categories
          </button>
        )}

        {onOpenAddModal && (
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#0D0D0D] border border-white/25 text-white hover:border-[#CCFF00] hover:text-[#CCFF00] font-mono-spec font-bold text-xs uppercase tracking-[0.18em] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Upload Drop
          </button>
        )}

        <a
          href={buildGeneralWhatsAppUrl(
            'Hello CREEWRLD! Please alert me when the next thrift archive drop goes live.'
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#121212] border border-[#CCFF00]/40 text-[#CCFF00] hover:bg-[#CCFF00] hover:text-[#0D0D0D] font-mono-spec font-bold text-xs uppercase tracking-[0.18em] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Request a Piece on WhatsApp
        </a>
      </div>
    </div>
  );
};
