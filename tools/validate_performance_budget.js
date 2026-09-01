// 效能預算。
//
// zero-build 靜態站的效能故事很簡單：首屏就是把 index.html 列的每支
// script 抓下來、跑一遍。所以預算直接掛在「出貨的位元組」上 ——
// 它跨平台確定、不會 flaky，而且違約時能指名是誰超支。
//
// 時間類指標（TTI、首繪）刻意不進閘門：CI 機器的快慢每天不同，
// 拿它當門檻的下場就是大家學會重跑直到綠燈。時間只印出來給人看。
//
// 預算數字是 2026-09 大改版後的現況加上合理餘裕 —— 它的目的不是
// 逼優化，是擋「不知不覺又肥回去」。要調預算可以，但要在這裡改數字，
// 留下紀錄，而不是默默超過。

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// 各類別的預算（bytes）。gzip 前的原始大小 —— 部署雖有壓縮，
// 但解析與執行成本跟原始大小走，而且原始大小人人都能本機重現。
// kernel 分兩類：手寫的邏輯模組，跟工具產生的側表（uid/origin/rubric/
// derived_hints/verified_answers/equivalence/skill_tags）。側表是資料 ——
// 它們隨題庫成長是正常的，跟著題庫預算走；邏輯肥大才是要擋的事。
const GENERATED_TABLES = /^src\/kernel\/(uid_map|origin|rubric|rubric_reviewed|derived_hints|verified_answers|equivalence|skill_tags|workbook_facts)\.js$/;

const BUDGETS = {
  "app.js 主程式": { pattern: /^src\/app\.js$/, budget: 700 * 1024 },
  "kernel 產生側表": { pattern: GENERATED_TABLES, budget: 500 * 1024 },
  "kernel 邏輯模組": { pattern: /^src\/kernel\//, budget: 200 * 1024 },
  "題庫資料合計": { pattern: /^src\/problem|^src\/problems\.js$|^src\/proofs\.js$/, budget: 2400 * 1024 },
  "樣式 styles.css": { pattern: /^styles\.css$/, budget: 300 * 1024, fromCss: true },
  "其他 src 腳本": { pattern: /^src\//, budget: 300 * 1024, catchAll: true }
};

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const scripts = [...html.matchAll(/src="(src\/[^"]+\.js)"/g)].map((m) => m[1]);
const failures = [];

const sizeOf = (rel) => {
  try { return fs.statSync(path.join(ROOT, rel)).size; } catch (_e) { return 0; }
};

const claimed = new Set();
const rows = [];
for (const [label, spec] of Object.entries(BUDGETS)) {
  let files = [];
  if (spec.fromCss) {
    files = ["styles.css"];
  } else if (spec.catchAll) {
    files = scripts.filter((s) => spec.pattern.test(s) && !claimed.has(s));
  } else {
    // 類別依宣告順序互斥：先宣告的先認領。side table 歸資料、
    // 剩下的 kernel 才算邏輯 —— 順序反了整個分類就失真。
    files = scripts.filter((s) => spec.pattern.test(s) && !claimed.has(s));
    files.forEach((f) => claimed.add(f));
  }
  const total = files.reduce((sum, f) => sum + sizeOf(f), 0);
  const pct = Math.round((total / spec.budget) * 100);
  rows.push({ label, total, budget: spec.budget, pct, count: files.length });
  if (total > spec.budget) {
    const worst = files.map((f) => [f, sizeOf(f)]).sort((a, b) => b[1] - a[1]).slice(0, 3)
      .map(([f, b]) => `${f} ${Math.round(b / 1024)}KB`).join("、");
    failures.push(`${label} 超出預算：${Math.round(total / 1024)}KB / ${Math.round(spec.budget / 1024)}KB（最大：${worst}）`);
  }
}

console.log("效能預算（原始位元組）");
rows.forEach((r) => {
  console.log(
    `  ${r.label.padEnd(14)} ${String(Math.round(r.total / 1024)).padStart(5)} KB / ${String(Math.round(r.budget / 1024)).padStart(5)} KB  ${String(r.pct).padStart(3)}%  （${r.count} 檔）`
  );
});

// script 數量：每支都是一次 request 與一次解析。上限一樣是「擋回肥」。
const SCRIPT_COUNT_BUDGET = 60;
console.log(`  script 標籤        ${String(scripts.length).padStart(5)} 支 / ${SCRIPT_COUNT_BUDGET} 支上限`);
if (scripts.length > SCRIPT_COUNT_BUDGET) {
  failures.push(`index.html 的 script 數量 ${scripts.length} 超過 ${SCRIPT_COUNT_BUDGET}`);
}

if (failures.length) {
  console.error(`\n效能預算超支（${failures.length}）：`);
  failures.forEach((f) => console.error("  " + f));
  console.error("要調預算就改這個檔案裡的數字並寫清楚為什麼 —— 不要默默超過。");
  process.exit(1);
}

console.log("\nperformance budget OK");
