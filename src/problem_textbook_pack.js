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

(function () {
  "use strict";
  // 課程缺口補題（5A–5D 積分應用）：變號切段的面積、交叉的兩曲線、對 y 積分、圓盤／墊圈／圓殼（含移軸與對 y）、
  // 選方法、旋轉曲面（含繞 y 軸）、積分均值定理的 c、變力／抽水／彈簧做功、液壓、質心。
  // 體積題的 verify 一律走「另一種方法」（∬ 2π·半徑 dA 或另一個方向的切片），不重抄解答的積分式。
  const SOURCE = "Buzz course gap fill";
  const STORY = "story-problem";
  const TAU = "2\\pi";
  const problems = [
    /* ── 5A 面積：變號要切段 ── */
    { id: "cg-5a-001", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{求曲線 }y=x^2-4x\\text{ 與 }x\\text{ 軸在 }0\\le x\\le 5\\text{ 之間所夾的總面積}",
      answer: "13", timeLimit: 90,
      tags: ["area-split-at-zeros", "area", "definite-integral"],
      hints: ["先找 x² − 4x 在 [0, 5] 裡的零點，看哪一段在 x 軸下方。", "面積是每一段積分的絕對值相加，不是整段積一次。"],
      solution: "零點 x = 0, 4。[0,4] 在 x 軸下方：∫₀⁴(4x − x²)dx = 32/3；[4,5] 在上方：∫₄⁵(x² − 4x)dx = 7/3。總面積 13。",
      solutionSteps: ["x² − 4x = x(x − 4)：在 (0,4) 為負、在 (4,5) 為正。", "∫₀⁴ (4x − x²) dx = 32 − 64/3 = 32/3。", "∫₄⁵ (x² − 4x) dx = 61/3 − 18 = 7/3。", "總面積 = 32/3 + 7/3 = 13。"],
      verify: { m: "integral", f: "\\left|x^2-4x\\right|", a: 0, b: 5, breaks: [4] } },
    { id: "cg-5a-002", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{求曲線 }y=\\sin 2x\\text{ 與 }x\\text{ 軸在 }0\\le x\\le \\frac{3\\pi}{4}\\text{ 之間所夾的總面積}",
      answer: "3/2", timeLimit: 90,
      tags: ["area-split-at-zeros", "area", "trig"],
      hints: ["sin 2x 在哪裡變號？先找 [0, 3π/4] 裡的零點。", "負的那一段要取絕對值再加。"],
      solution: "sin 2x 在 x = π/2 變號。∫₀^{π/2} sin 2x dx = 1；∫_{π/2}^{3π/4} sin 2x dx = −1/2，取絕對值 1/2。總面積 3/2。",
      solutionSteps: ["sin 2x = 0 ⇔ x = π/2（在區間內）；(0, π/2) 為正，(π/2, 3π/4) 為負。", "∫₀^{π/2} sin 2x dx = [−cos 2x / 2]₀^{π/2} = 1。", "∫_{π/2}^{3π/4} sin 2x dx = 0 − 1/2 = −1/2，面積取 1/2。", "總面積 = 1 + 1/2 = 3/2。"],
      verify: { m: "integral", f: "\\left|\\sin 2x\\right|", a: 0, b: "3\\pi/4", breaks: ["\\pi/2"] } },
    { id: "cg-5a-003", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求曲線 }y=x^3-x^2-2x\\text{ 與 }x\\text{ 軸在 }-1\\le x\\le 2\\text{ 之間所夾的總面積}",
      answer: "37/12", timeLimit: 150,
      tags: ["area-split-at-zeros", "area", "factoring"],
      hints: ["先因式分解，找出區間裡的零點。", "每一段判斷正負，分段積分後取絕對值相加。"],
      solution: "x³ − x² − 2x = x(x − 2)(x + 1)，零點 −1, 0, 2。[−1,0] 為正：積分 5/12；[0,2] 為負：積分 −8/3。總面積 5/12 + 8/3 = 37/12。",
      solutionSteps: ["x³ − x² − 2x = x(x + 1)(x − 2)：(−1,0) 為正、(0,2) 為負。", "反導函數 F = x⁴/4 − x³/3 − x²；∫₋₁⁰ = 0 − (−5/12) = 5/12。", "∫₀² = F(2) − 0 = 4 − 8/3 − 4 = −8/3，面積取 8/3。", "總面積 = 5/12 + 32/12 = 37/12。"],
      verify: { m: "integral", f: "\\left|x^3-x^2-2x\\right|", a: -1, b: 2, breaks: [0] } },

    /* ── 5A 兩曲線之間：交叉要切段、整塊在 x 軸下方 ── */
    { id: "cg-5a-004", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{求曲線 }y=x^3\\text{ 與直線 }y=4x\\text{ 所圍區域的總面積}",
      answer: "8", timeLimit: 90,
      tags: ["between-crossing", "area", "between-curves"],
      hints: ["先解 x³ = 4x 找出所有交點。", "交點把區域切成兩塊，每一塊上方的曲線不一樣。"],
      solution: "交點 x = −2, 0, 2。[0,2] 上 4x 在上；[−2,0] 上 x³ 在上。兩塊對稱，各為 ∫₀²(4x − x³)dx = 4，總面積 8。",
      solutionSteps: ["x³ = 4x ⇔ x(x² − 4) = 0 ⇒ x = −2, 0, 2。", "[0,2]：上 4x、下 x³；∫₀² (4x − x³) dx = 8 − 4 = 4。", "[−2,0]：上 x³、下 4x；∫₋₂⁰ (x³ − 4x) dx = 0 − (4 − 8) = 4。", "總面積 = 4 + 4 = 8。"],
      verify: { m: "integral", f: "\\left|x^3-4x\\right|", a: -2, b: 2, breaks: [0] } },
    { id: "cg-5a-005", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求曲線 }y=x^2\\text{ 與直線 }y=x+2\\text{ 在 }-2\\le x\\le 3\\text{ 之間所夾的總面積}",
      answer: "49/6", timeLimit: 150,
      tags: ["between-crossing", "area", "between-curves"],
      hints: ["兩條線在區間裡交叉幾次？先解 x² = x + 2。", "每一段都是「上面減下面」，誰在上面要逐段判斷。"],
      solution: "交點 x = −1, 2。[−2,−1] 與 [2,3] 上 x² 在上，[−1,2] 上 x + 2 在上。三段面積 11/6、9/2、11/6，總和 49/6。",
      solutionSteps: ["x² − x − 2 = (x − 2)(x + 1)，交點 x = −1, 2。", "令 H = x³/3 − x²/2 − 2x：H(−2) = −2/3，H(−1) = 7/6，H(2) = −10/3，H(3) = −3/2。", "[−2,−1]：H(−1) − H(−2) = 11/6；[−1,2]：H(−1) − H(2) = 9/2；[2,3]：H(3) − H(2) = 11/6。", "總面積 = 11/6 + 27/6 + 11/6 = 49/6。"],
      verify: { m: "integral", f: "\\left|x^2-x-2\\right|", a: -2, b: 3, breaks: [-1, 2] } },
    { id: "cg-5a-006", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求曲線 }y=\\sin x\\text{ 與 }y=\\sin 2x\\text{ 在 }0\\le x\\le \\pi\\text{ 之間所夾的總面積}",
      answer: "5/2", timeLimit: 150,
      tags: ["between-crossing", "area", "trig"],
      hints: ["sin 2x = 2 sin x cos x，解 sin 2x = sin x 找交點。", "交點之前與之後，誰在上面不一樣。"],
      solution: "sin x(2cos x − 1) = 0 ⇒ x = 0, π/3, π。[0, π/3] 上 sin 2x 在上，面積 1/4；[π/3, π] 上 sin x 在上，面積 9/4。總面積 5/2。",
      solutionSteps: ["sin 2x − sin x = sin x(2cos x − 1)，在 (0, π) 內只在 x = π/3 變號。", "∫₀^{π/3} (sin 2x − sin x) dx = [−cos 2x/2 + cos x]₀^{π/3} = 3/4 − 1/2 = 1/4。", "∫_{π/3}^{π} (sin x − sin 2x) dx = [−cos x + cos 2x/2]_{π/3}^{π} = 3/2 + 3/4 = 9/4。", "總面積 = 1/4 + 9/4 = 5/2。"],
      verify: { m: "integral", f: "\\left|\\sin 2x-\\sin x\\right|", a: 0, b: "\\pi", breaks: ["\\pi/3"] } },
    { id: "cg-5a-007", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{求曲線 }y=x^2-4x\\text{ 與直線 }y=-x\\text{ 所圍區域的面積（整塊區域在 }x\\text{ 軸下方）}",
      answer: "9/2", timeLimit: 90,
      tags: ["between-top-minus-bottom", "area", "between-curves"],
      hints: ["面積永遠是「上面的曲線減下面的曲線」，跟區域在 x 軸上方或下方無關。", "先解交點，再在中間挑一點判斷哪一條比較高。"],
      solution: "x² − 4x = −x ⇒ x = 0, 3。在 x = 1：−x = −1 > −3，所以 y = −x 在上。面積 ∫₀³(−x − x² + 4x)dx = ∫₀³(3x − x²)dx = 9/2。",
      solutionSteps: ["交點：x² − 3x = 0 ⇒ x = 0, 3。", "在 (0,3) 內 −x > x² − 4x（例如 x = 1：−1 > −3），上面是 y = −x。", "面積 = ∫₀³ [(−x) − (x² − 4x)] dx = ∫₀³ (3x − x²) dx = 27/2 − 9 = 9/2。"],
      verify: { m: "double", u: "x", v: "y", f: "1", a: 0, b: 3, c: "x^2-4x", d: "-x" } },

    /* ── 5A 對 y 積分：右減左、選方向 ── */
    { id: "cg-5a-008", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{求曲線 }x=2y^2\\text{ 與 }x=12-y^2\\text{ 所圍區域的面積}",
      answer: "32", timeLimit: 90,
      tags: ["area-dy-right-minus-left", "area", "between-curves"],
      hints: ["邊界已經寫成 x = g(y)，直接用水平細條：右邊減左邊，對 y 積分。", "先解 2y² = 12 − y² 找 y 的範圍。"],
      solution: "2y² = 12 − y² ⇒ y = ±2。右邊 x = 12 − y²、左邊 x = 2y²。面積 ∫₋₂²(12 − 3y²)dy = 48 − 16 = 32。",
      solutionSteps: ["交點：3y² = 12 ⇒ y = ±2。", "在 −2 < y < 2，右邊 12 − y² 大於左邊 2y²。", "面積 = ∫₋₂² (12 − 3y²) dy = [12y − y³]₋₂² = 32。"],
      verify: { m: "double", u: "x", v: "y", f: "1", a: 0, b: 12, c: "-\\sqrt{\\frac{12-\\frac{x}{2}-\\left|\\frac{3x}{2}-12\\right|}{2}}", d: "\\sqrt{\\frac{12-\\frac{x}{2}-\\left|\\frac{3x}{2}-12\\right|}{2}}" } },
    { id: "cg-5a-009", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{求曲線 }x=y^2-2y\\text{ 與直線 }x=y+4\\text{ 所圍區域的面積}",
      answer: "125/6", timeLimit: 100,
      tags: ["area-dy-right-minus-left", "area", "between-curves"],
      hints: ["兩條邊界都是 x = g(y)：對 y 積分，右邊減左邊。", "解 y² − 2y = y + 4 得到 y 的上下限。"],
      solution: "y² − 3y − 4 = 0 ⇒ y = −1, 4。右邊 x = y + 4。面積 ∫₋₁⁴(y + 4 − y² + 2y)dy = ∫₋₁⁴(4 + 3y − y²)dy = 125/6。",
      solutionSteps: ["交點：y² − 3y − 4 = (y − 4)(y + 1) = 0 ⇒ y = −1, 4。", "在 y = 0：直線 x = 4、拋物線 x = 0，直線在右。", "面積 = ∫₋₁⁴ (4 + 3y − y²) dy = [4y + 3y²/2 − y³/3]₋₁⁴ = 56/3 + 13/6 = 125/6。"],
      verify: { m: "double", u: "y", v: "x", f: "1", a: -1, b: 4, c: "y^2-2y", d: "y+4" } },
    { id: "cg-5a-010", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求曲線 }x=4-y^2\\text{ 與 }x=y^2-2y\\text{ 所圍區域的面積}",
      answer: "9", timeLimit: 150,
      tags: ["area-dy-right-minus-left", "area", "between-curves"],
      hints: ["兩條都是開口向左右的拋物線，直切會很麻煩；改用水平細條。", "解 4 − y² = y² − 2y 得 y 的範圍，再判斷哪一條在右。"],
      solution: "4 − y² = y² − 2y ⇒ y² − y − 2 = 0 ⇒ y = −1, 2。右邊 x = 4 − y²。面積 ∫₋₁²(4 + 2y − 2y²)dy = 2·9/2 = 9。",
      solutionSteps: ["交點：2y² − 2y − 4 = 0 ⇒ y = −1, 2。", "在 y = 0：4 − y² = 4、y² − 2y = 0，前者在右。", "面積 = ∫₋₁² (4 + 2y − 2y²) dy = [4y + y² − 2y³/3]₋₁² = 20/3 + 7/3 = 9。"],
      verify: { m: "integral", v: "y", f: "\\left|4+2y-2y^2\\right|", a: -1, b: 2 } },
    { id: "cg-5a-011", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{區域由 }x=y^2-1\\text{ 與 }x=y+1\\text{ 圍成。要用「一個積分」算面積，該怎麼切？}",
      answer: "橫切（對 y 積分）一個積分就夠", answers: ["橫切（對 y 積分）一個積分就夠"], canonical: "橫切（對 y 積分）一個積分就夠",
      distractors: ["直切（對 x 積分）一個積分就夠", "兩個方向都要拆成兩段"],
      timeLimit: 90,
      tags: ["area-dy-choose-direction", "area", "between-curves"],
      hints: ["畫出拋物線 x = y² − 1（開口向右）與直線，看直切的細條上下端是不是一直同一條曲線。", "橫切時，每一條水平細條的左端、右端各是哪一條？"],
      solution: "橫切：左邊一律是 x = y² − 1、右邊一律是 x = y + 1，y 從 −1 到 2，一個積分 ∫₋₁²(2 + y − y²)dy = 9/2。直切時，x < 0 那段下端是拋物線下半支、x > 0 那段下端是直線，要拆兩段。",
      solutionSteps: ["交點：y² − 1 = y + 1 ⇒ y = −1, 2，即 (0, −1) 與 (3, 2)。", "直切：−1 ≤ x ≤ 0 時上下都是拋物線；0 ≤ x ≤ 3 時下端換成直線，要拆兩段。", "橫切：右 x = y + 1、左 x = y² − 1 一路不變，一個積分 ∫₋₁² (2 + y − y²) dy = 9/2。"],
      verify: { m: "choice", options: [
        { say: "橫切（對 y 積分）一個積分就夠", all: [{ v: { m: "integral", v: "y", f: "(y+1)-(y^2-1)", a: -1, b: 2 }, eq: { m: "double", u: "x", v: "y", f: "1", a: -1, b: 3, c: "\\frac{-\\sqrt{x+1}+(x-1)+\\left|-\\sqrt{x+1}-(x-1)\\right|}{2}", d: "\\sqrt{x+1}" }, tol: 1e-5 }] },
        { say: "直切（對 x 積分）一個積分就夠", all: [{ v: { m: "integral", f: "\\sqrt{x+1}-(x-1)", a: -1, b: 3 }, eq: { m: "double", u: "x", v: "y", f: "1", a: -1, b: 3, c: "\\frac{-\\sqrt{x+1}+(x-1)+\\left|-\\sqrt{x+1}-(x-1)\\right|}{2}", d: "\\sqrt{x+1}" }, tol: 1e-5 }] },
        { say: "兩個方向都要拆成兩段", all: [{ v: { m: "integral", v: "y", f: "(y+1)-(y^2-1)", a: -1, b: 2 }, ne: { m: "double", u: "x", v: "y", f: "1", a: -1, b: 3, c: "\\frac{-\\sqrt{x+1}+(x-1)+\\left|-\\sqrt{x+1}-(x-1)\\right|}{2}", d: "\\sqrt{x+1}" } }] }
      ] } },
    { id: "cg-5a-012", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{區域由 }y=x^2\\text{、}y=2-x\\text{ 與 }x\\text{ 軸圍成（在第一象限）。下列哪一個「單一積分」等於它的面積？}",
      answer: "∫₀¹ (2 − y − √y) dy", answers: ["∫₀¹ (2 − y − √y) dy"], canonical: "∫₀¹ (2 − y − √y) dy",
      distractors: ["∫₀² (2 − x − x²) dx", "∫₀¹ (√y − (2 − y)) dy"],
      timeLimit: 90,
      tags: ["area-dy-choose-direction", "area", "between-curves"],
      hints: ["直切的話，細條的上端在 x = 1 前後換了曲線，一個 dx 積分寫不出來。", "橫切：每條水平細條的右端是哪一條、左端是哪一條？"],
      solution: "區域頂點 (0,0)、(1,1)、(2,0)。橫切：左邊 x = √y、右邊 x = 2 − y，y 從 0 到 1，面積 ∫₀¹(2 − y − √y)dy = 5/6。對 x 的單一積分把兩條曲線相減是錯的；左減右會得負數。",
      solutionSteps: ["交點：x² = 2 − x ⇒ x = 1，三個頂點 (0,0)、(1,1)、(2,0)。", "橫切：右 x = 2 − y、左 x = √y，0 ≤ y ≤ 1。", "面積 = ∫₀¹ (2 − y − √y) dy = 2 − 1/2 − 2/3 = 5/6。"],
      verify: { m: "choice", options: [
        { say: "∫₀¹ (2 − y − √y) dy", all: [{ v: { m: "integral", v: "y", f: "2-y-\\sqrt{y}", a: 0, b: 1 }, eq: { m: "double", u: "x", v: "y", f: "1", a: 0, b: 2, c: 0, d: "\\frac{x^2+(2-x)-\\left|x^2-(2-x)\\right|}{2}" }, tol: 1e-5 }] },
        { say: "∫₀² (2 − x − x²) dx", all: [{ v: { m: "integral", f: "2-x-x^2", a: 0, b: 2 }, eq: { m: "double", u: "x", v: "y", f: "1", a: 0, b: 2, c: 0, d: "\\frac{x^2+(2-x)-\\left|x^2-(2-x)\\right|}{2}" }, tol: 1e-5 }] },
        { say: "∫₀¹ (√y − (2 − y)) dy", all: [{ v: { m: "integral", v: "y", f: "\\sqrt{y}-(2-y)", a: 0, b: 1 }, eq: { m: "double", u: "x", v: "y", f: "1", a: 0, b: 2, c: 0, d: "\\frac{x^2+(2-x)-\\left|x^2-(2-x)\\right|}{2}" }, tol: 1e-5 }] }
      ] } },

    /* ── 5B 圓盤：繞 y 軸、截面已知的立體 ── */
    { id: "cg-5b-001", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{曲線 }y=x^3\\text{、}y\\text{ 軸與直線 }y=8\\text{ 所圍區域（第一象限）繞 }y\\text{ 軸旋轉，求體積}",
      answer: "96*pi/5", timeLimit: 100,
      tags: ["volume-disk-y-axis", "solid-of-revolution", "volume"],
      hints: ["繞 y 軸、區域貼著 y 軸：用水平圓盤，半徑是 x，要寫成 y 的函數。", "y = x³ ⇒ x = y^{1/3}，y 從 0 到 8。"],
      solution: "水平圓盤半徑 x = y^{1/3}。V = π∫₀⁸ y^{2/3} dy = π·(3/5)·8^{5/3} = π·(3/5)·32 = 96π/5。",
      solutionSteps: ["在高度 y 的圓盤半徑 r = x = y^{1/3}。", "V = π∫₀⁸ (y^{1/3})² dy = π∫₀⁸ y^{2/3} dy。", "= π·(3/5)·8^{5/3} = π·(3/5)·32 = 96π/5。"],
      verify: { m: "double", u: "x", v: "y", f: TAU + " x", a: 0, b: 2, c: "x^3", d: 8 } },
    { id: "cg-5b-002", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{曲線 }y=\\frac{2}{x}\\text{、}y\\text{ 軸、直線 }y=1\\text{ 與 }y=4\\text{ 所圍區域繞 }y\\text{ 軸旋轉，求體積}",
      answer: "3*pi", timeLimit: 100,
      tags: ["volume-disk-y-axis", "solid-of-revolution", "volume"],
      hints: ["水平切：在高度 y 的圓盤半徑就是曲線上的 x。", "把 y = 2/x 解成 x = 2/y。"],
      solution: "半徑 x = 2/y，y 從 1 到 4。V = π∫₁⁴ 4/y² dy = 4π(1 − 1/4) = 3π。",
      solutionSteps: ["x = 2/y，水平圓盤面積 π(2/y)²。", "V = π∫₁⁴ 4y⁻² dy = 4π[−1/y]₁⁴。", "= 4π(1 − 1/4) = 3π。"],
      verify: { m: "double", u: "y", v: "x", f: TAU + " x", a: 1, b: 4, c: 0, d: "\\frac{2}{y}" } },
    { id: "cg-5b-003", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=\\ln(x+1)\\text{、}y\\text{ 軸與直線 }y=\\ln 3\\text{ 所圍區域繞 }y\\text{ 軸旋轉，求體積}",
      answer: "pi*log(3)", timeLimit: 150,
      tags: ["volume-disk-y-axis", "solid-of-revolution", "volume"],
      hints: ["區域在曲線左上方、貼著 y 軸：水平圓盤的半徑是曲線上的 x。", "把 y = ln(x + 1) 解成 x = e^y − 1，平方後逐項積分。"],
      solution: "x = e^y − 1，y 從 0 到 ln 3。V = π∫₀^{ln3}(e^{2y} − 2e^y + 1)dy = π[(9 − 1)/2 − 2(3 − 1) + ln 3] = π ln 3。",
      solutionSteps: ["區域：0 ≤ y ≤ ln 3，0 ≤ x ≤ e^y − 1。", "V = π∫₀^{ln 3} (e^y − 1)² dy = π∫₀^{ln 3} (e^{2y} − 2e^y + 1) dy。", "= π[e^{2y}/2 − 2e^y + y]₀^{ln 3} = π(4 − 4 + ln 3) = π ln 3。"],
      verify: { m: "double", u: "x", v: "y", f: TAU + " x", a: 0, b: 2, c: "\\ln(x+1)", d: "\\ln 3" } },
    { id: "cg-5b-004", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{立體的底面是 }x\\ge 0,\\ y\\ge 0,\\ x+y\\le 3\\text{ 的三角形；垂直於 }x\\text{ 軸的每個截面都是正方形，一邊落在底面上。求體積}",
      answer: "9", timeLimit: 100,
      tags: ["volume-cross-section", "volume", "cross-section"],
      hints: ["在位置 x，截面正方形的邊長就是底面在這裡的寬度。", "體積 = ∫ 截面積 dx。"],
      solution: "在 x 處底面寬 3 − x，正方形面積 (3 − x)²。V = ∫₀³(3 − x)²dx = 9。",
      solutionSteps: ["位置 x 的截面：邊長 s = 3 − x 的正方形，面積 (3 − x)²。", "V = ∫₀³ (3 − x)² dx = [−(3 − x)³/3]₀³ = 27/3 = 9。"],
      verify: { m: "double", u: "x", v: "y", f: "3-x", a: 0, b: 3, c: 0, d: "3-x" } },
    { id: "cg-5b-005", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{立體的底面是 }y=x^2\\text{ 與 }y=4\\text{ 所圍的區域；垂直於 }y\\text{ 軸的每個截面都是半圓，直徑落在底面上。求體積}",
      answer: "4*pi", timeLimit: 100,
      tags: ["volume-cross-section", "volume", "cross-section"],
      hints: ["截面垂直於 y 軸，所以對 y 積分；在高度 y，直徑是底面的水平寬度。", "半圓面積 = (1/2)π(半徑)²。"],
      solution: "高度 y 處底面寬 2√y，半圓半徑 √y，面積 πy/2。V = ∫₀⁴ πy/2 dy = 4π。",
      solutionSteps: ["高度 y 處：x 從 −√y 到 √y，直徑 2√y、半徑 √y。", "半圓面積 A(y) = (1/2)π(√y)² = πy/2。", "V = ∫₀⁴ πy/2 dy = π·16/4 = 4π。"],
      verify: { m: "double", u: "y", v: "x", f: "\\sqrt{y-x^2}", a: 0, b: 4, c: "-\\sqrt{y}", d: "\\sqrt{y}" } },

    /* ── 5B 墊圈：外半徑與內半徑、移軸、對 y ── */
    { id: "cg-5b-006", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{曲線 }y=\\sqrt{x}\\text{ 與直線 }y=\\frac{x}{2}\\text{ 所圍區域繞 }x\\text{ 軸旋轉，求體積}",
      answer: "8*pi/3", timeLimit: 100,
      tags: ["washer-outer-inner", "solid-of-revolution", "volume"],
      hints: ["先求交點；中間挑一點看誰離 x 軸比較遠，那條是外半徑。", "墊圈面積 = π(外² − 內²)，不是 π(外 − 內)²。"],
      solution: "交點 x = 0, 4。外半徑 √x、內半徑 x/2。V = π∫₀⁴(x − x²/4)dx = π(8 − 16/3) = 8π/3。",
      solutionSteps: ["√x = x/2 ⇒ x = 0, 4；在 (0,4) 內 √x > x/2。", "V = π∫₀⁴ [(√x)² − (x/2)²] dx = π∫₀⁴ (x − x²/4) dx。", "= π(8 − 16/3) = 8π/3。"],
      verify: { m: "double", u: "x", v: "y", f: TAU + " y", a: 0, b: 4, c: "\\frac{x}{2}", d: "\\sqrt{x}" } },
    { id: "cg-5b-007", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{直線 }y=2\\text{ 與曲線 }y=x^2+1\\text{ 所圍區域繞 }x\\text{ 軸旋轉，求體積}",
      answer: "64*pi/15", timeLimit: 100,
      tags: ["washer-outer-inner", "solid-of-revolution", "volume"],
      hints: ["區域沒有碰到 x 軸，旋轉後中間是空的：墊圈。", "外半徑 2、內半徑 x² + 1，x 從哪裡到哪裡？"],
      solution: "交點 x = ±1。V = π∫₋₁¹[4 − (x² + 1)²]dx = π∫₋₁¹(3 − 2x² − x⁴)dx = 2π(3 − 2/3 − 1/5) = 64π/15。",
      solutionSteps: ["x² + 1 = 2 ⇒ x = ±1；外半徑 R = 2、內半徑 r = x² + 1。", "V = π∫₋₁¹ [4 − (x² + 1)²] dx = π∫₋₁¹ (3 − 2x² − x⁴) dx。", "= 2π(3 − 2/3 − 1/5) = 2π·32/15 = 64π/15。"],
      verify: { m: "double", u: "x", v: "y", f: TAU + " y", a: -1, b: 1, c: "x^2+1", d: 2 } },
    { id: "cg-5b-008", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=\\cos x\\text{、}y=\\sin x\\text{ 與 }y\\text{ 軸在 }0\\le x\\le\\frac{\\pi}{4}\\text{ 所圍區域繞 }x\\text{ 軸旋轉，求體積}",
      answer: "pi/2", timeLimit: 150,
      tags: ["washer-outer-inner", "solid-of-revolution", "trig"],
      hints: ["在 (0, π/4) 上 cos x 比 sin x 大：外半徑 cos x、內半徑 sin x。", "cos²x − sin²x 可以合成一個倍角。"],
      solution: "V = π∫₀^{π/4}(cos²x − sin²x)dx = π∫₀^{π/4} cos 2x dx = π·(1/2)sin(π/2) = π/2。",
      solutionSteps: ["外半徑 R = cos x、內半徑 r = sin x，0 ≤ x ≤ π/4。", "V = π∫₀^{π/4} (cos²x − sin²x) dx = π∫₀^{π/4} cos 2x dx。", "= π[sin 2x / 2]₀^{π/4} = π/2。"],
      verify: { m: "double", u: "x", v: "y", f: TAU + " y", a: 0, b: "\\pi/4", c: "\\sin x", d: "\\cos x" } },
    { id: "cg-5b-009", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=x^2\\text{ 與直線 }y=4\\text{ 所圍區域繞直線 }y=5\\text{ 旋轉，求體積}",
      answer: "832*pi/15", timeLimit: 150,
      tags: ["washer-shifted-axis", "solid-of-revolution", "volume"],
      hints: ["軸 y = 5 在區域上方：半徑是 5 − y，離軸遠的那條邊界反而是 y = x²。", "外半徑 5 − x²、內半徑 5 − 4 = 1。"],
      solution: "外半徑 5 − x²、內半徑 1，x 從 −2 到 2。V = π∫₋₂²[(5 − x²)² − 1]dx = π∫₋₂²(24 − 10x² + x⁴)dx = 832π/15。",
      solutionSteps: ["軸在區域上方，距離 = 5 − y；R = 5 − x²（下緣）、r = 5 − 4 = 1（上緣）。", "V = π∫₋₂² [(5 − x²)² − 1] dx = π∫₋₂² (24 − 10x² + x⁴) dx。", "= 2π(48 − 80/3 + 32/5) = 2π·416/15 = 832π/15。"],
      verify: { m: "double", u: "x", v: "y", f: TAU + " (5-y)", a: -2, b: 2, c: "x^2", d: 4 } },
    { id: "cg-5b-010", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=\\sqrt{x}\\text{ 與直線 }y=x\\text{ 所圍區域繞直線 }y=-2\\text{ 旋轉，求體積}",
      answer: "5*pi/6", timeLimit: 150,
      tags: ["washer-shifted-axis", "solid-of-revolution", "volume"],
      hints: ["軸 y = −2 在區域下方：每條邊界到軸的距離是 y + 2。", "外半徑用離軸較遠的 √x，內半徑用 x。"],
      solution: "外半徑 √x + 2、內半徑 x + 2，0 ≤ x ≤ 1。V = π∫₀¹[(√x + 2)² − (x + 2)²]dx = π∫₀¹(4√x − 3x − x²)dx = 5π/6。",
      solutionSteps: ["交點 x = 0, 1，在 (0,1) 內 √x > x；R = √x + 2、r = x + 2。", "R² − r² = x + 4√x + 4 − (x² + 4x + 4) = 4√x − 3x − x²。", "V = π∫₀¹ (4√x − 3x − x²) dx = π(8/3 − 3/2 − 1/3) = 5π/6。"],
      verify: { m: "double", u: "x", v: "y", f: TAU + " (y+2)", a: 0, b: 1, c: "x", d: "\\sqrt{x}" } },
    { id: "cg-5b-011", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=3-x^2\\text{ 與直線 }y=2\\text{ 所圍區域繞直線 }y=1\\text{ 旋轉，求體積}",
      answer: "56*pi/15", timeLimit: 150,
      tags: ["washer-shifted-axis", "solid-of-revolution", "volume"],
      hints: ["軸 y = 1 在區域下方，區域沒有碰到軸：墊圈。", "外半徑 (3 − x²) − 1，內半徑 2 − 1。"],
      solution: "交點 x = ±1。外半徑 2 − x²、內半徑 1。V = π∫₋₁¹[(2 − x²)² − 1]dx = π∫₋₁¹(3 − 4x² + x⁴)dx = 56π/15。",
      solutionSteps: ["3 − x² = 2 ⇒ x = ±1；R = (3 − x²) − 1 = 2 − x²、r = 2 − 1 = 1。", "V = π∫₋₁¹ [(2 − x²)² − 1] dx = π∫₋₁¹ (3 − 4x² + x⁴) dx。", "= 2π(3 − 4/3 + 1/5) = 2π·28/15 = 56π/15。"],
      verify: { m: "double", u: "x", v: "y", f: TAU + " (y-1)", a: -1, b: 1, c: 2, d: "3-x^2" } },
    { id: "cg-5b-012", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{第一象限中直線 }y=x\\text{ 與曲線 }y=x^3\\text{ 所圍區域繞 }y\\text{ 軸旋轉，用對 }y\\text{ 積分的墊圈法求體積}",
      answer: "4*pi/15", timeLimit: 150,
      tags: ["washer-dy", "solid-of-revolution", "volume"],
      hints: ["水平切：在高度 y，兩條邊界各寫成 x = 什麼？", "離 y 軸較遠的那條是外半徑。"],
      solution: "高度 y 處，x 從 y（直線）到 y^{1/3}（曲線）。V = π∫₀¹(y^{2/3} − y²)dy = π(3/5 − 1/3) = 4π/15。",
      solutionSteps: ["y = x³ ⇒ x = y^{1/3}；y = x ⇒ x = y。0 < y < 1 時 y^{1/3} > y。", "R = y^{1/3}、r = y，V = π∫₀¹ (y^{2/3} − y²) dy。", "= π(3/5 − 1/3) = 4π/15。"],
      verify: { m: "double", u: "x", v: "y", f: TAU + " x", a: 0, b: 1, c: "x^3", d: "x" } },
    { id: "cg-5b-013", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=x^2\\text{、直線 }x=1\\text{ 與直線 }y=4\\text{ 所圍區域（}1\\le x\\le 2\\text{）繞 }y\\text{ 軸旋轉，用對 }y\\text{ 積分的墊圈法求體積}",
      answer: "9*pi/2", timeLimit: 150,
      tags: ["washer-dy", "solid-of-revolution", "volume"],
      hints: ["區域離 y 軸至少 1：水平切出的是墊圈，內半徑固定。", "y 的範圍從曲線與 x = 1 的交點到 y = 4。"],
      solution: "高度 y（1 ≤ y ≤ 4）處，外半徑 √y、內半徑 1。V = π∫₁⁴(y − 1)dy = 9π/2。",
      solutionSteps: ["區域：1 ≤ y ≤ 4，1 ≤ x ≤ √y。", "R = √y、r = 1，V = π∫₁⁴ (y − 1) dy。", "= π[y²/2 − y]₁⁴ = π(4 + 1/2) = 9π/2。"],
      verify: { m: "double", u: "x", v: "y", f: TAU + " x", a: 1, b: 2, c: "x^2", d: 4 } },

    /* ── 5B 圓殼：對 y、移軸 ── */
    { id: "cg-5b-014", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }x=4y-y^2\\text{ 與 }y\\text{ 軸所圍區域繞 }x\\text{ 軸旋轉，用圓殼法（水平細條）求體積}",
      answer: "128*pi/3", timeLimit: 150,
      tags: ["shell-dy", "shell-method", "solid-of-revolution"],
      hints: ["繞 x 軸、用水平細條：圓殼半徑是 y，長度是細條的 x 長。", "曲線與 y 軸交在 y = 0 與 y = 4。"],
      solution: "高度 y 的細條長 4y − y²、半徑 y。V = 2π∫₀⁴ y(4y − y²)dy = 2π(256/3 − 64) = 128π/3。",
      solutionSteps: ["4y − y² = 0 ⇒ y = 0, 4；細條從 x = 0 到 x = 4y − y²。", "V = 2π∫₀⁴ y(4y − y²) dy = 2π∫₀⁴ (4y² − y³) dy。", "= 2π(256/3 − 64) = 2π·64/3 = 128π/3。"],
      verify: { m: "integral", f: "\\pi\\left[\\left(2+\\sqrt{4-x}\\right)^2-\\left(2-\\sqrt{4-x}\\right)^2\\right]", a: 0, b: 4 } },
    { id: "cg-5b-015", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }x=y^2+1\\text{、直線 }x=5\\text{ 與 }x\\text{ 軸所圍區域（第一象限）繞 }x\\text{ 軸旋轉，用圓殼法求體積}",
      answer: "8*pi", timeLimit: 150,
      tags: ["shell-dy", "shell-method", "solid-of-revolution"],
      hints: ["水平細條：左端在拋物線、右端在 x = 5，長度是兩者相減。", "y 從 0 到拋物線與 x = 5 的交點。"],
      solution: "細條長 5 − (y² + 1) = 4 − y²、半徑 y，0 ≤ y ≤ 2。V = 2π∫₀² y(4 − y²)dy = 2π(8 − 4) = 8π。",
      solutionSteps: ["y² + 1 = 5 ⇒ y = 2；細條長 4 − y²。", "V = 2π∫₀² y(4 − y²) dy = 2π[2y² − y⁴/4]₀²。", "= 2π(8 − 4) = 8π。"],
      verify: { m: "integral", f: "\\pi(x-1)", a: 1, b: 5 } },
    { id: "cg-5b-016", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{直線 }y=x\\text{ 與曲線 }y=x^2\\text{ 所圍區域繞直線 }x=2\\text{ 旋轉，求體積}",
      answer: "pi/2", timeLimit: 150,
      tags: ["shell-shifted-axis", "shell-method", "solid-of-revolution"],
      hints: ["軸 x = 2 在區域右邊：圓殼半徑是 2 − x，不是 x。", "高度是上面的 x 減下面的 x²。"],
      solution: "半徑 2 − x、高 x − x²。V = 2π∫₀¹(2 − x)(x − x²)dx = 2π∫₀¹(2x − 3x² + x³)dx = 2π·1/4 = π/2。",
      solutionSteps: ["區域 0 ≤ x ≤ 1，高 h = x − x²；到軸 x = 2 的距離 r = 2 − x。", "V = 2π∫₀¹ (2 − x)(x − x²) dx = 2π∫₀¹ (2x − 3x² + x³) dx。", "= 2π(1 − 1 + 1/4) = π/2。"],
      verify: { m: "integral", v: "y", f: "\\pi\\left[(2-y)^2-(2-\\sqrt{y})^2\\right]", a: 0, b: 1 } },
    { id: "cg-5b-017", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=\\sqrt{x}\\ (0\\le x\\le 4)\\text{ 與 }x\\text{ 軸之間的區域繞直線 }x=5\\text{ 旋轉，求體積}",
      answer: "416*pi/15", timeLimit: 150,
      tags: ["shell-shifted-axis", "shell-method", "solid-of-revolution"],
      hints: ["軸在區域右邊 1 單位處：半徑 = 5 − x。", "展開 (5 − x)√x 再逐項積分。"],
      solution: "V = 2π∫₀⁴(5 − x)√x dx = 2π(5·(2/3)·8 − (2/5)·32) = 2π(80/3 − 64/5) = 416π/15。",
      solutionSteps: ["圓殼半徑 r = 5 − x、高 h = √x。", "V = 2π∫₀⁴ (5x^{1/2} − x^{3/2}) dx = 2π[(10/3)x^{3/2} − (2/5)x^{5/2}]₀⁴。", "= 2π(80/3 − 64/5) = 2π·208/15 = 416π/15。"],
      verify: { m: "integral", v: "y", f: "\\pi\\left[(5-y^2)^2-1\\right]", a: 0, b: 2 } },

    /* ── 5B 選方法 ── */
    { id: "cg-5b-018", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{曲線 }y=x^3+x\\text{、}x\\text{ 軸與直線 }x=1\\text{ 所圍區域繞 }y\\text{ 軸旋轉。下列哪一個積分能直接算出體積？}",
      answer: "圓殼：2π∫₀¹ x(x³ + x) dx", answers: ["圓殼：2π∫₀¹ x(x³ + x) dx"], canonical: "圓殼：2π∫₀¹ x(x³ + x) dx",
      distractors: ["圓盤：π∫₀¹ (x³ + x)² dx", "圓殼：2π∫₀¹ (x³ + x) dx"],
      timeLimit: 90,
      tags: ["choose-method-boundary-form", "shell-method", "solid-of-revolution"],
      hints: ["想用墊圈就得把 y = x³ + x 解成 x = g(y)——解得出來嗎？", "繞 y 軸的圓殼，半徑是什麼？"],
      solution: "x³ + x 的反函數寫不出來，墊圈法卡住；繞 y 軸用鉛直細條的圓殼：半徑 x、高 x³ + x，V = 2π∫₀¹x(x³ + x)dx = 16π/15。π∫(x³+x)²dx 是繞 x 軸；少乘半徑 x 也不對。",
      solutionSteps: ["墊圈要 x = g(y)，但 y = x³ + x 解不出 x 的簡單式子。", "圓殼：半徑 x、高 x³ + x，V = 2π∫₀¹ x(x³ + x) dx。", "= 2π(1/5 + 1/3) = 16π/15。"],
      verify: { m: "choice", options: [
        { say: "圓殼：2π∫₀¹ x(x³ + x) dx", all: [{ v: { m: "integral", f: "2\\pi x(x^3+x)", a: 0, b: 1 }, eq: { m: "double", u: "x", v: "y", f: TAU + " x", a: 0, b: 1, c: 0, d: "x^3+x" }, tol: 1e-5 }] },
        { say: "圓盤：π∫₀¹ (x³ + x)² dx", all: [{ v: { m: "integral", f: "\\pi(x^3+x)^2", a: 0, b: 1 }, eq: { m: "double", u: "x", v: "y", f: TAU + " x", a: 0, b: 1, c: 0, d: "x^3+x" }, tol: 1e-5 }] },
        { say: "圓殼：2π∫₀¹ (x³ + x) dx", all: [{ v: { m: "integral", f: "2\\pi(x^3+x)", a: 0, b: 1 }, eq: { m: "double", u: "x", v: "y", f: TAU + " x", a: 0, b: 1, c: 0, d: "x^3+x" }, tol: 1e-5 }] }
      ] } },
    { id: "cg-5b-019", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{頂點為 }(0,0)\\text{、}(1,1)\\text{、}(2,0)\\text{ 的三角形繞 }x\\text{ 軸旋轉。下列哪一個「單一積分」正確算出體積？}",
      answer: "圓殼：2π∫₀¹ y(2 − 2y) dy", answers: ["圓殼：2π∫₀¹ y(2 − 2y) dy"], canonical: "圓殼：2π∫₀¹ y(2 − 2y) dy",
      distractors: ["圓盤：π∫₀² x² dx", "圓殼：2π∫₀¹ (2 − 2y) dy"],
      timeLimit: 90,
      tags: ["choose-method-boundary-form", "shell-method", "solid-of-revolution"],
      hints: ["用圓盤（對 x）的話，三角形的上緣在 x = 1 換了一條線，要拆兩段。", "水平細條從左邊 x = y 到右邊 x = 2 − y，長度不換式子。"],
      solution: "上緣在 x = 1 前後是 y = x 與 y = 2 − x，圓盤要拆段；水平細條長 (2 − y) − y = 2 − 2y、半徑 y，一個積分：2π∫₀¹y(2 − 2y)dy = 2π/3。π∫₀²x²dx 沒拆段；少乘 y 是漏了半徑。",
      solutionSteps: ["圓盤：0 ≤ x ≤ 1 半徑 x、1 ≤ x ≤ 2 半徑 2 − x，得拆兩個積分。", "圓殼（對 y）：細條長 2 − 2y、半徑 y，0 ≤ y ≤ 1，一個積分。", "V = 2π∫₀¹ (2y − 2y²) dy = 2π(1 − 2/3) = 2π/3。"],
      verify: { m: "choice", options: [
        { say: "圓殼：2π∫₀¹ y(2 − 2y) dy", all: [{ v: { m: "integral", v: "y", f: "2\\pi y(2-2y)", a: 0, b: 1 }, eq: { m: "integral", f: "\\pi\\left(\\frac{x+(2-x)-|x-(2-x)|}{2}\\right)^2", a: 0, b: 2, breaks: [1] }, tol: 1e-5 }] },
        { say: "圓盤：π∫₀² x² dx", all: [{ v: { m: "integral", f: "\\pi x^2", a: 0, b: 2 }, eq: { m: "integral", f: "\\pi\\left(\\frac{x+(2-x)-|x-(2-x)|}{2}\\right)^2", a: 0, b: 2, breaks: [1] }, tol: 1e-5 }] },
        { say: "圓殼：2π∫₀¹ (2 − 2y) dy", all: [{ v: { m: "integral", v: "y", f: "2\\pi(2-2y)", a: 0, b: 1 }, eq: { m: "integral", f: "\\pi\\left(\\frac{x+(2-x)-|x-(2-x)|}{2}\\right)^2", a: 0, b: 2, breaks: [1] }, tol: 1e-5 }] }
      ] } },
    { id: "cg-5b-020", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{曲線 }y=\\sin(x^2)\\ (0\\le x\\le\\sqrt{\\pi})\\text{ 與 }x\\text{ 軸之間的區域繞 }y\\text{ 軸旋轉。下列哪一個積分能直接算出體積？}",
      answer: "圓殼：2π∫₀^√π x sin(x²) dx", answers: ["圓殼：2π∫₀^√π x sin(x²) dx"], canonical: "圓殼：2π∫₀^√π x sin(x²) dx",
      distractors: ["圓盤：π∫₀^√π sin²(x²) dx", "圓殼：2π∫₀^√π sin(x²) dx"],
      timeLimit: 90,
      tags: ["choose-method-boundary-form", "shell-method", "solid-of-revolution"],
      hints: ["對 y 切的話，每個高度有兩個 x，而且要解 arcsin——很麻煩。", "圓殼的半徑 x 剛好是 x² 的導數的一半，可以代換。"],
      solution: "繞 y 軸用鉛直細條的圓殼：半徑 x、高 sin(x²)，V = 2π∫₀^√π x sin(x²)dx = π[−cos(x²)]₀^√π = 2π。π∫sin²(x²)dx 是繞 x 軸；漏了半徑 x 的那個積分算不出初等式，也不是體積。",
      solutionSteps: ["墊圈要把 y = sin(x²) 解成兩支 x = √(arcsin y)、√(π − arcsin y)，麻煩。", "圓殼：V = 2π∫₀^√π x sin(x²) dx，令 u = x²。", "= π∫₀^π sin u du = 2π。"],
      verify: { m: "choice", options: [
        { say: "圓殼：2π∫₀^√π x sin(x²) dx", all: [{ v: { m: "integral", f: "2\\pi x\\sin(x^2)", a: 0, b: "\\sqrt{\\pi}" }, eq: { m: "integral", v: "y", f: "\\pi\\left(\\pi-2\\arcsin y\\right)", a: 0, b: 1 }, tol: 1e-5 }] },
        { say: "圓盤：π∫₀^√π sin²(x²) dx", all: [{ v: { m: "integral", f: "\\pi\\sin^2(x^2)", a: 0, b: "\\sqrt{\\pi}" }, eq: { m: "integral", v: "y", f: "\\pi\\left(\\pi-2\\arcsin y\\right)", a: 0, b: 1 }, tol: 1e-5 }] },
        { say: "圓殼：2π∫₀^√π sin(x²) dx", all: [{ v: { m: "integral", f: "2\\pi\\sin(x^2)", a: 0, b: "\\sqrt{\\pi}" }, eq: { m: "integral", v: "y", f: "\\pi\\left(\\pi-2\\arcsin y\\right)", a: 0, b: 1 }, tol: 1e-5 }] }
      ] } },
    { id: "cg-5b-021", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=\\ln x\\text{、}y\\text{ 軸、直線 }y=0\\text{ 與 }y=2\\text{ 所圍區域繞 }y\\text{ 軸旋轉，求體積}",
      answer: "pi*(e^4-1)/2", timeLimit: 150,
      tags: ["choose-method-cross-check", "solid-of-revolution", "volume"],
      hints: ["繞 y 軸不一定要用圓殼：這裡用圓殼得拆段又要分部積分。", "水平切：在高度 y，圓盤半徑是 x = e^y。"],
      solution: "區域是 0 ≤ y ≤ 2、0 ≤ x ≤ e^y。水平圓盤：V = π∫₀² e^{2y}dy = π(e⁴ − 1)/2。圓殼要把 x 拆成 [0,1] 與 [1,e²] 兩段，還要算 ∫x ln x dx。",
      solutionSteps: ["y = ln x ⇔ x = e^y；區域 0 ≤ y ≤ 2、0 ≤ x ≤ e^y。", "圓盤半徑 e^y：V = π∫₀² e^{2y} dy。", "= π[e^{2y}/2]₀² = π(e⁴ − 1)/2。"],
      verify: { m: "double", u: "x", v: "y", f: TAU + " x", a: 0, b: "e^2", c: "\\frac{\\ln x+|\\ln x|}{2}", d: 2 } },
    { id: "cg-5b-022", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=\\arctan x\\text{、}y\\text{ 軸與直線 }y=\\frac{\\pi}{4}\\text{ 所圍區域繞 }y\\text{ 軸旋轉，求體積}",
      answer: "pi*(1-pi/4)", timeLimit: 150,
      tags: ["choose-method-cross-check", "solid-of-revolution", "volume"],
      hints: ["圓殼會遇到 ∫x arctan x dx；換個方向切呢？", "水平切：x = tan y，tan²y 可以用恆等式換掉。"],
      solution: "區域 0 ≤ y ≤ π/4、0 ≤ x ≤ tan y。水平圓盤：V = π∫₀^{π/4} tan²y dy = π∫₀^{π/4}(sec²y − 1)dy = π(1 − π/4)。",
      solutionSteps: ["y = arctan x ⇔ x = tan y；區域貼著 y 軸，水平切是圓盤。", "V = π∫₀^{π/4} tan²y dy = π∫₀^{π/4} (sec²y − 1) dy。", "= π[tan y − y]₀^{π/4} = π(1 − π/4)。"],
      verify: { m: "double", u: "x", v: "y", f: TAU + " x", a: 0, b: 1, c: "\\arctan x", d: "\\pi/4" } },

    /* ── 5C 旋轉曲面面積 ── */
    { id: "cg-5c-001", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{曲線 }y=\\sqrt{x}\\ (0\\le x\\le 6)\\text{ 繞 }x\\text{ 軸旋轉，求旋轉曲面的面積}",
      answer: "62*pi/3", timeLimit: 120,
      tags: ["surface-area-formula", "surface-area", "solid-of-revolution"],
      hints: ["S = 2π∫ y √(1 + (y′)²) dx。", "y·√(1 + 1/(4x)) 化簡成 √(x + 1/4)。"],
      solution: "y′ = 1/(2√x)，y√(1 + y′²) = √(x + 1/4)。S = 2π∫₀⁶√(x + 1/4)dx = (4π/3)[(25/4)^{3/2} − (1/4)^{3/2}] = (4π/3)(31/2) = 62π/3。",
      solutionSteps: ["y′ = 1/(2√x)，1 + y′² = 1 + 1/(4x)。", "y√(1 + y′²) = √x·√(1 + 1/(4x)) = √(x + 1/4)。", "S = 2π∫₀⁶ √(x + 1/4) dx = (4π/3)(125/8 − 1/8) = 62π/3。"],
      verify: { m: "surfaceScalar", surface: { x: "u^2", y: "u\\cos v", z: "u\\sin v", u: [0, "\\sqrt{6}"], v: [0, "2\\pi"] } } },
    { id: "cg-5c-002", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=x^3\\ (0\\le x\\le 1)\\text{ 繞 }x\\text{ 軸旋轉，求旋轉曲面的面積}",
      answer: "pi*(10*sqrt(10)-1)/27", timeLimit: 150,
      tags: ["surface-area-formula", "surface-area", "u-substitution"],
      hints: ["S = 2π∫ x³ √(1 + 9x⁴) dx。", "令 u = 1 + 9x⁴，du 剛好帶出 x³。"],
      solution: "y′ = 3x²。S = 2π∫₀¹x³√(1 + 9x⁴)dx，令 u = 1 + 9x⁴：= (2π/36)∫₁¹⁰√u du = (π/18)(2/3)(10√10 − 1) = π(10√10 − 1)/27。",
      solutionSteps: ["y′ = 3x²，S = 2π∫₀¹ x³√(1 + 9x⁴) dx。", "u = 1 + 9x⁴，du = 36x³ dx：S = (π/18)∫₁¹⁰ u^{1/2} du。", "= (π/18)(2/3)(10√10 − 1) = π(10√10 − 1)/27 ≈ 3.563。"],
      verify: { m: "surfaceScalar", surface: { x: "u", y: "u^3\\cos v", z: "u^3\\sin v", u: [0, 1], v: [0, "2\\pi"] } } },
    { id: "cg-5c-003", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=\\frac{e^x+e^{-x}}{2}\\ (0\\le x\\le \\ln 2)\\text{ 繞 }x\\text{ 軸旋轉，求旋轉曲面的面積}",
      answer: "pi*(log(2)+15/16)", timeLimit: 150,
      tags: ["surface-area-formula", "surface-area", "hyperbolic"],
      hints: ["y = cosh x，1 + (y′)² = 1 + sinh²x = cosh²x。", "cosh²x = (1 + cosh 2x)/2。"],
      solution: "√(1 + y′²) = cosh x，S = 2π∫₀^{ln2}cosh²x dx = π[x + sinh 2x/2]₀^{ln2}。sinh(2 ln 2) = (4 − 1/4)/2 = 15/8，S = π(ln 2 + 15/16)。",
      solutionSteps: ["y = cosh x，y′ = sinh x，√(1 + sinh²x) = cosh x。", "S = 2π∫₀^{ln 2} cosh²x dx = π∫₀^{ln 2} (1 + cosh 2x) dx = π[x + sinh(2x)/2]₀^{ln 2}。", "sinh(2 ln 2) = (4 − 1/4)/2 = 15/8，S = π(ln 2 + 15/16) ≈ 5.123。"],
      verify: { m: "surfaceScalar", surface: { x: "u", y: "\\frac{e^u+e^{-u}}{2}\\cos v", z: "\\frac{e^u+e^{-u}}{2}\\sin v", u: [0, "\\ln 2"], v: [0, "2\\pi"] } } },
    { id: "cg-5c-004", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=x^2\\ (0\\le x\\le \\sqrt{2})\\text{ 繞 }y\\text{ 軸旋轉，求旋轉曲面的面積}",
      answer: "13*pi/3", timeLimit: 150,
      tags: ["surface-area-y-axis", "surface-area", "u-substitution"],
      hints: ["繞 y 軸時，圓圈的半徑是 x，所以 S = 2π∫ x ds。", "ds = √(1 + (2x)²) dx，令 u = 1 + 4x²。"],
      solution: "S = 2π∫₀^√2 x√(1 + 4x²)dx，u = 1 + 4x²：= (π/4)∫₁⁹√u du = (π/4)(2/3)(27 − 1) = 13π/3。",
      solutionSteps: ["繞 y 軸：半徑 x，S = 2π∫₀^{√2} x√(1 + 4x²) dx。", "u = 1 + 4x²，du = 8x dx：S = (π/4)∫₁⁹ u^{1/2} du。", "= (π/4)(2/3)(27 − 1) = 13π/3。"],
      verify: { m: "surfaceScalar", surface: { x: "u\\cos v", y: "u^2", z: "u\\sin v", u: [0, "\\sqrt{2}"], v: [0, "2\\pi"] } } },
    { id: "cg-5c-005", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{曲線 }y=\\frac{2}{3}x^{3/2}\\ (0\\le x\\le 3)\\text{ 繞 }y\\text{ 軸旋轉，求旋轉曲面的面積}",
      answer: "232*pi/15", timeLimit: 150,
      tags: ["surface-area-y-axis", "surface-area", "u-substitution"],
      hints: ["y′ = √x，所以 ds = √(1 + x) dx；繞 y 軸的半徑是 x。", "∫ x√(1 + x) dx：令 w = 1 + x。"],
      solution: "S = 2π∫₀³x√(1 + x)dx，w = 1 + x：∫₁⁴(w − 1)√w dw = [2w^{5/2}/5 − 2w^{3/2}/3]₁⁴ = 116/15。S = 232π/15。",
      solutionSteps: ["y′ = x^{1/2}，ds = √(1 + x) dx；S = 2π∫₀³ x√(1 + x) dx。", "w = 1 + x：∫₁⁴ (w^{3/2} − w^{1/2}) dw = (64/5 − 16/3) − (2/5 − 2/3) = 116/15。", "S = 2π·116/15 = 232π/15。"],
      verify: { m: "surfaceScalar", surface: { x: "u\\cos v", y: "\\frac{2}{3}u^{3/2}", z: "u\\sin v", u: [0, 3], v: [0, "2\\pi"] } } },

    /* ── 5D 平均值：積分均值定理的 c ── */
    { id: "cg-5d-001", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "f(x)=\\sqrt{x}\\text{ 在 }[0,9]\\text{ 上，求 }c\\,\\text{，使 }\\,f(c)\\text{ 等於此函數在這一段的平均值}",
      answer: "4", timeLimit: 90,
      tags: ["average-value-mvt-c", "average-value", "mean-value-theorem"],
      hints: ["平均值 = (1/(b − a))∫ₐᵇ f(x) dx。", "算出平均值後，解 √c = 平均值。"],
      solution: "平均值 = (1/9)∫₀⁹√x dx = (1/9)(2/3)(27) = 2。√c = 2 ⇒ c = 4，在 [0,9] 內。",
      solutionSteps: ["∫₀⁹ √x dx = (2/3)·27 = 18，平均值 = 18/9 = 2。", "√c = 2 ⇒ c = 4（落在 [0, 9] 內）。"],
      verify: { m: "root", f: "\\sqrt{x}-\\frac{1}{9}\\int_0^9\\sqrt{t}\\,dt", x0: 3 } },
    { id: "cg-5d-002", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f(x)=e^x\\text{ 在 }[0,2]\\text{ 上，求 }c\\,\\text{，使 }\\,f(c)\\text{ 等於此函數在這一段的平均值}",
      answer: "log((e^2-1)/2)", timeLimit: 120,
      tags: ["average-value-mvt-c", "average-value", "mean-value-theorem"],
      hints: ["先算平均值 (1/2)∫₀² eˣ dx。", "解 e^c = 平均值，兩邊取自然對數。"],
      solution: "平均值 = (e² − 1)/2 ≈ 3.195。e^c = (e² − 1)/2 ⇒ c = ln((e² − 1)/2) ≈ 1.161，在 [0,2] 內。",
      solutionSteps: ["平均值 = (1/2)∫₀² eˣ dx = (e² − 1)/2。", "e^c = (e² − 1)/2 ⇒ c = ln((e² − 1)/2) ≈ 1.161。"],
      verify: { m: "root", f: "e^x-\\frac{1}{2}\\int_0^2 e^t\\,dt", x0: 1 } },

    /* ── 5D 功：變力、抽水 ── */
    { id: "cg-5d-003", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\text{物體沿 }x\\text{ 軸從 }x=1\\text{ 移到 }x=3\\text{（公尺），受力 }F(x)=\\frac{6}{x^2}\\text{（牛頓）。求這個力作的功（焦耳）}",
      answer: "4", timeLimit: 60,
      tags: ["work-variable-force", "work", STORY],
      hints: ["力隨位置改變時，功 = ∫ F(x) dx。", "6/x² 的反導函數是 −6/x。"],
      solution: "W = ∫₁³ 6/x² dx = [−6/x]₁³ = −2 + 6 = 4 焦耳。",
      solutionSteps: ["W = ∫₁³ 6x⁻² dx = [−6/x]₁³。", "= −2 − (−6) = 4（焦耳）。"],
      verify: { m: "integral", f: "\\frac{6}{x^2}", a: 1, b: 3 } },
    { id: "cg-5d-004", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{物體沿 }x\\text{ 軸從 }x=0\\text{ 移到 }x=3\\text{（公尺），受力 }F(x)=4\\sin\\frac{\\pi x}{6}\\text{（牛頓）。求這個力作的功（焦耳）}",
      answer: "24/pi", timeLimit: 90,
      tags: ["work-variable-force", "work", STORY],
      hints: ["功 = ∫₀³ F(x) dx。", "∫ sin(kx) dx = −cos(kx)/k，這裡 k = π/6。"],
      solution: "W = ∫₀³ 4 sin(πx/6)dx = (24/π)[−cos(πx/6)]₀³ = (24/π)(0 + 1) = 24/π ≈ 7.64 焦耳。",
      solutionSteps: ["W = 4∫₀³ sin(πx/6) dx = 4·(6/π)[−cos(πx/6)]₀³。", "cos(π/2) = 0、cos 0 = 1：W = (24/π)(1) = 24/π ≈ 7.64（焦耳）。"],
      verify: { m: "integral", f: "4\\sin\\frac{\\pi x}{6}", a: 0, b: 3 } },
    { id: "cg-5d-005", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{物體沿 }x\\text{ 軸從 }x=0\\text{ 移到 }x=3\\text{（公尺），受力 }F(x)=\\frac{20x}{x^2+1}\\text{（牛頓）。求這個力作的功（焦耳）}",
      answer: "10*log(10)", timeLimit: 90,
      tags: ["work-variable-force", "work", "u-substitution"],
      hints: ["功 = ∫₀³ F(x) dx。", "分子 20x 是分母 x² + 1 導數的 10 倍。"],
      solution: "W = ∫₀³ 20x/(x² + 1)dx = 10[ln(x² + 1)]₀³ = 10 ln 10 ≈ 23.03 焦耳。",
      solutionSteps: ["令 u = x² + 1，du = 2x dx：∫ 20x/(x² + 1) dx = 10 ln(x² + 1)。", "W = 10(ln 10 − ln 1) = 10 ln 10 ≈ 23.03（焦耳）。"],
      verify: { m: "integral", f: "\\frac{20x}{x^2+1}", a: 0, b: 3 } },
    { id: "cg-5d-006", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{圓錐形水槽頂點朝下，槽口半徑 }2\\text{ m、深 }4\\text{ m，裝滿水。把水全部從槽口抽出需作多少功（焦耳）？取 }\\rho g=9800\\text{ N/m}^3\\text{，答案保留 }\\pi",
      answer: "156800*pi/3", timeLimit: 180,
      tags: ["work-pumping", "work", STORY],
      hints: ["從頂點往上量高度 y：那一層水的半徑用相似三角形，r = y/2。", "那一層要升高 4 − y 到槽口。"],
      solution: "高度 y 的薄層體積 π(y/2)²dy、升高 4 − y。W = 9800π∫₀⁴(y²/4)(4 − y)dy = 9800π·(1/4)(256/3 − 64) = 9800π·16/3 = 156800π/3 ≈ 1.642×10⁵ J。",
      solutionSteps: ["相似三角形：r/y = 2/4 ⇒ r = y/2，薄層體積 π y²/4 dy。", "W = ∫₀⁴ 9800·π(y²/4)·(4 − y) dy = 2450π∫₀⁴ (4y² − y³) dy。", "= 2450π(256/3 − 64) = 2450π·64/3 = 156800π/3（焦耳）。"],
      verify: { m: "double", u: "y", v: "r", f: "9800(4-y)\\cdot 2\\pi r", a: 0, b: 4, c: 0, d: "\\frac{y}{2}" } },
    { id: "cg-5d-007", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\text{半徑 }2\\text{ m 的球形水槽裝了一半的水（水面在球心高度）。把水全部從一根高出槽頂 }1\\text{ m 的出水口抽出需作多少功（焦耳）？取 }\\rho g=9800\\text{ N/m}^3\\text{，答案保留 }\\pi",
      answer: "196000*pi", timeLimit: 240,
      tags: ["work-pumping", "work", STORY],
      hints: ["以球心為原點、往上為正：水在 −2 ≤ y ≤ 0，高度 y 的那一層半徑是 √(4 − y²)。", "出水口在 y = 3，那一層要升高 3 − y。"],
      solution: "W = 9800π∫₋₂⁰(4 − y²)(3 − y)dy = 9800π[12y − 2y² − y³ + y⁴/4]₋₂⁰ = 9800π·20 = 196000π ≈ 6.16×10⁵ J。",
      solutionSteps: ["球心為原點：薄層面積 π(4 − y²)，水在 −2 ≤ y ≤ 0；出水口 y = 2 + 1 = 3，升高 3 − y。", "W = 9800π∫₋₂⁰ (4 − y²)(3 − y) dy = 9800π∫₋₂⁰ (12 − 4y − 3y² + y³) dy。", "= 9800π[0 − (−24 − 8 + 8 + 4)] = 9800π·20 = 196000π（焦耳）。"],
      verify: { m: "double", u: "y", v: "r", f: "9800(3-y)\\cdot 2\\pi r", a: -2, b: 0, c: 0, d: "\\sqrt{4-y^2}" } },

    /* ── 5D 彈簧：先把長度換成伸長量 ── */
    { id: "cg-5d-008", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{彈簧自然長度 }25\\text{ cm，用 }30\\text{ N 的力可以把它維持在 }31\\text{ cm 長（遵守 Hooke 定律）。把它從 }27\\text{ cm 拉到 }33\\text{ cm 需作多少功（焦耳）？}",
      answer: "1.5", timeLimit: 100,
      tags: ["spring-natural-length", "work", STORY],
      hints: ["Hooke 定律的 x 是「離開自然長度的伸長量」，而且要換成公尺。", "先由 30 N 對應的伸長量求 k，再積分 kx。"],
      solution: "伸長 0.06 m 時 30 N ⇒ k = 500 N/m。27→33 cm 對應伸長 0.02→0.08 m。W = ∫ 500x dx = 250(0.0064 − 0.0004) = 1.5 J。",
      solutionSteps: ["31 − 25 = 6 cm = 0.06 m，k = 30/0.06 = 500 N/m。", "27 cm、33 cm 對應伸長 x = 0.02、0.08 m。", "W = ∫₀.₀₂^{0.08} 500x dx = 250(0.08² − 0.02²) = 1.5（焦耳）。"],
      verify: { m: "integral", f: "\\frac{30}{0.31-0.25}(x-0.25)", a: 0.27, b: 0.33 } },
    { id: "cg-5d-009", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{彈簧自然長度 }26\\text{ cm，維持在 }30\\text{ cm 長需要 }12\\text{ N 的力（遵守 Hooke 定律）。把它從 }30\\text{ cm 拉到 }38\\text{ cm 需作多少功（焦耳）？}",
      answer: "1.92", timeLimit: 100,
      tags: ["spring-natural-length", "work", STORY],
      hints: ["起點 30 cm 不是自然長度：積分的下限是伸長量 0.04 m，不是 0。", "k = 力 ÷ 伸長量（公尺）。"],
      solution: "k = 12/0.04 = 300 N/m。30→38 cm 對應伸長 0.04→0.12 m。W = 150(0.0144 − 0.0016) = 1.92 J。",
      solutionSteps: ["30 − 26 = 4 cm = 0.04 m，k = 12/0.04 = 300 N/m。", "伸長量從 0.04 m 到 0.12 m。", "W = ∫₀.₀₄^{0.12} 300x dx = 150(0.0144 − 0.0016) = 1.92（焦耳）。"],
      verify: { m: "integral", f: "\\frac{12}{0.30-0.26}(x-0.26)", a: 0.30, b: 0.38 } },

    /* ── 5D 液體壓力 ── */
    { id: "cg-5d-010", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{寬 }3\\text{ m、高 }2\\text{ m 的矩形板直立在水中，上緣貼著水面。求板一面受的水壓力（N），取 }\\rho g=9800\\text{ N/m}^3",
      answer: "58800", timeLimit: 90,
      tags: ["fluid-force-integral", STORY, "definite-integral"],
      hints: ["深度 h 處的壓強是 ρgh，那條水平細帶面積是 3 dh。", "F = ∫₀² ρg·h·3 dh。"],
      solution: "F = ∫₀² 9800·h·3 dh = 29400·[h²/2]₀² = 29400·2 = 58800 N。",
      solutionSteps: ["深度 h 的細帶：壓強 9800h、面積 3 dh。", "F = ∫₀² 9800·3h dh = 29400·2 = 58800（N）。"],
      verify: { m: "double", u: "h", v: "w", f: "9800h", a: 0, b: 2, c: 0, d: 3 } },
    { id: "cg-5d-011", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{寬 }4\\text{ m、高 }1\\text{ m 的矩形閘門直立在水中，上緣在水面下 }2\\text{ m。求閘門一面受的水壓力（N），取 }\\rho g=9800\\text{ N/m}^3",
      answer: "98000", timeLimit: 90,
      tags: ["fluid-force-integral", STORY, "definite-integral"],
      hints: ["深度從上緣量起：h 的範圍是 2 到 3，不是 0 到 1。", "每條細帶受力 ρg·h·4 dh。"],
      solution: "F = ∫₂³ 9800·h·4 dh = 39200·(9 − 4)/2 = 39200·2.5 = 98000 N。",
      solutionSteps: ["閘門佔深度 2 ≤ h ≤ 3，細帶寬 4。", "F = ∫₂³ 9800·4h dh = 39200·[h²/2]₂³ = 39200·2.5 = 98000（N）。"],
      verify: { m: "double", u: "h", v: "w", f: "9800h", a: 2, b: 3, c: 0, d: 4 } },
    { id: "cg-5d-012", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{長方體水族箱裝滿水，水深 }1.5\\text{ m；一側端壁寬 }1.2\\text{ m。求這面端壁受的水壓力（N），取 }\\rho g=9800\\text{ N/m}^3",
      answer: "13230", timeLimit: 90,
      tags: ["fluid-force-integral", STORY, "definite-integral"],
      hints: ["端壁是上緣貼著水面的直立矩形：寬 1.2、深 0 到 1.5。", "F = ∫ ρg·h·（寬）dh。"],
      solution: "F = ∫₀^{1.5} 9800·h·1.2 dh = 11760·(1.5²/2) = 11760·1.125 = 13230 N。",
      solutionSteps: ["細帶：壓強 9800h、面積 1.2 dh，0 ≤ h ≤ 1.5。", "F = 11760∫₀^{1.5} h dh = 11760·1.125 = 13230（N）。"],
      verify: { m: "double", u: "h", v: "w", f: "9800h", a: 0, b: 1.5, c: 0, d: 1.2 } },
    { id: "cg-5d-013", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{等腰三角形板直立在水中，頂點朝上貼著水面，底邊長 }3\\text{ m、在水面下 }2\\text{ m 處保持水平。求板一面受的水壓力（N），取 }\\rho g=9800\\text{ N/m}^3",
      answer: "39200", timeLimit: 150,
      tags: ["fluid-strip-width", STORY, "similar-triangles"],
      hints: ["頂點在水面，越往下越寬：用相似三角形寫深度 h 處的寬度。", "寬度與深度成正比：h = 2 時寬度是底邊長。"],
      solution: "w(h) = 3h/2。F = 9800∫₀²h·(3h/2)dh = 9800·(3/2)·(8/3) = 39200 N。",
      solutionSteps: ["相似三角形：w(h)/h = 3/2，深度 h 處寬 w(h) = (3/2)h。", "F = ∫₀² 9800·h·(3h/2) dh = 14700·[h³/3]₀² = 14700·8/3 = 39200（N）。"],
      verify: { m: "double", u: "h", v: "w", f: "9800h", a: 0, b: 2, c: "-\\frac{3h}{4}", d: "\\frac{3h}{4}" } },
    { id: "cg-5d-014", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{水壩迎水面是直立的等腰梯形：水面處寬 }40\\text{ m、底部寬 }20\\text{ m、水深 }10\\text{ m（水剛好到壩頂）。求壩面受的水壓力（N），取 }\\rho g=9800\\text{ N/m}^3",
      answer: "39200000/3", timeLimit: 180,
      tags: ["fluid-strip-width", STORY, "similar-triangles"],
      hints: ["寬度隨深度線性遞減：h = 0 時 40、h = 10 時 20。", "w(h) = 40 − 2h，再積 ρg·h·w(h)。"],
      solution: "w(h) = 40 − 2h。F = 9800∫₀¹⁰h(40 − 2h)dh = 9800(2000 − 2000/3) = 9800·4000/3 = 39200000/3 ≈ 1.307×10⁷ N。",
      solutionSteps: ["寬度線性：w(0) = 40、w(10) = 20 ⇒ w(h) = 40 − 2h。", "F = 9800∫₀¹⁰ (40h − 2h²) dh = 9800(2000 − 2000/3)。", "= 9800·4000/3 = 39200000/3 ≈ 1.307×10⁷（N）。"],
      verify: { m: "double", u: "h", v: "w", f: "9800h", a: 0, b: 10, c: "-(20-h)", d: "20-h" } },
    { id: "cg-5d-015", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{半徑 }2\\text{ m 的半圓形板直立在水中，直徑貼著水面、圓弧朝下。求板一面受的水壓力（N），取 }\\rho g=9800\\text{ N/m}^3",
      answer: "156800/3", timeLimit: 180,
      tags: ["fluid-strip-width", STORY, "u-substitution"],
      hints: ["以直徑中點為原點、深度 h 往下：細帶的半寬由畢氏定理得 √(4 − h²)。", "∫ h√(4 − h²) dh 用代換 u = 4 − h²。"],
      solution: "w(h) = 2√(4 − h²)。F = 9800∫₀²2h√(4 − h²)dh = 9800·(2/3)·8 = 156800/3 ≈ 52267 N。",
      solutionSteps: ["深度 h 處細帶寬 w(h) = 2√(4 − h²)。", "F = 9800∫₀² 2h√(4 − h²) dh；u = 4 − h²：∫₀² 2h√(4 − h²) dh = (2/3)·4^{3/2} = 16/3。", "F = 9800·16/3 = 156800/3 ≈ 52267（N）。"],
      verify: { m: "double", u: "h", v: "w", f: "9800h", a: 0, b: 2, c: "-\\sqrt{4-h^2}", d: "\\sqrt{4-h^2}" } },
    { id: "cg-5d-016", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\text{面積 }0.5\\text{ m}^2\\text{ 的平板水平放在水面下 }4\\text{ m 處。求板的上表面受的水壓力（N），取 }\\rho g=9800\\text{ N/m}^3",
      answer: "19600", timeLimit: 60,
      tags: ["fluid-pressure-depth", STORY],
      hints: ["水平板上每一點深度都一樣，壓強是常數 ρgh。", "力 = 壓強 × 面積，不用積分。"],
      solution: "壓強 = 9800·4 = 39200 Pa，力 = 39200·0.5 = 19600 N。",
      solutionSteps: ["深度 4 m 處壓強 p = ρgh = 9800·4 = 39200 Pa。", "F = pA = 39200·0.5 = 19600（N）。"],
      verify: { m: "value", f: "9800\\cdot 4\\cdot 0.5" } },

    /* ── 5D 質心與形心 ── */
    { id: "cg-5d-017", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\text{質量 }4\\text{、}1\\text{、}3\\text{ 的質點分別放在數線上的 }x=-2\\text{、}3\\text{、}6\\text{。求質心的位置}",
      answer: "13/8", timeLimit: 60,
      tags: ["com-point-masses", "centroid"],
      hints: ["質心 = Σ mᵢxᵢ ÷ Σ mᵢ。", "注意 x = −2 那一項的乘積是負的。"],
      solution: "Σ mx = −8 + 3 + 18 = 13，Σ m = 8，x̄ = 13/8。",
      solutionSteps: ["Σ mᵢxᵢ = 4(−2) + 1(3) + 3(6) = 13。", "Σ mᵢ = 8，x̄ = 13/8。"],
      verify: { m: "value", f: "\\frac{4(-2)+1\\cdot 3+3\\cdot 6}{4+1+3}" } },
    { id: "cg-5d-018", topic: "integrals", rank: 1, answerKind: "numeric",
      prompt: "\\text{平面上質量 }2\\text{、}3\\text{、}5\\text{ 的質點分別在 }(1,0)\\text{、}(0,2)\\text{、}(-1,-1)\\text{。求質心的 }y\\text{ 坐標 }\\bar{y}",
      answer: "1/10", timeLimit: 60,
      tags: ["com-point-masses", "centroid"],
      hints: ["ȳ 只用到各點的 y 坐標：Σ mᵢyᵢ ÷ Σ mᵢ。", "總質量是 10。"],
      solution: "Σ my = 2·0 + 3·2 + 5·(−1) = 1，Σ m = 10，ȳ = 1/10。",
      solutionSteps: ["Σ mᵢyᵢ = 0 + 6 − 5 = 1。", "ȳ = 1/10。"],
      verify: { m: "value", f: "\\frac{2\\cdot 0+3\\cdot 2+5(-1)}{2+3+5}" } },
    { id: "cg-5d-019", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求曲線 }y=\\sqrt{x}\\text{ 與 }y=x^2\\text{ 所圍區域（均勻薄板）形心的 }\\bar{y}",
      answer: "9/20", timeLimit: 150,
      tags: ["com-centroid-y", "centroid", "between-curves"],
      hints: ["ȳ = (1/A)∫ (1/2)[f(x)² − g(x)²] dx，是平方相減，不是相減後平方。", "先算面積 A，交點 x = 0, 1。"],
      solution: "A = ∫₀¹(√x − x²)dx = 1/3。M_x = (1/2)∫₀¹(x − x⁴)dx = (1/2)(3/10) = 3/20。ȳ = (3/20)/(1/3) = 9/20。",
      solutionSteps: ["A = ∫₀¹ (√x − x²) dx = 2/3 − 1/3 = 1/3。", "M_x = ∫₀¹ (1/2)[(√x)² − (x²)²] dx = (1/2)(1/2 − 1/5) = 3/20。", "ȳ = M_x / A = (3/20)·3 = 9/20。"],
      verify: { m: "value", f: "\\frac{\\int_0^1\\int_{x^2}^{\\sqrt{x}}y\\,dy\\,dx}{\\int_0^1\\int_{x^2}^{\\sqrt{x}}1\\,dy\\,dx}" } },
    { id: "cg-5d-020", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求直線 }y=3\\text{ 與曲線 }y=x^2-1\\text{ 所圍區域（均勻薄板）形心的 }\\bar{y}",
      answer: "7/5", timeLimit: 150,
      tags: ["com-centroid-y", "centroid", "between-curves"],
      hints: ["下緣 g(x) = x² − 1 不是 0：M_x = ∫ (1/2)[3² − (x² − 1)²] dx。", "交點 x = ±2；面積先算出來。"],
      solution: "A = ∫₋₂²(4 − x²)dx = 32/3。M_x = (1/2)∫₋₂²[9 − (x² − 1)²]dx = (1/2)∫₋₂²(8 + 2x² − x⁴)dx = 224/15。ȳ = (224/15)/(32/3) = 7/5。",
      solutionSteps: ["交點 x² − 1 = 3 ⇒ x = ±2；A = ∫₋₂² (4 − x²) dx = 32/3。", "M_x = (1/2)∫₋₂² [9 − (x² − 1)²] dx = (1/2)∫₋₂² (8 + 2x² − x⁴) dx = 16 + 16/3 − 32/5 = 224/15。", "ȳ = (224/15)/(32/3) = 7/5。"],
      verify: { m: "value", f: "\\frac{\\int_{-2}^{2}\\int_{x^2-1}^{3}y\\,dy\\,dx}{\\int_{-2}^{2}\\int_{x^2-1}^{3}1\\,dy\\,dx}" } }
  ];
  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE, difficulty: Math.min(4, problem.rank), ...problem })));
})();
