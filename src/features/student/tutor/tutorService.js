const API_URL = import.meta.env.VITE_AI_TUTOR_API_URL || "";

const fallback = ({ question, lessonTitle }) => ({
  answer: `Let's learn together. For ${lessonTitle || "this topic"}, first think about what you already know. Your question was: “${question}”. Try explaining it in your own words, and look for an example around you.`,
  source: "offline-helper",
});

export async function askTutor({ question, language = "en", lessonTitle = "" }) {
  const text = String(question || "").trim();
  if (!text) return null;
  if (!API_URL) return fallback({ question: text, lessonTitle });
  const response = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: text, language, lessonTitle }) });
  if (!response.ok) throw new Error("AI tutor unavailable");
  const data = await response.json();
  return { answer: data.answer || data.response || data.text || fallback({ question: text, lessonTitle }).answer, source: "ai" };
}
