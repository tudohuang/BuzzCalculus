// vercel.json 的快取標頭（流量瘦身，2026-10）
//
// Vercel 靜態檔的預設是 max-age=0, must-revalidate：每次都要回伺服器問一次（304 也算一個 CDN 請求，Hobby 一個月 100 萬個）。
// 這支擋的是兩種錯：
//   1. 該長快取的沒長：內容雜湊命名的旁白（/media/narration/<課>-<f8>.mp3）、帶版本的影片與預覽圖（?v=<videoRev>）→ 一年、immutable。
//   2. 不該長快取的長了：index.html、/、sw.js 一定要每次問（不然新版永遠到不了）；沒有版本號的 JS/CSS 與不帶 ?v= 的影片不准 immutable、
//      也不准超過一天 —— 同名換檔時使用者會拿到舊的。
// 也確認長快取的前提還在：build_narration.js 的檔名帶內容雜湊、course_video.js 的網址接了 ?v=、build_course_v2.js 有算 videoRev。
//
// 用法：node tools/validate_cache_headers.js
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const failures = [];
const fail = (m) => failures.push(m);

const config = JSON.parse(read("vercel.json"));
// stamp_build：部署時蓋建置日期、重產 sw.js（BUILD／快取名），見 tools/validate_version.js
if (config.buildCommand !== "node tools/stamp_build.js && node tools/fetch_media.js") fail(`vercel.json 的 buildCommand 變了（${config.buildCommand}）`);
const rules = config.headers || [];
if (!rules.length) fail("vercel.json 沒有 headers");

