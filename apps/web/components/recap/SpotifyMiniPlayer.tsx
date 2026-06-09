'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Shuffle, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';
import { SPOTIFY_TRACKS, pickRandomTrack, pickTrackByRegion, type SpotifyTrack } from '@/lib/spotify-tracks';

const MUSIC_PREF_KEY = 'recapanytime-music-enabled';

interface SpotifyMiniPlayerProps {
  enabled: boolean;
  onToggleEnabled: (v: boolean) => void;
  regionHint?: string | null;
}

export function SpotifyMiniPlayer({ enabled, onToggleEnabled, regionHint }: SpotifyMiniPlayerProps) {
  const [expanded, setExpanded] = useState(true);
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [embedKey, setEmbedKey] = useState(0);

  useEffect(() => {
    setTrack(pickTrackByRegion(regionHint === 'VN' ? 'VN' : undefined));
  }, [regionHint]);

  const shuffle = useCallback(() => {
    setTrack((prev) => pickRandomTrack(prev?.id));
    setEmbedKey((k) => k + 1);
  }, []);

  if (!track) return null;

  const embedUrl = `https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-40 no-print max-w-[min(100vw-2rem,320px)]"
    >
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/80 backdrop-blur-xl shadow-wrapped">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
          <Music className="h-3.5 w-3.5 text-spotify-green flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[9px] text-foreground/40 uppercase tracking-wider">Recap soundtrack</p>
            <p className="font-display text-xs font-semibold truncate text-foreground">
              {track.title}
              <span className="text-muted font-normal"> · {track.artist}</span>
            </p>
          </div>
          <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-muted">{track.region}</span>
          <button
            onClick={() => onToggleEnabled(!enabled)}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            title={enabled ? 'Tắt nhạc' : 'Bật nhạc'}
          >
            {enabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 text-muted" />}
          </button>
          <button
            onClick={shuffle}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            title="Random bài khác"
          >
            <Shuffle className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
        </div>

        <AnimatePresence>
          {enabled && expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 80, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <iframe
                key={embedKey}
                src={embedUrl}
                width="100%"
                height="80"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`Spotify: ${track.title}`}
                className="border-0"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Region quick-pick */}
        {expanded && (
          <div className="flex gap-1 px-2 py-2 border-t border-white/5">
            {(['US', 'UK', 'VN'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  const regional = SPOTIFY_TRACKS.filter((t) => t.region === r);
                  const pick = regional[Math.floor(Math.random() * regional.length)];
                  if (pick) {
                    setTrack(pick);
                    setEmbedKey((k) => k + 1);
                  }
                }}
                className="flex-1 font-mono text-[9px] py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                🎵 {r}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function loadMusicPreference(): boolean {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem(MUSIC_PREF_KEY);
  return saved === null ? true : saved === 'true';
}

export function saveMusicPreference(enabled: boolean) {
  localStorage.setItem(MUSIC_PREF_KEY, String(enabled));
}
