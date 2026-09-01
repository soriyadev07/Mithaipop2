import React, { useEffect, useState } from 'react';

export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-[#52091B]/20">
      <div
        className="h-full bg-gradient-to-r from-[#7A0F29] via-[#F4BD38] to-[#FFF7E8] transition-all duration-75 ease-out relative shadow-[0_0_8px_rgba(244,189,56,0.6)]"
        style={{ width: `${progress}%` }}
      >
        {/* Subtle glowing leading edge */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FFF7E8] rounded-full blur-[2px] opacity-80" />
      </div>
    </div>
  );
};
