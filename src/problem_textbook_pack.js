/* 課本經典題型補充包（tb-）：切線斜率、隱微分、線性近似、曲線間面積、
   弧長、平均值、MVT、曲率半徑、旋轉體、羅必達、牛頓法、最佳化。
   每題都走獨立數值驗算：能被句型辨識器吃掉的照範本句型寫（MVT／曲率半徑／
   旋轉體／極限／導數點值），其餘掛顯式 verify DSL（deriv／implicit／
   linApprox／integral／root／extremum）。 */
(function () {
  "use strict";

  const SRC = "Buzz textbook pack";

  const problems = [
    /* ── 切線斜率（tangent-normal）───────────────────────── */
    {
      source: SRC, id: "tb-tan-001", topic: "derivatives", difficulty: 1, rank: 1,
      prompt: "y=x^3-2x\\text{ 在 }x=2\\text{ 處切線的斜率}",
      answerKind: "numeric", answer: "10",
      tags: ["tangent-normal", "rank-1"],
      timeLimit: 40,
      verify: { m: "deriv", f: "x^3-2x", at: [2] },
      hints: [
        "切線斜率就是導數在該點的值。",
        "先求 y' = 3x^2 - 2。",
        "把 x=2 代進 y' 就是答案。"
      ],
      solution: "y' = 3x² − 2，代 x=2 得 3·4 − 2 = 10。切線斜率＝導數值，這是切線題的第一反射。"
    },
    {
      source: SRC, id: "tb-tan-002", topic: "derivatives", difficulty: 2, rank: 2,
      prompt: "y=\\frac{1}{x}\\text{ 在 }x=3\\text{ 處切線的斜率}",
      answerKind: "numeric", answer: "-1/9",
      tags: ["tangent-normal", "rank-2"],
      timeLimit: 40,
      verify: { m: "deriv", f: "\\frac{1}{x}", at: [3] },
      hints: [
        "把 1/x 寫成 x^{-1} 再微分。",
        "y' = -x^{-2}，注意負號。",
        "代 x=3，別忘了平方在分母。"
      ],
      solution: "y' = −1/x²，代 x=3 得 −1/9。冪法則對負指數一樣適用，負號是常見失分點。"
    },
    {
      source: SRC, id: "tb-tan-003", topic: "derivatives", difficulty: 2, rank: 2,
      prompt: "y=x e^{x}\\text{ 在 }x=0\\text{ 處切線的斜率}",
      answerKind: "numeric", answer: "1",
      tags: ["tangent-normal", "rank-2"],
      timeLimit: 45,
      verify: { m: "deriv", f: "x e^{x}", at: [0] },
      hints: [
        "兩個函數相乘，用乘法法則。",
        "y' = e^x + x e^x = (1+x)e^x。",
        "代 x=0，e^0 是多少？"
      ],
      solution: "乘法法則：y' = e^x + x·e^x = (1+x)e^x，代 x=0 得 1·1 = 1。"
    },
    {
      source: SRC, id: "tb-tan-004", topic: "derivatives", difficulty: 2, rank: 2,
      prompt: "y=\\tan x\\text{ 在 }x=\\tfrac{\\pi}{4}\\text{ 處切線的斜率}",
      answerKind: "numeric", answer: "2",
      tags: ["tangent-normal", "trig", "rank-2"],
      timeLimit: 45,
      verify: { m: "deriv", f: "\\tan x", at: ["\\pi/4"] },
      hints: [
        "tan 的導數是 sec²。",
        "sec(π/4) 的值想一下：cos(π/4)=√2/2。",
        "sec²(π/4) = 1/cos²(π/4)。"
      ],
      solution: "y' = sec²x，cos(π/4)=√2/2，所以 sec²(π/4) = 1/(1/2) = 2。"
    },
    {
      source: SRC, id: "tb-tan-005", topic: "derivatives", difficulty: 1, rank: 1,
      prompt: "y=e^{2x}\\text{ 在 }x=0\\text{ 處切線的斜率}",
      answerKind: "numeric", answer: "2",
      tags: ["tangent-normal", "chain-rule", "rank-1"],
      timeLimit: 35,
      verify: { m: "deriv", f: "e^{2x}", at: [0] },
      hints: [
        "指數裡有 2x，要用鏈鎖律。",
        "y' = 2e^{2x}。",
        "代 x=0，指數部分變成 1。"
      ],
      solution: "鏈鎖律：y' = 2e^{2x}，代 x=0 得 2·1 = 2。內層導數 2 忘記乘是經典錯誤。"
    },
    {
      source: SRC, id: "tb-tan-006", topic: "derivatives", difficulty: 1, rank: 1,
      prompt: "y=\\sqrt{x}\\text{ 在 }x=4\\text{ 處切線的斜率}",
      answerKind: "numeric", answer: "1/4",
      tags: ["tangent-normal", "rank-1"],
      timeLimit: 35,
      verify: { m: "deriv", f: "\\sqrt{x}", at: [4] },
      hints: [
        "√x 就是 x^{1/2}。",
        "y' = (1/2)x^{-1/2} = 1/(2√x)。",
        "代 x=4，√4 = 2。"
      ],
      solution: "y' = 1/(2√x)，代 x=4 得 1/(2·2) = 1/4。"
    },

    /* ── 隱函數微分（implicit-differentiation）───────────── */
    {
      source: SRC, id: "tb-imp-001", topic: "derivatives", difficulty: 2, rank: 2,
      prompt: "x^2+y^2=13\\ \\text{在點}\\ (2,3)\\ \\text{的}\\ \\frac{dy}{dx}",
      answerKind: "numeric", answer: "-2/3",
      tags: ["implicit-differentiation", "rank-2"],
      timeLimit: 50,
      verify: { m: "implicit", F: "x^2+y^2-13", at: [2, 3] },
      hints: [
        "兩邊對 x 微分，y 是 x 的函數。",
        "2x + 2y·y' = 0。",
        "解出 y' 再代入點 (2,3)。"
      ],
      solution: "2x + 2y y' = 0 → y' = −x/y = −2/3。圓的切線斜率永遠是 −x/y，和半徑垂直。"
    },
    {
      source: SRC, id: "tb-imp-002", topic: "derivatives", difficulty: 3, rank: 3,
      prompt: "xy+y^2=6\\ \\text{在點}\\ (1,2)\\ \\text{的}\\ \\frac{dy}{dx}",
      answerKind: "numeric", answer: "-2/5",
      tags: ["implicit-differentiation", "rank-3"],
      timeLimit: 60,
      verify: { m: "implicit", F: "xy+y^2-6", at: [1, 2] },
      hints: [
        "xy 那一項要用乘法法則：微分後是 y + x·y'。",
        "整式微分：y + x y' + 2y y' = 0。",
        "把含 y' 的項收在一起再解。"
      ],
      solution: "y + x y' + 2y y' = 0 → y'(x+2y) = −y → y' = −y/(x+2y) = −2/5。xy 的乘法法則最容易漏掉 y 那一項。"
    },
    {
      source: SRC, id: "tb-imp-003", topic: "derivatives", difficulty: 3, rank: 3,
      prompt: "x^2y+y^3=10\\ \\text{在點}\\ (1,2)\\ \\text{的}\\ \\frac{dy}{dx}",
      answerKind: "numeric", answer: "-4/13",
      tags: ["implicit-differentiation", "rank-3"],
      timeLimit: 70,
      verify: { m: "implicit", F: "x^2y+y^3-10", at: [1, 2] },
      hints: [
        "x²y 用乘法法則，y³ 用鏈鎖律。",
        "2xy + x²y' + 3y²y' = 0。",
        "y' = −2xy/(x²+3y²)，再代點。"
      ],
      solution: "2xy + x²y' + 3y²y' = 0 → y' = −2xy/(x²+3y²) = −4/(1+12) = −4/13。"
    },
    {
      source: SRC, id: "tb-imp-004", topic: "derivatives", difficulty: 3, rank: 3,
      prompt: "x^3+y^3=9\\ \\text{在點}\\ (1,2)\\ \\text{的}\\ \\frac{dy}{dx}",
      answerKind: "numeric", answer: "-1/4",
      tags: ["implicit-differentiation", "rank-3"],
      timeLimit: 55,
      verify: { m: "implicit", F: "x^3+y^3-9", at: [1, 2] },
      hints: [
        "兩邊微分：3x² + 3y²y' = 0。",
        "y' = −x²/y²。",
        "代 (1,2)，分母是 y 的平方。"
      ],
      solution: "3x² + 3y² y' = 0 → y' = −x²/y² = −1/4。對稱式的隱微分答案也對稱，可以當檢查。"
    },

    /* ── 線性近似（linear-approximation）─────────────────── */
    {
      source: SRC, id: "tb-lin-001", topic: "derivatives", difficulty: 2, rank: 2,
      prompt: "\\text{用線性近似估計 }\\sqrt{25.2}",
      answerKind: "numeric", answer: "5.02",
      tags: ["linear-approximation", "rank-2", "beginner-friendly"],
      timeLimit: 60,
      verify: { m: "linApprox", f: "x^{1/2}", a: 25, dx: 0.2 },
      hints: [
        "找最近的完全平方數當基準點。",
        "f(x)=√x，f'(25)=1/(2·5)=1/10。",
        "L = f(25) + f'(25)·0.2。"
      ],
      solution: "f(x)=√x，f(25)=5、f'(25)=1/10。L = 5 + 0.2/10 = 5.02。"
    },
    {
      source: SRC, id: "tb-lin-002", topic: "derivatives", difficulty: 2, rank: 2,
      prompt: "\\text{用線性近似估計 }(1.02)^{10}",
      answerKind: "numeric", answer: "1.2",
      tags: ["linear-approximation", "rank-2"],
      timeLimit: 60,
      verify: { m: "linApprox", f: "x^{10}", a: 1, dx: 0.02 },
      hints: [
        "f(x)=x^{10}，基準點取 x=1。",
        "f'(1)=10。",
        "L = 1 + 10×0.02。"
      ],
      solution: "f(x)=x^{10}，f(1)=1、f'(1)=10。L = 1 + 10(0.02) = 1.2。(1+u)^n ≈ 1+nu 就是這個公式。"
    },
    {
      source: SRC, id: "tb-lin-003", topic: "derivatives", difficulty: 2, rank: 2,
      prompt: "\\text{用線性近似估計 }\\sqrt{3.98}",
      answerKind: "numeric", answer: "1.995",
      tags: ["linear-approximation", "rank-2"],
      timeLimit: 60,
      verify: { m: "linApprox", f: "x^{1/2}", a: 4, dx: -0.02 },
      hints: [
        "基準點取 4，位移是負的。",
        "f'(4)=1/(2·2)=1/4。",
        "L = 2 + (1/4)(−0.02)。"
      ],
      solution: "f(x)=√x，f(4)=2、f'(4)=1/4。L = 2 − 0.02/4 = 1.995。位移可以是負的，公式不變。"
    },
    {
      source: SRC, id: "tb-lin-004", topic: "derivatives", difficulty: 3, rank: 3,
      prompt: "\\text{用線性近似估計 }\\sqrt[4]{16.32}",
      answerKind: "numeric", answer: "2.01",
      tags: ["linear-approximation", "rank-3"],
      timeLimit: 70,
      verify: { m: "linApprox", f: "x^{1/4}", a: 16, dx: 0.32 },
      hints: [
        "f(x)=x^{1/4}，基準點取 16。",
        "f'(x) = (1/4)x^{-3/4}，f'(16)=1/32。",
        "L = 2 + 0.32/32。"
      ],
      solution: "f(x)=x^{1/4}，f(16)=2、f'(16)=(1/4)·16^{−3/4}=1/32。L = 2 + 0.32/32 = 2.01。"
    },

    /* ── 曲線間面積（area）──────────────────────────────── */
    {
      source: SRC, id: "tb-area-001", topic: "integrals", difficulty: 2, rank: 2,
      prompt: "\\text{求 }y=x^2\\text{ 與 }y=2x\\text{ 所圍區域的面積}",
      answerKind: "numeric", answer: "4/3",
      tags: ["area", "rank-2"],
      timeLimit: 60,
      verify: { m: "integral", f: "2x-x^2", v: "x", a: 0, b: 2 },
      hints: [
        "先解交點：x² = 2x。",
        "交點是 x=0 和 x=2，中間誰在上面？",
        "面積 = ∫(上−下) dx。"
      ],
      solution: "交點 x=0,2；區間內 2x ≥ x²。A = ∫₀²(2x−x²)dx = [x²−x³/3]₀² = 4 − 8/3 = 4/3。"
    },
    {
      source: SRC, id: "tb-area-002", topic: "integrals", difficulty: 3, rank: 3,
      prompt: "\\text{求 }y=x^2\\text{ 與 }y=8-x^2\\text{ 所圍區域的面積}",
      answerKind: "numeric", answer: "64/3",
      tags: ["area", "rank-3"],
      timeLimit: 75,
      verify: { m: "integral", f: "8-2x^2", v: "x", a: -2, b: 2 },
      hints: [
        "交點：x² = 8 − x²。",
        "x = ±2，上方是開口向下那條。",
        "被積函數是 (8−x²) − x² = 8 − 2x²。"
      ],
      solution: "交點 x=±2。A = ∫₋₂²(8−2x²)dx = [8x − 2x³/3]₋₂² = (16−16/3)−(−16+16/3) = 64/3。偶函數可以只積一半再乘 2。"
    },
    {
      source: SRC, id: "tb-area-003", topic: "integrals", difficulty: 2, rank: 2,
      prompt: "\\text{求 }y=\\sqrt{x}\\text{ 與 }y=x\\text{ 所圍區域的面積}",
      answerKind: "numeric", answer: "1/6",
      tags: ["area", "rank-2"],
      timeLimit: 60,
      verify: { m: "integral", f: "\\sqrt{x}-x", v: "x", a: 0, b: 1 },
      hints: [
        "交點：√x = x，平方後解。",
        "x=0 和 x=1 之間，√x 在上。",
        "∫₀¹(√x − x)dx。"
      ],
      solution: "交點 x=0,1；0<x<1 時 √x > x。A = ∫₀¹(√x−x)dx = 2/3 − 1/2 = 1/6。"
    },
    {
      source: SRC, id: "tb-area-004", topic: "integrals", difficulty: 2, rank: 2,
      prompt: "\\text{求第一象限中 }y=x^3\\text{ 與 }y=x\\text{ 所圍區域的面積}",
      answerKind: "numeric", answer: "1/4",
      tags: ["area", "rank-2"],
      timeLimit: 60,
      verify: { m: "integral", f: "x-x^3", v: "x", a: 0, b: 1 },
      hints: [
        "第一象限的交點：x³ = x 且 x ≥ 0。",
        "0<x<1 時 x 在 x³ 上方。",
        "∫₀¹(x − x³)dx。"
      ],
      solution: "交點 x=0,1。A = ∫₀¹(x−x³)dx = 1/2 − 1/4 = 1/4。限制第一象限就是把 x=−1 那個交點排除掉。"
    },
    {
      source: SRC, id: "tb-area-005", topic: "integrals", difficulty: 3, rank: 3,
      prompt: "\\text{求 }y=e^{x},\\ y=1\\text{ 與 }x=1\\text{ 所圍區域的面積}",
      answerKind: "numeric", answer: "e-2",
      tags: ["area", "rank-3"],
      timeLimit: 75,
      verify: { m: "integral", f: "e^{x}-1", v: "x", a: 0, b: 1 },
      hints: [
        "y=e^x 與 y=1 交在哪個 x？",
        "區域從 x=0 到 x=1，e^x 在上。",
        "∫₀¹(e^x − 1)dx。"
      ],
      solution: "e^x = 1 在 x=0。A = ∫₀¹(e^x−1)dx = [e^x − x]₀¹ = (e−1) − 1 = e − 2。"
    },

    /* ── 弧長（arc-length）─────────────────────────────── */
    {
      source: SRC, id: "tb-arc-001", topic: "integrals", difficulty: 3, rank: 3,
      prompt: "y=\\tfrac{x^4}{8}+\\tfrac{1}{4x^2},\\ 1\\le x\\le 2\\text{ 的弧長}",
      answerKind: "numeric", answer: "33/16",
      tags: ["arc-length", "rank-3"],
      timeLimit: 90,
      verify: { m: "integral", f: "\\sqrt{1+(\\frac{x^3}{2}-\\frac{1}{2x^3})^2}", v: "x", a: 1, b: 2 },
      hints: [
        "y' = x³/2 − 1/(2x³)。",
        "1 + y'² 會湊成完全平方：(x³/2 + 1/(2x³))²。",
        "根號打開後直接積分。"
      ],
      solution: "y' = x³/2 − 1/(2x³)，1+y'² = (x³/2 + 1/(2x³))²。L = ∫₁²(x³/2 + 1/(2x³))dx = [x⁴/8 − 1/(4x²)]₁² = (2−1/16)−(1/8−1/4) = 33/16。這型的函數是特地設計來湊完全平方的。"
    },
    {
      source: SRC, id: "tb-arc-002", topic: "integrals", difficulty: 4, rank: 4,
      prompt: "y=\\tfrac{x^2}{2},\\ 0\\le x\\le 1\\text{ 的弧長}",
      answerKind: "numeric", answer: "(sqrt(2)+log(1+sqrt(2)))/2",
      tags: ["arc-length", "rank-4"],
      timeLimit: 130,
      verify: { m: "integral", f: "\\sqrt{1+x^2}", v: "x", a: 0, b: 1 },
      hints: [
        "y' = x，弧長是 ∫√(1+x²)dx。",
        "√(1+x²) 用三角代換 x=tan θ 或查公式。",
        "∫√(1+x²)dx = (x√(1+x²) + ln(x+√(1+x²)))/2。"
      ],
      solution: "y'=x，L = ∫₀¹√(1+x²)dx = [x√(1+x²)/2 + ln(x+√(1+x²))/2]₀¹ = (√2 + ln(1+√2))/2。拋物線的弧長是三角代換的招牌應用。"
    },
    {
      source: SRC, id: "tb-arc-003", topic: "integrals", difficulty: 3, rank: 3,
      prompt: "y=\\tfrac{2}{3}(x^2+1)^{3/2},\\ 0\\le x\\le 1\\text{ 的弧長}",
      answerKind: "numeric", answer: "5/3",
      tags: ["arc-length", "rank-3"],
      timeLimit: 90,
      verify: { m: "integral", f: "\\sqrt{1+4x^2(x^2+1)}", v: "x", a: 0, b: 1 },
      hints: [
        "鏈鎖律：y' = 2x(x²+1)^{1/2}。",
        "1+y'² = 4x⁴+4x²+1，這是誰的平方？",
        "(2x²+1)² 打開驗證一下。"
      ],
      solution: "y' = 2x√(x²+1)，1+y'² = 4x⁴+4x²+1 = (2x²+1)²。L = ∫₀¹(2x²+1)dx = 2/3 + 1 = 5/3。"
    },

    /* ── 平均值（average-value）─────────────────────────── */
    {
      source: SRC, id: "tb-avg-001", topic: "integrals", difficulty: 2, rank: 2,
      prompt: "f(x)=\\sqrt{x}\\text{ 在 }[0,4]\\text{ 的平均值}",
      answerKind: "numeric", answer: "4/3",
      tags: ["average-value", "rank-2", "beginner-friendly"],
      timeLimit: 50,
      verify: { m: "integral", f: "\\frac{\\sqrt{x}}{4}", v: "x", a: 0, b: 4 },
      hints: [
        "平均值 = (1/(b−a))∫ f。",
        "∫₀⁴ √x dx = (2/3)·4^{3/2}。",
        "再除以區間長度 4。"
      ],
      solution: "平均值 = (1/4)∫₀⁴√x dx = (1/4)(2/3)(8) = 4/3。"
    },
    {
      source: SRC, id: "tb-avg-002", topic: "integrals", difficulty: 3, rank: 3,
      prompt: "f(x)=\\cos x\\text{ 在 }[0,\\tfrac{\\pi}{2}]\\text{ 的平均值}",
      answerKind: "numeric", answer: "2/pi",
      tags: ["average-value", "trig", "rank-3"],
      timeLimit: 50,
      verify: { m: "integral", f: "\\frac{2}{\\pi}\\cos x", v: "x", a: 0, b: "\\pi/2" },
      hints: [
        "平均值 = (1/(b−a))∫ f，區間長是 π/2。",
        "∫₀^{π/2} cos x dx = 1。",
        "1 除以 π/2 等於乘 2/π。"
      ],
      solution: "平均值 = (2/π)∫₀^{π/2}cos x dx = (2/π)·1 = 2/π。"
    },
    {
      source: SRC, id: "tb-avg-003", topic: "integrals", difficulty: 2, rank: 2,
      prompt: "f(x)=\\frac{1}{x^2}\\text{ 在 }[1,2]\\text{ 的平均值}",
      answerKind: "numeric", answer: "1/2",
      tags: ["average-value", "rank-2"],
      timeLimit: 50,
      verify: { m: "integral", f: "\\frac{1}{x^2}", v: "x", a: 1, b: 2 },
      hints: [
        "區間長度是 1，平均值就等於積分值。",
        "1/x² 的反導數是 −1/x。",
        "代上下限相減。"
      ],
      solution: "平均值 = (1/1)∫₁² x^{−2}dx = [−1/x]₁² = −1/2 + 1 = 1/2。"
    },

    /* ── MVT 的 c（mvt，句型自動驗算）────────────────────── */
    {
      source: SRC, id: "tb-mvt-001", topic: "derivatives", difficulty: 2, rank: 2,
      prompt: "f(x)=x^3\\text{ 在 }[1,2]\\text{ 上滿足 MVT 的 }c",
      answerKind: "numeric", answer: "sqrt(7/3)",
      tags: ["mvt", "rank-2"],
      timeLimit: 55,
      hints: [
        "MVT：f'(c) 等於割線斜率。",
        "割線斜率 = (8−1)/(2−1) = 7。",
        "解 3c² = 7，取區間內的解。"
      ],
      solution: "割線斜率 (8−1)/(2−1)=7，f'(c)=3c²=7 → c=√(7/3) ≈ 1.53，落在 (1,2) 內。"
    },
    {
      source: SRC, id: "tb-mvt-002", topic: "derivatives", difficulty: 3, rank: 3,
      prompt: "f(x)=e^{x}\\text{ 在 }[0,1]\\text{ 上滿足 MVT 的 }c",
      answerKind: "numeric", answer: "log(e-1)",
      tags: ["mvt", "rank-3"],
      timeLimit: 65,
      hints: [
        "割線斜率 = (e−1)/(1−0)。",
        "f'(c) = e^c = e−1。",
        "兩邊取對數。"
      ],
      solution: "割線斜率 = e−1，e^c = e−1 → c = ln(e−1) ≈ 0.54，落在 (0,1) 內。"
    },
    {
      source: SRC, id: "tb-mvt-003", topic: "derivatives", difficulty: 3, rank: 3,
      prompt: "f(x)=\\frac{1}{x}\\text{ 在 }[1,4]\\text{ 上滿足 MVT 的 }c",
      answerKind: "numeric", answer: "2",
      tags: ["mvt", "rank-3"],
      timeLimit: 60,
      hints: [
        "割線斜率 = (1/4 − 1)/(4−1)。",
        "f'(c) = −1/c² = −1/4。",
        "c² = 4，取區間內的正解。"
      ],
      solution: "割線斜率 = (1/4−1)/3 = −1/4，−1/c² = −1/4 → c=2。幾何平均 √(1·4)：1/x 的 MVT 點永遠是端點的幾何平均。"
    },

    /* ── 曲率半徑（curvature，句型自動驗算）──────────────── */
    {
      source: SRC, id: "tb-curv-001", topic: "derivatives", difficulty: 3, rank: 3,
      prompt: "\\text{曲線 }y=x^2\\text{ 在 }x=1\\text{ 的曲率半徑}",
      answerKind: "numeric", answer: "5*sqrt(5)/2",
      tags: ["curvature", "rank-3"],
      timeLimit: 80,
      hints: [
        "曲率 κ = |y''|/(1+y'²)^{3/2}，半徑是 1/κ。",
        "x=1 時 y'=2、y''=2。",
        "R = (1+4)^{3/2}/2。"
      ],
      solution: "y'=2x、y''=2。κ = 2/(1+4)^{3/2} = 2/(5√5)，R = 1/κ = 5√5/2。"
    },
    {
      source: SRC, id: "tb-curv-002", topic: "derivatives", difficulty: 3, rank: 3,
      prompt: "\\text{曲線 }y=x^3\\text{ 在 }x=1\\text{ 的曲率半徑}",
      answerKind: "numeric", answer: "5*sqrt(10)/3",
      tags: ["curvature", "rank-3"],
      timeLimit: 80,
      hints: [
        "x=1 時 y'=3、y''=6。",
        "κ = 6/(1+9)^{3/2}。",
        "半徑取倒數：10^{3/2}/6。"
      ],
      solution: "y'=3x²、y''=6x，在 x=1：κ = 6/10^{3/2}，R = 10√10/6 = 5√10/3。"
    },
    {
      source: SRC, id: "tb-curv-003", topic: "derivatives", difficulty: 3, rank: 3,
      prompt: "\\text{曲線 }y=\\sin x\\text{ 在 }x=\\tfrac{\\pi}{2}\\text{ 的曲率半徑}",
      answerKind: "numeric", answer: "1",
      tags: ["curvature", "trig", "rank-3"],
      timeLimit: 70,
      hints: [
        "x=π/2 是 sin 的頂點，那裡 y'=0。",
        "y'' = −sin x = −1。",
        "κ = |−1|/1^{3/2}。"
      ],
      solution: "頂點處 y'=0、y''=−1，κ = 1，R = 1。sin 波峰的密切圓恰好是單位圓。"
    },

    /* ── 旋轉體（solid-of-revolution，句型自動驗算）───────── */
    {
      source: SRC, id: "tb-rev-001", topic: "integrals", difficulty: 2, rank: 2,
      prompt: "y=x+1,\\ 0\\le x\\le 1\\text{ 繞 }x\\text{ 軸的體積}",
      answerKind: "numeric", answer: "7*pi/3",
      tags: ["solid-of-revolution", "rank-2"],
      timeLimit: 60,
      hints: [
        "圓盤法：V = π∫(半徑)² dx。",
        "半徑是 x+1，平方後展開或直接積。",
        "π[(x+1)³/3]₀¹。"
      ],
      solution: "V = π∫₀¹(x+1)²dx = π[(x+1)³/3]₀¹ = π(8−1)/3 = 7π/3。轉出來是截頭圓錐，用錐台公式驗證也一致。"
    },
    {
      source: SRC, id: "tb-rev-002", topic: "integrals", difficulty: 3, rank: 3,
      prompt: "y=\\frac{1}{x},\\ 1\\le x\\le 3\\text{ 繞 }x\\text{ 軸的體積}",
      answerKind: "numeric", answer: "2*pi/3",
      tags: ["solid-of-revolution", "rank-3"],
      timeLimit: 65,
      hints: [
        "V = π∫(1/x)² dx。",
        "1/x² 的反導數是 −1/x。",
        "π[−1/x]₁³。"
      ],
      solution: "V = π∫₁³x^{−2}dx = π[−1/x]₁³ = π(1 − 1/3) = 2π/3。"
    },
    {
      source: SRC, id: "tb-rev-003", topic: "integrals", difficulty: 2, rank: 2,
      prompt: "y=2x,\\ 0\\le x\\le 1\\text{ 繞 }x\\text{ 軸的體積}",
      answerKind: "numeric", answer: "4*pi/3",
      tags: ["solid-of-revolution", "rank-2"],
      timeLimit: 55,
      hints: [
        "轉出來是一個圓錐。",
        "V = π∫₀¹(2x)²dx。",
        "也可以用圓錐公式 (1/3)πr²h 驗證。"
      ],
      solution: "V = π∫₀¹4x²dx = 4π/3。圓錐公式：r=2、h=1，(1/3)π·4·1 = 4π/3，兩邊一致。"
    },

    /* ── 羅必達（lhopital，極限自動驗算）─────────────────── */
    {
      source: SRC, id: "tb-lh-001", topic: "limits", difficulty: 2, rank: 2,
      prompt: "\\lim_{x\\to 0}\\frac{e^{2x}-1}{\\sin 3x}",
      answerKind: "numeric", answer: "2/3",
      tags: ["lhopital", "rank-2"],
      timeLimit: 50,
      hints: [
        "0/0 型，可用羅必達或標準極限。",
        "分子 ~ 2x，分母 ~ 3x。",
        "比值就是係數比。"
      ],
      solution: "0/0 型：羅必達得 2e^{2x}/(3cos 3x) → 2/3。或用 e^u−1~u、sin u~u 直接讀出 2x/3x。"
    },
    {
      source: SRC, id: "tb-lh-002", topic: "limits", difficulty: 3, rank: 3,
      prompt: "\\lim_{x\\to 0}\\frac{\\arctan 2x}{\\sin 5x}",
      answerKind: "numeric", answer: "2/5",
      tags: ["lhopital", "rank-3"],
      timeLimit: 55,
      hints: [
        "0/0 型，分子分母都趨近各自的一次項。",
        "arctan u ~ u、sin u ~ u。",
        "剩下的就是 2x 比 5x。"
      ],
      solution: "arctan 2x ~ 2x、sin 5x ~ 5x，極限 = 2/5。羅必達一次：2/(1+4x²) ÷ 5cos 5x → 2/5，一樣快。"
    },
    {
      source: SRC, id: "tb-lh-003", topic: "limits", difficulty: 2, rank: 2,
      prompt: "\\lim_{x\\to 1}\\frac{x^5-1}{x^3-1}",
      answerKind: "numeric", answer: "5/3",
      tags: ["lhopital", "rank-2"],
      timeLimit: 50,
      hints: [
        "0/0 型，羅必達一次就好。",
        "分子微分 5x⁴、分母微分 3x²。",
        "代 x=1。"
      ],
      solution: "羅必達：5x⁴/3x² 在 x=1 是 5/3。一般式：(xⁿ−1)/(xᵐ−1) → n/m。"
    },
    {
      source: SRC, id: "tb-lh-004", topic: "limits", difficulty: 3, rank: 3,
      prompt: "\\lim_{x\\to 0}\\frac{4^x-2^x}{x}",
      answerKind: "numeric", answer: "log(2)",
      tags: ["lhopital", "rank-3"],
      timeLimit: 60,
      hints: [
        "0/0 型，把 aˣ 的導數想起來：aˣ ln a。",
        "羅必達一次：4ˣln 4 − 2ˣln 2，代 x=0。",
        "ln 4 − ln 2 可以再化簡。"
      ],
      solution: "羅必達：分子導數在 x=0 是 ln 4 − ln 2 = ln 2。一般式 (aˣ−bˣ)/x → ln(a/b)。"
    },

    /* ── 牛頓法一步（newton-method）──────────────────────── */
    {
      source: SRC, id: "tb-newt-001", topic: "derivatives", difficulty: 3, rank: 3,
      prompt: "f(x)=x^2-5,\\ x_0=2.\\quad \\text{牛頓法一次迭代後的 }x_1",
      answerKind: "numeric", answer: "9/4",
      tags: ["newton-method", "rank-3"],
      timeLimit: 60,
      verify: { m: "root", f: "x^2-5", x0: 2, n: 1 },
      hints: [
        "公式：x₁ = x₀ − f(x₀)/f'(x₀)。",
        "f(2) = −1、f'(2) = 4。",
        "2 − (−1)/4。"
      ],
      solution: "x₁ = 2 − f(2)/f'(2) = 2 − (−1)/4 = 9/4 = 2.25。這其實就是用牛頓法算 √5 的第一步。"
    },
    {
      source: SRC, id: "tb-newt-002", topic: "derivatives", difficulty: 3, rank: 3,
      prompt: "f(x)=x^3-2,\\ x_0=1.\\quad \\text{牛頓法一次迭代後的 }x_1",
      answerKind: "numeric", answer: "4/3",
      tags: ["newton-method", "rank-3"],
      timeLimit: 60,
      verify: { m: "root", f: "x^3-2", x0: 1, n: 1 },
      hints: [
        "x₁ = x₀ − f(x₀)/f'(x₀)。",
        "f(1) = −1、f'(1) = 3。",
        "1 − (−1)/3。"
      ],
      solution: "x₁ = 1 − (−1)/3 = 4/3 ≈ 1.333，往 ∛2 ≈ 1.26 靠近中。負的 f 值讓迭代往右走。"
    },

    /* ── 最佳化（optimization）──────────────────────────── */
    {
      source: SRC, id: "tb-opt-001", topic: "derivatives", difficulty: 2, rank: 2,
      prompt: "\\text{周長 }24\\text{ 的矩形，面積的最大值}",
      answerKind: "numeric", answer: "36",
      tags: ["optimization", "rank-2", "beginner-friendly"],
      timeLimit: 55,
      verify: { m: "extremum", f: "x(12-x)", vars: ["x"], kind: "max" },
      hints: [
        "設一邊為 x，另一邊是 (24−2x)/2 = 12−x。",
        "A = x(12−x)，微分找臨界點。",
        "A' = 12 − 2x = 0。"
      ],
      solution: "A(x) = x(12−x)，A' = 12−2x = 0 → x=6，A = 36。周長固定時正方形面積最大。"
    },
    {
      source: SRC, id: "tb-opt-002", topic: "derivatives", difficulty: 3, rank: 3,
      prompt: "\\text{兩數之和為 }20\\text{，其平方和的最小值}",
      answerKind: "numeric", answer: "200",
      tags: ["optimization", "rank-3"],
      timeLimit: 60,
      verify: { m: "extremum", f: "x^2+(20-x)^2", vars: ["x"], kind: "min" },
      hints: [
        "設兩數為 x 與 20−x。",
        "S = x² + (20−x)²，微分。",
        "S' = 2x − 2(20−x) = 0。"
      ],
      solution: "S' = 2x − 2(20−x) = 4x − 40 = 0 → x=10，S = 100+100 = 200。平方和在兩數相等時最小，和乘積題正好對偶。"
    }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
