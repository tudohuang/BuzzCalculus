// 逐步解答的「步驟宣稱」求值器。
//
// src/problem_solution_steps.js 的每一步可以帶一條驗算宣稱，例如
//   ["外層 ln u 給 1/u、內層給 2x", "D(ln(1+x^2)) == 2x/(1+x^2)"]
// 這支把宣稱在幾個取樣點上算出來，看左右兩邊是不是真的相等。
//
// 記法跟答案欄一樣（app.js 的 normalizeExpression：3x^2、sqrt(x)、ln(x)、e^x、pi），
// 另外多幾個運算子，全部是數值算的、跟解題無關：
//   D(f)            對 f 的變數微分，在目前的取樣點取值；D(f, a) 在 a 點取值；D(f, , y) 指定對 y 偏微分
//   D2(f) / D2(f,a) 二階導數
//   INT(f, a, b)    ∫_a^b f；第四個參數可指定積分變數（預設 x，或 f 唯一的自由變數）
//   LIM(f, a)       極限；a 可以是 inf、-inf、0+、2- 這種單側寫法
//   SUM(f, n0)      Σ_{n=n0}^∞ f（預設變數 n，或 f 唯一的自由變數）
//   SUB(f, a)       把 f 的變數代成 a
//   ANS             題目答案（跟判分器讀到的是同一個式子）
// 宣稱可以是 A == B（相等）、A ~= B（差一個常數，不定積分用）、A < B、A > B；
// 一步可以有好幾條，用 ;; 分開。
//
// 設計原則跟 verify_engine 一樣：談不攏就回報「算不出來」，不硬給結論。
// 驗證器把「算不出來」當成失敗 —— 寫不出能驗的宣稱，就換一個寫法。

"use strict";

const latex = require("./latex.js");
const numeric = require("./numeric.js");

const OPS = ["D2", "D", "INT", "LIM", "SUM", "SUB"];
const ALLOWED_VARIABLES = new Set(["x", "y", "z", "t", "n", "k", "u", "v", "r"]);
const PLACEHOLDERS =["Q", "W", "Y", "Z", "J", "K", "U", "V", "G", "H", "M", "R", "S", "T", "B", "F"];

// 各自由變數的取樣點：刻意避開整數、0、π 的倍數這種會踩到特殊值的位置
const SAMPLES = {
  default: [0.3137, 0.7219, 1.1743, 1.6181, 2.2913, 2.8571],
  n: [3, 4, 6, 9, 13],
  k: [3, 4, 6, 9, 13]
};

function splitTopLevel(text, separator) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "(" || ch === "[") depth += 1;
    if (ch === ")" || ch === "]") depth -= 1;
    if (depth === 0 && text.startsWith(separator, i)) {
      parts.push(current);
      current = "";
      i += separator.length - 1;
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts.map((part) => part.trim());
}

