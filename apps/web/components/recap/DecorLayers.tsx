'use client';

import { motion } from 'framer-motion';

interface DecorLayersProps {
  accent: string;
  variant?: 'default' | 'burst' | 'pulse';
  active?: boolean;
}

export function DecorLayers({ accent, variant = 'default', active = true }: DecorLayersProps) {
  if (!active) return null;

  return (
    <>
      {variant === 'burst' && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full pointer-events-none"
              style={{ background: accent, left: '50%', top: '45%' }}
              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0.5],
                opacity: [1, 0.8, 0],
                x: Math.cos((i / 8) * Math.PI * 2) * 120,
                y: Math.sin((i / 8) * Math.PI * 2) * 120,
              }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.05, ease: 'easeOut' }}
            />
          ))}
        </>
      )}

      <motion.div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none opacity-20"
        style={{ background: `radial-gradient(circle, ${accent} 0%, ${accent}44 40%, transparent 70%)` }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 -left-8 w-24 h-24 rounded-full border pointer-events-none opacity-30"
        style={{ borderColor: `${accent}66` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {variant === 'pulse' && (
        <motion.div
          className="absolute top-1/3 right-6 w-16 h-16 rounded-full pointer-events-none"
          style={{ border: `2px solid ${accent}44` }}
          animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
    </>
  );
}

interface EmojiFloatProps {
  emojis: string[];
  active?: boolean;
}

export function EmojiFloat({ emojis, active = true }: EmojiFloatProps) {
  if (!active || emojis.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {emojis.slice(0, 6).map((emoji, i) => (
        <motion.span
          key={`${emoji}-${i}`}
          className="absolute text-2xl"
          style={{
            left: `${12 + (i * 14) % 70}%`,
            top: `${20 + (i * 17) % 50}%`,
          }}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0.6], scale: [0, 1.2, 1, 1], y: [20, 0, -8, 0] }}
          transition={{ delay: 0.4 + i * 0.15, duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

interface ProfileRingProps {
  photoUrl: string | null;
  accent: string;
  active?: boolean;
  displayName?: string;
}

export function ProfileRing({ photoUrl, accent, active = true, displayName }: ProfileRingProps) {
  const initial = displayName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="relative w-24 h-24 mb-4">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `2px solid ${accent}` }}
        animate={active ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-1 rounded-full overflow-hidden bg-white/10 flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="font-display text-3xl font-bold" style={{ color: accent }}>
            {initial}
          </span>
        )}
      </motion.div>
    </div>
  );
}
