'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, ChevronLeft, Download, ImageIcon, Share2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { ReceiptData } from '@recapanytime/shared';
import { exportReceiptAsPng } from '@/lib/export-receipt';
import { showToast } from '@/lib/toast';

const DEMO_RECEIPT: ReceiptData = {
  receiptId: 'RC-20260609-8472',
  generatedAt: '2026-06-09T16:26:00.000Z',
  accountLabel: '@chienthan.tiktok',
  periodStart: '2025-12-08',
  periodEnd: '2026-06-08',
  lineItems: [
    { label: 'WATCHED VIDEOS', value: 67302 },
    { label: 'EST. WATCH TIME', value: '560h 51m' },
    { label: 'WATCH SESSIONS', value: 2470 },
    { label: 'LIKED VIDEOS', value: 6000 },
    { label: 'COMMENTS', value: 732 },
    { label: 'SHARES', value: 3560 },
    { label: 'REPOSTS', value: 10640 },
    { label: 'SEARCHES', value: 2474 },
    { label: 'LIVE SESSIONS', value: 394 },
  ],
  spendingLines: [
    { label: 'SHOP ORDERS', value: 25 },
    { label: 'COMPLETED ORDERS', value: 23 },
    { label: 'EST. SPEND', value: '2.456.000 VND' },
  ],
  topSearches: [
    { term: 'lofi music', count: 48 },
    { term: 'nextjs api', count: 32 },
    { term: 'review bàn phím cơ', count: 25 },
    { term: 'cách nấu mì ngon', count: 18 },
    { term: 'funny cat memes', count: 14 },
  ],
  persona: {
    id: 'night-scroller',
    title: 'Night Scroller',
    subtitle: 'Kẻ Gác Đêm',
    description: 'Lướt màn hình khi cả thế giới đã ngủ.',
    score: 8,
    reasons: ['Giờ hoạt động mạnh nhất của bạn rơi vào khoảng đêm muộn.'],
  },
  footerText: 'Thank you for scrolling.',
};

