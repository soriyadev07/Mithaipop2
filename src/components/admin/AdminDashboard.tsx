import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStoreData } from '../../context/StoreDataContext';
import { BrandLogo } from '../BrandLogo';
import { sounds } from '../../utils/audio';
import { 
  OrderConfirmation, 
  PreOrder, 
  Product, 
  InventoryItem, 
  Coupon, 
  OrderStatus, 
  PreOrderStatus, 
  User, 
  Review,
  GiftOrderRecord
} from '../../types';
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Package,
  Layers,
  Users,
  Tag,
  Star,
  Gift,
  BarChart3,
  Bell,
  Settings,
  History,
  LogOut,
  Search,
  Plus,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  ExternalLink,
  DollarSign,
  TrendingUp,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Check,
  AlertCircle,
  Truck,
  MessageSquare,
  FileText
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout, setCurrentView, activeAdminTab, setActiveAdminTab } = useAuth();
  const {
    orders,
    preOrders,
    products,
    inventory,
    coupons,
    reviews,
    giftOrders,
    notifications,
    activityLogs,
    settings,
    analyticsTimeframe,
    setAnalyticsTimeframe,
    getAnalytics,
    updateOrderStatus,
    cancelOrder,
    refundOrder,
    addInternalOrderNote,
    updatePreOrderStatus,
    updatePreOrderDispatchDate,
    notifyPreOrderCustomer,
    cancelPreOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    updateLowStockThreshold,
    addCoupon,
    updateCoupon,
    toggleCouponStatus,
    deleteCoupon,
    updateReviewStatus,
    deleteReview,
    updateGiftOrderStatus,
    markNotificationRead,
    markAllNotificationsRead,
    updateSettings,
    exportDataToCSV,
  } = useStoreData();

  // Search state (Global search)
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Notifications dropdown
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Orders Management state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedAdminOrder, setSelectedAdminOrder] = useState<OrderConfirmation | null>(null);
  const [newOrderNote, setNewOrderNote] = useState('');

  // Pre-Orders state
  const [preOrderSearch, setPreOrderSearch] = useState('');
  const [selectedPreOrder, setSelectedPreOrder] = useState<PreOrder | null>(null);
  const [editDispatchDate, setEditDispatchDate] = useState('');
  const [notifyCustomerText, setNotifyCustomerText] = useState('');

  // Products state
  const [productSearch, setProductSearch] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    flavorCombination: '',
    tagline: '',
    description: '',
    cityInspiration: 'Delhi',
    price: 249,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=80',
    accentColor: '#7A0F29',
    bgColor: '#FFF7E8',
    inventoryCount: 50,
    lowStockThreshold: 15,
    category: 'Classic Fusion',
    isFeatured: false,
    isBestSeller: false,
    isAvailableForPreOrder: false,
    ingredients: ['Pure Mawa', 'Cardamom', 'Cacao'],
    nutrition: { calories: 220, protein: '6g', carbs: '28g', fat: '10g' },
    temperature: '-18°C',
    shelfLife: '6 Months (Frozen)',
    canArtworkDescription: 'Collectible Mithai Pop Aluminum Canister',
    pairingNotes: 'Enjoy chilled straight from the can.',
    tags: ['Fusion', 'Cryo-Pack']
  });

  // Inventory state
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockAdjustItem, setStockAdjustItem] = useState<InventoryItem | null>(null);
  const [stockDelta, setStockDelta] = useState<number>(10);
  const [stockReason, setStockReason] = useState('Kitchen Restock');

  // Customers state
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerNoteText, setCustomerNoteText] = useState('');

  // Coupons state
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCouponCode, setEditingCouponCode] = useState<string | null>(null);
  const [couponForm, setCouponForm] = useState<Coupon>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 400,
    maxDiscount: 150,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2024-12-31',
    usageLimit: 1000,
    usageCount: 0,
    isActive: true,
    description: ''
  });

  // Settings tab form state
  const [settingsForm, setSettingsForm] = useState(settings);

  // Global search results
  const globalSearchResults = useMemo(() => {
    if (!globalSearch.trim() || globalSearch.length < 2) return null;
    const q = globalSearch.toLowerCase();
    
    const matchedOrders = orders.filter(o => 
      o.orderId.toLowerCase().includes(q) || 
      (o.customerName && o.customerName.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedProducts = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.sku && p.sku.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedPreOrders = preOrders.filter(po => 
      po.orderNumber.toLowerCase().includes(q) || 
      po.customerName.toLowerCase().includes(q)
    ).slice(0, 3);

    return { orders: matchedOrders, products: matchedProducts, preOrders: matchedPreOrders };
  }, [globalSearch, orders, products, preOrders]);

  // Derived metrics from real store data
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const todayOrders = useMemo(() => orders.filter(o => o.placedAt?.startsWith(todayStr)), [orders, todayStr]);
  const todayRevenue = useMemo(() => todayOrders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.total || 0), 0), [todayOrders]);
  const totalRevenue = useMemo(() => orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.total || 0), 0), [orders]);
  const totalOrdersCount = orders.length;
  const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const lowStockCount = useMemo(() => inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length, [inventory]);
  const pendingOrdersCount = useMemo(() => orders.filter(o => o.status === 'Preparing' || o.status === 'Order Confirmed' || o.status === 'Pending').length, [orders]);
  const unreadAdminNotifs = useMemo(() => notifications.filter(n => (n.target === 'admin' || n.target === 'all') && !n.read).length, [notifications]);
  const refundRequestsCount = useMemo(() => orders.filter(o => o.status === 'Cancelled').length, [orders]);

  // Dynamic Customers derived from real orders
  const derivedCustomers = useMemo(() => {
    const custMap: Record<string, { id: string; name: string; email: string; phone: string; orders: number; spent: number; lastOrder: string }> = {};
    orders.forEach(o => {
      const emailKey = (o.customerEmail || o.customerPhone || o.customerName || 'anon').toLowerCase();
      if (!custMap[emailKey]) {
        custMap[emailKey] = {
          id: emailKey,
          name: o.customerName || 'Customer',
          email: o.customerEmail || 'N/A',
          phone: o.customerPhone || 'N/A',
          orders: 0,
          spent: 0,
          lastOrder: o.placedAt
        };
      }
      custMap[emailKey].orders += 1;
      custMap[emailKey].spent += (o.total || 0);
      if (new Date(o.placedAt) > new Date(custMap[emailKey].lastOrder)) {
        custMap[emailKey].lastOrder = o.placedAt;
      }
    });
    return Object.values(custMap);
  }, [orders]);

  // Repeat customer rate
  const repeatCustomerRate = useMemo(() => {
    if (derivedCustomers.length === 0) return 0;
    const repeatCount = derivedCustomers.filter(c => c.orders > 1).length;
    return Math.round((repeatCount / derivedCustomers.length) * 100);
  }, [derivedCustomers]);

  // Dynamic Top Selling Pops derived from real orders
  const derivedTopProducts = useMemo(() => {
    const map: Record<string, { id: string; name: string; orders: number; revenue: number; image: string }> = {};
    orders.filter(o => o.status !== 'Cancelled').forEach(o => {
      o.items.forEach(item => {
        const pId = item.product.id;
        if (!map[pId]) {
          map[pId] = {
            id: pId,
            name: item.product.name,
            orders: 0,
            revenue: 0,
            image: item.product.image
          };
        }
        map[pId].orders += item.quantity;
        map[pId].revenue += item.quantity * item.product.price;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  // Open Edit Product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({ ...prod });
    setProductModalOpen(true);
  };

  // Open Add Product
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      flavorCombination: '',
      tagline: '',
      description: '',
      cityInspiration: 'Delhi',
      price: 249,
      originalPrice: 299,
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=80',
      accentColor: '#7A0F29',
      bgColor: '#FFF7E8',
      inventoryCount: 50,
      lowStockThreshold: 15,
      category: 'Classic Fusion',
      isFeatured: false,
      isBestSeller: false,
      isAvailableForPreOrder: false,
      ingredients: ['Pure Mawa', 'Cardamom', 'Cacao'],
      nutrition: { calories: 220, protein: '6g', carbs: '28g', fat: '10g' },
      temperature: '-18°C',
      shelfLife: '6 Months (Frozen)',
      canArtworkDescription: 'Collectible Mithai Pop Aluminum Canister',
      pairingNotes: 'Enjoy chilled straight from the can.',
      tags: ['Fusion', 'Cryo-Pack']
    });
    setProductModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      sounds.playError();
      return;
    }

    if (editingProductId) {
      updateProduct(editingProductId, productForm);
    } else {
      addProduct(productForm as any);
    }

    setProductModalOpen(false);
  };

  // Open Stock Adjust Modal
  const handleOpenStockAdjust = (item: InventoryItem) => {
    setStockAdjustItem(item);
    setStockDelta(10);
    setStockReason('Restocking fresh batch');
    setStockModalOpen(true);
  };

  // Save Stock Adjust
  const handleSaveStockAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustItem) return;
    adjustStock(stockAdjustItem.productId, stockDelta, stockReason, currentUser?.fullName || 'Priya Varma');
    setStockModalOpen(false);
  };

  // Open Add Coupon Modal
  const handleOpenAddCoupon = () => {
    setEditingCouponCode(null);
    setCouponForm({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 400,
      maxDiscount: 150,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2024-12-31',
      usageLimit: 1000,
      usageCount: 0,
      isActive: true,
      description: ''
    });
    setCouponModalOpen(true);
  };

  // Save Coupon
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discountValue) return;

    if (editingCouponCode) {
      updateCoupon(editingCouponCode, couponForm);
    } else {
      addCoupon(couponForm);
    }
    setCouponModalOpen(false);
  };

  const analytics = getAnalytics();

  return (
    <div className="min-h-screen bg-stone-100 text-[#171316] flex flex-col justify-between font-sans">
      
      {/* ===================================================
          ADMIN TOP BAR
         =================================================== */}
      <header className="sticky top-0 z-30 bg-[#171316] text-[#FFF7E8] border-b border-stone-800 px-4 sm:px-6 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3">
            <div className="scale-90 brightness-110">
              <BrandLogo />
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7A0F29] text-[#F2C76E] text-[10px] font-black uppercase tracking-wider border border-[#7A0F29]/60">
              <ShieldCheck className="w-3 h-3 text-[#F2C76E]" />
              Admin Portal
            </span>
          </div>

          {/* Global Search */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search orders, SKU, customers, pre-orders..."
                className="w-full pl-9 pr-4 py-2 bg-stone-900/90 border border-stone-700/80 rounded-xl text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#F2C76E]"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Popup Results */}
            {searchFocused && globalSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white text-[#171316] rounded-2xl shadow-2xl border border-stone-200 p-3 z-50 animate-in fade-in space-y-3">
                {globalSearchResults.orders.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Orders</span>
                    {globalSearchResults.orders.map(o => (
                      <div
                        key={o.orderId}
                        onClick={() => {
                          setSelectedAdminOrder(o);
                          setActiveAdminTab('orders');
                        }}
                        className="p-2 hover:bg-stone-50 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-[#7A0F29]">#{o.orderId} - {o.customerName}</span>
                        <span className="text-stone-500 font-medium">₹{o.total} ({o.status})</span>
                      </div>
                    ))}
                  </div>
                )}

                {globalSearchResults.products.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Products</span>
                    {globalSearchResults.products.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          handleOpenEditProduct(p);
                          setActiveAdminTab('products');
                        }}
                        className="p-2 hover:bg-stone-50 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-bold">{p.name} ({p.sku})</span>
                        <span className="text-stone-500 font-medium">₹{p.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {globalSearchResults.preOrders.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Pre-Orders</span>
                    {globalSearchResults.preOrders.map(po => (
                      <div
                        key={po.id}
                        onClick={() => {
                          setSelectedPreOrder(po);
                          setActiveAdminTab('preorders');
                        }}
                        className="p-2 hover:bg-stone-50 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-amber-800">#{po.orderNumber} - {po.product.name}</span>
                        <span className="text-stone-500 font-medium">{po.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* View Storefront CTA */}
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentView('shop');
                window.location.hash = '#';
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 relative transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadAdminNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F2C76E] text-[#7A0F29] text-[10px] font-black flex items-center justify-center">
                    {unreadAdminNotifs}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-[#171316] rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <h4 className="text-xs font-black uppercase text-stone-800">Admin Alerts ({unreadAdminNotifs})</h4>
                    <button
                      onClick={() => markAllNotificationsRead('admin')}
                      className="text-[11px] font-bold text-[#7A0F29] hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {notifications.filter(n => n.target === 'admin' || n.target === 'all').map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                          n.read ? 'bg-stone-50' : 'bg-amber-50 border border-amber-200/60'
                        }`}
                      >
                        <p className="font-bold text-[#171316]">{n.title}</p>
                        <p className="text-[11px] text-stone-600 mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-800">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                alt={currentUser?.fullName}
                className="w-7 h-7 rounded-full object-cover border border-amber-400"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-white leading-tight">{currentUser?.fullName || 'Priya Varma'}</p>
                <p className="text-[10px] text-stone-400">Head of Operations</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              title="Log Out"
              className="p-2 rounded-xl text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      {/* ===================================================
          ADMIN MAIN BODY (SIDEBAR + CONTENT)
         =================================================== */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-6">
        
        {/* Mobile Tabs Scrollable Navigation Bar (visible on < lg screens) */}
        <div className="lg:hidden w-full overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max p-1.5 bg-white border border-stone-200 rounded-2xl shadow-xs">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount.toString() : undefined },
              { id: 'preorders', label: 'Pre-Orders', icon: Sparkles, count: preOrders.length },
              { id: 'products', label: 'Products', icon: Package, count: products.length },
              { id: 'inventory', label: 'Inventory', icon: Layers, alert: lowStockCount > 0 ? `${lowStockCount} Low` : undefined },
              { id: 'customers', label: 'Customers', icon: Users, count: derivedCustomers.length },
              { id: 'coupons', label: 'Coupons', icon: Tag, count: coupons.length },
              { id: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
              { id: 'gifts', label: 'Gift Orders', icon: Gift, count: giftOrders.length },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'notifications', label: 'Alerts', icon: Bell, count: unreadAdminNotifs },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'activity', label: 'Activity Log', icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveAdminTab(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#7A0F29] text-[#FFF7E8] shadow-sm'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-[#7A0F29]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F2C76E]' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                  {tab.alert ? (
                    <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black bg-red-100 text-red-700">
                      {tab.alert}
                    </span>
                  ) : tab.badge ? (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#F2C76E] text-[#7A0F29]">
                      {tab.badge}
                    </span>
                  ) : tab.count !== undefined && tab.count > 0 ? (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}`}>
                      {tab.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Left Sidebar Menu (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1 space-y-2">
          
          <div className="bg-white border border-stone-200/90 rounded-2xl p-2.5 shadow-xs space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount.toString() : undefined },
              { id: 'preorders', label: 'Pre-Orders', icon: Sparkles, count: preOrders.length },
              { id: 'products', label: 'Products', icon: Package, count: products.length },
              { id: 'inventory', label: 'Inventory', icon: Layers, alert: lowStockCount > 0 ? `${lowStockCount} Low` : undefined },
              { id: 'customers', label: 'Customers', icon: Users, count: derivedCustomers.length },
              { id: 'coupons', label: 'Coupons', icon: Tag, count: coupons.length },
              { id: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
              { id: 'gifts', label: 'Gift Orders', icon: Gift, count: giftOrders.length },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'notifications', label: 'Alerts', icon: Bell, count: unreadAdminNotifs },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'activity', label: 'Activity Log', icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveAdminTab(tab.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#7A0F29] text-[#FFF7E8] shadow-sm'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-[#7A0F29]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F2C76E]' : 'text-stone-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>

                  {tab.alert && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-red-100 text-red-700">
                      {tab.alert}
                    </span>
                  )}

                  {tab.badge && !tab.alert && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-[#F2C76E] text-[#7A0F29]">
                      {tab.badge}
                    </span>
                  )}

                  {tab.count !== undefined && !tab.badge && !tab.alert && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-400'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick System Status Card */}
          <div className="p-3.5 bg-white border border-stone-200 rounded-2xl text-[11px] space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between font-bold text-stone-700">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Store Engine
              </span>
              <span className="text-emerald-700">Active</span>
            </div>
            <p className="text-stone-400 leading-tight">
              Live database synchronized • Real-time order processing ready.
            </p>
          </div>

        </aside>

        {/* Right Content Panel */}
        <main className="w-full lg:col-span-4 space-y-6">

          {/* ===================================================
              MODULE 1: DASHBOARD OVERVIEW
             =================================================== */}
          {activeAdminTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black font-display text-[#171316]">
                    Store Overview
                  </h1>
                  <p className="text-xs text-stone-500">
                    Live operational metrics derived directly from storefront orders and inventory.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportDataToCSV('orders')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={handleOpenAddProduct}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A0F29] text-[#FFF7E8] text-xs font-bold hover:bg-[#52091B] shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Pop</span>
                  </button>
                </div>
              </div>

              {/* Key Metrics Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                
                {/* Total Store Revenue */}
                <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Gross Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black font-display text-[#7A0F29] mt-1.5">
                    ₹{totalRevenue.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-stone-500 font-medium mt-1 block">
                    Today: ₹{todayRevenue.toLocaleString()}
                  </span>
                </div>

                {/* Total Orders */}
                <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#7A0F29]" />
                  </div>
                  <p className="text-2xl font-black font-display text-[#171316] mt-1.5">
                    {totalOrdersCount}
                  </p>
                  <span className="text-[10px] text-stone-500 font-medium mt-1 block">
                    AOV: ₹{aov}
                  </span>
                </div>

                {/* Pending Kitchen Orders */}
                <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Pending Orders</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-black font-display text-amber-900 mt-1.5">
                    {pendingOrdersCount}
                  </p>
                  <span className="text-[10px] text-amber-700 font-bold mt-1 block">
                    {pendingOrdersCount > 0 ? 'Requires fulfillment' : 'All clear'}
                  </span>
                </div>

                {/* Active Pre-Orders */}
                <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Active Pre-Orders</span>
                    <Sparkles className="w-4 h-4 text-[#F2C76E]" />
                  </div>
                  <p className="text-2xl font-black font-display text-[#7A0F29] mt-1.5">
                    {preOrders.length}
                  </p>
                  <span className="text-[10px] text-stone-500 font-medium mt-1 block">
                    {preOrders.length > 0 ? 'In waitlist queue' : 'No pre-orders'}
                  </span>
                </div>

              </div>

              {/* Row 2 Metrics: Low Stock, Total Customers, Refund Requests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                <div className={`p-4 rounded-2xl border ${lowStockCount > 0 ? 'bg-red-50/70 border-red-200 text-red-900' : 'bg-white border-stone-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Low Stock Alerts</span>
                    <AlertTriangle className={`w-4 h-4 ${lowStockCount > 0 ? 'text-red-600' : 'text-stone-400'}`} />
                  </div>
                  <p className="text-2xl font-black font-display mt-1">
                    {lowStockCount}
                  </p>
                  <button
                    onClick={() => setActiveAdminTab('inventory')}
                    className="text-[11px] font-bold text-stone-700 hover:text-[#7A0F29] hover:underline mt-1 block cursor-pointer"
                  >
                    View Inventory →
                  </button>
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Customer Accounts</span>
                    <Users className="w-4 h-4 text-stone-600" />
                  </div>
                  <p className="text-2xl font-black font-display text-[#171316] mt-1">
                    {derivedCustomers.length}
                  </p>
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    {repeatCustomerRate}% Repeat customer rate
                  </span>
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cancelled / Returns</span>
                    <RefreshCw className="w-4 h-4 text-stone-400" />
                  </div>
                  <p className="text-2xl font-black font-display text-stone-800 mt-1">
                    {refundRequestsCount}
                  </p>
                  <span className="text-[10px] text-stone-500 font-medium mt-1 block">
                    {refundRequestsCount === 0 ? 'Zero cancellations recorded' : `${refundRequestsCount} cancelled orders`}
                  </span>
                </div>

              </div>

              {/* Two Column Grid: Recent Orders + Top Selling Pops */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Orders (2 Cols) */}
                <div className="lg:col-span-2 bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="text-sm font-black font-display text-[#171316]">Recent Orders</h3>
                    <button
                      onClick={() => setActiveAdminTab('orders')}
                      className="text-xs font-bold text-[#7A0F29] hover:underline cursor-pointer"
                    >
                      View All Orders ({orders.length}) →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-stone-400 space-y-2">
                      <ShoppingBag className="w-8 h-8 mx-auto text-stone-300 stroke-[1.5]" />
                      <p className="text-xs font-medium">No orders have been placed yet.</p>
                      <p className="text-[11px] text-stone-400">Orders placed on the storefront will appear here instantly.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-stone-100 text-[10px] font-bold text-stone-400 uppercase">
                            <th className="pb-2">Order ID</th>
                            <th className="pb-2">Customer</th>
                            <th className="pb-2">Amount</th>
                            <th className="pb-2">Status</th>
                            <th className="pb-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {orders.slice(0, 5).map(o => (
                            <tr key={o.orderId} className="hover:bg-stone-50 transition-colors">
                              <td className="py-3 font-bold text-[#7A0F29]">#{o.orderId}</td>
                              <td className="py-3 font-medium text-stone-700">{o.customerName || 'Customer'}</td>
                              <td className="py-3 font-bold">₹{o.total}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  o.status === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : o.status === 'Cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedAdminOrder(o);
                                    setActiveAdminTab('orders');
                                  }}
                                  className="text-stone-400 hover:text-[#7A0F29] font-bold p-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Top Selling Pops (1 Col) */}
                <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-4">
                  <h3 className="text-sm font-black font-display text-[#171316]">Top Selling Pops</h3>
                  
                  {derivedTopProducts.length === 0 ? (
                    <div className="py-12 text-center text-stone-400 space-y-2">
                      <Sparkles className="w-8 h-8 mx-auto text-stone-300 stroke-[1.5]" />
                      <p className="text-xs font-medium">No sales recorded yet.</p>
                      <p className="text-[11px] text-stone-400">Flavor popularity rankings will dynamically populate from completed purchases.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {derivedTopProducts.slice(0, 4).map((p, idx) => (
                        <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-[#7A0F29] text-[#FFF7E8] font-black text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <img src={p.image} alt={p.name} className="w-8 h-8 object-contain" />
                            <div>
                              <p className="font-bold text-[#171316] truncate max-w-[100px]">{p.name}</p>
                              <p className="text-[10px] text-stone-500">{p.orders} unit(s) sold</p>
                            </div>
                          </div>
                          <span className="font-bold text-[#7A0F29]">₹{p.revenue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ===================================================
              MODULE 2: ORDERS MANAGEMENT
             =================================================== */}
          {activeAdminTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black font-display text-[#171316]">
                    Orders Management
                  </h2>
                  <p className="text-xs text-stone-500">
                    Track real-time orders, dispatch statuses, refunds, and internal notes.
                  </p>
                </div>

                <button
                  onClick={() => exportDataToCSV('orders')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Orders CSV</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID or Customer..."
                    className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {(['all', 'Preparing', 'Packed', 'Delivered', 'Cancelled'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        orderStatusFilter === st
                          ? 'bg-[#7A0F29] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st === 'all' ? 'All Orders' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-400 uppercase">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {(() => {
                        const filtered = orders.filter(o => {
                          const matchesSearch = o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
                            (o.customerName && o.customerName.toLowerCase().includes(orderSearch.toLowerCase()));
                          const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
                          return matchesSearch && matchesStatus;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={8} className="py-16 text-center text-stone-400 space-y-2">
                                <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 stroke-[1.5]" />
                                <p className="text-sm font-bold text-stone-600">
                                  {orders.length === 0 ? 'No orders yet.' : 'No orders matching this filter.'}
                                </p>
                                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                                  {orders.length === 0
                                    ? 'When a customer places an order on the storefront, it will appear here immediately.'
                                    : 'Try changing your search query or status filter above.'}
                                </p>
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map(o => (
                          <tr key={o.orderId} className="hover:bg-stone-50/80 transition-colors">
                            <td className="p-4 font-black text-[#7A0F29]">#{o.orderId}</td>
                            <td className="p-4">
                              <p className="font-bold text-[#171316]">{o.customerName || 'Customer'}</p>
                              <p className="text-[10px] text-stone-400">{o.customerPhone}</p>
                            </td>
                            <td className="p-4 text-stone-500">{o.placedAt.split('T')[0]}</td>
                            <td className="p-4">
                              <span className="font-medium text-stone-700">
                                {o.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                              </span>
                            </td>
                            <td className="p-4 font-black text-[#171316]">₹{o.total}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold text-[10px]">
                                {o.paymentMethod.split(' ')[0]}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                o.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : o.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setSelectedAdminOrder(o)}
                                className="px-3 py-1.5 bg-stone-100 hover:bg-[#7A0F29] hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================
              MODULE 3: PRE-ORDERS MANAGEMENT
             =================================================== */}
          {activeAdminTab === 'preorders' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black font-display text-[#171316]">
                    Pre-Orders & City Drops
                  </h2>
                  <p className="text-xs text-stone-500">
                    Manage reserved small-batch drops, dispatch schedules, and customer notifications.
                  </p>
                </div>

                <button
                  onClick={() => exportDataToCSV('preorders')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Pre-Orders CSV</span>
                </button>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
                {preOrders.length === 0 ? (
                  <div className="py-16 text-center text-stone-400 space-y-2">
                    <Sparkles className="w-10 h-10 mx-auto text-stone-300 stroke-[1.5]" />
                    <p className="text-sm font-bold text-stone-600">No Pre-Orders Yet</p>
                    <p className="text-xs text-stone-400 max-w-sm mx-auto">
                      Pre-orders for limited-edition festival boxes or upcoming city drops will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-400 uppercase">
                        <tr>
                          <th className="p-4">Pre-Order #</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Product Edition</th>
                          <th className="p-4">Qty</th>
                          <th className="p-4">Launch Date</th>
                          <th className="p-4">Dispatch Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {preOrders.map(po => (
                          <tr key={po.id} className="hover:bg-stone-50 transition-colors">
                            <td className="p-4 font-black text-amber-800">#{po.orderNumber}</td>
                            <td className="p-4 font-bold text-stone-800">{po.customerName}</td>
                            <td className="p-4 font-semibold text-[#171316]">{po.product.name}</td>
                            <td className="p-4">{po.quantity}</td>
                            <td className="p-4 text-stone-500">{po.expectedLaunchDate}</td>
                            <td className="p-4 font-bold text-[#7A0F29]">{po.expectedDispatchDate}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                                {po.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedPreOrder(po);
                                  setEditDispatchDate(po.expectedDispatchDate);
                                }}
                                className="px-3 py-1.5 bg-stone-100 hover:bg-[#7A0F29] hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================
              MODULE 4: PRODUCT CATALOG MANAGEMENT
             =================================================== */}
          {activeAdminTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black font-display text-[#171316]">
                    Product Management ({products.length})
                  </h2>
                  <p className="text-xs text-stone-500">
                    Create, edit, price, and catalog all Mithai Pop variations and can artworks.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A0F29] text-[#FFF7E8] text-xs font-bold hover:bg-[#52091B] shadow-xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(prod => (
                  <div
                    key={prod.id}
                    className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold uppercase">
                          {prod.sku || 'SKU-MP'}
                        </span>
                        {prod.isBestSeller && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                            Best Seller
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <img src={prod.image} alt={prod.name} className="w-16 h-16 object-contain" />
                        <div>
                          <h4 className="text-xs font-bold text-[#171316]">{prod.name}</h4>
                          <p className="text-[11px] text-stone-500">{prod.flavorCombination}</p>
                          <p className="text-xs font-black text-[#7A0F29] mt-1">₹{prod.price}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-stone-500">Stock: <strong>{prod.inventoryCount || 45}</strong></span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 text-stone-500 hover:text-[#7A0F29] rounded-lg hover:bg-stone-50"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ===================================================
              MODULE 5: INVENTORY MANAGEMENT
             =================================================== */}
          {activeAdminTab === 'inventory' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black font-display text-[#171316]">
                    Inventory Control
                  </h2>
                  <p className="text-xs text-stone-500">
                    Live stock balances across freeze vaults, reserved orders, and auto-alerts.
                  </p>
                </div>

                <button
                  onClick={() => exportDataToCSV('inventory')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Inventory CSV</span>
                </button>
              </div>

              {/* Low Stock Highlight Alert */}
              {lowStockCount > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-red-800 font-bold">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{lowStockCount} product(s) have breached low stock thresholds. Restock recommended.</span>
                  </div>
                </div>
              )}

              {/* Inventory Table */}
              <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-400 uppercase">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">Total Stock</th>
                        <th className="p-4">Reserved</th>
                        <th className="p-4">Available</th>
                        <th className="p-4">Threshold</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Quick Adjust</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {inventory.map(inv => (
                        <tr key={inv.productId} className="hover:bg-stone-50 transition-colors">
                          <td className="p-4 font-bold text-[#171316] flex items-center gap-2">
                            <img src={inv.image} alt={inv.productName} className="w-8 h-8 object-contain" />
                            <span>{inv.productName}</span>
                          </td>
                          <td className="p-4 font-mono text-stone-500">{inv.sku}</td>
                          <td className="p-4 font-bold">{inv.currentStock}</td>
                          <td className="p-4 text-stone-500">{inv.reservedStock}</td>
                          <td className="p-4 font-black text-[#7A0F29]">{inv.availableStock}</td>
                          <td className="p-4 text-stone-500">{inv.lowStockThreshold}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              inv.status === 'In Stock'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.status === 'Low Stock'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleOpenStockAdjust(inv)}
                              className="px-3 py-1.5 bg-[#7A0F29] text-[#FFF7E8] hover:bg-[#52091B] rounded-xl text-xs font-bold transition-all shadow-xs"
                            >
                              Adjust Stock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================
              MODULE 6: CUSTOMER MANAGEMENT
             =================================================== */}
          {activeAdminTab === 'customers' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black font-display text-[#171316]">
                    Customer Directory
                  </h2>
                  <p className="text-xs text-stone-500">
                    Profiles, order histories, addresses, and customer care notes.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
                {derivedCustomers.length === 0 ? (
                  <div className="py-16 text-center text-stone-400 space-y-2">
                    <Users className="w-10 h-10 mx-auto text-stone-300 stroke-[1.5]" />
                    <p className="text-sm font-bold text-stone-600">No Customer Accounts Yet</p>
                    <p className="text-xs text-stone-400 max-w-sm mx-auto">
                      Customer profiles, contact numbers, order histories, and lifetime spend records will automatically generate as visitors place orders.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-400 uppercase">
                        <tr>
                          <th className="p-4">Customer Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Orders</th>
                          <th className="p-4">Total Spent</th>
                          <th className="p-4">Last Active</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {derivedCustomers.map(c => (
                          <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                            <td className="p-4 font-bold text-[#171316]">{c.name}</td>
                            <td className="p-4 text-stone-500 font-mono">{c.email}</td>
                            <td className="p-4 text-stone-500 font-mono">{c.phone}</td>
                            <td className="p-4 font-bold">{c.orders}</td>
                            <td className="p-4 font-black text-[#7A0F29]">₹{c.spent.toLocaleString()}</td>
                            <td className="p-4 text-stone-400 text-[11px]">{new Date(c.lastOrder).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  sounds.playClick();
                                  setOrderSearch(c.email !== 'N/A' ? c.email : c.name);
                                  setActiveAdminTab('orders');
                                }}
                                className="px-3 py-1.5 bg-stone-100 hover:bg-[#7A0F29] hover:text-[#FFF7E8] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                View Orders
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================
              MODULE 7: COUPON MANAGEMENT
             =================================================== */}
          {activeAdminTab === 'coupons' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black font-display text-[#171316]">
                    Promotions & Discount Codes
                  </h2>
                  <p className="text-xs text-stone-500">
                    Create promo codes, minimum cart rules, and track campaign redemptions.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddCoupon}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A0F29] text-[#FFF7E8] text-xs font-bold hover:bg-[#52091B] shadow-xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Promo Code</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coupons.map(cp => (
                  <div key={cp.code} className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#7A0F29]" />
                        <span className="font-black text-sm tracking-wider font-mono text-[#7A0F29]">{cp.code}</span>
                      </div>
                      <button
                        onClick={() => toggleCouponStatus(cp.code)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cp.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {cp.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 font-medium">{cp.description}</p>

                    <div className="p-3 bg-stone-50 rounded-2xl text-[11px] space-y-1 text-stone-500">
                      <div className="flex justify-between">
                        <span>Discount Value:</span>
                        <strong className="text-stone-800">{cp.discountType === 'percentage' ? `${cp.discountValue}% OFF` : `₹${cp.discountValue} OFF`}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Min Order:</span>
                        <span>₹{cp.minOrderValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Redemptions:</span>
                        <span>{cp.usageCount} / {cp.usageLimit}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                      <button
                        onClick={() => deleteCoupon(cp.code)}
                        className="text-xs text-red-600 hover:underline font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================
              MODULE 8: REVIEWS MODERATION
             =================================================== */}
          {activeAdminTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black font-display text-[#171316]">
                  Customer Reviews Moderation
                </h2>
                <p className="text-xs text-stone-500">
                  Approve, feature, or hide verified buyer reviews and upcycling stories.
                </p>
              </div>

              {reviews.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-2 shadow-xs">
                  <Star className="w-10 h-10 mx-auto text-stone-300 stroke-[1.5]" />
                  <p className="text-sm font-bold text-stone-600">No Reviews Submitted Yet</p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Customer reviews and upcycling stories submitted after delivery will appear here for moderation.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map(rev => (
                    <div key={rev.id} className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#171316]">{rev.author} ({rev.city})</span>
                          <span className="text-[10px] text-amber-500 font-bold">★ {rev.rating}/5</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-bold">{rev.favoritePop}</span>
                        </div>
                        <p className="text-xs text-stone-600 italic">"{rev.comment}"</p>
                        {rev.upcycledUse && (
                          <p className="text-[11px] text-[#7A0F29] font-medium">Upcycling: {rev.upcycledUse}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'hidden')}
                          className="px-3 py-1.5 bg-stone-100 text-stone-600 hover:bg-stone-200 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Hide
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================================================
              MODULE 9: GIFT ORDERS
             =================================================== */}
          {activeAdminTab === 'gifts' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black font-display text-[#171316]">
                  Gift Box Packaging Tracker
                </h2>
                <p className="text-xs text-stone-500">
                  Custom gift cards and personalized notes for birthday & festival boxes.
                </p>
              </div>

              {giftOrders.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-2 shadow-xs">
                  <Gift className="w-10 h-10 mx-auto text-stone-300 stroke-[1.5]" />
                  <p className="text-sm font-bold text-stone-600">No Gift Orders Yet</p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Orders with custom greeting messages and gift packaging requests will be queued here for staff preparation.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {giftOrders.map(g => (
                    <div key={g.id} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <span className="text-xs font-bold text-[#7A0F29]">Gift Order #{g.orderId} (From: {g.senderName})</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">{g.status}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-stone-400 font-bold uppercase text-[10px]">Deliver To</p>
                          <p className="font-bold text-[#171316]">{g.recipientName} ({g.recipientPhone})</p>
                          <p className="text-stone-500 mt-0.5">{g.recipientAddress}</p>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60">
                          <p className="text-amber-900 font-bold uppercase text-[10px]">Custom Greeting Card Text</p>
                          <p className="italic text-stone-700 mt-1 font-medium">"{g.giftMessage}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================================================
              MODULE 10: SALES ANALYTICS
             =================================================== */}
          {activeAdminTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black font-display text-[#171316]">
                    Sales Analytics & Performance
                  </h2>
                  <p className="text-xs text-stone-500">
                    Real-time revenue metrics, average order value, and flavor popularity trends.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-white border border-stone-200 rounded-xl shadow-xs">
                  {(['today', '7d', '30d', '3m'] as const).map(tf => (
                    <button
                      key={tf}
                      onClick={() => setAnalyticsTimeframe(tf)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                        analyticsTimeframe === tf
                          ? 'bg-[#7A0F29] text-white'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Gross Revenue</span>
                  <p className="text-2xl font-black font-display text-[#7A0F29] mt-1">₹{analytics.revenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Total Orders</span>
                  <p className="text-2xl font-black font-display text-[#171316] mt-1">{analytics.orders}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Average Order Value</span>
                  <p className="text-2xl font-black font-display text-[#171316] mt-1">₹{analytics.aov}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Repeat Customer Rate</span>
                  <p className="text-2xl font-black font-display text-emerald-700 mt-1">{analytics.repeatRate}%</p>
                </div>
              </div>

              {/* Visual SVG Chart Card */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black font-display text-[#171316]">Revenue Growth Timeline ({analyticsTimeframe.toUpperCase()})</h3>
                
                {/* Visual SVG / Bar Representation */}
                <div className="pt-4 flex items-end justify-between gap-2 h-44 border-b border-stone-100 pb-2">
                  {analytics.timeline.map((point, idx) => {
                    const maxRev = Math.max(1, ...analytics.timeline.map(p => p.revenue));
                    const heightPercent = point.revenue > 0 ? Math.max(15, Math.round((point.revenue / maxRev) * 100)) : 6;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="text-[10px] font-bold text-[#7A0F29] opacity-0 group-hover:opacity-100 transition-opacity">
                          ₹{point.revenue}
                        </div>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[48px] rounded-t-xl transition-all ${
                            point.revenue > 0
                              ? 'bg-gradient-to-t from-[#7A0F29] to-[#F2C76E] group-hover:brightness-110'
                              : 'bg-stone-100'
                          }`}
                        />
                        <span className="text-[10px] font-bold text-stone-400">{point.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              MODULE 11: NOTIFICATIONS & ALERTS
             =================================================== */}
          {activeAdminTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black font-display text-[#171316]">
                    Admin System Alerts & Notifications
                  </h2>
                  <p className="text-xs text-stone-500">
                    Real-time operational alerts for new checkouts, stock threshold triggers, and cancellations.
                  </p>
                </div>

                {notifications.some(n => n.target === 'admin' || n.target === 'all') && (
                  <button
                    onClick={() => markAllNotificationsRead('admin')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mark All Read</span>
                  </button>
                )}
              </div>

              {notifications.filter(n => n.target === 'admin' || n.target === 'all').length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-2 shadow-xs">
                  <Bell className="w-10 h-10 mx-auto text-stone-300 stroke-[1.5]" />
                  <p className="text-sm font-bold text-stone-600">No Alerts Recorded</p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Live system alerts will generate here automatically when customers place orders or trigger stock thresholds.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.filter(n => n.target === 'admin' || n.target === 'all').map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                        n.read
                          ? 'bg-white border-stone-200/80 shadow-xs'
                          : 'bg-amber-50/70 border-amber-200 shadow-xs'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${n.read ? 'bg-stone-300' : 'bg-[#7A0F29]'}`} />
                          <h4 className="text-xs font-bold text-[#171316]">{n.title}</h4>
                        </div>
                        <p className="text-xs text-stone-600 pl-4">{n.message}</p>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================================================
              MODULE 12: SETTINGS
             =================================================== */}
          {activeAdminTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black font-display text-[#171316]">
                  Store Configurations & Settings
                </h2>
                <p className="text-xs text-stone-500">
                  Delivery tariffs, tax percentages, payment gateway toggles, and staff permissions.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateSettings(settingsForm);
                  sounds.playCelebration();
                }}
                className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-6"
              >
                <div>
                  <h3 className="text-sm font-black font-display text-[#171316] mb-3">Store Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={settingsForm.storeName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={settingsForm.contactEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <h3 className="text-sm font-black font-display text-[#171316] mb-3">Delivery & Tariffs</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Standard Delivery Fee (₹)</label>
                      <input
                        type="number"
                        value={settingsForm.standardDeliveryFee}
                        onChange={(e) => setSettingsForm({ ...settingsForm, standardDeliveryFee: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Free Delivery Above (₹)</label>
                      <input
                        type="number"
                        value={settingsForm.freeDeliveryThreshold}
                        onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">GST Tax Rate (%)</label>
                      <input
                        type="number"
                        value={settingsForm.taxRatePercent}
                        onChange={(e) => setSettingsForm({ ...settingsForm, taxRatePercent: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#7A0F29] text-[#FFF7E8] font-bold text-xs rounded-xl shadow-md hover:bg-[#52091B] cursor-pointer"
                  >
                    Save Store Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===================================================
              MODULE 13: ACTIVITY LOG
             =================================================== */}
          {activeAdminTab === 'activity' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black font-display text-[#171316]">
                  Administrative Audit Trail
                </h2>
                <p className="text-xs text-stone-500">
                  Comprehensive tamper-proof log of price edits, status movements, and staff actions.
                </p>
              </div>

              {activityLogs.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-2 shadow-xs">
                  <History className="w-10 h-10 mx-auto text-stone-300 stroke-[1.5]" />
                  <p className="text-sm font-bold text-stone-600">Audit Trail Clean</p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Administrative actions such as order status updates, price changes, inventory adjustments, and promo additions will log here automatically.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-3">
                  {activityLogs.map(log => (
                    <div key={log.id} className="p-3 bg-stone-50 rounded-xl flex items-start justify-between gap-3 text-xs">
                      <div>
                        <p className="font-bold text-[#171316]">{log.action}</p>
                        <p className="text-stone-500 text-[11px] mt-0.5">{log.details}</p>
                        <span className="text-[10px] text-[#7A0F29] font-bold">{log.adminName} ({log.adminEmail})</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>

      </div>

      {/* ===================================================
          MODAL: ORDER DETAIL & STATUS UPDATE
         =================================================== */}
      {selectedAdminOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                  {selectedAdminOrder.status}
                </span>
                <h3 className="text-lg font-black font-display text-[#171316] mt-1">
                  Manage Order #{selectedAdminOrder.orderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAdminOrder(null)}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Buttons */}
            <div>
              <span className="text-xs font-bold text-stone-700 block mb-2">Advance Order Stage</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Preparing', 'Packed', 'Out for Delivery', 'Delivered'] as OrderStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      updateOrderStatus(selectedAdminOrder.orderId, st, currentUser?.fullName || 'Priya Varma');
                      setSelectedAdminOrder({ ...selectedAdminOrder, status: st });
                    }}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedAdminOrder.status === st
                        ? 'bg-[#7A0F29] text-[#FFF7E8] border-[#7A0F29]'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer & Address details */}
            <div className="p-4 bg-stone-50 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-400 font-bold uppercase text-[10px]">Customer Details</span>
                <p className="font-bold text-[#171316] mt-0.5">{selectedAdminOrder.customerName || 'Customer'}</p>
                <p className="text-stone-500">{selectedAdminOrder.customerPhone}</p>
                <p className="text-stone-500">{selectedAdminOrder.customerEmail}</p>
              </div>
              <div>
                <span className="text-stone-400 font-bold uppercase text-[10px]">Delivery Address</span>
                <p className="text-stone-600 mt-0.5 leading-relaxed">
                  {selectedAdminOrder.deliveryAddress.flat}, {selectedAdminOrder.deliveryAddress.street}
                  <br />
                  {selectedAdminOrder.deliveryAddress.city} - {selectedAdminOrder.deliveryAddress.pincode}
                </p>
              </div>
            </div>

            {/* Internal notes */}
            <div>
              <span className="text-xs font-bold text-stone-700 block mb-2">Staff Internal Notes</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOrderNote}
                  onChange={(e) => setNewOrderNote(e.target.value)}
                  placeholder="e.g. VIP sample added or fragile thermal wrap..."
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newOrderNote.trim()) return;
                    addInternalOrderNote(selectedAdminOrder.orderId, newOrderNote, currentUser?.fullName || 'Priya Varma');
                    setNewOrderNote('');
                  }}
                  className="px-4 py-2 bg-[#7A0F29] text-white rounded-xl text-xs font-bold"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Danger actions: Cancel & Refund */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => {
                  refundOrder(selectedAdminOrder.orderId, selectedAdminOrder.total, 'Customer Requested', currentUser?.fullName || 'Priya Varma');
                  setSelectedAdminOrder(null);
                }}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Issue Full Refund (₹{selectedAdminOrder.total})
              </button>

              <button
                onClick={() => setSelectedAdminOrder(null)}
                className="px-5 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          MODAL: PRODUCT ADD / EDIT
         =================================================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black font-display text-[#171316]">
                {editingProductId ? 'Edit Mithai Pop' : 'Add New Mithai Pop'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="p-1 text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Flavor Remix Combination</label>
                <input
                  type="text"
                  value={productForm.flavorCombination}
                  onChange={(e) => setProductForm({ ...productForm, flavorCombination: e.target.value })}
                  placeholder="e.g. Saffron Rabri + Dark Cacao"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={productForm.inventoryCount}
                    onChange={(e) => setProductForm({ ...productForm, inventoryCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Low Stock Warning</label>
                  <input
                    type="number"
                    value={productForm.lowStockThreshold}
                    onChange={(e) => setProductForm({ ...productForm, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 font-bold text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#7A0F29] text-[#FFF7E8] font-bold rounded-xl shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================
          MODAL: INVENTORY STOCK ADJUST
         =================================================== */}
      {stockModalOpen && stockAdjustItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black font-display text-[#171316]">
                Adjust Stock: {stockAdjustItem.productName}
              </h3>
              <button onClick={() => setStockModalOpen(false)} className="p-1 text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStockAdjust} className="space-y-3.5">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Stock Change (+ / -)</label>
                <input
                  type="number"
                  value={stockDelta}
                  onChange={(e) => setStockDelta(Number(e.target.value))}
                  required
                  placeholder="e.g. 20 or -5"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono text-sm"
                />
                <p className="text-[10px] text-stone-400 mt-1">
                  Current: {stockAdjustItem.currentStock} → Result: {Math.max(0, stockAdjustItem.currentStock + stockDelta)}
                </p>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Reason for Adjustment</label>
                <select
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="Kitchen Fresh Restock">Kitchen Fresh Restock</option>
                  <option value="Spoilage / Quality Control">Spoilage / Quality Control</option>
                  <option value="Warehouse Audit Correction">Warehouse Audit Correction</option>
                  <option value="VIP Tasting Sample Allocation">VIP Tasting Sample Allocation</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setStockModalOpen(false)}
                  className="px-4 py-2 font-bold text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#7A0F29] text-[#FFF7E8] font-bold rounded-xl"
                >
                  Apply Stock Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-[#171316] py-3 text-center text-stone-500 text-[11px]">
        Mithai Pop Commerce Control Engine • Authenticated Staff Session • Version 2.4.0
      </footer>

    </div>
  );
};
