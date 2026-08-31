// LaTeX 數學式 → 可求值的 JS 函式
//
// 為什麼不用 app.js 裡的 normalizeExpression：那一支是給**使用者輸入**用的，
// 使用者會打 sin(x)、x^2，一定有括號。題幹是排版用的 LaTeX，會出現
// \sin x、\frac1x、\left(...\right)、2\pi、n!、\sqrt[3]{x} 這些東西，
// 正則鏈接不住。這裡改用 tokenizer + 遞迴下降，語法錯了會丟例外，
// 不會安靜地產出一個看起來能跑但意思不同的式子。
//
// 這支只負責「LaTeX → 數值」。它不知道題目、不知道答案，
// 所以拿它算出來的結果去比對答案，是一條真正獨立的驗算路徑。

"use strict";

/* ── 執行期數學函式庫 ──────────────────────────────────────── */

const LN_SQRT_2PI = 0.9189385332046728;
const LANCZOS = [
  676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012,
  9.9843695780195716e-6, 1.5056327351493116e-7
];

function lgamma(x) {
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
  const z = x - 1;
  let a = 0.99999999999980993;
  for (let i = 0; i < LANCZOS.length; i += 1) a += LANCZOS[i] / (z + i + 1);
  const t = z + LANCZOS.length - 0.5;
  return LN_SQRT_2PI + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

function gamma(x) {
  if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));
  if (Number.isInteger(x) && x > 0 && x < 171) {
    let r = 1;
    for (let i = 2; i < x; i += 1) r *= i;
    return r;
  }
  return Math.exp(lgamma(x)) * (x < 0 && Math.floor(x) % 2 ? -1 : 1);
}

function fact(n) {
  if (Number.isInteger(n) && n >= 0 && n < 171) {
    let r = 1;
    for (let i = 2; i <= n; i += 1) r *= i;
    return r;
  }
  return gamma(n + 1);
}

function binom(n, k) {
  if (!Number.isFinite(n) || !Number.isFinite(k)) return Number.NaN;
  // k 的上限不是效能考量，是不能掛掉：數值積分做無窮區間變換時會把 n 推到 1e18，
  // 而 Number.isInteger(4e18) 是 true，精確迴圈就會跑 4×10^18 圈 —— 整個程序卡死。
  // 大到那個地步時 lgamma 版本本來就是唯一合理的算法。
  if (Number.isInteger(n) && Number.isInteger(k) && n >= 0 && k >= 0 && k <= 1000) {
    if (k > n) return 0;
    let r = 1;
    for (let i = 0; i < k; i += 1) r = (r * (n - i)) / (i + 1);
    return Math.round(r);
  }
  return Math.exp(lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1));
}

// Abramowitz & Stegun 7.1.26 不夠準（1e-7），這裡用連分數展開的互補誤差函數
function erfc(x) {
  const z = Math.abs(x);
  const t = 1 / (1 + z / 2);
  const COEFFS = [
    0.17087277, -0.82215223, 1.48851587, -1.13520398, 0.27886807,
    -0.18628806, 0.09678418, 0.37409196, 1.00002368, -1.26551223
  ];
  let poly = 0;
  COEFFS.forEach((c) => { poly = poly * t + c; });
  const r = t * Math.exp(-z * z + poly);
  return x >= 0 ? r : 2 - r;
}

// 積分、級數、乘積要能當成「運算式的一部分」出現，例如
//   \frac{d}{dx}\int_0^{x^2}e^{t^2}dt        微積分基本定理
//   \lim_{n\to\infty}n(\sum_{k=1}^n\frac1{n+k}-\log 2)   黎曼和
//   \int_0^1\int_0^x xy\,dy\,dx             疊積分
//
// 這些在題庫裡有五十幾題，而且全都是「解析失敗」——
// 因為原本的解析器只認得**整個題幹就是一個積分**的形狀。
// 把它們編譯成執行期的閉包之後，巢狀多深都能算。
const numeric = require("./numeric.js");

