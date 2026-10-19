// 部署時把 index.html 的 script 串成幾支（請求數瘦身，2026-10-17）
//
// 為什麼：首頁一打開要 70 支 defer script（4.4MB），加 CSS、字型約 130 個請求。沒有 Service Worker 的訪客
// （爬蟲、無痕視窗、App 內建瀏覽器、第一次來的人）每支都要回伺服器問一次 —— Vercel Hobby 一個月 100 萬個 CDN 請求，
// 2026-10 用到 230 萬。檔案一點都不大（流量只用三成），是太碎。
//
// 做法：原始碼完全不動（開發、驗證器、E2E 照舊吃一支一支的檔），部署時才串：
//   - defer 的 script：照 index.html 的順序切成幾段（依「多常改」分：vendor／題庫／側表／畫面／app.js），
//     每一段照原順序串成一支 bundle/<名>.<內容雜湊 8 碼>.js，index.html 換成一個 <script defer>。
//     defer 本來就照文件順序一支接一支執行、共用同一個全域 —— 串起來執行順序、全域名稱都一樣。
//     （每支檔都不是檔層級 "use strict"、都以分號結尾 —— 這支會檢查，不成立就拒絕串。）
//   - 一組有好幾支的 lazy 群組（data-lazy="proof" 三支…）：串成一支，留在原本第一支的位置；app.js 的 ensureLazy 照標籤載，不用改。
//   - daily_one_history.js 不串：CI 每天長一格，串進去整段每天都要重抓。
//   - 檔名帶內容雜湊 → vercel.json 對 /bundle/ 回 immutable（一年）：回訪的人連 304 都不用問。內容變了檔名就變。
// 最後重產 sw.js 的 APP_SHELL／REVISIONS（tools/build_sw_revisions.js 讀改寫後的 index.html）。
//
// 部署才跑：vercel.json 的 buildCommand 與 GitHub Pages 的 Assemble site（都在 stamp_build.js 之後）。
// 會改寫工作區的 index.html 與 sw.js —— 不要在開發的工作區跑；CI 在一份複本上跑完再拿 E2E 測那份複本。
//
// 用法：node tools/bundle_site.js       改寫這支工具所在的那份 repo（要測就先整份複製，跑複本裡的這支）
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { shipProblemFile } = require("./lib/strip_verify.js");

const ROOT = path.join(__dirname, "..");
const OUT = "bundle";
// 新的一段從這支開始（依「多常改」切）；SOLO 自己一支、不串
const BREAKS = new Map([
  ["assets/vendor/katex/katex.min.js", "vendor"],
  ["src/kernel/i18n.js", "bank"],
  ["src/kernel/skill_tags.js", "tables"],
  ["src/kernel/board_render.js", "ui"]
]);
const SOLO = new Set(["src/kernel/daily_one_history.js", "src/app.js"]);

