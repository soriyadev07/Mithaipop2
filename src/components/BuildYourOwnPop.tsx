import React, { useState } from 'react';
import { INGREDIENT_OPTIONS } from '../data/reviews';
import { CustomPopIngredient, Product, isPublicPriceVisible } from '../types';
import { Sliders, ShoppingBag, Share2, Sparkles, Check } from 'lucide-react';
import { sounds } from '../utils/audio';
import { useCart } from '../context/CartContext';
import { useStoreData } from '../context/StoreDataContext';
import { delhiPopImg } from '../data/products';
import { ScrollReveal } from './ScrollReveal';

export const BuildYourOwnPop: React.FC = () => {
  const { addToCart, openWaitlistModal } = useCart();
  const { settings } = useStoreData();

  const bases = INGREDIENT_OPTIONS.filter((i) => i.category === 'base');
  const creams = INGREDIENT_OPTIONS.filter((i) => i.category === 'cream');
  const toppings = INGREDIENT_OPTIONS.filter((i) => i.category === 'topping');
  const crunches = INGREDIENT_OPTIONS.filter((i) => i.category === 'crunch');
  const twists = INGREDIENT_OPTIONS.filter((i) => i.category === 'twist');

  const [selectedBase, setSelectedBase] = useState<CustomPopIngredient>(bases[0]);
  const [selectedCream, setSelectedCream] = useState<CustomPopIngredient>(creams[0]);
  const [selectedTopping, setSelectedTopping] = useState<CustomPopIngredient>(toppings[0]);
  const [selectedCrunch, setSelectedCrunch] = useState<CustomPopIngredient>(crunches[0]);
  const [selectedTwist, setSelectedTwist] = useState<CustomPopIngredient>(twists[0]);
  const [copiedLink, setCopiedLink] = useState(false);

  const totalCalories =
    selectedBase.calories +
    selectedCream.calories +
    selectedTopping.calories +
    selectedCrunch.calories +
    selectedTwist.calories;

  // Derive custom pop name
  const customPopName = `${selectedTwist.name} ${selectedBase.name} Pop`;

  const handleSelect = (item: CustomPopIngredient) => {
    sounds.playClick();
    if (item.category === 'base') setSelectedBase(item);
    if (item.category === 'cream') setSelectedCream(item);
    if (item.category === 'topping') setSelectedTopping(item);
    if (item.category === 'crunch') setSelectedCrunch(item);
    if (item.category === 'twist') setSelectedTwist(item);
  };

  const handleOrderCustomPop = () => {
    sounds.playCelebration();
    const customProduct: Product = {
      id: `custom-pop-${Date.now()}`,
      name: `Custom: ${customPopName}`,
      hindiName: 'कस्टम पॉप',
      flavorCombination: `${selectedBase.name} × ${selectedCream.name}`,
      tagline: `Infused with ${selectedTwist.name} & topped with ${selectedTopping.name} & ${selectedCrunch.name}.`,
      description: `Bespoke crafted Pop: ${selectedBase.name} base submerged in ${selectedCream.name}, adorned with ${selectedTopping.name}, textured with ${selectedCrunch.name}, and scented with ${selectedTwist.name}.`,
      cityInspiration: 'Pop Lab Studio Custom Creation',
      price: 299,
      rating: 5.0,
      reviewCount: 1,
      image: delhiPopImg,
      accentColor: selectedBase.color,
      bgColor: '#7A0F29',
      badge: 'Custom Lab Pop',
      ingredients: [selectedBase.name, selectedCream.name, selectedTopping.name, selectedCrunch.name, selectedTwist.name],
      pairingNotes: 'Your personal dessert remix concoction, freshly sealed in food-grade aluminum.',
      temperature: 'Chilled 4°C',
      shelfLife: '10 Days Refrigerated',
      canArtworkDescription: 'Custom holographic label with your bespoke flavor profile formulation.',
      nutrition: {
        calories: totalCalories,
        protein: '7.5g',
        carbs: '36g',
        fat: '13.8g'
      },
      tags: ['Custom', 'Pop Lab', 'Bespoke']
    };

    addToCart(
      customProduct,
      1,
      false,
      `Custom mix: Base: ${selectedBase.name} | Cream: ${selectedCream.name} | Topping: ${selectedTopping.name} | Crunch: ${selectedCrunch.name} | Twist: ${selectedTwist.name}`
    );
  };

  const handleShare = () => {
    sounds.playClick();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="build-your-pop" className="py-20 bg-transparent text-[#FFF7E8] relative overflow-hidden scroll-mt-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 z-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4BD38]/20 border border-[#F4BD38]/40 text-[#F2C76E]">
              <Sliders className="w-3.5 h-3.5 text-[#F4BD38]" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">The Pop Lab Studio</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-[#FFF7E8] italic">
              Build Your Own Pop.
            </h2>

            <p className="text-base sm:text-lg text-[#FFF7E8]/85 font-medium max-w-2xl mx-auto leading-relaxed">
              Customize your dream dessert. Choose your base dessert, creamy core, gourmet topping, textural crunch, and aromatic flavour twist.
            </p>
          </div>
        </ScrollReveal>

        {/* Builder Studio Container */}
        <ScrollReveal direction="up" delay={120}>
          <div className="mt-12 bg-[#3D0713]/90 backdrop-blur-md border-2 border-[#F2C76E]/40 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Interactive 5-Step Selectors */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Base Dessert */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C76E] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#F4BD38] text-[#52091B] flex items-center justify-center text-[9px] font-black">1</span>
                    Choose Your Base Dessert
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F4BD38]">{selectedBase.name}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {bases.map((b) => {
                    const isSelected = selectedBase.id === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => handleSelect(b)}
                        className={`p-3 rounded-2xl border text-left transition-all relative transform active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'bg-[#F4BD38] text-[#52091B] border-[#F4BD38] shadow-md scale-102 font-black'
                            : 'bg-[#52091B]/80 text-[#FFF7E8] border-[#F2C76E]/20 hover:bg-[#7A0F29]'
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-wider leading-snug">{b.name}</p>
                        <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#52091B]/80 font-semibold' : 'text-[#FFF7E8]/70'}`}>
                          {b.calories} kcal
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Cream */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C76E] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#F4BD38] text-[#52091B] flex items-center justify-center text-[9px] font-black">2</span>
                    Choose Your Cream
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F4BD38]">{selectedCream.name}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {creams.map((c) => {
                    const isSelected = selectedCream.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleSelect(c)}
                        className={`p-3 rounded-2xl border text-left transition-all relative transform active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'bg-[#F4BD38] text-[#52091B] border-[#F4BD38] shadow-md scale-102 font-black'
                            : 'bg-[#52091B]/80 text-[#FFF7E8] border-[#F2C76E]/20 hover:bg-[#7A0F29]'
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-wider leading-snug">{c.name}</p>
                        <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#52091B]/80 font-semibold' : 'text-[#FFF7E8]/70'}`}>
                          {c.calories} kcal
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Topping */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C76E] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#F4BD38] text-[#52091B] flex items-center justify-center text-[9px] font-black">3</span>
                    Choose Your Topping
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F4BD38]">{selectedTopping.name}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                  {toppings.map((top) => {
                    const isSelected = selectedTopping.id === top.id;
                    return (
                      <button
                        key={top.id}
                        onClick={() => handleSelect(top)}
                        className={`p-3 rounded-2xl border text-left transition-all relative transform active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'bg-[#F4BD38] text-[#52091B] border-[#F4BD38] font-black shadow-md scale-102'
                            : 'bg-[#52091B]/80 text-[#FFF7E8] border-[#F2C76E]/20 hover:bg-[#7A0F29]'
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-wider leading-snug">{top.name}</p>
                        <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#52091B]/80 font-semibold' : 'text-[#FFF7E8]/70'}`}>
                          {top.calories} kcal
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Crunch */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C76E] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#F4BD38] text-[#52091B] flex items-center justify-center text-[9px] font-black">4</span>
                    Choose Your Crunch
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F4BD38]">{selectedCrunch.name}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                  {crunches.map((cr) => {
                    const isSelected = selectedCrunch.id === cr.id;
                    return (
                      <button
                        key={cr.id}
                        onClick={() => handleSelect(cr)}
                        className={`p-3 rounded-2xl border text-left transition-all relative transform active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'bg-[#F4BD38] text-[#52091B] border-[#F4BD38] shadow-md scale-102 font-black'
                            : 'bg-[#52091B]/80 text-[#FFF7E8] border-[#F2C76E]/20 hover:bg-[#7A0F29]'
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-wider leading-snug">{cr.name}</p>
                        <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#52091B]/80 font-semibold' : 'text-[#FFF7E8]/70'}`}>
                          {cr.calories} kcal
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 5: Flavour Twist */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C76E] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#F4BD38] text-[#52091B] flex items-center justify-center text-[9px] font-black">5</span>
                    Choose Your Flavour Twist
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F4BD38]">{selectedTwist.name}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                  {twists.map((t) => {
                    const isSelected = selectedTwist.id === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleSelect(t)}
                        className={`p-3 rounded-2xl border text-left transition-all relative transform active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'bg-[#F4BD38] text-[#52091B] border-[#F4BD38] font-black shadow-md scale-102'
                            : 'bg-[#52091B]/80 text-[#FFF7E8] border-[#F2C76E]/20 hover:bg-[#7A0F29]'
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-wider leading-snug">{t.name}</p>
                        <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#52091B]/80 font-semibold' : 'text-[#FFF7E8]/70'}`}>
                          {t.calories} kcal
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right: Live Can Formulation & Custom Summary */}
            <div className="lg:col-span-5 bg-[#52091B] text-[#FFF7E8] border-2 border-[#F2C76E]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-[#F2C76E]/20 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C76E] bg-[#7A0F29] px-3 py-1 rounded-full border border-[#F2C76E]/20">
                  Your Pop Formulation
                </span>
                <button
                  onClick={handleShare}
                  className="text-xs uppercase tracking-wider font-bold text-[#FFF7E8]/80 hover:text-[#F2C76E] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              {/* Generated Can Graphic Preview */}
              <div className="bg-[#7A0F29] border border-[#F2C76E]/30 rounded-2xl p-5 text-center space-y-3 relative">
                <div className="w-20 h-28 mx-auto bg-gradient-to-b from-[#F2C76E] via-[#FFD6B8] to-[#F5A623] rounded-2xl border-2 border-[#52091B] shadow-lg flex flex-col justify-between p-2 animate-float">
                  <div className="w-8 h-1 bg-[#52091B] mx-auto rounded-full" />
                  <div className="text-[9px] font-black text-[#52091B] uppercase tracking-tighter leading-none font-display">
                    मिठाई POP
                  </div>
                  <div className="w-12 h-0.5 bg-[#52091B]/40 mx-auto" />
                </div>

                <div>
                  <p className="text-[10px] font-bold text-[#F2C76E] uppercase tracking-widest">Your Pop</p>
                  <h3 className="text-xl font-black text-[#FFF7E8] font-display italic mt-0.5">{customPopName}</h3>
                  <p className="text-xs text-[#FFD6B8] uppercase tracking-wider mt-0.5 font-medium">{selectedBase.name} × {selectedCream.name}</p>
                </div>
              </div>

              {/* 5 Layer Stack Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between bg-[#7A0F29]/60 p-2.5 rounded-xl border border-[#F2C76E]/15">
                  <span className="text-[#FFF7E8]/70 uppercase tracking-wider text-[10px] font-bold">Base Dessert:</span>
                  <span className="font-bold text-[#FFF7E8] uppercase tracking-wide">{selectedBase.name}</span>
                </div>
                <div className="flex justify-between bg-[#7A0F29]/60 p-2.5 rounded-xl border border-[#F2C76E]/15">
                  <span className="text-[#FFF7E8]/70 uppercase tracking-wider text-[10px] font-bold">Cream:</span>
                  <span className="font-bold text-[#FFF7E8] uppercase tracking-wide">{selectedCream.name}</span>
                </div>
                <div className="flex justify-between bg-[#7A0F29]/60 p-2.5 rounded-xl border border-[#F2C76E]/15">
                  <span className="text-[#FFF7E8]/70 uppercase tracking-wider text-[10px] font-bold">Topping:</span>
                  <span className="font-bold text-[#FFF7E8] uppercase tracking-wide">{selectedTopping.name}</span>
                </div>
                <div className="flex justify-between bg-[#7A0F29]/60 p-2.5 rounded-xl border border-[#F2C76E]/15">
                  <span className="text-[#FFF7E8]/70 uppercase tracking-wider text-[10px] font-bold">Crunch:</span>
                  <span className="font-bold text-[#FFF7E8] uppercase tracking-wide">{selectedCrunch.name}</span>
                </div>
                <div className="flex justify-between bg-[#7A0F29]/60 p-2.5 rounded-xl border border-[#F2C76E]/15">
                  <span className="text-[#FFF7E8]/70 uppercase tracking-wider text-[10px] font-bold">Flavour Twist:</span>
                  <span className="font-bold text-[#FFF7E8] uppercase tracking-wide">{selectedTwist.name}</span>
                </div>
              </div>

              {/* Nutrition & Price & Action Button */}
              <div className="pt-3 border-t border-[#F2C76E]/20 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  {isPublicPriceVisible(settings.waitlistMode) ? (
                    <div>
                      <p className="text-2xl font-black text-[#F2C76E] font-display">₹299</p>
                      <p className="text-[10px] text-[#FFF7E8]/60 font-medium">~{totalCalories} kcal • Single Batch</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs font-black text-[#F4BD38] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#F4BD38]" /> Custom Lab Pop
                      </span>
                      <p className="text-[10px] text-[#FFF7E8]/60 font-medium">~{totalCalories} kcal • Single Batch</p>
                    </div>
                  )}

                  {settings.waitlistMode ? (
                    <button
                      id="create-my-pop-btn"
                      onClick={() => {
                        sounds.playCelebration();
                        openWaitlistModal(customPopName);
                      }}
                      className="px-5 py-3 bg-[#F4BD38] hover:bg-[#FFF7E8] text-[#52091B] font-black text-xs uppercase tracking-widest rounded-full shadow-md transition-all transform active:scale-95 flex items-center gap-2 border border-[#F4BD38] btn-shimmer-sheen cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#7A0F29]" />
                      <span>Join the Waitlist</span>
                    </button>
                  ) : (
                    <button
                      id="create-my-pop-btn"
                      onClick={handleOrderCustomPop}
                      className="px-5 py-3 bg-[#F4BD38] hover:bg-[#FFF7E8] text-[#52091B] font-bold text-xs uppercase tracking-widest rounded-full shadow-md transition-all transform active:scale-95 flex items-center gap-2 border border-[#F4BD38] btn-shimmer-sheen cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#7A0F29]" />
                      <span>Add My Pop to Cart</span>
                    </button>
                  )}
                </div>

                {settings.waitlistMode && (
                  <p className="text-[11px] text-[#FFD6B8] font-medium text-center sm:text-right">
                    Save your custom creation. Be the first to try it when we launch.
                  </p>
                )}
              </div>

            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

