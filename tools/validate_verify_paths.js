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
  ["sup 範數", { m: "extremeOf", f: "5x/(1+25x^2)", kind: "sup", integer: false, range: [0, 1] }, 0.5],
  ["散度（三維）", { m: "fieldOp", op: "div", F: ["x^2", "y^2", "z^2"], at: [1, 2, 3] }, 12],
  ["散度（乘上純量場 f）", { m: "fieldOp", op: "div", scale: "y", F: ["x", "x", "z"], at: [2, 5, 1] }, 12],
  ["旋度（二維純量）", { m: "fieldOp", op: "curl", F: ["-y", "x"], at: [0.3, 0.7] }, 2],
  ["旋度的長度（三維）", { m: "fieldOp", op: "curl", F: ["-y^2", "x^2", "0"], at: [1, 2, 0] }, 6],
  ["保守場求參數（二維）", { m: "conservativeParam", F: ["a x y^2", "3x^2y"], param: "a" }, 3],
  ["保守場求參數（三維）", { m: "conservativeParam", F: ["yz", "a xz", "xy"], param: "a" }, 1],
  ["let：先解 θ 再代回 r", { m: "let", f: "3\\cos t", with: { t: { m: "root", f: "3\\cos x-(1+\\cos x)", x0: 1 } } }, 1.5],
  ["stationary：鞍點的值（梯度下降找不到的那種）", { m: "stationary", vars: ["x", "y"], f: "x^2-2xy+2y", x0: [2, 0.5] }, 1],
  ["stationary：回傳座標", { m: "stationary", vars: ["x", "y"], f: "x^3+y^3-3xy", x0: [0.8, 1.3], out: "y" }, 1],
  ["rootCount：eˣ = 3x 有兩個根", { m: "rootCount", f: "e^x-3x", range: [-20, 20] }, 2],
  ["rootCount：sin x = x/10（含 0 與對稱的根）", { m: "rootCount", f: "\\sin x-\\frac{x}{10}", range: [-12, 12] }, 7],
  ["rootCount：網格剛好踩在根上只算一次", { m: "rootCount", f: "x^2-1", range: [-2, 2], steps: 400 }, 2]
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
  ["nxe^{-nx²} 不一致收斂", { m: "uniformConvergence", f: "n x e^{-n x^2}", limit: "0", range: [0, 1] }, false],
  ["∫₁^∞ 1/x² 收斂", { m: "improperConverges", f: "\\frac{1}{x^2}", a: 1, b: "inf" }, true],
  ["∫₁^∞ 1/x 發散（十倍尺度比值恰好是 1）", { m: "improperConverges", f: "\\frac{1}{x}", a: 1, b: "inf" }, false],
  ["∫₁^∞ x^{-1.05} 收斂（p 很接近 1）", { m: "improperConverges", f: "x^{-1.05}", a: 1, b: "inf" }, true],
  ["∫₁^∞ x^{-0.95} 發散", { m: "improperConverges", f: "x^{-0.95}", a: 1, b: "inf" }, false],
  ["∫₁^∞ (2+cos x)/x 發散（振盪的被積函數）", { m: "improperConverges", f: "\\frac{2+\\cos x}{x}", a: 1, b: "inf" }, false],
  ["∫₀¹ eˣ/√x 收斂（端點奇異）", { m: "improperConverges", f: "\\frac{e^x}{\\sqrt x}", a: 0, b: 1, sing: [0] }, true],
  ["∫₋₁¹ 1/x² 發散（內部奇異點）", { m: "improperConverges", f: "\\frac{1}{x^2}", a: -1, b: 1, sing: [0] }, false],
  ["∫₋₁¹ x^{-2/3} 收斂（內部奇異點）", { m: "improperConverges", f: "\\frac{1}{(x^2)^{1/3}}", a: -1, b: 1, sing: [0] }, true]
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
  ["Lipschitz 常數寫成函數的最大值", numericProblem("0.5", { m: "lipschitz", f: "x/(1+x^2)", range: [-50, 50] })],
  ["∇·(fF) 漏掉 ∇f·F 那一項（只算 f∇·F）", numericProblem("0", { m: "fieldOp", op: "div", scale: "x", F: ["y", "z", "x"], at: [1, 2, 3] })],
  ["旋度的 Q_x − P_y 減反了", numericProblem("-6", { m: "fieldOp", op: "curl", F: ["-y^2", "x^2"], at: [1, 2] })],
  ["保守場參數：∂P/∂y 少了 y² 微分出來的 2", numericProblem("6", { m: "conservativeParam", F: ["a x y^2", "3x^2y"], param: "a" })],
  ["let：把交點的 θ（π/3）當成 r", numericProblem("1.0471975511965976", { m: "let", f: "3\\cos t", with: { t: { m: "root", f: "3\\cos x-(1+\\cos x)", x0: 1 } } })],
  ["stationary：鞍點的值寫成角落的值", numericProblem("0", { m: "stationary", vars: ["x", "y"], f: "x^2-2xy+2y", x0: [2, 0.5] })],
  ["rootCount：sin x = x/10 只數了正根", numericProblem("3", { m: "rootCount", f: "\\sin x-\\frac{x}{10}", range: [-12, 12] })],
  ["rootCount：x⁵ − 5x + 1 只看到一個根", numericProblem("1", { m: "rootCount", f: "x^5-5x+1", range: [-10, 10] })]
];

