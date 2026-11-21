/**
 * The minisite icon set.
 *
 * One stroke weight, one grid, currentColor: an icon that inherits its colour is
 * the only kind that survives a dark pane, a light pane and an amber plate
 * without three variants. Emoji were used here before, which meant the glyph
 * differed by operating system and nothing about the control read as *ours*.
 *
 * `dir` on the parent does not flip an SVG, so arrows are drawn for reading
 * direction: <ArrowStep direction="back"> always points where "previous" is.
 */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** `back`/`forward` are reading-direction steps, so RTL gets mirrored automatically. */
export function ArrowStep({ direction, ...props }: IconProps & { direction: 'back' | 'forward' }) {
  const d = direction === 'back' ? 'M14.5 5 8 12l6.5 7' : 'M9.5 5 16 12l-6.5 7';
  return <Svg {...props}><path d={d} /></Svg>;
}

export function IconPlay(props: IconProps) {
  return <Svg {...props}><path d="M8 5.5v13l11-6.5z" /></Svg>;
}

export function IconPause(props: IconProps) {
  return <Svg {...props}><path d="M9 5v14M15 5v14" /></Svg>;
}

export function IconVolumeMuted(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z" />
      <path d="M16 9.5l4 5M20 9.5l-4 5" />
    </Svg>
  );
}

export function IconVolumeOn(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z" />
      <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.6 7.6 0 0 1 0 11" />
    </Svg>
  );
}

export function IconExpand(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />
    </Svg>
  );
}

export function IconCollapse(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 9h5V4M20 9h-5V4M20 15h-5v5M4 15h5v5" />
    </Svg>
  );
}

export function IconClose(props: IconProps) {
  return <Svg {...props}><path d="M6 6l12 12M18 6L6 18" /></Svg>;
}

/** A camera body with an open shutter: "this frame still needs its photograph". */
export function IconCamera(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 8.5h3l1.5-2h9L18 8.5h3v11H3z" />
      <circle cx="12" cy="14" r="3.2" />
    </Svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.5 3.5h3l1.2 3.4-1.9 1.4a11 11 0 0 0 5 5l1.4-1.9 3.4 1.2v3a1.9 1.9 0 0 1-2.1 1.9A15.5 15.5 0 0 1 4.6 5.6 1.9 1.9 0 0 1 6.5 3.5z" />
    </Svg>
  );
}

/** WhatsApp mark, drawn on the same 24px grid rather than pasted from a brand sheet. */
export function IconWhatsApp(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20l1.3-4A8.2 8.2 0 1 1 8.6 19z" />
      <path d="M9.2 9.4c.3 2.2 2.4 4.3 4.6 4.7l1.1-1.4 1.6.8c-.2 1.3-1.4 1.9-2.6 1.6a8.6 8.6 0 0 1-6.4-6.4c-.3-1.2.3-2.4 1.6-2.6l.8 1.6z" />
    </Svg>
  );
}

export function IconPin(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21s6-6.1 6-10.4A6 6 0 0 0 6 10.6C6 14.9 12 21 12 21z" />
      <circle cx="12" cy="10.4" r="2.2" />
    </Svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.6V12l3.2 2" />
    </Svg>
  );
}

export function IconGear(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6" />
    </Svg>
  );
}

export function IconExternal(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 5h5v5M19 5l-7.5 7.5" />
      <path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </Svg>
  );
}

/** Diagonal hazard stripes, reused by the "media not authored yet" state. */
export function IconFilm(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="6" width="17" height="12" rx="1.5" />
      <path d="M8 6v12M16 6v12M3.5 12h17" />
    </Svg>
  );
}

export function IconDiamond(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 3h12l4 7-10 11L2 10l4-7z" />
      <path d="M2 10h20M10 3l-2 7 4 11 4-11-2-7" />
    </Svg>
  );
}

export function IconStar(props: IconProps) {
  return (
    <Svg {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Svg>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </Svg>
  );
}

export function IconBuilding(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </Svg>
  );
}

export function IconTag(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </Svg>
  );
}

export function IconCar(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.5L6.5 3h11L19.5 7H21a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
      <circle cx="7.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </Svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Svg>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <Svg {...props}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </Svg>
  );
}

export function IconChart(props: IconProps) {
  return (
    <Svg {...props}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </Svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

