// 驗算器自己也要被驗（2026-09-25）。
//
// verify_answers 每天跑的是「題庫裡的答案對不對」，它只會在答案錯的時候紅。
// 但驗算路徑本身可能壞得很安靜：ω(δ) 的門檻調鬆一點、掃描範圍寫錯一個數量級，
// 結果是**每一題都通過**，包括錯的那些。分析學包補的六條路徑尤其危險，
// 因為它們判的是「是非」與「上確界」這種沒有封閉式可以對照的東西。
//
// 所以這支從兩邊夾：
//   正向 —— 已知答案的 spec 算出來要對（掃描、二分、外插都真的跑一遍）
//   反向 —— 故意給錯的答案要被判 mismatch，故意給錯的宣稱要被抓出來
// 反向那一半才是重點：一個永遠說 ok 的驗算器比沒有驗算器更危險。
//
// 踩過的坑寫在案例裡：spec 的 0.0000001 經過 String() 是 "1e-7"，
// 而 LaTeX 的 e 是尤拉數 —— 那串會被讀成 1·e−7 = −4.28。

"use strict";

const { EXPLICIT_METHODS, verifyProblem } = require("./lib/verify_engine.js");

const failures = [];
const fail = (message) => failures.push(message);
const close = (a, b) => Number.isFinite(a) && Math.abs(a - b) <= 1e-5 * Math.max(1, Math.abs(b));

/* ── 一、正向：已知的值要算得出來 ────────────────────────────── */

const VALUE_CASES = [
  ["階梯函數的積分（跳躍點要宣告）", { m: "integral", f: "2\\lfloor 2x \\rfloor+1", a: 0, b: 1, breaks: [0.5] }, 2],
  ["lim∫fₙ（先積分再取極限）", { m: "integralLimit", f: "n x e^{-n x^2}", a: 0, b: 1 }, 0.5],
  ["Lᵖ 範數", { m: "lpNorm", f: "x", a: 0, b: 1, p: 2 }, 1 / Math.sqrt(3)],
  ["泰勒多項式的值", { m: "taylorValue", f: "e^x", a: 0, n: 3, at: 1 }, 8 / 3],
  ["泰勒多項式（展開點不是 0）", { m: "taylorValue", f: "\\ln x", a: 1, n: 2, at: 1.2, r: 0.3 }, 0.18],
  ["實際誤差（一點）", { m: "taylorError", f: "e^x", a: 0, n: 2, at: 1 }, Math.E - 2.5],
  ["實際誤差（整段的最大值）", { m: "taylorError", f: "e^x", a: 0, n: 2, range: [-0.5, 0.5] }, Math.exp(0.5) - 13 / 8],
  ["拉格朗日餘項上界", { m: "lagrangeBound", f: "e^x", a: 0, n: 2, at: 1 }, Math.E / 6],
  ["餘項上界（M 不在端點取到 1）", { m: "lagrangeBound", f: "\\sin x", a: 0, n: 3, at: 1 }, Math.sin(1) / 24],
  ["要展到幾階（九階才夠，取樣半徑要跟著代入點走）", { m: "taylorTerms", f: "\\sin x", a: 0, range: [0, 1], eps: 0.000001 }, 9],
  ["梯形法（權重 ½,1,1,1,½）", { m: "riemannRule", f: "x^2", a: 0, b: 1, n: 4, rule: "trapezoid" }, 11 / 32],
  ["中點法", { m: "riemannRule", f: "x^2", a: 0, b: 1, n: 4, rule: "mid" }, 21 / 64],
  ["左端點和", { m: "riemannRule", f: "x^2", a: 0, b: 2, n: 4, rule: "left" }, 7 / 4],
  ["右端點和", { m: "riemannRule", f: "x^2", a: 0, b: 2, n: 4, rule: "right" }, 15 / 4],
  ["辛普森法對三次多項式是精確的", { m: "riemannRule", f: "x^3", a: 0, b: 2, n: 4, rule: "simpson" }, 4],
  ["上確界取不到（掃描掃不到，要靠極限）", { m: "extremeOf", f: "1-1/n", kind: "sup" }, 1],
  ["下確界被取到", { m: "extremeOf", f: "(-1)^n*(1+1/n)", kind: "inf" }, -2],
  ["上確界在中間（不在趨近的那一端）", { m: "extremeOf", f: "n/2^n", kind: "sup" }, 0.5],
  ["連續參數的下確界", { m: "extremeOf", f: "x+1/x", kind: "inf", integer: false, range: [0.001, 1000] }, 2],
  ["上極限（收斂的兩支子列）", { m: "limsup", f: "(-1)^n*n/(n+1)", kind: "limsup" }, 1],
  ["下極限", { m: "limsup", f: "(-1)^n+1/n", kind: "liminf" }, -1],
  ["上極限（等分布，外插沒意義要退回窗口）", { m: "limsup", f: "\\sin n", kind: "limsup" }, 1],
  ["ε-N 的第一個 N", { m: "firstIndex", f: "|(2n+1)/(n+3)-2|", below: 0.01 }, 498],
  ["ε-N（指數衰減）", { m: "firstIndex", f: "n/2^n", below: 0.001 }, 14],
  ["ε-δ 的最大 δ（左右不對稱）", { m: "maxDelta", f: "1/x", at: 2, L: 0.5, eps: 0.1 }, 1 / 3],
  ["ε-δ（右邊比較窄）", { m: "maxDelta", f: "\\sqrt{x}", at: 4, L: 2, eps: 0.01 }, 0.0399],
  ["Lipschitz 常數 = sup|f′|", { m: "lipschitz", f: "x/(1+x^2)", range: [-50, 50] }, 1],
  ["Lipschitz（端點取到）", { m: "lipschitz", f: "\\sqrt{x}", range: [1, 10000] }, 0.5],
  ["sup 範數", { m: "extremeOf", f: "5x/(1+25x^2)", kind: "sup", integer: false, range: [0, 1] }, 0.5]
];

