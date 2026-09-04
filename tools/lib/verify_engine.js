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
const taylor = require("./taylor_rational.js");

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

// 題幹尾巴的「\text{ 在 }x=1」「\text{ at }x=-1」：在某個點求值。
// 微分題把它當 |_{x=1}；級數題把該值代進通項（收斂判定在端點的題型）。
const EVAL_AT_TAIL = /(?:\\quad|\\qquad|\\,|\\;|\\ |\s)*\\text\{\s*(?:在|at)\s*\}\s*([a-zA-Z])\s*=\s*(.+?)\s*$/;

function topLevelOperator(rawPrompt) {
  const withoutText = stripTrailingText(String(rawPrompt || ""));
  let source = withoutText.body;
  let evalAt = null;
  const evalTail = source.match(EVAL_AT_TAIL);
  if (evalTail) {
    evalAt = { variable: evalTail[1], value: evalTail[2] };
    source = source.slice(0, evalTail.index);
  }
  const stripped = stripDomain(source);
  const parsed = parseOperator(stripped.body);
  if (parsed) {
    parsed.domain = stripped.domain;
    parsed.note = withoutText.note;
    if (evalAt) {
      if ((parsed.op === "derivative" || parsed.op === "partial") && parsed.at === null && evalAt.variable === parsed.variable) {
        parsed.at = evalAt.value;
      } else {
        parsed.evalAt = evalAt;
      }
    }
  }
  return parsed;
}

function parseOperator(prompt) {
  // \left.\frac{d^{20}}{dx^{20}}(…)\right|_{x=0} 的開頭 \left. 只是配對用的
  // 空定界符 —— 剝掉它，讓微分算子落在字串開頭
  const source = String(prompt || "").replace(/^\\left\.\s*/, "");

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
  // \tfrac/\dfrac 是排版差異不是數學差異，一律當 \frac
  const trimmed = String(text).trim().replace(/\\[td]frac/g, "\\frac");
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

    // 兩邊都已經退化到接近 0 的點，比不出對錯。
    //
    // 上面那道關卡擋的是「誤差相對於 b 太大」，但 b 本身是 1e-9 的時候
    // Math.max(1, |b|) 等於 1，於是它形同虛設，接著相對容差就會把
    // 3.176966798e-9 跟 3.177110476e-9 判成不符 —— 那兩個數在任何意義下都是同一個。
    //
    // 實際踩到的三題：cosh²(3x)−sinh²(3x) 的導數恆為 0，但兩個大數相減的
    // 抵消誤差讓數值微分在 x=2.53 回報 −1.97e-6（而它自己回報的誤差也是 1.97e-6，
    // 也就是引擎知道這是噪音）；arcsin(tanh(x²)) 在 x=4.67 的真值是 6e-9，
    // 數值微分直接下溢成 0。三題的答案在合理取樣點都對到 12 位有效數字。
    //
    // 誤判成本不對稱：假警報會逼作者去改**正確**的內容，比漏抓更糟。
    // 兩邊都小到連導數都稱不上（含數值下溢成 0 的情況）——
    // 這個點證明不了任何事，所以不算進 checked，也不判錯。
    if (Math.max(Math.abs(a), Math.abs(b)) < 1e-7) continue;

    checked += 1;

    // 引擎自己回報的不確定度蓋得住這個差距 → 這個點**通過**。
    //
    // 第一版把這條寫成 continue-before-checked，等於把「答案對得上」的點
    // 全部丟掉、只留下對不上的 —— 58 題裡 50 題變成「取樣點不足，驗不了」。
    // 那比原本那 3 個假警報糟得多：假警報至少會叫，驗不了是安靜地沒把關。
    if (Number.isFinite(uncertainty) && uncertainty > 0 && Math.abs(a - b) <= 4 * uncertainty) continue;
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
/* ── 文字句型的自動驗算 ─────────────────────────────────────── */

// 「Radius of convergence of Σ…」：不解析係數，直接掃收斂邊緣。
//
// 冪級數在 |x−c|<R 收斂、>R 發散 —— 所以對一排 x 值做「項有沒有幾何衰減」
// 的檢定，找出上緣 u 與下緣 l，R = (u−l)/2。這條路對中心不在 0 的
// (x−2)^n 一樣成立，而且完全不用把 aₙ 從項裡拆出來。
function seriesTermGrowth(term, x) {
  // 幾何比估計，三點版 (t(4N)·t(N)/t(2N)²)^(1/2N)：n^k 型因子精確相消。
  //
  // N 不能寫死。兩種浮點災難都實際踩過：
  //   (x-2)^n/5^n 的分子在 4.9^480 溢位 → Infinity/Infinity = NaN，
  //   半徑內的點被誤判成發散；
  //   n!x^n 在 x=0.002 時 x^120 下溢成 0，term 直接回 0，
  //   「下溢=快收斂」的捷徑把一個終究發散的級數判成收斂。
  // 所以先用倍增掃出「還算得出非零有限值」的最大 n，再取 N = nmax/4，
  // 讓三個取樣點全部落在可算範圍內。
  let nmax = 15;
  for (let n = 30; n <= 960; n *= 2) {
    const t = Math.abs(term(n, x));
    if (!Number.isFinite(t) || t === 0) break;
    nmax = n;
  }
  const N = Math.max(8, Math.floor(nmax / 4));
  const a = Math.abs(term(N, x));
  const b = Math.abs(term(2 * N, x));
  const c = Math.abs(term(4 * N, x));
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) return Infinity;
  if (c === 0 && b === 0) return 0;
  if (a === 0 || b === 0) return Infinity;
  // 階乘型的判準：冪級數的每步比值趨於常數，階乘型的比值 ~ n·x 無上界。
  // 後段比值明顯大於前段 → 不管現在多小，終究發散。
  const g1 = Math.pow(b / a, 1 / N);
  const g2 = Math.pow(c / b, 1 / (2 * N));
  // 門檻隨視窗縮放：小視窗的 (1+c/n) 暫態本身就有幾個百分點，
  // 固定 1.02 會把 (3n)!/(n!)³ 的暫態誤判成階乘發散（實測 N=8 時差 3.6%）。
  // 真正的階乘型（比值 ~ n·x）在任何視窗都是倍數級的加速，抓得到。
  const accelThreshold = 1 + Math.max(0.02, 2 / N);
  if (Number.isFinite(g1) && Number.isFinite(g2) && g1 > 0 && g2 > g1 * accelThreshold) return Infinity;
  // 對稱的另一面：比值明顯**遞減**是 xⁿ/n! 型的指紋 —— 終究收斂。
  // 沒有這條的話，x 大到溢位把取樣視窗壓到項的峰值之前，
  // 視窗裡只看得到「還在變大」的段落，整條實軸收斂的級數會被判成
  // 在 x≈176 發散（Σxⁿ/n! 實測）。冪級數在半徑外的比值趨於常數，
  // 多項式因子的暫態只有 2^(k/2N)，同一個門檻擋得住。
  if (Number.isFinite(g1) && Number.isFinite(g2) && g2 > 0 && g2 < g1 * (2 - accelThreshold)) return 0;
  const product = c * a;
  if (product === 0) return 0;
  return Math.pow(product / (b * b), 1 / (2 * N));
}

function scanConvergenceEdge(term, from, direction) {
  // 由 from 往 direction 走，回傳最後一個收斂點與第一個發散點的中點。
  // 先指數步進找到發散，再對分 40 次收斂到 1e-9 相對精度。
  let good = from;
  let bad = null;
  let step = 0.25;
  for (let i = 0; i < 80; i += 1) {
    const probe = good + direction * step;
    if (seriesTermGrowth(term, probe) > 1.0005) { bad = probe; break; }
    good = probe;
    step *= 1.6;
    if (Math.abs(good - from) > 1e6) return direction * Infinity;
  }
  if (bad === null) return direction * Infinity;
  // 對分的門檻是 1.0 不是 1.0005：三點估計量在邊緣上是無偏的，
  // 拿 1.0005 當門檻等於把半徑硬放大 0.05%（實測 1.001、3.003 就是這樣來的）。
  for (let i = 0; i < 60; i += 1) {
    const mid = (good + bad) / 2;
    if (seriesTermGrowth(term, mid) > 1) bad = mid;
    else good = mid;
  }
  return (good + bad) / 2;
}

function verifyRadiusOfConvergence(problem, body, variable, compileAnswer) {
  const term = latex.compile(body, [variable, "x"]);
  const wrapped = (n, x) => term(n, x);
  // text 答案的半徑題只有兩種可比的主張：「無窮大」與「0」
  const textClaim = problem.answerKind === "text"
    ? String(problem.canonical || (problem.answers || [])[0] || "")
    : null;
  const claimsInfinite = textClaim !== null && /infinit|無窮|infty|∞/i.test(textClaim);

  // 起點必須真的落在收斂區內 —— (x-2)^n/n 這種中心在 2 的級數，
  // x=0 是發散點，從那裡起掃整片都發散、半徑會變 0（實測踩到）。
  // 從 0 往外找第一個 growth ≤ 1 的點當起點；都找不到就真的是 R=0。
  let start = null;
  const candidates = [0];
  for (let c = 0.5; c <= 10; c += 0.5) candidates.push(c, -c);
  for (const candidate of candidates) {
    if (seriesTermGrowth(wrapped, candidate) <= 1) { start = candidate; break; }
  }
  if (start === null) {
    if (textClaim !== null) {
      if (/^0|零/.test(textClaim.trim())) return { status: "ok", method: "radius", detail: "整條實軸都發散 → R=0，與答案一致" };
      if (claimsInfinite) return { status: "mismatch", method: "radius", detail: `答案說 R=∞，但數值上處處發散（R=0）` };
      return { status: "unsupported", reason: `text 答案「${textClaim}」不是可比對的半徑` };
    }
    return compareNumbers("radius", compileAnswer([])(), 0, 1e-3);
  }
  const upper = scanConvergenceEdge(wrapped, start, +1);
  const lower = scanConvergenceEdge(wrapped, start, -1);
  if (!Number.isFinite(upper) || !Number.isFinite(lower)) {
    // 兩邊都掃不到發散：半徑無限大
    if (textClaim !== null) {
      if (claimsInfinite) return { status: "ok", method: "radius", detail: "掃不到發散邊緣 → R=∞，與答案一致" };
      return { status: "mismatch", method: "radius", detail: `數值上半徑是 ∞，答案卻說「${textClaim}」` };
    }
    const actualInf = compileAnswer([])();
    if (!Number.isFinite(actualInf)) return { status: "ok", method: "radius", detail: "∞ ≈ ∞" };
    return { status: "unverified", reason: "掃不到發散邊緣（半徑可能是 ∞），答案卻是有限值 " + actualInf };
  }
  const radius = (upper - lower) / 2;
  if (textClaim !== null) {
    if (claimsInfinite) return { status: "mismatch", method: "radius", detail: `答案說 R=∞，但數值上在 ${format(radius)} 就發散` };
    return { status: "unsupported", reason: `text 答案「${textClaim}」不是可比對的半徑` };
  }
  const actual = compileAnswer([])();
  // 容差 1e-3：階乘比級數溢位得早、取樣視窗小，量測誤差就是 1e-4 這一級。
  // 錯的半徑跟對的差的是倍數，1e-3 擋得住。
  return compareNumbers("radius", actual, radius, 1e-3);
}

// 「Coefficient of x^k in f」：Chebyshev 插值 → 轉單項式係數。
//
// 有限差分在 k≥4 會被捨入誤差吃掉；Chebyshev 節點上的插值是數值穩定的，
// 低階（k≤8）轉回單項式基底的條件數也還好。取樣半徑 0.25 —— 要求 f 在
// 這個範圍解析（(1+x)^x、e^{2arcsin x} 都成立）。
function taylorCoefficientOf(f, k) {
  const r = 0.25;
  const N = 48; // Chebyshev 點數（degree N-1 插值）
  const values = [];
  for (let j = 0; j < N; j += 1) {
    const theta = (Math.PI * (j + 0.5)) / N;
    values.push(f(r * Math.cos(theta)));
  }
  if (values.some((v) => !Number.isFinite(v))) return Number.NaN;
  // Chebyshev 係數（DCT-II 形式）
  const degree = Math.min(N - 1, k + 14);
  const cheb = [];
  for (let m = 0; m <= degree; m += 1) {
    let sum = 0;
    for (let j = 0; j < N; j += 1) {
      sum += values[j] * Math.cos((m * Math.PI * (j + 0.5)) / N);
    }
    cheb.push((2 / N) * sum);
  }
  cheb[0] /= 2;
  // Chebyshev → 單項式：T_{m+1} = 2t·T_m − T_{m−1}（t = x/r）
  let prev = [1];            // T_0
  let curr = [0, 1];         // T_1
  const mono = new Array(degree + 1).fill(0);
  const addPoly = (poly, coeff) => poly.forEach((value, i) => { mono[i] += coeff * value; });
  addPoly(prev, cheb[0]);
  if (degree >= 1) addPoly(curr, cheb[1]);
  for (let m = 2; m <= degree; m += 1) {
    const next = new Array(curr.length + 1).fill(0);
    curr.forEach((value, i) => { next[i + 1] += 2 * value; });
    prev.forEach((value, i) => { next[i] -= value; });
    addPoly(next, cheb[m]);
    prev = curr;
    curr = next;
  }
  // t = x/r → x 的係數要除 r^k
  return (mono[k] || 0) / Math.pow(r, k);
}

function verifyTaylorCoefficient(problem, exprTex, k, compileAnswer) {
  // 先試有理級數（精確、階數不限），展不開再退回 Chebyshev 萃取（k ≤ 8）
  let js = null;
  try { js = latex.toJs(exprTex.replace(/\\left|\\right/g, "")); } catch (_error) { js = null; }
  if (js && latex.freeVariables(js).every((name) => name === "x")) {
    const coefficients = taylor.taylorCoefficients(js, k);
    if (coefficients) {
      const exact = taylor.parseExactAnswer(problem.answer);
      if (exact) {
        if (taylor.fEq(exact, coefficients[k])) {
          return { status: "ok", method: "taylor-coefficient", detail: `${problem.answer} = a_${k}（有理級數，精確比對）` };
        }
        return {
          status: "mismatch",
          method: "taylor-coefficient",
          detail: `答案 ${problem.answer}，有理級數精確算出 ${coefficients[k].n}${coefficients[k].d === 1n ? "" : "/" + coefficients[k].d}`,
          actual: taylor.fToNumber(exact),
          expected: taylor.fToNumber(coefficients[k])
        };
      }
      return compareNumbers("taylor-coefficient", compileAnswer([])(), taylor.fToNumber(coefficients[k]), 1e-9);
    }
  }
  if (k > 8) return { status: "unsupported", reason: "x^" + k + " 的係數超出數值萃取的穩定範圍（k ≤ 8）" };
  const f = latex.compile(exprTex, ["x"]);
  const coefficient = taylorCoefficientOf(f, k);
  if (!Number.isFinite(coefficient)) return { status: "unverified", reason: "函數在取樣半徑內算不出值" };
  return compareNumbers("taylor-coefficient", compileAnswer([])(), coefficient, 1e-5);
}

// 「Hessian determinant of f (at (a,b))」：數值二階偏導。
function verifyHessianDet(problem, fTex, point, compileAnswer) {
  const f = latex.compile(fTex, ["x", "y"]);
  const h = 1e-3;
  const detAt = (x, y) => {
    const fxx = (f(x + h, y) - 2 * f(x, y) + f(x - h, y)) / (h * h);
    const fyy = (f(x, y + h) - 2 * f(x, y) + f(x, y - h)) / (h * h);
    const fxy = (f(x + h, y + h) - f(x + h, y - h) - f(x - h, y + h) + f(x - h, y - h)) / (4 * h * h);
    return fxx * fyy - fxy * fxy;
  };
  if (point) {
    let det = detAt(point[0], point[1]);
    // 二階中央差分的截斷殘差是 O(h²)：x⁴ 在原點的 fxx 數值上是 2h²=2e-6，
    // 真值是 0。小到殘差等級就是 0，不然「答案 0」永遠比不過。
    if (Math.abs(det) < 1e-4) det = 0;
    return compareNumbers("hessian", compileAnswer([])(), det, 1e-3);
  }
  // 沒給點：只有 Hessian 是常數時這題才良定義。取三個點驗證一致。
  const samples = [detAt(0.3, -0.2), detAt(1.1, 0.7), detAt(-0.6, 0.9)];
  const spread = Math.max(...samples) - Math.min(...samples);
  if (spread > 1e-2 * Math.max(1, Math.abs(samples[0]))) {
    return { status: "unverified", reason: "Hessian 不是常數但題目沒給點" };
  }
  return compareNumbers("hessian", compileAnswer([])(), samples[0], 1e-3);
}

function recognizeTextForm(rawPrompt) {
  const prompt = String(rawPrompt || "");

  // Radius of convergence / 收斂半徑
  const radius = prompt.match(/^\\text\{(?:Radius of convergence of ?|radius of convergence of ?|收斂半徑[：: ]*)\}(.+)$/) ||
    prompt.match(/^\\text\{收斂半徑[：: ]*\}(.+)$/);
  if (radius) {
    const series = topLevelOperator(radius[1].trim());
    if (series && series.op === "series") {
      return (problem, compileAnswer) => verifyRadiusOfConvergence(problem, series.body, series.variable, compileAnswer);
    }
  }

  // 「Σ… 的收斂半徑」：中文後綴形
  const radiusSuffix = prompt.match(/^(.+?)(?:\\ |\s)*\\text\{\s*的收斂半徑\s*\}$/);
  if (radiusSuffix) {
    const series = topLevelOperator(radiusSuffix[1].trim());
    if (series && series.op === "series") {
      return (problem, compileAnswer) => verifyRadiusOfConvergence(problem, series.body, series.variable, compileAnswer);
    }
  }

  // Coefficient of x^k in f（大寫／小寫／中文「求 x^k 在 f 的係數」三種寫法）
  const coefficient = prompt.match(/^\\text\{[Cc]oefficient of \}x(?:\^\{?(\d+)\}?)?\\text\{ in \}(.+?)(?:=[^=]*\\cdots)?$/) ||
    prompt.match(/^\\text\{求 \}x(?:\^\{?(\d+)\}?)?\\text\{ 在 \}(.+?)\\text\{ 的係數\}$/);
  if (coefficient) {
    const k = Number(coefficient[1] || 1);
    const expr = coefficient[2].trim();
    // Bessel 函數：latex 編不動 J_n。係數用定義級數精確算 ——
    // J_n(x)=Σ(−1)^m/(m!(m+n)!)(x/2)^{n+2m}，這是定義不是解題步驟。
    // （Chebyshev 萃取在 k=8 時 a₈·r⁸ ≈ 1e-10，已經在積分噪音層，量不到。）
    const besselIn = expr.match(/^J_\{?(\d)\}?\(x\)$/);
    if (besselIn) {
      const n = Number(besselIn[1]);
      return (problem, compileAnswer) => {
        if (k < n || (k - n) % 2 !== 0) {
          return compareNumbers("taylor-coefficient", compileAnswer([])(), 0, 1e-9);
        }
        const m = (k - n) / 2;
        const fact = (v) => { let r = 1n; for (let i = 2n; i <= BigInt(v); i += 1n) r *= i; return r; };
        const exact = taylor.frac((m % 2 === 0 ? 1n : -1n), fact(m) * fact(m + n) * (2n ** BigInt(k)));
        return compareNumbers("taylor-coefficient", compileAnswer([])(), taylor.fToNumber(exact), 1e-9);
      };
    }
    return (problem, compileAnswer) => verifyTaylorCoefficient(problem, expr, k, compileAnswer);
  }

  // Hessian determinant of f=… ( at (a,b) )
  const hessian = prompt.match(/^\\text\{Hessian determinant of \}f=([^\\]+?)(?:\\text\{ at \}\((-?[\d.]+),(-?[\d.]+)\))?$/);
  if (hessian) {
    const fTex = hessian[1].trim();
    const point = hessian[2] !== undefined ? [Number(hessian[2]), Number(hessian[3])] : null;
    return (problem, compileAnswer) => verifyHessianDet(problem, fTex, point, compileAnswer);
  }

  return null;
}

