import React, { useState } from 'react';
import { CITY_STORIES } from '../data/stories';
import { MapPin, ArrowRight, Quote, Compass } from 'lucide-react';
import { sounds } from '../utils/audio';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { ScrollReveal } from './ScrollReveal';

export const CityStorySection: React.FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string>('delhi');
  const { setSelectedProductModal, addToCart } = useCart();

  const currentCity = CITY_STORIES.find((c) => c.id === selectedCityId) || CITY_STORIES[0];
  const matchingProduct = PRODUCTS.find((p) => p.id === currentCity.popProductId) || PRODUCTS[0];

  const handleCitySelect = (id: string) => {
    sounds.playClick();
    setSelectedCityId(id);
  };

  return (
    <section id="cities" className="py-20 bg-transparent text-[#FFF7E8] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 z-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4BD38]/20 border border-[#F4BD38]/40 text-[#F2C76E]">
              <Compass className="w-3.5 h-3.5 text-[#F4BD38]" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">Flavour Geography</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-[#FFF7E8] italic">
              A dessert can taste like a place.
            </h2>

            <p className="text-base sm:text-lg text-[#FFF7E8]/85 font-medium leading-relaxed">
              Every can is an architectural and culinary map of an Indian city — capturing its morning milk stalls, 
              royal court recipes, street graffiti, and midnight nostalgic conversations.
            </p>
          </div>
        </ScrollReveal>

        {/* City Selector Tabs */}
        <ScrollReveal direction="up" delay={100}>
          <div className="mt-10 flex flex-wrap justify-center gap-2.5">
            {CITY_STORIES.map((city) => {
              const isSelected = city.id === selectedCityId;
              return (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 transform active:scale-95 ${
                    isSelected
                      ? 'bg-[#F4BD38] text-[#52091B] shadow-md border border-[#F4BD38] scale-105 font-black'
                      : 'bg-[#52091B]/80 text-[#FFF7E8] border border-[#F2C76E]/30 hover:bg-[#7A0F29]'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#52091B]' : 'text-[#F2C76E]'}`} />
                  <span>{city.cityName}</span>
                  <span className="text-[10px] opacity-80 font-hindi">({city.hindiName})</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Interactive Story Showcase Stage */}
        <ScrollReveal direction="up" delay={150}>
          <div className="mt-12 bg-[#3D0713]/90 backdrop-blur-md text-[#FFF7E8] border-2 border-[#F2C76E]/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-300">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left: Product & Artwork Card */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#52091B] border border-[#F2C76E]/30 rounded-2xl p-5 shadow-lg relative group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-[#2A050D] relative p-3">
                    <img
                      src={matchingProduct.image}
                      alt={matchingProduct.name}
                      className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#F4BD38] text-[#52091B] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {currentCity.cityName} Edition
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-[#FFF7E8] font-display italic">{matchingProduct.name}</h3>
                      <p className="text-xs font-bold text-[#F2C76E] uppercase tracking-wide">{currentCity.dishRemix}</p>
                    </div>
                    <button
                      onClick={() => addToCart(matchingProduct, 1)}
                      className="px-4 py-2 bg-[#F4BD38] hover:bg-[#FFF7E8] text-[#52091B] font-bold text-xs uppercase tracking-widest rounded-full shadow-sm transition-all transform active:scale-95 border border-[#52091B] btn-shimmer-sheen"
                    >
                      Quick Add ₹{matchingProduct.price}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Narrative Story & Cultural Note */}
              <div className="lg:col-span-7 space-y-5">
                
                <div className="flex items-center gap-3">
                  <span className="font-hindi text-3xl sm:text-4xl text-[#F2C76E] font-black drop-shadow">
                    {currentCity.hindiName}
                  </span>
                  <span className="text-[10px] font-bold text-[#FFF7E8] uppercase tracking-widest bg-[#52091B] px-3.5 py-1 rounded-full border border-[#F2C76E]/20">
                    {currentCity.state}
                  </span>
                </div>

                {/* Quote */}
                <div className="relative pl-6 border-l-2 border-[#F2C76E] italic text-[#FFD6B8] text-sm sm:text-base leading-relaxed">
                  <Quote className="w-4 h-4 text-[#F2C76E] absolute -left-2 top-0 fill-current opacity-80" />
                  {currentCity.quote}
                </div>

                {/* Main Narrative */}
                <p className="text-sm sm:text-base text-[#FFF7E8]/90 leading-relaxed font-normal">
                  {currentCity.story}
                </p>

                {/* Cultural & Artwork Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#52091B]/80 border border-[#F2C76E]/20 p-4 rounded-xl space-y-1">
                    <p className="text-[10px] font-bold text-[#F2C76E] uppercase tracking-widest">The Memory:</p>
                    <p className="text-xs text-[#FFF7E8]/80 leading-relaxed font-normal">{currentCity.culturalNote}</p>
                  </div>

                  <div className="bg-[#52091B]/80 border border-[#F2C76E]/20 p-4 rounded-xl space-y-1">
                    <p className="text-[10px] font-bold text-[#F2C76E] uppercase tracking-widest">The Can Artwork:</p>
                    <p className="text-xs text-[#FFF7E8]/80 leading-relaxed font-normal">{currentCity.artMotif}</p>
                  </div>
                </div>

                {/* Button to open detailed modal */}
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedProductModal(matchingProduct)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F2C76E] hover:text-[#FFF7E8] transition-colors group"
                  >
                    <span>Explore full recipe and profile for {currentCity.cityName}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
