import type { AccentColorId, GameResult, ProgressState, SkinId } from "@/types/game";

const STORAGE_KEY = "quizmania-progress";

const DEFAULT_PROGRESS: ProgressState = {
  successfulRuns: 0,
  selectedSkin: "base-muncher",
  unlockedSkins: ["base-muncher"],
  accentColor: "yellow",
};

const SKIN_THRESHOLDS: { skin: SkinId; runs: number }[] = [
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

export function getProgress(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } as ProgressState;
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

export function saveRunResult(result: GameResult) {
  const current = getProgress();
  const successfulRuns = current.successfulRuns + (result.isSuccessful ? 1 : 0);
  const unlockedSkins = new Set<SkinId>(current.unlockedSkins);

  for (const threshold of SKIN_THRESHOLDS) {
    if (successfulRuns >= threshold.runs) {
      unlockedSkins.add(threshold.skin);
    }
  }

  return saveProgress({
    ...current,
    successfulRuns,
    unlockedSkins: Array.from(unlockedSkins),
  });
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
