import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useActiveSection, useAnchorNav } from '../lib/useAnchorNav';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';

import Logo from './Logo';
import { navItems, site } from '../config/site';
import { getServices } from '../data/services';
import { isHomePath, lp, switchPath, useLang, useT, type Lang } from '../i18n';

/**
 * Sticky Header.
 * Auf der Startseite liegt er transparent über dem Hero (helles Logo)
 * und wird beim Scrollen zu einer ruhigen, hellen Leiste.
 */
export default function Navbar() {
  const { pathname, hash } = useLocation();
  const lang = useLang();
  const t = useT();
  const services = getServices(lang);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Nur die Startseite beginnt mit einem dunklen Bild-Hero → Header startet dort transparent
  const isHome = isHomePath(pathname);
  const overHero = isHome && !scrolled && !open;
  const anchorNav = useAnchorNav();
  const activeId = useActiveSection(
    navItems.map((i) => i.to.split('#')[1]),
    isHome,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menü bei Seitenwechsel schließen
  useEffect(() => setOpen(false), [pathname]);

  // Body-Scroll sperren + Escape schließt das Menü
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Inhalt hinter dem Menü für Tastatur und Screenreader sperren, Fokus ins Menü setzen
    const behind = Array.from(document.querySelectorAll<HTMLElement>('main, footer'));
    behind.forEach((el) => el.setAttribute('inert', ''));
    requestAnimationFrame(() => document.querySelector<HTMLElement>('#mobile-menu a')?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      behind.forEach((el) => el.removeAttribute('inert'));
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
        open
          ? 'on-dark bg-night text-white'
          : overHero
            ? 'on-dark bg-transparent text-white'
            : 'bg-paper/90 text-ink shadow-[0_1px_0_0_var(--color-line)] backdrop-blur-md'
      }`}
    >
      <div
        className={`container-x flex items-center justify-between gap-6 transition-[height] duration-300 ${
          scrolled && !open ? 'h-16 lg:h-[4.25rem]' : 'h-[4.5rem] lg:h-20'
        }`}
      >
        <Link to={lp('/', lang)} className="relative z-10 shrink-0" aria-label={t.nav.home}>
          <Logo variant={overHero || open ? 'light' : 'dark'} className="h-8 w-auto sm:h-9 lg:h-10" />
        </Link>

        <nav aria-label={t.nav.main} className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-9">
            {navItems.map((item) => (
              <li key={item.to} className={item.to === '/#leistungen' ? 'group/dd relative' : undefined}>
                <Link
                  to={lp(item.to, lang)}
                  onClick={anchorNav(lp(item.to, lang))}
                  aria-current={activeId === item.to.split('#')[1] ? 'location' : undefined}
                  className={`relative inline-flex items-center py-2 text-[0.9rem] font-medium tracking-[0.01em] whitespace-nowrap transition-opacity hover:opacity-100 ${
                      activeId === item.to.split('#')[1] ? 'opacity-100' : 'opacity-75'
                    } after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-bronze after:transition-all after:duration-500 ${
                      activeId === item.to.split('#')[1] ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                    }`}
                >
                  {t.nav[item.key]}
                  {item.to === '/#leistungen' && (
                    <ChevronDown
                      className="ml-1 inline size-3.5 transition-transform group-hover/dd:rotate-180 group-focus-within/dd:rotate-180"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                </Link>
                {item.to === '/#leistungen' && (
                  /* Aufklapp-Menü: öffnet bei Hover und bei Tastaturfokus */
                  <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 transition-opacity duration-200 group-focus-within/dd:pointer-events-auto group-focus-within/dd:opacity-100 group-hover/dd:pointer-events-auto group-hover/dd:opacity-100">
                    <ul className="w-64 border border-line bg-white py-2 text-ink shadow-[0_12px_32px_-12px_rgba(23,25,27,0.25)]">
                      {services.map((svc) => (
                        <li key={svc.slug}>
                          <Link
                            to={lp(`/#leistung-${svc.slug}`, lang)}
                            onClick={anchorNav(lp(`/#leistung-${svc.slug}`, lang))}
                            className="block px-5 py-2.5 text-[0.92rem] transition-colors hover:bg-paper hover:text-bronze-ink"
                          >
                            {svc.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-4">
          <LangSwitch
            lang={lang}
            label={t.nav.language}
            hrefFor={(l) => switchPath(pathname, isHome && activeId ? `#${activeId}` : hash, l)}
          />
          <a
            href={site.contact.phoneHref}
            className="hidden items-center gap-2 text-[0.85rem] font-medium opacity-80 transition-opacity hover:opacity-100 xl:inline-flex"
          >
            <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {site.contact.phoneDisplay}
          </a>
          <Link
            to={lp('/#kontakt', lang)}
            onClick={anchorNav(lp('/#kontakt', lang))}
            className={`hidden px-5 py-2.5 text-[0.85rem] font-semibold transition-colors duration-300 sm:inline-flex ${
              overHero || open ? 'bg-white text-night hover:bg-bronze' : 'bg-night text-white hover:bg-bronze hover:text-night'
            }`}
          >
            {t.nav.request}
          </Link>
          <a
            href={site.contact.phoneHref}
            className="grid size-11 place-items-center sm:hidden"
            aria-label={`${t.nav.call}: ${site.contact.phoneDisplay}`}
          >
            <Phone className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 grid size-11 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            className="on-dark fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto bg-night text-white lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label={t.nav.mobile} className="container-x flex min-h-full flex-col pt-8 pb-10">
              <ul className="border-t border-line-dark">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.to}
                    className="border-b border-line-dark"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.45 }}
                  >
                    <Link
                      to={lp(item.to, lang)}
                      onClick={(e) => {
                        anchorNav(lp(item.to, lang))(e);
                        setOpen(false);
                      }}
                      className={`block py-4 font-display text-[1.6rem] font-semibold tracking-[-0.02em] ${
                          activeId === item.to.split('#')[1] ? 'text-bronze' : 'text-white'
                        }`}
                    >
                      {t.nav[item.key]}
                    </Link>
                    {item.to === '/#leistungen' && (
                      <ul className="-mt-2 grid grid-cols-2 gap-x-4 gap-y-2 pb-5">
                        {services.map((svc) => (
                          <li key={svc.slug}>
                            <Link
                              to={lp(`/#leistung-${svc.slug}`, lang)}
                              onClick={(e) => {
                                anchorNav(lp(`/#leistung-${svc.slug}`, lang))(e);
                                setOpen(false);
                              }}
                              className="text-[0.95rem] text-white/70 hover:text-white"
                            >
                              {svc.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto grid gap-3 pt-10">
                <Link
                  to={lp('/#kontakt', lang)}
                  onClick={(e) => {
                    anchorNav(lp('/#kontakt', lang))(e);
                    setOpen(false);
                  }}
                  className="bg-white px-6 py-4 text-center font-semibold text-night"
                >
                  {t.nav.request}
                </Link>
                <a
                  href={site.contact.phoneHref}
                  className="flex items-center justify-center gap-2 border border-white/25 px-6 py-4 font-medium"
                >
                  <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  {site.contact.phoneDisplay}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Sprachumschalter DE / EN – behält den aktuellen Abschnitt bei */
function LangSwitch({ lang, label, hrefFor }: { lang: Lang; label: string; hrefFor: (l: Lang) => string }) {
  return (
    <nav aria-label={label}>
      <ul className="flex items-center font-mono text-[0.8rem] font-medium tracking-[0.06em]">
        {(['de', 'en'] as const).map((l, i) => (
          <li key={l} className="flex items-center">
            {i > 0 && (
              <span className="opacity-40" aria-hidden="true">
                /
              </span>
            )}
            <Link
              to={hrefFor(l)}
              lang={l}
              hrefLang={l}
              aria-label={l === 'de' ? 'Deutsch' : 'English'}
              aria-current={l === lang ? 'true' : undefined}
              className={`grid h-11 min-w-9 place-items-center px-1 uppercase transition-opacity ${
                l === lang ? 'underline decoration-bronze decoration-2 underline-offset-[6px]' : 'opacity-60 hover:opacity-100'
              }`}
            >
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
