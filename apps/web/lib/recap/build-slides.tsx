'use client';

import type { RecapStats } from '@recapanytime/shared';
import { getSlideTheme } from './theme-packs';
import { SLIDE_REGISTRY } from './slide-registry';
import type { AspectRatio, BuiltSlide, PreviewSlideMeta, RecapTheme, SlideId } from './types';
import { PREVIEW_SLIDE_IDS } from './types';

export interface BuildSlidesOptions {
  stats: RecapStats;
  recapId: string;
  isDemo: boolean;
  theme: RecapTheme;
  layout: AspectRatio;
  vinylEnabled: boolean;
  reducedMotion: boolean;
  activeSlideIndex: number;
  onDeleteClick?: () => void;
}

export function getEligibleSlideCount(stats: RecapStats): number {
  return SLIDE_REGISTRY.filter((def) => def.when(stats)).length;
}

export function buildSlides(options: BuildSlidesOptions): BuiltSlide[] {
  const { stats, theme, activeSlideIndex } = options;
  const eligible = SLIDE_REGISTRY.filter((def) => def.when(stats));

  return eligible.map((def, index) => {
    const slideTheme = getSlideTheme(theme, def.id);
    const active = index === activeSlideIndex;
    const ctx = {
      stats,
      recapId: options.recapId,
      isDemo: options.isDemo,
      active,
      slideNum: index + 1,
      theme: slideTheme,
      layout: options.layout,
      vinylEnabled: options.vinylEnabled,
      reducedMotion: options.reducedMotion,
      onDeleteClick: options.onDeleteClick,
    };

    return {
      id: def.id,
      label: def.label,
      slideNum: index + 1,
      theme: slideTheme,
      decor: def.decor ?? 'default',
      content: def.build(ctx),
    };
  });
}

export function getPreviewMetadata(stats: RecapStats, theme: RecapTheme): PreviewSlideMeta[] {
  const watchHours = Math.floor(stats.watch.estimatedWatchSeconds / 3600);

  const metaById: Partial<Record<SlideId, Omit<PreviewSlideMeta, 'id'>>> = {
    'watch-count': {
      label: 'WATCH STATS',
      bigNumber: stats.watch.totalVideos.toLocaleString(),
      unit: 'video đã xem',
      sub: `Thời gian lướt ước tính: ${watchHours} giờ`,
      accent: getSlideTheme(theme, 'watch-count').accent,
      gradient: getSlideTheme(theme, 'watch-count').gradient,
    },
    likes: {
      label: 'ENGAGEMENT',
      bigNumber: stats.engagement.totalLikes.toLocaleString(),
      unit: 'lần thả tim',
      sub: `Bạn thả tim nhiều nhất vào ${stats.engagement.mostActiveLikeDay || 'các ngày'}`,
      accent: getSlideTheme(theme, 'likes').accent,
      gradient: getSlideTheme(theme, 'likes').gradient,
    },
    searches: {
      label: 'SEARCH LOG',
      bigNumber: stats.searches.totalSearches.toLocaleString(),
      unit: 'lần tìm kiếm',
      sub: stats.searches.topSearches.length > 0
        ? `Top: "${stats.searches.topSearches[0].term}"${stats.searches.topSearches[1] ? `, "${stats.searches.topSearches[1].term}"` : ''}`
        : 'Khám phá xu hướng tìm kiếm của bạn',
      accent: getSlideTheme(theme, 'searches').accent,
      gradient: getSlideTheme(theme, 'searches').gradient,
    },
    shop: {
      label: 'TIKTOK SHOP',
      bigNumber: stats.spending.totalSpendVnd != null ? `${(stats.spending.totalSpendVnd / 1_000_000).toFixed(1)}M` : '0',
      unit: 'VND đã chi',
      sub: `${stats.spending.orderCount} đơn hàng, ${stats.spending.completedOrderCount} hoàn thành`,
      accent: getSlideTheme(theme, 'shop').accent,
      gradient: getSlideTheme(theme, 'shop').gradient,
    },
    persona: {
      label: 'PERSONA',
      bigNumber: stats.persona.title.split(' ')[0] || stats.persona.title,
      unit: stats.persona.title.split(' ').slice(1).join(' ') || 'Scroller',
      sub: `${stats.persona.subtitle} — Độ ${stats.persona.score}/10`,
      accent: getSlideTheme(theme, 'persona').accent,
      gradient: getSlideTheme(theme, 'persona').gradient,
    },
  };

  return PREVIEW_SLIDE_IDS
    .filter((id) => {
      const def = SLIDE_REGISTRY.find((d) => d.id === id);
      return def?.when(stats) ?? false;
    })
    .map((id) => {
      const meta = metaById[id]!;
      return { id, ...meta };
    });
}
