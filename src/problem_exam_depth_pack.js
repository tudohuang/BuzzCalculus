(function () {
  "use strict";

  const SOURCE = "Original exam depth pack 2026";
  const problems = [];
  const HINTS = [
    "Identify the dominant tool before computing.",
    "Use WebWork form: log(x), exp(x), sqrt(x), pi."
  ];

  function add(problem) {
    const rank = problem.rank || 6;
    problems.push({
      source: SOURCE,
      difficulty: 4,
      rank,
      rankLabel: rank >= 6 ? "Exam depth R6" : "Exam depth R5",
      timeLimit: rank >= 6 ? 270 : 220,
      tabLimit: 1,
      hints: HINTS,
      ...problem,
      tags: Array.from(new Set([
        ...(problem.tags || []),
        "exam-style",
        "exam-depth",
        rank >= 6 ? "depth-r6" : "depth-r5",
        "transfer-exam",
        "proficiency-exam",
        "midterm-style"
      ]))
    });
  }

  function numeric(id, topic, prompt, answer, tags, solution, rank = 6, timeLimit) {
    add({ id, topic, prompt, answerKind: "numeric", answer, tags, solution, rank, ...(timeLimit ? { timeLimit } : {}) });
  }

  function expression(id, topic, prompt, answer, variable, tags, solution, rank = 6, timeLimit) {
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
      rank,
      ...(timeLimit ? { timeLimit } : {})
    });
  }

  function antiderivative(id, prompt, answer, tags, solution, rank = 6, timeLimit) {
    add({
      id,
      topic: "integrals",
      prompt,
      answerKind: "antiderivative",
      answer,
      variable: "x",
      tags,
      solution,
      rank,
      ...(timeLimit ? { timeLimit } : {})
    });
  }

  [
    ["depth-lim-001", "\\lim_{x\\to0}\\frac{\\sin x-x+\\frac{x^3}{6}-\\frac{x^5}{120}}{x^7}", "-1/5040", ["nested-taylor", "taylor", "trig-limit"], "Keep the x^7 term of sin x.", 6],
    ["depth-lim-002", "\\lim_{x\\to0}\\frac{\\log(1+x)-x+\\frac{x^2}{2}-\\frac{x^3}{3}+\\frac{x^4}{4}}{x^5}", "1/5", ["nested-taylor", "taylor", "log"], "Use the fifth term of log(1+x).", 6],
    ["depth-lim-003", "\\lim_{x\\to0}\\frac{e^{\\sin x}-1-x}{x^2}", "1/2", ["composite-taylor", "taylor", "exponential", "trig-limit"], "The quadratic term comes from (sin x)^2/2.", 5],
    ["depth-lim-004", "\\lim_{x\\to0}\\frac{\\cos x-\\sqrt{1-x^2}}{x^4}", "1/6", ["asymptotic-balance", "taylor", "radical", "trig-limit"], "Compare fourth-order coefficients.", 6],
    ["depth-lim-005", "\\lim_{x\\to0}\\frac{\\tan x-x}{x(1-\\cos x)}", "2/3", ["asymptotic-balance", "taylor", "trig-limit"], "Use tan x-x ~ x^3/3 and 1-cos x ~ x^2/2.", 5],
    ["depth-lim-006", "\\lim_{x\\to\\infty}x^2\\left(\\log\\left(1+\\frac{1}{x}\\right)-\\frac{1}{x+1}\\right)", "1/2", ["infinity-limit", "log-limit", "asymptotic-balance"], "Put u=1/x and compare the u^2 term.", 6],
    ["depth-lim-008", "\\lim_{x\\to0}\\frac{\\arcsin x-\\arctan x}{x^3}", "1/2", ["inverse-trig", "taylor"], "Compare the cubic coefficients.", 5],
    ["depth-lim-009", "\\lim_{x\\to0}\\frac{\\sinh x-\\sin x}{x^3}", "1/3", ["hyperbolic", "taylor", "trig-limit"], "The cubic terms have opposite signs.", 5],
    ["depth-lim-010", "\\lim_{x\\to0}\\frac{1-\\cos x}{x\\sin x}", "1/2", ["trig-limit", "asymptotic-balance"], "Use 1-cos x ~ x^2/2 and sin x ~ x.", 5],
    ["depth-lim-011", "\\lim_{x\\to0}\\frac{\\log(\\cos x)}{x^2}", "-1/2", ["log", "taylor", "trig-limit"], "Use cos x=1-x^2/2+...", 5],
    ["depth-lim-012", "\\lim_{x\\to0}\\frac{(1+x+x^2)^{1/x}-e}{x}", "exp(1)/2", ["exponential-limit", "log-limit", "nested-taylor"], "Expand x^{-1}log(1+x+x^2).", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => numeric(id, "limits", prompt, answer, tags, solution, rank));

  [
    ["depth-der-001", "\\frac{d}{dx}\\left(x^{x^2}\\right)", "x^(x^2)*(2*x*log(x)+x)", "x", ["log-differentiation", "power-exponential"], "Differentiate x^2 log x.", 5],
    ["depth-der-002", "\\frac{d}{dx}\\left((\\sin x)^{\\cos x}\\right)", "sin(x)^cos(x)*(-sin(x)*log(sin(x))+cos(x)*cot(x))", "x", ["log-differentiation", "trig"], "Differentiate cos x log(sin x).", 6],
    ["depth-der-004", "\\frac{d^3}{dx^3}\\left(x^2\\log x\\right)", "2/x", "x", ["higher-derivative", "log"], "After two derivatives the expression is 2 log x+3.", 5],
    ["depth-der-005", "\\frac{d}{dx}\\left(\\int_{x^2}^{x^3}\\cos(t^2)\\,dt\\right)", "3*x^2*cos(x^6)-2*x*cos(x^4)", "x", ["fundamental-theorem", "chain-rule", "moving-limits"], "Apply FTC to both moving limits.", 6],
    ["depth-der-006", "\\frac{d}{dx}\\log\\left(x+\\sqrt{x^2+4}\\right)", "1/sqrt(x^2+4)", "x", ["chain-rule", "log", "radical"], "This is an asinh-type derivative.", 5],
    ["depth-der-007", "x^3+y^3=6xy,\\ \\left.\\frac{dy}{dx}\\right|_{(3,3)}", "-1", null, ["implicit-differentiation"], "Differentiate implicitly and substitute (3,3).", 5],
    ["depth-der-008", "x=e^t,\\ y=te^t.\\ \\left.\\frac{dy}{dx}\\right|_{t=0}", "1", null, ["parametric"], "dy/dx=(dy/dt)/(dx/dt)=t+1.", 5],
    ["depth-der-009", "x=t^2,\\ y=t^3.\\ \\left.\\frac{d^2y}{dx^2}\\right|_{t=1}", "3/4", null, ["parametric", "higher-derivative"], "Differentiate dy/dx with respect to t, then divide by dx/dt.", 6],
    ["depth-der-010", "f(x)=e^x+x^2,\\ f(0)=1.\\ \\text{find }(f^{-1})''(1)", "-3", null, ["inverse-function", "higher-derivative"], "Use -(f''(0))/(f'(0))^3.", 6],
    ["depth-der-011", "\\text{Hessian determinant of }f(x,y)=x^2y+y^3\\text{ at }(1,1)", "8", null, ["multivariable", "hessian"], "The Hessian is [[2,2],[2,6]].", 5],
    ["depth-der-012", "\\Delta\\log(x^2+y^2)", "0", ["x", "y"], ["multivariable", "nabla", "laplacian"], "Away from the origin the Laplacian is zero.", 6],
    ["depth-der-013", "\\nabla\\cdot(xyz,\\ x^2z,\\ xy^2)", "y*z", ["x", "y", "z"], ["multivariable", "nabla", "vector-calculus"], "Only the first component contributes yz.", 5],
    ["depth-der-014", "\\text{z-component of }\\nabla\\times(x^2y,\\ xy^2,\\ z)", "y^2-x^2", ["x", "y"], ["multivariable", "nabla", "vector-calculus"], "Compute partial_x Q - partial_y P.", 5],
    ["depth-der-015", "\\frac{d}{dx}\\arccos\\left(\\frac{1-x^2}{1+x^2}\\right)", "2/(1+x^2)", "x", ["inverse-trig", "chain-rule"], "For x>0 this angle is 2 arctan x.", 6],
    ["depth-der-016", "\\frac{d}{dx}\\left(\\frac{(\\log x)^2}{x}\\right)", "(2*log(x)-log(x)^2)/x^2", "x", ["quotient-rule", "log"], "Differentiate log(x)^2 x^{-1}.", 5],
    ["depth-der-017", "\\left.\\frac{d^4}{dx^4}\\cos(3x)\\right|_{x=0}", "81", null, ["higher-derivative", "trig"], "The fourth derivative returns 3^4 cos(3x).", 5],
    ["depth-der-018", "\\frac{d}{dx}\\sqrt{x+\\sqrt{x}}", "(1+1/(2*sqrt(x)))/(2*sqrt(x+sqrt(x)))", "x", ["chain-rule", "radical"], "Chain rule across both radicals.", 5]
  ].forEach(([id, prompt, answer, variable, tags, solution, rank]) => {
    if (Array.isArray(variable)) expression(id, "derivatives", prompt, answer, variable, tags, solution, rank);
    else if (variable === "x") expression(id, "derivatives", prompt, answer, variable, tags, solution, rank);
    else numeric(id, "derivatives", prompt, answer, tags, solution, rank);
  });

  [
    ["depth-int-002", "\\int \\frac{x^5}{1+x^3}\\,dx", "x^3/3-log(1+x^3)/3", ["algebra", "rational", "substitution"], "Divide as x^2-x^2/(1+x^3).", 6],
    ["depth-int-003", "\\int \\frac{x}{(1+x^2)^{3/2}}\\,dx", "-1/sqrt(1+x^2)", ["substitution", "radical"], "Let u=1+x^2.", 5],
    ["depth-int-005", "\\int xe^x\\sin x\\,dx", "exp(x)*(x*(sin(x)-cos(x))+cos(x))/2", ["integration-by-parts", "exponential", "trig"], "Use parts with the standard integral of e^x sin x.", 6],
    ["depth-int-006", "\\int e^{2x}\\cos(3x)\\,dx", "exp(2*x)*(2*cos(3*x)+3*sin(3*x))/13", ["integration-by-parts", "exponential", "trig"], "Use the exponential-trig formula.", 5],
    ["depth-int-007", "\\int \\frac{\\arctan\\sqrt{x}}{\\sqrt{x}}\\,dx", "2*sqrt(x)*atan(sqrt(x))-log(1+x)", ["substitution", "integration-by-parts", "inverse-trig"], "Let u=sqrt x, then integrate atan u.", 6],
    ["depth-int-008", "\\int \\frac{1}{x\\sqrt{\\log x}}\\,dx", "2*sqrt(log(x))", ["substitution", "log", "radical"], "Let u=log x.", 5],
    ["depth-int-009", "\\int \\sin(\\log x)\\,dx", "x*(sin(log(x))-cos(log(x)))/2", ["substitution", "exponential", "trig"], "Set x=e^u.", 6],
    ["depth-int-010", "\\int \\frac{1}{\\sqrt{x}(1+\\sqrt{x})}\\,dx", "2*log(1+sqrt(x))", ["substitution", "radical", "log"], "Let u=sqrt x.", 5],
    ["depth-int-011", "\\int \\frac{x^2}{(1+x^2)^2}\\,dx", "atan(x)/2-x/(2*(1+x^2))", ["rational", "inverse-trig"], "Rewrite as 1/(1+x^2)-1/(1+x^2)^2.", 6],
    ["depth-int-013", "\\int \\frac{\\sec^2x}{1+\\tan x}\\,dx", "log(1+tan(x))", ["substitution", "trig-integral"], "Let u=1+tan x.", 5],
    ["depth-int-014", "\\int x\\log(1+x)\\,dx", "x^2*log(1+x)/2-x^2/4+x/2-log(1+x)/2", ["integration-by-parts", "log", "rational"], "After parts, divide x^2 by x+1.", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => antiderivative(id, prompt, answer, tags, solution, rank));

  [
    ["depth-int-015", "\\int_0^1\\frac{x}{1+x+x^2}\\,dx", "log(3)/2-pi/(6*sqrt(3))", ["definite-integral", "rational", "inverse-trig"], "Split x as half the derivative minus a constant.", 6],
    ["depth-int-016", "\\int_0^{\\pi/2}x\\cos x\\,dx", "pi/2-1", ["definite-integral", "integration-by-parts", "trig"], "Integrate by parts.", 5],
    ["depth-int-017", "\\int_0^1\\frac{\\log(1+x)}{x}\\,dx", "pi^2/12", ["definite-integral", "taylor", "special-sum"], "Expand log(1+x) and integrate termwise.", 6],
    ["depth-int-018", "\\int_0^1\\frac{x^3}{(1+x^2)^2}\\,dx", "log(2)/2-1/4", ["definite-integral", "substitution", "rational"], "Let u=1+x^2.", 6],
    ["depth-int-019", "\\int_0^\\infty\\frac{x}{(1+x^2)^2}\\,dx", "1/2", ["improper-integral", "substitution"], "Let u=1+x^2.", 5],
    ["depth-int-020", "\\int_0^\\infty\\frac{1}{(x^2+1)(x^2+4)}\\,dx", "pi/12", ["improper-integral", "partial-fraction", "inverse-trig"], "Use partial fractions in x^2.", 6],
    ["depth-int-021", "\\int_0^\\pi\\sin^4x\\,dx", "3*pi/8", ["definite-integral", "trig-integral"], "Use power reduction or Wallis.", 5],
    ["depth-int-022", "\\int_0^1\\int_y^1 x\\,dx\\,dy", "1/3", ["double-integral", "region"], "Integrate x first, then y.", 5],
    ["depth-int-023", "\\text{area enclosed by }r=1+\\cos\\theta", "3*pi/2", ["polar-coordinates", "polar-curve", "area"], "Use one-half integral of r^2 from 0 to 2pi.", 6],
    ["depth-int-026", "\\int_0^\\infty x^3e^{-x^2}\\,dx", "1/2", ["improper-integral", "gamma-function", "substitution"], "Let u=x^2.", 5],
    ["depth-int-027", "\\int_0^1\\frac{1}{\\sqrt{1-x^2}}\\,dx", "pi/2", ["definite-integral", "trig-substitution", "inverse-trig"], "This is arcsin x from 0 to 1.", 5],
    ["depth-int-028", "\\int_0^1x^2\\log x\\,dx", "-1/9", ["improper-integral", "integration-by-parts", "log"], "Use the parameter integral or parts.", 5]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => numeric(id, "integrals", prompt, answer, tags, solution, rank, 260));

  [
    ["depth-ser-001", "\\sum_{n=1}^{\\infty}\\frac{n(n+1)}{3^n}", "9/4", ["sum-series", "power-series"], "Use the sums for n r^n and n^2 r^n.", 5],
    ["depth-ser-002", "\\sum_{n=1}^{\\infty}\\frac{n^2}{4^n}", "20/27", ["sum-series", "power-series"], "Use r(1+r)/(1-r)^3.", 5],
    ["depth-ser-003", "\\sum_{n=1}^{\\infty}\\frac{1}{(2n-1)(2n+1)}", "1/2", ["telescoping-series"], "Decompose as one-half of consecutive odd reciprocals.", 5],
    ["depth-ser-004", "\\text{coefficient of }x^7\\text{ in }e^{3x}", "243/560", ["taylor", "coefficient"], "The coefficient is 3^7/7!.", 5],
    ["depth-ser-005", "\\text{coefficient of }x^8\\text{ in }\\cos(x^2)", "1/24", ["taylor", "coefficient"], "Use cos z with z=x^2.", 5],
    ["depth-ser-006", "\\text{coefficient of }x^6\\text{ in }\\frac{\\sin x}{x}", "-1/5040", ["taylor", "coefficient", "trig"], "Divide the sine series by x.", 5],
    ["depth-ser-007", "\\sum_{n=0}^{\\infty}\\frac{1}{(2n)!}", "(exp(1)+exp(-1))/2", ["taylor", "sum-series", "hyperbolic"], "This is cosh(1).", 5],
    ["depth-ser-008", "\\sum_{n=1}^{\\infty}\\frac{n}{3^{n+1}}", "1/4", ["sum-series", "power-series"], "It is one third of sum n/3^n.", 5],
    ["depth-ser-009", "\\text{radius of convergence of }\\sum_{n=0}^{\\infty}{2n\\choose n}x^n", "1/4", ["power-series", "radius", "root-test"], "Central binomial coefficients grow like 4^n.", 6],
    ["depth-ser-010", "\\text{radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{(n!)^2}{(2n)!}3^n x^n", "4/3", ["power-series", "radius", "root-test"], "Use the reciprocal central binomial growth.", 6],
    ["depth-ser-011", "\\text{coefficient of }x^5\\text{ in }\\frac{1}{(1-2x)^2}", "192", ["coefficient", "geometric-series"], "The coefficient is (n+1)2^n with n=5.", 5],
    ["depth-ser-012", "\\sum_{n=1}^{\\infty}\\frac{n^2}{2^{n+1}}", "3", ["sum-series", "power-series"], "This is half of sum n^2/2^n.", 5],
    ["depth-ser-013", "\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{(2n)!}", "cos(1)", ["taylor", "sum-series"], "This is the cosine series at 1.", 5],
    ["depth-ser-014", "\\sum_{n=1}^{\\infty}\\frac{1}{n(n+1)(n+2)}", "1/4", ["telescoping-series"], "Use a telescoping split.", 5],
    ["depth-ser-015", "\\text{coefficient of }x^3\\text{ in }e^x\\log(1+x)", "1/3", ["taylor", "coefficient"], "Convolve the two Taylor series.", 6],
    ["depth-ser-016", "\\sum_{n=1}^{\\infty}\\frac{n^3}{3^n}", "33/8", ["sum-series", "power-series"], "Use the cubic power-series sum.", 6],
    ["depth-ser-017", "\\text{radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{n^3+1}{5^n}x^n", "5", ["power-series", "radius"], "Polynomial factors do not affect the radius.", 5],
    ["depth-ser-018", "\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{(2n+1)!}", "sin(1)", ["taylor", "sum-series"], "This is the sine series at 1.", 5],
    ["depth-ser-019", "\\text{coefficient of }x^4\\text{ in }(\\log(1+x))^2", "11/12", ["taylor", "coefficient", "log"], "Square the log series through x^4.", 6],
    ["depth-ser-020", "\\text{radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{2^n}{n^2}(x+1)^n", "1/2", ["power-series", "radius"], "The nth root of 2^n/n^2 is 2.", 5]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => numeric(id, "series", prompt, answer, tags, solution, rank, 230));

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
