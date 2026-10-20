
/* =========================================
   RAHMA BIRTHDAY SERVICE WORKER - V7
========================================= */

const CACHE_NAME = "rahma-birthday-v7";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.json",

    "./images/1.jpg",
    "./images/2.jpg",
    "./images/3.jpg",
    "./images/4.jpg",
    "./images/5.jpg",
    "./images/6.jpg",
    "./images/7.jpg",
    "./images/8.jpg",
    "./images/9.jpg"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(names => Promise.all(
                names
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);

    if (url.origin !== self.location.origin) return;

    // طلبات الصوت الجزئية: نسيب المتصفح يتعامل معاها.
    if (event.request.headers.has("range")) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request)
                .then(response => {
                    if (response.ok && response.status === 200) {
                        const copy = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache =>
                                cache.put(event.request, copy)
                            )
                            .catch(error =>
                                console.warn("Cache error:", error)
                            );
                    }

                    return response;
                })
                .catch(async () => {
                    if (event.request.mode === "navigate") {
                        const fallback =
                            await caches.match("./index.html");

                        if (fallback) return fallback;
                    }

                    return new Response("Offline", {
                        status: 503,
                        statusText: "Offline"
                    });
                });
        })
    );
});
