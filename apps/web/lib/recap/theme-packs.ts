import type { RecapTheme, SlideId } from './types';

export interface SlideTheme {
  id: string;
  gradient: string;
  accent: string;
  progressColor: string;
}

export interface ThemePack {
  id: RecapTheme;
  label: string;
  glowColor: string;
  progressStyle: 'segmented' | 'continuous';
  decor: 'vinyl' | 'waveform' | 'burst';
  slides: Record<SlideId, SlideTheme>;
}

const TIKTOK_SLIDES: Record<SlideId, SlideTheme> = {
  intro: { id: 'intro', gradient: 'from-[#1a0a2e] via-[#16213e] to-[#0a0a0a]', accent: '#25f4ee', progressColor: '#25f4ee' },
  profile: { id: 'profile', gradient: 'from-[#2d0a1a] via-[#1a0a1e] to-[#0a0a0a]', accent: '#ff3b5c', progressColor: '#ff3b5c' },
  period: { id: 'period', gradient: 'from-[#0a1a2e] via-[#0a1628] to-[#0a0a0a]', accent: '#60a5fa', progressColor: '#60a5fa' },
  'watch-count': { id: 'watch-count', gradient: 'from-[#1a0a2e] via-[#16213e] to-[#0a0a0a]', accent: '#a78bfa', progressColor: '#a78bfa' },
  'watch-time': { id: 'watch-time', gradient: 'from-[#0a1a2e] via-[#0a2838] to-[#0a0a0a]', accent: '#25f4ee', progressColor: '#25f4ee' },
  sessions: { id: 'sessions', gradient: 'from-[#0a1a0a] via-[#0a2e16] to-[#0a0a0a]', accent: '#1db954', progressColor: '#1db954' },
  'active-time': { id: 'active-time', gradient: 'from-[#2e1a0a] via-[#1e160a] to-[#0a0a0a]', accent: '#fb923c', progressColor: '#fb923c' },
  likes: { id: 'likes', gradient: 'from-[#2d0a0a] via-[#1a0a1e] to-[#0a0a0a]', accent: '#ff3b5c', progressColor: '#ff3b5c' },
  comments: { id: 'comments', gradient: 'from-[#2e1a0a] via-[#281a0a] to-[#0a0a0a]', accent: '#fbbf24', progressColor: '#fbbf24' },
  shares: { id: 'shares', gradient: 'from-[#0a1a0a] via-[#0a2e16] to-[#0a0a0a]', accent: '#1db954', progressColor: '#1db954' },
  reposts: { id: 'reposts', gradient: 'from-[#1a1a0a] via-[#1e1e0a] to-[#0a0a0a]', accent: '#facc15', progressColor: '#facc15' },
  searches: { id: 'searches', gradient: 'from-[#0a1a0a] via-[#0a2e16] to-[#0a0a0a]', accent: '#1db954', progressColor: '#1db954' },
  live: { id: 'live', gradient: 'from-[#2d0a2e] via-[#1a0a2e] to-[#0a0a0a]', accent: '#e879f9', progressColor: '#e879f9' },
  shop: { id: 'shop', gradient: 'from-[#2e1a0a] via-[#1e160a] to-[#0a0a0a]', accent: '#fb923c', progressColor: '#fb923c' },
  'receipt-teaser': { id: 'receipt-teaser', gradient: 'from-[#0a1a2e] via-[#0a2838] to-[#0a0a0a]', accent: '#25f4ee', progressColor: '#25f4ee' },
  persona: { id: 'persona', gradient: 'from-[#0a0a2e] via-[#160a2e] to-[#0a0a0a]', accent: '#a855f7', progressColor: '#a855f7' },
  final: { id: 'final', gradient: 'from-[#1a0a2e] via-[#2d0a1a] to-[#0a0a0a]', accent: '#ff3b5c', progressColor: '#ff3b5c' },
};

