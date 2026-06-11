const CACHE_NAME = "buzzcalculus-v0.9.0-beta-20260611";
const APP_SHELL = [
  "./",
  "./index.html",
  "./workbook.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./src/problems.js",
  "./src/problem_extensions.js",
  "./src/problem_extensions_2.js",
  "./src/problem_integrals_hard.js",
  "./src/problem_advanced_analysis.js",
  "./src/problem_gap_pack.js",
  "./src/problem_mobile_advanced_pack.js",
  "./src/problem_release_expansion.js",
  "./src/problem_hard_expansion.js",
  "./src/problem_hardcore_50.js",
  "./src/problem_difficulty_calibration.js",
  "./src/proofs.js",
  "./src/app.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
