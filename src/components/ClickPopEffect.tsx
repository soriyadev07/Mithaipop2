import React, { useEffect, useState } from 'react';

interface PopParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  char: string;
  duration: number;
}

const PARTICLES_POOL = ['✦', '✧', '•', '⋆', '✦'];
const BURST_COLORS = ['#F4BD38', '#F2C76E', '#FFF7E8', '#FFD6B8', '#F5A623'];

export const ClickPopEffect: React.FC = () => {
  const [bursts, setBursts] = useState<{ id: number; particles: PopParticle[] }[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleClick = (e: MouseEvent) => {
      // Find whether clicked element or ancestor is interactive or simply on document
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickX = e.clientX;
      const clickY = e.clientY;

      const count = Math.floor(Math.random() * 3) + 4; // 4 to 6 particles
      const newParticles: PopParticle[] = [];

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.5 - 0.25);
        const distance = Math.random() * 22 + 16; // 16px to 38px
        const size = Math.random() * 4 + 10; // 10px to 14px font size
        const color = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)];
        const char = PARTICLES_POOL[Math.floor(Math.random() * PARTICLES_POOL.length)];
        const duration = Math.random() * 150 + 350; // 350ms to 500ms

        newParticles.push({
          id: Math.random(),
          x: clickX,
          y: clickY,
          angle,
          distance,
          size,
          color,
          char,
          duration,
        });
      }

      const burstId = Date.now() + Math.random();
      setBursts((prev) => [...prev.slice(-6), { id: burstId, particles: newParticles }]);

      // Remove after animation finishes
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 550);
    };

    window.addEventListener('click', handleClick, { passive: true });
    return () => window.removeEventListener('click', handleClick);
  }, []);

  if (bursts.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {bursts.map((burst) =>
        burst.particles.map((p) => {
          const targetX = Math.cos(p.angle) * p.distance;
          const targetY = Math.sin(p.angle) * p.distance;

          return (
            <span
              key={p.id}
              className="absolute font-serif select-none pointer-events-none inline-block drop-shadow-[0_0_6px_rgba(244,189,56,0.8)]"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                color: p.color,
                fontSize: `${p.size}px`,
                lineHeight: 1,
                transform: 'translate(-50%, -50%)',
                animation: `clickPopAnim ${p.duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                // Custom CSS properties for keyframe target
                ['--target-x' as string]: `${targetX}px`,
                ['--target-y' as string]: `${targetY}px`,
              }}
            >
              {p.char}
            </span>
          );
        })
      )}
    </div>
  );
};
