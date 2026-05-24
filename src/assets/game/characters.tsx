import type { SkinId } from "@/types/game";

type CharacterProps = {
  skin: SkinId;
  size?: number;
  className?: string;
};

const skinStyles: Record<SkinId, { body: string; accent: string; glow: string }> = {
  "base-muncher": { body: "#ffd84d", accent: "#111111", glow: "rgba(255, 216, 77, 0.45)" },
  "notebook-rookie": { body: "#ffe680", accent: "#4f46e5", glow: "rgba(255, 230, 128, 0.5)" },
  "memory-sprinter": { body: "#6ee7ff", accent: "#1d4ed8", glow: "rgba(110, 231, 255, 0.55)" },
  "focus-hacker": { body: "#9dff6e", accent: "#ec4899", glow: "rgba(157, 255, 110, 0.55)" },
  "quiz-oracle": { body: "#ffd166", accent: "#fff7ad", glow: "rgba(255, 209, 102, 0.7)" },
};

export function PlayerAvatar({ skin, size = 72, className }: CharacterProps) {
  const style = skinStyles[skin];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={skin}
    >
      <defs>
        <filter id={`glow-${skin}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={style.glow} />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="42" fill={style.body} filter={`url(#glow-${skin})`} />
      <path d="M52 50 L92 28 A42 42 0 0 1 92 72 Z" fill="#08070d" />
      <circle cx="47" cy="30" r="6" fill={style.accent} />
      {skin !== "base-muncher" && (
        <>
          <rect x="21" y="22" width="21" height="14" rx="7" fill="none" stroke={style.accent} strokeWidth="4" />
          <rect x="47" y="22" width="21" height="14" rx="7" fill="none" stroke={style.accent} strokeWidth="4" />
          <path d="M42 29 H47" stroke={style.accent} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
      {skin === "notebook-rookie" && <rect x="16" y="61" width="23" height="27" rx="4" fill="#f8fafc" stroke={style.accent} strokeWidth="3" />}
      {skin === "memory-sprinter" && <path d="M10 72 C26 63 20 42 38 36" stroke="#1d4ed8" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.8" />}
      {skin === "focus-hacker" && <path d="M18 78 L30 65 L42 78" stroke="#ec4899" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />}
      {skin === "quiz-oracle" && <path d="M50 6 L57 21 L73 23 L61 34 L64 50 L50 42 L36 50 L39 34 L27 23 L43 21 Z" fill={style.accent} />}
    </svg>
  );
}

export function MiniPlayer({ skin }: { skin: SkinId }) {
  return <PlayerAvatar skin={skin} size={38} className="drop-shadow-[0_0_14px_rgba(255,216,77,0.45)]" />;
}
