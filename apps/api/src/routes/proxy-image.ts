import { Router, Request, Response } from 'express';

const router = Router();

const ALLOWED_HOSTS = [
  'p16-common-sign.tiktokcdn.com',
  'p16-sign.tiktokcdn.com',
  'p77-sign.tiktokcdn.com',
  'p16-va.tiktokcdn.com',
  'lf16-tiktok-web.tiktokcdn.com',
  'tos-alisg-avt-0068.tiktokcdn.com',
  '*.tiktokcdn.com',
  '*.byteimg.com',
];

function isAllowedHost(hostname: string): boolean {
  return ALLOWED_HOSTS.some((h) => {
    if (h.startsWith('*.')) {
      return hostname.endsWith(h.slice(1));
    }
    return hostname === h;
  });
}

router.get('/', async (req: Request, res: Response) => {
  const url = req.query.url as string;
  if (!url) {
    return res.status(400).json({ error: 'Missing url param' });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (!isAllowedHost(parsed.hostname)) {
    return res.status(403).json({ error: 'Host not allowed' });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*',
      },
      redirect: 'follow',
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Upstream error' });
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.error('Proxy image error:', err);
    return res.status(502).json({ error: 'Failed to fetch image' });
  }
});

export default router;
