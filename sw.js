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
const BUILD = {"version":"v1.3.0","id":"9683263d","date":"2026-10-13"};
const CACHE_NAME = "buzzcalculus-v1.3.0-9683263d";
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
  "./src/problem_refine_pack.js",
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
  "./src/settings_page.js",
  "./src/kernel/problem_profiles.js",
  "./src/kernel/sampler.js",
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
  "./about.html": "e3c8d588b2",
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
  "./index.html": "f9d1a12663",
  "./manifest.webmanifest": "4f19816c8b",
  "./privacy.html": "904180e9b9",
  "./src/app.js": "f317e47735",
  "./src/board_store.js": "402a9e9b08",
  "./src/course.js": "ef1b69719f",
  "./src/course_board.js": "b534f95970",
  "./src/course_board_layout.js": "42fd759fcf",
  "./src/course_board_plot.js": "25bed23bd6",
  "./src/course_boss.js": "4785df87a7",
  "./src/course_figures.js": "e8d2dde8c0",
  "./src/course_finish.js": "5e706b1b00",
  "./src/course_map.js": "9aba7174de",
  "./src/course_narration.js": "40ec594934",
  "./src/course_proof.js": "d728d59494",
  "./src/course_sections.js": "3262feb1b0",
  "./src/course_solve.js": "6e0f710762",
  "./src/course_v2/ch-0a.js": "3816f48a66",
  "./src/course_v2/ch-0b.js": "8dc9344a4d",
  "./src/course_v2/ch-0c.js": "d754aeaac0",
  "./src/course_v2/ch-10a.js": "6e196167bf",
  "./src/course_v2/ch-10b.js": "cf631e51a1",
  "./src/course_v2/ch-10c.js": "b45643ec46",
  "./src/course_v2/ch-10d.js": "ed0c7f525c",
  "./src/course_v2/ch-11a.js": "e527eb9468",
  "./src/course_v2/ch-11b.js": "fb26d968a2",
  "./src/course_v2/ch-11c.js": "c47ee9849d",
  "./src/course_v2/ch-11d.js": "b3f2ab1fbb",
  "./src/course_v2/ch-11e.js": "c262ba8035",
  "./src/course_v2/ch-11f.js": "b2b7316588",
  "./src/course_v2/ch-11g.js": "a794fcabb3",
  "./src/course_v2/ch-11h.js": "caa7b6f262",
  "./src/course_v2/ch-11i.js": "e217c39443",
  "./src/course_v2/ch-12a.js": "7b18d01641",
  "./src/course_v2/ch-12b.js": "736deddaaf",
  "./src/course_v2/ch-12c.js": "afce244929",
  "./src/course_v2/ch-12d.js": "3fac3adac2",
  "./src/course_v2/ch-12e.js": "0ed8102850",
  "./src/course_v2/ch-12f.js": "3a856c100e",
  "./src/course_v2/ch-12g.js": "c350c04c94",
  "./src/course_v2/ch-12h.js": "2403c73342",
  "./src/course_v2/ch-12i.js": "38e679dfff",
  "./src/course_v2/ch-12j.js": "a9f7c11cb2",
  "./src/course_v2/ch-12k.js": "7f2a3e300f",
  "./src/course_v2/ch-1a.js": "88fefe8111",
  "./src/course_v2/ch-1b.js": "22c9aa9255",
  "./src/course_v2/ch-1c.js": "29c7765b35",
  "./src/course_v2/ch-1d.js": "9ff86cf1b7",
  "./src/course_v2/ch-1e.js": "398f848af1",
  "./src/course_v2/ch-2a.js": "f53c959c1a",
  "./src/course_v2/ch-2b.js": "771fe5ff86",
  "./src/course_v2/ch-2c.js": "3a8639ac00",
  "./src/course_v2/ch-2d.js": "570b90e2d5",
  "./src/course_v2/ch-3a.js": "3e95970bdf",
  "./src/course_v2/ch-3b.js": "cfd9dd347f",
  "./src/course_v2/ch-3c.js": "753d5de951",
  "./src/course_v2/ch-3d.js": "d4b2f0ef81",
  "./src/course_v2/ch-3e.js": "5763b1133a",
  "./src/course_v2/ch-4a.js": "b9e1b28326",
  "./src/course_v2/ch-4b.js": "d37ffed364",
  "./src/course_v2/ch-4c.js": "ec28512edf",
  "./src/course_v2/ch-4d.js": "80bbfc0de9",
  "./src/course_v2/ch-4e.js": "83b33672cb",
  "./src/course_v2/ch-4f.js": "d1d3aa7d42",
  "./src/course_v2/ch-4g.js": "2805f0b7f7",
  "./src/course_v2/ch-5a.js": "bdc057db9d",
  "./src/course_v2/ch-5b.js": "10a7ebfcff",
  "./src/course_v2/ch-5c.js": "d68471e579",
  "./src/course_v2/ch-5d.js": "22845e3a0c",
  "./src/course_v2/ch-6a.js": "173e148a90",
  "./src/course_v2/ch-6b.js": "823cdfe78f",
  "./src/course_v2/ch-6c.js": "41834da823",
  "./src/course_v2/ch-6d.js": "8a86737e7f",
  "./src/course_v2/ch-6e.js": "65aaceaf54",
  "./src/course_v2/ch-6f.js": "953c0036d9",
  "./src/course_v2/ch-7a.js": "f9b437e20d",
  "./src/course_v2/ch-7b.js": "109fe88926",
  "./src/course_v2/ch-8a.js": "f83638b1ed",
  "./src/course_v2/ch-8b.js": "ff84661ac7",
  "./src/course_v2/ch-8c.js": "f1bab00d40",
  "./src/course_v2/ch-8d.js": "a89168ba82",
  "./src/course_v2/ch-8e.js": "304002b4fd",
  "./src/course_v2/ch-9a-1.js": "d4e2a52509",
  "./src/course_v2/ch-9a-2.js": "1235f705bd",
  "./src/course_v2/ch-9a-3.js": "edad188c06",
  "./src/course_v2/ch-9b-1.js": "15efa498a1",
  "./src/course_v2/ch-9b-2.js": "a7bff78102",
  "./src/course_v2/ch-9b-3.js": "a6e42a03f1",
  "./src/course_v2/ch-9b-4.js": "56119e13e3",
  "./src/course_v2/ch-9b-5.js": "8c547d0166",
  "./src/course_v2/ch-9b-6.js": "67f32fdc3b",
  "./src/course_v2/map.js": "d562d34fa8",
  "./src/course_v2/outline.js": "7d8e360853",
  "./src/course_v2_style.js": "d74251f47e",
  "./src/course_v2_ui.js": "1ffb681441",
  "./src/custom_problems.js": "53e402064b",
  "./src/detail/d-00.js": "5d6a7b5d75",
  "./src/detail/d-01.js": "ed1a05af9f",
  "./src/detail/d-02.js": "21a854dd18",
  "./src/detail/d-03.js": "c289dd3d01",
  "./src/detail/d-04.js": "31440129a7",
  "./src/detail/d-05.js": "ef591e9182",
  "./src/detail/d-06.js": "a8f453e696",
  "./src/detail/d-07.js": "2639a8323b",
  "./src/detail/d-08.js": "36d9c277bc",
  "./src/detail/d-09.js": "1082114f9b",
  "./src/detail/d-10.js": "78bd69a774",
  "./src/detail/d-11.js": "9c9e7f0e88",
  "./src/detail/d-12.js": "c2f79cdb4e",
  "./src/detail/d-13.js": "78b1720d31",
  "./src/detail/d-14.js": "f3920cb20a",
  "./src/detail/d-15.js": "dfc223c420",
  "./src/detail/d-16.js": "030132d9d5",
  "./src/detail/d-17.js": "8724473ff2",
  "./src/detail/d-18.js": "6e1c015e68",
  "./src/detail/d-19.js": "47ada89a81",
  "./src/detail/d-20.js": "c53fcb876f",
  "./src/detail/d-21.js": "c03b5b5512",
  "./src/detail/d-22.js": "cb7cae27d4",
  "./src/detail/d-23.js": "0b53a6fdca",
  "./src/detail/d-24.js": "364fe67177",
  "./src/detail/d-25.js": "999d1f0166",
  "./src/detail/d-26.js": "305b17f513",
  "./src/detail/d-27.js": "8cf8b94ee4",
  "./src/detail/d-28.js": "46f0600903",
  "./src/detail/d-29.js": "af43779004",
  "./src/detail/d-30.js": "c04102d6f9",
  "./src/detail/d-31.js": "d212fef079",
  "./src/detail/d-32.js": "680cde1b8c",
  "./src/detail/d-33.js": "1948e76af3",
  "./src/detail/d-34.js": "5bf49ec1d9",
  "./src/detail/d-35.js": "812c87955b",
  "./src/detail/d-36.js": "9326e2a511",
  "./src/detail/d-37.js": "e8089ef513",
  "./src/detail/d-38.js": "6477de4f68",
  "./src/detail/d-39.js": "d3929b7db0",
  "./src/detail/d-40.js": "c3f9a9b026",
  "./src/detail/d-41.js": "fb9f3115d0",
  "./src/detail/d-42.js": "6dc0e5ed81",
  "./src/detail/d-43.js": "5c0cef4018",
  "./src/detail/d-44.js": "f7e43c3940",
  "./src/detail/d-45.js": "35dbe9366a",
  "./src/detail/d-46.js": "c19fe24613",
  "./src/detail/d-47.js": "22557bc468",
  "./src/detail/d-48.js": "ffbcb8fc50",
  "./src/detail/d-49.js": "c82c2a3171",
  "./src/detail/d-50.js": "3bae4d1d94",
  "./src/detail/d-51.js": "fc6ffc7b13",
  "./src/detail/d-52.js": "012442dcfb",
  "./src/detail/d-53.js": "8949965578",
  "./src/detail/d-54.js": "709ac11ac8",
  "./src/detail/d-55.js": "3f388a77c3",
  "./src/detail/d-56.js": "21adfe6d56",
  "./src/detail/d-57.js": "8b33596655",
  "./src/detail/d-58.js": "65fe30c008",
  "./src/detail/d-59.js": "0bd313b7cf",
  "./src/detail/d-60.js": "99d1cf47e1",
  "./src/detail/d-61.js": "bf1dc04544",
  "./src/detail/d-62.js": "249388bda6",
  "./src/detail/d-63.js": "1e7d4c00d7",
  "./src/detail/en/d-00.js": "966853f9ac",
  "./src/detail/en/d-01.js": "7e7112aaca",
  "./src/detail/en/d-02.js": "bb2ba7e41c",
  "./src/detail/en/d-03.js": "c35008d24e",
  "./src/detail/en/d-04.js": "9a1e35a29b",
  "./src/detail/en/d-05.js": "2a47d3a473",
  "./src/detail/en/d-06.js": "7ec7696454",
  "./src/detail/en/d-07.js": "a645aed190",
  "./src/detail/en/d-08.js": "27435e28bc",
  "./src/detail/en/d-09.js": "e95aec7fc5",
  "./src/detail/en/d-10.js": "51ceb40192",
  "./src/detail/en/d-11.js": "6b2bea565b",
  "./src/detail/en/d-12.js": "a5757d89b1",
  "./src/detail/en/d-13.js": "ae51dbdd8d",
  "./src/detail/en/d-14.js": "cc7e308651",
  "./src/detail/en/d-15.js": "378d53b18c",
  "./src/detail/en/d-16.js": "228a3cbe85",
  "./src/detail/en/d-17.js": "b01c3bb0e8",
  "./src/detail/en/d-18.js": "722802651b",
  "./src/detail/en/d-19.js": "d213fa1208",
  "./src/detail/en/d-20.js": "8653b9559f",
  "./src/detail/en/d-21.js": "1b0f0cf6c7",
  "./src/detail/en/d-22.js": "98f17fbcd5",
  "./src/detail/en/d-23.js": "3d71533c18",
  "./src/detail/en/d-24.js": "e1140dc250",
  "./src/detail/en/d-25.js": "10c91dd59f",
  "./src/detail/en/d-26.js": "59f0d48163",
  "./src/detail/en/d-27.js": "cc1c5b9b70",
  "./src/detail/en/d-28.js": "3997b775bf",
  "./src/detail/en/d-29.js": "9371462bb3",
  "./src/detail/en/d-30.js": "5f7a1d2c5c",
  "./src/detail/en/d-31.js": "8407c501af",
  "./src/detail/en/d-32.js": "f45b6fbb98",
  "./src/detail/en/d-33.js": "a68428c08a",
  "./src/detail/en/d-34.js": "7b7e44d079",
  "./src/detail/en/d-35.js": "7c59711870",
  "./src/detail/en/d-36.js": "74f1e69402",
  "./src/detail/en/d-37.js": "69ab3b918c",
  "./src/detail/en/d-38.js": "4459c03eb9",
  "./src/detail/en/d-39.js": "67ab89698a",
  "./src/detail/en/d-40.js": "0bef851f05",
  "./src/detail/en/d-41.js": "2cb9c6cb16",
  "./src/detail/en/d-42.js": "b7136a763e",
  "./src/detail/en/d-43.js": "00e902830d",
  "./src/detail/en/d-44.js": "e5e1cea10a",
  "./src/detail/en/d-45.js": "53e9a7acc3",
  "./src/detail/en/d-46.js": "002811b290",
  "./src/detail/en/d-47.js": "76d1fd64f3",
  "./src/detail/en/d-48.js": "152fce35f5",
  "./src/detail/en/d-49.js": "fbf5b43bc6",
  "./src/detail/en/d-50.js": "4976579fe1",
  "./src/detail/en/d-51.js": "8287e7298b",
  "./src/detail/en/d-52.js": "4c6554decb",
  "./src/detail/en/d-53.js": "093794e91b",
  "./src/detail/en/d-54.js": "fe91f512b1",
  "./src/detail/en/d-55.js": "521bdcdfc5",
  "./src/detail/en/d-56.js": "d398529a07",
  "./src/detail/en/d-57.js": "b723928fbc",
  "./src/detail/en/d-58.js": "ab6410a696",
  "./src/detail/en/d-59.js": "6324a261b3",
  "./src/detail/en/d-60.js": "a045fe95e6",
  "./src/detail/en/d-61.js": "ca596c91b0",
  "./src/detail/en/d-62.js": "37ade64447",
  "./src/detail/en/d-63.js": "eeec03e832",
  "./src/kernel/ability.js": "474cbd6dd3",
  "./src/kernel/answer_sampling.js": "4594531923",
  "./src/kernel/app_update.js": "2b185cd937",
  "./src/kernel/board_render.js": "58c7065027",
  "./src/kernel/canned_hints.js": "9bed49134d",
  "./src/kernel/daily_one_history.js": "",
  "./src/kernel/derived_hints.js": "4d9e945921",
  "./src/kernel/equivalence.js": "cce0b64d63",
  "./src/kernel/i18n.js": "c7f4aad5f7",
  "./src/kernel/i18n_en.js": "f0e4a68867",
  "./src/kernel/i18n_problems_en.js": "7053970d78",
  "./src/kernel/i18n_text_en.js": "6f7fbcfbaf",
  "./src/kernel/i18n_text_more_en.js": "a1f84e54a1",
  "./src/kernel/ink_read.js": "10f49b9d62",
  "./src/kernel/metrics.js": "815c8965eb",
  "./src/kernel/origin.js": "c5ffb4b7b3",
  "./src/kernel/planner.js": "7de9b92876",
  "./src/kernel/problem_profiles.js": "07987460c0",
  "./src/kernel/proof_lang.js": "dcfe4981bf",
  "./src/kernel/proof_surface.js": "300a62039f",
  "./src/kernel/records_v2.js": "1b0cc9d4a6",
  "./src/kernel/rubric.js": "9fccaf6f6e",
  "./src/kernel/rubric_reviewed.js": "acb0e0522c",
  "./src/kernel/sampler.js": "794635d29f",
  "./src/kernel/session.js": "19d842a952",
  "./src/kernel/skill_graph.js": "3776f07910",
  "./src/kernel/skill_tags.js": "4fa209628d",
  "./src/kernel/tag_labels.js": "7ef8f36a3a",
  "./src/kernel/tex_lite.js": "72286278aa",
  "./src/kernel/uid_map.js": "e6a0ac732b",
  "./src/kernel/verified_answers.js": "81df139b56",
  "./src/problem_advanced_analysis.js": "3710852a58",
  "./src/problem_analysis_pack.js": "503152a202",
  "./src/problem_applied_graph_pack.js": "764df3d876",
  "./src/problem_authored_hints.js": "be729803e3",
  "./src/problem_authored_solutions.js": "491f9d2080",
  "./src/problem_burst_pack.js": "6c2681d9d7",
  "./src/problem_chain_depth_pack.js": "026c310801",
  "./src/problem_competition_pack.js": "d70b08ffd7",
  "./src/problem_core_expansion_pack.js": "98b0667bed",
  "./src/problem_curve_worksheet_pack.js": "2443b77120",
  "./src/problem_derivative_depth_pack.js": "53918b1fef",
  "./src/problem_difficulty_calibration.js": "b3fa72c496",
  "./src/problem_exam_depth_pack.js": "244f8cd743",
  "./src/problem_exam_expansion.js": "900fe5e5f6",
  "./src/problem_extensions.js": "7380e569e5",
  "./src/problem_extensions_2.js": "096e5bb5a4",
  "./src/problem_foundations_pack.js": "6ebc1b78c9",
  "./src/problem_gap_pack.js": "933c1f7ff0",
  "./src/problem_generated_pack.js": "d53cf6cdcc",
  "./src/problem_graph_choice_pack.js": "ddad05e163",
  "./src/problem_graph_interactive_pack.js": "b1dabd459e",
  "./src/problem_hard_expansion.js": "f2170b0e6b",
  "./src/problem_hardcore_50.js": "36b616568c",
  "./src/problem_integrals_hard.js": "40726c6f14",
  "./src/problem_lecture_pack.js": "b324ded871",
  "./src/problem_limit_beyond_taylor_pack.js": "d00da01daf",
  "./src/problem_longform_pack.js": "fdb2ec1a4c",
  "./src/problem_mobile_advanced_pack.js": "f1964ad652",
  "./src/problem_ode_pack.js": "04df46ff78",
  "./src/problem_refine_pack.js": "dd10cfcecc",
  "./src/problem_release_expansion.js": "7db0852e61",
  "./src/problem_set_interval_expansion.js": "24ee34b90a",
  "./src/problem_set_interval_pack.js": "e851f8d16d",
  "./src/problem_solution_steps.js": "1c3ca06f26",
  "./src/problem_textbook_pack.js": "e8ae8628cc",
  "./src/problem_university_exam_pack.js": "c57e5c1ca5",
  "./src/problem_vector_calculus_pack.js": "d1eb59608a",
  "./src/problem_world_universities.js": "8adec6b7dd",
  "./src/problems.js": "5d7de826aa",
  "./src/proof_lab_ui.js": "80be80c62d",
  "./src/proof_lang_content.js": "2ba5f35870",
  "./src/proofs.js": "6e32ac2cc3",
  "./src/settings_page.js": "8dee4b9c9e",
  "./src/share_cards.js": "fd7fd15d0a",
  "./styles.css": "07ef9ca84b",
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
