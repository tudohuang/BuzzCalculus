// 全庫重複題偵測
//
// 重複題的傷害不只是「浪費一個題目名額」：能力模型會把同一題算成兩次獨立證據，
// 於是使用者做了兩題一模一樣的東西，系統以為他在那個技巧上有兩倍的把握。
// 冷卻機制也會失效 —— 剛做完的那題會用另一個 id 立刻再出現一次。
//
// 三層比對，由嚴到寬：
//
//   1. 字面相同    —— 去掉排版差異後題幹一字不差
//   2. 語意相同    —— 用 LaTeX 解析器把兩題編譯成 JS 運算式再比。
//                     \frac{1}{2}x 和 \tfrac12 x 長得不一樣，編譯出來一模一樣。
//   3. 高度相似    —— 答案相同，而且題幹 token 的 Jaccard 相似度超過門檻。
//                     這一層會有誤報（同一類型的不同題），所以只報告不擋。
//
// 用法：
//   node tools/detect_duplicates.js          報告
//   node tools/detect_duplicates.js --ci     第 1、2 層有東西就失敗

"use strict";

const fs = require("fs");
const path = require("path");
const loadAppApi = require("./lib/app_api.js");
const latex = require("./lib/latex.js");
const { topLevelOperator } = require("./lib/verify_engine.js");

const ciMode = process.argv.includes("--ci");
loadAppApi();
const problems = loadAppApi.allProblems();

/* ── 正規化 ───────────────────────────────────────────────── */

// 只拿掉排版差異，不動數學內容
function literalKey(prompt) {
  return String(prompt)
    .replace(/\\left|\\right|\\displaystyle|\\,|\\;|\\!|\\quad|\\qquad|\s/g, "")
    .replace(/\\dfrac|\\tfrac/g, "\\frac")
    .replace(/\{([a-zA-Z0-9])\}/g, "$1");
}

// 數值指紋。
//
// 比字串是不夠的：∫₀^∞ x/(x⁴+1)dx 和 ∫₀^∞ x/(1+x⁴)dx 是同一題，
// 但編譯出來的 JS 一個是 (x)/((x**4+1))、一個是 (x)/((1+x**4))。
// 加法可交換這件事，字串比對永遠學不會。
//
// 改成把式子在一組固定的取樣點上求值，拿那串數字當指紋 ——
// 數學上相同的式子，指紋一定相同；不同的式子，要在五個無理數點上
// 全部撞在一起才會誤判，機率可以忽略。
//
// 指紋要連同「外層是什麼運算子」「積分／求和的上下限」一起算，
// 否則所有算出來等於 1 的定積分都會被歸成同一題。
const FINGERPRINT_POINTS = [0.3137, 0.7211, 1.2345, 1.9871, 2.5313];
// 級數與乘積的通項只在整數上有定義。用實數點取樣的話，(-1)^n 一律變成 NaN，
// 於是**所有交錯級數的指紋都一樣**，十二題完全不同的題目會被歸成同一題。
const INTEGER_POINTS = [1, 2, 3, 5, 7, 11];

function fingerprintOf(latexSource, variable, integerOnly) {
  const compiled = latex.compile(latexSource, [variable]);
  const points = integerOnly ? INTEGER_POINTS : FINGERPRINT_POINTS;
  const values = points.map((x) => {
    const value = compiled(x);
    if (!Number.isFinite(value)) return "x";
    return Number(value.toPrecision(10)).toString();
  });
  // 一個點都算不出來的「指紋」不是指紋，會把所有算不出來的題目黏成一團
  if (values.filter((v) => v !== "x").length < 3) return null;
  return values.join(",");
}

