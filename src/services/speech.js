export function isSpeechRecognitionSupported() {
  return typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
}

export function createSpeechRecognition({ language = "en-IN", onResult, onError, onEnd } = {}) {
  if (!isSpeechRecognitionSupported()) return null;
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new Recognition();
  recognition.lang = language;
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0]?.transcript || "")
      .join("");
    onResult?.(transcript, event.results[event.results.length - 1]?.isFinal);
  };
  recognition.onerror = (event) => onError?.(event.error || "speech-error");
  recognition.onend = () => onEnd?.();
  return recognition;
}

export function speakText(text, language = "en-IN") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(String(text || ""));
  utterance.lang = language;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}