VALUE_CASES.forEach(([name, spec, expected]) => {
  let value;
  try {
    value = EXPLICIT_METHODS[spec.m](spec);
  } catch (error) {
    fail(`${name}：算不出來（${error.message}）`);
    return;
  }
  if (!close(value, expected)) fail(`${name}：算出 ${value}，應該是 ${expected}`);
});

/* ── 二、正向：是非題的兩個方向都要判對 ─────────────────────── */

const CLAIM_CASES = [
  ["Σ1/n² 收斂", { m: "seriesConverges", f: "1/n^2", from: 1 }, true],
  ["Σ1/n 發散", { m: "seriesConverges", f: "1/n", from: 1 }, false],
  ["交錯調和收斂", { m: "seriesConverges", f: "(-1)^(n+1)/n", from: 1 }, true],
  ["交錯調和取絕對值後發散", { m: "seriesConverges", f: "(-1)^(n+1)/n", from: 1, absolute: true }, false],
  ["凹向上時梯形法高估", { m: "ruleBias", f: "1/x", a: 1, b: 2, n: 4, rule: "trapezoid" }, true],
  ["凹向上時中點法低估", { m: "ruleBias", f: "1/x", a: 1, b: 2, n: 4, rule: "mid" }, false],
  ["遞增函數的左端點和低估", { m: "ruleBias", f: "x^2", a: 0, b: 1, n: 4, rule: "left" }, false],
  ["凹向下時梯形法低估", { m: "ruleBias", f: "x^(1/2)", a: 1, b: 4, n: 6, rule: "trapezoid" }, false],
  ["1/x 在 (0,1] 不一致連續", { m: "uniformContinuity", f: "1/x", range: [0.0000001, 1], log: true }, false],
  ["√x 在 [0,∞) 一致連續", { m: "uniformContinuity", f: "\\sqrt{x}", range: [0, "inf"] }, true],
  ["x² 在有界閉區間上一致連續", { m: "uniformContinuity", f: "x^2", range: [0, 3] }, true],
  ["x² 在 [0,∞) 不一致連續", { m: "uniformContinuity", f: "x^2", range: [0, "inf"] }, false],
  ["sin(x²) 有界但不一致連續", { m: "uniformContinuity", f: "\\sin(x^2)", range: [0, "inf"] }, false],
  ["x sin(1/x) 在 (0,1] 一致連續", { m: "uniformContinuity", f: "x\\sin(1/x)", range: [0.0000001, 1], log: true }, true],
  ["ln x 在 (0,1] 不一致連續", { m: "uniformContinuity", f: "\\ln x", range: [0.0000001, 1], log: true }, false],
  ["xⁿ 在 [0,1) 不一致收斂", { m: "uniformConvergence", f: "x^n", limit: "0", range: [0, 0.999999] }, false],
  ["xⁿ 在 [0,1/2] 一致收斂", { m: "uniformConvergence", f: "x^n", limit: "0", range: [0, 0.5] }, true],
  ["nxe^{-nx²} 不一致收斂", { m: "uniformConvergence", f: "n x e^{-n x^2}", limit: "0", range: [0, 1] }, false]
];