// 多變數極限：沿多條路徑逼近，全部一致才算數；兩條路徑持續不合 → dne。
function verifyMultivarLimit(problem, bodyTex, compileAnswer) {
  const f = latex.compile(bodyTex, ["x", "y"]);
  const paths = [
    (t) => [t, 0], (t) => [0, t], (t) => [t, t], (t) => [t, -t],
    (t) => [t, 2 * t], (t) => [2 * t, t], (t) => [t, t * t], (t) => [t * t, t]
  ];
  const valuesAt = (t) => paths.map(([, ] = [], index) => {
    const [x, y] = paths[index](t);
    return f(x, y);
  });
  // 每條路徑取「最深的非零有限值」。深處取到精確 0 有兩種可能：
  // 真的趨近 0，或災難性相消（1-cos(xy) 在 xy<1e-8 時 cos 回傳恰好 1）。
  // 相消的路徑在較淺的深度有非零值 —— 用那個值；一路全零的路徑才算 0。
  const perPath = paths.map(() => ({ value: null, sawFinite: false }));
  for (let k = 2; k <= 7; k += 1) {
    const t = Math.pow(10, -k);
    paths.forEach((path, index) => {
      const [x, y] = path(t);
      const value = f(x, y);
      if (!Number.isFinite(value)) return;
      perPath[index].sawFinite = true;
      if (value !== 0) perPath[index].value = value;
      else if (perPath[index].value === null) perPath[index].value = 0;
    });
  }
  const settled = perPath.filter((entry) => entry.sawFinite && entry.value !== null).map((entry) => entry.value);
  if (settled.length < 4) return { status: "unverified", reason: "有限值的路徑不足四條" };
  const spread = Math.max(...settled) - Math.min(...settled);
  const spreadShrinks = true;
  const last = { values: settled, spread };
  let mean = last.values.reduce((a, b) => a + b, 0) / last.values.length;
  // t=1e-7 時 x²y/(x²+y²) 這類的取樣值是 O(t)：mean 小到雜訊等級就是 0。
  if (Math.abs(mean) < 1e-6 && last.spread < 1e-6) mean = 0;
  const answerText = String(problem.answer || "").trim();

  if (/^dne$/i.test(answerText)) {
    // 「不存在」要正面證據：路徑間的差距不縮
    if (last.spread > 1e-4 * Math.max(1, Math.abs(mean))) {
      return { status: "ok", method: "multivar-dne", detail: "路徑極限不一致（差 " + last.spread.toExponential(2) + "）" };
    }
    return { status: "unverified", reason: "答案說 dne，但取樣的路徑都收到同一個值 " + mean };
  }

  if (last.spread > 1e-3 * Math.max(1, Math.abs(mean)) || !spreadShrinks) {
    return { status: "unverified", reason: "路徑極限不一致（差 " + last.spread.toExponential(2) + "），答案卻不是 dne" };
  }
  return compareNumbers("multivar-limit", compileAnswer([])(), mean, 1e-3);
}

/* ── 第二輪句型：留數、疊積分、參數式、卷積、多變數 ─────────── */

// 留數 Res_{z=c} f(z)：不碰複數運算。
// 極點階數 m 的留數 = (z−c)^m·f(z) 在 c 的第 (m−1) 階泰勒係數，
// 而題庫的 f 都是實係數函數 —— 在實軸上取樣就足夠。
// m 用試的：找最小的 m 讓 (z−c)^m f(z) 在 c 有非零有限極限。
function verifyResidue(problem, center, bodyTex, compileAnswer) {
  const f = latex.compile(bodyTex, ["z"]);
  const c = latex.compile(String(center), [])();
  const shifted = (m) => (t) => Math.pow(t, m) * f(c + t);
  let order = -1;
  for (let m = 0; m <= 6; m += 1) {
    const g = shifted(m);
    const probes = [1e-3, 5e-4, 2.5e-4].map(g);
    if (probes.every((v) => Number.isFinite(v))) {
      const spread = Math.max(...probes) - Math.min(...probes);
      const scale = Math.max(1e-9, Math.abs(probes[2]));
      if (spread / scale < 0.05 && Math.abs(probes[2]) > 1e-9) { order = m; break; }
      // 全部趨近 0 的話極點階數還要更小 —— 但 m=0 就趨近 0 代表函數在 c 是 0，留數 0
      if (m === 0 && probes.every((v) => Math.abs(v) < 1e-9)) { order = 0; break; }
    }
  }
  if (order < 0) return { status: "unverified", reason: "找不出極點階數" };
  if (order === 0) {
    // 沒有極點：留數是 0
    return compareNumbers("residue", compileAnswer([])(), 0, 1e-5);
  }
  // 留數 = g(t) = t^m f(c+t) 的第 (m−1) 階泰勒係數
  const g = shifted(order);
  const coeff = taylorCoefficientOf(g, order - 1);
  if (!Number.isFinite(coeff)) return { status: "unverified", reason: "係數萃取失敗" };
  return compareNumbers("residue", compileAnswer([])(), coeff, 1e-4);
}

// 疊積分（顯式界限）：\int_a^b \int_c^d body dInner dOuter。
// 只接界限是常數的形（∬_D 區域描述型仍走手寫 verify）。
function verifyIteratedIntegral(problem, spec, compileAnswer) {
  const inner = (outerValue) => {
    const g = latex.compile(spec.body, [spec.innerVar, spec.outerVar]);
    return numeric.integrate((t) => g(t, outerValue), spec.innerFrom, spec.innerTo).value;
  };
  const total = numeric.integrate(inner, spec.outerFrom, spec.outerTo).value;
  if (!Number.isFinite(total)) return { status: "unverified", reason: "疊積分數值不收斂" };
  return compareNumbers("iterated-integral", compileAnswer([])(), total, 1e-4);
}

// 參數式 x=f(t), y=g(t)：dy/dx = g'/f'，d²y/dx² = (dy/dx)'/f'。
// 答案是 t 的函數（expression）或在某個 t 的值（numeric）。
function verifyParametric(problem, xTex, yTex, order, atT, compileAnswer) {
  const fx = latex.compile(xTex, ["t"]);
  const fy = latex.compile(yTex, ["t"]);
  const slope = (t) => {
    const dx = numeric.derivative(fx, t).value;
    const dy = numeric.derivative(fy, t).value;
    return dy / dx;
  };
  const target = order === 2
    ? (t) => numeric.derivative(slope, t).value / numeric.derivative(fx, t).value
    : slope;
  if (atT !== null) {
    const tValue = latex.compile(String(atT), [])();
    return compareNumbers("parametric", compileAnswer([])(), target(tValue), 1e-3);
  }
  const answerFn = compileAnswer(["t"]);
  // 誤差回報要壓在 compareFunctions 的「不可信就跳過」門檻（1e-4·|b|）之下，
  // 不然 |斜率|≥1 的取樣點全部被當成不可信丟掉（實測只剩 2 點）。
  return report("parametric", compareFunctions(answerFn, (t) => ({ value: target(t), error: Math.abs(target(t)) * 2e-5 + 1e-7 }), {
    tolerance: 1e-3,
    points: [0.4, 0.7, 1.1, 1.6, 2.2, -0.6, -1.3]
  }), "答案應該等於參數式的導數");
}

// 卷積型 F(x) = ∫₀^x body(x,t) dt：答案是 x 的函數。
// 對幾個 x 值做數值積分，跟答案函數比。
function verifyConvolution(problem, bodyTex, compileAnswer) {
  const g = latex.compile(bodyTex, ["x", "t"]);
  const F = (x) => numeric.integrate((t) => g(x, t), 0, x).value;
  const answerFn = compileAnswer(["x"]);
  return report("convolution", compareFunctions(answerFn, (x) => ({ value: F(x), error: Math.abs(F(x)) * 1e-5 + 1e-8 }), {
    tolerance: 1e-4,
    points: [0.3, 0.7, 1.1, 1.6, 2.1]
  }), "答案應該等於 ∫₀ˣ 的卷積值");
}

// 多變數句型的數值工具
function numericPartial(f, x, y, which, h = 1e-4) {
  if (which === "x") return (f(x + h, y) - f(x - h, y)) / (2 * h);
  return (f(x, y + h) - f(x, y - h)) / (2 * h);
}

function verifyMultivarSentence(problem, kind, payload, compileAnswer) {
  const SAMPLES = [[0.4, 0.7], [1.1, -0.5], [-0.8, 1.3], [1.7, 0.9]];
  if (kind === "laplacian") {
    const f = latex.compile(payload.f, ["x", "y"]);
    const h = 1e-3;
    const lap = (x, y) => (f(x + h, y) - 2 * f(x, y) + f(x - h, y)) / (h * h)
      + (f(x, y + h) - 2 * f(x, y) + f(x, y - h)) / (h * h);
    if (problem.answerKind === "numeric") {
      const values = SAMPLES.map(([x, y]) => lap(x, y));
      const spread = Math.max(...values) - Math.min(...values);
      if (spread > 1e-2 * Math.max(1, Math.abs(values[0]))) {
        return { status: "unverified", reason: "Laplacian 不是常數但答案是單一數值" };
      }
      return compareNumbers("laplacian", compileAnswer([])(), values[0], 1e-3);
    }
    const answerFn = compileAnswer(["x", "y"]);
    for (const [x, y] of SAMPLES) {
      if (Math.abs(answerFn(x, y) - lap(x, y)) > 1e-2 * Math.max(1, Math.abs(lap(x, y)))) {
        return { status: "mismatch", method: "laplacian", detail: "(" + x + "," + y + ") 處不合" };
      }
    }
    return { status: "ok", method: "laplacian", detail: SAMPLES.length + " 點一致" };
  }
  if (kind === "jacobian") {
    const u = latex.compile(payload.u, ["x", "y"]);
    const v = latex.compile(payload.v, ["x", "y"]);
    const det = (x, y) =>
      numericPartial(u, x, y, "x") * numericPartial(v, x, y, "y") -
      numericPartial(u, x, y, "y") * numericPartial(v, x, y, "x");
    if (problem.answerKind === "numeric") {
      return compareNumbers("jacobian", compileAnswer([])(), det(0.7, 0.4), 1e-3);
    }
    const answerFn = compileAnswer(["x", "y"]);
    for (const [x, y] of SAMPLES) {
      if (Math.abs(answerFn(x, y) - det(x, y)) > 1e-3 * Math.max(1, Math.abs(det(x, y)))) {
        return { status: "mismatch", method: "jacobian", detail: "(" + x + "," + y + ") 處不合" };
      }
    }
    return { status: "ok", method: "jacobian", detail: SAMPLES.length + " 點一致" };
  }
  if (kind === "directional") {
    const f = latex.compile(payload.f, ["x", "y"]);
    const [px, py] = payload.point;
    const [dx, dy] = payload.direction;
    const norm = Math.hypot(dx, dy);
    const value = numericPartial(f, px, py, "x") * (dx / norm) + numericPartial(f, px, py, "y") * (dy / norm);
    return compareNumbers("directional", compileAnswer([])(), value, 1e-3);
  }
  if (kind === "mixed-partial") {
    const f = latex.compile(payload.f, ["x", "y"]);
    const h = 1e-3;
    const mixed = (x, y) => (f(x + h, y + h) - f(x + h, y - h) - f(x - h, y + h) + f(x - h, y - h)) / (4 * h * h);
    const answerFn = compileAnswer(["x", "y"]);
    for (const [x, y] of SAMPLES) {
      const want = mixed(x, y);
      if (!Number.isFinite(want)) continue;
      if (Math.abs(answerFn(x, y) - want) > 5e-3 * Math.max(1, Math.abs(want))) {
        return { status: "mismatch", method: "mixed-partial", detail: "(" + x + "," + y + ") 處不合" };
      }
    }
    return { status: "ok", method: "mixed-partial", detail: "取樣點一致" };
  }
  if (kind === "min2d") {
    const f = latex.compile(payload.f, ["x", "y"]);
    // 粗網格找起點，再座標下降收斂 —— 題庫的二次型一定抓得到
    let best = { v: Infinity, x: 0, y: 0 };
    for (let x = -6; x <= 6; x += 0.5) {
      for (let y = -6; y <= 6; y += 0.5) {
        const v = f(x, y);
        if (Number.isFinite(v) && v < best.v) best = { v, x, y };
      }
    }
    let step = 0.25;
    for (let iter = 0; iter < 200 && step > 1e-7; iter += 1) {
      let moved = false;
      for (const [ddx, ddy] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
        const v = f(best.x + ddx, best.y + ddy);
        if (v < best.v) { best = { v, x: best.x + ddx, y: best.y + ddy }; moved = true; }
      }
      if (!moved) step /= 2;
    }
    return compareNumbers("min2d", compileAnswer([])(), best.v, 1e-4);
  }
  return { status: "unsupported", reason: "未知的多變數句型" };
}

// Wronskian W(f, g) = f·g' − f'·g
function verifyWronskian(problem, fTex, gTex, compileAnswer) {
  const f = latex.compile(fTex, ["x"]);
  const g = latex.compile(gTex, ["x"]);
  const w = (x) => f(x) * numeric.derivative(g, x).value - numeric.derivative(f, x).value * g(x);
  if (problem.answerKind === "numeric") {
    return compareNumbers("wronskian", compileAnswer([])(), w(0.7), 1e-3);
  }
  const answerFn = compileAnswer(["x"]);
  // 2e-5：要低於 compareFunctions 的 1e-4·|b| 跳點門檻（同 parametric 的教訓）
  return report("wronskian", compareFunctions(answerFn, (x) => ({ value: w(x), error: Math.abs(w(x)) * 2e-5 + 1e-7 }), { tolerance: 1e-3 }), "答案應該等於 Wronskian");
}

// 三函數的 Wronskian：3×3 行列式，二階導用中央差分。
function verifyWronskian3(problem, fTexes, compileAnswer) {
  const fns = fTexes.map((tex) => latex.compile(tex, ["x"]));
  const rowFor = (f, x) => {
    const h = 1e-3;
    return [f(x), numeric.derivative(f, x).value, (f(x + h) - 2 * f(x) + f(x - h)) / (h * h)];
  };
  const w = (x) => {
    const m = fns.map((f) => rowFor(f, x));
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[1][0] * (m[0][1] * m[2][2] - m[0][2] * m[2][1]) +
      m[2][0] * (m[0][1] * m[1][2] - m[0][2] * m[1][1])
    );
  };
  if (problem.answerKind === "numeric") {
    return compareNumbers("wronskian", compileAnswer([])(), w(0.7), 1e-2);
  }
  const answerFn = compileAnswer(["x"]);
  return report("wronskian", compareFunctions(answerFn, (x) => ({ value: w(x), error: Math.abs(w(x)) * 2e-5 + 1e-6 }), { tolerance: 1e-2 }), "答案應該等於三函數的 Wronskian");
}

