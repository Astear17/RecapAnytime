'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Upload,
  Play,
  ChevronDown,
  Shield,
  Zap,
  Receipt,
  ArrowRight,
  Sparkles,
  Eye,
  Heart,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { DEMO_STATS } from '@/lib/recap/demo-stats';
import { getPreviewMetadata } from '@/lib/recap/build-slides';

const PREVIEW_SLIDES = getPreviewMetadata(DEMO_STATS, 'tiktok');
const PREVIEW_ICONS = [Eye, Heart, Search, ShoppingBag, Sparkles];

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

const STEPS = [
  { num: '01', title: 'Mở TikTok', desc: 'Vào Hồ sơ cá nhân của bạn', color: '#ff3b5c' },
  { num: '02', title: 'Cài đặt', desc: 'Quyền riêng tư → Tài khoản', color: '#25f4ee' },
  { num: '03', title: 'Tải dữ liệu', desc: 'Chọn định dạng JSON', color: '#1db954' },
  { num: '04', title: 'Chờ TikTok', desc: 'File sẵn sàng trong 1–3 ngày', color: '#a855f7' },
  { num: '05', title: 'Tải ZIP về', desc: 'Lưu file user_data.zip', color: '#fb923c' },
  { num: '06', title: 'Upload lên đây', desc: 'Nhận recap ngay lập tức', color: '#facc15' },
];

const FEATURES = [
  {
    icon: Shield,
    gradient: 'from-[#0a2e16] to-[#0a1a0a]',
    accent: '#1db954',
    title: 'Privacy First',
    desc: 'Dữ liệu thô xử lý trong RAM, chỉ lưu thống kê tổng hợp đã khử nhạy cảm.',
  },
  {
    icon: Zap,
    gradient: 'from-[#0a1a2e] to-[#0a0a1a]',
    accent: '#25f4ee',
    title: 'Rich Insights',
    desc: 'Watch sessions, streak, comments, shares, search keywords, live & shopping.',
  },
  {
    icon: Receipt,
    gradient: 'from-[#2d0a0a] to-[#1a0a0a]',
    accent: '#ff3b5c',
    title: 'Receiptify',
    desc: 'Hóa đơn recap dạng thermal receipt — chia sẻ hoặc in ra giấy.',
  },
];

