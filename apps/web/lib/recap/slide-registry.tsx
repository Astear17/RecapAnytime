'use client';

import Link from 'next/link';
import {
  Sparkles,
  User,
  Calendar,
  Eye,
  Clock,
  Activity,
  Sun,
  Heart,
  MessageCircle,
  Share2,
  Repeat2,
  Search,
  Radio,
  ShoppingBag,
  Receipt,
  PartyPopper,
  Printer,
  Trash2,
} from 'lucide-react';
import type { RecapStats } from '@recapanytime/shared';
import { WrappedSlide, WrappedStat, WrappedCard, WrappedBody } from '@/components/recap/WrappedSlide';
import { MonthlyChart, HourChart, RankedBars, RingProgress } from '@/components/recap/charts';
import { ProfileRing, EmojiFloat } from '@/components/recap/DecorLayers';
import { VinylDisc } from '@/components/recap/VinylDisc';
import type { SlideContext, SlideId } from './types';

export interface SlideDefinition {
  id: SlideId;
  label: string;
  title?: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  decor?: 'default' | 'burst' | 'pulse';
  when: (stats: RecapStats) => boolean;
  build: (ctx: SlideContext) => React.ReactNode;
}

function layoutClass(layout: SlideContext['layout']): string {
  if (layout === 'wide') return 'recap-layout-wide';
  if (layout === 'feed') return 'recap-layout-feed';
  return 'recap-layout-story';
}

