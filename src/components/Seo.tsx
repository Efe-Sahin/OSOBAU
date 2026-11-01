import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { site } from '../config/site';
import { langFromPath, switchPath } from '../i18n';

interface SeoProps {
  title: string;
  description: string;
  /** Absoluter oder relativer Pfad zu einem Bild (1200×630 empfohlen) */
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  /** Strukturierte Daten (schema.org), werden als JSON-LD ausgegeben */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setAlternate(hreflang: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = 'alternate';
    el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Setzt Title, Description, Canonical, Open Graph und JSON-LD je Seite. */
export default function Seo({ title, description, image = '/og-image.jpg', type = 'website', noindex, jsonLd }: SeoProps) {
  const { pathname } = useLocation();
  const ld = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const url = `${site.url}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;
    const img = image.startsWith('http') ? image : `${site.url}${image}`;

    // Sprache der Seite + Sprachvarianten für Suchmaschinen (hreflang)
    const lang = langFromPath(pathname);
    document.documentElement.lang = lang;
    setMeta('property', 'og:locale', lang === 'en' ? 'en_GB' : 'de_DE');
    const abs = (p: string) => `${site.url}${p === '/' ? '/' : p.replace(/\/$/, '')}`;
    setAlternate('de', abs(switchPath(pathname, '', 'de')));
    setAlternate('en', abs(switchPath(pathname, '', 'en')));
    setAlternate('x-default', abs(switchPath(pathname, '', 'de')));

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setLink('canonical', url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    const id = 'ld-json-page';
    document.getElementById(id)?.remove();
    if (ld) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = id;
      s.textContent = ld;
      document.head.appendChild(s);
    }
  }, [title, description, image, type, noindex, ld, pathname]);

  return null;
}
