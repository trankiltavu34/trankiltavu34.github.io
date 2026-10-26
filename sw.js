// Service worker : l'appli fonctionne aussi sans connexion
const CACHE = "apprendre-poker-1.0.0";
const FICHIERS = ["./", "index.html", "manifest.json", "icones/icone-192.png", "icones/icone-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(rep => {
    if (rep.ok && new URL(e.request.url).origin === location.origin) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); }
    return rep;
  }).catch(() => caches.match("index.html"))));
});
