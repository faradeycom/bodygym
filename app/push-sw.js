/* Push reminders (group classes): shown by the service worker even when the app is closed.
   Imported into the generated service worker (vite.config.js → workbox.importScripts). */
self.addEventListener('push', (event) => {
  let d = {}
  try { d = event.data ? event.data.json() : {} } catch { d = { title: 'Sport Hub', body: event.data ? event.data.text() : '' } }
  event.waitUntil(self.registration.showNotification(d.title || 'Sport Hub', {
    body: d.body || '',
    tag: d.tag || 'sporthub',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    data: { url: d.url || './' }
  }))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data && event.notification.data.url
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const c of all) { if ('focus' in c) { await c.focus(); if (url && 'navigate' in c) c.navigate(url); return } }
    if (url) await self.clients.openWindow(url)
  })())
})
