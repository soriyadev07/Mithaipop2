import React, { useState } from 'react';
import { FAQS } from '../data/reviews';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/audio';
import { ScrollReveal } from './ScrollReveal';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  const toggle = (id: string) => {
    sounds.playClick();
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 bg-transparent text-[#FFF7E8] relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4BD38]/20 border border-[#F4BD38]/40 text-[#F2C76E]">
              <HelpCircle className="w-3.5 h-3.5 text-[#F4BD38]" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">Got Questions?</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-[#FFF7E8] italic">
              Frequently Asked Questions.
            </h2>

            <p className="text-base sm:text-lg text-[#FFF7E8]/85 font-medium max-w-xl mx-auto leading-relaxed">
              Everything you need to know about our cold canning technology, shelf life, and upcycling.
            </p>
          </div>
        </ScrollReveal>

        {/* Accordion List */}
        <div className="mt-12 space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <ScrollReveal key={faq.id} direction="up" delay={idx * 60}>
                <div
                  className="bg-[#3D0713]/90 backdrop-blur-md border-2 border-[#F2C76E]/30 hover:border-[#F2C76E] rounded-2xl overflow-hidden transition-all shadow-xl"
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="text-base sm:text-lg font-bold text-[#FFF7E8]">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-[#52091B] border border-[#F2C76E]/30 flex items-center justify-center text-[#F2C76E] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-[#F4BD38] text-[#52091B]' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-sm text-[#FFF7E8]/85 font-normal leading-relaxed border-t border-[#F2C76E]/20 pt-4 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
