const KEY = "sih26042:offline-center";
const DEFAULT = { downloads: {}, lastSync: null };
export function loadOfflineState(){try{return {...DEFAULT,...JSON.parse(localStorage.getItem(KEY))}}catch{return DEFAULT}}
export function saveOfflineState(next){localStorage.setItem(KEY,JSON.stringify(next));return next}
export function toggleOfflineItem(id,enabled){const current=loadOfflineState();const next={...current,downloads:{...current.downloads,[id]:enabled}};return saveOfflineState(next)}
export function markOfflineSync(){return saveOfflineState({...loadOfflineState(),lastSync:new Date().toISOString()})}
