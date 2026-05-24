import { RotateCcw, Sparkles, Trophy } from "lucide-react";
import { PlayerAvatar } from "@/assets/game/characters";
import { getCategoryTitle } from "@/lib/quiz";
import { getNextSkinProgress, SKIN_DESCRIPTIONS, SKIN_NAMES } from "@/lib/progression";
import type { GameResult, ProgressState } from "@/types/game";

type ResultScreenProps = {
  result: GameResult;
  progress: ProgressState;
  onRestart: () => void;
};

export default function ResultScreen({ result, progress, onRestart }: ResultScreenProps) {
  const skinProgress = getNextSkinProgress(progress);

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-5xl gap-6 rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 md:grid-cols-[0.8fr_1.2fr] md:p-8">
        <div className="flex flex-col items-center justify-center rounded-lg bg-black/25 p-5">
          <PlayerAvatar skin={progress.selectedSkin} size={190} />
          <p className="mt-4 text-center text-sm font-black uppercase tracking-[0.2em] accent-text">
            {result.isSuccessful ? "Забег успешен" : "Забег провален"}
          </p>
          {result.unlockedSkin && (
            <div className="mt-5 w-full rounded-lg border p-4 text-center accent-border accent-soft">
              <Sparkles className="mx-auto accent-text" size={24} />
              <p className="mt-2 text-sm font-black text-white">Открыт новый скин</p>
              <p className="mt-1 text-sm accent-text">{SKIN_NAMES[result.unlockedSkin]}</p>
              <p className="mt-2 text-xs text-neutral-300">{SKIN_DESCRIPTIONS[result.unlockedSkin]}</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 accent-text">
            <Trophy size={22} />
            <span className="text-sm font-black uppercase tracking-[0.22em]">Результат</span>
          </div>
          <h1 className="mt-4 text-4xl font-black">{result.correctAnswers}/{result.questionCount} верно</h1>
          <p className="mt-2 text-neutral-300">{getCategoryTitle(result.category)}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Stat label="Точность" value={`${Math.round((result.correctAnswers / result.questionCount) * 100)}%`} />
            <Stat label="Жизней осталось" value={String(result.livesLeft)} />
            <Stat label="Успешных забегов" value={String(progress.successfulRuns)} />
            <Stat label="Прогресс скина" value={skinProgress.label} />
          </div>

          <div className="mt-5 rounded-lg border p-4 accent-border accent-soft">
            <p className="text-sm font-black accent-text">Лучший фан-факт</p>
            <p className="mt-2 text-sm text-neutral-200">{result.bestFunFact}</p>
          </div>

          <button
            type="button"
            onClick={onRestart}
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 font-black text-black transition accent-bg hover:brightness-110"
          >
            <RotateCcw size={19} />
            Заново
          </button>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">{label}</p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}
