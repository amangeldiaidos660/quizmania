"use client";

import { useEffect, useMemo, useState } from "react";
import CategoryModal from "@/components/CategoryModal";
import GameBoard from "@/components/GameBoard";
import ResultScreen from "@/components/ResultScreen";
import StartScreen from "@/components/StartScreen";
import { getQuizRun } from "@/lib/quiz";
import { DEFAULT_PROGRESS, getProgress, saveAccentColor, saveRunResult, saveSelectedSkin } from "@/lib/progression";
import { getAccentColor } from "@/lib/theme";
import type { AccentColorId, CategoryId, GameResult, GameSetup, ProgressState, QuizQuestion, SkinId } from "@/types/game";

type Screen = "start" | "game" | "result";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("start");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [setup, setSetup] = useState<GameSetup | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);
  const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);

  const currentProgress = useMemo(() => progress, [progress]);
  const accent = getAccentColor(currentProgress.accentColor);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  function startRun(category: CategoryId) {
    const nextSetup = { category, questionCount };
    setSetup(nextSetup);
    setQuestions(getQuizRun(category, questionCount));
    setResult(null);
    setIsCategoryOpen(false);
    setScreen("game");
  }

  function finishRun(nextResult: GameResult) {
    const saved = saveRunResult(nextResult);
    setProgress(saved.progress);
    setResult({ ...nextResult, unlockedSkin: saved.unlockedSkin });
    setScreen("result");
  }

  function restart() {
    setResult(null);
    setScreen("start");
  }

  function changeAccentColor(accentColor: AccentColorId) {
    setProgress(saveAccentColor(accentColor));
  }

  function changeSkin(skin: SkinId) {
    setProgress(saveSelectedSkin(skin));
  }

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#08070d] text-white"
      style={
        {
          "--accent": accent.value,
          "--accent-soft": accent.soft,
          "--accent-border": accent.value,
        } as React.CSSProperties
      }
    >
      {screen === "start" && (
        <StartScreen
          progress={currentProgress}
          questionCount={questionCount}
          onAccentColorChange={changeAccentColor}
          onSkinChange={changeSkin}
          onQuestionCountChange={setQuestionCount}
          onChooseCategory={() => setIsCategoryOpen(true)}
        />
      )}

      {screen === "game" && setup && questions.length > 0 && (
        <GameBoard
          questions={questions}
          setup={setup}
          progress={currentProgress}
          onFinish={finishRun}
        />
      )}

      {screen === "result" && result && (
        <ResultScreen result={result} progress={currentProgress} onRestart={restart} />
      )}

      <CategoryModal
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
        onSelect={startRun}
      />
    </main>
  );
}
