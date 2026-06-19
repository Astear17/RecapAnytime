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
import { showToast } from '@/lib/toast';

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
        <WrappedSlide
          theme={theme}
          slideNum={ctx.slideNum}
          label="YOUR RECAP"
          icon={Sparkles}
          active={active}
          decor="burst"
          layout={layout}
          decorDisc={vinylEnabled && !ctx.reducedMotion ? (
            <VinylDisc accent={theme.accent} label="RECAP" active={active} size={layout === 'wide' ? 56 : 72} className="opacity-80" />
          ) : undefined}
        >
          <WrappedStat value="TikTok" unit="Recap 2026" accent={theme.accent} active={active} layout={layout} />
          <WrappedBody active={active}>
            Dành cho <span className="text-foreground font-semibold">@{stats.profile.username || 'guest'}</span> —
            đây là toàn bộ thói quen lướt dạo của bạn, gói gọn trong vài slide.
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'profile',
    label: 'PROFILE',
    title: 'Bạn là ai trên TikTok?',
    icon: User,
    decor: 'pulse',
    when: () => true,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="PROFILE" title="Bạn là ai trên TikTok?" icon={User} active={active} decor="pulse" layout={layout}>
          <div className={layoutClass(layout)}>
            <ProfileRing photoUrl={stats.profile.profilePhoto} accent={theme.accent} active={active} displayName={stats.profile.displayName || stats.profile.username || 'U'} />
            <div>
              <WrappedStat value={stats.profile.displayName || 'Guest'} accent={theme.accent} size="lg" active={active} layout={layout} />
              <WrappedCard accent={theme.accent} active={active}>
                <p className="font-mono text-xs space-y-2">
                  <span className="block"><span className="text-foreground/50">@</span>{stats.profile.username || 'guest'}</span>
                  <span className="block text-foreground/70">{stats.profile.followerCount || 0} người theo dõi · {stats.profile.followingCount || 0} đang follow</span>
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
    title: 'Hành trình của bạn',
    icon: Calendar,
    when: (s) => !!(s.watch.firstWatchAt || s.watch.lastWatchAt),
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="TIMELINE" title="Hành trình của bạn" icon={Calendar} active={active} layout={layout}>
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
            Streak dài nhất: <span className="text-foreground font-semibold">{stats.watch.longestStreakDays} ngày</span> liên tục không nghỉ.
            Bạn thực sự nghiêm túc với việc lướt dạo.
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'watch-count',
    label: 'WATCH STATS',
    title: 'Bạn đã xem rất nhiều',
    icon: Eye,
    when: (s) => s.watch.totalVideos > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="WATCH STATS" title="Bạn đã xem rất nhiều" icon={Eye} active={active} layout={layout}>
          <div className={layoutClass(layout)}>
            <WrappedStat numericValue={stats.watch.totalVideos} unit="video đã xem" accent={theme.accent} active={active} layout={layout} />
            <MonthlyChart data={stats.watch.videosPerMonth} accent={theme.accent} active={active} compact={layout === 'wide'} />
          </div>
          <WrappedBody active={active}>
            Đây là xu hướng lướt theo tháng. Peak season của bạn — ai cũng có một tháng "nghiện nặng" nhất.
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'watch-time',
    label: 'SCREEN TIME',
    title: 'Thời gian bạn đã mất',
    icon: Clock,
    decor: 'pulse',
    when: (s) => s.watch.estimatedWatchSeconds > 0,
    build: (ctx) => {
      const { theme, stats, active, vinylEnabled, layout } = ctx;
      const watchHours = Math.floor(stats.watch.estimatedWatchSeconds / 3600);
      const watchDays = Math.floor(stats.watch.estimatedWatchSeconds / 86400);
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="SCREEN TIME" title="Thời gian bạn đã mất" icon={Clock} active={active} decor="pulse" layout={layout}>
          <div className={`flex items-center gap-3 ${layout === 'wide' ? 'flex-row' : ''}`}>
            {vinylEnabled && !ctx.reducedMotion && <VinylDisc accent={theme.accent} label={`${watchHours}h`} active={active} size={layout === 'wide' ? 64 : 80} />}
            <div className="flex items-center gap-3 flex-1">
              <RingProgress percent={Math.min(100, (watchHours / 1000) * 100)} accent={theme.accent} active={active} size={layout === 'wide' ? 60 : 72} />
              <WrappedStat numericValue={watchHours} unit="giờ xem" accent={theme.accent} size="lg" active={active} layout={layout} />
            </div>
          </div>
          <WrappedBody active={active}>
            ≈ {watchDays} ngày liên tục. Không phải nhạc nền nữa — đây là lối sống rồi.
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'sessions',
    label: 'SESSIONS',
    title: 'Mỗi lần mở app là một phiên',
    icon: Activity,
    when: (s) => s.watch.sessionCount > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      const longestMin = Math.floor(stats.watch.longestSessionSeconds / 60);
      const avgMin = Math.floor(stats.watch.averageSessionSeconds / 60);
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="SESSIONS" title="Mỗi lần mở app là một phiên" icon={Activity} active={active} layout={layout}>
          <WrappedStat numericValue={stats.watch.sessionCount} unit="phiên lướt" accent={theme.accent} size="lg" active={active} layout={layout} />
          <WrappedCard accent={theme.accent} active={active}>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <p className="text-foreground/50 mb-1">Kỷ lục</p>
                <p className="font-display text-lg font-bold text-foreground">{longestMin} phút</p>
              </div>
              <div>
                <p className="text-foreground/50 mb-1">Trung bình</p>
                <p className="font-display text-lg font-bold" style={{ color: theme.accent }}>{avgMin} phút</p>
              </div>
            </div>
          </WrappedCard>
          <WrappedBody active={active}>
            {longestMin > 60
              ? `Phiên dài nhất ${longestMin} phút — bạn thực sự không thể dừng lại.`
              : `${avgMin} phút mỗi phiên — ngắn gọn nhưng đều đặn.`}
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'active-time',
    label: 'PEAK HOURS',
    title: 'Giờ vàng của bạn',
    icon: Sun,
    when: (s) => s.watch.mostActiveHour !== null || Object.keys(s.watch.hourlyDistribution).length > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      const hour = stats.watch.mostActiveHour;
      const timeDesc = hour !== null
        ? hour >= 22 || hour < 5 ? 'đêm muộn' : hour >= 5 && hour < 12 ? 'sáng sớm' : hour >= 12 && hour < 17 ? 'chiều' : 'tối'
        : '';
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="PEAK HOURS" title="Giờ vàng của bạn" icon={Sun} active={active} layout={layout}>
          <p className="font-display text-3xl font-bold mb-1" style={{ color: theme.accent }}>
            {stats.watch.mostActiveWeekday || '—'}
          </p>
          <p className="font-mono text-[10px] text-foreground/45 mb-2">
            Peak: {hour !== null ? `${hour}:00` : '—'} · {timeDesc}
          </p>
          <HourChart data={stats.watch.hourlyDistribution} accent={theme.accent} highlightHour={hour} active={active} compact={layout === 'wide'} />
          <WrappedBody active={active}>
            {hour !== null && hour >= 22
              ? 'Kẻ gác đêm chính hiệu. TikTok của bạn sống về đêm.'
              : hour !== null && hour >= 12 && hour < 17
              ? 'Chiều chiều lướt TikTok — thói quen không thể bỏ.'
              : 'Bạn biết rõ giờ nào mình nghiện nhất.'}
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'likes',
    label: 'ENGAGEMENT',
    title: 'Tim bạn đã trao đi',
    icon: Heart,
    decor: 'pulse',
    when: (s) => s.engagement.totalLikes > 0,
    build: (ctx) => {
      const { theme, stats, active, vinylEnabled, layout } = ctx;
      return (
        <WrappedSlide
          theme={theme}
          slideNum={ctx.slideNum}
          label="ENGAGEMENT"
          title="Tim bạn đã trao đi"
          icon={Heart}
          active={active}
          decor="pulse"
          layout={layout}
          decorDisc={vinylEnabled && active && !ctx.reducedMotion ? (
            <VinylDisc accent={theme.accent} label="♥" active size={layout === 'wide' ? 52 : 64} className="opacity-70" />
          ) : undefined}
        >
          <WrappedStat numericValue={stats.engagement.totalLikes} unit="lần thả tim" accent={theme.accent} active={active} layout={layout} />
          <WrappedBody active={active}>
            Ngày yêu thích nhất: <span className="text-foreground font-semibold">{stats.engagement.mostActiveLikeDay || 'mọi ngày'}</span>.
            Bạn thả tim nhiều đến nỗi TikTok phải hiểu bạn rồi.
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'comments',
    label: 'COMMENTS',
    title: 'Bình luận của bạn',
    icon: MessageCircle,
    when: (s) => s.engagement.totalComments > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="COMMENTS" title="Bình luận của bạn" icon={MessageCircle} active={active} layout={layout}>
          <EmojiFloat emojis={stats.engagement.topCommentEmojis.map((e) => e.emoji)} active={active && !ctx.reducedMotion} />
          <WrappedStat numericValue={stats.engagement.totalComments} unit="bình luận" accent={theme.accent} size="lg" active={active} layout={layout} />
          {stats.engagement.topCommentEmojis.length > 0 && (
            <WrappedCard accent={theme.accent} active={active} delay={0.55}>
              <p className="font-mono text-[10px] text-foreground/45 mb-2">Emoji yêu thích</p>
              <div className="flex gap-3 text-2xl">
                {stats.engagement.topCommentEmojis.slice(0, 5).map((e, idx) => (
                  <span key={idx} title={`${e.count} lần`}>{e.emoji}</span>
                ))}
              </div>
            </WrappedCard>
          )}
          <WrappedBody active={active}>
            {stats.engagement.averageCommentLength > 20
              ? 'Bạn bình luận như đang viết luận văn. Dài và tâm huyết.'
              : 'Ngắn gọn, súc tích — bình luận của bạn đi thẳng vào vấn đề.'}
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'shares',
    label: 'SHARES',
    title: 'Kẻ chia sẻ không ngừng',
    icon: Share2,
    when: (s) => s.engagement.totalShares > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="SHARES" title="Kẻ chia sẻ không ngừng" icon={Share2} active={active} layout={layout}>
          <WrappedStat numericValue={stats.engagement.totalShares} unit="lần chia sẻ" accent={theme.accent} active={active} layout={layout} />
          <WrappedBody active={active}>
            Phương thức yêu thích: <span className="text-foreground font-semibold">{stats.engagement.mostUsedShareMethod || 'Copy Link'}</span>.
            Bạn không chỉ xem — bạn muốn mọi người cùng xem.
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'reposts',
    label: 'REPOSTS',
    title: 'Nội dung bạn muốn lưu',
    icon: Repeat2,
    when: (s) => s.engagement.totalReposts > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      const repostPct = stats.engagement.repostToWatchRatio * 100;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="REPOSTS" title="Nội dung bạn muốn lưu" icon={Repeat2} active={active} layout={layout}>
          <div className="flex items-center gap-4">
            <RingProgress percent={Math.min(100, repostPct * 3)} accent={theme.accent} active={active} size={layout === 'wide' ? 60 : 72} />
            <WrappedStat numericValue={stats.engagement.totalReposts} unit="lần repost" accent={theme.accent} size="lg" active={active} layout={layout} />
          </div>
          <WrappedBody active={active}>
            Tỷ lệ repost/xem: {repostPct.toFixed(1)}%.
            {repostPct > 10 ? 'Bạn repost như đang tuyển chọn playlist riêng.' : 'Ít repost nhưng chất — bạn xem kỹ rồi mới lưu.'}
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'searches',
    label: 'SEARCH',
    title: 'Bạn tìm gì trên TikTok?',
    icon: Search,
    when: (s) => s.searches.totalSearches > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="SEARCH" title="Bạn tìm gì trên TikTok?" icon={Search} active={active} layout={layout}>
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
          <WrappedBody active={active}>
            Từ khóa "{stats.searches.topSearches[0]?.term || '...'}" — bạn tìm nó hoài. Đam mê là đây.
          </WrappedBody>
        </WrappedSlide>
      );
    },
  },
  {
    id: 'live',
    label: 'LIVE',
    title: 'Thế giới Live',
    icon: Radio,
    decor: 'pulse',
    when: (s) => s.live.watchedLiveRoomsCount > 0 || s.live.totalGoLiveSessions > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="LIVE" title="Thế giới Live" icon={Radio} active={active} decor="pulse" layout={layout}>
          <WrappedStat numericValue={stats.live.watchedLiveRoomsCount} unit="phòng live đã xem" accent={theme.accent} size="lg" active={active} layout={layout} />
          {stats.live.totalGoLiveSessions > 0 && (
            <WrappedBody active={active}>
              Bạn cũng từng lên sóng <span className="text-foreground font-semibold">{stats.live.totalGoLiveSessions} lần</span>!
              Không chỉ xem — bạn còn là người tạo nội dung.
            </WrappedBody>
          )}
          {stats.live.totalGoLiveSessions === 0 && (
            <WrappedBody active={active}>
              {stats.live.watchedLiveRoomsCount > 200
                ? 'Khán giả trung thành của livestream. Bạn ở đó nhiều hơn cả người host.'
                : 'Xem live là cách bạn thư giãn sau giờ lướt.'}
            </WrappedBody>
          )}
        </WrappedSlide>
      );
    },
  },
  {
    id: 'shop',
    label: 'TIKTOK SHOP',
    title: 'Chi tiêu của bạn',
    icon: ShoppingBag,
    when: (s) => s.spending.orderCount > 0 || (s.spending.totalSpendVnd ?? 0) > 0,
    build: (ctx) => {
      const { theme, stats, active, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="TIKTOK SHOP" title="Chi tiêu của bạn" icon={ShoppingBag} active={active} layout={layout}>
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
              <p><span className="text-foreground/50">Đã duyệt:</span> <span style={{ color: theme.accent }}>{stats.spending.productBrowsingCount} sản phẩm</span></p>
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
    title: 'Hóa đơn của bạn',
    icon: Receipt,
    decor: 'pulse',
    when: () => true,
    build: (ctx) => {
      const { theme, active, recapId, layout } = ctx;
      return (
        <WrappedSlide theme={theme} slideNum={ctx.slideNum} label="RECEIPT" title="Hóa đơn của bạn" icon={Receipt} active={active} decor="pulse" layout={layout}>
          <p className="font-display text-xl font-bold text-foreground mb-2">Receiptify đã sẵn sàng!</p>
          <WrappedBody active={active}>
            Hóa đơn thu ngân tóm tắt toàn bộ chỉ số của bạn — screenshot và chia sẻ ngay.
          </WrappedBody>
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
    title: 'Con người TikTok của bạn',
    icon: Sparkles,
    decor: 'burst',
    when: (s) => !!s.persona?.title,
    build: (ctx) => {
      const { theme, stats, active, vinylEnabled, layout } = ctx;
      return (
        <WrappedSlide
          theme={theme}
          slideNum={ctx.slideNum}
          label="PERSONA"
          title="Con người TikTok của bạn"
          icon={Sparkles}
          active={active}
          decor="burst"
          layout={layout}
          decorDisc={vinylEnabled && !ctx.reducedMotion ? (
            <VinylDisc accent={theme.accent} label={stats.persona.title.slice(0, 8)} active={active} size={layout === 'wide' ? 72 : 88} className="opacity-80" />
          ) : undefined}
        >
          <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: theme.accent }}>
            {stats.persona.subtitle || 'Cá tính lướt dạo'}
          </p>
          <WrappedStat value={stats.persona.title} accent={theme.accent} size="lg" active={active} layout={layout} />
          <WrappedBody active={active}>{stats.persona.description}</WrappedBody>
          {stats.persona.score > 0 && (
            <p className="font-display text-sm font-semibold mt-3" style={{ color: theme.accent }}>
              Độ {stats.persona.score}/10
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
          <p className="font-display text-lg font-semibold text-foreground/80 mb-4">Đây là bạn trên TikTok — mọi con số, mọi thói quen.</p>
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
                showToast('Đã copy link chia sẻ!');
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
