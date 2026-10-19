(function () {
  "use strict";

  const SOURCE = "Buzz hardcore 50";
  const hardcoreProblems = [];
  const HARD_HINTS = [
    "This is intentionally above standard drill level.",
    "Choose the technique before expanding algebra."
  ];

  function add(problem) {
    hardcoreProblems.push({
      source: SOURCE,
      difficulty: 4,
      rank: 6,
      timeLimit: 150,
      tabLimit: 1,
      hints: HARD_HINTS,
      ...problem,
      tags: [...(problem.tags || []), "hardcore", "boss-rank", "boss-plus"]
    });
  }

  function numeric(id, topic, prompt, answer, tags, solution, timeLimit = 150) {
    add({
      id,
      topic,
      prompt,
      answerKind: "numeric",
      answer,
      tags,
      solution,
      timeLimit
    });
  }

  function expression(id, prompt, answer, tags, solution, timeLimit = 135) {
    add({
      id,
      topic: "derivatives",
      prompt,
      answerKind: "expression",
      answer,
      variable: "x",
      tags,
      solution,
      timeLimit
    });
  }

  function antiderivative(id, prompt, answer, tags, solution, timeLimit = 160) {
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
    [
      "hc-usub-001",
      "\\int \\frac{x^3}{\\sqrt{1+x^2}}\\,dx",
      "(1+x^2)^(3/2)/3-sqrt(1+x^2)",
      ["substitution", "u-sub", "radical"],
      "Let u=1+x^2, so x^3 dx=(u-1)du/2."
    ],
    [
      "hc-usub-002",
      "\\int x^5e^{x^2}\\,dx",
      "exp(x^2)*(x^4-2*x^2+2)/2",
      ["substitution", "u-sub", "exponential", "integration-by-parts"],
      "Let u=x^2, then integrate u^2 e^u by parts."
    ],
    [
      "hc-usub-003",
      "\\int x\\left(\\ln(1+x^2)\\right)^2\\,dx",
      "(1+x^2)*(log(1+x^2)^2-2*log(1+x^2)+2)/2",
      ["substitution", "u-sub", "log", "integration-by-parts"],
      "Let u=1+x^2, then use the antiderivative of (log u)^2."
    ],
    [
      "hc-usub-004",
      "\\int \\frac{x^2}{1+x^6}\\,dx",
      "atan(x^3)/3",
      ["substitution", "u-sub", "inverse-trig"],
      "Let u=x^3; the integral becomes one third of int du/(1+u^2)."
    ],
    [
      "hc-usub-005",
      "\\int \\frac{x^3}{\\sqrt{1+x^4}\\left(1+\\sqrt{1+x^4}\\right)}\\,dx",
      "log(1+sqrt(1+x^4))/2",
      ["substitution", "u-sub", "radical", "log"],
      "Let u=sqrt(1+x^4); the remaining integral is du/(2(1+u))."
    ],
    [
      "hc-usub-006",
      "\\int e^x\\sqrt{1+e^x}\\,dx",
      "2*(1+exp(x))^(3/2)/3",
      ["substitution", "u-sub", "exponential", "radical"],
      "Let u=1+e^x."
    ]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    antiderivative(id, prompt, answer, tags, solution);
  });

  [
    [
      "hc-usub-007",
      "\\int_0^1 \\frac{x^2}{\\sqrt{1-x^6}}\\,dx",
      "pi/6",
      ["substitution", "u-sub", "definite-integral", "inverse-trig"],
      "Use u=x^3 to reduce the integral to one third of arcsin u from 0 to 1."
    ],
    [
      "hc-usub-008",
      "\\int_0^1 \\frac{x^3}{(1+x^2)^3}\\,dx",
      "1/16",
      ["substitution", "u-sub", "definite-integral", "rational"],
      "Let u=1+x^2; then x^3 dx=(u-1)du/2."
    ],
    [
      "hc-usub-009",
      "\\int_0^{\\pi/2}\\frac{\\sin x\\cos x}{(1+\\sin^2x)^2}\\,dx",
      "1/4",
      ["substitution", "u-sub", "trig", "definite-integral"],
      "Let u=1+sin^2 x; the bounds are 1 and 2."
    ],
    [
      "hc-usub-010",
      "\\int_0^1 \\frac{x^2e^{x^3}}{1+e^{x^3}}\\,dx",
      "log((1+e)/2)/3",
      ["substitution", "u-sub", "exponential", "definite-integral"],
      "Let u=e^{x^3}; then du=3x^2e^{x^3}dx."
    ]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    numeric(id, "integrals", prompt, answer, tags, solution);
  });

  [
    [
      "hc-ibp-002",
      "\\int x^2\\cos(3x)\\,dx",
      "x^2*sin(3*x)/3+2*x*cos(3*x)/9-2*sin(3*x)/27",
      ["integration-by-parts", "ibp", "trig"],
      "Use integration by parts twice and keep the factor 3 through each step."
    ],
    [
      "hc-ibp-003",
      "\\int x^2e^x\\sin x\\,dx",
      "exp(x)*((x^2-1)*sin(x)+(2*x-1-x^2)*cos(x))/2",
      ["integration-by-parts", "ibp", "exponential", "trig"],
      "Use the complex shortcut or cyclic integration by parts."
    ],
    [
      "hc-ibp-005",
      "\\int x(\\arctan x)^2\\,dx",
      "(x^2+1)*atan(x)^2/2-x*atan(x)+log(1+x^2)/2",
      ["integration-by-parts", "ibp", "inverse-trig"],
      "After the first IBP, split x^2/(1+x^2)=1-1/(1+x^2)."
    ],
    [
      "hc-ibp-006",
      "\\int e^{2x}\\sin(3x)\\,dx",
      "exp(2*x)*(2*sin(3*x)-3*cos(3*x))/13",
      ["integration-by-parts", "ibp", "exponential", "trig"],
      "Two IBP rounds return the original integral; solve algebraically."
    ],
    [
      "hc-ibp-007",
      "\\int x^3\\ln x\\,dx",
      "x^4*log(x)/4-x^4/16",
      ["integration-by-parts", "ibp", "log"],
      "Use u=log x and dv=x^3 dx."
    ]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    antiderivative(id, prompt, answer, tags, solution);
  });

  [
    [
      "hc-ibp-008",
      "\\int_0^1 x^4\\ln(1+x)\\,dx",
      "2*log(2)/5-47/300",
      ["integration-by-parts", "ibp", "log", "definite-integral"],
      "IBP leaves int_0^1 x^5/(1+x) dx; divide the polynomial before integrating."
    ],
    [
      "hc-ibp-009",
      "\\int_0^{\\pi/2}x^2\\cos x\\,dx",
      "pi^2/4-2",
      ["integration-by-parts", "ibp", "trig", "definite-integral"],
      "Two IBP rounds give x^2 sin x+2x cos x-2sin x."
    ],
    [
      "hc-ibp-010",
      "\\int_0^1 x^3\\arctan x\\,dx",
      "1/6",
      ["integration-by-parts", "ibp", "inverse-trig", "definite-integral"],
      "IBP reduces the problem to int_0^1 x^4/(1+x^2) dx."
    ]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    numeric(id, "integrals", prompt, answer, tags, solution);
  });

  [
    [
      "hc-rad-001",
      "\\int \\frac{dx}{x^2\\sqrt{x^2-1}}",
      "sqrt(x^2-1)/x",
      ["trig-substitution", "radical", "rational"],
      "Differentiate sqrt(x^2-1)/x, or use x=sec theta."
    ],
    [
      "hc-rad-002",
      "\\int \\frac{dx}{x^2+2x+5}",
      "atan((x+1)/2)/2",
      ["complete-square", "inverse-trig", "rational"],
      "Complete the square: x^2+2x+5=(x+1)^2+4."
    ],
    [
      "hc-rad-003",
      "\\int \\frac{x^2+1}{x^3-x}\\,dx",
      "-log(abs(x))+log(abs(x-1))+log(abs(x+1))",
      ["partial-fraction", "rational"],
      "Decompose into -1/x+1/(x-1)+1/(x+1)."
    ],
    [
      "hc-rad-004",
      "\\int \\frac{dx}{x^4-1}",
      "(log(abs(x-1))-log(abs(x+1)))/4-atan(x)/2",
      ["partial-fraction", "rational"],
      "Split x^4-1 into (x-1)(x+1)(x^2+1)."
    ]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    antiderivative(id, prompt, answer, tags, solution);
  });

  [
    [
      "hc-rad-005",
      "\\int_2^4 \\frac{\\sqrt{x^2-4}}{x}\\,dx",
      "2*sqrt(3)-2*pi/3",
      ["trig-substitution", "radical", "definite-integral"],
      "Use the antiderivative sqrt(x^2-4)-2 arccos(2/x)."
    ],
    [
      "hc-rad-006",
      "\\int_0^{\\pi/2}\\frac{dx}{1+\\sin x}",
      "1",
      ["trig", "rationalize", "definite-integral"],
      "Rationalize to (1-sin x)/cos^2 x, whose antiderivative is tan x-sec x."
    ],
    [
      "hc-rad-007",
      "\\int_0^{\\pi/2}\\sin^5x\\cos^4x\\,dx",
      "8/315",
      ["trig", "beta-function", "wallis", "definite-integral"],
      "Use the beta integral or peel off one sine factor."
    ],
    [
      "hc-rad-008",
      "\\int_0^{\\infty}\\frac{dx}{1+x^6}",
      "pi/3",
      ["improper-integral", "rational", "special-functions"],
      "Use int_0^infty dx/(1+x^a)=pi/a*csc(pi/a)."
    ],
    [
      "hc-rad-010",
      "\\int_0^1 \\frac{x}{\\sqrt{1-x^4}}\\,dx",
      "pi/4",
      ["substitution", "u-sub", "radical", "definite-integral"],
      "Let u=x^2 to reduce the integral to half of arcsin u."
    ]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    numeric(id, "integrals", prompt, answer, tags, solution);
  });

  [
    [
      "hc-der-003",
      "\\frac{d}{dx}\\left(e^{e^{2x}+x^2}\\right)",
      "exp(exp(2*x)+x^2)*(2*exp(2*x)+2*x)",
      ["exponential", "chain-rule"],
      "Differentiate the outer exponential and then the exponent."
    ]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    expression(id, prompt, answer, tags, solution);
  });

  [
    [
      "hc-der-004",
      "\\left.\\frac{d^5}{dx^5}\\left(x^4e^{3x}\\right)\\right|_{x=0}",
      "360",
      ["higher-derivative", "exponential", "leibniz-rule"],
      "Only the fourth derivative of x^4 survives at x=0 in the Leibniz sum."
    ],
    [
      "hc-der-005",
      "\\left.\\frac{d^7}{dx^7}\\left(x^2\\sin x\\right)\\right|_{x=0}",
      "42",
      ["higher-derivative", "taylor", "trig"],
      "The x^7 coefficient in x^2 sin x is 1/120."
    ],
    [
      "hc-der-006",
      "\\left.\\frac{d^8}{dx^8}e^{x^2}\\right|_{x=0}",
      "1680",
      ["higher-derivative", "taylor", "exponential"],
      "The x^8 coefficient is 1/4!, then multiply by 8!."
    ],
    [
      "hc-der-007",
      "\\left.\\frac{d^{10}}{dx^{10}}\\left(\\frac{\\sin x}{x}\\right)\\right|_{x=0}",
      "-1/11",
      ["higher-derivative", "taylor", "removable-singularity"],
      "Use sin x/x=sum (-1)^k x^{2k}/(2k+1)!."
    ],
    [
      "hc-der-008",
      "y=e^{xy},\\ y(0)=1.\\ \\text{Find }y'''(0)",
      "16",
      ["implicit-differentiation", "higher-derivative", "series"],
      "From log y=xy, the series begins y=1+x+3x^2/2+8x^3/3+..."
    ],
    [
      "hc-der-009",
      "\\left.\\frac{d^{12}}{dx^{12}}\\cos(2x)\\right|_{x=0}",
      "4096",
      ["higher-derivative", "trig"],
      "The twelfth derivative returns cosine with factor 2^12."
    ],
    [
      "hc-der-010",
      "\\left.\\frac{d^9}{dx^9}\\left(e^x\\sin x\\right)\\right|_{x=0}",
      "16",
      ["higher-derivative", "exponential", "trig"],
      "Use Im((1+i)^9), or the Taylor coefficient of e^x sin x."
    ]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    numeric(id, "derivatives", prompt, answer, tags, solution);
  });

  [
    [
      "hc-spec-002",
      "\\int_0^{\\infty}\\frac{\\sqrt{x}}{(1+x)^3}\\,dx",
      "pi/8",
      ["beta-function", "improper-integral", "special-functions"],
      "This is B(3/2,3/2)."
    ],
    [
      "hc-spec-005",
      "\\int_0^{\\infty}\\frac{x^5}{e^x-1}\\,dx",
      "8*pi^6/63",
      ["gamma-function", "zeta", "improper-integral", "special-functions"],
      "Use Gamma(6)zeta(6)."
    ],
    [
      "hc-spec-006",
      "\\int_0^{\\infty}x^4e^{-2x^2}\\,dx",
      "3*sqrt(pi)/(32*sqrt(2))",
      ["gamma-function", "gaussian-integral", "special-functions"],
      "Use int_0^infty x^m e^{-a x^2} dx=Gamma((m+1)/2)/(2a^{(m+1)/2})."
    ],
    [
      "hc-spec-007",
      "\\sum_{n=1}^{\\infty}\\frac{1}{n(n+1)(n+2)(n+3)(n+4)}",
      "1/96",
      ["series", "telescoping", "partial-fraction"],
      "Write it as a telescoping difference of four-factor denominators."
    ],
    [
      "hc-spec-009",
      "\\text{Radius of convergence of }\\sum_{n=0}^{\\infty}\\frac{(3n)!}{(n!)^3}x^n",
      "1/27",
      ["series", "power-series", "ratio-test"],
      "The coefficient ratio tends to 27."
    ],
    [
      "hc-spec-010",
      "\\text{coefficient of }x^8\\text{ in }J_0(x)",
      "1/147456",
      ["series", "bessel", "special-functions"],
      "J_0(x)=sum (-1)^k (x^2/4)^k/(k!)^2; use k=4."
    ]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    const topic = id.startsWith("hc-spec-007") || id.startsWith("hc-spec-008") || id.startsWith("hc-spec-009") || id.startsWith("hc-spec-010") ? "series" : "integrals";
    numeric(id, topic, prompt, answer, tags, solution, 160);
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(hardcoreProblems);
})();

