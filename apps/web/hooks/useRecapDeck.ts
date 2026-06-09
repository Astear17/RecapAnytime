'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_DURATION_MS = 6000;

export interface UseRecapDeckOptions {
  slideCount: number;
  durationMs?: number;
  reducedMotion?: boolean;
}

export function useRecapDeck({
  slideCount,
  durationMs = DEFAULT_DURATION_MS,
  reducedMotion = false,
}: UseRecapDeckOptions) {
  const [slide, setSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number | null>(null);
  const slideRef = useRef(0);

  const resetProgress = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    lastTsRef.current = null;
  }, []);

  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);

  useEffect(() => {
    if (slideCount > 0 && slide >= slideCount) {
      setSlide(0);
      resetProgress();
    }
  }, [slideCount, slide, resetProgress]);

  const goNext = useCallback(() => {
    if (slideCount <= 0) return;
    setSlide((prev) => (prev < slideCount - 1 ? prev + 1 : 0));
    resetProgress();
  }, [slideCount, resetProgress]);

  const goPrev = useCallback(() => {
    if (slideCount <= 0) return;
    setSlide((prev) => (prev > 0 ? prev - 1 : slideCount - 1));
    resetProgress();
  }, [slideCount, resetProgress]);

  const togglePause = useCallback(() => {
    setIsPaused((p) => !p);
    lastTsRef.current = null;
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    lastTsRef.current = null;
  }, []);

  // rAF-based autoplay — single advance path, no nested setState
  useEffect(() => {
    if (slideCount <= 0 || isPaused || reducedMotion) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = (ts: number) => {
      if (lastTsRef.current === null) {
        lastTsRef.current = ts;
      }
      const delta = ts - lastTsRef.current;
      lastTsRef.current = ts;

      progressRef.current += (delta / durationMs) * 100;

      if (progressRef.current >= 100) {
        progressRef.current = 0;
        setProgress(0);
        setSlide((prev) => (prev < slideCount - 1 ? prev + 1 : 0));
        lastTsRef.current = null;
      } else {
        setProgress(progressRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [slideCount, isPaused, reducedMotion, durationMs, slide]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, togglePause]);

  const handleTap = useCallback(
    (clickX: number, width: number) => {
      pause();
      if (clickX > width * 0.4) goNext();
      else goPrev();
    },
    [goNext, goPrev, pause],
  );

  return {
    slide,
    progress,
    isPaused,
    setIsPaused,
    goNext,
    goPrev,
    togglePause,
    pause,
    handleTap,
    resetProgress,
  };
}