// Vercel 的 source（path-to-regexp 的子集）→ 正規式：:name(regex)、:name*、:name、(regex)、其他字面
function toRegex(source) {
  let out = "";
  for (let i = 0; i < source.length;) {
    const named = /^:([A-Za-z_]\w*)/.exec(source.slice(i));
    if (named) {
      i += named[0].length;
      if (source[i] === "(") {
        let depth = 0;
        let j = i;
        for (; j < source.length; j += 1) { if (source[j] === "(") depth += 1; if (source[j] === ")" && --depth === 0) break; }
        out += source.slice(i, j + 1);
        i = j + 1;
      } else if (source[i] === "*") { out += "(.*)"; i += 1; } else out += "([^/]+)";
      continue;
    }
    if (source[i] === "(") {
      let depth = 0;
      let j = i;
      for (; j < source.length; j += 1) { if (source[j] === "(") depth += 1; if (source[j] === ")" && --depth === 0) break; }
      out += source.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    out += source[i].replace(/[.*+?^${}|[\]\\]/g, "\\$&");
    i += 1;
  }
  return new RegExp(`^${out}$`);
}
function cacheControl(url) {
  const u = new URL(url, "https://example.test");
  const hits = rules.filter((rule) => {
    if (!toRegex(rule.source).test(u.pathname)) return false;
    const q = (cond) => cond.type === "query" && u.searchParams.has(cond.key);
    if ((rule.has || []).some((c) => !q(c))) return false;
    if ((rule.missing || []).some((c) => q(c))) return false;
    return true;
  }).map((rule) => (rule.headers.find((h) => h.key.toLowerCase() === "cache-control") || {}).value).filter(Boolean);
  if (hits.length > 1) fail(`${url}：同時對到 ${hits.length} 條 Cache-Control（${hits.join(" | ")}）—— 哪一條生效不保證`);
  return hits[0] || "";
}
const maxAge = (cc) => { const m = /max-age=(\d+)/.exec(cc); return m ? Number(m[1]) : 0; };

const narration = require("./build_narration.js").readIndex(); // lessons.<課>.<聲音>（舊的單一聲音格式也讀成這個形狀）
// lessons.<課>.<聲音 f／m>（build_narration.js）：兩個聲音各取一支當樣本
const narrSample = (v) => { const hit = Object.entries(narration.lessons || {}).find(([, row]) => row && row[v]); return hit ? [hit[0], hit[1][v]] : null; };
const sampleNarr = narrSample("f");
const sampleNarrM = narrSample("m");
const manifest = JSON.parse(read("media/manifest.json"));
const sampleVideo = (manifest.videos || [])[0] || "taylor";
const CASES = [
  // [網址, 期望, 說明]
  [sampleNarr ? `/media/narration/${sampleNarr[0]}-${sampleNarr[1].f}.mp3` : "/media/narration/x-0123abcd.mp3", "immutable", "內容雜湊命名的旁白"],
  [sampleNarrM ? `/media/narration/m/${sampleNarrM[0]}-${sampleNarrM[1].f}.mp3` : "/media/narration/m/x-0123abcd.mp3", "immutable", "內容雜湊命名的旁白（男聲）"],
  [`/media/${sampleVideo}-light-720p.mp4?v=0123abcd`, "immutable", "帶版本的影片"],
  [`/media/${sampleVideo}-dark-poster.jpg?v=0123abcd`, "immutable", "帶版本的預覽圖"],
  [`/media/${sampleVideo}-light-720p.mp4`, "short", "不帶版本的影片（舊版播放器）"],
  ["/media/manifest.json", "short", "media/manifest.json"],
  ["/sw.js", "revalidate", "Service Worker"],
  ["/", "revalidate", "首頁"],
  ["/index.html", "revalidate", "首頁"],
  ["/src/app.js", "default", "沒有版本號的 JS"],
  ["/src/course_v2/ch-1a.js", "default", "課文"],
  ["/styles.css", "default", "沒有版本號的 CSS"],
  ["/assets/vendor/katex/fonts/KaTeX_Main-Regular.woff2", "default", "字型"]
];
const table = [];
CASES.forEach(([url, want, label]) => {
  const cc = cacheControl(url);
  table.push(`  ${label.padEnd(18)} ${url.slice(0, 52).padEnd(54)} ${cc || "（Vercel 預設 max-age=0, must-revalidate）"}`);
  const immutable = /immutable/.test(cc);
  if (want === "immutable" && !(immutable && maxAge(cc) >= 31536000)) fail(`${label} ${url} 應該是 public, max-age=31536000, immutable（現在：${cc || "預設"}）`);
  if (want === "short" && (immutable || maxAge(cc) > 86400 || /stale-while-revalidate/.test(cc))) fail(`${label} ${url} 沒有版本號，不能長快取（現在：${cc}）—— 同名換檔會拿到舊的`);
  if (want === "revalidate" && cc && !(maxAge(cc) === 0 && /must-revalidate|no-cache/.test(cc))) fail(`${label} ${url} 一定要每次問伺服器（現在：${cc}）—— 不然新版到不了`);
  if (want === "default" && cc && (immutable || maxAge(cc) > 0)) fail(`${label} ${url} 沒有版本號，不能快取（現在：${cc}）`);
});

// 長快取的前提
const builder = read("tools/build_narration.js");
if (!/`\$\{id\}-\$\{f\}\.mp3`/.test(builder) || !/const f = sum\.slice\(0, 8\)/.test(builder)) fail("build_narration.js 的旁白檔名不再是 <課>-<內容雜湊 8 碼>.mp3 —— /media/narration/ 不能再回 immutable");
Object.entries(narration.lessons || {}).forEach(([id, row]) => Object.entries(row || {}).forEach(([v, e]) => {
  if (!/^[0-9a-f]{8}$/.test(e.f) || e.sha256.slice(0, 8) !== e.f) fail(`narration.json 的 ${id}：f（${e.f}）不是內容雜湊的前 8 碼（${v}）`);
}));
const video = read("src/course_video.js");
if (!/videoRev/.test(video) || !/\?v=\$\{r\}/.test(video)) fail("course_video.js 的影片／預覽圖網址沒有接 ?v=<videoRev> —— 帶版本的 immutable 規則用不到，同名換檔也不會換網址");
const outlineSandbox = { window: {} };
require("vm").runInNewContext(read("src/course_v2/outline.js"), outlineSandbox);
const videoRev = (outlineSandbox.window.BUZZ_COURSE_V2 || {}).videoRev || {};
(manifest.videos || []).forEach((id) => { if (!/^[0-9a-f]{8}$/.test(videoRev[id] || "")) fail(`大綱的 videoRev 沒有 ${id}（跑 node tools/build_course_v2.js）`); });

console.log("Cache-Control（vercel.json）");
table.forEach((line) => console.log(line));
if (failures.length) {
  console.error(`\n快取標頭驗證失敗（${failures.length}）：`);
  failures.forEach((m) => console.error(`  ${m}`));
  process.exit(1);
}
console.log("\ncache headers OK");
