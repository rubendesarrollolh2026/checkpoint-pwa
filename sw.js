const CACHE="checkpoint-v6";

self.addEventListener("install", e=>{
self.skipWaiting();

e.waitUntil(
caches.open(CACHE).then(cache=>
cache.addAll([
"/",
"/index.html",
"/style.css",
"/app.js",
"/manifest.json",
"/assets/icon-192.png",
"/assets/icon-512.png"
])
)
);
});

self.addEventListener("activate", e=>{
clients.claim();
});

self.addEventListener("fetch", e=>{
e.respondWith(
caches.match(e.request)
.then(r=>r || fetch(e.request))
);
});
