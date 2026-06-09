'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Upload, Play, ChevronDown, Shield, Zap, Receipt, ArrowRight, Sparkles, Eye, Heart, Search, ShoppingBag, Users, Clock } from 'lucide-react';

/* ═══════════════════════════════════════════════
   MOCK SLIDE DATA — simulates the recap preview
   ═══════════════════════════════════════════════ */
const MOCK_SLIDES = [
  {
    bg: 'from-[#1a0a2e] via-[#16213e] to-[#0a0a0a]',
    accent: '#25f4ee',
    label: 'WATCH STATS',
    bigNumber: '67,302',
    unit: 'videos watched',
    sub: 'Thời gian lướt ước tính: 560 giờ',
    icon: Eye,
  },
  {
    bg: 'from-[#2d0a0a] via-[#1a0a1e] to-[#0a0a0a]',
    accent: '#ff3b5c',
    label: 'ENGAGEMENT',
    bigNumber: '6,000',
    unit: 'likes given',
    sub: 'Bạn thả tim nhiều nhất vào thứ Sáu',
    icon: Heart,
  },
  {
    bg: 'from-[#0a1a0a] via-[#0a2e16] to-[#0a0a0a]',
    accent: '#1db954',
    label: 'SEARCH LOG',
    bigNumber: '2,474',
    unit: 'searches made',
    sub: 'Top: "lofi music", "nextjs api"',
    icon: Search,
  },
  {
    bg: 'from-[#2e1a0a] via-[#1e160a] to-[#0a0a0a]',
    accent: '#fb923c',
    label: 'TIKTOK SHOP',
    bigNumber: '2.4M',
    unit: 'VND spent',
    sub: '25 đơn hàng, 23 hoàn thành',
    icon: ShoppingBag,
  },
  {
    bg: 'from-[#0a0a2e] via-[#160a2e] to-[#0a0a0a]',
    accent: '#a855f7',
    label: 'PERSONA',
    bigNumber: 'Night',
    unit: 'Scroller',
    sub: 'Kẻ Gác Đêm TikTok — Score 8/10',
    icon: Sparkles,
  },
];

/* ═══════════════════════════════════════
   TERMINAL TYPING LINES
   ═══════════════════════════════════════ */
const TERMINAL_LINES = [
  { text: '$ recapanytime init --source tiktok.json', color: 'text-foreground', delay: 0 },
  { text: '→ Parsing watch_history...', color: 'text-accent-cyan', delay: 800 },
  { text: '→ 67,302 videos indexed in 1.2s', color: 'text-accent-cyan', delay: 1600 },
  { text: '→ engagement: 6,000 likes · 732 comments', color: 'text-accent-green', delay: 2400 },
  { text: '→ tiktok_shop: 25 orders (2.4M VND)', color: 'text-accent-orange', delay: 3200 },
  { text: '→ persona_match: NIGHT SCROLLER [8/10]', color: 'text-accent-purple', delay: 4000 },
  { text: '✓ Recap generated → /recap/abc123', color: 'text-accent-red font-bold', delay: 4800 },
];

/* ═══════════════════════════════════════
   FAQ ITEMS
   ═══════════════════════════════════════ */
const FAQ_ITEMS = [
  {
    q: 'RecapAnytime hoạt động như thế nào?',
    a: 'Bạn yêu cầu xuất dữ liệu từ ứng dụng TikTok (dạng JSON), sau đó tải file ZIP hoặc JSON đó lên RecapAnytime. Chúng tôi sẽ phân tích và thống kê thời gian xem, lượt thích, bình luận, và các chỉ số mua sắm của bạn.',
  },
  {
    q: 'Dữ liệu của tôi có an toàn không?',
    a: 'Hoàn toàn an toàn. File dữ liệu thô của bạn được xử lý hoàn toàn trong bộ nhớ (RAM) và không bao giờ lưu trữ vĩnh viễn trên máy chủ. Chúng tôi chỉ lưu giữ các số liệu thống kê tổng hợp đã được khử nhạy cảm.',
  },
  {
    q: 'Làm thế nào để lấy được dữ liệu TikTok?',
    a: 'Vào TikTok > Hồ sơ > Cài đặt và quyền riêng tư > Tài khoản > Tải về dữ liệu của bạn. Chọn định dạng "JSON" rồi gửi yêu cầu. TikTok sẽ chuẩn bị file trong vòng 1-3 ngày.',
  },
  {
    q: 'Tôi có thể chia sẻ hoặc xóa kết quả?',
    a: 'Có. Mỗi kết quả recap có một liên kết công khai đã được lọc thông tin nhạy cảm và một Mã Xóa (Delete Token) riêng tư hiển thị một lần duy nhất. Bạn có thể sử dụng mã này để xóa vĩnh viễn dữ liệu bất cứ lúc nào.',
  },
];

