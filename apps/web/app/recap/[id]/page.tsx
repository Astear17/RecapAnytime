'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Printer,
  Play,
  Pause,
  Smartphone,
  Maximize2,
  Trash2,
  Sparkles,
  User,
  Calendar,
  Eye,
  Clock,
  Activity,
  Sun,
  Heart,
  MessageCircle,
  Repeat2,
  Search,
  Radio,
  ShoppingBag,
  Receipt,
  PartyPopper,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { RecapStats } from '@recapanytime/shared';
import { SLIDE_THEMES } from '@/lib/slide-themes';
import { WrappedSlide, WrappedStat, WrappedCard, WrappedBody } from '@/components/recap/WrappedSlide';

const DEMO_STATS: RecapStats = {
  profile: {
    displayName: 'Chiến Thần Lướt Dạo',
    username: 'chienthan.tiktok',
    bio: 'Lướt màn hình là đam mê, chốt đơn là lẻ sống.',
    followerCount: 256,
    followingCount: 890,
    likesReceived: 1024,
    profilePhoto: null,
    region: 'VN',
    socialLinks: {},
  },
  watch: {
    totalVideos: 67302,
    firstWatchAt: '2025-12-08T00:00:00Z',
    lastWatchAt: '2026-06-08T00:00:00Z',
    estimatedWatchSeconds: 2019060,
    sessionCount: 2470,
    averageSessionSeconds: 817,
    longestSessionSeconds: 4320,
    mostActiveWeekday: 'Friday',
    mostActiveHour: 23,
    mostActiveMonth: 'March',
    longestStreakDays: 45,
    videosPerDay: {},
    videosPerMonth: {},
    hourlyDistribution: {},
  },
  engagement: {
    totalLikes: 6000,
    likesPerMonth: {},
    mostActiveLikeDay: 'Friday',
    totalComments: 732,
    averageCommentLength: 18,
    topCommentWords: [{ word: 'nhạc', count: 35 }, { word: 'xin', count: 28 }],
    topCommentEmojis: [{ emoji: '😂', count: 124 }, { emoji: '🔥', count: 86 }],
    totalShares: 3560,
    mostUsedShareMethod: 'Copy Link',
    mostSharedContentType: 'video',
    totalReposts: 10640,
    repostToWatchRatio: 0.158,
    totalPosts: 50,
    totalPostLikes: 8920,
    averagePostLikes: 178,
    bestPostLikes: 942,
    bestPostLink: 'https://tiktok.com/@chienthan.tiktok/video/1',
  },
  searches: {
    totalSearches: 2474,
    topSearches: [{ term: 'lofi music', count: 48 }, { term: 'nextjs api', count: 32 }],
    timeline: {},
    categories: { tech: 48, shopping: 32, gaming: 25, music: 12 },
  },
  live: {
    totalGoLiveSessions: 12,
    totalLiveViews: 4520,
    totalLiveLikes: 8900,
    averageLiveDurationSeconds: 1800,
    totalEarning: 0,
    watchedLiveRoomsCount: 382,
    liveCommentsCount: 0,
  },
  spending: {
    orderCount: 25,
    completedOrderCount: 23,
    returnOrRefundCount: 2,
    totalSpendVnd: 2456000,
    productBrowsingCount: 435,
    cartItemCount: 0,
    voucherCount: 0,
    reviewCount: 0,
    coinRechargeCount: 0,
    giftSentCount: 0,
    totalCoinsRecharged: null,
    totalCoinsGifted: null,
    topShops: [{ name: 'AKKO Store', count: 2 }],
    topProductCategories: [{ category: 'Thời trang', count: 15 }, { category: 'Công nghệ', count: 10 }],
    summaryTextVi: 'Chi tiêu đều tay! Bạn đã đầu tư 2.456.000 VND vào các deal hot.',
  },
  persona: {
    id: 'night-scroller',
    title: 'Night Scroller',
    subtitle: 'Kẻ Gác Đêm TikTok',
    description: 'Lướt màn hình khi cả thế giới đã ngủ. Đối với bạn, TikTok thú vị nhất là sau 12 giờ đêm.',
    score: 8,
    reasons: ['Giờ hoạt động mạnh nhất của bạn rơi vào khoảng đêm muộn (22h - 4h sáng).', 'Thích xem livestream vào lúc khuya.'],
  },
  receipt: {
    receiptId: 'RC-DEMO-2026',
    generatedAt: '2026-06-09T16:26:00Z',
    accountLabel: '@chienthan.tiktok',
    periodStart: '2025-12-08',
    periodEnd: '2026-06-08',
    lineItems: [],
    spendingLines: [],
    topSearches: [],
    persona: { id: 'night', title: 'Night Scroller', subtitle: 'Kẻ Gác Đêm', description: '', score: 8, reasons: [] },
    footerText: 'Thank you for scrolling.',
  },
};

