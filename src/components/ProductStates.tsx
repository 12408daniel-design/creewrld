import React from 'react';
import { PackageOpen, Plus, RotateCcw } from 'lucide-react';
import type { FilterCategory } from '../types/product';
import Magnet from './Magnet';
import StarBorder from './StarBorder';

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
      aria-busy="true"
      aria-label="Loading thrift drops"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-[#132238] border border-[#F4EFEA]/15 overflow-hidden flex flex-col"
        >
          <div className="aspect-[4/5] w-full skeleton-shimmer" />
          <div className="p-4 sm:p-5 space-y-3">
            <div className="h-4 w-4/5 skeleton-shimmer" />
            <div className="h-6 w-2/5 skeleton-shimmer" />
            <div className="h-11 w-full skeleton-shimmer mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface EmptyStateProps {
  selectedCategory: FilterCategory;
  onResetCategory?: () => void;
  onOpenAddModal: () => void;
  isAdmin: boolean;
  isSupabaseLive: boolean;
}

export const EmptyArchiveState: React.FC<EmptyStateProps> = ({
  selectedCategory,
  onResetCategory,
  onOpenAddModal,
  isAdmin,
  isSupabaseLive,
}) => {
  return (
    <div className="border border-dashed border-[#F4EFEA]/25 bg-[#132238]/90 p-10 sm:p-16 text-center max-w-2xl mx-auto my-6">
      <div className="w-14 h-14 mx-auto mb-5 bg-[#0A1118] border border-[#F4EFEA]/35 flex items-center justify-center text-[#F4EFEA]">
        <PackageOpen className="w-7 h-7" />
      </div>

      <p className="font-cinzel font-semibold text-xs uppercase tracking-[0.2em] text-[#F4EFEA]/85 mb-2">
        ARCHIVE STATUS // EMPTY RACK
      </p>

      <h3 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#F4EFEA] mb-3">
        {selectedCategory === 'All'
          ? 'No Thrift Pieces In Database Yet'
          : `All ${selectedCategory} Drops Sold Out`}
      </h3>

      <p className="font-sans text-slate-300 text-sm sm:text-base leading-relaxed mb-7">
        {selectedCategory === 'All'
          ? isSupabaseLive
            ? isAdmin
              ? 'Your connected Supabase `products` table currently has 0 items. Upload your first 1-of-1 thrift piece using the Admin uploader.'
              : 'New curated 1-of-1 thrift drops are being steamed and photographed in Nairobi. Check back shortly or message our WhatsApp desk.'
            : 'No drops match your current filter. Reset filters to view the CREEWRLD archive.'
          : `Every 1-of-1 piece in "${selectedCategory}" has been claimed or none match this filter yet. Check all categories or upload a fresh drop.`}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {selectedCategory !== 'All' && onResetCategory && (
          <Magnet padding={60} magnetStrength={3} maxOffset={10} scale={1.03}>
            <StarBorder
              onClick={onResetCategory}
              color="#F4EFEA"
              trailColor="#FFFFFF"
              duration={4.2}
              stars={1}
              trailLength={0.3}
              thickness={1}
              radius={2}
              glow={0.55}
              hover="lap"
              clickPulse
              backgroundColor="#0A1118"
              textColor="#F4EFEA"
              borderColor="rgba(244, 239, 234, 0.35)"
              className="px-5 py-3 hover:border-[#F4EFEA] font-sans font-semibold text-xs uppercase tracking-widest inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>View All Drops</span>
            </StarBorder>
          </Magnet>
        )}

        {isAdmin && (
          <Magnet
            padding={65}
            magnetStrength={2.8}
            maxOffset={12}
            scale={1.03}
            wrapperClassName="admin-only creewrld-magnet-glow"
          >
            <StarBorder
              onClick={onOpenAddModal}
              color="#FFFFFF"
              trailColor="#F4EFEA"
              duration={3.8}
              stars={2}
              trailLength={0.32}
              thickness={1.2}
              radius={2}
              glow={0.65}
              sparkle
              hover="lap"
              clickPulse
              backgroundColor="#F4EFEA"
              textColor="#0A1118"
              borderColor="rgba(255, 255, 255, 0.65)"
              className="px-5 py-3 hover:bg-white font-sans font-extrabold text-xs uppercase tracking-widest inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Drop (Admin)</span>
            </StarBorder>
          </Magnet>
        )}
      </div>
    </div>
  );
};
