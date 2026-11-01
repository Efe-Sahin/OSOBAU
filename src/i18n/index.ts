import { useLocation } from 'react-router';
import { ui, type UiStrings } from './ui';

/**
 * Zweisprachigkeit DE / EN
 * ------------------------------------------------------------
 * Deutsch ist die Hauptsprache (Pfade ohne Präfix, z. B. /projekte/…).
 * Englisch liegt unter /en (z. B. /en, /en#kontakt, /en/projekte/…).
 * Impressum und Datenschutz gibt es nur auf Deutsch (rechtlich maßgeblich).
 */
export type Lang = 'de' | 'en';

export const langFromPath = (pathname: string): Lang =>
  pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'de';

export function useLang(): Lang {
  return langFromPath(useLocation().pathname);
}

export function useT(): UiStrings {
  return ui[useLang()];
}

/** Nur deutschsprachige Seiten (keine englische Fassung) */
const GERMAN_ONLY = ['/impressum', '/datenschutz'];

/** Deutschen Pfad in die gewünschte Sprache übertragen ("/#kontakt" → "/en#kontakt") */
export function lp(path: string, lang: Lang): string {
  if (lang === 'de') return path;
  if (GERMAN_ONLY.includes(path)) return path;
  if (path === '/' || path === '') return '/en';
  if (path.startsWith('/#') || path.startsWith('/?')) return '/en' + path.slice(1);
  return '/en' + path;
}

/** Startseite der jeweiligen Sprache? */
export const isHomePath = (pathname: string) => pathname === '/' || pathname === '/en' || pathname === '/en/';

/** Pfad der aktuellen Seite in der anderen Sprache (Anker bleibt erhalten) */
export function switchPath(pathname: string, hash: string, to: Lang): string {
  const dePath = langFromPath(pathname) === 'en' ? pathname.replace(/^\/en/, '') || '/' : pathname;
  const base = GERMAN_ONLY.includes(dePath) ? '/' : dePath;
  return lp(base, to) + (hash || '');
}
