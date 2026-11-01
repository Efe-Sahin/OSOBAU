import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { MouseEvent } from 'react';
import { isHomePath } from '../i18n';

/** Klick auf "/#abschnitt" auf der Startseite: Anker setzen ohne neuen Verlaufseintrag (Scrollen: ScrollToTop). */
export function useAnchorNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return useCallback(
    (to: string) => (e: MouseEvent) => {
      const [path, id] = to.split('#');
      if (!id || !(path === '' || isHomePath(path))) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (isHomePath(pathname) && (path === '' || path === pathname)) {
        e.preventDefault();
        // Ohne neuen Verlaufseintrag; das weiche Scrollen übernimmt <ScrollToTop />
        navigate(`${pathname}#${id}`, { replace: true });
      }
    },
    [pathname, navigate],
  );
}

/** Ereignis, mit dem ScrollToTop das Ziel eines Klicks meldet (Markierung springt sofort dorthin) */
export const NAV_TARGET_EVENT = 'osobau:navtarget';

/** Unter-Anker auf ihren Menüpunkt abbilden (z. B. „leistung-trockenbau“ → „leistungen“) */
const toNavId = (id: string) => (id.startsWith('leistung-') ? 'leistungen' : id);

/**
 * Scrollspy für das Menü.
 * - Aktiv ist der Abschnitt, dessen Oberkante zuletzt die Linie bei 35 % der Bildschirmhöhe überschritten hat.
 * - Am Seitenende ist immer der letzte Abschnitt (Kontakt) aktiv – auch wenn er kürzer als der Bildschirm ist.
 * - Liegt man in einem Abschnitt ohne Menüpunkt (z. B. Ablauf), wird nichts unterstrichen.
 * - Nach einem Klick steht die Markierung sofort auf dem Ziel und bleibt dort, bis das Scrollen endet.
 */
export function useActiveSection(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    let locked = false;
    let idle = 0;
    let frame = 0;

    const compute = () => {
      frame = 0;
      if (locked) return;
      const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
      if (!sections.length) return;
      const line = window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = sections[sections.length - 1].id;
      setActive(ids.includes(current) ? current : null);
    };
    const onScroll = () => {
      if (locked) {
        // Sperre lösen, sobald das weiche Scrollen zur Ruhe kommt
        window.clearTimeout(idle);
        idle = window.setTimeout(() => {
          locked = false;
          compute();
        }, 140);
        return;
      }
      if (!frame) frame = requestAnimationFrame(compute);
    };
    const onTarget = (e: Event) => {
      const id = toNavId((e as CustomEvent<string>).detail);
      if (!ids.includes(id)) return;
      locked = true;
      setActive(id);
      // Falls gar nicht gescrollt wird (Ziel schon erreicht), Sperre trotzdem wieder lösen
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        locked = false;
        compute();
      }, 1200);
    };

    compute();
    const late = window.setTimeout(compute, 400); // nach dem ersten Rendern/Bilder-Laden erneut prüfen
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener(NAV_TARGET_EVENT, onTarget);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener(NAV_TARGET_EVENT, onTarget);
      window.clearTimeout(idle);
      window.clearTimeout(late);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids.join(','), enabled]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}