/* ═══════════════════════════════════════
   STEP DATA
   ═══════════════════════════════════════ */
const STEPS = [
  { num: '01', cmd: 'open tiktok://profile', desc: 'Mở ứng dụng TikTok, vào Hồ sơ cá nhân' },
  { num: '02', cmd: 'navigate settings > privacy', desc: 'Cài đặt và quyền riêng tư → Tài khoản' },
  { num: '03', cmd: 'select --format json', desc: 'Chọn "Tải về dữ liệu" → Định dạng JSON' },
  { num: '04', cmd: 'request data --wait 24h', desc: 'Gửi yêu cầu, chờ TikTok chuẩn bị (1-3 ngày)' },
  { num: '05', cmd: 'download user_data.zip', desc: 'Tải file ZIP về máy khi sẵn sàng' },
  { num: '06', cmd: 'upload --to recapanytime.app', desc: 'Tải lên RecapAnytime và nhận recap ngay!' },
];

/* ═══════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════ */
export default function Home() {
  const [terminalStep, setTerminalStep] = useState(0);
  const [mockSlide, setMockSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Terminal typing effect
  useEffect(() => {
    const maxStep = TERMINAL_LINES.length;
    if (terminalStep >= maxStep) return;
    const nextDelay = TERMINAL_LINES[terminalStep]?.delay || 800;
    const baseDelay = terminalStep === 0 ? 600 : nextDelay - (TERMINAL_LINES[terminalStep - 1]?.delay || 0);
    const timer = setTimeout(() => {
      setTerminalStep((prev) => prev + 1);
    }, baseDelay);
    return () => clearTimeout(timer);
  }, [terminalStep]);

  // Mock slide auto-cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setMockSlide((prev) => (prev + 1) % MOCK_SLIDES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = MOCK_SLIDES[mockSlide];
  const SlideIcon = currentSlide.icon;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030303]">
      {/* ── Ambient Orbs ── */}
      <div className="orb-cyan" style={{ top: '-200px', right: '-150px' }} />
      <div className="orb-red" style={{ top: '300px', left: '-200px' }} />
      <div className="orb-green" style={{ bottom: '-100px', right: '20%' }} />

      {/* ── Background Grid ── */}
      <div className="fixed inset-0 bg-dot-grid opacity-40 pointer-events-none" />

      {/* ═══════════════════════════════════
          HEADER / NAV
          ═══════════════════════════════════ */}
      <header className="relative z-30 border-b border-panel-border/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-accent-red rounded-full" />
            <span className="font-mono text-sm font-bold tracking-tight">
              RecapAnytime<span className="text-muted ml-1.5 font-normal">v1.0.0</span>
            </span>
          </div>
          <nav className="flex items-center space-x-6 font-mono text-xs text-muted">
            <Link href="/upload" className="hover:text-accent-cyan transition-colors duration-200 flex items-center gap-1.5">
              <Upload className="h-3 w-3" />
              upload
            </Link>
            <Link href="/demo" className="hover:text-accent-red transition-colors duration-200 flex items-center gap-1.5">
              <Play className="h-3 w-3" />
              demo
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 text-muted/40">
              <div className="status-led status-led-green" />
              <span>online</span>
            </div>
          </nav>
        </div>
      </header>

      {/* ═══════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

          {/* ── Left: Text + Terminal ── */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-surface border border-panel-border px-3 py-1.5 font-mono text-[11px] text-muted">
              <div className="status-led status-led-cyan" />
              <span>POWERED BY YOUR DATA EXPORT</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-[2.75rem] md:text-[3.5rem] lg:text-[3.8rem] font-display font-bold tracking-tight leading-[1.05]">
                Your TikTok,{' '}
                <br className="hidden sm:inline" />
                <span className="shimmer-text">wrapped anytime.</span>
              </h1>
              <p className="text-muted text-base md:text-lg leading-relaxed max-w-lg font-mono text-[13px] md:text-sm">
                Upload your TikTok data export and turn months of scrolling, searching, reposting, shopping, and live activity into a developer-style recap — với phong cách Spotify Wrapped.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/upload"
                className="group flex items-center justify-center gap-2.5 bg-accent-red hover:bg-[#e0224a] text-white px-7 py-3.5 font-display font-semibold text-sm transition-all duration-200 shadow-neon-red hover:shadow-[0_0_30px_rgba(255,59,92,0.25)]"
              >
                <Upload className="h-4 w-4" />
                Start your recap
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
              <Link
                href="/demo"
                className="flex items-center justify-center gap-2.5 border border-panel-border hover:border-accent-cyan/50 bg-surface hover:bg-surface-hover px-7 py-3.5 font-display font-semibold text-sm text-muted hover:text-accent-cyan transition-all duration-200"
              >
                <Play className="h-4 w-4" />
                Try demo
              </Link>
            </div>

            {/* Mini Terminal Preview */}
            <div className="relative bg-[#0a0a0c] border border-panel-border overflow-hidden shadow-2xl">
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-panel-border bg-[#080809]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-red/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-yellow/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-green/60" />
                </div>
                <span className="font-mono text-[10px] text-muted/50">recapanytime — terminal</span>
                <div />
              </div>
              {/* Terminal body */}
              <div className="p-4 space-y-1.5 font-mono text-xs min-h-[180px]">
                {TERMINAL_LINES.map((line, idx) => (
                  idx < terminalStep && (
                    <p key={idx} className={`${line.color} animate-fade-in`}>
                      {line.text}
                    </p>
                  )
                ))}
                {terminalStep < TERMINAL_LINES.length && (
                  <p className="text-muted terminal-cursor">&nbsp;</p>
                )}
              </div>
              {/* Scanner line */}
              <div className="scanner-line" />
            </div>
          </div>

          {/* ── Right: Mock Phone Preview ── */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative animate-float">
              {/* Phone shadow glow */}
              <div className="absolute inset-0 blur-3xl opacity-20" style={{ background: currentSlide.accent }} />

              {/* Phone Frame */}
              <div className="phone-frame relative w-[280px] md:w-[300px] bg-[#0a0a0a]">
                <div className="phone-notch" />

                {/* Slide Progress Dots */}
                <div className="flex gap-1.5 justify-center py-3 px-6">
                  {MOCK_SLIDES.map((_, idx) => (
                    <div
                      key={idx}
                      className="h-1 flex-1 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.1)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: idx === mockSlide ? '100%' : idx < mockSlide ? '100%' : '0%',
                          background: idx <= mockSlide ? currentSlide.accent : 'transparent',
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Slide Content */}
                <div
                  className={`relative bg-gradient-to-b ${currentSlide.bg} px-6 pb-8 pt-4 min-h-[380px] md:min-h-[420px] flex flex-col justify-between slide-enter`}
                  key={mockSlide}
                >
                  <div className="crt-overlay" />

                  {/* Label */}
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] opacity-60" style={{ color: currentSlide.accent }}>
                    <span>{String(mockSlide + 1).padStart(2, '0')}</span>
                    <span className="w-4 h-px" style={{ background: currentSlide.accent }} />
                    <span>{currentSlide.label}</span>
                  </div>

                  {/* Main stat */}
                  <div className="space-y-2 my-auto py-6">
                    <SlideIcon className="h-8 w-8 mb-4 opacity-50" style={{ color: currentSlide.accent }} />
                    <p className="text-[2.5rem] md:text-5xl font-display font-bold tracking-tight leading-none text-foreground">
                      {currentSlide.bigNumber}
                    </p>
                    <p className="text-lg font-display font-medium" style={{ color: currentSlide.accent }}>
                      {currentSlide.unit}
                    </p>
                    <p className="text-xs font-mono text-muted/70 leading-relaxed mt-3">
                      {currentSlide.sub}
                    </p>
                  </div>

                  {/* Swipe indicator */}
                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-muted/30">
                    <span>swipe</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>

                {/* Phone bottom bar */}
                <div className="h-6 bg-[#0a0a0a] flex justify-center items-center">
                  <div className="w-24 h-1 bg-white/10 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FEATURES GRID
          ═══════════════════════════════════ */}
      <section className="relative z-10 border-t border-panel-border/50">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-1 h-6 bg-accent-cyan" />
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              What you get
            </h2>
            <span className="font-mono text-[10px] text-muted ml-2">// FEATURES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-panel-border/30">
            {[
              {
                icon: Shield,
                accent: '#1db954',
                title: 'Privacy First',
                desc: 'Raw data is parsed in-memory and immediately destroyed. Only aggregate statistics are stored. Your file never touches disk.',
                tag: 'SECURE',
              },
              {
                icon: Zap,
                accent: '#25f4ee',
                title: 'Rich Insights',
                desc: 'Watch sessions, streak stats, comment sentiment, shares, search keywords, live streams, and shopping expenditures.',
                tag: 'ANALYTICS',
              },
              {
                icon: Receipt,
                accent: '#ff3b5c',
                title: 'Receiptify Format',
                desc: 'Thermal receipt-style summary billing your stats as a shareable, printable hóa đơn recap PNG.',
                tag: 'EXPORT',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-[#060607] p-8 md:p-10 hover:bg-surface transition-colors duration-300 cursor-default"
              >
                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-8 h-px" style={{ background: feature.accent }} />
                <div className="absolute top-0 left-0 h-8 w-px" style={{ background: feature.accent }} />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-6 w-6 transition-colors duration-300" style={{ color: feature.accent }} />
                    <span className="font-mono text-[9px] tracking-[0.15em] px-2 py-0.5 border" style={{ color: feature.accent, borderColor: `${feature.accent}30` }}>
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-foreground text-lg">{feature.title}</h3>
                  <p className="font-mono text-xs text-muted leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          HOW TO GET DATA — CLI WALKTHROUGH
          ═══════════════════════════════════ */}
      <section className="relative z-10 border-t border-panel-border/50">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-accent-green" />
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              How to get your data
            </h2>
            <span className="font-mono text-[10px] text-muted ml-2">// GUIDE</span>
          </div>
          <p className="font-mono text-xs text-muted mb-10 ml-4 max-w-lg">
            TikTok provides a formal data download tool. Follow these steps to request your machine-readable JSON archive:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="group relative bg-[#060607] border border-panel-border hover:border-accent-green/30 p-5 transition-all duration-300"
              >
                {/* Step number */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] font-bold text-accent-green/60 tracking-wider">{step.num}</span>
                  <div className="h-px flex-1 bg-panel-border group-hover:bg-accent-green/20 transition-colors duration-300" />
                </div>

                {/* Command */}
                <p className="font-mono text-[11px] text-accent-cyan/80 mb-2 select-all">
                  <span className="text-accent-green/50">$</span> {step.cmd}
                </p>

                {/* Description */}
                <p className="font-mono text-xs text-muted/80 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FAQ — ACCORDION
          ═══════════════════════════════════ */}
      <section className="relative z-10 border-t border-panel-border/50">
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-24">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-6 bg-accent-red" />
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              FAQ
            </h2>
            <span className="font-mono text-[10px] text-muted ml-2">// QUESTIONS</span>
          </div>

          <div className="space-y-px">
            {FAQ_ITEMS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#060607] border border-panel-border hover:border-panel-border/80 transition-colors duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`status-led ${openFaq === idx ? 'status-led-cyan' : 'status-led-red'} transition-colors`} />
                    <span className="font-display font-semibold text-sm text-foreground">{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-muted flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-accent-cyan' : ''}`}
                  />
                </button>
                <div
                  className="faq-answer"
                  style={{
                    maxHeight: openFaq === idx ? '200px' : '0px',
                    opacity: openFaq === idx ? 1 : 0,
                  }}
                >
                  <div className="px-6 pb-5 pl-[42px]">
                    <p className="font-mono text-xs text-muted leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FOOTER
          ═══════════════════════════════════ */}
      <footer className="relative z-10 border-t border-panel-border/50">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <div className="w-1.5 h-1.5 bg-accent-red rounded-full" />
            <span>© 2026 RecapAnytime</span>
            <span className="text-panel-border">|</span>
            <span>Built for TikTok power users</span>
          </div>
          <div className="font-mono text-[10px] text-muted/40">
            Not affiliated with ByteDance or TikTok.
          </div>
        </div>
      </footer>
    </div>
  );
}
