import React, { useState, useEffect } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { InventoryItem } from '../../../types';
import { X, Layers, Save, Plus, Minus } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface AdminStockModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminStockModal: React.FC<AdminStockModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const { adjustStock } = useStoreData();
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove' | 'set'>('add');
  const [amount, setAmount] = useState<number>(20);
  const [reason, setReason] = useState('Fresh kitchen batch production');

  useEffect(() => {
    if (isOpen) {
      setAmount(20);
      setAdjustmentType('add');
      setReason('Fresh kitchen batch production');
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalAdjustment = 0;
    if (adjustmentType === 'add') {
      finalAdjustment = amount;
    } else if (adjustmentType === 'remove') {
      finalAdjustment = -amount;
    } else if (adjustmentType === 'set') {
      finalAdjustment = amount - item.currentStock;
    }

    adjustStock(item.productId, finalAdjustment, reason, 'Priya Varma');
    sounds.playCelebration();
    onClose();
  };

  const calculatedNewStock = 
    adjustmentType === 'add' ? item.currentStock + amount :
    adjustmentType === 'remove' ? Math.max(0, item.currentStock - amount) :
    amount;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FFF7E8] text-[#7A0F29] border border-amber-200 uppercase">
              Stock Adjustment
            </span>
            <h3 className="text-xl font-black font-display text-[#171316] mt-1">
              Adjust Inventory Level
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-800 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product preview */}
        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3 text-xs">
          <img
            src={item.image}
            alt={item.productName}
            className="w-12 h-12 rounded-xl object-contain bg-white border border-stone-200 p-1"
          />
          <div>
            <p className="font-bold text-[#171316] text-sm">{item.productName}</p>
            <p className="text-stone-500 font-mono">SKU: {item.sku}</p>
            <p className="text-stone-700 font-bold mt-0.5">Current Stock: {item.currentStock} units</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Mode Selector */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">Adjustment Action</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentType('add')}
                className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                  adjustmentType === 'add' ? 'bg-[#7A0F29] text-white border-[#7A0F29]' : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                + Restock
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('remove')}
                className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                  adjustmentType === 'remove' ? 'bg-red-700 text-white border-red-700' : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                - Write-off
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdjustmentType('set');
                  setAmount(item.currentStock);
                }}
                className={`py-2 px-3 rounded-xl font-bold border transition-colors cursor-pointer ${
                  adjustmentType === 'set' ? 'bg-stone-800 text-white border-stone-800' : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}
              >
                Set Exact
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              {adjustmentType === 'add' ? 'Units to Add' : adjustmentType === 'remove' ? 'Units to Deduct' : 'New Exact Stock Level'}
            </label>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-base font-black"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">Reason / Note for Audit Trail</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
            >
              <option value="Fresh kitchen batch production">Fresh kitchen batch production</option>
              <option value="Supplier restock shipment arrived">Supplier restock shipment arrived</option>
              <option value="Physical count inventory audit">Physical count inventory audit</option>
              <option value="Damaged during cryo-packaging">Damaged during cryo-packaging</option>
              <option value="Promotional sampling / Tasting event">Promotional sampling / Tasting event</option>
            </select>
          </div>

          {/* New Stock Preview Banner */}
          <div className="p-3 bg-[#FFF7E8] border border-amber-200/80 rounded-2xl flex items-center justify-between">
            <span className="font-bold text-[#7A0F29]">New Resulting Stock:</span>
            <span className="text-base font-black text-[#171316]">{calculatedNewStock} units</span>
          </div>

          {/* Actions */}
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
              <span>Apply Adjustment</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
