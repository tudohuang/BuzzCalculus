// ── 新版課程的圖（lesson.figures）：從 course_v2_ui.js 搬出來的畫法 ──
//
// index.html 上是 type="text/lazy" data-lazy="figures"：打開一課、那一課有圖（或分節）才由 course_v2_ui.js 抓。
// validate_course_v2 也用這裡的 build 驗每一張圖（tools/lib/app_api.js 照 index.html 順序載進 node）。

/* ── 課程的圖（lesson.figures）──
   一張圖是靜態的 graph（照題目附圖的格式，交給 BuzzGraphRender.renderProblemGraph 畫），
   或一個 widget：一根滑桿、決定性的、不動滑桿時也是一張有意義的靜態圖。
   widget 只是「滑桿值 → graph 規格＋一行讀數」的純函式，畫圖一律走同一支 renderProblemGraph
   （ε-δ 那種借 BuzzEpsilonGame.draw）；validate_course_v2 也用這裡的 build 驗每一張圖。

   種類（參數見 tools/content/course_v2/SCHEMA.md）：
     secant-tangent  割線轉成切線（滑 h）          riemann        矩形和（滑 n）
     taylor          Taylor 多項式（滑階數）       epsilon-delta  ε 帶與 δ 帶（滑 ε 或 δ）
     family          帶參數的曲線族（滑參數）       accumulation   面積函數 A(x) 與它的切線（滑 x）
     zoom            放大／拉遠鏡頭（滑倍率）       approach       兩點從左右滑向 a（滑「多靠近」） */
