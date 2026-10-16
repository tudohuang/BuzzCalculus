// Detail v2, English — batch 001. Translation of tools/content/detail/001.js (text only; claims live in the Chinese file).
module.exports = {
  "burst-boss-param-006": {
    "spot": "$x^n$ times $(\\ln x)^3$, integrated over $[0,1]$: substituting $x=e^{-t}$ turns $\\ln x$ into $-t$ and $x^n$ into an exponential, so the whole problem becomes a Gamma integral.",
    "why": "Integration by parts would take three rounds, each with an $x\\to 0$ boundary to handle; switching to $x=e^{-t}$ lands on $\\Gamma(4)=3!$ in one step.",
    "steps": [
      "Let $x=e^{-t}$: $\\ln x=-t$, $dx=-e^{-t}dt$, and $x:0\\to 1$ corresponds to $t:\\infty\\to 0$. Use the minus sign to flip the limits back: $K_n=\\int_0^\\infty (-t)^3e^{-nt}e^{-t}\\,dt=-\\int_0^\\infty t^3e^{-(n+1)t}\\,dt$.",
      "Now let $s=(n+1)t$: $\\int_0^\\infty t^3e^{-(n+1)t}\\,dt=\\frac{1}{(n+1)^4}\\int_0^\\infty s^3e^{-s}\\,ds=\\frac{\\Gamma(4)}{(n+1)^4}$.",
      "$\\Gamma(4)=3!=6$.",
      "So $K_n=-\\frac{6}{(n+1)^4}$."
    ],
    "trap": "Dropping the minus sign of $(-t)^3$ gives $+\\frac{6}{(n+1)^4}$. On $(0,1)$, $\\ln x<0$ and $(\\ln x)^3<0$, so the integrand is negative throughout and the answer must be negative.",
    "check": "At $n=0$ it should reduce to $\\int_0^1(\\ln x)^3\\,dx=-6$; the formula gives $-\\frac{6}{1}=-6$. You can also differentiate $\\int_0^1x^n\\,dx=\\frac{1}{n+1}$ three times in $n$: $\\frac{d^3}{dn^3}\\frac{1}{n+1}=-\\frac{6}{(n+1)^4}$, the same."
  },
  "lb-cmp-001": {
    "spot": "The function takes different values at rational and irrational points, and both kinds of points appear in every small interval — Riemann sums can't settle no matter how you partition; but the rationals are only countably many, with measure $0$.",
    "why": "The Riemann integral looks at \"the upper and lower bounds on each small piece\"; the Lebesgue integral looks at \"how big a set each value is taken on\". This problem is the standard example where the two viewpoints part ways.",
    "steps": [
      "Riemann: every piece of every partition contains both rationals and irrationals, so on each piece the sup is $1$ and the inf is $0$. The upper sum is always $\\sum 1\\cdot\\Delta x_i=1$, and the lower sum is always $0$.",
      "Upper sum minus lower sum is always $1$, and doesn't go to $0$ as the partition gets finer, so it's not Riemann integrable.",
      "Lebesgue: list the rationals in $[0,1]$ as $r_1,r_2,\\dots$ and cover the $n$-th one with an interval of length $\\frac{\\varepsilon}{2^n}$; the total length is only $\\varepsilon$ (e.g. $\\varepsilon=0.01$). Since $\\varepsilon$ can be arbitrarily small, the set of rationals has measure $0$.",
      "The function equals $1$ only on a set of measure $0$, and $0$ on the irrationals, which have measure $1$: $\\int f\\,d\\mu=1\\cdot 0+0\\cdot 1=0$, finite, so it's Lebesgue integrable.",
      "Conclusion: not Riemann integrable, but Lebesgue integrable (with integral $0$)."
    ],
    "trap": "Thinking \"Lebesgue is stronger, so if one fails both fail\", or picking the reverse, \"Riemann integrable but not Lebesgue integrable\". In fact every Riemann integrable function is Lebesgue integrable; only the other direction can fail, and this problem is an example of that failure.",
    "check": "A Lebesgue integral of $0$ matches intuition: \"almost every\" point is irrational, so the function is $0$ almost everywhere."
  },
  "lb-mea-004": {
    "spot": "The $n$-th interval has length $\\frac{1}{100\\cdot 2^n}$: a geometric series with ratio $\\frac{1}{2}$, summed from $n=1$.",
    "why": "\"Total length\" just adds the interval lengths (overlaps are not subtracted), regardless of how the rationals are ordered; the geometric series formula finishes it in one line.",
    "steps": [
      "Interval $1$ has length $\\frac{1}{200}$, interval $2$ has $\\frac{1}{400}$; each term is half the previous one.",
      "Geometric series: first term $a=\\frac{1}{200}$, ratio $r=\\frac{1}{2}$, sum $\\frac{a}{1-r}=\\frac{1/200}{1/2}=\\frac{1}{100}$.",
      "So the total length is $\\frac{1}{100}$."
    ],
    "trap": "Starting the series at $n=0$ adds an extra term $\\frac{1}{100}$, giving $\\frac{2}{100}$. The problem says the $n$-th rational, with $n$ starting at $1$.",
    "check": "The total length is only $0.01$, yet it covers every rational in $[0,1]$ — and $0.01$ can be replaced by any small number; that's what \"the rationals have measure $0$\" means."
  },
  "exam-multi-003": {
    "spot": "You want the squared length of the gradient: compute the two partial derivatives, plug in the point, then add the squares — squaring conveniently saves you the square root.",
    "why": "The gradient is just the vector of partial derivatives; there's no transformation here, so computing directly is fastest.",
    "steps": [
      "$f_x=2x$, $f_y=2y$.",
      "At $(1,2)$: $\\nabla f(1,2)=(2,4)$.",
      "$|\\nabla f|^2=2^2+4^2=20$."
    ],
    "trap": "Answering $\\sqrt{20}=2\\sqrt{5}$: that's $|\\nabla f|$, but the problem wants the square.",
    "check": "$|\\nabla f|^2=4x^2+4y^2=4(x^2+y^2)=4f$, which at $(1,2)$ is $4\\cdot 5=20$."
  },
  "burst-int-009": {
    "spot": "$e^{-x^2}$ times an even power of $x$, integrated to $\\infty$: substituting $t=x^2$ turns it into a Gamma function.",
    "why": "You could integrate by parts twice down to $\\int e^{-x^2}$, but $t=x^2$ gives $\\frac{1}{2}\\Gamma(\\frac{5}{2})$ directly, and the constants are harder to lose.",
    "steps": [
      "Let $t=x^2$: $x=\\sqrt t$, $dx=\\frac{dt}{2\\sqrt t}$, $x^4=t^2$. The integral becomes $\\frac{1}{2}\\int_0^\\infty t^{3/2}e^{-t}\\,dt=\\frac{1}{2}\\Gamma(\\frac{5}{2})$.",
      "$\\Gamma(\\frac{5}{2})=\\frac{3}{2}\\cdot\\frac{1}{2}\\cdot\\Gamma(\\frac{1}{2})=\\frac{3}{4}\\sqrt\\pi$.",
      "Multiply by $\\frac{1}{2}$: $\\frac{3\\sqrt\\pi}{8}$."
    ],
    "trap": "Missing the $\\frac{1}{2}$ from $dx=\\frac{dt}{2\\sqrt t}$ gives $\\frac{3\\sqrt\\pi}{4}$.",
    "check": "The integration-by-parts route: $\\int_0^\\infty x^4e^{-x^2}=\\frac{3}{2}\\int_0^\\infty x^2e^{-x^2}=\\frac{3}{4}\\int_0^\\infty e^{-x^2}$, so the answer should be $\\frac{3}{4}$ times $\\frac{\\sqrt\\pi}{2}$."
  },
  "world-070": {
    "spot": "$\\frac{\\sin x}{x}$ has no elementary antiderivative, but it can be written as $\\int_0^1\\cos(xt)\\,dt$; and integrating $e^{-x}\\cos(tx)$ in $x$ is a standard Laplace transform.",
    "why": "Integration by parts goes in circles; write $\\frac{\\sin x}{x}$ as an integral, swap the order, and the inner integral becomes $\\frac{1}{1+t^2}$, so the outer one is an $\\arctan$.",
    "steps": [
      "$\\int_0^1\\cos(xt)\\,dt=\\left[\\frac{\\sin(xt)}{x}\\right]_0^1=\\frac{\\sin x}{x}$.",
      "Substitute it in and swap the order of integration ($e^{-x}$ makes everything absolutely convergent): the integral $=\\int_0^1\\left(\\int_0^\\infty e^{-x}\\cos(tx)\\,dx\\right)dt$.",
      "The inner integral is a Laplace transform: $\\int_0^\\infty e^{-x}\\cos(tx)\\,dx=\\frac{1}{1+t^2}$.",
      "Outer: $\\int_0^1\\frac{dt}{1+t^2}=\\arctan 1=\\frac{\\pi}{4}$."
    ],
    "trap": "Remembering $\\int_0^\\infty\\frac{\\sin x}{x}\\,dx=\\frac{\\pi}{2}$ and answering $\\frac{\\pi}{2}$ directly, ignoring the decay from $e^{-x}$.",
    "check": "In general $\\int_0^\\infty e^{-ax}\\frac{\\sin x}{x}\\,dx=\\frac{\\pi}{2}-\\arctan a$; $a=1$ gives $\\frac{\\pi}{4}$, which is smaller than the undamped $\\frac{\\pi}{2}$ — makes sense."
  },
  "vc-stokes-003": {
    "spot": "The curve lies in the plane $z=0$: $dz=0$ and $z=0$, so $\\mathbf F\\cdot d\\mathbf r$ reduces to $y\\,dx$. A circle of radius $2$ — one line of parametrization finishes it.",
    "why": "Parametrizing directly is shorter than Stokes; use Stokes to check: the curl is a constant vector, so just multiply by the disk's area.",
    "steps": [
      "On $z=0$: $\\mathbf F\\cdot d\\mathbf r=y\\,dx+z\\,dy+x\\,dz=y\\,dx$.",
      "Counterclockwise parametrization: $x=2\\cos t$, $y=2\\sin t$, $dx=-2\\sin t\\,dt$, $t:0\\to 2\\pi$.",
      "$\\oint y\\,dx=\\int_0^{2\\pi}2\\sin t\\cdot(-2\\sin t)\\,dt=-4\\int_0^{2\\pi}\\sin^2t\\,dt=-4\\pi$.",
      "Check with Stokes: $\\nabla\\times\\mathbf F=(-1,-1,-1)$, disk normal $\\mathbf k$ (counterclockwise pairs with upward), $\\iint(-1)\\,dA=-\\pi\\cdot 2^2=-4\\pi$."
    ],
    "trap": "Getting the curl as $(1,1,1)$ (component order flipped, e.g. writing the first component as $\\partial_zF_2-\\partial_yF_3$) gives $+4\\pi$.",
    "check": "Green's Theorem in the plane: $\\oint y\\,dx=-\\iint 1\\,dA=-(\\text{area})=-4\\pi$."
  },
  "der-034": {
    "spot": "The Jacobian determinant is $\\begin{vmatrix}u_x&u_y\\\\v_x&v_y\\end{vmatrix}$: lay out the four partial derivatives and cross-subtract.",
    "why": "$u$ and $v$ are both polynomials, so the partial derivatives are immediate; expanding the determinant directly is fastest.",
    "steps": [
      "$u=x+y$: $u_x=1$, $u_y=1$.",
      "$v=xy$: $v_x=y$, $v_y=x$.",
      "$\\det\\begin{pmatrix}1&1\\\\y&x\\end{pmatrix}=1\\cdot x-1\\cdot y=x-y$."
    ],
    "trap": "Cross-subtracting in the wrong order ($u_yv_x-u_xv_y$) gives $y-x$. Put the partials of $u$ in the first row and those of $v$ in the second; main diagonal minus the other diagonal.",
    "check": "$u,v$ are the sum and product of the roots of $s^2-us+v=0$; the discriminant is $u^2-4v=(x-y)^2$. When the roots coincide ($x=y$) the map folds over, and the Jacobian is exactly $0$."
  },
  "lim-032": {
    "spot": "Numerator and denominator are both homogeneous of degree 2: substitute along $y=kx$ and the $x^2$ cancels completely, leaving a value that depends on $k$ — different directions give different values.",
    "why": "To prove the limit doesn't exist, two paths with different limits are enough; polar form $\\cos 2\\theta$ works too, but the two coordinate axes already do the job.",
    "steps": [
      "Along the $x$-axis ($y=0$): $\\frac{x^2}{x^2}=1$, limit $1$.",
      "Along the $y$-axis ($x=0$): $\\frac{-y^2}{y^2}=-1$, limit $-1$.",
      "General direction $y=kx$: $\\frac{1-k^2}{1+k^2}$; e.g. $k=2$ gives $-\\frac{3}{5}$ — every direction is different.",
      "The two paths give limits $1\\ne -1$, so the limit does not exist."
    ],
    "trap": "Trying only $y=x$, getting $0$, and concluding the limit is $0$. A single path can only rule a limit out, never prove it exists.",
    "check": "In polar coordinates the function is $\\cos 2\\theta$, independent of $r$: however close you get to the origin, it keeps cycling through $[-1,1]$ and never converges."
  },
  "lb-mea-001": {
    "spot": "Step $n$ removes $2^{n-1}$ pieces, each of length $3^{-n}$: the removed lengths form a geometric series with ratio $\\frac{2}{3}$.",
    "why": "Just add up the length removed at each step; no need to describe what the Cantor set itself looks like.",
    "steps": [
      "Step $1$ removes $\\frac{1}{3}$; step $2$ leaves two pieces, each losing its middle $\\frac{1}{9}$, for $\\frac{2}{9}$ total; step $3$ removes $\\frac{4}{27}$ in total.",
      "In general step $n$ removes $\\frac{2^{n-1}}{3^n}$: first term $\\frac{1}{3}$, ratio $\\frac{2}{3}$.",
      "Total $\\frac{1/3}{1-2/3}=1$."
    ],
    "trap": "Counting only the first step's $\\frac{1}{3}$, or thinking each step removes $\\frac{1}{3}$ so the total is infinite. Each step removes \"$\\frac{1}{3}$ of what's left\", which keeps shrinking.",
    "check": "The total removed is $1$, so the Cantor set has measure $0$ — yet it still has uncountably many points. The first ten steps already remove $1-(\\frac{2}{3})^{10}\\approx 0.983$."
  },
  "lb-con-001": {
    "spot": "$n^2xe^{-nx}$ has $x$ and $n$ tied together: substitute $t=nx$, and $n^2$ gets absorbed exactly by $x\\,dx=\\frac{t\\,dt}{n^2}$.",
    "why": "Taking the pointwise limit first gives $0$ (wrong); there's no dominating function here, so the limit can't be moved inside the integral — you have to honestly integrate first and then take the limit.",
    "steps": [
      "Pointwise: for each fixed $x\\in(0,1]$, $n^2e^{-nx}\\to 0$, so $f_n(x)\\to 0$. For example $x=0.5$.",
      "But the integral itself: let $t=nx$, $\\int_0^1n^2xe^{-nx}\\,dx=\\int_0^n te^{-t}\\,dt=1-(n+1)e^{-n}$.",
      "$(n+1)e^{-n}\\to 0$, so the integral tends to $1$."
    ],
    "trap": "Moving the limit inside the integral gives $\\int 0=0$. $f_n$ has a spike of height $\\frac{n}{e}$ at $x=\\frac{1}{n}$, with all the mass crowding toward $0$; there's no integrable bound, so the Dominated Convergence Theorem doesn't apply (Fatou only gives $0\\le 1$).",
    "check": "At $n=10$ the integral is already $1-11e^{-10}\\approx 0.9995$; the spike height is $f_{10}(0.1)=\\frac{10}{e}\\approx 3.68$."
  },
  "lim-028": {
    "spot": "$x$ and $y$ appear only through $x^2+y^2$: let $s=x^2+y^2\\to 0^+$, which gives the one-variable $\\frac{\\sqrt{1+s}-1}{s}$; then rationalize.",
    "why": "The whole expression depends only on the distance to the origin, so there's no path issue; rationalizing takes one step fewer than a Taylor expansion.",
    "steps": [
      "The function only sees $x^2+y^2$: e.g. $(0.3,0.4)$ and $(0.5,0)$ both have $x^2+y^2$ equal to $0.25$, and the same function value.",
      "Let $s=x^2+y^2$ and multiply top and bottom by $\\sqrt{1+s}+1$: $\\frac{\\sqrt{1+s}-1}{s}=\\frac{1}{\\sqrt{1+s}+1}$.",
      "$s\\to 0^+$: $\\frac{1}{1+1}=\\frac{1}{2}$."
    ],
    "trap": "Plugging in $0$, getting $\\frac{0}{0}$, and going off to test paths for a counterexample — there isn't one, because the function depends only on distance.",
    "check": "$\\sqrt{1+s}\\approx 1+\\frac{s}{2}$, so the numerator is about $\\frac{s}{2}$ and the ratio about $\\frac{1}{2}$. Plugging in $s=0.0001$ gives $0.4999875$."
  },
  "db-ext-013": {
    "spot": "$\\frac{x}{x^2+1}$: the denominator has higher degree, so both ends go to $0$ and there must be a peak in between; differentiate with the Quotient Rule, and the numerator simplifies to $1-x^2$.",
    "why": "Finding critical points and comparing with the end behavior is the standard routine; the AM-GM inequality $x^2+1\\ge 2x$ is even faster and works as a check.",
    "steps": [
      "$f'(x)=\\frac{(x^2+1)-x\\cdot 2x}{(x^2+1)^2}=\\frac{1-x^2}{(x^2+1)^2}$.",
      "$f'=0\\Rightarrow x=\\pm 1$; at $x=1$, $f'>0$ on the left and $f'<0$ on the right, so it's a local max.",
      "As $x\\to\\pm\\infty$, $f\\to 0$, while $f(1)=\\frac{1}{2}>0$, so it's the absolute max."
    ],
    "trap": "Treating $x=-1$ as a max candidate too and answering $-\\frac{1}{2}$ — that's the minimum.",
    "check": "$\\frac{1}{2}-\\frac{x}{x^2+1}=\\frac{(x-1)^2}{2(x^2+1)}\\ge 0$, with equality only at $x=1$."
  },
  "burst-rec-001": {
    "spot": "$x^n\\ln x$: differentiating $\\ln x$ gives $\\frac{1}{x}$, while integrating $x^n$ keeps a power — integration by parts, letting the $\\ln x$ be differentiated away.",
    "why": "One round of parts is enough; the boundary term vanishes at $x=1$ because $\\ln 1=0$, and at $x=0$ because $x^{n+1}$ beats $\\ln x$ — both are $0$.",
    "steps": [
      "$u=\\ln x$, $dv=x^n\\,dx$: $\\frac{d}{dx}\\left(\\frac{x^{n+1}}{n+1}\\ln x\\right)=x^n\\ln x+\\frac{x^n}{n+1}$.",
      "Boundary: at $x=1$, $\\ln 1=0$; as $x\\to 0^+$, $x^{n+1}\\ln x\\to 0$.",
      "What's left is $-\\frac{1}{n+1}\\int_0^1x^n\\,dx=-\\frac{1}{(n+1)^2}$."
    ],
    "trap": "Seeing $0\\cdot(-\\infty)$ at the boundary $x=0$ and thinking it diverges. $x^{n+1}$ goes to $0$ faster than $\\ln x$ goes to $-\\infty$.",
    "check": "$n=0$: $\\int_0^1\\ln x\\,dx=-1$, and the formula gives $-1$. A negative answer is right too: $\\ln x<0$ on all of $(0,1)$."
  },
  "depth-int-020": {
    "spot": "The denominator is a product of two $x^2+a^2$ factors: do partial fractions in $x^2$, splitting into two $\\frac{1}{x^2+a^2}$ terms, each an $\\arctan$.",
    "why": "Treat $x^2$ as a single variable and the partial fractions take one line; no trigonometric substitution or residues needed.",
    "steps": [
      "Let $w=x^2$: $\\frac{1}{(w+1)(w+4)}=\\frac{1}{3}\\left(\\frac{1}{w+1}-\\frac{1}{w+4}\\right)$.",
      "$\\int_0^\\infty\\frac{dx}{x^2+1}=\\frac{\\pi}{2}$; $\\int_0^\\infty\\frac{dx}{x^2+4}=\\frac{1}{2}\\arctan\\frac{x}{2}\\Big|_0^\\infty=\\frac{\\pi}{4}$.",
      "$\\frac{1}{3}\\left(\\frac{\\pi}{2}-\\frac{\\pi}{4}\\right)=\\frac{\\pi}{12}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ in front of $\\int\\frac{dx}{x^2+4}$, treating it as $\\frac{\\pi}{2}$, and ending up with $0$.",
    "check": "The integrand is at most $\\frac{1}{4(x^2+1)}$, so the answer should be below $\\frac{\\pi}{8}$; indeed $\\frac{\\pi}{12}<\\frac{\\pi}{8}$."
  },
  "rel-hard-cpx-008": {
    "spot": "$\\cot z=\\frac{\\cos z}{\\sin z}$: the denominator $\\sin z$ has a simple zero at $0$ and the numerator $\\cos 0=1\\ne 0$ — a simple pole, so the residue is $\\frac{g(z_0)}{h'(z_0)}$.",
    "why": "A simple pole needs no Laurent expansion; the formula $\\frac{g}{h'}$ gives it in one step.",
    "steps": [
      "$\\sin 0=0$, $(\\sin z)'\\big|_0=\\cos 0=1\\ne 0$: $0$ is a simple zero of $\\sin z$, so $\\cot z$ has a simple pole at $0$.",
      "$\\operatorname{Res}=\\frac{\\cos 0}{\\cos 0}=1$. Equivalently, $\\lim_{z\\to 0}z\\cot z=1$.",
      "The Laurent expansion shows it too: $\\cot z=\\frac{1}{z}-\\frac{z}{3}-\\cdots$, and the coefficient of $\\frac{1}{z}$ is $1$."
    ],
    "trap": "Thinking $\\cot z$ has a double pole or no pole at $0$ and answering $0$; or confusing it with $\\tan z$ — $\\tan z$ is analytic at $0$, and that's the one with residue $0$.",
    "check": "Plug in a small $x=0.01$: $x\\cot x\\approx 0.99997$, very close to $1$."
  },
  "mob-gamma-003": {
    "spot": "A half-integer value of $\\Gamma$: use the recursion $\\Gamma(s+1)=s\\Gamma(s)$ to step down to $\\Gamma(\\frac{1}{2})=\\sqrt\\pi$.",
    "why": "$\\Gamma(\\frac{1}{2})$ is the only non-integer value worth memorizing; every other half-integer follows by multiplying through the recursion.",
    "steps": [
      "$\\Gamma(\\frac{3}{2})=\\int_0^\\infty t^{1/2}e^{-t}\\,dt$; by the recursion, $\\Gamma(\\frac{3}{2})=\\frac{1}{2}\\Gamma(\\frac{1}{2})$.",
      "$\\Gamma(\\frac{1}{2})=\\int_0^\\infty t^{-1/2}e^{-t}\\,dt$; substituting $t=x^2$ turns it into $2\\int_0^\\infty e^{-x^2}\\,dx=\\sqrt\\pi$.",
      "So $\\Gamma(\\frac{3}{2})=\\frac{\\sqrt\\pi}{2}$."
    ],
    "trap": "Misplacing the recursion factor: writing $\\Gamma(\\frac{3}{2})=\\frac{3}{2}\\Gamma(\\frac{1}{2})$ gives $\\frac{3\\sqrt\\pi}{2}$. You multiply by the smaller argument: $\\Gamma(s+1)=s\\Gamma(s)$.",
    "check": "$\\Gamma(1)=\\Gamma(2)=1$, and $\\Gamma$ dips slightly below $1$ between $1$ and $2$; $\\frac{\\sqrt\\pi}{2}\\approx 0.886$ is reasonable."
  },
  "der-029": {
    "spot": "$x$ times $e^x$: each differentiation makes the Product Rule spit out one more $e^x$, so the $n$-th derivative is $(x+n)e^x$.",
    "why": "Just apply the Product Rule twice; no need for the Leibniz formula.",
    "steps": [
      "First: $(xe^x)'=e^x+xe^x=(x+1)e^x$.",
      "Second: $((x+1)e^x)'=e^x+(x+1)e^x=(x+2)e^x$.",
      "So $\\frac{d^2}{dx^2}(xe^x)=e^x(x+2)$."
    ],
    "trap": "Thinking $e^x$ never changes when differentiated and answering $xe^x$; the other Product Rule term (the one differentiating $x$) has to be included every time.",
    "check": "Taylor expansion: $xe^x=x+x^2+\\frac{x^3}{2}+\\cdots$; the $x^2$ coefficient $1$ times $2!$ is the second derivative at $x=0$, namely $2$."
  },
  "gap-int-cov-002": {
    "spot": "The boundaries are ranges of $x+y$ and $x-y$: let $u=x+y$, $v=x-y$, and the region becomes the rectangle $[0,1]\\times[0,2]$.",
    "why": "In the $xy$-plane it's a tilted rectangle that would need to be cut into several pieces; after the change of variables, only one Jacobian is left to compute.",
    "steps": [
      "$\\frac{\\partial(u,v)}{\\partial(x,y)}=\\begin{vmatrix}1&1\\\\1&-1\\end{vmatrix}=-2$.",
      "So $dA=dx\\,dy=\\frac{1}{|-2|}du\\,dv=\\frac{1}{2}du\\,dv$.",
      "Area $=\\frac{1}{2}\\int_0^1\\int_0^2dv\\,du=\\frac{1}{2}\\cdot 2=1$."
    ],
    "trap": "Using the Jacobian the wrong way round — multiplying by $2$ instead of dividing by $2$ — gives $4$. $\\frac{\\partial(u,v)}{\\partial(x,y)}$ is how much $uv$-area magnifies $xy$-area, so to get back to $dx\\,dy$ you divide by it.",
    "check": "Geometry: a width of $1$ in the $u$ direction is a perpendicular distance of $\\frac{1}{\\sqrt2}$, and a width of $2$ in the $v$ direction is $\\frac{2}{\\sqrt2}$, so the rectangle's area is $\\frac{1}{\\sqrt2}\\cdot\\frac{2}{\\sqrt2}=1$."
  },
  "hc-rad-007": {
    "spot": "The power of $\\sin$ is odd, $5$: give one $\\sin x$ to $d(\\cos x)$, and the remaining $\\sin^4x=(1-\\cos^2x)^2$ becomes a polynomial integral after $u=\\cos x$.",
    "why": "Using the odd-power factor for the substitution is the least work; only when both powers are even do you need power reduction or Wallis.",
    "steps": [
      "Let $u=\\cos x$, $du=-\\sin x\\,dx$; $x:0\\to\\frac{\\pi}{2}$ corresponds to $u:1\\to 0$, and the minus sign flips the limits back: the integral $=\\int_0^1(1-u^2)^2u^4\\,du$.",
      "Expand: $(1-2u^2+u^4)u^4=u^4-2u^6+u^8$.",
      "Integrate term by term: $\\frac{1}{5}-\\frac{2}{7}+\\frac{1}{9}=\\frac{63-90+35}{315}=\\frac{8}{315}$."
    ],
    "trap": "Forgetting the minus sign in $du$ without flipping the limits gives $-\\frac{8}{315}$. The integrand is positive on $(0,\\frac{\\pi}{2})$, so the answer must be positive.",
    "check": "Wallis-type formula: $\\int_0^{\\pi/2}\\sin^5x\\cos^4x\\,dx=\\frac{4!!\\cdot 3!!}{9!!}=\\frac{8\\cdot 3}{945}=\\frac{8}{315}$ (the powers aren't both even, so no factor of $\\frac{\\pi}{2}$)."
  },
  "der-082": {
    "spot": "$\\frac{1}{(z-2)^3}$ is already its own Laurent series at $z=2$ — just the single term $(z-2)^{-3}$, with no $(z-2)^{-1}$ term.",
    "why": "The residue is the coefficient of $(z-2)^{-1}$; the expression is already expanded, so there's no need for the higher-order pole formula.",
    "steps": [
      "The Laurent series has one term: $\\frac{1}{(z-2)^3}=1\\cdot(z-2)^{-3}$, so the coefficient of $(z-2)^{-1}$ is $0$.",
      "Check with the order-3 pole formula: $\\frac{1}{2!}\\frac{d^2}{dz^2}\\left[(z-2)^3\\cdot\\frac{1}{(z-2)^3}\\right]=\\frac{1}{2}\\cdot\\frac{d^2}{dz^2}1=0$.",
      "Go once around $z=2+e^{it}$: $\\oint\\frac{dz}{(z-2)^3}=\\int_0^{2\\pi}ie^{-2it}\\,dt$; the real and imaginary parts are $\\cos 2t$ and $\\sin 2t$ over whole periods, so the integral is $0$. So the residue is $0$."
    ],
    "trap": "Assuming a pole always has a residue that isn't $0$ and answering $1$ (that's the residue of $\\frac{1}{z-2}$). Only the power $-1$ term survives a loop integral.",
    "check": "$(z-2)^{-3}$ has the antiderivative $-\\frac{1}{2(z-2)^2}$ (single-valued on the plane minus $2$); going around once returns to the starting value, so of course the integral is $0$."
  },
  "cx-curve-006": {
    "spot": "The denominator $(x^2-1)(x^2-4)$ has four zeros, but the numerator's $x-1$ cancels the denominator's $x-1$ — factor and cancel first, then count the remaining zeros.",
    "why": "A vertical asymptote requires the function to actually blow up; a zero that cancels is only a \"hole\", not an asymptote.",
    "steps": [
      "$\\frac{x-1}{(x-1)(x+1)(x-2)(x+2)}=\\frac{1}{(x+1)(x-2)(x+2)}$ ($x\\ne 1$).",
      "$x=1$: the limit is $\\frac{1}{2\\cdot(-1)\\cdot 3}=-\\frac{1}{6}$, finite — just a hole.",
      "$x=-1,\\ 2,\\ -2$: the numerator isn't $0$ and the denominator is $0$, so the function shoots off to $\\pm\\infty$.",
      "So there are three vertical asymptotes: $x=-2,\\ -1,\\ 2$."
    ],
    "trap": "Counting the denominator's roots directly and answering $4$, missing that $x=1$ is a removable discontinuity.",
    "check": "Near $x=1$ the function values settle around $-\\frac{1}{6}$; nothing blows up."
  },
  "vc-nab-007": {
    "spot": "\"Toward $(2,3)$\" means walking from $(1,1)$ toward the point $(2,3)$: the direction vector is $(2,3)-(1,1)=(1,2)$, which you must normalize first.",
    "why": "Directional derivative $=\\nabla f\\cdot\\mathbf u$; the gradient at $(1,1)$ is simply $(1,1)$, so the only hard part is reading the direction correctly.",
    "steps": [
      "$f_x=\\frac{2x}{x^2+y^2}$, $f_y=\\frac{2y}{x^2+y^2}$.",
      "At $(1,1)$: $\\nabla f=(1,1)$.",
      "Direction: $(2,3)-(1,1)=(1,2)$, length $\\sqrt5$, $\\mathbf u=\\frac{(1,2)}{\\sqrt5}$.",
      "$D_{\\mathbf u}f=(1,1)\\cdot\\frac{(1,2)}{\\sqrt5}=\\frac{3}{\\sqrt5}$."
    ],
    "trap": "Using $(2,3)$ itself as the direction vector gives $\\frac{5}{\\sqrt{13}}$. \"Toward a point\" means endpoint minus starting point.",
    "check": "A directional derivative can't exceed $|\\nabla f|=\\sqrt2\\approx 1.414$; $\\frac{3}{\\sqrt5}\\approx 1.342$ is reasonable. You can also take a small step along that line and differentiate numerically."
  },
  "lim-039": {
    "spot": "The denominator is $x^4+y^2$: $x$ and $y$ carry different \"weights\" ($x^4$ vs $y^2$). Straight lines won't reveal the problem; take the parabola $y=x^2$ so the two terms are the same order.",
    "why": "Every straight line gives $0$, so it's easy to wrongly conclude the limit is $0$; choosing $y=kx^2$ to match the denominator's weighted homogeneity is what catches the counterexample.",
    "steps": [
      "Along a line $y=kx$: $\\frac{kx^3}{x^4+k^2x^2}=\\frac{kx}{x^2+k^2}\\to 0$, e.g. $k=2$.",
      "Along the parabola $y=x^2$: $\\frac{x^4}{x^4+x^4}=\\frac{1}{2}$, independent of $x$.",
      "In general $y=kx^2$ gives $\\frac{k}{1+k^2}$ — different parabolas, different values.",
      "Lines give $0$ and the parabola gives $\\frac{1}{2}$, so the limit does not exist."
    ],
    "trap": "Trying $y=0$, $x=0$, $y=x$, getting $0$ each time, and declaring the limit is $0$. All lines agreeing doesn't mean all paths agree.",
    "check": "On the parabola $y=x^2$, take a point very close to the origin, $(0.001,10^{-6})$: the function value is still $\\frac{1}{2}$."
  },
  "an-ed-001": {
    "spot": "$\\frac{1}{x}$ is not symmetric around $x=2$: steep on the left, gentle on the right. First solve $|\\frac{1}{x}-\\frac{1}{2}|<0.1$ as an interval in $x$, then see how far $2$ is from each end and take the nearer side.",
    "why": "Solving the inequality directly gives the exact interval; a linear estimate using slope $\\frac{1}{4}$ is only approximate and can't give the \"largest\".",
    "steps": [
      "$|\\frac{1}{x}-\\frac{1}{2}|<0.1\\iff 0.4<\\frac{1}{x}<0.6\\iff\\frac{5}{3}<x<\\frac{5}{2}$.",
      "The distance from $2$ to the left end $\\frac{5}{3}$ is $\\frac{1}{3}$; to the right end $\\frac{5}{2}$ it's $\\frac{1}{2}$.",
      "$(2-\\delta,2+\\delta)$ must fit entirely inside $(\\frac{5}{3},\\frac{5}{2})$, so the largest $\\delta$ is the smaller of the two, $\\frac{1}{3}$."
    ],
    "trap": "Looking only at the right side and answering $\\frac{1}{2}$, or using the derivative's linear estimate $\\delta=\\frac{0.1}{1/4}=0.4$; both let some $x$ on the left exceed the tolerance.",
    "check": "Any bigger $\\delta$ breaks: at $x=2-0.34$, $|\\frac{1}{x}-\\frac{1}{2}|>0.1$; while $x=2-0.33$ is still in range."
  },
  "gap-der-ode-002": {
    "spot": "$y'=2y$: the rate of change is proportional to the function itself — exponential growth, so the solution must have the shape $Ce^{2x}$.",
    "why": "This is the most basic separable equation; once you recognize the shape, all that's left is using the initial value to fix $C$.",
    "steps": [
      "Separate variables: $\\frac{dy}{y}=2\\,dx$, integrate to get $\\ln|y|=2x+c$, so $y=Ce^{2x}$. Check: $(Ce^{2x})'=2Ce^{2x}$.",
      "Initial value: $y(0)=C=3$.",
      "So $y=3e^{2x}$."
    ],
    "trap": "Putting the integration constant in the wrong place and writing $y=e^{2x}+2$: it satisfies $y(0)=3$, but $y'=2e^{2x}\\ne 2y$. The constant is added at the $\\ln|y|$ level, which becomes multiplication back at $y$.",
    "check": "The doubling time is $\\frac{\\ln 2}{2}$: $y(\\frac{\\ln 2}{2})$ should be $6$."
  },
  "an-ca-003": {
    "spot": "Recursion $a_{n+1}=g(a_n)$: the limit can only be a fixed point $L=\\frac{L^2+3}{4}$ — solve for the two candidates $1$ and $3$, then see which side the sequence is trapped on.",
    "why": "The fixed-point equation only gives candidates; starting from $a_1=0$ the sequence increases and is blocked by $1$, so the limit is $1$, not $3$.",
    "steps": [
      "First few terms: $a_1=0$, $a_2=\\frac{3}{4}$, $a_3=\\frac{57}{64}$, climbing.",
      "Fixed points: $L^2-4L+3=0\\Rightarrow L=1$ or $3$.",
      "Increasing: $a_{n+1}-a_n=\\frac{(a_n-1)(a_n-3)}{4}>0$ as long as $a_n<1$.",
      "Bounded above: when $0\\le a_n<1$, $a_{n+1}=\\frac{a_n^2+3}{4}<\\frac{1+3}{4}=1$. Increasing and bounded above means convergent, and the limit can only be the fixed point $\\le 1$, which is $1$."
    ],
    "trap": "Solving $L=1$ or $3$ and picking one at random, or answering \"either is possible\". The sequence starts at $0$ with every term below $1$, so it can never reach $3$.",
    "check": "$g'(1)=\\frac{1}{2}<1$, so $1$ is an attracting fixed point; $g'(3)=\\frac{3}{2}>1$, so $3$ is repelling."
  },
  "an-en-002": {
    "spot": "Solve $\\frac{1}{\\sqrt n}<10^{-3}$ directly: $\\sqrt n>1000$, i.e. $n>10^6$. The key is \"strictly less than\" — $n=10^6$ gives exactly equality, which doesn't count.",
    "why": "The sequence is monotone decreasing, so once you find the first $n$ that works, all later ones work too.",
    "steps": [
      "$\\frac{1}{\\sqrt n}<10^{-3}\\iff\\sqrt n>10^3\\iff n>10^6$.",
      "At $n=10^6$, $\\frac{1}{\\sqrt n}=10^{-3}$, which fails the strict inequality; at $n=10^6+1$ it's already below $10^{-3}$.",
      "$\\frac{1}{\\sqrt n}$ is decreasing, so every $n\\ge 10^6+1$ works, and the smallest is $N=1000001$."
    ],
    "trap": "Answering $10^6$: forgetting the problem uses a strict $<$, and $n=10^6$ gives equality.",
    "check": "The sequence is decreasing: later terms only get smaller."
  },
  "an-uc-001": {
    "spot": "The interval $(0,1]$ excludes its left endpoint, and $\\frac{1}{x}$ blows up as $x\\to 0^+$ with no bound on its slope — exactly the kind of ever-steeper spot that kills uniform continuity.",
    "why": "To disprove uniform continuity, the most direct route is two sequences of points that get closer and closer while their function values don't.",
    "steps": [
      "Take $x_n=\\frac{1}{n}$, $y_n=\\frac{1}{n+1}$; their distance $\\frac{1}{n(n+1)}\\to 0$.",
      "But $f(y_n)-f(x_n)=(n+1)-n=1$, never less than $1$.",
      "So with $\\varepsilon=1$, however small $\\delta$ is, there are two points closer than $\\delta$ whose function values differ by $1$; the slope $|f'(x)|=\\frac{1}{x^2}$ being unbounded near $0$ says the same thing.",
      "Conclusion: $f(x)=\\frac{1}{x}$ is continuous on $(0,1]$ but not uniformly continuous."
    ],
    "trap": "Seeing that the function is continuous at every point of the interval and answering \"uniformly continuous\". Continuity implies uniform continuity only on a closed interval (compactness); $(0,1]$ is missing $0$, and $f$ blows up there.",
    "check": "Compare: on $[a,1]$ (with $a>0$), $|f'|\\le\\frac{1}{a^2}$ is bounded, so it is uniformly continuous — the whole problem lives near $0$."
  },
  "lb-lp-004": {
    "spot": "The $L^1$ norm is just $\\int|f|$; $\\frac{1}{\\sqrt x}$ blows up at $0$, but the power $\\frac{1}{2}<1$, so the improper integral converges.",
    "why": "$f>0$, so the absolute value can simply be dropped; the antiderivative $2\\sqrt x$ finishes it in one line.",
    "steps": [
      "$\\|f\\|_1=\\int_0^1\\left|\\frac{1}{\\sqrt x}\\right|dx=\\int_0^1x^{-1/2}\\,dx$, with antiderivative $2\\sqrt x$.",
      "The lower limit is the singular point: $\\lim_{x\\to 0^+}2\\sqrt x=0$.",
      "$\\|f\\|_1=2\\sqrt1-0=2$."
    ],
    "trap": "Seeing that $f$ is unbounded at $0$ and thinking it's not in $L^1$. Look at the power: $x^{-p}$ is integrable on $(0,1]$ if and only if $p<1$. On the other hand, $\\|f\\|_2^2=\\int_0^1\\frac{dx}{x}$ diverges, so $f\\notin L^2$.",
    "check": "Cut off $[0,10^{-4}]$: $\\int_{10^{-4}}^1x^{-1/2}\\,dx=2-0.02=1.98$; the little bit missing is exactly $2\\sqrt{10^{-4}}$."
  },
  "ode-h2-005": {
    "spot": "Constant-coefficient homogeneous: the characteristic equation $r^2+2r+5=0$ has discriminant $4-20<0$, so the roots are the complex conjugates $-1\\pm 2i$, and the solution looks like $e^{-x}(A\\cos 2x+B\\sin 2x)$.",
    "why": "For constant-coefficient linear equations, go straight to the characteristic equation; the real part of a complex root gives the decay, the imaginary part the oscillation frequency.",
    "steps": [
      "Complete the square: $r^2+2r+5=(r+1)^2+4$, roots $r=-1\\pm 2i$.",
      "General solution $y=e^{-x}(A\\cos 2x+B\\sin 2x)$; both basis solutions satisfy the equation.",
      "$y(0)=A=1$.",
      "$y'(0)=-A+2B=-1$; with $A=1$ this gives $B=0$.",
      "So $y=e^{-x}\\cos 2x$."
    ],
    "trap": "When computing $y'(0)$, dropping the $-A$ that comes from differentiating $e^{-x}$, writing $2B=-1$ and getting $B=-\\frac{1}{2}$.",
    "check": "At $x=\\frac{\\pi}{4}$, $\\cos 2x=0$, so the solution should cross $0$ exactly there."
  },
  "td-int-006": {
    "spot": "$x^4e^{-ax^2}$ over the whole real line, with $a=3$: first use $u=\\sqrt3x$ to absorb the $3$, turning it into the standard $\\int x^4e^{-x^2}$.",
    "why": "Once you remember $\\int_{-\\infty}^\\infty u^4e^{-u^2}\\,du=\\frac{3\\sqrt\\pi}{4}$, all that's left is getting the scaling factor $3^{-5/2}$ right.",
    "steps": [
      "Let $u=\\sqrt3x$: $x^4=\\frac{u^4}{9}$, $dx=\\frac{du}{\\sqrt3}$, so the integral $=\\frac{1}{9\\sqrt3}\\int_{-\\infty}^\\infty u^4e^{-u^2}\\,du$.",
      "Standard value: $\\int_{-\\infty}^\\infty u^4e^{-u^2}\\,du=\\Gamma(\\frac{5}{2})=\\frac{3\\sqrt\\pi}{4}$.",
      "Multiply: $\\frac{3\\sqrt\\pi}{4\\cdot 9\\sqrt3}=\\frac{\\sqrt\\pi}{12\\sqrt3}$."
    ],
    "trap": "Counting only the $\\frac{1}{9}$ from $x^4$ in the scaling and forgetting the $\\frac{1}{\\sqrt3}$ from $dx$ gives $\\frac{\\sqrt\\pi}{12}$. The total is $a^{-5/2}$: $x^4$ contributes $a^{-2}$ and $dx$ contributes $a^{-1/2}$.",
    "check": "Plug $a=3$ into the formula $\\int_{-\\infty}^\\infty x^4e^{-ax^2}\\,dx=\\frac{3\\sqrt\\pi}{4a^{5/2}}$."
  },
  "vc-div-006": {
    "spot": "$\\mathbf F=\\frac{\\mathbf r}{|\\mathbf r|^3}$ is an inverse-square field: on the sphere it points along the normal with magnitude $\\frac{1}{R^2}$; multiply by the area $4\\pi R^2$ and $R$ cancels.",
    "why": "The origin is inside the sphere and $\\mathbf F$ is undefined there, so you can't just apply the Divergence Theorem and say \"divergence $0$, so flux $0$\"; computing directly on the sphere is cleanest.",
    "steps": [
      "Away from the origin, $\\nabla\\cdot\\mathbf F=0$ (at every point).",
      "But the origin is inside the sphere and $\\mathbf F$ blows up there, so the Divergence Theorem can't be applied to the whole ball directly. Compute on the sphere instead: $\\mathbf n=\\frac{\\mathbf r}{R}$, $\\mathbf F\\cdot\\mathbf n=\\frac{R^2}{R^3\\cdot R}=\\frac{1}{R^2}$.",
      "Flux $=\\frac{1}{R^2}\\cdot 4\\pi R^2=4\\pi$, independent of the radius $R=5$."
    ],
    "trap": "Seeing divergence $0$ and answering $0$. The divergence is $0$ only away from the origin; the point source at the origin contributes the entire $4\\pi$.",
    "check": "The spherical area element $R^2\\sin\\varphi\\,d\\varphi\\,d\\theta$ times $\\frac{1}{R^2}$: $\\int_0^{2\\pi}\\int_0^\\pi\\sin\\varphi\\,d\\varphi\\,d\\theta=2\\pi\\cdot 2=4\\pi$."
  },
  "lb-mea-002": {
    "spot": "Step $n$ removes $2^{n-1}$ pieces, each of length $4^{-n}$: the removed lengths form a geometric series with ratio $\\frac{1}{2}$, totaling less than $1$ — this is a \"fat Cantor set\".",
    "why": "Remaining measure $=1-$ total removed; the removed intervals don't overlap, so their lengths simply add.",
    "steps": [
      "Step $1$ removes $\\frac{1}{4}$, step $2$ removes $2\\cdot\\frac{1}{16}=\\frac{1}{8}$, step $3$ removes $\\frac{1}{16}$, and so on.",
      "$2^{n-1}\\cdot 4^{-n}=\\frac{1}{2}\\cdot\\left(\\frac{1}{2}\\right)^n$, total $\\frac{1/4}{1-1/2}=\\frac{1}{2}$.",
      "Remaining measure $1-\\frac{1}{2}=\\frac{1}{2}$."
    ],
    "trap": "Thinking \"it digs holes at every step, so like the Cantor set it has measure $0$\". When the holes are small enough (total length $\\frac{1}{2}$), what remains contains no interval at all, yet has positive measure.",
    "check": "The first ten steps already remove $\\frac{1}{2}(1-2^{-10})\\approx 0.4995$, so what's left really does settle near $\\frac{1}{2}$."
  },
  "ode-h2-004": {
    "spot": "$r^2+4r+4=(r+2)^2$: a repeated root $-2$, so the second solution gets multiplied by $x$; general solution $(A+Bx)e^{-2x}$.",
    "why": "With a repeated root, $e^{-2x}$ gives only one solution; you must add $xe^{-2x}$ to have enough freedom for two initial conditions.",
    "steps": [
      "Characteristic equation $r^2+4r+4=(r+2)^2$, repeated root $r=-2$.",
      "$xe^{-2x}$ is also a solution (the second solution that only appears with a repeated root).",
      "$y(0)=A=1$; $y'(0)=-2A+B=-2$, so $B=0$.",
      "So $y=e^{-2x}$."
    ],
    "trap": "Writing the general solution as $Ae^{-2x}+Be^{-2x}$: that's really just one independent solution, and with different initial values (e.g. $y'(0)=0$) it can't be solved. $B=0$ here is a coincidence; it doesn't mean you can drop $xe^{-2x}$.",
    "check": "Plug $y=e^{-2x}$ back in: $4e^{-2x}-8e^{-2x}+4e^{-2x}=0$."
  },
  "der-024": {
    "spot": "The direction $(3,4)/5$ is already a unit vector ($3$-$4$-$5$), so just dot it with the gradient.",
    "why": "Directional derivative $=\\nabla f\\cdot\\mathbf u$; no need to go back to the limit definition.",
    "steps": [
      "$\\nabla f=(2x,2y)$, which at $(1,2)$ is $(2,4)$.",
      "$\\mathbf u=(\\frac{3}{5},\\frac{4}{5})$, length $1$.",
      "$D_{\\mathbf u}f=2\\cdot\\frac{3}{5}+4\\cdot\\frac{4}{5}=\\frac{22}{5}$."
    ],
    "trap": "Using $(3,4)$ without dividing by $5$ gives $22$.",
    "check": "Walk a distance $t$ in this direction: the derivative of $f(1+\\frac{3t}{5},2+\\frac{4t}{5})$ at $t=0$ is the directional derivative."
  },
  "ode-h2-001": {
    "spot": "$r^2-3r+2=(r-1)(r-2)$: two distinct real roots, general solution $Ae^x+Be^{2x}$, and the two initial values give a 2-by-2 linear system.",
    "why": "A constant-coefficient homogeneous equation is done once the characteristic equation factors; the rest is just plugging in initial values.",
    "steps": [
      "Characteristic equation $r^2-3r+2=(r-1)(r-2)$, roots $1,2$.",
      "General solution $y=Ae^x+Be^{2x}$; both $e^x$ and $e^{2x}$ satisfy the equation.",
      "$y(0)=A+B=0$, $y'(0)=A+2B=1$; subtracting gives $B=1$, $A=-1$.",
      "So $y=e^{2x}-e^x$."
    ],
    "trap": "Swapping $A$ and $B$ when solving the system gives $e^x-e^{2x}$: its $y'(0)=-1$, which shows up as soon as you plug back in.",
    "check": "$y=e^x(e^x-1)$ is positive for $x>0$ and negative for $x<0$, consistent with $y(0)=0$ and $y'(0)=1>0$ (crossing from negative to positive)."
  },
  "ode-sep-004": {
    "spot": "$y'=\\frac{x}{y}$: the right side is \"a function of $x$\" over \"a function of $y$\" — separable; cross-multiply to get $y\\,dy=x\\,dx$.",
    "why": "For a separable equation, integrate both sides directly; the initial value $y(0)=2>0$ decides that the square root takes the positive sign.",
    "steps": [
      "$y\\,dy=x\\,dx$; integrating gives $\\frac{y^2}{2}=\\frac{x^2}{2}+C$, i.e. $y^2=x^2+2C$.",
      "$y(0)=2$: $4=0+2C$, so $y^2=x^2+4$.",
      "$y(0)=2>0$, so take the positive root: $y=\\sqrt{x^2+4}$."
    ],
    "trap": "Forgetting the constant after integrating gives $y=x$ (which fails $y(0)=2$); or taking the root $-\\sqrt{x^2+4}$, which is $-2$ at $x=0$.",
    "check": "The solution curve is the upper branch of the hyperbola $y^2-x^2=4$."
  },
  "ode-lin-004": {
    "spot": "The left side $xy'+y$ is exactly $(xy)'$ — the Product Rule in reverse, so there's no need to find an integrating factor.",
    "why": "Once you recognize $(xy)'=x^2$, integrate both sides once and you're done; normalizing to $y'+\\frac{y}{x}=x$ and computing the integrating factor $x$ just goes the long way round to the same place.",
    "steps": [
      "$xy'+y=(xy)'$, so the equation becomes $(xy)'=x^2$.",
      "Integrate: $xy=\\frac{x^3}{3}+C$.",
      "$y(1)=1$: $1=\\frac{1}{3}+C$, $C=\\frac{2}{3}$.",
      "$y=\\frac{x^3/3+2/3}{x}=\\frac{x^3+2}{3x}$."
    ],
    "trap": "Dividing only the first term by $x$ at the end, writing $\\frac{x^2}{3}+\\frac{2}{3}$: it also equals $1$ at $x=1$, but it doesn't satisfy the equation.",
    "check": "As $x\\to 0^+$, $y\\approx\\frac{2}{3x}$ blows up, which is why the problem restricts to $x>0$; at $x=2$, $y=\\frac{10}{6}=\\frac{5}{3}$."
  },
  "ap-work-001": {
    "spot": "The spring force $F=kx$ grows with the stretch — it's not constant — so work is the integral $\\int_0^{0.2}kx\\,dx$; first find $k$ from \"$0.1$ m takes $20$ N\".",
    "why": "When the force varies you can't use \"force times distance\"; under Hooke's law the integral is just a triangle's area.",
    "steps": [
      "$k=\\frac{20}{0.1}=200$ N/m.",
      "$W=\\int_0^{0.2}200x\\,dx=100x^2\\Big|_0^{0.2}=4$ J.",
      "Equivalently $W=\\frac{1}{2}kx^2=\\frac{1}{2}\\cdot 200\\cdot 0.04=4$ J."
    ],
    "trap": "Multiplying the final force $40$ N by $0.2$ m gives $8$ J; the force grows gradually from $0$ to $40$ N, so the average is only $20$ N.",
    "check": "The graph of $F$ against $x$ is a straight line from $(0,0)$ to $(0.2,40)$, with triangle area $\\frac{1}{2}\\cdot 0.2\\cdot 40=4$."
  },
  "dd-lin-004": {
    "spot": "A small measurement error, and the question asks for the volume error: use the differential $dV=V'(r)\\,dr$, where $V'(r)=4\\pi r^2$ is exactly the sphere's surface area.",
    "why": "Linear approximation does it in one line, without actually computing $V(10.05)-V(10)$.",
    "steps": [
      "$V=\\frac{4}{3}\\pi r^3$, $V'(r)=4\\pi r^2$.",
      "Plug in $r=10$: $V'(10)=400\\pi$.",
      "$dV=400\\pi\\cdot 0.05=20\\pi$ cubic cm."
    ],
    "trap": "Plugging the error straight into the volume formula, $\\frac{4}{3}\\pi(0.05)^3$, gives a tiny number; the error has to be multiplied by \"the rate of change of volume with radius\".",
    "check": "The actual change $V(10.05)-V(10)\\approx 20.1\\pi$ is a bit larger than $20\\pi$ ($V$ is convex, so the tangent line underestimates)."
  },
  "exam-multi-005": {
    "spot": "The direction $(\\frac{3}{5},\\frac{4}{5})$ is already a unit vector, so compute $\\nabla f(1,2)$ and take the dot product.",
    "why": "Directional derivative $=\\nabla f\\cdot\\mathbf u$; the partial derivatives of $f=x^2y$ are immediate.",
    "steps": [
      "$f_x=2xy$, $f_y=x^2$.",
      "At $(1,2)$: $\\nabla f=(4,1)$.",
      "$4\\cdot\\frac{3}{5}+1\\cdot\\frac{4}{5}=\\frac{16}{5}$."
    ],
    "trap": "Computing $f_y$ as $2xy$, or pairing the components wrong ($4\\cdot\\frac{4}{5}+1\\cdot\\frac{3}{5}=3$).",
    "check": "Walk a distance $t$ in that direction: the derivative of $(1+\\frac{3t}{5})^2(2+\\frac{4t}{5})$ at $t=0$."
  },
  "mob-beta-010": {
    "spot": "The second parameter of $B(4,1)$ is $1$: $(1-t)^{0}=1$, so the Beta integral collapses to $\\int_0^1t^3\\,dt$.",
    "why": "Using the definition directly is fastest; the Gamma formula serves as a check.",
    "steps": [
      "$B(4,1)=\\int_0^1t^{3}(1-t)^{0}\\,dt=\\int_0^1t^3\\,dt$.",
      "$\\int_0^1t^3\\,dt=\\frac{1}{4}$.",
      "Gamma formula: $\\frac{\\Gamma(4)\\Gamma(1)}{\\Gamma(5)}=\\frac{3!\\cdot 0!}{4!}=\\frac{1}{4}$."
    ],
    "trap": "Treating $\\Gamma(n)$ as $n!$ and computing $\\frac{4!\\cdot 1!}{5!}=\\frac{1}{5}$. In fact $\\Gamma(n)=(n-1)!$.",
    "check": "In general $B(a,1)=\\frac{1}{a}$; $a=4$ gives $\\frac{1}{4}$."
  },
  "world-079": {
    "spot": "$\\int_0^1(\\ln x)^k\\,dx$: substitute $x=e^{-t}$, $\\ln x$ becomes $-t$, and the whole thing becomes $(-1)^k\\Gamma(k+1)$.",
    "why": "Integration by parts would take three rounds; the substitution lands on $\\Gamma(4)=6$ in one step.",
    "steps": [
      "Let $x=e^{-t}$: $\\ln x=-t$, $dx=-e^{-t}dt$, and $x:0\\to 1$ corresponds to $t:\\infty\\to 0$. The integral $=\\int_0^\\infty(-t)^3e^{-t}\\,dt=-\\int_0^\\infty t^3e^{-t}\\,dt$.",
      "$\\int_0^\\infty t^3e^{-t}\\,dt=\\Gamma(4)=3!=6$.",
      "So the answer is $-6$."
    ],
    "trap": "Dropping the minus sign of $(-t)^3$ and answering $6$. On $(0,1)$, $\\ln x<0$, and its cube is still negative.",
    "check": "The antiderivative $x(\\ln^3x-3\\ln^2x+6\\ln x-6)$ is $-6$ at $1$ and tends to $0$ as $0^+$."
  },
  "burst-boss-ser-004": {
    "spot": "$\\sum\\frac{(-1)^{n+1}}{n^2}$ is $\\sum\\frac{1}{n^2}$ with signs attached: \"subtract the even terms twice\" and you get there from $\\zeta(2)$.",
    "why": "The alternating and non-alternating versions differ only in the even terms, and the even terms sum to exactly $\\frac{1}{4}\\zeta(2)$, so no Fourier series is needed.",
    "steps": [
      "Known: $\\sum_{n\\ge 1}\\frac{1}{n^2}=\\frac{\\pi^2}{6}$.",
      "Even terms: $\\sum\\frac{1}{(2n)^2}=\\frac{1}{4}\\cdot\\frac{\\pi^2}{6}=\\frac{\\pi^2}{24}$.",
      "Alternating sum $=$ all terms $-2\\times$ even terms $=\\frac{\\pi^2}{6}-\\frac{\\pi^2}{12}=\\frac{\\pi^2}{12}$."
    ],
    "trap": "Subtracting the even terms only once gives $\\frac{\\pi^2}{6}-\\frac{\\pi^2}{24}=\\frac{\\pi^2}{8}$ (that's the sum of the odd terms). The even terms were originally added and must become subtracted — a difference of twice their sum.",
    "check": "The sum of an alternating series lies between consecutive partial sums: $S_2=\\frac{3}{4}<\\frac{\\pi^2}{12}\\approx 0.822<S_1=1$."
  },
  "burst-boss3-anti-003": {
    "spot": "Polynomial $x^5$ times $\\cos 2x$: $x^5$ becomes $0$ after six derivatives, while $\\cos 2x$ stays trigonometric no matter how many times you integrate — the tabular method (tabular integration by parts).",
    "why": "Integration by parts would need five rounds; writing it as a table (left column differentiated down, right column integrated down, signs alternating) means no missed terms and no sign mix-ups.",
    "steps": [
      "Left column, differentiate: $x^5,\\ 5x^4,\\ 20x^3,\\ 60x^2,\\ 120x,\\ 120,\\ 0$.",
      "Right column, integrate $\\cos 2x$: $\\frac{\\sin 2x}{2},\\ -\\frac{\\cos 2x}{4},\\ -\\frac{\\sin 2x}{8},\\ \\frac{\\cos 2x}{16},\\ \\frac{\\sin 2x}{32},\\ -\\frac{\\cos 2x}{64}$.",
      "Multiply along the diagonals with signs $+,-,+,-,+,-$: $\\frac{x^5\\sin 2x}{2}+\\frac{5x^4\\cos 2x}{4}-\\frac{5x^3\\sin 2x}{2}-\\frac{15x^2\\cos 2x}{4}+\\frac{15x\\sin 2x}{4}+\\frac{15\\cos 2x}{8}+C$.",
      "Differentiate back to check: the middle terms cancel in pairs, leaving only $x^5\\cos 2x$."
    ],
    "trap": "Not alternating the signs, or forgetting the extra $\\frac{1}{2}$ each time you integrate in the right column ($\\int\\cos 2x=\\frac{\\sin 2x}{2}$), which throws every coefficient off.",
    "check": "The integrand is an odd function, so the antiderivative should be even: $F(x)=F(-x)$."
  },
  "burst-int-018": {
    "spot": "The power of $\\cos$ is odd, $3$: give one $\\cos x$ to $d(\\sin x)$, the remaining $\\cos^2x=1-\\sin^2x$, and $u=\\sin x$ turns it into a polynomial.",
    "why": "If there's an odd power, use it for the substitution; only when both are even do you need Wallis or power reduction.",
    "steps": [
      "Let $u=\\sin x$, $du=\\cos x\\,dx$, $u:0\\to 1$: the integral $=\\int_0^1u^5(1-u^2)\\,du$.",
      "$\\int_0^1(u^5-u^7)\\,du=\\frac{1}{6}-\\frac{1}{8}$.",
      "$\\frac{1}{6}-\\frac{1}{8}=\\frac{1}{24}$."
    ],
    "trap": "Substituting with $\\sin$ instead ($u=\\cos x$) also works, but remember the minus sign flips the limits; forget it and you get $-\\frac{1}{24}$.",
    "check": "Wallis type: $\\frac{4!!\\cdot 2!!}{8!!}=\\frac{8\\cdot 2}{384}=\\frac{1}{24}$."
  },
  "burst-int-019": {
    "spot": "$\\sin^8x\\cos^2x$ has both powers even, so there's no odd power to substitute with: write $\\cos^2x=1-\\sin^2x$ and split into a difference of two Wallis integrals.",
    "why": "Power-reduction formulas would need several layers of expansion; the Wallis integral $\\int_0^{\\pi/2}\\sin^nx\\,dx$ has the ready-made recursion $W_n=\\frac{n-1}{n}W_{n-2}$.",
    "steps": [
      "$\\sin^8x\\cos^2x=\\sin^8x-\\sin^{10}x$, so the integral $=W_8-W_{10}$.",
      "$W_8=\\frac{7\\cdot 5\\cdot 3\\cdot 1}{8\\cdot 6\\cdot 4\\cdot 2}\\cdot\\frac{\\pi}{2}=\\frac{35\\pi}{256}$.",
      "$W_{10}=\\frac{9}{10}W_8=\\frac{63\\pi}{512}$.",
      "$\\frac{70\\pi}{512}-\\frac{63\\pi}{512}=\\frac{7\\pi}{512}$."
    ],
    "trap": "Forgetting the $\\frac{\\pi}{2}$ in the even-power Wallis formula gives $\\frac{7}{256}$. The $\\pi$ appears only when both powers are even.",
    "check": "Another way: $W_{10}=\\frac{9}{10}W_8$, so the difference is $\\frac{1}{10}W_8=\\frac{1}{10}\\cdot\\frac{35\\pi}{256}=\\frac{7\\pi}{512}$."
  },
  "burst-rec-002": {
    "spot": "$x^n(\\ln x)^2$: one round of integration by parts lowers $(\\ln x)^2$ to $\\ln x$, which connects to the known $\\int_0^1x^n\\ln x\\,dx=-\\frac{1}{(n+1)^2}$.",
    "why": "The recursion $I^{(k)}=-\\frac{k}{n+1}I^{(k-1)}$ lowers the power of $\\ln$ by one each time, and all boundary terms are $0$.",
    "steps": [
      "$u=(\\ln x)^2$, $dv=x^n\\,dx$: $v=\\frac{x^{n+1}}{n+1}$, $du=\\frac{2\\ln x}{x}dx$. The boundary term $\\frac{x^{n+1}}{n+1}(\\ln x)^2$ is $0$ at both $1$ and $0^+$.",
      "So $\\int_0^1x^n(\\ln x)^2\\,dx=-\\frac{2}{n+1}\\int_0^1x^n\\ln x\\,dx$.",
      "Substitute $\\int_0^1x^n\\ln x\\,dx=-\\frac{1}{(n+1)^2}$.",
      "$-\\frac{2}{n+1}\\cdot\\left(-\\frac{1}{(n+1)^2}\\right)=\\frac{2}{(n+1)^3}$."
    ],
    "trap": "Losing the $2$ in $du$ (the derivative of $(\\ln x)^2$ is $\\frac{2\\ln x}{x}$) gives $\\frac{1}{(n+1)^3}$.",
    "check": "$(\\ln x)^2\\ge 0$, so the answer must be positive; $n=0$ gives $\\int_0^1(\\ln x)^2\\,dx=2=\\Gamma(3)$."
  },
  "depth-der-005": {
    "spot": "Both limits are functions of $x$: the Fundamental Theorem of Calculus plus the Chain Rule — \"plug in the upper limit times its derivative, minus the lower limit plugged in times its derivative\".",
    "why": "$\\cos(t^2)$ has no elementary antiderivative, so you can't integrate first and then differentiate; the Fundamental Theorem skips the integral entirely.",
    "steps": [
      "Let $F'=\\cos(t^2)$; the expression $=F(x^3)-F(x^2)$.",
      "Chain Rule: upper-limit derivative $(x^3)'=3x^2$, lower-limit derivative $(x^2)'=2x$.",
      "$\\frac{d}{dx}=\\cos(x^6)\\cdot 3x^2-\\cos(x^4)\\cdot 2x$."
    ],
    "trap": "Forgetting to multiply by the limits' derivatives gives $\\cos(x^6)-\\cos(x^4)$; or plugging in $x^3$ as $\\cos(x^3)$ and forgetting that squaring makes it $x^6$.",
    "check": "At $x=1$ both limits are $1$: the derivative is $3\\cos 1-2\\cos 1=\\cos 1$."
  },
  "hd-006": {
    "spot": "$e^x\\sin x$ is the imaginary part of $e^{(1+i)x}$: differentiating $n$ times multiplies by $(1+i)^n$, and $1+i=\\sqrt2e^{i\\pi/4}$ — each derivative scales by $\\sqrt2$ and adds $\\frac{\\pi}{4}$ to the phase.",
    "why": "Five rounds of the Product Rule produce a pile of terms; with complex numbers one line shows $\\frac{d^n}{dx^n}(e^x\\sin x)=2^{n/2}e^x\\sin(x+\\frac{n\\pi}{4})$.",
    "steps": [
      "One derivative: $(e^x\\sin x)'=e^x(\\sin x+\\cos x)=\\sqrt2e^x\\sin(x+\\frac{\\pi}{4})$.",
      "Each derivative multiplies by $\\sqrt2$ and adds $\\frac{\\pi}{4}$ to the phase; e.g. the second derivative is $2e^x\\sin(x+\\frac{\\pi}{2})=2e^x\\cos x$.",
      "Fifth derivative at $x=0$: $2^{5/2}\\sin\\frac{5\\pi}{4}=4\\sqrt2\\cdot\\left(-\\frac{\\sqrt2}{2}\\right)=-4$."
    ],
    "trap": "Getting the phase wrong as it goes around: $\\sin\\frac{5\\pi}{4}$ is negative, so answering $+4$ is wrong; or using $2^5$ as the scale factor instead of $(\\sqrt2)^5$.",
    "check": "Taylor expansion: $e^x\\sin x=x+x^2+\\frac{x^3}{3}-\\frac{x^5}{30}+\\cdots$; the $x^5$ coefficient times $5!$: $-\\frac{120}{30}=-4$."
  },
  "mob-lm-001": {
    "spot": "The constraint $x+y=10$ is a line: substitute $y=10-x$ to get one variable; with Lagrange multipliers, $\\nabla(xy)=\\lambda\\nabla(x+y)$ immediately gives $y=x$.",
    "why": "When the constraint can be solved for one variable, substituting is faster than Lagrange multipliers; both routes point to $x=y=5$.",
    "steps": [
      "Lagrange: $y=\\lambda$, $x=\\lambda$, so $x=y$, and with $x+y=10$ that gives $x=y=5$. Equivalently, $g(x)=x(10-x)$ has derivative $0$ at $x=5$.",
      "$g''=-2<0$, so it's a maximum.",
      "Maximum value $5\\cdot 5=25$."
    ],
    "trap": "Ignoring the boundary of $x,y>0$: as $x\\to 0$ or $x\\to 10$ the product tends to $0$, which is the infimum, not the maximum.",
    "check": "AM-GM: $25-x(10-x)=(x-5)^2\\ge 0$."
  },
  "mob-lm-010": {
    "spot": "Maximize the linear function $x+y$ on the circle $x^2+y^2=2$: Lagrange gives $x=y$; or parametrize directly with $x=\\sqrt2\\cos t$, $y=\\sqrt2\\sin t$ and combine into a single sine.",
    "why": "Both routes are short; the parametrization also shows the minimum is $-2$, so you don't pick the wrong point.",
    "steps": [
      "Lagrange: $1=2\\lambda x$, $1=2\\lambda y$, so $x=y$; substituting into $2x^2=2$ gives $x=\\pm 1$.",
      "The candidate $(1,1)$ gives $2$, and $(-1,-1)$ gives $-2$.",
      "Check by parametrizing: $\\sqrt2\\cos t+\\sqrt2\\sin t=2\\sin(t+\\frac{\\pi}{4})\\le 2$, attained at $t=\\frac{\\pi}{4}$."
    ],
    "trap": "Solving $x=\\pm 1$ and then taking $(-1,-1)$ without comparing, getting $-2$ (that's the minimum).",
    "check": "Cauchy-Schwarz: $x+y\\le\\sqrt{1^2+1^2}\\sqrt{x^2+y^2}=\\sqrt2\\cdot\\sqrt2=2$."
  },
  "rel-boss-010": {
    "spot": "The integrand has $x+y$ in the denominator and the region is the triangle $x+y<1$: let $u=x+y$, $v=\\frac{x}{x+y}$ (i.e. $x=uv$, $y=u(1-v)$); the region becomes the square $[0,1]^2$ and the denominator cancels right away.",
    "why": "In $xy$ coordinates $\\frac{xy}{x+y}$ is hard to integrate; in $u,v$ the integrand becomes $u^2v(1-v)$, which separates.",
    "steps": [
      "$x=uv$, $y=u(1-v)$: Jacobian $\\begin{vmatrix}v&u\\\\1-v&-u\\end{vmatrix}=-u$, so $|J|=u$.",
      "Integrand: $\\frac{xy}{x+y}=\\frac{uv\\cdot u(1-v)}{u}=uv(1-v)$; times $|J|=u$ gives $u^2v(1-v)$.",
      "The region $x,y>0$, $x+y<1$ becomes $0<u<1$, $0<v<1$, and the integral separates: $\\int_0^1u^2\\,du\\cdot\\int_0^1v(1-v)\\,dv=\\frac{1}{3}\\cdot\\frac{1}{6}$.",
      "Answer: $\\frac{1}{18}$."
    ],
    "trap": "Forgetting to multiply by the Jacobian $u$ gives $\\frac{1}{2}\\cdot\\frac{1}{6}=\\frac{1}{12}$.",
    "check": "Integrating numerically directly in $xy$ coordinates also gives $\\frac{1}{18}\\approx 0.0556$."
  },
  "rel-hard-int-015": {
    "spot": "$x^{-1/2}\\ln x$ is the case $n=-\\frac{1}{2}$ of $\\int_0^1x^n\\ln x\\,dx=-\\frac{1}{(n+1)^2}$; or substitute $x=t^2$ to get rid of the root.",
    "why": "The formula is fastest; substituting $x=t^2$ turns it into $4\\int_0^1\\ln t\\,dt$, which works as a check.",
    "steps": [
      "Antiderivative: $\\frac{d}{dx}\\left(2\\sqrt x\\ln x-4\\sqrt x\\right)=x^{-1/2}\\ln x$.",
      "Lower limit: as $x\\to 0^+$, $\\sqrt x\\ln x\\to 0$, so the whole antiderivative tends to $0$.",
      "Upper limit $x=1$: $0-4=-4$."
    ],
    "trap": "Seeing that $x^{-1/2}$ and $\\ln x$ both blow up at $0$ and thinking it diverges. The power of $x^{-1/2}$ is below $1$, and multiplying by the slow-growing $\\ln x$ keeps it integrable.",
    "check": "Substitute $x=t^2$: $\\int_0^1\\frac{2\\ln t}{t}\\cdot 2t\\,dt=4\\int_0^1\\ln t\\,dt=-4$; the formula $-\\frac{1}{(1/2)^2}=-4$ agrees."
  },
  "rel-hard-mv-004": {
    "spot": "$\\iiint 1\\,dV$ is just the volume; the region is a ball of radius $3$ — spherical coordinates, or simply $\\frac{4}{3}\\pi r^3$.",
    "why": "For a ball-shaped region use spherical coordinates, where the three integrals separate completely.",
    "steps": [
      "Spherical coordinates: $dV=\\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta$, $\\rho\\in[0,3]$, $\\varphi\\in[0,\\pi]$, $\\theta\\in[0,2\\pi]$. $\\int_0^3\\rho^2\\,d\\rho=9$.",
      "$\\int_0^\\pi\\sin\\varphi\\,d\\varphi=2$, $\\int_0^{2\\pi}d\\theta=2\\pi$.",
      "Multiply: $9\\cdot 2\\cdot 2\\pi=36\\pi$."
    ],
    "trap": "Taking the range of $\\varphi$ as $[0,2\\pi]$, which makes $\\int\\sin\\varphi$ equal $0$; or leaving out the volume element $\\rho^2\\sin\\varphi$.",
    "check": "Ball volume formula: $\\frac{4}{3}\\pi\\cdot 27=36\\pi$."
  },
  "rel-hard-mv-008": {
    "spot": "The region's boundaries are ranges of $x+y$ and $x-y$, and the integrand happens to be $x+y$: let $u=x+y$, $v=x-y$, and the integrand is just $u$.",
    "why": "After the change of variables the region is a rectangle and the integrand is only $u$ — one line.",
    "steps": [
      "$\\frac{\\partial(u,v)}{\\partial(x,y)}=-2$, so $dA=\\frac{1}{2}du\\,dv$.",
      "$\\iint(x+y)\\,dA=\\frac{1}{2}\\int_0^1\\int_0^2u\\,dv\\,du=\\frac{1}{2}\\cdot 2\\cdot\\int_0^1u\\,du$.",
      "$=\\frac{1}{2}\\cdot 2\\cdot\\frac{1}{2}=\\frac{1}{2}$."
    ],
    "trap": "Using the Jacobian as a factor of $2$ gives $2$. To get back to $dx\\,dy$ you divide by $\\left|\\frac{\\partial(u,v)}{\\partial(x,y)}\\right|$.",
    "check": "The region has area $1$, and $u=x+y$ is uniformly distributed on $[0,1]$ with average $\\frac{1}{2}$; integral $=$ average $\\times$ area $=\\frac{1}{2}$."
  },
  "world-015": {
    "spot": "Denominator $1+x^2$, upper limit $1$: substitute $x=\\tan\\theta$ to get $\\int_0^{\\pi/4}\\ln(1+\\tan\\theta)\\,d\\theta$, and $\\theta\\to\\frac{\\pi}{4}-\\theta$ turns $1+\\tan$ into $\\frac{2}{1+\\tan\\theta}$ — a symmetric substitution that adds the integral to itself.",
    "why": "Feynman's parameter trick also works but means solving an extra differential equation; the $\\frac{\\pi}{4}-\\theta$ symmetry splits the $\\ln$ in one line.",
    "steps": [
      "$x=\\tan\\theta$, $dx=\\sec^2\\theta\\,d\\theta$, $\\frac{dx}{1+x^2}=d\\theta$: $I=\\int_0^{\\pi/4}\\ln(1+\\tan\\theta)\\,d\\theta$.",
      "$1+\\tan(\\frac{\\pi}{4}-\\theta)=1+\\frac{1-\\tan\\theta}{1+\\tan\\theta}=\\frac{2}{1+\\tan\\theta}$.",
      "Substitute $\\theta\\to\\frac{\\pi}{4}-\\theta$: $I=\\int_0^{\\pi/4}\\left(\\ln 2-\\ln(1+\\tan\\theta)\\right)d\\theta=\\frac{\\pi}{4}\\ln 2-I$.",
      "$2I=\\frac{\\pi}{4}\\ln 2$, $I=\\frac{\\pi\\ln 2}{8}$."
    ],
    "trap": "After substituting, splitting $\\ln\\frac{2}{1+\\tan\\theta}$ wrongly, e.g. as $\\frac{\\ln 2}{\\ln(1+\\tan\\theta)}$; the $\\ln$ of a quotient becomes a difference.",
    "check": "On $[0,1]$ the integrand lies between $0$ and $\\ln 2\\approx 0.69$, so an answer of $\\approx 0.272$ is reasonable."
  },
  "world-090": {
    "spot": "$e^{-x^2}$ has no elementary antiderivative, but the product $e^{-x^2}e^{-y^2}=e^{-(x^2+y^2)}$ is rotationally symmetric — square it, switch to polar coordinates, and the extra $r$ makes it integrable.",
    "why": "No one-variable substitution works; squaring turns it into a double integral, and the polar area element $r\\,dr\\,d\\theta$ supplies exactly the missing $r$.",
    "steps": [
      "Let $I=\\int_0^\\infty e^{-x^2}\\,dx$; then $I^2=\\iint_{x,y\\ge 0}e^{-(x^2+y^2)}\\,dx\\,dy$ (first quadrant).",
      "Polar coordinates: $\\theta\\in[0,\\frac{\\pi}{2}]$, $\\int_0^\\infty e^{-r^2}r\\,dr=\\frac{1}{2}$.",
      "$I^2=\\frac{\\pi}{2}\\cdot\\frac{1}{2}=\\frac{\\pi}{4}$.",
      "$I>0$, so $I=\\frac{\\sqrt\\pi}{2}$."
    ],
    "trap": "Remembering the whole-real-line value $\\sqrt\\pi$; this integral is only over $[0,\\infty)$, so it's half.",
    "check": "$e^{-x^2}\\le 1$ and has already dropped to $0.37$ at $x=1$, so an area of about $0.886$ is reasonable; it also equals $\\frac{1}{2}\\Gamma(\\frac{1}{2})$."
  },
  "world-099": {
    "spot": "$\\tan(\\sin x)$ and $\\sin(\\tan x)$ differ only in the order of composition, and the denominator is $x^7$: their Taylor expansions agree for the first several terms, and you have to go to $x^7$ to tell them apart.",
    "why": "L'Hôpital's Rule would need seven derivatives — not practical; the Taylor expansion lays out each order's coefficient, and the subtraction is plain to see.",
    "steps": [
      "Up to $x^5$ the two are identical: both are $x+\\frac{x^3}{6}-\\frac{x^5}{40}+\\cdots$.",
      "The $x^7$ term: the coefficient in $\\tan(\\sin x)$ is $-\\frac{107}{5040}$.",
      "The coefficient in $\\sin(\\tan x)$ is $-\\frac{55}{1008}=-\\frac{275}{5040}$.",
      "Subtract: $\\left(-\\frac{107}{5040}+\\frac{275}{5040}\\right)x^7=\\frac{168}{5040}x^7=\\frac{x^7}{30}$; dividing by $x^7$ gives $\\frac{1}{30}$."
    ],
    "trap": "Expanding only to $x^3$ or $x^5$, seeing the two sides agree, and concluding the numerator is $0$ and the limit is $0$. With $x^7$ in the denominator, you must expand to $x^7$.",
    "check": "Plug in $x=0.1$: the ratio is about $0.0333$, close to $\\frac{1}{30}$."
  }
};
