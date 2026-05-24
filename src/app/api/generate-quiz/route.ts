import { NextRequest, NextResponse } from "next/server";
import type { CategoryId, QuizQuestion } from "@/types/game";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/v1/chat/completions";

const CATEGORY_DESCRIPTIONS: Record<CategoryId, string> = {
  "movies-series": "Фильмы, сериалы, актеры, персонажи и кинофакты",
  "science-nature": "Наука, космос, животные, физика и природные явления",
  "history-myths": "История, древние цивилизации, мифология и известные события",
  "games-internet": "Видеоигры, интернет-культура, мемы и технологии",
  "random-facts": "Странные рекорды, неожиданные факты и курьезные знания",
};

export async function POST(request: NextRequest) {
  try {
    if (!DEEPSEEK_API_KEY) {
      console.error("DEEPSEEK_API_KEY not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { category, count } = body as { category: CategoryId; count: number };

    // Validate inputs
    if (!category || typeof count !== "number") {
      return NextResponse.json(
        { error: "Invalid parameters: category and count are required" },
        { status: 400 }
      );
    }

    if (!CATEGORY_DESCRIPTIONS[category]) {
      return NextResponse.json(
        { error: `Invalid category: ${category}` },
        { status: 400 }
      );
    }

    const safeCount = Math.min(Math.max(count, 3), 15);

    const prompt = buildPrompt(category, safeCount);

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("DeepSeek API error:", error);
      return NextResponse.json(
        { error: "Failed to generate quiz" },
        { status: response.status }
      );
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("No content from DeepSeek");
      return NextResponse.json(
        { error: "Invalid response from AI" },
        { status: 500 }
      );
    }

    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("Could not extract JSON from response:", content);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const questions = JSON.parse(jsonMatch[0]) as QuizQuestion[];

    // Validate questions
    const validQuestions = validateQuestions(questions, category);
    if (validQuestions.length === 0) {
      console.error("No valid questions generated");
      return NextResponse.json(
        { error: "Failed to generate valid questions" },
        { status: 500 }
      );
    }

    return NextResponse.json(validQuestions);
  } catch (error) {
    console.error("Error in generate-quiz:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildPrompt(category: CategoryId, count: number): string {
  const categoryDescription = CATEGORY_DESCRIPTIONS[category];

  return `You are a quiz master. Generate ${count} quiz questions in Russian ONLY about: "${categoryDescription}".

Format your response as a valid JSON array (and ONLY the JSON array, no other text).
Each question must have exactly this structure:
{
  "id": "unique-id-here",
  "category": "${category}",
  "question": "Question text in Russian",
  "answers": [
    { "id": "a", "text": "Answer option 1" },
    { "id": "b", "text": "Answer option 2" },
    { "id": "c", "text": "Answer option 3" },
    { "id": "d", "text": "Answer option 4" }
  ],
  "correctAnswerId": "a",
  "funFact": "Interesting fun fact related to the question in Russian",
  "explanation": "Brief explanation why the answer is correct in Russian"
}

IMPORTANT RULES:
1. ALL text (questions, answers, fun facts, explanations) MUST be in Russian
2. Generate EXACTLY ${count} questions
3. Shuffle the correct answer position (a, b, c, or d)
4. Make all wrong answers plausible but clearly incorrect
5. Make fun facts interesting and relevant
6. Return ONLY valid JSON array, no markdown, no code blocks, no other text
7. Ensure all answer IDs are unique within each question (a, b, c, d)`;
}

function validateQuestions(
  questions: unknown,
  expectedCategory: CategoryId
): QuizQuestion[] {
  if (!Array.isArray(questions)) {
    console.error("Questions is not an array");
    return [];
  }

  return questions.filter((q) => {
    // Check basic structure
    if (typeof q !== "object" || q === null) return false;

    const question = q as Record<string, unknown>;

    // Validate required fields
    if (
      typeof question.question !== "string" ||
      !question.question.trim() ||
      typeof question.funFact !== "string" ||
      !question.funFact.trim() ||
      typeof question.explanation !== "string" ||
      !question.explanation.trim() ||
      typeof question.correctAnswerId !== "string" ||
      question.category !== expectedCategory
    ) {
      return false;
    }

    // Validate answers array
    if (!Array.isArray(question.answers) || question.answers.length !== 4) {
      return false;
    }

    const answers = question.answers as unknown[];
    const validAnswers = answers.every((a) => {
      if (typeof a !== "object" || a === null) return false;
      const answer = a as Record<string, unknown>;
      return (
        typeof answer.id === "string" &&
        ["a", "b", "c", "d"].includes(answer.id) &&
        typeof answer.text === "string" &&
        answer.text.trim()
      );
    });

    if (!validAnswers) {
      return false;
    }

    // Check correctAnswerId is valid
    const answerIds = (question.answers as Array<{ id: string }>).map(
      (a) => a.id
    );
    if (!answerIds.includes(question.correctAnswerId as string)) {
      return false;
    }

    return true;
  }) as QuizQuestion[];
}
