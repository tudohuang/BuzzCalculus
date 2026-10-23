// 全站搜尋的索引（src/search_index.js，data-lazy="search"：按 Ctrl+K／點搜尋才抓）。
//
// 課文太大（316 課的旁白近 50 萬字、1.4MB）不放；收的是每一節的標題＋黑板上寫的中文（式子拿掉）——
// 重點用詞（夾擠、羅必達、Cauchy…）幾乎都會寫上板，約 15 萬字。點一筆就開到那一課那一節。
// 另外收：課名（照大綱的課號）、證明題（白話證明＋經典題的標題）。
//
// 用法：node tools/build_search_index.js（regen_all 會跑；課文或大綱改了沒重跑，--check 紅）
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "tools", "content", "course_v2");
const OUT = path.join(ROOT, "src", "search_index.js");

// 大綱：Stage（隱藏的標出來）→ 課號、id、課名
const lessons = [];
let stage = null;
fs.readFileSync(path.join(SOURCE, "OUTLINE.md"), "utf8").split(/\r?\n/).forEach((line) => {
  const s = /^## Stage (\d+) (.+)$/.exec(line);
  if (s) { stage = { n: s[1], hidden: /隱藏/.test(s[2]) }; return; }
  const m = /^- ([\d.]+) \| ([a-z0-9-]+) \| ([^|]+?) \|/.exec(line);
  if (m && stage) lessons.push({ no: m[1], id: m[2], title: m[3].trim(), hidden: stage.hidden });
});

// 一節：標題＋黑板上的中文（$…$ 與 {{id: 拿掉；同一段話出現兩次只留一次）
// 式子換成「…」：摘錄裡看得出那裡有一條式子，不會是一段空白
const cjk = (s) => (String(s).replace(/\$[^$]*\$/g, "…").replace(/\{\{[a-z0-9]+:|\}\}/g, "").replace(/(…\s*){2,}/g, "…").match(/[㐀-鿿A-Za-z…][㐀-鿿\w，、：；。！？「」（）…\s-]*/g) || []).map((x) => x.trim()).filter((x) => x && x !== "…");
const secs = [];
lessons.forEach((l, li) => {
  const file = path.join(SOURCE, "lessons", `${l.id}.json`);
  if (!fs.existsSync(file)) return;
  const L = JSON.parse(fs.readFileSync(file, "utf8"));
  (L.sections || []).forEach((s, si) => {
    const seen = new Set();
    const bits = [];
    s.beats.forEach((b) => (b.board || []).forEach((a) => { if (typeof a.line === "string") cjk(a.line).forEach((x) => { if (!seen.has(x)) { seen.add(x); bits.push(x); } }); }));
    secs.push([li, si, String(s.title || "").replace(/\$[^$]*\$/g, "").trim(), bits.join("｜")]);
  });
});

// 證明題：白話證明（pl-*，機器判）與經典題（proofs.js）
const box = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "src", "proof_lang_content.js"), "utf8"), box);
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "src", "proofs.js"), "utf8"), box);
const proofs = (box.window.BUZZ_PROOF_LANG_PROBLEMS || []).map((p) => [`pl:${p.id}`, p.title])
  .concat((box.window.BUZZ_PROOFS || []).map((p) => [`pf:${p.id}`, p.title]));

const data = { lessons: lessons.map((l) => [l.id, l.no, l.title, l.hidden ? 1 : 0]), secs, proofs };
const text = `// 產生檔：node tools/build_search_index.js（來源 tools/content/course_v2/、src/proof_lang_content.js、src/proofs.js）。不要手改。\nwindow.BUZZ_SEARCH = ${JSON.stringify(data)};\n`;
if (!fs.existsSync(OUT) || fs.readFileSync(OUT, "utf8") !== text) fs.writeFileSync(OUT, text);
console.log(`search_index.js：${lessons.length} 課、${secs.length} 節、${proofs.length} 題證明，${Math.round(Buffer.byteLength(text) / 1024)} KB`);
