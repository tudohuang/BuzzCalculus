// 集合與區間題型
//
// 這些題目在 answerKind: "set" / "interval" 出現之前，題庫**寫不出來**。
// 「求所有臨界點」只能硬塞成 text，然後 {2, -1} 和 {-1, 2} 會被判錯；
// 「定義域是什麼」的答案 (0,1] 打成 (0, 1] 也會被判錯。
// 答對卻被判錯，比判得寬鬆傷得更重 —— 使用者會直接停止相信判分器。
//
// 這兩種題型考的東西也是既有四種型別考不到的：
//   set      —— 有沒有**找齊**（少一個根就是沒解完）
//   interval —— 端點到底屬不屬於（開閉是這類題目的全部重點）
//
// 每題的答案都經 tools/verify_answers.js 之外的人工檢查；
// 數值驗算器目前不支援這兩種型別（它比的是單一數值），
// 所以這一包在驗算報告裡會落在「題幹形式尚未支援」。

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
      tabLimit: 1,
      ...problem,
      tags
    };
  }

  const problems = [
    // ── 集合：找齊了沒有 ──────────────────────────────────
    add({
      id: "si-set-001",
      verify: { m: "critical", f: "x^3-3x", range: [-5, 5] },
      solutionSteps: [
              "臨界點的定義是 f'(x)=0（或 f' 不存在）的點。",
              "f'(x)=3x²−3。",
              "解 3x²−3=0，即 x²=1。",
              "x=1 和 x=−1，兩個都要寫。"
      ],
      topic: "derivatives",
      rank: 2,
      prompt: "\\text{求 }f(x)=x^3-3x\\text{ 的所有臨界點}",
      answerKind: "set",
      answer: "{-1, 1}",
      timeLimit: 40,
      tags: ["critical-points", "derivative-zero"],
      hints: ["臨界點是 f'(x)=0 的地方。", "f'(x)=3x²−3。", "3x²−3=0 有兩個根。"],
      solution: "f'(x)=3x²−3=3(x−1)(x+1)，零點是 x=±1。兩個都要寫，只寫一個等於沒解完。"
    }),
    add({
      id: "si-set-002",
      verify: { m: "critical", f: "x^4-8x^2", range: [-5, 5] },
      solutionSteps: [
              "f'(x)=4x³−16x。",
              "提出公因式 4x：f'(x)=4x(x²−4)。",
              "零點來自 4x=0 和 x²−4=0。",
              "得 x=0、x=2、x=−2。最容易漏的是 x=0。"
      ],
      topic: "derivatives",
      rank: 3,
      prompt: "\\text{求 }f(x)=x^4-8x^2\\text{ 的所有臨界點}",
      answerKind: "set",
      answer: "{-2, 0, 2}",
      timeLimit: 50,
      tags: ["critical-points", "derivative-zero"],
      hints: ["f'(x)=4x³−16x。", "提出 4x 之後剩二次式。", "別漏掉 x=0。"],
      solution: "f'(x)=4x³−16x=4x(x²−4)，零點是 x=0、±2。x=0 最容易被漏掉。"
    }),
    add({
      id: "si-set-003",
      verify: { m: "zeros", f: "x^2-3x+2", range: [-6, 6] },
      solutionSteps: [
              "有理函數的不連續點只可能出現在分母為零的地方。",
              "分母 x²−3x+2=(x−1)(x−2)，零點是 x=1 和 x=2。",
              "x=2 時分子 x²−4 也是零，是可去不連續。",
              "但「可去」不代表「連續」——原函數在 x=2 沒有定義，仍然是不連續點。"
      ],
      topic: "limits",
      rank: 3,
      prompt: "\\text{求 }f(x)=\\frac{x^2-4}{x^2-3x+2}\\text{ 的所有不連續點}",
      answerKind: "set",
      answer: "{1, 2}",
      timeLimit: 50,
      tags: ["continuity", "rational-function"],
      hints: ["分母為零的地方。", "x²−3x+2=(x−1)(x−2)。", "x=2 是可去不連續，但仍然是不連續點。"],
      solution: "分母 (x−1)(x−2) 在 x=1、2 為零。x=2 時分子也是零，是可去不連續 —— 但「可去」不等於「連續」，仍要算進去。"
    }),
    add({
      id: "si-set-004",
      verify: { m: "inflection", f: "x^3-3x^2+2", range: [-5, 5] },
      solutionSteps: [
              "反曲點要看二階導數。",
              "f'(x)=3x²−6x，f''(x)=6x−6。",
              "f''(x)=0 給 x=1。",
              "檢查 f'' 在 x=1 兩側變號（左負右正），確認是反曲點。"
      ],
      topic: "derivatives",
      rank: 3,
      prompt: "\\text{求 }f(x)=x^3-3x^2+2\\text{ 的所有反曲點的 }x\\text{ 座標}",
      answerKind: "set",
      answer: "{1}",
      timeLimit: 45,
      tags: ["inflection"],
      hints: ["反曲點看 f''。", "f''(x)=6x−6。", "還要確認二階導數真的變號。"],
      solution: "f''(x)=6x−6，零點 x=1，且 f'' 在 x=1 兩側變號，確實是反曲點。"
    }),
    add({
      id: "si-set-005",
      verify: { m: "critical", f: "\\sin x+\\cos x", range: [0, 6.283185307179586] },
      solutionSteps: [
              "f'(x)=cos x−sin x。",
              "令 f'(x)=0 得 cos x=sin x，即 tan x=1。",
              "tan 的週期是 π，所以 [0,2π] 內有兩個解。",
              "x=π/4 與 x=5π/4。只寫 π/4 是漏了第二個週期。"
      ],
      topic: "derivatives",
      rank: 4,
      prompt: "\\text{求 }f(x)=\\sin x+\\cos x\\text{ 在 }[0,2\\pi]\\text{ 內的所有臨界點}",
      answerKind: "set",
      answer: "{pi/4, 5*pi/4}",
      timeLimit: 55,
      tags: ["critical-points", "derivative-zero", "trig"],
      hints: ["f'(x)=cos x−sin x。", "cos x=sin x 即 tan x=1。", "tan 的週期是 π，區間內有兩個解。"],
      solution: "f'(x)=cos x−sin x=0 給 tan x=1，在 [0,2π] 內的解是 π/4 與 5π/4。只寫 π/4 是漏了第二個週期。"
    }),

    // ── 區間：端點到底算不算 ──────────────────────────────
    add({
      id: "si-int-001",
      verify: { m: "domain", f: "\\log(x-1)", range: [-20, 60] },
      solutionSteps: [
              "對數函數 ln(u) 要求 u>0。",
              "所以需要 x−1>0。",
              "解得 x>1。",
              "x=1 時 ln 0 沒有定義，左端點取不到，寫成開區間 (1,∞)。"
      ],
      topic: "limits",
      rank: 2,
      prompt: "\\text{求 }f(x)=\\ln(x-1)\\text{ 的定義域}",
      answerKind: "interval",
      answer: "(1, inf)",
      timeLimit: 40,
      tags: ["domain", "log"],
      hints: ["對數的引數必須為正。", "x−1>0。", "端點 x=1 取不到，是開的。"],
      solution: "需要 x−1>0 即 x>1。x=1 時 ln 0 沒有定義，所以左端點是開的。"
    }),
    add({
      id: "si-int-002",
      verify: { m: "domain", f: "\\sqrt{4-x^2}", range: [-8, 8] },
      solutionSteps: [
              "偶次方根要求根號內非負。",
              "所以需要 4−x²≥0，即 x²≤4。",
              "解得 −2≤x≤2。",
              "端點 x=±2 時根號內是 0，√0=0 有定義，所以兩端都是閉的：[−2,2]。"
      ],
      topic: "limits",
      rank: 2,
      prompt: "\\text{求 }f(x)=\\sqrt{4-x^2}\\text{ 的定義域}",
      answerKind: "interval",
      answer: "[-2, 2]",
      timeLimit: 40,
      tags: ["domain", "radical"],
      hints: ["根號內必須非負。", "4−x²≥0。", "端點 x=±2 時根號是 0，可以取。"],
      solution: "4−x²≥0 即 −2≤x≤2。端點取得到（根號 0 有定義），所以兩端都是閉的。"
    }),
    add({
      id: "si-int-003",
      verify: { m: "domainExcept", f: "x-3", range: [-30, 30] },
      solutionSteps: [
              "分式要求分母不為零。",
              "x−3=0 給 x=3，這一點要排除。",
              "其餘所有實數都可以代入。",
              "答案是兩段的聯集 (−∞,3)∪(3,∞)，寫成一段區間是錯的。"
      ],
      topic: "limits",
      rank: 3,
      prompt: "\\text{求 }f(x)=\\frac{1}{x-3}\\text{ 的定義域}",
      answerKind: "interval",
      answer: "(-inf, 3) U (3, inf)",
      timeLimit: 45,
      tags: ["domain", "rational-function"],
      hints: ["分母不能為零。", "只有 x=3 要排除。", "答案是兩段區間的聯集。"],
      solution: "只需排除 x=3，其餘全部可用，所以是 (−∞,3)∪(3,∞)。寫成一段是錯的。"
    }),
    add({
      id: "si-int-004",
      solutionSteps: [
              "先用比值審斂法求收斂半徑：|a_{n+1}/a_n| = |x|·n/(n+1) → |x|，所以 R=1。",
              "初步得到 (−1,1)，但端點必須分開檢查。",
              "x=1 時級數變成 Σ1/n，調和級數，發散。",
              "x=−1 時變成 Σ(−1)ⁿ/n，交錯調和級數，條件收斂。",
              "所以收斂區間是 [−1,1)。這題的全部重點在端點。"
      ],
      topic: "series",
      rank: 4,
      prompt: "\\text{求 }\\sum_{n=1}^{\\infty}\\frac{x^n}{n}\\text{ 的收斂區間}",
      answerKind: "interval",
      answer: "[-1, 1)",
      timeLimit: 70,
      tags: ["power-series", "interval-of-convergence", "endpoint"],
      hints: ["先用比值審斂法得收斂半徑 1。", "x=1 時是調和級數。", "x=−1 時是交錯調和級數。"],
      solution: "收斂半徑 1。x=1 給調和級數，發散；x=−1 給交錯調和級數，條件收斂。所以區間是 [−1,1)。端點必須分開檢查 —— 這題的全部重點在這裡。"
    }),
    add({
      id: "si-int-005",
      verify: { m: "increasing", f: "x^3-3x", range: [-20, 20] },
      solutionSteps: [
              "嚴格遞增等價於 f'(x)>0。",
              "f'(x)=3x²−3=3(x−1)(x+1)。",
              "二次式開口向上，在兩根之外為正。",
              "所以 x<−1 或 x>1，寫成 (−∞,−1)∪(1,∞)。臨界點本身 f'=0，不含在內。"
      ],
      topic: "derivatives",
      rank: 3,
      prompt: "\\text{求 }f(x)=x^3-3x\\text{ 遞增的區間}",
      answerKind: "interval",
      answer: "(-inf, -1) U (1, inf)",
      timeLimit: 55,
      tags: ["monotonicity", "first-derivative"],
      hints: ["遞增等價於 f'>0。", "f'(x)=3x²−3。", "3(x−1)(x+1)>0 的解。"],
      solution: "f'(x)=3(x−1)(x+1)>0 的解是 x<−1 或 x>1。臨界點本身 f'=0，不屬於嚴格遞增的開區間。"
    })
  ];

  window.BUZZ_SET_INTERVAL_PROBLEMS = problems;
  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
