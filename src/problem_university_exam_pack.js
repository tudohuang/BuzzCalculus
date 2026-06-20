(function () {
  "use strict";

  const SOURCE = "Original university transfer/exemption/midterm style pack 2026";
  const problems = [];
  const HINTS = [
    "先判型：這題刻意混合轉學考、免修考、段考常見技巧。",
    "答案請用 WebWork 寫法，例如 log(x), exp(x), sqrt(x), pi。"
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
    ["uni-lim-002", "\\lim_{x\\to0}\\frac{\\log(1+x)-x+\\frac{x^2}{2}-\\frac{x^3}{3}}{x^4}", "-1/4", ["taylor", "log"], "Use the fourth term of log(1+x)."],
    ["uni-lim-003", "\\lim_{x\\to0}\\frac{e^{x^2}-\\cos x}{x^2}", "3/2", ["taylor", "exponential", "trig-limit"], "Compare the x^2 coefficients."],
    ["uni-lim-005", "\\lim_{x\\to0}\\frac{\\sqrt{1+x}-\\sqrt{1-x}-x}{x^3}", "1/8", ["taylor", "radical"], "Odd terms remain after subtracting the two radicals."],
    ["uni-lim-006", "\\lim_{x\\to\\infty}x\\left((x+1)\\log\\left(1+\\frac{1}{x}\\right)-1\\right)", "1/2", ["log-limit", "infinity-limit"], "Put y=1/x and expand (1/y+1)log(1+y)."],
    ["uni-lim-007", "\\lim_{x\\to0}\\frac{\\sin(2x)-2\\sin x}{x^3}", "-1", ["taylor", "trig-limit"], "The cubic term is the first nonzero term."],
    ["uni-lim-008", "\\lim_{x\\to0}\\frac{(1+3x)^{1/x}-e^3}{x}", "-9*exp(3)/2", ["log-limit", "exponential-limit"], "Expand x^{-1}log(1+3x) through the linear term."],
    ["uni-lim-009", "\\lim_{x\\to0}\\frac{\\cosh x-\\cos x}{x^2}", "1", ["taylor", "hyperbolic"], "cosh x and cos x have opposite x^2 coefficients."],
    ["uni-lim-010", "\\lim_{x\\to0}\\frac{\\arctan x-\\arcsin x}{x^3}", "-1/2", ["taylor", "inverse-trig"], "Compare arctan x and arcsin x cubic terms."],
    ["uni-lim-011", "\\lim_{x\\to0}\\frac{\\log(1+\\sin x)-x}{x^2}", "-1/2", ["taylor", "log", "trig-limit"], "Only the quadratic term is needed."],
    ["uni-lim-012", "\\lim_{x\\to0}\\frac{e^x-1-x}{1-\\cos x}", "1", ["taylor", "exponential-limit", "trig-limit"], "Both numerator and denominator start at x^2/2."],
    ["uni-lim-014", "\\lim_{x\\to0}\\frac{\\frac{1}{\\sqrt{1+x^2}}-\\cos x}{x^4}", "1/3", ["taylor", "radical", "trig-limit"], "Compare fourth-order coefficients."],
  ].forEach(([id, prompt, answer, tags, solution]) => numeric(id, "limits", prompt, answer, tags, solution));

  [
    ["uni-der-001", "\\frac{d}{dx}\\left(x^{\\cos x}\\right)", "x^cos(x)*(-sin(x)*log(x)+cos(x)/x)", "x", ["log-differentiation", "trig"], "Use log differentiation."],
    ["uni-der-002", "\\frac{d}{dx}\\left((\\sin x)^x\\right)", "sin(x)^x*(log(sin(x))+x*cot(x))", "x", ["log-differentiation", "trig"], "Differentiate x log(sin x)."],
    ["uni-der-003", "\\left.\\frac{d^3}{dx^3}\\left(e^{2x}\\sin x\\right)\\right|_{x=0}", "11", ["higher-derivative", "exponential", "trig"], "Use the imaginary part of (2+i)^3."],
    ["uni-der-004", "\\left.\\frac{d^4}{dx^4}\\left(x^2e^x\\right)\\right|_{x=0}", "12", ["higher-derivative", "taylor"], "Read the x^4 coefficient of x^2 e^x."],
    ["uni-der-005", "\\frac{d^2}{dx^2}\\log\\left(x+\\sqrt{1+x^2}\\right)", "-x/(1+x^2)^(3/2)", "x", ["higher-derivative", "log", "radical"], "First derivative is 1/sqrt(1+x^2)."],
    ["uni-der-006", "\\frac{d}{dx}\\left(\\int_0^{\\sin x} e^{t^2}\\,dt\\right)", "cos(x)*exp(sin(x)^2)", "x", ["fundamental-theorem", "chain-rule"], "FTC plus chain rule."],
    ["uni-der-007", "\\frac{d}{dx}\\left(\\int_x^{2x}\\log(1+t^2)\\,dt\\right)", "2*log(1+4*x^2)-log(1+x^2)", "x", ["fundamental-theorem", "chain-rule"], "Differentiate both moving endpoints."],
    ["uni-der-008", "\\frac{d}{dx}\\arctan\\left(\\frac{2x}{1-x^2}\\right)", "2/(1+x^2)", "x", ["inverse-trig", "chain-rule"], "Simplify after applying 1+u^2."],
    ["uni-der-009", "x=t+\\frac{1}{t},\\ y=t-\\frac{1}{t}.\\ \\text{求 }\\left.\\frac{dy}{dx}\\right|_{t=2}", "5/3", ["parametric"], "dy/dx=(1+1/t^2)/(1-1/t^2)."],
    ["uni-der-010", "r=1+\\cos\\theta.\\ \\text{求切線斜率於 }\\theta=\\frac{\\pi}{2}", "1", ["polar-curve", "parametric"], "Use x=r cos theta, y=r sin theta."],
    ["uni-der-011", "x^2+xy+y^2=3.\\ \\text{求 }\\frac{dy}{dx}\\text{ 於 }(1,1)", "-1", ["implicit-differentiation"], "Differentiate implicitly."],
    ["uni-der-012", "\\text{求 }f(x,y)=x^4+y^4-4xy\\text{ 在 }(1,1)\\text{ 的 Hessian determinant}", "128", ["multivariable", "hessian"], "The Hessian is [[12,-4],[-4,12]]."],
    ["uni-der-013", "\\text{在 }x^2+4y^2=8\\text{ 上求 }xy\\text{ 的最大值}", "2", ["lagrange-multiplier"], "The positive critical point is (2,1)."],
    ["uni-der-014", "\\text{求 }f(x,y)=e^{xy}\\text{ 在 }(0,2)\\text{ 沿 }(3/5,4/5)\\text{ 的方向導數}", "6/5", ["multivariable", "directional-derivative"], "grad f(0,2)=(2,0)."],
    ["uni-der-015", "\\nabla\\cdot(xe^y,\\ ye^z,\\ ze^x)", "exp(y)+exp(z)+exp(x)", ["x", "y", "z"], ["multivariable", "nabla", "vector-calculus"], "Add the matching partial derivatives."],
    ["uni-der-016", "\\text{求 }\\nabla\\times(xy,\\ yz,\\ zx)\\text{ 的 }z\\text{-component}", "-x", ["x"], ["multivariable", "nabla", "vector-calculus"], "The z-component is partial_x F_2 - partial_y F_1."],
    ["uni-der-017", "\\frac{d}{dx}\\log(\\log(\\log x))", "1/(x*log(x)*log(log(x)))", "x", ["chain-rule", "log"], "Three nested logs give three denominator factors."],
    ["uni-der-018", "\\frac{d}{dx}\\exp\\left((\\log x)^3\\right)", "3*log(x)^2*exp(log(x)^3)/x", "x", ["chain-rule", "log", "exponential"], "Differentiate the exponent."],
    ["uni-der-019", "\\left.\\frac{d^5}{dx^5}\\sin(2x)\\right|_{x=0}", "32", ["higher-derivative", "trig"], "The fifth derivative returns a positive sine coefficient 2^5."],
    ["uni-der-020", "\\frac{d}{dx}\\left((1+x^2)^x\\right)", "(1+x^2)^x*(log(1+x^2)+2*x^2/(1+x^2))", "x", ["log-differentiation"], "Use log differentiation."]
  ].forEach(([id, prompt, answer, variable, tags, solution]) => {
    if (variable === "x" || (Array.isArray(variable) && Array.isArray(tags))) expression(id, "derivatives", prompt, answer, variable, tags, solution);
    else numeric(id, "derivatives", prompt, answer, variable, tags);
  });

  [
    ["uni-int-003", "\\int \\frac{\\log x}{x^2}\\,dx", "-(log(x)+1)/x", ["integration-by-parts", "log"], "Integrate by parts with dv=x^{-2}dx."],
    ["uni-int-004", "\\int \\frac{\\arctan x}{x^2}\\,dx", "-atan(x)/x+log(x)-log(1+x^2)/2", ["integration-by-parts", "inverse-trig"], "After parts, decompose 1/(x(1+x^2))."],
    ["uni-int-005", "\\int x\\sqrt{1+x^2}\\,dx", "(1+x^2)^(3/2)/3", ["substitution", "radical"], "Let u=1+x^2."],
    ["uni-int-006", "\\int \\sin^5x\\cos x\\,dx", "sin(x)^6/6", ["substitution", "trig-integral"], "Let u=sin x."],
    ["uni-int-007", "\\int \\sec^4x\\,dx", "tan(x)+tan(x)^3/3", ["trig-integral"], "Write sec^4 x=(1+tan^2 x)sec^2 x."],
    ["uni-int-008", "\\int \\frac{1}{x^2+2x+5}\\,dx", "atan((x+1)/2)/2", ["inverse-trig", "rational"], "Complete the square."],
    ["uni-int-009", "\\int \\frac{2x+1}{x^2+x+1}\\,dx", "log(x^2+x+1)", ["substitution", "rational"], "The numerator is the derivative of the denominator."],
    ["uni-int-010", "\\int e^x\\cos x\\,dx", "exp(x)*(sin(x)+cos(x))/2", ["integration-by-parts", "exponential", "trig"], "Use the standard exponential-trig integral."],
    ["uni-int-011", "\\int x^2\\log x\\,dx", "x^3*log(x)/3-x^3/9", ["integration-by-parts", "log"], "Let u=log x."],
    ["uni-int-012", "\\int x\\arctan x\\,dx", "(x^2+1)*atan(x)/2-x/2", ["integration-by-parts", "inverse-trig"], "Integrate by parts and rewrite x^2/(1+x^2)."]
  ].forEach(([id, prompt, answer, tags, solution]) => antiderivative(id, prompt, answer, tags, solution));

  [
    ["uni-int-013", "\\int_0^1\\frac{x^3}{1+x^2}\\,dx", "1/2-log(2)/2", ["definite-integral", "algebra"], "Rewrite as x - x/(1+x^2)."],
    ["uni-int-014", "\\int_0^\\infty\\frac{1}{(1+x^2)^2}\\,dx", "pi/4", ["improper-integral", "inverse-trig"], "Use x=tan theta or the standard Wallis value."],
    ["uni-int-015", "\\int_0^1 x\\log(1+x)\\,dx", "1/4", ["definite-integral", "integration-by-parts"], "Integrate by parts; the remaining rational integral cancels log terms."],
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
    ["uni-ser-006", "\\text{求 }x^5\\text{ 在 }x^2\\log(1+x)\\text{ 的係數}", "1/3", ["taylor", "coefficient"], "This is the x^3 coefficient of log(1+x)."],
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

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
