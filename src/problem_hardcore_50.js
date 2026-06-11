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
      "\\int x\\left(\\log(1+x^2)\\right)^2\\,dx",
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
      "hc-ibp-001",
      "\\int x^3e^{2x}\\,dx",
      "exp(2*x)*(4*x^3-6*x^2+6*x-3)/8",
      ["integration-by-parts", "ibp", "exponential"],
      "Repeated integration by parts lowers the cubic one degree at a time."
    ],
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
      "hc-ibp-004",
      "\\int (\\log x)^3\\,dx",
      "x*(log(x)^3-3*log(x)^2+6*log(x)-6)",
      ["integration-by-parts", "ibp", "log"],
      "Each integration by parts lowers the power of log x."
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
      "\\int x^3\\log x\\,dx",
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
      "\\int_0^1 x^4\\log(1+x)\\,dx",
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
      "\\int_0^{\\pi/2}\\frac{dx}{1+\sin x}",
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
      "hc-rad-009",
      "\\int_0^{\\infty}\\frac{x^2}{1+x^6}\\,dx",
      "pi/6",
      ["improper-integral", "rational", "special-functions"],
      "Use int_0^infty x^{m-1}/(1+x^n) dx=pi/n*csc(m*pi/n)."
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
      "hc-der-001",
      "\\frac{d}{dx}\\left(x^{\\sin x}\\right)",
      "x^sin(x)*(cos(x)*log(x)+sin(x)/x)",
      ["log-differentiation", "chain-rule"],
      "Use log differentiation: log y=sin x log x."
    ],
    [
      "hc-der-002",
      "\\frac{d}{dx}\\left((\\sin x)^{\\cos x}\\right)",
      "sin(x)^cos(x)*(-sin(x)*log(sin(x))+cos(x)*cot(x))",
      ["log-differentiation", "chain-rule", "trig"],
      "Use log differentiation: log y=cos x log(sin x)."
    ],
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
      "hc-spec-001",
      "\\int_0^{\\infty}x^4e^{-3x}\\,dx",
      "8/81",
      ["gamma-function", "improper-integral", "special-functions"],
      "This is Gamma(5)/3^5."
    ],
    [
      "hc-spec-002",
      "\\int_0^{\\infty}\\frac{\\sqrt{x}}{(1+x)^3}\\,dx",
      "pi/8",
      ["beta-function", "improper-integral", "special-functions"],
      "This is B(3/2,3/2)."
    ],
    [
      "hc-spec-003",
      "\\int_0^1x^3(1-x)^4\\,dx",
      "1/280",
      ["beta-function", "special-functions"],
      "This is B(4,5)=3!4!/8!."
    ],
    [
      "hc-spec-004",
      "\\int_0^{\\pi/2}\\sin^{10}x\\,dx",
      "63*pi/512",
      ["wallis", "trig", "special-functions"],
      "Use the even Wallis product."
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
      "hc-spec-008",
      "\\sum_{n=1}^{\\infty}\\frac{n^3}{2^n}",
      "26",
      ["series", "generating-function"],
      "Use the generating function for sum n^3 r^n at r=1/2."
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
