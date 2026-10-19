(function () {
  "use strict";

  // World top-university / competition pack: a short honest warm-up, then
  // genuinely hard problems calibrated against the existing boss bank.
  // Styled after MIT, Cambridge Tripos, Oxford, Princeton, Harvard, Caltech,
  // various universities and competitions. Answers use WebWork notation (log = ln).
  const SOURCE = "Buzz 國際難題包 2026";
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
      // 名校署名不進 tags：學校名只留在 p.school 供題庫詳情顯示，
      // 免得練習畫面的技巧 chip 變成「MIT / Cambridge」這種出處標籤。
      tags: Array.from(new Set([...(p.tags || []), "world-universities", ...rankTags].filter(Boolean)))
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
  N("world-011", "limits", 3, "\\lim_{x\\to 0}\\left(\\frac{2^x+8^x}{2}\\right)^{1/x}", "4", "競賽", ["exponential-limit"], "Geometric-mean limit: √(2·8)=4.");
  N("world-012", "limits", 4, "\\lim_{x\\to 0}\\left(\\frac{1}{x^2}-\\cot^2 x\\right)", "2/3", "Princeton", ["taylor", "trig-limit"], "cot^2 x = 1/x^2 - 2/3 - ...");
  N("world-013", "limits", 4, "\\lim_{x\\to 0}\\left(\\frac{e^x-1}{x}\\right)^{1/x}", "exp(1/2)", "亞洲名校", ["exponential-limit", "taylor"], "(e^x-1)/x = 1 + x/2 + ...; limit e^{1/2}.");
  N("world-014", "integrals", 4, "\\int_0^{\\pi/4}\\ln(1+\\tan x)\\,dx", "pi*log(2)/8", "競賽", ["kings-property", "log-integral"], "x -> π/4 - x symmetry.");
  N("world-015", "integrals", 4, "\\int_0^{1}\\frac{\\ln(1+x)}{1+x^2}\\,dx", "pi*log(2)/8", "MIT", ["feynman"], "Substitute x=tan θ; the classic log integral.");
  N("world-016", "integrals", 4, "\\int_0^{\\infty}\\frac{\\cos(2x)-\\cos(3x)}{x}\\,dx", "log(3/2)", "Cambridge", ["frullani"], "Frullani for cosines.");
  N("world-017", "integrals", 4, "\\int_0^{\\infty}\\frac{dx}{1+x^3}", "2*pi/(3*sqrt(3))", "Harvard", ["beta-function"], "(π/3)/sin(π/3).");
  N("world-018", "integrals", 4, "\\int_0^{1}\\frac{\\ln x}{(1+x)^2}\\,dx", "-log(2)", "Oxford", ["integration-by-parts"], "By parts gives -log 2.");
  N("world-019", "integrals", 4, "\\int_0^{1}\\frac{x^2-1}{\\ln x}\\,dx", "log(3)", "競賽", ["frullani", "feynman"], "∫_0^1 (x^a-1)/log x dx = log(a+1).");
  N("world-020", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{n^2}{n!}", "2*exp(1)", "Caltech", ["exponential-series"], "Σ n^2/n! = 2e.");
  N("world-021", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{n^3}{n!}", "5*exp(1)", "Caltech", ["exponential-series"], "Σ n^3/n! = 5e.");
  N("world-022", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{1}{n(2n+1)}", "2-2*log(2)", "Princeton", ["log-series"], "Equals 2 - 2 log 2.");
  N("world-023", "series", 4, "\\sum_{n=1}^{\\infty}\\frac{1}{n^2(n+1)^2}", "pi^2/3-3", "ETH", ["zeta", "telescoping"], "Partial fractions to ζ(2) terms.");
  N("world-024", "derivatives", 4, "\\left.\\frac{d^4}{dx^4}\\left(e^{x}\\cos x\\right)\\right|_{x=0}", "-4", "Caltech", ["higher-derivative", "complex"], "Real part of (1+i)^4 = -4.");
  N("world-025", "derivatives", 4, "\\text{Coefficient of }x^5\\text{ in }\\tan x", "2/15", "MIT", ["taylor", "coefficient"], "tan x = x + x^3/3 + 2x^5/15 + ...");
  N("world-026", "limits", 4, "\\lim_{x\\to 0}\\frac{e^{x}-1-x-\\tfrac{x^2}{2}}{x^3}", "1/6", "Harvard", ["taylor"], "Next term of e^x.");
  N("world-027", "integrals", 4, "\\int_0^{\\infty} x e^{-x}\\sin x\\,dx", "1/2", "Oxford", ["integration-by-parts", "complex"], "Imaginary part of 1/(1-i)^2.");
  N("world-028", "series", 3, "\\text{收斂半徑：}\\sum_{n=1}^{\\infty}\\binom{2n}{n}x^n", "1/4", "ETH", ["power-series", "radius"], "binom(2n,n) ~ 4^n, so R = 1/4.");
  N("world-029", "integrals", 4, "\\int_0^{\\infty}\\frac{\\ln x}{(1+x^2)^2}\\,dx", "-pi/4", "Princeton", ["feynman"], "Differentiate a Beta integral in a parameter.");
  N("world-030", "limits", 4, "\\lim_{x\\to 0}(\\cos x)^{1/\\sin^2 x}", "exp(-1/2)", "Cambridge", ["exponential-limit", "taylor"], "log cos x ~ -x^2/2 and sin^2 x ~ x^2.");

  /* ===== Tier B — hard (rank 5) ===== */
  N("world-031", "integrals", 5, "\\int_0^{\\infty}\\frac{x}{\\sinh x}\\,dx", "pi^2/4", "Cambridge", ["hyperbolic", "series"], "Expand 1/sinh and sum 1/(2k+1)^2.");
  N("world-032", "integrals", 5, "\\int_0^{1}\\frac{(\\ln x)^2}{1+x^2}\\,dx", "pi^3/16", "Harvard", ["dirichlet-beta"], "Term-by-term gives π^3/16.");
  N("world-033", "integrals", 5, "\\int_0^{\\infty}\\frac{\\cos x-\\cos 3x}{x^2}\\,dx", "pi", "MIT", ["dirichlet"], "(π/2)(3-1)=π.");
  N("world-034", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{H_n}{n\\,2^n}", "pi^2/12", "競賽", ["euler-sum", "dilogarithm"], "Euler sum equal to π^2/12.");
  N("world-035", "limits", 5, "\\lim_{n\\to\\infty}\\left(\\frac{(2n)!}{n!\\,n^n}\\right)^{1/n}", "4/exp(1)", "競賽", ["stirling"], "Stirling gives 4/e.");
  N("world-036", "derivatives", 5, "\\text{Coefficient of }x^6\\text{ in }\\sec x", "61/720", "Caltech", ["taylor", "coefficient", "euler-number"], "Euler number E_6/6! = 61/720.");
  N("world-037", "integrals", 5, "\\int_0^{\\infty} e^{-x^2}\\cos(2x)\\,dx", "sqrt(pi)*exp(-1)/2", "Princeton", ["gaussian", "feynman"], "Gaussian shift gives (√π/2)e^{-1}.");
  N("world-038", "integrals", 5, "\\int_0^{\\infty}\\frac{\\sin^3 x}{x^3}\\,dx", "3*pi/8", "MIT", ["dirichlet"], "Use sin^3 = (3 sin x - sin 3x)/4.");
  N("world-039", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{1}{n^2\\binom{2n}{n}}", "pi^2/18", "ETH", ["central-binomial"], "Classic central-binomial sum.");
  N("world-040", "limits", 5, "\\lim_{x\\to 0}\\frac{(1+x)^{1/x}-e+\\tfrac{ex}{2}}{x^2}", "11*exp(1)/24", "亞洲名校", ["exponential-limit", "taylor"], "(1+x)^{1/x}=e(1-x/2+11x^2/24-...).");
  N("world-041", "integrals", 5, "\\int_0^{1}\\frac{x-1}{\\ln x}\\,dx", "log(2)", "競賽", ["frullani"], "log(a+1) with a=1.");
  N("world-042", "series", 5, "\\text{收斂半徑：}\\sum_{n=1}^{\\infty}\\frac{(3n)!}{(n!)^3}x^n", "1/27", "ETH", ["power-series", "radius"], "Ratio -> 27, so R = 1/27.");
  N("world-043", "integrals", 5, "\\int_0^{\\infty}\\frac{\\ln x}{1+x^6}\\,dx", "-pi^2/(6*sqrt(3))", "Harvard", ["contour", "log-integral"], "Keyhole contour gives -π^2/(6√3).");
  N("world-044", "integrals", 5, "\\int_0^{\\pi/2} x\\cot x\\,dx", "pi*log(2)/2", "Cambridge", ["fourier", "log-integral"], "Equals (π/2) log 2.");
  N("world-045", "integrals", 5, "\\int_{-\\infty}^{\\infty}\\frac{\\cos x}{1+x^2}\\,dx", "pi/exp(1)", "Princeton", ["contour", "fourier"], "Residue gives π/e.");
  N("world-046", "limits", 5, "\\lim_{x\\to\\infty}\\frac{x^2\\left(x^{1/x}-1-\\tfrac{\\ln x}{x}\\right)}{(\\ln x)^2}", "1/2", "競賽", ["asymptotics"], "x^{1/x}=1+(log x)/x+(log x)^2/(2x^2)+...");
  N("world-047", "integrals", 5, "\\int_0^{\\infty}\\frac{\\sin^4 x}{x^4}\\,dx", "pi/3", "MIT", ["dirichlet", "parseval"], "Standard value π/3.");
  N("world-048", "series", 5, "\\sum_{n=0}^{\\infty}\\frac{(2n-1)!!}{(2n)!!\\,(2n+1)}", "pi/2", "Cambridge", ["binomial-series"], "This is arcsin(1)=π/2.");
  N("world-050", "integrals", 5, "\\int_0^{1} x^3\\ln x\\,dx", "-1/16", "Harvard", ["integration-by-parts"], "x^4/4 log x - x^4/16.");

  /* ===== Tier C — brutal (rank 6) ===== */
  N("world-051", "integrals", 6, "\\int_0^{1}\\frac{\\arctan\\!\\left(\\sqrt{x^2+2}\\right)}{(x^2+1)\\sqrt{x^2+2}}\\,dx", "5*pi^2/96", "競賽", ["ahmed-integral"], "Ahmed's integral.");
  N("world-052", "integrals", 6, "\\int_0^{\\pi/2}\\ln^2(\\sin x)\\,dx", "pi*log(2)^2/2+pi^3/24", "Cambridge", ["fourier", "log-integral"], "(π/2)log^2 2 + π^3/24.");
  N("world-053", "series", 5, "\\sum_{n=2}^{\\infty}\\frac{(-1)^n}{n^2-1}", "1/4", "Harvard", ["telescoping", "alternating"], "Telescoping with alternating signs.");
  N("world-054", "integrals", 6, "\\int_0^{\\pi/2}\\ln^2(\\cos x)\\,dx", "pi*log(2)^2/2+pi^3/24", "亞洲名校", ["fourier", "log-integral"], "(π/2)log^2 2 + π^3/24.");
  N("world-055", "integrals", 5, "\\int_0^{\\pi/2}\\cos x\\,\\ln(\\sin x)\\,dx", "-1", "Cambridge", ["substitution"], "u=sin x gives ∫_0^1 log u du = -1.");
  N("world-056", "integrals", 6, "\\int_0^{1}\\ln x\\,\\ln(1+x)\\,dx", "2-2*log(2)-pi^2/12", "Princeton", ["dilogarithm"], "Equals 2 - 2log2 - π^2/12.");
  N("world-057", "integrals", 6, "\\int_0^{\\infty}\\frac{\\ln(1+x^2)}{1+x^2}\\,dx", "pi*log(2)", "競賽", ["feynman"], "Feynman differentiation.");
  N("world-058", "integrals", 6, "\\int_0^{\\infty} e^{-x^2}\\cos x\\,dx", "sqrt(pi)*exp(-1/4)/2", "Princeton", ["gaussian", "feynman"], "(√π/2)e^{-1/4}.");
  N("world-059", "integrals", 6, "\\int_0^{1}\\frac{dx}{1+x^3}", "log(2)/3+pi/(3*sqrt(3))", "Harvard", ["partial-fractions"], "Factor 1+x^3.");
  N("world-060", "series", 6, "\\sum_{n=0}^{\\infty}\\frac{(-1)^n}{(2n+1)^3}", "pi^3/32", "Cambridge", ["dirichlet-beta"], "β(3)=π^3/32.");
  N("world-061", "integrals", 6, "\\int_0^{1}\\frac{\\ln(1-x)}{x}\\,dx", "-pi^2/6", "Harvard", ["dilogarithm"], "-Li_2(1).");
  N("world-062", "integrals", 6, "\\int_0^{1}\\frac{\\ln x}{1-x^2}\\,dx", "-pi^2/8", "MIT", ["dilogarithm"], "-Σ 1/(2n+1)^2.");
  N("world-063", "integrals", 6, "\\int_0^{\\infty}\\frac{x^2}{(1+x^2)^3}\\,dx", "pi/16", "Caltech", ["beta-function"], "Beta value π/16.");
  N("world-064", "integrals", 6, "\\int_0^{1}\\frac{x^3-1}{\\ln x}\\,dx", "log(4)", "競賽", ["frullani"], "log(a+1), a=3.");
  N("world-065", "integrals", 6, "\\int_0^{\\pi/2}\\sqrt{\\tan x}\\,dx", "pi/sqrt(2)", "Cambridge", ["beta-function"], "Beta gives π/√2.");
  N("world-066", "limits", 6, "\\lim_{n\\to\\infty}\\prod_{k=1}^{n}\\left(1+\\frac{k^2}{n^3}\\right)", "exp(1/3)", "亞洲名校", ["product-limit"], "log of product -> 1/3.");
  N("world-067", "limits", 6, "\\lim_{n\\to\\infty}\\left(\\frac{(3n)!}{n!\\,(2n)!}\\right)^{1/n}", "27/4", "競賽", ["stirling"], "Central trinomial growth (27/4)^n.");
  N("world-068", "derivatives", 6, "\\text{Coefficient of }x^4\\text{ in }(1+x)^{x}", "5/6", "Caltech", ["taylor", "coefficient"], "Expand x log(1+x) in the exponent.");
  N("world-069", "integrals", 6, "\\int_0^{\\infty}\\frac{dx}{(1+x^2)(4+x^2)}", "pi/12", "MIT", ["partial-fractions"], "π/(2ab(a+b)).");
  N("world-070", "integrals", 6, "\\int_0^{\\infty} e^{-x}\\,\\frac{\\sin x}{x}\\,dx", "pi/4", "MIT", ["frullani", "laplace"], "arctan(1/s) at s=1.");
  N("world-071", "limits", 6, "\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac{n}{n^2+k^2}", "pi/4", "競賽", ["riemann-sum"], "Riemann sum of 1/(1+x^2) on [0,1].");
  N("world-072", "integrals", 6, "\\int_0^{2\\pi}\\frac{dx}{(2+\\cos x)^2}", "4*pi/(3*sqrt(3))", "ETH", ["weierstrass"], "Differentiate ∫1/(a+cos x) in a.");
  N("world-073", "integrals", 6, "\\int_0^{\\pi}\\ln(2-\\cos x)\\,dx", "pi*log((2+sqrt(3))/2)", "Cambridge", ["fourier"], "∫_0^π log(a-cos x)dx = π log((a+√(a^2-1))/2).");
  N("world-074", "limits", 6, "\\lim_{n\\to\\infty}\\frac{4^{n}}{\\sqrt{n}\\,\\binom{2n}{n}}", "sqrt(pi)", "競賽", ["stirling", "central-binomial"], "binom(2n,n) ~ 4^n/√(πn).");
  N("world-075", "series", 5, "\\sum_{n=1}^{\\infty}\\frac{1}{n^2(n+1)}", "pi^2/6-1", "Harvard", ["zeta", "telescoping"], "1/(n^2(n+1)) = 1/n^2 - 1/n + 1/(n+1).");
  N("world-076", "integrals", 6, "\\int_0^{\\infty}\\frac{\\arctan x}{1+x^2}\\,dx", "pi^2/8", "MIT", ["substitution"], "u=arctan x gives (π/2)^2/2.");
  N("world-077", "integrals", 6, "\\int_0^{1}\\frac{\\arctan x}{1+x}\\,dx", "pi*log(2)/8", "競賽", ["feynman"], "Feynman parameter trick.");
  N("world-078", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{1}{n^2}\\left(\\frac{1}{2}\\right)^{n}", "pi^2/12-log(2)^2/2", "Princeton", ["dilogarithm"], "Li_2(1/2).");
  N("world-079", "integrals", 5, "\\int_0^{1}(\\ln x)^3\\,dx", "-6", "Cambridge", ["gamma-function"], "∫_0^1 (log x)^n dx = (-1)^n n!.");
  N("world-080", "integrals", 6, "\\int_0^{\\infty}\\frac{dx}{1+x^2+x^4}", "pi/(2*sqrt(3))", "ETH", ["partial-fractions"], "1+x^2+x^4=(x^2+x+1)(x^2-x+1).");

  /* ===== Tier C continued — more monsters ===== */
  N("world-081", "integrals", 5, "\\int_0^{\\infty}\\frac{dx}{\\cosh x}", "pi/2", "Caltech", ["hyperbolic"], "∫ sech x dx = 2 arctan(tanh(x/2)).");
  N("world-082", "integrals", 5, "\\int_0^{1}(\\arcsin x)^2\\,dx", "pi^2/4-2", "Caltech", ["integration-by-parts", "inverse-trig"], "Equals π^2/4 - 2.");
  N("world-083", "integrals", 6, "\\int_0^{\\infty}\\frac{x}{e^{x}+1}\\,dx", "pi^2/12", "Princeton", ["eta", "fermi"], "Γ(2)η(2)=π^2/12.");
  N("world-084", "integrals", 6, "\\int_0^{1}\\frac{\\ln(1-x)}{1+x}\\,dx", "log(2)^2/2-pi^2/12", "Harvard", ["dilogarithm"], "Equals (log^2 2)/2 - π^2/12.");
  N("world-085", "integrals", 6, "\\int_0^{\\pi/2}\\frac{d\\theta}{1+\\sin^2\\theta}", "pi/(2*sqrt(2))", "Oxford", ["weierstrass"], "Standard value π/(2√2).");
  N("world-086", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{1}{(2n-1)^6}", "pi^6/960", "Cambridge", ["zeta"], "(63/64)ζ(6)=π^6/960.");
  N("world-087", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{1}{n^6}", "pi^6/945", "Cambridge", ["zeta"], "ζ(6)=π^6/945.");
  N("world-088", "integrals", 6, "\\int_0^{\\infty}\\frac{\\sin x}{x}\\,dx", "pi/2", "Cambridge", ["dirichlet"], "Dirichlet integral.");
  N("world-089", "integrals", 6, "\\int_0^{\\infty}\\frac{x-\\sin x}{x^3}\\,dx", "pi/4", "MIT", ["dirichlet"], "Standard value π/4.");
  N("world-090", "integrals", 6, "\\int_0^{\\infty} e^{-x^2}\\,dx", "sqrt(pi)/2", "MIT", ["gaussian"], "Gaussian integral.");
  N("world-091", "limits", 6, "\\lim_{n\\to\\infty} n\\left(\\left(1+\\tfrac1n\\right)^{n}-e\\right)", "-exp(1)/2", "亞洲名校", ["asymptotics"], "(1+1/n)^n = e(1 - 1/(2n)+...).");
  N("world-092", "integrals", 5, "\\int_0^{1} x\\,\\ln(1-x)\\,dx", "-3/4", "Cambridge", ["integration-by-parts"], "By parts gives -3/4.");
  N("world-093", "derivatives", 6, "\\text{Coefficient of }x^4\\text{ in }e^{\\sin x}", "-1/8", "Caltech", ["taylor", "coefficient"], "e^{sin x}=1+x+x^2/2-x^4/8-...");
  N("world-094", "integrals", 6, "\\int_0^{\\infty}\\frac{dx}{1+x^4}", "pi/(2*sqrt(2))", "Harvard", ["beta-function"], "π/(2√2).");
  N("world-095", "integrals", 5, "\\int_0^{\\pi/2}\\sin x\\,\\ln(\\sin x)\\,dx", "log(2)-1", "Cambridge", ["integration-by-parts"], "Equals log 2 - 1.");
  N("world-096", "limits", 6, "\\lim_{x\\to 0}\\left(\\frac{\\sinh x}{x}\\right)^{1/x^2}", "exp(1/6)", "Princeton", ["exponential-limit", "taylor"], "log(sinh x / x) ~ x^2/6.");
  N("world-097", "series", 6, "\\sum_{n=1}^{\\infty}\\frac{H_n}{2^n}", "2*log(2)", "MIT", ["euler-sum", "generating-function"], "Σ H_n x^n=-log(1-x)/(1-x), x=1/2.");
  N("world-098", "integrals", 6, "\\int_0^{\\infty}\\frac{x^2}{(1+x^4)}\\,dx", "pi/(2*sqrt(2))", "ETH", ["beta-function"], "Same Beta family.");
  N("world-099", "limits", 6, "\\lim_{x\\to 0}\\frac{\\tan(\\sin x)-\\sin(\\tan x)}{x^7}", "1/30", "競賽", ["taylor"], "Famous degree-7 expansion: 1/30.");
  N("world-100", "integrals", 6, "\\int_0^{\\pi/2}\\frac{x^2}{\\sin^2 x}\\,dx", "pi*log(2)", "亞洲名校", ["fourier"], "∫_0^{π/2} x^2 csc^2 x dx = π log 2.");

  // ---- 獨立驗算規格（tools/verify_answers.js 讀）----
  // 題幹的寫法自動辨識器接不到；這裡把題幹重述成數值路徑（數值偏導、數值積分、
  // 複數求值、圍道上的梯形法），不重複解題的推導、也不把答案抄一遍。
  const VERIFY = {
    // (2n−1)!!/(2n)!! 照定義寫成連乘積；部分和收斂得慢（~1/√n），交給數列外插
    "world-048": { m: "seqLimit", f: "\\sum_{k=0}^{n}\\frac{1}{2k+1}\\prod_{j=1}^{k}\\frac{2j-1}{2j}", n0: 100, levels: 6 }
  };
  problems.forEach((problem) => {
    if (VERIFY[problem.id]) problem.verify = VERIFY[problem.id];
  });

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems);
})();

(function () {
  "use strict";
  // 課程缺口補題（11H 複變積分、11I Laurent 與留數）：曲線參數式與方向、圍道積分（參數化／反導函數／ML）、
  // Cauchy 定理與積分公式、收斂半徑、Laurent 換環、奇異點分類與極點階數、留數（複數值）、留數定理、三角與 Jordan 型實積分。
  // 判分器只收實數：複數答案一律問實部或虛部，或問 (1/2πi)∮。
  // 驗算：圓上的圍道用 complex/contour（梯形法）；線段、拋物線、半圓用 lineIntegral 把 Re／Im 拆成兩個實線積分；
  // 實積分讓自動辨識器直接數值積分。
  const SOURCE = "Buzz course gap fill";
  // (1/2πi)∮_{|z−center|=radius} f dz 的實部／虛部
  const loop = (f, center, radius, part) => ({ m: "complex", op: "contour", f, center, radius, part: part || "re" });
  // ∮ f dz 本身：w = (1/2πi)∮，∮ = 2πi·w → Re∮ = −2π·Im w，Im∮ = 2π·Re w
  const reLoop = (f, center, radius) => ({ m: "let", with: { a: loop(f, center, radius, "im") }, f: "-2\\pi a" });
  const imLoop = (f, center, radius) => ({ m: "let", with: { a: loop(f, center, radius, "re") }, f: "2\\pi a" });
  const at = (f, point, part) => ({ m: "complex", op: "value", f, at: point, part: part || "abs" });
  // 孤立奇異點分類：在 z0 附近取點量 |f|。可去＝有界；極點＝四個方向都很大；本性＝一邊爆大、另一邊很小
  const SMALL = ["+0.00001", "-0.00001", "+0.00001*i", "-0.00001*i"];
  const classify = (f, z0) => [
    { say: "可去奇異點", all: SMALL.map((s) => ({ v: at(f, z0 + s), lt: 1000 })).concat([{ v: at(f, z0 + "+0.01"), lt: 1000 }]) },
    { say: "極點", all: SMALL.map((s) => ({ v: at(f, z0 + s), gt: 1000 })) },
    { say: "本性奇異點", all: [{ v: at(f, z0 + "+0.01"), gt: 1000 }, { v: at(f, z0 + "-0.01"), lt: 1 }] }
  ];
  const KINDS = ["可去奇異點", "極點", "本性奇異點"];
  // 極點階數：|f| ≈ C·δ^{−m}，用兩個尺度的對數斜率讀 m
  const order = (f, z0) => ({ m: "let", tol: 1e-3,
    with: { A: at(f, z0 + "+0.001"), B: at(f, z0 + "+0.0001") }, f: "\\frac{\\ln B-\\ln A}{\\ln 10}" });
  // Taylor 係數 a_n = (1/2πi)∮ f/(z−c)^{n+1} dz
  const coef = (f, center, n, radius) => loop("(" + f + ")/(z-(" + center + "))^" + (n + 1), center, radius, "re");

  const problems = [
    /* ── 11.41 複平面上的曲線 ── */
    { id: "cg-11h-001", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\text{圓 }|z-(2-i)|=3\\text{ 用 }z(t)=z_0+r\\,e^{i t}\\ (0\\le t\\le 2\\pi)\\text{ 逆時針參數化，求 }z(\\pi/3)\\text{ 的虛部}",
      answer: "-1+3*sqrt(3)/2", timeLimit: 70,
      tags: ["complex-curve-parametrize", "parametric"],
      hints: ["|z − z₀| = r 直接讀出圓心 z₀ 與半徑 r。", "e^{iθ} = cos θ + i sin θ；虛部是圓心的虛部加上 r sin θ。"],
      solution: "z₀ = 2 − i、r = 3，z(π/3) = 2 − i + 3(cos π/3 + i sin π/3)，虛部 −1 + 3√3/2。",
      solutionSteps: ["|z − (2 − i)| = 3：圓心 2 − i，半徑 3，z(t) = 2 − i + 3e^{it}。", "e^{iπ/3} = 1/2 + (√3/2)i。", "虛部 = −1 + 3√3/2 ≈ 1.598。"],
      verify: at("2-i+3*exp(i*pi/3)", 0, "im") },
    { id: "cg-11h-002", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{從 }3i\\text{ 走到 }2\\text{ 的有向線段，哪一個是它的參數式（}0\\le t\\le 1\\text{）？}",
      answer: "z(t) = 3i + t(2 − 3i)", answers: ["z(t) = 3i + t(2 − 3i)"], canonical: "z(t) = 3i + t(2 − 3i)",
      distractors: ["z(t) = 2 + t(3i − 2)", "z(t) = 3i + t(2 + 3i)", "z(t) = 2t + 3i"], timeLimit: 60,
      tags: ["complex-curve-parametrize", "parametric"],
      hints: ["線段 z₁ → z₂ 的標準寫法是 z₁ + t(z₂ − z₁)。", "代 t = 0 要得到起點、t = 1 要得到終點。"],
      solution: "起點 z₁ = 3i、終點 z₂ = 2，z(t) = 3i + t(2 − 3i)。檢查：z(0) = 3i，z(1) = 2。",
      solutionSteps: ["z(t) = z₁ + t(z₂ − z₁)，z₁ = 3i、z₂ = 2。", "z₂ − z₁ = 2 − 3i，所以 z(t) = 3i + t(2 − 3i)。", "z(0) = 3i、z(1) = 2，方向正確。"],
      verify: { m: "choice", options: [
        ["z(t) = 3i + t(2 − 3i)", "3*i+x*(2-3*i)"], ["z(t) = 2 + t(3i − 2)", "2+x*(3*i-2)"],
        ["z(t) = 3i + t(2 + 3i)", "3*i+x*(2+3*i)"], ["z(t) = 2t + 3i", "2*x+3*i"]
      ].map(([say, f]) => ({ say, all: [
        { v: at(f, "0", "re"), eq: 0 }, { v: at(f, "0", "im"), eq: 3 },
        { v: at(f, "1", "re"), eq: 2 }, { v: at(f, "1", "im"), eq: 0 }] })) } },
    { id: "cg-11h-003", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{圓 }|z|=2\\text{ 上從 }2i\\text{ 逆時針走到 }-2\\text{ 的那段弧，寫成 }z(t)=2e^{i t}\\text{ 時 }t\\text{ 的範圍是？}",
      answer: "π/2 ≤ t ≤ π", answers: ["π/2 ≤ t ≤ π"], canonical: "π/2 ≤ t ≤ π",
      distractors: ["0 ≤ t ≤ π/2", "π/2 ≤ t ≤ 3π/2", "π ≤ t ≤ 3π/2"], timeLimit: 60,
      tags: ["complex-curve-parametrize", "parametric"],
      hints: ["2i 與 −2 各是 2e^{it} 在哪個角度？", "逆時針就是 t 遞增。"],
      solution: "2i = 2e^{iπ/2}、−2 = 2e^{iπ}，逆時針是 t 從 π/2 增加到 π。",
      solutionSteps: ["起點 2i：角度 π/2。", "終點 −2：角度 π。", "逆時針 t 遞增，所以 π/2 ≤ t ≤ π。"],
      verify: { m: "choice", options: [
        ["π/2 ≤ t ≤ π", "pi/2", "pi"], ["0 ≤ t ≤ π/2", "0", "pi/2"],
        ["π/2 ≤ t ≤ 3π/2", "pi/2", "3*pi/2"], ["π ≤ t ≤ 3π/2", "pi", "3*pi/2"]
      ].map(([say, s, e]) => ({ say, all: [
        { v: at("2*exp(i*x)", s, "re"), eq: 0 }, { v: at("2*exp(i*x)", s, "im"), eq: 2 },
        { v: at("2*exp(i*x)", e, "re"), eq: -2 }, { v: at("2*exp(i*x)", e, "im"), eq: 0 }] })) } },
    { id: "cg-11h-004", topic: "integrals", rank: 1, answerKind: "text",
      prompt: "z(t)=1+2e^{-i t},\\ 0\\le t\\le 2\\pi\\text{ 繞圓 }|z-1|=2\\text{ 走的方向是？}",
      answer: "順時針一圈", answers: ["順時針一圈"], canonical: "順時針一圈",
      distractors: ["逆時針一圈", "順時針半圈"], timeLimit: 45,
      tags: ["complex-curve-orientation", "parametric"],
      hints: ["e^{−it} 的角度是 −t。", "t 增加時角度怎麼變？t 走完 2π 角度轉了多少？"],
      solution: "z − 1 = 2e^{−it} 的角度是 −t，t 增加角度減少，是順時針；t 走 2π 剛好一圈。",
      solutionSteps: ["z(t) − 1 = 2e^{−it}，角度 = −t。", "t 遞增 → 角度遞減 → 順時針。", "角度共變了 2π，所以是順時針一圈。"],
      verify: { m: "choice", options: [
        { say: "順時針一圈", all: [{ v: at("(2*exp(-i*(x+0.1)))/(2*exp(-i*x))", "0", "im"), lt: 0 },
          { v: at("(1+2*exp(-i*2*pi))-(1+2*exp(-i*0))", "0"), eq: 0 }] },
        { say: "逆時針一圈", all: [{ v: at("(2*exp(-i*(x+0.1)))/(2*exp(-i*x))", "0", "im"), gt: 0 }] },
        { say: "順時針半圈", all: [{ v: at("(1+2*exp(-i*2*pi))-(1+2*exp(-i*0))", "0"), eq: 4 }] }
      ] } },
    { id: "cg-11h-005", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "C\\,\\text{ 是上半單位圓 }z=e^{i t}\\ (0\\le t\\le\\pi)\\text{，}-C\\text{ 是反方向走的同一段弧。求 }\\operatorname{Re}\\int_{-C} z^2\\,dz",
      answer: "2/3", timeLimit: 75,
      tags: ["complex-curve-orientation", "contour-integral", "parametric"],
      hints: ["−C 的起點是 C 的終點、終點是 C 的起點。", "z² 有反導函數，積分只看端點。"],
      solution: "−C 從 −1 走到 1。∫ z² dz = [z³/3] 從 −1 到 1 = 1/3 − (−1/3) = 2/3。",
      solutionSteps: ["C 從 1 到 −1，所以 −C 從 −1 到 1。", "z³/3 是 z² 的反導函數。", "∫_{−C} z² dz = 1/3 − (−1)/3 = 2/3，實部 2/3。"],
      verify: { m: "lineIntegral", kind: "work", F: ["x^2-y^2", "-2xy"],
        path: { x: "\\cos(\\pi-t)", y: "\\sin(\\pi-t)", from: 0, to: "\\pi" } } },

    /* ── 11.42 圍道積分 ── */
    { id: "cg-11h-006", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\operatorname{Im}\\oint_{|z|=2}\\bar z\\,dz\\quad\\text{（逆時針）}",
      answer: "8*pi", timeLimit: 90,
      tags: ["contour-integral-parametrize", "contour-integral", "parametric"],
      hints: ["z = 2e^{it}，那 z̄ 與 dz 各是什麼？", "z̄ 不是全純函數，不能直接說積分是 0。"],
      solution: "z = 2e^{it}，z̄ = 2e^{−it}，dz = 2ie^{it}dt。∮ z̄ dz = ∫₀^{2π} 4i dt = 8πi，虛部 8π。",
      solutionSteps: ["參數化 z = 2e^{it}，0 ≤ t ≤ 2π。", "z̄ dz = 2e^{−it}·2ie^{it} dt = 4i dt。", "∮ = 8πi，虛部 8π ≈ 25.13。"],
      verify: { m: "lineIntegral", kind: "work", F: ["-y", "x"],
        path: { x: "2\\cos t", y: "2\\sin t", from: 0, to: "2\\pi" } } },
    { id: "cg-11h-007", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "C\\text{ 是從 }1\\text{ 到 }3+2i\\text{ 的線段，求 }\\int_C \\operatorname{Re} z\\,dz\\text{ 的實部}",
      answer: "4", timeLimit: 90,
      tags: ["contour-integral-parametrize", "contour-integral", "parametric"],
      hints: ["線段寫成 z(t) = 1 + t(2 + 2i)，0 ≤ t ≤ 1。", "Re z 與 dz = z′(t) dt 各自代進去。"],
      solution: "z = 1 + t(2+2i)，Re z = 1 + 2t，dz = (2+2i)dt。∫₀¹ (1+2t)dt·(2+2i) = 2(2+2i) = 4 + 4i，實部 4。",
      solutionSteps: ["z(t) = 1 + t(2 + 2i)，Re z = 1 + 2t，z′(t) = 2 + 2i。", "∫₀¹ (1 + 2t) dt = 2。", "積分 = 2(2 + 2i) = 4 + 4i，實部 4。"],
      verify: { m: "lineIntegral", kind: "work", F: ["x", "0"], path: { x: "1+2t", y: "2t", from: 0, to: 1 } } },
    { id: "cg-11h-008", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "C:\\ z(t)=t+i\\,t^2,\\ 0\\le t\\le 1\\text{，求 }\\operatorname{Im}\\int_C \\bar z\\,dz",
      answer: "1/3", timeLimit: 100,
      tags: ["contour-integral-parametrize", "contour-integral", "parametric"],
      hints: ["z̄ = t − it²，dz = (1 + 2it) dt。", "乘開後把實部與虛部分開積。"],
      solution: "(t − it²)(1 + 2it) = t + 2t³ + it²。∫₀¹ = 1 + i/3，虛部 1/3（沿直線走會是 1，z̄ 的積分跟路徑有關）。",
      solutionSteps: ["z̄ = t − it²，z′(t) = 1 + 2it。", "(t − it²)(1 + 2it) = (t + 2t³) + i t²。", "∫₀¹ = (1/2 + 1/2) + i/3，虛部 1/3。"],
      verify: { m: "lineIntegral", kind: "work", F: ["-y", "x"], path: { x: "t", y: "t^2", from: 0, to: 1 } } },
    { id: "cg-11h-009", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{下列四個逆時針圍道積分，哪一個不等於 }0\\text{？}",
      answer: "沿 |z−3|=1 積 1/(z−3)", answers: ["沿 |z−3|=1 積 1/(z−3)"], canonical: "沿 |z−3|=1 積 1/(z−3)",
      distractors: ["沿 |z−3|=1 積 1/(z−3)²", "沿 |z|=1 積 1/(z−3)", "沿 |z−3|=1 積 (z−3)⁴"], timeLimit: 60,
      tags: ["contour-integral-power-circle", "contour-integral"],
      hints: ["∮_{|z−z₀|=r} (z − z₀)ⁿ dz 只有一個 n 不是 0。", "圓心不是 z₀ 的那一個，先看 3 在不在圓裡。"],
      solution: "繞 z₀ 的圓上 (z − z₀)ⁿ 只有 n = −1 給 2πi；|z| = 1 沒圍住 3，1/(z−3) 在圓內全純，積分 0。",
      solutionSteps: ["n = −1：∮ dz/(z−3) = 2πi ≠ 0。", "n = −2、n = 4：有反導函數，封閉曲線上是 0。", "|z| = 1 不含 3，被積函數在圓內全純，是 0。"],
      verify: { m: "choice", options: [
        { say: "沿 |z−3|=1 積 1/(z−3)", v: loop("1/(z-3)", 3, 1, "abs"), gt: 0.01 },
        { say: "沿 |z−3|=1 積 1/(z−3)²", v: loop("1/(z-3)^2", 3, 1, "abs"), gt: 0.01 },
        { say: "沿 |z|=1 積 1/(z−3)", v: loop("1/(z-3)", 0, 1, "abs"), gt: 0.01 },
        { say: "沿 |z−3|=1 積 (z−3)⁴", v: loop("(z-3)^4", 3, 1, "abs"), gt: 0.01 }
      ] } },
    { id: "cg-11h-010", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\frac{1}{2\\pi i}\\oint_{|z-i|=2}\\left(\\frac{3}{z-i}+\\frac{5}{(z-i)^2}+(z-i)^2\\right)dz",
      answer: "3", timeLimit: 60,
      tags: ["contour-integral-power-circle", "contour-integral"],
      hints: ["三項都是 (z − i)ⁿ 的倍數，圓心剛好是 i。", "只有 n = −1 那一項有貢獻。"],
      solution: "∮ (z−i)ⁿ dz 只有 n = −1 是 2πi，其他是 0。所以 ∮ = 3·2πi，除以 2πi 得 3。",
      solutionSteps: ["圓 |z − i| = 2 的圓心是 i。", "3/(z−i) 貢獻 3·2πi；5/(z−i)² 與 (z−i)² 貢獻 0。", "除以 2πi：答案 3。"],
      verify: loop("3/(z-i)+5/(z-i)^2+(z-i)^2", "i", 2) },
    { id: "cg-11h-011", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "C\\text{ 是從 }0\\text{ 到 }1+i\\text{ 的任一條光滑曲線，求 }\\operatorname{Re}\\int_C z^2\\,dz",
      answer: "-2/3", timeLimit: 70,
      tags: ["contour-integral-antiderivative", "contour-integral"],
      hints: ["z² 有反導函數，積分跟路徑無關。", "先算 (1 + i)² 再乘一次 (1 + i)。"],
      solution: "∫_C z² dz = (1+i)³/3。(1+i)² = 2i，(1+i)³ = 2i(1+i) = −2 + 2i，除以 3，實部 −2/3。",
      solutionSteps: ["反導函數 z³/3，只看端點。", "(1 + i)³ = −2 + 2i。", "積分 = (−2 + 2i)/3，實部 −2/3。"],
      verify: { m: "lineIntegral", kind: "work", F: ["x^2-y^2", "-2xy"], path: { x: "t", y: "t^2", from: 0, to: 1 } } },
    { id: "cg-11h-012", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "C:\\ z(t)=\\sin(\\pi t)+i\\,t,\\ 0\\le t\\le 1\\text{，求 }\\operatorname{Im}\\int_C\\cos z\\,dz",
      answer: "(exp(1)-exp(-1))/2", timeLimit: 100,
      tags: ["contour-integral-antiderivative", "contour-integral"],
      hints: ["曲線長得很怪，但 cos z 是全純函數，有反導函數。", "只要起點 z(0) 與終點 z(1)；sin(iy) = i sinh y。"],
      solution: "z(0) = 0、z(1) = i。∫ cos z dz = sin i − sin 0 = i sinh 1，虛部 sinh 1 ≈ 1.1752。",
      solutionSteps: ["端點：z(0) = 0，z(1) = sin π + i = i。", "sin z 是反導函數：積分 = sin i − sin 0。", "sin i = i sinh 1，虛部 sinh 1 = (e − e⁻¹)/2 ≈ 1.1752。"],
      verify: { m: "lineIntegral", kind: "work", F: ["-\\sin x\\sinh y", "\\cos x\\cosh y"],
        path: { x: "\\sin(\\pi t)", y: "t", from: 0, to: 1 } } },
    { id: "cg-11h-013", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "C_R\\text{ 是上半圓 }|z|=4,\\ \\operatorname{Im}z\\ge 0\\text{。用 ML 不等式（}M\\text{ 取 }\\left|\\frac{1}{z^2+4}\\right|\\text{ 在 }C_R\\,\\text{ 上的最大值、}L\\,\\text{ 是弧長）求 }\\left|\\int_{C_R}\\frac{dz}{z^2+4}\\right|\\text{ 的上界}",
      answer: "pi/3", timeLimit: 100,
      tags: ["contour-integral-ml-bound", "contour-integral"],
      hints: ["|z² + 4| 在 |z| = 4 上最小是多少？三角不等式 |z² + 4| ≥ |z|² − 4。", "半圓的長度是 πR。"],
      solution: "|z²+4| ≥ 16 − 4 = 12，在 z = 4i 取等號，所以 M = 1/12；L = 4π。上界 ML = π/3。",
      solutionSteps: ["|z² + 4| ≥ |z|² − 4 = 12，z = 4i 時 z² + 4 = −12，等號成立。", "M = 1/12，L = π·4 = 4π。", "|∫| ≤ ML = 4π/12 = π/3。"],
      verify: { m: "let", with: {
        M: { m: "extremeOf", kind: "sup", integer: false, f: "\\frac{1}{\\sqrt{(16\\cos 2x+4)^2+(16\\sin 2x)^2}}", range: [0, "\\pi"] },
        L: { m: "lineIntegral", kind: "ds", f: "1", path: { x: "4\\cos t", y: "4\\sin t", from: 0, to: "\\pi" } } },
        f: "M\\cdot L" } },
    { id: "cg-11h-014", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "C\\text{ 是從 }0\\text{ 到 }1+i\\,\\text{ 的線段。用 ML 不等式（}M\\text{ 取 }|z^2|\\text{ 在 }C\\,\\text{ 上的最大值、}L\\,\\text{ 是 }C\\,\\text{ 的長度）求 }\\left|\\int_C z^2\\,dz\\right|\\text{ 的上界}",
      answer: "2*sqrt(2)", timeLimit: 80,
      tags: ["contour-integral-ml-bound", "contour-integral"],
      hints: ["線段上 |z| 最大在哪一端？", "線段長度是 |1 + i|。"],
      solution: "線段上 |z| ≤ |1+i| = √2，M = 2；L = √2。上界 ML = 2√2（實際值 |(1+i)³/3| = 2√2/3，在界內）。",
      solutionSteps: ["z = t(1 + i)，|z|² = 2t² ≤ 2，所以 M = 2。", "L = |1 + i| = √2。", "ML = 2√2 ≈ 2.828。"],
      verify: { m: "let", with: {
        M: { m: "extremeOf", kind: "sup", integer: false, f: "2x^2", range: [0, 1] },
        L: { m: "lineIntegral", kind: "ds", f: "1", path: { x: "t", y: "t", from: 0, to: 1 } } },
        f: "M\\cdot L" } },

    /* ── 11.43 Cauchy 定理 ── */
    { id: "cg-11h-015", topic: "integrals", rank: 2, answerKind: "numeric",
      prompt: "\\oint_{|z|=1}\\frac{e^{z}}{z-2}\\,dz",
      answer: "0", timeLimit: 50,
      tags: ["cauchy-theorem-singularity-location", "contour-integral"],
      hints: ["被積函數哪裡不全純？", "那一點在不在單位圓裡面？"],
      solution: "唯一的奇異點 z = 2 在 |z| = 1 外面，被積函數在圓上與圓內全純，由 Cauchy 定理積分是 0。",
      solutionSteps: ["奇異點只有 z = 2。", "|2| = 2 > 1，在圓外。", "圓內全純 → Cauchy 定理 → 0。"],
      verify: loop("exp(z)/(z-2)", 0, 1, "abs") },
    { id: "cg-11h-016", topic: "integrals", rank: 2, answerKind: "text",
      prompt: "\\text{沿 }|z|=2\\text{ 逆時針積分，下列哪一個被積函數 }f\\text{ 可以直接用 Cauchy 定理說 }\\oint f\\,dz=0\\text{？}",
      answer: "cos z/(z² + 9)", answers: ["cos z/(z² + 9)"], canonical: "cos z/(z² + 9)",
      distractors: ["1/(z − 1)", "sin z/z²", "z̄（共軛）"], timeLimit: 70,
      tags: ["cauchy-theorem-singularity-location", "contour-integral"],
      hints: ["Cauchy 定理要的是：圓上與圓內處處全純。", "每個選項找出奇異點（或不全純的原因），看它在不在 |z| < 2 裡。"],
      solution: "z² + 9 = 0 在 z = ±3i，都在 |z| = 2 外，cos z/(z²+9) 在圓內全純。1/(z−1)、sin z/z² 的奇異點在圓內；z̄ 處處不全純。",
      solutionSteps: ["cos z/(z² + 9)：奇異點 ±3i，|±3i| = 3 > 2，圓內全純 → 0。", "1/(z − 1)：z = 1 在圓內；sin z/z²：z = 0 在圓內（留數 1）。", "z̄ 不滿足 CR 方程，∮ z̄ dz = 8πi ≠ 0。"],
      verify: { m: "choice", options: [
        { say: "cos z/(z² + 9)", v: loop("cos(z)/(z^2+9)", 0, 2, "abs"), eq: 0 },
        { say: "1/(z − 1)", v: loop("1/(z-1)", 0, 2, "abs"), eq: 0 },
        { say: "sin z/z²", v: loop("sin(z)/z^2", 0, 2, "abs"), eq: 0 },
        { say: "z̄（共軛）", v: loop("x-i*y", 0, 2, "abs"), eq: 0 }
      ] } },
    { id: "cg-11h-017", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\oint_{|z-1-i|=1.2}\\frac{dz}{z^2+1}",
      answer: "pi", timeLimit: 100,
      tags: ["cauchy-theorem-singularity-location", "contour-integral", "residue"],
      hints: ["z² + 1 = 0 的兩個根，各自到圓心 1 + i 的距離是多少？", "只有圓內那一個有貢獻；把另一個因式留在分子當作全純部分。"],
      solution: "根 ±i：|i − (1+i)| = 1 < 1.2 在內，|−i − (1+i)| = √5 在外。∮ = 2πi·1/(2i) = π。",
      solutionSteps: ["z² + 1 = (z − i)(z + i)。", "到圓心 1 + i 的距離：i 是 1（在內），−i 是 √5（在外）。", "∮ = 2πi · 1/(i + i) = π。"],
      verify: reLoop("1/(z^2+1)", "1+i", 1.2) },
    { id: "cg-11h-018", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\frac{1}{2\\pi i}\\oint_{|z|=3}\\frac{3z+1}{z^2-4}\\,dz",
      answer: "3", timeLimit: 90,
      tags: ["cauchy-theorem-deformation", "contour-integral", "partial-fraction"],
      hints: ["把 (3z+1)/(z²−4) 拆成 A/(z−2) + B/(z+2)。", "兩個極點都在 |z| = 3 裡，各自縮成小圓。"],
      solution: "(3z+1)/(z²−4) = (7/4)/(z−2) + (5/4)/(z+2)。兩個都在圓內，各貢獻 2πi 乘係數：7/4 + 5/4 = 3。",
      solutionSteps: ["部分分式：A = 7/4（代 z = 2），B = 5/4（代 z = −2）。", "±2 都在 |z| = 3 內，變形成兩個小圓。", "(1/2πi)∮ = A + B = 3。"],
      verify: loop("(3*z+1)/(z^2-4)", 0, 3) },
    { id: "cg-11h-019", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\frac{1}{2\\pi i}\\oint_{|z|=2}\\frac{z+5}{z^2+2z-3}\\,dz",
      answer: "3/2", timeLimit: 90,
      tags: ["cauchy-theorem-deformation", "contour-integral", "partial-fraction"],
      hints: ["z² + 2z − 3 先因式分解。", "拆成部分分式後，圓外那一項的積分是 0。"],
      solution: "z²+2z−3 = (z−1)(z+3)，(z+5)/(…) = (3/2)/(z−1) − (1/2)/(z+3)。只有 z = 1 在 |z| = 2 內，答案 3/2。",
      solutionSteps: ["(z − 1)(z + 3)；部分分式係數：z = 1 處 6/4 = 3/2，z = −3 處 2/(−4) = −1/2。", "−3 在圓外，那一項全純，積分 0。", "(1/2πi)∮ = 3/2。"],
      verify: loop("(z+5)/(z^2+2*z-3)", 0, 2) },

    /* ── 11.44 Cauchy 積分公式 ── */
    { id: "cg-11h-020", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\operatorname{Im}\\oint_{|z|=2}\\frac{e^{z}}{z-1}\\,dz",
      answer: "2*pi*exp(1)", timeLimit: 80,
      tags: ["cauchy-formula-apply", "contour-integral"],
      hints: ["認出 f(z) 與 z₀：分母是 z − z₀。", "∮ f(z)/(z − z₀) dz = 2πi·f(z₀)。"],
      solution: "f(z) = eᶻ、z₀ = 1 在圓內。∮ = 2πi·e，虛部 2πe。",
      solutionSteps: ["f(z) = eᶻ 在 |z| ≤ 2 全純，z₀ = 1 在圓內。", "∮ = 2πi f(1) = 2πie。", "虛部 2πe ≈ 17.08。"],
      verify: imLoop("exp(z)/(z-1)", 0, 2) },
    { id: "cg-11h-021", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\frac{1}{2\\pi i}\\oint_{|z|=4}\\frac{z^3+2z}{z-3}\\,dz",
      answer: "33", timeLimit: 70,
      tags: ["cauchy-formula-apply", "contour-integral"],
      hints: ["f(z) = z³ + 2z 是多項式，處處全純。", "z₀ = 3 在 |z| = 4 裡面嗎？"],
      solution: "Cauchy 積分公式：(1/2πi)∮ f(z)/(z−3) dz = f(3) = 27 + 6 = 33。",
      solutionSteps: ["f(z) = z³ + 2z，z₀ = 3，|3| < 4。", "(1/2πi)∮ = f(3)。", "f(3) = 27 + 6 = 33。"],
      verify: loop("(z^3+2*z)/(z-3)", 0, 4) },
    { id: "cg-11h-022", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\operatorname{Im}\\oint_{|z-i|=1}\\frac{z^2+3}{z-i}\\,dz",
      answer: "4*pi", timeLimit: 80,
      tags: ["cauchy-formula-apply", "contour-integral"],
      hints: ["圓心就是 z₀ = i。", "f(i) = i² + 3。"],
      solution: "f(z) = z² + 3，∮ = 2πi·f(i) = 2πi·2 = 4πi，虛部 4π。",
      solutionSteps: ["f(z) = z² + 3，z₀ = i 在圓內（就是圓心）。", "f(i) = −1 + 3 = 2。", "∮ = 4πi，虛部 4π ≈ 12.57。"],
      verify: imLoop("(z^2+3)/(z-i)", "i", 1) },
    { id: "cg-11h-023", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\frac{1}{2\\pi i}\\oint_{|z|=1}\\frac{e^{3z}}{z^2}\\,dz",
      answer: "3", timeLimit: 70,
      tags: ["cauchy-formula-derivative", "contour-integral"],
      hints: ["分母是 (z − 0)²，對應導數版的 n = 1。", "(1/2πi)∮ f/(z − z₀)^{n+1} dz = f⁽ⁿ⁾(z₀)/n!。"],
      solution: "f(z) = e^{3z}、n = 1：(1/2πi)∮ = f′(0) = 3e⁰ = 3。",
      solutionSteps: ["f(z) = e^{3z}，z₀ = 0，分母次數 2 → n = 1。", "f′(z) = 3e^{3z}。", "f′(0)/1! = 3。"],
      verify: loop("exp(3*z)/z^2", 0, 1) },
    { id: "cg-11h-024", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\frac{1}{2\\pi i}\\oint_{|z|=4}\\frac{\\cos z}{(z-\\pi)^3}\\,dz",
      answer: "1/2", timeLimit: 90,
      tags: ["cauchy-formula-derivative", "contour-integral"],
      hints: ["π 在 |z| = 4 裡面。分母三次 → 用二階導數。", "記得除以 2!。"],
      solution: "f = cos z、n = 2：(1/2πi)∮ = f″(π)/2! = (−cos π)/2 = 1/2。",
      solutionSteps: ["z₀ = π，|π| < 4；分母 (z − π)³ → n = 2。", "f″(z) = −cos z，f″(π) = 1。", "f″(π)/2! = 1/2。"],
      verify: loop("cos(z)/(z-pi)^3", 0, 4) },
    { id: "cg-11h-025", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\operatorname{Im}\\oint_{|z-1|=1}\\frac{z^4}{(z-1)^4}\\,dz",
      answer: "8*pi", timeLimit: 100,
      tags: ["cauchy-formula-derivative", "contour-integral"],
      hints: ["分母四次 → 三階導數，除以 3!。", "f(z) = z⁴ 的三階導數是一次式。"],
      solution: "f = z⁴、n = 3：∮ = 2πi·f‴(1)/3! = 2πi·24/6 = 8πi，虛部 8π。",
      solutionSteps: ["z₀ = 1（圓心），n = 3。", "f‴(z) = 24z，f‴(1) = 24，除以 3! = 6 得 4。", "∮ = 2πi·4 = 8πi，虛部 8π ≈ 25.13。"],
      verify: imLoop("z^4/(z-1)^4", 1, 1) },
    { id: "cg-11h-026", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\frac{1}{2\\pi i}\\oint_{|z-3|=1}\\frac{e^{z}}{z^2-4z+3}\\,dz",
      answer: "exp(3)/2", timeLimit: 110,
      tags: ["cauchy-formula-factor-split", "contour-integral"],
      hints: ["z² − 4z + 3 先分解，看哪個根在 |z − 3| < 1 裡。", "圓外那個因式併進 f(z)，它在圓內全純。"],
      solution: "z²−4z+3 = (z−1)(z−3)，只有 3 在圓內。f(z) = eᶻ/(z−1)，(1/2πi)∮ = f(3) = e³/2。",
      solutionSteps: ["(z − 1)(z − 3)；|1 − 3| = 2 > 1 在外，3 是圓心。", "寫成 f(z)/(z − 3)，f(z) = eᶻ/(z − 1) 在圓內全純。", "f(3) = e³/2 ≈ 10.04。"],
      verify: loop("exp(z)/(z^2-4*z+3)", 3, 1) },
    { id: "cg-11h-027", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\oint_{|z-2i|=2}\\frac{z^2}{z^2+9}\\,dz",
      answer: "-3*pi", timeLimit: 120,
      tags: ["cauchy-formula-factor-split", "contour-integral"],
      hints: ["z² + 9 = (z − 3i)(z + 3i)；兩個根到 2i 的距離各是多少？", "圓內的根當 z₀，另一個因式留給 f(z)。"],
      solution: "3i 距 2i 為 1（在內），−3i 距 5（在外）。f(z) = z²/(z+3i)，∮ = 2πi·f(3i) = 2πi·(−9)/(6i) = −3π。",
      solutionSteps: ["|3i − 2i| = 1 < 2 在內；|−3i − 2i| = 5 在外。", "f(z) = z²/(z + 3i)，f(3i) = −9/(6i) = 3i/2。", "∮ = 2πi · 3i/2 = −3π。"],
      verify: reLoop("z^2/(z^2+9)", "2*i", 2) },

    /* ── 11.45 複數上的 Taylor 級數 ── */
    { id: "cg-11i-001", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\frac{1}{x^2+9}\\text{ 的 Maclaurin 級數收斂半徑}",
      answer: "3", timeLimit: 70,
      tags: ["complex-taylor-radius-singularity", "radius-of-convergence", "taylor"],
      hints: ["把 x 換成複數 z：分母在哪裡等於 0？", "收斂半徑 = 展開點到最近奇異點的距離。"],
      solution: "z² + 9 = 0 在 z = ±3i，離原點 3，所以收斂半徑 3（實數線上看不到這兩個點）。",
      solutionSteps: ["複數奇異點：z = ±3i。", "到展開點 0 的距離 |±3i| = 3。", "收斂半徑 R = 3。"],
      verify: { m: "let", with: { a: coef("1/(z^2+9)", "0", 20, 2), b: coef("1/(z^2+9)", "0", 22, 2) }, f: "\\sqrt{-a/b}" } },
    { id: "cg-11i-002", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\tan(2x)\\text{ 的 Maclaurin 級數收斂半徑}",
      answer: "pi/4", timeLimit: 70,
      tags: ["complex-taylor-radius-singularity", "radius-of-convergence", "taylor"],
      hints: ["tan(2z) 在 cos(2z) = 0 的地方爆掉。", "離 0 最近的那幾個點距離多少？"],
      solution: "cos 2z = 0 ⇔ z = π/4 + kπ/2（cos 的零點都在實軸上），離 0 最近是 ±π/4，所以 R = π/4。",
      solutionSteps: ["奇異點：cos 2z = 0，z = π/4 + kπ/2。", "最近的是 ±π/4。", "R = π/4 ≈ 0.785。"],
      verify: { m: "let", with: { a: coef("sin(2*z)/cos(2*z)", "0", 21, 0.5), b: coef("sin(2*z)/cos(2*z)", "0", 23, 0.5) }, f: "\\sqrt{a/b}" } },
    { id: "cg-11i-003", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\frac{1}{1+x^2}\\text{ 在 }x=1\\text{ 展開的 Taylor 級數收斂半徑}",
      answer: "sqrt(2)", timeLimit: 80,
      tags: ["complex-taylor-radius-singularity", "radius-of-convergence", "taylor"],
      hints: ["奇異點還是 z = ±i，但展開點換成 1。", "距離是 |1 − i|。"],
      solution: "奇異點 ±i，到 1 的距離 |1 ∓ i| = √2，所以 R = √2（級數在 (1 − √2, 1 + √2) 收斂）。",
      solutionSteps: ["1 + z² = 0 ⇔ z = ±i。", "|1 − i| = |1 + i| = √2。", "R = √2 ≈ 1.414。"],
      verify: { m: "let", with: { a: coef("1/(1+z^2)", "1", 10, 1), b: coef("1/(1+z^2)", "1", 18, 1) }, f: "(a/b)^{1/8}" } },
    { id: "cg-11i-004", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "\\tan x\\text{ 在 }x=1\\text{ 展開的 Taylor 級數收斂半徑}",
      answer: "pi/2-1", timeLimit: 80,
      tags: ["complex-taylor-radius-singularity", "radius-of-convergence", "taylor"],
      hints: ["tan z 的奇異點是 cos z = 0 的點。", "哪一個離 1 最近？"],
      solution: "奇異點 π/2 + kπ，離 1 最近的是 π/2，距離 π/2 − 1 ≈ 0.571，所以 R = π/2 − 1。",
      solutionSteps: ["cos z = 0 ⇔ z = π/2 + kπ（全在實軸）。", "離 1 最近：π/2（距離 π/2 − 1），其次 −π/2（距離 π/2 + 1）。", "R = π/2 − 1 ≈ 0.571。"],
      verify: { m: "let", with: { a: coef("sin(z)/cos(z)", "1", 20, 0.3), b: coef("sin(z)/cos(z)", "1", 21, 0.3) }, f: "a/b" } },
    { id: "cg-11i-005", topic: "series", rank: 2, answerKind: "text",
      prompt: "\\frac{1}{1+x^2}\\text{ 在整條實數線上無限次可微，但 Maclaurin 級數只在 }|x|<1\\text{ 收斂。真正的原因是？}",
      answer: "複數 z = ±i 讓分母為 0，離原點距離 1", answers: ["複數 z = ±i 讓分母為 0，離原點距離 1"],
      canonical: "複數 z = ±i 讓分母為 0，離原點距離 1",
      distractors: ["函數在 x = ±1 不連續", "函數在 x = ±1 有水平切線", "函數在 x = ±1 取到最大值"], timeLimit: 60,
      tags: ["complex-taylor-real-mystery", "radius-of-convergence", "taylor"],
      hints: ["在實數線上找不到任何壞點。", "收斂半徑看的是複數平面上的圓盤。"],
      solution: "收斂半徑等於到最近複數奇異點的距離。1 + z² = 0 在 z = ±i，|±i| = 1，所以 R = 1；x = ±1 本身完全正常。",
      solutionSteps: ["實數上 1/(1+x²) 處處光滑，x = ±1 不特別。", "複數上 1 + z² = 0 ⇔ z = ±i。", "圓盤 |z| < 1 碰到 ±i 就停，R = 1。"],
      verify: { m: "choice", options: [
        { say: "複數 z = ±i 讓分母為 0，離原點距離 1", all: [
          { v: at("1+z^2", "i"), eq: 0 }, { v: at("1+z^2", "-i"), eq: 0 }, { v: at("z", "i"), eq: 1 }] },
        { say: "函數在 x = ±1 不連續", v: { m: "limit", f: "\\frac{1}{1+x^2}", at: 1 }, ne: "1/2" },
        { say: "函數在 x = ±1 有水平切線", v: { m: "deriv", f: "\\frac{1}{1+x^2}", at: [1] }, eq: 0 },
        { say: "函數在 x = ±1 取到最大值", v: { m: "value", f: "\\frac{1}{1+1^2}" }, ge: 1 }
      ] } },

    /* ── 11.46 Laurent 級數 ── */
    { id: "cg-11i-006", topic: "series", rank: 4, answerKind: "numeric",
      prompt: "\\frac{1}{(z-1)(z-2)}\\text{ 在環 }1<|z|<2\\text{ 的 Laurent 展開中，}z^{-3}\\text{ 的係數}",
      answer: "-1", timeLimit: 120,
      tags: ["laurent-annulus-choice", "laurent", "partial-fraction"],
      hints: ["先拆成 1/(z−2) − 1/(z−1)。", "在這個環上 |1/z| < 1 而 |z/2| < 1：各自往能收斂的方向展開。"],
      solution: "1/(z−2) = −½Σ(z/2)ⁿ 只有非負次方；−1/(z−1) = −(1/z)Σz^{−n} = −Σz^{−n−1}。z^{−3} 的係數 −1。",
      solutionSteps: ["1/((z−1)(z−2)) = 1/(z−2) − 1/(z−1)。", "|z| < 2：1/(z−2) 只有正次方。|z| > 1：−1/(z−1) = −z⁻¹ − z⁻² − z⁻³ − ⋯。", "z⁻³ 的係數 −1。"],
      verify: loop("z^2/((z-1)*(z-2))", 0, 1.5) },
    { id: "cg-11i-007", topic: "series", rank: 4, answerKind: "numeric",
      prompt: "\\frac{1}{(z-1)(z-2)}\\text{ 在 }|z|>2\\text{ 的 Laurent 展開中，}z^{-3}\\text{ 的係數}",
      answer: "3", timeLimit: 120,
      tags: ["laurent-annulus-choice", "laurent", "partial-fraction"],
      hints: ["|z| > 2 時兩項都要寫成 1/z 的幾何級數。", "1/(z−a) = (1/z)·1/(1 − a/z)。"],
      solution: "1/(z−2) = Σ2ⁿz^{−n−1}，−1/(z−1) = −Σz^{−n−1}。z^{−3}（n = 2）的係數 4 − 1 = 3。",
      solutionSteps: ["1/(z−2) = Σ_{n≥0} 2ⁿ z^{−n−1}（|z| > 2）。", "−1/(z−1) = −Σ_{n≥0} z^{−n−1}（|z| > 1）。", "z⁻³ 對應 n = 2：2² − 1 = 3。"],
      verify: loop("z^2/((z-1)*(z-2))", 0, 3) },
    { id: "cg-11i-008", topic: "series", rank: 4, answerKind: "numeric",
      prompt: "\\frac{z}{(z+1)(z-3)}\\text{ 在環 }1<|z|<3\\text{ 的 Laurent 展開中，}z^{2}\\text{ 的係數}",
      answer: "-1/36", timeLimit: 120,
      tags: ["laurent-annulus-choice", "laurent", "partial-fraction"],
      hints: ["部分分式：A/(z+1) + B/(z−3)。", "在這個環上，哪一項會給出 z 的正次方？"],
      solution: "z/((z+1)(z−3)) = (1/4)/(z+1) + (3/4)/(z−3)。|z|>1 時第一項只有負次方；(3/4)/(z−3) = −(1/4)Σ(z/3)ⁿ，z² 係數 −1/36。",
      solutionSteps: ["A = (−1)/(−4) = 1/4，B = 3/4。", "|z| > 1：(1/4)/(z+1) 全是負次方。", "|z| < 3：(3/4)/(z−3) = −(1/4)Σ(z/3)ⁿ，z² 係數 −(1/4)(1/9) = −1/36。"],
      verify: loop("z/((z+1)*(z-3)*z^3)", 0, 2) },

    /* ── 11.47 奇異點 ── */
    { id: "cg-11i-009", topic: "series", rank: 3, answerKind: "text",
      prompt: "z=0\\text{ 是 }\\frac{z}{e^{z}-1}\\text{ 的哪一種孤立奇異點？}",
      answer: "可去奇異點", answers: ["可去奇異點"], canonical: "可去奇異點",
      distractors: ["極點", "本性奇異點"], timeLimit: 60,
      tags: ["singularity-classify", "laurent"],
      hints: ["z → 0 時 e^z − 1 ≈ ?", "極限存在而且有限，代表什麼？"],
      solution: "eᶻ − 1 = z + z²/2 + ⋯，所以 z/(eᶻ−1) = 1/(1 + z/2 + ⋯) → 1，極限有限：可去奇異點。",
      solutionSteps: ["eᶻ − 1 = z(1 + z/2 + z²/6 + ⋯)。", "z/(eᶻ − 1) = 1/(1 + z/2 + ⋯) → 1。", "極限有限 → 可去奇異點。"],
      verify: { m: "choice", options: classify("z/(exp(z)-1)", "0") } },
    { id: "cg-11i-010", topic: "series", rank: 3, answerKind: "text",
      prompt: "z=\\pi\\text{ 是 }\\frac{1}{\\sin z}\\text{ 的哪一種孤立奇異點？}",
      answer: "極點", answers: ["極點"], canonical: "極點",
      distractors: ["可去奇異點", "本性奇異點"], timeLimit: 60,
      tags: ["singularity-classify", "laurent"],
      hints: ["sin z 在 π 是幾階零點？看 (sin z)′ 在 π 的值。", "分母一階零點、分子不為 0，會是什麼？"],
      solution: "sin π = 0、cos π = −1 ≠ 0，sin z 在 π 是一階零點，所以 1/sin z 在 π 是（一階）極點。",
      solutionSteps: ["sin π = 0，(sin z)′ = cos π = −1 ≠ 0 → 一階零點。", "分子 1 ≠ 0。", "1/sin z 在 π 是一階極點。"],
      verify: { m: "choice", options: classify("1/sin(z)", "pi") } },
    { id: "cg-11i-011", topic: "series", rank: 3, answerKind: "text",
      prompt: "z=0\\text{ 是 }z^2e^{1/z}\\text{ 的哪一種孤立奇異點？}",
      answer: "本性奇異點", answers: ["本性奇異點"], canonical: "本性奇異點",
      distractors: ["可去奇異點", "極點"], timeLimit: 70,
      tags: ["singularity-classify", "laurent"],
      hints: ["把 e^{1/z} 展開成 Σ z^{−n}/n!，再乘 z²。", "負次方有幾項？"],
      solution: "z²e^{1/z} = Σ z^{2−n}/n!，負次方 z⁻¹, z⁻², … 有無窮多項，是本性奇異點（z² 救不回來）。",
      solutionSteps: ["e^{1/z} = Σ_{n≥0} z^{−n}/n!。", "乘 z²：Σ z^{2−n}/n!，n ≥ 3 全是負次方，無窮多項。", "主要部分無窮多項 → 本性奇異點。"],
      verify: { m: "choice", options: classify("z^2*exp(1/z)", "0") } },
    { id: "cg-11i-012", topic: "series", rank: 3, answerKind: "text",
      prompt: "z=2\\pi i\\text{ 是 }\\frac{z}{e^{z}-1}\\text{ 的哪一種孤立奇異點？}",
      answer: "極點", answers: ["極點"], canonical: "極點",
      distractors: ["可去奇異點", "本性奇異點"], timeLimit: 70,
      tags: ["singularity-classify", "laurent"],
      hints: ["e^{2πi} = 1，所以分母在 2πi 是 0；它是幾階零點？", "分子在 2πi 等不等於 0？（跟 z = 0 那個點比較）"],
      solution: "(eᶻ−1)′ = eᶻ 在 2πi 是 1 ≠ 0，一階零點；分子 2πi ≠ 0，所以是一階極點（和 z = 0 的可去不同）。",
      solutionSteps: ["e^{2πi} − 1 = 0，導數 e^{2πi} = 1 ≠ 0 → 分母一階零點。", "分子 z = 2πi ≠ 0，不會抵消。", "一階極點。"],
      verify: { m: "choice", options: classify("z/(exp(z)-1)", "2*pi*i") } },
    { id: "cg-11i-013", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "z=0\\text{ 是 }\\frac{z-\\sin z}{z^7}\\text{ 的幾階極點？}",
      answer: "4", timeLimit: 70,
      tags: ["pole-order", "laurent"],
      hints: ["z − sin z 在 0 是幾階零點？展開 sin z。", "極點階數 = 分母零點階數 − 分子零點階數。"],
      solution: "z − sin z = z³/6 − z⁵/120 + ⋯，三階零點；分母七階，7 − 3 = 4 階極點。",
      solutionSteps: ["sin z = z − z³/6 + ⋯，所以 z − sin z = z³/6 − ⋯（三階零點）。", "分母 z⁷：七階。", "7 − 3 = 4。"],
      verify: order("(z-sin(z))/z^7", "0") },
    { id: "cg-11i-014", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "z=0\\text{ 是 }\\frac{1}{z^2(e^{z}-1)}\\text{ 的幾階極點？}",
      answer: "3", timeLimit: 60,
      tags: ["pole-order", "laurent"],
      hints: ["eᶻ − 1 在 0 是幾階零點？", "整個分母的零點階數相加。"],
      solution: "eᶻ − 1 = z + ⋯ 是一階零點，分母 z²(eᶻ−1) 是三階零點，分子 1，所以三階極點。",
      solutionSteps: ["eᶻ − 1 = z(1 + z/2 + ⋯)，一階零點。", "z²(eᶻ − 1) 是 2 + 1 = 3 階零點。", "三階極點。"],
      verify: order("1/(z^2*(exp(z)-1))", "0") },
    { id: "cg-11i-015", topic: "series", rank: 3, answerKind: "numeric",
      prompt: "z=\\pi\\text{ 是 }\\frac{\\sin z}{(z-\\pi)^4}\\text{ 的幾階極點？}",
      answer: "3", timeLimit: 60,
      tags: ["pole-order", "laurent"],
      hints: ["分子 sin z 在 π 也是 0，別忘了它。", "sin z 在 π 是幾階零點？"],
      solution: "sin z 在 π 是一階零點（cos π ≠ 0），分母四階，4 − 1 = 3 階極點。",
      solutionSteps: ["sin π = 0，cos π = −1 ≠ 0：分子一階零點。", "分母 (z − π)⁴：四階。", "4 − 1 = 3。"],
      verify: order("sin(z)/(z-pi)^4", "pi") },

    /* ── 11.48 留數 ── */
    { id: "cg-11i-016", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\operatorname{Res}_{z=2i}\\frac{1}{z^2+4}\\text{ 寫成 }a+b\\,i\\,\\text{，求 }b",
      answer: "-1/4", timeLimit: 70,
      tags: ["residue-simple-pole", "residue"],
      hints: ["z² + 4 = (z − 2i)(z + 2i)，2i 是簡單極點。", "留數 = lim (z − 2i)f(z)；1/i = −i。"],
      solution: "Res = 1/(2i + 2i) = 1/(4i) = −i/4，虛部 b = −1/4。",
      solutionSteps: ["簡單極點：Res = 1/(z + 2i) 在 z = 2i。", "= 1/(4i) = −i/4。", "a = 0，b = −1/4。"],
      verify: loop("1/(z^2+4)", "2*i", 1, "im") },
    { id: "cg-11i-017", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\operatorname{Res}_{z=1+i}\\frac{1}{z^2-2z+2}\\text{ 寫成 }a+b\\,i\\,\\text{，求 }b",
      answer: "-1/2", timeLimit: 80,
      tags: ["residue-simple-pole", "residue"],
      hints: ["z² − 2z + 2 的根是 1 ± i。", "g/h′ 公式：h′(z) = 2z − 2。"],
      solution: "h′(1+i) = 2(1+i) − 2 = 2i，Res = 1/(2i) = −i/2，b = −1/2。",
      solutionSteps: ["根 1 ± i，1 + i 是簡單極點。", "Res = g/h′ = 1/(2z − 2) 在 1 + i = 1/(2i)。", "= −i/2，b = −1/2。"],
      verify: loop("1/(z^2-2*z+2)", "1+i", 1, "im") },
    { id: "cg-11i-018", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\operatorname{Res}_{z=i}\\frac{z^2}{(z-i)(z+2)}\\text{ 寫成 }a+b\\,i\\,\\text{，求 }a",
      answer: "-2/5", timeLimit: 90,
      tags: ["residue-simple-pole", "residue"],
      hints: ["拿掉 (z − i) 再代 z = i。", "分母有複數時乘共軛化簡。"],
      solution: "Res = i²/(i + 2) = −1/(2 + i) = −(2 − i)/5 = −2/5 + i/5，a = −2/5。",
      solutionSteps: ["簡單極點：Res = z²/(z + 2) 在 z = i。", "= −1/(2 + i) = −(2 − i)/5。", "= −2/5 + (1/5)i，a = −2/5。"],
      verify: loop("z^2/((z-i)*(z+2))", "i", 1, "re") },

    /* ── 11.49 留數定理 ── */
    { id: "cg-11i-019", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\frac{1}{2\\pi i}\\oint_{|z|=1/2}\\frac{z+3}{z(z-1)(z+4)}\\,dz",
      answer: "-3/4", timeLimit: 80,
      tags: ["residue-theorem-inside-check", "residue"],
      hints: ["三個極點 0、1、−4，哪些在 |z| < 1/2 裡？", "簡單極點的留數：拿掉那個因式再代值。"],
      solution: "只有 z = 0 在圓內，Res₀ = 3/((−1)(4)) = −3/4。",
      solutionSteps: ["極點 0、1、−4；只有 0 在 |z| < 1/2。", "Res₀ = (0 + 3)/((0 − 1)(0 + 4)) = −3/4。", "(1/2πi)∮ = −3/4。"],
      verify: loop("(z+3)/(z*(z-1)*(z+4))", 0, 0.5) },
    { id: "cg-11i-020", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\frac{1}{2\\pi i}\\oint_{|z|=2}\\frac{z+3}{z(z-1)(z+4)}\\,dz",
      answer: "1/20", timeLimit: 90,
      tags: ["residue-theorem-inside-check", "residue"],
      hints: ["這次圓內有兩個極點。", "各自算留數再相加。"],
      solution: "0 與 1 在圓內：Res₀ = −3/4，Res₁ = 4/(1·5) = 4/5。和 = 1/20。",
      solutionSteps: ["|z| < 2 內的極點：0、1（−4 在外）。", "Res₀ = −3/4，Res₁ = 4/5。", "−3/4 + 4/5 = 1/20。"],
      verify: loop("(z+3)/(z*(z-1)*(z+4))", 0, 2) },
    { id: "cg-11i-021", topic: "integrals", rank: 3, answerKind: "numeric",
      prompt: "\\frac{1}{2\\pi i}\\oint_{|z+3|=3.5}\\frac{z+3}{z(z-1)(z+4)}\\,dz",
      answer: "-4/5", timeLimit: 100,
      tags: ["residue-theorem-inside-check", "residue"],
      hints: ["圓心是 −3，不是 0。三個極點各自到 −3 的距離？", "圓內的留數相加。"],
      solution: "到 −3 的距離：0 是 3、−4 是 1（都在內），1 是 4（在外）。Res₀ + Res₋₄ = −3/4 + (−1)/20 = −4/5。",
      solutionSteps: ["|0 + 3| = 3、|−4 + 3| = 1 < 3.5；|1 + 3| = 4 > 3.5。", "Res₀ = −3/4，Res₋₄ = (−1)/((−4)(−5)) = −1/20。", "和 = −16/20 = −4/5。"],
      verify: loop("(z+3)/(z*(z-1)*(z+4))", -3, 3.5) },
    { id: "cg-11i-022", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\operatorname{Im}\\oint_{|z|=3}\\frac{e^{z}}{z^2-1}\\,dz",
      answer: "pi*(exp(1)-exp(-1))", timeLimit: 110,
      tags: ["residue-theorem-sum", "residue"],
      hints: ["±1 都在圓內，各是簡單極點。", "相加後乘 2πi，再取虛部。"],
      solution: "Res₁ = e/2，Res₋₁ = e⁻¹/(−2)。和 = sinh 1。∮ = 2πi sinh 1，虛部 2π sinh 1 = π(e − e⁻¹)。",
      solutionSteps: ["Res₁ = e¹/(1 + 1) = e/2；Res₋₁ = e⁻¹/(−1 − 1) = −e⁻¹/2。", "和 = (e − e⁻¹)/2 = sinh 1。", "∮ = 2πi sinh 1，虛部 π(e − e⁻¹) ≈ 7.38。"],
      verify: imLoop("exp(z)/(z^2-1)", 0, 3) },
    { id: "cg-11i-023", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\frac{1}{2\\pi i}\\oint_{|z|=3}\\frac{e^{z}}{z^2(z-2)}\\,dz",
      answer: "(exp(2)-3)/4", timeLimit: 120,
      tags: ["residue-theorem-sum", "residue", "residue-higher-order"],
      hints: ["z = 0 是二階極點，z = 2 是簡單極點，兩個都在圓內。", "二階極點：對 z²f(z) 微分一次再代 0。"],
      solution: "Res₀ = [eᶻ/(z−2)]′ 在 0 = (−2 − 1)/4 = −3/4；Res₂ = e²/4。和 (e² − 3)/4。",
      solutionSteps: ["Res₀ = d/dz[eᶻ/(z − 2)] 在 0 = [eᶻ(z − 2) − eᶻ]/(z − 2)² = −3/4。", "Res₂ = e²/2² = e²/4。", "和 = (e² − 3)/4 ≈ 1.097。"],
      verify: loop("exp(z)/(z^2*(z-2))", 0, 3) },
    { id: "cg-11i-024", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\oint_{|z-i|=2}\\frac{dz}{z^2(z^2+4)}",
      answer: "-pi/8", timeLimit: 120,
      tags: ["residue-theorem-sum", "residue", "residue-higher-order"],
      hints: ["四個極點 0（二階）、±2i：哪些離 i 不到 2？", "二階極點的留數也要算，可能是 0。"],
      solution: "0 與 2i 在圓內，−2i 在外。Res₀ = [1/(z²+4)]′(0) = 0；Res_{2i} = 1/(z²·2z) = 1/(−16i) = i/16。∮ = 2πi·i/16 = −π/8。",
      solutionSteps: ["|0 − i| = 1、|2i − i| = 1 在內；|−2i − i| = 3 在外。", "Res₀ = d/dz[1/(z² + 4)] 在 0 = 0；Res_{2i} = 1/((2i)²·4i) = i/16。", "∮ = 2πi · i/16 = −π/8。"],
      verify: reLoop("1/(z^2*(z^2+4))", "i", 2) },

    /* ── 11.50 用留數算實積分 ── */
    { id: "cg-11i-025", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^{2\\pi}\\frac{d\\theta}{3+2\\cos\\theta}",
      answer: "2*pi/sqrt(5)", timeLimit: 120,
      tags: ["residue-trig-substitution", "residue", "trig-integral"],
      hints: ["令 z = e^{iθ}：cos θ = (z + 1/z)/2，dθ = dz/(iz)。", "化成單位圓上的有理函數，只有一個極點在圓內。"],
      solution: "化成 ∮ 2/(i(2z²+6z+2)) dz = ∮ dz/(i(z²+3z+1))。根 (−3 ± √5)/2，圓內的是 (−3+√5)/2，留數 1/√5。答案 2π/√5。",
      solutionSteps: ["z = e^{iθ}：被積式變成 1/(i(z² + 3z + 1))。", "z² + 3z + 1 = 0 的根 (−3 ± √5)/2，只有 z₁ = (−3 + √5)/2 在 |z| < 1。", "2πi · 1/(i(2z₁ + 3)) = 2π/√5 ≈ 2.810。"],
      verify: { m: "integral", f: "\\frac{1}{3+2\\cos x}", a: 0, b: "2\\pi" } },
    { id: "cg-11i-026", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^{2\\pi}\\frac{\\cos\\theta}{5+4\\cos\\theta}\\,d\\theta",
      answer: "-pi/3", timeLimit: 150,
      tags: ["residue-trig-substitution", "residue", "trig-integral"],
      hints: ["cos θ/(5 + 4cos θ) = (1/4)(1 − 5/(5 + 4cos θ))。", "先用 z = e^{iθ} 算 ∫₀^{2π} dθ/(5 + 4cos θ)。"],
      solution: "∫ dθ/(5+4cos θ)：z = e^{iθ}，分母 2z²+5z+2 的圓內根 −1/2，得 2π/3。原式 = (1/4)(2π − 5·2π/3) = −π/3。",
      solutionSteps: ["cos θ/(5 + 4cos θ) = 1/4 − (5/4)/(5 + 4cos θ)。", "z = e^{iθ}：∫ dθ/(5 + 4cos θ) = ∮ dz/(i(2z² + 5z + 2))，圓內極點 −1/2，值 2π/3。", "原式 = 2π/4 − (5/4)(2π/3) = −π/3。"],
      verify: { m: "integral", f: "\\frac{\\cos x}{5+4\\cos x}", a: 0, b: "2\\pi" } },
    { id: "cg-11i-027", topic: "integrals", rank: 4, answerKind: "numeric",
      prompt: "\\int_0^{2\\pi}\\frac{d\\theta}{(2+\\cos\\theta)^2}",
      answer: "4*pi/(3*sqrt(3))", timeLimit: 150,
      tags: ["residue-trig-substitution", "residue", "residue-higher-order"],
      hints: ["z = e^{iθ} 之後分母是 (z² + 4z + 1)²，圓內的根是二階極點。", "二階極點的留數要微分一次。"],
      solution: "化成 ∮ 4z/(i(z²+4z+1)²) dz。圓內根 z₁ = −2+√3（二階），留數 (1/i)·[4z/(z−z₂)²]′(z₁) = 2/(3√3·i)。答案 4π/(3√3)。",
      solutionSteps: ["2 + cos θ = (z² + 4z + 1)/(2z)，被積式 → 4z/(i(z² + 4z + 1)²)。", "根 −2 ± √3，只有 z₁ = −2 + √3 在圓內，二階極點；z₁ − z₂ = 2√3。", "[4z/(z − z₂)²]′ 在 z₁ = 4/(z₁−z₂)² − 8z₁/(z₁−z₂)³ = 2/(3√3)；乘 2π 得 4π/(3√3) ≈ 2.418。"],
      verify: { m: "integral", f: "\\frac{1}{(2+\\cos x)^2}", a: 0, b: "2\\pi" } },
    { id: "cg-11i-028", topic: "integrals", rank: 5, answerKind: "numeric",
      prompt: "\\int_{-\\infty}^{\\infty}\\frac{x\\sin x}{x^2+9}\\,dx",
      answer: "pi*exp(-3)", timeLimit: 150,
      tags: ["residue-fourier-jordan", "residue", "fourier"],
      hints: ["改積 z e^{iz}/(z² + 9)，取虛部；分子分母次數只差 1，半圓那段要靠 Jordan 引理。", "上半平面只有 3i 一個極點。"],
      solution: "Res_{3i} z e^{iz}/(z²+9) = 3i e^{−3}/(6i) = e^{−3}/2。∫ x e^{ix}/(x²+9) = 2πi·e^{−3}/2 = πi e^{−3}，取虛部 π e^{−3}。",
      solutionSteps: ["考慮 f(z) = z e^{iz}/(z² + 9)，Jordan 引理讓上半圓的積分 → 0。", "上半平面極點 3i：Res = 3i·e^{−3}/(6i) = e^{−3}/2。", "∫ = 2πi·e^{−3}/2，虛部 π e^{−3} ≈ 0.1564。"],
      // 自動辨識器對 (−∞,∞) 上衰減慢（~1/x）的振盪被積函數會安靜地算錯（給 −0.282）；
      // 半條線的振盪外插是準的，所以拆成兩段各自數值積分再相加
      verify: { m: "let", with: {
        L: { m: "integral", f: "\\frac{x\\sin x}{x^2+9}", a: "-\\infty", b: 0 },
        R: { m: "integral", f: "\\frac{x\\sin x}{x^2+9}", a: 0, b: "\\infty" } }, f: "L+R" } },
    { id: "cg-11i-029", topic: "integrals", rank: 5, answerKind: "numeric",
      prompt: "\\int_{0}^{\\infty}\\frac{x\\sin 2x}{x^2+1}\\,dx",
      answer: "pi*exp(-2)/2", timeLimit: 150,
      tags: ["residue-fourier-jordan", "residue", "fourier"],
      hints: ["被積函數是偶函數，先算整條實數線再除以 2。", "改積 z e^{2iz}/(z² + 1)；k = 2 > 0，往上半平面接，Jordan 引理處理半圓。"],
      solution: "Res_i z e^{2iz}/(z²+1) = i e^{−2}/(2i) = e^{−2}/2，全線積分 = 2πi·e^{−2}/2 的虛部 = π e^{−2}，一半是 π e^{−2}/2。",
      solutionSteps: ["x sin 2x/(x² + 1) 是偶函數：∫₀^∞ = ½∫_{−∞}^{∞}。", "f(z) = z e^{2iz}/(z² + 1)，上半平面極點 i，Res = e^{−2}/2。", "全線 = Im(πi e^{−2}) = π e^{−2}；答案 π e^{−2}/2 ≈ 0.2126。"] }
  ];

  window.BUZZ_PROBLEMS = (window.BUZZ_PROBLEMS || []).concat(problems.map((problem) => ({
    source: SOURCE, difficulty: Math.min(4, problem.rank), ...problem })));
})();
