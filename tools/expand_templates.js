// 模板展開：tools/content/templates.js → src/problem_generated_pack.js
//
// 為什麼要有這條管線：題庫裡有一整類題目「練的是動作不是洞察」——
// ∫3x²dx 和 ∫5x⁴dx 要練的是同一件事。手寫十題只是十次複製貼上，
// 而複製貼上正是錯字與錯答案的來源（題庫裡的 \sin 少一個反斜線就是這樣來的）。
//
// 但自動產生題目有一個很明顯的風險：**量一大，人就不會去檢查**。
// 所以這支的核心規則是：
//
//     每一題展開之後都要先通過數值驗算，才准寫進輸出檔。
//     驗不過的不寫，而且大聲報出來。
//
// 這條規則讓「一個模板生一百題」變成可以接受的事 ——
// 人檢查不了一百題，機器可以。
//
// 用法：
//   node tools/expand_templates.js            展開並寫檔
//   node tools/expand_templates.js --check    只檢查，不寫（CI 用）

"use strict";

const fs = require("fs");
const path = require("path");
const loadAppApi = require("./lib/app_api.js");
const { verifyProblem } = require("./lib/verify_engine.js");

const checkOnly = process.argv.includes("--check");
const templates = require("./content/templates.js");
const api = loadAppApi();

const OUTPUT = path.join(__dirname, "..", "src", "problem_generated_pack.js");

/* ── 代入參數 ─────────────────────────────────────────────── */

function fill(text, params) {
  return String(text).replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (match, name) => {
    if (!(name in params)) return match;
    return String(params[name]);
  });
}

function expand(template) {
  return template.params.map((params, index) => {
    const suffix = String(index + 1).padStart(3, "0");
    const problem = {
      id: `${template.id}-${suffix}`,
      topic: template.topic,
      rank: template.rank,
      difficulty: Math.min(4, template.rank),
      source: "Buzz 模板變體",
      prompt: fill(template.prompt, params),
      answerKind: template.answerKind,
      answer: fill(template.answer, params),
      timeLimit: template.timeLimit,
      tabLimit: 1,
      solution: fill(template.solution, params),
      hints: (template.hints || []).map((hint) => fill(hint, params)),
      tags: template.tags.slice(),
      // 變體指回母模板。使用者連錯兩題同一個模板出來的變體時，
      // 那是同一個弱點，不是兩個 —— 能力模型要看得到這件事。
      variantOf: template.id
    };
    // 解題步驟跟著參數一起展開。模板寫一次，三十幾題都有 ——
    // 這是模板管線除了「不會打錯字」之外的第二個好處。
    if (template.steps) problem.solutionSteps = template.steps.map((step) => fill(step, params));
    if (template.variable) problem.variable = template.variable;
    problem.tags.push(`rank-${template.rank}`);
    if (template.rank <= 2) problem.tags.push("beginner-friendly");
    if (template.rank >= 5) problem.tags.push("boss-rank");
    return problem;
  });
}

/* ── 展開 + 逐題驗算 ──────────────────────────────────────── */

const accepted = [];
const rejected = [];
const skipped = [];

// 展開結果如果跟題庫既有的題一模一樣，就不要生。
// 模板本身沒錯，只是那組參數剛好撞到一題已經有人手寫過的題目。
// 這件事必須由管線自己處理 —— 模板越多、參數越多，撞車只會越常發生，
// 靠人事後發現不是辦法。
function literalKey(prompt) {
  return String(prompt)
    .replace(/\\left|\\right|\\displaystyle|\\,|\\;|\\!|\\quad|\\qquad|\s/g, "")
    .replace(/\\dfrac|\\tfrac/g, "\\frac")
    .replace(/\{([a-zA-Z0-9])\}/g, "$1");
}
const existingKeys = new Set(
  loadAppApi.allProblems()
    .filter((problem) => !/^tmpl-/.test(problem.id))
    .map((problem) => literalKey(problem.prompt))
);

templates.forEach((template) => {
  expand(template).forEach((problem) => {
    if (existingKeys.has(literalKey(problem.prompt))) {
      skipped.push(problem);
      return;
    }
    let result;
    try {
      result = verifyProblem(problem, { normalizeAnswer: api.normalizeExpression });
    } catch (error) {
      result = { status: "error", reason: error.message };
    }
    if (result.status === "ok") {
      accepted.push({ problem, method: result.method });
      return;
    }
    rejected.push({ problem, result });
  });
});

/* ── 報告 ─────────────────────────────────────────────────── */

console.log("模板展開");
console.log(`  模板        ${templates.length} 個`);
console.log(`  展開        ${accepted.length + rejected.length} 題`);
console.log(`  驗算通過    ${accepted.length}`);
console.log(`  驗算不過    ${rejected.length}`);
console.log(`  跳過（題庫已有一模一樣的題）  ${skipped.length}`);
skipped.forEach((problem) => console.log(`    ${problem.prompt}`));

if (rejected.length) {
  console.error("\n以下展開結果沒有通過數值驗算，不會寫進題庫：");
  rejected.forEach(({ problem, result }) => {
    console.error(`  ${problem.id}  [${result.status}]  ${result.detail || result.reason}`);
    console.error(`    ${problem.prompt}   答案 ${problem.answer}`);
  });
  console.error("\n模板本身有問題，改模板而不是改門檻。");
  process.exit(1);
}

if (checkOnly) {
  // 檢查模式還要確認磁碟上的檔案跟現在展開的結果一致，
  // 否則有人改了模板卻忘記重新產生，上線的會是舊的那份。
  const current = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, "utf8") : "";
  if (current !== render(accepted)) {
    console.error("\nsrc/problem_generated_pack.js 與模板不同步 —— 請跑 node tools/expand_templates.js");
    process.exit(1);
  }
  console.log("\ntemplates OK");
  process.exit(0);
}

fs.writeFileSync(OUTPUT, render(accepted), "utf8");
console.log(`\n寫出 ${path.relative(path.join(__dirname, ".."), OUTPUT)}（${accepted.length} 題）`);

const byMethod = {};
accepted.forEach(({ method }) => { byMethod[method] = (byMethod[method] || 0) + 1; });
Object.entries(byMethod).forEach(([method, n]) => console.log(`  ${method.padEnd(22)}${n}`));

/* ── 產生輸出檔 ───────────────────────────────────────────── */

function render(list) {
  const body = list
    .map(({ problem }) => "    " + JSON.stringify(problem, null, 2).split("\n").join("\n    "))
    .join(",\n");
  return `// 自動產生 —— 不要手改。來源：tools/expand_templates.js
//
// 模板變體。母模板在 tools/content/templates.js，那裡才是要編輯的地方。
//
// 這一包的每一題在寫進來之前都通過了 tools/lib/verify_engine.js 的
// 獨立數值驗算 —— 這是自動產生題目可以被接受的唯一理由。
// 人檢查不了幾十題自動產生的東西，機器可以，而且每次重新產生都會再檢查一次。
//
// variantOf 指回母模板：同一個模板出來的變體練的是同一件事，
// 連錯兩題是同一個弱點，不是兩個。
//
// 重新產生：node tools/expand_templates.js

(function () {
  "use strict";

  const problems = [
${body}
  ];

  window.BUZZ_GENERATED_PROBLEMS = problems;
  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
`;
}
