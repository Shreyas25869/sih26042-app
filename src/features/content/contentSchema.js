export const QUESTION_TYPES = ["multiple-choice", "true-false"];

export function createQuestion(overrides = {}) {
  return {
    id: overrides.id || `question-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: overrides.type || "multiple-choice",
    text: overrides.text || "",
    options: Array.isArray(overrides.options) && overrides.options.length ? overrides.options : ["Option A", "Option B", "Option C", "Option D"],
    answer: Number.isInteger(overrides.answer) ? overrides.answer : 0,
    explanation: overrides.explanation || "Review the lesson idea and try again.",
  };
}

export function normalizeQuiz(quiz) {
  const questions = Array.isArray(quiz?.questionItems) ? quiz.questionItems.map(createQuestion) : [];
  return { ...quiz, questions: questions.length || quiz?.questions || 0, questionItems: questions };
}

export function createLessonSections({ description = "", title = "" } = {}) {
  return [
    { id: "start", label: "Start here", title: "What will you learn?", text: description || `Today we will learn about ${title}. Connect this idea to something you see around you.` },
    { id: "learn", label: "Learn", title: "The main idea", text: `Read the main idea about ${title} slowly. Think of one example from your home, school or community.` },
    { id: "try", label: "Try it", title: "Your turn", text: "Explain the idea in your own words. Then name one thing you can observe, draw or discuss with your teacher." },
  ];
}