function recognizeRound2(problem) {
  const prompt = String(problem.prompt || "");

  const res = prompt.match(/^\\operatorname\{Res\}_\{z=([^}]+)\}(.+)$/);
  if (res) return (compileAnswer) => verifyResidue(problem, res[1], res[2], compileAnswer);

  // 疊積分：\int_a^b\int_c^d body \,dX\,dY（界限全是常數式）。
  // 變數可以是希臘字母指令（dθ）—— 先換成佔位名再編譯。
  const iter = prompt.match(/^\\int_(\{[^{}]+\}|\S)\^(\{[^{}]+\}|\S)\s*\\int_(\{[^{}]+\}|\S)\^(\{[^{}]+\}|\S)(.+?)\\,d(\\[a-zA-Z]+|[a-zA-Z])(?:\\,| )*d(\\[a-zA-Z]+|[a-zA-Z])$/);
  if (iter) {
    const strip = (t) => t.replace(/^\{|\}$/g, "");
    try {
      let body = iter[5];
      const varName = (tex, fallback) => {
        if (!tex.startsWith("\\")) return tex;
        body = body.split(tex).join(fallback);
        return fallback;
      };
      const spec = {
        outerFrom: latex.compile(strip(iter[1]), [])(),
        outerTo: latex.compile(strip(iter[2]), [])(),
        innerFrom: latex.compile(strip(iter[3]), [])(),
        innerTo: latex.compile(strip(iter[4]), [])(),
        innerVar: varName(iter[6], "u"),
        outerVar: varName(iter[7], "v")
      };
      spec.body = body;
      if ([spec.outerFrom, spec.outerTo, spec.innerFrom, spec.innerTo].every(Number.isFinite)) {
        return (compileAnswer) => verifyIteratedIntegral(problem, spec, compileAnswer);
      }
    } catch (_error) { /* 界限不是常數 → 不接 */ }
  }

  // 參數式：x=…, y=…（逗號分隔）＋ dy/dx 或 d²y/dx²，可帶 |_{t=…}
  const par = prompt.match(/^x=([^,]+),\\? ?y=([^.]+)\.\\? ?(?:\\left\.)?\\frac\{d(\^2)?y\}\{dx(?:\^2)?\}(?:\\right\|_\{t=([^}]+)\})?(?:=\?)?$/);
  if (par) {
    return (compileAnswer) => verifyParametric(problem, par[1].trim(), par[2].trim(), par[3] ? 2 : 1, par[4] || null, compileAnswer);
  }

  // 卷積：\text{Find }F(x)=\int_0^x body \,dt
  const conv = prompt.match(/^\\text\{Find \}F\(x\)=\\int_0\^x ?(.+?)\\,dt$/);
  if (conv) return (compileAnswer) => verifyConvolution(problem, conv[1], compileAnswer);

  // 多變數句型
  const lap = prompt.match(/^\\text\{Laplacian of \}f=(.+)$/);
  if (lap) return (compileAnswer) => verifyMultivarSentence(problem, "laplacian", { f: lap[1] }, compileAnswer);

  const jac = prompt.match(/^\\text\{Jacobian determinant of \}u=([^,]+),\\? ?v=(.+)$/);
  if (jac) return (compileAnswer) => verifyMultivarSentence(problem, "jacobian", { u: jac[1], v: jac[2] }, compileAnswer);

  const dir = prompt.match(/^\\text\{Directional derivative of \}f=(.+?)\\text\{ at \}\((-?[\d.]+),(-?[\d.]+)\)\\text\{ in direction \}\\?(?:langle|left)?\(?(-?[\d.]+),(-?[\d.]+)/);
  if (dir) {
    return (compileAnswer) => verifyMultivarSentence(problem, "directional", {
      f: dir[1], point: [Number(dir[2]), Number(dir[3])], direction: [Number(dir[4]), Number(dir[5])]
    }, compileAnswer);
  }

  const mixed = prompt.match(/^\\frac\{\\partial\^2\}\{\\partial x\\partial y\}(.+)$/);
  if (mixed) return (compileAnswer) => verifyMultivarSentence(problem, "mixed-partial", { f: mixed[1] }, compileAnswer);

  const min2 = prompt.match(/^\\min_\{x,y\}\\left\((.+)\\right\)$/);
  if (min2) return (compileAnswer) => verifyMultivarSentence(problem, "min2d", { f: min2[1] }, compileAnswer);

  // 逗號後常寫 "\ "（LaTeX 的硬空白）。舊版用 \\? 去吃它，
  // 結果把 \cos 的反斜線吃掉、剩下 cos 被拆成 c·o·s 三個變數 —— 只剝 "\ "。
  const wron = prompt.match(/^\\text\{Wronskian \}W\((.+)\)$/);
  if (wron) {
    const args = wron[1].split(",").map((s) => s.replace(/^\\ /, "").trim()).filter(Boolean);
    if (args.length === 2) return (compileAnswer) => verifyWronskian(problem, args[0], args[1], compileAnswer);
    if (args.length === 3) return (compileAnswer) => verifyWronskian3(problem, args, compileAnswer);
  }

  // f(x)=…, f'(a)：定義式＋在某點的導數值（' 的個數 = 階數）
  const fdef = prompt.match(/^f\(x\)=(.+?),(?:\\quad|\\qquad|\\ |\s)*f('{1,3})\((.+?)\)$/);
  if (fdef && problem.answerKind === "numeric") {
    return (compileAnswer) => {
      const f = latex.compile(fdef[1], ["x"]);
      const at = evaluateBound(fdef[3]);
      const order = fdef[2].length;
      const expected = numeric.derivative(f, at, { order });
      return compareNumbers("derivative-at-point", compileAnswer([])(), expected.value, order > 1 ? 1e-4 : 1e-6);
    };
  }

  // 區域積分：∬/∭ 帶區域下標，或 \iint_D … ,\quad D=\{…\}
  let region = prompt.match(/^\\iint_\{(.+?)\}\s*(.*?)\\,dA$/);
  if (region) {
    const spec = region;
    return (compileAnswer) => verifyRegionIntegral(problem, 2, spec[2] || "1", spec[1], compileAnswer);
  }
  region = prompt.match(/^\\iiint_\{(.+?)\}\s*(.*?)\\,dV$/);
  if (region) {
    const spec = region;
    return (compileAnswer) => verifyRegionIntegral(problem, 3, spec[2] || "1", spec[1], compileAnswer);
  }
  region = prompt.match(/^\\iint_([A-Z])\s*(.*?)\\,dA\s*,?(?:\\quad|\\qquad|\\ |\s)*\1=\\\{(.+?)\\\}$/);
  if (region) {
    const spec = region;
    return (compileAnswer) => verifyRegionIntegral(problem, 2, spec[2] || "1", spec[3], compileAnswer);
  }

  // 「Area of REGION」：f=1 的二維區域積分（橢圓、二次型都吃）
  const areaOf = prompt.match(/^\\text\{Area of \}(.+)$/);
  if (areaOf) return (compileAnswer) => verifyRegionIntegral(problem, 2, "1", areaOf[1], compileAnswer);

  // 「Volume of the ball/cylinder/… }REGION」：f=1 的三維區域積分。
  // 敘述詞（ball、cylinder）只是給人看的 —— 區域的數學描述在後面。
  const volOf = prompt.match(/^\\text\{Volume of (?:the )?[^{}]*\}(.+)$/);
  if (volOf) return (compileAnswer) => verifyRegionIntegral(problem, 3, "1", volOf[1], compileAnswer);

  // 極座標面積：Area enclosed by r=f(θ) for/from a≤θ≤b → ½∫r²dθ
  const polar = prompt.match(/^\\text\{Area enclosed by \}r=(.+?)\\text\{ (?:for|from) \}(.+)$/);
  if (polar) {
    return (compileAnswer) => {
      const chain = polar[2].split(/(\\le(?:q)?|\\ge(?:q)?|<|>)/).map((s) => s.trim());
      if (chain.length !== 5 || !/\\theta/.test(chain[2])) {
        return { status: "unsupported", reason: "θ 的範圍解析不了：" + polar[2] };
      }
      const from = evaluateBound(chain[0]);
      const to = evaluateBound(chain[4]);
      // 換成 "(t)" 而不是 "t"：\sin\theta 直接接 "t" 會黏成 \sint
      const r = latex.compile(polar[1].split("\\theta").join("(t)"), ["t"]);
      const area = numeric.integrate((t) => 0.5 * r(t) * r(t), from, to);
      return compareNumbers("polar-area", compileAnswer([])(), area.value, toleranceFor(area, 1e-5));
    };
  }

  return null;
}

/* ── 區域積分：從不等式描述建指示函數，數值積出面積／體積／∬f ── */

// 區域描述 → 指示函數。吃得下：x\ge0、x+y\le2、x^2+y^2\le4、
// 1\le x^2+y^2\le4、x,y>0（孤兒變數套下一個比較）、0\le z\le3。
function compileRegion(regionTex, vars) {
  const cleaned = String(regionTex)
    .replace(/\\left|\\right/g, "")
    .replace(/\\[,;!]|\\quad|\\qquad/g, " ")
    .replace(/\\\{|\\\}/g, "")
    .replace(/\\ /g, " ");
  const parts = cleaned.split(",").map((s) => s.trim()).filter(Boolean);
  const predicates = [];
  const pendingVars = [];
  const OP = /(\\le(?:q)?|\\ge(?:q)?|<|>)/;
  for (const piece of parts) {
    if (/^[a-zA-Z]$/.test(piece)) { pendingVars.push(piece); continue; }
    const segments = piece.split(OP).map((s) => s.trim());
    if (segments.length !== 3 && segments.length !== 5) return null;
    const rel = (leftTex, opTex, rightTex) => {
      const g = latex.compile(`(${leftTex})-(${rightTex})`, vars);
      const sign = /\\ge|>/.test(opTex) ? -1 : 1;
      predicates.push((pt) => sign * g(...pt) <= 1e-12);
    };
    rel(segments[0], segments[1], segments[2]);
    if (segments.length === 5) rel(segments[2], segments[3], segments[4]);
    if (pendingVars.length) {
      pendingVars.splice(0).forEach((v) => rel(v, segments[1], segments[2]));
    }
  }
  if (pendingVars.length || !predicates.length) return null;
  return (pt) => predicates.every((p) => p(pt));
}

// 沿一條線掃出「在區域內」的一段段區間，端點用對分收斂到 ~1e-12。
function regionRuns(at, lo, hi, steps) {
  const refine = (outside, insidePoint) => {
    let a = outside;
    let b = insidePoint;
    for (let i = 0; i < 40; i += 1) {
      const mid = (a + b) / 2;
      if (at(mid)) b = mid; else a = mid;
    }
    return (a + b) / 2;
  };
  const runs = [];
  let prev = lo;
  let prevInside = at(lo);
  if (prevInside) runs.push([lo, null]);
  for (let i = 1; i <= steps; i += 1) {
    const t = lo + ((hi - lo) * i) / steps;
    const now = at(t);
    if (now && !prevInside) runs.push([refine(prev, t), null]);
    if (!now && prevInside) runs[runs.length - 1][1] = refine(t, prev);
    prevInside = now;
    prev = t;
  }
  if (prevInside && runs.length && runs[runs.length - 1][1] === null) runs[runs.length - 1][1] = hi;
  return runs.filter((run) => run[1] !== null && run[1] > run[0]);
}

// 粗網格掃出區域的包圍盒（[-8,8]^dim 內），找不到就回 null。
function regionBox(inside, dim) {
  const R = 8;
  const N = dim === 2 ? 200 : 48;
  const bounds = Array.from({ length: dim }, () => [Infinity, -Infinity]);
  let found = false;
  const probe = (pt) => {
    if (!inside(pt)) return;
    found = true;
    pt.forEach((value, i) => {
      if (value < bounds[i][0]) bounds[i][0] = value;
      if (value > bounds[i][1]) bounds[i][1] = value;
    });
  };
  const h = (2 * R) / N;
  if (dim === 2) {
    for (let i = 0; i <= N; i += 1) for (let j = 0; j <= N; j += 1) probe([-R + i * h, -R + j * h]);
  } else {
    for (let i = 0; i <= N; i += 1) for (let j = 0; j <= N; j += 1) for (let k = 0; k <= N; k += 1) probe([-R + i * h, -R + j * h, -R + k * h]);
  }
  if (!found) return null;
  // 邊界格可能剛好沒踩到區域邊緣，各方向放一格當緩衝
  return bounds.map(([lo, hi]) => [lo - 1.5 * h, hi + 1.5 * h]);
}

function verifyRegionIntegral(problem, dim, bodyTex, regionTex, compileAnswer) {
  const vars = dim === 2 ? ["x", "y"] : ["x", "y", "z"];
  const inside = compileRegion(regionTex, vars);
  if (!inside) return { status: "unsupported", reason: "區域描述解析不了：" + regionTex };
  const box = regionBox(inside, dim);
  if (!box) return { status: "unverified", reason: "在 [-8,8] 內掃不到區域" };
  const isOne = bodyTex.trim() === "" || bodyTex.trim() === "1";
  const f = isOne ? null : latex.compile(bodyTex, vars);

  if (dim === 2) {
    // 外層對 x 自適應積分；每個 x 用掃描＋對分找出 y 的合法區間再積內層。
    const column = (x) => regionRuns((y) => inside([x, y]), box[1][0], box[1][1], 240)
      .reduce((sum, [a, b]) => sum + (f ? numeric.integrate((y) => f(x, y), a, b).value : b - a), 0);
    const total = numeric.integrate(column, box[0][0], box[0][1]);
    if (!Number.isFinite(total.value)) return { status: "unverified", reason: "區域積分數值不收斂" };
    return compareNumbers("region-integral", compileAnswer([])(), total.value, toleranceFor(total, 1e-4));
  }

  // 三維：x-y 中點網格 × z 的區間量測，兩個解析度做 Richardson 外插。
  const sheet = (N) => {
    const hx = (box[0][1] - box[0][0]) / N;
    const hy = (box[1][1] - box[1][0]) / N;
    let sum = 0;
    for (let i = 0; i < N; i += 1) {
      const x = box[0][0] + (i + 0.5) * hx;
      for (let j = 0; j < N; j += 1) {
        const y = box[1][0] + (j + 0.5) * hy;
        const runs = regionRuns((z) => inside([x, y, z]), box[2][0], box[2][1], 60);
        for (const [a, b] of runs) {
          sum += hx * hy * (f ? numeric.integrate((z) => f(x, y, z), a, b).value : b - a);
        }
      }
    }
    return sum;
  };
  const coarse = sheet(60);
  const fine = sheet(120);
  const value = fine + (fine - coarse) / 3;
  const error = Math.abs(fine - coarse) / 3;
  if (!Number.isFinite(value)) return { status: "unverified", reason: "區域積分數值不收斂" };
  return compareNumbers("region-integral", compileAnswer([])(), value, toleranceFor({ value, error }, 1e-3));
}

/* ── 第三輪句型：特殊函數值、∇ 家族、ODE、概念判定 ─────────── */

// 深度感知的頂層逗號切割（跳過 {} 與 () 內的逗號）
function splitTopLevel(text, separator) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "{" || ch === "(") depth += 1;
    if (ch === "}" || ch === ")") depth -= 1;
    if (ch === separator && depth === 0) { parts.push(current); current = ""; continue; }
    current += ch;
  }
  parts.push(current);
  return parts;
}

// ⟨P,Q,R⟩ → 各分量的 LaTeX。找不到就回 null。
function parseAngleVector(tex) {
  const match = String(tex).match(/\\langle(.+?)\\rangle/);
  if (!match) return null;
  const parts = splitTopLevel(match[1], ",").map((s) => s.replace(/^\\ /, "").trim());
  return { parts, full: match[0] };
}

// 數值偏導工具（3 變數）
function partial3(f, pt, index, h = 1e-4) {
  const shift = (d) => pt.map((v, i) => (i === index ? v + d : v));
  return (f(...shift(h)) - f(...shift(-h))) / (2 * h);
}

function compileField3(componentTexes) {
  const fns = componentTexes.map((tex) => latex.compile(tex, ["x", "y", "z"]));
  return {
    at: (pt) => fns.map((f) => f(...pt)),
    div: (pt) => fns.reduce((sum, f, i) => sum + partial3(f, pt, i), 0),
    curl: (pt) => [
      partial3(fns[2], pt, 1) - partial3(fns[1], pt, 2),
      partial3(fns[0], pt, 2) - partial3(fns[2], pt, 0),
      partial3(fns[1], pt, 0) - partial3(fns[0], pt, 1)
    ]
  };
}

function laplacianOf(f, pt, h = 1e-3) {
  let sum = 0;
  for (let i = 0; i < pt.length; i += 1) {
    const up = pt.map((v, j) => (j === i ? v + h : v));
    const dn = pt.map((v, j) => (j === i ? v - h : v));
    sum += (f(...up) - 2 * f(...pt) + f(...dn)) / (h * h);
  }
  return sum;
}

// 「在多個取樣點都等於同一個常數」→ 回傳那個常數；否則 NaN
function constantOver(fn, points, tolerance = 1e-3) {
  const values = points.map(fn).filter(Number.isFinite);
  if (values.length < 3) return Number.NaN;
  const spread = Math.max(...values) - Math.min(...values);
  if (spread > tolerance * Math.max(1, Math.abs(values[0]))) return Number.NaN;
  return values[0];
}

const FIELD_SAMPLES = [[0.7, 0.4, 1.1], [1.3, -0.6, 0.5], [-0.8, 1.2, -0.4], [0.5, 0.9, 1.7]];

function parsePoint(tex) {
  return splitTopLevel(tex, ",").map((s) => evaluateBound(s));
}

