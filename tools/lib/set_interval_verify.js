// set / interval 兩種答案型別的獨立驗算
//
// 這兩種題型在驗算報告裡原本全部落在「題幹形式尚未支援」—— 也就是說
// 那一包完全沒有機器把關，只有人工檢查過。而人工檢查正是 spec 00 說
// 「不夠」的那一種：答案錯一題造成的信任損失，大於新增五十題的收益。
//
// 「獨立」的定義跟數值驗算器一樣：**驗算路徑不能用到答案裡的任何資訊**。
// 所以題目要提供的是「那個函數本身」，不是「它的導數是什麼」——
// 導數由 Ridders 數值微分算出來，根由變號 + 二分法找出來。
// 我們算完之後才去看答案說了什麼。
//
//   critical       f' 的根（數值微分）        → set
//   inflection     f'' 的根（數值微分）        → set
//   zeros          給定式子的實根              → set
//   domain         f 取得到有限實數的區間      → interval
//   domainExcept   全實數扣掉給定式子的根      → interval
//   increasing     f' > 0 的區間               → interval
//   decreasing     f' < 0 的區間               → interval
//
// 端點的開閉是 interval 題的全部重點，所以比對時**必須**逐一對上，
// 差一個中括號就算不符。
//
// ── 這裡驗不到什麼（很重要，不要假裝驗到了）──────────────────
//
// 取樣法有一個硬限制：**單一點的異常抓不到**。
// (x²−4)/(x²−3x+2) 在 x=2 是個可移除的洞 —— 附近的值好端端趨近 4，
// 只有恰好那一點沒有定義。有理函數的極點也一樣：x=3 兩側都是有限值。
// 不管取樣多密，命中「恰好那一點」都是碰運氣。
//
// 所以有理函數這一類改用 zeros / domainExcept：由題目提供分母，
// 驗算器獨立把它的根算出來。「有理函數在分母為零處不連續」是定義，
// 不是這題要做的工作 —— 工作是把根找出來，而那一段是獨立算的。
// 這個界線要講清楚，不然「已驗算」這三個字就會開始貶值。

"use strict";

const numeric = require("./numeric.js");
const latex = require("./latex.js");

const EPS = 1e-6;

/* ── 取樣與求根 ─────────────────────────────────────────────── */

function safeEval(f, x) {
  let value;
  try {
    value = f(x);
  } catch (_error) {
    return NaN;
  }
  return typeof value === "number" && Number.isFinite(value) ? value : NaN;
}

// 變號法找根。步長刻意取密：漏掉一個根等於答案「沒找齊」，
// 而「找齊了沒有」正是 set 題要考的東西。
function rootsOf(g, from, to, steps = 4000) {
  const roots = [];
  const h = (to - from) / steps;
  let prevX = from;
  let prevY = safeEval(g, prevX);

  const bisect = (lo, hi) => {
    let a = lo;
    let b = hi;
    for (let i = 0; i < 80; i += 1) {
      const mid = (a + b) / 2;
      const ya = safeEval(g, a);
      const ym = safeEval(g, mid);
      if (!Number.isFinite(ya) || !Number.isFinite(ym)) return mid;
      if (ya * ym <= 0) b = mid; else a = mid;
    }
    return (a + b) / 2;
  };

  for (let i = 1; i <= steps; i += 1) {
    const x = from + i * h;
    const y = safeEval(g, x);
    if (Number.isFinite(prevY) && Number.isFinite(y)) {
      if (prevY === 0) roots.push(prevX);
      else if (prevY * y < 0) roots.push(bisect(prevX, x));
    }
    prevX = x;
    prevY = y;
  }
  if (Number.isFinite(prevY) && prevY === 0) roots.push(prevX);

  // ── 偶重根：碰到零但不變號 ──────────────────────────────
  //
  // x⁴−4x³ 的導數是 4x²(x−3)。x=0 是重根，f' 在那裡**不變號** ——
  // 純變號法會整個漏掉它，於是驗算器會說答案「多寫了一個 0」，
  // 而答案其實是對的。這種誤報比漏掉錯誤更糟：它會逼人去改對的內容。
  //
  // 所以再掃一次 |g| 的局部極小值，低到接近零的就當根。
  const scale = (() => {
    let peak = 0;
    for (let i = 0; i <= 200; i += 1) {
      const v = Math.abs(safeEval(g, from + ((to - from) * i) / 200));
      if (Number.isFinite(v)) peak = Math.max(peak, v);
    }
    return peak || 1;
  })();
  for (let i = 1; i < steps; i += 1) {
    const x0 = from + (i - 1) * h;
    const x1 = from + i * h;
    const x2 = from + (i + 1) * h;
    const y0 = Math.abs(safeEval(g, x0));
    const y1 = Math.abs(safeEval(g, x1));
    const y2 = Math.abs(safeEval(g, x2));
    if (![y0, y1, y2].every(Number.isFinite)) continue;
    if (!(y1 < y0 && y1 < y2)) continue;
    // 用黃金分割把極小值的位置收斂，再判斷它是不是真的到零
    let lo = x0;
    let hi = x2;
    for (let k = 0; k < 80; k += 1) {
      const m1 = lo + (hi - lo) / 3;
      const m2 = hi - (hi - lo) / 3;
      if (Math.abs(safeEval(g, m1)) < Math.abs(safeEval(g, m2))) hi = m2; else lo = m1;
    }
    const at = (lo + hi) / 2;
    if (Math.abs(safeEval(g, at)) < scale * 1e-9) roots.push(at);
  }

  // 同一個根可能被抓到兩次（變號與極小值各抓一次）
  const unique = [];
  roots.sort((a, b) => a - b).forEach((r) => {
    if (!unique.length || Math.abs(r - unique[unique.length - 1]) > 1e-4) unique.push(r);
  });
  return unique;
}

