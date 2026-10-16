// Detail v2, English — batch 030. Translation of tools/content/detail/030.js (text only; claims live in the Chinese file).
module.exports = {
  "cl-lim-041": {
    "spot": "Pull $n$ out of the denominator $\\sqrt{n^2+2kn}$ and each term becomes $\\frac{1}{n}\\cdot\\frac{1}{\\sqrt{1+2\\frac{k}{n}}}$ — $\\frac{1}{n}$ times a function of $\\frac{k}{n}$, which is a Riemann sum on $[0,1]$.",
    "why": "A sum of $n$ terms, each of size about $\\frac{1}{n}$, can only be handled by turning the Riemann sum into an integral; the partial sums have no closed form.",
    "steps": [
      "Factor out $n$: $\\frac{1}{\\sqrt{n^2+2kn}}=\\frac{1}{n}\\cdot\\frac{1}{\\sqrt{1+2k/n}}$.",
      "So the sum is a right-endpoint Riemann sum for $f(x)=\\frac{1}{\\sqrt{1+2x}}$, and the limit is $=\\int_0^1\\frac{dx}{\\sqrt{1+2x}}$.",
      "Antiderivative: $\\left(\\sqrt{1+2x}\\right)'=\\frac{1}{\\sqrt{1+2x}}$.",
      "Plug in the limits: $\\sqrt 3-\\sqrt 1=\\sqrt 3-1\\approx 0.732$."
    ],
    "trap": "Not factoring out $n$, seeing \"$n$ terms, each about $\\frac{1}{n}$\" and guessing the limit is $1$; every term is actually smaller than $\\frac{1}{n}$, and the later ones much smaller.",
    "check": "Compute $n=2$: $\\frac{1}{\\sqrt 8}+\\frac{1}{\\sqrt{12}}\\approx 0.642$; $f$ is decreasing, so the right-endpoint sum underestimates and sits below the answer."
  },
  "cl-lim-043": {
    "spot": "$\\frac{k}{n^2}=\\frac{1}{n}\\cdot\\frac{k}{n}$, and $\\sin\\frac{k\\pi}{n}$ depends only on $\\frac{k}{n}$ too — the whole sum is a Riemann sum for $x\\sin(\\pi x)$ on $[0,1]$.",
    "why": "Read $\\frac{k}{n}$ as $x$ and $\\frac{1}{n}$ as $dx$, and the limit becomes a definite integral done by integration by parts.",
    "steps": [
      "Rewrite: $\\sum_{k=1}^n\\frac{1}{n}\\cdot\\frac{k}{n}\\sin\\left(\\pi\\frac{k}{n}\\right)\\to\\int_0^1x\\sin(\\pi x)\\,dx$.",
      "Integration by parts: $u=x$, $dv=\\sin(\\pi x)\\,dx$, antiderivative $-\\frac{x\\cos(\\pi x)}{\\pi}+\\frac{\\sin(\\pi x)}{\\pi^2}$.",
      "At $1$: $-\\frac{\\cos\\pi}{\\pi}=\\frac{1}{\\pi}$; at $0$: $0$.",
      "Limit $=\\frac{1}{\\pi}\\approx 0.318$."
    ],
    "trap": "Treating $\\frac{k}{n^2}$ as $\\frac{1}{n}$ and losing a factor of $x$, getting $\\int_0^1\\sin(\\pi x)\\,dx=\\frac{2}{\\pi}$.",
    "check": "Compute $n=4$: $\\frac{1}{16}\\left(\\sin\\frac{\\pi}{4}+2\\sin\\frac{\\pi}{2}+3\\sin\\frac{3\\pi}{4}\\right)\\approx 0.302$, already close to $0.318$."
  },
  "db-logd-003": {
    "spot": "Both base and exponent contain $x$: $(\\sqrt x)^x$ is neither a power function nor an exponential, so take logs to bring the exponent down.",
    "why": "Logarithmic differentiation turns \"a variable to a variable power\" into the product $\\frac{x}{2}\\ln x$; the $x^n$ or $a^x$ formulas both give wrong answers.",
    "steps": [
      "Simplify first: $(\\sqrt x)^x=x^{x/2}$, take logs: $\\ln y=\\frac{x}{2}\\ln x$.",
      "Differentiate both sides: $\\frac{y'}{y}=\\frac{1}{2}\\ln x+\\frac{x}{2}\\cdot\\frac{1}{x}=\\frac{\\ln x+1}{2}$.",
      "Multiply back by $y$: $y'=x^{x/2}\\cdot\\frac{\\ln x+1}{2}$."
    ],
    "trap": "Differentiating as a power function: $x\\cdot(\\sqrt x)^{x-1}\\cdot\\frac{1}{2\\sqrt x}$ — this only accounts for the changing base and misses the $\\ln$ term from the exponent $x$ also changing.",
    "check": "At $x=1$: $y'=\\frac{0+1}{2}=\\frac{1}{2}$, matching the numerical derivative."
  },
  "db-newt-003": {
    "spot": "Newton's method needs \"some function $=0$\": first rewrite $\\cos x=x$ as $f(x)=\\cos x-x$, then apply $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$.",
    "why": "The formula is one step; the key is getting the signs of $f$ and $f'$ right.",
    "steps": [
      "$f(x)=\\cos x-x$, $f(1)=\\cos 1-1$.",
      "$f'(x)=-\\sin x-1$, $f'(1)=-(\\sin 1+1)$.",
      "$x_1=1-\\frac{\\cos 1-1}{-(\\sin 1+1)}=1+\\frac{\\cos 1-1}{\\sin 1+1}\\approx 0.7504$."
    ],
    "trap": "Dropping the minus sign in $f'$ gives $1-\\frac{\\cos 1-1}{\\sin 1+1}\\approx 1.25$, which moves further from the root.",
    "check": "The true root is about $0.739$; plugging in $x_1$ gives $\\cos x_1-x_1\\approx-0.019$, much smaller than $f(1)\\approx-0.46$."
  },
  "db-tan-006": {
    "spot": "You want not $\\sin\\frac{\\pi}{2}$ but the height of \"the tangent line at $\\frac{\\pi}{3}$\" at $\\frac{\\pi}{2}$: write the tangent line $y=f(a)+f'(a)(x-a)$ first, then plug in.",
    "why": "The tangent line needs just a point and a slope; plugging in $x=\\frac{\\pi}{2}$ gives the linear approximation estimate.",
    "steps": [
      "Point: $\\sin\\frac{\\pi}{3}=\\frac{\\sqrt 3}{2}$.",
      "Slope: $\\cos\\frac{\\pi}{3}=\\frac{1}{2}$.",
      "Tangent line $y=\\frac{\\sqrt 3}{2}+\\frac{1}{2}\\left(x-\\frac{\\pi}{3}\\right)$; at $x=\\frac{\\pi}{2}$, $x-\\frac{\\pi}{3}=\\frac{\\pi}{6}$, giving $\\frac{\\sqrt 3}{2}+\\frac{\\pi}{12}$."
    ],
    "trap": "Answering $\\sin\\frac{\\pi}{2}=1$ directly — that is the value of the curve, not the tangent line.",
    "check": "$\\sin x$ is concave down on $(0,\\pi)$, so the tangent line lies above the curve: the answer $\\approx 1.128$ should exceed $1$."
  },
  "dd-grw-002": {
    "spot": "\"Exponential growth\" means $P=P_0e^{kt}$, and $P'=kP$: two data points fix $k$, and the growth rate is $k$ times the population at that moment.",
    "why": "With $P'=kP$ you never have to differentiate $P(t)$; just find $k$ and $P(4)$ and multiply.",
    "steps": [
      "$500e^{2k}=800$, $e^{2k}=1.6$, $k=\\frac{\\ln 1.6}{2}$.",
      "$P(4)=500\\left(e^{2k}\\right)^2=500\\cdot 1.6^2=1280$.",
      "$P'(4)=kP(4)=\\frac{\\ln 1.6}{2}\\cdot 1280=640\\ln 1.6\\approx 300.8$."
    ],
    "trap": "Using the average rate $\\frac{800-500}{2}=150$ as the growth rate, or taking $P(4)$ as $1100$ (linear extrapolation); exponential growth already reaches $1280$ at $t=4$.",
    "check": "Compare with the average rate from $P(2)\\to P(4)$: $\\frac{1280-800}{2}=240$. Since $t=4$ is the right end of that interval, where growth is fastest, the instantaneous rate must be larger."
  },
  "dd-log-003": {
    "spot": "In $(\\cos x)^{\\sin x}$ both base and exponent vary with $x$ — a standard logarithmic differentiation problem: $\\ln y=\\sin x\\ln(\\cos x)$.",
    "why": "After taking logs only the Product Rule and Chain Rule remain; the power or exponential formula alone handles only half.",
    "steps": [
      "Take logs: $\\ln y=\\sin x\\cdot\\ln(\\cos x)$ (when $\\cos x>0$).",
      "Product Rule: $\\frac{y'}{y}=\\cos x\\ln(\\cos x)+\\sin x\\cdot\\frac{-\\sin x}{\\cos x}$.",
      "Multiply back by $y$: $y'=(\\cos x)^{\\sin x}\\left(\\cos x\\ln(\\cos x)-\\frac{\\sin^2x}{\\cos x}\\right)$."
    ],
    "trap": "Differentiating $\\ln(\\cos x)$ without the inner $-\\sin x$, writing $\\frac{\\sin x}{\\cos x}$, which flips the sign.",
    "check": "At $x=0$: $y=1$, the bracket is $1\\cdot\\ln 1-0=0$, so $y'(0)=0$."
  },
  "dd-log-006": {
    "spot": "$x^{\\sqrt x}$: there is an $x$ in the exponent and an $x$ in the base, so take logs to get $\\sqrt x\\ln x$, then differentiate.",
    "why": "Logarithmic differentiation turns the power into a product; the power rule for $x^n$ misses the term from the changing exponent.",
    "steps": [
      "$\\ln y=\\sqrt x\\,\\ln x$.",
      "Product Rule: $\\frac{y'}{y}=\\frac{\\ln x}{2\\sqrt x}+\\frac{\\sqrt x}{x}=\\frac{\\ln x+2}{2\\sqrt x}$.",
      "Multiply back by $y$: $y'=x^{\\sqrt x}\\cdot\\frac{\\ln x+2}{2\\sqrt x}$."
    ],
    "trap": "Simplifying $\\frac{\\sqrt x}{x}$ wrongly, e.g. to $\\frac{1}{2\\sqrt x}$; in fact $\\frac{\\sqrt x}{x}=\\frac{1}{\\sqrt x}=\\frac{2}{2\\sqrt x}$, so the numerator is $\\ln x+2$, not $\\ln x+1$.",
    "check": "At $x=1$: $y'=1\\cdot\\frac{0+2}{2}=1$."
  },
  "depth-der-009": {
    "spot": "Second derivative of a parametric curve: $\\frac{d^2y}{dx^2}$ is \"the derivative of $\\frac{dy}{dx}$ with respect to $x$\" — differentiate in $t$ first, then divide by $\\frac{dx}{dt}$.",
    "why": "$\\frac{d^2y}{dx^2}=\\frac{\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)}{\\frac{dx}{dt}}$; simply taking $\\frac{y''(t)}{x''(t)}$ is wrong.",
    "steps": [
      "$\\frac{dy}{dx}=\\frac{3t^2}{2t}=\\frac{3t}{2}$.",
      "Differentiate in $t$: $\\frac{d}{dt}\\left(\\frac{3t}{2}\\right)=\\frac{3}{2}$.",
      "Divide by $\\frac{dx}{dt}=2t$: $\\frac{d^2y}{dx^2}=\\frac{3}{4t}$; at $t=1$ this is $\\frac{3}{4}$."
    ],
    "trap": "Using $\\frac{y''(t)}{x''(t)}=\\frac{6t}{2}=3$ and answering $3$ at $t=1$.",
    "check": "Eliminate the parameter: $y=x^{3/2}$ (for $t>0$), $y''=\\frac{3}{4}x^{-1/2}$, which is also $\\frac{3}{4}$ at $x=1$."
  },
  "der-068": {
    "spot": "$F=ue^v$ is a product, and $v=\\sin x$ sits inside an exponential: Product Rule plus one layer of Chain Rule.",
    "why": "Substituting $u,v$ back to get $x^2e^{\\sin x}$ and differentiating directly is the least likely to drop a term.",
    "steps": [
      "Substitute back: $F=x^2e^{\\sin x}$.",
      "Product Rule: $(x^2)'e^{\\sin x}=2xe^{\\sin x}$.",
      "Chain Rule: $\\left(e^{\\sin x}\\right)'=e^{\\sin x}\\cos x$, times $x^2$.",
      "Together: $F'=e^{\\sin x}\\left(2x+x^2\\cos x\\right)$."
    ],
    "trap": "Differentiating $e^{\\sin x}$ to just $e^{\\sin x}$, missing the inner $\\cos x$, and getting $e^{\\sin x}(2x+x^2)$.",
    "check": "At $x=0$: $F'(0)=e^0\\cdot 0=0$."
  },
  "exam-der-011": {
    "spot": "Numerator $(x^2+1)^3$, denominator $x-1$: Quotient Rule, with the Chain Rule on the numerator, and finally factor out $(x^2+1)^2$.",
    "why": "The Quotient Rule does it in one go; factoring out the common factor gives a tidy final form.",
    "steps": [
      "Derivative of the numerator: $\\left((x^2+1)^3\\right)'=3(x^2+1)^2\\cdot 2x=6x(x^2+1)^2$.",
      "Quotient Rule: $\\frac{6x(x^2+1)^2(x-1)-(x^2+1)^3\\cdot 1}{(x-1)^2}$.",
      "Factor out $(x^2+1)^2$: $\\frac{(x^2+1)^2\\left(6x(x-1)-(x^2+1)\\right)}{(x-1)^2}$."
    ],
    "trap": "Forgetting the inner $2x$ in the numerator's derivative and writing $3(x^2+1)^2$; or reversing the order in the Quotient Rule numerator, which flips the sign.",
    "check": "At $x=0$: $\\frac{1\\cdot(0-1)}{1}=-1$."
  },
  "exam-der-013": {
    "spot": "$x,y$ are both given in terms of $t$: $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$, differentiate each in $t$ and divide.",
    "why": "No need to eliminate $t$ for parametric equations; divide the two derivatives to get the slope.",
    "steps": [
      "$\\frac{dy}{dt}=3t^2-1$, which is $=11$ at $t=2$.",
      "$\\frac{dx}{dt}=2t$, which is $=4$ at $t=2$.",
      "$\\frac{dy}{dx}=\\frac{11}{4}$."
    ],
    "trap": "Swapping numerator and denominator and answering $\\frac{4}{11}$.",
    "check": "Estimate with a secant: from $t=1.99$ to $2.01$, $\\frac{\\Delta y}{\\Delta x}$ is also very close to $2.75$."
  },
  "exam-lim-001": {
    "spot": "The numerator deliberately subtracts $3x$ and adds $\\frac{9}{2}x^3$ — exactly the first two Taylor terms of $\\sin(3x)$, leaving the $x^5$ term, and the denominator is $x^5$.",
    "why": "The Taylor expansion shows the answer in one line; L'Hôpital's Rule would need five derivatives.",
    "steps": [
      "$\\sin u=u-\\frac{u^3}{6}+\\frac{u^5}{120}-\\cdots$, substitute $u=3x$.",
      "First two terms: $3x-\\frac{27x^3}{6}=3x-\\frac{9}{2}x^3$, which cancel exactly with what the numerator subtracts.",
      "What remains is $\\frac{3^5x^5}{120}=\\frac{243}{120}x^5=\\frac{81}{40}x^5$; dividing by $x^5$ gives $\\frac{81}{40}$."
    ],
    "trap": "Forgetting to multiply the $x^5$ coefficient by $3^5$ and answering $\\frac{1}{120}$.",
    "check": "At $x=0.1$ the ratio is about $2.024$, close to $\\frac{81}{40}=2.025$."
  },
  "exam-lim-009": {
    "spot": "$x-\\sin x$ and $1-\\cos x$ are the classic pair where the first Taylor term cancels: numerator $\\sim\\frac{x^3}{6}$, denominator $x\\cdot\\frac{x^2}{2}$.",
    "why": "Replace each by its leading term and you are done; L'Hôpital's Rule needs three derivatives and the product in the denominator gets messy.",
    "steps": [
      "Numerator: $x-\\sin x\\sim\\frac{x^3}{6}$.",
      "Denominator: $1-\\cos x\\sim\\frac{x^2}{2}$, so $x(1-\\cos x)\\sim\\frac{x^3}{2}$.",
      "Divide: $\\frac{1/6}{1/2}=\\frac{1}{3}$."
    ],
    "trap": "Plugging $\\sin x\\approx x$ straight into the numerator and getting $\\frac{0}{\\cdots}=0$; the first-order approximations all cancel here, so expand one more term.",
    "check": "At $x=0.1$ the ratio is about $0.3333$."
  },
  "exam-lim-017": {
    "spot": "The expansions of $\\cos x$ and $e^{-x^2/2}$ share the first two terms $1-\\frac{x^2}{2}$, and the denominator $x^4$ asks for the difference of their $x^4$ coefficients.",
    "why": "Expand to fourth order and compare coefficients; L'Hôpital's Rule would take four rounds.",
    "steps": [
      "$\\cos x=1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\cdots$.",
      "$e^{-x^2/2}=1-\\frac{x^2}{2}+\\frac{1}{2}\\left(\\frac{x^2}{2}\\right)^2-\\cdots=1-\\frac{x^2}{2}+\\frac{x^4}{8}-\\cdots$.",
      "Subtract: $\\frac{1}{24}-\\frac{1}{8}=-\\frac{1}{12}$."
    ],
    "trap": "Forgetting to divide by $2$ in the $\\frac{u^2}{2}$ term of the expansion of $e^{u}$, taking the $x^4$ coefficient as $\\frac{1}{4}$, and getting $-\\frac{5}{24}$.",
    "check": "At $x=0.2$ the ratio is about $-0.0826$, approaching $-\\frac{1}{12}\\approx-0.0833$ from above."
  },
  "exam-ser-013": {
    "spot": "$n(n+1)$ times $\\left(\\frac{1}{2}\\right)^n$: $n(n+1)x^{n-1}$ is exactly the second derivative of $x^{n+1}$ — differentiate a geometric series twice.",
    "why": "The power series $\\sum x^{n+1}=\\frac{x^2}{1-x}$ can be differentiated term by term; more direct than splitting into $\\sum n^2$ and $\\sum n$.",
    "steps": [
      "$\\sum_{n\\ge 1}x^{n+1}=\\frac{x^2}{1-x}$ (for $|x|<1$).",
      "Differentiate twice: $\\sum n(n+1)x^{n-1}=\\left(\\frac{x^2}{1-x}\\right)''=\\frac{2}{(1-x)^3}$.",
      "Multiply by $x$: $\\sum n(n+1)x^n=\\frac{2x}{(1-x)^3}$; at $x=\\frac{1}{2}$: $\\frac{1}{1/8}=8$.",
      "So the sum is $8$."
    ],
    "trap": "Forgetting to multiply back by $x$ and plugging $\\frac{1}{2}$ into $\\frac{2}{(1-x)^3}$ to get $16$.",
    "check": "First few terms: $1+\\frac{6}{4}+\\frac{12}{8}+\\frac{20}{16}=5.25$, still climbing, and it ends at $8$."
  },
  "exam-ser-014": {
    "spot": "The coefficient has $4^n$ and $\\sqrt{n+1}$: under the Ratio Test $\\sqrt{\\frac{n+1}{n+2}}\\to 1$, leaving only $4|x|$.",
    "why": "The Ratio Test turns the square-root part into a ratio tending to $1$, so the radius of convergence is set by $4^n$.",
    "steps": [
      "Ratio: $\\left|\\frac{a_{n+1}}{a_n}\\right|=4|x|\\sqrt{\\frac{n+1}{n+2}}$.",
      "As $n\\to\\infty$: $\\sqrt{\\frac{n+1}{n+2}}\\to 1$, so the ratio limit is $=4|x|$.",
      "It converges when $4|x|<1$, so $R=\\frac{1}{4}$."
    ],
    "trap": "Answering $4$ (taking the ratio limit as the radius); $R$ is its reciprocal.",
    "check": "The Root Test agrees: $\\left(\\frac{4^n}{\\sqrt{n+1}}\\right)^{1/n}\\to 4$."
  },
  "gap-der-polar-001": {
    "spot": "Tangent slope of a polar curve: write $x=r\\cos\\theta$, $y=r\\sin\\theta$ and treat them as parametric equations in $\\theta$.",
    "why": "$\\frac{dy}{dx}=\\frac{dy/d\\theta}{dx/d\\theta}$; using $\\frac{dr}{d\\theta}$ as the slope is wrong.",
    "steps": [
      "$y=(1+\\cos\\theta)\\sin\\theta$, $\\frac{dy}{d\\theta}=-\\sin^2\\theta+(1+\\cos\\theta)\\cos\\theta$; at $\\frac{\\pi}{2}$ it is $-1$.",
      "$x=(1+\\cos\\theta)\\cos\\theta$, $\\frac{dx}{d\\theta}=-\\sin\\theta\\cos\\theta-(1+\\cos\\theta)\\sin\\theta$; at $\\frac{\\pi}{2}$ it is $-1$.",
      "Divide: $\\frac{dy}{dx}=\\frac{-1}{-1}=1$."
    ],
    "trap": "Taking $\\frac{dr}{d\\theta}=-\\sin\\frac{\\pi}{2}=-1$ as the slope; that is the rate of change of $r$ with angle, not $\\frac{dy}{dx}$.",
    "check": "Geometry: the point at $\\theta=\\frac{\\pi}{2}$ is $(0,1)$; as $\\theta$ increases, $x,y$ both decrease, so the slope is positive — consistent."
  },
  "hc-der-006": {
    "spot": "A high-order derivative at $0$: don't differentiate eight times, read the Taylor coefficient. $e^{x^2}=\\sum\\frac{x^{2k}}{k!}$, and the $x^8$ term comes from $k=4$.",
    "why": "$f^{(8)}(0)=8!\\times(x^8\\text{ coefficient})$; differentiating eight times directly produces a pile of Product Rule terms.",
    "steps": [
      "$e^{u}=\\sum\\frac{u^k}{k!}$, substitute $u=x^2$: the coefficient of $x^8$ is $\\frac{1}{4!}=\\frac{1}{24}$.",
      "Taylor coefficient $=\\frac{f^{(8)}(0)}{8!}$, so $f^{(8)}(0)=\\frac{8!}{4!}=8\\cdot7\\cdot6\\cdot5$.",
      "$f^{(8)}(0)=1680$."
    ],
    "trap": "Giving the coefficient $\\frac{1}{24}$ as the answer and forgetting to multiply by $8!$; or using $\\frac{1}{8!}$ as the coefficient (treating $x^2$ as $x$) and getting $1$.",
    "check": "Same logic at low order: the $x^2$ coefficient is $1$, so $f''(0)=2!\\cdot 1=2$."
  },
  "hc-ibp-008": {
    "spot": "$x^4\\ln(1+x)$: polynomial times logarithm; differentiating the log is what simplifies it, so $u=\\ln(1+x)$, $dv=x^4dx$.",
    "why": "After integration by parts you are left with $\\frac{x^5}{1+x}$, which long division handles; the other choice gets harder each step.",
    "steps": [
      "By parts: $\\left[\\frac{x^5}{5}\\ln(1+x)\\right]_0^1-\\frac{1}{5}\\int_0^1\\frac{x^5}{1+x}\\,dx$, with the first term $=\\frac{\\ln 2}{5}$.",
      "Long division: $\\frac{x^5}{1+x}=x^4-x^3+x^2-x+1-\\frac{1}{1+x}$.",
      "Integrate: $\\frac15-\\frac14+\\frac13-\\frac12+1-\\ln 2=\\frac{47}{60}-\\ln 2$.",
      "Combine: $\\frac{\\ln 2}{5}-\\frac{1}{5}\\left(\\frac{47}{60}-\\ln 2\\right)=\\frac{2\\ln 2}{5}-\\frac{47}{300}$."
    ],
    "trap": "Dropping the final $-\\frac{1}{1+x}$ in the long division loses a $\\frac{\\ln 2}{5}$, giving $\\frac{\\ln 2}{5}-\\frac{47}{300}$.",
    "check": "Size: $0\\le x^4\\ln(1+x)\\le x^4\\ln 2$, so the answer lies between $0$ and $\\frac{\\ln 2}{5}\\approx 0.139$."
  },
  "hc-ibp-010": {
    "spot": "$x^3\\arctan x$: differentiating $\\arctan$ gives $\\frac{1}{1+x^2}$. Choose the antiderivative of $x^3$ as $\\frac{x^4-1}{4}$ (adding the constant $-\\frac14$), which cancels neatly with the denominator $1+x^2$.",
    "why": "Subtracting the extra $\\frac{1}{4}$ makes the boundary term $0$ at both $0$ and $1$, and the remaining integrand reduces straight to a polynomial.",
    "steps": [
      "Integration by parts: $u=\\arctan x$, $v=\\frac{x^4-1}{4}$; $v'=x^3$.",
      "Boundary term $\\left[\\frac{x^4-1}{4}\\arctan x\\right]_0^1=0-0=0$.",
      "What remains is $-\\int_0^1\\frac{x^4-1}{4(1+x^2)}\\,dx=-\\frac14\\int_0^1(x^2-1)\\,dx$.",
      "$-\\frac14\\left(\\frac13-1\\right)=\\frac16$."
    ],
    "trap": "The usual choice $v=\\frac{x^4}{4}$ also works, but remember the last term in $\\frac{x^4}{1+x^2}=x^2-1+\\frac{1}{1+x^2}$; dropping it gives $\\frac{\\pi}{16}+\\frac16$.",
    "check": "Check with the usual choice: $\\frac{\\pi}{16}-\\frac14\\left(\\frac13-1+\\frac{\\pi}{4}\\right)=\\frac16$."
  },
  "hc-spec-007": {
    "spot": "The denominator is a product of five consecutive integers: $\\frac{1}{n(n+1)\\cdots(n+4)}$ splits into a difference of reciprocals of four-term products, which telescopes.",
    "why": "$\\frac{1}{n\\cdots(n+3)}-\\frac{1}{(n+1)\\cdots(n+4)}=\\frac{4}{n\\cdots(n+4)}$; much simpler than partial fractions with five terms.",
    "steps": [
      "Identity: $\\frac{1}{n(n+1)(n+2)(n+3)(n+4)}=\\frac14\\left(\\frac{1}{n(n+1)(n+2)(n+3)}-\\frac{1}{(n+1)(n+2)(n+3)(n+4)}\\right)$.",
      "It telescopes, leaving only the first term $\\frac14\\cdot\\frac{1}{1\\cdot2\\cdot3\\cdot4}$.",
      "Sum $=\\frac{1}{96}$."
    ],
    "trap": "Forgetting the leading $\\frac14$ (the coefficient from the split is $\\frac{1}{(n+4)-n}$) and answering $\\frac{1}{24}$.",
    "check": "The first term alone is $\\frac{1}{120}\\approx 0.0083$, and the total $\\frac{1}{96}\\approx 0.0104$ is only a bit more — reasonable."
  },
  "lec-03-q2b": {
    "spot": "$x^{\\sin x}$: the exponent $\\sin x$ and the base $x$ both vary, so take logs to bring $\\sin x$ down.",
    "why": "Logarithmic differentiation turns it into the product $\\sin x\\ln x$; the power rule or exponential rule each handles only half.",
    "steps": [
      "$\\ln y=\\sin x\\ln x$.",
      "Differentiate: $\\frac{y'}{y}=\\cos x\\ln x+\\frac{\\sin x}{x}$.",
      "$y'=x^{\\sin x}\\left(\\cos x\\ln x+\\frac{\\sin x}{x}\\right)$."
    ],
    "trap": "Treating it as a power function: $\\sin x\\cdot x^{\\sin x-1}$ — that is only the second term in the bracket, missing $\\cos x\\ln x$.",
    "check": "At $x=\\frac{\\pi}{2}$: $\\cos=0$, so $y'=\\frac{\\pi}{2}\\cdot\\frac{1}{\\pi/2}=1$."
  },
  "lec-03-q2c": {
    "spot": "Products, quotients and roots stacked together: after taking logs it becomes $2\\ln x+\\frac12\\ln(x+1)-3\\ln(x-1)$, and each term is differentiated on its own.",
    "why": "Logarithmic differentiation turns three layers of multiplication and division into three sums and differences; the Quotient plus Product Rule gets long and drops terms easily.",
    "steps": [
      "Take logs (for $x>1$): $\\ln y=2\\ln x+\\frac12\\ln(x+1)-3\\ln(x-1)$.",
      "Differentiate: $\\frac{y'}{y}=\\frac{2}{x}+\\frac{1}{2(x+1)}-\\frac{3}{x-1}$.",
      "Multiply back by $y$: $y'=\\frac{x^2\\sqrt{x+1}}{(x-1)^3}\\left(\\frac{2}{x}+\\frac{1}{2(x+1)}-\\frac{3}{x-1}\\right)$."
    ],
    "trap": "Forgetting to multiply back by $y$ at the end and handing in only the bracket for $\\frac{y'}{y}$.",
    "check": "At $x=3$: $y=\\frac{9\\cdot2}{8}=\\frac94$, the bracket is $\\frac23+\\frac18-\\frac32=-\\frac{17}{24}$, so $y'=-\\frac{51}{32}$."
  },
  "lec-07-q2c": {
    "spot": "The reduction formula is given and $n=5$ is odd: step all the way down to $I_1=\\int_0^{\\pi/2}\\sin x\\,dx=1$.",
    "why": "Two steps, $I_5=\\frac45I_3$ and $I_3=\\frac23I_1$, finish it; integrating $\\sin^5x$ directly means expanding $(1-\\cos^2x)^2\\sin x$.",
    "steps": [
      "Base: $I_1=\\int_0^{\\pi/2}\\sin x\\,dx=1$.",
      "$I_3=\\frac23I_1=\\frac23$.",
      "$I_5=\\frac45I_3=\\frac45\\cdot\\frac23=\\frac{8}{15}$."
    ],
    "trap": "Reducing down to $I_0=\\frac{\\pi}{2}$ (odd powers never reach $0$), or writing the recursion coefficient as $\\frac{n}{n-1}$ and answering $\\frac{15}{8}$; since $\\sin^5x\\le 1$, the integral cannot exceed $\\frac{\\pi}{2}$.",
    "check": "$0\\le\\sin^5x\\le\\sin^3x$, so $I_5<I_3=\\frac23$."
  },
  "lec-08-q4d": {
    "spot": "You want $I_3$; push the recursion $I_n=nI_{n-1}$ up three times from $I_0=1$.",
    "why": "The recursion is given, and three multiplications give $3!$; no need to integrate by parts three times.",
    "steps": [
      "$I_0=\\int_0^\\infty e^{-x}\\,dx=1$.",
      "$I_1=1\\cdot I_0=1$, $I_2=2I_1=2$.",
      "$I_3=3I_2=6$."
    ],
    "trap": "Thinking $I_n=n$ and answering $3$; the recursion multiplies, so $I_n=n!$.",
    "check": "The pattern $I_n=n!$ gives $I_4=24$."
  },
  "lec-16-m1": {
    "spot": "Angle between two vectors: use the dot product formula $\\cos\\theta=\\frac{\\mathbf u\\cdot\\mathbf v}{|\\mathbf u||\\mathbf v|}$.",
    "why": "One dot product and two lengths — more reliable than finding the angle from a picture.",
    "steps": [
      "Dot product: $\\mathbf u\\cdot\\mathbf v=1\\cdot1+1\\cdot0+0\\cdot1=1$.",
      "Lengths: $|\\mathbf u|=|\\mathbf v|=\\sqrt2$.",
      "$\\cos\\theta=\\frac{1}{\\sqrt2\\cdot\\sqrt2}=\\frac12$, so $\\theta=60^\\circ$."
    ],
    "trap": "Forgetting to divide by the lengths, thinking $\\cos\\theta=1$ and answering $0^\\circ$.",
    "check": "Geometry: $(1,1,0)$, $(1,0,1)$ and their difference $(0,1,-1)$ all have length $\\sqrt2$ — an equilateral triangle, so the angle is $60^\\circ$."
  },
  "lec-16-q4a": {
    "spot": "$f_x$ is the partial derivative in $x$: treat $y$ as a constant. $x^3y$ is a constant multiple of $x^3$, and the inner $xy^2$ of $e^{xy^2}$ differentiates to $y^2$ in $x$.",
    "why": "A partial derivative is an ordinary derivative with $y$ viewed as a fixed number; the Chain Rule works as usual.",
    "steps": [
      "$\\frac{\\partial}{\\partial x}(x^3y)=3x^2y$.",
      "$\\frac{\\partial}{\\partial x}e^{xy^2}=e^{xy^2}\\cdot y^2$.",
      "$f_x=3x^2y+y^2e^{xy^2}$."
    ],
    "trap": "Writing the inner derivative of $e^{xy^2}$ as $2xy$ (that is the derivative in $y$), or dropping the inner derivative altogether.",
    "check": "Compare with $f_y=x^3+2xye^{xy^2}$: the two partials have different inner factors, a good reminder of which variable is held constant."
  },
  "lec-19-q2b": {
    "spot": "The region is a quarter disk: in polar coordinates the circular boundary is just $r\\le 2$, $0\\le\\theta\\le\\frac{\\pi}{2}$, and the integrand is $x=r\\cos\\theta$.",
    "why": "In polar coordinates all the limits are constants, so the double integral splits into a product of two single integrals; Cartesian coordinates would bring in $\\sqrt{4-x^2}$.",
    "steps": [
      "Switch to polar: $\\iint_D x\\,dA=\\int_0^{\\pi/2}\\int_0^2 r\\cos\\theta\\cdot r\\,dr\\,d\\theta$ (don't forget $dA=r\\,dr\\,d\\theta$).",
      "$\\int_0^2r^2\\,dr=\\frac{8}{3}$.",
      "$\\int_0^{\\pi/2}\\cos\\theta\\,d\\theta=1$; the product is $\\frac83$."
    ],
    "trap": "Dropping the $r$ in $dA$ and getting $\\int_0^2r\\,dr\\cdot1=2$.",
    "check": "Check in Cartesian coordinates: $\\int_0^2x\\sqrt{4-x^2}\\,dx=\\frac83$."
  },
  "lec-20-q1a": {
    "spot": "A line integral with respect to arc length along a straight segment: parametrize as $(3t,4t)$, $ds=|\\mathbf r'(t)|\\,dt=5\\,dt$.",
    "why": "On a segment the speed is the constant $5$, so the line integral immediately becomes an ordinary integral in $t$.",
    "steps": [
      "$\\mathbf r(t)=(3t,4t)$, $0\\le t\\le1$, $|\\mathbf r'|=\\sqrt{9+16}=5$.",
      "Integrand: $x+y^2=3t+16t^2$.",
      "$\\int_0^1(3t+16t^2)\\cdot5\\,dt=5\\left(\\frac32+\\frac{16}{3}\\right)=\\frac{205}{6}$."
    ],
    "trap": "Dropping the $5$ in $ds=5\\,dt$ and answering $\\frac{41}{6}$.",
    "check": "Rough estimate: along the segment $x+y^2$ grows from $0$ to $19$, averaging about $6.8$; times the length $5$ gives about $34$."
  },
  "lec-20-q1b": {
    "spot": "Work $=\\int_C\\mathbf F\\cdot d\\mathbf r$ along a quarter of the unit circle: parametrize $x=\\cos t$, $y=\\sin t$, $0\\le t\\le\\frac{\\pi}{2}$.",
    "why": "$\\mathbf F=(y,-x)$ is not conservative (nonzero curl), so you cannot just look at the endpoints; you must actually integrate along the path.",
    "steps": [
      "$d\\mathbf r=(-\\sin t,\\cos t)\\,dt$, $\\mathbf F=(\\sin t,-\\cos t)$.",
      "Dot product: $\\sin t(-\\sin t)+(-\\cos t)\\cos t=-1$.",
      "$\\int_0^{\\pi/2}(-1)\\,dt=-\\frac{\\pi}{2}$."
    ],
    "trap": "Assuming there is a potential function, looking only at the start and end points, and saying the work is $0$; $\\frac{\\partial(-x)}{\\partial x}-\\frac{\\partial y}{\\partial y}=-2\\ne0$, so the field is not conservative.",
    "check": "On the circle $\\mathbf F$ always points along the clockwise tangent with magnitude $1$; moving counterclockwise through arc length $\\frac{\\pi}{2}$, the work is exactly $-\\frac{\\pi}{2}$."
  },
  "lec-20-q3c": {
    "spot": "Closed curve, counterclockwise, region a disk: use Green's Theorem to switch to $\\iint\\left(Q_x-P_y\\right)dA$, and $-3x^2-3y^2=-3r^2$ is easiest in polar coordinates.",
    "why": "Parametrizing directly means integrating $\\sin^4t+\\cos^4t$; Green's Theorem plus polar coordinates finishes in two steps.",
    "steps": [
      "$P=y^3$, $Q=-x^3$: $Q_x-P_y=-3x^2-3y^2$.",
      "Polar coordinates: $\\iint_D-3r^2\\,dA=-3\\int_0^{2\\pi}\\int_0^2r^3\\,dr\\,d\\theta$.",
      "$-3\\cdot2\\pi\\cdot4=-24\\pi$."
    ],
    "trap": "Writing Green's Theorem backwards as $P_y-Q_x$ and answering $24\\pi$; or forgetting the $r$ in $dA$ and getting $-3\\cdot2\\pi\\cdot\\frac83=-16\\pi$.",
    "check": "Parametrize directly with $x=2\\cos t$, $y=2\\sin t$: the integrand becomes $-16(\\sin^4t+\\cos^4t)\\,dt$, and one full loop also gives $-24\\pi$."
  },
  "lim-019": {
    "spot": "$(1+x)^{1/x}\\to e$, and the problem asks how fast it approaches $e$: write it as $e^{\\ln(1+x)/x}$ and expand the exponent.",
    "why": "The exponent is $\\frac{\\ln(1+x)}{x}=1-\\frac{x}{2}+\\cdots$, then use $e^{1+h}\\approx e(1+h)$; L'Hôpital's Rule would require differentiating $(1+x)^{1/x}$, which is messy.",
    "steps": [
      "$\\frac{\\ln(1+x)}{x}=1-\\frac{x}{2}+\\frac{x^2}{3}-\\cdots$.",
      "$(1+x)^{1/x}=e\\cdot e^{-x/2+\\cdots}=e\\left(1-\\frac{x}{2}+\\cdots\\right)$.",
      "Subtract $e$ and divide by $x$: limit $=-\\frac{e}{2}$."
    ],
    "trap": "Thinking $(1+x)^{1/x}$ simply equals $e$, so the numerator is $0$ and the answer is $0$; it only approaches $e$, and the gap is of order $x$.",
    "check": "At $x=0.001$ the ratio is about $-1.358$, close to $-\\frac{e}{2}\\approx-1.359$."
  },
  "lm-rs-007": {
    "spot": "A standard Riemann sum $\\frac1n\\sum f\\left(\\frac kn\\right)$ with $f(x)=\\ln(1+x)$ on $[0,1]$.",
    "why": "The limit is directly $\\int_0^1\\ln(1+x)\\,dx$, then use integration by parts.",
    "steps": [
      "Limit $=\\int_0^1\\ln(1+x)\\,dx$.",
      "Antiderivative: $(1+x)\\ln(1+x)-x$.",
      "Plug in the limits: $2\\ln2-1-0=2\\ln2-1\\approx0.386$."
    ],
    "trap": "Writing the antiderivative as $x\\ln(1+x)-x$ (copying the formula for $\\ln x$), which gives $\\ln2-1<0$ at $1$ — even the sign is wrong.",
    "check": "The $n=2$ right-endpoint sum is $\\frac{\\ln1.5+\\ln2}{2}\\approx0.549$; $f$ is increasing, so the right-endpoint sum overestimates."
  },
  "refine-derivatives-022": {
    "spot": "Second derivative of an inverse function: first find $g(1)$, i.e. solve $x+e^x=1$, which is clearly $x=0$; then use $g''=-\\frac{f''(g)}{f'(g)^3}$.",
    "why": "Differentiating $g'=\\frac{1}{f'(g)}$ once more gives the formula; the inverse $g$ has no closed form, so you rely on the derivatives of $f$ at $0$.",
    "steps": [
      "$f(0)=0+1=1$, so $g(1)=0$.",
      "$f'(x)=1+e^x$, $f'(0)=2$; $f''(x)=e^x$, $f''(0)=1$.",
      "Differentiate $g'=\\frac{1}{f'(g)}$ in $x$: $g''=-\\frac{f''(g)\\,g'}{f'(g)^2}=-\\frac{f''(g)}{f'(g)^3}$.",
      "$g''(1)=-\\frac{1}{8}$."
    ],
    "trap": "Computing $\\frac{1}{f''(0)}=1$, or missing one factor of $g'$ and getting $-\\frac{f''}{f'^2}=-\\frac14$.",
    "check": "Numerical inverse: $g(1.01)\\approx0.0049938$, $g(0.99)\\approx-0.0050063$, and the second difference $\\frac{g(1.01)-2g(1)+g(0.99)}{0.01^2}\\approx-0.125$."
  },
  "refine-derivatives-029": {
    "spot": "The right side is a degree-4 polynomial and $P''$ lowers the degree by two: $P$ is also degree 4 with only even-power terms. You can also think of it as $P=(1+D^2)^{-1}x^4=(1-D^2+D^4)x^4$.",
    "why": "$(1+D^2)^{-1}=1-D^2+D^4-\\cdots$ acting on a polynomial stops after a few terms; faster than setting up five unknown coefficients and solving.",
    "steps": [
      "$(x^4)''=12x^2$.",
      "$(x^4)''''=(12x^2)''=24$.",
      "$P=x^4-12x^2+24$.",
      "Check: $P''=12x^2-24$, so $P''+P=x^4$."
    ],
    "trap": "Correcting only once to get $x^4-12x^2$; plugging back in leaves an extra $-24$, because the second derivative $-24$ of $-12x^2$ must also be compensated.",
    "check": "At $x=0$: $P(0)=24$, $P''(0)=-24$, and the sum is $0=0^4$."
  },
  "ser-034": {
    "spot": "The coefficient $n!$ grows faster than any $r^n$: the ratio $\\frac{a_{n+1}}{a_n}=(n+1)|x|$ blows up to infinity unless $x=0$.",
    "why": "The Ratio Test reduces $n!$ to $n+1$, showing at a glance that only $x=0$ converges.",
    "steps": [
      "Ratio: $\\frac{(n+1)!|x|^{n+1}}{n!|x|^n}=(n+1)|x|$.",
      "However small $x\\ne0$ is, $(n+1)|x|>1$ once $n$ is large enough; for example with $|x|=0.01$ and $n=1000$ it is already $10.01$.",
      "So the series converges only at $x=0$, and the radius of convergence is $R=0$."
    ],
    "trap": "Writing the Ratio Test limit as $\\frac{1}{n+1}\\to0$ (numerator and denominator flipped) and concluding $R=\\infty$; that is the case for $\\sum\\frac{x^n}{n!}$.",
    "check": "Even tiny $x$ can't escape: with $|x|=0.001$, the ratio at $n=10000$ is already $10.001>1$."
  },
  "uni-ser-012": {
    "spot": "$n(n-1)$ paired with $x^n$: $n(n-1)x^{n-2}$ is the second derivative of $x^n$ — differentiate the geometric series $\\frac{1}{1-x}$ twice.",
    "why": "Term-by-term differentiation of the power series gives the whole family $\\sum n(n-1)x^n$ at once; computing $\\sum n^2$ and $\\sum n$ separately is more roundabout.",
    "steps": [
      "$\\sum x^n=\\frac{1}{1-x}$; differentiate twice: $\\sum n(n-1)x^{n-2}=\\frac{2}{(1-x)^3}$.",
      "Multiply by $x^2$: $\\sum n(n-1)x^n=\\frac{2x^2}{(1-x)^3}$.",
      "Plug in $x=\\frac12$: $\\frac{2\\cdot\\frac14}{\\frac18}=4$."
    ],
    "trap": "Multiplying by only one $x$ (or none) and getting $8$ or $16$ at $\\frac12$.",
    "check": "The $n=0,1$ terms are $0$; from $n=2$ on: $\\frac{2}{4}+\\frac{6}{8}+\\frac{12}{16}=2$, and the remaining tail brings it up to $4$."
  },
  "ap-rr-005": {
    "spot": "Fixed observer, balloon rising vertically: the horizontal distance $40$ is constant, and the angle of elevation $\\theta$ relates to the height $h$ by $\\tan\\theta=\\frac{h}{40}$.",
    "why": "Differentiate $\\theta=\\arctan\\frac{h}{40}$ in time and the Chain Rule gives $\\frac{d\\theta}{dt}$ directly; the $\\sec^2\\theta$ route also works but needs $\\cos\\theta$ separately.",
    "steps": [
      "$\\theta=\\arctan\\frac{h}{40}$, $\\frac{d\\theta}{dh}=\\frac{40}{1600+h^2}$.",
      "At $h=30$: $\\frac{40}{1600+900}=\\frac{40}{2500}=\\frac{2}{125}$.",
      "Multiply by $\\frac{dh}{dt}=3$: $\\frac{d\\theta}{dt}=\\frac{6}{125}=0.048$."
    ],
    "trap": "Using $\\frac{1}{1+h^2}$ and forgetting the inner $\\frac{1}{40}$, or treating the distance $40$ as the hypotenuse and getting the wrong $\\cos\\theta$.",
    "check": "Another route: $\\sec^2\\theta\\cdot\\theta'=\\frac{3}{40}$; at this moment the hypotenuse is $50$ and $\\cos\\theta=\\frac45$, so $\\theta'=\\frac{3}{40}\\cdot\\frac{16}{25}=\\frac{6}{125}$."
  },
  "burst-boss-int-004": {
    "spot": "$\\int_0^\\infty$ with $x^4$ and $1+x^6$: substituting $x\\to\\frac1x$ turns $\\frac{x^4}{1+x^6}$ into $\\frac{1}{1+x^6}$; adding the two, the numerator $1+x^4$ splits against $1+x^6=(1+x^2)(x^4-x^2+1)$.",
    "why": "The symmetric substitution avoids sixth-degree partial fractions; the sum leaves only $\\frac{1}{1+x^2}$ and $\\frac{x^2}{1+x^6}$, both easy to integrate.",
    "steps": [
      "Substitute $x=\\frac1u$: $\\int_0^\\infty\\frac{x^4}{1+x^6}\\,dx=\\int_0^\\infty\\frac{1}{1+u^6}\\,du$.",
      "So $2I=\\int_0^\\infty\\frac{1+x^4}{1+x^6}\\,dx$; and $1+x^4=(x^4-x^2+1)+x^2$, giving $\\frac{1+x^4}{1+x^6}=\\frac{1}{1+x^2}+\\frac{x^2}{1+x^6}$.",
      "$\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$; for $\\int_0^\\infty\\frac{x^2}{1+x^6}\\,dx$ substitute $w=x^3$ to get $\\frac13\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{6}$.",
      "$2I=\\frac{\\pi}{2}+\\frac{\\pi}{6}=\\frac{2\\pi}{3}$, $I=\\frac{\\pi}{3}$."
    ],
    "trap": "When substituting $x=\\frac1u$, dropping the $\\frac{1}{u^2}$ from $dx=-\\frac{du}{u^2}$, thinking $\\frac{x^4}{1+x^6}$ becomes $\\frac{u^2}{1+u^6}$, and answering $\\frac{\\pi}{6}$.",
    "check": "The formula $\\int_0^\\infty\\frac{x^{m}}{1+x^{n}}\\,dx=\\frac{\\pi/n}{\\sin\\frac{(m+1)\\pi}{n}}$ with $m=4$, $n=6$ gives $\\frac{\\pi/6}{1/2}=\\frac{\\pi}{3}$."
  },
  "burst-boss-int-016": {
    "spot": "$\\int_0^\\pi x\\cdot f(\\sin x)$: under $x\\to\\pi-x$, $\\sin$ is unchanged, so $x$ can be replaced by its average $\\frac{\\pi}{2}$ and pulled out; the remaining $\\sin^{10}x$ uses Wallis' formula.",
    "why": "Integrating $x$ against $\\sin^{10}x$ by parts goes on forever; the symmetric substitution eliminates $x$ in one step.",
    "steps": [
      "$I=\\int_0^\\pi(\\pi-x)\\sin^{10}x\\,dx$; adding this to the original: $2I=\\pi\\int_0^\\pi\\sin^{10}x\\,dx$.",
      "$\\int_0^\\pi\\sin^{10}x\\,dx=2\\int_0^{\\pi/2}\\sin^{10}x\\,dx$, so $I=\\pi\\int_0^{\\pi/2}\\sin^{10}x\\,dx$.",
      "Wallis (even power): $\\int_0^{\\pi/2}\\sin^{10}x\\,dx=\\frac{9}{10}\\cdot\\frac78\\cdot\\frac56\\cdot\\frac34\\cdot\\frac12\\cdot\\frac{\\pi}{2}=\\frac{63}{256}\\cdot\\frac{\\pi}{2}$.",
      "$I=\\pi\\cdot\\frac{63\\pi}{512}=\\frac{63\\pi^2}{512}$."
    ],
    "trap": "Forgetting the final factor $\\frac{\\pi}{2}$ in Wallis' formula for even powers (only odd powers lack it) and answering $\\frac{63\\pi}{256}$.",
    "check": "Size: $\\int_0^\\pi x\\,dx=\\frac{\\pi^2}{2}$, and multiplying by $\\sin^{10}x$, whose average is small, the answer $\\approx1.214$ should be much smaller than $\\frac{\\pi^2}{2}\\approx4.93$."
  },
  "burst-boss2-int-001": {
    "spot": "$\\ln x$ times a rational function, integrated from $0$ to $\\infty$: $\\ln x$ is the derivative of $x^s$ in $s$ (at $s=0$). First get the formula for $\\int_0^\\infty\\frac{x^s}{1+x^3}\\,dx$, then differentiate in $s$.",
    "why": "$\\int_0^\\infty\\frac{x^{s}}{1+x^{n}}\\,dx=\\frac{\\pi/n}{\\sin\\frac{(s+1)\\pi}{n}}$ is a ready-made formula; handling $\\ln x$ directly has no nice antiderivative.",
    "steps": [
      "Formula: $F(s)=\\int_0^\\infty\\frac{x^s}{1+x^3}\\,dx=\\frac{\\pi/3}{\\sin\\frac{(s+1)\\pi}{3}}$ (for $-1<s<2$); check with $s=\\frac12$.",
      "The integral we want is $=F'(0)$: differentiating in $s$, $F'(s)=-\\frac{\\pi}{3}\\cdot\\frac{\\frac{\\pi}{3}\\cos\\frac{(s+1)\\pi}{3}}{\\sin^2\\frac{(s+1)\\pi}{3}}$.",
      "At $s=0$: $\\cos\\frac{\\pi}{3}=\\frac12$, $\\sin^2\\frac{\\pi}{3}=\\frac34$, so $F'(0)=-\\frac{\\pi^2}{9}\\cdot\\frac{1/2}{3/4}=-\\frac{2\\pi^2}{27}$.",
      "So the integral is $=-\\frac{2\\pi^2}{27}$."
    ],
    "trap": "Using $x\\to\\frac1x$ and concluding the integral is $0$ (as in $\\int_0^\\infty\\frac{\\ln x}{1+x^2}\\,dx=0$); that trick works only for $1+x^2$, and with denominator $1+x^3$ the symmetry breaks.",
    "check": "Sign: on $(0,1)$, $\\ln x<0$ while $\\frac{1}{1+x^3}$ is close to $1$; this negative part outweighs the positive part on $(1,\\infty)$, which decays fast, so a negative answer makes sense."
  },
  "burst-boss2-int-007": {
    "spot": "$\\frac{1-\\cos x}{x^2}$: the $x^2$ in the denominator is perfect for lowering by one power with integration by parts, $(1-\\cos x)'=\\sin x$, leaving the Dirichlet integral of $\\frac{\\sin x}{x}$.",
    "why": "After integrating by parts the boundary term is $0$ at both ends, connecting directly to the known $\\int_0^\\infty\\frac{\\sin x}{x}\\,dx=\\frac{\\pi}{2}$.",
    "steps": [
      "By parts: $u=1-\\cos x$, $dv=\\frac{dx}{x^2}$, $v=-\\frac1x$. Derivative of the product: $\\left(-\\frac{1-\\cos x}{x}\\right)'=\\frac{1-\\cos x}{x^2}-\\frac{\\sin x}{x}$.",
      "Boundary terms: as $x\\to0$, $\\frac{1-\\cos x}{x}\\sim\\frac{x}{2}\\to0$; as $x\\to\\infty$, $\\left|\\frac{1-\\cos x}{x}\\right|\\le\\frac2x\\to0$.",
      "So $\\int_0^\\infty\\frac{1-\\cos x}{x^2}\\,dx=\\int_0^\\infty\\frac{\\sin x}{x}\\,dx=\\frac{\\pi}{2}$."
    ],
    "trap": "Thinking $1-\\cos x$ behaves like $1$ near $0$ and declaring the integral divergent at $0$; actually $1-\\cos x\\sim\\frac{x^2}{2}$, so the integrand tends to $\\frac12$ at $0$.",
    "check": "Numerical integral up to $100$: the tail is less than $\\int_{100}^\\infty\\frac{2}{x^2}dx=0.02$, so it should land between $\\frac{\\pi}{2}-0.02$ and $\\frac{\\pi}{2}$."
  },
  "burst-boss2-lim-006": {
    "spot": "The numerator subtracts $\\frac{x^3}{3}$ and adds back $\\frac{x^5}{10}$ — exactly the first two terms in the expansion of $\\int_0^x\\ln(1+t^2)\\,dt$; what's wanted is the coefficient of $x^7$.",
    "why": "Substituting $u=t^2$ into $\\ln(1+u)=u-\\frac{u^2}{2}+\\frac{u^3}{3}$ and integrating term by term is cleaner than applying L'Hôpital's Rule three times to a variable-limit integral.",
    "steps": [
      "$\\ln(1+t^2)=t^2-\\frac{t^4}{2}+\\frac{t^6}{3}-\\cdots$.",
      "Integrate term by term: $\\int_0^x\\ln(1+t^2)\\,dt=\\frac{x^3}{3}-\\frac{x^5}{10}+\\frac{x^7}{21}-\\cdots$.",
      "The first two terms cancel what the numerator subtracts, leaving $\\frac{x^7}{21}$; the limit is $=\\frac{1}{21}$ (or apply L'Hôpital's Rule once: the numerator's derivative $\\ln(1+x^2)-x^2+\\frac{x^4}{2}$ over $7x^6$)."
    ],
    "trap": "Forgetting to divide by the new power when integrating, taking the contribution of $\\frac{t^6}{3}$ as $\\frac{x^7}{3}$, and answering $\\frac13$.",
    "check": "Compute at $x=0.3$ with the numerator evaluated by integration: the ratio is about $0.0453$, approaching $\\frac{1}{21}\\approx0.0476$ from below (the next term $-\\frac{x^9}{36}$ still pulls it down)."
  },
  "burst-boss2-lim-008": {
    "spot": "$\\frac{1}{n^2+k^2}=\\frac{1}{n^2}\\cdot\\frac{1}{1+(k/n)^2}$: the sum is $\\frac1n\\times$ (a right-endpoint Riemann sum for $\\frac{1}{1+x^2}$); subtracting the main term $\\frac{\\pi}{4n}$ and multiplying by $n^2$ asks for the $\\frac1n$ term of the Riemann sum error.",
    "why": "The leading error of a right-endpoint Riemann sum is $\\frac{f(1)-f(0)}{2n}$ (the trapezoid correction); estimating term by term is a mess.",
    "steps": [
      "$\\sum_{k=1}^n\\frac{1}{n^2+k^2}=\\frac1n\\cdot\\frac1n\\sum_{k=1}^nf\\left(\\frac kn\\right)$, with $f(x)=\\frac{1}{1+x^2}$ and $\\int_0^1f=\\frac{\\pi}{4}$.",
      "Right-endpoint sum: $\\frac1n\\sum f\\left(\\frac kn\\right)=\\frac{\\pi}{4}+\\frac{f(1)-f(0)}{2n}+O\\left(\\frac{1}{n^2}\\right)$, where $f(1)-f(0)=-\\frac12$.",
      "So the original sum is $=\\frac{\\pi}{4n}-\\frac{1}{4n^2}+O\\left(\\frac{1}{n^3}\\right)$; subtracting $\\frac{\\pi}{4n}$ and multiplying by $n^2$, the limit is $-\\frac14$."
    ],
    "trap": "Thinking the gap between the Riemann sum and the integral is $o\\left(\\frac1n\\right)$ and answering $0$; the right-endpoint error is of order $\\frac1n$, and since the sum has already been divided by an extra $n$, multiplying by $n^2$ leaves exactly a finite value.",
    "check": "Compute $n=2$: $4\\left(\\frac15+\\frac18-\\frac{\\pi}{8}\\right)\\approx-0.271$; the next-order correction is about $-\\frac{1}{24n}$, and at $n=2$, $-0.25-0.021=-0.271$."
  },
  "burst-boss2-param-004": {
    "spot": "$x$ times $e^{-ax}$: $xe^{-ax}=-\\frac{\\partial}{\\partial a}e^{-ax}$. First compute the $x$-free $G(a)=\\int_0^\\infty e^{-ax}\\cos x\\,dx$, then differentiate in $a$.",
    "why": "Differentiating with respect to the parameter produces the $x$ and saves two rounds of integration by parts; $G(a)=\\frac{a}{a^2+1}$ is a standard Laplace transform result.",
    "steps": [
      "$G(a)=\\int_0^\\infty e^{-ax}\\cos x\\,dx=\\frac{a}{a^2+1}$ (for $a>0$).",
      "$F(a)=-G'(a)$, because $\\frac{\\partial}{\\partial a}e^{-ax}=-xe^{-ax}$.",
      "$G'(a)=\\frac{(a^2+1)-2a^2}{(a^2+1)^2}=\\frac{1-a^2}{(a^2+1)^2}$, so $F(a)=\\frac{a^2-1}{(a^2+1)^2}$.",
      "Cross-check by direct numerical integration."
    ],
    "trap": "Forgetting the minus sign in $-G'$ and answering $\\frac{1-a^2}{(a^2+1)^2}$; for large $a$, $\\cos x\\approx1$ and $F\\approx\\frac{1}{a^2}>0$, which catches this mistake.",
    "check": "At $a=1$, $F(1)=0$: $\\int_0^\\infty xe^{-x}\\cos x\\,dx=0$."
  },
  "burst-boss2-param-005": {
    "spot": "The $\\ln x$ in the denominator is exactly what drops out when you differentiate $x^a$ in $a$: $\\frac{\\partial}{\\partial a}\\frac{x^a-1}{\\ln x}=x^a$ — Feynman's trick.",
    "why": "After differentiating in $a$ the integrand becomes $x^a$, a one-line integral; the original integrand has no elementary antiderivative.",
    "steps": [
      "$F'(a)=\\int_0^1x^a\\,dx=\\frac{1}{a+1}$.",
      "Initial value: $F(0)=\\int_0^1\\frac{1-1}{\\ln x}\\,dx=0$.",
      "Integrate back: $F(a)=\\ln(a+1)$.",
      "Cross-check by numerical integration."
    ],
    "trap": "Forgetting to use $F(0)=0$ to fix the constant when integrating back, or writing $\\ln a$ (computing $\\int_0^1x^a\\,dx$ as $\\frac1a$).",
    "check": "Check with $a=1$: $\\int_0^1\\frac{x-1}{\\ln x}\\,dx=\\ln2$."
  },
  "burst-boss2-ser-002": {
    "spot": "Reciprocal fourth powers of odd numbers only: take the full $\\sum\\frac{1}{n^4}=\\frac{\\pi^4}{90}$ and subtract the even terms, which are $\\frac{1}{2^4}$ of the total.",
    "why": "Splitting into odd and even ties it directly to $\\zeta(4)$; no separate Fourier series needed.",
    "steps": [
      "$\\sum_{n\\ge1}\\frac{1}{n^4}=\\frac{\\pi^4}{90}$.",
      "Even terms: $\\sum\\frac{1}{(2n)^4}=\\frac{1}{16}\\cdot\\frac{\\pi^4}{90}$.",
      "Odd terms $=\\frac{15}{16}\\cdot\\frac{\\pi^4}{90}=\\frac{\\pi^4}{96}$.",
      "So the sum is $\\frac{\\pi^4}{96}$."
    ],
    "trap": "Assuming the odd terms are exactly half and answering $\\frac{\\pi^4}{180}$; the even terms are only $\\frac{1}{16}$, and the first term $1$ is nearly everything.",
    "check": "The first term is $1$ and the second is $\\frac{1}{81}$: the total $\\frac{\\pi^4}{96}\\approx1.0147$ is only slightly more than $1+\\frac{1}{81}$."
  },
  "burst-boss2-ser-005": {
    "spot": "$\\sum n^k r^n$ with $r=\\frac13$: shift the index by one and expand $(n+1)^k$ with the binomial theorem to get a recursion expressing $S_k$ in terms of $S_1,\\dots,S_{k-1}$.",
    "why": "The index-shift recursion needs only addition and multiplication, with no need to differentiate four times for a fourth power; for $r=\\frac13$ the recursion is $S_k=\\frac12\\left(\\frac32+\\sum_{j=1}^{k-1}\\binom kjS_j\\right)$.",
    "steps": [
      "$S_k=\\sum_{n\\ge1}\\frac{n^k}{3^n}=\\frac13\\sum_{n\\ge0}\\frac{(n+1)^k}{3^n}$; expanding gives $\\frac23S_k=\\frac13\\left(\\frac32+\\sum_{j=1}^{k-1}\\binom kjS_j\\right)$. Check with $k=2$: $S_2=\\frac12\\left(\\frac32+2S_1\\right)$.",
      "$S_1=\\frac12\\cdot\\frac32=\\frac34$, $S_2=\\frac12\\left(\\frac32+\\frac32\\right)=\\frac32$.",
      "$S_3=\\frac12\\left(\\frac32+3\\cdot\\frac34+3\\cdot\\frac32\\right)=\\frac{33}{8}$.",
      "$S_4=\\frac12\\left(\\frac32+4\\cdot\\frac34+6\\cdot\\frac32+4\\cdot\\frac{33}{8}\\right)=\\frac12(1.5+3+9+16.5)=15$."
    ],
    "trap": "Using wrong binomial coefficients (e.g. writing the middle coefficient of $(n+1)^4$ as $4$ instead of $6$), or dropping the $\\frac{1}{1-r}=\\frac32$ from the $n=0$ term.",
    "check": "The first four terms $\\frac13+\\frac{16}{9}+\\frac{81}{27}+\\frac{256}{81}\\approx8.27$; the peak is near $n=4$, and the tail brings it up to $15$."
  },
  "burst-boss2-ser-006": {
    "spot": "Again $\\sum n^kr^n$ with $r=\\frac13$, this time $k=5$: shifting the index gives the recursion $S_k=\\frac12\\left(\\frac32+\\sum_{j=1}^{k-1}\\binom kjS_j\\right)$; compute the earlier $S_j$ on the way up.",
    "why": "Applying $\\left(x\\frac{d}{dx}\\right)^5$ to $\\frac{1}{1-x}$ is error-prone; the recursion uses only binomial coefficients.",
    "steps": [
      "Where the recursion comes from: $S_k=\\frac13\\sum_{n\\ge0}\\frac{(n+1)^k}{3^n}$; expand $(n+1)^k$ and move $S_k$ to the left. Check with $k=3$.",
      "$S_1=\\frac34$, $S_2=\\frac32$, $S_3=\\frac{33}{8}$.",
      "$S_4=\\frac12\\left(\\frac32+4\\cdot\\frac34+6\\cdot\\frac32+4\\cdot\\frac{33}{8}\\right)=15$.",
      "$S_5=\\frac12\\left(\\frac32+5\\cdot\\frac34+10\\cdot\\frac32+10\\cdot\\frac{33}{8}+5\\cdot15\\right)=\\frac12(1.5+3.75+15+41.25+75)=\\frac{273}{4}$."
    ],
    "trap": "Missing one of the binomial coefficients $1,5,10,10,5,1$ of $(n+1)^5$, or forgetting the $\\frac32$ contributed by the $n=0$ term.",
    "check": "Compare neighbors: $S_4=15$, $S_5=68.25$, a ratio of about $4.5$; from $S_3\\to S_4$ it is about $3.6$. Higher powers push the peak right and the growth gets bigger — reasonable."
  },
  "burst-boss3-int-005": {
    "spot": "The $\\int_0^\\pi x\\cdot f(\\sin x)$ type: the substitution $x\\to\\pi-x$ replaces $x$ by $\\frac{\\pi}{2}$; the remaining $\\int_0^\\pi\\ln\\sin x\\,dx=-\\pi\\ln2$ is a classic result.",
    "why": "The symmetric substitution eliminates $x$ and avoids integrating $\\ln\\sin x$ by parts (which produces the even harder $x^2\\cot x$).",
    "steps": [
      "$I=\\int_0^\\pi(\\pi-x)\\ln\\sin x\\,dx$; adding gives $I=\\frac{\\pi}{2}\\int_0^\\pi\\ln\\sin x\\,dx$.",
      "$J=\\int_0^{\\pi/2}\\ln\\sin x\\,dx$: by symmetry $\\int_0^\\pi\\ln\\sin x\\,dx=2J$; splitting with $\\sin x=2\\sin\\frac x2\\cos\\frac x2$ also gives $\\pi\\ln2+4J$. So $2J=\\pi\\ln2+4J$, $J=-\\frac{\\pi}{2}\\ln2$.",
      "$\\int_0^\\pi\\ln\\sin x\\,dx=2J=-\\pi\\ln2$.",
      "$I=\\frac{\\pi}{2}\\cdot(-\\pi\\ln2)=-\\frac{\\pi^2\\ln2}{2}$."
    ],
    "trap": "Using the $\\int_0^{\\pi/2}$ result $-\\frac{\\pi}{2}\\ln2$ as if it were $\\int_0^\\pi$, and answering $-\\frac{\\pi^2\\ln2}{4}$.",
    "check": "$\\ln\\sin x\\le0$, so the answer must be negative; its size is about $-3.42$."
  },
  "burst-boss3-int-012": {
    "spot": "$\\frac{x^5}{e^x+1}$: expand $\\frac{1}{e^x+1}=\\sum_{k\\ge1}(-1)^{k-1}e^{-kx}$; each term is $\\int_0^\\infty x^5e^{-kx}\\,dx=\\frac{5!}{k^6}$.",
    "why": "After expanding it becomes an alternating $\\zeta(6)$: $\\eta(6)=\\left(1-2^{-5}\\right)\\zeta(6)$; the standard route for Fermi–Dirac type integrals.",
    "steps": [
      "$\\frac{1}{e^x+1}=\\frac{e^{-x}}{1+e^{-x}}=\\sum_{k\\ge1}(-1)^{k-1}e^{-kx}$; each term $\\int_0^\\infty x^5e^{-kx}\\,dx=\\frac{120}{k^6}$ (check with $k=3$).",
      "Integral $=120\\sum_{k\\ge1}\\frac{(-1)^{k-1}}{k^6}=120\\,\\eta(6)$.",
      "$\\zeta(6)=\\frac{\\pi^6}{945}$, $\\eta(6)=\\frac{31}{32}\\cdot\\frac{\\pi^6}{945}$.",
      "$120\\cdot\\frac{31}{32}\\cdot\\frac{\\pi^6}{945}=\\frac{31\\pi^6}{252}$."
    ],
    "trap": "Treating $e^x+1$ as $e^x-1$ and using $5!\\zeta(6)=\\frac{8\\pi^6}{63}$; the plus sign gives an alternating series, so multiply by $1-2^{-5}=\\frac{31}{32}$.",
    "check": "Slightly smaller than the Bose-type $\\int_0^\\infty\\frac{x^5}{e^x-1}\\,dx=\\frac{8\\pi^6}{63}$, with ratio exactly $\\frac{31}{32}$."
  },
  "burst-boss3-int-013": {
    "spot": "$\\frac{x^3}{e^x+1}$: expand as $\\sum(-1)^{k-1}e^{-kx}$; each term gives $\\frac{3!}{k^4}$, summing to $3!\\,\\eta(4)$.",
    "why": "The geometric series expansion turns the integral into the known $\\zeta(4)=\\frac{\\pi^4}{90}$; finding an antiderivative directly is impossible.",
    "steps": [
      "$\\int_0^\\infty x^3e^{-kx}\\,dx=\\frac{6}{k^4}$ (check with $k=2$).",
      "Integral $=6\\sum\\frac{(-1)^{k-1}}{k^4}=6\\,\\eta(4)$, with $\\eta(4)=\\left(1-\\frac18\\right)\\zeta(4)=\\frac78\\cdot\\frac{\\pi^4}{90}$.",
      "$6\\cdot\\frac78\\cdot\\frac{\\pi^4}{90}=\\frac{7\\pi^4}{120}$."
    ],
    "trap": "Taking the alternating factor as $1-\\frac{1}{16}$ (writing $2^{1-s}$ as $2^{-s}$) and answering $\\frac{\\pi^4}{16}$.",
    "check": "Compared with $\\int_0^\\infty\\frac{x^3}{e^x-1}\\,dx=\\frac{\\pi^4}{15}$, the ratio is $\\frac78$."
  },
  "burst-boss3-lim-004": {
    "spot": "$\\frac1n\\sum e^{k/n}$ is a geometric series with a closed form: let $h=\\frac1n$, then the sum is $=(e-1)\\frac{he^h}{e^h-1}$; after removing $(e-1)$ and $\\frac{e-1}{2n}$, the question asks for the $h^2$ coefficient.",
    "why": "With a closed form you don't need Euler–Maclaurin; $\\frac{he^h}{e^h-1}=1+\\frac h2+\\frac{h^2}{12}+\\cdots$ is the generating function of the Bernoulli numbers.",
    "steps": [
      "Geometric sum: $\\sum_{k=1}^ne^{k/n}=e^{1/n}\\frac{e-1}{e^{1/n}-1}$; multiplying by $\\frac1n=h$ gives $(e-1)\\frac{he^h}{e^h-1}$ (check with $n=3$).",
      "Expand: $\\frac{he^h}{e^h-1}=1+\\frac h2+\\frac{h^2}{12}+O(h^4)$.",
      "Subtract $(e-1)\\left(1+\\frac h2\\right)$ and multiply by $n^2=\\frac{1}{h^2}$: the limit is $=\\frac{e-1}{12}$."
    ],
    "trap": "In Euler–Maclaurin, remembering the coefficient as $\\frac{1}{24}$ or forgetting that it is $f'(1)-f'(0)=e-1$, and answering $\\frac{e-1}{24}$.",
    "check": "Euler–Maclaurin gives the same thing: $\\frac{f'(1)-f'(0)}{12}=\\frac{e-1}{12}$."
  },
  "burst-boss3-lim-006": {
    "spot": "$\\frac1n\\sum\\frac{1}{1+(k/n)^2}$ is a right-endpoint Riemann sum; the problem has already subtracted the integral $\\frac{\\pi}{4}$ and the first-order error $-\\frac{1}{4n}$, asking for the $\\frac{1}{n^2}$ term — the second Euler–Maclaurin term.",
    "why": "Euler–Maclaurin: right-endpoint sum $=\\int_0^1f+\\frac{f(1)-f(0)}{2n}+\\frac{f'(1)-f'(0)}{12n^2}+\\cdots$; you only need $f'$ at the two ends.",
    "steps": [
      "$f(x)=\\frac{1}{1+x^2}$, $\\int_0^1f=\\frac{\\pi}{4}$.",
      "First order: $\\frac{f(1)-f(0)}{2n}=\\frac{1/2-1}{2n}=-\\frac{1}{4n}$, exactly canceled by the $+\\frac{1}{4n}$ in the problem.",
      "$f'(x)=-\\frac{2x}{(1+x^2)^2}$: $f'(1)=-\\frac12$, $f'(0)=0$.",
      "Second-order coefficient $\\frac{-1/2-0}{12}=-\\frac{1}{24}$."
    ],
    "trap": "Thinking nothing but $0$ remains after removing the integral and first-order term, or using the midpoint rule's $\\frac{1}{24}$ instead of $\\frac{1}{12}$ and answering $-\\frac{1}{48}$.",
    "check": "Compute $n=2$: $4\\left(\\frac{0.8+0.5}{2}-\\frac{\\pi}{4}+\\frac18\\right)\\approx-0.0416$, very close to $-\\frac{1}{24}\\approx-0.0417$."
  },
  "burst-boss3-ser-002": {
    "spot": "$\\sum\\frac{n^7}{2^n}$: differentiating for a seventh power would be a meltdown. Shift the index $n\\to n+1$; with $r=\\frac12$ the recursion is especially clean: $S_k=2+\\sum_{j=1}^{k-1}\\binom kjS_j$.",
    "why": "The recursion needs only binomial coefficients and the earlier $S_j$; the numerator of $\\left(x\\frac{d}{dx}\\right)^7\\frac{1}{1-x}$ is a degree-7 polynomial that is very hard to get right.",
    "steps": [
      "$S_k=\\sum_{n\\ge1}\\frac{n^k}{2^n}=\\frac12\\sum_{n\\ge0}\\frac{(n+1)^k}{2^n}$; expanding and rearranging gives $S_k=2+\\sum_{j=1}^{k-1}\\binom kjS_j$. Check with $k=2$: $S_2=2+2S_1$.",
      "$S_1=2$, $S_2=6$, $S_3=2+3\\cdot2+3\\cdot6=26$.",
      "$S_4=2+4\\cdot2+6\\cdot6+4\\cdot26=150$.",
      "$S_5=2+5\\cdot2+10\\cdot6+10\\cdot26+5\\cdot150=1082$.",
      "$S_6=2+6\\cdot2+15\\cdot6+20\\cdot26+15\\cdot150+6\\cdot1082=9366$.",
      "$S_7=2+7\\cdot2+21\\cdot6+35\\cdot26+35\\cdot150+21\\cdot1082+7\\cdot9366=94586$."
    ],
    "trap": "Dropping the constant $2$ from the $n=0$ term ($\\sum_{n\\ge0}\\frac{1}{2^n}=2$); every level is then short by $2$, and the error snowballs.",
    "check": "Order of magnitude: the peak is at $n\\approx\\frac{7}{\\ln2}\\approx10$, where $\\frac{10^7}{2^{10}}\\approx9766$; a dozen or so such terms add up to around a hundred thousand — reasonable."
  },
  "burst-boss3-ser-003": {
    "spot": "$\\sum\\frac{n^5}{4^n}$: the index-shift recursion, which for $r=\\frac14$ is $S_k=\\frac13\\left(\\frac43+\\sum_{j=1}^{k-1}\\binom kjS_j\\right)$.",
    "why": "Going from $S_1$ up to $S_5$ takes only arithmetic; the differentiation method needs $x\\frac{d}{dx}$ applied five times to $\\frac{1}{1-x}$.",
    "steps": [
      "$S_k=\\frac14\\sum_{n\\ge0}\\frac{(n+1)^k}{4^n}$; expand and rearrange: $\\frac34S_k=\\frac14\\left(\\frac43+\\sum_{j=1}^{k-1}\\binom kjS_j\\right)$. Check with $k=2$.",
      "$S_1=\\frac49$, $S_2=\\frac13\\left(\\frac43+\\frac89\\right)=\\frac{20}{27}$.",
      "$S_3=\\frac13\\left(\\frac43+3\\cdot\\frac49+3\\cdot\\frac{20}{27}\\right)=\\frac{44}{27}$.",
      "$S_4=\\frac13\\left(\\frac43+4\\cdot\\frac49+6\\cdot\\frac{20}{27}+4\\cdot\\frac{44}{27}\\right)=\\frac{380}{81}$.",
      "$S_5=\\frac13\\left(\\frac43+5\\cdot\\frac49+10\\cdot\\frac{20}{27}+10\\cdot\\frac{44}{27}+5\\cdot\\frac{380}{81}\\right)=\\frac{4108}{243}$."
    ],
    "trap": "Forgetting the $n=0$ term: $\\sum_{n\\ge0}\\frac{1}{4^n}=\\frac43$; or dropping the $1-\\frac14$ when rearranging, making every level off by a factor of $\\frac34$.",
    "check": "The first three terms $\\frac14+\\frac{32}{16}+\\frac{243}{64}\\approx6.05$, the peak is at $n\\approx3.6$, and a total of about $16.9$ is reasonable."
  },
  "burst-boss3-ser-004": {
    "spot": "$\\sum\\frac{n^6}{3^n}$: the index-shift recursion $S_k=\\frac12\\left(\\frac32+\\sum_{j=1}^{k-1}\\binom kjS_j\\right)$, computed from $S_1$ up to $S_6$.",
    "why": "For a sixth power the differentiation method gives a degree-6 numerator; the recursion uses only the binomial coefficients $1,6,15,20,15,6,1$.",
    "steps": [
      "$S_k=\\frac13\\sum_{n\\ge0}\\frac{(n+1)^k}{3^n}$; expanding and rearranging gives the recursion. Check with $k=2$.",
      "$S_1=\\frac34$, $S_2=\\frac32$, $S_3=\\frac{33}{8}$.",
      "$S_4=15$, $S_5=\\frac{273}{4}$.",
      "$S_6=\\frac12\\left(\\frac32+6\\cdot\\frac34+15\\cdot\\frac32+20\\cdot\\frac{33}{8}+15\\cdot15+6\\cdot\\frac{273}{4}\\right)=\\frac12(745.5)=\\frac{1491}{4}$."
    ],
    "trap": "Using wrong coefficients for $(n+1)^6$ (e.g. writing the middle one as $15$ instead of $20$), or dropping the $\\frac32$ from the $n=0$ term.",
    "check": "Order of magnitude: the peak is at $n\\approx\\frac{6}{\\ln3}\\approx5.5$, with $\\frac{5^6}{3^5}\\approx64$ and $\\frac{6^6}{3^6}=64$; a dozen or so terms add up to a few hundred, so $372.75$ is reasonable."
  },
  "burst-int-025": {
    "spot": "$\\frac{x^3}{e^x-1}$ (Planck type): $\\frac{1}{e^x-1}=\\sum_{k\\ge1}e^{-kx}$, each term $\\int_0^\\infty x^3e^{-kx}\\,dx=\\frac{3!}{k^4}$, total $3!\\,\\zeta(4)$.",
    "why": "The geometric series expansion turns it into $\\zeta(4)=\\frac{\\pi^4}{90}$; there is no elementary antiderivative.",
    "steps": [
      "$\\frac{1}{e^x-1}=\\frac{e^{-x}}{1-e^{-x}}=\\sum_{k\\ge1}e^{-kx}$ (for $x>0$).",
      "$\\int_0^\\infty x^3e^{-kx}\\,dx=\\frac{6}{k^4}$ (check with $k=2$).",
      "Total $6\\zeta(4)=6\\cdot\\frac{\\pi^4}{90}=\\frac{\\pi^4}{15}$.",
      "So the integral is $=\\frac{\\pi^4}{15}\\approx6.494$."
    ],
    "trap": "Writing each term's integral as $\\frac{3!}{k^3}$ (one power short) and getting $6\\zeta(3)$; substituting $u=kx$, the $x^3\\,dx$ yields $k^{-4}$ in total.",
    "check": "The $k=1$ term alone is $6$, and the remaining terms bring it to $6.494$: $\\zeta(4)\\approx1.0823$."
  }
};
