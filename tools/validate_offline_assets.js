// 離線資產驗證
//
// 2026-08 之前，KaTeX / lucide / anime.js 都走 cdn.jsdelivr.net。
// 那代表：CDN 掛掉時，就算使用者裝了 PWA、就算 sw.js 把整站快取好了，
// **數學排版還是會消失** —— 滿頁的原始 LaTeX 比整站打不開更難理解發生什麼事。
//
// 現在全部在本地。這支驗證器擋的是「有人為了省事又加回一個 CDN 連結」。
//
// 用法：node tools/validate_offline_assets.js

"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const failures = [];
function fail(message) {
  failures.push(message);
}

/* ── 1. HTML 不得引用外部資源 ─────────────────────────────── */

const pages = ["index.html"];
pages.forEach((page) => {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  // 只看會擋住渲染的：<script src> 與 <link rel=stylesheet href>。
  // 一般的 <a href> 指到外站是正常的內容，不是依賴。
  const external = [
    ...[...html.matchAll(/<script[^>]+src="(https?:\/\/[^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<link[^>]+href="(https?:\/\/[^"]+)"[^>]+rel="stylesheet"/g)].map((m) => m[1])
  ];
  // GA4 是明確的例外：它是分析而不是渲染依賴，掛掉不影響任何功能。
  const blocking = external.filter((url) => !/googletagmanager\.com/.test(url));
  if (blocking.length) {
    fail(`${page} 仍然引用外部資源（CDN 掛掉時這些會消失）：${blocking.join(", ")}`);
  }
  if (/preconnect|dns-prefetch/.test(html) && /cdn\./.test(html)) {
    fail(`${page} 還留著指向 CDN 的 preconnect`);
  }
});

/* ── 2. vendor 檔案要真的存在且非空 ───────────────────────── */

const required = [
  "assets/vendor/katex/katex.min.css",
  "assets/vendor/katex/katex.min.js",
  "assets/vendor/icons.js",
  "assets/vendor/anime.min.js"
];
required.forEach((file) => {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) { fail(`缺少 vendor 檔：${file}`); return; }
  if (fs.statSync(full).size < 1024) fail(`${file} 看起來是空的或下載失敗`);
});

/* ── 3. KaTeX 的字型要齊 ──────────────────────────────────── */

const cssPath = path.join(root, "assets/vendor/katex/katex.min.css");
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, "utf8");
  const referenced = [...new Set([...css.matchAll(/url\(fonts\/([^)]+)\)/g)].map((m) => m[1]))];
  if (!referenced.length) fail("katex.min.css 沒有引用任何字型檔");
  referenced.forEach((file) => {
    if (!fs.existsSync(path.join(root, "assets/vendor/katex/fonts", file))) {
      fail(`katex.min.css 引用了不存在的字型：${file}`);
    }
  });
  // 只留 woff2 是刻意的（少三分之二體積），確認沒有把 woff/ttf 又帶回來
  const legacy = referenced.filter((f) => !f.endsWith(".woff2"));
  if (legacy.length) fail(`字型只該保留 woff2，多出：${legacy.join(", ")}`);
}

/* ── 4. icon shim 必須涵蓋 app.js 用到的每一個圖示 ─────────
   漏一個的話那顆按鈕就變成空白 —— 而且不會有任何錯誤訊息。 */

const app = fs.readFileSync(path.join(root, "src", "app.js"), "utf8");
const aliasBlock = (app.match(/function icon\(name\) \{[\s\S]*?const names = \{([\s\S]*?)\};/) || [])[1] || "";
const alias = {};
[...aliasBlock.matchAll(/([\w-]+):\s*"([\w-]+)"/g)].forEach((m) => { alias[m[1]] = m[2]; });

// 圖示名稱不只以字面出現在 icon("x")。實測時就是漏了 icon(themeIcon)，
// 結果主題切換鈕在畫面上是一塊空白 —— 而且**沒有任何錯誤訊息**。
// 所以這裡要把所有會流進 icon() 的來源都掃過。
const used = new Set();
const add = (name) => { if (name) used.add(alias[name] || name); };

[...app.matchAll(/icon\("([a-z0-9-]+)"\)/g)].forEach((m) => add(m[1]));         // icon("play")
[...app.matchAll(/data-lucide="([a-z0-9-]+)"/g)].forEach((m) => used.add(m[1]));
[...app.matchAll(/icon:\s*"([a-z0-9-]+)"/g)].forEach((m) => add(m[1]));          // PATH_NODES 等資料表
[...app.matchAll(/icon\([^)]*\?\s*"([a-z0-9-]+)"\s*:\s*"([a-z0-9-]+)"\)/g)].forEach((m) => { // icon(a ? "x" : "y")
  add(m[1]);
  add(m[2]);
});
// icon(變數) 這種只能靠別名表的值兜底：別名表右側每個名稱都要收錄，
// 因為 themeIcon / node.icon 之類的變數最終都會落在那組名稱上。
Object.values(alias).forEach((name) => used.add(name));
["sun", "moon"].forEach(add);   // 主題切換用的兩個名稱不在任何資料表裡

