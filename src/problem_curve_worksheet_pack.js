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
,

    add({
      id: "cw-006",
      rank: 2,
      prompt: "\\text{完成 }f(x)=x^3-12x\\text{ 的作圖表}",
      fields: fields("x^3-12x", [-20, 20], {
        increasing: "(-inf, -2) U (2, inf)",
        decreasing: "(-2, 2)",
        localMax: "{-2}",
        localMin: "{2}",
        concaveUp: "(0, inf)",
        concaveDown: "(-inf, 0)",
        inflection: "{0}"
      }),
      answer: "increasing=(-inf, -2) U (2, inf); decreasing=(-2, 2); localMax={-2}; localMin={2}; concaveUp=(0, inf); concaveDown=(-inf, 0); inflection={0}",
      sketch: { expr: "x**3-12*x", window: [-4.5, 4.5, -20, 20] },
      tags: ["first-derivative", "concavity", "inflection"],
      hints: [
        "f′=3x²−12，先因式分解。",
        "3(x−2)(x+2) 的零點是 ±2。",
        "f″=6x，只在原點變號。"
      ],
      solutionSteps: [
        "f′(x)=3x²−12=3(x−2)(x+2)，臨界點 x=±2。",
        "判號：f′ 在 (−∞,−2) 正、(−2,2) 負、(2,∞) 正 ⟹ 極大在 −2、極小在 2。",
        "f″(x)=6x，在 x=0 變號 ⟹ 反曲點 x=0。",
        "f(−2)=16 是極大、f(2)=−16 是極小，形狀跟 x³−3x 同型，只是拉開了。"
      ],
      solution: "f′=3(x−2)(x+2) 給極值 ±2；f″=6x 給反曲點 0。極大 f(−2)=16、極小 f(2)=−16。"
    }),

    add({
      id: "cw-007",
      rank: 2,
      prompt: "\\text{完成 }f(x)=x^2-4x+3\\text{ 的作圖表}",
      fields: fields("x^2-4x+3", [-20, 20], {
        increasing: "(2, inf)",
        decreasing: "(-inf, 2)",
        localMax: "{}",
        localMin: "{2}",
        concaveUp: "(-inf, inf)",
        concaveDown: "無",
        inflection: "{}"
      }),
      answer: "increasing=(2, inf); decreasing=(-inf, 2); localMax={}; localMin={2}; concaveUp=(-inf, inf); concaveDown=無; inflection={}",
      sketch: { expr: "x**2-4*x+3", window: [-1.5, 5.5, -2, 8] },
      tags: ["first-derivative", "concavity", "quadratic"],
      hints: [
        "f′=2x−4，一次式只有一個零點。",
        "f″=2 是常數，而且是正的。",
        "常數的二階導數不會變號 —— 沒有反曲點。"
      ],
      solutionSteps: [
        "f′(x)=2x−4，零點 x=2。",
        "f′ 在 x=2 由負變正 ⟹ 極小值 f(2)=−1。沒有極大值。",
        "f″(x)=2>0 恆成立 ⟹ 整條凹向上，凹向下的區間是**空的**。",
        "f″ 是正常數，永遠不變號 ⟹ 沒有反曲點。這一題的重點就是「有些格子是空的」。"
      ],
      solution: "f′=2x−4 給唯一極小 x=2；f″=2>0 恆成立，整條凹向上、沒有反曲點。"
    }),

    add({
      id: "cw-008",
      rank: 3,
      prompt: "\\text{完成 }f(x)=x^3+3x\\text{ 的作圖表}",
      fields: fields("x^3+3x", [-20, 20], {
        increasing: "(-inf, inf)",
        decreasing: "無",
        localMax: "{}",
        localMin: "{}",
        concaveUp: "(0, inf)",
        concaveDown: "(-inf, 0)",
        inflection: "{0}"
      }),
      answer: "increasing=(-inf, inf); decreasing=無; localMax={}; localMin={}; concaveUp=(0, inf); concaveDown=(-inf, 0); inflection={0}",
      sketch: { expr: "x**3+3*x", window: [-3, 3, -18, 18] },
      tags: ["first-derivative", "concavity", "inflection"],
      hints: [
        "f′=3x²+3，看得出它的符號嗎？",
        "3x²+3 ≥ 3 > 0 恆成立。",
        "沒有臨界點 ⟹ 沒有極值，但還是有反曲點。"
      ],
      solutionSteps: [
        "f′(x)=3x²+3。x² ≥ 0 所以 f′ ≥ 3 > 0 恆成立。",
        "f′ 永遠不為零 ⟹ 沒有臨界點，也就沒有極值。整條遞增。",
        "但 f″(x)=6x 照樣在 x=0 變號 ⟹ 反曲點 x=0。",
        "「單調遞增卻有反曲點」是這一題要建立的直覺：凹凸跟增減是兩件獨立的事。"
      ],
      solution: "f′=3x²+3>0 恆成立，整條遞增、無極值；但 f″=6x 仍在 x=0 變號，有反曲點。"
    }),

    add({
      id: "cw-009",
      rank: 3,
      prompt: "\\text{完成 }f(x)=x^3-3x^2+3x\\text{ 的作圖表}",
      fields: fields("x^3-3x^2+3x", [-20, 20], {
        increasing: "(-inf, inf)",
        decreasing: "無",
        localMax: "{}",
        localMin: "{}",
        concaveUp: "(1, inf)",
        concaveDown: "(-inf, 1)",
        inflection: "{1}"
      }),
      answer: "increasing=(-inf, inf); decreasing=無; localMax={}; localMin={}; concaveUp=(1, inf); concaveDown=(-inf, 1); inflection={1}",
      sketch: { expr: "x**3-3*x**2+3*x", window: [-1, 3.5, -2, 8] },
      tags: ["first-derivative", "concavity", "inflection", "repeated-root"],
      hints: [
        "f′=3x²−6x+3，試著配成完全平方。",
        "f′=3(x−1)²≥0。",
        "有臨界點但不變號 ⟹ 不是極值。"
      ],
      solutionSteps: [
        "f′(x)=3x²−6x+3=3(x−1)²。",
        "f′ ≥ 0 恆成立，只在 x=1 等於零 —— 而且**不變號**。",
        "所以 x=1 是臨界點但**不是極值**，整條仍然遞增。",
        "f″(x)=6x−6 在 x=1 變號 ⟹ 反曲點恰好也在 x=1。臨界點與反曲點重合的例子。"
      ],
      solution: "f′=3(x−1)²≥0：x=1 是臨界點但不變號，非極值；整條遞增。f″=6x−6 使 x=1 同時是反曲點。"
    }),

    add({
      id: "cw-010",
      rank: 3,
      prompt: "\\text{完成 }f(x)=x^3-6x^2+9x\\text{ 的作圖表}",
      fields: fields("x^3-6x^2+9x", [-20, 20], {
        increasing: "(-inf, 1) U (3, inf)",
        decreasing: "(1, 3)",
        localMax: "{1}",
        localMin: "{3}",
        concaveUp: "(2, inf)",
        concaveDown: "(-inf, 2)",
        inflection: "{2}"
      }),
      answer: "increasing=(-inf, 1) U (3, inf); decreasing=(1, 3); localMax={1}; localMin={3}; concaveUp=(2, inf); concaveDown=(-inf, 2); inflection={2}",
      sketch: { expr: "x**3-6*x**2+9*x", window: [-0.5, 4.5, -2, 6] },
      tags: ["first-derivative", "concavity", "inflection"],
      hints: [
        "f′=3x²−12x+9，提出 3 再分解。",
        "3(x−1)(x−3) 的零點是 1 與 3。",
        "反曲點會落在兩個極值的正中間。"
      ],
      solutionSteps: [
        "f′(x)=3x²−12x+9=3(x−1)(x−3)，臨界點 x=1, 3。",
        "判號 ⟹ 極大在 x=1（f=4）、極小在 x=3（f=0）。",
        "f″(x)=6x−12，在 x=2 變號 ⟹ 反曲點 x=2（f=2）。",
        "三次多項式的反曲點永遠落在兩個極值的中點 —— 可以拿來檢查自己算對沒有。"
      ],
      solution: "f′=3(x−1)(x−3) 給極大 x=1（f=4）與極小 x=3（f=0）；f″=6x−12 給反曲點 x=2，正好是中點。"
    }),

    add({
      id: "cw-011",
      rank: 3,
      prompt: "\\text{完成 }f(x)=x^4-8x^2\\text{ 的作圖表}",
      fields: fields("x^4-8x^2", [-20, 20], {
        increasing: "(-2, 0) U (2, inf)",
        decreasing: "(-inf, -2) U (0, 2)",
        localMax: "{0}",
        localMin: "{-2, 2}",
        concaveUp: "(-inf, -2*sqrt(3)/3) U (2*sqrt(3)/3, inf)",
        concaveDown: "(-2*sqrt(3)/3, 2*sqrt(3)/3)",
        inflection: "{-2*sqrt(3)/3, 2*sqrt(3)/3}"
      }),
      answer: "increasing=(-2, 0) U (2, inf); decreasing=(-inf, -2) U (0, 2); localMax={0}; localMin={-2, 2}; concaveUp=(-inf, -2*sqrt(3)/3) U (2*sqrt(3)/3, inf); concaveDown=(-2*sqrt(3)/3, 2*sqrt(3)/3); inflection={-2*sqrt(3)/3, 2*sqrt(3)/3}",
      sketch: { expr: "x**4-8*x**2", window: [-3.4, 3.4, -18, 12] },
      tags: ["first-derivative", "concavity", "inflection", "even-function"],
      hints: [
        "f′=4x³−16x=4x(x−2)(x+2)，三個臨界點。",
        "偶函數 —— 表格一定左右對稱。",
        "f″=12x²−16，零點是 ±2/√3。"
      ],
      solutionSteps: [
        "f′(x)=4x³−16x=4x(x−2)(x+2)，臨界點 x=−2, 0, 2。",
        "判號得 W 形：x=±2 是極小（f=−16），x=0 是局部極大（f=0）。",
        "f″(x)=12x²−16，零點 x=±2/√3=±2√3/3≈±1.155，兩點都變號。",
        "偶函數，兩端趨向 +∞。反曲點落在極小與局部極大之間，各一個。"
      ],
      solution: "f′=4x(x²−4) 給三個臨界點（W 形，極小 ±2、局部極大 0）；f″=12x²−16 給反曲點 ±2√3/3。"
    }),

    add({
      id: "cw-012",
      rank: 4,
      prompt: "\\text{完成 }f(x)=x^2e^{-x}\\text{ 的作圖表}",
      fields: fields("x^2e^{-x}", [-12, 30], {
        increasing: "(0, 2)",
        decreasing: "(-inf, 0) U (2, inf)",
        localMax: "{2}",
        localMin: "{0}",
        concaveUp: "(-inf, 2-sqrt(2)) U (2+sqrt(2), inf)",
        concaveDown: "(2-sqrt(2), 2+sqrt(2))",
        inflection: "{2-sqrt(2), 2+sqrt(2)}"
      }),
      answer: "increasing=(0, 2); decreasing=(-inf, 0) U (2, inf); localMax={2}; localMin={0}; concaveUp=(-inf, 2-sqrt(2)) U (2+sqrt(2), inf); concaveDown=(2-sqrt(2), 2+sqrt(2)); inflection={2-sqrt(2), 2+sqrt(2)}",
      sketch: { expr: "x*x*exp(-x)", window: [-1, 8, -0.3, 1.2] },
      tags: ["first-derivative", "concavity", "inflection", "exponential", "product-rule"],
      hints: [
        "乘積律：f′=e^{−x}(2x−x²)=x e^{−x}(2−x)。",
        "指數項恆正，只看 x(2−x)。",
        "f″=e^{−x}(x²−4x+2)，用公式解那個二次式。"
      ],
      solutionSteps: [
        "f′(x)=2xe^{−x}−x²e^{−x}=xe^{−x}(2−x)，臨界點 x=0 與 x=2。",
        "e^{−x}>0，所以符號由 x(2−x) 決定：(0,2) 為正，兩側為負 ⟹ 極小 x=0、極大 x=2。",
        "f″(x)=e^{−x}(x²−4x+2)，零點 x=2±√2≈0.586 與 3.414，兩點都變號。",
        "兩端：x→−∞ 時 f→+∞；x→+∞ 時 f→0⁺。中間鼓起一個包，峰在 x=2（f=4/e²≈0.54）。"
      ],
      solution: "f′=xe^{−x}(2−x) 給極小 0、極大 2；f″=e^{−x}(x²−4x+2) 給反曲點 2±√2；右端趨近 0⁺。"
    }),

    add({
      id: "cw-013",
      rank: 4,
      prompt: "\\text{完成 }f(x)=\\ln(x^2+1)\\text{ 的作圖表}",
      fields: fields("\\log(x^2+1)", [-25, 25], {
        increasing: "(0, inf)",
        decreasing: "(-inf, 0)",
        localMax: "{}",
        localMin: "{0}",
        concaveUp: "(-1, 1)",
        concaveDown: "(-inf, -1) U (1, inf)",
        inflection: "{-1, 1}"
      }),
      answer: "increasing=(0, inf); decreasing=(-inf, 0); localMax={}; localMin={0}; concaveUp=(-1, 1); concaveDown=(-inf, -1) U (1, inf); inflection={-1, 1}",
      sketch: { expr: "log(x*x+1)", window: [-6, 6, -0.5, 4] },
      tags: ["first-derivative", "concavity", "inflection", "log", "even-function"],
      hints: [
        "鏈鎖律：f′=2x/(x²+1)，分母恆正。",
        "定義域是全實數（x²+1 永遠 ≥1）。",
        "f″=2(1−x²)/(x²+1)²，零點 ±1。"
      ],
      solutionSteps: [
        "x²+1≥1>0，所以定義域是全實數，沒有漸近線問題。",
        "f′(x)=2x/(x²+1)：分母恆正 ⟹ 符號跟 x 相同 ⟹ 極小在 x=0（f=0）。沒有極大值。",
        "f″(x)=2(1−x²)/(x²+1)²，零點 x=±1，兩點都變號。",
        "中間 (−1,1) 凹向上，兩側凹向下 —— 偶函數，兩端緩慢趨向 +∞（比任何多項式都慢）。"
      ],
      solution: "f′=2x/(x²+1) 給唯一極小 x=0；f″=2(1−x²)/(x²+1)² 給反曲點 ±1；偶函數，兩端緩慢上升。"
    }),

    add({
      id: "cw-014",
      rank: 4,
      prompt: "\\text{完成 }f(x)=e^{-x^2}\\text{ 的作圖表}",
      fields: fields("e^{-x^2}", [-8, 8], {
        increasing: "(-inf, 0)",
        decreasing: "(0, inf)",
        localMax: "{0}",
        localMin: "{}",
        concaveUp: "(-inf, -sqrt(2)/2) U (sqrt(2)/2, inf)",
        concaveDown: "(-sqrt(2)/2, sqrt(2)/2)",
        inflection: "{-sqrt(2)/2, sqrt(2)/2}"
      }),
      answer: "increasing=(-inf, 0); decreasing=(0, inf); localMax={0}; localMin={}; concaveUp=(-inf, -sqrt(2)/2) U (sqrt(2)/2, inf); concaveDown=(-sqrt(2)/2, sqrt(2)/2); inflection={-sqrt(2)/2, sqrt(2)/2}",
      sketch: { expr: "exp(-x*x)", window: [-3, 3, -0.2, 1.2] },
      tags: ["first-derivative", "concavity", "inflection", "exponential", "even-function"],
      hints: [
        "f′=−2x e^{−x²}，指數項恆正。",
        "f″=(4x²−2)e^{−x²}。",
        "反曲點在 ±1/√2 —— 那就是常態分布的一個標準差。"
      ],
      solutionSteps: [
        "f′(x)=−2xe^{−x²}：指數項恆正 ⟹ 符號跟 −x 相同 ⟹ 極大在 x=0（f=1）。沒有極小值。",
        "f″(x)=(4x²−2)e^{−x²}，零點 x=±1/√2=±√2/2≈±0.707。",
        "中間凹向下（鐘頂），兩側凹向上（尾巴）。",
        "兩端 f→0⁺ 但永遠不等於 0 —— 水平漸近線 y=0。這就是常態分布的形狀。"
      ],
      solution: "f′=−2xe^{−x²} 給唯一極大 x=0（f=1）；f″=(4x²−2)e^{−x²} 給反曲點 ±√2/2；水平漸近線 y=0。"
    }),

    add({
      id: "cw-015",
      rank: 4,
      prompt: "\\text{完成 }f(x)=x^5-5x\\text{ 的作圖表}",
      fields: fields("x^5-5x", [-12, 12], {
        increasing: "(-inf, -1) U (1, inf)",
        decreasing: "(-1, 1)",
        localMax: "{-1}",
        localMin: "{1}",
        concaveUp: "(0, inf)",
        concaveDown: "(-inf, 0)",
        inflection: "{0}"
      }),
      answer: "increasing=(-inf, -1) U (1, inf); decreasing=(-1, 1); localMax={-1}; localMin={1}; concaveUp=(0, inf); concaveDown=(-inf, 0); inflection={0}",
      sketch: { expr: "x**5-5*x", window: [-2, 2, -8, 8] },
      tags: ["first-derivative", "concavity", "inflection"],
      hints: [
        "f′=5x⁴−5=5(x⁴−1)，先分解成兩個平方差。",
        "x⁴−1=(x²−1)(x²+1)，只有 ±1 是實根。",
        "f″=20x³，跟 x³ 同號。"
      ],
      solutionSteps: [
        "f′(x)=5x⁴−5=5(x²−1)(x²+1)。x²+1 無實根，所以臨界點只有 x=±1。",
        "判號：f′ 在 (−∞,−1) 正、(−1,1) 負、(1,∞) 正 ⟹ 極大 −1（f=4）、極小 1（f=−4）。",
        "f″(x)=20x³，在 x=0 變號 ⟹ 反曲點 x=0。",
        "奇函數。跟 x³−3x 同型，但中間那段更平、兩端更陡。"
      ],
      solution: "f′=5(x²−1)(x²+1) 給極值 ±1（f=±4）；f″=20x³ 給反曲點 0。奇函數。"
    }),

    add({
      id: "cw-016",
      rank: 4,
      prompt: "\\text{完成 }f(x)=3x^4-4x^3\\text{ 的作圖表}",
      fields: fields("3x^4-4x^3", [-12, 12], {
        increasing: "(1, inf)",
        decreasing: "(-inf, 1)",
        localMax: "{}",
        localMin: "{1}",
        concaveUp: "(-inf, 0) U (2/3, inf)",
        concaveDown: "(0, 2/3)",
        inflection: "{0, 2/3}"
      }),
      answer: "increasing=(1, inf); decreasing=(-inf, 1); localMax={}; localMin={1}; concaveUp=(-inf, 0) U (2/3, inf); concaveDown=(0, 2/3); inflection={0, 2/3}",
      sketch: { expr: "3*x**4-4*x**3", window: [-1, 2, -1.5, 3] },
      tags: ["first-derivative", "concavity", "inflection", "repeated-root"],
      hints: [
        "f′=12x³−12x²=12x²(x−1)。",
        "x=0 是重根 —— f′ 不變號，所以不是極值。",
        "f″=36x²−24x=12x(3x−2)。"
      ],
      solutionSteps: [
        "f′(x)=12x³−12x²=12x²(x−1)，臨界點 x=0（重根）與 x=1。",
        "x=0 兩側 f′ 都是負的 ⟹ **不變號，不是極值**。",
        "x=1 處 f′ 由負變正 ⟹ 唯一極小 f(1)=−1。沒有極大值。",
        "f″(x)=12x(3x−2)，零點 0 與 2/3 都變號 ⟹ 兩個反曲點。x=0 同時是臨界點與反曲點。"
      ],
      solution: "f′=12x²(x−1)：x=0 重根不變號（非極值），唯一極小 x=1（f=−1）；f″=12x(3x−2) 給反曲點 0 與 2/3。"
    }),

    add({
      id: "cw-017",
      rank: 5,
      prompt: "\\text{完成 }f(x)=\\frac{\\ln x}{x}\\text{ 的作圖表}",
      fields: fields("\\frac{\\log x}{x}", [-5, 60], {
        increasing: "(0, e)",
        decreasing: "(e, inf)",
        localMax: "{e}",
        localMin: "{}",
        concaveUp: "(exp(3/2), inf)",
        concaveDown: "(0, exp(3/2))",
        inflection: "{exp(3/2)}"
      }),
      answer: "increasing=(0, e); decreasing=(e, inf); localMax={e}; localMin={}; concaveUp=(exp(3/2), inf); concaveDown=(0, exp(3/2)); inflection={exp(3/2)}",
      sketch: { expr: "log(x)/x", window: [-0.5, 12, -1.2, 0.6] },
      tags: ["first-derivative", "concavity", "inflection", "log", "quotient-rule", "domain-aware"],
      hints: [
        "定義域先寫下來：x>0。",
        "商律：f′=(1−ln x)/x²，分母恆正。",
        "f″=(2 ln x−3)/x³，零點在 ln x=3/2。"
      ],
      solutionSteps: [
        "定義域是 x>0 —— 所有區間都要落在這裡面，不能寫 −∞。",
        "f′(x)=(1−ln x)/x²：分母恆正 ⟹ f′>0 ⟺ ln x<1 ⟺ x<e。極大在 x=e（f=1/e）。",
        "f″(x)=(2 ln x−3)/x³：分母在定義域內恆正 ⟹ f″>0 ⟺ ln x>3/2 ⟺ x>e^{3/2}≈4.48。",
        "x→0⁺ 時 f→−∞（垂直漸近線 x=0）；x→+∞ 時 f→0⁺。峰在 x=e 之後緩慢下降。"
      ],
      solution: "定義域 x>0。f′=(1−ln x)/x² 給唯一極大 x=e（f=1/e）；f″=(2ln x−3)/x³ 給反曲點 x=e^{3/2}；兩端分別趨向 −∞ 與 0⁺。"
    })
  ];

  window.BUZZ_CURVE_WORKSHEET_PROBLEMS = problems;
  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
