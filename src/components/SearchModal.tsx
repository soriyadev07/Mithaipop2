import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS, tapestryGoldBg } from '../data/products';
import { Search, X, Star } from 'lucide-react';
import { sounds } from '../utils/audio';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, setSelectedProductModal, addToCart } = useCart();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const handleClose = () => {
    sounds.playClick();
    setSearchOpen(false);
    setQuery('');
  };

  const filtered = PRODUCTS.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.flavorCombination.toLowerCase().includes(q) ||
      p.cityInspiration.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.ingredients.some((ing) => ing.toLowerCase().includes(q))
    );
  });

  const popularTags = ['Gulab Jamun', 'Jalebi Rabri', 'Mishti Doi', 'Delhi', 'Kolkata', 'Saffron', 'Kulfi'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#2A050D] text-[#FFF7E8] rounded-3xl border-2 border-[#F2C76E]/40 shadow-2xl overflow-hidden mt-12 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Texture */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url(${tapestryGoldBg})` }}
        />

        {/* Search input box */}
        <div className="relative z-10 p-4 sm:p-6 bg-[#3D0713]/95 text-[#FFF7E8] flex items-center gap-3 border-b border-[#F2C76E]/30">
          <Search className="w-5 h-5 text-[#F4BD38]" />
          <input
            type="text"
            autoFocus
            placeholder="Search flavours, cities, ingredients (e.g. Rabri, Gulab Jamun, Kolkata)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-base sm:text-lg text-[#FFF7E8] placeholder-[#FFF7E8]/50 focus:outline-none"
          />
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full bg-[#52091B] hover:bg-[#F4BD38] hover:text-[#52091B] transition-colors border border-[#F2C76E]/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        <div className="relative z-10 px-6 py-3 bg-[#3D0713]/80 border-b border-[#F2C76E]/20 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-[#F2C76E] uppercase tracking-wider text-[10px] shrink-0">Popular:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 bg-[#2A050D] border border-[#F2C76E]/30 hover:bg-[#F4BD38] hover:text-[#52091B] rounded-full font-bold text-xs text-[#FFF7E8] shrink-0 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="relative z-10 p-4 sm:p-6 max-h-96 overflow-y-auto space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-bold text-[#F2C76E]">No pops found matching "{query}"</p>
              <p className="text-xs text-[#FFF7E8]/60">Try searching for a city, mithai base, or flavor profile.</p>
            </div>
          ) : (
            filtered.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedProductModal(product);
                  handleClose();
                }}
                className="bg-[#3D0713]/90 border border-[#F2C76E]/25 hover:border-[#F2C76E] p-3.5 rounded-2xl flex items-center justify-between gap-4 cursor-pointer shadow-md hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#2A050D] shrink-0 p-1 border border-[#F2C76E]/20">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#FFF7E8] group-hover:text-[#F4BD38] truncate">
                        {product.name}
                      </h4>
                      <span className="text-[10px] text-[#F4BD38] font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        {product.rating}
                      </span>
                    </div>
                    <p className="text-xs text-[#F2C76E]/80 font-medium truncate">{product.flavorCombination}</p>
                    <p className="text-[10px] text-[#FFF7E8]/60 truncate">{product.cityInspiration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-sm font-black text-[#F4BD38] font-display">₹{product.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                      handleClose();
                    }}
                    className="px-3.5 py-1.5 bg-[#F4BD38] text-[#52091B] text-xs font-black uppercase tracking-wider rounded-full hover:bg-[#FFF7E8] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
