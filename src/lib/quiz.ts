import questions from "@/data/questions.json";
import type { CategoryId, QuizQuestion } from "@/types/game";

export const CATEGORIES: {
  id: CategoryId;
  title: string;
  description: string;
}[] = [
  {
    id: "movies-series",
    title: "Кино и сериалы",
    description: "Фильмы, герои, цитаты и экранные легенды.",
  },

  {
    id: "science-nature",
    title: "Наука и природа",
    description: "Космос, животные, тело человека и физика.",
  },

  {
    id: "history-myths",
    title: "История и мифы",
    description: "Древние миры, легенды и известные события.",
  },

  {
    id: "games-internet",
    title: "Игры и интернет",
    description: "Игры, мемы, технологии и онлайн-культура.",
  },

  {
    id: "random-facts",
    title: "Случайные факты",
    description: "Странные рекорды и неожиданные знания.",
  },
];

const typedQuestions = questions as QuizQuestion[];

export function getCategoryTitle(category: CategoryId) {
  return (
    CATEGORIES.find((item) => item.id === category)?.title ??
    "Квиз-забег"
  );
}

export function getQuizRun(
  category: CategoryId,
  count: number,
): QuizQuestion[] {
  const pool = typedQuestions.filter(
    (question) => question.category === category,
  );

  const safeCount = Math.min(Math.max(count, 3), 15);

  const result: QuizQuestion[] = [];

  for (let index = 0; index < safeCount; index += 1) {
    result.push(pool[index % pool.length]);
  }

  return result;
}

export async function getQuizRunAI(
  category: CategoryId,
  count: number,
): Promise<QuizQuestion[]> {
  const safeCount = Math.min(Math.max(count, 3), 15);

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {
    const response = await fetch("/api/generate-quiz", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        category,
        count: safeCount,
      }),

      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(
        `Generate quiz failed: ${response.status}`,
      );
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid quiz response");
    }

    return data as QuizQuestion[];
  } catch (error) {
    console.error(
      "[QUIZ_AI_FALLBACK]",
      error,
    );

    return getQuizRun(category, safeCount);
  }
}

export function isSuccessfulRun(
  questionCount: number,
  correctAnswers: number,
) {
  if (questionCount <= 3) {
    return correctAnswers >= 2;
  }

  if (questionCount <= 5) {
    return correctAnswers >= 4;
  }

  if (questionCount <= 10) {
    return correctAnswers >= 7;
  }

  return correctAnswers >= 11;
}