import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { InventoryItem } from '../../../types';
import { 
  Layers, 
  Search, 
  Download, 
  AlertTriangle, 
  Plus, 
  Minus, 
  RefreshCw, 
  Filter, 
  X,
  Edit2
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface AdminInventoryTabProps {
  onOpenStockAdjust: (item: InventoryItem) => void;
}

export const AdminInventoryTab: React.FC<AdminInventoryTabProps> = ({ onOpenStockAdjust }) => {
  const { inventory, updateLowStockThreshold, exportDataToCSV } = useStoreData();
  const [invSearch, setInvSearch] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('all');
  const [editingThresholdId, setEditingThresholdId] = useState<string | null>(null);
  const [newThresholdValue, setNewThresholdValue] = useState<number>(10);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = 
        !invSearch.trim() ||
        item.productName.toLowerCase().includes(invSearch.toLowerCase()) ||
        item.sku.toLowerCase().includes(invSearch.toLowerCase());

      const matchesStatus = stockStatusFilter === 'all' || item.status === stockStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inventory, invSearch, stockStatusFilter]);

  const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;
  const totalStockUnits = inventory.reduce((sum, i) => sum + i.currentStock, 0);
  const totalReservedUnits = inventory.reduce((sum, i) => sum + i.reservedStock, 0);

  const handleSaveThreshold = (productId: string) => {
    updateLowStockThreshold(productId, newThresholdValue);
    setEditingThresholdId(null);
    sounds.playClick();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-display text-[#171316]">
            Inventory & Cold-Storage Levels
          </h2>
          <p className="text-xs text-stone-500">
            Real-time batch stock tracking, reserved fulfillment units, and safety threshold triggers.
          </p>
        </div>

        <button
          onClick={() => exportDataToCSV('inventory')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Stock CSV</span>
        </button>
      </div>

      {/* Stock Health Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total On-Hand Stock</span>
            <p className="text-2xl font-black font-display text-[#171316] mt-0.5">{totalStockUnits} units</p>
          </div>
          <Layers className="w-6 h-6 text-[#7A0F29]" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Reserved in Orders</span>
            <p className="text-2xl font-black font-display text-amber-900 mt-0.5">{totalReservedUnits} units</p>
          </div>
          <RefreshCw className="w-6 h-6 text-amber-500" />
        </div>

        <div className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between ${
          lowStockCount > 0 ? 'bg-red-50/70 border-red-200 text-red-900' : 'bg-white border-stone-200'
        }`}>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Low Stock Triggers</span>
            <p className="text-2xl font-black font-display mt-0.5">{lowStockCount} items</p>
          </div>
          <AlertTriangle className={`w-6 h-6 ${lowStockCount > 0 ? 'text-red-600 animate-pulse' : 'text-stone-400'}`} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={invSearch}
            onChange={(e) => setInvSearch(e.target.value)}
            placeholder="Search by pop name or SKU..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
          />
          {invSearch && (
            <button
              onClick={() => setInvSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={stockStatusFilter}
          onChange={(e) => setStockStatusFilter(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#7A0F29]"
        >
          <option value="all">All Inventory ({inventory.length})</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock Alert</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

      </div>

      {/* Inventory Table */}
      {filteredInventory.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-3 shadow-xs">
          <Layers className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
          <p className="text-base font-bold text-stone-600">No Inventory Items Found</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Pop Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4">Reserved</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Low Stock Alert Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredInventory.map((item) => (
                  <tr key={item.productId} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#171316]">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-9 h-9 rounded-lg object-contain bg-white border border-stone-200"
                        />
                        <span>{item.productName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-500 font-medium">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#171316]">
                      {item.currentStock}
                    </td>
                    <td className="py-3.5 px-4 text-amber-700 font-medium">
                      {item.reservedStock}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">
                      {item.availableStock}
                    </td>
                    <td className="py-3.5 px-4">
                      {editingThresholdId === item.productId ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={newThresholdValue}
                            onChange={(e) => setNewThresholdValue(Number(e.target.value))}
                            className="w-14 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs"
                          />
                          <button
                            onClick={() => handleSaveThreshold(item.productId)}
                            className="p-1 bg-[#7A0F29] text-white rounded-lg text-[10px] font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingThresholdId(null)}
                            className="p-1 text-stone-400"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-stone-600">
                          <span>≤ {item.lowStockThreshold} units</span>
                          <button
                            onClick={() => {
                              setEditingThresholdId(item.productId);
                              setNewThresholdValue(item.lowStockThreshold);
                            }}
                            className="p-1 text-stone-400 hover:text-stone-700"
                            title="Edit low stock threshold"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'In Stock'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Out of Stock'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900 animate-pulse'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onOpenStockAdjust(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#7A0F29] text-[#FFF7E8] hover:bg-[#52091B] rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        <span>Adjust Stock</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
