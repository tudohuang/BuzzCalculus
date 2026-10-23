// 交付的筆記本課（tools/import_notebook.js 轉的）黑板上的函數圖：plot 動作帶 nb（BuzzNotebook 的 plot 規格＋滑桿值），在這裡畫成 svg。
// 下面是 BuzzNotebook（Downloads/BuzzNotebook/plugins/math/browser.js）原樣搬過來的 plot 畫法，跟交付者預覽看到的一樣；
// 跟 course_board_plot.js 同一組（data-lazy="boardplot"：節裡有圖才抓）。顏色換成網站黑板的變數（筆記本／黑板兩種主題都對）。
(function () {
  "use strict";
  const NB = window.BuzzNotebook || (window.BuzzNotebook = {
    esc: (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c])),
    fmt: (v) => (Number.isFinite(v) ? String(Number(v.toPrecision(4))).replace(/^-/, "−") : "—"),
    plugin(p) { NB.math = p; }
  });
  if (!NB.plugin) NB.plugin = (p) => { NB.math = p; };
})();
// 數學外掛（瀏覽器端）：$…$ 行內式、$$…$$ 展示式（KaTeX），以及 plot 圖（函數圖＋滑桿參數）。
// 換學科就換外掛：外掛只要給 inline（行內記號）、display（展示式）、figures（圖的種類）。
(function () {
  "use strict";
  const NB = window.BuzzNotebook;
  const esc = NB.esc;

  function tex(src, displayMode) {
    try {
      return window.katex.renderToString(String(src), { displayMode, throwOnError: false, output: "html", strict: "ignore", trust: false });
    } catch (_e) {
      return `<code>${esc(src)}</code>`;
    }
  }

  /* ── 式子 → 函式（只認得白名單：數字、變數、函數、+ − × ÷ ^、括號、|絕對值|；省略乘號也可以：2x、x sin(x)） ── */
  const FN = {
    sin: "Math.sin", cos: "Math.cos", tan: "Math.tan", asin: "Math.asin", acos: "Math.acos", atan: "Math.atan",
    arcsin: "Math.asin", arccos: "Math.acos", arctan: "Math.atan", sinh: "Math.sinh", cosh: "Math.cosh", tanh: "Math.tanh",
    exp: "Math.exp", ln: "Math.log", log: "Math.log10", sqrt: "Math.sqrt", abs: "Math.abs", floor: "Math.floor", ceil: "Math.ceil",
    sign: "Math.sign", min: "Math.min", max: "Math.max", sec: "(1/Math.cos)", csc: "(1/Math.sin)", cot: "(1/Math.tan)", cbrt: "Math.cbrt"
  };
  const RECIP = { sec: "Math.cos", csc: "Math.sin", cot: "Math.tan" };
  const CONST = { pi: "Math.PI", e: "Math.E", π: "Math.PI" };
  const cache = new Map();
  function compile(expr, vars) {
    const key = `${expr}|${vars.join(",")}`;
    if (cache.has(key)) return cache.get(key);
    const src = String(expr).replace(/·|×/g, "*").replace(/−/g, "-").replace(/÷/g, "/");
    const toks = [];
    const re = /\s*(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+|[A-Za-z_π][A-Za-z_0-9]*|\*\*|[-+*/^(),|])/y;
    let m;
    re.lastIndex = 0;
    while (re.lastIndex < src.length) {
      const at = re.lastIndex;
      m = re.exec(src);
      if (!m) { if (/^\s*$/.test(src.slice(at))) break; throw new Error(`看不懂的式子：${expr}（第 ${at + 1} 個字）`); }
      toks.push(m[1] === "**" ? "^" : m[1]);
    }
    let i = 0;
    const peek = () => toks[i];
    const take = (t) => { if (toks[i] !== t) throw new Error(`式子 ${expr}：這裡要 ${t}`); i += 1; };
    // 一個名字可能是 sinx、xy 這種黏在一起的：拆成已知的名字
    const splitName = (name) => {
      if (vars.includes(name) || FN[name] || CONST[name]) return [name];
      const out = [];
      let s = name;
      const known = [...Object.keys(FN), ...Object.keys(CONST), ...vars].sort((a, b) => b.length - a.length);
      while (s.length) {
        const k = known.find((w) => s.startsWith(w));
        if (!k) throw new Error(`式子 ${expr}：不認得「${name}」（變數只有 ${vars.join("、")}）`);
        out.push(k);
        s = s.slice(k.length);
      }
      return out;
    };
    for (let k = 0; k < toks.length; k += 1) {
      if (/^[A-Za-z_π]/.test(toks[k])) { const parts = splitName(toks[k]); if (parts.length > 1) { toks.splice(k, 1, ...parts); k += parts.length - 1; } }
    }
    const startsPrimary = (t) => t !== undefined && (/^[\d.A-Za-z_π(]/.test(t));
    function expression() {
      let s = term();
      while (peek() === "+" || peek() === "-") { const op = toks[i++]; s = `(${s}${op}${term()})`; }
      return s;
    }
    function term() {
      let s = unary();
      for (;;) {
        if (peek() === "*" || peek() === "/") { const op = toks[i++]; s = `(${s}${op}${unary()})`; }
        else if (startsPrimary(peek()) || (peek() === "|" && absOpen === 0)) s = `(${s}*${power()})`;
        else break;
      }
      return s;
    }
    function unary() {
      if (peek() === "-") { i += 1; return `(-${unary()})`; }
      if (peek() === "+") { i += 1; return unary(); }
      return power();
    }
    function power() {
      const base = primary();
      if (peek() === "^") { i += 1; return `Math.pow(${base},${unary()})`; }
      return base;
    }
    let absOpen = 0;
    function primary() {
      const t = toks[i++];
      if (t === undefined) throw new Error(`式子 ${expr} 沒寫完`);
      if (/^[\d.]/.test(t)) return `(${t})`;
      if (t === "(") { const s = expression(); take(")"); return s; }
      if (t === "|") { absOpen += 1; const s = expression(); take("|"); absOpen -= 1; return `Math.abs(${s})`; }
      if (CONST[t] && !vars.includes(t)) return CONST[t];
      if (vars.includes(t)) return t;
      if (FN[t]) {
        // sin^2(x)：先套函數再平方
        let pow = null;
        if (peek() === "^") { i += 1; pow = primary(); }
        let arg;
        if (peek() === "(") {
          i += 1;
          const args = [expression()];
          while (peek() === ",") { i += 1; args.push(expression()); }
          take(")");
          arg = args.join(",");
        } else arg = power();
        const call = RECIP[t] ? `(1/${RECIP[t]}(${arg}))` : `${FN[t]}(${arg})`;
        return pow ? `Math.pow(${call},${pow})` : call;
      }
      throw new Error(`式子 ${expr}：不認得「${t}」`);
    }
    const js = expression();
    if (i < toks.length) throw new Error(`式子 ${expr}：多了「${toks[i]}」`);
    // eslint-disable-next-line no-new-func
    const fn = new Function(...vars, `"use strict"; return ${js};`);
    cache.set(key, fn);
    return fn;
  }

  /* ── plot：函數圖 ── */
  const COLOR = (c) => (c ? (/^(red|blue|green|orange|purple|pencil|ink)$/.test(c) ? `var(--nb-${c})` : c) : "var(--nb-ink)");
  function niceStep(span, target) {
    const raw = span / target;
    const p = Math.pow(10, Math.floor(Math.log10(raw)));
    const m = raw / p;
    return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
  }
  function params(spec) {
    const out = {};
    Object.entries(spec.params || {}).forEach(([name, d]) => {
      const a = Array.isArray(d) ? { min: d[0], max: d[1], value: d[2] } : d;
      const min = Number(a.min), max = Number(a.max);
      out[name] = { min, max, value: a.value == null ? min : Number(a.value), step: a.step == null ? (max - min) / 200 : Number(a.step), label: a.label || name };
    });
    return out;
  }
  function render(spec, values, size) {
    const names = Object.keys(values);
    const vars = ["x", ...names];
    const vals = names.map((k) => values[k]);
    const num = (e) => (typeof e === "number" ? e : compile(String(e), names)(...vals));
    const fnOf = (e) => { const f = compile(String(e), vars); return (x) => f(x, ...vals); };
    let [x0, x1, y0, y1] = (spec.window || [-5, 5, -5, 5]).map(num);
    const w = size.w, h = size.h;
    const L = 46, R = 16, T = 14, B = 34;
    const pw = w - L - R, ph = h - T - B;
    if (spec.equal) {
      const ux = pw / (x1 - x0), uy = ph / (y1 - y0);
      if (ux > uy) { const c = (x0 + x1) / 2, half = (pw / uy) / 2; x0 = c - half; x1 = c + half; }
      else { const c = (y0 + y1) / 2, half = (ph / ux) / 2; y0 = c - half; y1 = c + half; }
    }
    const X = (x) => L + ((x - x0) / (x1 - x0)) * pw;
    const Y = (y) => T + (1 - (y - y0) / (y1 - y0)) * ph;
    const out = [];
    const fz = 21;
    out.push(`<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-size="${fz}" font-family="inherit" role="img" aria-label="${esc(spec.caption || "函數圖")}">`);
    out.push(`<defs><clipPath id="c${spec.id || ""}${w}${h}"><rect x="${L}" y="${T}" width="${pw}" height="${ph}"/></clipPath><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--nb-ink)"/></marker></defs>`);
    const clip = `clip-path="url(#c${spec.id || ""}${w}${h})"`;
    // 格線與刻度
    const sx = spec.xstep ? num(spec.xstep) : niceStep(x1 - x0, 8);
    const sy = spec.ystep ? num(spec.ystep) : niceStep(y1 - y0, 6);
    const ticks = [];
    const axY = clamp(Y(0), T, T + ph), axX = clamp(X(0), L, L + pw);
    for (let v = Math.ceil(x0 / sx) * sx; v <= x1 + 1e-9; v += sx) {
      out.push(`<line x1="${X(v)}" y1="${T}" x2="${X(v)}" y2="${T + ph}" stroke="var(--nb-pencil)" stroke-opacity=".18"/>`);
      if (Math.abs(v) > 1e-9) ticks.push(`<text x="${X(v)}" y="${Math.min(axY + fz + 4, h - 6)}" text-anchor="middle" fill="var(--nb-pencil)">${esc(NB.fmt(v))}</text>`);
    }
    for (let v = Math.ceil(y0 / sy) * sy; v <= y1 + 1e-9; v += sy) {
      out.push(`<line x1="${L}" y1="${Y(v)}" x2="${L + pw}" y2="${Y(v)}" stroke="var(--nb-pencil)" stroke-opacity=".18"/>`);
      if (Math.abs(v) > 1e-9) ticks.push(`<text x="${Math.max(axX - 6, L - 4)}" y="${Y(v) + 7}" text-anchor="end" fill="var(--nb-pencil)">${esc(NB.fmt(v))}</text>`);
    }
    out.push(`<line x1="${L}" y1="${axY}" x2="${L + pw}" y2="${axY}" stroke="var(--nb-ink)" stroke-width="2" marker-end="url(#ah)"/>`);
    out.push(`<line x1="${axX}" y1="${T + ph}" x2="${axX}" y2="${T}" stroke="var(--nb-ink)" stroke-width="2" marker-end="url(#ah)"/>`);
    out.push(ticks.join(""));
    if (spec.xlabel !== false) out.push(`<text x="${L + pw - 4}" y="${axY - 8}" text-anchor="end" fill="var(--nb-ink)" font-style="italic">${esc(spec.xlabel || "x")}</text>`);
    if (spec.ylabel !== false) out.push(`<text x="${axX + 8}" y="${T + fz}" fill="var(--nb-ink)" font-style="italic">${esc(spec.ylabel || "y")}</text>`);
    // 面積
    [].concat(spec.area || []).forEach((a) => {
      const f = fnOf(a.expr), g = a.under != null ? fnOf(a.under) : () => 0;
      const a0 = num(a.from), a1 = num(a.to);
      const n = 160, pts = [];
      for (let k = 0; k <= n; k += 1) { const x = a0 + ((a1 - a0) * k) / n; pts.push(`${X(x)},${Y(f(x))}`); }
      for (let k = n; k >= 0; k -= 1) { const x = a0 + ((a1 - a0) * k) / n; pts.push(`${X(x)},${Y(g(x))}`); }
      out.push(`<polygon points="${pts.join(" ")}" fill="${COLOR(a.color || "blue")}" fill-opacity=".18" ${clip}/>`);
    });
    // 曲線
    const placed = [];
    [].concat(spec.fn || []).forEach((c, ci) => {
      const o = typeof c === "string" ? { expr: c } : c;
      const f = fnOf(o.expr);
      const d0 = o.domain ? num(o.domain[0]) : x0, d1 = o.domain ? num(o.domain[1]) : x1;
      const n = Math.max(200, Math.round(pw));
      let d = "", pen = false, prevY = null;
      const span = y1 - y0;
      for (let k = 0; k <= n; k += 1) {
        const x = d0 + ((d1 - d0) * k) / n;
        let yv;
        try { yv = f(x); } catch (_e) { yv = NaN; }
        if (!Number.isFinite(yv) || (prevY !== null && Math.abs(yv - prevY) > span * 3)) { pen = false; prevY = Number.isFinite(yv) ? yv : null; if (!Number.isFinite(yv)) continue; }
        const yy = clamp(yv, y0 - span * 2, y1 + span * 2);
        d += `${pen ? "L" : "M"}${X(x).toFixed(1)} ${Y(yy).toFixed(1)}`;
        pen = true;
        prevY = yv;
      }
      out.push(`<path d="${d}" fill="none" stroke="${COLOR(o.color || (ci ? ["blue", "red", "green", "orange", "purple"][(ci - 1) % 5] : "ink"))}" stroke-width="${o.width || 3}" stroke-linecap="round" stroke-linejoin="round"${o.dash ? " stroke-dasharray=\"10 8\"" : ""} ${clip}/>`);
      if (o.label) {
        // 標籤放在曲線還在框裡的最右邊那一段（不要貼著曲線衝出框的地方）；跟已經放的標籤錯開
        const inside = (x) => { try { const v = f(x); return Number.isFinite(v) && v > y0 + 0.06 * span && v < y1 - 0.12 * span ? v : null; } catch (_e) { return null; } };
        let lx = o.labelAt != null ? num(o.labelAt) : null;
        if (lx == null) for (let k = 0; k <= 60; k += 1) { const x = d1 - (d1 - d0) * (0.04 + k * 0.015); if (inside(x) != null) { lx = x; break; } }
        const ly = lx == null ? null : inside(lx);
        if (ly != null) {
          let yy = Y(ly) - 12;
          while (placed.some((p) => Math.abs(p - yy) < fz + 2)) yy += fz + 4;
          placed.push(yy);
          out.push(`<text x="${X(lx) - 6}" y="${clamp(yy, T + fz, T + ph - 4)}" text-anchor="end" fill="${COLOR(o.color || (ci ? ["blue", "red", "green", "orange", "purple"][(ci - 1) % 5] : "ink"))}">${esc(o.label)}</text>`);
        }
      }
    });
    // 直線段、鉛直線、水平線
    [].concat(spec.lines || []).forEach((l) => {
      out.push(`<line x1="${X(num(l.from[0]))}" y1="${Y(num(l.from[1]))}" x2="${X(num(l.to[0]))}" y2="${Y(num(l.to[1]))}" stroke="${COLOR(l.color || "pencil")}" stroke-width="${l.width || 2.5}"${l.dash ? " stroke-dasharray=\"8 7\"" : ""} ${clip}/>`);
    });
    [].concat(spec.vlines || []).forEach((l) => {
      const o = typeof l === "object" ? l : { x: l };
      const x = X(num(o.x));
      out.push(`<line x1="${x}" y1="${T}" x2="${x}" y2="${T + ph}" stroke="${COLOR(o.color || "pencil")}" stroke-width="2" stroke-dasharray="8 7"/>`);
      if (o.label) out.push(`<text x="${x + 6}" y="${T + ph - 8}" fill="${COLOR(o.color || "pencil")}">${esc(o.label)}</text>`);
    });
    [].concat(spec.hlines || []).forEach((l) => {
      const o = typeof l === "object" ? l : { y: l };
      const y = Y(num(o.y));
      out.push(`<line x1="${L}" y1="${y}" x2="${L + pw}" y2="${y}" stroke="${COLOR(o.color || "pencil")}" stroke-width="2" stroke-dasharray="8 7"/>`);
      if (o.label) out.push(`<text x="${L + 6}" y="${y - 8}" fill="${COLOR(o.color || "pencil")}">${esc(o.label)}</text>`);
    });
    // 點與標籤
    [].concat(spec.points || []).forEach((p) => {
      const px = num(p.x), py = num(p.y);
      if (!Number.isFinite(px) || !Number.isFinite(py)) return;
      const c = COLOR(p.color || "red");
      out.push(`<circle cx="${X(px)}" cy="${Y(py)}" r="7" fill="${p.open ? "var(--nb-paper)" : c}" stroke="${c}" stroke-width="2.5"/>`);
      if (p.label) out.push(`<text x="${X(px) + 11}" y="${Y(py) - 11}" fill="${c}">${esc(p.label)}</text>`);
    });
    [].concat(spec.labels || []).forEach((l) => {
      out.push(`<text x="${X(num(l.x))}" y="${Y(num(l.y))}" fill="${COLOR(l.color || "ink")}" text-anchor="${l.anchor || "start"}">${esc(l.text)}</text>`);
    });
    out.push("</svg>");
    // 讀數：{式子} 換成算出來的數
    const readout = spec.readout ? String(spec.readout).replace(/\{([^{}]+)\}/g, (_m, e) => { try { return NB.fmt(num(e)); } catch (_x) { return "—"; } }) : "";
    return { svg: out.join(""), readout };
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  NB.plugin({
    name: "math",
    inline: [
      { re: /\\\$/g, html: () => "$" },
      { re: /\$\$([^$]+?)\$\$/g, html: (_m, a) => tex(a, true) },
      { re: /\$([^$\n]+?)\$/g, html: (_m, a) => tex(a, false) }
    ],
    display: (src) => tex(src, true),
    figures: { plot: { params, render } },
    compile
  });
})();
(function () {
  "use strict";
  const VARS = { ink: "var(--ink)", pencil: "var(--muted)", red: "var(--red)", blue: "var(--blue)", green: "var(--green)", orange: "var(--gold)", purple: "var(--violet)", paper: "var(--paper)", hl: "#f5d56e", margin: "transparent", grid: "var(--line)", grid2: "var(--line)", font: "inherit" };
  const site = (svg) => String(svg).replace(/var\(--nb-([a-z0-9]+)\)/g, (m, k) => VARS[k] || m);
  // nb = { spec, vals }：spec 是 BuzzNotebook 的 plot 規格，vals 是這一張的滑桿值（@set 動過的）
  function svg(nb) {
    const P = window.BuzzNotebook.math.figures.plot;
    const defs = P.params(nb.spec);
    const vals = {};
    Object.entries(defs).forEach(([k, d]) => { vals[k] = nb.vals && k in nb.vals ? nb.vals[k] : d.value; });
    const out = P.render(nb.spec, vals, { w: 640, h: Math.min(Number(nb.spec.height) || 300, 520) });
    return { svg: site(out.svg), readout: out.readout || "" };
  }
  window.BuzzNotebookPlot = { svg, site };
})();
