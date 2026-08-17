// 產生第二層提示：src/kernel/derived_hints.js
//
// 只補**作者沒寫**的題，而且只補「機器能重新驗證」的事實（見 tools/lib/hint_facts.js）。
// 作者寫過的一律不動 —— 人的提示永遠贏機器推的。
//
// 為什麼要有這個東西：目前 675 題只有一條提示或完全沒有，那些題目的
// 第二層（「關鍵步驟」）在畫面上寫的是「這題沒有」。使用者卡住的時候，
// 從第一層（技巧名稱）直接跳到第三層（完整推導）——中間那一階是空的，
// 而中間那一階正是「我想自己解出來」的人需要的。
//
// 產生的內容不會蓋掉 problem.hints，走側表（跟 rubric / origin 同一個模式）。
//
// 用法：node tools/generate_hints.js

"use strict";

const fs = require("fs");
const path = require("path");
const loadAppApi = require("./lib/app_api.js");
const { factFor } = require("./lib/hint_facts.js");

loadAppApi();
const problems = loadAppApi.allProblems();

const table = {};
const byDetector = {};
let skippedAuthored = 0;
let noFact = 0;

problems.forEach((problem) => {
  // 作者已經寫了兩條以上，不需要補
  if ((problem.hints || []).length >= 2) { skippedAuthored += 1; return; }
  const fact = factFor(problem);
  if (!fact) { noFact += 1; return; }
  table[problem.id] = { text: fact.text, claim: fact.claim };
  byDetector[fact.detector] = (byDetector[fact.detector] || 0) + 1;
});

const lines = Object.keys(table).sort().map((id) => {
  const entry = table[id];
  return `    ${JSON.stringify(id)}: { text: ${JSON.stringify(entry.text)}, claim: ${JSON.stringify(entry.claim)} }`;
});

const output = path.join(__dirname, "..", "src", "kernel", "derived_hints.js");
fs.writeFileSync(output, `// 自動產生 —— 不要手改。來源：tools/generate_hints.js
//
// 第二層提示（「關鍵步驟」）的補充。只補作者沒寫的題。
//
// 每一條都是**這一題特有的、機器判定出來的事實**，不是罐頭句子：
// 「直接代入會得到 0/0」、「f(x)+f(π−x) 恆等於 2」、「比值判別的極限明顯小於 1」。
// 罐頭句子（「先求反導數再代入上下限」）對每一題都成立，也就是對每一題都沒用。
//
// 每一條都帶一個 claim，tools/validate_derived_hints.js 每次 CI 都會**重新算一次**。
// 題目改了、事實不成立了，會當場變紅 —— 這是自動產生內容唯一能被接受的形式。
//
// 畫面上會標明這些是機器推導的，不要讓它看起來像有人背書。
//
// 重新產生：node tools/generate_hints.js

(function () {
  "use strict";

  const DERIVED_HINTS = {
${lines.join(",\n")}
  };

  const API = {
    version: 1,
    table: DERIVED_HINTS,
    textFor: (id) => (DERIVED_HINTS[id] ? DERIVED_HINTS[id].text : ""),
    has: (id) => Boolean(DERIVED_HINTS[id])
  };

  if (typeof module !== "undefined" && module.exports) module.exports = DERIVED_HINTS;
  if (typeof window !== "undefined") {
    window.BUZZ_DERIVED_HINTS = DERIVED_HINTS;
    window.BuzzDerivedHints = API;
  }
})();
`, "utf8");

const covered = Object.keys(table).length;
const needed = problems.length - skippedAuthored;
console.log("推導式提示");
console.log(`  題數            ${problems.length}`);
console.log(`  作者已寫（≥2 條）${skippedAuthored}`);
console.log(`  缺提示          ${needed}`);
console.log(`  推得出事實      ${covered}（${((100 * covered) / needed).toFixed(1)}% 的缺口）`);
console.log(`  推不出來        ${noFact}`);
console.log("");
console.log("  事實種類：");
Object.entries(byDetector).sort((a, b) => b[1] - a[1]).forEach(([kind, n]) => {
  console.log(`    ${kind.padEnd(14)}${n}`);
});
console.log("");
console.log(`寫出 src/kernel/derived_hints.js（${covered} 條）`);
