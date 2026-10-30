import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, RefreshCw, Plus } from 'lucide-react';
import {
  PRODUCT_CATEGORIES,
  type FilterCategory,
  type Product,
} from '../types/product';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton, EmptyArchiveState } from '../components/ProductStates';
import Magnet from '../components/Magnet';
import StarBorder from '../components/StarBorder';
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
  onOrderViaWhatsApp: (product: Product) => void;
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
  onOrderViaWhatsApp,
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
      className={`relative w-full min-h-screen bg-[#0A1118] full-bleed-grid-bg overflow-x-hidden ${
        adminMode ? 'pt-36 sm:pt-40' : 'pt-24 sm:pt-28'
      } pb-16`}
    >
      {/* Full-Bleed Yacht Club Navy Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 -left-32 w-[32rem] h-[32rem] rounded-full yacht-club-gradient opacity-20 blur-[140px]"
      />

      {/* Full-Bleed Interactive Topographic Masthead Banner */}
      <div className="relative w-full overflow-hidden border-y border-[#F4EFEA]/18 bg-[#0A1118] py-10 sm:py-14 mb-10">
        <div className="absolute inset-0 w-full h-full z-0">
          <Topography
            color="#F4EFEA"
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
            glow={0.45}
            depthOfField={0.3}
            fog={0.45}
            brightness={0.8}
            opacity={0.55}
            hoverEffect="trace"
            clickEffect="pulse"
            markers="dots"
            intro={true}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#0A1118]/92 via-[#0A1118]/72 to-[#132238]/35"
        />

        <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-cinzel font-semibold text-xs uppercase tracking-[0.22em] text-[#F4EFEA]/85">
                CREEWRLD // SHOP ARCHIVE
              </span>
              <span className="bg-[#132238]/95 border border-[#F4EFEA]/20 px-2.5 py-0.5 font-cinzel font-semibold text-[10px] uppercase tracking-[0.16em] text-[#F4EFEA]">
                {isSupabaseLive ? 'LIVE SUPABASE DB' : 'SHOWCASE CATALOG'}
              </span>
            </div>
            <h1 className="font-cinzel text-3xl sm:text-5xl xl:text-6xl font-bold uppercase tracking-wider text-[#F4EFEA]">
              All Thrift Drops
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-sans text-xs uppercase tracking-widest text-slate-300 bg-[#0A1118]/80 border border-[#F4EFEA]/15 px-3 py-2">
              Showing{' '}
              <strong className="font-cinzel text-[#F4EFEA]">{filteredProducts.length}</strong> of{' '}
              <strong className="font-cinzel text-[#F4EFEA]">{products.length}</strong> pieces
            </span>

            <Magnet padding={55} magnetStrength={3} maxOffset={10} tilt={4} scale={1.03}>
              <StarBorder
                onClick={onRefresh}
                title="Refresh inventory from Supabase"
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
                backgroundColor="#132238"
                textColor="#F4EFEA"
                borderColor="rgba(244, 239, 234, 0.35)"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#F4EFEA] hover:text-[#0A1118] transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </StarBorder>
            </Magnet>

            {adminMode && (
              <Magnet
                padding={60}
                magnetStrength={2.8}
                maxOffset={10}
                tilt={4}
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 hover:bg-white text-xs font-sans font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </StarBorder>
              </Magnet>
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
                  className={`shrink-0 px-4 py-2.5 font-sans text-xs uppercase tracking-[0.16em] border transition-all flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-[#F4EFEA] text-[#0A1118] border-[#F4EFEA] font-extrabold'
                      : 'bg-[#132238] text-slate-200 border-[#F4EFEA]/15 hover:border-[#F4EFEA]/50 hover:text-[#F4EFEA] font-semibold'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 font-cinzel font-bold ${
                      active
                        ? 'bg-[#0A1118] text-[#F4EFEA]'
                        : 'bg-[#0A1118]/75 text-slate-300'
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
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drops by title, size (e.g. EU 42, L), or condition..."
                className="w-full bg-[#132238] border border-[#F4EFEA]/18 focus:border-[#F4EFEA] pl-10 pr-4 py-3 font-sans text-sm text-white placeholder:text-slate-400 outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-4 lg:col-span-3 relative flex items-center bg-[#132238] border border-[#F4EFEA]/18 px-3.5">
              <SlidersHorizontal className="w-4 h-4 text-[#F4EFEA] shrink-0 mr-2.5" />
              <label htmlFor="shop-sort" className="sr-only">
                Sort products
              </label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-[#132238] py-3 font-sans font-semibold text-xs uppercase tracking-wider text-[#F4EFEA] outline-none cursor-pointer"
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
          <div className="mb-8 p-4 bg-[#FF3B30]/15 border border-[#FF3B30] text-xs sm:text-sm font-sans text-red-200 flex items-center justify-between gap-4">
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
                onOrderViaWhatsApp={onOrderViaWhatsApp}
                onRequestDelete={onRequestDelete}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
