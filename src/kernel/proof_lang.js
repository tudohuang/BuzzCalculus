// 白話證明：一行一句、可以被檢查的證明語言。
//
// 站上不能有後端，Lean 只能在 CI 裡跑；但「這一步有沒有跳」這件事，
// 瀏覽器裡其實做得到三分之二 —— 只要老實分清楚哪三分之二：
//   1. 句型引擎   認得這句話在做什麼（設變數、假設、代數推導、引用定理、分情況、歸納、下結論）
//   2. 代數引擎   A = B ≤ C < D 這種鏈，在目前的假設下隨機取點驗（等式看差、不等式看方向）
//   3. 推論引擎   一小本規則字典（MVT、三角不等式、夾擠…），比對「你寫的句子」跟「規則會吐出的形狀」
// 剩下的三分之一（存在句、抽象函數 f、數論）標黃 —— 看得懂但驗不了，不假裝。
//
// 這是 kernel 模組：純函式、不碰 DOM、不碰儲存。
//   parse(text)                 → 逐行的句型判定
//   check(spec, text, options)  → 逐行三色報告 + 骨架檢查 + 總結
// 行為由 tools/validate_proof_lang.js 釘住：每題的參考證明必須全綠，
// 故意刪一行／改一個符號的版本必須紅在正確的那一行。

