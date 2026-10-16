// Detail v2, English — batch 044. Translation of tools/content/detail/044.js (text only; claims live in the Chinese file).
module.exports = {
  "mob-bessel-009": {
    "spot": "The order is a negative integer, $-1$: integer-order Bessel functions satisfy the symmetry $J_{-n}(x)=(-1)^nJ_n(x)$, so $J_{-1}$ is not a new function.",
    "why": "Use the integer-order integral representation $J_n(x)=\\frac{1}{\\pi}\\int_0^\\pi\\cos(n\\tau-x\\sin\\tau)\\,d\\tau$; one change of variable shows it, faster than expanding the series and matching coefficients.",
    "steps": [
      "Integer-order integral representation: $J_n(x)=\\frac{1}{\\pi}\\int_0^\\pi\\cos(n\\tau-x\\sin\\tau)\\,d\\tau$. For example, $J_1(0)=\\frac{1}{\\pi}\\int_0^\\pi\\cos\\tau\\,d\\tau=0$.",
      "Plug in $n=-1$: $\\cos(-\\tau-x\\sin\\tau)=\\cos(\\tau+x\\sin\\tau)$ (cosine is even).",
      "Substitute $\\tau\\to\\pi-\\tau$: $\\sin\\tau$ is unchanged, and $\\cos(\\pi-\\tau+x\\sin\\tau)=-\\cos(\\tau-x\\sin\\tau)$.",
      "So $J_{-1}(x)=-\\frac{1}{\\pi}\\int_0^\\pi\\cos(\\tau-x\\sin\\tau)\\,d\\tau=-J_1(x)$. The answer is $-J_1(x)$."
    ],
    "trap": "Carrying over the non-integer-order result and claiming $J_{-1}$ and $J_1$ are linearly independent, a second solution; or assuming it is even like $\\cos$ and writing $J_1(x)$, off by a sign.",
    "check": "For small $x$, $J_1(x)\\approx\\frac{x}{2}>0$, so $J_{-1}(0.01)$ should be negative, about $-0.005$."
  },
  "mob-tech-002": {
    "spot": "Plugging in $x=0$ gives $\\frac{0}{0}$, and the numerator $e^{2x}-1-2x$ is exactly $e^{2x}$'s Taylor expansion with its first two terms removed — what's left is the $x^2$ term.",
    "why": "The numerator already looks like \"expansion minus the first few terms\", so the Taylor expansion reads off the leading term at a glance. L'Hôpital's Rule needs two differentiations, and each time you must recheck that it is still $\\frac{0}{0}$.",
    "steps": [
      "$e^{2x}=1+2x+\\frac{(2x)^2}{2}+\\frac{(2x)^3}{6}+\\cdots=1+2x+2x^2+\\frac{4}{3}x^3+\\cdots$.",
      "So the numerator $=2x^2+\\frac{4}{3}x^3+\\cdots$, with leading term $2x^2$.",
      "Divide by $x^2$: $2+\\frac{4}{3}x+\\cdots\\to 2$.",
      "So the tool for this problem is Taylor expansion."
    ],
    "trap": "Expanding only to first order, $e^{2x}\\approx 1+2x$, makes the numerator $0$ and suggests the limit is $0$. The denominator is $x^2$, so you must expand up to the $x^2$ term.",
    "check": "Plug in $x=0.01$: $\\frac{e^{0.02}-1.02}{0.0001}\\approx 2.013$, close to $2$."
  },
  "mob-tech-012": {
    "spot": "You need extrema of $f$ on a constraint curve $g(x,y)=0$, and the constraint can't necessarily be solved for $y$ — exactly the setting for Lagrange multipliers: at an extremum, $\\nabla f$ and $\\nabla g$ are parallel.",
    "why": "Solving the constraint as $y=y(x)$ and substituting only works for simple $g$. Lagrange multipliers don't require solving the constraint: just set up $\\nabla f=\\lambda\\nabla g$ together with $g=0$.",
    "steps": [
      "Set up the equations: $\\nabla f=\\lambda\\nabla g$, $g(x,y)=0$ — three unknowns $x,y,\\lambda$ and three equations (in the example below $x=y=\\lambda$, and substituting into the constraint gives $\\lambda=1$).",
      "Example: $f=xy$, $g=x+y-2=0$. $\\nabla f=(y,x)$, $\\nabla g=(1,1)$, giving $y=\\lambda$, $x=\\lambda$, so $x=y=1$.",
      "Cross-check: substitute $y=2-x$; the derivative of $f=x(2-x)$ at $x=1$ is $0$, with maximum $1$ — same as with Lagrange multipliers.",
      "So the tool for this problem is Lagrange multipliers."
    ],
    "trap": "Forgetting the constraint and solving $\\nabla f=\\mathbf 0$: that finds critical points of $f$ on the whole plane, not on the curve $g=0$, and has nothing to do with the problem.",
    "check": "In the example, $\\nabla f(1,1)=(1,1)$ is exactly $1$ times $\\nabla g$, so $\\lambda=1$ and the two gradients are parallel."
  },
  "mob-tech-016": {
    "spot": "The integral runs from $0$ to $\\infty$ and the integrand is \"a power of $x$ $\\times e^{-x}$\": the shape $x^{s-1}e^{-x}$ is word for word the definition of $\\Gamma(s)$.",
    "why": "For general $s$, integration by parts never ends. Recognize the $\\Gamma$ function and you can use $\\Gamma(s+1)=s\\Gamma(s)$, $\\Gamma(n)=(n-1)!$, $\\Gamma(\\frac12)=\\sqrt\\pi$ to write the answer directly.",
    "steps": [
      "Definition: $\\Gamma(s)=\\int_0^\\infty x^{s-1}e^{-x}\\,dx$ ($s>0$) — that's exactly the expression in the problem.",
      "For integers, $\\Gamma(n)=(n-1)!$: for example $\\Gamma(3)=2!=2$.",
      "Recursion $\\Gamma(s+1)=s\\Gamma(s)$ (one integration by parts): for example $\\Gamma(3.5)=2.5\\,\\Gamma(2.5)$.",
      "Starting point for half-integers: $\\Gamma(\\frac12)=\\sqrt\\pi$. So the tool for this problem is the $\\Gamma$ function."
    ],
    "trap": "Remembering $\\Gamma(n)$ as $n!$: then $\\int_0^\\infty x^2e^{-x}\\,dx$ gets answered as $3!=6$, but the correct value is $\\Gamma(3)=2!=2$.",
    "check": "With $s=1$ it is just $\\int_0^\\infty e^{-x}\\,dx=1=0!$."
  },
  "mob-trap-008": {
    "spot": "Change of variables in a double integral: a small cell $du\\,dv$ in the new variables does not necessarily have area $du\\,dv$ in the old plane — you must multiply by the area scaling factor $\\left|\\frac{\\partial(x,y)}{\\partial(u,v)}\\right|$.",
    "why": "$dA$ is an area, not just notation. Changing coordinates stretches or squeezes area, and the absolute value of the Jacobian is exactly that scaling factor; leave it out and the answer is off by a factor.",
    "steps": [
      "Formula: $\\iint_R f\\,dA=\\iint_S f(x(u,v),y(u,v))\\left|\\frac{\\partial(x,y)}{\\partial(u,v)}\\right|du\\,dv$. Example: $x=\\frac{u+v}{2}$, $y=\\frac{u-v}{2}$, determinant $=\\frac12\\cdot(-\\frac12)-\\frac12\\cdot\\frac12=-\\frac12$; take the absolute value and multiply by $\\frac12$.",
      "Polar coordinates: $x=r\\cos\\theta$, $y=r\\sin\\theta$, Jacobian $=\\cos\\theta\\cdot r\\cos\\theta-(-r\\sin\\theta)\\sin\\theta=r$.",
      "Area of the unit disk: $\\int_0^{2\\pi}\\int_0^1 r\\,dr\\,d\\theta=\\pi$, correct.",
      "Leaving out $r$: $\\int_0^{2\\pi}\\int_0^1 1\\,dr\\,d\\theta=2\\pi$, twice too big. So the main trap is forgetting the Jacobian."
    ],
    "trap": "With $u=x+y$, $v=x-y$, multiplying by $\\left|\\frac{\\partial(u,v)}{\\partial(x,y)}\\right|=2$ instead of its reciprocal $\\frac12$: the direction is reversed and the answer is off by a factor of four.",
    "check": "What you multiply by is the \"old with respect to new\" determinant $\\frac{\\partial(x,y)}{\\partial(u,v)}$, and you take its absolute value."
  },
  "refine-integrals-028": {
    "spot": "The inner integral is in $y$ of $\\frac{1}{1+y^3}$, which has no convenient antiderivative. But if you integrate in $x$ first, a $y^2$ appears — exactly one third of the derivative of $1+y^3$.",
    "why": "The integrand depends only on $y$, so integrating in $x$ first just multiplies by the length in the $x$ direction. Integrating $\\frac{1}{1+y^3}$ in the original order needs partial fractions plus arctangent — long and error-prone.",
    "steps": [
      "Sketch the region: $0\\le x\\le 4$, $\\sqrt x\\le y\\le 2$, equivalent to $0\\le y\\le 2$, $0\\le x\\le y^2$.",
      "After swapping the order, the inner integral is $\\int_0^{y^2}\\frac{dx}{1+y^3}=\\frac{y^2}{1+y^3}$.",
      "Outer integral: $\\int_0^2\\frac{y^2}{1+y^3}\\,dy=\\frac13\\ln(1+y^3)\\Big|_0^2=\\frac13\\ln 9$.",
      "$\\frac13\\ln 9=\\frac{2\\ln 3}{3}$."
    ],
    "trap": "Writing the upper limit for $x$ as $\\sqrt y$ when swapping (inverting $y=\\sqrt x$ wrong): you get $\\int_0^2\\frac{\\sqrt y}{1+y^3}\\,dy$, again something you can't integrate.",
    "check": "Integrating numerically in the original order also gives $\\frac{2\\ln3}{3}\\approx 0.732$."
  },
  "refine-limits-046": {
    "spot": "$\\frac{k}{n^2}=\\frac1n\\cdot\\frac kn$, and $\\cos\\frac{\\pi k}{2n}=\\cos\\left(\\frac\\pi2\\cdot\\frac kn\\right)$: the whole sum is $\\frac1n\\sum g\\left(\\frac kn\\right)$, a Riemann sum.",
    "why": "A sum containing both $k$ and $\\cos$ has no closed formula. Seen as a Riemann sum, the limit becomes $\\int_0^1 x\\cos\\frac{\\pi x}{2}\\,dx$ directly.",
    "steps": [
      "Rewrite: $\\sum_{k=1}^n\\frac{k}{n^2}\\cos\\frac{\\pi k}{2n}=\\frac1n\\sum_{k=1}^n g\\left(\\frac kn\\right)$, with $g(x)=x\\cos\\frac{\\pi x}{2}$.",
      "So the limit $=\\int_0^1 x\\cos\\frac{\\pi x}{2}\\,dx$.",
      "Integration by parts: the antiderivative is $\\frac{2x}{\\pi}\\sin\\frac{\\pi x}{2}+\\frac{4}{\\pi^2}\\cos\\frac{\\pi x}{2}$.",
      "Evaluate at the limits: $\\left(\\frac2\\pi+0\\right)-\\left(0+\\frac4{\\pi^2}\\right)=\\frac2\\pi-\\frac4{\\pi^2}$."
    ],
    "trap": "In the integration by parts, forgetting to divide by $\\frac\\pi2$ in $\\int\\sin\\frac{\\pi x}{2}\\,dx$ and writing the second term as $\\frac{2}{\\pi}\\cos$: the answer becomes $\\frac2\\pi-\\frac2\\pi=0$, obviously wrong (the integrand is positive on $(0,1)$).",
    "check": "On $[0,1]$ the integrand lies between $0$ and $x$; the answer, about $0.231$, is less than $\\int_0^1x\\,dx=\\frac12$. Reasonable."
  },
  "refine-limits-047": {
    "spot": "An $n$-th root of a product: taking logs turns it into $\\frac1n\\sum\\ln\\left(1+\\left(\\frac kn\\right)^2\\right)$, a standard Riemann sum.",
    "why": "There is no formula for the product. Taking $\\ln$ turns the product into a sum and the $\\frac1n$ power into an average, so the limit is an integral.",
    "steps": [
      "Take logs: $\\ln P_n=\\frac1n\\sum_{k=1}^n\\ln\\left(1+\\frac{k^2}{n^2}\\right)\\to\\int_0^1\\ln(1+x^2)\\,dx$.",
      "Integration by parts: $x\\ln(1+x^2)-\\int\\frac{2x^2}{1+x^2}\\,dx=x\\ln(1+x^2)-2x+2\\arctan x$.",
      "From $0$ to $1$: $\\ln2-2+\\frac\\pi2$.",
      "Undo the log: $e^{\\ln 2-2+\\pi/2}=2e^{\\pi/2-2}$."
    ],
    "trap": "Forgetting to undo the log and answering $\\ln2-2+\\frac\\pi2\\approx 0.264$. The problem asks for the original root of the product, so exponentiate with base $e$.",
    "check": "Each factor is between $1$ and $2$, so the geometric mean should be between $1$ and $2$ too; $2e^{\\pi/2-2}\\approx 1.30$. Reasonable."
  },
  "refine-limits-048": {
    "spot": "An $n$-th root of a factorial divided by $n^2$: write $n^2$ as $\\frac14(2n)^2$; then $\\frac{(2n)!}{(2n)^{2n}}=\\prod_{k=1}^{2n}\\frac{k}{2n}$, and its log is a Riemann sum for $\\int_0^1\\ln x\\,dx$.",
    "why": "No need to memorize Stirling's formula: split the factorial into a product of $\\frac{k}{2n}$, take logs to get a Riemann sum, and one integral pins down the exponent.",
    "steps": [
      "Rewrite: $\\frac{\\sqrt[n]{(2n)!}}{n^2}=4\\left(\\frac{(2n)!}{(2n)^{2n}}\\right)^{1/n}$, because $\\left((2n)^{2n}\\right)^{1/n}=4n^2$.",
      "Take logs: $\\frac1n\\ln\\frac{(2n)!}{(2n)^{2n}}=2\\cdot\\frac{1}{2n}\\sum_{k=1}^{2n}\\ln\\frac{k}{2n}\\to 2\\int_0^1\\ln x\\,dx$.",
      "So the bracketed factor tends to $e^{-2}$.",
      "Multiply back the $4$: limit $=\\frac{4}{e^2}$."
    ],
    "trap": "Treating $\\sqrt[n]{(2n)!}$ like $\\sqrt[n]{n!}\\sim\\frac ne$ and answering something like $\\frac{2}{e}$: $(2n)!$ gets an $n$-th root, not a $2n$-th root, so the exponent gets multiplied by $2$.",
    "check": "Computing directly at $n=20$ (with $(2n)!=\\int_0^\\infty t^{2n}e^{-t}\\,dt$) gives about $0.6$, a bit above $\\frac4{e^2}\\approx 0.541$ — slow convergence, but the right direction."
  },
  "refine-limits-049": {
    "spot": "The denominator $n^2\\sqrt n=n^{5/2}$ is exactly one power more than the numerator's $k^{3/2}$: $\\frac{k\\sqrt k}{n^{5/2}}=\\frac1n\\left(\\frac kn\\right)^{3/2}$, a Riemann sum.",
    "why": "$\\sum k^{3/2}$ has no closed formula; seen as a Riemann sum for $\\int_0^1x^{3/2}\\,dx$, it's done in one step.",
    "steps": [
      "Rewrite each term: $\\frac{k\\sqrt k}{n^2\\sqrt n}=\\frac1n\\left(\\frac kn\\right)^{3/2}$.",
      "So the limit $=\\int_0^1x^{3/2}\\,dx$.",
      "$\\int_0^1x^{3/2}\\,dx=\\frac{x^{5/2}}{5/2}\\Big|_0^1=\\frac25$."
    ],
    "trap": "Raising the power but dividing by the old one, $\\frac{x^{5/2}}{3/2}$, and answering $\\frac23$; you divide by the new exponent $\\frac52$.",
    "check": "Rough estimate for power sums: $\\sum_{k\\le n}k^p\\approx\\frac{n^{p+1}}{p+1}$; $p=\\frac32$ gives $\\frac{n^{5/2}}{5/2}$, and dividing by $n^{5/2}$ gives $\\frac25$."
  },
  "refine-limits-050": {
    "spot": "$\\cos\\frac{2\\pi n}{3}$ has period $3$ and takes only two values: $1$ when $n$ is a multiple of $3$, and $-\\frac12$ otherwise. The factor $\\frac{n+1}{n}\\to1$ in front doesn't matter.",
    "why": "The lim inf is the smallest of all subsequential limits. Grouping $n$ by its remainder mod $3$ gives an ordinary limit in each group — clearer than estimating the infimum directly.",
    "steps": [
      "$n=3m$: $\\cos 2\\pi m=1$, and this group tends to $1$.",
      "$n=3m+1$ or $3m+2$: $\\cos\\frac{2\\pi}{3}=\\cos\\frac{4\\pi}{3}=-\\frac12$.",
      "These two groups are $-\\frac12\\cdot\\frac{n+1}{n}\\to-\\frac12$.",
      "The only subsequential limits are $1$ and $-\\frac12$; take the smallest: lim inf $=-\\frac12$."
    ],
    "trap": "Noting that every term is $\\ge-\\frac12\\cdot\\frac{n+1}{n}$, taking the smallest of these, at $n=1$, which is $-1$, and answering $-1$: that is the infimum, not the lim inf. The lim inf only looks at the tail.",
    "check": "At $n=100$, $\\frac{101}{100}\\cdot(-\\frac12)=-0.505$, already very close to $-\\frac12$."
  },
  "refine-limits-051": {
    "spot": "The $\\cos\\frac{n\\pi}{2}$ in the exponent cycles through $1,0,-1,0$ with period $4$: the sequence splits into three shapes, $(1+\\frac1n)^n$, $1$, $(1+\\frac1n)^{-n}$.",
    "why": "The lim sup is the largest subsequential limit. Grouping $n$ by its remainder mod $4$ makes each group a familiar limit.",
    "steps": [
      "$n=4m$: $\\cos 2m\\pi=1$, and the term is $(1+\\frac1n)^n\\to e$.",
      "$n$ odd: $\\cos\\frac{n\\pi}{2}=0$, and the term is identically $1$.",
      "$n=4m+2$: $\\cos=-1$, and the term is $(1+\\frac1n)^{-n}\\to\\frac1e$.",
      "The subsequential limits are $e,1,\\frac1e$; take the largest: lim sup $=e$."
    ],
    "trap": "Thinking a $1^\\infty$ form is just $1$, or that since $\\cos$ is sometimes positive and sometimes negative it averages out to $1$: the lim sup is the largest subsequential limit, $e$.",
    "check": "At $n=100$ (a multiple of $4$), $(1.01)^{100}\\approx 2.705$, close to $e\\approx2.718$."
  },
  "refine-limits-052": {
    "spot": "For large $n$, $x^n$ pushes all the weight toward $x=1$, and $n\\int_0^1x^n\\,dx=\\frac{n}{n+1}\\to1$: the whole expression just evaluates $\\frac{1}{\\sqrt{3+x^2}}$ at $x=1$.",
    "why": "Integration by parts integrates away $x^n$; the main term is $f(1)$ and the rest is crushed by $\\frac1n$ — cleaner than hunting for Squeeze Theorem bounds.",
    "steps": [
      "Let $f(x)=\\frac{1}{\\sqrt{3+x^2}}$. Integration by parts: $n\\int_0^1x^nf\\,dx=\\frac{n}{n+1}\\left[f(1)-\\int_0^1x^{n+1}f'(x)\\,dx\\right]$.",
      "$f'(x)=-\\frac{x}{(3+x^2)^{3/2}}$ is bounded, so $\\left|\\int_0^1x^{n+1}f'\\,dx\\right|\\le\\frac{\\max|f'|}{n+2}\\to0$.",
      "$\\frac{n}{n+1}\\to1$, so the limit is $f(1)=\\frac12$."
    ],
    "trap": "Seeing $\\int_0^1x^n(\\cdots)\\,dx\\to0$ and answering $0$: there is a factor $n$ in front, so it is $0\\cdot\\infty$ and you have to work it out.",
    "check": "Numerical integration at $n=200$ gives about $0.498$, approaching $\\frac12$ from below."
  },
  "refine-limits-053": {
    "spot": "Each $\\frac{k}{n^2}\\le\\frac1n$ is small, and $\\sqrt{1+\\varepsilon}-1\\approx\\frac\\varepsilon2$; the total $\\sum\\frac{k}{n^2}=\\frac{n+1}{2n}\\to\\frac12$, then halve it.",
    "why": "Rationalizing gives $\\frac{\\varepsilon}{\\sqrt{1+\\varepsilon}+1}$, whose denominator is trapped between $2$ and $\\sqrt{1+\\frac1n}+1$, so the Squeeze Theorem makes it rigorous.",
    "steps": [
      "Rationalize: $\\sqrt{1+\\varepsilon}-1=\\frac{\\varepsilon}{\\sqrt{1+\\varepsilon}+1}$, with $\\varepsilon=\\frac{k}{n^2}$.",
      "$0<\\varepsilon\\le\\frac1n$, so the denominator lies between $2$ and $\\sqrt{1+\\frac1n}+1$.",
      "$\\sum_{k=1}^n\\frac{k}{n^2}=\\frac{n(n+1)}{2n^2}=\\frac{n+1}{2n}\\to\\frac12$.",
      "Squeeze: both bounds tend to $\\frac12\\cdot\\frac12=\\frac14$."
    ],
    "trap": "Seeing that each term tends to $0$ and answering $0$: the number of terms $n$ is growing too — it's \"many tiny numbers\" added up, so compute the total.",
    "check": "Using $\\sqrt{1+\\varepsilon}-1\\approx\\frac\\varepsilon2$: $\\frac12\\sum\\frac{k}{n^2}\\to\\frac14$, consistent."
  },
  "refine-limits-054": {
    "spot": "$\\frac1x$ goes to $+\\infty$ on one side of $0$ and $-\\infty$ on the other: on the right $e^{1/x}$ blows up, on the left $e^{1/x}\\to0$ — take one-sided limits.",
    "why": "Whenever $e^{1/x}$ appears, check each side separately. On the right the denominator blows up; on the left it tends to $1$, so nothing tames the $\\sin\\frac1x$ there.",
    "steps": [
      "Right-hand limit: $|\\sin\\frac1x|\\le1$ and the denominator $1+e^{1/x}\\to\\infty$, so it $\\to0$.",
      "Left side: $\\frac1x\\to-\\infty$, $e^{1/x}\\to0$, the denominator tends to $1$, and the expression is essentially $\\sin\\frac1x$.",
      "Take $x=-\\frac{1}{2m\\pi+\\pi/2}\\to0^-$: $\\sin\\frac1x=-1$, values tend to $-1$; take $x=-\\frac{1}{2m\\pi+3\\pi/2}$: values tend to $+1$. (At $m=10$ they are already $\\mp0.99\\cdots$.)",
      "The left-hand limit does not exist (it oscillates between $-1$ and $1$), so the limit does not exist."
    ],
    "trap": "Looking only at the right side, getting $0$, and answering $0$; or assuming $\\frac{\\sin}{\\text{something big}}$ is tamed on both sides — on the left the denominator tends to $1$, so it isn't.",
    "check": "Compare: with numerator $1$, the left limit is $1$ and the right limit is $0$, so that limit doesn't exist either; here the left side is worse — there isn't even a left-hand limit."
  },
  "refine-limits-055": {
    "spot": "The cosine angles halve each time: $\\cos\\frac\\theta2\\cos\\frac\\theta4\\cdots$. This is a telescoping product from the double-angle formula $\\sin2u=2\\sin u\\cos u$ (Viete's formula type), with $\\theta=\\frac\\pi3$.",
    "why": "Multiply by $\\sin\\frac{\\theta}{2^n}$ and the double-angle formula collapses everything back, shrinking the product to $\\frac{\\sin\\theta}{2^n\\sin(\\theta/2^n)}$ — no term-by-term estimates needed.",
    "steps": [
      "Telescoping: $\\prod_{k=1}^n\\cos\\frac{\\theta}{2^k}=\\frac{\\sin\\theta}{2^n\\sin(\\theta/2^n)}$ (e.g. $n=3$).",
      "As $n\\to\\infty$: $2^n\\sin\\frac{\\theta}{2^n}\\to\\theta$ (because $\\frac{\\sin u}{u}\\to1$). Here $\\theta=\\frac\\pi3$.",
      "So the product $\\to\\frac{\\sin\\theta}{\\theta}=\\frac{\\sqrt3/2}{\\pi/3}=\\frac{3\\sqrt3}{2\\pi}$."
    ],
    "trap": "Reasoning that every factor is $<1$, so infinitely many of them multiply to $0$: $\\cos\\frac{\\theta}{2^k}$ approaches $1$ very fast ($1-\\cos u\\approx\\frac{u^2}{2}$ is summable), so the product converges to a positive number.",
    "check": "Answer $\\approx0.827$; the first two factors give $\\cos\\frac\\pi6\\cos\\frac\\pi{12}\\approx0.837$, and the rest are all very close to $1$, pulling it down just a little. Reasonable."
  },
  "refine-limits-056": {
    "spot": "The recursion $a_{n+1}=a_n+\\frac1{a_n}$ becomes clean after squaring: $a_{n+1}^2=a_n^2+2+\\frac{1}{a_n^2}$, so $a_n^2$ grows by about $2$ per step, hence $a_n^2\\approx2n$.",
    "why": "Looking at the increment $\\frac1{a_n}$ of $a_n$ directly is self-referential. After squaring, the increment is the constant $2$ plus a small tail, and summing gives linear growth.",
    "steps": [
      "Square: $\\left(a+\\frac1a\\right)^2=a^2+2+\\frac1{a^2}$.",
      "Sum up from $a_1^2=1$: $a_n^2=2n-1+\\sum_{k=1}^{n-1}\\frac1{a_k^2}\\ge2n-1$.",
      "Upper bound: $a_k^2\\ge2k-1\\ge k$, so $\\sum\\frac1{a_k^2}\\le\\sum\\frac1k\\le1+\\ln n$, and $a_n^2\\le2n+\\ln n$.",
      "Squeeze: $\\frac{a_n^2}{n}\\to2$, so $\\frac{a_n}{\\sqrt n}\\to\\sqrt2$."
    ],
    "trap": "Thinking that since $a_n$ increases by ever smaller amounts it converges to some $L$: if $a_n\\to L$, the recursion gives $\\frac1L=0$, impossible, so $a_n\\to\\infty$.",
    "check": "$a_2=2$, $a_3=2.5$, $a_4=2.9$: $a_4^2=8.41\\approx2\\cdot4$, matches."
  },
  "refine-limits-057": {
    "spot": "The fixed point is $1$ ($L=2-\\frac1L\\Rightarrow L=1$, a double root), so convergence is slow. Setting $b_n=a_n-1$ turns the recursion into $b_{n+1}=\\frac{b_n}{1+b_n}$, and the reciprocals form an arithmetic sequence.",
    "why": "A double-root fixed point does not give geometric convergence, so Taylor approximations need great care. The reciprocal $\\frac1{b_n}$ grows by exactly $1$ each step, giving an exact formula.",
    "steps": [
      "$a_{n+1}-1=1-\\frac1{a_n}=\\frac{a_n-1}{a_n}$; set $b_n=a_n-1$: $b_{n+1}=\\frac{b_n}{1+b_n}$.",
      "Take reciprocals: $\\frac1{b_{n+1}}=\\frac1{b_n}+1$.",
      "$b_1=2$, so $\\frac1{b_n}=\\frac12+(n-1)=n-\\frac12$, i.e. $a_n-1=\\frac{1}{n-1/2}$. (Check $a_2=\\frac53$: $b_2=\\frac23=\\frac{1}{3/2}$.)",
      "$n(a_n-1)=\\frac{n}{n-1/2}\\to1$."
    ],
    "trap": "Assuming $a_n\\to1$ geometrically, $a_n-1\\approx Cr^n$, so that $n(a_n-1)\\to0$: at the fixed point, $f(a)=2-\\frac1a$ has derivative $f'(1)=1$, so the convergence is not geometric.",
    "check": "$a_3=2-\\frac35=\\frac75$, $b_3=\\frac25=\\frac{1}{5/2}$, exactly $\\frac{1}{3-1/2}$."
  },
  "refine-limits-058": {
    "spot": "Both roots have the same base $2$ and differ only in $\\frac1n$ versus $\\frac1{n+1}$: factoring out $2^{1/(n+1)}$ leaves $2^{1/(n(n+1))}-1\\approx\\frac{\\ln2}{n(n+1)}$, which cancels the $n^2$ exactly.",
    "why": "$2^\\varepsilon-1\\approx\\varepsilon\\ln2$ is the only approximation needed; the exponent difference $\\frac1n-\\frac1{n+1}=\\frac{1}{n(n+1)}$ shows up as soon as you factor.",
    "steps": [
      "Factor out the common part: $2^{1/n}-2^{1/(n+1)}=2^{1/(n+1)}\\left(2^{\\frac{1}{n(n+1)}}-1\\right)$.",
      "$\\frac{2^\\varepsilon-1}{\\varepsilon}\\to\\ln2$ (as $\\varepsilon\\to0$).",
      "So $n^2(\\cdots)\\approx2^{1/(n+1)}\\cdot\\frac{n^2}{n(n+1)}\\ln2\\to\\ln2$."
    ],
    "trap": "Saying the difference is $0$ because both $\\to1$; or multiplying only by $n$ and getting $0$ — the difference is of size $\\frac{1}{n^2}$, so you need the factor $n^2$ to see $\\ln2$.",
    "check": "The Mean Value Theorem also works: $g(t)=2^{t}$ has slope about $\\ln2$ between $\\frac1{n+1}$ and $\\frac1n$; multiply by the gap $\\frac{1}{n(n+1)}$ and then by $n^2$ to get $\\ln2$."
  },
  "refine-limits-059": {
    "spot": "A $0^0$ form: the base $\\frac\\pi2-\\arctan x=\\arctan\\frac1x\\approx\\frac1x$, the exponent is $\\frac1{\\ln x}$; after taking logs it's $\\frac{\\ln(1/x)}{\\ln x}=-1$.",
    "why": "A variable in the exponent means take logs. First rewrite $\\frac\\pi2-\\arctan x$ as $\\arctan\\frac1x$ so the leading term $\\frac1x$ is visible at a glance — faster than L'Hôpital's Rule on the whole expression.",
    "steps": [
      "For $x>0$, $\\frac\\pi2-\\arctan x=\\arctan\\frac1x$.",
      "$x\\arctan\\frac1x\\to1$, so $\\ln\\arctan\\frac1x=-\\ln x+\\ln\\left(x\\arctan\\frac1x\\right)$, and the last term $\\to0$.",
      "Divide by $\\ln x$: $\\frac{\\ln(\\pi/2-\\arctan x)}{\\ln x}\\to-1$.",
      "Undo the log: limit $=e^{-1}$."
    ],
    "trap": "Seeing the base $\\to0$ and answering $0$: the exponent $\\frac1{\\ln x}$ also tends to $0$, and $0^0$ is an indeterminate form — take logs.",
    "check": "Intuition: the base $\\approx\\frac1x=e^{-\\ln x}$, and taking its $\\ln x$-th root gives exactly $e^{-1}$."
  },
  "refine-limits-060": {
    "spot": "$f(x)=x^2$ is not symmetric about $x=3$: $x^2$ grows faster to the right than to the left, so the right side hits the $9.07$ boundary first — compute the distance on each side and take the smaller.",
    "why": "The problem wants the largest $\\delta$, not just any one that works. Solving $|x^2-9|<0.07$ exactly gives the precise interval, more accurate than plugging into an estimate like $\\delta=\\frac{\\varepsilon}{|x+3|}$.",
    "steps": [
      "$|x^2-9|<0.07\\iff 8.93<x^2<9.07\\iff\\sqrt{8.93}<x<\\sqrt{9.07}$ ($x$ is positive near $3$).",
      "Distance on the right: $\\sqrt{9.07}-3\\approx0.011644$; distance on the left: $3-\\sqrt{8.93}\\approx0.011711$.",
      "$\\delta$ must keep the symmetric interval $(3-\\delta,3+\\delta)$ entirely inside, so take the smaller one: $\\delta=\\sqrt{9.07}-3$."
    ],
    "trap": "Using the estimate $|x+3|\\approx6$ and taking $\\delta=\\frac{0.07}{6}\\approx0.011667$: slightly bigger than the correct answer, so near $3+\\delta$ on the right, $x^2$ exceeds $9.07$ and it fails.",
    "check": "$\\frac{0.07}{6}$ is indeed bigger than the answer, so that estimate is too greedy."
  },
  "refine-series-025": {
    "spot": "The summand depends only on $m+n$: group by $s=m+n$; each group has $s-1$ pairs $(m,n)$, giving a single series $\\sum_{s\\ge2}\\frac{s-1}{s!}$.",
    "why": "Summing the double sum layer by layer is awkward. Rearrange along diagonals $m+n=s$ (positive terms can be rearranged), then split the coefficient $s-1$ into $\\frac{1}{(s-1)!}-\\frac{1}{s!}$ and it telescopes.",
    "steps": [
      "Number of pairs with $m,n\\ge1$ and $m+n=s$: $m=1,\\dots,s-1$, so $s-1$ pairs. Hence the total $=\\sum_{s=2}^\\infty\\frac{s-1}{s!}$.",
      "Split: $\\frac{s-1}{s!}=\\frac{s}{s!}-\\frac1{s!}=\\frac1{(s-1)!}-\\frac1{s!}$.",
      "Telescope: $\\sum_{s\\ge2}\\left(\\frac1{(s-1)!}-\\frac1{s!}\\right)=\\frac1{1!}=1$. Summing directly with $s!=\\int_0^\\infty t^se^{-t}\\,dt$ also gives $1$."
    ],
    "trap": "Thinking each group has just one pair and computing $\\sum_{s\\ge2}\\frac1{s!}=e-2$; or counting $s+1$ pairs per group (wrongly starting $m,n$ at $0$).",
    "check": "You can also sum over $n$ first: $\\sum_n\\frac1{(m+n)!}$ is a tail of $e$; then sum over $m$, and the result is again $(e-1)-(e-2)=1$."
  },
  "refine-series-034": {
    "spot": "The central binomial coefficient $\\binom{2n}{n}$ with a geometric factor $x^n$: this is the generating function $\\sum\\binom{2n}{n}x^n=\\frac{1}{\\sqrt{1-4x}}$, evaluated at $x=\\frac18$.",
    "why": "See the coefficient $\\binom{2n}{n}$, think $(1-4x)^{-1/2}$. Without recognizing it, you can only add term by term, and convergence isn't fast.",
    "steps": [
      "Binomial expansion: $(1-4x)^{-1/2}=\\sum_{n\\ge0}\\binom{2n}{n}x^n$. Check the first terms: linear coefficient $\\binom21=2$, quadratic coefficient $\\binom42=6$.",
      "The radius of convergence is $\\frac14$, and $x=\\frac18$ is inside.",
      "Substitute: $\\frac{1}{\\sqrt{1-4/8}}=\\frac{1}{\\sqrt{1/2}}=\\sqrt2$."
    ],
    "trap": "Remembering the generating function as $\\frac{1}{1-4x}$ (missing the square root) and answering $2$; or using $\\frac{1}{\\sqrt{1-x}}$ and answering $\\sqrt{8/7}$.",
    "check": "Another route: $\\frac{\\binom{2n}{n}}{4^n}=\\frac2\\pi\\int_0^{\\pi/2}\\sin^{2n}t\\,dt$; summing the geometric series gives $\\frac2\\pi\\int_0^{\\pi/2}\\frac{dt}{1-\\frac12\\sin^2t}$, also $\\sqrt2$."
  },
  "ser-015": {
    "spot": "$n^2$ times a geometric factor $\\left(\\frac12\\right)^n$: starting from $\\sum x^n$, \"differentiate, then multiply by $x$\" twice produces $n^2x^n$.",
    "why": "Polynomial times geometric means applying $x\\frac{d}{dx}$ to a geometric series — faster than splitting into two series and doing shift-and-subtract on each.",
    "steps": [
      "$\\sum_{n\\ge1}x^n=\\frac{x}{1-x}$. Apply $x\\frac{d}{dx}$ once: $\\sum nx^n=\\frac{x}{(1-x)^2}$.",
      "Once more: $\\sum n^2x^n=x\\frac{d}{dx}\\frac{x}{(1-x)^2}=\\frac{x(1+x)}{(1-x)^3}$.",
      "Plug in $x=\\frac12$: $\\frac{\\frac12\\cdot\\frac32}{\\frac18}=6$."
    ],
    "trap": "Applying $x\\frac{d}{dx}$ only once gives the value of $\\sum n x^n$ at $\\frac12$, which is $2$; $n^2$ needs it twice.",
    "check": "The first few terms $\\frac12+1+\\frac98+1+\\frac{25}{32}\\approx4.41$, and plenty remains after that, so reaching $6$ is reasonable."
  },
  "tr-err-003": {
    "spot": "You want the maximum of the actual error, not an error bound: $g(x)=\\cos x-1+\\frac{x^2}{2}$ is monotonic on $[0,\\frac12]$, so the maximum is at the endpoint $x=\\frac12$.",
    "why": "The Lagrange remainder only gives the upper bound $\\frac{x^4}{24}$, not the exact maximum. Checking the monotonicity of $g$ directly, the maximum is $g(\\frac12)$.",
    "steps": [
      "Let $g(x)=\\cos x-\\left(1-\\frac{x^2}{2}\\right)$, with $g(0)=0$.",
      "$g'(x)=x-\\sin x\\ge0$ (since $\\sin x\\le x$), so $g$ is increasing and $g\\ge0$.",
      "The maximum is at $x=\\frac12$: $\\cos\\frac12-1+\\frac18=\\cos\\frac12-\\frac78$."
    ],
    "trap": "Answering with the remainder bound $\\frac{(1/2)^4}{24}=\\frac{1}{384}\\approx0.002604$: that's an upper bound; the actual maximum $\\approx0.002583$ is smaller.",
    "check": "The actual value is below the bound $\\frac1{384}$ and above the next-term estimate $\\frac{1}{384}-\\frac{(1/2)^6}{720}$."
  },
  "tr-err-004": {
    "spot": "It asks for the actual error: first write the second-degree Taylor polynomial $x-\\frac{x^2}{2}$, evaluate it at $x=\\frac12$ to get $\\frac38$, then subtract from the true value $\\ln\\frac32$.",
    "why": "The actual error is true value minus approximation, so when you have the true value, just subtract. The Lagrange remainder would only give an upper bound.",
    "steps": [
      "$\\ln(1+x)$ at $0$: $f(0)=0$, $f'(0)=1$, $f''(0)=-1$, so $P_2(x)=x-\\frac{x^2}{2}$.",
      "$P_2\\left(\\frac12\\right)=\\frac12-\\frac18=\\frac38$.",
      "Actual error $=\\ln\\frac32-\\frac38\\approx0.0305$."
    ],
    "trap": "Writing the second-degree polynomial as $x-x^2$ (forgetting the $2!$ in $\\frac{f''(0)}{2!}$): the approximation becomes $\\frac14$ and the error comes out as $0.155$.",
    "check": "Alternating series: the error lies between the next term $\\frac{(1/2)^3}{3}=\\frac1{24}$ and $\\frac1{24}-\\frac{(1/2)^4}{4}$."
  },
  "tr-err-005": {
    "spot": "The Taylor polynomial of $\\frac1{1-x}$ is just the truncated geometric series $1+x+x^2+x^3$, and the discarded tail has the exact formula $\\frac{x^4}{1-x}$.",
    "why": "The remainder of a geometric series can be summed exactly, no Lagrange estimate needed; subtracting directly also only takes $1.25-1.248$.",
    "steps": [
      "$P_3(x)=1+x+x^2+x^3$, error $\\frac1{1-x}-P_3(x)=\\frac{x^4}{1-x}$.",
      "$x=0.2$: true value $\\frac{1}{0.8}=1.25$, approximation $1+0.2+0.04+0.008=1.248$.",
      "Error $=\\frac{0.0016}{0.8}=0.002=\\frac{1}{500}$."
    ],
    "trap": "Thinking the error is just the next term $x^4=0.0016$: there's also $x^5+x^6+\\cdots$, and all together it's $\\frac{x^4}{1-x}=0.002$.",
    "check": "$1.25-1.248=0.002$, matching the formula."
  },
  "world-076": {
    "spot": "The integrand is $\\arctan x$ times its own derivative $\\frac{1}{1+x^2}$: the shape $u\\,du$, so let $u=\\arctan x$.",
    "why": "\"A function times its own derivative\" means substitute. As a bonus, the improper integral becomes an ordinary integral with $u$ from $0$ to $\\frac\\pi2$, so no separate limit is needed.",
    "steps": [
      "Let $u=\\arctan x$, $du=\\frac{dx}{1+x^2}$; $x:0\\to\\infty$ corresponds to $u:0\\to\\frac\\pi2$.",
      "The integral becomes $\\int_0^{\\pi/2}u\\,du=\\frac{u^2}{2}\\Big|_0^{\\pi/2}$.",
      "$=\\frac{1}{2}\\cdot\\frac{\\pi^2}{4}=\\frac{\\pi^2}{8}$."
    ],
    "trap": "Writing the upper limit $u=\\arctan\\infty$ as $\\pi$ and answering $\\frac{\\pi^2}{2}$; the limit of $\\arctan$ is $\\frac\\pi2$.",
    "check": "Numerically integrating the original also gives $\\frac{\\pi^2}{8}\\approx1.234$."
  },
  "an-sr-002": {
    "spot": "$a_n=\\frac{1}{n\\ln n}$ is positive and decreasing; condensation just replaces $n$ with $2^k$: $2^k\\cdot\\frac{1}{2^k\\ln 2^k}$, the $2^k$ cancels, and $\\ln2^k=k\\ln2$.",
    "why": "The condensation test turns $\\ln n$ into $k\\ln2$, so the log series instantly becomes a harmonic series — one substitution fewer than the Integral Test.",
    "steps": [
      "$a_{2^k}=\\frac{1}{2^k\\ln(2^k)}$; multiply by $2^k$: $2^ka_{2^k}=\\frac{1}{\\ln(2^k)}$.",
      "$\\ln(2^k)=k\\ln2$, so $2^ka_{2^k}=\\frac{1/\\ln2}{k}$.",
      "So $c=\\frac{1}{\\ln2}$ (after condensation it's a constant multiple of the harmonic series, so the original series diverges)."
    ],
    "trap": "Forgetting to multiply by $2^k$ and writing only $a_{2^k}=\\frac{1}{2^kk\\ln2}$: that converges, so you'd wrongly conclude the original series converges, and you can't read off the constant either.",
    "check": "$c=\\frac1{\\ln2}\\approx1.443$; at $k=3$, $2^3a_8=\\frac{1}{\\ln8}\\approx0.481=\\frac{1.443}{3}$."
  },
  "ch-nest-007": {
    "spot": "Three layers: outermost $(\\cdot)^3$, middle $\\sin(\\cdot)$, innermost $\\cos^2x$ (itself $(\\cos x)^2$) — peel them off from outside in with the Chain Rule.",
    "why": "Every layer is a basic function, so multiplying the layer derivatives in order is the safest. Expanding or simplifying first only makes it messier.",
    "steps": [
      "Outer layer: $\\frac{d}{dx}u^3=3u^2u'$, with $u=\\sin(\\cos^2x)$.",
      "Middle layer: $\\frac{d}{dx}\\sin(v)=\\cos(v)\\,v'$, with $v=\\cos^2x$.",
      "Inner layer: $(\\cos^2x)'=2\\cos x\\cdot(-\\sin x)=-2\\cos x\\sin x$.",
      "Multiply: $-6\\sin^2(\\cos^2x)\\cos(\\cos^2x)\\cos x\\sin x$."
    ],
    "trap": "Writing just $2\\cos x$ for the inner layer (missing the derivative $-\\sin x$ of $\\cos x$): the answer lacks a factor $-\\sin x$, and the sign is wrong too.",
    "check": "At $x=0$, $\\cos^2x$ has a maximum with derivative $0$, so the whole derivative should be $0$ at $x=0$; the answer has a factor $\\sin x$, correct."
  },
  "ch-nest-014": {
    "spot": "The shape is $\\left(1+\\sin^2(e^x)\\right)^{-1/2}$: outer power $-\\frac12$, inside a $\\sin^2$ of $e^x$ — four layers in all.",
    "why": "First write the reciprocal square root as the $-\\frac12$ power, then use the Chain Rule. Using the Quotient Rule on $1$ over a square root just takes a detour.",
    "steps": [
      "Outer layer: $\\frac{d}{dx}w^{-1/2}=-\\frac12w^{-3/2}w'$, with $w=1+\\sin^2(e^x)$.",
      "$w'=2\\sin(e^x)\\cos(e^x)\\cdot e^x$ ($\\sin^2$ gives $2\\sin\\cos$, $e^x$ gives $e^x$).",
      "Multiply; the $-\\frac12$ and $2$ cancel: $-\\frac{e^x\\sin(e^x)\\cos(e^x)}{(1+\\sin^2(e^x))^{3/2}}$."
    ],
    "trap": "Subtracting one from the power wrongly: writing $-\\frac12-1$ as $\\frac12$ makes the denominator $\\sqrt{1+\\sin^2(e^x)}$, one power short.",
    "check": "The larger $1+\\sin^2$ gets, the smaller the original function; when the $\\sin\\cos$ in the numerator is positive ($w$ increasing), the derivative is negative — consistent."
  },
  "cl-int-044": {
    "spot": "A cone rotating about its own axis: slice it horizontally into disks; each disk's moment of inertia about the center is $\\frac12(\\text{mass})(\\text{radius})^2$, and the radius shrinks linearly with height.",
    "why": "Disk slices need only a single-variable integral; shells or a triple integral also work but take an extra layer.",
    "steps": [
      "Put the base at $z=0$: at height $z$ the radius is $\\rho(z)=1-\\frac z3$.",
      "A disk of thickness $dz$ has mass $\\pi\\rho^2dz$ and moment of inertia $\\frac12\\pi\\rho^2dz\\cdot\\rho^2=\\frac\\pi2\\rho^4dz$.",
      "$I=\\frac\\pi2\\int_0^3\\left(1-\\frac z3\\right)^4dz=\\frac\\pi2\\cdot\\frac35=\\frac{3\\pi}{10}$."
    ],
    "trap": "Treating each disk as a ring, using $\\rho^2\\cdot(\\text{mass})$ instead of $\\frac12\\rho^2\\cdot(\\text{mass})$, doubles the answer to $\\frac{3\\pi}{5}$.",
    "check": "The formula $I=\\frac{3}{10}MR^2$ with $M=\\frac13\\pi R^2h=\\pi$ gives $\\frac{3\\pi}{10}$."
  },
  "cl-lim-009": {
    "spot": "$(1+\\frac1n)^n$ approaches $e$ from below; taking logs, $n\\ln(1+\\frac1n)=1-\\frac{1}{2n}+\\cdots$, and the gap is that $-\\frac1{2n}$.",
    "why": "You need the leading term of the error, and the Taylor expansion $\\ln(1+t)=t-\\frac{t^2}{2}+\\cdots$ gives it in one line. L'Hôpital's Rule on $n\\left(e-(1+\\frac1n)^n\\right)$ gets messy.",
    "steps": [
      "$n\\ln(1+\\frac1n)=1-\\frac{1}{2n}+O(\\frac{1}{n^2})$.",
      "So $(1+\\frac1n)^n=e\\cdot e^{-\\frac1{2n}+\\cdots}=e\\left(1-\\frac1{2n}+\\cdots\\right)$.",
      "$e-(1+\\frac1n)^n\\approx\\frac{e}{2n}$, so $c=\\frac e2$."
    ],
    "trap": "Thinking the gap between $(1+\\frac1n)^n$ and $e$ is $\\frac1{2n}$ and answering $c=\\frac12$: $\\frac1{2n}$ is the relative error; the absolute error needs another factor $e$.",
    "check": "$n=100$: $e-(1.01)^{100}\\approx0.01346$, while $\\frac{e}{200}\\approx0.01359$, very close."
  },
  "cl-lim-019": {
    "spot": "$|\\sin t|$ has period $\\pi$ and each period has area $2$, so $\\int_0^x|\\sin t|\\,dt$ is about $\\frac{2x}{\\pi}$, with average $\\frac2\\pi$.",
    "why": "The long-run average of a periodic function is its average over one period; squeezing by which period $[m\\pi,(m+1)\\pi)$ contains $x$ makes it rigorous.",
    "steps": [
      "Area of one period: $\\int_0^\\pi|\\sin t|\\,dt=2$.",
      "For $m\\pi\\le x<(m+1)\\pi$: $2m\\le\\int_0^x|\\sin t|\\,dt\\le2m+2$.",
      "Divide by $x$: $\\frac{2m}{(m+1)\\pi}\\le\\frac1x\\int_0^x|\\sin t|\\,dt\\le\\frac{2m+2}{m\\pi}$; as $m\\to\\infty$ both sides tend to $\\frac2\\pi$."
    ],
    "trap": "Dropping the absolute value, computing $\\int_0^x\\sin t\\,dt=1-\\cos x$, and dividing by $x$ to get $0$: the absolute value makes every arch contribute positively, so they don't cancel.",
    "check": "$|\\sin t|$ is between $0$ and $1$, and the average $\\frac2\\pi\\approx0.637$ sits a bit above the middle — reasonable (an arch is fatter than a triangle)."
  },
  "cl-lim-036": {
    "spot": "The recursion contains $e^{-x_n}$ and the problem asks about $e^{x_n}$: let $y_n=e^{x_n}$; the recursion becomes $y_{n+1}=y_ne^{1/y_n}$, with increment $y(e^{1/y}-1)\\to1$.",
    "why": "In terms of $y_n$ the increment tends to the constant $1$, so the Stolz–Cesàro theorem (a discrete L'Hôpital's Rule) $\\frac{y_n}{n}\\to\\lim(y_{n+1}-y_n)$ finishes it in one step.",
    "steps": [
      "$y_{n+1}=e^{x_n+e^{-x_n}}=y_ne^{1/y_n}$, with increment $y_{n+1}-y_n=y_n\\left(e^{1/y_n}-1\\right)>1$.",
      "So $y_n\\ge n$, $y_n\\to\\infty$, and the increment $\\to\\lim_{y\\to\\infty}y(e^{1/y}-1)=1$.",
      "Stolz–Cesàro: $\\frac{y_n}{n}\\to1$, i.e. $\\frac{e^{x_n}}{n}\\to1$."
    ],
    "trap": "Thinking that since the increment $e^{-x_n}$ of $x_n$ keeps shrinking, $x_n$ converges: if $x_n\\to L$, the recursion gives $e^{-L}=0$, a contradiction; $x_n$ diverges slowly, like $\\ln n$.",
    "check": "$y_1=1$, $y_2=e\\approx2.72$, $y_3=e\\cdot e^{1/e}\\approx3.93$ — each step adds a bit more than $1$, consistent with $y_n\\approx n$."
  },
  "cl-lim-038": {
    "spot": "The increment is $\\sqrt{a_n}$ and the problem asks about $\\frac{a_n}{n^2}$: look at $b_n=\\sqrt{a_n}$, which grows by about $\\frac12$ per step, so $\\sqrt{a_n}\\approx\\frac n2$.",
    "why": "Rationalizing for $\\sqrt{a_n}$, the increment $\\sqrt{a+\\sqrt a}-\\sqrt a\\to\\frac12$, and Stolz–Cesàro gives $\\frac{\\sqrt{a_n}}{n}\\to\\frac12$ directly.",
    "steps": [
      "Rationalize: $\\sqrt{a+\\sqrt a}-\\sqrt a=\\frac{\\sqrt a}{\\sqrt{a+\\sqrt a}+\\sqrt a}$.",
      "$a_n\\ge1$ is increasing and grows by at least $1$ per step, so $a_n\\to\\infty$ and the increment $\\to\\frac12$.",
      "Stolz–Cesàro: $\\frac{\\sqrt{a_n}}{n}\\to\\frac12$; squaring gives $\\frac{a_n}{n^2}\\to\\frac14$."
    ],
    "trap": "Solving the continuous version $a'=\\sqrt a$ to get $a=\\frac{t^2}{4}$ is fine, but treating the increment as staying at $\\sqrt{a_1}=1$ gives $a_n\\approx n$ and limit $0$ — wrong.",
    "check": "$a_1=1$, $a_2=2$, $a_3\\approx3.41$, $a_4\\approx5.26$...; at $n=4$, $\\frac{n^2}{4}=4$ — same order of magnitude, and it gets more accurate further on."
  },
  "cl-lim-042": {
    "spot": "An $n$-th root of a product with factors $2+\\frac kn$: taking logs gives $\\frac1n\\sum\\ln\\left(2+\\frac kn\\right)$, a Riemann sum for $\\int_0^1\\ln(2+x)\\,dx$.",
    "why": "Taking logs turns a geometric mean into an arithmetic mean, and the limit of an arithmetic mean is an integral; the product itself can't be simplified directly.",
    "steps": [
      "$\\ln P_n=\\frac1n\\sum_{k=1}^n\\ln\\left(2+\\frac kn\\right)\\to\\int_0^1\\ln(2+x)\\,dx$.",
      "Antiderivative: $(2+x)\\ln(2+x)-x$.",
      "From $0$ to $1$: $3\\ln3-1-2\\ln2$.",
      "Undo the log: $e^{3\\ln3-2\\ln2-1}=\\frac{27}{4e}$."
    ],
    "trap": "Writing the antiderivative as $x\\ln(2+x)-x$ (blindly applying the formula for $\\int\\ln x$ to $\\int\\ln(2+x)$), which loses the $-2\\ln2$ at the lower limit and gives $\\frac{3}{e}$.",
    "check": "The factors are between $2$ and $3$, so the geometric mean should be between $2$ and $3$ too; $\\frac{27}{4e}\\approx2.48$. Reasonable."
  },
  "cl-lim-046": {
    "spot": "A $1^\\infty$ form: the bracket $\\to1$ and the exponent $n\\to\\infty$. $2^{1/n}\\approx1+\\frac{\\ln2}{n}$, so the average is $\\approx1+\\frac{\\ln2+\\ln8}{2n}$.",
    "why": "Always take logs for $1^\\infty$. A first-order approximation of each term in the bracket gives the first-order term of the average, which is the exponent — far less work than L'Hôpital's Rule on the whole thing.",
    "steps": [
      "$a^{1/n}=e^{\\ln a/n}\\approx1+\\frac{\\ln a}{n}$, so the bracket $\\approx1+\\frac{\\ln2+\\ln8}{2n}=1+\\frac{2\\ln2}{n}$.",
      "$n\\ln(\\text{bracket})\\to2\\ln2$.",
      "Undo the log: $e^{2\\ln2}=4$ (exactly the geometric mean of $2$ and $8$)."
    ],
    "trap": "Answering $1$ because the bracket tends to $1$; or taking $\\frac{2+8}{2}=5$ as the answer — for $1^\\infty$ forms what matters is the first-order term, and the result is the geometric mean $\\sqrt{2\\cdot8}=4$.",
    "check": "General fact: $\\left(\\frac{a^{1/n}+b^{1/n}}{2}\\right)^n\\to\\sqrt{ab}$, and $\\sqrt{16}=4$."
  },
  "cl-lim-049": {
    "spot": "For each $x$, the integrand $n\\left((1+x)^{1/n}-1\\right)$ tends to $\\ln(1+x)$ (since $\\frac{a^t-1}{t}\\to\\ln a$) — move the limit inside the integral.",
    "why": "The pointwise limit is visible at a glance; trapping $e^u-1$ between $u$ and $ue^u$ gives upper and lower bounds that justify moving the limit, with no need to actually integrate $(1+x)^{1/n}$.",
    "steps": [
      "Let $u=\\frac{\\ln(1+x)}{n}$: $n\\left((1+x)^{1/n}-1\\right)=\\frac{e^u-1}{u}\\ln(1+x)$.",
      "$u\\le e^u-1\\le ue^u$ and $e^u\\le2^{1/n}$, so the integrand lies between $\\ln(1+x)$ and $2^{1/n}\\ln(1+x)$ (check with $n=100$).",
      "Squeeze: limit $=\\int_0^1\\ln(1+x)\\,dx=\\left[(1+x)\\ln(1+x)-x\\right]_0^1=2\\ln2-1$."
    ],
    "trap": "Seeing $(1+x)^{1/n}\\to1$ and saying the integral $\\to0$: there's a factor $n$ in front, so it's $0\\cdot\\infty$.",
    "check": "The answer $2\\ln2-1\\approx0.386$; on $[0,1]$, $\\ln(1+x)$ is between $0$ and $\\ln2\\approx0.693$, and the average sits in the middle. Reasonable."
  },
  "cl-ser-015": {
    "spot": "Numerator $n$, denominator $(2n+1)!$: write $n$ as $\\frac{(2n+1)-1}{2}$ and it splits into $\\frac{1}{(2n)!}$ and $\\frac1{(2n+1)!}$ — exactly the series for $\\cosh1$ and $\\sinh1$.",
    "why": "Once the numerator lines up with the factorial in the denominator, it cancels directly and what's left are the familiar even and odd sums; faster than finding a generating function and then differentiating or integrating.",
    "steps": [
      "$n=\\frac{(2n+1)-1}{2}$, so $\\frac{n}{(2n+1)!}=\\frac12\\left(\\frac{1}{(2n)!}-\\frac{1}{(2n+1)!}\\right)$.",
      "$\\sum_{n\\ge1}\\frac{1}{(2n)!}=\\cosh1-1$ (checked using $m!=\\int_0^\\infty t^me^{-t}\\,dt$).",
      "$\\sum_{n\\ge1}\\frac{1}{(2n+1)!}=\\sinh1-1$.",
      "Subtract and divide by $2$: $\\frac12(\\cosh1-\\sinh1)=\\frac{e^{-1}}{2}$."
    ],
    "trap": "Writing $\\sum_{n\\ge1}\\frac1{(2n)!}$ as $\\cosh1$ (forgetting to remove the $n=0$ term $1$): the two $-1$'s happen to cancel, so it doesn't matter here, but computing either sum on its own would be wrong.",
    "check": "Summing the original series directly also gives $\\frac{1}{2e}\\approx0.184$; the first term $\\frac16$ is most of it."
  },
  "cl-ser-019": {
    "spot": "The tail is a geometric series and sums to the closed form $R_5(x)=\\frac{xe^{-6x}}{1-e^{-x}}$; as $x\\to0^+$ the denominator is $\\approx x$, so the whole thing tends to $1$ — the worst spot is near the left endpoint.",
    "why": "First write the tail in closed form, then use $e^x-1>x$ to show in one line that it's always less than $1$; the supremum is the limit as $x\\to0^+$, with no need to differentiate and find critical points.",
    "steps": [
      "Geometric series: $\\sum_{n\\ge6}xe^{-nx}=\\frac{xe^{-6x}}{1-e^{-x}}=\\frac{xe^{-5x}}{e^x-1}$.",
      "$e^x-1>x$, so $R_5(x)<e^{-5x}<1$ for all $x>0$.",
      "As $x\\to0^+$: $\\frac{x}{e^x-1}\\to1$ and $e^{-5x}\\to1$, so $R_5(x)\\to1$; the supremum $=1$ (not attained)."
    ],
    "trap": "Seeing that each term is $0$ at $x=0$ and assuming $R_5(0^+)=0$, with the supremum at some interior critical point: infinitely many small terms add up, and near $0$ the total tends to $1$.",
    "check": "This shows $\\sup R_N=1$ for every $N$, which doesn't tend to $0$, so the series does not converge uniformly on $(0,\\infty)$."
  },
  "cl-ser-021": {
    "spot": "The remainder of $\\ln(1+x)$ has an exact integral form $R_N(x)=\\pm\\int_0^x\\frac{t^N}{1+t}\\,dt$, which increases with $x$, so the worst point is $x=1$.",
    "why": "The alternating-series estimate only gives the bound $\\frac{1}{N+1}$, which would demand $N=100$ — too conservative. Computing the integral form exactly at $x=1$ is the only way to find the smallest $N$.",
    "steps": [
      "$\\frac{1}{1+t}=1-t+\\cdots+(-t)^{N-1}+\\frac{(-t)^N}{1+t}$ (e.g. $N=3$); integrate from $0$ to $x$: $\\ln(1+x)-S_N(x)=\\int_0^x\\frac{(-t)^N}{1+t}\\,dt$.",
      "The absolute value $\\int_0^x\\frac{t^N}{1+t}\\,dt$ increases with $x$, so the supremum is at $x=1$: $E_N=\\int_0^1\\frac{t^N}{1+t}\\,dt\\approx\\frac{1}{2N}$.",
      "$N=50$: $E_{50}<0.01$, enough.",
      "$N=49$: $E_{49}>0.01$, not enough. So the smallest is $N=50$."
    ],
    "trap": "Using the alternating-series bound \"next term $\\frac{1}{N+1}<0.01$\" to get $N=100$: that only guarantees enough, it isn't the smallest; the actual error is only about half the next term.",
    "check": "At $x=1$ the error is just $|\\ln2-S_N|$, about $\\frac{1}{2N+1}$: $N=50$ gives $0.0099$ and $N=49$ gives $0.0101$, straddling $0.01$ exactly."
  },
  "cl-ser-022": {
    "spot": "The general term $\\frac{x}{(1+(n-1)x)(1+nx)}$ has two consecutive factors $1+kx$ in the denominator: partial fractions then telescoping give $S_N(x)=1-\\frac{1}{1+Nx}$, so the error has an exact formula.",
    "why": "After telescoping, the error is just $\\frac{1}{1+Nx}$, whose maximum on the interval is at the left endpoint $x=\\frac14$; solve the inequality directly, no estimates needed.",
    "steps": [
      "Partial fractions: $\\frac{x}{(1+(n-1)x)(1+nx)}=\\frac{1}{1+(n-1)x}-\\frac{1}{1+nx}$.",
      "Telescope: $S_N(x)=1-\\frac{1}{1+Nx}$; for $x>0$, $S(x)=1$ and the error $=\\frac{1}{1+Nx}$.",
      "The error decreases in $x$, worst at $x=\\frac14$: need $\\frac{1}{1+N/4}<0.03$, i.e. $N>129.\\overline3$.",
      "So the smallest is $N=130$."
    ],
    "trap": "Using the right endpoint $x=1$: $\\frac{1}{1+N}<0.03$ gives $N=33$, which only covers points near $x=1$; uniform convergence has to handle the worst point $x=\\frac14$.",
    "check": "$N=130$: $\\frac{1}{33.5}\\approx0.0299$; $N=129$: $\\frac{1}{33.25}\\approx0.0301$, straddling $0.03$ exactly."
  },
  "cl-ser-023": {
    "spot": "Each term $x^2e^{-nx}$ has a clear maximum on $[0,\\infty)$ (at $x=\\frac2n$), and that maximum is as small as $\\frac{1}{n^2}$ — the standard signal for the Weierstrass M-test.",
    "why": "The M-test only needs the suprema of the terms to be summable — simpler than finding the sum function and estimating the supremum of the tail.",
    "steps": [
      "$\\frac{d}{dx}x^2e^{-nx}=(2x-nx^2)e^{-nx}$, critical point $x=\\frac2n$ (for example $n=3$: $x=\\frac23$).",
      "Maximum $M_n=\\frac{4}{n^2}e^{-2}$ ($n=3$: $\\frac{4}{9e^2}$).",
      "$\\sum M_n=\\frac{4}{e^2}\\sum\\frac1{n^2}=\\frac{4}{e^2}\\cdot\\frac{\\pi^2}{6}$, convergent.",
      "By the M-test, the series converges uniformly on $[0,\\infty)$."
    ],
    "trap": "Confusing it with $\\sum xe^{-nx}$ and answering \"not uniformly convergent\": there $M_n=\\frac{1}{ne}$, a harmonic series; with the extra factor $x$ the maximum is of order $\\frac{1}{n^2}$, which converges.",
    "check": "The sum function $\\frac{x^2e^{-x}}{1-e^{-x}}$ tends to $0$ as $x\\to0^+$, matching the value at $x=0$ — continuous, with no jump that would break uniform convergence."
  },
  "cl-ser-033": {
    "spot": "Both base and exponent are $\\ln n$: $(\\ln n)^{\\ln n}=e^{\\ln n\\cdot\\ln\\ln n}=n^{\\ln\\ln n}$, and the exponent $\\ln\\ln n$ slowly passes $2$.",
    "why": "Rewriting as a power of $n$ lets you compare with a $p$-series; the Ratio Test limit here is $1$, so it's inconclusive.",
    "steps": [
      "Rewrite: $(\\ln n)^{\\ln n}=n^{\\ln\\ln n}$ (e.g. $n=100$).",
      "For $n\\ge e^{e^2}\\approx1618$, $\\ln\\ln n\\ge2$.",
      "So from there on, $\\frac{1}{(\\ln n)^{\\ln n}}\\le\\frac1{n^2}$ (e.g. $n=2000$).",
      "Finitely many early terms don't matter; comparing with $\\sum\\frac{1}{n^2}$, the series converges."
    ],
    "trap": "Seeing that $\\ln n$ grows slowly and assuming it diverges like $\\sum\\frac{1}{\\ln n}$: here $\\ln n$ is in the exponent, so the terms shrink faster than any $\\frac{1}{n^p}$.",
    "check": "Compare: $\\sum\\frac{1}{(\\ln n)^2}$ diverges; replacing the constant exponent $2$ with the growing $\\ln n$ turns divergence into convergence."
  },
  "cl-ser-034": {
    "spot": "The Ratio Test limit is $1$, inconclusive — the quantity $n\\left(\\frac{a_n}{a_{n+1}}-1\\right)$ the problem asks for is Raabe's test. The ratio simplifies to $\\frac{e}{(1+1/n)^n}$, which ties right into the leading error term of $(1+\\frac1n)^n$.",
    "why": "In the ratio, $n!$ and $e^n$ cancel down to just $(1+\\frac1n)^n$; with the known $(1+\\frac1n)^n=e\\left(1-\\frac1{2n}+\\cdots\\right)$ you read off the limit in one step.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)^{n+1}}{e^{n+1}(n+1)!}\\cdot\\frac{e^nn!}{n^n}=\\frac{(n+1)^n}{e\\,n^n}=\\frac{(1+\\frac1n)^n}{e}$.",
      "So $\\frac{a_n}{a_{n+1}}=\\frac{e}{(1+\\frac1n)^n}$, and $(1+\\frac1n)^n=e\\left(1-\\frac{1}{2n}+\\cdots\\right)$.",
      "$\\frac{a_n}{a_{n+1}}-1\\approx\\frac{1}{2n}$, so $n\\left(\\frac{a_n}{a_{n+1}}-1\\right)\\to\\frac12$."
    ],
    "trap": "Flipping the ratio to $\\frac{a_{n+1}}{a_n}$ and getting $-\\frac12$; Raabe's test uses $\\frac{a_n}{a_{n+1}}$.",
    "check": "Raabe value $\\frac12<1$, so $\\sum a_n$ diverges; consistent with Stirling's formula $a_n\\approx\\frac{1}{\\sqrt{2\\pi n}}$ (like a p-series with $p=\\frac12$)."
  },
  "cl-ser-049": {
    "spot": "The problem specifies $f(x)=|x|$ plus Parseval's identity: the Fourier coefficients of $|x|$ are not $0$ only for odd $k$ and are proportional to $\\frac{1}{k^2}$; squared, that's $\\frac{1}{(2k-1)^4}$.",
    "why": "The sum of squared coefficients equals the integral of the squared function, and $\\int x^2$ is immediate; so the fourth-power sum you want falls straight out of the identity.",
    "steps": [
      "$a_0=\\frac1\\pi\\int_{-\\pi}^{\\pi}|x|\\,dx=\\pi$; $a_k=\\frac2\\pi\\int_0^\\pi x\\cos kx\\,dx=\\frac{2((-1)^k-1)}{\\pi k^2}$, which is $-\\frac{4}{\\pi k^2}$ for odd $k$ (e.g. $k=3$).",
      "Parseval: $\\frac1\\pi\\int_{-\\pi}^{\\pi}x^2\\,dx=\\frac{a_0^2}{2}+\\sum a_k^2$, with left side $=\\frac{2\\pi^2}{3}$.",
      "$\\frac{2\\pi^2}{3}=\\frac{\\pi^2}{2}+\\frac{16}{\\pi^2}\\sum_{k\\ge1}\\frac{1}{(2k-1)^4}$, so $\\sum=\\left(\\frac{2\\pi^2}{3}-\\frac{\\pi^2}{2}\\right)\\cdot\\frac{\\pi^2}{16}=\\frac{\\pi^4}{96}$."
    ],
    "trap": "Writing the constant term in Parseval as $a_0^2$ instead of $\\frac{a_0^2}{2}$: subtracting $\\pi^2$ from the left side makes it negative, so the mistake is obvious right away.",
    "check": "Summing directly, $1+\\frac1{81}+\\frac1{625}+\\cdots\\approx1.0147$, which is exactly $\\frac{\\pi^4}{96}$."
  },
  "db-chain-012": {
    "spot": "$x$ times a composite function $\\arctan\\frac1x$: Product Rule on the outside, Chain Rule for the second factor, and the inner $\\frac1x$ has derivative $-\\frac{1}{x^2}$.",
    "why": "Product Rule plus Chain Rule is the most direct route; the derivative of $\\arctan\\frac1x$ simplifies to exactly $-\\frac{1}{1+x^2}$, very clean.",
    "steps": [
      "$\\frac{d}{dx}\\arctan\\frac1x=\\frac{1}{1+1/x^2}\\cdot\\left(-\\frac{1}{x^2}\\right)=-\\frac{1}{x^2+1}$.",
      "Product Rule: $\\left(x\\arctan\\frac1x\\right)'=\\arctan\\frac1x+x\\cdot\\left(-\\frac{1}{1+x^2}\\right)$.",
      "Simplify: $\\arctan\\frac1x-\\frac{x}{1+x^2}$."
    ],
    "trap": "Dropping the inner derivative $\\left(\\frac1x\\right)'=-\\frac1{x^2}$ in the Chain Rule and writing $\\frac{1}{1+1/x^2}=\\frac{x^2}{x^2+1}$, so the second term of the answer becomes $\\frac{x^3}{1+x^2}$.",
    "check": "For $x>0$, $\\arctan\\frac1x=\\frac\\pi2-\\arctan x$, whose derivative is $-\\frac{1}{1+x^2}$, matching the first step."
  },
  "db-def-007": {
    "spot": "The numerator has two $\\ln$'s near $2$, shifted in different directions: $\\ln(2+2h)$ and $\\ln(2-3h)$ each minus $\\ln2$ are two derivative definitions, and the coefficients $2$ and $-3$ come out as factors.",
    "why": "Adding and subtracting $\\ln2$ splits it into two derivative definitions, each being $(\\ln x)'=\\frac1x$ at $x=2$ times the shift coefficient; this shows the structure better than L'Hôpital's Rule.",
    "steps": [
      "Split: $\\frac{\\ln(2+2h)-\\ln2}{h}+\\frac{\\ln2-\\ln(2-3h)}{h}$.",
      "First term: $2\\cdot\\frac{\\ln(2+2h)-\\ln2}{2h}\\to2\\cdot\\frac12=1$.",
      "Second term: $3\\cdot\\frac{\\ln(2-3h)-\\ln2}{-3h}\\to3\\cdot\\frac12=\\frac32$.",
      "Add: $1+\\frac32=\\frac52$."
    ],
    "trap": "Mishandling the sign of the second term and writing $2\\cdot\\frac12-3\\cdot\\frac12=-\\frac12$: $-\\ln(2-3h)$ is shifted in the $-3h$ direction, and the two minus signs multiply to a plus.",
    "check": "You can also write it as $\\ln\\frac{2+2h}{2-3h}$ and differentiate in $h$ at $h=0$: $\\frac{2}{2}+\\frac{3}{2}=\\frac52$."
  },
  "db-imp-007": {
    "spot": "Second derivative by implicit differentiation: differentiate $x^3+y^3=2$ once to get $y'=-\\frac{x^2}{y^2}$, which is $-1$ at $(1,1)$; then differentiate $y'$ again, remembering $y$ is a function of $x$.",
    "why": "Compute $y'$ at the point first, then plug it into the second-derivative expression — fewer numbers to carry. You could also solve $y=(2-x^3)^{1/3}$ and differentiate directly, but differentiating a root twice is messier.",
    "steps": [
      "Differentiate once: $3x^2+3y^2y'=0$, $y'=-\\frac{x^2}{y^2}$; at $(1,1)$: $y'=-1$.",
      "Differentiate $y'=-\\frac{x^2}{y^2}$ again (Quotient Rule): $y''=-\\frac{2xy^2-x^2\\cdot2yy'}{y^4}$.",
      "Plug in $x=y=1$, $y'=-1$: $y''=-\\frac{2-2(-1)}{1}=-4$."
    ],
    "trap": "Treating $y^2$ as a constant in the second differentiation gives $y''=-\\frac{2x}{y^2}=-2$: it misses the $2yy'$ term from $y$ also changing.",
    "check": "Near $(1,1)$ the curve is symmetric about $y=x$, with slope $-1$; $y''<0$ means it bends downward, matching the bulging shape of $x^3+y^3=2$ in the first quadrant."
  },
  "db-imp-009": {
    "spot": "$\\arctan\\frac yx$ and $\\ln\\sqrt{x^2+y^2}$ are the polar $\\theta$ and $\\ln r$: the curve is $\\theta=\\ln r$, i.e. the logarithmic spiral $r=e^\\theta$, and $(1,0)$ corresponds to $\\theta=0$.",
    "why": "With implicit differentiation, both sides have denominator $x^2+y^2$, which cancels and leaves a linear equation; recognizing polar coordinates lets you double-check with the parametric form.",
    "steps": [
      "First confirm the point is on the curve: $\\arctan0=0=\\ln1$.",
      "Differentiate both sides in $x$: left $\\frac{xy'-y}{x^2+y^2}$, right $\\frac{x+yy'}{x^2+y^2}$, so $xy'-y=x+yy'$.",
      "Solve $y'=\\frac{x+y}{x-y}$; at $(1,0)$: $y'=\\frac{1+0}{1-0}=1$."
    ],
    "trap": "Differentiating $\\arctan\\frac yx$ on the left as just $\\frac{1}{1+(y/x)^2}\\cdot\\frac{y'}{x}$, missing the $-\\frac{y}{x^2}$ from the Quotient Rule; at $y=0$ it happens not to matter, but at another point it would be wrong.",
    "check": "Parametric form $x=e^t\\cos t$, $y=e^t\\sin t$; at $t=0$: $\\frac{dy}{dx}=\\frac{y'(0)}{x'(0)}=\\frac11=1$."
  },
  "db-logd-006": {
    "spot": "Both base and exponent contain $x$: $(1+x)^{1/x}$ can't use the power rule or the exponential rule — take logs, $\\ln y=\\frac{\\ln(1+x)}{x}$.",
    "why": "Logarithmic differentiation turns \"a variable to a variable power\" into a quotient, needing only the Quotient Rule; writing it as $e^{\\ln(1+x)/x}$ and differentiating is the same thing.",
    "steps": [
      "$\\ln y=\\frac{\\ln(1+x)}{x}$.",
      "Quotient Rule: $\\frac{y'}{y}=\\frac{\\frac{x}{1+x}-\\ln(1+x)}{x^2}$.",
      "Multiply back by $y$: $y'=(1+x)^{1/x}\\cdot\\frac{\\frac{x}{1+x}-\\ln(1+x)}{x^2}$."
    ],
    "trap": "Treating it as a power function and writing $\\frac1x(1+x)^{1/x-1}$: the exponent is changing too, so this misses a whole term.",
    "check": "$(1+x)^{1/x}$ falls from $e$ as $x\\to0^+$ down toward $1$, so it should be decreasing; $\\frac{x}{1+x}<\\ln(1+x)$, so the derivative is indeed negative."
  },
  "db-tay-008": {
    "spot": "A higher derivative at $0$ $=$ Taylor coefficient $\\times n!$: $xe^{2x}=\\sum\\frac{2^k}{k!}x^{k+1}$, and the $x^6$ coefficient comes from $k=5$.",
    "why": "Differentiating six times directly is long; reading off the Taylor coefficient takes one line, then multiply by $6!$.",
    "steps": [
      "$xe^{2x}=x\\sum_k\\frac{(2x)^k}{k!}$; the coefficient of $x^6$ is $\\frac{2^5}{5!}=\\frac{32}{120}$.",
      "$f^{(6)}(0)=6!\\cdot\\frac{32}{120}=6\\cdot32=192$.",
      "Cross-check with Leibniz: $f^{(5)}(x)=(32x+80)e^{2x}$; differentiating once more at $0$ gives $80\\cdot2+32=192$."
    ],
    "trap": "Taking the $x^6$ coefficient from $k=6$ and computing $6!\\cdot\\frac{2^6}{6!}=64$: the extra factor $x$ in front shifts the power by one.",
    "check": "General formula $f^{(n)}(0)=n\\cdot2^{n-1}$: $n=6$ gives $6\\cdot32=192$."
  },
  "db-tay-009": {
    "spot": "Each derivative of $e^x\\cos x$ multiplies by $\\sqrt2$ and rotates by $45^\\circ$; two derivatives give $-2e^x\\sin x$, and two more give $-4e^x\\cos x$.",
    "why": "Compute two orders to find the pattern; the fourth order is that pattern applied twice — faster than multiplying two Taylor series.",
    "steps": [
      "$f'=e^x(\\cos x-\\sin x)$.",
      "$f''=-2e^x\\sin x$.",
      "Differentiate $-2e^x\\sin x$ twice more: the second derivative of $e^x\\sin x$ is $2e^x\\cos x$, so $f^{(4)}=-4e^x\\cos x$.",
      "At $0$: $f^{(4)}(0)=-4$."
    ],
    "trap": "Thinking $e^x$ stays the same and $\\cos$ returns to itself after four derivatives, and answering $1$: the Product Rule creates cross terms every time, so you can't treat the factors separately.",
    "check": "By Taylor: $e^x\\cos x=1+x-\\frac{x^3}{3}-\\frac{x^4}{6}+\\cdots$; the $x^4$ coefficient $-\\frac16$ times $4!=24$ gives $-4$."
  },
  "dd-log-002": {
    "spot": "The base $\\ln x$ and the exponent $\\sin x$ both vary with $x$: a variable to a variable power, so take logs, $\\ln y=\\sin x\\cdot\\ln(\\ln x)$.",
    "why": "Logarithmic differentiation turns the power into a product, so the Product Rule suffices; the power rule and the exponential rule each handle only half.",
    "steps": [
      "$\\ln y=\\sin x\\ln(\\ln x)$ ($x>1$).",
      "Product Rule: $\\frac{y'}{y}=\\cos x\\ln(\\ln x)+\\sin x\\cdot\\frac{1}{\\ln x}\\cdot\\frac1x$.",
      "Multiply back by $y$: $y'=(\\ln x)^{\\sin x}\\left(\\cos x\\ln(\\ln x)+\\frac{\\sin x}{x\\ln x}\\right)$ (checked at $x=2$ and $x=3$)."
    ],
    "trap": "Differentiating $\\ln(\\ln x)$ but dropping the inner layer, writing $\\frac{1}{\\ln x}$, so the second term is missing a $\\frac1x$.",
    "check": "The domain needs $\\ln x>0$, i.e. $x>1$; the $\\ln(\\ln x)$ in the answer is also only defined for $x>1$ — consistent."
  },
  "dd-log-005": {
    "spot": "$\\left(1+\\frac1x\\right)^x$ has $x$ in both base and exponent: take logs, $\\ln y=x\\ln\\left(1+\\frac1x\\right)$, then use the Product Rule.",
    "why": "Logarithmic differentiation brings the exponent down; the derivative of the inner $\\ln(1+\\frac1x)$ simplifies to $-\\frac{1}{x(x+1)}$, which becomes very clean after multiplying by $x$.",
    "steps": [
      "$\\ln y=x\\ln\\left(1+\\frac1x\\right)$.",
      "$\\frac{d}{dx}\\ln\\left(1+\\frac1x\\right)=\\frac{-1/x^2}{1+1/x}=-\\frac{1}{x(x+1)}$.",
      "Product Rule: $\\frac{y'}{y}=\\ln\\left(1+\\frac1x\\right)-\\frac{1}{x+1}$.",
      "Multiply back by $y$: $y'=\\left(1+\\frac1x\\right)^x\\left(\\ln\\left(1+\\frac1x\\right)-\\frac{1}{x+1}\\right)$."
    ],
    "trap": "Differentiating it as a power function: $x\\left(1+\\frac1x\\right)^{x-1}\\cdot\\left(-\\frac1{x^2}\\right)$ only accounts for the change in the base and misses the exponent's term.",
    "check": "$(1+\\frac1x)^x$ increases up toward $e$; $\\ln(1+\\frac1x)>\\frac{1}{x+1}$, so the derivative is positive, correct."
  },
  "dd-log-009": {
    "spot": "$(\\ln x)^{\\ln x}$: base and exponent are the same $\\ln x$; take logs, $\\ln y=\\ln x\\cdot\\ln(\\ln x)$.",
    "why": "After logarithmic differentiation it's the Product Rule, and both terms carry $\\frac1x$, which factors out into one line.",
    "steps": [
      "$\\ln y=\\ln x\\cdot\\ln(\\ln x)$ ($x>1$).",
      "Product Rule: $\\frac{y'}{y}=\\frac1x\\ln(\\ln x)+\\ln x\\cdot\\frac{1}{x\\ln x}=\\frac{1+\\ln(\\ln x)}{x}$.",
      "Multiply back by $y$: $y'=(\\ln x)^{\\ln x}\\cdot\\frac{1+\\ln(\\ln x)}{x}$ (checked at $x=2$ and $x=3$)."
    ],
    "trap": "Using the power rule, $\\ln x\\cdot(\\ln x)^{\\ln x-1}\\cdot\\frac1x$, gives only the \"$1$\" term of the answer and misses $\\ln(\\ln x)$.",
    "check": "The derivative is $0$ where $\\ln(\\ln x)=-1$, i.e. $x=e^{1/e}\\approx1.44$: $u^u$ has its minimum at $u=\\frac1e$, and here $u=\\ln x$ — it matches."
  },
  "dd-nest-005": {
    "spot": "Three layers: $\\arctan(\\cdot)$ of $e^{(\\cdot)}$ of $\\sqrt x$; from outside in, multiply $\\frac{1}{1+u^2}$, $e^v$, $\\frac{1}{2\\sqrt x}$.",
    "why": "Every layer is a basic derivative, so multiplying in order with the Chain Rule is least likely to miss anything; remember the square $u^2=e^{2\\sqrt x}$.",
    "steps": [
      "Outer layer: $(\\arctan u)'=\\frac{u'}{1+u^2}$, with $u=e^{\\sqrt x}$, $u^2=e^{2\\sqrt x}$.",
      "$u'=e^{\\sqrt x}\\cdot\\frac{1}{2\\sqrt x}$.",
      "Multiply: $\\frac{e^{\\sqrt x}}{2\\sqrt x\\left(1+e^{2\\sqrt x}\\right)}$."
    ],
    "trap": "Writing $u^2$ as $e^{x}$ (thinking $(e^{\\sqrt x})^2=e^{x}$): squaring multiplies the exponent by $2$, so it should be $e^{2\\sqrt x}$.",
    "check": "$\\arctan$ is increasing and $e^{\\sqrt x}$ is increasing, so the derivative should be positive everywhere; every factor in the answer is positive, correct."
  },
  "dd-opt-003": {
    "spot": "A closed cylinder with fixed volume and minimal surface area: use the volume to eliminate the height $h$, making the surface area a function of the radius $r$ alone, $2\\pi r^2+\\frac{2000}{r}$, then differentiate to find the critical point.",
    "why": "The constraint is a simple equation, so substituting out one variable gives single-variable optimization; no need for Lagrange multipliers.",
    "steps": [
      "$\\pi r^2h=1000\\Rightarrow h=\\frac{1000}{\\pi r^2}$, surface area $A=2\\pi r^2+2\\pi rh=2\\pi r^2+\\frac{2000}{r}$.",
      "$A'(r)=4\\pi r-\\frac{2000}{r^2}=0\\Rightarrow r^3=\\frac{500}{\\pi}$.",
      "Then $h=\\frac{1000}{\\pi r^2}=2r$ (height equals diameter), and $A=2\\pi r^2+4\\pi r^2=6\\pi r^2$.",
      "$6\\pi r^2=6\\pi\\left(\\frac{500}{\\pi}\\right)^{2/3}=6\\sqrt[3]{250000\\pi}\\approx553.6$ square cm."
    ],
    "trap": "Forgetting the lid and counting only one base $\\pi r^2$: that gives a different optimum with $h=r$ and a smaller answer, which doesn't fit the problem.",
    "check": "Try both sides of the critical point: the surface areas at $r=5$ and $r=6$ are both larger than the answer."
  },
  "dm-seq-011": {
    "spot": "$e^{-n}\\frac{n^k}{k!}$ is the probability at $k$ of a Poisson distribution with mean $n$, so $S_n=P(X\\le n)$; $X$ is a sum of $n$ independent mean-$1$ Poissons, with mean $n$ and variance $n$.",
    "why": "The Central Limit Theorem sends the probability of \"at most the mean\" to the standard normal $\\Phi(0)=\\frac12$; estimating the ratio of the partial sum to $e^n$ by brute force is hard.",
    "steps": [
      "Equivalent form: $S_n=\\frac{1}{n!}\\int_n^\\infty t^ne^{-t}\\,dt$ (for $n=3$, $e^{-3}(1+3+\\frac92+\\frac{27}{6})=13e^{-3}$).",
      "Central Limit Theorem: $P(X\\le n)=P\\left(\\frac{X-n}{\\sqrt n}\\le0\\right)\\to\\Phi(0)$.",
      "The convergence is from above: at $n=50$, $S_{50}\\approx0.538$, an error of about $\\frac{2}{3\\sqrt{2\\pi n}}\\approx0.038$.",
      "So the limit is $\\Phi(0)=\\frac12$."
    ],
    "trap": "Thinking $\\sum\\frac{n^k}{k!}\\approx e^n$ and answering $1$: that's for summing to infinity; here the sum stops at $k=n$, cutting the distribution right in the middle, so you only get half.",
    "check": "At $n=3$, $13e^{-3}\\approx0.647$; at $n=50$, about $0.538$ — steadily dropping toward $0.5$."
  }
};
