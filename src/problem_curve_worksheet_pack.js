// 作圖表題：填完表格，再把圖畫出來
//
// 給一個 f，逐格填入遞增／遞減、極大／極小、凹向上／凹向下、反曲點，
// 最後在計算紙上手繪出大致的形狀。
//
// 為什麼是一張表而不是七道獨立的題：**表格本身就是方法**。
// 課本教作圖教的不是「會算 f′」，是「照順序把這些欄位填完，圖形就浮出來了」。
// 拆成七題各自答對，練不到那個順序感 —— 而那個順序感才是考試要的東西。
//
// 手繪不判分（沒辦法自動判一張手畫的圖），但送出之後會把正確的圖畫在旁邊
// 讓使用者自己對照。自己看出差在哪，比一個分數有用。
//
// 每一格的答案都帶自己的 verify 描述子，由
// tools/lib/set_interval_verify.js 獨立算過 —— 一張有錯格的作圖表
// 比一題錯答案更傷，因為它同時教錯了七件事裡的一件，而使用者會照著畫。
//
// 極值用的是**一階變號**而不是二階判別法：f″=0 的時候二階判別法失效
// （x⁴ 在 0 有極小值但 f″(0)=0），變號法沒有那個死角。

(function () {
  "use strict";

  const SOURCE = "Buzz 作圖表包 2026";

  function add(problem) {
    const tags = (problem.tags || []).slice();
    tags.push(`rank-${problem.rank}`);
    tags.push("curve-sketching");
    if (problem.rank >= 5) tags.push("boss-rank");
    if (problem.rank <= 2) tags.push("beginner-friendly");
    return {
      source: SOURCE,
      difficulty: Math.min(4, problem.rank),
      answerKind: "worksheet",
      topic: "derivatives",
      // 作圖表是「練習」不是「反射」—— 時間要夠填完七格
      timeLimit: 240,
      ...problem,
      tags
    };
  }

  // 七個欄位的樣板。每一題只要換 f 與各格答案。
  function fields(f, range, answers) {
    return [
      { key: "increasing", label: "遞增區間", note: "f′ > 0", kind: "interval",
        answer: answers.increasing, verify: { m: "increasing", f, range } },
      { key: "decreasing", label: "遞減區間", note: "f′ < 0", kind: "interval",
        answer: answers.decreasing, verify: { m: "decreasing", f, range } },
      { key: "localMax", label: "極大值的 x", note: "f′ 由正變負", kind: "set",
        answer: answers.localMax, verify: { m: "localMax", f, range } },
      { key: "localMin", label: "極小值的 x", note: "f′ 由負變正", kind: "set",
        answer: answers.localMin, verify: { m: "localMin", f, range } },
      { key: "concaveUp", label: "凹向上的區間", note: "f″ > 0", kind: "interval",
        answer: answers.concaveUp, verify: { m: "concaveUp", f, range } },
      { key: "concaveDown", label: "凹向下的區間", note: "f″ < 0", kind: "interval",
        answer: answers.concaveDown, verify: { m: "concaveDown", f, range } },
      { key: "inflection", label: "反曲點的 x", note: "f″ 變號", kind: "set",
        answer: answers.inflection, verify: { m: "inflection", f, range } }
    ];
  }

  const problems = [
    add({
      id: "cw-001",
      rank: 3,
      prompt: "\\text{完成 }f(x)=x^3-3x\\text{ 的作圖表}",
      fields: fields("x^3-3x", [-20, 20], {
        increasing: "(-inf, -1) U (1, inf)",
        decreasing: "(-1, 1)",
        localMax: "{-1}",
        localMin: "{1}",
        concaveUp: "(0, inf)",
        concaveDown: "(-inf, 0)",
        inflection: "{0}"
      }),
      answer: "increasing=(-inf, -1) U (1, inf); decreasing=(-1, 1); localMax={-1}; localMin={1}; concaveUp=(0, inf); concaveDown=(-inf, 0); inflection={0}",
      sketch: { expr: "x**3-3*x", window: [-3, 3, -5, 5] },
      tags: ["first-derivative", "concavity", "inflection"],
      hints: [
        "先算 f′ 與 f″，兩個都因式分解。",
        "f′=3(x−1)(x+1)：兩個臨界點把數線切成三段。",
        "f″=6x：只在 x=0 變號，所以凹凸各一段。"
      ],
      solutionSteps: [
        "f′(x)=3x²−3=3(x−1)(x+1)，臨界點 x=±1。",
        "判號：f′ 在 (−∞,−1) 正、(−1,1) 負、(1,∞) 正 ⟹ 極大在 −1、極小在 1。",
        "f″(x)=6x，在 x=0 變號 ⟹ 反曲點 x=0，左凹下右凹上。",
        "把表格連起來畫：左上升到 (−1,2)、下降穿過原點到 (1,−2)、再上升。"
      ],
      solution: "f′=3(x−1)(x+1) 給極值 x=±1；f″=6x 給反曲點 x=0。左段凹下、右段凹上，形狀是先升後降再升。"
    }),

    add({
      id: "cw-002",
      rank: 3,
      prompt: "\\text{完成 }f(x)=x^4-2x^2\\text{ 的作圖表}",
      fields: fields("x^4-2x^2", [-20, 20], {
        increasing: "(-1, 0) U (1, inf)",
        decreasing: "(-inf, -1) U (0, 1)",
        localMax: "{0}",
        localMin: "{-1, 1}",
        concaveUp: "(-inf, -sqrt(3)/3) U (sqrt(3)/3, inf)",
        concaveDown: "(-sqrt(3)/3, sqrt(3)/3)",
        inflection: "{-sqrt(3)/3, sqrt(3)/3}"
      }),
      answer: "increasing=(-1, 0) U (1, inf); decreasing=(-inf, -1) U (0, 1); localMax={0}; localMin={-1, 1}; concaveUp=(-inf, -sqrt(3)/3) U (sqrt(3)/3, inf); concaveDown=(-sqrt(3)/3, sqrt(3)/3); inflection={-sqrt(3)/3, sqrt(3)/3}",
      sketch: { expr: "x**4-2*x**2", window: [-2.2, 2.2, -1.6, 2.5] },
      tags: ["first-derivative", "concavity", "inflection", "even-function"],
      hints: [
        "f′=4x³−4x=4x(x−1)(x+1)，三個臨界點。",
        "偶函數 —— 表格左右一定對稱。",
        "f″=12x²−4，零點是 ±1/√3。"
      ],
      solutionSteps: [
        "f′(x)=4x(x−1)(x+1)，臨界點 x=−1, 0, 1。",
        "判號得 W 形：x=±1 是極小（f=−1），x=0 是局部極大（f=0）。",
        "f″(x)=12x²−4，零點 x=±1/√3≈±0.577，兩點都變號 ⟹ 兩個反曲點。",
        "中間那一段凹向下（連著 x=0 的局部極大），兩側凹向上。"
      ],
      solution: "f′=4x(x²−1) 給三個臨界點（W 形）；f″=12x²−4 給兩個反曲點 ±1/√3。偶函數，兩端趨向 +∞。"
    }),

    add({
      id: "cw-003",
      rank: 4,
      prompt: "\\text{完成 }f(x)=xe^{-x}\\text{ 的作圖表}",
      fields: fields("xe^{-x}", [-15, 25], {
        increasing: "(-inf, 1)",
        decreasing: "(1, inf)",
        localMax: "{1}",
        localMin: "{}",
        concaveUp: "(2, inf)",
        concaveDown: "(-inf, 2)",
        inflection: "{2}"
      }),
      answer: "increasing=(-inf, 1); decreasing=(1, inf); localMax={1}; localMin={}; concaveUp=(2, inf); concaveDown=(-inf, 2); inflection={2}",
      sketch: { expr: "x*exp(-x)", window: [-1, 6, -1.2, 0.8] },
      tags: ["first-derivative", "concavity", "inflection", "exponential"],
      hints: [
        "乘積律兩次：f′=e^{−x}(1−x)，f″=e^{−x}(x−2)。",
        "e^{−x} 永遠為正，所以只看括號的符號。",
        "沒有極小值 —— 那一格填 {}。"
      ],
      solutionSteps: [
        "f′(x)=e^{−x}(1−x)：指數項恆正，所以 f′>0 ⟺ x<1。",
        "唯一臨界點 x=1，且 f′ 由正變負 ⟹ 極大值 f(1)=1/e。沒有極小值。",
        "f″(x)=e^{−x}(x−2)：在 x=2 變號 ⟹ 反曲點，左凹下右凹上。",
        "兩端：x→−∞ 時 f→−∞；x→+∞ 時 f→0⁺（指數壓過多項式）。"
      ],
      solution: "f′=e^{−x}(1−x) 給唯一極大 x=1；f″=e^{−x}(x−2) 給反曲點 x=2；右端趨近 0⁺。沒有極小值。"
    }),

    add({
      id: "cw-004",
      rank: 4,
      prompt: "\\text{完成 }f(x)=\\frac{x}{x^2+1}\\text{ 的作圖表}",
      fields: fields("\\frac{x}{x^2+1}", [-25, 25], {
        increasing: "(-1, 1)",
        decreasing: "(-inf, -1) U (1, inf)",
        localMax: "{1}",
        localMin: "{-1}",
        concaveUp: "(-sqrt(3), 0) U (sqrt(3), inf)",
        concaveDown: "(-inf, -sqrt(3)) U (0, sqrt(3))",
        inflection: "{-sqrt(3), 0, sqrt(3)}"
      }),
      answer: "increasing=(-1, 1); decreasing=(-inf, -1) U (1, inf); localMax={1}; localMin={-1}; concaveUp=(-sqrt(3), 0) U (sqrt(3), inf); concaveDown=(-inf, -sqrt(3)) U (0, sqrt(3)); inflection={-sqrt(3), 0, sqrt(3)}",
      sketch: { expr: "x/(x*x+1)", window: [-5, 5, -0.7, 0.7] },
      tags: ["first-derivative", "concavity", "inflection", "quotient-rule"],
      hints: [
        "f′=(1−x²)/(x²+1)²，分母恆正。",
        "這一題有**三個**反曲點 —— 別漏掉原點。",
        "奇函數，而且 x→±∞ 時 f→0。"
      ],
      solutionSteps: [
        "商律：f′(x)=(1−x²)/(x²+1)²，分母恆正 ⟹ f′>0 ⟺ |x|<1。",
        "極小在 x=−1（f=−1/2）、極大在 x=1（f=1/2）。",
        "f″(x)=2x(x²−3)/(x²+1)³，零點 x=0 與 x=±√3，三個都變號。",
        "奇函數、水平漸近線 y=0。畫起來像一個壓扁的 S，兩端趨近 x 軸。"
      ],
      solution: "f′=(1−x²)/(x²+1)² 給極值 ±1；f″ 的零點是 0 與 ±√3，三個反曲點；奇函數，y=0 為水平漸近線。"
    }),

    add({
      id: "cw-005",
      rank: 4,
      prompt: "\\text{完成 }f(x)=x^4-4x^3\\text{ 的作圖表}",
      fields: fields("x^4-4x^3", [-15, 15], {
        increasing: "(3, inf)",
        decreasing: "(-inf, 3)",
        localMax: "{}",
        localMin: "{3}",
        concaveUp: "(-inf, 0) U (2, inf)",
        concaveDown: "(0, 2)",
        inflection: "{0, 2}"
      }),
      answer: "increasing=(3, inf); decreasing=(-inf, 3); localMax={}; localMin={3}; concaveUp=(-inf, 0) U (2, inf); concaveDown=(0, 2); inflection={0, 2}",
      sketch: { expr: "x**4-4*x**3", window: [-1.5, 4.5, -30, 12] },
      tags: ["first-derivative", "concavity", "inflection", "repeated-root"],
      hints: [
        "f′=4x²(x−3)：x=0 是重根。",
        "重根處 f′ **不變號** —— 所以 x=0 是臨界點但不是極值。",
        "f″=12x²−24x=12x(x−2)，兩個反曲點。"
      ],
      solutionSteps: [
        "f′(x)=4x³−12x²=4x²(x−3)，臨界點 x=0（重根）與 x=3。",
        "x=0 兩側 f′ 都是負的 —— **不變號，所以不是極值**。這是這一題的陷阱。",
        "x=3 處 f′ 由負變正 ⟹ 極小值 f(3)=−27。沒有極大值。",
        "f″(x)=12x(x−2)，零點 0 與 2 都變號 ⟹ 兩個反曲點。x=0 同時是臨界點與反曲點。"
      ],
      solution: "f′=4x²(x−3)：x=0 是重根不變號（非極值），唯一極小在 x=3（f=−27）；f″=12x(x−2) 給反曲點 0 與 2。"
    })
  ];

  window.BUZZ_CURVE_WORKSHEET_PROBLEMS = problems;
  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
