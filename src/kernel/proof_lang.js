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
    "…": "...", "²": "^2", "³": "^3", "＝": "=", "＜": "<", "＞": ">", "＋": "+", "－": "-", "／": "/", "　": " ", "′": "'", "’": "'"
  };

  function normalize(text) {
    let out = String(text || "");
    out = out.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xff10 + 48));
    out = out.replace(/[Ａ-Ｚａ-ｚ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xff21 + 65 + (ch.charCodeAt(0) >= 0xff41 ? 32 : 0)));
    out = out.replace(/[，。：；（）「」『』≤≦≥≧≠−–—×·⋅÷∈∞√πεδ→⇒∀∃…²³＝＜＞＋－／　′’]/g, (ch) => CHAR_MAP[ch]);
    out = out.replace(/\\(epsilon|varepsilon)/g, "eps").replace(/\\delta/g, "delta").replace(/\\(le|leq)\b/g, "<=").replace(/\\(ge|geq)\b/g, ">=");
    out = out.replace(/\\(cdot|times)\b/g, "*").replace(/\\(sqrt|pi|sin|cos|tan|log|ln|exp|lim|to|infty)\b/g, "$1");
    out = out.replace(/\bepsilon\b/g, "eps").replace(/\binfty\b/g, "inf");
    return out.replace(/\s+/g, " ").trim();
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

  function compile(text, scope) {
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
          return (env) => fn(...args.map((arg) => arg(env)));
        }
        if (isFunction(name) && peek() && (peek().type === "id" || peek().type === "num")) {
          // sqrt a、sin x：函數名後面直接接一個原子，當成 f(原子)
          const arg = parseAtom();
          const fn = MATH_FUNCTIONS[name] || scope.functions[name];
          return (env) => fn(arg(env));
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
    return root;
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
    const vars = new Set([...Object.keys(spec.vars || {}), ...ctx.vars.keys(), ...Object.keys(ctx.defs)]);
    return { vars, functions: spec.functions || {} };
  }

  function drawSamples(spec, ctx, count) {
    const scope = makeScope(spec, ctx);
    const random = seeded(spec.seed || 20260913);
    const domains = {};
    [...scope.vars].forEach((name) => {
      const declared = (spec.vars && spec.vars[name]) || ctx.vars.get(name) || {};
      domains[name] = {
        min: declared.min !== undefined ? declared.min : (name === "eps" || name === "delta" ? 0.05 : -3),
        max: declared.max !== undefined ? declared.max : (name === "eps" || name === "delta" ? 2 : 3),
        int: Boolean(declared.int)
      };
    });
    const defs = Object.keys(ctx.defs).map((name) => ({ name, fn: compile(ctx.defs[name], scope) }));
    const constraints = ctx.constraints.filter((item) => item.caseId === null || item.caseId === ctx.currentCase);
    const compiled = constraints.map((item) => ({ ...item, lhs: compile(item.lhs, scope), rhs: compile(item.rhs, scope) }));
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
      for (const def of defs) {
        try { env[def.name] = def.fn(env); } catch (_error) { ok = false; }
        if (!Number.isFinite(env[def.name])) ok = false;
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
    { id: "mvt", names: ["平均值定理", "均值定理", "mvt", "mean value theorem", "lagrange"], shapes: [/f\((\w+)\)-f\((\w+)\)=f'\((\w+)\)\*?\((\w+)-(\w+)\)/, /f'\((\w+)\)=\(?f\((\w+)\)-f\((\w+)\)\)?\/\((\w+)-(\w+)\)/] },
    { id: "rolle", names: ["rolle", "rolle定理", "洛爾定理", "rolle theorem"], shapes: [/f'\((\w+)\)=0/] },
    { id: "evt", names: ["極值定理", "extreme value theorem", "evt", "最大最小值定理"], shapes: [/(最大值|最小值|maximum|minimum|max|min)/] },
    { id: "fermat", names: ["fermat", "費馬定理", "fermat theorem", "內點極值"], shapes: [/f'\((\w+)\)=0/] },
    { id: "squeeze", names: ["夾擠定理", "夾擠", "squeeze", "sandwich", "squeeze theorem"], shapes: [/lim/], requires: "sandwich" },
    { id: "amgm", names: ["算幾不等式", "am-gm", "amgm", "算術幾何平均"], shapes: [/\(?(.+)\+(.+)\)?\/2>=sqrt\(/, />=2\*?sqrt\(/] },
    { id: "ivt", names: ["中間值定理", "介值定理", "ivt", "intermediate value theorem"], shapes: [/f\((\w+)\)=/] },
    { id: "derivative-def", names: ["導數定義", "定義", "definition of derivative", "by definition", "定義"], shapes: [/lim/] },
    { id: "hypothesis", names: ["假設", "歸納假設", "題意", "已知", "hypothesis", "inductive hypothesis", "assumption", "induction hypothesis"], shapes: [] },
    { id: "algebra", names: ["代數", "展開", "因式分解", "通分", "整理", "algebra", "expanding", "factoring", "simplifying", "計算"], shapes: [] },
    { id: "monotone", names: ["單調性", "monotonicity", "遞增", "遞減"], shapes: [] },
    { id: "continuity", names: ["連續性", "連續", "continuity", "continuous"], shapes: [] },
    { id: "bernoulli", names: ["bernoulli", "白努利不等式", "伯努利不等式"], shapes: [/\(1\+(.+)\)\^(\w+)>=1\+/] },
    { id: "cauchy", names: ["柯西不等式", "cauchy", "cauchy-schwarz"], shapes: [] },
    { id: "binomial", names: ["二項式定理", "binomial theorem", "二項展開"], shapes: [] }
  ];

  function findRule(name) {
    const key = compact(name).replace(/(定理|theorem|the)$/g, "");
    return RULES.find((rule) => rule.names.some((alias) => {
      const aliasKey = compact(alias).replace(/(定理|theorem|the)$/g, "");
      return aliasKey === key || key.includes(aliasKey) || aliasKey.includes(key);
    })) || null;
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
    { kind: "let", label: "任取／設／取", re: /^(任取|任意取|任給|給定|固定|設|令|取|let|fix|take|choose|pick|given)\s+(.+)$/i },
    { kind: "assume", label: "假設／若…則…", re: /^(假設|若|如果|suppose|assume|if)\s+(.+?)(?:\s*[,;]\s*(則|那麼|then)\s+(.+))?$/i },
    { kind: "by", label: "由 <規則>，…", re: /^(由|根據|依|依據|利用|by|using|from|applying)\s*(.+?)\s*[,:]\s*(.+)$/i },
    { kind: "because", label: "因為…，所以…", re: /^(因為|because|since|as)\s+(.+?)\s*[,;]\s*(所以|故|因此|so|hence|therefore|thus)\s+(.+)$/i },
    { kind: "claim", label: "則／所以 <推導>", re: /^(則|那麼|得|得到|所以|故|因此|於是|即|然後|接著|同理|(?:展開|整理|化簡|移項|通分|配方|代入|平方|開根號|兩邊[^,]{0,12}?)(?:後|可得|得到|得)?|then|so|hence|thus|therefore|we (get|have|obtain)|it follows that|this gives|expanding|simplifying|rearranging)\s*[,:]?\s*(.+)$/i }
  ];

  function classify(raw) {
    const text = normalize(raw);
    for (const pattern of PATTERNS) {
      const match = text.match(pattern.re);
      if (match) return { kind: pattern.kind, label: pattern.label, match, text };
    }
    // 沒有關鍵字但本身是一條關係鏈：當成推導
    if (splitChain(text)) return { kind: "claim", label: "推導（無關鍵字）", match: [text, "", "", text], text, bare: true };
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
      if (ch === "(") depth += 1;
      if (ch === ")") depth -= 1;
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
    const key = compact(statement);
    if ((goal.text || []).some((alias) => compact(alias) === key)) return true;
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
      skeleton: { let: false, define: false, assume: false, bound: false, base: false, hypothesis: false, step: false, contradictionClosed: false }
    };
    (spec.given || []).forEach((given) => applyDeclaration(spec, ctx, normalize(given), null));
    const report = [];

    // 代數引擎：在目前的假設下驗一個關係
    const evaluate = (lhs, rhs, op, context) => {
      const scope = makeScope(spec, context);
      let left; let right;
      try {
        left = compile(applyMacros(spec, lhs), scope);
        right = compile(applyMacros(spec, rhs), scope);
      } catch (error) {
        return { ok: false, unsure: true, reason: error.unknownSymbol ? `含未知符號「${error.unknownSymbol}」，我驗不了這一段` : error.message };
      }
      const { samples } = drawSamples(spec, context, 160);
      if (!samples.length) return { ok: false, unsure: true, reason: "在目前的假設下抽不到任何一個點（假設互相矛盾，或條件太緊）" };
      let checked = 0;
      for (const env of samples) {
        let a; let b;
        try { a = left(env); b = right(env); } catch (error) { return { ok: false, unsure: true, reason: error.message }; }
        if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
        checked += 1;
        if (!RELATION_TEST[op](a, b)) {
          const shown = Object.keys(env).filter((name) => context.vars.has(name) || (spec.vars && spec.vars[name])).slice(0, 4).map((name) => `${name}=${round(env[name])}`).join(", ");
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
      report.push(Object.assign({ n: line.n, raw: line.raw, kind: line.kind, label: line.label, status, note }, extra || {}));
    };

    for (const line of lines) {
      if (line.kind === "unknown") {
        push(line, "error", "讀不懂這一句。每一行要用一種句型開頭：任取／設／取、假設、則／所以、由 <定理>、因為…所以…、分情況、情況一、用歸納法、當 n=1 時、反設、得證。");
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
        push(line, claim.status, claim.note, { results: claim.results, rule: rule ? rule.id : null });
        continue;
      }
      if (line.kind === "because") {
        const reason = handleClaim(spec, ctx, line.match[2], line, verifyChain, evaluate, null, true);
        const claim = handleClaim(spec, ctx, line.match[4], line, verifyChain, evaluate, null);
        push(line, worst(reason.status, claim.status), `前提：${reason.note} 結論：${claim.note}`, { results: [...(reason.results || []), ...(claim.results || [])] });
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
        push(line, claim.status, claim.note, { results: claim.results });
        continue;
      }
    }

    return summarize(spec, ctx, report, lines);
  }

  function round(value) {
    if (!Number.isFinite(value)) return String(value);
    return Math.abs(value) >= 1000 ? value.toFixed(0) : Number(value.toPrecision(4)).toString();
  }

  function worst(a, b) {
    const rank = { ok: 0, unsure: 1, error: 2 };
    return rank[a] >= rank[b] ? a : b;
  }

  function applyMacros(spec, expr) {
    let out = expr;
    (spec.macros || []).forEach((macro) => {
      out = out.replace(new RegExp(macro.pattern, "g"), macro.replace);
    });
    return out;
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
      if (chain && chain.ops.length === 1 && chain.ops[0] === "=" && /^[A-Za-z_]\w*$/.test(chain.exprs[0])) {
        // 定義：取 δ = ε/3
        const name = chain.exprs[0];
        ctx.defs[name] = applyMacros(spec, chain.exprs[1]);
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
          ctx.constraints.push({ lhs: applyMacros(spec, chain.exprs[i]), rhs: applyMacros(spec, chain.exprs[i + 1]), op: chain.ops[i], caseId: ctx.currentCase });
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
        ctx.constraints.push({ lhs: applyMacros(spec, chain.exprs[i]), rhs: applyMacros(spec, chain.exprs[i + 1]), op: chain.ops[i], caseId: ctx.currentCase });
      }
      if (/\bdelta\b/.test(part)) ctx.skeleton.assume = true;
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
  function handleClaim(spec, ctx, body, line, verifyChain, evaluate, rule, isPremise) {
    const parts = statementList(body);
    const notes = [];
    const results = [];
    let status = "ok";
    let anyChain = false;
    for (const part of parts) {
      if (/^(成立|holds|is true|得證|矛盾)$/i.test(part)) continue;
      if (/^(結論|the claim|the statement|命題|原式)\s*(成立|holds)?$/i.test(part)) {
        if (ctx.induction && ctx.skeleton.base) { notes.push("「結論成立」在歸納裡要寫出 n = k+1 的式子才算。"); status = worst(status, "unsure"); }
        continue;
      }
      const goalHit = goalMatches(spec, part, ctx, evaluate);
      const textual = /\blim\b|->|=>|forall|exists|存在|對所有|極限/.test(part);
      const verified = textual ? null : verifyChain(applyMacros(spec, part), ctx);
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
        } else if (unsure.length) {
          const shapeHit = rule && rule.shapes && rule.shapes.some((shape) => shape.test(compact(part))) && ruleRequirementsMet(rule, ctx);
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
          const grounded = isPremise || (rule && rule.id !== "unknown") || verified.chain.ops.length >= 2
            || (goalHit && skeletonReady(spec, ctx))
            || isObviousStart(verified.chain) || overlapsKnown(spec, ctx, verified.chain, evaluate) || equivalentToKnown(spec, ctx, verified.chain, evaluate);
          ctx.verifiedLinks = ctx.verifiedLinks || [];
          verified.results.forEach((item) => ctx.verifiedLinks.push({ lhs: item.lhs, op: item.op, rhs: item.rhs }));
          if (!grounded) {
            status = worst(status, "unsure");
            notes.push(`「${part}」數值上成立，但跟前面沒有接上（兩邊都沒在前面出現過，也不是顯然的起點）—— 從前一步寫一條鏈過來。`);
          } else {
            notes.push(`「${part}」${verified.results.length > 1 ? `的 ${verified.results.length} 段` : ""}在 ${verified.results[0].checked || 0} 個取樣點上都成立。`);
          }
          rememberChain(ctx, verified.chain);
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
      } else {
        // 不是關係鏈：文字主張
        const shapeHit = rule && rule.shapes && rule.shapes.some((shape) => shape.test(compact(part))) && ruleRequirementsMet(rule, ctx);
        if (rule && rule.requires && !ruleRequirementsMet(rule, ctx)) {
          status = worst(status, "unsure");
          notes.push(`「${part}」引用${rule.names[0]}，但前面還沒有把它夾住的鏈（A ≤ B ≤ C 那一行）。`);
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
    if (!parts.length) return { status: "unsure", note: "這一句沒有可以檢查的內容。", results };
    void anyChain;
    return { status, note: notes.join(" "), results };
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
          const verified = verifyChain(applyMacros(spec, sided[4]), local);
          const bad = verified && verified.results.find((item) => !item.ok && !item.unsure);
          if (bad) { status = worst(status, "error"); notes.push(`「${bad.lhs} = ${bad.rhs}」不成立：${bad.reason}`); }
        }
        continue;
      }
      const verified = verifyChain(applyMacros(spec, part), local);
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
        if (chain && chain.ops.length === 1) ctx.constraints.push({ lhs: chain.exprs[0], rhs: chain.exprs[1], op: NEGATE[chain.ops[0]], caseId: id });
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
    for (let i = 0; i < chain.ops.length; i += 1) ctx.constraints.push({ lhs: chain.exprs[i], rhs: chain.exprs[i + 1], op: chain.ops[i], caseId: id });
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
    // 兩種算數的矛盾：(1) 反設下抽不到任何點 (2) 上一句在反設下對所有樣本都不成立
    const probe = drawSamples(spec, ctx, 30);
    if (!probe.samples.length) {
      ctx.skeleton.contradictionClosed = true;
      push(line, "ok", "在反設之下抽不到任何一個點 —— 假設集合本身矛盾，反證成立。");
      return;
    }
    if (ctx.contradictionCandidate) {
      ctx.skeleton.contradictionClosed = true;
      push(line, "ok", `「${ctx.contradictionCandidate}」在反設之下對所有取樣點都不成立 —— 這就是矛盾。`);
      return;
    }
    // 第三種：「m 是最大的」這種文字假設，配上一條驗過的 t > m（或 最小 配 t < m）
    const extremal = ctx.facts.map((fact) => fact.match(/^(\w+)\s*(是|為)?\s*(最大|最小|largest|smallest|maximal|minimal|the (largest|smallest|maximum|minimum))/i) || fact.match(/(largest|smallest|maximum|minimum)\s+(\w+)/i)).find(Boolean);
    if (extremal) {
      const name = extremal[1] && /^\w+$/.test(extremal[1]) && !/largest|smallest|maximum|minimum/i.test(extremal[1]) ? extremal[1] : extremal[2];
      const isMax = /最大|largest|maximal|maximum/i.test(extremal[0]);
      const beaten = (ctx.verifiedLinks || []).some((link) =>
        (isMax && ((link.op === ">" && link.rhs === name) || (link.op === "<" && link.lhs === name)))
        || (!isMax && ((link.op === "<" && link.rhs === name) || (link.op === ">" && link.lhs === name))));
      if (beaten) {
        ctx.skeleton.contradictionClosed = true;
        push(line, "ok", `前面已經驗出一個比 ${name} 更${isMax ? "大" : "小"}的值，跟「${name} 是${isMax ? "最大" : "最小"}的」矛盾。`);
        return;
      }
    }
    push(line, "unsure", "我抽得到同時滿足所有假設的點，看不出數值上的矛盾；如果矛盾來自數論或存在性，這裡只能靠你自己確認。");
  }

  // 顯然的起點：平方 ≥ 0、絕對值 ≥ 0、|sin|、|cos| ≤ 1、e^x > 0
  function isObviousStart(chain) {
    if (chain.ops.length !== 1) return false;
    const [lhs, rhs] = chain.exprs.map((expr) => compact(expr));
    const op = chain.ops[0];
    const nonNegative = (expr) => /^\(.+\)\^2$/.test(expr) || /^[a-z]\w*\^2$/.test(expr) || /^abs\(.+\)$/.test(expr) || /^\|.+\|$/.test(expr) || /^(exp|sqrt)\(.+\)$/.test(expr);
    if ((op === ">=" || op === ">") && rhs === "0" && nonNegative(lhs)) return true;
    if ((op === "<=" || op === "<") && lhs === "0" && nonNegative(rhs)) return true;
    if (op === "<=" && rhs === "1" && /^(abs\(|\|)(sin|cos)\(.+\)(\)|\|)$/.test(lhs)) return true;
    if (op === ">=" && lhs === "1" && /^(abs\(|\|)(sin|cos)\(.+\)(\)|\|)$/.test(rhs)) return true;
    return false;
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
    return known.filter((expr) => expr && expr !== "0" && expr !== "1");
  }

  // 這條鏈的某一邊在前面出現過（字面相同或數值相等）
  function overlapsKnown(spec, ctx, chain, evaluate) {
    const known = knownExpressions(spec, ctx);
    if (!known.length) return false;
    const ends = [chain.exprs[0], chain.exprs[chain.exprs.length - 1]];
    return ends.some((expr) => known.some((other) => compact(other) === compact(expr) || evaluate(other, expr, "=", ctx).ok));
  }

  // 跟前面某條驗過的關係式等價：兩邊之差的正負在每個取樣點上一致
  function equivalentToKnown(spec, ctx, chain, evaluate) {
    if (chain.ops.length !== 1) return false;
    const links = (ctx.verifiedLinks || []).filter((link) => link.op !== "=" && link.op !== "!=");
    if (!links.length || chain.ops[0] === "=" || chain.ops[0] === "!=") return false;
    const oriented = (lhs, op, rhs) => (op === ">" || op === ">=") ? `(${lhs})-(${rhs})` : `(${rhs})-(${lhs})`;
    const mine = oriented(chain.exprs[0], chain.ops[0], chain.exprs[1]);
    const scope = makeScope(spec, ctx);
    let mineFn;
    try { mineFn = compile(applyMacros(spec, mine), scope); } catch (_error) { return false; }
    const { samples } = drawSamples(spec, ctx, 120);
    if (!samples.length) return false;
    return links.some((link) => {
      let otherFn;
      try { otherFn = compile(applyMacros(spec, oriented(link.lhs, link.op, link.rhs)), scope); } catch (_error) { return false; }
      return samples.every((env) => {
        let a; let b;
        try { a = mineFn(env); b = otherFn(env); } catch (_error) { return false; }
        if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
        const sa = Math.abs(a) < 1e-9 ? 0 : Math.sign(a);
        const sb = Math.abs(b) < 1e-9 ? 0 : Math.sign(b);
        return sa === sb;
      });
    });
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
    if (skeleton === "cases") return ctx.currentCase !== null;
    return false;
  }

  function rememberChain(ctx, chain) {
    ctx.knownExprs = ctx.knownExprs || [];
    chain.exprs.forEach((expr) => ctx.knownExprs.push(expr));
    // A ≤ B ≤ C 這種兩邊夾住的鏈：夾擠定理的前提
    if (chain.ops.length >= 2 && chain.ops.every((op) => op === "<=" || op === "<")) ctx.hasSandwich = true;
  }

  function ruleRequirementsMet(rule, ctx) {
    if (!rule || !rule.requires) return true;
    if (rule.requires === "sandwich") return Boolean(ctx.hasSandwich);
    return true;
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
      if (!ctx.skeleton.let) missing.push("任取 ε > 0");
      if (!ctx.skeleton.define) missing.push("取 δ = …（用 ε 表示）");
      if (!ctx.skeleton.assume) missing.push("假設 0 < |x − a| < δ");
      if (!ctx.skeleton.bound) missing.push("推出 |f(x) − L| < ε 的鏈");
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

  const api = {
    version: 1,
    normalize,
    parse,
    check,
    patterns: PATTERNS.map((pattern) => ({ kind: pattern.kind, label: pattern.label })),
    rules: RULES.map((rule) => ({ id: rule.id, name: rule.names[0], aliases: rule.names.slice(1) })),
    compile: (text, scope) => compile(text, scope)
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.BuzzProofLang = api;
})();
