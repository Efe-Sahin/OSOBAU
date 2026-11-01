import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Check, Phone } from 'lucide-react';

import Page from '../components/Page';
import Seo from '../components/Seo';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import ProjectTile from '../components/ProjectTile';
import ResponsiveImage from '../components/ResponsiveImage';
import ContactForm from '../components/ContactForm';
import Placeholder from '../components/Placeholder';
import HeroMedia from '../components/HeroMedia';
import ServiceCard from '../components/ServiceCard';
import { getServices } from '../data/services';
import { getAudiences } from '../data/audiences';
import { testimonials } from '../data/testimonials';
import FaqSection from '../components/FaqSection';
import { getProjects } from '../data/projects';
import { lp, useLang, useT } from '../i18n';
import { fullAddress, isMissing, site } from '../config/site';
import { organizationSchema } from '../lib/schema';
import { faqSchema } from '../lib/faqSchema';
import type { SiteImage } from '../data/images';


/*
 * Bildverteilung Startseite – jedes Motiv genau einmal:
 *   Hero: AOK-Luftbild · Leistungen: Saarterrassen -02, -04, -01
 *   Projekte: Saarterrassen -03, AOK, Tabbertstraße, Q3 -01 · Über uns: Saarterrassen -01
 */
export default function HomePage() {
  const lang = useLang();
  const t = useT();
  const h = t.home;
  const services = getServices(lang);
  const projects = getProjects(lang);
  const audienceEntries = getAudiences(lang);
  const steps = h.steps;

  const heroImage: SiteImage = { key: 'aok-gebaeude-magdeburg-luftbild', alt: h.heroAlt, focus: '50% 45%' };
  const heroCaption = { label: projects[1].title, to: lp(`/projekte/${projects[1].slug}`, lang) };
  /** Über uns: Besprechungsraum Saarterrassen (Innenausbau) */
  const aboutImage: SiteImage = { ...projects[0].images[1] };
  /** Alle Referenzen mit ihrem Titelbild (Q3 ist keine Leistung mehr, nur noch Projekt-Referenz) */
  const homeProjects = projects.map((p) => ({ project: p, cover: p.images[0] }));

  return (
    <Page>
      <Seo
        title={h.seoTitle}
        description={h.seoDescription}
        jsonLd={[organizationSchema(), faqSchema(lang)]}
      />

      {/* ---------- Hero: bildschirmfüllendes Luftbild (AOK-Gebäude Magdeburg) ---------- */}
      <section id="start" aria-labelledby="hero-title" className="on-dark relative isolate flex min-h-[100svh] items-end overflow-hidden bg-night text-white">
        <motion.div
          className="absolute inset-0 -z-20"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroMedia image={heroImage} />
        </motion.div>
        {/* Grundabdunklung (mobil stärker) + Verläufe dort, wo Text steht */}
        <div className="absolute inset-0 -z-10 bg-night/40 lg:bg-night/20" aria-hidden="true" />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(var(--overlay)/0.55)_0%,rgb(var(--overlay)/0.05)_22%,rgb(var(--overlay)/0.3)_50%,rgb(var(--overlay)/0.9)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(var(--overlay)/0.6)_0%,rgb(var(--overlay)/0.15)_55%,rgb(var(--overlay)/0)_100%)]"
          aria-hidden="true"
        />

        <div className="container-x w-full pt-32 pb-8 lg:pb-10">
          <motion.h1
            id="hero-title"
            className="font-display text-[clamp(2.75rem,7.6vw,7.75rem)] leading-[0.98] font-semibold tracking-[-0.03em]"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <span className="block">{h.hero1}</span>{' '}
            <span className="block text-white/90 lg:pl-[22%]">{h.hero2}</span>
          </motion.h1>

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end">
            {/* Buttons links – Hauptaktion zuerst */}
            <motion.div
              className="order-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:order-1 lg:col-span-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
            >
              <Button to={lp('/#kontakt', lang)} variant="light" className="sm:px-8 sm:py-4">
                {t.nav.request}
              </Button>
              <Button to={lp('/#leistungen', lang)} variant="outline-light" icon={false} className="sm:px-8 sm:py-4">
                {h.heroServices}
              </Button>
            </motion.div>

            {/* Text rechts */}
            <motion.div
              className="order-1 max-w-lg lg:order-2 lg:col-span-5 lg:col-start-8 lg:justify-self-end"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <p className="text-[1.1rem] leading-relaxed text-white sm:text-[1.25rem]">
                {h.heroLead}
              </p>
              <p className="mt-3 leading-relaxed text-white/70">
                {h.heroText}
              </p>
              <a
                href={site.contact.phoneHref}
                className="mt-5 inline-flex items-center gap-2 text-[0.95rem] font-medium text-white/85 hover:text-white"
              >
                <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
                <span className="link-underline">{site.contact.phoneDisplay}</span>
              </a>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 grid gap-3 border-t border-white/25 pt-5 sm:grid-cols-3 lg:mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="font-mono text-[0.78rem] tracking-[0.06em] text-white/80 uppercase">
              {h.reference} ·{' '}
              <Link to={heroCaption.to} className="link-underline inline-block py-1 text-white">
                {heroCaption.label}
              </Link>
            </span>
            <span className="font-mono text-[0.78rem] tracking-[0.06em] text-white/80 uppercase sm:text-center">
              {h.focus} · <span className="text-white">{site.serviceArea.join(' & ')}</span>
            </span>
            <span className="font-mono text-[0.78rem] tracking-[0.06em] text-white/80 uppercase sm:text-right">
              {h.references} · <span className="text-white">{site.referenceLocations.join(', ')}</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* ---------- Leistungen ---------- */}
      <section id="leistungen" aria-labelledby="services-title" className="section bg-paper">
        <div className="container-x">
          <SectionHeader
            id="services-title"
            title={h.servicesTitle}
            accent={h.servicesAccent}
            intro={h.servicesIntro}
          />

          {/* Vier Karten nebeneinander: Foto, Titel, Kurztext */}
          <ul className="grid gap-5 md:grid-cols-3 lg:gap-6">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={i * 0.06}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Über uns ---------- */}
      {/* Variante B: Projektfoto links, Text rechts (Texte SEO/GEO-optimiert) */}
      <section id="ueber-uns" aria-labelledby="about-title" className="section bg-white">
        <div className="container-x">
          <SectionHeader id="about-title" title={h.aboutTitle} accent={h.aboutAccent} />
        </div>
        <div className="container-x grid gap-10 md:grid-cols-2 md:items-stretch md:gap-14 lg:gap-20">
          {/* Bild passt sich der Höhe des Textblocks an */}
          <Reveal className="h-full">
            <div className="relative aspect-[4/3] h-full overflow-hidden md:aspect-auto md:min-h-[420px]">
              <ResponsiveImage image={aboutImage} fill sizes="(min-width: 768px) 46vw, 100vw" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-center md:py-6">
            <h3 className="display-md hyphens-manual">{h.aboutHeading}</h3>
            <p className="mt-6 text-[1.1rem] leading-relaxed text-ink/85">{h.aboutP1}</p>
            <p className="mt-5 leading-relaxed text-stone">{h.aboutP2}</p>
          </Reveal>
        </div>

        {/* Wofür wir stehen – Unterscheidungsmerkmale laut Briefing: Erfahrung, Qualität, Spezialisierung */}
        <div className="container-x mt-16 lg:mt-24">
          <Reveal>
            <h3 className="display-md text-center">{h.valuesTitle}</h3>
          </Reveal>
          <ul className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12 lg:gap-6">
            {h.values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.08} className="min-w-0 border border-line bg-paper p-7 lg:p-9">
                <span className="font-mono text-[0.8rem] tracking-[0.06em] text-bronze-ink" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4 className="mt-4 font-display text-xl font-semibold tracking-[-0.01em]">{v.title}</h4>
                <p className="mt-3 leading-relaxed text-stone">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Projekte ---------- */}
      <section id="projekte" aria-labelledby="projects-title" className="section on-dark bg-night text-white">
        <div className="container-x">
          <SectionHeader
            dark
            id="projects-title"
            title={h.projectsTitle}
            accent={h.projectsAccent}
            intro={h.projectsIntro}
          />
          {/* Vier Hochformat-Kacheln mit Text im Bild */}
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {homeProjects.map(({ project: p, cover }, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.06}>
                <ProjectTile project={p} cover={cover} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Kundenstimmen (nur sichtbar, wenn echte, freigegebene Zitate vorliegen) ---------- */}
      {testimonials.length > 0 && (
        <section aria-labelledby="testimonials-title" className="section bg-paper">
          <div className="container-x">
            <SectionHeader id="testimonials-title" title={h.testimonialsTitle} />
            <ul className="grid gap-10 md:grid-cols-2">
              {testimonials.map((q) => (
                <Reveal as="li" key={q.author}>
                  <figure className="border-l-2 border-bronze pl-6">
                    <blockquote className="font-display text-xl leading-snug font-medium">„{q.quote}“</blockquote>
                    <figcaption className="mt-4 text-sm text-stone">
                      {q.author}
                      {q.role && `, ${q.role}`}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Zwei Einstiege nach Auftraggeber ---------- */}
      <section id="auftraggeber" aria-labelledby="audience-title" className="section bg-white">
        <div className="container-x">
          <SectionHeader
            id="audience-title"
            title={h.audienceTitle}
            accent={h.audienceAccent}
            intro={h.audienceIntro}
          />
          <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
            {audienceEntries.map((e, i) => (
              <Reveal
                key={e.type}
                delay={i * 0.08}
                className={i === 0 ? 'on-dark border border-night bg-night text-white' : 'border border-line bg-paper'}
              >
                <article className="flex h-full flex-col p-8 sm:p-10 lg:p-14">
                  <h3 className="display-md">
                    {e.title}
                  </h3>
                  <p className={`mt-4 max-w-md leading-relaxed ${i === 0 ? 'text-white/70' : 'text-stone'}`}>{e.text}</p>
                  <ul className="mt-8 grid gap-3 text-[0.95rem]">
                    {e.points.map((pt) => (
                      <li key={pt} className="flex gap-3">
                        <Check
                          className={`mt-1 size-4 shrink-0 ${i === 0 ? 'text-bronze' : 'text-bronze-ink'}`}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-10">
                    <Button to={lp(`/?auftraggeber=${e.type}#kontakt`, lang)} variant={i === 0 ? 'light' : 'primary'}>
                      {e.cta}
                    </Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Ablauf ---------- */}
      <section id="ablauf" aria-labelledby="process-title" className="section bg-paper">
        <div className="container-x">
          <SectionHeader id="process-title" title={h.processTitle} accent={h.processAccent} />

          {/* Schritte mit Fortschrittsbalken */}
          <ol className="grid gap-10 md:grid-cols-3 md:gap-6">
            {steps.map((s, i) => {
              const n = String(i + 1).padStart(2, '0');
              const total = String(steps.length).padStart(2, '0');
              return (
                <Reveal as="li" key={s.title} delay={i * 0.08} className="min-w-0">
                  <div className="mb-3 flex justify-between font-mono text-[0.8rem] tracking-[0.06em] uppercase">
                    <span className="text-bronze-ink">
                      {h.step} {n}
                    </span>
                    <span className="text-stone">
                      <span className="sr-only">
                        {h.step} {i + 1}{' '}
                      </span>
                      {h.of} {total}
                    </span>
                  </div>
                  <div className="relative mb-6 h-1 bg-line" aria-hidden="true">
                    <span
                      className="absolute inset-y-0 left-0 bg-bronze-ink"
                      style={{ width: `${((i + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                  <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">{s.title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-stone">{s.text}</p>
                </Reveal>
              );
            })}
          </ol>
          <Reveal className="mt-12 text-center lg:mt-16">
            <Button to={lp('/#kontakt', lang)}>{t.nav.request}</Button>
          </Reveal>
        </div>
      </section>

      <FaqSection />

      {/* ---------- Kontakt ---------- */}
      <section id="kontakt" aria-labelledby="contact-title" className="bg-paper pb-20 lg:pb-28">
        {/* Dunkles Banner mit Überschrift */}
        <div className="on-dark bg-night pt-24 pb-36 text-white lg:pt-32 lg:pb-48">
          <div className="container-x">
            <SectionHeader
              dark
              id="contact-title"
              title={h.contactTitle}
              accent={h.contactAccent}
              intro={h.contactIntro}
              className="mb-0! lg:mb-0!"
            />
          </div>
        </div>

        {/* Weiße Karte überlappt das Banner: links Formular, rechts direkter Kontakt */}
        <div className="container-x">
          <Reveal
            delay={0.1}
            className="relative -mt-24 grid border border-line bg-white shadow-[0_30px_60px_-30px_rgb(11_37_69/0.35)] lg:-mt-32 lg:grid-cols-12"
          >
            <div className="min-w-0 p-6 sm:p-10 lg:col-span-8 lg:p-12">
              <ContactForm />
            </div>
            <aside className="min-w-0 bg-paper-2 p-6 sm:p-10 lg:col-span-4">
              <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">{h.directContact}</h3>
              <dl className="mt-6 grid gap-6">
                <div>
                  <dt className="text-sm text-stone">{h.phone}</dt>
                  <dd className="mt-1 text-lg font-medium">
                    <a href={site.contact.phoneHref} className="link-underline">
                      {site.contact.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-stone">{h.email}</dt>
                  <dd className="mt-1 text-lg font-medium break-all">
                    <a href={`mailto:${site.contact.email}`} className="link-underline">
                      {site.contact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-stone">{h.address}</dt>
                  <dd className="mt-1">
                    {site.name}, {fullAddress()}
                    {isMissing(site.company.houseNumber) && (
                      <span className="mt-2 block">
                        <Placeholder value={site.company.houseNumber} />
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-stone">{h.availability}</dt>
                  <dd className="mt-1">
                    {lang === 'en' ? site.contact.openingHoursEn : <Placeholder value={site.contact.openingHours} />}
                  </dd>
                </div>
              </dl>
            </aside>
          </Reveal>
        </div>
      </section>
    </Page>
  );
}
