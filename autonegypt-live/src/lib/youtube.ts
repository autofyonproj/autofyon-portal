const YOUTUBE_HOSTS = new Set([
  'youtu.be',
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

export function extractYouTubeVideoId(raw: string): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const value = raw.trim();

  // If already a clean 11-char video ID
  if (/^[\w-]{11}$/.test(value)) {
    return value;
  }

  let urlStr = value;
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = 'https://' + urlStr;
  }

  let url: URL;
  try {
    url = new URL(urlStr);
  } catch {
    return null;
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  if (!['youtu.be', 'youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com'].includes(hostname)) {
    // Also test if query param v exists anywhere
    const vParam = url.searchParams.get('v');
    if (vParam && /^[\w-]{11}$/.test(vParam)) return vParam;
    return null;
  }

  if (hostname === 'youtu.be') {
    const candidate = url.pathname.slice(1).split('/')[0]?.split('?')[0];
    return candidate && /^[\w-]{11}$/.test(candidate) ? candidate : null;
  }

  // youtube.com
  const v = url.searchParams.get('v');
  if (v && /^[\w-]{11}$/.test(v)) {
    return v;
  }

  const segments = url.pathname.split('/').filter(Boolean);
  if (['embed', 'v', 'shorts', 'live'].includes(segments[0] ?? '')) {
    const candidate = segments[1]?.split('?')[0];
    return candidate && /^[\w-]{11}$/.test(candidate) ? candidate : null;
  }

  return null;
}
