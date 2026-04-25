const CACHE="checkpoint-v7";

const FILES=[
"/checkpoint-pwa/",
"/checkpoint-pwa/index.html",
"/checkpoint-pwa/style.css",
"/checkpoint-pwa/app.js",
"/checkpoint-pwa/manifest.json",
"/checkpoint-pwa/assets/icon-192.png",
"/checkpoint-pwa/assets/icon-512.png"
];


self.addEventListener(
"install",
e=>{

self.skipWaiting();

e.waitUntil(
caches.open(CACHE)
.then(cache=>
cache.addAll(FILES)
)
);

}
);



self.addEventListener(
"activate",
e=>{

clients.claim();

}
);



self.addEventListener(
"fetch",
e=>{

e.respondWith(
caches.match(
e.request
)
.then(
r=>r || fetch(e.request)
)
);

}
);
