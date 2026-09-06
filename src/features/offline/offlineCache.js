const CACHE_NAME = "sih26042-content-v2";
const SHELL_CACHE = "sih26042-shell-v2";

function canCache() { return typeof window !== "undefined" && "caches" in window; }
function contentKey(id) { return `/__sih26042_content__/${encodeURIComponent(id)}`; }

export async function cacheLearningItem(item) {
  if (!canCache()) return false;
  const cache = await caches.open(CACHE_NAME);
  const payload = new Response(JSON.stringify({ ...item, cachedAt: new Date().toISOString() }), { headers: { "Content-Type": "application/json" } });
  await cache.put(contentKey(item.id), payload);
  return true;
}

export async function removeLearningItem(id) {
  if (!canCache()) return false;
  const cache = await caches.open(CACHE_NAME);
  return cache.delete(contentKey(id));
}

export async function hasLearningItem(id) {
  if (!canCache()) return false;
  const cache = await caches.open(CACHE_NAME);
  return Boolean(await cache.match(contentKey(id)));
}

export async function getOfflineContent() {
  if (!canCache()) return [];
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  return Promise.all(keys.map(async (request) => {
    try { return await (await cache.match(request)).json(); } catch { return null; }
  })).then((items) => items.filter(Boolean));
}

export async function getOfflineContentCount() { return (await getOfflineContent()).length; }

export async function cacheAppShell() {
  if (!canCache()) return false;
  const cache = await caches.open(SHELL_CACHE);
  try {
    await cache.add("/");
    return true;
  } catch { return false; }
}

export async function clearOfflineContent() {
  if (!canCache()) return false;
  return caches.delete(CACHE_NAME);
}