// f 在 x 附近是不是「爆掉」。判準刻意保守：只有真的發散才算不連續，
// 不然取樣噪音會製造出一堆假的不連續點。
function blowsUpAt(f, x) {
  const near = [1e-4, 1e-5, 1e-6].map((d) => Math.abs(safeEval(f, x + d)) + Math.abs(safeEval(f, x - d)));
  if (near.some((v) => Number.isNaN(v))) return true;
  return near[2] > near[0] * 50 && near[2] > 1e4;
}

/* ── 區間：把「成立的點」併成極大區間 ─────────────────────────── */

function intervalsWhere(predicate, from, to, steps = 3000) {
  const h = (to - from) / steps;
  // 步長要一起回傳：邊界的收斂需要知道取樣有多粗
  const out = [];
  let start = null;
  for (let i = 0; i <= steps; i += 1) {
    const x = from + i * h;
    const ok = predicate(x);
    if (ok && start === null) start = x;
    if (!ok && start !== null) {
      out.push([start, x - h]);
      start = null;
    }
  }
  if (start !== null) out.push([start, to]);
  // 把因為取樣造成的碎片併回去
  const merged = [];
  out.forEach(([a, b]) => {
    if (b - a < h * 1.5) return;
    if (merged.length && a - merged[merged.length - 1][1] <= h * 2.5) {
      merged[merged.length - 1][1] = b;
    } else {
      merged.push([a, b]);
    }
  });
  merged.step = h;
  return merged;
}

/* ── 答案的解析 ─────────────────────────────────────────────── */

// 答案欄位用的是 app 的作答語法（pi/4、sqrt(2)、log(2)），不是 LaTeX。
// 所以要先過 app 自己的正規化器，跟判分器看到的是同一份東西 ——
// 否則驗算器會因為「pi 不是變數」這種理由誤報，而題目其實是對的。
let normalizeAnswer = (value) => String(value);

function toNumber(text) {
  const normalized = normalizeAnswer(text);
  const value = latex.compileJs(normalized || text, [])();
  if (!Number.isFinite(value)) throw new Error(`"${text}" 算不出數值`);
  return value;
}

function parseSet(text) {
  const raw = String(text).trim();
  // 空集合的寫法要跟 app 的判分器一致。不一致的話會出現最糟的那種狀況：
  // 判分器說對、驗算器說錯（或反過來），而兩邊都自稱是權威。
  if (/^(無|沒有|不存在|none|empty|∅|\{\s*\})$/i.test(raw)) return [];
  const inner = raw.replace(/^\{|\}$/g, "");
  if (!inner.trim()) return [];
  return inner.split(",").map((piece) => toNumber(piece.trim())).sort((a, b) => a - b);
}

function parseBound(text) {
  const raw = String(text).trim();
  if (/^-\s*inf(inity)?$/i.test(raw)) return -Infinity;
  if (/^\+?\s*inf(inity)?$/i.test(raw)) return Infinity;
  return toNumber(raw);
}