// 實根個數：切點（重根）不變號，掃描會少數一個 —— 要丟錯，不能回一個少一的數
{
  let threw = false;
  try { EXPLICIT_METHODS.rootCount({ m: "rootCount", f: "e^x-ex", range: [-5, 5] }); } catch (_error) { threw = true; }
  if (!threw) fail("rootCount：eˣ = ex 在 x=1 相切（重根），卻沒有丟錯");
}

// 保守場求參數：沒有任何常數能讓旋度處處為零時要回 NaN（交給上層判 unverified），
// 不能硬挑一個「最接近」的值當答案。
{
  const none = EXPLICIT_METHODS.conservativeParam({ m: "conservativeParam", F: ["y", "a x+x^2"], param: "a" });
  if (!Number.isNaN(none)) fail(`保守場求參數：⟨y, ax+x²⟩ 沒有解，卻算出 ${none}`);
}

// 答案是函數（fn）與收斂區間（convergence）：講次隨堂包補的兩條路徑。
// 答案字串直接給 JS（** 不是 ^ —— ^ 在 JS 是 XOR）。
const fnProblem = (answer, verify, kind = "expression") => ({
  id: "probe-fn", topic: "derivatives", rank: 3, difficulty: 3, answerKind: kind,
  prompt: "\\text{驗算器自測}", answer, verify
});
const TANGENT_AT_4 = [
  { at: { x: 0 }, v: { m: "tangentNormal", f: "\\sqrt{x}", a: 4, kind: "yIntercept" } },
  { at: { x: 0 }, d: "x", v: { m: "tangentNormal", f: "\\sqrt{x}", a: 4, kind: "slope" } }
];
const FN_RIGHT = [
  ["導函數", fnProblem("3*x**2-2", { m: "fn", kind: "deriv", f: "x^3-2x" })],
  ["混合偏導", fnProblem("6*x*y**2", { m: "fn", vars: ["x", "y"], kind: "deriv", wrt: ["x", "y"], f: "x^2y^3" })],
  ["反導數（常數差不管）", fnProblem("x**3+x+7", { m: "fn", kind: "antideriv", f: "3x^2+1" }, "antiderivative")],
  ["切線（截距＋斜率兩點定死）", fnProblem("x/4+1", { m: "fn", cases: TANGENT_AT_4 })],
  ["收斂區間（左閉右開）", fnProblem("[-1, 1)", { m: "convergence", f: "\\frac{x^n}{n}", center: 0, from: 1, range: [-100, 100] }, "interval")],
  ["Maclaurin 係數", fnProblem("-1/4", { m: "derivAt0", coef: true, f: "\\ln(1+x)", n: 4, r: 0.5 }, "numeric")],
  // vecField / complex（2026-10 高曝光題補的兩條路徑）
  ["散度（答案是 x,y,z 的式子）", fnProblem("y*z", { m: "vecField", op: "div", F: ["xyz", "x^2z", "xy^2"] })],
  ["旋度 z 分量", fnProblem("y**2-x**2", { m: "vecField", op: "curl", comp: 2, F: ["x^2y", "xy^2", "z"] })],
  ["連鎖 Jacobian（先合成再微分）", fnProblem("-4*y", { m: "vecField", op: "jacobian", over: ["u", "v"], F: ["u+v", "uv"], inner: ["x+y", "x-y"] })],
  ["反向變換的 |Jacobian|", fnProblem("1/2", { m: "vecField", op: "jacobian", F: ["x+y", "x-y"], inverse: true, abs: true }, "numeric")],
  ["Jacobian 在一點", fnProblem("20", { m: "vecField", op: "jacobian", F: ["x^2-y^2", "2xy"], at: [1, 2] }, "numeric")],
  ["複數實部（答案是 x,y 的式子）", fnProblem("x**3-3*x*y**2", { m: "complex", op: "value", f: "z^3", part: "re" })],
  ["留數的模（小圓上的圍道積分）", fnProblem("1/2", { m: "complex", op: "contour", f: "1/(z^2+1)", center: "i", radius: 0.5, part: "abs" }, "numeric")],
  ["極點不在圍道內 → 0", fnProblem("0", { m: "complex", op: "contour", f: "1/(z-1)", center: 0, radius: 0.5, part: "re" }, "numeric")],
  ["複數導數的實部", fnProblem("-8", { m: "complex", op: "deriv", f: "z^4", at: "1+i", part: "re" }, "numeric")],
  ["全純映射的實 Jacobian", fnProblem("4*(x**2+y**2)", { m: "complex", op: "jacobian", f: "z^2" })]
];
FN_RIGHT.forEach(([name, problem]) => {
  const result = verifyProblem(problem, { normalizeAnswer: (value) => String(value) });
  if (result.status !== "ok") fail(`${name}：應該通過，卻回了 ${result.status}（${result.detail || result.reason || ""}）`);
});
WRONG_CASES.push(
  ["導函數漏掉常數項的導數", fnProblem("3*x**2", { m: "fn", kind: "deriv", f: "x^3-2x" })],
  ["混合偏導少乘一個 y", fnProblem("6*x*y", { m: "fn", vars: ["x", "y"], kind: "deriv", wrt: ["x", "y"], f: "x^2y^3" })],
  ["反導數的係數錯（x³/3 當成 x³ 的反導數）", fnProblem("x**3+x", { m: "fn", kind: "antideriv", f: "x^2+1" }, "antiderivative")],
  ["切線截距寫錯", fnProblem("x/4+2", { m: "fn", cases: TANGENT_AT_4 })],
  ["切線斜率寫成 f′(x) 在 0 附近的值（½）", fnProblem("x/2+0", { m: "fn", cases: TANGENT_AT_4 })],
  ["收斂區間的端點全開（漏了交錯調和那一端）", fnProblem("(-1, 1)", { m: "convergence", f: "\\frac{x^n}{n}", center: 0, from: 1, range: [-100, 100] }, "interval")],
  ["收斂區間的端點全閉（調和級數那一端其實發散）", fnProblem("[-1, 1]", { m: "convergence", f: "\\frac{x^n}{n}", center: 0, from: 1, range: [-100, 100] }, "interval")],
  ["把 f⁽⁴⁾(0) 當成 x⁴ 的係數", fnProblem("-6", { m: "derivAt0", coef: true, f: "\\ln(1+x)", n: 4, r: 0.5 }, "numeric")],
  ["散度忘了微分（把場的分量直接相乘）", fnProblem("x*y*z", { m: "vecField", op: "div", F: ["xyz", "x^2z", "xy^2"] })],
  ["旋度分量的正負號反了", fnProblem("x**2-y**2", { m: "vecField", op: "curl", comp: 2, F: ["x^2y", "xy^2", "z"] })],
  ["連鎖 Jacobian 少乘內層的 −2", fnProblem("2*y", { m: "vecField", op: "jacobian", over: ["u", "v"], F: ["u+v", "uv"], inner: ["x+y", "x-y"] })],
  ["反向變換的 Jacobian 忘了取倒數", fnProblem("2", { m: "vecField", op: "jacobian", F: ["x+y", "x-y"], inverse: true, abs: true }, "numeric")],
  ["Jacobian 的交叉項加成減", fnProblem("-12", { m: "vecField", op: "jacobian", F: ["x^2-y^2", "2xy"], at: [1, 2] }, "numeric")],
  ["複數實部的 i² 沒變號", fnProblem("x**3+3*x*y**2", { m: "complex", op: "value", f: "z^3", part: "re" })],
  ["留數忘了 1/(2i) 的 2", fnProblem("1", { m: "complex", op: "contour", f: "1/(z^2+1)", center: "i", radius: 0.5, part: "abs" }, "numeric")],
  ["極點在圍道外卻算成留數", fnProblem("1", { m: "complex", op: "contour", f: "1/(z-1)", center: 0, radius: 0.5, part: "re" }, "numeric")],
  ["複數導數把 (1+i)³ 算成 2+2i", fnProblem("8", { m: "complex", op: "deriv", f: "z^4", at: "1+i", part: "re" }, "numeric")],
  ["實 Jacobian 寫成 |f′| 而不是 |f′|²", fnProblem("2*(x**2+y**2)**0.5", { m: "complex", op: "jacobian", f: "z^2" })],
  ["調和函數的 Laplacian 寫成非零", fnProblem("1", { m: "complex", op: "laplacianRe", f: "z^3" }, "numeric")]
);

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
  ["把 xⁿ 在 [0,1) 說成一致收斂", textProblem("一致收斂", { m: "uniformConvergence", f: "x^n", limit: "0", range: [0, 0.999999] })],
  ["把 ∫₁^∞ (2+cos x)/x 說成收斂", textProblem("收斂", { m: "improperConverges", f: "\\frac{2+\\cos x}{x}", a: 1, b: "inf" })],
  ["把 ∫₀¹ eˣ/√x 說成發散", textProblem("發散", { m: "improperConverges", f: "\\frac{e^x}{\\sqrt x}", a: 0, b: 1, sing: [0] })]
];

