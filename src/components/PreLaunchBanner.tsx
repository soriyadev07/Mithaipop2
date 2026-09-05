import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStoreData } from '../context/StoreDataContext';
import { sounds } from '../utils/audio';

export const PreLaunchBanner: React.FC = () => {
  const { openWaitlistModal } = useCart();
  const { settings } = useStoreData();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem('mithai_pop_waitlist_banner_dismissed');
      if (isDismissed === 'true') {
        setDismissed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!settings.waitlistMode || dismissed) {
    return null;
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    try {
      sessionStorage.setItem('mithai_pop_waitlist_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleJoinClick = () => {
    sounds.playClick();
    openWaitlistModal();
  };

  return (
    <div className="relative bg-[#52091B] text-[#FFF7E8] text-xs py-2 px-4 border-b border-[#F2C76E]/30 z-50 flex items-center justify-center transition-all">
      <div 
        onClick={handleJoinClick}
        className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center cursor-pointer group"
      >
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F4BD38]/20 text-[#F4BD38] font-black text-[10px] uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-[#F4BD38]" />
          <span>Pre-Launch Campaign</span>
        </div>
        <span className="text-stone-200 font-medium text-center">
          Mithai Pop is launching soon! Join the waitlist for exclusive VIP early access & batch #1 drops.
        </span>
        <button
          type="button"
          onClick={handleJoinClick}
          className="inline-flex items-center gap-1 text-[#F4BD38] font-bold underline underline-offset-2 hover:text-[#FFF7E8] transition-colors"
        >
          <span>Join Now</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#FFF7E8]/60 hover:text-[#FFF7E8] transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