function parseIntervals(text) {
  const raw = String(text).trim();
  // 空區間是合法答案（x²−4x+3 沒有凹向下的區間），跟空集合同一個道理。
  if (/^(無|沒有|不存在|none|empty|∅|\{\s*\}|\(\s*\))$/i.test(raw)) return [];
  return raw
    .split(/\s*U\s*|\s*∪\s*/i)
    .map((piece) => piece.trim())
    .filter(Boolean)
    .map((piece) => {
      // 端點本身可以含括號（sqrt(3)/3、log(2)），所以不能用「不含 ) 的字元類」
      // 去抓下界與上界 —— 那個寫法在 sqrt(3)/3 上直接失敗。
      // 頭尾各取一個括號，中間按**深度 0 的逗號**切開。
      const open = piece[0];
      const close = piece[piece.length - 1];
      if (!"([".includes(open) || !")]".includes(close) || piece.length < 4) {
        throw new Error(`區間 "${piece}" 讀不出來`);
      }
      const inner = piece.slice(1, -1);
      let depth = 0;
      let comma = -1;
      for (let i = 0; i < inner.length; i += 1) {
        const ch = inner[i];
        if (ch === "(" || ch === "[") depth += 1;
        else if (ch === ")" || ch === "]") depth -= 1;
        else if (ch === "," && depth === 0) { comma = i; break; }
      }
      if (comma < 0) throw new Error(`區間 "${piece}" 找不到分隔的逗號`);
      return {
        lo: parseBound(inner.slice(0, comma)),
        hi: parseBound(inner.slice(comma + 1)),
        loClosed: open === "[",
        hiClosed: close === "]"
      };
    })
    .sort((a, b) => a.lo - b.lo);
}

/* ── 比對 ───────────────────────────────────────────────────── */

function compareSets(claimed, computed, tol) {
  if (claimed.length !== computed.length) {
    return {
      status: "mismatch",
      detail: `答案給 ${claimed.length} 個元素 {${claimed.map(fmt).join(", ")}}，` +
        `獨立算出 ${computed.length} 個 {${computed.map(fmt).join(", ")}}`
    };
  }
  for (let i = 0; i < claimed.length; i += 1) {
    if (Math.abs(claimed[i] - computed[i]) > tol) {
      return {
        status: "mismatch",
        detail: `第 ${i + 1} 個元素：答案 ${fmt(claimed[i])}，獨立算出 ${fmt(computed[i])}`
      };
    }
  }
  return { status: "ok", detail: `${claimed.length} 個元素全部對上` };
}

function compareIntervals(claimed, computed, tol) {
  if (claimed.length !== computed.length) {
    return {
      status: "mismatch",
      detail: `答案給 ${claimed.length} 段，獨立算出 ${computed.length} 段：${computed.map(showInterval).join(" U ")}`
    };
  }
  for (let i = 0; i < claimed.length; i += 1) {
    const a = claimed[i];
    const b = computed[i];
    const closeEnough = (x, y) => (x === y) || (Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - y) <= tol);
    if (!closeEnough(a.lo, b.lo) || !closeEnough(a.hi, b.hi)) {
      return { status: "mismatch", detail: `第 ${i + 1} 段：答案 ${showInterval(a)}，獨立算出 ${showInterval(b)}` };
    }
    if (a.loClosed !== b.loClosed || a.hiClosed !== b.hiClosed) {
      return {
        status: "mismatch",
        detail: `第 ${i + 1} 段的端點開閉不符：答案 ${showInterval(a)}，獨立算出 ${showInterval(b)}` +
          "（端點屬不屬於是這類題目的全部重點）"
      };
    }
  }
  return { status: "ok", detail: `${claimed.length} 段區間與端點開閉全部對上` };
}

function fmt(value) {
  if (!Number.isFinite(value)) return value > 0 ? "inf" : "-inf";
  return Math.abs(value - Math.round(value)) < 1e-9 ? String(Math.round(value)) : value.toFixed(4);
}

function showInterval(entry) {
  return `${entry.loClosed ? "[" : "("}${fmt(entry.lo)}, ${fmt(entry.hi)}${entry.hiClosed ? "]" : ")"}`;
}

/* ── 各方法 ─────────────────────────────────────────────────── */

