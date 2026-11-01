import { MessageCircle } from 'lucide-react';
import { site } from '../config/site';
import { useT } from '../i18n';

/** Neutrales Chat-Symbol (bewusst nicht das WhatsApp-Logo nachgebaut) */
export function WhatsAppIcon({ className = '' }: { className?: string }) {
  return <MessageCircle className={className} strokeWidth={1.9} aria-hidden="true" />;
}

/**
 * Schwebender WhatsApp-Button unten rechts.
 * Reiner Link auf wa.me – es wird kein Skript von WhatsApp/Meta geladen (kein Cookie-Banner nötig).
 */
export default function WhatsAppButton() {
  const t = useT();
  return (
    <a
      href={site.contact.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed right-4 bottom-4 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#1d7f47] py-3 pr-5 pl-4 text-[0.9rem] font-semibold text-white shadow-[0_12px_30px_-10px_rgb(11_37_69/0.55)] transition-colors hover:bg-[#166a3a] focus-visible:outline-offset-4 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-5" />
      <span className="hidden sm:inline" aria-hidden="true">{t.whatsapp.short}</span>
      <span className="sr-only">
        {t.whatsapp.label} {t.whatsapp.newTab}
      </span>
    </a>
  );
}
