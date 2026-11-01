import { Link } from 'react-router';
import { ArrowRight, MapPin } from 'lucide-react';
import ResponsiveImage from './ResponsiveImage';
import { projectLocationLabel, type Project } from '../data/projects';
import { lp, useLang, useT } from '../i18n';
import type { SiteImage } from '../data/images';

interface ProjectCardProps {
  project: Project;
  /** Bildformat der Karte */
  aspect?: 'landscape' | 'portrait' | 'wide';
  sizes?: string;
  headingLevel?: 'h2' | 'h3';
  /** Optional anderes Titelbild (z. B. um Dopplungen auf einer Seite zu vermeiden) */
  coverImage?: SiteImage;
}

const aspects = {
  landscape: 'aspect-[4/3]',
  portrait: 'aspect-[4/3] sm:aspect-[4/5]',
  wide: 'aspect-[16/10] lg:aspect-[16/9]',
};

/** Projektkarte für Übersichten – ganze Karte klickbar, Bild-Zoom bei Hover */
export default function ProjectCard({
  project,
  aspect = 'landscape',
  sizes = '(min-width: 1024px) 50vw, 100vw',
  headingLevel = 'h3',
  coverImage,
}: ProjectCardProps) {
  const H = headingLevel;
  const lang = useLang();
  const t = useT();
  const cover = coverImage ?? project.images[0];

  return (
    <article className="group relative">
      <div className={`relative overflow-hidden ${aspects[aspect]}`}>
        <ResponsiveImage
          image={cover}
          fill
          sizes={sizes}
          imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-night/0 transition-colors duration-500 group-hover:bg-night/15" />
        {project.images.length > 1 && (
          <span className="absolute right-4 bottom-4 bg-paper/90 px-2.5 py-1 text-[0.76rem] font-semibold tracking-[0.12em] text-ink uppercase backdrop-blur-sm">
            {project.images.length} {t.project.images}
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-y-1.5">
        <p className="flex items-center gap-1.5 font-mono text-[0.78rem] tracking-[0.06em] text-stone uppercase">
          {project.location && <MapPin className="size-3.5" strokeWidth={2} aria-hidden="true" />}
          {projectLocationLabel(project, lang)}
        </p>
        <H className="font-display text-[1.45rem] leading-tight font-semibold tracking-[-0.02em] sm:text-[1.65rem]">
          <Link
            to={lp(`/projekte/${project.slug}`, lang)}
            className="link-underline after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </H>
        <p className="flex items-center gap-2 text-[0.95rem] text-stone">
          {project.servicesLabel}
          <ArrowRight
            className="size-4 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </p>
      </div>
    </article>
  );
}
