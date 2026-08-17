// 從題幹推出一條獨立的驗算路徑，再拿它去對答案。
//
// 核心原則：**驗算不能重複解題時的推導**。
// 題目寫 ∫₀^{π/2} ln(sin x)dx，答案寫 -π/2·ln2。如果驗算的方式是「再解一次積分」，
// 那只是把同一個可能出錯的推理再跑一遍。這裡的做法是把題幹的 LaTeX 直接數值積分，
// 得到 -1.0887930451518，再把答案字串 -PI/2*log(2) 求值成 -1.0887930451518，兩邊比對。
// 兩條路徑唯一的共同前提是「我有沒有看懂題幹」，而看不懂的時候解析器會丟例外，
// 不會安靜地算出一個別的東西。
//
// 不定積分和導數的驗算更漂亮，完全不必解題：
//   ∫f dx = F  ⟹  只要檢查 F′(x) = f(x)
//   d/dx f = g ⟹  只要檢查 g(x) = f′(x)
// 這兩類佔題庫一大塊，而且驗算強度是滿的。

"use strict";

const latex = require("./latex.js");
const numeric = require("./numeric.js");
const setInterval = require("./set_interval_verify.js");

/* ── LaTeX 結構切割 ────────────────────────────────────────── */

// 從 index 位置（必須是 "{"）讀到配對的 "}"，回傳內容與結束位置
function readBraced(source, index) {
  if (source[index] !== "{") return null;
  let depth = 0;
  for (let i = index; i < source.length; i += 1) {
    if (source[i] === "\\") { i += 1; continue; }
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return { text: source.slice(index + 1, i), end: i + 1 };
    }
  }
  return null;
}

// 讀一個下標／上標的引數：{…} 或單一 token
function readScript(source, index) {
  if (source[index] === "{") return readBraced(source, index);
  const command = source.slice(index).match(/^\\[A-Za-z]+/);
  if (command) return { text: command[0], end: index + command[0].length };
  if (index < source.length) return { text: source[index], end: index + 1 };
  return null;
}

// 讀 \int / \sum 後面的 _下限^上限（順序可以相反，也可以沒有）
function readBounds(source, index) {
  let i = index;
  let lower = null;
  let upper = null;
  for (let round = 0; round < 2; round += 1) {
    while (source[i] === " ") i += 1;
    if (source[i] === "_" && lower === null) {
      const read = readScript(source, i + 1);
      if (!read) break;
      lower = read.text;
      i = read.end;
    } else if (source[i] === "^" && upper === null) {
      const read = readScript(source, i + 1);
      if (!read) break;
      upper = read.text;
      i = read.end;
    } else break;
  }
  return { lower, upper, end: i };
}

// 積分式尾巴的 dx。三種常見寫法都要吃：
//   \int_0^1 x\,dx        尾綴
//   \int_0^1 \frac{dx}{x} 分子裡
//   \int_0^1 dx\,f(x)     前置（少見但存在）
const TRAILING_D = /(\\,|\\;|\\!|\\ |\s)*(?:\\mathrm\{d\}|\\operatorname\{d\}|\bd)\s*([a-zA-Z])\s*$/;

function stripDifferential(body) {
  const trailing = body.match(TRAILING_D);
  if (trailing) {
    return { integrand: body.slice(0, trailing.index), variable: trailing[2] };
  }
  // \frac{dx}{…} → \frac{1}{…}
  const inFraction = body.match(/\\d?frac\{\s*(?:\\mathrm\{d\}|d)\s*([a-zA-Z])\s*\}/);
  if (inFraction) {
    return {
      integrand: body.replace(inFraction[0], "\\frac{1}"),
      variable: inFraction[1]
    };
  }
  return null;
}

// 題幹尾巴的定義域限制：",\ x>0"、"\quad (x \ge 1)"、", 0<x<1"。
//
// 有些答案只在部分定義域上成立（arccos((1−x²)/(1+x²)) 的導數在 x<0 時要變號）。
// 那個限制必須寫在題幹上 —— 學生看不到限制卻被要求猜到它，是出題的錯不是作答的錯。
// 寫在題幹上之後，驗算器也就跟著只在合法的範圍取樣。
const DOMAIN_TAIL = /[,\s]*(?:\\quad|\\qquad|\\,|\\;|\\ |\s)*\(?\s*([a-zA-Z])\s*(>=|<=|\\ge|\\geq|\\le|\\leq|\\neq|>|<)\s*(-?[0-9.]+)\s*\)?\s*$/;

