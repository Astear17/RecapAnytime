'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { RecapTheme } from '@/lib/recap/types';

const THEME_FREQ: Record<RecapTheme, { pad: number; stinger: number }> = {
  tiktok: { pad: 220, stinger: 440 },
  spotify: { pad: 196, stinger: 392 },
  ytmusic: { pad: 261, stinger: 523 },
};

export function useRecapAudio(
  theme: RecapTheme,
  enabled: boolean,
  slideIndex: number,
  unlocked: boolean,
) {
  const ctxRef = useRef<AudioContext | null>(null);
  const padRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);
  const lastSlideRef = useRef(-1);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const stopPad = useCallback(() => {
    if (padRef.current) {
      try {
        padRef.current.gain.gain.exponentialRampToValueAtTime(0.001, getCtx().currentTime + 0.3);
        padRef.current.osc.stop(getCtx().currentTime + 0.35);
      } catch {
        // oscillator may already be stopped
      }
      padRef.current = null;
    }
  }, [getCtx]);

  const playStinger = useCallback(() => {
    if (!enabled || !unlocked) return;
    const ctx = getCtx();
    const { stinger } = THEME_FREQ[theme];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = stinger;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.4);
  }, [enabled, unlocked, theme, getCtx]);

  const startPad = useCallback(() => {
    if (!enabled || !unlocked) return;
    stopPad();
    const ctx = getCtx();
    if (ctx.state === 'suspended') void ctx.resume();
    const { pad } = THEME_FREQ[theme];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = pad;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.025, now + 0.8);
    osc.start(now);
    padRef.current = { osc, gain };
  }, [enabled, unlocked, theme, getCtx, stopPad]);

  useEffect(() => {
    if (unlocked && ctxRef.current?.state === 'suspended') {
      void ctxRef.current.resume();
    }
  }, [unlocked]);

  useEffect(() => {
    if (!enabled || !unlocked) {
      stopPad();
      return;
    }
    startPad();
    return stopPad;
  }, [enabled, unlocked, theme, startPad, stopPad]);

  useEffect(() => {
    if (slideIndex === lastSlideRef.current) return;
    if (lastSlideRef.current >= 0) playStinger();
    lastSlideRef.current = slideIndex;
  }, [slideIndex, playStinger]);

  useEffect(() => () => {
    stopPad();
    if (ctxRef.current && ctxRef.current.state !== 'closed') {
      ctxRef.current.close().catch(() => {});
    }
  }, [stopPad]);

  const unlock = useCallback(async () => {
    const ctx = getCtx();
    if (ctx.state === 'suspended') await ctx.resume();
  }, [getCtx]);

  return { unlock };
}
