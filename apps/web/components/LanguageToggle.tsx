'use client';

import type { Lang } from '@/hooks/useLanguage';

interface LanguageToggleProps {
  lang: Lang;
  onToggle: () => void;
}

export function LanguageToggle({ lang, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-muted hover:text-foreground"
      title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
    >
      {lang === 'vi' ? 'VI' : 'EN'}
    </button>
  );
}