const TAG = /^([ \t]*)<script (defer|type="text\/lazy" data-lazy="([^"]+)") src="([^"]+)"><\/script>[ \t]*\r?\n/gm;
const local = (src) => !/^(https?:)?\/\//.test(src);

function lead(text) {
  let s = text;
  for (;;) {
    const before = s;
    s = s.replace(/^\s+/, "").replace(/^\/\/[^\n]*\n?/, "").replace(/^\/\*[\s\S]*?\*\//, "");
    if (s === before) return s;
  }
}

function source(rel) {
  const text = fs.readFileSync(path.join(ROOT, rel), "utf8").replace(/^﻿/, "");
  if (/^["']use strict["']/.test(lead(text))) throw new Error(`${rel} 是檔層級 "use strict"：串在別支後面就不嚴格了，不能串`);
  if (text.trimEnd().slice(-1) !== ";" && text.trimEnd().slice(-1) !== "}") throw new Error(`${rel} 結尾不是 ; 或 }：串起來可能黏到下一支`);
  if (/\/\/# sourceMappingURL=/.test(text)) throw new Error(`${rel} 帶 sourceMappingURL：串起來會指錯`);
  // 題庫檔：拿掉只給驗證器用的 verify（app 不讀，約 400KB）；每一支都在 vm 裡比對過「題目除了 verify 一模一樣」才換
  if (/^src\/problem_[a-z0-9_]+\.js$/.test(rel)) return shipProblemFile(text, rel);
  return text;
}

function write(name, files) {
  const body = files.map((rel) => `/* ── ${rel} ── */\n${source(rel).trimEnd()}\n;\n`).join("");
  const hash = crypto.createHash("sha256").update(body).digest("hex").slice(0, 8);
  const rel = `${OUT}/${name}.${hash}.js`;
  fs.writeFileSync(path.join(ROOT, rel), body);
  return { rel, bytes: Buffer.byteLength(body) };
}

function bundle() {
  const indexPath = path.join(ROOT, "index.html");
  const html = fs.readFileSync(indexPath, "utf8");
  if (/src="bundle\//.test(html)) throw new Error("index.html 已經串過了");
  const tags = [...html.matchAll(TAG)].map((m) => ({ text: m[0], indent: m[1], lazy: m[3] || "", src: m[4], at: m.index }));

  // defer 的切段：照順序；遇到 BREAKS 開新段、SOLO 不動
  const segments = [];
  let current = null;
  tags.filter((t) => !t.lazy && local(t.src)).forEach((t) => {
    if (SOLO.has(t.src)) { current = null; return; }
    if (BREAKS.has(t.src) || !current) {
      current = { name: BREAKS.get(t.src) || `part${segments.length + 1}`, tags: [] };
      segments.push(current);
    }
    current.tags.push(t);
  });
  // lazy 群組：兩支以上才串
  const groups = new Map();
  tags.filter((t) => t.lazy).forEach((t) => { if (!groups.has(t.lazy)) groups.set(t.lazy, []); groups.get(t.lazy).push(t); });

  fs.rmSync(path.join(ROOT, OUT), { recursive: true, force: true });
  fs.mkdirSync(path.join(ROOT, OUT), { recursive: true });
  const replace = new Map(); // 原標籤的位置 → 新的那一行（"" = 拿掉）
  const report = [];
  segments.filter((s) => s.tags.length > 1).forEach((s) => {
    const out = write(s.name, s.tags.map((t) => t.src));
    s.tags.forEach((t, i) => replace.set(t.at, i ? "" : `${t.indent}<script defer src="${out.rel}"></script>\n`));
    report.push(`  ${out.rel.padEnd(30)} ${String(s.tags.length).padStart(3)} 支  ${(out.bytes / 1024).toFixed(0).padStart(5)} KB`);
  });
  [...groups].filter(([, list]) => list.length > 1).forEach(([group, list]) => {
    const out = write(`lazy-${group}`, list.map((t) => t.src));
    list.forEach((t, i) => replace.set(t.at, i ? "" : `${t.indent}<script type="text/lazy" data-lazy="${group}" src="${out.rel}"></script>\n`));
    report.push(`  ${out.rel.padEnd(30)} ${String(list.length).padStart(3)} 支  ${(out.bytes / 1024).toFixed(0).padStart(5)} KB  （lazy：${group}）`);
  });

  let next = "";
  let last = 0;
  tags.forEach((t) => {
    next += html.slice(last, t.at) + (replace.has(t.at) ? replace.get(t.at) : t.text);
    last = t.at + t.text.length;
  });
  next += html.slice(last);
  fs.writeFileSync(indexPath, next);

  const count = (h) => [...h.matchAll(TAG)].filter((m) => !m[3] && local(m[4])).length;
  return { report, before: count(html), after: count(next) };
}

if (require.main === module) {
  try {
    const { report, before, after } = bundle();
    // sw.js 的 APP_SHELL／REVISIONS 照改寫後的 index.html 重產
    const sw = require("./build_sw_revisions.js");
    fs.writeFileSync(path.join(ROOT, "sw.js"), sw.swSource());
    console.log(`bundle：首頁的 defer script ${before} → ${after} 支`);
    report.forEach((line) => console.log(line));
  } catch (error) {
    console.error(`bundle_site 失敗：${error.message}`);
    process.exit(1);
  }
}

module.exports = { bundle, BREAKS, SOLO, OUT };
