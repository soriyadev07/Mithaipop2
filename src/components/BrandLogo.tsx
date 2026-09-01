import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'nav' | 'hero' | 'footer' | 'can-emblem';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
  centered = false,
}) => {
  const sizeClasses = {
    sm: 'scale-90',
    md: 'scale-100',
    lg: 'scale-110 md:scale-125',
    xl: 'scale-125 md:scale-150',
  };

  // Nav Variant: streamlined pill for header bar with one-line alignment
  if (variant === 'nav') {
    return (
      <div className={`inline-flex items-center group cursor-pointer ${sizeClasses[size]} ${className}`}>
        <div className="relative bg-[#F9BF29] hover:bg-[#F7C036] border-[2.5px] border-[#8B1838] px-4 py-1.5 rounded-full shadow-[2px_2px_0px_#4C091D] flex items-center justify-center transition-all duration-200 group-hover:scale-105">
          <div className="flex items-center whitespace-nowrap leading-none">
            <span className="font-hindi text-[#8B1838] text-xl sm:text-2xl font-black tracking-normal leading-none select-none drop-shadow-[1.5px_2px_0px_#4C091D]">
              मिठाई
            </span>
            <span className="font-brand-title text-[#8B1838] text-xl sm:text-2xl font-black tracking-tight leading-none ml-0.5 select-none drop-shadow-[1.5px_2px_0px_#4C091D]">
              POP
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Hero Variant: Centered, spacious, iconic badge without extra sub-pills
  if (variant === 'hero') {
    return (
      <div className={`inline-flex flex-col items-center group cursor-pointer ${className}`}>
        <div className="relative bg-[#F9BF29] hover:bg-[#F7C036] border-[3px] sm:border-[4px] border-[#8B1838] px-6 py-2 sm:px-9 sm:py-3 rounded-full shadow-[3px_3px_0px_#4C091D] sm:shadow-[4px_4px_0px_#4C091D] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[5px_5px_0px_#4C091D]">
          <div className="flex items-center whitespace-nowrap leading-none">
            <span className="font-hindi text-[#8B1838] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-normal leading-none select-none drop-shadow-[2px_3px_0px_#4C091D]">
              मिठाई
            </span>
            <span className="font-brand-title text-[#8B1838] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none ml-0.5 select-none drop-shadow-[2px_3px_0px_#4C091D]">
              POP
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center group cursor-pointer ${sizeClasses[size]} ${className}`}>
        <div className="relative bg-[#F9BF29] border-[3px] border-[#8B1838] px-4.5 py-1.5 rounded-full shadow-[2.5px_2.5px_0px_#4C091D] flex items-center justify-center transition-transform group-hover:scale-105">
          <div className="flex items-center whitespace-nowrap leading-none">
            <span className="font-hindi text-[#8B1838] text-2xl font-black tracking-normal leading-none select-none drop-shadow-[2px_2px_0px_#4C091D]">
              मिठाई
            </span>
            <span className="font-brand-title text-[#8B1838] text-2xl font-black tracking-tight leading-none ml-0.5 select-none drop-shadow-[2px_2px_0px_#4C091D]">
              POP
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`inline-flex flex-col items-start gap-2 ${sizeClasses[size]} ${className}`}>
        <div className="relative bg-[#F9BF29] border-[3px] border-[#8B1838] px-5 py-2 rounded-full shadow-[2px_2px_0px_#4C091D] flex items-center justify-center">
          <div className="flex items-center whitespace-nowrap leading-none">
            <span className="font-hindi text-[#8B1838] text-2xl sm:text-3xl font-black tracking-normal leading-none select-none drop-shadow-[2px_2px_0px_#4C091D]">
              मिठाई
            </span>
            <span className="font-brand-title text-[#8B1838] text-2xl sm:text-3xl font-black tracking-tight leading-none ml-0.5 select-none drop-shadow-[2px_2px_0px_#4C091D]">
              POP
            </span>
          </div>
        </div>
        <div className="bg-[#F9BF29] border-2 border-[#8B1838] px-3.5 py-1 rounded-full shadow-[1.5px_1.5px_0px_#4C091D]">
          <span className="text-[11px] font-brand-tagline font-bold tracking-wide text-[#8B1838]">
            Fusion indian desserts in a Soda Can
          </span>
        </div>
      </div>
    );
  }

  // Full Brand Logo matching the exact layout and font from the uploaded image
  return (
    <div className={`inline-flex flex-col ${centered ? 'items-center' : 'items-start'} gap-2 ${sizeClasses[size]} ${className}`}>
      {/* Primary Yellow Pill with मिठाई (Hindi) and POP (English) in One Single Line Alignment */}
      <div className="relative group transition-all duration-300 transform hover:-translate-y-0.5">
        <div className="bg-[#F9BF29] hover:bg-[#F7C036] border-[3.5px] border-[#8B1838] px-6 py-2.5 sm:px-8 sm:py-3 rounded-full shadow-[3.5px_3.5px_0px_#4C091D] flex items-center justify-center relative overflow-hidden transition-colors">
          <div className="flex items-center whitespace-nowrap leading-none">
            <span className="font-hindi text-[#8B1838] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-normal leading-none select-none drop-shadow-[2.5px_3.5px_0px_#4C091D]">
              मिठाई
            </span>
            <span className="font-brand-title text-[#8B1838] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none ml-0.5 select-none drop-shadow-[2.5px_3.5px_0px_#4C091D]">
              POP
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Pill: Tagline exactly as in the image */}
      <div className="bg-[#F9BF29] border-[2.5px] border-[#8B1838] px-4 py-1.5 rounded-full shadow-[2px_2px_0px_#4C091D] inline-flex items-center">
        <span className="text-xs sm:text-sm font-brand-tagline text-[#8B1838] tracking-wide">
          Fusion indian desserts in a Soda Can
        </span>
      </div>
    </div>
  );
};

