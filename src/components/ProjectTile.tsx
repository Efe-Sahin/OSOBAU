import { Link } from 'react-router';
import ResponsiveImage from './ResponsiveImage';
import { projectLocationLabel, type Project } from '../data/projects';
import { lp, useLang } from '../i18n';
import type { SiteImage } from '../data/images';

/**
 * Projektkachel (dunkle Variante): Hochformat-Foto, Verlauf unten,
 * Ort in Bronze-Mono und Titel in Weiß direkt im Bild. Ganze Kachel verlinkt auf die Projektseite.
 */
export default function ProjectTile({ project, cover }: { project: Project; cover?: SiteImage }) {
  const img = cover ?? project.images[0];
  const lang = useLang();
  return (
    <article className="group @container relative aspect-[3/4] overflow-hidden bg-night-2">
      <ResponsiveImage
        image={img}
        fill
        sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
        imgClassName="transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--overlay)/0)_40%,rgb(var(--overlay)/0.92)_100%)] transition-opacity duration-500"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 p-[clamp(1rem,7cqi,1.6rem)]">
        <p className="font-mono text-[clamp(0.72rem,4cqi,0.85rem)] tracking-[0.08em] text-bronze uppercase">
          {projectLocationLabel(project, lang)}
        </p>
        <h3 className="mt-2 font-display text-[clamp(1.1rem,7cqi,1.6rem)] leading-tight font-bold text-white">
          <Link to={lp(`/projekte/${project.slug}`, lang)} className="after:absolute after:inset-0 after:content-['']">
            {project.title}
          </Link>
        </h3>
        <span
          className="mt-3 block h-px w-8 bg-bronze transition-all duration-500 group-hover:w-16"
          aria-hidden="true"
        />
      </div>
    </article>
  );
}
