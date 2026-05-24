import { Eye, Lightbulb, Snowflake } from "lucide-react";
import type { PowerUpId } from "@/types/game";

type PowerUpProps = {
  id: PowerUpId;
  size?: number;
};

const powerUpMeta: Record<PowerUpId, { label: string; color: string; glow: string }> = {
  hint: {
    label: "Подсказка",
    color: "#fde047",
    glow: "rgba(253,224,71,0.7)",
  },
  freeze: {
    label: "Заморозка",
    color: "#67e8f9",
    glow: "rgba(103,232,249,0.7)",
  },
  focus: {
    label: "Фокус",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.75)",
  },
};

export function PowerUpSprite({ id, size = 34 }: PowerUpProps) {
  const meta = powerUpMeta[id];
  const Icon = id === "hint" ? Lightbulb : id === "freeze" ? Snowflake : Eye;

  return (
    <div
      className="grid place-items-center rounded-full border border-white/20 bg-black/45"
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 18px ${meta.glow}`,
      }}
      aria-label={meta.label}
      title={meta.label}
    >
      <Icon size={Math.round(size * 0.58)} color={meta.color} strokeWidth={2.8} />
    </div>
  );
}

export function getPowerUpLabel(id: PowerUpId) {
  return powerUpMeta[id].label;
}
