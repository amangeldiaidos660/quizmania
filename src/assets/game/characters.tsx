import type { SkinId } from "@/types/game";

type CharacterProps = {
  skin: SkinId;
  size?: number;
  className?: string;
};

const skinStyles: Record<
  SkinId,
  { body: string; accent: string; glow: string }
> = {
  "base-muncher": {
    body: "#ffd84d",
    accent: "#111111",
    glow: "rgba(255, 216, 77, 0.45)",
  },

  "notebook-rookie": {
    body: "#ffe680",
    accent: "#4f46e5",
    glow: "rgba(255, 230, 128, 0.5)",
  },

  "memory-sprinter": {
    body: "#6ee7ff",
    accent: "#1d4ed8",
    glow: "rgba(110, 231, 255, 0.55)",
  },

  "focus-hacker": {
    body: "#9dff6e",
    accent: "#ec4899",
    glow: "rgba(157, 255, 110, 0.55)",
  },

  "quiz-oracle": {
    body: "#ffd166",
    accent: "#fff7ad",
    glow: "rgba(255, 209, 102, 0.7)",
  },
};

export function PlayerAvatar({
  skin,
  size = 72,
  className,
}: CharacterProps) {
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
        <filter
          id={`glow-${skin}`}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="5"
            floodColor={style.glow}
          />
        </filter>
      </defs>

      {/* base body */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill={style.body}
        filter={`url(#glow-${skin})`}
      />

      {/* mouth */}
      <path
        d="M52 50 L92 28 A42 42 0 0 1 92 72 Z"
        fill="#08070d"
      />

      {/* eye */}
      <circle
        cx="47"
        cy="30"
        r="6"
        fill={style.accent}
      />

      {/* original glasses */}
      {skin !== "base-muncher" && (
        <>
          <rect
            x="21"
            y="22"
            width="21"
            height="14"
            rx="7"
            fill="none"
            stroke={style.accent}
            strokeWidth="4"
          />

          <rect
            x="47"
            y="22"
            width="21"
            height="14"
            rx="7"
            fill="none"
            stroke={style.accent}
            strokeWidth="4"
          />

          <path
            d="M42 29 H47"
            stroke={style.accent}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      )}

      {/* NEW NOTEBOOK ROOKIE */}
      {skin === "notebook-rookie" && (
  <>
    {/* NEW BODY */}
    <g>
      {/* main head */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="#FFE680"
        filter={`url(#glow-${skin})`}
      />

      {/* open mouth */}
      <path
        d="M52 50 L92 28 A42 42 0 0 1 92 72 Z"
        fill="#08070d"
      />

      {/* top hair */}
      <path
        d="M22 32
           C30 12 68 8 82 28
           C72 18 55 16 42 19
           C34 21 27 25 22 32Z"
        fill="#4f46e5"
        opacity="0.95"
      />

      {/* glasses */}
      <g transform="translate(22 24)">
        <rect
          x="0"
          y="0"
          width="18"
          height="13"
          rx="6"
          fill="#ffffff"
          fillOpacity="0.15"
          stroke="#4f46e5"
          strokeWidth="3"
        />

        <rect
          x="22"
          y="0"
          width="18"
          height="13"
          rx="6"
          fill="#ffffff"
          fillOpacity="0.15"
          stroke="#4f46e5"
          strokeWidth="3"
        />

        <line
          x1="18"
          y1="6.5"
          x2="22"
          y2="6.5"
          stroke="#4f46e5"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* eyes */}
      <circle cx="34" cy="31" r="2.2" fill="#4f46e5" />
      <circle cx="56" cy="31" r="2.2" fill="#4f46e5" />

      {/* notebook in hand */}
      <g transform="translate(14 58) rotate(-8)">
        <rect
          x="0"
          y="0"
          width="22"
          height="26"
          rx="4"
          fill="#ffffff"
          stroke="#4f46e5"
          strokeWidth="3"
        />

        {/* spiral */}
        <circle cx="5" cy="6" r="1.1" fill="#4f46e5" />
        <circle cx="5" cy="11" r="1.1" fill="#4f46e5" />
        <circle cx="5" cy="16" r="1.1" fill="#4f46e5" />
        <circle cx="5" cy="21" r="1.1" fill="#4f46e5" />

        {/* text */}
        <line
          x1="9"
          y1="8"
          x2="17"
          y2="8"
          stroke="#cbd5e1"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <line
          x1="9"
          y1="13"
          x2="17"
          y2="13"
          stroke="#cbd5e1"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <line
          x1="9"
          y1="18"
          x2="15"
          y2="18"
          stroke="#cbd5e1"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>

      {/* cheek shine */}
      <ellipse
        cx="36"
        cy="22"
        rx="11"
        ry="6"
        fill="white"
        opacity="0.18"
        transform="rotate(-18 36 22)"
      />
    </g>
  </>
)}


      {skin === "memory-sprinter" && (
  <>
    {/* cyan body overlay */}
    <circle
      cx="50"
      cy="50"
      r="42"
      fill="#67E8F9"
      opacity="0.92"
      filter={`url(#glow-${skin})`}
    />

    {/* mouth */}
      <path
        d="M52 50 L92 28 A42 42 0 0 1 92 72 Z"
        fill="#08070d"
      />

    {/* speed visor */}
    <path
      d="
        M22 28
        C30 18 54 15 72 21
        C77 23 82 26 86 30
        L78 38
        C71 33 63 31 54 31
        C43 31 34 34 27 40
        Z
      "
      fill="#2563EB"
      opacity="0.95"
    />

    {/* eye */}
    <circle
      cx="48"
      cy="34"
      r="5.5"
      fill="#ffffff"
      opacity="0.95"
    />

    <circle
      cx="49"
      cy="34"
      r="2.5"
      fill="#1D4ED8"
    />

    {/* speed lines */}
    <path
      d="M8 42 H28"
      stroke="#2563EB"
      strokeWidth="5"
      strokeLinecap="round"
      opacity="0.95"
    />

    <path
      d="M4 54 H24"
      stroke="#2563EB"
      strokeWidth="5"
      strokeLinecap="round"
      opacity="0.75"
    />

    <path
      d="M10 66 H30"
      stroke="#2563EB"
      strokeWidth="5"
      strokeLinecap="round"
      opacity="0.5"
    />

    {/* electric trail */}
    <path
      d="
        M14 74
        C20 68 24 62 28 56
        C32 50 36 45 42 40
      "
      stroke="#38BDF8"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
      opacity="0.85"
    />

    {/* glow dots */}
    <circle cx="18" cy="72" r="3" fill="#BAE6FD" />
    <circle cx="26" cy="61" r="2.5" fill="#BAE6FD" />
    <circle cx="34" cy="50" r="2" fill="#BAE6FD" />

    {/* shine */}
    <ellipse
      cx="35"
      cy="21"
      rx="12"
      ry="7"
      fill="white"
      opacity="0.18"
      transform="rotate(-18 35 21)"
    />
  </>
)}

{skin === "focus-hacker" && (
  <>
    {/* neon green body overlay */}
    <circle
      cx="50"
      cy="50"
      r="42"
      fill="#8BFF6A"
      opacity="0.94"
      filter={`url(#glow-${skin})`}
    />

    {/* mouth */}
      <path
        d="M52 50 L92 28 A42 42 0 0 1 92 72 Z"
        fill="#08070d"
      />

    {/* hacker visor */}
    <path
      d="
        M20 30
        C28 20 47 17 66 19
        C76 20 84 24 90 30
        L82 39
        C73 33 62 31 50 31
        C40 31 31 34 24 40
        Z
      "
      fill="#EC4899"
      opacity="0.95"
    />

    {/* eye */}
    <circle
      cx="49"
      cy="35"
      r="5.5"
      fill="#ffffff"
      opacity="0.95"
    />

    <circle
      cx="50"
      cy="35"
      r="2.5"
      fill="#EC4899"
    />

    {/* digital pixels */}
    <rect
      x="18"
      y="60"
      width="6"
      height="6"
      rx="1"
      fill="#EC4899"
    />

    <rect
      x="26"
      y="68"
      width="5"
      height="5"
      rx="1"
      fill="#F472B6"
    />

    <rect
      x="34"
      y="75"
      width="4"
      height="4"
      rx="1"
      fill="#FDA4AF"
    />

    {/* neon circuit */}
    <path
      d="
        M16 78
        L28 66
        L38 76
        L46 68
      "
      stroke="#EC4899"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* circuit nodes */}
    <circle cx="28" cy="66" r="3" fill="#F9A8D4" />
    <circle cx="38" cy="76" r="3" fill="#F9A8D4" />
    <circle cx="46" cy="68" r="3" fill="#F9A8D4" />

    {/* shine */}
    <ellipse
      cx="34"
      cy="21"
      rx="12"
      ry="7"
      fill="white"
      opacity="0.18"
      transform="rotate(-18 34 21)"
    />
  </>
)}
{skin === "quiz-oracle" && (
  <>
    {/* golden body overlay */}
    <circle
      cx="50"
      cy="50"
      r="42"
      fill="#FFD166"
      opacity="0.95"
      filter={`url(#glow-${skin})`}
    />

    {/* mouth */}
      <path
        d="M52 50 L92 28 A42 42 0 0 1 92 72 Z"
        fill="#08070d"
      />

    {/* cosmic crown */}
    <path
      d="
        M26 28
        L36 18
        L50 24
        L64 18
        L74 28
        L66 38
        L50 34
        L34 38
        Z
      "
      fill="#FFF7AD"
      opacity="0.96"
    />

    {/* floating halo */}
    <ellipse
      cx="50"
      cy="17"
      rx="18"
      ry="5"
      fill="none"
      stroke="#FFF7AD"
      strokeWidth="3"
      opacity="0.7"
    />

    {/* eye */}
    <circle
      cx="48"
      cy="34"
      r="5.5"
      fill="#ffffff"
      opacity="0.96"
    />

    <circle
      cx="49"
      cy="34"
      r="2.5"
      fill="#FFE082"
    />

    {/* orbit particles */}
    <circle cx="24" cy="46" r="2.2" fill="#FFF7AD" />
    <circle cx="18" cy="58" r="1.8" fill="#FFF7AD" opacity="0.8" />
    <circle cx="77" cy="44" r="2" fill="#FFF7AD" />
    <circle cx="83" cy="57" r="1.6" fill="#FFF7AD" opacity="0.7" />

    {/* wisdom rune */}
    <path
      d="
        M18 78
        C26 70 36 66 48 66
        C60 66 70 70 80 78
      "
      stroke="#FFF7AD"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
      opacity="0.9"
    />

    <path
      d="
        M34 74
        L42 66
        L50 74
        L58 66
        L66 74
      "
      stroke="#FFF7AD"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.85"
    />

    {/* shine */}
    <ellipse
      cx="34"
      cy="21"
      rx="12"
      ry="7"
      fill="white"
      opacity="0.2"
      transform="rotate(-18 34 21)"
    />
  </>
)}
    </svg>
  );
}

export function MiniPlayer({
  skin,
}: {
  skin: SkinId;
}) {
  return (
    <PlayerAvatar
      skin={skin}
      size={38}
      className="drop-shadow-[0_0_14px_rgba(255,216,77,0.45)]"
    />
  );
}