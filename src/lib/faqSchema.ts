import { getFaqs } from '../data/faq';

export const faqSchema = (lang: 'de' | 'en' = 'de') => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: getFaqs(lang).map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});
