// Detail v2, English — batch 005. Translation of tools/content/detail/005.js (text only; claims live in the Chinese file).
module.exports = {
  "mob-gamma-006": {
    "spot": "Upper limit $\\infty$ and an integrand of the form power of $x$ times $e^{-x}$ — that's exactly the Gamma function $\\Gamma(s)=\\int_0^\\infty x^{s-1}e^{-x}\\,dx$, here with $s-1=2$.",
    "why": "Recognizing $\\Gamma(3)=2!$ finishes it in one line; brute-force integration by parts takes two rounds plus a limit at the $\\infty$ end.",
    "steps": [
      "Match the definition: $x^2=x^{s-1}$, so $s=3$ and the integral is $\\Gamma(3)$.",
      "Integration by parts gives the recursion $\\Gamma(s+1)=s\\,\\Gamma(s)$, and $\\Gamma(1)=\\int_0^\\infty e^{-x}dx=1$, so $\\Gamma(n+1)=n!$.",
      "Direct check: $\\frac{d}{dx}\\left[-(x^2+2x+2)e^{-x}\\right]=x^2e^{-x}$; plugging in the limits gives $0-(-2)=2$.",
      "$\\Gamma(3)=2!=2$."
    ],
    "trap": "Matching $x^2$ to $\\Gamma(2)$ and answering $1$: the Gamma exponent is $s-1$, so $x^2$ corresponds to $s=3$.",
    "check": "Pattern $\\int_0^\\infty x^ne^{-x}dx=n!$: for $n=3$ it should be $6$, and it is."
  },
  "mob-gamma-007": {
    "spot": "$x^{1/2}e^{-x}$ from $0$ to $\\infty$: Gamma function with $s-1=\\frac{1}{2}$, so it's $\\Gamma\\left(\\frac{3}{2}\\right)$ — a half-integer, so $\\sqrt{\\pi}$ will show up.",
    "why": "Using $\\Gamma(s+1)=s\\Gamma(s)$ to step down to $\\Gamma\\left(\\frac{1}{2}\\right)=\\sqrt{\\pi}$ is fastest; you can't find an elementary antiderivative (it's the error function).",
    "steps": [
      "$x^{1/2}=x^{s-1}$, $s=\\frac{3}{2}$, so the integral is $\\Gamma\\left(\\frac{3}{2}\\right)=\\frac{1}{2}\\Gamma\\left(\\frac{1}{2}\\right)$.",
      "Substituting $x=u^2$ ($dx=2u\\,du$) into $\\Gamma\\left(\\frac{1}{2}\\right)$ turns it into $2\\int_0^\\infty e^{-u^2}du$, the Gaussian integral.",
      "$\\int_0^\\infty e^{-u^2}du=\\frac{\\sqrt{\\pi}}{2}$, so $\\Gamma\\left(\\frac{1}{2}\\right)=\\sqrt{\\pi}$.",
      "$\\Gamma\\left(\\frac{3}{2}\\right)=\\frac{1}{2}\\sqrt{\\pi}=\\frac{\\sqrt{\\pi}}{2}$."
    ],
    "trap": "Misremembering $\\Gamma\\left(\\frac{1}{2}\\right)$ as $\\frac{\\sqrt{\\pi}}{2}$, which leads to $\\frac{\\sqrt{\\pi}}{4}$. $\\frac{\\sqrt{\\pi}}{2}$ is the half-line Gaussian integral; $\\Gamma\\left(\\frac{1}{2}\\right)$ is the full $\\sqrt{\\pi}$.",
    "check": "The answer is about $0.886$, less than $\\Gamma(1)=\\Gamma(2)=1$ — between $1$ and $2$ Gamma dips and comes back up, bottoming out near $0.8856$, and $\\Gamma\\left(\\frac{3}{2}\\right)$ sits right next to the bottom."
  },
  "mob-gamma-009": {
    "spot": "$\\frac{7}{2}$ is a half-integer: use $\\Gamma(s+1)=s\\Gamma(s)$ to step all the way down to $\\Gamma\\left(\\frac{1}{2}\\right)=\\sqrt{\\pi}$, picking up a factor at each step.",
    "why": "Three steps of the recursion reach the bottom — much cleaner than integrating $\\int_0^\\infty x^{5/2}e^{-x}dx$ by parts three times.",
    "steps": [
      "Definition: $\\Gamma\\left(\\frac{7}{2}\\right)=\\int_0^\\infty x^{5/2}e^{-x}\\,dx$.",
      "Step down: $\\Gamma\\left(\\frac{7}{2}\\right)=\\frac{5}{2}\\Gamma\\left(\\frac{5}{2}\\right)=\\frac{5}{2}\\cdot\\frac{3}{2}\\Gamma\\left(\\frac{3}{2}\\right)$.",
      "Again: $\\Gamma\\left(\\frac{3}{2}\\right)=\\frac{1}{2}\\Gamma\\left(\\frac{1}{2}\\right)=\\frac{\\sqrt{\\pi}}{2}$.",
      "Multiply: $\\frac{5}{2}\\cdot\\frac{3}{2}\\cdot\\frac{1}{2}\\sqrt{\\pi}=\\frac{15\\sqrt{\\pi}}{8}$."
    ],
    "trap": "Starting the product at $\\frac{7}{2}$ ($\\frac{7}{2}\\cdot\\frac{5}{2}\\cdot\\frac{3}{2}\\cdots$): $\\Gamma(s)=(s-1)\\Gamma(s-1)$, so the first factor is $\\frac{5}{2}$, not $\\frac{7}{2}$.",
    "check": "The answer is about $3.32$, between $\\Gamma(3)=2$ and $\\Gamma(4)=6$ — reasonable."
  },
  "mob-gamma-010": {
    "spot": "$\\Gamma(0+1)$ is just $\\Gamma(1)$; since $\\Gamma(n+1)=n!$, the question is really asking for $0!$.",
    "why": "The integral for $\\Gamma(1)$ is the simplest one, $\\int_0^\\infty e^{-x}dx$ — just compute it, and see along the way why $0!=1$.",
    "steps": [
      "Definition $\\Gamma(s)=\\int_0^\\infty x^{s-1}e^{-x}\\,dx$; at $s=1$, $x^0=1$, leaving $\\int_0^\\infty e^{-x}\\,dx$.",
      "Antiderivative $-e^{-x}$; as $x\\to\\infty$, $-e^{-x}\\to 0$, and the lower limit gives $-1$.",
      "$0-(-1)=1$, so $\\Gamma(1)=0!=1$."
    ],
    "trap": "Seeing $0$ and answering $0$: $\\Gamma(n+1)=n!$, and $0!=1$.",
    "check": "The recursion $\\Gamma(2)=1\\cdot\\Gamma(1)$ should also be $1$: $\\int_0^\\infty xe^{-x}dx=1$."
  },
  "rel-adv-019": {
    "spot": "The coefficients $a_n=\\frac{1}{n^2}$ are purely polynomial, with no $c^n$: polynomial factors don't affect the radius, so the answer is $1$ at a glance.",
    "why": "The Ratio Test is smoothest for coefficients like these: $\\frac{(n+1)^2}{n^2}\\to 1$; the Root Test needs $n^{2/n}$, which is more roundabout.",
    "steps": [
      "$\\left|\\frac{a_n}{a_{n+1}}\\right|=\\frac{(n+1)^2}{n^2}=\\left(1+\\frac{1}{n}\\right)^2$.",
      "As $n\\to\\infty$, $\\left(1+\\frac{1}{n}\\right)^2\\to 1$.",
      "Radius of convergence $R=\\lim\\left|\\frac{a_n}{a_{n+1}}\\right|=1$."
    ],
    "trap": "Getting spooked by the $n^2$ in the denominator and thinking the radius grows (answering $2$ or $\\infty$, say): $n^2$ only affects whether the endpoints converge, not the radius.",
    "check": "Endpoint $x=1$: $\\sum\\frac{1}{n^2}=\\frac{\\pi^2}{6}$ converges; just beyond, at $x=1.1$, the $100$-th term $\\frac{1.1^{100}}{10^4}$ is already bigger than $1$, so it must diverge."
  },
  "rel-hard-int-011": {
    "spot": "Numerator $x$, denominator with $x^4=(x^2)^2$: the numerator is exactly half the derivative of $x^2$, so $u=x^2$ turns it into $\\frac{1}{u^2+1}$.",
    "why": "One substitution gives $\\arctan$; forcing partial fractions on $x^4+1$ needs four complex roots — wasted effort.",
    "steps": [
      "Let $u=x^2$, $du=2x\\,dx$; the limits go $0\\to 0$, $\\infty\\to\\infty$.",
      "The integral becomes $\\frac{1}{2}\\int_0^\\infty\\frac{du}{u^2+1}$.",
      "$\\int_0^\\infty\\frac{du}{u^2+1}=\\arctan u\\Big|_0^\\infty=\\frac{\\pi}{2}$.",
      "Multiply by $\\frac{1}{2}$ to get $\\frac{\\pi}{4}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ in $dx=\\frac{du}{2x}$ when substituting, answering $\\frac{\\pi}{2}$.",
    "check": "Integrating only up to $1$ gives $\\frac{1}{2}\\arctan 1=\\frac{\\pi}{8}$, exactly half — by the $u\\to\\frac{1}{u}$ symmetry, $[0,1]$ and $[1,\\infty)$ each contribute half."
  },
  "burst-boss-lim-004": {
    "spot": "The numerator is $e^{\\sin x}$ minus $1+x+\\frac{x^2}{2}$, over $x^4$: a Taylor expansion of a composite function, carried all the way to $x^4$ — and the $-\\frac{x^3}{6}$ from $\\sin x$ gets mixed in.",
    "why": "L'Hôpital's Rule would mean differentiating $e^{\\sin x}$ four times, with the Product Rule blowing up each time; substituting $s=\\sin x$ into the expansion of $e^s$ only requires tracking terms up to $x^4$.",
    "steps": [
      "Inner function: $s=\\sin x=x-\\frac{x^3}{6}+O(x^5)$.",
      "Powers needed: $s^2=x^2-\\frac{x^4}{3}+\\cdots$, $s^3=x^3+O(x^5)$, $s^4=x^4+\\cdots$.",
      "Substitute into $e^s=1+s+\\frac{s^2}{2}+\\frac{s^3}{6}+\\frac{s^4}{24}+\\cdots$: the $x^3$ coefficient is $-\\frac{1}{6}+\\frac{1}{6}=0$ (compared with $e^x$, the $\\frac{x^3}{6}$ term is missing).",
      "The $x^4$ coefficient: $-\\frac{1}{6}$ from $\\frac{s^2}{2}$ and $\\frac{1}{24}$ from $\\frac{s^4}{24}$, total $-\\frac{4}{24}+\\frac{1}{24}=-\\frac{1}{8}$.",
      "Numerator $=-\\frac{x^4}{8}+\\cdots$; dividing by $x^4$ gives $-\\frac{1}{8}$."
    ],
    "trap": "Copying the expansion of $e^x$ (thinking $e^{\\sin x}\\approx e^x$) gives a numerator starting with $\\frac{x^3}{6}$ and a limit of $\\infty$; missing the $-\\frac{x^4}{6}$ inside $\\frac{s^2}{2}$ gives $\\frac{1}{24}$.",
    "check": "Plug in $x=0.1$: the ratio is about $-0.132$ — negative and close to $-0.125$ (the next term adds a correction in $x$)."
  },
  "burst-boss-ser-001": {
    "spot": "$\\frac{n^3}{2^n}$ is polynomial times geometric: start from $\\sum x^n=\\frac{1}{1-x}$; each application of $x\\frac{d}{dx}$ multiplies by another $n$. Do it three times, then plug in $x=\\frac{1}{2}$.",
    "why": "Differentiating a generating function is the standard tool for sums like this; shifting and subtracting would take three layers and is easy to get wrong.",
    "steps": [
      "$\\sum_{n\\ge1} nx^n=x\\frac{d}{dx}\\frac{1}{1-x}=\\frac{x}{(1-x)^2}$; at $\\frac{1}{2}$ this is $2$.",
      "Again: $\\sum n^2x^n=x\\frac{d}{dx}\\frac{x}{(1-x)^2}=\\frac{x(1+x)}{(1-x)^3}$; at $\\frac{1}{2}$ this is $6$.",
      "Third time: $\\sum n^3x^n=x\\frac{d}{dx}\\frac{x(1+x)}{(1-x)^3}=\\frac{x(1+4x+x^2)}{(1-x)^4}$.",
      "Plug in $x=\\frac{1}{2}$: $\\frac{\\frac{1}{2}\\left(1+2+\\frac{1}{4}\\right)}{\\frac{1}{16}}=8\\cdot\\frac{13}{4}=26$."
    ],
    "trap": "Only differentiating each time and forgetting to multiply by $x$: $\\frac{d}{dx}$ gives $\\sum n x^{n-1}$, with the power dropped by one, so plugging in $\\frac{1}{2}$ is off by a factor of $2$.",
    "check": "The first few terms $\\frac{1}{2}+\\frac{8}{4}+\\frac{27}{8}+\\frac{64}{16}=9.875$, and plenty more gets added after that; the first $20$ terms already exceed $25.9$ but stay below $26$."
  },
  "db-ext-005": {
    "spot": "The domain $x>0$ is open, and near $0$ the function $x^2\\ln x$ is $0\\cdot(-\\infty)$: the minimum must be at a point where $f'=0$ — and remember to check the behavior at both ends.",
    "why": "One application of the Product Rule factors as $x(2\\ln x+1)$, giving a single critical point; the end behavior then confirms it's the global min.",
    "steps": [
      "$f'(x)=2x\\ln x+x^2\\cdot\\frac{1}{x}=x(2\\ln x+1)$.",
      "Since $x>0$, $f'=0\\iff\\ln x=-\\frac{1}{2}$, $x=e^{-1/2}$; $f'<0$ to the left and $f'>0$ to the right, so it's a local min.",
      "Ends: as $x\\to 0^+$, $x^2\\ln x\\to 0$, and as $x\\to\\infty$ it $\\to\\infty$; the only local min is the global min.",
      "$f\\left(e^{-1/2}\\right)=e^{-1}\\cdot\\left(-\\frac{1}{2}\\right)=-\\frac{1}{2e}$."
    ],
    "trap": "After solving $2\\ln x+1=0$ to get $x=e^{-1/2}$, giving $x$ itself (about $0.607$) as the answer; the question asks for the minimum value $f(x)$.",
    "check": "$x=0.5$: $0.25\\ln 0.5\\approx-0.173$, which is bigger than $-\\frac{1}{2e}\\approx-0.184$ — nothing smaller."
  },
  "db-opt-005": {
    "spot": "One fixed quantity (volume $16\\pi$) and one to minimize (surface area): use the fixed one to write $h$ in terms of $r$, so the surface area becomes a one-variable $S(r)$, then differentiate.",
    "why": "Once $h$ is eliminated it's a one-variable function, and $S'(r)=0$ immediately gives $r^3=8$; Lagrange multipliers work too, but they're overkill here.",
    "steps": [
      "$\\pi r^2h=16\\pi\\Rightarrow h=\\frac{16}{r^2}$.",
      "A closed can has a top and a bottom: $S=2\\pi r^2+2\\pi rh=2\\pi r^2+\\frac{32\\pi}{r}$.",
      "$S'(r)=4\\pi r-\\frac{32\\pi}{r^2}=0\\Rightarrow r^3=8$, $r=2$, and then $h=4$.",
      "$S(2)=8\\pi+16\\pi=24\\pi$."
    ],
    "trap": "Counting only one end ($\\pi r^2+2\\pi rh$) gives $r^3=16$ and the wrong area; the problem says closed, so both top and bottom count.",
    "check": "The best can has $h=4=2r$: height equals diameter, the classic result for a closed cylinder. Trying $r=1.8$ or $r=2.2$ gives a surface area larger than $24\\pi$."
  },
  "der-076": {
    "spot": "$(x+iy)^3$ is a binomial cube, and the key is the cycle of powers of $i$: $i^2=-1$, $i^3=-i$. The imaginary part is the terms with an odd number of $i$'s.",
    "why": "Expanding the four terms and splitting real and imaginary parts is the safest; polar form $r^3\\sin 3\\theta$ works too, but then you have to convert back to $x,y$.",
    "steps": [
      "Binomial: $(x+iy)^3=x^3+3x^2(iy)+3x(iy)^2+(iy)^3$.",
      "$(iy)^2=-y^2$, $(iy)^3=-iy^3$, which rearranges to $\\left(x^3-3xy^2\\right)+i\\left(3x^2y-y^3\\right)$.",
      "The imaginary part is the coefficient of $i$: $3x^2y-y^3$."
    ],
    "trap": "Taking $(iy)^3$ as $+iy^3$ and getting $3x^2y+y^3$; $i^3=-i$, so that term flips sign.",
    "check": "Polar check: on the unit circle $x=\\cos t$, $y=\\sin t$, the imaginary part should be $\\sin 3t$. Take $t=0.4$."
  },
  "der-088": {
    "spot": "Harmonic means checking whether $u_{xx}+u_{yy}$ is $0$. $x^3-3xy^2$ is exactly the real part of $(x+iy)^3$, and the real part of an analytic function is always harmonic.",
    "why": "Computing the two second partials directly is fastest; seeing it as the real part of $z^3$ tells you the answer at a glance.",
    "steps": [
      "$u_x=3x^2-3y^2$, $u_{xx}=6x$.",
      "$u_y=-6xy$, $u_{yy}=-6x$.",
      "$u_{xx}+u_{yy}=6x-6x=0$, so $u$ is harmonic."
    ],
    "trap": "Computing $u_{yy}$ as $-6y$ (differentiating away the $x$ too when differentiating twice in $y$): $x$ is a constant for partial derivatives in $y$.",
    "check": "Contrast: $x^3+3xy^2$ has $u_{xx}+u_{yy}=12x\\ne 0$, so it's not harmonic — the coefficient $-3$ is what matters."
  },
  "exam-der-007": {
    "spot": "$e^{x^2}$ is a composite function; the first derivative via the Chain Rule produces a factor $2x$, so the second derivative becomes the derivative of a product.",
    "why": "First get $f'=2xe^{x^2}$, then apply the Product Rule; no special formulas needed.",
    "steps": [
      "First derivative: outer $e^u$, inner $u=x^2$, $f'=2xe^{x^2}$.",
      "Second derivative: $(2x)'e^{x^2}+2x\\left(e^{x^2}\\right)'=2e^{x^2}+2x\\cdot 2xe^{x^2}$.",
      "Combine: $f''=(2+4x^2)e^{x^2}$."
    ],
    "trap": "In the second derivative, differentiating only $e^{x^2}$ and forgetting to differentiate $2x$ too, getting $4x^2e^{x^2}$ and missing $2e^{x^2}$.",
    "check": "$x=0$: $e^{x^2}=1+x^2+\\cdots$, so the second derivative should be $2$."
  },
  "exam-der-014": {
    "spot": "The upper limit is $x^2$, not $x$: the Fundamental Theorem of Calculus plus one layer of Chain Rule — plug the upper limit into the integrand, then multiply by the derivative of the upper limit.",
    "why": "$e^{t^2}$ has no elementary antiderivative, so you can't integrate first and differentiate after; the Fundamental Theorem skips the integration entirely.",
    "steps": [
      "Let $G(u)=\\int_0^u e^{t^2}dt$; the Fundamental Theorem gives $G'(u)=e^{u^2}$.",
      "We want $G(x^2)$; by the Chain Rule, $\\frac{d}{dx}G(x^2)=G'(x^2)\\cdot 2x$.",
      "$G'(x^2)=e^{(x^2)^2}=e^{x^4}$, so the answer is $2xe^{x^4}$."
    ],
    "trap": "Only plugging in the upper limit to get $e^{x^4}$, missing the factor $2x$ from the derivative of the upper limit; or writing $e^{x^2}$ (plugging in $t=x$ instead of $t=x^2$).",
    "check": "At $x=0$ the upper limit is also $0$, the integral stays near $0$, and the derivative should be $0$; $2x e^{x^4}$ is indeed $0$ at $0$."
  },
  "gap-int-cov-001": {
    "spot": "The problem gives $u,v$ in terms of $x,y$ but asks for $\\frac{\\partial(x,y)}{\\partial(u,v)}$ — the direction is reversed. Either solve for $x,y$ first, or compute the other direction and take the reciprocal.",
    "why": "A linear map is easy to invert, so solving for $x,y$ and computing the determinant is least likely to get the direction wrong; the reciprocal method serves as a check.",
    "steps": [
      "Add and subtract the two equations: $x=\\frac{u+v}{2}$, $y=\\frac{u-v}{2}$.",
      "Partial derivatives: $x_u=\\frac{1}{2}$, $x_v=\\frac{1}{2}$, $y_u=\\frac{1}{2}$, $y_v=-\\frac{1}{2}$.",
      "Determinant $x_uy_v-x_vy_u=-\\frac{1}{4}-\\frac{1}{4}=-\\frac{1}{2}$; absolute value $\\frac{1}{2}$."
    ],
    "trap": "Directly computing $\\frac{\\partial(u,v)}{\\partial(x,y)}=\\begin{vmatrix}1&1\\\\1&-1\\end{vmatrix}=-2$ and answering $2$ — wrong direction; you want its reciprocal.",
    "check": "The reverse Jacobian is $|-2|=2$, and the two must multiply to $1$: $2\\cdot\\frac{1}{2}=1$."
  },
  "lm-rs-011": {
    "spot": "$\\frac{k}{n^2}=\\frac{1}{n}\\cdot\\frac{k}{n}$, and only $\\frac{k}{n}$ appears under the root: a Riemann sum, with $\\frac{1}{n}$ as the width and $x=\\frac{k}{n}$ running from $0$ to $1$.",
    "why": "Once you see it as the integral $\\int_0^1x\\sqrt{1+x^2}\\,dx$, one substitution finishes it; summing over $k$ directly is impossible.",
    "steps": [
      "Rewrite: $\\sum_{k=1}^n\\frac{1}{n}\\cdot\\frac{k}{n}\\sqrt{1+\\left(\\frac{k}{n}\\right)^2}$, the right-endpoint Riemann sum of $f(x)=x\\sqrt{1+x^2}$ on $[0,1]$.",
      "As $n\\to\\infty$ the sum tends to $\\int_0^1x\\sqrt{1+x^2}\\,dx$.",
      "Let $u=1+x^2$: antiderivative $\\frac{1}{3}(1+x^2)^{3/2}$.",
      "Plug in the limits: $\\frac{1}{3}\\left(2^{3/2}-1\\right)=\\frac{2\\sqrt{2}-1}{3}$."
    ],
    "trap": "Treating all of $\\frac{k}{n^2}$ as the width $\\Delta x$ and getting $\\int_0^1\\sqrt{1+x^2}\\,dx$; the width is only $\\frac{1}{n}$, and the remaining $\\frac{k}{n}$ is $x$.",
    "check": "$f$ is increasing, so right-endpoint sums overestimate: at $n=2$ the sum $=\\frac{1}{4}\\sqrt{\\frac{5}{4}}+\\frac{1}{2}\\sqrt{2}\\approx 0.987$, bigger than the answer $0.6095$ — the right direction."
  },
  "rel-boss-001": {
    "spot": "$\\frac{\\sin(3x)}{x}$ from $0$ to $\\infty$: the Dirichlet integral. The $3$ is just a scaling; with $t=3x$, $\\frac{dx}{x}=\\frac{dt}{t}$ is unchanged, so the answer doesn't depend on the coefficient (only its sign).",
    "why": "A scaling substitution reduces it in one step to $\\int_0^\\infty\\frac{\\sin t}{t}dt=\\frac{\\pi}{2}$; that value itself comes from Feynman's trick with $\\int_0^\\infty e^{-sx}\\frac{\\sin 3x}{x}dx$.",
    "steps": [
      "Let $t=3x$: $\\frac{\\sin 3x}{x}dx=\\frac{\\sin t}{t/3}\\cdot\\frac{dt}{3}=\\frac{\\sin t}{t}dt$, with the limits unchanged.",
      "To compute $\\int_0^\\infty\\frac{\\sin 3x}{x}dx$, add damping $I(s)=\\int_0^\\infty e^{-sx}\\frac{\\sin 3x}{x}dx$ and differentiate in $s$ to kill the $x$ in the denominator: $I'(s)=-\\int_0^\\infty e^{-sx}\\sin 3x\\,dx=-\\frac{3}{s^2+9}$.",
      "As $s\\to\\infty$, $I\\to 0$; integrating back gives $I(s)=\\frac{\\pi}{2}-\\arctan\\frac{s}{3}=\\arctan\\frac{3}{s}$.",
      "Let $s\\to 0^+$: $\\arctan\\frac{3}{s}\\to\\frac{\\pi}{2}$."
    ],
    "trap": "Thinking the coefficient comes out and answering $\\frac{3\\pi}{2}$ or $\\frac{\\pi}{6}$: $\\frac{dx}{x}$ is scale-invariant, so the coefficient cancels completely.",
    "check": "Integrating to a finite length oscillates around $\\frac{\\pi}{2}$: up to $t=100\\pi$ it's slightly less, up to $101\\pi$ slightly more."
  },
  "rel-boss-017": {
    "spot": "$(\\ln x)^2$ blows up as $x\\to 0^+$, so it's an improper integral; substituting $x=e^{-t}$ stretches $[0,1]$ into $[0,\\infty)$ and turns it into a Gamma function.",
    "why": "After the substitution it's $\\int_0^\\infty t^2e^{-t}dt=\\Gamma(3)=2$, one line; integrating by parts twice also works, but you need the limit $x(\\ln x)^2\\to 0$.",
    "steps": [
      "Let $x=e^{-t}$: $\\ln x=-t$, $dx=-e^{-t}dt$, and $x:0\\to 1$ corresponds to $t:\\infty\\to 0$.",
      "The integral becomes $\\int_0^\\infty t^2e^{-t}\\,dt$.",
      "That's $\\Gamma(3)=2!=2$.",
      "You can also check with the antiderivative $x(\\ln x)^2-2x\\ln x+2x$: the upper limit gives $2$, the lower limit $x\\to 0^+$ gives $0$, so the result is $2$."
    ],
    "trap": "Thinking that since $(\\ln x)^2$ is unbounded near $0$ the integral diverges — it blows up more slowly than any $x^{-p}$, and the area is finite.",
    "check": "$(\\ln x)^2\\ge 0$, so the answer is positive; it also fits the pattern of $\\int_0^1\\ln x\\,dx=-1$ (that is, $-\\Gamma(2)$): $\\int_0^1(\\ln x)^n dx=(-1)^nn!$."
  },
  "rel-hard-ser-001": {
    "spot": "The coefficients are $\\frac{(2n)!}{(n!)^2}=\\binom{2n}{n}$, with factorials: use the Ratio Test, since the factorials mostly cancel.",
    "why": "The Ratio Test reduces the factorials to a ratio of two linear expressions; the Root Test would need Stirling — too heavy.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(2n+2)(2n+1)}{(n+1)^2}=\\frac{2(2n+1)}{n+1}$. Small example: $a_1=2$, $a_2=6$, ratio $3$, matching the formula at $n=1$.",
      "As $n\\to\\infty$: $\\frac{2(2n+1)}{n+1}\\to 4$.",
      "Ratio Test: it converges when $4|x|<1$, so $R=\\frac{1}{4}$."
    ],
    "trap": "Taking $\\lim\\frac{a_{n+1}}{a_n}=4$ directly as the radius: the radius is its reciprocal, $\\frac{1}{4}$.",
    "check": "This series is the expansion of $\\frac{1}{\\sqrt{1-4x}}$, which blows up at $x=\\frac{1}{4}$; its derivative $2$ and second derivative $12=2!\\cdot 6$ at $0$ match $a_1$, $a_2$ exactly."
  },
  "rel-hard-ser-011": {
    "spot": "$(-1)^n$ with $\\frac{1}{\\sqrt n}$ decreasing to $0$: the alternating series converges; but without the signs it's the $p$-series with $p=\\frac{1}{2}$, which diverges. Judge the two things separately.",
    "why": "The Alternating Series Test handles whether it converges, and the $p$-series handles whether it converges absolutely; you need both to call it conditionally convergent.",
    "steps": [
      "$b_n=\\frac{1}{\\sqrt n}$ is decreasing and tends to $0$.",
      "Alternating Series Test: $\\sum\\frac{(-1)^n}{\\sqrt n}$ converges (sum about $-0.605$).",
      "Take absolute values: $\\sum\\frac{1}{\\sqrt n}$ is a $p$-series with $p=\\frac{1}{2}\\le 1$, so it diverges (every term is bigger than the harmonic series term $\\frac{1}{n}$).",
      "$\\int_1^N\\frac{dx}{\\sqrt x}=2\\sqrt N-2$ is unbounded (already $18$ at $N=100$), so the absolute series really diverges. Convergent but not absolutely convergent means conditionally convergent (conditional)."
    ],
    "trap": "Seeing only that the alternating series converges and answering absolutely convergent; or seeing only that $\\sum\\frac{1}{\\sqrt n}$ diverges and answering divergent. Check both.",
    "check": "Compare $\\frac{(-1)^n}{n^2}$: its absolute values form a $p=2$ series, which converges, so that one is absolutely convergent; the whole difference is whether $p$ exceeds $1$."
  },
  "burst-boss-param-004": {
    "spot": "The integral has a parameter $a$, and inside the $\\ln$ is $1+a(\\cdots)$: differentiating in $a$ removes the $\\ln$, leaving a rational trig integral — Feynman's trick. Starting point $I(0)=0$.",
    "why": "Integrating $\\ln(1+a\\sin^2x)$ directly gets nowhere; after differentiating it's $\\int\\frac{dx}{1+a\\sin^2x}$, which has a formula, and then you integrate back.",
    "steps": [
      "$I'(a)=\\int_0^{\\pi/2}\\frac{\\sin^2x}{1+a\\sin^2x}\\,dx=\\frac{1}{a}\\int_0^{\\pi/2}\\left(1-\\frac{1}{1+a\\sin^2x}\\right)dx$.",
      "Standard integral (divide top and bottom by $\\cos^2x$ and let $t=\\tan x$): $\\int_0^{\\pi/2}\\frac{dx}{1+a\\sin^2x}=\\frac{\\pi}{2\\sqrt{1+a}}$.",
      "So $I'(a)=\\frac{\\pi}{2a}\\left(1-\\frac{1}{\\sqrt{1+a}}\\right)=\\frac{\\pi}{2\\sqrt{1+a}\\left(1+\\sqrt{1+a}\\right)}$.",
      "Notice $\\frac{d}{da}\\ln\\left(1+\\sqrt{1+a}\\right)=\\frac{1}{2\\sqrt{1+a}\\left(1+\\sqrt{1+a}\\right)}$, so $I(a)=\\pi\\ln\\left(1+\\sqrt{1+a}\\right)+C$.",
      "$I(0)=0$ gives $C=-\\pi\\ln 2$, so $I(a)=\\pi\\ln\\frac{1+\\sqrt{1+a}}{2}$."
    ],
    "trap": "Forgetting to use $I(0)=0$ to fix the constant after integrating back, answering $\\pi\\ln\\left(1+\\sqrt{1+a}\\right)$ — at $a=0$ that gives $\\pi\\ln 2\\ne 0$, clearly wrong.",
    "check": "For small $a$, $\\ln(1+a\\sin^2x)\\approx a\\sin^2x$, so the integral is about $\\frac{\\pi a}{4}$; the derivative of the answer at $0$ is exactly $\\frac{\\pi}{4}$."
  },
  "burst-boss2-param-003": {
    "spot": "The integrand has an extra $x$ in front of $e^{-ax}$: $xe^{-ax}=-\\frac{\\partial}{\\partial a}e^{-ax}$. Compute the version without $x$ first, then differentiate in $a$.",
    "why": "$\\int_0^\\infty e^{-ax}\\sin x\\,dx=\\frac{1}{a^2+1}$ is familiar; one derivative in $a$ gives the answer, cleaner than integrating by parts twice with an $x$ along for the ride.",
    "steps": [
      "First compute $G(a)=\\int_0^\\infty e^{-ax}\\sin x\\,dx=\\frac{1}{a^2+1}$ (by parts twice, or via $\\operatorname{Im}\\int e^{(-a+i)x}dx$).",
      "Differentiate in $a$: $\\frac{\\partial}{\\partial a}e^{-ax}=-xe^{-ax}$, so $F(a)=-G'(a)$.",
      "$-G'(a)=-\\frac{d}{da}(a^2+1)^{-1}=\\frac{2a}{(a^2+1)^2}$."
    ],
    "trap": "Dropping the minus sign ($\\frac{\\partial}{\\partial a}e^{-ax}=-xe^{-ax}$) and getting $-\\frac{2a}{(a^2+1)^2}$ — but for large $a$ the integrand is positive where $x$ is small, so the answer should be positive.",
    "check": "$a=1$: $F(1)=\\frac{2}{4}=\\frac{1}{2}$, and direct integration agrees."
  },
  "burst-boss3-lim-005": {
    "spot": "$\\frac{1}{n}\\sum f\\left(\\frac{k}{n}\\right)$ is a right-endpoint Riemann sum; subtract the integral $2\\ln 2-1$ and then $\\frac{\\ln 2}{2n}$, and the question is the coefficient of the $\\frac{1}{n^2}$ term — Euler–Maclaurin expansion.",
    "why": "Euler–Maclaurin gives the error at every order directly: $\\frac{f(1)-f(0)}{2n}+\\frac{f'(1)-f'(0)}{12n^2}+\\cdots$; piecing it together from term-by-term Taylor expansions gets messy.",
    "steps": [
      "$f(x)=\\ln(1+x)$, with integral $\\int_0^1\\ln(1+x)\\,dx=2\\ln 2-1$.",
      "Right-endpoint sum: $\\frac{1}{n}\\sum_{k=1}^nf\\left(\\frac{k}{n}\\right)=\\int_0^1f+\\frac{f(1)-f(0)}{2n}+\\frac{f'(1)-f'(0)}{12n^2}+O\\left(\\frac{1}{n^4}\\right)$; the first-order term $\\frac{\\ln 2}{2n}$ is exactly what the problem subtracts.",
      "$f'(x)=\\frac{1}{1+x}$: $f'(1)-f'(0)=\\frac{1}{2}-1=-\\frac{1}{2}$.",
      "After multiplying by $n^2$, what's left is $\\frac{-1/2}{12}=-\\frac{1}{24}$."
    ],
    "trap": "Thinking the Riemann-sum error is only the $\\frac{1}{2n}$ term and answering $0$; or misremembering the coefficient as $\\frac{1}{6}$ or $\\frac{1}{24}$ (the midpoint-rule coefficient) — you need $\\frac{B_2}{2!}=\\frac{1}{12}$.",
    "check": "Actual computation at $n=2$: $4\\left(\\frac{\\ln 1.5+\\ln 2}{2}-(2\\ln 2-1)-\\frac{\\ln 2}{4}\\right)\\approx-0.0413$, already very close to $-\\frac{1}{24}\\approx-0.0417$."
  },
  "dd-opt-009": {
    "spot": "Rowing is slow and running is fast: the best route rows diagonally to some point $x$ on the shore, then runs along it. Total time $T(x)=\\frac{\\sqrt{9+x^2}}{3}+\\frac{8-x}{5}$ — one-variable optimization.",
    "why": "Making the landing point the variable gives a one-variable derivative problem; $T'=0$ is solved with a single squaring (it's the same equation as refraction of light).",
    "steps": [
      "Land $x$ km from the nearest shore point: rowing distance $\\sqrt{9+x^2}$, running $8-x$, so $T(x)=\\frac{\\sqrt{9+x^2}}{3}+\\frac{8-x}{5}$.",
      "$T'(x)=\\frac{x}{3\\sqrt{9+x^2}}-\\frac{1}{5}=0\\Rightarrow 5x=3\\sqrt{9+x^2}$.",
      "Square: $25x^2=81+9x^2$, $x^2=\\frac{81}{16}$, $x=\\frac{9}{4}$ (inside $[0,8]$).",
      "$\\sqrt{9+\\frac{81}{16}}=\\frac{15}{4}$, $T=\\frac{15/4}{3}+\\frac{23/4}{5}=\\frac{5}{4}+\\frac{23}{20}=\\frac{12}{5}$.",
      "Compare endpoints: running all the way along the shore ($x=0$) takes $2.6$ hours, rowing straight to town ($x=8$) about $2.85$ hours — both longer than $2.4$."
    ],
    "trap": "Matching speeds to the wrong legs (dividing rowing by $5$ and running by $3$) gives a different landing point; first confirm which leg is on the water.",
    "check": "Snell's-law-style check: at the optimum $\\sin\\theta=\\frac{x}{\\sqrt{9+x^2}}=\\frac{9/4}{15/4}=\\frac{3}{5}$, exactly the speed ratio $\\frac{3}{5}$."
  },
  "der-081": {
    "spot": "$z^2+1=(z-i)(z+i)$, so $z=i$ is a simple pole: the residue is found by covering up $(z-i)$ and plugging $z=i$ into what's left, $\\frac{1}{z+i}$.",
    "why": "For a simple pole, $\\frac{p(z_0)}{q'(z_0)}$ or the cover-up method is fastest — no Laurent series needed.",
    "steps": [
      "Factor $z^2+1=(z-i)(z+i)$; $z=i$ is a simple root, so it's a simple pole. You can also use $\\frac{1}{q'(z)}$ with $q'(z)=2z$.",
      "Residue $=\\frac{1}{z+i}\\Big|_{z=i}=\\frac{1}{2i}=-\\frac{i}{2}$.",
      "Absolute value: $\\left|\\frac{1}{2i}\\right|=\\frac{1}{|2i|}=\\frac{1}{2}$."
    ],
    "trap": "Plugging into $\\frac{1}{z-i}$ instead, or forgetting that $i$ has modulus $1$; some also write the residue as $\\frac{1}{2}$, dropping the $\\frac{1}{i}$ — the absolute value comes out right, but a real integral computed from it would be off by a factor of $i$.",
    "check": "Residue theorem: $\\int_{-\\infty}^\\infty\\frac{dx}{x^2+1}=2\\pi i\\cdot\\frac{1}{2i}=\\pi$, and the actual integral is exactly $\\pi$."
  },
  "der-083": {
    "spot": "$\\frac{e^z}{z^3}$: divide the whole Taylor series of $e^z$ by $z^3$; the $z^{-1}$ coefficient is the original $z^2$ coefficient, $\\frac{1}{2!}$.",
    "why": "Reading the coefficient off the Laurent series is fastest; the triple-pole residue formula $\\frac{1}{2!}\\frac{d^2}{dz^2}e^z\\big|_0$ is the same thing.",
    "steps": [
      "$e^z=1+z+\\frac{z^2}{2!}+\\frac{z^3}{3!}+\\cdots$, with coefficients $\\frac{1}{n!}$.",
      "Divide by $z^3$: $\\frac{e^z}{z^3}=z^{-3}+z^{-2}+\\frac{1}{2}z^{-1}+\\frac{1}{6}+\\cdots$.",
      "The $z^{-1}$ coefficient comes from $\\frac{z^2}{2!}$, so it's $\\frac{1}{2}$."
    ],
    "trap": "Taking the $z^3$ coefficient $\\frac{1}{6}$: after dividing by $z^3$, it's the $z^2$ term that becomes $z^{-1}$, not the $z^3$ term.",
    "check": "Compute along the unit circle $z=e^{it}$: $\\frac{1}{2\\pi i}\\oint\\frac{e^z}{z^3}dz=\\frac{1}{2\\pi}\\int_0^{2\\pi}e^{\\cos t}\\cos(\\sin t-2t)\\,dt$, which comes out to $\\frac{1}{2}$."
  },
  "int-057": {
    "spot": "$e^{x-t}=e^x\\cdot e^{-t}$: $e^x$ doesn't depend on the integration variable $t$, so it comes outside the integral, leaving $\\int_0^xe^{-t}\\sin t\\,dt$, the standard exponential-times-trig type.",
    "why": "Pull $e^x$ out first, then integrate by parts twice (or use the formula); don't mess with $x$ while integrating in $t$.",
    "steps": [
      "Pull out $e^x$: $F(x)=e^x\\int_0^xe^{-t}\\sin t\\,dt$.",
      "By parts twice (or the formula): $\\int e^{-t}\\sin t\\,dt=-\\frac{e^{-t}(\\sin t+\\cos t)}{2}$.",
      "Plug in the limits: $\\int_0^xe^{-t}\\sin t\\,dt=\\frac{1}{2}-\\frac{e^{-x}(\\sin x+\\cos x)}{2}$.",
      "Multiply back by $e^x$: $F(x)=\\frac{e^x-\\sin x-\\cos x}{2}$."
    ],
    "trap": "Dropping the $-\\frac{e^0(0+1)}{2}$ term at the lower limit $t=0$, losing $\\frac{e^x}{2}$; then the result isn't $0$ at $x=0$.",
    "check": "$F$ satisfies $F'-F=\\sin x$, $F(0)=0$ (the integral of $e^{x-t}$ solves exactly this equation); the answer passes both."
  },
  "rel-hard-int-012": {
    "spot": "$\\frac{1}{x^4+1}$ from $0$ to $\\infty$: substituting $x\\to\\frac{1}{x}$ turns it into $\\frac{x^2}{x^4+1}$, and the two integrals are equal. Adding them, the numerator $1+x^2$ can be matched to the derivative of $u=x-\\frac{1}{x}$.",
    "why": "The symmetry trick avoids partial fractions with $x^4+1=(x^2+\\sqrt2x+1)(x^2-\\sqrt2x+1)$, and needs no residues.",
    "steps": [
      "Let $x=\\frac{1}{y}$: $I=\\int_0^\\infty\\frac{dx}{x^4+1}=\\int_0^\\infty\\frac{x^2}{x^4+1}dx$.",
      "Add: $2I=\\int_0^\\infty\\frac{1+x^2}{x^4+1}dx$; dividing top and bottom by $x^2$ gives $\\frac{1+\\frac{1}{x^2}}{\\left(x-\\frac{1}{x}\\right)^2+2}$.",
      "Let $u=x-\\frac{1}{x}$, $du=\\left(1+\\frac{1}{x^2}\\right)dx$; $x:0\\to\\infty$ corresponds to $u:-\\infty\\to\\infty$: $2I=\\int_{-\\infty}^\\infty\\frac{du}{u^2+2}=\\frac{\\pi}{\\sqrt2}$.",
      "$I=\\frac{\\pi}{2\\sqrt2}$."
    ],
    "trap": "Taking the range of $u=x-\\frac{1}{x}$ as $0$ to $\\infty$ (as if it matched $x$), which gets only half and gives $\\frac{\\pi}{4\\sqrt2}$. As $x\\to 0^+$, $u\\to-\\infty$.",
    "check": "The answer is about $1.11$, while $\\int_0^\\infty\\frac{dx}{x^2+1}=\\frac{\\pi}{2}\\approx 1.57$ — $x^4+1$ grows faster for $x>1$, so the integral is smaller. Reasonable."
  },
  "cx-der-005": {
    "spot": "The numerator $x$ and denominator $x+1$ differ by only $1$: split it as $1-\\frac{1}{x+1}$, which is faster than the Quotient Rule.",
    "why": "After splitting, you only differentiate the single term $-\\frac{1}{x+1}$; the Quotient Rule works just as well but takes an extra line of expansion.",
    "steps": [
      "Split: $\\frac{x}{x+1}=1-\\frac{1}{x+1}$.",
      "The constant differentiates to $0$; $\\frac{d}{dx}\\left(-\\frac{1}{x+1}\\right)=\\frac{1}{(x+1)^2}$.",
      "Check with the Quotient Rule: $\\frac{1\\cdot(x+1)-x\\cdot 1}{(x+1)^2}=\\frac{1}{(x+1)^2}$, the same."
    ],
    "trap": "Reversing the order in the Quotient Rule numerator ($x\\cdot 1-1\\cdot(x+1)$) and getting $-\\frac{1}{(x+1)^2}$. Mnemonic: low d-high minus high d-low.",
    "check": "$\\frac{x}{x+1}$ is increasing for $x>-1$ (approaching $1$), so the derivative should be positive; at $x=0$ the slope is $1$."
  },
  "cx-der-007": {
    "spot": "Under the root is $3x+1$, not $x$: Chain Rule — the outer derivative of $\\sqrt{u}$ is $\\frac{1}{2\\sqrt u}$, times the inner $3$.",
    "why": "Write it as $(3x+1)^{1/2}$ and use the power rule with the Chain Rule — done in one step.",
    "steps": [
      "$f(x)=(3x+1)^{1/2}$; outer derivative $\\frac{1}{2}(3x+1)^{-1/2}$.",
      "Multiply by the inner $(3x+1)'=3$: $f'(x)=\\frac{3}{2\\sqrt{3x+1}}$.",
      "Plug in $x=1$: $\\frac{3}{2\\sqrt4}=\\frac{3}{4}$."
    ],
    "trap": "Forgetting to multiply by the inner $3$, getting $\\frac{1}{4}$.",
    "check": "Secant slope $\\frac{f(1.01)-f(1)}{0.01}\\approx 0.7486$, close to $0.75$."
  },
  "cx-lh-007": {
    "spot": "Plugging in $x=1$ gives $\\frac{\\ln 1}{0}=\\frac{0}{0}$; and $\\frac{\\ln x-\\ln 1}{x-1}$ is exactly the derivative definition of $\\ln x$ at $1$.",
    "why": "Viewing it as the derivative definition is fastest (the answer is just $\\frac{1}{x}$ at $1$); one step of L'Hôpital's Rule also works.",
    "steps": [
      "Plug in: numerator $\\ln 1=0$, denominator $0$, so it's $\\frac{0}{0}$.",
      "L'Hôpital's Rule: differentiate top and bottom, $\\frac{1/x}{1}=\\frac{1}{x}$.",
      "$x\\to 1$: $\\frac{1}{1}=1$."
    ],
    "trap": "Seeing $\\frac{0}{0}$ and saying the limit doesn't exist or is $0$ — $\\frac{0}{0}$ only means more work is needed.",
    "check": "$x=1.01$: $\\frac{\\ln 1.01}{0.01}\\approx 0.995$, close to $1$ and slightly below ($\\ln$ curves downward)."
  },
  "cx-lh-013": {
    "spot": "$x\\to\\infty$ and $\\frac{\\pi}{2}-\\arctan x\\to 0$: an $\\infty\\cdot 0$ form. And $\\frac{\\pi}{2}-\\arctan x=\\arctan\\frac{1}{x}$, which for small angles is about $\\frac{1}{x}$.",
    "why": "Rewrite as $\\frac{\\frac{\\pi}{2}-\\arctan x}{1/x}$ to get $\\frac{0}{0}$, then L'Hôpital's Rule; or see it at a glance with $\\arctan\\frac{1}{x}\\approx\\frac{1}{x}$.",
    "steps": [
      "Rewrite: $x\\left(\\frac{\\pi}{2}-\\arctan x\\right)=\\frac{\\frac{\\pi}{2}-\\arctan x}{1/x}$, with numerator and denominator both tending to $0$.",
      "L'Hôpital's Rule: the numerator's derivative is $-\\frac{1}{1+x^2}$ and the denominator's is $-\\frac{1}{x^2}$, ratio $\\frac{x^2}{1+x^2}$.",
      "$\\frac{x^2}{1+x^2}\\to 1$."
    ],
    "trap": "Seeing $\\infty\\cdot 0$ and saying it's $0$ or $\\infty$ — it's an indeterminate form; you must rewrite it as a fraction.",
    "check": "$x=100$: $100\\arctan(0.01)\\approx 0.99997$, very close to $1$."
  },
  "cx-lim-001": {
    "spot": "$2x+1$ is a polynomial, continuous everywhere: no denominator, no root — just plug in $x=3$.",
    "why": "The limit of a continuous function is its value; no technique needed.",
    "steps": [
      "Polynomials are continuous at every point, so $\\lim_{x\\to 3}(2x+1)=2\\cdot 3+1$.",
      "$2\\cdot 3+1=7$.",
      "The limit is $7$."
    ],
    "check": "At $x=2.99$, $2x+1=6.98$; at $x=3.01$ it's $7.02$ — both sides close in on $7$."
  },
  "cx-lim-006": {
    "spot": "As $x\\to\\infty$, both $\\sqrt{x^2+4x}$ and $x$ go to $\\infty$: an $\\infty-\\infty$ form with a root — rationalize (multiply by the conjugate).",
    "why": "Multiplying by $\\sqrt{x^2+4x}+x$ turns the difference into $\\frac{4x}{\\cdots}$, then divide through by $x$; plugging in big numbers only lets you guess.",
    "steps": [
      "Multiply by the conjugate: $\\left(\\sqrt{x^2+4x}-x\\right)\\cdot\\frac{\\sqrt{x^2+4x}+x}{\\sqrt{x^2+4x}+x}=\\frac{4x}{\\sqrt{x^2+4x}+x}$.",
      "Divide top and bottom by $x$: $\\frac{4}{\\sqrt{1+\\frac{4}{x}}+1}$.",
      "$\\frac{4}{x}\\to 0$, so the limit is $\\frac{4}{1+1}=2$."
    ],
    "trap": "Roughly estimating $\\sqrt{x^2+4x}$ as $x$ and getting $x-x=0$; the small difference is exactly the answer — rationalize, or use $\\sqrt{x^2+4x}\\approx x+2$.",
    "check": "Complete the square: $x^2+4x=(x+2)^2-4$, so $\\sqrt{x^2+4x}$ is a bit less than $x+2$; at $x=100$ the difference is about $1.98$."
  },
  "fd-lim-001": {
    "spot": "$x^2+3x$ is a polynomial, continuous everywhere: just plug in $x=2$.",
    "why": "The limit of a continuous function equals its value; there's no $\\frac{0}{0}$, so no simplifying or L'Hôpital's Rule needed.",
    "steps": [
      "Polynomials are continuous, so $\\lim_{x\\to 2}(x^2+3x)=2^2+3\\cdot 2$.",
      "$4+6=10$.",
      "The limit is $10$."
    ],
    "trap": "Slips like turning $3x$ into $3+2=5$; when plugging in, replace every $x$ with $2$.",
    "check": "$x=2.01$: $4.0401+6.03=10.0701$, close to $10$."
  },
  "fd-ser-007": {
    "spot": "$\\left(-\\frac{1}{2}\\right)^n$ starting at $n=0$: a geometric series with first term $1$ and ratio $r=-\\frac{1}{2}$; $|r|<1$, so it converges.",
    "why": "Geometric series: just use $\\frac{a}{1-r}$; note that it starts at $n=0$, so the first term is $1$.",
    "steps": [
      "First term $a=\\left(-\\frac{1}{2}\\right)^0=1$, ratio $r=-\\frac{1}{2}$, $|r|<1$.",
      "Sum $=\\frac{a}{1-r}=\\frac{1}{1+\\frac{1}{2}}$.",
      "$=\\frac{2}{3}$."
    ],
    "trap": "Dropping the minus sign of the ratio and computing $\\frac{1}{1-\\frac{1}{2}}=2$.",
    "check": "The partial sum $1-\\frac{1}{2}+\\frac{1}{4}-\\frac{1}{8}=0.625$ bounces above and below $\\frac{2}{3}\\approx 0.667$."
  },
  "cx-app-001": {
    "spot": "$x^2+y^2=25$ isn't solved for $y$: implicit differentiation — differentiate both sides in $x$, and the derivative of $y^2$ carries a $y'$.",
    "why": "Implicit differentiation gives $y'=-\\frac{x}{y}$ in one line; solving for $y=\\sqrt{25-x^2}$ and differentiating works too, but you first have to decide on the positive root.",
    "steps": [
      "Differentiate both sides in $x$: $2x+2y\\,y'=0$.",
      "Solve: $y'=-\\frac{x}{y}$.",
      "At $(3,4)$: $y'=-\\frac{3}{4}$; this matches the slope of the upper semicircle $y=\\sqrt{25-x^2}$ at $x=3$."
    ],
    "trap": "Differentiating $y^2$ as $2y$ and dropping $y'$, which leaves no way to solve for $y'$; $y$ is a function of $x$, so you multiply by $\\frac{dy}{dx}$.",
    "check": "Geometry: the tangent to a circle is perpendicular to the radius; the radius slope is $\\frac{4}{3}$, and the product should be $-1$."
  },
  "cx-app-002": {
    "spot": "$x^3+y^3=6xy$ can't be solved for $y$: implicit differentiation. The right side $6xy$ is a product, so the Product Rule produces another $y'$.",
    "why": "After implicit differentiation, collect the $y'$ terms on one side; equivalently use $y'=-\\frac{F_x}{F_y}$ with $F=x^3+y^3-6xy$.",
    "steps": [
      "First confirm the point is on the curve: $27+27=54=6\\cdot 3\\cdot 3$.",
      "Differentiate in $x$: $3x^2+3y^2y'=6y+6xy'$, which rearranges to $y'(3y^2-6x)=6y-3x^2$.",
      "$y'=\\frac{2y-x^2}{y^2-2x}$; at $(3,3)$: $\\frac{6-9}{9-6}=-1$."
    ],
    "trap": "Differentiating $6xy$ as just $6y$ (treating $y$ as a constant), getting $y'=\\frac{6y-3x^2}{3y^2}=-\\frac{1}{9}$.",
    "check": "The curve is symmetric about $y=x$ (swapping $x$, $y$ leaves the equation unchanged), and $(3,3)$ is on the axis of symmetry, so the tangent must be perpendicular to it: slope $-1$."
  },
  "cx-cont-004": {
    "spot": "Asking for exactly how many roots: existence from the Intermediate Value Theorem (sign change at the ends), uniqueness from monotonicity (derivative always positive).",
    "why": "The Intermediate Value Theorem only guarantees at least one; for exactly one you also have to show the function never turns back.",
    "steps": [
      "$f(0)=-1<0$, $f(1)=1>0$, and $f$ is continuous, so by the Intermediate Value Theorem there's at least one root in $(0,1)$.",
      "$f'(x)=3x^2+1>0$, so $f$ is strictly increasing and crosses the $x$-axis at most once.",
      "So there is exactly $1$ root, at about $x\\approx 0.682$."
    ],
    "trap": "Concluding exactly one from the Intermediate Value Theorem alone — it only gives at least one; uniqueness needs monotonicity.",
    "check": "Bisection: $f(0.5)=-0.375<0$, so the root is in $(0.5,1)$; $f(0.75)\\approx 0.172>0$, so it's in $(0.5,0.75)$ — only one sign change found along the way."
  },
  "cx-der-004": {
    "spot": "$x^2\\ln x$ is a product of two functions: Product Rule. At $x=1$, $\\ln 1=0$ makes one term vanish.",
    "why": "The Product Rule is one line; finding the general formula then plugging in beats using the definition.",
    "steps": [
      "Product Rule: $(x^2)'\\ln x+x^2(\\ln x)'=2x\\ln x+x^2\\cdot\\frac{1}{x}$.",
      "Simplify: $2x\\ln x+x$.",
      "Plug in $x=1$: $2\\cdot 1\\cdot 0+1=1$."
    ],
    "trap": "Taking the derivative of a product as the product of derivatives: $2x\\cdot\\frac{1}{x}=2$, wrongly answering $2$.",
    "check": "Secant: $\\frac{f(1.01)-f(1)}{0.01}=\\frac{1.0201\\ln 1.01}{0.01}\\approx 1.015$, close to $1$."
  },
  "cx-der-006": {
    "spot": "$\\tan x=\\frac{\\sin x}{\\cos x}$: Quotient Rule, and the numerator becomes $\\cos^2x+\\sin^2x=1$.",
    "why": "One application of the Quotient Rule does it; the result $\\frac{1}{\\cos^2x}$ is $\\sec^2x$, worth memorizing.",
    "steps": [
      "$\\tan x=\\frac{\\sin x}{\\cos x}$; Quotient Rule: $\\frac{\\cos x\\cdot\\cos x-\\sin x\\cdot(-\\sin x)}{\\cos^2x}$.",
      "Numerator $\\cos^2x+\\sin^2x=1$, giving $\\frac{1}{\\cos^2x}$.",
      "$\\frac{1}{\\cos^2x}=\\sec^2x$ (also equal to $1+\\tan^2x$)."
    ],
    "trap": "The minus sign in the Quotient Rule: the derivative of $\\cos x$ is $-\\sin x$, and subtracting it gives $+\\sin^2x$; getting it wrong gives $\\frac{\\cos^2x-\\sin^2x}{\\cos^2x}$.",
    "check": "$x=0$: the slope of $\\tan x$ at the origin is $1$, and $\\sec^20=1$."
  },
  "cx-lim-008": {
    "spot": "Base $\\to 1$, exponent $\\to\\infty$: a $1^\\infty$ form; recognize $\\left(1+\\frac{a}{x}\\right)^x\\to e^a$, here with $a=2$.",
    "why": "Taking logs brings the exponent down as $x\\ln\\left(1+\\frac{2}{x}\\right)$, then use $\\ln(1+u)\\approx u$; if you know the $e^a$ formula, it's done at a glance.",
    "steps": [
      "Take logs: $\\ln\\left(1+\\frac{2}{x}\\right)^x=x\\ln\\left(1+\\frac{2}{x}\\right)$.",
      "$u=\\frac{2}{x}\\to 0$ and $\\ln(1+u)\\approx u$, so $x\\ln\\left(1+\\frac{2}{x}\\right)\\to x\\cdot\\frac{2}{x}=2$.",
      "Exponentiate back: the limit is $e^2$."
    ],
    "trap": "Saying the base goes to $1$ so $1^\\infty=1$ — it's an indeterminate form, and the answer can be any positive number.",
    "check": "$x=1000$: $1.002^{1000}\\approx 7.374$, slightly below $e^2\\approx 7.389$, approaching from below."
  },
  "cx-mvt-002": {
    "spot": "MVT: find $c$ where the tangent slope $f'(c)$ equals the secant slope between the endpoints. $f'(c)=3c^2$, secant slope $\\frac{27-0}{3}$.",
    "why": "Compute the secant slope first, then solve $f'(c)=$ secant slope, and remember to keep only solutions in the open interval $(0,3)$.",
    "steps": [
      "Secant slope: $\\frac{f(3)-f(0)}{3-0}=\\frac{27}{3}=9$.",
      "$f'(c)=3c^2=9\\Rightarrow c^2=3$, $c=\\pm\\sqrt3$.",
      "Only $c=\\sqrt3\\approx 1.732$ lies in $(0,3)$."
    ],
    "trap": "Including $-\\sqrt3$ as well: it's not in $(0,3)$.",
    "check": "$c$ should be a bit to the right of the midpoint $1.5$: $x^3$ curves upward with increasing slope, so the average slope is reached right of center."
  },
  "cx-rev-003": {
    "spot": "The curves $y=x$ and $y=x^2$ meet at $x=0,1$, with $x\\ge x^2$ on $[0,1]$; rotating about the $x$-axis with slices perpendicular to the $x$-axis — washer method, outer radius $x$, inner radius $x^2$.",
    "why": "Rotating about the $x$-axis with functions $y=f(x)$, washers integrated in $x$ are most direct; shells would require rewriting the curves as $x=g(y)$.",
    "steps": [
      "Intersections: $x=x^2\\Rightarrow x=0,1$; on $(0,1)$, $x>x^2$, so outer radius $R=x$ and inner radius $r=x^2$.",
      "$V=\\pi\\int_0^1\\left(x^2-x^4\\right)dx$.",
      "$\\int_0^1(x^2-x^4)\\,dx=\\frac{1}{3}-\\frac{1}{5}=\\frac{2}{15}$.",
      "$V=\\frac{2\\pi}{15}$."
    ],
    "trap": "Writing $\\pi\\int(x-x^2)^2dx$ (subtracting before squaring) and getting $\\frac{\\pi}{30}$; a washer is the difference of two disk areas, and $\\pi(R^2-r^2)\\ne\\pi(R-r)^2$.",
    "check": "Shells integrated in $y$: $2\\pi\\int_0^1y\\left(\\sqrt y-y\\right)dy$ gives the same result."
  },
  "cx-rev-005": {
    "spot": "The region is on $[0,1]$ under $y=x-x^2$, but it rotates about the $y$-axis: cylindrical shells, radius $x$, height $x-x^2$.",
    "why": "Washers about the $y$-axis would require solving $y=x-x^2$ as $x=\\frac{1\\pm\\sqrt{1-4y}}{2}$ — messy; shells integrate directly in $x$.",
    "steps": [
      "It meets the $x$-axis at $x=0,1$, and in between $x-x^2>0$.",
      "Shells: $V=2\\pi\\int_0^1x\\,(x-x^2)\\,dx=2\\pi\\int_0^1(x^2-x^3)\\,dx$.",
      "$\\int_0^1(x^2-x^3)\\,dx=\\frac{1}{3}-\\frac{1}{4}=\\frac{1}{12}$.",
      "$V=2\\pi\\cdot\\frac{1}{12}=\\frac{\\pi}{6}$."
    ],
    "trap": "Using the disk formula for rotation about the $x$-axis, $\\pi\\int_0^1(x-x^2)^2dx=\\frac{\\pi}{30}$ — that's the volume about the $x$-axis.",
    "check": "Verify with washers in $y$: outer radius $\\frac{1+\\sqrt{1-4y}}{2}$, inner radius $\\frac{1-\\sqrt{1-4y}}{2}$, $R^2-r^2=\\sqrt{1-4y}$, and $\\pi\\int_0^{1/4}\\sqrt{1-4y}\\,dy=\\frac{\\pi}{6}$."
  },
  "cx-ser-005": {
    "spot": "$\\sum\\frac{1}{n}$ is the harmonic series, the $p$-series with $p=1$ — right on the divergent side. Terms going to $0$ doesn't mean the sum converges.",
    "why": "The Integral Test is cleanest: $\\int_1^\\infty\\frac{dx}{x}=\\ln x\\big|_1^\\infty$ diverges; grouping (each group at least $\\frac{1}{2}$) works too.",
    "steps": [
      "The terms $\\frac{1}{n}\\to 0$, but that's only a necessary condition for convergence — no conclusion yet.",
      "Integral Test: $\\frac{1}{x}$ is positive and decreasing, $\\int_1^t\\frac{dx}{x}=\\ln t$, unbounded as $t\\to\\infty$.",
      "Grouping makes it even clearer: $\\frac{1}{3}+\\frac{1}{4}>\\frac{1}{2}$, $\\frac{1}{5}+\\cdots+\\frac{1}{8}>\\frac{1}{2}$, and you can form infinitely many groups each bigger than $\\frac{1}{2}$.",
      "The partial sums exceed $\\ln(n+1)$ and climb to infinity along with $\\ln$, so the harmonic series diverges (divergent)."
    ],
    "trap": "Seeing the terms go to $0$ and saying it converges. $\\frac{1}{n}$ goes to $0$ too slowly; the partial sums creep up to infinity like $\\ln n$.",
    "check": "Compare $\\sum\\frac{1}{n^2}$ ($p=2$), which converges to $\\frac{\\pi^2}{6}$; the $p$-series boundary is at $p=1$, and $p=1$ itself diverges."
  },
  "cx-smid-012": {
    "spot": "The term has $n$ times $\\ln n$, and $\\frac{1}{x\\ln x}$ is exactly the shape of the derivative of $\\ln(\\ln x)$: Integral Test with $u=\\ln x$.",
    "why": "It's hard to find something to compare with (it's smaller than $\\frac{1}{n}$ but bigger than any $\\frac{1}{n^p}$ with $p>1$); the Integral Test with this substitution becomes $\\int\\frac{du}{u^2}$.",
    "steps": [
      "$f(x)=\\frac{1}{x(\\ln x)^2}$ is positive and decreasing for $x\\ge 2$ (the denominator $x(\\ln x)^2$ is increasing).",
      "Let $u=\\ln x$, $du=\\frac{dx}{x}$: $\\int_2^\\infty\\frac{dx}{x(\\ln x)^2}=\\int_{\\ln 2}^\\infty\\frac{du}{u^2}$.",
      "$\\int_{\\ln 2}^\\infty\\frac{du}{u^2}=\\frac{1}{\\ln 2}$, finite.",
      "The integral converges, so the series converges (convergent)."
    ],
    "trap": "Lumping it together with $\\sum\\frac{1}{n\\ln n}$: that one becomes $\\int\\frac{du}{u}$ after substitution and diverges; here the square makes it converge.",
    "check": "The comparison case $\\frac{1}{x\\ln x}$ has antiderivative $\\ln\\ln x$, which is unbounded — the square is what matters."
  },
  "db-tan-001": {
    "spot": "The tangent slope is the derivative value: differentiate the polynomial term by term, then plug in $x=2$.",
    "why": "Power rule term by term — no need for the definition.",
    "steps": [
      "$y'=4x^3-6x$.",
      "Plug in $x=2$: $4\\cdot 8-6\\cdot 2=32-12$.",
      "Slope $20$."
    ],
    "trap": "Taking $y(2)=16-12=4$ as the slope; you have to differentiate first, then plug in.",
    "check": "Secant $\\frac{y(2.01)-y(2)}{0.01}\\approx 20.21$, close to $20$."
  },
  "dd-def-001": {
    "spot": "$\\frac{\\sqrt{9+h}-\\sqrt9}{h}$ is exactly the derivative definition of $\\sqrt x$ at $x=9$; if you don't recognize it, rationalize.",
    "why": "Recognizing the derivative definition gives $\\frac{1}{2\\sqrt9}$ directly; rationalizing is the standard way to break up a $\\frac{0}{0}$.",
    "steps": [
      "Plugging in $h=0$ gives $\\frac{0}{0}$. Multiply by the conjugate: $\\frac{(9+h)-9}{h\\left(\\sqrt{9+h}+3\\right)}=\\frac{1}{\\sqrt{9+h}+3}$.",
      "$h\\to 0$: $\\frac{1}{3+3}=\\frac{1}{6}$.",
      "This is also the value of $(\\sqrt x)'=\\frac{1}{2\\sqrt x}$ at $9$, namely $\\frac{1}{6}$."
    ],
    "trap": "After rationalizing, forgetting to cancel the $h$ in the denominator; or plugging into $\\frac{1}{\\sqrt9}=\\frac{1}{3}$ (missing the $\\frac{1}{2}$ from the derivative formula).",
    "check": "$h=0.01$: $\\frac{\\sqrt{9.01}-3}{0.01}\\approx 0.16662$, slightly below $\\frac{1}{6}$ ($\\sqrt x$ curves downward)."
  },
  "fd-serx-204": {
    "spot": "$\\frac{n}{5^n}=n\\left(\\frac{1}{5}\\right)^n$: $n$ times geometric — use $\\sum nx^n=\\frac{x}{(1-x)^2}$ with $x=\\frac{1}{5}$.",
    "why": "Differentiating the geometric series and multiplying by $x$ gives the formula; shift-and-subtract works too but takes longer.",
    "steps": [
      "$\\sum_{n\\ge0}x^n=\\frac{1}{1-x}$; differentiate and multiply by $x$: $\\sum_{n\\ge1}nx^n=\\frac{x}{(1-x)^2}$.",
      "Plug in $x=\\frac{1}{5}$: $\\frac{1/5}{(4/5)^2}=\\frac{1}{5}\\cdot\\frac{25}{16}$.",
      "$=\\frac{5}{16}$."
    ],
    "trap": "Forgetting to multiply by $x$ after differentiating and using $\\frac{1}{(1-x)^2}=\\frac{25}{16}$ as the answer — that's $\\sum nx^{n-1}$.",
    "check": "The first two terms $\\frac{1}{5}+\\frac{2}{25}=0.28$; the answer $0.3125$ is only a little more, since the later terms are small."
  },
  "lx-app-001": {
    "spot": "Instantaneous velocity = derivative of the position function; $h(t)=80-4.9t^2$, differentiate and plug in $t=2$.",
    "why": "The derivative is the limit of the average velocity as the time interval goes to $0$; for a polynomial just use the power rule.",
    "steps": [
      "$h'(t)=-9.8t$.",
      "Plug in $t=2$: $-9.8\\cdot 2=-19.6$ (the minus sign means downward).",
      "Confirm with the definition: average velocity $\\frac{h(2+\\Delta t)-h(2)}{\\Delta t}=-19.6-4.9\\Delta t\\to-19.6$."
    ],
    "trap": "Computing the average velocity over $0$ to $2$ seconds, $\\frac{h(2)-h(0)}{2}=-9.8$; instantaneous velocity requires a limit.",
    "check": "The average velocity with $\\Delta t=0.01$ is $-19.649$, slightly faster than $-19.6$ (the stone is speeding up)."
  },
  "lx-tab-001": {
    "spot": "The table approaches $3$ from both sides: $5.9,5.99$ from below and $6.01$ from above, all heading to $6$. And $x^2-9=(x-3)(x+3)$ cancels, confirming it.",
    "why": "The conclusion guessed from the table is made rigorous by factoring and canceling $x-3$.",
    "steps": [
      "Table: $f(2.99)=5.99$, $f(3.01)=6.01$ — both sides are only $0.01$ from $6$.",
      "Cancel: for $x\\ne 3$, $\\frac{x^2-9}{x-3}=x+3$.",
      "$x\\to 3$: $3+3=6$ ($f(3)$ itself is undefined, which doesn't affect the limit)."
    ],
    "trap": "Saying the limit doesn't exist because $f(3)$ is undefined — a limit only looks near the point, not at it.",
    "check": "The pattern in the table: $f(x)-6=x-3$, so the error equals the distance from $3$."
  },
  "tb-tan-002": {
    "spot": "Tangent slope = derivative value. $\\frac{1}{x}=x^{-1}$, power rule.",
    "why": "Writing it as a negative power and using the power rule is fastest — no Quotient Rule needed.",
    "steps": [
      "$\\frac{d}{dx}x^{-1}=-x^{-2}=-\\frac{1}{x^2}$.",
      "Plug in $x=3$: $-\\frac{1}{9}$.",
      "The slope is $-\\frac{1}{9}$."
    ],
    "trap": "Dropping the minus sign and answering $\\frac{1}{9}$: $\\frac{1}{x}$ is decreasing for $x>0$, so the slope must be negative.",
    "check": "Secant $\\frac{\\frac{1}{3.01}-\\frac{1}{3}}{0.01}\\approx-0.1107$, close to $-0.111$."
  },
  "vc-nab-004": {
    "spot": "$\\nabla\\times(\\nabla f)$: the curl of a gradient, which by an identity is $\\mathbf{0}$ for any $f$ with continuous second partials — mixed partials commute.",
    "why": "Recognize the identity and answer $0$ directly; computing one component by hand to confirm the mixed partials agree is enough.",
    "steps": [
      "$\\nabla f=\\left(2xy,\\ x^2,\\ 3z^2\\right)$.",
      "$z$-component: $\\frac{\\partial}{\\partial x}(x^2)-\\frac{\\partial}{\\partial y}(2xy)=2x-2x=0$.",
      "The other two components: $\\frac{\\partial(3z^2)}{\\partial y}-\\frac{\\partial(x^2)}{\\partial z}=0$, $\\frac{\\partial(2xy)}{\\partial z}-\\frac{\\partial(3z^2)}{\\partial x}=0$.",
      "All three components are $0$, so the length is $0$."
    ],
    "trap": "Confusing curl with divergence: $\\nabla\\cdot(\\nabla f)=\\nabla^2f=2y+6z$, which is not $0$.",
    "check": "Try another $f=\\sin(xy)$ on the $z$-component: $\\partial_x\\partial_yf-\\partial_y\\partial_xf$ is again $0$."
  },
  "vc-work-001": {
    "spot": "$y\\,dx+x\\,dy=d(xy)$: the field $(y,x)$ is conservative with potential $\\phi=xy$. The line integral depends only on the endpoints.",
    "why": "For a conservative field, potential at the end minus potential at the start does it in one step — no need to parametrize the path.",
    "steps": [
      "Find the potential: $\\phi=xy$ satisfies $\\phi_x=y$, $\\phi_y=x$.",
      "Line integral $=\\phi(2,3)-\\phi(0,0)=6-0$.",
      "Check by parametrizing: $x=2t$, $y=3t$, $\\int_0^1(3t\\cdot 2+2t\\cdot 3)\\,dt=\\int_0^112t\\,dt=6$."
    ],
    "trap": "When parametrizing, forgetting the factors $dx=2\\,dt$, $dy=3\\,dt$, getting $\\int_0^1(3t+2t)\\,dt=2.5$.",
    "check": "Take another path (along the $x$-axis to $(2,0)$, then up): the first leg has $y=0$ and contributes $0$; the second has $x=2$, $\\int_0^32\\,dy=6$. Same."
  },
  "cx-curve-005": {
    "spot": "The numerator is one degree higher than the denominator: divide, and the quotient is the slant asymptote. $\\frac{x^2+2x+3}{x}=x+2+\\frac{3}{x}$, so $k=2$ at a glance.",
    "why": "Long division (here just term-by-term division) gives $y=x+2$ directly; using $k=\\lim(f(x)-x)$ is the same thing.",
    "steps": [
      "Divide term by term: $\\frac{x^2+2x+3}{x}=x+2+\\frac{3}{x}$.",
      "Slope $m=\\lim\\frac{f(x)}{x}=1$.",
      "Intercept $k=\\lim(f(x)-x)=\\lim\\left(2+\\frac{3}{x}\\right)=2$."
    ],
    "trap": "Thinking the slant asymptote is $y=x$ (looking only at the top degree) and missing the constant $2$; or taking the remainder $3$ as $k$.",
    "check": "$x=100$: $f(100)=102.03$, only $0.03$ away from $y=x+2=102$."
  },
  "cx-hm-002": {
    "spot": "$\\int_0^{\\pi/2}$ with $\\tan$ raised to a strange power $\\sqrt2$: you can't work with that power at all — the signal is the symmetric substitution $x\\to\\frac{\\pi}{2}-x$, which turns $\\tan$ into $\\cot$.",
    "why": "Adding the original to the substituted version makes the integrand the constant $1$; direct integration is impossible.",
    "steps": [
      "Let $x\\to\\frac{\\pi}{2}-x$: $\\tan\\to\\cot=\\frac{1}{\\tan}$, so $I=\\int_0^{\\pi/2}\\frac{dx}{1+\\cot^{\\sqrt2}x}=\\int_0^{\\pi/2}\\frac{\\tan^{\\sqrt2}x}{1+\\tan^{\\sqrt2}x}dx$.",
      "Add the two integrands: $\\frac{1}{1+t}+\\frac{t}{1+t}=1$ ($t=\\tan^{\\sqrt2}x$).",
      "So $2I=\\int_0^{\\pi/2}1\\,dx=\\frac{\\pi}{2}$.",
      "$I=\\frac{\\pi}{4}$."
    ],
    "trap": "Trying to simplify $\\tan^{\\sqrt2}x$ or substitute $u=\\tan x$ — a dead end; with any positive exponent the answer is $\\frac{\\pi}{4}$, so the exponent doesn't matter at all.",
    "check": "The integrand is $\\frac{1}{2}$ at $x=\\frac{\\pi}{4}$ and complementary-symmetric about that point, so the average value $\\frac{1}{2}$ times the interval length $\\frac{\\pi}{2}$ gives exactly $\\frac{\\pi}{4}$."
  },
  "cx-seq-004": {
    "spot": "$a_{n+1}=\\sqrt{2a_n}$ is a recursive sequence: assume the limit $L$ exists and take limits on both sides to get $L=\\sqrt{2L}$; then confirm the sequence is increasing and bounded above.",
    "why": "The fixed-point equation gives the candidates in one line; writing $a_n=2^{1-1/2^n}$ even shows the limit directly.",
    "steps": [
      "Suppose $a_n\\to L$; taking limits: $L=\\sqrt{2L}\\Rightarrow L^2=2L$, so $L=0$ or $2$.",
      "The sequence starts at $\\sqrt2\\approx 1.414$, increases, and stays below $2$ (if $a_n<2$ then $\\sqrt{2a_n}<2$), so $L\\ne 0$.",
      "Closed form: $a_n=2^{1-1/2^n}$ ($a_1=2^{1/2}$, and $\\sqrt{2\\cdot 2^{1-1/2^n}}=2^{1-1/2^{n+1}}$).",
      "$2^{-n}\\to 0$, so $a_n\\to 2^1=2$."
    ],
    "trap": "After solving $L^2=2L$, also taking $L=0$ as an answer: the sequence starts at $\\sqrt2$ and increases, so it can't head to $0$.",
    "check": "$a_2=\\sqrt{2\\sqrt2}\\approx 1.682$, $a_3\\approx 1.834$, climbing steadily toward $2$."
  },
  "db-itrig-002": {
    "spot": "Inside $\\arctan$ is $x^2$, not $x$: Chain Rule, outer $\\frac{1}{1+u^2}$, inner $2x$.",
    "why": "Remember $(\\arctan u)'=\\frac{1}{1+u^2}$, and the Chain Rule does it in one step.",
    "steps": [
      "Outer: $\\frac{d}{du}\\arctan u=\\frac{1}{1+u^2}$.",
      "Substitute $u=x^2$: $\\frac{1}{1+x^4}$; inner $(x^2)'=2x$.",
      "Multiply: $\\frac{2x}{1+x^4}$."
    ],
    "trap": "Writing the outer part as $\\frac{1}{1+x^2}$ (forgetting that $u=x^2$ squared is $x^4$), getting $\\frac{2x}{1+x^2}$.",
    "check": "$x=1$: $\\frac{2}{2}=1$; the secant $\\frac{\\arctan(1.0201)-\\arctan 1}{0.01}\\approx 0.995$."
  },
  "db-lin-004": {
    "spot": "$\\frac{\\pi}{6}+\\frac{\\pi}{180}$ is a familiar angle $30^\\circ$ plus a small amount $1^\\circ$: linear approximation $f(a+h)\\approx f(a)+f'(a)h$ with $a=\\frac{\\pi}{6}$.",
    "why": "At $\\frac{\\pi}{6}$ both $\\sin$ and $\\cos$ are known values, so the tangent line gives the approximation in one step; angles must be in radians.",
    "steps": [
      "$f(x)=\\sin x$, $a=\\frac{\\pi}{6}$, $h=\\frac{\\pi}{180}$ ($1^\\circ$ converted to radians).",
      "$f'(a)=\\cos\\frac{\\pi}{6}=\\frac{\\sqrt3}{2}$.",
      "$\\sin\\left(\\frac{\\pi}{6}+\\frac{\\pi}{180}\\right)\\approx\\frac{1}{2}+\\frac{\\sqrt3}{2}\\cdot\\frac{\\pi}{180}=\\frac{1}{2}+\\frac{\\sqrt3\\,\\pi}{360}$."
    ],
    "trap": "Using $h=1$ (not converting degrees to radians) gives $\\frac{1}{2}+\\frac{\\sqrt3}{2}\\approx 1.37$, which is even outside the range of $\\sin$.",
    "check": "The true value $\\sin 31^\\circ\\approx 0.51504$; the approximation $\\approx 0.51511$ is slightly larger — $\\sin$ curves downward here, so the tangent line lies above the curve."
  }
};
