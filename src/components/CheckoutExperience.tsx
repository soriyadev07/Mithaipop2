import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStoreData } from '../context/StoreDataContext';
import { Product, Address, DeliveryOption, GiftOption, OrderConfirmation } from '../types';
import { sounds } from '../utils/audio';
import { BrandLogo } from './BrandLogo';
import {
  Lock,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Tag,
  Check,
  MapPin,
  Truck,
  Gift,
  CreditCard,
  Smartphone,
  Building,
  Wallet,
  Banknote,
  ShieldCheck,
  Clock,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  X,
  AlertCircle,
  HelpCircle,
  Flame,
  ArrowRight,
  User as UserIcon
} from 'lucide-react';

const DEFAULT_SAVED_ADDRESSES: Address[] = [
  {
    id: 'addr-home',
    type: 'home',
    fullName: 'Dev Soriya',
    phone: '9876543210',
    email: 'soriyadev07@gmail.com',
    flat: '123, Heritage Villa',
    street: 'Main Street, Bodakdev',
    landmark: 'Near Sindhu Bhavan',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380001',
    isDefault: true,
  },
  {
    id: 'addr-work',
    type: 'work',
    fullName: 'Dev Soriya',
    phone: '9876543210',
    email: 'soriyadev07@gmail.com',
    flat: 'Floor 4, Mithai Tech Labs',
    street: 'SG Highway, Business Park',
    landmark: 'Opposite Infocity',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380015',
    isDefault: false,
  }
];

