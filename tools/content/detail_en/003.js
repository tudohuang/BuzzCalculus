// Detail v2, English — batch 003. Translation of tools/content/detail/003.js (text only; claims live in the Chinese file).
module.exports = {
  "lb-lp-006": {
    "spot": "The integrand $x^{-2/3}$ is nonnegative and blows up only at $x=0$, and it is a power $x^{-p}$ with $p=\\frac{2}{3}<1$: for a nonnegative function the Lebesgue integral equals the improper integral, so just apply the $p$ criterion.",
    "why": "For a nonnegative measurable function, the Monotone Convergence Theorem lets you take the limit of Riemann integrals over $[\\frac{1}{n},1]$; no need to actually approximate by simple functions.",
    "steps": [
      "$x^{-2/3}\\ge 0$; take $f_n=x^{-2/3}\\mathbf{1}_{[1/n,1]}$, which increase to $x^{-2/3}$; the Monotone Convergence Theorem says $\\int_0^1 x^{-2/3}\\,d\\mu=\\lim_{n\\to\\infty}\\int_{1/n}^1 x^{-2/3}\\,dx$.",
      "Antiderivative: $\\int x^{-2/3}\\,dx=3x^{1/3}$ (add one to the exponent to get $\\frac{1}{3}$, then divide by $\\frac{1}{3}$).",
      "On $[\\varepsilon,1]$: $\\int_\\varepsilon^1 x^{-2/3}\\,dx=3-3\\varepsilon^{1/3}$. For example $\\varepsilon=0.001$ gives $3-0.3=2.7$.",
      "Let $\\varepsilon\\to 0^+$: $3\\varepsilon^{1/3}\\to 0$, so the integral is $3$ (finite, so $x^{-2/3}$ is integrable on $[0,1]$)."
    ],
    "trap": "Seeing the integrand is unbounded at $0$ and saying \"not integrable\". Unbounded does not mean the integral diverges: $x^{-p}$ is integrable on $[0,1]$ whenever $p<1$; for $p=\\frac{2}{3}$ it is $3$.",
    "check": "At $\\varepsilon=10^{-6}$ the missing part is $3\\varepsilon^{1/3}=0.03$: the closer to $0$, the closer to $3$, and always below $3$."
  },
  "mob-tech-015": {
    "spot": "The interval is exactly $[0,1]$ and the integrand is a power of $x$ times a power of $(1-x)$: the shape $x^{a-1}(1-x)^{b-1}$ is the definition of the Beta function.",
    "why": "For general $a,b$, integration by parts or expanding never ends; recognizing $B(a,b)=\\frac{\\Gamma(a)\\Gamma(b)}{\\Gamma(a+b)}$ finishes it in one line.",
    "steps": [
      "Definition: $B(a,b)=\\int_0^1 x^{a-1}(1-x)^{b-1}\\,dx$ ($a,b>0$). The expression in the problem is exactly this.",
      "Formula: $B(a,b)=\\frac{\\Gamma(a)\\Gamma(b)}{\\Gamma(a+b)}$; for integers $\\Gamma(n)=(n-1)!$. For example $B(2,3)=\\frac{1!\\,2!}{4!}=\\frac{1}{12}$.",
      "Half-integers work just as well: $B(\\frac{1}{2},\\frac{1}{2})=\\frac{\\Gamma(\\frac{1}{2})^2}{\\Gamma(1)}=\\pi$.",
      "So the technique is the Beta function (then convert to Gamma functions to compute)."
    ],
    "trap": "Writing $\\Gamma(a+b)$ as $\\Gamma(a)+\\Gamma(b)$, or forgetting that $\\Gamma(n)=(n-1)!$ subtracts one: then $B(2,3)$ comes out as $\\frac{2!\\,3!}{5!}=\\frac{1}{10}$, which is wrong.",
    "check": "$B(a,b)=B(b,a)$ (substitute $x\\mapsto 1-x$): $B(3,2)$ and $B(2,3)$ are both $\\frac{1}{12}$."
  },
  "ode-p2-001": {
    "spot": "Second-order linear with constant coefficients, $y''+y=x$; the right side is a degree-one polynomial and $0$ is not a characteristic root: guess a linear particular solution, then use the two initial values to fix the homogeneous coefficients.",
    "why": "Undetermined coefficients nails a polynomial right side on the first guess; variation of parameters also works but means integrating $x\\sin x$ and $x\\cos x$ — wasted effort.",
    "steps": [
      "Homogeneous equation $y''+y=0$: characteristic equation $r^2+1=0$, $r=\\pm i$, homogeneous solution $c_1\\cos x+c_2\\sin x$.",
      "Guess $y_p=Ax+B$: $y_p''=0$, and substituting gives $Ax+B=x$, so $y_p=x$.",
      "General solution $y=x+c_1\\cos x+c_2\\sin x$. $y(0)=c_1=0$.",
      "$y'=1+c_2\\cos x$ ($c_1=0$), $y'(0)=1+c_2=0$, so $c_2=-1$.",
      "$y(x)=x-\\sin x$."
    ],
    "trap": "Applying the initial values before adding the particular solution: fitting $c_1\\cos x+c_2\\sin x$ to $y(0)=y'(0)=0$ gives $c_1=c_2=0$, then adding $x$ gives $y=x$, but $y'(0)=1\\ne 0$. Initial values go into the general solution.",
    "check": "For small $x$, $x-\\sin x\\approx\\frac{x^3}{6}$: both value and slope at $0$ are $0$, matching the initial values."
  },
  "an-int-003": {
    "spot": "$f(x)=x^2$ is increasing on $[0,1]$: on each piece the upper sum uses the right endpoint and the lower sum the left endpoint, so the difference telescopes.",
    "why": "No need to compute $U_n$ and $L_n$ with sum-of-squares formulas; for a monotone function $U_n-L_n$ is always $\\frac{f(1)-f(0)}{n}$.",
    "steps": [
      "It is increasing, so on the $k$-th piece $[\\frac{k-1}{n},\\frac{k}{n}]$ the maximum is $f(\\frac{k}{n})$ and the minimum is $f(\\frac{k-1}{n})$.",
      "$U_n-L_n=\\frac{1}{n}\\sum_{k=1}^n\\left[f(\\tfrac{k}{n})-f(\\tfrac{k-1}{n})\\right]=\\frac{f(1)-f(0)}{n}=\\frac{1}{n}$. Check with $n=4$: $U_4=\\frac{30}{64}$, $L_4=\\frac{14}{64}$, difference $\\frac{1}{4}$.",
      "We need $\\frac{1}{n}<0.005$, i.e. $n>200$. At $n=200$ it equals $0.005$ exactly, which is not \"less than\".",
      "So the smallest positive integer is $n=201$."
    ],
    "trap": "Answering $200$: $U_{200}-L_{200}=0.005$ is \"equal to\", but the problem wants strictly less; or treating $U_n-L_n$ as $\\frac{1}{n^2}$ and getting $15$.",
    "check": "$U_n-L_n$ depends only on the total rise $f(1)-f(0)=1$; with $f(x)=x^3$ it is also $\\frac{1}{n}$, and the answer is again $201$."
  },
  "an-uf-001": {
    "spot": "$x^n$ tends to $0$ on $[0,1)$ but is always $1$ at $x=1$: the limit function jumps at the endpoint. A uniform limit of continuous functions must be continuous — so with a jump, the convergence can't be uniform.",
    "why": "Checking whether the limit function is continuous is the fastest way to rule out uniform convergence; otherwise compute $\\sup|f_n-f|$ directly and find a sequence of points where it doesn't tend to $0$.",
    "steps": [
      "Pointwise limit: for $0\\le x<1$, $x^n\\to 0$ (e.g. $0.9^n\\to 0$); at $x=1$, $1^n=1$. So $f(x)=0\\ (x<1)$, $f(1)=1$.",
      "Every $f_n$ is continuous, but the limit $f$ is discontinuous at $x=1$; uniform convergence would force the limit to be continuous — contradiction.",
      "Look at the distance directly: take $x_n=1-\\frac{1}{n}$; $|f_n(x_n)-0|=(1-\\frac{1}{n})^n\\to\\frac{1}{e}$, which does not tend to $0$, so $\\sup_{[0,1]}|f_n-f|\\not\\to 0$.",
      "Conclusion: $x^n$ converges pointwise but not uniformly on $[0,1]$."
    ],
    "trap": "Seeing that it converges at every point and calling it uniform. Pointwise convergence allows slower and slower convergence as you approach $1$; uniform convergence needs a single $N$ that works for every $x$, which fails here.",
    "check": "Shrink to $[0,0.9]$ and it becomes uniform: $\\sup|x^n|=0.9^n\\to 0$. Only the part near $1$ is bad."
  },
  "cx-hi-007": {
    "spot": "The denominator is a product of two factors $x^2+a^2$, and treating $x^2$ as a single unit it is linear: partial fractions in $x^2$ split it into two terms $\\frac{1}{x^2+a^2}$, each an $\\arctan$.",
    "why": "The residue theorem works too (two poles $2i$, $3i$ in the upper half-plane), but partial fractions plus $\\int_0^\\infty\\frac{dx}{x^2+a^2}=\\frac{\\pi}{2a}$ takes two lines.",
    "steps": [
      "Treat $u=x^2$ as the variable: $\\frac{1}{(u+4)(u+9)}=\\frac{1}{5}\\left(\\frac{1}{u+4}-\\frac{1}{u+9}\\right)$ (coefficient $\\frac{1}{9-4}$).",
      "$\\int_0^\\infty\\frac{dx}{x^2+a^2}=\\frac{1}{a}\\arctan\\frac{x}{a}\\Big|_0^\\infty=\\frac{\\pi}{2a}$: $a=2$ gives $\\frac{\\pi}{4}$, $a=3$ gives $\\frac{\\pi}{6}$.",
      "Subtract and multiply by $\\frac{1}{5}$: $\\frac{1}{5}\\left(\\frac{\\pi}{4}-\\frac{\\pi}{6}\\right)=\\frac{1}{5}\\cdot\\frac{\\pi}{12}=\\frac{\\pi}{60}$."
    ],
    "trap": "Forgetting to divide the partial fraction coefficients by $9-4=5$, writing just $\\frac{1}{x^2+4}-\\frac{1}{x^2+9}$ and getting $\\frac{\\pi}{12}$, five times too big.",
    "check": "Numerical integration gives $\\approx 0.05236$, which is $\\frac{\\pi}{60}$; it is also below the upper bound $\\frac{\\pi}{36}$ from replacing the denominator by $(x^2+4)\\cdot 9$."
  },
  "lb-cmp-002": {
    "spot": "At infinity $\\frac{\\sin x}{x}$ alternates in sign and shrinks slowly (like $\\frac{1}{x}$): the cancellation of positive and negative parts makes the improper integral converge, but after taking absolute values only area of order $\\frac{1}{x}$ keeps piling up.",
    "why": "Lebesgue integrability requires $\\int|f|<\\infty$; so check the signed limit and the absolute total separately — the answers differ.",
    "steps": [
      "Improper integral: $\\int_0^\\infty\\frac{\\sin x}{x}\\,dx$ converges by Dirichlet's test ($\\int\\sin$ is bounded, $\\frac{1}{x}$ decreases to $0$), with value $\\frac{\\pi}{2}$.",
      "Absolute values: on $[n\\pi,(n+1)\\pi]$, $\\frac{1}{x}\\ge\\frac{1}{(n+1)\\pi}$ and $\\int|\\sin x|=2$, so this piece is at least $\\frac{2}{(n+1)\\pi}$.",
      "Adding all pieces gives at least $\\frac{2}{\\pi}\\sum\\frac{1}{n+1}$; the harmonic series diverges, so $\\int_0^\\infty\\frac{|\\sin x|}{x}\\,dx=\\infty$. The first $20$ pieces already exceed $2$.",
      "Conclusion: the improper integral converges, but the function is not Lebesgue integrable ($\\int|f|=\\infty$)."
    ],
    "trap": "Believing that \"a convergent improper Riemann integral is always Lebesgue integrable\". True for nonnegative functions; false for ones that converge only through cancellation (conditional convergence) — the same story as $\\sum\\frac{(-1)^n}{n}$ converging but not absolutely.",
    "check": "$\\int_0^{N\\pi}\\frac{|\\sin x|}{x}\\,dx$ grows roughly like $\\frac{2}{\\pi}\\ln N$: as $N$ goes from $20$ to $40$ it adds about $\\frac{2}{\\pi}\\ln 2\\approx 0.44$, and it never stops."
  },
  "lb-mea-003": {
    "spot": "Step $n$ removes $2^{n-1}$ intervals, each of length $5^{-n}$: the total removed length is $\\sum 2^{n-1}5^{-n}$, a geometric series with ratio $\\frac{2}{5}$.",
    "why": "Measure is countably additive and the removed intervals are pairwise disjoint, so just add the lengths; you don't need to know what the remaining set looks like.",
    "steps": [
      "The length removed at step $n$ is $2^{n-1}\\cdot 5^{-n}$: the first three steps remove $\\frac{1}{5}$, $\\frac{2}{25}$, $\\frac{4}{125}$.",
      "The ratio of consecutive terms is $\\frac{2}{5}<1$, so the geometric series converges.",
      "Total length $=\\frac{\\text{first term}}{1-\\text{ratio}}=\\frac{1/5}{1-2/5}=\\frac{1/5}{3/5}=\\frac{1}{3}$."
    ],
    "trap": "Assuming, from the Cantor set, that \"the total removed length is always $1$\". That happens because the Cantor set removes a third each time; here less is removed, and the remaining set has measure $1-\\frac{1}{3}=\\frac{2}{3}>0$ (yet still has no interior points).",
    "check": "For the original Cantor set (step $n$ removes $2^{n-1}$ intervals of length $3^{-n}$) the same formula gives $1$; this version's $\\frac{1}{3}$ is smaller, which makes sense."
  },
  "lb-sim-005": {
    "spot": "$\\lfloor x^2\\rfloor$ takes only the integer values $0,1,2,3$, so it is a simple function: find the preimage of each value (where $x^2$ crosses $1,2,3$), and the integral is the sum of \"value times length\".",
    "why": "The integral of a simple function comes straight from the definition; the cut points $\\sqrt{2}$, $\\sqrt{3}$ being unevenly spaced doesn't matter, as long as each piece is measurable.",
    "steps": [
      "$x^2$ is increasing on $[0,2]$, and it crosses the integers $1,2,3$ at $x=1,\\sqrt{2},\\sqrt{3}$.",
      "So $\\lfloor x^2\\rfloor=0$ on $[0,1)$, $=1$ on $[1,\\sqrt{2})$, $=2$ on $[\\sqrt{2},\\sqrt{3})$, $=3$ on $[\\sqrt{3},2)$ (the single point $x=2$ has measure $0$).",
      "Integral $=0\\cdot 1+1\\cdot(\\sqrt{2}-1)+2(\\sqrt{3}-\\sqrt{2})+3(2-\\sqrt{3})$.",
      "Collect terms: the coefficient of $\\sqrt{2}$ is $1-2=-1$, of $\\sqrt{3}$ is $2-3=-1$, constant $-1+6=5$, giving $5-\\sqrt{2}-\\sqrt{3}\\approx 1.854$."
    ],
    "trap": "Taking the cut points as $x=1,2,3$ (forgetting it is $x^2$ that crosses the integers, not $x$), or replacing $\\lfloor x^2\\rfloor$ by $x^2$ and getting $\\frac{8}{3}$.",
    "check": "$x^2-1<\\lfloor x^2\\rfloor\\le x^2$, so the integral lies between $\\frac{8}{3}-2=\\frac{2}{3}$ and $\\frac{8}{3}$; $1.854$ is inside."
  },
  "ode-p2-006": {
    "spot": "The right side $\\cos x$ of $y''+y=\\cos x$ is itself a homogeneous solution (characteristic roots $\\pm i$): resonance, so the particular solution needs an extra factor of $x$.",
    "why": "The usual guess $A\\cos x+B\\sin x$ makes the entire left side $0$ and can't produce $\\cos x$; multiplying by $x$ is the standard fix in undetermined coefficients when there is overlap.",
    "steps": [
      "Homogeneous solution $c_1\\cos x+c_2\\sin x$; the right side $\\cos x$ overlaps with it, so guess $y_p=x(A\\cos x+B\\sin x)$.",
      "Substitute: $y_p''+y_p=-2A\\sin x+2B\\cos x$. Setting this equal to $\\cos x$ gives $A=0$, $B=\\frac{1}{2}$, $y_p=\\frac{x\\sin x}{2}$.",
      "General solution $y=\\frac{x\\sin x}{2}+c_1\\cos x+c_2\\sin x$. $y(0)=c_1=0$.",
      "$y_p'=\\frac{\\sin x+x\\cos x}{2}$ is $0$ at $0$, so $y'(0)=c_2=0$.",
      "$y(x)=\\frac{x\\sin x}{2}$ — the amplitude grows linearly in $x$; that is resonance."
    ],
    "trap": "Missing the resonance and guessing $y_p=A\\cos x+B\\sin x$: substituting gives $0=\\cos x$, with no solution for $A,B$; or forcing a wrong answer like $y_p=\\frac{1}{2}\\cos x$.",
    "check": "Substitute the answer back: $y''+y$ equals $\\cos x$ at every point, and $y(0)=y'(0)=0$."
  },
  "rel-hard-cpx-005": {
    "spot": "$z=0$ is a double pole ($z^2$), and the remaining $\\frac{1}{1-z}$ is a geometric series near $0$: expand and read off the coefficient of $z^{-1}$.",
    "why": "The double-pole formula needs one derivative; the expansion is just as fast and shows the whole Laurent series. Do both and compare answers.",
    "steps": [
      "For $|z|<1$, $\\frac{1}{1-z}=1+z+z^2+\\cdots$, so $\\frac{1}{z^2(1-z)}=\\frac{1}{z^2}+\\frac{1}{z}+1+z+\\cdots$.",
      "The residue is the coefficient of $z^{-1}$: $1$.",
      "Check with the formula: for a double pole $\\operatorname{Res}=\\frac{d}{dz}\\left[z^2f(z)\\right]_{z=0}=\\frac{d}{dz}\\frac{1}{1-z}\\Big|_0=\\frac{1}{(1-0)^2}=1$."
    ],
    "trap": "Treating the double pole as simple and computing $\\lim_{z\\to 0}z\\cdot f(z)=\\lim\\frac{1}{z(1-z)}$, which diverges; or plugging $0$ into $\\frac{1}{1-z}$ to get $1$, which is a coincidence (with $\\frac{1}{z^2(2-z)}$ it shows: the correct value is $\\frac{1}{4}$, not $\\frac{1}{2}$).",
    "check": "The other pole $z=1$ has residue $-1$, and at infinity $f\\sim -\\frac{1}{z^3}$ has no residue, so all residues sum to $0$: $1+(-1)=0$ checks out."
  },
  "td-int-004": {
    "spot": "A product of two sines divided by $x$: use product-to-sum to get $\\frac{\\cos 3x-\\cos 7x}{2x}$, which is a Frullani-type integral $\\int_0^\\infty\\frac{f(ax)-f(bx)}{x}\\,dx$.",
    "why": "A lone $\\int\\frac{\\cos ax}{x}$ diverges at $0$, so the two terms must stay together; the Frullani formula gives $\\ln\\frac{b}{a}$ directly.",
    "steps": [
      "Product-to-sum: $\\sin A\\sin B=\\frac{1}{2}[\\cos(A-B)-\\cos(A+B)]$, so $\\sin 2x\\sin 5x=\\frac{\\cos 3x-\\cos 7x}{2}$.",
      "Frullani: $\\int_\\varepsilon^\\infty\\frac{\\cos 3x-\\cos 7x}{x}\\,dx=\\int_{3\\varepsilon}^{7\\varepsilon}\\frac{\\cos u}{u}\\,du$; as $\\varepsilon\\to 0$, $\\cos u\\approx 1$, giving $\\ln\\frac{7\\varepsilon}{3\\varepsilon}=\\ln\\frac{7}{3}$.",
      "Multiply back by $\\frac{1}{2}$: the integral $=\\frac{1}{2}\\ln\\frac{7}{3}\\approx 0.4236$."
    ],
    "trap": "Splitting into $\\int\\frac{\\cos 3x}{x}-\\int\\frac{\\cos 7x}{x}$ and computing separately: both diverge at $0$, giving $\\infty-\\infty$; or thinking $\\int_0^\\infty\\frac{\\cos ax}{x}$ doesn't depend on $a$ and answering $0$.",
    "check": "The answer $\\frac{1}{2}\\ln\\frac{7}{3}>0$ is consistent with the integrand being positive near $0$ ($\\frac{\\sin 2x\\sin 5x}{x}\\approx 10x$), where the big positive lump dominates."
  },
  "an-ls-004": {
    "spot": "The coefficients alternate between $2^n$ and $3^n$ between even and odd terms: the ratio $\\frac{a_{n+1}}{a_n}$ alternately tends to $\\infty$ and to $0$, so it has no limit — the Ratio Test fails; use the limsup in Cauchy–Hadamard.",
    "why": "$R=\\frac{1}{\\limsup|a_n|^{1/n}}$ doesn't need a limit to exist; it only looks at the largest subsequence — which is exactly why the formula says $\\limsup$ and not $\\lim$.",
    "steps": [
      "The ratio is unstable: for even $n$, $\\frac{a_{n+1}}{a_n}=\\frac{3^{n+1}}{2^n}\\to\\infty$; for odd $n$, $\\frac{2^{n+1}}{3^n}\\to 0$.",
      "Take $n$-th roots: even terms $(2^n)^{1/n}=2$, odd terms $(3^n)^{1/n}=3$.",
      "$|a_n|^{1/n}$ just jumps between $2$ and $3$, so $\\limsup=3$.",
      "$R=\\frac{1}{3}$."
    ],
    "trap": "Averaging the two or looking only at the even terms and answering $\\frac{1}{2}$ or $\\frac{2}{5}$. The radius is set by the fastest-growing subsequence: at $x=0.4$ the even terms $0.8^n\\to 0$ are fine, but the odd terms $1.2^n$ blow up.",
    "check": "At $x=0.3<\\frac{1}{3}$, summing the even and odd terms separately gives two geometric series with ratio below $1$, so the total is finite; at $x=\\frac{1}{3}$ the odd terms are always $1$ and don't tend to $0$."
  },
  "der-022": {
    "spot": "Partial derivative in $y$: $x$ is a constant. The first term $xe^{xy}$ has $y$ in the exponent, so the Chain Rule drops out an extra $x$; the second term $y^3$ is an ordinary power.",
    "why": "Once $x$ is frozen as a constant, it's just the one-variable Chain Rule plus the power rule; no new tools needed.",
    "steps": [
      "$\\frac{\\partial}{\\partial y}e^{xy}=e^{xy}\\cdot\\frac{\\partial}{\\partial y}(xy)=xe^{xy}$.",
      "The $x$ in front is a constant, so keep it: $\\frac{\\partial}{\\partial y}(xe^{xy})=x\\cdot xe^{xy}=x^2e^{xy}$.",
      "$\\frac{\\partial}{\\partial y}y^3=3y^2$.",
      "Together: $x^2e^{xy}+3y^2$."
    ],
    "trap": "Using the Product Rule on $xe^{xy}$ and also differentiating $x$, adding an $e^{xy}$ term (which only appears in $\\frac{\\partial}{\\partial x}$); or skipping the Chain Rule and writing just $xe^{xy}$.",
    "check": "At $x=0$ the function becomes $y^3$, so the partial derivative should be just $3y^2$: plugging $x=0$ into the answer gives exactly $3y^2$."
  },
  "der-023": {
    "spot": "Mixed second partial derivative: differentiate in one variable, then the other. Differentiating $e^{xy}$ in $y$ first drops out an $x$; then differentiating in $x$ means the product $x\\cdot e^{xy}$ — use the Product Rule.",
    "why": "$e^{xy}$ is smooth enough that the order doesn't matter (Clairaut); doing $y$ first makes the product in the second step clearest.",
    "steps": [
      "$\\frac{\\partial}{\\partial y}e^{xy}=xe^{xy}$.",
      "Differentiate $xe^{xy}$ in $x$ with the Product Rule: $1\\cdot e^{xy}+x\\cdot ye^{xy}$.",
      "Factor out $e^{xy}$: $e^{xy}(1+xy)$."
    ],
    "trap": "Dropping the first Product Rule term in step two and writing only $xye^{xy}$; at $(0,0)$ that gives $0$, but the correct answer is $1$.",
    "check": "The other order ($x$ first, then $y$) must agree: $\\frac{\\partial}{\\partial x}e^{xy}=ye^{xy}$, then differentiating in $y$ gives $e^{xy}+xye^{xy}$."
  },
  "der-026": {
    "spot": "$x^2$ times $\\sin(3x)$: both factors vary, so it's the Product Rule; and $\\sin(3x)$ has $3x$ inside, so differentiating it needs the Chain Rule's extra factor $3$.",
    "why": "The Product Rule splits the problem into two simple derivatives, each a basic formula plus one layer of Chain Rule.",
    "steps": [
      "Product Rule: $(uv)'=u'v+uv'$ with $u=x^2$, $v=\\sin(3x)$.",
      "Chain Rule: $\\frac{d}{dx}\\sin(3x)=3\\cos(3x)$.",
      "Together: $2x\\sin(3x)+3x^2\\cos(3x)$."
    ],
    "trap": "Missing the inner $3$ from the Chain Rule and writing $2x\\sin(3x)+x^2\\cos(3x)$.",
    "check": "Near $x=0$, $x^2\\sin 3x\\approx 3x^3$, so the derivative is $\\approx 9x^2$; dividing the answer by $x^2$ as $x\\to 0$ gives $6+3=9$."
  },
  "lim-022": {
    "spot": "As $x\\to\\infty$, both $\\sqrt{x^2+3x}$ and $x$ go to infinity, so the difference is an $\\infty-\\infty$ form, and there is a root: multiply by the conjugate $\\sqrt{x^2+3x}+x$ to move the root into the denominator.",
    "why": "The conjugate turns the numerator into $(x^2+3x)-x^2=3x$, the same order as the denominator, so you can read off the ratio.",
    "steps": [
      "Multiply and divide by the conjugate: $\\sqrt{x^2+3x}-x=\\frac{(x^2+3x)-x^2}{\\sqrt{x^2+3x}+x}=\\frac{3x}{\\sqrt{x^2+3x}+x}$.",
      "Divide numerator and denominator by $x$ ($x>0$): $\\frac{3}{\\sqrt{1+\\frac{3}{x}}+1}$.",
      "As $x\\to\\infty$, $\\sqrt{1+\\frac{3}{x}}\\to 1$, so the limit is $\\frac{3}{1+1}=\\frac{3}{2}$."
    ],
    "trap": "Saying \"$\\sqrt{x^2+3x}\\approx x$, so the difference is $0$\". The $3x$ under the root contributes a constant gap of $\\frac{3}{2}$: $\\sqrt{x^2+3x}\\approx x+\\frac{3}{2}$.",
    "check": "At $x=1000$: $\\sqrt{1003000}-1000\\approx 1.4989$, close to $1.5$ and slightly below."
  },
  "lim-029": {
    "spot": "The numerator is degree four, the denominator degree two, and everything is an even power of $x,y$ and positive: the numerator is two degrees higher, so the bound $x^4+y^4\\le(x^2+y^2)^2$ squeezes it to $0$.",
    "why": "For a two-variable limit you can't just try a few paths (that only proves nonexistence); to prove it exists, use an inequality or polar coordinates to bound it by something depending only on $r$.",
    "steps": [
      "Upper bound: $x^4+y^4\\le x^4+2x^2y^2+y^4=(x^2+y^2)^2$.",
      "So $0\\le\\frac{x^4+y^4}{x^2+y^2}\\le x^2+y^2$.",
      "Polar coordinates make it clearer: $=r^2(\\cos^4\\theta+\\sin^4\\theta)$, where the bracket lies in $[\\frac{1}{2},1]$, so the whole thing $\\to 0$ as $r\\to 0$.",
      "Squeeze: $x^2+y^2\\to 0$, so the limit is $0$. Along the line $y=2x$ it indeed tends to $0$."
    ],
    "trap": "Trying only the $x$-axis and $y$-axis, getting $0$ both times, and concluding. Paths can only disprove a limit; to prove one you need a bound that doesn't depend on direction.",
    "check": "At the point $(0.01,0.01)$: $\\frac{2\\times 10^{-8}}{2\\times 10^{-4}}=10^{-4}$, smaller than $x^2+y^2=2\\times 10^{-4}$."
  },
  "ode-sep-003": {
    "spot": "$y'=y^2$ has only $y$ on the right: separable — move all the $y$ to the left to get $\\frac{dy}{y^2}=dx$.",
    "why": "After separating, both sides are basic integrals; the initial value $y(0)=1\\ne 0$, so dividing by $y^2$ is safe.",
    "steps": [
      "Separate: $\\frac{dy}{y^2}=dx$; integrating both sides gives $-\\frac{1}{y}=x+C$.",
      "Plug in the initial value $x=0$, $y=1$: $-1=C$.",
      "$-\\frac{1}{y}=x-1$, so $y=\\frac{1}{1-x}$ (defined for $x<1$).",
      "Substitute back: $y'=\\frac{1}{(1-x)^2}=y^2$, $y(0)=1$."
    ],
    "trap": "Getting the sign of the integral wrong, writing $\\frac{1}{y}=x+C$ and getting $y=\\frac{1}{x+1}$ — it equals $1$ at $x=0$, but $y'=-\\frac{1}{(x+1)^2}=-y^2$, the wrong sign.",
    "check": "The solution blows up as $x\\to 1^-$ (finite-time blow-up), the hallmark of $y'=y^2$ growing faster than exponential; that's why the problem restricts to $x<1$."
  },
  "si-set-003": {
    "spot": "A rational function can only be discontinuous where the denominator is zero: $x^2-3x+2=(x-1)(x-2)$ gives two candidates, regardless of whether the numerator cancels.",
    "why": "Cancelling to $\\frac{x+2}{x-1}$ makes $x=2$ look harmless, but the original function is not even defined at $x=2$; discontinuities must be judged on the original expression.",
    "steps": [
      "Factor the denominator: $x^2-3x+2=(x-1)(x-2)$, which is zero at $x=1$ and $x=2$, where the function is undefined.",
      "$x=2$: the numerator $x^2-4$ is also $0$; after cancelling, $\\frac{x+2}{x-1}\\to 4$, so it's a removable discontinuity — but still a discontinuity ($f(2)$ does not exist).",
      "$x=1$: the numerator is $-3\\ne 0$; the function shoots to $-\\infty$ on the left and $+\\infty$ on the right — an infinite discontinuity.",
      "At every other point the denominator is nonzero and the rational function is continuous. So the discontinuities are $\\{1,2\\}$."
    ],
    "trap": "Cancelling to $\\frac{x+2}{x-1}$ first and then looking for discontinuities, getting only $\\{1\\}$. Cancelling changes the domain — you filled in the hole at $x=2$ yourself.",
    "check": "Near $x=2$ the values are all close to $4$ (the height of the hole), but $x=2$ itself can't be plugged in: $\\frac{0}{0}$."
  },
  "si-int-021": {
    "spot": "Asking where the function increases means solving $f'(x)>0$; $f'(x)=1-2\\cos x$ reduces to $\\cos x<\\frac{1}{2}$, which within one period is a single middle stretch.",
    "why": "Picturing where $\\cos x$ meets $\\frac{1}{2}$ is fastest; no need to make a sign table for each piece.",
    "steps": [
      "$f'(x)=1-2\\cos x$.",
      "$f'(x)=0\\iff\\cos x=\\frac{1}{2}$, which in $(0,2\\pi)$ means $x=\\frac{\\pi}{3}$, $\\frac{5\\pi}{3}$.",
      "Between the two points (e.g. $x=\\pi$), $\\cos x=-1$ and $f'=3>0$; outside them (e.g. $x=0.5$, $x=6$), $\\cos x>\\frac{1}{2}$ and $f'<0$.",
      "So $f$ is increasing on $(\\frac{\\pi}{3},\\frac{5\\pi}{3})$."
    ],
    "trap": "Solving the inequality the wrong way round and getting the two pieces where $\\cos x>\\frac{1}{2}$, $(0,\\frac{\\pi}{3})\\cup(\\frac{5\\pi}{3},2\\pi)$ — those are the decreasing intervals.",
    "check": "Endpoint values: $f(\\frac{\\pi}{3})=\\frac{\\pi}{3}-\\sqrt{3}\\approx -0.68$ is the valley, $f(\\frac{5\\pi}{3})=\\frac{5\\pi}{3}+\\sqrt{3}\\approx 6.97$ is the peak, and it climbs all the way between."
  },
  "der-077": {
    "spot": "The absolute value of a complex number $a+bi$ is its distance from the origin in the plane: $1+i$ corresponds to the point $(1,1)$.",
    "why": "The Pythagorean theorem does it in one step; no need for polar form.",
    "steps": [
      "$|a+bi|=\\sqrt{a^2+b^2}$.",
      "$1+i$: $a=1$, $b=1$.",
      "$|1+i|=\\sqrt{1+1}=\\sqrt{2}$."
    ],
    "trap": "Squaring the $i$ of the imaginary part too: $1^2+i^2=0$, giving $0$. The distance formula uses the real number $b$, not $bi$.",
    "check": "Check with the conjugate: $|z|^2=z\\bar{z}=(1+i)(1-i)=1-i^2=2$."
  },
  "cx-sa-001": {
    "spot": "Surface area of revolution about the $x$-axis: $S=\\int 2\\pi y\\sqrt{1+(y')^2}\\,dx$; $y=3x$ is a line, so the arc length factor $\\sqrt{1+9}$ is constant.",
    "why": "A line rotated about the axis gives the lateral surface of a cone, so you can use the formula and also check with $\\pi r\\ell$.",
    "steps": [
      "$y'=3$, $\\sqrt{1+(y')^2}=\\sqrt{10}$.",
      "$S=\\int_0^4 2\\pi\\cdot 3x\\cdot\\sqrt{10}\\,dx=6\\sqrt{10}\\,\\pi\\int_0^4 x\\,dx$.",
      "$S=6\\sqrt{10}\\,\\pi\\cdot 8=48\\sqrt{10}\\,\\pi\\approx 476.9$."
    ],
    "trap": "Dropping the arc length factor and using $\\int 2\\pi y\\,dx$ to get $48\\pi$; that treats the slanted side as if it were horizontal, missing the factor $\\sqrt{10}$.",
    "check": "Cone lateral area $\\pi r\\ell$: base radius $r=12$, slant height $\\ell=\\sqrt{4^2+12^2}=4\\sqrt{10}$, $\\pi\\cdot 12\\cdot 4\\sqrt{10}=48\\sqrt{10}\\,\\pi$."
  },
  "db-inv-001": {
    "spot": "The derivative of the inverse function at $2$ is asked, and $f$ is a cubic whose inverse can't be written down: use $(f^{-1})'(b)=\\frac{1}{f'(a)}$ where $f(a)=b$.",
    "why": "No need to solve a cubic for $f^{-1}$; you only need the $a$ with $f(a)=2$, and $a=1$ is obvious.",
    "steps": [
      "Find $a$: $f(a)=a^3+a=2$; try $a=1$: $1+1=2$. ($f'=3x^2+1>0$, so $f$ is strictly increasing and this is the only one.)",
      "$f'(x)=3x^2+1$, $f'(1)=4$.",
      "$(f^{-1})'(2)=\\frac{1}{f'(1)}=\\frac{1}{4}$."
    ],
    "trap": "Plugging in the wrong point: computing $\\frac{1}{f'(2)}=\\frac{1}{13}$. The formula needs the derivative of $f$ at the preimage $a$; $2$ is an output of $f$, not an input.",
    "check": "Secant estimate: $f(1.001)\\approx 2.004$, so as $f^{-1}$ goes from $2$ to $2.004$ its value moves only $0.001$ — slope about $\\frac{1}{4}$."
  },
  "db-par-001": {
    "spot": "Parametric $x(t)$, $y(t)$: $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$ — divide the two $t$-derivatives, then plug in $t=1$.",
    "why": "Eliminating $t$ to get $y=x^{3/2}$ also works, but the parametric formula is direct and avoids worrying about the $t<0$ branch.",
    "steps": [
      "$\\frac{dx}{dt}=2t$, $\\frac{dy}{dt}=3t^2$.",
      "$\\frac{dy}{dx}=\\frac{3t^2}{2t}=\\frac{3t}{2}$.",
      "$t=1$: $\\frac{3}{2}$."
    ],
    "trap": "Flipping it upside down: $\\frac{dx/dt}{dy/dt}=\\frac{2}{3}$. Memory aid: the numerator of $\\frac{dy}{dx}$ is $y$.",
    "check": "Eliminate $t$: for $t>0$, $y=x^{3/2}$, whose derivative at $x=1$ is $\\frac{3}{2}x^{1/2}=\\frac{3}{2}$."
  },
  "ap-cen-001": {
    "spot": "Centroid $\\bar{x}=\\frac{\\int x\\,(\\text{height})\\,dx}{\\int(\\text{height})\\,dx}$; the region lies under $y=x^2$, so the height is $x^2$.",
    "why": "Just two power-function integrals and one division; no need to compute $\\bar{y}$ first.",
    "steps": [
      "Area $A=\\int_0^1 x^2\\,dx=\\frac{1}{3}$.",
      "Moment about the $y$-axis $M_y=\\int_0^1 x\\cdot x^2\\,dx=\\frac{1}{4}$.",
      "$\\bar{x}=\\frac{M_y}{A}=\\frac{1/4}{1/3}=\\frac{3}{4}$."
    ],
    "trap": "Forgetting to divide by the area and answering $\\frac{1}{4}$; or using the plain average $\\frac{1}{2}$ (the interval's midpoint), ignoring that the right side is taller and heavier.",
    "check": "The region's mass is concentrated on the right ($x^2$ is tallest near $x=1$), so $\\bar{x}$ should be above the midpoint $\\frac{1}{2}$ and below $1$."
  },
  "burst-int-011": {
    "spot": "$\\ln\\sin x$ on $[0,\\frac{\\pi}{2}]$: no elementary antiderivative, but the symmetry $x\\mapsto\\frac{\\pi}{2}-x$ swaps $\\sin$ for $\\cos$, and adding them gives $\\ln(\\sin x\\cos x)=\\ln\\frac{\\sin 2x}{2}$, which loops back to itself.",
    "why": "This is the classic \"use symmetry to make the integral equal itself\": set up the equation $2I=I-\\frac{\\pi}{2}\\ln 2$ and solve.",
    "steps": [
      "Let $I=\\int_0^{\\pi/2}\\ln\\sin x\\,dx$. Substituting $x\\mapsto\\frac{\\pi}{2}-x$ gives $I=\\int_0^{\\pi/2}\\ln\\cos x\\,dx$.",
      "Add: $2I=\\int_0^{\\pi/2}\\ln(\\sin x\\cos x)\\,dx=\\int_0^{\\pi/2}\\ln\\sin 2x\\,dx-\\frac{\\pi}{2}\\ln 2$.",
      "Substitute $u=2x$: $\\int_0^{\\pi/2}\\ln\\sin 2x\\,dx=\\frac{1}{2}\\int_0^{\\pi}\\ln\\sin u\\,du=\\frac{1}{2}\\cdot 2I=I$ ($\\sin$ on $[0,\\pi]$ is symmetric about $\\frac{\\pi}{2}$).",
      "So $2I=I-\\frac{\\pi}{2}\\ln 2$, and $I=-\\frac{\\pi}{2}\\ln 2\\approx -1.089$."
    ],
    "trap": "In step three, replacing $\\int_0^{\\pi/2}\\ln\\sin 2x\\,dx$ with $\\frac{1}{2}\\int_0^{\\pi/2}\\ln\\sin u\\,du$ — after substituting, the upper limit must become $\\pi$; otherwise you get the wrong equation $\\frac{3}{2}I=-\\frac{\\pi}{2}\\ln 2$.",
    "check": "$0<\\sin x\\le 1$, so $\\ln\\sin x\\le 0$ and the integral must be negative; near $x=0$, $\\ln\\sin x\\approx\\ln x$ is integrable, so the answer is finite."
  },
  "burst-int-042": {
    "spot": "A polynomial $x^2$ times $\\ln(1+x)$: differentiating $\\ln$ gives a rational function — the standard integration by parts pairing; let $\\ln$ be $u$.",
    "why": "Once $\\ln(1+x)$ is differentiated away, what's left is $\\frac{x^3}{1+x}$, which long division handles; the other way round, differentiating $x^2$ only makes the $\\ln$ integrals messier.",
    "steps": [
      "$u=\\ln(1+x)$, $dv=x^2dx$: $du=\\frac{dx}{1+x}$, $v=\\frac{x^3}{3}$.",
      "$\\int x^2\\ln(1+x)\\,dx=\\frac{x^3}{3}\\ln(1+x)-\\frac{1}{3}\\int\\frac{x^3}{1+x}\\,dx$.",
      "Long division: $\\frac{x^3}{1+x}=x^2-x+1-\\frac{1}{1+x}$.",
      "Integrate: $\\int\\frac{x^3}{1+x}\\,dx=\\frac{x^3}{3}-\\frac{x^2}{2}+x-\\ln(1+x)$.",
      "Multiply by $-\\frac{1}{3}$ and combine: $\\frac{x^3\\ln(1+x)}{3}-\\frac{x^3}{9}+\\frac{x^2}{6}-\\frac{x}{3}+\\frac{\\ln(1+x)}{3}+C$."
    ],
    "trap": "Dropping the remainder $-\\frac{1}{1+x}$ in the long division, so the last term $\\frac{\\ln(1+x)}{3}$ goes missing; differentiating back leaves you off by $\\frac{1}{3(1+x)}$.",
    "check": "The answer is $0$ at $x=0$, and for small $x$, $x^2\\ln(1+x)\\approx x^3$, so the antiderivative should be $\\approx\\frac{x^4}{4}$."
  },
  "cx-mvt-004": {
    "spot": "$f(1)=f(3)=0$, the endpoints are at the same height: Rolle's Theorem guarantees a horizontal tangent in between; just solve $f'(c)=0$.",
    "why": "A parabola's horizontal tangent is at its vertex, on the axis of symmetry $x=2$ — exactly the midpoint of the interval, so the two can confirm each other.",
    "steps": [
      "Check the conditions: $f$ is a polynomial, so continuous and differentiable; $f(1)=1-4+3=0$, $f(3)=9-12+3=0$.",
      "$f'(x)=2x-4$.",
      "$f'(c)=0\\Rightarrow c=2$, which is in $(1,3)$."
    ],
    "trap": "Mixing up the Mean Value Theorem's $\\frac{f(3)-f(1)}{3-1}$ with Rolle's Theorem and computing something else; here the endpoints are at equal height, so that ratio is $0$ anyway.",
    "check": "The vertex of $f(x)=(x-1)(x-3)$ is at the midpoint of the roots, $\\frac{1+3}{2}=2$."
  },
  "db-ext-003": {
    "spot": "Maximum on a closed interval: compare critical points and the two endpoints. The derivative of $xe^{-x}$, $e^{-x}(1-x)$, is zero only at $x=1$.",
    "why": "A continuous function on a closed interval always has a maximum, and it can only occur at a critical point or an endpoint — list them and compare; no need to check concavity.",
    "steps": [
      "$f'(x)=e^{-x}-xe^{-x}=e^{-x}(1-x)$.",
      "Critical point $x=1$ ($e^{-x}$ is never zero): $f(1)=e^{-1}\\approx 0.368$.",
      "Endpoints: $f(0)=0$, $f(3)=3e^{-3}\\approx 0.149$.",
      "The largest of the three is $f(1)=\\frac{1}{e}$."
    ],
    "trap": "Answering with the location of the maximum, $x=1$, when the problem asks for the maximum value $f(1)=\\frac{1}{e}$; or forgetting to check the endpoints.",
    "check": "$f'$ is positive left of $1$ and negative right of it — a peak; nearby points are both below $\\frac{1}{e}$."
  },
  "db-mot-002": {
    "spot": "Given position $s(t)$, asked for acceleration: acceleration is the second derivative of position, so differentiate twice and plug in $t=4$.",
    "why": "Just differentiate the polynomial; no need to find when the velocity is zero or anything like that.",
    "steps": [
      "Velocity $v(t)=s'(t)=3t^2-12t+9$.",
      "Acceleration $a(t)=v'(t)=6t-12$.",
      "$a(4)=24-12=12$."
    ],
    "trap": "Differentiating only once and plugging in $t=4$, answering with the velocity $v(4)=48-48+9=9$.",
    "check": "$a(t)=6t-12$ is zero at $t=2$ (the inflection point of $s$); $t=4$ is to its right, so the acceleration is positive."
  },
  "dd-lin-005": {
    "spot": "\"Estimate the error with differentials\": $\\Delta V\\approx V'(s)\\,\\Delta s$. Volume $V=s^3$, $V'=3s^2$.",
    "why": "The error is small ($0.02$ against $5$), so linear approximation is accurate enough; computing $5.02^3-5^3$ directly also works but the numbers are uglier.",
    "steps": [
      "$V=s^3$, $dV=3s^2\\,ds$.",
      "$s=5$: $3s^2=75$.",
      "$dV=75\\times 0.02=1.5$ cubic cm."
    ],
    "trap": "Using the surface area $6s^2$ as the derivative and getting $3$; or using $s^2$ without the factor $3$ and getting $0.5$.",
    "check": "The true change $5.02^3-125=1.506008$ differs from the estimate $1.5$ by only $0.006$ (the second-order term $3s(\\Delta s)^2$)."
  },
  "dd-rr-003": {
    "spot": "Given the rate of change of volume, asked for the rate of change of radius: write $V=\\frac{4}{3}\\pi r^3$ and differentiate both sides in time; $\\frac{dV}{dt}$ and $\\frac{dr}{dt}$ are linked by $4\\pi r^2$.",
    "why": "The standard related rates routine: find the geometric relation, differentiate in $t$, plug in the current values.",
    "steps": [
      "$V=\\frac{4}{3}\\pi r^3$, $\\frac{dV}{dt}=4\\pi r^2\\frac{dr}{dt}$.",
      "$r=5$: $4\\pi r^2=100\\pi$ (the sphere's surface area).",
      "$100=100\\pi\\cdot\\frac{dr}{dt}$, so $\\frac{dr}{dt}=\\frac{1}{\\pi}\\approx 0.318$ cm/s."
    ],
    "trap": "Plugging in $r=5$ before differentiating: $V$ becomes a constant and its derivative is $0$. Always differentiate first and plug in the current values last.",
    "check": "Surface area $100\\pi$ times the radius growth rate $\\frac{1}{\\pi}$ is exactly $100$ cubic cm per second — thin shell volume $\\approx$ surface area times thickness."
  },
  "dd-rr-014": {
    "spot": "The surface area $S=6s^2$ is changing and the rate of change of the edge is asked: differentiate in time to get $\\frac{dS}{dt}=12s\\frac{ds}{dt}$.",
    "why": "Standard related rates: write the relation between $S$ and $s$, differentiate in $t$, and only then plug in $s=4$.",
    "steps": [
      "$S=6s^2$, $\\frac{dS}{dt}=12s\\frac{ds}{dt}$.",
      "$s=4$: $12s=48$.",
      "$0.5=48\\frac{ds}{dt}$, $\\frac{ds}{dt}=\\frac{1}{96}$ cm/s."
    ],
    "trap": "Using the area of a single face $s^2$ and getting $\\frac{0.5}{8}=\\frac{1}{16}$, six times too large. A cube has six faces.",
    "check": "Reverse it: with the edge growing $\\frac{1}{96}$ per second, $12\\cdot 4\\cdot\\frac{1}{96}=0.5$, so the surface area grows $0.5$ per second."
  },
  "depth-der-017": {
    "spot": "Every two derivatives turn $\\cos(3x)$ into $-9\\cos(3x)$: the fourth derivative is $(-9)^2=81$ times itself; then plug in $x=0$.",
    "why": "Using the periodic pattern is faster than differentiating one step at a time; you can also read the $x^4$ coefficient $\\frac{81}{24}$ of the Taylor series and multiply by $4!$.",
    "steps": [
      "$\\frac{d^2}{dx^2}\\cos 3x=-9\\cos 3x$ (each derivative adds a factor $3$, and two of them bring a minus sign).",
      "Two more: $\\frac{d^2}{dx^2}(-9\\cos 3x)=81\\cos 3x$.",
      "Plug in $x=0$: $81\\cos 0=81$."
    ],
    "trap": "Sign error: the fourth derivative goes all the way around $\\cos\\to-\\sin\\to-\\cos\\to\\sin\\to\\cos$ and is positive; answering $-81$ means you applied the minus sign only once.",
    "check": "Taylor series $\\cos 3x=1-\\frac{(3x)^2}{2}+\\frac{(3x)^4}{24}-\\cdots$: the $x^4$ coefficient is $\\frac{81}{24}$, times $4!$ gives $81$."
  },
  "depth-int-014": {
    "spot": "$x$ times $\\ln(1+x)$: polynomial times log — integrate by parts with $\\ln$ as $u$, and handle the leftover $\\frac{x^2}{1+x}$ by long division.",
    "why": "Differentiating $\\ln(1+x)$ gives a rational function right away; integrating $\\ln$ instead only gets harder.",
    "steps": [
      "$u=\\ln(1+x)$, $dv=x\\,dx$: $du=\\frac{dx}{1+x}$, $v=\\frac{x^2}{2}$.",
      "$\\int x\\ln(1+x)\\,dx=\\frac{x^2}{2}\\ln(1+x)-\\frac{1}{2}\\int\\frac{x^2}{1+x}\\,dx$.",
      "Long division: $\\frac{x^2}{1+x}=x-1+\\frac{1}{1+x}$, which integrates to $\\frac{x^2}{2}-x+\\ln(1+x)$.",
      "Combine: $\\frac{x^2\\ln(1+x)}{2}-\\frac{x^2}{4}+\\frac{x}{2}-\\frac{\\ln(1+x)}{2}+C$."
    ],
    "trap": "Writing the long-division remainder as $-\\frac{1}{1+x}$ (wrong sign): $x^2=(x-1)(x+1)+1$, so the remainder is $+1$. Getting it wrong turns the last term into $+\\frac{\\ln(1+x)}{2}$.",
    "check": "It can also be written $\\frac{(x^2-1)\\ln(1+x)}{2}-\\frac{x^2}{4}+\\frac{x}{2}$; it is $0$ at $x=0$, and for small $x$ it is $\\approx\\frac{x^3}{3}$ (since the integrand is $\\approx x^2$)."
  },
  "depth-int-022": {
    "spot": "The inner integral runs in $x$ from $y$ to $1$, the outer in $y$ from $0$ to $1$: the region is the triangle $0\\le y\\le x\\le 1$, and you can just integrate in the given order.",
    "why": "The inner $\\int_y^1 x\\,dx$ is a basic power; no need to switch the order, though switching is a good check.",
    "steps": [
      "Inner: $\\int_y^1 x\\,dx=\\frac{x^2}{2}\\Big|_y^1=\\frac{1-y^2}{2}$.",
      "Outer: $\\int_0^1\\frac{1-y^2}{2}\\,dy=\\frac{1}{2}\\left(1-\\frac{1}{3}\\right)=\\frac{1}{3}$.",
      "Check by switching the order: region $0\\le y\\le x$, integrate $y$ first: $\\int_0^1\\int_0^x x\\,dy\\,dx=\\int_0^1 x^2\\,dx=\\frac{1}{3}$."
    ],
    "trap": "Swapping the inner limits, getting $\\frac{y^2-1}{2}$ and finally $-\\frac{1}{3}$; the integrand $x\\ge 0$, so the answer cannot be negative.",
    "check": "The triangle has area $\\frac{1}{2}$, and the average of $x$ over it is $\\frac{2}{3}$ (the centroid's $x$-coordinate): $\\frac{1}{2}\\cdot\\frac{2}{3}=\\frac{1}{3}$."
  },
  "depth-lim-010": {
    "spot": "$x\\to 0$: the numerator $1-\\cos x\\approx\\frac{x^2}{2}$ and the denominator $x\\sin x\\approx x^2$ are both second-order small, so the limit is the ratio of leading coefficients.",
    "why": "Replacing with equivalent infinitesimals settles it in one line; L'Hôpital's Rule needs two rounds.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "$1-\\cos x\\sim\\frac{x^2}{2}$.",
      "$x\\sin x\\sim x\\cdot x=x^2$.",
      "Ratio $\\frac{x^2/2}{x^2}=\\frac{1}{2}$."
    ],
    "trap": "Remembering $1-\\cos x$ as $\\sim x^2$ (missing the $\\frac{1}{2}$) and answering $1$.",
    "check": "At $x=0.01$: $\\frac{1-\\cos 0.01}{0.01\\sin 0.01}\\approx 0.500008$."
  },
  "depth-ser-011": {
    "spot": "$\\frac{1}{(1-u)^2}$ is the derivative of the geometric series $\\frac{1}{1-u}$: the coefficients are $n+1$. Here $u=2x$, so the $n$-th term is $(n+1)2^nx^n$.",
    "why": "One derivative of the known geometric series gives the whole series; no need to compute a fifth derivative.",
    "steps": [
      "$\\frac{1}{1-u}=\\sum u^n$; differentiate: $\\frac{1}{(1-u)^2}=\\sum_{n\\ge 0}(n+1)u^n$ ($|u|<1$).",
      "Substitute $u=2x$: $\\frac{1}{(1-2x)^2}=\\sum(n+1)2^nx^n$.",
      "$n=5$: $(5+1)\\cdot 2^5=6\\cdot 32=192$."
    ],
    "trap": "Forgetting that $u=2x$ raises the $2$ to the fifth power too and answering $6$; or using $n$ instead of $n+1$ and answering $5\\cdot 32=160$.",
    "check": "Fifth derivative divided by $5!$: $\\frac{d^5}{dx^5}(1-2x)^{-2}=6!\\cdot 2^5(1-2x)^{-7}$; at $0$, dividing by $5!$ gives $6\\cdot 32$."
  },
  "depth-ser-015": {
    "spot": "A product of two known series, and only the $x^3$ coefficient is needed: expand $e^x$ and $\\ln(1+x)$ up to $x^3$ and pick the pairs whose degrees add to $3$.",
    "why": "The Cauchy product needs just three pairs; differentiating three times with the Product Rule gets messy.",
    "steps": [
      "$e^x=1+x+\\frac{x^2}{2}+\\cdots$, $\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$.",
      "Pairs for $x^3$: $1\\cdot\\frac{x^3}{3}$, $x\\cdot(-\\frac{x^2}{2})$, $\\frac{x^2}{2}\\cdot x$.",
      "Lower terms along the way: the $x$ coefficient is $1$, the $x^2$ coefficient is $-\\frac{1}{2}+1=\\frac{1}{2}$.",
      "$x^3$ coefficient $=\\frac{1}{3}-\\frac{1}{2}+\\frac{1}{2}=\\frac{1}{3}$."
    ],
    "trap": "Missing the pair $\\frac{x^2}{2}\\cdot x$ and getting $\\frac{1}{3}-\\frac{1}{2}=-\\frac{1}{6}$. In a product you must list every combination whose degrees add to $3$.",
    "check": "$\\frac{d^3}{dx^3}[e^x\\ln(1+x)]$ at $0$ should be $3!\\cdot\\frac{1}{3}=2$; estimating it with a difference quotient of second derivatives agrees."
  },
  "depth-ser-020": {
    "spot": "Coefficients $\\frac{2^n}{n^2}$: the exponential part $2^n$ decides everything, and $n^2$ doesn't affect the radius. Use the Ratio Test, and note it is $(x+1)^n$, centered at $-1$.",
    "why": "The Ratio Test limit is clean ($\\frac{n^2}{(n+1)^2}\\to 1$), and the Root Test also gives $2$; the radius depends only on the exponential part.",
    "steps": [
      "Coefficient ratio: $\\frac{a_{n+1}}{a_n}=\\frac{2^{n+1}/(n+1)^2}{2^n/n^2}=2\\cdot\\frac{n^2}{(n+1)^2}$.",
      "As $n\\to\\infty$ the ratio $\\to 2$.",
      "Radius of convergence $R=\\frac{1}{2}$ (centered at $-1$, interval $|x+1|<\\frac{1}{2}$)."
    ],
    "trap": "Thinking $\\frac{1}{n^2}$ enlarges the radius, or taking the center as $0$ when giving the interval of convergence; the radius depends only on $\\lim|a_n|^{1/n}=2$, since $n^{2/n}\\to 1$.",
    "check": "On the boundary $|x+1|=\\frac{1}{2}$ the terms become $\\frac{1}{n^2}$ and the series converges (at both endpoints), but any farther out, $\\frac{(2r)^n}{n^2}$ diverges."
  },
  "exam-multi-002": {
    "spot": "Take the mixed partial of the two terms separately: $x^2y^3$ is a separable power (differentiate each factor), while $e^{xy}$ differentiated in $y$ drops out an $x$, and then differentiating in $x$ needs the Product Rule.",
    "why": "Partial derivatives are linear, so handle the terms separately; for smooth functions the mixed partial doesn't depend on the order.",
    "steps": [
      "$\\frac{\\partial}{\\partial y}(x^2y^3)=3x^2y^2$, then in $x$: $6xy^2$.",
      "$\\frac{\\partial}{\\partial y}e^{xy}=xe^{xy}$.",
      "Differentiate $xe^{xy}$ in $x$ (Product Rule): $e^{xy}+xye^{xy}=(1+xy)e^{xy}$.",
      "Add: $6xy^2+(1+xy)e^{xy}$."
    ],
    "trap": "In step three, dropping the Product Rule's $e^{xy}$ and writing only $xye^{xy}$; at the origin you'd answer $0$, but the correct value is $1$.",
    "check": "Switching the order ($x$ first, then $y$) gives the same expression (Clairaut); its value at the origin is $1$."
  },
  "exam-multi-007": {
    "spot": "$r=2\\cos\\theta$ is a circle through the origin (in rectangular form $(x-1)^2+y^2=1$) of radius $1$; with the polar area $\\frac{1}{2}\\int r^2\\,d\\theta$, $\\theta$ only needs to sweep $[-\\frac{\\pi}{2},\\frac{\\pi}{2}]$ for one full loop.",
    "why": "Recognizing the circle you can write $\\pi\\cdot 1^2$ directly; with the formula, the key is the range of $\\theta$ — sweeping too far counts area twice.",
    "steps": [
      "Multiply $r=2\\cos\\theta$ by $r$: $x^2+y^2=2x$, i.e. $(x-1)^2+y^2=1$, center $(1,0)$, radius $1$.",
      "$r\\ge 0$ requires $\\cos\\theta\\ge 0$, and $\\theta\\in[-\\frac{\\pi}{2},\\frac{\\pi}{2}]$ traces the circle exactly once.",
      "Area $=\\frac{1}{2}\\int_{-\\pi/2}^{\\pi/2}4\\cos^2\\theta\\,d\\theta=\\int_{-\\pi/2}^{\\pi/2}2\\cos^2\\theta\\,d\\theta=\\pi$."
    ],
    "trap": "Integrating $\\theta$ from $0$ to $2\\pi$: $r=2\\cos\\theta$ already traces the full circle on $[0,\\pi]$, so sweeping $2\\pi$ goes around twice and gives $2\\pi$.",
    "check": "A circle of radius $1$ has area $\\pi$; the wrong integral over $0$ to $2\\pi$ is exactly double."
  },
  "lx-con-001": {
    "spot": "A piecewise function continuous at the seam $x=2$: the left formula's value at $2$ must equal the right formula's limit. Only the left piece contains $a$, so one equation solves for $a$.",
    "why": "Both pieces are polynomials and continuous on their own; the only thing to check is that left and right line up at the seam.",
    "steps": [
      "$f(2)$ uses the left piece ($x\\le 2$): $4+a$.",
      "Right-hand limit: $\\lim_{x\\to 2^+}(3x-4)=2$.",
      "Continuity requires $4+a=2$, so $a=-2$."
    ],
    "trap": "Plugging $2$ into the wrong piece, or flipping the sign when solving $a=2-4$ and answering $2$; substituting back, $4+2=6\\ne 2$ shows it's wrong.",
    "check": "With $a=-2$, the left piece $x^2-2$ at $x=1.999$ is about $1.996$ and the right piece at $2.001$ is about $2.003$; both hug $2$."
  },
  "lx-der-001": {
    "spot": "The shape $\\frac{f(3+h)-f(3)}{h}$, with $81=3^4$: this is the definition of the derivative of $f(x)=x^4$ at $x=3$.",
    "why": "Recognizing the derivative definition saves you from expanding $(3+h)^4$; just plug $3$ into $4x^3$.",
    "steps": [
      "$f(x)=x^4$, $f(3)=81$, so the limit is $f'(3)$.",
      "$f'(x)=4x^3$.",
      "$f'(3)=4\\cdot 27=108$."
    ],
    "trap": "Thinking the numerator is $0$ as $h\\to 0$ and answering $0$; the denominator is $0$ too — it's a $\\frac{0}{0}$ form, so you need their ratio.",
    "check": "Binomial expansion: $(3+h)^4-81=108h+54h^2+12h^3+h^4$; after dividing by $h$ the constant term is $108$."
  },
  "mob-wallis-006": {
    "spot": "An even power of $\\cos$ on $\\int_0^{\\pi/2}$: Wallis' formula $\\frac{(n-1)!!}{n!!}\\cdot\\frac{\\pi}{2}$; for $n=4$ that is $\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}$.",
    "why": "Power-reduction identities need two rounds of expanding; Wallis is one line.",
    "steps": [
      "Reduction formula: $\\int_0^{\\pi/2}\\cos^nx\\,dx=\\frac{n-1}{n}\\int_0^{\\pi/2}\\cos^{n-2}x\\,dx$. For $n=4$: $\\frac{3}{4}\\int\\cos^2$.",
      "$\\int_0^{\\pi/2}\\cos^2x\\,dx=\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{4}$.",
      "$\\frac{3}{4}\\cdot\\frac{\\pi}{4}=\\frac{3\\pi}{16}$."
    ],
    "trap": "Forgetting the factor $\\frac{\\pi}{2}$ for an even power (only odd powers lack it) and answering $\\frac{3}{8}$.",
    "check": "The average of $\\cos^4$ on $[0,\\frac{\\pi}{2}]$ is $\\frac{3}{8}$ ($\\cos^4=\\frac{3}{8}+\\frac{\\cos 2x}{2}+\\frac{\\cos 4x}{8}$, and the last two terms integrate to zero here); multiply by the interval length $\\frac{\\pi}{2}$."
  },
  "mob-wallis-007": {
    "spot": "$\\sin^2x\\cos^2x=\\left(\\frac{\\sin 2x}{2}\\right)^2$: the double-angle identity folds the product into a single $\\sin^2 2x$.",
    "why": "Shorter than Wallis' mixed formula or two rounds of power reduction.",
    "steps": [
      "$\\sin x\\cos x=\\frac{\\sin 2x}{2}$, so $\\sin^2x\\cos^2x=\\frac{\\sin^2 2x}{4}$.",
      "$\\int_0^{\\pi/2}\\sin^2 2x\\,dx$: $\\sin^2$ averages $\\frac{1}{2}$ over a full half-period, giving $\\frac{\\pi}{4}$.",
      "Divide by $4$: $\\frac{\\pi}{16}$."
    ],
    "trap": "Thinking $\\sin^2x\\cos^2x=\\sin^2 2x$, forgetting to divide by $4$, and answering $\\frac{\\pi}{4}$.",
    "check": "Wallis' mixed formula: $\\int_0^{\\pi/2}\\sin^2\\cos^2=\\frac{1\\cdot 1}{4\\cdot 2}\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{16}$."
  },
  "mob-wallis-008": {
    "spot": "A first power of $\\sin$; the antiderivative is $-\\cos x$: just plug in the limits.",
    "why": "A basic integral; Wallis' formula for odd $n=1$ also gives $\\frac{0!!}{1!!}=1$.",
    "steps": [
      "$\\int\\sin x\\,dx=-\\cos x$.",
      "Plug in the limits: $-\\cos\\frac{\\pi}{2}-(-\\cos 0)=0+1$.",
      "$\\int_0^{\\pi/2}\\sin x\\,dx=1$."
    ],
    "trap": "Writing the antiderivative as $\\cos x$ (missing the minus sign) and getting $-1$; $\\sin x$ is positive here, so the area can't be negative.",
    "check": "On $[0,\\frac{\\pi}{2}]$ the curve lies between the line $\\frac{2}{\\pi}x$ and $1$, so the area should be between $\\frac{\\pi}{4}\\approx 0.785$ and $\\frac{\\pi}{2}$."
  },
  "putnam-007": {
    "spot": "The denominator $n^4+n^2+1$ factors as $(n^2+n+1)(n^2-n+1)$, and the two factors differ by $2n$, exactly twice the numerator; better still, $n^2+n+1$ is the next term's $(n+1)^2-(n+1)+1$ — it telescopes.",
    "why": "Factoring the denominator so adjacent terms cancel is more direct than any comparison test: it doesn't just prove convergence, it gives the value.",
    "steps": [
      "Complete the square: $n^4+n^2+1=(n^2+1)^2-n^2=(n^2-n+1)(n^2+n+1)$.",
      "Partial fractions: $\\frac{n}{n^4+n^2+1}=\\frac{1}{2}\\left(\\frac{1}{n^2-n+1}-\\frac{1}{n^2+n+1}\\right)$.",
      "Let $g(n)=\\frac{1}{n^2-n+1}$; then $\\frac{1}{n^2+n+1}=g(n+1)$. Each term is $\\frac{1}{2}[g(n)-g(n+1)]$.",
      "Telescoping: partial sum $=\\frac{1}{2}[g(1)-g(N+1)]\\to\\frac{1}{2}g(1)=\\frac{1}{2}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ in the partial fractions (the two factors differ by $2n$, not $n$) and answering $1$.",
    "check": "The first term $\\frac{1}{3}$ is already most of it, and the rest $\\frac{2}{21}+\\frac{3}{91}+\\cdots$ keeps shrinking; a total of $\\frac{1}{2}$ is reasonable."
  },
  "rel-boss-005": {
    "spot": "$x^{a-1}(1-x)^{b-1}$ on $[0,1]$ with $a=\\frac{1}{2}$, $b=\\frac{5}{2}$: the Beta function $B(\\frac{1}{2},\\frac{5}{2})$; alternatively substitute $x=\\sin^2\\theta$ to get a Wallis integral.",
    "why": "Half-integer Gamma values all follow from $\\Gamma(\\frac{1}{2})=\\sqrt{\\pi}$, so it's three values and a division; the trigonometric substitution is the same thing from another angle, useful as a check.",
    "steps": [
      "$B(\\frac{1}{2},\\frac{5}{2})=\\frac{\\Gamma(\\frac{1}{2})\\Gamma(\\frac{5}{2})}{\\Gamma(3)}$, with $\\Gamma(\\frac{5}{2})=\\frac{3}{2}\\cdot\\frac{1}{2}\\sqrt{\\pi}=\\frac{3\\sqrt{\\pi}}{4}$ and $\\Gamma(3)=2$.",
      "$B=\\frac{\\sqrt{\\pi}\\cdot\\frac{3\\sqrt{\\pi}}{4}}{2}=\\frac{3\\pi}{8}$.",
      "Check with a trigonometric substitution: $x=\\sin^2\\theta$, $dx=2\\sin\\theta\\cos\\theta\\,d\\theta$, and the integrand becomes $\\frac{\\cos^3\\theta}{\\sin\\theta}\\cdot 2\\sin\\theta\\cos\\theta=2\\cos^4\\theta$.",
      "$\\int_0^{\\pi/2}2\\cos^4\\theta\\,d\\theta=2\\cdot\\frac{3\\pi}{16}=\\frac{3\\pi}{8}$."
    ],
    "trap": "Misreading the parameters: $x^{-1/2}$ means $a-1=-\\frac{1}{2}$, so $a=\\frac{1}{2}$, not $-\\frac{1}{2}$; $(1-x)^{3/2}$ means $b=\\frac{5}{2}$, not $\\frac{3}{2}$. The latter mistake gives $B(\\frac{1}{2},\\frac{3}{2})=\\frac{\\pi}{2}$.",
    "check": "$(1-x)^{3/2}\\le 1$, so the integral is $\\le\\int_0^1 x^{-1/2}\\,dx=2$; $\\frac{3\\pi}{8}\\approx 1.178$ is within range."
  },
  "rel-hard-der-001": {
    "spot": "Wronskian $W(f,g)=fg'-f'g$: both functions carry $e^x$, so after multiplying, $e^{2x}$ factors out entirely.",
    "why": "Expanding the $2\\times 2$ determinant directly is fastest; the result $e^{2x}$ is never zero, which also shows the two are linearly independent.",
    "steps": [
      "$f=e^x$, $f'=e^x$; $g=xe^x$, $g'=(1+x)e^x$.",
      "$W=fg'-f'g=e^x(1+x)e^x-e^x\\cdot xe^x=e^{2x}$.",
      "$x=0$: $W=e^0=1$."
    ],
    "trap": "Writing the determinant as $f'g-fg'$ (reversed order) and getting $-1$. The convention is functions in the first row, derivatives in the second: $W=fg'-f'g$.",
    "check": "They are two solutions of $y''-2y'+y=0$ (double root $1$), and Abel's formula says $W=Ce^{2x}$; at $x=0$ directly, $f(0)g'(0)-f'(0)g(0)=1\\cdot 1-1\\cdot 0=1$."
  },
  "uni-int-014": {
    "spot": "Denominator $(1+x^2)^2$: $x=\\tan\\theta$ makes $1+x^2=\\sec^2\\theta$, which cancels once against $dx=\\sec^2\\theta\\,d\\theta$, leaving $\\cos^2\\theta$.",
    "why": "The trigonometric substitution turns a rational function into the Wallis-type $\\int_0^{\\pi/2}\\cos^2$, shorter than partial fractions or integration by parts.",
    "steps": [
      "$x=\\tan\\theta$: $x$ from $0$ to $\\infty$ corresponds to $\\theta$ from $0$ to $\\frac{\\pi}{2}$; $\\frac{dx}{(1+x^2)^2}=\\frac{\\sec^2\\theta}{\\sec^4\\theta}\\,d\\theta=\\cos^2\\theta\\,d\\theta$.",
      "$\\int_0^{\\pi/2}\\cos^2\\theta\\,d\\theta=\\frac{\\pi}{4}$ (average value $\\frac{1}{2}$ times length $\\frac{\\pi}{2}$).",
      "So $\\int_0^\\infty\\frac{dx}{(1+x^2)^2}=\\frac{\\pi}{4}$."
    ],
    "trap": "Cancelling one $\\sec^2$ and thinking $1$ is left, getting $\\frac{\\pi}{2}$ (the answer for $\\int\\frac{dx}{1+x^2}$). The extra $\\sec^2$ from the square becomes $\\cos^2$.",
    "check": "$\\frac{1}{(1+x^2)^2}\\le\\frac{1}{1+x^2}$, so the answer must be less than $\\frac{\\pi}{2}$; $\\frac{\\pi}{4}$ is exactly half."
  },
  "uni-int-025": {
    "spot": "The $\\frac{1}{x^2+a^2}$ type with $a=2$: the antiderivative is $\\frac{1}{a}\\arctan\\frac{x}{a}$.",
    "why": "One step with the standard formula; remember the coefficient $\\frac{1}{a}$.",
    "steps": [
      "$\\int\\frac{dx}{x^2+4}=\\frac{1}{2}\\arctan\\frac{x}{2}$.",
      "As $x\\to\\infty$, $\\arctan\\frac{x}{2}\\to\\frac{\\pi}{2}$; at $x=0$ it is $0$.",
      "$\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{4}$."
    ],
    "trap": "Missing the $\\frac{1}{a}$, using $\\arctan\\frac{x}{2}$ as the antiderivative, and answering $\\frac{\\pi}{2}$. Differentiating back gives an extra factor of $2$.",
    "check": "Substitute $x=2u$: $\\int_0^\\infty\\frac{2\\,du}{4u^2+4}=\\frac{1}{2}\\int_0^\\infty\\frac{du}{u^2+1}=\\frac{1}{2}\\cdot\\frac{\\pi}{2}$."
  },
  "uni-lim-012": {
    "spot": "$x\\to 0$: the numerator $e^x-1-x$ is the exponential minus its first two terms, $\\approx\\frac{x^2}{2}$; the denominator $1-\\cos x\\approx\\frac{x^2}{2}$. Same order, same coefficient.",
    "why": "Expanding both sides to $x^2$ gives the ratio; L'Hôpital's Rule needs two rounds.",
    "steps": [
      "Plug in $x=0$: $\\frac{0}{0}$.",
      "$e^x-1-x=\\frac{x^2}{2}+\\frac{x^3}{6}+\\cdots$.",
      "$1-\\cos x=\\frac{x^2}{2}-\\frac{x^4}{24}+\\cdots$.",
      "Ratio $\\frac{1/2}{1/2}=1$."
    ],
    "trap": "Expanding the numerator only to first order, getting $0$, and answering $0$; after subtracting $1+x$ you must look at the next term $\\frac{x^2}{2}$.",
    "check": "At $x=0.01$: the ratio is about $1.0033$, slightly above $1$ (the numerator's next term $\\frac{x^3}{6}$ is positive)."
  },
  "uni-ser-009": {
    "spot": "Coefficients with $n^n$ and $n!$: use the Ratio Test; dividing consecutive terms leaves only $n+1$ from $n!$, and $n^n$ leaves $(1+\\frac{1}{n})^n\\to e$.",
    "why": "The Ratio Test cancels the factorials cleanly; the Root Test needs Stirling — a detour.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)^{n+1}}{(n+1)!}\\cdot\\frac{n!}{n^n}=\\frac{(n+1)^{n+1}}{(n+1)\\,n^n}=\\left(\\frac{n+1}{n}\\right)^n$.",
      "$\\left(1+\\frac{1}{n}\\right)^n\\to e$.",
      "Radius of convergence $R=\\frac{1}{e}$."
    ],
    "trap": "When cancelling, treating $(n+1)^{n+1}$ as $(n+1)\\cdot n^n$, getting a ratio of $1$ and answering $R=1$.",
    "check": "At $n=10$ the ratio is $1.1^{10}\\approx 2.594$, already close to $e\\approx 2.718$, approaching from below."
  },
  "uni-ser-013": {
    "spot": "$\\frac{1}{(1-x)^3}$ is $\\frac{1}{1-x}$ differentiated twice and divided by $2$: the coefficients are $\\binom{n+2}{2}$.",
    "why": "Differentiating the geometric series twice makes the coefficient formula appear immediately; no need for a fourth derivative.",
    "steps": [
      "$\\frac{d^2}{dx^2}\\frac{1}{1-x}=\\frac{2}{(1-x)^3}$.",
      "Differentiating $\\sum x^n$ twice gives $\\sum n(n-1)x^{n-2}$; dividing by $2$ and reindexing: $\\frac{1}{(1-x)^3}=\\sum\\frac{(n+1)(n+2)}{2}x^n$.",
      "$n=4$: $\\frac{5\\cdot 6}{2}=15$."
    ],
    "trap": "Misremembering it as $\\binom{n+3}{3}$ or $\\binom{n+2}{3}$ and answering $35$ or $20$; the coefficients of $\\frac{1}{(1-x)^k}$ are $\\binom{n+k-1}{k-1}$, and $k=3$ gives $\\binom{6}{2}$.",
    "check": "Fourth derivative at $0$ divided by $4!$: $\\frac{d^4}{dx^4}(1-x)^{-3}=3\\cdot 4\\cdot 5\\cdot 6(1-x)^{-7}$, which is $360$ at $0$, and $\\frac{360}{24}=15$."
  },
  "world-010": {
    "spot": "$\\cos^4x$ on $[0,\\pi]$: by periodicity it is twice the integral over $[0,\\frac{\\pi}{2}]$, then use Wallis; or reduce the power directly to a constant plus $\\cos 2x$, $\\cos 4x$.",
    "why": "After power reduction, $\\cos 2x$ and $\\cos 4x$ both integrate to $0$ over $[0,\\pi]$, leaving only the constant term $\\frac{3}{8}$ times the length.",
    "steps": [
      "Power reduction: $\\cos^4x=\\left(\\frac{1+\\cos 2x}{2}\\right)^2=\\frac{3}{8}+\\frac{\\cos 2x}{2}+\\frac{\\cos 4x}{8}$.",
      "$\\cos 2x$ and $\\cos 4x$ each run through a whole number of periods on $[0,\\pi]$, so they integrate to $0$.",
      "What's left: $\\frac{3}{8}\\cdot\\pi=\\frac{3\\pi}{8}$."
    ],
    "trap": "Applying Wallis directly as $\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{3\\pi}{16}$ — that is the version with upper limit $\\frac{\\pi}{2}$; this interval is twice as long.",
    "check": "The $[0,\\frac{\\pi}{2}]$ half is $\\frac{3\\pi}{16}$, the symmetric other half is the same, so together $\\frac{3\\pi}{8}$."
  },
  "world-065": {
    "spot": "$\\sqrt{\\tan x}$ on $[0,\\frac{\\pi}{2}]$: substituting $x\\mapsto\\frac{\\pi}{2}-x$ turns it into $\\sqrt{\\cot x}$ with the same integral. Adding the two puts $\\sin x+\\cos x$ in the numerator — exactly the derivative of $\\sin x-\\cos x$.",
    "why": "Substituting $u=\\sqrt{\\tan x}$ directly gives $\\int\\frac{2u^2}{1+u^4}du$, which means factoring a quartic; after the symmetric sum, one substitution gives an $\\arcsin$.",
    "steps": [
      "Let $I=\\int_0^{\\pi/2}\\sqrt{\\tan x}\\,dx$; substituting $x\\mapsto\\frac{\\pi}{2}-x$ gives $I=\\int_0^{\\pi/2}\\sqrt{\\cot x}\\,dx$.",
      "Add: $\\sqrt{\\tan x}+\\sqrt{\\cot x}=\\frac{\\sin x+\\cos x}{\\sqrt{\\sin x\\cos x}}$.",
      "Let $u=\\sin x-\\cos x$: $du=(\\cos x+\\sin x)\\,dx$, $u^2=1-2\\sin x\\cos x$, so $\\sin x\\cos x=\\frac{1-u^2}{2}$; $u$ runs from $-1$ to $1$.",
      "$2I=\\int_{-1}^{1}\\frac{\\sqrt{2}\\,du}{\\sqrt{1-u^2}}=\\sqrt{2}\\arcsin u\\Big|_{-1}^{1}=\\sqrt{2}\\,\\pi$.",
      "$I=\\frac{\\sqrt{2}\\,\\pi}{2}=\\frac{\\pi}{\\sqrt{2}}\\approx 2.221$."
    ],
    "trap": "In step three, writing $\\sin x\\cos x$ as $1-u^2$ (forgetting to divide by $2$) and getting $I=\\frac{\\pi}{2}$; the $2$ under the root is exactly where the $\\sqrt{2}$ in the answer comes from.",
    "check": "$\\sqrt{\\tan x}$ equals $1$ at $x=\\frac{\\pi}{4}$, is small on the left and blows up near $\\frac{\\pi}{2}$ on the right (but integrably, like $\\frac{1}{\\sqrt{\\frac{\\pi}{2}-x}}$); an answer larger than the interval length $\\frac{\\pi}{2}$ is reasonable."
  },
  "world-091": {
    "spot": "$\\left(1+\\frac{1}{n}\\right)^n\\to e$, so the bracket $\\to 0$ while the factor $n\\to\\infty$: an $\\infty\\cdot 0$ form. You need to know how far $\\left(1+\\frac{1}{n}\\right)^n$ is from $e$ — take logs and expand to order $\\frac{1}{n}$.",
    "why": "Writing the power as $e^{n\\ln(1+1/n)}$ and expanding the exponent to two terms shows the error is $-\\frac{e}{2n}$; L'Hôpital's Rule directly means differentiating $(1+t)^{1/t}$, which is messy.",
    "steps": [
      "$\\left(1+\\frac{1}{n}\\right)^n=e^{n\\ln(1+\\frac{1}{n})}$, and $\\ln(1+t)=t-\\frac{t^2}{2}+\\cdots$, so $n\\ln(1+\\frac{1}{n})=1-\\frac{1}{2n}+O(\\frac{1}{n^2})$.",
      "$e^{1-\\frac{1}{2n}+\\cdots}=e\\cdot e^{-\\frac{1}{2n}+\\cdots}=e\\left(1-\\frac{1}{2n}+\\cdots\\right)$.",
      "So $\\left(1+\\frac{1}{n}\\right)^n-e=-\\frac{e}{2n}+O(\\frac{1}{n^2})$.",
      "Multiply by $n$: the limit is $-\\frac{e}{2}\\approx -1.359$."
    ],
    "trap": "Since $\\left(1+\\frac{1}{n}\\right)^n\\to e$, treating the bracket as $0$ and answering $0$; or forgetting the outside factor $e$ and answering $-\\frac{1}{2}$.",
    "check": "$\\left(1+\\frac{1}{n}\\right)^n$ approaches $e$ from below, so the answer should be negative; at $n=1000$, $n\\left(\\left(1+\\frac{1}{n}\\right)^n-e\\right)\\approx -1.358$."
  },
  "ap-rr-004": {
    "spot": "The cone volume $V=\\frac{1}{3}\\pi r^2h$ has two variables, but the problem says the height always equals the base radius: use $r=h$ to eliminate $r$ first, so $V$ is a function of $h$ alone, then differentiate in time.",
    "why": "Eliminating a variable before differentiating takes just one Chain Rule; otherwise you also have to handle $\\frac{dr}{dt}$.",
    "steps": [
      "$r=h$: $V=\\frac{1}{3}\\pi h^3$.",
      "Differentiate in $t$: $\\frac{dV}{dt}=\\pi h^2\\frac{dh}{dt}$.",
      "$h=3$: $9\\pi=\\pi\\cdot 9\\cdot\\frac{dh}{dt}$, $\\frac{dh}{dt}=1$ m/min."
    ],
    "trap": "Forgetting the cone's $\\frac{1}{3}$ and using $V=\\pi h^3$, which gives $\\frac{1}{3}$.",
    "check": "At $h=3$ the pile's top cross-section (a circle of radius $3$) has area $9\\pi$; adding $9\\pi$ cubic m per minute makes it rise exactly $1$ m — thin layer volume $\\approx$ cross-section area times rise."
  }
};
