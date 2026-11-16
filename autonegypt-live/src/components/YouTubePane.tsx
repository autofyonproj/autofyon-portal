'use client';
/**
 * The YouTube pane inside a carousel slide.
 *
 * Ported from the pattern proven in the sister marketplace
 * (`YouTubeCarouselPlayer`), with three deliberate changes:
 *
 * 1. ONE API LOADER. The old file appended the script from every mounted player
 *    and queued inits through a global it only partly owned. Here a module-level
 *    promise resolves once, and each pane awaits it — so the lazy window the
 *    carousel keeps (current slide ± 1) can mount and unmount panes without
 *    racing the loader.
 * 2. NO INVENTED TIER. The source cut a video at `maxDuration` and demanded the
 *    visitor "UPGRADE TO GOLD" — a paid tier this portal does not have, so the
 *    claim was a lie on screen. The honest version stops the preview where the
 *    owner set it and hands the visitor a real link to the rest of the film.
 * 3. COVER SIZING IN CONTAINER UNITS. `120vw/120vh` only makes sense for a
 *    full-viewport hero. This pane lives inside a slide whose height comes from
 *    its own aspect-ratio, so the iframe is sized `max(100cqw, 100cqh * 16/9)`
 *    against the slide, which covers a 21/9 shelf and a 4/5 shelf alike.
 *
 * Playback starts only after the visitor presses play; the carousel never
 * starts a sound or video unexpectedly.
 */
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { IconExternal, IconFilm, IconPause, IconPlay, IconVolumeMuted, IconVolumeOn } from '@/components/icons';

/** The part of the IFrame API this pane calls — not the whole 300-line surface. */
interface YtPlayer {
  mute(): void;
  unMute(): void;
  setVolume(volume: number): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  destroy(): void;
}

interface YtEvent {
  data: number;
  target: YtPlayer;
}

interface YtPlayerOptions {
  videoId: string;
  host?: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (e: YtEvent) => void;
    onError?: (e: YtEvent) => void;
    onStateChange?: (e: YtEvent) => void;
  };
}

interface Yt {
  Player: new (elementId: string, options: YtPlayerOptions) => YtPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; BUFFERING: number; CUED: number };
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: Yt;
    _ytApiResolvers?: Array<() => void>;
  }
}

const API_SRC = 'https://www.youtube.com/iframe_api';

/** Resolved once per page; the iframe API owns a single global ready hook. */
let apiLoading: Promise<void> | null = null;

/**
 * How long a pane waits for a script it does not control before it stops
 * pretending. A third-party CDN can stall silently — no error event, no iframe —
 * and a chip that says "preparing" forever is a worse promise than an honest
 * failure with a working link.
 */
const PATIENCE_MS = 12_000;

function youTubeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (apiLoading) return apiLoading;

  apiLoading = new Promise<void>((resolve) => {
    const settle = () => resolve();
    if (!document.querySelector(`script[src="${API_SRC}"]`)) {
      const tag = document.createElement('script');
      tag.src = API_SRC;
      tag.async = true;
      document.head.appendChild(tag);
    }
    // The API calls this hook exactly once; if it already fired before we got
    // here, `window.YT.Player` will exist and we resolve immediately.
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      window._ytApiResolvers?.forEach((fn) => fn());
    };
    if (window.YT && window.YT.Player) settle();
    else {
      window._ytApiResolvers = [...(window._ytApiResolvers ?? []), settle];
    }
  });
  return apiLoading;
}

/** YouTube's own codes, translated into something a visitor can act on. */
const ERROR_COPY: Record<number, { en: string; ar: string }> = {
  2: { en: 'This video ID is not valid.', ar: 'معرّف الفيديو غير صالح.' },
  5: { en: 'The player could not start.', ar: 'لم يتمكن المشغّل من البدء.' },
  100: { en: 'This video is no longer on YouTube.', ar: 'هذا الفيديو لم يعد على يوتيوب.' },
  101: { en: 'The owner blocks embedding.', ar: 'صاحب الفيديو يمنع تضمينه.' },
  150: { en: 'The owner blocks embedding.', ar: 'صاحب الفيديو يمنع تضمينه.' },
};

