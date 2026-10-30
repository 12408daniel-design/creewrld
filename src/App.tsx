import React, { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Navbar, type ActivePage } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AddProductModal, SupabaseSetupModal } from './components/AdminModals';
import { AdminAuthModal } from './components/AdminAuthModal';
import { PREVIEW_SHOWCASE_PRODUCTS } from './data/previewProducts';
import type { FilterCategory, NewProductInput, Product } from './types/product';
import {
  createProductInSupabase,
  deleteProductFromSupabase,
  fetchProductsFromSupabase,
  getActiveAdminSession,
  resolveSupabaseCredentials,
  signOutAdmin,
  subscribeToAuthState,
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

  // Supabase Auth Session State
  const [session, setSession] = useState<Session | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState<boolean>(false);

  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(
    () => resolveSupabaseCredentials().source !== 'placeholder'
  );
  const [toast, setToast] = useState<ToastBanner | null>(null);

  const isAdmin = Boolean(session);

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  }, []);

  // Synchronize body class with authenticated admin session to strictly enforce .admin-only visibility
  useEffect(() => {
    document.body.classList.toggle('admin-authenticated', isAdmin);
    if (!isAdmin) {
      setAddModalOpen(false);
      setProductPendingDelete(null);
      setSupabaseModalOpen(false);
    }
    return () => {
      document.body.classList.remove('admin-authenticated');
    };
  }, [isAdmin]);

  // Hydrate persisted Supabase Auth session & subscribe to live auth state changes
  useEffect(() => {
    let active = true;

    void getActiveAdminSession().then((initialSession) => {
      if (active) {
        setSession(initialSession);
      }
    });

    const unsubscribe = subscribeToAuthState((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [isSupabaseLive]);

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
      await new Promise((resolve) => setTimeout(resolve, 420));
      setProducts(PREVIEW_SHOWCASE_PRODUCTS);
      setLoading(false);
    }
  }, []);

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

  const handleAdminAuthenticated = (verifiedSession: Session) => {
    setSession(verifiedSession);
    showToast('success', `Admin unlocked (${verifiedSession.user.email ?? 'Verified'}).`);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutAdmin();
      setSession(null);
      setAddModalOpen(false);
      setProductPendingDelete(null);
      setSupabaseModalOpen(false);
      showToast('success', 'Logged out of Admin mode.');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to sign out.');
    } finally {
      setIsSigningOut(false);
    }
  };

  // Security Enforcement: ensure active session before opening Admin modals or executing mutations
  const handleRequestOpenAddModal = async () => {
    const currentSession = await getActiveAdminSession();
    if (!currentSession) {
      setSession(null);
      setAuthModalOpen(true);
      return;
    }
    setAddModalOpen(true);
  };

  const handleRequestDeleteProduct = async (product: Product) => {
    const currentSession = await getActiveAdminSession();
    if (!currentSession) {
      setSession(null);
      setAuthModalOpen(true);
      return;
    }
    setProductPendingDelete(product);
  };

  const handleConfirmDelete = async (target: Product) => {
    const currentSession = await getActiveAdminSession();
    if (!currentSession) {
      setSession(null);
      setProductPendingDelete(null);
      setAuthModalOpen(true);
      showToast('error', 'Admin session expired. Please verify credentials again.');
      return;
    }

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
        `Deleted "${target.title}" & storage image (${removedStoragePath ?? 'product-images'}).`
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
    const currentSession = await getActiveAdminSession();
    if (!currentSession) {
      setSession(null);
      setAddModalOpen(false);
      setAuthModalOpen(true);
      throw new Error('Unauthorized: Please sign in as admin first.');
    }

    const created = await createProductInSupabase(input, file);
    setProducts((prev) => [created, ...prev]);
    showToast(
      'success',
      `Uploaded "${created.title}" to Supabase Storage & products table.`
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#0A1118] text-white flex flex-col overflow-x-hidden">
      {/* Strictly Two-View Navigation Header + Supabase Auth Admin Trigger */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        productCount={products.length}
        session={session}
        isSigningOut={isSigningOut}
        isSupabaseLive={isSupabaseLive}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onSignOut={handleSignOut}
        onOpenAddModal={() => void handleRequestOpenAddModal()}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
      />

      {/* Main Two-View Router: HOME or SHOP */}
      <main className="flex-1 w-full">
        {activePage === 'home' ? (
          <HomeView
            products={products}
            loading={loading}
            adminMode={isAdmin}
            isSupabaseLive={isSupabaseLive}
            onNavigateToShop={handleNavigateToShop}
            onSelectProduct={setSelectedProduct}
            onRequestDelete={(product) => void handleRequestDeleteProduct(product)}
            onOpenAddModal={() => void handleRequestOpenAddModal()}
          />
        ) : (
          <ShopView
            products={products}
            loading={loading}
            error={fetchError}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            adminMode={isAdmin}
            isSupabaseLive={isSupabaseLive}
            onSelectProduct={setSelectedProduct}
            onRequestDelete={(product) => void handleRequestDeleteProduct(product)}
            onRefresh={() => void loadProducts()}
            onOpenAddModal={() => void handleRequestOpenAddModal()}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
        isSupabaseLive={isSupabaseLive}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
      />

      {/* Admin Password Verification Modal (Supabase Auth) */}
      <AdminAuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={handleAdminAuthenticated}
      />

      {/* Quick-View Product Modal (with Direct Order via WhatsApp) */}
      <ProductDetailModal
        product={selectedProduct}
        isAdmin={isAdmin}
        onClose={() => setSelectedProduct(null)}
        onRequestDelete={(product) => void handleRequestDeleteProduct(product)}
      />

      {/* Admin-Only Modals (Rendered only when an active Supabase Auth session is verified) */}
      {isAdmin && (
        <>
          <DeleteConfirmModal
            product={productPendingDelete}
            isDeleting={isDeleting}
            isSupabaseLive={isSupabaseLive}
            onCancel={() => !isDeleting && setProductPendingDelete(null)}
            onConfirmDelete={(product) => void handleConfirmDelete(product)}
          />

          <AddProductModal
            open={addModalOpen}
            isSupabaseLive={isSupabaseLive}
            onClose={() => setAddModalOpen(false)}
            onCreateProduct={handleCreateProduct}
          />

          <SupabaseSetupModal
            open={supabaseModalOpen}
            onClose={() => setSupabaseModalOpen(false)}
            onCredentialsUpdated={() => {
              void loadProducts();
              showToast('success', 'Supabase connection settings updated.');
            }}
          />
        </>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-50 max-w-sm px-4 py-3.5 border shadow-2xl flex items-start gap-3 ${
            toast.type === 'success'
              ? 'bg-[#132238] border-[#F4EFEA]/70 text-[#F4EFEA]'
              : 'bg-[#132238] border-[#FF3B30] text-red-100'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#F4EFEA] shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
          )}
          <p className="font-sans text-xs leading-relaxed flex-1">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            className="text-slate-400 hover:text-[#F4EFEA] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
