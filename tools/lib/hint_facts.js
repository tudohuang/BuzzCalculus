// 從題目本身推出「可以重新驗證的事實」，當作第二層提示。
//
// 為什麼不是寫罐頭句子：「先求反導數再代入上下限」對每一題定積分都成立，
// 也就是對每一題都沒用。真正幫得上忙的第一句話是**這一題特有的**：
//
//   「直接代入會得到 0/0」          —— 學生知道不能硬代
//   「f(x)+f(π−x) 是常數 2」        —— 直接指向 King's property
//   「比值判別的極限是 1/3」        —— 判別法選好了，答案也快出來了
//   「x=0 是瑕點，要用極限定義」    —— 不然會直接代進去得到無限大
//
// 這些全部都是數值上可判定的，所以：
//
//   **每一條提示都帶一個 claim，驗證器可以重新算一次。**
//
// 這是自動產生內容唯一能被接受的形式。人檢查不了六百條提示，機器可以，
// 而且每次 CI 都會再檢查一次 —— 題目改了、提示跟著失效，會當場變紅。

"use strict";

const latex = require("./latex.js");
const numeric = require("./numeric.js");
const { topLevelOperator, readBraced } = require("./verify_engine.js");

/* ── 工具 ─────────────────────────────────────────────────── */

// 把 \frac{A}{B} 從最外層拆開。不是分式就回 null。
function splitFraction(body) {
  const text = String(body || "").trim();
  const match = text.match(/^\\d?frac\s*\{/);
  if (!match) return null;
  const openAt = text.indexOf("{", match[0].length - 1);
  const numerator = readBraced(text, openAt);
  if (!numerator) return null;
  const denominator = readBraced(text, numerator.end);
  if (!denominator) return null;
  // 後面還有東西的話就不是單純的分式（例如 \frac{a}{b}+c）
  if (text.slice(denominator.end).trim()) return null;
  return { numerator: numerator.text, denominator: denominator.text };
}

function compile(source, variable) {
  try {
    return latex.compile(source, [variable]);
  } catch (_error) {
    return null;
  }
}

// 函數在 target 附近趨近什麼：0 / ∞ / 有限值 / 不確定
//
// 這裡直接用 numeric.limit，不要自己再寫一個弱版的。
// 第一版自己寫了「取 h=2⁻¹⁴ 看值夠不夠小」，結果 sin(h)=6.1e-5 沒有小於門檻，
// 於是 lim sin(x)/x 這種最典型的 0/0 一題都抓不到。
// 專案裡已經有一個經過二十幾個案例驗證的極限引擎，沒有理由不用。
function tendency(fn, target) {
  if (!fn) return null;
  const result = numeric.limit(fn, target);
  if (Number.isFinite(result.value)) {
    return Math.abs(result.value) < 1e-9
      ? { kind: "zero", value: 0 }
      : { kind: "finite", value: result.value };
  }
  const probe = (h) => fn(Number.isFinite(target) ? target + h : (target > 0 ? 1 / h : -1 / h));

  // 定義域邊界落在外推窗裡的情況。
  //
  // numeric.limit 會在目標點附近撒一圈由遠而近的取樣點再外推。函數的定義域
  // 邊界剛好落在那一圈的外圍時，最遠的幾個點會算出 NaN，整個外推就跟著 NaN——
  // 即使那一題在目標點附近完全正常。ln(1+3x) 在 x→0 就是這樣：
  // 取樣撒到 x ≤ −1/3 就變成 ln(負數)，於是這一題最典型的 0/0 推不出來。
  //
  // 這裡改用貼著目標點的小窗直接探。兩側都有值、而且趨勢一致才採用；
  // 不一致就回 null（左右極限不同的題不該被講成某一型）。
  //
  // 只動提示這條路徑，不碰 numeric.limit —— 那支是答案驗算在用的，
  // 為了多幾條提示去放寬它，等於拿答案的可信度換提示的覆蓋率。
  if (Number.isFinite(target)) {
    const right = [1e-4, 1e-5, 1e-6].map((h) => probe(h)).filter(Number.isFinite);
    const left = [-1e-4, -1e-5, -1e-6].map((h) => probe(h)).filter(Number.isFinite);
    if (right.length === 3 && left.length === 3) {
      const settled = right[2];
      // 左右要趨近同一個值，否則這一題左右極限不同，不該被講成某一型
      const agree = Math.abs(settled - left[2]) <= 1e-3 * Math.max(1, Math.abs(settled));
      if (agree) {
        // 「趨近 0」的判準是隨 h 一起等比收縮，不是絕對值夠小。
        // ln(1+3x) 在 h=1e-6 時值是 3e-6 —— 用絕對門檻會判成「有限值 3e-6」，
        // 但它其實正在以 h 的速度奔向 0，是標準的 0/0 分子。
        const shrinking =
          Math.abs(right[2]) <= Math.abs(right[1]) * 0.5 &&
          Math.abs(right[2]) <= Math.abs(right[0]) * 0.05 &&
          Math.abs(right[2]) < 1e-3;
        if (shrinking) return { kind: "zero", value: 0 };
        // 收斂到一個穩定的非零值：後兩步的變動比前一步小
        const converging = Math.abs(right[2] - right[1]) <= Math.abs(right[1] - right[0]) + 1e-12;
        if (converging) return { kind: "finite", value: settled };
      }
    }
  }

  // 極限引擎算不出來時，看它是不是單純地往無窮跑
  const far = probe(1e-6);
  const near = probe(1e-3);
  if (Number.isFinite(far) && Number.isFinite(near) && Math.abs(far) > 1e6 && Math.abs(far) > Math.abs(near) * 10) {
    return { kind: "infinite", value: far > 0 ? Infinity : -Infinity };
  }
  return null;
}

/* ── 極限：不定型 ─────────────────────────────────────────── */

const FORM_TEXT = {
  "0/0": "直接代入會得到 0/0，不能硬代 —— 要先化簡、有理化，或用 L'Hôpital 與泰勒展開。",
  "inf/inf": "直接代入會得到 ∞/∞，分子分母同除以最高次項，或用 L'Hôpital。",
  "inf-inf": "這是 ∞−∞ 型。先通分或乘共軛式，把它整理成分式再處理。",
  "1^inf": "這是 1^∞ 型。取對數變成 0·∞，再整理成分式。",
  "0*inf": "這是 0·∞ 型。把其中一項移到分母，變成 0/0 或 ∞/∞ 再處理。",
  direct: "分子分母都不趨近 0 或 ∞，直接代入就是答案 —— 這題考的是「先確認不是不定型」。"
};

function limitForm(problem) {
  const structure = topLevelOperator(problem.prompt);
  if (!structure || structure.op !== "limit") return null;
  const variable = structure.variable;
  const target = (() => {
    const raw = String(structure.target).trim();
    if (/infty/.test(raw)) return raw.startsWith("-") ? -Infinity : Infinity;
    const compiled = compile(raw, variable);
    return compiled ? compiled(0) : null;
  })();
  if (target === null || Number.isNaN(target)) return null;

  const fraction = splitFraction(structure.body);
  if (fraction) {
    const top = tendency(compile(fraction.numerator, variable), target);
    const bottom = tendency(compile(fraction.denominator, variable), target);
    if (!top || !bottom) return null;
    if (top.kind === "zero" && bottom.kind === "zero") {
      return { form: "0/0", text: FORM_TEXT["0/0"], claim: { k: "limitForm", v: "0/0" } };
    }
    if (top.kind === "infinite" && bottom.kind === "infinite") {
      return { form: "inf/inf", text: FORM_TEXT["inf/inf"], claim: { k: "limitForm", v: "inf/inf" } };
    }
    if (top.kind === "finite" && bottom.kind === "finite" && Math.abs(bottom.value) > 1e-6) {
      return { form: "direct", text: FORM_TEXT.direct, claim: { k: "limitForm", v: "direct" } };
    }
    return null;
  }

  // u^v：底數 → 1、指數 → ∞ 就是 1^∞
  const power = String(structure.body).match(/^\\left\((.*)\\right\)\^\{?(.+?)\}?$/);
  if (power) {
    const base = tendency(compile(power[1], variable), target);
    const exponent = tendency(compile(power[2], variable), target);
    if (base && exponent && base.kind === "finite" && Math.abs(base.value - 1) < 1e-4 && exponent.kind === "infinite") {
      return { form: "1^inf", text: FORM_TEXT["1^inf"], claim: { k: "limitForm", v: "1^inf" } };
    }
  }
  return null;
}

/* ── 定積分：King's property ──────────────────────────────── */

// ∫_a^b f 裡，若 f(x)+f(a+b−x) 是常數 c，那麼 I = c(b−a)/2 —— 一行就解完。
// 這是整份提示裡最有價值的一條：它把一題看起來很難的積分變成一個乘法。
function kingsProperty(problem) {
  const structure = topLevelOperator(problem.prompt);
  if (!structure || structure.op !== "definite-integral") return null;
  const variable = structure.variable;
  const lower = evaluateBound(structure.from, variable);
  const upper = evaluateBound(structure.to, variable);
  if (!Number.isFinite(lower) || !Number.isFinite(upper)) return null;
  const fn = compile(structure.body, variable);
  if (!fn) return null;

  const sum = lower + upper;
  const samples = [];
  for (let k = 1; k <= 9; k += 1) {
    const x = lower + ((upper - lower) * k) / 10;
    const a = fn(x);
    const b = fn(sum - x);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    samples.push(a + b);
  }
  const first = samples[0];
  const constant = samples.every((value) => numeric.close(value, first, 1e-6));
  if (!constant) return null;
  // 常數是 0 的話這條沒有用（積分是 0，但那是奇函數那一條在講的）
  if (Math.abs(first) < 1e-9) return null;

  const rounded = Number(first.toPrecision(10));
  return {
    text: `把 x 換成 ${format(sum)}−x 之後兩式相加：f(x)+f(${format(sum)}−x) 恆等於 ${format(rounded)}，` +
      `所以 2I = ${format(rounded)}×(區間長度)。`,
    claim: { k: "kings", v: rounded }
  };
}

/* ── 定積分：對稱區間上的奇函數 ───────────────────────────── */

function oddOnSymmetric(problem) {
  const structure = topLevelOperator(problem.prompt);
  if (!structure || structure.op !== "definite-integral") return null;
  const variable = structure.variable;
  const lower = evaluateBound(structure.from, variable);
  const upper = evaluateBound(structure.to, variable);
  if (!Number.isFinite(lower) || !Number.isFinite(upper)) return null;
  if (!numeric.close(lower, -upper, 1e-9)) return null;
  const fn = compile(structure.body, variable);
  if (!fn) return null;

  let checked = 0;
  for (let k = 1; k <= 7; k += 1) {
    const x = (upper * k) / 8;
    const a = fn(x);
    const b = fn(-x);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    if (!numeric.close(a, -b, 1e-7)) return null;
    checked += 1;
  }
  if (checked < 5) return null;
  return {
    text: "積分區間對稱，而且被積函數是奇函數（f(−x)=−f(x)）—— 不用算，答案是 0。",
    claim: { k: "odd", v: 1 }
  };
}

/* ── 定積分：端點瑕點 ─────────────────────────────────────── */

function endpointSingularity(problem) {
  const structure = topLevelOperator(problem.prompt);
  if (!structure || structure.op !== "definite-integral") return null;
  const variable = structure.variable;
  const lower = evaluateBound(structure.from, variable);
  const upper = evaluateBound(structure.to, variable);
  const fn = compile(structure.body, variable);
  if (!fn) return null;
  if (!Number.isFinite(lower) && !Number.isFinite(upper)) return null;

  const blowsUp = (edge, inward) => {
    if (!Number.isFinite(edge)) return false;
    const values = [];
    for (let k = 4; k <= 12; k += 1) {
      const value = fn(edge + inward * Math.pow(0.5, k));
      if (!Number.isFinite(value)) return true;
      values.push(Math.abs(value));
    }
    return values[values.length - 1] > 1e6 && values[values.length - 1] > values[0] * 100;
  };

  const atLower = blowsUp(lower, 1);
  const atUpper = blowsUp(upper, -1);
  if (!atLower && !atUpper) return null;
  const where = atLower && atUpper ? "兩個端點" : atLower ? `x=${format(lower)}` : `x=${format(upper)}`;
  return {
    text: `被積函數在 ${where} 發散，這是瑕積分 —— 要寫成極限再算，不能直接代端點。`,
    claim: { k: "singular", v: atLower && atUpper ? "both" : atLower ? "lower" : "upper" }
  };
}

/* ── 級數：比值判別的極限 ─────────────────────────────────── */

function ratioTest(problem) {
  const structure = topLevelOperator(problem.prompt);
  if (!structure || structure.op !== "series") return null;
  const variable = structure.variable;
  const term = compile(structure.body, variable);
  if (!term) return null;
  const from = evaluateBound(structure.from, variable);
  if (!Number.isFinite(from)) return null;

  // n 不能取太大：n! 在 171 就溢位成 Infinity，Σn!/nⁿ 這種題會整批算不出來。
  // n 取到 120 就好：n! 在 171 溢位，取太大反而整批算不出來。
  const ratios = [];
  const sampled = [];
  for (const n of [20, 40, 80, 120]) {
    const a = term(n);
    const b = term(n + 1);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a === 0) break;
    ratios.push(Math.abs(b / a));
    sampled.push(n);
  }
  if (ratios.length < 3) return null;

  // 這裡刻意非常保守，因為第一版在這裡產出過一條**確定錯誤**的提示：
  //
  //   Σ1/n 的比值在 n=160 時是 160/161 = 0.9938，
  //   於是它被判成「小於 1，收斂」—— 而 Σ1/n 是發散的。
  //
  // 比值極限是 1 的級數（1/n、1/n²、1/(n log n)…）在**任何**有限的 n
  // 都會給出一個小於 1 的數字。取樣再多也不會變好，因為問題不在樣本數，
  // 在於「有限的 n 永遠分不出 0.99 和 1」。
  //
  // 所以判準不是「最後一個比值小於 1」，而是**整個取樣範圍都遠離 1**。
  // 那對應到比值判別真正的條件（limsup 明顯小於 1），而不是某一點的值。
  const CONVERGE_CEILING = 0.8;
  const DIVERGE_FLOOR = 1.25;
  const allBelow = ratios.every((value) => value <= CONVERGE_CEILING);
  const allAbove = ratios.every((value) => value >= DIVERGE_FLOOR);
  if (!allBelow && !allAbove) return null;

  const last = ratios[ratios.length - 1];
  const rounded = Number(last.toPrecision(6));
  const span = `n=${sampled[0]}…${sampled[sampled.length - 1]}`;
  return {
    text: allBelow
      ? `比值判別：|aₙ₊₁/aₙ| 在 ${span} 之間一路落在 ${format(Number(Math.max(...ratios).toPrecision(3)))} 以下（最後約 ${format(rounded)}），明顯小於 1 —— 收斂。`
      : `比值判別：|aₙ₊₁/aₙ| 在 ${span} 之間一路在 ${format(Number(Math.min(...ratios).toPrecision(3)))} 以上（最後約 ${format(rounded)}），明顯大於 1 —— 發散。`,
    claim: { k: "ratio", v: rounded }
  };
}

