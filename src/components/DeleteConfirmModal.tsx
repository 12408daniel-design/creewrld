import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import type { Product } from '../types/product';
import { extractStorageFilePath, PRODUCT_IMAGES_BUCKET } from '../supabaseClient';
import { formatKsh } from '../utils/whatsapp';

interface DeleteConfirmModalProps {
  product: Product | null;
  isDeleting: boolean;
  isSupabaseLive: boolean;
  onCancel: () => void;
  onConfirmDelete: (product: Product) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  product,
  isDeleting,
  isSupabaseLive,
  onCancel,
  onConfirmDelete,
}) => {
  if (!product) return null;

  const extractedPath = extractStorageFilePath(product.image_url);

  return (
    <div
      className="admin-only fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1118]/90 backdrop-blur-sm"
      onClick={() => !isDeleting && onCancel()}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-modal-heading"
    >
      <div
        className="w-full max-w-md bg-[#132238] border border-[#FF3B30]/60 p-6 sm:p-7 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          disabled={isDeleting}
          onClick={onCancel}
          aria-label="Cancel deletion"
          className="absolute top-4 right-4 text-slate-300 hover:text-[#F4EFEA] disabled:opacity-40 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-[#FF3B30] mb-4">
          <div className="w-10 h-10 bg-[#FF3B30]/15 border border-[#FF3B30]/40 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-cinzel font-semibold text-[10px] uppercase tracking-[0.2em] text-[#FF3B30]">
              ADMIN ACTION // PERMANENT DELETE
            </p>
            <h3
              id="delete-modal-heading"
              className="font-cinzel text-xl font-bold uppercase tracking-wider text-[#F4EFEA]"
            >
              Remove Thrift Drop?
            </h3>
          </div>
        </div>

        {/* Item Preview Card */}
        <div className="flex items-center gap-3.5 bg-[#0A1118] border border-[#F4EFEA]/15 p-3 mb-4">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-14 h-16 object-cover bg-[#132238] shrink-0"
          />
          <div className="min-w-0">
            <p className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#F4EFEA] truncate">
              {product.title}
            </p>
            <p className="font-cinzel font-semibold text-xs tracking-wider text-white mt-0.5">
              KSh {formatKsh(product.price_ksh)} · {product.size}
            </p>
            <p className="font-mono-spec text-[10px] text-slate-400 truncate mt-0.5">
              Bucket file: {PRODUCT_IMAGES_BUCKET}/{extractedPath ?? 'unknown'}
            </p>
          </div>
        </div>

        <p className="font-sans text-xs text-slate-300 leading-relaxed mb-6">
          {isSupabaseLive
            ? `This will permanently delete "${extractedPath ?? 'image'}" from Supabase Storage (${PRODUCT_IMAGES_BUCKET}), delete the row from the products table, and immediately remove the card from the live UI.`
            : `This will run the delete handler (removing the card immediately from the live DOM state; connect Supabase to persist Storage & database deletions).`}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="py-3 px-4 bg-[#0A1118] border border-[#F4EFEA]/20 text-slate-200 hover:border-[#F4EFEA] hover:text-[#F4EFEA] font-sans font-semibold text-xs uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onConfirmDelete(product)}
            className="py-3 px-4 bg-[#FF3B30] hover:bg-red-600 text-white font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Confirm Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
