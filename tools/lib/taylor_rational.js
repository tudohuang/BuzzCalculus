// 有理數泰勒級數演算：算 f 在 0 的高階導數與泰勒係數，**精確、不用數值微分**。
//
// 為什麼需要它：d^20/dx^20 在 x=0 這種題，數值微分在 20 階早就淹死在
// 捨入誤差裡（中央差分的噪音以 h^{-n} 放大），Chebyshev 係數萃取也只穩到
// k≤8。但這些題的函數全是初等組合 —— e^{2x}、(log(1+x))²、x⁴/(1−x)⁷ ——
// 它們的泰勒係數是**有理數**，可以用 BigInt 分數精確地捲積出來。
//
// 做法：把 latex.toJs 的輸出（乾淨的 JS 算式文法）重新解析成 AST，
// 在「截斷冪級數 × 有理係數」的代數上求值。這條路徑跟解題（萊布尼茲
// 公式、級數展開查表）共用不到任何一步 —— 它只認得加減乘除和
// 基本函數的定義級數。
//
// 遇到會產生無理數的情況（cos(1)、log(2)、π、√2…）一律回 null，
// 讓呼叫端退回數值方法或誠實地說驗不了 —— 寧可不驗，不做假的精確。

"use strict";

/* ── BigInt 分數 ───────────────────────────────────────────── */

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) { const t = a % b; a = b; b = t; }
  return a;
}

function frac(n, d = 1n) {
  if (d === 0n) throw new Error("分母為 0");
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d) || 1n;
  return { n: n / g, d: d / g };
}

const ZERO = frac(0n);
const ONE = frac(1n);

const fAdd = (a, b) => frac(a.n * b.d + b.n * a.d, a.d * b.d);
const fSub = (a, b) => frac(a.n * b.d - b.n * a.d, a.d * b.d);
const fMul = (a, b) => frac(a.n * b.n, a.d * b.d);
const fDiv = (a, b) => {
  if (b.n === 0n) throw new Error("除以 0");
  return frac(a.n * b.d, a.d * b.n);
};
const fNeg = (a) => frac(-a.n, a.d);
const fIsZero = (a) => a.n === 0n;
const fEq = (a, b) => a.n === b.n && a.d === b.d;

function fToNumber(a) {
  if (a.d === 1n) return Number(a.n);
  // 分子分母都超過 double 範圍時 Number()/Number() 會變 Infinity/Infinity。
  // 先用 10 的冪同除壓回範圍再轉 —— 只用於浮點比對，精度夠。
  const numeratorLength = (a.n < 0n ? -a.n : a.n).toString().length;
  const denominatorLength = a.d.toString().length;
  const drop = Math.max(0, Math.min(numeratorLength, denominatorLength) - 17);
  const scale = 10n ** BigInt(drop);
  return Number(a.n / scale) / Number(a.d / scale);
}

// 十進位字串 → 分數（"0.5" → 1/2）
function fracFromDecimal(text) {
  const match = String(text).match(/^(\d+)(?:\.(\d+))?$/);
  if (!match) return null;
  const whole = BigInt(match[1]);
  if (!match[2]) return frac(whole);
  const digits = BigInt(match[2]);
  const scale = 10n ** BigInt(match[2].length);
  return frac(whole * scale + digits, scale);
}

/* ── 截斷冪級數（長度 order+1 的分數陣列）──────────────────── */

function makeSeries(order) {
  return { c: Array.from({ length: order + 1 }, () => ZERO), order };
}

function constant(value, order) {
  const s = makeSeries(order);
  s.c[0] = value;
  return s;
}

function variable(order) {
  const s = makeSeries(order);
  if (order >= 1) s.c[1] = ONE;
  return s;
}

const sAdd = (a, b) => ({ order: a.order, c: a.c.map((v, i) => fAdd(v, b.c[i])) });
const sSub = (a, b) => ({ order: a.order, c: a.c.map((v, i) => fSub(v, b.c[i])) });
const sNeg = (a) => ({ order: a.order, c: a.c.map(fNeg) });