function recognizeRound3(problem) {
  const prompt = String(problem.prompt || "");
  const numericAnswer = problem.answerKind === "numeric";

  // ── 特殊函數的值：全部用積分表示驗，跟「背值」這條解題路徑無關 ──
  const beta = prompt.match(/^B\((.+?),(.+?)\)$/);
  if (beta && numericAnswer) {
    return (compileAnswer) => {
      const a = evaluateBound(beta[1]);
      const b = evaluateBound(beta[2]);
      const value = numeric.integrate((t) => Math.pow(t, a - 1) * Math.pow(1 - t, b - 1), 0, 1);
      return compareNumbers("beta-integral", compileAnswer([])(), value.value, toleranceFor(value, 1e-5));
    };
  }
  const gamma = prompt.match(/^\\Gamma\((.+?)\)$/);
  if (gamma && numericAnswer) {
    return (compileAnswer) => {
      const s = evaluateBound(gamma[1]);
      const value = numeric.integrate((t) => Math.pow(t, s - 1) * Math.exp(-t), 0, Infinity);
      return compareNumbers("gamma-integral", compileAnswer([])(), value.value, toleranceFor(value, 1e-5));
    };
  }
  const bessel = prompt.match(/^J_\{?(-?\d)\}?\((.+?)\)$/);
  if (bessel && numericAnswer) {
    return (compileAnswer) => {
      const n = Number(bessel[1]);
      const x = evaluateBound(bessel[2]);
      const m = Math.abs(n);
      const value = numeric.integrate((t) => Math.cos(m * t - x * Math.sin(t)), 0, Math.PI);
      const jn = (value.value / Math.PI) * (n < 0 && m % 2 === 1 ? -1 : 1);
      return compareNumbers("bessel-integral", compileAnswer([])(), jn, 1e-6);
    };
  }

  // ── ∇ 家族 ──
  // \nabla\cdot⟨…⟩、\nabla\cdot(向量式)，可帶 \text{ at }(…)
  const divForm = prompt.match(/^\\nabla\\cdot\s*(?:\\left)?\(?(.+?)\)?(?:\\right\)?)?(?:\\text\{ at \}\((.+?)\))?$/);
  if (divForm && numericAnswer && /\\langle/.test(divForm[1]) && !/\\nabla|\\times/.test(divForm[1])) {
    const vec = parseAngleVector(divForm[1]);
    if (vec) {
      // ⟨A,B,C⟩ 外面可能包了係數（f·F、除以 √…）：把 ⟨…⟩ 換成各分量原地展開
      const componentTexes = vec.parts.map((part) => divForm[1].split(vec.full).join(`(${part})`));
      const at = divForm[2] ? parsePoint(divForm[2]) : null;
      return (compileAnswer) => {
        const field = compileField3(componentTexes.length === 3 ? componentTexes : [...componentTexes, "0"]);
        const value = at ? field.div(at) : constantOver((pt) => field.div(pt), FIELD_SAMPLES);
        if (!Number.isFinite(value)) return { status: "unverified", reason: "散度不是常數但題目沒給點" };
        return compareNumbers("field-div", compileAnswer([])(), value, 1e-3);
      };
    }
  }

  // \text{z-component of }\nabla\times⟨…⟩
  const curlZ = prompt.match(/^\\text\{z-component of \}\\nabla\\times(.+)$/);
  if (curlZ && numericAnswer) {
    const vec = parseAngleVector(curlZ[1]);
    if (vec) {
      return (compileAnswer) => {
        const field = compileField3(vec.parts.length === 3 ? vec.parts : [...vec.parts, "0"]);
        const value = constantOver((pt) => field.curl(pt)[2], FIELD_SAMPLES);
        if (!Number.isFinite(value)) return { status: "unverified", reason: "旋度 z 分量不是常數" };
        // 數值微分的噪音地板：渦旋場的 curl z 恆為 0，但取樣會回 2e-8 —— 那是 0
        const cleaned = Math.abs(value) < 5e-3 ? 0 : value;
        return compareNumbers("field-curl", compileAnswer([])(), cleaned, 1e-3);
      };
    }
  }

  // \nabla^2(…) / \Delta(…)，可帶 \text{ at }(…)
  const lapForm = prompt.match(/^(?:\\nabla\^2|\\Delta)\s*(?:\\left)?\((.+?)\)?(?:\\right\))?(?:\\text\{ at \}\((.+?)\))?$/);
  if (lapForm && numericAnswer) {
    return (compileAnswer) => {
      const bodyJs = latex.toJs(lapForm[1]);
      const vars = ["x", "y", "z"].filter((v) => latex.freeVariables(bodyJs).includes(v));
      const f = latex.compile(lapForm[1], vars);
      const at = lapForm[2] ? parsePoint(lapForm[2]).slice(0, vars.length) : null;
      const sample = (pt) => laplacianOf(f, pt.slice(0, vars.length));
      const value = at ? sample(at) : constantOver(sample, FIELD_SAMPLES);
      if (!Number.isFinite(value)) return { status: "unverified", reason: "Laplacian 不是常數但題目沒給點" };
      const cleaned = Math.abs(value) < 5e-3 ? 0 : value;
      return compareNumbers("field-laplacian", compileAnswer([])(), cleaned, 1e-2);
    };
  }

  // 恆等式：\nabla\times(\nabla f)、\nabla\cdot(\nabla\times F)。
  // f/F 沒給的話用固定的多項式測試場 —— 恆等式對所有場成立，這樣驗是合法的。
  const curlGrad = prompt.match(/^(?:\\left\|)?\\nabla\\times\(\\nabla f\)(?:\\right\|)?(?:,\\quad f=(.+))?$/);
  if (curlGrad && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(curlGrad[1] || "x^2y+y z^2+3x z", ["x", "y", "z"]);
      const grad = ["x", "y", "z"].map((_, i) => (x, y, z) => partial3(f, [x, y, z], i));
      const curl = (pt) => [
        partial3((...a) => grad[2](...a), pt, 1) - partial3((...a) => grad[1](...a), pt, 2),
        partial3((...a) => grad[0](...a), pt, 2) - partial3((...a) => grad[2](...a), pt, 0),
        partial3((...a) => grad[1](...a), pt, 0) - partial3((...a) => grad[0](...a), pt, 1)
      ];
      const magnitude = Math.max(...FIELD_SAMPLES.map((pt) => Math.hypot(...curl(pt))));
      const cleaned = magnitude < 5e-2 ? 0 : magnitude;
      return compareNumbers("identity-curl-grad", compileAnswer([])(), cleaned, 1e-3);
    };
  }
  const divCurl = prompt.match(/^\\nabla\\cdot\(\\nabla\\times\\mathbf\{?F\}?\)(?:,\\quad \\mathbf\{?F\}?=(.+))?$/);
  if (divCurl && numericAnswer) {
    return (compileAnswer) => {
      const vec = divCurl[1] ? parseAngleVector(divCurl[1]) : { parts: ["x^2y", "y z^2", "x z + y^2"] };
      const field = compileField3(vec.parts);
      const divOfCurl = (pt) => {
        let sum = 0;
        for (let i = 0; i < 3; i += 1) {
          const h = 1e-3;
          const up = pt.map((v, j) => (j === i ? v + h : v));
          const dn = pt.map((v, j) => (j === i ? v - h : v));
          sum += (field.curl(up)[i] - field.curl(dn)[i]) / (2 * h);
        }
        return sum;
      };
      const magnitude = Math.max(...FIELD_SAMPLES.map((pt) => Math.abs(divOfCurl(pt))));
      const cleaned = magnitude < 5e-2 ? 0 : magnitude;
      return compareNumbers("identity-div-curl", compileAnswer([])(), cleaned, 1e-3);
    };
  }

  // |\nabla\times F|，可帶 at，F=⟨…⟩ 在後面
  const curlMag = prompt.match(/^\\left\|\\nabla\\times\\mathbf\{?F\}?\\right\|(?:\\text\{ at \}\((.+?)\))?,\\quad \\mathbf\{?F\}?=(.+)$/);
  if (curlMag && numericAnswer) {
    const vec = parseAngleVector(curlMag[2]);
    if (vec) {
      return (compileAnswer) => {
        const field = compileField3(vec.parts);
        const sample = (pt) => Math.hypot(...field.curl(pt));
        const value = curlMag[1] ? sample(parsePoint(curlMag[1])) : constantOver(sample, FIELD_SAMPLES, 5e-2);
        if (!Number.isFinite(value)) return { status: "unverified", reason: "|curl| 不是常數但題目沒給點" };
        const cleaned = Math.abs(value) < 5e-3 ? 0 : value;
        return compareNumbers("field-curl", compileAnswer([])(), cleaned, 1e-2);
      };
    }
  }

  // D_{(a,b)/\sqrt2}(f)\text{ at }(…)：方向導數（方向已含正規化）
  const dirOp = prompt.match(/^D_\{\((.+?)\)\/\\sqrt\{?(\d+)\}?\}\((.+?)\)\\text\{ at \}\((.+?)\)$/);
  if (dirOp && numericAnswer) {
    return (compileAnswer) => {
      const direction = parsePoint(dirOp[1]);
      const norm = Math.sqrt(Number(dirOp[2]));
      const f = latex.compile(dirOp[3], ["x", "y"]);
      const at = parsePoint(dirOp[4]);
      const value = (partial3((x, y) => f(x, y), at, 0) * direction[0] + partial3((x, y) => f(x, y), at, 1) * direction[1]) / norm;
      return compareNumbers("directional", compileAnswer([])(), value, 1e-4);
    };
  }

  // f=… 在 (…) 的最大方向導數 → |∇f|
  const maxDir = prompt.match(/^f=(.+?)\\text\{ 在 \}\((.+?)\)\\text\{ 的最大方向導數\}$/);
  if (maxDir && numericAnswer) {
    return (compileAnswer) => {
      const bodyJs = latex.toJs(maxDir[1]);
      const vars = ["x", "y", "z"].filter((v) => latex.freeVariables(bodyJs).includes(v));
      const f = latex.compile(maxDir[1], vars);
      const at = parsePoint(maxDir[2]).slice(0, vars.length);
      const grad = vars.map((_, i) => partial3((...a) => f(...a), at, i));
      return compareNumbers("gradient-magnitude", compileAnswer([])(), Math.hypot(...grad), 1e-4);
    };
  }

  // f=… 在 (…) 沿指向 (…) 方向的方向導數
  const towardDir = prompt.match(/^f=(.+?)\\text\{ 在 \}\((.+?)\)\\text\{ 沿指向 \}\((.+?)\)\\text\{ 方向的方向導數\}$/);
  if (towardDir && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(towardDir[1], ["x", "y"]);
      const at = parsePoint(towardDir[2]);
      const target = parsePoint(towardDir[3]);
      const direction = [target[0] - at[0], target[1] - at[1]];
      const norm = Math.hypot(...direction);
      const value = (partial3((x, y) => f(x, y), at, 0) * direction[0] + partial3((x, y) => f(x, y), at, 1) * direction[1]) / norm;
      return compareNumbers("directional", compileAnswer([])(), value, 1e-4);
    };
  }

  // ∫_C ∇(f)·dr from (a,b) to (c,d)：沿直線段直接積 ∇f·r′
  const gradLine = prompt.match(/^\\int_C \\nabla\((.+?)\)\\cdot d\\mathbf r\\text\{ from \}\((.+?)\)\\text\{ to \}\((.+?)\)$/);
  if (gradLine && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(gradLine[1], ["x", "y"]);
      const from = parsePoint(gradLine[2]);
      const to = parsePoint(gradLine[3]);
      const value = numeric.integrate((t) => {
        const pt = [from[0] + t * (to[0] - from[0]), from[1] + t * (to[1] - from[1])];
        return partial3((x, y) => f(x, y), pt, 0) * (to[0] - from[0]) + partial3((x, y) => f(x, y), pt, 1) * (to[1] - from[1]);
      }, 0, 1);
      return compareNumbers("gradient-line-integral", compileAnswer([])(), value.value, toleranceFor(value, 1e-4));
    };
  }

  // ── ODE 句型：y'…=…,\ y(0)=…(,\ y'(0)=…)\.\ y=? ──
  // 驗算跟解法無關：把答案代回方程看殘差＋核對初始條件。
  const odeForm = prompt.match(/^(y'{1,2}.*?)((?:,\\? ?y'?\(0\)=[^,.]+)+)\.\\? ?y=\?$/);
  if (odeForm && (problem.answerKind === "expression" || problem.answerKind === "antiderivative")) {
    return (compileAnswer) => verifyOdePrompt(problem, odeForm[1], odeForm[2], compileAnswer);
  }

  // ── 概念判定（text 答案，但主張可以數值檢驗）──
  // Classify the critical point (a,b) of f=…
  const classify = prompt.match(/^\\text\{Classify the critical point \}\((.+?)\)\\text\{ of \}f=(.+)$/);
  if (classify && problem.answerKind === "text") {
    return (compileAnswer) => {
      void compileAnswer;
      const at = parsePoint(classify[1]);
      const f = latex.compile(classify[2], ["x", "y"]);
      const h = 1e-3;
      const fxx = (f(at[0] + h, at[1]) - 2 * f(...at) + f(at[0] - h, at[1])) / (h * h);
      const fyy = (f(at[0], at[1] + h) - 2 * f(...at) + f(at[0], at[1] - h)) / (h * h);
      const fxy = (f(at[0] + h, at[1] + h) - f(at[0] + h, at[1] - h) - f(at[0] - h, at[1] + h) + f(at[0] - h, at[1] - h)) / (4 * h * h);
      const det = fxx * fyy - fxy * fxy;
      const truth = det < -1e-4 ? "saddle" : det > 1e-4 ? (fxx > 0 ? "min" : "max") : null;
      if (!truth) return { status: "unverified", reason: "Hessian 退化，二階判別無法下結論" };
      const says = String(problem.canonical || (problem.answers || [])[0] || "");
      const claim = /saddle|鞍/i.test(says) ? "saddle" : /min|極小/i.test(says) ? "min" : /max|極大/i.test(says) ? "max" : null;
      if (!claim) return { status: "unsupported", reason: `答案「${says}」讀不出分類` };
      if (claim === truth) return { status: "ok", method: "critical-classify", detail: `Hessian 判別 det=${format(det)} → ${truth}` };
      return { status: "mismatch", method: "critical-classify", detail: `答案說 ${claim}，Hessian 判別是 ${truth}（det=${format(det)}, fxx=${format(fxx)}）` };
    };
  }

  // Is u=… harmonic? / Is u=…, v=… holomorphic …?
  const harmonic = prompt.match(/^\\text\{Is \}u=(.+?)\\text\{ harmonic\??\}$/);
  if (harmonic && problem.answerKind === "text") {
    return (compileAnswer) => {
      void compileAnswer;
      const f = latex.compile(harmonic[1], ["x", "y"]);
      const worst = Math.max(...FIELD_SAMPLES.map((pt) => Math.abs(laplacianOf(f, [pt[0], pt[1]]))));
      const truth = worst < 5e-2;
      const says = String(problem.canonical || (problem.answers || [])[0] || "");
      const claim = /^(yes|harmonic|是|調和)/i.test(says.trim());
      if (claim === truth) return { status: "ok", method: "harmonic-check", detail: `Δu 最大 ${format(worst)} → ${truth ? "調和" : "不調和"}` };
      return { status: "mismatch", method: "harmonic-check", detail: `答案說${claim ? "調和" : "不調和"}，數值上 Δu 最大 ${format(worst)}` };
    };
  }
  const cauchyRiemann = prompt.match(/^\\text\{Is \}u=(.+?),\\? ?v=(.+?)\\text\{ holomorphic[^}]*\}$/);
  if (cauchyRiemann && problem.answerKind === "text") {
    return (compileAnswer) => {
      void compileAnswer;
      const u = latex.compile(cauchyRiemann[1], ["x", "y"]);
      const v = latex.compile(cauchyRiemann[2], ["x", "y"]);
      const worst = Math.max(...FIELD_SAMPLES.map((pt) => {
        const p2 = [pt[0], pt[1]];
        return Math.max(
          Math.abs(partial3((x, y) => u(x, y), p2, 0) - partial3((x, y) => v(x, y), p2, 1)),
          Math.abs(partial3((x, y) => u(x, y), p2, 1) + partial3((x, y) => v(x, y), p2, 0))
        );
      }));
      const truth = worst < 1e-4;
      const says = String(problem.canonical || (problem.answers || [])[0] || "");
      const claim = /^(yes|holomorphic|analytic|是|全純|解析)/i.test(says.trim());
      if (claim === truth) return { status: "ok", method: "cauchy-riemann", detail: `CR 殘差最大 ${format(worst)}` };
      return { status: "mismatch", method: "cauchy-riemann", detail: `答案說${claim ? "全純" : "不全純"}，CR 殘差最大 ${format(worst)}` };
    };
  }

  // \lim_{n→∞} n^k \sup_{0≤x≤1} body：sup 用網格＋黃金分割逼，再走數列梯子
  const supLim = prompt.match(/^\\lim_\{n\\to\\infty\}n(?:\^\{?(\d)\}?)?\\sup_\{0\\le x\\le1\}(.+)$/);
  if (supLim && numericAnswer) {
    return (compileAnswer) => {
      const k = Number(supLim[1] || 1);
      const f = latex.compile(supLim[2], ["x", "n"]);
      const supAt = (n) => {
        let bestX = 0;
        let best = -Infinity;
        for (let i = 0; i <= 400; i += 1) {
          const x = i / 400;
          const value = f(x, n);
          if (value > best) { best = value; bestX = x; }
        }
        let lo = Math.max(0, bestX - 1 / 400);
        let hi = Math.min(1, bestX + 1 / 400);
        for (let i = 0; i < 60; i += 1) {
          const m1 = lo + (hi - lo) * 0.382;
          const m2 = lo + (hi - lo) * 0.618;
          if (f(m1, n) < f(m2, n)) lo = m1; else hi = m2;
        }
        return f((lo + hi) / 2, n);
      };
      const g = (n) => Math.pow(n, k) * supAt(n);
      const values = [64, 128, 256, 512, 1024].map(g);
      // Richardson：g(n) = L + c/n → 2·g(2n) − g(n) 收斂快一階
      const extrapolated = [];
      for (let i = 0; i + 1 < values.length; i += 1) extrapolated.push(2 * values[i + 1] - values[i]);
      const last = extrapolated[extrapolated.length - 1];
      const spread = Math.abs(extrapolated[extrapolated.length - 1] - extrapolated[extrapolated.length - 2]);
      return compareNumbers("sup-limit", compileAnswer([])(), last, Math.max(1e-4, (30 * spread) / Math.max(1, Math.abs(last))));
    };
  }

  return null;
}

/* ── 第四輪句型：隱函數、約束極值、旋轉體、曲線形狀、參數積分 ── */

// 隱函數 F(x,y)=0 在 (x0,y0) 的 dy/dx：Newton 解 y(x) 再數值微分
// （跟 EXPLICIT_METHODS.implicit 同一條獨立路徑）
function implicitSlopeAt(F, x0, y0) {
  if (Math.abs(F(x0, y0)) > 1e-6) throw new Error(`(${x0}, ${y0}) 不在曲線上，F = ${format(F(x0, y0))}`);
  const solveY = (x) => {
    let y = y0;
    for (let i = 0; i < 200; i += 1) {
      const slope = numeric.derivative((t) => F(x, t), y).value;
      if (!Number.isFinite(slope) || slope === 0) break;
      y -= F(x, y) / slope;
      if (Math.abs(F(x, y)) < 1e-13) break;
    }
    return y;
  };
  return numeric.derivative(solveY, x0).value;
}

// f'' 的零點（帶符號變換）：掃描＋對分。回傳 x 陣列。
function inflectionPoints(f, lo = -8, hi = 8) {
  const second = (x) => {
    const h = 1e-4;
    return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
  };
  const zeros = [];
  const push = (x) => {
    if (!zeros.some((z) => Math.abs(z - x) < 1e-4)) zeros.push(x);
  };
  // 格點不能踩在整數上：x⁴−6x² 的反曲點在 ±1，如果 ±1 正好是取樣點，
  // f″ 在那裡是精確的 0，「前後異號」永遠不成立（0 乘什麼都不是負的）。
  // 掃描起點加一個無理偏移，零點就一定落在兩個取樣點之間。
  const OFFSET = 0.0137;
  const STEPS = 800;
  let prev = null;
  for (let i = 0; i <= STEPS; i += 1) {
    const x = lo + OFFSET + ((hi - lo) * i) / STEPS;
    const value = second(x);
    if (!Number.isFinite(value)) { prev = null; continue; }
    if (prev && prev.value * value < 0) {
      let a = prev.x;
      let b = x;
      for (let j = 0; j < 60; j += 1) {
        const mid = (a + b) / 2;
        if (second(a) * second(mid) <= 0) b = mid; else a = mid;
      }
      push((a + b) / 2);
    }
    prev = { x, value };
  }
  return zeros;
}

// 約束極值：在 g(vars)=c 的流形上網格＋Newton 消去最後一個變數，取極值。
function constrainedExtremum(objective, constraint, dim, wantMax, positiveOnly) {
  const solveLast = (fixed, seed) => {
    let z = seed;
    for (let i = 0; i < 80; i += 1) {
      const g = constraint(...fixed, z);
      const dg = numeric.derivative((t) => constraint(...fixed, t), z).value;
      if (!Number.isFinite(dg) || dg === 0) return null;
      const next = z - g / dg;
      if (!Number.isFinite(next)) return null;
      if (Math.abs(next - z) < 1e-13) return next;
      z = next;
    }
    return Math.abs(constraint(...fixed, z)) < 1e-9 ? z : null;
  };
  const lo = positiveOnly ? 1e-3 : -12;
  const hi = 12;
  let best = null;
  const consider = (vars) => {
    if (positiveOnly && vars.some((v) => v <= 0)) return;
    const value = objective(...vars);
    if (!Number.isFinite(value)) return;
    if (!best || (wantMax ? value > best.value : value < best.value)) best = { value, vars };
  };
  const seeds = [1, -1, 3, -3, 0.3];
  const N = dim === 2 ? 600 : 60;
  if (dim === 2) {
    for (let i = 0; i <= N; i += 1) {
      const x = lo + ((hi - lo) * i) / N;
      for (const seed of seeds) {
        const y = solveLast([x], seed);
        if (y !== null) consider([x, y]);
      }
    }
  } else {
    for (let i = 0; i <= N; i += 1) {
      for (let j = 0; j <= N; j += 1) {
        const x = lo + ((hi - lo) * i) / N;
        const y = lo + ((hi - lo) * j) / N;
        for (const seed of seeds) {
          const z = solveLast([x, y], seed);
          if (z !== null) consider([x, y, z]);
        }
      }
    }
  }
  if (!best) return null;
  // 局部收斂：對前 dim−1 個變數做縮步長的座標搜尋
  let step = dim === 2 ? (hi - lo) / N : (hi - lo) / N;
  for (let round = 0; round < 60 && step > 1e-9; round += 1) {
    let moved = false;
    for (let axis = 0; axis < dim - 1; axis += 1) {
      for (const delta of [step, -step]) {
        const trial = best.vars.slice(0, dim - 1);
        trial[axis] += delta;
        const last = solveLast(trial, best.vars[dim - 1]);
        if (last === null) continue;
        const vars = [...trial, last];
        if (positiveOnly && vars.some((v) => v <= 0)) continue;
        const value = objective(...vars);
        if (Number.isFinite(value) && (wantMax ? value > best.value : value < best.value)) {
          best = { value, vars };
          moved = true;
        }
      }
    }
    if (!moved) step /= 2;
  }
  return best.value;
}

