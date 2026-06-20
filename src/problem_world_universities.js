(function () {
  "use strict";

  // World top-university calculus pack: easy -> hard -> brutal.
  // Sources are styled after MIT 18.01/18.02, Cambridge Tripos, Oxford,
  // Princeton, Harvard Math 55, Caltech, Berkeley, ETH, Todai (東大) and
  // the Putnam competition. Answers use WebWork notation (log = ln).
  const SOURCE = "World university & competition pack 2026";
  const TIME = { 1: 35, 2: 55, 3: 80, 4: 130, 5: 200, 6: 320 };
  const problems = [];

  function add(p) {
    const rank = p.rank || 3;
    problems.push({
      source: SOURCE,
      difficulty: Math.min(4, Math.ceil((rank * 4) / 6)),
      timeLimit: TIME[rank] || 120,
      tabLimit: 1,
      ...p,
      tags: Array.from(new Set([...(p.tags || []), "world-universities", p.school].filter(Boolean)))
    });
  }

  function N(id, topic, rank, prompt, answer, school, tags, solution) {
    add({ id, topic, rank, prompt, answerKind: "numeric", answer, school, tags, solution });
  }
  function X(id, topic, rank, prompt, answer, variable, school, tags, solution) {
    add({ id, topic, rank, prompt, answerKind: "expression", answer, variable, variables: Array.isArray(variable) ? variable : undefined, school, tags, solution });
  }
  function A(id, rank, prompt, answer, school, tags, solution) {
    add({ id, topic: "integrals", rank, prompt, answerKind: "antiderivative", answer, variable: "x", school, tags, solution });
  }
  function T(id, topic, rank, prompt, answers, canonical, school, tags, solution) {
    add({ id, topic, rank, prompt, answerKind: "text", answers, canonical, school, tags, solution });
  }

  /* ===== TIER 1 — Easy (rank 1-2) ===== */
  N("world-001", "limits", 1, "\\lim_{x\\to 0}\\frac{\\sin(5x)}{\\sin(3x)}", "5/3", "MIT", ["trig-limit"], "Both behave like their argument near 0.");
  N("world-002", "limits", 2, "\\lim_{x\\to 0}\\frac{2^x-1}{x}", "log(2)", "MIT", ["exponential-limit"], "Derivative of 2^x at 0 is log 2.");
  N("world-003", "limits", 2, "\\lim_{x\\to\\infty}\\left(1+\\frac{3}{x}\\right)^{x}", "exp(3)", "Berkeley", ["exponential-limit"], "Standard e-limit gives e^3.");
  N("world-004", "limits", 2, "\\lim_{x\\to 0}\\left(1+\\sin x\\right)^{1/x}", "exp(1)", "Oxford", ["exponential-limit"], "log(1+sin x)/x -> 1.");
  N("world-005", "derivatives", 1, "\\frac{d}{dx}\\arctan x", "1/(1+x^2)", "MIT", ["inverse-trig"], "Standard derivative.");
  N("world-006", "derivatives", 2, "\\left.\\frac{d}{dx}\\left(x^{x}\\right)\\right|_{x=1}", "1", "Harvard", ["log-differentiation"], "x^x(log x + 1), at x=1 gives 1.");
  N("world-007", "integrals", 1, "\\int_0^1 (3x^2+2x)\\,dx", "2", "MIT", ["polynomial"], "Antiderivative x^3+x^2 evaluated 0..1.");
  N("world-008", "integrals", 2, "\\int_0^{\\pi} \\sin^2 x\\,dx", "pi/2", "MIT", ["trig-integral"], "Average of sin^2 over a period is 1/2.");
  N("world-009", "integrals", 2, "\\int_1^{e} \\frac{1}{x}\\,dx", "1", "Cambridge", ["log-integral"], "log e - log 1 = 1.");
  N("world-010", "series", 2, "\\sum_{n=0}^{\\infty}\\frac{1}{2^n}", "2", "MIT", ["geometric"], "Geometric series with ratio 1/2.");
  N("world-011", "series", 3, "\\sum_{n=1}^{\\infty}\\frac{1}{(3n-2)(3n+1)}", "1/3", "Princeton", ["telescoping"], "1/3(1/(3n-2)-1/(3n+1)) telescopes to 1/3.");
  N("world-012", "limits", 2, "\\lim_{x\\to 0}\\frac{e^{x}-e^{\\sin x}}{x-\\sin x}", "1", "Cambridge", ["exponential-limit"], "Factor e^{sin x}(e^{x-sin x}-1).");

  /* ===== TIER 2 — Medium (rank 3-4) ===== */
  N("world-013", "limits", 3, "\\lim_{x\\to 0}\\frac{\\sinh x-x}{x^3}", "1/6", "Princeton", ["taylor", "hyperbolic"], "sinh x = x + x^3/6 + ...");
  N("world-014", "limits", 3, "\\lim_{x\\to 0}\\frac{x-\\arctan x}{x^3}", "1/3", "MIT", ["taylor", "inverse-trig"], "arctan x = x - x^3/3 + ...");
  N("world-015", "limits", 3, "\\lim_{x\\to 0}\\left(\\frac{1}{\\sin^2 x}-\\frac{1}{x^2}\\right)", "1/3", "Cambridge", ["taylor", "trig-limit"], "Expand sin^2 x = x^2 - x^4/3 + ...");
  N("world-016", "limits", 3, "\\lim_{x\\to 0}(\\cos x)^{1/x^2}", "exp(-1/2)", "Harvard", ["exponential-limit", "taylor"], "log cos x ~ -x^2/2.");
  N("world-017", "limits", 4, "\\lim_{x\\to 0}(\\cosh x)^{1/x^2}", "exp(1/2)", "Princeton", ["exponential-limit", "taylor"], "log cosh x ~ x^2/2.");
  N("world-018", "limits", 4, "\\lim_{x\\to\\infty}\\left(\\frac{x+1}{x-1}\\right)^{x}", "exp(2)", "ETH", ["exponential-limit"], "x log((x+1)/(x-1)) -> 2.");
  N("world-019", "limits", 4, "\\lim_{x\\to 0}\\left(\\frac{\\tan x}{x}\\right)^{1/x^2}", "exp(1/3)", "Todai", ["exponential-limit", "taylor"], "log(tan x / x) ~ x^2/3.");
  N("world-020", "limits", 4, "\\lim_{n\\to\\infty}\\left(n!\\right)^{1/n}\\Big/ n", "exp(-1)", "Putnam", ["stirling"], "By Stirling, (n!)^{1/n}/n -> 1/e.");
  N("world-021", "derivatives", 3, "\\frac{d}{dx}\\left(x^{1/x}\\right)", "x^(1/x)*(1-log(x))/x^2", "x", "Caltech", ["log-differentiation"], "Differentiate (log x)/x in the exponent.");
  X("world-022", "derivatives", 4, "\\frac{d}{dx}\\left((\\cos x)^{\\sin x}\\right)", "cos(x)^sin(x)*(cos(x)*log(cos(x))-sin(x)*tan(x))", "x", "Harvard", ["log-differentiation", "trig"], "Log differentiate sin x * log cos x.");
  X("world-023", "derivatives", 4, "\\frac{d}{dx}\\int_{0}^{x^2}\\sin(t)\\,dt", "2*x*sin(x^2)", "x", "MIT", ["fundamental-theorem", "chain-rule"], "FTC plus chain rule.");
  N("world-024", "derivatives", 5, "\\left.\\frac{d^{5}}{dx^{5}}\\arctan x\\right|_{x=0}", "24", "Princeton", ["higher-derivative", "taylor"], "Coefficient of x^5 is 1/5, times 5! = 24.");
  N("world-025", "derivatives", 5, "\\left.\\frac{d^{10}}{dx^{10}}\\left(x^2 e^{x}\\right)\\right|_{x=0}", "90", "Caltech", ["higher-derivative", "taylor"], "Coefficient of x^10 is 1/8!, times 10! = 90.");
  N("world-026", "integrals", 4, "\\int_0^{\\pi/2}\\sin^6 x\\,dx", "5*pi/32", "MIT", ["wallis"], "Wallis: 5π/32.");
  N("world-027", "integrals", 4, "\\int_0^{\\pi} x\\cos^2 x\\,dx", "pi^2/4", "Cambridge", ["integration-by-parts"], "Use cos^2 x = (1+cos 2x)/2.");
  N("world-028", "integrals", 4, "\\int_0^{2\\pi}\\frac{dx}{2+\\cos x}", "2*pi/sqrt(3)", "Oxford", ["weierstrass"], "Weierstrass t=tan(x/2).");
  N("world-029", "integrals", 4, "\\int_0^{1}\\frac{\\log(1+x^2)}{x}\\,dx", "pi^2/24", "Harvard", ["dilogarithm"], "Let u=x^2: half of ∫log(1+u)/u.");
  N("world-030", "integrals", 4, "\\int_0^{1}(\\log x)^3\\,dx", "-6", "Cambridge", ["gamma-function"], "∫_0^1 (log x)^n dx = (-1)^n n!.");
  N("world-031", "integrals", 4, "\\int_0^{1}\\frac{x-1}{\\log x}\\,dx", "log(2)", "Putnam", ["frullani", "feynman"], "∫_0^1 (x^a-1)/log x dx = log(a+1).");
  N("world-032", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{1}{n^6}", "pi^6/945", "Cambridge", ["zeta"], "ζ(6)=π^6/945.");
  N("world-033", "series", 3, "\\sum_{n=0}^{\\infty}\\frac{1}{(2n+1)^2}", "pi^2/8", "MIT", ["zeta"], "Odd part of ζ(2).");
  N("world-034", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{1}{(2n-1)(2n+1)(2n+3)}", "1/12", "Princeton", ["telescoping"], "Telescoping to 1/12.");
  N("world-035", "series", 4, "\\sum_{n=2}^{\\infty}\\frac{1}{n^2-1}", "3/4", "Oxford", ["telescoping"], "1/2(1/(n-1)-1/(n+1)) telescopes to 3/4.");
  N("world-036", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{2n-1}", "pi/4", "Leibniz", ["alternating", "arctan-series"], "Leibniz series for π/4.");
  N("world-037", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{n^3}{4^n}", "44/27", "Berkeley", ["power-series"], "Differentiate the geometric series three times.");
  N("world-038", "series", 4, "\\text{收斂半徑：}\\sum_{n=1}^{\\infty}\\frac{(2n)!}{(n!)^2}x^n", "1/4", "ETH", ["power-series", "radius"], "Central binomial ratio -> 4, so R=1/4.");

  /* ===== TIER 3 — Hard (rank 5) ===== */
  N("world-039", "integrals", 5, "\\int_{0}^{\\infty} e^{-x^2}\\,dx", "sqrt(pi)/2", "MIT", ["gaussian"], "Gaussian integral.");
  N("world-040", "integrals", 5, "\\int_{-\\infty}^{\\infty} e^{-x^2/2}\\,dx", "sqrt(2*pi)", "Princeton", ["gaussian"], "Scale the Gaussian.");
  N("world-041", "integrals", 5, "\\int_{0}^{\\infty}\\frac{\\sin x}{x}\\,dx", "pi/2", "Cambridge", ["dirichlet"], "Dirichlet integral.");
  N("world-042", "integrals", 5, "\\int_{0}^{\\infty}\\frac{x}{e^{x}+1}\\,dx", "pi^2/12", "Caltech", ["zeta", "fermi"], "Equals η(2)Γ(2)=π^2/12.");
  N("world-043", "integrals", 5, "\\int_{0}^{\\infty}\\frac{dx}{1+x^4}", "pi/(2*sqrt(2))", "Harvard", ["rational", "contour"], "Standard value π/(2√2).");
  N("world-044", "integrals", 5, "\\int_{0}^{\\infty}\\frac{dx}{(1+x^2)^2}", "pi/4", "MIT", ["trig-substitution"], "x=tan θ gives π/4.");
  N("world-045", "integrals", 5, "\\int_{0}^{\\infty} e^{-x}\\sin x\\,dx", "1/2", "Oxford", ["integration-by-parts"], "Imaginary part of 1/(1-i).");
  N("world-046", "integrals", 5, "\\int_{0}^{\\infty} x^{2} e^{-x^{2}}\\,dx", "sqrt(pi)/4", "Princeton", ["gaussian", "gamma-function"], "Γ(3/2)/2 = √π/4.");
  N("world-047", "integrals", 5, "\\int_{0}^{2\\pi}\\frac{dx}{5+4\\cos x}", "2*pi/3", "ETH", ["weierstrass"], "Standard value 2π/3.");
  N("world-048", "integrals", 5, "\\int_{0}^{\\pi/2} x\\cot x\\,dx", "pi*log(2)/2", "Cambridge", ["log-integral", "fourier"], "Equals (π/2) log 2.");
  N("world-049", "integrals", 5, "\\int_{0}^{1}\\log^2 x\\,dx", "2", "MIT", ["gamma-function"], "∫_0^1 (log x)^n dx = (-1)^n n!.");
  N("world-050", "integrals", 5, "\\int_{0}^{1} x^{3}\\log x\\,dx", "-1/16", "Harvard", ["integration-by-parts"], "By parts: x^4/4 log x - x^4/16.");
  N("world-051", "limits", 5, "\\lim_{x\\to\\infty}\\frac{\\Gamma(x+1)^{1/x}}{x}", "exp(-1)", "Putnam", ["stirling", "gamma-function"], "Stirling again gives 1/e.");
  N("world-052", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{H_n}{2^n}", "2*log(2)", "Putnam", ["harmonic", "generating-function"], "Σ H_n x^n = -log(1-x)/(1-x); x=1/2.");
  N("world-053", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{1}{n^2 2^{n}}", "pi^2/12-log(2)^2/2", "Princeton", ["dilogarithm"], "Li_2(1/2)=π^2/12-(log 2)^2/2.");
  N("world-054", "integrals", 5, "\\iint_{x^2+y^2\\le 1} e^{-(x^2+y^2)}\\,dA", "pi*(1-exp(-1))", "MIT", ["multivariable", "polar"], "Polar: 2π∫_0^1 r e^{-r^2} dr.");
  N("world-055", "integrals", 5, "\\int_{0}^{\\infty}\\frac{e^{-x}-e^{-2x}}{x}\\,dx", "log(2)", "Cambridge", ["frullani"], "Frullani: log(2/1).");
  N("world-056", "integrals", 5, "\\int_{0}^{1}\\frac{\\log x}{x-1}\\,dx", "pi^2/6", "Harvard", ["dilogarithm"], "Expand 1/(1-x) and integrate term by term.");
  N("world-057", "derivatives", 5, "\\left.\\frac{d^{3}}{dx^{3}}\\left(e^{3x}\\cos x\\right)\\right|_{x=0}", "18", "Caltech", ["higher-derivative", "complex"], "Real part of (3+i)^3 = 18.");
  N("world-058", "integrals", 5, "\\int_{0}^{\\pi/2}\\cos^5 x\\,dx", "8/15", "Berkeley", ["wallis", "trig-integral"], "Wallis odd: 4*2/(5*3*1)=8/15.");

  /* ===== TIER 4 — Brutal (rank 6) ===== */
  N("world-059", "integrals", 6, "\\int_{0}^{\\infty}\\frac{\\log(1+x^2)}{1+x^2}\\,dx", "pi*log(2)", "Putnam", ["feynman", "log-integral"], "Feynman differentiation under the integral.");
  N("world-060", "integrals", 6, "\\int_{0}^{\\pi/2}\\log^2(\\sin x)\\,dx", "pi*log(2)^2/2+pi^3/24", "Cambridge", ["fourier", "log-integral"], "Classic value (π/2)log^2 2 + π^3/24.");
  N("world-061", "integrals", 6, "\\int_{0}^{\\infty} e^{-x}\\,\\frac{\\sin x}{x}\\,dx", "pi/4", "MIT", ["frullani", "laplace"], "∫_0^∞ e^{-sx} sin x / x dx = arctan(1/s); s=1.");
  N("world-062", "integrals", 6, "\\int_{0}^{\\infty} e^{-x^2}\\cos x\\,dx", "sqrt(pi)*exp(-1/4)/2", "Princeton", ["gaussian", "feynman"], "Differentiate under the integral in the frequency.");
  N("world-063", "integrals", 6, "\\int_{0}^{1}\\frac{dx}{1+x^3}", "log(2)/3+pi/(3*sqrt(3))", "Harvard", ["partial-fractions"], "Factor 1+x^3 and integrate.");
  N("world-064", "integrals", 6, "\\int_{0}^{1}\\frac{x^3-1}{\\log x}\\,dx", "log(4)", "Putnam", ["frullani", "feynman"], "∫_0^1 (x^a-1)/log x dx = log(a+1), a=3.");
  N("world-065", "integrals", 6, "\\int_{0}^{1}\\frac{\\arctan\\!\\left(\\sqrt{x^2+2}\\right)}{(x^2+1)\\sqrt{x^2+2}}\\,dx", "5*pi^2/96", "Putnam", ["ahmed-integral"], "Ahmed's integral over [0,1] equals 5π^2/96.");
  N("world-066", "series", 6, "\\sum_{n=0}^{\\infty}\\frac{(-1)^{n}}{(2n+1)^3}", "pi^3/32", "Cambridge", ["dirichlet-beta"], "β(3)=π^3/32.");
  N("world-067", "integrals", 6, "\\int_{0}^{1}\\frac{\\log(1-x)}{x}\\,dx", "-pi^2/6", "Harvard", ["dilogarithm"], "= -Li_2(1) = -π^2/6.");
  N("world-068", "integrals", 6, "\\int_{0}^{\\pi/2}\\frac{x}{\\tan x}\\,dx", "pi*log(2)/2", "Todai", ["fourier", "log-integral"], "Same as ∫ x cot x = (π/2) log 2.");
  N("world-069", "integrals", 6, "\\int_{0}^{\\infty}\\frac{x^{2}}{(1+x^{2})^{3}}\\,dx", "pi/16", "Caltech", ["beta-function", "trig-substitution"], "Beta function value π/16.");
  N("world-070", "limits", 6, "\\lim_{n\\to\\infty} n\\left(\\sqrt[n]{n}-1\\right)\\Big/\\log n", "1", "ETH", ["asymptotics"], "n^{1/n}-1 ~ (log n)/n.");

  /* ===== Extra spread (fill to 100) ===== */
  N("world-071", "limits", 2, "\\lim_{x\\to 0}\\frac{x-\\sin x\\cos x}{x^{3}}", "2/3", "MIT", ["taylor", "trig-limit"], "sin x cos x = (1/2)sin 2x.");
  N("world-072", "limits", 3, "\\lim_{x\\to 0}\\frac{e^{x}-1-x-\\tfrac{x^2}{2}}{x^{3}}", "1/6", "Harvard", ["taylor"], "Next term of e^x is x^3/6.");
  N("world-073", "limits", 3, "\\lim_{x\\to 0}\\frac{\\cosh x-1}{x^2}", "1/2", "Cambridge", ["taylor", "hyperbolic"], "cosh x = 1 + x^2/2 + ...");
  N("world-074", "limits", 4, "\\lim_{x\\to 0}\\frac{\\sqrt{1+x}-1-\\tfrac{x}{2}}{x^{2}}", "-1/8", "Oxford", ["taylor", "radical"], "(1+x)^{1/2}=1+x/2-x^2/8+...");
  N("world-075", "limits", 5, "\\lim_{x\\to 0}\\frac{(1+x)^{1/x}-e+\\tfrac{e x}{2}}{x^{2}}", "11*exp(1)/24", "Todai", ["exponential-limit", "taylor"], "(1+x)^{1/x}=e(1-x/2+11x^2/24-...).");
  N("world-076", "derivatives", 3, "\\frac{d}{dx}\\log\\!\\left(x+\\sqrt{1+x^2}\\right)", "1/sqrt(1+x^2)", "x", "MIT", ["inverse-hyperbolic"], "This is arcsinh x.");
  X("world-077", "derivatives", 3, "\\frac{d}{dx}\\left(x\\arctan x-\\tfrac{1}{2}\\log(1+x^2)\\right)", "arctan(x)", "x", "Princeton", ["inverse-trig"], "The log terms cancel, leaving arctan x.");
  X("world-078", "derivatives", 4, "\\frac{d}{dx}\\left((\\log x)^{x}\\right)", "log(x)^x*(log(log(x))+1/log(x))", "x", "Caltech", ["log-differentiation"], "Differentiate x log(log x).");
  N("world-079", "integrals", 4, "\\int_0^{1}\\frac{dx}{(1+x^2)^2}", "pi/8+1/4", "MIT", ["trig-substitution"], "x=tan θ then half-angle.");
  N("world-080", "integrals", 3, "\\int_0^{\\infty}\\frac{1}{(1+x)\\sqrt{x}}\\,dx", "pi", "Oxford", ["substitution"], "x=u^2 gives 2 arctan u.");
  N("world-081", "integrals", 4, "\\int_0^{1} x^2\\sqrt{1-x^2}\\,dx", "pi/16", "Cambridge", ["beta-function", "trig-substitution"], "Beta value π/16.");
  N("world-082", "integrals", 4, "\\int_0^{\\pi/2}\\sqrt{\\tan x}\\,dx", "pi/sqrt(2)", "Putnam", ["beta-function"], "Equals π/√2.");
  A("world-083", 4, "\\int \\tan^2 x\\,dx", "tan(x)-x", "MIT", ["trig-integral"], "tan^2 x = sec^2 x - 1.");
  A("world-084", 4, "\\int \\sec x\\,dx", "log(abs(sec(x)+tan(x)))", "Cambridge", ["trig-integral"], "Classic secant integral.");
  A("world-085", 4, "\\int \\frac{dx}{\\sqrt{1+x^2}}", "log(x+sqrt(1+x^2))", "Oxford", ["inverse-hyperbolic"], "arcsinh x.");
  A("world-086", 5, "\\int \\frac{1}{1+e^{x}}\\,dx", "x-log(1+exp(x))", "Princeton", ["substitution"], "Write 1 - e^x/(1+e^x).");
  N("world-087", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{1}{n(n+3)}", "11/18", "MIT", ["telescoping"], "1/3(1/n - 1/(n+3)) telescopes to (1/3)(1+1/2+1/3).");
  N("world-088", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{n}{5^{n}}", "5/16", "Berkeley", ["power-series"], "x/(1-x)^2 at x=1/5.");
  N("world-089", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{n^2}{5^{n}}", "15/32", "Caltech", ["power-series"], "x(1+x)/(1-x)^3 at x=1/5.");
  N("world-090", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{(-1)^{n+1}}{n^2+n}", "2*log(2)-1", "Harvard", ["alternating", "telescoping"], "(-1)^{n+1}(1/n-1/(n+1)) sums to 2log2-1.");
  T("world-091", "series", 4, "\\sum_{n=2}^{\\infty}\\frac{\\log n}{n}", ["divergent", "diverges"], "divergent", "Cambridge", ["integral-test"], "Bigger than the harmonic series.");
  T("world-092", "series", 4, "\\sum_{n=2}^{\\infty}\\frac{\\log n}{n^2}", ["convergent", "converges"], "convergent", "Princeton", ["integral-test"], "Integral test / compare to n^{-3/2}.");
  T("world-093", "series", 5, "\\sum_{n=1}^{\\infty}\\sin\\!\\left(\\frac{1}{n}\\right)", ["divergent", "diverges"], "divergent", "ETH", ["limit-comparison"], "sin(1/n) ~ 1/n, so it diverges like the harmonic series.");
  N("world-094", "integrals", 4, "\\int_0^{\\pi}\\frac{dx}{1+\\sin^2 x}", "pi/sqrt(2)", "Oxford", ["weierstrass"], "Equals π/√2.");
  N("world-095", "integrals", 6, "\\int_0^{\\infty}\\frac{dx}{(1+x^{2})(4+x^{2})}", "pi/12", "MIT", ["partial-fractions"], "π/(2ab(a+b)) with a=1,b=2.");
  N("world-096", "integrals", 6, "\\int_0^{\\infty}\\frac{x^{a-1}}{1+x}\\,dx\\;\\text{ at } a=\\tfrac12", "pi", "Cambridge", ["beta-function"], "Beta gives π/sin(πa); a=1/2 -> π.");
  N("world-097", "integrals", 6, "\\int_{-\\infty}^{\\infty}\\frac{\\cos x}{1+x^2}\\,dx", "pi/exp(1)", "Princeton", ["contour", "fourier"], "Residue gives π e^{-1}.");
  N("world-098", "integrals", 6, "\\int_0^{1}\\frac{\\log x}{1-x^2}\\,dx", "-pi^2/8", "Harvard", ["dilogarithm"], "Expand 1/(1-x^2): -Σ1/(2n+1)^2.");
  N("world-099", "limits", 6, "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{1}{\\sqrt{n^2+k}}", "1", "Putnam", ["riemann-sum", "squeeze"], "Squeeze between n/√(n^2+n) and n/√(n^2+1).");
  N("world-100", "integrals", 6, "\\int_0^{\\pi/2}\\log(\\cos x)\\,dx", "-pi*log(2)/2", "Todai", ["log-integral", "symmetry"], "By symmetry equal to the log-sine integral.");

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