CLAIM_CASES.forEach(([name, spec, expected]) => {
  let claim;
  try {
    claim = EXPLICIT_METHODS[spec.m](spec).__claim;
  } catch (error) {
    fail(`${name}：判不出來（${error.message}）`);
    return;
  }
  if (claim !== expected) fail(`${name}：判成 ${claim}，應該是 ${expected}`);
});

/* ── 三、反向：錯的答案一定要被抓到 ─────────────────────────── */
// 這一段是這支驗證器存在的理由。前兩段全綠只證明「對的會過」，
// 證明不了「錯的會被擋」——而後者才是 CI 真正在防的事。

const numericProblem = (answer, verify) => ({
  id: "probe", topic: "limits", rank: 4, difficulty: 4, answerKind: "numeric",
  prompt: "\\text{驗算器自測}", answer, verify
});

const WRONG_CASES = [
  ["階梯函數的積分寫錯一塊的高", numericProblem("1.9", { m: "integral", f: "2\\lfloor 2x \\rfloor+1", a: 0, b: 1, breaks: [0.5] })],
  ["把 lim∫ 當成 ∫lim（那是 0）", numericProblem("0", { m: "integralLimit", f: "n x e^{-n x^2}", a: 0, b: 1 })],
  ["Lᵖ 忘了開 p 次方", numericProblem("0.3333333333", { m: "lpNorm", f: "x", a: 0, b: 1, p: 2 })],
  ["把餘項上界當成實際誤差", numericProblem("0.2182818284590451", { m: "lagrangeBound", f: "e^x", a: 0, n: 2, at: 1 })],
  ["餘項的階乘寫成 n! 而不是 (n+1)!", numericProblem("1.359140914295092", { m: "lagrangeBound", f: "e^x", a: 0, n: 2, at: 1 })],
  ["要展到幾階少算一階", numericProblem("5", { m: "taylorTerms", f: "e^x", a: 0, range: [0, 1], eps: 0.001 })],
  ["把梯形法的端點權重也算成 1", numericProblem("3/8", { m: "riemannRule", f: "x^2", a: 0, b: 1, n: 4, rule: "trapezoid" })],
  ["辛普森法的 4-2-4 權重記成 1-1-1", numericProblem("5", { m: "riemannRule", f: "x^3", a: 0, b: 2, n: 4, rule: "simpson" })],
  // sup 寫成 inf 是這一節最常見的錯（1−1/n 的下確界才是 0）。
  // 沒寫「0.99999 當成 1」那種案例：預設容差是相對 1e-5，那個差距本來就在容差內 ——
  // 這支要擋的是判定錯誤，不是浮點精度。
  ["上確界寫成下確界", numericProblem("0", { m: "extremeOf", f: "1-1/n", kind: "sup" })],
  ["上極限寫成極限（極限根本不存在）", numericProblem("0", { m: "limsup", f: "(-1)^n*n/(n+1)", kind: "limsup" })],
  ["ε-N 差一（最常見的錯）", numericProblem("497", { m: "firstIndex", f: "|(2n+1)/(n+3)-2|", below: 0.01 })],
  ["ε-δ 取成大的那一邊", numericProblem("0.5", { m: "maxDelta", f: "1/x", at: 2, L: 0.5, eps: 0.1 })],
  ["ε-δ 直接把 ε 當 δ", numericProblem("0.01", { m: "maxDelta", f: "\\sqrt{x}", at: 4, L: 2, eps: 0.01 })],
  ["Lipschitz 常數寫成函數的最大值", numericProblem("0.5", { m: "lipschitz", f: "x/(1+x^2)", range: [-50, 50] })]
];

