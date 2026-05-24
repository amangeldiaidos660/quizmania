import type { AccentColorId, GameResult, ProgressState, SkinBonus, SkinId } from "@/types/game";

const STORAGE_KEY = "quizmania-progress";

export const DEFAULT_PROGRESS: ProgressState = {
  successfulRuns: 0,
  selectedSkin: "base-muncher",
  unlockedSkins: ["base-muncher"],
  accentColor: "yellow",
};

export const SKIN_THRESHOLDS: { skin: SkinId; runs: number }[] = [
  { skin: "notebook-rookie", runs: 1 },
  { skin: "memory-sprinter", runs: 3 },
  { skin: "focus-hacker", runs: 6 },
  { skin: "quiz-oracle", runs: 10 },
];

export const SKIN_NAMES: Record<SkinId, string> = {
  "base-muncher": "Базовый пожиратель",
  "notebook-rookie": "Новичок с блокнотом",
  "memory-sprinter": "Спринтер памяти",
  "focus-hacker": "Хакер фокуса",
  "quiz-oracle": "Оракул квиза",
};

export const SKIN_DESCRIPTIONS: Record<SkinId, string> = {
  "base-muncher": "Классический старт без бонусов.",
  "notebook-rookie": "Чуть быстрее двигается по лабиринту.",
  "memory-sprinter": "Начинает забег с одной дополнительной жизнью.",
  "focus-hacker": "Открывает редкий бонус Фокус.",
  "quiz-oracle": "Усиливает заморозку преследователей.",
};

export const SKIN_BONUSES: Record<SkinId, SkinBonus> = {
  "base-muncher": {
    speedBoost: 0,
    extraLife: 0,
    unlocksFocus: false,
    freezeBonusMs: 0,
  },
  "notebook-rookie": {
    speedBoost: 0.25,
    extraLife: 0,
    unlocksFocus: false,
    freezeBonusMs: 0,
  },
  "memory-sprinter": {
    speedBoost: 0.25,
    extraLife: 1,
    unlocksFocus: false,
    freezeBonusMs: 0,
  },
  "focus-hacker": {
    speedBoost: 0.25,
    extraLife: 1,
    unlocksFocus: true,
    freezeBonusMs: 0,
  },
  "quiz-oracle": {
    speedBoost: 0.25,
    extraLife: 1,
    unlocksFocus: true,
    freezeBonusMs: 1000,
  },
};

export function getProgress(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    const unlockedSkins = parsed.unlockedSkins?.length ? parsed.unlockedSkins : DEFAULT_PROGRESS.unlockedSkins;
    const selectedSkin = unlockedSkins.includes(parsed.selectedSkin as SkinId)
      ? (parsed.selectedSkin as SkinId)
      : DEFAULT_PROGRESS.selectedSkin;

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      selectedSkin,
      unlockedSkins,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: ProgressState) {
  if (typeof window === "undefined") return progress;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

export function saveAccentColor(accentColor: AccentColorId) {
  return saveProgress({ ...getProgress(), accentColor });
}

export function saveSelectedSkin(selectedSkin: SkinId) {
  const current = getProgress();
  if (!current.unlockedSkins.includes(selectedSkin)) return current;
  return saveProgress({ ...current, selectedSkin });
}

export function saveRunResult(result: GameResult) {
  const current = getProgress();
  const successfulRuns = current.successfulRuns + (result.isSuccessful ? 1 : 0);
  const previousSkins = new Set<SkinId>(current.unlockedSkins);
  const unlockedSkins = new Set<SkinId>(current.unlockedSkins);
  let unlockedSkin: SkinId | undefined;

  for (const threshold of SKIN_THRESHOLDS) {
    if (successfulRuns >= threshold.runs) {
      unlockedSkins.add(threshold.skin);
      if (!previousSkins.has(threshold.skin)) {
        unlockedSkin = threshold.skin;
      }
    }
  }

  const nextProgress = saveProgress({
    ...current,
    successfulRuns,
    unlockedSkins: Array.from(unlockedSkins),
    selectedSkin: unlockedSkin ?? current.selectedSkin,
  });

  return { progress: nextProgress, unlockedSkin };
}

export function getNextSkinProgress(progress: ProgressState) {
  const next = SKIN_THRESHOLDS.find((item) => !progress.unlockedSkins.includes(item.skin));
  if (!next) {
    return { label: "Все скины открыты", current: progress.successfulRuns, target: progress.successfulRuns };
  }

  return {
    label: `${progress.successfulRuns}/${next.runs} успешных забегов`,
    current: progress.successfulRuns,
    target: next.runs,
  };
}