/* ── 導數：最外層是哪個律 ─────────────────────────────────── */

// 學生卡在導數題，最常見的原因是「先用哪一條律」看錯。
// 這個可以直接從語法樹讀出來，不需要猜。
function outermostRule(problem) {
  const structure = topLevelOperator(problem.prompt);
  if (!structure || (structure.op !== "derivative" && structure.op !== "partial")) return null;
  const body = String(structure.body).trim().replace(/^\\left\(|\\right\)$/g, "");
  let js;
  try {
    js = latex.toJs(body);
  } catch (_error) {
    return null;
  }

  // 看編譯出來的 JS 最外層是什麼運算：加減 → 逐項；除 → 商法則；
  // 乘 → 乘積律；Math.pow / 函數呼叫 → 鏈鎖律。
  const outer = outerOperator(js);
  const RULES = {
    "+": { text: "最外層是加減，先逐項微分，不要急著套乘積或商法則。", v: "sum" },
    "*": { text: "最外層是兩個函數相乘，用乘積律 (uv)' = u'v + uv'。", v: "product" },
    "/": { text: "最外層是商，用商法則 (u/v)' = (u'v − uv')/v²。也可以改寫成 u·v⁻¹ 用乘積律。", v: "quotient" },
    call: { text: "最外層是一個函數套著另一個函數，用鏈鎖律：先微外層、再乘內層的導數。", v: "chain" }
  };
  const rule = RULES[outer];
  if (!rule) return null;
  return { text: rule.text, claim: { k: "outer", v: rule.v } };
}

