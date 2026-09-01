import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStoreData } from '../../context/StoreDataContext';
import { BrandLogo } from '../BrandLogo';
import { sounds } from '../../utils/audio';
import { 
  Search, 
  X, 
  ExternalLink, 
  Bell, 
  LogOut, 
  ShieldCheck, 
  Menu,
  User as UserIcon,
  Settings,
  ChevronDown
} from 'lucide-react';
import { OrderConfirmation, Product, PreOrder } from '../../types';

interface AdminHeaderProps {
  onOpenMobileNav: () => void;
  onSelectOrder: (order: OrderConfirmation) => void;
  onSelectProduct: (product: Product) => void;
  onSelectPreOrder: (preOrder: PreOrder) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileNav,
  onSelectOrder,
  onSelectProduct,
  onSelectPreOrder,
}) => {
  const { currentUser, logout, setCurrentView, setActiveAdminTab } = useAuth();
  const { 
    orders, 
    products, 
    preOrders, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useStoreData();

  const [globalSearch, setGlobalSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadAdminNotifs = useMemo(() => 
    notifications.filter(n => (n.target === 'admin' || n.target === 'all') && !n.read).length,
    [notifications]
  );

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

  return (
    <header className="sticky top-0 z-30 bg-[#171316] text-[#FFF7E8] border-b border-stone-800 px-4 sm:px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Mobile hamburger & Logo & Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
            title="Toggle Navigation Menu"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => setActiveAdminTab('dashboard')} 
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="scale-90 brightness-110">
              <BrandLogo />
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7A0F29] text-[#F2C76E] text-[10px] font-black uppercase tracking-wider border border-[#7A0F29]/60">
              <ShieldCheck className="w-3 h-3 text-[#F2C76E]" />
              Staff Portal
            </span>
          </div>
        </div>

        {/* Global Search Bar (Desktop & Tablet) */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              placeholder="Search orders, SKU, customers, pre-orders..."
              className="w-full pl-9 pr-8 py-2 bg-stone-900/90 border border-stone-700/80 rounded-xl text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#F2C76E] transition-all"
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

          {/* Live Search Results Popup */}
          {searchFocused && globalSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white text-[#171316] rounded-2xl shadow-2xl border border-stone-200 p-3 z-50 animate-in fade-in space-y-3">
              {globalSearchResults.orders.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">Orders</span>
                  {globalSearchResults.orders.map(o => (
                    <div
                      key={o.orderId}
                      onMouseDown={() => {
                        onSelectOrder(o);
                        setActiveAdminTab('orders');
                        setGlobalSearch('');
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
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">Products</span>
                  {globalSearchResults.products.map(p => (
                    <div
                      key={p.id}
                      onMouseDown={() => {
                        onSelectProduct(p);
                        setActiveAdminTab('products');
                        setGlobalSearch('');
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
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">Pre-Orders</span>
                  {globalSearchResults.preOrders.map(po => (
                    <div
                      key={po.id}
                      onMouseDown={() => {
                        onSelectPreOrder(po);
                        setActiveAdminTab('preorders');
                        setGlobalSearch('');
                      }}
                      className="p-2 hover:bg-stone-50 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-amber-800">#{po.orderNumber} - {po.product.name}</span>
                      <span className="text-stone-500 font-medium">{po.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {globalSearchResults.orders.length === 0 && 
               globalSearchResults.products.length === 0 && 
               globalSearchResults.preOrders.length === 0 && (
                <p className="text-xs text-stone-400 text-center py-2">No matching records found.</p>
              )}
            </div>
          )}
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Switch to Storefront Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentView('shop');
              window.location.hash = '#';
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            title="Open customer storefront"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 relative transition-colors cursor-pointer"
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAdminNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F2C76E] text-[#7A0F29] text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadAdminNotifs}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-[#171316] rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h4 className="text-xs font-black uppercase text-stone-800">Alerts ({unreadAdminNotifs} unread)</h4>
                  <button
                    onClick={() => markAllNotificationsRead('admin')}
                    className="text-[11px] font-bold text-[#7A0F29] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.filter(n => n.target === 'admin' || n.target === 'all').length === 0 ? (
                    <p className="text-xs text-stone-400 text-center py-4">No alerts right now.</p>
                  ) : (
                    notifications.filter(n => n.target === 'admin' || n.target === 'all').map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.type === 'order') setActiveAdminTab('orders');
                          if (n.type === 'stock') setActiveAdminTab('inventory');
                          if (n.type === 'preorder') setActiveAdminTab('preorders');
                          setNotifDropdownOpen(false);
                        }}
                        className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                          n.read ? 'bg-stone-50' : 'bg-amber-50 border border-amber-200/60'
                        }`}
                      >
                        <p className="font-bold text-[#171316]">{n.title}</p>
                        <p className="text-[11px] text-stone-600 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-stone-100 pt-2 text-center">
                  <button
                    onClick={() => {
                      setActiveAdminTab('notifications');
                      setNotifDropdownOpen(false);
                    }}
                    className="text-[11px] font-bold text-[#7A0F29] hover:underline cursor-pointer"
                  >
                    View All Notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 pl-2 border-l border-stone-800 hover:opacity-90 transition-opacity cursor-pointer text-left"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                alt={currentUser?.fullName || 'Staff'}
                className="w-7 h-7 rounded-full object-cover border border-[#F2C76E]"
              />
              <div className="hidden lg:block">
                <p className="text-xs font-bold text-white leading-tight">{currentUser?.fullName || 'Priya Varma'}</p>
                <p className="text-[10px] text-stone-400">{currentUser?.role?.replace('_', ' ') || 'Operations Staff'}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden lg:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-[#171316] rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 animate-in fade-in space-y-1">
                <div className="px-3 py-2 border-b border-stone-100">
                  <p className="text-xs font-bold text-[#171316]">{currentUser?.fullName || 'Priya Varma'}</p>
                  <p className="text-[10px] text-stone-500 font-mono">{currentUser?.email || 'admin123@mail.com'}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveAdminTab('profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 rounded-xl cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-stone-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setActiveAdminTab('settings');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 rounded-xl cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-stone-400" />
                  <span>Store Settings</span>
                </button>

                <div className="border-t border-stone-100 my-1" />

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
