'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { SlideTheme } from '@/lib/slide-themes';

interface WrappedSlideProps {
  theme: SlideTheme;
  slideNum: number;
  label: string;
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  footer?: string;
  animateKey?: string | number;
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
}: WrappedSlideProps) {
  return (
    <motion.div
      key={animateKey}
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col justify-between h-full p-6 md:p-8 text-left relative overflow-hidden bg-gradient-to-br ${theme.gradient}`}
    >
      <div
        className="absolute -top-24 -right-16 w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: theme.accent }}
      />
      <div
        className="absolute -bottom-32 -left-20 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: theme.accent }}
      />
      <div className="wrapped-grain absolute inset-0 pointer-events-none z-[1]" />

      <div className="relative z-10 space-y-2">
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
      </div>

      <div className="relative z-10 my-auto py-3 md:py-5">
        {Icon && (
          <Icon className="h-9 w-9 md:h-10 md:w-10 mb-3 md:mb-4" style={{ color: theme.accent }} />
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
  value: React.ReactNode;
  unit?: string;
  accent: string;
  size?: 'lg' | 'xl';
}

export function WrappedStat({ value, unit, accent, size = 'xl' }: WrappedStatProps) {
  const sizeClass = size === 'xl' ? 'text-[2.75rem] md:text-[3.25rem]' : 'text-[2rem] md:text-[2.5rem]';

  return (
    <div className="space-y-2">
      <p className={`${sizeClass} font-display font-bold tracking-tight leading-[0.95] text-foreground stat-glow`}>
        {value}
      </p>
      {unit && (
        <p className="text-lg md:text-xl font-display font-semibold" style={{ color: accent }}>
          {unit}
        </p>
      )}
    </div>
  );
}

interface WrappedCardProps {
  accent: string;
  children: React.ReactNode;
}

export function WrappedCard({ accent, children }: WrappedCardProps) {
  return (
    <div
      className="rounded-lg p-4 backdrop-blur-sm border border-white/[0.08]"
      style={{ background: `${accent}12` }}
    >
      {children}
    </div>
  );
}

interface WrappedBodyProps {
  children: React.ReactNode;
}

export function WrappedBody({ children }: WrappedBodyProps) {
  return (
    <p className="font-mono text-[11px] md:text-xs text-foreground/55 leading-relaxed mt-4 max-w-[90%]">
      {children}
    </p>
  );
}
