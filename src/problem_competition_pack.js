(function () {
  "use strict";

  // Putnam-style problems, hard derivatives, and tough applications.
  // All ranked 4-6 so they never enter the easy (R1-2) practice pools.
  // Answers use WebWork notation (log = ln).
  const SOURCE = "Putnam / hard derivatives / applications pack 2026";
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
      tags: Array.from(new Set([...(p.tags || []), p.school, ...rankTags].filter(Boolean)))
    });
  }
  function N(id, topic, rank, prompt, answer, school, tags, solution) {
    add({ id, topic, rank, prompt, answerKind: "numeric", answer, school, tags, solution });
  }
  function X(id, topic, rank, prompt, answer, variable, school, tags, solution) {
    add({ id, topic, rank, prompt, answerKind: "expression", answer, variable, variables: Array.isArray(variable) ? variable : undefined, school, tags, solution });
  }

  /* ===== Putnam-style ===== */
  N("putnam-001", "series", 5, "\\sum_{n=1}^{\\infty}\\arctan\\!\\frac{1}{n^2+n+1}", "pi/4", "Putnam", ["putnam", "telescoping", "inverse-trig"], "Telescopes to π/2 - arctan(1) = π/4.");
  N("putnam-002", "series", 5, "\\prod_{n=2}^{\\infty}\\frac{n^3-1}{n^3+1}", "2/3", "Putnam", ["putnam", "product"], "Telescoping product equals 2/3.");
  N("putnam-003", "limits", 5, "\\lim_{n\\to\\infty}\\prod_{k=1}^{n}\\left(1+\\frac{k}{n}\\right)^{1/n}", "4/exp(1)", "Putnam", ["putnam", "product-limit", "riemann-sum"], "log -> ∫_0^1 log(1+x)dx = 2log2-1.");
  N("putnam-004", "integrals", 5, "\\int_{-1}^{1}\\frac{dx}{(1+e^{x})(1+x^2)}", "pi/4", "Putnam", ["putnam", "symmetry"], "Add the x->-x reflection.");
  N("putnam-005", "integrals", 6, "\\int_0^{\\pi/2}\\frac{dx}{1+(\\tan x)^{\\sqrt2}}", "pi/4", "Putnam", ["putnam", "kings-property"], "King's property, independent of the exponent.");
  N("putnam-006", "series", 6, "\\prod_{n=1}^{\\infty}\\left(1-\\frac{1}{(2n)^2}\\right)", "2/pi", "Putnam", ["putnam", "wallis", "product"], "Wallis product gives 2/π.");
  N("putnam-007", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{n}{n^4+n^2+1}", "1/2", "Putnam", ["putnam", "telescoping"], "n^4+n^2+1=(n^2+n+1)(n^2-n+1).");
  N("putnam-008", "limits", 5, "\\lim_{x\\to 0}\\frac{1}{x}\\int_0^{x}(1+\\sin 2t)^{1/t}\\,dt", "exp(2)", "Putnam", ["putnam", "limit", "ftc"], "Integrand -> e^2; average -> e^2.");
  N("putnam-009", "integrals", 6, "\\int_0^{\\infty}\\frac{dx}{(1+x^2)(1+x^3)}", "pi/4", "Putnam", ["putnam", "symmetry"], "x->1/x symmetry gives π/4.");
  N("putnam-010", "limits", 6, "\\lim_{n\\to\\infty}\\frac{1}{n}\\sum_{k=1}^{n}\\frac{1}{1+(k/n)^2}", "pi/4", "Putnam", ["putnam", "riemann-sum"], "Riemann sum of 1/(1+x^2).");
  N("putnam-011", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n(n+1)}", "2*log(2)-1", "Putnam", ["putnam", "alternating", "telescoping"], "(-1)^{n+1}(1/n - 1/(n+1)).");
  N("putnam-012", "integrals", 6, "\\int_0^{\\infty}\\frac{\\arctan(2x)-\\arctan x}{x}\\,dx", "pi*log(2)/2", "Putnam", ["putnam", "frullani"], "Frullani for arctan: (π/2)ln(2/1).");

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
  X("hd-011", "derivatives", 5, "\\frac{d}{dx}\\,\\log\\tan\\frac{x}{2}", "1/sin(x)", "x", "Oxford", ["trig", "chain-rule"], "Derivative of log tan(x/2) is csc x.");
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
  N("app-012", "derivatives", 6, "\\text{曲線 }y=\\log x\\text{ 的最大曲率}", "2/(3*sqrt(3))", "Princeton", ["applications", "curvature"], "κ = x/(x^2+1)^{3/2}, max at x=1/√2.");

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