export default function Home() {
  const [mockSlide, setMockSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMockSlide((prev) => (prev + 1) % PREVIEW_SLIDES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = PREVIEW_SLIDES[mockSlide];
  const SlideIcon = PREVIEW_ICONS[mockSlide];

  return (
    <div className="relative min-h-screen overflow-hidden hero-mesh">
      <div className="orb-red" style={{ top: '-180px', right: '-120px' }} />
      <div className="orb-cyan" style={{ top: '40%', left: '-160px' }} />
      <div className="orb-purple" style={{ bottom: '10%', right: '10%' }} />

      {/* Header */}
      <header className="relative z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-lg font-bold tracking-tight">
            Recap<span className="text-accent-red">Anytime</span>
          </span>
          <nav className="flex items-center gap-4">
            <Link
              href="/upload"
              className="font-display text-sm font-medium text-muted hover:text-foreground transition-colors hidden sm:block"
            >
              Upload
            </Link>
            <Link
              href="/demo"
              className="btn-wrapped-secondary text-foreground px-4 py-2 rounded-full font-display text-sm font-medium flex items-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              Demo
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] font-mono text-[11px] text-muted">
              <span className="status-led status-led-cyan" />
              YOUR DATA. YOUR RECAP.
            </div>

            <div className="space-y-5">
              <h1 className="text-[2.75rem] md:text-[3.75rem] lg:text-[4rem] font-display font-bold tracking-tight leading-[1.02]">
                Your TikTok,
                <br />
                <span className="shimmer-text">wrapped anytime.</span>
              </h1>
              <p className="text-muted text-base md:text-lg leading-relaxed max-w-md font-sans">
                Biến dữ liệu export TikTok thành recap đầy màu sắc — phong cách Spotify Wrapped gặp YouTube Music Recap.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/upload"
                className="group btn-wrapped-primary flex items-center justify-center gap-2.5 text-white px-8 py-4 rounded-full font-display font-semibold text-sm"
              >
                <Upload className="h-4 w-4" />
                Bắt đầu recap
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
              <Link
                href="/demo"
                className="btn-wrapped-secondary flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-display font-semibold text-sm text-foreground"
              >
                <Play className="h-4 w-4" />
                Xem demo
              </Link>
            </div>

            {/* Quick stats strip */}
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { label: 'Up to 17 slides', color: '#ff3b5c' },
                { label: 'Privacy-first', color: '#1db954' },
                { label: 'Receipt export', color: '#25f4ee' },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className="font-mono text-[10px] px-3 py-1.5 rounded-full border border-white/[0.08]"
                  style={{ color: tag.color }}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* Phone preview */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative animate-float">
              <div
                className="absolute inset-0 blur-3xl opacity-40 rounded-full animate-glow-pulse"
                style={{ background: currentSlide.accent }}
              />

              <div className="phone-frame relative w-[280px] md:w-[300px] bg-[#0a0a0a]">
                <div className="phone-notch" />

                <div className="flex gap-1 justify-center py-3 px-5">
                  {PREVIEW_SLIDES.map((s, idx) => (
                    <div key={idx} className="h-[3px] flex-1 rounded-full overflow-hidden bg-white/10">
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

                <div
                  className={`relative bg-gradient-to-br ${currentSlide.gradient} px-6 pb-8 pt-4 min-h-[400px] md:min-h-[440px] flex flex-col justify-between slide-enter`}
                  key={mockSlide}
                >
                  <div className="wrapped-grain absolute inset-0 pointer-events-none" />

                  <div
                    className="relative z-10 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase opacity-70"
                    style={{ color: currentSlide.accent }}
                  >
                    <span>{String(mockSlide + 1).padStart(2, '0')}</span>
                    <span className="w-4 h-px" style={{ background: currentSlide.accent }} />
                    <span>{currentSlide.label}</span>
                  </div>

                  <div className="relative z-10 space-y-2 my-auto py-6">
                    <SlideIcon className="h-9 w-9 mb-3" style={{ color: currentSlide.accent }} />
                    <p className="text-[2.5rem] md:text-[2.75rem] font-display font-bold tracking-tight leading-none text-foreground stat-glow">
                      {currentSlide.bigNumber}
                    </p>
                    <p className="text-lg font-display font-semibold" style={{ color: currentSlide.accent }}>
                      {currentSlide.unit}
                    </p>
                    <p className="text-[11px] font-mono text-foreground/45 leading-relaxed mt-3">
                      {currentSlide.sub}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center justify-center gap-2 text-[10px] font-mono text-foreground/25">
                    <span>tap to continue</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>

                <div className="h-5 bg-[#0a0a0a] flex justify-center items-center">
                  <div className="w-20 h-1 bg-white/10 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Mọi thứ bạn cần
          </h2>
          <p className="font-mono text-xs text-muted mb-12 max-w-md">
            Recap đầy đủ, bảo mật, và có thể chia sẻ — không cần chờ cuối năm.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((feature, idx) => (
              <div
                key={feature.title}
                className={`wrapped-card p-8 bg-gradient-to-br ${feature.gradient} group`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${feature.accent}, transparent)` }} />
                <feature.icon className="h-7 w-7 mb-5 transition-transform duration-300 group-hover:scale-110" style={{ color: feature.accent }} />
                <h3 className="font-display font-bold text-xl text-foreground mb-2">{feature.title}</h3>
                <p className="font-sans text-sm text-foreground/55 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to */}
      <section className="relative z-10 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Lấy dữ liệu TikTok
          </h2>
          <p className="font-mono text-xs text-muted mb-12 max-w-lg">
            TikTok cung cấp công cụ tải dữ liệu chính thức. Làm theo 6 bước sau:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STEPS.map((step, idx) => (
              <div
                key={step.num}
                className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:bg-white/[0.05]"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: step.color }} />
                <span
                  className="font-display text-4xl font-bold opacity-20 group-hover:opacity-50 transition-opacity duration-300"
                  style={{ color: step.color }}
                >
                  {step.num}
                </span>
                <h3 className="font-display font-bold text-lg text-foreground mt-2 mb-1">{step.title}</h3>
                <p className="font-sans text-sm text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto px-6 py-20 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-10">
            Câu hỏi thường gặp
          </h2>

          <div className="space-y-2">
            {FAQ_ITEMS.map((faq, idx) => (
              <div
                key={idx}
                className={`faq-item rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden ${openFaq === idx ? 'open' : ''}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                >
                  <span className="font-display font-semibold text-sm text-foreground">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className="faq-answer"
                  style={{
                    maxHeight: openFaq === idx ? '200px' : '0px',
                    opacity: openFaq === idx ? 1 : 0,
                  }}
                >
                  <div className="px-6 pb-5">
                    <p className="font-sans text-sm text-muted leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold text-sm">
            Recap<span className="text-accent-red">Anytime</span>
          </span>
          <p className="font-mono text-[10px] text-muted/50">
            © 2026 · Not affiliated with ByteDance or TikTok
          </p>
        </div>
      </footer>
    </div>
  );
}
