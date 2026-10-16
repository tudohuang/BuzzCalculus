// Detail v2, English — batch 026. Translation of tools/content/detail/026.js (text only; claims live in the Chinese file).
module.exports = {
  "mob-limtrap-004": {
    "spot": "The numerator is $\\ln(1+x)$ minus $x-\\frac{x^2}{2}$ — exactly the first two terms of its Taylor expansion; the denominator is $x^3$, so expand up to the $x^3$ term.",
    "why": "L'Hôpital's Rule would need three rounds, checking each time that it is still $\\frac{0}{0}$; one line of expansion shows the $x^3$ coefficient.",
    "steps": [
      "Plug in $x=0$: numerator $\\ln 1-0+0=0$, denominator $0$, so it is $\\frac{0}{0}$.",
      "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\cdots$ (coefficients $\\frac{(-1)^{n+1}}{n}$, alternating signs).",
      "Subtract $x-\\frac{x^2}{2}$; the numerator leaves $\\frac{x^3}{3}-\\frac{x^4}{4}+\\cdots$.",
      "Divide by $x^3$: $\\frac{1}{3}-\\frac{x}{4}+\\cdots\\to\\frac{1}{3}$."
    ],
    "trap": "Remembering the coefficients of $\\ln(1+x)$ as $\\frac{1}{n!}$ (mixing it up with $e^x$) gives $\\frac{1}{6}$. The coefficients of $\\ln(1+x)$ are $\\frac{1}{n}$, not $\\frac{1}{n!}$.",
    "check": "Plug in $x=0.01$: the ratio is about $0.3308$, a bit less than $\\frac{1}{3}$ — exactly the size of the next term $-\\frac{x}{4}$."
  },
  "mob-lm-007": {
    "spot": "The perimeter is fixed at $20$, so the sides $x,y$ satisfy just one constraint $x+y=10$: eliminate a variable and you get a one-variable quadratic to maximize.",
    "why": "Lagrange multipliers also give $x=y$, but the constraint is linear, so substituting out a variable is fastest.",
    "steps": [
      "Perimeter $2x+2y=20$, so $y=10-x$ and the area is $A(x)=x(10-x)$, $0<x<10$.",
      "$A'(x)=10-2x=0$ gives $x=5$.",
      "$A''(x)=-2<0$, concave down, so $x=5$ is the maximum.",
      "Then $y=5$ (a square), and the maximum area is $A=5\\cdot 5=25$."
    ],
    "trap": "Writing the constraint as $x+y=20$ (treating the perimeter as length plus width) gives $10\\cdot 10=100$. The perimeter is $2(x+y)$.",
    "check": "Try a non-square rectangle, say $4\\times 6$: area $24$, smaller than $25$."
  },
  "mob-lm-008": {
    "spot": "You are minimizing $x^2+y^2+z^2$ — the squared distance to the origin; the constraint $x+y+z=1$ is a plane. The problem is really asking for the distance from the origin to the plane.",
    "why": "Lagrange multipliers give $x=y=z$; once you see the geometry, the point-to-plane distance formula gives the answer in one line, and the two routes check each other.",
    "steps": [
      "Lagrange: $2x=2y=2z=\\lambda$, so $x=y=z$.",
      "Back into the constraint: $3x=1$, $x=y=z=\\frac{1}{3}$.",
      "The function value is $3\\cdot\\left(\\frac{1}{3}\\right)^2=\\frac{1}{3}$.",
      "Compare with the distance formula: the distance from the origin to $x+y+z=1$ is $\\frac{1}{\\sqrt 3}$; squared, that is $\\frac{1}{3}$."
    ],
    "trap": "Answering with the distance $\\frac{1}{\\sqrt 3}$ — the problem asks for $x^2+y^2+z^2$, the squared distance.",
    "check": "Any other point on the plane, e.g. $(1,0,0)$, gives $1$, which is larger than $\\frac{1}{3}$."
  },
  "putnam-002": {
    "spot": "Both $n^3-1$ and $n^3+1$ factor, and $n^2-n+1$ is exactly $n^2+n+1$ with $n$ replaced by $n-1$: this is a product of two telescoping pieces.",
    "why": "Infinite products have no ready-made formula; split into factors that shift by one index, write the partial product in closed form, then take the limit.",
    "steps": [
      "Factor: $\\frac{n^3-1}{n^3+1}=\\frac{n-1}{n+1}\\cdot\\frac{n^2+n+1}{n^2-n+1}$.",
      "Key fact: $(n+1)^2-(n+1)+1=n^2+n+1$, so the numerator of the second factor cancels the denominator of the next term.",
      "Multiply up to $N$: $\\prod_{n=2}^{N}\\frac{n-1}{n+1}=\\frac{1\\cdot 2}{N(N+1)}$ and $\\prod_{n=2}^{N}\\frac{n^2+n+1}{n^2-n+1}=\\frac{N^2+N+1}{3}$, so the partial product is $P_N=\\frac{2(N^2+N+1)}{3N(N+1)}$. At $N=2$ it matches the first term $\\frac{7}{9}$.",
      "$N\\to\\infty$: $P_N\\to\\frac{2}{3}$."
    ],
    "trap": "Telescoping only the first piece $\\frac{n-1}{n+1}$ and throwing away the second because each factor $\\to 1$ makes you think the product is $0$. The second piece's partial products blow up to infinity on their own; the two must be computed together.",
    "check": "Take logs to get a series: $\\sum_{n\\ge 2}\\ln\\frac{n^3-1}{n^3+1}=\\ln\\frac{2}{3}$."
  },
  "putnam-008": {
    "spot": "$\\frac{1}{x}\\int_0^x g(t)\\,dt$ is the average of $g$ on $[0,x]$; as long as $g(t)=(1+\\sin 2t)^{1/t}$ has a limit as $t\\to 0$, that limit is the answer.",
    "why": "The integrand has no antiderivative, so you cannot integrate first; the Fundamental Theorem of Calculus (or L'Hôpital's Rule) reduces the problem to the limit of the integrand at $0$.",
    "steps": [
      "It is $\\frac{0}{0}$, so use L'Hôpital's Rule: differentiating the numerator in $x$ gives $g(x)$ (Fundamental Theorem of Calculus), the denominator to $1$, so the limit $=\\lim_{x\\to 0}g(x)$.",
      "This is a $1^\\infty$ form, so take logs: $\\ln g(t)=\\frac{\\ln(1+\\sin 2t)}{t}$, and $\\ln(1+\\sin 2t)\\approx\\sin 2t\\approx 2t$, so it $\\to 2$.",
      "Hence $g(t)\\to e^2$.",
      "The average also tends to $e^2$."
    ],
    "trap": "Seeing the base $1+\\sin 2t\\to 1$ and saying $1^{\\text{anything}}=1$ gives $1$. The exponent $\\frac{1}{t}\\to\\infty$, so this is the indeterminate form $1^\\infty$; take logs.",
    "check": "At $x=0.01$ the average is about $7.3$, close to $e^2\\approx 7.39$."
  },
  "putnam-010": {
    "spot": "It has the shape $\\frac{1}{n}\\sum_{k=1}^{n}f\\left(\\frac{k}{n}\\right)$: width $\\frac{1}{n}$, right endpoints $\\frac{k}{n}$ — a Riemann sum for $f(x)=\\frac{1}{1+x^2}$ on $[0,1]$.",
    "why": "The sum has no closed form; once you recognize the Riemann sum, the limit is just a definite integral.",
    "steps": [
      "$\\Delta x=\\frac{1}{n}$, and the sample points $x_k=\\frac{k}{n}$ run from $\\frac{1}{n}$ to $1$, so the interval is $[0,1]$.",
      "The limit $=\\int_0^1\\frac{dx}{1+x^2}$.",
      "The antiderivative is $\\arctan x$: $\\arctan 1-\\arctan 0=\\frac{\\pi}{4}$."
    ],
    "trap": "Reading the interval as $[0,n]$ or $[1,2]$. Since $\\frac{k}{n}$ runs from near $0$ to $1$, the interval is $[0,1]$.",
    "check": "$f$ is decreasing, so a right-endpoint sum underestimates: with $n=1$ there is a single term $\\frac{1}{2}$, less than $\\frac{\\pi}{4}\\approx 0.785$ — the right direction."
  },
  "putnam-011": {
    "spot": "The denominator $n(n+1)$ is a product of consecutive numbers — partial fractions $\\frac{1}{n}-\\frac{1}{n+1}$; with the $(-1)^{n+1}$ in front, both pieces become alternating harmonic series.",
    "why": "With alternating signs the telescoping does not cancel cleanly, but each of the two pieces is a variant of the known value $\\ln 2$.",
    "steps": [
      "Partial fractions: $\\frac{1}{n(n+1)}=\\frac{1}{n}-\\frac{1}{n+1}$.",
      "First piece: $\\sum_{n\\ge 1}\\frac{(-1)^{n+1}}{n}=1-\\frac{1}{2}+\\frac{1}{3}-\\cdots=\\ln 2$.",
      "Second piece: $\\sum_{n\\ge 1}\\frac{(-1)^{n+1}}{n+1}=\\frac{1}{2}-\\frac{1}{3}+\\cdots=1-\\ln 2$.",
      "Subtract: $\\ln 2-(1-\\ln 2)=2\\ln 2-1$."
    ],
    "trap": "Treating it as ordinary telescoping and thinking only the first term $1$ survives. With alternating signs, $-\\frac{1}{n+1}$ and the $-\\frac{1}{n+1}$ from the next term have the same sign and do not cancel.",
    "check": "The first two terms give $\\frac{1}{2}-\\frac{1}{6}=\\frac{1}{3}$; adding $\\frac{1}{12}$ gives $0.4167$. The answer $2\\ln 2-1\\approx 0.386$ sits in between, as an alternating series should."
  },
  "rel-adv-002": {
    "spot": "The numerator is $e^x$ minus $1+x+\\frac{x^2}{2}+\\frac{x^3}{6}$ (the first four terms of its expansion), and the denominator is $x^4$: after subtracting, look at the next term — the answer is the $x^4$ coefficient.",
    "why": "L'Hôpital's Rule would take four rounds; one line of expansion reads off the coefficient $\\frac{1}{4!}$.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "$e^x=\\sum\\frac{x^n}{n!}$; the $x^4$ term is $\\frac{x^4}{24}$, the next one $\\frac{x^5}{120}$.",
      "After removing the first four terms, the numerator $=\\frac{x^4}{24}+\\frac{x^5}{120}+\\cdots$.",
      "Divide by $x^4$ and take the limit: $\\frac{1}{24}$."
    ],
    "trap": "Writing the coefficient as $\\frac{1}{4}$ (forgetting the factorial). The $n$-th term of $e^x$ is $\\frac{x^n}{n!}$, and $4!=24$.",
    "check": "Plug in $x=0.01$: the ratio is about $0.04175$, slightly above $\\frac{1}{24}\\approx 0.04167$; the difference is exactly $\\frac{x}{120}$."
  },
  "rel-adv-008": {
    "spot": "Minimize $x^2+y^2+z^2$ subject to the plane $x+2y+2z=9$: this is the squared distance from the origin to a plane, and the normal vector $(1,2,2)$ has the integer length $3$.",
    "why": "Lagrange multipliers say the nearest point lies along the normal vector; the distance formula $\\frac{|9|}{\\sqrt{1+4+4}}$ gets there in one step.",
    "steps": [
      "Lagrange: $(2x,2y,2z)=\\lambda(1,2,2)$, so the nearest point is $t(1,2,2)$.",
      "Into the plane: $t+4t+4t=9$, $t=1$, so the point is $(1,2,2)$.",
      "Minimum value $1^2+2^2+2^2=9$.",
      "Compare with the distance formula: $d=\\frac{9}{3}=3$, $d^2=9$."
    ],
    "trap": "Answering with the distance $3$ — the problem asks for the sum of squares, i.e. $d^2=9$.",
    "check": "Another point on the plane, $(9,0,0)$, gives $81$, larger than $9$, consistent with a minimum."
  },
  "rel-hard-der-004": {
    "spot": "The curve has the form $y=f(x)$, so plug into the curvature formula $\\kappa=\\frac{|y''|}{(1+y'^2)^{3/2}}$; at $x=1$, $y'=1$ and $y''=-1$ are both integers.",
    "why": "No parametrization needed; the curvature formula for an explicit function needs only the first and second derivatives.",
    "steps": [
      "$y'=\\frac{1}{x}$, which is $1$ at $x=1$.",
      "$y''=-\\frac{1}{x^2}$, which is $-1$ at $x=1$.",
      "$\\kappa=\\frac{|-1|}{(1+1)^{3/2}}=\\frac{1}{2\\sqrt 2}$."
    ],
    "trap": "Forgetting the $\\frac{3}{2}$ power in the denominator and writing $\\frac{1}{1+y'^2}=\\frac{1}{2}$; or dropping the absolute value and getting a negative answer.",
    "check": "$\\frac{1}{2\\sqrt 2}\\approx 0.354$ is less than $|y''|=1$, because the slope $1$ makes the denominator bigger than $1$."
  },
  "rel-hard-lim-001": {
    "spot": "The numerator removes all of the first three nonzero terms of $\\sin x$, $x-\\frac{x^3}{6}+\\frac{x^5}{120}$, and the denominator is $x^7$: the answer is the $x^7$ coefficient of $\\sin x$.",
    "why": "L'Hôpital's Rule would take seven rounds; the Taylor expansion reads off the coefficient directly, with the sign following the alternating pattern.",
    "steps": [
      "$\\sin x=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\frac{x^7}{7!}+\\cdots$, alternating signs.",
      "After subtracting, the numerator is exactly the Taylor remainder: $\\sin x-x+\\frac{x^3}{6}-\\frac{x^5}{120}=-\\frac{1}{720}\\int_0^x(x-t)^6\\cos t\\,dt$.",
      "Let $t=xu$ and divide by $x^7$: $-\\frac{1}{720}\\int_0^1(1-u)^6\\cos(xu)\\,du\\to-\\frac{1}{720}\\cdot\\frac{1}{7}$.",
      "So the limit $=-\\frac{1}{5040}$."
    ],
    "trap": "Forgetting the alternating signs and answering $+\\frac{1}{5040}$. The $x^7$ term of $\\sin x$ is subtracted.",
    "check": "At $x=0.5$ the ratio is about $-0.000197$, consistent with $-\\frac{1}{5040}\\approx-0.000198$."
  },
  "rel-hard-lim-002": {
    "spot": "The $x+\\frac{x^3}{3}+\\frac{2x^5}{15}$ subtracted in the numerator is the first three terms of $\\tan x$, and the denominator is $x^7$: you need the $x^7$ coefficient of $\\tan x$.",
    "why": "The coefficients of $\\tan x$ have no simple formula, but $(\\tan x)'=1+\\tan^2 x$ generates them term by term, which is easier than long division of $\\frac{\\sin x}{\\cos x}$.",
    "steps": [
      "Let $\\tan x=x+a_3x^3+a_5x^5+a_7x^7+\\cdots$; it satisfies $(\\tan x)'=1+\\tan^2 x$.",
      "Match $x^2$ coefficients: $3a_3=1$, $a_3=\\frac{1}{3}$; match $x^4$: $5a_5=2a_3$, $a_5=\\frac{2}{15}$.",
      "Match $x^6$: $7a_7=2a_5+a_3^2=\\frac{4}{15}+\\frac{1}{9}=\\frac{17}{45}$, so $a_7=\\frac{17}{315}$.",
      "After removing the first three terms and dividing by $x^7$, the limit is $a_7=\\frac{17}{315}$."
    ],
    "trap": "When matching $x^6$ coefficients, missing the cross term $a_3^2$ (writing only $2a_5$) gives $\\frac{4}{105}$. The $x^6$ coefficient of $\\tan^2 x$ comes from $x\\cdot x^5$ twice and $x^3\\cdot x^3$ once.",
    "check": "At $x=0.3$ the ratio is about $0.0558$, a little above $\\frac{17}{315}\\approx 0.0540$ (the later terms are all positive)."
  },
  "rel-hard-lim-003": {
    "spot": "The numerator removes the first four terms of $\\ln(1+x)$, $x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}$, and the denominator is $x^5$: the answer is the $x^5$ coefficient $\\frac{(-1)^{6}}{5}$.",
    "why": "L'Hôpital's Rule would take five rounds; the coefficients of $\\ln(1+x)$ are just $\\frac{(-1)^{n+1}}{n}$ — read it off.",
    "steps": [
      "$\\ln(1+x)=\\sum_{n\\ge 1}\\frac{(-1)^{n+1}}{n}x^n$; the fifth term is $+\\frac{x^5}{5}$.",
      "What remains in the numerator is the integral form of the Taylor remainder: $\\int_0^x\\frac{(x-t)^4}{(1+t)^5}\\,dt$.",
      "Let $t=xu$ and divide by $x^5$: $\\int_0^1\\frac{(1-u)^4}{(1+xu)^5}\\,du$, which tends to $\\int_0^1(1-u)^4\\,du=\\frac{1}{5}$ as $x\\to 0$.",
      "The limit $=\\frac{1}{5}$."
    ],
    "trap": "Remembering the coefficient as $\\frac{1}{5!}=\\frac{1}{120}$ (mixed up with $e^x$), or flipping the sign to $-\\frac{1}{5}$. Odd-power terms are positive.",
    "check": "At $x=0.1$ the ratio is about $0.185$, a bit less than $\\frac{1}{5}$ — exactly the size of the next term $-\\frac{x}{6}$."
  },
  "rel-hard-lim-004": {
    "spot": "$e^x+e^{-x}$ is even, so all odd-power terms cancel, leaving $2\\left(1+\\frac{x^2}{2!}+\\frac{x^4}{4!}+\\frac{x^6}{6!}+\\cdots\\right)$; the numerator subtracts exactly the first three terms.",
    "why": "Adding the two expansions cancels the odd terms in pairs, which beats handling $e^x$ and $e^{-x}$ separately and applying L'Hôpital's Rule six times.",
    "steps": [
      "$e^x+e^{-x}=2+x^2+\\frac{x^4}{12}+\\frac{x^6}{360}+\\cdots$ (each term is $\\frac{2x^{2k}}{(2k)!}$).",
      "Subtract $2+x^2+\\frac{x^4}{12}$ from the numerator, leaving $\\frac{x^6}{360}+\\frac{x^8}{20160}+\\cdots$.",
      "Divide by $x^6$: $\\frac{1}{360}$."
    ],
    "trap": "Forgetting the factor $2$ and answering $\\frac{1}{720}$. Adding the two expansions doubles every even term.",
    "check": "Another way: $e^x+e^{-x}=2\\cosh x$, and the $x^6$ coefficient of $\\cosh x$ is $\\frac{1}{720}$; times $2$ gives exactly $\\frac{1}{360}$."
  },
  "rel-hard-lim-009": {
    "spot": "The numerator subtracts $x-\\frac{x^3}{3}$, the first two terms of $\\arctan x$; the denominator is $x^5$, so find the $x^5$ coefficient.",
    "why": "The expansion of $\\arctan x$ comes from integrating the geometric series for $\\frac{1}{1+t^2}$ term by term, so the coefficients $\\frac{(-1)^n}{2n+1}$ are immediate — no need to differentiate five times.",
    "steps": [
      "$\\frac{1}{1+t^2}=1-t^2+\\frac{t^4}{1+t^2}$ (the exact form of the long division).",
      "Integrate from $0$ to $x$: $\\arctan x-x+\\frac{x^3}{3}=\\int_0^x\\frac{t^4}{1+t^2}\\,dt$.",
      "This integral $\\approx\\int_0^x t^4\\,dt=\\frac{x^5}{5}$; dividing by $x^5$ gives $\\frac{1}{5}$.",
      "The limit $=\\frac{1}{5}$."
    ],
    "trap": "Confusing $\\arctan x$ with $\\sin x$ and writing the coefficient as $\\frac{1}{5!}=\\frac{1}{120}$. The denominators for $\\arctan x$ are the odd numbers $2n+1$, not factorials.",
    "check": "At $x=0.1$ the ratio is about $0.1986$, slightly less than $\\frac{1}{5}$; the difference is the next term $-\\frac{x^2}{7}$."
  },
  "rel-hard-mv-006": {
    "spot": "Three positive numbers with a fixed sum, maximize the product, and $xyz$ is fully symmetric in the three variables: the maximum is at $x=y=z$, or just use AM-GM.",
    "why": "Lagrange's $yz=xz=xy=\\lambda$ forces the three numbers to be equal; AM-GM $\\sqrt[3]{xyz}\\le\\frac{x+y+z}{3}$ gives the upper bound in one step and proves it is the maximum.",
    "steps": [
      "Lagrange: $yz=\\lambda$, $xz=\\lambda$, $xy=\\lambda$; dividing pairwise gives $x=y=z$.",
      "Into $x+y+z=1$: $x=y=z=\\frac{1}{3}$. Fixing $y=\\frac{1}{3}$ and moving in the $x$ direction confirms it is a stationary point.",
      "AM-GM: $xyz\\le\\left(\\frac{x+y+z}{3}\\right)^3=\\frac{1}{27}$, with equality when the three numbers are equal.",
      "Maximum $\\frac{1}{27}$."
    ],
    "trap": "Thinking the boundary (e.g. $z\\to 0$) gives more. On the boundary the product tends to $0$; the maximum is in the interior.",
    "check": "Try $\\left(\\frac{1}{2},\\frac{1}{4},\\frac{1}{4}\\right)$: the product $\\frac{1}{32}$ is smaller than $\\frac{1}{27}$."
  },
  "rel-hard-mv-007": {
    "spot": "The constraint $xy=1$ solves directly to $y=\\frac{1}{x}$, and the objective becomes $x^2+\\frac{1}{x^2}$ — a number plus its reciprocal, the textbook AM-GM shape.",
    "why": "Substituting out $y$ to get one variable is fastest; Lagrange's $2x=\\lambda y$, $2y=\\lambda x$ also leads to $x=y$, but with an extra detour.",
    "steps": [
      "$y=\\frac{1}{x}$, objective $g(x)=x^2+\\frac{1}{x^2}$, $x>0$.",
      "$g'(x)=2x-\\frac{2}{x^3}=0$, $x^4=1$, $x=1$.",
      "Complete the square to confirm the minimum: $x^2+\\frac{1}{x^2}-2=\\left(x-\\frac{1}{x}\\right)^2\\ge 0$.",
      "The minimum is at $x=y=1$ and equals $2$."
    ],
    "trap": "Answering with the nearest point $(1,1)$ or the distance $\\sqrt 2$. The problem asks for the minimum of $x^2+y^2$ itself.",
    "check": "Another point $\\left(2,\\frac{1}{2}\\right)$ gives $\\frac{17}{4}$, larger than $2$."
  },
  "rel-hard-ser-002": {
    "spot": "The coefficients contain factorials like $(n!)^2$ and $(2n)!$: go straight to the Ratio Test — dividing consecutive terms collapses the factorials to polynomials.",
    "why": "The Root Test would have to handle $\\sqrt[n]{(2n)!}$, which is messy; the Ratio Test reduces the factorials to $\\frac{(n+1)^2}{(2n+2)(2n+1)}$.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{((n+1)!)^2}{(n!)^2}\\cdot\\frac{(2n)!}{(2n+2)!}=\\frac{(n+1)^2}{(2n+2)(2n+1)}$.",
      "$n\\to\\infty$: $\\frac{n+1}{2(2n+1)}\\to\\frac{1}{4}$.",
      "The radius of convergence is the reciprocal of the ratio limit: $R=4$."
    ],
    "trap": "Taking the ratio limit $\\frac{1}{4}$ itself as the radius. The series converges when $|x|\\cdot\\frac{1}{4}<1$, so $R=4$.",
    "check": "Check: $\\binom{2n}{n}$ is roughly of size $4^n$, so the coefficient $\\frac{1}{\\binom{2n}{n}}$ is roughly $4^{-n}$ and the radius is $4$. At $n=5$, $\\binom{10}{5}=252$, between $\\frac{4^5}{8}$ and $4^5$."
  },
  "uni-der-001": {
    "spot": "Both the base and the exponent contain $x$ ($x^{\\cos x}$): neither the Power Rule nor the exponential rule applies directly — the signal is logarithmic differentiation.",
    "why": "Writing it as $e^{\\cos x\\ln x}$ or differentiating $\\ln y$ lets the Product Rule capture the change in both parts.",
    "steps": [
      "Let $y=x^{\\cos x}$ and take logs: $\\ln y=\\cos x\\ln x$.",
      "Product Rule on the right: $(\\cos x\\ln x)'=-\\sin x\\ln x+\\frac{\\cos x}{x}$.",
      "The left side is $\\frac{y'}{y}$, so $y'=x^{\\cos x}\\left(-\\sin x\\ln x+\\frac{\\cos x}{x}\\right)$."
    ],
    "trap": "Using the Power Rule and writing $\\cos x\\cdot x^{\\cos x-1}$ — this only covers the part where the exponent is held fixed and misses $-\\sin x\\ln x\\cdot x^{\\cos x}$.",
    "check": "At $x=1$: $\\ln 1=0$, so the derivative is just $\\cos 1\\approx 0.540$."
  },
  "uni-der-004": {
    "spot": "You need the fourth derivative at $x=0$, and the Maclaurin series of $x^2e^x$ takes one line: $f^{(4)}(0)=4!\\times(x^4\\text{ coefficient})$.",
    "why": "Differentiating four times means repeated Product Rule; reading from the series only requires the term $x^2\\cdot\\frac{x^2}{2!}$.",
    "steps": [
      "$x^2e^x=x^2\\left(1+x+\\frac{x^2}{2}+\\cdots\\right)=x^2+x^3+\\frac{x^4}{2}+\\cdots$; the $x^4$ coefficient is $\\frac{1}{2}$.",
      "$f^{(4)}(0)=4!\\cdot\\frac{1}{2}=12$.",
      "Compare with direct differentiation: $(x^2e^x)''=(x^2+4x+2)e^x$, and two more derivatives give $(x^2+8x+12)e^x$.",
      "Plug in $x=0$: $12$."
    ],
    "trap": "Reading off the coefficient $\\frac{1}{2}$ and calling it the answer, forgetting to multiply by $4!$. The coefficient is $\\frac{f^{(4)}(0)}{4!}$.",
    "check": "Leibniz rule: only the term where $x^2$ is differentiated twice is nonzero at $0$, giving $\\binom{4}{2}\\cdot 2\\cdot e^0=12$."
  },
  "uni-der-006": {
    "spot": "Differentiating an integral whose upper limit is the function $\\sin x$: Fundamental Theorem of Calculus plus the Chain Rule — plug the upper limit into the integrand, then multiply by the derivative of the upper limit.",
    "why": "$e^{t^2}$ has no elementary antiderivative, so you cannot integrate first; the Fundamental Theorem means you never have to.",
    "steps": [
      "Let $F(u)=\\int_0^u e^{t^2}\\,dt$; by the Fundamental Theorem, $F'(u)=e^{u^2}$.",
      "The problem is $F(\\sin x)$, so by the Chain Rule: $F'(\\sin x)\\cdot\\cos x$.",
      "So the derivative $=\\cos x\\,e^{\\sin^2 x}$."
    ],
    "trap": "Writing only $e^{\\sin^2 x}$ and forgetting to multiply by the upper limit's derivative $\\cos x$.",
    "check": "At $x=0$: the upper limit is $\\sin 0=0$, and the derivative $=\\cos 0\\cdot e^0=1$."
  },
  "uni-der-009": {
    "spot": "Both $x$ and $y$ are given in terms of a parameter $t$: for parametric equations $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$, differentiating each with respect to $t$.",
    "why": "You could eliminate $t$ ($x^2-y^2=4$), but the parametric formula is shortest.",
    "steps": [
      "$\\frac{dx}{dt}=1-\\frac{1}{t^2}$, which is $\\frac{3}{4}$ at $t=2$.",
      "$\\frac{dy}{dt}=1+\\frac{1}{t^2}$, which is $\\frac{5}{4}$ at $t=2$.",
      "$\\frac{dy}{dx}=\\frac{5/4}{3/4}=\\frac{5}{3}$."
    ],
    "trap": "Flipping it upside down to get $\\frac{dx/dt}{dy/dt}=\\frac{3}{5}$. You want $y$ with respect to $x$, so $\\frac{dy}{dt}$ goes on top.",
    "check": "Eliminate $t$: $x^2-y^2=4$, and implicit differentiation gives $\\frac{dy}{dx}=\\frac{x}{y}$; at $t=2$, $x=\\frac{5}{2}$ and $y=\\frac{3}{2}$, ratio $\\frac{5}{3}$."
  },
  "uni-der-020": {
    "spot": "Both the base $1+x^2$ and the exponent $x$ vary — the form $f(x)^{g(x)}$: use logarithmic differentiation.",
    "why": "Write it as $e^{x\\ln(1+x^2)}$; Product Rule plus Chain Rule on the exponent captures both changes at once.",
    "steps": [
      "$\\ln y=x\\ln(1+x^2)$.",
      "Differentiate the right side: $\\ln(1+x^2)+x\\cdot\\frac{2x}{1+x^2}$.",
      "$y'=y\\cdot(\\ln y)'=(1+x^2)^x\\left(\\ln(1+x^2)+\\frac{2x^2}{1+x^2}\\right)$."
    ],
    "trap": "Using the Power Rule to write $x(1+x^2)^{x-1}\\cdot 2x$ misses the $\\ln(1+x^2)$ term; using the exponential rule to write only $(1+x^2)^x\\ln(1+x^2)$ misses $\\frac{2x^2}{1+x^2}$.",
    "check": "At $x=1$: $2(\\ln 2+1)\\approx 3.39$."
  },
  "uni-lim-001": {
    "spot": "The numerator subtracts $x-\\frac{x^3}{6}$, the first two terms of $\\sin x$; the denominator is $x^5$, so the answer is the $x^5$ coefficient.",
    "why": "L'Hôpital's Rule would take five rounds; the expansion reads off $\\frac{1}{5!}$ directly.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "$\\sin x=x-\\frac{x^3}{6}+\\frac{x^5}{120}-\\frac{x^7}{5040}+\\cdots$.",
      "After removing the first two terms, the numerator $=\\frac{x^5}{120}-\\cdots$; dividing by $x^5$ gives $\\frac{1}{120}$."
    ],
    "trap": "Thinking $\\sin x\\approx x$ is enough, getting $\\frac{x^3/6}{x^5}$ and calling the limit infinite. Expand until the first term that survives the subtraction.",
    "check": "At $x=0.1$ the ratio is about $0.008332$, slightly less than $\\frac{1}{120}\\approx 0.008333$."
  },
  "uni-lim-002": {
    "spot": "The numerator subtracts $x-\\frac{x^2}{2}+\\frac{x^3}{3}$, the first three terms of $\\ln(1+x)$; the denominator is $x^4$, so look at the fourth term.",
    "why": "The coefficients of $\\ln(1+x)$ are just $\\frac{(-1)^{n+1}}{n}$ — more direct than four rounds of L'Hôpital's Rule.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "The fourth term of $\\ln(1+x)$ is $-\\frac{x^4}{4}$ (even-power terms are negative), and the next is $+\\frac{x^5}{5}$.",
      "After subtracting, the numerator $=-\\frac{x^4}{4}+\\cdots$; dividing by $x^4$ gives $-\\frac{1}{4}$."
    ],
    "trap": "Getting the sign wrong and answering $\\frac{1}{4}$. The even-power terms of $\\ln(1+x)$ are negative.",
    "check": "At $x=0.1$ the ratio is about $-0.232$, near $-\\frac{1}{4}$; the difference is $+\\frac{x}{5}$."
  },
  "uni-lim-006": {
    "spot": "$x\\to\\infty$ but the expression contains $\\ln\\left(1+\\frac{1}{x}\\right)$: substitute $u=\\frac{1}{x}\\to 0^+$ and it becomes an expansion of $\\ln(1+u)$ near $0$.",
    "why": "As written it is an $\\infty\\cdot 0$ form; after the substitution it is $\\frac{0}{0}$, and a Taylor expansion to $u^2$ reads off the answer.",
    "steps": [
      "Let $u=\\frac{1}{x}$: the expression $=\\frac{(1+u)\\ln(1+u)-u}{u^2}$.",
      "$(1+u)\\left(u-\\frac{u^2}{2}+\\frac{u^3}{3}-\\cdots\\right)=u+\\frac{u^2}{2}-\\frac{u^3}{6}+\\cdots$.",
      "Subtract $u$ and divide by $u^2$: $\\frac{1}{2}-\\frac{u}{6}+\\cdots\\to\\frac{1}{2}$."
    ],
    "trap": "Expanding only to $\\ln(1+u)\\approx u$ gives $(1+u)u-u=u^2$ and the answer $1$. That misses the cancellation between $-\\frac{u^2}{2}$ and $u\\cdot u$.",
    "check": "Plug in $x=100$: the value is about $0.4983$, slightly less than $\\frac{1}{2}$; the difference is $\\frac{1}{6x}$."
  },
  "uni-lim-011": {
    "spot": "$\\ln(1+\\sin x)$ is a composition, and the denominator is only $x^2$: expanding $\\ln(1+u)$ and $\\sin x$ each to second order is enough.",
    "why": "Two rounds of L'Hôpital's Rule also work, but the second derivative of $\\ln(1+\\sin x)$ is messy; the expansion only needs $\\sin x=x+O(x^3)$.",
    "steps": [
      "$\\ln(1+u)=u-\\frac{u^2}{2}+\\cdots$; substitute $u=\\sin x$.",
      "$\\sin x=x-\\frac{x^3}{6}+\\cdots$ differs from $x$ only at third order and above, so it contributes nothing to $x^2$.",
      "So $\\ln(1+\\sin x)=x-\\frac{x^2}{2}+O(x^3)$; subtract $x$ and divide by $x^2$ to get $-\\frac{1}{2}$."
    ],
    "trap": "Writing only $\\ln(1+\\sin x)\\approx\\sin x\\approx x$, so the numerator $\\approx 0$ and the answer is $0$. The second-order term $-\\frac{\\sin^2 x}{2}$ is the whole story.",
    "check": "At $x=0.01$ the ratio is about $-0.4967$, near $-\\frac{1}{2}$."
  },
  "uni-lim-014": {
    "spot": "$\\frac{1}{\\sqrt{1+x^2}}$ and $\\cos x$ are both $1-\\frac{x^2}{2}+\\cdots$: the first two terms match and cancel on subtraction; the denominator is $x^4$, so compare the $x^4$ coefficients.",
    "why": "Both have ready-made expansions (binomial, cosine), so just compare coefficients; four rounds of L'Hôpital's Rule would be ugly.",
    "steps": [
      "Binomial expansion: $(1+x^2)^{-1/2}=1-\\frac{x^2}{2}+\\frac{3}{8}x^4-\\cdots$.",
      "$\\cos x=1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\cdots$.",
      "Subtract: the $x^4$ coefficient is $\\frac{3}{8}-\\frac{1}{24}=\\frac{1}{3}$.",
      "Divide by $x^4$: $\\frac{1}{3}$."
    ],
    "trap": "Getting the binomial coefficient wrong: $\\binom{-1/2}{2}=\\frac{(-\\frac{1}{2})(-\\frac{3}{2})}{2}=\\frac{3}{8}$; a common slip is $\\frac{1}{8}$, which gives $\\frac{1}{12}$.",
    "check": "At $x=0.1$ the ratio is about $0.3327$, near $\\frac{1}{3}$."
  },
  "uni-ser-001": {
    "spot": "The general term is $n\\cdot r^n$ ($r=\\frac{1}{4}$): a geometric series with an extra factor $n$ — differentiating a geometric series produces exactly that $n$.",
    "why": "Differentiate $\\sum r^n=\\frac{1}{1-r}$ and multiply by $r$ to get $\\sum nr^n=\\frac{r}{(1-r)^2}$, faster than shift-and-subtract.",
    "steps": [
      "Geometric series $\\sum_{n\\ge 0}r^n=\\frac{1}{1-r}$, which is $\\frac{4}{3}$ at $r=\\frac{1}{4}$.",
      "Differentiate in $r$: $\\sum nr^{n-1}=\\frac{1}{(1-r)^2}$, which is $\\frac{16}{9}$ at $r=\\frac{1}{4}$.",
      "Multiply back by $r$: $\\sum nr^n=\\frac{1}{4}\\cdot\\frac{16}{9}=\\frac{4}{9}$."
    ],
    "trap": "Forgetting to multiply back by $r$ after differentiating, and answering $\\frac{16}{9}$.",
    "check": "Add it up directly: $\\sum\\frac{n}{4^n}=\\frac{1}{4}+\\frac{2}{16}+\\frac{3}{64}+\\cdots$ is indeed $\\frac{4}{9}\\approx 0.444$."
  },
  "uni-ser-008": {
    "spot": "The power series coefficients are $\\frac{(n!)^2}{(2n)!}$, full of factorials: the Ratio Test makes the factorials of consecutive terms cancel.",
    "why": "The ratio $\\frac{a_{n+1}}{a_n}$ becomes a ratio of polynomials whose limit is the reciprocal of the radius; the Root Test would need $n$-th roots of factorials, which is painful.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)^2}{(2n+1)(2n+2)}=\\frac{n+1}{2(2n+1)}$.",
      "As $n\\to\\infty$ it tends to $\\frac{1}{4}$.",
      "$R=\\frac{1}{1/4}=4$."
    ],
    "trap": "Dividing $(2n+2)!$ by $(2n)!$ and keeping only $(2n+2)$, missing $(2n+1)$: the ratio limit goes wrong in a $\\frac{1}{2}\\cdot\\infty$ way, or you answer $2$. $(2n+2)!=(2n+2)(2n+1)(2n)!$.",
    "check": "The ratio $\\frac{n+1}{2(2n+1)}$ stays above $\\frac{1}{4}$ and decreases toward it; e.g. at $n=10$ it is $\\frac{11}{42}\\approx 0.262$."
  },
  "world-012": {
    "spot": "An $\\infty-\\infty$ form that is a difference of squares: $\\frac{1}{x^2}-\\cot^2x=\\left(\\frac{1}{x}-\\cot x\\right)\\left(\\frac{1}{x}+\\cot x\\right)$, and each factor has a clean limit.",
    "why": "After a common denominator, L'Hôpital's Rule takes several rounds; after factoring, one factor is of order $\\frac{1}{3}x$ and the other of order $\\frac{2}{x}$, so the product shows the answer immediately.",
    "steps": [
      "$\\cot x=\\frac{1}{x}-\\frac{x}{3}-\\frac{x^3}{45}-\\cdots$, so $\\frac{1}{x}-\\cot x\\approx\\frac{x}{3}$.",
      "$\\frac{1}{x}+\\cot x\\approx\\frac{2}{x}$.",
      "Split as a difference of squares, multiply the two factors by $\\frac{1}{x}$ and $x$ respectively, then multiply: $\\frac{1}{3}\\cdot 2=\\frac{2}{3}$.",
      "The limit $=\\frac{2}{3}$."
    ],
    "trap": "Thinking $\\cot^2 x\\approx\\frac{1}{x^2}$ so the difference is $0$; or squaring $\\cot x\\approx\\frac{1}{x}-\\frac{x}{3}$ but dropping the cross term and answering $\\frac{1}{3}$. The cross term $2\\cdot\\frac{1}{x}\\cdot\\frac{x}{3}=\\frac{2}{3}$ is the answer.",
    "check": "At $x=0.01$ the value is about $0.66669$, near $\\frac{2}{3}$."
  },
  "world-013": {
    "spot": "The base $\\frac{e^x-1}{x}\\to 1$ and the exponent $\\frac{1}{x}\\to\\infty$: a $1^\\infty$ form — take logs to get $\\frac{\\ln(\\text{base})}{x}$.",
    "why": "Always take logs for $1^\\infty$; once the base is expanded as $1+\\frac{x}{2}+\\cdots$, $\\ln(1+u)\\approx u$ finishes it in one step.",
    "steps": [
      "$\\frac{e^x-1}{x}=1+\\frac{x}{2}+\\frac{x^2}{6}+\\cdots$.",
      "Take logs: $\\frac{1}{x}\\ln\\frac{e^x-1}{x}\\approx\\frac{1}{x}\\cdot\\frac{x}{2}\\to\\frac{1}{2}$.",
      "The original limit $=e^{1/2}$."
    ],
    "trap": "Answering $1$ because the base tends to $1$. The exponent goes to infinity at the same time — this is an indeterminate form.",
    "check": "At $x=0.01$ the value is about $1.650$, very close to $\\sqrt e\\approx 1.6487$."
  },
  "world-014": {
    "spot": "The interval $[0,\\frac{\\pi}{4}]$ together with $\\tan x$: substituting $\\frac{\\pi}{4}-x$ gives $1+\\tan\\left(\\frac{\\pi}{4}-x\\right)=\\frac{2}{1+\\tan x}$, and the log splits that into $\\ln 2$ minus the original.",
    "why": "$\\ln(1+\\tan x)$ has no elementary antiderivative; the symmetric substitution makes the integral equal a constant minus itself, so you can solve for it.",
    "steps": [
      "$\\tan\\left(\\frac{\\pi}{4}-x\\right)=\\frac{1-\\tan x}{1+\\tan x}$, so $\\left(1+\\tan\\left(\\frac{\\pi}{4}-x\\right)\\right)(1+\\tan x)=2$.",
      "Substitute $x\\to\\frac{\\pi}{4}-x$: $I=\\int_0^{\\pi/4}\\ln\\frac{2}{1+\\tan x}\\,dx=\\int_0^{\\pi/4}\\ln 2\\,dx-I$.",
      "$2I=\\frac{\\pi\\ln 2}{4}$, so $I=\\frac{\\pi\\ln 2}{8}$."
    ],
    "trap": "Not simplifying after the substitution and treating $\\ln\\frac{2}{1+\\tan x}$ as $\\ln 2$, answering $\\frac{\\pi\\ln 2}{4}$ — missing the division by $2$.",
    "check": "The integrand increases from $0$ to $\\ln 2$, so the integral lies between $0$ and $\\frac{\\pi}{4}\\ln 2\\approx 0.544$; the answer $\\approx 0.272$ is exactly half."
  },
  "world-025": {
    "spot": "You need the $x^5$ coefficient of $\\tan x$: $\\tan x$ satisfies $(\\tan x)'=1+\\tan^2x$, so the coefficients can be built up from the low-order ones.",
    "why": "Computing the fifth derivative of $\\tan x$ by brute force is tedious; long division of $\\frac{\\sin x}{\\cos x}$ works too, but the differential-equation recursion is cleanest.",
    "steps": [
      "Let $\\tan x=x+a_3x^3+a_5x^5+\\cdots$ (odd function, and $\\tan'(0)=1$). $(\\tan x)'=1+\\tan^2x$.",
      "Match $x^2$ coefficients: $3a_3=1$, $a_3=\\frac{1}{3}$.",
      "Match $x^4$ coefficients: the left side is $5a_5$; on the right, the $x^4$ coefficient of $\\tan^2x$ is $2a_3=\\frac{2}{3}$, so $a_5=\\frac{2}{15}$.",
      "The $x^5$ coefficient is $\\frac{2}{15}$."
    ],
    "trap": "Dividing the coefficients of $\\sin x$ and $\\cos x$ directly (something like $\\frac{1/120}{1/24}$), or counting the cross term of $\\tan^2x$ only once and answering $\\frac{1}{15}$.",
    "check": "At $x=0.1$, $\\frac{\\tan x-x-x^3/3}{x^5}\\approx 0.1337$, near $\\frac{2}{15}\\approx 0.1333$."
  },
  "world-026": {
    "spot": "The numerator is $e^x$ minus $1+x+\\frac{x^2}{2}$ (the first three terms), the denominator $x^3$: the answer is the $x^3$ coefficient $\\frac{1}{3!}$.",
    "why": "L'Hôpital's Rule would take three rounds; one line of Taylor expansion reads off the coefficient.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "$e^x=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\frac{x^4}{24}+\\cdots$.",
      "After subtracting, the numerator $=\\frac{x^3}{6}+\\cdots$; dividing by $x^3$ gives $\\frac{1}{6}$."
    ],
    "trap": "Writing the coefficient as $\\frac{1}{3}$ (forgetting the factorial). The $x^3$ coefficient is $\\frac{1}{3!}=\\frac{1}{6}$.",
    "check": "At $x=0.01$ the ratio is about $0.16708$, a bit above $\\frac{1}{6}$ — by exactly $\\frac{x}{24}$."
  },
  "world-032": {
    "spot": "On $[0,1]$ there is $\\frac{1}{1+x^2}$ — expand it as $\\sum(-1)^nx^{2n}$; what remains, $x^{2n}(\\ln x)^2$, has a ready-made integral $\\frac{2}{(2n+1)^3}$.",
    "why": "There is no elementary antiderivative; integrating term by term turns it into a known alternating series.",
    "steps": [
      "$\\frac{1}{1+x^2}=\\sum_{n\\ge 0}(-1)^nx^{2n}$ ($0\\le x<1$).",
      "$\\int_0^1x^{2n}(\\ln x)^2\\,dx=\\frac{2}{(2n+1)^3}$ (let $x=e^{-t}$, or integrate by parts twice).",
      "So $I=2\\sum_{n\\ge 0}\\frac{(-1)^n}{(2n+1)^3}=2\\cdot\\frac{\\pi^3}{32}$.",
      "$I=\\frac{\\pi^3}{16}$."
    ],
    "trap": "Writing $\\int_0^1x^{2n}\\ln^2x\\,dx$ as $\\frac{1}{(2n+1)^3}$, missing the $2$, and getting $\\frac{\\pi^3}{32}$.",
    "check": "Bounds: $\\frac{1}{2}\\le\\frac{1}{1+x^2}\\le 1$ and $\\int_0^1\\ln^2x\\,dx=2$, so the answer is between $1$ and $2$; $\\frac{\\pi^3}{16}\\approx 1.94$."
  },
  "world-040": {
    "spot": "The numerator is $(1+x)^{1/x}$ minus $e-\\frac{e}{2}x$, the denominator $x^2$: the problem asks for the $x^2$ coefficient of $(1+x)^{1/x}$ expanded near $0$.",
    "why": "Expand the exponent $\\frac{\\ln(1+x)}{x}$ first, then apply the expansion of $e^u$ — far safer than two rounds of L'Hôpital's Rule (the derivatives are horrible).",
    "steps": [
      "$(1+x)^{1/x}=e^{\\ln(1+x)/x}$, and $\\frac{\\ln(1+x)}{x}=1-\\frac{x}{2}+\\frac{x^2}{3}-\\cdots$.",
      "So $(1+x)^{1/x}=e\\cdot e^{u}$ with $u=-\\frac{x}{2}+\\frac{x^2}{3}+\\cdots$.",
      "$e^u=1+u+\\frac{u^2}{2}+\\cdots=1-\\frac{x}{2}+\\left(\\frac{1}{3}+\\frac{1}{8}\\right)x^2+\\cdots$; the $x^2$ coefficient is $\\frac{11}{24}$.",
      "Subtract $e-\\frac{e}{2}x$ and divide by $x^2$: the limit $=\\frac{11e}{24}$."
    ],
    "trap": "Expanding $e^u$ only to $1+u$ misses $\\frac{u^2}{2}=\\frac{x^2}{8}$ and gives $\\frac{e}{3}$.",
    "check": "At $x=0.01$ the ratio is about $1.241$, near $\\frac{11e}{24}\\approx 1.246$."
  },
  "world-046": {
    "spot": "$x^{1/x}=e^{\\ln x/x}$, and the subtracted $1+\\frac{\\ln x}{x}$ is exactly the first two terms of $e^s$ ($s=\\frac{\\ln x}{x}$); the denominator is $\\frac{(\\ln x)^2}{x^2}=s^2$.",
    "why": "After substituting $s=\\frac{\\ln x}{x}\\to 0$, the whole problem is $\\frac{e^s-1-s}{s^2}$ — one line of Taylor expansion.",
    "steps": [
      "$x^{1/x}=e^{\\ln x/x}$.",
      "Let $s=\\frac{\\ln x}{x}$; as $x\\to\\infty$, $s\\to 0^+$ (e.g. at $x=10^6$, $s<10^{-4}$). The expression $=\\frac{e^s-1-s}{s^2}$.",
      "$e^s-1-s=\\frac{s^2}{2}+\\frac{s^3}{6}+\\cdots$; dividing by $s^2$ gives $\\frac{1}{2}$."
    ],
    "trap": "Thinking $x^{1/x}\\to 1$ makes the numerator $0$ and answering $0$; the numerator does go to $0$, but you have to compare its speed with the denominator $\\frac{(\\ln x)^2}{x^2}$.",
    "check": "Plug in $x=10^6$: the value is about $0.500002$."
  },
  "world-053": {
    "spot": "The denominator $n^2-1=(n-1)(n+1)$: partial fractions $\\frac{1}{2}\\left(\\frac{1}{n-1}-\\frac{1}{n+1}\\right)$, and with $(-1)^n$ both pieces are alternating harmonic series.",
    "why": "With signs, the telescoping is not clean, but both pieces can be matched to $\\ln 2$.",
    "steps": [
      "$\\frac{1}{n^2-1}=\\frac{1}{2}\\left(\\frac{1}{n-1}-\\frac{1}{n+1}\\right)$.",
      "$\\sum_{n\\ge 2}\\frac{(-1)^n}{n-1}=1-\\frac{1}{2}+\\frac{1}{3}-\\cdots=\\ln 2$.",
      "$\\sum_{n\\ge 2}\\frac{(-1)^n}{n+1}=\\frac{1}{3}-\\frac{1}{4}+\\cdots=\\ln 2-\\frac{1}{2}$.",
      "$\\frac{1}{2}\\left(\\ln 2-\\left(\\ln 2-\\frac{1}{2}\\right)\\right)=\\frac{1}{4}$."
    ],
    "trap": "Starting the second piece at the wrong place (from $\\frac{1}{2}$) gives a wrong value like $\\ln 2$. At $n=2$, $\\frac{1}{n+1}=\\frac{1}{3}$.",
    "check": "The first two terms give $\\frac{1}{3}-\\frac{1}{8}\\approx 0.208$; adding $\\frac{1}{15}$ gives $0.275$; $\\frac{1}{4}$ sits in between."
  },
  "world-056": {
    "spot": "On $[0,1]$, $\\ln(1+x)$ expands as a power series, and what remains, $x^k\\ln x$, has the formula $\\int_0^1x^k\\ln x\\,dx=-\\frac{1}{(k+1)^2}$.",
    "why": "Integration by parts produces something harder like $\\int\\frac{x\\ln x}{1+x}$; integrating term by term gives a series that splits apart directly.",
    "steps": [
      "$\\ln(1+x)=\\sum_{k\\ge 1}\\frac{(-1)^{k+1}}{k}x^k$, and $\\int_0^1x^k\\ln x\\,dx=-\\frac{1}{(k+1)^2}$.",
      "So $I=\\sum_{k\\ge 1}\\frac{(-1)^k}{k(k+1)^2}$, with partial fractions $\\frac{1}{k(k+1)^2}=\\frac{1}{k}-\\frac{1}{k+1}-\\frac{1}{(k+1)^2}$.",
      "The three pieces are $-\\ln 2$, $-(\\ln 2-1)$ and $-\\left(\\frac{\\pi^2}{12}-1\\right)$.",
      "Add them: $-\\ln 2-\\ln 2+1-\\frac{\\pi^2}{12}+1=2-2\\ln 2-\\frac{\\pi^2}{12}$."
    ],
    "trap": "Shifting the starting index of $\\sum\\frac{(-1)^{k}}{(k+1)^2}$ (taking it as $-\\frac{\\pi^2}{12}$ and forgetting the missing $m=1$ term) makes the total off by $1$.",
    "check": "The integrand is negative on $(0,1)$ ($\\ln x<0$, $\\ln(1+x)>0$), so the answer $\\approx-0.209$ is negative, and it is larger than $\\ln 2\\cdot\\int_0^1\\ln x\\,dx=-\\ln 2$."
  },
  "world-060": {
    "spot": "$\\sum\\frac{(-1)^n}{(2n+1)^3}$ is exactly the term-by-term expansion of $\\frac{1}{2}\\int_0^1\\frac{(\\ln x)^2}{1+x^2}\\,dx$; and that integral comes from differentiating $\\int_0^\\infty\\frac{x^s}{1+x^2}\\,dx$ twice with respect to $s$.",
    "why": "The alternating sum of odd cubes has no elementary telescoping; turn it back into an integral, then use differentiation under the parameter plus the $x\\to\\frac{1}{x}$ symmetry.",
    "steps": [
      "$\\int_0^1x^{2n}(\\ln x)^2\\,dx=\\frac{2}{(2n+1)^3}$, so $S=\\frac{1}{2}\\int_0^1\\frac{(\\ln x)^2}{1+x^2}\\,dx$.",
      "$x\\to\\frac{1}{x}$ makes $\\int_1^\\infty$ equal to $\\int_0^1$, so $\\int_0^1=\\frac{1}{2}\\int_0^\\infty$.",
      "$F(s)=\\int_0^\\infty\\frac{x^s}{1+x^2}\\,dx=\\frac{\\pi}{2\\cos(\\pi s/2)}$, and $F''(0)=\\int_0^\\infty\\frac{(\\ln x)^2}{1+x^2}\\,dx=\\frac{\\pi^3}{8}$.",
      "$S=\\frac{1}{2}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi^3}{8}=\\frac{\\pi^3}{32}$."
    ],
    "trap": "Assuming you can just cube $\\sum\\frac{(-1)^n}{2n+1}=\\frac{\\pi}{4}$ and answering $\\frac{\\pi^3}{64}$. The cubic version has to be computed separately.",
    "check": "Alternating series bounds: $1-\\frac{1}{27}<S<1$, and $\\frac{\\pi^3}{32}\\approx 0.969$ is inside."
  },
  "world-062": {
    "spot": "On $[0,1]$, $\\frac{1}{1-x^2}$ is the geometric series $\\sum x^{2n}$; paired with $\\ln x$, each term is $\\int_0^1x^{2n}\\ln x\\,dx=-\\frac{1}{(2n+1)^2}$.",
    "why": "No elementary antiderivative; integrating term by term turns it directly into the sum of reciprocal odd squares, $\\frac{\\pi^2}{8}$.",
    "steps": [
      "$\\frac{1}{1-x^2}=\\sum_{n\\ge 0}x^{2n}$.",
      "$\\int_0^1x^{2n}\\ln x\\,dx=-\\frac{1}{(2n+1)^2}$.",
      "$\\sum_{n\\ge 0}\\frac{1}{(2n+1)^2}=\\frac{\\pi^2}{6}\\cdot\\frac{3}{4}=\\frac{\\pi^2}{8}$ (remove the even terms, which make up $\\frac{1}{4}$).",
      "$I=-\\frac{\\pi^2}{8}$."
    ],
    "trap": "Using $\\frac{\\pi^2}{6}$ for the odd-square sum and answering $-\\frac{\\pi^2}{6}$. You must remove the even quarter.",
    "check": "The integrand is negative throughout $(0,1)$ and more negative than $\\ln x$, so the answer is below $\\int_0^1\\ln x\\,dx=-1$; $-\\frac{\\pi^2}{8}\\approx-1.234$."
  },
  "world-071": {
    "spot": "Divide top and bottom of $\\frac{n}{n^2+k^2}$ by $n^2$ to get $\\frac{1}{n}\\cdot\\frac{1}{1+(k/n)^2}$: a classic Riemann sum for $f(x)=\\frac{1}{1+x^2}$ on $[0,1]$.",
    "why": "The sum has no closed form; once you assemble $\\frac{1}{n}$ and $\\frac{k}{n}$, the limit becomes a definite integral.",
    "steps": [
      "$\\frac{n}{n^2+k^2}=\\frac{1}{n}\\cdot\\frac{1}{1+(k/n)^2}$.",
      "$\\Delta x=\\frac{1}{n}$, $x_k=\\frac{k}{n}\\in(0,1]$, so the limit $=\\int_0^1\\frac{dx}{1+x^2}$.",
      "$=\\arctan 1=\\frac{\\pi}{4}$."
    ],
    "trap": "Seeing terms of size $\\frac{n}{n^2}$ and concluding each term $\\to 0$, so the sum $\\to 0$. The number of terms $n$ is growing too — treat it as a Riemann sum.",
    "check": "At $n=1$ the sum is $\\frac{1}{2}$; $f$ is decreasing so right-endpoint sums underestimate, and the limit must exceed $\\frac{1}{2}$ — $\\frac{\\pi}{4}\\approx 0.785$ fits."
  },
  "world-072": {
    "spot": "The denominator is $(a+\\cos x)^2$ with $a=2$: $\\frac{1}{(a+\\cos x)^2}=-\\frac{\\partial}{\\partial a}\\frac{1}{a+\\cos x}$, and $\\int_0^{2\\pi}\\frac{dx}{a+\\cos x}=\\frac{2\\pi}{\\sqrt{a^2-1}}$ is a standard result.",
    "why": "The half-angle substitution leads to a rational function with a squared denominator, which is tedious; differentiating once in the parameter $a$ gets the answer from a known formula.",
    "steps": [
      "$F(a)=\\int_0^{2\\pi}\\frac{dx}{a+\\cos x}=\\frac{2\\pi}{\\sqrt{a^2-1}}$ ($a>1$); at $a=2$ it is $\\frac{2\\pi}{\\sqrt 3}$.",
      "Differentiate in $a$: $F'(a)=-\\int_0^{2\\pi}\\frac{dx}{(a+\\cos x)^2}$, so the integral we want $=-F'(2)$.",
      "$-F'(a)=\\frac{2\\pi a}{(a^2-1)^{3/2}}$; at $a=2$: $\\frac{4\\pi}{3\\sqrt 3}$."
    ],
    "trap": "Thinking $\\int\\frac{1}{(2+\\cos x)^2}=\\left(\\frac{2\\pi}{\\sqrt 3}\\right)^2$ or similar — pulling the square outside the integral. Differentiating in the parameter is where the square correctly comes from.",
    "check": "The integrand lies between $\\frac{1}{9}$ and $1$, so the answer must be between $\\frac{2\\pi}{9}$ and $2\\pi$; $\\frac{4\\pi}{3\\sqrt 3}\\approx 2.42$."
  },
  "world-073": {
    "spot": "$\\int_0^\\pi\\ln(a-\\cos x)\\,dx$ at $a=2$: differentiating in the parameter $a$ removes the $\\ln$, leaving the standard integral $\\int_0^\\pi\\frac{dx}{a-\\cos x}=\\frac{\\pi}{\\sqrt{a^2-1}}$.",
    "why": "$\\ln(2-\\cos x)$ has no elementary antiderivative; Feynman's trick (differentiate in a parameter) finds $I'(a)$ first, then integrates back, fixing the constant with $a\\to\\infty$.",
    "steps": [
      "$I(a)=\\int_0^\\pi\\ln(a-\\cos x)\\,dx$, $I'(a)=\\int_0^\\pi\\frac{dx}{a-\\cos x}=\\frac{\\pi}{\\sqrt{a^2-1}}$.",
      "Integrate back: $I(a)=\\pi\\ln\\left(a+\\sqrt{a^2-1}\\right)+C$ (the derivative matches).",
      "For large $a$, $I(a)\\approx\\pi\\ln a$, while $\\pi\\ln(a+\\sqrt{a^2-1})\\approx\\pi\\ln(2a)$, so $C=-\\pi\\ln 2$. It checks out at $a=100$.",
      "$I(2)=\\pi\\ln\\frac{2+\\sqrt 3}{2}$."
    ],
    "trap": "Forgetting to determine the constant $C$ and answering $\\pi\\ln(2+\\sqrt 3)$, which is too big by $\\pi\\ln 2$.",
    "check": "$\\ln(2-\\cos x)$ lies between $\\ln 1=0$ and $\\ln 3$, so the answer must be between $0$ and $\\pi\\ln 3$; it is $\\approx 1.96$."
  },
  "world-078": {
    "spot": "$\\sum\\frac{x^n}{n^2}$ at $x=\\frac{1}{2}$ — the dilogarithm $\\operatorname{Li}_2\\left(\\frac{1}{2}\\right)$; $\\frac{1}{2}$ is where $x$ and $1-x$ coincide, so use the reflection formula for $\\operatorname{Li}_2(x)+\\operatorname{Li}_2(1-x)$.",
    "why": "The series does not telescope; the reflection formula makes $\\operatorname{Li}_2\\left(\\frac{1}{2}\\right)$ appear twice, so you can solve for it.",
    "steps": [
      "$\\operatorname{Li}_2(x)=\\sum\\frac{x^n}{n^2}=-\\int_0^x\\frac{\\ln(1-t)}{t}\\,dt$, $\\operatorname{Li}_2'(x)=-\\frac{\\ln(1-x)}{x}$.",
      "$\\frac{d}{dx}\\left[\\operatorname{Li}_2(x)+\\operatorname{Li}_2(1-x)\\right]=-\\frac{\\ln(1-x)}{x}+\\frac{\\ln x}{1-x}=\\frac{d}{dx}\\left[-\\ln x\\ln(1-x)\\right]$.",
      "So $\\operatorname{Li}_2(x)+\\operatorname{Li}_2(1-x)=\\frac{\\pi^2}{6}-\\ln x\\ln(1-x)$ (fix the constant with $x\\to 0$, using $\\operatorname{Li}_2(1)=\\frac{\\pi^2}{6}$).",
      "$x=\\frac{1}{2}$: $2\\operatorname{Li}_2\\left(\\frac{1}{2}\\right)=\\frac{\\pi^2}{6}-\\ln^2 2$, giving $\\frac{\\pi^2}{12}-\\frac{\\ln^2 2}{2}$."
    ],
    "trap": "Flipping the sign in the reflection formula to $+\\ln x\\ln(1-x)$ gives $\\frac{\\pi^2}{12}+\\frac{\\ln^2 2}{2}\\approx 1.06$, far too large for the series total.",
    "check": "The first two terms give $\\frac{1}{2}+\\frac{1}{16}=0.5625$; the answer $\\approx 0.582$ is slightly larger, yet smaller than $\\sum\\frac{1}{2^n}=1$."
  },
  "world-081": {
    "spot": "$\\frac{1}{\\cosh x}=\\frac{2}{e^x+e^{-x}}=\\frac{2e^x}{e^{2x}+1}$: the numerator $e^x\\,dx$ is exactly $du$ for $u=e^x$, giving $\\frac{2}{1+u^2}$.",
    "why": "Written in exponentials, one substitution leads to $\\arctan$ — no need to remember hyperbolic integral formulas.",
    "steps": [
      "$\\frac{1}{\\cosh x}=\\frac{2e^x}{e^{2x}+1}$.",
      "Let $u=e^x$; $x:0\\to\\infty$ corresponds to $u:1\\to\\infty$: $\\int_1^\\infty\\frac{2\\,du}{1+u^2}$.",
      "$=2\\left(\\frac{\\pi}{2}-\\frac{\\pi}{4}\\right)=\\frac{\\pi}{2}$."
    ],
    "trap": "Not changing the lower limit after substituting, writing $\\int_0^\\infty\\frac{2\\,du}{1+u^2}=\\pi$. $x=0$ corresponds to $u=1$.",
    "check": "The integrand is $\\le 2e^{-x}$, so the integral is $<2$; it is also $\\ge e^{-x}$, so it is $>1$. $\\frac{\\pi}{2}\\approx 1.571$ is in between."
  },
  "world-084": {
    "spot": "$\\ln(1-x)$ blows up at $x=1$ and the denominator is $1+x$: let $t=1-x$ to move the singularity to $0$, then $t=2s$, turning it into $\\int_0^{1/2}\\frac{\\ln s}{1-s}\\,ds$ — the dilogarithm at $\\frac{1}{2}$.",
    "why": "Expanding $\\frac{1}{1+x}$ term by term converges badly; switching to the dilogarithm at $\\frac{1}{2}$ lets you use $\\operatorname{Li}_2\\left(\\frac{1}{2}\\right)=\\frac{\\pi^2}{12}-\\frac{\\ln^2 2}{2}$.",
    "steps": [
      "$t=1-x$: $I=\\int_0^1\\frac{\\ln t}{2-t}\\,dt$.",
      "$t=2s$: $I=\\int_0^{1/2}\\frac{\\ln 2+\\ln s}{1-s}\\,ds=\\ln^2 2+\\int_0^{1/2}\\frac{\\ln s}{1-s}\\,ds$.",
      "$\\frac{d}{dx}\\left[-\\ln x\\ln(1-x)-\\operatorname{Li}_2(x)\\right]=\\frac{\\ln x}{1-x}$, so $\\int_0^{1/2}\\frac{\\ln s}{1-s}\\,ds=-\\ln^2 2-\\operatorname{Li}_2\\left(\\frac{1}{2}\\right)=-\\frac{\\ln^2 2}{2}-\\frac{\\pi^2}{12}$.",
      "$I=\\ln^2 2-\\frac{\\ln^2 2}{2}-\\frac{\\pi^2}{12}=\\frac{\\ln^2 2}{2}-\\frac{\\pi^2}{12}$."
    ],
    "trap": "With $t=2s$, forgetting the $\\ln 2$ in $\\ln(2s)=\\ln 2+\\ln s$, so the result is missing $\\ln^2 2$.",
    "check": "The integrand is negative throughout, and $\\frac{1}{1+x}\\ge\\frac{1}{2}$, so $I\\le\\frac{1}{2}\\int_0^1\\ln(1-x)\\,dx=-\\frac{1}{2}$; the answer is $\\approx-0.582$."
  },
  "world-085": {
    "spot": "The denominator only has $\\sin^2\\theta$ (even power); divide top and bottom by $\\cos^2\\theta$ and everything becomes $\\tan\\theta$ and $\\sec^2\\theta\\,d\\theta$: the classic $u=\\tan\\theta$ substitution.",
    "why": "The universal substitution $t=\\tan\\frac{\\theta}{2}$ leads to a quartic; with only even powers, $u=\\tan\\theta$ goes straight to $\\frac{1}{1+2u^2}$.",
    "steps": [
      "Divide by $\\cos^2\\theta$: $\\frac{1}{1+\\sin^2\\theta}=\\frac{\\sec^2\\theta}{\\sec^2\\theta+\\tan^2\\theta}=\\frac{\\sec^2\\theta}{1+2\\tan^2\\theta}$.",
      "$u=\\tan\\theta$; $\\theta:0\\to\\frac{\\pi}{2}$ corresponds to $u:0\\to\\infty$: $\\int_0^\\infty\\frac{du}{1+2u^2}$.",
      "$=\\frac{1}{\\sqrt 2}\\arctan(\\sqrt 2u)\\Big|_0^\\infty=\\frac{\\pi}{2\\sqrt 2}$."
    ],
    "trap": "Forgetting the factor $\\frac{1}{\\sqrt 2}$ in $\\int\\frac{du}{1+2u^2}$ and answering $\\frac{\\pi}{2}$.",
    "check": "The integrand is between $\\frac{1}{2}$ and $1$, so the integral is between $\\frac{\\pi}{4}$ and $\\frac{\\pi}{2}$; $\\frac{\\pi}{2\\sqrt 2}\\approx 1.11$."
  },
  "world-086": {
    "spot": "Summing $\\frac{1}{n^6}$ over the odd terms only: take all of $\\zeta(6)$ and remove the even terms, and the even terms $\\frac{1}{(2n)^6}$ are exactly $\\frac{1}{64}\\zeta(6)$.",
    "why": "With the known value $\\zeta(6)=\\frac{\\pi^6}{945}$, splitting odd and even gets there in one step — no separate summation needed.",
    "steps": [
      "$\\zeta(6)=\\sum\\frac{1}{n^6}=\\frac{\\pi^6}{945}$.",
      "Even terms: $\\sum\\frac{1}{(2n)^6}=\\frac{1}{64}\\zeta(6)$.",
      "Odd terms $=\\left(1-\\frac{1}{64}\\right)\\zeta(6)=\\frac{63}{64}\\cdot\\frac{\\pi^6}{945}=\\frac{\\pi^6}{960}$."
    ],
    "trap": "Writing the even terms as $\\frac{1}{2}\\zeta(6)$ (assuming a half-and-half split) gives $\\frac{\\pi^6}{1890}$. The even terms are smaller by a factor of $2^6=64$.",
    "check": "The first term is $1$ and the second, $\\frac{1}{729}$, is tiny; the answer $\\approx 1.0014$ is just a hair above $1$."
  },
  "world-092": {
    "spot": "$\\ln(1-x)$ is singular at $x=1$; let $u=1-x$ to turn it into $(1-u)\\ln u$, and both terms have the standard form $\\int_0^1u^k\\ln u\\,du=-\\frac{1}{(k+1)^2}$.",
    "why": "Integrating by parts directly with $\\frac{x^2}{2}\\cdot\\frac{1}{1-x}$ blows up at $x=1$ and needs separate handling; substituting first leaves just two formula values.",
    "steps": [
      "$u=1-x$: $\\int_0^1x\\ln(1-x)\\,dx=\\int_0^1(1-u)\\ln u\\,du$.",
      "$\\int_0^1\\ln u\\,du=-1$.",
      "$\\int_0^1u\\ln u\\,du=-\\frac{1}{4}$.",
      "Subtract: $-1-\\left(-\\frac{1}{4}\\right)=-\\frac{3}{4}$."
    ],
    "trap": "Integrating by parts with $v=\\frac{x^2}{2}$: the boundary term $\\frac{x^2}{2}\\ln(1-x)$ is infinite at $x=1$, so you get stuck or wrongly write it as $0$. Choosing $v=\\frac{x^2-1}{2}$ cancels the singularity.",
    "check": "The integrand is negative throughout $(0,1)$; and since $x\\le 1$, $|x\\ln(1-x)|\\le|\\ln(1-x)|$, so the answer lies between $-1$ and $0$."
  },
  "world-093": {
    "spot": "You need the $x^4$ coefficient of $e^{\\sin x}$: outer $e^u$, inner $u=\\sin x=x-\\frac{x^3}{6}+\\cdots$; substitute the expansion and collect only up to $x^4$.",
    "why": "Finding the fourth derivative and dividing by $4!$ is tedious; in the composed expansion each $u^k$ only needs to go up to $x^4$.",
    "steps": [
      "$e^u=1+u+\\frac{u^2}{2}+\\frac{u^3}{6}+\\frac{u^4}{24}+\\cdots$, $u=x-\\frac{x^3}{6}+O(x^5)$.",
      "The $x^4$ coefficient from each term: $u$ has no $x^4$; $\\frac{u^2}{2}$ gives $\\frac{1}{2}\\cdot 2\\cdot\\left(-\\frac{1}{6}\\right)=-\\frac{1}{6}$; $\\frac{u^3}{6}$ has none; $\\frac{u^4}{24}$ gives $\\frac{1}{24}$.",
      "The $x^4$ coefficient is $-\\frac{1}{8}$."
    ],
    "trap": "Missing the cross term $-\\frac{x^4}{3}$ in $u^2=(x-\\frac{x^3}{6})^2$, counting only $\\frac{u^4}{24}$, and answering $\\frac{1}{24}$.",
    "check": "Look at $x^3$ too: the $\\frac{1}{6}$ from $\\frac{u^3}{6}$ cancels the $-\\frac{1}{6}$ from $u$, so $e^{\\sin x}=1+x+\\frac{x^2}{2}-\\frac{x^4}{8}+\\cdots$; at $x=0.1$, $\\frac{e^{\\sin x}-1-x-x^2/2}{x^4}\\approx-0.12$."
  },
  "world-095": {
    "spot": "$\\sin x\\ln(\\sin x)$: to get rid of $\\ln$, differentiate it and integrate $\\sin x$ — integration by parts; choose the antiderivative $1-\\cos x$ (zero at $0$) so the boundary term is clean.",
    "why": "With $v=-\\cos x$ the boundary term at $x\\to 0$ is $-\\ln 0$ and blows up; choosing $v=1-\\cos x$ makes the boundary term $0$.",
    "steps": [
      "$u=\\ln\\sin x$, $v=1-\\cos x$: the boundary term $(1-\\cos x)\\ln\\sin x$ is $0$ at both ends.",
      "What remains is $-\\int_0^{\\pi/2}(1-\\cos x)\\frac{\\cos x}{\\sin x}\\,dx$, and $\\frac{1-\\cos x}{\\sin x}=\\frac{\\sin x}{1+\\cos x}$.",
      "$=-\\int_0^{\\pi/2}\\frac{\\sin x\\cos x}{1+\\cos x}\\,dx$; let $w=\\cos x$: $-\\int_0^1\\frac{w}{1+w}\\,dw=-(1-\\ln 2)$.",
      "$I=\\ln 2-1$."
    ],
    "trap": "Taking $v=-\\cos x$: the boundary term $-\\cos x\\ln\\sin x$ diverges at the $0$ end, and dropping it as $0$ gives a wrong final answer.",
    "check": "$\\ln\\sin x\\le 0$, so $I<0$; also $I>\\int_0^{\\pi/2}\\ln\\sin x\\,dx=-\\frac{\\pi}{2}\\ln 2$. The answer is $\\approx-0.307$."
  },
  "world-096": {
    "spot": "The base $\\frac{\\sinh x}{x}\\to 1$ and the exponent $\\frac{1}{x^2}\\to\\infty$: a $1^\\infty$ form, so take logs; the quadratic term of $\\frac{\\sinh x}{x}=1+\\frac{x^2}{6}+\\cdots$ pairs perfectly with $\\frac{1}{x^2}$.",
    "why": "After taking logs, $\\ln(1+u)\\approx u$ finishes it in one line; L'Hôpital's Rule runs into very long quotients.",
    "steps": [
      "$\\sinh x=x+\\frac{x^3}{6}+\\cdots$, so $\\frac{\\sinh x}{x}=1+\\frac{x^2}{6}+\\cdots$.",
      "$\\frac{1}{x^2}\\ln\\frac{\\sinh x}{x}\\approx\\frac{1}{x^2}\\cdot\\frac{x^2}{6}=\\frac{1}{6}$.",
      "The original limit $=e^{1/6}$."
    ],
    "trap": "Confusing $\\sinh$ with $\\sin$ and writing $1-\\frac{x^2}{6}$, which gives $e^{-1/6}$. The expansion of $\\sinh x$ has all plus signs.",
    "check": "At $x=0.1$ the value is about $1.1813$, almost the same as $e^{1/6}\\approx 1.1814$."
  },
  "world-100": {
    "spot": "$\\frac{1}{\\sin^2x}=\\csc^2x$ is the derivative of $-\\cot x$, paired with the polynomial $x^2$: integrate by parts to lower the power of $x^2$.",
    "why": "Two rounds of integration by parts ($x^2\\to x\\to 1$) turn the problem into the classic $\\int_0^{\\pi/2}\\ln\\sin x\\,dx=-\\frac{\\pi}{2}\\ln 2$.",
    "steps": [
      "$u=x^2$, $dv=\\csc^2x\\,dx$, $v=-\\cot x$: the boundary term $-x^2\\cot x$ is $0$ at $\\frac{\\pi}{2}$, and near $0$ it is $\\approx-x\\to 0$.",
      "What remains is $\\int_0^{\\pi/2}2x\\cot x\\,dx$. Integrate by parts again with $v=\\ln\\sin x$; the boundary term $x\\ln\\sin x$ is $0$ at both ends.",
      "$\\int_0^{\\pi/2}x\\cot x\\,dx=-\\int_0^{\\pi/2}\\ln\\sin x\\,dx=\\frac{\\pi}{2}\\ln 2$.",
      "$I=2\\cdot\\frac{\\pi}{2}\\ln 2=\\pi\\ln 2$."
    ],
    "trap": "Forgetting the factor $2$ after the first integration by parts ($\\frac{d}{dx}x^2=2x$) and answering $\\frac{\\pi}{2}\\ln 2$.",
    "check": "$\\frac{x}{\\sin x}$ lies between $1$ and $\\frac{\\pi}{2}$, so the integrand lies between $1$ and $\\frac{\\pi^2}{4}$; the answer must be between $\\frac{\\pi}{2}$ and $\\frac{\\pi^3}{8}$, and $\\pi\\ln 2\\approx 2.18$."
  },
  "app-012": {
    "spot": "It asks for the maximum curvature over the whole curve: first write $\\kappa(x)$ as a function of $x$, then do an ordinary max/min problem on it.",
    "why": "$y=\\ln x$ is an explicit function; the curvature formula $\\frac{|y''|}{(1+y'^2)^{3/2}}$ simplifies to $\\frac{x}{(1+x^2)^{3/2}}$, and one-variable differentiation does the rest.",
    "steps": [
      "$y'=\\frac{1}{x}$, $y''=-\\frac{1}{x^2}$, $\\kappa=\\frac{1/x^2}{(1+1/x^2)^{3/2}}=\\frac{x}{(1+x^2)^{3/2}}$.",
      "$\\kappa'(x)=\\frac{(1+x^2)-3x^2}{(1+x^2)^{5/2}}=0$ gives $x^2=\\frac{1}{2}$, $x=\\frac{1}{\\sqrt 2}$.",
      "As $x\\to 0^+$ and $x\\to\\infty$, $\\kappa\\to 0$, so this unique critical point is the maximum.",
      "$\\kappa\\left(\\frac{1}{\\sqrt 2}\\right)=\\frac{1/\\sqrt 2}{(3/2)^{3/2}}=\\frac{2}{3\\sqrt 3}$."
    ],
    "trap": "Assuming the curvature is largest at $x=1$ (where $y'=1$) and answering $\\frac{1}{2\\sqrt 2}$. You have to optimize $\\kappa(x)$, not look at the slope.",
    "check": "At $x=1$, $\\kappa=\\frac{1}{2\\sqrt 2}\\approx 0.354$, smaller than the maximum $\\frac{2}{3\\sqrt 3}\\approx 0.385$."
  },
  "burst-boss-int-001": {
    "spot": "$(\\ln x)^2$ times $\\frac{1}{1+x^2}$ from $0$ to $\\infty$: $(\\ln x)^2$ is the second derivative of $x^s$ in $s$ at $s=0$, and $\\int_0^\\infty\\frac{x^s}{1+x^2}\\,dx$ has a closed form.",
    "why": "It cannot be integrated directly; hide the $\\ln$ in a parameter $s$, compute an integral with a known formula, and differentiate twice (Feynman's trick).",
    "steps": [
      "$F(s)=\\int_0^\\infty\\frac{x^s}{1+x^2}\\,dx=\\frac{\\pi}{2\\cos(\\pi s/2)}$ ($|s|<1$); e.g. at $s=\\frac{1}{2}$ it is $\\frac{\\pi}{\\sqrt 2}$.",
      "$\\frac{\\partial^2}{\\partial s^2}x^s=x^s(\\ln x)^2$, so the integral we want $=F''(0)$.",
      "$\\sec u=1+\\frac{u^2}{2}+\\cdots$, so $F(s)=\\frac{\\pi}{2}\\left(1+\\frac{\\pi^2s^2}{8}+\\cdots\\right)$ and $F''(0)=\\frac{\\pi}{2}\\cdot\\frac{\\pi^2}{4}=\\frac{\\pi^3}{8}$.",
      "Numerical check: integrating directly also gives $\\frac{\\pi^3}{8}\\approx 3.876$."
    ],
    "trap": "Thinking $x\\to\\frac{1}{x}$ flips the sign so the integral is $0$ — that is $\\int_0^\\infty\\frac{\\ln x}{1+x^2}=0$; after squaring, the two halves are equal and do not cancel.",
    "check": "Symmetry $x\\to\\frac{1}{x}$: the halves on $[0,1]$ and $[1,\\infty)$ are equal, each $\\frac{\\pi^3}{16}$."
  },
  "burst-boss-int-002": {
    "spot": "$\\ln x$ times a rational function over $\\int_0^\\infty$: $\\ln x$ is the derivative of $x^s$ in $s$, and $\\int_0^\\infty\\frac{x^{s}}{1+x^4}\\,dx=\\frac{\\pi}{4\\sin(\\pi(s+1)/4)}$.",
    "why": "The antiderivative mixes $\\ln$ and $\\arctan$ and is hard; one parameter derivative turns it into differentiating a trig function.",
    "steps": [
      "$F(s)=\\int_0^\\infty\\frac{x^s}{1+x^4}\\,dx=\\frac{\\pi}{4\\sin\\left(\\frac{\\pi(s+1)}{4}\\right)}$; it checks out at $s=\\frac{1}{2}$.",
      "The integral we want $=F'(0)$. $F'(s)=-\\frac{\\pi^2}{16}\\cdot\\frac{\\cos(\\pi(s+1)/4)}{\\sin^2(\\pi(s+1)/4)}$.",
      "$s=0$: $\\cos\\frac{\\pi}{4}=\\frac{\\sqrt 2}{2}$, $\\sin^2\\frac{\\pi}{4}=\\frac{1}{2}$, giving $-\\frac{\\pi^2\\sqrt 2}{16}=-\\frac{\\pi^2}{8\\sqrt 2}$.",
      "Numerical check: integrating directly gives $\\approx-0.872$."
    ],
    "trap": "Borrowing the symmetry argument for $\\int_0^\\infty\\frac{\\ln x}{1+x^2}=0$ and assuming this one is $0$ too. $x\\to\\frac{1}{x}$ turns $\\frac{1}{1+x^4}$ into $\\frac{x^2}{1+x^4}$ — not symmetric.",
    "check": "On $[0,1]$, $\\ln x<0$ and $\\frac{1}{1+x^4}$ is larger, so the negative part wins and the answer should be negative."
  },
  "burst-boss-int-006": {
    "spot": "$\\int_0^\\infty\\frac{dx}{1+x^6}$: $x\\to\\frac{1}{x}$ turns it into $\\int_0^\\infty\\frac{x^4}{1+x^6}$; and $1+x^4$ over $1+x^6$ splits into two easy fractions.",
    "why": "Partial fractions with a degree-six denominator are tedious; using the $x\\to\\frac{1}{x}$ symmetry, adding the two integrals leaves only $\\frac{1}{1+x^2}$ and $\\frac{x^2}{1+x^6}$ (substitute $u=x^3$).",
    "steps": [
      "$x\\to\\frac{1}{x}$: $I=\\int_0^\\infty\\frac{x^4}{1+x^6}\\,dx$.",
      "Add: $2I=\\int_0^\\infty\\frac{1+x^4}{1+x^6}\\,dx$, and $\\frac{1+x^4}{1+x^6}=\\frac{1}{1+x^2}+\\frac{x^2}{1+x^6}$.",
      "$\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$; for $\\int_0^\\infty\\frac{x^2}{1+x^6}\\,dx$ let $u=x^3$ to get $\\frac{1}{3}\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{6}$.",
      "$2I=\\frac{\\pi}{2}+\\frac{\\pi}{6}=\\frac{2\\pi}{3}$, $I=\\frac{\\pi}{3}$."
    ],
    "trap": "Thinking $\\int_0^\\infty\\frac{dx}{1+x^n}$ is always $\\frac{\\pi}{2}$. The general formula is $\\frac{\\pi/n}{\\sin(\\pi/n)}$, which is $\\frac{\\pi}{3}$ at $n=6$.",
    "check": "The general formula $\\frac{\\pi/n}{\\sin(\\pi/n)}$ at $n=6$: $\\frac{\\pi/6}{1/2}=\\frac{\\pi}{3}$; and it is smaller than the $n=2$ value $\\frac{\\pi}{2}$ and larger than $1$."
  },
  "burst-boss-int-020": {
    "spot": "$x^5e^{-2x}\\sin x$: polynomial times exponential times sine; $\\sin x$ is the imaginary part of $e^{ix}$, so the whole thing is the imaginary part of $\\int_0^\\infty x^5e^{-(2-i)x}\\,dx=\\frac{5!}{(2-i)^6}$.",
    "why": "Integration by parts would take five rounds with sines and cosines alternating; $\\int_0^\\infty x^ne^{-ax}\\,dx=\\frac{n!}{a^{n+1}}$ plus complex numbers gets there in one go.",
    "steps": [
      "$\\int_0^\\infty x^5e^{-ax}\\,dx=\\frac{5!}{a^6}=\\frac{120}{a^6}$, which also holds for the complex $a=2-i$ (positive real part).",
      "$\\frac{1}{2-i}=\\frac{2+i}{5}$, so $\\frac{1}{(2-i)^6}=\\frac{(2+i)^6}{5^6}$. In polar form $2+i=\\sqrt 5e^{i\\theta}$ with $\\theta=\\arctan\\frac{1}{2}$: $(2+i)^6=125(\\cos 6\\theta+i\\sin 6\\theta)=-117+44i$.",
      "Take the imaginary part: $\\frac{120\\cdot 44}{15625}=\\frac{5280}{15625}$. As a bonus, the real part gives $\\int x^5e^{-2x}\\cos x=\\frac{120\\cdot(-117)}{15625}$.",
      "The answer is $\\frac{5280}{15625}\\approx 0.338$."
    ],
    "trap": "Using $\\frac{5!}{(2+i)^6}$ (getting the sign of $e^{-ix}$ backwards) flips the sign of the imaginary part, giving $-\\frac{5280}{15625}$. $\\sin x$ goes with $e^{ix}$, so the exponent is $-(2-i)x$.",
    "check": "$|\\sin x|\\le 1$, so the answer's absolute value cannot exceed $\\int_0^\\infty x^5e^{-2x}\\,dx=\\frac{120}{64}=1.875$."
  }
};
