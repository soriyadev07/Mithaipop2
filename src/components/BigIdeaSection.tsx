import React, { useState } from 'react';
import { Sparkles, Plus, Zap } from 'lucide-react';
import { sounds } from '../utils/audio';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { ScrollReveal } from './ScrollReveal';

interface FusionCombo {
  id: string;
  itemA: { name: string; tag: string; emoji: string; desc: string };
  itemB: { name: string; tag: string; emoji: string; desc: string };
  result: { name: string; popId: string; tagline: string; notes: string; color: string; badge: string };
}

const COMBOS: FusionCombo[] = [
  {
    id: 'combo-1',
    itemA: { name: 'Molten Gulab Jamun', tag: 'Warm & Syrupy', emoji: '🟤', desc: 'Cardamom-infused dark khoya ball soaked in rose sugar syrup.' },
    itemB: { name: 'Madagascar Vanilla Cream', tag: 'Cold & Velvety', emoji: '🍦', desc: 'Slow-churned 100% whole dairy ice cream with black vanilla caviar.' },
    result: {
      name: 'Delhi Pop',
      popId: 'delhi-pop',
      tagline: 'Warm syrup core meets ice-cold cream shock.',
      notes: 'Crushed Afghan pistachios + saffron drizzle',
      color: '#7A0F29',
      badge: 'Bestseller'
    }
  },
  {
    id: 'combo-2',
    itemA: { name: 'Crisp Saffron Jalebi', tag: 'Hot & Snappy', emoji: '🥨', desc: 'Pretzel-shaped fermented spirals deep-fried in desi ghee.' },
    itemB: { name: 'Silky Lachha Rabri', tag: 'Slow-Simmered Cream', emoji: '🥛', desc: 'Layered clotted buffalo cream with crushed green cardamom.' },
    result: {
      name: 'Jalebi Rabri Pop',
      popId: 'jalebi-rabri-pop',
      tagline: 'Snappy sugar crunch sealed in velvet malai.',
      notes: 'Nutmeg aroma + roasted almond slivers',
      color: '#52091B',
      badge: 'Crunch & Cream'
    }
  },
  {
    id: 'combo-3',
    itemA: { name: 'Spongy Chena Rasgulla', tag: 'Airy & Floral', emoji: '⚪', desc: 'Feather-light curdled cow milk sphere soaked in rose water.' },
    itemB: { name: 'Baked Earthen Mishti Doi', tag: 'Caramelized & Tangy', emoji: '🍯', desc: 'Clay-pot baked yogurt with palm jaggery undertones.' },
    result: {
      name: 'Kolkata Pop',
      popId: 'kolkata-pop',
      tagline: 'Tangy caramelized yogurt meets bursting floral dew.',
      notes: 'Gulkand rose petal essence + toasted almonds',
      color: '#7A0F29',
      badge: 'Cult Classic'
    }
  },
  {
    id: 'combo-4',
    itemA: { name: 'Desi Ghee Malpua', tag: 'Lace-Edged & Tender', emoji: '🥞', desc: 'Fennel-scented Awadhi pancake fried till golden amber.' },
    itemB: { name: 'Royal Saffron Rabri', tag: 'Golden Malai Reduction', emoji: '✨', desc: 'Simmered milk reduction steeped in Kashmiri mongra saffron.' },
    result: {
      name: 'Lucknow Pop',
      popId: 'lucknow-pop',
      tagline: 'Royal Awadhi grandeur packed in a modern pop can.',
      notes: 'Pure edible silver vark + chironji nuts',
      color: '#52091B',
      badge: 'Chef Choice'
    }
  }
];