export const CheckoutExperience: React.FC = () => {
  const {
    items,
    savedForLater,
    isOpen,
    checkoutOpen,
    closeCart,
    setCheckoutOpen,
    removeFromCart,
    undoRemove,
    updateQuantity,
    saveForLater,
    moveToCartFromSaved,
    removeSavedItem,
    promoCode,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    lastRemoved,
    subtotal,
    clearCart,
    triggerConfetti,
    activeOrder,
    setActiveOrder,
    openWaitlistModal,
  } = useCart();

  const { currentUser, isAuthenticated, setCurrentView } = useAuth();
  const { createOrder, settings } = useStoreData();

  // Navigation steps: 'cart' | 'checkout' | 'payment' | 'confirmation'
  const [currentStep, setCurrentStep] = useState<'cart' | 'checkout' | 'payment'>('cart');
  
  // Promo state
  const [promoInput, setPromoInput] = useState('');
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Address state
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(() => {
    if (currentUser?.addresses && currentUser.addresses.length > 0) {
      return currentUser.addresses;
    }
    return DEFAULT_SAVED_ADDRESSES;
  });

  useEffect(() => {
    if (currentUser?.addresses && currentUser.addresses.length > 0) {
      setSavedAddresses(currentUser.addresses);
      const defaultAddr = currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0];
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    }
  }, [currentUser]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    if (currentUser?.addresses && currentUser.addresses.length > 0) {
      return (currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0]).id;
    }
    return DEFAULT_SAVED_ADDRESSES[0].id;
  });
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    flat: '',
    street: '',
    landmark: '',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '',
    saveForFuture: true,
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [isLocating, setIsLocating] = useState(false);

  // Delivery options state
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('express');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Gift options state
  const [isGift, setIsGift] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftMessage, setGiftMessage] = useState('A little pop of happiness for you ❤️');
  const [hidePrice, setHidePrice] = useState(true);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet' | 'netbanking' | 'cod'>('upi');
  const [upiProvider, setUpiProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'custom'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    saveCard: true,
  });
  const [selectedWallet, setSelectedWallet] = useState('paytm');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [liveTrackingStep, setLiveTrackingStep] = useState<number>(1);

  // Calculate delivery date strings
  const dates = useMemo(() => {
    const today = new Date();
    const standardDate = new Date(today);
    standardDate.setDate(today.getDate() + 3);
    const expressDate = new Date(today);
    expressDate.setDate(today.getDate() + 1);

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short' };
    return {
      standard: standardDate.toLocaleDateString('en-IN', options),
      express: expressDate.toLocaleDateString('en-IN', options),
    };
  }, []);

  // Delivery Fee calculation
  const isFreeDelivery = subtotal >= 499 && deliveryType === 'standard';
  const deliveryFee = isFreeDelivery ? 0 : deliveryType === 'express' ? 90 : 40;
  const codFee = paymentMethod === 'cod' ? 30 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee + codFee);

  // Active address object
  const currentAddress = useMemo(() => {
    if (isAddingNewAddress) {
      return {
        id: 'new-custom',
        type: 'other' as const,
        fullName: addressForm.fullName,
        phone: addressForm.phone,
        email: addressForm.email,
        flat: addressForm.flat,
        street: addressForm.street,
        landmark: addressForm.landmark,
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode,
      };
    }
    return savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];
  }, [isAddingNewAddress, addressForm, savedAddresses, selectedAddressId]);

  if (!isOpen && !checkoutOpen && !activeOrder) {
    return null;
  }

  // Handle Promo Code submission
  const handleApplyCode = (codeToApply?: string) => {
    const code = codeToApply || promoInput;
    if (!code.trim()) {
      setPromoMessage({ text: 'Please enter a discount code.', isError: true });
      return;
    }
    const res = applyPromoCode(code);
    if (res.success) {
      setPromoMessage({ text: res.message, isError: false });
      setPromoInput('');
    } else {
      setPromoMessage({ text: res.message, isError: true });
    }
  };

  // Quick auto-fill Geolocation
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    sounds.playClick();
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            setIsAddingNewAddress(true);
            setAddressForm((prev) => ({
              ...prev,
              flat: 'Plot 42, Green Acropolis',
              street: 'Sindhu Bhavan Road',
              landmark: 'Near Taj Skyline',
              city: 'Ahmedabad',
              state: 'Gujarat',
              pincode: '380054',
            }));
            setIsLocating(false);
          }, 600);
        },
        () => {
          setIsAddingNewAddress(true);
          setAddressForm((prev) => ({
            ...prev,
            flat: 'Flat 101, Anand Vihar',
            street: 'Heritage Avenue',
            city: 'Ahmedabad',
            state: 'Gujarat',
            pincode: '380001',
          }));
          setIsLocating(false);
        },
        { timeout: 3000 }
      );
    } else {
      setIsAddingNewAddress(true);
      setIsLocating(false);
    }
  };

  // Validate Address Form
  const validateAddress = (): boolean => {
    if (!isAddingNewAddress) return true;
    const errors: Record<string, string> = {};

    if (!addressForm.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!addressForm.phone.trim() || !/^\d{10}$/.test(addressForm.phone.replace(/\D/g, ''))) {
      errors.phone = 'Enter a valid 10-digit mobile number.';
    }
    if (!addressForm.email.trim() || !addressForm.email.includes('@')) {
      errors.email = 'Enter a valid email address.';
    }
    if (!addressForm.flat.trim()) errors.flat = 'House / Flat number is required.';
    if (!addressForm.street.trim()) errors.street = 'Street / Area is required.';
    if (!addressForm.pincode.trim() || !/^\d{6}$/.test(addressForm.pincode.replace(/\D/g, ''))) {
      errors.pincode = 'Please enter a valid 6-digit PIN code.';
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step Transitions
  const handleProceedToPayment = () => {
    sounds.playClick();
    if (currentStep === 'cart') {
      setCurrentStep('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 'checkout') {
      if (!validateAddress()) {
        sounds.playError();
        return;
      }
      setCurrentStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Complete Order
  const handleCompleteOrder = () => {
    sounds.playClick();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      sounds.playCelebration();
      triggerConfetti();

      const orderNumber = `MP-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: OrderConfirmation = {
        orderId: orderNumber,
        userId: currentUser?.id,
        customerName: currentUser?.fullName || currentAddress.fullName,
        customerEmail: currentUser?.email || currentAddress.email,
        customerPhone: currentUser?.phone || currentAddress.phone,
        items: [...items],
        subtotal,
        discount: discountAmount,
        deliveryFee,
        total: finalTotal,
        deliveryAddress: currentAddress,
        deliveryOption: {
          id: deliveryType,
          name: deliveryType === 'express' ? 'Express Cryo Delivery' : 'Standard Cold Delivery',
          duration: deliveryType === 'express' ? '1–2 business days' : '3–5 business days',
          price: deliveryFee,
          estimatedDate: deliveryType === 'express' ? dates.express : dates.standard,
        },
        giftOption: isGift
          ? {
              enabled: true,
              recipientName: giftRecipient,
              message: giftMessage,
              hidePrice,
            }
          : undefined,
        deliveryInstructions: deliveryNotes,
        paymentMethod:
          paymentMethod === 'upi'
            ? `UPI (${upiProvider.toUpperCase()})`
            : paymentMethod === 'card'
            ? 'Credit / Debit Card'
            : paymentMethod === 'wallet'
            ? `Wallet (${selectedWallet})`
            : paymentMethod === 'netbanking'
            ? `Net Banking (${selectedBank})`
            : 'Cash on Delivery',
        placedAt: new Date().toISOString(),
        estimatedDelivery: deliveryType === 'express' ? dates.express : dates.standard,
        status: 'Order Confirmed',
        timeline: [
          { stage: 'Order Confirmed', timestamp: 'Just now', completed: true },
          { stage: 'Preparing', timestamp: 'In progress', completed: false },
          { stage: 'Packed', timestamp: 'Pending', completed: false },
          { stage: 'Out for Delivery', timestamp: 'Pending', completed: false },
          { stage: 'Delivered', timestamp: 'Pending', completed: false }
        ]
      };

      createOrder(newOrder);
      setActiveOrder(newOrder);
      clearCart();
    }, 1200);
  };

  // Reset and return
  const handleReturnToStore = () => {
    sounds.playClick();
    setActiveOrder(null);
    closeCart();
    setCheckoutOpen(false);
    setCurrentStep('cart');
  };

  if (settings.waitlistMode) {
    return (
      <div id="checkout-prelaunch-notice" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#2A050D] text-[#FFF7E8] border-2 border-[#F4BD38]/50 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
          <button
            onClick={handleReturnToStore}
            className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-white bg-[#52091B] rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 bg-[#F4BD38]/20 border border-[#F4BD38]/40 rounded-full flex items-center justify-center mx-auto text-[#F4BD38]">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F4BD38] bg-[#52091B] px-3.5 py-1 rounded-full border border-[#F4BD38]/30 inline-block">
              Pre-Launch Notice
            </span>
            <h2 className="text-2xl font-black font-display text-[#FFF7E8] italic">
              Online Ordering Paused
            </h2>
            <p className="text-sm text-[#FFF7E8]/85 leading-relaxed">
              Online ordering is temporarily paused while we prepare our first fresh batch for launch. Join the waitlist to receive priority access and exclusive launch offers.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                handleReturnToStore();
                openWaitlistModal();
              }}
              className="w-full py-3.5 bg-[#F4BD38] hover:bg-[#FFF7E8] text-[#52091B] font-black text-xs uppercase tracking-widest rounded-full shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-[#F4BD38] btn-shimmer-sheen cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#52091B]" />
              <span>Join the Waitlist</span>
            </button>

            <button
              onClick={handleReturnToStore}
              className="text-xs text-[#FFF7E8]/70 hover:text-[#F4BD38] py-1 transition-colors cursor-pointer"
            >
              Back to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-experience-container" className="fixed inset-0 z-50 overflow-y-auto bg-[#FFFDF9] text-[#171316] flex flex-col justify-between font-sans">
      
      {/* 1. MINIMAL CHECKOUT HEADER */}
      <header id="checkout-header" className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 sm:py-4 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Left: Brand Logo & Return */}
          <div className="flex items-center gap-4">
            <button
              id="checkout-return-btn"
              onClick={handleReturnToStore}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A0F29] hover:text-[#52091B] transition-colors py-1 px-2 rounded-lg hover:bg-stone-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Return to Store</span>
            </button>

            <div className="h-5 w-px bg-stone-200 hidden sm:block" />

            <div className="scale-90 origin-left">
              <BrandLogo variant="nav" />
            </div>
          </div>

          {/* Center/Right: 100% Secure Checkout Badge */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-[11px] font-semibold">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Secure Checkout</span>
            </div>

            <button
              id="checkout-close-btn"
              onClick={handleReturnToStore}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Close Checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. CONFIRMATION SCREEN (When order is active) */}
      {activeOrder ? (
        <main id="order-confirmation-screen" className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-400">
            
            {/* Success Header Animation */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#7A0F29]/10 border-2 border-[#7A0F29]/30 rounded-full flex items-center justify-center mx-auto text-[#7A0F29] animate-bounce">
                <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Order #{activeOrder.orderId} Confirmed
              </div>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-[#171316] tracking-tight">
                Your Pop is on its way!
              </h1>
              <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto">
                Your Mithai Pop order has been confirmed. Get ready for something deliciously unexpected.
              </p>
            </div>

            {/* Interactive Tracking Timeline */}
            <div className="bg-[#FFFDF9] border border-stone-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                <span>Live Cryo Tracking</span>
                <span className="text-[#7A0F29]">Est. Delivery: {activeOrder.estimatedDelivery}</span>
              </div>

              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-stone-200 -z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#7A0F29] transition-all duration-700"
                  style={{ width: liveTrackingStep === 1 ? '15%' : liveTrackingStep === 2 ? '50%' : liveTrackingStep === 3 ? '85%' : '100%' }}
                />

                {/* Steps */}
                {[
                  { step: 1, label: 'Order Confirmed', sub: 'Placed' },
                  { step: 2, label: 'Preparing Your Pops', sub: 'Cryo-packing' },
                  { step: 3, label: 'Out for Delivery', sub: 'Cold Courier' },
                  { step: 4, label: 'Delivered', sub: 'Ice Cold' },
                ].map((st) => (
                  <div
                    key={st.step}
                    onClick={() => {
                      sounds.playClick();
                      setLiveTrackingStep(st.step);
                    }}
                    className="relative z-10 flex flex-col items-center cursor-pointer group"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        liveTrackingStep >= st.step
                          ? 'bg-[#7A0F29] text-[#FFF7E8] ring-4 ring-[#7A0F29]/20 shadow-md'
                          : 'bg-white border-2 border-stone-300 text-stone-400'
                      }`}
                    >
                      {liveTrackingStep > st.step ? <Check className="w-4 h-4" /> : st.step}
                    </div>
                    <span className={`text-[11px] font-bold mt-2 text-center max-w-[70px] leading-tight ${liveTrackingStep >= st.step ? 'text-[#171316]' : 'text-stone-400'}`}>
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 space-y-1.5">
                <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">Shipping Destination</span>
                <p className="font-bold text-[#171316] text-sm">{activeOrder.deliveryAddress.fullName}</p>
                <p className="text-stone-600 leading-relaxed">
                  {activeOrder.deliveryAddress.flat}, {activeOrder.deliveryAddress.street}, {activeOrder.deliveryAddress.city}, {activeOrder.deliveryAddress.state} – {activeOrder.deliveryAddress.pincode}
                </p>
                <p className="text-stone-500 font-mono pt-1">Phone: +91 {activeOrder.deliveryAddress.phone}</p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 space-y-1.5">
                <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">Payment Summary</span>
                <div className="flex justify-between items-center text-stone-700">
                  <span>Method</span>
                  <span className="font-medium text-[#171316]">{activeOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center text-stone-700">
                  <span>Items Total</span>
                  <span>₹{activeOrder.subtotal}</span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>−₹{activeOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold text-sm text-[#171316] pt-1.5 border-t border-stone-200">
                  <span>Total Paid</span>
                  <span className="text-base text-[#7A0F29]">₹{activeOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Items Purchased List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Items in this Pop Drop</h3>
              <div className="divide-y divide-stone-100 border border-stone-200/70 rounded-2xl overflow-hidden bg-white">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-contain bg-[#FFF7E8] p-1 border border-stone-200/60"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-[#171316]">{item.product.name}</h4>
                        <p className="text-[11px] text-stone-500">{item.product.flavorCombination}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#171316]">₹{item.product.price * item.quantity}</span>
                      <p className="text-[10px] text-stone-400 font-mono">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  sounds.playClick();
                  handleReturnToStore();
                  if (isAuthenticated) {
                    setCurrentView('account');
                    window.location.hash = '#account';
                  } else {
                    setCurrentView('login');
                    window.location.hash = '#login';
                  }
                }}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#7A0F29] hover:bg-[#52091B] text-[#FFF7E8] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <UserIcon className="w-4 h-4 text-[#F2C76E]" />
                <span>{isAuthenticated ? 'View in My Account' : 'Log In / Create Account'}</span>
              </button>

              <button
                onClick={handleReturnToStore}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Continue Shopping
              </button>
            </div>

          </div>
        </main>
      ) : items.length === 0 ? (
        
        /* 3. EMPTY CART STATE */
        <main id="empty-cart-view" className="flex-1 max-w-lg mx-auto w-full px-4 py-16 text-center space-y-6 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-[#FFF7E8] border border-[#F2C76E]/30 flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-10 h-10 text-[#7A0F29]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black font-display text-[#171316] tracking-tight">
              Your Pop basket is feeling a little empty.
            </h1>
            <p className="text-sm text-stone-500 font-medium">
              Let's fix that.
            </p>
          </div>

          <button
            id="empty-cart-explore-btn"
            onClick={handleReturnToStore}
            className="px-8 py-3.5 bg-[#7A0F29] hover:bg-[#52091B] text-[#FFF7E8] font-bold text-xs uppercase tracking-widest rounded-full shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#F2C76E]" />
            <span>Explore the Pops</span>
          </button>
        </main>

      ) : (

        /* 4. ACTIVE CART & CHECKOUT LAYOUT */
        <main id="cart-checkout-layout" className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          
          {/* Page Heading */}
          <div className="mb-6 sm:mb-8 space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-[#171316] tracking-tight">
              Your Pop Cart
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Almost yours. Let's get it delivered.
            </p>
          </div>

          {/* Undo Toast Notification */}
          {lastRemoved && (
            <div className="mb-6 p-3.5 bg-[#7A0F29] text-[#FFF7E8] rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-4 duration-300">
              <span className="text-xs font-medium">
                Removed <strong>{lastRemoved.item.product.name}</strong> from your cart.
              </span>
              <button
                onClick={undoRemove}
                className="px-3 py-1 bg-[#FFF7E8] text-[#7A0F29] font-bold text-xs rounded-lg hover:bg-[#F2C76E] transition-colors"
              >
                Undo
              </button>
            </div>
          )}

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Cart Items, Discounts, Delivery & Payment */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* SECTION 1: CART ITEMS */}
              <section id="section-cart-items" className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h2 className="text-base sm:text-lg font-black font-display text-[#171316] flex items-center gap-2">
                    <span>Your Pops</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                      {items.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  </h2>

                  <span className="text-xs text-stone-400 font-medium">Delivered at 4°C</span>
                </div>

                {/* Items List */}
                <div className="space-y-4 divide-y divide-stone-100">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      {/* Product Info & Image */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FFFDF9] border border-stone-200/70 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="space-y-1 flex-1">
                          <h3 className="font-bold text-sm sm:text-base text-[#171316] leading-snug">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-stone-500 line-clamp-1">
                            {item.product.flavorCombination}
                          </p>
                          <div className="font-black text-sm text-[#7A0F29] pt-0.5">
                            ₹{item.product.price}
                          </div>

                          {/* Save for later button */}
                          <button
                            onClick={() => saveForLater(item.product.id)}
                            className="text-[11px] font-semibold text-stone-400 hover:text-[#7A0F29] transition-colors pt-1 inline-block"
                          >
                            Save for later
                          </button>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 self-end sm:self-center">
                        <div className="inline-flex items-center border border-stone-200 rounded-xl bg-stone-50/80 p-0.5 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-stone-600 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-[#171316]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-stone-600 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Saved For Later Drawer/Tray (if any items saved) */}
                {savedForLater.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Saved for later ({savedForLater.length})
                    </h4>
                    <div className="space-y-2.5">
                      {savedForLater.map((sItem) => (
                        <div
                          key={sItem.product.id}
                          className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200/60"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={sItem.product.image}
                              alt={sItem.product.name}
                              className="w-10 h-10 object-contain"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="text-xs font-bold text-[#171316]">{sItem.product.name}</p>
                              <p className="text-[11px] text-stone-500">₹{sItem.product.price}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => moveToCartFromSaved(sItem.product.id)}
                              className="text-xs font-bold px-3 py-1 bg-[#7A0F29] text-white rounded-lg hover:bg-[#52091B] transition-colors"
                            >
                              Move to Cart
                            </button>
                            <button
                              onClick={() => removeSavedItem(sItem.product.id)}
                              className="p-1 text-stone-400 hover:text-stone-700"
                              title="Delete"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* SECTION 2: DISCOUNT CODE */}
              <section id="section-discount-code" className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm space-y-3">
                <button
                  onClick={() => setPromoExpanded(!promoExpanded)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-4 h-4 text-[#7A0F29]" />
                    <span className="text-sm font-bold text-[#171316]">
                      {promoCode ? `Promo Code: ${promoCode}` : 'Have a promo code?'}
                    </span>
                    {promoCode && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                        Active
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${promoExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expandable Field */}
                {(promoExpanded || promoCode) && (
                  <div className="pt-2 space-y-3 animate-in fade-in duration-200">
                    {promoCode ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span><strong>{promoCode}</strong> applied — You saved ₹{discountAmount}!</span>
                        </div>
                        <button
                          onClick={removePromoCode}
                          className="text-xs text-red-600 hover:underline font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          placeholder="Enter discount code"
                          className="flex-1 px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs font-semibold text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
                        />
                        <button
                          onClick={() => handleApplyCode()}
                          className="px-5 py-2.5 bg-[#7A0F29] hover:bg-[#52091B] text-[#FFF7E8] font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95"
                        >
                          Apply
                        </button>
                      </div>
                    )}

                    {promoMessage && (
                      <p className={`text-xs ${promoMessage.isError ? 'text-red-600 font-semibold' : 'text-emerald-700 font-bold'}`}>
                        {promoMessage.text}
                      </p>
                    )}

                    {/* Smart Suggestion Pill */}
                    {!promoCode && (
                      <div className="pt-1">
                        <button
                          onClick={() => handleApplyCode('POPFIRST')}
                          className="inline-flex items-center gap-1.5 text-[11px] text-stone-600 hover:text-[#7A0F29] transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#F2C76E]" />
                          <span>Try code <strong>POPFIRST</strong> for 10% off your first order.</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* SECTION 3: DELIVERY ADDRESS */}
              <section id="section-delivery-address" className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-black font-display text-[#171316] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#7A0F29]" />
                    <span>Where should we pop in?</span>
                  </h2>

                  <button
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A0F29] hover:text-[#52091B] transition-colors"
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? 'Locating...' : 'Use my current location'}</span>
                  </button>
                </div>

                {/* Saved Address Cards */}
                {!isAddingNewAddress && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedAddressId(addr.id);
                          }}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                            isSelected
                              ? 'border-[#7A0F29] bg-[#FFFDF9] shadow-sm'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#7A0F29] bg-[#7A0F29]/10 px-2 py-0.5 rounded-md">
                              {addr.type}
                            </span>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-[#7A0F29] text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <p className="font-bold text-xs text-[#171316]">{addr.fullName}</p>
                          <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">
                            {addr.flat}, {addr.street}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {addr.city}, {addr.state} – {addr.pincode}
                          </p>
                        </div>
                      );
                    })}

                    {/* Add New Address Card Toggle */}
                    <div
                      onClick={() => {
                        sounds.playClick();
                        setIsAddingNewAddress(true);
                      }}
                      className="p-4 rounded-xl border-2 border-dashed border-stone-200 hover:border-[#7A0F29] transition-all cursor-pointer flex flex-col items-center justify-center text-center text-stone-500 hover:text-[#7A0F29] min-h-[110px]"
                    >
                      <Plus className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold">+ Add New Address</span>
                    </div>
                  </div>
                )}

                {/* Full Address Form (When creating or editing) */}
                {isAddingNewAddress && (
                  <div className="space-y-4 pt-2 border-t border-stone-100 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700">Enter Shipping Address</span>
                      <button
                        onClick={() => setIsAddingNewAddress(false)}
                        className="text-xs font-semibold text-stone-500 hover:text-stone-800"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          placeholder="e.g. Dev Soriya"
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                        />
                        {addressErrors.fullName && <p className="text-[10px] text-red-500 mt-0.5">{addressErrors.fullName}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Mobile Number *</label>
                        <input
                          type="tel"
                          maxLength={10}
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="10-digit number"
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                        />
                        {addressErrors.phone && <p className="text-[10px] text-red-500 mt-0.5">{addressErrors.phone}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          value={addressForm.email}
                          onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                          placeholder="For live tracking updates"
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                        />
                        {addressErrors.email && <p className="text-[10px] text-red-500 mt-0.5">{addressErrors.email}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Flat / House No. / Building *</label>
                        <input
                          type="text"
                          value={addressForm.flat}
                          onChange={(e) => setAddressForm({ ...addressForm, flat: e.target.value })}
                          placeholder="Flat, House No., Building name"
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                        />
                        {addressErrors.flat && <p className="text-[10px] text-red-500 mt-0.5">{addressErrors.flat}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Street / Area *</label>
                        <input
                          type="text"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          placeholder="Street name, Area"
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                        />
                        {addressErrors.street && <p className="text-[10px] text-red-500 mt-0.5">{addressErrors.street}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">Landmark (Optional)</label>
                        <input
                          type="text"
                          value={addressForm.landmark}
                          onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                          placeholder="e.g. Near Sindhu Bhavan"
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">PIN Code *</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          placeholder="6-digit PIN"
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                        />
                        {addressErrors.pincode && <p className="text-[10px] text-red-500 mt-0.5">{addressErrors.pincode}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">City</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="save-addr-checkbox"
                        checked={addressForm.saveForFuture}
                        onChange={(e) => setAddressForm({ ...addressForm, saveForFuture: e.target.checked })}
                        className="rounded text-[#7A0F29] focus:ring-[#7A0F29]"
                      />
                      <label htmlFor="save-addr-checkbox" className="text-xs text-stone-600 select-none">
                        Save this address for future purchases
                      </label>
                    </div>
                  </div>
                )}
              </section>

              {/* SECTION 4: DELIVERY OPTIONS */}
              <section id="section-delivery-options" className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                <h2 className="text-base sm:text-lg font-black font-display text-[#171316] flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#7A0F29]" />
                  <span>Choose Delivery</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Express Delivery (Recommended) */}
                  <div
                    onClick={() => {
                      sounds.playClick();
                      setDeliveryType('express');
                    }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                      deliveryType === 'express'
                        ? 'border-[#7A0F29] bg-[#FFFDF9] shadow-sm ring-1 ring-[#7A0F29]/10'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A0F29] bg-[#F2C76E]/20 px-2 py-0.5 rounded-full border border-[#F2C76E]/40">
                        ⚡ Recommended
                      </span>
                      <span className="font-bold text-xs text-[#7A0F29]">₹90</span>
                    </div>
                    <h4 className="font-bold text-xs text-[#171316] mt-1">Express Cryo Delivery</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">1–2 business days</p>
                    <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                      Arrives by {dates.express}
                    </p>
                  </div>

                  {/* Standard Delivery */}
                  <div
                    onClick={() => {
                      sounds.playClick();
                      setDeliveryType('standard');
                    }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                      deliveryType === 'standard'
                        ? 'border-[#7A0F29] bg-[#FFFDF9] shadow-sm ring-1 ring-[#7A0F29]/10'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        Standard
                      </span>
                      <span className="font-bold text-xs text-stone-800">
                        {subtotal >= 499 ? <span className="text-emerald-600 uppercase font-black">Free</span> : '₹40'}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-[#171316] mt-1">Standard Cold Shipping</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">3–5 business days</p>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Arrives by {dates.standard}
                    </p>
                  </div>
                </div>

                {/* Optional Delivery Instructions */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Delivery instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Gate number, preferred delivery time, landmark, etc."
                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
                  />
                </div>
              </section>

              {/* SECTION 5: GIFT OPTION */}
              <section id="section-gift-option" className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#7A0F29]" />
                    <span className="text-sm font-bold text-[#171316]">Sending this as a gift?</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gift-toggle"
                        checked={!isGift}
                        onChange={() => setIsGift(false)}
                        className="text-[#7A0F29] focus:ring-[#7A0F29]"
                      />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gift-toggle"
                        checked={isGift}
                        onChange={() => setIsGift(true)}
                        className="text-[#7A0F29] focus:ring-[#7A0F29]"
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>

                {isGift && (
                  <div className="pt-3 space-y-3.5 border-t border-stone-100 animate-in fade-in duration-200">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Recipient Name</label>
                      <input
                        type="text"
                        value={giftRecipient}
                        onChange={(e) => setGiftRecipient(e.target.value)}
                        placeholder="Who is this sweet drop for?"
                        className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Gift Message</label>
                      <textarea
                        rows={2}
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        placeholder="A little pop of happiness for you ❤️"
                        className="w-full px-3.5 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29] resize-none"
                      />
                      <div className="flex gap-2 mt-1.5 overflow-x-auto pb-1">
                        {[
                          'A little pop of happiness for you ❤️',
                          'Happy Celebrations! 🎉',
                          'Warm wishes & cold pops ✨',
                        ].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setGiftMessage(preset)}
                            className="text-[10px] px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full shrink-0 transition-colors"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="hide-price-chk"
                        checked={hidePrice}
                        onChange={(e) => setHidePrice(e.target.checked)}
                        className="rounded text-[#7A0F29] focus:ring-[#7A0F29]"
                      />
                      <label htmlFor="hide-price-chk" className="text-xs text-stone-600 select-none">
                        Hide price on package invoice
                      </label>
                    </div>
                  </div>
                )}
              </section>

              {/* SECTION 6: PAYMENT METHOD SECTION */}
              <section id="section-payment-method" className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                <h2 className="text-base sm:text-lg font-black font-display text-[#171316] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#7A0F29]" />
                  <span>Choose Payment Method</span>
                </h2>

                <div className="space-y-3">
                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                      paymentMethod === 'upi' ? 'border-[#7A0F29] bg-[#FFFDF9]' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-[#7A0F29]" />
                        <span className="font-bold text-xs text-[#171316]">UPI (Instant & Zero Fees)</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Fastest
                      </span>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="mt-3.5 pt-3 border-t border-stone-100 space-y-3 animate-in fade-in duration-200">
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'gpay', name: 'Google Pay' },
                            { id: 'phonepe', name: 'PhonePe' },
                            { id: 'paytm', name: 'Paytm' },
                          ].map((prov) => (
                            <button
                              key={prov.id}
                              type="button"
                              onClick={() => setUpiProvider(prov.id as any)}
                              className={`py-2 px-3 rounded-lg text-xs font-bold border text-center transition-all ${
                                upiProvider === prov.id
                                  ? 'border-[#7A0F29] bg-[#7A0F29]/10 text-[#7A0F29]'
                                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                              }`}
                            >
                              {prov.name}
                            </button>
                          ))}
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">Enter UPI ID</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={customUpiId}
                              onChange={(e) => setCustomUpiId(e.target.value)}
                              placeholder="name@okhdfcbank / yourname@upi"
                              className="flex-1 px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cards Option */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                      paymentMethod === 'card' ? 'border-[#7A0F29] bg-[#FFFDF9]' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-[#7A0F29]" />
                        <span className="font-bold text-xs text-[#171316]">Credit / Debit Cards</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">Visa, MC, RuPay</span>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="mt-3.5 pt-3 border-t border-stone-100 space-y-3 animate-in fade-in duration-200">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">Card Number</label>
                          <input
                            type="text"
                            maxLength={19}
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            placeholder="4532 •••• •••• 8892"
                            className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#7A0F29]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-stone-600 mb-1">MM / YY</label>
                            <input
                              type="text"
                              maxLength={5}
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                              placeholder="08/28"
                              className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#7A0F29]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-stone-600 mb-1">CVV</label>
                            <input
                              type="password"
                              maxLength={4}
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                              placeholder="•••"
                              className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#7A0F29]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-600 mb-1">Name on Card</label>
                          <input
                            type="text"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                            placeholder="e.g. Dev Soriya"
                            className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#7A0F29]"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="save-card-chk"
                            checked={cardDetails.saveCard}
                            onChange={(e) => setCardDetails({ ...cardDetails, saveCard: e.target.checked })}
                            className="rounded text-[#7A0F29] focus:ring-[#7A0F29]"
                          />
                          <label htmlFor="save-card-chk" className="text-xs text-stone-600 select-none">
                            Save card securely for future purchases
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Wallets */}
                  <div
                    onClick={() => setPaymentMethod('wallet')}
                    className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                      paymentMethod === 'wallet' ? 'border-[#7A0F29] bg-[#FFFDF9]' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Wallet className="w-4 h-4 text-[#7A0F29]" />
                        <span className="font-bold text-xs text-[#171316]">Wallets</span>
                      </div>
                    </div>
                    {paymentMethod === 'wallet' && (
                      <div className="mt-3 pt-3 border-t border-stone-100 flex gap-2">
                        {['Paytm Wallet', 'Amazon Pay', 'MobiKwik'].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setSelectedWallet(w)}
                            className={`py-1.5 px-3 rounded-lg text-xs font-semibold border ${
                              selectedWallet === w ? 'border-[#7A0F29] bg-[#7A0F29]/10 text-[#7A0F29]' : 'border-stone-200'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Net Banking */}
                  <div
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                      paymentMethod === 'netbanking' ? 'border-[#7A0F29] bg-[#FFFDF9]' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-[#7A0F29]" />
                        <span className="font-bold text-xs text-[#171316]">Net Banking</span>
                      </div>
                    </div>
                    {paymentMethod === 'netbanking' && (
                      <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-3 gap-2">
                        {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setSelectedBank(b)}
                            className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold border text-center ${
                              selectedBank === b ? 'border-[#7A0F29] bg-[#7A0F29]/10 text-[#7A0F29]' : 'border-stone-200'
                            }`}
                          >
                            {b} Bank
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                      paymentMethod === 'cod' ? 'border-[#7A0F29] bg-[#FFFDF9]' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Banknote className="w-4 h-4 text-[#7A0F29]" />
                        <div>
                          <span className="font-bold text-xs text-[#171316]">Cash on Delivery</span>
                          <p className="text-[10px] text-stone-500">+₹30 handling fee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* RIGHT COLUMN: Sticky Order Summary */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              
              <div id="order-summary-card" className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-md space-y-5">
                <h2 className="text-lg font-black font-display text-[#171316] pb-3 border-b border-stone-100">
                  Order Summary
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs text-stone-600">
                  <div className="flex justify-between items-center">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-bold text-[#171316]">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-700 font-bold animate-in fade-in duration-200">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        Discount ({promoCode})
                      </span>
                      <span>−₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Delivery Fee ({deliveryType === 'express' ? 'Express' : 'Standard'})</span>
                    <span className="font-bold text-[#171316]">
                      {deliveryFee === 0 ? <span className="text-emerald-700 uppercase">Free</span> : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between items-center text-stone-500">
                      <span>COD Handling Charge</span>
                      <span>₹30</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-stone-400">
                    <span>Taxes</span>
                    <span>Included</span>
                  </div>

                  {/* Grand Total */}
                  <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-[#171316]">Total</span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black font-display text-[#7A0F29] tracking-tight">
                        ₹{finalTotal}
                      </span>
                      <p className="text-[10px] text-stone-400 font-medium">Inclusive of all taxes</p>
                    </div>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <div className="pt-2 space-y-2.5">
                  <button
                    id="checkout-primary-cta"
                    onClick={handleCompleteOrder}
                    disabled={isProcessingPayment}
                    className="w-full py-4 px-6 rounded-2xl bg-[#7A0F29] hover:bg-[#52091B] text-[#FFF7E8] font-black text-sm uppercase tracking-widest transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-98 flex items-center justify-center gap-2 border border-[#7A0F29]"
                  >
                    {isProcessingPayment ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Securing Your Pop...</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#F2C76E]" />
                        <span>Pay ₹{finalTotal}</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-stone-400 font-medium flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3 text-stone-400" />
                    <span>Secure payment powered by trusted payment providers</span>
                  </p>
                </div>

                {/* Compact Trust Badges */}
                <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-3 text-[11px] text-stone-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#7A0F29] shrink-0" />
                    <span className="leading-tight">100% Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#7A0F29] shrink-0" />
                    <span className="leading-tight">Cryo Cold Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#7A0F29] shrink-0" />
                    <span className="leading-tight">Hassle-free Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#7A0F29] shrink-0" />
                    <span className="leading-tight">Freshly Packed</span>
                  </div>
                </div>

              </div>

              {/* Brand Message */}
              <div className="text-center">
                <p className="text-xs text-stone-400 italic font-medium">
                  “Made with Indian nostalgia. Packed to pop.”
                </p>
              </div>

            </div>

          </div>

          {/* Sticky Bottom Bar for Mobile View */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-3 shadow-2xl flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Total Amount</span>
              <span className="text-lg font-black text-[#7A0F29]">₹{finalTotal}</span>
            </div>

            <button
              onClick={handleCompleteOrder}
              disabled={isProcessingPayment}
              className="flex-1 py-3 px-5 rounded-xl bg-[#7A0F29] text-[#FFF7E8] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              {isProcessingPayment ? 'Processing...' : `Pay ₹${finalTotal}`}
            </button>
          </div>

        </main>
      )}

      {/* Footer minimal info */}
      <footer className="border-t border-stone-200/80 py-4 px-4 text-center text-stone-400 text-[11px] bg-white">
        © {new Date().getFullYear()} Mithai Pop Foods Pvt. Ltd. All rights reserved. Made in India.
      </footer>

    </div>
  );
};
