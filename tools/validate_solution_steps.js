// 逐步解答（solutionSteps）的驗證器
//
// 「完整推導」那一格照步驟列出來時，使用者是一步一步對著自己的算式看的。
// 答案對、中間某一步寫錯，比沒有步驟更糟 —— 他會以為是自己錯。
// 所以側表 src/problem_solution_steps.js 的步驟不只要「看起來合理」：
// 帶驗算宣稱的每一步都在取樣點上重算一次（tools/lib/step_claims.js），
// 最後一步必須接回題目答案。
//
// 檢查：
//   1. 側表的每個 id 都在題庫裡，而且那題沒有自己寫的 solutionSteps（否則側表是死碼）
//   2. 至少兩步、每步是不含 LaTeX 指令的純文字（畫面上用 escapeHtml 印，\frac 會原樣露出來）
//   3. 每一條宣稱都算得出來而且成立（算不出來也算失敗 —— 換一個驗得了的寫法）
//   4. 數值／運算式／不定積分題：最後一步要有一條拿 ANS 比的宣稱
//      是非題（text）：最後一步的文字要說出答案
//   5. 題庫裡所有 solutionSteps（含題包內嵌的）都過 validate_problems 那一層的形狀檢查
//
// 用法：
//   node tools/validate_solution_steps.js                 驗側表（CI）
//   node tools/validate_solution_steps.js --file x.js     驗一份草稿（module.exports = { id: steps }）
//   node tools/validate_solution_steps.js --verbose       連通過的宣稱一起印

"use strict";

const path = require("path");
const loadAppApi = require("./lib/app_api.js");
const { checkClaim, claimsOf } = require("./lib/step_claims.js");

const args = process.argv.slice(2);
const fileArg = args.includes("--file") ? args[args.indexOf("--file") + 1] : null;
const verbose = args.includes("--verbose");

const api = loadAppApi();
const problems = loadAppApi.allProblems();
const byId = new Map(problems.map((p) => [p.id, p]));
// 草稿模式：題目身上可能已經被正式側表併過步驟，那不算「本來就有」
const inlineIds = new Set(problems.filter((p) => Array.isArray(p.solutionSteps) && !(global.window.BUZZ_SOLUTION_STEP_TABLE || {})[p.id]).map((p) => p.id));

const table = fileArg
  ? require(path.resolve(fileArg))
  : global.window.BUZZ_SOLUTION_STEP_TABLE;
if (!table || typeof table !== "object") {
  console.error("找不到逐步解答側表（window.BUZZ_SOLUTION_STEP_TABLE）—— index.html 有沒有列 src/problem_solution_steps.js？");
  process.exit(1);
}

const failures = [];
const fail = (id, message) => failures.push(`${id}: ${message}`);

const COMPUTABLE = new Set(["numeric", "expression", "antiderivative"]);
let claimCount = 0;
let checkedSteps = 0;
let stepCount = 0;

Object.entries(table).forEach(([id, steps]) => {
  const problem = byId.get(id);
  if (!problem) {
    fail(id, "題庫裡沒有這一題");
    return;
  }
  if (fileArg ? inlineIds.has(id) : (global.window.BUZZ_SOLUTION_STEPS_SKIPPED || []).includes(id)) {
    fail(id, "題目本身已經有 solutionSteps，側表這一筆永遠不會生效");
  }
  if (!Array.isArray(steps) || steps.length < 2) {
    fail(id, "至少要兩步");
    return;
  }
  // 答案是「極限不存在」的題（answer: dne）沒有數可以比，改成要求最後一步說出「不存在」
  const dne = /^\s*dne\s*$/i.test(String(problem.answer || ""));
  const computable = COMPUTABLE.has(problem.answerKind) && !dne;
  const answer = computable ? problem.answer : null;
  let lastHasAnswerClaim = false;
  steps.forEach((step, index) => {
    const text = Array.isArray(step) ? step[0] : step;
    const check = Array.isArray(step) ? step[1] : null;
    stepCount += 1;
    if (typeof text !== "string" || text.trim().length < 4) {
      fail(id, `第 ${index + 1} 步不是有內容的文字`);
      return;
    }
    if (/\\[A-Za-z]|\$/.test(text)) fail(id, `第 ${index + 1} 步含 LaTeX 指令或 $（畫面上是純文字）：${text}`);
    if (Array.isArray(step) && (step.length !== 2 || typeof check !== "string" || !check.trim())) {
      fail(id, `第 ${index + 1} 步的格式要是 [文字, 宣稱]`);
      return;
    }
    if (!check) return;
    checkedSteps += 1;
    claimsOf(check).forEach((claim) => {
      claimCount += 1;
      if (/(^|[^A-Za-z0-9_])ANS([^A-Za-z0-9_]|$)/.test(claim) && index === steps.length - 1) lastHasAnswerClaim = true;
      const result = checkClaim(claim, {
        normalize: api.normalizeExpression,
        answer,
        // 題目自己的變數（lec 的 a、t）也可以出現在宣稱裡
        variable: problem.variable
      });
      if (!result.ok) fail(id, `第 ${index + 1} 步的宣稱「${claim}」${result.reason}`);
      else if (verbose) console.log(`  ok ${id} #${index + 1}  ${claim}`);
    });
  });
  if (computable && !lastHasAnswerClaim) {
    fail(id, "最後一步要有一條跟 ANS 比對的宣稱（步驟必須接回答案）");
  }
  if (dne && !/不存在/.test(String(Array.isArray(steps[steps.length - 1]) ? steps[steps.length - 1][0] : steps[steps.length - 1]))) {
    fail(id, "答案是 dne：最後一步要說出「不存在」");
  }
  if (problem.answerKind === "text") {
    const lastText = String(Array.isArray(steps[steps.length - 1]) ? steps[steps.length - 1][0] : steps[steps.length - 1]);
    const accepted = [problem.canonical, ...(problem.answers || [])].filter(Boolean).map(String);
    const said = accepted.some((word) => lastText.toLowerCase().includes(word.toLowerCase()));
    if (!said) fail(id, `是非題的最後一步要說出答案（${accepted.join(" / ")}）`);
  }
});

