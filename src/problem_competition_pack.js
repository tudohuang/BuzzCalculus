(function () {
  "use strict";

  // Competition-style problems, hard derivatives, and tough applications.
  // All ranked 4-6 so they never enter the easy (R1-2) practice pools.
  // Answers use WebWork notation (log = ln).
  const SOURCE = "Buzz 競賽難題包 2026";
  const TIME = { 4: 150, 5: 240, 6: 340 };
  const problems = [];

  function add(p) {
    const rank = p.rank || 5;
    const rankTags = ["competition"];
    if (rank >= 5) rankTags.push("boss-rank");
    if (rank >= 6) rankTags.push("true-boss");
    problems.push({
      source: SOURCE,
      difficulty: Math.min(4, Math.ceil((rank * 4) / 6)),
      timeLimit: TIME[rank] || 200,
      tabLimit: 1,
      ...p,
      // 名校署名不進 tags：學校名只留在 p.school 供題庫詳情顯示，
      // 免得練習畫面的技巧 chip 變成「名校 / 競賽」這種出處標籤。
      tags: Array.from(new Set([...(p.tags || []), ...rankTags].filter(Boolean)))
    });
  }
  function N(id, topic, rank, prompt, answer, school, tags, solution) {
    add({ id, topic, rank, prompt, answerKind: "numeric", answer, school, tags, solution });
  }
  function X(id, topic, rank, prompt, answer, variable, school, tags, solution) {
    add({ id, topic, rank, prompt, answerKind: "expression", answer, variable, variables: Array.isArray(variable) ? variable : undefined, school, tags, solution });
  }

  /* ===== Competition-style ===== */
  N("putnam-001", "series", 5, "\\sum_{n=1}^{\\infty}\\arctan\\!\\frac{1}{n^2+n+1}", "pi/4", "競賽", ["putnam", "telescoping", "inverse-trig"], "Telescopes to π/2 - arctan(1) = π/4.");
  N("putnam-002", "series", 5, "\\prod_{n=2}^{\\infty}\\frac{n^3-1}{n^3+1}", "2/3", "競賽", ["putnam", "product"], "Telescoping product equals 2/3.");
  N("putnam-003", "limits", 5, "\\lim_{n\\to\\infty}\\prod_{k=1}^{n}\\left(1+\\frac{k}{n}\\right)^{1/n}", "4/exp(1)", "競賽", ["putnam", "product-limit", "riemann-sum"], "log -> ∫_0^1 log(1+x)dx = 2log2-1.");
  N("putnam-004", "integrals", 5, "\\int_{-1}^{1}\\frac{dx}{(1+e^{x})(1+x^2)}", "pi/4", "競賽", ["putnam", "symmetry"], "Add the x->-x reflection.");
  N("putnam-005", "integrals", 6, "\\int_0^{\\pi/2}\\frac{dx}{1+(\\tan x)^{\\sqrt2}}", "pi/4", "競賽", ["putnam", "kings-property"], "King's property, independent of the exponent.");
  N("putnam-006", "series", 6, "\\prod_{n=1}^{\\infty}\\left(1-\\frac{1}{(2n)^2}\\right)", "2/pi", "競賽", ["putnam", "wallis", "product"], "Wallis product gives 2/π.");
  N("putnam-007", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{n}{n^4+n^2+1}", "1/2", "競賽", ["putnam", "telescoping"], "n^4+n^2+1=(n^2+n+1)(n^2-n+1).");
  N("putnam-008", "limits", 5, "\\lim_{x\\to 0}\\frac{1}{x}\\int_0^{x}(1+\\sin 2t)^{1/t}\\,dt", "exp(2)", "競賽", ["putnam", "limit", "ftc"], "Integrand -> e^2; average -> e^2.");
  N("putnam-009", "integrals", 6, "\\int_0^{\\infty}\\frac{dx}{(1+x^2)(1+x^3)}", "pi/4", "競賽", ["putnam", "symmetry"], "x->1/x symmetry gives π/4.");
  N("putnam-010", "limits", 6, "\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}\\frac{1}{1+(k/n)^2}", "pi/4", "競賽", ["putnam", "riemann-sum"], "Riemann sum of 1/(1+x^2).");
  N("putnam-011", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n(n+1)}", "2*log(2)-1", "競賽", ["putnam", "alternating", "telescoping"], "(-1)^{n+1}(1/n - 1/(n+1)).");
  N("putnam-012", "integrals", 6, "\\int_0^{\\infty}\\frac{\\arctan(2x)-\\arctan x}{x}\\,dx", "pi*log(2)/2", "競賽", ["putnam", "frullani"], "Frullani for arctan: (π/2)ln(2/1).");

  /* ===== Hard derivatives ===== */
  N("hd-001", "derivatives", 5, "\\left.\\frac{d^{7}}{dx^{7}}\\frac{1}{1-x}\\right|_{x=0}", "5040", "Cambridge", ["higher-derivative"], "1/(1-x)=Σ x^n, so f^{(7)}(0)=7!.");
  N("hd-002", "derivatives", 4, "\\left.\\frac{d^{4}}{dx^{4}} e^{x^2}\\right|_{x=0}", "12", "MIT", ["higher-derivative", "taylor"], "x^4 coefficient is 1/2!, times 4!.");
  N("hd-003", "derivatives", 5, "\\left.\\frac{d^{6}}{dx^{6}} e^{x^2}\\right|_{x=0}", "120", "MIT", ["higher-derivative", "taylor"], "x^6 coefficient is 1/3!, times 6!.");
  N("hd-004", "derivatives", 5, "\\left.\\frac{d^{10}}{dx^{10}}\\left(x\\sin x\\right)\\right|_{x=0}", "10", "Caltech", ["higher-derivative", "taylor"], "x^10 coefficient of x sin x is 1/9!, times 10!.");
  N("hd-005", "derivatives", 5, "\\left.\\frac{d^{4}}{dx^{4}}\\frac{1}{1+x^2}\\right|_{x=0}", "24", "Princeton", ["higher-derivative", "taylor"], "1/(1+x^2)=1-x^2+x^4-..., x^4 coeff 1.");
  N("hd-006", "derivatives", 6, "\\left.\\frac{d^{5}}{dx^{5}}\\left(e^{x}\\sin x\\right)\\right|_{x=0}", "-4", "Caltech", ["higher-derivative", "complex"], "Imaginary part of (1+i)^5 = -4.");
  N("hd-007", "derivatives", 6, "\\left.\\frac{d^{7}}{dx^{7}}\\arctan x\\right|_{x=0}", "-720", "Princeton", ["higher-derivative", "taylor"], "x^7 coefficient is -1/7, times 7!.");
  N("hd-008", "derivatives", 5, "\\text{Coefficient of }x^7\\text{ in }\\tan x", "17/315", "MIT", ["taylor", "coefficient"], "tan x = x + x^3/3 + 2x^5/15 + 17x^7/315 + ...");
  X("hd-009", "derivatives", 5, "\\frac{d}{dx}\\left(\\arcsin x\\right)^2", "2*arcsin(x)/sqrt(1-x^2)", "x", "Harvard", ["inverse-trig", "chain-rule"], "Chain rule on (arcsin x)^2.");
  X("hd-010", "derivatives", 6, "\\frac{d}{dx}\\,x^{x^2}", "x^(x^2)*(2*x*log(x)+x)", "x", "Caltech", ["log-differentiation"], "Differentiate x^2 log x in the exponent.");
  X("hd-011", "derivatives", 5, "\\frac{d}{dx}\\,\\ln\\tan\\frac{x}{2}", "1/sin(x)", "x", "Oxford", ["trig", "chain-rule"], "Derivative of log tan(x/2) is csc x.");
  N("hd-012", "derivatives", 5, "\\text{Coefficient of }x^4\\text{ in }\\tan^2 x", "2/3", "MIT", ["taylor", "coefficient"], "tan^2 x = x^2 + 2x^4/3 + ...");

  /* ===== Tough applications ===== */
  N("app-001", "derivatives", 4, "\\text{球形氣球以 }100\\,\\tfrac{\\text{cm}^3}{\\text{s}}\\text{ 充氣，}r=5\\text{ 時半徑變化率 }\\tfrac{dr}{dt}", "1/pi", "MIT", ["applications", "related-rates"], "dV/dt = 4πr^2 dr/dt.");
  N("app-002", "derivatives", 5, "\\text{橢圓 }\\tfrac{x^2}{9}+\\tfrac{y^2}{4}=1\\text{ 內接矩形的最大面積}", "12", "Princeton", ["applications", "optimization"], "Max inscribed rectangle area is 2ab.");
  N("app-003", "derivatives", 4, "\\text{曲線 }y=x^2\\text{ 在原點的曲率半徑}", "1/2", "MIT", ["applications", "curvature"], "R = (1+y'^2)^{3/2}/|y''| = 1/2.");
  N("app-004", "derivatives", 5, "\\text{曲線 }y=e^{x}\\text{ 在 }x=0\\text{ 的曲率半徑}", "2*sqrt(2)", "Caltech", ["applications", "curvature"], "R = (1+1)^{3/2}/1 = 2√2.");
  N("app-005", "derivatives", 4, "\\text{對 }\\sqrt2\\text{ 用牛頓法，}x_0=1\\text{ 的一次迭代 }x_1", "3/2", "MIT", ["applications", "newton-method"], "x1 = x0 - (x0^2-2)/(2x0).");
  N("app-006", "derivatives", 4, "\\text{用線性近似估 }\\sqrt{4.1}", "81/40", "Oxford", ["applications", "linear-approximation"], "2 + 0.1/4 = 2.025.");
  N("app-007", "derivatives", 4, "\\min_{x>0}\\left(x+\\frac{4}{x}\\right)", "4", "Cambridge", ["applications", "optimization"], "AM-GM or derivative gives 4 at x=2.");
  N("app-008", "derivatives", 5, "\\text{原點到直線 }3x+4y=10\\text{ 的最短距離}", "2", "Princeton", ["applications", "optimization"], "|−10|/√(9+16)=2.");
  N("app-009", "derivatives", 5, "\\text{半徑 }1\\text{ 球內接圓柱的最大體積}", "4*pi/(3*sqrt(3))", "Harvard", ["applications", "optimization"], "Max cylinder volume in a unit sphere.");
  N("app-010", "derivatives", 6, "\\text{半徑 }1\\text{ 球內接圓錐的最大體積}", "32*pi/81", "Caltech", ["applications", "optimization"], "Max cone volume = 32πR^3/81.");
  N("app-011", "derivatives", 5, "\\text{13 尺梯子下端以 }5\\,\\tfrac{ft}{s}\\text{ 滑離牆，距牆 }12\\text{ 尺時頂端下滑速率}", "12", "MIT", ["applications", "related-rates"], "x dx/dt + y dy/dt = 0; y=5.");
  N("app-012", "derivatives", 6, "\\text{曲線 }y=\\ln x\\text{ 的最大曲率}", "2/(3*sqrt(3))", "Princeton", ["applications", "curvature"], "κ = x/(x^2+1)^{3/2}, max at x=1/√2.");

  // ---- 獨立驗算規格（tools/verify_answers.js 讀）----
  // 文字敘述題的自動辨識器讀不出結構；這裡把幾何翻譯成目標式／約束
  // —— 那是題幹的重述，不是解法。驗算端全走數值。
  const VERIFY = {
    "app-001": { m: "relatedRate", f: "\\frac{4}{3}\\pi r^3", v: "r", at: 5, given: 100 },
    "app-002": { m: "constrained", kind: "max", f: "4xy", g: "\\frac{x^2}{9}+\\frac{y^2}{4}", c: 1, positive: true },
    "app-009": { m: "extremum1d", kind: "max", f: "\\pi\\left(1-\\frac{h^2}{4}\\right)h", v: "h", lo: 0, hi: 2 },
    "app-010": { m: "extremum1d", kind: "max", f: "\\frac{\\pi}{3}(2h-h^2)h", v: "h", lo: 0, hi: 2 },
    // 「下滑速率」是正的：對 −y（高度的負值）微分，得到的就是下降速度
    "app-011": { m: "differential", f: "-\\sqrt{169-x^2}", a: 12, dx: 5 }
  };
  problems.forEach((problem) => {
    if (VERIFY[problem.id]) problem.verify = VERIFY[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

/* ═══ 課程缺口補題 11G 複變入門（cg-11g-）═══ */
(function () {
  "use strict";
  // 課程缺口補題（11G 複變入門）：複數四則與除法、極式與 De Moivre、n 次方根、Euler 公式、
  // e^z 與 Log、映射的像、複變極限（路徑、分量、無窮遠）、方向差商、導數規則、CR 可微點集、
  // 共軛調和函數、全純範圍。判分器沒有複數答案，所以答案是複數的題一律寫成 text + 選項，
  // 每個選項都用複數求值器（verify m: "complex"）正面判定或用反例推翻。
  // 刻意不放 "complex" tag：那個 tag 有 R6 地板，入門題會被抬高。
  const SOURCE = "Buzz course gap fill";

  /* ── 驗算零件（都是題幹的重述，不是解法）── */
  const H = "0.0000001";
  // 複數求值：f 在 at 的實部／虛部／絕對值
  const cv = (f, at, part) => ({ m: "complex", op: "value", f, at, part: part || "re" });
  // 「某個複數式子等於 re + im·i」兩個條件
  const isC = (f, at, re, im, tol) => [
    { v: cv(f, at, "re"), eq: re, tol: tol || 1e-6 },
    { v: cv(f, at, "im"), eq: im, tol: tol || 1e-6 }
  ];
  // 方向差商的落差：沿實軸差商 − 沿虛軸差商 的絕對值（可微 ⇒ 0）。tpl 用 X、Y 寫 f(x, y)
  const sub = (tpl, X, Y) => tpl.replace(/X/g, X).replace(/Y/g, Y);
  const gap = (tpl) => {
    const base = sub(tpl, "x", "y");
    return `((${sub(tpl, `(x+${H})`, "y")})-(${base}))/${H}-((${sub(tpl, "x", `(y+${H})`)})-(${base}))/(${H}*i)`;
  };
  const D = (tpl, at) => cv(gap(tpl), at, "abs");
  const zero = (v, tol) => ({ v, eq: 0, tol: tol || 1e-6 });
  const nonzero = (v) => ({ v, ne: 0 });
  // 選項：[[say, 條件…], …]，第一個是正解
  const choice = (opts) => ({ m: "choice", options: opts.map(([say, all]) => (all === null ? { say, unknown: "定理本身" } : { say, all })) });

  const problems = [
    /* ── complex-numbers：四則、除法、二次方程 ── */
    { id: "cg-11g-001", topic: "derivatives", rank: 1, answerKind: "text",
      prompt: "(3+2i)(1-4i)",
      answer: "11-10i", answers: ["11-10i", "-10i+11"], canonical: "11-10i",
      distractors: ["-5-10i", "3-8i", "11+10i"],
      timeLimit: 45,
      tags: ["complex-arithmetic", "polynomial"],
      hints: ["像多項式一樣分配展開，四項都要乘到。", "展開後出現的 i² 要換成 −1，再把實部、虛部各自合併。"],
      solution: "展開：3 − 12i + 2i − 8i² = 3 + 8 − 10i = 11 − 10i。",
      solutionSteps: ["分配：3·1 + 3·(−4i) + 2i·1 + 2i·(−4i) = 3 − 12i + 2i − 8i²。", "i² = −1：−8i² = +8。", "實部 3 + 8 = 11，虛部 −12 + 2 = −10，答案 11 − 10i。"],
      verify: choice([
        ["11-10i", isC("(3+2i)(1-4i)", 0, 11, -10)],
        ["-5-10i", isC("(3+2i)(1-4i)", 0, -5, -10)],
        ["3-8i", isC("(3+2i)(1-4i)", 0, 3, -8)],
        ["11+10i", isC("(3+2i)(1-4i)", 0, 11, 10)]]) },
    { id: "cg-11g-002", topic: "derivatives", rank: 1, answerKind: "numeric",
      prompt: "i^{2026}",
      answer: "-1",
      timeLimit: 40,
      tags: ["complex-arithmetic", "power"],
      hints: ["i 的次方每 4 次循環一輪：i、−1、−i、1。", "看 2026 除以 4 的餘數。"],
      solution: "2026 = 4·506 + 2，所以 i²⁰²⁶ = (i⁴)⁵⁰⁶·i² = i² = −1。",
      solutionSteps: ["i⁴ = 1，所以只看指數除以 4 的餘數。", "2026 = 4·506 + 2，i²⁰²⁶ = i² = −1。"],
      verify: cv("i^2026", 0, "re") },
    { id: "cg-11g-003", topic: "derivatives", rank: 1, answerKind: "text",
      prompt: "(2-i)^2+3i",
      answer: "3-i", answers: ["3-i", "-i+3"], canonical: "3-i",
      distractors: ["5-i", "3+7i", "5-4i"],
      timeLimit: 45,
      tags: ["complex-arithmetic", "polynomial"],
      hints: ["先用 (a − b)² = a² − 2ab + b² 展開平方。", "i² = −1 會讓實部改變，最後再加上 3i。"],
      solution: "(2 − i)² = 4 − 4i + i² = 3 − 4i，再加 3i 得 3 − i。",
      solutionSteps: ["(2 − i)² = 4 − 4i + i² = 4 − 4i − 1 = 3 − 4i。", "加上 3i：3 − 4i + 3i = 3 − i。"],
      verify: choice([
        ["3-i", isC("(2-i)^2+3i", 0, 3, -1)],
        ["5-i", isC("(2-i)^2+3i", 0, 5, -1)],
        ["3+7i", isC("(2-i)^2+3i", 0, 3, 7)],
        ["5-4i", isC("(2-i)^2+3i", 0, 5, -4)]]) },
    { id: "cg-11g-004", topic: "derivatives", rank: 1, answerKind: "text",
      prompt: "\\frac{10+5i}{1+2i}\\ \\text{（寫成 }a+b\\,i\\text{）}",
      answer: "4-3i", answers: ["4-3i", "-3i+4"], canonical: "4-3i",
      distractors: ["4+3i", "5i", "20-15i"],
      timeLimit: 60,
      tags: ["complex-division", "conjugate"],
      hints: ["分子分母同乘分母的共軛複數，分母就變成實數。", "(1 + 2i)(1 − 2i) = 1 + 4。"],
      solution: "同乘 1 − 2i：(10 + 5i)(1 − 2i) = 10 − 20i + 5i + 10 = 20 − 15i，分母 5，得 4 − 3i。",
      solutionSteps: ["分子分母同乘共軛 1 − 2i，分母 (1 + 2i)(1 − 2i) = 5。", "分子 (10 + 5i)(1 − 2i) = 10 − 20i + 5i − 10i² = 20 − 15i。", "除以 5：4 − 3i。"],
      verify: choice([
        ["4-3i", isC("(10+5i)/(1+2i)", 0, 4, -3)],
        ["4+3i", isC("(10+5i)/(1+2i)", 0, 4, 3)],
        ["5i", isC("(10+5i)/(1+2i)", 0, 0, 5)],
        ["20-15i", isC("(10+5i)/(1+2i)", 0, 20, -15)]]) },
    { id: "cg-11g-005", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\frac{1}{2+i}+\\frac{1}{2-i}",
      answer: "4/5",
      timeLimit: 60,
      tags: ["complex-division", "conjugate"],
      hints: ["兩個分母互為共軛，通分時分母的乘積是實數。", "(2 + i)(2 − i) = 4 − i²。"],
      solution: "通分：[(2 − i) + (2 + i)] / [(2 + i)(2 − i)] = 4/5，虛部互相抵消。",
      solutionSteps: ["公分母 (2 + i)(2 − i) = 4 + 1 = 5。", "分子 (2 − i) + (2 + i) = 4。", "結果 4/5（是實數：z + z̄ 一定是實數）。"],
      verify: cv("1/(2+i)+1/(2-i)", 0, "re") },
    { id: "cg-11g-006", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\frac{(1+i)^2}{1-i}\\ \\text{（寫成 }a+b\\,i\\text{）}",
      answer: "-1+i", answers: ["-1+i", "i-1"], canonical: "-1+i",
      distractors: ["1+i", "-1-i", "2i"],
      timeLimit: 75,
      tags: ["complex-division", "power"],
      hints: ["先算分子：(1 + i)² 會是純虛數。", "再同乘分母的共軛 1 + i。"],
      solution: "(1 + i)² = 2i。2i/(1 − i) = 2i(1 + i)/2 = i + i² = −1 + i。",
      solutionSteps: ["(1 + i)² = 1 + 2i + i² = 2i。", "2i/(1 − i) 同乘 1 + i：2i(1 + i)/[(1 − i)(1 + i)] = (2i − 2)/2。", "= −1 + i。"],
      verify: choice([
        ["-1+i", isC("(1+i)^2/(1-i)", 0, -1, 1)],
        ["1+i", isC("(1+i)^2/(1-i)", 0, 1, 1)],
        ["-1-i", isC("(1+i)^2/(1-i)", 0, -1, -1)],
        ["2i", isC("(1+i)^2/(1-i)", 0, 0, 2)]]) },
    { id: "cg-11g-007", topic: "derivatives", rank: 1, answerKind: "text",
      prompt: "\\text{解 }z^2-4z+13=0",
      answer: "2±3i", answers: ["2±3i", "2+3i,2-3i", "2-3i,2+3i", "2+-3i"], canonical: "2±3i",
      distractors: ["-2±3i", "2±6i", "4±6i"],
      timeLimit: 60,
      tags: ["complex-quadratic-roots", "quadratic-formula"],
      hints: ["判別式 b² − 4ac 是負的，開根號時拿出一個 i。", "√(−36) = 6i，別忘了公式分母還有 2a。"],
      solution: "z = [4 ± √(16 − 52)]/2 = (4 ± 6i)/2 = 2 ± 3i。兩根互為共軛，因為係數都是實數。",
      solutionSteps: ["判別式 16 − 52 = −36，√(−36) = 6i。", "z = (4 ± 6i)/2 = 2 ± 3i。"],
      verify: choice([
        ["2±3i", [...isC("z^2-4z+13", "2+3i", 0, 0), ...isC("z^2-4z+13", "2-3i", 0, 0)]],
        ["-2±3i", [...isC("z^2-4z+13", "-2+3i", 0, 0), ...isC("z^2-4z+13", "-2-3i", 0, 0)]],
        ["2±6i", [...isC("z^2-4z+13", "2+6i", 0, 0), ...isC("z^2-4z+13", "2-6i", 0, 0)]],
        ["4±6i", [...isC("z^2-4z+13", "4+6i", 0, 0), ...isC("z^2-4z+13", "4-6i", 0, 0)]]]) },
    { id: "cg-11g-008", topic: "derivatives", rank: 1, answerKind: "text",
      prompt: "\\text{解 }z^2+6z+10=0",
      answer: "-3±i", answers: ["-3±i", "-3+i,-3-i", "-3-i,-3+i", "-3+-i"], canonical: "-3±i",
      distractors: ["3±i", "-3±2i", "-6±2i"],
      timeLimit: 60,
      tags: ["complex-quadratic-roots", "quadratic-formula"],
      hints: ["可以配方：z² + 6z + 9 = −1。", "(z + 3)² = −1，平方等於 −1 的數有兩個。"],
      solution: "配方 (z + 3)² = −1，所以 z + 3 = ±i，z = −3 ± i。",
      solutionSteps: ["配方：z² + 6z + 10 = (z + 3)² + 1 = 0。", "(z + 3)² = −1 ⟹ z + 3 = ±i。", "z = −3 ± i。"],
      verify: choice([
        ["-3±i", [...isC("z^2+6z+10", "-3+i", 0, 0), ...isC("z^2+6z+10", "-3-i", 0, 0)]],
        ["3±i", [...isC("z^2+6z+10", "3+i", 0, 0), ...isC("z^2+6z+10", "3-i", 0, 0)]],
        ["-3±2i", [...isC("z^2+6z+10", "-3+2i", 0, 0), ...isC("z^2+6z+10", "-3-2i", 0, 0)]],
        ["-6±2i", [...isC("z^2+6z+10", "-6+2i", 0, 0), ...isC("z^2+6z+10", "-6-2i", 0, 0)]]]) },

    /* ── complex-polar：主輻角、De Moivre、n 次方根 ── */
    { id: "cg-11g-009", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\operatorname{Arg}\\left(-1+\\sqrt{3}\\,i\\right)\\ \\text{（主輻角，取值在 }(-\\pi,\\pi]\\text{）}",
      answer: "2*pi/3",
      timeLimit: 60,
      tags: ["complex-argument-quadrant", "polar-form"],
      hints: ["先看這個點在哪個象限：實部負、虛部正。", "參考角 arctan(√3) = π/3，再依象限調整。"],
      solution: "點 (−1, √3) 在第二象限，參考角 π/3，輻角 π − π/3 = 2π/3。只算 arctan(√3/(−1)) = −π/3 會落在錯的象限。",
      solutionSteps: ["(−1, √3) 在第二象限。", "參考角 arctan(√3/1) = π/3。", "第二象限：Arg = π − π/3 = 2π/3。"],
      verify: cv("log(-1+3^(1/2)*i)", 0, "im") },
    { id: "cg-11g-010", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\operatorname{Arg}(-2-2i)\\ \\text{（主輻角，取值在 }(-\\pi,\\pi]\\text{）}",
      answer: "-3*pi/4",
      timeLimit: 60,
      tags: ["complex-argument-quadrant", "polar-form"],
      hints: ["點 (−2, −2) 在第三象限。", "主輻角限定在 (−π, π]，第三象限的角要寫成負的。"],
      solution: "參考角 π/4；第三象限、取 (−π, π] 的代表：−π + π/4 = −3π/4。",
      solutionSteps: ["(−2, −2) 在第三象限，參考角 arctan 1 = π/4。", "第三象限的主輻角是 −(π − π/4) = −3π/4（5π/4 不在 (−π, π] 內）。"],
      verify: cv("log(-2-2i)", 0, "im") },
    { id: "cg-11g-011", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\operatorname{Arg}\\left(-3+\\sqrt{3}\\,i\\right)\\ \\text{（主輻角，取值在 }(-\\pi,\\pi]\\text{）}",
      answer: "5*pi/6",
      timeLimit: 60,
      tags: ["complex-argument-quadrant", "polar-form"],
      hints: ["實部負、虛部正，在第二象限。", "參考角是 arctan(√3/3)。"],
      solution: "參考角 arctan(√3/3) = π/6，第二象限：π − π/6 = 5π/6。",
      solutionSteps: ["(−3, √3) 在第二象限。", "參考角 arctan(√3/3) = π/6。", "Arg = π − π/6 = 5π/6。"],
      verify: cv("log(-3+3^(1/2)*i)", 0, "im") },
    { id: "cg-11g-012", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "(1+i)^{10}",
      answer: "32i", answers: ["32i"], canonical: "32i",
      distractors: ["-32i", "32", "-32"],
      timeLimit: 75,
      tags: ["complex-de-moivre", "power", "polar-form"],
      hints: ["寫成極式：|1 + i| = √2，輻角 π/4。", "De Moivre：長度變成 (√2)¹⁰，角度變成 10·π/4。"],
      solution: "1 + i = √2·e^{iπ/4}，(1 + i)¹⁰ = 32·e^{i·5π/2} = 32·e^{iπ/2} = 32i。",
      solutionSteps: ["1 + i = √2(cos π/4 + i sin π/4)。", "(√2)¹⁰ = 32，角度 10·π/4 = 5π/2 ≡ π/2。", "32(cos π/2 + i sin π/2) = 32i。"],
      verify: choice([
        ["32i", isC("(1+i)^10", 0, 0, 32)],
        ["-32i", isC("(1+i)^10", 0, 0, -32)],
        ["32", isC("(1+i)^10", 0, 32, 0)],
        ["-32", isC("(1+i)^10", 0, -32, 0)]]) },
    { id: "cg-11g-013", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\left(1+\\sqrt{3}\\,i\\right)^{6}",
      answer: "64",
      timeLimit: 70,
      tags: ["complex-de-moivre", "power", "polar-form"],
      hints: ["|1 + √3 i| = 2，輻角 π/3。", "六次方：長度 2⁶，角度乘 6。"],
      solution: "1 + √3 i = 2e^{iπ/3}，六次方 = 64·e^{2πi} = 64。",
      solutionSteps: ["1 + √3 i = 2(cos π/3 + i sin π/3)。", "De Moivre：2⁶(cos 2π + i sin 2π) = 64·1 = 64。"],
      verify: cv("(1+3^(1/2)*i)^6", 0, "re") },
    { id: "cg-11g-014", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\left(\\sqrt{3}-i\\right)^{9}",
      answer: "512i", answers: ["512i"], canonical: "512i",
      distractors: ["-512i", "512", "-512"],
      timeLimit: 80,
      tags: ["complex-de-moivre", "power", "polar-form"],
      hints: ["√3 − i 在第四象限，長度 2，輻角是負的。", "九次方：長度 2⁹，角度乘 9，再化到一圈之內。"],
      solution: "√3 − i = 2e^{−iπ/6}，九次方 = 512·e^{−3πi/2}；−3π/2 ≡ π/2，所以是 512i。",
      solutionSteps: ["√3 − i = 2(cos(−π/6) + i sin(−π/6))。", "2⁹ = 512，角度 9·(−π/6) = −3π/2 ≡ π/2。", "512(cos π/2 + i sin π/2) = 512i。"],
      verify: choice([
        ["512i", isC("(3^(1/2)-i)^9", 0, 0, 512, 1e-6)],
        ["-512i", isC("(3^(1/2)-i)^9", 0, 0, -512, 1e-6)],
        ["512", isC("(3^(1/2)-i)^9", 0, 512, 0, 1e-6)],
        ["-512", isC("(3^(1/2)-i)^9", 0, -512, 0, 1e-6)]]) },
    { id: "cg-11g-015", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "\\text{求 }z^3=8i\\text{ 的所有複數解}",
      answer: "√3+i, −√3+i, −2i", answers: ["√3+i, −√3+i, −2i", "sqrt(3)+i,-sqrt(3)+i,-2i"], canonical: "√3+i, −√3+i, −2i",
      distractors: ["√3+i, √3−i, −2i", "2i, √3−i, −√3−i", "√3+i, −√3+i, 2i"],
      timeLimit: 120,
      tags: ["complex-nth-roots", "polar-form"],
      hints: ["8i = 8e^{iπ/2}；根的長度是 8 的立方根。", "第一個根的角度是 (π/2)/3，其餘每次加 2π/3。"],
      solution: "長度 2，角度 π/6、5π/6、3π/2：2e^{iπ/6} = √3 + i，2e^{5iπ/6} = −√3 + i，2e^{3iπ/2} = −2i。三根平分半徑 2 的圓。",
      solutionSteps: ["8i = 8(cos π/2 + i sin π/2)，根的長度 ∛8 = 2。", "角度 π/6 + 2kπ/3（k = 0, 1, 2）= π/6、5π/6、3π/2。", "對應 √3 + i、−√3 + i、−2i。"],
      verify: choice([
        ["√3+i, −√3+i, −2i", [...isC("(3^(1/2)+i)^3", 0, 0, 8), ...isC("(-3^(1/2)+i)^3", 0, 0, 8), ...isC("(-2i)^3", 0, 0, 8)]],
        ["√3+i, √3−i, −2i", [...isC("(3^(1/2)+i)^3", 0, 0, 8), ...isC("(3^(1/2)-i)^3", 0, 0, 8), ...isC("(-2i)^3", 0, 0, 8)]],
        ["2i, √3−i, −√3−i", [...isC("(2i)^3", 0, 0, 8), ...isC("(3^(1/2)-i)^3", 0, 0, 8), ...isC("(-3^(1/2)-i)^3", 0, 0, 8)]],
        ["√3+i, −√3+i, 2i", [...isC("(3^(1/2)+i)^3", 0, 0, 8), ...isC("(-3^(1/2)+i)^3", 0, 0, 8), ...isC("(2i)^3", 0, 0, 8)]]]) },
    { id: "cg-11g-016", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "\\text{求 }z^4=-16\\text{ 的所有複數解}",
      answer: "±√2±√2 i", answers: ["±√2±√2 i", "±√2±√2i"], canonical: "±√2±√2 i",
      distractors: ["±2, ±2i", "±1±i", "±√2, ±√2 i"],
      timeLimit: 120,
      tags: ["complex-nth-roots", "polar-form"],
      hints: ["−16 = 16e^{iπ}；根的長度是 16 的四次方根。", "第一個根的角度 π/4，之後每次轉 π/2。"],
      solution: "長度 2，角度 π/4、3π/4、5π/4、7π/4：2e^{iπ/4} = √2 + √2 i，其餘是正負號的四種組合 ±√2 ± √2 i（四個符號組合）。",
      solutionSteps: ["−16 = 16(cos π + i sin π)，根的長度 16^{1/4} = 2。", "角度 π/4 + kπ/2（k = 0, 1, 2, 3）。", "2e^{iπ/4} = √2 + √2 i，轉 π/2 得其餘三個：±√2 ± √2 i。"],
      verify: choice([
        ["±√2±√2 i", [...isC("(2^(1/2)+2^(1/2)*i)^4", 0, -16, 0), ...isC("(-2^(1/2)+2^(1/2)*i)^4", 0, -16, 0),
          ...isC("(-2^(1/2)-2^(1/2)*i)^4", 0, -16, 0), ...isC("(2^(1/2)-2^(1/2)*i)^4", 0, -16, 0)]],
        ["±2, ±2i", [...isC("2^4", 0, -16, 0), ...isC("(2i)^4", 0, -16, 0)]],
        ["±1±i", [...isC("(1+i)^4", 0, -16, 0), ...isC("(1-i)^4", 0, -16, 0)]],
        ["±√2, ±√2 i", [...isC("(2^(1/2))^4", 0, -16, 0), ...isC("(2^(1/2)*i)^4", 0, -16, 0)]]]) },
    { id: "cg-11g-017", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "\\text{求 }z^3=-27\\text{ 的所有複數解}",
      answer: "−3, 3/2 ± (3√3/2)i", answers: ["−3, 3/2 ± (3√3/2)i", "-3,3/2±(3√3/2)i"], canonical: "−3, 3/2 ± (3√3/2)i",
      distractors: ["3, −3/2 ± (3√3/2)i", "−3, ±3i", "−3, 3/2 ± (3/2)i"],
      timeLimit: 120,
      tags: ["complex-nth-roots", "polar-form"],
      hints: ["−27 = 27e^{iπ}，根的長度是 3。", "角度從 π/3 開始，每次加 2π/3。"],
      solution: "角度 π/3、π、5π/3：3e^{iπ/3} = 3/2 + (3√3/2)i，3e^{iπ} = −3，3e^{5iπ/3} = 3/2 − (3√3/2)i。",
      solutionSteps: ["−27 = 27(cos π + i sin π)，根的長度 3。", "角度 π/3 + 2kπ/3：π/3、π、5π/3。", "得 3/2 + (3√3/2)i、−3、3/2 − (3√3/2)i。"],
      verify: choice([
        ["−3, 3/2 ± (3√3/2)i", [...isC("(0-3)^3", 0, -27, 0), ...isC("(3/2+3*3^(1/2)/2*i)^3", 0, -27, 0), ...isC("(3/2-3*3^(1/2)/2*i)^3", 0, -27, 0)]],
        ["3, −3/2 ± (3√3/2)i", [...isC("3^3", 0, -27, 0), ...isC("(-3/2+3*3^(1/2)/2*i)^3", 0, -27, 0)]],
        ["−3, ±3i", [...isC("(0-3)^3", 0, -27, 0), ...isC("(3i)^3", 0, -27, 0)]],
        ["−3, 3/2 ± (3/2)i", [...isC("(0-3)^3", 0, -27, 0), ...isC("(3/2+3/2*i)^3", 0, -27, 0)]]]) },

    /* ── euler-formula：用指數化簡三角 ── */
    { id: "cg-11g-018", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\sum_{k=1}^{3}\\cos\\frac{2k\\pi}{7}",
      answer: "-1/2",
      timeLimit: 150,
      tags: ["euler-trig-to-exp", "roots-of-unity", "trig"],
      hints: ["令 ω = e^{2πi/7}，cos(2kπ/7) 是 (ωᵏ + ω⁻ᵏ)/2。", "1 + ω + ω² + ⋯ + ω⁶ = 0，而 ω⁻ᵏ = ω^{7−k}。"],
      solution: "ω = e^{2πi/7}。所求 = (1/2)(ω + ω² + ⋯ + ω⁶) = (1/2)(0 − 1) = −1/2。",
      solutionSteps: ["cos(2kπ/7) = (ωᵏ + ω⁻ᵏ)/2，ω = e^{2πi/7}。", "k = 1, 2, 3 的 ωᵏ 與 ω⁻ᵏ 合起來正好是 ω, ω², …, ω⁶。", "七次單位根總和為 0：ω + ⋯ + ω⁶ = −1，所求 = −1/2。"],
      verify: { m: "series", f: "\\cos\\frac{2n\\pi}{7}", from: 1, to: 3 } },
    { id: "cg-11g-019", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\sin^3\\theta=a\\sin\\theta+b\\sin 3\\theta\\ \\text{對所有 }\\theta\\text{ 成立，求 }b",
      answer: "-1/4",
      timeLimit: 150,
      tags: ["euler-trig-to-exp", "trig-identity", "power-reduction"],
      hints: ["sin θ = (e^{iθ} − e^{−iθ})/(2i)，把它三次方。", "展開後把 e^{3iθ} 與 e^{−3iθ} 配成 sin 3θ。"],
      solution: "sin³θ = (e^{iθ} − e^{−iθ})³/(2i)³ = [2i sin 3θ − 3·2i sin θ]/(−8i) = (3 sin θ − sin 3θ)/4，所以 b = −1/4。",
      solutionSteps: ["(e^{iθ} − e^{−iθ})³ = e^{3iθ} − e^{−3iθ} − 3(e^{iθ} − e^{−iθ}) = 2i sin 3θ − 6i sin θ。", "除以 (2i)³ = −8i：sin³θ = (3 sin θ − sin 3θ)/4。", "a = 3/4，b = −1/4。"],
      verify: { m: "integral", f: "\\frac{1}{\\pi}\\sin^3 x\\sin 3x", a: 0, b: "2\\pi" } },

    /* ── complex-functions：e^z、Log、映射的像 ── */
    { id: "cg-11g-020", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\left|e^{z^2}\\right|\\ \\text{，其中 }z=1+2i",
      answer: "exp(-3)",
      timeLimit: 75,
      tags: ["complex-exp-mapping", "modulus"],
      hints: ["|e^{w}| 只跟 w 的實部有關。", "先算 z² 的實部。"],
      solution: "z² = (1 + 2i)² = −3 + 4i，|e^{z²}| = e^{Re z²} = e^{−3}。",
      solutionSteps: ["z² = 1 + 4i + 4i² = −3 + 4i。", "|e^{a+bi}| = eᵃ|e^{bi}| = eᵃ。", "|e^{z²}| = e^{−3} ≈ 0.0498。"],
      verify: cv("exp((1+2i)^2)", 0, "abs") },
    { id: "cg-11g-021", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "\\text{解 }e^{z}=-2\\text{（求所有解）}",
      answer: "ln 2 + (2k+1)πi，k 為整數", answers: ["ln 2 + (2k+1)πi，k 為整數", "ln2+(2k+1)πi"], canonical: "ln 2 + (2k+1)πi，k 為整數",
      distractors: ["ln 2 + 2kπi，k 為整數", "−ln 2 + (2k+1)πi，k 為整數", "ln 2 + (2k+1)πi/2，k 為整數"],
      timeLimit: 90,
      tags: ["complex-exp-mapping", "periodicity"],
      hints: ["令 z = x + iy，e^z = eˣ(cos y + i sin y)，比長度也比角度。", "長度 eˣ = 2；角度要讓 e^{iy} = −1。"],
      solution: "|e^z| = eˣ = 2 ⟹ x = ln 2；e^{iy} = −1 ⟹ y = π + 2kπ。所以 z = ln 2 + (2k+1)πi。",
      solutionSteps: ["e^{x+iy} = eˣe^{iy}，eˣ 是長度、y 是角度。", "eˣ = 2 ⟹ x = ln 2。", "e^{iy} = −1 ⟹ y = (2k+1)π，z = ln 2 + (2k+1)πi。"],
      verify: choice([
        ["ln 2 + (2k+1)πi，k 為整數", [...isC("exp(log(2)+pi*i)", 0, -2, 0), ...isC("exp(log(2)+3*pi*i)", 0, -2, 0), ...isC("exp(log(2)-pi*i)", 0, -2, 0)]],
        ["ln 2 + 2kπi，k 為整數", [...isC("exp(log(2))", 0, -2, 0), ...isC("exp(log(2)+2*pi*i)", 0, -2, 0)]],
        ["−ln 2 + (2k+1)πi，k 為整數", [...isC("exp(0-log(2)+pi*i)", 0, -2, 0)]],
        ["ln 2 + (2k+1)πi/2，k 為整數", [...isC("exp(log(2)+pi*i/2)", 0, -2, 0)]]]) },
    { id: "cg-11g-022", topic: "derivatives", rank: 2, answerKind: "numeric",
      prompt: "\\operatorname{Arg}\\left(e^{2+5i}\\right)\\ \\text{（主輻角，取值在 }(-\\pi,\\pi]\\text{）}",
      answer: "5-2*pi",
      timeLimit: 75,
      tags: ["complex-exp-mapping", "polar-form"],
      hints: ["e^{2+5i} = e²·e^{5i}：長度 e²，角度 5 弧度。", "5 有沒有落在 (−π, π] 裡？不在的話加減 2π。"],
      solution: "e^{2+5i} 的一個輻角是 5，但 5 > π，減 2π 得 5 − 2π ≈ −1.283，這才是主輻角。",
      solutionSteps: ["e^{2+5i} = e²(cos 5 + i sin 5)，一個輻角是 5。", "5 > π ≈ 3.14，不在 (−π, π]。", "主輻角 = 5 − 2π ≈ −1.283。"],
      verify: cv("log(exp(2+5i))", 0, "im") },
    { id: "cg-11g-023", topic: "derivatives", rank: 3, answerKind: "numeric",
      prompt: "i^{\\,i}\\ \\text{的主值（用 }\\operatorname{Log}\\text{ 定義：}i^{i}=e^{\\,i\\operatorname{Log} i}\\text{）}",
      answer: "exp(-pi/2)",
      timeLimit: 90,
      tags: ["complex-log-multivalued", "complex-exp-mapping"],
      hints: ["先求 Log i：|i| = 1，主輻角 π/2。", "再把 i·Log i 代進指數，i·i 會變成實數。"],
      solution: "Log i = ln 1 + iπ/2 = iπ/2，i^i = e^{i·iπ/2} = e^{−π/2} ≈ 0.2079，竟然是實數。",
      solutionSteps: ["Log i = ln|i| + i Arg i = 0 + iπ/2。", "i·Log i = i·(iπ/2) = −π/2。", "i^i = e^{−π/2} ≈ 0.2079。"],
      verify: cv("i^i", 0, "re") },
    { id: "cg-11g-024", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "\\log i\\ \\text{的所有值（多值的對數，不只主值）}",
      answer: "(π/2 + 2kπ)i，k 為整數", answers: ["(π/2 + 2kπ)i，k 為整數", "(π/2+2kπ)i"], canonical: "(π/2 + 2kπ)i，k 為整數",
      distractors: ["(π/2 + kπ)i，k 為整數", "π/2 + 2kπ，k 為整數", "(2kπ − π/2)i，k 為整數"],
      timeLimit: 90,
      tags: ["complex-log-multivalued", "periodicity"],
      hints: ["log w 的每一個值 L 都滿足 e^L = w。", "e^z 有週期 2πi，所以 i 的輻角可以加任意圈。"],
      solution: "log i = ln|i| + i(arg i) = 0 + i(π/2 + 2kπ)。主值 Log i = iπ/2 只是 k = 0 那一個。",
      solutionSteps: ["log w = ln|w| + i·arg w，arg 可差 2π 的整數倍。", "|i| = 1，arg i = π/2 + 2kπ。", "log i = (π/2 + 2kπ)i，k 為整數。"],
      verify: choice([
        ["(π/2 + 2kπ)i，k 為整數", [...isC("exp(pi/2*i)", 0, 0, 1), ...isC("exp((pi/2+2*pi)*i)", 0, 0, 1), ...isC("exp((pi/2-2*pi)*i)", 0, 0, 1)]],
        ["(π/2 + kπ)i，k 為整數", [...isC("exp(pi/2*i)", 0, 0, 1), ...isC("exp((pi/2+pi)*i)", 0, 0, 1)]],
        ["π/2 + 2kπ，k 為整數", [...isC("exp(pi/2)", 0, 0, 1)]],
        ["(2kπ − π/2)i，k 為整數", [...isC("exp(0-pi/2*i)", 0, 0, 1)]]]) },
    { id: "cg-11g-025", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "w=z^2\\text{ 把直線 }\\operatorname{Re}z=1\\text{ 送到 }w=u+i\\,v\\text{ 平面上的哪條曲線？}",
      answer: "u = 1 − v²/4", answers: ["u = 1 − v²/4", "u=1-v^2/4"], canonical: "u = 1 − v²/4",
      distractors: ["u = 1 + v²/4", "u = 1 − v²/2", "u = v²/4 − 1"],
      timeLimit: 120,
      tags: ["complex-mapping-image", "parametric"],
      hints: ["直線上的點寫成 z = 1 + it，t 是實數。", "算出 z² 的實部 u 與虛部 v，再消去 t。"],
      solution: "z = 1 + it，z² = 1 − t² + 2it：u = 1 − t²，v = 2t。t = v/2 代回：u = 1 − v²/4，開口向左的拋物線。",
      solutionSteps: ["z = 1 + it ⟹ z² = (1 − t²) + 2ti。", "u = 1 − t²，v = 2t。", "t = v/2 ⟹ u = 1 − v²/4（拋物線）。"],
      verify: choice([
        ["u = 1 − v²/4", ["1+2i", "1-i", "1+0.5i"].map((at) => zero({ m: "let", f: "u-(1-v^2/4)", with: { u: cv("z^2", at, "re"), v: cv("z^2", at, "im") } }))],
        ["u = 1 + v²/4", [zero({ m: "let", f: "u-(1+v^2/4)", with: { u: cv("z^2", "1+2i", "re"), v: cv("z^2", "1+2i", "im") } })]],
        ["u = 1 − v²/2", [zero({ m: "let", f: "u-(1-v^2/2)", with: { u: cv("z^2", "1+2i", "re"), v: cv("z^2", "1+2i", "im") } })]],
        ["u = v²/4 − 1", [zero({ m: "let", f: "u-(v^2/4-1)", with: { u: cv("z^2", "1+2i", "re"), v: cv("z^2", "1+2i", "im") } })]]]) },
    { id: "cg-11g-026", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "w=\\frac{1}{z}\\text{ 把直線 }\\operatorname{Re}z=1\\text{ 送到 }w\\text{ 平面上的哪裡？}",
      answer: "|w − 1/2| = 1/2，去掉 w = 0", answers: ["|w − 1/2| = 1/2，去掉 w = 0", "|w-1/2|=1/2"], canonical: "|w − 1/2| = 1/2，去掉 w = 0",
      distractors: ["|w − 1| = 1", "Re w = 1", "|w| = 1"],
      timeLimit: 120,
      tags: ["complex-mapping-image", "conjugate"],
      hints: ["z = 1 + it，把 1/(1 + it) 乘上共軛化成 u + iv。", "算 u² + v² 跟 u 的關係，配方。"],
      solution: "w = 1/(1 + it) = (1 − it)/(1 + t²)：u = 1/(1+t²)，v = −t/(1+t²)，u² + v² = u。配方 (u − 1/2)² + v² = 1/4；t → ±∞ 才趨近 0，所以 0 不在像裡。",
      solutionSteps: ["u = 1/(1 + t²)，v = −t/(1 + t²)。", "u² + v² = 1/(1 + t²) = u。", "(u − 1/2)² + v² = 1/4：圓心 1/2、半徑 1/2 的圓，去掉 w = 0。"],
      verify: choice([
        ["|w − 1/2| = 1/2，去掉 w = 0", ["1+2i", "1-i", "1+0.3i"].map((at) => ({ v: cv("1/z-1/2", at, "abs"), eq: 0.5 }))],
        ["|w − 1| = 1", [{ v: cv("1/z-1", "1+2i", "abs"), eq: 1 }]],
        ["Re w = 1", [{ v: cv("1/z", "1+2i", "re"), eq: 1 }]],
        ["|w| = 1", [{ v: cv("1/z", "1+2i", "abs"), eq: 1 }]]]) },

    /* ── complex-limit：路徑、分量、無窮遠 ── */
    { id: "cg-11g-027", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\lim_{z\\to 0}\\frac{\\overline{z}}{z}",
      answer: "不存在", answers: ["不存在", "DNE"], canonical: "不存在",
      distractors: ["1", "−1", "0"],
      timeLimit: 90,
      tags: ["complex-limit-path", "path-dependence"],
      hints: ["沿實軸 z = t 靠近 0，z̄ = z。", "再沿虛軸 z = it 靠近，z̄ = −z。兩條路比一比。"],
      solution: "沿實軸 z̄/z = t/t = 1；沿虛軸 z̄/z = (−it)/(it) = −1。兩條路徑極限不同，所以不存在。",
      solutionSteps: ["實軸 z = t：z̄/z = 1。", "虛軸 z = it：z̄/z = −1。", "1 ≠ −1，極限不存在。"],
      verify: choice([
        ["不存在", [nonzero({ m: "let", f: "a-b", with: { a: cv("(x-i*y)/(x+i*y)", "0.000001", "re"), b: cv("(x-i*y)/(x+i*y)", "0.000001i", "re") } })]],
        ["1", [{ v: cv("(x-i*y)/(x+i*y)", "0.000001i", "re"), eq: 1 }]],
        ["−1", [{ v: cv("(x-i*y)/(x+i*y)", "0.000001", "re"), eq: -1 }]],
        ["0", [{ v: cv("(x-i*y)/(x+i*y)", "0.000001", "re"), eq: 0 }]]]) },
    { id: "cg-11g-028", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\lim_{z\\to 0}\\frac{\\operatorname{Re}z}{|z|}",
      answer: "不存在", answers: ["不存在", "DNE"], canonical: "不存在",
      distractors: ["1", "0", "1/2"],
      timeLimit: 90,
      tags: ["complex-limit-path", "path-dependence"],
      hints: ["z = x + iy，式子是 x/√(x² + y²)。", "沿正實軸與沿虛軸各算一次。"],
      solution: "沿正實軸 z = t（t > 0）：t/t = 1；沿虛軸 z = it：0/|t| = 0。兩條路徑不同，極限不存在。",
      solutionSteps: ["Re z/|z| = x/√(x² + y²)。", "正實軸：1；虛軸：0。", "兩值不同，極限不存在。"],
      verify: choice([
        ["不存在", [nonzero({ m: "let", f: "a-b", with: { a: cv("x/(x^2+y^2)^(1/2)", "0.000001", "re"), b: cv("x/(x^2+y^2)^(1/2)", "0.000001i", "re") } })]],
        ["1", [{ v: cv("x/(x^2+y^2)^(1/2)", "0.000001i", "re"), eq: 1 }]],
        ["0", [{ v: cv("x/(x^2+y^2)^(1/2)", "0.000001", "re"), eq: 0 }]],
        ["1/2", [{ v: cv("x/(x^2+y^2)^(1/2)", "0.000001", "re"), eq: 0.5 }]]]) },
    { id: "cg-11g-029", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\lim_{z\\to 0}\\frac{\\overline{z}^{\\,2}}{z}\\ \\text{（不存在就選不存在）}",
      answer: "0", answers: ["0"], canonical: "0",
      distractors: ["不存在", "1", "−1"],
      timeLimit: 90,
      tags: ["complex-limit-path", "squeeze"],
      hints: ["跟 z̄/z 不一樣：先看絕對值 |z̄²/z|。", "|z̄| = |z|，所以絕對值可以化成很簡單的東西。"],
      solution: "|z̄²/z| = |z|²/|z| = |z| → 0，不論從哪個方向靠近，所以極限是 0。只找兩條路徑相同不夠，要用絕對值夾。",
      solutionSteps: ["|z̄²/z| = |z̄|²/|z| = |z|。", "z → 0 時 |z| → 0，與方向無關。", "所以極限是 0。"],
      verify: choice([
        ["0", ["0.00000001", "0.00000001i", "0.00000001+0.00000001i", "-0.00000002+0.00000001i"].map((at) => zero(cv("(x-i*y)^2/z", at, "abs")))],
        ["不存在", null],
        ["1", [{ v: cv("(x-i*y)^2/z", "0.00000001", "re"), eq: 1 }]],
        ["−1", [{ v: cv("(x-i*y)^2/z", "0.00000001", "re"), eq: -1 }]]]) },
    { id: "cg-11g-030", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\lim_{z\\to i}\\frac{z^2+1}{z-i}",
      answer: "2i", answers: ["2i"], canonical: "2i",
      distractors: ["0", "−2i", "2"],
      timeLimit: 75,
      tags: ["complex-limit-components", "factoring"],
      hints: ["直接代入是 0/0，先因式分解分子。", "z² + 1 = (z − i)(z + i)。"],
      solution: "z² + 1 = (z − i)(z + i)，約掉 z − i，極限 = i + i = 2i。",
      solutionSteps: ["z² + 1 = (z − i)(z + i)。", "約分後剩 z + i。", "z → i：2i。"],
      verify: choice([
        ["2i", isC("(z^2+1)/(z-i)", "i+0.0000001", 0, 2)],
        ["0", isC("(z^2+1)/(z-i)", "i+0.0000001", 0, 0)],
        ["−2i", isC("(z^2+1)/(z-i)", "i+0.0000001", 0, -2)],
        ["2", isC("(z^2+1)/(z-i)", "i+0.0000001", 2, 0)]]) },
    { id: "cg-11g-031", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\lim_{z\\to 2i}\\frac{z+1}{z-i}\\ \\text{（寫成 }a+b\\,i\\text{）}",
      answer: "2-i", answers: ["2-i", "-i+2"], canonical: "2-i",
      distractors: ["2+i", "-2+i", "1+2i"],
      timeLimit: 75,
      tags: ["complex-limit-components", "conjugate"],
      hints: ["分母在 2i 不是 0，直接代入。", "得到 (1 + 2i)/i，分子分母同乘 −i。"],
      solution: "代入：(2i + 1)/(2i − i) = (1 + 2i)/i = (1 + 2i)(−i) = −i + 2 = 2 − i。",
      solutionSteps: ["分母 2i − i = i ≠ 0，連續函數直接代入。", "(1 + 2i)/i = (1 + 2i)(−i)/1 = 2 − i。"],
      verify: choice([
        ["2-i", isC("(z+1)/(z-i)", "2i", 2, -1)],
        ["2+i", isC("(z+1)/(z-i)", "2i", 2, 1)],
        ["-2+i", isC("(z+1)/(z-i)", "2i", -2, 1)],
        ["1+2i", isC("(z+1)/(z-i)", "2i", 1, 2)]]) },
    { id: "cg-11g-032", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\lim_{z\\to\\infty}\\frac{3z^2+i\\,z}{(1+i)z^2-5}\\ \\text{（寫成 }a+b\\,i\\text{）}",
      answer: "3/2 - 3i/2", answers: ["3/2 - 3i/2", "3/2-(3/2)i", "1.5-1.5i"], canonical: "3/2 - 3i/2",
      distractors: ["3", "3/2 + 3i/2", "0"],
      timeLimit: 90,
      tags: ["complex-limit-infinity", "leading-term"],
      hints: ["分子分母同除以 z²，|z| → ∞ 時 1/z → 0。", "剩下 3/(1 + i)，再乘共軛。"],
      solution: "同除 z²：(3 + i/z)/((1 + i) − 5/z²) → 3/(1 + i) = 3(1 − i)/2 = 3/2 − 3i/2。",
      solutionSteps: ["同除 z²：(3 + i/z)/((1 + i) − 5/z²)。", "|z| → ∞：i/z → 0、5/z² → 0，極限 3/(1 + i)。", "3(1 − i)/2 = 3/2 − 3i/2。"],
      verify: choice([
        ["3/2 - 3i/2", [...isC("(3z^2+i*z)/((1+i)z^2-5)", "1000000", 1.5, -1.5, 1e-4), ...isC("(3z^2+i*z)/((1+i)z^2-5)", "1000000i", 1.5, -1.5, 1e-4)]],
        ["3", isC("(3z^2+i*z)/((1+i)z^2-5)", "1000000", 3, 0, 1e-4)],
        ["3/2 + 3i/2", isC("(3z^2+i*z)/((1+i)z^2-5)", "1000000", 1.5, 1.5, 1e-4)],
        ["0", isC("(3z^2+i*z)/((1+i)z^2-5)", "1000000", 0, 0, 1e-4)]]) },
    { id: "cg-11g-033", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\lim_{z\\to\\infty}\\frac{z^3+2}{i\\,z^3-z}",
      answer: "-i", answers: ["-i"], canonical: "-i",
      distractors: ["i", "1", "0"],
      timeLimit: 75,
      tags: ["complex-limit-infinity", "leading-term"],
      hints: ["比最高次項：分子分母都是三次。", "最高次係數的比是 1/i，再化簡。"],
      solution: "同除 z³：(1 + 2/z³)/(i − 1/z²) → 1/i = −i。",
      solutionSteps: ["同除 z³：(1 + 2/z³)/(i − 1/z²)。", "|z| → ∞ 時極限 1/i。", "1/i = −i（因為 i·(−i) = 1）。"],
      verify: choice([
        ["-i", [...isC("(z^3+2)/(i*z^3-z)", "1000000", 0, -1, 1e-4), ...isC("(z^3+2)/(i*z^3-z)", "1000000i", 0, -1, 1e-4)]],
        ["i", isC("(z^3+2)/(i*z^3-z)", "1000000", 0, 1, 1e-4)],
        ["1", isC("(z^3+2)/(i*z^3-z)", "1000000", 1, 0, 1e-4)],
        ["0", isC("(z^3+2)/(i*z^3-z)", "1000000", 0, 0, 1e-4)]]) },

    /* ── complex-differentiability：方向差商、導數規則 ── */
    { id: "cg-11g-034", topic: "derivatives", rank: 3, answerKind: "numeric",
      prompt: "f(z)=\\overline{z},\\ z_0=2+i\\,\\text{。沿虛軸方向取 }\\,h=i\\,t\\ (t\\text{ 為實數，}t\\to0)\\text{，求 }\\,\\frac{f(z_0+h)-f(z_0)}{h}\\,\\text{ 的極限}",
      answer: "-1",
      timeLimit: 90,
      tags: ["complex-derivative-direction-test", "difference-quotient"],
      hints: ["f(z₀ + h) − f(z₀) = conj(h)，跟 z₀ 無關。", "h = it 時 conj(h) 是多少？"],
      solution: "差商 = h̄/h。h = it：h̄ = −it，差商 = −1。沿實軸則是 +1，兩方向不同，所以 z̄ 在任何點都不可微。",
      solutionSteps: ["[f(z₀ + h) − f(z₀)]/h = h̄/h。", "h = it：(−it)/(it) = −1。", "（對照：h = t 時是 1，兩方向不同 ⟹ 不可微。）"],
      verify: cv("((x-i*y)-(2-i))/(z-(2+i))", "2+1.000001i", "re") },
    { id: "cg-11g-035", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "f(z)=|z|^2,\\ z_0=1\\text{。分別沿實軸 }(h=t)\\text{ 與虛軸 }(h=i\\,t)\\text{ 求差商 }\\frac{f(1+h)-f(1)}{h}\\text{ 的極限，並判斷 }f\\text{ 在 }1\\text{ 可不可微}",
      answer: "實軸得 2、虛軸得 0，不可微", answers: ["實軸得 2、虛軸得 0，不可微"], canonical: "實軸得 2、虛軸得 0，不可微",
      distractors: ["兩個方向都得 2，可微且 f′(1) = 2", "實軸得 2、虛軸得 −2i，不可微", "實軸得 1、虛軸得 0，不可微"],
      timeLimit: 120,
      tags: ["complex-derivative-direction-test", "difference-quotient"],
      hints: ["|1 + h|² = (1 + h)(1 + h̄) = 1 + h + h̄ + |h|²。", "差商 = 1 + h̄/h + h̄，分別代 h = t 與 h = it。"],
      solution: "差商 = (h + h̄ + |h|²)/h。h = t：(2t + t²)/t → 2。h = it：t²/(it) → 0。兩方向不同，在 z = 1 不可微。",
      solutionSteps: ["f(1 + h) − f(1) = h + h̄ + |h|²。", "實軸 h = t：(2t + t²)/t → 2。", "虛軸 h = it：(0 + t²)/(it) → 0。2 ≠ 0，不可微。"],
      verify: choice([
        ["實軸得 2、虛軸得 0，不可微", [{ v: cv("(x^2+y^2-1)/(z-1)", "1.00000001", "re"), eq: 2, tol: 1e-6 }, zero(cv("(x^2+y^2-1)/(z-1)", "1+0.00000001i", "abs"))]],
        ["兩個方向都得 2，可微且 f′(1) = 2", [{ v: cv("(x^2+y^2-1)/(z-1)", "1+0.00000001i", "re"), eq: 2 }]],
        ["實軸得 2、虛軸得 −2i，不可微", [{ v: cv("(x^2+y^2-1)/(z-1)", "1+0.00000001i", "im"), eq: -2 }]],
        ["實軸得 1、虛軸得 0，不可微", [{ v: cv("(x^2+y^2-1)/(z-1)", "1.00000001", "re"), eq: 1 }]]]) },
    { id: "cg-11g-036", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "f(z)=z^3-2i\\,z\\text{，求 }\\,f'(1+i)",
      answer: "4i", answers: ["4i"], canonical: "4i",
      distractors: ["6i", "4", "-4i"],
      timeLimit: 75,
      tags: ["complex-derivative-rules", "complex-derivative", "power-rule"],
      hints: ["多項式的複數導數跟實數一樣：f′(z) = 3z² − 2i。", "(1 + i)² 是純虛數。"],
      solution: "f′(z) = 3z² − 2i，(1 + i)² = 2i，f′(1 + i) = 6i − 2i = 4i。",
      solutionSteps: ["f′(z) = 3z² − 2i。", "(1 + i)² = 2i，3·2i = 6i。", "f′(1 + i) = 6i − 2i = 4i。"],
      verify: choice([
        ["4i", [{ v: { m: "complex", op: "deriv", f: "z^3-2i*z", at: "1+i", part: "re" }, eq: 0, tol: 1e-5 }, { v: { m: "complex", op: "deriv", f: "z^3-2i*z", at: "1+i", part: "im" }, eq: 4, tol: 1e-5 }]],
        ["6i", [{ v: { m: "complex", op: "deriv", f: "z^3-2i*z", at: "1+i", part: "im" }, eq: 6, tol: 1e-5 }]],
        ["4", [{ v: { m: "complex", op: "deriv", f: "z^3-2i*z", at: "1+i", part: "re" }, eq: 4, tol: 1e-5 }]],
        ["-4i", [{ v: { m: "complex", op: "deriv", f: "z^3-2i*z", at: "1+i", part: "im" }, eq: -4, tol: 1e-5 }]]]) },
    { id: "cg-11g-037", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "f(z)=\\frac{z}{z+i}\\text{，求 }f'(i)",
      answer: "-i/4", answers: ["-i/4", "-(1/4)i", "-0.25i"], canonical: "-i/4",
      distractors: ["i/4", "-1/4", "1/4"],
      timeLimit: 90,
      tags: ["complex-derivative-rules", "complex-derivative", "quotient-rule"],
      hints: ["商法則照用：分子 (z + i) − z。", "(2i)² 是負實數。"],
      solution: "f′(z) = [(z + i) − z]/(z + i)² = i/(z + i)²。z = i：i/(2i)² = i/(−4) = −i/4。",
      solutionSteps: ["商法則：f′(z) = i/(z + i)²。", "z = i：(2i)² = −4。", "f′(i) = i/(−4) = −i/4。"],
      verify: choice([
        ["-i/4", [{ v: { m: "complex", op: "deriv", f: "z/(z+i)", at: "i", part: "re" }, eq: 0, tol: 1e-5 }, { v: { m: "complex", op: "deriv", f: "z/(z+i)", at: "i", part: "im" }, eq: -0.25, tol: 1e-5 }]],
        ["i/4", [{ v: { m: "complex", op: "deriv", f: "z/(z+i)", at: "i", part: "im" }, eq: 0.25, tol: 1e-5 }]],
        ["-1/4", [{ v: { m: "complex", op: "deriv", f: "z/(z+i)", at: "i", part: "re" }, eq: -0.25, tol: 1e-5 }]],
        ["1/4", [{ v: { m: "complex", op: "deriv", f: "z/(z+i)", at: "i", part: "re" }, eq: 0.25, tol: 1e-5 }]]]) },
    { id: "cg-11g-038", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "f(z)=\\frac{z^2}{z-1}\\text{，求 }f'(i)\\ \\text{（寫成 }a+b\\,i\\text{）}",
      answer: "1 - i/2", answers: ["1 - i/2", "1-(1/2)i", "1-0.5i"], canonical: "1 - i/2",
      distractors: ["1 + i/2", "-1 + i/2", "2 - i"],
      timeLimit: 100,
      tags: ["complex-derivative-rules", "complex-derivative", "quotient-rule"],
      hints: ["商法則：f′(z) = [2z(z − 1) − z²]/(z − 1)²，先化簡分子。", "(i − 1)² 是純虛數，最後乘共軛。"],
      solution: "f′(z) = (z² − 2z)/(z − 1)²。z = i：分子 −1 − 2i，分母 (i − 1)² = −2i，比值 (1 + 2i)/(2i) = 1 − i/2。",
      solutionSteps: ["f′(z) = (z² − 2z)/(z − 1)²。", "z = i：分子 −1 − 2i，分母 (i − 1)² = −2i。", "(−1 − 2i)/(−2i) = (1 + 2i)/(2i) = (1 + 2i)(−i)/2 = 1 − i/2。"],
      verify: choice([
        ["1 - i/2", [{ v: { m: "complex", op: "deriv", f: "z^2/(z-1)", at: "i", part: "re" }, eq: 1, tol: 1e-5 }, { v: { m: "complex", op: "deriv", f: "z^2/(z-1)", at: "i", part: "im" }, eq: -0.5, tol: 1e-5 }]],
        ["1 + i/2", [{ v: { m: "complex", op: "deriv", f: "z^2/(z-1)", at: "i", part: "im" }, eq: 0.5, tol: 1e-5 }]],
        ["-1 + i/2", [{ v: { m: "complex", op: "deriv", f: "z^2/(z-1)", at: "i", part: "re" }, eq: -1, tol: 1e-5 }]],
        ["2 - i", [{ v: { m: "complex", op: "deriv", f: "z^2/(z-1)", at: "i", part: "re" }, eq: 2, tol: 1e-5 }]]]) },

    /* ── cauchy-riemann：可微點集、共軛調和函數 ── */
    { id: "cg-11g-039", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "f(x+iy)=x^2+i\\,y^2\\text{ 在哪些點可微？}",
      answer: "直線 y = x 上的點", answers: ["直線 y = x 上的點", "y=x"], canonical: "直線 y = x 上的點",
      distractors: ["整個複數平面", "只有 z = 0", "沒有任何點"],
      timeLimit: 120,
      tags: ["cauchy-riemann-check", "cauchy-riemann", "partial-derivative"],
      hints: ["u = x²、v = y²，四個偏導數都連續，可微 ⟺ CR 方程成立。", "列出 u_x = v_y 與 u_y = −v_x。"],
      solution: "u_x = 2x、v_y = 2y，u_y = 0 = −v_x。CR 成立 ⟺ x = y。偏導數連續，所以 f 恰在直線 y = x 上可微。",
      solutionSteps: ["u = x²，v = y²：u_x = 2x，u_y = 0，v_x = 0，v_y = 2y。", "u_y = −v_x 恆成立；u_x = v_y ⟺ x = y。", "偏導數連續，CR 成立處即可微：直線 y = x。"],
      verify: choice([
        ["直線 y = x 上的點", [zero(D("X^2+i*Y^2", "1+i"), 1e-5), zero(D("X^2+i*Y^2", "-2-2i"), 1e-5), nonzero(D("X^2+i*Y^2", "1")), nonzero(D("X^2+i*Y^2", "i"))]],
        ["整個複數平面", [zero(D("X^2+i*Y^2", "1"), 1e-5)]],
        ["只有 z = 0", [nonzero(D("X^2+i*Y^2", "1+i"))]],
        ["沒有任何點", [nonzero(D("X^2+i*Y^2", "0"))]]]) },
    { id: "cg-11g-040", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "f(x+iy)=x^3+i\\,(1-y)^3\\text{ 在哪些點可微？}",
      answer: "只有 z = i", answers: ["只有 z = i", "i", "z=i"], canonical: "只有 z = i",
      distractors: ["只有 z = 0", "只有 z = −i", "虛軸上的每一點"],
      timeLimit: 120,
      tags: ["cauchy-riemann-check", "cauchy-riemann", "partial-derivative"],
      hints: ["u = x³，v = (1 − y)³，算 u_x 與 v_y。", "u_x = v_y 變成「兩個平方和等於 0」。"],
      solution: "u_x = 3x²，v_y = −3(1 − y)²；u_x = v_y ⟺ 3x² + 3(1 − y)² = 0 ⟺ x = 0、y = 1。u_y = v_x = 0 恆成立，所以只在 z = i 可微。",
      solutionSteps: ["u_x = 3x²，v_y = −3(1 − y)²，u_y = 0，v_x = 0。", "u_x = v_y ⟺ x² + (1 − y)² = 0 ⟺ (x, y) = (0, 1)。", "偏導數連續，只在 z = i 可微。"],
      verify: choice([
        ["只有 z = i", [zero(D("X^3+i*(1-Y)^3", "i"), 1e-5), nonzero(D("X^3+i*(1-Y)^3", "0")), nonzero(D("X^3+i*(1-Y)^3", "2i")), nonzero(D("X^3+i*(1-Y)^3", "1+i"))]],
        ["只有 z = 0", [zero(D("X^3+i*(1-Y)^3", "0"), 1e-5)]],
        ["只有 z = −i", [zero(D("X^3+i*(1-Y)^3", "0-i"), 1e-5)]],
        ["虛軸上的每一點", [zero(D("X^3+i*(1-Y)^3", "0"), 1e-5)]]]) },
    { id: "cg-11g-041", topic: "derivatives", rank: 3, answerKind: "expression",
      prompt: "u(x,y)=x^2-y^2+3x\\text{，求共軛調和函數 }v(x,y)\\text{（使 }u+i\\,v\\text{ 全純，且 }v(0,0)=0\\text{）}",
      answer: "2*x*y+3*y",
      variables: ["x", "y"],
      timeLimit: 120,
      tags: ["harmonic-conjugate", "cauchy-riemann", "partial-derivative"],
      hints: ["CR：v_y = u_x，所以先對 y 積分 u_x，常數會是 x 的函數 g(x)。", "再用 v_x = −u_y 決定 g(x)。"],
      solution: "v_y = u_x = 2x + 3 ⟹ v = 2xy + 3y + g(x)。v_x = 2y + g′(x) = −u_y = 2y ⟹ g 是常數，v(0,0) = 0 ⟹ g = 0。",
      solutionSteps: ["v_y = u_x = 2x + 3 ⟹ v = 2xy + 3y + g(x)。", "v_x = 2y + g′(x) 要等於 −u_y = 2y ⟹ g′ = 0。", "v(0,0) = 0 ⟹ v = 2xy + 3y（f = z² + 3z）。"],
      verify: { m: "fn", vars: ["x", "y"], cases: [
        { at: { x: 0, y: 0 }, v: { m: "value", f: "0" } },
        ...[[0.7, -0.4], [1.3, 0.9], [-1.1, 0.5]].flatMap(([x, y]) => [
          { at: { x, y }, d: "y", v: { m: "deriv", f: "x^2-y^2+3x", vars: ["x", "y"], at: [x, y], wrt: "x" } },
          { at: { x, y }, d: "x", v: { m: "deriv", f: "-(x^2-y^2+3x)", vars: ["x", "y"], at: [x, y], wrt: "y" } }])] } },
    { id: "cg-11g-042", topic: "derivatives", rank: 3, answerKind: "expression",
      prompt: "u(x,y)=e^{x}\\cos y+2xy\\text{，求共軛調和函數 }v(x,y)\\text{（使 }u+i\\,v\\text{ 全純，且 }v(0,0)=0\\text{）}",
      answer: "exp(x)*sin(y)+y^2-x^2",
      variables: ["x", "y"],
      timeLimit: 150,
      tags: ["harmonic-conjugate", "cauchy-riemann", "partial-derivative"],
      hints: ["v_y = u_x = eˣ cos y + 2y，對 y 積分，再補一個 g(x)。", "用 v_x = −u_y 定出 g(x)，最後用 v(0,0) = 0 定常數。"],
      solution: "v = eˣ sin y + y² + g(x)；v_x = eˣ sin y + g′(x) = −u_y = eˣ sin y − 2x ⟹ g = −x² + C，C = 0。",
      solutionSteps: ["v_y = u_x = eˣ cos y + 2y ⟹ v = eˣ sin y + y² + g(x)。", "−u_y = eˣ sin y − 2x，比對 v_x ⟹ g′(x) = −2x，g = −x² + C。", "v(0,0) = 0 ⟹ C = 0，v = eˣ sin y + y² − x²。"],
      verify: { m: "fn", vars: ["x", "y"], cases: [
        { at: { x: 0, y: 0 }, v: { m: "value", f: "0" } },
        ...[[0.7, -0.4], [1.3, 0.9], [-1.1, 0.5]].flatMap(([x, y]) => [
          { at: { x, y }, d: "y", v: { m: "deriv", f: "e^{x}\\cos y+2xy", vars: ["x", "y"], at: [x, y], wrt: "x" } },
          { at: { x, y }, d: "x", v: { m: "deriv", f: "-(e^{x}\\cos y+2xy)", vars: ["x", "y"], at: [x, y], wrt: "y" } }])] } },

    /* ── holomorphic：全純範圍、可微 vs 全純 ── */
    { id: "cg-11g-043", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "f(z)=\\frac{z}{z^2+4}\\text{ 在哪裡全純？}",
      answer: "複數平面去掉 2i 與 −2i", answers: ["複數平面去掉 2i 與 −2i"], canonical: "複數平面去掉 2i 與 −2i",
      distractors: ["複數平面去掉 2 與 −2", "複數平面去掉 0", "整個複數平面"],
      timeLimit: 75,
      tags: ["holomorphic-domain", "rational-function"],
      hints: ["有理函數在分母不為 0 的地方都全純。", "z² + 4 = 0 在複數裡有解。"],
      solution: "分母 z² + 4 = 0 ⟺ z = ±2i。有理函數在其餘每一點都全純，所以是複數平面去掉 ±2i。",
      solutionSteps: ["有理函數在分母不為零處全純。", "z² = −4 ⟹ z = ±2i。", "全純範圍：複數平面去掉 2i 與 −2i。"],
      verify: choice([
        ["複數平面去掉 2i 與 −2i", [zero(cv("z^2+4", "2i", "abs")), zero(cv("z^2+4", "0-2i", "abs")), nonzero(cv("z^2+4", "2", "abs"))]],
        ["複數平面去掉 2 與 −2", [zero(cv("z^2+4", "2", "abs"))]],
        ["複數平面去掉 0", [zero(cv("z^2+4", "0", "abs"))]],
        ["整個複數平面", [nonzero(cv("z^2+4", "2i", "abs"))]]]) },
    { id: "cg-11g-044", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "f(z)=\\operatorname{Log}(z-1)\\text{（主值）在哪裡全純？}",
      answer: "複數平面去掉射線 (−∞, 1]", answers: ["複數平面去掉射線 (−∞, 1]"], canonical: "複數平面去掉射線 (−∞, 1]",
      distractors: ["複數平面去掉射線 (−∞, 0]", "複數平面去掉一點 z = 1", "複數平面去掉射線 [1, ∞)"],
      timeLimit: 100,
      tags: ["holomorphic-domain", "branch-cut"],
      hints: ["Log w 在 w 落在 (−∞, 0] 時不連續（輻角從 π 跳到 −π）。", "w = z − 1 落在 (−∞, 0] 等於 z 落在哪裡？"],
      solution: "Log w 在複數平面去掉 (−∞, 0] 上全純。w = z − 1 ∈ (−∞, 0] ⟺ z ∈ (−∞, 1]，所以全純範圍是去掉射線 (−∞, 1]。",
      solutionSteps: ["Log w 全純於 w ∉ (−∞, 0]（切割線上 Arg 跳 2π）。", "w = z − 1：z − 1 ∈ (−∞, 0] ⟺ z ∈ (−∞, 1]。", "全純範圍：複數平面去掉射線 (−∞, 1]。"],
      verify: choice([
        ["複數平面去掉射線 (−∞, 1]", [nonzero(cv("log(z-1+0.000001i)-log(z-1-0.000001i)", "0.5", "im")), nonzero(cv("log(z-1+0.000001i)-log(z-1-0.000001i)", "-3", "im")),
          zero(cv("log(z-1+0.000001i)-log(z-1-0.000001i)", "2", "im"), 1e-4), zero(cv("log(z-1+0.000001i)-log(z-1-0.000001i)", "5", "im"), 1e-4)]],
        ["複數平面去掉射線 (−∞, 0]", [zero(cv("log(z-1+0.000001i)-log(z-1-0.000001i)", "0.5", "im"), 1e-4)]],
        ["複數平面去掉一點 z = 1", [zero(cv("log(z-1+0.000001i)-log(z-1-0.000001i)", "-3", "im"), 1e-4)]],
        ["複數平面去掉射線 [1, ∞)", [nonzero(cv("log(z-1+0.000001i)-log(z-1-0.000001i)", "2", "im"))]]]) },
    { id: "cg-11g-045", topic: "derivatives", rank: 2, answerKind: "text",
      prompt: "f(z)=\\frac{1}{e^{z}-1}\\text{ 在哪裡全純？}",
      answer: "複數平面去掉 2kπi（k 為整數）", answers: ["複數平面去掉 2kπi（k 為整數）"], canonical: "複數平面去掉 2kπi（k 為整數）",
      distractors: ["複數平面去掉 z = 0", "複數平面去掉 kπi（k 為整數）", "整個複數平面"],
      timeLimit: 90,
      tags: ["holomorphic-domain", "periodicity"],
      hints: ["e^z 是整函數，問題只在分母等於 0 的地方。", "e^z = 1 的解不只 z = 0：e^z 有週期。"],
      solution: "e^z = 1 ⟺ z = 2kπi（e^z 週期 2πi）。所以 f 在複數平面去掉 2kπi 的地方全純，不只是去掉 0。",
      solutionSteps: ["e^z 處處全純，商在分母非零處全純。", "e^{x+iy} = 1 ⟺ eˣ = 1、e^{iy} = 1 ⟺ x = 0、y = 2kπ。", "全純範圍：去掉 z = 2kπi。"],
      verify: choice([
        ["複數平面去掉 2kπi（k 為整數）", [zero(cv("exp(z)-1", "0", "abs")), zero(cv("exp(z)-1", "2*pi*i", "abs")), zero(cv("exp(z)-1", "0-2*pi*i", "abs")), nonzero(cv("exp(z)-1", "pi*i", "abs"))]],
        ["複數平面去掉 z = 0", [nonzero(cv("exp(z)-1", "2*pi*i", "abs"))]],
        ["複數平面去掉 kπi（k 為整數）", [zero(cv("exp(z)-1", "pi*i", "abs"))]],
        ["整個複數平面", [nonzero(cv("exp(z)-1", "0", "abs"))]]]) },
    { id: "cg-11g-046", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "f(z)=|z|^2\\text{ 在哪裡全純？}",
      answer: "沒有任何點全純（只在 z = 0 可微）", answers: ["沒有任何點全純（只在 z = 0 可微）", "沒有"], canonical: "沒有任何點全純（只在 z = 0 可微）",
      distractors: ["只在 z = 0 全純", "整個複數平面都全純", "除了 z = 0 以外都全純"],
      timeLimit: 100,
      tags: ["holomorphic-vs-differentiable", "cauchy-riemann"],
      hints: ["u = x² + y²、v = 0，用 CR 找出可微的點。", "全純要求在一整個鄰域裡每一點都可微。"],
      solution: "CR：u_x = 2x = v_y = 0、u_y = 2y = −v_x = 0，只在 z = 0 可微。0 的任何鄰域裡都有不可微的點，所以沒有任何點全純。",
      solutionSteps: ["u = x² + y²，v = 0：CR 要 2x = 0 且 2y = 0。", "只在 z = 0 可微。", "z = 0 附近的點都不可微 ⟹ 0 也不是全純點；沒有任何點全純。"],
      verify: choice([
        ["沒有任何點全純（只在 z = 0 可微）", [zero(D("X^2+Y^2", "0"), 1e-5), nonzero(D("X^2+Y^2", "0.01")), nonzero(D("X^2+Y^2", "0.01i")), nonzero(D("X^2+Y^2", "1+i"))]],
        ["只在 z = 0 全純", [zero(D("X^2+Y^2", "0.01"), 1e-5)]],
        ["整個複數平面都全純", [zero(D("X^2+Y^2", "1"), 1e-5)]],
        ["除了 z = 0 以外都全純", [zero(D("X^2+Y^2", "1"), 1e-5)]]]) },
    { id: "cg-11g-047", topic: "derivatives", rank: 3, answerKind: "text",
      prompt: "f(x+iy)=x^2+y^2+2i\\,xy\\text{：哪裡可微？哪裡全純？}",
      answer: "實軸上每一點可微，但沒有任何點全純", answers: ["實軸上每一點可微，但沒有任何點全純"], canonical: "實軸上每一點可微，但沒有任何點全純",
      distractors: ["實軸上每一點全純", "整個複數平面都全純", "沒有任何點可微"],
      timeLimit: 120,
      tags: ["holomorphic-vs-differentiable", "cauchy-riemann"],
      hints: ["u = x² + y²，v = 2xy，檢查兩條 CR 方程各在哪裡成立。", "可微的點如果只構成一條線，那條線上有沒有開鄰域？"],
      solution: "u_x = 2x = v_y ✓；u_y = 2y、−v_x = −2y，相等 ⟺ y = 0。所以只在實軸上可微；實軸不含任何開圓盤，所以沒有任何點全純。",
      solutionSteps: ["u_x = 2x = v_y 恆成立。", "u_y = 2y 與 −v_x = −2y 相等 ⟺ y = 0：實軸上可微。", "實軸上每一點的鄰域都含 y ≠ 0 的點 ⟹ 沒有任何點全純。"],
      verify: choice([
        ["實軸上每一點可微，但沒有任何點全純", [zero(D("X^2+Y^2+2*i*X*Y", "1"), 1e-5), zero(D("X^2+Y^2+2*i*X*Y", "-2"), 1e-5),
          nonzero(D("X^2+Y^2+2*i*X*Y", "1+0.01i")), nonzero(D("X^2+Y^2+2*i*X*Y", "-2+0.01i"))]],
        ["實軸上每一點全純", [zero(D("X^2+Y^2+2*i*X*Y", "1+0.01i"), 1e-5)]],
        ["整個複數平面都全純", [zero(D("X^2+Y^2+2*i*X*Y", "i"), 1e-5)]],
        ["沒有任何點可微", [nonzero(D("X^2+Y^2+2*i*X*Y", "1"))]]]) }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE, difficulty: Math.min(4, problem.rank), ...problem })));
})();
