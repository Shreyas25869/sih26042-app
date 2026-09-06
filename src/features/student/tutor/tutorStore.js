const KEY = "sih26042:tutor-history";
export function loadTutorHistory() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }
export function saveTutorHistory(items) { localStorage.setItem(KEY, JSON.stringify(items.slice(-30))); }
export function addTutorMessage(message) { const next=[...loadTutorHistory(),{id:`m-${Date.now()}`,createdAt:new Date().toISOString(),...message}]; saveTutorHistory(next); return next; }
