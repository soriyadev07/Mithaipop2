import React from 'react';
import { Heart, Sparkles, Compass, Share2, Sprout, Clock, Zap } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { FloatingIngredients } from './FloatingIngredients';

const PILLARS = [
  {
    icon: Heart,
    title: 'Familiar Flavours',
    desc: 'Pure desi ghee, fresh cow milk chena, slow-simmered rabri, and aromatic cardamom. Indian desserts you already love with your whole heart.',
    color: '#F4BD38'
  },
  {
    icon: Zap,
    title: 'Unexpected Combinations',
    desc: 'Hot syrup meeting ice-cold cream, snappy jalebis inside silky malai. Flavours collided in ways you have never experienced.',
    color: '#F4BD38'
  },
  {
    icon: Compass,
    title: 'Made to Discover',
    desc: 'Every single pop triggers curiosity. A new city, a forgotten street stall, or a seasonal harvest reimagined in modern format.',
    color: '#F4BD38'
  },
  {
    icon: Share2,
    title: 'Made to Share',
    desc: 'From the satisfying tab pop sound to the stunning dual-tone cross-sections — designed for unboxing moments worth posting.',
    color: '#F4BD38'
  },
  {
    icon: Sprout,
    title: 'Made to Keep',
    desc: '100% infinitely recyclable aluminum cans adorned with museum-grade UV artwork. Turn them into planters, pen stands, and decor.',
    color: '#F4BD38'
  },
  {
    icon: Clock,
    title: 'Made for Today',
    desc: 'On-demand cold delivery to your doorstep within 48h. Zero mess, zero leaking boxes, pure indulgence whenever a craving strikes.',
    color: '#F4BD38'
  }
];

export const WhyMithaiPop: React.FC = () => {
  return (
    <section id="why-us" className="py-20 bg-transparent text-[#FFF7E8] relative overflow-hidden">
      <FloatingIngredients variant="section" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F4BD38]/15 border border-[#F4BD38]/30 text-[#F4BD38]">
              <Sparkles className="w-3.5 h-3.5 text-[#F4BD38]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Why Mithai Pop</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-[#FFF7E8]">
              Classic flavours. Completely new experience.
            </h2>

            <p className="text-sm sm:text-base text-[#FFF7E8]/80 leading-relaxed font-medium max-w-xl mx-auto">
              We exist at the intersection of deep Indian culinary heritage and modern creative food design.
            </p>
          </div>
        </ScrollReveal>

        {/* Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <ScrollReveal key={i} direction="up" delay={(i % 3) * 100}>
                <div
                  className="group bg-[#3D0713]/90 backdrop-blur-md border-2 border-[#F2C76E]/30 hover:border-[#F2C76E] rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 relative flex flex-col justify-between h-full"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#52091B] border border-[#F2C76E]/30 flex items-center justify-center text-[#F2C76E] group-hover:bg-[#F4BD38] group-hover:text-[#52091B] transition-colors shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-black text-[#FFF7E8] font-display group-hover:text-[#F2C76E] transition-colors italic">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#FFF7E8]/80 leading-relaxed font-normal">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F2C76E]/20 flex items-center justify-between text-[11px] font-bold text-[#F2C76E]">
                    <span>Pillar 0{i + 1}</span>
                    <span className="text-[#F4BD38]">✦ ✦ ✦</span>
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
