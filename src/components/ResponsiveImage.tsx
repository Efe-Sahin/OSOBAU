import { useT } from '../i18n';
import { bestWidth, imageMeta, imageSrc, srcSet, type SiteImage } from '../data/images';

interface ResponsiveImageProps {
  image: SiteImage;
  /** sizes-Attribut, z. B. "(min-width: 1024px) 50vw, 100vw" */
  sizes?: string;
  /** true für Bilder im ersten Sichtbereich (LCP) – lädt sofort mit hoher Priorität */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Füllt den Elterncontainer (object-cover). Sonst: natürliches Seitenverhältnis. */
  fill?: boolean;
  showVisualizationBadge?: boolean;
}

/**
 * <picture> mit AVIF → WebP → JPEG, responsiven Breiten, festen Maßen
 * (kein Layout-Shift) und unscharfem Platzhalter während des Ladens.
 */
export default function ResponsiveImage({
  image,
  sizes = '100vw',
  priority = false,
  className = '',
  imgClassName = '',
  fill = false,
  showVisualizationBadge = true,
}: ResponsiveImageProps) {
  const meta = imageMeta(image.key);
  const t = useT();

  return (
    <div
      className={`relative overflow-hidden bg-paper-2 ${fill ? 'h-full w-full' : ''} ${className}`}
      style={{
        backgroundImage: `url(${meta.placeholder})`,
        backgroundSize: 'cover',
        backgroundPosition: image.focus ?? 'center',
      }}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet(image.key, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(image.key, 'webp')} sizes={sizes} />
        <img
          src={imageSrc(image.key, bestWidth(image.key), 'jpg')}
          srcSet={srcSet(image.key, 'jpg')}
          sizes={sizes}
          width={meta.width}
          height={meta.height}
          alt={image.alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          style={{ objectPosition: image.focus ?? 'center' }}
          className={`${fill ? 'absolute inset-0 h-full w-full object-cover' : 'block h-auto w-full'} ${imgClassName}`}
        />
      </picture>
      {image.isVisualization && showVisualizationBadge && (
        <span className="absolute top-3 left-3 z-10 bg-night/85 px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm">
          {t.project.visualization}
        </span>
      )}
    </div>
  );
}
