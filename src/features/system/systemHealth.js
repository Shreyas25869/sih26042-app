const QUEUE_KEY = "sih26042:sync-queue";
const STATE_KEY = "sih26042-state";

function safeRead(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}

export function collectSystemHealth({ online = navigator.onLine } = {}) {
  const queue = safeRead(QUEUE_KEY, []);
  const state = safeRead(STATE_KEY, {});
  const storage = typeof navigator !== "undefined" && navigator.storage ? navigator.storage : null;
  return {
    checkedAt: new Date().toISOString(),
    online: Boolean(online),
    serviceWorker: typeof navigator !== "undefined" && "serviceWorker" in navigator,
    cacheStorage: typeof window !== "undefined" && "caches" in window,
    localStorage: typeof window !== "undefined" && "localStorage" in window,
    speechRecognition: typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window),
    speechSynthesis: typeof window !== "undefined" && "speechSynthesis" in window,
    pendingChanges: queue.filter(item => item.status === "pending").length,
    readyChanges: queue.filter(item => item.status === "ready").length,
    hasProfile: Boolean(state.user),
    storageEstimateSupported: Boolean(storage?.estimate),
  };
}

export async function getStorageEstimate() {
  try {
    if (!navigator.storage?.estimate) return null;
    const value = await navigator.storage.estimate();
    return { usage: value.usage || 0, quota: value.quota || 0 };
  } catch { return null; }
}

export function buildDiagnostics() {
  return {
    app: "SIH 26042",
    reportVersion: 1,
    generatedAt: new Date().toISOString(),
    health: collectSystemHealth(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    language: typeof navigator !== "undefined" ? navigator.language : "unknown",
  };
}

export function downloadDiagnostics() {
  const blob = new Blob([JSON.stringify(buildDiagnostics(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sih26042-diagnostics-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
