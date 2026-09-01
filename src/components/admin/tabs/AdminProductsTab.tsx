import React, { useState, useMemo } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { Product } from '../../../types';
import { 
  Package, 
  Search, 
  Plus, 
  Download, 
  Edit2, 
  Trash2, 
  Star, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  X,
  Copy,
  Database,
  RefreshCw,
  Archive,
  RotateCcw,
  Eye,
  EyeOff,
  Clock,
  Layers,
  Sliders,
  Flame,
  CheckSquare,
  Square
} from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface AdminProductsTabProps {
  onOpenAddProduct: () => void;
  onOpenEditProduct: (product: Product) => void;
}

type StatusTab = 'all' | 'active' | 'draft' | 'archived' | 'low_stock' | 'bestsellers' | 'preorder';

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  onOpenAddProduct,
  onOpenEditProduct,
}) => {
  const { 
    products, 
    deleteProduct, 
    archiveProduct,
    restoreProduct,
    duplicateProduct,
    quickUpdateProduct,
    bulkUpdateProducts,
    adjustStock,
    exportDataToCSV,
    isDatabaseConnected,
    isLoadingProducts,
    reloadProductsFromDatabase
  } = useStoreData();

  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeStatusTab, setActiveStatusTab] = useState<StatusTab>('all');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotificationMsg({ text, type });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: products.length,
      active: products.filter(p => p.isActive !== false && !p.isArchived).length,
      draft: products.filter(p => p.isActive === false && !p.isArchived).length,
      archived: products.filter(p => p.isArchived).length,
      low_stock: products.filter(p => (p.inventoryQuantity ?? p.inventoryCount ?? 0) <= (p.lowStockThreshold || 10)).length,
      bestsellers: products.filter(p => p.isBestSeller && !p.isArchived).length,
      preorder: products.filter(p => (p.isPreorder ?? p.isAvailableForPreOrder) && !p.isArchived).length
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search
      const matchesSearch = 
        !productSearch.trim() ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.flavorCombination && p.flavorCombination.toLowerCase().includes(productSearch.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase())) ||
        (p.cityInspiration && p.cityInspiration.toLowerCase().includes(productSearch.toLowerCase()));

      // Category
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

      // Status Tab
      let matchesStatus = true;
      if (activeStatusTab === 'active') {
        matchesStatus = p.isActive !== false && !p.isArchived;
      } else if (activeStatusTab === 'draft') {
        matchesStatus = p.isActive === false && !p.isArchived;
      } else if (activeStatusTab === 'archived') {
        matchesStatus = Boolean(p.isArchived);
      } else if (activeStatusTab === 'low_stock') {
        matchesStatus = (p.inventoryQuantity ?? p.inventoryCount ?? 0) <= (p.lowStockThreshold || 10);
      } else if (activeStatusTab === 'bestsellers') {
        matchesStatus = Boolean(p.isBestSeller) && !p.isArchived;
      } else if (activeStatusTab === 'preorder') {
        matchesStatus = Boolean(p.isPreorder ?? p.isAvailableForPreOrder) && !p.isArchived;
      }

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, productSearch, selectedCategory, activeStatusTab]);

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkActivate = async () => {
    if (selectedProductIds.length === 0) return;
    await bulkUpdateProducts(selectedProductIds, { isActive: true });
    showToast(`Activated ${selectedProductIds.length} products`);
    setSelectedProductIds([]);
  };

  const handleBulkDeactivate = async () => {
    if (selectedProductIds.length === 0) return;
    await bulkUpdateProducts(selectedProductIds, { isActive: false });
    showToast(`Deactivated ${selectedProductIds.length} products`);
    setSelectedProductIds([]);
  };

  const handleBulkArchive = async () => {
    if (selectedProductIds.length === 0) return;
    for (const id of selectedProductIds) {
      await archiveProduct(id);
    }
    showToast(`Archived ${selectedProductIds.length} products`);
    setSelectedProductIds([]);
  };

  const handleBulkMarkBestSeller = async (value: boolean) => {
    if (selectedProductIds.length === 0) return;
    await bulkUpdateProducts(selectedProductIds, { isBestSeller: value });
    showToast(`${value ? 'Added' : 'Removed'} ${selectedProductIds.length} products from Best Sellers`);
    setSelectedProductIds([]);
  };

  const handleDuplicate = async (p: Product) => {
    try {
      const copy = await duplicateProduct(p.id);
      showToast(`Duplicated "${p.name}" as "${copy.name}"`);
    } catch (e) {
      showToast('Failed to duplicate product', 'error');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the database catalogue?`)) {
      const res = deleteProduct(id);
      showToast(res.message || `Removed "${name}"`, res.success ? 'success' : 'error');
    }
  };

  const handleToggleActive = async (p: Product) => {
    const nextVal = p.isActive === false ? true : false;
    await quickUpdateProduct(p.id, { isActive: nextVal });
    showToast(`Product "${p.name}" is now ${nextVal ? 'Active on Storefront' : 'Draft / Hidden'}`);
  };

  const handleToggleBestSeller = async (p: Product) => {
    const nextVal = !p.isBestSeller;
    await quickUpdateProduct(p.id, { isBestSeller: nextVal });
    showToast(`"${p.name}" ${nextVal ? 'marked as Best Seller' : 'removed from Best Sellers'}`);
  };

  const handleToggleFeatured = async (p: Product) => {
    const nextVal = !p.isFeatured;
    await quickUpdateProduct(p.id, { isFeatured: nextVal });
    showToast(`"${p.name}" ${nextVal ? 'featured on Home' : 'unfeatured'}`);
  };

  const handleTogglePreOrder = async (p: Product) => {
    const nextVal = !(p.isPreorder ?? p.isAvailableForPreOrder);
    await quickUpdateProduct(p.id, { isPreorder: nextVal, isAvailableForPreOrder: nextVal });
    showToast(`"${p.name}" Pre-Order ${nextVal ? 'Enabled' : 'Disabled'}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md animate-in slide-in-from-top duration-200 ${
          notificationMsg.type === 'success' ? 'bg-emerald-800 text-emerald-100' :
          notificationMsg.type === 'error' ? 'bg-red-800 text-red-100' : 'bg-stone-800 text-stone-100'
        }`}>
          <span>{notificationMsg.text}</span>
          <button onClick={() => setNotificationMsg(null)} className="ml-2 hover:opacity-70">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black font-display text-[#171316]">
              Product & Catalog Database
            </h2>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              isDatabaseConnected ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
            }`}>
              <Database className="w-3 h-3" />
              <span>{isDatabaseConnected ? 'Supabase Live' : 'Local Storage Sync'}</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Realtime database management for Mithai Pop canisters, inventory sync, price updates, and drop toggles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => reloadProductsFromDatabase()}
            disabled={isLoadingProducts}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer disabled:opacity-50"
            title="Reload latest from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin text-[#7A0F29]' : ''}`} />
            <span>Sync DB</span>
          </button>

          <button
            onClick={() => exportDataToCSV('products')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddProduct}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A0F29] text-[#FFF7E8] text-xs font-bold hover:bg-[#52091B] shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Pop</span>
          </button>
        </div>
      </div>

      {/* Status Segmented Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200">
        {[
          { id: 'all', label: 'All Products', count: counts.all },
          { id: 'active', label: 'Active on Store', count: counts.active },
          { id: 'draft', label: 'Draft / Inactive', count: counts.draft },
          { id: 'bestsellers', label: 'Best Sellers', count: counts.bestsellers },
          { id: 'preorder', label: 'Pre-Order Drops', count: counts.preorder },
          { id: 'low_stock', label: 'Low Stock', count: counts.low_stock },
          { id: 'archived', label: 'Archived', count: counts.archived },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveStatusTab(tab.id as StatusTab); sounds.playClick(); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeStatusTab === tab.id
                ? 'bg-[#7A0F29] text-[#FFF7E8] shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeStatusTab === tab.id ? 'bg-[#52091B] text-[#F2C76E]' : 'bg-stone-200 text-stone-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Search by pop name, flavor combination, SKU, or city inspiration..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#171316] placeholder:text-stone-400 focus:outline-none focus:border-[#7A0F29]"
          />
          {productSearch && (
            <button
              onClick={() => setProductSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:border-[#7A0F29]"
        >
          {categories.map(c => (
            <option key={c} value={c}>
              {c === 'all' ? 'All Categories' : c}
            </option>
          ))}
        </select>

      </div>

      {/* Bulk Actions Bar (if selected) */}
      {selectedProductIds.length > 0 && (
        <div className="bg-[#7A0F29] text-[#FFF7E8] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <button onClick={handleSelectAll} className="flex items-center gap-1.5 text-xs font-bold">
              <CheckSquare className="w-4 h-4 text-[#F4BD38]" />
              <span>{selectedProductIds.length} of {filteredProducts.length} selected</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={handleBulkActivate}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold cursor-pointer"
            >
              Activate
            </button>
            <button
              onClick={handleBulkDeactivate}
              className="px-3 py-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-white font-bold cursor-pointer"
            >
              Deactivate
            </button>
            <button
              onClick={() => handleBulkMarkBestSeller(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer flex items-center gap-1"
            >
              <Star className="w-3 h-3 fill-current" />
              <span>Best Seller</span>
            </button>
            <button
              onClick={handleBulkArchive}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-black text-stone-200 font-bold cursor-pointer flex items-center gap-1"
            >
              <Archive className="w-3 h-3" />
              <span>Archive</span>
            </button>
            <button
              onClick={() => setSelectedProductIds([])}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Select All Checkbox for Grid */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={handleSelectAll}
          className="flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
            <CheckSquare className="w-4 h-4 text-[#7A0F29]" />
          ) : (
            <Square className="w-4 h-4 text-stone-400" />
          )}
          <span>Select All {filteredProducts.length} items in this view</span>
        </button>
        <span className="text-xs text-stone-400">Showing {filteredProducts.length} products</span>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 space-y-3 shadow-xs">
          <Package className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
          <p className="text-base font-bold text-stone-600">No Pops Match Filter</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Try adjusting your search keywords, category filters, or status tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((prod) => {
            const isLowStock = (prod.inventoryQuantity ?? prod.inventoryCount ?? 0) <= (prod.lowStockThreshold || 10);
            const isSelected = selectedProductIds.includes(prod.id);
            const isArchived = Boolean(prod.isArchived);
            const isDraft = prod.isActive === false && !isArchived;

            return (
              <div 
                key={prod.id}
                className={`bg-white border rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all relative ${
                  isSelected ? 'border-[#7A0F29] ring-2 ring-[#7A0F29]/20' : 
                  isArchived ? 'opacity-75 bg-stone-50 border-stone-300' :
                  isDraft ? 'border-dashed border-amber-300 bg-amber-50/20' :
                  'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  
                  {/* Select Checkbox & Image & Badges */}
                  <div className="relative aspect-4/3 rounded-2xl bg-stone-50 overflow-hidden flex items-center justify-center p-3 border border-stone-100">
                    
                    {/* Selection Checkbox */}
                    <button
                      onClick={() => handleToggleSelect(prod.id)}
                      className="absolute top-2.5 left-2.5 z-10 p-1 bg-white/90 rounded-md shadow-xs text-stone-600 hover:text-[#7A0F29] cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#7A0F29]" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400" />
                      )}
                    </button>

                    <img
                      src={prod.image || prod.thumbnail}
                      alt={prod.name}
                      className={`w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300 ${isArchived ? 'grayscale' : ''}`}
                    />
                    
                    {/* Badges in Image Top Right */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1">
                      {isArchived ? (
                        <span className="px-2 py-0.5 rounded-full bg-stone-700 text-white text-[9px] font-black uppercase tracking-wider">
                          Archived
                        </span>
                      ) : isDraft ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[9px] font-black uppercase tracking-wider">
                          Draft / Hidden
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider">
                          Active
                        </span>
                      )}

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        (prod.inventoryQuantity ?? prod.inventoryCount ?? 0) === 0
                          ? 'bg-red-100 text-red-800'
                          : isLowStock
                          ? 'bg-amber-100 text-amber-900 animate-pulse'
                          : 'bg-stone-100 text-stone-800'
                      }`}>
                        {(prod.inventoryQuantity ?? prod.inventoryCount ?? 0) === 0 ? 'Out of Stock' : `${prod.inventoryQuantity ?? prod.inventoryCount} units`}
                      </span>
                    </div>

                    {/* Feature Toggles on Image Bottom */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-white/95 backdrop-blur-xs px-2 py-1 rounded-xl border border-stone-200 text-[10px] font-bold">
                      <button
                        onClick={() => handleToggleBestSeller(prod)}
                        className={`flex items-center gap-1 cursor-pointer transition-colors ${
                          prod.isBestSeller ? 'text-amber-600' : 'text-stone-400 hover:text-stone-700'
                        }`}
                        title="Toggle Best Seller"
                      >
                        <Star className={`w-3 h-3 ${prod.isBestSeller ? 'fill-current text-amber-500' : ''}`} />
                        <span>Best Seller</span>
                      </button>

                      <button
                        onClick={() => handleToggleFeatured(prod)}
                        className={`flex items-center gap-1 cursor-pointer transition-colors ${
                          prod.isFeatured ? 'text-[#7A0F29]' : 'text-stone-400 hover:text-stone-700'
                        }`}
                        title="Toggle Featured on Home"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Featured</span>
                      </button>

                      <button
                        onClick={() => handleTogglePreOrder(prod)}
                        className={`flex items-center gap-1 cursor-pointer transition-colors ${
                          (prod.isPreorder ?? prod.isAvailableForPreOrder) ? 'text-purple-700 font-black' : 'text-stone-400 hover:text-stone-700'
                        }`}
                        title="Toggle Pre-Order"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Pre-Order</span>
                      </button>
                    </div>

                  </div>

                  {/* Pop Info */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider">{prod.sku || 'SKU-TBD'}</span>
                      <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">{prod.category || 'Signature'}</span>
                    </div>

                    <h3 className="text-base font-black font-display text-[#171316]">
                      {prod.name}
                    </h3>
                    <p className="text-xs font-bold text-[#7A0F29] line-clamp-1">
                      {prod.flavorCombination || prod.flavor || 'Signature Fusion Remix'}
                    </p>
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                </div>

                {/* Stock Adjuster & Actions */}
                <div className="space-y-3 pt-3 border-t border-stone-100">
                  
                  {/* Inline Stock Adjustment Bar */}
                  <div className="flex items-center justify-between bg-stone-50 px-2.5 py-1.5 rounded-xl text-xs">
                    <span className="text-[11px] font-bold text-stone-600">Stock Adjustment</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => adjustStock(prod.id, -5, 'Admin Quick Adjustment')}
                        className="px-1.5 py-0.5 bg-white border border-stone-200 text-stone-700 rounded-md font-bold hover:bg-stone-100 cursor-pointer"
                        title="Minus 5"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => adjustStock(prod.id, -1, 'Admin Quick Adjustment')}
                        className="px-1.5 py-0.5 bg-white border border-stone-200 text-stone-700 rounded-md font-bold hover:bg-stone-100 cursor-pointer"
                        title="Minus 1"
                      >
                        -1
                      </button>
                      <span className="font-mono font-bold px-1.5 text-[#171316]">
                        {prod.inventoryQuantity ?? prod.inventoryCount ?? 0}
                      </span>
                      <button
                        onClick={() => adjustStock(prod.id, 1, 'Admin Quick Adjustment')}
                        className="px-1.5 py-0.5 bg-white border border-stone-200 text-stone-700 rounded-md font-bold hover:bg-stone-100 cursor-pointer"
                        title="Plus 1"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => adjustStock(prod.id, 10, 'Admin Quick Adjustment')}
                        className="px-1.5 py-0.5 bg-white border border-stone-200 text-stone-700 rounded-md font-bold hover:bg-stone-100 cursor-pointer"
                        title="Plus 10"
                      >
                        +10
                      </button>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-[#171316]">₹{prod.price}</span>
                      {(prod.compareAtPrice || prod.originalPrice) && (prod.compareAtPrice || prod.originalPrice)! > prod.price && (
                        <span className="text-xs text-stone-400 line-through ml-1.5 font-medium">
                          ₹{prod.compareAtPrice || prod.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Active/Draft Toggle */}
                      <button
                        onClick={() => handleToggleActive(prod)}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          prod.isActive !== false ? 'text-emerald-700 hover:bg-emerald-50' : 'text-stone-400 hover:bg-stone-100'
                        }`}
                        title={prod.isActive !== false ? 'Click to hide/draft' : 'Click to make live'}
                      >
                        {prod.isActive !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicate(prod)}
                        className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                        title="Duplicate this pop"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onOpenEditProduct(prod)}
                        className="p-2 text-stone-600 hover:text-[#7A0F29] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                        title="Edit pop specifications"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Archive / Restore */}
                      {isArchived ? (
                        <button
                          onClick={() => restoreProduct(prod.id)}
                          className="p-2 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                          title="Restore from archive"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => archiveProduct(prod.id)}
                          className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                          title="Archive product"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