const OPERATORS = {
  INTEGRATE: (fn, a, b) => numeric.integrate(fn, a, b).value,
  SERIES: (fn, from, to) => {
    if (!Number.isFinite(to)) return numeric.seriesSum(fn, from).value;
    const total = numeric.createSum();
    // 上限可能是非整數（極限把 n 當實數在逼近），照 LaTeX 的語意取到不超過它的整數
    const last = Math.floor(to);
    if (last - from > 5e6) return Number.NaN;
    for (let k = Math.ceil(from); k <= last; k += 1) total.add(fn(k));
    return total.value;
  },
  PRODUCT: (fn, from, to) => {
    if (!Number.isFinite(to)) return Number.NaN;
    let product = 1;
    const last = Math.floor(to);
    if (last - from > 1e6) return Number.NaN;
    // 連乘很容易溢位／歸零，改成累加對數再取回來（同時記正負號）
    let logSum = 0;
    let sign = 1;
    for (let k = Math.ceil(from); k <= last; k += 1) {
      const value = fn(k);
      if (value === 0) return 0;
      if (!Number.isFinite(value)) return Number.NaN;
      sign *= Math.sign(value);
      logSum += Math.log(Math.abs(value));
      product *= value;
    }
    return Number.isFinite(product) && product !== 0 ? product : sign * Math.exp(logSum);
  }
};

const RUNTIME = {
  INTEGRATE: OPERATORS.INTEGRATE,
  SERIES: OPERATORS.SERIES,
  PRODUCT: OPERATORS.PRODUCT,
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos, atan: Math.atan, atan2: Math.atan2,
  sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
  asinh: Math.asinh, acosh: Math.acosh, atanh: Math.atanh,
  sec: (v) => 1 / Math.cos(v),
  csc: (v) => 1 / Math.sin(v),
  cot: (v) => 1 / Math.tan(v),
  sech: (v) => 1 / Math.cosh(v),
  csch: (v) => 1 / Math.sinh(v),
  coth: (v) => 1 / Math.tanh(v),
  asec: (v) => Math.acos(1 / v),
  acsc: (v) => Math.asin(1 / v),
  acot: (v) => Math.atan(1 / v),
  exp: Math.exp, log: Math.log, log2: Math.log2, log10: Math.log10,
  logbase: (b, v) => Math.log(v) / Math.log(b),
  sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, sign: Math.sign,
  floor: Math.floor, ceil: Math.ceil, round: Math.round,
  min: Math.min, max: Math.max, pow: Math.pow, hypot: Math.hypot,
  gamma, lgamma, fact, binom,
  erf: (v) => 1 - erfc(v),
  erfc,
  PI: Math.PI, E: Math.E, Infinity, NaN: Number.NaN
};

/* ── Tokenizer ─────────────────────────────────────────────── */

// 排版用、對數值毫無影響的東西，直接丟掉
const IGNORED_COMMANDS = new Set([
  "left", "right", "displaystyle", "textstyle", "limits", "nolimits",
  "quad", "qquad", "bigl", "bigr", "Bigl", "Bigr", "biggl", "biggr",
  "Biggl", "Biggr", "big", "Big", "bigg", "Bigg", "mathrm", "mathop",
  "negthinspace", "thinspace", "phantom", "vphantom"
]);

const SPACING = /^\\[,.;!:> ]|^\\quad|^\\qquad|^~|^\\ /;

function tokenize(source) {
  const tokens = [];
  let i = 0;
  const src = String(source);
  while (i < src.length) {
    const rest = src.slice(i);
    const space = rest.match(SPACING);
    if (space) { i += space[0].length; continue; }
    const ch = src[i];
    if (/\s/.test(ch)) { i += 1; continue; }
    if (ch === "\\") {
      const m = rest.match(/^\\([A-Za-z]+)/);
      if (m) {
        i += m[0].length;
        if (IGNORED_COMMANDS.has(m[1])) continue;
        tokens.push({ t: "cmd", v: m[1] });
        continue;
      }
      // \{ \} \| 之類的轉義符號
      tokens.push({ t: "punct", v: src[i + 1] });
      i += 2;
      continue;
    }
    if (/[0-9]/.test(ch)) {
      const m = rest.match(/^[0-9]+(\.[0-9]+)?/);
      tokens.push({ t: "num", v: m[0] });
      i += m[0].length;
      continue;
    }
    if (/[A-Za-z]/.test(ch)) {
      // 數學排版裡每個字母是獨立的變數，abc 是 a*b*c 不是變數 abc。
      // 例外：微積分題幹裡的 e 一律是自然底數，沒有人拿 e 當變數名。
      tokens.push(ch === "e" ? { t: "cmd", v: "e" } : { t: "ident", v: ch });
      i += 1;
      continue;
    }
    tokens.push({ t: "punct", v: ch });
    i += 1;
  }
  tokens.push({ t: "eof", v: "" });
  return tokens;
}

