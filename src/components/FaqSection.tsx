import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
import { getFaqs } from '../data/faq';
import { lp, useLang, useT } from '../i18n';

/** FAQ als Akkordeon (natives <details>, tastaturbedienbar, ohne JS-Abhängigkeit) */
export default function FaqSection() {
  const lang = useLang();
  const t = useT();
  const faqs = getFaqs(lang);
  return (
    <section id="faq" aria-labelledby="faq-title" className="section bg-white">
      <div className="container-x">
        <SectionHeader
          id="faq-title"
          title={t.faq.title}
          accent={t.faq.accent}
          intro={
            <>
              {t.faq.introBefore}{' '}
              <Link to={lp('/#kontakt', lang)} className="text-ink underline underline-offset-4 hover:text-bronze-ink">
                {t.faq.introLink}
              </Link>
              .
            </>
          }
        />
        <div className="mx-auto max-w-3xl">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <details className="group border-b border-line first:border-t [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-lg font-semibold transition-colors hover:text-bronze-ink">
                  {f.q}
                  <span
                    className="relative size-4 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-4 before:bg-current after:absolute after:top-0 after:left-1/2 after:h-4 after:w-px after:bg-current after:transition-transform after:duration-300 group-open:after:scale-y-0"
                    aria-hidden="true"
                  />
                </summary>
                <div className="max-w-2xl pb-7 leading-relaxed text-stone">
                  <p>{f.a}</p>
                  {f.link && (
                    <Link
                      to={lp(f.link.to, lang)}
                      className="mt-3 inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-ink hover:text-bronze-ink"
                    >
                      {f.link.label}
                      <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
