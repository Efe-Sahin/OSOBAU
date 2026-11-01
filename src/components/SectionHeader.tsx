import type { ReactNode } from 'react';
import Reveal from './Reveal';

interface SectionHeaderProps {
  /** id der Überschrift (für aria-labelledby der Sektion) */
  id: string;
  /** erste Zeile der Überschrift */
  title: ReactNode;
  /** optionale zweite Zeile in Akzentfarbe, z. B. „im Überblick.“ */
  accent?: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
  as?: 'h1' | 'h2';
  className?: string;
}

/**
 * Einheitlicher Abschnittskopf für die ganze Website:
 * zentrierte Überschrift (optional zweizeilig mit Akzentzeile) und zentrierter Einleitungstext.
 * Abstand nach unten ist fest, damit alle Abschnitte denselben Rhythmus haben.
 */
export default function SectionHeader({
  id,
  title,
  accent,
  intro,
  dark = false,
  as: H = 'h2',
  className = '',
}: SectionHeaderProps) {
  return (
    <Reveal className={`mx-auto mb-12 max-w-5xl text-center lg:mb-16 ${className}`}>
      <H id={id} className="section-title">
        <span className="block">{title}</span>
        {accent && ' '}
        {accent && <span className={`block ${dark ? 'text-bronze' : 'text-stone'}`}>{accent}</span>}
      </H>
      {intro && (
        <div className={`lead mx-auto mt-6 max-w-2xl lg:mt-8 ${dark ? 'text-white/75!' : ''}`}>{intro}</div>
      )}
    </Reveal>
  );
}
