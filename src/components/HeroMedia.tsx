import { useEffect, useState } from 'react';
import ResponsiveImage from './ResponsiveImage';
import { imageSrc, bestWidth, type SiteImage } from '../data/images';
import { site } from '../config/site';

/**
 * Hero-Medium: zeigt ein stummes Loop-Video, wenn in site.ts eines hinterlegt ist,
 * sonst das Foto. Bei prefers-reduced-motion immer das Foto (kein Autoplay).
 */
export default function HeroMedia({ image }: { image: SiteImage }) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const video = site.heroVideo;
  if (!video || reduced) return <ResponsiveImage image={image} fill priority sizes="100vw" />;

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition: image.focus ?? 'center' }}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={imageSrc(image.key, bestWidth(image.key, 1600), 'jpg')}
      aria-label={image.alt}
    >
      {video.webm && <source src={video.webm} type="video/webm" />}
      <source src={video.mp4} type="video/mp4" />
    </video>
  );
}
