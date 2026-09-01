import React, { useState, useEffect, useRef } from 'react';
import { useStoreData } from '../../../context/StoreDataContext';
import { Product } from '../../../types';
import { 
  X, 
  Sparkles, 
  Package, 
  Save, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Star, 
  Clock, 
  Layers, 
  Palette, 
  Tag, 
  Check, 
  Plus, 
  Trash2,
  RefreshCw,
  Upload,
  FolderOpen,
  CheckCircle2,
  ImagePlus,
  FileImage
} from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { generateSlug } from '../../../lib/supabase';
import { delhiPopImg, kolkataPopImg, lucknowPopImg, planterCanImg } from '../../../data/products';

interface AdminProductModalProps {
  product: Product | null; // null means Add New
  isOpen: boolean;
  onClose: () => void;
}

const CANISTER_PRESETS = [
  { name: 'Mithai Crimson', hex: '#7A0F29' },
  { name: 'Marigold Gold', hex: '#F4BD38' },
  { name: 'Royal Rose', hex: '#9D174D' },
  { name: 'Saffron Amber', hex: '#D97706' },
  { name: 'Pistachio Green', hex: '#2D5A27' },
  { name: 'Kesar Cream', hex: '#FDE68A' },
  { name: 'Midnight Charcoal', hex: '#1C1917' },
];

