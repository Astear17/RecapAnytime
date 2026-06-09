'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, Upload, Play, HelpCircle, Shield, ChevronDown, Check } from 'lucide-react';

export default function Home() {
  const [terminalStep, setTerminalStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTerminalStep((prev) => (prev < 5 ? prev + 1 : 5));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const faqItems = [
    {
      q: 'RecapAnytime hoạt động như thế nào?',
      a: 'Bạn yêu cầu xuất dữ liệu từ ứng dụng TikTok (dạng JSON), sau đó tải file ZIP hoặc JSON đó lên RecapAnytime. Chúng tôi sẽ phân tích và thống kê thời gian xem, lượt thích, bình luận, và các chỉ số mua sắm của bạn.'
    },
    {
      q: 'Dữ liệu của tôi có an toàn không?',
      a: 'Hoàn toàn an toàn. File dữ liệu thô của bạn được xử lý hoàn toàn trong bộ nhớ (RAM) và không bao giờ lưu trữ vĩnh viễn trên máy chủ. Chúng tôi chỉ lưu giữ các số liệu thống kê tổng hợp đã được khử nhạy cảm.'
    },
    {
      q: 'Làm thế nào để lấy được dữ liệu TikTok của tôi?',
      a: 'Vào TikTok > Hồ sơ > Cài đặt và quyền riêng tư > Tài khoản > Tải về dữ liệu của bạn. Chọn định dạng "JSON" rồi gửi yêu cầu. TikTok sẽ chuẩn bị file trong vòng 1-3 ngày.'
    },
    {
      q: 'Tôi có thể chia sẻ hoặc xóa kết quả được không?',
      a: 'Có. Mỗi kết quả recap có một liên kết công khai đã được lọc thông tin nhạy cảm và một Mã Xóa (Delete Token) riêng tư được hiển thị một lần duy nhất. Bạn có thể sử dụng mã này để xóa vĩnh viễn dữ liệu của mình bất cứ lúc nào.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-24">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-panel-border pb-6 mb-12">
        <div className="flex items-center space-x-3">
          <Terminal className="h-6 w-6 text-accent-cyan" />
          <span className="font-bold tracking-tight text-lg">RecapAnytime <span className="text-accent-red">v1.0.0</span></span>
        </div>
        <div className="flex space-x-4 text-sm font-mono">
          <Link href="/upload" className="hover:text-accent-cyan transition-colors">/upload</Link>
          <Link href="/demo" className="hover:text-accent-red transition-colors">/demo</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="space-y-12">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
            Your TikTok, <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent-red to-accent-green">
              wrapped anytime.
            </span>
          </h1>
          <p className="text-muted max-w-xl text-base md:text-lg leading-relaxed font-mono">
            Upload your TikTok data export and turn months of scrolling, searching, reposting, shopping, and live activity into a developer-style recap.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4 justify-center md:justify-start">
            <Link href="/upload" className="flex items-center justify-center space-x-2 bg-accent-red hover:bg-[#e02446] text-white px-6 py-3 font-semibold rounded-sm transition-all shadow-[0_4px_14px_rgba(255,59,92,0.3)] font-mono">
              <Upload className="h-4 w-4" />
              <span>Start recap</span>
            </Link>
            <Link href="/demo" className="flex items-center justify-center space-x-2 border border-panel-border hover:border-accent-cyan bg-panel px-6 py-3 font-semibold rounded-sm transition-all font-mono">
              <Play className="h-4 w-4 text-accent-cyan" />
              <span>Try demo</span>
            </Link>
          </div>
        </div>

        {/* Live Terminal Preview */}
        <section className="bg-panel border border-panel-border rounded-sm overflow-hidden font-mono text-sm shadow-2xl">
          <div className="bg-[#121212] px-4 py-2 flex items-center justify-between border-b border-panel-border">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-accent-red/40" />
              <div className="w-3 h-3 rounded-full bg-accent-green/40" />
              <div className="w-3 h-3 rounded-full bg-accent-cyan/40" />
            </div>
            <span className="text-xs text-muted">terminal - preview</span>
          </div>
          <div className="p-5 space-y-2 text-muted min-h-[160px]">
            <p className="text-foreground"><span className="text-accent-green">$</span> recapanytime parse user_data_tiktok.json</p>
            {terminalStep >= 1 && <p className="text-accent-cyan">&gt; watch_history: detected (67,302 videos)</p>}
            {terminalStep >= 2 && <p className="text-accent-green">&gt; tiktok_shop: detected (25 orders, total 1.4M VND)</p>}
            {terminalStep >= 3 && <p className="text-accent-red">&gt; searches_detected: 2,474 items [Category: tech, shopping]</p>}
            {terminalStep >= 4 && <p className="text-yellow-400">&gt; persona_calculated: NIGHT SCROLLER / SHOPAHOLIC</p>}
            {terminalStep >= 5 && (
              <p className="text-foreground font-bold terminal-cursor">
                &gt; recap_receipt: READY. Open http://localhost:3000/recap/abc123
              </p>
            )}
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 font-mono">
          <div className="border border-panel-border p-6 bg-panel/50 rounded-sm">
            <Shield className="h-8 w-8 text-accent-green mb-4" />
            <h3 className="font-bold text-foreground mb-2">Privacy First</h3>
            <p className="text-muted text-xs leading-relaxed">
              We never save raw files on disk. Uploaded data is parsed in-memory and immediately destroyed. We only store aggregate statistics.
            </p>
          </div>
          <div className="border border-panel-border p-6 bg-panel/50 rounded-sm">
            <Terminal className="h-8 w-8 text-accent-cyan mb-4" />
            <h3 className="font-bold text-foreground mb-2">Rich Insights</h3>
            <p className="text-muted text-xs leading-relaxed">
              Analyze watch sessions, streak statistics, comment sentiment, shares, top search keywords, live streams, and order expenditures.
            </p>
          </div>
          <div className="border border-panel-border p-6 bg-panel/50 rounded-sm">
            <Upload className="h-8 w-8 text-accent-red mb-4" />
            <h3 className="font-bold text-foreground mb-2">Receiptify Format</h3>
            <p className="text-muted text-xs leading-relaxed">
              Get a thermal receipt-style summary billing of your user stats ("hóa đơn recap") that you can export as clean PNGs to share.
            </p>
          </div>
        </section>

        {/* How to Get Data */}
        <section id="guide" className="space-y-6 border-t border-panel-border pt-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight font-mono">How to Request Your Data</h2>
            <p className="text-muted text-sm font-mono">
              TikTok provides a formal data download tool. Here is how to request your machine-readable JSON archive:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {[
              '1. Mở ứng dụng TikTok trên điện thoại.',
              '2. Vào trang Hồ sơ cá nhân > Menu ☰ ở góc trên bên phải.',
              '3. Chọn Cài đặt và quyền riêng tư (Settings and privacy) > Tài khoản (Account).',
              '4. Nhấp chọn Tải về dữ liệu của bạn (Download your data).',
              '5. QUAN TRỌNG: Chọn định dạng JSON (Machine-readable) thay vì TXT.',
              '6. Nhấp nút Yêu cầu dữ liệu (Request data).',
              '7. Chờ TikTok chuẩn bị dữ liệu (thường từ 24h - 48h).',
              '8. Khi file sẵn sàng ở tab "Tải về dữ liệu", tải ZIP về máy và tải lên đây.'
            ].map((step, idx) => (
              <div key={idx} className="flex items-start space-x-3 bg-panel p-3 border border-panel-border rounded-sm">
                <span className="text-accent-red font-bold text-sm">0{idx + 1}</span>
                <p className="text-foreground leading-normal">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-4 border-t border-panel-border pt-12">
          <h2 className="text-2xl font-bold font-mono">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqItems.map((faq, idx) => (
              <div key={idx} className="border border-panel-border bg-panel/30 rounded-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between font-mono font-semibold text-sm text-foreground hover:bg-panel transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 border-t border-panel-border text-muted text-xs leading-relaxed font-mono">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-panel-border mt-24 pt-6 text-center text-xs text-muted font-mono">
        <p>© 2026 RecapAnytime. Built for TikTok power users. Not affiliated with ByteDance or TikTok.</p>
      </footer>
    </div>
  );
}
