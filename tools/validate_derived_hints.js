// 推導式提示的重新驗證
//
// derived_hints.js 裡每一條提示都對題目做了一個具體的宣稱：
// 「這是 0/0 型」、「f(x)+f(π−x) 恆等於 2」、「比值明顯小於 1」。
//
// 這支把每一條都**重新算一次**。這是自動產生內容唯一能被接受的形式 ——
// 人檢查不了幾百條提示，機器可以，而且每次 CI 都會再檢查一次。
//
// 什麼時候會紅：
//   - 題目改了（換了上下限、改了被積函數），事實不再成立
//   - 偵測器改了，同一題推出不同的結論
//   - 有人手改了「不要手改」的產生檔
//
// 這三種都是「畫面上會出現錯誤提示」的前兆。錯的提示比沒有提示傷得更重：
// 使用者照著錯的方向想，卡更久，然後不再相信提示。
//
// 用法：node tools/validate_derived_hints.js

"use strict";

const path = require("path");
const loadAppApi = require("./lib/app_api.js");
const { recheck } = require("./lib/hint_facts.js");

loadAppApi();
const problems = loadAppApi.allProblems();
const byId = new Map(problems.map((problem) => [problem.id, problem]));
const derived = require(path.join(__dirname, "..", "src", "kernel", "derived_hints.js"));

const failures = [];
const fail = (message) => failures.push(message);

let rechecked = 0;
const byKind = {};

Object.keys(derived).forEach((id) => {
  const entry = derived[id];
  const problem = byId.get(id);
  if (!problem) {
    fail(`${id} 有提示但題目不存在了 —— 重跑 node tools/generate_hints.js`);
    return;
  }
  // 作者後來補了提示的話，機器那條就該退場
  if ((problem.hints || []).length >= 2) {
    fail(`${id} 作者已經寫了 ${problem.hints.length} 條提示，機器推的那條應該移除`);
    return;
  }
  if (!entry.text || !entry.text.trim()) {
    fail(`${id} 的提示是空的`);
    return;
  }
  if (!entry.claim || !entry.claim.k) {
    fail(`${id} 的提示沒有帶 claim —— 沒有 claim 就無法重新驗證，不准出貨`);
    return;
  }

  const result = recheck(problem, entry.claim);
  rechecked += 1;
  byKind[entry.claim.k] = (byKind[entry.claim.k] || 0) + 1;
  if (!result.ok) {
    fail(`${id} 的提示已經不成立（${entry.claim.k}）：${result.reason}\n      提示：${entry.text.slice(0, 60)}`);
  }
});

console.log("推導式提示");
console.log(`  條數        ${Object.keys(derived).length}`);
console.log(`  重新驗證    ${rechecked} 條`);
Object.entries(byKind).sort((a, b) => b[1] - a[1]).forEach(([kind, n]) => {
  console.log(`    ${kind.padEnd(14)}${n}`);
});

if (failures.length) {
  console.error("");
  console.error(`推導式提示驗證失敗（${failures.length}）：`);
  failures.slice(0, 15).forEach((line) => console.error(`  ${line}`));
  if (failures.length > 15) console.error(`  …另有 ${failures.length - 15} 條`);
  process.exit(1);
}

console.log("");
console.log("derived hints OK");
