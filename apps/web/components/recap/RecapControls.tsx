'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Sparkles, Music, Zap, X } from 'lucide-react';

export type RecapVibe = 'default' | 'neon' | 'warm' | 'cool';

interface RecapControlsProps {
  open: boolean;
  onClose: () => void;
  confettiEnabled: boolean;
  onConfettiChange: (v: boolean) => void;
  vinylEnabled: boolean;
  onVinylChange: (v: boolean) => void;
  vibe: RecapVibe;
  onVibeChange: (v: RecapVibe) => void;
}

const VIBES: { id: RecapVibe; label: string; color: string }[] = [
  { id: 'default', label: 'TikTok', color: '#ff3b5c' },
  { id: 'neon', label: 'Neon', color: '#25f4ee' },
  { id: 'warm', label: 'Warm', color: '#fb923c' },
  { id: 'cool', label: 'Cool', color: '#a855f7' },
];

export function RecapControls({
  open,
  onClose,
  confettiEnabled,
  onConfettiChange,
  vinylEnabled,
  onVinylChange,
  vibe,
  onVibeChange,
}: RecapControlsProps) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 no-print"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mx-4 no-print"
          >
            <div className="rounded-2xl border border-white/10 bg-surface/95 backdrop-blur-xl p-5 shadow-wrapped">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-accent-cyan" />
                  Tùy chỉnh recap
                </h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">Vibe màu</p>
                  <div className="flex gap-2">
                    {VIBES.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => onVibeChange(v.id)}
                        className={`flex-1 py-2 rounded-xl font-display text-xs font-semibold border transition-all ${
                          vibe === v.id ? 'border-white/30 bg-white/10' : 'border-white/5 bg-white/[0.03]'
                        }`}
                        style={{ color: vibe === v.id ? v.color : undefined }}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <ToggleRow
                  icon={<Sparkles className="h-4 w-4 text-accent-yellow" />}
                  label="Confetti"
                  desc="Nổ confetti ở slide persona & kết"
                  checked={confettiEnabled}
                  onChange={onConfettiChange}
                />
                <ToggleRow
                  icon={<Music className="h-4 w-4 text-spotify-green" />}
                  label="Vinyl disc"
                  desc="Đĩa than xoay trên slide nhạc"
                  checked={vinylEnabled}
                  onChange={onVinylChange}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ToggleRow({
  icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors text-left"
    >
      {icon}
      <div className="flex-1">
        <p className="font-display text-sm font-semibold">{label}</p>
        <p className="font-mono text-[10px] text-muted">{desc}</p>
      </div>
      <div
        className={`w-10 h-6 rounded-full transition-colors relative ${checked ? 'bg-accent-green' : 'bg-white/10'}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-5' : 'left-1'}`}
        />
      </div>
    </button>
  );
}

export function RecapSettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-white/5 transition-colors no-print"
      title="Tùy chỉnh"
    >
      <Zap className="h-4 w-4 text-accent-yellow" />
    </button>
  );
}
