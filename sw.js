const CACHE_NAME = "buzzcalculus-v1.2.1-2026-10-09-chapters";
const CACHE_PREFIX = "buzzcalculus-";
const APP_SHELL = [
  "./privacy.html",
  "./about.html",
  "./terms.html",
  "./guide.html",
  "./",
  "./index.html",
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
  "./src/problem_burst_pack.js",
  "./src/problem_set_interval_pack.js",
  "./src/problem_set_interval_expansion.js",
  "./src/problem_graph_choice_pack.js",
  "./src/problem_graph_interactive_pack.js",
  "./src/problem_curve_worksheet_pack.js",
  "./src/problem_derivative_depth_pack.js",
  "./src/problem_chain_depth_pack.js",
  "./src/problem_limit_beyond_taylor_pack.js",
  "./src/problem_analysis_pack.js",
  "./src/problem_textbook_pack.js",
  "./src/problem_ode_pack.js",
  "./src/problem_lecture_pack.js",
  "./src/problem_authored_hints.js",
  "./src/problem_authored_solutions.js",
  "./src/problem_solution_steps.js",
  "./src/problem_generated_pack.js",
  "./src/problem_foundations_pack.js",
  "./src/problem_difficulty_calibration.js",
  "./src/problem_time_calibration.js",
  "./src/board_store.js",
  "./src/custom_problems.js",
  "./src/problem_world_universities.js",
  "./src/problem_competition_pack.js",
  "./src/problem_vector_calculus_pack.js",
  "./src/problem_core_expansion_pack.js",
  "./src/problem_applied_graph_pack.js",
  "./src/problem_longform_pack.js",
  "./src/proofs.js",
  "./src/kernel/uid_map.js",
  "./src/kernel/origin.js",
  "./src/kernel/rubric_reviewed.js",
  "./src/kernel/rubric.js",
  "./src/kernel/derived_hints.js",
  "./src/kernel/verified_answers.js",
  "./src/kernel/daily_one_history.js",
  "./src/kernel/board_render.js",
  "./src/kernel/equivalence.js",
  "./src/kernel/answer_sampling.js",
  "./src/kernel/records_v2.js",
  "./src/kernel/skill_tags.js",
  "./src/kernel/skill_graph.js",
  "./src/kernel/tex_lite.js",
  "./src/kernel/ink_read.js",
  "./src/kernel/canned_hints.js",
  "./src/kernel/tag_labels.js",
  "./src/kernel/i18n.js",
  "./src/kernel/i18n_en.js",
  "./src/kernel/proof_lang.js",
  "./src/kernel/proof_surface.js",
  "./src/proof_lang_content.js",
  "./src/proof_lab_ui.js",
  "./src/course.js",
  "./src/course_v2/outline.js",
  "./src/course_v2_ui.js",
  "./src/course_figures.js",
  "./src/course_v2/map.js",
  "./src/course_map.js",
  "./src/course_video.js",
  "./src/course_sections.js",
  "./src/course_finish.js",
  "./src/course_proof.js",
  "./src/share_cards.js",
  "./src/kernel/ability.js",
  "./src/kernel/planner.js",
  "./src/kernel/session.js",
  "./src/app.js"
];

// 只有英文介面才抓的內容側表：不進 install 預快取 —— 中文使用者一個位元組都不用下載。
// 英文使用者開站時 app.js 會抓它們，下面的 fetch handler 順手存進快取，之後離線照樣能用。
const LANG_ONLY = [
  "./src/kernel/i18n_problems_en.js",
  "./src/kernel/i18n_text_en.js"
];

// 新版課程的課文按章分檔（src/course_v2/ch-*.js，74 支，合計約 2MB；分節推到全部的課之後約 3.5MB）不進 install 預快取：
// 英文介面用不到，中文介面也只有打開課程的人才需要 —— 每個裝了 PWA 的人都先下載 3.5MB 不划算。
// 改成「用到才快取」：打開一課抓那一章（經過下面的 fetch handler 存進快取）；課程表第一次打開時 course_v2_ui.js
// 在閒置時把每一章抓一遍（省流量模式、2G 不抓）—— 打開過一次課程表，整套課離線都能讀。
// 規則由 tools/validate_offline_assets.js 守：APP_SHELL 不准列 ch-*.js、大綱的每一章都要有檔、prefetchAll 要在。

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
  // 課程影片（/media/ 底下的 mp4 與預覽圖）與任何 Range 請求：完全不經過這裡，交給瀏覽器與 HTTP 快取。
  // <video> 會送 Range、回 206，cache.put 收不了；而且每看一支就把 0.5–1MB 塞進 Cache Storage、換版又整包重下。
  // 影片也不在 APP_SHELL —— 離線時課文照讀，影片那一格只留說明（course_video.js）。
  // 旁白可以設成直接從 GitHub Release 串流（跨網域，media/manifest.json 的 stream）：<audio>／<video> 的請求一律不經過這裡。
  const kind = event.request.destination;
  if (event.request.headers.has("range") || kind === "audio" || kind === "video" || /\/media\//.test(new URL(event.request.url).pathname)) return;
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
