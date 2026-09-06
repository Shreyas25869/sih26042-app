const CACHE_NAME = "sih26042-content-v1";

function canCache() {
  return typeof window !== "undefined" && "caches" in window;
}

export async function cacheLearningItem(item) {
  if (!canCache()) return false;
  const cache = await caches.open(CACHE_NAME);
  const key = `/__sih26042_content__/${encodeURIComponent(item.id)}`;
  const payload = new Response(JSON.stringify({ ...item, cachedAt: new Date().toISOString() }), {
    headers: { "Content-Type": "application/json" },
  });
  await cache.put(key, payload);
  return true;
}

export async function removeLearningItem(id) {
  if (!canCache()) return false;
  const cache = await caches.open(CACHE_NAME);
  return cache.delete(`/__sih26042_content__/${encodeURIComponent(id)}`);
}

export async function hasLearningItem(id) {
  if (!canCache()) return false;
  const cache = await caches.open(CACHE_NAME);
  return Boolean(await cache.match(`/__sih26042_content__/${encodeURIComponent(id)}`));
}

export async function getOfflineContentCount() {
  if (!canCache()) return 0;
  const cache = await caches.open(CACHE_NAME);
  return (await cache.keys()).length;
}

export async function cacheAppShell() {
  if (!canCache()) return false;
  const cache = await caches.open(CACHE_NAME);
  try {
    await cache.add("/");
    return true;
  } catch {
    return false;
  }
}
