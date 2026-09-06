const API_URL = import.meta.env.VITE_TRANSLATOR_API_URL || "";

export async function translateText({ text, sourceLanguage = "auto", targetLanguage }) {
  const value = String(text || "").trim();
  if (!value) return "";
  if (!targetLanguage || sourceLanguage === targetLanguage) return value;

  // Optional remote translator. The core app stays usable offline.
  if (API_URL) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value, sourceLanguage, targetLanguage }),
    });
    if (!response.ok) throw new Error("Translation service unavailable");
    const data = await response.json();
    return data.translation || data.translatedText || value;
  }

  // Offline dictionary hook. Add trained/local language packs here.
  const key = `${sourceLanguage}:${targetLanguage}`;
  const dictionary = JSON.parse(localStorage.getItem(`sih26042:translations:${key}`) || "{}");
  return dictionary[value] || value;
}

export function saveOfflineTranslation({ text, translation, sourceLanguage, targetLanguage }) {
  const key = `${sourceLanguage}:${targetLanguage}`;
  const storageKey = `sih26042:translations:${key}`;
  const dictionary = JSON.parse(localStorage.getItem(storageKey) || "{}");
  dictionary[String(text).trim()] = String(translation).trim();
  localStorage.setItem(storageKey, JSON.stringify(dictionary));
}
