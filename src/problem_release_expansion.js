(function () {
  "use strict";

  const SOURCE = "Buzz release expansion";
  const releaseProblems = [];

  function add(problem) {
    releaseProblems.push({
      source: SOURCE,
      timeLimit: 60,
      tabLimit: 1,
      hints: [],
      ...problem
    });
  }

  function numeric(id, topic, difficulty, prompt, answer, tags, solution, hints = [], timeLimit = 60, rank) {
    add({
      id,
      topic,
      difficulty,
      ...(rank ? { rank } : {}),
      prompt,
      answerKind: "numeric",
      answer,
      tags,
      solution,
      hints,
      timeLimit
    });
  }

  function antiderivative(id, difficulty, prompt, answer, tags, solution, hints = [], timeLimit = 80, rank) {
    add({
      id,
      topic: "integrals",
      difficulty,
      ...(rank ? { rank } : {}),
      prompt,
      answerKind: "antiderivative",
      answer,
      tags,
      solution,
      hints,
      timeLimit
    });
  }

  function text(id, topic, difficulty, prompt, answers, canonical, tags, solution, hints = [], timeLimit = 50, rank) {
    add({
      id,
      topic,
      difficulty,
      ...(rank ? { rank } : {}),
      prompt,
      answerKind: "text",
      answers,
      canonical,
      tags,
      solution,
      hints,
      timeLimit
    });
  }

  [
    ["rel-basic-001", "limits", "\\lim_{x\\to0}\\frac{\\sin(5x)}{x}", "5", ["standard-limit", "beginner-foundation"], "sin(5x)/(5x) tends to 1."],
    ["rel-basic-002", "limits", "\\lim_{x\\to0}\\frac{1-\\cos(3x)}{x^2}", "9/2", ["standard-limit", "beginner-foundation"], "Use 1-cos u ~ u^2/2 with u=3x."],
    ["rel-basic-003", "limits", "\\lim_{x\\to0}\\frac{e^{4x}-1}{x}", "4", ["standard-limit", "beginner-foundation"], "Use e^u-1 ~ u."],
    ["rel-basic-004", "limits", "\\lim_{x\\to0}\\frac{\\log(1+2x)}{x}", "2", ["standard-limit", "beginner-foundation"], "Use log(1+u) ~ u."],
    ["rel-basic-005", "limits", "\\lim_{x\\to0}\\frac{\\sqrt{1+x}-1}{x}", "1/2", ["rationalize", "beginner-foundation"], "Rationalize the numerator."],
    ["rel-basic-006", "limits", "\\lim_{x\\to2}\\frac{x^2-4}{x-2}", "4", ["factorization", "beginner-foundation"], "Factor x^2-4=(x-2)(x+2)."],
    ["rel-basic-007", "derivatives", "\\left.\\frac{d}{dx}x^3\\right|_{x=2}", "12", ["basic-derivative", "beginner-foundation"], "The derivative is 3x^2."],
    ["rel-basic-008", "derivatives", "\\left.\\frac{d}{dx}\\sin x\\right|_{x=0}", "1", ["basic-derivative", "beginner-foundation"], "The derivative is cos x."],
    ["rel-basic-009", "derivatives", "\\left.\\frac{d}{dx}e^{2x}\\right|_{x=0}", "2", ["chain-rule", "beginner-foundation"], "The derivative is 2e^{2x}."],
    ["rel-basic-010", "derivatives", "\\left.\\frac{d}{dx}\\sqrt{x}\\right|_{x=4}", "1/4", ["basic-derivative", "beginner-foundation"], "The derivative is 1/(2sqrt x)."],
    ["rel-basic-011", "derivatives", "\\left.\\frac{d}{dx}\\log x\\right|_{x=e}", "1/e", ["basic-derivative", "beginner-foundation"], "The derivative is 1/x."],
    ["rel-basic-012", "derivatives", "\\left.\\frac{d}{dx}(x\\log x)\\right|_{x=1}", "1", ["product-rule", "beginner-foundation"], "The derivative is log x+1."],
    ["rel-basic-013", "integrals", "\\int_0^1 x^2\\,dx", "1/3", ["basic-integral", "beginner-foundation"], "Use the power rule."],
    ["rel-basic-014", "integrals", "\\int_0^{\\pi}\\sin x\\,dx", "2", ["basic-integral", "beginner-foundation"], "The antiderivative is -cos x."],
    ["rel-basic-015", "integrals", "\\int_0^1 e^{2x}\\,dx", "(e^2-1)/2", ["basic-integral", "beginner-foundation"], "Divide by the inner coefficient 2."],
    ["rel-basic-016", "integrals", "\\int_0^1\\frac{1}{1+x}\\,dx", "log(2)", ["basic-integral", "log"], "The antiderivative is log(1+x)."],
    ["rel-basic-017", "integrals", "\\int_0^{\\pi/2}\\cos x\\,dx", "1", ["basic-integral", "beginner-foundation"], "The antiderivative is sin x."],
    ["rel-basic-018", "integrals", "\\int_0^2 3x\\,dx", "6", ["basic-integral", "beginner-foundation"], "The antiderivative is 3x^2/2."],
    ["rel-basic-019", "series", "\\sum_{n=0}^{\\infty}\\left(\\frac12\\right)^n", "2", ["geometric-series", "beginner-foundation"], "Use 1/(1-r)."],
    ["rel-basic-022", "series", "\\text{Radius of convergence of }\\sum_{n=0}^{\\infty}3^n x^n", "1/3", ["power-series", "beginner-foundation"], "This is geometric with ratio 3x."],
    ["rel-basic-024", "series", "\\sum_{n=1}^{\\infty}\\left(\\frac13\\right)^n", "1/2", ["geometric-series", "beginner-foundation"], "Use r/(1-r)."]
  ].forEach(([id, topic, prompt, answer, tags, solution]) => {
    numeric(id, topic, 1, prompt, answer, tags, solution, ["Keep the standard formula visible."], 45);
  });

  text("rel-basic-020", "series", 1, "\\sum_{n=1}^{\\infty}\\frac1{n^2}", ["convergent", "converges"], "convergent", ["p-series", "beginner-foundation"], "This is a p-series with p=2>1.", ["Use the p-series test."], 40);
  text("rel-basic-021", "series", 1, "\\sum_{n=1}^{\\infty}\\frac1n", ["divergent", "diverges"], "divergent", ["p-series", "beginner-foundation"], "This is the harmonic series.", ["Use the p-series test with p=1."], 40);
  text("rel-basic-023", "series", 2, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n}", ["conditional", "conditionally convergent", "conditional convergence"], "conditional", ["alternating", "series-test"], "The alternating harmonic series converges conditionally.", ["Check absolute convergence separately."], 50);

  [
    ["rel-adv-001", "limits", "\\lim_{x\\to0}\\frac{\\sin x-x+x^3/6}{x^5}", "1/120", ["taylor", "limit-trap"], "sin x=x-x^3/6+x^5/120+..."],
    ["rel-adv-002", "limits", "\\lim_{x\\to0}\\frac{e^x-1-x-x^2/2-x^3/6}{x^4}", "1/24", ["taylor", "limit-trap"], "The next Taylor coefficient is 1/24."],
    ["rel-adv-003", "limits", "\\lim_{x\\to0}\\frac{\\log(1+x)-x+x^2/2-x^3/3}{x^4}", "-1/4", ["taylor", "limit-trap"], "The x^4 coefficient in log(1+x) is -1/4."],
    ["rel-adv-004", "limits", "\\lim_{x\\to0}\\frac{\\tan x-x-x^3/3}{x^5}", "2/15", ["taylor", "limit-trap"], "tan x=x+x^3/3+2x^5/15+..."],
    ["rel-adv-005", "derivatives", "\\frac{\\partial(u,v)}{\\partial(x,y)}\\text{ at }(1,2),\\quad u=x^2-y^2,\\ v=2xy", "20", ["jacobian", "multivariable"], "The determinant is 4(x^2+y^2)."],
    ["rel-adv-006", "derivatives", "D_{(2,-1,2)/3}(x^2y+yz)\\text{ at }(1,2,3)", "8/3", ["directional-derivative", "multivariable"], "Dot the gradient (4,4,2) with (2,-1,2)/3."],
    ["rel-adv-007", "derivatives", "\\det H_f(1,1),\\quad f=x^4+y^4-4xy", "128", ["hessian", "optimization"], "The Hessian is [[12,-4],[-4,12]]."],
    ["rel-adv-008", "derivatives", "\\min(x^2+y^2+z^2)\\quad\\text{subject to }x+2y+2z=9", "9", ["lagrange-multiplier", "optimization"], "The minimum distance squared to the plane is 9."],
    ["rel-adv-011", "integrals", "\\int_0^{\\infty}xe^{-3x}\\,dx", "1/9", ["improper-integral", "gamma-function"], "Use Gamma(2)/3^2."],
    ["rel-adv-012", "integrals", "\\int_0^1\\int_0^x(x+y)\\,dy\\,dx", "1/2", ["double-integral", "iterated-integral"], "The inner integral gives 3x^2/2."],
    ["rel-adv-013", "integrals", "\\iint_{x^2+y^2\\le1}(x^2+y^2)\\,dA", "pi/2", ["double-integral", "polar"], "Use polar coordinates and integrate r^3."],
    ["rel-adv-014", "integrals", "\\int_0^1\\int_0^1(x+y)^2\\,dy\\,dx", "5/6", ["double-integral", "iterated-integral"], "Expand and integrate term by term."],
    ["rel-adv-017", "series", "\\text{coefficient of }x^6\\text{ in }e^{x^2}", "1/6", ["taylor", "power-series"], "Use e^{x^2}=sum x^{2k}/k!."],
    ["rel-adv-019", "series", "\\text{Radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{x^n}{n^2}", "1", ["power-series", "radius-of-convergence"], "Polynomial factors do not change the radius from 1."]
  ].forEach(([id, topic, prompt, answer, tags, solution]) => {
    numeric(id, topic, 3, prompt, answer, tags, solution, ["Identify the dominant technique before calculating."], 75);
  });

  antiderivative("rel-adv-009", 3, "\\int x^3e^{x^2}\\,dx", "exp(x^2)*(x^2-1)/2", ["substitution", "u-sub"], "Let u=x^2. Then x^3 dx=(u/2)du.", ["After substitution integrate u e^u."], 80);
  antiderivative("rel-adv-010", 3, "\\int x\\log(1+x^2)\\,dx", "(1+x^2)*log(1+x^2)/2-(1+x^2)/2", ["substitution", "log"], "Let u=1+x^2 and integrate log u.", ["Use u=1+x^2."], 80);
  text("rel-adv-015", "series", 3, "\\sum_{n=1}^{\\infty}\\left(\\frac{n}{3n+1}\\right)^n", ["convergent", "converges"], "convergent", ["root-test", "series-test"], "The root limit is 1/3<1.", ["Use the root test."], 55);
  text("rel-adv-016", "series", 3, "\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{\\sqrt n}", ["conditional", "conditionally convergent", "conditional convergence"], "conditional", ["alternating", "series-test"], "It converges by alternating test but not absolutely.", ["Compare absolute values to p=1/2."], 55);
  text("rel-adv-018", "series", 3, "\\sum_{n=1}^{\\infty}\\frac{3n^2+1}{n^3+n}", ["divergent", "diverges"], "divergent", ["limit-comparison", "series-test"], "The terms behave like 3/n.", ["Use limit comparison with 1/n."], 55);
  text("rel-adv-020", "series", 3, "\\sum_{n=1}^{\\infty}\\frac{x^n}{n}\\text{ at }x=-1", ["conditional", "conditionally convergent", "conditional convergence"], "conditional", ["endpoint-analysis", "power-series"], "At x=-1 this is the alternating harmonic series.", ["Endpoint analysis is required."], 55);

  [
    ["rel-boss-001", "integrals", "\\int_0^{\\infty}\\frac{\\sin(3x)}{x}\\,dx", "pi/2", ["improper-integral", "dirichlet-integral"], "Dirichlet integral gives pi/2 for positive frequency.", 5],
    ["rel-boss-002", "integrals", "\\int_0^{\\infty}\\frac{e^{-2x}-e^{-5x}}{x}\\,dx", "log(5/2)", ["frullani", "improper-integral"], "Frullani gives log(5/2).", 5],
    ["rel-boss-003", "integrals", "\\int_0^{\\infty}\\frac{\\cos(2x)-\\cos(7x)}{x}\\,dx", "log(7/2)", ["frullani", "cosine-integral", "improper-integral"], "Use the cosine Frullani identity.", 5],
    ["rel-boss-004", "integrals", "\\int_0^{\\infty}x^{5/2}e^{-x}\\,dx", "15*sqrt(pi)/8", ["gamma-function", "special-functions"], "This is Gamma(7/2).", 5],
    ["rel-boss-005", "integrals", "\\int_0^1x^{-1/2}(1-x)^{3/2}\\,dx", "3*pi/8", ["beta-function", "special-functions"], "This is B(1/2,5/2).", 5],
    ["rel-boss-006", "integrals", "\\int_0^{\\pi/2}\\sin^6x\\cos^4x\\,dx", "3*pi/512", ["wallis", "beta-function", "special-functions"], "Convert to a beta integral.", 5],
    ["rel-boss-007", "derivatives", "\\text{coefficient of }x^4\\text{ in }J_0(x)", "1/64", ["bessel", "special-functions"], "J0(x)=1-x^2/4+x^4/64+...", 6],
    ["rel-boss-008", "integrals", "\\operatorname{Res}_{z=0}\\frac{\\sin z}{z^5}", "0", ["complex", "residue"], "There is no z^{-1} term.", 6],
    ["rel-boss-009", "integrals", "\\operatorname{Res}_{z=0}\\frac{e^z}{z^4}", "1/6", ["complex", "residue"], "The residue is the z^3 coefficient of e^z.", 6],
    ["rel-boss-010", "integrals", "\\iint_T\\frac{xy}{x+y}\\,dA,\\quad T=\\{x,y>0,\\ x+y<1\\}", "1/18", ["change-of-variables", "jacobian"], "Use u=x+y and v=x/(x+y).", 6],
    ["rel-boss-011", "integrals", "\\iiint_{x,y,z\\ge0,\\ x+y+z\\le1}xyz\\,dV", "1/720", ["triple-integral", "simplex"], "Use the simplex beta integral.", 6],
    ["rel-boss-012", "integrals", "\\iiint_{x^2+y^2+z^2\\le4}(x^2+y^2+z^2)\\,dV", "128*pi/5", ["triple-integral", "spherical"], "Use spherical coordinates: integrate 4pi r^4.", 6],
    ["rel-boss-013", "series", "\\sum_{n=1}^{\\infty}\\frac{1}{n(n+1)(n+2)}", "1/4", ["telescoping", "series-boss"], "Partial fractions telescope.", 5],
    ["rel-boss-014", "integrals", "\\int_0^{\\infty}\\frac{x}{e^x-1}\\,dx", "pi^2/6", ["gamma-function", "special-functions", "improper-integral"], "This is Gamma(2) zeta(2).", 6],
    ["rel-boss-015", "integrals", "\\int_0^{\\infty}\\frac{x^3}{e^x-1}\\,dx", "pi^4/15", ["gamma-function", "special-functions", "improper-integral"], "This is Gamma(4) zeta(4).", 6],
    ["rel-boss-016", "integrals", "\\int_0^{\\pi/2}\\log(\\sin x)\\,dx", "-pi*log(2)/2", ["improper-integral", "kings-property"], "Use the classic symmetry product integral.", 5],
    ["rel-boss-017", "integrals", "\\int_0^1(\\log x)^2\\,dx", "2", ["improper-integral", "gamma-function"], "Differentiate the beta/gamma integral or use Gamma(3).", 5],
    ["rel-boss-018", "series", "\\text{Radius of convergence of }\\sum_{n=1}^{\\infty}n!x^n", "0", ["ratio-test", "power-series", "series-boss"], "The ratio grows without bound unless x=0.", 5],
    ["rel-boss-019", "limits", "\\lim_{n\\to\\infty}n\\left(\\log(n+1)-\\log n\\right)", "1", ["asymptotic", "limit-trap"], "Rewrite as n log(1+1/n).", 5],
    ["rel-boss-020", "integrals", "\\operatorname{Res}_{z=0}\\frac{1-\\cos z}{z^3}", "1/2", ["complex", "residue"], "The z^2/2 term in 1-cos z creates the residue.", 6]
  ].forEach(([id, topic, prompt, answer, tags, solution, rank]) => {
    numeric(id, topic, 4, prompt, answer, tags, solution, ["This is intended as a Boss/Boss+ item."], 110, rank);
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(releaseProblems);
})();
