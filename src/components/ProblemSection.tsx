import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';
import { tapestryArchBg } from '../data/products';

export const ProblemSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'traditional' | 'remix'>('remix');

  const handleTabSwitch = (tab: 'traditional' | 'remix') => {
    sounds.playClick();
    setActiveTab(tab);
  };

  return (
    <section className="py-20 bg-transparent text-[#FFF7E8] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4BD38]/20 border border-[#F4BD38]/40 text-[#F2C76E]">
            <Sparkles className="w-3.5 h-3.5 text-[#F4BD38]" />
            <span className="text-[10px] font-bold uppercase tracking-widest font-display">The Paradigm Shift</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-[#FFF7E8] italic">
            Why should mithai always stay the same?
          </h2>

          <p className="text-base sm:text-lg text-[#FFF7E8]/80 font-medium leading-relaxed">
            Indian desserts are deeply loved across generations, but the way we experience them has barely evolved in 100 years. 
            Weddings, cardboard gift boxes, and festive occasions shouldn’t be the only excuse to indulge.
          </p>
        </div>

        {/* The 3-Step Transformation Banner */}
        <div className="mt-14 bg-[#52091B]/90 backdrop-blur-md text-[#FFF7E8] rounded-3xl p-6 sm:p-10 border-2 border-[#F2C76E]/40 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-center">
            
            {/* Step 1 */}
            <div className="bg-[#3D0713] border border-[#F2C76E]/20 p-6 rounded-2xl text-center space-y-2">
              <span className="text-[10px] font-bold text-[#F2C76E] uppercase tracking-widest">01. The Past</span>
              <h3 className="text-xl font-black text-[#FFF7E8] font-display">Traditional Mithai</h3>
              <p className="text-xs text-[#FFF7E8]/75 leading-relaxed font-normal">
                Confined to cardboard boxes, overly heavy, tied exclusively to formal occasions and predictable solitary flavours.
              </p>
            </div>

            {/* Transition Arrow / Connector */}
            <div className="bg-[#F4BD38] text-[#52091B] border-2 border-[#52091B] p-6 rounded-2xl text-center space-y-2 shadow-[4px_4px_0px_#52091B] transform md:-translate-y-1">
              <span className="text-[10px] font-black text-[#7A0F29] uppercase tracking-widest">02. The Fusion Spark</span>
              <h3 className="text-xl font-black text-[#52091B] font-display">New Combinations</h3>
              <p className="text-xs text-[#52091B]/90 font-semibold leading-relaxed">
                Crashing hot syrup into cold cream, crunchy jalebis into clotted rabri. Temperature & texture collisions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#3D0713] border border-[#F2C76E]/20 p-6 rounded-2xl text-center space-y-2">
              <span className="text-[10px] font-bold text-[#F2C76E] uppercase tracking-widest">03. The Future</span>
              <h3 className="text-xl font-black text-[#FFF7E8] font-display">Modern Dessert Can</h3>
              <p className="text-xs text-[#FFF7E8]/75 leading-relaxed font-normal">
                Handheld, chilled, zero-preservative cans with collectible art that live on as planters and desk decor.
              </p>
            </div>

          </div>
        </div>

        {/* Interactive Before vs After Comparison Switcher */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 bg-[#52091B] rounded-full border border-[#F2C76E]/30">
              <button
                onClick={() => handleTabSwitch('traditional')}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'traditional'
                    ? 'bg-[#7A0F29] text-[#FFF7E8] shadow-md border border-[#F2C76E]/40'
                    : 'text-[#FFF7E8]/70 hover:text-[#FFF7E8]'
                }`}
              >
                Old Mithai Culture 🛑
              </button>
              <button
                onClick={() => handleTabSwitch('remix')}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === 'remix'
                    ? 'bg-[#F4BD38] text-[#52091B] shadow-md font-black'
                    : 'text-[#FFF7E8]/70 hover:text-[#FFF7E8]'
                }`}
              >
                The मिठाई POP Way ✨
              </button>
            </div>
          </div>

          {/* Switcher Card */}
          <div className="transition-all duration-300">
            {activeTab === 'traditional' ? (
              <div className="bg-[#3D0713]/90 border-2 border-[#7A0F29] rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-stone-800 text-stone-300 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Traditional Mithai Experience
                  </div>
                  <h3 className="text-2xl font-black text-[#FFF7E8] font-display">Tied to dusty traditions</h3>
                  <ul className="space-y-3 text-xs sm:text-sm text-[#FFF7E8]/75">
                    <li className="flex items-start gap-2.5">
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <span>Cardboard boxes that leak sugar syrup into your fridge.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <span>Only consumed at formal weddings or annual festivals.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <span>Single monolithic flavours with no texture or temperature play.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <span>Packaging goes straight into the trash bin.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#2A050D] rounded-2xl p-6 border border-dashed border-[#7A0F29] text-center space-y-2">
                  <div className="text-4xl">📦🥀</div>
                  <p className="text-sm font-bold text-[#F2C76E]">“Too sweet, too formal, too messy.”</p>
                  <p className="text-xs text-[#FFF7E8]/60">Traditional mithai leaves modern snackers wanting something fresher and lighter.</p>
                </div>
              </div>
            ) : (
              <div className="bg-[#7A0F29]/95 border-2 border-[#F2C76E]/40 text-[#FFF7E8] rounded-3xl p-6 sm:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 bg-[#F4BD38]/20 text-[#F2C76E] border border-[#F4BD38]/40 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    मिठाई POP Experience
                  </div>
                  <h3 className="text-2xl font-black text-[#FFF7E8] font-display italic">Everyday Discovery & Play</h3>
                  <ul className="space-y-3 text-xs sm:text-sm text-[#FFF7E8]/90">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#F2C76E] shrink-0 mt-0.5" />
                      <span>Cold sealed cans that preserve aroma, freshness, and crispness.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#F2C76E] shrink-0 mt-0.5" />
                      <span>Enjoy anytime: midnight cravings, study snacks, or coffee breaks.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#F2C76E] shrink-0 mt-0.5" />
                      <span>Wild collisions: Warm gulab jamun with cold ice cream & pistachio.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#F2C76E] shrink-0 mt-0.5" />
                      <span>Keep the can: upcycle into desk planters and artistic organizers.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#52091B] rounded-2xl p-6 border border-[#F2C76E]/20 text-center space-y-3">
                  <div className="text-4xl">🥫✨🌱</div>
                  <p className="text-sm font-bold text-[#F2C76E]">“I’ve never had this before… but I need another one.”</p>
                  <p className="text-xs text-[#FFF7E8]/70">Portable, aesthetic, collectible, and seriously addictive.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
