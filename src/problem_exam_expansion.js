(function () {
  "use strict";

  const SOURCE = "Exam-style expansion 2026";
  const examProblems = [];
  const EXAM_HINTS = [
    "This is exam-style: identify the main tool before calculating.",
    "Keep the final answer in WebWork syntax, e.g. log(x), exp(x), sqrt(x), pi."
  ];

  function add(problem) {
    examProblems.push({
      source: SOURCE,
      difficulty: 4,
      rank: 5,
      timeLimit: 180,
      tabLimit: 1,
      hints: EXAM_HINTS,
      ...problem,
      tags: Array.from(new Set([...(problem.tags || []), "exam-style", "transfer-exam", "proficiency-exam"]))
    });
  }

  function numeric(id, topic, prompt, answer, tags, solution, timeLimit = 180) {
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

  function expression(id, topic, prompt, answer, variable, tags, solution, timeLimit = 180) {
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

  function antiderivative(id, prompt, answer, tags, solution, timeLimit = 210) {
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
    ["exam-lim-001", "\\lim_{x\\to0}\\frac{\\sin(3x)-3x+\\frac{9}{2}x^3}{x^5}", "81/40", ["taylor", "trig-limit"], "Expand sin(3x) through the x^5 term."],
    ["exam-lim-002", "\\lim_{x\\to0}\\frac{\\log(1+2x)-2x+2x^2}{x^3}", "8/3", ["taylor", "log"], "Use log(1+u)=u-u^2/2+u^3/3+... with u=2x."],
    ["exam-lim-003", "\\lim_{x\\to0}\\frac{e^x-\\cos x-\\sin x}{x^2}", "1", ["taylor", "exponential", "trig-limit"], "The constant and linear terms cancel; the x^2 coefficient is 1."],
    ["exam-lim-005", "\\lim_{x\\to0}\\frac{1-\\cos(2x)}{x^2}", "2", ["trig-limit"], "1-cos u is asymptotic to u^2/2."],
    ["exam-lim-006", "\\lim_{x\\to0}\\frac{\\sqrt{1+4x}-1-2x}{x^2}", "-2", ["taylor", "radical"], "sqrt(1+4x)=1+2x-2x^2+..."],
    ["exam-lim-007", "\\lim_{x\\to\\infty}x^2\\left(\\sqrt{1+\\frac{3}{x}}-1-\\frac{3}{2x}\\right)", "-9/8", ["taylor", "infinity-limit"], "Apply sqrt(1+u)=1+u/2-u^2/8+... with u=3/x."],
    ["exam-lim-008", "\\lim_{x\\to\\infty}\\frac{x^2+1}{3x^2-2x}", "1/3", ["rational"], "Compare leading terms."],
    ["exam-lim-009", "\\lim_{x\\to0}\\frac{x-\\sin x}{x(1-\\cos x)}", "1/3", ["taylor", "trig-limit"], "Use x-sin x ~ x^3/6 and 1-cos x ~ x^2/2."],
    ["exam-lim-010", "\\lim_{x\\to0}\\frac{\\arctan(2x)-2x}{x^3}", "-8/3", ["taylor", "inverse-trig"], "arctan u=u-u^3/3+..."],
    ["exam-lim-011", "\\lim_{x\\to0^+}x^x", "1", ["log-limit"], "Write x^x=exp(x log x), and x log x -> 0."],
    ["exam-lim-012", "\\lim_{x\\to\\infty}\\left(1+\\frac{2}{x}\\right)^{3x}", "exp(6)", ["exponential-limit"], "This is exp(3x log(1+2/x)) -> exp(6)."],
    ["exam-lim-015", "\\lim_{x\\to0}\\frac{e^{\\sin x}-1}{x}", "1", ["chain-rule", "exponential-limit"], "e^{sin x}-1 is asymptotic to sin x."],
    ["exam-lim-017", "\\lim_{x\\to0}\\frac{\\cos x-e^{-x^2/2}}{x^4}", "-1/12", ["taylor"], "Compare x^4 coefficients: 1/24 and 1/8."],
    ["exam-lim-019", "\\lim_{x\\to\\infty}x\\left(\\log(x+1)-\\log x\\right)", "1", ["log-limit"], "Rewrite as x log(1+1/x)."],
    ["exam-lim-020", "\\lim_{x\\to0}\\frac{\\arcsin x-x}{x^3}", "1/6", ["taylor", "inverse-trig"], "arcsin x=x+x^3/6+..."]
  ].forEach(([id, prompt, answer, tags, solution]) => numeric(id, "limits", prompt, answer, tags, solution));

  [
    ["exam-der-003", "\\frac{d}{dx}\\left(\\frac{\\log x}{x}\\right)", "(1-log(x))/x^2", "x", ["quotient-rule", "log"], "Use quotient rule or x^{-1} log x."],
    ["exam-der-004", "\\frac{d}{dx}\\arctan\\left(\\frac{1+x}{1-x}\\right)", "1/(1+x^2)", "x", ["chain-rule", "inverse-trig"], "The derivative simplifies after combining 1+u^2."],
    ["exam-der-005", "\\frac{d}{dx}\\left(x^2e^{-x}\\sin x\\right)", "exp(-x)*(2*x*sin(x)-x^2*sin(x)+x^2*cos(x))", "x", ["product-rule", "exponential", "trig"], "Apply product rule across x^2, e^{-x}, and sin x."],
    ["exam-der-006", "\\frac{d}{dx}\\log\\left(\\sqrt{1+x^2}+x\\right)", "1/sqrt(1+x^2)", "x", ["log", "radical"], "This is the derivative of asinh x."],
    ["exam-der-007", "\\frac{d^2}{dx^2}\\left(e^{x^2}\\right)", "(2+4*x^2)*exp(x^2)", "x", ["higher-derivative", "chain-rule"], "Differentiate 2x e^{x^2}."],
    ["exam-der-009", "\\frac{d}{dx}\\left(\\frac{\\cos x}{1+\\sin x}\\right)", "-1/(1+sin(x))", "x", ["quotient-rule", "trig"], "The numerator becomes -(1+sin x)."],
    ["exam-der-010", "\\frac{d}{dx}\\left(x\\log(1+x^2)\\right)", "log(1+x^2)+2*x^2/(1+x^2)", "x", ["product-rule", "log"], "Product rule plus chain rule."],
    ["exam-der-011", "\\frac{d}{dx}\\left(\\frac{(x^2+1)^3}{x-1}\\right)", "(x^2+1)^2*(6*x*(x-1)-(x^2+1))/(x-1)^2", "x", ["quotient-rule", "chain-rule"], "Factor (x^2+1)^2 after quotient rule."],
    ["exam-der-012", "若 y=x^2e^x，求 \\frac{y'}{y}", "2/x+1", "x", ["log-differentiation"], "Take log y=2 log x+x, then differentiate."],
    ["exam-der-013", "x=t^2+1,\\ y=t^3-t.\\ 求 \\frac{dy}{dx}\\bigg|_{t=2}", "11/4", "derivatives", ["parametric"], "dy/dx=(dy/dt)/(dx/dt)=(3t^2-1)/(2t)."],
    ["exam-der-014", "\\frac{d}{dx}\\left(\\int_0^{x^2}e^{t^2}\\,dt\\right)", "2*x*exp(x^4)", "x", ["fundamental-theorem", "chain-rule"], "Use FTC with upper limit x^2."],
    ["exam-der-015", "\\frac{d}{dx}\\left(\\int_x^{x^2}\\log(1+t^2)\\,dt\\right)", "2*x*log(1+x^4)-log(1+x^2)", "x", ["fundamental-theorem", "chain-rule"], "Differentiate both variable limits."],
    ["exam-der-016", "f(x)=x+e^x.\\ 若 f(0)=1，求 (f^{-1})'(1)", "1/2", "derivatives", ["inverse-function"], "(f^{-1})'(1)=1/f'(0)=1/2."],
    ["exam-der-017", "\\frac{d}{dx}\\arctan(\\sqrt{x})", "1/(2*sqrt(x)*(1+x))", "x", ["chain-rule", "inverse-trig", "radical"], "Chain rule with u=sqrt x."],
    ["exam-der-018", "\\frac{d}{dx}\\log(\\sec x+\\tan x)", "sec(x)", "x", ["trig", "log"], "This standard derivative equals sec x."],
    ["exam-der-019", "\\frac{d}{dx}\\left(\\frac{x}{\\sqrt{1+x^2}}\\right)", "1/(1+x^2)^(3/2)", "x", ["quotient-rule", "radical"], "Differentiate x(1+x^2)^{-1/2}."],
    ["exam-der-020", "\\frac{d}{dx}\\left(\\frac{e^x}{1+e^x}\\right)", "exp(x)/(1+exp(x))^2", "x", ["quotient-rule", "exponential"], "Quotient rule cancels to one e^x term."]
  ].forEach(([id, prompt, answer, variable, tags, solution]) => {
    if (variable === "derivatives") numeric(id, "derivatives", prompt, answer, tags, solution);
    else expression(id, "derivatives", prompt, answer, variable, tags, solution);
  });

  [
    ["exam-int-001", "\\int \\frac{x}{(1+x^2)^2}\\,dx", "-1/(2*(1+x^2))", ["substitution", "rational"], "Let u=1+x^2."],
    ["exam-int-002", "\\int \\frac{x^3}{1+x^2}\\,dx", "x^2/2-log(1+x^2)/2", ["algebra", "rational"], "Divide x^3 by 1+x^2 as x - x/(1+x^2)."],
    ["exam-int-004", "\\int x\\log x\\,dx", "x^2*log(x)/2-x^2/4", ["integration-by-parts", "log"], "Let u=log x and dv=x dx."],
    ["exam-int-005", "\\int \\frac{\\log x}{x}\\,dx", "log(x)^2/2", ["substitution", "log"], "Let u=log x."],
    ["exam-int-007", "\\int \\sec^2x\\tan x\\,dx", "tan(x)^2/2", ["trig-integral", "substitution"], "Let u=tan x."],
    ["exam-int-010", "\\int \\frac{\\sqrt{x}}{1+x^{3/2}}\\,dx", "2*log(1+x^(3/2))/3", ["substitution", "radical"], "Let u=1+x^{3/2}."],
    ["exam-int-011", "\\int \\frac{x}{\\sqrt{4-x^2}}\\,dx", "-sqrt(4-x^2)", ["substitution", "radical"], "Let u=4-x^2."],
    ["exam-int-012", "\\int e^{2x}\\sin x\\,dx", "exp(2*x)*(2*sin(x)-cos(x))/5", ["integration-by-parts", "exponential", "trig"], "Use the standard exponential-trig formula."],
    ["exam-int-013", "\\int \\arctan x\\,dx", "x*atan(x)-log(1+x^2)/2", ["integration-by-parts", "inverse-trig"], "Let u=arctan x and dv=dx."],
    ["exam-int-014", "\\int \\frac{x^2}{x^2+1}\\,dx", "x-atan(x)", ["algebra", "inverse-trig"], "Rewrite as 1-1/(x^2+1)."],
    ["exam-int-015", "\\int \\frac{1}{x\\log x}\\,dx", "log(log(x))", ["substitution", "log"], "Let u=log x."],
    ["exam-int-016", "\\int \\frac{\\cos(\\log x)}{x}\\,dx", "sin(log(x))", ["substitution", "trig"], "Let u=log x."],
    ["exam-int-017", "\\int \\frac{2x+3}{x^2+3x+5}\\,dx", "log(x^2+3*x+5)", ["substitution", "rational"], "The numerator is the derivative of the denominator."],
    ["exam-int-018", "\\int \\frac{x}{x^4+1}\\,dx", "atan(x^2)/2", ["substitution", "inverse-trig"], "Let u=x^2."],
    ["exam-int-019", "\\int \\frac{1}{\\sqrt{x}(1+x)}\\,dx", "2*atan(sqrt(x))", ["substitution", "radical"], "Let u=sqrt x."],
    ["exam-int-020", "\\int \\frac{x^2}{\\sqrt{1+x^3}}\\,dx", "2*sqrt(1+x^3)/3", ["substitution", "radical"], "Let u=1+x^3."]
  ].forEach(([id, prompt, answer, tags, solution]) => antiderivative(id, prompt, answer, tags, solution));

  [
    ["exam-int-021", "\\int_0^1\\frac{x}{1+x^2}\\,dx", "log(2)/2", ["definite-integral", "substitution"], "Let u=1+x^2."],
    ["exam-int-024", "\\int_0^{\\pi/2}\\frac{\\sin x}{1+\\cos x}\\,dx", "log(2)", ["definite-integral", "substitution", "trig"], "Let u=1+cos x."],
    ["exam-int-025", "\\int_0^1\\log x\\,dx", "-1", ["definite-integral", "improper-integral"], "Integrate x log x - x and take the limit at 0."],
    ["exam-int-026", "\\int_0^\\infty e^{-2x}\\,dx", "1/2", ["definite-integral", "improper-integral"], "The exponential tail gives 1/2."],
    ["exam-int-028", "\\int_0^1 x\\log(1+x^2)\\,dx", "log(2)-1/2", ["definite-integral", "substitution", "log"], "Let u=1+x^2 and integrate log u."],
    ["exam-int-029", "\\int_0^\\pi x\\sin x\\,dx", "pi", ["definite-integral", "integration-by-parts"], "Integration by parts leaves pi."],
    ["exam-int-030", "\\int_0^1(1-x)^5\\,dx", "1/6", ["definite-integral"], "Use u=1-x or the beta integral."]
  ].forEach(([id, prompt, answer, tags, solution]) => numeric(id, "integrals", prompt, answer, tags, solution));

  [
    ["exam-ser-001", "\\text{收斂半徑： }\\sum_{n=1}^{\\infty}\\frac{n x^n}{3^n}", "3", ["power-series", "radius"], "The dominant ratio is |x|/3."],
    ["exam-ser-002", "\\text{收斂半徑： }\\sum_{n=1}^{\\infty}\\frac{n!}{n^n}x^n", "e", ["power-series", "radius", "root-test"], "Use (n!/n^n)^{1/n}->e^{-1}."],
    ["exam-ser-003", "\\text{收斂半徑： }\\sum_{n=1}^{\\infty}\\frac{(x-2)^n}{n}", "1", ["power-series", "radius"], "The coefficient 1/n has nth root 1."],
    ["exam-ser-008", "\\sum_{n=0}^{\\infty}\\frac{1}{(2n+1)!}", "(exp(1)-exp(-1))/2", ["taylor", "sum-series"], "This is sinh 1."],
    ["exam-ser-009", "\\text{求 }e^{2x}\\text{ 的 }x^5\\text{ 係數}", "4/15", ["taylor", "coefficient"], "The coefficient is 2^5/5!."],
    ["exam-ser-010", "\\text{求 }\\sin(x^2)\\text{ 的 }x^6\\text{ 係數}", "-1/6", ["taylor", "coefficient"], "Use sin z=z-z^3/6+... with z=x^2."],
    ["exam-ser-011", "\\text{求 }\\log(1+x)\\text{ 的 }x^4\\text{ 係數}", "-1/4", ["taylor", "coefficient"], "The x^n coefficient is (-1)^{n+1}/n."],
    ["exam-ser-013", "\\sum_{n=1}^{\\infty}\\frac{n(n+1)}{2^n}", "8", ["power-series", "sum-series"], "This is sum n^2/2^n plus sum n/2^n."],
    ["exam-ser-014", "\\text{收斂半徑： }\\sum_{n=1}^{\\infty}\\frac{4^n x^n}{\\sqrt{n+1}}", "1/4", ["power-series", "radius", "root-test"], "The nth root behaves like 4."],
    ["exam-ser-017", "\\sum_{n=0}^{\\infty}\\frac{2^n}{n!}", "exp(2)", ["taylor", "sum-series"], "This is e^2."],
    ["exam-ser-018", "\\text{求 }(1+x)^7\\text{ 的 }x^3\\text{ 係數}", "35", ["binomial", "coefficient"], "Choose 3 factors of x from 7."],
    ["exam-ser-019", "\\text{求 }\\frac{1}{1-2x}\\text{ 的 }x^4\\text{ 係數}", "16", ["geometric-series", "coefficient"], "The coefficient is 2^4."],
    ["exam-ser-020", "\\sum_{n=1}^{\\infty}\\frac{n}{3^n}", "3/4", ["power-series", "sum-series"], "Use r/(1-r)^2 with r=1/3."]
  ].forEach(([id, prompt, answer, tags, solution]) => numeric(id, "series", prompt, answer, tags, solution));

  expression("exam-multi-002", "derivatives", "\\frac{\\partial^2}{\\partial x\\partial y}\\left(x^2y^3+e^{xy}\\right)", "6*x*y^2+(1+x*y)*exp(x*y)", ["x", "y"], ["multivariable", "higher-derivative"], "Differentiate first with respect to y, then x.");
  numeric("exam-multi-003", "derivatives", "\\text{若 }f(x,y)=x^2+y^2,\\ \\text{求 }|\\nabla f(1,2)|^2", "20", ["multivariable", "gradient"], "The gradient is (2,4), whose squared norm is 20.");
  numeric("exam-multi-004", "derivatives", "\\text{求 }f(x,y)=x^3+y^3-3xy\\text{ 在 }(1,1)\\text{ 的 Hessian determinant}", "27", ["multivariable", "hessian"], "The Hessian is [[6,-3],[-3,6]].");
  numeric("exam-multi-005", "derivatives", "\\text{求 }f(x,y)=x^2y\\text{ 在 }(1,2)\\text{ 沿 }(3/5,4/5)\\text{ 的方向導數}", "16/5", ["multivariable", "directional-derivative"], "Dot grad f(1,2)=(4,1) with the unit direction.");
  numeric("exam-multi-006", "integrals", "\\int_0^1\\int_0^x (x+y)\\,dy\\,dx", "1/2", ["multivariable", "double-integral"], "The inner integral gives 3x^2/2.");
  numeric("exam-multi-007", "integrals", "\\text{求 }r=2\\cos\\theta\\text{ 所圍面積}", "pi", ["multivariable", "polar-coordinates"], "Use one-half integral of r^2 from -pi/2 to pi/2.");
  expression("exam-multi-008", "derivatives", "\\text{若 }u=x^2-y^2,\\ v=2xy,\\ \\text{求 }\\frac{\\partial(u,v)}{\\partial(x,y)}", "4*(x^2+y^2)", ["x", "y"], ["multivariable", "jacobian"], "Compute the 2 by 2 determinant.");
  expression("exam-multi-009", "derivatives", "\\nabla\\cdot(x^2y,\\ y^2z,\\ z^2x)", "2*x*y+2*y*z+2*z*x", ["x", "y", "z"], ["multivariable", "nabla", "vector-calculus"], "Divergence is the sum of matching partial derivatives.");
  expression("exam-multi-010", "derivatives", "\\text{求 }\\nabla\\times(y^2,\\ z^2,\\ x^2)\\text{ 的 }z\\text{-component}", "-2*y", ["y"], ["multivariable", "nabla", "vector-calculus"], "The z-component is partial_x F_2 - partial_y F_1.");

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(examProblems);
})();
