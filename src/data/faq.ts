/**
 * Häufige Fragen – zentral gepflegt, wird nur auf der Startseite ausgegeben
 * (keine doppelte FAQ auf anderen Seiten). Antworten vor Go-live von OSOBAU freigeben lassen.
 */
export interface Faq {
  q: string;
  a: string;
  link?: { label: string; to: string };
}

export const faqs: Faq[] = [
  {
    q: 'Welche Leistungen bietet OSOBAU an?',
    a: 'Trockenbau, Kernsanierung und Brandschutzarbeiten im Rahmen des Innenausbaus.',
    link: { label: 'Alle Leistungen', to: '/#leistungen' },
  },
  {
    q: 'Wo ist OSOBAU tätig?',
    a: 'Unser Sitz ist in Berlin, der Schwerpunkt liegt in Berlin und Brandenburg. Referenzprojekte haben wir unter anderem auch in Saarbrücken und Magdeburg ausgeführt. Sprechen Sie uns zu Ihrem Standort an.',
  },
  {
    q: 'Welche Referenzen gibt es?',
    a: 'Unter anderem Trockenbau- und Brandschutzarbeiten bei den Saarterrassen Plaza Nord in Saarbrücken, Trockenbauarbeiten im AOK-Gebäude Magdeburg und in der Tabbertstraße 2–3 in Berlin.',
    link: { label: 'Zu den Projekten', to: '/#projekte' },
  },
  {
    q: 'Was kostet mein Projekt?',
    a: 'Jedes Bauvorhaben ist anders. Ein Angebot erstellen wir auf Grundlage Ihrer Angaben, Pläne oder Leistungsverzeichnisse. Je genauer die Unterlagen, desto belastbarer das Angebot.',
  },
];

export const faqsEn: Faq[] = [
  {
    q: 'What services does OSOBAU offer?',
    a: 'Drywall, full refurbishment and fire protection work as part of interior fit-out.',
    link: { label: 'All services', to: '/#leistungen' },
  },
  {
    q: 'Where does OSOBAU work?',
    a: 'We are based in Berlin and focus on Berlin and Brandenburg. We have also carried out reference projects in Saarbrücken and Magdeburg, among other places. Talk to us about your location.',
  },
  {
    q: 'What references do you have?',
    a: 'Among others, drywall and fire protection work at Saarterrassen Plaza Nord in Saarbrücken, and drywall work in the AOK building in Magdeburg and at Tabbertstraße 2–3 in Berlin.',
    link: { label: 'To the projects', to: '/#projekte' },
  },
  {
    q: 'What will my project cost?',
    a: 'Every construction project is different. We prepare a quote based on your details, plans or bills of quantities. The more precise the documents, the more reliable the quote.',
  },
];

export const getFaqs = (lang: 'de' | 'en') => (lang === 'en' ? faqsEn : faqs);