const IMAGE_PRESETS = [
  { name: 'Delhi Canister', url: delhiPopImg },
  { name: 'Lucknow Canister', url: lucknowPopImg },
  { name: 'Kolkata Canister', url: kolkataPopImg },
  { name: 'Planter Edition', url: planterCanImg },
  { name: 'Pistachio Rabdi Tin', url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600' },
  { name: 'Saffron Cream Tin', url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600' }
];

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Gelatin-Free',
  'Gluten-Free',
  '100% Natural Flavors',
  'Zero Preservatives',
  'Eggless',
  'Nut-Free'
];

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addProduct, updateProduct } = useStoreData();

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    sku: '',
    category: 'Signature Classics',
    price: 249,
    originalPrice: 299,
    compareAtPrice: 299,
    description: '',
    flavor: '',
    flavorCombination: '',
    traditionalRoot: '',
    modernTwist: '',
    city: 'Delhi',
    cityInspiration: 'Delhi',
    sweetnessLevel: 3,
    texture: 'Creamy & Crispy',
    image: delhiPopImg,
    thumbnail: delhiPopImg,
    images: [delhiPopImg],
    ingredients: ['Milk Solids', 'Cardamom', 'Gold Vark'],
    dietary: ['Vegetarian', 'Gelatin-Free'],
    canisterColor: '#7A0F29',
    accentColor: '#F4BD38',
    inventoryQuantity: 50,
    inventoryCount: 50,
    lowStockThreshold: 10,
    isBestSeller: false,
    isFeatured: false,
    isPreorder: false,
    isAvailableForPreOrder: false,
    isActive: true,
    displayOrder: 1,
  });

  const [ingredientsText, setIngredientsText] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string[]>(['Vegetarian', 'Gelatin-Free']);
  const [extraImageUrl, setExtraImageUrl] = useState('');
  const [imageInputMode, setImageInputMode] = useState<'device' | 'url' | 'presets'>('device');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        slug: product.slug || generateSlug(product.name),
        price: product.price,
        compareAtPrice: product.compareAtPrice || product.originalPrice,
        inventoryQuantity: product.inventoryQuantity ?? product.inventoryCount ?? 50,
        isPreorder: product.isPreorder ?? product.isAvailableForPreOrder ?? false,
        isActive: product.isActive !== undefined ? product.isActive : true
      });
      setIngredientsText(product.ingredients?.join(', ') || '');
      setSelectedDietary(product.dietary || ['Vegetarian', 'Gelatin-Free']);
    } else {
      const initialName = '';
      setFormData({
        name: '',
        slug: '',
        sku: `MP-POP-${Math.floor(100 + Math.random() * 900)}`,
        category: 'Signature Classics',
        price: 249,
        originalPrice: 299,
        compareAtPrice: 299,
        description: '',
        flavor: '',
        flavorCombination: '',
        traditionalRoot: '',
        modernTwist: '',
        city: 'Delhi',
        cityInspiration: 'Delhi',
        sweetnessLevel: 3,
        texture: 'Silky Creamy with Crisp Shell',
        image: lucknowPopImg,
        thumbnail: lucknowPopImg,
        images: [lucknowPopImg],
        ingredients: ['Milk Solids', 'Cardamom', 'Pistachio'],
        dietary: ['Vegetarian', 'Gelatin-Free'],
        canisterColor: '#7A0F29',
        accentColor: '#F4BD38',
        inventoryQuantity: 50,
        inventoryCount: 50,
        lowStockThreshold: 10,
        isBestSeller: false,
        isFeatured: false,
        isPreorder: false,
        isAvailableForPreOrder: false,
        isActive: true,
        displayOrder: 10
      });
      setIngredientsText('Milk Solids, Cardamom, Pistachio');
      setSelectedDietary(['Vegetarian', 'Gelatin-Free']);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFormData(prev => ({
          ...prev,
          image: base64,
          thumbnail: base64,
          images: [base64, ...(prev.images || []).filter(img => img !== base64)]
        }));
        sounds.playClick();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleNameChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      name: val,
      slug: !product ? generateSlug(val) : (prev.slug || generateSlug(val))
    }));
  };

  const handleToggleDietary = (item: string) => {
    setSelectedDietary(prev =>
      prev.includes(item) ? prev.filter(d => d !== item) : [...prev, item]
    );
  };

  const handleAddExtraImage = () => {
    if (!extraImageUrl.trim()) return;
    const currentImgs = formData.images || [];
    setFormData(prev => ({
      ...prev,
      images: [...currentImgs, extraImageUrl.trim()]
    }));
    setExtraImageUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const currentImgs = formData.images || [];
    setFormData(prev => ({
      ...prev,
      images: currentImgs.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ingList = ingredientsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const mainImage = formData.image || (formData.images && formData.images[0]) || delhiPopImg;

    const preparedProduct = {
      ...formData,
      slug: formData.slug || generateSlug(formData.name || 'new-pop'),
      image: mainImage,
      thumbnail: mainImage,
      images: formData.images && formData.images.length > 0 ? formData.images : [mainImage],
      flavor: formData.flavorCombination || formData.flavor || '',
      flavorCombination: formData.flavorCombination || formData.flavor || '',
      city: formData.cityInspiration || formData.city || 'Delhi',
      cityInspiration: formData.cityInspiration || formData.city || 'Delhi',
      ingredients: ingList.length > 0 ? ingList : ['Milk Solids', 'Cardamom'],
      dietary: selectedDietary.length > 0 ? selectedDietary : ['Vegetarian'],
      price: Number(formData.price),
      originalPrice: Number(formData.compareAtPrice || formData.originalPrice || formData.price),
      compareAtPrice: Number(formData.compareAtPrice || formData.originalPrice || formData.price),
      inventoryQuantity: Number(formData.inventoryQuantity || formData.inventoryCount || 50),
      inventoryCount: Number(formData.inventoryQuantity || formData.inventoryCount || 50),
      lowStockThreshold: Number(formData.lowStockThreshold || 10),
      isBestSeller: Boolean(formData.isBestSeller),
      isFeatured: Boolean(formData.isFeatured),
      isPreorder: Boolean(formData.isPreorder ?? formData.isAvailableForPreOrder),
      isAvailableForPreOrder: Boolean(formData.isPreorder ?? formData.isAvailableForPreOrder),
      isActive: formData.isActive !== undefined ? Boolean(formData.isActive) : true,
    } as Product;

    if (product) {
      updateProduct(product.id, preparedProduct);
    } else {
      addProduct(preparedProduct);
    }

    sounds.playCelebration();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[94vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FFF7E8] text-[#7A0F29] border border-amber-200 uppercase">
                {product ? 'Database Product Editor' : 'New Database Record'}
              </span>
              <span className="text-[10px] font-bold text-stone-400 font-mono">
                {product ? `ID: ${product.id}` : 'Auto-assigned UUID'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-[#171316] mt-1">
              {product ? `Edit "${product.name}"` : 'Create New Mithai Pop Canister'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Section 1: General Product Identity */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#7A0F29]" />
              <span>General Identity & SEO</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Pop Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Kashmiri Saffron Rabdi Pop"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#7A0F29]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">SKU Code *</label>
                <input
                  type="text"
                  required
                  value={formData.sku || ''}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g. MP-SAF-001"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs font-bold focus:outline-none focus:border-[#7A0F29]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">URL Slug</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="kashmiri-saffron-rabdi-pop"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-[11px] focus:outline-none focus:border-[#7A0F29]"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, slug: generateSlug(p.name || '') }))}
                    className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-600 cursor-pointer"
                    title="Generate from name"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Category</label>
                <select
                  value={formData.category || 'Signature Classics'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold focus:outline-none focus:border-[#7A0F29]"
                >
                  <option value="Signature Classics">Signature Classics</option>
                  <option value="Street Remix">Street Remix</option>
                  <option value="Royal Heritage">Royal Heritage</option>
                  <option value="Chilled">Chilled Kulfi</option>
                  <option value="Festival Royale">Festival Royale</option>
                  <option value="Limited Edition Drops">Limited Edition Drops</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">City Inspiration</label>
                <input
                  type="text"
                  value={formData.cityInspiration || formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, cityInspiration: e.target.value, city: e.target.value })}
                  placeholder="e.g. Lucknow & Varanasi"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold focus:outline-none focus:border-[#7A0F29]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Flavor Architecture */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F4BD38]" />
              <span>Flavor Architecture & Story</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block font-bold text-stone-700 mb-1">Flavor Remix Combination *</label>
                <input
                  type="text"
                  required
                  value={formData.flavorCombination || formData.flavor || ''}
                  onChange={(e) => setFormData({ ...formData, flavorCombination: e.target.value, flavor: e.target.value })}
                  placeholder="e.g. Crispy Jalebi × Silky Saffron Rabri"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold focus:outline-none focus:border-[#7A0F29]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Traditional Root</label>
                <input
                  type="text"
                  value={formData.traditionalRoot || ''}
                  onChange={(e) => setFormData({ ...formData, traditionalRoot: e.target.value })}
                  placeholder="e.g. Purani Dilli Gali Paranthe Rabri"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#7A0F29]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Modern Twist</label>
                <input
                  type="text"
                  value={formData.modernTwist || ''}
                  onChange={(e) => setFormData({ ...formData, modernTwist: e.target.value })}
                  placeholder="e.g. Freeze-dried crunch & French cream core"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#7A0F29]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Sweetness Level ({formData.sweetnessLevel || 3}/5)</label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={formData.sweetnessLevel || 3}
                  onChange={(e) => setFormData({ ...formData, sweetnessLevel: Number(e.target.value) })}
                  className="w-full accent-[#7A0F29] cursor-pointer mt-2"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-bold text-stone-700 mb-1">Product Description / Sensory Notes</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Crisp artisanal freeze-dried Rabdi paired with crushed Persian pistachios and pure Kashmiri Kesar..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl leading-relaxed focus:outline-none focus:border-[#7A0F29]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pricing & Inventory */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-700" />
              <span>Pricing & Stock Management</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.price || 0}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-sm text-[#171316] focus:outline-none focus:border-[#7A0F29]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Compare At Price (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.compareAtPrice || formData.originalPrice || 0}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value), originalPrice: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-500 font-medium focus:outline-none focus:border-[#7A0F29]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Current Stock (units)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.inventoryQuantity ?? formData.inventoryCount ?? 0}
                  onChange={(e) => setFormData({ ...formData, inventoryQuantity: Number(e.target.value), inventoryCount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-sm focus:outline-none focus:border-[#7A0F29]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Low Stock Alert Threshold</label>
                <input
                  type="number"
                  min={1}
                  value={formData.lowStockThreshold || 10}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#7A0F29]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Imagery & Canister Styling */}
          <div className="space-y-4 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-700" />
                <span>Canister Visuals & Imagery</span>
              </h4>
              <span className="text-[10px] text-stone-400 font-medium">Device upload, URL, or Presets</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left Column: Active Image Preview */}
              <div className="lg:col-span-4 bg-stone-50 border border-stone-200 rounded-2xl p-3.5 flex flex-col items-center justify-between gap-3 text-center">
                <div className="w-full flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Current Visual</span>
                  </span>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: lucknowPopImg, thumbnail: lucknowPopImg }))}
                      className="text-[10px] font-bold text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>

                <div className="w-full aspect-square rounded-xl bg-white border border-stone-200/80 p-3 flex items-center justify-center relative overflow-hidden shadow-inner">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt={formData.name || 'Product preview'}
                      className="w-full h-full object-contain drop-shadow-md transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="text-stone-300 flex flex-col items-center gap-1">
                      <ImageIcon className="w-10 h-10" />
                      <span className="text-[10px] text-stone-400">No Image Set</span>
                    </div>
                  )}
                </div>

                <div className="w-full text-left bg-white px-3 py-2 rounded-xl border border-stone-200/70">
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Status</p>
                  <p className="text-xs font-bold text-stone-800 truncate">
                    {formData.image?.startsWith('data:') 
                      ? 'Local Device Image Loaded' 
                      : formData.image 
                      ? 'Active Image Assigned' 
                      : 'Default Studio Fallback'}
                  </p>
                </div>
              </div>

              {/* Middle/Right Column: Image Source Switcher & Color Branding */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
                  <button
                    type="button"
                    onClick={() => { setImageInputMode('device'); sounds.playClick(); }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      imageInputMode === 'device'
                        ? 'bg-white text-[#7A0F29] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setImageInputMode('presets'); sounds.playClick(); }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      imageInputMode === 'presets'
                        ? 'bg-white text-[#7A0F29] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <ImagePlus className="w-3.5 h-3.5" />
                    <span>Studio Presets</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setImageInputMode('url'); sounds.playClick(); }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      imageInputMode === 'url'
                        ? 'bg-white text-[#7A0F29] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Image URL</span>
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />

                {/* Tab 1: Device Upload Zone */}
                {imageInputMode === 'device' && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      isDraggingOver
                        ? 'border-[#7A0F29] bg-[#FFF7E8]'
                        : 'border-stone-300 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-400'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-xs text-[#7A0F29]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">
                        Click to browse local device, or drag & drop image here
                      </span>
                      <span className="text-[10px] text-stone-500 block mt-0.5">
                        Supports PNG, JPG, JPEG, WEBP, or SVG from your computer/phone
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="mt-1 px-4 py-1.5 bg-[#7A0F29] text-[#FFF7E8] rounded-xl text-xs font-bold hover:bg-[#52091B] shadow-xs cursor-pointer"
                    >
                      Browse Files
                    </button>
                  </div>
                )}

                {/* Tab 2: Studio Presets */}
                {imageInputMode === 'presets' && (
                  <div className="space-y-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-600 block">
                      Choose from Signature Mithai Pop studio 3D canisters:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: preset.url, thumbnail: preset.url }))}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            formData.image === preset.url
                              ? 'bg-[#7A0F29] text-white border-[#7A0F29] shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-7 h-7 object-contain shrink-0" />
                          <span className="text-[11px] font-bold truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 3: Image URL */}
                {imageInputMode === 'url' && (
                  <div className="space-y-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                    <label className="block font-bold text-stone-700 text-xs">
                      Web or CDN Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.image?.startsWith('data:') ? '' : (formData.image || '')}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value, thumbnail: e.target.value })}
                      placeholder="https://images.unsplash.com/... or cloud asset URL"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl font-mono text-[11px] focus:outline-none focus:border-[#7A0F29]"
                    />
                    <p className="text-[10px] text-stone-500">
                      If an image is already loaded, you can safely leave this as is.
                    </p>
                  </div>
                )}

                {/* Canister Hex Color Picker & Preset Swatches */}
                <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 text-xs mb-1">
                      Canister Branding Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.canisterColor || '#7A0F29'}
                        onChange={(e) => setFormData({ ...formData, canisterColor: e.target.value, accentColor: e.target.value })}
                        className="w-9 h-9 p-0.5 rounded-xl border border-stone-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.canisterColor || '#7A0F29'}
                        onChange={(e) => setFormData({ ...formData, canisterColor: e.target.value, accentColor: e.target.value })}
                        className="w-28 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs uppercase font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">Palette Presets</span>
                    <div className="flex flex-wrap gap-1.5">
                      {CANISTER_PRESETS.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, canisterColor: c.hex, accentColor: c.hex }))}
                          className="w-5 h-5 rounded-full border border-black/10 shadow-xs cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Section 5: Ingredients & Dietary */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>Ingredients & Dietary Standards</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Ingredients (comma-separated)</label>
                <input
                  type="text"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  placeholder="Milk Solids, Roasted Pistachio, Kashmiri Saffron, Cardamom, Edible Gold Vark"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#7A0F29]"
                />
              </div>

              <div>
                <span className="block font-bold text-stone-700 mb-1.5">Dietary & Clean-Label Badges</span>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((tag) => {
                    const isChecked = selectedDietary.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleDietary(tag)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isChecked
                            ? 'bg-[#7A0F29] text-white border-[#7A0F29] shadow-xs'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-[#F4BD38]" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Storefront Visibility & Drop Statuses */}
          <div className="space-y-3 pt-3 border-t border-stone-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-400">
              Storefront Flags & Promotion
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Active on Storefront */}
              <label className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-2xl border border-stone-200 cursor-pointer hover:border-stone-300">
                <input
                  type="checkbox"
                  checked={formData.isActive !== false}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#7A0F29] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#171316] block">Active / Live</span>
                  <span className="text-[10px] text-stone-500 leading-tight block">Visible for customers to buy</span>
                </div>
              </label>

              {/* Best Seller */}
              <label className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-2xl border border-stone-200 cursor-pointer hover:border-stone-300">
                <input
                  type="checkbox"
                  checked={!!formData.isBestSeller}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                  className="w-4 h-4 rounded text-[#7A0F29] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#171316] block">Best Seller</span>
                  <span className="text-[10px] text-stone-500 leading-tight block">Showcase in top hero row</span>
                </div>
              </label>

              {/* Featured */}
              <label className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-2xl border border-stone-200 cursor-pointer hover:border-stone-300">
                <input
                  type="checkbox"
                  checked={!!formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#7A0F29] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#171316] block">Featured on Home</span>
                  <span className="text-[10px] text-stone-500 leading-tight block">Pin to primary showcase</span>
                </div>
              </label>

              {/* Pre-Order */}
              <label className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-2xl border border-stone-200 cursor-pointer hover:border-stone-300">
                <input
                  type="checkbox"
                  checked={!!(formData.isPreorder ?? formData.isAvailableForPreOrder)}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    isPreorder: e.target.checked, 
                    isAvailableForPreOrder: e.target.checked 
                  })}
                  className="w-4 h-4 rounded text-[#7A0F29] mt-0.5"
                />
                <div>
                  <span className="font-bold text-[#171316] block">Pre-Order Drop</span>
                  <span className="text-[10px] text-stone-500 leading-tight block">Collect reservations</span>
                </div>
              </label>

            </div>
          </div>

          {/* Action Buttons */}
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
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7A0F29] text-[#FFF7E8] font-black rounded-xl hover:bg-[#52091B] cursor-pointer shadow-md active:scale-95 transition-transform"
            >
              <Save className="w-4 h-4" />
              <span>{product ? 'Save & Sync to Database' : 'Publish Product to DB'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

