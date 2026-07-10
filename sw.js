const CACHE_NAME = "buzzcalculus-v0.11.2-beta-20260710-applied";
const CACHE_PREFIX = "buzzcalculus-";
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
  "./src/problem_exam_expansion.js",
  "./src/problem_university_exam_pack.js",
  "./src/problem_exam_depth_pack.js",
  "./src/problem_todai_burst_pack.js",
  "./src/problem_difficulty_calibration.js",
  "./src/custom_problems.js",
  "./src/problem_world_universities.js",
  "./src/problem_competition_pack.js",
  "./src/problem_vector_calculus_pack.js",
  "./src/problem_core_expansion_pack.js",
  "./src/problem_applied_graph_pack.js",
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
      .then((keys) => {
        const staleKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME);
        return Promise.all(staleKeys.map((key) => caches.delete(key))).then(() => staleKeys.length > 0);
      })
      .then((hadStaleCache) => self.clients.claim().then(() => hadStaleCache))
      .then((hadStaleCache) => {
        if (!hadStaleCache) return undefined;
        return self.clients.matchAll({ type: "window", includeUncontrolled: true });
      })
      .then((clients = []) => {
        clients.forEach((client) => {
          const url = new URL(client.url);
          if (url.origin === self.location.origin) client.navigate(client.url);
        });
      })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const networkRequest = event.request.url.startsWith(self.location.origin)
    ? new Request(event.request, { cache: "reload" })
    : event.request;
  event.respondWith(
    fetch(networkRequest)
      .then((response) => {
        if (response && (response.ok || response.type === "opaque")) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
