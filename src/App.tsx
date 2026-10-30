import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Navbar, type ActivePage } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AddProductModal, SupabaseSetupModal } from './components/AdminModals';
import { PREVIEW_SHOWCASE_PRODUCTS } from './data/previewProducts';
import type { FilterCategory, NewProductInput, Product } from './types/product';
import {
  createProductInSupabase,
  deleteProductFromSupabase,
  fetchProductsFromSupabase,
  resolveSupabaseCredentials,
} from './supabaseClient';

interface ToastBanner {
  id: number;
  type: 'success' | 'error';
  message: string;
}

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState<boolean>(false);
  const [simulatedEmpty, setSimulatedEmpty] = useState<boolean>(false);

  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(
    () => resolveSupabaseCredentials().source !== 'placeholder'
  );
  const [toast, setToast] = useState<ToastBanner | null>(null);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  }, []);

  const loadProducts = useCallback(async () => {
    const creds = resolveSupabaseCredentials();
    const live = creds.source !== 'placeholder';
    setIsSupabaseLive(live);
    setLoading(true);
    setFetchError(null);

    if (live) {
      try {
        const rows = await fetchProductsFromSupabase();
        setProducts(rows);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unable to fetch products from Supabase.';
        setFetchError(message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    } else {
      // Graceful skeleton transition into preview showcase when SUPABASE_URL === 'YOUR_SUPABASE_URL'
      await new Promise((resolve) => setTimeout(resolve, 420));
      setProducts(simulatedEmpty ? [] : PREVIEW_SHOWCASE_PRODUCTS);
      setLoading(false);
    }
  }, [simulatedEmpty]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToShop = (category: FilterCategory = 'All') => {
    setSelectedCategory(category);
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = async (target: Product) => {
    setIsDeleting(true);
    try {
      const { removedStoragePath } = await deleteProductFromSupabase(target);

      // Instantly remove deleted card from live UI DOM state without full page reload
      setProducts((prev) => prev.filter((item) => item.id !== target.id));
      if (selectedProduct?.id === target.id) {
        setSelectedProduct(null);
      }
      setProductPendingDelete(null);

      showToast(
        'success',
        isSupabaseLive
          ? `Deleted "${target.title}" & storage image (${removedStoragePath ?? 'product-images'}).`
          : `Removed "${target.title}" from live catalog state.`
      );
    } catch (err) {
      showToast(
        'error',
        err instanceof Error ? err.message : 'Failed to delete product from Supabase.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateProduct = async (input: NewProductInput, file: File) => {
    const created = await createProductInSupabase(input, file);
    setSimulatedEmpty(false);
    setProducts((prev) => [created, ...prev]);
    showToast(
      'success',
      isSupabaseLive
        ? `Uploaded "${created.title}" to Supabase Storage & products table.`
        : `Added "${created.title}" to live preview catalog.`
    );
  };

  const handleToggleSimulatedEmpty = () => {
    setSimulatedEmpty((prev) => {
      const next = !prev;
      setProducts(next ? [] : PREVIEW_SHOWCASE_PRODUCTS);
      return next;
    });
  };

  const handleResetPreviewCatalog = () => {
    setSimulatedEmpty(false);
    setProducts(PREVIEW_SHOWCASE_PRODUCTS);
    showToast('success', 'Restored all 9 Nairobi showcase drops.');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      {/* Strictly Two-View Navigation Header + Subtle Admin Toggle */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        productCount={products.length}
        adminMode={adminMode}
        onToggleAdminMode={() => setAdminMode((prev) => !prev)}
        isSupabaseLive={isSupabaseLive}
        onOpenAddModal={() => setAddModalOpen(true)}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
        onSimulateEmptyState={handleToggleSimulatedEmpty}
        onResetPreviewCatalog={handleResetPreviewCatalog}
        showingSimulatedEmpty={simulatedEmpty}
      />

      {/* Main Two-View Router: HOME or SHOP */}
      <main className="flex-1">
        {activePage === 'home' ? (
          <HomeView
            products={products}
            loading={loading}
            adminMode={adminMode}
            isSupabaseLive={isSupabaseLive}
            onNavigateToShop={handleNavigateToShop}
            onSelectProduct={setSelectedProduct}
            onRequestDelete={setProductPendingDelete}
            onOpenAddModal={() => setAddModalOpen(true)}
          />
        ) : (
          <ShopView
            products={products}
            loading={loading}
            error={fetchError}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            adminMode={adminMode}
            isSupabaseLive={isSupabaseLive}
            onSelectProduct={setSelectedProduct}
            onRequestDelete={setProductPendingDelete}
            onRefresh={() => void loadProducts()}
            onOpenAddModal={() => setAddModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        isSupabaseLive={isSupabaseLive}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
      />

      {/* Quick-View Product Modal (with Direct Order via WhatsApp) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onRequestDelete={setProductPendingDelete}
      />

      {/* Delete Confirmation Modal (Supabase Storage + DB Row + Instant UI State) */}
      <DeleteConfirmModal
        product={productPendingDelete}
        isDeleting={isDeleting}
        isSupabaseLive={isSupabaseLive}
        onCancel={() => !isDeleting && setProductPendingDelete(null)}
        onConfirmDelete={(product) => void handleConfirmDelete(product)}
      />

      {/* Admin Product Upload Modal */}
      <AddProductModal
        open={addModalOpen}
        isSupabaseLive={isSupabaseLive}
        onClose={() => setAddModalOpen(false)}
        onCreateProduct={handleCreateProduct}
      />

      {/* Supabase Credentials & SQL Schema Modal */}
      <SupabaseSetupModal
        open={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        onCredentialsUpdated={() => {
          void loadProducts();
          showToast('success', 'Supabase connection settings updated.');
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-50 max-w-sm px-4 py-3.5 border shadow-2xl flex items-start gap-3 ${
            toast.type === 'success'
              ? 'bg-[#181818] border-[#CCFF00] text-white'
              : 'bg-[#181818] border-[#FF3B30] text-red-100'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
          )}
          <p className="font-mono-spec text-xs leading-relaxed flex-1">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            className="text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
