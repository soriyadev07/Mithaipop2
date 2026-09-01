import React, { useState } from 'react';
import { Trophy, ShoppingBag, Eye } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { ScrollReveal } from './ScrollReveal';

export const CollectibleShowcase: React.FC = () => {
  const { addToCart, setSelectedProductModal } = useCart();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-20 bg-transparent text-[#FFF7E8] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 z-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4BD38]/20 border border-[#F4BD38]/40 text-[#F2C76E]">
              <Trophy className="w-3.5 h-3.5 text-[#F4BD38]" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">The Art Edition</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-[#FFF7E8] italic">
              Collect India. <span className="text-[#F2C76E] not-italic">One Pop at a time.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#FFF7E8]/85 font-normal max-w-2xl mx-auto leading-relaxed">
              Every edition features unique city-inspired illustrations printed with high-resolution UV lacquers directly on metal. 
              Display them on your shelf, desk, or bookcase.
            </p>
          </div>
        </ScrollReveal>

        {/* 3D-Look Card Showcase Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PRODUCTS.slice(0, 6).map((product, idx) => {
            return (
              <ScrollReveal key={product.id} direction="up" delay={idx * 80}>
                <div
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="bg-[#3D0713]/90 backdrop-blur-md border-2 border-[#F2C76E]/30 hover:border-[#F2C76E] rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group h-full"
                >
                  {/* Top header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C76E] bg-[#52091B] px-3 py-1 rounded-full border border-[#F2C76E]/20">
                      Series 01 • Can #{idx + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FFF7E8]/70">
                      {product.cityInspiration.split('(')[0]}
                    </span>
                  </div>

                  {/* Can Image Stage */}
                  <div className="my-5 aspect-square rounded-2xl overflow-hidden bg-[#2A050D] border border-[#F2C76E]/20 relative p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2A050D]/80 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left bg-[#2A050D]/95 backdrop-blur-sm p-2.5 rounded-xl border border-[#F2C76E]/30">
                      <p className="text-[10px] font-bold text-[#F2C76E] uppercase tracking-widest">Art Theme:</p>
                      <p className="text-[11px] text-[#FFF7E8] font-medium line-clamp-1 mt-0.5">{product.canArtworkDescription}</p>
                    </div>
                  </div>

                  {/* Info & Buy */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-black text-[#FFF7E8] font-display italic">{product.name}</h3>
                      <p className="text-xs font-bold text-[#F2C76E] uppercase tracking-wide mt-0.5">{product.flavorCombination}</p>
                    </div>

                    <div className="pt-3.5 border-t border-[#F2C76E]/20 flex items-center justify-between">
                      <div>
                        <span className="text-xl font-black text-[#F2C76E] font-display">₹{product.price}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFF7E8]/60 block">Art Can</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProductModal(product)}
                          className="p-2.5 bg-[#52091B] hover:bg-[#F2C76E]/20 text-[#FFF7E8] border border-[#F2C76E]/30 rounded-full transition-colors transform active:scale-95"
                          title="View Artwork Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => addToCart(product, 1)}
                          className="px-4 py-2 bg-[#F4BD38] hover:bg-[#FFF7E8] text-[#52091B] font-bold text-xs uppercase tracking-widest rounded-full shadow-md transition-all transform active:scale-95 flex items-center gap-1.5 border border-[#52091B] btn-shimmer-sheen"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#52091B]" />
                          <span>Collect</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
