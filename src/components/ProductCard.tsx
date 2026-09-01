import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Sparkles, Heart, Plus, Star, MapPin, Eye, Check } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist, setSelectedProductModal } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const isWishlisted = wishlist.includes(product.id);

  const handleCardClick = () => {
    sounds.playClick();
    setSelectedProductModal(product);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-[#3D0713]/90 hover:bg-[#52091B] border-2 border-[#F2C76E]/30 hover:border-[#F2C76E] rounded-3xl p-5 shadow-xl hover:shadow-[0_20px_45px_rgba(0,0,0,0.65),0_0_25px_rgba(244,189,56,0.12)] transition-all duration-300 transform hover:-translate-y-2 hover:rotate-[0.5deg] flex flex-col justify-between cursor-pointer backdrop-blur-md overflow-hidden"
    >
      {/* Subtle Radial Glow on Hover */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F4BD38]/10 rounded-full blur-2xl group-hover:bg-[#F4BD38]/20 transition-all duration-500 pointer-events-none" />

      {/* Top badges & Wishlist */}
      <div className="flex items-center justify-between z-10">
        {product.badge ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F4BD38] text-[#52091B] text-[10px] font-black uppercase tracking-widest shadow-md transition-transform group-hover:scale-105">
            <Sparkles className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '6s' }} />
            {product.badge}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#F2C76E] bg-[#7A0F29] border border-[#F2C76E]/30 px-2.5 py-0.5 rounded-full">
            Fresh Drop
          </span>
        )}

        <button
          onClick={handleWishlistClick}
          className={`p-2 rounded-full border transition-all transform active:scale-90 ${
            isWishlisted
              ? 'bg-[#F4BD38] text-[#52091B] border-[#F4BD38] scale-105'
              : 'bg-[#52091B] text-[#F2C76E] border-[#F2C76E]/30 hover:bg-[#F4BD38] hover:text-[#52091B]'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 transition-transform ${isWishlisted ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
        </button>
      </div>

      {/* Product Image Stage */}
      <div className="relative my-4 aspect-square rounded-2xl overflow-hidden bg-[#2A050D] border border-[#F2C76E]/20 flex items-center justify-center p-2.5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl transform group-hover:scale-108 transition-transform duration-500 will-change-transform"
          referrerPolicy="no-referrer"
        />

        {/* City tag overlay on image */}
        <div className="absolute bottom-2.5 left-2.5 bg-[#2A050D]/95 backdrop-blur-sm border border-[#F2C76E]/40 text-[#FFF7E8] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
          <MapPin className="w-2.5 h-2.5 text-[#F2C76E]" />
          <span>{product.cityInspiration.split('(')[0]}</span>
        </div>

        {/* Quick view hover icon */}
        <div className="absolute inset-0 bg-[#2A050D]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-[#F4BD38] text-[#52091B] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5 border border-[#52091B] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-3.5 h-3.5 text-[#52091B]" />
            Flavour Breakdown
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#F4BD38]">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating}</span>
            <span className="text-[#FFF7E8]/50 font-normal">({product.reviewCount})</span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#F2C76E] bg-[#52091B] border border-[#F2C76E]/30 px-2 py-0.5 rounded-md">
            {product.temperature}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-black text-[#FFF7E8] font-display group-hover:text-[#F2C76E] transition-colors italic">
            {product.name}
          </h3>
          <p className="text-xs font-bold text-[#F2C76E] uppercase tracking-wide opacity-90 mt-0.5 line-clamp-1">
            {product.flavorCombination}
          </p>
        </div>

        <p className="text-xs text-[#FFF7E8]/75 line-clamp-2 leading-relaxed">{product.description}</p>
      </div>

      {/* Price & Add to Cart Footer */}
      <div className="mt-4 pt-3.5 border-t border-[#F2C76E]/20 flex items-center justify-between z-10">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-[#F2C76E] font-display">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-[#FFF7E8]/40 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#FFF7E8]/60">Collectible Can</span>
        </div>

        <button
          onClick={handleAddClick}
          className={`px-5 py-2.5 font-bold text-xs uppercase tracking-widest rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-1.5 border btn-shimmer-sheen ${
            justAdded
              ? 'bg-emerald-500 text-white border-emerald-400 scale-105 shadow-emerald-500/30'
              : 'bg-[#F4BD38] hover:bg-[#FFF7E8] text-[#52091B] border-[#52091B]'
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-[#52091B]" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
