// 集合與區間題型（擴充包）
//
// 為什麼擴充這兩種型別，而不是再加一百題數值題：
// 題庫的答案型別嚴重偏斜 —— numeric 佔 72%，而 set / interval 各只有 5 題。
// 偏斜不只是統計上難看，它代表**有整類能力沒有被練到**：
//
//   set      考「找齊了沒有」。少寫一個根就是沒解完，而不是算錯。
//   interval 考「端點到底屬不屬於」。開閉是這類題目的全部重點。
//
// 這兩件事用 numeric 題型永遠考不出來。
//
// 每一題都帶 verify 描述子，由 tools/lib/set_interval_verify.js 獨立驗算：
// 描述子提供的是**那個函數本身**，導數由 Ridders 數值微分算出來、
// 根由變號加二分法找出來 —— 驗算路徑不共用答案裡的任何推理。
// （有理函數那幾題例外，理由寫在驗算器的檔頭。）

(function () {
  "use strict";

  const SOURCE = "Buzz 集合與區間包 2026";

  function add(problem) {
    const tags = (problem.tags || []).slice();
    tags.push(`rank-${problem.rank}`);
    if (problem.rank >= 5) tags.push("boss-rank");
    if (problem.rank <= 2) tags.push("beginner-friendly");
    return {
      source: SOURCE,
      difficulty: Math.min(4, problem.rank),
      ...problem,
      tags
    };
  }

  const problems = [
    /* ── 臨界點：找齊了沒有 ────────────────────────────────── */
    add({
      id: "si-set-011",
      topic: "derivatives",
      rank: 2,
      prompt: "\\text{求 }f(x)=x^3-12x\\text{ 的所有臨界點}",
      answerKind: "set",
      answer: "{-2, 2}",
      verify: { m: "critical", f: "x^3-12x", range: [-8, 8] },
      timeLimit: 40,
      tags: ["critical-points", "derivative-zero"],
      hints: ["臨界點是 f'(x)=0 的地方。", "f'(x)=3x²−12。", "3x²=12 有兩個根。"],
      solutionSteps: [
        "f'(x)=3x²−12。",
        "令 3x²−12=0，得 x²=4。",
        "x=2 與 x=−2 都是解。",
        "兩個都要寫 —— 只寫正根等於沒解完。"
      ],
      solution: "f'(x)=3x²−12=3(x−2)(x+2)，零點是 x=±2。"
    }),
    add({
      id: "si-set-012",
      topic: "derivatives",
      rank: 3,
      prompt: "\\text{求 }f(x)=xe^{-x}\\text{ 的所有臨界點}",
      answerKind: "set",
      answer: "{1}",
      verify: { m: "critical", f: "xe^{-x}", range: [-6, 12] },
      timeLimit: 50,
      tags: ["critical-points", "product-rule", "exponential"],
      hints: ["先用乘積律。", "f'(x)=e^{−x}(1−x)。", "e^{−x} 永遠不為零。"],
      solutionSteps: [
        "乘積律：f'(x)=e^{−x}+x·(−e^{−x})。",
        "整理成 f'(x)=e^{−x}(1−x)。",
        "e^{−x}>0 對所有 x 成立，所以只能是 1−x=0。",
        "臨界點只有 x=1，集合是 {1}。"
      ],
      solution: "f'(x)=e^{−x}(1−x)。指數項不會是零，所以唯一的臨界點是 x=1。"
    }),
    add({
      id: "si-set-013",
      topic: "derivatives",
      rank: 3,
      prompt: "\\text{求 }f(x)=x^4-4x^3\\text{ 的所有臨界點}",
      answerKind: "set",
      answer: "{0, 3}",
      verify: { m: "critical", f: "x^4-4x^3", range: [-6, 8] },
      timeLimit: 50,
      tags: ["critical-points", "derivative-zero", "repeated-root"],
      hints: ["f'(x)=4x³−12x²。", "提出公因式 4x²。", "x=0 是重根，但仍然是臨界點。"],
      solutionSteps: [
        "f'(x)=4x³−12x²。",
        "提公因式：f'(x)=4x²(x−3)。",
        "零點是 x=0（重根）與 x=3。",
        "重根照樣算一個臨界點，不能因為「不變號」就漏掉。"
      ],
      solution: "f'(x)=4x²(x−3)，零點 x=0 與 x=3。x=0 是重根，f' 在那裡不變號，但它仍然是臨界點。"
    }),
    add({
      id: "si-set-014",
      topic: "derivatives",
      rank: 3,
      prompt: "\\text{求 }f(x)=\\frac{x}{x^2+1}\\text{ 的所有臨界點}",
      answerKind: "set",
      answer: "{-1, 1}",
      verify: { m: "critical", f: "\\frac{x}{x^2+1}", range: [-8, 8] },
      timeLimit: 55,
      tags: ["critical-points", "quotient-rule"],
      hints: ["用商律。", "分子會化簡成 1−x²。", "分母永遠為正，只看分子。"],
      solutionSteps: [
        "商律：f'(x)=[(x²+1)−x·2x]/(x²+1)²。",
        "分子化簡成 1−x²。",
        "分母 (x²+1)²>0 恆成立，所以只需 1−x²=0。",
        "x=1 與 x=−1，集合是 {−1, 1}。"
      ],
      solution: "f'(x)=(1−x²)/(x²+1)²。分母恆正，零點由 1−x²=0 決定，得 x=±1。"
    }),
    add({
      id: "si-set-015",
      topic: "derivatives",
      rank: 2,
      prompt: "\\text{求 }f(x)=\\ln x-x\\text{ 的所有臨界點}",
      answerKind: "set",
      answer: "{1}",
      verify: { m: "critical", f: "\\log x-x", range: [0.05, 12] },
      timeLimit: 40,
      tags: ["critical-points", "log", "domain-aware"],
      hints: ["f'(x)=1/x−1。", "定義域只有 x>0。", "1/x=1 只有一個解。"],
      solutionSteps: [
        "定義域是 x>0（ln x 的關係）。",
        "f'(x)=1/x−1。",
        "令 1/x=1，得 x=1。",
        "x=1 落在定義域內，所以臨界點是 {1}。"
      ],
      solution: "f'(x)=1/x−1，在定義域 x>0 上唯一的零點是 x=1。"
    }),
    add({
      id: "si-set-016",
      topic: "derivatives",
      rank: 3,
      prompt: "\\text{求 }f(x)=2\\sin x+x\\text{ 在 }(0,2\\pi)\\text{ 內的所有臨界點}",
      answerKind: "set",
      answer: "{2*pi/3, 4*pi/3}",
      verify: { m: "critical", f: "2\\sin x+x", range: [0.001, 6.282] },
      timeLimit: 60,
      tags: ["critical-points", "trig", "derivative-zero"],
      hints: ["f'(x)=2cos x+1。", "解 cos x=−1/2。", "在 (0,2π) 內有兩個解。"],
      solutionSteps: [
        "f'(x)=2cos x+1。",
        "令 2cos x+1=0，即 cos x=−1/2。",
        "在 (0,2π) 內，cos x=−1/2 的解是 x=2π/3 與 x=4π/3。",
        "兩個都要寫；只寫第一象限外的那一個是常見漏解。"
      ],
      solution: "f'(x)=2cos x+1=0 ⟹ cos x=−1/2，在 (0,2π) 內得 x=2π/3, 4π/3。"
    }),

    /* ── 反曲點 ────────────────────────────────────────────── */
    add({
      id: "si-set-017",
      topic: "derivatives",
      rank: 3,
      prompt: "\\text{求 }f(x)=x^4-6x^2\\text{ 的所有反曲點的 }x\\text{ 座標}",
      answerKind: "set",
      answer: "{-1, 1}",
      verify: { m: "inflection", f: "x^4-6x^2", range: [-6, 6] },
      timeLimit: 50,
      tags: ["inflection", "second-derivative"],
      hints: ["反曲點看 f''。", "f''(x)=12x²−12。", "兩個根都要。"],
      solutionSteps: [
        "f'(x)=4x³−12x。",
        "f''(x)=12x²−12。",
        "令 12x²−12=0，得 x²=1。",
        "x=±1，而且 f'' 在兩點都變號，所以兩個都是反曲點。"
      ],
      solution: "f''(x)=12x²−12=12(x−1)(x+1)，零點 x=±1，且兩點都變號。"
    }),
    add({
      id: "si-set-018",
      topic: "derivatives",
      rank: 3,
      prompt: "\\text{求 }f(x)=xe^{-x}\\text{ 的所有反曲點的 }x\\text{ 座標}",
      answerKind: "set",
      answer: "{2}",
      verify: { m: "inflection", f: "xe^{-x}", range: [-6, 14] },
      timeLimit: 55,
      tags: ["inflection", "second-derivative", "exponential"],
      hints: ["先算 f'(x)=e^{−x}(1−x)。", "再微分一次。", "f''(x)=e^{−x}(x−2)。"],
      solutionSteps: [
        "f'(x)=e^{−x}(1−x)。",
        "再用乘積律：f''(x)=−e^{−x}(1−x)+e^{−x}(−1)=e^{−x}(x−2)。",
        "e^{−x}>0，所以 f''=0 只在 x=2。",
        "f'' 在 x=2 變號，確實是反曲點。"
      ],
      solution: "f''(x)=e^{−x}(x−2)，唯一零點 x=2 且變號。"
    }),
    add({
      id: "si-set-019",
      topic: "derivatives",
      rank: 2,
      prompt: "\\text{求 }f(x)=x^3-6x^2+9x\\text{ 的所有反曲點的 }x\\text{ 座標}",
      answerKind: "set",
      answer: "{2}",
      verify: { m: "inflection", f: "x^3-6x^2+9x", range: [-6, 8] },
      timeLimit: 40,
      tags: ["inflection", "second-derivative"],
      hints: ["f''(x)=6x−12。", "一次式只有一個根。", "三次多項式的反曲點只會有一個。"],
      solutionSteps: [
        "f'(x)=3x²−12x+9。",
        "f''(x)=6x−12。",
        "令 6x−12=0，得 x=2。",
        "三次多項式的 f'' 是一次式，所以反曲點恰好一個。"
      ],
      solution: "f''(x)=6x−12，零點 x=2。"
    }),

    /* ── 不連續點（有理函數：分母的根）─────────────────────── */
    add({
      id: "si-set-020",
      topic: "limits",
      rank: 2,
      prompt: "\\text{求 }f(x)=\\frac{x^2-9}{x^2-4}\\text{ 的所有不連續點}",
      answerKind: "set",
      answer: "{-2, 2}",
      verify: { m: "zeros", f: "x^2-4", range: [-8, 8] },
      timeLimit: 40,
      tags: ["continuity", "rational-function"],
      hints: ["有理函數在分母為零處不連續。", "解 x²−4=0。", "兩個根都要寫。"],
      solutionSteps: [
        "有理函數只在分母為零的地方不連續。",
        "令 x²−4=0。",
        "得 x=2 與 x=−2。",
        "分子在這兩點都不為零，所以兩個都是無窮不連續。"
      ],
      solution: "分母 x²−4 的零點是 x=±2，分子在該處不為零，兩點都是不連續點。"
    }),
    add({
      id: "si-set-021",
      topic: "limits",
      rank: 2,
      prompt: "\\text{求 }f(x)=\\frac{x}{x^2-x-6}\\text{ 的所有不連續點}",
      answerKind: "set",
      answer: "{-2, 3}",
      verify: { m: "zeros", f: "x^2-x-6", range: [-8, 8] },
      timeLimit: 45,
      tags: ["continuity", "rational-function", "factoring"],
      hints: ["先因式分解分母。", "x²−x−6=(x−3)(x+2)。", "兩個根都要寫。"],
      solutionSteps: [
        "分母因式分解：x²−x−6=(x−3)(x+2)。",
        "零點是 x=3 與 x=−2。",
        "分子 x 在這兩點都不為零。",
        "所以不連續點是 {−2, 3}。"
      ],
      solution: "分母 (x−3)(x+2) 的零點是 x=3, −2，分子在該處非零。"
    }),
    add({
      id: "si-set-022",
      topic: "limits",
      rank: 3,
      prompt: "\\text{求 }f(x)=\\tan x\\text{ 在 }(-\\pi,\\pi)\\text{ 內的所有不連續點}",
      answerKind: "set",
      answer: "{-pi/2, pi/2}",
      verify: { m: "zeros", f: "\\cos x", range: [-3.14, 3.14] },
      timeLimit: 50,
      tags: ["continuity", "trig"],
      hints: ["tan x = sin x / cos x。", "分母為零的地方不連續。", "在 (−π,π) 內 cos x=0 有兩個解。"],
      solutionSteps: [
        "tan x=sin x/cos x，在 cos x=0 處沒有定義。",
        "在 (−π,π) 內解 cos x=0。",
        "得 x=π/2 與 x=−π/2。",
        "兩個都要寫 —— 只寫 π/2 是漏了負的那一半。"
      ],
      solution: "tan x 在 cos x=0 處不連續；區間 (−π,π) 內為 x=±π/2。"
    }),

    /* ── 定義域 ────────────────────────────────────────────── */
    add({
      id: "si-int-011",
      topic: "limits",
      rank: 3,
      prompt: "\\text{求 }f(x)=\\ln(4-x^2)\\text{ 的定義域}",
      answerKind: "interval",
      answer: "(-2, 2)",
      verify: { m: "domain", f: "\\log(4-x^2)", range: [-10, 10] },
      timeLimit: 45,
      tags: ["domain", "log"],
      hints: ["對數的引數要嚴格大於零。", "解 4−x²>0。", "端點不能取。"],
      solutionSteps: [
        "ln 的引數必須嚴格大於零：4−x²>0。",
        "整理成 x²<4。",
        "得 −2<x<2。",
        "端點取不到（在那裡引數是 0，ln 沒有定義），所以是開區間。"
      ],
      solution: "需要 4−x²>0，即 |x|<2。端點處引數為 0，ln 無定義，故為開區間 (−2,2)。"
    }),
    add({
      id: "si-int-012",
      topic: "limits",
      rank: 3,
      prompt: "\\text{求 }f(x)=\\sqrt{x^2-1}\\text{ 的定義域}",
      answerKind: "interval",
      answer: "(-inf, -1] U [1, inf)",
      verify: { m: "domain", f: "\\sqrt{x^2-1}", range: [-30, 30] },
      timeLimit: 50,
      tags: ["domain", "radical"],
      hints: ["根號內要大於等於零。", "解 x²−1≥0。", "端點這次取得到。"],
      solutionSteps: [
        "根號內必須 ≥0：x²−1≥0。",
        "整理成 |x|≥1。",
        "得 x≤−1 或 x≥1，是兩段。",
        "端點 ±1 處根號內為 0，仍有定義，所以用中括號。"
      ],
      solution: "需要 x²≥1，即 x≤−1 或 x≥1。端點處根號內為 0 有定義，故端點封閉。"
    }),
    add({
      id: "si-int-013",
      topic: "limits",
      rank: 3,
      prompt: "\\text{求 }f(x)=\\frac{1}{\\sqrt{x-2}}\\text{ 的定義域}",
      answerKind: "interval",
      answer: "(2, inf)",
      verify: { m: "domain", f: "\\frac{1}{\\sqrt{x-2}}", range: [-10, 40] },
      timeLimit: 45,
      tags: ["domain", "radical", "rational-function"],
      hints: ["根號內要 ≥0，但它同時在分母。", "所以要嚴格大於零。", "端點取不到。"],
      solutionSteps: [
        "根號內要 x−2≥0。",
        "但 √(x−2) 在分母，不能是 0。",
        "兩個條件合起來是 x−2>0。",
        "得 (2, ∞)，端點開 —— 這一題的重點就是「≥ 變成 >」。"
      ],
      solution: "根號要求 x≥2，分母要求 √(x−2)≠0，合起來 x>2。"
    }),
    add({
      id: "si-int-014",
      topic: "limits",
      rank: 4,
      prompt: "\\text{求 }f(x)=\\ln(\\ln x)\\text{ 的定義域}",
      answerKind: "interval",
      answer: "(1, inf)",
      verify: { m: "domain", f: "\\log(\\log x)", range: [-5, 60] },
      timeLimit: 60,
      tags: ["domain", "log", "composition"],
      hints: ["兩層對數，兩個條件。", "外層要求 ln x>0。", "ln x>0 等於 x>1。"],
      solutionSteps: [
        "內層要求 x>0。",
        "外層要求 ln x>0。",
        "ln x>0 等價於 x>1，這個條件比 x>0 更嚴格。",
        "所以定義域是 (1, ∞)。"
      ],
      solution: "需 ln x>0 ⟹ x>1，該條件已涵蓋 x>0。"
    }),
    add({
      id: "si-int-015",
      topic: "limits",
      rank: 3,
      prompt: "\\text{求 }f(x)=\\frac{1}{x^2-4}\\text{ 的定義域}",
      answerKind: "interval",
      answer: "(-inf, -2) U (-2, 2) U (2, inf)",
      verify: { m: "domainExcept", f: "x^2-4", range: [-30, 30] },
      timeLimit: 50,
      tags: ["domain", "rational-function"],
      hints: ["分母不能為零。", "x²−4 的零點是 ±2。", "被挖掉兩點會切成三段。"],
      solutionSteps: [
        "分母不能為零：x²−4≠0。",
        "得 x≠2 且 x≠−2。",
        "實數線被挖掉兩個點。",
        "剩下三段開區間：(−∞,−2)、(−2,2)、(2,∞)。"
      ],
      solution: "扣掉分母的零點 ±2，得三段開區間。"
    }),

    /* ── 單調區間：端點永遠是開的 ──────────────────────────── */
    add({
      id: "si-int-016",
      topic: "derivatives",
      rank: 2,
      prompt: "\\text{求 }f(x)=x^3-3x^2\\text{ 遞增的區間}",
      answerKind: "interval",
      answer: "(-inf, 0) U (2, inf)",
      verify: { m: "increasing", f: "x^3-3x^2", range: [-20, 20] },
      timeLimit: 50,
      tags: ["monotonicity", "first-derivative"],
      hints: ["f'(x)=3x²−6x。", "提公因式 3x(x−2)。", "看 f'>0 的地方。"],
      solutionSteps: [
        "f'(x)=3x²−6x=3x(x−2)。",
        "零點 x=0 與 x=2 把數線切成三段。",
        "f'>0 在 (−∞,0) 與 (2,∞)。",
        "端點處 f'=0，不算遞增，所以區間是開的。"
      ],
      solution: "f'(x)=3x(x−2)>0 ⟺ x<0 或 x>2。端點 f'=0 不含在內。"
    }),
    add({
      id: "si-int-017",
      topic: "derivatives",
      rank: 3,
      prompt: "\\text{求 }f(x)=xe^{x}\\text{ 遞增的區間}",
      answerKind: "interval",
      answer: "(-1, inf)",
      verify: { m: "increasing", f: "xe^{x}", range: [-20, 12] },
      timeLimit: 50,
      tags: ["monotonicity", "first-derivative", "exponential"],
      hints: ["乘積律：f'(x)=e^x(1+x)。", "e^x 永遠為正。", "只看 1+x 的符號。"],
      solutionSteps: [
        "f'(x)=e^x+xe^x=e^x(1+x)。",
        "e^x>0 恆成立。",
        "所以 f'>0 ⟺ 1+x>0 ⟺ x>−1。",
        "遞增區間是 (−1, ∞)，端點開。"
      ],
      solution: "f'(x)=e^x(1+x)，指數項恆正，故 f'>0 ⟺ x>−1。"
    }),
    add({
      id: "si-int-018",
      topic: "derivatives",
      rank: 3,
      prompt: "\\text{求 }f(x)=x^4-2x^2\\text{ 遞減的區間}",
      answerKind: "interval",
      answer: "(-inf, -1) U (0, 1)",
      verify: { m: "decreasing", f: "x^4-2x^2", range: [-20, 20] },
      timeLimit: 55,
      tags: ["monotonicity", "first-derivative"],
      hints: ["f'(x)=4x³−4x。", "提公因式 4x(x−1)(x+1)。", "三個零點切成四段。"],
      solutionSteps: [
        "f'(x)=4x³−4x=4x(x−1)(x+1)。",
        "零點 −1、0、1 把數線切成四段。",
        "逐段判號：(−∞,−1) 負、(−1,0) 正、(0,1) 負、(1,∞) 正。",
        "遞減的是 (−∞,−1) 與 (0,1)。"
      ],
      solution: "f'(x)=4x(x−1)(x+1)，負號區間為 (−∞,−1) 與 (0,1)。"
    }),
    add({
      id: "si-int-019",
      topic: "derivatives",
      rank: 3,
      prompt: "\\text{求 }f(x)=\\frac{x}{x^2+1}\\text{ 遞增的區間}",
      answerKind: "interval",
      answer: "(-1, 1)",
      verify: { m: "increasing", f: "\\frac{x}{x^2+1}", range: [-20, 20] },
      timeLimit: 55,
      tags: ["monotonicity", "quotient-rule"],
      hints: ["f'(x)=(1−x²)/(x²+1)²。", "分母恆正。", "只看 1−x² 的符號。"],
      solutionSteps: [
        "商律：f'(x)=(1−x²)/(x²+1)²。",
        "分母 (x²+1)²>0 恆成立。",
        "所以 f'>0 ⟺ 1−x²>0 ⟺ −1<x<1。",
        "遞增區間是 (−1,1)。"
      ],
      solution: "f'(x)=(1−x²)/(x²+1)²，分母恆正，故 f'>0 ⟺ |x|<1。"
    }),
    add({
      id: "si-int-020",
      topic: "derivatives",
      rank: 4,
      prompt: "\\text{求 }f(x)=\\frac{\\ln x}{x}\\text{ 遞增的區間}",
      answerKind: "interval",
      answer: "(0, e)",
      verify: { m: "increasing", f: "\\frac{\\log x}{x}", range: [-5, 40] },
      timeLimit: 65,
      tags: ["monotonicity", "quotient-rule", "log"],
      hints: ["定義域只有 x>0。", "f'(x)=(1−ln x)/x²。", "1−ln x>0 等於 x<e。"],
      solutionSteps: [
        "定義域是 x>0。",
        "商律：f'(x)=(1/x·x−ln x)/x²=(1−ln x)/x²。",
        "分母 x²>0，所以只看 1−ln x。",
        "1−ln x>0 ⟺ ln x<1 ⟺ x<e，合起來得 (0, e)。"
      ],
      solution: "f'(x)=(1−ln x)/x²，在定義域 x>0 上 f'>0 ⟺ x<e。"
    }),
    add({
      id: "si-int-021",
      topic: "derivatives",
      rank: 4,
      prompt: "\\text{求 }f(x)=x-2\\sin x\\text{ 在 }(0,2\\pi)\\text{ 內遞增的區間}",
      answerKind: "interval",
      answer: "(pi/3, 5*pi/3)",
      verify: { m: "increasing", f: "x-2\\sin x", range: [0.001, 6.282] },
      timeLimit: 70,
      tags: ["monotonicity", "trig", "first-derivative"],
      hints: ["f'(x)=1−2cos x。", "解 cos x<1/2。", "在 (0,2π) 內是一整段。"],
      solutionSteps: [
        "f'(x)=1−2cos x。",
        "f'>0 ⟺ cos x<1/2。",
        "在 (0,2π) 內，cos x=1/2 的解是 x=π/3 與 x=5π/3。",
        "中間那一段 cos x<1/2，所以遞增區間是 (π/3, 5π/3)。"
      ],
      solution: "f'(x)=1−2cos x>0 ⟺ cos x<1/2，在 (0,2π) 內即 π/3<x<5π/3。"
    })
  ];

  window.BUZZ_SET_INTERVAL_EXPANSION = problems;
  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