function sMul(a, b) {
  const s = makeSeries(a.order);
  for (let i = 0; i <= a.order; i += 1) {
    if (fIsZero(a.c[i])) continue;
    for (let j = 0; i + j <= a.order; j += 1) {
      if (fIsZero(b.c[j])) continue;
      s.c[i + j] = fAdd(s.c[i + j], fMul(a.c[i], b.c[j]));
    }
  }
  return s;
}

// a / b：先把共同的前導零次消掉（sin x / x 這種），再做長除法。
// 消掉之後 b 的常數項還是 0 → 真的除不了（極點），丟例外讓上層放棄。
function sDiv(a, b) {
  const order = a.order;
  let shift = 0;
  while (shift <= order && fIsZero(b.c[shift])) shift += 1;
  if (shift > order) throw new Error("除以零級數");
  if (shift > 0) {
    for (let i = 0; i < shift; i += 1) {
      if (!fIsZero(a.c[i])) throw new Error("分子在極點不為零：不是冪級數");
    }
  }
  const na = { order, c: a.c.slice(shift).concat(Array.from({ length: shift }, () => ZERO)) };
  const nb = { order, c: b.c.slice(shift).concat(Array.from({ length: shift }, () => ZERO)) };
  // 注意：截掉 shift 位之後，最後 shift 個係數其實已經未知（被補了 0）。
  // 上層要的階數如果踩進那一段，會拿到錯值 —— 呼叫端用 margin 階數避開。
  const q = makeSeries(order);
  for (let k = 0; k <= order; k += 1) {
    let acc = na.c[k];
    for (let j = 0; j < k; j += 1) {
      acc = fSub(acc, fMul(q.c[j], nb.c[k - j]));
    }
    q.c[k] = fDiv(acc, nb.c[0]);
  }
  return q;
}

function sPowInt(a, exponent) {
  if (exponent === 0) return constant(ONE, a.order);
  if (exponent < 0) return sDiv(constant(ONE, a.order), sPowInt(a, -exponent));
  let result = a;
  for (let i = 1; i < exponent; i += 1) result = sMul(result, a);
  return result;
}

// f(u)，u(0)=0：用定義級數逐項組合。u^k 遞推、O(N³)、N≤40 都便宜。
function composeSeries(coefficients, u) {
  // coefficients[k] = f 的第 k 項係數（分數）
  let result = constant(coefficients[0], u.order);
  let power = constant(ONE, u.order);
  for (let k = 1; k < coefficients.length; k += 1) {
    power = sMul(power, u);
    if (fIsZero(coefficients[k])) continue;
    result = sAdd(result, { order: u.order, c: power.c.map((v) => fMul(v, coefficients[k])) });
  }
  return result;
}

function factorialFrac(n) {
  let f = 1n;
  for (let i = 2n; i <= BigInt(n); i += 1n) f *= i;
  return f;
}

function requireVanishing(u, name) {
  if (!fIsZero(u.c[0])) throw new Error(`${name} 的引數在 0 不為零 → 係數是無理數`);
}

