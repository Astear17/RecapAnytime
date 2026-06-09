'use client';

import { useEffect, useState } from 'react';
import type { RecapTheme } from '@/lib/recap/types';

const KEYS = {
  music: 'recapanytime-music-enabled',
  theme: 'recapanytime-theme',
  confetti: 'recapanytime-confetti',
  vinyl: 'recapanytime-vinyl',
} as const;

function readBool(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  const saved = localStorage.getItem(key);
  return saved === null ? fallback : saved === 'true';
}

function readTheme(): RecapTheme {
  if (typeof window === 'undefined') return 'tiktok';
  const saved = localStorage.getItem(KEYS.theme) as RecapTheme | null;
  if (saved === 'spotify' || saved === 'ytmusic' || saved === 'tiktok') return saved;
  // migrate legacy vibe keys
  const legacy = localStorage.getItem('recapanytime-vibe');
  if (legacy === 'neon') return 'spotify';
  if (legacy === 'warm') return 'ytmusic';
  return 'tiktok';
}

export function useRecapPreferences() {
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [theme, setTheme] = useState<RecapTheme>('tiktok');
  const [confettiEnabled, setConfettiEnabled] = useState(true);
  const [vinylEnabled, setVinylEnabled] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMusicEnabled(readBool(KEYS.music, true));
    setTheme(readTheme());
    setConfettiEnabled(readBool(KEYS.confetti, true));
    setVinylEnabled(readBool(KEYS.vinyl, true));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEYS.music, String(musicEnabled));
    localStorage.setItem(KEYS.theme, theme);
    localStorage.setItem(KEYS.confetti, String(confettiEnabled));
    localStorage.setItem(KEYS.vinyl, String(vinylEnabled));
  }, [hydrated, musicEnabled, theme, confettiEnabled, vinylEnabled]);

  return {
    hydrated,
    musicEnabled,
    setMusicEnabled,
    theme,
    setTheme,
    confettiEnabled,
    setConfettiEnabled,
    vinylEnabled,
    setVinylEnabled,
  };
}
