import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { GiftOrder } from '../../../types';
import { 
  Gift, 
  Search, 
  Download, 
  Check, 
  Heart, 
  Truck, 
  Eye, 
  X,
  Printer
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

export const AdminGiftOrdersTab: React.FC = () => {
  const { giftOrders, updateGiftAssemblyStatus, exportDataToCSV } = useStoreData();
  const [giftSearch, setGiftSearch] = useState('');
  const [selectedGift, setSelectedGift] = useState<GiftOrder | null>(null);

  const filteredGifts = useMemo(() => {
    if (!giftSearch.trim()) return giftOrders;
    const q = giftSearch.toLowerCase();
    return giftOrders.filter(g => 
      g.orderId.toLowerCase().includes(q) ||
      g.senderName.toLowerCase().includes(q) ||
      g.recipientName.toLowerCase().includes(q) ||
      g.message.toLowerCase().includes(q)
    );
  }, [giftOrders, giftSearch]);

  const handlePrintCard = (gift: GiftOrder) => {
    sounds.playCelebration();
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Gift Orders & Personalized Greeting Desk
          </h2>
          <p className="text-xs text-stone-500">
            Handle custom gift cards, handwritten greeting messages, gold-foil gift boxes, and surprise dispatch.
          </p>
        </div>

        <button
          onClick={() => exportDataToCSV('gifts')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Gift Orders CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={giftSearch}
            onChange={(e) => setGiftSearch(e.target.value)}
            placeholder="Search by order ID, sender name, recipient name, or message text..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
          />
          {giftSearch && (
            <button
              onClick={() => setGiftSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Gift Orders Grid */}
      {filteredGifts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-3 shadow-xs">
          <Gift className="w-12 h-12 mx-auto text-pink-300 stroke-[1.5]" />
          <p className="text-base font-bold text-stone-600">No Gift Orders in Queue</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            When customers select "This is a Gift" during checkout, their custom greeting cards will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGifts.map((gift) => (
            <div
              key={gift.id}
              className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-300 transition-all"
            >
              <div>
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7A0F29]">
                    Order #{gift.orderId}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    gift.isAssembled ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {gift.isAssembled ? 'Box Assembled & Packed' : 'Pending Assembly'}
                  </span>
                </div>

                {/* Sender & Recipient */}
                <div className="mt-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-400">From:</span>
                    <span className="font-bold text-[#171316]">{gift.senderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">To:</span>
                    <span className="font-bold text-[#7A0F29]">{gift.recipientName}</span>
                  </div>
                  {gift.boxType && (
                    <div className="flex justify-between pt-1 border-t border-stone-200/40 text-[11px]">
                      <span className="text-stone-400">Packaging:</span>
                      <span className="font-bold text-stone-700">{gift.boxType}</span>
                    </div>
                  )}
                </div>

                {/* Greeting Card Message */}
                <div className="mt-3 p-3 bg-[#FFF7E8] border border-amber-200/80 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-[#7A0F29] uppercase tracking-wider block">
                    Custom Card Message
                  </span>
                  <p className="text-xs text-stone-800 italic font-serif leading-relaxed">
                    "{gift.message}"
                  </p>
                </div>

              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handlePrintCard(gift)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Card</span>
                </button>

                <button
                  onClick={() => {
                    updateGiftAssemblyStatus(gift.id, !gift.isAssembled);
                    sounds.playCelebration();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    gift.isAssembled
                      ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      : 'bg-[#7A0F29] text-[#FFF7E8] hover:bg-[#52091B]'
                  }`}
                >
                  {gift.isAssembled ? 'Mark Pending' : 'Mark Box Packed'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
