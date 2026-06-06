(function () {
  "use strict";

  const SOURCE = "Buzz mobile advanced pack";
  const mobileAdvancedProblems = [];

  function add(problem) {
    mobileAdvancedProblems.push({
      source: SOURCE,
      timeLimit: 60,
      tabLimit: 1,
      hints: [],
      ...problem
    });
  }

  function textProblem(id, topic, difficulty, prompt, answers, canonical, tags, solution, hints = []) {
    add({
      id,
      topic,
      difficulty,
      prompt,
      answerKind: "text",
      answers,
      canonical: canonical || answers[0],
      tags,
      solution,
      hints,
      timeLimit: 45
    });
  }

  function numericProblem(id, topic, difficulty, prompt, answer, tags, solution, hints = [], timeLimit = 60) {
    add({
      id,
      topic,
      difficulty,
      prompt,
      answerKind: "numeric",
      answer,
      tags,
      solution,
      hints,
      timeLimit
    });
  }

  [
    ["mob-tech-001", "limits", "\\lim_{x\\to\\infty}(\\sqrt{x^2+3x}-x)", ["rationalize", "rationalization"], "rationalize"],
    ["mob-tech-002", "limits", "\\lim_{x\\to 0}\\frac{e^{2x}-1-2x}{x^2}", ["taylor", "taylor expansion"], "Taylor"],
    ["mob-tech-003", "integrals", "\\int x e^{x^2}\\,dx", ["substitution", "u-sub", "u substitution", "u-substitution"], "u-substitution"],
    ["mob-tech-004", "integrals", "\\int x\\log x\\,dx", ["integration by parts", "ibp"], "integration by parts"],
    ["mob-tech-005", "integrals", "\\int \\frac{dx}{x^2-1}", ["partial fraction", "partial fractions"], "partial fraction"],
    ["mob-tech-006", "integrals", "\\int \\frac{dx}{\\sqrt{a^2-x^2}}", ["trig substitution", "trigonometric substitution"], "trig substitution"],
    ["mob-tech-007", "series", "\\sum_{n=1}^{\\infty}\\frac{n!}{3^n}", ["ratio test", "ratio"], "ratio test"],
    ["mob-tech-008", "series", "\\sum_{n=1}^{\\infty}\\left(\\frac{n}{2n+1}\\right)^n", ["root test", "root"], "root test"],
    ["mob-tech-009", "limits", "\\lim_{(x,y)\\to(0,0)}\\frac{xy}{x^2+y^2}", ["path test", "two path test"], "path test"],
    ["mob-tech-010", "integrals", "\\int_0^1 f(x)\\,dx\\ \\text{ with }f(x)+f(1-x)", ["king", "king's property", "kings property"], "King's property"],
    ["mob-tech-011", "integrals", "\\int_0^\\infty \\frac{e^{-ax}-e^{-bx}}{x}\\,dx", ["frullani", "frullani integral"], "Frullani integral"],
    ["mob-tech-012", "derivatives", "\\text{Optimize }f(x,y)\\text{ subject to }g(x,y)=0", ["lagrange multiplier", "lagrange multipliers", "lm"], "Lagrange multiplier"],
    ["mob-tech-013", "integrals", "\\int_C \\nabla\\phi\\cdot d\\mathbf r", ["fundamental theorem", "gradient theorem"], "gradient theorem"],
    ["mob-tech-014", "derivatives", "\\nabla\\cdot\\mathbf F\\ \\text{ and }\\nabla\\times\\mathbf F", ["nabla", "vector calculus"], "nabla"],
    ["mob-tech-015", "integrals", "\\int_0^1 x^{a-1}(1-x)^{b-1}\\,dx", ["beta", "beta function"], "Beta function"],
    ["mob-tech-016", "integrals", "\\int_0^\\infty x^{s-1}e^{-x}\\,dx", ["gamma", "gamma function"], "Gamma function"],
    ["mob-tech-017", "integrals", "\\int_0^{\\pi/2}\\sin^n x\\,dx", ["wallis", "wallis reduction"], "Wallis reduction"],
    ["mob-tech-018", "derivatives", "x^2y''+xy'+(x^2-\\nu^2)y=0", ["bessel", "bessel equation"], "Bessel equation"],
    ["mob-tech-019", "series", "\\text{Find interval of convergence after radius is known}", ["endpoint analysis", "endpoints"], "endpoint analysis"],
    ["mob-tech-020", "derivatives", "y=x^x", ["logarithmic differentiation", "log differentiation"], "logarithmic differentiation"]
  ].forEach(([id, topic, prompt, answers, canonical]) => {
    textProblem(id, topic, 2, `${prompt}\\quad\\text{Use which technique?}`, answers, canonical, ["technique-sprint", "technique-recognition"], `Use ${canonical}.`);
  });

  [
    ["mob-trap-001", "derivatives", "\\frac{d}{dx}\\sin(3x)", ["missing chain factor", "chain factor", "chain rule"], "missing chain factor"],
    ["mob-trap-002", "integrals", "\\int \\cos(3x)\\,dx", ["divide by inner coefficient", "missing 1/3", "chain factor"], "divide by inner coefficient"],
    ["mob-trap-003", "integrals", "\\int \\frac{1}{x^2+1}\\,dx", ["arctan not log", "arctan", "inverse tangent"], "arctan not log"],
    ["mob-trap-004", "series", "\\sum (-1)^n/n\\ \\text{ is not absolutely convergent}", ["conditional", "conditional convergence"], "conditional"],
    ["mob-trap-005", "series", "\\sum x^n/n\\ \\text{ after finding }R=1", ["check endpoints", "endpoint analysis"], "check endpoints"],
    ["mob-trap-006", "integrals", "\\int_0^\\infty e^{-ax}\\,dx", ["requires a positive", "a positive"], "requires a positive"],
    ["mob-trap-007", "derivatives", "\\frac{\\partial}{\\partial x}y^2", ["treat y constant", "partial derivative"], "treat y constant"],
    ["mob-trap-008", "integrals", "\\iint_R f(x,y)\\,dA\\text{ under change of variables}", ["multiply by jacobian", "jacobian"], "multiply by Jacobian"],
    ["mob-trap-009", "limits", "\\frac{0}{0}\\text{ limit form}", ["not automatically zero", "indeterminate"], "indeterminate"],
    ["mob-trap-010", "integrals", "\\int \\sec x\\tan x\\,dx", ["sec x", "sec"], "sec x"],
    ["mob-trap-011", "derivatives", "\\nabla\\times(\\nabla f)", ["zero", "0"], "zero"],
    ["mob-trap-012", "integrals", "B(a,b)=\\frac{\\Gamma(a)\\Gamma(b)}{\\Gamma(a+b)}", ["denominator gamma a plus b", "gamma a+b", "denominator Gamma(a+b)"], "denominator Gamma(a+b)"]
  ].forEach(([id, topic, prompt, answers, canonical]) => {
    textProblem(id, topic, 2, `${prompt}\\quad\\text{Main trap?}`, answers, canonical, ["trap-drill"], canonical);
  });

  [
    ["mob-limtrap-001", "\\lim_{x\\to 0}\\frac{\\sin x-x}{x^3}", "-1/6"],
    ["mob-limtrap-002", "\\lim_{x\\to 0}\\frac{\\tan x-x}{x^3}", "1/3"],
    ["mob-limtrap-003", "\\lim_{x\\to 0}\\frac{1-\\cos x-x^2/2}{x^4}", "-1/24"],
    ["mob-limtrap-004", "\\lim_{x\\to 0}\\frac{\\log(1+x)-x+x^2/2}{x^3}", "1/3"],
    ["mob-limtrap-005", "\\lim_{x\\to 0}\\frac{e^x-1-x-x^2/2}{x^3}", "1/6"],
    ["mob-limtrap-006", "\\lim_{x\\to 0}\\frac{\\sqrt{1+x}-1-x/2}{x^2}", "-1/8"],
    ["mob-limtrap-007", "\\lim_{(x,y)\\to(0,0)}\\frac{x^2y^2}{x^2+y^2}", "0"],
    ["mob-limtrap-008", "\\lim_{(x,y)\\to(0,0)}\\sqrt{x^2+y^2}\\sin\\frac{1}{\\sqrt{x^2+y^2}}", "0"]
  ].forEach(([id, prompt, answer]) => {
    numericProblem(id, "limits", 3, prompt, answer, ["limit-trap", "taylor"], `The limit is ${answer}.`, ["Use Taylor expansion or squeeze."], 70);
  });

  textProblem("mob-limtrap-009", "limits", 3, "\\lim_{(x,y)\\to(0,0)}\\frac{xy}{x^2+y^2}", ["dne", "does not exist", "no limit"], "DNE", ["limit-trap", "path-test"], "Different paths give different values.", ["Try y=x and y=-x."]);
  textProblem("mob-limtrap-010", "limits", 3, "\\lim_{(x,y)\\to(0,0)}\\frac{x^2-y^2}{x^2+y^2}", ["dne", "does not exist", "no limit"], "DNE", ["limit-trap", "path-test"], "The axes give 1 and -1.", ["Try y=0 and x=0."]);

  [
    ["mob-lm-001", "\\max xy\\ \\text{ subject to }x+y=10\\ (x,y>0)", "25"],
    ["mob-lm-002", "\\min x^2+y^2\\ \\text{ subject to }x+y=6", "18"],
    ["mob-lm-003", "\\max xyz\\ \\text{ subject to }x+y+z=12\\ (x,y,z>0)", "64"],
    ["mob-lm-004", "\\min x^2+y^2\\ \\text{ subject to }xy=8\\ (x,y>0)", "16"],
    ["mob-lm-005", "\\max x^2y\\ \\text{ subject to }x+2y=6\\ (x,y>0)", "16"],
    ["mob-lm-006", "\\min x^2+y^2+z^2\\ \\text{ subject to }x+y+z=3", "3"],
    ["mob-lm-007", "\\max A\\ \\text{ rectangle with perimeter }20", "25"],
    ["mob-lm-008", "\\min x^2+y^2+z^2\\ \\text{ subject to }x+y+z=1", "1/3"],
    ["mob-lm-009", "\\max xy\\ \\text{ subject to }x^2+y^2=50", "25"],
    ["mob-lm-010", "\\max (x+y)\\ \\text{ subject to }x^2+y^2=2", "2"]
  ].forEach(([id, prompt, answer]) => {
    numericProblem(id, "derivatives", 3, prompt, answer, ["lagrange-multiplier", "optimization"], `The optimal value is ${answer}.`, ["Use symmetry or Lagrange multipliers."], 85);
  });

  [
    ["mob-conv-001", "\\sum_{n=1}^{\\infty}\\frac1n", ["divergent", "diverges"], "divergent"],
    ["mob-conv-002", "\\sum_{n=1}^{\\infty}\\frac1{n^2}", ["convergent", "converges"], "convergent"],
    ["mob-conv-003", "\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{n}", ["conditional", "conditionally convergent"], "conditional"],
    ["mob-conv-004", "\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{n^2}", ["absolute", "absolutely convergent"], "absolute"],
    ["mob-conv-005", "\\sum_{n=1}^{\\infty}\\frac{n!}{n^n}", ["convergent", "converges"], "convergent"],
    ["mob-conv-006", "\\sum_{n=1}^{\\infty}\\frac{2^n}{n!}", ["convergent", "converges"], "convergent"],
    ["mob-conv-007", "\\sum_{n=1}^{\\infty}\\frac{n}{n^2+1}", ["divergent", "diverges"], "divergent"],
    ["mob-conv-008", "\\sum_{n=2}^{\\infty}\\frac1{n\\log n}", ["divergent", "diverges"], "divergent"],
    ["mob-conv-009", "\\sum_{n=2}^{\\infty}\\frac1{n(\\log n)^2}", ["convergent", "converges"], "convergent"],
    ["mob-conv-010", "\\sum_{n=1}^{\\infty}\\frac{n+1}{3n+2}", ["divergent", "diverges"], "divergent"]
  ].forEach(([id, prompt, answers, canonical]) => {
    textProblem(id, "series", 3, prompt, answers, canonical, ["convergence-test", "series-test"], `${canonical}.`, ["Check p-series, ratio, comparison, or nth term test."]);
  });

  [
    ["mob-beta-001", "B(1,1)", "1"],
    ["mob-beta-002", "B(2,1)", "1/2"],
    ["mob-beta-003", "B(2,2)", "1/6"],
    ["mob-beta-004", "B(3,2)", "1/12"],
    ["mob-beta-005", "B(1/2,1/2)", "pi"],
    ["mob-beta-006", "B(1/2,1)", "2"],
    ["mob-beta-007", "B(3/2,1/2)", "pi/2"],
    ["mob-beta-008", "\\int_0^1 \\sqrt{x(1-x)}\\,dx", "pi/8"],
    ["mob-beta-009", "B(3,3)", "1/30"],
    ["mob-beta-010", "B(4,1)", "1/4"]
  ].forEach(([id, prompt, answer]) => {
    numericProblem(id, "integrals", 3, prompt, answer, ["beta-function", "special-functions"], `Use B(a,b)=Gamma(a)Gamma(b)/Gamma(a+b).`, ["Convert to the beta function."], 70);
  });

  [
    ["mob-gamma-001", "\\Gamma(1)", "1"],
    ["mob-gamma-002", "\\Gamma(1/2)", "sqrt(pi)"],
    ["mob-gamma-003", "\\Gamma(3/2)", "sqrt(pi)/2"],
    ["mob-gamma-004", "\\Gamma(5/2)", "3*sqrt(pi)/4"],
    ["mob-gamma-005", "\\Gamma(6)", "120"],
    ["mob-gamma-006", "\\int_0^\\infty x^2e^{-x}\\,dx", "2"],
    ["mob-gamma-007", "\\int_0^\\infty x^{1/2}e^{-x}\\,dx", "sqrt(pi)/2"],
    ["mob-gamma-008", "\\Gamma(4)", "6"],
    ["mob-gamma-009", "\\Gamma(7/2)", "15*sqrt(pi)/8"],
    ["mob-gamma-010", "\\Gamma(0+1)", "1"]
  ].forEach(([id, prompt, answer]) => {
    numericProblem(id, "integrals", 3, prompt, answer, ["gamma-function", "special-functions"], `Use the gamma recurrence and Gamma(1/2)=sqrt(pi).`, ["Use Gamma(s+1)=s Gamma(s)."], 70);
  });

  [
    ["mob-wallis-001", "\\int_0^{\\pi/2}\\sin^2x\\,dx", "pi/4"],
    ["mob-wallis-002", "\\int_0^{\\pi/2}\\sin^3x\\,dx", "2/3"],
    ["mob-wallis-003", "\\int_0^{\\pi/2}\\sin^4x\\,dx", "3*pi/16"],
    ["mob-wallis-004", "\\int_0^{\\pi/2}\\sin^5x\\,dx", "8/15"],
    ["mob-wallis-005", "\\int_0^{\\pi/2}\\cos^2x\\,dx", "pi/4"],
    ["mob-wallis-006", "\\int_0^{\\pi/2}\\cos^4x\\,dx", "3*pi/16"],
    ["mob-wallis-007", "\\int_0^{\\pi/2}\\sin^2x\\cos^2x\\,dx", "pi/16"],
    ["mob-wallis-008", "\\int_0^{\\pi/2}\\sin x\\,dx", "1"],
    ["mob-wallis-009", "\\int_0^{\\pi/2}\\cos x\\,dx", "1"],
    ["mob-wallis-010", "\\int_0^{\\pi/2}\\sin x\\cos x\\,dx", "1/2"]
  ].forEach(([id, prompt, answer]) => {
    numericProblem(id, "integrals", 3, prompt, answer, ["wallis", "special-functions"], `Evaluate by Wallis reduction or beta symmetry.`, ["Use symmetry and Wallis reduction."], 70);
  });

  [
    ["mob-bessel-001", "J_0(0)", "1"],
    ["mob-bessel-002", "J_1(0)", "0"],
    ["mob-bessel-003", "\\text{coefficient of }x^2\\text{ in }J_0(x)=1-x^2/4+\\cdots", "-1/4"],
    ["mob-bessel-004", "\\text{coefficient of }x\\text{ in }J_1(x)=x/2+\\cdots", "1/2"]
  ].forEach(([id, prompt, answer]) => {
    numericProblem(id, "derivatives", 3, prompt, answer, ["bessel", "special-functions"], `Use the first terms of Bessel functions.`, ["Recall the leading Taylor terms."], 70);
  });

  [
    ["mob-bessel-005", "J_0'(x)", ["-j1", "-j_1", "-j1(x)", "-j_1(x)"], "-J_1(x)"],
    ["mob-bessel-006", "x^2y''+xy'+(x^2-\\nu^2)y=0", ["bessel", "bessel equation"], "Bessel equation"],
    ["mob-bessel-007", "\\text{Singularity of Bessel equation at }x=0", ["regular singular", "regular singular point"], "regular singular"],
    ["mob-bessel-008", "J_{-2}(x)\\text{ equals}", ["j2", "j_2", "j2(x)", "j_2(x)"], "J_2(x)"],
    ["mob-bessel-009", "J_{-1}(x)\\text{ equals}", ["-j1", "-j_1", "-j1(x)", "-j_1(x)"], "-J_1(x)"],
    ["mob-bessel-010", "\\text{Bessel functions most often appear after which ODE type?}", ["second order", "second-order", "second order ode", "second-order ODE"], "second-order ODE"]
  ].forEach(([id, prompt, answers, canonical]) => {
    textProblem(id, "derivatives", 3, prompt, answers, canonical, ["bessel", "special-functions"], canonical, ["Use standard Bessel identities."]);
  });

  [
    ["mob-nabla-001", "\\nabla\\cdot\\langle x,y,z\\rangle", "3"],
    ["mob-nabla-002", "\\text{z-component of }\\nabla\\times\\langle y,-x,0\\rangle", "-2"],
    ["mob-nabla-003", "\\Delta(x^2+y^2+z^2)", "6"],
    ["mob-nabla-004", "D_{(1,1)/\\sqrt2}(x^2+y^2)\\text{ at }(1,1)", "2*sqrt(2)"],
    ["mob-nabla-005", "\\nabla\\times(\\nabla f)", "0"],
    ["mob-nabla-006", "\\nabla\\cdot(\\nabla\\times\\mathbf F)", "0"],
    ["mob-nabla-007", "\\int_C \\nabla(x^2+y^2)\\cdot d\\mathbf r\\text{ from }(0,0)\\text{ to }(1,1)", "2"]
  ].forEach(([id, prompt, answer]) => {
    numericProblem(id, "derivatives", 3, prompt, answer, ["nabla", "vector-calculus"], `Use standard nabla identities.`, ["Compute gradient, divergence, curl, or Laplacian."], 75);
  });

  [
    ["mob-nabla-008", "\\nabla\\cdot\\nabla f\\text{ is called}", ["laplacian", "laplace operator"], "Laplacian"],
    ["mob-nabla-009", "\\nabla\\times\\mathbf F=0\\text{ usually suggests}", ["conservative", "conservative field"], "conservative field"],
    ["mob-nabla-010", "\\text{Green theorem circulation uses which scalar derivative?}", ["curl", "scalar curl"], "curl"]
  ].forEach(([id, prompt, answers, canonical]) => {
    textProblem(id, "derivatives", 3, prompt, answers, canonical, ["nabla", "vector-calculus"], canonical, ["Think in gradient, divergence, curl, and Laplacian."]);
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(mobileAdvancedProblems);
})();