export default function ReceiptPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const recapId = params.id as string;
  const isDemo = recapId === 'demo';
  const autoDownload = searchParams.get('download') === '1';

  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const autoDownloaded = useRef(false);

  useEffect(() => {
    if (isDemo) {
      setReceipt(DEMO_RECEIPT);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchApi<{ ok: boolean; receipt: ReceiptData }>(`/api/recap/receipt/${recapId}`)
      .then((res) => {
        if (res.ok) {
          setReceipt(res.receipt);
        } else {
          setError('Receipt not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to load receipt');
      })
      .finally(() => setLoading(false));
  }, [recapId, isDemo]);

  const handleExportPng = useCallback(async () => {
    if (!receiptRef.current || !receipt) return;
    setExporting(true);
    try {
      await exportReceiptAsPng(
        receiptRef.current,
        `recapanytime-receipt-${receipt.receiptId}.png`
      );
    } catch {
      showToast('Không thể xuất ảnh. Thử lại sau.');
    } finally {
      setExporting(false);
    }
  }, [receipt]);

  useEffect(() => {
    if (autoDownload && receipt && receiptRef.current && !autoDownloaded.current) {
      autoDownloaded.current = true;
      const timer = setTimeout(() => handleExportPng(), 600);
      return () => clearTimeout(timer);
    }
  }, [autoDownload, receipt, handleExportPng]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen hero-mesh space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
        <span className="font-mono text-sm text-muted">Đang tải hóa đơn...</span>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen hero-mesh space-y-4 p-4 text-center">
        <p className="font-display text-xl font-bold text-accent-red">Receipt không tìm thấy</p>
        <Link href="/" className="btn-wrapped-primary text-white px-6 py-3 rounded-full font-display text-sm">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-mesh py-12 px-4 flex flex-col items-center justify-center font-mono">
      <div className="w-full max-w-sm flex items-center justify-between mb-6 text-xs text-muted no-print">
        <Link href={`/recap/${recapId}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
          <span className="font-display font-semibold">Về recap</span>
        </Link>
        <div className="flex gap-3">
          <button
            onClick={handleExportPng}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-spotify-green/20 text-spotify-green hover:bg-spotify-green/30 transition-colors font-display font-semibold text-[11px] disabled:opacity-50"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            {exporting ? 'Đang xuất...' : 'Tải PNG'}
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Printer className="h-4 w-4" />
            <span>In</span>
          </button>
        </div>
      </div>

      {autoDownload && (
        <p className="no-print text-xs text-accent-cyan mb-4 font-mono animate-pulse">
          Đang tự động tải ảnh Receiptify...
        </p>
      )}

      <div
        ref={receiptRef}
        id="receipt-export"
        className="receipt-container w-full max-w-sm bg-[#f4f1e8] text-[#111111] p-6 shadow-2xl relative"
        style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
      >
        <div className="text-center space-y-2">
          <h1 className="font-extrabold text-base tracking-wider">RECAPANYTIME RECEIPT</h1>
          <p className="text-[10px] tracking-widest text-[#555555]">TIKTOK DATA SUMMARY · RECEIPTIFY</p>
        </div>

        <div className="border-t border-dashed border-[#888888] my-4" />

        <div className="text-[11px] space-y-1">
          <div className="flex justify-between">
            <span className="text-[#555555]">ACCOUNT</span>
            <span className="font-bold">{receipt.accountLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#555555]">PERIOD</span>
            <span className="font-bold">
              {receipt.periodStart || '—'} → {receipt.periodEnd || '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#555555]">GENERATED</span>
            <span>{new Date(receipt.generatedAt).toLocaleString('vi-VN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#555555]">TICKET ID</span>
            <span>{receipt.receiptId}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-[#888888] my-4" />

        <div className="text-[10px] font-bold flex justify-between text-[#444444]">
          <span>ITEM</span>
          <span>QTY</span>
        </div>
        <div className="border-t border-dashed border-[#aaaaaa] my-1" />

        <div className="space-y-1 text-xs">
          {receipt.lineItems.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{item.label}</span>
              <span className="font-bold">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-[#888888] my-4" />

        <div className="text-[10px] font-bold text-[#444444]">XẢ TIỀN SUMMARY</div>
        <div className="border-t border-dashed border-[#aaaaaa] my-1" />

        <div className="space-y-1 text-xs">
          {receipt.spendingLines.map((line, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{line.label}</span>
              <span className="font-bold">{line.value}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-[#888888] my-4" />

        <div className="text-[10px] font-bold text-[#444444]">TOP SEARCHES</div>
        <div className="border-t border-dashed border-[#aaaaaa] my-1" />
        <div className="space-y-1 text-xs">
          {receipt.topSearches.length > 0 ? (
            receipt.topSearches.map((search, idx) => (
              <div key={idx} className="flex justify-between">
                <span>0{idx + 1}. {search.term}</span>
                <span className="font-bold">{search.count}</span>
              </div>
            ))
          ) : (
            <div className="text-[#888] text-[11px]">No search queries logged.</div>
          )}
        </div>

        <div className="border-t border-dashed border-[#888888] my-4" />

        <div className="text-[10px] font-bold text-[#444444]">PERSONA RESULT</div>
        <div className="border-t border-dashed border-[#aaaaaa] my-1" />
        <div className="text-xs space-y-1 text-center py-2 bg-[#eae7de] border border-[#d6d2c4]">
          <p className="font-extrabold tracking-tight">{receipt.persona.title}</p>
          <p className="text-[10px] text-[#555555]">{receipt.persona.subtitle || 'TikTok User'}</p>
        </div>

        <div className="border-t border-[#111111] my-4" />

        <div className="flex flex-col items-center justify-center space-y-1.5 my-4">
          <div className="w-48 h-8 flex overflow-hidden opacity-90 justify-center">
            {Array.from({ length: 28 }).map((_, idx) => {
              const widths = ['w-0.5', 'w-1', 'w-1.5', 'w-0.5'];
              const width = widths[idx % widths.length];
              const isSpace = idx % 3 === 0;
              return (
                <div
                  key={idx}
                  className={`h-full ${width} ${isSpace ? 'bg-transparent' : 'bg-black'}`}
                />
              );
            })}
          </div>
          <span className="text-[9px] tracking-[6px] text-[#555555]">{receipt.receiptId}</span>
        </div>

        <div className="text-center text-[10px] text-[#444444] mt-6 italic">
          {receipt.footerText}
        </div>
      </div>

      <footer className="mt-8 flex flex-col items-center gap-3 no-print">
        <button
          onClick={handleExportPng}
          disabled={exporting}
          className="btn-wrapped-primary flex items-center gap-2 text-white px-8 py-3 rounded-full font-display font-semibold text-sm disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {exporting ? 'Đang tạo ảnh...' : 'Tải Receiptify (.png)'}
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/recap/${recapId}`);
            showToast('Đã copy link recap!');
          }}
          className="flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" />
          Chia sẻ recap
        </button>
        <p className="text-[10px] text-muted/60 text-center max-w-xs">
          Ảnh PNG 2× resolution — chia sẻ lên story hoặc lưu vào album.
        </p>
      </footer>
    </div>
  );
}
