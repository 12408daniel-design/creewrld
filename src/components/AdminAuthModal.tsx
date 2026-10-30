import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  X,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { CreewrldEmblem } from './CreewrldLogo';
import { getSupabaseClient } from '../supabaseClient';

interface AdminAuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: (session: Session) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  open,
  onClose,
  onAuthenticated,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPassword('');
      setShowPassword(false);
      setErrorMessage(null);
      setVerifying(false);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !verifying) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, verifying, onClose]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter both your admin email and password.');
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setErrorMessage('Supabase client is not configured. Check SUPABASE_URL and SUPABASE_ANON_KEY.');
      return;
    }

    setVerifying(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error || !data.session) {
        const rawMsg = error?.message?.toLowerCase() ?? '';
        if (
          rawMsg.includes('invalid login credentials') ||
          rawMsg.includes('invalid credentials') ||
          !data.session
        ) {
          setErrorMessage('Invalid admin credentials');
        } else {
          setErrorMessage(error?.message ?? 'Invalid admin credentials');
        }
        return;
      }

      setPassword('');
      setErrorMessage(null);
      onAuthenticated(data.session);
      onClose();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Invalid admin credentials');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1118]/85 backdrop-blur-md"
      onClick={() => !verifying && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-auth-modal-title"
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden bg-[#132238] border border-[#F4EFEA]/35 shadow-[0_24px_65px_rgba(10,17,24,0.85)] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          disabled={verifying}
          onClick={onClose}
          aria-label="Close admin verification modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center bg-[#0A1118] border border-[#F4EFEA]/20 text-slate-300 hover:text-[#F4EFEA] hover:border-[#F4EFEA] transition-colors disabled:opacity-40 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#0A1118] border border-[#F4EFEA]/35 flex items-center justify-center shrink-0">
            <CreewrldEmblem size={34} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 font-cinzel font-semibold text-[10px] uppercase tracking-[0.2em] text-[#F4EFEA]/85">
              <Lock className="w-3 h-3" />
              <span>SUPABASE AUTH // RESTRICTED</span>
            </div>
            <h2
              id="admin-auth-modal-title"
              className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#F4EFEA] mt-0.5"
            >
              Admin Verification
            </h2>
          </div>
        </div>

        <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
          Sign in with your verified CREEWRLD admin credentials to unlock drop uploads and storage
          management.
        </p>

        {/* Error Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-[#FF3B30]/15 border border-[#FF3B30] flex items-start gap-2.5 text-xs font-mono-spec text-red-200"
          >
            <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email-input"
              className="block font-sans font-semibold text-[11px] uppercase tracking-[0.18em] text-slate-200 mb-1.5"
            >
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-email-input"
                type="email"
                name="email"
                autoComplete="email"
                autoFocus
                required
                disabled={verifying}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@creewrld.com"
                className="w-full rounded-lg bg-[#0A1118] border border-[#F4EFEA]/20 focus:border-[#F4EFEA] pl-10 pr-3.5 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password-input"
              className="block font-sans font-semibold text-[11px] uppercase tracking-[0.18em] text-slate-200 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                required
                disabled={verifying}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg bg-[#0A1118] border border-[#F4EFEA]/20 focus:border-[#F4EFEA] pl-10 pr-10 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors disabled:opacity-60"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#F4EFEA] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              disabled={verifying}
              onClick={onClose}
              className="sm:w-1/3 py-3.5 px-4 rounded-lg bg-[#0A1118] border border-[#F4EFEA]/20 hover:border-[#F4EFEA] text-slate-200 hover:text-[#F4EFEA] font-sans font-semibold text-xs uppercase tracking-[0.18em] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={verifying}
              className="sm:w-2/3 py-3.5 px-5 rounded-lg bg-[#F4EFEA] text-[#0A1118] hover:bg-white font-sans font-extrabold text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-colors disabled:opacity-70 cursor-pointer"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify &amp; Unlock</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
