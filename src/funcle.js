// ── 今日函數（微積分版 Wordle；data-lazy="funcle"，訓練頁「每日」那一格點了才抓）──
// 每天一個神秘函數（照日期挑，大家同一題），猜 6 次。每次打一個式子，回六個特徵：
//   f(0)、f(1)（對＝綠、差 1 以內＝黃，箭頭說要往大還是往小）、定義域、奇偶、[−5, 5] 的零點個數（差 1＝黃）、x → ∞。
// 猜的畫圖；答案的圖最後才揭曉。在取樣點上跟答案一樣就算猜中（x² − 1 與 (x − 1)(x + 1) 都算）。
// 紀錄：records.funcle = { days: { "2026-10-23": { g: [式子…], won } } }（app.js 給 loadRecords／saveRecords）。
(function () {
  "use strict";

  // 題目：中學到大一會認得的函數，六個特徵分得開。日期決定是哪一題（順序固定洗過，連著幾天不會是同一型）
  const TARGETS = [
    "x^2-1", "x^3-3x", "sin(x)", "cos(x)", "e^x", "ln(x)", "1/x", "abs(x)", "sqrt(x)", "x*sin(x)",
    "x^2-4x+3", "e^(-x^2)", "x/(x^2+1)", "x^3", "2^x", "x^4-2x^2", "sin(2x)", "x+1/x", "ln(x^2+1)", "x*e^(-x)",
    "1/(x^2+1)", "x^2+x-2", "cos(x)-1", "x^3-x", "e^x-1", "sqrt(x+4)", "abs(x-2)", "x^2*e^x", "atan(x)", "sin(x)/x",
    "(x-1)^2", "x^5-5x", "1/(x-1)", "ln(x)/x", "e^(-x)", "x^2-2", "cos(2x)+1", "x^3+x", "4-x^2", "sqrt(9-x^2)",
    "x*cos(x)", "1-e^(-x)", "x^2/(x^2+1)", "ln(x+1)", "x^4-16", "2x-3", "abs(x^2-4)", "sin(x)+x", "e^x+e^(-x)", "tan(x)"
  ];
  const XS = Array.from({ length: 201 }, (_, i) => -5 + i * 0.05);
  const FAR = [1e2, 2e2, 5e2, 1e3, 2e3, 5e3, 1e4, 2e4, 5e4, 1e5];
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  function targetOf(key) {
    const day = Math.round(Date.parse(`${key}T12:00:00Z`) / 86400000);
    return TARGETS[((day * 37) % TARGETS.length + TARGETS.length) % TARGETS.length];
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // 一個式子 → 取樣值與六個特徵
  // 常見的寫法先換成算式引擎讀得懂的：|x| → abs(x)、x³ → x^3、全形的 − × ÷
  const tidy = (src) => String(src).replace(/[−–]/g, "-").replace(/×/g, "*").replace(/÷/g, "/").replace(/²/g, "^2").replace(/³/g, "^3").replace(/⁴/g, "^4").replace(/\|([^|]+)\|/g, "abs($1)");
  function profile(ev, raw) {
    const src = tidy(raw);
    const f = (x) => { const y = ev(src, { x }); return Number.isFinite(y) ? y : NaN; };
    const ys = XS.map(f);
    if (!ys.some(Number.isFinite)) return null;
    const at = (x) => f(x);
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
    const far = FAR.map(f);
    let inf;
    if (!far.every(Number.isFinite)) inf = "沒有定義";
    // x = 10²…10⁵ 取十點：最後幾點幾乎一樣 → 收斂到那個數；一路變大（ln x 這種慢慢長的也算）→ +∞；一路變小 → −∞；其他 → 振盪
    else if (Math.abs(far[9] - far[8]) < 1e-3 * (1 + Math.abs(far[9])) && Math.abs(far[8] - far[7]) < 2e-3 * (1 + Math.abs(far[9]))) inf = `→ ${fmt(Math.round(far[9] * 100) / 100)}`;
    else if (far.every((v, i) => !i || v > far[i - 1])) inf = "→ +∞";
    else if (far.every((v, i) => !i || v < far[i - 1])) inf = "→ −∞";
    else inf = "不收斂（振盪）";
    return { ys, f0: at(0), f1: at(1), domain, parity, zeros: Math.min(zeros, 9), inf };
  }
  function same(a, b) {
    return a.ys.every((y, i) => { const z = b.ys[i]; return Number.isFinite(y) ? Number.isFinite(z) && Math.abs(y - z) < 1e-6 * (1 + Math.abs(y)) : !Number.isFinite(z); });
  }
  // 一格的顏色：g 綠、y 黃、x 灰；num 的格子帶箭頭（答案比你猜的大 ↑）
  function tiles(guess, target) {
    const num = (label, a, b) => {
      if (!Number.isFinite(a) || !Number.isFinite(b)) return { label, text: Number.isFinite(a) ? fmt(a) : "無定義", c: Number.isFinite(a) === Number.isFinite(b) ? "g" : "x", arrow: "" };
      const d = b - a;
      return { label, text: fmt(a), c: Math.abs(d) < 1e-6 ? "g" : Math.abs(d) <= 1 ? "y" : "x", arrow: Math.abs(d) < 1e-6 ? "" : d > 0 ? "↑" : "↓" };
    };
    return [
      num("f(0)", guess.f0, target.f0),
      num("f(1)", guess.f1, target.f1),
      { label: "定義域", text: guess.domain, c: guess.domain === target.domain ? "g" : "x", arrow: "" },
      { label: "奇偶", text: guess.parity, c: guess.parity === target.parity ? "g" : "x", arrow: "" },
      { label: "零點數", text: `${guess.zeros} 個`, c: guess.zeros === target.zeros ? "g" : Math.abs(guess.zeros - target.zeros) === 1 ? "y" : "x", arrow: guess.zeros === target.zeros ? "" : target.zeros > guess.zeros ? "↑" : "↓" },
      { label: "x → ∞", text: guess.inf, c: guess.inf === target.inf ? "g" : "x", arrow: "" }
    ];
  }
  function fmt(v) { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? "0" : String(r); }

  // 圖：x ∈ [−5, 5]、y 截在 [−6, 6]；斷開的地方斷線
  const COLORS = ["#2563eb", "#16a34a", "#9333ea", "#ea580c", "#0891b2", "#db2777"];
  function plot(series) {
    const W = 340; const H = 240;
    const sx = (x) => ((x + 5) / 10) * W;
    const sy = (y) => H / 2 - (y / 6) * (H / 2);
    const path = (ys) => {
      let d = ""; let pen = false; let prev = null;
      ys.forEach((y, i) => {
        if (!Number.isFinite(y) || Math.abs(y) > 12 || (prev !== null && Math.abs(y - prev) > 6)) { pen = false; prev = Number.isFinite(y) ? y : null; return; }
        d += `${pen ? "L" : "M"}${sx(XS[i]).toFixed(1)} ${sy(Math.max(-6.5, Math.min(6.5, y))).toFixed(1)}`;
        pen = true; prev = y;
      });
      return d;
    };
    const grid = [-4, -2, 2, 4].map((v) => `<line x1="${sx(v)}" y1="0" x2="${sx(v)}" y2="${H}" class="fn-grid"/><line x1="0" y1="${sy(v)}" x2="${W}" y2="${sy(v)}" class="fn-grid"/>`).join("");
    return `<svg viewBox="0 0 ${W} ${H}" class="fn-plot" role="img" aria-label="猜過的函數圖形"><clipPath id="fn-clip"><rect width="${W}" height="${H}"/></clipPath>${grid}
      <line x1="0" y1="${sy(0)}" x2="${W}" y2="${sy(0)}" class="fn-axis"/><line x1="${sx(0)}" y1="0" x2="${sx(0)}" y2="${H}" class="fn-axis"/>
      <g clip-path="url(#fn-clip)">${series.map((s) => `<path d="${path(s.ys)}" stroke="${s.color}" stroke-width="${s.bold ? 3.2 : 2}" fill="none"${s.dash ? ' stroke-dasharray="6 5"' : ""}/>`).join("")}</g></svg>`;
  }

  const CSS = `.fn-ov{position:fixed;inset:0;z-index:80;overflow-y:auto;overscroll-behavior:contain;background:color-mix(in srgb,var(--paper) 96%,#000);padding:0 16px 40px}
.fn-wrap{display:grid;gap:14px;max-width:760px;margin:0 auto}
.fn-bar{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;padding:12px 0;background:inherit}.fn-bar b{font-size:1.05rem}.fn-bar small{color:var(--muted)}.fn-bar .fn-grow{flex:1}
.fn-form{display:flex;gap:8px}.fn-form input{flex:1;min-width:0;min-height:44px;padding:0 12px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);font:inherit;font-size:1.05rem}
.fn-help{margin:0;color:var(--muted);font-size:.84rem}.fn-err{margin:0;color:var(--red);font-size:.88rem}
.fn-rows{display:grid;gap:8px}.fn-row{display:grid;grid-template-columns:minmax(90px,1.2fr) repeat(6,minmax(0,1fr));gap:4px;align-items:stretch}
.fn-row .fn-expr{display:flex;align-items:center;gap:6px;min-width:0;font-weight:700;overflow-wrap:anywhere}.fn-row .fn-expr i{width:10px;height:10px;flex:none;border-radius:50%}
.fn-t{display:grid;align-content:center;gap:1px;min-height:52px;padding:4px;border-radius:8px;color:#fff;text-align:center;font-size:.78rem;line-height:1.25}
.fn-t small{opacity:.85;font-size:.68rem}.fn-t.g{background:#16a34a}.fn-t.y{background:#ca8a04}.fn-t.x{background:#6b7280}
.fn-head .fn-t{min-height:0;background:none;color:var(--muted)}
.fn-plot{width:100%;max-width:460px;justify-self:center;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
.fn-plot .fn-grid{stroke:var(--line);stroke-width:1}.fn-plot .fn-axis{stroke:var(--muted);stroke-width:1.2}
.fn-end{display:grid;gap:8px;padding:14px;border:1px solid var(--line);border-radius:12px;background:var(--panel);text-align:center}
.fn-end strong{font-size:1.1rem}.fn-end .katex{font-size:1.25em}
@media (max-width:640px){.fn-row{grid-template-columns:repeat(6,minmax(0,1fr))}.fn-row .fn-expr{grid-column:1/-1}.fn-head .fn-expr{display:none}.fn-t{font-size:.72rem;min-height:46px}}`;

  // deps = { evaluate(src, vars), loadRecords(), saveRecords(r), today() → 日期鍵, tex(src) → KaTeX 字串（可省）, track(name, params) }
  function open(deps) {
    if (!document.getElementById("fn-style")) { const st = document.createElement("style"); st.id = "fn-style"; st.textContent = CSS; document.head.appendChild(st); }
    // 日期跟每日一題同一個（app.js 的 dailyOneDateKey），訓練頁的打勾才對得上
    const key = (deps.today || today)();
    const target = targetOf(key);
    const T = profile(deps.evaluate, target);
    const records = deps.loadRecords();
    const store = (records.funcle && records.funcle.days) || {};
    const day = store[key] || { g: [], won: false };
    const guesses = day.g.map((src) => ({ src, p: profile(deps.evaluate, src) })).filter((x) => x.p);
    let err = "";
    const ov = document.createElement("div");
    ov.className = "fn-ov";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", "今日函數");
    document.body.appendChild(ov);
    const onKey = (e) => { if (e.key === "Escape") shut(); };
    const shut = () => { ov.remove(); document.removeEventListener("keydown", onKey); };
    document.addEventListener("keydown", onKey);
    const done = () => day.won || guesses.length >= 6;
    const streak = () => {
      let n = 0;
      const d = new Date(`${key}T12:00:00`);
      for (;;) { const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; if (!(store[k] && store[k].won)) break; n += 1; d.setDate(d.getDate() - 1); }
      return n;
    };
    const save = () => {
      const r = deps.loadRecords();
      r.funcle = { ...(r.funcle || {}), days: { ...((r.funcle && r.funcle.days) || {}), [key]: { g: guesses.map((x) => x.src), won: day.won } } };
      deps.saveRecords(r);
      store[key] = { g: guesses.map((x) => x.src), won: day.won };
    };
    const shareText = () => `今日函數 ${key} ${day.won ? guesses.length : "X"}/6\n${guesses.map((x) => tiles(x.p, T).map((t) => ({ g: "🟩", y: "🟨", x: "⬜" }[t.c])).join("")).join("\n")}`;
    function paint() {
      const end = done();
      const series = guesses.map((x, i) => ({ ys: x.p.ys, color: COLORS[i % COLORS.length] }));
      if (end) series.push({ ys: T.ys, color: "#dc2626", bold: true, dash: !day.won });
      ov.innerHTML = `<div class="fn-wrap">
        <div class="fn-bar"><b>今日函數</b><small>${key} · ${end ? (day.won ? `${guesses.length} 次猜中` : "沒猜中") : `第 ${guesses.length + 1} / 6 次`}${streak() ? ` · 連續 ${streak()} 天` : ""}</small><span class="fn-grow"></span><button type="button" class="button secondary" data-fn="close">關閉</button></div>
        ${end ? "" : `<form class="fn-form" data-fn-form><input data-fn-input autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="猜一個函數，例如 x^2 - 1" aria-label="猜的函數"><button class="button home-primary" type="submit">猜</button></form>
          <p class="fn-help">寫法：x^2、sin(x)、e^x、ln(x)、sqrt(x)、abs(x)、1/x。綠＝一樣、黃＝很接近、灰＝不對；↑ 表示答案的比你的大。</p>`}
        ${err ? `<p class="fn-err" role="alert">${esc(err)}</p>` : ""}
        ${guesses.length ? `<div class="fn-rows">
          <div class="fn-row fn-head"><span class="fn-expr"></span>${tiles(guesses[0].p, T).map((t) => `<span class="fn-t">${esc(t.label)}</span>`).join("")}</div>
          ${guesses.map((x, i) => `<div class="fn-row"><span class="fn-expr"><i style="background:${COLORS[i % COLORS.length]}"></i>${esc(x.src)}</span>${tiles(x.p, T).map((t) => `<span class="fn-t ${t.c}">${esc(t.text)}${t.arrow ? ` ${t.arrow}` : ""}<small>${esc(t.label)}</small></span>`).join("")}</div>`).join("")}
        </div>` : ""}
        ${guesses.length || end ? plot(series) : ""}
        ${end ? `<div class="fn-end"><strong>${day.won ? "猜中了！" : "今天的答案是"}</strong><div>${deps.tex ? deps.tex(`f(x)=${target}`) : esc(target)}</div>
          <div class="action-row" style="justify-content:center"><button type="button" class="button secondary" data-fn="share">複製結果</button></div><small data-fn-copied></small></div>` : ""}
      </div>`;
      const input = ov.querySelector("[data-fn-input]");
      if (input) input.focus();
    }
    ov.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = ov.querySelector("[data-fn-input]");
      const src = String(input && input.value || "").trim();
      if (!src || done()) return;
      const p = profile(deps.evaluate, src);
      if (!p) { err = `看不懂「${src}」：試試 x^2 - 1、sin(x)、e^x 這種寫法。`; paint(); return; }
      if (guesses.some((x) => same(x.p, p))) { err = "這個猜過了（或跟猜過的一樣）。"; paint(); return; }
      err = "";
      guesses.push({ src, p });
      if (same(p, T)) day.won = true;
      save();
      if (done() && deps.track) deps.track("funcle_done", { won: day.won, tries: guesses.length });
      paint();
    });
    ov.addEventListener("click", (e) => {
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

  window.BuzzFuncle = { open, profile, tiles, targetOf, TARGETS };
})();
