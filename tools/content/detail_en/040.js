// Detail v2, English — batch 040. Translation of tools/content/detail/040.js (text only; claims live in the Chinese file).
module.exports = {
  "cl-ser-017": {
    "spot": "Every term $\\frac{\\cos kx}{k^2}$ is bounded in absolute value by $\\frac{1}{k^2}$, and at $x=0$ every $\\cos kx$ equals $1$ — the bound is actually attained, so the worst error over all $x$ is exactly $\\sum_{k>N}\\frac{1}{k^2}$.",
    "why": "Uniform convergence asks about the worst $x$. Turn the worst case into the tail of a series, then trap that tail between two simple fractions with integrals — much cleaner than adding a hundred terms.",
    "steps": [
      "$\\left|S(x)-S_N(x)\\right|=\\left|\\sum_{k>N}\\frac{\\cos kx}{k^2}\\right|\\le\\sum_{k>N}\\frac{1}{k^2}$. At $x=0$ every term is $\\frac{1}{k^2}$, so equality holds and the worst error is exactly this tail.",
      "Trap the tail with integrals: $\\frac{1}{x^2}$ is decreasing, so $\\int_{N+1}^{\\infty}\\frac{dx}{x^2}<\\sum_{k\\ge N+1}\\frac{1}{k^2}<\\int_{N}^{\\infty}\\frac{dx}{x^2}$, i.e. $\\frac{1}{N+1}<\\text{tail}<\\frac{1}{N}$.",
      "$N=100$: tail $<\\frac{1}{100}=0.01$, good enough.",
      "$N=99$: the tail is $\\sum_{k\\ge 100}\\frac{1}{k^2}>\\int_{100}^{\\infty}\\frac{dx}{x^2}=0.01$, not good enough.",
      "So the smallest $N$ is $100$."
    ],
    "trap": "Confusing \"the $N$th term is below $0.01$\" with \"the tail is below $0.01$\": $\\frac{1}{N^2}<0.01$ gives $N=10$, but at $N=10$ the tail is about $0.095$ — off by almost a factor of ten.",
    "check": "The tail is roughly $\\frac{1}{N+\\frac{1}{2}}$: $N=100$ gives $0.00995$ and $N=99$ gives $0.01005$, straddling $0.01$ exactly."
  },
  "cl-ser-018": {
    "spot": "$M_n$ is the maximum absolute value of a function over the whole real line: numerator $x$, denominator $1+nx^2$, so it tends to $0$ as $x\\to\\pm\\infty$ and the maximum must sit where the derivative is zero.",
    "why": "The M-test needs the exact supremum, and plugging in a few points is unreliable; differentiating in $x$ finds the critical point in one line.",
    "steps": [
      "$n=4$: $g(x)=\\frac{x}{4(1+4x^2)}$ is odd, so just find its maximum for $x>0$.",
      "Differentiate: $g'(x)=\\frac{1-4x^2}{4(1+4x^2)^2}$ is $0$ at $x=\\frac{1}{2}$, positive to the left and negative to the right — a maximum.",
      "General $n$: critical point $x=\\frac{1}{\\sqrt n}$, maximum $\\frac{1}{n}\\cdot\\frac{1/\\sqrt n}{2}=\\frac{1}{2n^{3/2}}$, so $\\sum M_n$ is a p-series with $p=\\frac{3}{2}$ and converges.",
      "Plug in $x=\\frac{1}{2}$: $M_4=\\frac{1/2}{4\\cdot 2}=\\frac{1}{16}$."
    ],
    "trap": "Forgetting the outer $\\frac{1}{n}$ and computing only the maximum of $\\frac{x}{1+4x^2}$, which is $\\frac{1}{4}$; or writing the maximizer as $x=\\frac{1}{n}$.",
    "check": "Nearby points are smaller: $g(0.4)$ and $g(0.6)$ are both less than $\\frac{1}{16}$."
  },
  "cl-ser-027": {
    "spot": "The exponent is $n^2$ and there is a $3^n$ in the denominator: taking the $n$th root drops $n^2$ to $n$ and turns $3^n$ into $3$, leaving exactly the limit that defines $e$.",
    "why": "The Ratio Test would have to divide $(1+\\frac{1}{n+1})^{(n+1)^2}$ by $(1+\\frac{1}{n})^{n^2}$, which is messy; the general term is already a power, so the Root Test finishes in one step.",
    "steps": [
      "Take the $n$th root: $\\sqrt[n]{a_n}=\\frac{1}{3}\\left(1+\\frac{1}{n}\\right)^{n}$.",
      "$\\left(1+\\frac{1}{n}\\right)^n\\to e$.",
      "So $\\lim\\sqrt[n]{a_n}=\\frac{e}{3}$."
    ],
    "trap": "Treating $\\left(1+\\frac{1}{n}\\right)^{n^2}$ as tending to $e$, which gives $\\sqrt[n]{a_n}\\to\\frac{1}{3}$. In fact $\\left(1+\\frac{1}{n}\\right)^{n^2}=\\left[\\left(1+\\frac{1}{n}\\right)^n\\right]^n$ grows like $e^n$; only after the root does it become $e$.",
    "check": "$\\frac{e}{3}\\approx 0.906<1$, so $\\sum a_n$ converges — but since it is not far below $1$, it converges slowly."
  },
  "cl-ser-028": {
    "spot": "$a_n$ contains $(2n)!$ and $(n!)^2$, so the ratio of consecutive terms cancels down to a simple rational expression. The ratio limit is $1$, so the problem wants the finer Raabe quantity.",
    "why": "The Ratio Test is inconclusive when the limit is $1$. Raabe's test looks at how far the ratio is from $1$, times $n$ — exactly suited to a ratio that is a first-degree fraction.",
    "steps": [
      "Divide consecutive terms: $\\frac{a_{n+1}}{a_n}=\\frac{(2n+2)(2n+1)}{4(n+1)^2}=\\frac{2n+1}{2n+2}\\to 1$, so the Ratio Test fails.",
      "Flip it: $\\frac{a_n}{a_{n+1}}-1=\\frac{2n+2}{2n+1}-1=\\frac{1}{2n+1}$.",
      "Multiply by $n$: $\\frac{n}{2n+1}\\to\\frac{1}{2}$."
    ],
    "trap": "Using the ratio the wrong way round, $\\frac{a_{n+1}}{a_n}-1=-\\frac{1}{2n+2}$, times $n$ gives $-\\frac{1}{2}$. Raabe's quantity uses $\\frac{a_n}{a_{n+1}}$.",
    "check": "A Raabe limit of $\\frac{1}{2}<1$ means divergence, consistent with $a_n\\sim\\frac{1}{\\sqrt{\\pi n}}$ (like a p-series with $p=\\frac{1}{2}$)."
  },
  "cl-ser-030": {
    "spot": "$a_n$ contains $\\ln n$: substituting $n=2^k$ turns $\\ln 2^k=k\\ln 2$ into a polynomial, and $\\frac{1}{n^2}=\\frac{1}{4^k}$ cancels with the outer $2^k$ to give $\\frac{1}{2^k}$ — after condensation you get the familiar $\\sum\\frac{k}{2^k}$.",
    "why": "The Cauchy condensation test exists precisely to turn slowly varying factors like $\\ln n$ into $k$; afterwards all that is left is a standard power-series sum.",
    "steps": [
      "Substitute $n=2^k$: $2^k a_{2^k}=2^k\\cdot\\frac{k\\ln 2}{4^k}=\\ln 2\\cdot\\frac{k}{2^k}$.",
      "$\\sum_{k\\ge 1}kx^k=\\frac{x}{(1-x)^2}$; at $x=\\frac{1}{2}$ this is $2$.",
      "The condensed series sums to $=2\\ln 2$."
    ],
    "trap": "Forgetting the factor $2^k$ and computing only $\\sum a_{2^k}=\\ln 2\\sum\\frac{k}{4^k}=\\frac{4}{9}\\ln 2$.",
    "check": "The condensed series converges, so the original $\\sum\\frac{\\ln n}{n^2}$ converges too, and its sum lies between half of the condensed sum and the full condensed sum."
  },
  "cl-ser-031": {
    "spot": "The alternating sign $(-1)^{n+1}$ with $\\frac{n}{n^2+5}$: in absolute value it behaves like $\\frac{1}{n}$ (harmonic series), so only the alternation can make it converge — a classic candidate for conditional convergence.",
    "why": "Two separate questions: the absolute series is fastest with the Limit Comparison Test; the original series uses the Alternating Series Test, which only needs decreasing terms tending to zero.",
    "steps": [
      "Absolute values: $\\frac{n/(n^2+5)}{1/n}=\\frac{n^2}{n^2+5}\\to 1$, so it lives or dies with the harmonic series — $\\sum|a_n|$ diverges.",
      "Decreasing: $f(x)=\\frac{x}{x^2+5}$, $f'(x)=\\frac{5-x^2}{(x^2+5)^2}$, negative for $x>\\sqrt5$, so the terms decrease from $n\\ge 3$ on.",
      "Tends to zero: $\\frac{n}{n^2+5}\\to 0$; the Alternating Series Test says the original series converges.",
      "The original series converges but the absolute series diverges: conditionally convergent."
    ],
    "trap": "Answering \"absolutely convergent\" once the Alternating Series Test passes. That test only gives convergence; absolute convergence requires looking at $\\sum\\frac{n}{n^2+5}$, which diverges just like $\\sum\\frac{1}{n}$.",
    "check": "The first two terms $\\frac{1}{6}$, $\\frac{2}{9}$ actually increase, but decreasing only has to hold from some term on, so the conclusion stands."
  },
  "cl-ser-036": {
    "spot": "The coefficient $\\frac{(n!)^2}{(2n)!}$ is all factorials: dividing consecutive terms, $(n+1)!$ over $n!$ leaves one factor $n+1$, and $(2n+2)!$ over $(2n)!$ leaves two factors.",
    "why": "With factorials, use the ratio method for the radius — what remains is the limit of a rational expression. The root method would need the $n$th root of factorials, i.e. Stirling, a detour.",
    "steps": [
      "$\\frac{a_n}{a_{n+1}}=\\frac{(n!)^2}{(2n)!}\\cdot\\frac{(2n+2)!}{((n+1)!)^2}=\\frac{(2n+2)(2n+1)}{(n+1)^2}$.",
      "Take the limit: $\\frac{2(2n+1)}{n+1}\\to 4$.",
      "$R=\\lim\\left|\\frac{a_n}{a_{n+1}}\\right|=4$."
    ],
    "trap": "Using the ratio the other way ($\\frac{a_{n+1}}{a_n}\\to\\frac{1}{4}$) and calling that $R$, answering $\\frac{1}{4}$; $R$ is the reciprocal of that limit.",
    "check": "At $x=4$: the ratio of consecutive terms is $\\frac{4(n+1)^2}{(2n+2)(2n+1)}=\\frac{2n+2}{2n+1}>1$, so the terms grow, the endpoint diverges, and the radius really can't be larger."
  },
  "cl-ser-037": {
    "spot": "The power of $x$ is $3n$, not $n$, and the coefficient is $8^n=2^{3n}$: the whole term can be written $\\frac{(2x)^{3n}}{n}$ — a power series with gaps.",
    "why": "With missing powers, the formula $\\frac{1}{\\lim\\sqrt[n]{|a_n|}}$ easily gets the exponent wrong; the Ratio Test on the whole general term is safest.",
    "steps": [
      "Rewrite: $\\frac{8^n}{n}x^{3n}=\\frac{(2x)^{3n}}{n}$.",
      "Ratio of whole terms: $\\left|\\frac{(2x)^{3n+3}/(n+1)}{(2x)^{3n}/n}\\right|=\\frac{n}{n+1}|2x|^3\\to|2x|^3$.",
      "$|2x|^3<1\\iff|x|<\\frac{1}{2}$, so $R=\\frac{1}{2}$."
    ],
    "trap": "Treating $8^n$ as the coefficient of $x^n$, so $\\sqrt[n]{8}=8$ and $R=\\frac{1}{8}$; but the power of $x$ is $3n$, so it's the $3n$th root you need.",
    "check": "Converges at $x=0.4$, diverges at $x=0.6$: $(0.8)^3<1<(1.2)^3$."
  },
  "cl-ser-038": {
    "spot": "Centered at $4$ with $5^n$ in the denominator: the radius is $5$. There is an extra $(-1)^n$ in front, so plugging in the two endpoints gives an alternating harmonic series at one and the harmonic series at the other — be careful which is which.",
    "why": "The Ratio Test only gives the open interval; at the endpoints the ratio is $1$, so you must plug each back into the original series.",
    "steps": [
      "Ratio: $\\left|\\frac{a_{n+1}}{a_n}\\right|=\\frac{n}{n+1}\\cdot\\frac{|x-4|}{5}\\to\\frac{|x-4|}{5}$, so $R=5$ and the open interval is $(-1,9)$.",
      "$x=9$: $(x-4)^n=5^n$, the term becomes $\\frac{(-1)^n}{n}$ — the alternating harmonic series, which converges.",
      "$x=-1$: $(x-4)^n=(-5)^n$, which times the leading $(-1)^n$ gives $1$; the term is $\\frac{1}{n}$, the harmonic series, which diverges.",
      "So the interval of convergence is $(-1,9]$: left end excluded, right end included."
    ],
    "trap": "Missing the leading $(-1)^n$ and answering $[-1,9)$ from the memory that $\\sum\\frac{x^n}{n}$ is closed on the left and open on the right; here the $(-1)^n$ swaps the roles of the two ends.",
    "check": "The whole series is really $\\sum\\frac{u^n}{n}$ with $u=-\\frac{x-4}{5}$; the range $[-1,1)$ for $u$ corresponds to $x\\in(-1,9]$."
  },
  "cl-ser-042": {
    "spot": "The denominator $1-x-2x^2$ factors as $(1-2x)(1+x)$: two linear factors, so after partial fractions each piece is a geometric series.",
    "why": "Differentiating six times and dividing by $6!$ is exhausting; partial fractions give a formula for every coefficient, and you can cross-check with the recurrence.",
    "steps": [
      "Partial fractions: $\\frac{1}{(1-2x)(1+x)}=\\frac{2/3}{1-2x}+\\frac{1/3}{1+x}$.",
      "Expand as geometric series: $\\frac{1}{1-2x}=\\sum 2^nx^n$, $\\frac{1}{1+x}=\\sum(-1)^nx^n$, so $c_n=\\frac{2^{n+1}+(-1)^n}{3}$.",
      "Plug in $n=6$: $c_6=\\frac{128+1}{3}=43$."
    ],
    "trap": "Swapping the partial-fraction coefficients $\\frac{1}{3}$ and $\\frac{2}{3}$, which gives $c_6=\\frac{64+2}{3}=22$.",
    "check": "Recurrence $c_n=c_{n-1}+2c_{n-2}$ (from $(1-x-2x^2)\\sum c_nx^n=1$): $1,1,3,5,11,21,43$."
  },
  "cl-ser-045": {
    "spot": "$|\\sin x|$ is even and the interval is symmetric: $a_n$ can be rewritten as $\\frac{2}{\\pi}\\int_0^\\pi$, and on $[0,\\pi]$ the absolute value simply drops.",
    "why": "Use evenness to remove the absolute value first; then the product-to-sum identity turns $\\sin x\\cos 2x$ into two easy sines, no integration by parts needed.",
    "steps": [
      "Even function: $\\int_{-\\pi}^{\\pi}|\\sin x|\\cos 2x\\,dx=2\\int_0^{\\pi}\\sin x\\cos 2x\\,dx$.",
      "Product-to-sum: $\\sin x\\cos 2x=\\frac{\\sin 3x-\\sin x}{2}$.",
      "$\\int_0^\\pi\\sin 3x\\,dx=\\frac{2}{3}$, $\\int_0^\\pi\\sin x\\,dx=2$.",
      "$a_2=\\frac{2}{\\pi}\\cdot\\frac{1}{2}\\left(\\frac{2}{3}-2\\right)=-\\frac{4}{3\\pi}$."
    ],
    "trap": "Not removing the absolute value and computing $\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}\\sin x\\cos 2x\\,dx$ directly — an odd integrand, giving $0$.",
    "check": "General formula: for even $n$, $a_n=-\\frac{4}{\\pi(n^2-1)}$, and $n=2$ gives $-\\frac{4}{3\\pi}$."
  },
  "cl-ser-046": {
    "spot": "The integrand is $x\\sin 4x$: polynomial times trig, so integrate by parts to differentiate the $x$ away. And the interval is a whole period, so the $\\int\\cos 4x$ term is just $0$.",
    "why": "One integration by parts kills the $x$; the remaining integral vanishes over a full period, so only the boundary term needs computing.",
    "steps": [
      "Integration by parts: $u=x$, $dv=\\sin 4x\\,dx$, $v=-\\frac{\\cos 4x}{4}$.",
      "Boundary term: $\\left[-\\frac{x\\cos 4x}{4}\\right]_0^{2\\pi}=-\\frac{2\\pi}{4}=-\\frac{\\pi}{2}$.",
      "The remaining $\\frac{1}{4}\\int_0^{2\\pi}\\cos 4x\\,dx=0$ (full period).",
      "So $\\int_0^{2\\pi}x\\sin 4x\\,dx=-\\frac{\\pi}{2}$ and $b_4=\\frac{1}{\\pi}\\cdot\\left(-\\frac{\\pi}{2}\\right)=-\\frac{1}{2}$."
    ],
    "trap": "Forgetting the leading $\\frac{1}{\\pi}$ and answering with the integral $-\\frac{\\pi}{2}$; or dropping the minus sign in $v$ and getting $+\\frac{1}{2}$.",
    "check": "In general $b_n=-\\frac{2}{n}$: for $n=1$, $\\frac{1}{\\pi}\\int_0^{2\\pi}x\\sin x\\,dx=-2$."
  },
  "cl-ser-047": {
    "spot": "$e^x$ on $(-\\pi,\\pi)$ extended periodically has a seam at $x=\\pi$: from the left you get $e^{\\pi}$, from the right the start of the next period, $e^{-\\pi}$ — a jump.",
    "why": "No need to compute the Fourier series and sum it; Dirichlet's theorem says directly that at a jump the series converges to the average of the left and right limits.",
    "steps": [
      "Left limit: as $x\\to\\pi^-$, $f\\to e^{\\pi}$.",
      "Right limit: as $x\\to\\pi^+$ you enter the next period, $f(x)=e^{x-2\\pi}$, which tends to $e^{-\\pi}$.",
      "$f$ is piecewise smooth, so the Fourier series converges to the average: $\\frac{e^{\\pi}+e^{-\\pi}}{2}=\\cosh\\pi$."
    ],
    "trap": "Plugging in $f(\\pi)=e^{\\pi}\\approx 23.14$ directly; after the periodic extension $\\pi$ is a jump, and the series only converges to the average of the two sides.",
    "check": "From the coefficients: $a_n=\\frac{(-1)^n2\\sinh\\pi}{\\pi(1+n^2)}$, so at $x=\\pi$ the series is $\\frac{\\sinh\\pi}{\\pi}+\\sum_{n\\ge1}\\frac{2\\sinh\\pi}{\\pi(1+n^2)}$, which adds up to exactly $\\cosh\\pi$."
  },
  "cx-pf-003": {
    "spot": "A rational function whose denominator is already a product of two distinct linear factors $(x+1)(x+2)$, with numerator of lower degree: go straight to partial fractions, and each piece integrates to a logarithm.",
    "why": "Even after substituting $u=x+1$ you would still have to split; splitting into $\\frac{A}{x+1}+\\frac{B}{x+2}$ right away, the cover-up method finds the coefficients in two seconds.",
    "steps": [
      "Cover-up: $A=\\frac{-1}{-1+2}=-1$, $B=\\frac{-2}{-2+1}=2$, so $\\frac{x}{(x+1)(x+2)}=-\\frac{1}{x+1}+\\frac{2}{x+2}$.",
      "Antiderivative: $-\\ln(x+1)+2\\ln(x+2)$.",
      "Apply the limits: $(-\\ln 2+2\\ln 3)-(0+2\\ln 2)=2\\ln 3-3\\ln 2$.",
      "Combine: $2\\ln 3-3\\ln 2=\\ln\\frac{9}{8}$."
    ],
    "trap": "At the lower limit $x=0$, forgetting that $2\\ln 2$ is not $0$, which gives $2\\ln 3-\\ln 2=\\ln\\frac{9}{2}$.",
    "check": "On $[0,1]$ the integrand lies between $0$ and $\\frac{1}{6}$, so the integral should be less than $\\frac{1}{6}$; $\\ln\\frac{9}{8}\\approx 0.118$ is reasonable."
  },
  "db-itrig-003": {
    "spot": "The first term is $x\\arctan x$ (a product); the second is $\\frac{1}{2}\\ln(1+x^2)$, whose derivative $\\frac{x}{1+x^2}$ is exactly the extra term the Product Rule spits out — designed to cancel.",
    "why": "Differentiate each piece, simplify, subtract. This is exactly the integration-by-parts result for $\\int\\arctan x\\,dx$; if you recognize it you can write the answer immediately.",
    "steps": [
      "Product Rule: $(x\\arctan x)'=\\arctan x+\\frac{x}{1+x^2}$.",
      "Chain Rule: $\\left(\\frac{1}{2}\\ln(1+x^2)\\right)'=\\frac{1}{2}\\cdot\\frac{2x}{1+x^2}=\\frac{x}{1+x^2}$.",
      "Subtract: $\\frac{x}{1+x^2}$ cancels, leaving only $\\arctan x$."
    ],
    "trap": "Doing only half the Product Rule, writing $(x\\arctan x)'$ as $\\frac{x}{1+x^2}$, and ending up with $0$.",
    "check": "Going backwards: $\\int_0^1\\arctan x\\,dx$ should equal the difference of the original expression at $1$ and $0$, namely $\\frac{\\pi}{4}-\\frac{1}{2}\\ln 2$."
  },
  "db-itrig-007": {
    "spot": "Outer $\\arctan$, inner $\\tanh x$: the Chain Rule gives $\\frac{\\operatorname{sech}^2x}{1+\\tanh^2x}$, and multiplying top and bottom by $\\cosh^2x$ turns it into a hyperbolic double-angle formula.",
    "why": "The straight Chain Rule is shortest; the only key is recognizing $\\cosh^2x+\\sinh^2x=\\cosh 2x$ in the final simplification.",
    "steps": [
      "Chain Rule: $\\frac{d}{dx}\\arctan(\\tanh x)=\\frac{1}{1+\\tanh^2x}\\cdot\\operatorname{sech}^2x$.",
      "Multiply top and bottom by $\\cosh^2x$: $\\frac{1}{\\cosh^2x+\\sinh^2x}$.",
      "Double angle: $\\cosh^2x+\\sinh^2x=\\cosh 2x$, so the derivative is $\\frac{1}{\\cosh 2x}$."
    ],
    "trap": "Mixing up the hyperbolic double-angle formula with the trig one and writing $\\cosh^2x-\\sinh^2x$, which is $1$ — leading to a wrong derivative like $\\operatorname{sech}^2x\\cdot\\cosh^2x=1$.",
    "check": "At $x=0$: $\\tanh x\\approx x$, so $\\arctan(\\tanh x)\\approx x$ and the slope should be $1$; indeed $\\frac{1}{\\cosh 0}=1$."
  },
  "db-logd-001": {
    "spot": "Both the base $x$ and the exponent $\\arctan x$ vary: neither the power rule (fixed exponent) nor the exponential rule (fixed base) applies, so take logs to bring the exponent down.",
    "why": "Logarithmic differentiation turns $x^{\\arctan x}$ into the product $\\arctan x\\cdot\\ln x$, leaving a single Product Rule.",
    "steps": [
      "Let $y=x^{\\arctan x}$ and take logs: $\\ln y=\\arctan x\\cdot\\ln x$.",
      "Differentiate both sides in $x$: $\\frac{y'}{y}=\\frac{\\ln x}{1+x^2}+\\frac{\\arctan x}{x}$.",
      "Multiply back by $y$: $y'=x^{\\arctan x}\\left(\\frac{\\ln x}{1+x^2}+\\frac{\\arctan x}{x}\\right)$."
    ],
    "trap": "Applying the power rule to get $\\arctan x\\cdot x^{\\arctan x-1}$: that is only the second term of the answer, missing the $\\frac{\\ln x}{1+x^2}$ that comes from the exponent itself changing.",
    "check": "At $x=1$: $\\ln 1=0$, so the derivative is just $1\\cdot\\frac{\\pi/4}{1}=\\frac{\\pi}{4}$."
  },
  "dd-grw-001": {
    "spot": "Newton's law of cooling: $T=20+80e^{-0.05t}$, and the rate of temperature change is $T'(t)$; the constant $20$ differentiates away and the Chain Rule on the exponential brings out $-0.05$.",
    "why": "A rate is a derivative: differentiate and plug in. No need to solve a differential equation — the formula is already given.",
    "steps": [
      "Differentiate: $T'(t)=80\\cdot(-0.05)e^{-0.05t}=-4e^{-0.05t}$.",
      "Plug in $t=10$: $T'(10)=-4e^{-0.5}\\approx -2.43$ (dropping about $2.43^{\\circ}\\mathrm{C}$ per minute).",
      "The minus sign means the temperature is falling; the answer is the rate of change $-4e^{-0.5}$."
    ],
    "trap": "Forgetting the Chain Rule's $-0.05$ and writing $T'=80e^{-0.05t}$, which gives $80e^{-0.5}\\approx 48.5$; or leaving the $20$ in the derivative.",
    "check": "In Newton cooling the rate is proportional to the temperature difference: $T'=-0.05(T-20)$. At $t=10$ the difference is $80e^{-0.5}$, and times $-0.05$ that is exactly $-4e^{-0.5}$."
  },
  "dd-imp-001": {
    "spot": "$x^2+4y^2=25$ is an ellipse and $y$ isn't solved for: differentiate both sides in $x$; the $4y^2$ term gives $8yy'$.",
    "why": "Implicit differentiation avoids solving for $y=\\frac{\\sqrt{25-x^2}}{2}$ and choosing a sign; plugging in the point is more direct.",
    "steps": [
      "First confirm the point is on the curve: $9+4\\cdot 4=25$.",
      "Differentiate in $x$: $2x+8yy'=0$, so $y'=-\\frac{x}{4y}$.",
      "Plug in $(3,2)$: $y'=-\\frac{3}{8}$."
    ],
    "trap": "Dropping the coefficient $4$ of $4y^2$ and using the circle formula $y'=-\\frac{x}{y}=-\\frac{3}{2}$.",
    "check": "Solving for the upper half $y=\\frac{\\sqrt{25-x^2}}{2}$ and differentiating at $x=3$ also gives $-\\frac{3}{8}$."
  },
  "der-009": {
    "spot": "Both the base and the exponent are $x$: the power rule needs a fixed exponent and the exponential rule a fixed base, so neither applies — rewrite as $e^{x\\ln x}$.",
    "why": "Written as a power of $e$, it's just one Chain Rule plus one Product Rule; logarithmic differentiation is the same thing.",
    "steps": [
      "Rewrite: $x^x=e^{x\\ln x}$.",
      "Inner function $u=x\\ln x$, $u'=\\ln x+1$.",
      "Chain Rule: $(x^x)'=e^{x\\ln x}(\\ln x+1)=x^x(\\ln x+1)$."
    ],
    "trap": "The power rule gives $x\\cdot x^{x-1}=x^x$, the exponential rule gives $x^x\\ln x$ — each is only half right, and the correct answer is exactly their sum.",
    "check": "At $x=1$: the slope of $x^x$ is $1\\cdot(0+1)=1$; and $x=\\frac{1}{e}$ is the minimum of $x^x$, where the derivative is $0$."
  },
  "der-016": {
    "spot": "A fraction with denominator $1+\\cos x$: after the Quotient Rule the numerator contains $\\cos^2x+\\sin^2x$, which combines to $1$, and then one factor of $1+\\cos x$ cancels with the denominator.",
    "why": "The Quotient Rule is most direct; rewriting as $\\tan\\frac{x}{2}$ with half-angle formulas also works, but needs the formula memorized — better used as a check.",
    "steps": [
      "Quotient Rule: $f=\\sin x$, $g=1+\\cos x$, $\\left(\\frac{f}{g}\\right)'=\\frac{f'g-fg'}{g^2}$.",
      "Numerator: $\\cos x(1+\\cos x)+\\sin^2x=\\cos x+1$.",
      "Divide by $(1+\\cos x)^2$ and cancel one factor: $\\frac{1}{1+\\cos x}$."
    ],
    "trap": "The minus sign in $g'=-\\sin x$ stacks with the minus in the Quotient Rule; getting it wrong gives $\\cos x+\\cos^2x-\\sin^2x$, which no longer combines to $1$.",
    "check": "Half-angle: $\\frac{\\sin x}{1+\\cos x}=\\tan\\frac{x}{2}$, whose derivative is $\\frac{1}{2}\\sec^2\\frac{x}{2}=\\frac{1}{2\\cos^2(x/2)}=\\frac{1}{1+\\cos x}$."
  },
  "der-030": {
    "spot": "In $x^2+xy+y^2=7$, $y$ can't be solved for cleanly (it's a quadratic), and there is a cross term $xy$: use implicit differentiation, with the Product Rule on $xy$.",
    "why": "Solving for $y$ brings in square roots and a sign choice; implicit differentiation gives one formula valid on both branches.",
    "steps": [
      "Differentiate both sides in $x$, treating $y$ as a function of $x$: $2x+(y+xy')+2yy'=0$. The partial derivative in $x$ is $2x+y$, and in $y$ it is $x+2y$.",
      "Collect $y'$: $y'(x+2y)=-(2x+y)$.",
      "$y'=-\\frac{2x+y}{x+2y}$."
    ],
    "trap": "Differentiating $xy$ as just $y'$ or just $y$, missing half of the Product Rule; e.g. writing $2x+y+2yy'=0$, which gives $y'=-\\frac{2x+y}{2y}$.",
    "check": "The point $(1,2)$ is on the curve; differentiating the upper branch $y=\\frac{-x+\\sqrt{28-3x^2}}{2}$ directly gives slope $-\\frac{4}{5}$, matching the formula."
  },
  "exam-ser-018": {
    "spot": "A single coefficient of $(1+x)^n$: Binomial Theorem — the coefficient of $x^3$ is the number of ways to choose $3$ of the $7$ brackets to contribute an $x$.",
    "why": "Expanding the seventh power or differentiating three times is too slow; the binomial coefficient $\\binom{7}{3}$ is one line.",
    "steps": [
      "Binomial Theorem: $(1+x)^7=\\sum_{k=0}^{7}\\binom{7}{k}x^k$.",
      "$\\binom{7}{3}=\\frac{7\\cdot 6\\cdot 5}{3\\cdot 2\\cdot 1}=35$.",
      "So the coefficient of $x^3$ is $35$."
    ],
    "trap": "Counting permutations $7\\cdot 6\\cdot 5=210$ and forgetting to divide by $3!$.",
    "check": "The coefficients sum to $2^7=128$; by symmetry $\\binom{7}{3}=\\binom{7}{4}$."
  },
  "fd-serx-301": {
    "spot": "$\\frac{n^2}{5^n}=n^2x^n$ at $x=\\frac{1}{5}$: polynomial times geometric. Starting from $\\sum x^n$, \"multiply by $x$ then differentiate\" twice produces the $n^2$.",
    "why": "Term-by-term differentiation of the power series is cleaner than shifting-and-subtracting twice, and the formula can be reused.",
    "steps": [
      "$\\sum_{n\\ge1}nx^n=x\\frac{d}{dx}\\frac{1}{1-x}=\\frac{x}{(1-x)^2}$.",
      "Once more: $\\sum n^2x^n=x\\frac{d}{dx}\\frac{x}{(1-x)^2}=\\frac{x(1+x)}{(1-x)^3}$.",
      "Plug in $x=\\frac{1}{5}$: $\\frac{\\frac{1}{5}\\cdot\\frac{6}{5}}{(\\frac{4}{5})^3}=\\frac{6}{25}\\cdot\\frac{125}{64}=\\frac{15}{32}$."
    ],
    "trap": "Stopping after one differentiation and plugging $\\frac{1}{5}$ into $\\frac{x}{(1-x)^2}$ to get $\\frac{5}{16}$ — that's $\\sum\\frac{n}{5^n}$.",
    "check": "The first two terms give $\\frac{1}{5}+\\frac{4}{25}=0.36$; adding $\\frac{9}{125}=0.072$ already gives $0.432$, not far from $\\frac{15}{32}\\approx 0.469$."
  },
  "fd-serx-302": {
    "spot": "The denominator $n^2-1=(n-1)(n+1)$ has factors differing by $2$: partial fractions give a difference two steps apart, and after telescoping only the first two and last two terms survive.",
    "why": "Splitting into a difference two steps apart gives a closed form for the partial sums, and the limit is immediate; the Comparison Test would only show convergence, not the sum.",
    "steps": [
      "Partial fractions: $\\frac{1}{n^2-1}=\\frac{1}{2}\\left(\\frac{1}{n-1}-\\frac{1}{n+1}\\right)$.",
      "Partial sum up to $N$: the positive terms $1,\\frac{1}{2},\\dots$ cancel against negative terms two places later, leaving $\\frac{1}{2}\\left(1+\\frac{1}{2}-\\frac{1}{N}-\\frac{1}{N+1}\\right)$. For example $N=4$.",
      "$N\\to\\infty$: $\\frac{1}{2}\\cdot\\frac{3}{2}=\\frac{3}{4}$."
    ],
    "trap": "Assuming, as with $\\frac{1}{n}-\\frac{1}{n+1}$, that only the first term survives and answering $\\frac{1}{2}\\cdot 1=\\frac{1}{2}$; a gap of two leaves two terms, $1$ and $\\frac{1}{2}$.",
    "check": "The first term alone is $\\frac{1}{3}$ and all later terms are positive, so the sum must exceed $\\frac{1}{3}+\\frac{1}{8}$."
  },
  "ig-num-001": {
    "spot": "$n=4$ subintervals of $[0,1]$, $h=\\frac{1}{4}$: the trapezoidal rule weights the two endpoints by $\\frac{1}{2}$ and interior points by $1$, then multiplies by $h$.",
    "why": "Just list the five function values and apply the formula; tabulating first and then adding is less error-prone than computing each trapezoid separately.",
    "steps": [
      "$h=\\frac{1}{4}$, function values $f(0)=0$, $f(\\frac{1}{4})=\\frac{1}{16}$, $f(\\frac{1}{2})=\\frac{1}{4}$, $f(\\frac{3}{4})=\\frac{9}{16}$, $f(1)=1$.",
      "$T=h\\left[\\frac{f(0)}{2}+f(\\tfrac14)+f(\\tfrac12)+f(\\tfrac34)+\\frac{f(1)}{2}\\right]=\\frac{1}{4}\\left[0+\\frac{1}{16}+\\frac{4}{16}+\\frac{9}{16}+\\frac{8}{16}\\right]$.",
      "$T=\\frac{11}{32}=0.34375$."
    ],
    "trap": "Forgetting to divide the endpoints by $2$: $\\frac{1}{4}\\left(0+\\frac{1}{16}+\\frac{1}{4}+\\frac{9}{16}+1\\right)=\\frac{15}{32}$.",
    "check": "The true value is $\\frac{1}{3}$; $x^2$ is concave up, so the chords lie above the curve and the trapezoidal rule should overestimate: $\\frac{11}{32}>\\frac{1}{3}$."
  },
  "ig-num-007": {
    "spot": "$n=2$ subintervals of $[0,2]$, $h=1$: only three points $x=0,1,2$, endpoints weighted $\\frac{1}{2}$ and the middle weighted $1$.",
    "why": "Plug straight into the trapezoidal rule; with only three points, the main risk is getting the endpoint weights wrong.",
    "steps": [
      "$h=1$, $f(0)=0$, $f(1)=1$, $f(2)=8$.",
      "$T=1\\cdot\\left[\\frac{0}{2}+1+\\frac{8}{2}\\right]=5$.",
      "Compare with the true value $\\int_0^2x^3\\,dx=4$: an overestimate by $1$."
    ],
    "trap": "Taking $h$ as $\\frac{1}{2}$ (thinking \"$2$ subintervals\" means width $\\frac{1}{2}$) and getting $\\frac{5}{2}$; the width is $\\frac{2-0}{2}=1$.",
    "check": "$x^3$ is concave up on $[0,2]$ ($f''=6x\\ge0$), so the trapezoid chords lie above the curve and the estimate must exceed the true value."
  },
  "lec-04-q3c": {
    "spot": "$f'(x)=\\frac{x(x-2)}{(x-1)^2}$: the denominator is a square and always positive, so the sign depends only on the numerator $x(x-2)$ — but $x=1$ is not in the domain, so the interval must be cut there.",
    "why": "A sign chart for the first derivative is most direct; just remember that points where the denominator is zero are also break points on the chart.",
    "steps": [
      "Quotient Rule: $f'(x)=\\frac{2x(x-1)-x^2}{(x-1)^2}=\\frac{x(x-2)}{(x-1)^2}$.",
      "Break points: $f'=0$ at $x=0,2$; $f$ is undefined at $x=1$.",
      "Signs: $(-\\infty,0)$ positive, $(0,1)$ negative, $(1,2)$ negative, $(2,\\infty)$ positive.",
      "The intervals of decrease are $(0,1)\\cup(1,2)$ — the two pieces must be written separately."
    ],
    "trap": "Writing $(0,2)$. $f$ is undefined at $x=1$ and jumps from $-\\infty$ to $+\\infty$ across it: $f(0.5)=-0.5$, $f(1.5)=4.5$, so it is not decreasing on $(0,2)$ at all.",
    "check": "Endpoint values: $f(0)=0$ is a local max and $f(2)=4$ is a local min, consistent with \"going down between $0$ and $2$\" (with the asymptote cutting it in the middle)."
  },
  "lec-04-q4b": {
    "spot": "$f'(x)=(x+2)(x-1)^2$ has a squared factor at $x=1$: $f'(1)=0$ but $(x-1)^2$ doesn't change sign, so $f'$ has the same sign on both sides.",
    "why": "Extrema depend on whether $f'$ changes sign, not on whether $f'$ is zero; the second-derivative test is inconclusive here since $f''(1)=0$.",
    "steps": [
      "$f'(1)=3\\cdot 0=0$, so $x=1$ is a critical point.",
      "Both sides: $x+2>0$ and $(x-1)^2>0$, so $f'$ is positive on both sides of $x=1$.",
      "$f'$ doesn't change sign, $f$ keeps increasing, and $x=1$ is just a horizontal-tangent point: not a local extremum."
    ],
    "trap": "Seeing $f'(1)=0$ and declaring an extremum; or using the second-derivative test, getting $f''(1)=0$, and insisting it's a minimum anyway.",
    "check": "Contrast: $x=-2$ is the real extremum, where $f'$ goes from negative to positive (local min)."
  },
  "lec-04-q4c": {
    "spot": "You are given $f'$ and asked for the inflection points of $f$: inflection points are where $f''$ changes sign, i.e. the extrema of $f'$. $f'$ is a cubic polynomial, so differentiate once more.",
    "why": "Computing $f''$ directly and checking its sign is most reliable; don't confuse these with the points where $f'=0$ (extremum candidates).",
    "steps": [
      "$f''(x)=(x-1)^2+2(x+2)(x-1)=(x-1)(3x+3)=3(x-1)(x+1)$.",
      "$f''=0$ at $x=\\pm1$. Signs: positive for $x<-1$, negative for $-1<x<1$, positive for $x>1$.",
      "Both points change the concavity, so the $x$-coordinates of the inflection points are $\\{-1,1\\}$."
    ],
    "trap": "Thinking that since $x=1$ is not an extremum it can't be an inflection point either, and answering only $\\{-1\\}$; or also including $x=-2$, where $f'=0$.",
    "check": "$x=1$ is both a horizontal tangent and an inflection point (like $x^3$ at the origin) — this is common."
  },
  "lec-05-q3b": {
    "spot": "The squared distance $D(x)=x^2+(x^2-3)^2$ is an even quartic in $x$: $D'$ must have a factor $x$, and what remains is linear in $x^2$, giving a $\\pm$ pair of roots.",
    "why": "Using the squared distance instead of the distance avoids the square root, and the critical points are exactly the same.",
    "steps": [
      "$D(x)=(x-0)^2+(x^2-3)^2$; differentiate: $D'(x)=2x+4x(x^2-3)=2x(2x^2-5)$.",
      "$D'=0$: $x=0$ or $x^2=\\frac{5}{2}$, i.e. $x=\\pm\\sqrt{5/2}$.",
      "So the critical points are $\\left\\{0,\\sqrt{5/2},-\\sqrt{5/2}\\right\\}$."
    ],
    "trap": "Writing only the positive root $\\sqrt{5/2}$ and forgetting the negative one; or deleting $x=0$ because it's a maximum rather than a minimum — critical points include both.",
    "check": "$D''=12x^2-10$: at $\\pm\\sqrt{5/2}$ it is $20>0$ (closest points), at $0$ it is $-10<0$ (locally farthest)."
  },
  "lec-12-q3d": {
    "spot": "$\\frac{\\ln n}{n^3}$: $\\ln n$ grows slower than any power, and with $n^3$ in the denominator one spare factor of $n$ is enough to absorb $\\ln n$ — compare with $\\frac{1}{n^2}$.",
    "why": "The Comparison Test is fastest; the Integral Test also works but needs integration by parts on $\\frac{\\ln x}{x^3}$.",
    "steps": [
      "$\\ln n<n$, so $0\\le\\frac{\\ln n}{n^3}<\\frac{n}{n^3}=\\frac{1}{n^2}$.",
      "$\\sum\\frac{1}{n^2}$ is a p-series with $p=2$ and converges (its sum is $\\frac{\\pi^2}{6}$).",
      "By the Comparison Test, the original series converges."
    ],
    "trap": "Comparing with $\\frac{1}{n^3}$ by writing $\\frac{\\ln n}{n^3}<\\frac{1}{n^3}$ — the inequality goes the wrong way (for $n\\ge3$, $\\ln n>1$), so this comparison proves nothing.",
    "check": "The sum is actually small, about $0.198$: larger than $\\frac{\\ln 2}{8}+\\frac{\\ln 3}{27}$ and much smaller than $\\frac{\\pi^2}{6}$."
  },
  "lec-13-q2c": {
    "spot": "The whole general term is \"something to the $n$th power\", $\\left(\\frac{n}{2n+1}\\right)^n$: taking the $n$th root leaves just what's in the brackets.",
    "why": "The Root Test removes the power directly; the Ratio Test would have to handle $\\frac{(n+1)^{n+1}(2n+1)^n}{n^n(2n+3)^{n+1}}$, much messier.",
    "steps": [
      "$\\sqrt[n]{a_n}=\\frac{n}{2n+1}$.",
      "$\\frac{n}{2n+1}\\to\\frac{1}{2}$.",
      "$\\frac{1}{2}<1$, so by the Root Test the series converges."
    ],
    "trap": "Seeing $\\frac{n}{2n+1}\\to\\frac{1}{2}\\neq0$ and using the $n$th-term test to claim divergence; but the general term is its $n$th power, which tends to $0$ like $\\left(\\frac{1}{2}\\right)^n$.",
    "check": "Every term is less than $\\left(\\frac{1}{2}\\right)^n$ (since $\\frac{n}{2n+1}<\\frac{1}{2}$), so the sum is less than the geometric series $\\sum\\left(\\frac{1}{2}\\right)^n=1$."
  },
  "lec-14-m5": {
    "spot": "$\\sum\\frac{x^n}{n}$: the coefficient $\\frac{1}{n}$ doesn't affect the radius, $R=1$; plugging in the two endpoints gives the harmonic series and the alternating harmonic series, with different results.",
    "why": "The Ratio Test gives the radius, but at $x=\\pm1$ the ratio tends to $1$ and is inconclusive, so each endpoint must be plugged back in and checked separately.",
    "steps": [
      "Ratio: $\\left|\\frac{x^{n+1}/(n+1)}{x^n/n}\\right|=\\frac{n}{n+1}|x|\\to|x|$, so $R=1$.",
      "$x=1$: $\\sum\\frac{1}{n}$, the harmonic series, diverges (its partial sums grow even faster than $\\ln$).",
      "$x=-1$: $\\sum\\frac{(-1)^n}{n}$ converges by the Alternating Series Test (its sum is $-\\ln 2$).",
      "The interval of convergence is $[-1,1)$."
    ],
    "trap": "Assuming both endpoints behave the same: calling both divergent gives $(-1,1)$, calling both convergent gives $[-1,1]$.",
    "check": "$\\sum\\frac{x^n}{n}=-\\ln(1-x)$: finite at $x=-1$ with value $-\\ln 2$, blowing up as $x\\to1$ — consistent with $[-1,1)$."
  },
  "lec-14-q1a": {
    "spot": "Centered at $2$ with $n\\cdot3^n$ in the denominator: $R=3$, interval $(-1,5)$; at both endpoints the $3^n$ cancels exactly, leaving $\\frac{1}{n}$ or $\\frac{(-1)^n}{n}$.",
    "why": "The Ratio Test fixes the radius; at the endpoints the ratio is $1$ and inconclusive, so plug them back in and use the harmonic series and the Alternating Series Test.",
    "steps": [
      "Ratio: $\\frac{n}{n+1}\\cdot\\frac{|x-2|}{3}\\to\\frac{|x-2|}{3}<1$, so $R=3$ and the open interval is $(-1,5)$.",
      "$x=5$: the term is $\\frac{3^n}{n\\cdot3^n}=\\frac{1}{n}$, the harmonic series, which diverges.",
      "$x=-1$: the term is $\\frac{(-3)^n}{n\\cdot3^n}=\\frac{(-1)^n}{n}$, an alternating series that converges.",
      "The interval of convergence is $[-1,5)$."
    ],
    "trap": "Taking the center as $0$ and answering $[-3,3)$; or checking only one endpoint and stopping.",
    "check": "The interval should have midpoint $2$ (the center) and half-width $3$: $\\frac{-1+5}{2}=2$, $\\frac{5-(-1)}{2}=3$."
  },
  "lec-14-q1b": {
    "spot": "The $n$ in the coefficient $\\frac{n}{4^n}$ doesn't affect the radius: $R=4$, center $-1$. At the endpoints the $4^n$ cancels, leaving $n$ or $(-1)^nn$ — the terms themselves don't tend to $0$.",
    "why": "For endpoints, try the $n$th-term test first: if the terms don't tend to zero, the series diverges and no other test is needed.",
    "steps": [
      "Ratio: $\\frac{n+1}{n}\\cdot\\frac{|x+1|}{4}\\to\\frac{|x+1|}{4}<1$, so $R=4$ and the open interval is $(-5,3)$.",
      "$x=3$: $(x+1)^n=4^n$, the term is $n$, which doesn't tend to $0$ — diverges.",
      "$x=-5$: $(x+1)^n=(-4)^n$, the term is $(-1)^nn$, whose absolute value $n$ also doesn't tend to $0$ — diverges.",
      "Neither end is included: the interval of convergence is $(-5,3)$."
    ],
    "trap": "Seeing that $x=-5$ gives an alternating series and claiming convergence by the Alternating Series Test; that test requires the terms to tend to $0$, but here $|a_n|=n$ keeps growing.",
    "check": "Inside the interval $\\sum nu^n=\\frac{u}{(1-u)^2}$ (with $u=\\frac{x+1}{4}$), which blows up as $u\\to1$, consistent with divergence at the right end; e.g. at $x=1$ ($u=\\frac{1}{2}$) the sum is $2$."
  },
  "lec-14-q1c": {
    "spot": "Only even powers $x^{2n}$, and the denominator has $9^n=3^{2n}$: the whole term is really $\\frac{(x/3)^{2n}}{n^2}$, and the $\\frac{1}{n^2}$ guarantees convergence at both endpoints.",
    "why": "For a series with gaps you can't apply the coefficient formula directly; the Ratio Test on the whole general term is safest. At the endpoints the $\\frac{1}{n^2}$ gives absolute convergence in one go.",
    "steps": [
      "Ratio of whole terms: $\\frac{n^2}{(n+1)^2}\\cdot\\frac{x^2}{9}\\to\\frac{x^2}{9}<1\\iff|x|<3$, so $R=3$.",
      "$x=\\pm3$: $x^{2n}=9^n$, the term is $\\frac{1}{n^2}$ (even power, so the sign is the same at both ends).",
      "$\\sum\\frac{1}{n^2}$ converges, so both ends are included: interval of convergence $[-3,3]$."
    ],
    "trap": "Treating $\\frac{1}{n^2 9^n}$ as the coefficient of $x^n$ and getting $R=9$; but the power here is $2n$, and it's $x^2$ that must be \"$<9$\".",
    "check": "At $x=3.1$ the term is $\\frac{(3.1/3)^{2n}}{n^2}$, which grows without bound — indeed outside the radius."
  },
  "lec-15-q2b": {
    "spot": "The numerator is $x$ minus $\\arctan x$ — exactly the first term of the Taylor series of $\\arctan x$ — and the denominator is $x^3$. Subtracting one term means you expand to the next one, $-\\frac{x^3}{3}$.",
    "why": "L'Hôpital's Rule would need three derivatives, and higher derivatives of $\\arctan$ get messier and messier; the expansion shows the $x^3$ coefficient in one line.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "$\\arctan x=x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\cdots$.",
      "$x-\\arctan x=\\frac{x^3}{3}-\\frac{x^5}{5}+\\cdots$; divided by $x^3$ it tends to $\\frac{1}{3}$."
    ],
    "trap": "Misremembering the expansion of $\\arctan x$ as $x+\\frac{x^3}{3}$ (confusing it with $\\tan x$), which gives $-\\frac{1}{3}$.",
    "check": "At $x=0.1$: the ratio is about $0.3313$, a bit below $\\frac{1}{3}$ (the next term $-\\frac{x^2}{5}$ is negative)."
  },
  "lec-15-q3c": {
    "spot": "$(-1)^n$, odd powers $2n+1$, denominator $(2n+1)!$: together these three features are the Maclaurin series of $\\sin x$; $\\frac{\\pi^{2n+1}}{6^{2n+1}}$ tells you $x=\\frac{\\pi}{6}$.",
    "why": "Recognizing a known series and plugging in is much faster than adding term by term, and it gives the exact value.",
    "steps": [
      "Combine: $\\frac{\\pi^{2n+1}}{6^{2n+1}}=\\left(\\frac{\\pi}{6}\\right)^{2n+1}$.",
      "$\\sin x=\\sum_{n\\ge0}\\frac{(-1)^nx^{2n+1}}{(2n+1)!}$, here with $x=\\frac{\\pi}{6}$.",
      "Sum $=\\sin\\frac{\\pi}{6}=\\frac{1}{2}$."
    ],
    "trap": "Seeing odd powers and factorials and thinking $\\sinh$, or forgetting the $(-1)^n$; or taking $x$ to be $\\pi$ and answering $\\sin\\pi=0$.",
    "check": "Alternating series: the first three terms give $\\approx 0.500002$, already very close to $\\frac{1}{2}$, with error less than the next term $\\frac{(\\pi/6)^7}{5040}$."
  },
  "lim-014": {
    "spot": "The numerator is $\\ln(1+x)-\\sin x$: both have linear term $x$, which cancels; the denominator is $x^2$, so expand to second order and see who has an $x^2$ term.",
    "why": "Expanding both functions lets you compare like powers directly; L'Hôpital's Rule twice also works, but you'd need the second derivatives of $\\ln(1+x)$ and $\\sin x$ at zero.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "Expand: $\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$, $\\sin x=x-\\frac{x^3}{6}+\\cdots$ (no quadratic term).",
      "Subtract: the linear terms cancel, leaving $-\\frac{x^2}{2}+O(x^3)$; divided by $x^2$ this tends to $-\\frac{1}{2}$."
    ],
    "trap": "Expanding only to first order — both sides are $x$ — and concluding the numerator is $0$, answer $0$; or thinking $\\sin x$ also has a $-\\frac{x^2}{2}$ (confusing it with $\\cos x$), so the two cancel to $0$.",
    "check": "At $x=0.01$: the ratio is about $-0.495$, slightly above $-\\frac{1}{2}$ (the next term $+\\frac{x}{2}$ is positive)."
  },
  "lm-rs-001": {
    "spot": "Numerator $n$, denominator $n^2+4k^2$: dividing top and bottom by $n^2$ produces $\\frac{1}{n}$ and $\\frac{k}{n}$ — the look of a Riemann sum, with $\\frac{k}{n}$ running from $0$ to $1$.",
    "why": "The sum has no closed form, but as $n\\to\\infty$ a Riemann sum becomes a definite integral, and the integral of $\\frac{1}{1+4x^2}$ is an arctangent.",
    "steps": [
      "Factor out $\\frac{1}{n}$: $\\frac{n}{n^2+4k^2}=\\frac{1}{n}\\cdot\\frac{1}{1+4(k/n)^2}$.",
      "$\\frac{k}{n}$ runs over the partition points of $(0,1]$, so the sum tends to $\\int_0^1\\frac{dx}{1+4x^2}$.",
      "$\\int_0^1\\frac{dx}{1+4x^2}=\\frac{1}{2}\\arctan 2x\\Big|_0^1=\\frac{1}{2}\\arctan 2$."
    ],
    "trap": "Writing the antiderivative as $\\arctan 2x$, forgetting the Chain Rule's $\\frac{1}{2}$, and answering $\\arctan 2$; or taking the upper limit to be $2$.",
    "check": "$\\frac{1}{1+4x^2}$ is decreasing, so the right-endpoint sum underestimates: the $n=4$ sum is about $0.452$, less than $\\frac{1}{2}\\arctan 2\\approx 0.554$."
  },
  "lm-rs-003": {
    "spot": "A sum of $n$ terms, each $\\frac{1}{2n+k}$: dividing by $n$ gives $\\frac{1}{n}\\cdot\\frac{1}{2+k/n}$, a Riemann sum; the constant $2$ stays in the denominator, so the integral is $\\int_0^1\\frac{dx}{2+x}$.",
    "why": "Harmonic numbers $H_{3n}-H_{2n}$ also work but need the asymptotic $H_n\\approx\\ln n$; the Riemann sum gives the integral directly.",
    "steps": [
      "$\\frac{1}{2n+k}=\\frac{1}{n}\\cdot\\frac{1}{2+k/n}$.",
      "The sum tends to $\\int_0^1\\frac{dx}{2+x}=\\ln(2+x)\\Big|_0^1=\\ln 3-\\ln 2$.",
      "Limit $=\\ln\\frac{3}{2}$."
    ],
    "trap": "Confusing this with $\\sum\\frac{1}{n+k}\\to\\ln 2$ and answering $\\ln 2$; the $2$ in the denominator makes the $\\ln$ run from $2$ to $3$.",
    "check": "Each term lies between $\\frac{1}{3n}$ and $\\frac{1}{2n}$, so the $n$ terms add up to something between $\\frac{1}{3}$ and $\\frac{1}{2}$; $\\ln 1.5\\approx 0.405$."
  },
  "mob-tech-001": {
    "spot": "$\\sqrt{x^2+3x}-x$: a square root minus something of the same order, which is $\\infty-\\infty$ as $x\\to\\infty$. A difference involving a square root is the signal to multiply by the conjugate.",
    "why": "Multiplying by $\\sqrt{x^2+3x}+x$ turns the difference into a fraction, and the $x^2$ in the numerator cancels, leaving $3x$; plugging in large numbers directly hits cancellation and hides the limit.",
    "steps": [
      "$\\infty-\\infty$ form: each term tends to infinity on its own; e.g. at $x=1000$ both exceed $1000$.",
      "Multiply by the conjugate: $\\sqrt{x^2+3x}-x=\\frac{(x^2+3x)-x^2}{\\sqrt{x^2+3x}+x}=\\frac{3x}{\\sqrt{x^2+3x}+x}$.",
      "The denominator is about $2x$, so the limit is $\\frac{3}{2}$.",
      "So the technique to use is rationalizing (multiplying by the conjugate)."
    ],
    "trap": "Treating $\\sqrt{x^2+3x}$ as just $x$ and getting $x-x=0$; that throws away the correction term $\\frac{3}{2}$, which is the same order as the answer.",
    "check": "At $x=100$: $\\frac{300}{\\sqrt{10300}+100}\\approx 1.489$, close to $1.5$."
  },
  "mob-tech-007": {
    "spot": "The general term has $n!$ against $3^n$: for both factorials and exponentials, consecutive terms cancel massively when divided ($\\frac{(n+1)!}{n!}=n+1$, $\\frac{3^{n+1}}{3^n}=3$) — the signature of the Ratio Test.",
    "why": "The Ratio Test turns the factorial into a polynomial; the Root Test would need the $n$th root of $n!$, i.e. Stirling, too roundabout.",
    "steps": [
      "Divide consecutive terms: $\\frac{a_{n+1}}{a_n}=\\frac{(n+1)!}{n!}\\cdot\\frac{3^n}{3^{n+1}}=\\frac{n+1}{3}$.",
      "$\\frac{n+1}{3}\\to\\infty>1$: from $n=3$ on the ratio exceeds $1$ and the terms keep growing.",
      "So with the Ratio Test, the conclusion is divergence."
    ],
    "trap": "Thinking $3^n$ is exponential and therefore grows fastest, and concluding convergence; factorials grow faster than any exponential with a fixed base.",
    "check": "The first few terms $\\frac{1}{3},\\frac{2}{9},\\frac{6}{27},\\frac{24}{81},\\frac{120}{243}$ start growing from the third term on — even \"terms tend to $0$\" fails."
  },
  "mob-tech-008": {
    "spot": "The whole general term is \"something to the $n$th power\", $\\left(\\frac{n}{2n+1}\\right)^n$: taking the $n$th root removes the power exactly.",
    "why": "The Root Test gives $\\frac{n}{2n+1}$ in one step; the Ratio Test would divide two $n$th powers with different bases, which is messy.",
    "steps": [
      "$\\sqrt[n]{a_n}=\\frac{n}{2n+1}$.",
      "$\\frac{n}{2n+1}\\to\\frac{1}{2}<1$.",
      "So with the Root Test, the conclusion is convergence."
    ],
    "trap": "Using the $n$th-term test on $\\frac{n}{2n+1}\\to\\frac{1}{2}\\ne0$ to claim divergence — forgetting the outer $n$th power.",
    "check": "Every term is less than $\\left(\\frac{1}{2}\\right)^n$, so comparison with a geometric series also confirms convergence."
  },
  "mob-tech-011": {
    "spot": "Two rescaled versions $e^{-ax}$, $e^{-bx}$ of the same function $e^{-x}$ subtracted, divided by $x$, integrated from $0$ to $\\infty$: this is the standard shape of a Frullani integral.",
    "why": "$\\frac{e^{-ax}}{x}$ on its own diverges at $0$ and has no elementary antiderivative; Frullani's theorem gives $\\left(f(0)-f(\\infty)\\right)\\ln\\frac{b}{a}$ directly.",
    "steps": [
      "Shape: $\\int_0^\\infty\\frac{f(ax)-f(bx)}{x}dx$ with $f(x)=e^{-x}$, $f(0)=1$, $f(\\infty)=0$.",
      "Near $0$ each term behaves like $\\frac{1}{x}$, so integrated separately both diverge; together they tend to $b-a$ near $0$, which is finite.",
      "Frullani: integral $=\\left(f(0)-f(\\infty)\\right)\\ln\\frac{b}{a}=\\ln\\frac{b}{a}$. For example $a=2$, $b=5$ gives $\\ln\\frac{5}{2}$.",
      "So the technique to use is the Frullani integral."
    ],
    "trap": "Splitting into $\\int\\frac{e^{-ax}}{x}-\\int\\frac{e^{-bx}}{x}$ and computing separately: both diverge, leaving a dead-end \"$\\infty-\\infty$\". Or misremembering the answer as $\\ln\\frac{a}{b}$.",
    "check": "For $a<b$, $e^{-ax}>e^{-bx}$, so the integrand is positive and the answer $\\ln\\frac{b}{a}>0$ — the sign matches."
  },
  "mob-tech-019": {
    "spot": "The radius of convergence only says \"converges for $|x-c|<R$, diverges for $|x-c|>R$\"; it says nothing at the two points where $|x-c|=R$. To know whether the endpoints are open or closed, you have to plug them back into the original series.",
    "why": "The Ratio and Root Tests give a limit of exactly $1$ at the endpoints, so they fail; plugging in turns the endpoint into an ordinary numerical series, where the Alternating Series Test, $p$-series and the Comparison Test come into play.",
    "steps": [
      "Three series with the same $R=1$: $\\sum x^n$, $\\sum\\frac{x^n}{n}$, $\\sum\\frac{x^n}{n^2}$ — the ratio tends to $|x|$ for each.",
      "$\\sum x^n$: at $x=\\pm1$ the terms don't tend to $0$, both ends diverge, interval $(-1,1)$.",
      "$\\sum\\frac{x^n}{n}$: $x=1$ is the harmonic series (diverges), $x=-1$ is the alternating harmonic series (converges), interval $[-1,1)$.",
      "$\\sum\\frac{x^n}{n^2}$: both ends give $\\sum\\frac{1}{n^2}$, absolutely convergent, interval $[-1,1]$.",
      "Same radius, three different endpoint outcomes — so after finding the radius you must analyze the endpoints."
    ],
    "trap": "Writing $(c-R,c+R)$ or $[c-R,c+R]$ right after finding $R$ without checking the endpoints; with the same $R=1$, the endpoints can be both open, one open and one closed, or both closed.",
    "check": "Endpoint checks are done on the original series, not on the coefficients: $\\sum\\frac{x^n}{n}$ at $x=-1$ is $\\sum\\frac{(-1)^n}{n}$, with finite value $-\\ln 2$."
  },
  "mob-trap-004": {
    "spot": "$\\sum\\frac{(-1)^n}{n}$: alternating signs plus $\\frac{1}{n}$ decreasing to $0$ pass the Alternating Series Test; but the absolute values form the harmonic series — convergence comes from positive and negative terms cancelling, not from the terms being small enough.",
    "why": "Absolute convergence and convergence must be checked separately: the Alternating Series Test only covers the original series; the absolute series needs a separate $p$-series check.",
    "steps": [
      "Original series: $\\frac{1}{n}$ decreases to $0$, so the Alternating Series Test gives convergence, with sum $-\\ln 2$.",
      "Absolute values: $\\sum\\frac{1}{n}$ is the harmonic series with $p=1$, which diverges (its partial sums exceed $\\ln(N+1)$).",
      "Convergent but not absolutely convergent: this is called conditional convergence."
    ],
    "trap": "Reporting absolute convergence as soon as you see convergence; or the reverse, seeing that $\\sum\\frac{1}{n}$ diverges and saying the original series diverges too.",
    "check": "Rearranging a conditionally convergent series can change its sum: that's exactly how it differs from the absolutely convergent $\\sum\\frac{(-1)^n}{n^2}=-\\frac{\\pi^2}{12}$."
  },
  "mob-trap-005": {
    "spot": "$R=1$ only determines the open interval $(-1,1)$; plugging the two endpoints into $\\sum\\frac{x^n}{n}$ gives the harmonic series at one and the alternating harmonic series at the other, with different results.",
    "why": "At the endpoints the ratio limit is $1$, so every root or ratio test fails; the only way is to plug each back into the original series.",
    "steps": [
      "The ratio $\\frac{n}{n+1}|x|\\to|x|$ gives $R=1$, but at $|x|=1$ the limit is exactly $1$ — inconclusive.",
      "$x=1$: $\\sum\\frac{1}{n}$ diverges.",
      "$x=-1$: $\\sum\\frac{(-1)^n}{n}$ converges to $-\\ln 2$.",
      "So the trap is forgetting to check the endpoints: the correct interval of convergence is $[-1,1)$."
    ],
    "trap": "Writing $(-1,1)$ right after finding $R=1$, missing $x=-1$; or checking only that $x=1$ diverges and assuming both ends are the same.",
    "check": "$\\sum\\frac{x^n}{n}=-\\ln(1-x)$: at $x=-1$ it gives $-\\ln 2$, finite; at $x=1$ it gives $-\\ln 0$, which blows up."
  },
  "mob-trap-006": {
    "spot": "The formula $\\int_0^\\infty e^{-ax}dx=\\frac{1}{a}$ hides a condition: $e^{-ax}$ must decay to $0$, so $a$ must be positive.",
    "why": "An improper integral must first be written as $\\lim_{b\\to\\infty}\\int_0^b$; whether that limit exists depends on the sign of $a$, so you can't just apply the formula.",
    "steps": [
      "$\\int_0^b e^{-ax}dx=\\frac{1-e^{-ab}}{a}$ ($a\\ne0$). For example with $a=2$ the integral is $\\frac{1}{2}$.",
      "$a<0$: $e^{-ab}\\to\\infty$, so the integral diverges. For example with $a=-1$, integrating up to $20$ already exceeds $10^8$.",
      "$a=0$: the integrand is $1$, $\\int_0^b1\\,dx=b\\to\\infty$, also divergent.",
      "So the trap is the convergence condition: the formula $\\frac{1}{a}$ requires $a$ positive."
    ],
    "trap": "Answering $\\frac{1}{a}$ blindly; with $a=-1$ that gives $-1$, but the integral of the positive function $e^{x}$ can't be negative — and it actually diverges.",
    "check": "For $a>0$ the integrand is positive and the integral $\\frac{1}{a}>0$, which makes sense; the larger $a$, the faster the decay and the smaller the area."
  },
  "refine-integrals-025": {
    "spot": "The numerator $x$ is exactly half the derivative of the denominator $x^2+1$: substitute $u=x^2+1$, integrate to get $\\frac{1}{2}\\ln(b^2+1)$, then solve the equation.",
    "why": "The $u$-substitution gives the antiderivative in one step; what's left is a log equation — multiply both sides by $2$ and exponentiate.",
    "steps": [
      "$u=x^2+1$: $\\int_0^b\\frac{x}{x^2+1}dx=\\frac{1}{2}\\ln(b^2+1)$.",
      "$\\frac{1}{2}\\ln(b^2+1)=\\ln 5\\Rightarrow\\ln(b^2+1)=\\ln 25\\Rightarrow b^2+1=25$.",
      "$b>0$: $b=\\sqrt{24}=2\\sqrt6$."
    ],
    "trap": "Dropping the $\\frac{1}{2}$ and writing $\\ln(b^2+1)=\\ln 5$, which gives $b=2$.",
    "check": "Plugging $b=2$ back in gives only $\\frac{1}{2}\\ln 5$ — exactly half; you need $2\\sqrt6\\approx 4.9$."
  },
  "refine-integrals-031": {
    "spot": "The question asks for total distance, not displacement: $v=t^2-4t+3=(t-1)(t-3)$ changes sign at $t=1$ inside $[0,3]$, so split there and take the absolute value of the negative piece.",
    "why": "Distance is $\\int|v|\\,dt$; finding the zeros of $v$ and splitting is easier than integrating $|v|$ directly.",
    "steps": [
      "$v=(t-1)(t-3)$: positive for $0<t<1$, negative for $1<t<3$.",
      "$\\int_0^1v\\,dt=\\frac{4}{3}$, $\\int_1^3v\\,dt=-\\frac{4}{3}$.",
      "Total distance $=\\frac{4}{3}+\\frac{4}{3}=\\frac{8}{3}$ m."
    ],
    "trap": "Computing $\\int_0^3v\\,dt=0$ directly: that's the displacement (forward $\\frac{4}{3}$ and back $\\frac{4}{3}$), not the distance.",
    "check": "A displacement of $0$ means it returns to the start; the distance is one trip out and one back, so exactly twice the one-way distance."
  },
  "refine-integrals-034": {
    "spot": "The spring force $F=kx$ varies with the extension, so work needs an integral; the start is \"already stretched $0.2$\", so the lower limit is $0.2$, not $0$.",
    "why": "Work by a variable force is $\\int F\\,dx$; first find $k$ from the given data, then integrate over the correct range.",
    "steps": [
      "Hooke's law: $10=k\\cdot 0.2$, $k=50\\ \\mathrm{N/m}$.",
      "$W=\\int_{0.2}^{0.5}50x\\,dx=25\\left(0.5^2-0.2^2\\right)=25\\cdot 0.21$.",
      "$W=5.25\\ \\mathrm{J}=\\frac{21}{4}\\ \\mathrm{J}$."
    ],
    "trap": "Integrating from $0$ to $0.5$ and getting $\\frac{25}{4}=6.25$ J — that includes the extra work of stretching from natural length to $0.2$.",
    "check": "Split the total work in two: $0\\to0.2$ is $1$ J and $0.2\\to0.5$ is $5.25$ J, together $6.25$ J."
  },
  "refine-integrals-039": {
    "spot": "The denominator is $\\sqrt{9-x^2}=\\sqrt{3^2-x^2}$ and the numerator is $x^2$, not $x$: $u=9-x^2$ doesn't substitute cleanly, and \"$\\sqrt{a^2-x^2}$\" is the signal for $x=a\\sin\\theta$.",
    "why": "$x=3\\sin\\theta$ makes $9-9\\sin^2\\theta=9\\cos^2\\theta$, so the root disappears; a $u$-substitution only works when the numerator is exactly $x$.",
    "steps": [
      "$u=9-x^2$ gives $du=-2x\\,dx$, but the numerator is $x^2$, and the leftover $x$ has to be written as $\\sqrt{9-u}$ — it only gets messier.",
      "Let $x=3\\sin\\theta$: $\\sqrt{9-x^2}=3\\cos\\theta$, $dx=3\\cos\\theta\\,d\\theta$. For example $\\theta=0.7$.",
      "The integral becomes $\\int\\frac{9\\sin^2\\theta}{3\\cos\\theta}3\\cos\\theta\\,d\\theta=9\\int\\sin^2\\theta\\,d\\theta=\\frac{9}{2}(\\theta-\\sin\\theta\\cos\\theta)+C$.",
      "Back to $x$: $\\frac{9}{2}\\arcsin\\frac{x}{3}-\\frac{x}{2}\\sqrt{9-x^2}+C$. So the most direct method is trigonometric substitution."
    ],
    "trap": "Forcing $u=9-x^2$ and treating $x^2\\,dx$ as $-\\frac{1}{2}du$, losing a factor of $x$; or choosing $x=3\\tan\\theta$ (that's for $\\sqrt{a^2+x^2}$).",
    "check": "Definite-integral check: $\\int_0^3\\frac{x^2}{\\sqrt{9-x^2}}dx$ corresponds to $\\theta$ from $0$ to $\\frac{\\pi}{2}$, with value $\\frac{9}{2}\\cdot\\frac{\\pi}{2}=\\frac{9\\pi}{4}$."
  },
  "refine-limits-026": {
    "spot": "$x\\to1$, and $\\sin(\\pi x)$ at $x=1$ is $\\sin\\pi=0$: a $\\frac{0}{0}$ form, but not near $0$. First shift with $t=x-1$ to move it to the origin, then use $\\frac{\\sin u}{u}\\to1$.",
    "why": "After the change of variable it's just a standard trig limit; L'Hôpital's Rule is also one step ($\\pi\\cos\\pi=-\\pi$), but the substitution makes it harder to lose the minus sign.",
    "steps": [
      "Let $t=x-1\\to0$: $\\sin(\\pi x)=\\sin(\\pi+\\pi t)=-\\sin(\\pi t)$.",
      "$\\frac{-\\sin(\\pi t)}{t}=-\\pi\\cdot\\frac{\\sin(\\pi t)}{\\pi t}$, and $\\frac{\\sin(\\pi t)}{\\pi t}\\to1$.",
      "Limit $=-\\pi$."
    ],
    "trap": "Forgetting the minus sign in $\\sin(\\pi+\\theta)=-\\sin\\theta$ and answering $\\pi$.",
    "check": "L'Hôpital: $\\frac{\\pi\\cos(\\pi x)}{1}$ at $x=1$ is $-\\pi$; on the graph, $\\sin\\pi x$ crosses $0$ going downward at $x=1$, so the slope is negative."
  },
  "refine-limits-027": {
    "spot": "The numerator is a difference of two $\\cos$ terms and the denominator is $x^2$: sum-to-product turns the difference into a product of two $\\sin$ terms, each pairing with one $x$.",
    "why": "After sum-to-product, apply $\\frac{\\sin u}{u}\\to1$ twice; a second-order Taylor expansion also works and makes a good check.",
    "steps": [
      "Sum-to-product: $\\cos x-\\cos3x=-2\\sin2x\\sin(-x)=2\\sin2x\\sin x$.",
      "$\\frac{2\\sin2x\\sin x}{x^2}=4\\cdot\\frac{\\sin2x}{2x}\\cdot\\frac{\\sin x}{x}$, and both ratios tend to $1$.",
      "Limit $=4$."
    ],
    "trap": "Getting the sign in the sum-to-product formula wrong, ending up with $-2\\sin2x\\sin x$ and answering $-4$.",
    "check": "Taylor: $\\cos x-\\cos3x\\approx\\left(1-\\frac{x^2}{2}\\right)-\\left(1-\\frac{9x^2}{2}\\right)=4x^2$, also giving $4$."
  },
  "refine-limits-028": {
    "spot": "A cube root minus $x$, which is $\\infty-\\infty$ as $x\\to\\infty$; there's no square-root-style conjugate, but there is the difference-of-cubes identity $a-b=\\frac{a^3-b^3}{a^2+ab+b^2}$.",
    "why": "Difference of cubes pulls out the clean quantity $a^3-b^3=3x^2$, and each of the three denominator terms is about $x^2$; plugging in large numbers directly means subtracting huge numbers.",
    "steps": [
      "Let $a=\\sqrt[3]{x^3+3x^2}$, $b=x$: $a^3-b^3=3x^2$.",
      "$a-b=\\frac{3x^2}{a^2+ab+b^2}$.",
      "$a\\approx x$, so the denominator is $\\approx3x^2$ and the limit $=1$."
    ],
    "trap": "Out of square-root habit, multiplying by $\\sqrt[3]{x^3+3x^2}+x$: the numerator becomes $a^2-x^2$, the root doesn't go away, and you're stuck.",
    "check": "Binomial expansion: $x\\left(1+\\frac{3}{x}\\right)^{1/3}\\approx x+1-\\frac{1}{x}$; at $x=100$ the difference is about $0.990$, a little below $1$."
  },
  "refine-limits-029": {
    "spot": "A cube root on top and a square root on the bottom, both $0$ at $x=1$: with two kinds of roots at once, take the least common multiple of $2$ and $3$ and let $x=t^6$, turning both into integer powers.",
    "why": "In terms of $t$ it's a ratio of polynomials, and factoring cancels $t-1$; rationalizing the two kinds of roots separately would take two rounds and much more work.",
    "steps": [
      "Let $x=t^6$ ($t\\to1$): $\\sqrt[3]{x}=t^2$, $\\sqrt{x}=t^3$, and the expression becomes $\\frac{t^2-1}{t^3-1}$.",
      "Cancel $t-1$: $\\frac{(t-1)(t+1)}{(t-1)(t^2+t+1)}=\\frac{t+1}{t^2+t+1}$.",
      "Plug in $t=1$: $\\frac{2}{3}$."
    ],
    "trap": "Getting the ratio upside down and answering $\\frac{3}{2}$; or letting $x=t^3$, which only handles one kind of root and leaves you stuck with $t^{3/2}$.",
    "check": "L'Hôpital: the numerator's derivative is $\\frac{1}{3}$ and the denominator's is $\\frac{1}{2}$ (at $x=1$), ratio $\\frac{2}{3}$."
  },
  "refine-limits-030": {
    "spot": "Under the root is $1-\\cos2x=2\\sin^2x$, whose square root is $\\sqrt2\\,|\\sin x|$ — with an absolute value; and the problem specifies $x\\to0^-$, where $\\sin x$ is negative.",
    "why": "Use the double-angle formula to take the root first, then check the sign on that side; applying $\\frac{\\sin x}{x}\\to1$ directly loses the minus sign that the absolute value produces.",
    "steps": [
      "Double angle: $1-\\cos2x=2\\sin^2x$, so $\\sqrt{1-\\cos2x}=\\sqrt2\\,|\\sin x|$.",
      "For $x<0$ (and near $0$), $\\sin x<0$, so $|\\sin x|=-\\sin x$ and the ratio is $-\\sqrt2\\cdot\\frac{\\sin x}{x}$.",
      "$\\frac{\\sin x}{x}\\to1$, so the limit $=-\\sqrt2$."
    ],
    "trap": "Writing $\\sqrt{\\sin^2x}$ as $\\sin x$ and answering $\\sqrt2$; that's the right-hand limit.",
    "check": "The numerator is a square root, always positive, and the denominator $x<0$, so the ratio must be negative; the right-hand limit is $+\\sqrt2$, so the two-sided limit doesn't exist."
  },
  "refine-limits-031": {
    "spot": "As $x\\to0^+$, $\\frac{1}{x}\\to+\\infty$ and $e^{1/x}$ blows up; both top and bottom contain $e^{1/x}$, so divide through by this largest quantity.",
    "why": "After dividing by the dominant term, everything else becomes $e^{-1/x}\\to0$; L'Hôpital's Rule only makes expressions like this more complicated.",
    "steps": [
      "Divide through by $e^{1/x}$: $\\frac{3+e^{1/x}}{1+2e^{1/x}}=\\frac{3e^{-1/x}+1}{e^{-1/x}+2}$.",
      "$x\\to0^+$: $e^{-1/x}\\to0$.",
      "Limit $=\\frac{0+1}{0+2}=\\frac{1}{2}$."
    ],
    "trap": "Saying $e^{1/x}\\to\\infty$ without distinguishing sides; from the left, $x\\to0^-$, $\\frac{1}{x}\\to-\\infty$, $e^{1/x}\\to0$, and the limit is $3$.",
    "check": "The left-hand limit is $\\frac{3+0}{1+0}=3$, different from the right-hand limit $\\frac{1}{2}$, so the two-sided limit doesn't exist — that's exactly why the problem specifies the right side."
  }
};
