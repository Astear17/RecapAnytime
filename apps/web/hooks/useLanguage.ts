'use client';

import { useState, useEffect, useCallback } from 'react';

export type Lang = 'vi' | 'en';

const STORAGE_KEY = 'recap-lang';

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'vi';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'vi') return stored;
  return navigator.language.startsWith('vi') ? 'vi' : 'en';
}

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>('vi');

  useEffect(() => {
    setLangState(getInitialLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === 'vi' ? 'en' : 'vi');
  }, [lang, setLang]);

  return { lang, setLang, toggle };
}

export function t(vi: string, en: string, lang: Lang): string {
  return lang === 'vi' ? vi : en;
}
