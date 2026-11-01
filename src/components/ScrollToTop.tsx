import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { NAV_TARGET_EVENT } from '../lib/useAnchorNav';

/**
 * Scroll-Steuerung für alle Links der Website:
 * - Link auf einen Abschnitt (/#kontakt, /#leistung-…): weich dorthin scrollen –
 *   auch wenn man schon dort ist oder von einer Unterseite kommt
 *   (dann beginnt die Startseite oben und gleitet zum Abschnitt).
 * - Link auf eine andere Seite (z. B. /projekte/…): neue Seite startet oben.
 * - Link auf die aktuelle Seite ohne Anker (z. B. Logo): weich nach oben.
 * Bei „Bewegung reduzieren“ im Betriebssystem wird ohne Animation gesprungen.
 */
export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth';
    const firstRender = prevPath.current === null;
    const pageChanged = !firstRender && prevPath.current !== pathname;
    prevPath.current = pathname;

    if (pageChanged) window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    if (!hash) {
      if (!pageChanged && !firstRender) window.scrollTo({ top: 0, left: 0, behavior });
      return;
    }

    // Abschnitt suchen – nach einem Seitenwechsel kann er kurz noch fehlen
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const timer = window.setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 40) {
        window.clearInterval(timer);
        // ein Frame Pause, damit z. B. das Handy-Menü geschlossen und der Scroll-Lock aufgehoben ist
        if (el) {
          // Menü-Markierung sofort auf das Ziel setzen (nicht unterwegs über andere Abschnitte springen)
          window.dispatchEvent(new CustomEvent(NAV_TARGET_EVENT, { detail: id }));
          requestAnimationFrame(() => el.scrollIntoView({ behavior, block: 'start' }));
        }
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [pathname, hash, key]);

  return null;
}
