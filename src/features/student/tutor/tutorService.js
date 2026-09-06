import { getModelConfig, postModel } from "../../../services/modelAdapter";

const fallback = ({ question, lessonTitle }) => ({
  answer: `Let's learn together. For ${lessonTitle || "this topic"}, first think about what you already know. Your question was: “${question}”. Try explaining it in your own words, and look for an example around you.`,
  source: "offline-helper",
});

export async function askTutor({ question, language = "en", lessonTitle = "" }) {
  const text = String(question || "").trim();
  if (!text) return null;
  const config = getModelConfig();
  const url = import.meta.env.VITE_AI_TUTOR_API_URL || config.aiTutorUrl;
  if (!url) return fallback({ question: text, lessonTitle });
  const data = await postModel(url, { question: text, language, lessonTitle });
  return { answer: data.answer || data.response || data.text || fallback({ question: text, lessonTitle }).answer, source: "ai" };
}
