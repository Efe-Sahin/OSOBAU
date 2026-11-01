import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';

import Logo from './Logo';
import Placeholder from './Placeholder';
import { fullAddress, isMissing, navItems, site } from '../config/site';
import { getServices } from '../data/services';
import { getProjects } from '../data/projects';
import { lp, useLang, useT } from '../i18n';

export default function Footer() {
  const year = new Date().getFullYear();
  const lang = useLang();
  const t = useT();
  const services = getServices(lang);
  const projects = getProjects(lang);

  return (
    <footer className="on-dark grain border-t border-line-dark bg-night text-white">
      <div className="container-x relative z-10 pt-20 pb-10 lg:pt-28">
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 border-b border-line-dark pb-16 lg:grid-cols-12 lg:gap-10">
          <div className="col-span-2 lg:col-span-4">
            <Logo variant="light" className="h-11 w-auto" />
            <p className="mt-8 max-w-sm text-[0.95rem] leading-relaxed text-white/60">{t.footer.about}</p>
            <Link
              to={lp('/#kontakt', lang)}
              className="group mt-8 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-bronze"
            >
              <span className="link-underline">{t.footer.request}</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <FooterCol title={t.footer.navigation} className="lg:col-span-2">
            {navItems.map((i) => (
              <li key={i.to}>
                <Link to={lp(i.to, lang)} className="link-underline inline-block py-1 text-white/70 hover:text-white">
                  {t.nav[i.key]}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title={t.footer.services} className="lg:col-span-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={lp(`/#leistung-${s.slug}`, lang)} className="link-underline inline-block py-1 text-white/70 hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title={t.footer.projects} className="lg:col-span-2">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link to={lp(`/projekte/${p.slug}`, lang)} className="link-underline inline-block py-1 text-white/70 hover:text-white">
                  {p.title}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title={t.footer.contact} className="col-span-2 lg:col-span-2">
            <li>
              <a href={site.contact.phoneHref} className="flex items-start gap-3 text-white/70 hover:text-white">
                <Phone className="mt-1 size-4 shrink-0 text-bronze" strokeWidth={1.75} aria-hidden="true" />
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="flex items-start gap-3 break-all text-white/70 hover:text-white">
                <Mail className="mt-1 size-4 shrink-0 text-bronze" strokeWidth={1.75} aria-hidden="true" />
                {site.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-3 text-white/70">
              <MapPin className="mt-1 size-4 shrink-0 text-bronze" strokeWidth={1.75} aria-hidden="true" />
              <span>
                {fullAddress()}
                {isMissing(site.company.houseNumber) && (
                  <>
                    <br />
                    <Placeholder value={site.company.houseNumber} />
                  </>
                )}
              </span>
            </li>
          </FooterCol>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-[0.8rem] text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. {t.footer.rights}
          </p>
          <ul className="flex gap-6">
            <li>
              <Link to="/impressum" hrefLang="de" className="inline-block py-1.5 hover:text-white">
                {t.footer.imprint}
              </Link>
            </li>
            <li>
              <Link to="/datenschutz" hrefLang="de" className="inline-block py-1.5 hover:text-white">
                {t.footer.privacy}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h2 className="mb-6 font-sans text-[0.76rem] font-semibold tracking-[0.22em] text-white/65 uppercase">{title}</h2>
      <ul className="space-y-2 text-[0.92rem]">{children}</ul>
    </div>
  );
}
