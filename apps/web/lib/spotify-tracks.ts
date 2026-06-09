export type SpotifyTrack = {
  id: string;
  title: string;
  artist: string;
  region: 'US' | 'UK' | 'VN' | 'GLOBAL';
};

/** Curated popular tracks — Spotify embed track IDs */
export const SPOTIFY_TRACKS: SpotifyTrack[] = [
  { id: '0VjIjW4GlUZAMYd2vXMi3b', title: 'Blinding Lights', artist: 'The Weeknd', region: 'US' },
  { id: '0V3wPSX9gBn2KuxPRYA0KQ', title: 'Anti-Hero', artist: 'Taylor Swift', region: 'US' },
  { id: '6DCZcSspjsKo9uo18dfd06', title: "God's Plan", artist: 'Drake', region: 'US' },
  { id: '7qiZfU4dY1lWllzX7mPBI3', title: 'Shape of You', artist: 'Ed Sheeran', region: 'UK' },
  { id: '7qEHsqek33rIvFAb9UNRBH', title: 'Someone You Loved', artist: 'Lewis Capaldi', region: 'UK' },
  { id: '0UlsTmjrim09KOP18wJYrE', title: 'Easy On Me', artist: 'Adele', region: 'UK' },
  { id: '63LSTFxxJBuO7G3bqmS6GW', title: 'Lạc Trôi', artist: 'Sơn Tùng M-TP', region: 'VN' },
  { id: '2HHtW2icCJuFBWYPbspRAP', title: 'See Tình', artist: 'Hoàng Thùy Linh', region: 'VN' },
  { id: '5FMyXeZ0reYFrEGvOa9hPt', title: 'Hoa Lệ Là Ai', artist: 'Jack - J97', region: 'VN' },
  { id: '5Z01UMMf7V1o0MzF86s6WJ', title: 'Chúng Ta Của Hiện Tại', artist: 'Sơn Tùng M-TP', region: 'VN' },
  { id: '0mdqdCEqLrJUbPp56vHm9N', title: 'Dynamite', artist: 'BTS', region: 'GLOBAL' },
  { id: '4ZtFanR9U6ndgddUvNcjcG', title: 'good 4 u', artist: 'Olivia Rodrigo', region: 'US' },
  { id: '3DarAbFcjvC0moy4ZU1ZjT', title: 'As It Was', artist: 'Harry Styles', region: 'UK' },
  { id: '2Fxmhks0bxGSBdJ92vM42m', title: 'bad guy', artist: 'Billie Eilish', region: 'US' },
  { id: '3CRDbSIZ4r5MsZ0YMYiBnO', title: 'Bước Qua Mùa Cô Đơn', artist: 'Vũ.', region: 'VN' },
];

export function pickRandomTrack(excludeId?: string): SpotifyTrack {
  const pool = excludeId
    ? SPOTIFY_TRACKS.filter((t) => t.id !== excludeId)
    : SPOTIFY_TRACKS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickTrackByRegion(region?: SpotifyTrack['region']): SpotifyTrack {
  if (region) {
    const regional = SPOTIFY_TRACKS.filter((t) => t.region === region);
    if (regional.length > 0) {
      return regional[Math.floor(Math.random() * regional.length)];
    }
  }
  return pickRandomTrack();
}
