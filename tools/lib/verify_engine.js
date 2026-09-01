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
    return compareNumbers("radius", compileAnswer([])(), 0, 1e-3);
  }
  const upper = scanConvergenceEdge(wrapped, start, +1);
  const lower = scanConvergenceEdge(wrapped, start, -1);
  if (!Number.isFinite(upper) || !Number.isFinite(lower)) {
    // 兩邊都掃不到發散：半徑無限大
    const actualInf = compileAnswer([])();
    if (!Number.isFinite(actualInf)) return { status: "ok", method: "radius", detail: "∞ ≈ ∞" };
    return { status: "unverified", reason: "掃不到發散邊緣（半徑可能是 ∞），答案卻是有限值 " + actualInf };
  }
  const radius = (upper - lower) / 2;
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

  // Coefficient of x^k in f
  const coefficient = prompt.match(/^\\text\{Coefficient of \}x\^\{?(\d+)\}?\\text\{ in \}(.+)$/);
  if (coefficient) {
    const k = Number(coefficient[1]);
    const expr = coefficient[2].trim();
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
  const textForm = recognizeTextForm(problem.prompt);
  if (textForm) {
    try {
      return textForm(problem, compileAnswer);
    } catch (error) {
      return { status: "error", reason: error.message };
    }
  }

  // 多變數極限 lim_{(x,y)→(0,0)}：沿多條路徑取樣。
  const mv = String(problem.prompt || "").match(/^\\lim_\{\(x,y\)\\to\(0,0\)\}(.+)$/);
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
  const body = latex.compile(structure.body, [variable]);

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