function stripDomain(source) {
  const match = source.match(DOMAIN_TAIL);
  if (!match) return { body: source, domain: null };
  const operator = { "\\ge": ">=", "\\geq": ">=", "\\le": "<=", "\\leq": "<=", "\\neq": "!=" }[match[2]] || match[2];
  return {
    body: source.slice(0, match.index),
    domain: { variable: match[1], operator, value: Number(match[3]) }
  };
}

function satisfiesDomain(domain, x) {
  if (!domain) return true;
  switch (domain.operator) {
    case ">": return x > domain.value;
    case ">=": return x >= domain.value;
    case "<": return x < domain.value;
    case "<=": return x <= domain.value;
    case "!=": return x !== domain.value;
    default: return true;
  }
}

// 找出題幹最外層的運算子。回傳 null 代表這是一個普通的式子。
// 題幹尾巴的 \text{…} 是給人看的註解，不是數學的一部分：
//   \sum_{n=1}^{\infty}\frac{n+1}{n^3+1}\ \text{ converges?}
//   \lim_{x\to\infty}(\sqrt{x^2+3x}-x)\quad\text{Use which technique?}
// 留著它解析一定失敗；剝掉之後，數學的部分照樣可以獨立驗算。
// 但只剝**尾巴**：\text{Coefficient of }x^6\text{ in }(1+x)^x 這種
// 用文字描述題意的題目，剝掉就整題沒了，那類要走手寫 verify。
const TRAILING_TEXT = /(?:\\quad|\\qquad|\\,|\\ |\s)*\\text\{[^{}]*\}\s*$/;

function stripTrailingText(source) {
  let body = source;
  let note = "";
  for (;;) {
    const match = body.match(TRAILING_TEXT);
    if (!match) break;
    note = body.slice(match.index) + note;
    body = body.slice(0, match.index);
  }
  return { body, note: note.trim() };
}

function topLevelOperator(rawPrompt) {
  const withoutText = stripTrailingText(String(rawPrompt || ""));
  const stripped = stripDomain(withoutText.body);
  const parsed = parseOperator(stripped.body);
  if (parsed) {
    parsed.domain = stripped.domain;
    parsed.note = withoutText.note;
  }
  return parsed;
}

function parseOperator(prompt) {
  const source = String(prompt || "");

  const limitAt = source.indexOf("\\lim");
  if (limitAt === 0) {
    const bounds = readBounds(source, limitAt + 4);
    if (!bounds.lower) return null;
    const spec = bounds.lower.match(/^([a-zA-Z])\s*(?:\\to|\\rightarrow|→)\s*(.+)$/);
    if (!spec) return null;
    let target = spec[2].trim();
    let side = "both";
    const sided = target.match(/^(.*?)\^\{?([+-])\}?$/);
    if (sided) { target = sided[1]; side = sided[2]; }
    return { op: "limit", variable: spec[1], target, side, body: source.slice(bounds.end) };
  }

  const sumAt = source.search(/\\sum|\\prod/);
  if (sumAt === 0) {
    const isProduct = source.startsWith("\\prod");
    const bounds = readBounds(source, isProduct ? sumAt + 5 : sumAt + 4);
    if (!bounds.lower || !bounds.upper) return null;
    const start = bounds.lower.match(/^([a-zA-Z])\s*=\s*(.+)$/);
    if (!start) return null;
    return {
      op: isProduct ? "product" : "series",
      variable: start[1],
      from: start[2],
      to: bounds.upper,
      body: source.slice(bounds.end)
    };
  }

  if (/^\\i{1,3}nt|^\\oint/.test(source)) {
    if (/^\\i{2,3}nt|^\\oint/.test(source)) return { op: "multiple-integral" };
    const bounds = readBounds(source, 4);
    const rest = source.slice(bounds.end);
    const split = stripDifferential(rest);
    if (!split) return null;
    return {
      op: bounds.lower === null ? "antiderivative" : "definite-integral",
      variable: split.variable,
      from: bounds.lower,
      to: bounds.upper,
      body: split.integrand
    };
  }

  // \frac{d}{dx}(…)  /  \frac{d^2}{dx^2}(…)  /  \frac{\partial}{\partial x}(…)
  const differential = source.match(/^\\d?frac\{(d|\\partial)(?:\^\{?(\d+)\}?)?\}\{(?:d|\\partial)\s*([a-zA-Z])(?:\^\{?\d+\}?)?\}/);
  if (differential) {
    const rest = source.slice(differential[0].length);
    const evaluated = rest.match(/(?:\\left\.)?\s*(?:\\big?g?\||\\right\||\\Big\||\|)_\{?\s*([a-zA-Z])\s*=\s*([^}]+)\}?\s*$/);
    return {
      op: differential[1] === "\\partial" ? "partial" : "derivative",
      variable: differential[3],
      order: Number(differential[2] || 1),
      at: evaluated ? evaluated[2] : null,
      body: evaluated ? rest.slice(0, evaluated.index) : rest
    };
  }

  return null;
}

