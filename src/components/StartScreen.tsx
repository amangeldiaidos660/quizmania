import { Brain, Play, Trophy } from "lucide-react";
import { PlayerAvatar } from "@/assets/game/characters";
import { clampQuestionCount } from "@/lib/game";
import { getNextSkinProgress, SKIN_NAMES } from "@/lib/progression";
import { ACCENT_COLORS } from "@/lib/theme";
import type { AccentColorId, ProgressState } from "@/types/game";

type StartScreenProps = {
  progress: ProgressState;
  questionCount: number;
  onAccentColorChange: (color: AccentColorId) => void;
  onQuestionCountChange: (value: number) => void;
  onChooseCategory: () => void;
};

export default function StartScreen({
  progress,
  questionCount,
  onAccentColorChange,
  onQuestionCountChange,
  onChooseCategory,
}: StartScreenProps) {
  const skinProgress = getNextSkinProgress(progress);
  const progressPercent =
    skinProgress.target === 0 ? 100 : Math.min((skinProgress.current / skinProgress.target) * 100, 100);

  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--accent-soft),transparent_32%),radial-gradient(circle_at_75%_65%,rgba(94,234,212,0.12),transparent_28%)]" />
      <div className="relative grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-3xl accent-soft" />
            <PlayerAvatar skin={progress.selectedSkin} size={230} className="relative animate-[pulse_2.8s_ease-in-out_infinite]" />
          </div>
          <div className="mt-5 w-full max-w-sm rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-neutral-300">Текущий скин</span>
              <span className="font-bold accent-text">{SKIN_NAMES[progress.selectedSkin]}</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full accent-bg" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-xs text-neutral-400">{skinProgress.label}</p>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/35 p-6 shadow-2xl shadow-black/35 backdrop-blur md:p-8">
          <div className="flex items-center gap-3 accent-text">
            <Brain size={22} />
            <span className="text-sm font-black uppercase tracking-[0.22em]">Беги к ответу</span>
          </div>
          <h1 className="mt-4 text-5xl font-black leading-none text-white sm:text-7xl">QUIZMANIA</h1>
          <p className="mt-4 max-w-2xl text-base text-neutral-300 sm:text-lg">
            Выбери количество вопросов и категорию, а затем доберись через лабиринт до правильного ответа.
          </p>

          <div className="mt-8 grid items-end gap-4 sm:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="text-sm font-semibold text-neutral-300">Количество вопросов</span>
              <input
                min={5}
                max={15}
                type="number"
                value={questionCount}
                onChange={(event) => onQuestionCountChange(clampQuestionCount(Number(event.target.value)))}
                className="mt-2 h-14 w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 text-xl font-black text-white outline-none transition accent-ring"
              />
            </label>
            <button
              type="button"
              onClick={onChooseCategory}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg px-6 font-black text-black transition accent-bg hover:brightness-110"
            >
              <Play size={20} fill="currentColor" />
              Выбрать категорию
            </button>
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-semibold text-neutral-300">Цвет интерфейса</span>
              <div className="flex gap-2">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => onAccentColorChange(color.id)}
                    className="size-7 rounded-full border-2 transition hover:scale-110"
                    style={{
                      background: color.value,
                      borderColor: progress.accentColor === color.id ? "#ffffff" : "rgba(255,255,255,0.18)",
                    }}
                    aria-label={`Выбрать цвет: ${color.label}`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-neutral-300">
            <Trophy size={18} className="accent-text" />
            Успешных забегов: <span className="font-bold text-white">{progress.successfulRuns}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
