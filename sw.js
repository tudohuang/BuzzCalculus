const CACHE_NAME = "buzzcalculus-v1.0.0-2026-08-31";
const CACHE_PREFIX = "buzzcalculus-";
const APP_SHELL = [
  "./privacy.html",
  "./about.html",
  "./changelog.html",
  "./terms.html",
  "./",
  "./index.html",
  "./workbook.html",
  "./styles.css",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/vendor/katex/katex.min.css",
  "./assets/vendor/katex/katex.min.js",
  "./assets/vendor/icons.js",
  "./assets/vendor/anime.min.js",
  "./assets/vendor/katex/fonts/KaTeX_AMS-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Caligraphic-Bold.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Caligraphic-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Fraktur-Bold.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Fraktur-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Main-Bold.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Main-BoldItalic.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Main-Italic.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Main-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Math-BoldItalic.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Math-Italic.woff2",
  "./assets/vendor/katex/fonts/KaTeX_SansSerif-Bold.woff2",
  "./assets/vendor/katex/fonts/KaTeX_SansSerif-Italic.woff2",
  "./assets/vendor/katex/fonts/KaTeX_SansSerif-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Script-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Size1-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Size2-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Size3-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Size4-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Typewriter-Regular.woff2",
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
  "./src/problem_set_interval_pack.js",
  "./src/problem_set_interval_expansion.js",
  "./src/problem_graph_choice_pack.js",
  "./src/problem_curve_worksheet_pack.js",
  "./src/problem_derivative_depth_pack.js",
  "./src/problem_chain_depth_pack.js",
  "./src/problem_generated_pack.js",
  "./src/problem_difficulty_calibration.js",
  "./src/board_store.js",
  "./src/custom_problems.js",
  "./src/problem_world_universities.js",
  "./src/problem_competition_pack.js",
  "./src/problem_vector_calculus_pack.js",
  "./src/problem_core_expansion_pack.js",
  "./src/problem_applied_graph_pack.js",
  "./src/problem_damo_pack.js",
  "./src/proofs.js",
  "./src/kernel/uid_map.js",
  "./src/kernel/origin.js",
  "./src/kernel/rubric_reviewed.js",
  "./src/kernel/rubric.js",
  "./src/kernel/derived_hints.js",
  "./src/kernel/verified_answers.js",
  "./src/kernel/board_render.js",
  "./src/kernel/workbook_facts.js",
  "./src/kernel/pricing.js",
  "./src/kernel/equivalence.js",
  "./src/kernel/records_v2.js",
  "./src/kernel/skill_tags.js",
  "./src/kernel/skill_graph.js",
  "./src/kernel/ability.js",
  "./src/kernel/planner.js",
  "./src/kernel/session.js",
  "./src/app.js"
];

// 新版本要等使用者同意才生效。
//
// 舊行為是 install 就 skipWaiting，然後在 activate 把所有分頁強制導航一次 ——
// 也就是說：部署一次，正在作答的人畫面就重新載入。模擬考考到一半被刷掉，
// 而使用者完全不知道發生了什麼事。
//
// 現在改成：新的 sw 安裝完就停在 waiting，由 app 顯示「有新版本」，
// 使用者按下去才 skipWaiting + reload。什麼時候更新是他決定的。
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        const staleKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME);
        return Promise.all(staleKeys.map((key) => caches.delete(key)));
      })
      .then(() => self.clients.claim())
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
