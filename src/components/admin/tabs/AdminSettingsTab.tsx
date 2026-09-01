import React, { useState } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { StoreSettings } from '../../../types';
import { 
  Settings, 
  Save, 
  Truck, 
  CreditCard, 
  Percent, 
  Store, 
  ShieldCheck, 
  Bell, 
  RotateCcw,
  Check
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

export const AdminSettingsTab: React.FC = () => {
  const { storeSettings, updateStoreSettings, resetStoreData } = useStoreData();
  const [formData, setFormData] = useState<StoreSettings>({ ...storeSettings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formData);
    setSaveSuccess(true);
    sounds.playCelebration();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset demo orders and data back to factory defaults? This cannot be undone.')) {
      resetStoreData();
      sounds.playClick();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Store Engine Settings & Operating Rules
          </h2>
          <p className="text-xs text-stone-500">
            Configure delivery fees, free-shipping thresholds, tax rates, contact channels, and system defaults.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* General Store Details */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-black font-display text-[#171316] border-b border-stone-100 pb-3">
            <Store className="w-4 h-4 text-[#7A0F29]" />
            <span>Brand Profile & Kitchen Contact</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Support Phone / WhatsApp</label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Operating Hours</label>
              <input
                type="text"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Economics */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-black font-display text-[#171316] border-b border-stone-100 pb-3">
            <Truck className="w-4 h-4 text-[#7A0F29]" />
            <span>Shipping & Cold-Chain Economics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Standard Cold-Chain Shipping Fee (₹)</label>
              <input
                type="number"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">GST / Tax Rate (%)</label>
              <input
                type="number"
                value={formData.taxRatePercent}
                onChange={(e) => setFormData({ ...formData, taxRatePercent: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Kitchen Toggles */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-black font-display text-[#171316] border-b border-stone-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-[#7A0F29]" />
            <span>Store Features & Kitchen Policies</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200/80 cursor-pointer">
              <div>
                <span className="font-bold text-[#171316] block">Allow Pre-Order Reservations</span>
                <span className="text-[11px] text-stone-500">Allow customers to reserve upcoming drops before official kitchen release</span>
              </div>
              <input
                type="checkbox"
                checked={formData.allowPreOrders}
                onChange={(e) => setFormData({ ...formData, allowPreOrders: e.target.checked })}
                className="w-4 h-4 rounded text-[#7A0F29]"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200/80 cursor-pointer">
              <div>
                <span className="font-bold text-[#171316] block">Gift Packaging Service</span>
                <span className="text-[11px] text-stone-500">Enable custom gift box wrap and handwritten greeting cards in checkout</span>
              </div>
              <input
                type="checkbox"
                checked={formData.enableGiftWrapping}
                onChange={(e) => setFormData({ ...formData, enableGiftWrapping: e.target.checked })}
                className="w-4 h-4 rounded text-[#7A0F29]"
              />
            </label>
          </div>
        </div>

        {/* Submit & Reset Bar */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/60 rounded-xl text-xs font-bold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Store to Factory Defaults</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#7A0F29] text-[#FFF7E8] hover:bg-[#52091B] rounded-2xl text-xs font-black tracking-wider uppercase shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