let shipped = new Set();
const iconsPath = path.join(root, "assets/vendor/icons.js");
if (fs.existsSync(iconsPath)) {
  const source = fs.readFileSync(iconsPath, "utf8");
  // 行尾要吃得下 CRLF。git 在 Windows checkout 時會把 LF 換成 CRLF，
  // 於是這條原本寫死 \n 的正規式在本機永遠對不到 —— 而 CI 在 Linux 上是 LF，
  // 所以它會表現成「本機紅、CI 綠」，是最難查的那一種。
  const json = (source.match(/const ICONS = (\{[\s\S]*?\});\r?\n/) || [])[1];
  if (!json) fail("icons.js 裡找不到 ICONS 表");
  else {
    try { shipped = new Set(Object.keys(JSON.parse(json))); }
    catch (error) { fail(`icons.js 的 ICONS 表解析失敗：${error.message}`); }
  }
}

const missingIcons = [...used].filter((name) => !shipped.has(name)).sort();
if (missingIcons.length) {
  fail(`app.js 用到但 icons.js 沒收錄的圖示（那些按鈕會變空白）：${missingIcons.join(", ")}`);
}
const unusedIcons = [...shipped].filter((name) => !used.has(name)).sort();

/* ── 5. Service Worker：預快取只放核心、其他用到才快取 ─────────────
   2026-10 流量瘦身（tools/measure_transfer.js 量）。對外的離線承諾（guide.html）跟著改成：
   「題庫練習裝完就離線可用；課程、證明、說明頁 —— 打開過的離線也能看」。這一節守的是那句話真的成立：
   - APP_SHELL（安裝時預快取）＝ 離線練題的核心：index.html、CSS、index.html 裡每一支 defer 的 script、vendor、常用字型。
     少一支，離線開站就缺東西。
   - APP_SHELL 不准有 lazy 群組、課文、說明頁：那些用到才快取（每個新訪客少下載、少幾十個請求）。
   - 用到才快取的前提：REVISIONS 要列到它（不在表上的路徑 sw.js 不管、不會存）。lazy 的每一支、每一章課文、說明頁、每一個字型都要在。
   - APP_SHELL／REVISIONS 是 tools/build_sw_revisions.js 產生的，要跟磁碟上的檔同步（內容雜湊對得上，搬舊快取才不會搬錯）。
   - fetch handler 是 cache-first、用過的存起來；安裝時看 Save-Data／2G；第一次安裝用 force-cache（不重抓頁面剛抓過的）。 */

