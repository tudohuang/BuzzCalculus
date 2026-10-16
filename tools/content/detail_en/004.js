// Detail v2, English — batch 004. Translation of tools/content/detail/004.js (text only; claims live in the Chinese file).
module.exports = {
  "burst-int-001": {
    "spot": "A polynomial $x^4$ times $e^{-3x}$, integrated from $0$ to $\\infty$ — that's the textbook Gamma-function shape: $\\int_0^\\infty x^n e^{-ax}\\,dx=\\frac{n!}{a^{n+1}}$.",
    "why": "Integration by parts would take four rounds, each time checking the boundary term is $0$; the Gamma formula finishes it in one line.",
    "steps": [
      "Let $u=3x$, so $dx=\\frac{du}{3}$ and $x^4=\\frac{u^4}{81}$: the integral $=\\frac{1}{3^5}\\int_0^\\infty u^4e^{-u}\\,du$.",
      "$\\int_0^\\infty u^4e^{-u}\\,du=\\Gamma(5)=4!=24$.",
      "So the integral $=\\frac{24}{243}=\\frac{8}{81}$."
    ],
    "trap": "Forgetting the $\\frac{1}{3}$ from $dx=\\frac{du}{3}$ and writing $\\frac{4!}{3^4}=\\frac{8}{27}$. The exponent is $n+1=5$, not $n$.",
    "check": "Numerical integration: $\\int_0^\\infty x^4e^{-3x}\\,dx\\approx 0.0988$, which is exactly $\\frac{8}{81}$."
  },
  "burst-int-008": {
    "spot": "Under the root is $x(1-x)$, which completes to $\\frac{1}{4}-\\left(x-\\frac{1}{2}\\right)^2$ — $y=\\sqrt{r^2-(x-c)^2}$ is an upper semicircle, so the integral is an area.",
    "why": "The substitution $x=\\sin^2\\theta$ works too, but once you recognize the semicircle you just use the area formula — no integration needed.",
    "steps": [
      "Complete the square: $x(1-x)=\\frac{1}{4}-\\left(x-\\frac{1}{2}\\right)^2$.",
      "So $y=\\sqrt{x(1-x)}$ is the upper semicircle with center $\\left(\\frac{1}{2},0\\right)$ and radius $\\frac{1}{2}$; its highest point is at $x=\\frac{1}{2}$, with height equal to the radius.",
      "$x$ from $0$ to $1$ covers the whole semicircle, so the area $=\\frac{1}{2}\\pi\\left(\\frac{1}{2}\\right)^2=\\frac{\\pi}{8}$."
    ],
    "trap": "Taking the radius to be $1$ (thinking it's the unit circle) and getting $\\frac{\\pi}{2}$. The radius is half the interval length $1$.",
    "check": "The semicircle fits inside a $1\\times\\frac{1}{2}$ rectangle and is bigger than the triangle with base $1$ and height $\\frac{1}{2}$: $\\frac{1}{4}<\\frac{\\pi}{8}\\approx 0.393<\\frac{1}{2}$."
  },
  "burst-int-021": {
    "spot": "$\\int_0^{\\pi/2}\\sin^n x\\,dx$ with $n=7$ odd — Wallis reduction formula; odd powers give a result with no $\\pi$.",
    "why": "You could write $\\sin x(1-\\cos^2x)^3$ and set $u=\\cos x$, but then you have to expand a cube; Wallis is just a product of fractions.",
    "steps": [
      "Reduction formula: $I_n=\\frac{n-1}{n}I_{n-2}$, so $I_7=\\frac{6}{7}I_5$.",
      "Keep reducing down to $I_1=\\int_0^{\\pi/2}\\sin x\\,dx=1$.",
      "$I_7=\\frac{6}{7}\\cdot\\frac{4}{5}\\cdot\\frac{2}{3}\\cdot 1=\\frac{48}{105}=\\frac{16}{35}$."
    ],
    "trap": "Multiplying in the $\\frac{\\pi}{2}$ that only belongs to even powers, getting $\\frac{8\\pi}{35}$. Odd powers reduce to $I_1=1$; only even powers reduce to $I_0=\\frac{\\pi}{2}$.",
    "check": "$0\\le\\sin x\\le 1$, so higher powers are smaller: $I_7<I_5=\\frac{8}{15}$, and indeed $\\frac{16}{35}\\approx 0.457<0.533$."
  },
  "cx-ftc-002": {
    "spot": "A sum of $n$ terms, each with denominator $n+k$: pull out $\\frac{1}{n}$ and it becomes $\\frac{1}{n}\\sum f\\left(\\frac{k}{n}\\right)$ — a Riemann sum, whose limit is a definite integral.",
    "why": "To turn a sum as $n\\to\\infty$ into an exact number, recognizing a Riemann sum is the reliable route; bounding the terms one by one only gives upper and lower bounds.",
    "steps": [
      "Pull out $\\frac{1}{n}$: $\\frac{1}{n+k}=\\frac{1}{n}\\cdot\\frac{1}{1+\\frac{k}{n}}$.",
      "This is the right-endpoint Riemann sum of $f(x)=\\frac{1}{1+x}$ on $[0,1]$ with points $x_k=\\frac{k}{n}$, so the limit is $\\int_0^1\\frac{dx}{1+x}$.",
      "$\\int_0^1\\frac{dx}{1+x}=\\ln 2$."
    ],
    "trap": "Seeing each term $\\frac{1}{n+k}\\to 0$ and concluding the sum goes to $0$. But the number of terms grows with $n$: $n$ numbers each about $\\frac{1}{n}$ add up to a finite positive number.",
    "check": "Squeeze with integrals: $\\ln\\frac{2n+1}{n+1}<\\sum_{k=1}^n\\frac{1}{n+k}<\\ln 2$, and the left side also tends to $\\ln 2$ as $n\\to\\infty$."
  },
  "depth-lim-006": {
    "spot": "$x\\to\\infty$, both terms in the parentheses are about $\\frac{1}{x}$, and there's an $x^2$ in front: the first-order terms cancel and the answer lives in the $\\frac{1}{x^2}$ term. Substitute $u=\\frac{1}{x}$ and expand to $u^2$.",
    "why": "L'Hôpital's Rule would need rewriting $\\infty\\cdot 0$ first and then differentiating a fraction twice; with $u=\\frac{1}{x}$ it's just two standard expansions subtracted.",
    "steps": [
      "Let $u=\\frac{1}{x}\\to 0^+$: $\\frac{1}{x+1}=\\frac{u}{1+u}$, so the expression $=\\frac{\\ln(1+u)-\\frac{u}{1+u}}{u^2}$.",
      "Expand: $\\ln(1+u)=u-\\frac{u^2}{2}+\\frac{u^3}{3}-\\cdots$, $\\frac{u}{1+u}=u-u^2+u^3-\\cdots$.",
      "Subtract: the linear terms cancel, and the $u^2$ coefficient is $-\\frac{1}{2}-(-1)=\\frac{1}{2}$, so the numerator $=\\frac{u^2}{2}+O(u^3)$.",
      "Divide by $u^2$ to get $\\frac{1}{2}$."
    ],
    "trap": "Expanding both terms only to first order (both are $u$), concluding the parentheses are $0$, and answering $0$. With $x^2=\\frac{1}{u^2}$ in front, you must expand to $u^2$.",
    "check": "Plug in $x=100$: the value is about $0.4934$, slightly below $\\frac{1}{2}$ (the next term is $-\\frac{2}{3}u$)."
  },
  "gx-059": {
    "spot": "$y=4-x^2$ is a downward parabola meeting the $x$-axis at $x=\\pm 2$, and the region is symmetric — find the intersections for the limits, then use symmetry and do only the right half.",
    "why": "The region is symmetric, so computing $2\\int_0^2$ instead of $\\int_{-2}^2$ saves plugging in a negative number — fewer chances for error.",
    "steps": [
      "Intersections: $4-x^2=0\\Rightarrow x=\\pm 2$.",
      "The region lies above the $x$-axis and is symmetric: area $=2\\int_0^2(4-x^2)\\,dx$.",
      "$\\int_0^2(4-x^2)\\,dx=8-\\frac{8}{3}=\\frac{16}{3}$; times $2$ gives $\\frac{32}{3}$."
    ],
    "trap": "Using symmetry to compute only $\\int_0^2$ but forgetting to multiply by $2$, answering $\\frac{16}{3}$.",
    "check": "Archimedes: a parabolic segment has $\\frac{2}{3}$ the area of its bounding rectangle ($4\\times 4$), and $\\frac{2}{3}\\cdot 16=\\frac{32}{3}$."
  },
  "lx-der-002": {
    "spot": "$\\frac{\\sqrt{16+h}-\\sqrt{16}}{h}$ is exactly the difference quotient of $f(x)=\\sqrt{x}$ at $16$ — the definition of the derivative.",
    "why": "Rationalizing also works, but recognizing the derivative definition means you just compute $f'(16)$ — one line.",
    "steps": [
      "$f(x)=\\sqrt{x}$ and $f(16)=4$, so the limit $=\\lim_{h\\to 0}\\frac{f(16+h)-f(16)}{h}=f'(16)$.",
      "$f'(x)=\\frac{1}{2\\sqrt{x}}$.",
      "$f'(16)=\\frac{1}{2\\cdot 4}=\\frac{1}{8}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ in the derivative of a square root and answering $\\frac{1}{4}$.",
    "check": "Plug in $h=0.01$: $\\frac{\\sqrt{16.01}-4}{0.01}\\approx 0.12498$, slightly below $\\frac{1}{8}$ ($\\sqrt{x}$ curves downward)."
  },
  "lx-der-003": {
    "spot": "Numerator $\\ln x-\\ln 4$, denominator $x-4$, $x\\to 4$: this is the difference quotient of $\\ln x$ at $4$, so the limit is the value of $(\\ln x)'$ at $4$.",
    "why": "L'Hôpital's Rule gives the same answer, but recognizing the derivative definition even skips checking for $\\frac{0}{0}$.",
    "steps": [
      "With $f(x)=\\ln x$, the limit $=\\lim_{x\\to 4}\\frac{f(x)-f(4)}{x-4}=f'(4)$.",
      "$f'(x)=\\frac{1}{x}$.",
      "$f'(4)=\\frac{1}{4}$."
    ],
    "trap": "Rewriting as $\\ln\\frac{x}{4}$ and thinking that since top and bottom are both $0$ the ratio is $1$, answering $1$. $\\frac{0}{0}$ is an indeterminate form — you need the slope.",
    "check": "Plug in $x=4.01$: $\\frac{\\ln 4.01-\\ln 4}{0.01}\\approx 0.24969$, very close to $\\frac{1}{4}$."
  },
  "lx-hard-001": {
    "spot": "$\\sqrt[3]{8}=2$, so the numerator is $f(x)-f(8)$ and the denominator is $x-8$ with $f(x)=x^{1/3}$ — the derivative definition.",
    "why": "You could set $t=\\sqrt[3]{x}$ and cancel using the difference of cubes $t^3-8=(t-2)(t^2+2t+4)$, but computing $f'(8)$ directly is faster.",
    "steps": [
      "$f(x)=x^{1/3}$ and $f(8)=2$, so the limit $=f'(8)$.",
      "$f'(x)=\\frac{1}{3}x^{-2/3}$.",
      "$f'(8)=\\frac{1}{3}\\cdot 8^{-2/3}=\\frac{1}{3}\\cdot\\frac{1}{4}=\\frac{1}{12}$."
    ],
    "trap": "Miscomputing $8^{-2/3}$ as $\\frac{1}{2}$ (taking the cube root but not squaring), getting $\\frac{1}{6}$. $8^{2/3}=(\\sqrt[3]{8})^2=4$.",
    "check": "Difference-of-cubes route: $\\frac{t-2}{t^3-8}=\\frac{1}{t^2+2t+4}$; plugging in $t=2$ gives $\\frac{1}{12}$. Both routes agree."
  },
  "mob-lm-002": {
    "spot": "The constraint $x+y=6$ is linear (a line) and the objective $x^2+y^2$ is the squared distance to the origin — eliminate $y$ and you have a one-variable quadratic.",
    "why": "Lagrange multipliers also give $x=y=3$, but when the constraint is a line, substituting is faster and you won't forget to check whether it's a min or a max.",
    "steps": [
      "Substitute $y=6-x$: objective $g(x)=x^2+(6-x)^2$.",
      "$g'(x)=2x-2(6-x)=4x-12=0\\Rightarrow x=3$, $y=3$.",
      "$g''=4>0$, so it's a minimum; the minimum value is $g(3)=9+9=18$."
    ],
    "trap": "Answering $x=3$ (where the minimum occurs) instead of the minimum value $18$ the problem asks for; or writing $\\sqrt{18}$ (the distance) and forgetting the objective is the squared distance.",
    "check": "Geometry: the distance from the origin to the line $x+y=6$ is $\\frac{6}{\\sqrt{2}}$, and its square is exactly $18$."
  },
  "mob-lm-009": {
    "spot": "The constraint is the circle $x^2+y^2=50$ and the objective $xy$ is symmetric — the Lagrange condition forces $x^2=y^2$, and the max is where $x=y$ have the same sign.",
    "why": "Solving the circle for $y=\\sqrt{50-x^2}$ and substituting brings in a square root and a sign split; Lagrange (or AM-GM) handles the symmetry directly.",
    "steps": [
      "$\\nabla(xy)=\\lambda\\nabla(x^2+y^2)$: $y=2\\lambda x$, $x=2\\lambda y$.",
      "Multiply the two equations and cancel $xy$ (when $xy=0$ the objective is $0$, not the max): $4\\lambda^2=1$, so $y=\\pm x$; plugging into the constraint gives $2x^2=50$, $x^2=25$.",
      "For the max take the same sign, $x=y=\\pm 5$: $xy=25$ (opposite signs give $-25$, which is the min)."
    ],
    "trap": "After finding $x^2=25$, also taking $x=5,y=-5$ as an answer and getting $-25$ — that's the minimum.",
    "check": "Parametrize $x=\\sqrt{50}\\cos t$, $y=\\sqrt{50}\\sin t$: $xy=25\\sin 2t\\le 25$."
  },
  "mob-nabla-007": {
    "spot": "The vector field being integrated is a gradient $\\nabla f$ — Fundamental Theorem for Line Integrals: only endpoint minus start point matters, not the path.",
    "why": "You could parametrize some path and integrate, but for a gradient field the line integral is just $f(B)-f(A)$ — you don't even have to choose a path.",
    "steps": [
      "$f=x^2+y^2$, $\\nabla f=\\langle 2x,2y\\rangle$.",
      "Fundamental Theorem for Line Integrals: $\\int_C\\nabla f\\cdot d\\mathbf r=f(1,1)-f(0,0)$.",
      "$=2-0=2$."
    ],
    "trap": "Adding the components of $\\nabla f$, $\\langle 2x,2y\\rangle$, at the endpoint (getting $4$) and calling that the answer; you want the difference of $f$ itself, not the gradient.",
    "check": "Pick two paths to confirm path independence: along $(t,t)$ the integrand is $4t$, along $(t,t^2)$ it is $2t+4t^3$; both integrals equal $2$."
  },
  "putnam-006": {
    "spot": "An infinite product with factors $1-\\frac{1}{(2n)^2}$ — it looks like Euler's sine product $\\sin x=x\\prod\\left(1-\\frac{x^2}{n^2\\pi^2}\\right)$ at $x=\\frac{\\pi}{2}$.",
    "why": "This product doesn't telescope and the partial products have no nice formula; plugging into the sine product gives the value directly.",
    "steps": [
      "At $x=\\frac{\\pi}{2}$: $1-\\frac{x^2}{n^2\\pi^2}=1-\\frac{1}{4n^2}$, exactly the factor in the problem.",
      "Euler's sine product: $\\sin x=x\\prod_{n=1}^\\infty\\left(1-\\frac{x^2}{n^2\\pi^2}\\right)$ (taking logs turns it into a convergent series).",
      "Plug in $x=\\frac{\\pi}{2}$: $1=\\frac{\\pi}{2}\\prod\\left(1-\\frac{1}{4n^2}\\right)$, so the product $=\\frac{2}{\\pi}$."
    ],
    "trap": "Confusing it with $\\prod_{n\\ge 2}\\left(1-\\frac{1}{n^2}\\right)=\\frac{1}{2}$: that one splits as $\\frac{n-1}{n}\\cdot\\frac{n+1}{n}$ and telescopes; this one splits as $\\frac{2n-1}{2n}\\cdot\\frac{2n+1}{2n}$, which doesn't cancel out.",
    "check": "Every factor is less than $1$, so the product is smaller than the first two factors $\\frac{3}{4}\\cdot\\frac{15}{16}\\approx 0.703$; $\\frac{2}{\\pi}\\approx 0.637$ fits."
  },
  "rel-adv-007": {
    "spot": "You need the Hessian determinant: compute the three second partials $f_{xx},f_{yy},f_{xy}$ at the point, then determinant $=f_{xx}f_{yy}-f_{xy}^2$.",
    "why": "A two-variable Hessian is only $2\\times 2$, so filling in the formula is fastest; no need to find critical points first.",
    "steps": [
      "$f_{xx}=12x^2$, which is $12$ at $(1,1)$; likewise $f_{yy}=12y^2=12$.",
      "Mixed partial $f_{xy}=\\frac{\\partial}{\\partial y}(4x^3-4y)=-4$.",
      "$\\det H=12\\cdot 12-(-4)^2=144-16=128$."
    ],
    "trap": "Writing $-f_{xy}^2$ as $-f_{xy}$ or $+16$, getting $148$ or $160$. $f_{xy}$ is negative, but once squared you always subtract a positive number.",
    "check": "$\\det H>0$ and $f_{xx}>0$: $(1,1)$ is a local min, and $(1,1)$ really is a critical point ($f_x=4-4=0$)."
  },
  "rel-adv-011": {
    "spot": "$x$ times $e^{-3x}$ integrated from $0$ to $\\infty$: $\\int_0^\\infty x^ne^{-ax}\\,dx=\\frac{n!}{a^{n+1}}$, here with $n=1$, $a=3$.",
    "why": "It's only a first power, so one round of integration by parts does it; if you know the formula it's just $\\frac{1!}{3^2}$.",
    "steps": [
      "Integration by parts: $u=x$, $dv=e^{-3x}dx$, antiderivative $-\\frac{x}{3}e^{-3x}-\\frac{1}{9}e^{-3x}$.",
      "Upper limit: as $x\\to\\infty$, $xe^{-3x}\\to 0$ and $e^{-3x}\\to 0$, so the whole antiderivative tends to $0$.",
      "At the lower limit $x=0$ the value is $-\\frac{1}{9}$, so the integral $=0-\\left(-\\frac{1}{9}\\right)=\\frac{1}{9}$."
    ],
    "trap": "Using $a^n$ in the denominator of the formula and getting $\\frac{1}{3}$. The denominator of $\\int_0^\\infty x^ne^{-ax}dx$ is $a^{n+1}$.",
    "check": "$\\Gamma(2)/3^2=\\frac{1}{9}$; or view it as differentiating $\\int_0^\\infty e^{-3x}dx=\\frac{1}{3}$ in $a$: $\\frac{1}{a^2}$ at $a=3$."
  },
  "rel-hard-int-002": {
    "spot": "$x^{3/2}e^{-4x}$ from $0$ to $\\infty$: $\\int_0^\\infty x^{s-1}e^{-ax}dx=\\frac{\\Gamma(s)}{a^s}$ with $s=\\frac{5}{2}$, $a=4$; a half-integer Gamma brings in $\\sqrt{\\pi}$.",
    "why": "Integration by parts reduces to $\\int x^{-1/2}e^{-4x}$, which still needs the Gaussian integral; go straight to the Gamma recursion and $\\Gamma(\\frac{1}{2})=\\sqrt{\\pi}$.",
    "steps": [
      "Let $u=4x$: the integral $=\\frac{1}{4^{5/2}}\\int_0^\\infty u^{3/2}e^{-u}du=\\frac{\\Gamma(5/2)}{32}$.",
      "Recursion $\\Gamma(s+1)=s\\Gamma(s)$: $\\Gamma(\\frac{5}{2})=\\frac{3}{2}\\cdot\\frac{1}{2}\\Gamma(\\frac{1}{2})=\\frac{3}{4}\\Gamma(\\frac{1}{2})$.",
      "$\\Gamma(\\frac{1}{2})=\\sqrt{\\pi}$, so $\\Gamma(\\frac{5}{2})=\\frac{3\\sqrt{\\pi}}{4}$.",
      "The integral $=\\frac{3\\sqrt{\\pi}}{4\\cdot 32}=\\frac{3\\sqrt{\\pi}}{128}$."
    ],
    "trap": "Using $\\frac{3}{2}$ (the power in the integrand) as the Gamma argument instead of $\\frac{5}{2}$ (power plus one), getting $\\frac{\\sqrt{\\pi}/2}{8}=\\frac{\\sqrt{\\pi}}{16}$.",
    "check": "Numerical integration gives about $0.04154$, which is $\\frac{3\\sqrt{\\pi}}{128}$."
  },
  "rel-hard-int-004": {
    "spot": "$x^3$ times $(\\ln x)^2$ — powers of $\\ln x$ are the fingerprint of differentiating with respect to the exponent: $\\frac{\\partial}{\\partial a}x^a=x^a\\ln x$. Start from $\\int_0^1x^a dx=\\frac{1}{a+1}$ and differentiate twice in $a$.",
    "why": "Integrating by parts twice also works, but you have to handle the boundary at $x\\to 0$; differentiating under the parameter gives the whole family $\\frac{2}{(a+1)^3}$ at once.",
    "steps": [
      "$\\int_0^1x^a\\,dx=\\frac{1}{a+1}$ ($a>-1$).",
      "Differentiate twice in $a$: each derivative adds one $\\ln x$ on the left, and on the right $\\frac{d^2}{da^2}\\frac{1}{a+1}=\\frac{2}{(a+1)^3}$.",
      "Plug in $a=3$: $\\frac{2}{4^3}=\\frac{1}{32}$."
    ],
    "trap": "Thinking that since $\\ln x<0$ the answer is negative; $(\\ln x)^2$ is a square, so the integrand is nonnegative and the answer must be positive (the two minus signs from differentiating twice also cancel).",
    "check": "Numerical integration: $\\int_0^1x^3(\\ln x)^2dx\\approx 0.03125$."
  },
  "uni-der-007": {
    "spot": "Differentiating an integral whose upper and lower limits both contain $x$ — the Leibniz rule (two-ended version of the Fundamental Theorem of Calculus): plug in the upper limit times its derivative, minus the lower limit plugged in times its derivative.",
    "why": "The antiderivative of $\\ln(1+t^2)$ is long (integration by parts plus $\\arctan$); the Fundamental Theorem lets you skip integrating altogether.",
    "steps": [
      "Let $F'(t)=\\ln(1+t^2)$; then $\\int_x^{2x}=F(2x)-F(x)$.",
      "Upper limit $2x$: $F'(2x)\\cdot 2=2\\ln(1+4x^2)$.",
      "Lower limit $x$: $F'(x)\\cdot 1=\\ln(1+x^2)$; subtracting gives $2\\ln(1+4x^2)-\\ln(1+x^2)$."
    ],
    "trap": "Plugging in the upper limit but forgetting to multiply by $(2x)'=2$, getting $\\ln(1+4x^2)-\\ln(1+x^2)$.",
    "check": "At $x=0$ the interval has length $0$ and the integrand is $0$ near $0$, so the derivative should be $0$: $2\\ln 1-\\ln 1=0$."
  },
  "uni-der-012": {
    "spot": "You need the Hessian determinant: plug $(1,1)$ into the three second partials $f_{xx}=12x^2$, $f_{yy}=12y^2$, $f_{xy}=-4$, then compute $f_{xx}f_{yy}-f_{xy}^2$.",
    "why": "A $2\\times 2$ Hessian is just the formula; $-4xy$ is the only term contributing to the mixed partial, so $f_{xy}=-4$ at a glance.",
    "steps": [
      "$f_{xx}=12x^2$, which is $12$ at $x=1$.",
      "$f_{yy}=12y^2$, which is $12$ at $y=1$.",
      "$f_{xy}$: only $-4xy$ contains both $x,y$, giving $-4$.",
      "$\\det H=12\\cdot 12-(-4)^2=128$."
    ],
    "trap": "Writing the determinant as $f_{xx}f_{yy}+f_{xy}^2=160$; you subtract the off-diagonal product from the diagonal product.",
    "check": "$(1,1)$ is a critical point ($f_x=4x^3-4y=0$), and $\\det H=128>0$ with $f_{xx}>0$, so it's a local min — the determinant makes sense."
  },
  "uni-int-016": {
    "spot": "$\\sin^3x\\cos^2x$: the power of $\\sin$ is odd — save one $\\sin x\\,dx$ for $du$, write the rest as $\\sin^2x=1-\\cos^2x$, and let $u=\\cos x$.",
    "why": "Using the odd power for $du$ turns the whole integral into a polynomial; power-reduction formulas would leave you with products of $\\sin 2x$.",
    "steps": [
      "Rewrite: $\\sin^3x\\cos^2x=(1-\\cos^2x)\\cos^2x\\cdot\\sin x$.",
      "Let $u=\\cos x$, $du=-\\sin x\\,dx$; $x:0\\to\\frac{\\pi}{2}$ corresponds to $u:1\\to 0$, and the minus sign flips the limits back: $\\int_0^1(1-u^2)u^2\\,du$.",
      "$\\int_0^1(u^2-u^4)\\,du=\\frac{1}{3}-\\frac{1}{5}=\\frac{2}{15}$."
    ],
    "trap": "Forgetting the minus sign in $du=-\\sin x\\,dx$ without flipping the limits either, getting $-\\frac{2}{15}$. The integrand is nonnegative on $[0,\\frac{\\pi}{2}]$, so the answer can't be negative.",
    "check": "Beta formula: $\\int_0^{\\pi/2}\\sin^3x\\cos^2x\\,dx=\\frac{1}{2}B(2,\\frac{3}{2})=\\frac{2}{15}$; numerical integration agrees too."
  },
  "uni-int-023": {
    "spot": "$x=2\\cos t$, $y=3\\sin t$: $\\left(\\frac{x}{2}\\right)^2+\\left(\\frac{y}{3}\\right)^2=1$, an ellipse with semi-axes $2$ and $3$, traced once for $t:0\\to 2\\pi$.",
    "why": "Once you recognize the ellipse you can use $\\pi ab$ directly; computing $\\oint x\\,dy$ with the parametric area formula confirms it's no coincidence.",
    "steps": [
      "Eliminate $t$: $\\frac{x^2}{4}+\\frac{y^2}{9}=\\cos^2t+\\sin^2t=1$.",
      "Parametric area $A=\\oint x\\,dy=\\int_0^{2\\pi}2\\cos t\\cdot 3\\cos t\\,dt=6\\int_0^{2\\pi}\\cos^2t\\,dt$.",
      "$\\int_0^{2\\pi}\\cos^2t\\,dt=\\pi$, so the area $=6\\pi$, which is $\\pi ab=\\pi\\cdot 2\\cdot 3$."
    ],
    "trap": "Using $\\int y\\,dx$ but ignoring orientation (as $t$ increases, $x$ moves right to left), getting $-6\\pi$; area must be positive.",
    "check": "The ellipse sits between the circles of radius $2$ and $3$: $4\\pi<6\\pi<9\\pi$."
  },
  "uni-lim-003": {
    "spot": "$e^{x^2}$ and $\\cos x$ both equal $1$ at $0$, and the denominator is $x^2$: write each standard expansion up to the $x^2$ term and subtract.",
    "why": "L'Hôpital's Rule means differentiating $e^{x^2}$ twice with the Chain Rule; the expansion only needs the first two terms of $e^u$ and $\\cos x$.",
    "steps": [
      "$e^{x^2}=1+x^2+\\frac{x^4}{2}+\\cdots$ (substitute $u=x^2$ into $e^u$).",
      "$\\cos x=1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\cdots$.",
      "Subtract: $e^{x^2}-\\cos x=\\frac{3}{2}x^2+O(x^4)$; dividing by $x^2$ gives $\\frac{3}{2}$."
    ],
    "trap": "Getting the sign of the $x^2$ term of $\\cos x$ wrong (writing $+\\frac{x^2}{2}$), which gives $1-\\frac{1}{2}=\\frac{1}{2}$.",
    "check": "Plug in $x=0.01$: the ratio is about $1.50001$, very close to $\\frac{3}{2}$."
  },
  "uni-ser-010": {
    "spot": "Alternating signs and odd denominators $2n+1$: this is $\\arctan x=\\sum\\frac{(-1)^nx^{2n+1}}{2n+1}$ at $x=1$ (the Leibniz series).",
    "why": "The Alternating Series Test only tells you it converges, not the value; recognizing the Taylor series of $\\arctan$ gives the sum.",
    "steps": [
      "Geometric series: $\\frac{1}{1+t^2}=\\sum_{n=0}^\\infty(-1)^nt^{2n}$ ($|t|<1$).",
      "Integrate from $0$ to $x$: $\\arctan x=\\sum\\frac{(-1)^nx^{2n+1}}{2n+1}$; for example it checks out at $x=\\frac{1}{2}$.",
      "At $x=1$ the series converges (alternating), and by Abel's theorem the equality still holds: sum $=\\arctan 1=\\frac{\\pi}{4}$."
    ],
    "trap": "Confusing it with $\\sum\\frac{(-1)^{n+1}}{n}=\\ln 2$; odd denominators only means $\\arctan$, all positive integers means $\\ln(1+x)$.",
    "check": "An alternating series' sum lies between consecutive partial sums: $1-\\frac{1}{3}=0.667<\\frac{\\pi}{4}\\approx 0.785<1$."
  },
  "vc-div-007": {
    "spot": "A closed surface (the full boundary of a solid cylinder) and the outward flux — Divergence Theorem: switch to $\\iiint\\nabla\\cdot\\mathbf F\\,dV$.",
    "why": "Computing directly means three pieces: top, bottom, and side; the divergence is just $2z$, so the volume integral is one line.",
    "steps": [
      "$\\nabla\\cdot\\mathbf F=\\frac{\\partial}{\\partial z}z^2=2z$.",
      "Each cross-section at height $z$ is a disk of radius $1$ with area $\\pi$: $\\iiint 2z\\,dV=\\int_0^2 2z\\cdot\\pi\\,dz$.",
      "$=\\pi[z^2]_0^2=4\\pi$."
    ],
    "trap": "Thinking you multiply the divergence $2z$ by the cylinder's volume $2\\pi$ and plug in some $z$; the divergence varies with height, so you really have to integrate.",
    "check": "Direct surface integral: on the side $\\mathbf F\\cdot\\mathbf n=0$, on the bottom $z=0$ so $\\mathbf F=\\mathbf 0$; only the top remains, $z^2=4$ times area $\\pi$."
  },
  "world-024": {
    "spot": "$e^x\\cos x$ differentiated four times: it's the real part of $e^{(1+i)x}$, each derivative multiplies by $1+i$, and four of them give $(1+i)^4=-4$.",
    "why": "Brute-forcing the Product Rule four times sprouts a pile of alternating $\\sin$, $\\cos$ terms; complex exponentials do it in one line. If unsure, differentiate two at a time and watch the pattern.",
    "steps": [
      "Differentiate twice: $(e^x\\cos x)''=-2e^x\\sin x$.",
      "Twice more: $(-2e^x\\sin x)''=-4e^x\\cos x$, so $\\frac{d^4}{dx^4}(e^x\\cos x)=-4e^x\\cos x$.",
      "This matches the real part from $(1+i)^4=(\\sqrt{2})^4e^{i\\pi}=-4$; plugging in $x=0$ gives $-4$."
    ],
    "trap": "Thinking $e^x\\cos x$ returns to itself after four derivatives (like $\\cos x$ with period $4$) and answering $1$; the $e^x$ adds a factor each time, and four rounds accumulate to $-4$.",
    "check": "Binomial expansion: the real part of $(1+i)^4$ $=1-\\binom{4}{2}+1=1-6+1=-4$."
  },
  "world-027": {
    "spot": "$x\\cdot e^{-x}\\sin x$: the extra $x$ is the fingerprint of differentiating with respect to a parameter. First compute $I(a)=\\int_0^\\infty e^{-ax}\\sin x\\,dx=\\frac{1}{a^2+1}$, then take $-I'(1)$.",
    "why": "Integration by parts would take four rounds plus solving an equation; differentiating under the parameter reduces it to one derivative of $\\frac{1}{a^2+1}$.",
    "steps": [
      "Base integral: $I(a)=\\int_0^\\infty e^{-ax}\\sin x\\,dx=\\frac{1}{a^2+1}$.",
      "Differentiating in $a$ pulls a $-x$ out of the integrand: $\\int_0^\\infty xe^{-ax}\\sin x\\,dx=-I'(a)=\\frac{2a}{(a^2+1)^2}$.",
      "Plug in $a=1$: $\\frac{2}{4}=\\frac{1}{2}$."
    ],
    "trap": "Dropping the minus sign in $-I'(a)$ and getting $-\\frac{1}{2}$; $\\frac{\\partial}{\\partial a}e^{-ax}=-xe^{-ax}$, so the integral you want is $-I'$.",
    "check": "Numerical integration: $\\int_0^\\infty xe^{-x}\\sin x\\,dx\\approx 0.5$; the complex route $\\operatorname{Im}\\frac{1}{(1-i)^2}=\\operatorname{Im}\\frac{i}{2}=\\frac{1}{2}$ agrees too."
  },
  "world-039": {
    "spot": "The denominator has $n^2\\binom{2n}{n}$ — that's the power series of $\\arcsin^2$: $2\\arcsin^2x=\\sum\\frac{(2x)^{2n}}{n^2\\binom{2n}{n}}$; making $(2x)^{2n}=1$ means $x=\\frac{1}{2}$.",
    "why": "Reciprocals of central binomial coefficients don't telescope or split into partial fractions; recognize the expansion of $\\arcsin^2$ and the answer is just $2\\left(\\frac{\\pi}{6}\\right)^2$.",
    "steps": [
      "Match coefficients: $2\\arcsin^2x=2x^2+\\frac{2}{3}x^4+\\cdots$, and the $n=1,2$ terms of the series are $\\frac{4x^2}{1\\cdot 2}=2x^2$, $\\frac{16x^4}{4\\cdot 6}=\\frac{2}{3}x^4$.",
      "Plug in $x=\\frac{1}{2}$ so that $(2x)^{2n}=1$: $\\sum\\frac{1}{n^2\\binom{2n}{n}}=2\\arcsin^2\\frac{1}{2}$.",
      "$\\arcsin\\frac{1}{2}=\\frac{\\pi}{6}$, so the sum $=\\frac{2\\pi^2}{36}=\\frac{\\pi^2}{18}$."
    ],
    "trap": "Plugging in $x=1$ (thinking that since the coefficients are all $1$ you should plug in $1$), getting $2\\left(\\frac{\\pi}{2}\\right)^2=\\frac{\\pi^2}{2}$; the series has $(2x)^{2n}$, so you need $x=\\frac{1}{2}$.",
    "check": "The first four terms $\\frac{1}{2}+\\frac{1}{24}+\\frac{1}{180}+\\frac{1}{1120}\\approx 0.5481$, just a bit below $\\frac{\\pi^2}{18}\\approx 0.5483$ (each later term shrinks by about $\\frac{1}{4}$)."
  },
  "world-087": {
    "spot": "$\\sum\\frac{1}{n^6}$ is an even-index $\\zeta$ value, so it must be $\\pi^6$ times a rational; it comes from matching coefficients in $\\frac{\\sin x}{x}=\\prod\\left(1-\\frac{x^2}{n^2\\pi^2}\\right)$.",
    "why": "$\\zeta(2)=\\frac{\\pi^2}{6}$, $\\zeta(4)=\\frac{\\pi^4}{90}$, $\\zeta(6)=\\frac{\\pi^6}{945}$ are worth memorizing; the derivation uses Euler's product plus Newton's identities.",
    "steps": [
      "$\\frac{\\sin x}{x}=1-\\frac{x^2}{6}+\\frac{x^4}{120}-\\frac{x^6}{5040}+\\cdots$.",
      "Let $a_n=\\frac{1}{n^2\\pi^2}$; the coefficients of the expanded product are the elementary symmetric sums of the $a_n$: $e_1=\\frac{1}{6}$, $e_2=\\frac{1}{120}$, $e_3=\\frac{1}{5040}$ ($e_1=\\frac{\\zeta(2)}{\\pi^2}$).",
      "Newton's identities: $\\sum a_n^3=e_1^3-3e_1e_2+3e_3=\\frac{1}{216}-\\frac{1}{240}+\\frac{1}{1680}=\\frac{1}{945}$.",
      "$\\sum a_n^3=\\frac{\\zeta(6)}{\\pi^6}$, so $\\zeta(6)=\\frac{\\pi^6}{945}$."
    ],
    "trap": "Mixing it up with $\\zeta(4)=\\frac{\\pi^4}{90}$, or misremembering $945$ as $954$; checking the size against the first two terms $1+\\frac{1}{64}\\approx 1.0156$ catches this.",
    "check": "The first three terms $1+\\frac{1}{64}+\\frac{1}{729}\\approx 1.01700$, slightly below $\\frac{\\pi^6}{945}\\approx 1.01734$."
  },
  "burst-boss-int-010": {
    "spot": "On $[0,1)$, $\\frac{1}{1-x}$ expands as the geometric series $\\sum x^n$, and each term times $\\ln x$ is the standard integral $\\int_0^1x^n\\ln x\\,dx=-\\frac{1}{(n+1)^2}$.",
    "why": "This integral has no elementary antiderivative; expanding and integrating term by term turns the answer directly into $-\\zeta(2)$.",
    "steps": [
      "$\\frac{\\ln x}{1-x}=\\sum_{n=0}^\\infty x^n\\ln x$ ($0<x<1$; all terms have the same sign, so term-by-term integration is fine).",
      "$\\int_0^1x^n\\ln x\\,dx=-\\frac{1}{(n+1)^2}$ (differentiate $\\int_0^1x^a dx=\\frac{1}{a+1}$ in $a$).",
      "Add up: $-\\sum_{n=0}^\\infty\\frac{1}{(n+1)^2}=-\\zeta(2)=-\\frac{\\pi^2}{6}$."
    ],
    "trap": "Forgetting the sign from $\\ln x<0$ and answering $\\frac{\\pi^2}{6}$. On $(0,1)$, $\\ln x<0$ and $1-x>0$, so the integrand is negative throughout.",
    "check": "Numerical integration: $\\int_0^1\\frac{\\ln x}{1-x}dx\\approx -1.6449$."
  },
  "burst-boss3-param-004": {
    "spot": "$x^a(\\ln x)^4$: each $\\ln x$ is pulled down by one derivative in $a$ — differentiate $\\int_0^1x^a dx=\\frac{1}{a+1}$ four times in $a$.",
    "why": "Four rounds of integration by parts means dealing with the boundary at $x\\to 0$ each time; differentiating $\\frac{1}{a+1}$ four times is pure power-rule work.",
    "steps": [
      "$\\frac{\\partial}{\\partial a}x^a=x^a\\ln x$, so $\\frac{\\partial^4}{\\partial a^4}x^a=x^a(\\ln x)^4$.",
      "$\\int_0^1x^a\\,dx=\\frac{1}{a+1}$; differentiate both sides four times in $a$.",
      "Twice: $\\frac{2}{(a+1)^3}$; twice more: $\\frac{2\\cdot 3\\cdot 4}{(a+1)^5}=\\frac{24}{(a+1)^5}$.",
      "So $B(a)=\\frac{24}{(a+1)^5}$."
    ],
    "trap": "Botching the sign at each derivative and getting $-\\frac{24}{(a+1)^5}$; an even number of derivatives cancels the signs, and since $(\\ln x)^4\\ge 0$ the answer must be positive.",
    "check": "Plug in $a=0$: $\\int_0^1(\\ln x)^4dx=\\Gamma(5)=24$, and the formula gives $\\frac{24}{1}$."
  },
  "burst-int-026": {
    "spot": "Denominator $e^x-1$ — write it as $\\frac{e^{-x}}{1-e^{-x}}=\\sum_{n\\ge 1}e^{-nx}$; each term times $x$ is $\\int_0^\\infty xe^{-nx}dx=\\frac{1}{n^2}$.",
    "why": "There's no elementary antiderivative; expanding as a geometric series and integrating term by term gives $\\zeta(2)$ directly.",
    "steps": [
      "$\\frac{x}{e^x-1}=\\sum_{n=1}^\\infty xe^{-nx}$ ($x>0$, ratio $e^{-x}<1$).",
      "Integrate term by term (all terms nonnegative): $\\int_0^\\infty xe^{-nx}dx=\\frac{1}{n^2}$.",
      "Add up: $\\sum\\frac{1}{n^2}=\\frac{\\pi^2}{6}$."
    ],
    "trap": "Starting the expansion at $n=0$ ($\\sum_{n\\ge 0}e^{-nx}=\\frac{1}{1-e^{-x}}$), which adds a divergent term $\\int_0^\\infty x\\,dx$; the $e^{-x}$ in the numerator makes the series start at $n=1$.",
    "check": "Numerical integration: $\\int_0^\\infty\\frac{x}{e^x-1}dx\\approx 1.6449$."
  },
  "hc-spec-002": {
    "spot": "$\\sqrt{x}$ over $(1+x)^3$ from $0$ to $\\infty$: the shape $\\frac{x^{p-1}}{(1+x)^{p+q}}$ is a Beta function, here with $p=q=\\frac{3}{2}$; if you don't remember Beta, $x=\\tan^2\\theta$ makes $1+x=\\sec^2\\theta$.",
    "why": "$B(\\frac{3}{2},\\frac{3}{2})=\\frac{\\Gamma(3/2)^2}{\\Gamma(3)}=\\frac{\\pi}{8}$ in one line; the $\\tan^2$ substitution turns it into a trig integral you can verify by hand.",
    "steps": [
      "Let $x=\\tan^2\\theta$: $dx=2\\tan\\theta\\sec^2\\theta\\,d\\theta$, $\\sqrt{x}=\\tan\\theta$, $1+x=\\sec^2\\theta$, and $x:0\\to\\infty$ corresponds to $\\theta:0\\to\\frac{\\pi}{2}$.",
      "Simplify: $\\frac{\\tan\\theta\\cdot 2\\tan\\theta\\sec^2\\theta}{\\sec^6\\theta}=2\\sin^2\\theta\\cos^2\\theta$.",
      "Double angle: $2\\sin^2\\theta\\cos^2\\theta=\\frac{\\sin^22\\theta}{2}=\\frac{1-\\cos 4\\theta}{4}$.",
      "$\\int_0^{\\pi/2}\\frac{1-\\cos 4\\theta}{4}d\\theta=\\frac{\\pi}{8}$ ($\\cos 4\\theta$ integrates to exactly $0$ over this range)."
    ],
    "trap": "When matching to Beta, setting $q$ to $3$ (just copying the denominator's exponent); it's $p+q=3$ that's right. Getting it wrong gives an unrelated value like $B(\\frac{3}{2},3)$.",
    "check": "Numerical integration: $\\int_0^\\infty\\frac{\\sqrt{x}}{(1+x)^3}dx\\approx 0.3927=\\frac{\\pi}{8}$."
  },
  "rel-boss-007": {
    "spot": "$J_0$ solves the order-zero Bessel equation $xy''+y'+xy=0$ with $y(0)=1$ and has only even powers; plugging in a power series and matching coefficients gives $c_{2k}=-\\frac{c_{2k-2}}{(2k)^2}$.",
    "why": "Knowing the formula $J_0(x)=\\sum\\frac{(-1)^k}{(k!)^2}\\left(\\frac{x}{2}\\right)^{2k}$ is fastest; if you forget it, derive the recursion from the equation — two steps reach $x^4$.",
    "steps": [
      "For a single term $x^m$: $x(x^m)''+(x^m)'=m^2x^{m-1}$; e.g. $m=2$ gives $4x$, $m=4$ gives $16x^3$.",
      "So the coefficient of $x^{2k-1}$: $(2k)^2c_{2k}+c_{2k-2}=0$, $c_{2k}=-\\frac{c_{2k-2}}{(2k)^2}$. With $c_0=1$ we get $c_2=-\\frac{1}{4}$.",
      "$c_4=-\\frac{c_2}{4^2}=\\frac{1}{64}$; check: plugging $y=1-\\frac{x^2}{4}+\\frac{x^4}{64}$ into the equation leaves only $\\frac{x^5}{64}$ (the next coefficient cancels it).",
      "So the coefficient of $x^4$ is $\\frac{1}{64}$, matching the formula $\\frac{1}{(2!)^2\\cdot 2^4}$."
    ],
    "trap": "Misremembering the formula as $\\frac{(-1)^k x^{2k}}{(2k)!}$ (confusing it with $\\cos x$) and getting $\\frac{1}{24}$; the Bessel denominator is $4^k(k!)^2$.",
    "check": "Integral representation $J_0(x)=\\frac{1}{\\pi}\\int_0^\\pi\\cos(x\\sin\\theta)d\\theta$: the $x^4$ coefficient $=\\frac{1}{24\\pi}\\int_0^\\pi\\sin^4\\theta\\,d\\theta=\\frac{1}{64}$."
  },
  "rel-boss-020": {
    "spot": "The numerator $1-\\cos z$ has a double zero at $0$ ($\\approx\\frac{z^2}{2}$) and the denominator is $z^3$: overall only a simple pole remains, with residue $=\\frac{1}{2}$.",
    "why": "Expanding as a Laurent series and reading off the $\\frac{1}{z}$ coefficient is faster than the higher-order pole formula (which needs derivatives).",
    "steps": [
      "$1-\\cos z=\\frac{z^2}{2}-\\frac{z^4}{24}+\\cdots$.",
      "Divide by $z^3$: $\\frac{1-\\cos z}{z^3}=\\frac{1}{2z}-\\frac{z}{24}+\\cdots$, a simple pole.",
      "The residue is the $\\frac{1}{z}$ coefficient, $\\frac{1}{2}$ (also equal to $\\lim_{z\\to 0}zf(z)$)."
    ],
    "trap": "Seeing $z^3$ in the denominator, treating it as a triple pole and looking for the $\\frac{1}{z^3}$ coefficient (getting $0$), or taking the value $0$ of $1-\\cos z$ at $0$ as the residue; the double zero in the numerator lowers the pole to order one, and the residue is the $\\frac{1}{z}$ coefficient.",
    "check": "Adding the residue $-\\frac{1}{2}$ of $\\frac{\\cos z}{z^3}$ should give the residue $0$ of $\\frac{1}{z^3}$: $\\frac{1}{2}+\\left(-\\frac{1}{2}\\right)=0$."
  },
  "rel-hard-cpx-002": {
    "spot": "$\\frac{\\cos z}{z^3}$: $\\cos z$ has only even powers, so after dividing by $z^3$ the $\\frac{1}{z}$ coefficient comes from the $z^2$ term of $\\cos z$, $-\\frac{1}{2}$.",
    "why": "The triple-pole formula means differentiating twice and dividing by $2!$; expanding and reading the coefficient is one step.",
    "steps": [
      "$\\cos z=1-\\frac{z^2}{2}+\\frac{z^4}{24}-\\cdots$.",
      "Divide by $z^3$: $\\frac{\\cos z}{z^3}=\\frac{1}{z^3}-\\frac{1}{2z}+\\frac{z}{24}-\\cdots$.",
      "Residue $=\\frac{1}{z}$-coefficient $=-\\frac{1}{2}$."
    ],
    "trap": "Taking the coefficient $1$ of $\\frac{1}{z^3}$ in the principal part as the residue; the residue is only the $\\frac{1}{z}$ term.",
    "check": "Triple-pole formula: $\\frac{1}{2!}\\frac{d^2}{dz^2}\\cos z\\Big|_0=\\frac{-\\cos 0}{2}=-\\frac{1}{2}$, consistent."
  },
  "world-019": {
    "spot": "Denominator $\\ln x$, numerator $x^2-1$ — replace the $2$ with a parameter $t$: $I(t)=\\int_0^1\\frac{x^t-1}{\\ln x}dx$; differentiating in $t$ cancels the $\\ln x$ exactly (Feynman's trick).",
    "why": "No elementary antiderivative; after differentiating under the parameter it becomes $\\int_0^1x^tdx=\\frac{1}{t+1}$, and you just integrate back.",
    "steps": [
      "$\\frac{\\partial}{\\partial t}\\frac{x^t-1}{\\ln x}=x^t$, so $I'(t)=\\int_0^1x^t\\,dx$.",
      "$I'(t)=\\frac{1}{t+1}$, and $I(0)=0$ (the numerator is $0$).",
      "$I(t)=\\ln(t+1)$, so the answer is $I(2)=\\int_0^2\\frac{dt}{t+1}=\\ln 3$."
    ],
    "trap": "Not using $I(0)=0$ to fix the constant and getting stuck at $\\ln(t+1)+C$; or answering $I(1)$ by mistake and getting $\\ln 2$.",
    "check": "Numerical integration: $\\int_0^1\\frac{x^2-1}{\\ln x}dx\\approx 1.0986=\\ln 3$."
  },
  "world-037": {
    "spot": "A Gaussian times $\\cos(2x)$: replace $2$ with a parameter $b$; differentiating $I(b)=\\int_0^\\infty e^{-x^2}\\cos bx\\,dx$ and integrating by parts brings back $I$ itself — a first-order differential equation.",
    "why": "You could also complete the square $e^{-(x-i)^2}$ and shift the contour, but that means handling a complex path; differentiating under the parameter stays real the whole way.",
    "steps": [
      "$I'(b)=-\\int_0^\\infty xe^{-x^2}\\sin bx\\,dx$; integration by parts (with $xe^{-x^2}=-\\frac{1}{2}(e^{-x^2})'$) gives $\\int_0^\\infty xe^{-x^2}\\sin bx\\,dx=\\frac{b}{2}I(b)$.",
      "So $I'=-\\frac{b}{2}I$ with $I(0)=\\frac{\\sqrt{\\pi}}{2}$, giving $I(b)=\\frac{\\sqrt{\\pi}}{2}e^{-b^2/4}$.",
      "The formula matches numerical integration for every $b$.",
      "Plug in $b=2$: $\\frac{\\sqrt{\\pi}}{2}e^{-1}$."
    ],
    "trap": "Writing the exponent as $e^{-b^2/2}$ or $e^{-b^2}$, which at $b=2$ gives $e^{-2}$ or $e^{-4}$; solving $I'=-\\frac{b}{2}I$ gives $e^{-b^2/4}$.",
    "check": "$\\cos 2x\\le 1$, so the answer must be less than $\\int_0^\\infty e^{-x^2}dx=\\frac{\\sqrt{\\pi}}{2}$: $\\frac{\\sqrt{\\pi}}{2e}\\approx 0.326<0.886$."
  },
  "world-045": {
    "spot": "$\\frac{\\cos x}{1+x^2}$ over the whole real line: the denominator has only one pole $z=i$ in the upper half-plane, and replacing $\\cos x$ by $e^{iz}$ decays in the upper half-plane — residue theorem.",
    "why": "No elementary antiderivative; write $\\cos x$ as $\\operatorname{Re}e^{ix}$, close with a large upper semicircle, and compute just one residue.",
    "steps": [
      "$\\frac{\\sin x}{1+x^2}$ is odd and integrates to $0$, so the integral $=\\int_{-\\infty}^\\infty\\frac{e^{ix}}{1+x^2}dx$.",
      "In the upper half-plane $|e^{iz}|=e^{-\\operatorname{Im}z}\\le 1$, so the integral over the semicircular arc of radius $R$ is at most $\\frac{\\pi R}{R^2-1}\\to 0$.",
      "The only pole is $z=i$: $\\operatorname{Res}=\\frac{e^{i\\cdot i}}{2i}=\\frac{e^{-1}}{2i}$; times $2\\pi i$ gives $\\frac{\\pi}{e}$.",
      "So $\\int_{-\\infty}^\\infty\\frac{\\cos x}{1+x^2}dx=\\frac{\\pi}{e}$."
    ],
    "trap": "Doing the contour integral with $\\cos z$ itself: in the upper half-plane $\\cos z$ blows up like $e^{\\operatorname{Im}z}$, so the big arc doesn't go to $0$. Switch to $e^{iz}$.",
    "check": "Fourier pair: $\\int_0^\\infty e^{-t}\\cos(xt)\\,dt=\\frac{1}{1+x^2}$, so the Fourier transform of $\\frac{1}{1+x^2}$ is $\\pi e^{-|a|}$, which at $a=1$ is exactly $\\frac{\\pi}{e}$."
  },
  "world-074": {
    "spot": "$\\binom{2n}{n}$ divided into $4^n$ with a $\\sqrt{n}$: in Stirling's formula the $(n/e)^n$ parts cancel against $4^n$ completely, leaving only the root factor $\\sqrt{\\pi}$.",
    "why": "The Wallis product works too, but you'd first rewrite it as an integral; Stirling just plugs into three factorials and cancels in one line.",
    "steps": [
      "Stirling: $n!\\sim\\sqrt{2\\pi n}\\left(\\frac{n}{e}\\right)^n$ (already under $1\\%$ error at $n=10$).",
      "$(2n)!\\sim\\sqrt{4\\pi n}\\left(\\frac{2n}{e}\\right)^{2n}$ and $(n!)^2\\sim 2\\pi n\\left(\\frac{n}{e}\\right)^{2n}$; dividing gives $\\binom{2n}{n}\\sim\\frac{4^n}{\\sqrt{\\pi n}}$.",
      "Substitute back: $\\frac{4^n}{\\sqrt{n}\\cdot\\frac{4^n}{\\sqrt{\\pi n}}}=\\frac{\\sqrt{\\pi n}}{\\sqrt{n}}=\\sqrt{\\pi}$."
    ],
    "trap": "Thinking $\\binom{2n}{n}\\approx 4^n$ (as if the binomial coefficients were split evenly), getting $\\frac{1}{\\sqrt{n}}\\to 0$; the central term is only a $\\frac{1}{\\sqrt{\\pi n}}$ fraction of $4^n$, which the $\\sqrt{n}$ exactly makes up for.",
    "check": "Compute at $n=10$: $\\frac{4^{10}}{\\sqrt{10}\\binom{20}{10}}=\\frac{1048576}{\\sqrt{10}\\cdot 184756}\\approx 1.795$, about $1\\%$ above $\\sqrt{\\pi}\\approx 1.772$ (the correction term is about $\\frac{1}{8n}$)."
  },
  "world-075": {
    "spot": "$\\frac{1}{n^2(n+1)}$ is rational: partial fractions give $\\frac{1}{n^2}-\\frac{1}{n}+\\frac{1}{n+1}$; the last two terms telescope and the first is $\\zeta(2)$.",
    "why": "The Comparison Test only says it converges; to get the sum you have to split it so what can cancel does, leaving the known $\\frac{\\pi^2}{6}$.",
    "steps": [
      "Partial fractions: $\\frac{1}{n^2(n+1)}=\\frac{1}{n^2}-\\frac{1}{n}+\\frac{1}{n+1}$.",
      "Paired together, the last two terms telescope: $\\sum_{n\\ge 1}\\left(\\frac{1}{n}-\\frac{1}{n+1}\\right)=1$.",
      "So the sum $=\\sum\\frac{1}{n^2}-1=\\frac{\\pi^2}{6}-1$."
    ],
    "trap": "After splitting, summing $\\sum\\frac{1}{n}$ and $\\sum\\frac{1}{n+1}$ separately — both diverge, giving $\\infty-\\infty$; keep them paired inside one sum so they telescope.",
    "check": "The first term ($n=1$) is $\\frac{1}{2}$; the total $\\frac{\\pi^2}{6}-1\\approx 0.645$ is bigger than that but smaller than $\\frac{1}{2}+\\sum_{n\\ge 2}\\frac{1}{n^3}$."
  },
  "world-088": {
    "spot": "$\\frac{\\sin x}{x}$ has no elementary antiderivative and converges only conditionally — add a damping factor $e^{-tx}$ to get $I(t)$; differentiating in $t$ cancels the $x$ in the denominator (Feynman's trick).",
    "why": "Dealing with $\\frac{1}{x}$ directly is messy; after multiplying by $e^{-tx}$, $I'(t)=-\\int_0^\\infty e^{-tx}\\sin x\\,dx$ is a standard integral.",
    "steps": [
      "$I(t)=\\int_0^\\infty e^{-tx}\\frac{\\sin x}{x}dx$, $I'(t)=-\\int_0^\\infty e^{-tx}\\sin x\\,dx=-\\frac{1}{1+t^2}$.",
      "As $t\\to\\infty$, $I(t)\\to 0$, so $I(t)=\\frac{\\pi}{2}-\\arctan t$.",
      "Let $t\\to 0^+$: $\\int_0^\\infty\\frac{\\sin x}{x}dx=\\frac{\\pi}{2}$."
    ],
    "trap": "Giving $\\int_{-\\infty}^\\infty\\frac{\\sin x}{x}dx=\\pi$ as the answer; the integrand is even, so the half-line gets only half, $\\frac{\\pi}{2}$.",
    "check": "Partial integrals oscillate around $\\frac{\\pi}{2}$: $\\int_0^\\pi\\frac{\\sin x}{x}dx\\approx 1.852>\\frac{\\pi}{2}$, $\\int_0^{2\\pi}\\approx 1.418<\\frac{\\pi}{2}$."
  },
  "burst-boss-param-001": {
    "spot": "$e^{-ax}\\sin x$: exponential times trig, where integrating by parts twice brings back the original integral (the cyclic type); or write it as $\\operatorname{Im}\\int_0^\\infty e^{-(a-i)x}dx=\\operatorname{Im}\\frac{1}{a-i}$.",
    "why": "Complex exponentials give it in one line; the integration-by-parts route means solving an equation of the form $I=\\cdots-I$. Here we write out the antiderivative so every step can be checked.",
    "steps": [
      "Antiderivative: $\\frac{d}{dx}\\left[-\\frac{e^{-ax}(a\\sin x+\\cos x)}{a^2+1}\\right]=e^{-ax}\\sin x$.",
      "Upper limit: for $a>0$, $e^{-ax}\\to 0$, so the antiderivative tends to $0$; at the lower limit $x=0$ its value is $-\\frac{1}{a^2+1}$.",
      "$I(a)=0-\\left(-\\frac{1}{a^2+1}\\right)=\\frac{1}{a^2+1}$."
    ],
    "trap": "Confusing it with $\\int_0^\\infty e^{-ax}\\cos x\\,dx=\\frac{a}{a^2+1}$; $\\frac{1}{a-i}=\\frac{a+i}{a^2+1}$, the real part $\\frac{a}{a^2+1}$ goes with $\\cos$ and the imaginary part $\\frac{1}{a^2+1}$ with $\\sin$.",
    "check": "As $a\\to\\infty$ the decay is very fast and $\\sin x\\approx x$, so the integral $\\approx\\int_0^\\infty xe^{-ax}dx=\\frac{1}{a^2}$, the same order as $\\frac{1}{a^2+1}$."
  },
  "burst-rec-007": {
    "spot": "$G_n$ and $G_{n-1}$ differ by one power of $x$ — integration by parts turns $x^n$ into $nx^{n-1}$, and the boundary terms vanish at both $0$ and $\\infty$: it's the Gamma recursion.",
    "why": "No need to compute $G_n=n!$ and then divide; one integration by parts gives the ratio directly.",
    "steps": [
      "Integration by parts: $u=x^n$, $dv=e^{-x}dx$, $\\frac{d}{dx}(-x^ne^{-x})=x^ne^{-x}-nx^{n-1}e^{-x}$.",
      "Boundary term $[-x^ne^{-x}]_0^\\infty=0$ (the exponential beats the polynomial).",
      "So $G_n=nG_{n-1}$, and the ratio is $n$."
    ],
    "trap": "Writing the ratio as $n-1$ (mixing up the shift in $\\Gamma(n)=(n-1)!$); $G_n=\\Gamma(n+1)=n!$, and $\\frac{n!}{(n-1)!}=n$.",
    "check": "$n=3$: $G_3=6$, $G_2=2$, ratio $3$."
  },
  "der-078": {
    "spot": "$(1+i)$ has length $\\sqrt{2}$ and angle $\\frac{\\pi}{4}$: its fourth power has length $4$ and angle $\\pi$ — on the negative real axis.",
    "why": "In polar form, powers mean raising the length to the power and multiplying the angle; a binomial expansion to the fourth power works too, but you have to track powers of $i$.",
    "steps": [
      "$|1+i|=\\sqrt{2}$, argument $\\arctan 1=\\frac{\\pi}{4}$.",
      "Fourth power: length $(\\sqrt{2})^4=4$, argument $4\\cdot\\frac{\\pi}{4}=\\pi$.",
      "$(1+i)^4=4(\\cos\\pi+i\\sin\\pi)=-4$, so the real part is $-4$."
    ],
    "trap": "Thinking the $i^2$ parts can be ignored and computing $1^4+1^4=2$; or, after $(1+i)^2=2i$, computing $(2i)^2=4$ and forgetting $i^2=-1$.",
    "check": "Binomial: real part $=1-\\binom{4}{2}+1=1-6+1=-4$."
  },
  "ser-031": {
    "spot": "The general term $\\frac{1}{\\sqrt{n}}=\\frac{1}{n^{1/2}}$ is a $p$-series with $p=\\frac{1}{2}$, which is not more than $1$ — on the divergent side.",
    "why": "The $p$-series criterion gives the answer at a glance; if unsure, compare with the harmonic series.",
    "steps": [
      "The $p$-series $\\sum\\frac{1}{n^p}$ converges for $p>1$ and diverges for $p\\le 1$; here $p=\\frac{1}{2}$.",
      "Comparison: for $n\\ge 1$, $\\sqrt{n}\\le n$, so $\\frac{1}{\\sqrt{n}}\\ge\\frac{1}{n}$, and the harmonic series diverges.",
      "You can see it from partial sums too: each of the first $N$ terms is at least $\\frac{1}{\\sqrt{N}}$, so the sum is $\\ge\\sqrt{N}$, unbounded. The series diverges."
    ],
    "trap": "Seeing $\\frac{1}{\\sqrt{n}}\\to 0$ and saying it converges; terms going to $0$ is necessary, not sufficient.",
    "check": "Integral Test: $\\int_1^N\\frac{dx}{\\sqrt{x}}=2\\sqrt{N}-2\\to\\infty$."
  },
  "cx-arc-004": {
    "spot": "The derivative of $y=\\ln(\\cos x)$ is $-\\tan x$, and $1+\\tan^2x=\\sec^2x$ — the square root in the arc length formula cancels cleanly.",
    "why": "Arc length roots usually don't simplify; this one is designed so $\\sqrt{1+y'^2}=\\sec x$, and once you see it you're left with $\\int\\sec x\\,dx$.",
    "steps": [
      "$y'=\\frac{-\\sin x}{\\cos x}=-\\tan x$.",
      "$\\sqrt{1+y'^2}=\\sqrt{1+\\tan^2x}=|\\sec x|=\\sec x$ ($\\cos x>0$ for $0\\le x\\le\\frac{\\pi}{3}$).",
      "$\\int\\sec x\\,dx=\\ln|\\sec x+\\tan x|$.",
      "Plug in the limits: $\\ln(2+\\sqrt{3})-\\ln(1+0)=\\ln(2+\\sqrt{3})$."
    ],
    "trap": "Dropping the $1+$ from the arc length formula and integrating $\\int|y'|dx=\\int\\tan x\\,dx=\\ln 2$; that's only the change in $y$, not the length of the curve.",
    "check": "Arc length is at least the horizontal distance $\\frac{\\pi}{3}\\approx 1.047$; $\\ln(2+\\sqrt{3})\\approx 1.317$ is reasonable."
  },
  "cx-sa-003": {
    "spot": "Surface of revolution about the $x$-axis: $S=2\\pi\\int y\\sqrt{1+y'^2}\\,dx$; $y'=x^2$ makes the root $\\sqrt{1+x^4}$, and the $y=\\frac{x^3}{3}$ in front brings exactly an $x^3$ — substitute $u=1+x^4$.",
    "why": "Surface-area roots usually can't be integrated; the $x^3$ here is there to match $du=4x^3dx$, so substitute as soon as you see it.",
    "steps": [
      "$y'=x^2$, $\\sqrt{1+y'^2}=\\sqrt{1+x^4}$.",
      "$S=2\\pi\\int_0^1\\frac{x^3}{3}\\sqrt{1+x^4}\\,dx$.",
      "Let $u=1+x^4$: $\\int x^3\\sqrt{1+x^4}\\,dx=\\frac{1}{6}(1+x^4)^{3/2}$, which from $0$ to $1$ is $\\frac{2\\sqrt{2}-1}{6}$.",
      "$S=\\frac{2\\pi}{3}\\cdot\\frac{2\\sqrt{2}-1}{6}=\\frac{\\pi(2\\sqrt{2}-1)}{9}$."
    ],
    "trap": "Using the volume of revolution $\\pi\\int y^2dx$ instead of surface area, or dropping $\\sqrt{1+y'^2}$ and computing only $2\\pi\\int y\\,dx$, which gives $\\frac{\\pi}{6}$.",
    "check": "The curve is flat ($y'\\le 1$), so the root is between $1$ and $\\sqrt{2}$: $\\frac{\\pi}{6}<S<\\frac{\\sqrt{2}\\pi}{6}$."
  },
  "exam-int-014": {
    "spot": "Numerator and denominator have the same degree (both $x^2$): divide first, $\\frac{x^2}{x^2+1}=1-\\frac{1}{x^2+1}$, and what's left is the derivative of $\\arctan$.",
    "why": "Reducing an improper fraction to polynomial plus proper fraction is much faster than the trigonometric substitution $x=\\tan\\theta$.",
    "steps": [
      "Add and subtract one in the numerator: $\\frac{x^2}{x^2+1}=\\frac{(x^2+1)-1}{x^2+1}=1-\\frac{1}{x^2+1}$.",
      "$\\int 1\\,dx=x$, $\\int\\frac{dx}{x^2+1}=\\arctan x$.",
      "So the integral $=x-\\arctan x+C$."
    ],
    "trap": "Treating $\\frac{x^2}{x^2+1}$ as a $\\frac{u'}{u}$ form and writing $\\ln(x^2+1)$; that needs a numerator of $2x$.",
    "check": "For large $x$ the integrand is close to $1$, so the antiderivative should be roughly $x$ minus a constant $\\frac{\\pi}{2}$: that's exactly $x-\\arctan x$."
  },
  "exam-lim-011": {
    "spot": "Both base and exponent contain $x$, and it's a $0^0$ form — write $x^x=e^{x\\ln x}$ so the problem becomes $x\\ln x$ in the exponent.",
    "why": "You can't just plug into a variable power; taking logs (writing it as a power of $e$) is the standard move for $0^0$, $1^\\infty$, $\\infty^0$.",
    "steps": [
      "$x^x=e^{x\\ln x}$ ($x>0$).",
      "$x\\ln x=\\frac{\\ln x}{1/x}$ is $\\frac{-\\infty}{\\infty}$; L'Hôpital's Rule: $\\frac{1/x}{-1/x^2}=-x\\to 0$.",
      "The exponential is continuous, so $x^x\\to e^0=1$."
    ],
    "trap": "Saying any power of $0$ is $0$ and answering $0$, or saying anything to the $0$ is $1$ and writing $1$ without justification; $0^0$ is an indeterminate form, and you actually need the limit of $x\\ln x$.",
    "check": "Plug in $x=0.001$: $0.001^{0.001}=e^{-0.0069}\\approx 0.9931$, approaching $1$ from below."
  },
  "exam-lim-019": {
    "spot": "$\\ln(x+1)-\\ln x=\\ln\\left(1+\\frac{1}{x}\\right)$, times $x$ — let $u=\\frac{1}{x}$ and it's the standard limit $\\frac{\\ln(1+u)}{u}\\to 1$.",
    "why": "Combining with log rules first immediately turns $\\infty\\cdot 0$ into a known standard limit, cleaner than going straight to L'Hôpital's Rule.",
    "steps": [
      "Combine: $\\ln(x+1)-\\ln x=\\ln\\left(1+\\frac{1}{x}\\right)$.",
      "Let $u=\\frac{1}{x}\\to 0^+$: the expression $=\\frac{\\ln(1+u)}{u}$.",
      "$\\frac{\\ln(1+u)}{u}\\to 1$."
    ],
    "trap": "Seeing $\\ln(x+1)-\\ln x\\to 0$ and saying the whole thing is $0$; the factor in front is $x\\to\\infty$, and $\\infty\\cdot 0$ is an indeterminate form.",
    "check": "This is really the log of $\\left(1+\\frac{1}{x}\\right)^x\\to e$: $\\ln e=1$. Plugging in $x=1000$ gives about $0.9995$."
  },
  "exam-ser-001": {
    "spot": "Coefficients $\\frac{n}{3^n}$: a polynomial factor like $n$ doesn't affect the radius; $3^n$ decides it — the Ratio Test gives $\\frac{|x|}{3}<1$.",
    "why": "With an exponential factor in the coefficients the Ratio Test is most direct; the Root Test works too, but you need $\\sqrt[n]{n}\\to 1$.",
    "steps": [
      "Coefficient ratio: $\\frac{a_{n+1}}{a_n}=\\frac{n+1}{3^{n+1}}\\cdot\\frac{3^n}{n}=\\frac{n+1}{3n}\\to\\frac{1}{3}$.",
      "Convergence requires $\\frac{|x|}{3}<1$, i.e. $|x|<3$; the $n$-th root of the polynomial factor $n$ tends to $1$, so it doesn't change the radius.",
      "Radius of convergence $R=\\frac{1}{1/3}=3$."
    ],
    "trap": "Taking the limit of the ratio, $\\frac{1}{3}$, as the radius; the radius is its reciprocal, $3$.",
    "check": "At the endpoint $x=3$ the general term becomes $n$, which doesn't go to $0$, so it diverges — but that only affects the endpoints of the interval of convergence; the radius is still $3$."
  },
  "lim-013": {
    "spot": "$\\tan x$ and $\\sin x$ both have linear term $x$, so subtracting kills it, and the denominator is $x^3$ — expand both to $x^3$.",
    "why": "L'Hôpital's Rule needs three derivatives, and higher derivatives of $\\tan$ are ugly; expansion is one line, or factoring out $\\tan x(1-\\cos x)$ is even faster.",
    "steps": [
      "$\\tan x=x+\\frac{x^3}{3}+\\cdots$.",
      "$\\sin x=x-\\frac{x^3}{6}+\\cdots$.",
      "Subtract: $\\tan x-\\sin x=\\left(\\frac{1}{3}+\\frac{1}{6}\\right)x^3+\\cdots=\\frac{x^3}{2}+\\cdots$; dividing by $x^3$ gives $\\frac{1}{2}$."
    ],
    "trap": "Replacing $\\tan x\\sim x$ and $\\sin x\\sim x$ directly, getting numerator $0$ and answering $0$; equivalent infinitesimals can't be substituted like that inside a difference.",
    "check": "Factor: $\\tan x-\\sin x=\\tan x(1-\\cos x)\\approx x\\cdot\\frac{x^2}{2}$, again giving $\\frac{1}{2}$."
  },
  "ode-sep-002": {
    "spot": "$y'=2xy$: the right side is (only $x$) times (only $y$) — separable: $\\frac{dy}{y}=2x\\,dx$.",
    "why": "You could also treat it as a first-order linear equation with an integrating factor, but separating and integrating each side once is faster.",
    "steps": [
      "Separate: $\\frac{dy}{y}=2x\\,dx$.",
      "Integrate both sides: $\\ln|y|=x^2+C$, so $y=Ae^{x^2}$.",
      "Use $y(0)=1$: $A\\cdot e^0=1$, $A=1$, $y=e^{x^2}$."
    ],
    "trap": "Turning $\\ln|y|=x^2+C$ into $y=e^{x^2}+C$ (constant added outside); here $y(0)=1$ happens to give $C=0$, but with another initial value it's wrong — and $e^{x^2}+C$ doesn't even satisfy the equation.",
    "check": "Substitute back: $y'=2xe^{x^2}=2x\\cdot y$, and $y(0)=1$."
  },
  "der-059": {
    "spot": "Wronskian $W(f,g)=\\begin{vmatrix}f&g\\\\f'&g'\\end{vmatrix}=fg'-gf'$; the derivatives of $\\sin$ and $\\cos$ swap, so the result is $-(\\sin^2+\\cos^2)$.",
    "why": "Just fill in the $2\\times 2$ determinant; the Pythagorean identity makes the answer a constant.",
    "steps": [
      "$(\\sin x)'=\\cos x$, $(\\cos x)'=-\\sin x$.",
      "$W=\\sin x\\cdot(-\\sin x)-\\cos x\\cdot\\cos x=-(\\sin^2x+\\cos^2x)$.",
      "$=-1$."
    ],
    "trap": "Writing the determinant as $f'g-fg'$ (reversed order) and getting $+1$. The first row is the functions, the second the derivatives: main diagonal $fg'$ minus the other diagonal $gf'$.",
    "check": "$W\\ne 0$, so $\\sin x$ and $\\cos x$ are linearly independent (a fundamental set for $y''+y=0$); and $W$ is constant, consistent with Abel's formula (the $y'$ coefficient is $0$)."
  },
  "der-061": {
    "spot": "Wronskian $W(f,g)=fg'-gf'$; both are exponentials, so the product is $e^{3x}$ times the difference of the exponent coefficients, $2-1$.",
    "why": "Fill in the $2\\times 2$ determinant directly; remembering $W(e^{ax},e^{bx})=(b-a)e^{(a+b)x}$ is even faster.",
    "steps": [
      "$(e^x)'=e^x$, $(e^{2x})'=2e^{2x}$.",
      "$W=e^x\\cdot 2e^{2x}-e^{2x}\\cdot e^x=2e^{3x}-e^{3x}$.",
      "$=e^{3x}$."
    ],
    "trap": "Computing only the main diagonal and getting $2e^{3x}$, or reversing the order and getting $-e^{3x}$.",
    "check": "Formula $W(e^{ax},e^{bx})=(b-a)e^{(a+b)x}$ with $a=1$, $b=2$: $(2-1)e^{3x}$."
  },
  "exam-lim-015": {
    "spot": "As $x\\to 0$, $\\sin x\\to 0$, so $e^{\\sin x}-1\\sim\\sin x\\sim x$ — chain two standard limits.",
    "why": "You could also view it as the derivative of $e^{\\sin x}$ at $0$; splitting into two standard limits takes the least thought.",
    "steps": [
      "Split: $\\frac{e^{\\sin x}-1}{x}=\\frac{e^{\\sin x}-1}{\\sin x}\\cdot\\frac{\\sin x}{x}$.",
      "Let $u=\\sin x\\to 0$: $\\frac{e^u-1}{u}\\to 1$; and $\\frac{\\sin x}{x}\\to 1$.",
      "So the limit $=1\\cdot 1=1$."
    ],
    "trap": "Expanding $e^{\\sin x}$ as if it were a product like $e^x\\sin x$, or thinking $e^{\\sin x}-1\\to e-1$; $\\sin 0=0$, so $e^{\\sin 0}=1$.",
    "check": "Derivative definition: this is the derivative of $f(x)=e^{\\sin x}$ at $0$, $f'(0)=\\cos 0\\cdot e^0=1$."
  },
  "gap-ser-lc-001": {
    "spot": "The general term is rational with top degree $n^2$ over $n^3$: for large $n$ it behaves like $\\frac{3}{n}$ — Limit Comparison Test against the harmonic series.",
    "why": "For a rational term, the leading terms tell you the behavior; the Limit Comparison Test turns that intuition into a proof.",
    "steps": [
      "Take $b_n=\\frac{1}{n}$: $\\frac{a_n}{b_n}=\\frac{3n^3+n}{n^3+2}\\to 3$.",
      "The limit is a finite positive number $3$, so $\\sum a_n$ and $\\sum\\frac{1}{n}$ behave the same; the harmonic series diverges.",
      "So this series diverges."
    ],
    "trap": "Seeing the general term $\\to 0$ and calling it convergent; decay like $\\frac{3}{n}$ is too slow, and the sum is unbounded.",
    "check": "Direct comparison works too: $3n^3+n>n^3+2$ ($n\\ge 1$), so $a_n>\\frac{1}{n}$, bigger than the harmonic series."
  },
  "lim-012": {
    "spot": "The numerator is $\\ln(1+x)$ minus the first two terms of its expansion, $x-\\frac{x^2}{2}$, over $x^3$: subtract that many terms and expand to the next one — the answer is the $x^3$ coefficient.",
    "why": "L'Hôpital's Rule needs three derivatives; the expansion reads off the coefficient $\\frac{1}{3}$ in one line.",
    "steps": [
      "Plug in $x=0$: numerator $\\ln 1-0+0=0$, so it's $\\frac{0}{0}$.",
      "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\cdots$.",
      "Removing the first two terms leaves $\\frac{x^3}{3}-\\cdots$; dividing by $x^3$ gives $\\frac{1}{3}$."
    ],
    "trap": "Using the $e^x$ coefficient $\\frac{1}{3!}=\\frac{1}{6}$; the coefficients of $\\ln(1+x)$ are $\\frac{(-1)^{n+1}}{n}$, with no factorial.",
    "check": "Plug in $x=0.01$: the ratio is about $0.3325$, slightly below $\\frac{1}{3}$ (next term $-\\frac{x}{4}$)."
  },
  "mob-gamma-002": {
    "spot": "$\\Gamma(\\frac{1}{2})=\\int_0^\\infty t^{-1/2}e^{-t}dt$: $t^{-1/2}$ with $dt$ — setting $t=u^2$ cancels it exactly and leaves the Gaussian integral.",
    "why": "Every half-integer Gamma value is built up from this one, and it's just the Gaussian integral in disguise.",
    "steps": [
      "Definition: $\\Gamma(s)=\\int_0^\\infty t^{s-1}e^{-t}dt$; at $s=\\frac{1}{2}$ the integrand is $t^{-1/2}e^{-t}$.",
      "Let $t=u^2$, $dt=2u\\,du$: $t^{-1/2}e^{-t}dt=2e^{-u^2}du$.",
      "Gaussian integral: $\\left(\\int_0^\\infty e^{-u^2}du\\right)^2=\\frac{\\pi}{4}$ (polar coordinates), so $\\int_0^\\infty e^{-u^2}du=\\frac{\\sqrt{\\pi}}{2}$.",
      "$\\Gamma(\\frac{1}{2})=2\\cdot\\frac{\\sqrt{\\pi}}{2}=\\sqrt{\\pi}$."
    ],
    "trap": "Using the whole-line Gaussian value $\\sqrt{\\pi}$ and then also multiplying by $2$, getting $2\\sqrt{\\pi}$; after the substitution the range is $u\\ge 0$, only half.",
    "check": "Recursion $\\Gamma(\\frac{3}{2})=\\frac{1}{2}\\Gamma(\\frac{1}{2})$: numerically, $\\int_0^\\infty t^{1/2}e^{-t}dt$ is exactly $\\frac{\\sqrt{\\pi}}{2}$."
  }
};
