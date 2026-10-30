import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, RefreshCw, Plus } from 'lucide-react';
import {
  PRODUCT_CATEGORIES,
  type FilterCategory,
  type Product,
} from '../types/product';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton, EmptyArchiveState } from '../components/ProductStates';
import Topography from '../components/Topography';

type SortOption = 'newest' | 'price-asc' | 'price-desc';

interface ShopViewProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  adminMode: boolean;
  isSupabaseLive: boolean;
  onSelectProduct: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
  onRefresh: () => void;
  onOpenAddModal: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  loading,
  error,
  selectedCategory,
  onSelectCategory,
  adminMode,
  isSupabaseLive,
  onSelectProduct,
  onRequestDelete,
  onRefresh,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    for (const cat of PRODUCT_CATEGORIES) {
      if (cat !== 'All') {
        counts[cat] = products.filter(
          (item) => item.category.toLowerCase() === cat.toLowerCase()
        ).length;
      }
    }
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const byCategoryAndQuery = products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.size.toLowerCase().includes(normalizedQuery) ||
        item.condition.toLowerCase().includes(normalizedQuery)
      );
    });

    return [...byCategoryAndQuery].sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price_ksh) - Number(b.price_ksh);
      if (sortBy === 'price-desc') return Number(b.price_ksh) - Number(a.price_ksh);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section
      className={`relative w-full min-h-screen full-bleed-grid-bg overflow-x-hidden ${
        adminMode ? 'pt-36 sm:pt-40' : 'pt-24 sm:pt-28'
      } pb-16`}
    >
      {/* Full-Bleed Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 -left-32 w-[32rem] h-[32rem] rounded-full bg-[#CCFF00]/7 blur-[140px]"
      />

      {/* Full-Bleed Interactive Topographic Masthead Banner */}
      <div className="relative w-full overflow-hidden border-y border-white/15 bg-[#0D0D0D] py-10 sm:py-14 mb-10">
        <div className="absolute inset-0 w-full h-full z-0">
          <Topography
            color="#CCFF00"
            lineCount={20}
            lineWidth={1.1}
            majorLines={true}
            elevation={0.85}
            foreground={0.15}
            scale={1.1}
            detail={0.35}
            tilt={36}
            speed={0.18}
            direction="forward"
            morph={0.15}
            glow={0.5}
            depthOfField={0.3}
            fog={0.42}
            brightness={0.85}
            opacity={0.62}
            hoverEffect="trace"
            clickEffect="pulse"
            markers="dots"
            intro={true}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#0D0D0D]/90 via-[#0D0D0D]/68 to-[#0D0D0D]/30"
        />

        <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-mono-spec text-xs uppercase tracking-[0.25em] text-[#CCFF00]">
                CREEWRLD // SHOP ARCHIVE
              </span>
              <span className="bg-[#181818]/90 border border-white/15 px-2.5 py-0.5 font-mono-spec text-[10px] uppercase tracking-wider text-neutral-300">
                {isSupabaseLive ? 'LIVE SUPABASE DB' : 'SHOWCASE CATALOG'}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl xl:text-6xl font-extrabold uppercase tracking-tight text-white">
              All Thrift Drops
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono-spec text-xs uppercase tracking-widest text-neutral-300 bg-[#0D0D0D]/75 border border-white/10 px-3 py-2">
              Showing{' '}
              <strong className="text-white">{filteredProducts.length}</strong> of{' '}
              <strong className="text-white">{products.length}</strong> pieces
            </span>

            <button
              type="button"
              onClick={onRefresh}
              title="Refresh inventory from Supabase"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#181818]/95 border border-white/15 hover:border-[#CCFF00] text-xs font-mono-spec uppercase tracking-wider text-neutral-200 hover:text-[#CCFF00] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync
            </button>

            {adminMode && (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="admin-only inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#CCFF00] text-[#0D0D0D] hover:bg-white text-xs font-mono-spec font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full-Width Filter Controls & Product Grid */}
      <div className="w-full px-6 md:px-12 lg:px-16 relative z-10">
        {/* Filter Controls: Live Category Pill Tabs + Search + Sort */}
        <div className="space-y-5 mb-10 w-full">
          {/* Category Pills */}
          <div
            role="tablist"
            aria-label="Filter products by category"
            className="flex items-center gap-2 overflow-x-auto pb-2"
          >
            {PRODUCT_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              const count = categoryCounts[category] ?? 0;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelectCategory(category)}
                  className={`shrink-0 px-4 py-2.5 font-mono-spec text-xs uppercase tracking-[0.18em] border transition-all flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-[#CCFF00] text-[#0D0D0D] border-[#CCFF00] font-bold'
                      : 'bg-[#181818] text-neutral-300 border-white/12 hover:border-white/35 hover:text-white'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 ${
                      active
                        ? 'bg-[#0D0D0D] text-[#CCFF00]'
                        : 'bg-[#0D0D0D] text-neutral-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Price Sort Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full">
            <div className="md:col-span-8 lg:col-span-9 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drops by title, size (e.g. EU 42, L), or condition..."
                className="w-full bg-[#181818] border border-white/12 focus:border-[#CCFF00] pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-4 lg:col-span-3 relative flex items-center bg-[#181818] border border-white/12 px-3.5">
              <SlidersHorizontal className="w-4 h-4 text-[#CCFF00] shrink-0 mr-2.5" />
              <label htmlFor="shop-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-[#181818] py-3 font-mono-spec text-xs uppercase tracking-wider text-white outline-none cursor-pointer"
              >
                <option value="newest">Sort: Newest Drops</option>
                <option value="price-asc">Price: Low to High (KSh)</option>
                <option value="price-desc">Price: High to Low (KSh)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Supabase Error Banner if any */}
        {error && (
          <div className="mb-8 p-4 bg-[#FF3B30]/15 border border-[#FF3B30] text-xs sm:text-sm font-mono-spec text-red-200 flex items-center justify-between gap-4">
            <span>Supabase Query Error: {error}</span>
            <button
              type="button"
              onClick={onRefresh}
              className="px-3 py-1 bg-[#FF3B30] text-white uppercase text-xs font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Product Grid / Skeletons / Empty State */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length === 0 ? (
          <EmptyArchiveState
            selectedCategory={selectedCategory}
            onResetCategory={() => {
              onSelectCategory('All');
              setSearchQuery('');
            }}
            onOpenAddModal={onOpenAddModal}
            isAdmin={adminMode}
            isSupabaseLive={isSupabaseLive}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                adminMode={adminMode}
                onSelectProduct={onSelectProduct}
                onRequestDelete={onRequestDelete}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
