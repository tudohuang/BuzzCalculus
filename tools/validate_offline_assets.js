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

const pages = ["index.html", "workbook.html"];
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

/* ── 5. sw.js 要把 vendor 全部預快取 ──────────────────────── */

const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const cached = new Set([...sw.matchAll(/"\.\/([^"]+)"/g)].map((m) => m[1]));
required.forEach((file) => {
  if (!cached.has(file)) fail(`sw.js 沒有預快取 ${file} —— 離線時會失效`);
});
if (fs.existsSync(path.join(root, "assets/vendor/katex/fonts"))) {
  fs.readdirSync(path.join(root, "assets/vendor/katex/fonts")).forEach((file) => {
    const rel = `assets/vendor/katex/fonts/${file}`;
    if (!cached.has(rel)) fail(`sw.js 沒有預快取字型 ${file}`);
  });
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
