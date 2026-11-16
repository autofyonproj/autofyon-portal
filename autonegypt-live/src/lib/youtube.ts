const YOUTUBE_HOSTS = new Set([
  'youtu.be',
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

export function extractYouTubeVideoId(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (!['http:', 'https:'].includes(url.protocol) || !YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) {
    return null;
  }

  const segments = url.pathname.split('/').filter(Boolean);
  const candidate = url.hostname.toLowerCase() === 'youtu.be'
    ? segments[0]
    : url.pathname === '/watch'
      ? url.searchParams.get('v')
      : ['embed', 'v', 'shorts', 'live'].includes(segments[0] ?? '')
        ? segments[1]
        : null;

  return candidate && /^[\w-]{11}$/.test(candidate) ? candidate : null;
}