WRONG_CASES.forEach(([name, problem]) => {
  const result = verifyProblem(problem, { normalizeAnswer: (value) => String(value) });
  if (result.status !== "mismatch") {
    fail(`${name}：驗算器回了 ${result.status}（${result.detail || result.reason || ""}）—— 錯的答案應該是 mismatch`);
  }
});

const textProblem = (canonical, verify) => ({
  id: "probe-text", topic: "derivatives", rank: 4, difficulty: 4, answerKind: "text",
  prompt: "\\text{驗算器自測}", answers: [canonical], canonical, verify
});

const WRONG_CLAIMS = [
  // 「不一致收斂」裡有「收斂」兩個字：比對器必須先看關鍵詞再看否定詞，
  // 順序反了這一條會綠（實際踩過，兩題一致收斂被判反）。
  ["把 xⁿ 在 [0,1) 說成收斂到 0（一致）", textProblem("一致收斂", { m: "uniformConvergence", f: "x^n", limit: "0", range: [0, 0.999999] })],
  ["把 Σ1/n 說成收斂", textProblem("收斂", { m: "seriesConverges", f: "1/n", from: 1 })],
  ["把交錯調和的絕對值說成收斂", textProblem("收斂", { m: "seriesConverges", f: "(-1)^(n+1)/n", from: 1, absolute: true })],
  ["把梯形法對凹向上說成低估", textProblem("低估", { m: "ruleBias", f: "1/x", a: 1, b: 2, n: 4, rule: "trapezoid" })],
  ["把 1/x 在 (0,1] 說成一致連續", textProblem("一致連續", { m: "uniformContinuity", f: "1/x", range: [0.0000001, 1], log: true })],
  ["把 √x 在 [0,∞) 說成不一致連續", textProblem("不一致連續", { m: "uniformContinuity", f: "\\sqrt{x}", range: [0, "inf"] })],
  ["把 xⁿ 在 [0,1) 說成一致收斂", textProblem("一致收斂", { m: "uniformConvergence", f: "x^n", limit: "0", range: [0, 0.999999] })]
];

WRONG_CLAIMS.forEach(([name, problem]) => {
  const result = verifyProblem(problem, { normalizeAnswer: (value) => String(value) });
  if (result.status !== "mismatch") {
    fail(`${name}：驗算器回了 ${result.status}（${result.detail || result.reason || ""}）—— 說反了應該是 mismatch`);
  }
});

/* ── 四、坑：spec 裡的小數不能被當成 LaTeX 讀 ───────────────── */
// String(0.0000001) === "1e-7"，LaTeX 的 e 是尤拉數 —— 少了 constant()
// 這一行會讀成 1·e−7 = −4.28，掃描下界變負的，ln x 的判定會反過來。
{
  const withNumber = EXPLICIT_METHODS.uniformContinuity({ m: "uniformContinuity", f: "\\ln x", range: [0.0000001, 1], log: true });
  const withString = EXPLICIT_METHODS.uniformContinuity({ m: "uniformContinuity", f: "\\ln x", range: ["0.0000001", "1"], log: true });
  if (withNumber.__claim !== false || withString.__claim !== false) {
    fail(`小數下界被當成 LaTeX 讀了：數字版 ${withNumber.__claim}、字串版 ${withString.__claim}，兩個都應該是 false`);
  }
}

console.log("驗算路徑自測");
console.log(`  已知值      ${VALUE_CASES.length} 條`);
console.log(`  是非判定    ${CLAIM_CASES.length} 條`);
console.log(`  故意寫錯    ${WRONG_CASES.length + WRONG_CLAIMS.length} 條（要被判 mismatch）`);

if (failures.length) {
  console.error(`\n驗算路徑自測失敗（${failures.length}）：`);
  failures.forEach((message) => console.error("  " + message));
  process.exit(1);
}

console.log("\nverify paths OK");
