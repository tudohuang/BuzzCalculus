const CACHE_PREFIX = "buzzcalculus-";
const REV_HEADER = "x-buzz-rev";

// 快取策略（2026-10 流量瘦身；規則由 tools/validate_offline_assets.js 守，流量由 tools/measure_transfer.js 量）：
//
// 1. cache-first。舊版是 network-first ＋ cache:"reload"：每開一次站，每一支 script 都略過 HTTP 快取整支重抓 ——
//    回訪一次約 80 個請求、0.9 MB。現在已經快取的直接回，回訪只剩瀏覽器檢查 sw.js 那一個請求。
//    版本一致：頁面、script、課文都從「這一版 Service Worker 的快取」拿；新版要等使用者按「更新」（或關掉所有分頁）才換上。
// 2. 預快取只放核心（APP_SHELL：離線也能練題）。lazy 群組（課程、證明、地圖、英文側表…）、課文 ch-*.js、說明頁、少用的字型
//    都是用到才快取 —— 用過的離線也能用；沒用過的不下載。
// 3. revision：REVISIONS 是每一支檔的內容雜湊；快取裡每一個回應都蓋上自己內容的雜湊（x-buzz-rev）。新版安裝時，
//    舊快取裡雜湊一樣的檔直接搬、零請求；變了的才抓（用過的課文也會跟著更新，離線照樣讀得到）。
// 4. 第一次安裝用 force-cache：頁面剛抓過的檔直接從 HTTP 快取拿，不再打一次伺服器（舊版每個新訪客多 112 個請求）。
//    省流量模式（Save-Data）或 2G：安裝時不上網抓，只搬舊快取；之後用到什麼存什麼。
// 5. 不經過這裡的：別的網域（GA）、/media/（影片、旁白）、Range、<audio>／<video> 的請求、不在 REVISIONS 的路徑（sw.js 自己）。
//    <video> 會送 Range、回 206，cache.put 收不了；而且每看一支就把 0.5–1MB 塞進 Cache Storage。離線時影片那一格只留說明。
//
// 新版本不在作答中途生效：新的 sw 安裝完就停在 waiting，由 app（src/kernel/app_update.js）決定什麼時候換：
// 使用者按「重新載入更新」；或剛開站／從背景回來超過 10 分鐘、還沒動、沒在作答時自動換。
// （舊行為是 install 就 skipWaiting 然後強制導航 —— 模擬考考到一半被刷掉。）
//
// 6. 版本：BUILD 與 CACHE_NAME 在產生區（tools/build_sw_revisions.js）。BUILD.id 是整張 REVISIONS 的雜湊 —— 任何一支檔變了，
//    id、快取名、sw.js 的位元組都跟著變，瀏覽器才會裝新版。2026-10 之前快取名是手寫的、好幾次部署都沒改：
//    新的 sw 打開「同名」的快取，以為每一支都已經在 → 一支都沒重抓 → 按了更新拿到的還是舊檔（主畫面 app「不會更新」的主因）。
//    現在 carry 只認內容雜湊對得上的，fetch 也不回雜湊對不上的舊回應（有網路的話）。
//
// 導覽（index.html）照樣從這一版的快取回，不是 network-first：頁面與 script 一定同一版（新 HTML 配舊 app.js 會壞）。
// 「新版有沒有到」看的是 sw.js —— 瀏覽器每次導覽都檢查，app 在回到前景、每小時、按「檢查更新」時再呼叫 registration.update()。

