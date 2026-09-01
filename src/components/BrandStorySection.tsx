import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Sparkles, Award } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const BrandStorySection: React.FC = () => {
  return (
    <section id="story" className="py-20 bg-transparent text-[#FFF7E8] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Official Logo Motif & Visual Craft */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <ScrollReveal direction="left" delay={0}>
              <div className="w-full max-w-md bg-[#3D0713]/95 border-2 border-[#F2C76E] rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden backdrop-blur-md">
                
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#F2C76E]/15 rounded-full blur-2xl pointer-events-none" />

                {/* Logo emblem */}
                <div className="flex justify-center">
                  <BrandLogo variant="can-emblem" className="w-36 h-auto" />
                </div>

                {/* Brand Logo Header */}
                <div className="flex justify-center">
                  <BrandLogo variant="full" size="md" />
                </div>

                <div className="bg-[#52091B]/90 p-4 rounded-2xl border border-[#F2C76E]/30 text-left space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#F2C76E] uppercase tracking-widest">
                    <Award className="w-4 h-4 text-[#F4BD38]" />
                    <span>The Mithai Pop Manifesto</span>
                  </div>
                  <p className="text-xs text-[#FFF7E8]/90 italic font-normal leading-relaxed">
                    “We honor the sweet masters of Varanasi, Bengal, and Old Delhi not by preserving them in amber, but by launching their genius into the modern stratosphere.”
                  </p>
                </div>

              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Story Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <ScrollReveal direction="right" delay={100}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4BD38]/20 border border-[#F4BD38]/40 text-[#F2C76E]">
                <Sparkles className="w-3.5 h-3.5 text-[#F4BD38]" />
                <span className="text-[10px] font-bold uppercase tracking-widest font-display">Origins & Soul</span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-[#FFF7E8] leading-tight italic mt-3">
                Mithai deserved a remix.
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-[#FFF7E8]/85 leading-relaxed font-normal mt-4">
                <p>
                  Mithai Pop started with a simple thought: <span className="font-bold text-[#F2C76E]">India has one of the world’s richest, most sophisticated dessert cultures.</span> From the slow reduction of buffalo milk to the delicate alchemy of date-palm jaggery and fermented saffron spirals, our flavour lexicon is unmatched.
                </p>

                <p className="font-bold text-[#F4BD38]">
                  But what happens when those flavours are allowed to break the rules?
                </p>

                <p className="text-sm sm:text-base text-[#FFF7E8]/80">
                  What if molten gulab jamun crashed into slow-churned Madagascar vanilla cream? What if crispy jalebis stayed snappy inside rich clotted rabri? What if Indian sweets became collectible, portable, and visually electric for a new generation that lives on discovery?
                </p>

                <p className="font-bold text-[#F2C76E] text-base sm:text-lg italic">
                  That’s Mithai Pop. A celebration of Indian flavour — without the traditional rulebook.
                </p>
              </div>

              {/* Quality Standard Badges */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#3D0713]/90 border border-[#F2C76E]/30 p-4 rounded-2xl shadow-md">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#F2C76E]">100% Real Dairy</p>
                  <p className="text-[11px] text-[#FFF7E8]/70 mt-0.5">Pure Cow & Buffalo Milk</p>
                </div>

                <div className="bg-[#3D0713]/90 border border-[#F2C76E]/30 p-4 rounded-2xl shadow-md">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#F2C76E]">Kashmir Saffron</p>
                  <p className="text-[11px] text-[#FFF7E8]/70 mt-0.5">Grade-A Mongra Threads</p>
                </div>

                <div className="bg-[#3D0713]/90 border border-[#F2C76E]/30 p-4 rounded-2xl shadow-md">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#F2C76E]">Airtight Can Seal</p>
                  <p className="text-[11px] text-[#FFF7E8]/70 mt-0.5">Zero Syrupy Leaks</p>
                </div>
              </div>
            </ScrollReveal>

          </div>

        </div>

      </div>
    </section>
  );
};
