export function getStorageUsage() {
  if (typeof localStorage === "undefined") return { bytes: 0, kb: 0 };
  let bytes = 0;
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index) || "";
    const value = localStorage.getItem(key) || "";
    bytes += new Blob([key, value]).size;
  }
  return { bytes, kb: Math.round(bytes / 1024) };
}

export function getConnectionSnapshot() {
  if (typeof navigator === "undefined") return { online: false, effectiveType: "unknown", saveData: false };
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType || "unknown",
    saveData: Boolean(connection?.saveData),
  };
}

export function getAppDiagnostics() {
  return {
    generatedAt: new Date().toISOString(),
    connection: getConnectionSnapshot(),
    storage: getStorageUsage(),
    serviceWorker: typeof navigator !== "undefined" && "serviceWorker" in navigator,
    cacheStorage: typeof window !== "undefined" && "caches" in window,
    speechRecognition: typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window),
    speechSynthesis: typeof window !== "undefined" && "speechSynthesis" in window,
  };
}

export function downloadDiagnostics() {
  if (typeof document === "undefined") return false;
  const blob = new Blob([JSON.stringify(getAppDiagnostics(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `sih26042-diagnostics-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  return true;
}
