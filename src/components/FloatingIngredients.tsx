import React from 'react';

interface FloatingIngredientsProps {
  variant?: 'hero' | 'story' | 'lab';
}

export const FloatingIngredients: React.FC<FloatingIngredientsProps> = ({ variant = 'hero' }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-45">
      {/* Saffron Thread 1 */}
      <div
        className="absolute top-[18%] left-[8%] animate-float text-[#F4BD38] transform rotate-12 transition-transform duration-1000"
        style={{ animationDuration: '9s', animationDelay: '0s' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_8px_rgba(244,189,56,0.5)]">
          <path
            d="M3 19C8 18 12 14 15 9C17 6 19 3 21 3C20 6 18 10 15 14C12 18 7 21 3 19Z"
            fill="url(#saffronGrad1)"
          />
          <defs>
            <linearGradient id="saffronGrad1" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5A623" />
              <stop offset="0.6" stopColor="#E63946" />
              <stop offset="1" stopColor="#7A0F29" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Pistachio Sliver */}
      <div
        className="absolute top-[28%] right-[10%] animate-float-reverse text-[#A7C957]"
        style={{ animationDuration: '11s', animationDelay: '1.5s' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
          <ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(35 12 12)" fill="#84A98C" opacity="0.8" />
          <path d="M10 7C11 11 13 13 14 17" stroke="#F4BD38" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>

      {/* Rose Petal */}
      <div
        className="absolute bottom-[22%] left-[12%] animate-float-reverse text-[#F58FA3]"
        style={{ animationDuration: '13s', animationDelay: '3s' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
          <path
            d="M12 2C7 5 5 10 7 15C9 19 14 21 17 18C20 15 20 9 17 5C15 3 13 2 12 2Z"
            fill="#E56B82"
            opacity="0.65"
          />
        </svg>
      </div>

      {/* Cardamom Pod */}
      <div
        className="absolute bottom-[28%] right-[14%] animate-float text-[#606C38]"
        style={{ animationDuration: '10s', animationDelay: '2s' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
          <path
            d="M12 3C7 6 6 12 8 17C10 21 14 21 16 17C18 12 17 6 12 3Z"
            fill="#6B8E23"
            opacity="0.6"
          />
          <path d="M12 4V19" stroke="#F2C76E" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
      </div>

      {/* Jalebi Curve */}
      {variant === 'hero' && (
        <div
          className="absolute top-[65%] right-[6%] animate-float hidden md:block"
          style={{ animationDuration: '14s', animationDelay: '4s' }}
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="opacity-40">
            <path
              d="M16 8C11.5 8 8 11.5 8 16C8 20.5 11.5 24 16 24C20.5 24 24 20.5 24 16C24 12.5 21.5 10 18.5 10C15.5 10 13.5 12 13.5 15C13.5 18 15.5 20 18 20C19.5 20 20.5 19 20.5 17.5"
              stroke="#F4BD38"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Golden Micro Sparkle (Ambient) */}
      <div
        className="absolute top-[45%] left-[5%] animate-pulse-slow text-[#F4BD38]"
        style={{ animationDuration: '5s' }}
      >
        <span className="text-xs">✦</span>
      </div>

      <div
        className="absolute bottom-[38%] right-[7%] animate-pulse-slow text-[#FFF7E8]"
        style={{ animationDuration: '6s', animationDelay: '2.5s' }}
      >
        <span className="text-xs">✧</span>
      </div>
    </div>
  );
};
