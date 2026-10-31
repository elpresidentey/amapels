/* AMAPELS service worker — offline support + fast repeat visits */
/* NOTE: bump VERSION on every deploy that changes styling/pages so old caches are purged on activate */
const VERSION = 'amapels-v2'
const STATIC_CACHE = `${VERSION}-static`
const PAGES_CACHE = `${VERSION}-pages`
const IMAGES_CACHE = `${VERSION}-images`

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(['/']).catch(() => undefined))
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))
      )
      await self.clients.claim()
    })()
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Never intercept API calls — responses may contain account/session data
  if (url.pathname.startsWith('/api/')) return

  // Pages: network-first, cached shell as offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request)
          const cache = await caches.open(PAGES_CACHE)
          cache.put(request, fresh.clone()).catch(() => undefined)
          return fresh
        } catch {
          const cached = await caches.match(request)
          return cached || (await caches.match('/')) || Response.error()
        }
      })()
    )
    return
  }

  // Hashed build assets: cache-first (safe — names change on rebuild)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request)
        if (cached) return cached
        const fresh = await fetch(request)
        if (fresh.ok) {
          const cache = await caches.open(STATIC_CACHE)
          cache.put(request, fresh.clone()).catch(() => undefined)
        }
        return fresh
      })()
    )
    return
  }

  // Images: stale-while-revalidate
  if (request.destination === 'image') {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request)
        const network = fetch(request)
          .then((fresh) => {
            if (fresh.ok) {
              caches.open(IMAGES_CACHE).then((cache) => cache.put(request, fresh.clone()))
            }
            return fresh
          })
          .catch(() => undefined)
        if (cached) return cached
        return (await network) || Response.error()
      })()
    )
    return
  }

  // Everything else (fonts, CSS, RSC payloads): network-first with cache fallback
  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(request)
        if (fresh.ok) {
          const cache = await caches.open(STATIC_CACHE)
          cache.put(request, fresh.clone()).catch(() => undefined)
        }
        return fresh
      } catch {
        const cached = await caches.match(request)
        return cached || Response.error()
      }
    })()
  )
})
