/**
 * Kundenstimmen – NUR echte, freigegebene Zitate eintragen
 * (Name/Funktion nur mit schriftlicher Zustimmung der zitierten Person).
 * Solange die Liste leer ist, wird der Abschnitt auf der Website nicht angezeigt.
 */
export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  projectSlug?: string;
}

export const testimonials: Testimonial[] = [];
