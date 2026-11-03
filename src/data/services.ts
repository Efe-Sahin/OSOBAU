import type { SiteImage } from './images';

/**
 * Leistungen
 * ------------------------------------------------------------
 * Kurztexte laut Master-Prompt / Briefing. Die Leistungsbausteine
 * („scope“) beschreiben typische Inhalte der jeweiligen Leistung und
 * müssen vor Veröffentlichung von OSOBAU bestätigt werden.
 */

/** 'q3-verspachtelung' ist keine eigene Leistung mehr, bleibt aber als Projekt-Referenz (siehe projects.ts) */
export type ServiceSlug = 'trockenbau' | 'kernsanierung' | 'brandschutzarbeiten' | 'q3-verspachtelung';

export interface Service {
  slug: ServiceSlug;
  number: string;
  title: string;
  short: string;
  intro: string;
  scope: string[];
  image: SiteImage;
  /** Hervorhebung laut Briefing (wichtigste Leistungen) */
  highlight?: boolean;
  seo: { title: string; description: string };
}

export const services: Service[] = [
  {
    slug: 'trockenbau',
    number: '01',
    title: 'Trockenbau',
    short: 'Flexible Raumlösungen und fachgerechte Trockenbauarbeiten für Neubau, Ausbau und Modernisierung.',
    intro:
      'Trockenbau schafft Raum – schnell, sauber und anpassungsfähig. OSOBAU führt Trockenbauarbeiten für Neubau, Ausbau und Modernisierung aus und achtet dabei auf präzise Anschlüsse, saubere Kanten und eine fachgerechte Verarbeitung der Systeme.',
    scope: [
      'Wand- und Deckensysteme in Trockenbauweise',
      'Raumaufteilungen und Umbauten im Bestand',
      'Vorsatzschalen und Installationsebenen',
      'Abgehängte Decken und Deckenabkofferungen',
      'Ausbau von Büro-, Gewerbe- und Wohnflächen',
    ],
    image: {
      key: 'saarterrassen-plaza-nord-02',
      alt: 'Bürofläche mit Akustikdecke und farbigen Wandflächen – Referenz AOK-Gebäude Magdeburg',
    },
    highlight: true,
    seo: {
      title: 'Trockenbau in Berlin – Wände, Decken & Ausbau | OSOBAU',
      description:
        'Trockenbau von OSOBAU aus Berlin: Wand- und Deckensysteme, Raumaufteilungen und Ausbauarbeiten – fachgerecht ausgeführt für gewerbliche und öffentliche Bauprojekte.',
    },
  },
  {
    slug: 'kernsanierung',
    number: '02',
    title: 'Kernsanierung',
    short: 'Umfassende Sanierungsmaßnahmen zur baulichen Erneuerung und Modernisierung bestehender Immobilien.',
    intro:
      'Bei einer Kernsanierung wird ein Gebäude im Inneren grundlegend erneuert. OSOBAU unterstützt Eigentümer, Investoren und gewerbliche Auftraggeber dabei, Bestandsimmobilien technisch und funktional auf einen zeitgemäßen Stand zu bringen.',
    scope: [
      'Bauliche Erneuerung und Modernisierung im Bestand',
      'Neuaufbau von Wänden, Decken und Oberflächen',
      'Innenausbau nach der Sanierung',
      'Abstimmung der Ausbauarbeiten im Bauablauf',
    ],
    image: {
      key: 'saarterrassen-plaza-nord-04',
      alt: 'Modernisiertes Gebäude mit heller Fassade – Bildbeispiel',
      focus: '50% 40%',
    },
    highlight: true,
    seo: {
      title: 'Kernsanierung in Berlin – Modernisierung im Bestand | OSOBAU',
      description:
        'Kernsanierung von OSOBAU aus Berlin: umfassende Sanierungsmaßnahmen zur baulichen Erneuerung und Modernisierung bestehender Immobilien.',
    },
  },
  {
    slug: 'brandschutzarbeiten',
    number: '03',
    title: 'Brandschutzarbeiten',
    short:
      'Fachgerechte Trockenbau- und Ausbauarbeiten unter Berücksichtigung der projektbezogenen Brandschutzanforderungen.',
    intro:
      'Viele Ausbauprojekte stellen besondere Anforderungen an den baulichen Brandschutz. OSOBAU führt Trockenbau- und Ausbauarbeiten aus, die die projektbezogenen Vorgaben – etwa aus Planung und Brandschutzkonzept – berücksichtigen.',
    scope: [
      'Trockenbaukonstruktionen mit Brandschutzanforderungen',
      'Ausführung nach Vorgaben aus Planung und Brandschutzkonzept',
      'Brandschutzrelevante Ausbauarbeiten im Rahmen des Innenausbaus',
    ],
    image: {
      key: 'saarterrassen-plaza-nord-01',
      alt: 'Besprechungsraum mit Deckenfläche und Lichtleiste – AOK-Gebäude Magdeburg',
    },
    seo: {
      title: 'Brandschutzarbeiten im Trockenbau | OSOBAU',
      description:
        'Trockenbau- und Ausbauarbeiten von OSOBAU unter Berücksichtigung projektbezogener Brandschutzanforderungen – z. B. bei der Referenz Saarterrassen Plaza Nord.',
    },
  },
];

/** Englische Fassung: nur die auf der Website sichtbaren Felder werden überschrieben */
const servicesEnOverrides: Partial<Record<ServiceSlug, { title: string; short: string; alt: string }>> = {
  trockenbau: {
    title: 'Drywall',
    short: 'Flexible room solutions and professional drywall work for new builds, fit-outs and modernisation.',
    alt: 'Office space with acoustic ceiling and coloured walls – AOK building Magdeburg reference',
  },
  kernsanierung: {
    title: 'Full refurbishment',
    short: 'Comprehensive refurbishment for the structural renewal and modernisation of existing buildings.',
    alt: 'Modernised building with light façade – example image',
  },
  brandschutzarbeiten: {
    title: 'Fire protection work',
    short: 'Professional drywall and fit-out work in line with project-specific fire protection requirements.',
    alt: 'Meeting room with ceiling and light strip – AOK building Magdeburg',
  },
};

export const servicesEn: Service[] = services.map((s) => {
  const o = servicesEnOverrides[s.slug]!;
  return { ...s, title: o.title, short: o.short, image: { ...s.image, alt: o.alt } };
});

export const getServices = (lang: 'de' | 'en') => (lang === 'en' ? servicesEn : services);
export const getService = (slug: string, lang: 'de' | 'en' = 'de') => getServices(lang).find((s) => s.slug === slug);
