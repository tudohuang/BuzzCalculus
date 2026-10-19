(function () {
  "use strict";

  const SOURCE = "Buzz 高速反射包 2026";
  const problems = [];
  // 輸入格式說明不是提示（app 已經用 formatHelp 在講），
  // 而且買第二條提示要扣 6+rank×2 分 —— 不能收了分數卻什麼都沒說。
  const HINTS = [
    "Expect a recurrence, Wallis/Beta/Gamma identity, or repeated IBP before direct computation."
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
      rankLabel: rank >= 6 ? "Burst R6" : "Burst R5",
      timeLimit: rank >= 6 ? 330 : 270,
      tabLimit: 1,
      hints: HINTS,
      ...problem,
      tags: Array.from(new Set([
        ...(problem.tags || []),
        "exam-style",
        "exam-depth",
        "burst",
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
    ["burst-int-004", "\\int_0^1x^5\\ln x\\,dx", "-1/36", ["integration-by-parts", "multi-ibp", "parameter-integral", "log"], "Differentiate the beta integral or integrate by parts.", 5],
    ["burst-int-005", "\\int_0^1x^4(\\ln x)^2\\,dx", "2/125", ["multi-ibp", "parameter-integral", "log"], "Use 2!/(5^3).", 6],
    ["burst-int-006", "\\int_0^1x^2(\\ln x)^3\\,dx", "-2/27", ["multi-ibp", "parameter-integral", "log"], "Use -3!/(3^4).", 6],
    ["burst-int-007", "\\int_0^1x^3(1-x)^4\\,dx", "1/280", ["beta-function", "special-function", "definite-integral"], "This is B(4,5).", 5],
    ["burst-int-008", "\\int_0^1\\sqrt{x(1-x)}\\,dx", "pi/8", ["beta-function", "wallis", "special-function", "radical"], "This is B(3/2,3/2).", 6],
    ["burst-int-009", "\\int_0^\\infty x^4e^{-x^2}\\,dx", "3*sqrt(pi)/8", ["gamma-function", "special-function", "improper-integral"], "Set u=x^2 and get one half of Gamma(5/2).", 6],
    ["burst-int-010", "\\int_0^\\infty x^5e^{-x^2}\\,dx", "1", ["gamma-function", "special-function", "substitution", "improper-integral"], "Set u=x^2 and get one half of Gamma(3).", 5],
    ["burst-int-011", "\\int_0^{\\pi/2}\\ln(\\sin x)\\,dx", "-pi*log(2)/2", ["wallis", "special-function", "definite-integral", "log"], "Use Wallis' product or pair with log(cos x).", 6],
    ["burst-int-012", "\\int_0^{\\pi/2}(\\ln(\\sin x))^2\\,dx", "pi*log(2)^2/2+pi^3/24", ["wallis", "special-function", "definite-integral", "log"], "Differentiate the beta integral twice.", 6],
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
    ["burst-int-028", "\\int_0^\\infty\\frac{\\ln x}{1+x^2}\\,dx", "0", ["improper-integral", "kings-property", "log"], "Substitute x=1/u; the integral equals its negative.", 6],
    ["burst-int-029", "\\int_0^\\infty\\frac{\\sqrt{x}}{1+x^2}\\,dx", "pi/sqrt(2)", ["beta-function", "special-function", "improper-integral", "radical"], "Use the standard x^(a-1)/(1+x^b) beta form.", 6],
    ["burst-int-030", "\\int_0^1\\frac{\\ln x}{1+x}\\,dx", "-pi*pi/12", ["series-integral", "special-function", "log"], "Expand 1/(1+x) and integrate termwise.", 6],
    ["burst-int-031", "\\int_0^{\\pi/2}\\sin^4(2x)\\,dx", "3*pi/16", ["trig-power", "wallis", "substitution"], "Set u=2x and use the full-period symmetry.", 5],
    ["burst-int-032", "\\int_0^{\\pi/2}\\sin^6x\\cos^6x\\,dx", "5*pi/2048", ["beta-function", "trig-power", "definite-integral"], "Use one half of B(7/2,7/2).", 6],
    ["burst-int-033", "\\int_0^{\\pi/2}\\sin^{12}x\\,dx", "231*pi/2048", ["wallis", "trig-power", "definite-integral"], "Apply the even Wallis reduction through twelve powers.", 6],
    ["burst-int-034", "\\int_0^{\\pi/2}\\cos^{13}x\\,dx", "1024/3003", ["wallis", "trig-power", "definite-integral"], "Apply the odd Wallis reduction through thirteen powers.", 6],
    ["burst-int-035", "\\int_0^{\\pi/2}\\sin^9x\\cos^5x\\,dx", "1/210", ["beta-function", "trig-power", "definite-integral"], "Use one half of B(5,3).", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => numeric(id, "integrals", prompt, answer, tags, solution, rank, 330));

  [
    ["burst-int-036", "\\int x^3e^{2x}\\,dx", "exp(2*x)*(x^3/2-3*x^2/4+3*x/4-3/8)", ["multi-ibp", "integration-by-parts", "exponential"], "Repeated IBP lowers the power of x each time.", 6],
    ["burst-int-037", "\\int x^2\\sin(3x)\\,dx", "-(x^2)*cos(3*x)/3+2*x*sin(3*x)/9+2*cos(3*x)/27", ["multi-ibp", "integration-by-parts", "trig-integral"], "Integrate by parts twice.", 6],
    ["burst-int-038", "\\int (\\ln x)^3\\,dx", "x*(log(x)^3-3*log(x)^2+6*log(x)-6)", ["multi-ibp", "integration-by-parts", "log"], "Repeated IBP produces the descending log polynomial.", 6],
    ["burst-int-039", "\\int x^4\\ln x\\,dx", "x^5*log(x)/5-x^5/25", ["integration-by-parts", "log"], "One IBP after integrating x^4.", 5],
    ["burst-int-040", "\\int x^3\\arctan x\\,dx", "(x^4-1)*atan(x)/4-x^3/12+x/4", ["integration-by-parts", "inverse-trig", "rational"], "After parts, divide x^4 by 1+x^2.", 6],
    ["burst-int-041", "\\int x^3e^{-x}\\,dx", "-exp(-x)*(x^3+3*x^2+6*x+6)", ["multi-ibp", "integration-by-parts", "exponential"], "Repeated IBP gives the factorial polynomial.", 6],
    ["burst-int-042", "\\int x^2\\ln(1+x)\\,dx", "x^3*log(1+x)/3-x^3/9+x^2/6-x/3+log(1+x)/3", ["integration-by-parts", "log", "rational"], "After parts, divide x^3 by 1+x.", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => antiderivative(id, prompt, answer, tags, solution, rank, 330));

  [
    ["burst-rec-001", "I_n=\\int_0^1x^n\\ln x\\,dx.\\ \\text{Find }I_n", "-1/(n+1)^2", "n", ["recurrence-formula", "parameter-integral", "log"], "Differentiate 1/(n+1) with respect to n.", 6],
    ["burst-rec-002", "I_n=\\int_0^1x^n(\\ln x)^2\\,dx.\\ \\text{Find }I_n", "2/(n+1)^3", "n", ["recurrence-formula", "parameter-integral", "log"], "Differentiate 1/(n+1) twice.", 6],
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
    ["burst-der-006", "\\left.\\frac{d^8}{dx^8}\\ln(1+x)\\right|_{x=0}", "-5040", ["higher-derivative", "super-high-derivative", "taylor", "log"], "The eighth derivative is (-1)^7 7!.", 6],
    ["burst-der-007", "\\left.\\frac{d^{12}}{dx^{12}}\\frac{1}{1-x}\\right|_{x=0}", "479001600", ["higher-derivative", "super-high-derivative", "taylor"], "The x^12 coefficient is 1.", 6],
    ["burst-der-008", "\\left.\\frac{d^{12}}{dx^{12}}(e^x\\cos x)\\right|_{x=0}", "-64", ["higher-derivative", "super-high-derivative", "complex"], "Use the real part of (1+i)^12.", 6],
    ["burst-der-009", "\\left.\\frac{d^{14}}{dx^{14}}(x^4e^{-x})\\right|_{x=0}", "24024", ["higher-derivative", "super-high-derivative", "taylor"], "Read the x^14 coefficient of x^4e^{-x}.", 6],
    ["burst-der-010", "\\left.\\frac{d^9}{dx^9}(e^{2x}\\sin x)\\right|_{x=0}", "-1199", ["higher-derivative", "super-high-derivative", "complex", "exponential", "trig"], "Use the imaginary part of (2+i)^9.", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => numeric(id, "derivatives", prompt, answer, tags, solution, rank, 240));

  [
    ["burst-boss-int-001", "\\int_0^\\infty\\frac{(\\ln x)^2}{1+x^2}\\,dx", "pi^3/8", ["improper-integral", "special-function", "parameter-integral", "log"], "Differentiate pi/2*csc(pi*a/2) twice at a=1.", 6],
    ["burst-boss-int-002", "\\int_0^\\infty\\frac{\\ln x}{1+x^4}\\,dx", "-(pi^2)/(8*sqrt(2))", ["improper-integral", "special-function", "parameter-integral", "log"], "Differentiate pi/4*csc(pi*a/4) at a=1.", 6],
    ["burst-boss-int-003", "\\int_0^\\infty\\frac{\\sqrt{x}\\ln x}{1+x^2}\\,dx", "pi^2/(2*sqrt(2))", ["improper-integral", "beta-function", "parameter-integral", "radical"], "Use the derivative of pi/2*csc(pi*a/2) at a=3/2.", 6],
    ["burst-boss-int-004", "\\int_0^\\infty\\frac{x^4}{1+x^6}\\,dx", "pi/3", ["improper-integral", "beta-function", "rational"], "Use the standard beta integral for x^(a-1)/(1+x^b).", 6],
    ["burst-boss-int-005", "\\int_0^\\infty\\frac{x^2}{1+x^6}\\,dx", "pi/6", ["improper-integral", "beta-function", "rational"], "Use pi/6*csc(pi/2).", 5],
    ["burst-boss-int-006", "\\int_0^\\infty\\frac{1}{1+x^6}\\,dx", "pi/3", ["improper-integral", "beta-function", "rational"], "Use pi/6*csc(pi/6).", 5],
    ["burst-boss-int-007", "\\int_0^\\infty\\frac{x}{1+x^4}\\,dx", "pi/4", ["improper-integral", "beta-function", "rational"], "Use u=x^2, then arctan.", 5],
    ["burst-boss-int-008", "\\int_0^\\infty\\frac{x^2}{1+x^4}\\,dx", "pi/(2*sqrt(2))", ["improper-integral", "beta-function", "rational"], "Use pi/4*csc(3pi/4).", 6],
    ["burst-boss-int-009", "\\int_0^1\\ln x\\ln(1-x)\\,dx", "2-pi^2/6", ["series-integral", "special-function", "log"], "Expand log(1-x) and integrate x^n log x termwise.", 6],
    ["burst-boss-int-010", "\\int_0^1\\frac{\\ln x}{1-x}\\,dx", "-(pi^2)/6", ["series-integral", "improper-integral", "log"], "Expand 1/(1-x) and sum -1/n^2.", 6],
    ["burst-boss-int-011", "\\int_0^1(\\ln x)^4\\,dx", "24", ["gamma-function", "parameter-integral", "log"], "Use (-1)^4*4! from the gamma integral.", 5],
    ["burst-boss-int-012", "\\int_0^1x^3(\\ln x)^4\\,dx", "3/128", ["gamma-function", "parameter-integral", "log"], "Use 4!/4^5.", 6],
    ["burst-boss-int-013", "\\int_0^1x^2(\\ln x)^5\\,dx", "-40/243", ["gamma-function", "parameter-integral", "log"], "Use -5!/3^6.", 6],
    ["burst-boss-int-014", "\\int_0^{\\pi/2}\\ln(\\sin x)\\ln(\\cos x)\\,dx", "pi*log(2)^2/2-pi^3/48", ["wallis", "special-function", "log", "trig-integral"], "Differentiate the beta integral with respect to both exponents.", 6],
    ["burst-boss-int-015", "\\int_0^{\\pi/2}(\\ln(\\tan x))^2\\,dx", "pi^3/8", ["wallis", "special-function", "log", "trig-integral"], "Subtract the log-sine and log-cosine square identities.", 6],
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
    ["burst-boss-anti-005", "\\int x^4(\\ln x)^2\\,dx", "x^5*(log(x)^2/5-2*log(x)/25+2/125)", ["multi-ibp", "integration-by-parts", "log"], "IBP lowers the power of log x twice.", 6],
    ["burst-boss-anti-006", "\\int(\\ln x)^4\\,dx", "x*(log(x)^4-4*log(x)^3+12*log(x)^2-24*log(x)+24)", ["multi-ibp", "integration-by-parts", "log"], "The descending log polynomial follows from repeated IBP.", 6],
    ["burst-boss-anti-007", "\\int x^2\\arctan x\\,dx", "x^3*atan(x)/3-x^2/6+log(1+x^2)/6", ["integration-by-parts", "inverse-trig", "rational"], "After IBP, divide x^3 by 1+x^2.", 5],
    ["burst-boss-anti-008", "\\int x^4\\arctan x\\,dx", "x^5*atan(x)/5-x^4/20+x^2/10-log(1+x^2)/10", ["integration-by-parts", "inverse-trig", "rational"], "After IBP, divide x^5 by 1+x^2.", 6],
    ["burst-boss-anti-009", "\\int x^2\\ln(1+x^2)\\,dx", "x^3*log(1+x^2)/3-2*x^3/9+2*x/3-2*atan(x)/3", ["integration-by-parts", "log", "inverse-trig"], "After IBP, reduce x^4/(1+x^2).", 6],
    ["burst-boss-anti-010", "\\int x^3\\ln(1+x^2)\\,dx", "x^4*log(1+x^2)/4-x^4/8+x^2/4-log(1+x^2)/4", ["integration-by-parts", "log", "rational"], "After IBP, reduce x^5/(1+x^2).", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => antiderivative(id, prompt, answer, bossTags(tags), solution, rank, rank >= 6 ? 420 : 330));

  [
    ["burst-boss-param-001", "I(a)=\\int_0^\\infty e^{-ax}\\sin x\\,dx.\\ \\text{Find }I(a)", "1/(a^2+1)", "a", ["parameter-integral", "laplace-transform", "trig-integral"], "Use the imaginary part of 1/(a-i).", 6],
    ["burst-boss-param-002", "I(a)=\\int_0^\\infty xe^{-ax}\\,dx.\\ \\text{Find }I(a)", "1/a^2", "a", ["parameter-integral", "gamma-function", "improper-integral"], "Differentiate the Laplace integral of e^{-ax}.", 5],
    ["burst-boss-param-003", "I(a)=\\int_0^\\infty\\frac{1}{1+a x^2}\\,dx.\\ \\text{Find }I(a)", "pi/(2*sqrt(a))", "a", ["parameter-integral", "improper-integral", "substitution"], "Set u=sqrt(a)x.", 5],
    ["burst-boss-param-004", "I(a)=\\int_0^{\\pi/2}\\ln(1+a\\sin^2x)\\,dx.\\ \\text{Find }I(a)", "pi*log((1+sqrt(1+a))/2)", "a", ["parameter-integral", "wallis", "special-function", "log"], "Differentiate in a, integrate the rational trig form, then use I(0)=0.", 6],
    ["burst-boss-param-005", "J_n=\\int_0^\\infty\\frac{x^n}{1+x^2}\\,dx\\ \\text{for }-1<n<1.\\ \\text{Find }J_n", "pi/(2*sin(pi*(n+1)/2))", "n", ["parameter-integral", "beta-function", "improper-integral"], "Use the beta form for x^(a-1)/(1+x^2) with a=n+1.", 6],
    ["burst-boss-param-006", "K_n=\\int_0^1x^n(\\ln x)^3\\,dx.\\ \\text{Find }K_n", "-6/(n+1)^4", "n", ["recurrence-formula", "parameter-integral", "log"], "Differentiate 1/(n+1) three times.", 6]
  ].forEach(([id, prompt, answer, variable, tags, solution, rank]) => expression(id, "integrals", prompt, answer, variable, bossTags(tags), solution, rank, rank >= 6 ? 360 : 300));

  [
    ["burst-boss-lim-001", "\\lim_{x\\to0}\\frac{\\tan x-x-x^3/3}{x^5}", "2/15", ["taylor", "nested-taylor", "hard-limit"], "Use tan x=x+x^3/3+2x^5/15+...", 5],
    ["burst-boss-lim-002", "\\lim_{x\\to0}\\frac{\\sin x-x+x^3/6}{x^5}", "1/120", ["taylor", "hard-limit"], "Use the fifth-order term of sin x.", 5],
    ["burst-boss-lim-003", "\\lim_{x\\to0}\\frac{\\ln(1+x)-x+x^2/2-x^3/3}{x^4}", "-1/4", ["taylor", "hard-limit", "log"], "Use the fourth-order term of log(1+x).", 5],
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
    ["burst-boss-ser-005", "\\text{Coefficient of }x^6\\text{ in }(\\ln(1+x))^2", "137/180", ["taylor", "coefficient", "log"], "The coefficient is 2H_5/6.", 6],
    ["burst-boss-ser-006", "\\text{Coefficient of }x^8\\text{ in }\\frac{x^2e^{3x}}{1-x}", "1553/80", ["taylor", "coefficient", "generating-function"], "Collect the x^6 coefficient of e^{3x}/(1-x).", 6]
  ].forEach(([id, prompt, answer, tags, solution, rank]) => numeric(id, "series", prompt, answer, bossTags(tags), solution, rank, rank >= 6 ? 300 : 240));

  [
    ["burst-boss-der-001", "\\left.\\frac{d^{12}}{dx^{12}}(\\ln(1+x))^2\\right|_{x=0}", "241087680", ["higher-derivative", "super-high-derivative", "taylor", "log"], "Use [x^n](log(1+x))^2=(-1)^n*2H_{n-1}/n.", 6],
    ["burst-boss-der-002", "\\left.\\frac{d^{11}}{dx^{11}}(\\ln(1+x))^2\\right|_{x=0}", "-21257280", ["higher-derivative", "super-high-derivative", "taylor", "log"], "Use [x^n](log(1+x))^2=(-1)^n*2H_{n-1}/n.", 6],
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
    ["burst-boss2-int-001", "\\int_0^\\infty\\frac{\\ln x}{1+x^3}\\,dx", "-(2*pi^2)/27", "Differentiate the beta integral pi/3*csc(pi*a/3) at a=1."],
    ["burst-boss2-int-002", "\\int_0^\\infty\\frac{(\\ln x)^2}{1+x^3}\\,dx", "10*pi^3/(81*sqrt(3))", "Differentiate pi/3*csc(pi*a/3) twice at a=1."],
    ["burst-boss2-int-003", "\\int_0^\\infty\\frac{\\sqrt{x}}{1+x^3}\\,dx", "pi/3", "Use the beta form with a=3/2 and b=3."],
    ["burst-boss2-int-004", "\\int_0^\\infty\\frac{x^{1/3}}{1+x^2}\\,dx", "pi/sqrt(3)", "Use the beta form with a=4/3 and b=2."],
    ["burst-boss2-int-005", "\\int_0^\\infty\\frac{\\arctan x}{x(1+x^2)}\\,dx", "pi*log(2)/2", "Set x=tan t and integrate t cot t by parts."],
    ["burst-boss2-int-006", "\\int_0^\\infty\\left(\\frac{\\sin x}{x}\\right)^2\\,dx", "pi/2", "Use the Fourier/Dirichlet kernel identity."],
    ["burst-boss2-int-007", "\\int_0^\\infty\\frac{1-\\cos x}{x^2}\\,dx", "pi/2", "Integrate by parts and use the Dirichlet integral."],
    ["burst-boss2-int-008", "\\int_0^1\\frac{(\\ln x)^3}{1-x}\\,dx", "-pi^4/15", "Expand 1/(1-x) and sum zeta(4)."],
    ["burst-boss2-int-009", "\\int_0^1\\frac{(\\ln x)^5}{1-x}\\,dx", "-8*pi^6/63", "Expand 1/(1-x) and sum zeta(6)."],
    ["burst-boss2-int-010", "\\int_0^1\\frac{(\\ln x)^3}{1+x}\\,dx", "-7*pi^4/120", "Expand 1/(1+x) and use eta(4)."],
    ["burst-boss2-int-011", "\\int_0^1\\frac{(\\ln x)^5}{1+x}\\,dx", "-31*pi^6/252", "Expand 1/(1+x) and use eta(6)."],
    ["burst-boss2-int-012", "\\int_0^{\\pi/2}x\\sin^2x\\,dx", "pi^2/16+1/4", "Write sin^2 x=(1-cos 2x)/2."],
    ["burst-boss2-int-013", "\\int_0^{\\pi/2}x\\sin x\\cos x\\,dx", "pi/8", "Use sin x cos x=sin 2x/2."],
    ["burst-boss2-int-014", "\\int_0^\\pi x^2\\sin x\\,dx", "pi^2-4", "Integrate by parts twice."]
  ].forEach(([id, prompt, answer, solution]) => numeric(id, "integrals", prompt, answer, bossTags([]), solution, 6, 480));

  [
    ["burst-boss2-lim-001", "\\lim_{x\\to0}\\left(\\frac{\\sin x}{x}\\right)^{1/x^2}", "exp(-1/6)", "Take logs and use log(sin x/x)=-x^2/6+..."],
    ["burst-boss2-lim-002", "\\lim_{x\\to0}\\frac{x/\\tan x-1+x^2/3}{x^4}", "-1/45", "Use x/tan x=1-x^2/3-x^4/45+..."],
    ["burst-boss2-lim-003", "\\lim_{x\\to0}\\frac{1/\\sin x-1/x-x/6}{x^3}", "7/360", "Use the Laurent expansion of csc x."],
    ["burst-boss2-lim-004", "\\lim_{x\\to0}\\frac{\\ln(\\cos x)+x^2/2}{x^4}", "-1/12", "Expand log(cos x) through the fourth order."],
    ["burst-boss2-lim-005", "\\lim_{x\\to0}\\frac{\\int_0^x e^{-t^2}\\,dt-x+x^3/3}{x^5}", "1/10", "Integrate the series for e^{-t^2} term by term."],
    ["burst-boss2-lim-006", "\\lim_{x\\to0}\\frac{\\int_0^x\\ln(1+t^2)\\,dt-x^3/3+x^5/10}{x^7}", "1/21", "Integrate the series for log(1+t^2) term by term."],
    ["burst-boss2-lim-007", "\\lim_{n\\to\\infty}n\\left(\\sum_{k=1}^n\\frac{1}{n+k}-\\ln 2\\right)", "-1/4", "Use the Euler-Maclaurin correction for H_{2n}-H_n."],
    ["burst-boss2-lim-008", "\\lim_{n\\to\\infty}n^2\\left(\\sum_{k=1}^n\\frac{1}{n^2+k^2}-\\frac{\\pi}{4n}\\right)", "-1/4", "Read the first endpoint correction in the Riemann sum."],
    ["burst-boss2-lim-009", "\\lim_{n\\to\\infty}n\\left(\\sum_{k=1}^n\\frac{1}{\\sqrt{n^2+k^2}}-\\ln(1+\\sqrt2)\\right)", "(1/sqrt(2)-1)/2", "Apply the first Euler-Maclaurin correction."],
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
    ["burst-boss2-param-005", "F(a)=\\int_0^1\\frac{x^a-1}{\\ln x}\\,dx.\\ \\text{Find }F(a)", "log(a+1)", "a", "Differentiate with respect to a, then use F(0)=0."],
    ["burst-boss2-param-006", "F(a)=\\int_0^1x^a(\\ln x)^5\\,dx.\\ \\text{Find }F(a)", "-120/(a+1)^6", "a", "Differentiate 1/(a+1) five times."]
  ].forEach(([id, prompt, answer, variable, solution]) => expression(id, "integrals", prompt, answer, variable, bossTags([]), solution, 6, 420));

  [
    ["burst-boss2-anti-001", "\\int x^5e^{2x}\\,dx", "exp(2*x)*(x^5/2-5*x^4/4+5*x^3/2-15*x^2/4+15*x/4-15/8)", "Repeated IBP produces the factorial polynomial."],
    ["burst-boss2-anti-002", "\\int x^4\\sin x\\,dx", "-(x^4)*cos(x)+4*x^3*sin(x)+12*x^2*cos(x)-24*x*sin(x)-24*cos(x)", "Integrate by parts until the polynomial disappears."],
    ["burst-boss2-anti-003", "\\int x^4\\cos x\\,dx", "x^4*sin(x)+4*x^3*cos(x)-12*x^2*sin(x)-24*x*cos(x)+24*sin(x)", "Integrate by parts until the polynomial disappears."],
    ["burst-boss2-anti-004", "\\int(\\ln x)^5\\,dx", "x*(log(x)^5-5*log(x)^4+20*log(x)^3-60*log(x)^2+120*log(x)-120)", "Repeated IBP lowers the log power."],
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
    ["burst-boss3-int-002", "\\int_0^1\\int_0^1xy^2(\\ln x)^2(\\ln y)^3\\,dx\\,dy", "-1/54", "Separate variables and use derivatives of 1/(a+1)."],
    ["burst-boss3-int-003", "\\int_0^1\\left(\\ln(x(1-x))\\right)^2\\,dx", "8-pi^2/3", "Expand the square and use the log-log beta derivative."],
    ["burst-boss3-int-004", "\\int_0^1\\left(\\ln\\frac{x}{1-x}\\right)^2\\,dx", "pi^2/3", "The cross term cancels the elementary log-square pieces."],
    ["burst-boss3-int-005", "\\int_0^\\pi x\\ln(\\sin x)\\,dx", "-pi^2*log(2)/2", "Pair x with pi-x and use the Wallis log-sine integral."],
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
    ["burst-boss3-lim-005", "\\lim_{n\\to\\infty}n^2\\left(\\frac1n\\sum_{k=1}^n\\ln\\left(1+\\frac{k}{n}\\right)-(2\\ln2-1)-\\frac{\\ln2}{2n}\\right)", "-1/24", "Use the second Euler-Maclaurin endpoint correction."],
    ["burst-boss3-lim-006", "\\lim_{n\\to\\infty}n^2\\left(\\frac1n\\sum_{k=1}^n\\frac{1}{1+(k/n)^2}-\\frac\\pi4+\\frac{1}{4n}\\right)", "-1/24", "Use f'(1)-f'(0) for the Riemann-sum correction."],
    ["burst-boss3-lim-007", "\\lim_{x\\to0}\\frac{\\int_0^x\\frac{e^{t^2}-\\cos t}{t^2}\\,dt-\\frac32x}{x^3}", "11/72", "Expand the integrand before integrating."],
    ["burst-boss3-lim-008", "\\lim_{x\\to0}\\frac{\\frac1{x^3}\\int_0^x\\sin(t^2)\\,dt-\\frac13}{x^4}", "-1/42", "Integrate the sine series term by term."],
    ["burst-boss3-lim-009", "\\lim_{x\\to0}\\frac{\\ln(\\sin x/x)+x^2/6}{x^4}", "-1/180", "Use the logarithmic sine expansion."],
    ["burst-boss3-lim-010", "\\lim_{x\\to0}\\frac{\\ln(\\cosh x)-x^2/2}{x^4}", "-1/12", "Expand log(cosh x)."],
    ["burst-boss3-lim-011", "\\lim_{x\\to0}\\frac{\\sqrt{1+x}-1-x/2+x^2/8}{x^3}", "1/16", "Use the binomial series."],
    ["burst-boss3-lim-012", "\\lim_{x\\to0}\\left(\\frac{x}{\\sin x}\\right)^{1/x^2}", "exp(1/6)", "Take logs and use x/sin x=1+x^2/6+..."]
  ].forEach(([id, prompt, answer, solution]) => numeric(id, "limits", prompt, answer, bossTags([]), solution, 6, 480));

  [
    ["burst-boss3-ser-001", "\\sum_{n=1}^{\\infty}\\frac{n^6}{2^n}", "9366", "Differentiate the geometric series six times."],
    ["burst-boss3-ser-002", "\\sum_{n=1}^{\\infty}\\frac{n^7}{2^n}", "94586", "Differentiate the geometric series seven times."],
    ["burst-boss3-ser-003", "\\sum_{n=1}^{\\infty}\\frac{n^5}{4^n}", "4108/243", "Use the Eulerian polynomial for sum n^5 r^n at r=1/4."],
    ["burst-boss3-ser-004", "\\sum_{n=1}^{\\infty}\\frac{n^6}{3^n}", "1491/4", "Use the Eulerian polynomial for sum n^6 r^n at r=1/3."],
    ["burst-boss3-ser-005", "H_n=\\sum_{k=1}^n\\frac1k.\\ \\text{Find }\\sum_{n=1}^{\\infty}\\frac{H_n}{n2^n}", "pi^2/12", "Integrate the generating function for H_n."],
    ["burst-boss3-ser-006", "\\text{Coefficient of }x^{20}\\text{ in }(\\ln(1+x))^2", "275295799/775975200", "Use [x^n](log(1+x))^2=(-1)^n2H_{n-1}/n."],
    ["burst-boss3-ser-007", "\\text{Coefficient of }x^{18}\\text{ in }\\frac{e^{2x}}{(1-x)^3}", "111165691613818/97692469875", "Convolve e^{2x} with the binomial series."],
    ["burst-boss3-ser-008", "\\text{Coefficient of }x^{16}\\text{ in }\\frac{e^{2x}}{(1-x)^4}", "1094053506107/212837625", "Convolve e^{2x} with the binomial series."]
  ].forEach(([id, prompt, answer, solution]) => numeric(id, "series", prompt, answer, bossTags([]), solution, 6, 420));

  [
    ["burst-boss3-param-001", "F(a)=\\int_0^\\infty e^{-ax}\\sin(3x)\\,dx.\\ \\text{Find }F''(a)", "18*(a^2-3)/(a^2+9)^3", "a", "Differentiate 3/(a^2+9) twice."],
    ["burst-boss3-param-002", "G(a)=\\int_0^\\infty x^2e^{-ax}\\cos x\\,dx.\\ \\text{Find }G(a)", "2*(a^3-3*a)/(a^2+1)^3", "a", "Take the real part of 2!/(a-i)^3."],
    ["burst-boss3-param-003", "H(a)=\\int_0^\\infty x^3e^{-ax}\\sin x\\,dx.\\ \\text{Find }H(a)", "24*a*(a^2-1)/(a^2+1)^4", "a", "Take the imaginary part of 3!/(a-i)^4."],
    ["burst-boss3-param-004", "B(a)=\\int_0^1x^a(\\ln x)^4\\,dx.\\ \\text{Find }B(a)", "24/(a+1)^5", "a", "Differentiate 1/(a+1) four times."],
    ["burst-boss3-param-005", "C(a)=\\int_0^1x^a(\\ln x)^6\\,dx.\\ \\text{Find }C(a)", "720/(a+1)^7", "a", "Differentiate 1/(a+1) six times."],
    ["burst-boss3-param-006", "Q(a)=\\frac{d^3}{da^3}\\int_0^1\\frac{x^a-1}{\\ln x}\\,dx.\\ \\text{Find }Q(a)", "2/(a+1)^3", "a", "The integral is log(a+1)."]
  ].forEach(([id, prompt, answer, variable, solution]) => expression(id, "integrals", prompt, answer, variable, bossTags([]), solution, 6, 480));

  [
    ["burst-boss3-anti-001", "\\int x^6e^{-3x}\\,dx", "-exp(-3*x)*(x^6/3+2*x^5/3+10*x^4/9+40*x^3/27+40*x^2/27+80*x/81+80/243)", "Repeated IBP produces the descending factorial polynomial."],
    ["burst-boss3-anti-002", "\\int x^5\\sin(2x)\\,dx", "-x^5*cos(2*x)/2+5*x^4*sin(2*x)/4+5*x^3*cos(2*x)/2-15*x^2*sin(2*x)/4-15*x*cos(2*x)/4+15*sin(2*x)/8", "Repeated IBP alternates sine and cosine."],
    ["burst-boss3-anti-003", "\\int x^5\\cos(2x)\\,dx", "x^5*sin(2*x)/2+5*x^4*cos(2*x)/4-5*x^3*sin(2*x)/2-15*x^2*cos(2*x)/4+15*x*sin(2*x)/4+15*cos(2*x)/8", "Repeated IBP alternates sine and cosine."],
    ["burst-boss3-anti-004", "\\int x^6\\arctan x\\,dx", "x^7*atan(x)/7-x^6/42+x^4/28-x^2/14+log(1+x^2)/14", "After parts, divide x^7 by 1+x^2."],
    ["burst-boss3-anti-005", "\\int x^6\\ln(1+x)\\,dx", "x^7*log(1+x)/7-x^7/49+x^6/42-x^5/35+x^4/28-x^3/21+x^2/14-x/7+log(1+x)/7", "After parts, divide x^7 by 1+x."],
    ["burst-boss3-anti-006", "\\int\\frac{x^7}{1+x^2}\\,dx", "x^6/6-x^4/4+x^2/2-log(1+x^2)/2", "Divide x^7 by 1+x^2 before integrating."]
  ].forEach(([id, prompt, answer, solution]) => antiderivative(id, prompt, answer, bossTags([]), solution, 6, 540));

  [
    ["burst-boss3-der-001", "\\left.\\frac{d^{20}}{dx^{20}}(\\ln(1+x))^2\\right|_{x=0}", "863130293635276800", "Use [x^n](log(1+x))^2=(-1)^n2H_{n-1}/n."],
    ["burst-boss3-der-002", "\\left.\\frac{d^{18}}{dx^{18}}\\frac{x^4}{(1-x)^7}\\right|_{x=0}", "248156004834017280000", "Read the x^14 coefficient of (1-x)^-7."],
    ["burst-boss3-der-003", "\\left.\\frac{d^{20}}{dx^{20}}\\frac{x^5}{(1-x)^6}\\right|_{x=0}", "37719712734770626560000", "Read the x^15 coefficient of (1-x)^-6."],
    ["burst-boss3-der-004", "\\left.\\frac{d^{16}}{dx^{16}}\\frac{x^3}{(1-x)^8}\\right|_{x=0}", "1621934672117760000", "Read the x^13 coefficient of (1-x)^-8."],
    ["burst-boss3-der-005", "\\left.\\frac{d^{31}}{dx^{31}}\\left(x^7e^{-x^2}\\right)\\right|_{x=0}", "17166620433372086476800000", "Read the x^24 term of e^{-x^2}."],
    ["burst-boss3-der-006", "\\left.\\frac{d^{30}}{dx^{30}}\\left(x^6\\cosh(x^2)\\right)\\right|_{x=0}", "553761949463615692800000", "Read the x^24 term of cosh(x^2)."],
    ["burst-boss3-der-007", "\\left.\\frac{d^{27}}{dx^{27}}\\left(x^5\\sin(x^2)\\right)\\right|_{x=0}", "-272789137666805760000", "Read the x^22 term of sin(x^2)."],
    ["burst-boss3-der-008", "\\left.\\frac{d^{29}}{dx^{29}}\\left(x^5\\cos(x^2)\\right)\\right|_{x=0}", "18458731648787189760000", "Read the x^24 term of cos(x^2)."]
  ].forEach(([id, prompt, answer, solution]) => numeric(id, "derivatives", prompt, answer, bossTags([]), solution, 6, 420));

  // ---- 獨立驗算規格（tools/verify_answers.js 讀）----
  // 題幹的寫法自動辨識器接不到；這裡把題幹重述成數值路徑（數值偏導、數值積分、
  // 複數求值、圍道上的梯形法），不重複解題的推導、也不把答案抄一遍。
  const VERIFY = {
    // 遞迴式 J_n = e + c·J_{n−1} 裡的 c：對幾個具體的 n 把 J_n、J_{n−1} 直接數值積出來再解 c
    "burst-rec-008": { m: "fn", vars: ["n"], cases: [2, 3, 5].map((n) => ({ at: { n }, v: { m: "value", f: `\\frac{\\int_0^1 x^{${n}}e^x\\,dx-e}{\\int_0^1 x^{${n - 1}}e^x\\,dx}` } })) }
  };
  problems.forEach((problem) => {
    if (VERIFY[problem.id]) problem.verify = VERIFY[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

(function () {
  "use strict";
  // 課程缺口補題（12B 實數、12C 數列嚴格化）：上下界、最大元、sup／inf 的 ε 判準、完備性、阿基米德、
  // 量詞與否定、極限定律的反例、單調收斂的前提、Cauchy、子數列與上下極限 —— 概念全部問成算得出來的數或可被反例否定的選項。
  const SOURCE = "Buzz course gap fill";

  // 驗算路徑的簡寫（全部是從題幹重述的數值路徑）
  const SUP = (f) => ({ m: "extremeOf", f, kind: "sup" });
  const INF = (f) => ({ m: "extremeOf", f, kind: "inf" });
  const LSUP = (f) => ({ m: "limsup", f, kind: "limsup" });
  const LINF = (f) => ({ m: "limsup", f, kind: "liminf" });
  const LIM = (f) => ({ m: "seqLimit", f });
  // 趨近 0 的多項式速率數列 seqLimit 外插會失敗，改走連續變數的極限
  const LIMX = (f) => ({ m: "limit", f, at: "inf", v: "n" });
  const XINF = (f, range) => ({ m: "extremeOf", f, kind: "inf", integer: false, range });

  const problems = [
    /* ── 12.7 上界與下界 ── */
    { id: "cg-12b-001", topic: "limits", rank: 1, answerKind: "text",
      prompt: "S=\\left\\{\\frac{3n}{n+2}:n\\in\\mathbb{N}\\right\\}\\quad\\text{下列哪一個數是 }S\\text{ 的上界？}",
      answers: ["10"], canonical: "10", distractors: ["2.99", "2"], timeLimit: 60,
      tags: ["bounds-find-upper", "supremum", "sequence"],
      hints: ["把 3n/(n+2) 寫成 3 − 6/(n+2)，看它會不會超過某個數。", "上界只要「不小於每一個元素」就好，不必是最小的，也不必在 S 裡。"],
      solution: "3n/(n+2) = 3 − 6/(n+2) < 3，所以任何 ≥ 3 的數都是上界，10 也是。2.99 不是：n 夠大時 aₙ > 2.99；2 也不是：a₄ = 2、a₅ = 15/7 > 2。",
      solutionSteps: ["aₙ = 3n/(n+2) = 3 − 6/(n+2) < 3，而且越來越靠近 3。", "n = 598 時 aₙ = 1794/600 = 2.99，再往後就超過 2.99；a₅ = 15/7 > 2。", "10 ≥ 3 > 每一個 aₙ，所以 10 是上界。"],
      verify: { m: "choice", options: [
        { say: "10", all: [{ v: SUP("\\frac{3n}{n+2}"), le: 10 }] },
        { say: "2.99", all: [{ v: SUP("\\frac{3n}{n+2}"), le: 2.99 }] },
        { say: "2", all: [{ v: SUP("\\frac{3n}{n+2}"), le: 2 }] }
      ] } },
    { id: "cg-12b-002", topic: "limits", rank: 2, answerKind: "text",
      prompt: "S=\\left\\{\\frac{(-1)^n}{n}:n\\in\\mathbb{N}\\right\\}\\quad\\text{下列哪一個數是 }S\\text{ 的下界？}",
      answers: ["-1"], canonical: "-1", distractors: ["0", "-1/2"], timeLimit: 70,
      tags: ["bounds-find-upper", "infimum", "sequence"],
      hints: ["先把前幾個元素寫出來：n = 1, 2, 3, 4。", "下界要不大於「每一個」元素，連最小的那一個也要。"],
      solution: "元素是 −1, 1/2, −1/3, 1/4, …，最小的是 a₁ = −1。所以 −1 是下界（而且屬於 S）；0 與 −1/2 都比 −1 大，不是下界。",
      solutionSteps: ["奇數項 −1/n ≥ −1，偶數項 1/n > 0。", "a₁ = −1 < −1/2 < 0，所以 0 和 −1/2 都被 a₁ 否決。", "每一項都 ≥ −1，所以 −1 是下界。"],
      verify: { m: "choice", options: [
        { say: "-1", all: [{ v: INF("\\frac{(-1)^n}{n}"), ge: -1 }] },
        { say: "0", all: [{ v: INF("\\frac{(-1)^n}{n}"), ge: 0 }] },
        { say: "-1/2", all: [{ v: INF("\\frac{(-1)^n}{n}"), ge: -0.5 }] }
      ] } },
    { id: "cg-12b-003", topic: "limits", rank: 2, answerKind: "text",
      prompt: "S=\\left\\{1-\\frac{1}{n^2}:n\\in\\mathbb{N}\\right\\}\\quad\\text{1 是不是 }S\\text{ 的上界？}",
      answers: ["是"], canonical: "是", distractors: ["不是，因為 1 不在 S 裡", "不是，因為 S 沒有最大元"], timeLimit: 60,
      tags: ["bounds-find-upper", "supremum", "sequence"],
      hints: ["上界的定義只要求：對每一個 x ∈ S，x ≤ M。", "定義裡有沒有要求 M 屬於 S？"],
      solution: "每一項 1 − 1/n² < 1，所以 1 是上界。上界不必屬於集合；S 沒有最大元也不影響 1 是上界（事實上 1 就是 sup S）。",
      solutionSteps: ["1 − 1/n² < 1 對所有 n 成立。", "上界的定義只看「x ≤ M 對所有 x ∈ S」，不要求 M ∈ S。", "所以 1 是 S 的上界。"],
      verify: { m: "choice", options: [
        { say: "是", all: [{ v: SUP("1-\\frac{1}{n^2}"), le: 1 }] },
        { say: "不是，因為 1 不在 S 裡", all: [{ v: SUP("1-\\frac{1}{n^2}"), gt: 1 }] },
        { say: "不是，因為 S 沒有最大元", all: [{ v: SUP("1-\\frac{1}{n^2}"), gt: 1 }] }
      ] } },
    { id: "cg-12b-004", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "a_n=\\frac{n^2}{n+1}\\text{ 沒有上界。要讓 }a_n>100\\text{，最小的正整數 }n\\text{ 是多少？}",
      answer: "101", timeLimit: 90,
      tags: ["bounds-prove-unbounded", "sequence"],
      hints: ["n²/(n+1) > 100 ⇔ n² − 100n − 100 > 0。", "解二次不等式的正根，再往上取整數；記得把邊界那個 n 代回去檢查。"],
      solution: "n² − 100n − 100 > 0 的正根是 50 + √2600 ≈ 100.99。n = 100：10000/101 ≈ 99.01；n = 101：10201/102 ≈ 100.01 > 100。",
      solutionSteps: ["n²/(n+1) > 100 ⇔ n² − 100n − 100 > 0。", "正根 50 + √2600 ≈ 100.99，所以 n ≥ 101。", "檢查：a₁₀₀ ≈ 99.01，a₁₀₁ ≈ 100.01，最小的 n = 101。"],
      verify: { m: "firstIndex", f: "-\\frac{n^2}{n+1}", below: -100 } },
    { id: "cg-12b-005", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "H_n=1+\\frac{1}{2}+\\cdots+\\frac{1}{n}\\text{ 沒有上界。要讓 }H_n>4\\text{，最小的正整數 }n\\text{ 是多少？}",
      answer: "31", timeLimit: 150,
      tags: ["bounds-prove-unbounded", "sequence", "harmonic-series"],
      hints: ["H_n ≈ ln n + 0.5772，先估 n 大約在哪裡。", "估完之後在附近逐項加，確認跨過 4 的是哪一項。"],
      solution: "H_n ≈ ln n + 0.5772 > 4 ⇒ ln n > 3.42 ⇒ n ≈ 30.7。實際加：H₃₀ ≈ 3.9950，H₃₁ ≈ 4.0272。最小的 n = 31。",
      solutionSteps: ["H_n ≈ ln n + γ（γ ≈ 0.5772），要 ln n > 3.4228，n > 30.6 左右。", "H₃₀ ≈ 3.9950 < 4。", "H₃₁ = H₃₀ + 1/31 ≈ 4.0272 > 4，所以 n = 31。"],
      verify: { m: "firstIndex", f: "-\\sum_{k=1}^{n}\\frac{1}{k}", below: -4 } },
    { id: "cg-12b-006", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "f(x)=\\frac{x}{4+x^2}\\quad\\text{求 }|f(x)|\\text{ 在 }\\mathbb{R}\\text{ 上的最小上界 }\\sup_{x\\in\\mathbb{R}}|f(x)|",
      answer: "1/4", timeLimit: 90,
      tags: ["bounds-function-bound", "supremum", "am-gm"],
      hints: ["x ≠ 0 時把分子分母同除以 |x|：|f| = 1/(4/|x| + |x|)。", "4/|x| + |x| 的最小值用算幾不等式。"],
      solution: "|f| = 1/(4/|x| + |x|)，而 4/|x| + |x| ≥ 2√4 = 4，等號在 |x| = 2。所以 |f| ≤ 1/4，在 x = ±2 取到，sup|f| = 1/4。",
      solutionSteps: ["x = 0 時 f = 0；x ≠ 0 時 |f(x)| = 1/(4/|x| + |x|)。", "算幾：4/|x| + |x| ≥ 4，等號在 |x| = 2。", "|f(x)| ≤ 1/4，x = 2 時 f = 2/8 = 1/4，所以 sup|f| = 1/4。"],
      verify: { m: "extremeOf", f: "\\left|\\frac{x}{4+x^2}\\right|", kind: "sup", integer: false, range: [-1000, 1000] } },
    { id: "cg-12b-007", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "f(x)=\\frac{\\sin x}{3+\\cos x}\\quad\\text{求 }\\sup_{x\\in\\mathbb{R}}|f(x)|",
      answer: "sqrt(2)/4", timeLimit: 150,
      tags: ["bounds-function-bound", "supremum", "trig"],
      hints: ["粗估：|sin x| ≤ 1、3 + cos x ≥ 2，得到一個上界，但它不是最小的。", "要最小上界就對 f 微分，令 f′ = 0 解 cos x。"],
      solution: "f′ = (3cos x + 1)/(3+cos x)²，臨界點 cos x = −1/3，此時 |sin x| = 2√2/3，|f| = (2√2/3)/(8/3) = √2/4 ≈ 0.354。粗估的 1/2 是上界但不是最小的。",
      solutionSteps: ["f′(x) = (cos x(3+cos x) + sin²x)/(3+cos x)² = (3cos x + 1)/(3+cos x)²。", "f′ = 0 ⇔ cos x = −1/3，|sin x| = 2√2/3。", "|f| = (2√2/3)/(3 − 1/3) = √2/4 ≈ 0.354。"],
      verify: { m: "extremeOf", f: "\\left|\\frac{\\sin x}{3+\\cos x}\\right|", kind: "sup", integer: false, range: [-7, 7] } },

    /* ── 12.8 最大值與最小值 ── */
    { id: "cg-12b-008", topic: "limits", rank: 2, answerKind: "text",
      prompt: "S=\\left\\{\\frac{2n-1}{n+1}:n\\in\\mathbb{N}\\right\\}\\quad\\text{S 有沒有最大元？}",
      answers: ["沒有最大元"], canonical: "沒有最大元", distractors: ["有，最大元是 2", "有，最大元是 1/2"], timeLimit: 80,
      tags: ["maxmin-verify-two-conditions", "supremum", "sequence"],
      hints: ["最大元要同時滿足兩件事：是上界，而且屬於 S。", "把 (2n−1)/(n+1) 寫成 2 − 3/(n+1)，看 2 有沒有被取到。"],
      solution: "aₙ = 2 − 3/(n+1) 遞增趨近 2，sup S = 2，但每一項都 < 2，2 不屬於 S。任何元素 aₙ 都被 aₙ₊₁ 超過，所以沒有最大元。1/2 是最小元，不是最大元。",
      solutionSteps: ["aₙ = 2 − 3/(n+1)，遞增，a₁ = 1/2。", "sup S = 2，但 2 − aₙ = 3/(n+1) > 0，2 ∉ S。", "上確界不在 S 裡 ⇒ 沒有最大元。"],
      verify: { m: "choice", options: [
        { say: "沒有最大元", all: [{ v: SUP("\\frac{2n-1}{n+1}"), eq: 2 }, { v: INF("(n+1)\\left(2-\\frac{2n-1}{n+1}\\right)"), gt: 0 }] },
        { say: "有，最大元是 2", all: [{ v: SUP("\\frac{2n-1}{n+1}"), eq: 2 }, { v: INF("(n+1)\\left(2-\\frac{2n-1}{n+1}\\right)"), le: 0 }] },
        { say: "有，最大元是 1/2", all: [{ v: SUP("\\frac{2n-1}{n+1}"), eq: 0.5 }] }
      ] } },
    { id: "cg-12b-009", topic: "limits", rank: 3, answerKind: "text",
      prompt: "S=\\left\\{(-1)^n\\left(1+\\frac{2}{n}\\right):n\\in\\mathbb{N}\\right\\}\\quad\\text{S 的最大元是？}",
      answers: ["2"], canonical: "2", distractors: ["1", "沒有最大元"], timeLimit: 100,
      tags: ["maxmin-verify-two-conditions", "supremum", "sequence"],
      hints: ["奇數項都是負的；只要看偶數項 1 + 2/n。", "偶數項是遞減的，哪一個偶數 n 最大？"],
      solution: "奇數項為負，偶數項 1 + 2/n 遞減，最大的是 n = 2 的 2。所以 2 ∈ S 而且是上界，最大元是 2。1 是偶數項的極限（上極限），比 2 小，不是上界。",
      solutionSteps: ["奇數項 −(1 + 2/n) < 0。", "偶數項 1 + 2/n 遞減：2, 3/2, 4/3, …", "a₂ = 2 ≥ 每一項且屬於 S，最大元是 2。"],
      verify: { m: "choice", options: [
        { say: "2", all: [{ v: SUP("(-1)^n\\left(1+\\frac{2}{n}\\right)"), eq: 2 }, { v: SUP("(-1)^n\\left(1+\\frac{2}{n}\\right)"), gt: LSUP("(-1)^n\\left(1+\\frac{2}{n}\\right)") }] },
        { say: "1", all: [{ v: SUP("(-1)^n\\left(1+\\frac{2}{n}\\right)"), eq: 1 }] },
        { say: "沒有最大元", all: [{ v: SUP("(-1)^n\\left(1+\\frac{2}{n}\\right)"), le: LSUP("(-1)^n\\left(1+\\frac{2}{n}\\right)") }] }
      ] } },
    { id: "cg-12b-010", topic: "limits", rank: 2, answerKind: "text",
      prompt: "S=\\left\\{\\frac{n}{n^2+1}:n\\in\\mathbb{N}\\right\\}\\quad\\text{S 有沒有最小元？}",
      answers: ["沒有最小元"], canonical: "沒有最小元", distractors: ["有，最小元是 0", "有，最小元是 1/2"], timeLimit: 80,
      tags: ["maxmin-verify-two-conditions", "infimum", "sequence"],
      hints: ["先看 n/(n²+1) 是遞增還是遞減，極限是多少。", "最小元必須屬於 S：下確界有沒有被某一項取到？"],
      solution: "n/(n²+1) 從 1/2 遞減趨近 0，inf S = 0，但每一項都 > 0，0 ∉ S，所以沒有最小元。1/2 是最大元。",
      solutionSteps: ["a₁ = 1/2，a₂ = 2/5，…，遞減趨近 0。", "inf S = 0，但 aₙ > 0 對所有 n，0 ∉ S。", "下確界取不到 ⇒ 沒有最小元。"],
      verify: { m: "choice", options: [
        { say: "沒有最小元", all: [{ v: LIMX("\\frac{n}{n^2+1}"), eq: 0 }, { v: INF("n\\cdot\\frac{n}{n^2+1}"), gt: 0 }] },
        { say: "有，最小元是 0", all: [{ v: INF("n\\cdot\\frac{n}{n^2+1}"), le: 0 }] },
        { say: "有，最小元是 1/2", all: [{ v: INF("\\frac{n}{n^2+1}"), eq: 0.5 }] }
      ] } },

    /* ── 12.9 上確界與下確界 ── */
    { id: "cg-12b-011", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "S=\\left\\{a_n=\\frac{4n-1}{n+3}:n\\in\\mathbb{N}\\right\\},\\ \\varepsilon=0.03\\quad\\text{求最小的 }n\\text{ 使 }a_n>\\sup S-\\varepsilon",
      answer: "431", timeLimit: 150,
      tags: ["supinf-epsilon-characterization", "supremum", "sequence"],
      hints: ["先求 sup S：把 aₙ 寫成「常數 − 某個分式」。", "sup S − aₙ < ε 解成 n 的不等式；邊界那個 n 要代回去檢查。"],
      solution: "aₙ = 4 − 13/(n+3) 遞增，sup S = 4。要 13/(n+3) < 0.03 ⇔ n + 3 > 433.3 ⇔ n ≥ 431。",
      solutionSteps: ["aₙ = 4 − 13/(n+3)，遞增趨近 4，sup S = 4。", "4 − aₙ = 13/(n+3) < 0.03 ⇔ n + 3 > 433.33…", "n = 430：13/433 ≈ 0.03002；n = 431：13/434 ≈ 0.02995，答案 431。"],
      verify: { m: "firstIndex", f: "4-\\frac{4n-1}{n+3}", below: 0.03 } },
    { id: "cg-12b-012", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "S=\\left\\{a_n=1-\\left(\\frac{2}{3}\\right)^n:n\\in\\mathbb{N}\\right\\},\\ \\varepsilon=0.01\\quad\\text{求最小的 }n\\text{ 使 }a_n>\\sup S-\\varepsilon",
      answer: "12", timeLimit: 150,
      tags: ["supinf-epsilon-characterization", "supremum", "geometric"],
      hints: ["aₙ 遞增，sup S 是它的極限。", "sup S − aₙ = (2/3)ⁿ；取對數解 (2/3)ⁿ < 0.01。"],
      solution: "sup S = 1，要 (2/3)ⁿ < 0.01 ⇔ n > ln 100 / ln 1.5 ≈ 11.36。(2/3)¹¹ ≈ 0.0116，(2/3)¹² ≈ 0.0077，最小 n = 12。",
      solutionSteps: ["aₙ 遞增趨近 1，sup S = 1。", "1 − aₙ = (2/3)ⁿ < 0.01 ⇔ n > ln 100 / ln(3/2) ≈ 11.36。", "(2/3)¹¹ ≈ 0.0116 不夠，(2/3)¹² ≈ 0.0077，n = 12。"],
      verify: { m: "firstIndex", f: "1-\\left(1-\\left(\\frac{2}{3}\\right)^n\\right)", below: 0.01 } },
    { id: "cg-12b-013", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "S=\\left\\{a_n=\\frac{n+5}{n}:n\\in\\mathbb{N}\\right\\},\\ \\varepsilon=0.03\\quad\\text{求最小的 }n\\text{ 使 }a_n<\\inf S+\\varepsilon",
      answer: "167", timeLimit: 120,
      tags: ["supinf-epsilon-characterization", "infimum", "sequence"],
      hints: ["aₙ = 1 + 5/n，先求 inf S。", "aₙ − inf S < ε 解成 n 的不等式。"],
      solution: "aₙ = 1 + 5/n 遞減趨近 1，inf S = 1。要 5/n < 0.03 ⇔ n > 166.7，最小 n = 167。",
      solutionSteps: ["aₙ = 1 + 5/n，遞減，inf S = 1（取不到）。", "aₙ − 1 = 5/n < 0.03 ⇔ n > 166.67。", "最小的 n = 167。"],
      verify: { m: "firstIndex", f: "\\frac{n+5}{n}-1", below: 0.03 } },
    { id: "cg-12b-014", topic: "limits", rank: 1, answerKind: "text",
      prompt: "S=\\left\\{\\frac{n}{n+1}:n\\in\\mathbb{N}\\right\\}\\quad\\text{0.999 是不是 }S\\text{ 的上界？}",
      answers: ["不是"], canonical: "不是", distractors: ["是", "是，而且就是上確界"], timeLimit: 60,
      tags: ["supinf-upper-bound-check", "supremum", "sequence"],
      hints: ["要否定「是上界」，只要找到一個元素比它大。", "n/(n+1) > 0.999 解出 n。"],
      solution: "n/(n+1) > 0.999 ⇔ n > 999。例如 n = 1000 時 1000/1001 ≈ 0.99900099 > 0.999，所以 0.999 不是上界。sup S = 1。",
      solutionSteps: ["n/(n+1) = 1 − 1/(n+1)。", "n = 1000：1 − 1/1001 ≈ 0.999001 > 0.999。", "有元素超過 0.999，所以它不是上界（sup S = 1）。"],
      verify: { m: "choice", options: [
        { say: "不是", all: [{ v: SUP("\\frac{n}{n+1}"), gt: 0.999 }] },
        { say: "是", all: [{ v: SUP("\\frac{n}{n+1}"), le: 0.999 }] },
        { say: "是，而且就是上確界", all: [{ v: SUP("\\frac{n}{n+1}"), eq: 0.999 }] }
      ] } },
    { id: "cg-12b-015", topic: "limits", rank: 2, answerKind: "text",
      prompt: "S=\\left\\{\\frac{2n}{n+3}:n\\in\\mathbb{N}\\right\\}\\quad\\text{2 是 }S\\text{ 的上確界嗎？}",
      answers: ["是"], canonical: "是", distractors: ["不是，因為 2 不在 S 裡", "不是，上確界是 1/2"], timeLimit: 80,
      tags: ["supinf-upper-bound-check", "supremum", "sequence"],
      hints: ["上確界要兩個條件：是上界，而且任何更小的數都不是上界。", "2n/(n+3) = 2 − 6/(n+3)，對任意 ε 能不能找到元素 > 2 − ε？"],
      solution: "2n/(n+3) = 2 − 6/(n+3) < 2，2 是上界；對任何 ε > 0，n 夠大時 6/(n+3) < ε，所以比 2 小的數都不是上界。sup S = 2，取不到也無妨。1/2 = a₁ 是最小元。",
      solutionSteps: ["aₙ = 2 − 6/(n+3) < 2：2 是上界。", "對 ε > 0，取 n > 6/ε − 3 就有 aₙ > 2 − ε：沒有更小的上界。", "所以 sup S = 2（不在 S 裡也沒關係）。"],
      verify: { m: "choice", options: [
        { say: "是", all: [{ v: SUP("\\frac{2n}{n+3}"), eq: 2 }] },
        { say: "不是，因為 2 不在 S 裡", all: [{ v: SUP("\\frac{2n}{n+3}"), ne: 2 }] },
        { say: "不是，上確界是 1/2", all: [{ v: SUP("\\frac{2n}{n+3}"), eq: 0.5 }] }
      ] } },

    /* ── 12.10 完備性公理 ── */
    { id: "cg-12b-016", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{下列哪一個集合在 }\\mathbb{R}\\text{ 中保證有上確界？}",
      answers: ["{n/(2n+1) : n ∈ ℕ}"], canonical: "{n/(2n+1) : n ∈ ℕ}", distractors: ["{n² : n ∈ ℕ}", "{x ∈ ℝ : x² < 0}"], timeLimit: 80,
      tags: ["completeness-statement", "supremum"],
      hints: ["完備性公理有兩個前提：非空、有上界。", "逐一檢查：哪一個沒有上界？哪一個是空集合？"],
      solution: "完備性：非空且有上界的實數集合必有上確界。n/(2n+1) < 1/2，非空有上界，sup = 1/2。{n²} 沒有上界；{x : x² < 0} 是空集合，兩者都不符合前提。",
      solutionSteps: ["前提：S ≠ ∅ 且 S 有上界。", "{n²} 無上界；{x ∈ ℝ : x² < 0} = ∅。", "{n/(2n+1)} 非空、以 1/2 為上界 ⇒ 有上確界（就是 1/2）。"],
      verify: { m: "choice", options: [
        { say: "{n/(2n+1) : n ∈ ℕ}", all: [{ v: SUP("\\frac{n}{2n+1}"), le: 1 }] },
        { say: "{n² : n ∈ ℕ}", all: [{ v: LIMX("\\frac{1}{n^2}"), ne: 0 }] },
        { say: "{x ∈ ℝ : x² < 0}", all: [{ v: XINF("x^2", [-100, 100]), lt: 0 }] }
      ] } },
    { id: "cg-12b-017", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{下列哪一個集合在 }\\mathbb{R}\\text{ 中沒有上確界？}",
      answers: ["{2ⁿ : n ∈ ℕ}"], canonical: "{2ⁿ : n ∈ ℕ}", distractors: ["{1 − 1/n : n ∈ ℕ}", "{sin n : n ∈ ℕ}"], timeLimit: 80,
      tags: ["completeness-statement", "supremum"],
      hints: ["非空集合沒有上確界，只有一種可能：沒有上界。", "三個集合各找一個上界試試看。"],
      solution: "{1 − 1/n} 以 1 為上界，{sin n} 以 1 為上界，都非空，所以都有上確界。2ⁿ → ∞，沒有上界，所以沒有上確界（在 ℝ 中）。",
      solutionSteps: ["1 − 1/n < 1，sin n ≤ 1：兩個都非空有上界，完備性給出上確界。", "2ⁿ ≥ n 對所有 n，任何 M 都會被超過。", "{2ⁿ} 沒有上界 ⇒ 沒有上確界。"],
      verify: { m: "choice", options: [
        { say: "{2ⁿ : n ∈ ℕ}", all: [{ v: LIM("2^{-n}"), eq: 0 }] },
        { say: "{1 − 1/n : n ∈ ℕ}", all: [{ v: SUP("1-\\frac{1}{n}"), gt: 10 }] },
        { say: "{sin n : n ∈ ℕ}", all: [{ v: SUP("\\sin n"), gt: 10 }] }
      ] } },
    { id: "cg-12b-018", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{下列哪一個集合在 }\\mathbb{R}\\text{ 中保證有下確界？}",
      answers: ["{(−1)ⁿ n/(n+1) : n ∈ ℕ}"], canonical: "{(−1)ⁿ n/(n+1) : n ∈ ℕ}", distractors: ["{−n² : n ∈ ℕ}", "{x ∈ ℝ : x² + 1 < 0}"], timeLimit: 80,
      tags: ["completeness-statement", "infimum"],
      hints: ["下確界版本的前提：非空、有下界。", "每個集合問兩件事：有沒有元素？有沒有下界？"],
      solution: "|(−1)ⁿn/(n+1)| < 1，非空且以 −1 為下界，所以有下確界（−1）。{−n²} 沒有下界；x² + 1 < 0 無解，集合是空的。",
      solutionSteps: ["(−1)ⁿn/(n+1) > −1：非空有下界 ⇒ 有下確界。", "−n² 可以任意負，沒有下界。", "x² + 1 ≥ 1 > 0，{x : x² + 1 < 0} = ∅。"],
      verify: { m: "choice", options: [
        { say: "{(−1)ⁿ n/(n+1) : n ∈ ℕ}", all: [{ v: INF("(-1)^n\\frac{n}{n+1}"), ge: -1 }] },
        { say: "{−n² : n ∈ ℕ}", all: [{ v: LIMX("-\\frac{1}{n^2}"), ne: 0 }] },
        { say: "{x ∈ ℝ : x² + 1 < 0}", all: [{ v: XINF("x^2+1", [-100, 100]), lt: 0 }] }
      ] } },
    { id: "cg-12b-019", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "S=\\{x\\in\\mathbb{Q}:x^3<5\\}\\quad\\text{求 }S\\text{ 在 }\\mathbb{R}\\text{ 中的上確界}",
      answer: "5^(1/3)", timeLimit: 100,
      tags: ["completeness-rational-gap", "supremum"],
      hints: ["x³ 是遞增函數：x³ < 5 ⇔ x < 某個數。", "有理數在實數中稠密：比那個數小的有理數可以任意靠近它。"],
      solution: "x³ < 5 ⇔ x < ∛5，所以 ∛5 是上界；有理數稠密，任何比 ∛5 小的數之上都還有 S 的元素。sup S = ∛5 ≈ 1.710，是無理數 —— 在 ℚ 裡這個集合沒有上確界。",
      solutionSteps: ["x³ 嚴格遞增：x³ < 5 ⇔ x < ∛5。", "∛5 是上界；對任何 c < ∛5，(c, ∛5) 中有有理數屬於 S。", "sup S = ∛5（無理數，不在 ℚ 中）。"],
      verify: { m: "root", f: "x^3-5", x0: 1.7 } },
    { id: "cg-12b-020", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "S=\\{x\\in\\mathbb{Q}:x>0,\\ 2x^2>7\\}\\quad\\text{求 }S\\text{ 在 }\\mathbb{R}\\text{ 中的下確界}",
      answer: "sqrt(14)/2", timeLimit: 100,
      tags: ["completeness-rational-gap", "infimum"],
      hints: ["在 x > 0 的範圍內解 2x² > 7。", "S 裡的元素能任意靠近那個邊界嗎？用有理數的稠密性。"],
      solution: "x > 0 時 2x² > 7 ⇔ x > √(7/2) = √14/2 ≈ 1.871。邊界是下界，而且有理數可以從右邊任意靠近它，所以 inf S = √14/2，不屬於 ℚ。",
      solutionSteps: ["x > 0 且 2x² > 7 ⇔ x > √(7/2)。", "√(7/2) 是下界；任何比它大的數 c，(√(7/2), c) 中都有有理數。", "inf S = √(7/2) = √14/2 ≈ 1.871。"],
      verify: { m: "root", f: "2x^2-7", x0: 1.9 } },
    { id: "cg-12b-021", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "S=\\left\\{\\frac{2-5n}{n+3}:n\\in\\mathbb{N}\\right\\}\\quad\\text{求 }\\inf S",
      answer: "-5", timeLimit: 90,
      tags: ["completeness-inf-from-sup", "infimum", "sequence"],
      hints: ["inf S = −sup(−S)：先看 −S 的元素 (5n − 2)/(n+3)。", "把 (5n − 2)/(n+3) 寫成「常數 − 分式」，求它的上確界。"],
      solution: "−S 的元素 (5n−2)/(n+3) = 5 − 17/(n+3) 遞增趨近 5，sup(−S) = 5。所以 inf S = −5（取不到）。",
      solutionSteps: ["−S = {(5n − 2)/(n+3)}，(5n − 2)/(n+3) = 5 − 17/(n+3)。", "遞增趨近 5，sup(−S) = 5。", "inf S = −sup(−S) = −5。"],
      verify: { m: "extremeOf", f: "\\frac{2-5n}{n+3}", kind: "inf" } },
    { id: "cg-12b-022", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "S=\\left\\{-\\frac{n}{3^n}:n\\in\\mathbb{N}\\right\\}\\quad\\text{求 }\\inf S",
      answer: "-1/3", timeLimit: 90,
      tags: ["completeness-inf-from-sup", "infimum", "sequence"],
      hints: ["inf S = −sup(−S)，−S = {n/3ⁿ}。", "看 n/3ⁿ 的相鄰比值 (n+1)/(3n)，什麼時候小於 1？"],
      solution: "−S = {n/3ⁿ}：1/3, 2/9, 1/9, …，相鄰比 (n+1)/(3n) ≤ 2/3 < 1，從頭就遞減，sup(−S) = 1/3。inf S = −1/3（在 n = 1 取到）。",
      solutionSteps: ["−S = {n/3ⁿ}，a_{n+1}/a_n = (n+1)/(3n) < 1。", "遞減，sup(−S) = a₁ = 1/3。", "inf S = −1/3。"],
      verify: { m: "extremeOf", f: "-\\frac{n}{3^n}", kind: "inf" } },

    /* ── 12.11 阿基米德性質 ── */
    { id: "cg-12b-023", topic: "limits", rank: 1, answerKind: "numeric",
      prompt: "\\varepsilon=0.0035\\quad\\text{求最小的正整數 }n\\text{ 使 }\\frac{1}{n}<\\varepsilon",
      answer: "286", timeLimit: 60,
      tags: ["archimedean-find-n", "sequence"],
      hints: ["1/n < ε ⇔ n > 1/ε。", "1/ε 不是整數時，往上取整。"],
      solution: "1/n < 0.0035 ⇔ n > 1/0.0035 ≈ 285.71，最小的 n = 286。",
      solutionSteps: ["1/n < 0.0035 ⇔ n > 1/0.0035。", "1/0.0035 ≈ 285.71。", "最小的正整數 n = 286。"],
      verify: { m: "firstIndex", f: "\\frac{1}{n}", below: 0.0035 } },
    { id: "cg-12b-024", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\varepsilon=0.0003\\quad\\text{求最小的正整數 }n\\text{ 使 }\\frac{1}{n^2}<\\varepsilon",
      answer: "58", timeLimit: 80,
      tags: ["archimedean-find-n", "sequence"],
      hints: ["1/n² < ε ⇔ n² > 1/ε。", "1/ε ≈ 3333.3，找第一個平方超過它的整數。"],
      solution: "n² > 1/0.0003 ≈ 3333.3。57² = 3249 不夠，58² = 3364 > 3333.3，所以 n = 58。",
      solutionSteps: ["1/n² < 0.0003 ⇔ n² > 3333.33…", "57² = 3249，58² = 3364。", "最小的 n = 58。"],
      verify: { m: "firstIndex", f: "\\frac{1}{n^2}", below: 0.0003 } },
    { id: "cg-12b-025", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\varepsilon=0.0007\\quad\\text{求最小的正整數 }n\\text{ 使 }\\frac{1}{2^n}<\\varepsilon",
      answer: "11", timeLimit: 80,
      tags: ["archimedean-find-n", "geometric"],
      hints: ["1/2ⁿ < ε ⇔ 2ⁿ > 1/ε。", "1/ε ≈ 1428.6，列出 2 的次方找第一個超過的。"],
      solution: "2ⁿ > 1/0.0007 ≈ 1428.6。2¹⁰ = 1024 不夠，2¹¹ = 2048，所以 n = 11。",
      solutionSteps: ["1/2ⁿ < 0.0007 ⇔ 2ⁿ > 1428.57…", "2¹⁰ = 1024 < 1428.57 < 2048 = 2¹¹。", "最小的 n = 11。"],
      verify: { m: "firstIndex", f: "\\frac{1}{2^n}", below: 0.0007 } },
    { id: "cg-12b-026", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "a=\\sqrt{2},\\ b=\\sqrt{3}\\text{。取最小的正整數 }n\\text{ 使 }\\frac{1}{n}<b-a\\,\\text{，再令 }m=\\lfloor n\\,a\\rfloor+1\\text{，則 }a<\\frac{m}{n}<b\\,\\text{。求 }m",
      answer: "6", timeLimit: 150,
      tags: ["archimedean-density", "sequence"],
      hints: ["先算 b − a 的近似值，找第一個 1/n 比它小的 n。", "再算 n√2 的整數部分。"],
      solution: "b − a ≈ 1.7321 − 1.4142 = 0.3178；1/3 ≈ 0.333 不夠，n = 4。4√2 ≈ 5.657，m = 5 + 1 = 6，而 6/4 = 1.5 確實落在 (√2, √3)。",
      solutionSteps: ["b − a ≈ 0.3178，1/3 > 0.3178 > 1/4，所以 n = 4。", "4√2 ≈ 5.657，⌊4√2⌋ = 5，m = 6。", "檢查：1.414 < 6/4 = 1.5 < 1.732。"],
      verify: { m: "let", f: "\\lfloor n\\sqrt{2}\\rfloor+1", with: { n: { m: "firstIndex", f: "\\frac{1}{n}", below: "\\sqrt{3}-\\sqrt{2}" } } } },
    { id: "cg-12b-027", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "a=e,\\ b=\\sqrt{8}\\text{。取最小的正整數 }n\\text{ 使 }\\frac{1}{n}<b-a\\,\\text{，再令 }m=\\lfloor n\\,a\\rfloor+1\\text{，則 }a<\\frac{m}{n}<b\\,\\text{。求 }m",
      answer: "28", timeLimit: 150,
      tags: ["archimedean-density", "sequence"],
      hints: ["√8 ≈ 2.8284、e ≈ 2.7183，先算差。", "找到 n 之後算 n·e 的整數部分。"],
      solution: "b − a ≈ 0.1101，1/9 ≈ 0.111 不夠，n = 10。10e ≈ 27.18，m = 27 + 1 = 28，28/10 = 2.8 落在 (e, √8)。",
      solutionSteps: ["b − a ≈ 2.8284 − 2.7183 = 0.1101；1/9 ≈ 0.1111 > 0.1101，1/10 = 0.1 < 0.1101，n = 10。", "10e ≈ 27.18，⌊10e⌋ = 27，m = 28。", "檢查：2.718 < 2.8 < 2.828。"],
      verify: { m: "let", f: "\\lfloor ne\\rfloor+1", with: { n: { m: "firstIndex", f: "\\frac{1}{n}", below: "\\sqrt{8}-e" } } } },

    /* ── 12.12 ε-N 定義 ── */
    { id: "cg-12c-001", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{下列哪一句是「}a_n\\to L\\text{」的定義？}",
      answers: ["∀ε>0 ∃N ∀n≥N：|aₙ−L|<ε"], canonical: "∀ε>0 ∃N ∀n≥N：|aₙ−L|<ε",
      distractors: ["∃N ∀ε>0 ∀n≥N：|aₙ−L|<ε", "∀ε>0 ∀N ∃n≥N：|aₙ−L|<ε", "∃ε>0 ∃N ∀n≥N：|aₙ−L|<ε"], timeLimit: 120,
      tags: ["epsn-quantifier-order", "epsilon-delta", "sequence"],
      hints: ["N 是在 ε 給定之後才挑的，所以 N 可以依賴 ε。", "拿 1/n → 0、(−1)ⁿ 這兩個數列去測每一句話。"],
      solution: "定義是「對每個 ε，存在 N，之後全部落在 ε 內」。∃N∀ε 逼 aₙ 從某項起恆等於 L，1/n → 0 就不符；∀N∃n 只說「無窮多項靠近 L」，(−1)ⁿ 對 L = 1 也成立；∃ε 只說有界。",
      solutionSteps: ["∃N ∀ε：n ≥ N 時 |aₙ − L| 小於所有正數 ⇒ aₙ = L，1/n → 0 卻沒有一項是 0。", "∀ε ∀N ∃n：(−1)ⁿ 的偶數項等於 1，此句對 L = 1 成立，但 (−1)ⁿ 不收斂。", "∃ε ∃N：(−1)ⁿ 取 ε = 2、L = 0 就成立，仍不收斂。剩下 ∀ε ∃N ∀n 是定義。"],
      verify: { m: "choice", options: [
        { say: "∀ε>0 ∃N ∀n≥N：|aₙ−L|<ε", unknown: "這就是收斂的定義本身" },
        { say: "∃N ∀ε>0 ∀n≥N：|aₙ−L|<ε", given: [{ v: LIMX("\\frac{1}{n}"), eq: 0 }], all: [{ v: INF("n\\cdot\\frac{1}{n}"), le: 0 }] },
        { say: "∀ε>0 ∀N ∃n≥N：|aₙ−L|<ε", given: [{ v: LINF("|(-1)^n-1|"), le: 0 }], all: [{ v: LSUP("|(-1)^n-1|"), le: 0 }] },
        { say: "∃ε>0 ∃N ∀n≥N：|aₙ−L|<ε", given: [{ v: LSUP("|(-1)^n|"), le: 1 }], all: [{ v: LSUP("|(-1)^n|"), le: 0 }] }
      ] } },
    { id: "cg-12c-002", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\text{下列哪一句是「}a_n\\,\\text{ 不收斂到 }L\\text{」的正確寫法？}",
      answers: ["∃ε>0 ∀N ∃n≥N：|aₙ−L|≥ε"], canonical: "∃ε>0 ∀N ∃n≥N：|aₙ−L|≥ε",
      distractors: ["∀ε>0 ∃N ∀n≥N：|aₙ−L|≥ε", "∃ε>0 ∃N ∀n≥N：|aₙ−L|≥ε", "∀ε>0 ∀N ∃n≥N：|aₙ−L|≥ε"], timeLimit: 120,
      tags: ["epsn-quantifier-order", "epsilon-delta", "sequence"],
      hints: ["否定時 ∀ 與 ∃ 互換，最後的不等式反過來。", "拿 aₙ = (1 + (−1)ⁿ)/2（0, 1, 0, 1, …）與 L = 1 測每一句。"],
      solution: "∀ε∃N∀n 的否定是 ∃ε∀N∃n，|aₙ−L| ≥ ε。用 0,1,0,1,… 對 L = 1：它不收斂到 1，但偶數項等於 1，所以「從某項起全部遠離」與「離得任意遠」都不成立 —— 那兩句比「不收斂」強太多。",
      solutionSteps: ["¬(∀ε ∃N ∀n≥N P) = ∃ε ∀N ∃n≥N ¬P，¬P 是 |aₙ − L| ≥ ε。", "aₙ = 0,1,0,1,…、L = 1：不收斂到 1，但偶數項 |aₙ − 1| = 0，任何「∃N ∀n≥N：|aₙ−1| ≥ ε」都失敗。", "它也只離 1 最多 1，「∀ε ∃n：|aₙ−1| ≥ ε」失敗。正確的否定是 ∃ε ∀N ∃n≥N。"],
      verify: { m: "choice", options: [
        { say: "∃ε>0 ∀N ∃n≥N：|aₙ−L|≥ε", unknown: "這是定義的邏輯否定" },
        { say: "∀ε>0 ∃N ∀n≥N：|aₙ−L|≥ε", given: [{ v: LSUP("\\left|\\frac{1+(-1)^n}{2}-1\\right|"), gt: 0 }], all: [{ v: LINF("\\left|\\frac{1+(-1)^n}{2}-1\\right|"), gt: 0 }] },
        { say: "∃ε>0 ∃N ∀n≥N：|aₙ−L|≥ε", given: [{ v: LSUP("\\left|\\frac{1+(-1)^n}{2}-1\\right|"), gt: 0 }], all: [{ v: LINF("\\left|\\frac{1+(-1)^n}{2}-1\\right|"), gt: 0 }] },
        { say: "∀ε>0 ∀N ∃n≥N：|aₙ−L|≥ε", given: [{ v: LSUP("\\left|\\frac{1+(-1)^n}{2}-1\\right|"), gt: 0 }], all: [{ v: LSUP("\\left|\\frac{1+(-1)^n}{2}-1\\right|"), gt: 1000 }] }
      ] } },
    { id: "cg-12c-003", topic: "limits", rank: 2, answerKind: "text",
      prompt: "a_n=(-1)^n,\\ L=1\\quad\\text{下列哪一句成立？}",
      answers: ["∀ε>0 ∀N ∃n≥N：|aₙ−1|<ε"], canonical: "∀ε>0 ∀N ∃n≥N：|aₙ−1|<ε",
      distractors: ["∀ε>0 ∃N ∀n≥N：|aₙ−1|<ε", "∃N ∀n≥N：aₙ = 1"], timeLimit: 100,
      tags: ["epsn-quantifier-order", "epsilon-delta", "sequence"],
      hints: ["把 |aₙ − 1| 對奇偶數 n 分別寫出來。", "「∀N ∃n≥N」只需要無窮多項符合；「∃N ∀n≥N」要從某項起全部符合。"],
      solution: "|aₙ − 1| 在偶數 n 是 0、奇數 n 是 2。每個 N 之後都有偶數 n，所以第一句成立；但每個 N 之後也都有奇數 n，|aₙ − 1| = 2，後兩句都失敗 —— 這正是 (−1)ⁿ 不收斂到 1 的原因。",
      solutionSteps: ["|(−1)ⁿ − 1| = 0（n 偶）或 2（n 奇）。", "任何 N 之後都有偶數 n：∀ε ∀N ∃n≥N 成立。", "任何 N 之後都有奇數 n，|aₙ − 1| = 2：另外兩句都不成立。"],
      verify: { m: "choice", options: [
        { say: "∀ε>0 ∀N ∃n≥N：|aₙ−1|<ε", all: [{ v: LINF("|(-1)^n-1|"), le: 0 }] },
        { say: "∀ε>0 ∃N ∀n≥N：|aₙ−1|<ε", all: [{ v: LSUP("|(-1)^n-1|"), le: 0 }] },
        { say: "∃N ∀n≥N：aₙ = 1", all: [{ v: LSUP("|(-1)^n-1|"), le: 0 }] }
      ] } },
    { id: "cg-12c-004", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "a_n=(-1)^n\\frac{n}{n+1},\\ L=\\frac{1}{2}\\text{。若 }\\varepsilon>0\\text{ 滿足「對每個 }N\\text{ 都有 }n\\ge N\\text{ 使 }|a_n-L|\\ge\\varepsilon\\text{」，就稱它可用。求所有可用 }\\varepsilon\\text{ 的上確界}",
      answer: "3/2", timeLimit: 150,
      tags: ["epsn-negation", "limsup", "sequence"],
      hints: ["分別寫出奇數項、偶數項的 |aₙ − 1/2|。", "可用的 ε 要被無窮多項的距離「達到或超過」；看那些距離的上極限。"],
      solution: "偶數項 |n/(n+1) − 1/2| → 1/2；奇數項 n/(n+1) + 1/2 → 3/2 但永遠 < 3/2。所以 ε < 3/2 都可用，ε = 3/2 不行，上確界是 3/2。",
      solutionSteps: ["n 偶：|aₙ − 1/2| = n/(n+1) − 1/2 → 1/2。", "n 奇：|aₙ − 1/2| = n/(n+1) + 1/2，遞增趨近 3/2，取不到。", "可用的 ε 正好是 (0, 3/2)，上確界 3/2（= limsup |aₙ − L|）。"],
      verify: { m: "limsup", f: "\\left|(-1)^n\\frac{n}{n+1}-\\frac{1}{2}\\right|", kind: "limsup" } },
    { id: "cg-12c-005", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "a_n=\\cos\\frac{2n\\pi}{3},\\ L=\\frac{1}{4}\\text{。要用「}\\exists\\varepsilon>0\\ \\forall N\\ \\exists n\\ge N:\\ |a_n-L|\\ge\\varepsilon\\text{」證明 }a_n\\not\\to L\\text{，}\\varepsilon\\text{ 最大可以取多少？}",
      answer: "3/4", timeLimit: 150,
      tags: ["epsn-negation", "limsup", "trig"],
      hints: ["cos(2nπ/3) 以 3 為週期，先列出一個週期的值。", "每一種值到 1/4 的距離各是多少？哪些距離會出現無窮多次？"],
      solution: "aₙ 依序是 −1/2, −1/2, 1, −1/2, −1/2, 1, …。|−1/2 − 1/4| = 3/4，|1 − 1/4| = 3/4：每一項都離 1/4 恰好 3/4，所以 ε = 3/4 可用，再大就不行。",
      solutionSteps: ["cos(2nπ/3)：n ≡ 1, 2 (mod 3) 時是 −1/2，n ≡ 0 時是 1。", "|−1/2 − 1/4| = 3/4，|1 − 1/4| = 3/4。", "每一項的距離都是 3/4：最大可用的 ε = 3/4。"],
      verify: { m: "limsup", f: "\\left|\\cos\\frac{2n\\pi}{3}-\\frac{1}{4}\\right|", kind: "limsup" } },

    /* ── 12.14 極限定律 ── */
    { id: "cg-12c-006", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "a_n=\\frac{n+9}{n}\\to1\\text{。用 }\\varepsilon=1\\text{：取最小的 }N\\text{ 使 }n\\ge N\\text{ 時 }|a_n-1|<1\\text{，再令 }M\\text{ 為 }|a_1|,\\dots,|a_{N-1}|\\text{ 與 }|L|+1\\text{ 中最大的數。求 }M",
      answer: "10", timeLimit: 150,
      tags: ["limlaw-bounded-lemma", "sequence"],
      hints: ["|aₙ − 1| = 9/n，解 9/n < 1 得 N。", "前 N − 1 項是遞減的，最大的是哪一項？再和 |L| + 1 = 2 比。"],
      solution: "|aₙ − 1| = 9/n < 1 ⇔ n > 9，N = 10。a₁, …, a₉ 中最大的是 a₁ = 10，|L| + 1 = 2，所以 M = 10，而且 |aₙ| ≤ 10 對所有 n 成立。",
      solutionSteps: ["|aₙ − 1| = 9/n < 1 ⇔ n ≥ 10，N = 10。", "n ≥ 10 時 |aₙ| < |L| + 1 = 2；前 9 項 aₙ = 1 + 9/n 遞減，最大是 a₁ = 10。", "M = 10。"],
      verify: { m: "extremeOf", f: "\\left|\\frac{n+9}{n}\\right|", kind: "sup" } },
    { id: "cg-12c-007", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{「}a_n+b_n\\text{ 收斂}\\Rightarrow a_n\\,\\text{ 與 }b_n\\text{ 都收斂」對不對？}",
      answers: ["不對：aₙ = (−1)ⁿ、bₙ = −(−1)ⁿ 是反例"], canonical: "不對：aₙ = (−1)ⁿ、bₙ = −(−1)ⁿ 是反例",
      distractors: ["對：和的極限等於極限的和", "不對：aₙ = 1/n、bₙ = −1/n 是反例"], timeLimit: 90,
      tags: ["limlaw-converse-counterexample", "sequence"],
      hints: ["和的極限定律的前提是什麼？它反過來說了什麼嗎？", "反例要同時滿足：和收斂、而且至少一個不收斂。"],
      solution: "(−1)ⁿ + (−(−1)ⁿ) = 0 收斂，但 (−1)ⁿ 不收斂，所以命題錯。和的定律只說「各自收斂 ⇒ 和收斂」，不能反推。1/n 與 −1/n 都收斂，不是反例。",
      solutionSteps: ["aₙ + bₙ = (−1)ⁿ − (−1)ⁿ = 0，收斂到 0。", "aₙ = (−1)ⁿ 在 1 與 −1 間跳，不收斂。", "命題不成立；1/n、−1/n 各自收斂，不能當反例。"],
      verify: { m: "choice", options: [
        { say: "不對：aₙ = (−1)ⁿ、bₙ = −(−1)ⁿ 是反例", all: [{ v: LIM("(-1)^n-(-1)^n"), eq: 0 }, { v: LSUP("(-1)^n"), gt: LINF("(-1)^n") }] },
        { say: "對：和的極限等於極限的和", given: [{ v: LIM("(-1)^n-(-1)^n"), eq: 0 }], all: [{ v: LSUP("(-1)^n"), le: LINF("(-1)^n") }] },
        { say: "不對：aₙ = 1/n、bₙ = −1/n 是反例", all: [{ v: LSUP("\\frac{1}{n}"), gt: LINF("\\frac{1}{n}") }] }
      ] } },
    { id: "cg-12c-008", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\text{「}a_n b_n\\to0\\Rightarrow a_n\\to0\\text{ 或 }b_n\\to0\\text{」對不對？}",
      answers: ["不對：aₙ = 1 + (−1)ⁿ、bₙ = 1 − (−1)ⁿ 是反例"], canonical: "不對：aₙ = 1 + (−1)ⁿ、bₙ = 1 − (−1)ⁿ 是反例",
      distractors: ["對：乘積趨近 0 就有一個因子趨近 0", "不對：aₙ = 1/n、bₙ = n 是反例"], timeLimit: 120,
      tags: ["limlaw-converse-counterexample", "sequence"],
      hints: ["讓兩個數列「輪流」是 0。", "檢查反例要兩件事：乘積確實 → 0，而且兩個都不 → 0。"],
      solution: "aₙ = 1 + (−1)ⁿ 是 0, 2, 0, 2, …，bₙ = 1 − (−1)ⁿ 是 2, 0, 2, 0, …，乘積恆為 0，但兩個都不趨近 0。1/n·n = 1 不趨近 0，而且 1/n → 0，不是反例。",
      solutionSteps: ["aₙbₙ = (1 + (−1)ⁿ)(1 − (−1)ⁿ) = 1 − 1 = 0。", "aₙ、bₙ 都在 0 與 2 之間跳，都不趨近 0。", "命題不成立。"],
      verify: { m: "choice", options: [
        { say: "不對：aₙ = 1 + (−1)ⁿ、bₙ = 1 − (−1)ⁿ 是反例", all: [{ v: LIM("(1+(-1)^n)(1-(-1)^n)"), eq: 0 }, { v: { m: "let", f: "pq", with: { p: LSUP("|1+(-1)^n|"), q: LSUP("|1-(-1)^n|") } }, gt: 0 }] },
        { say: "對：乘積趨近 0 就有一個因子趨近 0", given: [{ v: LIM("(1+(-1)^n)(1-(-1)^n)"), eq: 0 }], all: [{ v: { m: "let", f: "pq", with: { p: LSUP("|1+(-1)^n|"), q: LSUP("|1-(-1)^n|") } }, le: 0 }] },
        { say: "不對：aₙ = 1/n、bₙ = n 是反例", all: [{ v: LSUP("\\left|\\frac{1}{n}\\right|"), gt: 0 }] }
      ] } },
    { id: "cg-12c-009", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{「}|a_n|\\text{ 收斂}\\Rightarrow a_n\\text{ 收斂」對不對？}",
      answers: ["不對：aₙ = (−1)ⁿ 是反例"], canonical: "不對：aₙ = (−1)ⁿ 是反例",
      distractors: ["對：絕對值收斂就收斂", "不對：aₙ = 1 + (−1)ⁿ/n 是反例"], timeLimit: 90,
      tags: ["limlaw-converse-counterexample", "sequence"],
      hints: ["找一個絕對值固定、但正負號一直變的數列。", "反例要 |aₙ| 收斂、aₙ 不收斂，兩件事都要對。"],
      solution: "|(−1)ⁿ| = 1 收斂，但 (−1)ⁿ 不收斂。反方向（aₙ → L ⇒ |aₙ| → |L|）才成立。1 + (−1)ⁿ/n → 1 本身收斂，不是反例。只有 L = 0 時 |aₙ| → 0 能推出 aₙ → 0。",
      solutionSteps: ["|(−1)ⁿ| = 1，常數數列，收斂。", "(−1)ⁿ 在 ±1 間跳，不收斂。", "命題不成立；1 + (−1)ⁿ/n → 1 收斂，不能當反例。"],
      verify: { m: "choice", options: [
        { say: "不對：aₙ = (−1)ⁿ 是反例", all: [{ v: LIM("|(-1)^n|"), eq: 1 }, { v: LSUP("(-1)^n"), gt: LINF("(-1)^n") }] },
        { say: "對：絕對值收斂就收斂", given: [{ v: LIM("|(-1)^n|"), eq: 1 }], all: [{ v: LSUP("(-1)^n"), le: LINF("(-1)^n") }] },
        { say: "不對：aₙ = 1 + (−1)ⁿ/n 是反例", all: [{ v: LSUP("1+\\frac{(-1)^n}{n}"), gt: LINF("1+\\frac{(-1)^n}{n}") }] }
      ] } },

    /* ── 12.15 單調收斂定理（嚴格版） ── */
    { id: "cg-12c-010", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{單調收斂定理拿掉「單調」這個前提：下列哪一個數列有界卻不收斂？}",
      answers: ["aₙ = (−1)ⁿ(1 + 1/n)"], canonical: "aₙ = (−1)ⁿ(1 + 1/n)", distractors: ["aₙ = 1 − 1/n", "aₙ = n"], timeLimit: 90,
      tags: ["mct-hypothesis-counterexample", "sequence"],
      hints: ["反例要同時滿足：有界、不單調、不收斂。", "1 − 1/n 單調嗎？n 有界嗎？"],
      solution: "(−1)ⁿ(1 + 1/n) 的絕對值 ≤ 2，有界；偶數項 → 1、奇數項 → −1，不收斂（它也不單調）。1 − 1/n 單調有界而收斂；n 沒有上界。",
      solutionSteps: ["|(−1)ⁿ(1 + 1/n)| ≤ 2：有界。", "偶數項 → 1，奇數項 → −1：不收斂。", "1 − 1/n → 1（收斂），n 無界：兩個都不是要找的。"],
      verify: { m: "choice", options: [
        { say: "aₙ = (−1)ⁿ(1 + 1/n)", all: [{ v: SUP("\\left|(-1)^n\\left(1+\\frac{1}{n}\\right)\\right|"), le: 2 }, { v: LSUP("(-1)^n\\left(1+\\frac{1}{n}\\right)"), gt: LINF("(-1)^n\\left(1+\\frac{1}{n}\\right)") }] },
        { say: "aₙ = 1 − 1/n", all: [{ v: SUP("\\left|1-\\frac{1}{n}\\right|"), le: 2 }, { v: LSUP("1-\\frac{1}{n}"), gt: LINF("1-\\frac{1}{n}") }] },
        { say: "aₙ = n", all: [{ v: SUP("|n|"), le: 2 }] }
      ] } },
    { id: "cg-12c-011", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{單調收斂定理拿掉「有界」這個前提：下列哪一個數列遞增卻不收斂？}",
      answers: ["aₙ = √n"], canonical: "aₙ = √n", distractors: ["aₙ = 2 − 1/n", "aₙ = sin n"], timeLimit: 90,
      tags: ["mct-hypothesis-counterexample", "sequence"],
      hints: ["遞增的數列只有兩種命運：有界就收斂，無界就趨近 ∞。", "先刪掉不是遞增的，再看剩下的有沒有上界。"],
      solution: "√n 遞增而且無上界，趨近 ∞，不收斂。2 − 1/n 遞增有上界 2，收斂；sin n 根本不單調（sin 2 > sin 3）。",
      solutionSteps: ["√(n+1) − √n > 0：√n 遞增；√n > M ⇔ n > M²：無上界。", "2 − 1/n 遞增且 < 2，收斂到 2。", "sin 2 ≈ 0.909 > sin 3 ≈ 0.141，sin n 不遞增。答案 √n。"],
      verify: { m: "choice", options: [
        { say: "aₙ = √n", all: [{ v: INF("\\sqrt{n}\\left(\\sqrt{n+1}-\\sqrt{n}\\right)"), gt: 0 }, { v: LIMX("\\frac{1}{\\sqrt{n}}"), eq: 0 }] },
        { say: "aₙ = 2 − 1/n", all: [{ v: INF("n(n+1)\\left(\\frac{1}{n}-\\frac{1}{n+1}\\right)"), gt: 0 }, { v: LIM("\\frac{1}{2-1/n}"), eq: 0 }] },
        { say: "aₙ = sin n", all: [{ v: INF("\\sin(n+1)-\\sin n"), gt: 0 }] }
      ] } },
    { id: "cg-12c-012", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\text{單調收斂定理拿掉「完備性」（只在 }\\mathbb{Q}\\text{ 裡看）：下列哪一個有理數列遞增有上界，極限卻不在 }\\mathbb{Q}\\text{ 裡？}",
      answers: ["aₙ = (1 + 1/n)ⁿ"], canonical: "aₙ = (1 + 1/n)ⁿ", distractors: ["aₙ = 1 − 1/n", "aₙ = 1/2 + 1/4 + … + 1/2ⁿ"], timeLimit: 100,
      tags: ["mct-hypothesis-counterexample", "sequence", "completeness"],
      hints: ["三個數列都遞增有上界，在 ℝ 中都收斂；差別在極限是不是有理數。", "把三個極限各算出來。"],
      solution: "三個都是遞增有上界的有理數列。1 − 1/n → 1、1/2 + … + 1/2ⁿ → 1，極限都在 ℚ 裡；(1 + 1/n)ⁿ → e，e 是無理數，所以在 ℚ 裡它沒有極限 —— 這正是完備性的作用。",
      solutionSteps: ["1 − 1/n → 1 ∈ ℚ。", "1/2 + 1/4 + … + 1/2ⁿ = 1 − 1/2ⁿ → 1 ∈ ℚ。", "(1 + 1/n)ⁿ → e ∉ ℚ：在 ℚ 中遞增有界卻不收斂。"],
      verify: { m: "choice", options: [
        { say: "aₙ = (1 + 1/n)ⁿ", unknown: "極限是 e，e 是無理數（定理，數值驗不了）" },
        { say: "aₙ = 1 − 1/n", all: [{ v: LIM("1-\\frac{1}{n}"), ne: 1 }] },
        { say: "aₙ = 1/2 + 1/4 + … + 1/2ⁿ", all: [{ v: { m: "series", f: "2^{-n}", from: 1 }, ne: 1 }] }
      ] } },

    /* ── 12.16 Cauchy 數列 ── */
    { id: "cg-12c-013", topic: "limits", rank: 3, answerKind: "text",
      prompt: "\\text{下列哪一個數列滿足 }a_{n+1}-a_n\\to0\\text{，卻不是 Cauchy 數列？}",
      answers: ["aₙ = √n"], canonical: "aₙ = √n", distractors: ["aₙ = 1 + 1/n", "aₙ = (−1)ⁿ"], timeLimit: 100,
      tags: ["cauchy-definition", "cauchy-sequence", "sequence"],
      hints: ["Cauchy 要求的是「任意兩項」|aₘ − aₙ| 都小，不只是相鄰兩項。", "在 ℝ 中 Cauchy ⇔ 收斂；哪一個相鄰差 → 0 卻不收斂？"],
      solution: "√(n+1) − √n = 1/(√(n+1) + √n) → 0，但 √n → ∞ 不收斂，所以不是 Cauchy（a₄ₙ − aₙ = √n 不趨近 0）。1 + 1/n 收斂所以是 Cauchy；(−1)ⁿ 的相鄰差恆為 2。",
      solutionSteps: ["√(n+1) − √n = 1/(√(n+1) + √n) → 0。", "|a₄ₙ − aₙ| = 2√n − √n = √n → ∞：不是 Cauchy。", "1 + 1/n 收斂（是 Cauchy）；|(−1)ⁿ⁺¹ − (−1)ⁿ| = 2，相鄰差不趨近 0。"],
      verify: { m: "choice", options: [
        { say: "aₙ = √n", all: [{ v: LIMX("\\sqrt{n+1}-\\sqrt{n}"), eq: 0 }, { v: LIMX("\\frac{1}{\\sqrt{n}}"), eq: 0 }] },
        { say: "aₙ = 1 + 1/n", all: [{ v: LIMX("\\frac{1}{n+1}-\\frac{1}{n}"), eq: 0 }, { v: LSUP("1+\\frac{1}{n}"), gt: LINF("1+\\frac{1}{n}") }] },
        { say: "aₙ = (−1)ⁿ", all: [{ v: LIM("|(-1)^{n+1}-(-1)^n|"), eq: 0 }] }
      ] } },
    { id: "cg-12c-014", topic: "limits", rank: 2, answerKind: "text",
      prompt: "a_n=\\sum_{k=1}^{n}\\frac{1}{k(k+1)}\\quad\\text{是不是 Cauchy 數列？}",
      answers: ["是"], canonical: "是", distractors: ["不是：它一直變大，沒有上界", "不是：a_{n+1} − a_n 不趨近 0"], timeLimit: 90,
      tags: ["cauchy-definition", "cauchy-sequence", "telescoping"],
      hints: ["1/(k(k+1)) = 1/k − 1/(k+1)，部分和可以伸縮。", "對 m > n 算 |aₘ − aₙ| 的上界。"],
      solution: "伸縮：aₙ = 1 − 1/(n+1)。m > n 時 |aₘ − aₙ| = 1/(n+1) − 1/(m+1) < 1/(n+1)，給 ε 取 N > 1/ε 即可，是 Cauchy（也收斂到 1）。它有上界 1，相鄰差 1/((n+1)(n+2)) → 0。",
      solutionSteps: ["aₙ = Σ(1/k − 1/(k+1)) = 1 − 1/(n+1)。", "m > n：|aₘ − aₙ| = 1/(n+1) − 1/(m+1) < 1/(n+1)。", "n ≥ N > 1/ε 時 < ε：是 Cauchy 數列。"],
      verify: { m: "choice", options: [
        { say: "是", all: [{ v: { m: "series", f: "\\frac{1}{n(n+1)}", from: 1 }, eq: 1 }] },
        { say: "不是：它一直變大，沒有上界", all: [{ v: { m: "series", f: "\\frac{1}{n(n+1)}", from: 1 }, gt: 10 }] },
        { say: "不是：a_{n+1} − a_n 不趨近 0", all: [{ v: LIMX("\\frac{1}{(n+1)(n+2)}"), ne: 0 }] }
      ] } },
    { id: "cg-12c-015", topic: "limits", rank: 2, answerKind: "numeric",
      prompt: "\\text{已知對所有 }m>n\\text{ 都有 }|a_m-a_n|\\le\\frac{3}{n}\\text{。只用這個上界，要保證 }m>n\\ge N\\text{ 時 }|a_m-a_n|<0.0007\\text{，最小的 }N\\text{ 是多少？}",
      answer: "4286", timeLimit: 100,
      tags: ["cauchy-prove-convergence", "cauchy-sequence"],
      hints: ["n ≥ N 時 3/n ≤ 3/N，所以只要 3/N < ε。", "解 3/N < 0.0007，往上取整數。"],
      solution: "要 3/N < 0.0007 ⇔ N > 3/0.0007 ≈ 4285.7，最小 N = 4286。之後 m > n ≥ N 時 |aₘ − aₙ| ≤ 3/n ≤ 3/N < 0.0007。",
      solutionSteps: ["n ≥ N ⇒ |aₘ − aₙ| ≤ 3/n ≤ 3/N。", "3/N < 0.0007 ⇔ N > 4285.71…", "最小的 N = 4286。"],
      verify: { m: "firstIndex", f: "\\frac{3}{n}", below: 0.0007 } },
    { id: "cg-12c-016", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "a_n=\\sum_{k=1}^{n}\\frac{1}{3^k}\\text{。要讓所有 }m>n\\ge N\\text{ 都有 }|a_m-a_n|<10^{-4}\\text{，最小的 }N\\text{ 是多少？}",
      answer: "8", timeLimit: 150,
      tags: ["cauchy-prove-convergence", "cauchy-sequence", "geometric"],
      hints: ["|aₘ − aₙ| = 1/3ⁿ⁺¹ + … + 1/3ᵐ，用等比級數的和把它往上估。", "對所有 m 都要成立：上界取 m → ∞ 的那個值。"],
      solution: "|aₘ − aₙ| = Σ_{k=n+1}^{m} 3⁻ᵏ < 3⁻ⁿ/2，而且 m 夠大時任意接近 3⁻ⁿ/2。要 3⁻ⁿ/2 ≤ 10⁻⁴ ⇔ 3ⁿ ≥ 5000：3⁷ = 2187 不夠，3⁸ = 6561，N = 8。",
      solutionSteps: ["|aₘ − aₙ| = Σ_{k=n+1}^{m} 3⁻ᵏ < Σ_{k=n+1}^{∞} 3⁻ᵏ = 1/(2·3ⁿ)。", "n = 7：1/(2·2187) ≈ 2.29×10⁻⁴，m 夠大時會超過 10⁻⁴。", "n = 8：1/(2·6561) ≈ 7.6×10⁻⁵ < 10⁻⁴，N = 8。"],
      verify: { m: "firstIndex", f: "\\sum_{k=n+1}^{n+40}3^{-k}", below: 0.0001 } },

    /* ── 12.17 Bolzano–Weierstrass ── */
    { id: "cg-12c-017", topic: "limits", rank: 3, answerKind: "text",
      prompt: "a_n=\\cos\\frac{n\\pi}{3}\\quad\\text{所有收斂子數列的極限構成的集合是？}",
      answers: ["{−1, −1/2, 1/2, 1}"], canonical: "{−1, −1/2, 1/2, 1}", distractors: ["{−1, 1}", "{−1/2, 1/2}", "[−1, 1]"], timeLimit: 120,
      tags: ["bw-subsequence-limits", "subsequence", "trig"],
      hints: ["cos(nπ/3) 以 6 為週期，列出 n = 1, …, 6 的值。", "週期數列的子數列極限，就是無窮多次出現的那些值。"],
      solution: "一個週期是 1/2, −1/2, −1, −1/2, 1/2, 1，每個值都無窮多次出現，取那些項就得到常數子數列。子數列極限集合 = {−1, −1/2, 1/2, 1}。0 不會被逼近，所以不是 [−1, 1]。",
      solutionSteps: ["n = 1…6：1/2, −1/2, −1, −1/2, 1/2, 1，之後重複。", "每個值都出現無窮多次 ⇒ 都是子數列極限。", "任何收斂子數列最後只能停在這四個值之一：{−1, −1/2, 1/2, 1}。"],
      verify: { m: "choice", options: [
        { say: "{−1, −1/2, 1/2, 1}", all: [
          { v: LIM("\\cos\\frac{(6n+1)\\pi}{3}"), eq: 0.5 }, { v: LIM("\\cos\\frac{(6n+2)\\pi}{3}"), eq: -0.5 },
          { v: LIM("\\cos\\frac{(6n+3)\\pi}{3}"), eq: -1 }, { v: LIM("\\cos\\frac{(6n+4)\\pi}{3}"), eq: -0.5 },
          { v: LIM("\\cos\\frac{(6n+5)\\pi}{3}"), eq: 0.5 }, { v: LIM("\\cos\\frac{(6n+6)\\pi}{3}"), eq: 1 }] },
        { say: "{−1, 1}", all: [{ v: { m: "let", f: "(L+1)(L-1)", with: { L: LIM("\\cos\\frac{(6n+1)\\pi}{3}") } }, eq: 0 }] },
        { say: "{−1/2, 1/2}", all: [{ v: { m: "let", f: "(L+\\frac{1}{2})(L-\\frac{1}{2})", with: { L: LIM("\\cos\\frac{(6n+6)\\pi}{3}") } }, eq: 0 }] },
        { say: "[−1, 1]", all: [{ v: LINF("\\left|\\cos\\frac{n\\pi}{3}\\right|"), le: 0 }] }
      ] } },
    { id: "cg-12c-018", topic: "limits", rank: 3, answerKind: "text",
      prompt: "a_n=\\frac{n}{n+1}\\sin\\frac{n\\pi}{2}\\quad\\text{所有收斂子數列的極限構成的集合是？}",
      answers: ["{−1, 0, 1}"], canonical: "{−1, 0, 1}", distractors: ["{−1, 1}", "{0}"], timeLimit: 120,
      tags: ["bw-subsequence-limits", "subsequence", "trig"],
      hints: ["sin(nπ/2) 以 4 為週期：依 n 除以 4 的餘數分成四個子數列。", "每個子數列乘上 n/(n+1) 之後各收斂到哪裡？"],
      solution: "n ≡ 1 (mod 4)：n/(n+1) → 1；n ≡ 3：−n/(n+1) → −1；n 偶數：恆為 0。四個子數列蓋住所有項，所以子數列極限集合 = {−1, 0, 1}。",
      solutionSteps: ["sin(nπ/2)：n ≡ 1, 2, 3, 0 (mod 4) 依序是 1, 0, −1, 0。", "對應子數列的極限：1、0、−1、0。", "這四個子數列蓋住全部項，集合是 {−1, 0, 1}。"],
      verify: { m: "choice", options: [
        { say: "{−1, 0, 1}", all: [
          { v: LIM("\\frac{4n+1}{4n+2}\\sin\\frac{(4n+1)\\pi}{2}"), eq: 1 }, { v: LIM("\\frac{4n+2}{4n+3}\\sin\\frac{(4n+2)\\pi}{2}"), eq: 0 },
          { v: LIM("\\frac{4n+3}{4n+4}\\sin\\frac{(4n+3)\\pi}{2}"), eq: -1 }, { v: LIM("\\frac{4n+4}{4n+5}\\sin\\frac{(4n+4)\\pi}{2}"), eq: 0 }] },
        { say: "{−1, 1}", all: [{ v: { m: "let", f: "(L+1)(L-1)", with: { L: LIM("\\frac{4n+2}{4n+3}\\sin\\frac{(4n+2)\\pi}{2}") } }, eq: 0 }] },
        { say: "{0}", all: [{ v: LIM("\\frac{4n+1}{4n+2}\\sin\\frac{(4n+1)\\pi}{2}"), eq: 0 }] }
      ] } },
    { id: "cg-12c-019", topic: "limits", rank: 4, answerKind: "text",
      prompt: "a_n=\\cos\\frac{2n\\pi}{3}+(-1)^n\\quad\\text{所有收斂子數列的極限構成的集合是？}",
      answers: ["{−3/2, 0, 1/2, 2}"], canonical: "{−3/2, 0, 1/2, 2}", distractors: ["{−3/2, 2}", "{−3/2, 1/2, 2}"], timeLimit: 180,
      tags: ["bw-subsequence-limits", "subsequence", "trig"],
      hints: ["兩個週期 3 與 2 合起來的週期是 6。", "把 n = 1, …, 6 的值都算出來，別只看最大和最小。"],
      solution: "n = 1…6：−3/2, 1/2, 0, 1/2, −3/2, 2，之後重複。每個值都無窮多次出現，子數列極限集合 = {−3/2, 0, 1/2, 2}。只寫 limsup 與 liminf 會漏掉中間的值。",
      solutionSteps: ["cos(2nπ/3)：−1/2, −1/2, 1, −1/2, −1/2, 1；(−1)ⁿ：−1, 1, −1, 1, −1, 1。", "相加：−3/2, 1/2, 0, 1/2, −3/2, 2，週期 6。", "集合 = {−3/2, 0, 1/2, 2}。"],
      verify: { m: "choice", options: [
        { say: "{−3/2, 0, 1/2, 2}", all: [
          { v: LIM("\\cos\\frac{2(6n+1)\\pi}{3}+(-1)^{6n+1}"), eq: -1.5 }, { v: LIM("\\cos\\frac{2(6n+2)\\pi}{3}+(-1)^{6n+2}"), eq: 0.5 },
          { v: LIM("\\cos\\frac{2(6n+3)\\pi}{3}+(-1)^{6n+3}"), eq: 0 }, { v: LIM("\\cos\\frac{2(6n+4)\\pi}{3}+(-1)^{6n+4}"), eq: 0.5 },
          { v: LIM("\\cos\\frac{2(6n+5)\\pi}{3}+(-1)^{6n+5}"), eq: -1.5 }, { v: LIM("\\cos\\frac{2(6n+6)\\pi}{3}+(-1)^{6n+6}"), eq: 2 }] },
        { say: "{−3/2, 2}", all: [{ v: { m: "let", f: "(L+\\frac{3}{2})(L-2)", with: { L: LIM("\\cos\\frac{2(6n+2)\\pi}{3}+(-1)^{6n+2}") } }, eq: 0 }] },
        { say: "{−3/2, 1/2, 2}", all: [{ v: { m: "let", f: "(L+\\frac{3}{2})(L-\\frac{1}{2})(L-2)", with: { L: LIM("\\cos\\frac{2(6n+3)\\pi}{3}+(-1)^{6n+3}") } }, eq: 0 }] }
      ] } },
    { id: "cg-12c-020", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{下列哪一個是 }(a_n)\\text{ 的子數列？}",
      answers: ["a₁, a₄, a₉, a₁₆, …"], canonical: "a₁, a₄, a₉, a₁₆, …", distractors: ["a₁, a₁, a₂, a₂, a₃, a₃, …", "a₂, a₁, a₄, a₃, a₆, a₅, …"], timeLimit: 70,
      tags: ["bw-subsequence-definition", "subsequence"],
      hints: ["子數列 (a_{n_k}) 的足標 n_k 必須嚴格遞增。", "把每個選項的足標寫成一列，看有沒有重複或倒退。"],
      solution: "足標 1, 4, 9, 16, …（n_k = k²）嚴格遞增，是子數列。1, 1, 2, 2, … 有重複；2, 1, 4, 3, … 會倒退，都不是子數列。",
      solutionSteps: ["子數列：n₁ < n₂ < n₃ < …。", "k² 嚴格遞增 ✓；⌈k/2⌉ = 1, 1, 2, 2, … 重複 ✗。", "足標 2, 1, 4, 3, …（k + (−1)ᵏ⁺¹）會倒退 ✗。答案是 a₁, a₄, a₉, …。"],
      verify: { m: "choice", options: [
        { say: "a₁, a₄, a₉, a₁₆, …", all: [{ v: INF("(n+1)^2-n^2"), ge: 1 }] },
        { say: "a₁, a₁, a₂, a₂, a₃, a₃, …", all: [{ v: INF("\\lceil (n+1)/2\\rceil-\\lceil n/2\\rceil"), ge: 1 }] },
        { say: "a₂, a₁, a₄, a₃, a₆, a₅, …", all: [{ v: INF("\\left((n+1)-(-1)^{n+1}\\right)-\\left(n-(-1)^n\\right)"), ge: 1 }] }
      ] } },
    { id: "cg-12c-021", topic: "limits", rank: 2, answerKind: "text",
      prompt: "\\text{下列哪一個足標 }n_k\\ (k=1,2,3,\\dots)\\text{ 讓 }(a_{n_k})\\text{ 成為 }(a_n)\\text{ 的子數列？}",
      answers: ["n_k = k(k+1)/2"], canonical: "n_k = k(k+1)/2", distractors: ["n_k = 2k + (−1)ᵏ", "n_k = |k − 4| + 1"], timeLimit: 90,
      tags: ["bw-subsequence-definition", "subsequence"],
      hints: ["算 n_{k+1} − n_k，看它是否對所有 k 都 ≥ 1。", "把 k = 1, 2, 3, 4, 5 代進每個選項列出來。"],
      solution: "k(k+1)/2：1, 3, 6, 10, …，n_{k+1} − n_k = k + 1 ≥ 2，嚴格遞增。2k + (−1)ᵏ：1, 5, 5, 9, 9, … 有重複；|k − 4| + 1：4, 3, 2, 1, 2, … 先倒退。",
      solutionSteps: ["n_{k+1} − n_k = (k+1)(k+2)/2 − k(k+1)/2 = k + 1 ≥ 2 ✓。", "2k + (−1)ᵏ：1, 5, 5, 9, 9, …，差 4, 0, 4, 0 ✗。", "|k − 4| + 1：4, 3, 2, 1, 2, … 遞減 ✗。"],
      verify: { m: "choice", options: [
        { say: "n_k = k(k+1)/2", all: [{ v: INF("\\frac{(n+1)(n+2)}{2}-\\frac{n(n+1)}{2}"), ge: 1 }] },
        { say: "n_k = 2k + (−1)ᵏ", all: [{ v: INF("\\left(2(n+1)+(-1)^{n+1}\\right)-\\left(2n+(-1)^n\\right)"), ge: 1 }] },
        { say: "n_k = |k − 4| + 1", all: [{ v: INF("|n-3|-|n-4|"), ge: 1 }] }
      ] } },

    /* ── 12.18 上極限與下極限 ── */
    { id: "cg-12c-022", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "a_n=(-1)^n\\left(1+\\frac{3}{n}\\right),\\ s_n=\\sup_{k\\ge n}a_k\\quad\\text{求 }s_7",
      answer: "11/8", timeLimit: 120,
      tags: ["limsup-tail-sup", "limsup", "sequence"],
      hints: ["k ≥ 7 的項裡，奇數項都是負的，只看偶數項。", "偶數項 1 + 3/k 遞減：k ≥ 7 的第一個偶數是誰？"],
      solution: "k ≥ 7 時奇數項為負，偶數項 1 + 3/k 遞減，最大的是 k = 8：1 + 3/8 = 11/8。一般地 sₙ 是 n 之後第一個偶數 k 的 1 + 3/k，sₙ → 1 = limsup aₙ。",
      solutionSteps: ["k 奇：aₖ = −(1 + 3/k) < 0。", "k 偶：aₖ = 1 + 3/k，遞減。", "s₇ = a₈ = 1 + 3/8 = 11/8。"],
      verify: { m: "extremeOf", f: "(-1)^{n+6}\\left(1+\\frac{3}{n+6}\\right)", kind: "sup" } },
    { id: "cg-12c-023", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "a_n=\\frac{(3+(-1)^n)\\,n}{n+1},\\ s_n=\\sup_{k\\ge n}a_k\\quad\\text{求 }s_{10}",
      answer: "4", timeLimit: 120,
      tags: ["limsup-tail-sup", "limsup", "sequence"],
      hints: ["分奇偶：偶數項是 4k/(k+1)，奇數項是 2k/(k+1)。", "偶數項遞增：sup 是取得到的某一項，還是極限？"],
      solution: "偶數項 4k/(k+1) 遞增趨近 4（取不到），奇數項 < 2。所以對每個 n，sₙ = 4（不是最大元，是上確界）。sₙ 是常數，lim sₙ = 4 = limsup aₙ。",
      solutionSteps: ["k 偶：aₖ = 4k/(k+1) = 4 − 4/(k+1)，遞增趨近 4。", "k 奇：aₖ = 2k/(k+1) < 2。", "s₁₀ = sup{aₖ : k ≥ 10} = 4。"],
      verify: { m: "extremeOf", f: "\\frac{(3+(-1)^{n+9})(n+9)}{n+10}", kind: "sup" } },
    { id: "cg-12c-024", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "a_n=(-1)^n+\\frac{4}{n}\\quad\\text{求 }\\sup_{n\\ge1}a_n-\\limsup_{n\\to\\infty}a_n",
      answer: "2", timeLimit: 120,
      tags: ["limsup-vs-sup", "limsup", "supremum"],
      hints: ["sup 要看所有的項，包括最前面幾項；limsup 只看尾巴。", "列出 a₁、a₂、a₄，再看偶數項的極限。"],
      solution: "a₁ = −1 + 4 = 3，a₂ = 1 + 2 = 3，之後偶數項 1 + 4/n ≤ 2、奇數項 ≤ 1/3，所以 sup = 3。偶數項 → 1、奇數項 → −1，limsup = 1。差 = 2。",
      solutionSteps: ["a₁ = 3，a₂ = 3，a₃ = 1/3，a₄ = 2，…：sup aₙ = 3。", "偶數項 1 + 4/n → 1，奇數項 −1 + 4/n → −1：limsup = 1。", "sup − limsup = 3 − 1 = 2。"],
      verify: { m: "let", f: "s-l", with: { s: SUP("(-1)^n+\\frac{4}{n}"), l: LSUP("(-1)^n+\\frac{4}{n}") } } },
    { id: "cg-12c-025", topic: "limits", rank: 3, answerKind: "numeric",
      prompt: "a_n=(-1)^n-\\frac{6}{n}\\quad\\text{求 }\\liminf_{n\\to\\infty}a_n-\\inf_{n\\ge1}a_n",
      answer: "6", timeLimit: 120,
      tags: ["limsup-vs-sup", "limsup", "infimum"],
      hints: ["inf 由最前面的項決定，liminf 只看尾巴。", "奇數項 −1 − 6/n 遞增；最小的是哪一項？"],
      solution: "奇數項 −1 − 6/n 遞增，最小的是 a₁ = −7；偶數項都 ≥ −2。所以 inf = −7。奇數項 → −1、偶數項 → 1，liminf = −1。差 = −1 − (−7) = 6。",
      solutionSteps: ["a₁ = −7，a₂ = −2，a₃ = −3，…：inf aₙ = −7（取到）。", "奇數項 → −1，偶數項 → 1：liminf = −1。", "liminf − inf = −1 − (−7) = 6。"],
      verify: { m: "let", f: "l-s", with: { s: INF("(-1)^n-\\frac{6}{n}"), l: LINF("(-1)^n-\\frac{6}{n}") } } }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE, difficulty: Math.min(4, problem.rank), ...problem })));
})();
