import type { SiteImage } from './images';
import type { ServiceSlug } from './services';

/**
 * Referenzprojekte
 * ------------------------------------------------------------
 * Texte und Bildzuordnung laut Kundenbriefing bzw. Angabe von OSOBAU
 * (Bilder in der vom Kunden gelieferten Reihenfolge).
 *
 * Bewusst NICHT enthalten (nicht belegt): Auftraggeber, Laufzeiten,
 * Baukosten, Flächen. Felder erst ergänzen, wenn OSOBAU sie freigibt.
 */

export type ProjectKind = 'projekt' | 'leistungsreferenz';

export interface Project {
  slug: string;
  number: string;
  title: string;
  /** Kurzer Untertitel für Karten */
  subtitle: string;
  kind: ProjectKind;
  location?: {
    address?: string;
    city: string;
  };
  services: ServiceSlug[];
  servicesLabel: string;
  description: string;
  /** Erstes Bild = Titelbild */
  images: SiteImage[];
  seo: { title: string; description: string };
}

export const projects: Project[] = [
  {
    slug: 'saarterrassen-plaza-nord-saarbruecken',
    number: '01',
    title: 'Saarterrassen Plaza Nord',
    subtitle: 'Trockenbau- und Brandschutzarbeiten',
    kind: 'projekt',
    location: { address: 'Konrad-Zuse-Straße 9a–b, 66115 Saarbrücken', city: 'Saarbrücken' },
    services: ['trockenbau', 'brandschutzarbeiten'],
    servicesLabel: 'Trockenbau und Brandschutzarbeiten',
    description:
      'Fachgerechte Ausführung von Trockenbau- und Brandschutzarbeiten im Rahmen der baulichen Ausbauarbeiten am Standort Saarterrassen Plaza Nord in Saarbrücken.',
    images: [
      {
        key: 'saarterrassen-plaza-nord-03',
        alt: 'Fassade des Gebäudes Saarterrassen Plaza Nord in Saarbrücken bei blauem Himmel',
      },
      {
        key: 'saarterrassen-plaza-nord-04',
        alt: 'Gebäudeecke mit Fassadenöffnung im obersten Geschoss – Saarterrassen Plaza Nord, Saarbrücken',
        focus: '50% 40%',
      },
    ],
    seo: {
      title: 'Saarterrassen Plaza Nord, Saarbrücken – Trockenbau & Brandschutz | OSOBAU',
      description:
        'Referenz von OSOBAU: Trockenbau- und Brandschutzarbeiten im Rahmen der Ausbauarbeiten am Standort Saarterrassen Plaza Nord, Konrad-Zuse-Straße 9a–b in Saarbrücken.',
    },
  },
  {
    slug: 'aok-gebaeude-magdeburg',
    number: '02',
    title: 'AOK-Gebäude Magdeburg',
    subtitle: 'Trockenbauarbeiten',
    kind: 'projekt',
    location: { city: 'Magdeburg' },
    services: ['trockenbau'],
    servicesLabel: 'Trockenbauarbeiten',
    description:
      'Fachgerechte Ausführung von Trockenbauarbeiten im AOK-Gebäude in Magdeburg im Rahmen baulicher Ausbau- und Modernisierungsmaßnahmen.',
    images: [
      {
        key: 'aok-gebaeude-magdeburg',
        alt: 'Luftaufnahme des AOK-Gebäudes in Magdeburg mit begrüntem Innenhof',
      },
      {
        /* Dateiname historisch „saarterrassen-…“ – Bild gehört laut OSOBAU zum AOK-Gebäude Magdeburg */
        key: 'saarterrassen-plaza-nord-01',
        alt: 'Besprechungsraum mit dunkler Deckenfläche, Einbauleuchten und linearer Lichtleiste – AOK-Gebäude Magdeburg',
      },
      {
        key: 'saarterrassen-plaza-nord-02',
        alt: 'Offene Bürofläche mit Akustikdecke, farbigen Wandflächen und Stütze – AOK-Gebäude Magdeburg',
      },
    ],
    seo: {
      title: 'AOK-Gebäude Magdeburg – Trockenbauarbeiten | OSOBAU',
      description:
        'Referenz von OSOBAU: Trockenbauarbeiten im AOK-Gebäude in Magdeburg im Rahmen baulicher Ausbau- und Modernisierungsmaßnahmen.',
    },
  },
  {
    slug: 'tabbertstrasse-berlin',
    number: '03',
    title: 'Tabbertstraße 2–3',
    subtitle: 'Trockenbauarbeiten',
    kind: 'projekt',
    location: { address: 'Tabbertstraße 2–3, 12459 Berlin', city: 'Berlin' },
    services: ['trockenbau'],
    servicesLabel: 'Trockenbauarbeiten',
    description:
      'Fachgerechte Durchführung von Trockenbauarbeiten im Rahmen der baulichen Modernisierung am Standort Tabbertstraße 2–3 in Berlin.',
    images: [
      {
        key: 'tabbertstrasse-berlin-visualisierung',
        alt: 'Architekturvisualisierung des Gebäudes Tabbertstraße 2–3 in Berlin am Wasser in der Abenddämmerung',
        isVisualization: true,
        caption: 'Architekturvisualisierung – kein Foto der von OSOBAU ausgeführten Arbeiten.',
      },
    ],
    seo: {
      title: 'Tabbertstraße 2–3, Berlin – Trockenbauarbeiten | OSOBAU',
      description:
        'Referenz von OSOBAU in Berlin: Trockenbauarbeiten im Rahmen der baulichen Modernisierung am Standort Tabbertstraße 2–3, 12459 Berlin.',
    },
  },
  {
    slug: 'verputz-q3',
    number: '04',
    title: 'Verputz in Qualitätsstufe Q3',
    subtitle: 'Leistungsreferenz Oberflächen',
    kind: 'leistungsreferenz',
    services: ['q3-verspachtelung'],
    servicesLabel: 'Verputz in Qualitätsstufe Q3',
    description:
      'Fachgerechter Verputz in Qualitätsstufe Q3 für hochwertige, glatte Wand- und Deckenoberflächen.',
    images: [
      {
        key: 'q3-verspachtelung-01',
        alt: 'Baustelle mit eingerüstetem Gebäude und Treppenturm – Bildmaterial zur Leistungsreferenz Verputz in Qualitätsstufe Q3',
      },
      {
        key: 'q3-verspachtelung-02',
        alt: 'Handwerker auf dem Gerüst einer Baustelle – Bildmaterial zur Leistungsreferenz Verputz in Qualitätsstufe Q3',
        focus: '50% 45%',
      },
    ],
    seo: {
      title: 'Verputz in Qualitätsstufe Q3 – Leistungsreferenz | OSOBAU',
      description:
        'Leistungsreferenz von OSOBAU: Verputz in Qualitätsstufe Q3 für hochwertige, glatte Wand- und Deckenoberflächen.',
    },
  },
];