export const BigIdeaSection: React.FC = () => {
  const [selectedCombo, setSelectedCombo] = useState<string>('combo-1');
  const [isColliding, setIsColliding] = useState(false);
  const { addToCart, setSelectedProductModal } = useCart();

  const current = COMBOS.find((c) => c.id === selectedCombo) || COMBOS[0];
  const matchingProduct = PRODUCTS.find((p) => p.id === current.result.popId);

  const handleSelect = (id: string) => {
    sounds.playCanPop();
    setIsColliding(true);
    setSelectedCombo(id);
    setTimeout(() => setIsColliding(false), 500);
  };

  return (
    <section className="py-20 bg-transparent text-[#FFF7E8] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 z-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F58FA3]/20 border border-[#F58FA3] text-[#FFF7E8]">
              <Zap className="w-3.5 h-3.5 text-[#F2C76E]" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">The Collision Engine</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-tight italic">
              We don’t make new desserts. <br className="hidden sm:inline" />
              <span className="text-[#F2C76E] not-italic">We make you see old favourites differently.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#FFF7E8]/85 font-normal max-w-2xl mx-auto">
              Take two iconic Indian flavours. Crash them together at high velocity. 
              Package the result in a cold collectible can. Click below to experience the collision.
            </p>
          </div>
        </ScrollReveal>

        {/* Combo Selection Buttons */}
        <ScrollReveal direction="up" delay={100}>
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {COMBOS.map((combo) => {
              const isSelected = combo.id === selectedCombo;
              return (
                <button
                  key={combo.id}
                  onClick={() => handleSelect(combo.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 transform active:scale-95 ${
                    isSelected
                      ? 'bg-[#F2C76E] text-[#52091B] shadow-md border border-[#F2C76E] scale-105 font-black'
                      : 'bg-[#52091B] text-[#FFF7E8] hover:bg-[#FFF7E8] hover:text-[#7A0F29] border border-[#F2C76E]/20'
                  }`}
                >
                  <span>{combo.result.name}</span>
                  <span className="text-[10px] opacity-75 hidden sm:inline">({combo.result.badge})</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Large Interactive Collision Showcase */}
        <ScrollReveal direction="up" delay={150}>
          <div className="mt-12 bg-[#52091B] border-2 border-[#F2C76E]/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Ingredient A */}
              <div className={`lg:col-span-4 bg-[#7A0F29] border border-[#F2C76E]/20 rounded-2xl p-6 text-center space-y-3 transition-all duration-500 ${
                isColliding ? 'translate-x-4 scale-95 opacity-80' : 'translate-x-0'
              }`}>
                <div className="w-16 h-16 mx-auto bg-[#52091B] border border-[#F2C76E]/30 rounded-2xl flex items-center justify-center text-3xl shadow-md">
                  {current.itemA.emoji}
                </div>
                <span className="inline-block text-[10px] font-bold text-[#F2C76E] bg-[#52091B] px-3 py-1 rounded-full uppercase tracking-widest">
                  {current.itemA.tag}
                </span>
                <h3 className="text-xl font-black text-[#FFF7E8] font-display">{current.itemA.name}</h3>
                <p className="text-xs text-[#FFF7E8]/75 leading-relaxed font-normal">{current.itemA.desc}</p>
              </div>

              {/* Middle: Plus Operator */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#F2C76E] text-[#52091B] flex items-center justify-center font-black text-xl shadow-md animate-pulse-slow">
                  <Plus className="w-5 h-5" />
                </div>
              </div>

              {/* Right Ingredient B */}
              <div className={`lg:col-span-4 bg-[#7A0F29] border border-[#F2C76E]/20 rounded-2xl p-6 text-center space-y-3 transition-all duration-500 ${
                isColliding ? '-translate-x-4 scale-95 opacity-80' : 'translate-x-0'
              }`}>
                <div className="w-16 h-16 mx-auto bg-[#52091B] border border-[#F2C76E]/30 rounded-2xl flex items-center justify-center text-3xl shadow-md">
                  {current.itemB.emoji}
                </div>
                <span className="inline-block text-[10px] font-bold text-[#F58FA3] bg-[#52091B] px-3 py-1 rounded-full uppercase tracking-widest">
                  {current.itemB.tag}
                </span>
                <h3 className="text-xl font-black text-[#FFF7E8] font-display">{current.itemB.name}</h3>
                <p className="text-xs text-[#FFF7E8]/75 leading-relaxed font-normal">{current.itemB.desc}</p>
              </div>

              {/* Equals / Result Column */}
              <div className="lg:col-span-3 bg-white text-[#171316] border-2 border-[#7A0F29] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A0F29] bg-[#F58FA3]/20 border border-[#F58FA3] px-2.5 py-0.5 rounded-full">
                    {current.result.badge}
                  </span>
                  <span className="text-xs font-bold text-[#7A0F29] font-display">₹249 / Can</span>
                </div>

                <div>
                  <h4 className="text-2xl font-black text-[#7A0F29] font-display italic">{current.result.name}</h4>
                  <p className="text-xs text-[#52091B] font-bold mt-0.5">{current.result.tagline}</p>
                </div>

                <div className="bg-[#FFF7E8] p-3 rounded-xl border border-[#7A0F29]/15">
                  <p className="text-[11px] font-medium text-[#171316]/80">
                    ✨ <span className="font-bold text-[#7A0F29]">Finishing Notes:</span> {current.result.notes}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {matchingProduct && (
                    <button
                      onClick={() => addToCart(matchingProduct, 1)}
                      className="flex-1 py-2.5 bg-[#7A0F29] hover:bg-[#52091B] text-[#FFF7E8] font-bold text-xs uppercase tracking-widest rounded-full shadow-md text-center transition-all transform active:scale-95 btn-shimmer-sheen"
                    >
                      Add to Cart
                    </button>
                  )}
                  {matchingProduct && (
                    <button
                      onClick={() => setSelectedProductModal(matchingProduct)}
                      className="p-2.5 bg-[#FFF7E8] hover:bg-[#7A0F29] hover:text-[#FFF7E8] text-[#7A0F29] border border-[#7A0F29]/20 rounded-full transition-colors transform active:scale-95"
                      title="View Flavour Breakdown"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
