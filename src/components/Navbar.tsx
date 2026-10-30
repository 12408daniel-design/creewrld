import React, { useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  Shield,
  ShieldCheck,
  Plus,
  Database,
  LogOut,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { CreewrldLogo } from './CreewrldLogo';

export type ActivePage = 'home' | 'shop';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  productCount: number;
  session: Session | null;
  isSigningOut: boolean;
  isSupabaseLive: boolean;
  onOpenAuthModal: () => void;
  onSignOut: () => Promise<void>;
  onOpenAddModal: () => void;
  onOpenSupabaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  productCount,
  session,
  isSigningOut,
  isSupabaseLive,
  onOpenAuthModal,
  onSignOut,
  onOpenAddModal,
  onOpenSupabaseModal,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null);
  const isAdmin = Boolean(session);

  useEffect(() => {
    if (!isAdmin) {
      setDropdownOpen(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

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
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-1 sm:gap-2 bg-[#181818] p-1 border border-white/12"
        >
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

        {/* Admin Trigger Button / Authenticated Dropdown */}
        <div className="relative flex items-center" ref={dropdownContainerRef}>
          {!isAdmin ? (
            <button
              type="button"
              onClick={onOpenAuthModal}
              title="Admin Login"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono-spec uppercase tracking-[0.18em] bg-[#181818] border border-white/18 text-white hover:border-[#CCFF00] hover:text-[#CCFF00] transition-all cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono-spec uppercase tracking-[0.15em] bg-[#181818] border border-[#CCFF00] text-white hover:bg-[#CCFF00]/10 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse shrink-0" />
                <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00] hidden sm:inline" />
                <span className="text-[#CCFF00] font-bold">Admin Active</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#CCFF00] transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Admin Active Dropdown Menu */}
              {dropdownOpen && (
                <div
                  role="menu"
                  className="admin-only absolute right-0 top-full mt-2 w-64 bg-[#181818] border border-[#CCFF00]/60 shadow-2xl p-3 z-50 space-y-2.5"
                >
                  <div className="px-2.5 py-2 bg-[#0D0D0D] border border-white/10">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono-spec uppercase tracking-[0.2em] text-[#CCFF00]">
                      <span className="w-1.5 h-1.5 bg-[#CCFF00] inline-block" />
                      <span>Admin Active</span>
                    </div>
                    <p className="font-mono-spec text-xs text-white truncate mt-1">
                      {session?.user?.email}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenAddModal();
                    }}
                    className="w-full py-2.5 px-3 bg-[#CCFF00] text-[#0D0D0D] hover:bg-white font-mono-spec font-bold text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Product</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenSupabaseModal();
                    }}
                    className="w-full py-2 px-3 bg-[#0D0D0D] border border-white/15 hover:border-[#CCFF00] text-neutral-200 hover:text-[#CCFF00] font-mono-spec text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>{isSupabaseLive ? 'Supabase Config' : 'Connect Supabase'}</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    disabled={isSigningOut}
                    onClick={async () => {
                      setDropdownOpen(false);
                      await onSignOut();
                    }}
                    className="w-full py-2.5 px-3 bg-[#0D0D0D] border border-[#FF3B30]/50 hover:bg-[#FF3B30] text-[#FF3B30] hover:text-white font-mono-spec font-bold text-xs uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSigningOut ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Logging Out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Authenticated .admin-only Management Toolbar */}
      {isAdmin && (
        <div className="admin-only bg-[#141414] border-t border-[#CCFF00]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-spec">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 text-[#CCFF00] uppercase tracking-wider font-semibold">
                <span className="w-2 h-2 bg-[#CCFF00] inline-block animate-pulse" />
                Admin Active ({session?.user?.email})
              </span>
              <span className="text-neutral-400 hidden md:inline">
                Product upload &amp; trash deletion controls are unlocked.
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#CCFF00] text-[#0D0D0D] font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product
              </button>

              <button
                type="button"
                disabled={isSigningOut}
                onClick={() => void onSignOut()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] border border-white/20 text-neutral-200 hover:border-[#FF3B30] hover:text-[#FF3B30] uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