// 曲率 κ = |y''| / (1+y'²)^{3/2}（數值導數）
function curvatureAt(f, x) {
  const d1 = numeric.derivative(f, x).value;
  const h = 1e-4;
  const d2 = (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
  return Math.abs(d2) / Math.pow(1 + d1 * d1, 1.5);
}

function recognizeRound4(problem) {
  const prompt = String(problem.prompt || "");
  const numericAnswer = problem.answerKind === "numeric";

  // 隱函數在點的 dy/dx：EQ,\quad \frac{dy}{dx}\text{ 在 }(a,b)
  //                或 EQ,\ \left.\frac{dy}{dx}\right|_{(a,b)}
  const implicitAt = prompt.match(/^(.+?)=(.+?),\\?\s*(?:\\quad)?\s*\\frac\{dy\}\{dx\}\\text\{ 在 \}\((.+?)\)$/) ||
    prompt.match(/^(.+?)=(.+?),\\?\s*\\left\.\\frac\{dy\}\{dx\}\\right\|_\{\((.+?)\)\}$/);
  if (implicitAt && numericAnswer && /y/.test(implicitAt[1] + implicitAt[2])) {
    return (compileAnswer) => {
      const F = latex.compile(`(${implicitAt[1]})-(${implicitAt[2]})`, ["x", "y"]);
      const point = parsePoint(implicitAt[3]);
      return compareNumbers("implicit-at-point", compileAnswer([])(), implicitSlopeAt(F, point[0], point[1]), 1e-4);
    };
  }

  // Find y' from EQ：答案是 x,y 的式子 —— 在曲線上取樣比對
  const implicitExpr = prompt.match(/^\\text\{Find \}y'\\text\{ from \}(.+?)=(.+)$/);
  if (implicitExpr && problem.answerKind === "expression") {
    return (compileAnswer) => {
      const F = latex.compile(`(${implicitExpr[1]})-(${implicitExpr[2]})`, ["x", "y"]);
      const answerFn = compileAnswer(["x", "y"]);
      let checked = 0;
      for (const x0 of [0.6, 1.1, 1.7, -0.8, 2.3]) {
        for (const seed of [1, -1, 2, -2]) {
          let y = seed;
          for (let i = 0; i < 120; i += 1) {
            const dFy = numeric.derivative((t) => F(x0, t), y).value;
            if (!Number.isFinite(dFy) || dFy === 0) { y = Number.NaN; break; }
            y -= F(x0, y) / dFy;
            if (Math.abs(F(x0, y)) < 1e-12) break;
          }
          if (!Number.isFinite(y) || Math.abs(F(x0, y)) > 1e-9) continue;
          const slope = implicitSlopeAt(F, x0, y);
          const claimed = answerFn(x0, y);
          if (!Number.isFinite(slope) || !Number.isFinite(claimed)) continue;
          if (Math.abs(slope) > 1e6) continue;
          checked += 1;
          if (!numeric.close(claimed, slope, 1e-4)) {
            return { status: "mismatch", method: "implicit-expression", detail: `在曲線上的點 (${x0}, ${format(y)})：答案給 ${format(claimed)}，數值斜率 ${format(slope)}` };
          }
          break;
        }
        if (checked >= 4) break;
      }
      if (checked < 3) return { status: "unverified", reason: `曲線上可用的取樣點只有 ${checked} 個` };
      return { status: "ok", method: "implicit-expression", detail: `${checked} 個曲線上的點斜率一致` };
    };
  }

  // W(f,g)\text{ at }x=a
  const wronAt = prompt.match(/^W\((.+)\)\\text\{ at \}x=(.+)$/);
  if (wronAt && numericAnswer) {
    const args = wronAt[1].split(",").map((s) => s.replace(/^\\ /, "").trim());
    if (args.length === 2) {
      return (compileAnswer) => {
        const f = latex.compile(args[0], ["x"]);
        const g = latex.compile(args[1], ["x"]);
        const at = evaluateBound(wronAt[2]);
        const value = f(at) * numeric.derivative(g, at).value - numeric.derivative(f, at).value * g(at);
        return compareNumbers("wronskian", compileAnswer([])(), value, 1e-4);
      };
    }
  }

  // Hessian 行列式的三種寫法
  const hessianForm = prompt.match(/^\\det H_f\((.+?)\),\\quad f=(.+)$/) ||
    prompt.match(/^\\text\{Hessian determinant of \}f\(x,y\)=(.+?)\\text\{ at \}\((.+?)\)$/) ||
    prompt.match(/^\\text\{求 \}f\(x,y\)=(.+?)\\text\{ 在 \}\((.+?)\)\\text\{ 的 Hessian determinant\}$/);
  if (hessianForm && numericAnswer) {
    // \det H_f 的參數順序是 (點, f)，其他兩種是 (f, 點)
    const isDetForm = prompt.startsWith("\\det");
    const fTex = isDetForm ? hessianForm[2] : hessianForm[1];
    const point = parsePoint(isDetForm ? hessianForm[1] : hessianForm[2]);
    return (compileAnswer) => verifyHessianDet(problem, fTex, point, compileAnswer);
  }

  // |∇f(a,b)|²：\text{若 }f(x,y)=…,\ \text{求 }|\nabla f(a,b)|^2
  const gradSq = prompt.match(/^\\text\{若 \}f\(x,y\)=(.+?),\\?\s*\\text\{求 \}\|\\nabla f\((.+?)\)\|\^2$/);
  if (gradSq && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(gradSq[1], ["x", "y"]);
      const at = parsePoint(gradSq[2]);
      const gx = partial3((x, y) => f(x, y), at, 0);
      const gy = partial3((x, y) => f(x, y), at, 1);
      return compareNumbers("gradient-magnitude", compileAnswer([])(), gx * gx + gy * gy, 1e-4);
    };
  }

  // \text{求 }f(x,y)=…\text{ 在 }(a,b)\text{ 沿 }(u,v)\text{ 的方向導數}
  const dirZh = prompt.match(/^\\text\{求 \}f\(x,y\)=(.+?)\\text\{ 在 \}\((.+?)\)\\text\{ 沿 \}\((.+?)\)\\text\{ 的方向導數\}$/);
  if (dirZh && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(dirZh[1], ["x", "y"]);
      const at = parsePoint(dirZh[2]);
      const direction = parsePoint(dirZh[3]);
      const norm = Math.hypot(...direction);
      const value = (partial3((x, y) => f(x, y), at, 0) * direction[0] + partial3((x, y) => f(x, y), at, 1) * direction[1]) / norm;
      return compareNumbers("directional", compileAnswer([])(), value, 1e-4);
    };
  }

  // 約束極值：\max/\min OBJ \text{ subject to }G=C（可帶 (x,y>0)）
  const lagrange = prompt.match(/^\\(max|min)(?:_\{[^}]*\})? ?\\?\(?(.+?)\\?\)?\\? ?\\text\{ subject to \}(.+?)=([^\\(]+?)(?:\\ \(.*\))?$/);
  if (lagrange && numericAnswer) {
    return (compileAnswer) => {
      const wantMax = lagrange[1] === "max";
      const positiveOnly = /\(.*>0\)/.test(prompt);
      const objJs = latex.toJs(lagrange[2]);
      const vars = ["x", "y", "z"].filter((v) => latex.freeVariables(objJs).includes(v) || latex.freeVariables(latex.toJs(lagrange[3])).includes(v));
      if (vars.length < 2 || vars.length > 3) return { status: "unsupported", reason: "約束極值只支援 2–3 變數" };
      const objective = latex.compile(lagrange[2], vars);
      const constraintValue = latex.compile(lagrange[4].trim(), [])();
      const g = latex.compile(lagrange[3], vars);
      const constraint = (...args) => g(...args) - constraintValue;
      const value = constrainedExtremum(objective, constraint, vars.length, wantMax, positiveOnly);
      if (value === null) return { status: "unverified", reason: "約束流形上掃不到可行點" };
      return compareNumbers("constrained-extremum", compileAnswer([])(), value, 1e-3);
    };
  }

  // 一維極值：\min_{x>0}(…) / \max_{x>0}(…)
  const oneDim = prompt.match(/^\\(max|min)_\{x(>0)?\}\\left\((.+)\\right\)$/);
  if (oneDim && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(oneDim[3], ["x"]);
      const wantMax = oneDim[1] === "max";
      const lo = oneDim[2] ? 1e-4 : -12;
      let best = wantMax ? -Infinity : Infinity;
      for (let i = 0; i <= 4000; i += 1) {
        const x = lo + ((12 - lo) * i) / 4000;
        const value = f(x);
        if (Number.isFinite(value) && (wantMax ? value > best : value < best)) best = value;
      }
      return compareNumbers("extremum-1d", compileAnswer([])(), best, 1e-3);
    };
  }

  // 旋轉體：y=f(x), a≤x≤b 繞 x 軸 → π∫f²
  const revolveX = prompt.match(/^y=(.+?),\\ (.+?)\\le x\\le (.+?)\\text\{ 繞 \}x\\text\{ 軸的體積.*\}$/);
  if (revolveX && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(revolveX[1], ["x"]);
      const from = evaluateBound(revolveX[2]);
      const to = evaluateBound(revolveX[3]);
      const volume = numeric.integrate((x) => Math.PI * f(x) * f(x), from, to);
      return compareNumbers("solid-of-revolution", compileAnswer([])(), volume.value, toleranceFor(volume, 1e-5));
    };
  }
  // y=f(x) 繞 x 軸（沒給範圍：取 f 有定義且非負的一段 —— 半圓那種）
  const revolveXFull = prompt.match(/^y=(.+?)\\text\{ 繞 \}x\\text\{ 軸的體積.*\}$/);
  if (revolveXFull && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(revolveXFull[1], ["x"]);
      // 掃出 f 有限的區間
      let lo = null;
      let hi = null;
      for (let x = -12; x <= 12; x += 0.01) {
        if (Number.isFinite(f(x))) {
          if (lo === null) lo = x;
          hi = x;
        }
      }
      if (lo === null) return { status: "unverified", reason: "函數在掃描範圍內沒有定義" };
      const volume = numeric.integrate((x) => Math.PI * f(x) * f(x), lo, hi);
      return compareNumbers("solid-of-revolution", compileAnswer([])(), volume.value, toleranceFor(volume, 1e-4));
    };
  }
  // y=f 與 y=g 所圍區域繞 x 軸 → π∫|f²−g²|（交點自己找）
  const revolveBetween = prompt.match(/^y=(.+?)\\text\{ 與 \}y=(.+?)\\text\{ 所圍區域繞 \}x\\text\{ 軸的體積\}$/);
  if (revolveBetween && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(revolveBetween[1], ["x"]);
      const g = latex.compile(revolveBetween[2], ["x"]);
      const difference = (x) => f(x) - g(x);
      const crossings = [];
      let prev = null;
      for (let i = 0; i <= 2400; i += 1) {
        // 交點常在整數（0、1）—— 加無理偏移讓它落在取樣點之間
        const x = -12 + 0.00137 + (24 * i) / 2400;
        const value = difference(x);
        if (!Number.isFinite(value)) { prev = null; continue; }
        if (prev && prev.value * value < 0) {
          let a = prev.x;
          let b = x;
          for (let j = 0; j < 60; j += 1) {
            const mid = (a + b) / 2;
            if (difference(a) * difference(mid) <= 0) b = mid; else a = mid;
          }
          crossings.push((a + b) / 2);
        }
        prev = { x, value };
      }
      if (crossings.length < 2) return { status: "unverified", reason: "找不到兩條曲線的交點" };
      const volume = numeric.integrate((x) => Math.PI * Math.abs(f(x) * f(x) - g(x) * g(x)), crossings[0], crossings[crossings.length - 1]);
      return compareNumbers("solid-of-revolution", compileAnswer([])(), volume.value, toleranceFor(volume, 1e-4));
    };
  }
  // y=f 與 x 軸所圍區域繞 y 軸 → 殼層法 2π∫x·|f|
  const revolveShell = prompt.match(/^y=(.+?)\\text\{ 與 \}x\\text\{ 軸所圍區域繞 \}y\\text\{ 軸的體積\}$/);
  if (revolveShell && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(revolveShell[1], ["x"]);
      const crossings = [];
      let prev = null;
      for (let i = 0; i <= 2400; i += 1) {
        const x = -12 + 0.00137 + (24 * i) / 2400;
        const value = f(x);
        if (!Number.isFinite(value)) { prev = null; continue; }
        if (prev && prev.value * value < 0) crossings.push(x);
        else if (value === 0) crossings.push(x);
        prev = { x, value };
      }
      if (crossings.length < 2) return { status: "unverified", reason: "曲線與 x 軸的交點不足" };
      const volume = numeric.integrate((x) => 2 * Math.PI * Math.abs(x * f(x)), crossings[0], crossings[crossings.length - 1]);
      return compareNumbers("solid-of-revolution", compileAnswer([])(), volume.value, toleranceFor(volume, 1e-4));
    };
  }

  // 反曲點：f(x)=… 的反曲點 x 座標 / 反曲點個數
  const inflection = prompt.match(/^(?:f\(x\)|y)=(.+?)\\text\{ 的反曲點 \}x\\text\{ 座標\}$/);
  if (inflection && numericAnswer) {
    return (compileAnswer) => {
      const zeros = inflectionPoints(latex.compile(inflection[1], ["x"]));
      if (zeros.length !== 1) return { status: "unverified", reason: `找到 ${zeros.length} 個反曲點，題目卻只要一個座標` };
      return compareNumbers("inflection", compileAnswer([])(), zeros[0], 1e-3);
    };
  }
  const inflectionCount = prompt.match(/^(?:f\(x\)|y)=(.+?)\\text\{ 的反曲點個數\}$/);
  if (inflectionCount && numericAnswer) {
    return (compileAnswer) => {
      const zeros = inflectionPoints(latex.compile(inflectionCount[1], ["x"]));
      return compareNumbers("inflection", compileAnswer([])(), zeros.length, 1e-9);
    };
  }
  // 水平漸近線 y 值：x→±∞ 的極限（兩側一致才算）
  const horizontal = prompt.match(/^y=(.+?)\\text\{ 的水平漸近線 \}y\\text\{ 值\}$/);
  if (horizontal && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(horizontal[1], ["x"]);
      const right = f(1e7);
      const left = f(-1e7);
      if (!Number.isFinite(right) || Math.abs(right - f(1e8)) > 1e-4 * Math.max(1, Math.abs(right))) {
        return { status: "unverified", reason: "x→∞ 的取樣不收斂" };
      }
      if (Number.isFinite(left) && Math.abs(left - right) > 1e-3 * Math.max(1, Math.abs(right))) {
        return { status: "unverified", reason: "兩側的水平漸近線不同，題目卻只要一個值" };
      }
      return compareNumbers("asymptote", compileAnswer([])(), right, 1e-4);
    };
  }
  // 斜漸近線 y=x+k 的 k：k = lim (f(x)−x)
  const oblique = prompt.match(/^y=(.+?)\\text\{ 的斜漸近線 \}y=x\+k\\text\{ 的 \}k$/);
  if (oblique && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(oblique[1], ["x"]);
      const k = f(1e7) - 1e7;
      if (Math.abs(k - (f(1e8) - 1e8)) > 1e-3 * Math.max(1, Math.abs(k))) {
        return { status: "unverified", reason: "f(x)−x 在大 x 不收斂" };
      }
      return compareNumbers("asymptote", compileAnswer([])(), k, 1e-3);
    };
  }
  // 垂直漸近線條數：分母趨近時 |f|→∞ 的點數
  const vertical = prompt.match(/^y=(.+?)\\text\{ 的垂直漸近線條數\}$/);
  if (vertical && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(vertical[1], ["x"]);
      // 兩個坑：固定高閾值會漏掉殘差小的極點（1/((x+1)(x²−4)) 在格點上
      // 最多只衝到 ~2e4）；NaN 會把可去奇點（(x−1)/(x−1)…）算成漸近線。
      // 做法：門檻取「中位數的 200 倍」抓候選區，再對每個候選收斂進去 ——
      // 真極點會一路衝破 1e9，可去奇點在細看之下是平的。
      const STEPS = 24000;
      const step = 24 / STEPS;
      const values = [];
      for (let i = 0; i <= STEPS; i += 1) {
        const x = -12 + 0.0000137 + i * step;
        values.push({ x, v: Math.abs(f(x)) });
      }
      const finite = values.map((e) => e.v).filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
      const median = finite[Math.floor(finite.length / 2)] || 1;
      const threshold = Math.max(50, 200 * median);
      const regions = [];
      let current = null;
      values.forEach((entry) => {
        const seed = !Number.isFinite(entry.v) || entry.v > threshold;
        if (seed) {
          if (current && entry.x - current.end < 3 * step) {
            current.end = entry.x;
            if (Number.isFinite(entry.v) && entry.v > current.peak) { current.peak = entry.v; current.at = entry.x; }
          } else {
            if (current) regions.push(current);
            current = { start: entry.x, end: entry.x, peak: Number.isFinite(entry.v) ? entry.v : 0, at: entry.x };
          }
        }
      });
      if (current) regions.push(current);
      let count = 0;
      for (const region of regions) {
        let lo = region.at - 2 * step;
        let hi = region.at + 2 * step;
        let diverges = false;
        for (let round = 0; round < 14; round += 1) {
          let peak = 0;
          let argPeak = (lo + hi) / 2;
          for (let i = 0; i <= 40; i += 1) {
            const x = lo + ((hi - lo) * i) / 40;
            const v = Math.abs(f(x));
            if (Number.isFinite(v) && v > peak) { peak = v; argPeak = x; }
          }
          if (peak > 1e9) { diverges = true; break; }
          const width = (hi - lo) / 20;
          lo = argPeak - width;
          hi = argPeak + width;
        }
        if (diverges) count += 1;
      }
      return compareNumbers("asymptote", compileAnswer([])(), count, 1e-9);
    };
  }

  // 曲率與曲率半徑
  const kappaAt = prompt.match(/^\\kappa\\text\{ for \}y=(.+?)\\text\{ at \}x=(.+)$/);
  if (kappaAt && numericAnswer) {
    return (compileAnswer) => compareNumbers("curvature", compileAnswer([])(),
      curvatureAt(latex.compile(kappaAt[1], ["x"]), evaluateBound(kappaAt[2])), 1e-4);
  }
  const radiusAt = prompt.match(/^\\text\{曲線 \}y=(.+?)\\text\{ (?:在原點|在 \}x=(.+?)\\text\{ )的曲率半徑\}$/);
  if (radiusAt && numericAnswer) {
    return (compileAnswer) => {
      const at = radiusAt[2] === undefined ? 0 : evaluateBound(radiusAt[2]);
      const kappa = curvatureAt(latex.compile(radiusAt[1], ["x"]), at);
      return compareNumbers("curvature", compileAnswer([])(), 1 / kappa, 1e-4);
    };
  }
  const maxKappa = prompt.match(/^\\text\{曲線 \}y=(.+?)\\text\{ 的最大曲率\}$/);
  if (maxKappa && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(maxKappa[1], ["x"]);
      let best = 0;
      for (let i = 0; i <= 8000; i += 1) {
        const x = 0.001 + (12 * i) / 8000;
        for (const sign of [1, -1]) {
          const kappa = curvatureAt(f, sign * x);
          if (Number.isFinite(kappa) && kappa > best) best = kappa;
        }
      }
      return compareNumbers("curvature", compileAnswer([])(), best, 1e-3);
    };
  }

  // 極座標所圍面積（沒給範圍）：½∫r² 只積 r≥0 的 θ
  const polarArea = prompt.match(/^\\text\{求 \}r=(.+?)\\text\{ 所圍面積\}$/);
  if (polarArea && numericAnswer) {
    return (compileAnswer) => {
      const r = latex.compile(polarArea[1].split("\\theta").join("(t)"), ["t"]);
      const area = numeric.integrate((t) => {
        const value = r(t);
        return value > 0 ? 0.5 * value * value : 0;
      }, 0, 2 * Math.PI);
      return compareNumbers("polar-area", compileAnswer([])(), area.value, toleranceFor(area, 1e-4));
    };
  }

  // 鏈鎖律 dz/dt：\text{If }z=…, x=…, y=…, find dz/dt（答案是 t 的式子）
  const chainRule = prompt.match(/^\\text\{If \}z=([^,]+),\\? ?x=([^,]+),\\? ?y=([^,]+),\\?\s*\\text\{ find \}dz\/dt$/);
  if (chainRule && problem.answerKind === "expression") {
    return (compileAnswer) => {
      const z = latex.compile(chainRule[1], ["x", "y"]);
      const xt = latex.compile(chainRule[2], ["t"]);
      const yt = latex.compile(chainRule[3], ["t"]);
      const h = (t) => z(xt(t), yt(t));
      const answerFn = compileAnswer(["t"]);
      return report("chain-rule", compareFunctions(answerFn, (t) => numeric.derivative(h, t), {
        tolerance: 1e-4,
        points: [0.4, 0.8, 1.2, 1.7, -0.5, -1.1]
      }), "答案應該等於 dz/dt");
    };
  }

  // 全微分估計 Δf：…f=EXPR\text{ at }(a,b),\ dx=…,\ dy=…
  const totalDiff = prompt.match(/^\\text\{(?:Use total differential (?:to estimate \}\\Delta f\\text\{ )?for |Estimate \}\\Delta z\\text\{ for )\}?[fz]?=?(.*?)\\text\{ at \}\((.+?)\),\\ dx=([^,]+),\\ dy=(.+)$/) ||
    prompt.match(/^\\text\{[^}]*\}(?:f|z)=(.+?)\\text\{ at \}\((.+?)\),\\ dx=([^,]+),\\ dy=(.+)$/);
  if (totalDiff && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(totalDiff[1], ["x", "y"]);
      const at = parsePoint(totalDiff[2]);
      const dx = evaluateBound(totalDiff[3]);
      const dy = evaluateBound(totalDiff[4]);
      const value = partial3((x, y) => f(x, y), at, 0) * dx + partial3((x, y) => f(x, y), at, 1) * dy;
      const cleaned = Math.abs(value) < 1e-9 ? 0 : value;
      return compareNumbers("total-differential", compileAnswer([])(), cleaned, 1e-4);
    };
  }

  // Linear part df of f=…：答案是 x,y,dx,dy 的式子
  const linearPart = prompt.match(/^\\text\{Linear part \}df\\text\{ of \}f=(.+)$/);
  if (linearPart && problem.answerKind === "expression") {
    return (compileAnswer) => {
      void compileAnswer;
      const f = latex.compile(linearPart[1], ["x", "y"]);
      // 答案裡的 dx/dy 會被斷詞器拆成 d·x —— 先換成單一字母再編；
      // ^ 在 JS 是 XOR，不轉成 ** 會安靜地算出垃圾（實測 0.3 vs 0.2927）
      const answerJs = String(problem.answer).replace(/\bdx\b/g, "u").replace(/\bdy\b/g, "v").replace(/\^/g, "**");
      const answerFn = (x, y, dx, dy) => latex.compileJs(answerJs, ["x", "y", "u", "v"])(x, y, dx, dy);
      let checked = 0;
      for (const [x, y] of [[0.7, 0.4], [1.3, -0.6], [-0.8, 1.2], [1.9, 0.9]]) {
        const fx = partial3((a, b) => f(a, b), [x, y], 0);
        const fy = partial3((a, b) => f(a, b), [x, y], 1);
        for (const [dx, dy] of [[1, 0], [0, 1], [0.5, -0.7]]) {
          const want = fx * dx + fy * dy;
          const got = answerFn(x, y, dx, dy);
          if (!Number.isFinite(want) || !Number.isFinite(got)) continue;
          checked += 1;
          if (!numeric.close(got, want, 1e-4)) {
            return { status: "mismatch", method: "total-differential", detail: `(${x},${y})、(dx,dy)=(${dx},${dy})：答案給 ${format(got)}，數值上是 ${format(want)}` };
          }
        }
      }
      if (checked < 6) return { status: "unverified", reason: "取樣點不足" };
      return { status: "ok", method: "total-differential", detail: `${checked} 組取樣一致` };
    };
  }

  // Linear estimate of EXPR at (p) using base (b)：f(b)+∇f·(p−b)
  const linearEstimate = prompt.match(/^\\text\{Linear estimate of \}(.+?)\\text\{ at \}\((.+?)\)\\text\{ using base \}\((.+?)\)$/);
  if (linearEstimate && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(linearEstimate[1], ["x", "y"]);
      const point = parsePoint(linearEstimate[2]);
      const base = parsePoint(linearEstimate[3]);
      const value = f(...base)
        + partial3((x, y) => f(x, y), base, 0) * (point[0] - base[0])
        + partial3((x, y) => f(x, y), base, 1) * (point[1] - base[1]);
      return compareNumbers("linear-estimate", compileAnswer([])(), value, 1e-6);
    };
  }

  // x-coordinate of the minimum of f(x,y)
  const minCoord = prompt.match(/^\\text\{x-coordinate of the minimum of \}(.+)$/);
  if (minCoord && numericAnswer) {
    return (compileAnswer) => {
      const f = latex.compile(minCoord[1], ["x", "y"]);
      let best = { value: Infinity, x: 0 };
      for (let i = 0; i <= 400; i += 1) {
        for (let j = 0; j <= 400; j += 1) {
          const x = -10 + (20 * i) / 400;
          const y = -10 + (20 * j) / 400;
          const value = f(x, y);
          if (Number.isFinite(value) && value < best.value) best = { value, x, y };
        }
      }
      let step = 0.05;
      for (let round = 0; round < 200 && step > 1e-9; round += 1) {
        let moved = false;
        for (const [dx, dy] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
          const value = f(best.x + dx, (best.y ?? 0) + dy);
          if (value < best.value) { best = { value, x: best.x + dx, y: (best.y ?? 0) + dy }; moved = true; }
        }
        if (!moved) step /= 2;
      }
      return compareNumbers("extremum-coordinate", compileAnswer([])(), best.x, 1e-3);
    };
  }

  // 參數積分族：NAME(params)=∫…dx.\ \text{Find }NAME…
  const paramIntegral = recognizeParamIntegral(problem);
  if (paramIntegral) return paramIntegral;

  return null;
}

