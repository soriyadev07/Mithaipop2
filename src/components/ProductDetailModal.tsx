import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStoreData } from '../context/StoreDataContext';
import { isPublicPriceVisible } from '../types';
import { X, Star, Sparkles, Plus, Minus, ShoppingBag, MapPin, Heart, Thermometer, Calendar } from 'lucide-react';
import { sounds } from '../utils/audio';
import { tapestryGoldBg } from '../data/products';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductModal, setSelectedProductModal, addToCart, toggleWishlist, wishlist, openWaitlistModal } = useCart();
  const { settings } = useStoreData();
  const [quantity, setQuantity] = useState(1);
  const [isGift, setIsGift] = useState(false);

  if (!selectedProductModal) return null;

  const product = selectedProductModal;
  const isWishlisted = wishlist.includes(product.id);

  const handleClose = () => {
    sounds.playClick();
    setSelectedProductModal(null);
    setQuantity(1);
    setIsGift(false);
  };

  const handleAdd = () => {
    addToCart(product, quantity, isGift);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-[#2A050D] text-[#FFF7E8] rounded-3xl border-2 border-[#F2C76E]/40 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background texture */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url(${tapestryGoldBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A050D]/95 via-[#3D0713]/90 to-[#2A050D] pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#52091B] text-[#FFF7E8] hover:bg-[#F4BD38] hover:text-[#52091B] transition-colors shadow-md border border-[#F2C76E]/30"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Column: Image & Can Details */}
          <div className="md:col-span-5 bg-[#3D0713]/95 p-6 text-[#FFF7E8] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#F2C76E]/20">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-[#F4BD38] text-[#52091B] text-[10px] font-black rounded-full uppercase tracking-widest">
                {product.badge || 'Signature Can'}
              </span>
              <p className="text-xs text-[#F2C76E] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F4BD38]" />
                {product.cityInspiration}
              </p>
            </div>

            <div className="my-6 aspect-square rounded-2xl overflow-hidden bg-[#2A050D] border-2 border-[#F2C76E]/40 p-2.5 shadow-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="bg-[#2A050D]/80 p-3.5 rounded-2xl border border-[#F2C76E]/20 space-y-1 text-left">
              <p className="text-[10px] font-bold text-[#F2C76E] uppercase tracking-widest">Can Artwork Story:</p>
              <p className="text-xs text-[#FFF7E8]/85 font-normal leading-relaxed">{product.canArtworkDescription}</p>
            </div>
          </div>

          {/* Right Column: Full Product Specs */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#F2C76E] font-hindi">
                  {product.hindiName}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#F4BD38]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-[#FFF7E8]/60 font-normal">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-3xl font-black text-[#FFF7E8] font-display italic mt-1">
                {product.name}
              </h2>
              <p className="text-xs font-bold uppercase tracking-wide text-[#F2C76E] mt-0.5">{product.flavorCombination}</p>
            </div>

            {/* Description */}
            <p className="text-sm text-[#FFF7E8]/85 font-normal leading-relaxed">{product.description}</p>

            {/* Tasting Notes */}
            <div className="bg-[#3D0713]/80 border border-[#F2C76E]/20 p-4 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-[#F2C76E] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F4BD38]" />
                How to Experience:
              </p>
              <p className="text-xs text-[#FFF7E8]/85 font-normal leading-relaxed">{product.pairingNotes}</p>
            </div>

            {/* Ingredients */}
            <div>
              <h4 className="text-[10px] font-bold text-[#F2C76E] uppercase tracking-widest mb-2">
                Ingredients & Artisanal Sourcing:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium bg-[#3D0713] border border-[#F2C76E]/20 text-[#FFF7E8] px-3 py-1 rounded-lg"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#3D0713] p-3 rounded-xl border border-[#F2C76E]/20 flex items-center gap-2.5">
                <Thermometer className="w-4 h-4 text-[#F4BD38]" />
                <div>
                  <p className="text-[10px] text-[#FFF7E8]/60 font-semibold uppercase tracking-wider">Temperature</p>
                  <p className="text-xs font-bold text-[#FFF7E8]">{product.temperature}</p>
                </div>
              </div>

              <div className="bg-[#3D0713] p-3 rounded-xl border border-[#F2C76E]/20 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#F4BD38]" />
                <div>
                  <p className="text-[10px] text-[#FFF7E8]/60 font-semibold uppercase tracking-wider">Freshness</p>
                  <p className="text-xs font-bold text-[#FFF7E8]">{product.shelfLife}</p>
                </div>
              </div>
            </div>

            {/* Actions & Price */}
            <div className="pt-4 border-t border-[#F2C76E]/20 space-y-4">
              <div className="flex items-center justify-between">
                {isPublicPriceVisible(settings.waitlistMode) ? (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#FFF7E8] font-display">
                        ₹{product.price * quantity}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#FFF7E8]/40 line-through">
                          ₹{product.originalPrice * quantity}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-[#FFF7E8]/70">
                      Includes insulated cryogenic ice box
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-[#F4BD38] font-display uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#F4BD38]" /> Pre-Launch Drop
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-[#FFF7E8]/70">
                      Signature collectible edition • Includes cryogenic packaging
                    </span>
                  </div>
                )}

                {/* Quantity adjuster (only in normal shopping mode) */}
                {!settings.waitlistMode && (
                  <div className="flex items-center gap-2 bg-[#3D0713] border border-[#F2C76E]/30 rounded-full px-3 py-1 shadow-inner">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setQuantity((q) => Math.max(1, q - 1));
                      }}
                      className="text-[#F2C76E] hover:bg-[#52091B] p-1 rounded-full cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold text-[#FFF7E8] w-5 text-center">{quantity}</span>
                    <button
                      onClick={() => {
                        sounds.playClick();
                        setQuantity((q) => q + 1);
                      }}
                      className="text-[#F2C76E] hover:bg-[#52091B] p-1 rounded-full cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {settings.waitlistMode ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#52091B]/80 border border-[#F4BD38]/30 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#F4BD38] mt-0.5 shrink-0" />
                    <p className="text-xs text-[#FFF7E8]/90 leading-relaxed">
                      We are preparing the first fresh batch. Join the waitlist to get priority access on launch day.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        sounds.playClick();
                        handleClose();
                        openWaitlistModal(product.name);
                      }}
                      className="flex-1 py-3.5 bg-[#F4BD38] hover:bg-[#FFF7E8] text-[#52091B] font-black text-xs uppercase tracking-widest rounded-full shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-[#F4BD38] cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#52091B]" />
                      <span>Join the Waitlist</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                        isWishlisted
                          ? 'bg-[#F4BD38] text-[#52091B] border-[#F4BD38]'
                          : 'bg-[#3D0713] text-[#F2C76E] border-[#F2C76E]/30 hover:bg-[#52091B]'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Add & Wishlist buttons */
                <div className="flex gap-3">
                  <button
                    onClick={handleAdd}
                    className="flex-1 py-3.5 bg-[#F4BD38] hover:bg-[#FFF7E8] text-[#52091B] font-black text-xs uppercase tracking-widest rounded-full shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-[#F4BD38] cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#52091B]" />
                    <span>Add {quantity} Can{quantity > 1 ? 's' : ''} to Cart</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                      isWishlisted
                        ? 'bg-[#F4BD38] text-[#52091B] border-[#F4BD38]'
                        : 'bg-[#3D0713] text-[#F2C76E] border-[#F2C76E]/30 hover:bg-[#52091B]'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