/* ── 求值輔助 ──────────────────────────────────────────────── */

const NAMED_TARGETS = { "\\infty": Infinity, "-\\infty": -Infinity, "\\pi": Math.PI };

// 把界限／目標值（可能是 0、1、\pi/2、\infty）求成一個數
function evaluateBound(text) {
  if (text === null || text === undefined) return null;
  const trimmed = String(text).trim();
  if (NAMED_TARGETS[trimmed] !== undefined) return NAMED_TARGETS[trimmed];
  if (trimmed === "\\infty" || trimmed === "+\\infty") return Infinity;
  const compiled = latex.compile(trimmed, []);
  return compiled();
}

// 挑一批取樣點：刻意用無理數附近的值，避免 x=1 這種「剛好兩邊都對」的巧合
const SAMPLE_POINTS = [
  0.3137, 0.7211, 1.2345, 1.9871, 2.5313, 0.4523, 1.6180, 3.3013,
  -0.6180, -1.3247, -2.1069, 0.1234, 4.6692, 0.8541
];

// 在能算的取樣點上比較兩個函式。回傳 {ok, checked, worst}
function compareFunctions(left, right, options = {}) {
  const tolerance = options.tolerance || 1e-6;
  const minimumChecks = options.minimumChecks || 4;
  const points = (options.points || SAMPLE_POINTS)
    .filter((x) => satisfiesDomain(options.domain, x));
  let checked = 0;
  let worst = null;
  for (const x of points) {
    const a = left(x);
    const measured = right(x);
    // 右側可以回傳 {value, error} 來表達「我自己也不確定」。
    // d/dx ∫_{x²}^{x³}cos(t²)dt 在 x=4.67 時，積分上限是 101，
    // 而 cos(t²) 在那裡每 0.03 就振盪一次 —— 數值積分根本解析不了，
    // 微分出來的值毫無意義。這種點要跳過，不能拿來說答案錯。
    const b = typeof measured === "object" ? measured.value : measured;
    const uncertainty = typeof measured === "object" ? measured.error : 0;
    if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
    // 兩邊都巨大時多半是靠近奇異點，數值微分不可信，跳過
    if (Math.abs(a) > 1e8 || Math.abs(b) > 1e8) continue;
    if (Number.isFinite(uncertainty) && uncertainty > 1e-4 * Math.max(1, Math.abs(b))) continue;
    checked += 1;
    if (!numeric.close(a, b, tolerance)) {
      worst = { x, expected: b, actual: a };
      break;
    }
  }
  if (worst) return { ok: false, checked, worst };
  if (checked < minimumChecks) {
    return { ok: false, checked, insufficient: true };
  }
  return { ok: true, checked };
}

// 比對容差不能是一個固定數字。
//
// 數值方法自己知道它有多準：極限外插會回報幾個窗格之間的離散程度，
// 積分會回報最後兩層的差。ln(1+x) 展開到 x⁵ 的那種極限，浮點抵消之後
// 只剩五位有效數字 —— 拿 1e-6 去比就會把正確答案判成錯的，
// 而那正是最傷的一種誤判：作者會開始不信任驗證器。
//
// 所以容差取「基準」和「這次計算自己回報的不確定度」兩者的大者。
function toleranceFor(computed, base) {
  const scale = Math.max(1, Math.abs(computed.value));
  const reported = Number.isFinite(computed.error) ? (20 * computed.error) / scale : 0;
  return Math.max(base, Math.min(reported, 1e-3));
}

