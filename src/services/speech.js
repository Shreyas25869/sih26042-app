import { getModelConfig, postModel } from "./modelAdapter";

const LANGUAGE_CODES = { en: "en-IN", hi: "hi-IN", san: "hi-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN", mr: "mr-IN" };
export function getSpeechLanguage(language = "en") { return LANGUAGE_CODES[language] || language || "en-IN"; }

export function isSpeechRecognitionSupported() {
  return typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
}

export function createSpeechRecognition({ language = "en", onResult, onError, onEnd } = {}) {
  if (!isSpeechRecognitionSupported()) return null;
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new Recognition();
  recognition.lang = getSpeechLanguage(language);
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.onresult = (event) => {
    const transcript = Array.from(event.results).map((result) => result[0]?.transcript || "").join("");
    onResult?.(transcript, event.results[event.results.length - 1]?.isFinal);
  };
  recognition.onerror = (event) => onError?.(event.error || "speech-error");
  recognition.onend = () => onEnd?.();
  return recognition;
}

export function speakText(text, language = "en") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(String(text || ""));
  utterance.lang = getSpeechLanguage(language);
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

export async function recognizeWithModel({ audio, language = "en", signal } = {}) {
  const url = getModelConfig().speechRecognitionUrl;
  if (!url) return null;
  const data = await postModel(url, { audio, language }, { signal });
  return data.transcript || data.text || "";
}

export async function synthesizeWithModel({ text, language = "en", signal } = {}) {
  const url = getModelConfig().speechSynthesisUrl;
  if (!url) return null;
  return postModel(url, { text: String(text || ""), language }, { signal });
}