function withAccents(base: Record<SlideId, SlideTheme>, accent: string, progressColor?: string): Record<SlideId, SlideTheme> {
  const color = progressColor ?? accent;
  return Object.fromEntries(
    Object.entries(base).map(([key, theme]) => [
      key,
      { ...theme, accent, progressColor: key === 'intro' || key === 'persona' || key === 'final' ? theme.progressColor : color },
    ]),
  ) as Record<SlideId, SlideTheme>;
}

export const THEME_PACKS: Record<RecapTheme, ThemePack> = {
  tiktok: {
    id: 'tiktok',
    label: 'TikTok',
    glowColor: '#ff3b5c',
    progressStyle: 'segmented',
    decor: 'burst',
    slides: TIKTOK_SLIDES,
  },
  spotify: {
    id: 'spotify',
    label: 'Spotify',
    glowColor: '#1db954',
    progressStyle: 'segmented',
    decor: 'vinyl',
    slides: {
      ...TIKTOK_SLIDES,
      intro: { id: 'intro', gradient: 'from-[#0a1f0f] via-[#0d2818] to-[#050505]', accent: '#1db954', progressColor: '#1db954' },
      profile: { id: 'profile', gradient: 'from-[#0a1a0f] via-[#0f2218] to-[#050505]', accent: '#1ed760', progressColor: '#1ed760' },
      'watch-count': { id: 'watch-count', gradient: 'from-[#0a1f12] via-[#122a18] to-[#050505]', accent: '#1db954', progressColor: '#1db954' },
      'watch-time': { id: 'watch-time', gradient: 'from-[#081a10] via-[#0f2518] to-[#050505]', accent: '#1ed760', progressColor: '#1ed760' },
      likes: { id: 'likes', gradient: 'from-[#0a1f0f] via-[#142818] to-[#050505]', accent: '#1db954', progressColor: '#1db954' },
      persona: { id: 'persona', gradient: 'from-[#0a1a0a] via-[#102218] to-[#050505]', accent: '#1ed760', progressColor: '#1ed760' },
      final: { id: 'final', gradient: 'from-[#0a1f0f] via-[#0d2818] to-[#050505]', accent: '#1db954', progressColor: '#1db954' },
    },
  },
  ytmusic: {
    id: 'ytmusic',
    label: 'YT Music',
    glowColor: '#ff0000',
    progressStyle: 'continuous',
    decor: 'waveform',
    slides: {
      ...withAccents(TIKTOK_SLIDES, '#ff4444', '#ff0000'),
      intro: { id: 'intro', gradient: 'from-[#2a0a1a] via-[#1a0a28] to-[#0a0a0a]', accent: '#ff0000', progressColor: '#ff0000' },
      profile: { id: 'profile', gradient: 'from-[#2d0a1a] via-[#220a2e] to-[#0a0a0a]', accent: '#ff4444', progressColor: '#ff4444' },
      'watch-count': { id: 'watch-count', gradient: 'from-[#1a0a2e] via-[#280a28] to-[#0a0a0a]', accent: '#a855f7', progressColor: '#a855f7' },
      persona: { id: 'persona', gradient: 'from-[#2a0a28] via-[#1a0a2e] to-[#0a0a0a]', accent: '#ff0000', progressColor: '#ff0000' },
      final: { id: 'final', gradient: 'from-[#2d0a1a] via-[#1a0a2e] to-[#0a0a0a]', accent: '#ff4444', progressColor: '#ff4444' },
    },
  },
};

export function getThemePack(theme: RecapTheme): ThemePack {
  return THEME_PACKS[theme] ?? THEME_PACKS.tiktok;
}

export function getSlideTheme(theme: RecapTheme, slideId: SlideId): SlideTheme {
  return getThemePack(theme).slides[slideId];
}

/** @deprecated Use getThemePack('tiktok').slides — kept for gradual migration */
export const SLIDE_THEMES: SlideTheme[] = Object.values(TIKTOK_SLIDES);
