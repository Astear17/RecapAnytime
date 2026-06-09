'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal, ChevronLeft, ChevronRight, Share2, Printer, Play, Pause, Smartphone, Maximize2, Trash2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { RecapStats } from '@recapanytime/shared';

// Pre-defined synthetic demo stats
const DEMO_STATS: RecapStats = {
  profile: {
    displayName: 'Chiến Thần Lướt Dạo',
    username: 'chienthan.tiktok',
    bio: 'Lướt màn hình là đam mê, chốt đơn là lẽ sống.',
    followerCount: 256,
    followingCount: 890,
    likesReceived: 1024,
    profilePhoto: null,
    region: 'VN',
    socialLinks: {}
  },
  watch: {
    totalVideos: 67302,
    firstWatchAt: '2025-12-08T00:00:00Z',
    lastWatchAt: '2026-06-08T00:00:00Z',
    estimatedWatchSeconds: 2019060, // ~560 hours
    sessionCount: 2470,
    averageSessionSeconds: 817,
    longestSessionSeconds: 4320,
    mostActiveWeekday: 'Friday',
    mostActiveHour: 23,
    mostActiveMonth: 'March',
    longestStreakDays: 45,
    videosPerDay: {},
    videosPerMonth: {},
    hourlyDistribution: {}
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
    bestPostLink: 'https://tiktok.com/@chienthan.tiktok/video/1'
  },
  searches: {
    totalSearches: 2474,
    topSearches: [{ term: 'lofi music', count: 48 }, { term: 'nextjs api', count: 32 }],
    timeline: {},
    categories: { tech: 48, shopping: 32, gaming: 25, music: 12 }
  },
  live: {
    totalGoLiveSessions: 12,
    totalLiveViews: 4520,
    totalLiveLikes: 8900,
    averageLiveDurationSeconds: 1800,
    totalEarning: 0,
    watchedLiveRoomsCount: 382,
    liveCommentsCount: 0
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
    summaryTextVi: 'Chi tiêu đều tay! Bạn đã đầu tư 2.456.000 VND vào các deal hot.'
  },
  persona: {
    id: 'night-scroller',
    title: 'Night Scroller',
    subtitle: 'Kẻ Gác Đêm TikTok',
    description: 'Lướt màn hình khi cả thế giới đã ngủ. Đối với bạn, TikTok thú vị nhất là sau 12 giờ đêm.',
    score: 8,
    reasons: ['Giờ hoạt động mạnh nhất của bạn rơi vào khoảng đêm muộn (22h - 4h sáng).', 'Thích xem livestream vào lúc khuya.']
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
    footerText: 'Thank you for scrolling.'
  }
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

  // Fetch recap data
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
          reasons: []
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
            reasons: []
          },
          footerText: 'Thank you for scrolling.'
        }
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

  // Autoplay Logic
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

  // Keyboard navigation
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
        body: JSON.stringify({ deleteToken: deleteTokenInput })
      });
      const data = await response.json();
      if (data.ok) {
        alert('Recap deleted permanently.');
        router.push('/');
      } else {
        alert(data.error?.message || 'Invalid delete token');
      }
    } catch (_) {
      alert('Network error. Failed to delete.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-mono text-muted space-y-4">
        <Terminal className="h-8 w-8 text-accent-cyan animate-pulse" />
        <span className="terminal-cursor">Loading interactive deck statistics...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-mono text-accent-red space-y-4 p-4 text-center">
        <Terminal className="h-8 w-8 text-accent-red" />
        <span className="font-bold">Error: Recap Data Corrupted or Deleted</span>
        <p className="text-muted text-xs max-w-sm">
          Please upload your JSON export again. Data might have been removed via private deletion tokens.
        </p>
        <Link href="/" className="underline text-accent-cyan hover:text-cyan-300 text-xs">Return to homepage</Link>
      </div>
    );
  }

  // Slide content generation
  const slides = [
    // 1. Intro
    <div key="intro" className="flex flex-col justify-between h-full p-8 font-mono text-left bg-gradient-to-b from-[#050505] to-[#0d0d0d] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 text-xs text-muted">SYSTEM // SECURE</div>
      <div className="space-y-6 my-auto">
        <div className="border-l-4 border-accent-cyan pl-4">
          <p className="text-accent-cyan text-sm tracking-widest font-bold">RECAPANYTIME INIT</p>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight leading-none mt-2">
            TIKTOK RECAP <br/>DATA DECK.
          </h2>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Phân tích được tạo lập cho tài khoản <span className="text-accent-green font-bold">@{stats.profile.username || 'guest'}</span>. 
          Hãy lướt qua để khám phá thói quen hoạt động của bạn.
        </p>
      </div>
      <div className="text-[10px] text-muted border-t border-panel-border pt-4">
        TAP SCREEN OR PRESS ARROW KEYS TO NAVIGATE
      </div>
    </div>,

    // 2. Profile Snapshot
    <div key="profile" className="flex flex-col justify-between h-full p-8 font-mono bg-panel">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">02 // PROFILE SNAPSHOT</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Account Status</h2>
      </div>
      <div className="space-y-6 my-auto text-left border border-panel-border p-4 bg-background">
        <p className="text-sm"><span className="text-muted">Display:</span> <span className="text-foreground font-bold">{stats.profile.displayName || 'Guest User'}</span></p>
        <p className="text-sm"><span className="text-muted">Username:</span> <span className="text-accent-green font-bold">@{stats.profile.username || 'guest'}</span></p>
        <p className="text-sm"><span className="text-muted">Region:</span> <span className="text-foreground">{stats.profile.region || 'VN'}</span></p>
        <p className="text-sm"><span className="text-muted">Followers:</span> <span className="text-foreground font-bold">{stats.profile.followerCount || 0}</span></p>
        <p className="text-sm"><span className="text-muted">Following:</span> <span className="text-foreground font-bold">{stats.profile.followingCount || 0}</span></p>
      </div>
      <div className="text-[10px] text-muted text-left leading-relaxed">
        Email, mật khẩu và dữ liệu định danh riêng tư được lược bỏ theo chính sách bảo mật.
      </div>
    </div>,

    // 3. Recap Period
    <div key="period" className="flex flex-col justify-between h-full p-8 font-mono bg-panel text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">03 // TIMELINE</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Recap Period</h2>
      </div>
      <div className="my-auto space-y-6">
        <p className="text-muted text-xs">DỮ LIỆU ĐƯỢC PHÂN TÍCH TỪ:</p>
        <div className="space-y-2">
          <p className="text-xl font-bold text-accent-cyan">{stats.watch.firstWatchAt ? stats.watch.firstWatchAt.substring(0, 10) : '2025-12-08'}</p>
          <p className="text-xs text-muted">ĐẾN</p>
          <p className="text-xl font-bold text-accent-green">{stats.watch.lastWatchAt ? stats.watch.lastWatchAt.substring(0, 10) : '2026-06-08'}</p>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Ghi nhận toàn bộ tương tác của bạn trong vòng nửa năm qua.
        </p>
      </div>
      <div className="text-[10px] text-muted">
        GENERATED ON: {new Date(stats.receipt.generatedAt).toLocaleDateString()}
      </div>
    </div>,

    // 4. Watch Count
    <div key="watch-count" className="flex flex-col justify-between h-full p-8 font-mono bg-[#050505] text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">04 // WATCH COUNT</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Lượng Video Đã Xem</h2>
      </div>
      <div className="my-auto space-y-4">
        <span className="text-[10px] bg-accent-red/20 text-accent-red px-2 py-1 rounded-sm font-bold">STATISTICS</span>
        <p className="text-5xl font-extrabold text-foreground tracking-tight select-all">
          {stats.watch.totalVideos.toLocaleString()}
        </p>
        <p className="text-xs text-muted leading-relaxed">
          Video đã xuất hiện trên bảng tin Foryou và được bạn theo dõi trong khoảng thời gian này. Một con số đáng kinh ngạc!
        </p>
      </div>
      <div className="text-[10px] text-muted">
        TOTAL_VIDEOS_WATCHED
      </div>
    </div>,

    // 5. Estimated watch time
    <div key="watch-time" className="flex flex-col justify-between h-full p-8 font-mono bg-panel text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">05 // ESTIMATED WATCH TIME</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Tổng Thời Gian Xem</h2>
      </div>
      <div className="my-auto space-y-6">
        <p className="text-5xl font-extrabold text-accent-cyan">
          {Math.floor(stats.watch.estimatedWatchSeconds / 3600)}
          <span className="text-lg font-normal text-muted ml-1">giờ</span>
        </p>
        <p className="text-xs text-muted leading-relaxed">
          Khoảng <span className="text-accent-red font-bold">{Math.floor(stats.watch.estimatedWatchSeconds / 86400)} ngày</span> lướt màn hình liên tục không ngừng nghỉ. Bạn đã dành kha khá thời gian cho việc này đấy!
        </p>
      </div>
      <div className="text-[10px] text-muted">
        EST_TOTAL_HOURS
      </div>
    </div>,

    // 6. Watch Sessions
    <div key="sessions" className="flex flex-col justify-between h-full p-8 font-mono bg-panel text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">06 // SESSIONS</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Watch Sessions</h2>
      </div>
      <div className="my-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-panel-border p-4 bg-background">
            <p className="text-muted text-[10px]">TỔNG PHIÊN LƯỚT</p>
            <p className="text-xl font-bold text-foreground mt-1">{stats.watch.sessionCount}</p>
          </div>
          <div className="border border-panel-border p-4 bg-background">
            <p className="text-muted text-[10px]">PHIÊN DÀI NHẤT</p>
            <p className="text-xl font-bold text-accent-red mt-1">{Math.floor(stats.watch.longestSessionSeconds / 60)} phút</p>
          </div>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Mỗi phiên lướt được phân tách khi bạn ngừng hoạt động trên 10 phút. Thời gian lướt trung bình mỗi phiên: <span className="text-accent-green font-bold">{Math.floor(stats.watch.averageSessionSeconds / 60)} phút</span>.
        </p>
      </div>
      <div className="text-[10px] text-muted">
        SESSION_METRICS
      </div>
    </div>,

    // 7. Most Active Time
    <div key="active-time" className="flex flex-col justify-between h-full p-8 font-mono bg-panel text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">07 // PEAK ACTIVITY</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Thời Điểm Hoạt Động</h2>
      </div>
      <div className="my-auto space-y-6">
        <div className="space-y-3">
          <p className="text-xs text-muted">THỨ HOẠT ĐỘNG NHẤT:</p>
          <p className="text-2xl font-bold text-accent-green">{stats.watch.mostActiveWeekday || 'Không rõ'}</p>
        </div>
        <div className="space-y-3">
          <p className="text-xs text-muted">GIỜ HOẠT ĐỘNG MẠNH NHẤT:</p>
          <p className="text-2xl font-bold text-accent-red">{stats.watch.mostActiveHour !== null ? `${stats.watch.mostActiveHour}:00` : 'Không rõ'}</p>
        </div>
      </div>
      <div className="text-[10px] text-muted">
        PEAK_TIMES
      </div>
    </div>,

    // 8. Likes
    <div key="likes" className="flex flex-col justify-between h-full p-8 font-mono bg-panel text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">08 // ENGAGEMENT - LIKES</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Lượt Thích Video</h2>
      </div>
      <div className="my-auto space-y-4">
        <p className="text-5xl font-extrabold text-accent-red">{stats.engagement.totalLikes.toLocaleString()}</p>
        <p className="text-xs text-muted leading-relaxed">
          Trái tim yêu thương đã được bạn trao đi. Bạn có thói quen thả tim đều tay vào <span className="text-accent-cyan font-bold">{stats.engagement.mostActiveLikeDay || 'các ngày'}</span> hàng tuần.
        </p>
      </div>
      <div className="text-[10px] text-muted">
        TOTAL_LIKED_VIDEOS
      </div>
    </div>,

    // 9. Comments
    <div key="comments" className="flex flex-col justify-between h-full p-8 font-mono bg-[#050505] text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">09 // ENGAGEMENT - COMMENTS</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Bình Luận</h2>
      </div>
      <div className="my-auto space-y-6">
        <p className="text-4xl font-extrabold text-foreground">{stats.engagement.totalComments} <span className="text-sm font-normal text-muted">bình luận</span></p>
        
        {stats.engagement.topCommentEmojis.length > 0 && (
          <div className="space-y-2 border border-panel-border p-3 bg-panel/55">
            <p className="text-muted text-[10px]">BIỂU TƯỢNG CẢM XÚC DÙNG NHIỀU:</p>
            <div className="flex space-x-3 text-lg">
              {stats.engagement.topCommentEmojis.slice(0, 5).map((e, idx) => (
                <span key={idx} title={`${e.count} lượt`}>{e.emoji}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="text-[10px] text-muted">
        COMMENT_METRICS
      </div>
    </div>,

    // 10. Shares
    <div key="shares" className="flex flex-col justify-between h-full p-8 font-mono bg-panel text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">10 // SHARES</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Chia Sẻ Niềm Vui</h2>
      </div>
      <div className="my-auto space-y-6">
        <p className="text-5xl font-extrabold text-accent-green">{stats.engagement.totalShares.toLocaleString()}</p>
        <p className="text-xs text-muted leading-relaxed">
          Số lần bạn chia sẻ video cho bạn bè. Cách chia sẻ phổ biến nhất của bạn: <span className="text-accent-cyan font-bold">{stats.engagement.mostUsedShareMethod || 'Copy Link'}</span>.
        </p>
      </div>
      <div className="text-[10px] text-muted">
        SHARE_STATS
      </div>
    </div>,

    // 11. Reposts
    <div key="reposts" className="flex flex-col justify-between h-full p-8 font-mono bg-[#050505] text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">11 // REPOSTS</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Repost Video</h2>
      </div>
      <div className="my-auto space-y-6">
        <p className="text-5xl font-extrabold text-foreground">{stats.engagement.totalReposts.toLocaleString()}</p>
        <p className="text-xs text-muted leading-relaxed">
          Tỷ lệ repost so với xem video là <span className="text-accent-red font-bold">{(stats.engagement.repostToWatchRatio * 100).toFixed(2)}%</span>. Bạn chính là nguồn lan tỏa nội dung thú vị cho bạn bè.
        </p>
      </div>
      <div className="text-[10px] text-muted">
        REPOST_METRICS
      </div>
    </div>,

    // 12. Searches
    <div key="searches" className="flex flex-col justify-between h-full p-8 font-mono bg-panel text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">12 // SEARCH ACTIVITY</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Tìm Kiếm</h2>
      </div>
      <div className="my-auto space-y-6">
        <p className="text-4xl font-bold text-accent-cyan">{stats.searches.totalSearches} <span className="text-sm font-normal text-muted">lần tìm kiếm</span></p>
        {stats.searches.topSearches.length > 0 && (
          <div className="space-y-2">
            <p className="text-muted text-[10px]">TỪ KHÓA TÌM KIẾM HÀNG ĐẦU:</p>
            <ul className="text-xs space-y-1 bg-background/50 p-3 border border-panel-border">
              {stats.searches.topSearches.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{idx + 1}. "{item.term}"</span>
                  <span className="text-accent-green">{item.count} lần</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="text-[10px] text-muted">
        SEARCH_METRICS
      </div>
    </div>,

    // 13. Live Activity
    <div key="live" className="flex flex-col justify-between h-full p-8 font-mono bg-panel text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">13 // LIVE CHANNELS</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Hoạt Động Live</h2>
      </div>
      <div className="my-auto space-y-6">
        <p className="text-4xl font-extrabold text-foreground">{stats.live.watchedLiveRoomsCount} <span className="text-sm font-normal text-muted">phòng Live đã xem</span></p>
        {stats.live.totalGoLiveSessions > 0 && (
          <p className="text-xs text-accent-green leading-relaxed border border-panel-border p-3">
            Ghi nhận bạn đã làm Host livestream {stats.live.totalGoLiveSessions} lần! Đỉnh cao của sự tự tin sáng tạo nội dung.
          </p>
        )}
      </div>
      <div className="text-[10px] text-muted">
        LIVE_ROOMS_WATCHED
      </div>
    </div>,

    // 14. Shopping / Spending
    <div key="shop" className="flex flex-col justify-between h-full p-8 font-mono bg-panel text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">14 // TIKTOK SHOP</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Xả Tiền Mua Sắm</h2>
      </div>
      <div className="my-auto space-y-6">
        <p className="text-xs text-accent-red font-bold uppercase tracking-wider">THỐNG KÊ CHI TIÊU:</p>
        <div className="space-y-2 bg-[#0c0c0c] border border-panel-border p-4">
          <p className="text-xs"><span className="text-muted">Đơn hàng đã đặt:</span> <span className="text-foreground font-bold">{stats.spending.orderCount}</span></p>
          <p className="text-xs"><span className="text-muted">Hoàn thành:</span> <span className="text-accent-green font-bold">{stats.spending.completedOrderCount}</span></p>
          <p className="text-xs"><span className="text-muted">Hoàn tiền / Trả hàng:</span> <span className="text-accent-red">{stats.spending.returnOrRefundCount}</span></p>
        </div>
        <p className="text-xs text-foreground font-semibold leading-normal">
          💬 {stats.spending.summaryTextVi}
        </p>
      </div>
      <div className="text-[10px] text-muted">
        SPENDING_METRICS
      </div>
    </div>,

    // 15. Receipt Teaser
    <div key="receipt-teaser" className="flex flex-col justify-between h-full p-8 font-mono bg-[#050505] text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">15 // RECEIPTIFY INTERACTIVE</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Hóa Đơn Recap</h2>
      </div>
      <div className="my-auto space-y-6 text-center">
        <div className="border border-panel-border bg-panel p-6 rounded-sm shadow-xl flex flex-col items-center">
          <Printer className="h-12 w-12 text-accent-cyan animate-bounce mb-4" />
          <h3 className="text-foreground font-bold mb-1">Receiptify TikTok ready!</h3>
          <p className="text-muted text-[11px] max-w-xs leading-normal">
            Bản hóa đơn thu ngân tóm tắt đầy đủ chỉ số xem, thả tim, repost và xả tiền mua sắm đã được xuất bản.
          </p>
        </div>
        <Link href={`/receipt/${recapId}`} className="inline-block bg-accent-cyan hover:bg-[#1fdad5] text-background px-6 py-2.5 font-bold rounded-sm text-xs transition-colors">
          Xem Hóa Đơn Tóm Tắt
        </Link>
      </div>
      <div className="text-[10px] text-muted">
        RECEIPT_BILL_TEASER
      </div>
    </div>,

    // 16. Persona Reveal
    <div key="persona" className="flex flex-col justify-between h-full p-8 font-mono bg-gradient-to-b from-[#0d0d0d] to-[#050505] text-left relative overflow-hidden">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">16 // PERSONA REVEAL</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Cá Tính Của Bạn</h2>
      </div>
      <div className="my-auto space-y-6">
        <div className="border border-panel-border bg-[#0a0a0a] p-5 rounded-sm">
          <span className="text-xs text-accent-red font-bold uppercase tracking-wider">{stats.persona.subtitle || 'Cá tính lướt dạo'}</span>
          <p className="text-3xl font-extrabold text-foreground tracking-tight leading-none mt-2">
            {stats.persona.title}
          </p>
          <p className="text-xs text-muted leading-relaxed mt-4">
            {stats.persona.description}
          </p>
        </div>
      </div>
      <div className="text-[10px] text-muted">
        PERSONA_CLASSIFIER
      </div>
    </div>,

    // 17. Final Share Slide
    <div key="final" className="flex flex-col justify-between h-full p-8 font-mono bg-panel text-left">
      <div className="space-y-2">
        <span className="text-xs text-accent-cyan tracking-widest font-bold">17 // END OF DECK</span>
        <h2 className="text-xl font-bold border-b border-panel-border pb-2 text-foreground">Recap Completed</h2>
      </div>
      <div className="my-auto space-y-6 text-center">
        <p className="text-xs text-muted">BẠN ĐÃ ĐI HẾT BẢN THỐNG KÊ CHI TIẾT</p>
        <div className="flex flex-col space-y-3">
          <Link href={`/receipt/${recapId}`} className="flex items-center justify-center space-x-2 bg-accent-cyan hover:bg-[#1fdad5] text-background py-2.5 font-bold rounded-sm text-xs transition-colors">
            <Printer className="h-4 w-4" />
            <span>Xem & In Hóa Đơn</span>
          </Link>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/recap/${recapId}`);
              alert('Copied shareable link to clipboard!');
            }}
            className="flex items-center justify-center space-x-2 border border-panel-border hover:border-accent-green hover:text-accent-green py-2.5 font-bold rounded-sm text-xs transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Copy Link Chia Sẻ</span>
          </button>
          {!isDemo && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center justify-center space-x-2 border border-accent-red/30 hover:border-accent-red hover:text-accent-red py-2.5 font-bold rounded-sm text-xs transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Xóa Vĩnh Viễn Dữ Liệu</span>
            </button>
          )}
        </div>
      </div>
      <div className="text-[10px] text-muted text-center">
        RecapAnytime. Built with Privacy.
      </div>
    </div>
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#050505]">
      {/* Controls Overlay */}
      <div className="w-full max-w-xl flex items-center justify-between mb-4 font-mono text-xs text-muted no-print">
        <Link href="/" className="flex items-center space-x-2 hover:text-foreground">
          <Terminal className="h-4 w-4 text-accent-cyan" />
          <span className="font-bold">Home</span>
        </Link>

        {/* Aspect Ratio Switcher */}
        <div className="flex space-x-2 bg-panel border border-panel-border p-1 rounded-sm">
          <button
            onClick={() => setAspect('story')}
            className={`p-1.5 rounded-sm ${aspect === 'story' ? 'bg-[#1a1a1a] text-accent-cyan' : ''}`}
            title="9:16 (Story)"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setAspect('feed')}
            className={`p-1.5 rounded-sm ${aspect === 'feed' ? 'bg-[#1a1a1a] text-accent-green' : ''}`}
            title="3:4 (Feed)"
          >
            <Smartphone className="h-3.5 w-3.5 rotate-90" />
          </button>
          <button
            onClick={() => setAspect('wide')}
            className={`p-1.5 rounded-sm ${aspect === 'wide' ? 'bg-[#1a1a1a] text-accent-red' : ''}`}
            title="16:9 (Wide)"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          onClick={() => setIsPaused((p) => !p)}
          className="hover:text-foreground"
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Slide Card Container */}
      <div className="relative flex items-center justify-center w-full">
        {/* Left Nav trigger */}
        <button
          onClick={handlePrevSlide}
          className="absolute -left-12 lg:-left-16 p-2 text-muted hover:text-foreground hidden md:block"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <div className={`relative bg-panel border border-panel-border rounded-sm overflow-hidden shadow-2xl transition-all duration-300 ${getAspectClass()}`}>
          {/* Progress indicators */}
          <div className="absolute top-3 left-0 right-0 flex px-3 space-x-1 z-20">
            {slides.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-cyan transition-all duration-100 ease-linear"
                  style={{
                    width: idx === slide ? `${slideProgress}%` : idx < slide ? '100%' : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Slide Deck Screen */}
          <div className="w-full h-full relative" onClick={(e) => {
            // Touch/click areas: right 60% is Next, left 40% is Prev
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX > rect.width * 0.4) {
              handleNextSlide();
            } else {
              handlePrevSlide();
            }
          }}>
            {slides[slide]}
          </div>
        </div>

        {/* Right Nav trigger */}
        <button
          onClick={handleNextSlide}
          className="absolute -right-12 lg:-right-16 p-2 text-muted hover:text-foreground hidden md:block"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      {/* Slide counter footer */}
      <div className="mt-4 font-mono text-xs text-muted">
        SLIDE {slide + 1} OF {slides.length}
      </div>

      {/* Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50 font-mono text-sm">
          <div className="bg-panel border border-panel-border p-6 rounded-sm w-full max-w-sm space-y-4">
            <h3 className="font-bold text-accent-red">Xác Nhận Xóa Dữ Liệu</h3>
            <p className="text-xs text-muted leading-relaxed">
              Vui lòng nhập Mã Xóa (Delete Token) mà bạn nhận được khi tải file lên để xóa vĩnh viễn thống kê này.
            </p>
            <input
              type="text"
              value={deleteTokenInput}
              onChange={(e) => setDeleteTokenInput(e.target.value)}
              placeholder="Nhập mã xóa tại đây"
              className="w-full p-2 bg-[#0c0c0c] border border-panel-border rounded-sm text-foreground focus:outline-none focus:border-accent-red font-mono"
            />
            <div className="flex space-x-3 text-xs font-bold pt-2">
              <button
                disabled={deleting}
                onClick={handleDelete}
                className="bg-accent-red text-white px-4 py-2 rounded-sm flex-1 hover:bg-[#e02446] disabled:opacity-50"
              >
                {deleting ? 'Đang xóa...' : 'Xác Nhận Xóa'}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border border-panel-border px-4 py-2 rounded-sm flex-1 hover:bg-[#1a1a1a]"
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