// ── 產生區：node tools/build_sw_revisions.js（不要手改）──
// 這一版：設定頁顯示「版本 v… · id · 日期」；id 是下面 REVISIONS 的雜湊，快取名跟著它變（每次部署內容有變就一定是新快取）。
const BUILD = {"version":"v1.3.0","id":"35c9c5d3","date":"2026-10-13"};
const CACHE_NAME = "buzzcalculus-v1.3.0-35c9c5d3";
// 安裝時預快取的核心（離線也能練題）。其他檔用到才快取 —— 見 REVISIONS。
const APP_SHELL = [
  "./index.html",
  "./assets/vendor/katex/katex.min.css",
  "./styles.css",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/vendor/katex/katex.min.js",
  "./assets/vendor/icons.js",
  "./assets/vendor/anime.min.js",
  "./src/kernel/i18n.js",
  "./src/kernel/i18n_en.js",
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
  "./src/problem_world_universities.js",
  "./src/problem_competition_pack.js",
  "./src/problem_vector_calculus_pack.js",
  "./src/problem_core_expansion_pack.js",
  "./src/problem_applied_graph_pack.js",
  "./src/problem_longform_pack.js",
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
  "./src/kernel/tex_lite.js",
  "./src/kernel/tag_labels.js",
  "./src/kernel/ink_read.js",
  "./src/kernel/canned_hints.js",
  "./src/problem_authored_hints.js",
  "./src/problem_authored_solutions.js",
  "./src/problem_generated_pack.js",
  "./src/problem_foundations_pack.js",
  "./src/kernel/skill_tags.js",
  "./src/kernel/skill_graph.js",
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
  "./src/problem_difficulty_calibration.js",
  "./src/problem_time_calibration.js",
  "./src/board_store.js",
  "./src/custom_problems.js",
  "./src/proofs.js",
  "./src/proof_lab_ui.js",
  "./src/course.js",
  "./src/share_cards.js",
  "./src/kernel/records_v2.js",
  "./src/kernel/ability.js",
  "./src/kernel/planner.js",
  "./src/kernel/session.js",
  "./src/app.js",
  "./src/problem_solution_steps.js",
  "./src/kernel/app_update.js",
  "./src/kernel/metrics.js",
  "./assets/vendor/katex/fonts/KaTeX_AMS-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Main-Bold.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Main-Italic.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Main-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Math-Italic.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Size1-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Size2-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Size3-Regular.woff2",
  "./assets/vendor/katex/fonts/KaTeX_Size4-Regular.woff2"
];
// Service Worker 管的每一支檔 → 內容的 sha256 前 10 碼（空字串 = 每次安裝都重抓）。不在表上的請求交給瀏覽器。
const REVISIONS = {
  "./about.html": "0fc0633893",
  "./assets/icon.svg": "e7e0dc9db8",
  "./assets/vendor/anime.min.js": "5cbda29ea5",
  "./assets/vendor/icons.js": "6c0c67b2d4",
  "./assets/vendor/katex/fonts/KaTeX_AMS-Regular.woff2": "0cdd387c95",
  "./assets/vendor/katex/fonts/KaTeX_Caligraphic-Bold.woff2": "de7701e42c",
  "./assets/vendor/katex/fonts/KaTeX_Caligraphic-Regular.woff2": "5d53e70ad6",
  "./assets/vendor/katex/fonts/KaTeX_Fraktur-Bold.woff2": "74444efd59",
  "./assets/vendor/katex/fonts/KaTeX_Fraktur-Regular.woff2": "51814d270d",
  "./assets/vendor/katex/fonts/KaTeX_Main-Bold.woff2": "0f60d1b897",
  "./assets/vendor/katex/fonts/KaTeX_Main-BoldItalic.woff2": "99cd42a3c0",
  "./assets/vendor/katex/fonts/KaTeX_Main-Italic.woff2": "97479ca6cc",
  "./assets/vendor/katex/fonts/KaTeX_Main-Regular.woff2": "c2342cd8b8",
  "./assets/vendor/katex/fonts/KaTeX_Math-BoldItalic.woff2": "dc47344dbb",
  "./assets/vendor/katex/fonts/KaTeX_Math-Italic.woff2": "7af58c5ec8",
  "./assets/vendor/katex/fonts/KaTeX_SansSerif-Bold.woff2": "e99ae51144",
  "./assets/vendor/katex/fonts/KaTeX_SansSerif-Italic.woff2": "00b26ac825",
  "./assets/vendor/katex/fonts/KaTeX_SansSerif-Regular.woff2": "68e8c73ef4",
  "./assets/vendor/katex/fonts/KaTeX_Script-Regular.woff2": "036d4e9514",
  "./assets/vendor/katex/fonts/KaTeX_Size1-Regular.woff2": "6b47c40166",
  "./assets/vendor/katex/fonts/KaTeX_Size2-Regular.woff2": "d04c54219f",
  "./assets/vendor/katex/fonts/KaTeX_Size3-Regular.woff2": "73d591271b",
  "./assets/vendor/katex/fonts/KaTeX_Size4-Regular.woff2": "a4af7d4144",
  "./assets/vendor/katex/fonts/KaTeX_Typewriter-Regular.woff2": "71d517d678",
  "./assets/vendor/katex/katex.min.css": "06b732aebc",
  "./assets/vendor/katex/katex.min.js": "9f45307c57",
  "./guide.html": "6598935c2f",
  "./index.html": "994c8d9548",
  "./manifest.webmanifest": "4f19816c8b",
  "./privacy.html": "904180e9b9",
  "./src/app.js": "f2d1e36cfe",
  "./src/board_store.js": "402a9e9b08",
  "./src/course.js": "ef1b69719f",
  "./src/course_board.js": "efbcf4144e",
  "./src/course_board_layout.js": "a1db6f5ee5",
  "./src/course_board_plot.js": "25bed23bd6",
  "./src/course_boss.js": "4785df87a7",
  "./src/course_figures.js": "e8d2dde8c0",
  "./src/course_finish.js": "5e706b1b00",
  "./src/course_map.js": "9aba7174de",
  "./src/course_narration.js": "c84093b51f",
  "./src/course_proof.js": "d728d59494",
  "./src/course_sections.js": "0796420fe5",
  "./src/course_solve.js": "6e0f710762",
  "./src/course_v2/ch-0a.js": "ed7c6f1ae3",
  "./src/course_v2/ch-0b.js": "599d1b34b2",
  "./src/course_v2/ch-0c.js": "3209d32648",
  "./src/course_v2/ch-10a.js": "9889c99bfe",
  "./src/course_v2/ch-10b.js": "3e26e96add",
  "./src/course_v2/ch-10c.js": "74396d65d0",
  "./src/course_v2/ch-10d.js": "26565e25fd",
  "./src/course_v2/ch-11a.js": "2ffd2dfdd9",
  "./src/course_v2/ch-11b.js": "8e1727bca4",
  "./src/course_v2/ch-11c.js": "2f3dfdd6d1",
  "./src/course_v2/ch-11d.js": "86fa25791d",
  "./src/course_v2/ch-11e.js": "950a1ce857",
  "./src/course_v2/ch-11f.js": "b64a004cd3",
  "./src/course_v2/ch-11g.js": "69930e7f0b",
  "./src/course_v2/ch-11h.js": "48c0609ebc",
  "./src/course_v2/ch-11i.js": "2c807de521",
  "./src/course_v2/ch-12a.js": "4e5b942086",
  "./src/course_v2/ch-12b.js": "49115fa613",
  "./src/course_v2/ch-12c.js": "45babc014a",
  "./src/course_v2/ch-12d.js": "c0b84c0a68",
  "./src/course_v2/ch-12e.js": "faa8ee49af",
  "./src/course_v2/ch-12f.js": "578a2391f6",
  "./src/course_v2/ch-12g.js": "01a20c7015",
  "./src/course_v2/ch-12h.js": "0df714c4ae",
  "./src/course_v2/ch-12i.js": "058ee782f7",
  "./src/course_v2/ch-12j.js": "47d999198d",
  "./src/course_v2/ch-12k.js": "7feba09f17",
  "./src/course_v2/ch-1a.js": "b9970e25fd",
  "./src/course_v2/ch-1b.js": "2a26654647",
  "./src/course_v2/ch-1c.js": "4d70ebecb2",
  "./src/course_v2/ch-1d.js": "920022b04b",
  "./src/course_v2/ch-1e.js": "9a8c8f68fd",
  "./src/course_v2/ch-2a.js": "4c81ce5799",
  "./src/course_v2/ch-2b.js": "5f6b823d3c",
  "./src/course_v2/ch-2c.js": "0cecc2dae8",
  "./src/course_v2/ch-2d.js": "37f6c439ba",
  "./src/course_v2/ch-3a.js": "c77a35f9d0",
  "./src/course_v2/ch-3b.js": "a347bb71f7",
  "./src/course_v2/ch-3c.js": "db9fc7238c",
  "./src/course_v2/ch-3d.js": "edb7a83973",
  "./src/course_v2/ch-3e.js": "0e3e9c3ab0",
  "./src/course_v2/ch-4a.js": "ba63fd0b40",
  "./src/course_v2/ch-4b.js": "cd65480606",
  "./src/course_v2/ch-4c.js": "4d42675df4",
  "./src/course_v2/ch-4d.js": "57375a46d4",
  "./src/course_v2/ch-4e.js": "5fdb3b1e80",
  "./src/course_v2/ch-4f.js": "81b79a2053",
  "./src/course_v2/ch-4g.js": "c13527584a",
  "./src/course_v2/ch-5a.js": "c0a0288e46",
  "./src/course_v2/ch-5b.js": "e98c1cec97",
  "./src/course_v2/ch-5c.js": "f5d954c1e6",
  "./src/course_v2/ch-5d.js": "aa5fede171",
  "./src/course_v2/ch-6a.js": "9dc68acfde",
  "./src/course_v2/ch-6b.js": "76fabfad2e",
  "./src/course_v2/ch-6c.js": "130faedae4",
  "./src/course_v2/ch-6d.js": "985f961578",
  "./src/course_v2/ch-6e.js": "5ab5c0a2e6",
  "./src/course_v2/ch-6f.js": "79c9028107",
  "./src/course_v2/ch-7a.js": "0207609cbb",
  "./src/course_v2/ch-7b.js": "187ed131e4",
  "./src/course_v2/ch-8a.js": "7b623c2555",
  "./src/course_v2/ch-8b.js": "7a22dddec7",
  "./src/course_v2/ch-8c.js": "7c2051dc5d",
  "./src/course_v2/ch-8d.js": "876378c4b0",
  "./src/course_v2/ch-8e.js": "d137e5d076",
  "./src/course_v2/ch-9a-1.js": "f2dda073ab",
  "./src/course_v2/ch-9a-2.js": "dc20e9c212",
  "./src/course_v2/ch-9a-3.js": "3e155a3bb3",
  "./src/course_v2/ch-9b-1.js": "773acd6ee1",
  "./src/course_v2/ch-9b-2.js": "21a33552ee",
  "./src/course_v2/ch-9b-3.js": "8da3efc2a0",
  "./src/course_v2/ch-9b-4.js": "7bb2951d91",
  "./src/course_v2/ch-9b-5.js": "3417d4e979",
  "./src/course_v2/ch-9b-6.js": "27b5ec564f",
  "./src/course_v2/map.js": "d562d34fa8",
  "./src/course_v2/outline.js": "841fa41a13",
  "./src/course_v2_style.js": "2c61c5c366",
  "./src/course_v2_ui.js": "568b20368f",
  "./src/course_video.js": "18cfde7727",
  "./src/custom_problems.js": "53e402064b",
  "./src/kernel/ability.js": "474cbd6dd3",
  "./src/kernel/answer_sampling.js": "4594531923",
  "./src/kernel/app_update.js": "2b185cd937",
  "./src/kernel/board_render.js": "58c7065027",
  "./src/kernel/canned_hints.js": "9bed49134d",
  "./src/kernel/daily_one_history.js": "",
  "./src/kernel/derived_hints.js": "fda184703e",
  "./src/kernel/equivalence.js": "cce0b64d63",
  "./src/kernel/i18n.js": "f09036465d",
  "./src/kernel/i18n_en.js": "f316e81853",
  "./src/kernel/i18n_problems_en.js": "034e3da4bf",
  "./src/kernel/i18n_text_en.js": "bd649bbd6e",
  "./src/kernel/ink_read.js": "10f49b9d62",
  "./src/kernel/metrics.js": "815c8965eb",
  "./src/kernel/origin.js": "038a2b496b",
  "./src/kernel/planner.js": "7de9b92876",
  "./src/kernel/proof_lang.js": "dcfe4981bf",
  "./src/kernel/proof_surface.js": "300a62039f",
  "./src/kernel/records_v2.js": "1b0cc9d4a6",
  "./src/kernel/rubric.js": "8a008b443f",
  "./src/kernel/rubric_reviewed.js": "838e52b722",
  "./src/kernel/session.js": "19d842a952",
  "./src/kernel/skill_graph.js": "92b1a4b554",
  "./src/kernel/skill_tags.js": "0453b91ef3",
  "./src/kernel/tag_labels.js": "7ef8f36a3a",
  "./src/kernel/tex_lite.js": "72286278aa",
  "./src/kernel/uid_map.js": "95d5a65bb8",
  "./src/kernel/verified_answers.js": "68cbef20f8",
  "./src/problem_advanced_analysis.js": "55c5f6e1b9",
  "./src/problem_analysis_pack.js": "d8380dee64",
  "./src/problem_applied_graph_pack.js": "da4d93e8aa",
  "./src/problem_authored_hints.js": "be729803e3",
  "./src/problem_authored_solutions.js": "8710b5a8e0",
  "./src/problem_burst_pack.js": "68278e24d7",
  "./src/problem_chain_depth_pack.js": "026c310801",
  "./src/problem_competition_pack.js": "d70b08ffd7",
  "./src/problem_core_expansion_pack.js": "076d87e9db",
  "./src/problem_curve_worksheet_pack.js": "2443b77120",
  "./src/problem_derivative_depth_pack.js": "3f89f04638",
  "./src/problem_difficulty_calibration.js": "f5baa99953",
  "./src/problem_exam_depth_pack.js": "aaebde5331",
  "./src/problem_exam_expansion.js": "09bd194b5e",
  "./src/problem_extensions.js": "7380e569e5",
  "./src/problem_extensions_2.js": "096e5bb5a4",
  "./src/problem_foundations_pack.js": "6ebc1b78c9",
  "./src/problem_gap_pack.js": "b52c878dbc",
  "./src/problem_generated_pack.js": "d53cf6cdcc",
  "./src/problem_graph_choice_pack.js": "ee707ca74f",
  "./src/problem_graph_interactive_pack.js": "b1dabd459e",
  "./src/problem_hard_expansion.js": "19c636d53b",
  "./src/problem_hardcore_50.js": "36b616568c",
  "./src/problem_integrals_hard.js": "03611f856b",
  "./src/problem_lecture_pack.js": "8013387ebc",
  "./src/problem_limit_beyond_taylor_pack.js": "fa0c4c75c1",
  "./src/problem_longform_pack.js": "19ea28eae9",
  "./src/problem_mobile_advanced_pack.js": "f1964ad652",
  "./src/problem_ode_pack.js": "04df46ff78",
  "./src/problem_release_expansion.js": "b9af3aa9d2",
  "./src/problem_set_interval_expansion.js": "24ee34b90a",
  "./src/problem_set_interval_pack.js": "e851f8d16d",
  "./src/problem_solution_steps.js": "f6d5e7ed66",
  "./src/problem_textbook_pack.js": "e8ae8628cc",
  "./src/problem_time_calibration.js": "822a47a93f",
  "./src/problem_university_exam_pack.js": "72f757e702",
  "./src/problem_vector_calculus_pack.js": "5a37d1ee28",
  "./src/problem_world_universities.js": "47e807a7a7",
  "./src/problems.js": "5d7de826aa",
  "./src/proof_lab_ui.js": "80be80c62d",
  "./src/proof_lang_content.js": "2ba5f35870",
  "./src/proofs.js": "6e32ac2cc3",
  "./src/share_cards.js": "5d3c541164",
  "./styles.css": "cf8a8867e9",
  "./terms.html": "2432c43e77"
};
// ── 產生區結束 ──

