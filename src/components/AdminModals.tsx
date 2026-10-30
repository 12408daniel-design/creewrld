import React, { useState } from 'react';
import {
  X,
  Upload,
  Loader2,
  Database,
  Copy,
  Check,
  PlugZap,
  Unplug,
} from 'lucide-react';
import {
  PRODUCT_CATEGORIES,
  type NewProductInput,
  type ProductCategory,
} from '../types/product';
import { SUPABASE_SETUP_SQL } from '../data/previewProducts';
import {
  resolveSupabaseCredentials,
  saveRuntimeSupabaseCredentials,
  clearRuntimeSupabaseCredentials,
} from '../supabaseClient';

const CATEGORIES_WITHOUT_ALL = PRODUCT_CATEGORIES.filter(
  (c): c is ProductCategory => c !== 'All'
);

const CONDITION_PRESETS = [
  '10/10 Mint',
  '9.5/10 Vintage',
  '9/10 Vintage',
  '8.5/10 Thrifted',
  '8/10 Distressed Archive',
];

interface AddProductModalProps {
  open: boolean;
  isSupabaseLive: boolean;
  onClose: () => void;
  onCreateProduct: (input: NewProductInput, file: File) => Promise<void>;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  isSupabaseLive,
  onClose,
  onCreateProduct,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Streetwear');
  const [priceKsh, setPriceKsh] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('9.5/10 Vintage');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Please enter a product title.');
      return;
    }
    const parsedPrice = Number(priceKsh);
    if (!priceKsh || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Please enter a valid KSh price.');
      return;
    }
    if (!size.trim()) {
      setFormError('Please specify the item size (e.g., EU 42, L, W32).');
      return;
    }
    if (!imageFile) {
      setFormError('Please select a product photo to upload.');
      return;
    }

    setSubmitting(true);
    try {
      await onCreateProduct(
        {
          title: title.trim(),
          category,
          price_ksh: parsedPrice,
          size: size.trim(),
          condition: condition.trim() || '9/10 Vintage',
        },
        imageFile
      );
      setTitle('');
      setPriceKsh('');
      setSize('');
      setImageFile(null);
      setPreviewUrl(null);
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to upload product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="admin-only fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={() => !submitting && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg bg-[#181818] border border-white/20 p-6 sm:p-8 max-h-[92vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close upload modal"
          className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <p className="font-mono-spec text-[11px] uppercase tracking-[0.24em] text-[#CCFF00] mb-1">
          ADMIN DROP UPLOADER // {isSupabaseLive ? 'LIVE SUPABASE BUCKET' : 'PREVIEW MODE'}
        </p>
        <h3 className="font-display text-2xl font-extrabold text-white mb-5">
          Publish New Thrift Piece
        </h3>

        {formError && (
          <div className="mb-4 p-3 bg-[#FF3B30]/15 border border-[#FF3B30] text-xs text-red-200 font-mono-spec">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono-spec text-[11px] uppercase tracking-wider text-neutral-300 mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Vintage 1998 Nike ACG Fleece Pullover"
              className="w-full bg-[#0D0D0D] border border-white/20 focus:border-[#CCFF00] px-3.5 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono-spec text-[11px] uppercase tracking-wider text-neutral-300 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-[#0D0D0D] border border-white/20 focus:border-[#CCFF00] px-3.5 py-2.5 text-sm text-white outline-none"
              >
                {CATEGORIES_WITHOUT_ALL.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono-spec text-[11px] uppercase tracking-wider text-neutral-300 mb-1.5">
                Price (KSh) *
              </label>
              <input
                type="number"
                min="1"
                step="50"
                value={priceKsh}
                onChange={(e) => setPriceKsh(e.target.value)}
                placeholder="4500"
                className="w-full bg-[#0D0D0D] border border-white/20 focus:border-[#CCFF00] px-3.5 py-2.5 text-sm text-white font-mono-spec outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono-spec text-[11px] uppercase tracking-wider text-neutral-300 mb-1.5">
                Size *
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="EU 42 / L / W32"
                className="w-full bg-[#0D0D0D] border border-white/20 focus:border-[#CCFF00] px-3.5 py-2.5 text-sm text-white font-mono-spec outline-none"
              />
            </div>

            <div>
              <label className="block font-mono-spec text-[11px] uppercase tracking-wider text-neutral-300 mb-1.5">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-white/20 focus:border-[#CCFF00] px-3.5 py-2.5 text-sm text-white outline-none"
              >
                {CONDITION_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono-spec text-[11px] uppercase tracking-wider text-neutral-300 mb-1.5">
              Product Image (`product-images` bucket) *
            </label>
            <label className="flex flex-col items-center justify-center border border-dashed border-white/25 hover:border-[#CCFF00] bg-[#0D0D0D] p-5 cursor-pointer transition-colors">
              {previewUrl ? (
                <div className="flex items-center gap-4 w-full">
                  <img
                    src={previewUrl}
                    alt="Selected preview"
                    className="w-16 h-20 object-cover border border-white/15"
                  />
                  <div className="text-left min-w-0">
                    <p className="text-xs text-white font-medium truncate">{imageFile?.name}</p>
                    <p className="font-mono-spec text-[11px] text-[#CCFF00] mt-1">
                      Click to replace image
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-[#CCFF00] mb-2" />
                  <span className="font-mono-spec text-xs text-white uppercase tracking-wider">
                    Select JPG, PNG, or WEBP Photo
                  </span>
                  <span className="text-[11px] text-neutral-500 mt-1">
                    Uploads directly to Supabase `product-images` public bucket
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-5 bg-[#CCFF00] text-[#0D0D0D] hover:bg-white font-mono-spec font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading to Archive...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Publish Drop Now
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

interface SupabaseSetupModalProps {
  open: boolean;
  onClose: () => void;
  onCredentialsUpdated: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  open,
  onClose,
  onCredentialsUpdated,
}) => {
  const currentCreds = resolveSupabaseCredentials();
  const [urlInput, setUrlInput] = useState(
    currentCreds.source !== 'placeholder' ? currentCreds.url : ''
  );
  const [keyInput, setKeyInput] = useState(
    currentCreds.source !== 'placeholder' ? currentCreds.anonKey : ''
  );
  const [copiedSql, setCopiedSql] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const handleCopySql = async () => {
    await navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2200);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const parsed = new URL(urlInput.trim());
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        throw new Error('URL must start with https://');
      }
    } catch {
      setErrorMsg('Enter a valid Supabase Project URL (e.g. https://xyzcompany.supabase.co).');
      return;
    }

    if (!keyInput.trim() || keyInput.trim().length < 20) {
      setErrorMsg('Enter your valid Supabase public anon key.');
      return;
    }

    saveRuntimeSupabaseCredentials(urlInput.trim(), keyInput.trim());
    onCredentialsUpdated();
    onClose();
  };

  const handleDisconnectRuntime = () => {
    clearRuntimeSupabaseCredentials();
    setUrlInput('');
    setKeyInput('');
    onCredentialsUpdated();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl bg-[#181818] border border-white/20 p-6 sm:p-8 max-h-[92vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Supabase setup"
          className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-[#CCFF00] mb-1">
          <Database className="w-4 h-4" />
          <span className="font-mono-spec text-[11px] uppercase tracking-[0.24em]">
            SUPABASE BACKEND // `products` TABLE + `product-images` BUCKET
          </span>
        </div>

        <h3 className="font-display text-2xl font-extrabold text-white mb-2">
          Dynamic Supabase Integration
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 mb-6">
          Update <code className="text-[#CCFF00]">SUPABASE_URL</code> and{' '}
          <code className="text-[#CCFF00]">SUPABASE_ANON_KEY</code> at the top of{' '}
          <code className="text-white">src/supabaseClient.ts</code>, or paste them below to connect
          this live session immediately.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-[#FF3B30]/15 border border-[#FF3B30] text-xs text-red-200 font-mono-spec">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleConnect} className="space-y-4 mb-6">
          <div>
            <label className="block font-mono-spec text-[11px] uppercase tracking-wider text-neutral-300 mb-1">
              SUPABASE_URL
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://your-project-id.supabase.co"
              className="w-full bg-[#0D0D0D] border border-white/20 focus:border-[#CCFF00] px-3.5 py-2.5 text-xs sm:text-sm font-mono-spec text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-mono-spec text-[11px] uppercase tracking-wider text-neutral-300 mb-1">
              SUPABASE_ANON_KEY
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-[#0D0D0D] border border-white/20 focus:border-[#CCFF00] px-3.5 py-2.5 text-xs sm:text-sm font-mono-spec text-white outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#CCFF00] text-[#0D0D0D] hover:bg-white font-mono-spec font-bold text-xs uppercase tracking-[0.18em] transition-colors cursor-pointer"
            >
              <PlugZap className="w-4 h-4" />
              Connect Live Supabase
            </button>

            {currentCreds.source === 'runtime' && (
              <button
                type="button"
                onClick={handleDisconnectRuntime}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0D0D0D] border border-white/20 text-neutral-300 hover:text-white font-mono-spec text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Unplug className="w-4 h-4" />
                Revert to Demo Catalog
              </button>
            )}
          </div>
        </form>

        {/* SQL Schema Copy Block */}
        <div className="border-t border-white/12 pt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-spec text-[11px] uppercase tracking-wider text-neutral-300">
              SQL Editor Setup (`supabase/schema.sql`)
            </span>
            <button
              type="button"
              onClick={handleCopySql}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0D0D0D] border border-white/20 hover:border-[#CCFF00] text-xs font-mono-spec text-[#CCFF00] cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSql ? 'Copied SQL' : 'Copy SQL'}
            </button>
          </div>
          <pre className="bg-[#0D0D0D] border border-white/12 p-3.5 text-[11px] font-mono-spec text-neutral-300 overflow-x-auto max-h-48 leading-relaxed">
            {SUPABASE_SETUP_SQL}
          </pre>
        </div>
      </div>
    </div>
  );
};
