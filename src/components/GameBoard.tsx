import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Heart } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MiniPlayer } from "@/assets/game/characters";
import { EnemySprite } from "@/assets/game/enemies";
import { STAGE_MAPS } from "@/assets/game/maps";
import { PowerUpSprite, getPowerUpLabel } from "@/assets/game/powerups";
import { SKIN_BONUSES } from "@/lib/progression";
import type {
  Direction,
  EnemyId,
  EnemyState,
  GameResult,
  GameSetup,
  Position,
  PowerUpId,
  PowerUpState,
  ProgressState,
  QuizQuestion,
  StageId,
} from "@/types/game";
import { getCategoryTitle, isSuccessfulRun } from "@/lib/quiz";

type GameBoardProps = {
  questions: QuizQuestion[];
  setup: GameSetup;
  progress: ProgressState;
  onFinish: (result: GameResult) => void;
};

const basePlayerMoveMs = 125;
const baseFreezeMs = 3000;
const directionDelta: Record<Direction, Position> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

function samePosition(a: Position, b: Position) {
  return a.row === b.row && a.col === b.col;
}

function getStageId(completedQuestions: number, totalQuestions: number): StageId {
  const progress = completedQuestions / totalQuestions;
  if (progress >= 0.8) return 3;
  if (progress >= 0.3) return 2;
  return 1;
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function getNextPathStep(from: Position, target: Position, layout: readonly string[]) {
  const path = findPath(from, target, layout);
  return path[1] ?? from;
}

function findPath(from: Position, target: Position, layout: readonly string[]) {
  const queue: Position[] = [from];
  const visited = new Set<string>([positionKey(from)]);
  const cameFrom = new Map<string, Position>();

  while (queue.length > 0) {
    const current = queue.shift() as Position;

    if (samePosition(current, target)) {
      return reconstructPath(from, current, cameFrom);
    }

    for (const next of getOpenNeighbors(current, layout)) {
      const key = positionKey(next);
      if (visited.has(key)) continue;
      visited.add(key);
      cameFrom.set(key, current);
      queue.push(next);
    }
  }

  return [from];
}

function reconstructPath(from: Position, target: Position, cameFrom: Map<string, Position>) {
  const path: Position[] = [target];
  let current = target;

  while (!samePosition(current, from)) {
    const previous = cameFrom.get(positionKey(current));
    if (!previous) return [from];
    path.unshift(previous);
    current = previous;
  }

  return path;
}

function getOpenNeighbors(position: Position, layout: readonly string[]) {
  return Object.values(directionDelta)
    .map((delta) => ({ row: position.row + delta.row, col: position.col + delta.col }))
    .filter((next) => layout[next.row]?.[next.col] && layout[next.row][next.col] !== "#");
}

function positionKey(position: Position) {
  return `${position.row}:${position.col}`;
}

export default function GameBoard({ questions, setup, progress, onFinish }: GameBoardProps) {
  const initialMap = STAGE_MAPS[1];
  const skinBonus = SKIN_BONUSES[progress.selectedSkin];
  const playerMoveMs = basePlayerMoveMs / (1 + skinBonus.speedBoost);
  const maxLives = 3 + skinBonus.extraLife;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [lives, setLives] = useState(maxLives);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [player, setPlayer] = useState<Position>(() => initialMap.playerStart);
  const [enemies, setEnemies] = useState<EnemyState[]>(() => createEnemies(1));
  const [powerUps, setPowerUps] = useState<PowerUpState[]>(() => createPowerUps(1, 0, skinBonus.unlocksFocus));
  const [hiddenAnswerIds, setHiddenAnswerIds] = useState<string[]>([]);
  const [focusAnswerId, setFocusAnswerId] = useState<string | null>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [isIntro, setIsIntro] = useState(true);
  const [message, setMessage] = useState<{ title: string; text: string; correct: boolean } | null>(null);
  const bestFunFactRef = useRef("");
  const lastPlayerMoveRef = useRef(0);
  const playerRef = useRef(player);
  const currentQuestion = questions[questionIndex];
  const stageId = getStageId(questionIndex, questions.length);
  const stageMap = STAGE_MAPS[stageId];
  const answerPositions = useMemo(() => {
    const slots = shuffle(stageMap.answerSlots).slice(0, currentQuestion.answers.length);
    return currentQuestion.answers.map((answer, index) => ({ answer, position: slots[index] }));
  }, [currentQuestion.answers, questionIndex, stageMap.answerSlots]);
  const isPaused = isIntro || Boolean(message);

  function isWall(position: Position) {
    return stageMap.layout[position.row]?.[position.col] === "#";
  }

  function movePosition(position: Position, nextDirection: Direction) {
    const delta = directionDelta[nextDirection];
    const next = { row: position.row + delta.row, col: position.col + delta.col };
    return isWall(next) ? position : next;
  }

  function createEnemies(nextStage: StageId): EnemyState[] {
    const ids: EnemyId[] = nextStage === 1 ? ["doubt"] : nextStage === 2 ? ["doubt", "confusion"] : ["doubt", "confusion", "panic"];
    return ids.map((id) => ({ id, position: STAGE_MAPS[nextStage].enemyStarts[id], frozenUntil: 0 }));
  }

  function createPowerUps(nextStage: StageId, nextQuestionIndex: number, hasFocus: boolean): PowerUpState[] {
    const slots = shuffle(STAGE_MAPS[nextStage].powerUpSlots);
    const result: PowerUpState[] = [];

    if (nextQuestionIndex % 3 === 1) result.push({ id: "hint", position: slots[0] });
    if (nextStage >= 2) result.push({ id: "freeze", position: slots[result.length] });
    if (hasFocus && nextQuestionIndex / questions.length >= 0.5) result.push({ id: "focus", position: slots[result.length] });

    return result;
  }

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

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
      }

      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [direction, isPaused, playerMoveMs, stageId]);

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      const now = performance.now();

      setEnemies((current) =>
        current.map((enemy) => {
          if (enemy.frozenUntil > now) return enemy;

          const target =
            enemy.id === "confusion" && Math.floor(now / 3000) % 2 === 0
              ? answerPositions[0]?.position ?? playerRef.current
              : playerRef.current;
          const steps = enemy.id === "panic" && Math.floor(now / 2200) % 2 === 0 ? 2 : 1;
          let nextPosition = enemy.position;

          for (let step = 0; step < steps; step += 1) {
            nextPosition = getNextPathStep(nextPosition, target, stageMap.layout);
          }

          return { ...enemy, position: nextPosition };
        }),
      );
    }, 360);

    return () => window.clearInterval(interval);
  }, [answerPositions, isPaused, stageMap.layout]);

  useEffect(() => {
    if (isPaused) return;

    const matchedPowerUp = powerUps.find((item) => samePosition(item.position, player));
    if (matchedPowerUp) {
      activatePowerUp(matchedPowerUp.id);
      setPowerUps((current) => current.filter((item) => item !== matchedPowerUp));
      return;
    }

    const matchedAnswer = answerPositions.find((item) => samePosition(item.position, player) && !hiddenAnswerIds.includes(item.answer.id));
    if (matchedAnswer) {
      handleQuestionEnd(matchedAnswer.answer.id === currentQuestion.correctAnswerId);
      return;
    }

    if (enemies.some((enemy) => samePosition(player, enemy.position))) {
      loseLife("Ментальная помеха поймала тебя", "Фокус сбился. Двигайся дальше.", false);
    }
  }, [player, enemies, isPaused, answerPositions, hiddenAnswerIds, powerUps, currentQuestion.correctAnswerId]);

  function actorStyle(position: Position) {
    return {
      left: `${(position.col / 15) * 100}%`,
      top: `${(position.row / 15) * 100}%`,
      width: `${100 / 15}%`,
      height: `${100 / 15}%`,
    };
  }

  function resetQuestionState(nextQuestionIndex: number) {
    const nextStage = getStageId(nextQuestionIndex, questions.length);
    const nextMap = STAGE_MAPS[nextStage];
    playerRef.current = nextMap.playerStart;
    setPlayer(nextMap.playerStart);
    setEnemies(createEnemies(nextStage));
    setPowerUps(createPowerUps(nextStage, nextQuestionIndex, skinBonus.unlocksFocus));
    setHiddenAnswerIds([]);
    setFocusAnswerId(null);
    setDirection(null);
  }

  function activatePowerUp(id: PowerUpId) {
    if (id === "hint") {
      const wrong = currentQuestion.answers.find((answer) => answer.id !== currentQuestion.correctAnswerId && !hiddenAnswerIds.includes(answer.id));
      if (wrong) setHiddenAnswerIds((current) => [...current, wrong.id]);
    }

    if (id === "freeze") {
      const frozenUntil = performance.now() + baseFreezeMs + skinBonus.freezeBonusMs;
      setEnemies((current) => current.map((enemy) => ({ ...enemy, frozenUntil })));
    }

    if (id === "focus") {
      setFocusAnswerId(currentQuestion.correctAnswerId);
      window.setTimeout(() => setFocusAnswerId(null), 1200);
    }

    setMessage({ title: getPowerUpLabel(id), text: "Бонус активирован.", correct: true });
    window.setTimeout(() => setMessage(null), 650);
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
        resetQuestionState(questionIndex);
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

    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    resetQuestionState(nextIndex);
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
              {getCategoryTitle(setup.category)} · {stageMap.title} · Вопрос {questionIndex + 1}/{questions.length}
            </p>
            <h1 className="mt-2 text-xl font-black text-white md:text-2xl">{currentQuestion.question}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-red-300">
              {Array.from({ length: lives }).map((_, index) => (
                <Heart key={index} size={20} fill="currentColor" />
              ))}
            </div>
            <div className="rounded-lg px-3 py-2 text-sm font-black text-black accent-bg">{correctAnswers} верно</div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#12101a] p-2 shadow-2xl shadow-black/35">
            <div
              className="grid aspect-square max-h-[min(72vh,760px)] w-full grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))] gap-1"
              aria-label="Квиз-лабиринт"
            >
              {stageMap.layout.map((row, rowIndex) =>
                [...row].map((tile, colIndex) => {
                  const position = { row: rowIndex, col: colIndex };
                  const answer = answerPositions.find((item) => samePosition(item.position, position) && !hiddenAnswerIds.includes(item.answer.id));
                  const powerUp = powerUps.find((item) => samePosition(item.position, position));
                  const isWallTile = tile === "#";

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={[
                        "relative grid min-h-0 place-items-center rounded-[5px]",
                        isWallTile ? "bg-cyan-500/25 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.18)]" : "bg-white/[0.035]",
                        answer ? "border bg-[var(--accent-soft)] accent-border" : "",
                        answer?.answer.id === focusAnswerId ? "ring-4 ring-white/80" : "",
                      ].join(" ")}
                    >
                      {answer && (
                        <span className="px-1 text-center text-[10px] font-black leading-tight text-white md:text-xs">
                          {answer.answer.text}
                        </span>
                      )}
                      {powerUp && <PowerUpSprite id={powerUp.id} size={32} />}
                    </div>
                  );
                }),
              )}
            </div>

            <div className="pointer-events-none absolute inset-2 z-10">
              {enemies.map((enemy) => (
                <motion.div
                  key={enemy.id}
                  className="absolute grid place-items-center"
                  animate={actorStyle(enemy.position)}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                >
                  <EnemySprite id={enemy.id} />
                </motion.div>
              ))}
              <motion.div
                className="absolute grid place-items-center"
                animate={actorStyle(player)}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              >
                <MiniPlayer skin={progress.selectedSkin} />
              </motion.div>
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
