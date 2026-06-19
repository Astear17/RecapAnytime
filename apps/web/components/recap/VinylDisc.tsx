'use client';

import { motion } from 'framer-motion';

interface VinylDiscProps {
  accent: string;
  label?: string;
  active?: boolean;
  size?: number;
  className?: string;
}

export function VinylDisc({ accent, label, active = true, size = 96, className = '' }: VinylDiscProps) {
  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      {/* Ambient glow */}
      <div
        className="absolute inset-[-20%] rounded-full opacity-30 blur-xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}44, transparent 70%)` }}
      />

      {/* Tonearm */}
      <div
        className="absolute -top-1 right-2 w-8 h-1 rounded-full origin-right z-10 opacity-60"
        style={{ background: 'linear-gradient(90deg, #888, #ccc)', transform: 'rotate(-28deg)' }}
      />

      <motion.div
        className="relative w-full h-full rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        animate={active ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
      >
        {/* Grooves */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 55%, #111 100%),
              repeating-radial-gradient(circle at center, transparent 0, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 3px)
            `,
          }}
        />

        {/* Shine */}
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: 'conic-gradient(from 200deg, transparent, rgba(255,255,255,0.15), transparent)',
          }}
        />

        {/* Label */}
        <div
          className="absolute inset-[28%] rounded-full flex items-center justify-center text-center p-1 border border-black/40"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${accent}ee, ${accent}99 60%, #111 100%)`,
          }}
        >
          <div className="w-[18%] h-[18%] rounded-full bg-[#111] border border-white/10 absolute" />
          {label && (
            <span className="font-mono text-[7px] uppercase tracking-wider text-white/90 leading-tight px-1 relative z-[1]">
              {label}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
