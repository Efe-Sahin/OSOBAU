import { isMissing, type MaybeMissing } from '../config/site';
import { useT } from '../i18n';

/**
 * Zeigt einen Wert oder – falls er fehlt – einen deutlich markierten Platzhalter.
 * Platzhalter sind bewusst auch im Produktions-Build sichtbar:
 * Die Website darf so nicht veröffentlicht werden (siehe README → „Vor dem Go-live“).
 */
export default function Placeholder({ value }: { value: MaybeMissing }) {
  const t = useT();
  if (!isMissing(value)) return <>{value}</>;
  return (
    <span className="placeholder-tag" title={t.placeholderTitle}>
      <span aria-hidden="true">⚠</span>
      <span>
        <span className="sr-only">{t.placeholderSr} </span>
        {value.todo}
      </span>
    </span>
  );
}
