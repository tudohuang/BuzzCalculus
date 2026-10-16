// Detail v2, English — batch 007. Translation of tools/content/detail/007.js (text only; claims live in the Chinese file).
module.exports = {
  "der-057": {
    "spot": "$f=x^4+y^2$ at the origin: $x^4$ is degree four, so its second derivative vanishes at $0$; and the two variables are separate with no cross term — the Hessian is diagonal, so its determinant is just the product of the two second partials.",
    "why": "Compute the three second partials $f_{xx},f_{yy},f_{xy}$ at the origin and plug into $f_{xx}f_{yy}-f_{xy}^2$ — done in one line, no need for the Hessian at a general point.",
    "steps": [
      "$f_{xx}=12x^2$, which is $0$ at $x=0$.",
      "$f_{yy}=2$, a constant.",
      "$f_{xy}$: $f_x=4x^3$ has no $y$ in it, so differentiating in $y$ gives $0$.",
      "Hessian $=\\begin{pmatrix}0&0\\\\0&2\\end{pmatrix}$, determinant $=0\\cdot 2-0^2=0$."
    ],
    "trap": "Seeing a determinant of $0$ and concluding the origin is not an extremum. A determinant of $0$ means the test fails (degenerate), not a no — here $f\\ge 0=f(0,0)$, so the origin is actually a minimum.",
    "check": "The origin is a minimum of $f$ ($f\\ge 0$), but the $x$ direction is too flat for the second-order test to see: along the $x$-axis $f=x^4$, whose second derivative at $0$ is $0$ — matching the $0$ in the Hessian."
  },
  "der-079": {
    "spot": "$u=x^2-y^2$, $v=2xy$ — exactly the real and imaginary parts of $z^2=(x+iy)^2$. When given $u,v$ and asked about holomorphy, check the two Cauchy–Riemann equations.",
    "why": "The CR equations need only four first partials — more mechanical and harder to get wrong than recognizing $z^2$ and then justifying it.",
    "steps": [
      "First, $u_x=v_y$: $u_x=2x$, $v_y=2x$, equal everywhere.",
      "Second, $u_y=-v_x$: $u_y=-2y$, $v_x=2y$, holds everywhere.",
      "All four partials are polynomials, continuous everywhere, so CR holds on the whole plane.",
      "So $u+iv$ is holomorphic on the entire complex plane (it is $f(z)=z^2$; e.g. $(1+2i)^2=-3+4i$)."
    ],
    "trap": "Writing the second equation as $u_y=v_x$ without the minus sign: you get $-2y=2y$, think it holds only at $y=0$, and answer no.",
    "check": "$(x+iy)^2=x^2-y^2+2ixy$: the real and imaginary parts are exactly $u,v$, and $z^2$ is a polynomial, so of course it's holomorphic. At $x=1,y=2$: $u=-3$, $v=4$, and $(1+2i)^2=-3+4i$."
  },
  "der-080": {
    "spot": "$v=0$ while $u=x^2+y^2$ is not constant: the imaginary part never moves but the real part changes — the CR equations pair the partials of $u$ with those of $v$, and since $v$'s are all $0$, $u$'s partials are forced to be $0$ too.",
    "why": "Check where the two CR equations hold: if they hold at only one point, no open set can fit around it.",
    "steps": [
      "$u_x=2x$, $u_y=2y$; $v=0$ so $v_x=v_y=0$.",
      "$u_x=v_y$ requires $2x=0$ and $u_y=-v_x$ requires $2y=0$: both hold only at the origin $(0,0)$.",
      "At any point near the origin (e.g. $x=0.01$) CR fails, so there is no open set on which CR holds everywhere.",
      "For example at $(0.5,0.5)$: $u_x=1$ but $v_y=0$. Conclusion: not holomorphic (on any open set)."
    ],
    "trap": "Seeing that CR holds at the origin and answering yes. Being complex differentiable at one point is not the same as holomorphic, which requires differentiability on a whole open set.",
    "check": "$u+iv=x^2+y^2=|z|^2=z\\bar z$, which contains $\\bar z$ — expressions involving $\\bar z$ are almost never holomorphic. At $z=3+4i$, $|z|^2=25$."
  },
  "der-085": {
    "spot": "$f(z)=z^4$ is a polynomial: the complex derivative follows the same power rule as in the reals, $f'(z)=4z^3$; plugging in $z=1+i$ leaves only complex multiplication.",
    "why": "Computing $(1+i)^2=2i$ first and multiplying once more takes far fewer terms than a binomial expansion of $(1+i)^3$.",
    "steps": [
      "$f'(z)=4z^3$.",
      "$(1+i)^2=1+2i+i^2=2i$: real part $1-1=0$, imaginary part $2$.",
      "$(1+i)^3=2i(1+i)=-2+2i$.",
      "$f'(1+i)=4(-2+2i)=-8+8i$, real part $-8$."
    ],
    "trap": "Computing $(1+i)^2$ as $2$ (forgetting $i^2=-1$ or writing $2i$ as $2$) gives $(1+i)^3=2+2i$ and real part $8$, with the sign completely flipped.",
    "check": "Check from the real part $u=x^4-6x^2y^2+y^4$: $f'=u_x+iv_x$, and at $(1,1)$ $u_x=4-12=-8$."
  },
  "exam-lim-003": {
    "spot": "The numerator adds and subtracts three basic functions $e^x,\\cos x,\\sin x$ over $x^2$: plugging in $0$ gives $1-1-0=0$. Expand all three to $x^2$ and see whether the constant and linear terms cancel.",
    "why": "L'Hôpital's Rule means differentiating three functions twice; with Taylor series you line up three expansions and read the $x^2$ coefficient directly.",
    "steps": [
      "Plug in $x=0$: numerator $1-1-0=0$, a $\\frac{0}{0}$ form.",
      "Expand to second order: $e^x=1+x+\\frac{x^2}{2}+\\cdots$, $\\cos x=1-\\frac{x^2}{2}+\\cdots$, $\\sin x=x+\\cdots$.",
      "Subtract: constants $1-1=0$, linear terms $x-x=0$, quadratic $\\frac{x^2}{2}+\\frac{x^2}{2}=x^2$, so the numerator $=x^2+\\cdots$.",
      "Divide by $x^2$ to get $1$."
    ],
    "trap": "The quadratic term of $\\cos x$ is $-\\frac{x^2}{2}$, and with the minus sign in front it becomes $+\\frac{x^2}{2}$. Treating it as $-\\frac{x^2}{2}$ makes the two $\\frac{x^2}{2}$ cancel and gives $0$.",
    "check": "Plug in $x=0.01$: the ratio is about $1.0033$, close to $1$."
  },
  "app-007": {
    "spot": "$x+\\frac{4}{x}$: the two terms multiply to the constant $4$ — a fixed-product shape, so AM-GM gives the lower bound in one line; or set the derivative $=0$.",
    "why": "AM-GM, $x+\\frac{4}{x}\\ge 2\\sqrt{4}$, tells you both the minimum and where it occurs, skipping even the second-derivative test.",
    "steps": [
      "The derivative $1-\\frac{4}{x^2}=0$ has only $x=2$ for $x>0$.",
      "For $x<2$ the derivative is negative and for $x>2$ positive: down then up, so $x=2$ is the minimum point.",
      "AM-GM check: $x+\\frac{4}{x}-4=\\frac{(x-2)^2}{x}\\ge 0$.",
      "Minimum value $2+\\frac{4}{2}=4$."
    ],
    "trap": "Answering the minimum point $x=2$ instead of the minimum value $4$: the problem asks for the value of the $\\min$.",
    "check": "Try any values: $x=1$ gives $5$ and $x=4$ gives $5$, both above $4$, equally high on both sides."
  },
  "fd-der-006": {
    "spot": "The whole $(x^2+1)$ is raised to the fourth power: the outer layer is a power, the inner layer is $x^2+1$ — Chain Rule.",
    "why": "Expanding to a degree-eight polynomial and differentiating also works, but the Chain Rule takes one line and keeps the result in factored form.",
    "steps": [
      "The outer $u^4$ has derivative $4u^3$; put $u=x^2+1$ back as is: $4(x^2+1)^3$.",
      "The inner $x^2+1$ has derivative $2x$.",
      "Multiply: $4(x^2+1)^3\\cdot 2x=8x(x^2+1)^3$."
    ],
    "trap": "Forgetting to multiply by the inner derivative and answering $4(x^2+1)^3$.",
    "check": "Check at $x=1$: $8\\cdot 1\\cdot 2^3=64$, matching a numerical derivative of $(x^2+1)^4$."
  },
  "fd-der-009": {
    "spot": "$x$ times $e^x$: a product of two functions, so the Product Rule.",
    "why": "No other shortcut; the Product Rule gives two terms, then factor out $e^x$.",
    "steps": [
      "$(fg)'=f'g+fg'$ with $f=x$, $g=e^x$.",
      "$1\\cdot e^x+x\\cdot e^x$.",
      "Factor out $e^x$: $(x+1)e^x$."
    ],
    "trap": "Just multiplying the two derivatives: $1\\cdot e^x=e^x$, missing a term.",
    "check": "At $x=-1$ the derivative is $0$: $xe^x$ has its minimum at $x=-1$, which matches."
  },
  "fd-lim-002": {
    "spot": "A polynomial with $x\\to -1$: polynomials are continuous everywhere, so plug in directly.",
    "why": "The limit of a continuous function is its value; no technique needed.",
    "steps": [
      "A polynomial is continuous, so limit $=$ function value.",
      "Plug in: $2(-1)^2-(-1)+1=2+1+1$.",
      "The limit is $4$."
    ],
    "trap": "With $x=-1$, $-x$ becomes $+1$; writing it as $-1$ gives $2$.",
    "check": "Plug in $x=-0.99$: $\\approx 3.95$, close to $4$."
  },
  "fd-ser-014": {
    "spot": "The general term $\\frac{n}{n+1}$ has numerator and denominator of the same degree, so as $n\\to\\infty$ it tends to $1$, not $0$ — the $n$-th term test says divergent right away.",
    "why": "If the $n$-th term doesn't go to $0$, the series must diverge; no need for the Comparison Test or Integral Test.",
    "steps": [
      "$\\frac{n}{n+1}=1-\\frac{1}{n+1}$.",
      "As $n\\to\\infty$, the general term $\\to 1\\ne 0$.",
      "Every term is at least $\\frac{1}{2}$, so the partial sums are at least $\\frac{N}{2}$, shooting to infinity.",
      "So the series diverges."
    ],
    "trap": "Seeing that the terms get closer and closer to some number and assuming convergence. A series needs its terms to go to $0$; terms tending to $1$ means adding nearly $1$ every time.",
    "check": "The first $100$ terms add up to more than $95$, and each extra term adds nearly $1$ — it can never level off."
  },
  "fd-ser-018": {
    "spot": "$2n-1$ for $n=1$ to $6$: the first six odd numbers $1,3,5,7,9,11$. The sum of the first $n$ odd numbers is $n^2$.",
    "why": "With only six terms you can just add; but remembering that the sum of the first $n$ odd numbers $=n^2$ is faster and can't miss a term.",
    "steps": [
      "List: $1,3,5,7,9,11$.",
      "Split: $\\sum(2n-1)=2\\sum n-6=2\\cdot 21-6=36$.",
      "That is $6^2=36$."
    ],
    "trap": "Starting $n$ from $0$ adds $-1$ and loses $11$.",
    "check": "Arithmetic series: first term $1$, last term $11$, $6$ terms, sum $=\\frac{(1+11)\\cdot 6}{2}=36$."
  },
  "cx-ode-002": {
    "spot": "$y'=-2y$: the derivative is proportional to the function itself — exponential decay, so the solution must be $Ce^{-2x}$; then use the initial value to find $C$.",
    "why": "Separating variables just leads back to the same conclusion; writing $Ce^{kx}$ directly is fastest.",
    "steps": [
      "$\\frac{dy}{y}=-2\\,dx$; integrating gives $\\ln|y|=-2x+c$, so $y=Ce^{-2x}$.",
      "Initial value $y(0)=C=5$.",
      "$y=5e^{-2x}$; substitute back into the equation to confirm."
    ],
    "trap": "Writing $y=e^{-2x}+5$: the constant multiplies the exponential; if it's added, $y'=-2y$ no longer holds.",
    "check": "At the half-life $\\frac{\\ln 2}{2}$, $y$ should be exactly $2.5$."
  },
  "cx-seq-002": {
    "spot": "$\\left(1+\\frac{1}{n}\\right)^n$: base tends to $1$, exponent tends to infinity, a $1^\\infty$ form — this is the defining formula of $e$.",
    "why": "If you don't recognize it, take $\\ln$ to get $n\\ln(1+\\frac{1}{n})$ and expand; that also gives $1$ in one line.",
    "steps": [
      "Take logs: $\\ln a_n=n\\ln\\left(1+\\frac{1}{n}\\right)$.",
      "$\\ln(1+u)=u-\\frac{u^2}{2}+\\cdots$ with $u=\\frac{1}{n}$: $n\\left(\\frac{1}{n}-\\frac{1}{2n^2}+\\cdots\\right)\\to 1$.",
      "So $a_n\\to e^1=e$."
    ],
    "trap": "Thinking the base $\\to 1$ so the whole thing $\\to 1$: the exponent shoots to infinity at the same time, and $1^\\infty$ is an indeterminate form.",
    "check": "At $n=1000$, $a_n\\approx 2.7169$, slightly below $e\\approx 2.7183$ (the sequence climbs up from below)."
  },
  "gap-der-ode-001": {
    "spot": "$y'+y=0$ is just $y'=-y$: the derivative equals minus the function, exponential decay $Ce^{-x}$.",
    "why": "You can see at a glance it's $Ce^{-x}$, no integrating factor needed; all that's left is using $y(0)$ to fix the constant.",
    "steps": [
      "The general solution of $y'=-y$ is $Ce^{-x}$.",
      "$y(0)=C=2$.",
      "$y=2e^{-x}$; substitute back into the equation."
    ],
    "trap": "Writing $Ce^{x}$: wrong sign — $e^x$ solves $y'=+y$.",
    "check": "At $x=\\ln 2$, $y=2\\cdot\\frac{1}{2}=1$; it halves every $\\ln 2$."
  },
  "ig-num-004": {
    "spot": "Right-endpoint sum, $n=4$, interval length $2$: each subinterval has width $h=\\frac{1}{2}$, with right endpoints $\\frac{1}{2},1,\\frac{3}{2},2$.",
    "why": "Just tabulate from the definition; factor out $h$ first and you only need to add four function values.",
    "steps": [
      "$h=\\frac{2-0}{4}=\\frac{1}{2}$, right endpoints $x_i=\\frac{i}{2}$, $i=1,\\dots,4$.",
      "Function values: $\\frac{1}{4},1,\\frac{9}{4},4$, summing to $\\frac{15}{2}$.",
      "$R_4=\\frac{1}{2}\\cdot\\frac{15}{2}=\\frac{15}{4}$."
    ],
    "trap": "Including the left endpoint $0$ (using $0,\\frac{1}{2},1,\\frac{3}{2}$) gives the left-endpoint sum $\\frac{7}{4}$.",
    "check": "The true value is $\\int_0^2x^2dx=\\frac{8}{3}\\approx 2.67$; $x^2$ is increasing, so the right-endpoint sum should overestimate, and $\\frac{15}{4}=3.75$ is indeed larger."
  },
  "ig-num-011": {
    "spot": "The key words are increasing and left endpoint: an increasing function's minimum on each subinterval is at the left endpoint.",
    "why": "Monotonicity decides it without computing the sum; concavity governs the Trapezoidal Rule, not left or right endpoint sums.",
    "steps": [
      "$x^2$ is increasing on $[0,1]$: on each piece $[x_{i-1},x_i]$, $f(x)\\ge f(x_{i-1})$.",
      "So every rectangle sits under the curve, and the left-endpoint sum $=$ the lower sum. Computing: $L_4=\\frac{1}{4}\\left(0+\\frac{1}{16}+\\frac{1}{4}+\\frac{9}{16}\\right)=\\frac{7}{32}$.",
      "The true value is $\\frac{1}{3}\\approx 0.333$, and $\\frac{7}{32}\\approx 0.219$ is smaller: an underestimate."
    ],
    "trap": "Judging by concavity (saying $x^2$ is concave up so it overestimates): that's the rule for the Trapezoidal Rule; endpoint sums depend on increasing or decreasing.",
    "check": "The right-endpoint sum $\\frac{15}{32}$ is the upper sum, and the true value lies between the two."
  },
  "lim-011": {
    "spot": "As $x\\to 0^+$, $x\\to 0$ and $\\ln x\\to-\\infty$: a $0\\cdot\\infty$ form. Rewrite as $\\frac{\\ln x}{1/x}$ to get $\\frac{\\infty}{\\infty}$, ready for L'Hôpital's Rule.",
    "why": "Use $\\frac{\\ln x}{1/x}$ (not $\\frac{x}{1/\\ln x}$) because differentiating $\\ln x$ gives $\\frac{1}{x}$, which cancels nicely with the denominator.",
    "steps": [
      "$x\\ln x=\\frac{\\ln x}{1/x}$, numerator $\\to-\\infty$, denominator $\\to+\\infty$.",
      "L'Hôpital: $\\frac{1/x}{-1/x^2}=-x$.",
      "$-x\\to 0$, so the limit is $0$."
    ],
    "trap": "Thinking $\\ln x\\to-\\infty$ wins and answering $-\\infty$: the polynomial $x$ goes to $0$ much faster than $\\ln x$ blows up.",
    "check": "$x=10^{-4}$: $x\\ln x\\approx-0.00092$, very close to $0$, approaching from the negative side."
  },
  "mob-tech-013": {
    "spot": "The integrand is $\\nabla\\phi$ — the gradient of a function. A line integral of a gradient field depends only on the endpoints: $\\phi(B)-\\phi(A)$.",
    "why": "Parametrizing the path and grinding it out also works, but the gradient theorem skips the path entirely; the more complicated the path, the bigger the payoff.",
    "steps": [
      "Gradient theorem (Fundamental Theorem for Line Integrals): $\\int_C\\nabla\\phi\\cdot d\\mathbf r=\\phi(\\mathbf r(b))-\\phi(\\mathbf r(a))$, the multivariable version of the Fundamental Theorem of Calculus.",
      "Example: $\\phi=xy$ along $y=x^2$ from $(0,0)$ to $(1,1)$, $\\mathbf r(t)=(t,t^2)$: $\\nabla\\phi\\cdot\\mathbf r'=t^2\\cdot 1+t\\cdot 2t$, and the integral $=1$.",
      "Switch to the straight line $\\mathbf r(t)=(t,t)$: integrating $t+t$ also gives $1$, exactly $=\\phi(1,1)-\\phi(0,0)$ — path independent.",
      "So this problem calls for the gradient theorem."
    ],
    "trap": "Seeing a line integral and parametrizing by brute force: it works, but it's wasted effort; and for a closed curve $C$ you'd miss the instant conclusion that the answer must be $0$.",
    "check": "On a closed curve the start equals the end, so the line integral of a gradient field is always $0$."
  },
  "ode-lin-003": {
    "spot": "$y'+2y=4$: first-order linear, constant coefficients, constant right side — solution $=$ equilibrium solution (a constant) $+$ homogeneous solution $Ce^{-2x}$.",
    "why": "With a constant right side, the equilibrium $y=2$ is visible at a glance, faster than computing an integrating factor.",
    "steps": [
      "Equilibrium: set $y'=0$, $2y=4$, $y=2$.",
      "The homogeneous $y'+2y=0$ has solution $Ce^{-2x}$, so the general solution is $y=2+Ce^{-2x}$.",
      "$y(0)=2+C=0$, $C=-2$.",
      "$y=2-2e^{-2x}$; substitute back into the equation."
    ],
    "trap": "Applying the initial value to the homogeneous solution alone ($Ce^{0}=0$ gives $C=0$) and then adding the equilibrium, answering $y=2$: the initial value must be applied to the full general solution.",
    "check": "As $x\\to\\infty$, $y\\to 2$, which is exactly the equilibrium solution."
  },
  "ode-p2-002": {
    "spot": "$y''-y=e^{2x}$: constant coefficients, exponential right side $e^{2x}$, and $2$ is not a characteristic root $\\pm 1$ — guess $Ae^{2x}$. Finally apply the initial values to the full general solution.",
    "why": "Undetermined coefficients fixes $A$ in one line; variation of parameters is wasted effort here.",
    "steps": [
      "Characteristic equation $r^2-1=0$, $r=\\pm1$, homogeneous solution $c_1e^x+c_2e^{-x}$.",
      "Guess $y_p=Ae^{2x}$: $4A-A=1$, $A=\\frac{1}{3}$.",
      "General solution $y=c_1e^x+c_2e^{-x}+\\frac{1}{3}e^{2x}$. $y(0)=\\frac{1}{3}$ gives $c_1+c_2=0$; $y'(0)=\\frac{2}{3}$ gives $c_1-c_2+\\frac{2}{3}=\\frac{2}{3}$, so $c_1=c_2=0$.",
      "$y=\\frac{1}{3}e^{2x}$; substitute back into the equation and both initial values."
    ],
    "trap": "Assuming the $c_1e^x+c_2e^{-x}$ terms must be there and forcing nonzero constants. When the initial values happen to match the particular solution, the homogeneous part is $0$.",
    "check": "Check at $x=1$: $y=\\frac{e^2}{3}\\approx 2.46$, and $y''-y=\\frac{4e^2}{3}-\\frac{e^2}{3}=e^2$."
  },
  "si-int-001": {
    "spot": "The inside of $\\ln$ must be strictly greater than $0$: the domain comes from solving $x-1>0$.",
    "why": "The domain of a logarithm has only one condition, so solve one inequality.",
    "steps": [
      "$\\ln u$ is defined only for $u>0$; here $u=x-1$.",
      "$x-1>0\\iff x>1$. At $x=1$ it is $\\ln 0$, undefined, so $1$ is excluded.",
      "The domain is $(1,\\infty)$."
    ],
    "trap": "Writing $[1,\\infty)$: $\\ln 0$ is undefined, so the left end must be open.",
    "check": "As $x\\to 1^+$, $\\ln(x-1)\\to-\\infty$; the graph has a vertical asymptote at $x=1$."
  },
  "si-set-015": {
    "spot": "Critical points $=$ points in the domain where $f'=0$ or $f'$ doesn't exist. The $\\ln x$ restricts the domain to $x>0$.",
    "why": "Writing the domain first, then solving $f'=0$, keeps you from listing points with $x\\le 0$.",
    "steps": [
      "Domain $x>0$; $f'(x)=\\frac{1}{x}-1$.",
      "$\\frac{1}{x}-1=0\\iff x=1$.",
      "$f'$ is undefined at $x=0$, but $0$ is not in the domain, so it isn't a critical point. The only critical point is $\\{1\\}$."
    ],
    "trap": "Counting $x=0$ (where $f'$ doesn't exist) as a critical point: critical points must lie in the domain.",
    "check": "$f'(0.5)=1>0$, $f'(2)=-\\frac{1}{2}<0$: it switches from rising to falling at $x=1$, a maximum of $-1$."
  },
  "si-set-020": {
    "spot": "A rational function can only be discontinuous where the denominator is zero: solve $x^2-4=0$.",
    "why": "A rational function is continuous everywhere on its domain, so just find the zeros of the denominator, then check whether the numerator is also zero (removable or infinite).",
    "steps": [
      "$x^2-4=(x-2)(x+2)=0$, $x=\\pm 2$.",
      "At both points the numerator is $4-9=-5\\ne 0$, so these are infinite discontinuities (vertical asymptotes).",
      "So the discontinuities are $\\{-2,2\\}$."
    ],
    "trap": "Taking the numerator's zeros $x=\\pm 3$ as discontinuities: there the function value is $0$, perfectly fine and continuous.",
    "check": "At $x=3$ the value is $0$, normal; near $x=2$ it shoots to infinity."
  },
  "si-set-021": {
    "spot": "The discontinuities of a rational function are the zeros of the denominator; factor $x^2-x-6$ first.",
    "why": "Factoring is faster than the quadratic formula, and it also shows whether the numerator cancels with the denominator.",
    "steps": [
      "$x^2-x-6=(x-3)(x+2)$.",
      "Zeros $x=3$, $x=-2$; the numerator $x$ is $3$ and $-2$ there, both nonzero, so nothing cancels.",
      "The discontinuities are $\\{-2,3\\}$."
    ],
    "trap": "Factoring as $(x+3)(x-2)$ and answering $\\{-3,2\\}$. Expand back to check: $(x+3)(x-2)=x^2+x-6$, the middle term's sign is wrong.",
    "check": "Plug in $x=0$: $\\frac{0}{-6}=0$; where the numerator is zero everything is perfectly normal."
  },
  "tb-area-003": {
    "spot": "$\\sqrt{x}$ and $x$ meet at $x=0$ and $x=1$, with $\\sqrt{x}$ on top in between: area $=\\int_0^1(\\text{top}-\\text{bottom})dx$.",
    "why": "One integral in $x$ is enough, since both curves are functions of $x$.",
    "steps": [
      "Intersections: $\\sqrt{x}=x\\Rightarrow x=0$ or $1$.",
      "Test $x=\\frac{1}{4}$ in between: $\\sqrt{x}=\\frac{1}{2}>\\frac{1}{4}$, so $\\sqrt{x}$ is on top.",
      "$\\int_0^1(\\sqrt{x}-x)dx=\\frac{2}{3}-\\frac{1}{2}$.",
      "Area $=\\frac{1}{6}$."
    ],
    "trap": "Swapping top and bottom and getting $-\\frac{1}{6}$: area can't be negative, so first decide which curve is on top.",
    "check": "Integrating in $y$ gives the same: $\\int_0^1(y-y^2)dy=\\frac{1}{6}$."
  },
  "tb-lh-001": {
    "spot": "As $x\\to 0$, $e^{2x}-1\\to 0$ and $\\sin 3x\\to 0$: both are small quantities, with $e^u-1\\sim u$ and $\\sin u\\sim u$.",
    "why": "Equivalent infinitesimals read off $\\frac{2x}{3x}$ directly; L'Hôpital's Rule is also one step, but you have to remember the Chain Rule factors.",
    "steps": [
      "Plugging in $0$ gives $\\frac{0}{0}$.",
      "$e^{2x}-1\\sim 2x$, $\\sin 3x\\sim 3x$.",
      "Limit $=\\frac{2x}{3x}=\\frac{2}{3}$."
    ],
    "trap": "Forgetting the Chain Rule factors $2$ and $3$ in L'Hôpital's Rule and getting $\\frac{e^{0}}{\\cos 0}=1$.",
    "check": "L'Hôpital check: $\\frac{2e^{2x}}{3\\cos 3x}$ at $0$ is $\\frac{2}{3}$."
  },
  "tb-lh-003": {
    "spot": "$\\frac{x^5-1}{x^3-1}$ is $\\frac{0}{0}$ at $x=1$; the shape is $\\frac{x^n-1}{x^m-1}$, and the answer is $\\frac{n}{m}$.",
    "why": "One round of L'Hôpital's Rule does it (top and bottom are each a monomial minus $1$); factoring means writing out $x^4+x^3+\\cdots$, which is longer.",
    "steps": [
      "Plugging in $x=1$ gives $\\frac{0}{0}$.",
      "L'Hôpital: $\\frac{5x^4}{3x^2}$.",
      "Plug in $x=1$: $\\frac{5}{3}$.",
      "Limit $=\\frac{5}{3}$."
    ],
    "trap": "Thinking $\\frac{x^5}{x^3}=x^2$ and plugging in $1$ to get $1$: you can't drop the $-1$ and then cancel.",
    "check": "Factoring: $\\frac{x^4+x^3+x^2+x+1}{x^2+x+1}$ at $x=1$ is $\\frac{5}{3}$."
  },
  "tb-tan-004": {
    "spot": "Slope of the tangent $=$ value of the derivative; $(\\tan x)'=\\sec^2 x$, and $\\frac{\\pi}{4}$ is a special angle.",
    "why": "Remember $\\sec^2$ and plug in; the Quotient Rule on $\\frac{\\sin}{\\cos}$ also derives the same formula.",
    "steps": [
      "$\\frac{d}{dx}\\tan x=\\sec^2x=\\frac{1}{\\cos^2x}$.",
      "$\\cos\\frac{\\pi}{4}=\\frac{\\sqrt{2}}{2}$, squared $\\frac{1}{2}$.",
      "$\\sec^2\\frac{\\pi}{4}=2$."
    ],
    "trap": "Treating $\\sec^2$ as $\\sec$ and answering $\\sqrt{2}$.",
    "check": "Another form: $\\sec^2x=1+\\tan^2x=1+1=2$."
  },
  "vc-nab-002": {
    "spot": "$\\nabla^2$ is the sum of the three second partials; in $x^2+y^2+z^2$ the variables are separate, so each term is seen only by its own variable's second partial.",
    "why": "No need for spherical coordinates; each of the three terms gives $2$, just add.",
    "steps": [
      "$\\frac{\\partial^2}{\\partial x^2}(x^2+y^2+z^2)=2$.",
      "Likewise the $y$ and $z$ directions each give $2$.",
      "$\\nabla^2=2+2+2=6$."
    ],
    "trap": "Treating $\\nabla^2$ as the gradient $\\nabla$ and writing the vector $(2x,2y,2z)$: the Laplacian is a scalar, the divergence of the gradient.",
    "check": "Pattern: the Laplacian of $r^2$ in $n$ dimensions is $2n$; in three dimensions it's $6$."
  },
  "burst-int-007": {
    "spot": "$\\int_0^1x^a(1-x)^b\\,dx$: interval $[0,1]$, a power of $x$ and a power of $1-x$ — the Beta function $B(a+1,b+1)=\\frac{a!\\,b!}{(a+b+1)!}$.",
    "why": "Expanding $(1-x)^4$ means integrating five fractional terms and finding a common denominator; the Beta formula takes one line.",
    "steps": [
      "$a=3$, $b=4$, so the integral $=B(4,5)$.",
      "$B(p,q)=\\frac{(p-1)!(q-1)!}{(p+q-1)!}=\\frac{3!\\,4!}{8!}$.",
      "$\\frac{144}{40320}=\\frac{1}{280}$.",
      "So the integral $=\\frac{1}{280}$."
    ],
    "trap": "Off by one in the Beta parameters: using $B(3,4)$ as $\\frac{3!\\,4!}{7!}$ gives $\\frac{144}{5040}=\\frac{1}{35}$. Exponents $3,4$ correspond to $B(4,5)$.",
    "check": "Symmetry: $\\int_0^1x^4(1-x)^3dx$ should also be $\\frac{1}{280}$ (substitute $x\\to 1-x$)."
  },
  "cx-hl-005": {
    "spot": "Expand $e\\cdot n!$ using $e=\\sum\\frac{1}{k!}$: the first $n+1$ terms times $n!$ are all integers, and the leftover tail $r_n=\\frac{1}{n+1}+\\frac{1}{(n+1)(n+2)}+\\cdots$ is small. $\\sin(2\\pi\\cdot\\text{integer}+2\\pi r_n)=\\sin(2\\pi r_n)$.",
    "why": "Computing $e\\cdot n!$ directly is impossible; splitting it into integer $+$ small tail lets the period of $\\sin$ eat the integer part, leaving the standard $n\\sin(\\text{small quantity})$.",
    "steps": [
      "$e\\,n!=\\sum_{k=0}^{n}\\frac{n!}{k!}+r_n$, where the sum is an integer; for example $n=3$: $6e=16+r_3$, $r_3\\approx 0.3097$.",
      "Squeeze the tail: $\\frac{1}{n+1}<r_n<\\sum_{k\\ge 1}\\frac{1}{(n+1)^k}=\\frac{1}{n}$.",
      "$\\sin(2\\pi e\\,n!)=\\sin(2\\pi r_n)$, and $2\\pi r_n$ lies in $(0,\\frac{\\pi}{2})$ where $\\sin$ is increasing, so $n\\sin\\frac{2\\pi}{n+1}<n\\sin(2\\pi r_n)<n\\sin\\frac{2\\pi}{n}$ ($n\\ge 5$).",
      "Both sides tend to $2\\pi$, so by the Squeeze Theorem the limit is $2\\pi$."
    ],
    "trap": "Thinking that since $\\sin$ is bounded, $n\\sin(\\cdots)$ diverges or oscillates: the distance from $e\\cdot n!$ to an integer shrinks at exactly the rate $\\frac{1}{n}$, so multiplying by $n$ converges.",
    "check": "$n=3$: $3\\sin(2\\pi\\cdot 6e)\\approx 2.79$, already in the range between $3\\sin\\frac{\\pi}{2}=3$ and $3\\sin\\frac{2\\pi}{3}\\approx 2.6$."
  },
  "dd-mar-003": {
    "spot": "Profit $=$ revenue $-$ cost, and $P(q)=80q-0.5q^2-500$ is a downward-opening parabola: the maximum is where marginal profit $P'=0$.",
    "why": "The vertex formula or $P'=0$ each takes one line; marginal revenue $=$ marginal cost is the same thing.",
    "steps": [
      "$P(q)=(100q-0.5q^2)-(20q+500)=80q-0.5q^2-500$.",
      "$P'(q)=80-q=0$, $q=80$. (Equivalently $R'=100-q$ equals $C'=20$.)",
      "$P''=-1<0$: profit rises for $q<80$ and falls for $q>80$, so it is a maximum.",
      "$P(80)=6400-3200-500=2700$."
    ],
    "trap": "Forgetting to subtract the fixed cost $500$ and answering $3200$; or maximizing revenue $R$ alone ($q=100$, $R=5000$).",
    "check": "The profit at $q=79$ and $q=81$ is $2699.5$ for both, symmetrically below $2700$."
  },
  "dd-pw-002": {
    "spot": "$\\sqrt[3]{x-1}=(x-1)^{1/3}$: power rule plus Chain Rule; at $x=9$, $x-1=8$ is a perfect cube, so the numbers come out clean.",
    "why": "Rewritten with a fractional exponent, it's the ordinary power rule; $x=9$ is far from $x=1$ (where the tangent is vertical), so differentiability is no concern.",
    "steps": [
      "$f'(x)=\\frac{1}{3}(x-1)^{-2/3}$.",
      "$8^{2/3}=(\\sqrt[3]{8})^2=4$, so $8^{-2/3}=\\frac{1}{4}$.",
      "$f'(9)=\\frac{1}{3}\\cdot\\frac{1}{4}=\\frac{1}{12}$."
    ],
    "trap": "Computing $8^{-2/3}$ as $-\\frac{16}{3}$ or $\\frac{1}{8^2}$: a negative exponent means reciprocal, and $\\frac{2}{3}$ means cube root first, then square.",
    "check": "Linear approximation: $\\sqrt[3]{9.12-1}\\approx 2+0.12\\cdot\\frac{1}{12}=2.01$; the actual $\\sqrt[3]{8.12}\\approx 2.00997$."
  },
  "gap-der-app-006": {
    "spot": "Newton's method: $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$, needing just two numbers, $f(1)$ and $f'(1)$.",
    "why": "Plug straight into the formula; the root of $x^2-2$ is $\\sqrt{2}$, so the answer should move toward $1.414$.",
    "steps": [
      "$f(1)=1-2=-1$.",
      "$f'(x)=2x$, $f'(1)=2$.",
      "$x_1=1-\\frac{-1}{2}=\\frac{3}{2}$."
    ],
    "trap": "Messing up the minus sign against the negative value and getting $1-\\frac{1}{2}=\\frac{1}{2}$, which is even farther from the root.",
    "check": "$\\frac{3}{2}$ is closer than $1$ to $\\sqrt{2}\\approx 1.414$; one more step gives $\\frac{17}{12}\\approx 1.4167$."
  },
  "gap-der-param-001": {
    "spot": "$x,y$ are both given in terms of $t$: the slope of a parametric curve is $\\frac{dy/dt}{dx/dt}$, with the answer written in terms of $t$.",
    "why": "No need to eliminate $t$ first ($y=x^{3/2}$ only holds for $t\\ge 0$, and you'd have to handle signs); dividing the two derivatives is most direct.",
    "steps": [
      "$\\frac{dy}{dt}=3t^2$, $\\frac{dx}{dt}=2t$.",
      "$\\frac{dy}{dx}=\\frac{3t^2}{2t}$.",
      "Cancel $t$: $\\frac{3t}{2}$."
    ],
    "trap": "Dividing the wrong way and answering $\\frac{2}{3t}$: $\\frac{dy}{dx}$ is the change in $y$ divided by the change in $x$.",
    "check": "For $t>0$, $y=x^{3/2}$, so $\\frac{dy}{dx}=\\frac{3}{2}\\sqrt{x}=\\frac{3}{2}t$. At $x=4$ ($t=2$) both give $3$."
  },
  "lb-sim-001": {
    "spot": "On $[0,1]$, $\\lfloor 2x\\rfloor$ takes only $0$ ($x<\\frac{1}{2}$) and $1$ ($\\frac{1}{2}\\le x<1$): $\\varphi$ has just two values, a simple function, so the integral $=\\sum c_i\\,m(E_i)$.",
    "why": "The integral of a simple function is just value × length of each piece, added up; the single point $x=1$ has measure $0$ and doesn't matter.",
    "steps": [
      "On $[0,\\frac{1}{2})$, $\\lfloor 2x\\rfloor=0$, so $\\varphi=1$.",
      "On $[\\frac{1}{2},1)$, $\\lfloor 2x\\rfloor=1$, so $\\varphi=3$; at the single point $x=1$, $\\varphi=5$, but a single point has measure $0$.",
      "Both pieces have measure $\\frac{1}{2}$.",
      "$\\int\\varphi\\,d\\mu=1\\cdot\\frac{1}{2}+3\\cdot\\frac{1}{2}=2$."
    ],
    "trap": "Adding the value $5$ at $x=1$ as another piece: a single point has measure $0$ and contributes $0$.",
    "check": "The average of $\\varphi$ is $\\frac{1+3}{2}=2$ over an interval of length $1$, so the integral is exactly $2$."
  },
  "lim-027": {
    "spot": "Two variables, numerator and denominator both homogeneous of degree two: substituting along lines $y=mx$ cancels $x$ completely, leaving a number that depends only on the slope $m$ — different slopes give different values, so the limit doesn't exist.",
    "why": "To show nonexistence you need only two paths with different values; the family of lines does it in one substitution, even faster than polar coordinates.",
    "steps": [
      "Along $y=x$: $\\frac{x\\cdot x}{x^2+x^2}=\\frac{1}{2}$.",
      "Along $y=-x$: $\\frac{x(-x)}{x^2+x^2}=-\\frac{1}{2}$.",
      "In general along $y=mx$: the value is $\\frac{m}{1+m^2}$, which changes with $m$ ($m=0$ gives $0$).",
      "Different paths to the origin give different values, so the limit does not exist."
    ],
    "trap": "Trying only the $x$-axis and $y$-axis (both give $0$) and answering $0$: two coordinate axes agreeing doesn't mean the limit exists.",
    "check": "Polar coordinates: $\\frac{xy}{x^2+y^2}=\\cos\\theta\\sin\\theta=\\frac{1}{2}\\sin 2\\theta$, independent of $r$ and dependent only on direction — it takes every value from $-\\frac{1}{2}$ to $\\frac{1}{2}$."
  },
  "lim-030": {
    "spot": "$1-\\cos(\\text{small quantity})$ divided by $x^2$: the standard form $1-\\cos u\\sim\\frac{u^2}{2}$, here with $u=3x$.",
    "why": "Equivalent infinitesimals take one line; L'Hôpital's Rule needs two rounds.",
    "steps": [
      "Plug in $0$: $\\frac{0}{0}$.",
      "$1-\\cos u\\sim\\frac{u^2}{2}$.",
      "$u=3x$: $1-\\cos 3x\\sim\\frac{9x^2}{2}$.",
      "Divide by $x^2$ to get $\\frac{9}{2}$."
    ],
    "trap": "Forgetting to square, writing $\\frac{3x}{2}$ or multiplying the coefficient by just $3$, and answering $\\frac{3}{2}$.",
    "check": "Plug in $x=0.01$: the ratio is about $4.4997$."
  },
  "lm-os-005": {
    "spot": "$|x|$ is defined differently on the two sides of $0$: $|x|=x$ for $x>0$ and $|x|=-x$ for $x<0$. With absolute values, split into left and right limits.",
    "why": "Each side is a constant, so the left and right values are obviously different.",
    "steps": [
      "Right side, $x>0$: $\\frac{|x|}{x}=\\frac{x}{x}=1$.",
      "Left side, $x<0$: $\\frac{|x|}{x}=\\frac{-x}{x}=-1$.",
      "The one-sided limits differ, $-1\\ne 1$, so the limit does not exist."
    ],
    "trap": "Thinking top and bottom are both $0$ and using L'Hôpital's Rule or canceling to $1$: $|x|$ is not differentiable at $0$, and canceling only works for $x>0$.",
    "check": "This is the sign function $\\operatorname{sgn}(x)$, whose graph has a jump of height $2$ at $0$."
  },
  "mob-tech-009": {
    "spot": "Two variables, numerator and denominator of the same degree (both two): substituting $y=mx$ leaves a number depending only on $m$. That's the standard signal for a path test.",
    "why": "To prove a limit doesn't exist, finding two paths with different values is fastest; the Squeeze Theorem can only prove existence.",
    "steps": [
      "Along $y=0$: $\\frac{0}{x^2}=0$.",
      "Along $y=x$: $\\frac{x^2}{2x^2}=\\frac{1}{2}$.",
      "The two paths give different values, so the limit doesn't exist — the tool is the path test."
    ],
    "trap": "Using the Squeeze Theorem here: $\\left|\\frac{xy}{x^2+y^2}\\right|\\le\\frac{1}{2}$ only shows it's bounded and can't squeeze it to $0$.",
    "check": "Compare $\\frac{x^2y}{x^2+y^2}$: the numerator is one degree higher, so squeezing works and the limit is $0$. Same degree, use paths; higher-degree numerator, squeeze."
  },
  "mob-tech-018": {
    "spot": "$x^2y''+xy'+(x^2-\\nu^2)y=0$: coefficients $x^2,x$ plus $x^2$ minus the square of a constant — this is the standard form of Bessel's equation, with parameter $\\nu$.",
    "why": "Recognizing the name tells you the solutions are $J_\\nu$, $Y_\\nu$, with no need to build a Frobenius series from scratch.",
    "steps": [
      "Compare: $x^2$ in front of $y''$, $x$ in front of $y'$, $x^2-\\nu^2$ in front of $y$ — an exact match with Bessel's equation. Note the extra $x^2$ in the coefficient of $y$: $y=x^2$ solves the Euler equation $x^2y''+xy'-4y=0$, but plugged into Bessel's equation with $\\nu=2$ it leaves an extra $x^4$.",
      "Check an example: for $\\nu=\\frac{1}{2}$, $y=\\frac{\\sin x}{\\sqrt{x}}$ (a multiple of $J_{1/2}$) satisfies it.",
      "$\\frac{\\cos x}{\\sqrt{x}}$ is also a solution, and the two form the general solution.",
      "So this is Bessel's equation, and its solutions are Bessel functions."
    ],
    "trap": "Confusing it with the Cauchy–Euler equation $x^2y''+axy'+by=0$: Euler's coefficient of $y$ is a constant, while here there's an extra $x^2$, so guessing $x^r$ fails.",
    "check": "For large $x$ the equation is approximately $y''+y=0$, so Bessel functions look like decaying $\\sin$ and $\\cos$ — consistent with $\\frac{\\sin x}{\\sqrt x}$."
  },
  "ode-lin-001": {
    "spot": "$y'+y=x$: first-order linear with right side $x$ — integrating factor $e^{\\int 1\\,dx}=e^x$.",
    "why": "The integrating factor turns the left side into $(e^xy)'$; you could also guess a particular solution $ax+b$. Both are quick; the integrating factor is more general.",
    "steps": [
      "Multiply by $e^x$: $(e^xy)'=xe^x$.",
      "Integrate: $e^xy=(x-1)e^x+C$, so $y=x-1+Ce^{-x}$.",
      "$y(0)=-1+C=1$, $C=2$.",
      "$y=x-1+2e^{-x}$; substitute back into the equation."
    ],
    "trap": "Dropping the extra term from integration by parts in $\\int xe^xdx$, writing $xe^x$, and getting $y=x+Ce^{-x}$.",
    "check": "For large $x$, $y\\approx x-1$, which is exactly the particular solution (the $e^{-x}$ dies out)."
  },
  "sg-est-001": {
    "spot": "Given $S_1$ through $S_4$ and asked for $S_6$: just add two more terms, $+\\frac{1}{5}-\\frac{1}{6}$.",
    "why": "Continuing from $S_4$ is least work, no re-adding; but use exact fractions, not approximate values read off the graph.",
    "steps": [
      "$S_4=1-\\frac{1}{2}+\\frac{1}{3}-\\frac{1}{4}=\\frac{7}{12}$.",
      "$S_6=S_4+\\frac{1}{5}-\\frac{1}{6}=\\frac{7}{12}+\\frac{1}{30}$.",
      "Common denominator: $\\frac{35}{60}+\\frac{2}{60}=\\frac{37}{60}$."
    ],
    "trap": "Flipping the signs of the fifth and sixth terms ($-\\frac{1}{5}+\\frac{1}{6}$) and getting $\\frac{7}{12}-\\frac{1}{30}=\\frac{11}{20}$. Odd-numbered terms are added, even-numbered terms subtracted.",
    "check": "For this alternating series the even partial sums approach $\\ln 2\\approx 0.693$ from below: $S_4<S_6<\\ln 2$."
  },
  "si-int-019": {
    "spot": "The quotient $\\frac{x}{x^2+1}$: the denominator is always positive, so the sign of $f'$ depends only on the numerator $1-x^2$.",
    "why": "After the Quotient Rule, the denominator $(x^2+1)^2>0$ can be dropped, leaving one quadratic inequality.",
    "steps": [
      "$f'(x)=\\frac{(x^2+1)-x\\cdot 2x}{(x^2+1)^2}=\\frac{1-x^2}{(x^2+1)^2}$.",
      "The denominator is always positive, so $f'>0\\iff 1-x^2>0\\iff -1<x<1$.",
      "So the increasing interval is $(-1,1)$."
    ],
    "trap": "Reversing the order in the Quotient Rule numerator ($2x\\cdot x-(x^2+1)$), getting $x^2-1$, and answering $(-\\infty,-1)\\cup(1,\\infty)$.",
    "check": "$f(-1)=-\\frac{1}{2}$, $f(1)=\\frac{1}{2}$: it climbs from the minimum to the maximum, increasing in between."
  },
  "si-set-022": {
    "spot": "$\\tan x=\\frac{\\sin x}{\\cos x}$: the discontinuities are where $\\cos x=0$; then see which of them lie in $(-\\pi,\\pi)$.",
    "why": "The solutions of $\\cos x=0$ are $\\frac{\\pi}{2}+k\\pi$; just count the ones in the given interval.",
    "steps": [
      "$\\cos x=0\\iff x=\\frac{\\pi}{2}+k\\pi$.",
      "Only $k=0,-1$ land in $(-\\pi,\\pi)$: $\\pm\\frac{\\pi}{2}$; $\\frac{3\\pi}{2}>\\pi$ is already outside.",
      "At these two points $\\tan x$ shoots to infinity — infinite discontinuities. The discontinuities are $\\{-\\frac{\\pi}{2},\\frac{\\pi}{2}\\}$."
    ],
    "trap": "Including $x=0$ or $\\pm\\pi$: those are where $\\sin x=0$, where $\\tan$ is $0$ and continuous; and $\\pm\\pi$ aren't in the open interval anyway.",
    "check": "$\\tan 0=0$, $\\tan\\frac{\\pi}{4}=1$; everything in between is normal."
  },
  "tb-area-005": {
    "spot": "Three boundaries $y=e^x$, $y=1$, $x=1$: $e^x=1$ at $x=0$, so the region spans $0\\le x\\le 1$, with $e^x$ on top and $1$ on the bottom.",
    "why": "First find the missing boundary $x=0$, then integrate top minus bottom.",
    "steps": [
      "$e^x=1\\Rightarrow x=0$: the left boundary.",
      "For $0<x\\le 1$, $e^x>1$, so $e^x$ is on top.",
      "$\\int_0^1(e^x-1)dx=[e^x-x]_0^1=(e-1)-1$.",
      "Area $=e-2\\approx 0.718$."
    ],
    "trap": "Forgetting that $e^0=1$ must be subtracted at the lower limit and answering $e-1$ (that's $\\int_0^1e^xdx$, without removing the region below $y=1$).",
    "check": "The area is between $0$ and $e-1\\approx 1.718$ (the bounding rectangle), and since the curve is concave up it should be less than half: $0.718<0.859$."
  },
  "tb-imp-002": {
    "spot": "$xy+y^2=6$: $y$ can't easily be written as a function of $x$ (it takes solving a quadratic), so use implicit differentiation — and remember $xy$ needs the Product Rule.",
    "why": "Implicit differentiation gives $y'$ in one line; solving for $y=\\frac{-x+\\sqrt{x^2+24}}{2}$ and then differentiating is messier.",
    "steps": [
      "First confirm the point is on the curve: $1\\cdot 2+2^2=6$.",
      "Differentiate both sides in $x$: $y+xy'+2yy'=0$.",
      "Rearrange: $y'(x+2y)=-y$, $y'=-\\frac{y}{x+2y}$. At $(1,2)$: $-\\frac{2}{1+4}=-\\frac{2}{5}$.",
      "Check with the explicit solution: $y=\\frac{-x+\\sqrt{x^2+24}}{2}$ passes through $(1,2)$, and its derivative at $x=1$ is exactly $-\\frac{2}{5}$."
    ],
    "trap": "Differentiating $xy$ as just $xy'$ and missing the $y$: you get $y'(x+2y)=0$ and think the slope is $0$.",
    "check": "Take a small step along the tangent: at $x=1.01$ the curve has $y\\approx 2-0.004=1.996$."
  },
  "tb-lh-002": {
    "spot": "$\\arctan 2x$ and $\\sin 5x$ are both small near $0$: $\\arctan u\\sim u$, $\\sin u\\sim u$, so read off the coefficients.",
    "why": "Equivalent infinitesimals give $\\frac{2x}{5x}$ in one line; L'Hôpital's Rule is also one step, but you need the derivative of $\\arctan$ right.",
    "steps": [
      "Plug in $0$: $\\frac{0}{0}$.",
      "$\\arctan 2x\\sim 2x$, $\\sin 5x\\sim 5x$.",
      "Limit $=\\frac{2}{5}$."
    ],
    "trap": "In L'Hôpital's Rule, writing $(\\arctan 2x)'$ as $\\frac{1}{1+4x^2}$ and missing the Chain Rule factor $2$, which gives $\\frac{1}{5}$.",
    "check": "L'Hôpital: $\\frac{2/(1+4x^2)}{5\\cos 5x}$ at $0$ is $\\frac{2}{5}$."
  },
  "tr-val-003": {
    "spot": "The Taylor polynomial of $\\cos x$ has only even powers: $T_4=1-\\frac{x^2}{2}+\\frac{x^4}{24}$; then plug in $\\frac{1}{2}$ and compute the fraction.",
    "why": "If you know the expansion by heart, no need to differentiate order by order; the common denominator is $384=24\\cdot 16$.",
    "steps": [
      "The derivatives at $0$ are $1,0,-1,0,1$ in order.",
      "$T_4(x)=1-\\frac{x^2}{2!}+\\frac{x^4}{4!}=1-\\frac{x^2}{2}+\\frac{x^4}{24}$.",
      "Plug in $\\frac{1}{2}$: $1-\\frac{1}{8}+\\frac{1}{384}=\\frac{384-48+1}{384}=\\frac{337}{384}$."
    ],
    "trap": "Writing the $x^4$ coefficient as $\\frac{1}{4}$ instead of $\\frac{1}{4!}=\\frac{1}{24}$.",
    "check": "$\\cos 0.5\\approx 0.87758$ and $\\frac{337}{384}\\approx 0.87760$, differing by less than $3\\times 10^{-5}$ (the size of the next term $\\frac{x^6}{720}$)."
  },
  "tr-val-005": {
    "spot": "$\\sqrt{1+x}=(1+x)^{1/2}$: binomial expansion $1+\\frac{x}{2}-\\frac{x^2}{8}+\\cdots$, then plug in $0.2$.",
    "why": "Write it directly with the binomial coefficient $\\binom{1/2}{2}=-\\frac{1}{8}$, no second derivative needed.",
    "steps": [
      "$f(0)=1$, $f'(0)=\\frac{1}{2}$, $f''(0)=-\\frac{1}{4}$.",
      "$T_2(x)=1+\\frac{x}{2}-\\frac{1}{4}\\cdot\\frac{x^2}{2}=1+\\frac{x}{2}-\\frac{x^2}{8}$.",
      "Plug in $0.2$: $1+0.1-0.005=1.095=\\frac{219}{200}$."
    ],
    "trap": "Forgetting to divide the quadratic term by $2!$, writing $-\\frac{x^2}{4}$, and getting $1.09$.",
    "check": "$\\sqrt{1.2}\\approx 1.09545$, slightly more than $1.095$ (the next term $+\\frac{x^3}{16}$ is positive)."
  },
  "world-007": {
    "spot": "$\\sinh x$ minus $x$ (its first term), divided by $x^3$: however many terms you subtract, expand to the next one; $\\sinh x=x+\\frac{x^3}{6}+\\cdots$.",
    "why": "L'Hôpital's Rule would take three rounds; the expansion shows the $x^3$ coefficient in one line.",
    "steps": [
      "Plug in $0$: $\\frac{0}{0}$.",
      "$\\sinh x=\\frac{e^x-e^{-x}}{2}=x+\\frac{x^3}{6}+\\frac{x^5}{120}+\\cdots$ (all plus signs).",
      "Numerator $=\\frac{x^3}{6}+\\cdots$; dividing by $x^3$ gives $\\frac{1}{6}$."
    ],
    "trap": "Confusing it with $\\sin x$, expanding as $x-\\frac{x^3}{6}$, and answering $-\\frac{1}{6}$. The expansion of $\\sinh$ has no alternating minus signs.",
    "check": "$x=0.01$: the ratio is slightly above $\\frac{1}{6}$."
  },
  "an-ed-002": {
    "spot": "$\\sqrt{x}$ is increasing, so $|\\sqrt x-2|<0.01$ can be squared and solved for an interval of $x$; that interval is not symmetric about $4$, so $\\delta$ takes the closer side.",
    "why": "Solving exactly beats the estimate $|\\sqrt x-2|=\\frac{|x-4|}{\\sqrt x+2}$: an estimate only gives some workable $\\delta$, and the problem wants the largest.",
    "steps": [
      "$1.99<\\sqrt x<2.01\\iff 1.99^2<x<2.01^2$, i.e. $3.9601<x<4.0401$.",
      "Left distance $4-3.9601=0.0399$, right $4.0401-4=0.0401$.",
      "$\\delta$ must keep all of $(4-\\delta,4+\\delta)$ inside the interval, so take the smaller: $\\delta=0.0399$."
    ],
    "trap": "Taking the larger $0.0401$: at $x=3.96$, $|x-4|=0.04<0.0401$, but $\\sqrt{3.96}\\approx 1.98997$, already more than $0.01$ off.",
    "check": "The endpoint sits exactly on the boundary: $\\sqrt{4-0.0399}=1.99$."
  },
  "an-en-003": {
    "spot": "$\\frac{n}{2^n}$ is decreasing from $n=2$ on: just find the first $n$ below $10^{-3}$, and everything after works automatically. $2^{10}\\approx 1000$ gives a starting point; try a few upward.",
    "why": "Exponential versus polynomial like this has no closed-form solution; monotonicity plus a few trial values is fastest.",
    "steps": [
      "Decreasing: $\\frac{a_{n+1}}{a_n}=\\frac{n+1}{2n}<1$ ($n\\ge 2$).",
      "$n=13$: $\\frac{13}{8192}\\approx 1.59\\times 10^{-3}$, not small enough yet.",
      "$n=14$: $\\frac{14}{16384}\\approx 8.5\\times 10^{-4}<10^{-3}$, it passes, and since the sequence decreases it stays true from then on.",
      "So the smallest $N=14$."
    ],
    "trap": "Seeing $2^{10}=1024>1000$ and answering $10$: you forgot the $n$ in the numerator; $\\frac{10}{1024}\\approx 0.0098$, off by a factor of ten.",
    "check": "$n=12$: $\\frac{12}{4096}\\approx 0.0029$, indeed larger — nothing up to $13$ works."
  },
  "an-int-001": {
    "spot": "$f(x)=x$ is increasing: on each subinterval, upper minus lower sum is width × the increase on that piece, and these telescope to $\\frac{f(1)-f(0)}{n}=\\frac{1}{n}$.",
    "why": "For an increasing function, the gap between upper and lower sums has the closed form $\\frac{f(b)-f(a)}{n}(b-a)$, so there's no need to compute $U_n$ and $L_n$ separately.",
    "steps": [
      "$U_n=\\frac{1}{n}\\sum_{i=1}^n\\frac{i}{n}$, $L_n=\\frac{1}{n}\\sum_{i=0}^{n-1}\\frac{i}{n}$; subtracting leaves only $\\frac{1}{n}\\cdot\\frac{n}{n}-\\frac{1}{n}\\cdot\\frac{0}{n}=\\frac{1}{n}$.",
      "We need $\\frac{1}{n}<0.01\\iff n>100$. At $n=100$ it equals $0.01$ exactly, which is not less than.",
      "$n=101$: $\\frac{1}{101}<0.01$, it passes.",
      "The smallest $n=101$."
    ],
    "trap": "Answering $100$: the condition is strictly $<0.01$, and $n=100$ gives $=0.01$.",
    "check": "$U_n=\\frac{n+1}{2n}$ and $L_n=\\frac{n-1}{2n}$ squeeze the true value $\\frac{1}{2}=\\int_0^1x\\,dx$."
  },
  "an-sup-003": {
    "spot": "The set is the rationals whose square is less than $3$: that's $(-\\sqrt3,\\sqrt3)\\cap\\mathbb Q$. The supremum is taken in the reals: $\\sqrt{3}$, even though it isn't rational.",
    "why": "The rationals are dense in the reals, so rationals approach $\\sqrt3$ arbitrarily closely, making $\\sqrt3$ the least upper bound.",
    "steps": [
      "$\\sqrt3$ is an upper bound: if $x>\\sqrt3>0$ then $x^2>3$, so it is not in $S$.",
      "Nothing below $\\sqrt3$ is an upper bound: the rationals $1.7,\\ 1.73,\\ 1.732$ are all in $S$ and get closer and closer to $\\sqrt3$.",
      "Density: for any $c<\\sqrt3$, truncating the decimal expansion gives a rational between $c$ and $\\sqrt3$, which is in $S$ and larger than $c$.",
      "So $\\sup S=\\sqrt3$ (no supremum exists within $\\mathbb Q$; in $\\mathbb R$ it is $\\sqrt3$)."
    ],
    "trap": "Thinking that since $S$ contains only rationals the supremum must be rational too, and saying it doesn't exist or giving an approximation like $1.732$: in the reals the supremum exists, and it is $\\sqrt3$.",
    "check": "$1.7321^2>3$, so $1.7321$ is already an upper bound, not in $S$ — $\\sqrt3$ is squeezed between $1.732$ and $1.7321$."
  },
  "an-sup-004": {
    "spot": "$\\left(1+\\frac{1}{n}\\right)^n$ is an increasing sequence with limit $e$: the supremum of an increasing sequence is its limit, and it is never attained.",
    "why": "Increasing and bounded $\\Rightarrow$ converges to its $\\sup$, so all you need is that the limit is $e$.",
    "steps": [
      "First few terms: $2,\\ 2.25,\\ 2.370\\ldots$, increasing.",
      "Every term is less than $e$ ($n\\ln(1+\\frac{1}{n})<1$, since $\\ln(1+u)<u$).",
      "The limit is $e$.",
      "Increasing and approaching $e$, so $\\sup S=e$ (not attained)."
    ],
    "trap": "Treating the $\\sup$ as the largest element and looking for an $n$ that attains it: an increasing sequence has no largest term; the supremum is the limit.",
    "check": "At $n=10^4$, $\\approx 2.71815$, still below $e\\approx 2.71828$."
  },
  "an-sup-007": {
    "spot": "$\\frac{3n-1}{n+2}$ has numerator and denominator of the same degree: split it as $3-\\frac{7}{n+2}$ and you see at once that it increases and is capped by $3$.",
    "why": "Writing it as a constant minus a decreasing positive quantity reveals both monotonicity and the limit at once, faster than differentiating.",
    "steps": [
      "$\\frac{3n-1}{n+2}=3-\\frac{7}{n+2}$.",
      "$\\frac{7}{n+2}$ is decreasing and always positive, so every term is less than $3$, and the sequence increases.",
      "As $n\\to\\infty$ it $\\to 3$, so $3$ is the least upper bound (not attained)."
    ],
    "trap": "Mixing up $\\inf$ and $\\sup$ and answering $\\frac{2}{3}$ from $n=1$: that's the minimum (the infimum).",
    "check": "At $n=1000$, $\\approx 2.993$, very close to $3$ but not there yet."
  },
  "an-uc-006": {
    "spot": "$\\sqrt x$ is differentiable: the smallest Lipschitz constant $=\\sup|f'|$. $f'(x)=\\frac{1}{2\\sqrt x}$ is decreasing, so its maximum is at the left endpoint $x=1$.",
    "why": "The Mean Value Theorem turns $|f(a)-f(b)|$ into $|f'(c)||a-b|$, so $\\sup|f'|$ is both enough and impossible to beat.",
    "steps": [
      "$f'(x)=\\frac{1}{2\\sqrt x}$.",
      "It is decreasing on $[1,\\infty)$ with maximum $f'(1)=\\frac{1}{2}$; for example $f'(4)=\\frac{1}{4}$.",
      "Mean Value Theorem: $|\\sqrt a-\\sqrt b|=f'(c)|a-b|\\le\\frac{1}{2}|a-b|$, so $L=\\frac{1}{2}$ works.",
      "No smaller $L$ works: take $a,b$ both near $1$, and the secant slope approaches $\\frac{1}{2}$. So the smallest is $\\frac{1}{2}$."
    ],
    "trap": "Thinking the Lipschitz constant of $\\sqrt x$ should be the minimum of $f'$ or its limit $0$ at $\\infty$: the Lipschitz condition must hold for every pair of points, so you need the steepest spot.",
    "check": "$a=1,\\ b=1.01$: the secant slope is $\\approx 0.4988$, slightly below $\\frac{1}{2}$."
  },
  "cx-lh-012": {
    "spot": "$\\frac{1}{x}-\\frac{1}{e^x-1}$ is $\\infty-\\infty$: first combine into a single fraction, then use the expansion of $e^x$.",
    "why": "Without combining you can't do anything; after combining, the numerator $e^x-1-x$ is the exponential minus its first two terms, so expanding is fastest.",
    "steps": [
      "Combine: $\\frac{e^x-1-x}{x(e^x-1)}$.",
      "Numerator $e^x-1-x=\\frac{x^2}{2}+\\cdots$.",
      "Denominator $x(e^x-1)=x^2+\\cdots$.",
      "Ratio $\\to\\frac{1}{2}$."
    ],
    "trap": "Replacing $e^x-1$ with $x$ directly to get $\\frac{1}{x}-\\frac{1}{x}=0$: equivalent infinitesimals can't be substituted inside sums and differences; expand to the next term.",
    "check": "Plug in $x=0.01$: about $0.49917$, close to $\\frac{1}{2}$."
  },
  "db-ext-004": {
    "spot": "$\\sin x+\\cos x$: sine plus cosine of the same frequency combines into $\\sqrt2\\sin\\left(x+\\frac{\\pi}{4}\\right)$; the max on a closed interval comes from comparing critical points and endpoints.",
    "why": "The combined form shows the amplitude $\\sqrt2$ at a glance; but confirm that the point where $x+\\frac{\\pi}{4}=\\frac{\\pi}{2}$, namely $x=\\frac{\\pi}{4}$, lies in $[0,\\pi]$.",
    "steps": [
      "$f'=\\cos x-\\sin x=0\\iff\\tan x=1$, which in $[0,\\pi]$ is only $x=\\frac{\\pi}{4}$.",
      "$f\\left(\\frac{\\pi}{4}\\right)=\\frac{\\sqrt2}{2}+\\frac{\\sqrt2}{2}=\\sqrt2$.",
      "Endpoints: $f(0)=1$, $f(\\pi)=-1$, both less than $\\sqrt2$.",
      "Maximum $\\sqrt2$."
    ],
    "trap": "Thinking $\\sin$ and $\\cos$ each max out at $1$, so the sum maxes at $2$: they never both reach $1$ at the same $x$.",
    "check": "Combined angle: $\\sin x+\\cos x=\\sqrt2\\sin\\left(x+\\frac{\\pi}{4}\\right)$, amplitude $\\sqrt2$."
  }
};