// 文字型答案不見得是在講收斂或存在性。「Use which technique?」的答案是
// "rationalize"、"root test" —— 那是在問解題手法，數值上無從驗起。
// 沒有這道關卡的話，驗算器會拿「這個級數收斂嗎」去對「root test」，
// 然後回報一個看起來很嚴重、其實是自己問錯問題的不符。
const NUMERIC_CLAIM = /收斂|發散|converg|diverg|conditional|absolut|不存在|DNE|存在/i;

function isNumericClaim(text) {
  return NUMERIC_CLAIM.test(String(text || ""));
}

/* ── 主流程：為一題產生驗算計畫並執行 ─────────────────────── */

// normalizeAnswer 由呼叫端注入（app.js 的 normalizeExpression），
// 這樣驗算用的是**上線判分器認得的那個答案**，而不是另一套解讀。
function verifyProblem(problem, options = {}) {
  const normalize = options.normalizeAnswer || ((value) => String(value));

  const compileAnswer = (vars) => {
    const js = normalize(problem.answer);
    if (!js) throw new Error(`答案 "${problem.answer}" 判分器解讀不了`);
    return latex.compileJs(js, vars);
  };

  const structure = topLevelOperator(problem.prompt);

  // set / interval 兩種答案不是單一數值，比對方式完全不同（集合要比「找齊了沒有」，
  // 區間還要比端點的開閉）。交給專門的驗算器。
  if (setInterval.supports(problem)) {
    return setInterval.verify(problem, { normalizeAnswer: normalize });
  }

  // 明確寫在題目上的 verify 欄位優先於自動推導
  if (problem.verify) return runExplicit(problem, compileAnswer);

  if (!structure) return { status: "unsupported", reason: "題幹不是可自動辨識的形式" };
  if (structure.op === "multiple-integral") {
    return { status: "unsupported", reason: "重積分需要手寫 verify" };
  }

  switch (structure.op) {
    case "antiderivative":
      return verifyAntiderivative(problem, structure, compileAnswer);
    case "derivative":
    case "partial":
      return verifyDerivative(problem, structure, compileAnswer);
    case "definite-integral":
      return verifyDefiniteIntegral(problem, structure, compileAnswer);
    case "limit":
      return verifyLimit(problem, structure, compileAnswer);
    case "series":
    case "product":
      return verifySeries(problem, structure, compileAnswer);
    default:
      return { status: "unsupported", reason: `還沒支援的形式 ${structure.op}` };
  }
}

// ∫f dx = F  ⟹  F′ = f。完全不必解積分。
function verifyAntiderivative(problem, structure, compileAnswer) {
  if (problem.answerKind !== "antiderivative" && problem.answerKind !== "expression") {
    return { status: "unsupported", reason: "不定積分但答案不是函數" };
  }
  const variable = problem.variable || structure.variable;
  const integrand = latex.compile(structure.body, [variable]);
  const antiderivative = compileAnswer([variable]);
  const result = compareFunctions(
    integrand,
    (x) => numeric.derivative(antiderivative, x),
    { tolerance: 1e-5, domain: structure.domain }
  );
  return report("antiderivative", result, `d/d${variable}(答案) 應該等於被積函數`);
}

// d/dx f = g ⟹ g = f′
function verifyDerivative(problem, structure, compileAnswer) {
  const variable = structure.variable;
  const target = latex.compile(structure.body, unionVars(structure.body, problem, variable));

  if (structure.at !== null) {
    // 在某一點求值 → 答案是一個數
    const at = evaluateBound(structure.at);
    const expected = numeric.derivative(
      (x) => target(...substitute(target.vars, variable, x)),
      at,
      { order: structure.order }
    );
    const actual = compileAnswer([])();
    return compareNumbers("derivative-at-point", actual, expected.value, structure.order > 1 ? 1e-4 : 1e-6);
  }

  const answerVars = target.vars;
  const answer = compileAnswer(answerVars);
  const index = answerVars.indexOf(variable);
  if (index < 0) return { status: "unsupported", reason: `題幹裡找不到變數 ${variable}` };

  // 多變數時把其他變數釘在固定值上，只掃描被微分的那一個
  const frozen = answerVars.map((name, i) => (i === index ? null : 0.7311 + i * 0.4127));
  const withValue = (x) => frozen.map((value, i) => (i === index ? x : value));
  const result = compareFunctions(
    (x) => answer(...withValue(x)),
    (x) => numeric.derivative((t) => target(...withValue(t)), x, { order: structure.order }),
    { tolerance: structure.order > 1 ? 1e-3 : 1e-5, domain: structure.domain }
  );
  return report(structure.op, result, `答案應該等於 ${structure.order > 1 ? structure.order + " 階" : ""}導數`);
}

