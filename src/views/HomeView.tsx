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
import Magnet from '../components/Magnet';
import StarBorder from '../components/StarBorder';
import Topography from '../components/Topography';
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
  onOrderViaWhatsApp: (product: Product) => void;
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
  onOrderViaWhatsApp,
  onRequestDelete,
  onOpenAddModal,
}) => {
  const featuredProducts = products.slice(0, 8);

  const getCategoryCount = (cat: string) =>
    products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;

  return (
    <div className="w-full overflow-x-hidden bg-[#0A1118]">
      {/* =====================================================================
          FULL-BLEED HERO SECTION (Yacht Club Navy + Cream Ivory Topography)
      ====================================================================== */}
      <section
        className={`relative w-full min-h-screen overflow-x-hidden overflow-y-hidden border-b border-[#F4EFEA]/15 bg-[#0A1118] flex items-center ${
          adminMode ? 'pt-32 sm:pt-36' : 'pt-20 sm:pt-24'
        }`}
      >
        {/* Full-Bleed Nautical Grid Texture & Yacht Club Navy Ambient Glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full full-bleed-grid-bg opacity-80 z-0"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-24 w-[38rem] h-[38rem] rounded-full yacht-club-gradient opacity-30 blur-[150px] z-0"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 w-[34rem] h-[34rem] rounded-full bg-[#132238]/70 blur-[140px] z-0"
        />

        {/* Full-Bleed Interactive Cream Ivory WebGL2 <Topography /> Nautical Chart Terrain */}
        <div className="absolute inset-0 w-full h-full min-h-screen z-0">
          <Topography
            color="#F4EFEA"
            lineCount={24}
            lineWidth={1.15}
            majorLines={true}
            elevation={1.0}
            foreground={0.18}
            scale={1.05}
            detail={0.38}
            tilt={31}
            speed={0.2}
            direction="forward"
            morph={0.18}
            glow={0.5}
            depthOfField={0.35}
            fog={0.42}
            brightness={0.82}
            opacity={0.62}
            hoverEffect="lift"
            mouseRadius={1.1}
            mouseStrength={0.65}
            trail={0.35}
            parallax={0.45}
            clickEffect="pulse"
            markers="plus"
            glitch={0.04}
            intro={true}
          />
        </div>

        {/* Directional Deep Obsidian Navy Readability Scrims */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#0A1118]/92 via-[#0A1118]/72 to-[#132238]/35"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#0A1118]/65 via-transparent to-[#0A1118]/90"
        />

        {/* Strict Hero Content Grid Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Editorial Text Block (7 Columns — min-w-0 prevents CSS Grid text overflow) */}
          <div className="lg:col-span-7 flex flex-col justify-center min-w-0 space-y-6">
            {/* Customer Rating Badge with Midnight Blue Surface & Cream Ivory Glow */}
            <StarBorder
              as="div"
              color="#F4EFEA"
              trailColor="#FFFFFF"
              duration={6}
              stars={1}
              trailLength={0.35}
              thickness={1}
              radius={2}
              glow={0.55}
              sparkle
              hover="brighten"
              clickPulse={false}
              backgroundColor="rgba(19, 34, 56, 0.92)"
              borderColor="rgba(244, 239, 234, 0.28)"
              className="self-start inline-flex flex-wrap items-center gap-3 px-4 py-2 max-w-full"
            >
              <div
                className="flex items-center gap-0.5 text-[#F4EFEA]"
                aria-label="4.9 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#F4EFEA] stroke-[#F4EFEA]" />
                ))}
              </div>
              <span className="font-cinzel text-xs font-bold tracking-wider text-[#F4EFEA]">
                4.9 / 5.0
              </span>
              <span className="text-[#F4EFEA]/25">|</span>
              <span className="font-cinzel text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                640+ Verified Kenyan Thrift Buyers
              </span>
            </StarBorder>

            {/* Official Brand Mark + Fluid Responsive Cinzel Headline */}
            <div className="space-y-3.5 min-w-0 max-w-full">
              <div className="inline-flex flex-wrap items-center gap-3 max-w-full">
                <CreewrldEmblem size={34} />
                <CreewrldWordmark height={18} />
                <span className="font-cinzel font-semibold text-[11px] uppercase tracking-[0.22em] text-[#F4EFEA]/85">
                  // EST. NAIROBI, KENYA
                </span>
              </div>

              <h1 className="hero-fluid-headline font-cinzel text-3xl sm:text-4xl lg:text-6xl font-bold uppercase tracking-wider leading-none break-words max-w-full overflow-hidden text-[#F4EFEA]">
                1-of-1 Underground{' '}
                <span className="text-white underline decoration-[#F4EFEA]/45 decoration-2 underline-offset-8">
                  Thrift
                </span>{' '}
                &amp; Street Archive.
              </h1>
            </div>

            <p className="font-sans text-slate-200 text-base sm:text-lg max-w-2xl leading-relaxed break-words">
              Hand-selected archival sneakers, heavyweight streetwear, Y2K leather, and Old Money
              tailoring curated in Nairobi. Priced in{' '}
              <span className="text-[#F4EFEA] font-semibold">KSh</span> — no bloated carts, claim
              directly on WhatsApp before someone else locks it.
            </p>

            {/* Primary & Secondary CTAs (Cream Ivory Primary + Midnight Blue Secondary) */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Magnet
                padding={90}
                magnetStrength={2.4}
                maxOffset={18}
                tilt={6}
                scale={1.03}
                spring={{ stiffness: 190, damping: 15, mass: 1 }}
                wrapperClassName="creewrld-magnet-glow"
              >
                <StarBorder
                  onClick={() => onNavigateToShop('All')}
                  color="#FFFFFF"
                  trailColor="#F4EFEA"
                  duration={3.6}
                  stars={2}
                  trailLength={0.35}
                  thickness={1.5}
                  radius={2}
                  glow={0.7}
                  sparkle
                  hover="lap"
                  clickPulse
                  backgroundColor="#F4EFEA"
                  textColor="#0A1118"
                  borderColor="rgba(255, 255, 255, 0.7)"
                  className="px-7 py-4 hover:bg-white font-sans font-extrabold text-xs sm:text-sm uppercase tracking-[0.16em] inline-flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <span>Shop Live Drops</span>
                  <ArrowRight className="w-4 h-4" />
                </StarBorder>
              </Magnet>

              <Magnet
                padding={80}
                magnetStrength={2.8}
                maxOffset={15}
                tilt={5}
                scale={1.02}
              >
                <StarBorder
                  as="a"
                  href={buildGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="#F4EFEA"
                  trailColor="#FFFFFF"
                  duration={4.2}
                  stars={1}
                  trailLength={0.32}
                  thickness={1.2}
                  radius={2}
                  glow={0.6}
                  sparkle
                  hover="lap"
                  clickPulse
                  backgroundColor="#132238"
                  textColor="#F4EFEA"
                  borderColor="rgba(244, 239, 234, 0.45)"
                  className="px-6 py-4 hover:bg-[#F4EFEA] hover:text-[#0A1118] font-sans font-semibold text-xs sm:text-sm uppercase tracking-[0.16em] inline-flex items-center gap-2.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </StarBorder>
              </Magnet>
            </div>

            {/* Nairobi Heritage Trust Strip */}
            <div className="pt-5 border-t border-[#F4EFEA]/15 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl">
              <div className="min-w-0">
                <span className="block font-cinzel text-lg sm:text-2xl font-bold tracking-wider text-[#F4EFEA]">
                  1-OF-1
                </span>
                <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-slate-400">
                  Zero Restocks
                </span>
              </div>
              <div className="min-w-0">
                <span className="block font-cinzel text-lg sm:text-2xl font-bold tracking-wider text-white">
                  SAME DAY
                </span>
                <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-slate-400">
                  Nairobi Dispatch
                </span>
              </div>
              <div className="min-w-0">
                <span className="block font-cinzel text-lg sm:text-2xl font-bold tracking-wider text-[#F4EFEA]">
                  47 COUNTIES
                </span>
                <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-slate-400">
                  Nationwide Courier
                </span>
              </div>
            </div>
          </div>

          {/* Right Feature Visual Card (5 Columns — Framed in Yacht Club Navy Gradient) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end min-w-0">
            <div className="relative w-full max-w-md lg:max-w-full rounded-xl p-[2px] yacht-club-gradient shadow-[0_24px_65px_rgba(10,17,24,0.85)]">
              <div className="relative w-full bg-[#132238] rounded-[10px] p-3 sm:p-4">
                {/* Corner Cream Ivory Accents */}
                <span className="pointer-events-none absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#F4EFEA]" />
                <span className="pointer-events-none absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#F4EFEA]" />
                <span className="pointer-events-none absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#F4EFEA]" />
                <span className="pointer-events-none absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#F4EFEA]" />

                <div className="relative w-full max-w-md lg:max-w-full aspect-[4/5] overflow-hidden rounded-xl bg-[#0A1118]">
                  <img
                    src="/images/hero-lookbook.jpg"
                    alt="CREEWRLD Nairobi Heritage Street-Culture Editorial"
                    className="w-full max-w-md lg:max-w-full h-full aspect-[4/5] object-cover object-center rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1118] via-[#0A1118]/30 to-transparent opacity-85" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="bg-[#0A1118]/90 border border-[#F4EFEA]/25 px-3 py-1 font-cinzel font-semibold text-[10px] uppercase tracking-[0.18em] text-[#F4EFEA] inline-flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#F4EFEA]" />
                      NBO // KENYA
                    </span>
                    <span className="bg-[#F4EFEA] px-2.5 py-1 font-cinzel text-[10px] font-bold uppercase tracking-[0.16em] text-[#0A1118]">
                      SEASON ARCHIVE
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <CreewrldWordmark height={18} className="mb-1.5" />
                      <p className="font-cinzel font-semibold text-[10px] uppercase tracking-[0.16em] text-[#F4EFEA] truncate">
                        CURATED VINTAGE OUTERWEAR &amp; KICKS
                      </p>
                    </div>
                    <Magnet
                      padding={60}
                      magnetStrength={2.6}
                      maxOffset={10}
                      tilt={4}
                      scale={1.04}
                      wrapperClassName="shrink-0"
                    >
                      <button
                        type="button"
                        onClick={() => onNavigateToShop('Old Money')}
                        className="px-3.5 py-2 bg-[#F4EFEA] text-[#0A1118] hover:bg-white font-sans font-extrabold text-[11px] uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                      >
                        View Fit →
                      </button>
                    </Magnet>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FULL-BLEED CREAM IVORY & DEEP NAVY HERITAGE KINETIC TICKER
      ====================================================================== */}
      <div className="w-full bg-[#F4EFEA] text-[#0A1118] border-b border-[#132238]/30 py-2.5 overflow-hidden select-none">
        <div className="animate-creewrld-marquee font-cinzel text-xs font-bold uppercase tracking-[0.22em]">
          {Array.from({ length: 3 }).map((_, blockIdx) => (
            <div key={blockIdx} className="flex items-center gap-8 pr-8">
              <span>CREEWRLD KENYA</span>
              <span>✦</span>
              <span>1-OF-1 AUTHENTICATED THRIFT</span>
              <span>✦</span>
              <span>ORDER DIRECT VIA WHATSAPP {CREEWRLD_WHATSAPP_DISPLAY}</span>
              <span>✦</span>
              <span>OLD MONEY · SNEAKERS · STREETWEAR · Y2K</span>
              <span>✦</span>
              <span>NAIROBI CBD &amp; COUNTRYWIDE DELIVERY</span>
              <span>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          BRAND STATEMENT / MANIFESTO (Full-Width Midnight Blue Container)
      ====================================================================== */}
      <section className="relative w-full border-b border-[#F4EFEA]/15 py-16 sm:py-22 bg-[#0A1118] overflow-hidden">
        {/* Subtle Full-Bleed Nautical Contour SVG Accent */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 w-screen left-1/2 -translate-x-1/2 h-full opacity-[0.09]"
          fill="none"
        >
          <path
            d="M-120 340C220 190 480 390 820 230C1120 90 1320 270 1560 150"
            stroke="#F4EFEA"
            strokeWidth="1.5"
          />
          <path
            d="M-120 290C240 130 510 340 850 180C1150 40 1340 220 1560 100"
            stroke="#FFFFFF"
            strokeWidth="1"
          />
          <path
            d="M-120 390C210 250 470 430 800 280C1100 150 1310 320 1560 210"
            stroke="#F4EFEA"
            strokeWidth="1"
          />
        </svg>

        <div className="w-full px-6 md:px-12 lg:px-16 relative z-10">
          <div className="w-full bg-[#132238] border border-[#F4EFEA]/18 p-6 sm:p-10 lg:p-14 space-y-10">
            <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-10 pb-10 border-b border-[#F4EFEA]/12">
              <div className="bg-[#0A1118] border border-[#F4EFEA]/20 p-3.5 sm:p-4 self-start shrink-0">
                <CreewrldStackedLogo width={116} />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-6">
                <div className="space-y-2">
                  <span className="font-cinzel font-semibold text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#F4EFEA]/80 block">
                    BRAND STATEMENT // THE CREEWRLD CODE
                  </span>
                  <h2 className="block font-cinzel text-2xl lg:text-3xl font-bold uppercase tracking-wider leading-snug text-[#F4EFEA] break-words">
                    Nairobi Heritage Manifesto
                  </h2>
                </div>

                <blockquote className="border-l-2 border-[#F4EFEA]/35 pl-4 sm:pl-6 max-w-3xl">
                  <p className="font-sans leading-relaxed text-sm lg:text-base text-[#F4EFEA]/80">
                    “Born out of Nairobi’s discerning thrift culture,{' '}
                    <span className="font-cinzel tracking-wider text-[#F4EFEA] font-bold">
                      CREEWRLD
                    </span>{' '}
                    hunts down rare 1-of-1 garments with heavyweight fabric, real patina, and
                    tailored silhouette — elevating timeless style one drop at a time.”
                  </p>
                </blockquote>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="bg-[#0A1118] border border-[#F4EFEA]/14 p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-cinzel font-semibold text-xs tracking-[0.18em] text-[#F4EFEA]/85">
                    01 // CURATION
                  </span>
                  <Sparkles className="w-4 h-4 text-[#F4EFEA]" />
                </div>
                <h3 className="font-cinzel text-lg font-bold uppercase tracking-wider text-[#F4EFEA] mb-2">
                  Hand-Picked First Selection
                </h3>
                <p className="font-sans text-sm text-slate-300 leading-relaxed">
                  Every sneaker and garment is sourced from grade-A bales &amp; private archives,
                  steam-cleaned, and inspected before hitting the grid.
                </p>
              </div>

              <div className="bg-[#0A1118] border border-[#F4EFEA]/14 p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-cinzel font-semibold text-xs tracking-[0.18em] text-[#F4EFEA]/85">
                    02 // TRANSPARENCY
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#F4EFEA]" />
                </div>
                <h3 className="font-cinzel text-lg font-bold uppercase tracking-wider text-[#F4EFEA] mb-2">
                  Exact Condition Grading
                </h3>
                <p className="font-sans text-sm text-slate-300 leading-relaxed">
                  From 10/10 Mint deadstock to 8.5/10 faded vintage character, every card lists
                  exact condition, size, and KSh price upfront.
                </p>
              </div>

              <div className="bg-[#0A1118] border border-[#F4EFEA]/14 p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-cinzel font-semibold text-xs tracking-[0.18em] text-[#F4EFEA]/85">
                    03 // SPEED
                  </span>
                  <Zap className="w-4 h-4 text-[#F4EFEA]" />
                </div>
                <h3 className="font-cinzel text-lg font-bold uppercase tracking-wider text-[#F4EFEA] mb-2">
                  Instant WhatsApp Lock-In
                </h3>
                <p className="font-sans text-sm text-slate-300 leading-relaxed">
                  Tap “Order via WhatsApp” on any piece to send pre-filled item specs straight to
                  our Nairobi dispatch desk for M-Pesa confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FEATURED CATEGORIES (Full-Width Midnight Blue Cards)
      ====================================================================== */}
      <section className="relative w-full border-b border-[#F4EFEA]/15 py-16 sm:py-20 full-bleed-grid-bg">
        <div className="w-full px-6 md:px-12 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-cinzel font-semibold text-xs uppercase tracking-[0.22em] text-[#F4EFEA]/80 mb-2">
                CURATED SILHOUETTES // 06 ARCHIVES
              </p>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-bold uppercase tracking-wider text-[#F4EFEA]">
                Shop By Aesthetic
              </h2>
            </div>
            <Magnet padding={65} magnetStrength={3.2} maxOffset={10} scale={1.02}>
              <button
                type="button"
                onClick={() => onNavigateToShop('All')}
                className="font-sans font-semibold text-xs uppercase tracking-[0.18em] text-slate-300 hover:text-[#F4EFEA] inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Magnet>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {CURATED_WORLDS.map((world) => {
              const count = getCategoryCount(world.category);
              return (
                <button
                  key={world.category}
                  type="button"
                  onClick={() => onNavigateToShop(world.category)}
                  className="group relative h-72 bg-[#132238] border border-[#F4EFEA]/15 hover:border-[#F4EFEA]/70 overflow-hidden text-left p-6 flex flex-col justify-between transition-all cursor-pointer"
                >
                  <img
                    src={world.coverImage}
                    alt={world.category}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1118] via-[#0A1118]/60 to-transparent" />

                  <div className="relative z-10 flex items-center justify-between gap-2 w-full">
                    <span className="font-cinzel font-semibold text-[11px] uppercase tracking-[0.16em] text-[#F4EFEA] bg-[#0A1118]/85 border border-[#F4EFEA]/20 px-2.5 py-1">
                      {world.code} // {world.category.toUpperCase()} ARCHIVE
                    </span>
                    <span className="font-cinzel font-semibold text-[11px] uppercase tracking-wider text-[#F4EFEA] bg-[#132238]/90 border border-[#F4EFEA]/20 px-2.5 py-1 shrink-0">
                      {count} {count === 1 ? 'Piece' : 'Pieces'}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-cinzel text-2xl font-bold uppercase tracking-wider text-[#F4EFEA] group-hover:text-white transition-colors">
                        {world.category}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-[#F4EFEA] group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <p className="font-sans text-xs text-slate-200 mt-1 line-clamp-1">
                      {world.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          FEATURED DROPS (Full-Width Dynamic Grid from Supabase `products`)
      ====================================================================== */}
      <section className="relative w-full border-b border-[#F4EFEA]/15 py-16 sm:py-22 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full yacht-club-gradient opacity-20 blur-[140px]"
        />
        <div className="w-full px-6 md:px-12 lg:px-16 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-cinzel font-semibold text-xs uppercase tracking-[0.22em] text-[#F4EFEA]/80 mb-2">
                FRESH OUT THE VAULT // LIVE DROPS
              </p>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-bold uppercase tracking-wider text-[#F4EFEA]">
                Featured Thrift Grails
              </h2>
            </div>

            <Magnet
              padding={75}
              magnetStrength={2.8}
              maxOffset={14}
              tilt={4}
              scale={1.02}
              wrapperClassName="self-start sm:self-auto"
            >
              <StarBorder
                onClick={() => onNavigateToShop('All')}
                color="#F4EFEA"
                trailColor="#FFFFFF"
                duration={4.5}
                stars={1}
                trailLength={0.3}
                thickness={1}
                radius={2}
                glow={0.6}
                hover="lap"
                clickPulse
                backgroundColor="#132238"
                textColor="#F4EFEA"
                borderColor="rgba(244, 239, 234, 0.4)"
                className="px-5 py-3 hover:bg-[#F4EFEA] hover:text-[#0A1118] font-sans font-semibold text-xs uppercase tracking-[0.16em] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>View All Drops ({products.length})</span>
                <ArrowRight className="w-4 h-4" />
              </StarBorder>
            </Magnet>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : featuredProducts.length === 0 ? (
            <EmptyArchiveState
              selectedCategory="All"
              onOpenAddModal={onOpenAddModal}
              isAdmin={adminMode}
              isSupabaseLive={isSupabaseLive}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {featuredProducts.map((product) => (
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

      {/* =====================================================================
          CUSTOMER RATING BADGE SHOWCASE & SOCIAL LINKS (Full-Width)
      ====================================================================== */}
      <section className="w-full py-16 sm:py-22 full-bleed-grid-bg">
        <div className="w-full px-6 md:px-12 lg:px-16 space-y-12">
          {/* Verified Customer Rating Banner with Yacht Club Navy Surface */}
          <div className="w-full bg-[#132238] border border-[#F4EFEA]/20 p-8 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#F4EFEA]/15 pb-6 lg:pb-0 lg:pr-8">
              <div className="inline-flex items-center gap-2 bg-[#F4EFEA] text-[#0A1118] px-3 py-1 font-cinzel text-[10px] font-bold uppercase tracking-[0.18em] mb-4">
                VERIFIED BUYER RATING
              </div>
              <div className="flex items-baseline gap-4">
                <span className="font-cinzel text-5xl sm:text-6xl font-bold tracking-wider text-[#F4EFEA]">
                  4.9
                </span>
                <div>
                  <div className="flex items-center gap-1 text-[#F4EFEA] mb-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-[#F4EFEA] stroke-[#F4EFEA]" />
                    ))}
                  </div>
                  <p className="font-sans text-xs text-slate-300 uppercase tracking-wider">
                    640+ Delivered WhatsApp Orders in Kenya
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <blockquote className="bg-[#0A1118] border border-[#F4EFEA]/14 p-5 lg:p-6">
                <p className="font-sans text-sm text-slate-200 leading-relaxed mb-3">
                  “Ordered the vintage leather racing jacket on WhatsApp at 11am, rider dropped it
                  in Westlands by 2pm. Condition was literally 10/10.”
                </p>
                <footer className="font-cinzel font-semibold text-[11px] uppercase tracking-wider text-[#F4EFEA]">
                  — BRIAN K. // WESTLANDS, NAIROBI
                </footer>
              </blockquote>

              <blockquote className="bg-[#0A1118] border border-[#F4EFEA]/14 p-5 lg:p-6">
                <p className="font-sans text-sm text-slate-200 leading-relaxed mb-3">
                  “Cleanest thrift curation in 254. Accurate sizing, zero catfishing, and fast
                  overnight parcel delivery to Mombasa.”
                </p>
                <footer className="font-cinzel font-semibold text-[11px] uppercase tracking-wider text-[#F4EFEA]">
                  — ACHIENG M. // KILIMANI &amp; MOMBASA
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Social Links Grid */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <p className="font-cinzel font-semibold text-xs uppercase tracking-[0.22em] text-slate-300">
                CONNECT WITH THE ARCHIVE // SOCIAL CHANNELS
              </p>
              <CreewrldWordmark height={17} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
              {SOCIAL_CHANNELS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#132238] border border-[#F4EFEA]/15 hover:border-[#F4EFEA]/70 p-6 flex flex-col justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel font-semibold text-xs uppercase tracking-[0.18em] text-slate-300 group-hover:text-[#F4EFEA]">
                      {social.name}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#F4EFEA] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div>
                    <p className="font-cinzel text-base font-bold tracking-wider text-[#F4EFEA] group-hover:text-white transition-colors">
                      {social.handle}
                    </p>
                    <p className="font-sans text-xs text-slate-300 mt-1">{social.note}</p>
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
