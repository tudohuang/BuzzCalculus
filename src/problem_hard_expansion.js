(function () {
  "use strict";

  const SOURCE = "Buzz hard expansion";
  const hardProblems = [];

  function add(problem) {
    hardProblems.push({
      source: SOURCE,
      difficulty: 4,
      rank: 5,
      timeLimit: 120,
      tabLimit: 1,
      hints: ["Identify the structure before calculating."],
      ...problem
    });
  }

  function numeric(id, topic, prompt, answer, tags, solution, rank = 5, timeLimit = 120) {
    add({
      id,
      topic,
      rank,
      prompt,
      answerKind: "numeric",
      answer,
      tags,
      solution,
      timeLimit
    });
  }

  function text(id, topic, prompt, answers, canonical, tags, solution, rank = 5, timeLimit = 80) {
    add({
      id,
      topic,
      rank,
      prompt,
      answerKind: "text",
      answers,
      canonical,
      tags,
      solution,
      timeLimit
    });
  }

  [
    ["rel-hard-lim-001", "\\lim_{x\\to0}\\frac{\\sin x-x+x^3/6-x^5/120}{x^7}", "-1/5040", "Use the x^7 term of sin x."],
    ["rel-hard-lim-002", "\\lim_{x\\to0}\\frac{\\tan x-x-x^3/3-2x^5/15}{x^7}", "17/315", "Use the x^7 term of tan x."],
    ["rel-hard-lim-003", "\\lim_{x\\to0}\\frac{\\log(1+x)-x+x^2/2-x^3/3+x^4/4}{x^5}", "1/5", "Use the x^5 term of log(1+x)."],
    ["rel-hard-lim-004", "\\lim_{x\\to0}\\frac{e^x+e^{-x}-2-x^2-x^4/12}{x^6}", "1/360", "Use the even expansion of e^x+e^{-x}."],
    ["rel-hard-lim-007", "\\lim_{(x,y)\\to(0,0)}\\frac{1-\\cos(xy)}{x^2y^2}", "1/2", "Use 1-cos u ~ u^2/2."],
    ["rel-hard-lim-008", "\\lim_{(x,y)\\to(0,0)}\\frac{e^{x^2+y^2}-1}{x^2+y^2}", "1", "Use e^u-1 ~ u."],
    ["rel-hard-lim-009", "\\lim_{x\\to0}\\frac{\\arctan x-x+x^3/3}{x^5}", "1/5", "Use arctan x=x-x^3/3+x^5/5-..."],
    ["rel-hard-lim-010", "\\lim_{n\\to\\infty}n^2\\left(\\left(1+\\frac1n\\right)^n-e+\\frac{e}{2n}\\right)", "11*e/24", "The second correction term is 11e/(24n^2)."]
  ].forEach(([id, prompt, answer, solution]) => {
    numeric(id, "limits", prompt, answer, ["taylor", "limit-trap", "boss-rank"], solution, 5, 95);
  });

  text("rel-hard-lim-006", "limits", "\\lim_{(x,y)\\to(0,0)}\\frac{x^2y^2}{(x^2+y^2)^2}", ["dne", "does not exist", "no limit"], "DNE", ["path-test", "multivariable", "boss-rank"], "Along y=0 the limit is 0; along y=x it is 1/4.", 5, 80);

  [
    ["rel-hard-ser-001", "\\text{Radius of convergence of }\\sum_{n=0}^{\\infty}\\frac{(2n)!}{(n!)^2}x^n", "1/4", ["power-series", "ratio-test"], "The central binomial coefficient grows like 4^n."],
    ["rel-hard-ser-002", "\\text{Radius of convergence of }\\sum_{n=0}^{\\infty}\\frac{(n!)^2}{(2n)!}x^n", "4", ["power-series", "ratio-test"], "This is the reciprocal central binomial scale."],
    ["rel-hard-ser-004", "\\text{coefficient of }x^{10}\\text{ in }\\sin(x^2)", "1/120", ["taylor", "coefficient"], "Use sin u=u-u^3/6+u^5/120-... with u=x^2."],
    ["rel-hard-ser-005", "\\sum_{n=1}^{\\infty}\\frac{1}{n(n+1)(n+2)(n+3)}", "1/18", ["telescoping", "series-boss"], "Write it as a telescoping difference of triple products."],
    ["rel-hard-ser-008", "\\sum_{n=1}^{\\infty}\\frac{1}{4n^2-1}", "1/2", ["telescoping", "partial-fraction"], "Use 1/(4n^2-1)=1/2(1/(2n-1)-1/(2n+1))."],
    ["rel-hard-ser-012", "\\text{Radius of convergence of }\\sum_{n=1}^{\\infty}\\frac{n^n}{n!}x^n", "1/e", ["power-series", "ratio-test"], "The nth root of n^n/n! tends to e."]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    numeric(id, "series", prompt, answer, [...tags, "boss-rank"], solution, 5, 100);
  });

  text("rel-hard-ser-010", "series", "\\sum_{n=1}^{\\infty}\\frac{n^n}{n!}", ["divergent", "diverges"], "divergent", ["term-test", "series-boss"], "The terms do not tend to 0.", 5);
  text("rel-hard-ser-011", "series", "\\sum_{n=1}^{\\infty}\\frac{(-1)^n}{\\sqrt n}\\text{ at the endpoint}", ["conditional", "conditionally convergent", "conditional convergence"], "conditional", ["endpoint-analysis", "alternating"], "Alternating test gives convergence; p=1/2 gives no absolute convergence.", 5);

  [
    ["rel-hard-int-001", "\\int_0^{\\infty}x^5e^{-2x}\\,dx", "15/8", ["gamma-function", "improper-integral"], "Use Gamma(6)/2^6."],
    ["rel-hard-int-002", "\\int_0^{\\infty}x^{3/2}e^{-4x}\\,dx", "3*sqrt(pi)/128", ["gamma-function", "improper-integral"], "This is Gamma(5/2)/4^{5/2}."],
    ["rel-hard-int-004", "\\int_0^1x^3(\\log x)^2\\,dx", "1/32", ["parameter-integral", "gamma-function"], "Use int_0^1 x^a(log x)^2 dx=2/(a+1)^3."],
    ["rel-hard-int-005", "\\int_0^{\\pi/2}\\sin^8x\\,dx", "35*pi/256", ["wallis", "special-functions"], "Use Wallis reduction."],
    ["rel-hard-int-007", "\\int_0^{\\pi/2}\\sin^4x\\cos^2x\\,dx", "pi/32", ["beta-function", "wallis"], "Convert to one half of a beta integral."],
    ["rel-hard-int-008", "\\int_0^{\\infty}\\frac{e^{-3x}-e^{-11x}}{x}\\,dx", "log(11/3)", ["frullani", "improper-integral"], "Frullani gives log(11/3)."],
    ["rel-hard-int-009", "\\int_0^{\\infty}\\frac{\\cos(4x)-\\cos(10x)}{x}\\,dx", "log(5/2)", ["frullani", "cosine-integral"], "Use the cosine Frullani identity."],
    ["rel-hard-int-011", "\\int_0^{\\infty}\\frac{x}{x^4+1}\\,dx", "pi/4", ["improper-integral", "substitution"], "Let u=x^2."],
    ["rel-hard-int-012", "\\int_0^{\\infty}\\frac{dx}{x^4+1}", "pi/(2*sqrt(2))", ["improper-integral", "residue"], "The standard quartic integral equals pi/(2sqrt2)."],
    ["rel-hard-int-015", "\\int_0^1x^{-1/2}\\log x\\,dx", "-4", ["parameter-integral", "improper-integral"], "Use int_0^1 x^{a-1} log x dx=-1/a^2."],
    ["rel-hard-int-017", "\\int_0^{\\pi/2}(\\log(\\sin x)+\\log(\\cos x))\\,dx", "-pi*log(2)", ["kings-property", "improper-integral"], "Both log sine and log cosine integrals equal -pi log2 /2."],
    ["rel-hard-int-018", "\\int_0^{\\infty}\\frac{dx}{(x^2+4)^2}", "pi/32", ["improper-integral", "trig-substitution"], "Use int_0^infty dx/(x^2+a^2)^2=pi/(4a^3)."]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    numeric(id, "integrals", prompt, answer, [...tags, "boss-rank"], solution, 5, 125);
  });

  [
    ["rel-hard-cpx-001", "\\operatorname{Res}_{z=0}\\frac{\\sin z}{z^4}", "-1/6", "Use the z^3 coefficient of sin z."],
    ["rel-hard-cpx-002", "\\operatorname{Res}_{z=0}\\frac{\\cos z}{z^3}", "-1/2", "Use the z^2 coefficient of cos z."],
    ["rel-hard-cpx-003", "\\operatorname{Res}_{z=0}\\frac{e^z-1-z}{z^4}", "1/6", "Use the z^3 coefficient of e^z-1-z."],
    ["rel-hard-cpx-004", "\\operatorname{Res}_{z=0}\\frac{\\log(1+z)}{z^3}", "-1/2", "Use the z^2 coefficient of log(1+z)."],
    ["rel-hard-cpx-005", "\\operatorname{Res}_{z=0}\\frac{1}{z^2(1-z)}", "1", "Expand 1/(1-z)."],
    ["rel-hard-cpx-006", "\\operatorname{Res}_{z=1}\\frac{e^z}{(z-1)^2}", "e", "For a second-order pole, take the derivative of e^z."],
    ["rel-hard-cpx-007", "\\operatorname{Res}_{z=0}\\frac{z}{\\sin^2z}", "1", "Use csc^2 z=1/z^2+..."],
    ["rel-hard-cpx-008", "\\operatorname{Res}_{z=0}\\cot z", "1", "cot z has residue 1 at 0."],
    ["rel-hard-cpx-009", "\\operatorname{Res}_{z=0}\\frac{e^{2z}-1}{z^3}", "2", "Use the z^2 coefficient of e^{2z}-1."],
    ["rel-hard-cpx-010", "\\operatorname{Res}_{z=0}\\frac{1-\\cos z-z^2/2}{z^5}", "-1/24", "Use the z^4 coefficient of 1-cos z-z^2/2."]
  ].forEach(([id, prompt, answer, solution]) => {
    numeric(id, "integrals", prompt, answer, ["complex", "residue", "boss-plus"], solution, 6, 115);
  });

  [
    ["rel-hard-mv-001", "integrals", "\\iint_{x,y\\ge0,\\ x+y\\le1}x^2y\\,dA", "1/60", ["double-integral", "simplex"], "Use the two-dimensional simplex formula.", 5],
    ["rel-hard-mv-002", "integrals", "\\iint_{x^2+y^2\\le1}x^2y^2\\,dA", "pi/24", ["double-integral", "polar"], "Use polar coordinates and integrate cos^2 theta sin^2 theta."],
    ["rel-hard-mv-003", "integrals", "\\iiint_{x^2+y^2+z^2\\le1}(x^2+y^2+z^2)\\,dV", "4*pi/5", ["triple-integral", "spherical"], "Use spherical coordinates."],
    ["rel-hard-mv-004", "integrals", "\\iiint_{x^2+y^2+z^2\\le9}1\\,dV", "36*pi", ["triple-integral", "spherical"], "Volume of a ball of radius 3."],
    ["rel-hard-mv-005", "derivatives", "\\frac{\\partial(u,v)}{\\partial(x,y)}\\text{ at }(2,1),\\quad u=\\frac{x}{y},\\ v=xy", "4", ["jacobian", "multivariable"], "Compute the determinant of [[1/y,-x/y^2],[y,x]]."],
    ["rel-hard-mv-006", "derivatives", "\\max xyz\\quad\\text{subject to }x+y+z=1,\\ x,y,z>0", "1/27", ["lagrange-multiplier", "optimization"], "The symmetric maximum occurs at x=y=z=1/3."],
    ["rel-hard-mv-007", "derivatives", "\\min(x^2+y^2)\\quad\\text{subject to }xy=1,\\ x,y>0", "2", ["lagrange-multiplier", "optimization"], "The minimum occurs at x=y=1."],
    ["rel-hard-mv-008", "integrals", "\\iint_R(x+y)\\,dA,\\quad 0\\le x+y\\le1,\\ 0\\le x-y\\le2", "1/2", ["change-of-variables", "jacobian"], "Use u=x+y, v=x-y, with Jacobian 1/2.", 6],
    ["rel-hard-mv-009", "integrals", "\\iint_{x^2+y^2\\le4}(x^2+y^2)^2\\,dA", "64*pi/3", ["double-integral", "polar"], "Use polar coordinates and integrate r^5."],
    ["rel-hard-mv-010", "integrals", "\\iiint_{x,y,z\\ge0,\\ x+y+z\\le1}x^2yz\\,dV", "1/2520", ["triple-integral", "simplex"], "Use the three-dimensional simplex beta formula.", 6]
  ].forEach(([id, topic, prompt, answer, tags, solution, rank = 5]) => {
    numeric(id, topic, prompt, answer, [...tags, "boss-rank"], solution, rank, 120);
  });

  [
    ["rel-hard-der-001", "W(e^x,xe^x)\\text{ at }x=0", "1", ["wronskian"], "The Wronskian is e^{2x}."],
    ["rel-hard-der-002", "W(\\sin x,\\cos x)\\text{ at }x=0", "-1", ["wronskian"], "Compute f g'-f'g."],
    ["rel-hard-der-003", "\\det H_f(1,0),\\quad f=\\log(x^2+y^2)", "-4", ["hessian"], "At (1,0), the Hessian is diag(-2,2)."],
    ["rel-hard-der-004", "\\kappa\\text{ for }y=\\log x\\text{ at }x=1", "1/(2*sqrt(2))", ["curvature"], "Use |y''|/(1+(y')^2)^{3/2}."],
    ["rel-hard-der-005", "\\frac{dy}{dx}\\text{ at }t=2,\\quad x=t+\\frac1t,\\ y=t-\\frac1t", "5/3", ["parametric-differentiation"], "Use (dy/dt)/(dx/dt)."],
    ["rel-hard-der-006", "\\frac{d^2y}{dx^2}\\text{ at }t=2,\\quad x=t^2,\\ y=t^3", "3/8", ["parametric-differentiation"], "Differentiate dy/dx with respect to t, then divide by dx/dt."],
    ["rel-hard-der-007", "D_{(1,2,2)/3}(xyz)\\text{ at }(1,1,1)", "5/3", ["directional-derivative", "nabla"], "The gradient is (1,1,1)."],
    ["rel-hard-der-008", "\\nabla\\cdot\\langle xy,yz,zx\\rangle\\text{ at }(1,2,3)", "6", ["nabla", "vector-calculus"], "The divergence is y+z+x."],
    ["rel-hard-der-009", "\\text{z-component of }\\nabla\\times\\left\\langle\\frac{-y}{x^2+y^2},\\frac{x}{x^2+y^2},0\\right\\rangle\\text{ at }(1,0,0)", "0", ["nabla", "vector-calculus"], "Away from the origin, this field has zero curl."],
    ["rel-hard-der-010", "\\Delta e^{x+y}\\text{ at }(0,0)", "2", ["nabla", "laplacian"], "f_xx+f_yy=2e^{x+y}."]
  ].forEach(([id, prompt, answer, tags, solution]) => {
    numeric(id, "derivatives", prompt, answer, [...tags, "boss-rank"], solution, 5, 95);
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(hardProblems);
})();
