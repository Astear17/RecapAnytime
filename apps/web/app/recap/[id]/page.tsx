'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { RecapStats } from '@recapanytime/shared';
import { DEMO_STATS } from '@/lib/recap/demo-stats';
import { RecapDeck } from '@/components/recap/RecapDeck';
import { useRecapPreferences } from '@/hooks/useRecapPreferences';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useRecapAudio } from '@/hooks/useRecapAudio';
import { showToast } from '@/lib/toast';

export default function RecapPage() {
  const params = useParams();
  const router = useRouter();
  const recapId = params.id as string;
  const isDemo = recapId === 'demo';

  const [stats, setStats] = useState<RecapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTokenInput, setDeleteTokenInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const reducedMotion = useReducedMotion();
  const prefs = useRecapPreferences();

  const handleAudioUnlock = useCallback(() => {
    setAudioUnlocked(true);
  }, []);

  useEffect(() => {
    if (isDemo) {
      setStats(DEMO_STATS);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchApi<{ ok: boolean; recap: Record<string, unknown> }>(`/api/recap/${recapId}`)
      .then((res) => {
        if (res.ok) {
          const recap = res.recap;
          setStats({
            profile: (recap.profile as RecapStats['profile']) || {},
            watch: (recap.stats as { watch?: RecapStats['watch'] })?.watch || ({} as RecapStats['watch']),
            engagement: (recap.stats as { engagement?: RecapStats['engagement'] })?.engagement || ({} as RecapStats['engagement']),
            searches: (recap.stats as { searches?: RecapStats['searches'] })?.searches || ({} as RecapStats['searches']),
            live: (recap.stats as { live?: RecapStats['live'] })?.live || ({} as RecapStats['live']),
            spending: (recap.stats as { spending?: RecapStats['spending'] })?.spending || ({} as RecapStats['spending']),
            persona: (recap.persona as RecapStats['persona']) || (recap.stats as { persona?: RecapStats['persona'] })?.persona || {
              id: 'unknown',
              title: 'Unknown Persona',
              subtitle: 'Chưa đủ dữ liệu',
              description: 'Chưa có đủ dữ liệu để xác định persona.',
              score: 0,
              reasons: [],
            },
            receipt: (recap.receipt as RecapStats['receipt']) || {
              receiptId: (recap.id as string) || 'RC-UNKNOWN',
              generatedAt: (recap.createdAt as string) || new Date().toISOString(),
              accountLabel: '@guest',
              periodStart: (recap.dateRange as { start?: string })?.start || null,
              periodEnd: (recap.dateRange as { end?: string })?.end || null,
              lineItems: [],
              spendingLines: [],
              topSearches: [],
              persona: (recap.persona as RecapStats['persona']) || {
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
      .catch((err: Error) => {
        setError(err.message || 'Failed to load recap');
      })
      .finally(() => setLoading(false));
  }, [recapId, isDemo]);

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
        showToast('Recap deleted permanently.');
        router.push('/');
      } else {
        showToast(data.error?.message || 'Invalid delete token');
      }
    } catch {
      showToast('Network error. Failed to delete.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !prefs.hydrated) {
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

  return (
    <>
      <RecapDeckWithAudio
        stats={stats}
        recapId={recapId}
        isDemo={isDemo}
        prefs={prefs}
        reducedMotion={reducedMotion}
        audioUnlocked={audioUnlocked}
        onAudioUnlock={handleAudioUnlock}
        onDeleteClick={() => setShowDeleteModal(true)}
      />

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
    </>
  );
}

function RecapDeckWithAudio({
  stats,
  recapId,
  isDemo,
  prefs,
  reducedMotion,
  audioUnlocked,
  onAudioUnlock,
  onDeleteClick,
}: {
  stats: RecapStats;
  recapId: string;
  isDemo: boolean;
  prefs: ReturnType<typeof useRecapPreferences>;
  reducedMotion: boolean;
  audioUnlocked: boolean;
  onAudioUnlock: () => void;
  onDeleteClick: () => void;
}) {
  const [slideIndex, setSlideIndex] = useState(0);

  useRecapAudio(prefs.theme, prefs.musicEnabled, slideIndex, audioUnlocked);

  return (
    <RecapDeck
      stats={stats}
      recapId={recapId}
      isDemo={isDemo}
      theme={prefs.theme}
      onThemeChange={prefs.setTheme}
      musicEnabled={prefs.musicEnabled}
      onMusicChange={prefs.setMusicEnabled}
      confettiEnabled={prefs.confettiEnabled}
      onConfettiChange={prefs.setConfettiEnabled}
      vinylEnabled={prefs.vinylEnabled}
      onVinylChange={prefs.setVinylEnabled}
      reducedMotion={reducedMotion}
      onAudioUnlock={onAudioUnlock}
      onDeleteClick={onDeleteClick}
      onSlideChange={setSlideIndex}
    />
  );
}
