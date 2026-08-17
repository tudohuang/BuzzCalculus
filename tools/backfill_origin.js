// 產生 src/kernel/origin.js：每題的來源聲明
//
// 為什麼要有這個欄位：題庫是這個產品唯一無法被複製的資產，而「這題哪來的」
// 一旦說不清楚，變現的時候就是法務問題。現在的 source 欄位是一句自由文字
// （"Buzz hard integrals"、"Exam-style expansion 2026"），機器讀不出授權狀態。
//
// origin.kind 只有五種，而且每一種都對應一個明確的立場：
//   original       Buzz 原創，我們有完整權利
//   adapted        改編自某個具體來源，需要標示
//   inspired       只借了風格／難度感，題目本身是新寫的
//   public-domain  公有領域
//   user-submitted 使用者投稿，授權見投稿條款
//
// 特別注意 school 欄位那 135 題：它們不是那些學校的官方試題，
// 是「那個風格」的原創題（app.js 也是顯示成「MIT 風格」）。
// 所以 kind 是 inspired，而且 note 必須把這件事講白 ——
// 含糊其辭地讓人以為是真題，是這個欄位存在的意義所在。
//
// 用法：node tools/backfill_origin.js

"use strict";

const fs = require("fs");
const path = require("path");
const loadAppApi = require("./lib/app_api.js");

loadAppApi();
const problems = loadAppApi.allProblems();

const table = {};
const counts = {};

problems.forEach((problem) => {
  let kind = "original";
  let note = "";

  if (problem.school) {
    kind = "inspired";
    note = `${problem.school} 風格的原創題，非該校官方試題`;
  } else if (/public\s*domain|公有領域/i.test(problem.source || "")) {
    kind = "public-domain";
    note = String(problem.source);
  } else if (/adapted|改編/i.test(problem.source || "")) {
    kind = "adapted";
    note = String(problem.source);
  }

  table[problem.id] = note ? [kind, note] : [kind];
  counts[kind] = (counts[kind] || 0) + 1;
});

const lines = Object.keys(table)
  .sort()
  .map((id) => `    ${JSON.stringify(id)}: ${JSON.stringify(table[id])}`);

const output = path.join(__dirname, "..", "src", "kernel", "origin.js");
fs.writeFileSync(output, `// 自動產生 —— 不要手改。來源：tools/backfill_origin.js
//
// 每題的來源聲明。格式：id → [kind] 或 [kind, note]。
// kind 的五種值與意義見 docs/spec/05-content-pipeline.md#56。
//
// 為什麼這件事重要：題庫是唯一無法被複製的資產，而「這題哪來的」說不清楚，
// 在變現的時候就是法務問題。validate_origin.js 會擋下兩件事：
// 沒有 kind 的題，以及「題幹或解說出現名校字眼、kind 卻標成 original」的題。
//
// 帶 school 欄位的 135 題一律是 inspired：它們是那個風格的原創題，
// 不是該校的官方試題。含糊其辭讓人以為是真題，正是這個欄位要防的事。
//
// 重新產生：node tools/backfill_origin.js

(function () {
  "use strict";

  const ORIGIN = {
${lines.join(",\n")}
  };

  const KINDS = {
    original: "Buzz 原創",
    adapted: "改編自既有題目",
    inspired: "取材自某種風格，題目為原創",
    "public-domain": "公有領域",
    "user-submitted": "使用者投稿"
  };

  const API = {
    version: 1,
    table: ORIGIN,
    kinds: KINDS,
    kindFor: (id) => (ORIGIN[id] ? ORIGIN[id][0] : null),
    noteFor: (id) => (ORIGIN[id] && ORIGIN[id][1]) || "",
    labelFor: (id) => KINDS[ORIGIN[id] && ORIGIN[id][0]] || ""
  };

  if (typeof module !== "undefined" && module.exports) module.exports = ORIGIN;
  if (typeof window !== "undefined") {
    window.BUZZ_ORIGIN = ORIGIN;
    window.BuzzOrigin = API;
  }
})();
`, "utf8");

console.log(`origin.js 寫出 ${Object.keys(table).length} 題`);
Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([kind, n]) => {
  console.log(`  ${kind.padEnd(16)}${n}`);
});
