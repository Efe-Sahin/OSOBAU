import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ResponsiveImage from './ResponsiveImage';
import type { SiteImage } from '../data/images';
import { useT } from '../i18n';

interface ProjectViewerProps {
  images: SiteImage[];
  title: string;
  /** Inhalt der Seitenleiste (Projektdaten) */
  aside: ReactNode;
}

/**
 * Bildbetrachter für Projektseiten: großes Foto mit Pfeilen und Zähler,
 * daneben Projektdaten und Vorschaubilder. Bei nur einem Bild entfallen Pfeile und Vorschaubilder.
 * Tastatur: ←/→ blättern, sobald der Betrachter den Fokus hat.
 */
export default function ProjectViewer({ images, title, aside }: ProjectViewerProps) {
  const [cur, setCur] = useState(0);
  const t = useT();
  const many = images.length > 1;
  const go = (i: number) => setCur((i + images.length) % images.length);

  const onKey = (e: KeyboardEvent) => {
    if (!many) return;
    if (e.key === 'ArrowRight') go(cur + 1);
    if (e.key === 'ArrowLeft') go(cur - 1);
  };

  return (
    <section
      aria-roledescription={many ? t.project.gallery : undefined}
      aria-label={`${t.project.gallery}: ${title}`}
      onKeyDown={onKey}
      className="on-dark grid bg-night text-white lg:grid-cols-12"
    >
      {/* Großes Bild */}
      <div className="relative aspect-[4/3] lg:col-span-8 lg:aspect-[16/10]">
        {images.map((im, i) => (
          <div
            key={im.key}
            className={`absolute inset-0 transition-opacity duration-500 ${i === cur ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            aria-hidden={i !== cur}
          >
            <ResponsiveImage image={im} fill priority={i === 0} sizes="(min-width: 1024px) 66vw, 100vw" />
          </div>
        ))}
        {many && (
          <>
            <p className="absolute bottom-4 left-4 z-10 bg-night/85 px-2.5 py-1.5 font-mono text-[0.75rem] tracking-[0.06em]" aria-live="polite">
              <span className="sr-only">{t.project.image} </span>
              {cur + 1} / {images.length}
            </p>
            <div className="absolute right-4 bottom-4 z-10 flex gap-2">
              <button
                type="button"
                onClick={() => go(cur - 1)}
                aria-label={t.project.prev}
                className="grid size-11 place-items-center bg-white text-night transition-colors hover:bg-bronze"
              >
                <ChevronLeft className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(cur + 1)}
                aria-label={t.project.next}
                className="grid size-11 place-items-center bg-white text-night transition-colors hover:bg-bronze"
              >
                <ChevronRight className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Seitenleiste: Projektdaten + Vorschaubilder */}
      <div className="flex flex-col gap-8 p-6 sm:p-8 lg:col-span-4 lg:p-10">
        {aside}
        {many && (
          <ul className="mt-auto grid grid-cols-4 gap-2" aria-label={t.project.thumbs}>
            {images.map((im, i) => (
              <li key={im.key}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${t.project.image} ${i + 1} ${t.project.show}: ${im.alt}`}
                  aria-current={i === cur ? 'true' : undefined}
                  className={`relative block aspect-square w-full overflow-hidden border-2 transition-colors ${
                    i === cur ? 'border-bronze' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <ResponsiveImage image={{ ...im, alt: '' }} fill priority sizes="96px" showVisualizationBadge={false} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
