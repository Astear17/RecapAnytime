import type { RecapStats } from '@recapanytime/shared';
import type { SlideTheme } from './theme-packs';

export type RecapTheme = 'tiktok' | 'spotify' | 'ytmusic';

export type AspectRatio = 'story' | 'feed' | 'wide';

export type SlideId =
  | 'intro'
  | 'profile'
  | 'period'
  | 'watch-count'
  | 'watch-time'
  | 'sessions'
  | 'active-time'
  | 'likes'
  | 'comments'
  | 'shares'
  | 'reposts'
  | 'searches'
  | 'live'
  | 'shop'
  | 'receipt-teaser'
  | 'persona'
  | 'final';

export interface SlideContext {
  stats: RecapStats;
  recapId: string;
  isDemo: boolean;
  active: boolean;
  slideNum: number;
  theme: SlideTheme;
  layout: AspectRatio;
  vinylEnabled: boolean;
  reducedMotion: boolean;
  onDeleteClick?: () => void;
}

export interface BuiltSlide {
  id: SlideId;
  label: string;
  slideNum: number;
  theme: SlideTheme;
  decor: 'default' | 'burst' | 'pulse';
  content: React.ReactNode;
}

export interface PreviewSlideMeta {
  id: SlideId;
  label: string;
  bigNumber: string;
  unit: string;
  sub: string;
  accent: string;
  gradient: string;
}

export const PREVIEW_SLIDE_IDS: SlideId[] = [
  'watch-count',
  'likes',
  'searches',
  'shop',
  'persona',
];
