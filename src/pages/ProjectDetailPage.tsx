import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { Info } from 'lucide-react';

import Page from '../components/Page';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import ProjectViewer from '../components/ProjectViewer';
import Button from '../components/Button';
import ProjectCard from '../components/ProjectCard';
import CTASection from '../components/CTASection';
import SectionHeader from '../components/SectionHeader';
import NotFoundPage from './NotFoundPage';
import { getProject, getProjects } from '../data/projects';
import { getService } from '../data/services';
import { bestWidth, imageSrc } from '../data/images';
import { breadcrumbSchema } from '../lib/schema';
import { lp, useLang, useT } from '../i18n';

export default function ProjectDetailPage() {
  const { slug = '' } = useParams();
  const lang = useLang();
  const t = useT();
  const pt = t.project;
  const project = getProject(slug, lang);
  if (!project) return <NotFoundPage />;

  const cover = project.images[0];
  const others = getProjects(lang).filter((p) => p.slug !== project.slug).slice(0, 3);
  const hasVisualization = project.images.some((i) => i.isVisualization);
  const linkedServices = project.services.map((s) => getService(s, lang)).filter((svc) => svc !== undefined);

  return (
    <Page>
      <Seo
        title={project.seo.title}
        description={project.seo.description}
        type="article"
        image={imageSrc(cover.key, bestWidth(cover.key), 'jpg')}
        jsonLd={breadcrumbSchema([
          { name: t.nav.start, path: lp('/', lang) },
          { name: project.title, path: lp(`/projekte/${project.slug}`, lang) },
        ])}
      />

      {/* ---------- Kopf: Brotkrumen, Titel, Untertitel, Beschreibung (über dem Bild) ---------- */}
      <header className="pt-32 pb-12 lg:pt-40 lg:pb-14">
        <div className="container-x">
          <Reveal>
            <nav aria-label={pt.crumbsLabel} className="mb-6 text-[0.85rem] text-stone">
              <ol className="flex flex-wrap items-center gap-x-2">
                <li>
                  <Link to={lp('/', lang)} className="inline-block py-1 hover:text-ink">
                    {t.nav.start}
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <Link to={lp('/#projekte', lang)} className="inline-block py-1 hover:text-ink">
                    {t.nav.projects}
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <span aria-current="page" className="text-ink">
                    {project.title}
                  </span>
                </li>
              </ol>
            </nav>
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
              <div className="min-w-0">
                <h1 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-none font-semibold tracking-[-0.03em]">
                  {project.title}
                </h1>
                <p className="mt-4 text-lg text-stone">{project.subtitle}</p>
              </div>
              <Button to={lp('/#kontakt', lang)} variant="outline">
                {pt.similar}
              </Button>
            </div>
            <p className="mt-10 max-w-4xl font-display text-[clamp(1.2rem,2.1vw,1.6rem)] leading-[1.5] font-medium tracking-[-0.01em] lg:mt-12">
              {project.description}
            </p>
          </Reveal>
        </div>
      </header>

      {/* ---------- Bildbetrachter mit Projektdaten ---------- */}
      <div className="container-x pb-24 lg:pb-32">
        <Reveal delay={0.1}>
          <ProjectViewer
            images={project.images}
            title={project.title}
            aside={
              <>
                <h2 className="sr-only">{pt.facts}</h2>
                <dl className="grid gap-6">
                  <Fact label={pt.location}>
                    {project.location?.address ?? project.location?.city ?? pt.noLocation}
                  </Fact>
                  <Fact label={pt.services}>
                    {linkedServices.length > 0 ? (
                      <ul className="grid gap-1">
                        {linkedServices.map((svc) => (
                          <li key={svc.slug}>
                            <Link
                              to={lp(`/#leistung-${svc.slug}`, lang)}
                              className="inline-block py-0.5 underline underline-offset-4 hover:text-bronze"
                            >
                              {svc.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      // z. B. Verputz Q3: Referenz ohne eigene Leistungsseite → nur als Text
                      project.servicesLabel
                    )}
                  </Fact>
                </dl>
                {hasVisualization && (
                  <p className="flex gap-3 border-l-2 border-bronze pl-4 text-sm leading-relaxed text-white/75">
                    <Info className="mt-0.5 size-4 shrink-0 text-bronze" aria-hidden="true" />
                    {pt.visualizationNote}
                  </p>
                )}
              </>
            }
          />
        </Reveal>
      </div>

      {/* ---------- Weitere Referenzen als Bildkacheln ---------- */}
      <section aria-labelledby="more-projects" className="section border-t border-line bg-white">
        <div className="container-x">
          <SectionHeader id="more-projects" title={pt.moreTitle} accent={pt.moreAccent} />
          <ul className="grid gap-x-8 gap-y-14 md:grid-cols-3">
            {others.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.08}>
                <ProjectCard project={p} aspect="landscape" sizes="(min-width: 768px) 33vw, 100vw" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CTASection />
    </Page>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[0.75rem] tracking-[0.08em] text-white/70 uppercase">{label}</dt>
      <dd className="mt-2 text-[1.02rem]">{children}</dd>
    </div>
  );
}
