export function DoubtEnemy({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Doubt">
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
