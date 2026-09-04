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
