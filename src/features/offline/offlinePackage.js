import { cacheLearningItem, getOfflineContent, removeLearningItem } from "./offlineCache";

export const OFFLINE_PACKAGE_VERSION = 2;
const ASSET_KEY = "sih26042:offline-assets";
function readAssets() { try { return JSON.parse(localStorage.getItem(ASSET_KEY) || "{}"); } catch { return {}; } }
function writeAssets(value) { localStorage.setItem(ASSET_KEY, JSON.stringify(value)); return value; }
export function loadOfflineAssets() { return readAssets(); }
export function setOfflineAsset(kind, config) { const current=readAssets(); current[kind]={...config,updatedAt:new Date().toISOString()}; return writeAssets(current); }
export function getOfflineAssetStatus() { const assets=readAssets(); return { languagePacks:Boolean(assets.languagePacks?.ready), audio:Boolean(assets.audio?.ready), models:Boolean(assets.models?.ready) }; }
export async function prepareOfflineContent(items) { const results=[]; for(const item of items||[]){if(!item?.id)continue;results.push({id:item.id,ok:await cacheLearningItem(item)});} return results; }
export async function removeOfflineContent(items) { for(const item of items||[]) if(item?.id) await removeLearningItem(item.id); }
export async function cacheRemoteAssets(urls=[]) { if(typeof window==="undefined"||!("caches" in window)) return []; const cache=await caches.open("sih26042-assets-v1"); const results=[]; for(const url of urls){try{const response=await fetch(url);if(response.ok){await cache.put(url,response.clone());results.push({url,ok:true});}else results.push({url,ok:false});}catch{results.push({url,ok:false});}} return results; }
export async function clearRemoteAssets() { if(typeof window==="undefined"||!("caches" in window)) return false; return caches.delete("sih26042-assets-v1"); }
export async function getOfflinePackageSnapshot() { return {version:OFFLINE_PACKAGE_VERSION,createdAt:new Date().toISOString(),content:await getOfflineContent(),assets:readAssets()}; }
export function validateOfflinePackageV2(value) { return Boolean(value&&value.app==="SIH 26042"&&Number(value.packageVersion)>=1&&value.state&&value.classroom&&value.offlineState); }
