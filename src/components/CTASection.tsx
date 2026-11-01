import { Phone } from 'lucide-react';
import Button from './Button';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
import ResponsiveImage from './ResponsiveImage';
import { site } from '../config/site';
import { lp, useLang, useT } from '../i18n';
import type { SiteImage } from '../data/images';

interface CTASectionProps {
  title?: string;
  text?: string;
  image?: SiteImage;
}

/** Abschluss-Sektion mit Anfrage-CTA – auf allen Seiten wiederverwendbar */
export default function CTASection({
  title,
  text,
  image,
}: CTASectionProps) {
  const lang = useLang();
  const t = useT();
  return (
    <section aria-labelledby="cta-title" className={`section on-dark grid bg-night text-white ${image ? 'lg:grid-cols-12' : ''}`}>
      {image && (
        <div className="relative hidden lg:order-2 lg:col-span-4 lg:block">
          <ResponsiveImage image={{ ...image, alt: '' }} fill sizes="33vw" showVisualizationBadge={false} />
        </div>
      )}
      <div className={image ? 'px-5 sm:px-8 lg:col-span-8 lg:pr-16 lg:pl-12 xl:pl-16' : 'container-x'}>
        <SectionHeader dark id="cta-title" title={title ?? t.cta.title} intro={text ?? t.cta.text} className="mb-10! lg:mb-12!" />
        <Reveal className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button to={lp('/#kontakt', lang)} variant="light">
            {t.nav.request}
          </Button>
          <a
            href={site.contact.phoneHref}
            className="inline-flex items-center justify-center gap-3 border border-white/40 px-6 py-3.5 text-[0.9rem] font-semibold transition-colors hover:border-white hover:bg-white hover:text-night"
          >
            <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {site.contact.phoneDisplay}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