// I_n=\int_a^b body\,dx.\ \text{Find }I_n（或 I_n/I_{n-2}、F(a,b)、F''(a)）。
// 驗算：對幾組參數值做數值積分，跟答案式子逐點比。
function recognizeParamIntegral(problem) {
  const prompt = String(problem.prompt || "");
  if (problem.answerKind !== "expression") return null;
  const match = prompt.match(/^([A-Z])(?:_n|\(([a-z](?:,\s*[a-z])*)\))=(.+?)\.\\? ?\\text\{Find \}(.+)$/);
  if (!match) return null;
  const name = match[1];
  const params = match[2] ? match[2].split(",").map((s) => s.trim()) : ["n"];
  let definition = match[3];
  const target = match[4].trim();

  // 定義域尾註 "\ \text{for }-1<n<1"
  let sampleSets = null;
  const domainNote = definition.match(/\\ ?\\text\{for \}(.+)$/);
  if (domainNote) {
    definition = definition.slice(0, domainNote.index);
    if (/-1<n<1/.test(domainNote[1])) sampleSets = [[-0.5], [-0.2], [0.3], [0.6]];
  }

  // 定義自帶的微分（Q(a)=\frac{d^3}{da^3}\int…）
  let definitionDerivative = 0;
  const derivativePrefix = definition.match(/^\\frac\{d\^?(\d*)\}\{d([a-z])\^?\d*\}/);
  if (derivativePrefix) {
    definitionDerivative = Number(derivativePrefix[1] || 1);
    definition = definition.slice(derivativePrefix[0].length);
  }

  if (!definition.startsWith("\\int")) return null;
  const bounds = readBounds(definition, 4);
  const rest = definition.slice(bounds.end);
  const split = stripDifferential(rest);
  if (!split || bounds.lower === null || bounds.upper === null) return null;

  // Find 的形狀：NAME_n、NAME_n/NAME_{n-1 或 n-2}、NAME(…)、NAME''(…)
  const primes = (target.match(new RegExp(`^${name}('{1,3})`)) || [, ""])[1].length;
  const ratioMatch = target.match(new RegExp(`^${name}_n\\s*/\\s*${name}_\\{n-([12])\\}$`));
  const ratioOffset = ratioMatch ? Number(ratioMatch[1]) : 0;
  const isRatio = ratioOffset > 0;
  const totalDerivative = definitionDerivative + primes;

  return (compileAnswer) => {
    const integrand = latex.compile(split.integrand, [split.variable, ...params]);
    const from = evaluateBound(bounds.lower);
    const to = evaluateBound(bounds.upper);
    const valueAt = (...values) => numeric.integrate((x) => integrand(x, ...values), from, to).value;
    const withDerivative = (fn) => {
      if (totalDerivative === 0) return fn;
      let current = fn;
      for (let i = 0; i < totalDerivative; i += 1) {
        const inner = current;
        current = (a) => (inner(a + 5e-3) - inner(a - 5e-3)) / 1e-2;
      }
      return current;
    };
    const answerFn = compileAnswer(params);
    const samples = sampleSets || (params.length === 2
      ? [[0.8, 1.3], [1.4, 0.7], [2.1, 1.8]]
      : isRatio ? [[3], [4], [5], [6]] : params[0] === "n" && /_n/.test(prompt) ? [[1], [2], [3], [4]] : [[0.7], [1.3], [2.1], [3.2]]);
    let checked = 0;
    for (const values of samples) {
      let want;
      if (isRatio) {
        want = valueAt(values[0]) / valueAt(values[0] - ratioOffset);
      } else if (params.length === 1) {
        want = withDerivative((a) => valueAt(a))(values[0]);
      } else {
        want = valueAt(...values);
      }
      const got = answerFn(...values);
      if (!Number.isFinite(want) || !Number.isFinite(got)) continue;
      checked += 1;
      const tolerance = totalDerivative > 0 ? 1e-2 : 1e-4;
      if (!numeric.close(got, want, tolerance)) {
        return { status: "mismatch", method: "parameter-integral", detail: `${params.join(",")}=${values.join(",")}：答案給 ${format(got)}，數值積分是 ${format(want)}` };
      }
    }
    if (checked < 3) return { status: "unverified", reason: `可用的參數取樣只有 ${checked} 組` };
    return { status: "ok", method: "parameter-integral", detail: `${checked} 組參數值一致${totalDerivative ? `（含 ${totalDerivative} 階參數微分）` : ""}` };
  };
}

/* ── 第五輪句型：MVT、數列極限、相關變率、牛頓法、線性近似 ── */

function recognizeRound5(problem) {
  const prompt = String(problem.prompt || "");
  const numericAnswer = problem.answerKind === "numeric";
  if (!numericAnswer) return null;

  // f(x)=… 在 [a,b] 上滿足 MVT / Rolle 的 c：解 f'(c)=割線斜率（Rolle 是 0）
  const mvt = prompt.match(/^f\(x\)=(.+?)\\text\{ 在 \}\[(.+?),(.+?)\]\\text\{ 上滿足 (MVT|Rolle 定理) ?的 \}c$/);
  if (mvt) {
    return (compileAnswer) => {
      const f = latex.compile(mvt[1], ["x"]);
      const a = evaluateBound(mvt[2]);
      const b = evaluateBound(mvt[3]);
      const slope = mvt[4] === "MVT" ? (f(b) - f(a)) / (b - a) : 0;
      const g = (c) => numeric.derivative(f, c).value - slope;
      const roots = [];
      let prev = null;
      for (let i = 1; i < 800; i += 1) {
        const x = a + ((b - a) * i) / 800;
        const value = g(x);
        if (!Number.isFinite(value)) { prev = null; continue; }
        if (prev && prev.value * value < 0) {
          let lo = prev.x;
          let hi = x;
          for (let j = 0; j < 60; j += 1) {
            const mid = (lo + hi) / 2;
            if (g(lo) * g(mid) <= 0) hi = mid; else lo = mid;
          }
          roots.push((lo + hi) / 2);
        }
        prev = { x, value };
      }
      if (!roots.length) return { status: "unverified", reason: "區間內找不到滿足的 c" };
      const actual = compileAnswer([])();
      if (roots.some((root) => numeric.close(actual, root, 1e-4))) {
        return { status: "ok", method: "mean-value", detail: `${format(actual)} 是 f′(c)=${format(slope)} 的解` };
      }
      return { status: "mismatch", method: "mean-value", detail: `答案 ${format(actual)}，數值解是 ${roots.map(format).join(", ")}` };
    };
  }

  // 數列極限：a_n=EXPR,\quad \lim a_n（顯式通項 → 數列梯子）
  const seqExplicit = prompt.match(/^a_n=(.+?),\\quad ?\\lim_\{n\\to\\infty\}a_n$/);
  if (seqExplicit) {
    return (compileAnswer) => {
      const term = latex.compile(seqExplicit[1], ["n"]);
      const values = [512, 1024, 2048, 4096, 8192].map(term);
      if (!values.every(Number.isFinite)) return { status: "unverified", reason: "通項在大 n 算不出值" };
      const extrapolated = [];
      for (let i = 0; i + 1 < values.length; i += 1) extrapolated.push(2 * values[i + 1] - values[i]);
      const last = extrapolated[extrapolated.length - 1];
      const spread = Math.abs(last - extrapolated[extrapolated.length - 2]);
      // sin(n)/n 這類震盪但收斂的：外插不穩就直接看幅度是否壓到 0
      if (spread > 1e-4 * Math.max(1, Math.abs(last))) {
        const bound = Math.max(...values.slice(-2).map(Math.abs));
        const actual0 = compileAnswer([])();
        if (actual0 === 0 && bound < 1e-2) {
          return { status: "ok", method: "sequence-limit", detail: `|a_n| 壓到 ${format(bound)} → 0` };
        }
        return { status: "unverified", reason: "數列外插不穩定" };
      }
      // sin(n)/n 型：幅度已壓到噪音層卻沒被外插攔到 —— 小到 1e-3 以下就是 0
      const cleaned = Math.abs(last) < 1e-3 ? 0 : last;
      return compareNumbers("sequence-limit", compileAnswer([])(), cleaned, Math.max(1e-5, (30 * spread) / Math.max(1, Math.abs(cleaned))));
    };
  }

  // 遞迴數列：a_1=INIT,\ a_{n+1}=EXPR(a_n),\quad \lim a_n → 迭代到不動點
  const seqRecursive = prompt.match(/^a_1=(.+?),\\ a_\{n\+1\}=(.+?),\\quad ?\\lim_\{n\\to\\infty\}a_n$/);
  if (seqRecursive) {
    return (compileAnswer) => {
      const step = latex.compile(seqRecursive[2].split("a_n").join("(w)"), ["w"]);
      let value = evaluateBound(seqRecursive[1]);
      let previous = Infinity;
      for (let i = 0; i < 4000; i += 1) {
        previous = value;
        value = step(value);
        if (!Number.isFinite(value)) return { status: "unverified", reason: "迭代發散" };
        if (Math.abs(value - previous) < 1e-14) break;
      }
      if (Math.abs(value - previous) > 1e-8 * Math.max(1, Math.abs(value))) {
        return { status: "unverified", reason: "迭代沒有收斂" };
      }
      return compareNumbers("sequence-limit", compileAnswer([])(), value, 1e-6);
    };
  }

  // 相關變率四式（gap-der-app）：形狀公式是題幹的一部分，導數走數值
  const sphereRate = prompt.match(/^\\text\{A sphere has \}r=(.+?),\\ dr\/dt=(.+?)\.\\? ?\\frac\{dV\}\{dt\}=\?$/);
  if (sphereRate) {
    return (compileAnswer) => {
      const r = evaluateBound(sphereRate[1]);
      const rate = evaluateBound(sphereRate[2]);
      const volume = (t) => (4 / 3) * Math.PI * t * t * t;
      return compareNumbers("related-rates", compileAnswer([])(), numeric.derivative(volume, r).value * rate, 1e-6);
    };
  }
  const circleRate = prompt.match(/^\\text\{A circle has \}r=(.+?),\\ dr\/dt=(.+?)\.\\? ?\\frac\{dA\}\{dt\}=\?$/);
  if (circleRate) {
    return (compileAnswer) => {
      const r = evaluateBound(circleRate[1]);
      const rate = evaluateBound(circleRate[2]);
      const area = (t) => Math.PI * t * t;
      return compareNumbers("related-rates", compileAnswer([])(), numeric.derivative(area, r).value * rate, 1e-6);
    };
  }
  const ladderRate = prompt.match(/^\\text\{Ladder length \}(.+?),\\ x=(.+?),\\ dx\/dt=(.+?)\.\\? ?dy\/dt=\?$/);
  if (ladderRate) {
    return (compileAnswer) => {
      const length = evaluateBound(ladderRate[1]);
      const x = evaluateBound(ladderRate[2]);
      const rate = evaluateBound(ladderRate[3]);
      const height = (t) => Math.sqrt(length * length - t * t);
      return compareNumbers("related-rates", compileAnswer([])(), numeric.derivative(height, x).value * rate, 1e-6);
    };
  }
  const normalSlope = prompt.match(/^\\text\{Normal slope to \}y=(.+?)\\text\{ at \}x=(.+)$/);
  if (normalSlope) {
    return (compileAnswer) => {
      const f = latex.compile(normalSlope[1], ["x"]);
      const at = evaluateBound(normalSlope[2]);
      return compareNumbers("related-rates", compileAnswer([])(), -1 / numeric.derivative(f, at).value, 1e-6);
    };
  }

  // 牛頓法一步：One Newton step for f(x)=… from x_0=A ／ 對 √N 用牛頓法
  const newtonEn = prompt.match(/^\\text\{One Newton step for \}f\(x\)=(.+?)\\text\{ from \}x_0=(.+)$/);
  const newtonZh = prompt.match(/^\\text\{對 \}\\sqrt\{?(\d+)\}?\\text\{ 用牛頓法，\}x_0=(.+?)\\text\{ 的一次迭代 \}x_1$/);
  if (newtonEn || newtonZh) {
    return (compileAnswer) => {
      const f = newtonEn
        ? latex.compile(newtonEn[1], ["x"])
        : ((n) => (x) => x * x - n)(Number(newtonZh[1]));
      const x0 = evaluateBound(newtonEn ? newtonEn[2] : newtonZh[2]);
      const x1 = x0 - f(x0) / numeric.derivative(f, x0).value;
      return compareNumbers("newton-step", compileAnswer([])(), x1, 1e-8);
    };
  }

  // 線性近似 √V：基準點取最近的完全平方
  const linearSqrt = prompt.match(/^\\text\{(?:Linear approximation of |用線性近似估 )\}\\sqrt\{?([\d.]+)\}?$/);
  if (linearSqrt) {
    return (compileAnswer) => {
      const target = Number(linearSqrt[1]);
      const base = Math.round(Math.sqrt(target)) ** 2;
      const f = Math.sqrt;
      const value = f(base) + numeric.derivative(f, base).value * (target - base);
      return compareNumbers("linear-estimate", compileAnswer([])(), value, 1e-8);
    };
  }

  // 原點到直線 ax+by=c 的最短距離：在直線上做約束最小化
  const pointLine = prompt.match(/^\\text\{原點到直線 \}(.+?)=(.+?)\\text\{ 的最短距離\}$/);
  if (pointLine) {
    return (compileAnswer) => {
      const g = latex.compile(pointLine[1], ["x", "y"]);
      const c = latex.compile(pointLine[2], [])();
      const value = constrainedExtremum(
        (x, y) => Math.hypot(x, y),
        (x, y) => g(x, y) - c,
        2, false, false
      );
      if (value === null) return { status: "unverified", reason: "直線上掃不到點" };
      return compareNumbers("constrained-extremum", compileAnswer([])(), value, 1e-4);
    };
  }

  // Curvature of y=… at x=A（英文版曲率）
  const curvatureEn = prompt.match(/^\\text\{Curvature of \}y=(.+?)\\text\{ at \}x=(.+)$/);
  if (curvatureEn) {
    return (compileAnswer) => compareNumbers("curvature", compileAnswer([])(),
      curvatureAt(latex.compile(curvatureEn[1], ["x"]), evaluateBound(curvatureEn[2])), 1e-4);
  }

  return null;
}

