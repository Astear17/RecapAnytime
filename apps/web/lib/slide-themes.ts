export interface SlideTheme {
  id: string;
  gradient: string;
  accent: string;
  progressColor: string;
}

export const SLIDE_THEMES: SlideTheme[] = [
  { id: 'intro', gradient: 'from-[#1a0a2e] via-[#16213e] to-[#0a0a0a]', accent: '#25f4ee', progressColor: '#25f4ee' },
  { id: 'profile', gradient: 'from-[#2d0a1a] via-[#1a0a1e] to-[#0a0a0a]', accent: '#ff3b5c', progressColor: '#ff3b5c' },
  { id: 'period', gradient: 'from-[#0a1a2e] via-[#0a1628] to-[#0a0a0a]', accent: '#60a5fa', progressColor: '#60a5fa' },
  { id: 'watch-count', gradient: 'from-[#1a0a2e] via-[#16213e] to-[#0a0a0a]', accent: '#a78bfa', progressColor: '#a78bfa' },
  { id: 'watch-time', gradient: 'from-[#0a1a2e] via-[#0a2838] to-[#0a0a0a]', accent: '#25f4ee', progressColor: '#25f4ee' },
  { id: 'sessions', gradient: 'from-[#0a1a0a] via-[#0a2e16] to-[#0a0a0a]', accent: '#1db954', progressColor: '#1db954' },
  { id: 'active-time', gradient: 'from-[#2e1a0a] via-[#1e160a] to-[#0a0a0a]', accent: '#fb923c', progressColor: '#fb923c' },
  { id: 'likes', gradient: 'from-[#2d0a0a] via-[#1a0a1e] to-[#0a0a0a]', accent: '#ff3b5c', progressColor: '#ff3b5c' },
  { id: 'comments', gradient: 'from-[#2e1a0a] via-[#281a0a] to-[#0a0a0a]', accent: '#fbbf24', progressColor: '#fbbf24' },
  { id: 'shares', gradient: 'from-[#0a1a0a] via-[#0a2e16] to-[#0a0a0a]', accent: '#1db954', progressColor: '#1db954' },
  { id: 'reposts', gradient: 'from-[#1a1a0a] via-[#1e1e0a] to-[#0a0a0a]', accent: '#facc15', progressColor: '#facc15' },
  { id: 'searches', gradient: 'from-[#0a1a0a] via-[#0a2e16] to-[#0a0a0a]', accent: '#1db954', progressColor: '#1db954' },
  { id: 'live', gradient: 'from-[#2d0a2e] via-[#1a0a2e] to-[#0a0a0a]', accent: '#e879f9', progressColor: '#e879f9' },
  { id: 'shop', gradient: 'from-[#2e1a0a] via-[#1e160a] to-[#0a0a0a]', accent: '#fb923c', progressColor: '#fb923c' },
  { id: 'receipt-teaser', gradient: 'from-[#0a1a2e] via-[#0a2838] to-[#0a0a0a]', accent: '#25f4ee', progressColor: '#25f4ee' },
  { id: 'persona', gradient: 'from-[#0a0a2e] via-[#160a2e] to-[#0a0a0a]', accent: '#a855f7', progressColor: '#a855f7' },
  { id: 'final', gradient: 'from-[#1a0a2e] via-[#2d0a1a] to-[#0a0a0a]', accent: '#ff3b5c', progressColor: '#ff3b5c' },
];

export const MOCK_PREVIEW_SLIDES = [
  {
    bg: SLIDE_THEMES[3].gradient,
    accent: SLIDE_THEMES[3].accent,
    label: 'WATCH STATS',
    bigNumber: '67,302',
    unit: 'videos watched',
    sub: 'Thời gian lướt ước tính: 560 giờ',
  },
  {
    bg: SLIDE_THEMES[7].gradient,
    accent: SLIDE_THEMES[7].accent,
    label: 'ENGAGEMENT',
    bigNumber: '6,000',
    unit: 'likes given',
    sub: 'Bạn thả tim nhiều nhất vào thứ Sáu',
  },
  {
    bg: SLIDE_THEMES[11].gradient,
    accent: SLIDE_THEMES[11].accent,
    label: 'SEARCH LOG',
    bigNumber: '2,474',
    unit: 'searches made',
    sub: 'Top: "lofi music", "nextjs api"',
  },
  {
    bg: SLIDE_THEMES[13].gradient,
    accent: SLIDE_THEMES[13].accent,
    label: 'TIKTOK SHOP',
    bigNumber: '2.4M',
    unit: 'VND spent',
    sub: '25 đơn hàng, 23 hoàn thành',
  },
  {
    bg: SLIDE_THEMES[15].gradient,
    accent: SLIDE_THEMES[15].accent,
    label: 'PERSONA',
    bigNumber: 'Night',
    unit: 'Scroller',
    sub: 'Kẻ Gác Đêm TikTok — Score 8/10',
  },
];