(function () {
  "use strict";

  /* ── 正規化：中文標點、全形、數學符號 ─────────────────────── */
  const CHAR_MAP = {
    "，": ",", "。": "", "：": ":", "；": ";", "（": "(", "）": ")", "「": "", "」": "", "『": "", "』": "",
    "≤": "<=", "≦": "<=", "≥": ">=", "≧": ">=", "≠": "!=", "−": "-", "–": "-", "—": "-", "×": "*", "·": "*", "⋅": "*", "÷": "/",
    "∈": " in ", "∞": "inf", "√": "sqrt", "π": "pi", "ε": "eps", "δ": "delta", "→": "->", "⇒": "=>", "∀": "forall ", "∃": "exists ",
    "…": "...", "²": "^2", "³": "^3", "⁴": "^4", "⁵": "^5", "⁶": "^6", "ⁿ": "^n", "＝": "=", "＜": "<", "＞": ">", "＋": "+", "－": "-", "／": "/", "　": " ", "′": "'", "’": "'",
    "ξ": "xi", "η": "eta", "θ": "theta", "λ": "lambda", "μ": "mu", "α": "alpha", "β": "beta", "γ": "gamma"
  };

  // v2.5 積分與和：上下標數字（₀¹）、∑、∫ 都要先變成引擎認得的字
  const SUB_DIGITS = { "₀": "_0", "₁": "_1", "₂": "_2", "₃": "_3", "₄": "_4", "₅": "_5", "₆": "_6", "₇": "_7", "₈": "_8", "₉": "_9", "⁰": "^0", "¹": "^1", "⁷": "^7", "⁸": "^8", "⁹": "^9", "∑": "Σ" };

  function normalize(text) {
    let out = String(text || "");
    out = out.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xff10 + 48));
    out = out.replace(/[Ａ-Ｚａ-ｚ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xff21 + 65 + (ch.charCodeAt(0) >= 0xff41 ? 32 : 0)));
    out = out.replace(/[，。：；（）「」『』≤≦≥≧≠−–—×·⋅÷∈∞√πεδ→⇒∀∃…²³⁴⁵⁶ⁿ＝＜＞＋－／　′’ξηθλμαβγ]/g, (ch) => CHAR_MAP[ch]);
    out = out.replace(/[₀₁₂₃₄₅₆₇₈₉⁰¹⁷⁸⁹∑]/g, (ch) => SUB_DIGITS[ch]);
    out = out.replace(/\\(epsilon|varepsilon)/g, "eps").replace(/\\delta/g, "delta").replace(/\\(le|leq)\b/g, "<=").replace(/\\(ge|geq)\b/g, ">=");
    out = out.replace(/\\(cdot|times)\b/g, "*").replace(/\\(sqrt|pi|sin|cos|tan|log|ln|exp|lim|to|infty)\b/g, "$1");
    // \int_0 的 _ 是 word 字元，\b 在那裡不成立：用「後面不是字母」
    out = out.replace(/\\int(?![A-Za-z])/g, "∫").replace(/\\sum(?![A-Za-z])/g, "Σ").replace(/\\[,;!]/g, " ");
    out = out.replace(/\bepsilon\b/g, "eps").replace(/\binfty\b/g, "inf");
    out = rewriteIntegrals(out);
    return out.replace(/\s+/g, " ").trim();
  }

  /* ── v2.5 積分與和的寫法 → int(x, a, b, body)、sum(k, a, b, body) ──────
     ∫₀¹ x^p dx、∫_0^{inf} e^(-x) dx、∫_a^b f(t) dt：從最右邊的 ∫ 開始改（雙重積分裡面的先），
     上下限接受 _0、_{0}、_(0)、^inf、^{pi}；本體到「d<變數>」為止。
     Σ_{k=1}^{n} k(k+1)：本體到深度 0 的 + − 或關係符號或字串尾為止。沒有上下限的積分改成 intindef(…)，之後編譯會說算不了。 */
  function readLimit(text, at) {
    // 回傳 [內容, 結束位置]；at 指在 _ 或 ^ 之後
    if (text[at] === "{" || text[at] === "(") {
      const close = text[at] === "{" ? "}" : ")";
      let depth = 0;
      for (let i = at; i < text.length; i += 1) {
        if (text[i] === text[at]) depth += 1;
        else if (text[i] === close) { depth -= 1; if (depth === 0) return [text.slice(at + 1, i).trim(), i + 1]; }
      }
      return [text.slice(at + 1).trim(), text.length];
    }
    // 光溜溜的上下限：一個數字或一個名字（1、inf、pi、a）；「^1int(」要停在 1 之後
    const m = text.slice(at).match(/^-?(?:\d+(?:\.\d+)?|[A-Za-z_]\w*)/);
    return m ? [m[0], at + m[0].length] : ["", at];
  }
  function rewriteIntegrals(text) {
    let out = text;
    for (let guard = 0; guard < 12; guard += 1) {
      const at = out.lastIndexOf("∫");
      if (at < 0) break;
      let i = at + 1;
      let lo = null; let hi = null;
      for (let k = 0; k < 2; k += 1) {
        while (out[i] === " ") i += 1;
        if (out[i] === "_") { const [v, next] = readLimit(out, i + 1); lo = v; i = next; }
        else if (out[i] === "^") { const [v, next] = readLimit(out, i + 1); hi = v; i = next; }
      }
      const rest = out.slice(i);
      // 本體到 d<變數> 為止（dx、dt、d x）；delta 這種不算
      const end = rest.match(/\s*\bd\s?([a-z])(?![a-z0-9(])/i);
      if (!end) { out = out.slice(0, at) + "intbroken" + rest; continue; }
      const body = rest.slice(0, end.index).trim();
      const variable = end[1];
      const after = rest.slice(end.index + end[0].length);
      const call = lo !== null && hi !== null ? `int(${variable}, ${lo}, ${hi}, ${body})` : `intindef(${variable}, ${body})`;
      out = out.slice(0, at) + call + after;
    }
    for (let guard = 0; guard < 12; guard += 1) {
      const at = out.lastIndexOf("Σ");
      if (at < 0) break;
      let i = at + 1;
      let lo = null; let hi = null;
      for (let k = 0; k < 2; k += 1) {
        while (out[i] === " ") i += 1;
        if (out[i] === "_") { const [v, next] = readLimit(out, i + 1); lo = v; i = next; }
        else if (out[i] === "^") { const [v, next] = readLimit(out, i + 1); hi = v; i = next; }
      }
      const rest = out.slice(i);
      // 本體：到深度 0 的 + − 、關係符號、右括號或字尾
      let depth = 0; let stop = rest.length;
      for (let j = 0; j < rest.length; j += 1) {
        const ch = rest[j];
        if (ch === "(") depth += 1;
        else if (ch === ")") { if (depth === 0) { stop = j; break; } depth -= 1; }
        else if (depth === 0 && j > 0 && /[+\-<>=!]/.test(ch) && !/[eE(]$/.test(rest.slice(0, j).trim())) { stop = j; break; }
      }
      const body = rest.slice(0, stop).trim();
      const after = rest.slice(stop);
      // 下限寫成 k=1：拆出變數與起點
      const start = lo !== null ? lo.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/) : null;
      const call = start && hi !== null ? `sum(${start[1]}, ${start[2].trim()}, ${hi}, ${body})` : `sumbroken(${body})`;
      out = out.slice(0, at) + call + after;
    }
    return out;
  }

  /* ── v2.5 數值積分：tanh–sinh（雙指數）；端點奇異（ln x、x^(−1/2)）也收斂，無窮區間換元 ── */
  function tanhSinh(f, a, b) {
    const c = (a + b) / 2; const d = (b - a) / 2;
    if (!(d > 0)) return d === 0 ? 0 : -tanhSinh(f, b, a);
    const half = Math.PI / 2;
    let h = 1; let sum = 0; let previous = NaN;
    const evalAt = (t) => {
      const u = half * Math.sinh(t);
      const x = c + d * Math.tanh(u);
      const w = d * half * Math.cosh(t) / (Math.cosh(u) * Math.cosh(u));
      if (!(w > 1e-300) || x <= a || x >= b) return 0;
      const y = f(x);
      return Number.isFinite(y) ? y * w : NaN;
    };
    // 第 0 層：t = 0, ±1, ±2, ±3；之後每層只補奇數倍的新點
    const base = [0];
    for (let k = 1; k <= 4; k += 1) base.push(k, -k);
    sum = base.reduce((acc, t) => acc + evalAt(t), 0);
    let total = sum * h;
    for (let level = 1; level <= 7; level += 1) {
      h /= 2;
      let add = 0;
      for (let t = h; t <= 4; t += 2 * h) add += evalAt(t) + evalAt(-t);
      sum += add;
      previous = total;
      total = sum * h;
      if (!Number.isFinite(total)) return NaN;
      if (level >= 3 && Math.abs(total - previous) <= 1e-11 * (1 + Math.abs(total))) break;
    }
    return total;
  }
  function integrate(f, a, b) {
    if (!Number.isFinite(a) && !Number.isFinite(b)) {
      if (a === b) return 0;
      const sign = a < b ? 1 : -1;
      return sign * tanhSinh((t) => { const x = t / (1 - t * t); return f(x) * (1 + t * t) / ((1 - t * t) * (1 - t * t)); }, -1, 1);
    }
    if (!Number.isFinite(b)) return (b > 0 ? 1 : -1) * tanhSinh((t) => f(a + t / (1 - t)) / ((1 - t) * (1 - t)), 0, 1);
    if (!Number.isFinite(a)) return -integrate(f, b, a);
    return tanhSinh(f, a, b);
  }
  function summate(f, lo, hi) {
    const from = Math.round(lo); const to = Math.round(hi);
    if (!Number.isFinite(from) || !Number.isFinite(to)) return NaN;
    if (to - from > 100000) return NaN;
    let total = 0;
    for (let k = from; k <= to; k += 1) total += f(k);
    return total;
  }
  // int(x, a, b, body) 或 int(body, x, a, b)：從字串裡切出四個參數（括號配對），回傳 { variable, lo, hi, body }
  function splitCallArgs(text) {
    const args = []; let depth = 0; let current = "";
    for (const ch of text) {
      if (ch === "(") depth += 1;
      if (ch === ")") depth -= 1;
      if (ch === "," && depth === 0) { args.push(current.trim()); current = ""; continue; }
      current += ch;
    }
    args.push(current.trim());
    return args;
  }
  function extractQuadratures(text) {
    // 回傳 { text: 換成 zzq0… 的字串, items: [{ kind, variable, lo, hi, body }] }
    const items = [];
    let out = text;
    for (let guard = 0; guard < 20; guard += 1) {
      const m = out.match(/\b(int|sum)\(/);
      if (!m) break;
      const open = m.index + m[0].length - 1;
      let depth = 0; let close = -1;
      for (let i = open; i < out.length; i += 1) {
        if (out[i] === "(") depth += 1;
        else if (out[i] === ")") { depth -= 1; if (depth === 0) { close = i; break; } }
      }
      if (close < 0) throw new Error("積分的括號沒有關");
      const args = splitCallArgs(out.slice(open + 1, close));
      if (args.length !== 4) throw new Error(`${m[1] === "int" ? "積分" : "和"}要寫成 ${m[1]}(變數, 下限, 上限, 本體) 四個部分`);
      const varFirst = /^[A-Za-z_]\w*$/.test(args[0]);
      const item = varFirst ? { kind: m[1], variable: args[0], lo: args[1], hi: args[2], body: args[3] } : { kind: m[1], variable: args[1], lo: args[2], hi: args[3], body: args[0] };
      if (!/^[A-Za-z_]\w*$/.test(item.variable)) throw new Error(`${m[1] === "int" ? "積分" : "和"}變數「${item.variable}」不是一個名字`);
      items.push(item);
      out = out.slice(0, m.index) + `zzq${items.length - 1}` + out.slice(close + 1);
    }
    return { text: out, items };
  }

  const compact = (text) => normalize(text).replace(/\s+/g, "").toLowerCase();

  /* ── 表達式：tokenizer + 求值 ────────────────────────────────── */
  const MATH_FUNCTIONS = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan,
    sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh, exp: Math.exp, log: Math.log, ln: Math.log,
    sqrt: Math.sqrt, abs: Math.abs, floor: Math.floor, ceil: Math.ceil, max: Math.max, min: Math.min,
    sec: (x) => 1 / Math.cos(x), csc: (x) => 1 / Math.sin(x), cot: (x) => 1 / Math.tan(x)
  };
  const CONSTANTS = { pi: Math.PI, e: Math.E, inf: Infinity };

  // |...| → abs(...)：只處理不巢狀的絕對值（證明裡九成九是這種）
  function replaceBars(text) {
    let out = text;
    for (let round = 0; round < 8; round += 1) {
      const next = out.replace(/\|([^|]+)\|/, (whole, inner) => `abs(${inner})`);
      if (next === out) break;
      out = next;
    }
    return out;
  }

  function tokenize(text) {
    const tokens = [];
    let i = 0;
    const src = replaceBars(text).replace(/\s+/g, "");
    while (i < src.length) {
      const ch = src[i];
      if (/[0-9.]/.test(ch)) {
        let j = i;
        while (j < src.length && /[0-9.]/.test(src[j])) j += 1;
        tokens.push({ type: "num", value: src.slice(i, j) });
        i = j;
        continue;
      }
      if (/[A-Za-z_]/.test(ch)) {
        let j = i;
        while (j < src.length && /[A-Za-z0-9_']/.test(src[j])) j += 1;
        tokens.push({ type: "id", value: src.slice(i, j) });
        i = j;
        continue;
      }
      if (src.startsWith("**", i)) { tokens.push({ type: "op", value: "^" }); i += 2; continue; }
      if ("+-*/^(),".includes(ch)) { tokens.push({ type: "op", value: ch }); i += 1; continue; }
      throw new Error(`看不懂的符號「${ch}」`);
    }
    return tokens;
  }

  // 隱式乘法：3x、2(x+1)、k(k+1)、(a)(b)、x y 之間補 *。
  // 函數名後面接括號才是呼叫（sin(x)、S(k)）；其他識別字接括號一律是乘法。
  function insertImplicitMultiplication(tokens, isFunction) {
    const out = [];
    for (let i = 0; i < tokens.length; i += 1) {
      const token = tokens[i];
      const previous = out[out.length - 1];
      if (previous) {
        const prevIsValue = previous.type === "num" || (previous.type === "id" && !isFunction(previous.value)) || (previous.type === "op" && previous.value === ")");
        const startsValue = token.type === "num" || token.type === "id" || (token.type === "op" && token.value === "(");
        const prevIsFunctionName = previous.type === "id" && isFunction(previous.value) && token.type === "op" && token.value === "(";
        if (prevIsValue && startsValue && !prevIsFunctionName) out.push({ type: "op", value: "*" });
      }
      out.push(token);
    }
    return out;
  }

  // 遞迴下降：expr := term (('+'|'-') term)* ；term := unary (('*'|'/') unary)* ；unary := '-' unary | power ；power := atom ('^' unary)?
  // 黏在一起的識別字：kh、nh、xsin、sqrta、ab。
  // 使用者手寫 2kh 很自然，但 tokenizer 看到的是一個叫 kh 的東西。
  // 不認得的識別字先試著切成「認得的名字」的串（最長優先），切得開就是乘積；切不開就照原樣（之後報未知符號）。
  function splitIdentifier(name, known) {
    if (known(name)) return [name];
    const parts = [];
    let i = 0;
    while (i < name.length) {
      let matched = "";
      for (let j = name.length; j > i; j -= 1) {
        const piece = name.slice(i, j);
        if (known(piece)) { matched = piece; break; }
      }
      if (!matched) return null;
      parts.push(matched);
      i += matched.length;
    }
    return parts;
  }

  function compile(source, outerScope) {
    if (/\bintindef\(/.test(source)) throw new Error("這個積分沒有上下限（不定積分算不了）：請寫成 ∫_a^b … dx 的定積分");
    if (/\bintbroken\b|\bsumbroken\(/.test(source)) throw new Error("積分或和的寫法讀不出來：∫ 要寫成「∫_a^b 本體 dx」、Σ 要寫成「Σ_{k=1}^{n} 本體」");
    // v2.5：積分與和先切出來，各自編譯（本體多一個積分變數），主式子裡用 zzq0… 代替；求值時先算它們
    const quadratures = extractQuadratures(source);
    const text = quadratures.text;
    const scope = quadratures.items.length
      ? { vars: new Set([...(outerScope.vars || []), ...quadratures.items.map((_, i) => `zzq${i}`)]), functions: outerScope.functions }
      : outerScope;
    const compiled = quadratures.items.map((item) => {
      const inner = { vars: new Set([...(outerScope.vars || []), item.variable]), functions: outerScope.functions };
      return { kind: item.kind, variable: item.variable, lo: compile(item.lo, outerScope), hi: compile(item.hi, outerScope), body: compile(item.body, inner) };
    });
    const isFunction = (name) => Boolean(MATH_FUNCTIONS[name] || (scope.functions && scope.functions[name]));
    const known = (name) => isFunction(name) || (scope.vars && scope.vars.has(name)) || CONSTANTS[name] !== undefined;
    const raw = tokenize(text).flatMap((token) => {
      if (token.type !== "id") return [token];
      const parts = splitIdentifier(token.value, known);
      return parts ? parts.map((value) => ({ type: "id", value })) : [token];
    });
    const tokens = insertImplicitMultiplication(raw, isFunction);
    let pos = 0;
    const peek = () => tokens[pos];
    const take = () => tokens[pos++];
    const expect = (value) => {
      const token = take();
      if (!token || token.value !== value) throw new Error(`少了「${value}」`);
    };
    function parseExpr() {
      let node = parseTerm();
      while (peek() && peek().type === "op" && (peek().value === "+" || peek().value === "-")) {
        const op = take().value;
        const right = parseTerm();
        const left = node;
        node = op === "+" ? (env) => left(env) + right(env) : (env) => left(env) - right(env);
      }
      return node;
    }
    function parseTerm() {
      let node = parseUnary();
      while (peek() && peek().type === "op" && (peek().value === "*" || peek().value === "/")) {
        const op = take().value;
        const right = parseUnary();
        const left = node;
        node = op === "*" ? (env) => left(env) * right(env) : (env) => left(env) / right(env);
      }
      return node;
    }
    function parseUnary() {
      if (peek() && peek().type === "op" && peek().value === "-") {
        take();
        const inner = parseUnary();
        return (env) => -inner(env);
      }
      if (peek() && peek().type === "op" && peek().value === "+") { take(); return parseUnary(); }
      return parsePower();
    }
    function parsePower() {
      const base = parseAtom();
      if (peek() && peek().type === "op" && peek().value === "^") {
        take();
        const exponent = parseUnary();
        return (env) => Math.pow(base(env), exponent(env));
      }
      return base;
    }
    function parseAtom() {
      const token = take();
      if (!token) throw new Error("式子沒寫完");
      if (token.type === "num") {
        const value = Number(token.value);
        if (!Number.isFinite(value)) throw new Error(`數字「${token.value}」讀不了`);
        return () => value;
      }
      if (token.type === "op" && token.value === "(") {
        const inner = parseExpr();
        expect(")");
        return inner;
      }
      if (token.type === "id") {
        const name = token.value;
        if (isFunction(name) && peek() && peek().value === "(") {
          take();
          const args = [];
          if (!(peek() && peek().value === ")")) {
            args.push(parseExpr());
            while (peek() && peek().value === ",") { take(); args.push(parseExpr()); }
          }
          expect(")");
          const fn = MATH_FUNCTIONS[name] || scope.functions[name];
          // 自訂函數的本體可以用到外面的參數（令 I(p) = ∫₀¹ (x^p − x^q)/ln x dx 裡的 q）：把 env 一起傳
          return fn.needsEnv ? (env) => fn(...args.map((arg) => arg(env)), env) : (env) => fn(...args.map((arg) => arg(env)));
        }
        if (isFunction(name) && peek() && (peek().type === "id" || peek().type === "num")) {
          // sqrt a、sin x：函數名後面直接接一個原子，當成 f(原子)
          const arg = parseAtom();
          const fn = MATH_FUNCTIONS[name] || scope.functions[name];
          return fn.needsEnv ? (env) => fn(arg(env), env) : (env) => fn(arg(env));
        }
        if (CONSTANTS[name] !== undefined && !(scope.vars && scope.vars.has(name))) return () => CONSTANTS[name];
        if (scope.vars && scope.vars.has(name)) return (env) => env[name];
        const error = new Error(`未知符號「${name}」`);
        error.unknownSymbol = name;
        throw error;
      }
      throw new Error(`「${token.value}」不該出現在這裡`);
    }
    const root = parseExpr();
    if (pos < tokens.length) throw new Error(`「${tokens[pos].value}」之後讀不下去`);
    if (!compiled.length) return root;
    return (env) => {
      const local = Object.assign({}, env);
      compiled.forEach((item, index) => {
        const lo = item.lo(local); const hi = item.hi(local);
        const f = (v) => item.body(Object.assign({}, local, { [item.variable]: v }));
        local[`zzq${index}`] = item.kind === "int" ? integrate(f, lo, hi) : summate(f, lo, hi);
      });
      return root(local);
    };
  }

  /* ── 關係鏈：A = B <= C ──────────────────────────────────────── */
  const RELATION = /(<=|>=|!=|<|>|=)/;

  function splitChain(text) {
    const parts = text.split(RELATION).map((part) => part.trim());
    if (parts.length < 3) return null;
    const exprs = [];
    const ops = [];
    for (let i = 0; i < parts.length; i += 1) {
      if (i % 2 === 0) exprs.push(parts[i]);
      else ops.push(parts[i]);
    }
    if (exprs.some((expr) => !expr)) return null;
    return { exprs, ops };
  }

  const RELATION_TEST = {
    "=": (a, b) => Math.abs(a - b) <= 1e-6 * (1 + Math.abs(a) + Math.abs(b)),
    "!=": (a, b) => Math.abs(a - b) > 1e-6 * (1 + Math.abs(a) + Math.abs(b)),
    "<": (a, b) => a < b - 1e-9 * (1 + Math.abs(b)),
    "<=": (a, b) => a <= b + 1e-9 * (1 + Math.abs(b)),
    ">": (a, b) => a > b + 1e-9 * (1 + Math.abs(a)),
    ">=": (a, b) => a >= b - 1e-9 * (1 + Math.abs(a))
  };
  const NEGATE = { "=": "!=", "!=": "=", "<": ">=", "<=": ">", ">": "<=", ">=": "<" };

  /* ── 取樣：在目前的假設下抽點 ───────────────────────────────── */
  function seeded(seed) {
    let state = seed >>> 0 || 1;
    return () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function makeScope(spec, ctx) {
    const vars = new Set([...Object.keys(spec.vars || {}), ...ctx.vars.keys(), ...Object.keys(ctx.defs), ...(ctx.atoms ? ctx.atoms.keys() : [])]);
    const functions = Object.assign({}, spec.functions || {});
    // 使用者自己「令 g(x) = x^5 + x − 1」的函數：本體只認參數與常數。
    // v2.4：g′、g″ 也算得出來——中央差分加 Richardson 外推（誤差 O(h⁴)），
    // 所以「則 g'(x) = e^x − 1」這種句子可以數值驗，不用符號微分。
    // 本體可以用到外面的參數（q、a），所以帶著呼叫當下的 env（needsEnv）
    Object.keys(ctx.userFunctions || {}).forEach((name) => {
      const entry = ctx.userFunctions[name];
      const g = (value, env) => entry.fn(Object.assign({}, env || {}, { [entry.param]: value }));
      functions[name] = Object.assign(g, { needsEnv: true });
      const first = (v, h, env) => (g(v + h, env) - g(v - h, env)) / (2 * h);
      const second = (v, h, env) => (g(v + h, env) - 2 * g(v, env) + g(v - h, env)) / (h * h);
      functions[`${name}'`] = Object.assign((v, env) => { const h = 1e-4 * Math.max(1, Math.abs(v)); return (4 * first(v, h / 2, env) - first(v, h, env)) / 3; }, { needsEnv: true });
      functions[`${name}''`] = Object.assign((v, env) => { const h = 1e-3 * Math.max(1, Math.abs(v)); return (4 * second(v, h / 2, env) - second(v, h, env)) / 3; }, { needsEnv: true });
    });
    return { vars, functions };
  }

  // 抽象函數：f(y)、f'(c) 這種驗不了的東西，變成「不透明的取樣變數」（atom）。
  // 同一個寫法永遠是同一個變數，所以「f(y) − f(x) = f'(c)(y − x)」登記成條件之後，
  // 後面的「f(y) − f(x) = 0」就能在同一批取樣點上驗。spec.abstract 說哪些名字是抽象的、值域多大
  // （f′ 恆為 0 的題就把 f′ 的值域設成 [0, 0]）。
  const ATOM_PREFIX = "at_";
  function atomize(spec, expr, ctx) {
    const abstract = spec.abstract || {};
    if (!ctx || !Object.keys(abstract).length) return expr;
    let out = expr;
    for (let round = 0; round < 6; round += 1) {
      const next = out.replace(/([A-Za-z]\w*'*)\(([^()]*)\)/g, (whole, name, arg) => {
        if (!abstract[name]) return whole;
        const key = ATOM_PREFIX + name.replace(/'/g, "p") + "_" + compact(arg)
          .replace(/\+/g, "plus").replace(/-/g, "minus").replace(/\*/g, "times").replace(/\//g, "over").replace(/\^/g, "pow").replace(/[^A-Za-z0-9]/g, "_");
        ctx.atoms = ctx.atoms || new Map();
        if (!ctx.atoms.has(key)) ctx.atoms.set(key, { display: `${name}(${arg.trim()})`, domain: abstract[name] || {} });
        return key;
      });
      if (next === out) break;
      out = next;
    }
    return out;
  }

  // 把 atom 的內部名字換回使用者寫的樣子（註解用）
  function pretty(ctx, text) {
    if (!ctx || !ctx.atoms || !ctx.atoms.size) return text;
    let out = String(text);
    [...ctx.atoms.keys()].sort((a, b) => b.length - a.length).forEach((key) => {
      out = out.split(key).join(ctx.atoms.get(key).display);
    });
    return out;
  }

  function drawSamples(spec, ctx, count) {
    const scope = makeScope(spec, ctx);
    const random = seeded(spec.seed || 20260913);
    const domains = {};
    [...scope.vars].forEach((name) => {
      const atom = ctx.atoms && ctx.atoms.get(name);
      const declared = (atom && atom.domain) || (spec.vars && spec.vars[name]) || ctx.vars.get(name) || {};
      domains[name] = {
        min: declared.min !== undefined ? declared.min : (name === "eps" || name === "delta" ? 0.05 : -3),
        max: declared.max !== undefined ? declared.max : (name === "eps" || name === "delta" ? 2 : 3),
        int: Boolean(declared.int)
      };
    });
    const defs = Object.keys(ctx.defs).map((name) => ({ name, fn: compile(ctx.defs[name], scope) }));
    const constraints = ctx.constraints.filter((item) => item.caseId === null || item.caseId === ctx.currentCase);
    // 編不出來的條件（含抽象符號）不擋取樣 —— 它們在登記時就已經標黃了
    const compiled = constraints.map((item) => {
      try { return { ...item, lhs: compile(item.lhs, scope), rhs: compile(item.rhs, scope) }; } catch (_error) { return null; }
    }).filter(Boolean);
    const accepted = [];
    let tries = 0;
    const maxTries = Math.max(4000, count * 40);
    while (accepted.length < count && tries < maxTries) {
      tries += 1;
      const env = {};
      let ok = true;
      [...scope.vars].forEach((name) => {
        if (ctx.defs[name] !== undefined) return;
        const domain = domains[name];
        let value = domain.min + (domain.max - domain.min) * random();
        if (domain.int) value = Math.round(value);
        env[name] = value;
      });
      // 定義可能互相引用、而且登記順序不一定是依賴順序（f(y) 先解出來、f'(c) 後來才 = 0）：
      // 多跑幾輪，直到每個定義都算得出有限值
      for (let pass = 0; pass < defs.length && ok; pass += 1) {
        let pending = false;
        for (const def of defs) {
          if (Number.isFinite(env[def.name])) continue;
          try { env[def.name] = def.fn(env); } catch (_error) { env[def.name] = NaN; }
          if (!Number.isFinite(env[def.name])) pending = true;
        }
        if (!pending) break;
        if (pass === defs.length - 1) ok = false;
      }
      if (!ok) continue;
      for (const item of compiled) {
        let a; let b;
        try { a = item.lhs(env); b = item.rhs(env); } catch (_error) { ok = false; break; }
        if (!Number.isFinite(a) || !Number.isFinite(b) || !RELATION_TEST[item.op](a, b)) { ok = false; break; }
      }
      if (ok) accepted.push(env);
    }
    return { samples: accepted, tries, scope };
  }

  /* ── 規則字典 ───────────────────────────────────────────────── */
  // 每條規則：名字（中英都收）＋ 它會吐出的句子形狀（正規化後的正規式）。
  // 形狀對上就綠；對不上但句子本身能數值驗，就走代數引擎；都不行標黃。
  const RULES = [
    { id: "triangle", names: ["三角不等式", "triangle inequality", "triangle"], shapes: [/abs\((.+)\+(.+)\)<=abs\(.+\)\+abs\(.+\)/] },
    { id: "mvt", names: ["平均值定理", "均值定理", "mvt", "mean value theorem", "lagrange"], shapes: [/(\w+)\((\w+)\)-\1\((\w+)\)=\1'\((\w+)\)\*?\((\w+)-(\w+)\)/, /(\w+)'\((\w+)\)=\(?\1\((\w+)\)-\1\((\w+)\)\)?\/\((\w+)-(\w+)\)/], requires: "differentiable" },
    // 泰勒（Lagrange 餘項）：f(a+h) = f(a) + h f'(a) + (h²/2) f''(ξ)。形狀只認「f(某點) = 含 f''(ξ) 的展開式」
    { id: "taylor", names: ["泰勒定理", "泰勒展開", "泰勒", "taylor", "taylor's theorem", "taylor expansion", "lagrange remainder"], shapes: [/(\w+)\((.+?)\)=.*\1''\((\w+)\)/], requires: "twice-differentiable" },
    { id: "rolle", names: ["Rolle 定理", "rolle", "rolle定理", "洛爾定理", "rolle theorem"], shapes: [/(\w+)'\((\w+)\)=0/], requires: "differentiable" },
    { id: "evt", names: ["極值定理", "extreme value theorem", "evt", "最大最小值定理"], shapes: [/(最大值|最小值|maximum|minimum|max|min)/], requires: "continuous" },
    { id: "fermat", names: ["費馬定理", "fermat", "fermat theorem", "內點極值"], shapes: [/(\w+)'\((\w+)\)=0/] },
    { id: "squeeze", names: ["夾擠定理", "夾擠", "squeeze", "sandwich", "squeeze theorem"], shapes: [/lim/], requires: "sandwich" },
    { id: "amgm", names: ["算幾不等式", "am-gm", "amgm", "算術幾何平均"], shapes: [/\(?(.+)\+(.+)\)?\/2>=sqrt\(/, />=2\*?sqrt\(/] },
    // 中間值定理要兩件事都在前面出現過：函數連續（文字事實）、兩端異號（驗過的 g(a) < 0、g(b) > 0）
    { id: "ivt", names: ["中間值定理", "介值定理", "ivt", "intermediate value theorem", "bolzano"], shapes: [/(\w+)\((\w+)\)=/], requires: "ivt" },
    { id: "derivative-def", names: ["導數定義", "定義", "definition of derivative", "by definition", "定義"], shapes: [/lim/] },
    { id: "hypothesis", names: ["假設", "歸納假設", "題意", "已知", "hypothesis", "inductive hypothesis", "assumption", "induction hypothesis"], shapes: [] },
    { id: "algebra", names: ["代數", "展開", "因式分解", "通分", "整理", "algebra", "expanding", "factoring", "simplifying", "計算"], shapes: [] },
    { id: "monotone", names: ["單調性", "monotonicity", "遞增", "遞減"], shapes: [] },
    { id: "continuity", names: ["連續性", "連續", "continuity", "continuous"], shapes: [] },
    { id: "bernoulli", names: ["白努利不等式", "bernoulli", "伯努利不等式"], shapes: [/\(1\+(.+)\)\^(\w+)>=1\+/] },
    { id: "cauchy", names: ["柯西不等式", "cauchy", "cauchy-schwarz"], shapes: [] },
    { id: "binomial", names: ["二項式定理", "binomial theorem", "二項展開"], shapes: [] },
    // v2.5 積分：對參數微分（式子本身數值驗：I′ 用數值微分、右邊的積分用數值積分）；
    // 微積分基本定理要前面先算出 I′；Frullani 與積分平均值定理對形狀
    { id: "leibniz", names: ["積分號下微分", "對參數微分", "在積分號下微分", "微分積分交換", "feynman", "feynman 積分法", "leibniz", "leibniz rule", "leibniz integral rule", "differentiation under the integral sign", "differentiating under the integral sign"], shapes: [/(\w+)'\((\w+)\)=int\(/] },
    { id: "ftc", names: ["微積分基本定理", "基本定理", "牛頓-萊布尼茲公式", "牛頓萊布尼茲", "newton-leibniz", "fundamental theorem of calculus", "ftc"], shapes: [/=.*int\(/], requires: "derivative" },
    { id: "frullani", names: ["frullani", "frullani 公式", "frullani 積分", "frullani's theorem"], shapes: [/int\(\w+,0,inf,/] },
    { id: "integral-mvt", names: ["積分平均值定理", "積分中值定理", "積分均值定理", "mean value theorem for integrals", "integral mean value theorem"], shapes: [/int\(.+\)=(\w+)\((\w+)\)\*?\(/], requires: "continuous" }
  ];

  function findRule(name) {
    const key = compact(name).replace(/(定理|theorem|the)$/g, "");
    return RULES.find((rule) => rule.names.some((alias) => {
      const aliasKey = compact(alias).replace(/(定理|theorem|the)$/g, "");
      return aliasKey === key || key.includes(aliasKey) || aliasKey.includes(key);
    })) || null;
  }

  // 規則的形狀比對用的鍵：正規化、去空白、|…| 換成 abs()
  const shapeKey = (text) => replaceBars(compact(text));

  /* ── 文字事實：g 是多項式、f 連續、f 可微 ─────────────────────── */
  // 這三種是證明裡最常引用、又算不出來的性質。它們用「鍵」登記（continuous:f），
  // 定理的前提（MVT 要可微、IVT 要連續）就查這些鍵。
  const TEXT_FACTS = [
    { key: "polynomial", re: /^([A-Za-z]\w*)\s*(?:是|為|is\s+a|is)?\s*(?:一個)?\s*(多項式|polynomial)(?:函數| function)?$/i },
    { key: "continuous", re: /^([A-Za-z]\w*)\s*(?:在.*?上|on\s+.+?)?\s*(?:是|為|is)?\s*(連續|continuous)(?:的|函數| function)?$/i },
    { key: "differentiable", re: /^([A-Za-z]\w*)\s*(?:在.*?上|on\s+.+?)?\s*(?:是|為|is)?\s*(可微|可導|可微分|differentiable)(?:的|函數| function)?$/i },
    // 二次可微：泰勒定理的前提（也蘊含可微）
    { key: "twice-differentiable", re: /^([A-Za-z]\w*)\s*(?:在.*?上|on\s+.+?)?\s*(?:是|為|is)?\s*(二次可微|二階可微|兩次可微|二次可導|twice differentiable|c\^?2)(?:的|函數| function| 級)?$/i },
    // v2.4 單調性：g 在 (0, ∞) 上遞增／g is increasing on (0, inf)。要先有「對所有 x∈…，g'(x) > 0」才立得住
    { key: "increasing", re: /^([A-Za-z]\w*)\s*(?:在\s*(.+?)\s*上)?\s*(?:是|為|is)?\s*(?:嚴格|strictly)?\s*(遞增|單調遞增|單調增|increasing|monotonically increasing)(?:\s+on\s+(.+))?(?:的)?$/i },
    { key: "decreasing", re: /^([A-Za-z]\w*)\s*(?:在\s*(.+?)\s*上)?\s*(?:是|為|is)?\s*(?:嚴格|strictly)?\s*(遞減|單調遞減|單調減|decreasing|monotonically decreasing)(?:\s+on\s+(.+))?(?:的)?$/i }
  ];
  function textFactKey(part) {
    for (const fact of TEXT_FACTS) {
      const match = part.match(fact.re);
      if (match) return { key: `${fact.key}:${match[1]}`, kind: fact.key, name: match[1] };
    }
    return null;
  }

  /* ── 目標的文字比對：lim 的各種寫法收斂成同一個鍵 ─────────────── */
  // lim_{x→2} 3x = 6、lim x→2 (3x) = 6、lim_(x->2) 3x=6 都是同一句。
  function canonicalText(text) {
    let out = normalize(text);
    out = out.replace(/lim\s*_?\s*[{(]?\s*([A-Za-z]\w*)\s*->\s*([^\s})]+)\s*[})]?\s*/g, "lim[$1->$2] ");
    out = compact(out).replace(/\*/g, "");
    out = out.replace(/^((?:.*?)lim\[[^\]]+\])\((.+)\)=/, "$1$2=");
    return out;
  }

  /* ── 句型 ───────────────────────────────────────────────────── */
  const PATTERNS = [
    { kind: "qed", label: "得證", re: /^(得證|證畢|證明完畢|qed|q\.e\.d\.?|■|∎)$/i },
    { kind: "induction", label: "用歸納法", re: /^(用(數學)?歸納法|對\s*(\w+)\s*(做|用|進行)?(數學)?歸納法?|by (mathematical )?induction(?: on (\w+))?)[,.:]?$/i },
    { kind: "cases", label: "分情況", re: /^(分|考慮|discuss|split into|consider)\s*(兩|三|四|two|three|four|\d)?\s*(種|個)?\s*(情況|cases?)[:,]?$/i },
    { kind: "case", label: "情況 N", re: /^(情況|case)\s*([一二三四五六\d]+)\s*[:,]?\s*(.*)$/i },
    { kind: "contradiction-start", label: "反設", re: /^(反設|假設不然|假設結論不成立|假設結論為假|suppose not|suppose (that )?not|assume (for|towards|to get) (a )?contradiction|suppose,? for contradiction,?)[,:]?\s*(.*)$/i },
    { kind: "contradiction", label: "矛盾", re: /^(.*?)(這)?(與|跟|和)?(.*?)矛盾[.!]?$|^(.*)(a )?contradiction[.!]?$/i },
    { kind: "base", label: "當 n = 1 時", re: /^(當|when|for)\s*(\w+)\s*=\s*([^\s,:時]+)\s*(時)?\s*[:,]?\s*(.*)$/i },
    { kind: "hypothesis", label: "假設 n = k 時成立", re: /^(假設|設|suppose|assume)\s*(當)?\s*(\w+)\s*=\s*(\w+)\s*(時)?\s*(成立|holds|is true|時命題成立)?\s*(?:[,:]\s*(即|that is|i\.e\.)?\s*(.+))?$/i },
    { kind: "let", label: "任取／設／取", re: /^(任取|任意取|任給|給定|固定|設|令|取|let|fix|take|choose|pick|given)(?:(?<=[取給定設令])\s*|\s+)(.+)$/i },
    { kind: "assume", label: "假設／若…則…", re: /^(假設|若|如果|suppose|assume|if)(?:(?<=[設若果])\s*|\s+)(.+?)(?:\s*[,;]\s*(則|那麼|then)(?:(?<=[則麼])\s*|\s+)(.+))?$/i },
    { kind: "by", label: "由 <規則>，…", re: /^(由|根據|依|依據|利用|by|using|from|applying)\s*(.+?)\s*[,:]\s*(.+)$/i },
    // v2.4 全稱主張：對所有 x > 0，g'(x) > 0／當 x > 0 時，g(x) > 0／for all x > 0, …／whenever x > 0, …
    // 條件只在這一句裡有效（不是整份證明的假設）；驗過之後登記成「對所有點成立」的事實，之後 g'(c) > 0 可以直接套
    { kind: "forall", label: "對所有 <條件>，<主張>", re: /^(對(?:所有|任意|每個|一切|任何|於)|for (?:all|every|any|each)|當|when|whenever)\s*(.+?)\s*(時)?\s*[,:]\s*(?:我們有|有|we have|then)?\s*(.+)$/i },
    // 中文關鍵字後面可以不空格（因為x>0，所以x²>0）；英文的要空格，不然 as/so 會咬到 assume、some
    { kind: "because", label: "因為…，所以…", re: /^(因為|because|since|as)(?:(?<=為)\s*|\s+)(.+?)\s*[,;]\s*(所以|故|因此|so|hence|therefore|thus)(?:(?<=[以故此])\s*|\s+)(.+)$/i },
    { kind: "claim", label: "則／所以 <推導>", re: /^(則|那麼|得|得到|所以|故|因此|於是|即|然後|接著|同理|(?:展開|整理|化簡|移項|通分|配方|代入|平方|開根號|兩邊[^,]{0,12}?)(?:後|可得|得到|得)?|then|so|hence|thus|therefore|we (get|have|obtain)|it follows that|this gives|expanding|simplifying|rearranging)\s*[,:]?\s*(.+)$/i }
  ];

  function classify(raw) {
    // 一行一句：句號只能在最後。「設 x。則 x² ≥ 0。」要拆成兩行，不然後半句會被當成前半句的一部分
    const inner = String(raw || "").trim().replace(/[。.]\s*$/, "");
    const stops = (inner.match(/。/g) || []).length;
    if (stops) return { kind: "unknown", label: "", match: null, text: normalize(raw), reason: `一行只能一句：這一行有 ${stops + 1} 句。每一句各自一行。` };
    const text = normalize(raw);
    for (const pattern of PATTERNS) {
      const match = text.match(pattern.re);
      if (match) return { kind: pattern.kind, label: pattern.label, match, text };
    }
    // 沒有句型的裸關係式：不猜它是什麼。推導寫「則」、引入寫「設」、條件寫「假設」——三個意思差很多
    if (splitChain(text)) return { kind: "unknown", label: "", match: null, text, reason: "這一行只有式子，沒有句型。它是推導（則／所以／故）、引入（設／任取／取）、還是條件（假設）？寫出來，我才知道怎麼用它。" };
    return { kind: "unknown", label: "", match: null, text };
  }

  function parse(text) {
    return String(text || "")
      .split(/\r?\n/)
      .map((raw, index) => ({ n: index + 1, raw, blank: !raw.trim() }))
      .filter((line) => !line.blank)
      .map((line) => Object.assign(line, classify(line.raw)));
  }

  /* ── 檢查 ───────────────────────────────────────────────────── */
  function statementList(text) {
    // 用「，」「且」「and」「;」切句；ASCII 逗號只在括號外切
    const out = [];
    let depth = 0;
    let current = "";
    for (const ch of text) {
      if (ch === "(" || ch === "[") depth += 1;
      if (ch === ")" || ch === "]") depth -= 1;
      if ((ch === "," || ch === ";") && depth === 0) { out.push(current); current = ""; continue; }
      current += ch;
    }
    out.push(current);
    return out
      .flatMap((part) => part.split(/\s+(且|and)\s+|且/))
      .map((part) => (part || "").trim())
      .map((part) => part.replace(/^(即|也就是說|也就是|亦即|因為|所以|故|則|因此|那麼|that is|i\.e\.|so|hence|then|because|since)\s*/i, "").trim())
      .filter((part) => part && part !== "且" && part !== "and")
      // 「對所有正整數 n」「對任意 x」這種量詞裝飾：不是主張，略過
      .filter((part) => !/^(對(所有|任意|每個|一切|任何)[^=<>]*(成立)?|for (all|every|any)[^=<>]*(holds)?|(結論|命題|原式)?(成立|holds|is true))$/i.test(part));
  }

  function hasChinese(text) {
    return /[一-鿿]/.test(text);
  }

  // 一條鏈 A = B <= C < D 整體說的是 A < D（有 < 就是 <，只有 <= 與 = 就是 <=，全是 = 才是 =）
  function chainOverallOp(ops) {
    if (ops.length === 1 && ops[0] === "!=") return "!=";
    if (ops.every((op) => op === "=")) return "=";
    if (ops.every((op) => op === "=" || op === "<" || op === "<=")) return ops.includes("<") ? "<" : "<=";
    if (ops.every((op) => op === "=" || op === ">" || op === ">=")) return ops.includes(">") ? ">" : ">=";
    return null;
  }

  function implies(mineOp, goalOp) {
    if (!mineOp) return false;
    if (goalOp === mineOp) return true;
    if (goalOp === "<=") return mineOp === "<" || mineOp === "=";
    if (goalOp === ">=") return mineOp === ">" || mineOp === "=";
    return false;
  }

  function goalMatches(spec, statement, ctx, evaluate) {
    const goal = spec.goal || {};
    const key = canonicalText(statement);
    if ((goal.text || []).some((alias) => canonicalText(alias) === key)) return true;
    if (goal.relation) {
      const chain = splitChain(normalize(goal.relation));
      const mine = splitChain(normalize(statement));
      if (chain && mine && chain.ops.length === 1) {
        const flipped = { "<": ">", ">": "<", "<=": ">=", ">=": "<=", "=": "=", "!=": "!=" };
        const overall = chainOverallOp(mine.ops);
        const first = mine.exprs[0];
        const last = mine.exprs[mine.exprs.length - 1];
        const goalOp = chain.ops[0];
        const direct = implies(overall, goalOp) && evaluate(chain.exprs[0], first, "=", ctx).ok && evaluate(chain.exprs[1], last, "=", ctx).ok;
        const swapped = implies(overall, flipped[goalOp]) && evaluate(chain.exprs[0], last, "=", ctx).ok && evaluate(chain.exprs[1], first, "=", ctx).ok;
        if (direct || swapped) return true;
      }
    }
    return false;
  }

  function check(spec, text, options) {
    const opts = options || {};
    const lines = parse(text);
    const ctx = {
      vars: new Map(),
      defs: {},
      constraints: [],
      facts: [],
      currentCase: null,
      cases: [],
      casesDeclared: 0,
      induction: null,
      contradiction: false,
      goalDone: false,
      goalDoneInCases: new Set(),
      atoms: new Map(),
      userFunctions: {},
      textFacts: new Set(),
      asserted: [],
      skeleton: { let: false, define: false, assume: false, bound: false, base: false, hypothesis: false, step: false, contradictionClosed: false }
    };
    (spec.given || []).forEach((given) => applyDeclaration(spec, ctx, normalize(given), null));
    // 題目給的文字事實（f 可微、g 連續）：定理的前提查這裡
    // 帶佔位符的事實（f'(_) = 0：對所有點成立）：使用者寫「因為 f'(c) = 0」才會被拿來用
    ctx.universal = [];
    (spec.facts || []).forEach((fact) => {
      const text = normalize(fact);
      const key = textFactKey(text);
      if (key) ctx.textFacts.add(key.key);
      const chain = text.includes("_") ? splitChain(text) : null;
      if (chain && chain.ops.length === 1) ctx.universal.push({ lhs: chain.exprs[0], op: chain.ops[0], rhs: chain.exprs[1], text });
      ctx.facts.push(text);
    });
    ctx.universal = expandUniversals(ctx.universal);
    const report = [];

    // 代數引擎：在目前的假設下驗一個關係
    const evaluate = (lhs, rhs, op, context) => {
      const scope = makeScope(spec, context);
      let left; let right;
      try {
        left = compile(applyMacros(spec, lhs, context), scope);
        right = compile(applyMacros(spec, rhs, context), scope);
      } catch (error) {
        if (error.unknownSymbol) return { ok: false, unsure: false, reason: `「${error.unknownSymbol}」沒有宣告。先用「設／任取／取」引入它，或檢查是不是打錯字。` };
        if (/看不懂的符號/.test(error.message)) return { ok: false, unsure: false, reason: `${error.message}：式子裡只能有數學，中文要放在句型的位置。` };
        return { ok: false, unsure: true, reason: error.message };
      }
      // v2.5：式子裡有積分或和（或自訂函數本體裡有）時每點都要做數值積分，取樣點減到 48 個——夠抓反例，不拖 UI
      const heavy = /\b(int|sum)\(/.test(`${lhs} ${rhs}`) || Object.values(context.userFunctions || {}).some((entry) => /\b(int|sum)\(/.test(entry.body));
      const { samples } = drawSamples(spec, context, heavy ? 48 : 160);
      if (!samples.length) return { ok: false, unsure: true, reason: "在目前的假設下抽不到任何一個點（假設互相矛盾，或條件太緊）" };
      let checked = 0;
      for (const env of samples) {
        let a; let b;
        try { a = left(env); b = right(env); } catch (error) { return { ok: false, unsure: true, reason: error.message }; }
        if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
        checked += 1;
        if (!RELATION_TEST[op](a, b)) {
          const shown = Object.keys(env).filter((name) => context.vars.has(name) || (spec.vars && spec.vars[name]) || context.atoms.has(name)).slice(0, 5).map((name) => `${name}=${round(env[name])}`).join(", ");
          return { ok: false, unsure: false, reason: `在 ${shown} 時左邊 ${round(a)}、右邊 ${round(b)}，「${op}」不成立` };
        }
      }
      if (!checked) return { ok: false, unsure: true, reason: "式子在取樣點上算不出有限值" };
      return { ok: true, checked };
    };

    const verifyChain = (statement, context) => {
      const chain = splitChain(statement);
      if (!chain) return null;
      const results = [];
      for (let i = 0; i < chain.ops.length; i += 1) {
        const result = evaluate(chain.exprs[i], chain.exprs[i + 1], chain.ops[i], context);
        results.push({ lhs: chain.exprs[i], rhs: chain.exprs[i + 1], op: chain.ops[i], ...result });
        if (!result.ok && !result.unsure) break;
      }
      return { chain, results };
    };

    const push = (line, status, note, extra) => {
      report.push(Object.assign({ n: line.n, raw: line.raw, kind: line.kind, label: line.label, status, note: pretty(ctx, note) }, extra || {}));
    };

    for (const line of lines) {
      if (line.kind === "unknown") {
        push(line, "error", line.reason || "讀不懂這一句。每一行要用一種句型開頭：任取／設／取、假設、則／所以、由 <定理>、因為…所以…、分情況、情況一、用歸納法、當 n=1 時、反設、得證。");
        continue;
      }
      if (line.kind === "qed") {
        push(line, ctx.goalDone ? "ok" : "error", ctx.goalDone ? "結論已經對上目標。" : "還沒有一句對上題目的目標，不能收尾。");
        continue;
      }
      if (line.kind === "induction") {
        const variable = line.match[3] || line.match[7] || (spec.induction && spec.induction.variable) || "n";
        ctx.induction = { variable, k: null };
        push(line, "ok", `對 ${variable} 做歸納：接下來要有基底（當 ${variable} = ${(spec.induction && spec.induction.base) || 1} 時）、歸納假設、歸納步驟。`);
        continue;
      }
      if (line.kind === "base") {
        handleBase(spec, ctx, line, push, verifyChain, evaluate);
        continue;
      }
      if (line.kind === "hypothesis") {
        handleHypothesis(spec, ctx, line, push);
        continue;
      }
      if (line.kind === "cases") {
        const word = line.match[2] || "";
        ctx.casesDeclared = { 兩: 2, 三: 3, 四: 4, two: 2, three: 3, four: 4 }[word.toLowerCase()] || Number(word) || 0;
        push(line, "ok", ctx.casesDeclared ? `分 ${ctx.casesDeclared} 種情況；每一種都要走到目標。` : "分情況；每一種都要走到目標。");
        continue;
      }
      if (line.kind === "case") {
        openCase(spec, ctx, line, push);
        continue;
      }
      if (line.kind === "contradiction-start") {
        startContradiction(spec, ctx, line, push);
        continue;
      }
      if (line.kind === "contradiction") {
        closeContradiction(spec, ctx, line, push);
        continue;
      }
      if (line.kind === "let") {
        const outcome = applyDeclaration(spec, ctx, line.match[2], line);
        push(line, outcome.status, outcome.note);
        continue;
      }
      if (line.kind === "assume") {
        const outcome = applyAssumption(spec, ctx, line.match[2], line);
        if (line.match[4]) {
          const claim = handleClaim(spec, ctx, line.match[4], line, verifyChain, evaluate, null);
          push(line, worst(outcome.status, claim.status), `${outcome.note} ${claim.note}`.trim(), { results: claim.results });
        } else {
          push(line, outcome.status, outcome.note);
        }
        continue;
      }
      if (line.kind === "by") {
        const rule = findRule(line.match[2]);
        const claim = handleClaim(spec, ctx, line.match[3], line, verifyChain, evaluate, rule || { id: "unknown", names: [line.match[2]] });
        push(line, claim.status, claim.note, { results: claim.results, rule: rule ? rule.id : null, grounding: claim.grounding || null });
        continue;
      }
      if (line.kind === "because") {
        // 前提得是已經立住的：題目給的、假設過的、前面驗過的、顯然的、只由定義算出來的。
        // 「因為 <目標>，所以 <目標>」那種，前提數值上對也不算。要在驗前提之前查，不然它自己就把自己登記成「驗過的」
        const unproved = statementList(line.match[2]).map((part) => ({ chain: splitChain(applyMacros(spec, part, ctx)), raw: splitChain(part) })).filter((item) => item.chain)
          .filter((item) => !premiseEstablished(spec, ctx, item.chain, evaluate, item.raw)).map((item) => item.chain);
        const reason = handleClaim(spec, ctx, line.match[2], line, verifyChain, evaluate, null, true);
        if (unproved.length && reason.status !== "error") {
          reason.status = "unsure";
          reason.note += ` 前提「${unproved[0].exprs.join(` ${unproved[0].ops[0]} `)}」還沒有立住：它不是題目給的、不是假設、前面也沒推出來。先在前一行推出它，或改用「則」寫成鏈。`;
        } else {
          statementList(line.match[2]).map((part) => splitChain(part)).filter(Boolean).forEach((chain) => rememberChain(ctx, chain));
        }
        // 「因為 g 連續，所以由中間值定理，存在 c 使 …」：結論自己帶了定理
        const nested = line.match[4].match(PATTERNS.find((item) => item.kind === "by").re);
        const rule = nested ? (findRule(nested[2]) || { id: "unknown", names: [nested[2]] }) : null;
        const claim = handleClaim(spec, ctx, nested ? nested[3] : line.match[4], line, verifyChain, evaluate, rule);
        push(line, worst(reason.status, claim.status), `前提：${reason.note} 結論：${claim.note}`, { results: [...(reason.results || []), ...(claim.results || [])], grounding: claim.grounding || reason.grounding || null });
        continue;
      }
      if (line.kind === "forall") {
        // 整句交給 handleClaim：它會把「對所有 <條件>，」剝下來，在條件之下驗，再登記成全稱事實
        const claim = handleClaim(spec, ctx, line.text, line, verifyChain, evaluate, null);
        push(line, claim.status, claim.note, { results: claim.results, grounding: claim.grounding || null });
        continue;
      }
      if (line.kind === "claim") {
        const body = line.bare ? line.text : line.match[3];
        // 分情況之後的總結句（故／因此／綜上 …）：它不屬於最後一個情況，它是在收所有情況
        const wrapUp = ctx.cases.length >= 2 && ctx.currentCase !== null && /^(故|因此|綜上|所以|therefore|hence|in (all|both|either) cases?)/i.test(line.text)
          && statementList(body).some((part) => goalMatches(spec, part, ctx, evaluate));
        if (wrapUp) {
          const unfinished = ctx.cases.filter((entry) => !ctx.goalDoneInCases.has(entry.id));
          ctx.currentCase = null;
          ctx.skeleton.casesClosed = true;
          ctx.goalDone = unfinished.length === 0;
          push(line, unfinished.length ? "error" : "ok", unfinished.length
            ? `情況 ${unfinished.map((entry) => entry.label).join("、")} 還沒走到目標，不能總結。`
            : `每一種情況都走到了目標，總結成立。`);
          continue;
        }
        const claim = handleClaim(spec, ctx, body, line, verifyChain, evaluate, null);
        push(line, claim.status, claim.note, { results: claim.results, grounding: claim.grounding || null });
        continue;
      }
    }

    const summary = summarize(spec, ctx, report, lines);
    summary.facts = (ctx.factLog || []).map((fact) => ({ id: fact.id, expr: fact.expr, line: fact.line, provenance: fact.provenance }));
    return summary;
  }

  function round(value) {
    if (!Number.isFinite(value)) return String(value);
    return Math.abs(value) >= 1000 ? value.toFixed(0) : Number(value.toPrecision(4)).toString();
  }

  function worst(a, b) {
    const rank = { ok: 0, unsure: 1, error: 2 };
    return rank[a] >= rank[b] ? a : b;
  }

  function applyMacros(spec, expr, ctx) {
    let out = expr;
    (spec.macros || []).forEach((macro) => {
      out = out.replace(new RegExp(macro.pattern, "g"), macro.replace);
    });
    return atomize(spec, out, ctx);
  }

  // 登記一條條件。等式如果一邊是還沒定義的變數（或抽象 atom）、或「那個東西 ± 別的」，
  // 就直接解出來當定義 —— 連續變數用拒絕取樣永遠碰不到等號。分情況裡的條件不解（它只在那一段有效）。
  function registerRelation(spec, ctx, lhs, rhs, op, caseId) {
    if (op === "=" && caseId === null) {
      const solved = solveForUnknown(ctx, lhs, rhs) || solveForUnknown(ctx, rhs, lhs) || solveLinear(spec, ctx, lhs, rhs);
      if (solved) {
        ctx.defs[solved.name] = solved.expr;
        ctx.vars.delete(solved.name);
        return solved;
      }
    }
    ctx.constraints.push({ lhs, rhs, op, caseId });
    return null;
  }

  function solveForUnknown(ctx, side, other) {
    const free = (name) => /^[A-Za-z_]\w*$/.test(name) && ctx.defs[name] === undefined && CONSTANTS[name] === undefined
      && (name.startsWith(ATOM_PREFIX) || ctx.vars.has(name));
    const text = side.trim();
    if (free(text)) return { name: text, expr: `(${other})` };
    const mentions = (name, expr) => new RegExp(`\\b${name}\\b`).test(expr);
    let match = text.match(/^([A-Za-z_]\w*)\s*([+-])\s*(.+)$/);
    if (match && free(match[1]) && !mentions(match[1], match[3]) && !mentions(match[1], other)) {
      return { name: match[1], expr: `(${other})${match[2] === "+" ? "-" : "+"}(${match[3]})` };
    }
    match = text.match(/^(.+?)\s*\+\s*([A-Za-z_]\w*)$/);
    if (match && free(match[2]) && !mentions(match[2], match[1]) && !mentions(match[2], other)) {
      return { name: match[2], expr: `(${other})-(${match[1]})` };
    }
    return null;
  }

  // 等式 L = R 對某個抽象 atom u 是一次的：E(u) = L − R 是 u 的一次式，
  // 解 u = −E(0)/(E(1) − E(0))。「一次」用取樣驗：E(2) 得等於 2E(1) − E(0)。
  // 定義寫成把 u 換成 0、1 的式子，之後的取樣照常代進去。
  function solveLinear(spec, ctx, lhs, rhs) {
    const candidates = [...(ctx.atoms ? ctx.atoms.keys() : [])].filter((name) => ctx.defs[name] === undefined && new RegExp(`\\b${name}\\b`).test(lhs + " " + rhs));
    if (candidates.length !== 1) return null;
    const name = candidates[0];
    const at = (value) => `((${lhs})-(${rhs}))`.replace(new RegExp(`\\b${name}\\b`, "g"), `(${value})`);
    const scope = makeScope(spec, ctx);
    let e0; let e1; let e2;
    try { e0 = compile(at(0), scope); e1 = compile(at(1), scope); e2 = compile(at(2), scope); } catch (_error) { return null; }
    const { samples } = drawSamples(spec, ctx, 24);
    if (!samples.length) return null;
    const affine = samples.every((env) => {
      let a; let b; let c;
      try { a = e0(env); b = e1(env); c = e2(env); } catch (_error) { return false; }
      if (![a, b, c].every(Number.isFinite)) return false;
      const slope = b - a;
      return Math.abs(slope) > 1e-9 && Math.abs(c - (2 * b - a)) <= 1e-6 * (1 + Math.abs(c));
    });
    if (!affine) return null;
    return { name, expr: `(-(${at(0)})/((${at(1)})-(${at(0)})))` };
  }

  /* 任取 ε > 0 ／ 設 x, y 為實數 ／ 取 δ = ε/3 ／ 令 g(x) = … */
  function applyDeclaration(spec, ctx, body, line) {
    const notes = [];
    let status = "ok";
    const parts = statementList(body.replace(/\s*(為|是|屬於|be|as|in)\s*(實數|正實數|正數|整數|正整數|自然數|real numbers?|reals?|positive|integers?)\s*$/i, ""))
      // x ∈ I、c in (a, b)：集合成員關係只用來認變數，不當條件
      .map((part) => part.replace(/\s+in\s+[A-Za-z(\[][^,]*$/i, "").trim())
      .filter(Boolean);
    for (const part of parts) {
      const chain = splitChain(part);
      const fnDef = chain && chain.ops.length === 1 && chain.ops[0] === "=" && chain.exprs[0].match(/^([A-Za-z_]\w*)\(([A-Za-z_]\w*)\)$/);
      if (fnDef && !(spec.abstract && spec.abstract[fnDef[1]])) {
        // 令 g(x) = x^5 + x − 1：使用者自己定義的函數，本體只能用參數、常數、內建函數
        const name = fnDef[1];
        const param = fnDef[2];
        const body = applyMacros(spec, chain.exprs[1], ctx);
        try {
          // 本體：參數之外也可以用題目的變數、前面宣告的變數與定義（令 I(p) = ∫₀¹ (x^p − x^q)/ln x dx 裡的 q）
          const outer = [...Object.keys(spec.vars || {}), ...ctx.vars.keys(), ...Object.keys(ctx.defs)].filter((v) => v !== param);
          const fn = compile(body, { vars: new Set([param, ...outer]), functions: Object.assign({}, spec.functions || {}) });
          ctx.userFunctions[name] = { param, body, fn };
          ctx.vars.delete(name);
          notes.push(`定義函數 ${name}(${param}) = ${chain.exprs[1]}，後面的 ${name}(…) 都會照這個算。`);
        } catch (error) {
          status = worst(status, "error");
          notes.push(`「${part}」：${error.unknownSymbol ? `函數本體只能用參數 ${param}、題目的變數與前面宣告過的東西（「${error.unknownSymbol}」不是）` : error.message}`);
        }
        continue;
      }
      if (chain && chain.ops.length === 1 && chain.ops[0] === "=" && /^[A-Za-z_]\w*$/.test(chain.exprs[0])) {
        // 定義：取 δ = ε/3
        const name = chain.exprs[0];
        ctx.defs[name] = applyMacros(spec, chain.exprs[1], ctx);
        ctx.vars.delete(name);
        ctx.skeleton.define = true;
        try { compile(ctx.defs[name], makeScope(spec, ctx)); } catch (error) {
          status = worst(status, "error");
          notes.push(`「${part}」：${error.message}`);
          continue;
        }
        notes.push(`定義 ${name} = ${chain.exprs[1]}，後面的驗算會代進去。`);
        continue;
      }
      if (chain) {
        // 帶條件的宣告：任取 ε > 0、假設 0 < |x-2| < δ（在 let 裡也收）
        const declared = chain.exprs.filter((expr) => /^[A-Za-z_]\w*$/.test(expr));
        declared.forEach((name) => { if (!ctx.defs[name]) ctx.vars.set(name, ctx.vars.get(name) || {}); });
        for (let i = 0; i < chain.ops.length; i += 1) {
          registerRelation(spec, ctx, applyMacros(spec, chain.exprs[i], ctx), applyMacros(spec, chain.exprs[i + 1], ctx), chain.ops[i], ctx.currentCase);
        }
        if (/\beps\b/.test(part) && chain.ops.some((op) => op === ">" || op === ">=")) ctx.skeleton.let = true;
        notes.push(`引入 ${declared.join("、") || "變數"}，條件「${part}」會限制取樣。`);
        continue;
      }
      const names = part.split(/\s*[,、]\s*|\s+/).filter((token) => /^[A-Za-z_]\w*$/.test(token));
      if (!names.length) {
        status = worst(status, "unsure");
        notes.push(`「${part}」看不出是在宣告哪個變數。`);
        continue;
      }
      names.forEach((name) => ctx.vars.set(name, ctx.vars.get(name) || {}));
      notes.push(`引入變數 ${names.join("、")}。`);
    }
    if (line && parts.length === 0) return { status: "unsure", note: "這一句沒有宣告任何東西。" };
    return { status, note: notes.join(" ") };
  }

  /* 假設 0 < |x − 2| < δ */
  function applyAssumption(spec, ctx, body, line) {
    const parts = statementList(body);
    const notes = [];
    let status = "ok";
    for (const part of parts) {
      const chain = splitChain(part);
      if (!chain) {
        if (hasChinese(part) || !/[A-Za-z]/.test(part)) {
          ctx.facts.push(part);
          status = worst(status, "unsure");
          notes.push(`「${part}」記成文字假設，之後只能靠規則對得上。`);
        } else {
          status = worst(status, "unsure");
          notes.push(`「${part}」不是關係式，我只能當文字假設。`);
          ctx.facts.push(part);
        }
        continue;
      }
      chain.exprs.filter((expr) => /^[A-Za-z_]\w*$/.test(expr)).forEach((name) => { if (!ctx.defs[name]) ctx.vars.set(name, ctx.vars.get(name) || {}); });
      for (let i = 0; i < chain.ops.length; i += 1) {
        registerRelation(spec, ctx, applyMacros(spec, chain.exprs[i], ctx), applyMacros(spec, chain.exprs[i + 1], ctx), chain.ops[i], ctx.currentCase);
        recordFact(ctx, { lhs: chain.exprs[i], op: chain.ops[i], rhs: chain.exprs[i + 1] }, line, { kind: "assume", from: [] });
      }
      if (new RegExp(`\\b${thresholdName(spec)}\\b`).test(part)) ctx.skeleton.assume = true;
      notes.push(`假設「${part}」，之後的取樣都在這個條件下。`);
    }
    // 假設之後要能抽得到點，不然後面每一句都驗不了
    const probe = drawSamples(spec, ctx, 20);
    if (!probe.samples.length && ctx.constraints.length) {
      status = worst(status, ctx.contradiction ? "ok" : "unsure");
      notes.push(ctx.contradiction ? "在反設之下已經抽不到任何點 —— 假設本身互相矛盾。" : "加上這個假設之後抽不到任何一個點：假設互相矛盾，或條件太緊。");
      ctx.infeasible = true;
    }
    return { status, note: notes.join(" ") };
  }

  /* 推導：則 |3x − 6| = 3|x − 2| < 3δ = ε */
  /* ── v2.4 全稱主張：對所有 x > 0，g'(x) > 0 ───────────────────────
     條件只在這一句裡有效：複製一份上下文、把條件當假設加進去、在裡面驗主張。
     驗過之後：(1) 驗過的關係複製回主上下文（供之後接地）；(2) 每一條含量化變數的
     關係把變數換成 _ 登記成全稱事實（帶 domain），之後「g'(c) > 0」寫出來就是它的實例
     （c 要滿足 domain，matchUniversal 會用取樣驗）。 */
  const QUANTIFIER_HEAD = /^(?:對(?:所有|任意|每個|一切|任何|於)|for (?:all|every|any|each)|當|when|whenever)\s*(.+?)\s*(?:時)?\s*[,:]\s*(?:我們有|有|we have|then)?\s*(.+)$/i;
  const QUANTIFIER_TAIL = /^(.+?)\s*,?\s*(?:對(?:所有|任意|每個|一切|任何)|for (?:all|every|any|each)|whenever|when)\s+(.+?)\s*(?:成立|holds)?$/i;
  function parseQuantifier(body) {
    const text = String(body || "").trim();
    let m = text.match(QUANTIFIER_HEAD);
    if (m && /(<=|>=|!=|<|>|=| in )/.test(m[2])) return { condition: m[1].trim(), rest: m[2].trim() };
    m = text.match(QUANTIFIER_TAIL);
    if (m && /(<=|>=|!=|<|>|=| in )/.test(m[1]) && /(<=|>=|!=|<|>|=| in |∈)/.test(m[2]) && !/^(所有|任意|all|every|any)/.test(m[2])) return { condition: m[2].trim(), rest: m[1].trim() };
    return null;
  }
  // 「x in (0, inf)」「x ∈ [a, b)」→ 「0 < x < inf」；無限的那一邊略過
  function conditionToChain(condition) {
    const interval = condition.match(/^([A-Za-z_]\w*)\s+in\s*([\(\[])\s*([^,]+?)\s*,\s*([^\)\]]+?)\s*([\)\]])$/i);
    if (!interval) return condition;
    const [, name, open, lo, hi, close] = interval;
    const parts = [];
    if (!/^-?inf$/i.test(lo.trim())) parts.push(`${lo.trim()} ${open === "[" ? "<=" : "<"} ${name}`);
    if (!/^-?inf$/i.test(hi.trim())) parts.push(`${parts.length ? "" : name + " "}${close === "]" ? "<=" : "<"} ${hi.trim()}`.replace(/^(<=?) /, `${name} $1 `));
    return parts.length ? parts.join(" 且 ").replace(/(\S+) (<=?) (\w+) 且 \3 (<=?) (\S+)/, "$1 $2 $3 $4 $5") : name;
  }
  function handleQuantified(spec, ctx, quantified, line, verifyChain, evaluate, rule, isPremise) {
    const conditionChain = conditionToChain(quantified.condition);
    const local = cloneCtx(ctx);
    local.skeleton = { ...ctx.skeleton };
    local.verifiedLinks = (ctx.verifiedLinks || []).slice();
    local.knownExprs = (ctx.knownExprs || []).slice();
    local.factLog = (ctx.factLog || []).slice();
    local.goalDone = false;
    local.goalDoneInCases = new Set(ctx.goalDoneInCases);
    // 量化變數：條件裡的識別字（x > 0 的 x）；還沒宣告就在這一句裡當變數
    const names = Array.from(new Set((conditionChain.match(/[A-Za-z_]\w*/g) || []).filter((name) => !MATH_FUNCTIONS[name] && CONSTANTS[name] === undefined && !/^(in|and|且)$/i.test(name))));
    names.forEach((name) => { if (!local.defs[name] && !(local.userFunctions && local.userFunctions[name])) local.vars.set(name, local.vars.get(name) || {}); });
    const assumed = splitChain(conditionChain) || /且/.test(conditionChain) ? applyAssumption(spec, local, conditionChain, null) : { status: "ok", note: "" };
    if (local.infeasible) return { status: "unsure", note: `條件「${quantified.condition}」之下抽不到任何點，主張沒法驗。`, results: [], grounding: null };
    const inner = handleClaim(spec, local, quantified.rest, line, verifyChain, evaluate, rule, isPremise);
    const results = inner.results || [];
    if (inner.status === "error") return { status: "error", note: `在「${quantified.condition}」之下：${inner.note}`, results, grounding: inner.grounding || null };
    // 驗過的東西帶回主上下文（不帶條件本身：條件只在這一句有效）
    ctx.verifiedLinks = ctx.verifiedLinks || [];
    local.verifiedLinks.slice((ctx.verifiedLinks || []).length).forEach((link) => ctx.verifiedLinks.push(link));
    ctx.knownExprs = ctx.knownExprs || [];
    local.knownExprs.slice(ctx.knownExprs.length).forEach((expr) => ctx.knownExprs.push(expr));
    ctx.factLog = ctx.factLog || [];
    local.factLog.slice(ctx.factLog.length).forEach((fact) => ctx.factLog.push(fact));
    if (local.goalDone) { ctx.goalDone = true; if (ctx.currentCase !== null) ctx.goalDoneInCases.add(ctx.currentCase); }
    if (local.skeleton.bound) ctx.skeleton.bound = true;
    if (local.skeleton.step) ctx.skeleton.step = true;
    local.textFacts.forEach((key) => ctx.textFacts.add(key));
    if (local.monotone) ctx.monotone = Object.assign(ctx.monotone || {}, local.monotone);
    // 登記成全稱事實：每一條含量化變數的關係，變數換成 _
    const variable = names.find((name) => local.vars.has(name) || (spec.vars && spec.vars[name])) || names[0];
    const registered = [];
    if (variable && inner.status === "ok") {
      const hole = (text) => text.replace(new RegExp(`\\b${variable}\\b`, "g"), "_");
      statementList(quantified.rest).map((part) => splitChain(part)).filter(Boolean).forEach((chain) => {
        const segments = chain.ops.map((op, i) => ({ lhs: chain.exprs[i], op, rhs: chain.exprs[i + 1] }));
        // 多段鏈的頭尾也是一條事實：g'(x) = e^x − 1 > 0 給的是 g'(_) > 0
        const overall = chain.ops.length > 1 ? chainOverallOp(chain.ops) : null;
        if (overall) segments.push({ lhs: chain.exprs[0], op: overall, rhs: chain.exprs[chain.exprs.length - 1] });
        for (const { lhs, op, rhs } of segments) {
          if (!new RegExp(`\\b${variable}\\b`).test(`${lhs} ${rhs}`)) continue;
          const text = `${hole(lhs)} ${op} ${hole(rhs)}`;
          ctx.universal.push({ lhs: hole(lhs), op, rhs: hole(rhs), text, sourceExpr: `${text}（對所有 ${conditionChain}）`, domain: hole(conditionChain), fromClaim: true });
          registered.push(text);
        }
      });
      ctx.universal = expandUniversals(ctx.universal);
    }
    const note = `在「${quantified.condition}」之下：${inner.note}${registered.length ? ` 登記成對所有 ${variable} 成立的事實：${registered.join("、")}。` : ""}`;
    return { status: inner.status, note, results, grounding: inner.grounding || null, quantified: true };
  }

  function handleClaim(spec, ctx, body, line, verifyChain, evaluate, rule, isPremise) {
    const quantified = parseQuantifier(body);
    if (quantified) return handleQuantified(spec, ctx, quantified, line, verifyChain, evaluate, rule, isPremise);
    const parts = statementList(body);
    const notes = [];
    const results = [];
    let status = "ok";
    let anyChain = false;
    let grounding = null;
    for (const part of parts) {
      if (/^(成立|holds|is true|得證|矛盾)$/i.test(part)) continue;
      if (/^(結論|the claim|the statement|命題|原式)\s*(成立|holds)?$/i.test(part)) {
        if (ctx.induction && ctx.skeleton.base) { notes.push("「結論成立」在歸納裡要寫出 n = k+1 的式子才算。"); status = worst(status, "unsure"); }
        continue;
      }
      const goalHit = goalMatches(spec, part, ctx, evaluate);
      let handled = false;
      // 存在句：由 <定理>，存在 c ∈ (a, b) 使 …（但它就是題目的目標時，它是結論，不是新的存在句）
      const existential = goalHit ? null : part.match(EXISTENTIAL);
      if (existential) {
        const outcome = handleExistential(spec, ctx, existential, rule, evaluate);
        status = worst(status, outcome.status);
        notes.push(outcome.note);
        handled = true;
      }
      // 文字事實：g 是多項式、g 連續、f 可微
      const fact = handled ? null : textFactKey(part);
      if (fact) {
        const entry = ctx.userFunctions[fact.name];
        // 本體裡出現的內建函數名（sqrtx 這種不加括號的寫法也要抓到）
        // 長名字先比（cosh 不能被當成 cos + h）；cosx 這種不加括號的寫法也要抓到
        const builtinNames = Object.keys(MATH_FUNCTIONS).sort((a, b) => b.length - a.length).join("|");
        const builtins = (item) => (compact(item.body).match(new RegExp(`(${builtinNames})`, "g")) || []);
        const tameBody = (item) => Boolean(item) && !/\^\s*\(?-|\/\s*[A-Za-z(]/.test(item.body) && !/\^\s*\(?\d*\.\d/.test(item.body);
        const polynomialBody = (item) => tameBody(item) && builtins(item).length === 0;
        // 令 g(x) = cos(x) − x 這種：由處處連續（可微）的初等函數加減乘出來的，也連續（可微）
        const ELEMENTARY = { continuous: ["sin", "cos", "exp", "abs", "sinh", "cosh", "tanh", "atan"], differentiable: ["sin", "cos", "exp", "sinh", "cosh", "tanh", "atan"] };
        const elementaryBody = (item, kind) => tameBody(item) && builtins(item).every((name) => ELEMENTARY[kind].includes(name));
        let ok = false;
        let why = "";
        if (ctx.textFacts.has(fact.key)) { ok = true; why = "前面（或題目）已經給了"; }
        else if (fact.kind === "polynomial") {
          ok = polynomialBody(entry);
          why = ok ? `${fact.name} 的定義裡只有加減乘與整數次方` : (entry ? `${fact.name} 的定義裡有不是多項式的東西` : `我不知道 ${fact.name} 是什麼（先寫「令 ${fact.name}(x) = …」）`);
        } else if (fact.kind === "continuous") {
          ok = ctx.textFacts.has(`polynomial:${fact.name}`) || ctx.textFacts.has(`differentiable:${fact.name}`) || polynomialBody(entry) || Boolean(rule && rule.id === "continuity");
          why = ok ? "多項式／可微的函數都連續" : "";
          if (!ok && elementaryBody(entry, "continuous")) { ok = true; why = `${fact.name} 由 sin、cos、exp、絕對值與多項式加減乘組成，處處連續`; }
          if (!ok) why = `要先說 ${fact.name} 是多項式或可微（或題目給了連續）`;
        } else if (fact.kind === "increasing" || fact.kind === "decreasing") {
          // v2.4：g 遞增要靠「對所有 x∈…，g'(x) > 0」（前面驗過的全稱主張，或題目給的）
          const wantOps = fact.kind === "increasing" ? [">", ">="] : ["<", "<="];
          const derivativeSign = (ctx.universal || []).find((item) => {
            const oriented = (item.op === "<" || item.op === "<=") && shapeKey(item.rhs) === `${fact.name.toLowerCase()}'(_)` && shapeKey(item.lhs) === "0"
              ? { lhs: item.rhs, op: FLIP[item.op], rhs: item.lhs } : item;
            return shapeKey(oriented.lhs) === `${fact.name.toLowerCase()}'(_)` && shapeKey(oriented.rhs) === "0" && wantOps.includes(oriented.op);
          });
          ok = Boolean(derivativeSign) || Boolean(rule && rule.id === "monotone" && derivativeSign);
          if (ok) {
            ctx.monotone = ctx.monotone || {};
            ctx.monotone[fact.name] = { kind: fact.kind, strict: derivativeSign.op === ">" || derivativeSign.op === "<", domain: derivativeSign.domain || null };
            why = `前面已經有「${derivativeSign.sourceExpr || derivativeSign.text}」，導數${fact.kind === "increasing" ? "正" : "負"}則${fact.kind === "increasing" ? "遞增" : "遞減"}`;
          } else {
            why = `要先寫出「對所有 x∈…，${fact.name}'(x) ${fact.kind === "increasing" ? ">" : "<"} 0」（可以用 g'(x) = … 的鏈驗）`;
          }
        } else {
          ok = polynomialBody(entry) || (fact.kind === "differentiable" && ctx.textFacts.has(`twice-differentiable:${fact.name}`));
          why = ok ? (polynomialBody(entry) ? "多項式處處可微" : "二次可微的函數當然可微") : "";
          if (!ok && elementaryBody(entry, "differentiable")) { ok = true; why = `${fact.name} 由 sin、cos、exp 與多項式加減乘組成，處處可微`; }
          if (!ok) why = `${fact.name} 可微要由題目給`;
        }
        ctx.textFacts.add(fact.key);
        if (ok) notes.push(`「${part}」：${why}。`);
        else { status = worst(status, "unsure"); notes.push(`「${part}」：${why}，我驗不了，先當你是對的。`); }
        handled = true;
      }
      // 前面存在句給的關係：字面或數值等價地引用它
      const plain = handled ? null : splitChain(part);
      // 題目給的「對所有點成立」的條件（f'(_) = 0）：寫出來才登記，之後的取樣就吃它
      // 一段（|f'(c)| ≤ 2）或兩段（−2 ≤ f'(c) ≤ 2）都可以：每一段各自對上一條全稱條件才算
      const universalLinks = plain && !handled && plain.ops.length <= 2
        ? plain.ops.map((op, i) => ({ link: { lhs: plain.exprs[i], op, rhs: plain.exprs[i + 1] }, hit: matchUniversal(ctx, { exprs: [plain.exprs[i], plain.exprs[i + 1]], ops: [op] }, evaluate) }))
        : null;
      const universal = universalLinks && universalLinks.every((entry) => entry.hit) ? universalLinks : null;
      if (universal) {
        // 實例化做兩件事：邏輯上登記成事實（帶來源），取樣上登記成條件（f'(c) 的 atom 不再自由抽）
        universal.forEach(({ link, hit }) => {
          registerRelation(spec, ctx, applyMacros(spec, link.lhs, ctx), applyMacros(spec, link.rhs, ctx), link.op, ctx.currentCase);
          ctx.verifiedLinks = ctx.verifiedLinks || [];
          ctx.verifiedLinks.push(link);
          recordFact(ctx, link, line, { kind: "universal", source: "problem", sourceExpr: hit.sourceExpr, substitution: hit.substitution });
        });
        rememberChain(ctx, plain);
        const first = universal[0].hit;
        grounding = { kind: "universal", rule: null, from: universal.map((entry) => entry.hit.sourceExpr), substitution: first.substitution, exact: true };
        notes.push(`「${part}」：${universal.some((entry) => entry.hit.item.fromClaim) ? "前面推出的" : "題目給的"}「${Array.from(new Set(universal.map((entry) => entry.hit.sourceExpr))).join("」「")}」對所有點成立，套用到 ${first.substitution._}。`);
        handled = true;
      }
      if (plain && !handled && matchesAsserted(spec, ctx, plain, evaluate)) {
        notes.push(`「${part}」是前面存在句給的關係。`);
        rememberChain(ctx, plain);
        handled = true;
      }
      const textual = handled || /\blim\b|->|=>|forall|exists|存在|對所有|極限/.test(part);
      const verified = textual ? null : verifyChain(applyMacros(spec, part, ctx), ctx);
      if (verified) {
        anyChain = true;
        results.push(...verified.results);
        const bad = verified.results.find((item) => !item.ok && !item.unsure);
        const unsure = verified.results.filter((item) => !item.ok && item.unsure);
        if (bad) {
          // 反證裡：在反設下推出一個「對所有樣本都不成立」的關係 = 矛盾成立
          if (ctx.contradiction && verified.results.length === 1 && ctx.samplesAllFalse === undefined) {
            ctx.contradictionCandidate = part;
          }
          status = worst(status, "error");
          notes.push(`「${bad.lhs} ${bad.op} ${bad.rhs}」不成立：${bad.reason}`);
        } else if (rule && rule.id !== "unknown" && !isPremise && ruleRequirementMissing(rule, ctx, part)) {
          // 式子數值上對，但引用的定理前提沒立住（微積分基本定理要先算出 I′、均值定理要 f 可微）：黃，說缺什麼
          status = worst(status, "unsure");
          notes.push(`「${part}」式子本身驗過了，但引用${rule.names[0]}，${ruleRequirementMissing(rule, ctx, part)}。`);
          rememberChain(ctx, verified.chain);
        } else if (unsure.length) {
          const shapeHit = rule && rule.shapes && rule.shapes.some((shape) => shape.test(shapeKey(part))) && ruleRequirementsMet(rule, ctx, part);
          if (shapeHit) {
            notes.push(`「${part}」跟${rule.names[0]}的形狀對上了。`);
          } else if (rule && rule.id === "hypothesis" && ctx.induction && ctx.induction.hypothesisText && compact(part).includes(compact(ctx.induction.hypothesisText).split("=")[0])) {
            notes.push(`「${part}」用了歸納假設。`);
          } else {
            status = worst(status, "unsure");
            notes.push(`「${part}」：${unsure[0].reason}${rule ? `（規則「${rule.names[0]}」的形狀也對不上）` : ""}`);
          }
        } else {
          // 數值上成立 ≠ 推導出來。一條單獨的關係式要「接得上」：
          // 至少兩段的鏈、顯然的起點（平方 ≥ 0、|sin| ≤ 1…）、跟前面某條關係式等價、
          // 或它的某一邊在前面出現過。都沒有的話標黃 —— 一行寫出目標就算證完，那不是證明。
          // 鏈裡兩邊一模一樣的段（x² + 1 = x² + 1）不是推導，是用來湊「兩段鏈」的：紅
          const tight = (text) => replaceBars(normalize(text)).replace(/\s+/g, "");
          const trivial = verified.results.find((item) => tight(item.lhs) === tight(item.rhs));
          if (trivial) {
            status = worst(status, "error");
            notes.push(`「${trivial.lhs} ${trivial.op} ${trivial.rhs}」兩邊一樣，這一段沒有推導。`);
          }
          const mixed = verified.chain.ops.length >= 2 && !chainOverallOp(verified.chain.ops);
          if (mixed) {
            status = worst(status, "error");
            notes.push(`「${part}」的方向不一致（有 ≥ 也有 ≤）：一條鏈只能朝一個方向，兩件事請分兩句。`);
          }
          // 接地（v2.2）：先問「由哪裡來」——直接引用、代數等價、改寫規則（絕對值⇔區間、傳遞、區間裡的界、三角不等式）；
          // 都不是，再看鏈的某一端是不是已知的東西（前面出現過、宣告過的變數、定義、題目的目標或 ε-δ 的起點）、
          // 第一段是不是顯然的起點。多段但憑空出現的鏈不算。只有數值成立而找不到來源：黃。
          let structural = (!trivial && !mixed && !isPremise && !(rule && rule.id !== "unknown")) ? groundStatement(spec, ctx, verified.chain, evaluate) : null;
          // v2.4：鏈裡「同一個自訂函數比大小」的段（g(x) > g(0)）——數值上對不算理由，
          // 它要靠單調性（或前面已經推出這一段）。錨定規則對這種段不放行。
          const comparisons = verified.chain.ops.map((op, i) => ({ lhs: verified.chain.exprs[i], op, rhs: verified.chain.exprs[i + 1] })).filter((seg) => comparesSameUserFunction(ctx, seg));
          const knownSeg = (seg) => knownLinks(ctx).map(orientLess).some((fact) => { const mine = orientLess(seg); return implies(fact.op, mine.op) && compact(fact.lhs) === compact(mine.lhs) && compact(fact.rhs) === compact(mine.rhs); });
          const monotoneGrounds = comparisons.map((seg) => groundMonotone(spec, ctx, seg, evaluate) || (knownSeg(seg) ? { kind: "direct", rule: null, from: [showLink(seg)], exact: true, note: `「${showLink(seg)}」前面已經有了。` } : null));
          const comparisonBlocked = comparisons.length > 0 && monotoneGrounds.some((item) => !item);
          if (!structural && comparisons.length && !comparisonBlocked) structural = monotoneGrounds[0];
          const grounded = !trivial && !mixed && !comparisonBlocked && (isPremise || (rule && rule.id !== "unknown")
            || Boolean(structural)
            || (goalHit && skeletonReady(spec, ctx))
            || isObviousStart(headOf(verified.chain), spec, ctx) || anchored(spec, ctx, verified.chain, evaluate) || equivalentToKnown(spec, ctx, verified.chain, evaluate));
          ctx.verifiedLinks = ctx.verifiedLinks || [];
          const provenance = structural ? { kind: structural.kind, rule: structural.rule, from: structural.from }
            : isPremise ? { kind: "premise", from: [] } : (rule && rule.id !== "unknown") ? { kind: "theorem", rule: rule.id, from: [] } : { kind: grounded ? "anchored" : "numeric", from: [] };
          verified.results.forEach((item) => { ctx.verifiedLinks.push({ lhs: item.lhs, op: item.op, rhs: item.rhs }); recordFact(ctx, item, line, provenance); });
          if (structural) grounding = { kind: structural.kind, rule: structural.rule, from: structural.from, exact: structural.exact };
          if (!grounded) {
            status = worst(status, "unsure");
            if (comparisonBlocked) {
              const seg = comparisons[monotoneGrounds.findIndex((item) => !item)];
              const cmp = comparesSameUserFunction(ctx, seg);
              notes.push(`「${showLink(seg)}」是 ${cmp.name} 在兩個點的比大小：數值上對，但理由要是單調性——先寫「對所有 x∈…，${cmp.name}'(x) > 0」再寫「${cmp.name} 遞增」，或前面先推出這一段。`);
            } else {
              notes.push(`「${part}」在目前條件下成立，但找不到它是由哪一步推出的（兩邊都沒在前面出現過，也不是顯然的起點）—— 從前一步寫一條鏈過來。`);
            }
          } else if (structural) {
            notes.push(structural.note);
          } else {
            notes.push(`「${part}」${verified.results.length > 1 ? `的 ${verified.results.length} 段` : ""}在 ${verified.results[0].checked || 0} 個取樣點上都成立。`);
          }
          rememberChain(ctx, verified.chain);
          if (grounded && ctx.currentCase !== null) { ctx.caseChains = ctx.caseChains || new Set(); ctx.caseChains.add(ctx.currentCase); }
          // 鏈可以跨行接著寫：這一行的第一個式子等於上一行的最後一個，就併成同一條「run」
          // （Bernoulli 的歸納步驟就是兩行：… ≥ (1+kh)(1+h)，再 (1+kh)(1+h) = … ≥ …）
          const run = extendRun(spec, ctx, verified.chain, evaluate);
          // ε-δ 的收尾鏈：從 |f(x) − L| 開始、以 ε 結束、整體是 <
          if (spec.bound && chainOverallOp(run.ops) === "<"
            && evaluate(spec.bound.lhs, run.first, "=", ctx).ok
            && evaluate(spec.bound.rhs, run.last, "=", ctx).ok) {
            ctx.skeleton.bound = true;
          }
          // 歸納步驟：從目標在 n = k+1 的左式出發、走到 n = k+1 的右式
          if (ctx.induction && ctx.skeleton.hypothesis && spec.goal && spec.goal.relation) {
            const goal = splitChain(normalize(spec.goal.relation));
            const variable = ctx.induction.variable || (spec.induction && spec.induction.variable) || "n";
            const k = ctx.induction.k || "k";
            const at = (expr) => expr.replace(new RegExp(`\\b${variable}\\b`, "g"), `(${k}+1)`);
            if (goal && goal.ops.length === 1 && implies(chainOverallOp(run.ops), goal.ops[0])
              && evaluate(at(goal.exprs[0]), run.first, "=", ctx).ok
              && evaluate(at(goal.exprs[1]), run.last, "=", ctx).ok) {
              ctx.skeleton.step = true;
              notes.push(`這條鏈從 ${variable} = ${k}+1 的左式走到右式：歸納步驟完成。`);
            }
          }
        }
      } else if (!handled) {
        // 不是關係鏈：文字主張
        const missing = rule ? ruleRequirementMissing(rule, ctx, part) : "";
        const shapeHit = rule && rule.shapes && rule.shapes.some((shape) => shape.test(shapeKey(part))) && !missing;
        if (rule && missing) {
          status = worst(status, "unsure");
          notes.push(`「${part}」引用${rule.names[0]}，但${missing}。`);
        } else if (goalHit && (ctx.currentCase === null ? ctx.goalDone : ctx.goalDoneInCases.has(ctx.currentCase))) {
          notes.push(`「${part}」重述目標。`);
        } else if (goalHit && (shapeHit || skeletonReady(spec, ctx) || (rule && rule.id !== "unknown"))) {
          notes.push(`「${part}」對上題目的目標。`);
        } else if (goalHit) {
          status = worst(status, "unsure");
          notes.push(`「${part}」對上題目的目標，但前面沒有支撐它的步驟。`);
        } else if (shapeHit) {
          notes.push(`「${part}」跟${rule.names[0]}的形狀對上了。`);
        } else if (rule && rule.id !== "unknown") {
          status = worst(status, "unsure");
          notes.push(`「${part}」引用${rule.names[0]}，但我對不上它的形狀，先當你是對的。`);
        } else {
          status = worst(status, "unsure");
          notes.push(`「${part}」看得懂是主張，但驗不了（沒有可以取樣的關係式）。`);
        }
      }
      if (goalHit && !isPremise && status !== "error") {
        ctx.goalDone = true;
        if (ctx.currentCase !== null) ctx.goalDoneInCases.add(ctx.currentCase);
        if (!notes.some((note) => note.includes("對上題目的目標"))) notes.push("這一句對上題目的目標。");
      }
      if (rule && rule.id === "unknown" && !isPremise && rule.names[0] && status === "ok") {
        notes.push(`（「${rule.names[0]}」不在我的規則字典裡，但式子本身驗過了。）`);
      }
    }
    if (!parts.length) return { status: "unsure", note: "這一句沒有可以檢查的內容。", results, grounding: null };
    void anyChain;
    return { status, note: notes.join(" "), results, grounding };
  }

  /* 當 n = 1 時，左式 = 1，右式 = 1·2/2 = 1，成立 */
  function handleBase(spec, ctx, line, push, verifyChain, evaluate) {
    const variable = line.match[2];
    const value = line.match[3];
    const rest = line.match[5] || "";
    if (!ctx.induction) ctx.induction = { variable, k: null };
    const local = cloneCtx(ctx);
    local.defs[variable] = value;
    local.vars.delete(variable);
    const goal = spec.goal && spec.goal.relation ? splitChain(normalize(spec.goal.relation)) : null;
    const notes = [];
    let status = "ok";
    const parts = statementList(rest);
    let sawCheck = false;
    for (const part of parts) {
      if (/^(成立|holds|is true|顯然成立|obviously holds)$/i.test(part)) {
        if (!goal) { status = worst(status, "unsure"); notes.push("題目沒有可以代 n 的關係式，「成立」我驗不了。"); continue; }
        const result = evaluate(goal.exprs[0], goal.exprs[1], goal.ops[0], local);
        sawCheck = true;
        if (result.ok) notes.push(`把 ${variable} = ${value} 代進目標：成立。`);
        else { status = worst(status, result.unsure ? "unsure" : "error"); notes.push(`把 ${variable} = ${value} 代進目標：${result.reason}`); }
        continue;
      }
      const sided = part.match(/^(左式|左邊|lhs|left(-| )?hand side|右式|右邊|rhs|right(-| )?hand side)\s*=\s*(.+)$/i);
      if (sided && goal) {
        const isLeft = /^(左|lhs|left)/i.test(sided[1]);
        const side = isLeft ? goal.exprs[0] : goal.exprs[1];
        const chain = splitChain(sided[4]);
        const target = chain ? chain.exprs[chain.exprs.length - 1] : sided[4];
        const result = evaluate(side, target, "=", local);
        sawCheck = true;
        if (result.ok) notes.push(`${isLeft ? "左式" : "右式"}在 ${variable} = ${value} 時確實是 ${target}。`);
        else { status = worst(status, result.unsure ? "unsure" : "error"); notes.push(`${isLeft ? "左式" : "右式"}：${result.reason}`); }
        if (chain) {
          const verified = verifyChain(applyMacros(spec, sided[4], local), local);
          const bad = verified && verified.results.find((item) => !item.ok && !item.unsure);
          if (bad) { status = worst(status, "error"); notes.push(`「${bad.lhs} = ${bad.rhs}」不成立：${bad.reason}`); }
        }
        continue;
      }
      const verified = verifyChain(applyMacros(spec, part, local), local);
      if (verified) {
        sawCheck = true;
        const bad = verified.results.find((item) => !item.ok && !item.unsure);
        const unsure = verified.results.filter((item) => !item.ok && item.unsure);
        if (bad) { status = worst(status, "error"); notes.push(`「${part}」不成立：${bad.reason}`); }
        else if (unsure.length) { status = worst(status, "unsure"); notes.push(`「${part}」：${unsure[0].reason}`); }
        else notes.push(`「${part}」在 ${variable} = ${value} 時成立。`);
      } else {
        status = worst(status, "unsure");
        notes.push(`「${part}」驗不了。`);
      }
    }
    if (!sawCheck) { status = worst(status, "unsure"); notes.push(`基底要寫出 ${variable} = ${value} 時兩邊各是多少，或至少寫「成立」讓我代進去驗。`); }
    if (status !== "error" && sawCheck) ctx.skeleton.base = true;
    push(line, status, notes.join(" "));
  }

  /* 假設 n = k 時成立，即 1+…+k = k(k+1)/2 */
  function handleHypothesis(spec, ctx, line, push) {
    const variable = line.match[3];
    const k = line.match[4];
    const stated = line.match[8] || "";
    if (!ctx.induction) ctx.induction = { variable, k };
    ctx.induction.k = k;
    ctx.vars.set(k, { min: 1, max: 12, int: true });
    const goal = spec.goal && spec.goal.relation ? normalize(spec.goal.relation) : "";
    const hypothesisText = goal ? goal.replace(new RegExp(`\\b${variable}\\b`, "g"), k) : stated;
    ctx.induction.hypothesisText = hypothesisText;
    // 歸納假設當成一條「可用的事實」：把目標裡的 n 換成 k，之後的代數鏈可以直接用它
    if (goal && spec.functions) {
      ctx.skeleton.hypothesis = true;
      push(line, "ok", `登記歸納假設：${hypothesisText}。接下來要證明 ${variable} = ${k}+1 的情形。`);
      return;
    }
    ctx.skeleton.hypothesis = true;
    push(line, stated ? "ok" : "unsure", stated ? `登記歸納假設：${stated}。` : "登記歸納假設（題目沒有可代入的關係式，只能當文字事實）。");
  }

  function openCase(spec, ctx, line, push) {
    const label = line.match[2];
    const condition = line.match[3] || "";
    const id = ctx.cases.length;
    ctx.currentCase = id;
    const entry = { id, label, condition, otherwise: /^(否則|其他|其餘|otherwise|else)/i.test(condition) };
    ctx.cases.push(entry);
    if (entry.otherwise) {
      // 「否則」= 前面所有情況的補集：把前面每個情況的條件取反、AND 起來
      ctx.cases.slice(0, id).forEach((previous) => {
        const chain = previous.condition ? splitChain(previous.condition) : null;
        if (chain && chain.ops.length === 1) ctx.constraints.push({ lhs: applyMacros(spec, chain.exprs[0], ctx), rhs: applyMacros(spec, chain.exprs[1], ctx), op: NEGATE[chain.ops[0]], caseId: id });
      });
      push(line, "ok", `情況 ${label}：其餘所有點（前面情況的補集）。`);
      return;
    }
    const chain = condition ? splitChain(condition) : null;
    if (!chain) {
      push(line, "unsure", `情況 ${label}：條件「${condition}」不是關係式，這一段的推導只能在沒有額外條件下驗。`);
      return;
    }
    chain.exprs.filter((expr) => /^[A-Za-z_]\w*$/.test(expr)).forEach((name) => { if (!ctx.defs[name]) ctx.vars.set(name, ctx.vars.get(name) || {}); });
    // 條件裡的抽象函數（|f''(ξ)| ≥ 4）要 atom 化，不然編不出來就被當成沒有條件
    for (let i = 0; i < chain.ops.length; i += 1) ctx.constraints.push({ lhs: applyMacros(spec, chain.exprs[i], ctx), rhs: applyMacros(spec, chain.exprs[i + 1], ctx), op: chain.ops[i], caseId: id });
    push(line, "ok", `情況 ${label}：在「${condition}」之下取樣。`);
  }

  function startContradiction(spec, ctx, line, push) {
    ctx.contradiction = true;
    const body = line.match[5] || "";
    const goal = spec.goal && spec.goal.relation ? splitChain(normalize(spec.goal.relation)) : null;
    if (body) {
      const notes = [];
      let anyRelation = false;
      statementList(body).forEach((part) => {
        const chain = splitChain(part);
        if (chain) {
          anyRelation = true;
          chain.exprs.filter((expr) => /^[A-Za-z_]\w*$/.test(expr)).forEach((name) => { if (!ctx.defs[name]) ctx.vars.set(name, ctx.vars.get(name) || {}); });
          for (let i = 0; i < chain.ops.length; i += 1) ctx.constraints.push({ lhs: chain.exprs[i], rhs: chain.exprs[i + 1], op: chain.ops[i], caseId: null });
          notes.push(`反設「${part}」。`);
        } else if (/^(\w+)\s*(是|為)?\s*(最大|最小|largest|smallest|maximal|minimal|the (largest|smallest|maximum|minimum))/i.test(part)) {
          // 「m 是最大的」這種極值反設：之後配一條驗過的 t > m 就是矛盾
          anyRelation = true;
          ctx.facts.push(part);
          notes.push(`反設「${part}」—— 之後造一個比它更${/最大|largest|maximal|maximum/i.test(part) ? "大" : "小"}的就矛盾。`);
        } else {
          ctx.facts.push(part);
          notes.push(`「${part}」記成文字假設。`);
        }
      });
      push(line, anyRelation ? "ok" : "unsure", `${notes.join(" ")} 接下來要推出矛盾。`);
      return;
    }
    if (goal && goal.ops.length === 1) {
      ctx.constraints.push({ lhs: goal.exprs[0], rhs: goal.exprs[1], op: NEGATE[goal.ops[0]], caseId: null });
      push(line, "ok", `反設目標不成立：${goal.exprs[0]} ${NEGATE[goal.ops[0]]} ${goal.exprs[1]}。接下來要推出矛盾。`);
      return;
    }
    push(line, "unsure", "反設了，但題目的目標不是一條關係式，我沒辦法把它取反來取樣。");
  }

  function closeContradiction(spec, ctx, line, push) {
    if (!ctx.contradiction) {
      push(line, "error", "還沒有反設就說矛盾。反證法要先寫「反設 …」。");
      return;
    }
    // 沒抽到樣本不代表假設不可能成立；不能把取樣失敗當成反證。
    const probe = drawSamples(spec, ctx, 30);
    if (!probe.samples.length) {
      push(line, "unsure", "在反設之下沒有抽到可用的點，但取樣不足不能證明矛盾；請補上明確的推導。");
      return;
    }
    if (ctx.contradictionCandidate) {
      push(line, "unsure", `「${ctx.contradictionCandidate}」沒有通過驗算；錯誤的算式本身不能當作已推出的矛盾。`);
      return;
    }
    // 第三種：「m 是最大的」這種文字假設，配上一條驗過的 t > m（或 最小 配 t < m）
    const extremal = ctx.facts.map((fact) => fact.match(/^(\w+)\s*(是|為)?\s*(最大|最小|largest|smallest|maximal|minimal|the (largest|smallest|maximum|minimum))/i) || fact.match(/(largest|smallest|maximum|minimum)\s+(\w+)/i)).find(Boolean);
    if (extremal) {
      const name = extremal[1] && /^\w+$/.test(extremal[1]) && !/largest|smallest|maximum|minimum/i.test(extremal[1]) ? extremal[1] : extremal[2];
      const isMax = /最大|largest|maximal|maximum/i.test(extremal[0]);
      const fact = extremal.input;
      const positiveReals = /正實數|positive real/i.test(fact);
      const realDomain = positiveReals || /實數|real (number|value)/i.test(fact);
      const links = ctx.verifiedLinks || [];
      const beaten = links.some((link) => {
        const witness = ((link.op === (isMax ? ">" : "<")) && link.rhs === name) ? link.lhs
          : ((link.op === (isMax ? "<" : ">")) && link.lhs === name) ? link.rhs : null;
        if (!witness || !realDomain) return false;
        // 比最小正實數小還不夠：證人也必須是正實數，不能拿 -1 冒充。
        return !positiveReals || links.some((bound) =>
          (bound.lhs === "0" && bound.op === "<" && bound.rhs === witness)
          || (bound.lhs === witness && bound.op === ">" && bound.rhs === "0"));
      });
      if (beaten) {
        ctx.skeleton.contradictionClosed = true;
        push(line, "ok", `前面已經驗出同一範圍內一個比 ${name} 更${isMax ? "大" : "小"}的值，跟「${name} 是${isMax ? "最大" : "最小"}的」矛盾。`);
        return;
      }
      push(line, "unsure", "還需要證明更大或更小的值也屬於原來的範圍；正實數要明寫 0 < t，其他範圍目前無法自動確認。");
      return;
    }
    push(line, "unsure", "我抽得到同時滿足所有假設的點，看不出數值上的矛盾；如果矛盾來自數論或存在性，這裡只能靠你自己確認。");
  }

  // 前提立住了嗎：字面或等價於某條條件（題目給的、假設、情況、宣告的範圍）、前面驗過的關係、
  // 顯然的起點、或只由定義與常數組成（δ ≤ 1，而 δ = min(1, ε/7)）
  function premiseEstablished(spec, ctx, chain, evaluate, rawChain) {
    // −2 ≤ f'(c) ≤ 2：兩段各自對上題目的全稱條件，整條就是題目給的
    const links = (c) => c.ops.map((op, i) => ({ exprs: [c.exprs[i], c.exprs[i + 1]], ops: [op] }));
    if (rawChain && rawChain.ops.length === 2 && links(rawChain).every((link) => matchUniversal(ctx, link, evaluate))) return true;
    if (chain.ops.length !== 1) return anchored(spec, ctx, chain, evaluate);
    if (isObviousStart(chain, spec, ctx)) return true;
    // 題目給的「對所有點成立」的條件（f'(_) = 0），寫出 f'(c) = 0 就是拿題目的條件來用（比對用沒 atom 化的原文）
    if (rawChain && rawChain.ops.length === 1 && matchUniversal(ctx, rawChain, evaluate)) return true;
    const [lhs, rhs] = chain.exprs;
    const op = chain.ops[0];
    const flipped = { "<": ">", ">": "<", "<=": ">=", ">=": "<=", "=": "=", "!=": "!=" };
    const same = (a, b) => compact(a) === compact(b) || evaluate(a, b, "=", ctx).ok;
    const matches = (item) => (item.op === op && same(item.lhs, lhs) && same(item.rhs, rhs)) || (item.op === flipped[op] && same(item.lhs, rhs) && same(item.rhs, lhs));
    if (ctx.constraints.some(matches) || (ctx.verifiedLinks || []).some(matches) || (ctx.asserted || []).some(matches)) return true;
    if (equivalentToKnown(spec, ctx, chain, evaluate)) return true;
    if (equivalentToConstraint(spec, ctx, chain, evaluate)) return true;
    // 只有定義與常數：把定義代進去就能算，等於「由定義」
    // 用有空白的版本抓識別字（compact 會把 pi ln a 黏成 pilna），再小寫
    const identifiers = (normalize(replaceBars(lhs + "+" + rhs)).toLowerCase().match(/[a-z_]\w*'*/g) || []).filter((name) => !MATH_FUNCTIONS[name] && CONSTANTS[name] === undefined && !/^zzq\d+$/.test(name));
    // 自己令的函數（g、g′）也算定義：g(0) = 0 代進去就能算
    // identifiers 是 compact 過的（小寫），自訂函數名（I）要不分大小寫地找
    const userFunctionNames = Object.keys(ctx.userFunctions || {}).map((name) => name.toLowerCase());
    const byDefinition = (name) => ctx.defs[name] !== undefined || Object.keys(ctx.defs).some((key) => key.toLowerCase() === name) || userFunctionNames.includes(name.replace(/'+$/, ""));
    if (identifiers.length && identifiers.every(byDefinition)) return true;
    // v2.5：等式裡有自己定義的東西、其餘是題目的變數（I(q) = 0、I(0) = π ln a）：把定義代進去就算得出來，算「由定義」。
    // 不等式不算（g(x) > 0 是主張不是計算），沒有任何定義的等式也不算
    const isVariable = (name) => (spec.vars && spec.vars[name] !== undefined) || ctx.vars.has(name);
    if (op === "=" && identifiers.some(byDefinition) && identifiers.every((name) => byDefinition(name) || isVariable(name))) return true;
    return false;
  }

  /* ── 符號正負：一句「顯然」到底顯不顯然 ──────────────────────────── */
  // 把式子讀成樹，只回答一個問題：這個東西是不是「一看就 ≥ 0（或 > 0）」。
  // 規則就是課本上會直接用的那幾條：常數、平方／偶次方、絕對值、根號、e^x、
  // 題目說了 ≥ 0 的變數、以上這些的和與積、正數除以正數。其他一律不算——
  // 「x² + 1 ≥ 2x」數值上永遠對，但它不是顯然，要展開一個平方才看得到。
  function parseTree(text) {
    const tokens = tokenize(text);
    let pos = 0;
    const peek = () => tokens[pos];
    const take = () => tokens[pos++];
    const isFn = (name) => Boolean(MATH_FUNCTIONS[name]);
    function atom() {
      const token = take();
      if (!token) throw new Error("empty");
      if (token.type === "num") return { type: "num", value: Number(token.value) };
      if (token.type === "op" && token.value === "(") { const inner = expr(); if (!peek() || take().value !== ")") throw new Error(")"); return inner; }
      if (token.type === "op" && token.value === "-") return { type: "neg", arg: unary() };
      if (token.type === "op" && token.value === "+") return unary();
      if (token.type === "id") {
        if (isFn(token.value) && peek() && peek().type === "op" && peek().value === "(") { take(); const arg = expr(); if (!peek() || take().value !== ")") throw new Error(")"); return { type: "call", name: token.value, arg }; }
        if (isFn(token.value) && peek() && (peek().type === "id" || peek().type === "num")) return { type: "call", name: token.value, arg: atom() };
        return { type: "id", name: token.value };
      }
      throw new Error("atom");
    }
    function power() {
      let base = atom();
      if (peek() && peek().type === "op" && peek().value === "^") { take(); const exponent = unary(); base = { type: "pow", base, exponent }; }
      return base;
    }
    function unary() { return power(); }
    function term() {
      let left = unary();
      for (;;) {
        const next = peek();
        if (next && next.type === "op" && (next.value === "*" || next.value === "/")) { take(); left = { type: next.value === "*" ? "mul" : "div", left, right: unary() }; continue; }
        // 隱式乘法：ab、2x、(a+b)(a−b)、x sqrt(y)
        if (next && (next.type === "num" || next.type === "id" || (next.type === "op" && next.value === "("))) { left = { type: "mul", left, right: unary() }; continue; }
        return left;
      }
    }
    function expr() {
      let left = term();
      for (;;) {
        const next = peek();
        if (next && next.type === "op" && (next.value === "+" || next.value === "-")) { take(); left = { type: next.value === "+" ? "add" : "sub", left, right: term() }; continue; }
        return left;
      }
    }
    const root = expr();
    if (pos < tokens.length) throw new Error("trailing");
    return root;
  }

  // 變數的已知下界：題目的取樣範圍、宣告時的條件（a ≥ 0、b > 0）、情況裡的條件
  function lowerBoundOf(name, spec, ctx) {
    let bound = null;
    const consider = (value, strict) => { if (bound === null || value > bound.value || (value === bound.value && strict)) bound = { value, strict }; };
    const declared = (spec && spec.vars && spec.vars[name]) || (ctx && ctx.vars && ctx.vars.get(name)) || null;
    if (declared && declared.min !== undefined && Number.isFinite(declared.min)) consider(declared.min, false);
    (ctx && ctx.constraints ? ctx.constraints : []).forEach((item) => {
      if (item.caseId !== null && item.caseId !== ctx.currentCase) return;
      const l = compact(item.lhs); const r = compact(item.rhs);
      const num = (text) => (/^-?\d+(\.\d+)?$/.test(text) ? Number(text) : null);
      if (l === name.toLowerCase() && num(r) !== null && (item.op === ">=" || item.op === ">")) consider(num(r), item.op === ">");
      if (r === name.toLowerCase() && num(l) !== null && (item.op === "<=" || item.op === "<")) consider(num(l), item.op === "<");
    });
    return bound;
  }

  // sign(node) → "pos"（> 0）、"nonneg"（≥ 0）、null（不知道）
  function signOf(node, spec, ctx) {
    const meet = (a, b) => (a && b ? ((a === "pos" && b === "pos") ? "pos" : "nonneg") : null);
    switch (node.type) {
      case "num": return node.value > 0 ? "pos" : node.value === 0 ? "nonneg" : null;
      case "id": {
        const bound = lowerBoundOf(node.name, spec, ctx);
        if (bound) {
          if (bound.value > 0 || (bound.value === 0 && bound.strict)) return "pos";
          return bound.value === 0 ? "nonneg" : null;
        }
        // 黏在一起的名字：sqrtx 是 sqrt(x)，ab 是 a·b（跟 compile 的 splitIdentifier 同一套想法）
        const fnPrefix = Object.keys(MATH_FUNCTIONS).sort((a, b) => b.length - a.length).find((name) => node.name.startsWith(name) && node.name.length > name.length);
        if (fnPrefix) return signOf({ type: "call", name: fnPrefix, arg: { type: "id", name: node.name.slice(fnPrefix.length) } }, spec, ctx);
        if (node.name.length > 1 && /^[A-Za-z]+$/.test(node.name)) {
          const parts = node.name.split("").map((letter) => signOf({ type: "id", name: letter }, spec, ctx));
          if (parts.some((sign) => !sign)) return null;
          return parts.every((sign) => sign === "pos") ? "pos" : "nonneg";
        }
        return null;
      }
      case "call":
        if (node.name === "exp" || node.name === "cosh") return "pos";
        if (node.name === "abs" || node.name === "sqrt") return signOf(node.arg, spec, ctx) === "pos" ? "pos" : "nonneg";
        return null;
      case "pow": {
        const exponent = node.exponent;
        if (exponent.type === "num" && Number.isInteger(exponent.value) && exponent.value % 2 === 0 && exponent.value > 0) return signOf(node.base, spec, ctx) === "pos" ? "pos" : "nonneg";
        const base = signOf(node.base, spec, ctx);
        return base === "pos" ? "pos" : null;
      }
      case "mul": case "div": {
        const a = signOf(node.left, spec, ctx); const b = signOf(node.right, spec, ctx);
        if (node.type === "div" && b !== "pos") return null;
        return meet(a, b);
      }
      case "add": {
        const a = signOf(node.left, spec, ctx); const b = signOf(node.right, spec, ctx);
        if (!a || !b) return null;
        return (a === "pos" || b === "pos") ? "pos" : "nonneg";
      }
      case "sub": {
        // a − b ≥ 0 只在 b 是「非正」時顯然：這裡只認 b 是 0 或負常數
        const a = signOf(node.left, spec, ctx);
        if (node.right.type === "num" && node.right.value <= 0) return a;
        return null;
      }
      case "neg": return null;
      default: return null;
    }
  }

  // 顯然的起點：lhs ≥ rhs 時，lhs − rhs 一看就非負。
  // 常見的寫法「√x + 2 ≥ 2」「a + b ≥ 0」「ab > 0」「(a − b)² ≥ 0」「|sin θ| ≤ 1」都在這裡。
  function isObviousStart(chain, spec, ctx) {
    if (chain.ops.length !== 1) return false;
    const op = chain.ops[0];
    let [lhs, rhs] = chain.exprs;
    if (op === "<=" || op === "<") [lhs, rhs] = [rhs, lhs];
    const strict = op === ">" || op === "<";
    if (op === "=" || op === "!=") return false;
    const key = (text) => compact(text);
    const bounded = (text) => /^(abs\(|\|)(sin|cos)\(.+\)(\)|\|)$/.test(key(text));
    // |sin θ| ≤ 1、1 ≥ |cos θ|（看原始方向，還沒交換）
    if (!strict && ((op === "<=" && key(chain.exprs[1]) === "1" && bounded(chain.exprs[0])) || (op === ">=" && key(chain.exprs[0]) === "1" && bounded(chain.exprs[1])))) return true;
    let tree;
    try { tree = parseTree(`(${lhs})-(${rhs})`); } catch (_error) { return false; }
    // (L) − (R)：R 是 0 就看 L；R 是常數 c 且 L 是「… + c」就把 c 消掉
    const simplify = (node) => {
      if (node.type === "sub" && node.right.type === "num" && node.right.value === 0) return node.left;
      if (node.type === "sub" && node.right.type === "num" && node.left.type === "add" && node.left.right.type === "num" && node.left.right.value === node.right.value) return node.left.left;
      if (node.type === "sub" && node.right.type === "num" && node.left.type === "add" && node.left.left.type === "num" && node.left.left.value === node.right.value) return node.left.right;
      return node;
    };
    const sign = signOf(simplify(tree), spec || {}, ctx || { constraints: [], vars: new Map(), currentCase: null });
    return strict ? sign === "pos" : Boolean(sign);
  }

  // 鏈的第一段（顯然起點只看它）
  function headOf(chain) {
    return { exprs: chain.exprs.slice(0, 2), ops: chain.ops.slice(0, 1) };
  }

  // 鏈的一端是不是已知的東西：前面出現過的式子、宣告過的變數、定義、抽象 atom、
  // 題目的目標兩邊、ε-δ 收尾的起點、歸納步驟 k+1 的左式、自訂函數代常數（g(0)）
  function anchored(spec, ctx, chain, evaluate) {
    if (overlapsKnown(spec, ctx, chain, evaluate)) return true;
    // 大小寫要分（S(k+1) 的 S、數列的 N）：這裡不用 compact，只去空白。
    // 實際踩過：這裡曾寫成 /s+/（少了反斜線），刪的是字母 s 不是空白 ——
    // 使用者不打空格的 |x-3| 就對不上假設裡的 |x − 3|，跟參考證明一模一樣卻標黃。
    const squeeze = (text) => normalize(text).replace(/\s+/g, "");
    const all = chain.exprs.map((expr) => squeeze(applyMacros(spec, expr, ctx)));
    const ends = [all[0], all[all.length - 1]];
    const names = new Set([...Object.keys(spec.vars || {}), ...ctx.vars.keys(), ...Object.keys(ctx.defs), ...(ctx.atoms ? ctx.atoms.keys() : [])]);
    // 中間的式子裡包著一個前面出現過的長式子（|x + 3| ≤ |x − 3| + 6 < 7 裡的 |x − 3|）
    const longKnown = knownExpressions(spec, ctx).map((expr) => squeeze(expr)).filter((expr) => expr.length >= 4);
    if (all.some((expr) => longKnown.some((known) => expr.includes(known)))) return true;
    const goalSides = [];
    if (spec.goal && spec.goal.relation) {
      const goal = splitChain(normalize(spec.goal.relation));
      if (goal) {
        goal.exprs.forEach((expr) => goalSides.push(expr));
        if (ctx.induction) {
          const variable = ctx.induction.variable || (spec.induction && spec.induction.variable) || "n";
          const kName = ctx.induction.k || "k";
          goal.exprs.forEach((expr) => goalSides.push(expr.replace(new RegExp(`\\b${variable}\\b`, "g"), `(${kName}+1)`)));
        }
      }
    }
    if (spec.bound && spec.bound.lhs) goalSides.push(normalize(spec.bound.lhs));
    const userFunctions = Object.keys(ctx.userFunctions || {});
    // 自訂函數代常數（g(0)）算已知——但 g(x) > g(0) 這種兩端都是同一個函數的鏈不算：
    // 那是單調性的結論，要靠「g 遞增」的事實接（groundStatement 的 monotone 規則）
    const callOf = (name, end) => new RegExp(`^${name}\\(`).test(end);
    const sameFunctionBothEnds = userFunctions.some((name) => ends.every((end) => callOf(name, end)));
    if (ends.some((end) => names.has(end) || (!sameFunctionBothEnds && userFunctions.some((name) => new RegExp(`^${name}\\([-0-9./pi]+\\)$`).test(end))))) return true;
    // 從目標的一邊出發推：只認多段鏈的第一個式子。單獨一句目標不是「從目標出發」，是直接寫答案
    if (chain.ops.length < 2) return false;
    // 第一段本身就是目標（2x ≤ x² + 1 = …）的話，不叫「從目標出發推」，叫先寫答案再湊
    if (goalMatches(spec, `${chain.exprs[0]} ${chain.ops[0]} ${chain.exprs[1]}`, ctx, evaluate)) return false;
    return goalSides.some((side) => squeeze(side) === all[0] || evaluate(side, all[0], "=", ctx).ok);
  }

  function knownExpressions(spec, ctx) {
    const known = [];
    (ctx.knownExprs || []).forEach((expr) => known.push(expr));
    Object.keys(ctx.defs).forEach((name) => { known.push(name); known.push(ctx.defs[name]); });
    ctx.constraints.forEach((item) => { known.push(item.lhs); known.push(item.rhs); });
    if (ctx.induction && ctx.induction.hypothesisText) {
      const hyp = splitChain(ctx.induction.hypothesisText);
      if (hyp) hyp.exprs.forEach((expr) => known.push(expr));
    }
    // 純數字（2、(1+1)/2+1）不算「前面出現過的東西」：任何式子都能等於某個數，那不是接上
    return known.filter((expr) => expr && /[A-Za-z_]/.test(expr));
  }

  // 這條鏈的某一邊在前面出現過（字面相同或數值相等）
  function overlapsKnown(spec, ctx, chain, evaluate) {
    const known = knownExpressions(spec, ctx);
    if (!known.length) return false;
    const ends = [chain.exprs[0], chain.exprs[chain.exprs.length - 1]].filter((expr) => /[A-Za-z_]/.test(expr));
    return ends.some((expr) => known.some((other) => compact(other) === compact(expr) || evaluate(other, expr, "=", ctx).ok));
  }

  // 跟某條條件（題目給的、假設、宣告、情況）等價：1 + h ≥ 0 之於 h ≥ −1
  function equivalentToConstraint(spec, ctx, chain, evaluate) {
    if (chain.ops.length !== 1 || chain.ops[0] === "=" || chain.ops[0] === "!=") return false;
    const active = ctx.constraints.filter((item) => (item.caseId === null || item.caseId === ctx.currentCase) && item.op !== "=" && item.op !== "!=");
    if (!active.length) return false;
    const saved = ctx.verifiedLinks;
    ctx.verifiedLinks = active.map((item) => ({ lhs: item.lhs, op: item.op, rhs: item.rhs }));
    let result = false;
    try { result = equivalentToKnown(spec, ctx, chain, evaluate); } finally { ctx.verifiedLinks = saved; }
    return result;
  }

  // 跟前面某條驗過的關係式等價：兩邊之差的正負在每個取樣點上一致
  function equivalentToKnown(spec, ctx, chain, evaluate) {
    return Boolean(equivalentLink(spec, ctx, chain, evaluate));
  }
  // 同上，但回傳對上的那條關係（給接地說明用）
  function equivalentLink(spec, ctx, chain, evaluate) {
    void evaluate;
    if (chain.ops.length !== 1) return null;
    const links = (ctx.verifiedLinks || []).filter((link) => link.op !== "=" && link.op !== "!=");
    if (!links.length || chain.ops[0] === "=" || chain.ops[0] === "!=") return null;
    const oriented = (lhs, op, rhs) => (op === ">" || op === ">=") ? `(${lhs})-(${rhs})` : `(${rhs})-(${lhs})`;
    const mine = oriented(chain.exprs[0], chain.ops[0], chain.exprs[1]);
    const scope = makeScope(spec, ctx);
    let mineFn;
    try { mineFn = compile(applyMacros(spec, mine, ctx), scope); } catch (_error) { return null; }
    const { samples } = drawSamples(spec, ctx, 120);
    if (!samples.length) return null;
    return links.find((link) => {
      let otherFn;
      try { otherFn = compile(applyMacros(spec, oriented(link.lhs, link.op, link.rhs), ctx), scope); } catch (_error) { return false; }
      // 差要成正比：a = k·b，k > 0 固定。移項、乘正數都是這樣；兩條剛好都成立的不等式不是
      let ratio = null;
      return samples.every((env) => {
        let a; let b;
        try { a = mineFn(env); b = otherFn(env); } catch (_error) { return false; }
        if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
        const tiny = 1e-9 * (1 + Math.abs(a) + Math.abs(b));
        if (Math.abs(b) < tiny) return Math.abs(a) < tiny;
        const current = a / b;
        if (ratio === null) { if (current <= 0) return false; ratio = current; return true; }
        return Math.abs(current - ratio) <= 1e-6 * (1 + Math.abs(ratio));
      });
    }) || null;
  }

  /* ── v2.2 接地：「是真的」和「是由前面推出來的」是兩件事 ─────────────
     數值引擎回答第一個問題；這一段回答第二個。每一句推導依序試：
       1. 直接引用：前面已經有一模一樣的關係
       2. 代數等價：跟前面某條關係移項／同乘正數之後一樣（equivalentToKnown）
       3. 改寫規則：|x−a|<r ⇔ a−r<x<a+r、A<B 且 B≤C ⇒ A<C、區間裡的界、三角不等式
       4. 定理字典（由 <定理>，…）—— 在 handleClaim 裡
       5. 只有數值成立、找不到來源 → 黃（不能綠）
     每一條登記過的關係都帶 provenance（哪一行、哪條規則、由哪幾條推出），
     報告會把它帶出去，畫面之後可以做「這一步從哪裡來」。 */

  function recordFact(ctx, link, line, provenance) {
    ctx.factLog = ctx.factLog || [];
    const id = `fact-${ctx.factLog.length + 1}`;
    ctx.factLog.push({ id, expr: `${link.lhs} ${link.op} ${link.rhs}`, lhs: link.lhs, op: link.op, rhs: link.rhs, line: line ? line.n : null, provenance: provenance || { kind: "verified", from: [] } });
    return id;
  }

  // 目前可以拿來當前提的關係：假設／題目條件（constraints，限這個情況）＋ 前面驗過的鏈
  function knownLinks(ctx) {
    const facts = [];
    ctx.constraints.forEach((item) => { if (item.caseId === null || item.caseId === ctx.currentCase) facts.push({ lhs: item.lhs, op: item.op, rhs: item.rhs }); });
    (ctx.verifiedLinks || []).forEach((link) => facts.push({ lhs: link.lhs, op: link.op, rhs: link.rhs }));
    return facts.filter((fact) => fact.op !== "=" && fact.op !== "!=");
  }

  const FLIP = { "<": ">", ">": "<", "<=": ">=", ">=": "<=", "=": "=", "!=": "!=" };
  const showLink = (link) => `${link.lhs} ${link.op} ${link.rhs}`;
  // 一律轉成「小 < 大」的方向，比對時不用管使用者寫 x > 2 還是 2 < x
  const orientLess = (link) => ((link.op === ">" || link.op === ">=") ? { lhs: link.rhs, op: FLIP[link.op], rhs: link.lhs } : link);

  // |v − a| < r（或 |v + a|、|v|、abs(…)）→ { variable, center, radius, op }
  function absOfLinear(link) {
    const oriented = orientLess(link);
    if (oriented.op !== "<" && oriented.op !== "<=") return null;
    const inner = compact(oriented.lhs).match(/^(?:\|(.+)\||abs\((.+)\))$/);
    if (!inner) return null;
    const body = inner[1] || inner[2];
    const m = body.match(/^([a-z_]\w*)(?:([+-])(.+))?$/);
    if (!m || MATH_FUNCTIONS[m[1]] || CONSTANTS[m[1]] !== undefined) return null;
    const center = !m[2] ? "0" : (m[2] === "-" ? m[3] : `-(${m[3]})`);
    return { variable: m[1], center, radius: oriented.rhs, op: oriented.op };
  }

  const TRANSFORMATIONS = [
    { id: "abs_interval", title: "|x−a| < r ⇔ a−r < x < a+r", explain: "|x−a|<r ⇔ a−r<x<a+r（≤ 也一樣）" },
    { id: "transitive", title: "A < B 且 B ≤ C ⇒ A < C", explain: "把前面兩條關係串起來" },
    { id: "interval_bound", title: "a < x < b 時 E(x) 的界", explain: "x 只在這個區間裡動，E(x) 的範圍就算得出來" },
    { id: "triangle", title: "|a+b| ≤ |a|+|b|", explain: "三角不等式（不用特別寫「由三角不等式」）" },
    { id: "derivative", title: "g′(x) = …（g 是你令的函數）", explain: "自己令的 g，g′ 與 g″ 由定義數值微分驗；寫出 g'(x) = e^x − 1 就會對" },
    { id: "monotone", title: "g 遞增且 a > b ⇒ g(a) > g(b)", explain: "先立住「g 在 … 上遞增」（要有對所有 x 的 g'(x) > 0），比大小就接得上" }
  ];
  // 鏈的某一邊是不是「自訂函數的導數」：g'(x)、g''(t)
  function derivativeCallOf(ctx, text) {
    const m = compact(text).match(/^([a-z_]\w*)('+)\((.+)\)$/);
    return m && ctx.userFunctions && ctx.userFunctions[m[1]] ? { name: m[1], order: m[2].length, arg: m[3] } : null;
  }
  // 兩邊是同一個函數（自訂或抽象）代不同的東西：g(a) 與 g(b)
  function sameFunctionCall(text) {
    const m = compact(text).match(/^([a-z_]\w*)\((.+)\)$/);
    return m ? { name: m[1], arg: m[2] } : null;
  }

  // 這一條鏈是不是由前面的關係經一條改寫規則得到。回傳 { rule, from: [關係], note, exact } 或 null
  function groundTransformation(spec, ctx, chain, evaluate) {
    const facts = knownLinks(ctx);
    if (!facts.length) return null;
    const same = (a, b) => compact(a) === compact(b) || evaluate(a, b, "=", ctx).ok;
    const links = chain.ops.map((op, i) => ({ lhs: chain.exprs[i], op, rhs: chain.exprs[i + 1] })).map(orientLess);
    if (links.some((link) => link.op === "=" || link.op === "!=")) return null;
    const numeric = (expr) => { try { const fn = compile(applyMacros(spec, expr, ctx), makeScope(spec, ctx)); const value = fn({}); return Number.isFinite(value) ? value : null; } catch (_error) { return null; } };

    // 3a. 絕對值 ⇔ 區間。目標可以是「a−r < x < a+r」整條，也可以只寫一半（x < a+r）
    //     常數更寬（|x−3|<1 之後寫 1 < x < 5）算「由目前條件推出」，不算等價改寫
    for (const fact of facts) {
      const abs = absOfLinear(fact);
      if (!abs) continue;
      if (!evaluate(abs.radius, "0", ">", ctx).ok) continue;
      const lo = `(${abs.center})-(${abs.radius})`;
      const hi = `(${abs.center})+(${abs.radius})`;
      let exact = true;
      const covered = links.every((link) => {
        const lower = compact(link.rhs) === abs.variable && !same(link.lhs, abs.variable);
        const upper = compact(link.lhs) === abs.variable && !same(link.rhs, abs.variable);
        if (!lower && !upper) return false;
        const bound = lower ? link.lhs : link.rhs;
        const derived = lower ? lo : hi;
        if (implies(abs.op, link.op) && same(bound, derived)) return true;
        // 更寬的常數界：數字對數字比
        const target = numeric(bound); const mine = numeric(derived);
        if (target === null || mine === null) return false;
        if (lower ? target < mine : target > mine) { exact = false; return true; }
        return false;
      });
      if (covered) {
        const interval = `${lo} < ${abs.variable} < ${hi}`.replace(/\(([^()]+)\)/g, "$1");
        return {
          rule: "abs_interval", from: [showLink(fact)], exact,
          note: exact ? `由 ${showLink(fact)} 可得 ${chain.exprs.join(` ${chain.ops[0]} `)}（|x−a|<r ⇔ a−r<x<a+r）。`
            : `由 ${showLink(fact)} 可得 ${interval}，所以 ${chain.exprs.join(` ${chain.ops[0]} `)} 也成立（由目前條件推出，不是等價改寫）。`
        };
      }
    }
    if (links.length !== 1) return null;
    const [target] = links;

    // 3b. 傳遞：A < B、B ≤ C ⇒ A < C（中間的 B 要一模一樣或數值相等）
    for (const first of facts.map(orientLess)) {
      if (!same(first.lhs, target.lhs)) continue;
      for (const second of facts.map(orientLess)) {
        if (second === first || !same(second.rhs, target.rhs) || !same(first.rhs, second.lhs)) continue;
        const composed = (first.op === "<" || second.op === "<") ? "<" : "<=";
        if (implies(composed, target.op)) {
          return { rule: "transitive", from: [showLink(first), showLink(second)], exact: true, note: `由 ${showLink(first)} 與 ${showLink(second)} 可得 ${showLink(target)}。` };
        }
      }
    }

    // 3c. 三角不等式：|A + B| ≤ |A| + |B|、|A| ≤ |A − B| + |B|（形狀對、數值也對）
    const bars = (text) => compact(text).match(/^(?:\|(.+)\||abs\((.+)\))$/);
    const lhsAbs = bars(target.lhs);
    const rhsParts = compact(target.rhs).match(/^(\|[^|]+\||abs\([^()]+\))\+(\|[^|]+\||abs\([^()]+\))$/);
    if (lhsAbs && rhsParts && target.op === "<=") {
      const p = bars(rhsParts[1]); const q = bars(rhsParts[2]);
      const inside = (m) => m[1] || m[2];
      if (p && q && (same(inside(lhsAbs), `(${inside(p)})+(${inside(q)})`) || same(inside(lhsAbs), `(${inside(p)})-(${inside(q)})`) || same(inside(lhsAbs), `(${inside(q)})+(${inside(p)})`))) {
        return { rule: "triangle", from: [], exact: true, note: `使用三角不等式 |a+b| ≤ |a|+|b|。` };
      }
    }

    // 3d. 區間裡的界：x 已經被夾在 a < x < b（前面寫的，或由 |x−a|<r 來），目標 E(x) < c、E(x) > c、|E(x)| < c
    //     只有一個變數在動；把它在區間上掃一遍，界都對就算「由目前條件推出」
    const names = new Set([...ctx.vars.keys(), ...Object.keys(spec.vars || {})]);
    const identifiers = Array.from(new Set((compact(replaceBars(`${target.lhs}+${target.rhs}`)).match(/[a-z_]\w*'*/g) || []).filter((name) => !MATH_FUNCTIONS[name] && CONSTANTS[name] === undefined && names.has(name) && ctx.defs[name] === undefined)));
    if (identifiers.length === 1) {
      const v = identifiers[0];
      const intervals = [];
      facts.forEach((fact) => {
        const abs = absOfLinear(fact);
        if (abs && abs.variable === v && evaluate(abs.radius, "0", ">", ctx).ok) intervals.push({ lo: `(${abs.center})-(${abs.radius})`, hi: `(${abs.center})+(${abs.radius})`, from: [showLink(fact)] });
      });
      const lows = facts.map(orientLess).filter((fact) => compact(fact.rhs) === v && !/[a-z_]/i.test(compact(fact.lhs).replace(/^(pi|e)$/, "")));
      const highs = facts.map(orientLess).filter((fact) => compact(fact.lhs) === v && !/[a-z_]/i.test(compact(fact.rhs).replace(/^(pi|e)$/, "")));
      lows.forEach((low) => highs.forEach((high) => intervals.push({ lo: low.lhs, hi: high.rhs, from: [showLink(low), showLink(high)] })));
      for (const interval of intervals) {
        const lo = numeric(interval.lo); const hi = numeric(interval.hi);
        if (lo === null || hi === null || !(lo < hi)) continue;
        let left; let right;
        try { const scope = makeScope(spec, ctx); left = compile(applyMacros(spec, target.lhs, ctx), scope); right = compile(applyMacros(spec, target.rhs, ctx), scope); } catch (_error) { continue; }
        const { samples } = drawSamples(spec, ctx, 24);
        const base = samples.length ? samples : [{}];
        let holds = true; let checked = 0;
        for (const env of base) {
          for (let k = 0; k <= 32 && holds; k += 1) {
            const point = Object.assign({}, env, { [v]: lo + (hi - lo) * (k / 32) });
            let a; let b;
            try { a = left(point); b = right(point); } catch (_error) { holds = false; break; }
            if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
            checked += 1;
            if (!RELATION_TEST[target.op](a, b)) holds = false;
          }
          if (!holds) break;
        }
        if (holds && checked) {
          return { rule: "interval_bound", from: interval.from, exact: false, note: `由 ${interval.from.join(" 與 ")} 可推出 ${showLink(target)}（${v} 在 ${round(lo)} 到 ${round(hi)} 之間掃過都成立）。` };
        }
      }
    }
    return null;
  }

  // 這一段是不是「同一個自訂函數比大小」：g(x) > g(0)。是的話它的理由只能是單調性（或前面已經推出它）
  function comparesSameUserFunction(ctx, seg) {
    if (seg.op === "=" || seg.op === "!=") return null;
    const left = sameFunctionCall(seg.lhs); const right = sameFunctionCall(seg.rhs);
    if (!left || !right || left.name !== right.name || !ctx.userFunctions) return null;
    const name = Object.keys(ctx.userFunctions).find((k) => k.toLowerCase() === left.name);
    return name ? { name, left, right } : null;
  }
  function groundMonotone(spec, ctx, seg, evaluate) {
    const cmp = comparesSameUserFunction(ctx, seg);
    const fact = cmp && ctx.monotone ? ctx.monotone[cmp.name] : null;
    if (!fact) return null;
    const bigger = (seg.op === ">" || seg.op === ">=") ? [cmp.left.arg, cmp.right.arg] : [cmp.right.arg, cmp.left.arg];
    const argOrder = fact.kind === "increasing" ? bigger : [bigger[1], bigger[0]];
    const strictOk = fact.strict || seg.op === ">=" || seg.op === "<=";
    if (!strictOk || !evaluate(argOrder[0], argOrder[1], ">", ctx).ok) return null;
    const word = fact.kind === "increasing" ? "遞增" : "遞減";
    return { kind: "rule", rule: "monotone", from: [`${cmp.name} ${word}`, `${argOrder[0]} > ${argOrder[1]}`], exact: true, note: `${cmp.name} ${word}且 ${argOrder[0]} > ${argOrder[1]}，所以 ${seg.lhs} ${seg.op} ${seg.rhs}。` };
  }

  // 依優先序找這一句的來源：直接引用 → 代數等價 → 改寫規則。回傳 { kind, rule, from, note, exact } 或 null
  function groundStatement(spec, ctx, chain, evaluate) {
    const same = (a, b) => compact(a) === compact(b) || evaluate(a, b, "=", ctx).ok;
    // v2.4 導數：g'(x) = … 的等式段（g 是自訂函數）——右邊是不是 g′ 由數值微分驗過了（verifyChain 已驗），這裡給來源
    const derivativeSeg = chain.ops.map((op, i) => ({ op, lhs: chain.exprs[i], rhs: chain.exprs[i + 1] }))
      .find((seg) => seg.op === "=" && (derivativeCallOf(ctx, seg.lhs) || derivativeCallOf(ctx, seg.rhs)));
    if (derivativeSeg) {
      const d = derivativeCallOf(ctx, derivativeSeg.lhs) || derivativeCallOf(ctx, derivativeSeg.rhs);
      return { kind: "rule", rule: "derivative", from: [`${d.name}(${ctx.userFunctions[d.name].param}) = ${ctx.userFunctions[d.name].body}`], exact: true, note: `${d.name}${"′".repeat(d.order)}(${d.arg}) 由 ${d.name} 的定義數值微分驗過，「${chain.exprs.map((expr, i) => (i ? `${chain.ops[i - 1]} ${expr}` : expr)).join(" ")}」在取樣點上成立。` };
    }
    // v2.4 單調：g(a) > g(b)（前面立住 g 遞增、而且 a > b 在目前條件下成立）
    if (chain.ops.length === 1) {
      const mono = groundMonotone(spec, ctx, { lhs: chain.exprs[0], op: chain.ops[0], rhs: chain.exprs[1] }, evaluate);
      if (mono) return mono;
    }
    if (chain.ops.length === 1) {
      const mine = orientLess({ lhs: chain.exprs[0], op: chain.ops[0], rhs: chain.exprs[1] });
      const direct = knownLinks(ctx).map(orientLess).find((fact) => implies(fact.op, mine.op) && same(fact.lhs, mine.lhs) && same(fact.rhs, mine.rhs));
      if (direct) return { kind: "direct", rule: null, from: [showLink(direct)], exact: true, note: `「${showLink(direct)}」前面已經有了。` };
      const equivalent = equivalentLink(spec, ctx, chain, evaluate);
      if (equivalent) return { kind: "equivalence", rule: "algebra", from: [showLink(equivalent)], exact: true, note: `跟前面的「${showLink(equivalent)}」等價（移項或同乘正數）。` };
    }
    const transformed = groundTransformation(spec, ctx, chain, evaluate);
    if (transformed) return Object.assign({ kind: "rule" }, transformed);
    return null;
  }

  // 跨行的鏈：上一行結尾 = 這一行開頭 → 接起來
  function extendRun(spec, ctx, chain, evaluate) {
    const first = chain.exprs[0];
    const last = chain.exprs[chain.exprs.length - 1];
    const previous = ctx.run;
    if (previous && previous.caseId === ctx.currentCase && (compact(previous.last) === compact(first) || evaluate(previous.last, first, "=", ctx).ok)) {
      ctx.run = { first: previous.first, last, ops: previous.ops.concat(chain.ops), caseId: ctx.currentCase };
    } else {
      ctx.run = { first, last, ops: chain.ops.slice(), caseId: ctx.currentCase };
    }
    return ctx.run;
  }

  // 骨架到齊了沒：對上目標的那一句，靠的是骨架而不是它自己
  function skeletonReady(spec, ctx) {
    const skeleton = spec.skeleton || "direct";
    if (skeleton === "induction") return Boolean(ctx.skeleton.base && ctx.skeleton.hypothesis && ctx.skeleton.step);
    if (skeleton === "epsilon-delta") return Boolean(ctx.skeleton.let && ctx.skeleton.define && ctx.skeleton.assume && ctx.skeleton.bound);
    if (skeleton === "contradiction") return Boolean(ctx.skeleton.contradictionClosed);
    // 分情況：這一段要有自己的條件（情況一：x ≥ 0 —— 條件本身就是證人）或推過一條鏈，
    // 才能下結論；「情況二：否則」什麼都沒推就寫結論，不算
    if (skeleton === "cases") {
      if (ctx.currentCase === null) return false;
      const entry = ctx.cases[ctx.currentCase];
      const ownCondition = entry && !entry.otherwise && Boolean(splitChain(entry.condition || ""));
      return ownCondition || Boolean(ctx.caseChains && ctx.caseChains.has(ctx.currentCase));
    }
    return false;
  }

  function rememberChain(ctx, chain) {
    ctx.knownExprs = ctx.knownExprs || [];
    chain.exprs.forEach((expr) => ctx.knownExprs.push(expr));
    // A ≤ B ≤ C 這種兩邊夾住的鏈：夾擠定理的前提
    if (chain.ops.length >= 2 && chain.ops.every((op) => op === "<=" || op === "<")) ctx.hasSandwich = true;
  }

  // 定理的前提有沒有在前面出現過。relation 是引用定理的那一句（用來抓函數名字）。
  function ruleRequirementsMet(rule, ctx, relation) {
    if (!rule || !rule.requires) return true;
    return !ruleRequirementMissing(rule, ctx, relation);
  }

  function ruleRequirementMissing(rule, ctx, relation) {
    if (!rule || !rule.requires) return "";
    const fnName = (() => {
      const match = String(relation || "").match(/([A-Za-z]\w*)'*\(/);
      return match ? match[1] : "f";
    })();
    const has = (kind) => ctx.textFacts && (ctx.textFacts.has(`${kind}:${fnName}`)
      || (kind === "continuous" && (ctx.textFacts.has(`polynomial:${fnName}`) || ctx.textFacts.has(`differentiable:${fnName}`) || ctx.textFacts.has(`twice-differentiable:${fnName}`)))
      || (kind === "differentiable" && (ctx.textFacts.has(`polynomial:${fnName}`) || ctx.textFacts.has(`twice-differentiable:${fnName}`))));
    const signChange = () => {
      const signs = new Set((ctx.verifiedLinks || []).map((link) => {
        if ((link.rhs === "0" && link.op === "<") || (link.lhs === "0" && link.op === ">")) return -1;
        if ((link.rhs === "0" && link.op === ">") || (link.lhs === "0" && link.op === "<")) return 1;
        return 0;
      }));
      return signs.has(1) && signs.has(-1);
    };
    if (rule.requires === "sandwich") return ctx.hasSandwich ? "" : "前面還沒有把它夾住的鏈（A ≤ B ≤ C 那一行）";
    // 微積分基本定理：I(b) − I(a) = ∫_a^b I′，前面要先算出 I′（I'(p) = … 那一行）
    if (rule.requires === "derivative") {
      const head = new RegExp("^" + fnName.toLowerCase() + "'\\(");
      const seen = (ctx.verifiedLinks || []).some((link) => head.test(compact(link.lhs)) || head.test(compact(link.rhs)));
      return seen ? "" : `前面還沒算出 ${fnName}′（先寫一行 ${fnName}'(…) = …）`;
    }
    if (rule.requires === "differentiable") return has("differentiable") ? "" : `前面沒說 ${fnName} 可微（題目給了就寫「因為 ${fnName} 可微」，或它是多項式）`;
    if (rule.requires === "continuous") return has("continuous") ? "" : `前面沒說 ${fnName} 連續`;
    if (rule.requires === "twice-differentiable") return has("twice-differentiable") ? "" : `前面沒說 ${fnName} 二次可微（題目給了就寫「因為 ${fnName} 二次可微」）`;
    if (rule.requires === "ivt") {
      if (!has("continuous")) return `前面沒說 ${fnName} 連續（多項式可以寫「因為 ${fnName} 是多項式，所以 ${fnName} 連續」）`;
      if (!signChange()) return `前面還沒驗出兩端異號（${fnName}(a) < 0 與 ${fnName}(b) > 0 各一行）`;
      return "";
    }
    return "";
  }

  // 存在句：由 <定理>，存在 c ∈ (a, b) 使 <關係式>。
  // c 變成一個在 (a, b) 裡取樣的變數，關係式登記成條件（抽象 atom 的等式會解成定義）；
  // 解不了、抽不到點的等式（g(c) = 0 這種）就只記成「主張過的關係」，之後字面或等價地引用它才算。
  const EXISTENTIAL = /^(存在|有|there\s+(?:exists|is)(?:\s+an?|\s+some)?|exists?|for\s+some)\s+([A-Za-z_]\w*)\s*(?:in\s*([\(\[])\s*([^,]+?)\s*,\s*([^\)\]]+?)\s*([\)\]]))?\s*,?\s*(使得|使|滿足|such\s+that|with|so\s+that|s\.t\.|where)\s*(.+)$/i;

  function handleExistential(spec, ctx, match, rule, evaluate) {
    const name = match[2];
    const relation = match[8];
    const notes = [];
    if (!ctx.defs[name]) ctx.vars.set(name, ctx.vars.get(name) || {});
    if (match[4] !== undefined) {
      const lo = applyMacros(spec, match[4], ctx);
      const hi = applyMacros(spec, match[5], ctx);
      registerRelation(spec, ctx, lo, name, match[3] === "[" ? "<=" : "<", ctx.currentCase);
      registerRelation(spec, ctx, name, hi, match[6] === "]" ? "<=" : "<", ctx.currentCase);
      notes.push(`${name} 在 ${match[3]}${match[4]}, ${match[5]}${match[6]} 裡取樣。`);
    }
    const chain = splitChain(relation);
    if (!chain) {
      return { status: "unsure", note: `存在 ${name}，但「${relation}」不是關係式，我只能當文字。`, results: [] };
    }
    let status = "ok";
    const shapeHit = rule && rule.shapes && rule.shapes.some((shape) => shape.test(shapeKey(relation)));
    const missing = rule ? ruleRequirementMissing(rule, ctx, relation) : "";
    if (!rule) {
      status = "unsure";
      notes.push(`存在句要靠定理：寫成「由 <定理>，存在 ${name} 使 …」我才知道它從哪來。先當你是對的。`);
    } else if (rule.id === "unknown") {
      status = "unsure";
      notes.push(`「${rule.names[0]}」不在我的規則字典裡，存在 ${name} 這件事先當你是對的。`);
    } else if (missing) {
      status = "unsure";
      notes.push(`引用${rule.names[0]}，但${missing}。`);
    } else if (!shapeHit) {
      status = "unsure";
      notes.push(`引用${rule.names[0]}，但「${relation}」跟它的形狀對不上，先當你是對的。`);
    } else {
      notes.push(`由${rule.names[0]}得到 ${name}，「${relation}」登記成條件。`);
    }
    // 登記關係式；解不了又抽不到點的等式退回「主張過的關係」
    const before = ctx.constraints.length;
    const added = [];
    for (let i = 0; i < chain.ops.length; i += 1) {
      const lhs = applyMacros(spec, chain.exprs[i], ctx);
      const rhs = applyMacros(spec, chain.exprs[i + 1], ctx);
      ctx.asserted.push({ lhs, op: chain.ops[i], rhs });
      let compiles = true;
      try { compile(lhs, makeScope(spec, ctx)); compile(rhs, makeScope(spec, ctx)); } catch (_error) { compiles = false; }
      if (!compiles) {
        if (status === "ok") { status = "unsure"; notes.push(`「${chain.exprs[i]} ${chain.ops[i]} ${chain.exprs[i + 1]}」含我算不了的符號，之後只認字面引用。`); }
        continue;
      }
      const solved = registerRelation(spec, ctx, lhs, rhs, chain.ops[i], ctx.currentCase);
      if (solved) added.push(solved.name);
    }
    const probe = drawSamples(spec, ctx, 20);
    if (!probe.samples.length) {
      ctx.constraints.length = before;
      added.forEach((defName) => { delete ctx.defs[defName]; ctx.vars.set(defName, {}); });
      notes.push(`（這條關係式抽不到點，之後只認字面或等價的引用。）`);
    }
    rememberChain(ctx, chain);
    return { status, note: notes.join(" "), results: [] };
  }

  /* ── v2.3 全稱條件的實例化 ─────────────────────────────────────
     題目說「對所有點 |f'(_)| ≤ 2」；定理產生的 c 也是一個點，使用者寫「|f'(c)| ≤ 2」
     就是拿題目的條件來用——不該到了 c 身上又重新抽籤決定一次。
       - 佔位符 _ 是一個「式子的洞」：c、x+y、(x+y)/2 都可以；同一個 _ 要配同一個式子
       - 方向要一樣（允許左右對調寫）；|…| 與 abs(…) 視為同一寫法；比對用 shapeKey
       - abs(X) ≤ r 與「X ≤ r 且 X ≥ −r」是同一件事：登記時兩種形式都展開，
         題目寫哪一種、使用者寫哪一種都對得上
       - 對上之後：登記成取樣條件（atom 不再自由抽）、驗過的關係、帶 universal 來源的事實 */
  const absInner = (text) => {
    const key = shapeKey(text);
    const m = key.match(/^abs\((.+)\)$/);
    if (!m) return null;
    let depth = 0;
    for (const ch of m[1]) { if (ch === "(") depth += 1; else if (ch === ")") { depth -= 1; if (depth < 0) return null; } }
    return depth === 0 ? m[1] : null;
  };
  function expandUniversals(all) {
    const items = all.filter((item) => !item.expanded);
    const out = items.map((item) => Object.assign({ sourceExpr: item.text }, item));
    // −r 寫成使用者會寫的樣子：2 → -2、a → -a、a+b → -(a+b)、-2 → 2（鍵要對得上，不能多一層括號）
    const negOf = (text) => { const k = shapeKey(text); if (/^-/.test(k)) return k.slice(1); return /^[a-z0-9.']+$/.test(k) ? `-${k}` : `-(${k})`; };
    items.forEach((item) => {
      // abs(X) <= r（或 r >= abs(X)）→ X <= r、X >= -r
      const oriented = (item.op === ">=" || item.op === ">") ? { lhs: item.rhs, op: FLIP[item.op], rhs: item.lhs } : item;
      if (oriented.op !== "<=" && oriented.op !== "<") return;
      const inner = absInner(oriented.lhs);
      if (!inner) return;
      out.push({ lhs: inner, op: oriented.op, rhs: oriented.rhs, text: item.text, sourceExpr: item.sourceExpr || item.text, domain: item.domain, expanded: true });
      out.push({ lhs: inner, op: FLIP[oriented.op], rhs: negOf(oriented.rhs), text: item.text, sourceExpr: item.sourceExpr || item.text, domain: item.domain, expanded: true });
    });
    // X <= r 且 X >= -r → abs(X) <= r
    items.forEach((upper) => {
      const u = (upper.op === ">=" || upper.op === ">") ? { lhs: upper.rhs, op: FLIP[upper.op], rhs: upper.lhs } : upper;
      if (u.op !== "<=" && u.op !== "<") return;
      const lower = items.find((other) => {
        const l = (other.op === "<=" || other.op === "<") ? { lhs: other.rhs, op: FLIP[other.op], rhs: other.lhs } : other;
        return other !== upper && l.op === FLIP[u.op] && shapeKey(l.lhs) === shapeKey(u.lhs) && shapeKey(l.rhs) === shapeKey(negOf(u.rhs));
      });
      if (lower && (upper.domain || null) === (lower.domain || null)) out.push({ lhs: `abs(${u.lhs})`, op: u.op, rhs: u.rhs, text: `${upper.text}、${lower.text}`, sourceExpr: `${upper.sourceExpr || upper.text}、${lower.sourceExpr || lower.text}`, domain: upper.domain, expanded: true });
    });
    return out;
  }
  // 回傳 { item, substitution: { _: 式子 }, text } 或 null
  function matchUniversal(ctx, chain, evaluate) {
    if (chain.ops.length !== 1) return null;
    const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const key = (lhs, op, rhs) => `${shapeKey(lhs)}${op}${shapeKey(rhs)}`;
    const candidates = [
      key(chain.exprs[0], chain.ops[0], chain.exprs[1]),
      key(chain.exprs[1], FLIP[chain.ops[0]], chain.exprs[0])
    ];
    for (const item of ctx.universal || []) {
      const pieces = key(item.lhs, item.op, item.rhs).split("_");
      if (pieces.length < 2) continue;
      let pattern = "^" + escape(pieces[0]);
      for (let i = 1; i < pieces.length; i += 1) pattern += (i === 1 ? "([a-z0-9+\\-*/^().']+?)" : "\\1") + escape(pieces[i]);
      const re = new RegExp(pattern + "$");
      for (const mine of candidates) {
        const hit = mine.match(re);
        if (!hit) continue;
        // 全稱主張帶 domain（對所有 x > 0）：代進去的東西要在 domain 裡，用取樣驗；驗不了就不算
        if (item.domain && evaluate) {
          const cond = splitChain(item.domain.replace(/_/g, `(${hit[1]})`));
          if (!cond) continue;
          let inside = true;
          for (let i = 0; i < cond.ops.length && inside; i += 1) inside = evaluate(cond.exprs[i], cond.exprs[i + 1], cond.ops[i], ctx).ok;
          if (!inside) continue;
        }
        return { item, substitution: { _: hit[1] }, text: item.text, sourceExpr: item.sourceExpr || item.text };
      }
    }
    return null;
  }

  // 這條鏈是不是前面某個存在句給的關係（字面或數值等價）
  function matchesAsserted(spec, ctx, chain, evaluate) {
    if (chain.ops.length !== 1 || !ctx.asserted.length) return false;
    const lhs = applyMacros(spec, chain.exprs[0], ctx);
    const rhs = applyMacros(spec, chain.exprs[1], ctx);
    const op = chain.ops[0];
    const flipped = { "<": ">", ">": "<", "<=": ">=", ">=": "<=", "=": "=", "!=": "!=" };
    const same = (a, b) => compact(a) === compact(b) || evaluate(a, b, "=", ctx).ok;
    // 移項過的寫法也算同一條：g(c) = 0 登記過，之後寫 cos c = c（即 cos c − c = 0）也認得
    const diff = (a, b) => `(${a})-(${b})`;
    const rearranged = (item) =>
      (item.op === op && evaluate(diff(lhs, rhs), diff(item.lhs, item.rhs), "=", ctx).ok)
      || (item.op === flipped[op] && evaluate(diff(lhs, rhs), `-(${diff(item.lhs, item.rhs)})`, "=", ctx).ok);
    return ctx.asserted.some((item) =>
      (item.op === op && same(item.lhs, lhs) && same(item.rhs, rhs))
      || (item.op === flipped[op] && same(item.lhs, rhs) && same(item.rhs, lhs))
      || rearranged(item));
  }

  // ε-δ 的門檻變數：函數極限是 δ，數列極限是 N（spec.bound.threshold）
  function thresholdName(spec) {
    return (spec.bound && spec.bound.threshold) ? normalize(spec.bound.threshold) : "delta";
  }

  function cloneCtx(ctx) {
    return {
      ...ctx,
      vars: new Map(ctx.vars),
      defs: { ...ctx.defs },
      constraints: ctx.constraints.slice(),
      facts: ctx.facts.slice()
    };
  }

  function summarize(spec, ctx, report, lines) {
    const counts = { ok: 0, unsure: 0, error: 0 };
    report.forEach((item) => { counts[item.status] += 1; });
    const missing = [];
    const skeleton = spec.skeleton || "direct";
    if (skeleton === "epsilon-delta") {
      const sequence = thresholdName(spec) !== "delta";
      if (!ctx.skeleton.let) missing.push("任取 ε > 0");
      if (!ctx.skeleton.define) missing.push(sequence ? "取 N = …（用 ε 表示）" : "取 δ = …（用 ε 表示）");
      if (!ctx.skeleton.assume) missing.push(sequence ? "假設 n > N" : "假設 0 < |x − a| < δ");
      if (!ctx.skeleton.bound) missing.push(sequence ? "推出 |a_n − L| < ε 的鏈" : "推出 |f(x) − L| < ε 的鏈");
    }
    if (skeleton === "induction") {
      if (!ctx.skeleton.base) missing.push("基底：當 n = 1 時 … 成立");
      if (!ctx.skeleton.hypothesis) missing.push("歸納假設：假設 n = k 時成立");
      if (!ctx.skeleton.step) missing.push("歸納步驟：n = k+1 的推導鏈");
    }
    if (skeleton === "cases") {
      if (!ctx.cases.length) missing.push("至少兩個「情況」");
      if (ctx.cases.length && !ctx.skeleton.casesClosed) missing.push("情況都走完之後的總結句（故 …）");
      ctx.cases.forEach((entry) => { if (!ctx.goalDoneInCases.has(entry.id)) missing.push(`情況 ${entry.label} 沒有走到目標`); });
      if (ctx.casesDeclared && ctx.cases.length < ctx.casesDeclared) missing.push(`宣告了 ${ctx.casesDeclared} 種情況，只寫了 ${ctx.cases.length} 種`);
    }
    if (skeleton === "contradiction") {
      if (!ctx.contradiction) missing.push("反設 …");
      if (!ctx.skeleton.contradictionClosed) missing.push("推出矛盾");
    }
    if (!ctx.goalDone) missing.push(skeleton === "contradiction" ? "矛盾之後的結論（故 …）" : "一句對上目標的結論（故／所以 …）");

    let verdict;
    if (!lines.length) verdict = "empty";
    else if (counts.error) verdict = "broken";
    else if (missing.length) verdict = "incomplete";
    else if (counts.unsure) verdict = "partial";
    else verdict = "verified";
    const firstError = report.find((item) => item.status === "error");
    const verdictText = {
      empty: "還沒寫。",
      broken: `第 ${firstError ? firstError.n : "?"} 行過不了檢查。`,
      incomplete: `結構還缺：${missing.join("；")}。`,
      partial: `每一句都讀得懂，但有 ${counts.unsure} 句我驗不了（標黃的那幾句請自己確認）。`,
      verified: "每一步都通過了檢查：代數鏈在取樣點上成立、規則形狀對得上、骨架完整。"
    }[verdict];
    return { lines: report, counts, missing, verdict, verdictText, goalDone: ctx.goalDone };
  }

  /* ── 速查表：給題庫頁與編輯器印的「我支援什麼」 ───────────────────
     句型的關鍵字與例句、定理的寫法與前提、文字事實、符號寫法。
     定理清單由 RULES 帶出來（別名不會漂），只有「寫法／前提」是手寫的；
     validate_proof_lang 會擋：每一個句型 kind、每一條規則 id 都要在這裡有一列。 */
  const CHEAT_SYNTAX = [
    { kind: "let", label: "引入變數", keywords: "任取、任意取、給定、固定、設、令、取、let、fix、choose", example: "任取 ε > 0。／取 δ = ε/3。／設 g(x) = cos x − x。" },
    { kind: "assume", label: "假設條件", keywords: "假設、若、如果、suppose、assume；可接「則 …」", example: "假設 0 < |x − 2| < δ。" },
    { kind: "claim", label: "推導一條鏈", keywords: "則、那麼、得、所以、故、因此、於是、即、然後、同理、展開得、整理得、化簡得", example: "則 |3x − 6| = 3|x − 2| < 3δ = ε。" },
    { kind: "by", label: "引用定理", keywords: "由、根據、依據、利用、by、using；定理名後接逗號再接結論", example: "由均值定理，存在 c ∈ (a, b) 使 f(b) − f(a) = f'(c)(b − a)。" },
    { kind: "forall", label: "全稱主張", keywords: "對所有 <條件>，<主張>；當 … 時，…；for all …, …；主張 for all …", example: "對所有 x > 0，g'(x) = e^x − 1 > 0。" },
    { kind: "because", label: "因為…所以…", keywords: "因為 …，所以／故／因此 …；前提要是前面立住的東西", example: "因為 δ ≤ 1，所以 |x + 3| ≤ |x − 3| + 6 < 7。" },
    { kind: "induction", label: "宣告歸納法", keywords: "用數學歸納法、對 n 做歸納、by induction on n", example: "用數學歸納法。" },
    { kind: "base", label: "歸納基底", keywords: "當 n = 1 時 …", example: "當 n = 1 時，左式 = 1 = 右式，成立。" },
    { kind: "hypothesis", label: "歸納假設", keywords: "假設 n = k 時成立", example: "假設 n = k 時成立。" },
    { kind: "cases", label: "宣告分情況", keywords: "分兩種情況、考慮三種情況", example: "分兩種情況。" },
    { kind: "case", label: "情況 N", keywords: "情況一：條件；情況二：否則（＝前面情況的補集）", example: "情況一：x ≥ 0。" },
    { kind: "contradiction-start", label: "反設", keywords: "反設、假設不然、假設結論不成立、suppose not", example: "反設 m 是最大的正整數。" },
    { kind: "contradiction", label: "得出矛盾", keywords: "… 矛盾、a contradiction", example: "這與 m 是最大的矛盾。" },
    { kind: "qed", label: "收尾", keywords: "得證、證畢、證明完畢、Q.E.D.、■", example: "得證。" }
  ];
  const CHEAT_RULE_NOTES = {
    triangle: { form: "|a + b| ≤ |a| + |b|" },
    mvt: { form: "f(b) − f(a) = f'(c)(b − a)，c 在 a、b 之間", requires: "f 可微（先寫「f 可微」或「f 是多項式」）" },
    taylor: { form: "f(a + h) = f(a) + h f'(a) + (h²/2) f''(ξ)", requires: "f 二次可微" },
    rolle: { form: "f'(c) = 0", requires: "f 可微" },
    evt: { form: "f 在 [a, b] 上有最大值／最小值", requires: "f 連續" },
    fermat: { form: "內點極值處 f'(c) = 0" },
    squeeze: { form: "lim … 由 A ≤ B ≤ C 夾出", requires: "前面先寫出 A ≤ B ≤ C 的鏈" },
    amgm: { form: "(a + b)/2 ≥ √(ab)，或 a + b ≥ 2√(ab)" },
    ivt: { form: "存在 c 使 f(c) = …", requires: "f 連續，且前面驗過兩端異號（f(a) < 0、f(b) > 0）" },
    "derivative-def": { form: "f'(a) = lim_{h→0} (f(a + h) − f(a))/h" },
    hypothesis: { form: "拿題目給的條件或前面的假設來用" },
    algebra: { form: "展開、因式分解、通分、整理：接著的式子交給代數引擎驗" },
    monotone: { form: "文字引用，式子本身照樣驗" },
    continuity: { form: "文字引用，式子本身照樣驗" },
    bernoulli: { form: "(1 + x)^n ≥ 1 + nx" },
    cauchy: { form: "文字引用；式子驗不了的會標黃" },
    binomial: { form: "文字引用；式子驗不了的會標黃" },
    leibniz: { form: "I'(p) = ∫_a^b ∂/∂p(被積函數) dx：I′ 用數值微分、右邊用數值積分，兩邊對上就綠（交換的正當性先當你是對的）" },
    ftc: { form: "I(b) = I(a) + ∫_a^b I'(t) dt", requires: "前面先算出 I′（I'(p) = … 那一行）" },
    frullani: { form: "∫_0^inf (f(ax) − f(bx))/x dx = (f(0) − f(inf)) ln(b/a)；f 具體才算得出來" },
    "integral-mvt": { form: "∫_a^b f(x) dx = f(c)(b − a)", requires: "f 連續" }
  };
  const CHEAT_FACTS = [
    "f 是多項式（蘊含連續、可微）",
    "f 連續／f 在 [a, b] 上連續",
    "f 可微／可導",
    "f 二次可微（泰勒定理的前提）",
    "g 在 (0, ∞) 上遞增／g is increasing on (0, inf)：要先寫出「對所有 x > 0，g'(x) > 0」；之後 g(a) > g(b) 靠它接地",
    "題目給的「對所有點 |f′(x)| ≤ 2」：寫出 |f′(c)| ≤ 2（c 可以是定理給的點或任何式子）就會被認成題目條件的實例，之後的取樣也吃它",
    "自己令的 g(x) = …：只由 sin、cos、exp、絕對值與多項式組成就自動算連續；沒有絕對值就自動算可微"
  ];
  const CHEAT_NOTATION = [
    ["ε、δ", "eps、delta，或直接打希臘字母；ξ、η、θ、λ、μ、α、β、γ 也認得"],
    ["絕對值", "|x − 3| 或 abs(x − 3)"],
    ["不等式", "<=、>=、!=，或 ≤、≥、≠；一條鏈只能朝一個方向"],
    ["次方、根號", "x^2、x²、x^{n+1}；sqrt(x)、√x"],
    ["極限", "lim_{x→2} 3x = 6、lim x->2 (3x) = 6 都可以"],
    ["存在", "存在 c ∈ (a, b) 使 …（要接在「由 <定理>，」後面）"],
    ["對所有", "對所有正整數 n、對任意 x：是裝飾，不是主張"],
    ["空格", "可打可不打：|x-3| 跟 |x − 3| 一樣"],
    ["定積分", "∫_0^1 x^p dx、∫₀¹ … dx、∫_0^{inf} e^(-x) dx、\\int_0^1 x\\,dx；本體寫到 dx 為止；上下限要寫（不定積分算不了）。令 I(p) = ∫ … dx 之後 I'(p) 也算得出來"],
    ["有限和", "Σ_{k=1}^{n} k(k+1)、\\sum_{k=1}^n k^2；本體到 + − 或關係符號為止；無窮級數算不了"],
    ["一行一句", "句號只能在最後；「且」與逗號可以分開兩個主張"],
    ["顏色", "綠＝驗過成立；黃＝讀得懂但驗不了（抽象函數、字典外的定理、接不上前文）；紅＝不成立、沒宣告的變數、還沒對上目標就得證"]
  ];
  const cheatsheet = {
    syntax: CHEAT_SYNTAX,
    rules: RULES.map((rule) => ({ id: rule.id, name: rule.names[0], aliases: rule.names.slice(1), form: (CHEAT_RULE_NOTES[rule.id] || {}).form || "", requires: (CHEAT_RULE_NOTES[rule.id] || {}).requires || "" })),
    facts: CHEAT_FACTS,
    notation: CHEAT_NOTATION,
    // 不用寫「由 <定理>」就會自動認的改寫：接得上前文的四種來源
    transformations: TRANSFORMATIONS.map((item) => ({ id: item.id, title: item.title, explain: item.explain }))
  };

  const api = {
    version: 1,
    normalize,
    parse,
    check,
    patterns: PATTERNS.map((pattern) => ({ kind: pattern.kind, label: pattern.label })),
    rules: RULES.map((rule) => ({ id: rule.id, name: rule.names[0], aliases: rule.names.slice(1) })),
    transformations: TRANSFORMATIONS.map((item) => ({ id: item.id, title: item.title })),
    cheatsheet,
    compile: (text, scope) => compile(text, scope)
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.BuzzProofLang = api;
})();
