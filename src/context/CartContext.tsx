import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, OrderConfirmation } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ApplyPromoResult {
  success: boolean;
  message: string;
  discount: number;
}

interface CartContextType {
  items: CartItem[];
  savedForLater: CartItem[];
  isOpen: boolean;
  wishlist: string[];
  isMuted: boolean;
  searchOpen: boolean;
  selectedProductModal: Product | null;
  checkoutOpen: boolean;
  promoCode: string | null;
  discountAmount: number;
  lastRemoved: { item: CartItem; index: number } | null;
  lastAddedNotification: { product: Product; quantity: number } | null;
  clearLastAddedNotification: () => void;
  activeOrder: OrderConfirmation | null;
  addToCart: (product: Product, quantity?: number, isGiftBox?: boolean, customNotes?: string) => void;
  removeFromCart: (productId: string) => void;
  undoRemove: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCartFromSaved: (productId: string) => void;
  removeSavedItem: (productId: string) => void;
  applyPromoCode: (code: string) => ApplyPromoResult;
  removePromoCode: () => void;
  toggleWishlist: (productId: string) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleAudioMute: () => void;
  setSearchOpen: (open: boolean) => void;
  setSelectedProductModal: (product: Product | null) => void;
  setCheckoutOpen: (open: boolean) => void;
  setActiveOrder: (order: OrderConfirmation | null) => void;
  clearCart: () => void;
  triggerConfetti: () => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mithai_pop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mithai_pop_saved_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mithai_pop_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mithai_pop_promo') || null;
    } catch {
      return null;
    }
  });

  const [lastRemoved, setLastRemoved] = useState<{ item: CartItem; index: number } | null>(null);
  const [lastAddedNotification, setLastAddedNotification] = useState<{ product: Product; quantity: number } | null>(null);
  const [activeOrder, setActiveOrder] = useState<OrderConfirmation | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('mithai_pop_cart', JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('mithai_pop_saved_items', JSON.stringify(savedForLater));
    } catch {
      // Ignore
    }
  }, [savedForLater]);

  useEffect(() => {
    try {
      localStorage.setItem('mithai_pop_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (promoCode) {
        localStorage.setItem('mithai_pop_promo', promoCode);
      } else {
        localStorage.removeItem('mithai_pop_promo');
      }
    } catch {
      // Ignore
    }
  }, [promoCode]);

  const toggleAudioMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.isMuted = next;
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#F2C76E', '#7A0F29', '#F58FA3', '#FFD6B8', '#F5A623', '#FFF7E8']
    });
  };

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Dynamic promo calculations
  const calculateDiscount = (code: string | null, totalAmount: number): number => {
    if (!code || totalAmount <= 0) return 0;
    const clean = code.toUpperCase().trim();
    if (clean === 'POP20') {
      // 20% discount (e.g. ₹60 on ₹300 subtotal)
      return Math.round(totalAmount * 0.2);
    }
    if (clean === 'POPFIRST') {
      // 10% off first order
      return Math.round(totalAmount * 0.1);
    }
    if (clean === 'MITHAI10') {
      return Math.round(totalAmount * 0.1);
    }
    if (clean === 'SWEETPOP' || clean === 'FESTIVE50') {
      return Math.min(totalAmount, 50);
    }
    return 0;
  };

  const discountAmount = calculateDiscount(promoCode, subtotal);

  const applyPromoCode = (code: string): ApplyPromoResult => {
    const clean = code.toUpperCase().trim();
    if (!clean) {
      return { success: false, message: 'Please enter a coupon code.', discount: 0 };
    }
    if (clean === 'POP20') {
      const disc = Math.round(subtotal * 0.2);
      setPromoCode(clean);
      sounds.playCelebration();
      return { success: true, message: `POP20 applied! You saved ₹${disc > 0 ? disc : 60}`, discount: disc };
    }
    if (clean === 'POPFIRST') {
      const disc = Math.round(subtotal * 0.1);
      setPromoCode(clean);
      sounds.playCelebration();
      return { success: true, message: `POPFIRST applied! 10% off (Saved ₹${disc})`, discount: disc };
    }
    if (clean === 'MITHAI10') {
      const disc = Math.round(subtotal * 0.1);
      setPromoCode(clean);
      sounds.playCelebration();
      return { success: true, message: `MITHAI10 applied! 10% off (Saved ₹${disc})`, discount: disc };
    }
    if (clean === 'SWEETPOP' || clean === 'FESTIVE50') {
      setPromoCode(clean);
      sounds.playCelebration();
      return { success: true, message: `${clean} applied! Flat ₹50 off`, discount: 50 };
    }

    sounds.playError();
    return { success: false, message: "That code doesn't seem to work. Try POP20 or POPFIRST", discount: 0 };
  };

  const removePromoCode = () => {
    sounds.playClick();
    setPromoCode(null);
  };

  const addToCart = (product: Product, quantity = 1, isGiftBox = false, customNotes?: string) => {
    sounds.playCanPop();
    triggerConfetti();

    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.isGiftBox === isGiftBox);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.isGiftBox === isGiftBox
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, isGiftBox, customNotes }];
    });
    setLastAddedNotification({ product, quantity });
  };

  const removeFromCart = (productId: string) => {
    sounds.playClick();
    setItems((prev) => {
      const index = prev.findIndex((item) => item.product.id === productId);
      if (index !== -1) {
        setLastRemoved({ item: prev[index], index });
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const undoRemove = () => {
    if (!lastRemoved) return;
    sounds.playCanPop();
    setItems((prev) => {
      const newItems = [...prev];
      newItems.splice(lastRemoved.index, 0, lastRemoved.item);
      return newItems;
    });
    setLastRemoved(null);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    sounds.playClick();
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const saveForLater = (productId: string) => {
    sounds.playClick();
    const itemToSave = items.find((item) => item.product.id === productId);
    if (!itemToSave) return;

    setItems((prev) => prev.filter((item) => item.product.id !== productId));
    setSavedForLater((prev) => {
      const exists = prev.some((item) => item.product.id === productId);
      if (exists) return prev;
      return [...prev, itemToSave];
    });
  };

  const moveToCartFromSaved = (productId: string) => {
    sounds.playCanPop();
    const itemToMove = savedForLater.find((item) => item.product.id === productId);
    if (!itemToMove) return;

    setSavedForLater((prev) => prev.filter((item) => item.product.id !== productId));
    setItems((prev) => {
      const exists = prev.some((item) => item.product.id === productId);
      if (exists) {
        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + itemToMove.quantity } : item
        );
      }
      return [...prev, itemToMove];
    });
  };

  const removeSavedItem = (productId: string) => {
    sounds.playClick();
    setSavedForLater((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const toggleWishlist = (productId: string) => {
    sounds.playClick();
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        savedForLater,
        isOpen,
        wishlist,
        isMuted,
        searchOpen,
        selectedProductModal,
        checkoutOpen,
        promoCode,
        discountAmount,
        lastRemoved,
        lastAddedNotification,
        clearLastAddedNotification: () => setLastAddedNotification(null),
        activeOrder,
        addToCart,
        removeFromCart,
        undoRemove,
        updateQuantity,
        saveForLater,
        moveToCartFromSaved,
        removeSavedItem,
        applyPromoCode,
        removePromoCode,
        toggleWishlist,
        openCart: () => setIsOpen(true),
        closeCart: () => {
          setIsOpen(false);
          setCheckoutOpen(false);
        },
        toggleAudioMute,
        setSearchOpen,
        setSelectedProductModal,
        setCheckoutOpen,
        setActiveOrder,
        clearCart,
        triggerConfetti,
        subtotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

