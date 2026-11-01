/**
 * Zwei Einstiege für die Zielgruppen aus dem Briefing
 * („Gewerbe Kunden, öffentliche Ausschreibung und Investoren“).
 * `type` wird als Vorauswahl an das Anfrageformular übergeben.
 */
export interface AudienceEntry {
  type: 'oeffentlich' | 'gewerblich';
  title: string;
  text: string;
  points: string[];
  cta: string;
}

export const audienceEntries: AudienceEntry[] = [
  {
    type: 'oeffentlich',
    title: 'Öffentliche Auftraggeber',
    text: 'Senden Sie uns Ausschreibungsunterlagen oder Ihr Leistungsverzeichnis. Auf dieser Grundlage prüfen und kalkulieren wir die Ausbauleistungen.',
    points: [
      'Trockenbau- und Ausbauleistungen nach Leistungsverzeichnis',
      'Ausführung nach Vorgaben aus Planung und Brandschutzkonzept',
      'Unterlagen gern per E-Mail an uns senden',
    ],
    cta: 'Ausschreibung senden',
  },
  {
    type: 'gewerblich',
    title: 'Gewerbe, Investoren & Bauunternehmen',
    text: 'Ausbau und Modernisierung von Büro-, Gewerbe- und Verwaltungsflächen, im Neubau ebenso wie im Bestand.',
    points: [
      'Trockenbau und Innenausbau für Neubau- und Bestandsprojekte',
      'Kernsanierung bestehender Immobilien',
      'Brandschutzarbeiten im Rahmen des Innenausbaus',
    ],
    cta: 'Projekt anfragen',
  },
];

export const clientTypeLabel: Record<AudienceEntry['type'] | 'privat', string> = {
  oeffentlich: 'Öffentlicher Auftraggeber',
  gewerblich: 'Gewerbe / Investor / Bauunternehmen',
  privat: 'Privater Bauherr',
};

export const audienceEntriesEn: AudienceEntry[] = [
  {
    type: 'oeffentlich',
    title: 'Public clients',
    text: 'Send us tender documents or your bill of quantities. On this basis, we review and calculate the fit-out work.',
    points: [
      'Drywall and fit-out work according to the bill of quantities',
      'Execution in line with planning and fire protection requirements',
      'Feel free to send us documents by email',
    ],
    cta: 'Send tender',
  },
  {
    type: 'gewerblich',
    title: 'Businesses, investors & contractors',
    text: 'Fit-out and modernisation of office, commercial and administrative space, in new buildings as well as existing ones.',
    points: [
      'Drywall and interior fit-out for new and existing buildings',
      'Full refurbishment of existing properties',
      'Fire protection work as part of interior fit-out',
    ],
    cta: 'Request a project',
  },
];

export const clientTypeLabelEn: Record<AudienceEntry['type'] | 'privat', string> = {
  oeffentlich: 'Public client',
  gewerblich: 'Business / investor / contractor',
  privat: 'Private client',
};

export const getAudiences = (lang: 'de' | 'en') => (lang === 'en' ? audienceEntriesEn : audienceEntries);
export const getClientTypeLabel = (lang: 'de' | 'en') => (lang === 'en' ? clientTypeLabelEn : clientTypeLabel);
