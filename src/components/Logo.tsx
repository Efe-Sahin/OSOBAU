import { site } from '../config/site';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

/**
 * Originallogo von OSOBAU (aus dem gelieferten Bild freigestellt).
 * Für maximale Schärfe sollte vor dem Go-live eine Vektordatei (SVG) ergänzt werden.
 */
export default function Logo({ variant = 'dark', className = 'h-9 w-auto' }: LogoProps) {
  const file = variant === 'dark' ? 'osobau-logo-dunkel' : 'osobau-logo-hell';
  return (
    <picture>
      <source srcSet={`/brand/${file}.webp`} type="image/webp" />
      <img src={`/brand/${file}.png`} alt={site.name} width={1147} height={319} className={className} decoding="async" />
    </picture>
  );
}
