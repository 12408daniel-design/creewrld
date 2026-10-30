import React from 'react';
import { Shield, Plus, Database, RotateCcw } from 'lucide-react';
import { CreewrldLogo } from './CreewrldLogo';

export type ActivePage = 'home' | 'shop';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  productCount: number;
  adminMode: boolean;
  onToggleAdminMode: () => void;
  isSupabaseLive: boolean;
  onOpenAddModal: () => void;
  onOpenSupabaseModal: () => void;
  onSimulateEmptyState?: () => void;
  onResetPreviewCatalog?: () => void;
  showingSimulatedEmpty?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  productCount,
  adminMode,
  onToggleAdminMode,
  isSupabaseLive,
  onOpenAddModal,
  onOpenSupabaseModal,
  onSimulateEmptyState,
  onResetPreviewCatalog,
  showingSimulatedEmpty,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0D]/92 backdrop-blur-md border-b border-white/12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Emblem + Blackletter Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00] cursor-pointer"
          aria-label="CREEWRLD Home"
        >
          <CreewrldLogo emblemSize={42} />
        </button>

        {/* Strictly Two Pages Navigation: HOME & SHOP */}
        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2 bg-[#181818] p-1 border border-white/12">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-mono-spec uppercase tracking-[0.2em] transition-all cursor-pointer ${
              activePage === 'home'
                ? 'bg-[#CCFF00] text-[#0D0D0D] font-bold'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-mono-spec uppercase tracking-[0.2em] transition-all flex items-center gap-2 cursor-pointer ${
              activePage === 'shop'
                ? 'bg-[#CCFF00] text-[#0D0D0D] font-bold'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            <span>Shop</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 font-mono-spec ${
                activePage === 'shop'
                  ? 'bg-[#0D0D0D] text-[#CCFF00]'
                  : 'bg-white/10 text-[#CCFF00]'
              }`}
            >
              {productCount}
            </span>
          </button>
        </nav>

        {/* Subtle Admin Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleAdminMode}
            title={adminMode ? 'Exit Admin Mode' : 'Toggle Admin Product Management'}
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-mono-spec uppercase tracking-wider border transition-all cursor-pointer ${
              adminMode
                ? 'border-[#CCFF00] bg-[#CCFF00]/15 text-[#CCFF00]'
                : 'border-white/12 bg-[#181818] text-neutral-400 hover:text-white hover:border-white/30'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{adminMode ? 'Admin ON' : 'Admin'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Admin Management Strip (Visible only when Admin Mode is active) */}
      {adminMode && (
        <div className="bg-[#141414] border-t border-[#CCFF00]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-spec">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 text-[#CCFF00] uppercase tracking-wider font-semibold">
                <span className="w-2 h-2 bg-[#CCFF00] inline-block animate-pulse" />
                Admin Management Active
              </span>
              <span className="text-neutral-400 hidden sm:inline">
                Trash icons are unlocked on every product card for Storage + DB deletion.
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#CCFF00] text-[#0D0D0D] font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Upload Drop
              </button>

              <button
                type="button"
                onClick={onOpenSupabaseModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] border border-white/20 text-white hover:border-[#CCFF00] hover:text-[#CCFF00] uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                {isSupabaseLive ? 'Supabase: Connected' : 'Supabase Setup / Keys'}
              </button>

              {!isSupabaseLive && onSimulateEmptyState && (
                <button
                  type="button"
                  onClick={onSimulateEmptyState}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] border border-white/15 text-neutral-300 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {showingSimulatedEmpty ? 'Show Showcase Items' : 'Test Empty State'}
                </button>
              )}

              {!isSupabaseLive && onResetPreviewCatalog && (
                <button
                  type="button"
                  onClick={onResetPreviewCatalog}
                  title="Restore deleted preview showcase items"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#181818] border border-white/15 text-neutral-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Demo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
