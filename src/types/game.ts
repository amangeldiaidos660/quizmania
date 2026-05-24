export type CategoryId =
  | "movies-series"
  | "science-nature"
  | "history-myths"
  | "games-internet"
  | "random-facts";

export type SkinId =
  | "base-muncher"
  | "notebook-rookie"
  | "memory-sprinter"
  | "focus-hacker"
  | "quiz-oracle";

export type AccentColorId = "yellow" | "lime" | "cyan" | "pink" | "violet" | "orange";

export type Tile = "wall" | "path";

export type Position = {
  row: number;
  col: number;
};

export type Direction = "up" | "down" | "left" | "right";

export type AnswerOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  category: CategoryId;
  question: string;
  answers: AnswerOption[];
  correctAnswerId: string;
  funFact: string;
  explanation: string;
};

export type GameSetup = {
  category: CategoryId;
  questionCount: number;
};

export type GameResult = {
  category: CategoryId;
  questionCount: number;
  correctAnswers: number;
  livesLeft: number;
  isSuccessful: boolean;
  bestFunFact: string;
};

export type ProgressState = {
  successfulRuns: number;
  selectedSkin: SkinId;
  unlockedSkins: SkinId[];
  accentColor: AccentColorId;
};