const SCOPE_PATH = new URL(self.registration ? self.registration.scope : self.location.href).pathname;
// 請求網址 → 快取鍵（./ 加路徑；/ 與 /index.html?x 都是 ./index.html；查詢字串不算）
function keyOf(url) {
  const u = new URL(url, self.location.href);
  if (u.origin !== self.location.origin) return null;
  let rel = u.pathname.startsWith(SCOPE_PATH) ? u.pathname.slice(SCOPE_PATH.length) : u.pathname.replace(/^\//, "");
  if (!rel) rel = "index.html";
  return `./${decodeURIComponent(rel)}`;
}
// 網路上的網址：首頁用 "./"（大家連的、HTTP 快取裡有的是這個），其他照鍵
const urlOf = (key) => (key === "./index.html" ? "./" : key);
function lean() {
  const c = self.navigator && self.navigator.connection;
  return Boolean(c && (c.saveData || /2g/.test(c.effectiveType || "")));
}
// 回應 → 同樣內容、蓋上內容雜湊的回應（跟 build_sw_revisions.js 一樣：sha256 前 10 個 hex）
async function stamp(response) {
  const body = await response.arrayBuffer();
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", body));
  const rev = [...digest.slice(0, 5)].map((b) => b.toString(16).padStart(2, "0")).join("");
  const headers = new Headers(response.headers);
  headers.set(REV_HEADER, rev);
  return new Response(body, { status: response.status, statusText: response.statusText, headers });
}
async function pool(items, limit, work) {
  const queue = items.slice();
  await Promise.all(Array.from({ length: Math.min(limit, queue.length) }, async () => {
    for (let item = queue.shift(); item !== undefined; item = queue.shift()) await work(item);
  }));
}
// 舊版快取裡的每一個回應（同網域、在 REVISIONS 上的），鍵 → 回應；同一鍵有好幾份時留第一份
async function previous() {
  const out = new Map();
  for (const name of await caches.keys()) {
    if (!name.startsWith(CACHE_PREFIX) || name === CACHE_NAME) continue;
    const cache = await caches.open(name);
    for (const request of await cache.keys()) {
      const key = keyOf(request.url);
      if (!key || out.has(key) || !(key in REVISIONS)) continue;
      const response = await cache.match(request);
      if (response) out.set(key, response);
    }
  }
  return out;
}
// 這個回應的內容就是這一版要的那一份（空的 revision = 不認，一律重抓）
const fresh = (key, response) => Boolean(REVISIONS[key]) && Boolean(response) && response.headers.get(REV_HEADER) === REVISIONS[key];
// 雜湊一樣的搬進新快取（零請求）；回傳「這一版的快取裡已經是對的」有哪些。
// 這一版的快取裡本來就有、但雜湊對不上的不算（安裝重試、或舊版手寫快取名沒改的時候會碰到）—— 要重抓。
async function carry(cache, old) {
  const moved = new Set();
  for (const request of await cache.keys()) {
    const key = keyOf(request.url);
    if (key && fresh(key, await cache.match(request))) moved.add(key);
  }
  await Promise.all([...old].map(async ([key, response]) => {
    if (moved.has(key) || !fresh(key, response)) return;
    await cache.put(key, response.clone());
    moved.add(key);
  }));
  return moved;
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const old = await previous();
    const first = !(await caches.keys()).some((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME);
    const moved = await carry(cache, old);
    if (lean()) return;
    // 核心沒搬到的一定要有（抓不到 = 安裝失敗，瀏覽器之後再試）；用過但內容變了的盡量更新（抓不到就算了，用到時再抓）
    const core = APP_SHELL.filter((key) => !moved.has(key));
    const used = [...old.keys()].filter((key) => !moved.has(key) && !APP_SHELL.includes(key));
    const mode = first ? "force-cache" : "no-cache";
    await pool(core, 4, async (key) => {
      const response = await fetch(new Request(urlOf(key), { cache: mode }));
      if (!response.ok) throw new Error(`${key} → HTTP ${response.status}`);
      await cache.put(key, await stamp(response));
    });
    await pool(used, 2, async (key) => {
      try {
        const response = await fetch(new Request(urlOf(key), { cache: "no-cache" }));
        if (response.ok) await cache.put(key, await stamp(response));
      } catch (_error) { /* 用到時再抓 */ }
    });
  })());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
  // 設定頁的「版本」：正在跑的（controller）與等著的（waiting）各問自己的 BUILD
  if (event.data && event.data.type === "VERSION" && event.ports && event.ports[0]) event.ports[0].postMessage({ build: BUILD });
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // 等待期間舊版又快取了的（例如那時打開了一課）：雜湊一樣的再搬一次，再刪舊快取
    const cache = await caches.open(CACHE_NAME);
    await carry(cache, await previous());
    const stale = (await caches.keys()).filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME);
    await Promise.all(stale.map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const kind = request.destination;
  if (request.headers.has("range") || kind === "audio" || kind === "video" || /\/media\//.test(new URL(request.url).pathname)) return;
  const key = keyOf(request.url);
  if (!key || !(key in REVISIONS)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const hit = await cache.match(key);
    // 雜湊對不上這一版的（舊快取留下的）不直接回：有網路就重抓，離線才拿它頂著
    if (hit && (!REVISIONS[key] || fresh(key, hit))) return hit;
    try {
      // 沒快取過：上網抓（no-cache：HTTP 快取裡有就送條件請求，沒變是 304），存進這一版的快取
      const response = await fetch(new Request(urlOf(key), { cache: "no-cache", credentials: "same-origin" }));
      if (response.ok) event.waitUntil(stamp(response.clone()).then((stamped) => cache.put(key, stamped)).catch(() => {}));
      return response;
    } catch (error) {
      if (hit) return hit;
      const any = await caches.match(key);
      if (any) return any;
      throw error;
    }
  })());
});
