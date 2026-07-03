(function () {
  "use strict";

  // World top-university / competition pack: a short honest warm-up, then
  // genuinely hard problems calibrated against the existing boss bank.
  // Styled after MIT, Cambridge Tripos, Oxford, Princeton, Harvard, Caltech,
  // Berkeley, ETH, Todai and Putnam. Answers use WebWork notation (log = ln).
  const SOURCE = "World university & competition pack 2026";
  const TIME = { 1: 35, 2: 55, 3: 90, 4: 150, 5: 240, 6: 340 };
  const problems = [];

  function add(p) {
    const rank = p.rank || 3;
    const rankTags = [];
    if (rank >= 5) rankTags.push("boss-rank");
    if (rank >= 6) rankTags.push("true-boss");
    problems.push({
      source: SOURCE,
      difficulty: Math.min(4, Math.ceil((rank * 4) / 6)),
      timeLimit: TIME[rank] || 120,
      tabLimit: 1,
      ...p,
      tags: Array.from(new Set([...(p.tags || []), "world-universities", p.school, ...rankTags].filter(Boolean)))
    });
  }
  function N(id, topic, rank, prompt, answer, school, tags, solution) {
    add({ id, topic, rank, prompt, answerKind: "numeric", answer, school, tags, solution });
  }
  function X(id, topic, rank, prompt, answer, variable, school, tags, solution) {
    add({ id, topic, rank, prompt, answerKind: "expression", answer, variable, variables: Array.isArray(variable) ? variable : undefined, school, tags, solution });
  }

  /* ===== Warm-up (honest rank 1-2) ===== */
  N("world-001", "limits", 1, "\\lim_{x\\to 0}\\frac{\\sin(5x)}{\\sin(3x)}", "5/3", "MIT", ["trig-limit"], "Both behave like their argument.");
  N("world-002", "limits", 2, "\\lim_{x\\to 0}\\frac{2^x-1}{x}", "log(2)", "MIT", ["exponential-limit"], "Derivative of 2^x at 0.");
  N("world-003", "limits", 2, "\\lim_{x\\to\\infty}\\left(1+\\frac{3}{x}\\right)^{x}", "exp(3)", "Berkeley", ["exponential-limit"], "Standard e-limit.");
  X("world-004", "derivatives", 1, "\\frac{d}{dx}\\arctan x", "1/(1+x^2)", "x", "MIT", ["inverse-trig"], "Standard derivative.");
  N("world-005", "integrals", 2, "\\int_0^{\\pi/2}\\cos^5 x\\,dx", "8/15", "MIT", ["wallis"], "Wallis odd reduction.");
  N("world-006", "series", 2, "\\sum_{n=1}^{\\infty}\\frac{1}{(3n-2)(3n+1)}", "1/3", "Princeton", ["telescoping"], "Telescoping by 1/3.");
  N("world-007", "limits", 2, "\\lim_{x\\to 0}\\frac{\\sinh x-x}{x^3}", "1/6", "Oxford", ["taylor", "hyperbolic"], "sinh x = x + x^3/6 + ...");
  N("world-008", "limits", 2, "\\lim_{x\\to 0}\\frac{\\tan x-x}{x-\\sin x}", "2", "Cambridge", ["taylor", "trig-limit"], "x^3/3 over x^3/6.");
  N("world-009", "series", 2, "\\sum_{n=1}^{\\infty}\\frac{1}{n\\,3^n}", "log(3/2)", "Harvard", ["power-series"], "-log(1-1/3).");
  N("world-010", "integrals", 2, "\\int_0^{\\pi}\\cos^4 x\\,dx", "3*pi/8", "MIT", ["wallis"], "Wallis even reduction.");

  /* ===== Tier A — advanced (rank 3-4) ===== */
  N("world-011", "limits", 3, "\\lim_{x\\to 0}\\left(\\frac{2^x+8^x}{2}\\right)^{1/x}", "4", "Putnam", ["exponential-limit"], "Geometric-mean limit: √(2·8)=4.");
  N("world-012", "limits", 4, "\\lim_{x\\to 0}\\left(\\frac{1}{x^2}-\\cot^2 x\\right)", "2/3", "Princeton", ["taylor", "trig-limit"], "cot^2 x = 1/x^2 - 2/3 - ...");
  N("world-013", "limits", 4, "\\lim_{x\\to 0}\\left(\\frac{e^x-1}{x}\\right)^{1/x}", "exp(1/2)", "Todai", ["exponential-limit", "taylor"], "(e^x-1)/x = 1 + x/2 + ...; limit e^{1/2}.");
  N("world-014", "integrals", 4, "\\int_0^{\\pi/4}\\log(1+\\tan x)\\,dx", "pi*log(2)/8", "Putnam", ["kings-property", "log-integral"], "x -> π/4 - x symmetry.");
  N("world-015", "integrals", 4, "\\int_0^{1}\\frac{\\log(1+x)}{1+x^2}\\,dx", "pi*log(2)/8", "MIT", ["feynman"], "Substitute x=tan θ; the Putnam log integral.");
  N("world-016", "integrals", 4, "\\int_0^{\\infty}\\frac{\\cos(2x)-\\cos(3x)}{x}\\,dx", "log(3/2)", "Cambridge", ["frullani"], "Frullani for cosines.");
  N("world-017", "integrals", 4, "\\int_0^{\\infty}\\frac{dx}{1+x^3}", "2*pi/(3*sqrt(3))", "Harvard", ["beta-function"], "(π/3)/sin(π/3).");
  N("world-018", "integrals", 4, "\\int_0^{1}\\frac{\\log x}{(1+x)^2}\\,dx", "-log(2)", "Oxford", ["integration-by-parts"], "By parts gives -log 2.");
  N("world-019", "integrals", 4, "\\int_0^{1}\\frac{x^2-1}{\\log x}\\,dx", "log(3)", "Putnam", ["frullani", "feynman"], "∫_0^1 (x^a-1)/log x dx = log(a+1).");
  N("world-020", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{n^2}{n!}", "2*exp(1)", "Caltech", ["exponential-series"], "Σ n^2/n! = 2e.");
  N("world-021", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{n^3}{n!}", "5*exp(1)", "Caltech", ["exponential-series"], "Σ n^3/n! = 5e.");
  N("world-022", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{1}{n(2n+1)}", "2-2*log(2)", "Princeton", ["log-series"], "Equals 2 - 2 log 2.");
  N("world-023", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{1}{n^2(n+1)^2}", "pi^2/3-3", "ETH", ["zeta", "telescoping"], "Partial fractions to ζ(2) terms.");
  N("world-024", "derivatives", 4, "\\left.\\frac{d^4}{dx^4}\\left(e^{x}\\cos x\\right)\\right|_{x=0}", "-4", "Caltech", ["higher-derivative", "complex"], "Real part of (1+i)^4 = -4.");
  N("world-025", "derivatives", 4, "\\text{Coefficient of }x^5\\text{ in }\\tan x", "2/15", "MIT", ["taylor", "coefficient"], "tan x = x + x^3/3 + 2x^5/15 + ...");
  N("world-026", "limits", 4, "\\lim_{x\\to 0}\\frac{e^{x}-1-x-\\tfrac{x^2}{2}}{x^3}", "1/6", "Harvard", ["taylor"], "Next term of e^x.");
  N("world-027", "integrals", 4, "\\int_0^{\\infty} x e^{-x}\\sin x\\,dx", "1/2", "Oxford", ["integration-by-parts", "complex"], "Imaginary part of 1/(1-i)^2.");
  N("world-028", "series", 3, "\\text{收斂半徑：}\\sum_{n=1}^{\\infty}\\binom{2n}{n}x^n", "1/4", "ETH", ["power-series", "radius"], "binom(2n,n) ~ 4^n, so R = 1/4.");
  N("world-029", "integrals", 4, "\\int_0^{\\infty}\\frac{\\log x}{(1+x^2)^2}\\,dx", "-pi/4", "Princeton", ["feynman"], "Differentiate a Beta integral in a parameter.");
  N("world-030", "limits", 4, "\\lim_{x\\to 0}(\\cos x)^{1/\\sin^2 x}", "exp(-1/2)", "Cambridge", ["exponential-limit", "taylor"], "log cos x ~ -x^2/2 and sin^2 x ~ x^2.");

  /* ===== Tier B — hard (rank 5) ===== */
  N("world-031", "integrals", 5, "\\int_0^{\\infty}\\frac{x}{\\sinh x}\\,dx", "pi^2/4", "Cambridge", ["hyperbolic", "series"], "Expand 1/sinh and sum 1/(2k+1)^2.");
  N("world-032", "integrals", 5, "\\int_0^{1}\\frac{(\\log x)^2}{1+x^2}\\,dx", "pi^3/16", "Harvard", ["dirichlet-beta"], "Term-by-term gives π^3/16.");
  N("world-033", "integrals", 5, "\\int_0^{\\infty}\\frac{\\cos x-\\cos 3x}{x^2}\\,dx", "pi", "MIT", ["dirichlet"], "(π/2)(3-1)=π.");
  N("world-034", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{H_n}{n\\,2^n}", "pi^2/12", "Putnam", ["euler-sum", "dilogarithm"], "Euler sum equal to π^2/12.");
  N("world-035", "limits", 5, "\\lim_{n\\to\\infty}\\left(\\frac{(2n)!}{n!\\,n^n}\\right)^{1/n}", "4/exp(1)", "Putnam", ["stirling"], "Stirling gives 4/e.");
  N("world-036", "derivatives", 5, "\\text{Coefficient of }x^6\\text{ in }\\sec x", "61/720", "Caltech", ["taylor", "coefficient", "euler-number"], "Euler number E_6/6! = 61/720.");
  N("world-037", "integrals", 5, "\\int_0^{\\infty} e^{-x^2}\\cos(2x)\\,dx", "sqrt(pi)*exp(-1)/2", "Princeton", ["gaussian", "feynman"], "Gaussian shift gives (√π/2)e^{-1}.");
  N("world-038", "integrals", 5, "\\int_0^{\\infty}\\frac{\\sin^3 x}{x^3}\\,dx", "3*pi/8", "MIT", ["dirichlet"], "Use sin^3 = (3 sin x - sin 3x)/4.");
  N("world-039", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{1}{n^2\\binom{2n}{n}}", "pi^2/18", "ETH", ["central-binomial"], "Classic central-binomial sum.");
  N("world-040", "limits", 5, "\\lim_{x\\to 0}\\frac{(1+x)^{1/x}-e+\\tfrac{ex}{2}}{x^2}", "11*exp(1)/24", "Todai", ["exponential-limit", "taylor"], "(1+x)^{1/x}=e(1-x/2+11x^2/24-...).");
  N("world-041", "integrals", 5, "\\int_0^{1}\\frac{x-1}{\\log x}\\,dx", "log(2)", "Putnam", ["frullani"], "log(a+1) with a=1.");
  N("world-042", "series", 5, "\\text{收斂半徑：}\\sum_{n=1}^{\\infty}\\frac{(3n)!}{(n!)^3}x^n", "1/27", "ETH", ["power-series", "radius"], "Ratio -> 27, so R = 1/27.");
  N("world-043", "integrals", 5, "\\int_0^{\\infty}\\frac{\\log x}{1+x^6}\\,dx", "-pi^2/(6*sqrt(3))", "Harvard", ["contour", "log-integral"], "Keyhole contour gives -π^2/(6√3).");
  N("world-044", "integrals", 5, "\\int_0^{\\pi/2} x\\cot x\\,dx", "pi*log(2)/2", "Cambridge", ["fourier", "log-integral"], "Equals (π/2) log 2.");
  N("world-045", "integrals", 5, "\\int_{-\\infty}^{\\infty}\\frac{\\cos x}{1+x^2}\\,dx", "pi/exp(1)", "Princeton", ["contour", "fourier"], "Residue gives π/e.");
  N("world-046", "limits", 5, "\\lim_{x\\to\\infty}\\frac{x^2\\left(x^{1/x}-1-\\tfrac{\\log x}{x}\\right)}{(\\log x)^2}", "1/2", "Putnam", ["asymptotics"], "x^{1/x}=1+(log x)/x+(log x)^2/(2x^2)+...");
  N("world-047", "integrals", 5, "\\int_0^{\\infty}\\frac{\\sin^4 x}{x^4}\\,dx", "pi/3", "MIT", ["dirichlet", "parseval"], "Standard value π/3.");
  N("world-048", "series", 5, "\\sum_{n=0}^{\\infty}\\frac{(2n-1)!!}{(2n)!!\\,(2n+1)}", "pi/2", "Cambridge", ["binomial-series"], "This is arcsin(1)=π/2.");
  N("world-050", "integrals", 5, "\\int_0^{1} x^3\\log x\\,dx", "-1/16", "Harvard", ["integration-by-parts"], "x^4/4 log x - x^4/16.");

  /* ===== Tier C — brutal (rank 6) ===== */
  N("world-051", "integrals", 6, "\\int_0^{1}\\frac{\\arctan\\!\\left(\\sqrt{x^2+2}\\right)}{(x^2+1)\\sqrt{x^2+2}}\\,dx", "5*pi^2/96", "Putnam", ["ahmed-integral"], "Ahmed's integral.");
  N("world-052", "integrals", 6, "\\int_0^{\\pi/2}\\log^2(\\sin x)\\,dx", "pi*log(2)^2/2+pi^3/24", "Cambridge", ["fourier", "log-integral"], "(π/2)log^2 2 + π^3/24.");
  N("world-053", "series", 5, "\\sum_{n=2}^{\\infty}\\frac{(-1)^n}{n^2-1}", "1/4", "Harvard", ["telescoping", "alternating"], "Telescoping with alternating signs.");
  N("world-054", "integrals", 6, "\\int_0^{\\pi/2}\\log^2(\\cos x)\\,dx", "pi*log(2)^2/2+pi^3/24", "Todai", ["fourier", "log-integral"], "(π/2)log^2 2 + π^3/24.");
  N("world-055", "integrals", 5, "\\int_0^{\\pi/2}\\cos x\\,\\log(\\sin x)\\,dx", "-1", "Cambridge", ["substitution"], "u=sin x gives ∫_0^1 log u du = -1.");
  N("world-056", "integrals", 6, "\\int_0^{1}\\log x\\,\\log(1+x)\\,dx", "2-2*log(2)-pi^2/12", "Princeton", ["dilogarithm"], "Equals 2 - 2log2 - π^2/12.");
  N("world-057", "integrals", 6, "\\int_0^{\\infty}\\frac{\\log(1+x^2)}{1+x^2}\\,dx", "pi*log(2)", "Putnam", ["feynman"], "Feynman differentiation.");
  N("world-058", "integrals", 6, "\\int_0^{\\infty} e^{-x^2}\\cos x\\,dx", "sqrt(pi)*exp(-1/4)/2", "Princeton", ["gaussian", "feynman"], "(√π/2)e^{-1/4}.");
  N("world-059", "integrals", 6, "\\int_0^{1}\\frac{dx}{1+x^3}", "log(2)/3+pi/(3*sqrt(3))", "Harvard", ["partial-fractions"], "Factor 1+x^3.");
  N("world-060", "series", 6, "\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{(2n+1)^3}", "pi^3/32", "Cambridge", ["dirichlet-beta"], "β(3)=π^3/32.");
  N("world-061", "integrals", 6, "\\int_0^{1}\\frac{\\log(1-x)}{x}\\,dx", "-pi^2/6", "Harvard", ["dilogarithm"], "-Li_2(1).");
  N("world-062", "integrals", 6, "\\int_0^{1}\\frac{\\log x}{1-x^2}\\,dx", "-pi^2/8", "MIT", ["dilogarithm"], "-Σ 1/(2n+1)^2.");
  N("world-063", "integrals", 6, "\\int_0^{\\infty}\\frac{x^2}{(1+x^2)^3}\\,dx", "pi/16", "Caltech", ["beta-function"], "Beta value π/16.");
  N("world-064", "integrals", 6, "\\int_0^{1}\\frac{x^3-1}{\\log x}\\,dx", "log(4)", "Putnam", ["frullani"], "log(a+1), a=3.");
  N("world-065", "integrals", 6, "\\int_0^{\\pi/2}\\sqrt{\\tan x}\\,dx", "pi/sqrt(2)", "Cambridge", ["beta-function"], "Beta gives π/√2.");
  N("world-066", "limits", 6, "\\lim_{n\\to\\infty}\\prod_{k=1}^{n}\\left(1+\\frac{k^2}{n^3}\\right)", "exp(1/3)", "Todai", ["product-limit"], "log of product -> 1/3.");
  N("world-067", "limits", 6, "\\lim_{n\\to\\infty}\\left(\\frac{(3n)!}{n!\\,(2n)!}\\right)^{1/n}", "27/4", "Putnam", ["stirling"], "Central trinomial growth (27/4)^n.");
  N("world-068", "derivatives", 6, "\\text{Coefficient of }x^4\\text{ in }(1+x)^{x}", "5/6", "Caltech", ["taylor", "coefficient"], "Expand x log(1+x) in the exponent.");
  N("world-069", "integrals", 6, "\\int_0^{\\infty}\\frac{dx}{(1+x^2)(4+x^2)}", "pi/12", "MIT", ["partial-fractions"], "π/(2ab(a+b)).");
  N("world-070", "integrals", 6, "\\int_0^{\\infty} e^{-x}\\,\\frac{\\sin x}{x}\\,dx", "pi/4", "MIT", ["frullani", "laplace"], "arctan(1/s) at s=1.");
  N("world-071", "limits", 6, "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{n}{n^2+k^2}", "pi/4", "Putnam", ["riemann-sum"], "Riemann sum of 1/(1+x^2) on [0,1].");
  N("world-072", "integrals", 6, "\\int_0^{2\\pi}\\frac{dx}{(2+\\cos x)^2}", "4*pi/(3*sqrt(3))", "ETH", ["weierstrass"], "Differentiate ∫1/(a+cos x) in a.");
  N("world-073", "integrals", 6, "\\int_0^{\\pi}\\log(2-\\cos x)\\,dx", "pi*log((2+sqrt(3))/2)", "Cambridge", ["fourier"], "∫_0^π log(a-cos x)dx = π log((a+√(a^2-1))/2).");
  N("world-074", "limits", 6, "\\lim_{n\\to\\infty}\\frac{4^{n}}{\\sqrt{n}\\,\\binom{2n}{n}}", "sqrt(pi)", "Putnam", ["stirling", "central-binomial"], "binom(2n,n) ~ 4^n/√(πn).");
  N("world-075", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{1}{n^2(n+1)}", "pi^2/6-1", "Harvard", ["zeta", "telescoping"], "1/(n^2(n+1)) = 1/n^2 - 1/n + 1/(n+1).");
  N("world-076", "integrals", 6, "\\int_0^{\\infty}\\frac{\\arctan x}{1+x^2}\\,dx", "pi^2/8", "MIT", ["substitution"], "u=arctan x gives (π/2)^2/2.");
  N("world-077", "integrals", 6, "\\int_0^{1}\\frac{\\arctan x}{1+x}\\,dx", "pi*log(2)/8", "Putnam", ["feynman"], "Feynman parameter trick.");
  N("world-078", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{1}{n^2}\\left(\\frac{1}{2}\\right)^{n}", "pi^2/12-log(2)^2/2", "Princeton", ["dilogarithm"], "Li_2(1/2).");
  N("world-079", "integrals", 5, "\\int_0^{1}(\\log x)^3\\,dx", "-6", "Cambridge", ["gamma-function"], "∫_0^1 (log x)^n dx = (-1)^n n!.");
  N("world-080", "integrals", 6, "\\int_0^{\\infty}\\frac{dx}{1+x^2+x^4}", "pi/(2*sqrt(3))", "ETH", ["partial-fractions"], "1+x^2+x^4=(x^2+x+1)(x^2-x+1).");

  /* ===== Tier C continued — more monsters ===== */
  N("world-081", "integrals", 5, "\\int_0^{\\infty}\\frac{dx}{\\cosh x}", "pi/2", "Caltech", ["hyperbolic"], "∫ sech x dx = 2 arctan(tanh(x/2)).");
  N("world-082", "integrals", 5, "\\int_0^{1}(\\arcsin x)^2\\,dx", "pi^2/4-2", "Caltech", ["integration-by-parts", "inverse-trig"], "Equals π^2/4 - 2.");
  N("world-083", "integrals", 6, "\\int_0^{\\infty}\\frac{x}{e^{x}+1}\\,dx", "pi^2/12", "Princeton", ["eta", "fermi"], "Γ(2)η(2)=π^2/12.");
  N("world-084", "integrals", 6, "\\int_0^{1}\\frac{\\log(1-x)}{1+x}\\,dx", "log(2)^2/2-pi^2/12", "Harvard", ["dilogarithm"], "Equals (log^2 2)/2 - π^2/12.");
  N("world-085", "integrals", 6, "\\int_0^{\\pi/2}\\frac{d\\theta}{1+\\sin^2\\theta}", "pi/(2*sqrt(2))", "Oxford", ["weierstrass"], "Standard value π/(2√2).");
  N("world-086", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{1}{(2n-1)^6}", "pi^6/960", "Cambridge", ["zeta"], "(63/64)ζ(6)=π^6/960.");
  N("world-087", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{1}{n^6}", "pi^6/945", "Cambridge", ["zeta"], "ζ(6)=π^6/945.");
  N("world-088", "integrals", 6, "\\int_0^{\\infty}\\frac{\\sin x}{x}\\,dx", "pi/2", "Cambridge", ["dirichlet"], "Dirichlet integral.");
  N("world-089", "integrals", 6, "\\int_0^{\\infty}\\frac{x-\\sin x}{x^3}\\,dx", "pi/4", "MIT", ["dirichlet"], "Standard value π/4.");
  N("world-090", "integrals", 6, "\\int_0^{\\infty} e^{-x^2}\\,dx", "sqrt(pi)/2", "MIT", ["gaussian"], "Gaussian integral.");
  N("world-091", "limits", 6, "\\lim_{n\\to\\infty} n\\left(\\left(1+\\tfrac1n\\right)^{n}-e\\right)", "-exp(1)/2", "Todai", ["asymptotics"], "(1+1/n)^n = e(1 - 1/(2n)+...).");
  N("world-092", "integrals", 5, "\\int_0^{1} x\\,\\log(1-x)\\,dx", "-3/4", "Cambridge", ["integration-by-parts"], "By parts gives -3/4.");
  N("world-093", "derivatives", 6, "\\text{Coefficient of }x^4\\text{ in }e^{\\sin x}", "-1/8", "Caltech", ["taylor", "coefficient"], "e^{sin x}=1+x+x^2/2-x^4/8-...");
  N("world-094", "integrals", 6, "\\int_0^{\\infty}\\frac{dx}{1+x^4}", "pi/(2*sqrt(2))", "Harvard", ["beta-function"], "π/(2√2).");
  N("world-095", "integrals", 5, "\\int_0^{\\pi/2}\\sin x\\,\\log(\\sin x)\\,dx", "log(2)-1", "Cambridge", ["integration-by-parts"], "Equals log 2 - 1.");
  N("world-096", "limits", 6, "\\lim_{x\\to 0}\\left(\\frac{\\sinh x}{x}\\right)^{1/x^2}", "exp(1/6)", "Princeton", ["exponential-limit", "taylor"], "log(sinh x / x) ~ x^2/6.");
  N("world-097", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{H_n}{2^n}", "2*log(2)", "MIT", ["euler-sum", "generating-function"], "Σ H_n x^n=-log(1-x)/(1-x), x=1/2.");
  N("world-098", "integrals", 6, "\\int_0^{\\infty}\\frac{x^2}{(1+x^4)}\\,dx", "pi/(2*sqrt(2))", "ETH", ["beta-function"], "Same Beta family.");
  N("world-099", "limits", 6, "\\lim_{x\\to 0}\\frac{\\tan(\\sin x)-\\sin(\\tan x)}{x^7}", "1/30", "Putnam", ["taylor"], "Famous degree-7 expansion: 1/30.");
  N("world-100", "integrals", 6, "\\int_0^{\\pi/2}\\frac{x^2}{\\sin^2 x}\\,dx", "pi*log(2)", "Todai", ["fourier"], "∫_0^{π/2} x^2 csc^2 x dx = π log 2.");

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();
