import ResponsiveImage from './ResponsiveImage';
import type { Service } from '../data/services';

/** Leistungskarte: Foto, Titel, Kurztext – schlicht mit feinem Rahmen (vom Kunden gewählt) */
export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article id={`leistung-${service.slug}`} className="@container flex h-full scroll-mt-6 flex-col border border-line bg-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ResponsiveImage image={service.image} fill sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw" />
      </div>
      <div className="px-[clamp(1rem,8cqi,1.75rem)] pt-7 pb-9">
        {/* Schriftgröße richtet sich nach der Kartenbreite (Container Query) – lange Wörter laufen nie über */}
        <h3 className="font-display text-[clamp(1.05rem,6.6cqi,1.5rem)] leading-tight font-bold tracking-[-0.015em] break-words hyphens-auto">
          {service.title}
        </h3>
        <p className="mt-3 text-[clamp(0.95rem,5cqi,1.05rem)] leading-relaxed text-stone hyphens-auto">{service.short}</p>
      </div>
    </article>
  );
}