function verifyDefiniteIntegral(problem, structure, compileAnswer) {
  const from = evaluateBound(structure.from);
  const to = evaluateBound(structure.to);
  if (from === null || to === null) return { status: "unsupported", reason: "積分界限讀不出來" };

  const variable = structure.variable;
  const integrand = latex.compile(structure.body, unionVars(structure.body, problem, variable));
  const index = integrand.vars.indexOf(variable);
  if (index < 0) return { status: "unsupported", reason: `被積函數裡沒有 ${variable}` };

  if (integrand.vars.length === 1) {
    const computed = numeric.integrate(integrand, from, to);
    if (!Number.isFinite(computed.value)) {
      return { status: "unverified", reason: computed.reason || "數值積分沒有收斂" };
    }
    const actual = compileAnswer([])();
    return compareNumbers("definite-integral", actual, computed.value, toleranceFor(computed, 1e-5));
  }

  // 含參數的積分：答案是參數的函數，掃幾個參數值
  const parameterIndex = integrand.vars.findIndex((name) => name !== variable);
  const answer = compileAnswer([integrand.vars[parameterIndex]]);
  const result = compareFunctions(
    answer,
    (p) => numeric.integrate((x) => {
      const args = integrand.vars.map((_, i) => (i === index ? x : p));
      return integrand(...args);
    }, from, to).value,
    { tolerance: 1e-4, points: [0.7311, 1.3129, 2.1069, 0.4523, 1.6180] }
  );
  return report("parameter-integral", result, "答案應該等於含參數積分的值");
}

function verifyLimit(problem, structure, compileAnswer) {
  const variable = structure.variable;
  const target = evaluateBound(structure.target);
  const body = latex.compile(structure.body, [variable]);
  const computed = numeric.limit(body, target, { side: structure.side === "both" ? "both" : structure.side });

  if (problem.answerKind === "text") {
    // 「不存在」型的題目：極限確實算不出來才算對
    const says = String(problem.canonical || (problem.answers || [])[0] || "");
    if (!isNumericClaim(says)) {
      return { status: "unsupported", reason: `答案「${says}」是解題手法而非數值主張` };
    }
    const doesNotExist = /不存在|DNE|發散/.test(says);
    const numericallyMissing = !Number.isFinite(computed.value);
    if (doesNotExist === numericallyMissing) return { status: "ok", method: "limit-dne", detail: says };
    return {
      status: "mismatch",
      method: "limit-dne",
      detail: `題目說「${says}」，數值上${numericallyMissing ? "算不出極限" : `收斂到 ${computed.value}`}`
    };
  }

  if (!Number.isFinite(computed.value)) {
    return { status: "unverified", reason: computed.reason || "數值極限不收斂" };
  }
  const actual = compileAnswer([])();
  return compareNumbers("limit", actual, computed.value, toleranceFor(computed, 1e-5));
}

