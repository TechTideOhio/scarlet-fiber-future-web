// Kill-switch service worker.
// Replaces the previous app-shell service worker. Its only job is to activate
// once, drop the caches it created, unregister itself, and reload open tabs
// so returning visitors stop being served stale HTML.
//
// Cache Storage is origin-scoped, so we only delete caches this worker owned.
// unregister() runs in `finally` — activate only fires once, and any earlier
// rejection would otherwise leave the worker registered forever.

function isOwnCache(name) {
  return (
    name === 'buckeye-datacom-v2' ||
    name === 'static-v2' ||
    name === 'dynamic-v2' ||
    name.startsWith('buckeye-') ||
    name.startsWith('static-') ||
    name.startsWith('dynamic-')
  );
}

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) =>
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const owned = cacheNames.filter(isOwnCache);
        await Promise.allSettled(owned.map((name) => caches.delete(name)));
        await self.clients.claim();
        const windowClients = await self.clients.matchAll({ type: 'window' });
        await Promise.allSettled(
          windowClients.map((client) => client.navigate(client.url))
        );
      } finally {
        await self.registration.unregister();
      }
    })()
  )
);

// Pass all fetches straight through — no caching, no interception.
self.addEventListener('fetch', () => {});