type AspectRatio = 'story' | 'feed' | 'wide';

export default function RecapPage() {
  const params = useParams();
  const router = useRouter();
  const recapId = params.id as string;
  const isDemo = recapId === 'demo';

  const [stats, setStats] = useState<RecapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [aspect, setAspect] = useState<AspectRatio>('story');
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [deleteTokenInput, setDeleteTokenInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const slideProgressTimer = useRef<NodeJS.Timeout | null>(null);
  const [slideProgress, setSlideProgress] = useState(0);
  const SLIDE_DURATION_MS = 6000;

  useEffect(() => {
    if (isDemo) {
      setStats(DEMO_STATS);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchApi<{ ok: boolean; recap: any }>(`/api/recap/${recapId}`)
      .then((res) => {
        if (res.ok) {
          const recap = res.recap;
          setStats({
            profile: recap.profile || {},
            watch: recap.stats?.watch || {},
            engagement: recap.stats?.engagement || {},
            searches: recap.stats?.searches || {},
            live: recap.stats?.live || {},
            spending: recap.stats?.spending || {},
            persona: recap.persona || recap.stats?.persona || {
              id: 'unknown',
              title: 'Unknown Persona',
              subtitle: 'Chưa đủ dữ liệu',
              description: 'Chưa có đủ dữ liệu để xác định persona.',
              score: 0,
              reasons: [],
            },
            receipt: recap.receipt || {
              receiptId: recap.id || 'RC-UNKNOWN',
              generatedAt: recap.createdAt || new Date().toISOString(),
              accountLabel: '@guest',
              periodStart: recap.dateRange?.start || null,
              periodEnd: recap.dateRange?.end || null,
              lineItems: [],
              spendingLines: [],
              topSearches: [],
              persona: recap.persona || {
                id: 'unknown',
                title: 'Unknown Persona',
                subtitle: '',
                description: '',
                score: 0,
                reasons: [],
              },
              footerText: 'Thank you for scrolling.',
            },
          });
        } else {
          setError('Recap not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load recap');
      })
      .finally(() => setLoading(false));
  }, [recapId, isDemo]);

  useEffect(() => {
    if (loading || error || isPaused || !stats) return;

    const tickRateMs = 100;
    const increment = (tickRateMs / SLIDE_DURATION_MS) * 100;

    slideProgressTimer.current = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, tickRateMs);

    return () => {
      if (slideProgressTimer.current) clearInterval(slideProgressTimer.current);
    };
  }, [slide, isPaused, loading, error, stats]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextSlide();
      if (e.key === 'ArrowLeft') handlePrevSlide();
      if (e.key === ' ') setIsPaused((p) => !p);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slide]);

  const handleNextSlide = () => {
    setSlideProgress(0);
    setSlide((prev) => (prev < 16 ? prev + 1 : 0));
  };

  const handlePrevSlide = () => {
    setSlideProgress(0);
    setSlide((prev) => (prev > 0 ? prev - 1 : 16));
  };

  const handleDelete = async () => {
    if (!deleteTokenInput) return;
    setDeleting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}/api/recap/${recapId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteToken: deleteTokenInput }),
      });
      const data = await response.json();
      if (data.ok) {
        alert('Recap deleted permanently.');
        router.push('/');
      } else {
        alert(data.error?.message || 'Invalid delete token');
      }
    } catch {
      alert('Network error. Failed to delete.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen hero-mesh space-y-6">
        <div className="w-12 h-12 rounded-full border-2 border-accent-red border-t-transparent animate-spin" />
        <span className="font-mono text-sm text-muted terminal-cursor">Đang tạo recap của bạn</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen hero-mesh space-y-4 p-4 text-center">
        <p className="font-display text-2xl font-bold text-accent-red">Recap không tìm thấy</p>
        <p className="font-mono text-xs text-muted max-w-sm">
          Dữ liệu có thể đã bị xóa hoặc liên kết không hợp lệ. Hãy tải lên file export mới.
        </p>
        <Link href="/" className="btn-wrapped-primary text-white px-6 py-3 rounded-full font-display font-semibold text-sm">
          Về trang chủ
        </Link>
      </div>
    );
  }

  const t = SLIDE_THEMES;

  const slides = [
    <WrappedSlide key="intro" theme={t[0]} slideNum={1} label="YOUR RECAP" icon={Sparkles} animateKey={slide}>
      <WrappedStat value="TikTok" unit="Recap 2026" accent={t[0].accent} />
      <WrappedBody>
        Phân tích cho <span className="text-foreground font-semibold">@{stats.profile.username || 'guest'}</span>.
        Vuốt để khám phá thói quen lướt dạo của bạn.
      </WrappedBody>
    </WrappedSlide>,

    <WrappedSlide key="profile" theme={t[1]} slideNum={2} label="PROFILE" title="Tài khoản của bạn" icon={User} animateKey={slide}>
      <WrappedStat value={stats.profile.displayName || 'Guest'} accent={t[1].accent} size="lg" />
      <WrappedCard accent={t[1].accent}>
        <p className="font-mono text-xs space-y-2">
          <span className="block"><span className="text-foreground/50">@</span>{stats.profile.username || 'guest'}</span>
          <span className="block text-foreground/70">{stats.profile.followerCount || 0} followers · {stats.profile.followingCount || 0} following</span>
          <span className="block text-foreground/50">{stats.profile.region || 'VN'}</span>
        </p>
      </WrappedCard>
    </WrappedSlide>,

    <WrappedSlide key="period" theme={t[2]} slideNum={3} label="TIMELINE" title="Khoảng thời gian" icon={Calendar} animateKey={slide}>
      <div className="space-y-3">
        <p className="font-display text-2xl font-bold" style={{ color: t[2].accent }}>
          {stats.watch.firstWatchAt ? stats.watch.firstWatchAt.substring(0, 10) : '—'}
        </p>
        <p className="font-mono text-xs text-foreground/40">đến</p>
        <p className="font-display text-2xl font-bold text-foreground">
          {stats.watch.lastWatchAt ? stats.watch.lastWatchAt.substring(0, 10) : '—'}
        </p>
      </div>
      <WrappedBody>Toàn bộ tương tác trong nửa năm qua — ghi nhận ngày {new Date(stats.receipt.generatedAt).toLocaleDateString('vi-VN')}.</WrappedBody>
    </WrappedSlide>,

    <WrappedSlide key="watch-count" theme={t[3]} slideNum={4} label="WATCH STATS" title="Video đã xem" icon={Eye} animateKey={slide}>
      <WrappedStat value={stats.watch.totalVideos.toLocaleString()} unit="videos" accent={t[3].accent} />
      <WrappedBody>Một con số đáng kinh ngạc trên bảng tin Foryou của bạn.</WrappedBody>
    </WrappedSlide>,

    <WrappedSlide key="watch-time" theme={t[4]} slideNum={5} label="SCREEN TIME" title="Thời gian lướt" icon={Clock} animateKey={slide}>
      <WrappedStat
        value={Math.floor(stats.watch.estimatedWatchSeconds / 3600).toLocaleString()}
        unit="giờ xem video"
        accent={t[4].accent}
      />
      <WrappedBody>
        Tương đương <span className="text-foreground font-semibold">{Math.floor(stats.watch.estimatedWatchSeconds / 86400)} ngày</span> lướt liên tục không ngừng nghỉ.
      </WrappedBody>
    </WrappedSlide>,

    <WrappedSlide key="sessions" theme={t[5]} slideNum={6} label="SESSIONS" title="Phiên lướt" icon={Activity} animateKey={slide}>
      <WrappedStat value={stats.watch.sessionCount.toLocaleString()} unit="phiên lướt" accent={t[5].accent} size="lg" />
      <WrappedCard accent={t[5].accent}>
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div>
            <p className="text-foreground/50 mb-1">Dài nhất</p>
            <p className="font-display text-lg font-bold text-foreground">{Math.floor(stats.watch.longestSessionSeconds / 60)} phút</p>
          </div>
          <div>
            <p className="text-foreground/50 mb-1">Trung bình</p>
            <p className="font-display text-lg font-bold" style={{ color: t[5].accent }}>{Math.floor(stats.watch.averageSessionSeconds / 60)} phút</p>
          </div>
        </div>
      </WrappedCard>
    </WrappedSlide>,

    <WrappedSlide key="active-time" theme={t[6]} slideNum={7} label="PEAK HOURS" title="Giờ vàng" icon={Sun} animateKey={slide}>
      <div className="space-y-5">
        <div>
          <p className="font-mono text-[10px] text-foreground/45 uppercase tracking-wider mb-1">Thứ hoạt động nhất</p>
          <p className="font-display text-3xl font-bold" style={{ color: t[6].accent }}>{stats.watch.mostActiveWeekday || '—'}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] text-foreground/45 uppercase tracking-wider mb-1">Giờ hoạt động mạnh nhất</p>
          <p className="font-display text-3xl font-bold text-foreground">
            {stats.watch.mostActiveHour !== null ? `${stats.watch.mostActiveHour}:00` : '—'}
          </p>
        </div>
      </div>
    </WrappedSlide>,

    <WrappedSlide key="likes" theme={t[7]} slideNum={8} label="ENGAGEMENT" title="Lượt thích" icon={Heart} animateKey={slide}>
      <WrappedStat value={stats.engagement.totalLikes.toLocaleString()} unit="likes given" accent={t[7].accent} />
      <WrappedBody>
        Bạn thả tim đều tay nhất vào <span className="text-foreground font-semibold">{stats.engagement.mostActiveLikeDay || 'các ngày'}</span> hàng tuần.
      </WrappedBody>
    </WrappedSlide>,

    <WrappedSlide key="comments" theme={t[8]} slideNum={9} label="COMMENTS" title="Bình luận" icon={MessageCircle} animateKey={slide}>
      <WrappedStat value={stats.engagement.totalComments.toLocaleString()} unit="bình luận" accent={t[8].accent} size="lg" />
      {stats.engagement.topCommentEmojis.length > 0 && (
        <WrappedCard accent={t[8].accent}>
          <p className="font-mono text-[10px] text-foreground/45 mb-2">Emoji yêu thích</p>
          <div className="flex gap-3 text-2xl">
            {stats.engagement.topCommentEmojis.slice(0, 5).map((e, idx) => (
              <span key={idx} title={`${e.count} lượt`}>{e.emoji}</span>
            ))}
          </div>
        </WrappedCard>
      )}
    </WrappedSlide>,

    <WrappedSlide key="shares" theme={t[9]} slideNum={10} label="SHARES" title="Chia sẻ" icon={Share2} animateKey={slide}>
      <WrappedStat value={stats.engagement.totalShares.toLocaleString()} unit="lần chia sẻ" accent={t[9].accent} />
      <WrappedBody>
        Cách chia sẻ phổ biến: <span className="text-foreground font-semibold">{stats.engagement.mostUsedShareMethod || 'Copy Link'}</span>
      </WrappedBody>
    </WrappedSlide>,

    <WrappedSlide key="reposts" theme={t[10]} slideNum={11} label="REPOSTS" title="Repost" icon={Repeat2} animateKey={slide}>
      <WrappedStat value={stats.engagement.totalReposts.toLocaleString()} unit="reposts" accent={t[10].accent} />
      <WrappedBody>
        Tỷ lệ repost/xem: <span className="text-foreground font-semibold">{(stats.engagement.repostToWatchRatio * 100).toFixed(1)}%</span> — bạn là nguồn lan tỏa nội dung.
      </WrappedBody>
    </WrappedSlide>,

    <WrappedSlide key="searches" theme={t[11]} slideNum={12} label="SEARCH" title="Tìm kiếm" icon={Search} animateKey={slide}>
      <WrappedStat value={stats.searches.totalSearches.toLocaleString()} unit="lần tìm kiếm" accent={t[11].accent} size="lg" />
      {stats.searches.topSearches.length > 0 && (
        <WrappedCard accent={t[11].accent}>
          <p className="font-mono text-[10px] text-foreground/45 mb-2">Top từ khóa</p>
          <ul className="font-mono text-xs space-y-1.5">
            {stats.searches.topSearches.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex justify-between gap-4">
                <span className="text-foreground/80">{idx + 1}. &ldquo;{item.term}&rdquo;</span>
                <span style={{ color: t[11].accent }}>{item.count}×</span>
              </li>
            ))}
          </ul>
        </WrappedCard>
      )}
    </WrappedSlide>,

    <WrappedSlide key="live" theme={t[12]} slideNum={13} label="LIVE" title="Hoạt động Live" icon={Radio} animateKey={slide}>
      <WrappedStat value={stats.live.watchedLiveRoomsCount.toLocaleString()} unit="phòng live đã xem" accent={t[12].accent} size="lg" />
      {stats.live.totalGoLiveSessions > 0 && (
        <WrappedBody>Bạn còn làm host livestream <span className="text-foreground font-semibold">{stats.live.totalGoLiveSessions} lần</span>!</WrappedBody>
      )}
    </WrappedSlide>,

    <WrappedSlide key="shop" theme={t[13]} slideNum={14} label="TIKTOK SHOP" title="Chi tiêu" icon={ShoppingBag} animateKey={slide}>
      <WrappedStat
        value={stats.spending.totalSpendVnd != null ? (stats.spending.totalSpendVnd / 1_000_000).toFixed(1) + 'M' : '0'}
        unit="VND đã chi"
        accent={t[13].accent}
        size="lg"
      />
      <WrappedCard accent={t[13].accent}>
        <div className="font-mono text-xs space-y-1.5">
          <p><span className="text-foreground/50">Đơn hàng:</span> <span className="font-semibold text-foreground">{stats.spending.orderCount}</span></p>
          <p><span className="text-foreground/50">Hoàn thành:</span> <span style={{ color: t[13].accent }}>{stats.spending.completedOrderCount}</span></p>
        </div>
      </WrappedCard>
      <WrappedBody>{stats.spending.summaryTextVi}</WrappedBody>
    </WrappedSlide>,

    <WrappedSlide key="receipt-teaser" theme={t[14]} slideNum={15} label="RECEIPT" title="Hóa đơn Recap" icon={Receipt} animateKey={slide}>
      <p className="font-display text-xl font-bold text-foreground mb-2">Receiptify ready!</p>
      <WrappedBody>Bản hóa đơn thu ngân tóm tắt toàn bộ chỉ số xem, tim, repost và chi tiêu.</WrappedBody>
      <Link
        href={`/receipt/${recapId}`}
        className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full font-display font-semibold text-sm text-background transition-opacity hover:opacity-90"
        style={{ background: t[14].accent }}
        onClick={(e) => e.stopPropagation()}
      >
        <Printer className="h-4 w-4" />
        Xem hóa đơn
      </Link>
    </WrappedSlide>,

    <WrappedSlide key="persona" theme={t[15]} slideNum={16} label="PERSONA" title="Cá tính của bạn" icon={Sparkles} animateKey={slide}>
      <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: t[15].accent }}>
        {stats.persona.subtitle || 'Cá tính lướt dạo'}
      </p>
      <WrappedStat value={stats.persona.title} accent={t[15].accent} size="lg" />
      <WrappedBody>{stats.persona.description}</WrappedBody>
      {stats.persona.score > 0 && (
        <p className="font-display text-sm font-semibold mt-3" style={{ color: t[15].accent }}>
          Score {stats.persona.score}/10
        </p>
      )}
    </WrappedSlide>,

    <WrappedSlide key="final" theme={t[16]} slideNum={17} label="THE END" title="Recap hoàn tất" icon={PartyPopper} animateKey={slide}>
      <p className="font-display text-lg font-semibold text-foreground/80 mb-4">Bạn đã xem hết recap!</p>
      <div className="flex flex-col gap-2.5" onClick={(e) => e.stopPropagation()}>
        <Link
          href={`/receipt/${recapId}`}
          className="flex items-center justify-center gap-2 py-3 rounded-full font-display font-semibold text-sm text-background"
          style={{ background: t[16].accent }}
        >
          <Printer className="h-4 w-4" />
          Xem & In hóa đơn
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
        {!isDemo && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-2 py-3 rounded-full font-mono text-xs text-accent-red/80 hover:text-accent-red border border-accent-red/20 hover:border-accent-red/40 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Xóa dữ liệu
          </button>
        )}
      </div>
    </WrappedSlide>,
  ];

  const getAspectClass = () => {
    switch (aspect) {
      case 'story':
        return 'aspect-[9/16] w-full max-w-[375px]';
      case 'feed':
        return 'aspect-[3/4] w-full max-w-[420px]';
      case 'wide':
        return 'aspect-[16/9] w-full max-w-[680px]';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 hero-mesh">
      <div className="w-full max-w-xl flex items-center justify-between mb-5 font-mono text-xs text-muted no-print">
        <Link href="/" className="flex items-center gap-2 hover:text-foreground transition-colors">
          <span className="font-display font-bold text-sm text-foreground">RecapAnytime</span>
        </Link>

        <div className="flex gap-1 bg-surface/80 border border-white/[0.06] p-1 rounded-full backdrop-blur-sm">
          {(['story', 'feed', 'wide'] as AspectRatio[]).map((a) => (
            <button
              key={a}
              onClick={() => setAspect(a)}
              className={`p-2 rounded-full transition-colors ${aspect === a ? 'bg-white/10 text-foreground' : 'text-muted hover:text-foreground'}`}
              title={a}
            >
              {a === 'wide' ? <Maximize2 className="h-3.5 w-3.5" /> : <Smartphone className={`h-3.5 w-3.5 ${a === 'feed' ? 'rotate-90' : ''}`} />}
            </button>
          ))}
        </div>

        <button onClick={() => setIsPaused((p) => !p)} className="p-2 rounded-full hover:bg-white/5 transition-colors">
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      </div>

      <div className="relative flex items-center justify-center w-full">
        <button
          onClick={handlePrevSlide}
          className="absolute -left-10 lg:-left-16 p-2 text-muted hover:text-foreground hidden md:block transition-colors"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <div className={`relative rounded-2xl overflow-hidden shadow-wrapped transition-all duration-300 ${getAspectClass()}`}>
          <div className="absolute top-3 left-0 right-0 flex px-3 gap-1 z-20">
            {slides.map((_, idx) => (
              <div key={idx} className="h-[3px] flex-1 rounded-full overflow-hidden bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-100 ease-linear"
                  style={{
                    width: idx === slide ? `${slideProgress}%` : idx < slide ? '100%' : '0%',
                    background: t[idx].progressColor,
                  }}
                />
              </div>
            ))}
          </div>

          <div
            className="w-full h-full relative cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              if (clickX > rect.width * 0.4) handleNextSlide();
              else handlePrevSlide();
            }}
          >
            {slides[slide]}
          </div>
        </div>

        <button
          onClick={handleNextSlide}
          className="absolute -right-10 lg:-right-16 p-2 text-muted hover:text-foreground hidden md:block transition-colors"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      <div className="mt-5 font-mono text-[10px] text-muted/60 tracking-wider">
        {slide + 1} / {slides.length}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-white/10 p-6 rounded-2xl w-full max-w-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-accent-red">Xác nhận xóa</h3>
            <p className="font-mono text-xs text-muted leading-relaxed">
              Nhập Mã Xóa (Delete Token) bạn nhận khi upload để xóa vĩnh viễn recap này.
            </p>
            <input
              type="text"
              value={deleteTokenInput}
              onChange={(e) => setDeleteTokenInput(e.target.value)}
              placeholder="Delete token..."
              className="w-full p-3 bg-background border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-accent-red font-mono text-sm"
            />
            <div className="flex gap-3 pt-1">
              <button
                disabled={deleting}
                onClick={handleDelete}
                className="btn-wrapped-primary text-white px-4 py-2.5 rounded-full flex-1 font-display font-semibold text-sm disabled:opacity-50"
              >
                {deleting ? 'Đang xóa...' : 'Xác nhận'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border border-white/10 px-4 py-2.5 rounded-full flex-1 font-display text-sm hover:bg-white/5 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
