import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import ResponsiveImage from './ResponsiveImage';
import { imageMeta, type SiteImage } from '../data/images';

interface ProjectGalleryProps {
  images: SiteImage[];
  title: string;
}

/**
 * Bildergalerie mit Lightbox.
 * Tastatur: ←/→ blättern, Esc schließt, Fokus kehrt zum Auslöser zurück.
 */
export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [active, setActive] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setActive((cur) => {
      if (cur !== null) requestAnimationFrame(() => triggerRefs.current[cur]?.focus());
      return null;
    });
  }, []);
  const step = useCallback(
    (dir: 1 | -1) => setActive((cur) => (cur === null ? cur : (cur + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (active === null) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [active, close, step]);

  // Layout: 1 Bild groß; 2 Bilder nebeneinander; ab 3 Bildern ein Raster mit großem ersten Bild
  // Kompaktes Raster: max. 3 Spalten, einzelnes Bild begrenzt breit
  const layout = () => {
    if (images.length === 1) return 'md:col-span-12 md:max-w-3xl';
    if (images.length === 2) return 'md:col-span-6';
    if (images.length % 4 === 0) return 'md:col-span-6 lg:col-span-3';
    return 'md:col-span-6 lg:col-span-4';
  };

  return (
    <>
      <ul className="grid gap-4 md:grid-cols-12 md:gap-6">
        {images.map((img, i) => {
          const m = imageMeta(img.key);
          const portrait = m.height > m.width * 1.05;
          return (
            <motion.li
              key={img.key}
              className={layout()}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.08 }}
            >
              <figure>
                <button
                  ref={(el) => {
                    triggerRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => setActive(i)}
                  className="group relative block w-full cursor-zoom-in overflow-hidden text-left"
                  aria-label={`Bild ${i + 1} von ${images.length} vergrößern: ${img.alt}`}
                >
                  <div className={portrait && images.length === 1 ? 'aspect-[4/5]' : 'aspect-[4/3]'}>
                    <ResponsiveImage
                      image={img}
                      fill
                      sizes={images.length === 1 ? '(min-width: 768px) 48rem, 100vw' : '(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw'}
                      imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <span className="absolute right-4 bottom-4 grid size-10 place-items-center bg-paper/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Expand className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </button>
                {img.caption && <figcaption className="mt-3 text-sm text-stone">{img.caption}</figcaption>}
              </figure>
            </motion.li>
          );
        })}
      </ul>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} – Bild ${active + 1} von ${images.length}`}
            className="on-dark fixed inset-0 z-[80] flex flex-col bg-night/97 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between px-5 py-4 sm:px-8">
              <p className="text-sm text-white/60 tabular-nums">
                {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="grid size-11 place-items-center hover:text-bronze"
                aria-label="Galerie schließen"
              >
                <X className="size-6" strokeWidth={1.5} />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-20">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={active}
                  className="flex h-full max-h-full w-full flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <picture className="contents">
                    <source type="image/avif" srcSet={`/images/${images[active].key}-${imageMeta(images[active].key).widths.at(-1)}.avif`} />
                    <source type="image/webp" srcSet={`/images/${images[active].key}-${imageMeta(images[active].key).widths.at(-1)}.webp`} />
                    <img
                      src={`/images/${images[active].key}-${imageMeta(images[active].key).widths.at(-1)}.jpg`}
                      alt={images[active].alt}
                      className="max-h-[calc(100svh-10rem)] w-auto max-w-full object-contain"
                    />
                  </picture>
                  <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/60">
                    {images[active].isVisualization && <strong className="mr-2 text-bronze">Visualisierung.</strong>}
                    {images[active].caption ?? images[active].alt}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="absolute top-1/2 left-2 grid size-12 -translate-y-1/2 place-items-center bg-white/10 backdrop-blur hover:bg-white hover:text-night sm:left-6"
                    aria-label="Vorheriges Bild"
                  >
                    <ChevronLeft className="size-6" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="absolute top-1/2 right-2 grid size-12 -translate-y-1/2 place-items-center bg-white/10 backdrop-blur hover:bg-white hover:text-night sm:right-6"
                    aria-label="Nächstes Bild"
                  >
                    <ChevronRight className="size-6" strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
