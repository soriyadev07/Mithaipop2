import React, { useState } from 'react';
import { planterCanImg, tapestryArchBg } from '../data/products';
import { Sparkles, Sprout, PenTool, Flame, CheckCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

const UP_CYCLES = [
  {
    id: 'planter',
    title: 'Succulent Planter',
    subtitle: 'Greenery with Desi Soul',
    icon: Sprout,
    desc: 'Add a handful of potting pebbles and a baby jade or money plant. The UV-printed aluminum never rusts or peels.',
    tip: 'Includes complimentary drainage hole template on bottom of can.'
  },
  {
    id: 'desk',
    title: 'Desk Pen & Brush Caddy',
    subtitle: 'Studio & Workstation Chic',
    icon: PenTool,
    desc: 'Holds up to 20 markers, Apple Pencils, or makeup brushes. Brings an instant pop of Indian pop-art to your minimalist desk.',
    tip: 'Fits seamlessly beside laptops and coffee mugs.'
  },
  {
    id: 'candle',
    title: 'Aroma Tealight & Candle',
    subtitle: 'Sandalwood & Cardamom Warmth',
    icon: Flame,
    desc: 'Pour soy wax or drop a scented tealight inside. The metallic gold rim reflects shimmering warm amber shadows.',
    tip: 'Perfect Diwali & festive ambient centerpiece.'
  }
];

export const PackagingSection: React.FC = () => {
  const [activeCycle, setActiveCycle] = useState<string>('planter');

  const handleCycle = (id: string) => {
    sounds.playClick();
    setActiveCycle(id);
  };

  return (
    <section id="packaging" className="py-20 bg-transparent text-[#FFF7E8] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4BD38]/20 border border-[#F4BD38]/40 text-[#F2C76E]">
            <Sprout className="w-3.5 h-3.5 text-[#F4BD38]" />
            <span className="text-[10px] font-bold uppercase tracking-widest font-display">Circular Collectibility</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-tight italic">
            Don’t throw the can away. <br />
            <span className="text-[#F2C76E] not-italic">The dessert ends. The story doesn’t.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#FFF7E8]/85 font-normal max-w-2xl mx-auto leading-relaxed">
            Every Mithai Pop container is built with 100% infinitely recyclable, food-grade aluminum 
            adorned with UV-cured collectible Indian artwork. Designed to be washed, repurposed, and cherished.
          </p>
        </div>

        {/* Transformation Showcase */}
        <div className="mt-12 bg-[#3D0713]/90 backdrop-blur-md border-2 border-[#F2C76E]/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Transformation Image */}
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#2A050D] border border-[#F2C76E]/40 shadow-xl relative group">
                <img
                  src={planterCanImg}
                  alt="Mithai Pop can upcycled as an aesthetic plant pot and desk caddy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating badge */}
                <div className="absolute bottom-3 right-3 bg-[#2A050D]/95 backdrop-blur-md border border-[#F2C76E]/40 text-[#FFF7E8] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4BD38]" />
                  <span>Upcycle Level: 100% Aesthetic</span>
                </div>
              </div>
            </div>

            {/* Right: Upcycling Switcher & Steps */}
            <div className="lg:col-span-6 space-y-6">
              
              <div>
                <span className="text-[10px] font-bold text-[#F2C76E] uppercase tracking-widest">
                  Select a Second Life:
                </span>
                <div className="grid grid-cols-3 gap-2.5 mt-2.5">
                  {UP_CYCLES.map((cycle) => {
                    const isSelected = cycle.id === activeCycle;
                    const Icon = cycle.icon;
                    return (
                      <button
                        key={cycle.id}
                        onClick={() => handleCycle(cycle.id)}
                        className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col items-center justify-center gap-2 text-center ${
                          isSelected
                            ? 'bg-[#F4BD38] text-[#52091B] border-[#F4BD38] font-black shadow-md scale-102'
                            : 'bg-[#52091B]/80 text-[#FFF7E8] border-[#F2C76E]/20 hover:bg-[#7A0F29]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-wider leading-tight">{cycle.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Info Box */}
              {(() => {
                const current = UP_CYCLES.find((c) => c.id === activeCycle) || UP_CYCLES[0];
                return (
                  <div className="bg-[#52091B]/90 border border-[#F2C76E]/30 rounded-2xl p-6 space-y-3">
                    <h3 className="text-2xl font-black text-[#FFF7E8] font-display italic">{current.title}</h3>
                    <p className="text-xs font-bold text-[#F2C76E] uppercase tracking-wider">{current.subtitle}</p>
                    <p className="text-xs sm:text-sm text-[#FFF7E8]/85 leading-relaxed font-normal">{current.desc}</p>
                    
                    <div className="pt-3 border-t border-[#F2C76E]/20 flex items-center gap-2 text-xs text-[#FFF7E8]/90">
                      <CheckCircle className="w-4 h-4 text-[#F4BD38] shrink-0" />
                      <span>{current.tip}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Material Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs text-[#FFF7E8]/85">
                <div className="bg-[#52091B]/80 p-3.5 rounded-xl border border-[#F2C76E]/20">
                  <p className="font-bold text-[#F2C76E] uppercase tracking-wider">Infinitely Recyclable</p>
                  <p className="text-[11px] text-[#FFF7E8]/70 mt-0.5">Zero plastic inner liners</p>
                </div>
                <div className="bg-[#52091B]/80 p-3.5 rounded-xl border border-[#F2C76E]/20">
                  <p className="font-bold text-[#F2C76E] uppercase tracking-wider">UV Direct Print</p>
                  <p className="text-[11px] text-[#FFF7E8]/70 mt-0.5">Colors never fade or peel in water</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
