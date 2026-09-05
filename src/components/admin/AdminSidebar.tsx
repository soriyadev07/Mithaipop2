import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStoreData } from '../../context/StoreDataContext';
import { sounds } from '../../utils/audio';
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Package,
  Layers,
  Users,
  CreditCard,
  Tag,
  Star,
  Gift,
  Truck,
  BarChart3,
  Bell,
  LifeBuoy,
  History,
  Settings,
  User,
  UserCheck,
  LogOut,
  X,
  ShieldCheck
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentUser, logout, activeAdminTab, setActiveAdminTab } = useAuth();
  const { 
    orders, 
    preOrders, 
    products, 
    inventory, 
    coupons, 
    reviews, 
    giftOrders, 
    supportTickets,
    notifications,
    waitlistEntries
  } = useStoreData();

  // Badge calculations
  const pendingOrdersCount = orders.filter(o => 
    o.status === 'Preparing' || o.status === 'Order Confirmed' || o.status === 'Pending' || o.status === 'Packed'
  ).length;

  const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;
  const unreadTicketsCount = supportTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const unreadAlertsCount = notifications.filter(n => (n.target === 'admin' || n.target === 'all') && !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined },
    { id: 'preorders', label: 'Pre-Orders', icon: Sparkles, count: preOrders.length },
    { id: 'waitlist', label: 'Waitlist', icon: UserCheck, count: waitlistEntries.length, badge: waitlistEntries.length > 0 ? `${waitlistEntries.length}` : undefined },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products', icon: Package, count: products.length },
    { id: 'inventory', label: 'Inventory', icon: Layers, alert: lowStockCount > 0 ? `${lowStockCount} Low` : undefined },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'coupons', label: 'Coupons', icon: Tag, count: coupons.length },
    { id: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
    { id: 'gifts', label: 'Gift Orders', icon: Gift, count: giftOrders.length },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : undefined },
    { id: 'support', label: 'Support Desk', icon: LifeBuoy, badge: unreadTicketsCount > 0 ? `${unreadTicketsCount}` : undefined },
    { id: 'activity', label: 'Activity Log', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Admin Profile', icon: User },
  ];

  const handleTabClick = (tabId: string) => {
    sounds.playClick();
    setActiveAdminTab(tabId);
    if (mobileOpen) {
      onCloseMobile();
    }
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-1">
        {navItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
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

              {tab.alert ? (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-red-100 text-red-700 animate-pulse">
                  {tab.alert}
                </span>
              ) : tab.badge ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-[#F2C76E] text-[#7A0F29]">
                  {tab.badge}
                </span>
              ) : tab.count !== undefined && tab.count > 0 ? (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-400'}`}>
                  {tab.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* System Status & Logout */}
      <div className="pt-4 mt-4 border-t border-stone-100 space-y-3">
        <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-2xl text-[11px] space-y-1">
          <div className="flex items-center justify-between font-bold text-stone-700">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Store Engine
            </span>
            <span className="text-emerald-700 font-bold">Online</span>
          </div>
          <p className="text-[10px] text-stone-400 leading-tight">
            Orders active • Cold-chain tracking synced
          </p>
        </div>

        <button
          onClick={() => {
            if (mobileOpen) onCloseMobile();
            logout();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (visible on lg screens) */}
      <aside className="hidden lg:block lg:col-span-1">
        <div className="sticky top-20 bg-white border border-stone-200/90 rounded-2xl p-2.5 shadow-xs max-h-[calc(100vh-6rem)] overflow-y-auto">
          {navContent}
        </div>
      </aside>

      {/* Mobile Slide-over Drawer (visible on < lg screens) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={onCloseMobile} 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
            
            {/* Drawer Header */}
            <div className="p-4 bg-[#171316] text-[#FFF7E8] flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="scale-75">
                  <BrandLogo />
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#7A0F29] text-[#F2C76E] text-[9px] font-black tracking-wider uppercase">
                  Staff Menu
                </span>
              </div>
              <button 
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Staff Info */}
            <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center gap-2.5">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'}
                alt={currentUser?.fullName || 'Staff'}
                className="w-8 h-8 rounded-full object-cover border border-[#F2C76E]"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#171316] truncate">{currentUser?.fullName || 'Priya Varma'}</p>
                <p className="text-[10px] text-stone-500 font-mono truncate">{currentUser?.email || 'admin123@mail.com'}</p>
              </div>
            </div>

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto p-3">
              {navContent}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
