'use client';

import { useEffect, useRef } from 'react';

const COLORS = ['#ff3b5c', '#25f4ee', '#1db954', '#facc15', '#a855f7', '#fb923c', '#fafaf8'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  shape: 'rect' | 'circle';
  life: number;
}

interface ConfettiCanvasProps {
  active: boolean;
  burst?: boolean;
}

export function ConfettiCanvas({ active, burst = false }: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resize();

    const spawn = (count: number, fromTop = false) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: burst ? canvas.width / 2 : Math.random() * canvas.width,
          y: burst ? canvas.height * 0.45 : fromTop ? -10 : Math.random() * canvas.height * 0.3,
          vx: burst ? (Math.random() - 0.5) * 14 : (Math.random() - 0.5) * 4,
          vy: burst ? (Math.random() - 0.8) * 12 : Math.random() * 3 + 2,
          size: Math.random() * 6 + 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * 360,
          spin: (Math.random() - 0.5) * 12,
          shape: Math.random() > 0.5 ? 'rect' : 'circle',
          life: 1,
        });
      }
    };

    particlesRef.current = [];
    if (burst) spawn(80, false);
    else spawn(40, true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      if (!burst && frame % 18 === 0 && particlesRef.current.length < 60) {
        spawn(3, true);
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.vx *= 0.99;
        p.rotation += p.spin;
        p.life -= burst ? 0.008 : 0.004;

        if (p.life <= 0 || p.y > canvas.height + 20) return false;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.min(1, p.life);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return true;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    loop();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      particlesRef.current = [];
    };
  }, [active, burst]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[25]"
      aria-hidden
    />
  );
}