function parsePoint(text) {
  const raw = String(text).trim();
  const oneSided = /^(.*?)([+-])$/.exec(raw);
  if (/^-?inf(inity)?$/.test(raw)) return { value: raw.startsWith("-") ? -Infinity : Infinity, side: null };
  if (oneSided && oneSided[1] && !/[+\-*/^(]$/.test(oneSided[1])) {
    return { expr: oneSided[1], side: oneSided[2] };
  }
  return { expr: raw, side: null };
}

// 把一條式子編譯成 env => number。env 是 { x: 1.2, n: 4, … }。
function makeCompiler(normalize, answerExpr, extraVariables) {
  const allowed = new Set([...ALLOWED_VARIABLES, ...(extraVariables || [])]);
  function compileExpr(source) {
    let text = String(source).trim();
    const slots = [];
    // 由左往右把運算子呼叫抽出來，換成單一大寫字母的佔位符
    let out = "";
    let i = 0;
    while (i < text.length) {
      const rest = text.slice(i);
      const opMatch = /^(D2|D|INT|LIM|SUM|SUB)\(/.exec(rest);
      const prev = i > 0 ? text[i - 1] : "";
      if (opMatch && !/[A-Za-z0-9_]/.test(prev)) {
        const name = opMatch[1];
        let depth = 0;
        let j = i + name.length;
        for (; j < text.length; j += 1) {
          if (text[j] === "(") depth += 1;
          if (text[j] === ")") {
            depth -= 1;
            if (depth === 0) break;
          }
        }
        if (depth !== 0) throw new Error(`${name}( 沒有收尾`);
        const inner = text.slice(i + name.length + 1, j);
        const args = splitTopLevel(inner, ",");
        if (slots.length >= PLACEHOLDERS.length) throw new Error("一條宣稱裡的運算子太多");
        const holder = PLACEHOLDERS[slots.length];
        slots.push({ holder, fn: compileOperator(name, args) });
        out += `(${holder})`;
        i = j + 1;
        continue;
      }
      if (/^ANS(?![A-Za-z0-9_])/.test(rest) && !/[A-Za-z0-9_]/.test(prev)) {
        if (!answerExpr) throw new Error("這題沒有可以代入的 ANS");
        const holder = PLACEHOLDERS[slots.length];
        const answerFn = compileExpr(answerExpr);
        slots.push({ holder, fn: answerFn });
        out += `(${holder})`;
        i += 3;
        continue;
      }
      out += text[i];
      i += 1;
    }
    const js = normalize(out);
    if (!js) throw new Error(`判分器的記法讀不懂：${out}`);
    const holders = slots.map((slot) => slot.holder);
    const free = latex.freeVariables(js).filter((name) => !holders.includes(name));
    // 判分器的記法會把不認得的字拆成一串乘法：gamma(n) → g*a*m*m*a*(n)、x sin x → x*s*i*n*x。
    // 那些字母會變成「自由變數」被取樣，宣稱多半會失敗，但失敗訊息完全不指向原因 ——
    // 而萬一剛好成立就是安靜的錯。所以變數名單是白名單。
    const stray = free.filter((name) => !allowed.has(name));
    if (stray.length) {
      throw new Error(`不認得的名字 ${stray.join(", ")}（函數要加括號、不支援的函數會被拆成字母相乘）：${out}`);
    }
    const compiled = latex.compileJs(js, [...holders, ...free]);
    const evaluate = (env) => {
      const holderValues = slots.map((slot) => slot.fn(env));
      const freeValues = free.map((name) => {
        if (!(name in env)) throw new Error(`變數 ${name} 沒有值`);
        return env[name];
      });
      return compiled(...holderValues, ...freeValues);
    };
    // 自由變數要把子運算式的也算進來（D(x^2) 的外層看不到 x）
    const nested = new Set(free);
    slots.forEach((slot) => (slot.fn.free || []).forEach((name) => nested.add(name)));
    evaluate.free = [...nested];
    return evaluate;
  }

  function pickVariable(fn, explicit, fallback) {
    if (explicit) return explicit.trim();
    const free = fn.free || [];
    if (free.includes(fallback)) return fallback;
    if (free.length === 1) return free[0];
    if (!free.length) return fallback;
    throw new Error(`分不出對哪個變數運算（${free.join(", ")}），請在最後一個參數寫明`);
  }

  function withVar(env, name, value) {
    return { ...env, [name]: value };
  }

  function compileOperator(name, args) {
    const body = compileExpr(args[0]);
    let result;
    if (name === "D" || name === "D2") {
      const at = args[1] && args[1].trim() ? compileExpr(args[1]) : null;
      const variable = pickVariable(body, args[2], "x");
      const order = name === "D2" ? 2 : 1;
      result = (env) => {
        const point = at ? at(env) : env[variable];
        if (!Number.isFinite(point)) return Number.NaN;
        const d = numeric.derivative((v) => body(withVar(env, variable, v)), point, { order });
        return d.value;
      };
      result.free = at ? (body.free || []).filter((v) => v !== variable).concat(at.free || []) : body.free;
    } else if (name === "INT") {
      if (args.length < 3) throw new Error("INT 要三個參數：INT(f, a, b)");
      const variable = pickVariable(body, args[3], "x");
      const endpoint = (text) => {
        const point = parsePoint(text);
        if (point.expr === undefined) return () => point.value;
        return compileExpr(point.expr);
      };
      const a = endpoint(args[1]);
      const b = endpoint(args[2]);
      result = (env) => {
        const lo = a(env);
        const hi = b(env);
        const r = numeric.integrate((v) => body(withVar(env, variable, v)), lo, hi);
        return r.value;
      };
      result.free = (body.free || []).filter((v) => v !== variable).concat(a.free || [], b.free || []);
    } else if (name === "LIM") {
      if (args.length < 2) throw new Error("LIM 要兩個參數：LIM(f, a)");
      const variable = pickVariable(body, args[2], "x");
      const point = parsePoint(args[1]);
      const target = point.expr === undefined ? () => point.value : compileExpr(point.expr);
      result = (env) => {
        const f = (v) => body(withVar(env, variable, v));
        const at = target(env);
        const r = numeric.limit(f, at, point.side ? { side: point.side } : {});
        if (Number.isFinite(r.value) || Number.isFinite(at)) return r.value;
        // x→±∞ 的後援：numeric.limit 對某些有理式會說「取樣序列一開始就不穩定」。
        // 沿 10⁴…10⁸ 取值，要求相鄰差距每一階至少縮小三倍（真的在收斂），
        // 再做一次 1/x 型的 Richardson。收斂得太慢（log、1/√x）就老實回報算不出來。
        const sign = at > 0 ? 1 : -1;
        const values = [4, 5, 6, 7, 8].map((k) => f(sign * 10 ** k));
        if (!values.every(Number.isFinite)) return Number.NaN;
        const gaps = values.slice(1).map((v, i) => Math.abs(v - values[i]));
        for (let i = 1; i < gaps.length; i += 1) {
          if (gaps[i - 1] > 1e-12 * Math.max(1, Math.abs(values[i])) && gaps[i] * 3 > gaps[i - 1]) return Number.NaN;
        }
        const last = values[values.length - 1];
        return last + (last - values[values.length - 2]) / 9;
      };
      result.free = (body.free || []).filter((v) => v !== variable);
    } else if (name === "SUM") {
      if (args.length < 2) throw new Error("SUM 要兩個參數：SUM(f, n0)");
      const variable = pickVariable(body, args[2], "n");
      const from = compileExpr(args[1]);
      result = (env) => {
        const r = numeric.seriesSum((k) => body(withVar(env, variable, k)), from(env));
        return r.value;
      };
      result.free = (body.free || []).filter((v) => v !== variable);
    } else if (name === "SUB") {
      if (args.length < 2) throw new Error("SUB 要兩個參數：SUB(f, a)");
      const variable = pickVariable(body, args[2], "x");
      const at = compileExpr(args[1]);
      result = (env) => body(withVar(env, variable, at(env)));
      result.free = (body.free || []).filter((v) => v !== variable).concat(at.free || []);
    } else {
      throw new Error(`不認得的運算子 ${name}`);
    }
    return result;
  }

  return compileExpr;
}

function close(a, b, tolerance) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  return Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));
}

