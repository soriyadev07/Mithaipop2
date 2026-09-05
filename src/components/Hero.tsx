import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, Sparkles, Star, Check } from 'lucide-react';
import { sounds } from '../utils/audio';
import { delhiPopImg, kolkataPopImg, lucknowPopImg } from '../data/products';
import { BrandLogo } from './BrandLogo';
import { useCart } from '../context/CartContext';
import { useStoreData } from '../context/StoreDataContext';
import { PRODUCTS } from '../data/products';
import { FloatingIngredients } from './FloatingIngredients';
import { isPublicPriceVisible } from '../types';

export const Hero: React.FC = () => {
  const { addToCart, setSelectedProductModal, openWaitlistModal } = useCart();
  const { settings } = useStoreData();
  const [activeMobileIndex, setActiveMobileIndex] = useState(1); // Default to center best-seller on mobile
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const bestSellers = [
    {
      id: 'delhi-pop',
      name: 'Gulab Jamun Pop',
      city: 'Delhi',
      flavorCombination: 'Gulab Jamun × Vanilla Ice Cream',
      shortQuote: '“Warm nostalgia meets cool indulgence.”',
      price: 249,
      originalPrice: 299,
      image: delhiPopImg,
      badge: null,
      scaleClass: 'lg:scale-[0.92] lg:hover:scale-[0.97]',
      accentColor: '#F5A623',
      tempTag: 'Best at 4°C',
      floatClass: 'animate-float',
      floatDelay: '0s',
      delayMs: 150,
    },
    {
      id: 'jalebi-rabri-pop',
      name: 'Jalebi Rabri Pop',
      city: 'Lucknow & Varanasi',
      flavorCombination: 'Crispy Jalebi × Silky Saffron Rabri',
      shortQuote: '“The Pop everyone is talking about.”',
      price: 259,
      originalPrice: 310,
      image: lucknowPopImg,
      badge: 'BEST SELLER',
      scaleClass: 'lg:scale-[1.12] lg:hover:scale-[1.16] z-20',
      accentColor: '#F4BD38',
      tempTag: 'Fresh Pop',
      floatClass: 'animate-float-reverse',
      floatDelay: '1.2s',
      delayMs: 300,
    },
    {
      id: 'kolkata-pop',
      name: 'Rasgulla Pop',
      city: 'Kolkata',
      flavorCombination: 'Rasgulla × Baked Mishti Doi',
      shortQuote: '“Airy chena sponge meets caramelized sweet curd.”',
      price: 269,
      originalPrice: 320,
      image: kolkataPopImg,
      badge: null,
      scaleClass: 'lg:scale-[0.92] lg:hover:scale-[0.97]',
      accentColor: '#F58FA3',
      tempTag: 'Ice Cold 2°C',
      floatClass: 'animate-float',
      floatDelay: '2.4s',
      delayMs: 450,
    },
  ];

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
    addToCart(product, 1);
    
    // Quick added state feedback
    setAddedIds((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [productId]: false }));
    }, 1600);
  };

  const handleOpenDetail = (productId: string) => {
    sounds.playClick();
    const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
    setSelectedProductModal(product);
  };

  const scrollToSection = (id: string) => {
    sounds.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[92vh] flex flex-col justify-center items-center pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden text-[#FFF7E8]"
    >
      {/* Floating Dessert Elements (Saffron, Pistachio, Cardamom, Rose) */}
      <FloatingIngredients variant="hero" />

      {/* Cinematic Spotlight behind the Best Sellers */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[950px] h-[550px] md:h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(244,189,56,0.18)_0%,rgba(139,24,56,0.12)_45%,transparent_70%)] pointer-events-none blur-3xl z-0" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 z-10 flex flex-col items-center">
        
        {/* ========================================================================= */}
        {/* 1. TOP / UPPER CENTER: Iconic Mithai Pop Brand Logo & Minimal Tagline     */}
        {/* ========================================================================= */}
        <div 
          className={`flex flex-col items-center text-center space-y-3 mb-8 md:mb-12 transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
          }`}
        >
          {/* Official Mithai Pop Logo */}
          <div className="transform transition-transform hover:scale-105 duration-300">
            <BrandLogo variant="hero" centered={true} />
          </div>

          {/* Minimalist Sub-heading */}
          <p className="text-xs sm:text-sm md:text-base font-medium tracking-[0.2em] uppercase text-[#FFF7E8]/90 font-sans mt-2 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F4BD38] inline-block animate-pulse" />
            <span>Indian flavours. Unexpectedly popped.</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F4BD38] inline-block animate-pulse" />
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 2. CENTER OF HERO: 3 BEST-SELLING PRODUCTS (Visual Pyramid Layout)        */}
        {/* ========================================================================= */}
        
        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden items-center justify-center gap-2 mb-6 bg-[#2B060F]/80 p-1.5 rounded-full border border-[#F4BD38]/30 backdrop-blur-md">
          {bestSellers.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                sounds.playClick();
                setActiveMobileIndex(idx);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeMobileIndex === idx
                  ? 'bg-[#F4BD38] text-[#52091B] shadow-md'
                  : 'text-[#FFF7E8]/80 hover:text-white'
              }`}
            >
              {item.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Product Showcase Container */}
        <div className="w-full max-w-5xl my-2 sm:my-4">
          
          {/* Desktop 3-Card Visual Pyramid */}
          <div className="hidden lg:grid grid-cols-3 gap-6 xl:gap-8 items-center justify-center">
            {bestSellers.map((item, index) => {
              const isCenter = index === 1;
              const isAdded = addedIds[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetail(item.id)}
                  style={{
                    transitionDelay: `${item.delayMs}ms`,
                  }}
                  className={`relative flex flex-col items-center text-center transition-all duration-700 transform cursor-pointer group ${item.scaleClass} ${
                    loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                >
                  {/* Subtle rim light & ground reflection shadow */}
                  <div className="absolute -bottom-6 w-3/4 h-8 bg-black/60 blur-xl rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                  
                  {/* Best Seller Floating Badge on Center Card */}
                  {item.badge && (
                    <div className="absolute -top-4 z-30 bg-gradient-to-r from-[#F4BD38] to-[#F5A623] text-[#52091B] text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg border border-[#FFF7E8]/40 flex items-center gap-1.5 animate-bounce">
                      <Star className="w-3 h-3 fill-[#52091B]" />
                      <span>{item.badge}</span>
                    </div>
                  )}

                  {/* Product Card Body with subtle floating physics */}
                  <div className={`w-full rounded-3xl p-5 sm:p-6 transition-all duration-500 relative backdrop-blur-md border ${
                    isCenter 
                      ? 'bg-gradient-to-b from-[#3D0A16]/95 via-[#2E0710]/95 to-[#24050D]/95 border-[#F4BD38]/60 shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_35px_rgba(244,189,56,0.15)] group-hover:border-[#F4BD38] group-hover:-translate-y-2' 
                      : 'bg-[#2A060E]/80 border-[#F4BD38]/20 shadow-[0_15px_35px_rgba(0,0,0,0.5)] group-hover:border-[#F4BD38]/50 group-hover:-translate-y-1.5'
                  }`}>
                    
                    {/* Visual Product Can Container */}
                    <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1C0308]/60 to-[#120205]/90 p-3 flex items-center justify-center border border-white/5">
                      {/* Product Realistic Shadow & Glow */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,189,56,0.12),transparent_70%)]" />

                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-contain rounded-xl drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] group-hover:scale-108 group-hover:rotate-1 transition-all duration-500 will-change-transform ${item.floatClass}`}
                        style={{ animationDelay: item.floatDelay }}
                      />

                      {/* Temperature Badge */}
                      <div className="absolute top-2.5 left-2.5 bg-[#120205]/85 backdrop-blur-xs text-[#F4BD38] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#F4BD38]/30">
                        {item.tempTag}
                      </div>
                    </div>

                    {/* Product Typography & Hierarchy */}
                    <div className="space-y-1.5">
                      <h3 className="text-xl xl:text-2xl font-black text-[#FFF7E8] font-display tracking-tight leading-tight group-hover:text-[#F4BD38] transition-colors italic">
                        {item.name}
                      </h3>

                      <p className="text-xs font-bold text-[#F4BD38] tracking-wide">
                        {item.flavorCombination}
                      </p>

                      <p className="text-[11px] text-[#FFF7E8]/70 italic line-clamp-1">
                        {item.shortQuote}
                      </p>

                      {/* Price & CTA Action Bar */}
                      <div className="pt-3 mt-2 flex items-center justify-between border-t border-[#FFF7E8]/10">
                        {isPublicPriceVisible(settings.waitlistMode) ? (
                          <div className="text-left">
                            <span className="text-lg font-black text-[#FFF7E8]">₹{item.price}</span>
                            <span className="text-xs text-[#FFF7E8]/40 line-through ml-1.5 font-medium">₹{item.originalPrice}</span>
                          </div>
                        ) : (
                          <div className="text-left">
                            <span className="text-xs font-bold text-[#F4BD38] uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#F4BD38]" /> Pre-Launch
                            </span>
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            if (settings.waitlistMode) {
                              e.stopPropagation();
                              sounds.playClick();
                              openWaitlistModal(item.name);
                            } else {
                              handleAddToCart(e, item.id);
                            }
                          }}
                          className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 btn-shimmer-sheen cursor-pointer ${
                            settings.waitlistMode
                              ? 'bg-[#F4BD38] text-[#52091B] hover:bg-[#FFF7E8] border border-[#F4BD38]'
                              : isAdded
                              ? 'bg-[#10B981] text-white border border-[#10B981]'
                              : isCenter
                              ? 'bg-[#F4BD38] text-[#52091B] hover:bg-[#FFF7E8] border border-[#F4BD38]'
                              : 'bg-[#FFF7E8]/15 hover:bg-[#F4BD38] text-[#FFF7E8] hover:text-[#52091B] border border-white/20'
                          }`}
                        >
                          {settings.waitlistMode ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-[#52091B]" />
                              <span>Join the Waitlist</span>
                            </>
                          ) : isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Single-Card View (Active Selected) */}
          <div className="lg:hidden flex justify-center">
            {(() => {
              const item = bestSellers[activeMobileIndex];
              const isAdded = addedIds[item.id];

              return (
                <div
                  onClick={() => handleOpenDetail(item.id)}
                  className="w-full max-w-sm relative flex flex-col items-center text-center cursor-pointer group"
                >
                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute -top-3.5 z-30 bg-gradient-to-r from-[#F4BD38] to-[#F5A623] text-[#52091B] text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg border border-[#FFF7E8]/40 flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-[#52091B]" />
                      <span>{item.badge}</span>
                    </div>
                  )}

                  <div className="w-full rounded-3xl p-5 bg-gradient-to-b from-[#3D0A16]/95 via-[#2E0710]/95 to-[#24050D]/95 border-2 border-[#F4BD38]/50 shadow-2xl backdrop-blur-md">
                    <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-gradient-to-b from-[#1C0308]/60 to-[#120205]/90 p-3 flex items-center justify-center border border-white/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain rounded-xl drop-shadow-xl animate-float"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-[#120205]/85 text-[#F4BD38] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border border-[#F4BD38]/30">
                        {item.tempTag}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-2xl font-black text-[#FFF7E8] font-display tracking-tight leading-tight italic">
                        {item.name}
                      </h3>
                      <p className="text-xs font-bold text-[#F4BD38] tracking-wide">
                        {item.flavorCombination}
                      </p>
                      <p className="text-xs text-[#FFF7E8]/80 italic">
                        {item.shortQuote}
                      </p>

                      <div className="pt-3 mt-2 flex items-center justify-between border-t border-[#FFF7E8]/10">
                        {isPublicPriceVisible(settings.waitlistMode) ? (
                          <div>
                            <span className="text-xl font-black text-[#FFF7E8]">₹{item.price}</span>
                            <span className="text-xs text-[#FFF7E8]/40 line-through ml-1.5 font-medium">₹{item.originalPrice}</span>
                          </div>
                        ) : (
                          <div className="text-left">
                            <span className="text-xs font-bold text-[#F4BD38] uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#F4BD38]" /> Pre-Launch
                            </span>
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            if (settings.waitlistMode) {
                              e.stopPropagation();
                              sounds.playClick();
                              openWaitlistModal(item.name);
                            } else {
                              handleAddToCart(e, item.id);
                            }
                          }}
                          className={`px-5 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95 btn-shimmer-sheen cursor-pointer ${
                            settings.waitlistMode
                              ? 'bg-[#F4BD38] text-[#52091B]'
                              : isAdded
                              ? 'bg-[#10B981] text-white'
                              : 'bg-[#F4BD38] text-[#52091B]'
                          }`}
                        >
                          {settings.waitlistMode ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-[#52091B]" />
                              <span>Join the Waitlist</span>
                            </>
                          ) : isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. PRIMARY HERO CTA & STORY LINK                                         */}
        {/* ========================================================================= */}
        <div 
          className={`mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 z-20 transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '550ms' }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {settings.waitlistMode ? (
              <button
                onClick={() => {
                  sounds.playClick();
                  openWaitlistModal();
                }}
                className="group relative bg-gradient-to-r from-[#F4BD38] via-[#F7CD5C] to-[#F4BD38] text-[#52091B] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest shadow-[0_10px_25px_rgba(244,189,56,0.3)] hover:shadow-[0_15px_35px_rgba(244,189,56,0.45)] hover:scale-105 transition-all duration-300 transform active:scale-95 flex items-center gap-3 border border-[#FFF7E8]/40 btn-shimmer-sheen cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#52091B]" />
                <span>Join the Waitlist</span>
                <ArrowRight className="w-4 h-4 text-[#52091B] group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => scrollToSection('menu')}
                className="group relative bg-gradient-to-r from-[#F4BD38] via-[#F7CD5C] to-[#F4BD38] text-[#52091B] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest shadow-[0_10px_25px_rgba(244,189,56,0.3)] hover:shadow-[0_15px_35px_rgba(244,189,56,0.45)] hover:scale-105 transition-all duration-300 transform active:scale-95 flex items-center gap-3 border border-[#FFF7E8]/40 btn-shimmer-sheen cursor-pointer"
              >
                <span>Explore All Pops</span>
                <ArrowRight className="w-4 h-4 text-[#52091B] group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <button
              onClick={() => scrollToSection('menu')}
              className="text-xs sm:text-sm font-bold text-[#FFF7E8]/85 hover:text-[#F4BD38] transition-colors py-2 px-3 flex items-center gap-1.5 group cursor-pointer"
            >
              <span>{settings.waitlistMode ? 'Explore Flavours' : 'Discover Our Story'}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {settings.waitlistMode && (
            <p className="text-[11px] sm:text-xs text-[#FFF7E8]/75 font-medium tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              <span>Launching Soon across India • Limited First Batch Access</span>
            </p>
          )}
        </div>

      </div>
    </section>
  );
};


