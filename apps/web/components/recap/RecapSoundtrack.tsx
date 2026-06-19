'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';
import type { RecapTheme } from '@/lib/recap/types';
import { getThemePack } from '@/lib/recap/theme-packs';
import { pickTrack } from '@/lib/spotify-tracks';
import { SpotifyEmbed } from './SpotifyEmbed';

interface RecapSoundtrackProps {
  enabled: boolean;
  onToggleEnabled: (v: boolean) => void;
  theme: RecapTheme;
  onUnlock: () => void;
}

const THEME_REGION: Record<RecapTheme, string> = {
  tiktok: 'VN',
  spotify: 'US',
  ytmusic: 'CHILL',
};

export function RecapSoundtrack({ enabled, onToggleEnabled, theme, onUnlock }: RecapSoundtrackProps) {
  const [expanded, setExpanded] = useState(false);
  const pack = getThemePack(theme);
  const track = pickTrack(THEME_REGION[theme]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-40 no-print max-w-[min(100vw-2rem,300px)]"
    >
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-xl shadow-wrapped">
        <div className="flex items-center gap-2 px-3 py-2">
          <Music className="h-3.5 w-3.5 flex-shrink-0" style={{ color: pack.glowColor }} />
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Recap soundtrack</p>
            <p className="font-display text-xs font-semibold truncate text-foreground">{track.title}</p>
          </div>
          <button
            onClick={() => {
              onUnlock();
              onToggleEnabled(!enabled);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            title={enabled ? 'Tắt nhạc' : 'Bật nhạc'}
          >
            {enabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 text-muted" />}
          </button>
          <button onClick={() => setExpanded((e) => !e)} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
        </div>

        <AnimatePresence>
          {enabled && expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/5"
            >
              <div className="p-2">
                <SpotifyEmbed trackId={track.id} height={80} />
                <p className="font-mono text-[9px] text-foreground/30 mt-1.5 px-1">
                  {track.artist} · Nhấn play để phát nhạc
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