/* ── Parser ────────────────────────────────────────────────── */

// 希臘字母等常數；其餘 cmd 若不認得就丟例外（寧可解析失敗，也不要猜錯）
const CONSTANTS = {
  pi: "PI", Pi: "PI", tau: "(2*PI)", infty: "Infinity", e: "E",
  gamma: "0.5772156649015329", varphi: "((1+sqrt(5))/2)", phi: "((1+sqrt(5))/2)"
};

// 有「函數」語意的指令：\sin x 要吃掉後面的東西當引數
const FUNCTIONS = {
  sin: "sin", cos: "cos", tan: "tan", sec: "sec", csc: "csc", cot: "cot",
  sinh: "sinh", cosh: "cosh", tanh: "tanh", sech: "sech", csch: "csch", coth: "coth",
  arcsin: "asin", arccos: "acos", arctan: "atan",
  arcsec: "asec", arccsc: "acsc", arccot: "acot",
  arsinh: "asinh", arcosh: "acosh", artanh: "atanh",
  arcsinh: "asinh", arccosh: "acosh", arctanh: "atanh",
  ln: "log", exp: "exp", sgn: "sign", sign: "sign",
  erf: "erf", erfc: "erfc", Gamma: "gamma"
};

// 單一字母的變數若被寫成 \alpha 之類，映射成合法識別字
const GREEK_VARS = {
  alpha: "alpha", beta: "beta", theta: "theta", lambda: "lambda", mu: "mu",
  nu: "nu", rho: "rho", sigma: "sigma", omega: "omega", epsilon: "epsilon",
  varepsilon: "epsilon", delta: "delta", Delta: "Delta", eta: "eta", zeta: "zeta",
  xi: "xi", kappa: "kappa", psi: "psi", chi: "chi"
};

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
    // 在 |…| 裡面時，收尾的那個 | 不能被當成「又一個絕對值開頭」而吃掉
    this.absDepth = 0;
    // ∫…dt 的 t、Σ_{k=1} 的 k 是**綁定變數**，不是需要外面給值的自由變數。
    // 不記下來的話，compile 會抱怨「t 沒有給值」。
    this.bound = new Set();
  }
  peek(offset = 0) { return this.tokens[this.pos + offset]; }
  next() { return this.tokens[this.pos++]; }
  at(type, value) {
    const tok = this.peek();
    return tok.t === type && (value === undefined || tok.v === value);
  }
  expect(type, value) {
    if (!this.at(type, value)) {
      throw new Error(`預期 ${value || type}，實際是 ${JSON.stringify(this.peek())}`);
    }
    return this.next();
  }

  parseExpression() {
    let left = this.parseTerm();
    while (this.at("punct", "+") || this.at("punct", "-")) {
      const op = this.next().v;
      const right = this.parseTerm();
      left = `(${left}${op}${right})`;
    }
    return left;
  }

  parseTerm() {
    let left = this.parseUnary();
    for (;;) {
      if (this.at("punct", "*") || this.at("punct", "/")) {
        const op = this.next().v;
        left = `(${left}${op}${this.parseUnary()})`;
      } else if (this.at("cmd", "cdot") || this.at("cmd", "times")) {
        this.next();
        left = `(${left}*${this.parseUnary()})`;
      } else if (this.at("cmd", "div")) {
        this.next();
        left = `(${left}/${this.parseUnary()})`;
      } else if (this.startsFactor()) {
        // 隱含乘法：2x、x\sin y、3\pi
        left = `(${left}*${this.parseUnary()})`;
      } else {
        return left;
      }
    }
  }

  startsFactor() {
    const tok = this.peek();
    if (tok.t === "num" || tok.t === "ident") return true;
    if (tok.t === "punct") {
      if (tok.v === "|") return this.absDepth === 0;
      return tok.v === "(" || tok.v === "{" || tok.v === "[";
    }
    if (tok.t === "cmd") {
      // rfloor / rceil 是閉合符號，不是下一個乘數 —— 少了它們，
      // \lfloor x \rfloor 會被讀成 x 乘上一個不認得的指令
      return !["cdot", "times", "div", "to", "rightarrow", "right", "over",
        "rfloor", "rceil"].includes(tok.v);
    }
    return false;
  }

  parseUnary() {
    if (this.at("punct", "-")) { this.next(); return `(-${this.parseUnary()})`; }
    if (this.at("punct", "+")) { this.next(); return this.parseUnary(); }
    return this.parsePower();
  }

  parsePower() {
    const base = this.parsePostfix();
    if (this.at("punct", "^")) {
      this.next();
      // 指數是右結合，而且 ^ 之後只吃一個 atom（x^2y 是 (x^2)*y）
      const exponent = this.parsePowerOperand();
      return `Math.pow(${base},${exponent})`;
    }
    return base;
  }

  parsePowerOperand() {
    if (this.at("punct", "-")) { this.next(); return `(-${this.parsePowerOperand()})`; }
    if (this.at("punct", "+")) { this.next(); return this.parsePowerOperand(); }
    const atom = this.parseAtom();
    if (this.at("punct", "^")) {
      this.next();
      return `Math.pow(${atom},${this.parsePowerOperand()})`;
    }
    return atom;
  }

  parsePostfix() {
    let value = this.parseAtom();
    while (this.at("punct", "!")) {
      this.next();
      value = `fact(${value})`;
    }
    return value;
  }

  // 供 \sin 這類函數取引數用：吃一個「緊貼」的運算元。
  // \sin 2x 是 sin(2x)，\sin x\cos x 是 sin(x)*cos(x) —— 差別在數字後面要繼續吃。
  parseFunctionArgument() {
    if (this.at("punct", "(") || this.at("punct", "{") || this.at("punct", "[")) {
      return this.parsePower();
    }
    if (this.at("num")) {
      const number = this.parsePower();
      if (this.at("ident") || (this.at("cmd") && !FUNCTIONS[this.peek().v])) {
        return `(${number}*${this.parseFunctionArgument()})`;
      }
      return number;
    }
    return this.parsePower();
  }

  parseGroup() {
    // 讀一個 {…} 或單一 token（\frac1x 這種省略大括號的寫法）
    if (this.at("punct", "{")) {
      this.next();
      const inner = this.parseExpression();
      this.expect("punct", "}");
      return inner;
    }
    const tok = this.peek();
    if (tok.t === "num") {
      // \frac12 是 1/2，不是 12 分之（空）。省略大括號時，
      // 引數只吃**一個字元** —— 這是 LaTeX 的規則，
      // 而 tokenizer 為了讀 \frac{12}{5} 會把連續數字併成一個 token，
      // 所以這裡要把多位數拆開，剩下的留在原位給下一次讀。
      if (tok.v.length > 1 && !tok.v.includes(".")) {
        const first = tok.v[0];
        tok.v = tok.v.slice(1);
        return first;
      }
      this.next();
      return tok.v;
    }
    if (tok.t === "ident") { this.next(); return tok.v; }
    return this.parseAtom();
  }

  parseAtom() {
    const tok = this.peek();

    if (tok.t === "num") { this.next(); return tok.v; }
    if (tok.t === "ident") { this.next(); return tok.v; }

    if (tok.t === "punct") {
      if (tok.v === "(" || tok.v === "[") {
        this.next();
        const inner = this.parseExpression();
        this.expect("punct", tok.v === "(" ? ")" : "]");
        return `(${inner})`;
      }
      if (tok.v === "{") {
        this.next();
        const inner = this.parseExpression();
        this.expect("punct", "}");
        return `(${inner})`;
      }
      if (tok.v === "|") {
        this.next();
        this.absDepth += 1;
        const inner = this.parseExpression();
        this.absDepth -= 1;
        this.expect("punct", "|");
        return `abs(${inner})`;
      }
      throw new Error(`看不懂的符號 "${tok.v}"`);
    }

    if (tok.t === "cmd") {
      this.next();
      const name = tok.v;

      if (name === "int" || name === "iint" || name === "iiint" || name === "oint") {
        return this.parseIntegral(name);
      }
      if (name === "sum" || name === "prod") {
        return this.parseBigOperator(name);
      }
      if (name === "frac" || name === "dfrac" || name === "tfrac") {
        const numerator = this.parseGroup();
        const denominator = this.parseGroup();
        return `((${numerator})/(${denominator}))`;
      }
      if (name === "sqrt") {
        if (this.at("punct", "[")) {
          this.next();
          const degree = this.parseExpression();
          this.expect("punct", "]");
          return `Math.pow(${this.parseGroup()},1/(${degree}))`;
        }
        return `sqrt(${this.parseGroup()})`;
      }
      if (name === "binom" || name === "dbinom" || name === "tbinom") {
        return `binom(${this.parseGroup()},${this.parseGroup()})`;
      }
      if (name === "log") {
        // \log_2 x 是以 2 為底；沒有下標時當自然對數（微積分教材慣例）
        if (this.at("punct", "_")) {
          this.next();
          const base = this.parseGroup();
          return `logbase(${base},${this.parseFunctionArgument()})`;
        }
        // \log^2 x 跟 \sin^2 x 一樣是 (log x)^2。少了這段，\ln^2 x 能解析
        // 而 \log^2 x 會丟「看不懂的符號 ^」—— 同一件事兩種結果，是陷阱。
        if (this.at("punct", "^")) {
          this.next();
          const power = this.parsePowerOperand();
          return `Math.pow(log(${this.parseFunctionArgument()}),${power})`;
        }
        return `log(${this.parseFunctionArgument()})`;
      }
      if (name === "operatorname") {
        const raw = this.readRawBraces();
        const mapped = FUNCTIONS[raw];
        if (!mapped) throw new Error(`不認得的函數 \\operatorname{${raw}}`);
        return `${mapped}(${this.parseFunctionArgument()})`;
      }
      if (FUNCTIONS[name]) {
        // \sin^2 x 是 (sin x)^2，不是 sin(x^2) —— 這個慣例要特別處理
        let power = null;
        if (this.at("punct", "^")) {
          this.next();
          power = this.parsePowerOperand();
        }
        const argument = this.parseFunctionArgument();
        const call = `${FUNCTIONS[name]}(${argument})`;
        if (power === null) return call;
        // \sin^{-1} 是反函數，不是倒數
        if (power.replace(/[()s]/g, "") === "-1") {
          const inverse = { sin: "asin", cos: "acos", tan: "atan", sec: "asec", csc: "acsc", cot: "acot" }[FUNCTIONS[name]];
          if (!inverse) throw new Error(`\\${name}^{-1} 沒有定義的反函數`);
          return `${inverse}(${argument})`;
        }
        return `Math.pow(${call},${power})`;
      }
      // 高斯括號。\left\lfloor…\right\rfloor 的 \left / \right 在
      // tokenize 就被丟掉了，所以這裡只會看到 \lfloor … \rfloor。
      if (name === "lfloor" || name === "lceil") {
        const isFloor = name === "lfloor";
        const closer = isFloor ? "rfloor" : "rceil";
        const inner = this.parseExpression();
        if (!this.at("cmd", closer)) throw new Error(`\\${name} 少了配對的 \\${closer}`);
        this.next();
        return `${isFloor ? "floor" : "ceil"}(${inner})`;
      }

      if (CONSTANTS[name]) return CONSTANTS[name];
      if (GREEK_VARS[name]) return GREEK_VARS[name];
      if (name === "lvert" || name === "rvert" || name === "vert" || name === "lVert" || name === "rVert") {
        // |x| 的另一種寫法；當成分隔符處理
        const inner = this.parseExpression();
        if (this.at("cmd", "rvert") || this.at("cmd", "vert") || this.at("cmd", "rVert")) this.next();
        return `abs(${inner})`;
      }
      throw new Error(`不認得的指令 \\${name}`);
    }

    throw new Error(`式子在 ${JSON.stringify(tok)} 處結束不掉`);
  }

  // 讀 _下限^上限（兩種順序都要吃，也可以完全沒有）
  readLimits() {
    let lower = null;
    let upper = null;
    for (let round = 0; round < 2; round += 1) {
      if (this.at("punct", "_") && lower === null) {
        this.next();
        lower = this.parseGroup();
      } else if (this.at("punct", "^") && upper === null) {
        this.next();
        upper = this.parseGroup();
      } else break;
    }
    return { lower, upper };
  }

  // \int_a^b <被積函數> d<變數>
  //
  // 難點在「被積函數到哪裡結束」。疊積分 ∫∫ f dy dx 的外層要配到**最後**一個
  // 微分符號，不是第一個 —— 配到第一個的話外層會拿到一個殘缺的式子。
  // 所以先掃出這一層所有的 d<變數>，最後一個歸自己，前面的留給內層去撿。
  parseIntegral(name) {
    const limits = this.readLimits();
    const start = this.pos;
    const differentials = this.findDifferentials(start);
    if (!differentials.length) {
      throw new Error("積分式裡找不到 d<變數>");
    }
    const mine = differentials[differentials.length - 1];
    this.bound.add(mine.variable);
    const body = this.subParse(start, mine.at);
    this.pos = mine.end;

    const lower = limits.lower === null ? "0" : limits.lower;
    const upper = limits.upper === null ? "1" : limits.upper;
    if (limits.lower === null || limits.upper === null) {
      throw new Error("運算式裡的積分必須有上下限（不定積分請放在題幹最外層）");
    }
    return `INTEGRATE(function(${mine.variable}){return (${body});},${lower},${upper})`;
  }

  // \sum_{k=a}^{b} <一個項>
  //
  // 求和只吃**一個項**（乘除串），不吃到 + 或 −。
  // 這是排版慣例也是數學慣例：Σaₖ − c 是 (Σaₖ) − c，不是 Σ(aₖ − c)。
  parseBigOperator(name) {
    // 下限長得像 k=1，裡面有 "="，直接當運算式解析會當場卡住。
    // 所以先把大括號的範圍抓出來，在 token 層級切開 "="，兩邊各自處理。
    if (!this.at("punct", "_")) throw new Error(`\\${name} 必須有下限`);
    this.next();
    const index = this.readIndexBinding();
    let upper = null;
    if (this.at("punct", "^")) {
      this.next();
      upper = this.parseGroup();
    }
    if (upper === null) throw new Error(`\\${name} 必須有上限`);
    this.bound.add(index.variable);
    const body = this.parseTerm();
    const call = name === "sum" ? "SERIES" : "PRODUCT";
    return `${call}(function(${index.variable}){return (${body});},${index.start},${upper})`;
  }

  // 讀 {k=1} 這種綁定，回傳 {variable, start}
  readIndexBinding() {
    if (!this.at("punct", "{")) {
      const tok = this.peek();
      throw new Error(`求和下限要寫成 {k=起點}，實際是 ${JSON.stringify(tok)}`);
    }
    const open = this.pos;
    let depth = 0;
    let close = -1;
    let equals = -1;
    for (let i = open; i < this.tokens.length; i += 1) {
      const tok = this.tokens[i];
      if (tok.t === "eof") break;
      if (tok.t === "punct" && "({[".includes(tok.v)) depth += 1;
      else if (tok.t === "punct" && ")}]".includes(tok.v)) {
        depth -= 1;
        if (depth === 0) { close = i; break; }
      } else if (tok.t === "punct" && tok.v === "=" && depth === 1 && equals < 0) {
        equals = i;
      }
    }
    if (close < 0 || equals < 0) throw new Error("求和下限要寫成 {k=起點}");
    const nameTokens = this.tokens.slice(open + 1, equals);
    if (nameTokens.length !== 1 || nameTokens[0].t !== "ident") {
      throw new Error("求和的指標必須是單一變數");
    }
    const start = this.subParse(equals + 1, close);
    this.pos = close + 1;
    return { variable: nameTokens[0].v, start };
  }

  parseBigOperatorUnused(name, limits) {
    const body = this.parseTerm();
    const call = name === "sum" ? "SERIES" : "PRODUCT";
    return `${call}(function(${assignment[1]}){return (${body});},${assignment[2]},${limits.upper})`;
  }

  // 從 start 往後找這一層（括號深度 0）的所有 d<變數>
  findDifferentials(start) {
    const found = [];
    let depth = 0;
    for (let i = start; i < this.tokens.length; i += 1) {
      const tok = this.tokens[i];
      if (tok.t === "eof") break;
      if (tok.t === "punct") {
        if ("({[".includes(tok.v)) { depth += 1; continue; }
        if (")}]".includes(tok.v)) {
          if (depth === 0) break; // 已經走出這個群組
          depth -= 1;
          continue;
        }
      }
      if (depth !== 0) continue;
      if (tok.t === "ident" && tok.v === "d") {
        const next = this.tokens[i + 1];
        if (next && next.t === "ident") {
          found.push({ at: i, end: i + 2, variable: next.v });
          i += 1;
        }
      }
    }
    return found;
  }

  // 用一段 token 子範圍另開一個 parser
  subParse(from, to) {
    const slice = this.tokens.slice(from, to).concat([{ t: "eof", v: "" }]);
    const parser = new Parser(slice);
    const js = parser.parseExpression();
    if (!parser.at("eof")) {
      throw new Error(`被積函數解析不完：${JSON.stringify(parser.peek())}`);
    }
    parser.bound.forEach((name) => this.bound.add(name));
    return js;
  }

  readRawBraces() {
    this.expect("punct", "{");
    let out = "";
    while (!this.at("punct", "}")) {
      const tok = this.next();
      if (tok.t === "eof") throw new Error("大括號沒有收尾");
      out += tok.v;
    }
    this.next();
    return out;
  }
}

