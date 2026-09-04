// 選圖題：把 f′、f″、定義域與極值合起來變成一個形狀
//
// 題庫原本沒有這種題型。它練的東西別的題型練不到：
// 臨界點、反曲點、遞增區間、漸近線都各自有題目在練，
// 但「這些性質**合起來**長什麼樣」是另一種能力 ——
// 而那正是課本上「作圖」那一節真正在教的事。
//
// 為什麼是選圖而不是真的畫：畫出來的圖沒辦法自動判分。
// 選圖保留了同一個判斷過程（逐項核對性質、排除對不上的），
// 而且是真實考試最常見的形式。
//
// 每一個誘答都是一個**具名的畫圖錯誤**，不是隨便找一條曲線：
//   符號整體反了、極值位置錯、凹向反了、少了漸近線、
//   把可去的洞畫成連續、定義域邊界畫錯…
// 答錯的時候直接告訴使用者他犯的是哪一個。
// 這也是題庫裡第一批有作者撰寫誘答的題目（在此之前是 0 題）。
//
// 誘答的品質由 tools/validate_graph_choices.js 把關：
// 每個誘答都必須在窗內與正解有**看得出來的差距**，
// 否則那是一道不公平的題，不是一道難題。

(function () {
  "use strict";

  const SOURCE = "Buzz 圖形判讀包 2026";

  function add(problem) {
    const tags = (problem.tags || []).slice();
    tags.push(`rank-${problem.rank}`);
    tags.push("graph-reading");
    if (problem.rank >= 5) tags.push("boss-rank");
    if (problem.rank <= 2) tags.push("beginner-friendly");
    return {
      source: SOURCE,
      difficulty: Math.min(4, problem.rank),
      answerKind: "graph",
      topic: "derivatives",
      ...problem,
      tags
    };
  }

  const problems = [
    add({
      id: "gr-001",
      rank: 2,
      prompt: "\\text{哪一張圖是 }f(x)=x^3-3x\\text{ ?}",
      graphWindow: [-3, 3, -5, 5],
      answer: "x**3-3*x",
      graphChoices: [
        { expr: "x**3-3*x", correct: true },
        { expr: "-(x**3-3*x)", why: "整體符號反了。代 f(2)=2>0，圖形在 x=2 應該在軸上方。" },
        { expr: "x**3+3*x", why: "這條沒有極值：f′=3x²+3 恆正，整條單調遞增。原式的 f′=3x²−3 有兩個零點。" },
        { expr: "x**3-3*x**2", why: "極值位置錯。f′=3x²−3 的零點是 ±1，不是 0 和 2。" }
      ],
      timeLimit: 45,
      tags: ["curve-sketching", "critical-points"],
      hints: [
        "先算 f′ 找極值的位置。",
        "f′=3x²−3，零點在 x=±1。",
        "再看 f(0)=0 與 f(2)=2 的正負，就能排除符號反的那張。"
      ],
      solutionSteps: [
        "f′(x)=3x²−3，零點在 x=±1 —— 極值必須落在這兩個位置。",
        "f″(x)=6x，在 x=0 變號，所以 x=0 是反曲點。",
        "f(−1)=2 是極大、f(1)=−2 是極小（f″(−1)<0、f″(1)>0）。",
        "先左上後右下地起伏、極值在 ±1、原點過零 —— 只有一張符合。"
      ],
      solution: "f′=3(x−1)(x+1) 給出極值在 x=±1；f(−1)=2 為極大、f(1)=−2 為極小；f″=6x 使 x=0 成為反曲點。"
    }),

    add({
      id: "gr-002",
      rank: 3,
      prompt: "\\text{哪一張圖是 }f(x)=\\frac{1}{x-1}\\text{ ?}",
      graphWindow: [-3, 5, -5, 5],
      graphDomain: [-3, 5],
      answer: "1/(x-1)",
      graphChoices: [
        { expr: "1/(x-1)", correct: true },
        { expr: "1/(x+1)", why: "漸近線位置錯。分母 x−1 為零在 x=1，不是 x=−1。" },
        { expr: "-1/(x-1)", why: "兩支的上下反了。x 稍大於 1 時 f 是大的正數，圖形要往上衝。" },
        { expr: "1/((x-1)*(x-1))", why: "這是 1/(x−1)²，兩支都在軸上方。原式在 x<1 時為負。" }
      ],
      timeLimit: 50,
      tags: ["curve-sketching", "asymptote", "rational-function"],
      hints: [
        "先找垂直漸近線：分母為零的地方。",
        "x=1 是漸近線，圖形被切成兩支。",
        "看 x=1 兩側的正負：左邊為負、右邊為正。"
      ],
      solutionSteps: [
        "分母 x−1=0 給出垂直漸近線 x=1，圖形分成兩支。",
        "x→1⁻ 時 f→−∞；x→1⁺ 時 f→+∞。",
        "f′=−1/(x−1)²<0 恆成立，所以兩支各自都是遞減。",
        "水平漸近線 y=0（x→±∞ 時 f→0）。"
      ],
      solution: "垂直漸近線 x=1、水平漸近線 y=0，且 f′<0 恆成立，兩支各自遞減。"
    }),

    add({
      id: "gr-003",
      rank: 3,
      prompt: "\\text{哪一張圖是 }f(x)=xe^{-x}\\text{ ?}",
      graphWindow: [-1, 5, -1, 1],
      answer: "x*exp(-x)",
      graphChoices: [
        { expr: "x*exp(-x)", correct: true },
        { expr: "x*exp(x)", why: "x→+∞ 的行為反了。原式的 e^{−x} 會把 f 壓回 0，這條會爆掉。" },
        { expr: "-x*exp(-x)", why: "符號反了。f(1)=1/e>0，圖形在 x=1 應該在軸上方。" },
        { expr: "x*x*exp(-x)", why: "這是 x²e^{−x}：極大值在 x=2 而且 x<0 時為正。原式極大在 x=1、x<0 時為負。" }
      ],
      timeLimit: 55,
      tags: ["curve-sketching", "exponential", "extrema"],
      hints: [
        "f′=e^{−x}(1−x)，極值在 x=1。",
        "x→+∞ 時 f→0（指數壓過多項式）。",
        "x<0 時 f<0。"
      ],
      solutionSteps: [
        "f′(x)=e^{−x}(1−x)，唯一臨界點 x=1。",
        "f″(x)=e^{−x}(x−2)，在 x=1 為負 ⟹ x=1 是極大值，f(1)=1/e≈0.37。",
        "x→+∞ 時 f→0⁺；x→−∞ 時 f→−∞。",
        "x=2 是反曲點。只有一張圖同時符合「極大在 1」與「右端趨近 0」。"
      ],
      solution: "極大值在 x=1（f(1)=1/e），反曲點 x=2，x→+∞ 時 f→0⁺，x<0 時 f<0。"
    }),

    add({
      id: "gr-004",
      rank: 3,
      prompt: "\\text{哪一張圖是 }f(x)=\\ln x\\text{ ?}",
      graphWindow: [-2, 6, -3, 3],
      graphDomain: [-2, 6],
      answer: "log(x)",
      graphChoices: [
        { expr: "log(x)", correct: true },
        { expr: "log(abs(x))", why: "定義域錯。ln x 只在 x>0 有定義，左半邊不該有圖。" },
        { expr: "exp(x)", why: "這是 e^x —— 它是 ln x 的反函數，圖形是沿 y=x 的鏡像。" },
        { expr: "-log(x)", why: "符號反了。ln 2>0，圖形在 x=2 應該在軸上方。" }
      ],
      timeLimit: 40,
      tags: ["curve-sketching", "log", "domain"],
      hints: ["先看定義域。", "ln x 只在 x>0 有定義。", "而且 ln 1=0，圖形一定過 (1,0)。"],
      solutionSteps: [
        "定義域是 x>0 —— 左半平面完全沒有圖。",
        "x→0⁺ 時 f→−∞，所以 y 軸是垂直漸近線。",
        "f′=1/x>0，整條遞增；f″=−1/x²<0，整條凹向下。",
        "而且必須過 (1,0)。四張裡只有一張同時滿足定義域與這個點。"
      ],
      solution: "定義域 x>0、過 (1,0)、遞增且凹向下、x→0⁺ 時趨向 −∞。"
    }),

    add({
      id: "gr-005",
      rank: 4,
      prompt: "\\text{哪一張圖是 }f(x)=\\frac{x^2}{x^2+1}\\text{ ?}",
      graphWindow: [-4, 4, -0.5, 1.5],
      answer: "x*x/(x*x+1)",
      graphChoices: [
        { expr: "x*x/(x*x+1)", correct: true },
        { expr: "x*x/(x*x-1)", why: "這條有兩條垂直漸近線（x=±1）。原式的分母 x²+1 永遠不為零，沒有漸近線。" },
        { expr: "1/(x*x+1)", why: "這條在 x=0 取極大值 1。原式在 x=0 取極小值 0。" },
        { expr: "x/(x*x+1)", why: "這條是奇函數（左負右正）。原式是偶函數，恆非負。" }
      ],
      timeLimit: 65,
      tags: ["curve-sketching", "rational-function", "asymptote", "even-function"],
      hints: [
        "分母 x²+1 永遠不為零 —— 沒有垂直漸近線。",
        "f 是偶函數，而且 f≥0。",
        "x→±∞ 時 f→1，那是水平漸近線。"
      ],
      solutionSteps: [
        "分母 x²+1>0 恆成立：定義域是全實數，沒有垂直漸近線。",
        "f(−x)=f(x)，是偶函數；而且 f=x²/(x²+1)≥0。",
        "f(0)=0 是極小值（唯一的臨界點）。",
        "x→±∞ 時 f→1，水平漸近線 y=1，圖形從下方趨近它。"
      ],
      solution: "偶函數、恆非負、x=0 為極小值 0、水平漸近線 y=1 且從下方趨近、無垂直漸近線。"
    }),

    add({
      id: "gr-006",
      rank: 4,
      prompt: "\\text{哪一張圖是 }f(x)=x^4-2x^2\\text{ ?}",
      graphWindow: [-2.2, 2.2, -2, 3],
      answer: "x**4-2*x**2",
      graphChoices: [
        { expr: "x**4-2*x**2", correct: true },
        { expr: "x**4+2*x**2", why: "這條只有一個極小值（在 x=0）。原式的 f′=4x³−4x 有三個零點，是 W 形。" },
        { expr: "-(x**4-2*x**2)", why: "上下反了。x→±∞ 時原式趨向 +∞（最高次項係數為正）。" },
        { expr: "x**3-2*x", why: "這是三次式：x→−∞ 時趨向 −∞。原式是偶次，兩端都往上。" }
      ],
      timeLimit: 60,
      tags: ["curve-sketching", "extrema", "even-function"],
      hints: [
        "f′=4x³−4x=4x(x−1)(x+1)，三個臨界點。",
        "x=0 是極大、x=±1 是極小 —— W 形。",
        "偶函數，而且兩端都往 +∞。"
      ],
      solutionSteps: [
        "f′(x)=4x³−4x=4x(x−1)(x+1)，臨界點 x=−1, 0, 1。",
        "f″(x)=12x²−4：在 x=0 為負（極大），在 x=±1 為正（極小）。",
        "f(0)=0 是局部極大，f(±1)=−1 是極小 —— 所以是 W 形。",
        "偶函數，且最高次項係數為正，兩端都往 +∞。"
      ],
      solution: "三個臨界點 −1, 0, 1；x=0 局部極大 0、x=±1 極小 −1；偶函數，兩端趨向 +∞。"
    }),

    // ---- 2026-09 擴充：題庫審計發現選圖題只有 6 題，題型幾乎等於不存在 ----

    add({
      id: "gr-007",
      rank: 2,
      prompt: "\\text{哪一張圖是 }f(x)=e^{-x}\\text{ ?}",
      graphWindow: [-2, 4, -1, 6],
      answer: "exp(-x)",
      graphChoices: [
        { expr: "exp(-x)", correct: true },
        { expr: "exp(x)", why: "增減方向反了。e^{-x} 的指數是負的：x 越大函數越小。" },
        { expr: "-exp(-x)", why: "整體符號反了。指數函數恆正，圖形必須整條在 x 軸上方。" },
        { expr: "exp(-2*x)", why: "衰減速率錯。f(−1)=e≈2.7，這條在 x=−1 已經衝到 e²≈7.4。" }
      ],
      timeLimit: 40,
      tags: ["curve-sketching", "exponential"],
      hints: [
        "先看單調性：指數是 −x，遞增還是遞減？",
        "指數函數的值恆正。",
        "代 x=−1 看高度，可以分出衰減速率。"
      ],
      solutionSteps: [
        "指數是 −x：x 變大函數變小 —— 整條遞減。",
        "e^{-x}>0 恆成立，圖形在軸上方，且 x→∞ 時貼近 y=0。",
        "f(0)=1、f(−1)=e≈2.72 —— 用這兩點可以排除衰減速率錯的那張。"
      ],
      solution: "遞減、恆正、過 (0,1)、右端貼近 y=0；用 f(−1)=e 的高度排除 e^{-2x}。"
    }),

    add({
      id: "gr-008",
      rank: 3,
      prompt: "\\text{哪一張圖是 }f(x)=\\frac{x}{x-2}\\text{ ?}",
      graphWindow: [-4, 8, -6, 6],
      answer: "x/(x-2)",
      graphChoices: [
        { expr: "x/(x-2)", correct: true },
        { expr: "x/(x+2)", why: "垂直漸近線的位置錯了：分母在 x=2 才是 0，不是 x=−2。" },
        { expr: "2/(x-2)", why: "水平漸近線錯了。原式 x→∞ 時趨向 1（分子分母同次），這條趨向 0。" },
        { expr: "-x/(x-2)", why: "整體符號反了。f(3)=3>0，圖形在 x=3 應該在軸上方。" }
      ],
      timeLimit: 55,
      tags: ["curve-sketching", "asymptote"],
      hints: [
        "分母何時為 0？那裡就是垂直漸近線。",
        "分子分母同次：水平漸近線是首項係數比。",
        "代 x=3 看正負。"
      ],
      solutionSteps: [
        "分母 x−2=0 給垂直漸近線 x=2。",
        "x→±∞ 時 f→1（同次多項式的首項係數比），水平漸近線 y=1。",
        "f(0)=0 過原點；f(3)=3 在右支的上方。",
        "兩支雙曲線：左支在 y=1 下方、右支在上方。"
      ],
      solution: "垂直漸近線 x=2、水平漸近線 y=1、過原點；用 f(3)=3 的正負排除符號反的。"
    }),

    add({
      id: "gr-009",
      rank: 3,
      prompt: "\\text{哪一張圖是 }f(x)=\\sin(2x)\\text{ ?}",
      graphWindow: [-6.5, 6.5, -2.5, 2.5],
      answer: "sin(2*x)",
      graphChoices: [
        { expr: "sin(2*x)", correct: true },
        { expr: "sin(x)", why: "週期錯了。sin(2x) 的週期是 π，這條的週期是 2π —— 在同一個窗裡波峰數量差一倍。" },
        { expr: "2*sin(x)", why: "把係數放到振幅上了。原式振幅還是 1，但週期減半。" },
        { expr: "cos(2*x)", why: "相位錯了。原式過原點且在原點往上爬，cos(2x) 在 x=0 是最高點。" }
      ],
      timeLimit: 50,
      tags: ["curve-sketching", "trig"],
      hints: [
        "內層的 2 影響的是週期還是振幅？",
        "週期是 2π/2=π。",
        "看 x=0：函數值是 0 還是 1？"
      ],
      solutionSteps: [
        "sin(2x) 的週期是 2π/2=π —— 窗內波峰比 sin x 多一倍。",
        "振幅仍是 1（係數在括號裡面，不在外面）。",
        "f(0)=0 且 f′(0)=2>0：過原點往上爬 —— 排除 cos(2x)。"
      ],
      solution: "週期 π、振幅 1、過原點往上爬。內層係數改週期、外層係數才改振幅。"
    }),

    add({
      id: "gr-010",
      rank: 4,
      prompt: "\\text{哪一張圖是 }f(x)=x+\\frac{1}{x}\\text{ ?}",
      graphWindow: [-5, 5, -6, 6],
      answer: "x+1/x",
      graphChoices: [
        { expr: "x+1/x", correct: true },
        { expr: "x-1/x", why: "這條沒有極值：f′=1+1/x²>0 兩支都遞增。原式在 x=±1 有極值。" },
        { expr: "1/x", why: "少了斜漸近線。原式在 |x| 大的時候貼近直線 y=x，不是貼近 x 軸。" },
        { expr: "-(x+1/x)", why: "整體符號反了。f(1)=2>0，右支的谷底應該在軸上方。" }
      ],
      timeLimit: 70,
      tags: ["curve-sketching", "asymptote", "extrema"],
      hints: [
        "f′=1−1/x²，零點在哪？",
        "x 很大時 1/x 消失，貼近哪條直線？",
        "右支的谷底 f(1)=2。"
      ],
      solutionSteps: [
        "f′(x)=1−1/x²，零點 x=±1：右支谷底 (1,2)、左支峰頂 (−1,−2)。",
        "|x|→∞ 時 f≈x：斜漸近線 y=x。",
        "x→0⁺ 時 f→+∞、x→0⁻ 時 f→−∞：垂直漸近線 x=0。",
        "兩支各自凸向漸近線 —— 排除單調遞增的 x−1/x。"
      ],
      solution: "垂直漸近線 x=0、斜漸近線 y=x、極值 (±1,±2)。f′=1−1/x² 是分辨的關鍵。"
    }),

    add({
      id: "gr-011",
      rank: 4,
      prompt: "\\text{哪一張圖是 }f(x)=xe^{x}\\text{ ?}",
      graphWindow: [-5, 2, -1.5, 6],
      answer: "x*exp(x)",
      graphChoices: [
        { expr: "x*exp(x)", correct: true },
        { expr: "x*exp(-x)", why: "衰減方向反了。原式在 x→−∞ 時貼近 y=0、在右邊爆炸；這條剛好相反。" },
        { expr: "exp(x)", why: "少了負的部分。原式過原點，且在 x<0 整段是負的；e^x 恆正。" },
        { expr: "-x*exp(x)", why: "整體符號反了。f(1)=e>0，x=1 的值應該在軸上方。" }
      ],
      timeLimit: 70,
      tags: ["curve-sketching", "exponential", "extrema"],
      hints: [
        "f′=(1+x)e^x，零點在哪？",
        "x→−∞ 時指數壓過多項式，貼近 y=0。",
        "f(0)=0、f(1)=e。"
      ],
      solutionSteps: [
        "f′(x)=(1+x)e^x，唯一零點 x=−1：極小值 f(−1)=−1/e。",
        "x→−∞ 時 e^x 衰減壓過 x：從下方貼近 y=0。",
        "過原點、x<0 時為負、右邊快速上升 —— 排除恆正的 e^x。"
      ],
      solution: "極小 (−1,−1/e)、左端從下方貼近 y=0、過原點、右端指數上升。"
    }),

    add({
      id: "gr-012",
      rank: 4,
      prompt: "\\text{哪一張圖是 }f(x)=\\frac{4x}{x^2+4}\\text{ ?}",
      graphWindow: [-8, 8, -2.5, 2.5],
      answer: "4*x/(x*x+4)",
      graphChoices: [
        { expr: "4*x/(x*x+4)", correct: true },
        { expr: "4*x/(x*x+1)", why: "極值的位置與高度錯了。原式的峰在 x=2（高度 1），這條的峰在 x=1（高度 2）。" },
        { expr: "-4*x/(x*x+4)", why: "整體符號反了。奇函數沒錯，但 f(2)=1>0，右邊的峰應該在上方。" },
        { expr: "4*x*x/(x*x+4)", why: "奇偶性錯了。原式是奇函數（過原點、左右反對稱），這條是偶函數且恆非負。" }
      ],
      timeLimit: 75,
      tags: ["curve-sketching", "extrema", "asymptote"],
      hints: [
        "先判斷奇偶性。",
        "f′ 的零點：x²=4。",
        "x→±∞ 時分母壓過分子，貼近 y=0。"
      ],
      solutionSteps: [
        "f(−x)=−f(x)：奇函數，圖形對原點對稱。",
        "f′(x)=4(4−x²)/(x²+4)²，零點 x=±2：峰 (2,1)、谷 (−2,−1)。",
        "x→±∞ 時 f→0：水平漸近線 y=0。",
        "峰的位置（x=2 不是 x=1）是排除另一條奇函數的關鍵。"
      ],
      solution: "奇函數、峰谷在 (±2,±1)、兩端貼近 y=0。峰的位置與高度用 f′ 算出來。"
    })
  ];

  window.BUZZ_GRAPH_CHOICE_PROBLEMS = problems;
  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