const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const shellBlock = (sw.match(/const APP_SHELL = \[([\s\S]*?)\];/) || [])[1] || "";
const cached = new Set([...shellBlock.matchAll(/"\.\/([^"]+)"/g)].map((m) => m[1]));
const revBlock = (sw.match(/const REVISIONS = \{([\s\S]*?)\};/) || [])[1] || "";
const revisioned = new Set([...revBlock.matchAll(/"\.\/([^"]+)":/g)].map((m) => m[1]));
if (!cached.size) fail("sw.js 找不到 APP_SHELL");
if (!revisioned.size) fail("sw.js 找不到 REVISIONS");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const deferScripts = [...indexHtml.matchAll(/<script\s+defer\s+src="([^"]+)"/g)].map((m) => m[1]);
const stylesheets = [...indexHtml.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]).filter((u) => !/^https?:/.test(u));
const lazySrcs = [...indexHtml.matchAll(/<script type="text\/lazy" data-lazy="([^"]+)" src="([^"]+)"/g)].map((m) => ({ group: m[1], src: m[2] }));
["index.html", "manifest.webmanifest", "assets/icon.svg", ...required, ...stylesheets, ...deferScripts].forEach((file) => {
  if (!cached.has(file)) fail(`sw.js 沒有預快取 ${file} —— 離線開站會缺它（題庫練習的離線承諾不成立）`);
});
// 例外：每次開站閒下來都會載的群組（steps 逐步解答、pwa 更新與版本）—— build_sw_revisions 的 CORE_LAZY
const CORE_LAZY = require("./build_sw_revisions.js").CORE_LAZY;
lazySrcs.filter((l) => !CORE_LAZY.includes(l.group)).forEach(({ group, src }) => {
  if (cached.has(src)) fail(`APP_SHELL 預快取了 lazy 群組（${group}）的 ${src} —— 用到才快取，不進安裝時的預快取`);
});
[...cached].filter((file) => /^src\/course_v2\/(ch|stage)-|\.html$/.test(file) && file !== "index.html").forEach((file) => fail(`APP_SHELL 預快取了 ${file} —— 課文與說明頁用到才快取`));
const runtimeNeeded = [...lazySrcs.map((l) => l.src), "about.html", "guide.html", "privacy.html", "terms.html"];
if (fs.existsSync(path.join(root, "assets/vendor/katex/fonts"))) {
  fs.readdirSync(path.join(root, "assets/vendor/katex/fonts")).forEach((file) => runtimeNeeded.push(`assets/vendor/katex/fonts/${file}`));
}
runtimeNeeded.forEach((file) => {
  if (!revisioned.has(file)) fail(`sw.js 的 REVISIONS 沒有 ${file} —— 用過之後離線還是讀不到（sw.js 不管不在表上的路徑）`);
});
try {
  if (!require("./build_sw_revisions.js").check()) fail("sw.js 的 APP_SHELL／REVISIONS 跟磁碟上的檔不同步：跑 node tools/build_sw_revisions.js");
} catch (error) {
  fail(`sw.js 的產生區：${error.message}`);
}
const fetchHandler = sw.slice(sw.indexOf('addEventListener("fetch"'));
const installHandler = sw.slice(sw.indexOf('addEventListener("install"'), sw.indexOf('addEventListener("message"'));
if (/cache:\s*"reload"/.test(fetchHandler)) fail("sw.js 的 fetch handler 用了 cache:\"reload\" —— 每次開站整站重抓（舊版的流量大戶）");
if (!/cache\.match\(/.test(fetchHandler) || !/cache\.put\(|stamp\(/.test(fetchHandler)) fail("sw.js 的 fetch handler 不是 cache-first、或用過的不存 —— 「打開過的離線也能看」不成立");
if (!/lean\(\)/.test(installHandler) || !/saveData/.test(sw)) fail("sw.js 安裝時沒有看省流量模式（Save-Data／2G）");
if (!/force-cache/.test(installHandler)) fail("sw.js 第一次安裝沒有用 force-cache —— 頁面剛抓過的檔會再打一次伺服器");

/* ── 6. 新版課程離線 ─────────────────────────────────────────
   課文 src/course_v2/ch-<章>.js（74 支、約 3.6MB）不進 APP_SHELL，也不再整套預抓（舊版 prefetchAll：打開課程表就全抓）。
   打開一課抓那一章（sw.js 存起來）；閒置時抓下一課那一章（不同章才抓、省流量不抓）；分節的結算畫面先抓進快取。
   要擋的：大綱有某一章（有寫好的課）但檔不存在；有人把 prefetchAll 加回來；下一課預抓不見了。 */
const outlinePath = path.join(root, "src/course_v2/outline.js");
if (fs.existsSync(outlinePath)) {
  const sandbox = { window: {} };
  require("vm").runInNewContext(fs.readFileSync(outlinePath, "utf8"), sandbox);
  const stages = ((sandbox.window.BUZZ_COURSE_V2 || {}).stages) || [];
  if (!stages.length) fail("src/course_v2/outline.js 讀不到任何 Stage");
  // 檔名規則跟 tools/build_course_v2.js、src/course_v2_ui.js 的 chapterFile 一樣
  const chapterFile = (code) => `src/course_v2/ch-${String(code).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.js`;
  let chapters = 0;
  stages.forEach((stage) => stage.chapters.forEach((chapter) => {
    if (!chapter.lessons.some((l) => typeof l.read === "number")) return;
    chapters += 1;
    const file = chapterFile(chapter.code);
    if (!fs.existsSync(path.join(root, file))) fail(`大綱有 ${chapter.code} 章（有寫好的課），但 ${file} 不存在`);
    else if (!revisioned.has(file)) fail(`sw.js 的 REVISIONS 沒有 ${file} —— 讀過的那一章離線讀不到`);
  }));
  if (!chapters) fail("大綱裡沒有任何一章有寫好的課");
  const ui = fs.existsSync(path.join(root, "src/course_v2_ui.js")) ? fs.readFileSync(path.join(root, "src/course_v2_ui.js"), "utf8") : "";
  if (/function prefetchAll/.test(ui)) fail("course_v2_ui.js 又有 prefetchAll —— 打開課程表就抓全部 74 章（約 1MB brotli／人），流量的大洞");
  if (!/function prefetchNext/.test(ui) || !/neighbour\(m, 1\)/.test(ui) || !/saveData/.test(ui)) fail("course_v2_ui.js 沒有「閒置時抓下一課那一章（省流量不抓）」");
  if (!/lazySrcs\("secfinish"\)/.test(ui)) fail("course_v2_ui.js 沒有先把分節的結算畫面抓進快取 —— 讀過一半的課離線讀到最後一節會載不到結算");
} else {
  fail("缺少 src/course_v2/outline.js（跑 node tools/build_course_v2.js）");
}

/* ── 6b. 對外的離線說法跟實際一致 ────────────────────────────── */
const guide = fs.readFileSync(path.join(root, "guide.html"), "utf8");
if (/整站離線可用|whole site works offline/.test(guide)) fail("guide.html 還寫「整站離線可用」—— 課程、證明、說明頁是打開過才離線可用");
if (!/打開過的.{0,20}離線/.test(guide) || !/opened.{0,40}offline/i.test(guide)) fail("guide.html 沒有說「打開過的課程／頁面離線也能看」（中英都要）");

/* ── 7. 課程影片不進 Service Worker ─────────────────────────────
   影片（/media/*.mp4、預覽圖）是部署時抓進來的大檔：不預快取（APP_SHELL 不准有 media/），
   fetch handler 也要整個略過 /media/ 與 Range 請求 —— <video> 的 206 回應 cache.put 收不了，
   而且每看一支就把 0.5–1MB 塞進 Cache Storage。離線時課文照讀，影片那一格只留一行說明。 */
[...cached].filter((file) => /^media\//.test(file)).forEach((file) => fail(`sw.js 預快取了影片檔 ${file} —— 影片不該進 APP_SHELL`));
if (!/headers\.has\("range"\)/.test(fetchHandler) || !/\\\/media\\\//.test(fetchHandler)) {
  fail("sw.js 的 fetch handler 沒有略過 /media/ 與 Range 請求 —— 影片會被塞進 Cache Storage");
}
// 旁白可以設成從 GitHub Release 跨網域串流（路徑裡沒有 /media/）：<audio>／<video> 的請求要靠 destination 略過
if (!/destination/.test(fetchHandler) || !/"audio"/.test(fetchHandler)) {
  fail("sw.js 的 fetch handler 沒有略過 <audio> 的請求（request.destination）—— 跨網域串流的旁白會被塞進 Cache Storage");
}

/* ── 報告 ─────────────────────────────────────────────────── */

function dirSize(dir) {
  let total = 0;
  const walk = (current) => {
    fs.readdirSync(current).forEach((name) => {
      const full = path.join(current, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else total += stat.size;
    });
  };
  if (fs.existsSync(dir)) walk(dir);
  return total;
}

const bytes = dirSize(path.join(root, "assets/vendor"));
console.log("Offline assets");
console.log(`  vendor 體積   ${Math.round(bytes / 1024)}KB`);
console.log(`  圖示          ${shipped.size} 個收錄 / ${used.size} 個使用中${unusedIcons.length ? `（${unusedIcons.length} 個可以再砍）` : ""}`);
console.log(`  外部依賴      只剩 GA4（分析，不影響渲染）`);

if (failures.length) {
  console.error("");
  console.error(`離線資產驗證失敗（${failures.length}）：`);
  failures.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

console.log("");
console.log("offline assets OK");