/* ── 對外 API ──────────────────────────────────────────────── */

// LaTeX → JS 運算式字串
function toJs(latex) {
  const parser = new Parser(tokenize(latex));
  const js = parser.parseExpression();
  if (!parser.at("eof")) {
    throw new Error(`式子後面還有沒解析完的東西：${JSON.stringify(parser.peek())}`);
  }
  return js;
}

// 同上，但另外回傳綁定變數（∫…dt 的 t、Σ_{k=…} 的 k）。
// freeVariables 只看得到產出的 JS 字串，分不出哪些名字是被閉包綁住的，
// 所以要由解析器把這件事講出來。
function toJsWithBindings(latex) {
  const parser = new Parser(tokenize(latex));
  const js = parser.parseExpression();
  if (!parser.at("eof")) {
    throw new Error(`式子後面還有沒解析完的東西：${JSON.stringify(parser.peek())}`);
  }
  return { js, bound: [...parser.bound] };
}

// 產出的 JS 裡會有 function/return 這些關鍵字，還有閉包參數（綁定變數）。
// 它們都不是「需要呼叫端給值」的東西。
const JS_KEYWORDS = new Set(["function", "return", "Math", "var", "let", "const", "true", "false", "null", "undefined"]);

// 掃出式子裡用到的自由變數（排掉執行期函式庫的名字與綁定變數）
function freeVariables(js, bound) {
  const skip = new Set(bound || []);
  const names = new Set();
  (String(js).match(/[A-Za-z_][A-Za-z0-9_]*/g) || []).forEach((name) => {
    if (JS_KEYWORDS.has(name) || RUNTIME[name] !== undefined || skip.has(name)) return;
    names.add(name);
  });
  return [...names];
}

