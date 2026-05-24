import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Heart } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DoubtEnemy } from "@/assets/game/enemies";
import { MiniPlayer } from "@/assets/game/characters";
import { STAGE_ONE_MAP } from "@/assets/game/maps";
import {
  getAnswerPositions,
  getInitialDoubtPosition,
  getInitialPlayerPosition,
  moveDoubtTowardPlayer,
  movePosition,
  samePosition,
} from "@/lib/game";
import { getCategoryTitle, isSuccessfulRun } from "@/lib/quiz";
import type { Direction, GameResult, GameSetup, Position, ProgressState, QuizQuestion } from "@/types/game";

type GameBoardProps = {
  questions: QuizQuestion[];
  setup: GameSetup;
  progress: ProgressState;
  onFinish: (result: GameResult) => void;
};

const playerMoveMs = 135;
const doubtMoveMs = 430;

export default function GameBoard({ questions, setup, progress, onFinish }: GameBoardProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [player, setPlayer] = useState<Position>(() => getInitialPlayerPosition());
  const [doubt, setDoubt] = useState<Position>(() => getInitialDoubtPosition());
  const [direction, setDirection] = useState<Direction | null>(null);
  const [isIntro, setIsIntro] = useState(true);
  const [message, setMessage] = useState<{ title: string; text: string; correct: boolean } | null>(null);
  const bestFunFactRef = useRef("");
  const lastPlayerMoveRef = useRef(0);
  const lastDoubtMoveRef = useRef(0);
  const currentQuestion = questions[questionIndex];
  const answerPositions = useMemo(() => getAnswerPositions(currentQuestion.answers), [currentQuestion.answers]);
  const isPaused = isIntro || Boolean(message);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsIntro(false), 1350);
    return () => window.clearTimeout(timer);
  }, [questionIndex]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const keyMap: Record<string, Direction> = {
        ArrowUp: "up",
        w: "up",
        W: "up",
        ArrowDown: "down",
        s: "down",
        S: "down",
        ArrowLeft: "left",
        a: "left",
        A: "left",
        ArrowRight: "right",
        d: "right",
        D: "right",
      };
      const nextDirection = keyMap[event.key];
      if (nextDirection) {
        event.preventDefault();
        setDirection(nextDirection);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let frame = 0;

    function tick(timestamp: number) {
      if (!isPaused) {
        if (direction && timestamp - lastPlayerMoveRef.current >= playerMoveMs) {
          lastPlayerMoveRef.current = timestamp;
          setPlayer((current) => movePosition(current, direction));
        }

        if (timestamp - lastDoubtMoveRef.current >= doubtMoveMs) {
          lastDoubtMoveRef.current = timestamp;
          setDoubt((current) => moveDoubtTowardPlayer(current, player));
        }
      }

      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [direction, isPaused, player]);

  useEffect(() => {
    if (isPaused) return;

    const matchedAnswer = answerPositions.find((item) => samePosition(item.position, player));
    if (matchedAnswer) {
      const isCorrect = matchedAnswer.answer.id === currentQuestion.correctAnswerId;
      handleQuestionEnd(isCorrect);
      return;
    }

    if (samePosition(player, doubt)) {
      loseLife("Сомнение поймало тебя", "Ментальная помеха сбила фокус. Двигайся дальше.", false);
    }
  }, [player, doubt, isPaused, answerPositions, currentQuestion.correctAnswerId]);

  function resetPositions() {
    setPlayer(getInitialPlayerPosition());
    setDoubt(getInitialDoubtPosition());
    setDirection(null);
  }

  function loseLife(title: string, text: string, countAsQuestion: boolean) {
    const nextLives = lives - 1;
    setLives(nextLives);
    setMessage({ title, text, correct: false });

    if (nextLives <= 0) {
      window.setTimeout(() => finishRun(correctAnswers, 0), 900);
      return;
    }

    if (countAsQuestion) {
      window.setTimeout(() => goNextQuestion(correctAnswers, nextLives), 1100);
    } else {
      window.setTimeout(() => {
        resetPositions();
        setMessage(null);
      }, 900);
    }
  }

  function handleQuestionEnd(isCorrect: boolean) {
    if (isCorrect) {
      bestFunFactRef.current = currentQuestion.funFact;
      const nextCorrect = correctAnswers + 1;
      setCorrectAnswers(nextCorrect);
      setMessage({ title: "Верный ответ", text: currentQuestion.funFact, correct: true });
      window.setTimeout(() => goNextQuestion(nextCorrect, lives), 1400);
      return;
    }

    loseLife("Неверный ответ", currentQuestion.explanation, true);
  }

  function goNextQuestion(nextCorrect: number, nextLives: number) {
    if (questionIndex + 1 >= questions.length || nextLives <= 0) {
      finishRun(nextCorrect, nextLives);
      return;
    }

    setQuestionIndex((current) => current + 1);
    resetPositions();
    setMessage(null);
    setIsIntro(true);
  }

  function finishRun(finalCorrect: number, finalLives: number) {
    onFinish({
      category: setup.category,
      questionCount: setup.questionCount,
      correctAnswers: finalCorrect,
      livesLeft: finalLives,
      isSuccessful: isSuccessfulRun(setup.questionCount, finalCorrect),
      bestFunFact: bestFunFactRef.current || currentQuestion.funFact,
    });
  }

  return (
    <section className="relative min-h-screen px-3 py-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] accent-text">
              {getCategoryTitle(setup.category)} · Вопрос {questionIndex + 1}/{questions.length}
            </p>
            <h1 className="mt-2 text-xl font-black text-white md:text-2xl">{currentQuestion.question}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-red-300">
              {Array.from({ length: lives }).map((_, index) => (
                <Heart key={index} size={20} fill="currentColor" />
              ))}
            </div>
            <div className="rounded-lg px-3 py-2 text-sm font-black text-black accent-bg">
              {correctAnswers} верно
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#12101a] p-2 shadow-2xl shadow-black/35">
            <div
              className="grid aspect-square max-h-[min(72vh,760px)] w-full grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))] gap-1"
              aria-label="Квиз-лабиринт"
            >
              {STAGE_ONE_MAP.map((row, rowIndex) =>
                [...row].map((tile, colIndex) => {
                  const position = { row: rowIndex, col: colIndex };
                  const answer = answerPositions.find((item) => samePosition(item.position, position));
                  const hasPlayer = samePosition(player, position);
                  const hasDoubt = samePosition(doubt, position);
                  const isWall = tile === "#";

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={[
                        "relative grid min-h-0 place-items-center rounded-[5px]",
                        isWall ? "bg-cyan-500/25 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.18)]" : "bg-white/[0.035]",
                        answer ? "border bg-[var(--accent-soft)] accent-border" : "",
                      ].join(" ")}
                    >
                      {answer && (
                        <span className="px-1 text-center text-[10px] font-black leading-tight text-white md:text-xs">
                          {answer.answer.text}
                        </span>
                      )}
                      {hasPlayer && <MiniPlayer skin={progress.selectedSkin} />}
                      {hasDoubt && <DoubtEnemy />}
                    </div>
                  );
                }),
              )}
            </div>

            <AnimatePresence>
              {isIntro && (
                <motion.div
                  className="absolute inset-0 z-20 grid place-items-center bg-black/65 p-5 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -80, scale: 0.85 }}
                >
                  <motion.div
                    className="max-w-3xl text-center"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: -120 }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                  >
                    <p className="text-sm font-black uppercase tracking-[0.22em] accent-text">Вопрос загружается</p>
                    <h2 className="mt-4 text-3xl font-black md:text-5xl">{currentQuestion.question}</h2>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {message && (
                <motion.div
                  className="absolute inset-x-4 bottom-4 z-30 rounded-lg border border-white/10 bg-black/85 p-4 backdrop-blur"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <p className={message.correct ? "font-black text-emerald-300" : "font-black text-red-300"}>{message.title}</p>
                  <p className="mt-1 text-sm text-neutral-200">{message.text}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-3 gap-2 self-start rounded-lg border border-white/10 bg-white/[0.04] p-3 lg:grid-cols-3">
            <div />
            <ControlButton direction="up" onDirection={setDirection} icon={<ArrowUp size={22} />} />
            <div />
            <ControlButton direction="left" onDirection={setDirection} icon={<ArrowLeft size={22} />} />
            <ControlButton direction="down" onDirection={setDirection} icon={<ArrowDown size={22} />} />
            <ControlButton direction="right" onDirection={setDirection} icon={<ArrowRight size={22} />} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ControlButton({
  direction,
  icon,
  onDirection,
}: {
  direction: Direction;
  icon: React.ReactNode;
  onDirection: (direction: Direction) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onDirection(direction)}
      className="grid size-14 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-white transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
      aria-label={`Двигаться: ${direction}`}
    >
      {icon}
    </button>
  );
}
