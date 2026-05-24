import type { AccentColorId } from "@/types/game";

export const ACCENT_COLORS: {
  id: AccentColorId;
  label: string;
  value: string;
  soft: string;
}[] = [
  { id: "yellow", label: "Жёлтый", value: "#fde047", soft: "rgba(253, 224, 71, 0.16)" },
  { id: "lime", label: "Лайм", value: "#a3e635", soft: "rgba(163, 230, 53, 0.16)" },
  { id: "cyan", label: "Циан", value: "#22d3ee", soft: "rgba(34, 211, 238, 0.16)" },
  { id: "pink", label: "Розовый", value: "#fb7185", soft: "rgba(251, 113, 133, 0.16)" },
  { id: "violet", label: "Фиолетовый", value: "#a78bfa", soft: "rgba(167, 139, 250, 0.16)" },
  { id: "orange", label: "Оранжевый", value: "#fb923c", soft: "rgba(251, 146, 60, 0.16)" },
];

export function getAccentColor(id: AccentColorId) {
  return ACCENT_COLORS.find((color) => color.id === id) ?? ACCENT_COLORS[0];
}
