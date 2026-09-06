const QUEUE_KEY = "sih26042:sync-queue";
export const PACKAGE_VERSION = 2;

function readQueue() { try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch { return []; } }
function writeQueue(items) { localStorage.setItem(QUEUE_KEY, JSON.stringify(items.slice(-100))); }

export function queueOfflineChange(type, payload) {
  const item = { id: `change-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, payload, createdAt: new Date().toISOString(), status: "pending" };
  writeQueue([...readQueue(), item]);
  return item;
}
export function getSyncQueue() { return readQueue(); }
export function getPendingChanges() { return readQueue().filter((item) => item.status === "pending"); }
export function getReadyChanges() { return readQueue().filter((item) => item.status === "ready"); }
export function markChangesReadyForSync() { const next=readQueue().map(item=>item.status==="pending"?{...item,status:"ready"}:item); writeQueue(next); return next; }
export function markChangesSynced(ids) { const wanted=new Set(ids || []); const next=readQueue().filter(item=>!wanted.has(item.id)); writeQueue(next); return next; }
export function clearSyncQueue() { writeQueue([]); }

export function exportOfflinePackage(state, classroom, offlineState) {
  return { app:"SIH 26042", packageVersion:PACKAGE_VERSION, exportedAt:new Date().toISOString(), state, classroom, offlineState, pendingChanges:getPendingChanges() };
}
export function validateOfflinePackage(value) { return Boolean(value && value.app === "SIH 26042" && Number(value.packageVersion) >= 1 && value.state && value.classroom && value.offlineState); }
export function importOfflinePackage(value) { if(!validateOfflinePackage(value)) throw new Error("Invalid SIH 26042 offline package"); localStorage.setItem("sih26042-state",JSON.stringify(value.state)); localStorage.setItem("sih26042:classroom",JSON.stringify(value.classroom)); localStorage.setItem("sih26042:offline-center",JSON.stringify(value.offlineState)); if(Array.isArray(value.pendingChanges)) writeQueue(value.pendingChanges); return value; }