function verifySeries(problem, structure, compileAnswer) {
  const variable = structure.variable;
  const from = evaluateBound(structure.from);
  const to = evaluateBound(structure.to);
  const body = latex.compile(structure.body, [variable]);

  if (structure.op === "product") {
    if (!Number.isFinite(to)) return { status: "unsupported", reason: "無窮乘積要手寫 verify" };
    let product = 1;
    for (let n = from; n <= to; n += 1) product *= body(n);
    return compareNumbers("product", compileAnswer([])(), product, 1e-8);
  }

  if (problem.answerKind === "text") {
    // 收斂 / 發散判定
    const says = String(problem.canonical || (problem.answers || [])[0] || "");
    if (!isNumericClaim(says)) {
      return { status: "unsupported", reason: `答案「${says}」是解題手法而非數值主張` };
    }
    // 「conditional」「absolutely」也是在說收斂，只是沒有把「收斂」兩個字寫出來
    const claimsConverge = /收斂|converg|conditional|absolut/i.test(says) && !/發散|diverg/i.test(says);
    const test = numeric.seriesConverges(body, from);
    if (test.unknown) {
      return { status: "unverified", method: "series-convergence", reason: test.reason };
    }

    // 「條件收斂」和「絕對收斂」是兩個不同的宣稱，要分開驗。
    // 只驗「有沒有收斂」的話，把條件收斂寫成絕對收斂會直接過關。
    if (claimsConverge && test.converges && /條件|絕對|absolut|conditional/i.test(says)) {
      const absolute = numeric.seriesConvergesAbsolutely(body, from);
      const claimsAbsolute = /絕對|absolut/i.test(says);
      if (claimsAbsolute !== absolute.converges) {
        return {
          status: "mismatch",
          method: "series-convergence",
          detail: `題目說「${says}」，但 Σ|aₙ| 數值上${absolute.converges ? "收斂" : "發散"}（${absolute.reason || absolute.method}）`
        };
      }
      return { status: "ok", method: "series-convergence", detail: `${says}（Σ|aₙ| ${absolute.converges ? "收斂" : "發散"}，一致）` };
    }

    if (claimsConverge === test.converges) {
      return {
        status: "ok",
        method: "series-convergence",
        detail: test.converges ? `${says}（${test.method}）` : `${says}（${test.reason}）`
      };
    }
    return {
      status: "mismatch",
      method: "series-convergence",
      detail: `題目說「${says}」，數值上${test.converges ? `收斂（${test.method}）` : test.reason}`
    };
  }

  const computed = numeric.seriesSum(body, from, { to: Number.isFinite(to) ? to : undefined });
  if (!Number.isFinite(computed.value)) {
    return { status: "unverified", reason: computed.reason || "級數不收斂或收斂太慢" };
  }
  return compareNumbers("series", compileAnswer([])(), computed.value, toleranceFor(computed, 1e-5));
}

/* ── 手寫 verify 欄位 ──────────────────────────────────────── */

// 自動推導接不住的題（文字敘述題、重積分、極值問題…）用這個 DSL 補。
// 每個 method 都必須是一條**跟解題無關**的獨立算法。
function runExplicit(problem, compileAnswer) {
  const spec = problem.verify;
  try {
    const value = EXPLICIT_METHODS[spec.m]
      ? EXPLICIT_METHODS[spec.m](spec)
      : (() => { throw new Error(`不認得的 verify.m = "${spec.m}"`); })();
    if (!Number.isFinite(value)) {
      return { status: "unverified", reason: `verify 算出 ${value}` };
    }
    const actual = compileAnswer([])();
    return compareNumbers(`verify:${spec.m}`, actual, value, spec.tol || 1e-5);
  } catch (error) {
    return { status: "error", reason: error.message };
  }
}