(function () {
  "use strict";

  const render = () => window.BuzzGraphRender;
  const compile = (expr) => render().graphCurveFn(expr);
  const SUBS = "₀₁₂₃₄₅₆₇₈₉";
  const sub = (n) => String(n).split("").map((d) => SUBS[Number(d)] || d).join("");
  const num = (v, digits) => {
    if (!Number.isFinite(v)) return "—";
    const text = Math.abs(v) >= 1e5 ? v.toExponential(2) : v.toFixed(digits === undefined ? (Math.abs(v) >= 1000 ? 1 : 3) : digits);
    return text.replace(/^-/, "−");
  };
  // f：字串，或分段 [{ expr, domain:[a,b] }]（跳躍、分段定義）
  function fnOf(f) {
    if (typeof f === "string") return compile(f);
    if (!Array.isArray(f) || !f.length) return null;
    const pieces = f.map((p) => ({ fn: compile(p.expr), a: Number(p.domain[0]), b: Number(p.domain[1]) }));
    if (pieces.some((p) => !p.fn)) return null;
    return (x) => { const p = pieces.find((q) => x >= q.a && x <= q.b); return p ? p.fn(x) : NaN; };
  }
  const curvesOf = (f, extra) => (typeof f === "string" ? [{ expr: f, ...extra }] : (f || []).map((p) => ({ expr: p.expr, domain: p.domain, ...extra })));
  // 數值積分（Simpson）：讀數與 A(x) 用；a > b 時帶負號
  function integrate(f, a, b, n) {
    if (a === b) return 0;
    const m = 2 * Math.ceil((n || 400) / 2);
    const h = (b - a) / m;
    let s = f(a) + f(b);
    for (let i = 1; i < m; i += 1) s += (i % 2 ? 4 : 2) * f(a + i * h);
    return (s * h) / 3;
  }
  const line = (m, x0, y0) => `(${y0})+(${m})*(x-(${x0}))`;
  const merge = (graph, extra) => {
    if (!extra) return graph;
    ["curves", "points", "labels", "dashed", "fills", "arrows", "polylines"].forEach((key) => {
      if (Array.isArray(extra[key])) graph[key] = (graph[key] || []).concat(extra[key]);
    });
    return graph;
  };
  const base = (w) => ({ window: w.window.slice(), ...(w.equal ? { equal: true } : {}) });

  const WIDGETS = {
    "secant-tangent": {
      slider: (w) => ({ name: "h", min: w.h[0], max: w.h[1], step: (w.h[1] - w.h[0]) / 200, value: w.h[1] }),
      build(w, h) {
        const f = fnOf(w.f);
        const a = Number(w.a);
        const fa = f(a);
        const slope = (f(a + 1e-5) - f(a - 1e-5)) / 2e-5;
        const tiny = Math.abs(h) < 1e-9;
        const m = tiny ? slope : (f(a + h) - fa) / h;
        const graph = base(w);
        graph.curves = curvesOf(w.f, { color: "blue" }).concat(
          w.tangent === false ? [] : [{ expr: line(slope, a, fa), color: "muted", dashed: true, width: 1.6 }],
          [{ expr: line(m, a, fa), color: "red", width: 1.8 }]);
        graph.points = [{ x: a, y: fa, color: "ink" }].concat(tiny ? [] : [{ x: a + h, y: f(a + h), color: "red" }]);
        graph.labels = [{ x: a, y: fa, text: "P", anchor: "end", dx: -6, dy: -6 }].concat(tiny ? [] : [{ x: a + h, y: f(a + h), text: "Q", dx: 8, dy: 4 }]);
        return { graphs: [merge(graph, w.extra)], readout: `h = ${num(h, 2)} · 割線斜率 ${tiny ? "—" : num(m, 3)}${w.tangent === false ? "" : ` · 切線斜率 ${num(slope, 3)}`}` };
      }
    },
    riemann: {
      slider: (w) => ({ name: "n", min: w.n[0], max: w.n[1], step: 1, value: Math.min(w.n[1], Math.max(w.n[0], 4)) }),
      build(w, value) {
        const f = fnOf(w.f);
        const a = Number(w.a);
        const b = Number(w.b);
        const n = Math.max(1, Math.round(value));
        const dx = (b - a) / n;
        const shift = w.rule === "right" ? 1 : w.rule === "mid" ? 0.5 : 0;
        const graph = base(w);
        let sum = 0;
        graph.fills = [];
        for (let i = 0; i < n; i += 1) {
          const x0 = a + i * dx;
          const y = f(x0 + shift * dx);
          sum += y * dx;
          graph.fills.push({ pts: [[x0, 0], [x0, y], [x0 + dx, y], [x0 + dx, 0]], color: y >= 0 ? "blue" : "red", opacity: 0.2, stroke: y >= 0 ? "blue" : "red" });
        }
        graph.curves = curvesOf(w.f, { color: "ink", width: 2 });
        const exact = integrate(f, a, b, 2000);
        return { graphs: [merge(graph, w.extra)], readout: `n = ${n} · 矩形和 ${num(sum)} · 積分 ${num(exact)}` };
      }
    },
    taylor: {
      slider: (w) => ({ name: "n", min: w.order[0], max: w.order[1], step: 1, value: Math.min(w.order[1], w.order[0] + 1) }),
      // 多項式：Σ c_k (x − center)^k，係數由作者給（驗證器拿數值導數對過）
      poly(w, n) {
        const c = Number(w.center);
        return w.coeffs.slice(0, n + 1).map((k, i) => `(${compile(String(k))(0)})*(x-(${c}))^${i}`).join("+") || "0";
      },
      build(w, value) {
        const n = Math.round(value);
        const graph = base(w);
        graph.curves = curvesOf(w.f, { color: "blue", width: 2.6 }).concat([{ expr: WIDGETS.taylor.poly(w, n), color: "red", width: 2 }]);
        graph.points = [{ x: Number(w.center), y: fnOf(w.f)(Number(w.center)), color: "ink" }];
        let readout = `紅線 T${sub(n)}（n = ${n}）`;
        if (w.probe !== undefined) {
          const x = Number(w.probe);
          readout += ` · x = ${num(x, 1)}：T${sub(n)} ${num(compile(WIDGETS.taylor.poly(w, n))(x), 4)}，f ${num(fnOf(w.f)(x), 4)}`;
        }
        return { graphs: [merge(graph, w.extra)], readout };
      }
    },
    "epsilon-delta": {
      slider: (w) => ({ name: w.drive === "delta" ? "δ" : "ε", min: w.range[0], max: w.range[1], step: (w.range[1] - w.range[0]) / 200, value: w.range[1] }),
      spec: (w) => ({ f: w.f, at: w.at, limit: w.limit, hole: Boolean(w.hole), maxDelta: (w.window[1] - w.window[0]) / 2 }),
      build(w, value) {
        const game = window.BuzzEpsilonGame;
        const spec = WIDGETS["epsilon-delta"].spec(w);
        const eps = w.drive === "delta" ? Number(w.eps) : value;
        const delta = w.drive === "delta" ? value : game.maxDelta(spec, eps) * 0.9;
        const drawn = game.draw(spec, delta, eps, w.window);
        const readout = w.drive === "delta"
          ? `ε = ${num(eps, 2)} · δ = ${num(delta, 3)} · ${drawn.probe.ok ? "整段在綠帶裡" : "有一段跑出綠帶"}`
          : `ε = ${num(eps, 3)} → δ = ${num(delta, 4)} 就夠`;
        return { svg: drawn, readout };
      }
    },
    family: {
      slider: (w) => ({ name: w.param || "a", min: w.range[0], max: w.range[1], step: w.step || (w.range[1] - w.range[0]) / 100, value: w.value !== undefined ? w.value : w.range[0] }),
      expr: (w, v) => String(w.f).replace(new RegExp(`\\b${w.param || "a"}\\b`, "g"), `(${v})`),
      build(w, value) {
        const fam = WIDGETS.family;
        const graph = base(w);
        graph.curves = (w.trail || []).map((v) => ({ expr: fam.expr(w, v), color: "muted", width: 1.2 }))
          .concat([{ expr: fam.expr(w, value), color: "blue", width: 2.6 }]);
        let readout = `${w.param || "a"} = ${num(value, 2)}`;
        if (Array.isArray(w.area)) {
          const f = compile(fam.expr(w, value));
          const [a, b] = w.area.map(Number);
          graph.fills = [{ expr: fam.expr(w, value), from: Math.max(a, w.window[0]), to: Math.min(b, w.window[1]), color: "blue", opacity: 0.2 }];
          readout += ` · 面積 ${num(integrate(f, a, b, 4000))}`;
        }
        return { graphs: [merge(graph, w.extra)], readout };
      }
    },
    accumulation: {
      slider: (w) => ({ name: "x", min: w.range[0], max: w.range[1], step: (w.range[1] - w.range[0]) / 200, value: w.value !== undefined ? w.value : w.range[1] }),
      build(w, x) {
        const f = fnOf(w.f);
        const a = Number(w.a);
        const A = (t) => integrate(f, a, t, 200);
        const top = base(w);
        const pos = `((${w.f})+abs(${w.f}))/2`;
        const neg = `((${w.f})-abs(${w.f}))/2`;
        top.fills = [{ expr: pos, from: a, to: x, color: "blue", opacity: 0.25 }, { expr: neg, from: a, to: x, color: "red", opacity: 0.25 }];
        top.curves = curvesOf(w.f, { color: "ink", width: 2 });
        top.points = [{ x, y: f(x), color: "blue" }];
        top.labels = [{ x: w.window[0], y: w.window[3], text: " f", color: "muted" }];
        const [lo, hi] = [w.window[0], w.window[1]];
        const pts = [];
        for (let i = 0; i <= 120; i += 1) { const t = lo + ((hi - lo) * i) / 120; pts.push([t, A(t)]); }
        const Ax = A(x);
        const bottom = { window: (w.windowA || w.window).slice() };
        bottom.curves = [{ pts, color: "green", width: 2.2 }, { expr: line(f(x), x, Ax), color: "muted", dashed: true, width: 1.4 }];
        bottom.points = [{ x, y: Ax, color: "green" }];
        bottom.labels = [{ x: bottom.window[0], y: bottom.window[3], text: " A", color: "muted" }];
        return { graphs: [merge(top, w.extra), bottom], readout: `x = ${num(x, 2)} · A(x) ${num(Ax)} · 切線斜率 = f(x) = ${num(f(x))}` };
      }
    },
    zoom: {
      slider: (w) => ({ name: w.out ? "拉遠" : "放大", min: 0, max: w.levels, step: w.levels / 120, value: 0 }),
      build(w, v) {
        const k = Math.pow(10, w.out ? v : -v);
        const [cx, cy] = w.center.map(Number);
        const [x0, x1, y0, y1] = w.window.map(Number);
        // axes "x"：只縮放 x；yPower 2：y 用倍率的平方縮（x² 這類曲線放大後形狀不變，看得出「一路被夾著」）
        const ky = w.axes === "x" ? 1 : Math.pow(k, w.yPower || 1);
        const graph = { window: [cx + (x0 - cx) * k, cx + (x1 - cx) * k, cy + (y0 - cy) * ky, cy + (y1 - cy) * ky] };
        graph.curves = w.curves.map((c) => ({ ...c, steps: c.steps || 600 }));
        if (w.point !== false) graph.points = [{ x: cx, y: cy, color: "ink" }];
        const merged = merge(graph, w.extra);
        const factor = Math.pow(10, v);
        const digits = Math.min(6, Math.max(0, Math.ceil(-Math.log10(graph.window[1] - graph.window[0])) + 1));
        return { graphs: [merged], readout: `${w.out ? "拉遠" : "放大"} ×${factor >= 10 ? Math.round(factor).toLocaleString("en-US") : num(factor, 1)} · x 從 ${num(graph.window[0], digits)} 到 ${num(graph.window[1], digits)}` };
      }
    },
    approach: {
      slider: () => ({ name: "靠近", min: 0, max: 1, step: 0.01, value: 0 }),
      build(w, s) {
        const f = fnOf(w.f);
        const a = Number(w.a);
        const [dmin, dmax] = w.range.map(Number);
        const d = dmax * Math.pow(dmin / dmax, s);
        const digits = Math.min(6, Math.max(2, Math.ceil(-Math.log10(d)) + 1));
        const graph = base(w);
        graph.curves = curvesOf(w.f, { color: "blue" });
        graph.dashed = [[[a, w.window[2]], [a, w.window[3]]]];
        graph.points = [];
        const sides = w.side === "left" ? [-1] : w.side === "right" ? [1] : [-1, 1];
        const read = sides.map((side) => {
          const x = a + side * d;
          const y = f(x);
          if (Number.isFinite(y) && y >= w.window[2] && y <= w.window[3]) {
            graph.points.push({ x, y, color: side < 0 ? "violet" : "green" });
            graph.arrows = (graph.arrows || []).concat([{ from: [x + side * (w.window[1] - w.window[0]) * 0.08, y], to: [x, y], color: side < 0 ? "violet" : "green" }]);
          }
          return `f(${num(x, digits)}) = ${num(y, 3)}`;
        });
        return { graphs: [merge(graph, w.extra)], readout: read.join(" · ") };
      }
    }
  };

  const sliderOf = (fig) => {
    const w = fig.widget;
    const s = WIDGETS[w.type].slider(w);
    // 作者可以指定不動滑桿時的那一格（要是一張有意義的靜態圖）
    if (w.value !== undefined) s.value = Number(w.value);
    return s;
  };

  // 滑桿值 → { plot: HTML, readout }
  function view(fig, value, escapeAttr) {
    if (fig.graph) return { plot: render().renderProblemGraph({ graph: fig.graph }, { label: fig.caption }, escapeAttr), readout: "" };
    const built = WIDGETS[fig.widget.type].build(fig.widget, value);
    if (built.svg) {
      return {
        plot: `<div class="problem-graph"><svg class="cv2-eps" viewBox="0 0 ${built.svg.width} ${built.svg.height}" role="img" aria-label="${escapeAttr(fig.caption)}">${built.svg.svg}</svg></div>`,
        readout: built.readout
      };
    }
    return { plot: built.graphs.map((graph) => render().renderProblemGraph({ graph }, { label: fig.caption }, escapeAttr)).join(""), readout: built.readout };
  }

  function renderFigure(fig, index, value, escapeAttr, escapeHtml) {
    if (!fig.widget) {
      return `<figure class="cv2-figure" data-cv2-fig="${index}"><div data-cv2-plot>${view(fig, 0, escapeAttr).plot}</div><figcaption>${escapeHtml(fig.caption)}</figcaption></figure>`;
    }
    const s = sliderOf(fig);
    const v = value === undefined ? s.value : value;
    const shown = view(fig, v, escapeAttr);
    return `
      <figure class="cv2-figure is-widget" data-cv2-fig="${index}">
        <div data-cv2-plot>${shown.plot}</div>
        <p class="cv2-readout" data-cv2-readout aria-live="polite">${escapeHtml(shown.readout)}</p>
        <label class="cv2-slider"><span>${escapeHtml(s.name)}</span><input type="range" data-cv2-slider="${index}" min="${s.min}" max="${s.max}" step="${s.step}" value="${v}" aria-label="${escapeAttr(`${s.name}：${fig.caption}`)}"></label>
        <figcaption>${escapeHtml(fig.caption)}</figcaption>
      </figure>`;
  }

  window.BuzzCourseFigures = { WIDGETS, fnOf, integrate, sliderOf, view, renderFigure };
})();
