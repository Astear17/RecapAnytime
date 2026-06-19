'use client';

interface SpotifyEmbedProps {
  trackId: string;
  height?: number;
}

export function SpotifyEmbed({ trackId, height = 80 }: SpotifyEmbedProps) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
      width="100%"
      height={height}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      style={{ borderRadius: 12, border: 'none' }}
    />
  );
}