const EXPLICIT_METHODS = {
  // 直接給一個和題幹寫法不同的等價式子（例如題幹是文字敘述）
  value: (spec) => latex.compile(spec.f, [])(),

  // 泰勒係數：用 Cauchy 積分公式取，不是反覆微分
  taylor: (spec) => {
    const f = latex.compile(spec.f, ["x"]);
    const total = numeric.createSum();
    const radius = spec.r || 0.3;
    const points = 512;
    for (let k = 0; k < points; k += 1) {
      const theta = (2 * Math.PI * k) / points;
      total.add(f(radius * Math.cos(theta)) * Math.cos(spec.n * theta));
    }
    return (2 * total.value) / (points * Math.pow(radius, spec.n));
  },

  // 二重積分：對內層先積，再對外層積
  double: (spec) => {
    const f = latex.compile(spec.f, [spec.u, spec.v]);
    const outerFrom = latex.compile(String(spec.a), [])();
    const outerTo = latex.compile(String(spec.b), [])();
    return numeric.integrate((u) => {
      const innerFrom = latex.compile(String(spec.c), [spec.u])(u);
      const innerTo = latex.compile(String(spec.d), [spec.u])(u);
      return numeric.integrate((v) => f(u, v), innerFrom, innerTo).value;
    }, outerFrom, outerTo).value;
  },

  // 多變數極值：從多個起點做梯度下降/上升，取最好的（避開局部解）
  extremum: (spec) => {
    const names = spec.vars;
    const f = latex.compile(spec.f, names);
    const wantMax = spec.kind === "max";
    let best = wantMax ? -Infinity : Infinity;
    const starts = [0, 1, -1, 2.5, -2.5, 0.3];
    for (const seed of starts) {
      let point = names.map((_, i) => seed + i * 0.37);
      let stepSize = 0.1;
      for (let iteration = 0; iteration < 4000; iteration += 1) {
        const gradient = names.map((_, i) => numeric.partial((...args) => f(...args), point, i, { h: 1e-4 }).value);
        const norm = Math.hypot(...gradient);
        if (!Number.isFinite(norm) || norm < 1e-12) break;
        const next = point.map((value, i) => value + (wantMax ? 1 : -1) * stepSize * gradient[i]);
        const improved = wantMax ? f(...next) > f(...point) : f(...next) < f(...point);
        if (improved) point = next;
        else stepSize /= 2;
        if (stepSize < 1e-14) break;
      }
      const value = f(...point);
      if (Number.isFinite(value) && (wantMax ? value > best : value < best)) best = value;
    }
    return best;
  },

  // 方程式的根（隱函數微分、牛頓法題型）
  root: (spec) => {
    const f = latex.compile(spec.f, ["x"]);
    let x = spec.x0 === undefined ? 1 : spec.x0;
    for (let i = 0; i < 200; i += 1) {
      const slope = numeric.derivative(f, x).value;
      if (!Number.isFinite(slope) || slope === 0) break;
      const next = x - f(x) / slope;
      if (Math.abs(next - x) < 1e-14) return next;
      x = next;
    }
    return x;
  },

  // 弧長 / 旋轉體體積 / 表面積：積分式由 verify 指定，和題幹的敘述無關
  integral: (spec) => {
    const variable = spec.v || "x";
    const f = latex.compile(spec.f, [variable]);
    return numeric.integrate(f, latex.compile(String(spec.a), [])(), latex.compile(String(spec.b), [])()).value;
  },

  // 級數和
  series: (spec) => {
    const variable = spec.v || "n";
    const term = latex.compile(spec.f, [variable]);
    return numeric.seriesSum(term, Number(spec.from), { to: spec.to === undefined ? undefined : Number(spec.to) }).value;
  },

  // 某點的（偏）導數
  deriv: (spec) => {
    const names = spec.vars || ["x"];
    const f = latex.compile(spec.f, names);
    const point = spec.at.map((value) => latex.compile(String(value), [])());
    const index = spec.wrt === undefined ? 0 : names.indexOf(spec.wrt);
    return numeric.partial((...args) => f(...args), point, index, { order: spec.order || 1 }).value;
  }
};

/* ── 回報 ──────────────────────────────────────────────────── */

function compareNumbers(method, actual, expected, tolerance) {
  if (!Number.isFinite(actual)) {
    return { status: "error", method, reason: `答案求值得到 ${actual}` };
  }
  if (numeric.close(actual, expected, tolerance)) {
    return { status: "ok", method, detail: `${format(actual)} ≈ ${format(expected)}` };
  }
  return {
    status: "mismatch",
    method,
    detail: `答案 ${format(actual)}，獨立算出來是 ${format(expected)}`,
    actual,
    expected,
    ratio: expected === 0 ? null : actual / expected
  };
}

function report(method, result, description) {
  if (result.ok) return { status: "ok", method, detail: `${description}（比對 ${result.checked} 點）` };
  if (result.insufficient) {
    return { status: "unverified", method, reason: `可用的取樣點只有 ${result.checked} 個，不足以下結論` };
  }
  return {
    status: "mismatch",
    method,
    detail: `${description}；在 x=${result.worst.x} 時答案給 ${format(result.worst.expected)}，獨立算出來是 ${format(result.worst.actual)}`,
    actual: result.worst.expected,
    expected: result.worst.actual
  };
}

function format(value) {
  if (!Number.isFinite(value)) return String(value);
  return Math.abs(value) < 1e-10 ? "0" : Number(value.toPrecision(10)).toString();
}

// 題幹裡出現的變數 ∪ 題目宣告的變數
function unionVars(body, problem, primary) {
  const declared = problem.variables || (problem.variable ? [problem.variable] : []);
  const found = latex.freeVariables(latex.toJs(body));
  const all = new Set([...found, ...declared, primary]);
  // 順序要穩定：主變數排第一，其餘照字母序
  return [primary, ...[...all].filter((name) => name !== primary).sort()];
}

function substitute(names, variable, value) {
  return names.map((name) => (name === variable ? value : 0.7311));
}

module.exports = {
  verifyProblem, topLevelOperator, stripDomain, satisfiesDomain,
  stripTrailingText, readBraced, EXPLICIT_METHODS
};