function semanticKey(problem) {
  try {
    const structure = topLevelOperator(problem.prompt);
    if (structure && structure.body && structure.variable) {
      const parts = [
        // 問法不同就不是同一題。同一個極限，「求值」問的是 1/2，
        // 「用哪個技巧？」問的是「泰勒展開」—— 數學一樣，要練的東西不一樣。
        problem.answerKind,
        structure.op,
        structure.from === undefined ? "" : String(structure.from),
        structure.to === undefined ? "" : String(structure.to),
        structure.target === undefined ? "" : String(structure.target),
        structure.order || "",
        fingerprintOf(structure.body, structure.variable, structure.op === "series" || structure.op === "product")
      ];
      if (parts[parts.length - 1] === null) return null;
      return parts.join("|");
    }
    // 沒有外層運算子的普通式子：直接對整個式子取指紋
    const bindings = latex.toJsWithBindings(problem.prompt);
    const free = latex.freeVariables(bindings.js, bindings.bound);
    if (free.length !== 1) return null;
    const print = fingerprintOf(problem.prompt, free[0]);
    return print === null ? null : "expr|" + print;
  } catch (_error) {
    return null;
  }
}

function tokens(prompt) {
  return new Set(String(prompt).match(/\\[A-Za-z]+|[0-9]+|[A-Za-z]|[+\-*/^]/g) || []);
}

function jaccard(a, b) {
  let shared = 0;
  a.forEach((item) => { if (b.has(item)) shared += 1; });
  return shared / (a.size + b.size - shared);
}

function answerKey(problem) {
  if (problem.answerKind === "text") {
    return (problem.answers || []).map((a) => String(a).toLowerCase().trim()).sort().join("|");
  }
  return String(problem.answer || "").replace(/\s/g, "");
}

/* ── 分群 ─────────────────────────────────────────────────── */

function groupBy(list, keyFn) {
  const groups = new Map();
  list.forEach((problem) => {
    const key = keyFn(problem);
    if (key === null || key === undefined || key === "") return;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(problem);
  });
  return [...groups.values()].filter((group) => group.length > 1);
}

const literalGroups = groupBy(problems, (p) => literalKey(p.prompt));
const literalIds = new Set(literalGroups.flat().map((p) => p.id));

const semanticGroups = groupBy(problems, semanticKey)
  .filter((group) => !group.every((p) => literalIds.has(p.id)));
const semanticIds = new Set(semanticGroups.flat().map((p) => p.id));

// 第三層只在「答案相同」的題目之間互比 —— 全庫兩兩比是 100 萬次，
// 而答案不同的兩題本來就不可能是重複。
const SIMILARITY_THRESHOLD = 0.9;
const byAnswer = new Map();
problems.forEach((problem) => {
  const key = problem.topic + "::" + answerKey(problem);
  if (!byAnswer.has(key)) byAnswer.set(key, []);
  byAnswer.get(key).push(problem);
});

const similarPairs = [];
byAnswer.forEach((group) => {
  if (group.length < 2 || group.length > 60) return;
  const tokenSets = group.map((problem) => tokens(problem.prompt));
  for (let i = 0; i < group.length; i += 1) {
    for (let j = i + 1; j < group.length; j += 1) {
      if (literalIds.has(group[i].id) && literalIds.has(group[j].id)) continue;
      if (semanticIds.has(group[i].id) && semanticIds.has(group[j].id)) continue;
      const score = jaccard(tokenSets[i], tokenSets[j]);
      if (score >= SIMILARITY_THRESHOLD) {
        similarPairs.push({ a: group[i], b: group[j], score });
      }
    }
  }
});
similarPairs.sort((x, y) => y.score - x.score);

/* ── 報告 ─────────────────────────────────────────────────── */

console.log("重複題偵測");
console.log(`  題數          ${problems.length}`);
console.log(`  字面相同      ${literalGroups.length} 組`);
console.log(`  語意相同      ${semanticGroups.length} 組`);
console.log(`  高度相似      ${similarPairs.length} 對（相似度 ≥ ${SIMILARITY_THRESHOLD}）`);

function printGroups(title, groups) {
  if (!groups.length) return;
  console.log(`\n${title}`);
  groups.slice(0, 25).forEach((group) => {
    console.log(`  ${group.map((p) => p.id).join("  ↔  ")}`);
    // 每一題的題幹都要印。只印第一題的話，指紋誤判（數學上等值但其實是不同題，
    // 例如同一個值的兩種積分區域）就看不出來，人也就沒辦法複核。
    group.forEach((problem) => console.log(`      ${problem.prompt.slice(0, 84)}`));
  });
  if (groups.length > 25) console.log(`  …另有 ${groups.length - 25} 組`);
}

