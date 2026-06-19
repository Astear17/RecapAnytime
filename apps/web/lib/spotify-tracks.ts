export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  region: 'VN' | 'US' | 'UK' | 'CHILL';
}

export const SPOTIFY_TRACKS: SpotifyTrack[] = [
  { id: '4fouWK6XVHhzl78KzQ1UjL', title: 'Chúng Ta Không Thuộc Về Nhau', artist: 'Sơn Tùng M-TP', region: 'VN' },
  { id: '3PfjOEeWkYfLkqN3rB2LwL', title: 'See Tình', artist: 'Hoàng Thùy Linh', region: 'VN' },
  { id: '5SuOykwi7y4OMgX9HJkp0J', title: 'Lối Nhỏ', artist: 'Đen Vâu', region: 'VN' },
  { id: '1HK7o6mN3Caz7qfPL2VgSU', title: 'Nước Ngoài', artist: 'Phan Mạnh Quỳnh', region: 'VN' },
  { id: '3dPxsGFQ2wRkcMWI85IH5Z', title: 'Waiting For You', artist: 'MONO', region: 'VN' },
  { id: '0VjIjW4GlUZAMYd2vXMi3b', title: 'Blinding Lights', artist: 'The Weeknd', region: 'US' },
  { id: '5PjGepHCMqzSubOyyLdYHh', title: 'Anti-Hero', artist: 'Taylor Swift', region: 'US' },
  { id: '2Fxmhks0bxGSBdJ92vM42m', title: 'bad guy', artist: 'Billie Eilish', region: 'US' },
  { id: '39LLxExYz6ewLAo9BFVV9e', title: 'Levitating', artist: 'Dua Lipa', region: 'UK' },
  { id: '4LRPiXqCcecLqP1FOIQEp0', title: 'As It Was', artist: 'Harry Styles', region: 'UK' },
  { id: '5odlY5ZagP6c6P6YD1bM2J', title: 'Golden Hour', artist: 'JVKE', region: 'CHILL' },
  { id: '02MWAaffLxlfxAUY7c5dvx', title: 'Heat Waves', artist: 'Glass Animals', region: 'CHILL' },
  { id: '3KkXRkHbMCARz0aVfEt68P', title: 'Sunflower', artist: 'Post Malone', region: 'CHILL' },
  { id: '5PjdY0CKGZdEuoNab3yDmX', title: 'STAY', artist: 'Kid LAROI & Justin Bieber', region: 'CHILL' },
  { id: '6UelLqGlWMcVH1E5c4H7lY', title: 'Watermelon Sugar', artist: 'Harry Styles', region: 'CHILL' },
];

export function pickTrack(region?: string): SpotifyTrack {
  if (region) {
    const regional = SPOTIFY_TRACKS.filter((t) => t.region === region);
    if (regional.length > 0) return regional[Math.floor(Math.random() * regional.length)];
  }
  return SPOTIFY_TRACKS[Math.floor(Math.random() * SPOTIFY_TRACKS.length)];
}