export interface YouTubePaneProps {
  videoId: string;
  /** Only the visible slide (and its neighbours) is mounted; this drives play/pause. */
  isActive: boolean;
  /** Accessible name for the iframe region. */
  title: string;
  ar?: boolean;
  /** Poster shown before the player answers, and if it never does. */
  posterUrl?: string | null;
  /** Seconds of free preview the owner chose. Stops there, with a real link on. */
  maxDuration?: number;
  /** Start time in seconds (e.g., 15) to jump straight to the highlight/walkaround */
  startTime?: number;
  /** End time in seconds (e.g., 45) to clip the period */
  endTime?: number;
  /** Callback fired when playback state changes (playing vs paused) */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** Callback fired when the video reaches its end or the specified endTime */
  onVideoEnded?: () => void;
}

export default function YouTubePane({
  videoId,
  isActive,
  title,
  ar = false,
  posterUrl,
  maxDuration,
  startTime,
  endTime,
  onPlayStateChange,
  onVideoEnded,
}: YouTubePaneProps) {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);
  const [playRequested, setPlayRequested] = useState(false);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [previewEnd, setPreviewEnd] = useState(false);
  // Our own timeout, not YouTube's: distinct from `errorCode` so that a player
  // which eventually does answer can still recover.
  const [gaveUp, setGaveUp] = useState(false);
  const playerRef = useRef<YtPlayer | null>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);
  // React owns this identity: stable across renders and across the server/client
  // boundary, which a `Math.random()` id never is.
  const uid = `yt_${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const labels = ar
    ? {
        loading: 'جارِ تجهيز الفيديو…',
        previewEnd: 'انتهت المعاينة',
        previewEndBody: 'أكمل الجولة الكاملة على يوتيوب.',
        watchFull: 'مشاهدة كاملة على يوتيوب',
        blocked: 'لا يعمل هذا الفيديو هنا',
        blockedBody: 'افتحه على يوتيوب للمشاهدة.',
        openYouTube: 'فتح على يوتيوب',
        soundOn: 'تشغيل الصوت',
        soundOff: 'كتم الصوت',
        play: 'تشغيل الفيديو',
        pause: 'إيقاف الفيديو مؤقتًا',
      }
    : {
        loading: 'Preparing the video…',
        previewEnd: 'Preview complete',
        previewEndBody: 'The full walkthrough runs on YouTube.',
        watchFull: 'Watch the full walkthrough',
        blocked: 'This video will not play here',
        blockedBody: 'Open it on YouTube to watch.',
        openYouTube: 'Open on YouTube',
        soundOn: 'Turn sound on',
        soundOff: 'Mute',
        play: 'Play the video',
        pause: 'Pause the video',
      };

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // ── build the player once per videoId ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const origin = window.location.origin;

    youTubeApi()
      .then(() => {
        if (cancelled || !window.YT?.Player) return;
        if (!document.getElementById(uid)) return;
        const YT = window.YT;
        playerRef.current = new YT.Player(uid, {
          videoId,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            playsinline: 1,
            enablejsapi: 1,
            origin,
            ...(typeof startTime === 'number' && startTime > 0 ? { start: Math.floor(startTime) } : {}),
            ...(typeof endTime === 'number' && endTime > 0 ? { end: Math.floor(endTime) } : {}),
          },
          events: {
            onReady: (e) => {
              if (cancelled) return;
              setReady(true);
              e.target.mute();
              if (typeof startTime === 'number' && startTime > 0) {
                try { e.target.seekTo(startTime, true); } catch { /* noop */ }
              }
              e.target.pauseVideo();
            },
            onError: (e) => setErrorCode(Number(e?.data) || 5),
            onStateChange: (e) => {
              const state = window.YT?.PlayerState;
              if (!state) return;
              if (e.data === state.PLAYING) {
                setPlaying(true);
                onPlayStateChange?.(true);
              }
              // Every path that pauses also mutes, so the sound control returns to
              // "off" with the film — the button never promises less than the player.
              if (e.data === state.PAUSED) {
                setPlaying(false);
                setSound(false);
                onPlayStateChange?.(false);
              }
              // When the video ends, notify the carousel so it can smoothly advance
              if (e.data === state.ENDED) {
                setPlaying(false);
                onPlayStateChange?.(false);
                onVideoEnded?.();
              }
            },
          },
        });
      })
      .catch(() => setErrorCode(5));

    return () => {
      cancelled = true;
      const p = playerRef.current;
      playerRef.current = null;
      try { p?.destroy(); } catch { /* already torn down */ }
    };
  }, [videoId, uid, maxDuration, startTime, endTime, onPlayStateChange, onVideoEnded]);

  // ── the carousel clock decides whether this pane is moving ─────────────────
  // Commands only. The pane's own state (paused, muted) arrives back through the
  // player's events, so React never has to guess what it just told YouTube to do.
  useEffect(() => {
    const p = playerRef.current;
    if (!p || errorCode) return;
    try {
      if (isActive && playRequested) {
        p.playVideo();
        onPlayStateChange?.(true);
      } else {
        p.pauseVideo();
        p.mute();
        if (!isActive) {
          setPlaying(false);
          setSound(false);
          onPlayStateChange?.(false);
        }
      }
    } catch { /* player may be tearing down */ }
  }, [isActive, errorCode, ready, playRequested, onPlayStateChange]);

  // ── monitor playback boundary (endTime or maxDuration) ─────────────────────
  useEffect(() => {
    if (!playing) return;
    const tick = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      const current = p.getCurrentTime();
      if (typeof endTime === 'number' && endTime > 0 && current >= endTime) {
        try { p.pauseVideo(); p.mute(); } catch { /* noop */ }
        setPlaying(false);
        onPlayStateChange?.(false);
        onVideoEnded?.();
        return;
      }
      if (typeof maxDuration === 'number' && maxDuration > 0 && current >= (startTime || 0) + maxDuration) {
        try { p.pauseVideo(); p.mute(); } catch { /* noop */ }
        setPreviewEnd(true);
        setPlaying(false);
        onPlayStateChange?.(false);
        onVideoEnded?.();
      }
    }, 500);
    return () => clearInterval(tick);
  }, [playing, startTime, endTime, maxDuration, onPlayStateChange, onVideoEnded]);

  // ── stop waiting on a script that may never arrive ─────────────────────────
  // Two endings are honest: the player answered, or YouTube reported a code. A
  // third had to be invented, because a stalled iframe_api request fires neither
  // and would leave the pane promising a film indefinitely. Clearing the state in
  // the teardown is what lets a slow-but-successful load recover.
  useEffect(() => {
    if (ready || errorCode !== null) return;
    const wait = setTimeout(() => setGaveUp(true), PATIENCE_MS);
    return () => { clearTimeout(wait); setGaveUp(false); };
  }, [ready, errorCode]);

  const toggleSound = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (sound) {
      p.mute();
      setSound(false);
      return;
    }
    // Unmuting only sticks inside a user gesture, which is exactly what this
    // click is — the reason autoplay alone can never bring sound.
    p.unMute();
    p.setVolume(100);
    p.playVideo();
    setPlayRequested(true);
    setSound(true);
    setPlaying(true);
  }, [sound]);

  const startManually = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (previewEnd) {
      try { p.seekTo(startTime || 0, true); } catch { /* noop */ }
      setPreviewEnd(false);
    }
    p.playVideo();
    setPlayRequested(true);
    setPlaying(true);
    onPlayStateChange?.(true);
  }, [previewEnd, startTime, onPlayStateChange]);
  const togglePlayback = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) {
      p.pauseVideo();
      setPlayRequested(false);
      setPlaying(false);
      onPlayStateChange?.(false);
      return;
    }
    startManually();
  }, [playing, startManually, onPlayStateChange]);

  const failed = errorCode !== null || (gaveUp && !ready);
  // YouTube's numeric code becomes the sentence the visitor can act on; a timeout
  // gets the same plate with the reason we actually know.
  const failureReason =
    errorCode !== null ? ERROR_COPY[errorCode]
    : gaveUp ? { en: ERROR_COPY[5].en, ar: ERROR_COPY[5].ar }
    : undefined;
  const showPoster = !ready || failed;
  // The preview gate belongs to the appearance that consumed it. A pane that left
  // the stage was paused and muted on the way out, so it does not come back
  // already finished.
  const gated = previewEnd && isActive;
  const dimmed = gated || failed;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#080b0e]" role="group" aria-label={title}>
      {/* The iframe itself never takes pointer events: the carousel owns the
          pane, and a stray click into YouTube chrome would steal the slide. */}
      <div
        ref={holderRef}
        className="yt-cover"
        style={{
          pointerEvents: 'none',
          filter: dimmed ? 'blur(14px) brightness(0.45)' : 'none',
          transition: 'filter 600ms ease',
        }}
      >
        <div id={uid} />
      </div>

      {showPoster ? (
        <YouTubePoster
          videoId={videoId}
          posterUrl={posterUrl}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: failed ? 1 : 0.85 }}
        />
      ) : null}

      {!ready && !failed ? (
        // Top of the pane, away from the caption band the carousel owns: a chip
        // sitting on the words reads as a bug even when it is only waiting.
        <div className="absolute inset-x-0 top-0 flex items-start justify-start p-4">
          <span className="hairline-plate inline-flex items-center gap-2 px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase text-white/80">
            <IconFilm size={14} />
            {labels.loading}
          </span>
        </div>
      ) : null}

      {failed ? (
        <div className="absolute inset-0 grid place-items-center p-6">
          <div className="hairline-plate max-w-sm p-5 text-center">
            <p className="font-display text-[15px] leading-snug text-white">{labels.blocked}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
              {failureReason?.[ar ? 'ar' : 'en'] ?? labels.blockedBody}
            </p>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 border border-white/35 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-black"
            >
              <IconExternal size={14} />
              {labels.openYouTube}
            </a>
          </div>
        </div>
      ) : null}

      {gated && !failed ? (
        <div className="absolute inset-0 grid place-items-center p-6">
          <div className="hairline-plate max-w-sm p-5 text-center">
            <p className="font-display text-[15px] leading-snug text-white">{labels.previewEnd}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">{labels.previewEndBody}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-85"
              >
                <IconExternal size={14} />
                {labels.watchFull}
              </a>
              <button
                type="button"
                onClick={startManually}
                className="inline-flex items-center gap-2 border border-white/35 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
              >
                <IconPlay size={14} />
                {labels.play}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {ready && !gated && !failed ? (
        <button
          type="button"
          onClick={togglePlayback}
          className={`absolute z-10 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-full text-white ${playing ? 'bottom-3 left-1/2' : 'left-1/2 top-1/2 -translate-y-1/2'}`}
          aria-label={playing ? labels.pause : labels.play}
          title={playing ? labels.pause : labels.play}
        >
          <span className="hairline-plate grid h-14 w-14 place-items-center rounded-full text-white">
            {playing ? <IconPause size={22} /> : <IconPlay size={22} />}
          </span>
        </button>
      ) : null}

      {ready && !gated && !failed ? (
        <button
          type="button"
          onClick={toggleSound}
          className="absolute bottom-3 end-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/70"
          aria-label={sound ? labels.soundOff : labels.soundOn}
          aria-pressed={sound}
          title={sound ? labels.soundOff : labels.soundOn}
        >
          {sound ? <IconVolumeOn size={18} /> : <IconVolumeMuted size={18} />}
        </button>
      ) : null}
    </div>
  );
}

/**
 * The still that stands in for a film.
 *
 * `maxresdefault.jpg` only exists when the uploader supplied a wide poster, and
 * most dealer walkarounds did not: YouTube then serves a 120×90 grey tile, or
 * nothing at all, and the browser stretches it across a pane eight times its
 * size. So try whatever the owner stored first, then walk YouTube's own
 * resolutions down until one of them answers, and show no image rather than a
 * broken one when none does.
 */
export function YouTubePoster({
  videoId,
  posterUrl,
  className,
  style,
}: {
  videoId: string;
  posterUrl?: string | null;
  className?: string;
  style?: CSSProperties;
}) {
  const sources = useMemo(() => {
    const candidates: string[] = [];
    if (posterUrl?.trim()) candidates.push(posterUrl.trim());
    // YouTube only has a poster to hand out for a well-formed video ID.
    if (/^[\w-]{11}$/.test(videoId)) {
      for (const size of ['maxresdefault', 'sddefault', 'hqdefault']) {
        candidates.push(`https://i.ytimg.com/vi/${videoId}/${size}.jpg`);
      }
    }
    return [...new Set(candidates)];
  }, [posterUrl, videoId]);

  // How many candidates have already failed. `key` remounts the element on every
  // advance so the browser cannot hold on to the errored image it just rejected.
  const [misses, setMisses] = useState(0);
  const src = sources[misses];
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- poster comes from YouTube or the owner's CDN, size unknown at build
    <img
      key={src}
      src={src}
      alt=""
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      onError={() => setMisses((n) => n + 1)}
    />
  );
}
