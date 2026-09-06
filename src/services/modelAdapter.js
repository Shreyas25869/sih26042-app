const CONFIG_KEY = "sih26042:model-config";

const defaults = {
  aiTutorUrl: "",
  translatorUrl: "",
  speechRecognitionUrl: "",
  speechSynthesisUrl: "",
  mode: "auto",
};

export function loadModelConfig() {
  try { return { ...defaults, ...(JSON.parse(localStorage.getItem(CONFIG_KEY)) || {}) }; } catch { return defaults; }
}

export function saveModelConfig(config) {
  const next = { ...defaults, ...config };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
  return next;
}

export function getModelConfig() { return loadModelConfig(); }

export function getModelStatus() {
  const config = loadModelConfig();
  return {
    aiTutor: Boolean(config.aiTutorUrl),
    translator: Boolean(config.translatorUrl),
    speechRecognition: Boolean(config.speechRecognitionUrl),
    speechSynthesis: Boolean(config.speechSynthesisUrl),
    mode: config.mode,
  };
}

export async function postModel(url, body, { signal } = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.ok) throw new Error(`Model request failed (${response.status})`);
  return response.json();
}
