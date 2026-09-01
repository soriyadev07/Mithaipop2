import React from 'react';
import { REVIEWS, SOCIAL_POSTS } from '../data/reviews';
import { Star, CheckCircle2, Heart, Instagram, Sparkles, Sprout } from 'lucide-react';
import { planterCanImg, delhiPopImg, kolkataPopImg, lucknowPopImg } from '../data/products';
import { ScrollReveal } from './ScrollReveal';

export const SocialProofSection: React.FC = () => {
  return (
    <section id="reviews" className="py-20 bg-transparent text-[#FFF7E8] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 z-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4BD38]/20 border border-[#F4BD38]/40 text-[#F2C76E]">
              <Sparkles className="w-3.5 h-3.5 text-[#F4BD38]" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-display">Social Buzz</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-[#FFF7E8] italic">
              People are popping off.
            </h2>

            <p className="text-base sm:text-lg text-[#FFF7E8]/85 font-medium max-w-2xl mx-auto leading-relaxed">
              From midnight sweet cravings to viral desk upcycle videos — see how India is experiencing Mithai Pop.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials Review Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {REVIEWS.slice(0, 3).map((review, idx) => (
            <ScrollReveal key={review.id} direction="up" delay={idx * 100}>
              <div
                className="bg-[#3D0713]/90 backdrop-blur-md border-2 border-[#F2C76E]/30 hover:border-[#F2C76E] rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  {/* Rating stars */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-[#F4BD38]">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2C76E] bg-[#52091B] px-3 py-1 rounded-full border border-[#F2C76E]/20">
                      {review.favoritePop}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-[#FFF7E8]/90 font-normal leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Author & Upcycle Tag */}
                <div className="mt-6 pt-4 border-t border-[#F2C76E]/20 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#F2C76E] uppercase tracking-wider">{review.author}</span>
                      {review.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F4BD38]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#FFF7E8]/60 font-medium">{review.city}</span>
                  </div>

                  {review.upcycledUse && (
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#F2C76E] bg-[#52091B] border border-[#F2C76E]/30 px-2.5 py-1 rounded-md">
                      <Sprout className="w-3 h-3 text-[#F4BD38]" />
                      <span>{review.upcycledUse}</span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Instagram UGC Section */}
        <div className="mt-20">
          <ScrollReveal direction="up" delay={0}>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#F2C76E]">
                  <Instagram className="w-4 h-4 text-[#F4BD38]" />
                  <span>@mithaipop</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#FFF7E8] mt-1 font-display italic">
                  Made to be eaten. Made to be posted.
                </h3>
              </div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full border-2 border-[#F2C76E] text-xs font-bold uppercase tracking-widest text-[#F2C76E] hover:bg-[#F4BD38] hover:text-[#52091B] transition-colors"
              >
                Follow on Instagram →
              </a>
            </div>
          </ScrollReveal>

          {/* Social Posts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOCIAL_POSTS.map((post, idx) => {
              const postImages = [delhiPopImg, planterCanImg, kolkataPopImg, lucknowPopImg];
              return (
                <ScrollReveal key={post.id} direction="up" delay={idx * 80}>
                  <div
                    className="group bg-[#3D0713]/90 backdrop-blur-md border border-[#F2C76E]/30 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between"
                  >
                    <div className="aspect-square relative overflow-hidden bg-[#2A050D]">
                      <img
                        src={postImages[idx % postImages.length]}
                        alt={post.caption}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 right-3 bg-[#2A050D]/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#F2C76E]/30">
                        <Heart className="w-3 h-3 text-red-400 fill-current" />
                        <span>{post.likes}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#F2C76E] uppercase tracking-wider">{post.user}</span>
                        <span className="text-[10px] text-[#FFF7E8]/50 font-medium">{post.time}</span>
                      </div>
                      <p className="text-xs text-[#FFF7E8]/85 font-normal line-clamp-2 leading-relaxed">{post.caption}</p>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#F2C76E] bg-[#52091B] px-2.5 py-1 rounded-md border border-[#F2C76E]/20">
                        #{post.tag.replace(/\s+/g, '')}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
