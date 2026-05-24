import questions from "@/data/questions.json";
import type { CategoryId, QuizQuestion } from "@/types/game";

export const CATEGORIES: { id: CategoryId; title: string; description: string }[] = [
  { id: "movies-series", title: "Кино и сериалы", description: "Фильмы, герои, цитаты и экранные легенды." },
  { id: "science-nature", title: "Наука и природа", description: "Космос, животные, тело человека и физика." },
  { id: "history-myths", title: "История и мифы", description: "Древние миры, легенды и известные события." },
  { id: "games-internet", title: "Игры и интернет", description: "Игры, мемы, технологии и онлайн-культура." },
  { id: "random-facts", title: "Случайные факты", description: "Странные рекорды и неожиданные знания." },
];

const typedQuestions = questions as QuizQuestion[];

export function getCategoryTitle(category: CategoryId) {
  return CATEGORIES.find((item) => item.id === category)?.title ?? "Квиз-забег";
}

export function getQuizRun(category: CategoryId, count: number) {
  const pool = typedQuestions.filter((question) => question.category === category);
  const safeCount = Math.min(Math.max(count, 3), 15);
  const result: QuizQuestion[] = [];

  for (let index = 0; index < safeCount; index += 1) {
    result.push(pool[index % pool.length]);
  }

  return result;
}

export function isSuccessfulRun(questionCount: number, correctAnswers: number) {
  if (questionCount <= 3) return correctAnswers >= 2;
  if (questionCount <= 5) return correctAnswers >= 4;
  if (questionCount <= 10) return correctAnswers >= 7;
  return correctAnswers >= 11;
}
