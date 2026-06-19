'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Smartphone,
  Maximize2,
} from 'lucide-react';
import type { RecapStats } from '@recapanytime/shared';
import { buildSlides, getEligibleSlideCount } from '@/lib/recap/build-slides';
import { getThemePack } from '@/lib/recap/theme-packs';
import type { AspectRatio, RecapTheme } from '@/lib/recap/types';
import { useRecapDeck } from '@/hooks/useRecapDeck';
import { ConfettiCanvas } from './ConfettiCanvas';
import { RecapControls, RecapSettingsButton } from './RecapControls';
import { RecapSoundtrack } from './RecapSoundtrack';

interface RecapDeckProps {
  stats: RecapStats;
  recapId: string;
  isDemo: boolean;
  theme: RecapTheme;
  onThemeChange: (t: RecapTheme) => void;
  musicEnabled: boolean;
  onMusicChange: (v: boolean) => void;
  confettiEnabled: boolean;
  onConfettiChange: (v: boolean) => void;
  vinylEnabled: boolean;
  onVinylChange: (v: boolean) => void;
  reducedMotion: boolean;
  onAudioUnlock: () => void;
  onDeleteClick?: () => void;
  onSlideChange?: (index: number) => void;
}

function getAspectClass(aspect: AspectRatio): string {
  switch (aspect) {
    case 'story':
      return 'aspect-[9/16] w-full max-w-[375px]';
    case 'feed':
      return 'aspect-[3/4] w-full max-w-[420px]';
    case 'wide':
      return 'aspect-[16/9] w-full max-w-[680px]';
  }
}

export function RecapDeck({
  stats,
  recapId,
  isDemo,
  theme,
  onThemeChange,
  musicEnabled,
  onMusicChange,
  confettiEnabled,
  onConfettiChange,
  vinylEnabled,
  onVinylChange,
  reducedMotion,
  onAudioUnlock,
  onDeleteClick,
  onSlideChange,
}: RecapDeckProps) {
  const [aspect, setAspect] = useState<AspectRatio>('story');
  const [showPrefs, setShowPrefs] = useState(false);
  const pack = getThemePack(theme);

  const slideCount = useMemo(() => getEligibleSlideCount(stats), [stats]);

  const deck = useRecapDeck({
    slideCount,
    reducedMotion,
  });

  const slides = useMemo(
    () =>
      buildSlides({
        stats,
        recapId,
        isDemo,
        theme,
        layout: aspect,
        vinylEnabled,
        reducedMotion,
        activeSlideIndex: deck.slide,
        onDeleteClick,
      }),
    [stats, recapId, isDemo, theme, aspect, vinylEnabled, reducedMotion, deck.slide, onDeleteClick],
  );

  const current = slides[deck.slide];

  useEffect(() => {
    onSlideChange?.(deck.slide);
  }, [deck.slide, onSlideChange]);
  const showConfetti =
    confettiEnabled &&
    !reducedMotion &&
    (current?.id === 'persona' || current?.id === 'final');

  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPressRef = useRef(false);

  const handleDeckTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (didLongPressRef.current) {
      didLongPressRef.current = false;
      return;
    }
    onAudioUnlock();
    const rect = e.currentTarget.getBoundingClientRect();
    deck.handleTap(e.clientX - rect.left, rect.width);
  };

  const handlePointerDown = () => {
    didLongPressRef.current = false;
    longPressRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      deck.setIsPaused(true);
    }, 500);
  };

  const handlePointerUp = () => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 hero-mesh">
      <div className="w-full max-w-xl flex items-center justify-between mb-5 font-mono text-xs text-muted no-print">
        <Link href="/" className="flex items-center gap-2 hover:text-foreground transition-colors">
          <span className="font-display font-bold text-sm text-foreground">RecapAnytime</span>
        </Link>

        <div className="flex gap-1 bg-surface/80 border border-white/[0.06] p-1 rounded-full backdrop-blur-sm">
          {(['story', 'feed', 'wide'] as AspectRatio[]).map((a) => (
            <button
              key={a}
              onClick={() => setAspect(a)}
              className={`p-2 rounded-full transition-colors ${aspect === a ? 'bg-white/10 text-foreground' : 'text-muted hover:text-foreground'}`}
              title={a}
            >
              {a === 'wide' ? <Maximize2 className="h-3.5 w-3.5" /> : <Smartphone className={`h-3.5 w-3.5 ${a === 'feed' ? 'rotate-90' : ''}`} />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <RecapSettingsButton onClick={() => setShowPrefs(true)} />
          <button onClick={deck.togglePause} className="p-2 rounded-full hover:bg-white/5 transition-colors">
            {deck.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center w-full">
        <button
          onClick={() => { onAudioUnlock(); deck.goPrev(); }}
          className="absolute -left-10 lg:-left-16 p-2 text-muted hover:text-foreground hidden md:block transition-colors"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <div
          className={`relative rounded-2xl overflow-hidden shadow-wrapped transition-all duration-300 ${getAspectClass(aspect)}`}
          style={{ boxShadow: `0 24px 80px -16px rgba(0,0,0,0.75), 0 0 60px ${pack.glowColor}22` }}
        >
          <ConfettiCanvas active={showConfetti} burst={current?.id === 'final'} />

          {pack.progressStyle === 'continuous' ? (
            <div className="absolute top-3 left-3 right-3 h-[3px] rounded-full overflow-hidden bg-white/10 z-20">
              <div
                className="h-full rounded-full transition-all duration-100 ease-linear relative overflow-hidden"
                style={{
                  width: `${((deck.slide + deck.progress / 100) / slides.length) * 100}%`,
                  background: `linear-gradient(90deg, ${pack.glowColor}88, ${pack.glowColor})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
              </div>
            </div>
          ) : (
            <div className="absolute top-3 left-0 right-0 flex px-3 gap-1 z-20">
              {slides.map((s, idx) => (
                <div key={s.id} className="h-[3px] flex-1 rounded-full overflow-hidden bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-100 ease-linear relative overflow-hidden"
                    style={{
                      width: idx === deck.slide ? `${deck.progress}%` : idx < deck.slide ? '100%' : '0%',
                      background: `linear-gradient(90deg, ${s.theme.progressColor}88, ${s.theme.progressColor})`,
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          <div
            className="w-full h-full relative cursor-pointer"
            onClick={handleDeckTap}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <AnimatePresence mode="wait">
              {current && (
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={reducedMotion ? false : { opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, x: -30 }}
                  transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {current.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={() => { onAudioUnlock(); deck.goNext(); }}
          className="absolute -right-10 lg:-right-16 p-2 text-muted hover:text-foreground hidden md:block transition-colors"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      <div className="mt-5 font-mono text-[10px] text-muted/60 tracking-wider">
        {deck.slide + 1} / {slides.length}
      </div>

      <RecapSoundtrack
        enabled={musicEnabled}
        onToggleEnabled={onMusicChange}
        theme={theme}
        onUnlock={onAudioUnlock}
      />

      <RecapControls
        open={showPrefs}
        onClose={() => setShowPrefs(false)}
        theme={theme}
        onThemeChange={onThemeChange}
        confettiEnabled={confettiEnabled}
        onConfettiChange={onConfettiChange}
        vinylEnabled={vinylEnabled}
        onVinylChange={onVinylChange}
      />
    </div>
  );
}
