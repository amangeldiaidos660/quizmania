import type { EnemyId } from "@/types/game";

type EnemyProps = {
  size?: number;
};

export function DoubtEnemy({ size = 34 }: EnemyProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Сомнение">
      <defs>
        <filter id="doubtGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(255,75,118,0.7)" />
        </filter>
      </defs>
      <path
        d="M12 54 V25 C12 12 21 5 32 5 S52 12 52 25 V54 L45 49 L38 54 L32 49 L26 54 L19 49 Z"
        fill="#ff4b76"
        filter="url(#doubtGlow)"
      />
      <circle cx="25" cy="28" r="6" fill="#fff" />
      <circle cx="39" cy="28" r="6" fill="#fff" />
      <circle cx="27" cy="29" r="3" fill="#101014" />
      <circle cx="41" cy="29" r="3" fill="#101014" />
      <path d="M23 42 Q32 36 41 42" stroke="#101014" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function ConfusionEnemy({ size = 34 }: EnemyProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Путаница">
      <defs>
        <filter id="confusionGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(34,211,238,0.75)" />
        </filter>
      </defs>
      <path
        d="M11 54 V24 C11 12 20 5 32 5 S53 12 53 24 V54 L47 48 L41 54 L35 48 L29 54 L23 48 L17 54 Z"
        fill="#22d3ee"
        filter="url(#confusionGlow)"
      />
      <circle cx="24" cy="27" r="6" fill="#fff" />
      <circle cx="40" cy="27" r="6" fill="#fff" />
      <circle cx="22" cy="27" r="3" fill="#101014" />
      <circle cx="42" cy="27" r="3" fill="#101014" />
      <path
        d="M22 42 C27 37 31 47 36 42 S44 41 45 36"
        stroke="#101014"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M18 15 L25 9 L29 17" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
      <path d="M46 15 L39 9 L35 17" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
    </svg>
  );
}

export function PanicEnemy({ size = 34 }: EnemyProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Паника">
      <defs>
        <filter id="panicGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(251,146,60,0.85)" />
        </filter>
      </defs>
      <path
        d="M9 55 V24 C9 11 19 4 32 4 S55 11 55 24 V55 L48 48 L42 55 L36 48 L31 55 L25 48 L18 55 Z"
        fill="#fb923c"
        filter="url(#panicGlow)"
      />
      <path d="M16 20 L25 15 L28 24" fill="#ffedd5" opacity="0.85" />
      <path d="M48 20 L39 15 L36 24" fill="#ffedd5" opacity="0.85" />
      <circle cx="24" cy="29" r="6" fill="#fff" />
      <circle cx="40" cy="29" r="6" fill="#fff" />
      <circle cx="25" cy="31" r="3" fill="#101014" />
      <circle cx="39" cy="31" r="3" fill="#101014" />
      <path d="M25 44 Q32 35 39 44" stroke="#101014" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M8 12 L15 8 M53 8 L58 14 M32 1 V8" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function EnemySprite({ id, size = 34 }: EnemyProps & { id: EnemyId }) {
  if (id === "confusion") return <ConfusionEnemy size={size} />;
  if (id === "panic") return <PanicEnemy size={size} />;
  return <DoubtEnemy size={size} />;
}