/** Englische Fassung der sichtbaren Texte (Bilder, Orte und Leistungen bleiben gleich) */
const projectsEnOverrides: Record<
  string,
  Pick<Project, 'title' | 'subtitle' | 'servicesLabel' | 'description' | 'seo'> & { alts: string[]; captions?: string[] }
> = {
  'saarterrassen-plaza-nord-saarbruecken': {
    title: 'Saarterrassen Plaza Nord',
    subtitle: 'Drywall and fire protection work',
    servicesLabel: 'Drywall and fire protection work',
    description:
      'Professional drywall and fire protection work as part of the structural fit-out at the Saarterrassen Plaza Nord site in Saarbrücken.',
    alts: [
      'Façade of the Saarterrassen Plaza Nord building in Saarbrücken under a blue sky',
      'Corner of the building with façade opening on the top floor – Saarterrassen Plaza Nord, Saarbrücken',
    ],
    seo: {
      title: 'Saarterrassen Plaza Nord, Saarbrücken – Drywall & Fire Protection | OSOBAU',
      description:
        'OSOBAU reference: drywall and fire protection work as part of the fit-out at Saarterrassen Plaza Nord, Konrad-Zuse-Straße 9a–b, Saarbrücken.',
    },
  },
  'aok-gebaeude-magdeburg': {
    title: 'AOK Building Magdeburg',
    subtitle: 'Drywall work',
    servicesLabel: 'Drywall work',
    description:
      'Professional drywall work in the AOK building in Magdeburg as part of structural fit-out and modernisation measures.',
    alts: [
      'Aerial view of the AOK building in Magdeburg with green courtyard',
      'Meeting room with dark ceiling, recessed lights and linear light strip – AOK building Magdeburg',
      'Open-plan office with acoustic ceiling, coloured walls and column – AOK building Magdeburg',
    ],
    seo: {
      title: 'AOK Building Magdeburg – Drywall Work | OSOBAU',
      description:
        'OSOBAU reference: drywall work in the AOK building in Magdeburg as part of structural fit-out and modernisation measures.',
    },
  },
  'tabbertstrasse-berlin': {
    title: 'Tabbertstraße 2–3',
    subtitle: 'Drywall work',
    servicesLabel: 'Drywall work',
    description:
      'Professional drywall work as part of the structural modernisation at the Tabbertstraße 2–3 site in Berlin.',
    alts: ['Architectural visualisation of the Tabbertstraße 2–3 building in Berlin by the water at dusk'],
    captions: ['Architectural visualisation – not a photo of the work carried out by OSOBAU.'],
    seo: {
      title: 'Tabbertstraße 2–3, Berlin – Drywall Work | OSOBAU',
      description:
        'OSOBAU reference in Berlin: drywall work as part of the structural modernisation at Tabbertstraße 2–3, 12459 Berlin.',
    },
  },
  'verputz-q3': {
    title: 'Plastering to quality level Q3',
    subtitle: 'Service reference – surfaces',
    servicesLabel: 'Plastering to quality level Q3',
    description: 'Professional plastering to quality level Q3 for high-quality, smooth wall and ceiling surfaces.',
    alts: [
      'Construction site with scaffolded building and stair tower – images for the plastering to quality level Q3 reference',
      'Worker on the scaffolding of a construction site – images for the plastering to quality level Q3 reference',
    ],
    seo: {
      title: 'Plastering to Quality Level Q3 – Service Reference | OSOBAU',
      description: 'OSOBAU service reference: plastering to quality level Q3 for high-quality, smooth wall and ceiling surfaces.',
    },
  },
};

export const projectsEn: Project[] = projects.map((p) => {
  const o = projectsEnOverrides[p.slug];
  return {
    ...p,
    title: o.title,
    subtitle: o.subtitle,
    servicesLabel: o.servicesLabel,
    description: o.description,
    seo: o.seo,
    images: p.images.map((img, i) => ({
      ...img,
      alt: o.alts[i] ?? img.alt,
      caption: img.caption ? (o.captions?.[i] ?? img.caption) : undefined,
    })),
  };
});

export const getProjects = (lang: 'de' | 'en') => (lang === 'en' ? projectsEn : projects);
export const getProject = (slug: string, lang: 'de' | 'en' = 'de') => getProjects(lang).find((p) => p.slug === slug);
export const projectsForService = (slug: ServiceSlug) => projects.filter((p) => p.services.includes(slug));
export const projectLocationLabel = (p: Project, lang: 'de' | 'en' = 'de') =>
  p.location ? p.location.city : p.kind === 'leistungsreferenz' ? (lang === 'en' ? 'Service reference' : 'Leistungsreferenz') : '';
