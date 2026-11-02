/**
 * Grundriss als dezenter Hintergrund (eigene Zeichnung, rein dekorativ):
 * Außenwände, Innenwände, Türbögen und Bemaßung – liegt rechts, Text bleibt links frei.
 */
export default function ConstructionLines({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 600" preserveAspectRatio="xMaxYMid slice" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" opacity="0.22">
        <path d="M520 60H1160V540H520Z" strokeWidth="5" />
        <path d="M800 60V250M800 330V540M520 300H700M760 300H1160M1000 300V540" strokeWidth="3" />
        <path d="M700 300A60 60 0 0 1 760 300" strokeWidth="1.2" />
        <path d="M800 250A80 80 0 0 0 880 330" strokeWidth="1.2" strokeDasharray="4 5" />
        <path d="M520 120H500M520 240H500M1160 160H1180M1160 420H1180" strokeWidth="1.2" />
        <path d="M540 40H1140M540 34V46M800 34V46M1140 34V46" strokeWidth="1" />
        <rect x="840" y="360" width="120" height="70" strokeWidth="1.2" />
        <rect x="1030" y="90" width="100" height="150" strokeWidth="1.2" strokeDasharray="6 6" />
      </g>
    </svg>
  );
}
