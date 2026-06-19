'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { SlideTheme } from '@/lib/recap/theme-packs';
import type { AspectRatio } from '@/lib/recap/types';
import { CountUp } from './CountUp';
import { DecorLayers } from './DecorLayers';

interface WrappedSlideProps {
  theme: SlideTheme;
  slideNum: number;
  label: string;
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  footer?: string;
  active?: boolean;
  decor?: 'default' | 'burst' | 'pulse';
  layout?: AspectRatio;
  decorDisc?: React.ReactNode;
}

export function WrappedSlide({
  theme,
  slideNum,
  label,
  title,
  icon: Icon,
  children,
  footer,
  active = true,
  decor = 'default',
  layout = 'story',
  decorDisc,
}: WrappedSlideProps) {
  const padding = layout === 'wide' ? 'p-4 md:p-5' : 'p-6 md:p-8';

  return (
    <div className={`flex flex-col justify-between h-full ${padding} text-left relative overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
      <DecorLayers accent={theme.accent} variant={decor} active={active} />
      <div className="wrapped-grain absolute inset-0 pointer-events-none z-[1]" />

      {decorDisc && (
        <div className="absolute top-10 right-3 z-[3] pointer-events-none recap-disc-slot">
          {decorDisc}
        </div>
      )}

      <motion.div
        className="relative z-10 space-y-2"
        initial={{ opacity: 0, y: -12 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0.5, y: -12 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div
          className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase opacity-80"
          style={{ color: theme.accent }}
        >
          <span>{String(slideNum).padStart(2, '0')}</span>
          <span className="w-5 h-px" style={{ background: theme.accent }} />
          <span>{label}</span>
        </div>
        {title && (
          <h2 className={`font-display font-bold text-foreground/95 leading-tight ${layout === 'wide' ? 'text-sm md:text-base' : 'text-base md:text-lg'}`}>
            {title}
          </h2>
        )}
      </motion.div>

      <div className={`relative z-10 my-auto ${layout === 'wide' ? 'py-2' : 'py-3 md:py-5'}`}>
        {Icon && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={active ? { scale: 1, rotate: 0 } : { scale: 0.5, rotate: -20 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Icon className={`mb-3 md:mb-4 ${layout === 'wide' ? 'h-7 w-7' : 'h-9 w-9 md:h-10 md:w-10'}`} style={{ color: theme.accent }} />
          </motion.div>
        )}
        {children}
      </div>

      {footer && (
        <div className="relative z-10 font-mono text-[9px] md:text-[10px] text-foreground/35 uppercase tracking-[0.15em]">
          {footer}
        </div>
      )}

      <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none z-[2]">
        <span className="font-mono text-[8px] text-foreground/15 tracking-widest uppercase">RecapAnytime</span>
      </div>
    </div>
  );
}

interface WrappedStatProps {
  value?: React.ReactNode;
  numericValue?: number;
  unit?: string;
  accent: string;
  size?: 'lg' | 'xl';
  active?: boolean;
  layout?: AspectRatio;
}

export function WrappedStat({
  value,
  numericValue,
  unit,
  accent,
  size = 'xl',
  active = true,
  layout = 'story',
}: WrappedStatProps) {
  const sizeClass =
    layout === 'wide'
      ? size === 'xl' ? 'text-[2.25rem] md:text-[2.5rem]' : 'text-[1.5rem] md:text-[1.75rem]'
      : size === 'xl' ? 'text-[3rem] md:text-[3.5rem]' : 'text-[2.25rem] md:text-[2.75rem]';

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={active ? { opacity: 1, scale: 1 } : { opacity: 0.6, scale: 0.9 }}
      transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className={`${sizeClass} font-display font-bold tracking-tight leading-[0.95] text-foreground stat-glow`}>
        {numericValue !== undefined ? <CountUp value={numericValue} active={active} /> : value}
      </p>
      {unit && (
        <motion.p
          className={`font-display font-semibold ${layout === 'wide' ? 'text-base md:text-lg' : 'text-lg md:text-xl'}`}
          style={{ color: accent }}
          initial={{ opacity: 0, x: -10 }}
          animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {unit}
        </motion.p>
      )}
    </motion.div>
  );
}

interface WrappedCardProps {
  accent: string;
  children: React.ReactNode;
  active?: boolean;
  delay?: number;
}

export function WrappedCard({ accent, children, active = true, delay = 0.4 }: WrappedCardProps) {
  return (
    <motion.div
      className="rounded-xl p-4 backdrop-blur-sm border border-white/[0.08] relative overflow-hidden"
      style={{ background: `${accent}14` }}
      initial={{ opacity: 0, y: 16 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }} />
      {children}
    </motion.div>
  );
}

interface WrappedBodyProps {
  children: React.ReactNode;
  active?: boolean;
}

export function WrappedBody({ children, active = true }: WrappedBodyProps) {
  return (
    <motion.p
      className="font-mono text-xs md:text-[13px] text-foreground/60 leading-relaxed mt-4 max-w-[95%]"
      initial={{ opacity: 0 }}
      animate={active ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: 0.65, duration: 0.5 }}
    >
      {children}
    </motion.p>
  );
}