const METHODS = {
  critical(spec) {
    const f = latex.compile(spec.f, ["x"]);
    const [from, to] = spec.range;
    // 導數由數值微分算出來 —— 題目不准提供 f'，那會讓驗算共用答案的推理
    return { kind: "set", value: rootsOf((x) => numeric.derivative(f, x).value, from, to) };
  },

  inflection(spec) {
    const f = latex.compile(spec.f, ["x"]);
    const [from, to] = spec.range;
    return { kind: "set", value: rootsOf((x) => numeric.derivative(f, x, { order: 2 }).value, from, to) };
  },

  // 給定式子的實根。用在「有理函數的不連續點 = 分母的根」這種
  // **定義上的化約**：化約本身不是這題的工作，找根才是，而找根是獨立算的。
  zeros(spec) {
    const g = latex.compile(spec.f, ["x"]);
    const [from, to] = spec.range;
    return { kind: "set", value: rootsOf((x) => g(x), from, to) };
  },

  // 全實數扣掉給定式子的根。同上，用在有理函數的定義域。
  domainExcept(spec) {
    const g = latex.compile(spec.f, ["x"]);
    const [from, to] = spec.range;
    const holes = rootsOf((x) => g(x), from, to);
    const pieces = [];
    let lo = -Infinity;
    holes.forEach((hole) => {
      pieces.push({ lo, hi: hole, loClosed: false, hiClosed: false });
      lo = hole;
    });
    pieces.push({ lo, hi: Infinity, loClosed: false, hiClosed: false });
    return { kind: "interval", value: pieces };
  },

  discontinuity(spec) {
    const f = latex.compile(spec.f, ["x"]);
    const [from, to] = spec.range;
    const steps = 6000;
    const h = (to - from) / steps;
    const found = [];
    for (let i = 0; i <= steps; i += 1) {
      const x = from + i * h;
      if (Number.isNaN(safeEval(f, x)) || blowsUpAt(f, x)) {
        if (!found.length || x - found[found.length - 1] > 1e-3) found.push(x);
      }
    }
    // 用二分法把「爆掉的位置」收斂到小數點後幾位
    const refined = found.map((x) => {
      let lo = x - h;
      let hi = x + h;
      for (let i = 0; i < 60; i += 1) {
        const mid = (lo + hi) / 2;
        if (Number.isNaN(safeEval(f, mid)) || Math.abs(safeEval(f, mid)) > 1e6) hi = mid;
        else lo = mid;
      }
      return (lo + hi) / 2;
    });
    const unique = [];
    refined.sort((a, b) => a - b).forEach((r) => {
      if (!unique.length || Math.abs(r - unique[unique.length - 1]) > 1e-3) unique.push(r);
    });
    return { kind: "set", value: unique };
  },

  domain(spec) {
    const f = latex.compile(spec.f, ["x"]);
    const [from, to] = spec.range;
    const inDomain = (x) => Number.isFinite(safeEval(f, x));
    const pieces = intervalsWhere(inDomain, from, to);
    return { kind: "interval", value: pieces.map((piece) => refineInterval(inDomain, piece, from, to, false, pieces.step)) };
  },

  // 凹向上 / 凹向下：f″ 的符號。二階導數同樣是數值算的，題目不准提供。
  concaveUp(spec) {
    const f = latex.compile(spec.f, ["x"]);
    const [from, to] = spec.range;
    const up = (x) => {
      const d2 = numeric.derivative(f, x, { order: 2 }).value;
      return Number.isFinite(d2) && d2 > 0;
    };
    const pieces = intervalsWhere(up, from, to);
    return { kind: "interval", value: pieces.map((piece) => refineInterval(up, piece, from, to, true, pieces.step)) };
  },

  concaveDown(spec) {
    const f = latex.compile(spec.f, ["x"]);
    const [from, to] = spec.range;
    const down = (x) => {
      const d2 = numeric.derivative(f, x, { order: 2 }).value;
      return Number.isFinite(d2) && d2 < 0;
    };
    const pieces = intervalsWhere(down, from, to);
    return { kind: "interval", value: pieces.map((piece) => refineInterval(down, piece, from, to, true, pieces.step)) };
  },

  // 極大值／極小值的位置。
  //
  // 不是「f′ 的根」而已 —— 還要用一階變號判斷是哪一種。
  // 這樣「臨界點」與「極大值」就是兩個不同的答案，而那個區別本身
  // 就是作圖表要考的東西（x⁴−4x³ 在 x=0 有臨界點但沒有極值）。
  localMax(spec) {
    return { kind: "set", value: extremaOf(spec, "max") };
  },

  localMin(spec) {
    return { kind: "set", value: extremaOf(spec, "min") };
  },

  increasing(spec) {
    const f = latex.compile(spec.f, ["x"]);
    const [from, to] = spec.range;
    const rising = (x) => {
      const d = numeric.derivative(f, x).value;
      return Number.isFinite(d) && d > 0;
    };
    const pieces = intervalsWhere(rising, from, to);
    return { kind: "interval", value: pieces.map((piece) => refineInterval(rising, piece, from, to, true, pieces.step)) };
  },

  decreasing(spec) {
    const f = latex.compile(spec.f, ["x"]);
    const [from, to] = spec.range;
    const falling = (x) => {
      const d = numeric.derivative(f, x).value;
      return Number.isFinite(d) && d < 0;
    };
    const pieces = intervalsWhere(falling, from, to);
    return { kind: "interval", value: pieces.map((piece) => refineInterval(falling, piece, from, to, true, pieces.step)) };
  }
};