// 題庫裡所有題目（含題包內嵌、模板產生的）的步驟形狀
problems.forEach((problem) => {
  if (problem.solutionSteps === undefined) return;
  const steps = problem.solutionSteps;
  if (!Array.isArray(steps) || steps.length < 2 || steps.some((s) => typeof s !== "string" || s.trim().length < 4)) {
    fail(problem.id, "solutionSteps 要是至少兩步的文字陣列");
  }
});

// 求值器自測：一個「什麼都放行」的驗算器跟沒有驗算器一樣，而且更危險（大家以為有人在看）。
// 每一條都是寫步驟時真的會犯的錯：少一個鏈鎖係數、分部積分掉負號、泰勒係數算錯、
// 把 2pi 寫成字母相乘、不定積分差的不是常數。
const SELF_TEST = [
  ["D(sin(3x)) == cos(3x)", false],
  ["D(sin(3x)) == 3cos(3x)", true],
  ["x*sin(x)+cos(x) ~= -x*cos(x)+sin(x)", false],
  ["D(x*sin(x)+cos(x)) == x*cos(x)", true],
  ["LIM((e^x-cos(x)-sin(x)-x^2)/x^3, 0) == 1/6", false],
  ["LIM((3x^2-x+7)/(2x^2+5), inf) == 3/2", true],
  ["INT(x^2, 0, 1) == 1/2", false],
  ["SUM(1/n^2, 1) == pi^2/6", true],
  ["2pi == 2*pi", false],
  ["x^2 ~= x^2+5", true],
  ["x^2 ~= x^2+x", false],
  // 2026-10-08：收斂到 0 的慢衰減在 ∞ 曾被外插成 1（numeric.limit 的外插落到序列走過的那一側），錯的宣稱因此過關
  ["LIM(0.99^n, inf) == 1", false],
  ["LIM(0.99^n, inf) == 0", true],
  ["LIM(x^2/e^x, inf) == 0", true]
];
SELF_TEST.forEach(([claim, expected]) => {
  const result = checkClaim(claim, { normalize: api.normalizeExpression, answer: null });
  if (result.ok !== expected) fail("自測", `「${claim}」應該${expected ? "成立" : "被擋下"}，結果${result.ok ? "成立" : "被擋下"}`);
});

const covered = problems.filter((p) => Array.isArray(p.solutionSteps) && p.solutionSteps.length >= 2).length;
console.log("逐步解答側表");
console.log(`  側表題數    ${Object.keys(table).length}${fileArg ? `（草稿 ${fileArg}）` : ""}`);
console.log(`  步數        ${stepCount}（帶驗算宣稱 ${checkedSteps} 步、宣稱 ${claimCount} 條）`);
if (!fileArg) console.log(`  題庫覆蓋    ${covered} / ${problems.length} 題有逐步解答`);

if (failures.length) {
  console.error(`\n${failures.length} 個問題：`);
  failures.forEach((line) => console.error("  " + line));
  process.exit(1);
}
console.log("\nsolution steps OK");
