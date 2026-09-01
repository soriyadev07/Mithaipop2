import React, { useState } from 'react';
import { Sparkles, Instagram, Twitter, MessageCircle, MapPin, Send, Check } from 'lucide-react';
import { sounds } from '../utils/audio';
import { BrandLogo } from './BrandLogo';
import { tapestryRedBg } from '../data/products';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sounds.playCelebration();
    setSubscribed(true);
    setEmail('');
  };

  const scrollToSection = (id: string) => {
    sounds.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hubs = [
    'Delhi NCR',
    'Mumbai',
    'Bengaluru',
    'Kolkata',
    'Lucknow',
    'Jaipur',
    'Hyderabad',
    'Pune',
    'Chandigarh',
    'Ahmedabad'
  ];

  return (
    <footer className="bg-[#1A0308]/90 backdrop-blur-md text-[#FFF7E8] relative overflow-hidden border-t border-[#F2C76E]/30">
      {/* Editorial Final CTA Banner Section */}
      <div className="relative border-b border-[#F2C76E]/20 py-20 bg-transparent overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F4BD38]/15 border border-[#F4BD38]/30 text-[#F4BD38]">
            <Sparkles className="w-3.5 h-3.5 text-[#F4BD38]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Cold Drops Daily</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-[#FFF7E8]">
            Your favourite mithai just got interesting.
          </h2>

          <p className="text-base sm:text-lg text-[#FFF7E8]/85 max-w-xl mx-auto font-medium leading-relaxed">
            Your next favourite dessert collision is one pop away. Shipped cold at 4°C inside collectible art tinware.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('menu')}
              className="w-full sm:w-auto px-10 py-4 bg-[#F4BD38] hover:bg-[#FFF7E8] text-[#52091B] font-black text-xs sm:text-sm uppercase tracking-widest rounded-full shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-[#F4BD38]"
            >
              <Sparkles className="w-4 h-4 text-[#52091B]" />
              <span>Explore the Pops</span>
            </button>

            <button
              onClick={() => scrollToSection('pop-lab')}
              className="w-full sm:w-auto px-8 py-4 bg-[#3D0713]/80 hover:bg-[#52091B] text-[#FFF7E8] font-bold text-xs sm:text-sm uppercase tracking-widest rounded-full border-2 border-[#F2C76E]/40 hover:border-[#F2C76E] transition-all"
            >
              Build In Pop Lab
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="footer" />
            
            <p className="text-[11px] font-bold uppercase tracking-widest italic text-[#F2C76E]">
              The dessert ends. The story doesn't.
            </p>

            <p className="text-xs text-[#FFF7E8]/70 leading-relaxed font-normal">
              Indian nostalgia. Unexpected fusion. Modern convenience. 
              We reimagine beloved Indian desserts through radical collisions, airtight cold-canning, and collectible packaging.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#FFF7E8]/80 hover:text-[#F2C76E] hover:border-[#F2C76E] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#FFF7E8]/80 hover:text-[#F2C76E] hover:border-[#F2C76E] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-[#FFF7E8]/80 hover:text-[#F2C76E] hover:border-[#F2C76E] transition-colors"
                aria-label="WhatsApp VIP Drops"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Editorial Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[11px] font-bold text-[#F2C76E] uppercase tracking-widest font-display">Explore</p>
            <ul className="space-y-2 text-xs text-[#FFF7E8]/70 font-semibold uppercase tracking-wider">
              <li>
                <button onClick={() => scrollToSection('menu')} className="hover:text-[#F2C76E] transition-colors">
                  Menu
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('pop-lab')} className="hover:text-[#F2C76E] transition-colors">
                  Build Your Own Pop
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('story')} className="hover:text-[#F2C76E] transition-colors">
                  Story
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('cities')} className="hover:text-[#F2C76E] transition-colors">
                  Drops
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('reviews')} className="hover:text-[#F2C76E] transition-colors">
                  Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Active Delivery Hubs */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-[11px] font-bold text-[#F2C76E] uppercase tracking-widest font-display">
              Cold-Chain Metros
            </p>
            <div className="flex flex-wrap gap-1.5">
              {hubs.map((hub) => (
                <span
                  key={hub}
                  className="text-[10px] font-bold uppercase tracking-wider bg-[#3D0713] border border-[#F2C76E]/20 text-[#FFF7E8]/80 px-2 py-0.5 rounded-md flex items-center gap-1"
                >
                  <MapPin className="w-2.5 h-2.5 text-[#F4BD38]" />
                  {hub}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-[#FFF7E8]/50 pt-1">
              Delivered within 24–48 hours across major metros via cryogenic temperature-locked insulation.
            </p>
          </div>

          {/* Col 4: VIP Drop Club Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-[11px] font-bold text-[#F2C76E] uppercase tracking-widest font-display">
              VIP Drop Club
            </p>
            <p className="text-xs text-[#FFF7E8]/70 leading-relaxed">
              Get notified first when rare city editions (like Varanasi Malaiyyo Pop) drop.
            </p>

            {subscribed ? (
              <div className="bg-emerald-900/40 border border-emerald-500/50 p-3 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>You’re in the VIP Drop circle!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/20 text-[#FFF7E8] placeholder-[#FFF7E8]/40 focus:outline-none focus:border-[#F2C76E]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#F4BD38] hover:bg-[#FFF7E8] text-[#52091B] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center border border-[#F4BD38]"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom copyright line with Editorial tracking */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFF7E8]/50 gap-4">
          <p>© {new Date().getFullYear()} मिठाई POP Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <span>Crafted with 100% Desi Ghee & Pure Curiosity in India 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
