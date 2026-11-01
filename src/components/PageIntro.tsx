import type { ReactNode } from 'react';
import { Link } from 'react-router';
import Reveal from './Reveal';

interface PageIntroProps {
  title: ReactNode;
  intro?: ReactNode;
  /** Brotkrumen-Navigation über der Headline */
  crumbs?: { label: string; to?: string }[];
}

/** Schlichter Seitenkopf ohne Bild – Bilder folgen darunter in voller Sichtbarkeit */
export default function PageIntro({ title, intro, crumbs }: PageIntroProps) {
  return (
    <header className="border-b border-line pt-32 pb-14 lg:pt-40 lg:pb-20">
      <div className="container-x">
        <Reveal className="max-w-4xl">
          {crumbs && (
            <nav aria-label="Brotkrumen" className="mb-6 text-[0.85rem] text-stone">
              <ol className="flex flex-wrap items-center gap-x-2">
                {crumbs.map((c, i) => (
                  <li key={c.label} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden="true">/</span>}
                    {c.to ? (
                      <Link to={c.to} className="inline-block py-1 hover:text-ink">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-ink">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="display-lg">{title}</h1>
          {intro && <div className="lead mt-6 max-w-2xl">{intro}</div>}
        </Reveal>
      </div>
    </header>
  );
}
