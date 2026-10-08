// 把新版課程（tools/content/course_v2/lessons/*.json）依大綱順序輸出成給人讀的純文字。
// 用法：node tools/render_course_v2.js [輸出檔]   預設 docs/report/course-review/新版課程全文.txt
"use strict";

const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "tools", "content", "course_v2");
if (process.argv[2] && process.argv[2].startsWith("-")) {
  console.log("用法：node tools/render_course_v2.js [輸出檔]   預設 docs/report/course-review/新版課程全文.txt");
  process.exit(0);
}
const out = process.argv[2] || path.join(ROOT, "docs", "report", "course-review", "新版課程全文.txt");

const order = [];
const outline = {};
let stage = "";
let chapter = "";
for (const line of fs.readFileSync(path.join(DIR, "OUTLINE.md"), "utf8").split(/\r?\n/)) {
  let m;
  if ((m = /^## (Stage \d+.*)$/.exec(line))) { stage = m[1]; order.push({ stage }); continue; }
  if ((m = /^### (.*)$/.exec(line))) { chapter = m[1]; continue; }
  if ((m = /^- ([\d.]+) \| ([a-z0-9-]+) \| ([^|]+?) \|/.exec(line))) {
    outline[m[2]] = { number: m[1], title: m[3].trim(), stage, chapter };
    order.push({ id: m[2] });
  }
}
const name = (id) => (outline[id] ? `〈${outline[id].title}〉` : id);

let problems = {};
try {
  const load = require("./lib/app_api.js");
  load();
  problems = Object.fromEntries(load.allProblems().map((p) => [p.id, p]));
} catch (_e) { /* 題庫載不起來就只印題號 */ }

const lines = [];
const w = (s = "") => lines.push(s);
const bar = "═".repeat(60);
let written = 0;
let missing = 0;
const gaps = [];
const fineTags = new Set();

w("BuzzCalculus 新版課程全文");
w(`由 tools/render_course_v2.js 產生　大綱 ${Object.keys(outline).length} 課`);
w(bar);

for (const item of order) {
  if (item.stage) { w(""); w(""); w(`■■ ${item.stage}`); continue; }
  const file = path.join(DIR, "lessons", `${item.id}.json`);
  const o = outline[item.id];
  if (!fs.existsSync(file)) { missing += 1; w(""); w(`（${o.number} ${o.title}：尚未撰寫）`); continue; }
  const L = JSON.parse(fs.readFileSync(file, "utf8"));
  written += 1;
  (L.skillTags && L.skillTags.fine || []).forEach((t) => fineTags.add(t));
  (L.gaps || []).forEach((g) => gaps.push({ lesson: `${o.number} ${o.title}`, ...g }));
  w("");
  w(bar);
  w(`${o.number}　${L.title}`);
  w(`id：${L.id} ／ ${o.chapter}`);
  w(`閱讀約 ${L.readMinutes} 分鐘 ／ 完成本課約 ${L.totalMinutes} 分鐘`);
  w(bar);
  w("");
  w(`先修　${(L.prerequisites || []).map(name).join("、") || "無"}`);
  w("");
  w("學習目標");
  (L.objectives || []).forEach((x, i) => w(`  ${i + 1}. ${x}`));
  w("");
  w("視覺直觀");
  w(`  ${L.visual || "本課不需要動態圖。"}`);
  w("");
  w("觀念");
  (L.concept || []).forEach((c) => {
    w(`  ${c.collapsible ? "【可折疊】" : ""}${c.heading}`);
    (c.body || []).forEach((b) => w(`    ${b}`));
    (c.tex || []).forEach((t) => w(`        式：${t}`));
    w("");
  });
  (L.workedExamples || []).forEach((x, i) => {
    w(`範例 ${i + 1}　${x.title}${x.problemId ? `（題庫 ${x.problemId}）` : ""}`);
    w(`  題目：${x.prompt}`);
    (x.steps || []).forEach((s, k) => w(`  步驟 ${k + 1}：${s}`));
    w(`  答：${x.answer}`);
    if (x.note) w(`  補充：${x.note}`);
    w(`  驗算：${x.claim ? x.claim : `（無機器驗算：${x.claimNote}）`}`);
    w("");
  });
  w("常見錯誤");
  (L.pitfalls || []).forEach((p) => w(`  - ${p}`));
  w("");
  w("小測");
  (L.checks || []).forEach((c, i) => {
    w(`  Q${i + 1}. ${c.ask}`);
    (c.options || []).forEach((op) => w(`      ${op.correct ? "✔" : "　"} ${op.label}${op.why ? `　——${op.why}` : ""}`));
  });
  w("");
  w("技巧標籤");
  w(`  粗：${(L.skillTags && L.skillTags.coarse || []).join("、") || "（無）"}`);
  w(`  細（新）：${(L.skillTags && L.skillTags.fine || []).join("、")}`);
  w("");
  w("推薦題（★ = 核心）");
  if (!(L.practice || []).length) w("  （無，見題庫缺口）");
  (L.practice || []).forEach((p) => {
    const prob = problems[p.id];
    const ans = prob ? String(prob.answer ?? prob.canonical ?? "") : "";
    w(`  ${p.core ? "★" : " "} ${p.id}${prob ? `　R${prob.rank}　${prob.prompt}　答：${ans}` : ""}　練：${p.trains || "—"}${p.challenge ? "　（挑戰）" : ""}${p.note ? `　${p.note}` : ""}`);
  });
  if ((L.gaps || []).length) {
    w("");
    w("題庫缺口");
    L.gaps.forEach((g) => w(`  ${g.tag}：需要 ${g.count} 題　${g.note || ""}`));
  }
  w("");
  w(`下一課　${(L.next || []).map(name).join("、") || "—"}`);
}

const head = [
  "",
  `已寫 ${written} 課，尚未撰寫 ${missing} 課；細標籤 ${fineTags.size} 個；題庫缺口 ${gaps.reduce((a, g) => a + g.count, 0)} 題（${gaps.length} 項）。`,
  ""
];
lines.splice(3, 0, ...head);
if (gaps.length) {
  w(""); w(bar); w("附：題庫缺口總表"); w(bar);
  gaps.forEach((g) => w(`  ${g.lesson}　${g.tag}：${g.count} 題　${g.note || ""}`));
}
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, "﻿" + lines.join("\r\n") + "\r\n", "utf8");
console.log(`${out}：已寫 ${written} / ${written + missing} 課`);
