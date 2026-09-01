import React, { useState, useEffect } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { Coupon } from '../../../types';
import { X, Tag, Save } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface AdminCouponModalProps {
  coupon: Coupon | null; // null means create new
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCouponModal: React.FC<AdminCouponModalProps> = ({
  coupon,
  isOpen,
  onClose,
}) => {
  const { addCoupon, updateCoupon } = useStoreData();

  const [formData, setFormData] = useState<Coupon>({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 499,
    maxDiscount: 200,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    usageLimit: 500,
    usageCount: 0,
    isActive: true,
    description: '',
  });

  useEffect(() => {
    if (coupon) {
      setFormData({ ...coupon });
    } else {
      setFormData({
        code: `POPFEST${Math.floor(10 + Math.random() * 90)}`,
        discountType: 'percentage',
        discountValue: 15,
        minOrderValue: 499,
        maxDiscount: 200,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2026-12-31',
        usageLimit: 500,
        usageCount: 0,
        isActive: true,
        description: 'Festival discount on all signature pops and combo boxes.',
      });
    }
  }, [coupon, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = {
      ...formData,
      code: formData.code.toUpperCase().trim(),
    };

    if (coupon) {
      updateCoupon(coupon.code, formatted);
    } else {
      addCoupon(formatted);
    }

    sounds.playCelebration();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FFF7E8] text-[#7A0F29] border border-amber-200 uppercase">
              Promo Voucher
            </span>
            <h3 className="text-xl font-black font-display text-[#171316] mt-1">
              {coupon ? `Edit "${coupon.code}"` : 'Create New Coupon'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-800 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-stone-700 mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. FESTIVE20"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono uppercase font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
              >
                <option value="percentage">Percentage (% OFF)</option>
                <option value="fixed">Flat Amount (₹ OFF)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                {formData.discountType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} *
              </label>
              <input
                type="number"
                required
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Min Order Value (₹)</label>
              <input
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Max Discount Cap (₹)</label>
              <input
                type="number"
                value={formData.maxDiscount || ''}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Optional"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Usage Limit (Orders)</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Description / Rules</label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Valid on all orders above ₹499"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <label className="flex items-center gap-2 pt-1 font-bold text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded text-[#7A0F29]"
            />
            <span>Enable coupon immediately for public checkout</span>
          </label>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7A0F29] text-[#FFF7E8] font-black rounded-xl hover:bg-[#52091B] cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{coupon ? 'Save Changes' : 'Create Coupon'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
