'use client';

import { motion } from 'framer-motion';

interface MonthlyChartProps {
  data: Record<string, number>;
  accent: string;
  active?: boolean;
  compact?: boolean;
}

export function MonthlyChart({ data, accent, active = true, compact = false }: MonthlyChartProps) {
  const entries = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6);

  if (entries.length === 0) return null;

  const max = Math.max(...entries.map(([, v]) => v), 1);
  const monthLabel = (key: string) => {
    const [, m] = key.split('-');
    return ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'][Number(m) - 1] || m;
  };

  return (
    <div className={`flex items-end gap-1.5 mt-4 ${compact ? 'h-20' : 'h-28'}`}>
      {entries.map(([month, count], i) => {
        const barH = Math.max(8, Math.round((count / max) * 96));
        return (
          <div key={month} className="flex-1 flex flex-col items-center justify-end gap-1 h-full group">
            <motion.div
              className="w-full rounded-t-md relative overflow-hidden"
              style={{ background: `linear-gradient(to top, ${accent}88, ${accent})` }}
              initial={{ height: 0, opacity: 0.3 }}
              animate={active ? { height: barH, opacity: 1 } : { height: 0, opacity: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            </motion.div>
            <span className="font-mono text-[8px] text-foreground/40 group-hover:text-foreground/70 transition-colors">{monthLabel(month)}</span>
          </div>
        );
      })}
    </div>
  );
}

interface HourChartProps {
  data: Record<string, number>;
  accent: string;
  highlightHour?: number | null;
  active?: boolean;
  compact?: boolean;
}

export function HourChart({ data, accent, highlightHour, active = true, compact = false }: HourChartProps) {
  const hours = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    count: Number(data[h] ?? data[String(h)] ?? 0),
  }));
  const max = Math.max(...hours.map((h) => h.count), 1);

  return (
    <div className={`flex items-end gap-[2px] mt-3 ${compact ? 'h-16' : 'h-24'}`}>
      {hours.map(({ hour, count }, i) => {
        const isPeak = highlightHour === hour;
        const barH = Math.max(4, Math.round((count / max) * 88));
        return (
          <motion.div
            key={hour}
            className="flex-1 rounded-sm relative overflow-hidden"
            style={{
              background: isPeak ? `linear-gradient(to top, ${accent}88, ${accent})` : `${accent}55`,
              boxShadow: isPeak ? `0 0 16px ${accent}66, 0 0 4px ${accent}33` : undefined,
            }}
            initial={{ height: 0 }}
            animate={active ? { height: barH } : { height: 0 }}
            transition={{ delay: i * 0.025, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            title={`${hour}:00 — ${count}`}
          />
        );
      })}
    </div>
  );
}

interface RankedBarsProps {
  items: Array<{ label: string; value: number }>;
  accent: string;
  active?: boolean;
}

export function RankedBars({ items, accent, active = true }: RankedBarsProps) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-2.5 mt-3">
      {items.slice(0, 5).map((item, i) => (
        <div key={item.label} className="space-y-1 group">
          <div className="flex justify-between font-mono text-[10px]">
            <span className="text-foreground/70 truncate max-w-[70%] group-hover:text-foreground/90 transition-colors">{i + 1}. {item.label}</span>
            <span style={{ color: accent }}>{item.value}×</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full relative overflow-hidden"
              style={{ background: `linear-gradient(90deg, ${accent}88, ${accent})` }}
              initial={{ width: 0 }}
              animate={active ? { width: `${(item.value / max) * 100}%` } : { width: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface RingProgressProps {
  percent: number;
  accent: string;
  active?: boolean;
  size?: number;
}

export function RingProgress({ percent, accent, active = true, size = 88 }: RingProgressProps) {
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <defs>
        <filter id={`ring-glow-${size}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={accent}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={active ? { strokeDashoffset: circumference * (1 - clamped / 100) } : { strokeDashoffset: circumference }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        filter={`url(#ring-glow-${size})`}
      />
    </svg>
  );
}
