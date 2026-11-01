import manifest from './images.generated.json';

/**
 * Bildregister. Maße und Breiten stammen aus `npm run images`
 * (scripts/optimize-images.mjs) und verhindern Layout-Shifts.
 */
export type ImageKey = keyof typeof manifest;

export interface SiteImage {
  key: ImageKey;
  alt: string;
  /** Pflicht-Kennzeichnung für Renderings: wird als Badge + Hinweis angezeigt. */
  isVisualization?: boolean;
  /** Bildausschnitt (CSS object-position), z. B. "50% 30%" */
  focus?: string;
  caption?: string;
}

export const imageMeta = (key: ImageKey) => manifest[key];

export const imageSrc = (key: ImageKey, width: number, ext: 'avif' | 'webp' | 'jpg') =>
  `/images/${key}-${width}.${ext}`;

export const srcSet = (key: ImageKey, ext: 'avif' | 'webp' | 'jpg') =>
  manifest[key].widths.map((w) => `${imageSrc(key, w, ext)} ${w}w`).join(', ');

/** Größte verfügbare Breite ≤ max (für Open-Graph, Fallback-src) */
export const bestWidth = (key: ImageKey, max = 1200) => {
  const ws = manifest[key].widths.filter((w) => w <= max);
  return ws.length ? ws[ws.length - 1] : manifest[key].widths[0];
};