const RUNTIME_NAMES = Object.keys(RUNTIME);

// LaTeX → 可呼叫的 JS 函式。vars 決定參數順序。
function compile(latex, vars) {
  if (typeof latex === "string" && latex.trim().startsWith("js:")) {
    return compileJs(latex.trim().slice(3), vars);
  }
  const parsed = toJsWithBindings(latex);
  return compileJs(parsed.js, vars, parsed.bound);
}

function compileJs(js, vars, bound) {
  const names = vars || freeVariables(js, bound);
  const unknown = freeVariables(js, bound).filter((name) => !names.includes(name));
  if (unknown.length) {
    throw new Error(`式子裡有沒給值的變數：${unknown.join(", ")}`);
  }
  // 只放進執行期函式庫和變數，關掉其他一切
  const fn = new Function(
    ...RUNTIME_NAMES,
    ...names,
    `"use strict"; return (${js});`
  );
  const runtimeValues = RUNTIME_NAMES.map((name) => RUNTIME[name]);
  const wrapped = (...args) => Number(fn(...runtimeValues, ...args));
  wrapped.vars = names;
  wrapped.js = js;
  return wrapped;
}

module.exports = { toJs, toJsWithBindings, compile, compileJs, freeVariables, tokenize, RUNTIME, gamma, lgamma, fact, binom };