const FUNCTIONS = {
  exp: (u) => {
    requireVanishing(u, "exp");
    const coefficients = [];
    for (let k = 0; k <= u.order; k += 1) coefficients.push(frac(1n, factorialFrac(k)));
    return composeSeries(coefficients, u);
  },
  sin: (u) => {
    requireVanishing(u, "sin");
    const coefficients = [];
    for (let k = 0; k <= u.order; k += 1) {
      coefficients.push(k % 2 === 1 ? frac(k % 4 === 1 ? 1n : -1n, factorialFrac(k)) : ZERO);
    }
    return composeSeries(coefficients, u);
  },
  cos: (u) => {
    requireVanishing(u, "cos");
    const coefficients = [];
    for (let k = 0; k <= u.order; k += 1) {
      coefficients.push(k % 2 === 0 ? frac(k % 4 === 0 ? 1n : -1n, factorialFrac(k)) : ZERO);
    }
    return composeSeries(coefficients, u);
  },
  sinh: (u) => {
    requireVanishing(u, "sinh");
    const coefficients = [];
    for (let k = 0; k <= u.order; k += 1) coefficients.push(k % 2 === 1 ? frac(1n, factorialFrac(k)) : ZERO);
    return composeSeries(coefficients, u);
  },
  cosh: (u) => {
    requireVanishing(u, "cosh");
    const coefficients = [];
    for (let k = 0; k <= u.order; k += 1) coefficients.push(k % 2 === 0 ? frac(1n, factorialFrac(k)) : ZERO);
    return composeSeries(coefficients, u);
  },
  tan: (u) => sDiv(FUNCTIONS.sin(u), FUNCTIONS.cos(u)),
  tanh: (u) => sDiv(FUNCTIONS.sinh(u), FUNCTIONS.cosh(u)),
  atan: (u) => {
    requireVanishing(u, "atan");
    const coefficients = [];
    for (let k = 0; k <= u.order; k += 1) {
      coefficients.push(k % 2 === 1 ? frac(k % 4 === 1 ? 1n : -1n, BigInt(k)) : ZERO);
    }
    return composeSeries(coefficients, u);
  },
  asin: (u) => {
    requireVanishing(u, "asin");
    // arcsin 級數：c_{2k+1} = (2k)! / (4^k (k!)^2 (2k+1))
    const coefficients = [];
    for (let k = 0; k <= u.order; k += 1) {
      if (k % 2 === 0) { coefficients.push(ZERO); continue; }
      const m = (k - 1) / 2;
      coefficients.push(frac(factorialFrac(2 * m), (4n ** BigInt(m)) * factorialFrac(m) ** 2n * BigInt(k)));
    }
    return composeSeries(coefficients, u);
  },
  log: (u) => {
    // log(u)：u(0) 必須是 1（log(1+w) 型），否則 log(c0) 是無理數
    if (!fEq(u.c[0], ONE)) throw new Error("log 的引數在 0 不是 1 → log(c0) 是無理數");
    const w = sSub(u, constant(ONE, u.order));
    const coefficients = [ZERO];
    for (let k = 1; k <= u.order; k += 1) coefficients.push(frac(k % 2 === 1 ? 1n : -1n, BigInt(k)));
    return composeSeries(coefficients, w);
  },
  sqrt: (u) => {
    // √u：u(0)=1 走二項級數；u(0) 是完全平方的分數也可以（提出 √c0）
    if (!fEq(u.c[0], ONE)) throw new Error("sqrt 的引數在 0 不是 1 → √c0 可能是無理數");
    const w = sSub(u, constant(ONE, u.order));
    // binom(1/2, k) 遞推：b0=1, b_{k} = b_{k-1} * (1/2 - (k-1)) / k
    const coefficients = [ONE];
    let current = ONE;
    for (let k = 1; k <= u.order; k += 1) {
      current = fMul(current, fDiv(fSub(frac(1n, 2n), frac(BigInt(k - 1))), frac(BigInt(k))));
      coefficients.push(current);
    }
    return composeSeries(coefficients, w);
  }
};

/* ── 解析 latex.toJs 的輸出 ───────────────────────────────── */

function tokenizeJs(source) {
  const tokens = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (ch === " ") { i += 1; continue; }
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < source.length && /[0-9.]/.test(source[j])) j += 1;
      tokens.push({ t: "num", v: source.slice(i, j) });
      i = j;
      continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < source.length && /[A-Za-z0-9_$.]/.test(source[j])) j += 1;
      tokens.push({ t: "name", v: source.slice(i, j) });
      i = j;
      continue;
    }
    if ("+-*/(),".includes(ch)) { tokens.push({ t: ch }); i += 1; continue; }
    throw new Error(`不認得的字元 ${ch}`);
  }
  return tokens;
}