(function () {
  "use strict";
  // 課程缺口補題（11D Gamma 與 Beta、11F 經典問題、12J Lebesgue 積分）：遞迴與左延拓、縮放與 Beta 變形、
  // 配方的 Gaussian、Dirichlet 的分段、log-sine 換元、Basel 的 x⁴ 係數；Lebesgue 端都問成算得出來的數，
  // 判斷題的每個誘答用具體反例（收斂判定、Cantor 集的測度）否定。
  const SOURCE = "Buzz course gap fill";
  // Cantor 集被挖掉的總長度：第 n 步挖掉 2^{n−1} 段、每段 3^{−n}。m(C) = 1 − 這個和。
  const CANTOR_REMOVED = { m: "series", f: "\\frac{2^{n-1}}{3^n}", from: 1 };
  const conv = (f, a, b, sing, claim) => ({ v: { m: "improperConverges", f, a, b, sing }, claim });
  const problems = [
    /* ── 11D Gamma 的定義與收斂 ── */
    { id: "cg-11d-001", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_0^{\\infty}x^3e^{-2x}\\,dx",
      answer: "3/8", timeLimit: 90,
      tags: ["gamma-scaling", "gamma-function", "improper-integral"],
      hints: ["令 u = 2x，把指數變回 e^{−u}。", "換完之後是 Γ 的哪一個值，前面還多了 2 的幾次方？"],
      solution: "令 u = 2x：∫₀^∞ (u/2)³ e^{−u} du/2 = Γ(4)/2⁴ = 6/16 = 3/8。一般地 ∫₀^∞ x^{s−1}e^{−ax}dx = Γ(s)/aˢ。"},
    { id: "cg-11d-002", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "\\text{Gamma 積分 }\\int_0^{\\infty}x^{s-1}e^{-x}\\,dx\\text{ 對哪些實數 }s\\text{ 收斂？}",
      answer: "s > 0", answers: ["s > 0"], canonical: "s > 0",
      distractors: ["s > 1", "s ≥ 0", "所有實數 s"], timeLimit: 120,
      tags: ["gamma-convergence", "gamma-function", "improper-integral"],
      hints: ["把積分切成 [0,1] 與 [1,∞) 兩段，各自看哪裡出問題。", "x → ∞ 時 e^{−x} 壓得住任何次方；x → 0⁺ 時 e^{−x} ≈ 1，剩下 x^{s−1} 的 p 判別。"],
      solution: "[1,∞) 那段：e^{−x} 衰減比任何多項式快，永遠收斂。[0,1] 那段：e^{−x} ≈ 1，等於 ∫₀¹x^{s−1}dx，要 s − 1 > −1，也就是 s > 0。所以收斂的條件是 s > 0。",
      
      verify: { m: "choice", options: [
        { say: "s > 0", all: [conv("x^{-1/2}e^{-x}", 0, "inf", [0], true), conv("x^{-1}e^{-x}", 0, "inf", [0], false)] },
        { say: "s > 1", all: [conv("x^{-1/2}e^{-x}", 0, "inf", [0], false)] },
        { say: "s ≥ 0", all: [conv("x^{-1}e^{-x}", 0, "inf", [0], true)] },
        { say: "所有實數 s", all: [conv("x^{-2}e^{-x}", 0, "inf", [0], true)] }
      ] } },
    { id: "cg-11d-003", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "\\text{取 }s=-\\frac{1}{2}\\text{，積分 }\\int_0^{\\infty}x^{s-1}e^{-x}\\,dx\\text{ 發散。問題出在哪一端？}",
      answer: "x → 0⁺ 那一端發散", answers: ["x → 0⁺ 那一端發散"], canonical: "x → 0⁺ 那一端發散",
      distractors: ["x → ∞ 那一端發散", "兩端都發散", "其實收斂"], timeLimit: 120,
      tags: ["gamma-convergence", "gamma-function", "improper-integral"],
      hints: ["被積函數是 x^{−3/2}e^{−x}，兩端分開看。", "x → 0⁺ 時 e^{−x} → 1，剩下 x 的幾次方？那個次方的 p 判別怎麼說？"],
      solution: "s = −1/2 時被積函數是 x^{−3/2}e^{−x}。x → ∞：e^{−x} 讓它收斂。x → 0⁺：它和 x^{−3/2} 同階，而 ∫₀¹x^{−3/2}dx 發散（次方 ≤ −1）。所以只有 0 那一端壞掉。",
      
      verify: { m: "choice", options: [
        { say: "x → 0⁺ 那一端發散", all: [conv("x^{-3/2}e^{-x}", 0, 1, [0], false), conv("x^{-3/2}e^{-x}", 1, "inf", [], true)] },
        { say: "x → ∞ 那一端發散", all: [conv("x^{-3/2}e^{-x}", 1, "inf", [], false)] },
        { say: "兩端都發散", all: [conv("x^{-3/2}e^{-x}", 1, "inf", [], false)] },
        { say: "其實收斂", all: [conv("x^{-3/2}e^{-x}", 0, "inf", [0], true)] }
      ] } },

    /* ── 11D Gamma 遞迴：非整數的位移比值與往左延拓 ── */
    { id: "cg-11d-004", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求 }\\frac{\\Gamma\\left(\\frac{11}{3}\\right)}{\\Gamma\\left(\\frac{2}{3}\\right)}",
      answer: "80/27", timeLimit: 90,
      tags: ["gamma-shift-ratio", "gamma-function"],
      hints: ["Γ(s+1) = sΓ(s)：從 11/3 一路往下拆到 2/3。", "11/3 和 2/3 差 3，所以會拆出三個因子。"],
      solution: "Γ(11/3) = (8/3)(5/3)(2/3)Γ(2/3)，所以比值 = (8·5·2)/27 = 80/27。Γ(2/3) 本身不必知道。",
      
      verify: { m: "value", f: "\\frac{\\Gamma(11/3)}{\\Gamma(2/3)}" } },
    { id: "cg-11d-005", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求 }\\frac{\\Gamma\\left(\\frac{9}{4}\\right)}{\\Gamma\\left(\\frac{1}{4}\\right)}",
      answer: "5/16", timeLimit: 90,
      tags: ["gamma-shift-ratio", "gamma-function"],
      hints: ["9/4 比 1/4 大 2，用兩次 Γ(s+1) = sΓ(s)。", "每拆一次，乘上的是「拆之前那個引數減 1」。"],
      solution: "Γ(9/4) = (5/4)Γ(5/4) = (5/4)(1/4)Γ(1/4)，比值 = 5/16。",
      
      verify: { m: "value", f: "\\frac{\\Gamma(9/4)}{\\Gamma(1/4)}" } },
    { id: "cg-11d-006", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求 }\\frac{\\Gamma\\left(\\frac{7}{2}\\right)\\Gamma\\left(\\frac{1}{3}\\right)}{\\Gamma\\left(\\frac{1}{2}\\right)\\Gamma\\left(\\frac{7}{3}\\right)}",
      answer: "135/32", timeLimit: 120,
      tags: ["gamma-shift-ratio", "gamma-function"],
      hints: ["分成兩個比值：Γ(7/2)/Γ(1/2) 與 Γ(1/3)/Γ(7/3)。", "第二個比值是倒過來的：Γ(7/3) 拆到 Γ(1/3) 會拆出哪兩個因子？"],
      solution: "Γ(7/2)/Γ(1/2) = (5/2)(3/2)(1/2) = 15/8；Γ(7/3) = (4/3)(1/3)Γ(1/3)，所以 Γ(1/3)/Γ(7/3) = 9/4。相乘 15/8 · 9/4 = 135/32。",
      
      verify: { m: "value", f: "\\frac{\\Gamma(7/2)\\Gamma(1/3)}{\\Gamma(1/2)\\Gamma(7/3)}" } },
    { id: "cg-11d-007", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{用 }\\Gamma(s)=\\frac{\\Gamma(s+1)}{s}\\text{ 往左延拓，求 }\\Gamma\\left(-\\frac{3}{2}\\right)",
      answer: "4*sqrt(pi)/3", timeLimit: 120,
      tags: ["gamma-left-extension", "gamma-function"],
      hints: ["先寫 Γ(−3/2) = Γ(−1/2)/(−3/2)，再把 Γ(−1/2) 也用同一條公式往右推。", "最後會落到 Γ(1/2) = √π；注意兩個負號相乘。"],
      solution: "Γ(−1/2) = Γ(1/2)/(−1/2) = −2√π；Γ(−3/2) = Γ(−1/2)/(−3/2) = (−2√π)/(−3/2) = 4√π/3。",
      
      verify: { m: "value", f: "\\Gamma(-3/2)" } },
    { id: "cg-11d-008", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求 }\\frac{\\Gamma\\left(-\\frac{5}{3}\\right)}{\\Gamma\\left(\\frac{1}{3}\\right)}",
      answer: "9/10", timeLimit: 120,
      tags: ["gamma-left-extension", "gamma-function"],
      hints: ["Γ(s) = Γ(s+1)/s：從 −5/3 往右推兩步會到 1/3。", "兩個分母都是負數，乘起來的正負號是什麼？"],
      solution: "Γ(−5/3) = Γ(−2/3)/(−5/3) = Γ(1/3)/[(−5/3)(−2/3)] = Γ(1/3)/(10/9)，比值 = 9/10。",
      
      verify: { m: "value", f: "\\frac{\\Gamma(-5/3)}{\\Gamma(1/3)}" } },
    { id: "cg-11d-009", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求 }\\Gamma\\left(-\\frac{1}{2}\\right)",
      answer: "-2*sqrt(pi)", timeLimit: 90,
      tags: ["gamma-half-integer-negative", "gamma-function"],
      hints: ["在 Γ(s+1) = sΓ(s) 裡取 s = −1/2。", "Γ(1/2) 是已知的值，移項時留意負號。"],
      solution: "Γ(1/2) = (−1/2)Γ(−1/2)，所以 Γ(−1/2) = Γ(1/2)/(−1/2) = −2√π。",
      
      verify: { m: "value", f: "\\Gamma(-1/2)" } },
    { id: "cg-11d-010", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求 }\\Gamma\\left(-\\frac{5}{2}\\right)",
      answer: "-8*sqrt(pi)/15", timeLimit: 120,
      tags: ["gamma-half-integer-negative", "gamma-function"],
      hints: ["從 Γ(1/2) = √π 出發，往左除三次。", "三個除數 −1/2、−3/2、−5/2 都是負的：結果的正負號是什麼？"],
      solution: "Γ(−5/2) = Γ(1/2)/[(−5/2)(−3/2)(−1/2)] = √π/(−15/8) = −8√π/15。",
      
      verify: { m: "value", f: "\\Gamma(-5/2)" } },

    /* ── 11D Γ(1/2) 與 Gaussian 的縮放 ── */
    { id: "cg-11d-011", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_0^{\\infty}e^{-2x^2}\\,dx",
      answer: "sqrt(2*pi)/4", timeLimit: 90,
      tags: ["gaussian-scaling", "gaussian-integral", "improper-integral"],
      hints: ["令 u = √2·x，化成 ∫₀^∞ e^{−u²}du。", "∫₀^∞ e^{−u²}du 是 Γ(1/2) 的一半。"],
      solution: "u = √2 x：∫₀^∞ e^{−2x²}dx = (1/√2)∫₀^∞ e^{−u²}du = (1/√2)(√π/2) = √(2π)/4。"},
    { id: "cg-11d-012", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_{-\\infty}^{\\infty}e^{-3x^2}\\,dx",
      answer: "sqrt(pi/3)", timeLimit: 90,
      tags: ["gaussian-scaling", "gaussian-integral", "improper-integral"],
      hints: ["整條實數線的 ∫e^{−u²}du 是多少？", "令 u = √3·x，dx 會多出一個因子。"],
      solution: "u = √3 x：∫_{−∞}^{∞} e^{−3x²}dx = (1/√3)∫e^{−u²}du = √π/√3 = √(π/3)。一般地 ∫e^{−ax²}dx = √(π/a)。"},
    { id: "cg-11d-013", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_{-\\infty}^{\\infty}e^{-x^2/8}\\,dx",
      answer: "2*sqrt(2*pi)", timeLimit: 90,
      tags: ["gaussian-scaling", "gaussian-integral", "improper-integral"],
      hints: ["這是 ∫e^{−ax²}dx，a 是多少？", "a 小於 1 時曲線比較胖，答案應該比 √π 大還是小？"],
      solution: "a = 1/8：∫_{−∞}^{∞} e^{−x²/8}dx = √(π/a) = √(8π) = 2√(2π) ≈ 5.013。"},
    { id: "cg-11d-014", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_0^{\\infty}\\frac{e^{-4x}}{\\sqrt{x}}\\,dx",
      answer: "sqrt(pi)/2", timeLimit: 90,
      tags: ["gamma-half-gaussian-link", "gamma-function", "improper-integral"],
      hints: ["這是 x^{s−1}e^{−ax} 的形式：s 與 a 各是多少？", "也可以令 x = u²，看它變成哪個 Gaussian。"],
      solution: "s = 1/2、a = 4：∫ = Γ(1/2)/4^{1/2} = √π/2。用 x = u²：∫₀^∞ 2e^{−4u²}du = 2·(1/2)√(π/4) = √π/2，一樣。"},
    { id: "cg-11d-015", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_0^1\\frac{dx}{\\sqrt{-\\ln x}}",
      answer: "sqrt(pi)", timeLimit: 120,
      tags: ["gamma-half-gaussian-link", "gamma-function", "improper-integral"],
      hints: ["令 x = e^{−t}，看 t 從哪裡跑到哪裡、dx 變成什麼。", "換完之後是 t 的幾次方乘 e^{−t}？"],
      solution: "x = e^{−t}，dx = −e^{−t}dt，x: 0→1 對應 t: ∞→0。∫ = ∫₀^∞ t^{−1/2}e^{−t}dt = Γ(1/2) = √π。"},

    /* ── 11D 縮放的 Gamma：指數裡是 x³、√x ── */
    { id: "cg-11d-016", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^{\\infty}x^8e^{-x^3}\\,dx",
      answer: "2/3", timeLimit: 150,
      tags: ["gamma-scaled-power", "gamma-function", "improper-integral"],
      hints: ["令 u = x³，把 x⁸dx 全部寫成 u 的式子。", "x⁸dx = x⁶·x²dx，而 x²dx = du/3。"],
      solution: "u = x³，du = 3x²dx：x⁸dx = u²·du/3。∫ = (1/3)∫₀^∞ u²e^{−u}du = Γ(3)/3 = 2/3。"},
    { id: "cg-11d-017", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^{\\infty}x\\,e^{-\\sqrt{x}}\\,dx",
      answer: "12", timeLimit: 150,
      tags: ["gamma-scaled-power", "gamma-function", "improper-integral"],
      hints: ["令 u = √x，也就是 x = u²。", "x dx 變成 u 的幾次方乘 du？那是 Γ 的哪個值？"],
      solution: "x = u²，dx = 2u du：∫ = ∫₀^∞ u²·e^{−u}·2u du = 2∫₀^∞ u³e^{−u}du = 2Γ(4) = 12。"},

    /* ── 11D Beta：收斂條件與其他形式 ── */
    { id: "cg-11d-018", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "\\int_0^1x^{p-1}(1-x)^{q-1}\\,dx\\text{ 收斂的條件是什麼？}",
      answer: "p > 0 且 q > 0", answers: ["p > 0 且 q > 0"], canonical: "p > 0 且 q > 0",
      distractors: ["p > 1 且 q > 1", "p + q > 0", "只要 p > 0"], timeLimit: 120,
      tags: ["beta-convergence", "beta-function", "improper-integral"],
      hints: ["兩個端點分開看：x → 0⁺ 時 (1 − x)^{q−1} ≈ 1。", "x → 1⁻ 時換成 x^{p−1} ≈ 1；每一端各是一個 p 判別。"],
      solution: "x → 0⁺：被積函數與 x^{p−1} 同階，要 p − 1 > −1，即 p > 0。x → 1⁻：與 (1 − x)^{q−1} 同階，要 q > 0。兩端都要過，所以是 p > 0 且 q > 0。",
      
      verify: { m: "choice", options: [
        { say: "p > 0 且 q > 0", all: [conv("x^{-1/2}(1-x)^{-1/2}", 0, 1, [0, 1], true), conv("x^{-1}(1-x)^{1}", 0, 1, [0, 1], false), conv("x(1-x)^{-1}", 0, 1, [0, 1], false)] },
        { say: "p > 1 且 q > 1", all: [conv("x^{-1/2}(1-x)^{-1/2}", 0, 1, [0, 1], false)] },
        { say: "p + q > 0", all: [conv("x(1-x)^{-3/2}", 0, 1, [0, 1], true)] },
        { say: "只要 p > 0", all: [conv("(1-x)^{-1}", 0, 1, [0, 1], true)] }
      ] } },
    { id: "cg-11d-019", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "\\text{下列哪一個積分收斂？}",
      answer: "∫₀¹ x^(−2/3) (1−x)^(−1/2) dx", answers: ["∫₀¹ x^(−2/3) (1−x)^(−1/2) dx"], canonical: "∫₀¹ x^(−2/3) (1−x)^(−1/2) dx",
      distractors: ["∫₀¹ x^(−1) (1−x)^(1/2) dx", "∫₀¹ x^(1/2) (1−x)^(−3/2) dx", "∫₀¹ x^(−4/3) (1−x)^(−1/3) dx"], timeLimit: 120,
      tags: ["beta-convergence", "beta-function", "improper-integral"],
      hints: ["寫成 x^{p−1}(1−x)^{q−1}，讀出每一個的 p 與 q。", "兩端都要收斂：p 與 q 都必須是正的。"],
      solution: "讀成 Beta 的參數：(p, q) 分別是 (1/3, 1/2)、(0, 3/2)、(3/2, −1/2)、(−1/3, 2/3)。只有第一個兩個參數都正，收斂（等於 B(1/3, 1/2)）。",
      
      verify: { m: "choice", options: [
        { say: "∫₀¹ x^(−2/3) (1−x)^(−1/2) dx", all: [conv("x^{-2/3}(1-x)^{-1/2}", 0, 1, [0, 1], true)] },
        { say: "∫₀¹ x^(−1) (1−x)^(1/2) dx", all: [conv("x^{-1}(1-x)^{1/2}", 0, 1, [0, 1], true)] },
        { say: "∫₀¹ x^(1/2) (1−x)^(−3/2) dx", all: [conv("x^{1/2}(1-x)^{-3/2}", 0, 1, [0, 1], true)] },
        { say: "∫₀¹ x^(−4/3) (1−x)^(−1/3) dx", all: [conv("x^{-4/3}(1-x)^{-1/3}", 0, 1, [0, 1], true)] }
      ] } },
    { id: "cg-11d-020", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{用 }x=2t\\text{ 化成 Beta 函數，求 }\\int_0^2x^2(2-x)^3\\,dx",
      answer: "16/15", timeLimit: 120,
      tags: ["beta-other-forms", "beta-function", "definite-integral"],
      hints: ["x = 2t 時 2 − x = 2(1 − t)，dx = 2dt：一共拉出 2 的幾次方？", "剩下 ∫₀¹ t²(1−t)³dt 是 B(p, q) 的哪一組 p、q？"],
      solution: "x = 2t：∫ = 2²·2³·2 ∫₀¹ t²(1−t)³dt = 64·B(3, 4) = 64·(2!·3!/6!) = 64/60 = 16/15。"},
    { id: "cg-11d-021", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_0^{\\infty}\\frac{t^2}{(1+t)^6}\\,dt",
      answer: "1/30", timeLimit: 120,
      tags: ["beta-other-forms", "beta-function", "improper-integral"],
      hints: ["B(p,q) = ∫₀^∞ t^{p−1}/(1+t)^{p+q} dt：先讀出 p，再由 p + q 讀出 q。", "整數參數時 B(p,q) = (p−1)!(q−1)!/(p+q−1)!。"],
      solution: "p − 1 = 2 ⟹ p = 3；p + q = 6 ⟹ q = 3。∫ = B(3,3) = 2!·2!/5! = 4/120 = 1/30。"},
    { id: "cg-11d-022", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^4x^{3/2}(4-x)^{1/2}\\,dx",
      answer: "4*pi", timeLimit: 150,
      tags: ["beta-other-forms", "beta-function", "definite-integral"],
      hints: ["令 x = 4t，化成 4 的某次方乘 ∫₀¹ t^{3/2}(1−t)^{1/2}dt。", "B(5/2, 3/2) 用 Γ(5/2)Γ(3/2)/Γ(4) 算。"],
      solution: "x = 4t：∫ = 4^{3/2}·4^{1/2}·4 ∫₀¹ t^{3/2}(1−t)^{1/2}dt = 64·B(5/2,3/2)。B = (3√π/4)(√π/2)/3! = π/16，答案 4π。"},
    { id: "cg-11d-023", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^{\\infty}\\frac{dx}{\\sqrt{x}\\,(1+x)^2}",
      answer: "pi/2", timeLimit: 150,
      tags: ["beta-gamma-infinite-form", "beta-function", "gamma-function", "improper-integral"],
      hints: ["寫成 x^{p−1}/(1+x)^{p+q}：p 與 q 各是多少？", "B(p,q) = Γ(p)Γ(q)/Γ(p+q)，半整數的 Γ 用 Γ(1/2) = √π 推。"],
      solution: "p − 1 = −1/2 ⟹ p = 1/2；p + q = 2 ⟹ q = 3/2。∫ = B(1/2, 3/2) = Γ(1/2)Γ(3/2)/Γ(2) = √π·(√π/2)/1 = π/2。"},
    { id: "cg-11d-024", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^{\\infty}\\frac{x^{3/2}}{(1+x)^4}\\,dx",
      answer: "pi/16", timeLimit: 150,
      tags: ["beta-gamma-infinite-form", "beta-function", "gamma-function", "improper-integral"],
      hints: ["讀出 p（看 x 的次方）與 q（看分母次方減 p）。", "Γ(5/2) 與 Γ(3/2) 都從 √π 往上乘出來，Γ(4) = 3!。"],
      solution: "p = 5/2、q = 4 − 5/2 = 3/2。∫ = B(5/2,3/2) = Γ(5/2)Γ(3/2)/Γ(4) = (3√π/4)(√π/2)/6 = π/16。"},
    { id: "cg-11d-025", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^{\\pi/2}\\sqrt{\\sin\\theta}\\,\\cos^3\\theta\\,d\\theta",
      answer: "8/21", timeLimit: 150,
      tags: ["beta-trig-fractional", "beta-function", "trig"],
      hints: ["∫₀^{π/2} sin^a θ cos^b θ dθ = ½B((a+1)/2, (b+1)/2)：a、b 各是多少？", "算出來的 Γ(11/4) 用遞迴拆回 Γ(3/4)，就會和分子消掉。"],
      solution: "a = 1/2、b = 3：∫ = ½B(3/4, 2) = ½·Γ(3/4)Γ(2)/Γ(11/4)。Γ(11/4) = (7/4)(3/4)Γ(3/4)，所以 ∫ = ½·16/21 = 8/21。（也可以令 u = sin θ 直接積。）",
      
      verify: { m: "integral", f: "\\sqrt{\\sin x}\\cos^3 x", a: 0, b: "\\pi/2" } },
    { id: "cg-11d-026", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^{\\pi/2}\\sqrt[3]{\\tan\\theta}\\,d\\theta",
      answer: "pi/sqrt(3)", timeLimit: 180,
      tags: ["beta-trig-fractional", "beta-function", "gamma-function", "trig"],
      hints: ["tan^{1/3}θ = sin^{1/3}θ·cos^{−1/3}θ，套三角形式的 Beta。", "得到的 B(p, q) 有 p + q = 1，可以用反射公式 Γ(s)Γ(1−s) = π/sin(πs)。"],
      solution: "a = 1/3、b = −1/3：∫ = ½B(2/3, 1/3) = ½Γ(2/3)Γ(1/3)/Γ(1) = ½·π/sin(π/3) = ½·2π/√3 = π/√3。",
      
      verify: { m: "integral", f: "(\\tan x)^{1/3}", a: 0, b: "\\pi/2" } },

    /* ── 11D Wallis：非整數次方與漸近 ── */
    { id: "cg-11d-027", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "I=\\int_0^{\\pi/2}\\sqrt{\\sin x}\\,dx,\\ J=\\int_0^{\\pi/2}\\frac{dx}{\\sqrt{\\sin x}}\\text{，求乘積 }I\\cdot J",
      answer: "pi", timeLimit: 180,
      tags: ["wallis-noninteger-power", "wallis", "beta-function", "gamma-function"],
      hints: ["各自寫成 ½B(·, 1/2)，再換成 Γ。", "乘起來時 Γ(3/4)、Γ(5/4) 之類的會用 Γ(s+1) = sΓ(s) 消掉。"],
      solution: "I = ½B(3/4, 1/2) = ½Γ(3/4)√π/Γ(5/4)，J = ½B(1/4, 1/2) = ½Γ(1/4)√π/Γ(3/4)。IJ = ¼π·Γ(1/4)/Γ(5/4) = ¼π·4 = π。I、J 各自都不是初等數，乘積卻是。",
      
      verify: { m: "let", f: "a b", with: {
        a: { m: "integral", f: "\\sqrt{\\sin x}", a: 0, b: "\\pi/2" },
        b: { m: "integral", f: "\\frac{1}{\\sqrt{\\sin x}}", a: 0, b: "\\pi/2" } } } },
    { id: "cg-11d-028", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{求 }\\frac{\\int_0^{\\pi/2}\\sin^{5/2}x\\,dx}{\\int_0^{\\pi/2}\\sin^{1/2}x\\,dx}",
      answer: "3/5", timeLimit: 150,
      tags: ["wallis-noninteger-power", "wallis", "beta-function"],
      hints: ["Wallis 的降次公式 W_s = ((s−1)/s)·W_{s−2} 對非整數 s 也成立。", "也可以都寫成 ½B(·, 1/2)，比值裡只剩 Γ 的位移。"],
      solution: "降次公式（分部積分推出來，s 不必是整數）：W_{5/2} = ((5/2 − 1)/(5/2))·W_{1/2} = (3/5)W_{1/2}。比值 3/5。兩個積分本身都要用 Γ(3/4) 之類表示，比值卻是有理數。",
      
      verify: { m: "let", f: "\\frac{a}{b}", with: {
        a: { m: "integral", f: "(\\sin x)^{5/2}", a: 0, b: "\\pi/2" },
        b: { m: "integral", f: "(\\sin x)^{1/2}", a: 0, b: "\\pi/2" } } } },
    { id: "cg-11d-029", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\lim_{n\\to\\infty}\\sqrt{n}\\int_0^{\\pi/2}\\cos^{2n}x\\,dx",
      answer: "sqrt(pi)/2", timeLimit: 180,
      tags: ["wallis-asymptotic", "wallis", "gamma-function"],
      hints: ["∫₀^{π/2}cos^{2n}x dx = ½B(n + 1/2, 1/2) = (√π/2)·Γ(n+1/2)/Γ(n+1)。", "Γ(n+1/2)/Γ(n+1) 在 n 很大時大約是 n 的幾次方？"],
      solution: "W_{2n} = (√π/2)·Γ(n+½)/Γ(n+1)，而 Γ(n+½)/Γ(n+1) ~ n^{−1/2}。所以 √n·W_{2n} → √π/2。等價說法：W_m ~ √(π/(2m))，取 m = 2n 得 √(π/(4n))。",
      
      verify: { m: "integralLimit", f: "\\sqrt{n}(\\cos x)^{2n}", a: 0, b: "\\pi/2" } },
    { id: "cg-11d-030", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\lim_{n\\to\\infty}\\sqrt{n}\\int_0^{\\pi}\\sin^{n}x\\,dx",
      answer: "sqrt(2*pi)", timeLimit: 180,
      tags: ["wallis-asymptotic", "wallis", "gamma-function"],
      hints: ["sin^n x 對 x = π/2 對稱，[0, π] 的積分是 [0, π/2] 的兩倍。", "用 W_n·W_{n+1} = π/(2(n+1)) 而且 W_n 遞減，夾出 W_n ~ √(π/(2n))。"],
      solution: "∫₀^π sinⁿx dx = 2W_n。W_nW_{n+1} = π/(2(n+1))，W_{n+1} ≤ W_n ≤ W_{n−1}，所以 W_n² ~ π/(2n)，W_n ~ √(π/(2n))。√n·2W_n → 2√(π/2) = √(2π)。",
      
      verify: { m: "integralLimit", f: "\\sqrt{n}(\\sin x)^{n}", a: 0, b: "\\pi" } },

    /* ── 11F Gaussian：配方、常態分布、奇偶 ── */
    { id: "cg-11f-001", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_{-\\infty}^{\\infty}e^{-x^2-x}\\,dx",
      answer: "e^(1/4)*sqrt(pi)", timeLimit: 120,
      tags: ["gaussian-complete-square", "gaussian-integral", "completing-square"],
      hints: ["配方：−x² − x = −(x + ½)² + ?", "平移 u = x + ½ 不改變整條實數線上的積分。"],
      solution: "−x² − x = −(x + ½)² + ¼。∫ = e^{1/4}∫e^{−u²}du = e^{1/4}√π。"},
    { id: "cg-11f-002", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_{-\\infty}^{\\infty}e^{-2x^2+4x-1}\\,dx",
      answer: "e*sqrt(pi/2)", timeLimit: 120,
      tags: ["gaussian-complete-square", "gaussian-integral", "completing-square"],
      hints: ["先把 −2 提出來配方：−2(x² − 2x) − 1。", "配方後剩下常數項 e^{c} 乘上 ∫e^{−2u²}du。"],
      solution: "−2x² + 4x − 1 = −2(x − 1)² + 1。∫ = e·∫e^{−2u²}du = e·√(π/2)。"},
    { id: "cg-11f-003", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_{-\\infty}^{\\infty}e^{-3x^2+6x+1}\\,dx",
      answer: "e^4*sqrt(pi/3)", timeLimit: 120,
      tags: ["gaussian-complete-square", "gaussian-integral", "completing-square"],
      hints: ["−3x² + 6x = −3(x − 1)² + 多少？", "∫e^{−au²}du = √(π/a)。"],
      solution: "−3x² + 6x + 1 = −3(x − 1)² + 3 + 1 = −3(x−1)² + 4。∫ = e⁴√(π/3)。"},
    { id: "cg-11f-004", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "X\\text{ 是平均 }0\\text{、標準差 }3\\text{ 的常態隨機變數，密度 }f(x)=\\frac{1}{3\\sqrt{2\\pi}}e^{-x^2/18}\\text{。求 }E[X^2]=\\int_{-\\infty}^{\\infty}x^2f(x)\\,dx",
      answer: "9", timeLimit: 150,
      tags: ["gaussian-normal-distribution", "gaussian-integral", "story-problem"],
      hints: ["令 u = x/3，化成標準常態的二次動差。", "∫u²e^{−u²/2}du 可以分部積分，或用 Γ(3/2)。"],
      solution: "u = x/3：E[X²] = 9·∫u²·(1/√(2π))e^{−u²/2}du = 9·1 = 9。標準常態的變異數是 1，因為 ∫u²e^{−u²/2}du = √(2π)。",
      
      verify: { m: "integral", f: "x^2\\frac{1}{3\\sqrt{2\\pi}}e^{-x^2/18}", a: "-\\infty", b: "\\infty" } },
    { id: "cg-11f-005", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{標準常態的四次動差：}\\int_{-\\infty}^{\\infty}x^4\\cdot\\frac{1}{\\sqrt{2\\pi}}e^{-x^2/2}\\,dx",
      answer: "3", timeLimit: 150,
      tags: ["gaussian-normal-distribution", "gaussian-integral", "gamma-function"],
      hints: ["偶函數：寫成 2∫₀^∞，再令 t = x²/2。", "會出現 Γ(5/2)；或者分部積分把 x⁴ 降成 x²。"],
      solution: "t = x²/2：∫₀^∞ x⁴e^{−x²/2}dx = 2^{3/2}Γ(5/2)，於是 E[X⁴] = (4/√π)Γ(5/2) = (4/√π)(3√π/4) = 3。",
      
      verify: { m: "integral", f: "x^4\\frac{1}{\\sqrt{2\\pi}}e^{-x^2/2}", a: "-\\infty", b: "\\infty" } },
    { id: "cg-11f-006", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\int_{-\\infty}^{\\infty}(x^3+x^2)e^{-x^2}\\,dx",
      answer: "sqrt(pi)/2", timeLimit: 120,
      tags: ["gaussian-odd-symmetry", "gaussian-integral", "odd-function"],
      hints: ["x³e^{−x²} 是奇函數還是偶函數？在對稱區間上積它會得到什麼？", "剩下 ∫x²e^{−x²}dx：分部積分或用 Γ(3/2)。"],
      solution: "x³e^{−x²} 是奇函數，全實數線積分為 0。∫x²e^{−x²}dx = 2Γ(3/2)/2 = √π/2。答案 √π/2。"},
    { id: "cg-11f-007", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_{-\\infty}^{\\infty}|x|^3e^{-2x^2}\\,dx",
      answer: "1/4", timeLimit: 120,
      tags: ["gaussian-odd-symmetry", "gaussian-integral", "symmetry"],
      hints: ["拿掉絕對值的 x³e^{−2x²} 積起來是 0；加了絕對值以後是偶函數。", "寫成 2∫₀^∞ x³e^{−2x²}dx，再令 t = 2x²。"],
      solution: "|x|³e^{−2x²} 是偶函數：∫ = 2∫₀^∞ x³e^{−2x²}dx。t = 2x²：∫₀^∞ x³e^{−2x²}dx = (1/8)∫₀^∞ t e^{−t}dt = 1/8。答案 1/4。"},

    /* ── 11F Dirichlet：積化和差後的分段 ── */
    { id: "cg-11f-008", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_0^{\\infty}\\frac{\\sin x\\cos 3x}{x}\\,dx",
      answer: "0", timeLimit: 150,
      tags: ["dirichlet-scaling", "dirichlet-integral", "trig"],
      hints: ["積化和差：sin A cos B = ½[sin(A+B) + sin(A−B)]。", "∫₀^∞ sin(bx)/x dx 的值只看 b 的正負號。"],
      solution: "sin x cos 3x = ½[sin 4x + sin(−2x)]。∫₀^∞ sin(bx)/x dx = (π/2)·sgn b，所以 ∫ = ½(π/2 − π/2) = 0。",
      
      verify: { m: "integral", f: "\\frac{\\sin x\\cos 3x}{x}", a: 0, b: "\\infty" } },
    { id: "cg-11f-009", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\int_0^{\\infty}\\frac{\\sin 2x\\cos 2x}{x}\\,dx",
      answer: "pi/4", timeLimit: 150,
      tags: ["dirichlet-scaling", "dirichlet-integral", "trig"],
      hints: ["積化和差（或倍角）：sin 2x cos 2x 是什麼的一半？", "∫₀^∞ sin(bx)/x dx 在 b > 0、b = 0、b < 0 各是多少？"],
      solution: "sin 2x cos 2x = ½[sin 4x + sin 0] = ½ sin 4x。∫ = ½·π/2 = π/4。這是 ∫₀^∞ sin(ax)cos(bx)/x dx 在 a = b 的邊界情形：值是 π/4，介於 π/2 與 0 之間。",
      
      verify: { m: "integral", f: "\\frac{\\sin 2x\\cos 2x}{x}", a: 0, b: "\\infty" } },

    /* ── 11F log-sine：換元與收斂 ── */
    { id: "cg-11f-010", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^1\\frac{\\ln x}{\\sqrt{1-x^2}}\\,dx",
      answer: "-pi*ln(2)/2", timeLimit: 180,
      tags: ["log-sine-substitution", "log-sine", "improper-integral"],
      hints: ["看到 √(1 − x²)，令 x = sin θ。", "換完是 ∫₀^{π/2} ln(sin θ) dθ。"],
      solution: "x = sin θ，dx = cos θ dθ，√(1 − x²) = cos θ：∫ = ∫₀^{π/2} ln(sin θ)dθ = −(π/2)ln 2。"},
    { id: "cg-11f-011", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^1\\frac{\\ln(1-x^2)}{\\sqrt{1-x^2}}\\,dx",
      answer: "-pi*ln(2)", timeLimit: 210,
      tags: ["log-sine-substitution", "log-sine", "improper-integral"],
      hints: ["令 x = sin θ，1 − x² 會變成什麼？", "ln(cos²θ) = 2 ln(cos θ)，而 ∫₀^{π/2} ln(cos θ)dθ 和 ln(sin θ) 的那個積分一樣。"],
      solution: "x = sin θ：1 − x² = cos²θ，dx/√(1−x²) = dθ。∫ = ∫₀^{π/2} ln(cos²θ)dθ = 2∫₀^{π/2} ln(cos θ)dθ = 2·(−(π/2)ln 2) = −π ln 2。"},
    { id: "cg-11f-012", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "\\int_0^{\\pi/2}\\ln(\\sin x)\\,dx\\text{ 的被積函數在 }x\\to 0^+\\text{ 趨向 }-\\infty\\text{。這個瑕積分的斂散與理由是？}",
      answer: "收斂：ln(sin x) 在 0 附近與 ln x 同階，而 ∫₀¹ ln x dx 收斂", answers: ["收斂：ln(sin x) 在 0 附近與 ln x 同階，而 ∫₀¹ ln x dx 收斂"], canonical: "收斂：ln(sin x) 在 0 附近與 ln x 同階，而 ∫₀¹ ln x dx 收斂",
      distractors: ["收斂：ln(sin x) 在 (0, π/2] 上有界", "發散：被積函數趨向 −∞ 的瑕積分都發散"], timeLimit: 120,
      tags: ["log-sine-convergence", "log-sine", "improper-integral"],
      hints: ["sin x ≈ x，所以 ln(sin x) − ln x → ?", "∫₀¹ ln x dx 收不收斂？用分部積分算算看。"],
      solution: "ln(sin x) − ln x = ln(sin x / x) → 0，所以兩者只差一個有界量。∫₀¹ ln x dx = −1 收斂，於是原積分收斂。函數雖然無界，但對數爆得比任何 x^{−p} 都慢。",
      
      verify: { m: "choice", options: [
        { say: "收斂：ln(sin x) 在 0 附近與 ln x 同階，而 ∫₀¹ ln x dx 收斂", all: [
          conv("\\ln(\\sin x)", 0, "\\pi/2", [0], true),
          conv("\\ln x", 0, 1, [0], true),
          { v: { m: "limit", f: "\\frac{\\ln(\\sin x)}{\\ln x}", at: 0, dir: "+" }, eq: 1 }] },
        { say: "收斂：ln(sin x) 在 (0, π/2] 上有界", all: [{ v: { m: "value", f: "\\ln(\\sin(10^{-30}))" }, ge: -50 }] },
        { say: "發散：被積函數趨向 −∞ 的瑕積分都發散", all: [conv("\\ln(\\sin x)", 0, "\\pi/2", [0], false)] }
      ] } },

    /* ── 11F Basel：Euler 的係數比較 ── */
    { id: "cg-11f-013", topic: "series", rank: 5, answerKind: "numeric",
      prompt: "\\text{Euler：}\\frac{\\sin x}{x}=\\prod_{k=1}^{\\infty}\\left(1-\\frac{x^2}{k^2\\pi^2}\\right)\\text{。比較兩邊 }x^4\\text{ 的係數，並用 }\\sum\\frac{1}{n^2}=\\frac{\\pi^2}{6}\\text{，求 }\\sum_{n=1}^{\\infty}\\frac{1}{n^4}",
      answer: "pi^4/90", timeLimit: 300,
      tags: ["basel-euler-argument", "zeta", "taylor"],
      hints: ["左邊 x⁴ 的係數從 sin x 的 Taylor 展開讀：x⁵/120 除以 x。", "右邊 x⁴ 的係數是 Σ_{j<k} 1/(j²k²π⁴)，而 (Σaₙ)² = Σaₙ² + 2Σ_{j<k}a_ja_k。"],
      solution: "左邊 x⁴ 係數 1/120。右邊 = (1/π⁴)Σ_{j<k}1/(j²k²) = (1/π⁴)·½[(Σ1/n²)² − Σ1/n⁴]。令 S = Σ1/n⁴：1/120 = (1/(2π⁴))(π⁴/36 − S)，解得 S = π⁴/36 − π⁴/60 = π⁴/90。",
      
      verify: { m: "series", f: "\\frac{1}{n^4}", from: 1 } },

    /* ── 12J 簡單函數：重疊的寫法、零測集上的值 ── */
    { id: "cg-12j-001", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\varphi=2\\chi_{[0,3]}+5\\chi_{[1,4]}\\ (\\text{在 }\\mathbb{R}\\text{ 上})\\text{，求 }\\int\\varphi\\,d\\mu",
      answer: "21", timeLimit: 90,
      tags: ["simple-overlap-refine", "simple-function", "measure"],
      hints: ["積分是線性的：重疊的寫法也可以逐項積。", "∫cχ_E dμ = c·m(E)。"],
      solution: "線性：∫φ = 2·m([0,3]) + 5·m([1,4]) = 6 + 15 = 21。改寫成標準形也一樣：[0,1) 取 2、[1,3] 取 7、(3,4] 取 5，∫ = 2 + 14 + 5 = 21。",
      
      verify: { m: "integral", f: "2\\cdot\\frac{\\operatorname{sgn}(x)-\\operatorname{sgn}(x-3)}{2}+5\\cdot\\frac{\\operatorname{sgn}(x-1)-\\operatorname{sgn}(x-4)}{2}", a: -1, b: 5, breaks: [0, 1, 3, 4] } },
    { id: "cg-12j-002", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\varphi=\\chi_{[0,2]}+3\\chi_{[1,3]}\\text{。先寫成不重疊的標準形，再求 }\\int\\varphi^2\\,d\\mu",
      answer: "26", timeLimit: 150,
      tags: ["simple-overlap-refine", "simple-function", "measure"],
      hints: ["φ² 不能逐項平方（交叉項會漏掉）：先找出 φ 在每一段取什麼值。", "分界點是 1 和 2：三段各取一個值，再各自平方乘長度。"],
      solution: "標準形：[0,1) 取 1、[1,2] 取 4、(2,3] 取 3。φ² 取 1、16、9，各段長 1：∫φ² = 1 + 16 + 9 = 26。若錯把 φ² 寫成 χ_{[0,2]} + 9χ_{[1,3]}，會得到 20。",
      
      verify: { m: "integral", f: "\\left(\\frac{\\operatorname{sgn}(x)-\\operatorname{sgn}(x-2)}{2}+3\\cdot\\frac{\\operatorname{sgn}(x-1)-\\operatorname{sgn}(x-3)}{2}\\right)^2", a: -1, b: 4, breaks: [0, 1, 2, 3] } },
    { id: "cg-12j-003", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{在 }[0,3]\\text{ 上 }\\varphi=5\\chi_{\\mathbb{Q}}+2\\chi_{\\mathbb{Q}^c}\\text{（有理點取 5、無理點取 2），求 }\\int_{[0,3]}\\varphi\\,d\\mu",
      answer: "6", timeLimit: 90,
      tags: ["simple-null-set-values", "simple-function", "measure"],
      hints: ["[0,3] 裡的有理數可數，它的測度是多少？", "∫φ = 5·m(ℚ∩[0,3]) + 2·m([0,3]∖ℚ)。"],
      solution: "ℚ∩[0,3] 可數，測度 0；無理點的測度是 3。∫φ = 5·0 + 2·3 = 6。有理點上的值不管多大都不影響。",
      
      verify: { m: "integral", f: "2", a: 0, b: 3 } },
    { id: "cg-12j-004", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "C\\text{ 是 Cantor 集。在 }[0,1]\\text{ 上 }\\psi=7\\chi_C+3\\chi_{[0,1]\\setminus C}\\text{，求 }\\int_{[0,1]}\\psi\\,d\\mu",
      answer: "3", timeLimit: 120,
      tags: ["simple-null-set-values", "simple-function", "measure"],
      hints: ["Cantor 集是把 [0,1] 挖掉的部分去掉後剩下的：挖掉的總長度是多少？", "第 n 步挖掉 2^{n−1} 段、每段長 3^{−n}，加起來是等比級數。"],
      solution: "挖掉的總長度 Σ 2^{n−1}/3^n = (1/3)/(1 − 2/3) = 1，所以 m(C) = 0、m([0,1]∖C) = 1。∫ψ = 7·0 + 3·1 = 3。",
      
      verify: { m: "let", f: "7(1-s)+3s", with: { s: CANTOR_REMOVED } } },

    /* ── 12J 非負可測函數：標準逼近序列、取 ∞ 的函數 ── */
    { id: "cg-12j-005", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{標準逼近 }\\varphi_n=\\frac{\\lfloor 2^n f\\rfloor}{2^n}\\text{（}f\\le n\\text{ 時）。}f(x)=x^2\\text{ 在 }[0,1]\\text{，求 }\\int_0^1\\varphi_2\\,d\\mu",
      answer: "(5-sqrt(2)-sqrt(3))/8", timeLimit: 180,
      tags: ["posint-dyadic-approx", "simple-function", "measure"],
      hints: ["φ₂ = ⌊4x²⌋/4：⌊4x²⌋ 在哪些 x 換值？", "4x² = 1、2、3 分別在 x = 1/2、1/√2、√3/2。"],
      solution: "φ₂ 在 [0,½) 取 0、[½,1/√2) 取 ¼、[1/√2,√3/2) 取 ½、[√3/2,1) 取 ¾。∫ = ¼(1/√2 − ½) + ½(√3/2 − 1/√2) + ¾(1 − √3/2) = (5 − √2 − √3)/8 ≈ 0.232，比 ∫x² = 1/3 小。",
      
      verify: { m: "integral", f: "\\frac{\\lfloor 4x^2\\rfloor}{4}", a: 0, b: 1, breaks: [0.5, 0.7071067811865476, 0.8660254037844386] } },
    { id: "cg-12j-006", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{標準逼近 }\\varphi_n(x)=\\min\\left(n,\\ \\frac{\\lfloor 2^n f(x)\\rfloor}{2^n}\\right)\\text{。}f(x)=e^x\\text{，求 }\\varphi_3(1.5)",
      answer: "3", timeLimit: 120,
      tags: ["posint-dyadic-approx", "simple-function", "measure"],
      hints: ["先算 f(1.5) = e^{1.5} 大約多少，再看它有沒有超過 n。", "上限 n 會把太高的值截掉。"],
      solution: "e^{1.5} ≈ 4.48 > 3，所以 φ₃(1.5) 被截在 n = 3（不截的話 ⌊8·4.48⌋/8 = 35/8）。逼近序列同時從「高度」與「解析度」兩頭往上長。",
      
      verify: { m: "value", f: "\\frac{3+\\lfloor 8e^{1.5}\\rfloor/8-\\left|3-\\lfloor 8e^{1.5}\\rfloor/8\\right|}{2}" } },
    { id: "cg-12j-007", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{標準逼近 }\\varphi_n(x)=\\min\\left(n,\\ \\frac{\\lfloor 2^n f(x)\\rfloor}{2^n}\\right)\\text{。}f(x)=x\\text{ 在 }[0,3]\\text{，求 }\\int_0^3\\varphi_1\\,d\\mu",
      answer: "9/4", timeLimit: 150,
      tags: ["posint-dyadic-approx", "simple-function", "measure"],
      hints: ["φ₁ = min(1, ⌊2x⌋/2)：⌊2x⌋/2 在 x = 1/2、1 換值。", "x ≥ 1 之後被截在 1。"],
      solution: "φ₁ 在 [0,½) 取 0、[½,1) 取 ½、[1,3] 取 1。∫ = ½·½ + 1·2 = 9/4。和 ∫x = 9/2 還差很遠 —— n 大了才逼得近。",
      
      verify: { m: "integral", f: "\\frac{1+\\lfloor 2x\\rfloor/2-\\left|1-\\lfloor 2x\\rfloor/2\\right|}{2}", a: 0, b: 3, breaks: [0.5, 1, 1.5, 2, 2.5] } },
    { id: "cg-12j-008", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "f\\,\\text{ 在 Cantor 集 }\\,C\\text{ 上取 }+\\infty\\text{、在 }[0,1]\\setminus C\\text{ 上取 }0\\text{。}\\int_{[0,1]}f\\,d\\mu=?",
      answer: "0", answers: ["0"], canonical: "0",
      distractors: ["+∞", "無法定義（∞ 乘 0）"], timeLimit: 120,
      tags: ["posint-infinite-values", "measure", "simple-function"],
      hints: ["關鍵是 m(C)：Cantor 集挖掉的總長度是多少？", "測度論的約定：0·∞ = 0。"],
      solution: "挖掉的總長度 Σ2^{n−1}/3^n = 1，所以 m(C) = 0。f = ∞·χ_C，∫f = ∞·m(C) = ∞·0 = 0（約定）。也可以看成每個 nχ_C 的積分都是 0，取 sup 仍是 0。",
      
      verify: { m: "choice", options: [
        { say: "0", all: [{ v: { m: "let", f: "1-s", with: { s: CANTOR_REMOVED } }, eq: 0 }] },
        { say: "+∞", all: [{ v: { m: "let", f: "1-s", with: { s: CANTOR_REMOVED } }, gt: 0 }] },
        { say: "無法定義（∞ 乘 0）", unknown: "0·∞ = 0 是測度論的約定，不是數值能判的；靠其餘選項被推翻" }
      ] } },
    { id: "cg-12j-009", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "g\\text{ 在 }[0,\\tfrac14]\\text{ 上取 }+\\infty\\text{、在 }(\\tfrac14,1]\\text{ 上取 }x\\text{。}\\int_{[0,1]}g\\,d\\mu=?",
      answer: "+∞", answers: ["+∞"], canonical: "+∞",
      distractors: ["15/32", "1/2"], timeLimit: 120,
      tags: ["posint-infinite-values", "measure", "simple-function"],
      hints: ["g 取 ∞ 的那一塊，測度是不是 0？", "g ≥ n·χ_{[0,1/4]} 對每個 n 都成立：這些的積分是多少？"],
      solution: "g 在測度 ¼ > 0 的集合上取 ∞：g ≥ nχ_{[0,1/4]}，∫g ≥ n/4 對每個 n 成立，所以 ∫g = +∞。15/32 是只積 (¼,1] 上的 x 得到的數，1/2 是把 g 當成 x 的結果 —— 都忽略了那塊正測度。",
      
      verify: { m: "choice", options: [
        { say: "+∞", all: [{ v: { m: "integral", f: "1", a: 0, b: 0.25 }, gt: 0 }] },
        { say: "15/32", all: [{ v: { m: "integral", f: "1", a: 0, b: 0.25 }, eq: 0 }] },
        { say: "1/2", all: [{ v: { m: "integral", f: "1", a: 0, b: 0.25 }, eq: 0 }] }
      ] } },

    /* ── 12J Lebesgue 積分：正負部、可積性、改值不影響 ── */
    { id: "cg-12j-010", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "f(x)=\\sin x\\text{ 在 }\\left[0,\\frac{3\\pi}{2}\\right]\\text{，負部 }f^-=\\max(-f,0)\\text{。求 }\\int f^-\\,d\\mu",
      answer: "1", timeLimit: 90,
      tags: ["lint-positive-negative-parts", "measure", "trig"],
      hints: ["sin x 在哪一段是負的？", "f⁻ 是 −sin x 限制在那一段，其餘是 0。"],
      solution: "sin x 在 (π, 3π/2] 為負：∫f⁻ = ∫_π^{3π/2}(−sin x)dx = [cos x]_π^{3π/2} = 0 − (−1) = 1。（∫f⁺ = 2，∫f = 2 − 1 = 1。）",
      
      verify: { m: "integral", f: "\\frac{|\\sin x|-\\sin x}{2}", a: 0, b: "3\\pi/2", breaks: ["\\pi"] } },
    { id: "cg-12j-011", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f(x)=x^2-1\\text{ 在 }[0,2]\\text{，正部 }f^+=\\max(f,0)\\text{。求 }\\int f^+\\,d\\mu",
      answer: "4/3", timeLimit: 120,
      tags: ["lint-positive-negative-parts", "measure", "definite-integral"],
      hints: ["x² − 1 在 [0,2] 的哪一段是正的？", "f⁺ 在 f 為負的地方是 0，只積正的那段。"],
      solution: "x² − 1 > 0 ⟺ x > 1。∫f⁺ = ∫₁²(x² − 1)dx = (8/3 − 2) − (1/3 − 1) = 4/3。（∫f⁻ = 2/3，∫f = 4/3 − 2/3 = 2/3。）",
      
      verify: { m: "integral", f: "\\frac{|x^2-1|+x^2-1}{2}", a: 0, b: 2, breaks: [1] } },
    { id: "cg-12j-012", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "f(x)=x^3-x\\text{ 在 }[-1,2]\\text{，求正部的積分 }\\int f^+\\,d\\mu",
      answer: "5/2", timeLimit: 150,
      tags: ["lint-positive-negative-parts", "measure", "definite-integral"],
      hints: ["x³ − x = x(x−1)(x+1)：在 [−1,2] 上列出正負號表。", "正的有兩段，兩段都要積。"],
      solution: "x³ − x 在 (−1,0) 為正、(0,1) 為負、(1,2] 為正。∫f⁺ = ∫_{−1}^0(x³ − x)dx + ∫₁²(x³ − x)dx = 1/4 + 9/4 = 5/2。（∫f⁻ = 1/4，∫f = 9/4。）",
      
      verify: { m: "integral", f: "\\frac{|x^3-x|+x^3-x}{2}", a: -1, b: 2, breaks: [0, 1] } },
    { id: "cg-12j-013", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "f(x)=\\frac{\\cos x}{\\sqrt{x}}\\text{ 在 }[1,\\infty)\\text{。}f\\,\\text{ 是 Lebesgue 可積（}\\,L^1\\text{）的嗎？}",
      answer: "不是：瑕積分收斂，但 ∫|f| = ∞", answers: ["不是：瑕積分收斂，但 ∫|f| = ∞"], canonical: "不是：瑕積分收斂，但 ∫|f| = ∞",
      distractors: ["是：瑕積分收斂就是 L¹", "不是：連瑕積分都發散"], timeLimit: 150,
      tags: ["lint-integrability-check", "measure", "improper-integral"],
      hints: ["瑕積分 ∫₁^∞ cos x/√x dx：分部積分後變成 ∫ sin x/x^{3/2}，收不收斂？", "|cos x| 平均起來大約是 2/π：∫|cos x|/√x 和 ∫1/√x 比。"],
      solution: "分部積分：∫₁^B cos x/√x dx = [sin x/√x]₁^B + ½∫₁^B sin x/x^{3/2}dx，後者絕對收斂，所以瑕積分收斂。但 |cos x|/√x 在每個週期上平均約 (2/π)/√x，∫₁^∞ 1/√x 發散，故 ∫|f| = ∞。Lebesgue 可積要求 ∫|f| < ∞，所以不是 L¹。",
      
      verify: { m: "choice", options: [
        { say: "不是：瑕積分收斂，但 ∫|f| = ∞", all: [conv("\\frac{\\cos x}{\\sqrt{x}}", 1, "inf", [], true), conv("\\frac{|\\cos x|}{\\sqrt{x}}", 1, "inf", [], false)] },
        { say: "是：瑕積分收斂就是 L¹", all: [conv("\\frac{|\\cos x|}{\\sqrt{x}}", 1, "inf", [], true)] },
        { say: "不是：連瑕積分都發散", all: [conv("\\frac{\\cos x}{\\sqrt{x}}", 1, "inf", [], false)] }
      ] } },
    { id: "cg-12j-014", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "f(x)=\\frac{1}{1+x}\\text{ 在 }[0,\\infty)\\text{ 上有界（}0<f\\le 1\\text{）。}f\\,\\text{ 是 }\\,L^1([0,\\infty))\\text{ 的嗎？}",
      answer: "不是：定義域無限長，∫f = ∞", answers: ["不是：定義域無限長，∫f = ∞"], canonical: "不是：定義域無限長，∫f = ∞",
      distractors: ["是：有界的可測函數都可積", "是：f → 0，所以積分有限"], timeLimit: 120,
      tags: ["lint-integrability-check", "measure", "improper-integral"],
      hints: ["有界保證的是「高度」，定義域無限長時還要看寬度。", "∫₀^B dx/(1+x) = ln(1+B)：B → ∞ 時呢？"],
      solution: "∫₀^∞ dx/(1+x) = lim ln(1+B) = ∞，所以 f ∉ L¹。「有界就可積」只在有限測度的集合上成立；f → 0 也不夠，要衰減得比 1/x 快。",
      
      verify: { m: "choice", options: [
        { say: "不是：定義域無限長，∫f = ∞", all: [conv("\\frac{1}{1+x}", 0, "inf", [], false)] },
        { say: "是：有界的可測函數都可積", all: [conv("\\frac{1}{1+x}", 0, "inf", [], true)] },
        { say: "是：f → 0，所以積分有限", all: [conv("\\frac{1}{1+x}", 0, "inf", [], true)] }
      ] } },
    { id: "cg-12j-015", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "f(x)=-\\ln x\\text{ 在 }(0,1]\\text{ 上無界。}f\\,\\text{ 是 }\\,L^1((0,1])\\text{ 的嗎？}",
      answer: "是：∫f = 1，無界但可積", answers: ["是：∫f = 1，無界但可積"], canonical: "是：∫f = 1，無界但可積",
      distractors: ["不是：無界函數都不可積", "不是：∫f = ∞"], timeLimit: 120,
      tags: ["lint-integrability-check", "measure", "improper-integral"],
      hints: ["f ≥ 0，所以 L¹ 就是問 ∫₀¹(−ln x)dx 有沒有限。", "分部積分：∫ln x dx = x ln x − x；x ln x 在 0⁺ 的極限是多少？"],
      solution: "∫₀¹(−ln x)dx = [x − x ln x]₀¹ = 1 − 0 = 1 < ∞，所以 f ∈ L¹。可積看的是面積，不是高度：−ln x 爬向 ∞ 的那一段寬度趨近 0，面積有限。",
      
      verify: { m: "choice", options: [
        { say: "是：∫f = 1，無界但可積", all: [conv("-\\ln x", 0, 1, [0], true), { v: { m: "integral", f: "-\\ln x", a: 0, b: 1 }, eq: 1 }] },
        { say: "不是：無界函數都不可積", all: [conv("-\\ln x", 0, 1, [0], false)] },
        { say: "不是：∫f = ∞", all: [conv("-\\ln x", 0, 1, [0], false)] }
      ] } },
    { id: "cg-12j-016", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{在 }[0,2]\\text{ 上，}f(x)=x\\text{（}x\\text{ 無理）、}f(x)=1\\text{（}x\\text{ 有理）。求 }\\int_{[0,2]}f\\,d\\mu",
      answer: "2", timeLimit: 90,
      tags: ["lint-ae-invariance", "measure", "riemann-lebesgue"],
      hints: ["f 和哪一個連續函數幾乎處處相等？", "在零測集上改值，Lebesgue 積分不變。"],
      solution: "f 只在 ℚ∩[0,2]（可數、測度 0）上和 x 不同，所以 f = x a.e.，∫f = ∫₀² x dx = 2。（f 在有理點上的值跳來跳去，Riemann 意義下其實不可積。）",
      
      verify: { m: "integral", f: "x", a: 0, b: 2 } },
    { id: "cg-12j-017", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "C\\,\\text{ 是 Cantor 集。}\\,g(x)=e^x\\text{（}x\\notin C\\text{）、}\\,g(x)=100\\text{（}x\\in C\\text{）。求 }\\int_{[0,1]}g\\,d\\mu",
      answer: "e-1", timeLimit: 120,
      tags: ["lint-ae-invariance", "measure"],
      hints: ["Cantor 集挖掉的總長度是多少？C 本身的測度呢？", "g 和 eˣ 只在 C 上不同。"],
      solution: "挖掉的總長度 Σ2^{n−1}/3^n = 1，m(C) = 0。g = eˣ a.e.，∫g = ∫₀¹eˣdx = e − 1。C 不可數，但測度仍是 0 —— 改值的集合只要測度 0 就好，不必可數。",
      
      verify: { m: "let", f: "q+100(1-s)", with: { q: { m: "integral", f: "e^x", a: 0, b: 1 }, s: CANTOR_REMOVED } } },

    /* ── 12J Riemann vs Lebesgue：分層公式、橫切 ── */
    { id: "cg-12j-018", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{用分層公式 }\\int f\\,d\\mu=\\int_0^{\\infty}\\mu(\\{f>t\\})\\,dt\\text{ 計算 }f(x)=e^{-x}\\text{ 在 }[0,\\infty)\\text{ 上的積分}",
      answer: "1", timeLimit: 150,
      tags: ["rl-layer-cake", "riemann-lebesgue", "measure"],
      hints: ["0 < t < 1 時，{x ≥ 0 : e^{−x} > t} 是哪個區間？它的長度？", "t ≥ 1 時那個集合是空的。"],
      solution: "0 < t < 1：e^{−x} > t ⟺ x < −ln t，μ = −ln t；t ≥ 1 時 μ = 0。∫₀¹(−ln t)dt = [t − t ln t]₀¹ = 1，和直接積 ∫₀^∞ e^{−x}dx = 1 一致。",
      
      verify: { m: "integral", f: "-\\ln t", v: "t", a: 0, b: 1 } },
    { id: "cg-12j-019", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\text{用分層公式 }\\int f\\,d\\mu=\\int_0^{\\infty}\\mu(\\{f>t\\})\\,dt\\text{ 計算 }f(x)=\\sqrt{x}\\text{ 在 }[0,4]\\text{ 上的積分}",
      answer: "16/3", timeLimit: 150,
      tags: ["rl-layer-cake", "riemann-lebesgue", "measure"],
      hints: ["√x > t ⟺ x > t²：在 [0,4] 裡這個集合的長度是多少？", "t 只需要跑到 f 的最大值 2。"],
      solution: "0 ≤ t < 2：{√x > t} = (t², 4]，長度 4 − t²；t ≥ 2 時空集。∫₀²(4 − t²)dt = 8 − 8/3 = 16/3，和 ∫₀⁴√x dx = 16/3 一致。",
      
      verify: { m: "integral", f: "4-t^2", v: "t", a: 0, b: 2 } },
    { id: "cg-12j-020", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\text{用分層公式 }\\int f\\,d\\mu=\\int_0^{\\infty}\\mu(\\{f>t\\})\\,dt\\text{ 計算 }f(x)=\\frac{1}{1+x^2}\\text{ 在 }\\mathbb{R}\\text{ 上的積分}",
      answer: "pi", timeLimit: 210,
      tags: ["rl-layer-cake", "riemann-lebesgue", "measure"],
      hints: ["0 < t < 1：1/(1+x²) > t ⟺ x² < 1/t − 1，集合是對稱區間。", "∫₀¹ 2√(1/t − 1) dt：令 t = 1/(1+u²) 或 t = cos²θ。"],
      solution: "μ({f > t}) = 2√(1/t − 1)（0 < t < 1）。令 t = cos²θ：∫₀¹ 2√((1−t)/t) dt = ∫₀^{π/2} 2·tan θ·2 sin θ cos θ dθ = 4∫₀^{π/2} sin²θ dθ = π。",
      
      verify: { m: "integral", f: "2\\sqrt{\\frac{1}{t}-1}", v: "t", a: 0, b: 1 } },
    { id: "cg-12j-021", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "f(x)=\\frac{1}{\\sqrt{x}}\\text{ 在 }(0,1]\\text{。下列敘述何者正確？}",
      answer: "Riemann（正常）積分不存在，Lebesgue 積分存在且等於 2", answers: ["Riemann（正常）積分不存在，Lebesgue 積分存在且等於 2"], canonical: "Riemann（正常）積分不存在，Lebesgue 積分存在且等於 2",
      distractors: ["兩者都存在且等於 2", "Lebesgue 積分是 +∞", "兩者都不存在"], timeLimit: 150,
      tags: ["rl-horizontal-slicing", "riemann-lebesgue", "improper-integral"],
      hints: ["Riemann（正常）積分要求函數有界：1/√x 在 0 附近呢？", "橫切：μ({f > t}) 在 t ≤ 1 是 1，t > 1 是 1/t²；積起來有限嗎？"],
      solution: "1/√x 在 (0,1] 無界，正常的 Riemann 積分不存在（只能談瑕積分）。橫切：μ({f>t}) = 1（t ≤ 1）、1/t²（t > 1），∫ = 1 + 1 = 2。Lebesgue 積分直接存在，等於 2。",
      
      verify: { m: "choice", options: [
        { say: "Riemann（正常）積分不存在，Lebesgue 積分存在且等於 2", all: [
          { v: { m: "value", f: "\\frac{1}{\\sqrt{10^{-12}}}" }, gt: 1000 },
          { v: { m: "integral", f: "1", v: "t", a: 0, b: 1 }, eq: 1 },
          { v: { m: "integral", f: "t^{-2}", v: "t", a: 1, b: "\\infty" }, eq: 1 },
          { v: { m: "integral", f: "\\frac{1}{\\sqrt{x}}", a: 0, b: 1 }, eq: 2 }] },
        { say: "兩者都存在且等於 2", all: [{ v: { m: "value", f: "\\frac{1}{\\sqrt{10^{-12}}}" }, le: 1000 }] },
        { say: "Lebesgue 積分是 +∞", all: [conv("\\frac{1}{\\sqrt{x}}", 0, 1, [0], false)] },
        { say: "兩者都不存在", all: [conv("\\frac{1}{\\sqrt{x}}", 0, 1, [0], false)] }
      ] } },
    { id: "cg-12j-022", topic: "integrals", rank: 3, answerKind: "text",
      prompt: "\\text{橫切 }f(x)=\\frac{1}{\\sqrt{x}}\\ (0<x\\le 1)\\text{：當 }t>1\\text{ 時，}\\mu(\\{x:f(x)>t\\})=?",
      answer: "1/t²", answers: ["1/t²"], canonical: "1/t²",
      distractors: ["1/t", "1 − 1/t²", "1/√t"], timeLimit: 120,
      tags: ["rl-horizontal-slicing", "riemann-lebesgue", "measure"],
      hints: ["解不等式 1/√x > t，x 落在哪個區間？", "t > 1 時那個區間整個落在 (0,1] 裡面嗎？"],
      solution: "1/√x > t ⟺ x < 1/t²。t > 1 時 1/t² < 1，集合是 (0, 1/t²)，測度 1/t²。",
      
      verify: { m: "choice", options: [
        { say: "1/t²", all: [{ v: { m: "integral", f: "\\frac{1+\\operatorname{sgn}(1/\\sqrt{x}-3)}{2}", a: 0, b: 1, breaks: ["1/9"] }, eq: "1/9" }] },
        { say: "1/t", all: [{ v: { m: "integral", f: "\\frac{1+\\operatorname{sgn}(1/\\sqrt{x}-3)}{2}", a: 0, b: 1, breaks: ["1/9"] }, eq: "1/3" }] },
        { say: "1 − 1/t²", all: [{ v: { m: "integral", f: "\\frac{1+\\operatorname{sgn}(1/\\sqrt{x}-3)}{2}", a: 0, b: 1, breaks: ["1/9"] }, eq: "8/9" }] },
        { say: "1/√t", all: [{ v: { m: "integral", f: "\\frac{1+\\operatorname{sgn}(1/\\sqrt{x}-3)}{2}", a: 0, b: 1, breaks: ["1/9"] }, eq: "1/\\sqrt{3}" }] }
      ] } }
  ];
  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE, difficulty: Math.min(4, problem.rank), ...problem })));
})();
