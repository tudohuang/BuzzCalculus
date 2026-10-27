// ── 今日函數（微積分版 Wordle；data-lazy="funcle"，訓練頁「每日」那一格點了才抓）──
// 每天一個神秘函數（照台灣的日期挑、半夜 12 點換題，大家同一題），猜 6 次。每次打一個式子，回七個特徵：
//   類型（指數／三角／對數…，有重疊＝黃）、f(0)、f(1)（對＝綠、差 1 以內＝黃，箭頭說要往大還是往小）、
//   定義域、奇偶、[−5, 5] 的零點個數（差 1＝黃）、x → ∞。
// 2026-10-27 加：猜錯一次就在圖上多露出答案的 3 個點（線索點）；打字時即時畫出自己的式子；快捷鍵、起手建議、
// 翻牌動畫、結算的戰績與下一題倒數。「從零靠六個特徵快速猜出函數」太難，線索點與類型讓它猜得下去。
// 猜的畫圖；答案的圖最後才揭曉。在取樣點上跟答案一樣就算猜中（x² − 1 與 (x − 1)(x + 1) 都算）。
// 紀錄：records.funcle = { days: { "2026-10-23": { g: [式子…], won } } }（app.js 給 loadRecords／saveRecords）。
(function () {
  "use strict";

  // 題目：中學到大一會認得的函數，特徵分得開。日期決定是哪一題（順序固定洗過，連著幾天不會是同一型）
  const TARGETS = [
    "x^2-1", "x^3-3x", "sin(x)", "cos(x)", "e^x", "ln(x)", "1/x", "abs(x)", "sqrt(x)", "x*sin(x)",
    "x^2-4x+3", "e^(-x^2)", "x/(x^2+1)", "x^3", "2^x", "x^4-2x^2", "sin(2x)", "x+1/x", "ln(x^2+1)", "x*e^(-x)",
    "1/(x^2+1)", "x^2+x-2", "cos(x)-1", "x^3-x", "e^x-1", "sqrt(x+4)", "abs(x-2)", "x^2*e^x", "atan(x)", "sin(x)/x",
    "(x-1)^2", "x^5-5x", "1/(x-1)", "ln(x)/x", "e^(-x)", "x^2-2", "cos(2x)+1", "x^3+x", "4-x^2", "sqrt(9-x^2)",
    "x*cos(x)", "1-e^(-x)", "x^2/(x^2+1)", "ln(x+1)", "x^4-16", "2x-3", "abs(x^2-4)", "sin(x)+x", "e^x+e^(-x)", "tan(x)"
  ];
  const XS = Array.from({ length: 201 }, (_, i) => -5 + i * 0.05);
  const FAR = [1e2, 2e2, 5e2, 1e3, 2e3, 5e3, 1e4, 2e4, 5e4, 1e5];
  // 線索點：猜錯一次露 3 個（f(0)、f(1) 已經在格子裡，不重複）
  const CLUE_XS = [-1, 2, -2, 3, -3, 0.5, -0.5, 4, -4, 1.5, -1.5, 2.5, -2.5, 3.5, -3.5];
  const CLUES_PER_MISS = 3;
  // 台灣的日期（UTC+8，不看裝置時區）：大家半夜 12 點一起換題
  const twDate = (ms = Date.now()) => new Date(ms + 8 * 3600000).toISOString().slice(0, 10);
  function targetOf(key) {
    const day = Math.round(Date.parse(`${key}T12:00:00Z`) / 86400000);
    return TARGETS[((day * 37) % TARGETS.length + TARGETS.length) % TARGETS.length];
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // 常見的寫法先換成算式引擎讀得懂的：|x| → abs(x)、x³ → x^3、全形的 − × ÷、√ → sqrt、π → pi
  const tidy = (src) => String(src).replace(/[−–]/g, "-").replace(/×/g, "*").replace(/÷/g, "/").replace(/²/g, "^2").replace(/³/g, "^3").replace(/⁴/g, "^4").replace(/π/g, "pi").replace(/√/g, "sqrt").replace(/\|([^|]+)\|/g, "abs($1)");

  // 類型：看式子用了哪些東西（答案跟猜的用同一套規則，所以 e^x 與 exp(x) 都是指數）
  // ^ 或 / 後面接的那一段：括號就整組、不然一個記號
  function operand(s, i) {
    let j = i;
    while (s[j] === " ") j += 1;
    if (s[j] === "-") j += 1;
    if (s[j] === "(") { let d = 0; for (let k = j; k < s.length; k += 1) { if (s[k] === "(") d += 1; if (s[k] === ")") { d -= 1; if (!d) return s.slice(j, k + 1); } } return s.slice(j); }
    const m = /^[\w.]+(\([^()]*\))?/.exec(s.slice(j));
    return m ? m[0] : "";
  }
  const FAMILY_ORDER = ["指數", "對數", "三角", "根號", "有理", "絕對值"];
  function familyOf(raw) {
    const s = tidy(raw).toLowerCase().replace(/\s+/g, "");
    const out = new Set();
    if (/(^|[^a-z])(a?sin|a?cos|a?tan|sec|csc|cot)\(/.test(s)) out.add("三角");
    if (/(^|[^a-z])(ln|log)\(/.test(s)) out.add("對數");
    if (/sqrt\(/.test(s)) out.add("根號");
    if (/abs\(/.test(s)) out.add("絕對值");
    if (/exp\(/.test(s)) out.add("指數");
    for (let i = s.indexOf("^"); i >= 0; i = s.indexOf("^", i + 1)) {
      const e = operand(s, i + 1);
      if (/x/.test(e)) out.add("指數");
      else if (/^\(?1\/2\)?$|^\(?0?\.5\)?$/.test(e)) out.add("根號");
    }
    for (let i = s.indexOf("/"); i >= 0; i = s.indexOf("/", i + 1)) if (/x/.test(operand(s, i + 1))) out.add("有理");
    return out.size ? FAMILY_ORDER.filter((k) => out.has(k)) : [/x/.test(s) ? "多項式" : "常數"];
  }

  // 答案揭曉用的 TeX：e^(-x) → e^{-x}、sqrt( ) → \sqrt{ }、abs( ) → | |、sin → \sin（直接丟給 KaTeX 的話 ^( 只會把「(」放上去）
  function closeAt(t, j) { let d = 0; for (let k = j; k < t.length; k += 1) { if (t[k] === "(") d += 1; if (t[k] === ")") { d -= 1; if (!d) return k; } } return t.length; }
  const FN_TEX = { atan: "\\arctan", asin: "\\arcsin", acos: "\\arccos", log: "\\ln", ln: "\\ln", sin: "\\sin", cos: "\\cos", tan: "\\tan" };
  function toTex(raw) {
    const conv = (t) => {
      let out = "";
      for (let i = 0; i < t.length;) {
        const m = /^(sqrt|abs|asin|acos|atan|sin|cos|tan|ln|log|exp)\(/.exec(t.slice(i));
        if (m) {
          const j = i + m[0].length - 1; const k = closeAt(t, j); const inner = conv(t.slice(j + 1, k));
          out += m[1] === "sqrt" ? `\\sqrt{${inner}}` : m[1] === "abs" ? `\\left|${inner}\\right|` : m[1] === "exp" ? `e^{${inner}}` : `${FN_TEX[m[1]]}\\left(${inner}\\right)`;
          i = k + 1;
          continue;
        }
        if (t[i] === "^") {
          const j = i + 1;
          if (t[j] === "(") { const k = closeAt(t, j); out += `^{${conv(t.slice(j + 1, k))}}`; i = k + 1; } else { const e = (/^-?[\w.]+/.exec(t.slice(j)) || [""])[0]; out += `^{${conv(e)}}`; i = j + e.length; }
          continue;
        }
        if (t[i] === "*") { out += " "; i += 1; continue; }
        if (t.startsWith("pi", i) && !/[a-z]/.test(t[i + 2] || "")) { out += "\\pi "; i += 2; continue; }
        out += t[i];
        i += 1;
      }
      return out;
    };
    return conv(tidy(raw).replace(/\s+/g, ""));
  }

  // 一個式子 → 取樣值與七個特徵
  function profile(ev, raw) {
    const src = tidy(raw);
    const val = (x) => { const y = ev(src, { x }); return typeof y === "number" ? y : NaN; };
    const f = (x) => { const y = val(x); return Number.isFinite(y) ? y : NaN; };
    const ys = XS.map(f);
    if (!ys.some(Number.isFinite)) return null;
    const ok = ys.map(Number.isFinite);
    const domain = ok.every(Boolean) ? "全體實數" : ok.slice(0, 100).every((v) => !v) ? "只有 x > 0（或 ≥ 0）" : "有斷開或缺口";
    const pairs = XS.map((x, i) => [ys[i], ys[200 - i]]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
    const tol = (a) => 1e-6 * (1 + Math.abs(a));
    const parity = pairs.length > 20 && pairs.every(([a, b]) => Math.abs(a - b) < tol(a)) ? "偶函數" : pairs.length > 20 && pairs.every(([a, b]) => Math.abs(a + b) < tol(a)) ? "奇函數" : "都不是";
    // 零點：正負號真的變了（跳過斷開的地方），或孤立的一點剛好是 0（|x| 在 0）；e^(−x²) 尾巴那種一路都很小的不算
    let zeros = 0;
    const tiny = (v) => Number.isFinite(v) && Math.abs(v) < 1e-9;
    for (let i = 0; i < ys.length; i += 1) {
      const a = ys[i]; const b = ys[i + 1];
      if (!Number.isFinite(a)) continue;
      if (tiny(a)) { if (!tiny(ys[i - 1]) && !tiny(b)) { zeros += 1; i += 1; } continue; }
      if (Number.isFinite(b) && !tiny(b) && a * b < 0 && Math.abs(a - b) < 5) zeros += 1;
    }
    // x → ∞：x = 10²…10⁵ 取十點。NaN（根號裡變負、ln 負數）＝沒有定義；
    // ±Infinity 是「大到電腦存不下」（e^1000 溢位）——那是往無限大走，不是沒有定義（2026-10-27 修：e^x、2^x 曾被判成沒有定義）
    const far = FAR.map(val);
    let inf;
    if (far.some((v) => Number.isNaN(v))) inf = "沒有定義";
    else {
      const big = far.map((v) => (v === Infinity ? Number.MAX_VALUE : v === -Infinity ? -Number.MAX_VALUE : v));
      const capped = (v) => Math.abs(v) === Number.MAX_VALUE;
      const up = big.every((v, i) => !i || v > big[i - 1] || (v === big[i - 1] && capped(v) && v > 0));
      const down = big.every((v, i) => !i || v < big[i - 1] || (v === big[i - 1] && capped(v) && v < 0));
      // 最後幾點幾乎一樣 → 收斂到那個數；一路變大（ln x 這種慢慢長的也算）→ +∞；一路變小 → −∞；其他 → 振盪
      if (!big.some(capped) && Math.abs(big[9] - big[8]) < 1e-3 * (1 + Math.abs(big[9])) && Math.abs(big[8] - big[7]) < 2e-3 * (1 + Math.abs(big[9]))) inf = `→ ${fmt(Math.round(big[9] * 100) / 100)}`;
      else if (up) inf = "→ +∞";
      else if (down) inf = "→ −∞";
      else inf = "不收斂（振盪）";
    }
    return { ys, f0: f(0), f1: f(1), domain, parity, zeros: Math.min(zeros, 9), inf, fam: familyOf(raw), at: f };
  }
  function same(a, b) {
    return a.ys.every((y, i) => { const z = b.ys[i]; return Number.isFinite(y) ? Number.isFinite(z) && Math.abs(y - z) < 1e-6 * (1 + Math.abs(y)) : !Number.isFinite(z); });
  }
  // 一格的顏色：g 綠、y 黃、x 灰；數字格帶箭頭（答案比你猜的大 ↑）
  function tiles(guess, target) {
    const num = (label, a, b) => {
      if (!Number.isFinite(a) || !Number.isFinite(b)) return { label, text: Number.isFinite(a) ? fmt(a) : "無定義", c: Number.isFinite(a) === Number.isFinite(b) ? "g" : "x", arrow: "" };
      const d = b - a;
      return { label, text: fmt(a), c: Math.abs(d) < 1e-6 ? "g" : Math.abs(d) <= 1 ? "y" : "x", arrow: Math.abs(d) < 1e-6 ? "" : d > 0 ? "↑" : "↓" };
    };
    const fa = guess.fam; const fb = target.fam;
    const famSame = fa.length === fb.length && fa.every((k) => fb.includes(k));
    return [
      { label: "類型", text: fa.join("·"), c: famSame ? "g" : fa.some((k) => fb.includes(k)) ? "y" : "x", arrow: "" },
      num("f(0)", guess.f0, target.f0),
      num("f(1)", guess.f1, target.f1),
      { label: "定義域", text: guess.domain, c: guess.domain === target.domain ? "g" : "x", arrow: "" },
      { label: "奇偶", text: guess.parity, c: guess.parity === target.parity ? "g" : "x", arrow: "" },
      { label: "零點數", text: `${guess.zeros} 個`, c: guess.zeros === target.zeros ? "g" : Math.abs(guess.zeros - target.zeros) === 1 ? "y" : "x", arrow: guess.zeros === target.zeros ? "" : target.zeros > guess.zeros ? "↑" : "↓" },
      { label: "x → ∞", text: guess.inf, c: guess.inf === target.inf ? "g" : "x", arrow: "" }
    ];
  }
  function fmt(v) { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? "0" : String(r); }

  // 圖：x ∈ [−5, 5]、y 截在 [−6, 6]；斷開的地方斷線。dots＝線索點（答案在那些 x 的值）
  const COLORS = ["#2563eb", "#16a34a", "#9333ea", "#ea580c", "#0891b2", "#db2777"];
  const W = 340; const H = 240;
  const sx = (x) => ((x + 5) / 10) * W;
  const sy = (y) => H / 2 - (y / 6) * (H / 2);
  function path(ys) {
    let d = ""; let pen = false; let prev = null;
    ys.forEach((y, i) => {
      if (!Number.isFinite(y) || Math.abs(y) > 12 || (prev !== null && Math.abs(y - prev) > 6)) { pen = false; prev = Number.isFinite(y) ? y : null; return; }
      d += `${pen ? "L" : "M"}${sx(XS[i]).toFixed(1)} ${sy(Math.max(-6.5, Math.min(6.5, y))).toFixed(1)}`;
      pen = true; prev = y;
    });
    return d;
  }
  function plot(series, dots) {
    const grid = [-4, -2, 2, 4].map((v) => `<line x1="${sx(v)}" y1="0" x2="${sx(v)}" y2="${H}" class="fn-grid"/><line x1="0" y1="${sy(v)}" x2="${W}" y2="${sy(v)}" class="fn-grid"/>`).join("");
    const ticks = [-4, -2, 2, 4].map((v) => `<text x="${sx(v)}" y="${sy(0) + 13}" class="fn-tick">${v}</text><text x="${sx(0) - 5}" y="${sy(v) + 4}" class="fn-tick" text-anchor="end">${v}</text>`).join("");
    const shown = dots.filter((d) => Number.isFinite(d.y) && Math.abs(d.y) <= 6.5);
    return `<svg viewBox="0 0 ${W} ${H}" class="fn-plot" role="img" aria-label="猜過的函數圖形與線索點"><clipPath id="fn-clip"><rect width="${W}" height="${H}"/></clipPath>${grid}
      <line x1="0" y1="${sy(0)}" x2="${W}" y2="${sy(0)}" class="fn-axis"/><line x1="${sx(0)}" y1="0" x2="${sx(0)}" y2="${H}" class="fn-axis"/>${ticks}
      <g clip-path="url(#fn-clip)">${series.map((s) => `<path d="${path(s.ys)}" stroke="${s.color}" stroke-width="${s.bold ? 3.2 : 2}" fill="none"${s.dash ? ' stroke-dasharray="6 5"' : ""}${s.cls ? ` class="${s.cls}"` : ""}/>`).join("")}
      ${shown.map((d) => `<circle cx="${sx(d.x).toFixed(1)}" cy="${sy(d.y).toFixed(1)}" r="4.6" class="fn-dot${d.fresh ? " is-fresh" : ""}"/>`).join("")}</g><path data-fn-preview d="" class="fn-preview"/></svg>`;
  }

  const CSS = `.fn-ov{position:fixed;inset:0;z-index:80;overflow-y:auto;overscroll-behavior:contain;background:color-mix(in srgb,var(--paper) 96%,#000);padding:0 16px 40px}
.fn-wrap{display:grid;gap:14px;max-width:780px;margin:0 auto}
.fn-bar{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;padding:12px 0;background:inherit}.fn-bar b{font-size:1.1rem}.fn-bar small{color:var(--muted)}.fn-bar .fn-grow{flex:1}
.fn-dots6{display:flex;gap:4px}.fn-dots6 i{width:10px;height:10px;border-radius:50%;background:var(--line)}.fn-dots6 i.is-used{background:var(--muted)}.fn-dots6 i.is-win{background:#16a34a}
.fn-form{display:flex;gap:8px}.fn-form input{flex:1;min-width:0;min-height:46px;padding:0 12px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);font:inherit;font-size:1.08rem}
.fn-form .button{flex:none;width:auto;min-width:76px}.fn-form input.is-bad{border-color:var(--red)}.fn-form input.is-ok{border-color:#16a34a}
.fn-keys{display:flex;flex-wrap:wrap;gap:6px}.fn-keys button{min-width:42px;min-height:36px;padding:0 10px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--ink);font:inherit;font-size:.92rem;cursor:pointer}
.fn-keys button:hover{border-color:var(--gold)}
.fn-help{margin:0;color:var(--muted);font-size:.84rem;line-height:1.6}.fn-err{margin:0;color:var(--red);font-size:.88rem}
.fn-start{display:flex;flex-wrap:wrap;align-items:center;gap:6px;color:var(--muted);font-size:.86rem}.fn-start button{padding:3px 10px;border:1px dashed var(--line);border-radius:999px;background:none;color:var(--ink);font:inherit;font-size:.86rem;cursor:pointer}
.fn-rows{display:grid;gap:6px}.fn-row{display:grid;grid-template-columns:minmax(96px,1.3fr) repeat(7,minmax(0,1fr));gap:4px;align-items:stretch}
.fn-row .fn-expr{display:flex;align-items:center;gap:6px;min-width:0;font-weight:700;overflow-wrap:anywhere}.fn-row .fn-expr i{width:10px;height:10px;flex:none;border-radius:50%}
.fn-t{display:grid;align-content:center;gap:1px;min-height:54px;padding:4px 3px;border-radius:8px;color:#fff;text-align:center;font-size:.76rem;line-height:1.25;overflow-wrap:anywhere}
.fn-t small{opacity:.85;font-size:.66rem}.fn-t.g{background:#16a34a}.fn-t.y{background:#ca8a04}.fn-t.x{background:#6b7280}
.fn-head .fn-t{min-height:0;background:none;color:var(--muted)}
.fn-row.is-new .fn-t{animation:fn-flip .5s ease both;animation-delay:calc(var(--i) * 90ms)}
.fn-row.is-win .fn-t{animation:fn-flip .5s ease both,fn-hop .4s ease calc(var(--i) * 70ms + .7s) both;animation-delay:calc(var(--i) * 90ms),calc(var(--i) * 70ms + .7s)}
@keyframes fn-flip{0%{transform:rotateX(90deg);opacity:.3}100%{transform:none;opacity:1}}
@keyframes fn-hop{40%{transform:translateY(-8px)}100%{transform:none}}
.fn-board{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:14px;align-items:start}
.fn-plot{width:100%;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
.fn-plot .fn-grid{stroke:var(--line);stroke-width:1}.fn-plot .fn-axis{stroke:var(--muted);stroke-width:1.2}.fn-plot .fn-tick{fill:var(--muted);font-size:9px;text-anchor:middle}
.fn-dot{fill:#dc2626;stroke:var(--panel);stroke-width:2}.fn-dot.is-fresh{animation:fn-pop .6s ease both}
@keyframes fn-pop{0%{r:0}60%{r:7}100%{r:4.6}}
.fn-preview{fill:none;stroke:var(--ink);stroke-width:2;stroke-dasharray:3 4;opacity:.55}
.fn-side{display:grid;gap:10px;align-content:start}
.fn-clues{display:grid;gap:6px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
.fn-clues b{font-size:.92rem}.fn-clues ul{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}
.fn-clues li{padding:2px 8px;border-radius:999px;background:color-mix(in srgb,#dc2626 12%,var(--panel));color:var(--ink);font-size:.84rem;font-variant-numeric:tabular-nums}
.fn-clues small{color:var(--muted);font-size:.8rem}
.fn-end{display:grid;gap:10px;padding:16px;border:1px solid var(--line);border-radius:12px;background:var(--panel);text-align:center}
.fn-end strong{font-size:1.2rem}.fn-end .katex{font-size:1.3em}
.fn-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.fn-stats div{display:grid}.fn-stats b{font-size:1.3rem;font-variant-numeric:tabular-nums}.fn-stats span{color:var(--muted);font-size:.76rem}
.fn-dist{display:grid;gap:3px;text-align:left}.fn-dist div{display:grid;grid-template-columns:1.2em 1fr;gap:6px;align-items:center;font-size:.8rem}
.fn-dist i{display:block;min-width:1.6em;padding:1px 6px;border-radius:4px;background:#6b7280;color:#fff;font-style:normal;text-align:right;font-variant-numeric:tabular-nums}.fn-dist i.is-today{background:#16a34a}
.fn-next{color:var(--muted);font-size:.86rem;font-variant-numeric:tabular-nums}
@media (max-width:700px){.fn-board{grid-template-columns:1fr}}
@media (max-width:640px){.fn-row{grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}.fn-row .fn-expr{grid-column:1/-1}.fn-head .fn-expr{display:none}.fn-t{font-size:.66rem;min-height:48px;padding:3px 2px}.fn-t small{font-size:.6rem}}
@media (prefers-reduced-motion:reduce){.fn-row.is-new .fn-t,.fn-row.is-win .fn-t,.fn-dot.is-fresh{animation:none}}`;

  // 快捷鍵：插進輸入框游標的位置（手機打 ^、( 很麻煩）
  const KEYS = [["x", "x"], ["x²", "^2"], ["^", "^"], ["(", "("], [")", ")"], ["+", "+"], ["−", "-"], ["×", "*"], ["÷", "/"], ["sin", "sin("], ["cos", "cos("], ["tan", "tan("], ["eˣ", "e^"], ["ln", "ln("], ["√", "sqrt("], ["|x|", "abs("], ["π", "pi"]];
  const STARTERS = ["x", "x^2", "sin(x)", "e^x", "ln(x)", "1/x"];

  // deps = { evaluate(src, vars), loadRecords(), saveRecords(r), today() → 日期鍵, tex(src) → KaTeX 字串（可省）, track(name, params) }
  function open(deps) {
    if (!document.getElementById("fn-style")) { const st = document.createElement("style"); st.id = "fn-style"; st.textContent = CSS; document.head.appendChild(st); }
    const key = (deps.today || twDate)();
    const target = targetOf(key);
    const T = profile(deps.evaluate, target);
    const records = deps.loadRecords();
    const store = (records.funcle && records.funcle.days) || {};
    const day = store[key] || { g: [], won: false };
    const guesses = day.g.map((src) => ({ src, p: profile(deps.evaluate, src) })).filter((x) => x.p);
    let err = "";
    let fresh = -1; // 剛猜的那一列（翻牌動畫）
    let draft = "";
    const ov = document.createElement("div");
    ov.className = "fn-ov";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", "今日函數");
    document.body.appendChild(ov);
    let tick = 0;
    const onKey = (e) => { if (e.key === "Escape") shut(); };
    // 關掉時讓 app 重畫：首頁「今天三件事」、訓練頁的「今日函數 ✓」立刻打勾
    const shut = () => { window.clearInterval(tick); ov.remove(); document.removeEventListener("keydown", onKey); if (deps.onClose) deps.onClose(); };
    document.addEventListener("keydown", onKey);
    const done = () => day.won || guesses.length >= 6;
    const misses = () => (day.won ? guesses.length - 1 : guesses.length);
    const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const streakAt = (k) => { let n = 0; const d = new Date(`${k}T12:00:00`); for (;;) { if (!(store[ymd(d)] && store[ymd(d)].won)) break; n += 1; d.setDate(d.getDate() - 1); } return n; };
    // 戰績：玩完的天數、猜中率、連勝、最長連勝、幾次猜中的分布
    function stats() {
      const keys = Object.keys(store).filter((k) => store[k] && (store[k].won || (store[k].g || []).length >= 6)).sort();
      const wins = keys.filter((k) => store[k].won);
      const dist = [1, 2, 3, 4, 5, 6].map((n) => wins.filter((k) => store[k].g.length === n).length);
      let best = 0; let run = 0; let prev = null;
      keys.forEach((k) => {
        const next = prev && ymd(new Date(new Date(`${prev}T12:00:00`).getTime() + 86400000)) === k;
        run = store[k].won ? (next && run ? run + 1 : 1) : 0;
        best = Math.max(best, run);
        prev = k;
      });
      return { played: keys.length, rate: keys.length ? Math.round((wins.length / keys.length) * 100) : 0, streak: streakAt(key), best, dist };
    }
    const save = () => {
      const r = deps.loadRecords();
      r.funcle = { ...(r.funcle || {}), days: { ...((r.funcle && r.funcle.days) || {}), [key]: { g: guesses.map((x) => x.src), won: day.won } } };
      deps.saveRecords(r);
      store[key] = { g: guesses.map((x) => x.src), won: day.won };
    };
    const shareText = () => `今日函數 ${key} ${day.won ? guesses.length : "X"}/6\n${guesses.map((x) => tiles(x.p, T).map((t) => ({ g: "🟩", y: "🟨", x: "⬜" }[t.c])).join("")).join("\n")}`;
    // 下一題：台灣時間半夜 12 點
    const untilNext = () => {
      const now = Date.now();
      const next = Date.parse(`${twDate(now + 86400000)}T00:00:00+08:00`);
      const s = Math.max(0, Math.floor((next - now) / 1000));
      return `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    };
    function cluesNow() {
      const n = done() ? CLUE_XS.length : Math.min(CLUE_XS.length, misses() * CLUES_PER_MISS);
      const newFrom = fresh >= 0 && !day.won ? n - CLUES_PER_MISS : n;
      return CLUE_XS.slice(0, n).map((x, i) => ({ x, y: T.at(x), fresh: i >= newFrom }));
    }
    function paint() {
      const end = done();
      const series = guesses.map((x, i) => ({ ys: x.p.ys, color: COLORS[i % COLORS.length] }));
      if (end) series.push({ ys: T.ys, color: "#dc2626", bold: true, dash: !day.won });
      const dots = end ? [] : cluesNow();
      const s = end ? stats() : null;
      const mx = s ? Math.max(1, ...s.dist) : 1;
      ov.innerHTML = `<div class="fn-wrap">
        <div class="fn-bar"><b>今日函數</b><span class="fn-dots6" aria-label="第 ${Math.min(6, guesses.length + (end ? 0 : 1))} / 6 次">${[0, 1, 2, 3, 4, 5].map((i) => `<i class="${i < guesses.length ? (day.won && i === guesses.length - 1 ? "is-win" : "is-used") : ""}"></i>`).join("")}</span><small>${key}${streakAt(key) ? ` · 連續 ${streakAt(key)} 天` : ""}</small><span class="fn-grow"></span><button type="button" class="button secondary" data-fn="close">關閉</button></div>
        ${end ? "" : `<form class="fn-form" data-fn-form><input data-fn-input autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="猜一個函數，例如 x^2 - 1" aria-label="猜的函數" value="${esc(draft)}"><button class="button home-primary" type="submit">猜</button></form>
          <div class="fn-keys" aria-label="快捷鍵">${KEYS.map(([label, ins]) => `<button type="button" data-fn-ins="${esc(ins)}" tabindex="-1">${esc(label)}</button>`).join("")}<button type="button" data-fn-del tabindex="-1" aria-label="刪一個字">⌫</button></div>
          ${guesses.length ? "" : `<div class="fn-start"><span>不知道從哪下手？先猜一個看看：</span>${STARTERS.map((g) => `<button type="button" data-fn-try="${esc(g)}">${esc(g)}</button>`).join("")}</div>
          <p class="fn-help">每猜一次，七格會告訴你答案的樣子：綠＝一樣、黃＝很接近、灰＝不對，↑ 是答案比你猜的大。猜錯一次，圖上就多露出答案的 3 個點。</p>`}`}
        ${err ? `<p class="fn-err" role="alert">${esc(err)}</p>` : ""}
        ${guesses.length ? `<div class="fn-rows">
          <div class="fn-row fn-head"><span class="fn-expr"></span>${tiles(guesses[0].p, T).map((t) => `<span class="fn-t">${esc(t.label)}</span>`).join("")}</div>
          ${guesses.map((x, i) => `<div class="fn-row${i === fresh ? " is-new" : ""}${i === fresh && day.won && i === guesses.length - 1 ? " is-win" : ""}"><span class="fn-expr"><i style="background:${COLORS[i % COLORS.length]}"></i>${esc(x.src)}</span>${tiles(x.p, T).map((t, k) => `<span class="fn-t ${t.c}" style="--i:${k}">${esc(t.text)}${t.arrow ? ` ${t.arrow}` : ""}<small>${esc(t.label)}</small></span>`).join("")}</div>`).join("")}
        </div>` : ""}
        <div class="fn-board">
          <div data-fn-plot>${plot(series, dots)}</div>
          <div class="fn-side">
            ${end ? `<div class="fn-end"><strong>${day.won ? `猜中了！${guesses.length} 次` : "今天的答案是"}</strong><div>${deps.tex ? deps.tex(`f(x)=${toTex(target)}`) : esc(target)}</div>
              <div class="fn-stats"><div><b>${s.played}</b><span>玩過</span></div><div><b>${s.rate}%</b><span>猜中率</span></div><div><b>${s.streak}</b><span>連勝</span></div><div><b>${s.best}</b><span>最長連勝</span></div></div>
              <div class="fn-dist" aria-label="幾次猜中的分布">${s.dist.map((n, i) => `<div><span>${i + 1}</span><i class="${day.won && guesses.length === i + 1 ? "is-today" : ""}" style="width:${Math.max(8, (n / mx) * 100)}%">${n}</i></div>`).join("")}</div>
              <div class="action-row" style="justify-content:center"><button type="button" class="button secondary" data-fn="share">複製結果</button></div><small data-fn-copied></small>
              <span class="fn-next">下一題 <b data-fn-next>${untilNext()}</b>（台灣時間半夜 12 點）</span></div>`
              : `<div class="fn-clues"><b>線索點</b>${dots.length ? `<ul>${dots.map((d) => `<li>f(${fmt(d.x)}) = ${Number.isFinite(d.y) ? fmt(d.y) : "無定義"}</li>`).join("")}</ul>` : ""}<small>${dots.length ? `圖上的紅點是答案經過的地方。` : `猜錯一次，就會在圖上露出答案的 ${CLUES_PER_MISS} 個點。`}${guesses.length ? "" : "打字時，你的式子會先畫成虛線。"}</small></div>`}
          </div>
        </div>
      </div>`;
      fresh = -1;
      const input = ov.querySelector("[data-fn-input]");
      if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); preview(); }
      window.clearInterval(tick);
      if (end) tick = window.setInterval(() => { const n = ov.querySelector("[data-fn-next]"); if (n) n.textContent = untilNext(); }, 1000);
    }
    // 打字時：看得懂就把自己的式子畫成虛線（猜之前先看看形狀）
    let pt = 0;
    function preview() {
      window.clearTimeout(pt);
      pt = window.setTimeout(() => {
        const input = ov.querySelector("[data-fn-input]");
        const line = ov.querySelector("[data-fn-preview]");
        if (!input || !line) return;
        draft = input.value;
        const src = input.value.trim();
        const p = src ? profile(deps.evaluate, src) : null;
        line.setAttribute("d", p ? path(p.ys) : "");
        input.classList.toggle("is-ok", Boolean(p));
        input.classList.toggle("is-bad", Boolean(src) && !p);
      }, 120);
    }
    function insert(text) {
      const input = ov.querySelector("[data-fn-input]");
      if (!input) return;
      const a = input.selectionStart == null ? input.value.length : input.selectionStart;
      const b = input.selectionEnd == null ? a : input.selectionEnd;
      input.value = input.value.slice(0, a) + text + input.value.slice(b);
      input.setSelectionRange(a + text.length, a + text.length);
      input.focus();
      preview();
    }
    function guess(src) {
      if (!src || done()) return;
      const p = profile(deps.evaluate, src);
      if (!p) { err = `看不懂「${src}」：試試 x^2 - 1、sin(x)、e^x 這種寫法。`; draft = src; paint(); return; }
      if (guesses.some((x) => same(x.p, p))) { err = "這個猜過了（或跟猜過的一樣）。"; draft = src; paint(); return; }
      err = "";
      draft = "";
      guesses.push({ src, p });
      fresh = guesses.length - 1;
      if (same(p, T)) day.won = true;
      save();
      if (done() && deps.track) deps.track("funcle_done", { won: day.won, tries: guesses.length });
      paint();
    }
    ov.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = ov.querySelector("[data-fn-input]");
      guess(String(input && input.value || "").trim());
    });
    ov.addEventListener("input", (e) => { if (e.target.matches && e.target.matches("[data-fn-input]")) preview(); });
    // 快捷鍵按下去不要讓輸入框失焦（手機鍵盤會收起來）
    ov.addEventListener("pointerdown", (e) => { if (e.target.closest && e.target.closest("[data-fn-ins],[data-fn-del]")) e.preventDefault(); });
    ov.addEventListener("click", (e) => {
      const ins = e.target.closest && e.target.closest("[data-fn-ins]");
      if (ins) { insert(ins.dataset.fnIns); return; }
      if (e.target.closest && e.target.closest("[data-fn-del]")) {
        const input = ov.querySelector("[data-fn-input]");
        if (!input) return;
        const a = input.selectionStart || 0; const b = input.selectionEnd || a;
        const from = a === b ? Math.max(0, a - 1) : a;
        input.value = input.value.slice(0, from) + input.value.slice(b);
        input.setSelectionRange(from, from);
        input.focus();
        preview();
        return;
      }
      const tryBtn = e.target.closest && e.target.closest("[data-fn-try]");
      if (tryBtn) { guess(tryBtn.dataset.fnTry); return; }
      const b = e.target.closest && e.target.closest("[data-fn]");
      if (!b) return;
      if (b.dataset.fn === "close") shut();
      if (b.dataset.fn === "share") {
        const note = ov.querySelector("[data-fn-copied]");
        const p = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(shareText()) : Promise.reject();
        p.then(() => { if (note) note.textContent = "複製好了，貼給朋友吧。"; }, () => { if (note) note.textContent = shareText(); });
      }
    });
    paint();
  }

  window.BuzzFuncle = { open, profile, tiles, targetOf, familyOf, toTex, twDate, TARGETS };
})();
