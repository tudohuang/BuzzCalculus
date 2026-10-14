// 量流量：一個使用者走過幾個情境，打到伺服器（Vercel）幾個請求、傳了多少位元組（原始與 brotli）。
//
// 不開瀏覽器 —— 從程式碼推：index.html 的 <script>/<link>、sw.js 的 APP_SHELL 與快取策略、index.html 的 lazy 群組、
// course_v2_ui.js 的課文載入規則、narration.json 的旁白大小。改了其中任何一個，再跑一次就知道代價。
//
// 情境：
//   首次造訪首頁   頁面自己抓的（HTML、CSS、defer 的 script、manifest、圖示、首屏會用到的 KaTeX 字型）＋ sw.js ＋ Service Worker 安裝時的預快取
//   再次造訪首頁   已經裝了 Service Worker 之後再開一次
//   打開課程表     data-lazy="course" ＋（舊版）閒置時把每一章的課文都抓一遍
//   打開一課（分節）那一章的課文 ＋ sections、secfinish、secproof（有證明節才算）＋（新版）閒置時下一課那一章
//   播旁白         這一課的 mp3（一課一支、Range 串流；整課聽完 = 整支）
//   部署之後回訪   新版 Service Worker 安裝：舊版每一支預快取都重新驗證一次；新版只抓 revision 變了的檔
//
// 假設（印在報告裡）：首屏會畫數學，用到 KaTeX_Main-Regular 與 KaTeX_Math-Italic；Vercel 送 brotli（這裡用 quality 11 估）；
// 304 回應算一個請求、0 位元組本文；GA 打的是 Google，不算 Vercel。
//
// 用法：node tools/measure_transfer.js            印表
//       node tools/measure_transfer.js --json     印 JSON（給比較用）
"use strict";

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const norm = (p) => p.replace(/^\.\//, "").replace(/^\//, "") || "index.html";

const FIRST_SCREEN_FONTS = ["assets/vendor/katex/fonts/KaTeX_Main-Regular.woff2", "assets/vendor/katex/fonts/KaTeX_Math-Italic.woff2"];
const SAMPLE_LESSON = "limit-intro";

const sizeCache = new Map();
function size(rel) {
  rel = norm(rel);
  if (sizeCache.has(rel)) return sizeCache.get(rel);
  if (!exists(rel)) { sizeCache.set(rel, { raw: 0, br: 0, missing: true }); return sizeCache.get(rel); }
  const buf = fs.readFileSync(path.join(ROOT, rel));
  const binary = /\.(woff2|png|jpg|mp3|mp4)$/i.test(rel);
  const br = binary ? buf.length : zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
  const out = { raw: buf.length, br };
  sizeCache.set(rel, out);
  return out;
}
function tally(files, { revalidated = [] } = {}) {
  const list = [...new Set(files.map(norm))];
  const re = [...new Set(revalidated.map(norm))].filter((f) => !list.includes(f));
  const raw = list.reduce((s, f) => s + size(f).raw, 0);
  const br = list.reduce((s, f) => s + size(f).br, 0);
  return { requests: list.length + re.length, full: list.length, revalidated: re.length, raw, br };
}

/* ── 讀程式碼 ── */
const html = read("index.html");
const sw = read("sw.js");
const ui = read("src/course_v2_ui.js");
const stylesheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]).filter((h) => !/^https?:/.test(h));
const deferScripts = [...html.matchAll(/<script\s+defer\s+src="([^"]+)"/g)].map((m) => m[1]);
const lazy = {};
[...html.matchAll(/<script type="text\/lazy" data-lazy="([^"]+)" src="([^"]+)"/g)].forEach((m) => { (lazy[m[1]] = lazy[m[1]] || []).push(m[2]); });
const appShell = ((sw.match(/const APP_SHELL = \[([\s\S]*?)\];/) || [])[1] || "").match(/"[^"]+"/g).map((s) => JSON.parse(s));
const hasRevisions = /const REVISIONS = \{/.test(sw);
const legacyReload = /cache:\s*"reload"/.test(sw.slice(sw.indexOf('addEventListener("fetch"')));
const forceCacheFirstInstall = /force-cache/.test(sw);
const prefetchAllChapters = /function prefetchAll/.test(ui);
const prefetchNextChapter = /function prefetchNext/.test(ui);

const sandbox = { window: {} };
vm.runInNewContext(read("src/course_v2/outline.js"), sandbox);
const outline = sandbox.window.BUZZ_COURSE_V2;
const chapterFile = (code) => `src/course_v2/ch-${String(code).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.js`;
const order = [];
outline.stages.forEach((stage) => stage.chapters.forEach((chapter) => chapter.lessons.forEach((l) => order.push({ ...l, chapter, available: typeof l.read === "number" }))));
const chapters = [...new Set(order.filter((m) => m.available).map((m) => chapterFile(m.chapter.code)))];
const sample = order.find((m) => m.id === SAMPLE_LESSON) || order.find((m) => m.available);
const sampleChapter = chapterFile(sample.chapter.code);
const lessonSandbox = { window: {} };
vm.runInNewContext(read(sampleChapter), lessonSandbox);
const sampleData = lessonSandbox.window.BUZZ_COURSE_V2_LESSONS[sample.id];
const nextAvail = order.slice(order.indexOf(sample) + 1).find((m) => m.available);

/* ── 情境 ── */
const pageFirst = ["index.html", ...stylesheets, ...deferScripts, "manifest.webmanifest", "assets/icon.svg", ...FIRST_SCREEN_FONTS];
const pageSet = new Set(pageFirst.map(norm));
const shellSet = [...new Set(appShell.map(norm))];
const scenarios = {};

// 首次造訪：頁面 ＋ sw.js ＋ 預快取。
//   舊版：cache.addAll（預設快取模式；Vercel 預設 max-age=0, must-revalidate）→ 頁面抓過的每一支再驗證一次（304），沒抓過的整支下載。
//   新版：第一次安裝用 force-cache（頁面剛抓過的直接從 HTTP 快取拿，零請求），沒抓過的才下載。
{
  const precacheFull = shellSet.filter((f) => !pageSet.has(f));
  const precacheRevalidated = forceCacheFirstInstall ? [] : shellSet.filter((f) => pageSet.has(f));
  const page = tally(pageFirst.concat(["sw.js"]));
  const pre = tally(precacheFull, { revalidated: precacheRevalidated });
  scenarios["首次造訪首頁"] = { requests: page.requests + pre.requests, raw: page.raw + pre.raw, br: page.br + pre.br, note: `頁面 ${page.requests}（含 sw.js）＋預快取 ${pre.requests}（整支 ${pre.full}、304 ${pre.revalidated}）；APP_SHELL ${appShell.length} 項` };
}
// 再次造訪：舊版 fetch handler 對同網域一律 cache:"reload"（略過 HTTP 快取、整支重抓）；新版 cache-first，只剩瀏覽器檢查 sw.js 那一個請求。
{
  const t = legacyReload ? tally(pageFirst.concat(["sw.js"])) : tally(["sw.js"]);
  scenarios["再次造訪首頁"] = { ...t, note: legacyReload ? "Service Worker 對每一支都 cache:reload（整支重抓）" : "全部從 Cache Storage；只有 sw.js 的更新檢查" };
}
// 打開課程表
{
  const files = (lazy.course || []).slice();
  if (prefetchAllChapters) files.push(...chapters);
  const t = tally(files);
  scenarios["打開課程表"] = { ...t, note: prefetchAllChapters ? `course 群組 ${lazy.course.length} 支 ＋ 閒置時抓全部 ${chapters.length} 章` : `course 群組 ${lazy.course.length} 支（課文不抓）` };
}
// 打開一課（分節模式）
{
  const proof = (sampleData.sections || []).some((s) => s.proof || s.order || s.where || (s.beats || []).some((b) => b.why));
  const figures = Boolean(sampleData.figures && sampleData.figures.length);
  const files = [sampleChapter, ...(lazy.sections || []), ...(lazy.secfinish || []), ...(proof ? lazy.secproof || [] : []), ...(figures ? lazy.figures || [] : [])];
  if (prefetchNextChapter && nextAvail && chapterFile(nextAvail.chapter.code) !== sampleChapter) files.push(chapterFile(nextAvail.chapter.code));
  const t = tally(files);
  const avgChapter = chapters.reduce((s, f) => s + size(f).br, 0) / chapters.length;
  scenarios["打開一課（分節）"] = { ...t, note: `${sample.id}：${sampleChapter}${figures ? "＋figures" : ""}${proof ? "＋secproof" : ""}；一章平均 ${(avgChapter / 1024).toFixed(1)} KB br${prefetchNextChapter ? "；下一課在別章時多抓那一章" : ""}` };
}
// 旁白
{
  const index = require("./build_narration.js").readIndex();
  // lessons.<課>.<聲音>：一個人只聽自己選的那一個聲音（女聲預設），量女聲
  const all = Object.values(index.lessons || {}).map((row) => row.f).filter((e) => e && e.bytes);
  const total = all.reduce((s, e) => s + e.bytes, 0);
  const ms = all.reduce((s, e) => s + e.ms, 0);
  const one = ((index.lessons || {})[sample.id] || {}).f;
  scenarios["播旁白（整課聽完）"] = { requests: 1, raw: one ? one.bytes : 0, br: one ? one.bytes : 0, note: `${index.format}；${all.length} 支合計 ${(total / 1048576).toFixed(1)} MB、${(ms / 60000).toFixed(0)} 分鐘、平均 ${(total / all.length / 1048576).toFixed(2)} MB／課（Range 串流，請求數 ≥ 1）` };
}
// 部署之後回訪（新版 Service Worker 安裝）
{
  if (hasRevisions) {
    scenarios["部署之後回訪"] = { requests: 1, raw: size("sw.js").raw, br: size("sw.js").br, note: "只抓 revision 變了的檔（一次只改 app.js 的部署：sw.js ＋ app.js 兩個請求）；沒變的從舊快取搬" };
  } else {
    scenarios["部署之後回訪"] = { requests: 1 + appShell.length, raw: size("sw.js").raw, br: size("sw.js").br, note: `APP_SHELL ${appShell.length} 項全部重新驗證（沒變的 304、變了的整支）` };
  }
}

const padW = (text, w) => text + " ".repeat(Math.max(0, w - [...text].reduce((n, ch) => n + (ch.charCodeAt(0) > 0x2e7f ? 2 : 1), 0)));
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ appShell: appShell.length, scenarios }, null, 2));
} else {
  console.log(`流量估算（${hasRevisions ? "revision 快取" : "舊版快取"}；APP_SHELL ${appShell.length} 項；章 ${chapters.length} 支）`);
  console.log(padW("情境", 20) + "  請求    原始        brotli      說明");
  Object.entries(scenarios).forEach(([name, s]) => {
    console.log(`${padW(name, 20)}  ${String(s.requests).padStart(4)}  ${kb(s.raw).padStart(10)}  ${kb(s.br).padStart(10)}  ${s.note}`);
  });
  console.log("\n假設：首屏字型 " + FIRST_SCREEN_FONTS.map((f) => path.basename(f)).join("、") + "；brotli quality 11；304 = 1 請求 0 位元組；GA 不算。");
}
