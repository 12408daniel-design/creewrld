import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  MessageCircle,
  ShieldCheck,
  Zap,
  Sparkles,
  MapPin,
} from 'lucide-react';
import type { FilterCategory, Product } from '../types/product';
import {
  CreewrldEmblem,
  CreewrldStackedLogo,
  CreewrldWordmark,
} from '../components/CreewrldLogo';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton, EmptyArchiveState } from '../components/ProductStates';
import { buildGeneralWhatsAppUrl, CREEWRLD_WHATSAPP_DISPLAY } from '../utils/whatsapp';

interface HomeViewProps {
  products: Product[];
  loading: boolean;
  adminMode: boolean;
  isSupabaseLive: boolean;
  onNavigateToShop: (category?: FilterCategory) => void;
  onSelectProduct: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
  onOpenAddModal: () => void;
}

const CURATED_WORLDS: Array<{
  category: Exclude<FilterCategory, 'All'>;
  code: string;
  tagline: string;
  coverImage: string;
}> = [
  {
    category: 'Sneakers',
    code: '01',
    tagline: 'Retro runners, court highs & rare deadstock pairs',
    coverImage: '/images/drop-sneakers-1.jpg',
  },
  {
    category: 'Streetwear',
    code: '02',
    tagline: '480GSM boxy hoodies, tactical vests & graphic heavyweights',
    coverImage: '/images/drop-streetwear-1.jpg',
  },
  {
    category: 'Old Money',
    code: '03',
    tagline: 'Italian wool overcoats, pleated tailoring & heritage knits',
    coverImage: '/images/drop-oldmoney-1.jpg',
  },
  {
    category: 'Y2K',
    code: '04',
    tagline: 'Early-2000s moto leathers, chrome frames & cyber cuts',
    coverImage: '/images/drop-y2k-1.jpg',
  },
  {
    category: 'Men',
    code: '05',
    tagline: 'Baggy selvedge carpenter denim, workwear & outer shells',
    coverImage: '/images/drop-men-1.jpg',
  },
  {
    category: 'Women',
    code: '06',
    tagline: 'Structured vintage leather baguettes, cropped silhouettes & silver',
    coverImage: '/images/drop-women-1.jpg',
  },
];