printGroups("字面相同：", literalGroups);
printGroups("語意相同（排版不同但編譯結果一致）：", semanticGroups);

if (similarPairs.length) {
  console.log("\n高度相似（答案相同 + 題幹幾乎一樣）—— 需要人工判斷是不是刻意的變體：");
  similarPairs.slice(0, 25).forEach(({ a, b, score }) => {
    console.log(`  ${score.toFixed(3)}  ${a.id}  ↔  ${b.id}`);
    console.log(`         ${a.prompt.slice(0, 80)}`);
    console.log(`         ${b.prompt.slice(0, 80)}`);
  });
  if (similarPairs.length > 25) console.log(`  …另有 ${similarPairs.length - 25} 對`);
}

/* ── 人工複核的結果 ───────────────────────────────────────────
   37 組語意重複在 2026-08-17 逐組看過。結論不是「刪掉一邊」——
   兩邊通常分屬不同題包（一個是入門友善、一個是考古題風格），
   刪任何一邊都會在那個題包上開一個洞。

   真正的傷害是**同一局（或同一份考卷）抽到兩題一模一樣的**。
   所以做法改成：把等價關係寫成側表，抽題時同一組只准出現一次。
   內容一題都不刪，而且這個關係是機器每次重新算出來的。

   下面這張表是**誤判**：指紋相同但題目要學的東西不一樣，不該視為等價。 */
// 寫成陣列而不是以「a|b」當 key 的物件：手寫的那個字串順序打錯的話，
// 排除會靜靜地失效，而且看起來一切正常。這裡一律排序後再比。
const NOT_EQUIVALENT = [
  {
    ids: ["int-003", "gap-int-pf-002"],
    why: "∫1/x 是背基本積分；∫(x+1)/(x²+x) 要先看出可以約分。答案一樣，要練的能力不一樣。"
  },
  {
    ids: ["int-024", "depth-int-022"],
    why: "兩個不同的重積分，只是值都是 1/3。內層積分的指紋恰好相同，但積分區域怎麼設才是兩題各自的重點。"
  },
  {
    ids: ["lm-fl-001", "lm-fl-002"],
    why: "x→0⁺ 與 x→0⁻ 的同一個 x⌊1/x⌋。指紋把逼近方向正規化掉了，但方向正是這兩題的全部：" +
      "從左邊來的時候乘不等式要變號，⌊1/x⌋ 也跟著換到負的那側，兩個變號抵消 —— " +
      "答案同樣是 1 這件事，恰恰是第二題要練的反直覺，不是重複。"
  }
];

const notEquivalentKeys = new Set(NOT_EQUIVALENT.map((entry) => entry.ids.slice().sort().join("|")));

const equivalence = {};
let excluded = 0;
semanticGroups.forEach((group) => {
  const sorted = group.map((p) => p.id).sort();
  if (notEquivalentKeys.has(sorted.join("|"))) { excluded += 1; return; }
  group.forEach((problem) => { equivalence[problem.id] = sorted[0]; });
});

// 排除清單裡的題組如果因為改題而不再被判為重複，那條理由就過期了，
// 留著只會誤導下一個讀的人。
const liveKeys = new Set(semanticGroups.map((g) => g.map((p) => p.id).sort().join("|")));
NOT_EQUIVALENT.forEach((entry) => {
  const key = entry.ids.slice().sort().join("|");
  if (!liveKeys.has(key)) {
    console.log(`\n提醒：NOT_EQUIVALENT 裡的 ${entry.ids.join(" ↔ ")} 已經不再被判為重複，可以移除那條理由`);
  }
});