// 驗一條宣稱。回傳 { ok, reason, points }。
function checkClaim(claim, context) {
  const match = /^(.*?)\s*(==|~=|<=|>=|<|>)\s*(.*)$/.exec(claim);
  if (!match) return { ok: false, reason: `看不出比較符號：${claim}` };
  const [, lhsText, op, rhsText] = match;
  const compileExpr = makeCompiler(context.normalize, context.answer, context.variable ? [context.variable] : []);
  let lhs;
  let rhs;
  try {
    lhs = compileExpr(lhsText);
    rhs = compileExpr(rhsText);
  } catch (error) {
    return { ok: false, reason: `編譯失敗：${error.message}` };
  }
  const free = [...new Set([...(lhs.free || []), ...(rhs.free || [])])];
  const tolerance = context.tolerance || 1e-6;
  const envs = [];
  if (!free.length) {
    envs.push({});
  } else {
    const count = Math.max(...free.map((name) => (SAMPLES[name] || SAMPLES.default).length));
    for (let i = 0; i < count; i += 1) {
      const env = {};
      free.forEach((name, index) => {
        const list = context.samples && context.samples[name] ? context.samples[name] : SAMPLES[name] || SAMPLES.default;
        // 不同變數錯開取樣，避免 x=y 這種巧合讓錯的恆等式過關
        env[name] = list[(i + index * 2) % list.length];
      });
      envs.push(env);
    }
  }
  const pairs = [];
  for (const env of envs) {
    let a;
    let b;
    try {
      a = lhs(env);
      b = rhs(env);
    } catch (error) {
      return { ok: false, reason: `求值失敗：${error.message}` };
    }
    if (Number.isFinite(a) && Number.isFinite(b)) pairs.push({ env, a, b });
  }
  const needed = free.length ? 3 : 1;
  if (pairs.length < needed) {
    return { ok: false, reason: `可用的取樣點只有 ${pairs.length} 個（兩邊要在定義域內都算得出來）` };
  }
  const show = (p) => `${JSON.stringify(p.env)} 左=${p.a} 右=${p.b}`;
  if (op === "==") {
    const bad = pairs.find((p) => !close(p.a, p.b, tolerance));
    if (bad) return { ok: false, reason: `不相等：${show(bad)}` };
  } else if (op === "~=") {
    if (pairs.length < 2) return { ok: false, reason: "差一個常數要至少兩個取樣點" };
    const offset = pairs[0].a - pairs[0].b;
    const bad = pairs.find((p) => !close(p.a - p.b, offset, tolerance));
    if (bad) return { ok: false, reason: `差值不是常數：${show(pairs[0])}；${show(bad)}` };
  } else {
    const test = { "<": (a, b) => a < b, ">": (a, b) => a > b, "<=": (a, b) => a <= b + 1e-12, ">=": (a, b) => a >= b - 1e-12 }[op];
    const bad = pairs.find((p) => !test(p.a, p.b));
    if (bad) return { ok: false, reason: `不等式不成立：${show(bad)}` };
  }
  return { ok: true, points: pairs.length };
}

function claimsOf(check) {
  return splitTopLevel(String(check || ""), ";;").filter(Boolean);
}

module.exports = { checkClaim, claimsOf, makeCompiler, SAMPLES };
