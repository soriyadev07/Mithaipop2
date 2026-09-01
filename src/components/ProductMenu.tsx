import React, { useState } from 'react';
import { PRODUCTS, BUNDLE_PACKS, tapestryGoldBg } from '../data/products';
import { ProductCard } from './ProductCard';
import { Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';
import { useCart } from '../context/CartContext';
import { ScrollReveal } from './ScrollReveal';

export const ProductMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { addToCart } = useCart();

  const categories = [
    { id: 'all', name: 'All Pops' },
    { id: 'Street Remix', name: 'Street Remix' },
    { id: 'Royal Heritage', name: 'Royal Heritage' },
    { id: 'Chilled', name: 'Chilled Kulfi' },
    { id: 'bundles', name: 'Collector Vaults & Bundles 🎁' },
  ];

  const handleCategoryChange = (id: string) => {
    sounds.playClick();
    setActiveCategory(id);
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'bundles') return false;
    return p.tags.includes(activeCategory);
  });

  return (
    <section id="menu" className="py-20 bg-transparent text-[#FFF7E8] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 z-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F4BD38]/15 border border-[#F4BD38]/30 text-[#F4BD38]">
              <Sparkles className="w-3.5 h-3.5 text-[#F4BD38]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Full Menu</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-[#FFF7E8]">
              The Pops Everyone's Talking About
            </h2>

            <p className="text-sm sm:text-base text-[#FFF7E8]/80 font-medium leading-relaxed max-w-xl mx-auto">
              Freshly whipped artisanal khoya, slow-churned creams, and toasted spices sealed inside airtight collectible tinware. Shipped ice-cold to your door.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal direction="up" delay={120}>
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all transform active:scale-95 ${
                    isActive
                      ? 'bg-[#F4BD38] text-[#52091B] shadow-md scale-105 border border-[#F4BD38] font-black'
                      : 'bg-[#52091B]/80 text-[#FFF7E8] border border-[#F2C76E]/30 hover:bg-[#7A0F29] hover:text-[#FFF7E8]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Product Grid */}
        {activeCategory !== 'bundles' && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product, idx) => (
              <ScrollReveal key={product.id} direction="up" delay={((idx % 3) * 100)}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Bundles / Collector Vaults Section */}
        {(activeCategory === 'bundles' || activeCategory === 'all') && (
          <div className="mt-20 pt-16 border-t border-[#F2C76E]/20">
            <ScrollReveal direction="up">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C76E] bg-[#F4BD38]/20 border border-[#F4BD38]/40 px-3.5 py-1 rounded-full">
                    Collector Vaults & Gifting
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black text-[#FFF7E8] mt-3 font-display italic">
                    Curated Multipacks & Upcycling Kits
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#FFF7E8]/80 font-medium max-w-sm">
                  Each box includes insulated ice-gel packing, luxury gold foil collector box, and complimentary upcycling accessories.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {BUNDLE_PACKS.map((bundle, bIdx) => (
                <ScrollReveal key={bundle.id} direction="up" delay={bIdx * 150}>
                  <div
                    className="bg-[#52091B]/95 text-[#FFF7E8] border-2 border-[#F2C76E]/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row gap-6 items-center justify-between relative overflow-hidden group hover:border-[#F4BD38] transition-all duration-300"
                  >
                    <div className="w-full md:w-1/2 aspect-video md:aspect-square rounded-2xl overflow-hidden bg-[#3D0713] shrink-0 relative border border-[#F2C76E]/20">
                      <img
                        src={bundle.image}
                        alt={bundle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-[#F4BD38] text-[#52091B] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                        {bundle.badge}
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-3">
                      <h4 className="text-2xl font-black text-[#FFF7E8] font-display italic">{bundle.name}</h4>
                      <p className="text-xs font-bold text-[#F2C76E] uppercase tracking-wide">{bundle.tagline}</p>
                      <p className="text-xs text-[#FFF7E8]/80 leading-relaxed font-normal">{bundle.description}</p>

                      <div className="pt-4 border-t border-[#F2C76E]/20 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-black text-[#F2C76E] font-display">₹{bundle.price}</span>
                          <span className="text-xs text-[#FFF7E8]/50 line-through ml-2">₹{bundle.originalPrice}</span>
                        </div>
                        <button
                          onClick={() => {
                            const syntheticProduct = {
                              id: bundle.id,
                              name: bundle.name,
                              flavorCombination: bundle.tagline,
                              tagline: bundle.tagline,
                              description: bundle.description,
                              cityInspiration: 'All India Collector Set',
                              price: bundle.price,
                              originalPrice: bundle.originalPrice,
                              rating: 5.0,
                              reviewCount: 180,
                              image: bundle.image,
                              accentColor: '#F2C76E',
                              bgColor: '#52091B',
                              badge: bundle.badge,
                              ingredients: ['All Signature Flavours Included', 'Upcycling Seed Starter', 'Brass Drainage Coaster'],
                              pairingNotes: 'The complete Mithai Pop tasting flight.',
                              temperature: 'Deep Chilled',
                              shelfLife: '14 Days Refrigerated',
                              canArtworkDescription: 'Collector Gold Box with 4/6 City Editions',
                              nutrition: { calories: 1200, protein: '28g', carbs: '140g', fat: '52g' },
                              tags: ['Bundle', 'Gift Box']
                            };
                            addToCart(syntheticProduct, 1, true);
                          }}
                          className="px-6 py-3 bg-[#F4BD38] hover:bg-[#FFF7E8] text-[#52091B] font-bold text-xs uppercase tracking-widest rounded-full shadow-lg transition-all transform active:scale-95 border border-[#52091B] btn-shimmer-sheen"
                        >
                          Claim Vault Box
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