const SOCIAL_CHANNELS = [
  {
    name: 'Instagram',
    handle: '@creewrld.ke',
    note: 'Daily story drops & fit checks',
    href: 'https://instagram.com',
  },
  {
    name: 'TikTok',
    handle: '@creewrld',
    note: 'Bale unboxings & Nairobi styling',
    href: 'https://tiktok.com',
  },
  {
    name: 'WhatsApp Concierge',
    handle: CREEWRLD_WHATSAPP_DISPLAY,
    note: 'Instant 1-on-1 order desk',
    href: buildGeneralWhatsAppUrl(),
  },
  {
    name: 'X (Twitter)',
    handle: '@creewrld',
    note: 'Drop countdowns & restock alerts',
    href: 'https://x.com',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  loading,
  adminMode,
  isSupabaseLive,
  onNavigateToShop,
  onSelectProduct,
  onRequestDelete,
  onOpenAddModal,
}) => {
  const featuredProducts = products.slice(0, 6);

  const getCategoryCount = (cat: string) =>
    products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;

  return (
    <div>
      {/* =====================================================================
          HERO SECTION
      ====================================================================== */}
      <section className="relative overflow-hidden border-b border-white/12">
        {/* Subtle Architectural Hairline Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-22 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Editorial Column */}
            <div className="lg:col-span-7 space-y-7">
              {/* Customer Rating Badge */}
              <div className="inline-flex flex-wrap items-center gap-3 bg-[#181818] border border-white/15 px-4 py-2">
                <div className="flex items-center gap-0.5 text-[#CCFF00]" aria-label="4.9 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#CCFF00] stroke-[#CCFF00]" />
                  ))}
                </div>
                <span className="font-mono-spec text-xs font-bold text-white">4.9 / 5.0</span>
                <span className="text-white/25">|</span>
                <span className="font-mono-spec text-[11px] uppercase tracking-[0.16em] text-neutral-300">
                  640+ Verified Kenyan Thrift Buyers
                </span>
              </div>

              {/* Official Brand Mark + Stark Display Headline */}
              <div className="space-y-3.5">
                <div className="inline-flex flex-wrap items-center gap-3">
                  <CreewrldEmblem size={34} />
                  <CreewrldWordmark height={18} />
                  <span className="font-mono-spec text-[11px] uppercase tracking-[0.28em] text-[#CCFF00]">
                    // EST. NAIROBI, KENYA
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-extrabold uppercase tracking-tight leading-[0.96] text-white">
                  1-of-1 Underground{' '}
                  <span className="text-[#CCFF00]">Thrift</span> &amp; Street Archive.
                </h1>
              </div>

              <p className="text-neutral-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Hand-selected archival sneakers, heavyweight streetwear, Y2K leather, and Old Money
                tailoring curated in Nairobi. Priced in{' '}
                <span className="text-white font-semibold">KSh</span> — no bloated carts, claim
                directly on WhatsApp before someone else locks it.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigateToShop('All')}
                  className="px-7 py-4 bg-[#CCFF00] text-[#0D0D0D] hover:bg-white font-mono-spec font-bold text-xs sm:text-sm uppercase tracking-[0.2em] inline-flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <span>Shop Live Drops</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={buildGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-[#181818] border border-white/20 hover:border-[#CCFF00] text-white hover:text-[#CCFF00] font-mono-spec font-semibold text-xs sm:text-sm uppercase tracking-[0.18em] inline-flex items-center gap-2.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>

              {/* Nairobi Trust Strip */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4 max-w-xl">
                <div>
                  <span className="block font-mono-spec text-lg sm:text-xl font-bold text-white">
                    1-OF-1
                  </span>
                  <span className="font-mono-spec text-[10px] uppercase tracking-widest text-neutral-400">
                    Zero Restocks
                  </span>
                </div>
                <div>
                  <span className="block font-mono-spec text-lg sm:text-xl font-bold text-[#CCFF00]">
                    SAME DAY
                  </span>
                  <span className="font-mono-spec text-[10px] uppercase tracking-widest text-neutral-400">
                    Nairobi Dispatch
                  </span>
                </div>
                <div>
                  <span className="block font-mono-spec text-lg sm:text-xl font-bold text-white">
                    47 COUNTIES
                  </span>
                  <span className="font-mono-spec text-[10px] uppercase tracking-widest text-neutral-400">
                    Nationwide Courier
                  </span>
                </div>
              </div>
            </div>

            {/* Right Lookbook Visual Frame */}
            <div className="lg:col-span-5">
              <div className="relative bg-[#181818] border border-white/20 p-3 sm:p-4">
                {/* Corner Electric Lime Accents */}
                <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#CCFF00]" />
                <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#CCFF00]" />
                <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#CCFF00]" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#CCFF00]" />

                <div className="relative aspect-[4/5] overflow-hidden bg-[#0D0D0D]">
                  <img
                    src="/images/hero-lookbook.jpg"
                    alt="CREEWRLD Nairobi Street-Culture Editorial"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="bg-[#0D0D0D]/90 border border-white/20 px-3 py-1 font-mono-spec text-[10px] uppercase tracking-[0.2em] text-white inline-flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#CCFF00]" />
                      NBO // KENYA
                    </span>
                    <span className="bg-[#CCFF00] px-2.5 py-1 font-mono-spec text-[10px] font-bold uppercase tracking-[0.18em] text-[#0D0D0D]">
                      SEASON ARCHIVE
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <CreewrldWordmark height={18} className="mb-1.5" />
                      <p className="font-mono-spec text-[11px] uppercase tracking-[0.18em] text-[#CCFF00]">
                        CURATED VINTAGE OUTERWEAR &amp; KICKS
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateToShop('Streetwear')}
                      className="px-3.5 py-2 bg-white text-[#0D0D0D] hover:bg-[#CCFF00] font-mono-spec font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                    >
                      View Fit →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ELECTRIC LIME KINETIC TICKER
      ====================================================================== */}
      <div className="bg-[#CCFF00] text-[#0D0D0D] border-b border-white/12 py-2.5 overflow-hidden select-none">
        <div className="animate-creewrld-marquee font-mono-spec text-xs font-bold uppercase tracking-[0.24em]">
          {Array.from({ length: 2 }).map((_, blockIdx) => (
            <div key={blockIdx} className="flex items-center gap-8 pr-8">
              <span>CREEWRLD KENYA</span>
              <span>✦</span>
              <span>1-OF-1 AUTHENTICATED THRIFT</span>
              <span>✦</span>
              <span>ORDER DIRECT VIA WHATSAPP {CREEWRLD_WHATSAPP_DISPLAY}</span>
              <span>✦</span>
              <span>SNEAKERS · STREETWEAR · OLD MONEY · Y2K</span>
              <span>✦</span>
              <span>NAIROBI CBD &amp; COUNTRYWIDE DELIVERY</span>
              <span>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          BRAND STATEMENT / MANIFESTO
      ====================================================================== */}
      <section className="border-b border-white/12 py-16 sm:py-22 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#181818] border border-white/12 p-8 sm:p-12 lg:p-16">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-white/10">
              <div className="flex items-center gap-6">
                <div className="bg-[#0D0D0D] border border-white/15 p-4 shrink-0">
                  <CreewrldStackedLogo width={128} />
                </div>
                <div>
                  <span className="font-mono-spec text-[11px] uppercase tracking-[0.28em] text-[#CCFF00] block mb-2">
                    BRAND STATEMENT // THE CREEWRLD CODE
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                    Nairobi Street Manifesto
                  </h2>
                </div>
              </div>

              <p className="text-lg sm:text-xl text-neutral-200 max-w-2xl leading-relaxed font-medium">
                “Born out of Nairobi’s underground thrift culture,{' '}
                <span className="text-[#CCFF00] font-semibold">CREEWRLD</span> hunts down rare
                1-of-1 garments with heavyweight fabric, real patina, and sharp silhouette —
                eliminating generic mall fashion one drop at a time.”
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
              <div className="bg-[#0D0D0D] border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono-spec text-xs text-[#CCFF00]">01 // CURATION</span>
                  <Sparkles className="w-4 h-4 text-[#CCFF00]" />
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-white mb-2">
                  Hand-Picked First Selection
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Every sneaker and garment is sourced from grade-A bales &amp; private archives,
                  steam-cleaned, and inspected before hitting the grid.
                </p>
              </div>

              <div className="bg-[#0D0D0D] border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono-spec text-xs text-[#CCFF00]">02 // TRANSPARENCY</span>
                  <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-white mb-2">
                  Exact Condition Grading
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  From 10/10 Mint deadstock to 8.5/10 faded vintage character, every card lists
                  exact condition, size, and KSh price upfront.
                </p>
              </div>

              <div className="bg-[#0D0D0D] border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono-spec text-xs text-[#CCFF00]">03 // SPEED</span>
                  <Zap className="w-4 h-4 text-[#CCFF00]" />
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-white mb-2">
                  Instant WhatsApp Lock-In
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Tap “Order via WhatsApp” on any piece to send pre-filled item specs straight to
                  our Nairobi dispatch desk for M-Pesa confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FEATURED CATEGORIES
      ====================================================================== */}
      <section className="border-b border-white/12 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-mono-spec text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-2">
                CURATED SILHOUETTES // 06 ARCHIVES
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                Shop By Aesthetic
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToShop('All')}
              className="font-mono-spec text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-[#CCFF00] inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Browse Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CURATED_WORLDS.map((world) => {
              const count = getCategoryCount(world.category);
              return (
                <button
                  key={world.category}
                  type="button"
                  onClick={() => onNavigateToShop(world.category)}
                  className="group relative h-64 bg-[#181818] border border-white/12 hover:border-[#CCFF00] overflow-hidden text-left p-6 flex flex-col justify-between transition-all cursor-pointer"
                >
                  <img
                    src={world.coverImage}
                    alt={world.category}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/55 to-transparent" />

                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className="font-mono-spec text-xs text-[#CCFF00] bg-[#0D0D0D]/85 border border-white/15 px-2.5 py-1">
                      {world.code} // ARCHIVE
                    </span>
                    <span className="font-mono-spec text-[11px] uppercase tracking-wider text-white bg-[#0D0D0D]/85 border border-white/15 px-2.5 py-1">
                      {count} {count === 1 ? 'Piece' : 'Pieces'}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-2xl font-extrabold uppercase text-white group-hover:text-[#CCFF00] transition-colors">
                        {world.category}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-white group-hover:text-[#CCFF00] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <p className="text-xs text-neutral-300 mt-1 line-clamp-1">{world.tagline}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          FEATURED DROPS (Dynamic from Supabase `products`)
      ====================================================================== */}
      <section className="border-b border-white/12 py-16 sm:py-22">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-mono-spec text-xs uppercase tracking-[0.25em] text-[#CCFF00] mb-2">
                FRESH OUT THE VAULT // LIVE DROPS
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                Featured Thrift Grails
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToShop('All')}
              className="px-5 py-3 bg-[#181818] border border-white/20 hover:border-[#CCFF00] text-white hover:text-[#CCFF00] font-mono-spec text-xs uppercase tracking-[0.2em] inline-flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>View All Drops ({products.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : featuredProducts.length === 0 ? (
            <EmptyArchiveState
              selectedCategory="All"
              onOpenAddModal={onOpenAddModal}
              isAdmin={adminMode}
              isSupabaseLive={isSupabaseLive}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
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

      {/* =====================================================================
          CUSTOMER RATING BADGE SHOWCASE & SOCIAL LINKS
      ====================================================================== */}
      <section className="py-16 sm:py-22">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Verified Customer Rating Banner */}
          <div className="bg-[#181818] border border-white/15 p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/12 pb-6 lg:pb-0 lg:pr-8">
              <div className="inline-flex items-center gap-2 bg-[#CCFF00] text-[#0D0D0D] px-3 py-1 font-mono-spec text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                VERIFIED BUYER RATING
              </div>
              <div className="flex items-baseline gap-4">
                <span className="font-mono-spec text-5xl sm:text-6xl font-extrabold text-white">
                  4.9
                </span>
                <div>
                  <div className="flex items-center gap-1 text-[#CCFF00] mb-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-[#CCFF00] stroke-[#CCFF00]" />
                    ))}
                  </div>
                  <p className="font-mono-spec text-xs text-neutral-400 uppercase tracking-wider">
                    640+ Delivered WhatsApp Orders in Kenya
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <blockquote className="bg-[#0D0D0D] border border-white/10 p-5">
                <p className="text-sm text-neutral-200 leading-relaxed mb-3">
                  “Ordered the vintage leather racing jacket on WhatsApp at 11am, rider dropped it
                  in Westlands by 2pm. Condition was literally 10/10.”
                </p>
                <footer className="font-mono-spec text-[11px] uppercase tracking-wider text-[#CCFF00]">
                  — BRIAN K. // WESTLANDS, NAIROBI
                </footer>
              </blockquote>

              <blockquote className="bg-[#0D0D0D] border border-white/10 p-5">
                <p className="text-sm text-neutral-200 leading-relaxed mb-3">
                  “Cleanest thrift curation in 254. Accurate sizing, zero catfishing, and fast
                  overnight parcel delivery to Mombasa.”
                </p>
                <footer className="font-mono-spec text-[11px] uppercase tracking-wider text-[#CCFF00]">
                  — ACHIENG M. // KILIMANI &amp; MOMBASA
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Social Links Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="font-mono-spec text-xs uppercase tracking-[0.24em] text-neutral-400">
                CONNECT WITH THE ARCHIVE // SOCIAL CHANNELS
              </p>
              <CreewrldWordmark height={17} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SOCIAL_CHANNELS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#181818] border border-white/12 hover:border-[#CCFF00] p-5 flex flex-col justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-spec text-xs uppercase tracking-[0.2em] text-neutral-400 group-hover:text-white">
                      {social.name}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#CCFF00] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div>
                    <p className="font-mono-spec text-base font-bold text-white group-hover:text-[#CCFF00] transition-colors">
                      {social.handle}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">{social.note}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
