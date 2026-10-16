// Detail v2, English — batch 006. Translation of tools/content/detail/006.js (text only; claims live in the Chinese file).
module.exports = {
  "db-tan-003": {
    "spot": "You want the $y$-intercept of the tangent line: write the tangent in point-slope form, then plug in $x=0$. The point $x=e^2$ makes $\\ln x$ the clean integer $2$, and the slope is $\\frac{1}{e^2}$.",
    "why": "Plugging $x=0$ straight into point-slope form takes one line; no need to convert to $y=mx+b$ first and read off $b$.",
    "steps": [
      "Point of tangency: $y=\\ln e^2=2$, so the point is $(e^2,2)$.",
      "Slope: $y'=\\frac{1}{x}$, which at $x=e^2$ is $\\frac{1}{e^2}$.",
      "Tangent line: $y=2+\\frac{1}{e^2}(x-e^2)$.",
      "Plug in $x=0$: $y=2+\\frac{1}{e^2}\\cdot(-e^2)=2-1=1$."
    ],
    "trap": "Taking the $y$-value $2$ of the point as the intercept; or writing the slope as $\\frac{1}{e}$ (the point is $x=e^2$, not $e$), which makes the intercept $2-e$.",
    "check": "$\\ln x$ is concave, so the tangent line lies above the curve; the intercept $1$ must be larger than the curve's nearby values — e.g. at $x=1$ the tangent gives $1+e^{-2}>\\ln 1=0$."
  },
  "dd-def-002": {
    "spot": "The shape is $\\frac{f(2+h)-f(2)}{h}$, and $2^{10}$ is exactly $f(2)$: this is the definition of the derivative of $f(x)=x^{10}$ at $x=2$.",
    "why": "Recognizing the derivative definition means you just compute $10\\cdot 2^9$; expanding $(2+h)^{10}$ by brute force takes eleven terms.",
    "steps": [
      "Let $f(x)=x^{10}$; the problem is $\\lim_{h\\to 0}\\frac{f(2+h)-f(2)}{h}=f'(2)$.",
      "$f'(x)=10x^9$.",
      "$f'(2)=10\\cdot 2^9=10\\cdot 512=5120$."
    ],
    "trap": "Computing $10\\cdot 2^{10}=10240$: the power rule lowers the exponent by one, so it is $9$.",
    "check": "Plug in $h=0.001$: the difference quotient is about $5143$, slightly above $5120$ ($x^{10}$ gets steeper to the right)."
  },
  "dd-kin-003": {
    "spot": "Position $x(t)$ is given and acceleration is asked: differentiate twice. Each derivative of $\\sin 2t$ spits out another $2$, so twice gives $-4\\sin 2t$.",
    "why": "Acceleration is just $x''(t)$: apply the Chain Rule twice, then plug in.",
    "steps": [
      "Velocity: $x'(t)=2\\cos 2t$.",
      "Acceleration: $x''(t)=-4\\sin 2t$.",
      "Plug in $t=\\frac{\\pi}{6}$: $-4\\sin\\frac{\\pi}{3}=-4\\cdot\\frac{\\sqrt{3}}{2}=-2\\sqrt{3}$."
    ],
    "trap": "Multiplying by $2$ only once with the Chain Rule, getting $-2\\sin 2t$ and answering $-\\sqrt{3}$. Two derivatives means two factors of 2.",
    "check": "Simple harmonic motion $x''=-4x$: $x\\left(\\frac{\\pi}{6}\\right)=\\frac{\\sqrt{3}}{2}$, times $-4$ is exactly $-2\\sqrt{3}$."
  },
  "dd-kin-004": {
    "spot": "Polynomial position function, acceleration at one instant: differentiate term by term twice, then plug in $t=1$.",
    "why": "Differentiating a polynomial has no pitfalls; just the power rule twice.",
    "steps": [
      "Velocity: $s'(t)=4t^3-12t^2$.",
      "Acceleration: $s''(t)=12t^2-24t$.",
      "Plug in $t=1$: $12-24=-12$."
    ],
    "trap": "Stopping at the velocity $s'(1)=4-12=-8$: the question asks for acceleration, so differentiate once more.",
    "check": "Negative acceleration means velocity is decreasing: $s'(0.9)>s'(1.1)$."
  },
  "dd-nest-002": {
    "spot": "$e^{\\sin(x^2)}$ is three nested layers: $e^u$, $u=\\sin v$, $v=x^2$. Peel the Chain Rule from outside in, multiplying one derivative per layer.",
    "why": "The outer $e^u$ stays the same when differentiated, so you only have to focus on multiplying the inner layers; peeling one layer at a time is the safest way not to miss any.",
    "steps": [
      "Outer layer: $\\frac{d}{du}e^u=e^u$, so keep $e^{\\sin(x^2)}$ as is.",
      "Middle layer: $\\frac{d}{dx}\\sin(x^2)=\\cos(x^2)\\cdot 2x$.",
      "Multiply everything: $\\frac{d}{dx}e^{\\sin(x^2)}=2x\\cos(x^2)\\,e^{\\sin(x^2)}$."
    ],
    "trap": "Dropping the innermost $2x$ and writing $\\cos(x^2)e^{\\sin(x^2)}$; or miswriting $\\cos(x^2)$ as $\\cos(2x)$.",
    "check": "At $x=0$, $e^{\\sin(x^2)}$ is at the bottom of a valley ($x^2$ is smallest), so the derivative should be $0$; the answer has the factor $2x$, which matches."
  },
  "dd-opt-001": {
    "spot": "The side along the wall needs no fence, so the $100$ m goes only to two sides $+$ one opposite side: $2x+y=100$. Substitute the constraint into the area to get a one-variable quadratic.",
    "why": "The area $x(100-2x)$ is a downward-opening parabola, so its vertex is the maximum; differentiating or completing the square takes one step.",
    "steps": [
      "Let the two sides perpendicular to the wall each be $x$, and the side parallel to the wall $y=100-2x$; the area is $A(x)=x(100-2x)$.",
      "$A'(x)=100-4x$.",
      "Set $A'=0$: $x=25$, so $y=50$. $A''=-4<0$, so it is a maximum.",
      "Maximum area $A(25)=25\\cdot 50=1250$ square meters."
    ],
    "trap": "Treating it as a four-sided fence and using a square: side $25$, area $625$. The wall side needs no fence, so the best shape has the opposite side twice as long as each side.",
    "check": "Try two nearby points: $x=24$ or $26$ both give $1248$, less than $1250$."
  },
  "gx-015": {
    "spot": "The integrand is piecewise linear, and one piece crosses the $x$-axis: the integral of $|f|$ is just every area counted as positive. Split at the zero $x=2$ and count geometric shapes.",
    "why": "Areas under a piecewise linear graph are faster with rectangles and triangles than with piecewise formulas; with an absolute value, find the zeros and split first.",
    "steps": [
      "$[0,1]$: $f=2$ is flat, a $1\\times 2$ rectangle, area $2$.",
      "$[1,3]$: a line from $(1,2)$ down to $(3,-2)$, slope $-2$, zero at $x=2$; one triangle above the axis and one below, each with base $1$ and height $2$, each $1$.",
      "$[3,4]$: from $(3,-2)$ back to $(4,0)$, a triangle below the axis, area $1$.",
      "Add everything as positive: $2+1+1+1=5$."
    ],
    "trap": "Forgetting the absolute value so the two pieces below the axis get subtracted: $2+1-1-1=1$. That is $\\int_0^4 f\\,dx$, not $\\int_0^4|f|\\,dx$.",
    "check": "$\\int_0^4 f\\,dx=1$, and $\\int_0^4|f|\\,dx$ adds twice the area below the axis: $1+2\\cdot 2=5$."
  },
  "gx-019": {
    "spot": "The question asks for the left-hand limit $x\\to 2^-$: look only at the piece with $x<2$, the line from $(0,0)$ to $(2,2)$, and see where it heads at its right end.",
    "why": "The left-hand limit has nothing to do with the piece for $x\\ge 2$; just follow the left line to its endpoint and read the height.",
    "steps": [
      "The piece for $x<2$ passes through $(0,0)$ and $(2,2)$, slope $1$, so $f(x)=x$.",
      "As $x$ approaches $2$ from the left, $f(x)=x$ approaches $2$ (an open endpoint doesn't matter; a limit ignores that point).",
      "So $\\lim_{x\\to 2^-}f(x)=2$."
    ],
    "trap": "Reading off $f(2)=4$: $x=2$ belongs to the right piece, where the value is $4$, but the left-hand limit only looks at the left.",
    "check": "Plug in $x=1.99$: $f=1.99$, right next to $2$."
  },
  "gx-020": {
    "spot": "Right-hand limit $x\\to 2^+$: look only at the piece for $x\\ge 2$, the line $(2,4)\\to(4,2)$, approaching its left end.",
    "why": "The right-hand limit depends only on the right piece; the left point $(2,2)$ is irrelevant.",
    "steps": [
      "The right piece passes through $(2,4)$ and $(4,2)$, slope $-1$, $f(x)=6-x$.",
      "As $x$ approaches $2$ from the right, $6-x$ approaches $4$.",
      "So $\\lim_{x\\to 2^+}f(x)=4$; the left-hand limit is $2$, they differ, so $x=2$ is a jump discontinuity."
    ],
    "trap": "Seeing the left line also reach $x=2$ and answering $2$: that's the left-hand limit.",
    "check": "Plug in $x=2.01$: $f=3.99$, right next to $4$."
  },
  "gx-022": {
    "spot": "The line has just one point removed at $x=2$, moved to $f(2)=1$: a limit looks at what happens nearby, not at the point itself.",
    "why": "The limit only asks where $f$ heads when approaching $2$, so read the height along the line; $f(2)=1$ is the distractor.",
    "steps": [
      "The line passes through $(0,1)$ and $(3,4)$, slope $1$, $f(x)=x+1$ ($x\\ne 2$).",
      "Approaching $2$ from either side, $x+1\\to 3$.",
      "So $\\lim_{x\\to 2}f(x)=3$; $f(2)=1\\ne 3$, a removable discontinuity."
    ],
    "trap": "Answering $f(2)=1$: the limit and the function value are different things, and this problem is all about separating them.",
    "check": "The values $2.99$ and $3.01$ at $x=1.99$ and $2.01$ squeeze $3$."
  },
  "gx-051": {
    "spot": "Concave up means the second derivative $f''>0$; for a cubic, $f''$ is linear with just one sign change (the inflection point), concave up on one side and down on the other.",
    "why": "Solving the linear inequality $f''>0$ finishes it, which is more reliable than eyeballing the bend on a graph.",
    "steps": [
      "$f'(x)=3x^2-6x$, $f''(x)=6x-6$.",
      "$f''(x)=0\\Rightarrow x=1$, the inflection point.",
      "For $x>1$, $f''>0$ (concave up); for $x<1$, $f''<0$ (concave down).",
      "The interval where it is concave up is $(1,\\infty)$."
    ],
    "trap": "Solving $f'>0$ instead and getting the increasing intervals $(-\\infty,0)\\cup(2,\\infty)$: that is going up, not bending up.",
    "check": "The inflection point $x=1$ is exactly the midpoint of the two critical points $0$ and $2$ — the center of symmetry of a cubic."
  },
  "int-021": {
    "spot": "The region is the square $[0,1]\\times[0,1]$ with constant limits: integrate from the inside out, treating $x$ as a constant in the inner integral.",
    "why": "An iterated integral with constant limits splits into two single-variable integrals — fastest and least error-prone.",
    "steps": [
      "Inner (in $y$): $\\int_0^1(x+y)\\,dy=x+\\frac{1}{2}$.",
      "Outer: $\\int_0^1\\left(x+\\frac{1}{2}\\right)dx=\\frac{1}{2}+\\frac{1}{2}=1$.",
      "Symmetry view: on the square, $x$ and $y$ each average $\\frac{1}{2}$, so $x+y$ averages $1$; times area $1$ gives $1$."
    ],
    "trap": "Integrating away $x$ too in the inner $y$-integral and writing $\\frac{x^2}{2}+\\frac{y^2}{2}$; in the inner integral $x$ is a constant, so it integrates to $xy$.",
    "check": "The integrand is between $0$ and $2$ and the area is $1$, so the answer must be between $0$ and $2$; and $x+y$ is symmetric about the center $(\\frac{1}{2},\\frac{1}{2})$, so take the center value $1$."
  },
  "lm-nr-005": {
    "spot": "$n!$ and $n^n$ are both products of $n$ factors; split it as $\\frac{1}{n}\\cdot\\frac{2}{n}\\cdots\\frac{n}{n}$: every factor is $\\le 1$, and the first is $\\frac{1}{n}$.",
    "why": "Writing it as a product lets the Squeeze Theorem push it to $0$ in one line — much simpler than Stirling's formula.",
    "steps": [
      "$\\frac{n!}{n^n}=\\frac{1}{n}\\cdot\\frac{2}{n}\\cdots\\frac{n}{n}$; for example $n=4$: $\\frac{24}{256}=\\frac{1}{4}\\cdot\\frac{2}{4}\\cdot\\frac{3}{4}\\cdot 1$.",
      "Apart from the first factor $\\frac{1}{n}$, every factor is $\\le 1$, so $0<\\frac{n!}{n^n}\\le\\frac{1}{n}$.",
      "Another view: the ratio of consecutive terms $\\frac{a_{n+1}}{a_n}=\\left(\\frac{n}{n+1}\\right)^n\\to\\frac{1}{e}<1$, so it decays like a geometric sequence.",
      "Squeeze Theorem: $\\frac{1}{n}\\to 0$, so $\\lim_{n\\to\\infty}\\frac{n!}{n^n}=0$."
    ],
    "trap": "Thinking factorials grow fast and answering $\\infty$: every factor of $n^n$ is $n$, larger than each factor of $n!$, so the denominator wins.",
    "check": "$n=5$: $\\frac{120}{3125}=0.0384$, already far below $\\frac{1}{5}$."
  },
  "lm-rs-005": {
    "spot": "$\\frac{1}{n}\\sum_{k=1}^n g\\left(\\frac{k}{n}\\right)$ is exactly a Riemann sum: $\\frac{1}{n}$ is the width and $\\frac{k}{n}$ are sample points in $[0,1]$, here with $g(x)=\\sin\\pi x$.",
    "why": "Turn the sum straight into $\\int_0^1\\sin\\pi x\\,dx$; computing a finite trig sum directly needs product-to-sum formulas, a long detour.",
    "steps": [
      "Match the Riemann sum: $\\Delta x=\\frac{1}{n}$, $x_k=\\frac{k}{n}$, so the limit is $\\int_0^1\\sin(\\pi x)\\,dx$.",
      "Antiderivative: $\\int\\sin(\\pi x)\\,dx=-\\frac{1}{\\pi}\\cos(\\pi x)$.",
      "Evaluate: $-\\frac{1}{\\pi}(\\cos\\pi-\\cos 0)=-\\frac{1}{\\pi}(-2)=\\frac{2}{\\pi}$."
    ],
    "trap": "Dropping the $\\frac{1}{\\pi}$ in the antiderivative and answering $2$: there's a $\\pi$ inside the $\\sin$, so you must divide it out when integrating.",
    "check": "$\\sin\\pi x$ lies between $0$ and $1$ on $[0,1]$, and the average $\\frac{2}{\\pi}\\approx 0.637$ is reasonable (above $\\frac{1}{2}$ because the arch is fat in the middle)."
  },
  "lm-rs-009": {
    "spot": "$\\frac{1}{n}\\sum e^{k/n}$: width $\\frac{1}{n}$, sample points $\\frac{k}{n}$ covering $[0,1]$ — a Riemann sum with $g(x)=e^x$.",
    "why": "Turning it into an integral takes one line; you could also sum it as a geometric series and take the limit, but that adds a $\\frac{0}{0}$ to handle.",
    "steps": [
      "The limit of the Riemann sum is $\\int_0^1e^x\\,dx$.",
      "$\\int_0^1e^x\\,dx=e^1-e^0=e-1$.",
      "Cross-check: the geometric sum $\\frac{1}{n}\\sum_{k=1}^ne^{k/n}=\\frac{1}{n}\\cdot\\frac{e^{1/n}(e-1)}{e^{1/n}-1}$, and $\\frac{1/n}{e^{1/n}-1}\\to 1$, giving $e-1$ as well."
    ],
    "trap": "Answering $e$: the lower limit of $\\int_0^1e^x\\,dx$ gives $e^0=1$, which must be subtracted.",
    "check": "$e^x$ lies between $1$ and $e$ on $[0,1]$, and the average $e-1\\approx 1.718$ falls in between."
  },
  "lx-app-002": {
    "spot": "In the long run means $t\\to\\infty$; numerator and denominator are both linear, so the limit is the ratio of leading coefficients.",
    "why": "Dividing through by $t$ shows all constant terms vanish — more reliable than plugging in a large $t$ and guessing.",
    "steps": [
      "Divide through by $t$: $P(t)=\\frac{120+\\frac{300}{t}}{1+\\frac{6}{t}}$.",
      "As $t\\to\\infty$, $\\frac{300}{t}$ and $\\frac{6}{t}$ both go to $0$.",
      "The population approaches $\\frac{120}{1}=120$ (in units of 10,000 people; horizontal asymptote $P=120$)."
    ],
    "trap": "Taking the initial population at $t=0$, $\\frac{300}{6}=50$, as the answer; or using the ratio of constant terms $\\frac{300}{6}$. The long run is decided by the leading terms.",
    "check": "$P(t)=120-\\frac{420}{t+6}$, always below $120$ and getting closer."
  },
  "lx-tab-002": {
    "spot": "The table values $0.397$, $0.39997$ close in on $0.4$; the formula is $\\frac{\\sin 2x}{5x}$ — the standard $\\frac{\\sin u}{u}\\to 1$ times the coefficient $\\frac{2}{5}$.",
    "why": "A numerical table only lets you guess; $\\frac{\\sin u}{u}\\to 1$ confirms the guess in one line.",
    "steps": [
      "From the table, $g(0.1)\\approx 0.397$.",
      "Rewrite: $\\frac{\\sin 2x}{5x}=\\frac{2}{5}\\cdot\\frac{\\sin 2x}{2x}$.",
      "$\\frac{\\sin 2x}{2x}\\to 1$, so the limit is $\\frac{2}{5}=0.4$, matching the table."
    ],
    "trap": "Seeing only $\\frac{\\sin}{x}\\to 1$ and answering $\\frac{1}{5}$, missing the $2$ inside the $\\sin$.",
    "check": "$g(0.01)\\approx 0.39997$, only $3\\times 10^{-5}$ away from $0.4$."
  },
  "td-der-001": {
    "spot": "One derivative turns $\\arctan\\frac{1}{x}$ into the rational function $-\\frac{1}{1+x^2}$ (just the negative of the derivative of $\\arctan x$) — the next two are derivatives of rational functions.",
    "why": "After the first derivative the inverse trig function is gone and the Quotient Rule handles the rest; you can also use $\\arctan\\frac{1}{x}=\\frac{\\pi}{2}-\\arctan x$ ($x>0$).",
    "steps": [
      "First: $\\frac{d}{dx}\\arctan\\frac{1}{x}=\\frac{1}{1+\\frac{1}{x^2}}\\cdot\\left(-\\frac{1}{x^2}\\right)=-\\frac{1}{1+x^2}$.",
      "Second: $\\frac{d}{dx}\\left[-(1+x^2)^{-1}\\right]=\\frac{2x}{(1+x^2)^2}$.",
      "Third (Quotient Rule): numerator $2(1+x^2)^2-2x\\cdot 2(1+x^2)\\cdot 2x$; cancel one $(1+x^2)$ to get $2(1+x^2)-8x^2=2-6x^2$.",
      "So $\\frac{d^3}{dx^3}\\arctan\\frac{1}{x}=\\frac{2(1-3x^2)}{(1+x^2)^3}$."
    ],
    "trap": "Forgetting the derivative $-\\frac{1}{x^2}$ of the inner $\\frac{1}{x}$ in the first step, which gives $\\frac{x^2}{1+x^2}$; every later step is then wrong too.",
    "check": "$\\arctan\\frac{1}{x}+\\arctan x=\\frac{\\pi}{2}$ ($x>0$), so their third derivatives are negatives of each other."
  },
  "ch-mix-004": {
    "spot": "The whole thing is a fraction $\\frac{e^{\\sqrt{x}}}{1+\\ln x}$ — the outer frame is the Quotient Rule; the numerator $e^{\\sqrt{x}}$ is itself a composition, so use the Chain Rule once more.",
    "why": "The Quotient Rule splits the problem into two small jobs, the numerator's derivative and the denominator's derivative; handle each, then reassemble.",
    "steps": [
      "Numerator derivative: $\\frac{d}{dx}e^{\\sqrt{x}}=e^{\\sqrt{x}}\\cdot\\frac{1}{2\\sqrt{x}}$.",
      "Denominator derivative: $\\frac{d}{dx}(1+\\ln x)=\\frac{1}{x}$.",
      "Quotient Rule: $\\frac{\\frac{e^{\\sqrt{x}}}{2\\sqrt{x}}(1+\\ln x)-e^{\\sqrt{x}}\\cdot\\frac{1}{x}}{(1+\\ln x)^2}$.",
      "That's the answer (you can factor out $e^{\\sqrt{x}}$ to tidy up)."
    ],
    "trap": "Reversing the order in the Quotient Rule numerator (writing the backward version, top-derivative-of-bottom $-$ bottom-derivative-of-top), which flips the sign of the whole answer. Memory aid: bottom times derivative of top, minus top times derivative of bottom.",
    "check": "At $x=1$, $\\ln x=0$: derivative $=\\frac{e}{2}-e=-\\frac{e}{2}$."
  },
  "ch-nest-005": {
    "spot": "The square root inside $\\ln\\sqrt{1+e^x}$ can come out first: $\\ln\\sqrt{u}=\\frac{1}{2}\\ln u$. Simplify first and the Chain Rule has one less layer to peel.",
    "why": "After simplifying, the inner part is just $\\frac{1}{2}\\ln(1+e^x)$, whose derivative $\\frac{e^x}{2(1+e^x)}$ you can write at a glance; without simplifying you need one more square-root derivative.",
    "steps": [
      "Simplify: $\\ln\\sqrt{1+e^x}=\\frac{1}{2}\\ln(1+e^x)$.",
      "Inner derivative: $\\frac{d}{dx}\\frac{1}{2}\\ln(1+e^x)=\\frac{e^x}{2(1+e^x)}$.",
      "The outer $\\cos u$ has derivative $-\\sin u$.",
      "Together: $-\\sin\\left(\\ln\\sqrt{1+e^x}\\right)\\cdot\\frac{e^x}{2(1+e^x)}$."
    ],
    "trap": "Simplifying $\\ln\\sqrt{u}$ into $\\sqrt{\\ln u}$; or forgetting the minus sign in the derivative of the outer $\\cos$.",
    "check": "$e^x>0$, and when $\\ln\\sqrt{1+e^x}$ is between $0$ and $\\frac{\\pi}{2}$ we have $\\sin>0$, so the derivative is negative: e.g. about $-0.085$ at $x=0$."
  },
  "ch-pow-002": {
    "spot": "Both the base $x^2+1$ and the exponent $\\sin x$ vary — a variable raised to a variable power: neither the power rule nor the exponential rule applies, so use logarithmic differentiation.",
    "why": "Taking $\\ln$ brings the exponent down as a product, leaving just the Product Rule; writing it as $e^{\\sin x\\ln(x^2+1)}$ is essentially the same.",
    "steps": [
      "Take logs: $\\ln y=\\sin x\\cdot\\ln(x^2+1)$.",
      "Product Rule on the right: $\\cos x\\ln(x^2+1)+\\sin x\\cdot\\frac{2x}{x^2+1}$.",
      "The left side is $\\frac{y'}{y}$; multiply both sides by $y$: $y'=(x^2+1)^{\\sin x}\\left(\\cos x\\ln(x^2+1)+\\frac{2x\\sin x}{x^2+1}\\right)$."
    ],
    "trap": "Applying the power rule to get $\\sin x\\,(x^2+1)^{\\sin x-1}\\cdot 2x$: that only works when the exponent is constant, and it misses the entire $\\cos x\\ln(x^2+1)$ term.",
    "check": "At $x=0$, $y=1^0=1$ and the bracket is $\\cos 0\\cdot\\ln 1+0=0$, so $y'(0)=0$."
  },
  "cx-ftc-001": {
    "spot": "$\\sum\\frac{1}{n}\\left(\\frac{k}{n}\\right)^2$: $\\frac{1}{n}$ is the width, $\\frac{k}{n}$ are sample points in $[0,1]$, $g(x)=x^2$ — a Riemann sum.",
    "why": "Turning it into $\\int_0^1x^2\\,dx$ gets there in one step; the $\\sum k^2$ formula also works but is one more formula to remember.",
    "steps": [
      "Limit $=\\int_0^1x^2\\,dx$.",
      "$\\int_0^1x^2\\,dx=\\frac{x^3}{3}\\Big|_0^1=\\frac{1}{3}$.",
      "Cross-check: $\\sum_{k=1}^nk^2=\\frac{n(n+1)(2n+1)}{6}$, so the sum $=\\frac{(n+1)(2n+1)}{6n^2}\\to\\frac{2}{6}=\\frac{1}{3}$."
    ],
    "trap": "Merging the $\\frac{1}{n^2}$ from $\\left(\\frac{k}{n}\\right)^2$ with the leading $\\frac{1}{n}$ and then multiplying by it again, or using the wrong $\\sum k^2$ formula and getting $\\frac{1}{2}$.",
    "check": "At $n=10$ the sum is $\\frac{11\\cdot 21}{600}=0.385$; right-endpoint sampling is slightly above $\\frac{1}{3}$ ($x^2$ is increasing)."
  },
  "cx-hl-001": {
    "spot": "An $\\infty-\\infty$ form: both fractions blow up. Combine into $\\frac{x^2-\\sin^2x}{x^2\\sin^2x}$ first; the denominator is of order $x^4$, so expand the numerator to $x^4$.",
    "why": "After combining, the Taylor series of $\\sin x$ reveals the $x^4$ coefficient in one step; L'Hôpital's Rule would need four rounds of differentiation, which is painful.",
    "steps": [
      "Combine: $\\frac{1}{\\sin^2x}-\\frac{1}{x^2}=\\frac{x^2-\\sin^2x}{x^2\\sin^2x}$.",
      "$\\sin x=x-\\frac{x^3}{6}+\\cdots$, so $\\sin^2x=x^2-\\frac{x^4}{3}+\\cdots$.",
      "Denominator $x^2\\sin^2x\\sim x^4$.",
      "Limit $=\\frac{1/3}{1}=\\frac{1}{3}$."
    ],
    "trap": "Saying $\\sin x\\approx x$, so the two terms cancel to $0$: the first-order approximation throws away the real difference $\\frac{x^4}{3}$.",
    "check": "Plug in $x=0.1$: $\\frac{1}{\\sin^2 0.1}-100\\approx 0.3344$, close to $\\frac{1}{3}$."
  },
  "cx-hl-004": {
    "spot": "The $n$-th root of $n!$: taking logs turns the product into a sum, $\\ln\\frac{(n!)^{1/n}}{n}=\\frac{1}{n}\\sum_{k=1}^n\\ln\\frac{k}{n}$ — a Riemann sum for $\\ln x$ on $[0,1]$.",
    "why": "The Riemann sum needs only one integral, $\\int_0^1\\ln x\\,dx=-1$; Stirling's formula also works, but that's a result you'd have to memorize.",
    "steps": [
      "Take logs: $\\ln\\frac{(n!)^{1/n}}{n}=\\frac{1}{n}\\left(\\sum_{k=1}^n\\ln k-n\\ln n\\right)=\\frac{1}{n}\\sum_{k=1}^n\\ln\\frac{k}{n}$.",
      "This is a Riemann sum with limit $\\int_0^1\\ln x\\,dx$ (an improper integral, but convergent).",
      "$\\int_0^1\\ln x\\,dx=[x\\ln x-x]_0^1=-1$ ($x\\ln x\\to 0$).",
      "Undo the log: the limit $=e^{-1}$."
    ],
    "trap": "Thinking $(n!)^{1/n}$ is of the same order as $n$ and answering $1$: same order is right, but the ratio is $\\frac{1}{e}$, and that constant has to come from the integral.",
    "check": "$n=4$: $\\frac{24^{1/4}}{4}\\approx 0.553$; as $n$ grows it moves toward $\\frac{1}{e}\\approx 0.368$ (convergence is slow)."
  },
  "cx-hs-003": {
    "spot": "The numerator $n$ is one less than what the $(n+1)!$ in the denominator starts from: write $n$ as $(n+1)-1$ and it splits into $\\frac{1}{n!}-\\frac{1}{(n+1)!}$ — a telescoping series.",
    "why": "After splitting, everything in the middle cancels and only the first term survives; using the series for $e$ works too, but splitting is most direct.",
    "steps": [
      "$\\frac{n}{(n+1)!}=\\frac{(n+1)-1}{(n+1)!}=\\frac{1}{n!}-\\frac{1}{(n+1)!}$; for example $n=3$: $\\frac{3}{24}=\\frac{1}{6}-\\frac{1}{24}$.",
      "Partial sums telescope: $S_N=\\frac{1}{1!}-\\frac{1}{(N+1)!}$; for example $S_4=1-\\frac{1}{120}$.",
      "Generating-function cross-check: $\\sum_{n\\ge 1}\\frac{n\\,x^{n+1}}{(n+1)!}=xe^x-e^x+1$, whose derivative is $xe^x$.",
      "As $N\\to\\infty$, $\\frac{1}{(N+1)!}\\to 0$, so the sum is $1$ (the generating function at $x=1$ also gives $1$)."
    ],
    "trap": "After splitting into $\\frac{1}{n!}-\\frac{1}{(n+1)!}$, starting at $n=0$ and getting an extra $\\frac{1}{0!}+\\cdots$; the series starts at $n=1$, so the surviving first term is $\\frac{1}{1!}=1$.",
    "check": "The first four terms add to $0.9917$, already hugging $1$ from below."
  },
  "db-par-005": {
    "spot": "Second derivative for parametric equations: $\\frac{d^2y}{dx^2}$ is not $\\frac{y''(t)}{x''(t)}$; it is the $t$-derivative of $\\frac{dy}{dx}$, divided by $\\frac{dx}{dt}$.",
    "why": "Following the definition $\\frac{d}{dx}=\\frac{1}{x'(t)}\\frac{d}{dt}$ step by step is safest; here you can also eliminate the parameter to get $y=x^{3/2}$ as a check.",
    "steps": [
      "$\\frac{dy}{dx}=\\frac{3t^2}{2t}=\\frac{3t}{2}$.",
      "Differentiate in $t$: $\\frac{d}{dt}\\left(\\frac{3t}{2}\\right)=\\frac{3}{2}$.",
      "Divide by $\\frac{dx}{dt}=2t$: $\\frac{d^2y}{dx^2}=\\frac{3/2}{2t}=\\frac{3}{4t}$.",
      "Plug in $t=1$: $\\frac{3}{4}$."
    ],
    "trap": "Using $\\frac{y''(t)}{x''(t)}=\\frac{6t}{2}=3$: you can't get the second derivative by differentiating top and bottom twice each.",
    "check": "Eliminate the parameter: for $t>0$, $y=x^{3/2}$, $y''=\\frac{3}{4}x^{-1/2}$, which at $x=1$ is also $\\frac{3}{4}$."
  },
  "dd-opt-005": {
    "spot": "A rectangle inscribed in a semicircle: put the top-right corner on the circle at $(x,\\sqrt{25-x^2})$, width $2x$, height $\\sqrt{25-x^2}$. The area has only one variable.",
    "why": "Maximizing $A^2=4x^2(25-x^2)$ avoids the square root; or use $x=5\\cos\\theta$ to get $25\\sin 2\\theta$, whose maximum $25$ is obvious.",
    "steps": [
      "Area $A(x)=2x\\sqrt{25-x^2}$, $0<x<5$.",
      "$A'(x)=2\\sqrt{25-x^2}-\\frac{2x^2}{\\sqrt{25-x^2}}=\\frac{2(25-2x^2)}{\\sqrt{25-x^2}}$.",
      "$A'=0\\Rightarrow x^2=\\frac{25}{2}$, $x=\\frac{5}{\\sqrt{2}}$.",
      "$A=2\\cdot\\frac{5}{\\sqrt{2}}\\cdot\\frac{5}{\\sqrt{2}}=25$."
    ],
    "trap": "Writing the width as just $x$ (forgetting the rectangle is symmetric, half on each side), which gives $\\frac{25}{2}$.",
    "check": "Trig substitution: $A=25\\sin 2\\theta\\le 25$, with equality at $\\theta=\\frac{\\pi}{4}$. The nearby $x=3$ gives only $24$."
  },
  "gp-007": {
    "spot": "Both pieces of the broken line $(0,2)\\to(2,-2)\\to(4,2)$ cross the $x$-axis (at $x=1$ and $x=3$): the integral of $|f|$ is the sum of four triangle areas.",
    "why": "Splitting at the zeros and counting triangles is much faster than writing a piecewise function and integrating.",
    "steps": [
      "First piece $f=2-2x$, zero at $x=1$; second piece $f=2x-6$, zero at $x=3$.",
      "$[0,2]$ splits into two triangles with base $1$ and height $2$, each $1$.",
      "$[2,4]$ likewise has two triangles, total $2$.",
      "Total $1+1+1+1=4$."
    ],
    "trap": "Forgetting the absolute value: two pieces above the axis and two below cancel to $0$.",
    "check": "The four triangles are congruent (base $1$, height $2$), so $4\\times 1=4$."
  },
  "gx-017": {
    "spot": "The question asks for total distance, not displacement: after $t=6$ the velocity graph dips below the axis (moving backward), and that area counts as positive.",
    "why": "For a piecewise linear velocity graph just count trapezoids and triangles; only remember to take the absolute value of area below the axis.",
    "steps": [
      "$[0,2]$: a triangle with base $2$ and height $4$, area $4$.",
      "$[2,4]$: rectangle $2\\times 4=8$; $[4,6]$: triangle $4$. Total above the axis: $16$.",
      "$[6,8]$: $v=12-2t$ drops from $0$ to $-4$, a triangle below the axis with area $4$.",
      "Total distance $=16+4=20$."
    ],
    "trap": "Integrating $v$ directly and getting the displacement $16-4=12$: distance traveled backward is still distance traveled.",
    "check": "Displacement $12$ plus twice the backward amount $4$: $12+2\\cdot 4=20$."
  },
  "gx-052": {
    "spot": "Concave up means $f''>0$; both derivatives of $xe^{-x}$ still carry $e^{-x}$ (always positive), so the sign depends only on the polynomial factor in front.",
    "why": "Factor out $e^{-x}$ and the inequality becomes the linear $x-2>0$.",
    "steps": [
      "$f'(x)=e^{-x}-xe^{-x}=(1-x)e^{-x}$.",
      "$f''(x)=-e^{-x}-(1-x)e^{-x}=(x-2)e^{-x}$.",
      "$e^{-x}>0$, so $f''>0\\iff x>2$; $x=2$ is the inflection point.",
      "The interval where it is concave up is $(2,\\infty)$."
    ],
    "trap": "Taking $x<1$ from $f'>0$ as the answer (that's where it increases); or dropping a term in the Product Rule on the second derivative, getting $-(1-x)e^{-x}$ and a wrong inflection point at $x=1$.",
    "check": "The graph's highest point is at $x=1$ ($f'=0$), where it is concave down, so the concave-up interval must lie further to the right of $1$."
  },
  "lm-st-003": {
    "spot": "The numerator is the harmonic number $H_n=\\sum_{k=1}^n\\frac{1}{k}$, which differs from $\\int_1^n\\frac{1}{x}dx=\\ln n$ by only a bounded amount — dividing by $\\ln n$ crushes that amount.",
    "why": "Comparing with an integral squeezes $H_n$ between $\\ln(n+1)$ and $1+\\ln n$, and both bounds divided by $\\ln n$ go to $1$; you don't need the value of $\\gamma$.",
    "steps": [
      "Compare with the area under $\\frac{1}{x}$: $\\int_1^{n+1}\\frac{dx}{x}\\le H_n\\le 1+\\int_1^n\\frac{dx}{x}$, i.e. $\\ln(n+1)\\le H_n\\le 1+\\ln n$.",
      "The difference $H_n-\\ln n$ converges to the Euler constant $\\gamma\\approx 0.5772$ (summing the terms $\\frac{1}{n}-\\ln\\left(1+\\frac{1}{n}\\right)$).",
      "So $\\frac{H_n}{\\ln n}=1+\\frac{H_n-\\ln n}{\\ln n}$: the numerator is bounded and the denominator $\\to\\infty$.",
      "Let $x=\\ln n\\to\\infty$: $\\frac{x+\\gamma}{x}\\to 1$, so the limit is $1$."
    ],
    "trap": "Thinking $\\gamma$ survives and answering $1+\\gamma$: $\\gamma$ is a constant added to the numerator, and dividing by $\\ln n$, which goes to infinity, wipes it out.",
    "check": "Convergence is slow: at $n=10^6$, $H_n\\approx 14.39$ and $\\ln n\\approx 13.82$, ratio about $1.042$, still off by $\\frac{\\gamma}{\\ln n}$."
  },
  "lx-app-008": {
    "spot": "No matter how much you practice means $x\\to\\infty$; $\\frac{95x}{x+12}$ has numerator and denominator both linear, so the ceiling is the ratio of leading coefficients, $95$.",
    "why": "Find the horizontal asymptote; rewriting as $95-\\frac{1140}{x+12}$ also shows it never actually reaches $95$.",
    "steps": [
      "Rewrite: $\\frac{95x}{x+12}=95-\\frac{1140}{x+12}$.",
      "$\\frac{1140}{x+12}>0$, so $A(x)<95$ always.",
      "As $x\\to\\infty$, $\\frac{1140}{x+12}\\to 0$ and $A(x)\\to 95$, so the ceiling is $95$ percent."
    ],
    "trap": "Answering $100$ (the intuitive cap on accuracy): the model's ceiling is $95$, set by the formula.",
    "check": "Practicing $12$ hours gets you exactly halfway, $47.5$; it takes $1188$ hours to reach $94.05$."
  },
  "lx-con-003": {
    "spot": "The denominator is $0$ at $x=3$: for the discontinuity to be removable, the numerator must also be $0$ at $x=3$ so that $(x-3)$ cancels.",
    "why": "If the numerator is nonzero you get a $\\frac{\\text{nonzero}}{0}$ form, a vertical asymptote that no value can fill; so first force the numerator to vanish at $3$.",
    "steps": [
      "The numerator must vanish at $x=3$: $9+3a+6=0$.",
      "This gives $a=-5$, and the numerator is $x^2-5x+6=(x-2)(x-3)$.",
      "After canceling, $f(x)=x-2$ ($x\\ne 3$) with limit $1$; defining $f(3)=1$ makes it continuous.",
      "So $a=-5$."
    ],
    "trap": "Believing a zero denominator always means an asymptote and saying there is no solution; or writing the equation as $9+3a+6=1$ (mixing in the fill-in value).",
    "check": "Try another $a$, say $a=0$: the numerator at $3$ is $15\\ne 0$, and as $x\\to 3^+$ it shoots to $+\\infty$."
  },
  "lx-seq-001": {
    "spot": "Recursion $a_{n+1}=\\sqrt{2+a_n}$: if the limit $L$ exists, taking limits on both sides gives $L=\\sqrt{2+L}$. But first confirm it actually converges (increasing and bounded above by $2$).",
    "why": "The Monotone Convergence Theorem guarantees convergence, and the fixed-point equation gives the value directly; computing terms one by one only lets you guess.",
    "steps": [
      "First few terms: $a_1=1$, $a_2=\\sqrt{3}\\approx 1.732$, $a_3=\\sqrt{2+\\sqrt{3}}\\approx 1.932$, increasing.",
      "Bounded above: if $a_n<2$ then $a_{n+1}<\\sqrt{4}=2$; by induction $a_n<2$.",
      "Monotone and bounded means convergent; taking limits, $L=\\sqrt{2+L}$, and squaring gives $L^2-L-2=(L-2)(L+1)=0$.",
      "$a_n>0$, so the negative root $L=-1$ is rejected and $L=2$."
    ],
    "trap": "Solving the equation without checking convergence; or keeping $L=-1$. Every term is a positive square root, so the limit can't be negative.",
    "check": "$a_3\\approx 1.932$, $a_4\\approx 1.983$; the gap to $2$ shrinks to about a quarter each time."
  },
  "td-ser-001": {
    "spot": "A variable to a variable power, $(1+x)^x$: write it as $e^{x\\ln(1+x)}$. The exponent $u=x\\ln(1+x)$ starts at $x^2$, so expanding $e^u$ up to $\\frac{u^3}{6}$ is enough for $x^6$.",
    "why": "Expand $u$ first, then substitute into $e^u$, tracking only the combinations that make $x^6$; differentiating six times directly is hopeless.",
    "steps": [
      "$u=x\\ln(1+x)=x^2-\\frac{x^3}{2}+\\frac{x^4}{3}-\\frac{x^5}{4}+\\frac{x^6}{5}-\\cdots$.",
      "The $x^6$ coefficient in $u$: $\\frac{1}{5}$.",
      "The $x^6$ term in $\\frac{u^2}{2}$: $u^2$ gets it from $x^2\\cdot\\frac{x^4}{3}$ (twice) and $\\left(-\\frac{x^3}{2}\\right)^2$, giving $\\frac{2}{3}+\\frac{1}{4}=\\frac{11}{12}$; divide by $2$ to get $\\frac{11}{24}$.",
      "The $x^6$ term in $\\frac{u^3}{6}$: only $(x^2)^3$, coefficient $\\frac{1}{6}$; the higher $\\frac{u^4}{24}$ starts at $x^8$.",
      "Total: $\\frac{24+55+20}{120}=\\frac{99}{120}=\\frac{33}{40}$."
    ],
    "trap": "Stopping at $\\frac{u^2}{2}$ and missing the $\\frac{1}{6}$ from $\\frac{u^3}{6}$, getting $\\frac{79}{120}$. Since $u$ starts at $x^2$, $u^3$ still reaches $x^6$.",
    "check": "Lower coefficients by the same method: $(1+x)^x=1+x^2-\\frac{x^3}{2}+\\frac{5}{6}x^4-\\cdots$, which matches numerically."
  },
  "vc-div-001": {
    "spot": "Flux through a closed surface (the whole sphere), and $\\mathbf{F}=\\langle x,y,z\\rangle$ has constant divergence $3$: the Divergence Theorem turns the flux into $3\\times$ volume.",
    "why": "With constant divergence the volume integral is just a multiple of the volume; doing the surface integral on the sphere directly means parametrizing two angles.",
    "steps": [
      "$\\nabla\\cdot\\mathbf{F}=\\frac{\\partial x}{\\partial x}+\\frac{\\partial y}{\\partial y}+\\frac{\\partial z}{\\partial z}=3$.",
      "Volume of the unit ball: $\\frac{4}{3}\\pi$.",
      "Flux $=3\\cdot\\frac{4}{3}\\pi=4\\pi$."
    ],
    "trap": "Computing the divergence as $1$ (looking at only one component), giving $\\frac{4\\pi}{3}$. Divergence adds the partial derivative of each of the three components.",
    "check": "Directly: on the sphere $\\mathbf{F}\\cdot\\mathbf{n}=x^2+y^2+z^2=1$, so the flux is just the surface area $4\\pi$."
  },
  "vc-div-005": {
    "spot": "The scary-looking terms $\\sin z$, $e^z$, $\\cos x$ each avoid the variable being differentiated — they all vanish in the divergence, leaving the constant $3$. Closed sphere → Divergence Theorem.",
    "why": "A direct surface integral gets stuck on $e^z$ and $\\sin z$; the Divergence Theorem means you never compute them.",
    "steps": [
      "$\\frac{\\partial}{\\partial x}(x+\\sin z)=1$.",
      "$\\frac{\\partial}{\\partial y}(y+e^z)=1$, $\\frac{\\partial}{\\partial z}(z+\\cos x)=1$, divergence $=3$.",
      "Volume of the ball of radius $2$: $\\frac{4}{3}\\pi\\cdot 8=\\frac{32\\pi}{3}$.",
      "Flux $=3\\cdot\\frac{32\\pi}{3}=32\\pi$."
    ],
    "trap": "The sphere $x^2+y^2+z^2=4$ has radius $2$, not $4$; using radius $4$ gives $256\\pi$.",
    "check": "Compare with $\\langle x,y,z\\rangle$ on the unit sphere: flux $4\\pi$ times radius cubed $8$ is exactly $32\\pi$."
  },
  "vc-nab-011": {
    "spot": "Each component of $\\langle yz,zx,xy\\rangle$ is $xyz$ with one variable missing — exactly $\\nabla(xyz)$. The curl of a gradient field is always zero.",
    "why": "Recognizing a gradient field saves the $3\\times 3$ determinant; checking component by component is also quick, just to be safe.",
    "steps": [
      "$\\nabla(xyz)=\\langle yz,xz,xy\\rangle=\\mathbf{F}$.",
      "Component by component: $(\\nabla\\times\\mathbf{F})_x=\\frac{\\partial(xy)}{\\partial y}-\\frac{\\partial(zx)}{\\partial z}=x-x=0$.",
      "The $y$ and $z$ components likewise: $y-y=0$, $z-z=0$.",
      "The curl is the zero vector, length $0$."
    ],
    "trap": "Getting the signs in the curl determinant wrong (e.g. no minus sign on the second component): here every term cancels so it doesn't show, but on another problem it will be wrong.",
    "check": "A gradient field is conservative: work around any closed path is zero, so the curl is naturally zero."
  },
  "vc-rec-001": {
    "spot": "The problem writes $\\oint\\!\\!\\oint_S$ — flux through a closed surface. A closed surface encloses a volume, which is exactly where the Divergence Theorem applies.",
    "why": "Stokes' Theorem deals with a surface that has a boundary and its boundary curve; a closed surface has no boundary, so use the Divergence (Gauss) Theorem to convert to $\\iiint\\nabla\\cdot\\mathbf{F}\\,dV$.",
    "steps": [
      "Divergence Theorem: $\\oint\\!\\!\\oint_S\\mathbf{F}\\cdot d\\mathbf{S}=\\iiint_V\\nabla\\cdot\\mathbf{F}\\,dV$. For example $\\mathbf{F}=\\langle x,y,z\\rangle$ has divergence $3$.",
      "On the unit ball: the right side is $3\\cdot\\frac{4\\pi}{3}=4\\pi$, and the left side is $\\mathbf{F}\\cdot\\mathbf{n}=1$ times area $4\\pi$; they agree.",
      "Answer: the Divergence Theorem (Gauss's Theorem)."
    ],
    "trap": "Seeing a surface and choosing Stokes' Theorem: Stokes turns a line integral into the flux of the curl through a surface, not the flux through a closed surface into a volume integral.",
    "check": "Compare: line integral <-> plane region uses Green's Theorem; surface with boundary <-> boundary curve uses Stokes; closed surface <-> enclosed volume uses the Divergence Theorem."
  },
  "vc-work-002": {
    "spot": "$P\\,dx+Q\\,dy$ around a closed curve, with simple $P=y$ and $Q=-x$, and the unit disk's area is known: Green's Theorem.",
    "why": "Green's Theorem turns the line integral into $\\iint(Q_x-P_y)\\,dA$; the integrand is the constant $-2$, so just multiply by the area. Parametrizing is also quick and serves as a check.",
    "steps": [
      "$Q_x-P_y=\\frac{\\partial(-x)}{\\partial x}-\\frac{\\partial y}{\\partial y}=-1-1=-2$.",
      "Area of the unit disk: $\\pi$.",
      "Line integral $=-2\\cdot\\pi=-2\\pi$."
    ],
    "trap": "Remembering the formula as $P_y-Q_x$ and answering $2\\pi$; Green's Theorem uses $Q_x-P_y$ (counterclockwise is positive).",
    "check": "Parametrize $x=\\cos t$, $y=\\sin t$: $y\\,dx-x\\,dy=(-\\sin^2t-\\cos^2t)\\,dt=-dt$, so one loop gives $-2\\pi$."
  },
  "db-par-008": {
    "spot": "$x=\\ln t$ is easy to invert: $t=e^x$, so $y=e^{2x}-1$ — the parameter disappears and it becomes an ordinary second derivative.",
    "why": "After eliminating the parameter, $y''=4e^{2x}$ in one step; the parametric formula also works but needs an extra division by $\\frac{dx}{dt}$.",
    "steps": [
      "Parametric method: $\\frac{dy}{dx}=\\frac{2t}{1/t}=2t^2$.",
      "Differentiate in $t$: $4t$; then divide by $\\frac{dx}{dt}=\\frac{1}{t}$: $\\frac{d^2y}{dx^2}=4t^2$.",
      "Cross-check by eliminating the parameter: $t=e^x$, $y=e^{2x}-1$, $y''=4e^{2x}=4t^2$.",
      "At $t=1$ (i.e. $x=0$): $4$."
    ],
    "trap": "Stopping after differentiating $\\frac{dy}{dx}=2t^2$ and answering $4t=4$ — the number happens to match here, but without dividing by $\\frac{dx}{dt}$ it's wrong for other $t$ (e.g. at $t=2$ the correct answer is $16$, the wrong one $8$).",
    "check": "At $t=2$ the correct answer is $4\\cdot 4=16$, consistent with $4e^{2\\ln 2}=16$."
  },
  "dd-inv-004": {
    "spot": "Outer $\\arctan u$, inner $u=\\sqrt{x^2-1}$: in the outer derivative $\\frac{1}{1+u^2}$, $u^2=x^2-1$ makes $1+u^2=x^2$, so everything simplifies nicely.",
    "why": "Two layers of Chain Rule; note that $1+u^2$ becomes $x^2$, so the final result is simpler than it looks.",
    "steps": [
      "Outer: $\\frac{1}{1+u^2}=\\frac{1}{1+(x^2-1)}=\\frac{1}{x^2}$.",
      "Inner: $\\frac{d}{dx}\\sqrt{x^2-1}=\\frac{x}{\\sqrt{x^2-1}}$.",
      "Multiply: $\\frac{1}{x^2}\\cdot\\frac{x}{\\sqrt{x^2-1}}=\\frac{1}{x\\sqrt{x^2-1}}$ ($x>1$)."
    ],
    "trap": "Dropping the inner derivative and writing just $\\frac{1}{x^2}$; or writing $1+u^2$ as $1+\\sqrt{x^2-1}$ (forgetting to square).",
    "check": "For $x>1$, $\\arctan\\sqrt{x^2-1}=\\operatorname{arcsec}x$, and the derivative of $\\operatorname{arcsec}$ is exactly $\\frac{1}{x\\sqrt{x^2-1}}$; at $x=2$ the value is $\\frac{1}{2\\sqrt{3}}$."
  },
  "dm-int-002": {
    "spot": "$\\ln(1-x)=-\\sum\\frac{x^n}{n}$; multiplied by $\\ln x$, each term is a standard integral $\\int_0^1x^n\\ln x\\,dx=-\\frac{1}{(n+1)^2}$ — the integral becomes a series.",
    "why": "A product of two logs has no elementary antiderivative; expanding and integrating term by term turns it into a series that splits by partial fractions.",
    "steps": [
      "Expand: $\\ln(1-x)=-\\sum_{n\\ge 1}\\frac{x^n}{n}$, so the integral $=-\\sum_{n\\ge 1}\\frac{1}{n}\\int_0^1x^n\\ln x\\,dx$.",
      "Integration by parts: $\\int_0^1x^n\\ln x\\,dx=-\\frac{1}{(n+1)^2}$; for example $n=3$ gives $-\\frac{1}{16}$.",
      "So the integral $=\\sum_{n\\ge 1}\\frac{1}{n(n+1)^2}$; partial fractions: $\\frac{1}{n(n+1)^2}=\\frac{1}{n}-\\frac{1}{n+1}-\\frac{1}{(n+1)^2}$.",
      "The first two telescope to $1$; the third is $\\zeta(2)-1=\\frac{\\pi^2}{6}-1$.",
      "Total $1-\\left(\\frac{\\pi^2}{6}-1\\right)=2-\\frac{\\pi^2}{6}$."
    ],
    "trap": "Treating the third sum as $\\sum_{n\\ge 1}\\frac{1}{n^2}=\\frac{\\pi^2}{6}$, forgetting it starts at $(n+1)=2$ so $1$ must be subtracted, which gives $1-\\frac{\\pi^2}{6}<0$ — but a product of two negative logs is positive, so the integral can't be negative.",
    "check": "$\\ln x$ and $\\ln(1-x)$ are both negative on $(0,1)$, so the product is positive; the answer $\\approx 0.355$ is positive."
  },
  "dm-int-003": {
    "spot": "$\\frac{x}{\\tan x}=x\\cdot\\frac{\\cos x}{\\sin x}$, and $\\frac{\\cos x}{\\sin x}$ is exactly the derivative of $\\ln\\sin x$ — differentiate $x$, integrate $\\frac{\\cos x}{\\sin x}$, and the problem becomes the classic $\\int_0^{\\pi/2}\\ln\\sin x\\,dx$.",
    "why": "Integration by parts removes the extra $x$; the remaining log-sine integral falls to the symmetry $x\\mapsto\\frac{\\pi}{2}-x$ and the double-angle formula.",
    "steps": [
      "Let $u=x$, $dv=\\frac{\\cos x}{\\sin x}dx$, so $v=\\ln\\sin x$.",
      "Boundary term $[x\\ln\\sin x]_0^{\\pi/2}$: at the upper limit $\\ln 1=0$; at the lower limit $x\\ln\\sin x\\to 0$.",
      "So the original integral $=-\\int_0^{\\pi/2}\\ln\\sin x\\,dx$.",
      "Let $I=\\int_0^{\\pi/2}\\ln\\sin x\\,dx=\\int_0^{\\pi/2}\\ln\\cos x\\,dx$; adding and using $\\sin x\\cos x=\\frac{1}{2}\\sin 2x$ gives $2I=-\\frac{\\pi}{2}\\ln 2+I$, so $I=-\\frac{\\pi}{2}\\ln 2$.",
      "The original integral $=\\frac{\\pi}{2}\\ln 2$."
    ],
    "trap": "At $x=0$ the boundary term is $0\\cdot(-\\infty)$, and some declare it divergent; in fact $x\\ln\\sin x\\sim x\\ln x\\to 0$.",
    "check": "$\\frac{x}{\\tan x}$ decreases from $1$ to $0$, so the integral should be between $0$ and $\\frac{\\pi}{2}$; $\\frac{\\pi}{2}\\ln 2\\approx 1.089$ is reasonable."
  },
  "dx-eng-001": {
    "spot": "Two light sources, brightness $\\propto\\frac{\\text{intensity}}{\\text{distance}^2}$: let the distance from the first lamp be $x$, total brightness $\\frac{1}{x^2}+\\frac{8}{(10-x)^2}$. Darkest = minimum, so set the derivative to zero.",
    "why": "Setting the derivative to zero gives $(10-x)^3=8x^3$; taking cube roots leaves a linear equation, faster than numerical trial.",
    "steps": [
      "$I(x)=\\frac{1}{x^2}+\\frac{8}{(10-x)^2}$, $I'(x)=-\\frac{2}{x^3}+\\frac{16}{(10-x)^3}$.",
      "$I'=0$: $(10-x)^3=8x^3$; cube roots give $10-x=2x$.",
      "$x=\\frac{10}{3}$; $I''>0$, so it is indeed a minimum (darkest).",
      "The darkest point is $\\frac{10}{3}\\approx 3.33$ m from the first lamp."
    ],
    "trap": "Splitting the distance in the brightness ratio $1:8$ directly ($x:(10-x)=1:8$), giving $\\frac{10}{9}$; the correct relation is that the ratio of the cubes of the distances equals the intensity ratio, $\\sqrt[3]{8}=2$.",
    "check": "Nearby points are brighter: $I(3)$ and $I(3.7)$ both exceed $I\\left(\\frac{10}{3}\\right)$."
  },
  "lx-eps-002": {
    "spot": "$|x^2-9|<0.25$ solves to $\\sqrt{8.75}<x<\\sqrt{9.25}$ — this interval is not symmetric about $3$: $x^2$ grows faster to the right, so the right side is narrower. $\\delta$ can only be the narrower side.",
    "why": "Solving for the exact interval and comparing both sides gives the true maximum, unlike plugging into an estimate such as $\\delta=\\frac{\\varepsilon}{6}$.",
    "steps": [
      "$|x^2-9|<0.25\\iff 8.75<x^2<9.25\\iff\\sqrt{8.75}<x<\\sqrt{9.25}$ ($x$ is positive near $3$).",
      "Right width $\\sqrt{9.25}-3\\approx 0.04138$, left width $3-\\sqrt{8.75}\\approx 0.04196$.",
      "$\\delta$ must keep both sides inside the interval, so take the smaller: $\\delta=\\sqrt{9.25}-3$."
    ],
    "trap": "Taking the wider left side $3-\\sqrt{8.75}$: then some $x$ on the right escape, with $x^2$ above $9.25$.",
    "check": "The linear estimate $\\delta\\approx\\frac{0.25}{2\\cdot 3}\\approx 0.0417$ lies between the two widths; the exact value is slightly smaller."
  },
  "vc-green-007": {
    "spot": "$e^{x^2}$ contains only $x$ and sits in front of $dx$; $\\ln(1+y^2)$ contains only $y$ and sits in front of $dy$ — both hard terms vanish in $Q_x-P_y$. Closed curve → Green's Theorem.",
    "why": "Parametrizing directly gets stuck on the integral of $e^{\\cos^2 t}$; Green's Theorem leaves only a constant curl times area.",
    "steps": [
      "$P=e^{x^2}-y$, $P_y=-1$.",
      "$Q=x+\\ln(1+y^2)$, $Q_x=1$.",
      "$Q_x-P_y=1-(-1)=2$, and the unit disk has area $\\pi$.",
      "Line integral $=2\\pi$."
    ],
    "trap": "Getting scared by $e^{x^2}$ and trying to integrate it: in Green's Theorem it is only hit by $\\partial_y$, which gives $0$ immediately.",
    "check": "Numerically integrating the direct parametrization ($x=\\cos t$, $y=\\sin t$) also gives $2\\pi$."
  },
  "vc-stokes-002": {
    "spot": "Circulation around a closed curve in space (a horizontal circle at $z=1$): Stokes' Theorem turns it into the flux of the curl through the disk; the curl of $\\mathbf{F}=\\langle z,x,y\\rangle$ is the constant $\\langle 1,1,1\\rangle$.",
    "why": "The simplest surface bounded by the curve is a flat disk with normal $\\hat{z}$, so you need only the $z$ component of the curl times the area.",
    "steps": [
      "Curl: $(\\partial_yF_3-\\partial_zF_2,\\ \\partial_zF_1-\\partial_xF_3,\\ \\partial_xF_2-\\partial_yF_1)=(1-0,\\ 1-0,\\ 1-0)$.",
      "Counterclockwise seen from above → take the normal $+\\hat{z}$, $(\\nabla\\times\\mathbf{F})\\cdot\\hat{z}=1$.",
      "Disk area $\\pi$, flux $=1\\cdot\\pi=\\pi$."
    ],
    "trap": "Adding all three curl components ($3\\pi$), or using the curl's length $\\sqrt{3}\\pi$: only the component along the normal $\\hat{z}$ passes through the disk.",
    "check": "Parametrize directly $\\mathbf{r}=(\\cos t,\\sin t,1)$: $\\mathbf{F}\\cdot d\\mathbf{r}=(-\\sin t+\\cos^2t)\\,dt$, and one loop gives $\\pi$."
  },
  "lim-031": {
    "spot": "The numerator $x^2y^2$ is degree four and the denominator $x^2+y^2$ degree two: a degree gap of $2$, so polar coordinates leave an $r^2$ that crushes everything to $0$.",
    "why": "Polar coordinates turn two variables into $r\\to 0$ times a bounded angle function, handling all paths at once; trying a few paths can never prove the limit exists.",
    "steps": [
      "Substitute $x=r\\cos\\theta$, $y=r\\sin\\theta$: $\\frac{r^4\\cos^2\\theta\\sin^2\\theta}{r^2}=r^2\\cos^2\\theta\\sin^2\\theta$.",
      "$\\cos^2\\theta\\sin^2\\theta\\le 1$, so $0\\le$ the expression $\\le r^2$.",
      "As $r\\to 0$, $r^2\\to 0$; by the Squeeze Theorem the limit is $0$."
    ],
    "trap": "Trying only the $x$-axis, the $y$-axis and $y=x$, getting $0$, and concluding: you can't try every path, so you need a bound that works in every direction (here $r^2$).",
    "check": "Along $y=x$: the expression $=\\frac{x^4}{2x^2}=\\frac{x^2}{2}\\to 0$, consistent with the conclusion."
  },
  "lim-034": {
    "spot": "Numerator degree three, denominator degree two: one degree more, so polar coordinates leave $r\\cos^3\\theta$, and one $r$ is enough to crush it to $0$.",
    "why": "Using $|x|\\le r$ gives the one-line bound $\\left|\\frac{x^3}{x^2+y^2}\\right|\\le r$, valid in every direction at once.",
    "steps": [
      "Polar coordinates: $\\frac{r^3\\cos^3\\theta}{r^2}=r\\cos^3\\theta$.",
      "$|\\cos^3\\theta|\\le 1$, so $\\left|\\frac{x^3}{x^2+y^2}\\right|\\le|x|\\le r$.",
      "As $r\\to 0$, the Squeeze Theorem gives limit $0$."
    ],
    "trap": "Seeing the denominator go to $0$ and declaring divergence: the numerator goes to $0$ faster (cubic versus quadratic).",
    "check": "Along the $x$-axis: $\\frac{x^3}{x^2}=x\\to 0$."
  },
  "ser-032": {
    "spot": "The general term $\\left(\\frac{n}{n+1}\\right)^n=\\left(1-\\frac{1}{n+1}\\right)^n$ is a $1^\\infty$ form that tends to $\\frac{1}{e}$, not $0$ — the $n$-th term test says divergent right away.",
    "why": "If the terms don't go to $0$, there's no need for the Ratio or Root Test (the Root Test gives $1$ here, inconclusive).",
    "steps": [
      "$\\left(\\frac{n}{n+1}\\right)^n=\\frac{1}{\\left(1+\\frac{1}{n}\\right)^n}$.",
      "$\\left(1+\\frac{1}{n}\\right)^n\\to e$, so the general term $\\to\\frac{1}{e}\\ne 0$.",
      "The $n$-th term doesn't go to $0$, so the series diverges."
    ],
    "trap": "Using the Root Test: $\\sqrt[n]{a_n}=\\frac{n}{n+1}\\to 1$, inconclusive, and you're stuck; or assuming that since $\\frac{n}{n+1}<1$ its $n$-th power must go to $0$.",
    "check": "At $n=100$ the term is about $0.3697$, close to $\\frac{1}{e}\\approx 0.3679$; a hundred terms already add up to more than $36$."
  },
  "der-035": {
    "spot": "$z$ is a function of $x,y$, and $x,y$ are both functions of $t$ only: you can use the multivariable Chain Rule, or substitute directly to get $z=t^4e^t$ and differentiate in one variable.",
    "why": "Substituting is fastest ($z=t^4e^t$ with the Product Rule); the Chain Rule $z_x x'+z_y y'$ serves as a cross-check.",
    "steps": [
      "Substitute: $z=(t^2)^2e^t=t^4e^t$.",
      "Product Rule: $\\frac{dz}{dt}=4t^3e^t+t^4e^t$.",
      "Chain Rule cross-check: $z_x x'+z_y y'=2xy\\cdot 2t+x^2\\cdot e^t=4t^3e^t+t^4e^t$.",
      "So $\\frac{dz}{dt}=e^t(4t^3+t^4)$."
    ],
    "trap": "Writing only $z_x\\cdot x'$ in the Chain Rule and missing the path through $y$, $z_y\\cdot y'$, which gives $4t^3e^t$.",
    "check": "At $t=0$, $z=t^4e^t$ is at the bottom of a valley, so the derivative should be $0$."
  },
  "der-075": {
    "spot": "Expand $(x+iy)^3$ with the binomial theorem, using $i^2=-1$ and $i^3=-i$: the real part collects the terms with even powers of $i$.",
    "why": "The binomial expansion has only four terms; you can also cross-check with the polar form $r^3\\cos 3\\theta$.",
    "steps": [
      "$(x+iy)^3=x^3+3x^2(iy)+3x(iy)^2+(iy)^3$.",
      "$i^2=-1$, $i^3=-i$: $=x^3+3ix^2y-3xy^2-iy^3$.",
      "Real part: $x^3-3xy^2$ (the imaginary part is $3x^2y-y^3$).",
      "Polar cross-check: real part $=r^3\\cos 3\\theta$, with $r=\\sqrt{x^2+y^2}$, $\\theta=\\arctan\\frac{y}{x}$ ($x>0$)."
    ],
    "trap": "Treating the $i^2$ in $3x(iy)^2$ as $+1$, which gives $x^3+3xy^2$.",
    "check": "$x=1$, $y=1$: $(1+i)^3=-2+2i$, real part $-2$; the formula gives $1-3=-2$."
  },
  "der-087": {
    "spot": "$\\operatorname{Re}(z^3)=x^3-3xy^2$ is the real part of an analytic function — so it must be harmonic, and its Laplacian is $0$.",
    "why": "Knowing that the real part of an analytic function is harmonic answers it instantly; computing $u_{xx}+u_{yy}$ directly confirms it in two lines.",
    "steps": [
      "$u=\\operatorname{Re}(x+iy)^3=x^3-3xy^2$.",
      "$u_{xx}=6x$.",
      "$u_{yy}=-6x$.",
      "$\\Delta u=6x-6x=0$."
    ],
    "trap": "Treating $\\Delta$ as the gradient, or stopping after $u_{xx}=6x$; the Laplacian is the sum of the two second partial derivatives.",
    "check": "The imaginary part $v=3x^2y-y^3$ is harmonic too: $6y-6y=0$."
  },
  "int-034": {
    "spot": "The integrand is $1$, so this is just the area of the region; $0\\le y\\le\\sqrt{1-x^2}$, $0\\le x\\le 1$ is the quarter of the unit disk in the first quadrant.",
    "why": "Recognizing the shape gives $\\frac{\\pi}{4}$ directly; grinding out $\\int_0^1\\sqrt{1-x^2}\\,dx$ needs a trigonometric substitution.",
    "steps": [
      "Inner: $\\int_0^{\\sqrt{1-x^2}}1\\,dy=\\sqrt{1-x^2}$.",
      "$y=\\sqrt{1-x^2}$ is the upper unit semicircle; with $x\\in[0,1]$ it's the quarter disk in the first quadrant.",
      "Area $=\\frac{1}{4}\\pi\\cdot 1^2=\\frac{\\pi}{4}$."
    ],
    "trap": "Thinking $\\sqrt{1-x^2}$ is a straight line and answering $\\frac{1}{2}$ with a triangle's area.",
    "check": "Polar coordinates: $\\int_0^{\\pi/2}\\int_0^1r\\,dr\\,d\\theta=\\frac{\\pi}{2}\\cdot\\frac{1}{2}=\\frac{\\pi}{4}$."
  },
  "lim-036": {
    "spot": "In $\\ln(1+u)$, $u=x+x^2$ goes to $0$; the numerator subtracts $x$ and the denominator is $x^2$: expand $\\ln(1+u)=u-\\frac{u^2}{2}+\\cdots$ up to the $x^2$ term.",
    "why": "A Taylor expansion shows the $x^2$ coefficient in one line; L'Hôpital's Rule needs two rounds, and the expression inside $\\ln$ makes the derivatives messy.",
    "steps": [
      "Plug in $x=0$: $\\ln 1-0=0$, a $\\frac{0}{0}$ form.",
      "$\\ln(1+u)=u-\\frac{u^2}{2}+\\cdots$ with $u=x+x^2$: $u^2=x^2+\\cdots$.",
      "So $\\ln(1+x+x^2)=x+x^2-\\frac{x^2}{2}+O(x^3)=x+\\frac{x^2}{2}+O(x^3)$.",
      "Subtract $x$ and divide by $x^2$: the limit is $\\frac{1}{2}$."
    ],
    "trap": "Expanding only one term, $\\ln(1+u)\\approx u=x+x^2$, and getting $1$: you missed that $-\\frac{u^2}{2}$ also contains an $x^2$ term.",
    "check": "Plug in $x=0.01$: the ratio is about $0.497$, close to $\\frac{1}{2}$."
  },
  "der-037": {
    "spot": "The Hessian determinant is $f_{xx}f_{yy}-f_{xy}^2$; the second partials of $x^3+y^3-3xy$ are all simple, so just plug in $(1,1)$.",
    "why": "Write the general form of all three second partials first, then plug in the point — the safest way not to miss the mixed partial.",
    "steps": [
      "First order: $f_x=3x^2-3y$, $f_y=3y^2-3x$.",
      "Second order: $f_{xx}=6x$, $f_{yy}=6y$, $f_{xy}=-3$.",
      "At $(1,1)$: $f_{xx}=f_{yy}=6$, determinant $6\\cdot 6-(-3)^2=27$."
    ],
    "trap": "Writing the determinant as $f_{xx}f_{yy}+f_{xy}^2=45$, or forgetting to square $f_{xy}^2$ and getting $39$.",
    "check": "$(1,1)$ is a critical point ($f_x=f_y=0$); the Hessian is positive with $f_{xx}>0$, so it is a local min — the classic minimum of this function."
  },
  "der-042": {
    "spot": "Estimate with the total differential: $df=f_x\\,dx+f_y\\,dy$. At $(3,4)$, $\\sqrt{x^2+y^2}=5$, so the partial derivatives are the clean $\\frac{3}{5}$ and $\\frac{4}{5}$.",
    "why": "The total differential needs only two partial derivatives times the increments; computing $f(3.06,3.92)-5$ directly needs a square root, and the problem asks for the linear estimate anyway.",
    "steps": [
      "$f_x=\\frac{x}{\\sqrt{x^2+y^2}}$, which at $(3,4)$ is $\\frac{3}{5}$.",
      "$f_y=\\frac{y}{\\sqrt{x^2+y^2}}$, which at $(3,4)$ is $\\frac{4}{5}$.",
      "$df=\\frac{3}{5}(0.06)+\\frac{4}{5}(-0.08)=0.036-0.064=-0.028$."
    ],
    "trap": "$dy$ is negative; dropping the minus sign gives $0.036+0.064=0.1$.",
    "check": "The actual change $\\sqrt{3.06^2+3.92^2}-5\\approx -0.0271$ is very close to the estimate $-0.028$."
  },
  "der-047": {
    "spot": "A quadratic polynomial whose cross term $2xy$ has a coefficient smaller than the $x^2$, $y^2$ coefficients ($1\\cdot 3>1^2$): an upward-opening paraboloid, so the only critical point is the global minimum.",
    "why": "Setting both first partials to zero gives a linear system; solve and substitute back. Completing the square also reads off the minimum directly.",
    "steps": [
      "$f_x=2x+2y-4$, $f_y=2x+6y-6$.",
      "Solve $f_x=f_y=0$: subtracting gives $4y=2$, so $y=\\frac{1}{2}$, $x=\\frac{3}{2}$.",
      "Hessian $\\begin{pmatrix}2&2\\\\2&6\\end{pmatrix}$, determinant $8>0$ and $f_{xx}>0$: a minimum.",
      "$f\\left(\\frac{3}{2},\\frac{1}{2}\\right)=\\frac{9}{4}+\\frac{3}{2}+\\frac{3}{4}-6-3=-\\frac{9}{2}$."
    ],
    "trap": "Giving the critical point $\\left(\\frac{3}{2},\\frac{1}{2}\\right)$ as the answer: the problem asks for the minimum value, so substitute back.",
    "check": "Complete the square: $f=(x+y-2)^2+2\\left(y-\\frac{1}{2}\\right)^2-\\frac{9}{2}$, which reaches $-\\frac{9}{2}$ when both squares are zero."
  },
  "der-053": {
    "spot": "$e^{xy}$ at the origin: $xy=0$ turns every $e^{xy}$ into $1$, so the second partials reduce to their polynomial factors; $f_{xx}=y^2e^{xy}$ is $0$ at the origin.",
    "why": "Write the general forms, then plug in $(0,0)$; or use $e^{xy}\\approx 1+xy$, whose quadratic part $xy$ lets you read off the Hessian directly.",
    "steps": [
      "$f_x=ye^{xy}$, $f_{xx}=y^2e^{xy}$; $0$ at the origin.",
      "Symmetrically $f_{yy}=x^2e^{xy}$, $0$ at the origin.",
      "$f_{xy}=\\frac{\\partial}{\\partial y}(ye^{xy})=(1+xy)e^{xy}$, $1$ at the origin.",
      "Determinant $0\\cdot 0-1^2=-1$."
    ],
    "trap": "Dropping a Product Rule term in $f_{xy}$ and writing $xye^{xy}$, which is $0$ at the origin and makes the determinant wrongly $0$.",
    "check": "A negative determinant: the origin is a saddle point — $e^{xy}$ goes up along $y=x$ and down along $y=-x$."
  }
};