// 找出 JS 運算式最外層的運算子（括號深度 0）
function outerOperator(js) {
  const text = String(js).trim();
  const stripped = stripOuterParens(text);
  let depth = 0;
  let found = null;
  for (let i = 0; i < stripped.length; i += 1) {
    const ch = stripped[i];
    if (ch === "(") depth += 1;
    else if (ch === ")") depth -= 1;
    else if (depth === 0) {
      // 一元負號不算
      const previous = stripped[i - 1];
      const isUnary = previous === undefined || "+-*/(,".includes(previous);
      if ((ch === "+" || ch === "-") && !isUnary) found = "+";
      else if ((ch === "*" || ch === "/") && found !== "+") found = ch;
    }
  }
  if (found) return found;
  if (/^Math\.pow\(|^[a-z]+\(/.test(stripped)) return "call";
  return null;
}

function stripOuterParens(text) {
  let out = text.trim();
  while (out.startsWith("(") && out.endsWith(")")) {
    let depth = 0;
    let wraps = true;
    for (let i = 0; i < out.length; i += 1) {
      if (out[i] === "(") depth += 1;
      else if (out[i] === ")") {
        depth -= 1;
        if (depth === 0 && i < out.length - 1) { wraps = false; break; }
      }
    }
    if (!wraps) break;
    out = out.slice(1, -1).trim();
  }
  return out;
}

/* ── 共用 ─────────────────────────────────────────────────── */

function evaluateBound(text, variable) {
  if (text === null || text === undefined) return NaN;
  const raw = String(text).trim();
  if (/^-?\\infty$/.test(raw) || raw === "\\infty") return raw.startsWith("-") ? -Infinity : Infinity;
  const compiled = compile(raw, variable);
  return compiled ? compiled(0) : NaN;
}

function format(value) {
  if (!Number.isFinite(value)) return String(value);
  if (numeric.close(value, Math.PI, 1e-9)) return "π";
  if (numeric.close(value, Math.PI / 2, 1e-9)) return "π/2";
  if (numeric.close(value, 2 * Math.PI, 1e-9)) return "2π";
  const rounded = Number(value.toPrecision(8));
  return String(rounded);
}

// ∫₀^∞ 上的代數型被積函數：收斂靠的是分母長得比分子快，
// 而要算出**值**只能走 Beta / Gamma / 留數 / 參數微分。
// 學生看到這種題最常見的卡點就是「想用分部積分硬做」。
function algebraicImproper(problem) {
  const text = String(problem.prompt || "");
  if (!/\\int_(\{?-?\\infty\}?|0|\{0\})\^\{?\\infty/.test(text)) return null;
  if (/e\^\{?-|\\exp\(-/.test(text)) return null;
  const structure = topLevelOperator(problem.prompt);
  if (!structure || structure.op !== "definite-integral") return null;
  const fn = compile(structure.body, structure.variable);
  if (!fn) return null;
  // 確認它真的收斂，不然這條提示會誤導
  const value = numeric.integrate(fn, 0, Infinity);
  if (!Number.isFinite(value.value) || Math.abs(value.value) > 1e10) return null;
  return {
    text: "區間是 [0,∞) 而被積函數是代數型（沒有指數在壓）—— 它收斂靠的是分母長得比分子快。" +
      "這種積分用分部積分做不出來，要往 Beta/Gamma、留數或參數微分想。",
    claim: { k: "algImproper", v: 1 }
  };
}

// 依序試各種偵測器，回傳第一個成立的事實。
// 順序＝有用程度：King's / 奇函數能直接把題目做完，所以排最前面。
const DETECTORS = [
  ["kings", kingsProperty],
  ["odd", oddOnSymmetric],
  ["singular", endpointSingularity],
  ["algImproper", algebraicImproper],
  ["limitForm", limitForm],
  ["ratio", ratioTest],
  ["outer", outermostRule]
];

function factFor(problem) {
  for (const [name, detector] of DETECTORS) {
    let fact = null;
    try {
      fact = detector(problem);
    } catch (_error) {
      fact = null;
    }
    if (fact && fact.text) return { ...fact, detector: name };
  }
  return null;
}

// 驗證器用：重新算一次，確認 claim 還成立
function recheck(problem, claim) {
  const detector = DETECTORS.find(([name]) => name === claim.k);
  if (!detector) return { ok: false, reason: `不認得的 claim 種類 ${claim.k}` };
  let fact = null;
  try {
    fact = detector[1](problem);
  } catch (error) {
    return { ok: false, reason: error.message };
  }
  if (!fact) return { ok: false, reason: "重新偵測時這個事實不成立了" };
  const now = fact.claim.v;
  const before = claim.v;
  if (typeof now === "number" && typeof before === "number") {
    return numeric.close(now, before, 1e-4)
      ? { ok: true }
      : { ok: false, reason: `數值變了：${before} → ${now}` };
  }
  return now === before ? { ok: true } : { ok: false, reason: `值變了：${before} → ${now}` };
}

module.exports = { factFor, recheck, DETECTORS, splitFraction, outerOperator };
