/**
 * Zentrale Unternehmensangaben
 * ------------------------------------------------------------
 * Quelle: Website-Kundenbriefing (Nexframe Studio, ausgefüllt von OSOBAU, 10/2026)
 *
 * Werte mit `TODO(...)` sind NICHT bestätigt und werden auf der Website
 * sichtbar als Platzhalter markiert (siehe <Placeholder />).
 * Vor Veröffentlichung müssen alle TODO-Werte ersetzt werden.
 */

export type MaybeMissing = string | { todo: string };

export const todo = (hint: string): { todo: string } => ({ todo: hint });
export const isMissing = (v: MaybeMissing): v is { todo: string } => typeof v === 'object';

export const site = {
  name: 'OSOBAU',
  url: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://www.osobau.de',
  tagline: 'Trockenbau · Kernsanierung · Innenausbau',
  shortDescription:
    'OSOBAU steht für fachgerechte Ausführung von Trockenbau-, Sanierungs- und Innenausbauarbeiten – mit Fokus auf präzise Verarbeitung, funktionale Lösungen und professionelle Projektumsetzung.',

  company: {
    /** Laut Briefing: „Inhaberin: Luna Müller“ – Rechtsform ist nicht angegeben. */
    legalForm: todo('Rechtsform (z. B. Einzelunternehmen)') as MaybeMissing,
    owner: 'Luna Müller',
    ownerRole: 'Inhaberin',
    /** Briefing: „Französische str. 10117 Berlin“ – Hausnummer fehlt. */
    street: 'Französische Straße',
    houseNumber: todo('Hausnummer') as MaybeMissing,
    zip: '10117',
    city: 'Berlin',
    country: 'Deutschland',
    /** Im Briefing im Feld „USt-ID“ eingetragen, Format entspricht aber einer Steuernummer → nicht veröffentlichen. */
    vatId: todo('USt-IdNr. (falls vorhanden)') as MaybeMissing,
    register: todo('Handelsregister – nur falls eingetragen') as MaybeMissing,
    chamber: todo('Zuständige Handwerkskammer / Eintragung – prüfen') as MaybeMissing,
  },

  contact: {
    phoneDisplay: '+49 155 66996039',
    phoneHref: 'tel:+4915566996039',
    /** Briefing: Formularanfragen an Kontakt@osobau.de */
    email: 'kontakt@osobau.de',
    /** Briefing: „Gut erreichbar: durchgehend“ – vom Kunden für die Website bestätigt */
    openingHours: 'Durchgehend erreichbar' as MaybeMissing,
    openingHoursEn: 'Available at all times',
  },

  /**
   * Optionales Hero-Video (10–15 s, ohne Ton, ≤ 4 MB, 1920 px breit).
   * Datei nach public/video/ legen und hier eintragen, z. B. { mp4: '/video/osobau-hero.mp4' }.
   * Ohne Eintrag zeigt der Hero das Projektfoto. Bei „reduzierter Bewegung“ bleibt immer das Foto.
   */
  heroVideo: null as null | { mp4: string; webm?: string },

  /** Farbwelt der Website: 'bronze' (Graphit/Bronze) oder 'blau' (Navy/Weiß) */
  palette: 'blau' as 'bronze' | 'blau',

  /** Briefing: Gewünschtes Gebiet „Berlin & Brandenburg“ */
  serviceArea: ['Berlin', 'Brandenburg'],
  referenceLocations: ['Berlin', 'Saarbrücken', 'Magdeburg'],
} as const;

export const fullAddress = () => {
  const c = site.company;
  const no = isMissing(c.houseNumber) ? '' : ` ${c.houseNumber}`;
  return `${c.street}${no}, ${c.zip} ${c.city}`;
};

/** Menüpunkte – Beschriftung je Sprache über `key` aus src/i18n/ui.ts (nav.*) */
export const navItems = [
  { key: 'start', to: '/#start' },
  { key: 'services', to: '/#leistungen' },
  { key: 'about', to: '/#ueber-uns' },
  { key: 'projects', to: '/#projekte' },
  { key: 'faq', to: '/#faq' },
  { key: 'contact', to: '/#kontakt' },
] as const;
