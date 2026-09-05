import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStoreData } from '../../context/StoreDataContext';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

// Modular Tabs
import { AdminDashboardOverview } from './tabs/AdminDashboardOverview';
import { AdminOrdersTab } from './tabs/AdminOrdersTab';
import { AdminPreOrdersTab } from './tabs/AdminPreOrdersTab';
import { AdminWaitlistTab } from './tabs/AdminWaitlistTab';
import { AdminCustomersTab } from './tabs/AdminCustomersTab';
import { AdminProductsTab } from './tabs/AdminProductsTab';
import { AdminInventoryTab } from './tabs/AdminInventoryTab';
import { AdminPaymentsTab } from './tabs/AdminPaymentsTab';
import { AdminCouponsTab } from './tabs/AdminCouponsTab';
import { AdminReviewsTab } from './tabs/AdminReviewsTab';
import { AdminGiftOrdersTab } from './tabs/AdminGiftOrdersTab';
import { AdminDeliveryTab } from './tabs/AdminDeliveryTab';
import { AdminAnalyticsTab } from './tabs/AdminAnalyticsTab';
import { AdminNotificationsTab } from './tabs/AdminNotificationsTab';
import { AdminSupportTab } from './tabs/AdminSupportTab';
import { AdminActivityTab } from './tabs/AdminActivityTab';
import { AdminSettingsTab } from './tabs/AdminSettingsTab';
import { AdminProfileTab } from './tabs/AdminProfileTab';

// Modular Modals
import { AdminOrderModal } from './modals/AdminOrderModal';
import { AdminProductModal } from './modals/AdminProductModal';
import { AdminCouponModal } from './modals/AdminCouponModal';
import { AdminStockModal } from './modals/AdminStockModal';

import { OrderConfirmation, Product, Coupon, InventoryItem, PreOrder } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { activeAdminTab, setActiveAdminTab } = useAuth();
  
  // Mobile drawer state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<OrderConfirmation | null>(null);
  
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<InventoryItem | null>(null);

  // Quick Action Handlers
  const handleOpenAddProduct = () => {
    setSelectedProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const handleOpenAddCoupon = () => {
    setSelectedCoupon(null);
    setCouponModalOpen(true);
  };

  const handleOpenEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setCouponModalOpen(true);
  };

  const handleOpenStockAdjust = (item: InventoryItem) => {
    setSelectedStockItem(item);
    setStockModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#171316] flex flex-col font-sans selection:bg-[#7A0F29] selection:text-[#FFF7E8]">
      
      {/* Sticky Dark Admin Top Header */}
      <AdminHeader
        onOpenMobileNav={() => setMobileNavOpen(true)}
        onSelectOrder={(order) => setSelectedOrder(order)}
        onSelectProduct={(product) => handleOpenEditProduct(product)}
        onSelectPreOrder={() => setActiveAdminTab('preorders')}
      />

      {/* Main Admin Content Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Navigation Sidebar */}
          <AdminSidebar
            mobileOpen={mobileNavOpen}
            onCloseMobile={() => setMobileNavOpen(false)}
          />

          {/* Active Tab Viewport */}
          <main className="lg:col-span-3 min-w-0">
            {activeAdminTab === 'dashboard' && (
              <AdminDashboardOverview
                onSelectOrder={(order) => setSelectedOrder(order)}
                onOpenAddProduct={handleOpenAddProduct}
              />
            )}

            {activeAdminTab === 'orders' && (
              <AdminOrdersTab
                onSelectOrder={(order) => setSelectedOrder(order)}
              />
            )}

            {activeAdminTab === 'preorders' && (
              <AdminPreOrdersTab />
            )}

            {activeAdminTab === 'waitlist' && (
              <AdminWaitlistTab />
            )}

            {activeAdminTab === 'customers' && (
              <AdminCustomersTab
                onSelectOrder={(order) => setSelectedOrder(order)}
              />
            )}

            {activeAdminTab === 'products' && (
              <AdminProductsTab
                onOpenAddProduct={handleOpenAddProduct}
                onOpenEditProduct={handleOpenEditProduct}
              />
            )}

            {activeAdminTab === 'inventory' && (
              <AdminInventoryTab
                onOpenStockAdjust={handleOpenStockAdjust}
              />
            )}

            {activeAdminTab === 'payments' && (
              <AdminPaymentsTab
                onSelectOrder={(order) => setSelectedOrder(order)}
              />
            )}

            {activeAdminTab === 'coupons' && (
              <AdminCouponsTab
                onOpenAddCoupon={handleOpenAddCoupon}
                onOpenEditCoupon={handleOpenEditCoupon}
              />
            )}

            {activeAdminTab === 'reviews' && (
              <AdminReviewsTab />
            )}

            {activeAdminTab === 'gifts' && (
              <AdminGiftOrdersTab />
            )}

            {activeAdminTab === 'delivery' && (
              <AdminDeliveryTab
                onSelectOrder={(order) => setSelectedOrder(order)}
              />
            )}

            {activeAdminTab === 'analytics' && (
              <AdminAnalyticsTab />
            )}

            {activeAdminTab === 'notifications' && (
              <AdminNotificationsTab />
            )}

            {activeAdminTab === 'support' && (
              <AdminSupportTab />
            )}

            {activeAdminTab === 'activity' && (
              <AdminActivityTab />
            )}

            {activeAdminTab === 'settings' && (
              <AdminSettingsTab />
            )}

            {activeAdminTab === 'profile' && (
              <AdminProfileTab />
            )}
          </main>

        </div>
      </div>

      {/* Global Admin Modals */}
      <AdminOrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <AdminProductModal
        isOpen={productModalOpen}
        product={selectedProduct}
        onClose={() => setProductModalOpen(false)}
      />

      <AdminCouponModal
        isOpen={couponModalOpen}
        coupon={selectedCoupon}
        onClose={() => setCouponModalOpen(false)}
      />

      <AdminStockModal
        isOpen={stockModalOpen}
        item={selectedStockItem}
        onClose={() => setStockModalOpen(false)}
      />

    </div>
  );
};
