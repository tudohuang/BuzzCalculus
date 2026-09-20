// 互動圖形題：把性質「放」到圖上，而不是認出對的圖
//
// 選圖題（gr-）練的是排除法：四張圖裡挑一張。這一包練的是相反方向 ——
// 圖只有一張，你要親手把極值點、反曲點點出來，或把切線拖到正確的方向。
// 紙筆考試的畫圖題真正在考的就是這個動作：知道「性質在圖上的哪裡」。
//
// 兩種題型：
//   graphtap   在圖上點出指定的位置（極值 / 臨界點 / 反曲點），
//              判分看 x 座標容差（tapTolerance，預設 ±0.35）。
//   graphslope 把一條過定點的直線拖成切線，判分看斜率容差。
//
// 驗算：曲線式子就在 graph.curves[0].expr 裡，tools/lib/verify_engine.js
// 的 verifyInteractiveGraph 會用數值微分把 f′ / f″ 的零點、f′(pivot) 全部
// 獨立重算一遍 —— 答案跟重算對不上，CI 直接紅。互動不是不驗算的藉口。
//
// tapTolerance 的紀律：兩個目標點的距離必須 ≥ 2 倍容差
// （tools/validate_problems.js 會擋），否則使用者根本分不開兩個點。

(function () {
  "use strict";

  const SOURCE = "Buzz 互動圖形包 2026";

  function add(problem) {
    const tags = (problem.tags || []).slice();
    tags.push(`rank-${problem.rank}`);
    tags.push("graph-reading");
    if (problem.rank <= 2) tags.push("beginner-friendly");
    return {
      source: SOURCE,
      difficulty: Math.min(4, problem.rank),
      topic: "derivatives",
      ...problem,
      tags
    };
  }

  const problems = [
    // ── graphtap：點位 ─────────────────────────────────────────
    add({
      id: "gi-001",
      rank: 2,
      answerKind: "graphtap",
      prompt: "\\text{在圖上點出 }f(x)=x^3-3x\\text{ 的兩個極值點位置}",
      graph: { window: [-3, 3, -5, 5], curves: [{ expr: "x**3-3*x" }] },
      answer: "-1,1",
      tapKind: "extremum",
      timeLimit: 45,
      tags: ["critical-points", "extrema"],
      hints: [
        "極值點發生在 f′ 變號的地方。",
        "f′=3x²−3，找它的零點。",
        "山頂與谷底各一個，左右對稱。"
      ],
      solution: "f′(x)=3x²−3=3(x−1)(x+1)，在 x=−1 由正轉負（極大）、x=1 由負轉正（極小）。"
    }),
    add({
      id: "gi-002",
      rank: 2,
      answerKind: "graphtap",
      prompt: "\\text{在圖上點出 }f(x)=x^3-3x\\text{ 的反曲點位置}",
      graph: { window: [-3, 3, -5, 5], curves: [{ expr: "x**3-3*x" }] },
      answer: "0",
      tapKind: "inflection",
      timeLimit: 40,
      tags: ["inflection", "concavity"],
      hints: [
        "反曲點是凹向改變的地方，看 f″。",
        "f″=6x。",
        "凹向下轉凹向上的那一點。"
      ],
      solution: "f″(x)=6x 在 x=0 變號：左邊凹向下、右邊凹向上，反曲點在原點。"
    }),
    add({
      id: "gi-003",
      rank: 3,
      answerKind: "graphtap",
      prompt: "\\text{在圖上點出 }f(x)=x^4-2x^2\\text{ 的三個臨界點位置}",
      graph: { window: [-2.2, 2.2, -1.8, 3], curves: [{ expr: "x**4-2*x**2" }] },
      answer: "-1,0,1",
      tapKind: "critical",
      timeLimit: 55,
      tags: ["critical-points", "extrema"],
      hints: [
        "臨界點是 f′=0 的地方 —— 極大極小都算。",
        "f′=4x³−4x=4x(x−1)(x+1)。",
        "兩個谷底夾一個山頂。"
      ],
      solution: "f′(x)=4x(x−1)(x+1)：x=±1 是極小、x=0 是局部極大，三個都是臨界點。"
    }),
    add({
      id: "gi-004",
      rank: 3,
      answerKind: "graphtap",
      prompt: "\\text{在圖上點出 }f(x)=xe^{-x}\\text{ 的極大值位置}",
      graph: { window: [-0.5, 4, -0.6, 0.6], curves: [{ expr: "x*exp(-x)" }] },
      answer: "1",
      tapKind: "extremum",
      timeLimit: 50,
      tags: ["critical-points", "extrema", "exponential"],
      hints: [
        "乘積微分：f′=(1−x)e^{−x}。",
        "e^{−x} 恆正，看 1−x 的符號。",
        "上坡轉下坡的那一點。"
      ],
      solution: "f′(x)=(1−x)e^{−x} 在 x=1 由正轉負，極大值 f(1)=1/e。"
    }),
    add({
      id: "gi-005",
      rank: 2,
      answerKind: "graphtap",
      prompt: "\\text{在圖上點出 }f(x)=\\sin x\\text{ 在 }[0,2\\pi]\\text{ 的兩個極值點位置}",
      graph: { window: [0, 6.4, -1.5, 1.5], curves: [{ expr: "sin(x)", domain: [0, 6.4] }] },
      answer: "1.5708,4.7124",
      tapKind: "extremum",
      timeLimit: 45,
      tags: ["critical-points", "extrema", "trig"],
      hints: [
        "f′=cos x 的零點。",
        "cos 在哪裡等於 0？",
        "波峰在 π/2，波谷在 3π/2。"
      ],
      solution: "f′(x)=cos x 在 x=π/2（極大）與 x=3π/2（極小）變號。"
    }),
    add({
      id: "gi-006",
      rank: 3,
      answerKind: "graphtap",
      prompt: "\\text{在圖上點出 }f(x)=x^3+3x^2\\text{ 的反曲點位置}",
      graph: { window: [-3.2, 1.4, -3, 9], curves: [{ expr: "x**3+3*x**2" }] },
      answer: "-1",
      tapKind: "inflection",
      timeLimit: 45,
      tags: ["inflection", "concavity"],
      hints: [
        "看 f″ 在哪裡變號。",
        "f″=6x+6。",
        "不在原點 —— 平移過了，而且在左邊。"
      ],
      solution: "f″(x)=6x+6 在 x=−1 變號，反曲點在 (−1,2)。"
    }),
    add({
      id: "gi-007",
      rank: 4,
      answerKind: "graphtap",
      prompt: "\\text{在圖上點出 }f(x)=\\dfrac{1}{1+x^2}\\text{ 的兩個反曲點位置}",
      graph: { window: [-3, 3, -0.2, 1.3], curves: [{ expr: "1/(1+x**2)" }] },
      answer: "-0.5774,0.5774",
      tapKind: "inflection",
      tapTolerance: 0.28,
      timeLimit: 70,
      tags: ["inflection", "concavity", "rational-function"],
      hints: [
        "鐘形曲線從凹向下轉凹向上的地方。",
        "f″ 的分子是 2(3x²−1)。",
        "x=±1/√3 ≈ ±0.577。"
      ],
      solution: "f″(x)=2(3x²−1)/(1+x²)³ 在 x=±1/√3 變號 —— 鐘形的「腰」。"
    }),
    add({
      id: "gi-008",
      rank: 4,
      answerKind: "graphtap",
      prompt: "\\text{在圖上點出 }f(x)=\\ln(1+x^2)\\text{ 的兩個反曲點位置}",
      graph: { window: [-3, 3, -0.5, 2.5], curves: [{ expr: "log(1+x**2)" }] },
      answer: "-1,1",
      tapKind: "inflection",
      timeLimit: 70,
      tags: ["inflection", "concavity", "log"],
      hints: [
        "f′=2x/(1+x²)，再微一次。",
        "f″ 的分子是 2(1−x²)。",
        "凹向在 ±1 各換一次。"
      ],
      solution: "f″(x)=2(1−x²)/(1+x²)² 在 x=±1 變號，兩個反曲點對稱於 y 軸。"
    }),

    // ── graphslope：拖切線 ─────────────────────────────────────
    add({
      id: "gi-101",
      rank: 2,
      answerKind: "graphslope",
      prompt: "\\text{拖動直線，使它成為 }f(x)=x^2\\text{ 在 }x=1\\text{ 的切線}",
      graph: { window: [-3, 3, -1.5, 6], curves: [{ expr: "x**2" }] },
      pivot: { x: 1 },
      answer: "2",
      slopeStart: 0,
      timeLimit: 45,
      tags: ["tangent-normal", "first-derivative"],
      hints: [
        "切線斜率 = f′(1)。",
        "f′=2x。",
        "貼著曲線、不切進去。"
      ],
      solution: "f′(x)=2x，f′(1)=2 —— 切線在切點附近與曲線只碰一次。"
    }),
    add({
      id: "gi-102",
      rank: 2,
      answerKind: "graphslope",
      prompt: "\\text{拖動直線，使它成為 }f(x)=\\sin x\\text{ 在 }x=0\\text{ 的切線}",
      graph: { window: [-3.2, 3.2, -1.6, 1.6], curves: [{ expr: "sin(x)" }] },
      pivot: { x: 0 },
      answer: "1",
      slopeStart: -1.5,
      timeLimit: 40,
      tags: ["tangent-normal", "first-derivative", "trig"],
      hints: [
        "f′=cos x。",
        "cos 0 = ?",
        "這就是 sin x ≈ x 的幾何意義。"
      ],
      solution: "f′(0)=cos 0=1：原點附近 sin x 跟 y=x 幾乎重合，這正是標準極限 sin x/x→1 的圖像。"
    }),
    add({
      id: "gi-103",
      rank: 3,
      answerKind: "graphslope",
      prompt: "\\text{拖動直線，使它成為 }f(x)=e^x\\text{ 在 }x=1\\text{ 的切線}",
      graph: { window: [-2, 2.5, -0.5, 8], curves: [{ expr: "exp(x)" }] },
      pivot: { x: 1 },
      answer: "2.7183",
      slopeStart: 1,
      slopeTolerance: 0.45,
      timeLimit: 50,
      tags: ["tangent-normal", "first-derivative", "exponential"],
      hints: [
        "e^x 微分還是 e^x。",
        "所以斜率 = 函數值。",
        "切線斜率就是 e ≈ 2.72。"
      ],
      solution: "f′(x)=e^x，f′(1)=e≈2.718 —— 指數曲線在每一點的斜率都等於它的高度。"
    }),
    add({
      id: "gi-104",
      rank: 3,
      answerKind: "graphslope",
      prompt: "\\text{拖動直線，使它成為 }f(x)=\\dfrac{1}{x}\\text{ 在 }x=1\\text{ 的切線}",
      graph: { window: [0.15, 4, -0.5, 4], curves: [{ expr: "1/x", domain: [0.15, 4] }] },
      pivot: { x: 1 },
      answer: "-1",
      slopeStart: 0.5,
      timeLimit: 50,
      tags: ["tangent-normal", "first-derivative", "rational-function"],
      hints: [
        "f′=−1/x²。",
        "x=1 代進去。",
        "往右下方倒 45 度。"
      ],
      solution: "f′(x)=−1/x²，f′(1)=−1 —— 雙曲線在 (1,1) 的切線是 y=2−x。"
    })
  ];

  window.BUZZ_GRAPH_INTERACTIVE_PROBLEMS = problems;
  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

// ── 第二段：圖形互動包 2026-09（gx-）────────────────────────────────
// 跟上面的互動圖形包放同一個檔（script 標籤預算：題庫檔再加就先合併）。
//
// 八種玩法，60 題，全部有圖：
//   A 由 f′ 的圖看 f（點出 f 的極大／極小／反曲點——圖上畫的是 f′，不是 f）
//   B 讀折線圖：斜率、面積、單側極限、f′ 圖積回 f、速度圖的位移與路程
//   C 在曲線上點零點、極值、反曲點
//   D 把直線拖成切線
//   E 參數曲線與極座標曲線（圖是折線畫的，問切線斜率與面積）
//   F f 與 f′ 的配對選圖（圖上是 f，選 f′；或圖上是 f′，選 f）
//   G 從圖看凹向區間（答案是區間）
//   H 塗色區域的面積
//
// 驗算：graphtap 由 verifyInteractiveGraph 從曲線式子或折線頂點獨立重算目標點（tapKind 決定算什麼）；
// graph 選圖題帶 graphRelation，正解選項要跟圖上曲線的數值微分對得上；折線讀值走 verify 的
// graphArea / graphValue / graphSlope / graphLimit / graphExtremumX（折線頂點就在題目資料裡）；
// 參數式走 paramSlope、極座標面積走 integral、凹向走 set_interval_verify 的 concaveUp / concaveDown。
(function () {
  "use strict";

  const SOURCE = "Buzz 圖形互動包 2026-09";
  const problems = [];

  function add(problem) {
    const tags = (problem.tags || []).slice();
    tags.push(`rank-${problem.rank}`);
    tags.push("graph-reading");
    if (problem.rank >= 5) tags.push("boss-rank");
    if (problem.rank <= 2) tags.push("beginner-friendly");
    problems.push({ source: SOURCE, difficulty: Math.min(4, problem.rank), topic: "derivatives", ...problem, tags });
  }

  // 參數曲線／極座標曲線畫成折線：取樣 n 段。座標寫在式子裡，工作簿照樣自足。
  function paramPolyline(xOf, yOf, t0, t1, n) {
    const pts = [];
    for (let i = 0; i <= n; i += 1) { const t = t0 + ((t1 - t0) * i) / n; pts.push([Number(xOf(t).toFixed(4)), Number(yOf(t).toFixed(4))]); }
    return pts;
  }
  function polarPolyline(rOf, t0, t1, n) {
    return paramPolyline((t) => rOf(t) * Math.cos(t), (t) => rOf(t) * Math.sin(t), t0, t1, n);
  }
  // 兩條曲線之間的區域（塗色用多邊形）
  function betweenPolygon(top, bottom, a, b, n) {
    const pts = [];
    for (let i = 0; i <= n; i += 1) { const x = a + ((b - a) * i) / n; pts.push([Number(x.toFixed(4)), Number(top(x).toFixed(4))]); }
    for (let i = n; i >= 0; i -= 1) { const x = a + ((b - a) * i) / n; pts.push([Number(x.toFixed(4)), Number(bottom(x).toFixed(4))]); }
    return pts;
  }

  /* ═══════ A. 由 f′ 的圖看 f（10）═══════
     圖上畫的是 f′。f 的極大在 f′ 由正轉負的零點，極小在由負轉正；f 的反曲點在 f′ 的極值。 */
  add({ id: "gx-001", rank: 3, answerKind: "graphtap", tapKind: "fmax",
    prompt: "\\text{圖為 }f'(x)=x^2-1\\text{ 的圖形（不是 }f\\text{）。點出 }f\\text{ 的極大值位置}",
    graph: { window: [-3, 3, -2, 8], curves: [{ expr: "x**2-1" }], labels: [{ x: 1.6, y: 6.5, text: "f′" }] },
    answer: "-1", timeLimit: 50, tags: ["derivative-graph", "extrema"],
    hints: ["圖是 f′，不是 f。", "f 的極大在 f′ 由正轉負的地方。", "f′ 在 x=−1 從正變負。"],
    solution: "f′=x²−1 在 x=−1 由正轉負（f 先升後降）→ 極大；在 x=1 由負轉正 → 極小。" });
  add({ id: "gx-002", rank: 3, answerKind: "graphtap", tapKind: "fmin",
    prompt: "\\text{圖為 }f'(x)=x^2-1\\text{ 的圖形（不是 }f\\text{）。點出 }f\\text{ 的極小值位置}",
    graph: { window: [-3, 3, -2, 8], curves: [{ expr: "x**2-1" }], labels: [{ x: 1.6, y: 6.5, text: "f′" }] },
    answer: "1", timeLimit: 50, tags: ["derivative-graph", "extrema"],
    hints: ["圖是 f′。", "f 的極小在 f′ 由負轉正的地方。", "看 f′ 從軸下穿到軸上的那一點。"],
    solution: "f′ 在 x=1 由負轉正，f 先降後升 → 極小。" });
  add({ id: "gx-003", rank: 4, answerKind: "graphtap", tapKind: "fmin",
    prompt: "\\text{圖為 }f'(x)=x^3-4x\\text{ 的圖形。點出 }f\\text{ 的兩個極小值位置}",
    graph: { window: [-3, 3, -4, 4], curves: [{ expr: "x**3-4*x" }], labels: [{ x: 2.3, y: 3.2, text: "f′" }] },
    answer: "-2,2", timeLimit: 60, tags: ["derivative-graph", "extrema"],
    hints: ["f′ 有三個零點：−2、0、2。", "只有由負轉正的才是 f 的極小。", "x=0 那個是由正轉負——那是極大。"],
    solution: "f′=x(x−2)(x+2)：在 x=−2 與 x=2 由負轉正（極小），在 x=0 由正轉負（極大）。" });
  add({ id: "gx-004", rank: 4, answerKind: "graphtap", tapKind: "fmax",
    prompt: "\\text{圖為 }f'(x)=x^3-4x\\text{ 的圖形。點出 }f\\text{ 的極大值位置}",
    graph: { window: [-3, 3, -4, 4], curves: [{ expr: "x**3-4*x" }], labels: [{ x: 2.3, y: 3.2, text: "f′" }] },
    answer: "0", timeLimit: 55, tags: ["derivative-graph", "extrema"],
    hints: ["三個零點裡只有一個是由正轉負。", "在 (−2,0) 上 f′ > 0，在 (0,2) 上 f′ < 0。", "x=0。"],
    solution: "f′ 在 x=0 由正轉負，f 在那裡有極大。" });
  add({ id: "gx-005", rank: 4, answerKind: "graphtap", tapKind: "finflection",
    prompt: "\\text{圖為 }f'(x)=x^3-4x\\text{ 的圖形。點出 }f\\text{ 的兩個反曲點位置}",
    graph: { window: [-3, 3, -4, 4], curves: [{ expr: "x**3-4*x" }], labels: [{ x: 2.3, y: 3.2, text: "f′" }] },
    answer: "-1.1547,1.1547", timeLimit: 70, tags: ["derivative-graph", "inflection"],
    hints: ["f 的反曲點是 f″ 變號的地方，也就是 f′ 的極值。", "看 f′ 這條曲線的山頂與谷底。", "f″=3x²−4=0 → x=±2/√3≈±1.15。"],
    solution: "f″=(f′)′=3x²−4 在 x=±2/√3 變號；圖上就是 f′ 的極大與極小的位置。" });
  add({ id: "gx-006", rank: 3, answerKind: "graphtap", tapKind: "fmax",
    prompt: "\\text{圖為 }f'(x)=\\sin x\\text{ 在 }[0,2\\pi]\\text{ 的圖形。點出 }f\\text{ 的極大值位置}",
    graph: { window: [0, 6.4, -1.5, 1.5], curves: [{ expr: "sin(x)", domain: [0, 6.4] }], labels: [{ x: 0.3, y: 1.25, text: "f′" }] },
    answer: "3.1416", timeLimit: 50, tags: ["derivative-graph", "extrema", "trig"],
    hints: ["f′=sin x 在哪裡由正轉負？", "不是波峰！是 f′ 穿過 x 軸往下的那一點。", "x=π。"],
    solution: "sin x 在 x=π 由正轉負，f 在 π 有極大（f = −cos x + C 在 π 是最高點）。" });
  add({ id: "gx-007", rank: 4, answerKind: "graphtap", tapKind: "fmin",
    prompt: "\\text{圖為 }f'(x)=(x-1)e^{-x}\\text{ 的圖形。點出 }f\\text{ 的極小值位置}",
    graph: { window: [-1, 5, -3, 0.6], curves: [{ expr: "(x-1)*exp(-x)" }], labels: [{ x: 3.5, y: 0.35, text: "f′" }] },
    answer: "1", timeLimit: 55, tags: ["derivative-graph", "extrema", "exponential"],
    hints: ["e^{−x} 恆正，f′ 的符號由 x−1 決定。", "x<1 時 f′<0，x>1 時 f′>0。", "由負轉正 → 極小。"],
    solution: "f′ 在 x=1 由負轉正，f 在那裡有極小。" });
  add({ id: "gx-008", rank: 5, answerKind: "graphtap", tapKind: "fmin",
    prompt: "\\text{圖為 }f'(x)=x^2(x-2)\\text{ 的圖形。點出 }f\\text{ 的極小值位置（注意 }x=0\\text{ 是不是）}",
    graph: { window: [-2, 3.5, -4, 4], curves: [{ expr: "x**2*(x-2)" }], labels: [{ x: 2.6, y: 3.2, text: "f′" }] },
    answer: "2", timeLimit: 70, tags: ["derivative-graph", "extrema"],
    hints: ["f′ 在 x=0 碰到軸但沒有穿過去。", "沒變號就不是極值。", "只有 x=2 由負轉正。"],
    solution: "f′=x²(x−2)：x=0 是二重根，f′ 兩側同號（都負），f 在 0 沒有極值；x=2 由負轉正是極小。" });
  add({ id: "gx-009", rank: 4, answerKind: "graphtap", tapKind: "fmax",
    prompt: "\\text{圖為 }f'\\text{ 的圖形：過 }(0,-2),(1,0),(2,2),(3,0),(4,-2)\\text{ 的折線。點出 }f\\text{ 的極大值位置}",
    graph: { window: [-1, 5, -3, 3], polylines: [[[0, -2], [1, 0], [2, 2], [3, 0], [4, -2]]], labels: [{ x: 4.2, y: -1.2, text: "f′" }] },
    answer: "3", timeLimit: 55, tags: ["derivative-graph", "extrema"],
    hints: ["圖是 f′。", "f′ 在 x=1 由負轉正、在 x=3 由正轉負。", "由正轉負的那一個。"],
    solution: "f′ 在 x=3 由正轉負 → f 的極大；x=1 是極小。" });
  add({ id: "gx-010", rank: 4, answerKind: "graphtap", tapKind: "fmax",
    prompt: "\\text{圖為 }f'\\text{ 的圖形：過 }(0,1),(2,-1),(4,1),(6,-1)\\text{ 的折線。點出 }f\\text{ 的所有極大值位置}",
    graph: { window: [-1, 7, -2, 2], polylines: [[[0, 1], [2, -1], [4, 1], [6, -1]]], labels: [{ x: 6.2, y: -0.7, text: "f′" }] },
    answer: "1,5", timeLimit: 60, tags: ["derivative-graph", "extrema"],
    hints: ["f′ 過零的地方在 x=1、3、5。", "由正轉負的才是極大。", "x=3 那次是由負轉正。"],
    solution: "f′ 在 x=1 與 x=5 由正轉負（極大），在 x=3 由負轉正（極小）。" });

  /* ═══════ B. 讀折線圖（14）═══════ */
  const P1 = [[0, 1], [2, 3], [4, 1]];
  add({ id: "gx-011", rank: 2, answerKind: "numeric",
    prompt: "f\\ \\text{為過 }(0,1),(2,3),(4,1)\\text{ 的折線（如圖）。求 }f'(1)",
    graph: { window: [-1, 5, -1, 4], polylines: [P1] }, answer: "1", timeLimit: 40, tags: ["slope"],
    verify: { m: "graphSlope", pts: P1, at: 1 },
    hints: ["x=1 落在哪一段？", "那一段的斜率。", "(3−1)/(2−0)。"], solution: "x=1 在 (0,1)→(2,3) 那一段上，斜率 (3−1)/(2−0)=1。" });
  add({ id: "gx-012", rank: 2, answerKind: "numeric",
    prompt: "f\\ \\text{為過 }(0,1),(2,3),(4,1)\\text{ 的折線（如圖）。求 }f'(3)",
    graph: { window: [-1, 5, -1, 4], polylines: [P1] }, answer: "-1", timeLimit: 40, tags: ["slope"],
    verify: { m: "graphSlope", pts: P1, at: 3 },
    hints: ["x=3 在下坡那一段。", "(1−3)/(4−2)。"], solution: "x=3 在 (2,3)→(4,1) 那一段上，斜率 −1。" });
  add({ id: "gx-013", rank: 3, answerKind: "numeric", topic: "integrals",
    prompt: "f\\ \\text{為過 }(0,1),(2,3),(4,1)\\text{ 的折線（如圖）。求 }\\int_0^4 f(x)\\,dx",
    graph: { window: [-1, 5, -1, 4], polylines: [P1], fills: [{ pts: [[0, 0], [0, 1], [2, 3], [4, 1], [4, 0]] }] }, answer: "8", timeLimit: 55, tags: ["area"],
    verify: { m: "graphArea", pts: P1, from: 0, to: 4 },
    hints: ["面積用梯形算。", "兩個梯形各 (1+3)/2·2。", "4+4。"], solution: "兩個梯形：½(1+3)·2 + ½(3+1)·2 = 8。" });
  const P2 = [[0, 2], [1, 2], [3, -2], [4, 0]];
  add({ id: "gx-014", rank: 3, answerKind: "numeric", topic: "integrals",
    prompt: "f\\ \\text{為過 }(0,2),(1,2),(3,-2),(4,0)\\text{ 的折線（如圖），}g(x)=\\int_0^x f(t)\\,dt\\text{。求 }g(4)",
    graph: { window: [-1, 5, -3, 3], polylines: [P2] }, answer: "1", timeLimit: 70, tags: ["ftc", "area"],
    verify: { m: "graphArea", pts: P2, from: 0, to: 4 },
    hints: ["帶號面積：軸下算負。", "[0,1] 矩形 2；[1,3] 上下兩個三角形抵消；[3,4] 三角形 −1。", "2+0−1。"],
    solution: "矩形 2，[1,3] 過零於 x=2：+1 與 −1 抵消，[3,4] 的三角形 −1，總和 1。" });
  add({ id: "gx-015", rank: 3, answerKind: "numeric", topic: "integrals",
    prompt: "f\\ \\text{為過 }(0,2),(1,2),(3,-2),(4,0)\\text{ 的折線（如圖）。求 }\\int_0^4 |f(x)|\\,dx",
    graph: { window: [-1, 5, -3, 3], polylines: [P2] }, answer: "5", timeLimit: 70, tags: ["area"],
    verify: { m: "graphArea", pts: P2, from: 0, to: 4, abs: true },
    hints: ["絕對值：軸下的面積也算正。", "2+1+1+1。"], solution: "矩形 2、兩個三角形各 1、最後一個三角形 1，共 5。" });
  const V1 = [[0, 0], [2, 4], [4, 4], [6, 0], [8, -4]];
  add({ id: "gx-016", rank: 4, answerKind: "numeric", topic: "integrals",
    prompt: "\\text{速度圖：}v\\ \\text{為過 }(0,0),(2,4),(4,4),(6,0),(8,-4)\\text{ 的折線（如圖）。}0\\le t\\le 8\\ \\text{的位移}",
    graph: { window: [-1, 9, -5, 5], polylines: [V1] }, answer: "12", timeLimit: 80, tags: ["kinematics", "area"],
    verify: { m: "graphArea", pts: V1, from: 0, to: 8 },
    hints: ["位移 = ∫v，軸下算負。", "三角形 4 + 矩形 8 + 三角形 4 − 三角形 4。", "12。"],
    solution: "軸上：4+8+4=16；軸下 [6,8] 的三角形 4；位移 16−4=12。" });
  add({ id: "gx-017", rank: 4, answerKind: "numeric", topic: "integrals",
    prompt: "\\text{速度圖：}v\\ \\text{為過 }(0,0),(2,4),(4,4),(6,0),(8,-4)\\text{ 的折線（如圖）。}0\\le t\\le 8\\ \\text{的總路程}",
    graph: { window: [-1, 9, -5, 5], polylines: [V1] }, answer: "20", timeLimit: 80, tags: ["kinematics", "area"],
    verify: { m: "graphArea", pts: V1, from: 0, to: 8, abs: true },
    hints: ["路程 = ∫|v|。", "16+4。"], solution: "軸上 16 加軸下 4，總路程 20。" });
  const D1 = [[0, 2], [2, 2], [4, -2]];
  add({ id: "gx-018", rank: 4, answerKind: "numeric",
    prompt: "\\text{圖為 }f'\\text{ 的圖形：過 }(0,2),(2,2),(4,-2)\\text{ 的折線。已知 }f(0)=1\\text{，求 }f(4)",
    graph: { window: [-1, 5, -3, 3], polylines: [D1], labels: [{ x: 4.2, y: -1.6, text: "f′" }] }, answer: "5", timeLimit: 75, tags: ["ftc", "derivative-graph"],
    verify: { m: "graphArea", pts: D1, from: 0, to: 4, base: 1 },
    hints: ["f(4)=f(0)+∫₀⁴f′。", "矩形 4，[2,4] 那段過零於 x=3：+1 與 −1 抵消。", "1+4。"],
    solution: "∫₀⁴f′ = 4 + 0 = 4，f(4) = 1 + 4 = 5。" });
  const J1 = [[0, 0], [2, 2]]; const J2 = [[2, 4], [4, 2]];
  const JUMP = { window: [-1, 5, -1, 5], polylines: [J1, J2], points: [{ x: 2, y: 2, open: true }, { x: 2, y: 4 }] };
  add({ id: "gx-019", rank: 3, answerKind: "numeric", topic: "limits",
    prompt: "\\text{如圖：}x<2\\text{ 時 }f\\text{ 沿 }(0,0)\\to(2,2)\\text{ 的直線，}x\\ge 2\\text{ 時沿 }(2,4)\\to(4,2)\\text{。求 }\\lim_{x\\to 2^-}f(x)",
    graph: JUMP, answer: "2", timeLimit: 45, tags: ["continuity", "one-sided-limit"],
    verify: { m: "graphLimit", pts: J1, at: 2, side: "left" },
    hints: ["從左邊靠近 x=2。", "沿著左邊那段直線走到空心點。"], solution: "左極限沿 (0,0)→(2,2) 逼近空心點 (2,2)：2。" });
  add({ id: "gx-020", rank: 3, answerKind: "numeric", topic: "limits",
    prompt: "\\text{如圖：}x<2\\text{ 時 }f\\text{ 沿 }(0,0)\\to(2,2)\\text{ 的直線，}x\\ge 2\\text{ 時沿 }(2,4)\\to(4,2)\\text{。求 }\\lim_{x\\to 2^+}f(x)",
    graph: JUMP, answer: "4", timeLimit: 45, tags: ["continuity", "one-sided-limit"],
    verify: { m: "graphLimit", pts: J2, at: 2, side: "right" },
    hints: ["從右邊靠近 x=2。", "右邊那段從實心點 (2,4) 出發。"], solution: "右極限沿 (2,4)→(4,2) 逼近 4。左右不等，x=2 是跳躍不連續。" });
  add({ id: "gx-021", rank: 3, answerKind: "numeric", topic: "limits",
    prompt: "\\text{如圖：}x<2\\text{ 時 }f\\text{ 沿 }(0,0)\\to(2,2)\\text{ 的直線，}x\\ge 2\\text{ 時沿 }(2,4)\\to(4,2)\\text{。求 }f(2)",
    graph: JUMP, answer: "4", timeLimit: 40, tags: ["continuity"],
    verify: { m: "graphValue", pts: J2, at: 2 },
    hints: ["實心點才是函數值。", "(2,4) 是實心的。"], solution: "f(2) 由實心點決定：4。空心點只是左極限。" });
  const H1 = [[0, 1], [3, 4]];
  const HOLE = { window: [-1, 4, -1, 5], polylines: [H1], points: [{ x: 2, y: 3, open: true }, { x: 2, y: 1 }] };
  add({ id: "gx-022", rank: 3, answerKind: "numeric", topic: "limits",
    prompt: "\\text{如圖：}f\\text{ 沿 }(0,1)\\to(3,4)\\text{ 的直線，但 }x=2\\text{ 處挖空、改定義 }f(2)=1\\text{。求 }\\lim_{x\\to 2}f(x)",
    graph: HOLE, answer: "3", timeLimit: 45, tags: ["continuity", "removable"],
    verify: { m: "graphLimit", pts: H1, at: 2, side: "left" },
    hints: ["極限不管那一點的函數值。", "沿直線逼近空心點。"], solution: "左右都沿直線逼近 (2,3)，極限是 3；f(2)=1 只是可去的不連續。" });
  const C1 = [[0, 0], [1, 2], [2, 1], [3, 3], [4, 3]];
  add({ id: "gx-023", rank: 4, answerKind: "graphtap", tapKind: "corner",
    prompt: "f\\ \\text{為過 }(0,0),(1,2),(2,1),(3,3),(4,3)\\text{ 的折線（如圖）。點出 }(0,4)\\text{ 內 }f\\text{ 不可微分的所有位置}",
    graph: { window: [-1, 5, -1, 4], polylines: [C1] }, answer: "1,2,3", timeLimit: 60, tags: ["continuity", "differentiability"],
    hints: ["折角處左右斜率不同，就不可微分。", "每個頂點都要看：斜率有沒有變？", "2、−1、2、0：三個頂點都變了。"],
    solution: "斜率依序 2、−1、2、0，三個頂點 x=1,2,3 都是折角，都不可微分。" });
  const Z1 = [[0, -2], [1, 1], [3, -1], [4, 2]];
  add({ id: "gx-024", rank: 3, answerKind: "graphtap", tapKind: "zero",
    prompt: "f\\ \\text{為過 }(0,-2),(1,1),(3,-1),(4,2)\\text{ 的折線（如圖）。點出 }f\\text{ 的所有零點}",
    graph: { window: [-1, 5, -3, 3], polylines: [Z1] }, answer: "0.6667,2,3.3333", timeLimit: 55, tags: ["zeros"],
    hints: ["每一段跨過 x 軸的地方各一個零點。", "第一段從 −2 到 1，零點在 2/3。", "第二段對稱，零點在 2；第三段在 3⅓。"],
    solution: "三段各過零一次：x=2/3、2、10/3。" });

  /* ═══════ C. 在曲線上點（6）═══════ */
  add({ id: "gx-025", rank: 3, answerKind: "graphtap", tapKind: "zero",
    prompt: "\\text{在圖上點出 }f(x)=x^3-x\\text{ 的三個零點}",
    graph: { window: [-2, 2, -2, 2], curves: [{ expr: "x**3-x" }] }, answer: "-1,0,1", timeLimit: 45, tags: ["zeros"],
    hints: ["x³−x=x(x−1)(x+1)。"], solution: "x(x−1)(x+1)=0 → x=−1,0,1。" });
  add({ id: "gx-026", rank: 4, answerKind: "graphtap", tapKind: "extremum",
    prompt: "\\text{在圖上點出 }f(x)=xe^{-x^2}\\text{ 的兩個極值點位置}",
    graph: { window: [-3, 3, -0.6, 0.6], curves: [{ expr: "x*exp(-(x**2))" }] }, answer: "-0.7071,0.7071", timeLimit: 60, tags: ["extrema", "exponential"],
    hints: ["f′=(1−2x²)e^{−x²}。", "零點在 x=±1/√2≈±0.71。"], solution: "f′=(1−2x²)e^{−x²} 在 ±1/√2 變號：右邊極大、左邊極小。" });
  add({ id: "gx-027", rank: 4, answerKind: "graphtap", tapKind: "extremum",
    prompt: "\\text{在圖上點出 }f(x)=\\ln x-\\frac{x}{2}\\text{ 的極大值位置}",
    graph: { window: [0.2, 6, -3, 0.5], curves: [{ expr: "log(x)-x/2", domain: [0.2, 6] }] }, answer: "2", timeLimit: 55, tags: ["extrema", "log"],
    hints: ["f′=1/x−1/2。", "零點 x=2。"], solution: "f′=1/x−1/2 在 x=2 由正轉負，極大值 ln 2 − 1。" });
  add({ id: "gx-028", rank: 5, answerKind: "graphtap", tapKind: "inflection",
    prompt: "\\text{在圖上點出 }f(x)=x^2e^{-x}\\text{ 的兩個反曲點位置}",
    graph: { window: [-0.5, 6, -0.2, 0.8], curves: [{ expr: "x**2*exp(-x)", domain: [-0.5, 6] }] }, answer: "0.5858,3.4142", timeLimit: 75, tags: ["inflection", "exponential"],
    hints: ["f″=(x²−4x+2)e^{−x}。", "x²−4x+2=0 → x=2±√2。", "≈0.59 與 3.41。"], solution: "f″=(x²−4x+2)e^{−x} 在 x=2±√2 變號。" });
  add({ id: "gx-029", rank: 4, answerKind: "graphtap", tapKind: "extremum",
    prompt: "\\text{在圖上點出 }f(x)=\\sin x+\\cos x\\text{ 在 }[0,2\\pi]\\text{ 的兩個極值點位置}",
    graph: { window: [0, 6.4, -1.8, 1.8], curves: [{ expr: "sin(x)+cos(x)", domain: [0, 6.4] }] }, answer: "0.7854,3.927", timeLimit: 60, tags: ["extrema", "trig"],
    hints: ["f=√2 sin(x+π/4)。", "極大在 x+π/4=π/2，極小在 3π/2。", "x=π/4 與 5π/4。"], solution: "f′=cos x−sin x=0 → tan x=1 → x=π/4（極大）、5π/4（極小）。" });
  add({ id: "gx-030", rank: 4, answerKind: "graphtap", tapKind: "inflection",
    prompt: "\\text{在圖上點出 }f(x)=\\frac{x}{1+x^2}\\text{ 的三個反曲點位置}",
    graph: { window: [-4, 4, -0.7, 0.7], curves: [{ expr: "x/(1+x**2)" }] }, answer: "-1.7321,0,1.7321", timeLimit: 75, tags: ["inflection"],
    hints: ["f″=2x(x²−3)/(1+x²)³。", "零點 x=0、±√3。"], solution: "f″ 在 x=0 與 x=±√3 變號。" });

  /* ═══════ D. 把直線拖成切線（6）═══════ */
  add({ id: "gx-031", rank: 2, answerKind: "graphslope", prompt: "\\text{把直線拖成 }f(x)=x^3\\text{ 在 }x=1\\text{ 的切線}",
    graph: { window: [-2, 2, -4, 4], curves: [{ expr: "x**3" }] }, pivot: { x: 1 }, slopeStart: 0, answer: "3", timeLimit: 40, tags: ["tangent-normal"],
    hints: ["f′=3x²。", "x=1 時斜率 3。"], solution: "f′(1)=3。" });
  add({ id: "gx-032", rank: 3, answerKind: "graphslope", prompt: "\\text{把直線拖成 }f(x)=e^{x}\\text{ 在 }x=0\\text{ 的切線}",
    graph: { window: [-2.5, 2, -1, 5], curves: [{ expr: "exp(x)" }] }, pivot: { x: 0 }, slopeStart: -1, answer: "1", timeLimit: 40, tags: ["tangent-normal", "exponential"],
    hints: ["f′=e^x。", "e^0=1。"], solution: "f′(0)=e⁰=1：切線 y=x+1。" });
  add({ id: "gx-033", rank: 3, answerKind: "graphslope", prompt: "\\text{把直線拖成 }f(x)=x^3-3x\\text{ 在 }x=2\\text{ 的切線}",
    graph: { window: [-3, 3, -6, 8], curves: [{ expr: "x**3-3*x" }] }, pivot: { x: 2 }, slopeStart: 0, answer: "9", timeLimit: 45, tags: ["tangent-normal"],
    hints: ["f′=3x²−3。", "x=2：12−3。"], solution: "f′(2)=9。" });
  add({ id: "gx-034", rank: 4, answerKind: "graphslope", prompt: "\\text{把直線拖成 }f(x)=\\sqrt{x}\\text{ 在 }x=4\\text{ 的切線}",
    graph: { window: [0, 9, -1, 4], curves: [{ expr: "sqrt(x)", domain: [0, 9] }] }, pivot: { x: 4 }, slopeStart: 2, slopeTolerance: 0.12, answer: "0.25", timeLimit: 45, tags: ["tangent-normal", "radical"],
    hints: ["f′=1/(2√x)。", "x=4：1/4。"], solution: "f′(4)=1/(2·2)=1/4。" });
  add({ id: "gx-035", rank: 4, answerKind: "graphslope", prompt: "\\text{把直線拖成 }f(x)=\\frac{1}{x}\\text{ 在 }x=2\\text{ 的切線}",
    graph: { window: [0.2, 5, -1, 3], curves: [{ expr: "1/x", domain: [0.3, 5] }] }, pivot: { x: 2 }, slopeStart: 1, slopeTolerance: 0.12, answer: "-0.25", timeLimit: 45, tags: ["tangent-normal"],
    hints: ["f′=−1/x²。", "x=2：−1/4。"], solution: "f′(2)=−1/4。" });
  add({ id: "gx-036", rank: 4, answerKind: "graphslope", prompt: "\\text{把直線拖成 }f(x)=\\cos x\\text{ 在 }x=\\tfrac{\\pi}{2}\\text{ 的切線}",
    graph: { window: [-1, 4.5, -2, 2], curves: [{ expr: "cos(x)" }] }, pivot: { x: 1.5707963 }, slopeStart: 0.5, answer: "-1", timeLimit: 45, tags: ["tangent-normal", "trig"],
    hints: ["f′=−sin x。", "−sin(π/2)=−1。"], solution: "f′(π/2)=−sin(π/2)=−1。" });

  /* ═══════ E. 參數曲線與極座標（8）═══════ 圖用折線畫，問切線斜率或面積 */
  add({ id: "gx-037", rank: 3, answerKind: "numeric",
    prompt: "\\text{圖為參數曲線 }x=t^2,\\ y=t^3\\text{（}-2\\le t\\le 2\\text{）。標記點是 }t=2\\text{，求該點的切線斜率 }\\frac{dy}{dx}",
    graph: { window: [-1, 5, -9, 9], polylines: [paramPolyline((t) => t * t, (t) => t * t * t, -2, 2, 60)], points: [{ x: 4, y: 8 }] },
    answer: "3", timeLimit: 55, tags: ["parametric"], verify: { m: "paramSlope", x: "t^2", y: "t^3", at: 2 },
    hints: ["dy/dx=(dy/dt)/(dx/dt)。", "3t²/(2t)=3t/2。"], solution: "dy/dx=3t²/(2t)=3t/2，t=2 時 3。" });
  add({ id: "gx-038", rank: 4, answerKind: "numeric",
    prompt: "\\text{圖為橢圓 }x=2\\cos t,\\ y=\\sin t\\text{。標記點是 }t=\\tfrac{\\pi}{4}\\text{，求該點的切線斜率}",
    graph: { window: [-3, 3, -2, 2], polylines: [paramPolyline((t) => 2 * Math.cos(t), (t) => Math.sin(t), 0, 2 * Math.PI, 80)], points: [{ x: 1.4142, y: 0.7071 }] },
    answer: "-1/2", timeLimit: 60, tags: ["parametric", "trig"], verify: { m: "paramSlope", x: "2\\cos t", y: "\\sin t", at: "\\pi/4" },
    hints: ["dy/dt=cos t，dx/dt=−2 sin t。", "t=π/4 時兩者相消只剩 −1/2。"], solution: "dy/dx=cos t/(−2 sin t)=−½ cot t，t=π/4 時 −1/2。" });
  add({ id: "gx-039", rank: 4, answerKind: "numeric",
    prompt: "\\text{圖為擺線 }x=t-\\sin t,\\ y=1-\\cos t\\text{（一拱）。標記點是 }t=\\tfrac{2\\pi}{3}\\text{，求該點的切線斜率}",
    graph: { window: [-0.5, 6.8, -0.5, 2.5], polylines: [paramPolyline((t) => t - Math.sin(t), (t) => 1 - Math.cos(t), 0, 2 * Math.PI, 80)], points: [{ x: 1.2284, y: 1.5 }] },
    answer: "1/sqrt(3)", timeLimit: 70, tags: ["parametric", "trig"], verify: { m: "paramSlope", x: "t-\\sin t", y: "1-\\cos t", at: "2\\pi/3" },
    hints: ["dy/dx=sin t/(1−cos t)。", "= cot(t/2)。", "cot(π/3)=1/√3。"], solution: "dy/dx=sin t/(1−cos t)=cot(t/2)，t=2π/3 時 cot(π/3)=1/√3。" });
  add({ id: "gx-040", rank: 4, answerKind: "numeric", topic: "integrals",
    prompt: "\\text{圖為極座標曲線 }r=2\\cos\\theta\\text{（}0\\le\\theta\\le\\pi\\text{）。求它所圍的面積}",
    graph: { window: [-1, 3, -2, 2], polylines: [polarPolyline((t) => 2 * Math.cos(t), 0, Math.PI, 80)] },
    answer: "pi", timeLimit: 60, tags: ["polar-area", "trig"], verify: { m: "integral", f: "\\frac{1}{2}(2\\cos t)^2", v: "t", a: 0, b: "\\pi" },
    hints: ["面積 = ½∫r²dθ。", "這是圓心 (1,0)、半徑 1 的圓。"], solution: "½∫₀^π 4cos²θ dθ = π；它就是半徑 1 的圓。" });
  add({ id: "gx-041", rank: 5, answerKind: "numeric", topic: "integrals",
    prompt: "\\text{圖為心臟線 }r=1+\\cos\\theta\\text{。求它所圍的面積}",
    graph: { window: [-1, 2.5, -1.5, 1.5], polylines: [polarPolyline((t) => 1 + Math.cos(t), 0, 2 * Math.PI, 100)] },
    answer: "3*pi/2", timeLimit: 80, tags: ["polar-area", "trig"], verify: { m: "integral", f: "\\frac{1}{2}(1+\\cos t)^2", v: "t", a: 0, b: "2\\pi" },
    hints: ["½∫₀^{2π}(1+cos θ)²dθ。", "展開：1+2cos θ+cos²θ，cos² 的平均是 ½。", "½·2π·(1+½)。"], solution: "½∫(1+2cos θ+cos²θ)dθ = ½(2π+0+π) = 3π/2。" });
  add({ id: "gx-042", rank: 5, answerKind: "numeric", topic: "integrals",
    prompt: "\\text{圖為四葉玫瑰線 }r=\\cos 2\\theta\\text{。求一片花瓣的面積}",
    graph: { window: [-1.2, 1.2, -1.2, 1.2], polylines: [polarPolyline((t) => Math.cos(2 * t), 0, 2 * Math.PI, 160)], fills: [{ pts: polarPolyline((t) => Math.cos(2 * t), -Math.PI / 4, Math.PI / 4, 40) }] },
    answer: "pi/8", timeLimit: 90, tags: ["polar-area", "trig"], verify: { m: "integral", f: "\\frac{1}{2}\\cos^2(2t)", v: "t", a: "-\\pi/4", b: "\\pi/4" },
    hints: ["一片花瓣：−π/4≤θ≤π/4。", "½∫cos²2θ dθ，cos² 的平均是 ½。", "½·(π/2)·½。"], solution: "½∫_{−π/4}^{π/4}cos²2θ dθ = ½·(π/2)·½ = π/8。" });
  add({ id: "gx-043", rank: 4, answerKind: "numeric",
    prompt: "\\text{圖為參數曲線 }x=t^2,\\ y=t^3-3t\\text{（有一個環）。標記點是 }t=\\sqrt{3}\\text{（環的交叉點），求該點的切線斜率}",
    graph: { window: [-1, 5, -3, 3], polylines: [paramPolyline((t) => t * t, (t) => t * t * t - 3 * t, -2.1, 2.1, 80)], points: [{ x: 3, y: 0 }] },
    answer: "sqrt(3)", timeLimit: 70, tags: ["parametric"], verify: { m: "paramSlope", x: "t^2", y: "t^3-3t", at: "\\sqrt{3}" },
    hints: ["dy/dx=(3t²−3)/(2t)。", "t=√3：(9−3)/(2√3)。", "= √3（t=−√3 給 −√3：交叉點有兩條切線）。"], solution: "dy/dx=(3t²−3)/(2t)，t=√3 時 6/(2√3)=√3。" });
  add({ id: "gx-044", rank: 5, answerKind: "numeric",
    prompt: "\\text{圖為星形線 }x=\\cos^3 t,\\ y=\\sin^3 t\\text{。標記點是 }t=\\tfrac{\\pi}{6}\\text{，求該點的切線斜率}",
    graph: { window: [-1.3, 1.3, -1.3, 1.3], polylines: [paramPolyline((t) => Math.pow(Math.cos(t), 3), (t) => Math.pow(Math.sin(t), 3), 0, 2 * Math.PI, 120)], points: [{ x: 0.6495, y: 0.125 }] },
    answer: "-1/sqrt(3)", timeLimit: 80, tags: ["parametric", "trig"], verify: { m: "paramSlope", x: "\\cos^3 t", y: "\\sin^3 t", at: "\\pi/6" },
    hints: ["dy/dt=3sin²t cos t，dx/dt=−3cos²t sin t。", "相除得 −tan t。", "−tan(π/6)。"], solution: "dy/dx=−tan t，t=π/6 時 −1/√3。" });

  /* ═══════ F. f 與 f′ 的配對選圖（6）═══════ 圖上是 f（或 f′），選項是候選的 f′（或 f） */
  add({ id: "gx-045", rank: 3, answerKind: "graph", graphRelation: "derivative",
    prompt: "\\text{圖為 }f(x)=x^2-2x\\text{。哪一張是 }f'\\text{ 的圖？}",
    graph: { window: [-3, 5, -6, 8], curves: [{ expr: "x**2-2*x" }] }, graphWindow: [-3, 5, -6, 8],
    answer: "2*x-2", graphChoices: [
      { expr: "2*x-2", correct: true },
      { expr: "x**2-2*x", why: "這是 f 自己，不是 f′。f′ 是斜率的圖：拋物線的斜率是一條直線。" },
      { expr: "-2*x+2", why: "符號反了。f 在 x>1 上升，f′ 在那裡應該是正的。" },
      { expr: "2*x", why: "漏了常數：f 的最低點在 x=1，f′(1) 必須是 0。" }
    ], timeLimit: 50, tags: ["derivative-graph"],
    hints: ["f′ 是斜率的圖。", "f 在 x=1 有最低點 → f′(1)=0。", "x>1 上升 → f′>0。"],
    solutionSteps: ["f 是拋物線，斜率隨 x 線性變化 → f′ 是直線，排除拋物線那張。", "f 的最低點在 x=1 → f′(1)=0，排除不過 (1,0) 的。", "f 在 x>1 上升 → f′ 在右邊為正，排除符號反的。", "只剩 2x−2。"],
    solution: "f′=2x−2：過 (1,0) 的直線，右邊為正。" });
  add({ id: "gx-046", rank: 4, answerKind: "graph", graphRelation: "derivative",
    prompt: "\\text{圖為 }f(x)=x^3-3x\\text{。哪一張是 }f'\\text{ 的圖？}",
    graph: { window: [-3, 3, -5, 7], curves: [{ expr: "x**3-3*x" }] }, graphWindow: [-3, 3, -5, 7],
    answer: "3*x**2-3", graphChoices: [
      { expr: "3*x**2-3", correct: true },
      { expr: "3*x**2", why: "漏了 −3：f 在 x=±1 有極值，f′ 在那裡必須是 0。" },
      { expr: "x**2-1", why: "零點對了但係數錯：f 在 x=2 的斜率是 9，不是 3。" },
      { expr: "-3*x**2+3", why: "符號反了。f 在 |x|>1 上升，f′ 在那裡應該是正的。" }
    ], timeLimit: 60, tags: ["derivative-graph"],
    hints: ["f 的極值在 ±1 → f′ 的零點在 ±1。", "f 在兩端上升 → f′ 兩端為正。", "斜率的大小也要對。"],
    solutionSteps: ["f 在 x=±1 有極值 → f′ 在 ±1 為零，排除零點不在 ±1 的（3x²）。", "f 在 |x|>1 上升 → f′ 兩端為正，排除開口向下的。", "f 在 x=2 的斜率是 3·4−3=9，x²−1 在那裡只有 3，排除。", "只剩 3x²−3。"],
    solution: "f′=3x²−3：開口向上、零點 ±1。" });
  add({ id: "gx-047", rank: 4, answerKind: "graph", graphRelation: "derivative",
    prompt: "\\text{圖為 }f(x)=\\sin x\\text{（}-\\pi\\le x\\le\\pi\\text{）。哪一張是 }f'\\text{ 的圖？}",
    graph: { window: [-3.3, 3.3, -1.5, 1.5], curves: [{ expr: "sin(x)", domain: [-3.15, 3.15] }] }, graphWindow: [-3.3, 3.3, -1.5, 1.5], graphDomain: [-3.15, 3.15],
    answer: "cos(x)", graphChoices: [
      { expr: "cos(x)", correct: true },
      { expr: "-cos(x)", why: "符號反了。sin 在 x=0 上升最快，f′(0) 應該是最大值 1。" },
      { expr: "sin(x)", why: "這是 f 自己。f 的最高點在 π/2，f′ 在那裡要是 0。" },
      { expr: "-sin(x)", why: "這是 f″。f′(0) 應該是 1，不是 0。" }
    ], timeLimit: 55, tags: ["derivative-graph", "trig"],
    hints: ["f 在 x=0 上升最快。", "f 的極值在 ±π/2 → f′ 的零點在那裡。"],
    solutionSteps: ["f 在 x=0 的斜率是最大的正值 → f′(0)=1，排除在 0 為零或為負的三張。", "f 在 ±π/2 有極值 → f′ 在那裡為零：cos x 符合。", "只剩 cos x。"],
    solution: "f′=cos x：在 0 是 1，在 ±π/2 是 0。" });
  add({ id: "gx-048", rank: 4, answerKind: "graph", graphRelation: "antiderivative",
    prompt: "\\text{圖為 }f'(x)=2x\\text{（一條直線）。已知 }f(0)=0\\text{，哪一張是 }f\\text{ 的圖？}",
    graph: { window: [-3, 3, -6, 6], curves: [{ expr: "2*x" }], labels: [{ x: 2.2, y: 5, text: "f′" }] }, graphWindow: [-3, 3, -6, 6],
    answer: "x**2", graphChoices: [
      { expr: "x**2", correct: true },
      { expr: "2*x**2", why: "太陡：這條的導數是 4x，在 x=1 的斜率是 4，圖上的 f′(1) 是 2。" },
      { expr: "-(x**2)", why: "凹向反了。f′ 在 x>0 為正，f 在那裡應該上升。" },
      { expr: "x**2+2", why: "形狀對，但 f(0)=0 不成立。" }
    ], timeLimit: 55, tags: ["derivative-graph", "ftc"],
    hints: ["f′ 在 x<0 為負、x>0 為正 → f 先降後升。", "f′ 是直線 → f 是拋物線。", "還要過原點。"],
    solutionSteps: ["f′<0 再 >0 → f 先降後升，開口向上，排除 −x²。", "f′(1)=2 → f 在 x=1 的斜率是 2，2x² 在那裡是 4，排除。", "f(0)=0 → 排除 x²+2。", "只剩 x²。"],
    solution: "f′=2x → f=x²+C，f(0)=0 → C=0。" });
  add({ id: "gx-049", rank: 5, answerKind: "graph", graphRelation: "derivative",
    prompt: "\\text{圖為 }f(x)=xe^{-x}\\text{。哪一張是 }f'\\text{ 的圖？}",
    graph: { window: [-1, 5, -1, 1], curves: [{ expr: "x*exp(-x)", domain: [-0.8, 5] }] }, graphWindow: [-1, 5, -1, 1], graphDomain: [-0.8, 5],
    answer: "(1-x)*exp(-x)", graphChoices: [
      { expr: "(1-x)*exp(-x)", correct: true },
      { expr: "exp(-x)", why: "漏了乘積律的第二項。f 在 x=1 有極大，f′(1) 必須是 0，但 e^{−1}≠0。" },
      { expr: "-x*exp(-x)", why: "這是 f 的負號版。f 在 x=0 上升，f′(0) 應該是 1。" },
      { expr: "(x-1)*exp(-x)", why: "符號反了。f 在 x<1 上升，f′ 在那裡應該為正。" }
    ], timeLimit: 70, tags: ["derivative-graph", "exponential"],
    hints: ["乘積律：e^{−x}−xe^{−x}。", "f 的極大在 x=1 → f′(1)=0。", "f′(0)=1。"],
    solutionSteps: ["f 在 x=1 有極大 → f′(1)=0，排除 e^{−x}（處處為正）。", "f 在 x=0 上升，斜率 1 → f′(0)=1，排除在 0 為零或為負的。", "f 在 x>1 下降 → f′ 在那裡為負，排除 (x−1)e^{−x}。", "只剩 (1−x)e^{−x}。"],
    solution: "f′=(1−x)e^{−x}：過 (0,1)、在 x=1 過零、之後為負。" });
  add({ id: "gx-050", rank: 4, answerKind: "graph", graphRelation: "derivative",
    prompt: "\\text{圖為 }f(x)=\\ln x\\text{。哪一張是 }f'\\text{ 的圖？}",
    graph: { window: [0, 5, -3, 4], curves: [{ expr: "log(x)", domain: [0.05, 5] }] }, graphWindow: [0, 5, -3, 4], graphDomain: [0.1, 5],
    answer: "1/x", graphChoices: [
      { expr: "1/x", correct: true },
      { expr: "-1/x", why: "符號反了。ln 處處上升，f′ 要恆正。" },
      { expr: "log(x)", why: "這是 f 自己。f′ 在 x→0⁺ 應該衝到無窮大，不是負無窮。" },
      { expr: "1/x**2", why: "衰減太快：f′(1) 對（都是 1），但 f′(2) 是 1/2，不是 1/4。" }
    ], timeLimit: 55, tags: ["derivative-graph", "log"],
    hints: ["ln 處處上升 → f′ 恆正。", "越往右越平 → f′ 遞減到 0。", "f′(1)=1、f′(2)=½。"],
    solutionSteps: ["ln x 處處上升 → f′ 恆正，排除 −1/x 與 ln x 本身。", "曲線越往右越平 → f′ 遞減到 0：1/x 與 1/x² 都符合。", "f 在 x=2 的斜率是 ½（切線畫得出來），1/x² 在那裡只有 ¼，排除。", "只剩 1/x。"],
    solution: "f′=1/x：恆正、遞減、在 x=1 等於 1。" });

  /* ═══════ G. 從圖看凹向（4）═══════ 答案是區間 */
  add({ id: "gx-051", rank: 3, answerKind: "interval",
    prompt: "\\text{如圖 }f(x)=x^3-3x^2\\text{。求 }f\\text{ 凹向上的區間}",
    graph: { window: [-2, 4, -5, 3], curves: [{ expr: "x**3-3*x**2" }] }, answer: "(1, inf)", timeLimit: 55, tags: ["concavity"],
    verify: { m: "concaveUp", f: "x^3-3x^2", range: [-20, 20] },
    hints: ["凹向上 ⇔ f″>0。", "f″=6x−6。", "x>1。"], solution: "f″=6x−6>0 ⇔ x>1；圖上 x=1 是反曲點，右邊像杯子。" });
  add({ id: "gx-052", rank: 4, answerKind: "interval",
    prompt: "\\text{如圖 }f(x)=xe^{-x}\\text{。求 }f\\text{ 凹向上的區間}",
    graph: { window: [-1, 6, -0.5, 0.6], curves: [{ expr: "x*exp(-x)", domain: [-0.8, 6] }] }, answer: "(2, inf)", timeLimit: 65, tags: ["concavity", "exponential"],
    verify: { m: "concaveUp", f: "xe^{-x}", range: [-5, 30] },
    hints: ["f′=(1−x)e^{−x}，f″=(x−2)e^{−x}。", "f″>0 ⇔ x>2。"], solution: "f″=(x−2)e^{−x}，在 x>2 為正。" });
  add({ id: "gx-053", rank: 4, answerKind: "interval",
    prompt: "\\text{如圖 }f(x)=x^4-6x^2\\text{。求 }f\\text{ 凹向下的區間}",
    graph: { window: [-3, 3, -10, 6], curves: [{ expr: "x**4-6*x**2" }] }, answer: "(-1, 1)", timeLimit: 60, tags: ["concavity"],
    verify: { m: "concaveDown", f: "x^4-6x^2", range: [-20, 20] },
    hints: ["f″=12x²−12。", "f″<0 ⇔ x²<1。"], solution: "f″=12(x²−1)<0 ⇔ −1<x<1：中間那個山頂附近是凹向下的。" });
  add({ id: "gx-054", rank: 4, answerKind: "interval",
    prompt: "\\text{如圖 }f(x)=\\sin x\\text{（}0<x<2\\pi\\text{）。求 }f\\text{ 凹向上的區間}",
    graph: { window: [0, 6.4, -1.5, 1.5], curves: [{ expr: "sin(x)", domain: [0, 6.3] }] }, answer: "(pi, 2*pi)", timeLimit: 55, tags: ["concavity", "trig"],
    verify: { m: "concaveUp", f: "\\sin x", range: [0.01, 9] },
    hints: ["f″=−sin x。", "f″>0 ⇔ sin x<0。", "π<x<2π。"], solution: "f″=−sin x>0 ⇔ sin x<0 ⇔ π<x<2π（波谷那一段）。" });

  /* ═══════ H. 塗色區域的面積（6）═══════ */
  add({ id: "gx-055", rank: 3, answerKind: "numeric", topic: "integrals",
    prompt: "\\text{求圖中塗色區域的面積：}y=x^2\\text{ 與 }x\\text{ 軸之間，}0\\le x\\le 2",
    graph: { window: [-1, 3, -1, 5], curves: [{ expr: "x**2" }], fills: [{ expr: "x**2", from: 0, to: 2 }] }, answer: "8/3", timeLimit: 45, tags: ["area"],
    verify: { m: "integral", f: "x^2", a: 0, b: 2 }, hints: ["∫₀²x²dx。", "x³/3 從 0 到 2。"], solution: "∫₀²x²dx = 8/3。" });
  add({ id: "gx-056", rank: 4, answerKind: "numeric", topic: "integrals",
    prompt: "\\text{求圖中塗色區域的面積：}y=x\\text{ 與 }y=x^2\\text{ 所圍}",
    graph: { window: [-0.5, 1.5, -0.5, 1.5], curves: [{ expr: "x" }, { expr: "x**2" }], fills: [{ pts: betweenPolygon((x) => x, (x) => x * x, 0, 1, 40) }] }, answer: "1/6", timeLimit: 55, tags: ["area", "between-curves"],
    verify: { m: "integral", f: "x-x^2", a: 0, b: 1 }, hints: ["交點 0 與 1。", "上減下：x−x²。"], solution: "∫₀¹(x−x²)dx = ½−⅓ = 1/6。" });
  add({ id: "gx-057", rank: 3, answerKind: "numeric", topic: "integrals",
    prompt: "\\text{求圖中塗色區域的面積：}y=\\sin x\\text{ 與 }x\\text{ 軸之間，}0\\le x\\le\\pi",
    graph: { window: [-0.5, 3.7, -0.5, 1.5], curves: [{ expr: "sin(x)", domain: [-0.5, 3.7] }], fills: [{ expr: "sin(x)", from: 0, to: 3.14159 }] }, answer: "2", timeLimit: 45, tags: ["area", "trig"],
    verify: { m: "integral", f: "\\sin x", a: 0, b: "\\pi" }, hints: ["∫₀^π sin x dx。", "−cos x 從 0 到 π。"], solution: "∫₀^π sin x dx = 2。" });
  add({ id: "gx-058", rank: 4, answerKind: "numeric", topic: "integrals",
    prompt: "\\text{求圖中塗色區域的面積：}y=\\frac{1}{1+x^2}\\text{ 與 }x\\text{ 軸之間，}0\\le x\\le 1",
    graph: { window: [-1.5, 2.5, -0.3, 1.3], curves: [{ expr: "1/(1+x**2)" }], fills: [{ expr: "1/(1+x**2)", from: 0, to: 1 }] }, answer: "pi/4", timeLimit: 50, tags: ["area", "inverse-trig"],
    verify: { m: "integral", f: "\\frac{1}{1+x^2}", a: 0, b: 1 }, hints: ["∫ 1/(1+x²) = arctan x。", "arctan 1 = π/4。"], solution: "arctan 1 − arctan 0 = π/4。" });
  add({ id: "gx-059", rank: 4, answerKind: "numeric", topic: "integrals",
    prompt: "\\text{求圖中塗色區域的面積：}y=4-x^2\\text{ 與 }x\\text{ 軸所圍}",
    graph: { window: [-3, 3, -1, 5], curves: [{ expr: "4-x**2" }], fills: [{ expr: "4-x**2", from: -2, to: 2 }] }, answer: "32/3", timeLimit: 55, tags: ["area"],
    verify: { m: "integral", f: "4-x^2", a: -2, b: 2 }, hints: ["零點 ±2。", "∫_{−2}^{2}(4−x²)dx，偶函數可以算一半再乘 2。"], solution: "2∫₀²(4−x²)dx = 2(8−8/3) = 32/3。" });
  add({ id: "gx-060", rank: 5, answerKind: "numeric", topic: "integrals",
    prompt: "\\text{求圖中塗色區域的面積：}y=\\ln x\\text{ 與 }x\\text{ 軸之間，}1\\le x\\le e",
    graph: { window: [0, 3.5, -1.5, 1.5], curves: [{ expr: "log(x)", domain: [0.1, 3.5] }], fills: [{ expr: "log(x)", from: 1, to: 2.71828 }] }, answer: "1", timeLimit: 65, tags: ["area", "log", "integration-by-parts"],
    verify: { m: "integral", f: "\\ln x", a: 1, b: "e" }, hints: ["∫ln x dx = x ln x − x。", "在 e 是 e−e=0，在 1 是 −1。"], solution: "[x ln x − x]₁^e = 0 − (−1) = 1。" });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