// 取樣只能給出粗略端點，再用二分法收斂到真正的邊界，
// 並決定端點本身屬不屬於。
//
// openAtBoundary：單調區間的端點永遠是開的（f'=0 不算遞增），
// 而定義域的端點要實際測那一點在不在定義域裡。
function refineInterval(predicate, [a, b], from, to, openAtBoundary, step) {
  const atLeftEdge = a <= from + 1e-9;
  const atRightEdge = b >= to - 1e-9;

  const boundary = (inside, outside) => {
    let lo = inside;
    let hi = outside;
    for (let i = 0; i < 70; i += 1) {
      const mid = (lo + hi) / 2;
      if (predicate(mid)) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  };

  // 「外面」那一點必須真的在外面。
  //
  // 原本用 (b−a)/1000 當外推距離，但 a 本身是取樣得到的，離真正的邊界
  // 最多有一整個取樣步長 —— 於是二分法的區間根本沒有夾住邊界，
  // 收斂到的是取樣點自己。症狀是端點差了千分之幾，而答案其實完全正確。
  // 往外推一整個步長（再多一點）才保證夾得住。
  const out = (step || (b - a) / 100) * 1.5 + 1e-9;

  const lo = atLeftEdge ? -Infinity : boundary(a, a - out);
  const hi = atRightEdge ? Infinity : boundary(b, b + out);

  return {
    lo,
    hi,
    loClosed: Number.isFinite(lo) && !openAtBoundary && predicate(lo),
    hiClosed: Number.isFinite(hi) && !openAtBoundary && predicate(hi)
  };
}

// 極值的位置：先找 f′ 的根，再用**一階變號**分類。
//
// 用一階變號而不是 f″ 的正負，是因為 f″=0 的時候二階判別法失效
// （x⁴ 在 0 有極小值，但 f″(0)=0）。變號法沒有那個死角。
function extremaOf(spec, want) {
  const f = latex.compile(spec.f, ["x"]);
  const [from, to] = spec.range;
  const d = (x) => numeric.derivative(f, x).value;
  const roots = rootsOf(d, from, to);
  const gap = Math.max((to - from) / 2000, 1e-4);
  const out = [];
  roots.forEach((x) => {
    const left = d(x - gap);
    const right = d(x + gap);
    if (!Number.isFinite(left) || !Number.isFinite(right)) return;
    // 正 → 負 是極大，負 → 正 是極小。不變號的就兩者都不是。
    if (want === "max" && left > 0 && right < 0) out.push(x);
    if (want === "min" && left < 0 && right > 0) out.push(x);
  });
  return out;
}

/* ── 對外 ───────────────────────────────────────────────────── */

function supports(problem) {
  return Boolean(problem && problem.verify && METHODS[problem.verify.m]);
}

function verify(problem, options = {}) {
  if (typeof options.normalizeAnswer === "function") normalizeAnswer = options.normalizeAnswer;
  const spec = problem.verify;
  const method = METHODS[spec.m];
  if (!method) return { status: "unsupported", reason: `不認得的 verify.m = "${spec.m}"` };
  if (!Array.isArray(spec.range) || spec.range.length !== 2) {
    return { status: "unsupported", reason: `verify.range 要寫成 [from, to]` };
  }
  try {
    const computed = method(spec);
    const tol = spec.tol || 1e-3;
    if (computed.kind === "set") {
      if (problem.answerKind !== "set") {
        return { status: "unsupported", reason: `verify.m=${spec.m} 產生集合，但 answerKind 是 ${problem.answerKind}` };
      }
      const result = compareSets(parseSet(problem.answer), computed.value, tol);
      return { ...result, method: `set:${spec.m}` };
    }
    if (problem.answerKind !== "interval") {
      return { status: "unsupported", reason: `verify.m=${spec.m} 產生區間，但 answerKind 是 ${problem.answerKind}` };
    }
    const result = compareIntervals(parseIntervals(problem.answer), computed.value, tol);
    return { ...result, method: `interval:${spec.m}` };
  } catch (error) {
    return { status: "error", reason: error.message };
  }
}

module.exports = { supports, verify, METHODS, parseSet, parseIntervals, rootsOf };