export const SLIDE_REGISTRY: SlideDefinition[] = [
  {
    id: 'intro',
    label: 'YOUR RECAP',
    icon: Sparkles,
    decor: 'burst',
    when: () => true,
    build: (ctx) => {
      const { theme, stats, active, vinylEnabled, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="YOUR RECAP" icon={Sparkles} active={active} decor="burst" layout={layout}>
          {vinylEnabled && !ctx.reducedMotion && (
            <VinylDisc accent={theme.accent} label="RECAP" active={active} size={layout === 'wide' ? 56 : 72} className="absolute top-16 right-4 opacity-80 z-10 recap-vinyl-decor" />
          )}
          <WrappedStat value="TikTok" unit="Recap 2026" accent={theme.accent} active={active} layout={layout} />
          <WrappedBody active={active}>
            Phân tích cho <span className="text-foreground font-semibold">@{stats.profile.username || 'guest'}</span>.
            Vuốt để khám phá thói quen lướt dạo của bạn.
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'profile',
    label: 'PROFILE',
    title: 'Tài khoản của bạn',
    icon: User,
    decor: 'pulse',
    when: () => true,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="PROFILE" title="Tài khoản của bạn" icon={User} active={active} decor="pulse" layout={layout}>
          <div className={layoutClass(layout)}>
            <ProfileRing photoUrl={stats.profile.profilePhoto} accent={theme.accent} active={active} displayName={stats.profile.displayName || stats.profile.username || 'U'} />
            <div>
              <WrappedStat value={stats.profile.displayName || 'Guest'} accent={theme.accent} size="lg" active={active} layout={layout} />
              <WrappedCard accent={theme.accent} active={active}>
                <p className="font-mono text-xs space-y-2">
                  <span className="block"><span className="text-foreground/50">@</span>{stats.profile.username || 'guest'}</span>
                  <span className="block text-foreground/70">{stats.profile.followerCount || 0} followers · {stats.profile.followingCount || 0} following</span>
                  <span className="block text-foreground/50">{stats.profile.region || 'VN'}</span>
                </p>
              </WrappedCard>
            </div>
          </div>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'period',
    label: 'TIMELINE',
    title: 'Khoảng thời gian',
    icon: Calendar,
    when: (s) => !!(s.watch.firstWatchAt || s.watch.lastWatchAt),
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="TIMELINE" title="Khoảng thời gian" icon={Calendar} active={active} layout={layout}>
          <div className="space-y-2">
            <p className="font-display text-2xl font-bold" style={{ color: theme.accent }}>
              {stats.watch.firstWatchAt ? stats.watch.firstWatchAt.substring(0, 10) : '—'}
            </p>
            <div className="flex items-center gap-2 py-1">
              <div className="h-px flex-1 bg-white/15" />
              <span className="font-mono text-[10px] text-foreground/40">→</span>
              <div className="h-px flex-1 bg-white/15" />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">
              {stats.watch.lastWatchAt ? stats.watch.lastWatchAt.substring(0, 10) : '—'}
            </p>
          </div>
          <WrappedBody active={active}>
            Streak dài nhất: <span className="text-foreground font-semibold">{stats.watch.longestStreakDays} ngày</span> liên tục.
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'watch-count',
    label: 'WATCH STATS',
    title: 'Video đã xem',
    icon: Eye,
    when: (s) => s.watch.totalVideos > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="WATCH STATS" title="Video đã xem" icon={Eye} active={active} layout={layout}>
          <div className={layoutClass(layout)}>
            <WrappedStat numericValue={stats.watch.totalVideos} unit="videos" accent={theme.accent} active={active} layout={layout} />
            <MonthlyChart data={stats.watch.videosPerMonth} accent={theme.accent} active={active} compact={layout === 'wide'} />
          </div>
          <WrappedBody active={active}>Xu hướng lướt theo tháng — peak season của bạn.</WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'watch-time',
    label: 'SCREEN TIME',
    title: 'Thời gian lướt',
    icon: Clock,
    decor: 'pulse',
    when: (s) => s.watch.estimatedWatchSeconds > 0,
    build: (ctx) => {
      const { theme, stats, active, vinylEnabled, layout } = ctx;
      const watchHours = Math.floor(stats.watch.estimatedWatchSeconds / 3600);
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="SCREEN TIME" title="Thời gian lướt" icon={Clock} active={active} decor="pulse" layout={layout}>
          <div className={`flex items-center gap-3 ${layout === 'wide' ? 'flex-row' : ''}`}>
            {vinylEnabled && !ctx.reducedMotion && <VinylDisc accent={theme.accent} label={`${watchHours}h`} active={active} size={layout === 'wide' ? 64 : 80} className="recap-vinyl-decor" />}
            <div className="flex items-center gap-3 flex-1">
              <RingProgress percent={Math.min(100, (watchHours / 1000) * 100)} accent={theme.accent} active={active} size={layout === 'wide' ? 60 : 72} />
              <WrappedStat numericValue={watchHours} unit="giờ xem" accent={theme.accent} size="lg" active={active} layout={layout} />
            </div>
          </div>
          <WrappedBody active={active}>
            ≈ <span className="text-foreground font-semibold">{Math.floor(stats.watch.estimatedWatchSeconds / 86400)} ngày</span> không ngừng nghỉ.
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'sessions',
    label: 'SESSIONS',
    title: 'Phiên lướt',
    icon: Activity,
    when: (s) => s.watch.sessionCount > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="SESSIONS" title="Phiên lướt" icon={Activity} active={active} layout={layout}>
          <WrappedStat numericValue={stats.watch.sessionCount} unit="phiên lướt" accent={theme.accent} size="lg" active={active} layout={layout} />
          <WrappedCard accent={theme.accent} active={active}>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <p className="text-foreground/50 mb-1">Dài nhất</p>
                <p className="font-display text-lg font-bold text-foreground">{Math.floor(stats.watch.longestSessionSeconds / 60)} phút</p>
              </div>
              <div>
                <p className="text-foreground/50 mb-1">Trung bình</p>
                <p className="font-display text-lg font-bold" style={{ color: theme.accent }}>{Math.floor(stats.watch.averageSessionSeconds / 60)} phút</p>
              </div>
            </div>
          </WrappedCard>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'active-time',
    label: 'PEAK HOURS',
    title: 'Giờ vàng',
    icon: Sun,
    when: (s) => s.watch.mostActiveHour !== null || Object.keys(s.watch.hourlyDistribution).length > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="PEAK HOURS" title="Giờ vàng" icon={Sun} active={active} layout={layout}>
          <p className="font-display text-2xl font-bold mb-1" style={{ color: theme.accent }}>
            {stats.watch.mostActiveWeekday || '—'}
          </p>
          <p className="font-mono text-[10px] text-foreground/45 mb-2">
            Peak: {stats.watch.mostActiveHour !== null ? `${stats.watch.mostActiveHour}:00` : '—'}
          </p>
          <HourChart data={stats.watch.hourlyDistribution} accent={theme.accent} highlightHour={stats.watch.mostActiveHour} active={active} compact={layout === 'wide'} />
        </WrappedSlide>
      );
    },
  },
  {
    id: 'likes',
    label: 'ENGAGEMENT',
    title: 'Lượt thích',
    icon: Heart,
    decor: 'pulse',
    when: (s) => s.engagement.totalLikes > 0,
    build: (ctx) => {
      const { theme, stats, active, vinylEnabled, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="ENGAGEMENT" title="Lượt thích" icon={Heart} active={active} decor="pulse" layout={layout}>
          {vinylEnabled && active && !ctx.reducedMotion && (
            <VinylDisc accent={theme.accent} label="♥" active className="absolute bottom-20 right-4 opacity-70 z-0 recap-vinyl-decor" size={64} />
          )}
          <WrappedStat numericValue={stats.engagement.totalLikes} unit="likes given" accent={theme.accent} active={active} layout={layout} />
          <WrappedBody active={active}>
            Thả tim nhiều nhất vào <span className="text-foreground font-semibold">{stats.engagement.mostActiveLikeDay || 'các ngày'}</span>.
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'comments',
    label: 'COMMENTS',
    title: 'Bình luận',
    icon: MessageCircle,
    when: (s) => s.engagement.totalComments > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="COMMENTS" title="Bình luận" icon={MessageCircle} active={active} layout={layout}>
          <EmojiFloat emojis={stats.engagement.topCommentEmojis.map((e) => e.emoji)} active={active && !ctx.reducedMotion} />
          <WrappedStat numericValue={stats.engagement.totalComments} unit="bình luận" accent={theme.accent} size="lg" active={active} layout={layout} />
          {stats.engagement.topCommentEmojis.length > 0 && (
            <WrappedCard accent={theme.accent} active={active} delay={0.55}>
              <p className="font-mono text-[10px] text-foreground/45 mb-2">Top emoji</p>
              <div className="flex gap-3 text-2xl">
                {stats.engagement.topCommentEmojis.slice(0, 5).map((e, idx) => (
                  <span key={idx} title={`${e.count} lượt`}>{e.emoji}</span>
                ))}
              </div>
            </WrappedCard>
          )}
        </WrappedSlide>
      );
    },
  },
  {
    id: 'shares',
    label: 'SHARES',
    title: 'Chia sẻ',
    icon: Share2,
    when: (s) => s.engagement.totalShares > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="SHARES" title="Chia sẻ" icon={Share2} active={active} layout={layout}>
          <WrappedStat numericValue={stats.engagement.totalShares} unit="lần chia sẻ" accent={theme.accent} active={active} layout={layout} />
          <WrappedBody active={active}>
            Phổ biến nhất: <span className="text-foreground font-semibold">{stats.engagement.mostUsedShareMethod || 'Copy Link'}</span>
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'reposts',
    label: 'REPOSTS',
    title: 'Repost',
    icon: Repeat2,
    when: (s) => s.engagement.totalReposts > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      const repostPct = stats.engagement.repostToWatchRatio * 100;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="REPOSTS" title="Repost" icon={Repeat2} active={active} layout={layout}>
          <div className="flex items-center gap-4">
            <RingProgress percent={Math.min(100, repostPct * 3)} accent={theme.accent} active={active} size={layout === 'wide' ? 60 : 72} />
            <WrappedStat numericValue={stats.engagement.totalReposts} unit="reposts" accent={theme.accent} size="lg" active={active} layout={layout} />
          </div>
          <WrappedBody active={active}>
            Tỷ lệ repost/xem: <span className="text-foreground font-semibold">{repostPct.toFixed(1)}%</span>
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'searches',
    label: 'SEARCH',
    title: 'Tìm kiếm',
    icon: Search,
    when: (s) => s.searches.totalSearches > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="SEARCH" title="Tìm kiếm" icon={Search} active={active} layout={layout}>
          <WrappedStat numericValue={stats.searches.totalSearches} unit="lần tìm kiếm" accent={theme.accent} size="lg" active={active} layout={layout} />
          {stats.searches.topSearches.length > 0 && (
            <RankedBars items={stats.searches.topSearches.map((s) => ({ label: s.term, value: s.count }))} accent={theme.accent} active={active} />
          )}
          {Object.keys(stats.searches.categories).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {Object.entries(stats.searches.categories)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([cat, count]) => (
                  <span key={cat} className="font-mono text-[9px] px-2 py-1 rounded-full border border-white/10 bg-white/[0.04]" style={{ color: theme.accent }}>
                    {cat} · {count}
                  </span>
                ))}
            </div>
          )}
        </WrappedSlide>
      );
    },
  },
  {
    id: 'live',
    label: 'LIVE',
    title: 'Hoạt động Live',
    icon: Radio,
    decor: 'pulse',
    when: (s) => s.live.watchedLiveRoomsCount > 0 || s.live.totalGoLiveSessions > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="LIVE" title="Hoạt động Live" icon={Radio} active={active} decor="pulse" layout={layout}>
          <WrappedStat numericValue={stats.live.watchedLiveRoomsCount} unit="phòng live" accent={theme.accent} size="lg" active={active} layout={layout} />
          {stats.live.totalGoLiveSessions > 0 && (
            <WrappedBody active={active}>
              Host livestream <span className="text-foreground font-semibold">{stats.live.totalGoLiveSessions} lần</span>!
            </WrappedBody>
          )}
        </WrappedSlide>
      );
    },
  },
  {
    id: 'shop',
    label: 'TIKTOK SHOP',
    title: 'Chi tiêu',
    icon: ShoppingBag,
    when: (s) => s.spending.orderCount > 0 || (s.spending.totalSpendVnd ?? 0) > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="TIKTOK SHOP" title="Chi tiêu" icon={ShoppingBag} active={active} layout={layout}>
          <WrappedStat
            value={stats.spending.totalSpendVnd != null ? `${(stats.spending.totalSpendVnd / 1_000_000).toFixed(1)}M` : '0'}
            unit="VND đã chi"
            accent={theme.accent}
            size="lg"
            active={active}
            layout={layout}
          />
          <WrappedCard accent={theme.accent} active={active}>
            <div className="font-mono text-xs space-y-1.5">
              <p><span className="text-foreground/50">Đơn hàng:</span> <span className="font-semibold text-foreground">{stats.spending.orderCount}</span></p>
              <p><span className="text-foreground/50">Đã duyệt sản phẩm:</span> <span style={{ color: theme.accent }}>{stats.spending.productBrowsingCount}</span></p>
            </div>
          </WrappedCard>
          <WrappedBody active={active}>{stats.spending.summaryTextVi}</WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'receipt-teaser',
    label: 'RECEIPT',
    title: 'Hóa đơn Recap',
    icon: Receipt,
    decor: 'pulse',
    when: () => true,
    build: (ctx) => {
      const { theme, active, recapId, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="RECEIPT" title="Hóa đơn Recap" icon={Receipt} active={active} decor="pulse" layout={layout}>
          <p className="font-display text-xl font-bold text-foreground mb-2">Receiptify ready!</p>
          <WrappedBody active={active}>Hóa đơn thu ngân tóm tắt toàn bộ chỉ số của bạn.</WrappedBody>
          <div className="flex flex-col gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
            <Link href={`/receipt/${recapId}?download=1`} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-display font-semibold text-sm text-background" style={{ background: theme.accent }}>
              <Printer className="h-4 w-4" />
              Tải Receiptify PNG
            </Link>
            <Link href={`/receipt/${recapId}`} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-display font-semibold text-sm border border-white/15 text-foreground/80">
              Xem hóa đơn
            </Link>
          </div>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'persona',
    label: 'PERSONA',
    title: 'Cá tính của bạn',
    icon: Sparkles,
    decor: 'burst',
    when: (s) => !!s.persona?.title,
    build: (ctx) => {
      const { theme, stats, active, vinylEnabled, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="PERSONA" title="Cá tính của bạn" icon={Sparkles} active={active} decor="burst" layout={layout}>
          {vinylEnabled && !ctx.reducedMotion && (
            <VinylDisc accent={theme.accent} label={stats.persona.title.slice(0, 8)} active={active} size={layout === 'wide' ? 72 : 88} className="absolute top-20 right-3 z-10 recap-vinyl-decor" />
          )}
          <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: theme.accent }}>
            {stats.persona.subtitle || 'Cá tính lướt dạo'}
          </p>
          <WrappedStat value={stats.persona.title} accent={theme.accent} size="lg" active={active} layout={layout} />
          <WrappedBody active={active}>{stats.persona.description}</WrappedBody>
          {stats.persona.score > 0 && (
            <p className="font-display text-sm font-semibold mt-3" style={{ color: theme.accent }}>
              Score {stats.persona.score}/10
            </p>
          )}
        </WrappedSlide>
      );
    },
  },
  {
    id: 'final',
    label: 'THE END',
    title: 'Recap hoàn tất',
    icon: PartyPopper,
    decor: 'burst',
    when: () => true,
    build: (ctx) => {
      const { theme, active, recapId, isDemo, layout, onDeleteClick } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="THE END" title="Recap hoàn tất" icon={PartyPopper} active={active} decor="burst" layout={layout}>
          <p className="font-display text-lg font-semibold text-foreground/80 mb-4">Bạn đã xem hết recap!</p>
          <div className="flex flex-col gap-2.5" onClick={(e) => e.stopPropagation()}>
            <Link href={`/receipt/${recapId}?download=1`} className="flex items-center justify-center gap-2 py-3 rounded-full font-display font-semibold text-sm text-background" style={{ background: theme.accent }}>
              <Printer className="h-4 w-4" />
              Tải Receiptify (PNG)
            </Link>
            <Link href={`/receipt/${recapId}`} className="flex items-center justify-center gap-2 py-3 rounded-full font-display font-semibold text-sm border border-white/15 text-foreground hover:bg-white/5 transition-colors">
              Xem hóa đơn đầy đủ
            </Link>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/recap/${recapId}`);
                alert('Đã copy link chia sẻ!');
              }}
              className="flex items-center justify-center gap-2 py-3 rounded-full font-display font-semibold text-sm border border-white/15 text-foreground hover:bg-white/5 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Copy link chia sẻ
            </button>
            {!isDemo && onDeleteClick && (
              <button
                onClick={onDeleteClick}
                className="flex items-center justify-center gap-2 py-3 rounded-full font-mono text-xs text-accent-red/80 hover:text-accent-red border border-accent-red/20 hover:border-accent-red/40 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Xóa dữ liệu
              </button>
            )}
          </div>
        </WrappedSlide>
      );
    },
  },
];
