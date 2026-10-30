import React from 'react';
import { CreewrldLogo } from './CreewrldLogo';
import type { ActivePage } from './Navbar';
import { buildGeneralWhatsAppUrl, CREEWRLD_WHATSAPP_DISPLAY } from '../utils/whatsapp';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
  isAdmin: boolean;
  isSupabaseLive: boolean;
  onOpenAuthModal: () => void;
  onOpenSupabaseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  isAdmin,
  isSupabaseLive,
  onOpenAuthModal,
  onOpenSupabaseModal,
}) => {
  return (
    <footer className="w-full bg-[#0D0D0D] border-t border-white/12">
      <div className="w-full px-6 md:px-12 lg:px-16 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-3">
          <CreewrldLogo emblemSize={38} />
          <p className="text-xs text-neutral-400 max-w-md leading-relaxed">
            High-contrast online thrift archive based in Nairobi, Kenya. Every item is 1-of-1 and
            ordered directly via WhatsApp ({CREEWRLD_WHATSAPP_DISPLAY}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono-spec text-xs uppercase tracking-[0.2em]">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-neutral-300 hover:text-[#CCFF00] transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="text-neutral-300 hover:text-[#CCFF00] transition-colors cursor-pointer"
          >
            Shop
          </button>
          <a
            href={buildGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#CCFF00] hover:text-white transition-colors"
          >
            WhatsApp Order Desk
          </a>
          {isAdmin ? (
            <button
              type="button"
              onClick={onOpenSupabaseModal}
              className="admin-only text-neutral-400 hover:text-[#CCFF00] transition-colors cursor-pointer"
            >
              {isSupabaseLive ? '● Supabase Live' : '○ Connect Supabase'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              Admin
            </button>
          )}
        </div>
      </div>

      <div className="w-full border-t border-white/8 py-4">
        <div className="w-full px-6 md:px-12 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono-spec text-[11px] text-neutral-500">
          <span>© {new Date().getFullYear()} CREEWRLD KENYA. ALL RIGHTS RESERVED.</span>
          <span>NAIROBI · M-PESA TILL &amp; NATIONWIDE DISPATCH</span>
        </div>
      </div>
    </footer>
  );
};
