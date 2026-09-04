// 把 rubric_reviewed.js 的人工三軸落地進 rubric.js 的 RUBRIC 表。
//
// 為什麼需要這支：rank 在執行期讀的是 RUBRIC[id]（rubric.js），
// REVIEWED 只有在跑 recalibrate_rubric.js 全量重推時才會被吸收。
// 但全量重推會動幾百題（feature 推導 vs 現行 rank 的差距很大），
// 那是另一個要逐題複核的工程。這支只做一件事：
// 對「人工看過並簽名」的題，把 RUBRIC 的軸改成 REVIEWED 的軸 ——
// 其他一千八百多題一根汗毛都不動。
//
// 用法：node tools/apply_reviewed_rubric.js（幂等，重跑無害）

"use strict";

const fs = require("fs");
const path = require("path");

const REVIEWED = require(path.join(__dirname, "..", "src", "kernel", "rubric_reviewed.js"));
const rubricPath = path.join(__dirname, "..", "src", "kernel", "rubric.js");
let source = fs.readFileSync(rubricPath, "utf8").replace(/\r\n/g, "\n");

let changed = 0;
let missing = 0;
Object.entries(REVIEWED).forEach(([id, entry]) => {
  const axes = entry.axes;
  if (!axes) return;
  const pattern = new RegExp(`("${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":\\s*\\[)\\d,\\d,\\d(\\])`);
  const replacement = `$1${axes[0]},${axes[1]},${axes[2]}$2`;
  const next = source.replace(pattern, replacement);
  if (next === source) {
    if (!source.includes(`"${id}"`)) {
      console.warn(`  RUBRIC 裡沒有 ${id} —— 題目移除了？`);
      missing += 1;
    }
    // 已一致：不動
  } else {
    source = next;
    changed += 1;
  }
});

fs.writeFileSync(rubricPath, source, "utf8");
console.log(`已套用 ${changed} 題的人工三軸到 src/kernel/rubric.js（缺席 ${missing}）`);
