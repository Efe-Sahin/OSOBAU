/** Abstrakte Konstruktionslinien als dezenter Hintergrund (eigene Zeichnung, rein dekorativ) */
export default function ConstructionLines({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M0 520 L1200 520" />
        <path d="M80 520 L80 140 L520 60 L960 140 L960 520" />
        <path d="M80 140 L960 140" />
        <path d="M220 520 L220 180 M360 520 L360 160 M520 520 L520 140 M680 520 L680 160 M820 520 L820 180" />
        <path d="M80 260 L960 260 M80 390 L960 390" />
        <path d="M80 520 L520 140 L960 520" />
        <path d="M520 60 L520 140" />
        <path d="M1000 520 L1000 300 L1160 260 L1160 520 M1000 300 L1160 300 M1000 410 L1160 410" />
        <path d="M0 470 L1200 470" strokeDasharray="6 10" />
      </g>
    </svg>
  );
}
