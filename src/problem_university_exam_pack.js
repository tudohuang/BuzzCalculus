(function () {
  "use strict";

  const SOURCE = "Original university transfer/exemption/midterm style pack 2026";
  const problems = [];
  // 輸入格式說明不是提示（app 已經用 formatHelp 在講），
  // 而且買第二條提示要扣 6+rank×2 分 —— 不能收了分數卻什麼都沒說。
  const HINTS = [
    "先判型：這題刻意混合轉學考、免修考、段考常見技巧。"
  ];

  function add(problem) {
    problems.push({
      source: SOURCE,
      difficulty: 4,
      rank: 6,
      timeLimit: 240,
      tabLimit: 1,
      hints: HINTS,
      ...problem,
      tags: Array.from(new Set([
        ...(problem.tags || []),
        "exam-style",
        "transfer-exam",
        "proficiency-exam",
        "midterm-style",
        "university-exam-style"
      ]))
    });
  }

  function numeric(id, topic, prompt, answer, tags, solution, timeLimit = 210) {
    add({ id, topic, prompt, answerKind: "numeric", answer, tags, solution, timeLimit });
  }

  function expression(id, topic, prompt, answer, variable, tags, solution, timeLimit = 210) {
    add({
      id,
      topic,
      prompt,
      answerKind: "expression",
      answer,
      variable,
      variables: Array.isArray(variable) ? variable : undefined,
      tags,
      solution,
      timeLimit
    });
  }

  function antiderivative(id, prompt, answer, tags, solution, timeLimit = 240) {
    add({
      id,
      topic: "integrals",
      prompt,
      answerKind: "antiderivative",
      answer,
      variable: "x",
      tags,
      solution,
      timeLimit
    });
  }

  [
    ["uni-lim-001", "\\lim_{x\\to0}\\frac{\\sin x-x+\\frac{x^3}{6}}{x^5}", "1/120", ["taylor", "trig-limit"], "Keep the x^5 term of sin x."],
    ["uni-lim-002", "\\lim_{x\\to0}\\frac{\\ln(1+x)-x+\\frac{x^2}{2}-\\frac{x^3}{3}}{x^4}", "-1/4", ["taylor", "log"], "Use the fourth term of log(1+x)."],
    ["uni-lim-003", "\\lim_{x\\to0}\\frac{e^{x^2}-\\cos x}{x^2}", "3/2", ["taylor", "exponential", "trig-limit"], "Compare the x^2 coefficients."],
    ["uni-lim-005", "\\lim_{x\\to0}\\frac{\\sqrt{1+x}-\\sqrt{1-x}-x}{x^3}", "1/8", ["taylor", "radical"], "Odd terms remain after subtracting the two radicals."],
    ["uni-lim-006", "\\lim_{x\\to\\infty}x\\left((x+1)\\ln\\left(1+\\frac{1}{x}\\right)-1\\right)", "1/2", ["log-limit", "infinity-limit"], "Put y=1/x and expand (1/y+1)log(1+y)."],
    ["uni-lim-007", "\\lim_{x\\to0}\\frac{\\sin(2x)-2\\sin x}{x^3}", "-1", ["taylor", "trig-limit"], "The cubic term is the first nonzero term."],
    ["uni-lim-008", "\\lim_{x\\to0}\\frac{(1+3x)^{1/x}-e^3}{x}", "-9*exp(3)/2", ["log-limit", "exponential-limit"], "Expand x^{-1}log(1+3x) through the linear term."],
    ["uni-lim-009", "\\lim_{x\\to0}\\frac{\\cosh x-\\cos x}{x^2}", "1", ["taylor", "hyperbolic"], "cosh x and cos x have opposite x^2 coefficients."],
    ["uni-lim-010", "\\lim_{x\\to0}\\frac{\\arctan x-\\arcsin x}{x^3}", "-1/2", ["taylor", "inverse-trig"], "Compare arctan x and arcsin x cubic terms."],
    ["uni-lim-011", "\\lim_{x\\to0}\\frac{\\ln(1+\\sin x)-x}{x^2}", "-1/2", ["taylor", "log", "trig-limit"], "Only the quadratic term is needed."],
    ["uni-lim-012", "\\lim_{x\\to0}\\frac{e^x-1-x}{1-\\cos x}", "1", ["taylor", "exponential-limit", "trig-limit"], "Both numerator and denominator start at x^2/2."],
    ["uni-lim-014", "\\lim_{x\\to0}\\frac{\\frac{1}{\\sqrt{1+x^2}}-\\cos x}{x^4}", "1/3", ["taylor", "radical", "trig-limit"], "Compare fourth-order coefficients."],
  ].forEach(([id, prompt, answer, tags, solution]) => numeric(id, "limits", prompt, answer, tags, solution));

  [
    ["uni-der-001", "\\frac{d}{dx}\\left(x^{\\cos x}\\right)", "x^cos(x)*(-sin(x)*log(x)+cos(x)/x)", "x", ["log-differentiation", "trig"], "Use log differentiation."],
    ["uni-der-002", "\\frac{d}{dx}\\left((\\sin x)^x\\right)", "sin(x)^x*(log(sin(x))+x*cot(x))", "x", ["log-differentiation", "trig"], "Differentiate x log(sin x)."],
    ["uni-der-003", "\\left.\\frac{d^3}{dx^3}\\left(e^{2x}\\sin x\\right)\\right|_{x=0}", "11", ["higher-derivative", "exponential", "trig"], "Use the imaginary part of (2+i)^3."],
    ["uni-der-004", "\\left.\\frac{d^4}{dx^4}\\left(x^2e^x\\right)\\right|_{x=0}", "12", ["higher-derivative", "taylor"], "Read the x^4 coefficient of x^2 e^x."],
    ["uni-der-005", "\\frac{d^2}{dx^2}\\ln\\left(x+\\sqrt{1+x^2}\\right)", "-x/(1+x^2)^(3/2)", "x", ["higher-derivative", "log", "radical"], "First derivative is 1/sqrt(1+x^2)."],
    ["uni-der-006", "\\frac{d}{dx}\\left(\\int_0^{\\sin x} e^{t^2}\\,dt\\right)", "cos(x)*exp(sin(x)^2)", "x", ["fundamental-theorem", "chain-rule"], "FTC plus chain rule."],
    ["uni-der-007", "\\frac{d}{dx}\\left(\\int_x^{2x}\\ln(1+t^2)\\,dt\\right)", "2*log(1+4*x^2)-log(1+x^2)", "x", ["fundamental-theorem", "chain-rule"], "Differentiate both moving endpoints."],
    ["uni-der-008", "\\frac{d}{dx}\\arctan\\left(\\frac{2x}{1-x^2}\\right)", "2/(1+x^2)", "x", ["inverse-trig", "chain-rule"], "Simplify after applying 1+u^2."],
    ["uni-der-009", "x=t+\\frac{1}{t},\\ y=t-\\frac{1}{t}.\\ \\text{求 }\\left.\\frac{dy}{dx}\\right|_{t=2}", "5/3", ["parametric"], "dy/dx=(1+1/t^2)/(1-1/t^2)."],
    ["uni-der-010", "r=1+\\cos\\theta.\\ \\text{求切線斜率於 }\\theta=\\frac{\\pi}{2}", "1", ["polar-curve", "parametric"], "Use x=r cos theta, y=r sin theta."],
    ["uni-der-011", "x^2+xy+y^2=3.\\ \\text{求 }\\frac{dy}{dx}\\text{ 於 }(1,1)", "-1", ["implicit-differentiation"], "Differentiate implicitly."],
    ["uni-der-012", "\\text{求 }f(x,y)=x^4+y^4-4xy\\text{ 在 }(1,1)\\text{ 的 Hessian determinant}", "128", ["multivariable", "hessian"], "The Hessian is [[12,-4],[-4,12]]."],
    ["uni-der-013", "\\text{在 }x^2+4y^2=8\\text{ 上求 }xy\\text{ 的最大值}", "2", ["lagrange-multiplier"], "The positive critical point is (2,1)."],
    ["uni-der-014", "\\text{求 }f(x,y)=e^{xy}\\text{ 在 }(0,2)\\text{ 沿 }(3/5,4/5)\\text{ 的方向導數}", "6/5", ["multivariable", "directional-derivative"], "grad f(0,2)=(2,0)."],
    ["uni-der-015", "\\nabla\\cdot(xe^y,\\ ye^z,\\ ze^x)", "exp(y)+exp(z)+exp(x)", ["x", "y", "z"], ["multivariable", "nabla", "vector-calculus"], "Add the matching partial derivatives."],
    ["uni-der-016", "\\text{求 }\\nabla\\times(xy,\\ yz,\\ zx)\\text{ 的 }z\\text{-component}", "-x", ["x"], ["multivariable", "nabla", "vector-calculus"], "The z-component is partial_x F_2 - partial_y F_1."],
    ["uni-der-017", "\\frac{d}{dx}\\ln(\\ln(\\ln x))", "1/(x*log(x)*log(log(x)))", "x", ["chain-rule", "log"], "Three nested logs give three denominator factors."],
    ["uni-der-018", "\\frac{d}{dx}\\exp\\left((\\ln x)^3\\right)", "3*log(x)^2*exp(log(x)^3)/x", "x", ["chain-rule", "log", "exponential"], "Differentiate the exponent."],
    ["uni-der-019", "\\left.\\frac{d^5}{dx^5}\\sin(2x)\\right|_{x=0}", "32", ["higher-derivative", "trig"], "The fifth derivative returns a positive sine coefficient 2^5."],
    ["uni-der-020", "\\frac{d}{dx}\\left((1+x^2)^x\\right)", "(1+x^2)^x*(log(1+x^2)+2*x^2/(1+x^2))", "x", ["log-differentiation"], "Use log differentiation."]
  ].forEach(([id, prompt, answer, variable, tags, solution]) => {
    if (variable === "x" || (Array.isArray(variable) && Array.isArray(tags))) expression(id, "derivatives", prompt, answer, variable, tags, solution);
    else numeric(id, "derivatives", prompt, answer, variable, tags);
  });

  [
    ["uni-int-003", "\\int \\frac{\\ln x}{x^2}\\,dx", "-(log(x)+1)/x", ["integration-by-parts", "log"], "Integrate by parts with dv=x^{-2}dx."],
    ["uni-int-004", "\\int \\frac{\\arctan x}{x^2}\\,dx", "-atan(x)/x+log(x)-log(1+x^2)/2", ["integration-by-parts", "inverse-trig"], "After parts, decompose 1/(x(1+x^2))."],
    ["uni-int-005", "\\int x\\sqrt{1+x^2}\\,dx", "(1+x^2)^(3/2)/3", ["substitution", "radical"], "Let u=1+x^2."],
    ["uni-int-006", "\\int \\sin^5x\\cos x\\,dx", "sin(x)^6/6", ["substitution", "trig-integral"], "Let u=sin x."],
    ["uni-int-007", "\\int \\sec^4x\\,dx", "tan(x)+tan(x)^3/3", ["trig-integral"], "Write sec^4 x=(1+tan^2 x)sec^2 x."],
    ["uni-int-009", "\\int \\frac{2x+1}{x^2+x+1}\\,dx", "log(x^2+x+1)", ["substitution", "rational"], "The numerator is the derivative of the denominator."],
    ["uni-int-010", "\\int e^x\\cos x\\,dx", "exp(x)*(sin(x)+cos(x))/2", ["integration-by-parts", "exponential", "trig"], "Use the standard exponential-trig integral."],
    ["uni-int-011", "\\int x^2\\ln x\\,dx", "x^3*log(x)/3-x^3/9", ["integration-by-parts", "log"], "Let u=log x."],
    ["uni-int-012", "\\int x\\arctan x\\,dx", "(x^2+1)*atan(x)/2-x/2", ["integration-by-parts", "inverse-trig"], "Integrate by parts and rewrite x^2/(1+x^2)."]
  ].forEach(([id, prompt, answer, tags, solution]) => antiderivative(id, prompt, answer, tags, solution));

  [
    ["uni-int-013", "\\int_0^1\\frac{x^3}{1+x^2}\\,dx", "1/2-log(2)/2", ["definite-integral", "algebra"], "Rewrite as x - x/(1+x^2)."],
    ["uni-int-014", "\\int_0^\\infty\\frac{1}{(1+x^2)^2}\\,dx", "pi/4", ["improper-integral", "inverse-trig"], "Use x=tan theta or the standard Wallis value."],
    ["uni-int-015", "\\int_0^1 x\\ln(1+x)\\,dx", "1/4", ["definite-integral", "integration-by-parts"], "Integrate by parts; the remaining rational integral cancels log terms."],
    ["uni-int-016", "\\int_0^{\\pi/2}\\sin^3x\\cos^2x\\,dx", "2/15", ["definite-integral", "beta-function", "trig-integral"], "Use the beta integral."],
    ["uni-int-018", "\\int_0^\\infty xe^{-x^2}\\,dx", "1/2", ["improper-integral", "substitution"], "Let u=x^2."],
    ["uni-int-020", "\\int_0^1\\frac{1}{1+x+x^2}\\,dx", "pi/(3*sqrt(3))", ["definite-integral", "inverse-trig"], "Complete the square."],
    ["uni-int-023", "\\text{求參數曲線 }x=2\\cos t,\\ y=3\\sin t\\text{ 所圍面積}", "6*pi", ["parametric", "area"], "This is an ellipse with semiaxes 2 and 3."],
    ["uni-int-025", "\\int_0^\\infty\\frac{1}{x^2+4}\\,dx", "pi/4", ["improper-integral", "inverse-trig"], "Use the arctangent antiderivative."]
  ].forEach(([id, prompt, answer, tags, solution]) => numeric(id, "integrals", prompt, answer, tags, solution, 240));

  [
    ["uni-ser-001", "\\sum_{n=1}^{\\infty}\\frac{n}{4^n}", "4/9", ["sum-series", "power-series"], "Use sum n r^n=r/(1-r)^2."],
    ["uni-ser-004", "\\text{求 }x^8\\text{ 在 }\\sin(x^2)\\text{ 的係數}", "0", ["taylor", "coefficient"], "sin(x^2) only has powers x^{4k+2}."],
    ["uni-ser-005", "\\text{求 }x^6\\text{ 在 }e^x\\cos x\\text{ 的係數}", "0", ["taylor", "coefficient"], "Use Re((1+i)^6/6!)."],
    ["uni-ser-006", "\\text{求 }x^5\\text{ 在 }x^2\\ln(1+x)\\text{ 的係數}", "1/3", ["taylor", "coefficient"], "This is the x^3 coefficient of log(1+x)."],
    ["uni-ser-007", "\\text{收斂半徑： }\\sum_{n=1}^{\\infty}\\frac{n^2}{5^n}x^n", "5", ["power-series", "radius"], "The nth root of n^2/5^n is 1/5."],
    ["uni-ser-008", "\\text{收斂半徑： }\\sum_{n=1}^{\\infty}\\frac{(n!)^2}{(2n)!}x^n", "4", ["power-series", "radius", "root-test"], "Use the central binomial coefficient growth."],
    ["uni-ser-009", "\\text{收斂半徑： }\\sum_{n=1}^{\\infty}\\frac{n^n}{n!}x^n", "1/e", ["power-series", "radius", "root-test"], "Stirling gives nth root asymptotic to e."],
    ["uni-ser-010", "\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{2n+1}", "pi/4", ["taylor", "alternating-series", "sum-series"], "This is arctan(1)."],
    ["uni-ser-012", "\\sum_{n=0}^{\\infty}\\frac{n(n-1)}{2^n}", "4", ["sum-series", "power-series"], "Use the second derivative of the geometric series."],
    ["uni-ser-013", "\\text{求 }x^4\\text{ 在 }\\frac{1}{(1-x)^3}\\text{ 的係數}", "15", ["coefficient", "binomial"], "The coefficient is C(6,2)."],
    ["uni-ser-014", "\\text{收斂半徑： }\\sum_{n=1}^{\\infty}\\frac{3^n}{n^2}(x-1)^n", "1/3", ["power-series", "radius"], "The nth root of 3^n/n^2 is 3."],
    ["uni-ser-015", "\\sum_{n=1}^{\\infty}(-1)^{n+1}\\frac{n}{2^n}", "2/9", ["sum-series", "alternating-series"], "Use r/(1-r)^2 with r=-1/2 and adjust the sign."],
    ["uni-ser-016", "\\text{求 }x^7\\text{ 在 }\\sin x\\cos x\\text{ 的係數}", "-4/315", ["taylor", "coefficient", "trig"], "Use sin x cos x=(1/2)sin(2x)."],
    ["uni-ser-018", "\\text{求 }x^6\\text{ 在 }(1+x)^{10}\\text{ 的係數}", "210", ["coefficient", "binomial"], "This is C(10,6)."],
    ["uni-ser-019", "\\text{收斂半徑： }\\sum_{n=1}^{\\infty}\\frac{x^n}{\\sqrt n}", "1", ["power-series", "radius"], "The nth root of 1/sqrt(n) tends to 1."],
  ].forEach(([id, prompt, answer, tags, solution]) => numeric(id, "series", prompt, answer, tags, solution, 210));

  // ---- 獨立驗算規格（tools/verify_answers.js 讀）----
  // 題幹的寫法自動辨識器接不到；這裡把題幹重述成數值路徑（數值偏導、數值積分、
  // 複數求值、圍道上的梯形法），不重複解題的推導、也不把答案抄一遍。
  const VERIFY = {
    // 極座標曲線寫成參數式 (r cosθ, r sinθ)，兩支數值微分再相除
    "uni-der-010": { m: "paramSlope", x: "(1+\\cos t)\\cos t", y: "(1+\\cos t)\\sin t", at: "\\pi/2" },
    "uni-der-015": { m: "vecField", op: "div", F: ["xe^y", "ye^z", "ze^x"] },
    "uni-der-016": { m: "vecField", op: "curl", comp: 2, F: ["xy", "yz", "zx"] },
    // 所圍面積 = ∮x dy（逆時針），沿題目給的參數式數值積一圈
    "uni-int-023": { m: "lineIntegral", kind: "work", F: ["0", "x"], path: { x: "2\\cos t", y: "3\\sin t", from: 0, to: "2\\pi" } }
  };
  problems.forEach((problem) => {
    if (VERIFY[problem.id]) problem.verify = VERIFY[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

/* ═══ 課程缺口補題（12F 函數列、12G Riemann 積分嚴格版，53 題，2026-10）═══
   函數列：逐點極限函數（分段）、N 隨 x 變的那個數、否定一致收斂的 xₙ、量詞順序、
   與 x 無關的 sup 上界、縮小定義域、Dini、M 判別的 Mₙ 與尾巴、極限與積分／微分交換的反例。
   Riemann：不等長分割的 ‖P‖、加細的判斷、不單調函數的上下和、加細引理、上下積分、
   有限點改值、跳躍函數與遞減函數的 U − L、一致連續推 n、可積的條件。
   驗算：sup 用 extremeOf 掃、上下和用逐段 extremeOf 再組合（let）、ε-N 用 firstIndex、
   判斷題每個誘答都用一個數值反例否定（choice）。 */
(function () {
  "use strict";

  const SOURCE = "Buzz course gap fill";
  const sup = (f, a, b) => ({ m: "extremeOf", f, kind: "sup", integer: false, range: [a, b] });
  const inf = (f, a, b) => ({ m: "extremeOf", f, kind: "inf", integer: false, range: [a, b] });
  const uc = (f, limit, range, claim) => ({ v: { m: "uniformConvergence", f, limit, range }, claim });
  const prod = (f) => ({ m: "value", f });

  const problems = [
    /* ── 12F 逐點收斂 ── */
    { id: "cg-12f-001", topic: "series", rank: 3, answerKind: "text",
      prompt: "f_n(x)=\\frac{2x^n}{1+x^{2n}}\\text{ 在 }[0,\\infty)\\text{ 上逐點收斂到 }f(x)\\text{。}f\\text{ 是哪一個？}",
      answers: ["x = 1 時 f(x) = 1，其餘 x ≥ 0 時 f(x) = 0"],
      canonical: "x = 1 時 f(x) = 1，其餘 x ≥ 0 時 f(x) = 0",
      distractors: ["0 ≤ x < 1 時 f(x) = 0，x ≥ 1 時 f(x) = 2", "0 ≤ x < 1 時 f(x) = 0，x = 1 時 f(x) = 1，x > 1 時 f(x) = 2", "所有 x ≥ 0 都是 f(x) = 0"],
      timeLimit: 150,
      tags: ["pointwise-limit-function", "uniform-convergence", "piecewise"],
      hints: ["把 x 固定，分 0 ≤ x < 1、x = 1、x > 1 三種情形看 n → ∞。", "x > 1 時分子分母同除以 x^{2n}。"],
      solution: "0 ≤ x < 1：xⁿ → 0、x²ⁿ → 0，極限 0。x = 1：每一項都是 2/2 = 1。x > 1：同除 x²ⁿ 得 2x⁻ⁿ/(x⁻²ⁿ + 1) → 0。所以 f 只在 x = 1 是 1，其他地方是 0。",
      solutionSteps: ["0 ≤ x < 1：xⁿ → 0，fₙ(x) → 0/1 = 0。", "x = 1：fₙ(1) = 2/(1+1) = 1。", "x > 1：fₙ(x) = 2x⁻ⁿ/(x⁻²ⁿ + 1) → 0。", "f(1) = 1，其餘 x ≥ 0 時 f(x) = 0。"],
      verify: { m: "choice", options: [
        { say: "x = 1 時 f(x) = 1，其餘 x ≥ 0 時 f(x) = 0", all: [
          { v: { m: "seqLimit", f: "\\frac{2\\cdot 0.5^n}{1+0.5^{2n}}" }, eq: 0 },
          { v: { m: "seqLimit", f: "\\frac{2\\cdot 1^n}{1+1^{2n}}" }, eq: 1 },
          { v: { m: "seqLimit", f: "\\frac{2\\cdot 3^n}{1+3^{2n}}" }, eq: 0 }] },
        { say: "0 ≤ x < 1 時 f(x) = 0，x ≥ 1 時 f(x) = 2", all: [{ v: { m: "seqLimit", f: "\\frac{2\\cdot 1^n}{1+1^{2n}}" }, eq: 2 }] },
        { say: "0 ≤ x < 1 時 f(x) = 0，x = 1 時 f(x) = 1，x > 1 時 f(x) = 2", all: [{ v: { m: "seqLimit", f: "\\frac{2\\cdot 3^n}{1+3^{2n}}" }, eq: 2 }] },
        { say: "所有 x ≥ 0 都是 f(x) = 0", all: [{ v: { m: "seqLimit", f: "\\frac{2\\cdot 1^n}{1+1^{2n}}" }, eq: 0 }] }
      ] } },
    { id: "cg-12f-002", topic: "series", rank: 2, answerKind: "numeric",
      prompt: "f_n(x)=\\frac{nx}{1+nx}\\text{ 在 }[0,1]\\text{ 上逐點收斂到 }f(x)\\text{。求 }f(0)+f(0.01)+f(1)",
      answer: "2", timeLimit: 90,
      tags: ["pointwise-limit-function", "uniform-convergence"],
      hints: ["先把 x 固定成一個數，再讓 n → ∞。", "x = 0 時每一項都是多少？x > 0 時分子分母同除以 n。"],
      solution: "x = 0：fₙ(0) = 0。x > 0：fₙ(x) = x/(1/n + x) → 1，不管 x 多小。所以 f(0) + f(0.01) + f(1) = 0 + 1 + 1 = 2。",
      solutionSteps: ["x = 0：fₙ(0) = 0，f(0) = 0。", "x > 0：fₙ(x) = x/(1/n + x) → 1，所以 f(0.01) = f(1) = 1。", "總和 = 0 + 1 + 1 = 2。"],
      verify: { m: "let", f: "a+b+c", with: {
        a: { m: "value", f: "\\frac{7\\cdot 0}{1+7\\cdot 0}" },
        b: { m: "seqLimit", f: "\\frac{0.01n}{1+0.01n}", n0: 20000, levels: 5 },
        c: { m: "seqLimit", f: "\\frac{n}{1+n}", n0: 2000, levels: 5 } } } },
    { id: "cg-12f-003", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=\\frac{x^{2n}+3}{x^{2n}+1}\\text{ 在 }\\mathbb{R}\\text{ 上逐點收斂到 }f(x)\\text{。求 }f(-0.5)+f(1)+f(2)",
      answer: "6", timeLimit: 120,
      tags: ["pointwise-limit-function", "uniform-convergence", "piecewise"],
      hints: ["x²ⁿ 的行為只看 |x| 跟 1 比：小於 1、等於 1、大於 1。", "|x| > 1 時分子分母同除以 x²ⁿ。"],
      solution: "|x| < 1：x²ⁿ → 0，f = 3。|x| = 1：(1+3)/(1+1) = 2。|x| > 1：同除 x²ⁿ 得 → 1。f(−0.5) + f(1) + f(2) = 3 + 2 + 1 = 6。",
      solutionSteps: ["|x| < 1：x²ⁿ → 0，f(x) = 3，所以 f(−0.5) = 3。", "|x| = 1：fₙ = 4/2 = 2，f(1) = 2。", "|x| > 1：fₙ = (1 + 3x⁻²ⁿ)/(1 + x⁻²ⁿ) → 1，f(2) = 1。", "總和 3 + 2 + 1 = 6。"],
      verify: { m: "let", f: "a+b+c", with: {
        a: { m: "seqLimit", f: "\\frac{0.25^n+3}{0.25^n+1}" },
        b: { m: "seqLimit", f: "\\frac{1^n+3}{1^n+1}" },
        c: { m: "seqLimit", f: "\\frac{4^n+3}{4^n+1}" } } } },
    { id: "cg-12f-004", topic: "series", rank: 2, answerKind: "numeric",
      prompt: "f_n(x)=x^n\\text{ 在 }[0,1)\\text{ 上逐點收斂到 }0\\text{。取 }x=0.8,\\ \\varepsilon=0.001\\text{，求最小的正整數 }N\\text{，使所有 }n\\ge N\\text{ 都有 }|f_n(0.8)|<0.001",
      answer: "31", timeLimit: 120,
      tags: ["pointwise-n-depends-on-x", "uniform-convergence", "epsilon-n"],
      hints: ["解 0.8ⁿ < 0.001：兩邊取對數，注意 ln 0.8 是負的。", "0.8ⁿ 遞減，所以第一個成立的 n 之後都成立。"],
      solution: "0.8ⁿ < 0.001 ⇔ n > ln 0.001 / ln 0.8 ≈ 30.96（除以負數不等號反向）。0.8ⁿ 遞減，最小 N = 31。",
      solutionSteps: ["0.8ⁿ < 0.001 ⇔ n·ln 0.8 < ln 0.001。", "ln 0.8 < 0：n > ln 0.001 / ln 0.8 ≈ 30.96。", "最小 N = 31。"],
      verify: { m: "firstIndex", f: "0.8^n", below: 0.001 } },
    { id: "cg-12f-005", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=\\frac{1}{1+nx}\\text{ 在 }(0,1]\\text{ 上逐點收斂到 }0\\text{。取 }x=0.02,\\ \\varepsilon=0.015\\text{，求最小的正整數 }N\\text{，使所有 }n\\ge N\\text{ 都有 }f_n(0.02)<0.015",
      answer: "3284", timeLimit: 120,
      tags: ["pointwise-n-depends-on-x", "uniform-convergence", "epsilon-n"],
      hints: ["把不等式 1/(1 + 0.02n) < 0.015 解成 n 的範圍。", "x 越靠近 0，需要的 N 越大 —— 這就是為什麼沒有一個 N 對所有 x 都行。"],
      solution: "1/(1+0.02n) < 0.015 ⇔ 1 + 0.02n > 66.67 ⇔ n > 3283.3，最小 N = 3284。換成 x = 0.2 只要 N = 329：N 隨 x 變。",
      solutionSteps: ["1/(1 + 0.02n) < 0.015 ⇔ 1 + 0.02n > 1/0.015 ≈ 66.667。", "0.02n > 65.667 ⇔ n > 3283.3。", "fₙ(0.02) 對 n 遞減，最小 N = 3284。"],
      verify: { m: "firstIndex", f: "\\frac{1}{1+0.02n}", below: 0.015 } },

    /* ── 12F 一致收斂 ── */
    { id: "cg-12f-006", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=x^n\\text{ 在 }[0,1)\\text{ 上逐點收斂到 }0\\text{。取 }x_n=1-\\frac{2}{n}\\ (n\\ge 3)\\text{，求 }\\lim_{n\\to\\infty}f_n(x_n)",
      answer: "exp(-2)", timeLimit: 120,
      tags: ["uniformconv-negation-witness", "uniform-convergence", "e-limit"],
      hints: ["fₙ(xₙ) = (1 − 2/n)ⁿ。", "(1 + a/n)ⁿ → eᵃ。"],
      solution: "fₙ(xₙ) = (1 − 2/n)ⁿ → e⁻² ≈ 0.135。所以 sup|fₙ − 0| ≥ fₙ(xₙ) 不趨近 0：取 ε₀ = 0.1，不一致收斂。",
      solutionSteps: ["fₙ(xₙ) = (1 − 2/n)ⁿ。", "(1 + a/n)ⁿ → eᵃ，a = −2：極限 e⁻² ≈ 0.135。", "sup|fₙ| ≥ fₙ(xₙ) → e⁻² ≠ 0，所以不一致收斂。"],
      verify: { m: "seqLimit", f: "\\left(1-\\frac{2}{n}\\right)^n" } },
    { id: "cg-12f-007", topic: "series", rank: 4, answerKind: "numeric",
      prompt: "f_n(x)=nx(1-x)^{2n}\\text{ 在 }[0,1]\\text{ 上逐點收斂到 }0\\text{。取 }x_n=\\frac{1}{2n}\\text{，求 }\\lim_{n\\to\\infty}f_n(x_n)",
      answer: "1/(2*e)", timeLimit: 150,
      tags: ["uniformconv-negation-witness", "uniform-convergence", "e-limit"],
      hints: ["把 xₙ 代進去：n·xₙ 是多少？剩下的冪次長什麼樣子？", "(1 − 1/m)ᵐ → 1/e，這裡 m = 2n。"],
      solution: "fₙ(1/(2n)) = n·(1/(2n))·(1 − 1/(2n))²ⁿ = (1/2)(1 − 1/(2n))²ⁿ → 1/(2e) ≈ 0.184。誤差停在 0.18 附近，不趨近 0，所以不一致收斂。",
      solutionSteps: ["fₙ(xₙ) = n·(1/(2n))·(1 − 1/(2n))²ⁿ = (1/2)(1 − 1/(2n))²ⁿ。", "(1 − 1/m)ᵐ → e⁻¹（m = 2n）。", "極限 = 1/(2e) ≈ 0.184。"],
      verify: { m: "seqLimit", f: "n\\cdot\\frac{1}{2n}\\left(1-\\frac{1}{2n}\\right)^{2n}" } },
    { id: "cg-12f-008", topic: "series", rank: 3, answerKind: "text",
      prompt: "f_n(x)=\\frac{x}{n}\\text{ 在 }\\mathbb{R}\\text{ 上逐點收斂到 }0\\text{。取 }\\varepsilon=0.01\\text{，下列哪一句成立？}",
      answers: ["每個 x 各有自己的 N，但沒有一個 N 對所有實數 x 都行"],
      canonical: "每個 x 各有自己的 N，但沒有一個 N 對所有實數 x 都行",
      distractors: ["有一個 N 對所有實數 x 都行", "x = 1000 時找不到這樣的 N", "限制在 [0, 1] 上也沒有一個 N 對所有 x 都行"],
      timeLimit: 150,
      tags: ["uniformconv-quantifier-order", "uniform-convergence", "epsilon-n"],
      hints: ["固定 x 時 |x|/n < 0.01 要 n 多大？那個數跟 x 有沒有關係？", "反過來固定 N：x 可以取多大？"],
      solution: "固定 x：n > 100|x| 就行（∀x∃N 成立）。固定任何 N：取 x = N 就有 |fₙ(x)| = 1 ≥ 0.01，所以 ∃N∀x 不成立。限制在 [0,1] 上 sup = 1/n，N = 101 就對全部 x 都行。",
      solutionSteps: ["固定 x：|x|/n < 0.01 ⇔ n > 100|x|，N 跟 x 有關但存在。", "固定 N：取 x = N，f_N(N) = 1 ≥ 0.01，沒有 N 能管住所有 x。", "在 [0,1] 上 sup|fₙ| = 1/n，N = 101 就夠，所以第四句錯。"],
      verify: { m: "choice", options: [
        { say: "每個 x 各有自己的 N，但沒有一個 N 對所有實數 x 都行", all: [
          { v: { m: "firstIndex", f: "\\frac{1000}{n}", below: 0.01 }, gt: 0 },
          { v: sup("\\frac{x}{10^6}", 0, 1e8), gt: 0.01 }] },
        { say: "有一個 N 對所有實數 x 都行", all: [{ v: sup("\\frac{x}{10^6}", 0, 1e8), lt: 0.01 }] },
        { say: "x = 1000 時找不到這樣的 N", all: [{ v: { m: "firstIndex", f: "\\frac{1000}{n}", below: 0.01 }, lt: 0 }] },
        { say: "限制在 [0, 1] 上也沒有一個 N 對所有 x 都行", all: [{ v: sup("\\frac{x}{101}", 0, 1), ge: 0.01 }] }
      ] } },
    { id: "cg-12f-009", topic: "series", rank: 3, answerKind: "text",
      prompt: "\\text{在區間 }I\\,\\text{ 上，「}f_n\\text{ 一致收斂到 }f\\text{」的定義是哪一句？（}\\varepsilon>0\\text{ 任意給定）}",
      answers: ["存在 N，使所有 n ≥ N 與所有 x ∈ I 都有 |fₙ(x) − f(x)| < ε"],
      canonical: "存在 N，使所有 n ≥ N 與所有 x ∈ I 都有 |fₙ(x) − f(x)| < ε",
      distractors: ["對每個 x ∈ I，存在 N 使所有 n ≥ N 都有 |fₙ(x) − f(x)| < ε", "fₙ 與 f 都連續，而且對每個 x ∈ I 都有 fₙ(x) → f(x)"],
      timeLimit: 120,
      tags: ["uniformconv-quantifier-order", "uniform-convergence"],
      hints: ["N 寫在 x 前面還是後面，決定 N 能不能跟著 x 變。", "拿 xⁿ 在 [0,1) 上試：它滿足哪幾句？它一致收斂嗎？"],
      solution: "一致收斂要「∃N ∀x」：同一個 N 管住整個 I。「∀x ∃N」只是逐點收斂 —— xⁿ 在 [0,1) 上滿足它，但 sup|xⁿ| = 1。第三句也不夠：nx/(1+n²x²) 在 [0,1] 上連續、逐點收斂到連續的 0，sup 卻一直是 1/2。",
      solutionSteps: ["一致收斂：∃N ∀n ≥ N ∀x ∈ I，|fₙ(x) − f(x)| < ε。", "∀x ∃N 是逐點收斂：xⁿ 在 [0,1) 滿足它，但 sup|xⁿ| = 1，不一致。", "nx/(1+n²x²) 在 [0,1] 全連續、逐點 → 0，但 fₙ(1/n) = 1/2，也不一致。"],
      verify: { m: "choice", options: [
        { say: "存在 N，使所有 n ≥ N 與所有 x ∈ I 都有 |fₙ(x) − f(x)| < ε", unknown: "定義本身；其餘兩句用反例否定" },
        { say: "對每個 x ∈ I，存在 N 使所有 n ≥ N 都有 |fₙ(x) − f(x)| < ε", all: [uc("x^n", "0", [0, 0.999999], true)] },
        { say: "fₙ 與 f 都連續，而且對每個 x ∈ I 都有 fₙ(x) → f(x)", all: [uc("\\frac{nx}{1+n^2x^2}", "0", [0, 1], true)] }
      ] } },

    /* ── 12F 怎麼判斷一致收斂 ── */
    { id: "cg-12f-010", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=\\frac{x}{1+nx^2}\\text{ 在 }\\mathbb{R}\\text{ 上收斂到 }0\\text{。求 }\\sup_{x\\in\\mathbb{R}}|f_{16}(x)|",
      answer: "1/8", timeLimit: 120,
      tags: ["uniformconv-bound-independent-of-x", "uniform-convergence", "optimization"],
      hints: ["fₙ 是奇函數，只要看 x ≥ 0。", "對 x 微分找最大值的位置，它會跟 n 有關。"],
      solution: "f₁₆′(x) = (1 − 16x²)/(1+16x²)²，x = 1/4 時最大：(1/4)/(1+1) = 1/8。一般 n 的 sup 是 1/(2√n) → 0，所以一致收斂。",
      solutionSteps: ["奇函數，看 x ≥ 0：f₁₆′(x) = (1 − 16x²)/(1 + 16x²)²。", "臨界點 x = 1/4，f₁₆(1/4) = (1/4)/2 = 1/8。", "sup|f₁₆| = 1/8（一般是 1/(2√n) → 0）。"],
      verify: sup("\\left|\\frac{x}{1+16x^2}\\right|", -50, 50) },
    { id: "cg-12f-011", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=xe^{-nx}\\text{ 在 }[0,\\infty)\\text{ 上收斂到 }0\\text{。求 }\\sup_{x\\ge 0}f_5(x)",
      answer: "1/(5*e)", timeLimit: 120,
      tags: ["uniformconv-bound-independent-of-x", "uniform-convergence", "optimization"],
      hints: ["對 x 微分：f₅′(x) = e^{−5x}(1 − 5x)。", "臨界點左邊遞增、右邊遞減，所以是最大值。"],
      solution: "f₅′(x) = e^{−5x}(1 − 5x) = 0 ⇒ x = 1/5，f₅(1/5) = (1/5)e⁻¹ = 1/(5e) ≈ 0.0736。一般 sup = 1/(ne) → 0，一致收斂。",
      solutionSteps: ["f₅′(x) = e^{−5x}(1 − 5x)，臨界點 x = 1/5。", "f₅(1/5) = (1/5)e⁻¹。", "sup = 1/(5e) ≈ 0.0736。"],
      verify: sup("xe^{-5x}", 0, 20) },
    { id: "cg-12f-012", topic: "series", rank: 4, answerKind: "numeric",
      prompt: "f_n(x)=x^n(1-x)\\text{ 在 }[0,1]\\text{ 上收斂到 }0\\text{。求 }\\sup_{0\\le x\\le 1}f_4(x)",
      answer: "256/3125", timeLimit: 150,
      tags: ["uniformconv-bound-independent-of-x", "uniform-convergence", "optimization"],
      hints: ["f₄(x) = x⁴ − x⁵，微分找臨界點。", "端點的值都是 0，最大值在內部。"],
      solution: "f₄′(x) = 4x³ − 5x⁴ = x³(4 − 5x)，臨界點 x = 4/5。f₄(4/5) = (4/5)⁴·(1/5) = 256/3125 ≈ 0.0819。一般 sup = (n/(n+1))ⁿ/(n+1) ≤ 1/(n+1) → 0。",
      solutionSteps: ["f₄′(x) = x³(4 − 5x)，內部臨界點 x = 4/5。", "f₄(4/5) = (256/625)·(1/5) = 256/3125。", "端點都是 0，sup = 256/3125 ≈ 0.0819。"],
      verify: sup("x^4(1-x)", 0, 1) },
    { id: "cg-12f-013", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=\\frac{1}{1+nx}\\text{ 在 }[0.2,1]\\text{ 上收斂到 }0\\text{。求 }\\sup_{0.2\\le x\\le 1}f_{50}(x)",
      answer: "1/11", timeLimit: 90,
      tags: ["uniformconv-restrict-domain", "uniform-convergence"],
      hints: ["fₙ 對 x 是遞增還是遞減？", "sup 落在哪一個端點？"],
      solution: "fₙ 對 x 遞減，sup 在左端 x = 0.2：1/(1 + 50·0.2) = 1/11。在 [0.2,1] 上 sup = 1/(1+0.2n) → 0，一致收斂；在 (0,1] 上 sup = 1，不一致。",
      solutionSteps: ["f₅₀(x) = 1/(1 + 50x) 對 x 遞減。", "sup 在 x = 0.2：1/(1 + 10) = 1/11。", "所以 [0.2,1] 上一致收斂，而 (0,1] 上 sup 恆為 1。"],
      verify: sup("\\frac{1}{1+50x}", 0.2, 1) },
    { id: "cg-12f-014", topic: "series", rank: 3, answerKind: "text",
      prompt: "f_n(x)=e^{-nx}\\text{ 在下列哪一個區間上一致收斂到 }0\\text{？}",
      answers: ["[0.1, 1]"], canonical: "[0.1, 1]",
      distractors: ["[0, 1]", "(0, 1]", "(0, ∞)"],
      timeLimit: 120,
      tags: ["uniformconv-restrict-domain", "uniform-convergence"],
      hints: ["每個區間上 sup e^{−nx} 落在哪裡？", "左端點離 0 有沒有一段固定的距離？"],
      solution: "[0.1,1] 上 sup = e^{−0.1n} → 0，一致收斂。[0,1]：x = 0 時 fₙ = 1，連逐點極限都不是 0。(0,1] 與 (0,∞)：x 可以任意靠近 0，sup 恆為 1，不一致。",
      solutionSteps: ["e^{−nx} 對 x 遞減，sup 在左端。", "[0.1, 1]：sup = e^{−0.1n} → 0，一致收斂。", "(0,1]、(0,∞)：sup = 1；[0,1]：fₙ(0) = 1。都不行。"],
      verify: { m: "choice", options: [
        { say: "[0.1, 1]", all: [uc("e^{-nx}", "0", [0.1, 1], true)] },
        { say: "[0, 1]", all: [uc("e^{-nx}", "0", [0, 1], true)] },
        { say: "(0, 1]", all: [uc("e^{-nx}", "0", [1e-7, 1], true)] },
        { say: "(0, ∞)", all: [uc("e^{-nx}", "0", [1e-7, 1000], true)] }
      ] } },
    { id: "cg-12f-015", topic: "series", rank: 4, answerKind: "text",
      prompt: "\\text{Dini 定理：緊緻區間上、單調地逐點收斂到連續函數的連續函數列一定一致收斂。下列哪一列四個條件全部成立？}",
      answers: ["(1 + x/n)ⁿ 在 [0, 1]"], canonical: "(1 + x/n)ⁿ 在 [0, 1]",
      distractors: ["xⁿ 在 [0, 1)", "xⁿ 在 [0, 1]", "nx/(1 + n²x²) 在 [0, 1]"],
      timeLimit: 180,
      tags: ["uniformconv-dini", "uniform-convergence"],
      hints: ["逐一檢查：區間是不是閉且有界？對 n 單調嗎？極限函數連續嗎？", "有一列不是對 n 單調的：先升後降的那一個。"],
      solution: "(1+x/n)ⁿ 在 [0,1] 上連續、對 n 遞增、極限 eˣ 連續、區間緊緻：四條全中，一致收斂。xⁿ 在 [0,1) 區間不緊緻；在 [0,1] 極限不連續；nx/(1+n²x²) 對 n 不單調（固定 x 先升後降），而且 sup 恆為 1/2。",
      solutionSteps: ["(1 + x/n)ⁿ：連續、對 n 遞增、→ eˣ 連續、[0,1] 緊緻 ⇒ Dini 給出一致收斂。", "xⁿ 在 [0,1)：區間不閉，sup 恆為 1。", "xⁿ 在 [0,1]：極限在 x = 1 跳成 1，不連續。", "nx/(1+n²x²)：對 n 不單調，fₙ(1/n) = 1/2。"],
      verify: { m: "choice", options: [
        { say: "(1 + x/n)ⁿ 在 [0, 1]", all: [uc("\\left(1+\\frac{x}{n}\\right)^n", "e^x", [0, 1], true)] },
        { say: "xⁿ 在 [0, 1)", all: [uc("x^n", "0", [0, 0.999999], true)] },
        { say: "xⁿ 在 [0, 1]", all: [uc("x^n", "0", [0, 1], true)] },
        { say: "nx/(1 + n²x²) 在 [0, 1]", all: [uc("\\frac{nx}{1+n^2x^2}", "0", [0, 1], true)] }
      ] } },
    { id: "cg-12f-016", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\left(1+\\frac{x}{n}\\right)^n\\text{ 在 }[0,2]\\text{ 上單調遞增地收斂到 }e^x\\text{。求 }n=10\\text{ 時的誤差 }\\sup_{0\\le x\\le 2}\\left|e^x-\\left(1+\\frac{x}{10}\\right)^{10}\\right|",
      answer: "exp(2)-1.2^10", timeLimit: 150,
      tags: ["uniformconv-dini", "uniform-convergence", "e-limit"],
      hints: ["誤差 eˣ − (1 + x/10)¹⁰ 對 x 是遞增的嗎？在 x = 0 是多少？", "sup 落在區間的哪一端？"],
      solution: "誤差 g(x) = eˣ − (1+x/10)¹⁰，g(0) = 0，g′(x) = eˣ − (1+x/10)⁹ ≥ 0（因為 (1+x/10)⁹ ≤ e^{0.9x} ≤ eˣ）。所以 sup 在 x = 2：e² − 1.2¹⁰ ≈ 7.3891 − 6.1917 = 1.1973。",
      solutionSteps: ["g(x) = eˣ − (1 + x/10)¹⁰，g(0) = 0。", "g′(x) = eˣ − (1 + x/10)⁹ ≥ 0，因為 1 + t ≤ eᵗ 給 (1 + x/10)⁹ ≤ e^{0.9x}。", "sup 在 x = 2：e² − 1.2¹⁰ ≈ 1.1973。"],
      verify: sup("e^x-\\left(1+\\frac{x}{10}\\right)^{10}", 0, 2) },

    /* ── 12F Weierstrass M 判別 ── */
    { id: "cg-12f-017", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\text{級數 }\\sum_{n=1}^{\\infty}\\frac{x}{n^2+x^2}\\text{ 在 }[0,\\infty)\\text{ 上，令 }M_n=\\sup_{x\\ge 0}\\frac{x}{n^2+x^2}\\text{。求 }M_3",
      answer: "1/6", timeLimit: 120,
      tags: ["mtest-choose-mn", "weierstrass-m-test", "optimization"],
      hints: ["對 x 微分 x/(9 + x²)，找臨界點。", "或用算幾不等式：9 + x² ≥ 6x。"],
      solution: "x/(9+x²) 的導數 (9 − x²)/(9+x²)² 在 x = 3 變號，最大值 3/18 = 1/6。一般 Mₙ = 1/(2n)，ΣMₙ 發散 —— 所以在 [0,∞) 上 M 判別用不上。",
      solutionSteps: ["d/dx [x/(9 + x²)] = (9 − x²)/(9 + x²)²，臨界點 x = 3。", "M₃ = 3/(9 + 9) = 1/6。", "一般 Mₙ = 1/(2n)，ΣMₙ 發散，M 判別在 [0,∞) 上失效。"],
      verify: sup("\\frac{x}{9+x^2}", 0, 100) },
    { id: "cg-12f-018", topic: "series", rank: 3, answerKind: "text",
      prompt: "\\text{下列哪一個級數在 }[0,\\infty)\\text{ 上，取 }M_n=\\sup_{x\\ge 0}|f_n(x)|\\text{ 就能用 M 判別證明一致收斂？}",
      answers: ["Σ e^{−nx}/n²"], canonical: "Σ e^{−nx}/n²",
      distractors: ["Σ e^{−nx}/n", "Σ x e^{−nx}"],
      timeLimit: 150,
      tags: ["mtest-choose-mn", "weierstrass-m-test"],
      hints: ["先求每一項在 [0,∞) 上的 sup：e^{−nx} 的最大值在哪裡？x e^{−nx} 呢？", "再看 ΣMₙ 收不收斂。"],
      solution: "e^{−nx}/n² 的 sup 在 x = 0：Mₙ = 1/n²，Σ 收斂，M 判別成立。e^{−nx}/n 的 Mₙ = 1/n，調和級數發散。x e^{−nx} 的 Mₙ = 1/(ne)，也發散。",
      solutionSteps: ["e^{−nx}/n²：sup 在 x = 0，Mₙ = 1/n²，Σ1/n² 收斂 ✓。", "e^{−nx}/n：Mₙ = 1/n，Σ 發散。", "x e^{−nx}：sup 在 x = 1/n，Mₙ = 1/(ne)，Σ 發散。"],
      verify: { m: "choice", options: [
        { say: "Σ e^{−nx}/n²", all: [
          { v: sup("\\frac{e^{-7x}}{49}", 0, 20), eq: "\\frac{1}{49}" },
          { v: { m: "seriesConverges", f: "\\frac{1}{n^2}", from: 1 }, claim: true }] },
        { say: "Σ e^{−nx}/n", all: [
          { v: sup("\\frac{e^{-7x}}{7}", 0, 20), eq: "\\frac{1}{7}" },
          { v: { m: "seriesConverges", f: "\\frac{1}{n}", from: 1 }, claim: true }] },
        { say: "Σ x e^{−nx}", all: [
          { v: sup("xe^{-7x}", 0, 20), eq: "\\frac{1}{7e}" },
          { v: { m: "seriesConverges", f: "\\frac{1}{ne}", from: 1 }, claim: true }] }
      ] } },
    { id: "cg-12f-019", topic: "series", rank: 4, answerKind: "numeric",
      prompt: "\\text{級數 }\\sum_{n=1}^{\\infty}x^2e^{-nx}\\text{ 在 }[0,\\infty)\\text{ 上，令 }M_n=\\sup_{x\\ge 0}x^2e^{-nx}\\text{。求 }M_4",
      answer: "1/(4*e^2)", timeLimit: 150,
      tags: ["mtest-choose-mn", "weierstrass-m-test", "optimization"],
      hints: ["對 x²e^{−4x} 微分：x e^{−4x}(2 − 4x)。", "求出最大值後想想：一般的 Mₙ 加起來收不收斂？"],
      solution: "d/dx[x²e^{−4x}] = x e^{−4x}(2 − 4x)，最大在 x = 1/2：(1/4)e⁻² = 1/(4e²) ≈ 0.0338。一般 Mₙ = 4/(n²e²)，ΣMₙ 收斂，所以在 [0,∞) 上一致收斂。",
      solutionSteps: ["d/dx[x²e^{−4x}] = x e^{−4x}(2 − 4x)，臨界點 x = 1/2。", "M₄ = (1/2)²·e⁻² = 1/(4e²)。", "一般 Mₙ = 4/(n²e²)，Σ 收斂，M 判別成立。"],
      verify: sup("x^2e^{-4x}", 0, 20) },
    { id: "cg-12f-020", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\text{級數 }\\sum_{k=0}^{\\infty}x^k\\text{ 在 }[-0.8,0.8]\\text{ 上取 }M_k=0.8^k\\text{。求最小的 }N\\text{，使 }\\sum_{k=N+1}^{\\infty}M_k<0.001",
      answer: "38", timeLimit: 150,
      tags: ["mtest-tail-bound", "weierstrass-m-test", "geometric-series"],
      hints: ["幾何級數的尾巴：Σ_{k>N} rᵏ = r^{N+1}/(1 − r)。", "解 0.8^{N+1}/0.2 < 0.001，取對數。"],
      solution: "尾巴 = 0.8^{N+1}/0.2 < 0.001 ⇔ 0.8^{N+1} < 0.0002 ⇔ N + 1 > ln 0.0002 / ln 0.8 ≈ 38.2，N ≥ 38。這個 N 對 [−0.8, 0.8] 上每一個 x 都保證 |S(x) − S_N(x)| < 0.001。",
      solutionSteps: ["Σ_{k=N+1}^∞ 0.8ᵏ = 0.8^{N+1}/0.2。", "0.8^{N+1} < 0.0002 ⇔ N + 1 > ln 0.0002 / ln 0.8 ≈ 38.17。", "最小 N = 38。"],
      verify: { m: "firstIndex", f: "\\sum_{k=n+1}^{n+300}0.8^k", below: 0.001 } },
    { id: "cg-12f-021", topic: "series", rank: 4, answerKind: "numeric",
      prompt: "\\text{級數 }\\sum_{k=1}^{\\infty}\\frac{\\sin(kx)}{k(k+1)}\\text{ 在 }\\mathbb{R}\\text{ 上取 }M_k=\\frac{1}{k(k+1)}\\text{。求最小的 }N\\text{，使 }\\sum_{k=N+1}^{\\infty}M_k<0.003",
      answer: "333", timeLimit: 180,
      tags: ["mtest-tail-bound", "weierstrass-m-test", "telescoping"],
      hints: ["1/(k(k+1)) = 1/k − 1/(k+1)，尾巴會消去。", "尾巴化簡成一個分數後再解不等式。"],
      solution: "Σ_{k>N} (1/k − 1/(k+1)) = 1/(N+1) < 0.003 ⇔ N + 1 > 333.3 ⇔ N ≥ 333。N = 332 時尾巴 1/333 ≈ 0.003003，還不夠。",
      solutionSteps: ["1/(k(k+1)) = 1/k − 1/(k+1)，尾巴 Σ_{k>N} = 1/(N+1)。", "1/(N+1) < 0.003 ⇔ N + 1 > 333.3。", "最小 N = 333。"],
      verify: { m: "choice", options: [
        { say: "333", all: [
          // 有限和到 200 萬項：截掉的部分 < 5e-7，比 0.003 − 1/334 ≈ 6e-6 的餘裕小一個量級；
          // 而 N = 332 的有限和本身就 ≥ 0.003（有限和是下界），兩邊的判定都不受截斷影響。
          // （無窮和走 numeric.seriesSum 在這裡回 NaN，from > 200 時還會安靜地算錯，所以不用。）
          { v: { m: "series", f: "\\frac{1}{(n+333)(n+334)}", from: 1, to: 2000000 }, lt: 0.003 },
          { v: { m: "series", f: "\\frac{1}{(n+332)(n+333)}", from: 1, to: 2000000 }, ge: 0.003 }] }
      ] } },
    { id: "cg-12f-022", topic: "series", rank: 4, answerKind: "text",
      prompt: "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}x^n}{n}\\text{ 在 }[0,1]\\text{ 上（和是 }\\ln(1+x)\\text{），下列哪一句正確？}",
      answers: ["一致收斂，但 M 判別用不上"], canonical: "一致收斂，但 M 判別用不上",
      distractors: ["一致收斂，而且取 Mₙ = 1/n 就能用 M 判別證明", "不一致收斂"],
      timeLimit: 180,
      tags: ["mtest-not-necessary", "weierstrass-m-test", "alternating-series"],
      hints: ["每一項在 [0,1] 上的 sup 是多少？那些 sup 加起來呢？", "交錯級數的尾巴不超過下一項的絕對值。"],
      solution: "交錯級數估計：|ln(1+x) − S_N(x)| ≤ x^{N+1}/(N+1) ≤ 1/(N+1)，與 x 無關 → 一致收斂。但任何 Mₙ 都得 ≥ sup|xⁿ/n| = 1/n，ΣMₙ 必發散。M 判別是充分不必要。",
      solutionSteps: ["交錯級數：|ln(1+x) − S_N(x)| ≤ x^{N+1}/(N+1) ≤ 1/(N+1) → 0，一致收斂。", "sup_{[0,1]} |xⁿ/n| = 1/n，任何 Mₙ ≥ 1/n。", "Σ1/n 發散，所以 M 判別用不上。"],
      verify: { m: "choice", options: [
        { say: "一致收斂，但 M 判別用不上", all: [
          uc("\\sum_{k=1}^{n}\\frac{(-1)^{k+1}x^k}{k}", "\\ln(1+x)", [0, 1], true),
          { v: { m: "seriesConverges", f: "\\frac{1}{n}", from: 1 }, claim: false }] },
        { say: "一致收斂，而且取 Mₙ = 1/n 就能用 M 判別證明", all: [{ v: { m: "seriesConverges", f: "\\frac{1}{n}", from: 1 }, claim: true }] },
        { say: "不一致收斂", all: [uc("\\sum_{k=1}^{n}\\frac{(-1)^{k+1}x^k}{k}", "\\ln(1+x)", [0, 1], false)] }
      ] } },

    /* ── 12F 極限與積分交換 ── */
    { id: "cg-12f-023", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\lim_{n\\to\\infty}\\int_0^1 n\\left(e^{x/n}-1\\right)dx",
      answer: "1/2", timeLimit: 150,
      tags: ["intswap-uniform-bound", "uniform-convergence", "definite-integral"],
      hints: ["n(e^{x/n} − 1) 在 [0,1] 上逐點收斂到什麼？用 eᵗ − 1 ≈ t。", "誤差 |n(e^{x/n} − 1) − x| 能不能用一個與 x 無關、趨近 0 的數壓住？"],
      solution: "eᵗ − 1 − t ≤ t²eᵗ/2，取 t = x/n：|n(e^{x/n} − 1) − x| ≤ e/(2n) → 0，一致收斂到 x。可以交換：極限 = ∫₀¹ x dx = 1/2。",
      solutionSteps: ["n(e^{x/n} − 1) → x（逐點）。", "|n(e^{x/n} − 1) − x| ≤ n·(x/n)²e^{x/n}/2 ≤ e/(2n)，在 [0,1] 上一致。", "一致收斂可交換：∫₀¹ x dx = 1/2。"],
      verify: { m: "integralLimit", f: "n\\left(e^{x/n}-1\\right)", a: 0, b: 1 } },
    { id: "cg-12f-024", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\lim_{n\\to\\infty}\\int_0^1\\frac{nx^2+1}{n+x}\\,dx",
      answer: "1/3", timeLimit: 150,
      tags: ["intswap-uniform-bound", "uniform-convergence", "definite-integral"],
      hints: ["被積函數的分子分母同除以 n，逐點極限是什麼？", "算 |fₙ(x) − x²|，在 [0,1] 上用一個只跟 n 有關的數壓住。"],
      solution: "fₙ(x) − x² = (1 − x³)/(n + x)，在 [0,1] 上絕對值 ≤ 1/n → 0，一致收斂到 x²。所以極限 = ∫₀¹ x² dx = 1/3。",
      solutionSteps: ["fₙ(x) = (nx² + 1)/(n + x) → x²。", "fₙ(x) − x² = (1 − x³)/(n + x)，|·| ≤ 1/n，一致收斂。", "交換：∫₀¹ x² dx = 1/3。"],
      verify: { m: "integralLimit", f: "\\frac{nx^2+1}{n+x}", a: 0, b: 1 } },
    { id: "cg-12f-025", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=\\frac{2x}{n^2}e^{-x^2/n^2}\\text{ 在 }[0,\\infty)\\text{ 上一致收斂到 }0\\text{。求 }\\lim_{n\\to\\infty}\\int_0^{\\infty}f_n(x)\\,dx",
      answer: "1", timeLimit: 150,
      tags: ["intswap-unbounded-domain", "uniform-convergence", "improper-integral"],
      hints: ["令 u = x²/n²，積分會變成跟 n 無關的東西。", "比較這個答案跟 ∫₀^∞ 0 dx —— 為什麼一致收斂救不了？"],
      solution: "u = x²/n²，du = 2x dx/n²：∫₀^∞ fₙ = ∫₀^∞ e^{−u} du = 1，每個 n 都是 1，極限是 1。但極限函數的積分是 0：區間無界時，一致收斂不保證積分可交換。",
      solutionSteps: ["u = x²/n²，du = (2x/n²)dx。", "∫₀^∞ fₙ dx = ∫₀^∞ e^{−u} du = 1，與 n 無關。", "極限 = 1 ≠ ∫₀^∞ 0 dx = 0。"],
      verify: { m: "integral", f: "\\frac{2x}{49}e^{-x^2/49}", a: 0, b: "\\infty" } },
    { id: "cg-12f-026", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=\\frac{n}{n^2+x^2}\\text{ 在 }[0,\\infty)\\text{ 上一致收斂到 }0\\text{。求 }\\lim_{n\\to\\infty}\\int_0^{\\infty}f_n(x)\\,dx",
      answer: "pi/2", timeLimit: 150,
      tags: ["intswap-unbounded-domain", "uniform-convergence", "improper-integral"],
      hints: ["sup|fₙ| 是多少？為什麼說它一致收斂到 0？", "積分用 arctan：∫ n/(n² + x²) dx = arctan(x/n)。"],
      solution: "sup fₙ = fₙ(0) = 1/n → 0，一致收斂到 0。但 ∫₀^∞ n/(n² + x²) dx = [arctan(x/n)]₀^∞ = π/2，每個 n 都一樣，極限 π/2 ≠ 0。",
      solutionSteps: ["sup|fₙ| = 1/n → 0：一致收斂到 0。", "∫₀^∞ n/(n² + x²) dx = [arctan(x/n)]₀^∞ = π/2。", "極限 = π/2，不是 ∫ 0 = 0。"],
      verify: { m: "integral", f: "\\frac{7}{49+x^2}", a: 0, b: "\\infty" } },

    /* ── 12F 極限與微分交換 ── */
    { id: "cg-12f-027", topic: "series", rank: 2, answerKind: "numeric",
      prompt: "f_n(x)=\\frac{\\sin(nx)}{\\sqrt[3]{n}}\\text{ 在 }\\mathbb{R}\\text{ 上一致收斂到 }0\\text{。求 }f_8'(0)",
      answer: "4", timeLimit: 90,
      tags: ["derivswap-counterexample", "uniform-convergence", "chain-rule"],
      hints: ["fₙ′(x) = n cos(nx)/∛n。", "n = 8 時 ∛8 是多少？"],
      solution: "fₙ′(x) = n^{2/3}cos(nx)，f₈′(0) = 8^{2/3} = 4。sup|fₙ| = n^{−1/3} → 0，但 fₙ′(0) = n^{2/3} → ∞：一致收斂不保證導數收斂。",
      solutionSteps: ["fₙ′(x) = (n/∛n)cos(nx) = n^{2/3}cos(nx)。", "f₈′(0) = 8^{2/3} = 4。", "sup|fₙ| → 0 但 fₙ′(0) → ∞。"],
      verify: { m: "deriv", f: "\\frac{\\sin(8x)}{2}", at: [0] } },
    { id: "cg-12f-028", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "f_n(x)=\\frac{x}{1+nx^2}\\text{ 在 }\\mathbb{R}\\text{ 上一致收斂到 }f=0\\text{。求 }\\lim_{n\\to\\infty}f_n'(0)",
      answer: "1", timeLimit: 120,
      tags: ["derivswap-counterexample", "uniform-convergence", "quotient-rule"],
      hints: ["用商法則算 fₙ′(x)，再代 x = 0。", "跟 f′(0) = 0 比一比。"],
      solution: "fₙ′(x) = (1 − nx²)/(1 + nx²)²，fₙ′(0) = 1，每個 n 都是 1，極限 1。可是 f = 0，f′(0) = 0：lim fₙ′(0) ≠ f′(0)。",
      solutionSteps: ["fₙ′(x) = (1 − nx²)/(1 + nx²)²。", "fₙ′(0) = 1，對每個 n 都成立。", "lim fₙ′(0) = 1，而 f′(0) = 0。"],
      verify: { m: "deriv", f: "\\frac{x}{1+100x^2}", at: [0] } },
    { id: "cg-12f-029", topic: "series", rank: 4, answerKind: "text",
      prompt: "\\text{下列哪一列在所給區間的每一點都滿足 }\\lim_{n\\to\\infty}f_n'(x)=\\left(\\lim_{n\\to\\infty}f_n\\right)'(x)\\text{？}",
      answers: ["sin(nx)/n² 在 [0, 1]"], canonical: "sin(nx)/n² 在 [0, 1]",
      distractors: ["sin(n²x)/n 在 [0, 1]", "√(x² + 1/n) 在 [−1, 1]"],
      timeLimit: 180,
      tags: ["derivswap-hypotheses", "uniform-convergence"],
      hints: ["交換的充分條件：fₙ′ 一致收斂，而且 fₙ 在某一點收斂。", "先求每一列的極限函數，看它在每一點可不可微。"],
      solution: "sin(nx)/n²：fₙ′ = cos(nx)/n 一致收斂到 0 = (0)′ ✓。sin(n²x)/n：fₙ → 0 但 fₙ′(0) = n → ∞。√(x² + 1/n) → |x|，|x| 在 0 不可微（左右導數 −1 與 1），雖然每個 fₙ′(0) = 0。",
      solutionSteps: ["sin(nx)/n²：|fₙ′| = |cos(nx)|/n ≤ 1/n，一致 → 0，極限函數 0 的導數也是 0 ✓。", "sin(n²x)/n：fₙ′(0) = n → ∞，交換失敗。", "√(x² + 1/n) → |x|，在 0 不可微，交換失敗。"],
      verify: { m: "choice", options: [
        { say: "sin(nx)/n² 在 [0, 1]", all: [{ v: { m: "deriv", f: "\\frac{\\sin(1000x)}{10^6}", at: [0] }, lt: 0.01 }] },
        { say: "sin(n²x)/n 在 [0, 1]", all: [{ v: { m: "deriv", f: "\\frac{\\sin(900x)}{30}", at: [0] }, lt: 0.01 }] },
        { say: "√(x² + 1/n) 在 [−1, 1]", all: [{ v: { m: "limit", f: "\\frac{|h|}{h}", at: 0, dir: "+", v: "h" }, eq: { m: "limit", f: "\\frac{|h|}{h}", at: 0, dir: "-", v: "h" } }] }
      ] } },
    { id: "cg-12f-030", topic: "series", rank: 3, answerKind: "text",
      prompt: "f_n(x)=\\frac{x^n}{n}\\text{ 在 }[0,1]\\text{ 上，下列哪一句正確？}",
      answers: ["fₙ 一致收斂到 0，但 lim fₙ′(1) = 1，不等於 0"],
      canonical: "fₙ 一致收斂到 0，但 lim fₙ′(1) = 1，不等於 0",
      distractors: ["fₙ′ 在 [0, 1] 上一致收斂到 0", "fₙ 在 [0, 1] 上不一致收斂"],
      timeLimit: 150,
      tags: ["derivswap-hypotheses", "uniform-convergence"],
      hints: ["sup_{[0,1]} |xⁿ/n| 是多少？", "fₙ′(x) = x^{n−1}，在 x = 1 是多少？"],
      solution: "sup|fₙ| = 1/n → 0，一致收斂到 0。fₙ′(x) = x^{n−1}：x < 1 時 → 0，x = 1 時恆為 1，極限不連續、不一致收斂。所以 lim fₙ′(1) = 1 ≠ 0′ = 0。",
      solutionSteps: ["sup_{[0,1]} xⁿ/n = 1/n → 0：fₙ 一致收斂到 0。", "fₙ′(x) = x^{n−1}，fₙ′(1) = 1，其餘 → 0：fₙ′ 不一致收斂。", "lim fₙ′(1) = 1，而極限函數 0 的導數是 0。"],
      verify: { m: "choice", options: [
        { say: "fₙ 一致收斂到 0，但 lim fₙ′(1) = 1，不等於 0", all: [
          uc("\\frac{x^n}{n}", "0", [0, 1], true),
          { v: { m: "deriv", f: "\\frac{x^{50}}{50}", at: [1] }, eq: 1 }] },
        { say: "fₙ′ 在 [0, 1] 上一致收斂到 0", all: [uc("x^{n-1}", "0", [0, 1], true)] },
        { say: "fₙ 在 [0, 1] 上不一致收斂", all: [uc("\\frac{x^n}{n}", "0", [0, 1], false)] }
      ] } },

    /* ── 12G 分割 ── */
    { id: "cg-12g-001", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "[1,4]\\text{ 的分割 }P=\\{1,\\,1.4,\\,2.1,\\,2.5,\\,3.6,\\,4\\}\\text{。求 }\\|P\\|",
      answer: "1.1", timeLimit: 75,
      tags: ["partition-mesh", "riemann-sum"],
      hints: ["‖P‖ 是最長那一小段的長度。", "把相鄰兩點相減，一段一段列出來。"],
      solution: "各段長 0.4、0.7、0.4、1.1、0.4，最長的是 [2.5, 3.6]，‖P‖ = 1.1。",
      solutionSteps: ["段長：0.4、0.7、0.4、1.1、0.4。", "‖P‖ = 最大段長 = 1.1。"],
      verify: { m: "choice", options: [
        { say: "1.1", all: [
          { v: prod("3.6-2.5"), eq: 1.1 },
          { v: prod("1.4-1"), le: 1.1 }, { v: prod("2.1-1.4"), le: 1.1 }, { v: prod("2.5-2.1"), le: 1.1 }, { v: prod("4-3.6"), le: 1.1 }] }
      ] } },
    { id: "cg-12g-002", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "[0,1]\\text{ 的分割 }P\\,\\text{ 取 }x_k=\\left(\\frac{k}{10}\\right)^2,\\ k=0,1,\\ldots,10\\text{。求 }\\|P\\|",
      answer: "19/100", timeLimit: 90,
      tags: ["partition-mesh", "riemann-sum"],
      hints: ["第 k 段長 x_k − x_{k−1}，化簡成 k 的式子。", "那個式子對 k 遞增還是遞減？"],
      solution: "x_k − x_{k−1} = (k² − (k−1)²)/100 = (2k − 1)/100，對 k 遞增，最長在 k = 10：19/100。",
      solutionSteps: ["x_k − x_{k−1} = (2k − 1)/100。", "對 k 遞增，最大在 k = 10。", "‖P‖ = 19/100。"],
      verify: { m: "choice", options: [
        { say: "19/100", all: [
          { v: prod("1-\\left(\\frac{9}{10}\\right)^2"), eq: 0.19 },
          { v: prod("\\left(\\frac{9}{10}\\right)^2-\\left(\\frac{8}{10}\\right)^2"), le: 0.19 },
          { v: prod("\\left(\\frac{1}{10}\\right)^2"), le: 0.19 }] }
      ] } },
    { id: "cg-12g-003", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "[0,2]\\text{ 的分割 }P=\\{0,\\,1,\\,2\\}\\text{。下列哪一個是 }P\\text{ 的加細？}",
      answers: ["{0, 0.5, 1, 2}"], canonical: "{0, 0.5, 1, 2}",
      distractors: ["{0, 0.6, 1.2, 1.8, 2}", "{0, 0.5, 1.5, 2}"],
      timeLimit: 90,
      tags: ["partition-refinement", "riemann-sum"],
      hints: ["加細的定義：P 的每一個點都要在新分割裡。", "點比較多、段比較短，不代表就是加細。"],
      solution: "加細要包含 P 的每一點，關鍵是 1。{0, 0.5, 1, 2} 含 1 ✓。{0, 0.6, 1.2, 1.8, 2} 段都比較短，但沒有 1；{0, 0.5, 1.5, 2} 也沒有 1。",
      solutionSteps: ["Q 是 P 的加細 ⇔ P ⊂ Q。", "P 的內部點只有 1，看哪個選項含 1。", "只有 {0, 0.5, 1, 2}。"],
      verify: { m: "choice", options: [
        { say: "{0, 0.5, 1, 2}", all: [{ v: prod("(0-1)(0.5-1)(1-1)(2-1)"), eq: 0 }] },
        { say: "{0, 0.6, 1.2, 1.8, 2}", all: [{ v: prod("(0-10)(6-10)(12-10)(18-10)(20-10)"), eq: 0 }] },
        { say: "{0, 0.5, 1.5, 2}", all: [{ v: prod("(0-10)(5-10)(15-10)(20-10)"), eq: 0 }] }
      ] } },
    { id: "cg-12g-004", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "[0,1]\\text{ 上 }P=\\{0,\\,0.5,\\,1\\},\\ Q=\\{0,\\,0.3,\\,0.6,\\,0.9,\\,1\\}\\text{。}Q\\,\\text{ 是不是 }\\,P\\text{ 的加細？}",
      answers: ["不是，因為 0.5 不在 Q 裡"], canonical: "不是，因為 0.5 不在 Q 裡",
      distractors: ["是，因為 ‖Q‖ < ‖P‖", "是，因為 Q 的分割點比較多"],
      timeLimit: 90,
      tags: ["partition-refinement", "riemann-sum"],
      hints: ["加細只看一件事：P 的點是不是全部都在 Q 裡。", "‖Q‖ 比較小跟加細有沒有關係？"],
      solution: "‖Q‖ = 0.3 < ‖P‖ = 0.5，Q 也有比較多點，但 0.5 ∉ Q，所以 Q 不是 P 的加細。加細一定讓 ‖·‖ 不變大，反過來不成立。",
      solutionSteps: ["加細 ⇔ P ⊂ Q。", "0.5 ∈ P 但 0.5 ∉ Q。", "不是加細；‖Q‖ 較小只是陷阱。"],
      verify: { m: "choice", options: [
        { say: "不是，因為 0.5 不在 Q 裡", all: [{ v: prod("(0-5)(3-5)(6-5)(9-5)(10-5)"), ne: 0 }] },
        { say: "是，因為 ‖Q‖ < ‖P‖", all: [{ v: prod("(0-5)(3-5)(6-5)(9-5)(10-5)"), eq: 0 }] },
        { say: "是，因為 Q 的分割點比較多", all: [{ v: prod("(0-5)(3-5)(6-5)(9-5)(10-5)"), eq: 0 }] }
      ] } },
    { id: "cg-12g-005", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "[0,1]\\text{ 上 }P_1=\\{0,\\,0.4,\\,1\\},\\ P_2=\\{0,\\,0.25,\\,0.5,\\,1\\}\\text{。下列哪一個同時是 }P_1\\text{ 與 }P_2\\text{ 的加細？}",
      answers: ["{0, 0.25, 0.4, 0.5, 1}"], canonical: "{0, 0.25, 0.4, 0.5, 1}",
      distractors: ["{0, 0.25, 0.5, 1}", "{0, 0.4, 0.5, 1}", "{0, 0.4, 1}"],
      timeLimit: 120,
      tags: ["partition-refinement", "riemann-sum"],
      hints: ["共同加細要把 P₁ 和 P₂ 的點全部收進來。", "最簡單的共同加細就是 P₁ ∪ P₂。"],
      solution: "共同加細要含 0.4（來自 P₁）以及 0.25、0.5（來自 P₂）。P₁ ∪ P₂ = {0, 0.25, 0.4, 0.5, 1} 是最粗的一個；其他選項各漏了 0.4 或 0.25。",
      solutionSteps: ["要含 P₁ 的內點 0.4 與 P₂ 的內點 0.25、0.5。", "P₁ ∪ P₂ = {0, 0.25, 0.4, 0.5, 1}。", "其餘選項少了 0.4 或 0.25。"],
      verify: { m: "choice", options: [
        { say: "{0, 0.25, 0.4, 0.5, 1}", all: [
          { v: prod("(0-25)(25-25)(40-25)(50-25)(100-25)"), eq: 0 },
          { v: prod("(0-40)(25-40)(40-40)(50-40)(100-40)"), eq: 0 },
          { v: prod("(0-50)(25-50)(40-50)(50-50)(100-50)"), eq: 0 }] },
        { say: "{0, 0.25, 0.5, 1}", all: [{ v: prod("(0-40)(25-40)(50-40)(100-40)"), eq: 0 }] },
        { say: "{0, 0.4, 0.5, 1}", all: [{ v: prod("(0-25)(40-25)(50-25)(100-25)"), eq: 0 }] },
        { say: "{0, 0.4, 1}", all: [{ v: prod("(0-25)(40-25)(100-25)"), eq: 0 }] }
      ] } },

    /* ── 12G 上和與下和 ── */
    { id: "cg-12g-006", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f(x)=x^2\\text{ 在 }[-1,2]\\text{ 上，分割 }P=\\{-1,\\,-0.5,\\,0.5,\\,2\\}\\text{。求上和 }U(f,P)",
      answer: "27/4", timeLimit: 150,
      tags: ["darboux-sum-nonmonotone", "darboux", "riemann-sum"],
      hints: ["x² 不單調：每一段的最大值不一定在右端點。", "中間那段 [−0.5, 0.5] 跨過 0，最大值在哪一端？"],
      solution: "[−1,−0.5]：sup = 1，長 0.5；[−0.5,0.5]：sup = 0.25，長 1；[0.5,2]：sup = 4，長 1.5。U = 0.5 + 0.25 + 6 = 27/4。",
      solutionSteps: ["[−1, −0.5]：sup x² = 1，貢獻 0.5·1 = 0.5。", "[−0.5, 0.5]：sup x² = 0.25，貢獻 1·0.25 = 0.25。", "[0.5, 2]：sup x² = 4，貢獻 1.5·4 = 6。", "U = 6.75 = 27/4。"],
      verify: { m: "let", f: "0.5a+b+1.5c", with: { a: sup("x^2", -1, -0.5), b: sup("x^2", -0.5, 0.5), c: sup("x^2", 0.5, 2) } } },
    { id: "cg-12g-007", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f(x)=\\sin x\\text{ 在 }[0,\\pi]\\text{ 上，分割 }P=\\left\\{0,\\,\\frac{\\pi}{3},\\,\\frac{2\\pi}{3},\\,\\pi\\right\\}\\text{。求上和 }U(f,P)",
      answer: "pi*(sqrt(3)+1)/3", timeLimit: 150,
      tags: ["darboux-sum-nonmonotone", "darboux", "riemann-sum"],
      hints: ["sin x 在 π/2 有最大值，π/2 落在哪一段？", "每段長都是 π/3。"],
      solution: "[0,π/3] 上 sup = sin(π/3) = √3/2；[π/3,2π/3] 含 π/2，sup = 1；[2π/3,π] 上 sup = √3/2。U = (π/3)(√3/2 + 1 + √3/2) = π(√3+1)/3 ≈ 2.861。",
      solutionSteps: ["[0, π/3] 遞增：sup = √3/2。", "[π/3, 2π/3] 含 π/2：sup = 1。", "[2π/3, π] 遞減：sup = √3/2。", "U = (π/3)(√3 + 1) ≈ 2.861。"],
      verify: { m: "let", f: "\\frac{\\pi}{3}(a+b+c)", with: { a: sup("\\sin x", 0, "\\pi/3"), b: sup("\\sin x", "\\pi/3", "2\\pi/3"), c: sup("\\sin x", "2\\pi/3", "\\pi") } } },
    { id: "cg-12g-008", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "f(x)=xe^{-x}\\text{ 在 }[0,3]\\text{ 上，分割 }P=\\{0,\\,1,\\,2,\\,3\\}\\text{。求下和 }L(f,P)",
      answer: "2*exp(-2)+3*exp(-3)", timeLimit: 180,
      tags: ["darboux-sum-nonmonotone", "darboux", "riemann-sum"],
      hints: ["f′(x) = (1 − x)e^{−x}：f 在哪裡遞增、哪裡遞減？", "單調的一段，最小值在端點；看是哪一個端點。"],
      solution: "f 在 [0,1] 遞增、[1,3] 遞減。inf：[0,1] 在 x = 0 為 0；[1,2] 在 x = 2 為 2e⁻²；[2,3] 在 x = 3 為 3e⁻³。段長都是 1，L = 2e⁻² + 3e⁻³ ≈ 0.420。",
      solutionSteps: ["f′(x) = (1 − x)e^{−x}：[0,1] 遞增，[1,3] 遞減。", "inf：[0,1] → f(0) = 0；[1,2] → f(2) = 2e⁻²；[2,3] → f(3) = 3e⁻³。", "L = 0 + 2e⁻² + 3e⁻³ ≈ 0.420。"],
      verify: { m: "let", f: "a+b+c", with: { a: inf("xe^{-x}", 0, 1), b: inf("xe^{-x}", 1, 2), c: inf("xe^{-x}", 2, 3) } } },
    { id: "cg-12g-009", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f(x)=x^2\\text{ 在 }[0,2]\\text{ 上，}P=\\{0,\\,1,\\,2\\}\\text{，加細 }P^*=\\{0,\\,1,\\,1.5,\\,2\\}\\text{。求 }U(f,P)-U(f,P^*)",
      answer: "7/8", timeLimit: 150,
      tags: ["darboux-refinement-lemma", "darboux", "riemann-sum"],
      hints: ["兩個上和分開算：x² 在 [0,2] 遞增，sup 在右端點。", "只有被切開的那一段 [1,2] 會改變。"],
      solution: "U(P) = 1·1 + 1·4 = 5。U(P*) = 1·1 + 0.5·2.25 + 0.5·4 = 4.125。差 = 0.875 = 7/8 ≥ 0：加細讓上和不增。",
      solutionSteps: ["U(f,P) = 1·1 + 1·4 = 5。", "U(f,P*) = 1·1 + 0.5·2.25 + 0.5·4 = 4.125。", "差 = 7/8，上和變小了。"],
      verify: { m: "let", f: "(a+b)-(c+0.5d+0.5g)", with: {
        a: sup("x^2", 0, 1), b: sup("x^2", 1, 2), c: sup("x^2", 0, 1), d: sup("x^2", 1, 1.5), g: sup("x^2", 1.5, 2) } } },
    { id: "cg-12g-010", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f(x)=4x-x^2\\text{ 在 }[0,4]\\text{ 上，}P=\\{0,\\,2,\\,4\\}\\text{，加細 }P^*=\\{0,\\,1,\\,2,\\,3,\\,4\\}\\text{。求 }L(f,P^*)-L(f,P)",
      answer: "6", timeLimit: 150,
      tags: ["darboux-refinement-lemma", "darboux", "riemann-sum"],
      hints: ["f 在 x = 2 最大，兩邊各自單調；每一段的最小值在哪一端？", "L(f,P) 的兩段都碰到端點 0 或 4。"],
      solution: "L(P)：[0,2] 的 inf = f(0) = 0，[2,4] 的 inf = f(4) = 0，L = 0。L(P*)：inf 依序為 0、f(1) = 3、f(3) = 3、0，L = 6。差 6 ≥ 0：加細讓下和不減。",
      solutionSteps: ["L(f,P) = 2·0 + 2·0 = 0。", "L(f,P*)：各段 inf = 0、3、3、0，段長 1，L = 6。", "差 = 6，下和變大了。"],
      verify: { m: "let", f: "(a+b+c+d)-(2g+2h)", with: {
        a: inf("4x-x^2", 0, 1), b: inf("4x-x^2", 1, 2), c: inf("4x-x^2", 2, 3), d: inf("4x-x^2", 3, 4),
        g: inf("4x-x^2", 0, 2), h: inf("4x-x^2", 2, 4) } } },

    /* ── 12G Darboux 積分 ── */
    { id: "cg-12g-011", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "[0,2]\\text{ 上 }f(x)=x\\ (x\\in\\mathbb{Q})\\text{、}f(x)=0\\ (x\\notin\\mathbb{Q})\\text{。求上積分 }\\overline{\\int_0^2}f",
      answer: "2", timeLimit: 150,
      tags: ["darboux-upper-lower-integral", "darboux"],
      hints: ["任何一小段 [a,b] 裡都有有理數也有無理數；sup 會取到哪一邊的值？", "每一段的 sup 是 max(b, 0)，上和就是 x 的右端點和。"],
      solution: "每段 [x_{k−1}, x_k] 裡有理點的 f 值逼近 x_k，所以 sup = x_k；上和就是 x 的右端點 Riemann 和，下確界（取遍分割）= ∫₀² x dx = 2。下積分是 0，所以 f 不可積。",
      solutionSteps: ["有理數稠密：每一段的 sup f = 右端點 x_k。", "U(f,P) = Σ x_k Δx_k，取下確界得 ∫₀² x dx = 2。", "上積分 = 2（下積分 = 0）。"],
      verify: { m: "integral", f: "x", a: 0, b: 2 } },
    { id: "cg-12g-012", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "[0,1]\\text{ 上 }f(x)=1\\ (x\\in\\mathbb{Q})\\text{、}f(x)=x^2\\ (x\\notin\\mathbb{Q})\\text{。求上積分減下積分 }\\overline{\\int_0^1}f-\\underline{\\int_0^1}f",
      answer: "2/3", timeLimit: 180,
      tags: ["darboux-upper-lower-integral", "darboux"],
      hints: ["每一小段上 sup f = max(1, x² 的 sup)，inf f = min(1, x² 的 inf)。", "在 [0,1] 上 x² ≤ 1，所以上下積分各是某個函數的積分。"],
      solution: "x² ≤ 1，每段 sup = 1、inf = 左端點的 x²。上積分 = ∫₀¹ 1 = 1，下積分 = ∫₀¹ x² = 1/3。差 2/3 > 0，f 不可積。",
      solutionSteps: ["有理點、無理點都稠密：每段 sup f = 1，inf f = min x²。", "上積分 = 1，下積分 = ∫₀¹ x² dx = 1/3。", "差 = 2/3。"],
      verify: { m: "integral", f: "1-x^2", a: 0, b: 1 } },
    { id: "cg-12g-013", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "f(x)=x^2\\ (0\\le x\\le 3,\\ x\\ne 1,2)\\text{，但 }f(1)=10,\\ f(2)=-5\\text{。求 }\\int_0^3 f(x)\\,dx",
      answer: "9", timeLimit: 90,
      tags: ["darboux-finite-change", "darboux", "definite-integral"],
      hints: ["改掉有限個點的值，會改變 Riemann 積分嗎？", "那兩個點所在的小段寬度可以任意小。"],
      solution: "改有限個點的值不影響可積性與積分值：含那兩點的小段在上下和裡的貢獻 ≤ 15·(段寬)，可以任意小。∫₀³ f = ∫₀³ x² dx = 9。",
      solutionSteps: ["改有限個點的值不改變積分（貢獻 ≤ 常數 × ‖P‖ → 0）。", "∫₀³ x² dx = 27/3 = 9。"],
      verify: { m: "integral", f: "x^2", a: 0, b: 3 } },
    { id: "cg-12g-014", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "[0,2]\\text{ 上 }f(0)=3\\text{，其餘 }f(x)=0\\text{。把 }[0,2]\\text{ 等分成 }n\\text{ 段，求使上和 }U(f,P_n)<0.07\\text{ 的最小正整數 }n",
      answer: "86", timeLimit: 120,
      tags: ["darboux-finite-change", "darboux"],
      hints: ["哪幾段的 sup 不是 0？", "只有第一段 [0, 2/n] 碰到那個點。"],
      solution: "只有第一段含 x = 0，sup = 3，其他段 sup = 0。U = 3·(2/n) = 6/n < 0.07 ⇔ n > 85.7，最小 n = 86。下和恆為 0，所以積分是 0。",
      solutionSteps: ["只有 [0, 2/n] 的 sup = 3，其餘為 0。", "U(f,Pₙ) = 3·2/n = 6/n。", "6/n < 0.07 ⇔ n > 85.7，n = 86。"],
      verify: { m: "firstIndex", f: "3\\cdot\\frac{2}{n}", below: 0.07 } },

    /* ── 12G Riemann 可積的判準 ── */
    { id: "cg-12g-015", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "f(x)=x+\\lfloor x\\rfloor\\text{ 在 }[0,3]\\text{ 上遞增（在 }x=1,2,3\\text{ 跳）。把 }[0,3]\\text{ 等分成 }n\\text{ 段，求使 }U_n-L_n<0.07\\text{ 的最小正整數 }n",
      answer: "258", timeLimit: 180,
      tags: ["integrability-criterion", "darboux", "riemann-sum"],
      hints: ["遞增函數在每一段的 sup 在右端點、inf 在左端點，跳躍也不例外。", "U − L 的各段相加會消去，只剩 f(3) − f(0) 乘上段寬。"],
      solution: "遞增 ⇒ U − L = Σ[f(x_k) − f(x_{k−1})]·(3/n) = (f(3) − f(0))·3/n = 6·3/n = 18/n。18/n < 0.07 ⇔ n > 257.1，n = 258。跳躍不影響：遞增函數一定可積。",
      solutionSteps: ["遞增：每段 sup − inf = f(x_k) − f(x_{k−1})。", "U − L = (f(3) − f(0))·3/n = 18/n。", "18/n < 0.07 ⇔ n > 257.1，n = 258。"],
      verify: { m: "firstIndex", f: "\\sum_{k=1}^{n}\\left(\\frac{3k}{n}+\\left\\lfloor\\frac{3k}{n}\\right\\rfloor-\\frac{3(k-1)}{n}-\\left\\lfloor\\frac{3(k-1)}{n}\\right\\rfloor\\right)\\frac{3}{n}", below: 0.07 } },
    { id: "cg-12g-016", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "f(x)=\\lfloor x\\rfloor\\text{ 在 }[0,3]\\text{ 上，分割 }P=\\{0,\\,0.9,\\,1.1,\\,1.9,\\,2.1,\\,2.9,\\,3\\}\\text{。求 }U(f,P)-L(f,P)",
      answer: "1/2", timeLimit: 180,
      tags: ["integrability-criterion", "darboux"],
      hints: ["只有含跳躍點的小段 sup ≠ inf。", "別漏了右端點 x = 3：⌊3⌋ 是多少？"],
      solution: "跳在 1、2、3。[0.9,1.1]、[1.9,2.1] 各貢獻 1·0.2；[2.9,3] 含 x = 3，⌊3⌋ = 3，貢獻 1·0.1。其他段 f 為常數。U − L = 0.2 + 0.2 + 0.1 = 1/2。把含跳點的段縮小，U − L 就能任意小。",
      solutionSteps: ["sup − inf ≠ 0 的段只有含 1、2、3 的段。", "[0.9,1.1]：1·0.2；[1.9,2.1]：1·0.2；[2.9,3]：1·0.1。", "U − L = 0.5 = 1/2。"],
      verify: { m: "let", f: "0.9(a-b)+0.2(c-d)+0.8(g-h)+0.2(p-q)+0.8(r-s)+0.1(u-w)", with: {
        a: sup("\\lfloor x\\rfloor", 0, 0.9), b: inf("\\lfloor x\\rfloor", 0, 0.9),
        c: sup("\\lfloor x\\rfloor", 0.9, 1.1), d: inf("\\lfloor x\\rfloor", 0.9, 1.1),
        g: sup("\\lfloor x\\rfloor", 1.1, 1.9), h: inf("\\lfloor x\\rfloor", 1.1, 1.9),
        p: sup("\\lfloor x\\rfloor", 1.9, 2.1), q: inf("\\lfloor x\\rfloor", 1.9, 2.1),
        r: sup("\\lfloor x\\rfloor", 2.1, 2.9), s: inf("\\lfloor x\\rfloor", 2.1, 2.9),
        u: sup("\\lfloor x\\rfloor", 2.9, 3), w: inf("\\lfloor x\\rfloor", 2.9, 3) } } },
    { id: "cg-12g-017", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f(x)=e^{-x}\\text{ 在 }[0,2]\\text{ 上遞減。把 }[0,2]\\text{ 等分成 }n\\text{ 段，求使 }U_n-L_n<0.01\\text{ 的最小正整數 }n",
      answer: "173", timeLimit: 150,
      tags: ["integrability-monotone-bound", "darboux", "riemann-sum"],
      hints: ["遞減函數每一段的 sup 在左端點、inf 在右端點。", "相加會消去，只剩 (f(0) − f(2)) 乘上段寬。"],
      solution: "U − L = (f(0) − f(2))·(2/n) = 2(1 − e⁻²)/n ≈ 1.7293/n < 0.01 ⇔ n > 172.9，n = 173。",
      solutionSteps: ["遞減：每段 sup − inf = f(x_{k−1}) − f(x_k)。", "U − L = (1 − e⁻²)·2/n ≈ 1.7293/n。", "1.7293/n < 0.01 ⇔ n > 172.9，n = 173。"],
      verify: { m: "firstIndex", f: "\\sum_{k=1}^{n}\\left(e^{-2(k-1)/n}-e^{-2k/n}\\right)\\frac{2}{n}", below: 0.01 } },
    { id: "cg-12g-018", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f(x)=\\frac{1}{1+x}\\text{ 在 }[1,4]\\text{ 上遞減。把 }[1,4]\\text{ 等分成 }n\\text{ 段，求使 }U_n-L_n<0.0007\\text{ 的最小正整數 }n",
      answer: "1286", timeLimit: 150,
      tags: ["integrability-monotone-bound", "darboux", "riemann-sum"],
      hints: ["段寬是 3/n，不是 1/n。", "U − L 只剩 (f(1) − f(4)) 乘上段寬。"],
      solution: "U − L = (f(1) − f(4))·3/n = (1/2 − 1/5)·3/n = 0.9/n < 0.0007 ⇔ n > 1285.7，n = 1286。",
      solutionSteps: ["遞減：U − L = (f(1) − f(4))·(3/n)。", "f(1) − f(4) = 1/2 − 1/5 = 0.3，U − L = 0.9/n。", "0.9/n < 0.0007 ⇔ n > 1285.7，n = 1286。"],
      verify: { m: "firstIndex", f: "\\sum_{k=1}^{n}\\left(\\frac{1}{2+3(k-1)/n}-\\frac{1}{2+3k/n}\\right)\\frac{3}{n}", below: 0.0007 } },

    /* ── 12G 連續函數可積 ── */
    { id: "cg-12g-019", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "f(x)=\\sin(3x)\\text{ 在 }[0,\\pi]\\text{ 上。用 }|f(x)-f(y)|\\le K|x-y|\\ (K=\\max|f'|)\\text{ 估計每一小段的 }\\sup f-\\inf f\\text{；把 }[0,\\pi]\\text{ 等分成 }n\\text{ 段，求這個估計保證 }U_n-L_n<0.1\\text{ 的最小 }n",
      answer: "297", timeLimit: 210,
      tags: ["integrable-uc-delta-to-n", "darboux", "lipschitz"],
      hints: ["先求 K = max|f′|。每一段 sup − inf ≤ K·(段寬)。", "U − L ≤ K·(段寬)·(總長)。"],
      solution: "K = max|3cos 3x| = 3，段寬 π/n。U − L ≤ Σ K(π/n)(π/n) = 3π²/n < 0.1 ⇔ n > 30π² ≈ 296.1，n = 297。",
      solutionSteps: ["K = max|3 cos 3x| = 3。", "每段 sup − inf ≤ 3·(π/n)，U − L ≤ 3π²/n。", "3π²/n < 0.1 ⇔ n > 30π² ≈ 296.1，n = 297。"],
      verify: { m: "choice", options: [
        { say: "297", all: [
          { v: { m: "let", f: "\\frac{K\\pi^2}{297}", with: { K: { m: "lipschitz", f: "\\sin(3x)", range: [0, "\\pi"] } } }, lt: 0.1 },
          { v: { m: "let", f: "\\frac{K\\pi^2}{296}", with: { K: { m: "lipschitz", f: "\\sin(3x)", range: [0, "\\pi"] } } }, ge: 0.1 }] }
      ] } },
    { id: "cg-12g-020", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "f(x)=x^3-3x\\text{ 在 }[-2,2]\\text{ 上。用 }|f(x)-f(y)|\\le K|x-y|\\ (K=\\max|f'|)\\text{ 估計每一小段的 }\\sup f-\\inf f\\text{；把 }[-2,2]\\text{ 等分成 }n\\text{ 段，求這個估計保證 }U_n-L_n<0.7\\text{ 的最小 }n",
      answer: "206", timeLimit: 210,
      tags: ["integrable-uc-delta-to-n", "darboux", "lipschitz"],
      hints: ["|f′(x)| = |3x² − 3| 在 [−2,2] 上的最大值在哪裡？", "U − L ≤ K·(段寬)·(總長)，段寬 4/n。"],
      solution: "K = max|3x² − 3| = 9（在 x = ±2）。U − L ≤ 9·(4/n)·4 = 144/n < 0.7 ⇔ n > 205.7，n = 206。",
      solutionSteps: ["K = max_{[−2,2]} |3x² − 3| = 9。", "U − L ≤ 9·(4/n)·4 = 144/n。", "144/n < 0.7 ⇔ n > 205.7，n = 206。"],
      verify: { m: "choice", options: [
        { say: "206", all: [
          { v: { m: "let", f: "\\frac{16K}{206}", with: { K: { m: "lipschitz", f: "x^3-3x", range: [-2, 2] } } }, lt: 0.7 },
          { v: { m: "let", f: "\\frac{16K}{205}", with: { K: { m: "lipschitz", f: "x^3-3x", range: [-2, 2] } } }, ge: 0.7 }] }
      ] } },
    { id: "cg-12g-021", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "f(x)=xe^{-x}\\text{ 在 }[0,3]\\text{ 上。用 }|f(x)-f(y)|\\le K|x-y|\\ (K=\\max|f'|)\\text{ 估計每一小段的 }\\sup f-\\inf f\\text{；把 }[0,3]\\text{ 等分成 }n\\text{ 段，求這個估計保證 }U_n-L_n<0.0065\\text{ 的最小 }n",
      answer: "1385", timeLimit: 210,
      tags: ["integrable-uc-delta-to-n", "darboux", "lipschitz"],
      hints: ["f′(x) = (1 − x)e^{−x}；|f′| 在 [0,3] 上的最大值要比較端點與臨界點。", "U − L ≤ K·(3/n)·3。"],
      solution: "|f′| = |1 − x|e^{−x}：x = 0 時 1，x = 2 時 e⁻² ≈ 0.135（f″ = 0 處），x = 3 時 2e⁻³ ≈ 0.1。K = 1。U − L ≤ 9/n < 0.0065 ⇔ n > 1384.6，n = 1385。",
      solutionSteps: ["|f′(x)| = |1 − x|e^{−x}，最大在 x = 0：K = 1。", "U − L ≤ 1·(3/n)·3 = 9/n。", "9/n < 0.0065 ⇔ n > 1384.6，n = 1385。"],
      verify: { m: "choice", options: [
        { say: "1385", all: [
          { v: { m: "let", f: "\\frac{9K}{1385}", with: { K: { m: "lipschitz", f: "xe^{-x}", range: [0, 3] } } }, lt: 0.0065 },
          { v: { m: "let", f: "\\frac{9K}{1384}", with: { K: { m: "lipschitz", f: "xe^{-x}", range: [0, 3] } } }, ge: 0.0065 }] }
      ] } },
    { id: "cg-12g-022", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "\\text{下列哪一個函數在 }[0,1]\\text{ 上 Riemann 可積？}",
      answers: ["f(x) = sin(1/x)（x > 0），f(0) = 0"], canonical: "f(x) = sin(1/x)（x > 0），f(0) = 0",
      distractors: ["f(x) = 1/x（x > 0），f(0) = 0", "x 為有理數時 f(x) = 1，否則 f(x) = 0"],
      timeLimit: 120,
      tags: ["integrable-hypothesis-counterexample", "darboux"],
      hints: ["Riemann 可積的函數一定有界。", "有界、而且只在一點不連續的函數，可以把那一點關進一個很窄的小段。"],
      solution: "sin(1/x) 有界（|·| ≤ 1），只在 0 不連續：把 [0, δ] 單獨一段，其餘部分連續可積，U − L ≤ 2δ + (任意小)。1/x 無界，上和是 ∞。有理點取 1 的函數每段 sup = 1、inf = 0，U − L 恆為 1。",
      solutionSteps: ["sin(1/x)：有界，只在 0 不連續 ⇒ 可積。", "1/x：在 0 附近無界 ⇒ 不可積。", "有理點為 1：U = 1、L = 0 對每個分割 ⇒ 不可積。"],
      verify: { m: "choice", options: [
        { say: "f(x) = sin(1/x)（x > 0），f(0) = 0", all: [{ v: sup("\\left|\\sin\\frac{1}{x}\\right|", 1e-6, 1), le: 1 }] },
        { say: "f(x) = 1/x（x > 0），f(0) = 0", all: [{ v: sup("\\frac{1}{x}", 1e-9, 1), lt: 1e6 }] },
        { say: "x 為有理數時 f(x) = 1，否則 f(x) = 0", all: [{ v: prod("1-0"), eq: 0 }] }
      ] } },
    { id: "cg-12g-023", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "\\text{下列函數都在 }(0,1]\\text{ 上連續，並令 }f(0)=0\\text{。哪一個在 }[0,1]\\text{ 上不是 Riemann 可積？}",
      answers: ["1/√x"], canonical: "1/√x",
      distractors: ["x·sin(1/x)", "cos(1/x)", "√x·ln x"],
      timeLimit: 120,
      tags: ["integrable-hypothesis-counterexample", "darboux"],
      hints: ["這四個都只可能在 x = 0 出問題。", "在 0 附近有界的，只壞一個點不影響可積。"],
      solution: "x sin(1/x)、cos(1/x)、√x ln x 在 (0,1] 上都有界（|·| ≤ 1），只在 0 可能不連續，所以可積。1/√x 在 0 附近無界，Riemann 積分沒有定義（瑕積分 ∫₀¹ x^{−1/2} dx = 2 存在，但那是另一件事）。",
      solutionSteps: ["Riemann 可積 ⇒ 有界。", "1/√x 在 0 附近無界 ⇒ 不可積。", "其餘三個有界、只在一點不連續 ⇒ 可積。"],
      verify: { m: "choice", options: [
        { say: "1/√x", all: [{ v: sup("\\frac{1}{\\sqrt{x}}", 1e-12, 1), gt: 1e5 }] },
        { say: "x·sin(1/x)", all: [{ v: sup("\\left|x\\sin\\frac{1}{x}\\right|", 1e-12, 1), gt: 1e5 }] },
        { say: "cos(1/x)", all: [{ v: sup("\\left|\\cos\\frac{1}{x}\\right|", 1e-12, 1), gt: 1e5 }] },
        { say: "√x·ln x", all: [{ v: sup("\\left|\\sqrt{x}\\ln x\\right|", 1e-12, 1), gt: 1e5 }] }
      ] } }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE,
    difficulty: Math.min(4, problem.rank),
    ...problem
  })));
})();
