import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { Coupon } from '../../../types';
import { 
  Tag, 
  Search, 
  Plus, 
  Download, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Power,
  Calendar,
  Percent,
  DollarSign
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface AdminCouponsTabProps {
  onOpenAddCoupon: () => void;
  onOpenEditCoupon: (coupon: Coupon) => void;
}

export const AdminCouponsTab: React.FC<AdminCouponsTabProps> = ({
  onOpenAddCoupon,
  onOpenEditCoupon,
}) => {
  const { coupons, toggleCouponStatus, deleteCoupon, exportDataToCSV } = useStoreData();
  const [couponSearch, setCouponSearch] = useState('');

  const filteredCoupons = useMemo(() => {
    if (!couponSearch.trim()) return coupons;
    const q = couponSearch.toLowerCase();
    return coupons.filter(c => 
      c.code.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  }, [coupons, couponSearch]);

  const handleDelete = (code: string) => {
    if (window.confirm(`Are you sure you want to delete coupon code "${code}"?`)) {
      deleteCoupon(code);
      sounds.playClick();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Coupons & Promotional Discounts
          </h2>
          <p className="text-xs text-stone-500">
            Create percentage or flat discount vouchers, set minimum cart requirements, usage caps, and validity windows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportDataToCSV('coupons')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Coupons CSV</span>
          </button>

          <button
            onClick={onOpenAddCoupon}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A0F29] text-[#FFF7E8] text-xs font-bold hover:bg-[#52091B] shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={couponSearch}
            onChange={(e) => setCouponSearch(e.target.value)}
            placeholder="Search coupon by code or description..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
          />
          {couponSearch && (
            <button
              onClick={() => setCouponSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Coupons Grid */}
      {filteredCoupons.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-3 shadow-xs">
          <Tag className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
          <p className="text-base font-bold text-stone-600">No Promotional Coupons</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Click "Create Coupon" to configure your first promotional voucher.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoupons.map((cp) => (
            <div
              key={cp.code}
              className={`bg-white border rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                cp.isActive ? 'border-stone-200/90' : 'border-stone-200 bg-stone-50/70 opacity-75'
              }`}
            >
              <div>
                
                {/* Coupon Code Header & Active Switch */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#FFF7E8] text-[#7A0F29] border border-amber-200/80 rounded-xl font-mono font-black text-sm tracking-wider">
                    {cp.code}
                  </span>

                  <button
                    onClick={() => {
                      toggleCouponStatus(cp.code);
                      sounds.playClick();
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                      cp.isActive 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{cp.isActive ? 'Active' : 'Disabled'}</span>
                  </button>
                </div>

                {/* Discount details */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <p className="text-base font-black text-[#171316]">
                    {cp.discountType === 'percentage' ? `${cp.discountValue}% OFF` : `₹${cp.discountValue} FLAT OFF`}
                  </p>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    {cp.description || 'Applicable across all signature pops and pre-orders.'}
                  </p>
                  
                  <div className="pt-2 border-t border-stone-100 space-y-1 text-[11px] text-stone-600">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Min Cart Value:</span>
                      <span className="font-bold text-stone-700">₹{cp.minOrderValue}</span>
                    </div>
                    {cp.maxDiscount && (
                      <div className="flex justify-between">
                        <span className="text-stone-400">Max Discount:</span>
                        <span className="font-bold text-stone-700">₹{cp.maxDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-stone-400">Usage Progress:</span>
                      <span className="font-bold text-[#7A0F29]">{cp.usageCount} / {cp.usageLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Valid Till:</span>
                      <span className="font-bold text-stone-700">{cp.endDate}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => onOpenEditCoupon(cp)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-[#7A0F29] hover:text-[#FFF7E8] text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cp.code)}
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
