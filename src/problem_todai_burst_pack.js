(function () {
  "use strict";

  const SOURCE = "Original Todai-style burst pack 2026";
  const problems = [];
  const HINTS = [
    "Expect a recurrence, Wallis/Beta/Gamma identity, or repeated IBP before direct computation.",
    "Use WebWork form: log(x), exp(x), sqrt(x), pi. Constants of integration may be omitted."
  ];
  const TRUE_BOSS_TAGS = ["true-boss", "boss-rank", "boss-plus"];

  function bossTags(tags) {
    return [...TRUE_BOSS_TAGS, ...(tags || [])];
  }

  function add(problem) {
    const rank = problem.rank || 6;
    problems.push({
      source: SOURCE,
      difficulty: 4,
      rank,
      rankLabel: rank >= 6 ? "Todai burst R6" : "Todai burst R5",
      timeLimit: rank >= 6 ? 330 : 270,
      tabLimit: 1,
      hints: HINTS,
      ...problem,
      tags: Array.from(new Set([
        ...(problem.tags || []),
        "exam-style",
        "exam-depth",
        "todai-burst",
        "transfer-exam",
        "proficiency-exam",
        "midterm-style",
        rank >= 6 ? "depth-r6" : "depth-r5"
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
    ["burst-int-001", "\\int_0^\\infty x^4e^{-3x}\\,dx", "8/81", ["multi-ibp", "gamma-function", "improper-integral"], "Repeated IBP gives 4!/3^5.", 6],
    ["burst-int-002", "\\int_0^\\infty x^2e^{-x}\\sin x\\,dx", "1/2", ["multi-ibp", "exponential", "trig-integral", "improper-integral"], "Use the imaginary part of 2!/(1-i)^3.", 6],
    ["burst-int-003", "\\int_0^\\infty x^2e^{-2x}\\cos x\\,dx", "4/125", ["multi-ibp", "exponential", "trig-integral", "improper-integral"], "Use the real part of 2!/(2-i)^3.", 6],
    ["burst-int-004", "\\int_0^1x^5\\log x\\,dx", "-1/36", ["integration-by-parts", "multi-ibp", "parameter-integral", "log"], "Differentiate the beta integral or integrate by parts.", 5],
    ["burst-int-005", "\\int_0^1x^4(\\log x)^2\\,dx", "2/125", ["multi-ibp", "parameter-integral", "log"], "Use 2!/(5^3).", 6],
    ["burst-int-006", "\\int_0^1x^2(\\log x)^3\\,dx", "-2/27", ["multi-ibp", "parameter-integral", "log"], "Use -3!/(3^4).", 6],
    ["burst-int-007", "\\int_0^1x^3(1-x)^4\\,dx", "1/280", ["beta-function", "special-function", "definite-integral"], "This is B(4,5).", 5],
    ["burst-int-008", "\\int_0^1\\sqrt{x(1-x)}\\,dx", "pi/8", ["beta-function", "wallis", "special-function", "radical"], "This is B(3/2,3/2).", 6],
    ["burst-int-009", "\\int_0^\\infty x^4e^{-x^2}\\,dx", "3*sqrt(pi)/8", ["gamma-function", "special-function", "improper-integral"], "Set u=x^2 and get one half of Gamma(5/2).", 6],
    ["burst-int-010", "\\int_0^\\infty x^5e^{-x^2}\\,dx", "1", ["gamma-function", "special-function", "substitution", "improper-integral"], "Set u=x^2 and get one half of Gamma(3).", 5],
    ["burst-int-011", "\\int_0^{\\pi/2}\\log(\\sin x)\\,dx", "-pi*log(2)/2", ["wallis", "special-function", "definite-integral", "log"], "Use Wallis' product or pair with log(cos x).", 6],
    ["burst-int-012", "\\int_0^{\\pi/2}(\\log(\\sin x))^2\\,dx", "pi*log(2)^2/2+pi^3/24", ["wallis", "special-function", "definite-integral", "log"], "Differentiate the beta integral twice.", 6],
    ["burst-int-013", "\\int_0^\\pi x\\sin^8x\\,dx", "35*pi^2/256", ["wallis", "trig-power", "kings-property", "definite-integral"], "Symmetry gives pi/2 times the integral of sin^8 on [0,pi].", 6],
    ["burst-int-014", "\\int_0^{\\pi/2}\\sin^{10}x\\,dx", "63*pi/512", ["wallis", "trig-power", "definite-integral"], "Apply the even Wallis reduction.", 5],
    ["burst-int-015", "\\int_0^{\\pi/2}\\cos^{11}x\\,dx", "256/693", ["wallis", "trig-power", "definite-integral"], "Apply the odd Wallis reduction.", 5],
    ["burst-int-016", "\\int_0^{\\pi/2}\\sin^6x\\cos^4x\\,dx", "3*pi/512", ["beta-function", "trig-power", "definite-integral"], "Use one half of B(7/2,5/2).", 6],
    ["burst-int-017", "\\int_0^{\\pi/2}\\sin^4x\\cos^4x\\,dx", "3*pi/256", ["beta-function", "trig-power", "definite-integral"], "Use one half of B(5/2,5/2).", 5],
    ["burst-int-018", "\\int_0^{\\pi/2}\\sin^5x\\cos^3x\\,dx", "1/24", ["beta-function", "trig-power", "definite-integral"], "Use one half of B(3,2).", 5],
    ["burst-int-019", "\\int_0^{\\pi/2}\\sin^8x\\cos^2x\\,dx", "7*pi/512", ["beta-function", "trig-power", "definite-integral"], "Use one half of B(9/2,3/2).", 6],
    ["burst-int-020", "\\int_0^\\pi\\sin^8x\\,dx", "35*pi/128", ["wallis", "trig-power", "definite-integral"], "Double the half-interval Wallis value.", 5],
    ["burst-int-021", "\\int_0^{\\pi/2}\\sin^7x\\,dx", "16/35", ["wallis", "trig-power", "definite-integral"], "Apply the odd Wallis reduction.", 5],
    ["burst-int-022", "\\int_0^{\\pi/2}\\cos^8x\\,dx", "35*pi/256", ["wallis", "trig-power", "definite-integral"], "Apply the even Wallis reduction.", 5],
    ["burst-int-023", "\\int_0^{\\pi/2}\\sin^3x\\cos^6x\\,dx", "2/63", ["beta-function", "trig-power", "definite-integral"], "Use one half of B(2,7/2).", 6],
    ["burst-int-024", "\\int_0^{\\pi/2}\\sin^2x\\cos^6x\\,dx", "5*pi/256", ["beta-function", "trig-power", "definite-integral"], "Use one half of B(3/2,7/2).", 6],
    ["burst-int-025", "\\int_0^\\infty\\frac{x^3}{e^x-1}\\,dx", "pi^4/15", ["special-function", "improper-integral", "series-integral"], "Expand 1/(e^x-1) and use Gamma(4) times zeta(4).", 6],
    ["burst-int-026", "\\int_0^\\infty\\frac{x}{e^x-1}\\,dx", "pi^2/6", ["special-function", "improper-integral", "series-integral"], "Expand the Planck kernel and sum 1/n^2.", 6],
    ["burst-int-027", "\\int_0^\\infty\\frac{1}{1+x^4}\\,dx", "pi/(2*sqrt(2))", ["improper-integral", "special-function", "rational"], "Use the beta integral or factor x^4+1.", 6],
    ["burst-int-028", "\\int_0^\\infty\\frac{\\log x}{1+x^2}\\,dx", "0", ["improper-integral", "kings-property", "log"], "Substitute x=1/u; the integral equals its negative.", 6],
    ["burst-int-029", "\\int_0^\\infty\\frac{\\sqrt{x}}{1+x^2}\\,dx", "pi/sqrt(2)", ["beta-function", "special-function", "improper-integral", "radical"], "Use the standard x^(a-1)/(1+x^b) beta form.", 6],
    ["burst-int-030", "\\int_0^1\\frac{\\log x}{1+x}\\,dx", "-pi*pi/12", ["series-integral", "special-function", "log"], "Expand 1/(1+x) and integrate termwise.", 6],
    ["burst-int-031", "\\int_0^{\\pi/2}\\sin^4(2x)\\,dx", "3*pi/16", ["trig-power", "wallis", "substitution"], "Set u=2x and use the full-period symmetry.", 5],
    ["burst-int-032", "\\int_0^{\\pi/2}\\sin^6x\\cos^6x\\,dx", "5*pi/2048", ["beta-function", "trig-power", "definite-integral"], "Use one half of B(7/2,7/2).", 6],
    ["burst-int-033", "\\int_0^{\\pi/2}\\sin^{12}x\\,dx", "231*pi/2048", ["wallis", "trig-power", "definite-integral"], "Apply the even Wallis reduction through twelve powers.", 6],
    ["burst-int-034", "\\int_0^{\\pi/2}\\cos^{13}x\\,dx", "1024/3003", ["wallis", "trig-power", "definite-integral"], "Apply the odd Wallis reduction through thirteen powers.", 6],
    ["burst-int-035", "\\int_0^{\\pi/2}\\sin^9x\\cos^5x\\,dx", "1/210", ["beta-function", "trig-power", "definite-integral"], "Use one half of B(5,3).", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => numeric(id, "integrals", prompt, answer, tags, solution, rank, 330));

  [
    ["burst-int-036", "\\int x^3e^{2x}\\,dx", "exp(2*x)*(x^3/2-3*x^2/4+3*x/4-3/8)", ["multi-ibp", "integration-by-parts", "exponential"], "Repeated IBP lowers the power of x each time.", 6],
    ["burst-int-037", "\\int x^2\\sin(3x)\\,dx", "-(x^2)*cos(3*x)/3+2*x*sin(3*x)/9+2*cos(3*x)/27", ["multi-ibp", "integration-by-parts", "trig-integral"], "Integrate by parts twice.", 6],
    ["burst-int-038", "\\int (\\log x)^3\\,dx", "x*(log(x)^3-3*log(x)^2+6*log(x)-6)", ["multi-ibp", "integration-by-parts", "log"], "Repeated IBP produces the descending log polynomial.", 6],
    ["burst-int-039", "\\int x^4\\log x\\,dx", "x^5*log(x)/5-x^5/25", ["integration-by-parts", "log"], "One IBP after integrating x^4.", 5],
    ["burst-int-040", "\\int x^3\\arctan x\\,dx", "(x^4-1)*atan(x)/4-x^3/12+x/4", ["integration-by-parts", "inverse-trig", "rational"], "After parts, divide x^4 by 1+x^2.", 6],
    ["burst-int-041", "\\int x^3e^{-x}\\,dx", "-exp(-x)*(x^3+3*x^2+6*x+6)", ["multi-ibp", "integration-by-parts", "exponential"], "Repeated IBP gives the factorial polynomial.", 6],
    ["burst-int-042", "\\int x^2\\log(1+x)\\,dx", "x^3*log(1+x)/3-x^3/9+x^2/6-x/3+log(1+x)/3", ["integration-by-parts", "log", "rational"], "After parts, divide x^3 by 1+x.", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => antiderivative(id, prompt, answer, tags, solution, rank, 330));

  [
    ["burst-rec-001", "I_n=\\int_0^1x^n\\log x\\,dx.\\ \\text{Find }I_n", "-1/(n+1)^2", "n", ["recurrence-formula", "parameter-integral", "log"], "Differentiate 1/(n+1) with respect to n.", 6],
    ["burst-rec-002", "I_n=\\int_0^1x^n(\\log x)^2\\,dx.\\ \\text{Find }I_n", "2/(n+1)^3", "n", ["recurrence-formula", "parameter-integral", "log"], "Differentiate 1/(n+1) twice.", 6],
    ["burst-rec-003", "I_n=\\int_0^1x^n(1-x)^2\\,dx.\\ \\text{Find }I_n", "2/((n+1)*(n+2)*(n+3))", "n", ["recurrence-formula", "beta-function"], "This is B(n+1,3).", 6],
    ["burst-rec-004", "W_n=\\int_0^{\\pi/2}\\sin^nx\\,dx.\\ \\text{Find }W_n/W_{n-2}", "(n-1)/n", "n", ["recurrence-formula", "wallis", "trig-power"], "Integrate by parts to get the Wallis recurrence.", 6],
    ["burst-rec-005", "A_n=\\int_0^{\\pi/2}\\sin^{2n}x\\,dx.\\ \\text{Find }A_n/A_{n-1}", "(2*n-1)/(2*n)", "n", ["recurrence-formula", "wallis", "trig-power"], "Apply the Wallis recurrence with exponent 2n.", 6],
    ["burst-rec-006", "B_n=\\int_0^{\\pi/2}\\sin^{2n+1}x\\,dx.\\ \\text{Find }B_n/B_{n-1}", "(2*n)/(2*n+1)", "n", ["recurrence-formula", "wallis", "trig-power"], "Apply the Wallis recurrence with exponent 2n+1.", 6],
    ["burst-rec-007", "G_n=\\int_0^\\infty x^ne^{-x}\\,dx.\\ \\text{Find }G_n/G_{n-1}", "n", "n", ["recurrence-formula", "gamma-function", "improper-integral"], "Gamma(n+1)=n Gamma(n).", 6],
    ["burst-rec-008", "J_n=\\int_0^1x^ne^x\\,dx,\\ J_n=e-n\\,J_{n-1}.\\ \\text{Find the coefficient of }J_{n-1}", "-n", "n", ["recurrence-formula", "integration-by-parts", "exponential"], "IBP gives J_n=e-nJ_{n-1}.", 6],
    ["burst-rec-009", "K_n=\\int_0^1x^n(1+x)\\,dx.\\ \\text{Find }K_n", "1/(n+1)+1/(n+2)", "n", ["recurrence-formula", "definite-integral"], "Split into two power integrals.", 5],
    ["burst-rec-010", "L_n=\\int_0^1x^n(1-x)\\,dx.\\ \\text{Find }L_n", "1/((n+1)*(n+2))", "n", ["recurrence-formula", "definite-integral"], "Subtract 1/(n+2) from 1/(n+1).", 5]
  ].forEach(([id, prompt, answer, variable, tags, solution, rank]) => expression(id, "integrals", prompt, answer, variable, tags, solution, rank, 270));

  [
    ["burst-der-001", "\\left.\\frac{d^{20}}{dx^{20}}e^{2x}\\right|_{x=0}", "1048576", ["higher-derivative", "super-high-derivative", "exponential"], "The value is 2^20.", 6],
    ["burst-der-002", "\\left.\\frac{d^{15}}{dx^{15}}\\sin(3x)\\right|_{x=0}", "-14348907", ["higher-derivative", "super-high-derivative", "trig"], "Use 3^15 sin(15pi/2).", 6],
    ["burst-der-003", "\\left.\\frac{d^{18}}{dx^{18}}\\cosh(2x)\\right|_{x=0}", "262144", ["higher-derivative", "super-high-derivative", "hyperbolic"], "Even derivatives of cosh(2x) return 2^18 at zero.", 6],
    ["burst-der-004", "\\left.\\frac{d^{10}}{dx^{10}}(x^3e^x)\\right|_{x=0}", "720", ["higher-derivative", "super-high-derivative", "taylor"], "Read the x^10 coefficient of x^3e^x.", 6],
    ["burst-der-005", "\\left.\\frac{d^{11}}{dx^{11}}(x^2\\sin(2x))\\right|_{x=0}", "56320", ["higher-derivative", "super-high-derivative", "taylor", "trig"], "Read the x^11 coefficient after shifting the sine series by x^2.", 6],
    ["burst-der-006", "\\left.\\frac{d^8}{dx^8}\\log(1+x)\\right|_{x=0}", "-5040", ["higher-derivative", "super-high-derivative", "taylor", "log"], "The eighth derivative is (-1)^7 7!.", 6],
    ["burst-der-007", "\\left.\\frac{d^{12}}{dx^{12}}\\frac{1}{1-x}\\right|_{x=0}", "479001600", ["higher-derivative", "super-high-derivative", "taylor"], "The x^12 coefficient is 1.", 6],
    ["burst-der-008", "\\left.\\frac{d^{12}}{dx^{12}}(e^x\\cos x)\\right|_{x=0}", "-64", ["higher-derivative", "super-high-derivative", "complex"], "Use the real part of (1+i)^12.", 6],
    ["burst-der-009", "\\left.\\frac{d^{14}}{dx^{14}}(x^4e^{-x})\\right|_{x=0}", "24024", ["higher-derivative", "super-high-derivative", "taylor"], "Read the x^14 coefficient of x^4e^{-x}.", 6],
    ["burst-der-010", "\\left.\\frac{d^9}{dx^9}(e^{2x}\\sin x)\\right|_{x=0}", "-1199", ["higher-derivative", "super-high-derivative", "complex", "exponential", "trig"], "Use the imaginary part of (2+i)^9.", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => numeric(id, "derivatives", prompt, answer, tags, solution, rank, 240));

  [
    ["burst-boss-int-001", "\\int_0^\\infty\\frac{(\\log x)^2}{1+x^2}\\,dx", "pi^3/8", ["improper-integral", "special-function", "parameter-integral", "log"], "Differentiate pi/2*csc(pi*a/2) twice at a=1.", 6],
    ["burst-boss-int-002", "\\int_0^\\infty\\frac{\\log x}{1+x^4}\\,dx", "-(pi^2)/(8*sqrt(2))", ["improper-integral", "special-function", "parameter-integral", "log"], "Differentiate pi/4*csc(pi*a/4) at a=1.", 6],
    ["burst-boss-int-003", "\\int_0^\\infty\\frac{\\sqrt{x}\\log x}{1+x^2}\\,dx", "pi^2/(2*sqrt(2))", ["improper-integral", "beta-function", "parameter-integral", "radical"], "Use the derivative of pi/2*csc(pi*a/2) at a=3/2.", 6],
    ["burst-boss-int-004", "\\int_0^\\infty\\frac{x^4}{1+x^6}\\,dx", "pi/3", ["improper-integral", "beta-function", "rational"], "Use the standard beta integral for x^(a-1)/(1+x^b).", 6],
    ["burst-boss-int-005", "\\int_0^\\infty\\frac{x^2}{1+x^6}\\,dx", "pi/6", ["improper-integral", "beta-function", "rational"], "Use pi/6*csc(pi/2).", 5],
    ["burst-boss-int-006", "\\int_0^\\infty\\frac{1}{1+x^6}\\,dx", "pi/3", ["improper-integral", "beta-function", "rational"], "Use pi/6*csc(pi/6).", 5],
    ["burst-boss-int-007", "\\int_0^\\infty\\frac{x}{1+x^4}\\,dx", "pi/4", ["improper-integral", "beta-function", "rational"], "Use u=x^2, then arctan.", 5],
    ["burst-boss-int-008", "\\int_0^\\infty\\frac{x^2}{1+x^4}\\,dx", "pi/(2*sqrt(2))", ["improper-integral", "beta-function", "rational"], "Use pi/4*csc(3pi/4).", 6],
    ["burst-boss-int-009", "\\int_0^1\\log x\\log(1-x)\\,dx", "2-pi^2/6", ["series-integral", "special-function", "log"], "Expand log(1-x) and integrate x^n log x termwise.", 6],
    ["burst-boss-int-010", "\\int_0^1\\frac{\\log x}{1-x}\\,dx", "-(pi^2)/6", ["series-integral", "improper-integral", "log"], "Expand 1/(1-x) and sum -1/n^2.", 6],
    ["burst-boss-int-011", "\\int_0^1(\\log x)^4\\,dx", "24", ["gamma-function", "parameter-integral", "log"], "Use (-1)^4*4! from the gamma integral.", 5],
    ["burst-boss-int-012", "\\int_0^1x^3(\\log x)^4\\,dx", "3/128", ["gamma-function", "parameter-integral", "log"], "Use 4!/4^5.", 6],
    ["burst-boss-int-013", "\\int_0^1x^2(\\log x)^5\\,dx", "-40/243", ["gamma-function", "parameter-integral", "log"], "Use -5!/3^6.", 6],
    ["burst-boss-int-014", "\\int_0^{\\pi/2}\\log(\\sin x)\\log(\\cos x)\\,dx", "pi*log(2)^2/2-pi^3/48", ["wallis", "special-function", "log", "trig-integral"], "Differentiate the beta integral with respect to both exponents.", 6],
    ["burst-boss-int-015", "\\int_0^{\\pi/2}(\\log(\\tan x))^2\\,dx", "pi^3/8", ["wallis", "special-function", "log", "trig-integral"], "Subtract the log-sine and log-cosine square identities.", 6],
    ["burst-boss-int-016", "\\int_0^\\pi x\\sin^{10}x\\,dx", "63*pi^2/512", ["wallis", "trig-power", "kings-property"], "Pair x with pi-x, then use the Wallis value for sin^10.", 6],
    ["burst-boss-int-017", "\\int_0^{\\pi/2}\\sin^8x\\cos^8x\\,dx", "35*pi/65536", ["beta-function", "wallis", "trig-power"], "Write it as 2^-8 sin^8(2x) and use Wallis.", 6],
    ["burst-boss-int-018", "\\int_0^{\\pi/2}\\sin^{14}x\\,dx", "429*pi/4096", ["wallis", "trig-power"], "Use the even Wallis reduction through fourteen powers.", 6],
    ["burst-boss-int-019", "\\int_0^{\\pi/2}\\sin^{15}x\\,dx", "2048/6435", ["wallis", "trig-power"], "Use the odd Wallis product through fifteen powers.", 6],
    ["burst-boss-int-020", "\\int_0^\\infty x^5e^{-2x}\\sin x\\,dx", "5280/15625", ["multi-ibp", "gamma-function", "trig-integral", "improper-integral"], "Use the imaginary part of 5!/(2-i)^6.", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => numeric(id, "integrals", prompt, answer, bossTags(tags), solution, rank, rank >= 6 ? 420 : 330));

  [
    ["burst-boss-anti-001", "\\int x^4e^x\\,dx", "exp(x)*(x^4-4*x^3+12*x^2-24*x+24)", ["multi-ibp", "integration-by-parts", "exponential"], "Repeated IBP produces the alternating factorial polynomial.", 6],
    ["burst-boss-anti-002", "\\int x^4e^{-2x}\\,dx", "-exp(-2*x)*(x^4/2+x^3+3*x^2/2+3*x/2+3/4)", ["multi-ibp", "integration-by-parts", "exponential"], "Choose P so that d(-e^{-2x}P)/dx=x^4e^{-2x}.", 6],
    ["burst-boss-anti-003", "\\int x^3\\sin(2x)\\,dx", "-(x^3)*cos(2*x)/2+3*x^2*sin(2*x)/4+3*x*cos(2*x)/4-3*sin(2*x)/8", ["multi-ibp", "integration-by-parts", "trig-integral"], "Integrate by parts until the power disappears.", 6],
    ["burst-boss-anti-004", "\\int x^3\\cos(2x)\\,dx", "x^3*sin(2*x)/2+3*x^2*cos(2*x)/4-3*x*sin(2*x)/4-3*cos(2*x)/8", ["multi-ibp", "integration-by-parts", "trig-integral"], "Integrate by parts repeatedly and collect the trig terms.", 6],
    ["burst-boss-anti-005", "\\int x^4(\\log x)^2\\,dx", "x^5*(log(x)^2/5-2*log(x)/25+2/125)", ["multi-ibp", "integration-by-parts", "log"], "IBP lowers the power of log x twice.", 6],
    ["burst-boss-anti-006", "\\int(\\log x)^4\\,dx", "x*(log(x)^4-4*log(x)^3+12*log(x)^2-24*log(x)+24)", ["multi-ibp", "integration-by-parts", "log"], "The descending log polynomial follows from repeated IBP.", 6],
    ["burst-boss-anti-007", "\\int x^2\\arctan x\\,dx", "x^3*atan(x)/3-x^2/6+log(1+x^2)/6", ["integration-by-parts", "inverse-trig", "rational"], "After IBP, divide x^3 by 1+x^2.", 5],
    ["burst-boss-anti-008", "\\int x^4\\arctan x\\,dx", "x^5*atan(x)/5-x^4/20+x^2/10-log(1+x^2)/10", ["integration-by-parts", "inverse-trig", "rational"], "After IBP, divide x^5 by 1+x^2.", 6],
    ["burst-boss-anti-009", "\\int x^2\\log(1+x^2)\\,dx", "x^3*log(1+x^2)/3-2*x^3/9+2*x/3-2*atan(x)/3", ["integration-by-parts", "log", "inverse-trig"], "After IBP, reduce x^4/(1+x^2).", 6],
    ["burst-boss-anti-010", "\\int x^3\\log(1+x^2)\\,dx", "x^4*log(1+x^2)/4-x^4/8+x^2/4-log(1+x^2)/4", ["integration-by-parts", "log", "rational"], "After IBP, reduce x^5/(1+x^2).", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => antiderivative(id, prompt, answer, bossTags(tags), solution, rank, rank >= 6 ? 420 : 330));

  [
    ["burst-boss-param-001", "I(a)=\\int_0^\\infty e^{-ax}\\sin x\\,dx.\\ \\text{Find }I(a)", "1/(a^2+1)", "a", ["parameter-integral", "laplace-transform", "trig-integral"], "Use the imaginary part of 1/(a-i).", 6],
    ["burst-boss-param-002", "I(a)=\\int_0^\\infty xe^{-ax}\\,dx.\\ \\text{Find }I(a)", "1/a^2", "a", ["parameter-integral", "gamma-function", "improper-integral"], "Differentiate the Laplace integral of e^{-ax}.", 5],
    ["burst-boss-param-003", "I(a)=\\int_0^\\infty\\frac{1}{1+a x^2}\\,dx.\\ \\text{Find }I(a)", "pi/(2*sqrt(a))", "a", ["parameter-integral", "improper-integral", "substitution"], "Set u=sqrt(a)x.", 5],
    ["burst-boss-param-004", "I(a)=\\int_0^{\\pi/2}\\log(1+a\\sin^2x)\\,dx.\\ \\text{Find }I(a)", "pi*log((1+sqrt(1+a))/2)", "a", ["parameter-integral", "wallis", "special-function", "log"], "Differentiate in a, integrate the rational trig form, then use I(0)=0.", 6],
    ["burst-boss-param-005", "J_n=\\int_0^\\infty\\frac{x^n}{1+x^2}\\,dx\\ \\text{for }-1<n<1.\\ \\text{Find }J_n", "pi/(2*sin(pi*(n+1)/2))", "n", ["parameter-integral", "beta-function", "improper-integral"], "Use the beta form for x^(a-1)/(1+x^2) with a=n+1.", 6],
    ["burst-boss-param-006", "K_n=\\int_0^1x^n(\\log x)^3\\,dx.\\ \\text{Find }K_n", "-6/(n+1)^4", "n", ["recurrence-formula", "parameter-integral", "log"], "Differentiate 1/(n+1) three times.", 6]
  ].forEach(([id, prompt, answer, variable, tags, solution, rank]) => expression(id, "integrals", prompt, answer, variable, bossTags(tags), solution, rank, rank >= 6 ? 360 : 300));

  [
    ["burst-boss-lim-001", "\\lim_{x\\to0}\\frac{\\tan x-x-x^3/3}{x^5}", "2/15", ["taylor", "nested-taylor", "hard-limit"], "Use tan x=x+x^3/3+2x^5/15+...", 5],
    ["burst-boss-lim-002", "\\lim_{x\\to0}\\frac{\\sin x-x+x^3/6}{x^5}", "1/120", ["taylor", "hard-limit"], "Use the fifth-order term of sin x.", 5],
    ["burst-boss-lim-003", "\\lim_{x\\to0}\\frac{\\log(1+x)-x+x^2/2-x^3/3}{x^4}", "-1/4", ["taylor", "hard-limit", "log"], "Use the fourth-order term of log(1+x).", 5],
    ["burst-boss-lim-004", "\\lim_{x\\to0}\\frac{e^{\\sin x}-1-x-x^2/2}{x^4}", "-1/8", ["taylor", "composite-taylor", "hard-limit"], "Expand sin x first, then exponentiate to fourth order.", 6],
    ["burst-boss-lim-005", "\\lim_{x\\to0}\\frac{\\cos(\\sin x)-\\cos x}{x^4}", "1/6", ["taylor", "composite-taylor", "hard-limit"], "Compare both cosine expansions through x^4.", 6],
    ["burst-boss-lim-006", "\\lim_{x\\to0}\\frac{\\arctan x-x+x^3/3-x^5/5}{x^7}", "-1/7", ["taylor", "inverse-trig", "hard-limit"], "Use the alternating arctan series.", 6],
    ["burst-boss-lim-008", "\\lim_{x\\to\\infty}x\\left(\\left(1+\\frac{1}{x}\\right)^x-e\\right)", "-e/2", ["asymptotic-expansion", "exponential", "hard-limit"], "Use x log(1+1/x)=1-1/(2x)+...", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => numeric(id, "limits", prompt, answer, bossTags(tags), solution, rank, rank >= 6 ? 300 : 240));

  [
    ["burst-boss-ser-001", "\\sum_{n=1}^{\\infty}\\frac{n^3}{2^n}", "26", ["special-sum", "generating-function"], "Differentiate the geometric series three times.", 5],
    ["burst-boss-ser-002", "\\sum_{n=1}^{\\infty}\\frac{n^2}{3^n}", "3/2", ["special-sum", "generating-function"], "Use r(1+r)/(1-r)^3 with r=1/3.", 5],
    ["burst-boss-ser-003", "H_n=\\sum_{k=1}^n\\frac{1}{k}.\\ \\text{Find }\\sum_{n=1}^{\\infty}\\frac{H_n}{2^n}", "2*log(2)", ["special-sum", "generating-function", "harmonic-number"], "Use sum H_n x^n=-log(1-x)/(1-x).", 6],
    ["burst-boss-ser-004", "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n^2}", "pi^2/12", ["special-sum", "alternating-series"], "Use the alternating zeta value at 2.", 6],
    ["burst-boss-ser-005", "\\text{Coefficient of }x^6\\text{ in }(\\log(1+x))^2", "137/180", ["taylor", "coefficient", "log"], "The coefficient is 2H_5/6.", 6],
    ["burst-boss-ser-006", "\\text{Coefficient of }x^8\\text{ in }\\frac{x^2e^{3x}}{1-x}", "1553/80", ["taylor", "coefficient", "generating-function"], "Collect the x^6 coefficient of e^{3x}/(1-x).", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => numeric(id, "series", prompt, answer, bossTags(tags), solution, rank, rank >= 6 ? 300 : 240));

  [
    ["burst-boss-der-001", "\\left.\\frac{d^{12}}{dx^{12}}(\\log(1+x))^2\\right|_{x=0}", "241087680", ["higher-derivative", "super-high-derivative", "taylor", "log"], "Use [x^n](log(1+x))^2=(-1)^n*2H_{n-1}/n.", 6],
    ["burst-boss-der-002", "\\left.\\frac{d^{11}}{dx^{11}}(\\log(1+x))^2\\right|_{x=0}", "-21257280", ["higher-derivative", "super-high-derivative", "taylor", "log"], "Use [x^n](log(1+x))^2=(-1)^n*2H_{n-1}/n.", 6],
    ["burst-boss-der-003", "\\left.\\frac{d^{10}}{dx^{10}}(e^{x^2}\\cos x)\\right|_{x=0}", "-22591", ["higher-derivative", "super-high-derivative", "taylor"], "Multiply the even series of e^{x^2} and cos x.", 6],
    ["burst-boss-der-004", "\\left.\\frac{d^{14}}{dx^{14}}(e^x\\sin(2x))\\right|_{x=0}", "16124", ["higher-derivative", "super-high-derivative", "complex", "trig"], "Use the imaginary part of (1+2i)^14.", 6],
    ["burst-boss-der-005", "\\left.\\frac{d^{16}}{dx^{16}}(e^x\\cos(2x))\\right|_{x=0}", "164833", ["higher-derivative", "super-high-derivative", "complex", "trig"], "Use the real part of (1+2i)^16.", 6],
    ["burst-boss-der-006", "\\left.\\frac{d^{18}}{dx^{18}}(x^4e^{3x})\\right|_{x=0}", "351261243360", ["higher-derivative", "super-high-derivative", "taylor", "exponential"], "Read the x^18 coefficient after shifting by x^4.", 6],
    ["burst-boss-der-007", "\\left.\\frac{d^{16}}{dx^{16}}(x^3\\sin(2x))\\right|_{x=0}", "27525120", ["higher-derivative", "super-high-derivative", "taylor", "trig"], "Read the x^13 coefficient of sin(2x).", 6],
    ["burst-boss-der-008", "\\left.\\frac{d^{18}}{dx^{18}}(x^2\\cos(3x))\\right|_{x=0}", "13172296626", ["higher-derivative", "super-high-derivative", "taylor", "trig"], "Read the x^16 coefficient of cos(3x).", 6],
    ["burst-boss-der-009", "\\left.\\frac{d^{10}}{dx^{10}}\\frac{x^2}{(1-x)^4}\\right|_{x=0}", "598752000", ["higher-derivative", "super-high-derivative", "generating-function"], "The x^10 coefficient is C(11,3).", 6],
    ["burst-boss-der-010", "\\left.\\frac{d^{15}}{dx^{15}}\\frac{x^3}{1+x^2}\\right|_{x=0}", "1307674368000", ["higher-derivative", "super-high-derivative", "generating-function"], "Use x^3/(1+x^2)=x^3-x^5+x^7-...", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => numeric(id, "derivatives", prompt, answer, bossTags(tags), solution, rank, 300));

  [
    ["burst-boss2-int-001", "\\int_0^\\infty\\frac{\\log x}{1+x^3}\\,dx", "-(2*pi^2)/27", "Differentiate the beta integral pi/3*csc(pi*a/3) at a=1."],
    ["burst-boss2-int-002", "\\int_0^\\infty\\frac{(\\log x)^2}{1+x^3}\\,dx", "10*pi^3/(81*sqrt(3))", "Differentiate pi/3*csc(pi*a/3) twice at a=1."],
    ["burst-boss2-int-003", "\\int_0^\\infty\\frac{\\sqrt{x}}{1+x^3}\\,dx", "pi/3", "Use the beta form with a=3/2 and b=3."],
    ["burst-boss2-int-004", "\\int_0^\\infty\\frac{x^{1/3}}{1+x^2}\\,dx", "pi/sqrt(3)", "Use the beta form with a=4/3 and b=2."],
    ["burst-boss2-int-005", "\\int_0^\\infty\\frac{\\arctan x}{x(1+x^2)}\\,dx", "pi*log(2)/2", "Set x=tan t and integrate t cot t by parts."],
    ["burst-boss2-int-006", "\\int_0^\\infty\\left(\\frac{\\sin x}{x}\\right)^2\\,dx", "pi/2", "Use the Fourier/Dirichlet kernel identity."],
    ["burst-boss2-int-007", "\\int_0^\\infty\\frac{1-\\cos x}{x^2}\\,dx", "pi/2", "Integrate by parts and use the Dirichlet integral."],
    ["burst-boss2-int-008", "\\int_0^1\\frac{(\\log x)^3}{1-x}\\,dx", "-pi^4/15", "Expand 1/(1-x) and sum zeta(4)."],
    ["burst-boss2-int-009", "\\int_0^1\\frac{(\\log x)^5}{1-x}\\,dx", "-8*pi^6/63", "Expand 1/(1-x) and sum zeta(6)."],
    ["burst-boss2-int-010", "\\int_0^1\\frac{(\\log x)^3}{1+x}\\,dx", "-7*pi^4/120", "Expand 1/(1+x) and use eta(4)."],
    ["burst-boss2-int-011", "\\int_0^1\\frac{(\\log x)^5}{1+x}\\,dx", "-31*pi^6/252", "Expand 1/(1+x) and use eta(6)."],
    ["burst-boss2-int-012", "\\int_0^{\\pi/2}x\\sin^2x\\,dx", "pi^2/16+1/4", "Write sin^2 x=(1-cos 2x)/2."],
    ["burst-boss2-int-013", "\\int_0^{\\pi/2}x\\sin x\\cos x\\,dx", "pi/8", "Use sin x cos x=sin 2x/2."],
    ["burst-boss2-int-014", "\\int_0^\\pi x^2\\sin x\\,dx", "pi^2-4", "Integrate by parts twice."]
  ].forEach(([id, prompt, answer, solution]) => numeric(id, "integrals", prompt, answer, bossTags([]), solution, 6, 480));

  [
    ["burst-boss2-lim-001", "\\lim_{x\\to0}\\left(\\frac{\\sin x}{x}\\right)^{1/x^2}", "exp(-1/6)", "Take logs and use log(sin x/x)=-x^2/6+..."],
    ["burst-boss2-lim-002", "\\lim_{x\\to0}\\frac{x/\\tan x-1+x^2/3}{x^4}", "-1/45", "Use x/tan x=1-x^2/3-x^4/45+..."],
    ["burst-boss2-lim-003", "\\lim_{x\\to0}\\frac{1/\\sin x-1/x-x/6}{x^3}", "7/360", "Use the Laurent expansion of csc x."],
    ["burst-boss2-lim-004", "\\lim_{x\\to0}\\frac{\\log(\\cos x)+x^2/2}{x^4}", "-1/12", "Expand log(cos x) through the fourth order."],
    ["burst-boss2-lim-005", "\\lim_{x\\to0}\\frac{\\int_0^x e^{-t^2}\\,dt-x+x^3/3}{x^5}", "1/10", "Integrate the series for e^{-t^2} term by term."],
    ["burst-boss2-lim-006", "\\lim_{x\\to0}\\frac{\\int_0^x\\log(1+t^2)\\,dt-x^3/3+x^5/10}{x^7}", "1/21", "Integrate the series for log(1+t^2) term by term."],
    ["burst-boss2-lim-007", "\\lim_{n\\to\\infty}n\\left(\\sum_{k=1}^n\\frac{1}{n+k}-\\log 2\\right)", "-1/4", "Use the Euler-Maclaurin correction for H_{2n}-H_n."],
    ["burst-boss2-lim-008", "\\lim_{n\\to\\infty}n^2\\left(\\sum_{k=1}^n\\frac{1}{n^2+k^2}-\\frac{\\pi}{4n}\\right)", "-1/4", "Read the first endpoint correction in the Riemann sum."],
    ["burst-boss2-lim-009", "\\lim_{n\\to\\infty}n\\left(\\sum_{k=1}^n\\frac{1}{\\sqrt{n^2+k^2}}-\\log(1+\\sqrt2)\\right)", "(1/sqrt(2)-1)/2", "Apply the first Euler-Maclaurin correction."],
    ["burst-boss2-lim-010", "\\lim_{n\\to\\infty}n\\left(\\int_0^1\\left(1+\\frac{x}{n}\\right)^n\\,dx-(e-1)\\right)", "(2-e)/2", "Expand n log(1+x/n) to the first correction term."]
  ].forEach(([id, prompt, answer, solution]) => numeric(id, "limits", prompt, answer, bossTags([]), solution, 6, 420));

  [
    ["burst-boss2-ser-001", "\\sum_{n=1}^{\\infty}\\frac{1}{n^4}", "pi^4/90", "Use the Basel-type value zeta(4)."],
    ["burst-boss2-ser-002", "\\sum_{n=1}^{\\infty}\\frac{1}{(2n-1)^4}", "pi^4/96", "Remove the even fourth-power terms from zeta(4)."],
    ["burst-boss2-ser-003", "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n^4}", "7*pi^4/720", "Use eta(4)=(1-2^{-3})zeta(4)."],
    ["burst-boss2-ser-004", "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n^6}", "31*pi^6/30240", "Use eta(6)=(1-2^{-5})zeta(6)."],
    ["burst-boss2-ser-005", "\\sum_{n=1}^{\\infty}\\frac{n^4}{3^n}", "15", "Apply the fourth derivative of the geometric series at r=1/3."],
    ["burst-boss2-ser-006", "\\sum_{n=1}^{\\infty}\\frac{n^5}{3^n}", "273/4", "Apply the fifth derivative of the geometric series at r=1/3."],
    ["burst-boss2-ser-007", "H_n=\\sum_{k=1}^n\\frac{1}{k}.\\ \\text{Find }\\sum_{n=1}^{\\infty}\\frac{H_n}{3^n}", "3*log(3/2)/2", "Use sum H_n x^n=-log(1-x)/(1-x)."],
    ["burst-boss2-ser-008", "H_n=\\sum_{k=1}^n\\frac{1}{k}.\\ \\text{Find }\\sum_{n=1}^{\\infty}\\frac{H_n}{4^n}", "4*log(4/3)/3", "Use sum H_n x^n=-log(1-x)/(1-x)."]
  ].forEach(([id, prompt, answer, solution]) => numeric(id, "series", prompt, answer, bossTags([]), solution, 6, 360));

  [
    ["burst-boss2-param-001", "F(a,b)=\\int_0^\\infty e^{-a x}\\sin(bx)\\,dx.\\ \\text{Find }F(a,b)", "b/(a^2+b^2)", ["a", "b"], "Use the imaginary part of 1/(a-bi)."],
    ["burst-boss2-param-002", "F(a,b)=\\int_0^\\infty e^{-a x}\\cos(bx)\\,dx.\\ \\text{Find }F(a,b)", "a/(a^2+b^2)", ["a", "b"], "Use the real part of 1/(a-bi)."],
    ["burst-boss2-param-003", "F(a)=\\int_0^\\infty x e^{-a x}\\sin x\\,dx.\\ \\text{Find }F(a)", "2*a/(a^2+1)^2", "a", "Differentiate the Laplace sine transform with respect to a."],
    ["burst-boss2-param-004", "F(a)=\\int_0^\\infty x e^{-a x}\\cos x\\,dx.\\ \\text{Find }F(a)", "(a^2-1)/(a^2+1)^2", "a", "Differentiate the Laplace cosine transform with respect to a."],
    ["burst-boss2-param-005", "F(a)=\\int_0^1\\frac{x^a-1}{\\log x}\\,dx.\\ \\text{Find }F(a)", "log(a+1)", "a", "Differentiate with respect to a, then use F(0)=0."],
    ["burst-boss2-param-006", "F(a)=\\int_0^1x^a(\\log x)^5\\,dx.\\ \\text{Find }F(a)", "-120/(a+1)^6", "a", "Differentiate 1/(a+1) five times."]
  ].forEach(([id, prompt, answer, variable, solution]) => expression(id, "integrals", prompt, answer, variable, bossTags([]), solution, 6, 420));

  [
    ["burst-boss2-anti-001", "\\int x^5e^{2x}\\,dx", "exp(2*x)*(x^5/2-5*x^4/4+5*x^3/2-15*x^2/4+15*x/4-15/8)", "Repeated IBP produces the factorial polynomial."],
    ["burst-boss2-anti-002", "\\int x^4\\sin x\\,dx", "-(x^4)*cos(x)+4*x^3*sin(x)+12*x^2*cos(x)-24*x*sin(x)-24*cos(x)", "Integrate by parts until the polynomial disappears."],
    ["burst-boss2-anti-003", "\\int x^4\\cos x\\,dx", "x^4*sin(x)+4*x^3*cos(x)-12*x^2*sin(x)-24*x*cos(x)+24*sin(x)", "Integrate by parts until the polynomial disappears."],
    ["burst-boss2-anti-004", "\\int(\\log x)^5\\,dx", "x*(log(x)^5-5*log(x)^4+20*log(x)^3-60*log(x)^2+120*log(x)-120)", "Repeated IBP lowers the log power."],
    ["burst-boss2-anti-005", "\\int x^5\\arctan x\\,dx", "x^6*atan(x)/6-x^5/30+x^3/18-x/6+atan(x)/6", "After parts, divide x^6 by 1+x^2."],
    ["burst-boss2-anti-006", "\\int\\frac{x^5}{1+x^2}\\,dx", "x^4/4-x^2/2+log(1+x^2)/2", "Divide x^5 by 1+x^2 before integrating."]
  ].forEach(([id, prompt, answer, solution]) => antiderivative(id, prompt, answer, bossTags([]), solution, 6, 420));

  [
    ["burst-boss2-der-001", "\\left.\\frac{d^{21}}{dx^{21}}(e^x\\sin x)\\right|_{x=0}", "-1024", "Use the imaginary part of (1+i)^21."],
    ["burst-boss2-der-002", "\\left.\\frac{d^{20}}{dx^{20}}(e^x\\cos x)\\right|_{x=0}", "-1024", "Use the real part of (1+i)^20."],
    ["burst-boss2-der-003", "\\left.\\frac{d^{17}}{dx^{17}}(x^5e^{2x})\\right|_{x=0}", "3041525760", "Read the x^12 coefficient of e^{2x}, then multiply by 17!."],
    ["burst-boss2-der-004", "\\left.\\frac{d^{18}}{dx^{18}}(x^6\\cos(2x))\\right|_{x=0}", "54747463680", "Read the x^12 coefficient of cos(2x), then multiply by 18!."],
    ["burst-boss2-der-005", "\\left.\\frac{d^{19}}{dx^{19}}(x^4\\sin(3x))\\right|_{x=0}", "-1334792724768", "Read the x^15 coefficient of sin(3x), then multiply by 19!."],
    ["burst-boss2-der-006", "\\left.\\frac{d^{10}}{dx^{10}}\\frac{1}{(1-x)^3}\\right|_{x=0}", "239500800", "The x^10 coefficient is C(12,2)."],
    ["burst-boss2-der-007", "\\left.\\frac{d^{10}}{dx^{10}}\\frac{x^2}{(1-x)^5}\\right|_{x=0}", "1796256000", "Read the x^8 coefficient of (1-x)^-5."],
    ["burst-boss2-der-008", "\\left.\\frac{d^{16}}{dx^{16}}\\frac{x^4}{(1+x)^2}\\right|_{x=0}", "271996268544000", "Read the x^12 coefficient of (1+x)^-2."]
  ].forEach(([id, prompt, answer, solution]) => numeric(id, "derivatives", prompt, answer, bossTags([]), solution, 6, 360));

  [
    ["burst-boss3-int-001", "\\int_0^\\infty\\int_0^\\infty x^3y^4e^{-2x-3y}\\,dx\\,dy", "1/27", "Separate the two Gamma-type integrals."],
    ["burst-boss3-int-002", "\\int_0^1\\int_0^1xy^2(\\log x)^2(\\log y)^3\\,dx\\,dy", "-1/54", "Separate variables and use derivatives of 1/(a+1)."],
    ["burst-boss3-int-003", "\\int_0^1\\left(\\log(x(1-x))\\right)^2\\,dx", "8-pi^2/3", "Expand the square and use the log-log beta derivative."],
    ["burst-boss3-int-004", "\\int_0^1\\left(\\log\\frac{x}{1-x}\\right)^2\\,dx", "pi^2/3", "The cross term cancels the elementary log-square pieces."],
    ["burst-boss3-int-005", "\\int_0^\\pi x\\log(\\sin x)\\,dx", "-pi^2*log(2)/2", "Pair x with pi-x and use the Wallis log-sine integral."],
    ["burst-boss3-int-006", "\\int_0^\\pi x^3\\sin x\\,dx", "pi^3-6*pi", "Integrate by parts until only the standard sine moment remains."],
    ["burst-boss3-int-007", "\\int_0^\\pi x^4\\sin x\\,dx", "pi^4-12*pi^2+48", "Repeated IBP reduces the polynomial power."],
    ["burst-boss3-int-008", "\\int_0^\\infty x^3e^{-2x}\\cos(3x)\\,dx", "-714/28561", "Take the real part of 3!/(2-3i)^4."],
    ["burst-boss3-int-009", "\\int_0^\\infty x^3e^{-2x}\\sin(3x)\\,dx", "-720/28561", "Take the imaginary part of 3!/(2-3i)^4."],
    ["burst-boss3-int-010", "\\int_0^\\infty x^4e^{-x}\\cos(2x)\\,dx", "984/3125", "Take the real part of 4!/(1-2i)^5."],
    ["burst-boss3-int-011", "\\int_0^\\infty x^4e^{-x}\\sin(2x)\\,dx", "-912/3125", "Take the imaginary part of 4!/(1-2i)^5."],
    ["burst-boss3-int-012", "\\int_0^\\infty\\frac{x^5}{e^x+1}\\,dx", "31*pi^6/252", "Use the eta factor (1-2^{-5}) Gamma(6) zeta(6)."],
    ["burst-boss3-int-013", "\\int_0^\\infty\\frac{x^3}{e^x+1}\\,dx", "7*pi^4/120", "Use the eta factor (1-2^{-3}) Gamma(4) zeta(4)."]
  ].forEach(([id, prompt, answer, solution]) => numeric(id, "integrals", prompt, answer, bossTags([]), solution, 6, 540));

  [
    ["burst-boss3-lim-001", "\\lim_{n\\to\\infty}n\\sup_{0\\le x\\le1}x^n(1-x)", "1/exp(1)", "Maximize at x=n/(n+1)."],
    ["burst-boss3-lim-002", "\\lim_{n\\to\\infty}n^2\\sup_{0\\le x\\le1}x^n(1-x)^2", "4/exp(2)", "Maximize at x=n/(n+2)."],
    ["burst-boss3-lim-003", "\\lim_{n\\to\\infty}n\\int_0^1\\frac{x^n}{1+x}\\,dx", "1/2", "Only a boundary layer near x=1 contributes."],
    ["burst-boss3-lim-004", "\\lim_{n\\to\\infty}n^2\\left(\\frac1n\\sum_{k=1}^ne^{k/n}-(e-1)-\\frac{e-1}{2n}\\right)", "(e-1)/12", "Use the second Euler-Maclaurin endpoint correction."],
    ["burst-boss3-lim-005", "\\lim_{n\\to\\infty}n^2\\left(\\frac1n\\sum_{k=1}^n\\log\\left(1+\\frac{k}{n}\\right)-(2\\log2-1)-\\frac{\\log2}{2n}\\right)", "-1/24", "Use the second Euler-Maclaurin endpoint correction."],
    ["burst-boss3-lim-006", "\\lim_{n\\to\\infty}n^2\\left(\\frac1n\\sum_{k=1}^n\\frac{1}{1+(k/n)^2}-\\frac\\pi4+\\frac{1}{4n}\\right)", "-1/24", "Use f'(1)-f'(0) for the Riemann-sum correction."],
    ["burst-boss3-lim-007", "\\lim_{x\\to0}\\frac{\\int_0^x\\frac{e^{t^2}-\\cos t}{t^2}\\,dt-\\frac32x}{x^3}", "11/72", "Expand the integrand before integrating."],
    ["burst-boss3-lim-008", "\\lim_{x\\to0}\\frac{\\frac1{x^3}\\int_0^x\\sin(t^2)\\,dt-\\frac13}{x^4}", "-1/42", "Integrate the sine series term by term."],
    ["burst-boss3-lim-009", "\\lim_{x\\to0}\\frac{\\log(\\sin x/x)+x^2/6}{x^4}", "-1/180", "Use the logarithmic sine expansion."],
    ["burst-boss3-lim-010", "\\lim_{x\\to0}\\frac{\\log(\\cosh x)-x^2/2}{x^4}", "-1/12", "Expand log(cosh x)."],
    ["burst-boss3-lim-011", "\\lim_{x\\to0}\\frac{\\sqrt{1+x}-1-x/2+x^2/8}{x^3}", "1/16", "Use the binomial series."],
    ["burst-boss3-lim-012", "\\lim_{x\\to0}\\left(\\frac{x}{\\sin x}\\right)^{1/x^2}", "exp(1/6)", "Take logs and use x/sin x=1+x^2/6+..."]
  ].forEach(([id, prompt, answer, solution]) => numeric(id, "limits", prompt, answer, bossTags([]), solution, 6, 480));

  [
    ["burst-boss3-ser-001", "\\sum_{n=1}^{\\infty}\\frac{n^6}{2^n}", "9366", "Differentiate the geometric series six times."],
    ["burst-boss3-ser-002", "\\sum_{n=1}^{\\infty}\\frac{n^7}{2^n}", "94586", "Differentiate the geometric series seven times."],
    ["burst-boss3-ser-003", "\\sum_{n=1}^{\\infty}\\frac{n^5}{4^n}", "4108/243", "Use the Eulerian polynomial for sum n^5 r^n at r=1/4."],
    ["burst-boss3-ser-004", "\\sum_{n=1}^{\\infty}\\frac{n^6}{3^n}", "1491/4", "Use the Eulerian polynomial for sum n^6 r^n at r=1/3."],
    ["burst-boss3-ser-005", "H_n=\\sum_{k=1}^n\\frac1k.\\ \\text{Find }\\sum_{n=1}^{\\infty}\\frac{H_n}{n2^n}", "pi^2/12", "Integrate the generating function for H_n."],
    ["burst-boss3-ser-006", "\\text{Coefficient of }x^{20}\\text{ in }(\\log(1+x))^2", "275295799/775975200", "Use [x^n](log(1+x))^2=(-1)^n2H_{n-1}/n."],
    ["burst-boss3-ser-007", "\\text{Coefficient of }x^{18}\\text{ in }\\frac{e^{2x}}{(1-x)^3}", "111165691613818/97692469875", "Convolve e^{2x} with the binomial series."],
    ["burst-boss3-ser-008", "\\text{Coefficient of }x^{16}\\text{ in }\\frac{e^{2x}}{(1-x)^4}", "1094053506107/212837625", "Convolve e^{2x} with the binomial series."]
  ].forEach(([id, prompt, answer, solution]) => numeric(id, "series", prompt, answer, bossTags([]), solution, 6, 420));

  [
    ["burst-boss3-param-001", "F(a)=\\int_0^\\infty e^{-ax}\\sin(3x)\\,dx.\\ \\text{Find }F''(a)", "18*(a^2-3)/(a^2+9)^3", "a", "Differentiate 3/(a^2+9) twice."],
    ["burst-boss3-param-002", "G(a)=\\int_0^\\infty x^2e^{-ax}\\cos x\\,dx.\\ \\text{Find }G(a)", "2*(a^3-3*a)/(a^2+1)^3", "a", "Take the real part of 2!/(a-i)^3."],
    ["burst-boss3-param-003", "H(a)=\\int_0^\\infty x^3e^{-ax}\\sin x\\,dx.\\ \\text{Find }H(a)", "24*a*(a^2-1)/(a^2+1)^4", "a", "Take the imaginary part of 3!/(a-i)^4."],
    ["burst-boss3-param-004", "B(a)=\\int_0^1x^a(\\log x)^4\\,dx.\\ \\text{Find }B(a)", "24/(a+1)^5", "a", "Differentiate 1/(a+1) four times."],
    ["burst-boss3-param-005", "C(a)=\\int_0^1x^a(\\log x)^6\\,dx.\\ \\text{Find }C(a)", "720/(a+1)^7", "a", "Differentiate 1/(a+1) six times."],
    ["burst-boss3-param-006", "Q(a)=\\frac{d^3}{da^3}\\int_0^1\\frac{x^a-1}{\\log x}\\,dx.\\ \\text{Find }Q(a)", "2/(a+1)^3", "a", "The integral is log(a+1)."]
  ].forEach(([id, prompt, answer, variable, solution]) => expression(id, "integrals", prompt, answer, variable, bossTags([]), solution, 6, 480));

  [
    ["burst-boss3-anti-001", "\\int x^6e^{-3x}\\,dx", "-exp(-3*x)*(x^6/3+2*x^5/3+10*x^4/9+40*x^3/27+40*x^2/27+80*x/81+80/243)", "Repeated IBP produces the descending factorial polynomial."],
    ["burst-boss3-anti-002", "\\int x^5\\sin(2x)\\,dx", "-x^5*cos(2*x)/2+5*x^4*sin(2*x)/4+5*x^3*cos(2*x)/2-15*x^2*sin(2*x)/4-15*x*cos(2*x)/4+15*sin(2*x)/8", "Repeated IBP alternates sine and cosine."],
    ["burst-boss3-anti-003", "\\int x^5\\cos(2x)\\,dx", "x^5*sin(2*x)/2+5*x^4*cos(2*x)/4-5*x^3*sin(2*x)/2-15*x^2*cos(2*x)/4+15*x*sin(2*x)/4+15*cos(2*x)/8", "Repeated IBP alternates sine and cosine."],
    ["burst-boss3-anti-004", "\\int x^6\\arctan x\\,dx", "x^7*atan(x)/7-x^6/42+x^4/28-x^2/14+log(1+x^2)/14", "After parts, divide x^7 by 1+x^2."],
    ["burst-boss3-anti-005", "\\int x^6\\log(1+x)\\,dx", "x^7*log(1+x)/7-x^7/49+x^6/42-x^5/35+x^4/28-x^3/21+x^2/14-x/7+log(1+x)/7", "After parts, divide x^7 by 1+x."],
    ["burst-boss3-anti-006", "\\int\\frac{x^7}{1+x^2}\\,dx", "x^6/6-x^4/4+x^2/2-log(1+x^2)/2", "Divide x^7 by 1+x^2 before integrating."]
  ].forEach(([id, prompt, answer, solution]) => antiderivative(id, prompt, answer, bossTags([]), solution, 6, 540));

  [
    ["burst-boss3-der-001", "\\left.\\frac{d^{20}}{dx^{20}}(\\log(1+x))^2\\right|_{x=0}", "863130293635276800", "Use [x^n](log(1+x))^2=(-1)^n2H_{n-1}/n."],
    ["burst-boss3-der-002", "\\left.\\frac{d^{18}}{dx^{18}}\\frac{x^4}{(1-x)^7}\\right|_{x=0}", "248156004834017280000", "Read the x^14 coefficient of (1-x)^-7."],
    ["burst-boss3-der-003", "\\left.\\frac{d^{20}}{dx^{20}}\\frac{x^5}{(1-x)^6}\\right|_{x=0}", "37719712734770626560000", "Read the x^15 coefficient of (1-x)^-6."],
    ["burst-boss3-der-004", "\\left.\\frac{d^{16}}{dx^{16}}\\frac{x^3}{(1-x)^8}\\right|_{x=0}", "1621934672117760000", "Read the x^13 coefficient of (1-x)^-8."],
    ["burst-boss3-der-005", "\\left.\\frac{d^{31}}{dx^{31}}\\left(x^7e^{-x^2}\\right)\\right|_{x=0}", "17166620433372086476800000", "Read the x^24 term of e^{-x^2}."],
    ["burst-boss3-der-006", "\\left.\\frac{d^{30}}{dx^{30}}\\left(x^6\\cosh(x^2)\\right)\\right|_{x=0}", "553761949463615692800000", "Read the x^24 term of cosh(x^2)."],
    ["burst-boss3-der-007", "\\left.\\frac{d^{27}}{dx^{27}}\\left(x^5\\sin(x^2)\\right)\\right|_{x=0}", "-272789137666805760000", "Read the x^22 term of sin(x^2)."],
    ["burst-boss3-der-008", "\\left.\\frac{d^{29}}{dx^{29}}\\left(x^5\\cos(x^2)\\right)\\right|_{x=0}", "18458731648787189760000", "Read the x^24 term of cos(x^2)."]
  ].forEach(([id, prompt, answer, solution]) => numeric(id, "derivatives", prompt, answer, bossTags([]), solution, 6, 420));

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