// ODE 題幹：把 y''/y'/y 換成佔位變數編殘差，答案代回去驗。
function verifyOdePrompt(problem, equationTex, conditionsTex, compileAnswer) {
  const equation = equationTex.replace(/\\ /g, " ").trim().replace(/,$/, "");
  const sides = splitTopLevel(equation, "=");
  if (sides.length !== 2) return { status: "unsupported", reason: "ODE 等式切不開：" + equation };
  const placeholder = (tex) => tex
    .split("y''").join("Q")
    .split("y'").join("P")
    .split("y").join("(W)");
  const residualTex = `(${placeholder(sides[0])})-(${placeholder(sides[1])})`;
  const residual = latex.compile(residualTex.split("Q").join("(Q)").split("P").join("(P)"), ["x", "W", "P", "Q"]);
  const conditions = [...conditionsTex.matchAll(/y('?)\(0\)=([^,.]+)/g)]
    .map((m) => ({ order: m[1] ? 1 : 0, value: evaluateBound(m[2]) }));
  const answerFn = compileAnswer(["x"]);
  let checked = 0;
  for (let i = 0; i <= 8; i += 1) {
    const x = 0.15 + (1.2 * i) / 8;
    const y = answerFn(x);
    const d1 = numeric.derivative(answerFn, x).value;
    const h = 1e-3;
    const d2 = (answerFn(x + h) - 2 * y + answerFn(x - h)) / (h * h);
    if (![y, d1, d2].every(Number.isFinite)) continue;
    const r = residual(x, y, d1, d2);
    if (!Number.isFinite(r)) continue;
    if (Math.abs(r) > 5e-3 * Math.max(1, Math.abs(y), Math.abs(d1))) {
      return { status: "mismatch", method: "ode-residual", detail: `x=${x.toFixed(3)} 處殘差 ${r.toExponential(2)}` };
    }
    checked += 1;
  }
  if (checked < 4) return { status: "unverified", reason: "取樣點不足" };
  for (const condition of conditions) {
    const got = condition.order === 0 ? answerFn(0) : numeric.derivative(answerFn, 0).value;
    if (Math.abs(got - condition.value) > 1e-5 * Math.max(1, Math.abs(condition.value))) {
      return { status: "mismatch", method: "ode-residual", detail: `初始條件 y${condition.order ? "'" : ""}(0) 應為 ${condition.value}，答案給 ${format(got)}` };
    }
  }
  return { status: "ok", method: "ode-residual", detail: `${checked} 個點滿足方程＋${conditions.length} 個初始條件` };
}

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

  // 幾類「\\text 開頭」的題幹有固定句型，逐句型辨識。
  // 每一條路徑都跟解答無關：收斂半徑用掃描收斂邊緣、係數用 Chebyshev
  // 插值、Hessian 用數值二階偏導 —— 共同前提只有「有沒有看懂題幹」。
  const round2 = recognizeRound2(problem);
  if (round2) {
    try {
      return round2(compileAnswer);
    } catch (error) {
      return { status: "error", reason: error.message };
    }
  }

  const textForm = recognizeTextForm(problem.prompt);
  if (textForm) {
    try {
      return textForm(problem, compileAnswer);
    } catch (error) {
      return { status: "error", reason: error.message };
    }
  }

  const round3 = recognizeRound3(problem);
  if (round3) {
    try {
      return round3(compileAnswer);
    } catch (error) {
      return { status: "error", reason: error.message };
    }
  }

  const round4 = recognizeRound4(problem);
  if (round4) {
    try {
      return round4(compileAnswer);
    } catch (error) {
      return { status: "error", reason: error.message };
    }
  }

  const round5 = recognizeRound5(problem);
  if (round5) {
    try {
      return round5(compileAnswer);
    } catch (error) {
      return { status: "error", reason: error.message };
    }
  }

  // 說明文字裡「求 }∫…」的尾巴（達摩院包）：前面是解法提示，
  // 最後那條積分才是題目。整句解析不了時，抽出尾巴的積分再試一次。
  if (!structure) {
    const seek = String(problem.prompt || "").match(/求 \}(.+)$/);
    if (seek) {
      const candidate = seek[1].replace(/\\!/g, "").trim();
      const sub = topLevelOperator(candidate);
      if (sub && sub.op === "definite-integral") {
        try {
          return verifyDefiniteIntegral(problem, sub, compileAnswer);
        } catch (error) {
          return { status: "error", reason: error.message };
        }
      }
      const iterated = recognizeRound2({ ...problem, prompt: candidate });
      if (iterated) {
        try {
          return iterated(compileAnswer);
        } catch (error) {
          return { status: "error", reason: error.message };
        }
      }
    }
  }

  // 「Use which technique?」「Main trap?」類：答案是解題手法，數值上無從驗起。
  // 早退成誠實的 unsupported —— 不然會在 compileAnswer 炸成 error，
  // 看報告的人分不清是「驗不了」還是「引擎壞了」。
  // 收斂/發散類的 text 主張不走這條 —— series/limit 的驗算器自己會比對。
  if (problem.answerKind === "text") {
    const says = String(problem.canonical || (problem.answers || [])[0] || "");
    if (!isNumericClaim(says)) {
      return { status: "unsupported", reason: `答案「${says}」是解題手法而非數值主張` };
    }
  }

  // 多變數極限 lim_{(x,y)→(0,0)}：沿多條路徑取樣（尾巴的 \text 註解先剝掉）。
  const mv = stripTrailingText(String(problem.prompt || "")).body.match(/^\\lim_\{\(x,y\)\\to\(0,0\)\}(.+)$/);
  if (mv) {
    try {
      return verifyMultivarLimit(problem, mv[1], compileAnswer);
    } catch (error) {
      return { status: "error", reason: error.message };
    }
  }

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

    // x=0 的高階導數：走有理泰勒級數，精確算 n!·aₙ。
    // 數值微分在 n≥5 就淹死在捨入誤差裡，d^20/dx^20 這種只有這條路。
    if (at === 0 && structure.op === "derivative") {
      let js = null;
      try { js = latex.toJs(structure.body.replace(/\\left|\\right/g, "")); } catch (_error) { js = null; }
      if (js && latex.freeVariables(js).every((name) => name === variable)) {
        const rational = taylor.derivativeAtZero(
          variable === "x" ? js : js.replace(new RegExp(`\\b${variable}\\b`, "g"), "x"),
          structure.order
        );
        if (rational) {
          const exact = taylor.parseExactAnswer(problem.answer);
          if (exact) {
            if (taylor.fEq(exact, rational.exact)) {
              return { status: "ok", method: "taylor-derivative", detail: `${problem.answer} = ${structure.order}!·a_${structure.order}（有理級數，精確比對）` };
            }
            return {
              status: "mismatch",
              method: "taylor-derivative",
              detail: `答案 ${problem.answer}，有理級數精確算出 ${rational.exact.n}${rational.exact.d === 1n ? "" : "/" + rational.exact.d}`,
              actual: taylor.fToNumber(exact),
              expected: rational.value,
              ratio: rational.value === 0 ? null : taylor.fToNumber(exact) / rational.value
            };
          }
          return compareNumbers("taylor-derivative", compileAnswer([])(), rational.value, 1e-9);
        }
      }
      if (structure.order > 4) {
        return { status: "unverified", reason: `${structure.order} 階導數：級數展開不了、數值微分也到不了這個階` };
      }
    }
    if (structure.order > 4) {
      return { status: "unverified", reason: `${structure.order} 階導數在 x≠0：目前只有 x=0 的有理級數路徑` };
    }

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

// 數列極限：在 n、2n、4n… 取值再外插。
//
// numeric.limit 對這一類一律回報「不同取樣深度的外插不一致」，而那不是它的
// 錯 —— 它是為連續函數的 h→0 設計的，取樣點會落在整數之間，而 Σ_{k=1}^{n}
// 這種東西在 n = 1370.4 上根本沒有定義。數列要用數列的取樣方式。
//
// 收斂階不能寫死。誤差是 C/n 的（黎曼和）、C/√n 的（Stolz 型平均，因為
// Σ1/√k = 2√n + ζ(1/2) + …）、還是 C·log n/n 的（Stirling 那類），事前並不
// 知道；寫死成 1/n 的 Richardson 只對第一種準（實測 Stolz 型會差到 1.6e-3）。
//
// 所以用 Aitken Δ²：它不需要知道階數。對 f(n) = L + C·n^{-p}，在 n、2n、4n
// 上的相鄰差比恆為 2^{-p}，跟 p 是多少無關 —— 正好是 Aitken 的前提。
function extrapolateSequence(f, options) {
  const settings = options || {};
  const start = Math.max(2, Math.round(settings.n0 || 500));
  const levels = settings.levels || 7;

  const values = [];
  for (let k = 0; k < levels; k += 1) {
    let value;
    try {
      value = f(start * Math.pow(2, k));
    } catch (error) {
      break;
    }
    // 這一層算不出來（階乘溢位、log 吃到 0）就用已經拿到的層數收工
    if (!Number.isFinite(value)) break;
    values.push(value);
  }
  if (values.length < 3) {
    return { value: Number.NaN, reason: "數列取樣點不足三個，外插不了（多半是溢位）" };
  }

  // 取樣值的跳動必須越取越小。中途忽然放大，代表這串不是在收斂，
  // 而是計算本身在某個 n 之後壞掉了。
  //
  // 最陰險的例子是 n/(n!)^{1/n}：n! 在 n≈170 溢位成 Infinity，
  // Infinity^{1/n} 還是 Infinity，n/Infinity = **0** —— 溢位在中途變回一個
  // 有限數，取樣值於是長成 [2.5, 2.6, 2.68, 0, 0]。相鄰項檢查過（0 跟 0 很像）、
  // 兩個尺度也一致（都是 0），只有「跳動突然放大 30 倍」這件事會露餡。
  const steps = [];
  for (let i = 1; i < values.length; i += 1) {
    steps.push(Math.abs(values[i] - values[i - 1]));
  }
  for (let i = 1; i < steps.length; i += 1) {
    const before = Math.max(...steps.slice(0, i));
    if (steps[i] > 10 * before && steps[i] > 1e-12) {
      return {
        value: Number.NaN,
        breakdown: true,
        reason: `取樣值的跳動在中途放大了（${before.toExponential(2)} → ${steps[i].toExponential(2)}），不是收斂`
      };
    }
  }

  // 取樣值是真的，還是浮點雜訊？
  //
  // n·sin(2πe·n!) 是活生生的例子：它的極限確實是 2π，但 e·n! 在 n≈20 就
  // 超過 2^53，小數部分整個被浮點吃掉，sin 收到的是雜訊。Aitken 不知道這件事，
  // 照樣把雜訊外插成一個看起來很穩的 53.06 —— 然後去指控一個正確的答案。
  //
  // 分辨的方法很便宜：收斂數列的相鄰項一定很接近（差是 O(1/n) 或更小），
  // 雜訊的相鄰項則毫無關係。在最大的取樣點上比 f(n) 與 f(n+1) 就夠了。
  const largest = start * Math.pow(2, values.length - 1);
  let neighbour;
  try {
    neighbour = f(largest + 1);
  } catch (error) {
    neighbour = Number.NaN;
  }
  const tail = values[values.length - 1];
  // 門檻是 1e-2 不是 1e-3：sin(n)/n 這種**震盪但收斂**的數列，相鄰項本來
  // 就差 2/n（n=640 時是 3e-3），那是震盪不是雜訊。而真正的浮點雜訊
  // （n·sin(2πe·n!)）相鄰項差的是好幾倍，1e-2 一樣擋得住。
  if (!Number.isFinite(neighbour) ||
      Math.abs(neighbour - tail) > 1e-2 * Math.max(1, Math.abs(tail))) {
    return {
      value: Number.NaN,
      breakdown: true,
      reason: `相鄰項 f(${largest}) 與 f(${largest + 1}) 差太多，取樣值不可信（多半是浮點失去精度）`
    };
  }

  let row = values;
  while (row.length >= 3) {
    const next = [];
    for (let i = 0; i + 2 < row.length; i += 1) {
      const first = row[i + 1] - row[i];
      const second = row[i + 2] - row[i + 1];
      const denominator = second - first;
      // 差已經小到是浮點雜訊，再外插只會放大它 —— 停在原值
      if (Math.abs(denominator) < 1e-14 * Math.max(1, Math.abs(row[i + 2]))) {
        next.push(row[i + 2]);
      } else {
        next.push(row[i + 2] - (second * second) / denominator);
      }
    }
    const moved = Math.abs(next[next.length - 1] - row[row.length - 1]);
    const scale = Math.max(1e-9, Math.abs(row[row.length - 1]));
    // 外插反而跳很遠 = 這串根本不像在收斂。回報 NaN 讓上層說「驗不了」，
    // 不要硬吐一個數字出去 —— 安靜地給錯答案比驗不了糟得多。
    if (moved / scale > 0.5) {
      return { value: Number.NaN, breakdown: true, reason: "數列外插不穩定，看不出收斂" };
    }
    row = next;
  }
  // 外插只該把最後一步的殘差補完，不該把答案帶到取樣值以外很遠的地方。
  //
  // sin(n)/n 是逼出這道檢查的例子：它確實收斂到 0，但取樣值是 ±1/n 的震盪，
  // 相鄰差比毫無規律 —— Aitken 在這種資料上吐出的 −0.00117 純屬巧合，
  // 而且比最後一步大了一個量級。真正在收斂的數列不會這樣：
  // 誤差 C/n 的外插只跨過 1 倍最後一步，C/√n 的跨過約 2.4 倍。
  const extrapolated = row[row.length - 1];
  const lastSample = values[values.length - 1];
  const lastStep = Math.abs(lastSample - values[values.length - 2]);
  const allowance = 5 * lastStep + 1e-9 * Math.max(1, Math.abs(lastSample));
  if (Math.abs(extrapolated - lastSample) > allowance) {
    return {
      value: Number.NaN,
      breakdown: true,
      reason: `外插結果 ${extrapolated} 離最後一個取樣值 ${lastSample} 太遠（超過最後一步的 5 倍），不可信`
    };
  }

  return { value: extrapolated, reason: "" };
}

// 同一個數列，用兩個差很多的取樣尺度各外插一次，答案必須一致。
//
// 這道檢查是被兩個實際的假警報逼出來的，兩個都是**外插器很有自信地算錯**：
//
//   H_n/log n → 1，但誤差是 γ/log n。n=32000 時 log n 才 10.4，
//   誤差還有 5%，而且 log(2^k·n) = log n + k·log2 是線性成長不是等比，
//   Aitken 的前提不成立。它照樣吐出一個很穩的 1.0043，去指控正確答案 1。
//
//   n/(n!)^{1/n} → e，但 fact(500) 溢位成 Infinity，Infinity^{1/500} 還是
//   Infinity，n/Infinity = 0 —— 溢位沒有變成 NaN，變成一個看起來很正常的 0，
//   連相鄰項檢查都騙得過（0 跟 0 確實很像）。
//
// 小尺度那把梯子在這兩種情況下都會給出不一樣的答案：前者因為誤差項還很大，
// 後者因為 640! 也溢位但 40! 不會。兩把不一致就是「驗不了」，不是「不符」。
function sequenceLimit(f) {
  const coarse = extrapolateSequence(f, { n0: 40, levels: 5 });
  const fine = extrapolateSequence(f, { n0: 500, levels: 7 });

  // 這兩個方向不對稱，不要寫成對稱的：
  //
  // 大尺度失敗、小尺度成功 —— 正當。n!/nⁿ 在 n=500 就是 Infinity/Infinity = NaN，
  // 那是溢位造成的「資料不足」，小尺度算出來的仍然是真的。
  //
  // 小尺度失敗、大尺度成功 —— 不正當。小尺度失敗代表它**偵測到不對勁**
  // （跳動放大、相鄰項對不上、外插不穩），這種時候大尺度的成功多半是假的：
  // n/(n!)^{1/n} 從 n=171 起恆等於 0，大尺度整串都是 0，看起來穩得不得了。
  // 所以這裡不提供反向的退路。
  // 大尺度失敗時，只有「取樣點不足」才退回小尺度 —— 那是溢位造成的資料缺口，
  // 小尺度算出來的仍然是真的。若大尺度是**偵測到不對勁**（breakdown），
  // 退回去等於拿一把更粗的尺子去覆蓋一個已經舉起的紅旗。
  if (!Number.isFinite(fine.value)) return fine.breakdown ? fine : coarse;
  if (!Number.isFinite(coarse.value)) return coarse;

  // 門檻放到 5e-3，是因為粗梯子只取到 n=640，它本身就沒有那個精度。
  // 拿 1e-6 去要求兩把一致，等於用粗梯子的精度上限當正確性標準 ——
  // (1+2/x)^{3x} 的細梯子準到小數第十位，卻會因為粗的差 5e-6 而被判「不可信」。
  // 這裡要抓的是**質**的分歧（1.028 vs 1.004 那種收斂根本沒到位），不是精度差。
  const gap = Math.abs(coarse.value - fine.value);
  const scale = Math.max(1e-9, Math.abs(fine.value));
  if (gap / scale > 5e-3) {
    return {
      value: Number.NaN,
      breakdown: true,
      reason: `兩個取樣尺度外插出不同的值（${coarse.value} vs ${fine.value}），不可信`
    };
  }
  return fine;
}

// 夾擠取樣：不外插，只問「取樣值有沒有收在一起」。
//
// 這是一個刻意比外插弱的檢查，因為它要處理的函數本來就不平滑：
// 階梯函數（x⌊1/x⌋）、震盪（x²sin(1/x)）在任何鄰域裡都沒有可以外插的結構。
// 判準是散布必須**持續縮小**、最後縮到 1e-7 以下 —— 只是「值差不多」不算，
// 因為收斂很慢的函數（1/log(1/x)）在任一段窗口裡看起來也差不多，
// 那種情況要讓它驗不過，不要放行。
function squeezeSample(f, target, side) {
  const toInfinity = !Number.isFinite(target);
  const directions = side === "+" ? [1] : side === "-" ? [-1] : [1, -1];
  const spreads = [];
  let last = null;

  for (let k = 3; k <= 9; k += 1) {
    const step = Math.pow(10, -k) * Math.max(1, Math.abs(target));
    const values = [];
    // 同一個尺度取三個點，才看得出震盪；只取一個點的話，
    // sin(1/x) 這種剛好落在同一相位上會假裝很穩定
    for (const direction of toInfinity ? [1] : directions) {
      for (const scale of [1, 3, 7]) {
        // x→∞ 用的是往外跑的等比階梯，判準完全一樣：散布要縮到零。
        const at = toInfinity ? Math.pow(10, k) * scale : target + direction * step * scale;
        const value = f(at);
        if (!Number.isFinite(value)) return { value: Number.NaN, spread: Number.NaN };
        values.push(value);
      }
    }
    const spread = Math.max(...values) - Math.min(...values);
    spreads.push(spread);
    last = values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  const finalSpread = spreads[spreads.length - 1];

  // 判準只有兩條，而且都不需要「相對於什麼」：
  //
  //   一、散布必須真的在縮（至少 100 倍）。這是趨勢證據，
  //       收斂很慢的函數（1/log(1/x) 七個尺度只縮 4 倍）過不了。
  //   二、最後的散布必須小到足以當一個有意義的誤差棒。
  //
  // 不再拿散布去除以平均值：極限是 0 的時候平均值本身就沒有尺度，
  // x·cos(1/x²) 的取樣值一路縮到 1.2e-8，卻因為「相對於 1e-9 太大」被判不收斂。
  // 散布本來就是這個估計值的不確定度，交給 toleranceFor 去承擔才對 ——
  // 散布大，容差就大，但估計值同樣不確定，錯的答案還是得落在那個範圍內才過得了。
  if (finalSpread > spreads[0] / 100 || finalSpread > 1e-6) {
    return { value: Number.NaN, spread: finalSpread };
  }
  return { value: last, spread: finalSpread };
}

// 「極限不存在」的正面反證：越靠近目標，取樣值的散布**沒有**在縮。
//
// 這是 squeezeSample 的反面。夾擠問「散布有沒有縮到零」，這裡問「有沒有一直不縮」。
// 兩邊都要求看到一個趨勢，而不是看到一次失敗 —— 驗算器算不出來不能當成
// 極限不存在的證據，否則所有難題都可以宣稱自己的答案是 dne。
function divergesByOscillation(f, target, side) {
  const toInfinity = !Number.isFinite(target);
  const directions = side === "+" ? [1] : side === "-" ? [-1] : [1, -1];
  const spreads = [];

  for (let k = 4; k <= 10; k += 1) {
    const values = [];
    // 取樣點刻意用非整數倍率，避免週期函數在每個尺度上都落在同一個相位
    for (const direction of toInfinity ? [1] : directions) {
      for (const scale of [1, 2.3, 4.7, 7.1, 9.3]) {
        const at = toInfinity
          ? Math.pow(10, k) * scale
          : target + direction * Math.pow(10, -k) * scale * Math.max(1, Math.abs(target));
        const value = f(at);
        if (!Number.isFinite(value)) return { diverges: false, detail: "" };
        values.push(value);
      }
    }
    spreads.push(Math.max(...values) - Math.min(...values));
  }

  // 每一個尺度上散布都還在，而且最後一個尺度沒有比第一個小多少 → 不收斂
  const floor = Math.min(...spreads);
  const shrinkage = spreads[0] > 0 ? spreads[spreads.length - 1] / spreads[0] : 1;
  if (floor > 1e-6 && shrinkage > 0.5) {
    return {
      diverges: true,
      detail: `取樣值的散布一路維持在 ${floor.toExponential(2)} 以上，沒有收斂`
    };
  }
  return { diverges: false, detail: "" };
}

function verifyLimit(problem, structure, compileAnswer) {
  const variable = structure.variable;
  const target = evaluateBound(structure.target);
  const body = latex.compile(structure.body, [variable]);
  let computed = numeric.limit(body, target, { side: structure.side === "both" ? "both" : structure.side });

  // n→∞ 而連續外插器算不出來時，改用數列的取樣方式再試一次。
  // 黎曼和、n^{1/n}、Stolz 型平均都卡在這裡 —— 它們不是不收斂，
  // 是被用錯的工具量。放在 DNE 判定之前，因為多一次認真的嘗試會讓
  // 「答案說不存在」更難被誤判成正確。
  // n→∞ 一律兩條路都走，而且要求一致。
  //
  // 不能只在連續外插器失敗時才啟動梯子。n/(n!)^{1/n} 就是反例：n! 從 171 起
  // 溢位成 Infinity，整個函數從 171 起恆等於 0，而 numeric.limit 的取樣點全部
  // 落在那之後 —— 它會非常有自信地回報 0，一次失敗都沒有，然後去指控正確答案 e。
  //
  // 梯子看得到 n=40…640 那一段，會發現跳動在中途放大了 30 倍。所以：
  // 梯子說不對勁的時候，就算連續外插器一路順利，也不採信。
  let lastLadderBroken = false;
  if (target === Infinity) {
    const ladder = sequenceLimit(body);
    lastLadderBroken = Boolean(ladder.broken);
    const bothFinite = Number.isFinite(ladder.value) && Number.isFinite(computed.value);

    if (bothFinite) {
      // 兩條路都有答案：只擋「質」的分歧。粗梯子的精度有限，
      // 6e-4 的差距是它算不準，不是誰算錯了。
      const gap = Math.abs(ladder.value - computed.value);
      const scale = Math.max(1e-9, Math.abs(ladder.value));
      if (gap / scale > 1e-2) {
        computed = {
          value: Number.NaN,
          error: Number.NaN,
          reason: `連續取樣與數列取樣算出不同的值（${computed.value} vs ${ladder.value}）`
        };
      }
    } else if (ladder.breakdown) {
      // 梯子明確看到計算本身壞掉（跳動放大、相鄰項對不上）。
      // 這種時候就算連續取樣一路順利也不採信 —— n/(n!)^{1/n} 的取樣點
      // 全部落在溢位之後，它會非常有自信地回報 0。
      computed = { value: Number.NaN, error: Number.NaN, reason: ladder.reason };
    } else if (Number.isFinite(ladder.value)) {
      computed = { value: ladder.value, error: 0, method: "sequence" };
    }
    // 梯子只是「沒結論」（取樣點不足、外插不穩）而連續取樣有答案時，
    // 不降級 —— 沒結論不是反證。
  }

  // 還是算不出來，而且目標是有限點：試「夾擠」。
  //
  // x⌊1/x⌋、x²sin(1/x) 這類在任何鄰域裡都不平滑，外插器必然回報不一致 ——
  // 但它們的取樣值其實一路收在同一個數上。所以改問一個比較弱、但誠實的問題：
  // 越靠近目標，取樣值的散布有沒有跟著縮到零？縮到零才算數。
  //
  // x→∞ 也走這條，但梯子回報 broken 時例外：broken 代表取樣值本身是假的
  // （n! 溢位之後恆為 0），那種情況下夾擠只會看到一串一致的假值而放行。
  // 「資料很亂」可以再用弱一點的工具問；「資料是假的」不行。
  if (!Number.isFinite(computed.value) &&
      (Number.isFinite(target) || (target === Infinity && !lastLadderBroken))) {
    const squeezed = squeezeSample(body, target, structure.side);
    if (Number.isFinite(squeezed.value)) {
      computed = { value: squeezed.value, error: squeezed.spread, method: "squeeze" };
    }
  }

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
    // 答案就是「不存在」的題（answerKind 是 numeric、答案字串寫 dne）。
    //
    // 不能只因為驗算器算不出來就判它對 —— 那是把自己的無能當成證據，
    // 而且會讓「驗不了的題」全部變成 dne 的免死金牌。要的是**正面**的反證：
    // 左右極限確實不同，或者越靠近目標、取樣值的散布越不收斂。
    if (/^dne$/i.test(String(problem.answer || "").trim())) {
      if (/左右極限不同|兩側/.test(computed.reason || "")) {
        return { status: "ok", method: "limit-dne", detail: computed.reason };
      }
      const wander = divergesByOscillation(body, target, structure.side);
      if (wander.diverges) {
        return { status: "ok", method: "limit-dne", detail: wander.detail };
      }
    }
    return { status: "unverified", reason: computed.reason || "數值極限不收斂" };
  }
  const actual = compileAnswer([])();
  return compareNumbers("limit", actual, computed.value, toleranceFor(computed, 1e-5));
}

function verifySeries(problem, structure, compileAnswer) {
  const variable = structure.variable;
  const from = evaluateBound(structure.from);
  const to = evaluateBound(structure.to);
  // 通項裡的調和數 H_n：換成佔位變數，值用前綴和精確算（帶快取）。
  // 題幹有時附定義（",\quad H_n=1+\tfrac12+…"）—— 那是給人看的，先剝掉。
  let bodyTex = structure.body.replace(/,\s*(?:\\quad|\\qquad)?\s*H_n\s*=.*$/, "");
  let harmonicWrap = null;
  if (bodyTex.includes("H_n")) {
    bodyTex = bodyTex.split("H_n").join("h");
    const cache = [0];
    harmonicWrap = (n) => {
      const k = Math.round(n);
      if (k < 1 || k > 5e6) return Number.NaN;
      for (let i = cache.length; i <= k; i += 1) cache.push(cache[i - 1] + 1 / i);
      return cache[k];
    };
  }
  // 「\text{ at }x=-1」型：通項還有一個自由變數，把指定值代進去
  const extraVars = [];
  if (harmonicWrap) extraVars.push("h");
  if (structure.evalAt) extraVars.push(structure.evalAt.variable);
  const body = extraVars.length
    ? (() => {
        const term = latex.compile(bodyTex, [variable, ...extraVars]);
        const bound = structure.evalAt ? evaluateBound(structure.evalAt.value) : null;
        return (n) => {
          const args = [n];
          if (harmonicWrap) args.push(harmonicWrap(n));
          if (structure.evalAt) args.push(bound);
          return term(...args);
        };
      })()
    : latex.compile(bodyTex, [variable]);

  if (structure.op === "product") {
    if (!Number.isFinite(to)) {
      // 無窮乘積 = 部分乘積這個數列的極限。跟黎曼和走同一條梯子。
      const partial = (n) => {
        let product = 1;
        for (let k = from; k <= n; k += 1) {
          product *= body(k);
          if (!Number.isFinite(product)) return product;
        }
        return product;
      };
      const ladder = sequenceLimit(partial);
      if (!Number.isFinite(ladder.value)) {
        return { status: "unverified", method: "infinite-product", reason: ladder.reason };
      }
      return compareNumbers("infinite-product", compileAnswer([])(), ladder.value, 1e-6);
    }
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
    // ODE 類：答案是 x 的函數，比對方式是「代回方程」而不是「比一個數」
    if (value && typeof value.__odeCheck === "function") {
      return value.__odeCheck(compileAnswer(["x"]));
    }
    if (!Number.isFinite(value)) {
      return { status: "unverified", reason: `verify 算出 ${value}` };
    }
    const actual = compileAnswer([])();
    return compareNumbers(`verify:${spec.m}`, actual, value, spec.tol || 1e-5);
  } catch (error) {
    return { status: "error", reason: error.message };
  }
}

// 曲線參數化 {x,y,z?,from,to} → 位置與數值切向量
function compilePath(spec) {
  const comps = [spec.x, spec.y, spec.z].filter((c) => c !== undefined)
    .map((tex) => latex.compile(String(tex), ["t"]));
  return {
    dim: comps.length,
    at: (t) => comps.map((f) => f(t)),
    tangent: (t) => comps.map((f) => numeric.derivative(f, t).value),
    from: latex.compile(String(spec.from ?? 0), [])(),
    to: latex.compile(String(spec.to ?? 1), [])()
  };
}

// 曲面參數化 {x,y,z,u:[a,b],v:[c,d]} → 位置與法向量 r_u × r_v（數值偏導）
function compileSurface(spec) {
  const comps = [spec.x, spec.y, spec.z].map((tex) => latex.compile(String(tex), ["u", "v"]));
  const at = (u, v) => comps.map((f) => f(u, v));
  const normal = (u, v) => {
    const h = 1e-5;
    const ru = comps.map((f) => (f(u + h, v) - f(u - h, v)) / (2 * h));
    const rv = comps.map((f) => (f(u, v + h) - f(u, v - h)) / (2 * h));
    return [
      ru[1] * rv[2] - ru[2] * rv[1],
      ru[2] * rv[0] - ru[0] * rv[2],
      ru[0] * rv[1] - ru[1] * rv[0]
    ];
  };
  const bound = (value) => latex.compile(String(value), [])();
  return { at, normal, u: spec.u.map(bound), v: spec.v.map(bound) };
}

// ∬ 過參數域：內外都用自適應積分
function integrateOverSurface(surface, integrand) {
  return numeric.integrate(
    (u) => numeric.integrate((v) => integrand(u, v), surface.v[0], surface.v[1]).value,
    surface.u[0], surface.u[1]
  ).value;
}

const EXPLICIT_METHODS = {
  // 線積分：kind "ds"（純量 × |r′|）或 "work"（F·r′）。
  // 曲線寫成參數式（可以是 paths 陣列 —— 三角形這種折線一段一段給）。
  // 參數化是題幹的重述不是解法：驗算端只做數值微分與數值積分。
  lineIntegral: (spec) => {
    const pieces = (spec.paths || [spec.path]).map(compilePath);
    let total = 0;
    for (const path of pieces) {
      if (spec.kind === "ds") {
        const f = latex.compile(spec.f, path.dim === 3 ? ["x", "y", "z"] : ["x", "y"]);
        total += numeric.integrate((t) => {
          const tangent = path.tangent(t);
          return f(...path.at(t)) * Math.hypot(...tangent);
        }, path.from, path.to).value;
      } else {
        const F = spec.F.map((tex) => latex.compile(String(tex), path.dim === 3 ? ["x", "y", "z"] : ["x", "y"]));
        total += numeric.integrate((t) => {
          const pt = path.at(t);
          const tangent = path.tangent(t);
          return F.reduce((sum, comp, i) => sum + comp(...pt) * tangent[i], 0);
        }, path.from, path.to).value;
      }
    }
    return total;
  },

  // 純量面積分 ∬ f dS：|r_u × r_v| 是面積元素
  surfaceScalar: (spec) => {
    const surfaces = (spec.surfaces || [spec.surface]).map(compileSurface);
    const f = latex.compile(spec.f || "1", ["x", "y", "z"]);
    return surfaces.reduce((sum, surface) => sum + integrateOverSurface(surface, (u, v) => {
      return f(...surface.at(u, v)) * Math.hypot(...surface.normal(u, v));
    }), 0);
  },

  // 通量 ∬ F·dS：法向量方向由參數順序決定（作者要讓 r_u×r_v 指向外側）
  surfaceFlux: (spec) => {
    const surfaces = (spec.surfaces || [spec.surface]).map(compileSurface);
    const F = spec.F.map((tex) => latex.compile(String(tex), ["x", "y", "z"]));
    return surfaces.reduce((sum, surface) => sum + integrateOverSurface(surface, (u, v) => {
      const pt = surface.at(u, v);
      const normal = surface.normal(u, v);
      return F.reduce((acc, comp, i) => acc + comp(...pt) * normal[i], 0);
    }), 0);
  },

  // ∬ (∇×F)·dS：旋度用數值偏導取，再走通量 —— 不用 Stokes 也不解旋度
  curlFlux: (spec) => {
    const surfaces = (spec.surfaces || [spec.surface]).map(compileSurface);
    const field = compileField3(spec.F.map(String));
    return surfaces.reduce((sum, surface) => sum + integrateOverSurface(surface, (u, v) => {
      const pt = surface.at(u, v);
      const curl = field.curl(pt);
      const normal = surface.normal(u, v);
      return curl[0] * normal[0] + curl[1] * normal[1] + curl[2] * normal[2];
    }), 0);
  },

  // 全微分估計：Δf ≈ f_x·dx + f_y·dy（偏導數值取）
  totalDiff: (spec) => {
    const f = latex.compile(spec.f, spec.vars || ["x", "y"]);
    const at = spec.at.map((value) => latex.compile(String(value), [])());
    const deltas = spec.d.map((value) => latex.compile(String(value), [])());
    return at.reduce((sum, _, i) => sum + partial3((...a) => f(...a), at, i) * deltas[i], 0);
  },

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
    let bestPoint = null;
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
      if (Number.isFinite(value) && (wantMax ? value > best : value < best)) {
        best = value;
        bestPoint = point;
      }
    }
    // spec.arg 給了就回傳「在哪裡取到」而不是「取到多少」——
    // 最佳化題常問的是尺寸（盒高、罐半徑），不是那個極值本身。
    if (spec.arg !== undefined) {
      if (!bestPoint) throw new Error("找不到極值點");
      return bestPoint[spec.arg];
    }
    return best;
  },

  // 方程式的根（隱函數微分、牛頓法題型）
  //
  // spec.n 給了就只跑 n 次迭代，不跑到收斂 —— 牛頓法題目問的是「第一步跑到哪」，
  // 那個中間值才是答案。導數一律用數值微分算，所以作者手推的 f′ 錯了會被抓到。
  root: (spec) => {
    const f = latex.compile(spec.f, ["x"]);
    let x = spec.x0 === undefined ? 1 : spec.x0;
    const limit = spec.n === undefined ? 200 : spec.n;
    for (let i = 0; i < limit; i += 1) {
      const slope = numeric.derivative(f, x).value;
      if (!Number.isFinite(slope) || slope === 0) break;
      const next = x - f(x) / slope;
      if (spec.n === undefined && Math.abs(next - x) < 1e-14) return next;
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
  },

  /* ── 以下五個是微分應用題專用的驗算路徑（2026-08 補） ────────────
     這幾類題目原本一支都驗不了：題幹是一段文字敘述，自動辨識器讀不出
     結構，而 value/deriv 又只能比對「作者自己寫下來的式子」——
     那等於把答案抄兩遍，驗不到任何東西。
     共同原則：驗算端一律走數值路徑，不重複作者的代數。          */

  // 隱函數的 dy/dx：完全不用隱微分公式。
  // 在 x 附近解 F(x, y)=0 得到 y(x)（牛頓法），再對這個「解出來的函數」
  // 做數值微分 —— 和「兩邊微分再解 y′」共用不到任何一步。
  implicit: (spec) => {
    const F = latex.compile(spec.F, ["x", "y"]);
    const x0 = latex.compile(String(spec.at[0]), [])();
    const y0 = latex.compile(String(spec.at[1]), [])();
    if (Math.abs(F(x0, y0)) > 1e-8) {
      throw new Error(`(${spec.at[0]}, ${spec.at[1]}) 不在曲線上，F = ${format(F(x0, y0))}`);
    }
    const solveY = (x) => {
      let y = y0;
      for (let i = 0; i < 200; i += 1) {
        const slope = numeric.derivative((t) => F(x, t), y).value;
        if (!Number.isFinite(slope) || slope === 0) break;
        const next = y - F(x, y) / slope;
        if (!Number.isFinite(next)) break;
        y = next;
        if (Math.abs(F(x, y)) < 1e-13) break;
      }
      return y;
    };
    return numeric.derivative(solveY, x0).value;
  },

  // 反函數的導數：不套 (f^{-1})′(b) = 1/f′(a)，而是先解 f(x)=b 找出 a，
  // 再數值微分。作者最常錯的是「f(a)=b 這件事本身」，這樣才抓得到。
  inverseDeriv: (spec) => {
    const f = latex.compile(spec.f, ["x"]);
    const target = latex.compile(String(spec.at), [])();
    let x = spec.x0 === undefined ? 1 : spec.x0;
    for (let i = 0; i < 200; i += 1) {
      const slope = numeric.derivative(f, x).value;
      if (!Number.isFinite(slope) || slope === 0) break;
      const next = x - (f(x) - target) / slope;
      if (Math.abs(next - x) < 1e-14) { x = next; break; }
      x = next;
    }
    if (Math.abs(f(x) - target) > 1e-8) throw new Error(`解不出 f(x)=${spec.at}`);
    return 1 / numeric.derivative(f, x).value;
  },

  // 參數式的 dy/dx：兩支都數值微分再相除。
  paramSlope: (spec) => {
    const x = latex.compile(spec.x, ["t"]);
    const y = latex.compile(spec.y, ["t"]);
    const at = latex.compile(String(spec.at), [])();
    return numeric.derivative(y, at).value / numeric.derivative(x, at).value;
  },

  // 線性近似的估計值 f(a) + f′(a)·dx。f′ 由數值微分給，
  // 所以驗的是「作者的 f′(a) 對不對」，不是把估計式再抄一遍。
  linApprox: (spec) => {
    const f = latex.compile(spec.f, ["x"]);
    const a = latex.compile(String(spec.a), [])();
    const dx = latex.compile(String(spec.dx), [])();
    return f(a) + numeric.derivative(f, a).value * dx;
  },

  // IVP 的數值答案：RK4 從初始條件積到指定點，跟答案比一個數。
  // 這條完全不碰解析解 —— 它就是「不會解 ODE 的人也能算出來」的那條路。
  // spec: { m:"odeValue", f:"y", y0:[0,1], at:2 }
  odeValue: (spec) => {
    const rhs = latex.compile(spec.f, ["x", "y"]);
    let x = spec.y0[0];
    let y = spec.y0[1];
    const target = spec.at;
    const steps = 4000;
    const h = (target - x) / steps;
    for (let i = 0; i < steps; i += 1) {
      const k1 = rhs(x, y);
      const k2 = rhs(x + h / 2, y + (h * k1) / 2);
      const k3 = rhs(x + h / 2, y + (h * k2) / 2);
      const k4 = rhs(x + h, y + h * k3);
      y += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      x += h;
      if (!Number.isFinite(y)) throw new Error("RK4 在 x=" + x.toFixed(3) + " 爆掉");
    }
    return y;
  },
  // 一階 ODE：檢查答案 y(x) 滿足 y' = f(x, y) 與初始條件。
  // 驗算完全不解方程 —— 對答案函數做數值微分，代回方程看殘差。
  // spec: { m:"ode1", f:"x*y", y0:[0,1], from:0.2, to:1.5 }
  ode1: (spec) => {
    const rhs = latex.compile(spec.f, ["x", "y"]);
    return { __odeCheck: (answerFn) => {
      const from = spec.from ?? 0.2;
      const to = spec.to ?? 1.5;
      let checked = 0;
      for (let i = 0; i <= 8; i += 1) {
        const x = from + ((to - from) * i) / 8;
        const y = answerFn(x);
        if (!Number.isFinite(y)) continue;
        const dy = numeric.derivative(answerFn, x).value;
        const want = rhs(x, y);
        if (!Number.isFinite(dy) || !Number.isFinite(want)) continue;
        if (Math.abs(dy - want) > 1e-4 * Math.max(1, Math.abs(want))) {
          return { status: "mismatch", method: "ode1", detail: `x=${x.toFixed(3)} 處 y'=${dy} 但 f(x,y)=${want}` };
        }
        checked += 1;
      }
      if (checked < 4) return { status: "unverified", reason: "取樣點不足" };
      if (spec.y0) {
        const got = answerFn(spec.y0[0]);
        if (Math.abs(got - spec.y0[1]) > 1e-6 * Math.max(1, Math.abs(spec.y0[1]))) {
          return { status: "mismatch", method: "ode1", detail: `初始條件 y(${spec.y0[0]}) 應為 ${spec.y0[1]}，答案給 ${got}` };
        }
      }
      return { status: "ok", method: "ode1", detail: `${checked} 個點滿足方程` };
    } };
  },

  // 常係數二階線性 ODE：a·y'' + b·y' + c·y = g(x)（g 省略時為 0）。
  // spec: { m:"ode2const", a:1, b:-3, c:2, g:"0", y0:[0,1], yp0:[0,0] }
  ode2const: (spec) => {
    const g = latex.compile(spec.g || "0", ["x"]);
    return { __odeCheck: (answerFn) => {
      let checked = 0;
      for (let i = 0; i <= 8; i += 1) {
        const x = 0.2 + (1.3 * i) / 8;
        const y = answerFn(x);
        const d1 = numeric.derivative(answerFn, x);
        if (!Number.isFinite(y) || !Number.isFinite(d1.value)) continue;
        // 二階導：對一階導再數值微分（步長取粗一點抵抗雜訊）
        const h = 1e-3;
        const d2 = (answerFn(x + h) - 2 * y + answerFn(x - h)) / (h * h);
        const lhs = (spec.a ?? 1) * d2 + (spec.b ?? 0) * d1.value + (spec.c ?? 0) * y;
        const rhsValue = g(x);
        if (Math.abs(lhs - rhsValue) > 5e-3 * Math.max(1, Math.abs(rhsValue), Math.abs(y))) {
          return { status: "mismatch", method: "ode2const", detail: `x=${x.toFixed(3)} 處殘差 ${(lhs - rhsValue).toExponential(2)}` };
        }
        checked += 1;
      }
      if (checked < 4) return { status: "unverified", reason: "取樣點不足" };
      if (spec.y0) {
        const got = answerFn(spec.y0[0]);
        if (Math.abs(got - spec.y0[1]) > 1e-5 * Math.max(1, Math.abs(spec.y0[1]))) {
          return { status: "mismatch", method: "ode2const", detail: `y(${spec.y0[0]}) 應為 ${spec.y0[1]}，答案給 ${got}` };
        }
      }
      if (spec.yp0) {
        const got = numeric.derivative(answerFn, spec.yp0[0]).value;
        if (Math.abs(got - spec.yp0[1]) > 1e-3 * Math.max(1, Math.abs(spec.yp0[1]))) {
          return { status: "mismatch", method: "ode2const", detail: `y'(${spec.yp0[0]}) 應為 ${spec.yp0[1]}，答案給 ${got}` };
        }
      }
      return { status: "ok", method: "ode2const", detail: `${checked} 個點滿足方程` };
    } };
  },

  // 遞迴數列 a_{n+1} = g(a_n)：巢狀根式、連分數、Newton 型。
  //
  // 這類的題幹是 \sqrt{2+\sqrt{2+\cdots}} 或一段文字敘述，沒有可以直接
  // 求值的記號，所以自動路徑接不到。這裡就照定義迭代 —— 而且**不解不動點方程**：
  // 解 L=√(2+L) 是解題者的推導，重跑一次證明不了任何事；直接迭代才是獨立的路徑。
  recurrence: (spec) => {
    const step = latex.compile(spec.f, [spec.v || "a"]);
    let value = latex.compile(String(spec.a0), [])();
    const iterations = spec.iterations || 5000;
    for (let i = 0; i < iterations; i += 1) {
      const next = step(value);
      if (!Number.isFinite(next)) throw new Error(`第 ${i} 次迭代跑出 ${next}`);
      if (Math.abs(next - value) <= 1e-15 * Math.max(1, Math.abs(next))) return next;
      value = next;
    }
    throw new Error(`迭代 ${iterations} 次還沒收斂`);
  },

  // 慢慢收斂的數列極限。細節見 extrapolateSequence。
  seqLimit: (spec) => {
    const f = latex.compile(spec.f, [spec.v || "n"]);
    const result = spec.n0 ? extrapolateSequence(f, spec) : sequenceLimit(f);
    if (!Number.isFinite(result.value)) throw new Error(result.reason);
    return result.value;
  },

  // 微分（誤差傳遞）df = f′(a)·dx
  differential: (spec) => {
    const f = latex.compile(spec.f, ["x"]);
    const a = latex.compile(String(spec.a), [])();
    const dx = latex.compile(String(spec.dx), [])();
    return numeric.derivative(f, a).value * dx;
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