if (process.argv.includes("--write-equivalence")) {
  const ids = Object.keys(equivalence).sort();
  const lines = [
    "// 等價題側表 —— **由 tools/detect_duplicates.js --write-equivalence 產生，不要手改。**",
    "//",
    "// 「等價」的意思是：兩題只有記法差異（\\ln vs \\log、有沒有 \\left\\right、",
    "// x^2/2 vs \\frac{x^2}{2}…），編譯出來是同一題。",
    "//",
    "// 為什麼不直接刪掉一邊：兩邊通常分屬不同題包，一個是入門友善、",
    "// 一個是考古題風格。刪任何一邊都會在那個題包上開一個洞。",
    "// 真正的傷害是同一局或同一份考卷抽到兩題一樣的 —— 所以改成抽題時去重。",
    "//",
    `// 產生時：${semanticGroups.length} 組語意重複，其中 ${excluded} 組經人工複核判定為誤判（見產生器內的 NOT_EQUIVALENT）。`,
    "",
    "(function registerEquivalence() {",
    '  "use strict";',
    "  var MAP = {",
    ...ids.map((id) => `    ${JSON.stringify(id)}: ${JSON.stringify(equivalence[id])},`),
    "  };",
    "  window.BuzzEquivalence = {",
    "    // 抽題去重用的鍵：等價題共用同一個鍵，其餘題目就是自己的 id",
    "    keyOf: function (id) { return (id && MAP[id]) || id; },",
    "    size: " + ids.length,
    "  };",
    "})();",
    ""
  ];
  const out = path.join(__dirname, "..", "src", "kernel", "equivalence.js");
  fs.writeFileSync(out, lines.join("\n"), "utf8");
  console.log(`\n等價側表寫到 src/kernel/equivalence.js（${ids.length} 題，${excluded} 組判定為誤判）`);
}

const reportPath = path.join(__dirname, "..", "reports", "duplicates.json");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify({
  literal: literalGroups.map((g) => g.map((p) => p.id)),
  semantic: semanticGroups.map((g) => g.map((p) => p.id)),
  similar: similarPairs.map(({ a, b, score }) => ({ a: a.id, b: b.id, score: Number(score.toFixed(3)) }))
}, null, 2) + "\n", "utf8");
console.log(`\n報告寫到 ${path.relative(path.join(__dirname, ".."), reportPath)}`);

if (ciMode && literalGroups.length) {
  console.error("\n重複題偵測失敗：字面完全相同的題目必須合併或改寫");
  process.exit(1);
}

// 語意層只報告，不擋 CI。
//
// 因為它會有誤報：∫₀¹∫₀^{1−x}(x+y)dy dx 和 ∫₀¹∫_y¹ x dx dy 的內層積分
// 在數學上恆等（都是 (1−x²)/2），指紋因此相同 —— 但兩題要學的東西
// （積分區域怎麼設）根本不一樣。這種判斷要人來做。
// 讓 CI 自動刪題，錯一次就是永久刪掉一題有價值的內容。
// 語意重複已在 2026-08-17 逐組複核完畢，結果落在 src/kernel/equivalence.js。
// CI 要確認那份側表沒有跟現在算出來的結果脫節 —— 不然新增題目造成的新等價組
// 會靜靜地不去重，而症狀是「同一局出現兩題一樣的」，很難被聯想到這裡。
if (ciMode) {
  const expected = Object.keys(equivalence).sort();
  let actual = [];
  try {
    const sidecar = fs.readFileSync(path.join(__dirname, "..", "src", "kernel", "equivalence.js"), "utf8");
    actual = [...sidecar.matchAll(/^\s{4}"([^"]+)":/gm)].map((m) => m[1]).sort();
  } catch (_error) {
    actual = [];
  }
  if (expected.join(",") !== actual.join(",")) {
    console.error("\nsrc/kernel/equivalence.js 與現在算出來的等價組不一致。");
    console.error(`  側表 ${actual.length} 題 / 現在 ${expected.length} 題`);
    console.error("  跑這個更新：node tools/detect_duplicates.js --write-equivalence");
    console.error("  新出現的組請先看過再寫入 —— 誤判要加進產生器裡的 NOT_EQUIVALENT。");
    process.exit(1);
  }
  console.log(`\n語意重複 ${semanticGroups.length} 組已複核（${excluded} 組判定為誤判），等價側表 ${expected.length} 題`);
}
