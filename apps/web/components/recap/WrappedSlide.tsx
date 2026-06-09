'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { SlideTheme } from '@/lib/slide-themes';
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
  animateKey?: string | number;
  active?: boolean;
  decor?: 'default' | 'burst' | 'pulse';
}

export function WrappedSlide({
  theme,
  slideNum,
  label,
  title,
  icon: Icon,
  children,
  footer,
  animateKey,
  active = true,
  decor = 'default',
}: WrappedSlideProps) {
  return (
    <motion.div
      key={animateKey}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col justify-between h-full p-6 md:p-8 text-left relative overflow-hidden bg-gradient-to-br ${theme.gradient}`}
    >
      <DecorLayers accent={theme.accent} variant={decor} active={active} />
      <div className="wrapped-grain absolute inset-0 pointer-events-none z-[1]" />

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
          <h2 className="font-display text-base md:text-lg font-bold text-foreground/95 leading-tight">
            {title}
          </h2>
        )}
      </motion.div>

      <div className="relative z-10 my-auto py-3 md:py-5">
        {Icon && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={active ? { scale: 1, rotate: 0 } : { scale: 0.5, rotate: -20 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Icon className="h-9 w-9 md:h-10 md:w-10 mb-3 md:mb-4" style={{ color: theme.accent }} />
          </motion.div>
        )}
        {children}
      </div>

      {footer && (
        <div className="relative z-10 font-mono text-[9px] md:text-[10px] text-foreground/35 uppercase tracking-[0.15em]">
          {footer}
        </div>
      )}
    </motion.div>
  );
}

interface WrappedStatProps {
  value?: React.ReactNode;
  numericValue?: number;
  unit?: string;
  accent: string;
  size?: 'lg' | 'xl';
  active?: boolean;
}

export function WrappedStat({
  value,
  numericValue,
  unit,
  accent,
  size = 'xl',
  active = true,
}: WrappedStatProps) {
  const sizeClass = size === 'xl' ? 'text-[2.75rem] md:text-[3.25rem]' : 'text-[2rem] md:text-[2.5rem]';

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
          className="text-lg md:text-xl font-display font-semibold"
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
      className="rounded-xl p-4 backdrop-blur-sm border border-white/[0.08]"
      style={{ background: `${accent}14` }}
      initial={{ opacity: 0, y: 16 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
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
      className="font-mono text-[11px] md:text-xs text-foreground/55 leading-relaxed mt-4 max-w-[95%]"
      initial={{ opacity: 0 }}
      animate={active ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: 0.65, duration: 0.5 }}
    >
      {children}
    </motion.p>
  );
}