function parseToSeries(source, order) {
  const tokens = tokenizeJs(source);
  let position = 0;
  const peek = () => tokens[position];
  const eat = (type) => {
    const token = tokens[position];
    if (!token || token.t !== type) throw new Error(`預期 ${type}，看到 ${token ? token.t : "結尾"}`);
    position += 1;
    return token;
  };

  function parseExpression() {
    let left = parseTerm();
    for (;;) {
      const token = peek();
      if (token && token.t === "+") { position += 1; left = sAdd(left, parseTerm()); }
      else if (token && token.t === "-") { position += 1; left = sSub(left, parseTerm()); }
      else return left;
    }
  }
  function parseTerm() {
    let left = parseUnary();
    for (;;) {
      const token = peek();
      if (token && token.t === "*") { position += 1; left = sMul(left, parseUnary()); }
      else if (token && token.t === "/") { position += 1; left = sDiv(left, parseUnary()); }
      else return left;
    }
  }
  function parseUnary() {
    const token = peek();
    if (token && token.t === "-") { position += 1; return sNeg(parseUnary()); }
    if (token && token.t === "+") { position += 1; return parseUnary(); }
    return parseAtom();
  }
  function parseAtom() {
    const token = peek();
    if (!token) throw new Error("式子突然結束");
    if (token.t === "(") {
      position += 1;
      const inner = parseExpression();
      eat(")");
      return inner;
    }
    if (token.t === "num") {
      position += 1;
      const value = fracFromDecimal(token.v);
      if (!value) throw new Error(`讀不懂數字 ${token.v}`);
      return constant(value, order);
    }
    if (token.t === "name") {
      position += 1;
      const name = token.v;
      if (name === "x") return variable(order);
      if (name === "Math.pow") {
        eat("(");
        // 底數可能是 E（自然指數）或一般級數；指數必須是整數常數
        const baseToken = peek();
        let base = null;
        let baseIsE = false;
        if (baseToken && baseToken.t === "name" && baseToken.v === "E") { baseIsE = true; position += 1; }
        else base = parseExpression();
        eat(",");
        const exponent = parseExpression();
        eat(")");
        if (baseIsE) return FUNCTIONS.exp(exponent);
        // 指數要是常數整數
        for (let k = 1; k <= order; k += 1) {
          if (!fIsZero(exponent.c[k])) throw new Error("指數不是常數");
        }
        const e0 = exponent.c[0];
        if (e0.d !== 1n) {
          // 半整數次方：u^{p/2} = sqrt(u)^p（sqrt 會自己檢查 u(0)=1）
          if (e0.d === 2n) return sPowInt(FUNCTIONS.sqrt(base), Number(e0.n));
          throw new Error("指數不是整數也不是半整數");
        }
        return sPowInt(base, Number(e0.n));
      }
      if (FUNCTIONS[name]) {
        eat("(");
        const argument = parseExpression();
        eat(")");
        return FUNCTIONS[name](argument);
      }
      if (name === "E" || name === "PI") throw new Error(`常數 ${name} 是無理數`);
      throw new Error(`不認得的名字 ${name}`);
    }
    throw new Error(`不認得的 token ${token.t}`);
  }

  const result = parseExpression();
  if (position !== tokens.length) throw new Error("式子後面還有沒解析完的東西");
  return result;
}

// 主入口：jsSource 是 latex.toJs 的輸出（單變數 x）。
// 回傳前 order+1 個泰勒係數（分數陣列），解析不了／會出無理數就回 null。
// margin：sDiv 消前導零會讓尾端 shift 個係數失真 —— 多算幾階再截。
function taylorCoefficients(jsSource, order, margin = 8) {
  try {
    const series = parseToSeries(jsSource, order + margin);
    return series.c.slice(0, order + 1);
  } catch (_error) {
    return null;
  }
}

// f^{(n)}(0) = n! · a_n，回 {exact: Fraction, value: Number}；算不了回 null
function derivativeAtZero(jsSource, n) {
  const coefficients = taylorCoefficients(jsSource, n);
  if (!coefficients) return null;
  const exact = fMul(coefficients[n], frac(factorialFrac(n)));
  return { exact, value: fToNumber(exact) };
}

// 答案字串是 "整數" 或 "a/b" 時可以精確比對；其他形狀回 null
function parseExactAnswer(text) {
  const trimmed = String(text || "").trim();
  const integer = trimmed.match(/^(-?\d+)$/);
  if (integer) return frac(BigInt(integer[1]));
  const ratio = trimmed.match(/^(-?\d+)\s*\/\s*(\d+)$/);
  if (ratio) return frac(BigInt(ratio[1]), BigInt(ratio[2]));
  return null;
}

module.exports = { taylorCoefficients, derivativeAtZero, parseExactAnswer, frac, fEq, fToNumber };
