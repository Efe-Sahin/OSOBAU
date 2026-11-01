import { useT } from '../i18n';

export default function SkipLink() {
  const t = useT();
  return (
    <a
      href="#inhalt"
      className="fixed top-3 left-3 z-[100] -translate-y-24 bg-night px-4 py-3 text-sm font-medium text-white transition-transform focus:translate-y-0"
    >
      {t.skip}
    </a>
  );
}
