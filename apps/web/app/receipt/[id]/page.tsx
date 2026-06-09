'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, ChevronLeft, Download, Terminal } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { ReceiptData } from '@recapanytime/shared';

// Demo receipt data
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
    { label: 'LIVE SESSIONS', value: 394 }
  ],
  spendingLines: [
    { label: 'SHOP ORDERS', value: 25 },
    { label: 'COMPLETED ORDERS', value: 23 },
    { label: 'EST. SPEND', value: '2.456.000 VND' }
  ],
  topSearches: [
    { term: 'lofi music', count: 48 },
    { term: 'nextjs api', count: 32 },
    { term: 'review bàn phím cơ', count: 25 },
    { term: 'cách nấu mì ngon', count: 18 },
    { term: 'funny cat memes', count: 14 }
  ],
  persona: {
    id: 'night-scroller',
    title: 'Night Scroller',
    subtitle: 'Kẻ Gác Đêm',
    description: 'Lướt màn hình khi cả thế giới đã ngủ. Đối với bạn, TikTok thú vị nhất là sau 12 giờ đêm.',
    score: 8,
    reasons: ['Giờ hoạt động mạnh nhất của bạn rơi vào khoảng đêm muộn.']
  },
  footerText: 'Thank you for scrolling.'
};

export default function ReceiptPage() {
  const params = useParams();
  const recapId = params.id as string;
  const isDemo = recapId === 'demo';

  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-mono text-muted space-y-4">
        <Terminal className="h-8 w-8 text-accent-cyan animate-pulse" />
        <span className="terminal-cursor">Printing thermal bill stats...</span>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-mono text-accent-red space-y-4 p-4 text-center">
        <Terminal className="h-8 w-8 text-accent-red" />
        <span className="font-bold">Error: Receipt Not Found</span>
        <Link href="/" className="underline text-accent-cyan hover:text-cyan-300 text-xs">Return to homepage</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4 flex flex-col items-center justify-center font-mono">
      {/* Back to Recap Actions */}
      <div className="w-full max-w-sm flex items-center justify-between mb-6 text-xs text-muted no-print">
        <Link href={`/recap/${recapId}`} className="flex items-center space-x-1 hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to deck</span>
        </Link>
        <div className="flex space-x-4">
          <button onClick={() => window.print()} className="flex items-center space-x-1 hover:text-foreground">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* The Thermal Receipt Bill Container */}
      <div className="receipt-container w-full max-w-sm bg-[#f4f1e8] text-[#111111] p-6 shadow-2xl rounded-sm relative border border-panel-border/30">
        <div className="text-center space-y-2">
          <h1 className="font-extrabold text-base tracking-wider">RECAPANYTIME RECEIPT</h1>
          <p className="text-[10px] tracking-widest text-[#555555]">TIKTOK DATA SUMMARY</p>
        </div>

        <div className="border-t border-dashed border-[#888888] my-4" />

        {/* Metadata columns */}
        <div className="text-[11px] space-y-1">
          <div className="flex justify-between">
            <span className="text-[#555555]">ACCOUNT</span>
            <span className="font-bold">{receipt.accountLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#555555]">PERIOD</span>
            <span className="font-bold">
              {receipt.periodStart || '2025-12-08'} → {receipt.periodEnd || '2026-06-08'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#555555]">GENERATED</span>
            <span>{new Date(receipt.generatedAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#555555]">TICKET ID</span>
            <span>{receipt.receiptId}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-[#888888] my-4" />

        {/* Header columns */}
        <div className="text-[10px] font-bold flex justify-between text-[#444444]">
          <span>ITEM</span>
          <span>QTY</span>
        </div>
        <div className="border-t border-dashed border-[#aaaaaa] my-1" />

        {/* Line Items */}
        <div className="space-y-1 text-xs">
          {receipt.lineItems.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{item.label}</span>
              <span className="font-bold">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-[#888888] my-4" />

        {/* Spending Insights */}
        <div className="text-[10px] font-bold text-[#444444]">XẢ TIỀN SUMMARY</div>
        <div className="border-t border-dashed border-[#aaaaaa] my-1" />

        <div className="space-y-1 text-xs">
          <div className="text-[11px] text-[#555555] italic mb-1">
            💬 {receipt.persona.id === 'shopaholic-scroller' || receipt.spendingLines.length > 1 ? 'Chốt đơn tích cực!' : 'Không thấy dấu vết xả tiền.'}
          </div>
          {receipt.spendingLines.map((line, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{line.label}</span>
              <span className="font-bold">{line.value}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-[#888888] my-4" />

        {/* Top Searches */}
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
            <div className="text-muted text-[11px]">No search queries logged.</div>
          )}
        </div>

        <div className="border-t border-dashed border-[#888888] my-4" />

        {/* Persona reveal */}
        <div className="text-[10px] font-bold text-[#444444]">PERSONA RESULT</div>
        <div className="border-t border-dashed border-[#aaaaaa] my-1" />
        <div className="text-xs space-y-1 text-center py-2 bg-[#eae7de] border border-[#d6d2c4] rounded-sm">
          <p className="font-extrabold tracking-tight">{receipt.persona.title}</p>
          <p className="text-[10px] text-[#555555]">{receipt.persona.subtitle || 'Tiktok User'}</p>
        </div>

        <div className="border-t border-[#111111] my-4" />

        {/* Fake barcode block */}
        <div className="flex flex-col items-center justify-center space-y-1.5 my-4">
          <div className="w-48 h-8 flex overflow-hidden opacity-90 justify-center">
            {/* Draw simple simulated CSS barcodes */}
            {Array.from({ length: 28 }).map((_, idx) => {
              const widths = ['w-0.5', 'w-1', 'w-1.5', 'w-0.5'];
              const width = widths[idx % widths.length];
              const isSpace = Math.random() > 0.6;
              return (
                <div
                  key={idx}
                  className={`h-full ${width} ${isSpace ? 'bg-transparent' : 'bg-black'}`}
                />
              );
            })}
          </div>
          <span className="text-[9px] tracking-[6px] text-[#555555] font-mono">{receipt.receiptId}</span>
        </div>

        <div className="text-center text-[10px] text-[#444444] mt-6 italic">
          {receipt.footerText}
        </div>
      </div>

      {/* Page Actions Footer */}
      <footer className="mt-8 text-center text-xs text-muted font-mono no-print">
        <p>Press Ctrl+P to save as physical thermal receipt paper or export to PDF.</p>
      </footer>
    </div>
  );
}
