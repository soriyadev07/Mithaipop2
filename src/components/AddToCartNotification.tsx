import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useStoreData } from '../context/StoreDataContext';
import { isPublicPriceVisible } from '../types';
import { ShoppingBag, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { sounds } from '../utils/audio';

export const AddToCartNotification: React.FC = () => {
  const { lastAddedNotification, clearLastAddedNotification, openCart, totalItems, subtotal } = useCart();
  const { settings } = useStoreData();

  useEffect(() => {
    if (!lastAddedNotification) return;

    // Auto-dismiss notification after 4 seconds
    const timer = setTimeout(() => {
      clearLastAddedNotification();
    }, 4000);

    return () => clearTimeout(timer);
  }, [lastAddedNotification, clearLastAddedNotification]);

  if (!lastAddedNotification) return null;

  const { product, quantity } = lastAddedNotification;
  const showPrice = isPublicPriceVisible(settings.waitlistMode);

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-[#2A050D] text-[#FFF7E8] border-2 border-[#F2C76E] rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center gap-3.5 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#F4BD38]/20 rounded-full blur-xl pointer-events-none" />

        {/* Thumbnail */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#3D0713] border border-[#F2C76E]/30 shrink-0 flex items-center justify-center p-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -top-1 -right-1 bg-[#10B981] text-white p-0.5 rounded-full shadow">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F4BD38] uppercase tracking-wider">
            <span>Added to Box</span>
            {quantity > 1 && <span className="px-1.5 py-0.2 bg-[#52091B] rounded-full text-[10px]">x{quantity}</span>}
          </div>
          <p className="text-sm font-black text-[#FFF7E8] truncate font-display">{product.name}</p>
          <p className="text-[11px] text-[#F2C76E]/90 font-medium">
            Cart: {totalItems} {totalItems === 1 ? 'pop' : 'pops'} {showPrice && `• ₹${subtotal}`}
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => {
            sounds.playClick();
            clearLastAddedNotification();
            openCart();
          }}
          className="shrink-0 px-3.5 py-2 bg-[#F4BD38] hover:bg-[#FFF7E8] text-[#52091B] rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">View Box</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        {/* Close button */}
        <button
          onClick={() => {
            sounds.playClick();
            clearLastAddedNotification();
          }}
          className="text-[#F2C76E]/60 hover:text-[#FFF7E8] p-1 transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
