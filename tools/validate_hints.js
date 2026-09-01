// 提示的品質關卡。
//
// 提示不是免費的：買第二層要扣 6 + rank×2 分。所以一條提示只有兩種下場 ——
// 要嘛值那個分數，要嘛是在收費卻什麼都沒給。這支擋的是後者的兩種極端：
//
//   1. 提示裡直接寫出答案。
//      實際發生過 10 題，全是三條提示的最後一條把結果講完：
//      「Quarter area is pi/4.」「Volume is 1/6.」「Its modulus is 1/2.」
//      使用者付了關鍵步驟的分數，拿到的是答案本身 —— 比看解答還便宜，
//      於是分數失去意義，而三層階梯也塌了。
//
//   2. 輸入格式說明被當成提示。
//      實際發生過 438 題：「Use WebWork form: log(x), exp(x)…」
//      那不是提示，而且 app 本身已經用 formatHelp 在作答框旁邊講同一件事。
//
// 另外報告（不擋）罐頭提示的覆蓋率。專案自己的判準是
// 「對每一題都成立的句子，對每一題都沒用」，機械化的近似就是
// 同一句話出現在很多題上。這個數字沒有門檻 —— 它是人要寫的東西，
// 但必須每次 CI 都看得見，不然「作者寫了 830 題」這種數字會一直被當成深度。

"use strict";

const path = require("path");
const loadAppApi = require("./lib/app_api.js");

loadAppApi();
const problems = loadAppApi.allProblems();

const norm = (value) => String(value || "").replace(/\s+/g, "").trim();
const failures = [];

/* ── 1. 提示不准包含完整答案 ────────────────────────────── */
problems.forEach((problem) => {
  const answer = norm(problem.answer);
  // 太短的答案（0、1、pi）會在任何式子裡出現，比對沒有意義
  if (!answer || answer.length < 3) return;
  (problem.hints || []).forEach((hint, index) => {
    if (norm(hint).includes(answer)) {
      failures.push(
        `${problem.id} 的第 ${index + 1} 條提示直接寫出答案「${problem.answer}」：${String(hint).slice(0, 52)}`
      );
    }
  });
});

/* ── 2. 輸入格式說明不算提示 ────────────────────────────── */
const FORMAT_NOTE = /WebWork|答案請用|Keep the final answer in|Constants of integration may be omitted|輸入格式/i;
problems.forEach((problem) => {
  (problem.hints || []).forEach((hint, index) => {
    if (FORMAT_NOTE.test(String(hint))) {
      failures.push(
        `${problem.id} 的第 ${index + 1} 條提示只是輸入格式說明（app 已用 formatHelp 講過）：${String(hint).slice(0, 52)}`
      );
    }
  });
});

/* ── 3. 罐頭覆蓋率（報告，不擋）──────────────────────────── */
const CANNED_AT = 5;
const counts = new Map();
problems.forEach((problem) => {
  (problem.hints || []).forEach((hint) => {
    const key = norm(hint);
    if (!key) return;
    if (!counts.has(key)) counts.set(key, { text: hint, ids: [] });
    counts.get(key).ids.push(problem.id);
  });
});
const canned = new Set(
  [...counts.values()].filter((entry) => entry.ids.length >= CANNED_AT).map((entry) => norm(entry.text))
);
const withHints = problems.filter((problem) => (problem.hints || []).some((hint) => norm(hint)));
const allCanned = withHints.filter((problem) =>
  (problem.hints || []).filter((hint) => norm(hint)).every((hint) => canned.has(norm(hint)))
);
const specific = withHints.length - allCanned.length;

console.log("提示品質");
console.log(`  有作者提示        ${withHints.length} 題`);
console.log(`  其中題目專屬      ${specific} 題（${((specific / problems.length) * 100).toFixed(1)}%）`);
console.log(`  全部是罐頭        ${allCanned.length} 題 ← 等於沒有題目專屬提示`);
console.log(`  不同的提示句子    ${counts.size}`);

/* ── 4. 罐頭封鎖清單必須跟得上題庫 ──────────────────────────
   src/kernel/canned_hints.js 是實際擋在使用者面前的那道牆：
   清單裡的句子在 app.js 的 authoredHints() 就被濾掉，不會被當成提示賣出去。
   這一節確保那份清單不會過期 ——
     · 題庫長出新的罐頭句子（同一句 ≥ CANNED_AT 題）卻沒被擋 → 失敗
     · 清單裡的句子在題庫裡已經不存在 → 失敗（改過題就該把它移掉）
   兩個方向都要擋。只擋一邊的話，清單會慢慢變成一份沒人維護的舊資料。 */
const blocklist = global.window && global.window.BuzzCannedHints;
if (!blocklist) {
  failures.push("src/kernel/canned_hints.js 沒有載入 —— 罐頭提示等於沒有被擋");
} else {
  const listed = new Set(blocklist.all().map((text) => norm(text)));

  // 這裡刻意**不**要求「所有重複 ≥5 次的句子都必須被擋」。
  // 重複不等於沒內容：「Convert to the beta function.」「sin 微分變 cos。」
  // 都出現在很多題上，但它們指名了具體的技巧，是真的提示。
  // 要不要擋是人的判斷，這支只負責讓那個判斷被看見（下面的重複排行）
  // 並且確保清單本身不會過期。
  const stale = [...listed].filter((text) => !counts.has(text));
  stale.forEach((text) => {
    failures.push(`封鎖清單裡的句子在題庫裡已經不存在，請移除：「${text.slice(0, 46)}」`);
  });

  console.log(`  已封鎖的罐頭句子  ${listed.size} 句（在 authoredHints 就濾掉，不會扣分）`);
}

const worst = [...counts.values()]
  .filter((entry) => entry.ids.length >= CANNED_AT)
  .sort((a, b) => b.ids.length - a.ids.length)
  .slice(0, 5);
if (worst.length) {
  console.log("\n  重複最多的句子：");
  worst.forEach((entry) => console.log(`    ${String(entry.ids.length).padStart(4)} 題  「${entry.text.slice(0, 50)}」`));
}

if (failures.length) {
  console.error(`\n提示驗證失敗（${failures.length}）：`);
  failures.slice(0, 20).forEach((line) => console.error("  " + line));
  if (failures.length > 20) console.error(`  …另有 ${failures.length - 20} 條`);
  process.exit(1);
}

console.log("\nhints OK");
