import React from 'react';
import { CreewrldLogo } from './CreewrldLogo';
import Magnet from './Magnet';
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
    <footer className="w-full bg-[#0A1118] border-t border-[#F4EFEA]/15">
      <div className="w-full px-6 md:px-12 lg:px-16 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-3">
          <CreewrldLogo emblemSize={38} />
          <p className="font-sans text-xs text-slate-300 max-w-md leading-relaxed">
            Heritage online thrift archive based in Nairobi, Kenya. Every item is 1-of-1 and
            ordered directly via WhatsApp ({CREEWRLD_WHATSAPP_DISPLAY}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-sans font-semibold text-xs uppercase tracking-[0.18em]">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-slate-300 hover:text-[#F4EFEA] transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="text-slate-300 hover:text-[#F4EFEA] transition-colors cursor-pointer"
          >
            Shop
          </button>
          <Magnet padding={60} magnetStrength={3} maxOffset={10} scale={1.04}>
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F4EFEA] hover:text-white underline decoration-[#F4EFEA]/40 underline-offset-4 transition-colors"
            >
              WhatsApp Order Desk
            </a>
          </Magnet>
          {isAdmin ? (
            <button
              type="button"
              onClick={onOpenSupabaseModal}
              className="admin-only text-slate-300 hover:text-[#F4EFEA] transition-colors cursor-pointer"
            >
              {isSupabaseLive ? '● Supabase Live' : '○ Connect Supabase'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="text-slate-400 hover:text-[#F4EFEA] transition-colors cursor-pointer"
            >
              Admin
            </button>
          )}
        </div>
      </div>

      <div className="w-full border-t border-[#F4EFEA]/10 py-4 bg-[#132238]/35">
        <div className="w-full px-6 md:px-12 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-2 font-cinzel text-[11px] tracking-[0.16em] text-slate-400">
          <span>© {new Date().getFullYear()} CREEWRLD KENYA. ALL RIGHTS RESERVED.</span>
          <span>NAIROBI · M-PESA TILL &amp; NATIONWIDE DISPATCH</span>
        </div>
      </div>
    </footer>
  );
};