WRONG_CLAIMS.forEach(([name, problem]) => {
  const result = verifyProblem(problem, { normalizeAnswer: (value) => String(value) });
  if (result.status !== "mismatch") {
    fail(`${name}：驗算器回了 ${result.status}（${result.detail || result.reason || ""}）—— 說反了應該是 mismatch`);
  }
});

/* ── 三之二、選擇題（choice）：答案那一項要被正面判定，錯的答案鍵要被抓 ── */
// 選項各自翻成數值條件；「另一個選項也成立」與「答案那一項不成立」都要是 mismatch，
// 少列一個誘答是 error（不檢查的選項不能被當成檢查過）。
const choiceProblem = (canonical, distractors, verify) => ({
  id: "probe-choice", topic: "derivatives", rank: 2, difficulty: 2, answerKind: "text",
  prompt: "\\text{驗算器自測}", answers: [canonical], canonical, distractors, verify
});
const GRAD = (gx, gy) => [
  { v: { m: "deriv", vars: ["x", "y"], f: "100-x^2-2y^2", at: [2, 1], wrt: "x" }, eq: gx },
  { v: { m: "deriv", vars: ["x", "y"], f: "100-x^2-2y^2", at: [2, 1], wrt: "y" }, eq: gy }
];
const GRAD_CHOICE = { m: "choice", options: [
  { say: "(−4, −4)", all: GRAD(-4, -4) }, { say: "(4, 4)", all: GRAD(4, 4) }, { say: "(−4, −2)", all: GRAD(-4, -2) }
] };
// 刪去法：答案是定理本身，誘答各被調和級數推翻
const HARMONIC_CHOICE = { m: "choice", options: [
  { say: "若 Σaₙ 收斂，則 lim aₙ = 0", unknown: "定理本身" },
  { say: "若 lim aₙ = 0，則 Σaₙ 收斂", given: [{ v: { m: "limit", f: "\\frac1x", at: "inf" }, eq: 0 }], all: [{ v: { m: "seriesConverges", f: "\\frac1n", from: 1 }, claim: true }] },
  { say: "若 aₙ > 0 且遞減，則 Σaₙ 收斂", all: [{ v: { m: "seriesConverges", f: "\\frac1n", from: 1 }, claim: true }] }
] };
// pick: "false"（下列何者錯誤）：Green 面積公式在單位圓上
const CIRCLE = { x: "\\cos t", y: "\\sin t", from: 0, to: "2\\pi" };
const GREEN_CHOICE = { m: "choice", pick: "false", options: [
  { say: "∮ y dx", v: { m: "lineIntegral", kind: "work", F: ["y", "0"], path: CIRCLE }, eq: "\\pi" },
  { say: "∮ x dy", v: { m: "lineIntegral", kind: "work", F: ["0", "x"], path: CIRCLE }, eq: "\\pi" }
] };
[
  ["選擇題：答案那一項正面成立", choiceProblem("(−4, −4)", ["(4, 4)", "(−4, −2)"], GRAD_CHOICE)],
  ["選擇題：刪去法（其餘選項全被反例推翻）", choiceProblem("若 Σaₙ 收斂，則 lim aₙ = 0", ["若 lim aₙ = 0，則 Σaₙ 收斂", "若 aₙ > 0 且遞減，則 Σaₙ 收斂"], HARMONIC_CHOICE)],
  ["選擇題：何者錯誤", choiceProblem("∮ y dx", ["∮ x dy"], GREEN_CHOICE)]
].forEach(([name, problem]) => {
  const result = verifyProblem(problem, { normalizeAnswer: (value) => String(value) });
  if (result.status !== "ok") fail(`${name}：應該通過，卻回了 ${result.status}（${result.detail || result.reason || ""}）`);
});
[
  ["選擇題：答案鍵指到誘答", choiceProblem("(−4, −2)", ["(4, 4)", "(−4, −4)"], GRAD_CHOICE)],
  ["選擇題：刪去法時答案鍵指到被推翻的那一項", choiceProblem("若 lim aₙ = 0，則 Σaₙ 收斂", ["若 Σaₙ 收斂，則 lim aₙ = 0", "若 aₙ > 0 且遞減，則 Σaₙ 收斂"], HARMONIC_CHOICE)],
  ["選擇題（何者錯誤）：答案鍵指到成立的那一項", choiceProblem("∮ x dy", ["∮ y dx"], GREEN_CHOICE)]
].forEach(([name, problem]) => {
  const result = verifyProblem(problem, { normalizeAnswer: (value) => String(value) });
  if (result.status !== "mismatch") fail(`${name}：驗算器回了 ${result.status}（${result.detail || result.reason || ""}）—— 應該是 mismatch`);
});
{
  const result = verifyProblem(choiceProblem("(−4, −4)", ["(4, 4)", "(−4, −2)", "(−2, −4)"], GRAD_CHOICE), { normalizeAnswer: (value) => String(value) });
  if (result.status === "ok") fail("選擇題：spec 漏列一個誘答卻被判 ok —— 沒檢查的選項不能算檢查過");
}

