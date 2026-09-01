import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStoreData } from '../../context/StoreDataContext';
import { useCart } from '../../context/CartContext';
import { BrandLogo } from '../BrandLogo';
import { sounds } from '../../utils/audio';
import { OrderConfirmation, Address, PreOrder } from '../../types';
import {
  Package,
  Clock,
  MapPin,
  Heart,
  Gift,
  User as UserIcon,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Truck,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  RotateCcw,
  MessageSquare,
  X,
  AlertCircle
} from 'lucide-react';

export const CustomerAccount: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    setCurrentView, 
    activeAccountTab, 
    setActiveAccountTab,
    selectedOrderId,
    setSelectedOrderId,
    updateProfile,
    changePassword,
    addSavedAddress,
    updateSavedAddress,
    deleteSavedAddress,
    setDefaultAddress 
  } = useAuth();

  const { 
    orders, 
    preOrders, 
    giftOrders, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useStoreData();

  const { addToCart, wishlist, removeFromWishlist, isWishlisted, toggleWishlist } = useCart();

  // Filter orders for the current user
  const userOrders = orders.filter((o) => o.userId === currentUser?.id || o.customerEmail === currentUser?.email);
  const userPreOrders = preOrders.filter((p) => p.userId === currentUser?.id || p.customerEmail === currentUser?.email);
  const userGiftOrders = giftOrders.filter((g) => g.senderEmail === currentUser?.email);
  const userNotifications = notifications.filter((n) => n.target === 'all' || (n.target === 'customer' && (!n.userId || n.userId === currentUser?.id)));

  // Selected Order for Modal
  const activeDetailOrder = orders.find((o) => o.orderId === selectedOrderId) || null;

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.fullName || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileDob, setProfileDob] = useState(currentUser?.dateOfBirth || '');
  const [profileGender, setProfileGender] = useState(currentUser?.gender || '');
  const [profileMessage, setProfileMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Password Change State
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Address Modal State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrType, setAddrType] = useState<'home' | 'work' | 'other'>('home');
  const [addrFullName, setAddrFullName] = useState(currentUser?.fullName || '');
  const [addrPhone, setAddrPhone] = useState(currentUser?.phone || '');
  const [addrFlat, setAddrFlat] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('Ahmedabad');
  const [addrState, setAddrState] = useState('Gujarat');
  const [addrPincode, setAddrPincode] = useState('380001');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Order Status Filter
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered'>('all');

  // Support Form State
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile({
      fullName: profileName,
      phone: profilePhone,
      dateOfBirth: profileDob,
      gender: profileGender as any
    });

    if (res.success) {
      setProfileMessage({ text: 'Profile updated successfully!', isError: false });
      setIsEditingProfile(false);
    } else {
      setProfileMessage({ text: res.error || 'Failed to update', isError: true });
    }
  };

  // Handle Password Change
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setPassMessage({ text: 'New passwords do not match.', isError: true });
      sounds.playError();
      return;
    }
    const res = await changePassword(oldPass, newPass);
    if (res.success) {
      setPassMessage({ text: 'Password updated successfully!', isError: false });
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
      setIsChangingPass(false);
    } else {
      setPassMessage({ text: res.error || 'Failed to change password.', isError: true });
    }
  };

  // Handle Address Save
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrFullName || !addrFlat || !addrStreet || !addrPincode) {
      sounds.playError();
      return;
    }

    if (editingAddressId) {
      updateSavedAddress(editingAddressId, {
        type: addrType,
        fullName: addrFullName,
        phone: addrPhone,
        flat: addrFlat,
        street: addrStreet,
        landmark: addrLandmark,
        city: addrCity,
        state: addrState,
        pincode: addrPincode,
        isDefault: addrIsDefault
      });
    } else {
      addSavedAddress({
        type: addrType,
        fullName: addrFullName,
        phone: addrPhone,
        email: currentUser?.email || '',
        flat: addrFlat,
        street: addrStreet,
        landmark: addrLandmark,
        city: addrCity,
        state: addrState,
        pincode: addrPincode,
        isDefault: addrIsDefault
      });
    }

    sounds.playCanPop();
    setAddressModalOpen(false);
    setEditingAddressId(null);
  };

  const openEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddrType(addr.type);
    setAddrFullName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrFlat(addr.flat);
    setAddrStreet(addr.street);
    setAddrLandmark(addr.landmark || '');
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPincode(addr.pincode);
    setAddrIsDefault(!!addr.isDefault);
    setAddressModalOpen(true);
  };

  const openNewAddress = () => {
    setEditingAddressId(null);
    setAddrType('home');
    setAddrFullName(currentUser?.fullName || '');
    setAddrPhone(currentUser?.phone || '');
    setAddrFlat('');
    setAddrStreet('');
    setAddrLandmark('');
    setAddrCity('Ahmedabad');
    setAddrState('Gujarat');
    setAddrPincode('380001');
    setAddrIsDefault((currentUser?.addresses?.length || 0) === 0);
    setAddressModalOpen(true);
  };

  // Reorder Item
  const handleReorder = (order: OrderConfirmation) => {
    order.items.forEach((it) => {
      addToCart(it.product, it.quantity);
    });
    sounds.playCelebration();
    setCurrentView('shop');
    window.location.hash = '#';
  };

  const activeOrdersCount = userOrders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#171316] flex flex-col justify-between">
      
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentView('shop');
                window.location.hash = '#';
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-[#7A0F29] px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200/60 transition-all hover:-translate-x-0.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
            <BrandLogo />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200/60">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser?.fullName}
                className="w-6 h-6 rounded-full object-cover border border-stone-300"
              />
              <span className="text-xs font-bold text-[#171316]">{currentUser?.fullName}</span>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Account Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        
        {/* Welcome Banner */}
        <div className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-[#7A0F29] via-[#8E1736] to-[#52091B] rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
            <Sparkles className="w-64 h-64 text-[#F2C76E]" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-white/15 text-[#F2C76E] text-[11px] font-bold uppercase tracking-wider inline-block mb-2 border border-white/10">
                Mithai Pop Club Explorer
              </span>
              <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-[#FFF7E8]">
                Welcome back, {currentUser?.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 mt-1">
                Track your active nitrogen-canned deliveries, pre-orders, and saved addresses.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.playCanPop();
                  setCurrentView('shop');
                  window.location.hash = '#menu';
                }}
                className="px-5 py-2.5 rounded-xl bg-[#F2C76E] hover:bg-[#DEB358] text-[#7A0F29] font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                Order Fresh Pops
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Layout: Left Sidebar + Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            
            <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-xs space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: Package, badge: activeOrdersCount > 0 ? `${activeOrdersCount} Active` : undefined },
                { id: 'orders', label: 'My Orders', icon: Clock, count: userOrders.length },
                { id: 'preorders', label: 'Pre-Orders', icon: Sparkles, count: userPreOrders.length },
                { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: currentUser?.addresses?.length || 0 },
                { id: 'wishlist', label: 'Saved Pops', icon: Heart, count: wishlist.length },
                { id: 'gifts', label: 'Gift Orders', icon: Gift, count: userGiftOrders.length },
                { id: 'notifications', label: 'Notifications', icon: Bell, count: userNotifications.filter(n => !n.read).length },
                { id: 'profile', label: 'Account Details', icon: UserIcon },
                { id: 'support', label: 'Help & Support', icon: HelpCircle },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeAccountTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sounds.playClick();
                      setActiveAccountTab(tab.id);
                      setSelectedOrderId(null);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#7A0F29] text-[#FFF7E8] shadow-sm'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-[#7A0F29]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#F2C76E]' : 'text-stone-400'}`} />
                      <span>{tab.label}</span>
                    </div>

                    {tab.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F2C76E] text-[#7A0F29]">
                        {tab.badge}
                      </span>
                    )}

                    {tab.count !== undefined && !tab.badge && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Support Quick Box */}
            <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Truck className="w-4 h-4 text-[#7A0F29]" />
                <span>Cryo Cold Guarantee</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                All Mithai Pops travel in nitrogen-sealed aluminum cans in sub-zero thermal packs.
              </p>
            </div>

          </div>

          {/* Right Main Content Panel */}
          <div className="lg:col-span-3">

            {/* ===================================================
                TAB 1: OVERVIEW
               =================================================== */}
            {activeAccountTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Active Order Card Banner */}
                {userOrders.find((o) => o.status !== 'Delivered' && o.status !== 'Cancelled') ? (
                  (() => {
                    const activeOrd = userOrders.find((o) => o.status !== 'Delivered' && o.status !== 'Cancelled')!;
                    return (
                      <div className="bg-white border-2 border-[#7A0F29]/30 rounded-3xl p-6 shadow-md relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
                          <div>
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                              Active Order In Progress
                            </span>
                            <h3 className="text-lg font-black font-display text-[#171316] mt-1.5">
                              Order #{activeOrd.orderId}
                            </h3>
                            <p className="text-xs text-stone-500">
                              Placed on {activeOrd.placedAt.split('T')[0]} • {activeOrd.deliveryOption.name}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-stone-500 block">Estimated Arrival</span>
                            <span className="text-sm font-black text-[#7A0F29]">
                              {activeOrd.estimatedDelivery}
                            </span>
                          </div>
                        </div>

                        {/* Items in active order */}
                        <div className="flex items-center gap-3 overflow-x-auto pb-2">
                          {activeOrd.items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/60 shrink-0">
                              <img src={it.product.image} alt={it.product.name} className="w-10 h-10 object-contain" />
                              <div>
                                <p className="text-xs font-bold text-[#171316] truncate max-w-[140px]">{it.product.name}</p>
                                <p className="text-[10px] text-stone-500">Qty: {it.quantity} • ₹{it.product.price * it.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Progress Stepper */}
                        <div className="mt-5 pt-4 border-t border-stone-100">
                          <div className="flex items-center justify-between relative">
                            {['Order Confirmed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'].map((step, sIdx) => {
                              const stages = ['Order Confirmed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'];
                              const currentStageIdx = stages.indexOf(activeOrd.status);
                              const isCompleted = currentStageIdx >= sIdx;
                              const isCurrent = currentStageIdx === sIdx;

                              return (
                                <div key={step} className="flex flex-col items-center text-center z-10">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                      isCompleted
                                        ? 'bg-[#7A0F29] text-white shadow-sm'
                                        : 'bg-stone-100 text-stone-400 border border-stone-300'
                                    } ${isCurrent ? 'ring-4 ring-[#7A0F29]/20' : ''}`}
                                  >
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : sIdx + 1}
                                  </div>
                                  <span className={`text-[10px] font-bold mt-1.5 max-w-[70px] leading-tight ${isCurrent ? 'text-[#7A0F29]' : 'text-stone-500'}`}>
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-end gap-3">
                          <button
                            onClick={() => {
                              setSelectedOrderId(activeOrd.orderId);
                              setActiveAccountTab('orders');
                            }}
                            className="text-xs font-bold text-[#7A0F29] hover:underline"
                          >
                            View Order Details
                          </button>
                        </div>

                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-white border border-stone-200/90 rounded-3xl p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-stone-50 text-stone-400 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#171316]">No active orders right now</h3>
                      <p className="text-xs text-stone-500 mt-1">Cravings kicking in? Explore our classic remix flavors.</p>
                    </div>
                    <button
                      onClick={() => {
                        sounds.playCanPop();
                        setCurrentView('shop');
                      }}
                      className="py-2.5 px-5 bg-[#7A0F29] text-[#FFF7E8] font-bold text-xs rounded-xl hover:bg-[#52091B]"
                    >
                      Browse Pops
                    </button>
                  </div>
                )}

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Total Orders</span>
                    <p className="text-2xl font-black font-display text-[#7A0F29] mt-1">
                      {userOrders.length}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">₹{userOrders.reduce((acc, o) => acc + o.total, 0)} spent</p>
                  </div>

                  <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Active Pre-Orders</span>
                    <p className="text-2xl font-black font-display text-[#7A0F29] mt-1">
                      {userPreOrders.length}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">Reserved collectible editions</p>
                  </div>

                  <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Saved Addresses</span>
                    <p className="text-2xl font-black font-display text-[#7A0F29] mt-1">
                      {currentUser?.addresses?.length || 0}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-1">Quick 1-tap checkout</p>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white border border-stone-200/90 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black font-display text-[#171316]">Recent Orders</h3>
                    <button
                      onClick={() => setActiveAccountTab('orders')}
                      className="text-xs font-bold text-[#7A0F29] hover:underline flex items-center gap-1"
                    >
                      <span>View All ({userOrders.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {userOrders.slice(0, 3).map((ord) => (
                      <div
                        key={ord.orderId}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-stone-50/70 border border-stone-200/60 gap-3"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 bg-white rounded-xl border border-stone-200 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-[#7A0F29]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-[#171316]">Order #{ord.orderId}</span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}>
                                {ord.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {ord.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 justify-between sm:justify-end">
                          <span className="text-xs font-black text-[#7A0F29]">₹{ord.total}</span>
                          <button
                            onClick={() => handleReorder(ord)}
                            className="px-3 py-1.5 bg-white hover:bg-[#7A0F29] hover:text-white border border-stone-200 text-[#7A0F29] rounded-xl text-xs font-bold transition-colors"
                          >
                            Reorder
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ===================================================
                TAB 2: MY ORDERS
               =================================================== */}
            {activeAccountTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Header with Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black font-display text-[#171316]">
                      My Orders
                    </h2>
                    <p className="text-xs text-stone-500">
                      View full receipts, live tracking timelines, and instant reordering.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
                    {(['all', 'active', 'delivered'] as const).map((flt) => (
                      <button
                        key={flt}
                        onClick={() => {
                          sounds.playClick();
                          setOrderFilter(flt);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                          orderFilter === flt
                            ? 'bg-white text-[#7A0F29] shadow-xs'
                            : 'text-stone-500 hover:text-stone-900'
                        }`}
                      >
                        {flt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {userOrders
                    .filter((o) => {
                      if (orderFilter === 'active') return o.status !== 'Delivered' && o.status !== 'Cancelled';
                      if (orderFilter === 'delivered') return o.status === 'Delivered';
                      return true;
                    })
                    .map((ord) => (
                      <div
                        key={ord.orderId}
                        className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4"
                      >
                        {/* Order Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3.5">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-sm font-black font-display text-[#171316]">
                                #{ord.orderId}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}>
                                {ord.status}
                              </span>
                              <span className="text-xs text-stone-400">•</span>
                              <span className="text-xs text-stone-500">{ord.placedAt.split('T')[0]}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-[#7A0F29]">₹{ord.total}</span>
                            <span className="text-[11px] text-stone-400 font-medium">({ord.paymentMethod})</span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2.5">
                          {ord.items.map((item, iIdx) => (
                            <div key={iIdx} className="flex items-center justify-between p-2.5 bg-stone-50/70 rounded-xl border border-stone-200/40">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-12 h-12 object-contain"
                                />
                                <div>
                                  <p className="text-xs font-bold text-[#171316]">{item.product.name}</p>
                                  <p className="text-[11px] text-stone-500">
                                    Qty: {item.quantity} × ₹{item.product.price}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-stone-700">
                                ₹{item.product.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Address & Estimated delivery */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 pt-2 gap-2">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#7A0F29]" />
                            <span>Deliver to: {ord.deliveryAddress.fullName}, {ord.deliveryAddress.city}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>ETA: {ord.estimatedDelivery}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                          <button
                            onClick={() => setSelectedOrderId(ord.orderId)}
                            className="text-xs font-bold text-[#7A0F29] hover:underline flex items-center gap-1"
                          >
                            <span>Track Order Timeline</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReorder(ord)}
                              className="py-2 px-4 bg-[#7A0F29] hover:bg-[#52091B] text-[#FFF7E8] font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                            >
                              Reorder Pops
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                </div>

              </div>
            )}

            {/* ===================================================
                TAB 3: PRE-ORDERS
               =================================================== */}
            {activeAccountTab === 'preorders' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-display text-[#171316]">
                    Upcoming Pre-Orders & City Drops
                  </h2>
                  <p className="text-xs text-stone-500">
                    Track the small-batch production and dispatch dates of limited collectible Pops.
                  </p>
                </div>

                <div className="space-y-4">
                  {userPreOrders.map((po) => (
                    <div
                      key={po.id}
                      className="bg-white border-2 border-amber-300/70 rounded-3xl p-6 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
                            {po.status}
                          </span>
                          <span className="text-xs font-bold text-stone-500">Batch #{po.orderNumber}</span>
                        </div>
                        <span className="text-sm font-black text-[#7A0F29]">₹{po.totalPrice} (Paid)</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img src={po.product.image} alt={po.product.name} className="w-16 h-16 object-contain" />
                          <div>
                            <h4 className="text-sm font-bold text-[#171316]">{po.product.name}</h4>
                            <p className="text-xs text-stone-500">{po.product.tagline}</p>
                            <p className="text-xs font-semibold text-stone-700 mt-1">
                              Quantity: {po.quantity} • ₹{po.pricePerUnit} each
                            </p>
                          </div>
                        </div>

                        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60 text-xs space-y-1 text-right">
                          <p className="text-stone-500">Expected Launch: <strong>{po.expectedLaunchDate}</strong></p>
                          <p className="text-[#7A0F29] font-bold">Estimated Dispatch: {po.expectedDispatchDate}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span>Delivery Address: {po.deliveryAddress.fullName}, {po.deliveryAddress.city}</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Batch Allocation Confirmed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================================================
                TAB 4: SAVED ADDRESSES
               =================================================== */}
            {activeAccountTab === 'addresses' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black font-display text-[#171316]">
                      Saved Addresses
                    </h2>
                    <p className="text-xs text-stone-500">
                      Manage your delivery locations for swift, 1-tap checkout.
                    </p>
                  </div>

                  <button
                    onClick={openNewAddress}
                    className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#7A0F29] hover:bg-[#52091B] text-[#FFF7E8] font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Address Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(currentUser?.addresses || []).map((addr) => (
                    <div
                      key={addr.id}
                      className={`bg-white border-2 rounded-2xl p-5 shadow-xs relative flex flex-col justify-between ${
                        addr.isDefault ? 'border-[#7A0F29] bg-[#FFFDF9]' : 'border-stone-200/90'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[10px] font-bold uppercase tracking-wider">
                            {addr.type}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                              Default Address
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-[#171316]">{addr.fullName}</h4>
                          <p className="text-xs text-stone-500 font-medium">{addr.phone}</p>
                          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                            {addr.flat}, {addr.street}
                            {addr.landmark ? `, Near ${addr.landmark}` : ''}
                            <br />
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditAddress(addr)}
                            className="text-stone-600 hover:text-[#7A0F29] font-bold flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => deleteSavedAddress(addr.id)}
                            className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 ml-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>

                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[11px] font-bold text-[#7A0F29] hover:underline"
                          >
                            Set as Default
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================================================
                TAB 5: WISHLIST (SAVED POPS)
               =================================================== */}
            {activeAccountTab === 'wishlist' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-display text-[#171316]">
                    Saved Pops ({wishlist.length})
                  </h2>
                  <p className="text-xs text-stone-500">
                    Your personal vault of favorite canned remix desserts.
                  </p>
                </div>

                {wishlist.length === 0 ? (
                  <div className="bg-white border border-stone-200/90 rounded-3xl p-8 text-center space-y-3">
                    <Heart className="w-10 h-10 text-stone-300 mx-auto" />
                    <h3 className="text-sm font-bold text-stone-700">Your wishlist is empty</h3>
                    <p className="text-xs text-stone-500">Tap the heart icon on any Pop to save it for later.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-14 h-14 object-contain" />
                          <div>
                            <h4 className="text-xs font-bold text-[#171316]">{prod.name}</h4>
                            <p className="text-[11px] text-stone-500">₹{prod.price}</p>
                            <span className="text-[10px] text-emerald-700 font-bold">In Stock • Fresh Pack</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => {
                              addToCart(prod, 1);
                              sounds.playCanPop();
                            }}
                            className="py-1.5 px-3.5 bg-[#7A0F29] text-[#FFF7E8] font-bold text-xs rounded-xl hover:bg-[#52091B]"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(prod.id)}
                            className="text-[11px] text-stone-400 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================
                TAB 6: GIFT ORDERS
               =================================================== */}
            {activeAccountTab === 'gifts' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-display text-[#171316]">
                    Gift Orders & Custom Message Boxes
                  </h2>
                  <p className="text-xs text-stone-500">
                    Review canned dessert boxes sent to friends and family with custom notes.
                  </p>
                </div>

                <div className="space-y-4">
                  {userGiftOrders.map((g) => (
                    <div
                      key={g.id}
                      className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-[#7A0F29]" />
                          <span className="text-xs font-bold text-stone-500">Gift Box Order #{g.orderId}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {g.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 uppercase">Recipient</span>
                          <p className="text-sm font-bold text-[#171316] mt-0.5">{g.recipientName}</p>
                          <p className="text-xs text-stone-500 leading-relaxed mt-1">{g.recipientAddress}</p>
                        </div>

                        <div className="bg-[#FFFDF9] p-3.5 rounded-2xl border border-amber-200/60">
                          <span className="text-[10px] font-bold text-amber-900 uppercase">Personal Gift Message</span>
                          <p className="text-xs text-stone-700 italic mt-1 font-medium">"{g.giftMessage}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================================================
                TAB 7: NOTIFICATIONS
               =================================================== */}
            {activeAccountTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black font-display text-[#171316]">
                      Notifications
                    </h2>
                    <p className="text-xs text-stone-500">
                      Stay informed on kitchen prep, dispatches, and pre-order arrivals.
                    </p>
                  </div>

                  <button
                    onClick={() => markAllNotificationsRead('customer')}
                    className="text-xs font-bold text-[#7A0F29] hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="space-y-3">
                  {userNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        notif.read ? 'bg-white border-stone-200/80' : 'bg-amber-50/50 border-amber-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        notif.read ? 'bg-stone-100 text-stone-500' : 'bg-[#7A0F29] text-white'
                      }`}>
                        <Bell className="w-4 h-4" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#171316]">{notif.title}</h4>
                          <span className="text-[10px] text-stone-400">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1">{notif.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================================================
                TAB 8: ACCOUNT DETAILS / PROFILE
               =================================================== */}
            {activeAccountTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-display text-[#171316]">
                    Account Details
                  </h2>
                  <p className="text-xs text-stone-500">
                    Manage your personal profile, phone, and security settings.
                  </p>
                </div>

                {profileMessage && (
                  <div className={`p-3.5 rounded-2xl text-xs font-bold ${
                    profileMessage.isError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    {profileMessage.text}
                  </div>
                )}

                <div className="bg-white border border-stone-200/90 rounded-3xl p-6 space-y-6 shadow-xs">
                  
                  {/* Profile Info Form */}
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                      <h3 className="text-sm font-bold text-[#171316]">Personal Information</h3>
                      {!isEditingProfile && (
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(true)}
                          className="text-xs font-bold text-[#7A0F29] hover:underline flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Profile</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          disabled={!isEditingProfile}
                          className="w-full px-3.5 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-xs font-semibold text-[#171316] disabled:opacity-75 focus:outline-none focus:border-[#7A0F29]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={currentUser?.email || ''}
                          disabled
                          className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-500 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          disabled={!isEditingProfile}
                          className="w-full px-3.5 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-xs font-semibold text-[#171316] disabled:opacity-75 focus:outline-none focus:border-[#7A0F29]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Date of Birth (Optional)</label>
                        <input
                          type="date"
                          value={profileDob}
                          onChange={(e) => setProfileDob(e.target.value)}
                          disabled={!isEditingProfile}
                          className="w-full px-3.5 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-xs font-semibold text-[#171316] disabled:opacity-75 focus:outline-none focus:border-[#7A0F29]"
                        />
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#7A0F29] text-[#FFF7E8] text-xs font-bold rounded-xl shadow-xs"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </form>

                  {/* Password Change Box */}
                  <div className="pt-6 border-t border-stone-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-[#171316]">Security & Password</h3>
                      {!isChangingPass && (
                        <button
                          type="button"
                          onClick={() => setIsChangingPass(true)}
                          className="text-xs font-bold text-[#7A0F29] hover:underline"
                        >
                          Change Password
                        </button>
                      )}
                    </div>

                    {isChangingPass && (
                      <form onSubmit={handleSavePassword} className="space-y-3.5 max-w-md animate-in fade-in">
                        {passMessage && (
                          <div className={`p-2.5 rounded-xl text-xs font-bold ${passMessage.isError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>
                            {passMessage.text}
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Current Password</label>
                          <input
                            type="password"
                            value={oldPass}
                            onChange={(e) => setOldPass(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">New Password</label>
                          <input
                            type="password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            required
                            placeholder="Min 6 characters"
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsChangingPass(false)}
                            className="px-4 py-2 text-xs font-bold text-stone-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-[#7A0F29] text-[#FFF7E8] text-xs font-bold rounded-xl"
                          >
                            Update Password
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* ===================================================
                TAB 9: HELP & SUPPORT
               =================================================== */}
            {activeAccountTab === 'support' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-display text-[#171316]">
                    Help & Support
                  </h2>
                  <p className="text-xs text-stone-500">
                    Get answers about cold packaging, allergen safety, or order assistance.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* WhatsApp Direct */}
                  <a
                    href="https://wa.me/919820011223?text=Hi%20Mithai%20Pop%20Team,%20I%20need%20help%20with%20my%20order"
                    target="_blank"
                    rel="noreferrer"
                    className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-3xl flex items-start gap-4 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">WhatsApp Concierge</h4>
                      <p className="text-xs text-emerald-800/80 mt-1 leading-relaxed">
                        Chat directly with our kitchen dispatch team. Average reply: ~5 mins.
                      </p>
                      <span className="text-[11px] font-black text-emerald-900 mt-2 inline-flex items-center gap-1">
                        <span>Open WhatsApp Chat</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </a>

                  {/* Call Support */}
                  <div className="p-5 bg-stone-50 border border-stone-200 rounded-3xl flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#7A0F29] text-white flex items-center justify-center shrink-0">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#171316]">Toll-Free Support Line</h4>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        Mon–Sun: 9:00 AM – 10:00 PM IST
                      </p>
                      <span className="text-xs font-black text-[#7A0F29] mt-2 block">
                        +91 98200 11223
                      </span>
                    </div>
                  </div>

                </div>

                {/* Instant Ticket Form */}
                <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-[#171316]">Send an Order Issue Message</h3>

                  {supportSubmitted ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>Thank you! Your ticket has been logged. We will contact you via email/phone.</span>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!supportSubject || !supportMessage) return;
                        sounds.playCelebration();
                        setSupportSubmitted(true);
                      }}
                      className="space-y-3.5"
                    >
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Issue Topic</label>
                        <select
                          value={supportSubject}
                          onChange={(e) => setSupportSubject(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#7A0F29]"
                        >
                          <option value="">Select an issue...</option>
                          <option value="delivery_delay">Delivery Delay or Live ETA</option>
                          <option value="damaged_can">Cans Arrived Thawed / Damaged</option>
                          <option value="wrong_item">Incorrect Flavor Received</option>
                          <option value="preorder_query">Pre-Order Schedule Inquiry</option>
                          <option value="other">Other Inquiry</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Detailed Note</label>
                        <textarea
                          rows={3}
                          value={supportMessage}
                          onChange={(e) => setSupportMessage(e.target.value)}
                          required
                          placeholder="Tell us what happened..."
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#7A0F29]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="py-2.5 px-5 bg-[#7A0F29] text-[#FFF7E8] font-bold text-xs rounded-xl shadow-xs hover:bg-[#52091B]"
                      >
                        Submit Ticket
                      </button>
                    </form>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </main>

      {/* ===================================================
          ORDER DETAIL MODAL / DRAWER
         =================================================== */}
      {activeDetailOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                  {activeDetailOrder.status}
                </span>
                <h3 className="text-xl font-black font-display text-[#171316] mt-1">
                  Order #{activeDetailOrder.orderId}
                </h3>
                <p className="text-xs text-stone-500">
                  Placed on {activeDetailOrder.placedAt.split('T')[0]} • {activeDetailOrder.paymentMethod}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrderId(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline Stepper */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                Tracking Stages
              </h4>
              <div className="space-y-3">
                {(activeDetailOrder.timeline || [
                  { stage: 'Order Confirmed', timestamp: 'Completed', completed: true },
                  { stage: 'Preparing', timestamp: 'Completed', completed: true },
                  { stage: 'Packed', timestamp: 'In Progress', completed: activeDetailOrder.status === 'Packed' || activeDetailOrder.status === 'Out for Delivery' || activeDetailOrder.status === 'Delivered' },
                  { stage: 'Out for Delivery', timestamp: 'Pending', completed: activeDetailOrder.status === 'Out for Delivery' || activeDetailOrder.status === 'Delivered' },
                  { stage: 'Delivered', timestamp: 'Pending', completed: activeDetailOrder.status === 'Delivered' },
                ]).map((t, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      t.completed ? 'bg-[#7A0F29] text-white' : 'bg-stone-200 text-stone-500'
                    }`}>
                      {t.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div className="flex-1 flex items-center justify-between text-xs">
                      <span className={`font-bold ${t.completed ? 'text-[#171316]' : 'text-stone-400'}`}>
                        {t.stage}
                      </span>
                      <span className="text-[11px] text-stone-400">{t.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Order Items ({activeDetailOrder.items.length})
              </h4>
              <div className="space-y-2">
                {activeDetailOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={it.product.image} alt={it.product.name} className="w-10 h-10 object-contain" />
                      <div>
                        <p className="text-xs font-bold text-[#171316]">{it.product.name}</p>
                        <p className="text-[11px] text-stone-500">Qty: {it.quantity} • ₹{it.product.price} each</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#7A0F29]">₹{it.product.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-stone-50 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>₹{activeDetailOrder.subtotal}</span>
              </div>
              {activeDetailOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span>-₹{activeDetailOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span>{activeDetailOrder.deliveryFee === 0 ? 'FREE' : `₹${activeDetailOrder.deliveryFee}`}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-sm text-[#7A0F29]">
                <span>Total Paid</span>
                <span>₹{activeDetailOrder.total}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedOrderId(null)}
                className="px-4 py-2 text-xs font-bold text-stone-500"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleReorder(activeDetailOrder);
                  setSelectedOrderId(null);
                }}
                className="px-5 py-2 bg-[#7A0F29] text-[#FFF7E8] font-bold text-xs rounded-xl"
              >
                Reorder Items
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================
          ADDRESS MODAL (ADD / EDIT)
         =================================================== */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black font-display text-[#171316]">
                {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button
                onClick={() => setAddressModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3.5">
              
              {/* Type selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Address Label</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['home', 'work', 'other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAddrType(t)}
                      className={`py-2 text-xs font-bold uppercase rounded-xl border transition-all ${
                        addrType === t
                          ? 'border-[#7A0F29] bg-[#7A0F29]/10 text-[#7A0F29]'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={addrFullName}
                    onChange={(e) => setAddrFullName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Flat / House No. / Building</label>
                <input
                  type="text"
                  value={addrFlat}
                  onChange={(e) => setAddrFlat(e.target.value)}
                  required
                  placeholder="e.g. Flat 402, Royal Residency"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  required
                  placeholder="e.g. Golf Course Road, Sector 54"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="addr-def-chk"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="rounded text-[#7A0F29] focus:ring-[#7A0F29]"
                />
                <label htmlFor="addr-def-chk" className="text-xs text-stone-600 font-medium select-none">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#7A0F29] text-[#FFF7E8] font-bold text-xs rounded-xl shadow-xs"
                >
                  Save Address
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200/80 py-4 text-center text-xs text-stone-400 bg-white">
        © {new Date().getFullYear()} Mithai Pop Foods Pvt. Ltd. All rights reserved.
      </footer>

    </div>
  );
};
