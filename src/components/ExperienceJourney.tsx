import React from 'react';
import { Eye, HelpCircle, Utensils, Heart, Sparkles, Sprout } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

const STEPS = [
  {
    step: '01',
    title: 'See It',
    icon: Eye,
    desc: 'You spot a striking luxury soda can covered in Indian truck-art typography and Mughal filigree.',
    pill: 'The Eye Catch'
  },
  {
    step: '02',
    title: 'Get Curious',
    icon: HelpCircle,
    desc: '“Wait, gulab jamun in a can with ice cream? How does that even work?” Curiosity takes over.',
    pill: 'The Spark'
  },
  {
    step: '03',
    title: 'Take the First Bite',
    icon: Utensils,
    desc: 'You pull the tab with a satisfying hiss. The spoon scoops through cold velvet cream into warm spiced khoya.',
    pill: 'The Collision'
  },
  {
    step: '04',
    title: 'Fall in Love',
    icon: Heart,
    desc: 'Familiar flavours hit with completely new intensity. You finish the can and crave the next city drop.',
    pill: 'The Addiction'
  },
  {
    step: '05',
    title: 'Keep the Can',
    icon: Sprout,
    desc: 'Rinse with warm water. Pop a baby jade plant or your favorite pens inside. It stays on your desk forever.',
    pill: 'The Second Life'
  }
];

export const ExperienceJourney: React.FC = () => {
  return (
    <section className="py-20 bg-transparent text-[#FFF7E8] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4BD38]/20 border border-[#F4BD38]/40 text-[#F2C76E]">
              <Sparkles className="w-3.5 h-3.5 text-[#F4BD38]" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">The Ritual</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-[#FFF7E8] italic">
              From “What is that?” to “Give me another one.”
            </h2>

            <p className="text-base sm:text-lg text-[#FFF7E8]/85 leading-relaxed font-medium">
              The 5-step journey that turns first-time sceptics into lifelong Mithai Pop collectors.
            </p>
          </div>
        </ScrollReveal>

        {/* 5-Step Horizontal Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.step} direction="up" delay={index * 70}>
                <div
                  className="bg-[#3D0713]/90 backdrop-blur-md border-2 border-[#F2C76E]/25 hover:border-[#F2C76E] rounded-3xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between relative group h-full"
                >
                  {/* Step number badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-2xl text-[#F2C76E]/50 group-hover:text-[#F4BD38] transition-colors">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#52091B] border border-[#F2C76E]/30 flex items-center justify-center text-[#F2C76E]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="my-4 space-y-2">
                    <span className="inline-block text-[10px] font-bold text-[#F4BD38] uppercase tracking-wider">
                      {item.pill}
                    </span>
                    <h3 className="text-lg font-black text-[#FFF7E8] font-display italic">{item.title}</h3>
                    <p className="text-xs text-[#FFF7E8]/80 leading-relaxed font-normal">{item.desc}</p>
                  </div>

                  {/* Bottom decorative bar */}
                  <div className="pt-2 border-t border-[#F2C76E]/15">
                    <div className="w-full bg-[#2A050D] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#F4BD38] h-full transition-all duration-500"
                        style={{ width: `${(index + 1) * 20}%` }}
                      />
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