/* ── 三之三、坑：瑕積分的對數型邊緣情形 ─────────────────────── */
// 瑕積分的對數型邊緣情形：∫dx/(x ln x) 發散，但十倍尺度的比值是 k/(k+1)，
// 只看單一比值會判成收斂。比值往 1 爬的時候必須說「判不出來」，不能給答案。
try {
  const claim = EXPLICIT_METHODS.improperConverges({ m: "improperConverges", f: "\\frac{1}{x\\ln x}", a: 2, b: "inf" }).__claim;
  fail(`∫dx/(x ln x) 應該判不出來，卻判成 ${claim}`);
} catch (_error) { /* 判不出來才對 */ }

/* ── 三之四、坑：級數的冪次稍大於 1、與 ln ln n 型 ─────────────── */
// 2026-10-15 之前 Σ1/n^1.1、Σln n/n^1.1 被判成發散（代換後冪次 (p−1)u−k 在小 u 取最小值），
// Σ1/(n ln n ln ln n) 被判成收斂（代換後冪次 1+1/ln u 在 u≤16 還在 1.36）。前兩條要判對，第三條必須判不出來。
[
  ["Σ1/n^1.1 收斂", "\\frac{1}{n^{1.1}}", true],
  ["Σln n/n^1.1 收斂", "\\frac{\\ln n}{n^{1.1}}", true],
  ["Σ1/n^0.99 發散", "\\frac{1}{n^{0.99}}", false],
  ["Σ1/(n ln n) 發散", "\\frac{1}{n\\ln n}", false]
].forEach(([name, f, expected]) => {
  let claim;
  try {
    claim = EXPLICIT_METHODS.seriesConverges({ m: "seriesConverges", f, from: 2 }).__claim;
  } catch (error) {
    fail(`${name}：判不出來（${error.message}）`);
    return;
  }
  if (claim !== expected) fail(`${name}：判成 ${claim}，應該是 ${expected}`);
});
try {
  const claim = EXPLICIT_METHODS.seriesConverges({ m: "seriesConverges", f: "\\frac{1}{n\\ln n\\ln(\\ln n)}", from: 3 }).__claim;
  fail(`Σ1/(n ln n ln ln n) 應該判不出來，卻判成 ${claim}`);
} catch (_error) { /* 判不出來才對 */ }

