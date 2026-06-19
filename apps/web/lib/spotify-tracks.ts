export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  region: 'VN' | 'US' | 'UK' | 'CHILL';
}

export const SPOTIFY_TRACKS: SpotifyTrack[] = [
  { id: '0VjIjW4GlUZAMYd2vXMi3b', title: 'Blinding Lights', artist: 'The Weeknd', region: 'US' },
  { id: '2Fxmhks0bxGSBdJ92vM42m', title: 'bad guy', artist: 'Billie Eilish', region: 'US' },
  { id: '7qiZfU4dY1lWllzX7mPBI3', title: 'Shape of You', artist: 'Ed Sheeran', region: 'UK' },
  { id: '0e7ipj03S05BNilyu5bRzt', title: 'rockstar', artist: 'Post Malone', region: 'US' },
  { id: '1zi7xx7UVEFkmKfv06H8x0', title: 'One Dance', artist: 'Drake', region: 'US' },
  { id: '4Dvkj6JhhA12EX05fT7y2e', title: 'As It Was', artist: 'Harry Styles', region: 'UK' },
  { id: '6UelLqGlWMcVH1E5c4H7lY', title: 'Watermelon Sugar', artist: 'Harry Styles', region: 'UK' },
  { id: '5PjdY0CKGZdEuoNab3yDmX', title: 'STAY', artist: 'Kid LAROI & Justin Bieber', region: 'US' },
  { id: '02MWAaffLxlfxAUY7c5dvx', title: 'Heat Waves', artist: 'Glass Animals', region: 'CHILL' },
  { id: '3KkXRkHbMCARz0aVfEt68P', title: 'Sunflower', artist: 'Post Malone & Swae Lee', region: 'CHILL' },
];

export function pickTrack(region?: string): SpotifyTrack {
  if (region) {
    const regional = SPOTIFY_TRACKS.filter((t) => t.region === region);
    if (regional.length > 0) return regional[Math.floor(Math.random() * regional.length)];
  }
  return SPOTIFY_TRACKS[Math.floor(Math.random() * SPOTIFY_TRACKS.length)];
}
