import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  maxLife: number;
  life: number;
  color: string;
  shape: 'star' | 'circle' | 'sparkle';
  rotation: number;
  rotSpeed: number;
}

const COLORS = [
  '#F4BD38', // Warm Gold
  '#F2C76E', // Soft Gold
  '#FFF7E8', // Cream
  '#FFD6B8', // Soft Peach
  '#F5A623', // Amber Gold
];

export const SparkleCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMousePos = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Check if device supports fine cursor (desktop) and prefers motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dist = Math.hypot(dx, dy);

      // Only spawn particle if mouse moved noticeably (every ~18px or 45ms) to keep it subtle & lightweight
      if (dist > 18 || (dist > 6 && now - lastMousePos.current.time > 45)) {
        lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };

        // Keep maximum 22 active particles for lightweight performance
        if (particlesRef.current.length < 22) {
          const shapes: ('star' | 'circle' | 'sparkle')[] = ['sparkle', 'star', 'circle'];
          const shape = shapes[Math.floor(Math.random() * shapes.length)];
          const color = COLORS[Math.floor(Math.random() * COLORS.length)];
          const size = Math.random() * 3.5 + 2; // 2px to 5.5px

          particlesRef.current.push({
            x: e.clientX + (Math.random() * 6 - 3),
            y: e.clientY + (Math.random() * 6 - 3),
            vx: (Math.random() - 0.5) * 0.6,
            vy: Math.random() * 0.4 - 0.7, // slight upward float
            size,
            opacity: 0.85,
            maxLife: Math.random() * 20 + 25, // ~450ms lifetime
            life: 0,
            color,
            shape,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.08,
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Draw helper for 4-point golden sparkle
    const drawSparkle = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.rotate(Math.PI / 2);
        c.lineTo(size, 0);
        c.lineTo(size * 0.25, size * 0.25);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        const progress = p.life / p.maxLife;
        const currentOpacity = (1 - progress) * p.opacity;
        const currentScale = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8 * 0.6;
        const currentSize = p.size * currentScale;

        if (progress >= 1 || currentSize <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, currentOpacity);

        // Soft glow for sparkles
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;

        if (p.shape === 'sparkle' || p.shape === 'star') {
          drawSparkle(ctx, p.x, p.y, currentSize * 1.6, p.rotation);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-300"
      style={{ willChange: 'transform' }}
    />
  );
};