/* ── 三之五、坑：級數求和的 Euler–Maclaurin 尾巴 ─────────────── */
// 2026-10-15 之前這兩條「安靜地算錯」：只在整數上有意義的項（(1−(−1)ⁿ)/n² 差 5e-3）、
// 比值貼著 1 的 ln 在遠方相消成 0（Σln((n+1)²/(n(n+2))) 算成 −0.599，真值 ln 2）。現在必須算不出來（NaN），不能給數字；
// ln(1+極小) 經過 LaTeX 編譯一樣是 log(1+x)，也會相消 —— 同樣必須算不出來。寫法換對（拆成 cos 的級數）就照常算得準。
[
  ["Σ(1−(−1)ⁿ)/n² 必須算不出來", "\\frac{1-(-1)^n}{n^2}"],
  ["Σln((n+1)²/(n(n+2))) 必須算不出來", "\\ln\\frac{(n+1)^2}{n(n+2)}"],
  ["Σln(1+1/(n(n+2))) 必須算不出來（log(1+x) 一樣相消）", "\\ln\\left(1+\\frac{1}{n(n+2)}\\right)"]
].forEach(([name, f]) => {
  const value = EXPLICIT_METHODS.series({ m: "series", f, from: 1 });
  if (Number.isFinite(value)) fail(`${name}，卻算出 ${value}`);
});
[
  ["Σ1/(n(n+2)) = 3/4（正常的單調級數照算）", { m: "series", f: "\\frac{1}{n(n+2)}", from: 1 }, 0.75],
  ["Σsin²n/n² = (π−1)/2（拆成 cos 2n）", { m: "value", f: "\\frac{\\pi^2}{12}-\\frac{1}{2}\\sum_{n=1}^{\\infty}\\frac{\\cos 2n}{n^2}" }, (Math.PI - 1) / 2]
].forEach(([name, spec, expected]) => {
  const value = EXPLICIT_METHODS[spec.m](spec);
  if (!close(value, expected)) fail(`${name}：算出 ${value}，應該是 ${expected}`);
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
console.log(`  函數／區間  ${FN_RIGHT.length} 條`);
console.log(`  故意寫錯    ${WRONG_CASES.length + WRONG_CLAIMS.length} 條（要被判 mismatch）`);
console.log("  選擇題      3 條正向、3 條答案鍵寫錯、1 條漏列誘答");

if (failures.length) {
  console.error(`\n驗算路徑自測失敗（${failures.length}）：`);
  failures.forEach((message) => console.error("  " + message));
  process.exit(1);
}

console.log("\nverify paths OK");
