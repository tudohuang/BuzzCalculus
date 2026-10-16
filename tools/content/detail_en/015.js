// Detail v2, English — batch 015. Translation of tools/content/detail/015.js (text only; claims live in the Chinese file).
module.exports = {
  "cx-der-003": {
    "spot": "$e^{2x}$ is an exponential with $2x$ inside: the outer $e^u$ differentiates to itself, and the inner $2x$ contributes a $2$ — one step of the Chain Rule.",
    "why": "No need to go back to the definition of the derivative; the Chain Rule for $e^u$ is just \"itself times the inner derivative\".",
    "steps": [
      "Let $u=2x$; $\\frac{d}{dx}e^{u}=e^{u}\\cdot u'=e^{2x}\\cdot 2$.",
      "Plug in $x=0$: $e^0=1$, so $f'(0)=2\\cdot 1$.",
      "$f'(0)=2$."
    ],
    "trap": "Forgetting to multiply by the inner derivative, writing $f'(x)=e^{2x}$ and getting $f'(0)=1$.",
    "check": "Secant slope: $\\frac{e^{0.002}-1}{0.001}\\approx 2.002$, very close to $2$."
  },
  "cx-der-008": {
    "spot": "The derivative of $\\arctan x$ is the one you memorize, $\\frac{1}{1+x^2}$; the problem just asks you to plug in $x=1$.",
    "why": "For inverse trig functions, applying the formula is fastest; to derive it, use implicit differentiation on $\\tan y=x$, which leads back to the same formula.",
    "steps": [
      "$\\frac{d}{dx}\\arctan x=\\frac{1}{1+x^2}$.",
      "Plug in $x=1$: $\\frac{1}{1+1}=\\frac{1}{2}$.",
      "The answer is $\\frac{1}{2}$."
    ],
    "trap": "Mixing it up with the $\\frac{1}{\\sqrt{1-x^2}}$ of $\\arcsin x$; plugging in $x=1$ then makes the denominator $0$ and you conclude the derivative doesn't exist.",
    "check": "Implicit differentiation: for $y=\\arctan x$, $\\sec^2 y\\cdot y'=1$; $x=1$ corresponds to $y=\\frac{\\pi}{4}$ and $\\sec^2\\frac{\\pi}{4}=2$, so $y'=\\frac{1}{2}$."
  },
  "cx-exam-003": {
    "spot": "$x^3$ times $e^{-x}$: a product of two functions, so use the Product Rule; differentiating $e^{-x}$ brings out a minus sign.",
    "why": "After the Product Rule, factor out $e^{-x}$ to get $(3x^2-x^3)e^{-x}$, so you only evaluate once.",
    "steps": [
      "Product Rule: $(x^3)'e^{-x}+x^3(e^{-x})'=3x^2e^{-x}-x^3e^{-x}$.",
      "Factor out $e^{-x}$: $f'(x)=(3x^2-x^3)e^{-x}$.",
      "Plug in $x=1$: $(3-1)e^{-1}=\\frac{2}{e}$.",
      "$f'(1)=\\frac{2}{e}\\approx 0.736$."
    ],
    "trap": "Dropping the minus sign in $(e^{-x})'$ and writing $e^{-x}$, which gives $(3+1)e^{-1}=\\frac{4}{e}$.",
    "check": "$\\frac{2}{e}\\approx 0.736$, and $f(1)=e^{-1}\\approx 0.368$, $f(1.01)\\approx 0.3753$, a secant slope of about $0.73$ — consistent."
  },
  "cx-lh-004": {
    "spot": "$x\\to\\infty$, with a polynomial $x^2$ on top and an exponential $e^x$ below: $\\frac{\\infty}{\\infty}$ form, and exponential growth always beats any polynomial.",
    "why": "Each application of L'Hôpital's Rule lowers the numerator's power by one while the denominator stays $e^x$; two rounds turn the numerator into a constant.",
    "steps": [
      "As $x\\to\\infty$ both numerator and denominator go to infinity: $\\frac{\\infty}{\\infty}$ form.",
      "L'Hôpital once: $\\frac{2x}{e^x}$, still $\\frac{\\infty}{\\infty}$.",
      "Once more: $\\frac{2}{e^x}\\to 0$.",
      "So the original limit is $0$."
    ],
    "trap": "Differentiating only the numerator, or differentiating $\\frac{x^2}{e^x}$ as a quotient — L'Hôpital's Rule differentiates numerator and denominator \"separately\"; it is not the Quotient Rule applied to the whole fraction.",
    "check": "Plug in $x=20$: $\\frac{400}{e^{20}}\\approx 8\\times 10^{-7}$, already extremely close to $0$."
  },
  "cx-lim-005": {
    "spot": "The numerator is $\\sqrt{x+9}-3$, and at $x=0$ it's exactly $3-3=0$: a root-minus-constant $\\frac{0}{0}$ is begging you to multiply by the conjugate $\\sqrt{x+9}+3$.",
    "why": "After rationalizing, the numerator becomes $x$, which cancels the $x$ in the denominator — no need for L'Hôpital's Rule.",
    "steps": [
      "Plug in $x=0$: numerator $\\sqrt 9-3=0$, denominator $0$, so $\\frac{0}{0}$.",
      "Multiply top and bottom by $\\sqrt{x+9}+3$: the numerator becomes $(x+9)-9=x$.",
      "Cancel $x$: $\\frac{\\sqrt{x+9}-3}{x}=\\frac{1}{\\sqrt{x+9}+3}$.",
      "Plug in $x=0$: $\\frac{1}{3+3}=\\frac{1}{6}$."
    ],
    "trap": "Splitting $\\sqrt{x+9}=\\sqrt x+3$, getting $\\frac{\\sqrt x}{x}$ and saying the limit is infinite. Square roots don't split over addition.",
    "check": "This is really the derivative of $\\sqrt{u}$ at $u=9$: $\\frac{1}{2\\sqrt 9}=\\frac{1}{6}$."
  },
  "cx-lim-009": {
    "spot": "The numerator $x^3-1$ is $0$ at $x=1$, so it must have a factor $x-1$ — difference of cubes $x^3-1=(x-1)(x^2+x+1)$.",
    "why": "Factor, cancel $x-1$, then plug in directly — more direct than L'Hôpital's Rule, and it shows this is just the derivative of $x^3$ at $1$.",
    "steps": [
      "Plug in $x=1$: $\\frac{0}{0}$.",
      "Difference of cubes: $x^3-1=(x-1)(x^2+x+1)$.",
      "After cancelling $x-1$, $x^2+x+1$ remains; plugging in $x=1$ gives $3$.",
      "The limit is $3$."
    ],
    "trap": "Misremembering the difference of cubes as $(x-1)(x^2-x+1)$ (that's the factor for a sum of cubes), which gives $1$.",
    "check": "This is the derivative of $x^3$ at $x=1$: $3x^2=3$."
  },
  "cx-lim-010": {
    "spot": "$\\sin\\frac{1}{x}$ oscillates near $0$ and has no limit of its own, but it's trapped between $-1$ and $1$; the $x^2$ in front goes to $0$ — bounded times something going to zero: Squeeze Theorem.",
    "why": "$\\sin\\frac{1}{x}$ has no limit, so you can't split it into a product of two limits; the Squeeze Theorem only needs it to be bounded.",
    "steps": [
      "$|\\sin\\frac{1}{x}|\\le 1$, so $-x^2\\le x^2\\sin\\frac{1}{x}\\le x^2$. For example, at $x=0.1$ the absolute value of the product is at most $0.01$.",
      "Both bounds $\\pm x^2$ go to $0$ as $x\\to 0$.",
      "Squeeze Theorem: the middle term $x^2\\sin\\frac{1}{x}\\to 0$.",
      "The limit is $0$."
    ],
    "trap": "Writing $\\lim x^2\\cdot\\lim\\sin\\frac{1}{x}$, then saying the second doesn't exist so the whole thing doesn't. The product law requires both limits to exist.",
    "check": "Plug in $x=0.01$: $|x^2\\sin\\frac{1}{x}|\\le 0.0001$ — indeed hugging $0$."
  },
  "exam-int-021": {
    "spot": "The denominator $1+x^2$ has derivative $2x$, and the numerator is exactly $x$ — half the denominator's derivative; substituting $u=1+x^2$ gives $\\frac{1}{2}\\int\\frac{du}{u}$.",
    "why": "\"Numerator is the derivative of the denominator (up to a constant)\" means a $\\ln$ form, done in one step; no partial fractions needed.",
    "steps": [
      "Let $u=1+x^2$, $du=2x\\,dx$, so $x\\,dx=\\frac{1}{2}du$.",
      "The antiderivative is $\\frac{1}{2}\\ln(1+x^2)$.",
      "Apply the limits: $\\frac{1}{2}\\ln 2-\\frac{1}{2}\\ln 1=\\frac{\\ln 2}{2}$.",
      "Answer: $\\frac{\\ln 2}{2}\\approx 0.347$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ and getting $\\ln 2$; or reflexively writing $\\arctan$ on seeing $1+x^2$ — that's only right when the numerator is a constant.",
    "check": "On $[0,1]$ the integrand lies between $0$ and $\\frac{1}{2}$, so the integral should be less than $\\frac{1}{2}$; $0.347$ is reasonable."
  },
  "fd-der-008": {
    "spot": "The derivative of $\\cos x$ is $-\\sin x$; the problem just asks you to evaluate at $x=\\frac{\\pi}{2}$.",
    "why": "Apply the basic derivative directly; the key is remembering that differentiating $\\cos$ brings a minus sign.",
    "steps": [
      "$\\frac{d}{dx}\\cos x=-\\sin x$.",
      "Plug in $x=\\frac{\\pi}{2}$: $-\\sin\\frac{\\pi}{2}=-1$.",
      "The answer is $-1$."
    ],
    "trap": "Dropping the minus sign and writing $\\sin\\frac{\\pi}{2}=1$.",
    "check": "At $\\frac{\\pi}{2}$, $\\cos x$ goes from positive to negative — it's falling — so the slope should be negative."
  },
  "fd-der-010": {
    "spot": "Rewrite $\\frac{1}{x}$ as $x^{-1}$ and it's the power rule: bring down the exponent $-1$, then subtract one to get $-2$.",
    "why": "Rewriting as a negative power is faster than the Quotient Rule and less likely to lose a minus sign.",
    "steps": [
      "$\\frac{1}{x}=x^{-1}$, with derivative $-x^{-2}=-\\frac{1}{x^2}$.",
      "Plug in $x=2$: $-\\frac{1}{4}$.",
      "The answer is $-\\frac{1}{4}$."
    ],
    "trap": "Computing the new exponent as $-1-1=0$, or forgetting to bring down the $-1$, giving $\\frac{1}{4}$.",
    "check": "$\\frac{1}{x}$ is decreasing for $x>0$, so the slope must be negative; the secant $\\frac{1/2.01-1/2}{0.01}\\approx -0.249$."
  },
  "fd-int-001": {
    "spot": "$4x^3$ is a single power: run the power rule backwards — add one to the exponent to get $4$, then divide by $4$, which exactly cancels the coefficient $4$.",
    "why": "For polynomial integrals just apply $\\int x^n dx=\\frac{x^{n+1}}{n+1}+C$; no technique needed.",
    "steps": [
      "$\\int x^3dx=\\frac{x^4}{4}+C$.",
      "Multiply by the coefficient $4$: $4\\cdot\\frac{x^4}{4}=x^4$.",
      "Answer: $x^4+C$."
    ],
    "trap": "Confusing integration with differentiation and writing $12x^2$ (that's the derivative of $4x^3$).",
    "check": "Differentiate back: $(x^4)'=4x^3$, the original integrand."
  },
  "fd-int-003": {
    "spot": "Inside $\\sin(3x)$ is $3x$, \"a constant multiple of $x$\": integrate the outside to $-\\cos$ as usual, then divide by the inner coefficient $3$.",
    "why": "When the inside is linear you don't need to write out the full substitution — just divide by the coefficient and check by differentiating back.",
    "steps": [
      "$\\int\\sin u\\,du=-\\cos u$.",
      "Let $u=3x$, $dx=\\frac{du}{3}$, so divide by $3$: $-\\frac{\\cos 3x}{3}$.",
      "Answer: $-\\frac{\\cos 3x}{3}+C$."
    ],
    "trap": "Two common mistakes: writing $\\cos 3x$ (wrong sign for the integral of $\\sin$), or $-3\\cos 3x$ (multiplying by the coefficient instead of dividing).",
    "check": "Differentiate back: $\\left(-\\frac{\\cos 3x}{3}\\right)'=\\frac{3\\sin 3x}{3}=\\sin 3x$."
  },
  "fd-int-004": {
    "spot": "The inside of $e^{2x}$ is $2x$, which is linear: $e^u$ integrates to $e^u$, then divide by the coefficient $2$.",
    "why": "The opposite of \"multiply by the inner derivative\" in differentiation: in integration you \"divide\" by the inner coefficient.",
    "steps": [
      "$\\int e^u du=e^u$; let $u=2x$, $dx=\\frac{du}{2}$.",
      "So $\\int e^{2x}dx=\\frac{e^{2x}}{2}+C$.",
      "Answer: $\\frac{e^{2x}}{2}+C$."
    ],
    "trap": "Writing $2e^{2x}$: carrying the Chain Rule over from differentiation, with the coefficient going the wrong way.",
    "check": "Differentiate back: $\\left(\\frac{e^{2x}}{2}\\right)'=e^{2x}$; at $x=0$ both sides are $1$."
  },
  "fd-int-005": {
    "spot": "The integrand is the polynomial $3x^2+1$ on $[0,1]$: find the antiderivative $x^3+x$ term by term, then apply the limits.",
    "why": "A definite integral of a polynomial is a direct use of the Fundamental Theorem of Calculus; the lower limit $0$ just gives $0$.",
    "steps": [
      "Antiderivative $F(x)=x^3+x$.",
      "$F(1)-F(0)=(1+1)-0=2$.",
      "Answer: $2$."
    ],
    "trap": "Forgetting that the constant $1$ integrates to $x$, computing only the $x^3$ part and getting $1$.",
    "check": "On $[0,1]$ the integrand grows from $1$ to $4$ over an interval of length $1$, so the integral should be between $1$ and $4$; $2$ is reasonable."
  },
  "fd-int-006": {
    "spot": "A single power $x^3$ on $[0,2]$: antiderivative $\\frac{x^4}{4}$, plug in the upper limit $2$.",
    "why": "Power rule plus the Fundamental Theorem — one line.",
    "steps": [
      "Antiderivative $\\frac{x^4}{4}$.",
      "$\\frac{2^4}{4}-0=\\frac{16}{4}=4$.",
      "Answer: $4$."
    ],
    "trap": "Forgetting to divide by $4$ and writing $2^4=16$.",
    "check": "On $[0,2]$, $x^3$ is at most $8$, so the integral can't exceed $8\\times 2=16$; the curve bends up sharply with most of the area crowded at the right, so $4$ is reasonable."
  },
  "fd-int-007": {
    "spot": "The antiderivative of $\\cos x$ is $\\sin x$; the upper limit $\\frac{\\pi}{6}$ is a special angle with $\\sin\\frac{\\pi}{6}=\\frac{1}{2}$.",
    "why": "A basic antiderivative plus a special angle — just plug in.",
    "steps": [
      "Antiderivative $\\sin x$.",
      "$\\sin\\frac{\\pi}{6}-\\sin 0=\\frac{1}{2}-0$.",
      "Answer: $\\frac{1}{2}$."
    ],
    "trap": "Remembering $\\sin\\frac{\\pi}{6}$ as $\\frac{\\sqrt 3}{2}$ (that's $\\cos\\frac{\\pi}{6}$).",
    "check": "On $[0,\\frac{\\pi}{6}]$, $\\cos x$ is between $0.866$ and $1$, and the interval length is about $0.524$, so the integral should be between $0.45$ and $0.53$."
  },
  "fd-int-008": {
    "spot": "The antiderivative of $\\frac{1}{x}$ is $\\ln x$; the limits $4$ and $2$ differ by a factor of two, so the difference of logs becomes $\\ln\\frac{4}{2}$.",
    "why": "$\\ln b-\\ln a=\\ln\\frac{b}{a}$ simplifies it straight to $\\ln 2$.",
    "steps": [
      "Antiderivative $\\ln x$ (the interval is positive, so the absolute value can go).",
      "$\\ln 4-\\ln 2=\\ln\\frac{4}{2}=\\ln 2$.",
      "Answer: $\\ln 2\\approx 0.693$."
    ],
    "trap": "Writing $\\ln 4-\\ln 2$ as $\\ln(4-2)=\\ln 2$ — the answer happens to match, but the reasoning is wrong; on $[2,5]$ you'd wrongly get $\\ln 3$.",
    "check": "$\\int_a^{2a}\\frac{dx}{x}$ is always $\\ln 2$, independent of $a$; e.g. $\\int_1^2\\frac{dx}{x}$ is also $\\ln 2$."
  },
  "fd-int-010": {
    "spot": "$\\frac{1}{1+x^2}$ is the derivative of $\\arctan x$; the $3$ in front is just a constant multiple.",
    "why": "Recognize the $\\arctan$ form and write it down; there's no $x$ in the numerator, so it's not a $\\ln$ form.",
    "steps": [
      "$\\int\\frac{dx}{1+x^2}=\\arctan x+C$.",
      "Pull out the constant $3$: $3\\arctan x+C$.",
      "Answer: $3\\arctan x+C$."
    ],
    "trap": "Seeing the denominator and writing $3\\ln(1+x^2)$: that needs a numerator of $2x$; differentiating back gives an extra $\\frac{6x}{1+x^2}$.",
    "check": "Differentiate back at $x=1$: $\\frac{3}{2}$."
  },
  "fd-int-015": {
    "spot": "The inside of $\\cos(2x)$ is $2x$: integrate the outside to $\\sin$, then divide by the coefficient $2$.",
    "why": "With a linear inside, just divide by the coefficient; no need to write out the full substitution.",
    "steps": [
      "$\\int\\cos u\\,du=\\sin u$; let $u=2x$, $dx=\\frac{du}{2}$.",
      "So $\\int\\cos 2x\\,dx=\\frac{\\sin 2x}{2}+C$.",
      "Answer: $\\frac{\\sin 2x}{2}+C$."
    ],
    "trap": "Writing $2\\sin 2x$ (multiplying by the coefficient instead of dividing), or $-\\sin 2x$ (thinking the integral of $\\cos$ has a minus sign).",
    "check": "Differentiate back at $x=0$: $\\cos 0=1$."
  },
  "fd-int-017": {
    "spot": "Rewrite $\\frac{1}{x^2}$ as $x^{-2}$ and it's the power rule: add one to the exponent to get $-1$, then divide by $-1$.",
    "why": "$n=-2\\ne -1$, so the power rule applies; only $\\frac{1}{x}$ is the $\\ln$ exception.",
    "steps": [
      "$\\int x^{-2}dx=\\frac{x^{-1}}{-1}+C$.",
      "Simplify: $-\\frac{1}{x}+C$.",
      "Answer: $-\\frac{1}{x}+C$."
    ],
    "trap": "Writing $\\ln(x^2)$ or $-\\frac{1}{3x^3}$: the first misapplies the $\\frac{1}{x}$ special case, the second lowers the exponent instead of raising it.",
    "check": "Differentiate back at $x=2$: $\\frac{1}{4}$."
  },
  "fd-ser-001": {
    "spot": "$\\left(\\frac{1}{4}\\right)^n$ starting at $n=0$: a geometric series with ratio $r=\\frac{1}{4}$ and first term $1$; $|r|<1$, so it converges.",
    "why": "For a geometric series use $\\frac{\\text{first term}}{1-r}$ directly; no need to take the limit of partial sums.",
    "steps": [
      "The $n=0$ first term is $\\left(\\frac{1}{4}\\right)^0=1$, ratio $\\frac{1}{4}$.",
      "Sum $=\\frac{1}{1-\\frac{1}{4}}=\\frac{1}{\\frac{3}{4}}=\\frac{4}{3}$.",
      "Answer: $\\frac{4}{3}$."
    ],
    "trap": "Taking the first term to be $\\frac{1}{4}$ and computing $\\frac{1/4}{3/4}=\\frac{1}{3}$ — that's the sum starting from $n=1$.",
    "check": "The first three terms $1+0.25+0.0625=1.3125$ are already close to $1.333$."
  },
  "fd-ser-003": {
    "spot": "$\\left(\\frac{1}{2}\\right)^n$ starting at $n=1$: the first term is $\\frac{1}{2}$, not $1$, and the ratio is $\\frac{1}{2}$.",
    "why": "The geometric series formula is \"first term divided by $1-r$\"; the key is reading off the first term correctly.",
    "steps": [
      "First term $\\left(\\frac{1}{2}\\right)^1=\\frac{1}{2}$, ratio $\\frac{1}{2}$.",
      "Sum $=\\frac{1/2}{1-1/2}=1$.",
      "Answer: $1$."
    ],
    "trap": "Plugging straight into $\\frac{1}{1-r}=2$, forgetting that this series is missing the $n=0$ term $1$.",
    "check": "$\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\cdots$ is cutting a segment of length $1$ in half again and again: the first four terms give $0.9375$."
  },
  "fd-ser-004": {
    "spot": "$\\left(\\frac{2}{3}\\right)^n$ from $n=0$: first term $1$, ratio $\\frac{2}{3}$; $|r|<1$, so it converges.",
    "why": "Geometric series formula $\\frac{1}{1-r}$; the closer the ratio is to $1$, the larger the sum.",
    "steps": [
      "First term $1$, ratio $\\frac{2}{3}$.",
      "Sum $=\\frac{1}{1-\\frac{2}{3}}=\\frac{1}{\\frac{1}{3}}=3$.",
      "Answer: $3$."
    ],
    "trap": "Writing $\\frac{1}{1-r}$ as $\\frac{1}{1+r}$ and getting $\\frac{3}{5}$, or as $\\frac{r}{1-r}=2$ (that's the sum from $n=1$).",
    "check": "The first five terms $1+0.667+0.444+0.296+0.198\\approx 2.6$, still climbing toward $3$ (a large ratio converges slowly)."
  },
  "fd-ser-017": {
    "spot": "$\\left(\\frac{1}{3}\\right)^n$ starting at $n=2$: the first term is $\\frac{1}{9}$, ratio $\\frac{1}{3}$.",
    "why": "Wherever a geometric series starts, it's \"first term divided by $1-r$\"; get the first term right first.",
    "steps": [
      "First term $\\left(\\frac{1}{3}\\right)^2=\\frac{1}{9}$.",
      "Sum $=\\frac{1/9}{1-1/3}=\\frac{1/9}{2/3}=\\frac{1}{6}$.",
      "Answer: $\\frac{1}{6}$."
    ],
    "trap": "Plugging straight into $\\frac{1}{1-r}=\\frac{3}{2}$ without subtracting the $n=0,1$ terms $1+\\frac{1}{3}$.",
    "check": "Subtract from the full sum: $\\frac{3}{2}-1-\\frac{1}{3}=\\frac{1}{6}$ — both methods agree."
  },
  "rel-basic-008": {
    "spot": "The derivative of $\\sin x$ is $\\cos x$; evaluate at $x=0$.",
    "why": "Apply the basic derivative directly.",
    "steps": [
      "$\\frac{d}{dx}\\sin x=\\cos x$.",
      "Plug in $x=0$: $\\cos 0=1$.",
      "Answer: $1$."
    ],
    "trap": "Confusing the derivative with the function value and writing $\\sin 0=0$.",
    "check": "This is exactly $\\lim_{x\\to 0}\\frac{\\sin x}{x}=1$: the tangent line to $\\sin x$ at the origin is $y=x$."
  },
  "rel-basic-010": {
    "spot": "$\\sqrt x=x^{1/2}$: the power rule gives $\\frac{1}{2}x^{-1/2}=\\frac{1}{2\\sqrt x}$; $x=4$ is a perfect square, $\\sqrt 4=2$.",
    "why": "Rewriting with a fractional exponent and applying the power rule is much faster than the limit definition plus rationalizing.",
    "steps": [
      "$(\\sqrt x)'=\\frac{1}{2\\sqrt x}$.",
      "Plug in $x=4$: $\\frac{1}{2\\cdot 2}=\\frac{1}{4}$.",
      "Answer: $\\frac{1}{4}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ and writing $\\frac{1}{\\sqrt 4}=\\frac{1}{2}$.",
    "check": "$\\sqrt{4.01}\\approx 2.0025$, which exceeds $2$ by $0.0025=\\frac{1}{4}\\times 0.01$ — the slope really is $\\frac{1}{4}$."
  },
  "rel-basic-011": {
    "spot": "The derivative of $\\ln x$ is $\\frac{1}{x}$; at $x=e$ that's $\\frac{1}{e}$ — no logarithms to compute.",
    "why": "Apply the basic derivative directly.",
    "steps": [
      "$(\\ln x)'=\\frac{1}{x}$.",
      "Plug in $x=e$: $\\frac{1}{e}\\approx 0.368$.",
      "Answer: $\\frac{1}{e}$."
    ],
    "trap": "Computing $\\ln e=1$ first and then differentiating the constant to get $0$: differentiate first, then plug in.",
    "check": "The tangent line to $\\ln x$ at $x=e$, $y=1+\\frac{x-e}{e}=\\frac{x}{e}$, passes right through the origin."
  },
  "tb-tan-006": {
    "spot": "Asking for the tangent slope means asking for the derivative value: evaluate the derivative $\\frac{1}{2\\sqrt x}$ of $y=\\sqrt x$ at $x=4$.",
    "why": "Tangent slope $=f'(a)$; the power rule is enough, no need to write the tangent line equation.",
    "steps": [
      "$y'=\\frac{1}{2\\sqrt x}$.",
      "$x=4$: $\\frac{1}{2\\cdot 2}=\\frac{1}{4}$.",
      "Slope $\\frac{1}{4}$."
    ],
    "trap": "Taking the $y$-value of the point of tangency, $\\sqrt 4=2$, as the slope.",
    "check": "The tangent line $y=2+\\frac{1}{4}(x-4)$ gives $2.01$ at $x=4.04$, almost identical to $\\sqrt{4.04}\\approx 2.00998$."
  },
  "ch-trap-002": {
    "spot": "$\\ln$ wrapped around $e^{\\cdots}$: the two are inverse functions, $\\ln(e^{u})=u$ — simplify first, then differentiate; the whole thing is just $x^2+3x$.",
    "why": "One simplification turns it into a polynomial; forcing the Chain Rule gives $\\frac{1}{e^{u}}\\cdot e^{u}\\cdot u'$, which cancels to the same thing anyway.",
    "steps": [
      "$\\ln\\left(e^{x^2+3x}\\right)=x^2+3x$.",
      "Differentiate: $(x^2+3x)'=2x+3$.",
      "Answer: $2x+3$."
    ],
    "trap": "Forcing the Chain Rule, multiplying only by the outer $\\frac{1}{e^{x^2+3x}}$ and forgetting the derivative of $e^{u}$ itself, getting $\\frac{2x+3}{e^{x^2+3x}}$.",
    "check": "At $x=1$: $2\\cdot 1+3=5$."
  },
  "cx-arc-002": {
    "spot": "$y=\\frac{x^3}{6}+\\frac{1}{2x}$ is a textbook-designed arc length problem: $y'=\\frac{x^2}{2}-\\frac{1}{2x^2}$, and the product of the two terms is the constant $\\frac{1}{4}$, so $1+y'^2$ forms a perfect square.",
    "why": "The root in the arc length formula usually can't be integrated; this \"square of a difference plus one is the square of a sum\" design is there to make the root vanish.",
    "steps": [
      "$y'=\\frac{x^2}{2}-\\frac{1}{2x^2}$.",
      "$1+y'^2=1+\\frac{x^4}{4}-\\frac{1}{2}+\\frac{1}{4x^4}=\\left(\\frac{x^2}{2}+\\frac{1}{2x^2}\\right)^2$.",
      "Remove the root: $L=\\int_1^2\\left(\\frac{x^2}{2}+\\frac{1}{2x^2}\\right)dx$, with antiderivative $\\frac{x^3}{6}-\\frac{1}{2x}$.",
      "Apply the limits: $\\left(\\frac{8}{6}-\\frac{1}{4}\\right)-\\left(\\frac{1}{6}-\\frac{1}{2}\\right)=\\frac{13}{12}+\\frac{1}{3}=\\frac{17}{12}$.",
      "Arc length $\\frac{17}{12}$."
    ],
    "trap": "Completing the square with the wrong sign: writing $\\left(\\frac{x^2}{2}-\\frac{1}{2x^2}\\right)^2$, which throws away the $1$; the result is $\\int y'\\,dx=y(2)-y(1)=\\frac{11}{12}$.",
    "check": "Arc length is at least the straight-line distance between the endpoints: $y(1)=\\frac{2}{3}$, $y(2)=\\frac{19}{12}$, a straight-line distance of about $1.36$, slightly less than $\\frac{17}{12}\\approx 1.417$."
  },
  "cx-avg-003": {
    "spot": "Asking for an \"average value\": that's $\\frac{1}{b-a}\\int_a^b f$. The interval $[1,e]$ is paired with $\\frac{1}{x}$, so the integral is exactly $\\ln e-\\ln 1=1$.",
    "why": "Apply the average value formula directly; the upper limit $e$ makes the integral an integer, so the only catch is remembering to divide by the interval length $e-1$.",
    "steps": [
      "$\\int_1^e\\frac{dx}{x}=\\ln e-\\ln 1=1$.",
      "Interval length $e-1\\approx 1.718$.",
      "Average value $=\\frac{1}{e-1}\\approx 0.582$."
    ],
    "trap": "Computing only the integral, $1$, and forgetting to divide by the interval length; or dividing by $e$ instead of $e-1$.",
    "check": "On $[1,e]$, $\\frac{1}{x}$ falls from $1$ to $\\frac{1}{e}\\approx 0.368$, and the average $0.582$ sits in between."
  },
  "cx-curve-001": {
    "spot": "A cubic has exactly one inflection point, where $f''=0$; $f''$ is linear, so solve one linear equation.",
    "why": "Inflection point = where concavity changes; for a cubic, $f''$ is linear and always changes sign at its zero, so no extra check is needed.",
    "steps": [
      "$f'=3x^2-6x$, $f''=6x-6$.",
      "$f''=0$: $x=1$.",
      "Sign change: $f''(0.9)<0$, $f''(1.1)>0$, so the concavity really changes.",
      "Inflection point at $x=1$."
    ],
    "trap": "Solving $f'=0$ to get $x=0,2$ and treating the extrema as inflection points.",
    "check": "A cubic's inflection point is exactly midway between its two critical points: $\\frac{0+2}{2}=1$."
  },
  "cx-curve-002": {
    "spot": "Asking \"how many\": $f''=12x^2-12$ is quadratic with two zeros $x=\\pm 1$, both simple roots — and a simple root always changes sign.",
    "why": "A zero of $f''$ isn't necessarily an inflection point (a double root doesn't change sign), so confirm that $f''$ has opposite signs on either side of each zero.",
    "steps": [
      "$f''=12x^2-12=12(x-1)(x+1)$.",
      "Zeros at $x=\\pm 1$.",
      "Around $x=-1$: $f''(-1.1)>0$, $f''(-0.9)<0$ — sign change.",
      "Around $x=1$: $f''(0.9)<0$, $f''(1.1)>0$ — sign change.",
      "Both are inflection points, $2$ in total."
    ],
    "trap": "Solving $f'=4x^3-12x=0$ to get three points $0,\\pm\\sqrt 3$ and answering $3$ — that's the number of critical points.",
    "check": "The graph of an even function is symmetric, so inflection points come in pairs; $\\pm 1$ is exactly one pair."
  },
  "cx-curve-008": {
    "spot": "Another cubic: $f''$ is linear, with a unique zero that always changes sign. The constant $5$ vanishes after two derivatives and doesn't affect the inflection point.",
    "why": "For a cubic the inflection point depends only on $f''=0$; the inflection point of $x^3+bx^2$ is at $x=-\\frac{b}{3}$.",
    "steps": [
      "$f'=3x^2-12x$, $f''=6x-12$.",
      "$f''=0$: $x=2$.",
      "Sign change: $f''(1.9)<0$, $f''(2.1)>0$.",
      "Inflection point at $x=2$."
    ],
    "trap": "Solving $f'=0$ to get $x=0$ or $4$ and treating the extrema as inflection points.",
    "check": "The midpoint of the critical points $0$ and $4$ is exactly $2$, matching the cubic rule \"inflection point midway between the critical points\"."
  },
  "cx-int-006": {
    "spot": "$\\frac{1}{x}$ integrated from $1$ to $e$: antiderivative $\\ln x$, with $\\ln e=1$ and $\\ln 1=0$ — this is in fact one way to define $e$.",
    "why": "A basic antiderivative — just plug in.",
    "steps": [
      "Antiderivative $\\ln x$.",
      "$\\ln e-\\ln 1=1-0$.",
      "Answer: $1$."
    ],
    "trap": "Applying the power rule to $\\frac{1}{x}$ and writing $\\frac{x^0}{0}$ — $n=-1$ is exactly the exception to the power rule.",
    "check": "On $[1,e]$, $\\frac{1}{x}$ lies between $0.37$ and $1$ over an interval of length about $1.72$, so the integral falls between $0.63$ and $1.72$."
  },
  "cx-lh-010": {
    "spot": "Plug in $x=0$: numerator $e^0-e^0=0$, denominator $\\sin 0=0$, so $\\frac{0}{0}$; both top and bottom are easy to differentiate, so one round of L'Hôpital's Rule lets you plug in.",
    "why": "After one round of L'Hôpital's Rule the denominator is $\\cos x$ and the numerator is $e^x+e^{-x}$, neither zero at $0$. A Taylor expansion also works: numerator $\\approx 2x$, denominator $\\approx x$.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "Numerator derivative $e^x+e^{-x}$, denominator derivative $\\cos x$.",
      "Plug in $x=0$: $\\frac{1+1}{1}=2$.",
      "The limit is $2$."
    ],
    "trap": "Dropping the minus sign in the derivative of $e^{-x}$, writing the numerator's derivative as $e^x-e^{-x}$ and getting $0$.",
    "check": "Plug in $x=0.01$: the ratio is about $2.0001$, hugging $2$."
  },
  "cx-mvt-003": {
    "spot": "Finding $c$ for the Mean Value Theorem: first compute the secant slope between the endpoints, then set $f'(c)$ equal to it. $\\sqrt x$ is an integer at both $1$ and $4$, so the secant slope is easy.",
    "why": "$f'(c)=\\frac{f(b)-f(a)}{b-a}$ is a single equation, and solving $\\frac{1}{2\\sqrt c}$ only takes one squaring.",
    "steps": [
      "Secant slope $\\frac{\\sqrt 4-\\sqrt 1}{4-1}=\\frac{1}{3}$.",
      "$f'(c)=\\frac{1}{2\\sqrt c}=\\frac{1}{3}$, so $\\sqrt c=\\frac{3}{2}$.",
      "$c=\\frac{9}{4}=2.25$, which does lie in $(1,4)$.",
      "Answer: $c=\\frac{9}{4}$."
    ],
    "trap": "Solving $\\frac{1}{2\\sqrt c}=\\frac{1}{3}$, stopping at $\\sqrt c=\\frac{3}{2}$ and giving $\\frac{3}{2}$ as the answer; you still need to square.",
    "check": "$c=2.25$ is less than the midpoint $2.5$: $\\sqrt x$ flattens out to the right, so the point where the slope equals the average slope sits to the left."
  },
  "cx-mvt-005": {
    "spot": "$\\ln x$ on $[1,e]$: the endpoint values are $0$ and $1$, so the secant slope is $\\frac{1}{e-1}$; and $f'(c)=\\frac{1}{c}$ — just flip the reciprocal.",
    "why": "The Mean Value Theorem equation $\\frac{1}{c}=\\frac{1}{e-1}$ is solved by taking reciprocals — one step.",
    "steps": [
      "Secant slope $\\frac{\\ln e-\\ln 1}{e-1}=\\frac{1}{e-1}$.",
      "$f'(c)=\\frac{1}{c}=\\frac{1}{e-1}$, so $c=e-1\\approx 1.718$, which is in $(1,e)$.",
      "Answer: $c=e-1$."
    ],
    "trap": "Thinking the secant slope is $\\frac{1}{e}$ (forgetting to subtract the lower limit $1$), which gives $c=e$, an endpoint.",
    "check": "$c\\approx 1.718$ is less than the midpoint $\\frac{1+e}{2}\\approx 1.859$ — $\\ln x$ is concave down and flattens out to the right."
  },
  "cx-ode-005": {
    "spot": "$y'+y=1$ is first-order linear with constant coefficients: the constant solution $y=1$ is a particular solution, the homogeneous part is $Ce^{-x}$, and $y(0)=0$ fixes $C$.",
    "why": "You could also separate variables, $\\frac{dy}{1-y}=dx$; both routes are short, and the integrating factor $e^x$ is the most mechanical.",
    "steps": [
      "Multiply by the integrating factor $e^x$: $(e^xy)'=e^x$.",
      "Integrate: $e^xy=e^x+C$, i.e. $y=1+Ce^{-x}$.",
      "$y(0)=0$: $1+C=0$, $C=-1$.",
      "Check in the equation: $y'+y=e^{-x}+1-e^{-x}=1$.",
      "Answer: $y=1-e^{-x}$."
    ],
    "trap": "Writing only the homogeneous solution $y=Ce^{-x}$; then $y(0)=0$ gives $C=0$ and $y\\equiv 0$ — but plugging $0$ back in gives $y'+y=0\\ne 1$.",
    "check": "As $x\\to\\infty$, $y\\to 1$, exactly the equilibrium solution of the equation ($y=1$ when $y'=0$)."
  },
  "cx-rev-001": {
    "spot": "Rotating about the $x$-axis, the curve itself is the radius: disk method $\\pi\\int y^2dx$; and $y=\\sqrt x$ squared is $x$, so the root disappears on its own.",
    "why": "The $y^2$ in the disk method squares away the root — more direct than the shell method (which needs $x=y^2$).",
    "steps": [
      "Each cross-section is a disk of radius $\\sqrt x$ with area $\\pi(\\sqrt x)^2=\\pi x$.",
      "$V=\\pi\\int_0^4x\\,dx=\\pi\\cdot\\frac{16}{2}=8\\pi$.",
      "Answer: $8\\pi$."
    ],
    "trap": "Forgetting to square and computing $\\pi\\int_0^4\\sqrt x\\,dx=\\frac{16\\pi}{3}$.",
    "check": "The enclosing cylinder (radius $2$, length $4$) has volume $16\\pi$, and this solid of revolution is exactly half of it."
  },
  "cx-rev-006": {
    "spot": "$y=\\sqrt{4-x^2}$ is the upper half of a circle of radius $2$; rotated about the $x$-axis it's a sphere, and the disk method's $y^2=4-x^2$ removes the root again.",
    "why": "One disk-method computation, which conveniently verifies the sphere volume formula $\\frac{4}{3}\\pi r^3$.",
    "steps": [
      "Cross-section radius $y$, area $\\pi y^2=\\pi(4-x^2)$.",
      "$\\int_{-2}^2(4-x^2)dx=\\left[4x-\\frac{x^3}{3}\\right]_{-2}^{2}=2\\left(8-\\frac{8}{3}\\right)=\\frac{32}{3}$.",
      "$V=\\frac{32\\pi}{3}$."
    ],
    "trap": "Integrating only over $[0,2]$ and getting $\\frac{16\\pi}{3}$ — that's only half the sphere.",
    "check": "The sphere volume formula gives $\\frac{4}{3}\\pi\\cdot 2^3=\\frac{32\\pi}{3}$, consistent."
  },
  "cx-seq-006": {
    "spot": "$\\sin n$ jumps around inside $[-1,1]$ with no limit, but the denominator $n$ keeps growing: bounded over something going to infinity — Squeeze Theorem.",
    "why": "$\\sin n$ doesn't converge on its own, so you can't split into two limits; the Squeeze Theorem only needs it to be bounded.",
    "steps": [
      "$|\\sin n|\\le 1$, so $\\left|\\frac{\\sin n}{n}\\right|\\le\\frac{1}{n}$.",
      "$\\frac{1}{n}\\to 0$.",
      "Squeeze: $-\\frac{1}{n}\\le a_n\\le\\frac{1}{n}$, and both sides go to $0$. For example, at $n=10000$, $|a_n|<0.0001$.",
      "The limit is $0$."
    ],
    "trap": "Confusing $\\frac{\\sin n}{n}$ with $\\frac{\\sin x}{x}\\to 1$ (as $x\\to 0$) and answering $1$. Here $n\\to\\infty$, not going to $0$.",
    "check": "Plug in $n=1000$: $|\\sin 1000|/1000\\le 0.001$."
  },
  "cx-smid-013": {
    "spot": "$\\frac{1}{n\\ln n}$: the $\\ln n$ in the denominator makes it just a bit smaller than $\\frac{1}{n}$, so comparison can't decide it; but $\\frac{1}{x\\ln x}$ has a ready antiderivative $\\ln(\\ln x)$ — use the Integral Test.",
    "why": "Compared with $\\frac{1}{n}$ it's \"smaller\", which proves nothing about divergence; compared with $\\frac{1}{n^p}$ it can't be pinned either. The Integral Test settles it in one line.",
    "steps": [
      "$f(x)=\\frac{1}{x\\ln x}$ is positive and decreasing for $x\\ge 2$.",
      "Substitute $u=\\ln x$: $\\int\\frac{dx}{x\\ln x}=\\ln(\\ln x)+C$.",
      "$\\int_2^N\\frac{dx}{x\\ln x}=\\ln\\ln N-\\ln\\ln 2$, which grows without bound in $N$ (already over $3$ at $N=10^7$).",
      "The improper integral diverges, so the series diverges."
    ],
    "trap": "Seeing $\\frac{1}{n\\ln n}<\\frac{1}{n}$ and saying \"smaller than the harmonic series, so it converges\" — being smaller than a divergent series proves nothing.",
    "check": "It diverges extremely slowly: $\\ln\\ln N$ only reaches about $5.4$ at $N\\approx 10^{100}$, so looking at partial sums numerically could fool you into thinking it converges."
  },
  "db-lin-001": {
    "spot": "$26$ sits right next to the perfect square $25$: linearize $\\sqrt x$ at $a=25$, where $\\sqrt{25}=5$ and the slope $\\frac{1}{2\\cdot 5}=\\frac{1}{10}$ are both clean numbers.",
    "why": "Linear approximation needs a point near $26$ where both the function value and the derivative are easy; $25$ is the only choice.",
    "steps": [
      "$f(x)=\\sqrt x$, $f(25)=5$.",
      "$f'(x)=\\frac{1}{2\\sqrt x}$, $f'(25)=\\frac{1}{10}$.",
      "$L(26)=5+\\frac{1}{10}(26-25)=5.1$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ in the slope, using $\\frac{1}{5}$ and getting $5.2$.",
    "check": "The true value $\\sqrt{26}\\approx 5.099$ is slightly less than $5.1$ — $\\sqrt x$ is concave down, so the tangent line lies above the curve."
  },
  "db-opt-001": {
    "spot": "Fixed perimeter $40$: the two sides sum to $x+y=20$, and the area $x(20-x)$ is a downward-opening parabola whose vertex is the maximum.",
    "why": "Reduce to a quadratic in one variable and set the derivative to $0$; or just remember \"for a fixed perimeter, the square has the largest area\".",
    "steps": [
      "Let the length be $x$ and the width $20-x$; area $A(x)=x(20-x)$.",
      "$A'(x)=20-2x=0$, $x=10$.",
      "$A''=-2<0$, so it's a maximum; length and width are both $10$ — a square.",
      "Maximum area $10\\times 10=100$."
    ],
    "trap": "Using the perimeter $40$ directly as $x+y=40$, getting $x=20$ and area $400$. The perimeter is twice length plus width.",
    "check": "Try other pairs: $9\\times 11=99$, $8\\times 12=96$, both less than $100$."
  },
  "dd-lin-003": {
    "spot": "$1.05$ sits right next to $1$, where $\\ln 1=0$ and $(\\ln x)'|_{x=1}=1$: the tangent line at $a=1$ is just $y=x-1$.",
    "why": "Expanding at $a=1$ makes both the value and the slope as simple as possible; the linear approximation is just $\\ln(1+h)\\approx h$.",
    "steps": [
      "$\\ln 1=0$.",
      "$(\\ln x)'=\\frac{1}{x}$, which is $1$ at $1$.",
      "$L(1.05)=0+1\\cdot 0.05=0.05$."
    ],
    "trap": "Using $\\ln 1.05\\approx\\ln 1\\cdot 1.05=0$, or taking the slope to be some constant like $e$.",
    "check": "The true value $\\ln 1.05\\approx 0.04879$ is slightly less than $0.05$ — $\\ln x$ is concave down, so the tangent line lies above."
  },
  "fd-serx-205": {
    "spot": "$\\frac{1}{n^{3/2}}$ is a $p$-series with $p=\\frac{3}{2}$; all you check is whether $p$ exceeds $1$.",
    "why": "The $p$-series criterion is something you just remember: converges for $p>1$, diverges for $p\\le 1$ — no need to redo the Integral Test.",
    "steps": [
      "$p=\\frac{3}{2}>1$.",
      "The reason behind it, via the Integral Test: $\\int_1^\\infty x^{-3/2}dx=2$ is finite.",
      "So the series converges (sum about $2.612$).",
      "Answer: converges."
    ],
    "trap": "Thinking of $n^{3/2}$ as some variant of $\\sqrt n$ and calling it divergent; what matters is the power of the whole denominator, $\\frac{3}{2}$, which exceeds $1$.",
    "check": "Comparison: $\\frac{1}{n^{3/2}}\\le\\frac{1}{n}$ proves nothing about convergence, but like the $p=2$ series $\\sum\\frac{1}{n^2}=\\frac{\\pi^2}{6}$ it's on the \"$p>1$\" side."
  },
  "fd-serx-206": {
    "spot": "General term $\\frac{n^2}{n^2+1}$: numerator and denominator have the same degree, so it tends to $1$, not $0$ — reach for the $n$th-term test first.",
    "why": "A series whose general term doesn't go to $0$ always diverges; this is faster than any comparison test and should be the first thing you check on any series.",
    "steps": [
      "$\\frac{n^2}{n^2+1}=\\frac{1}{1+1/n^2}$.",
      "As $n\\to\\infty$ it tends to $1$.",
      "The general term doesn't tend to $0$, so by the $n$th-term test the series diverges (every term is at least $\\frac{1}{2}$, so the first $N$ terms sum to at least $\\frac{N}{2}$).",
      "Answer: diverges."
    ],
    "trap": "Seeing the denominator is \"a bit bigger\" than the numerator, thinking the terms are small and the series converges. Check the limit of the general term first.",
    "check": "The $10$th term is already $\\frac{100}{101}\\approx 0.99$; nearly every term adds $1$, so the partial sums grow linearly with $n$."
  },
  "fd-serx-208": {
    "spot": "$(-1)^{n+1}$ with $\\frac{1}{\\sqrt n}$ decreasing to $0$: the alternating series converges; but without the signs it's a $p$-series with $p=\\frac{1}{2}$, which diverges — judge the two separately.",
    "why": "The Alternating Series Test only tells you whether it converges; the $p$-series tells you whether it converges absolutely. You need both to say conditionally convergent.",
    "steps": [
      "$b_n=\\frac{1}{\\sqrt n}$ is decreasing and tends to $0$.",
      "Alternating Series Test: the original series converges (sum about $0.605$).",
      "Take absolute values: $\\sum\\frac{1}{\\sqrt n}$ has $p=\\frac{1}{2}\\le 1$ and diverges; $\\int_1^N\\frac{dx}{\\sqrt x}=2\\sqrt N-2$ is unbounded (already $198$ at $N=10000$).",
      "Convergent but not absolutely convergent: the answer is conditionally convergent."
    ],
    "trap": "Seeing only that the alternating series converges and answering \"absolutely convergent\"; or seeing only that $\\sum\\frac{1}{\\sqrt n}$ diverges and answering \"divergent\". Check both.",
    "check": "Contrast: for $\\frac{(-1)^{n+1}}{n^2}$, the absolute values form a convergent $p=2$ series, so it's absolutely convergent; the whole difference is whether $p$ exceeds $1$."
  },
  "mob-conv-003": {
    "spot": "$\\frac{(-1)^n}{n}$ is the alternating harmonic series: without the signs it's the harmonic series (divergent); with the signs, the alternating cancellation makes it converge.",
    "why": "The question asks for the \"type\" of convergence, so run two tests: the Alternating Series Test on the series itself, and the harmonic series for the absolute values.",
    "steps": [
      "$b_n=\\frac{1}{n}$ decreases to $0$; Alternating Series Test: converges.",
      "In fact the sum is $-\\ln 2\\approx -0.693$.",
      "The absolute values form the harmonic series $\\sum\\frac{1}{n}$, which diverges: $\\int_1^N\\frac{dx}{x}=\\ln N$ is unbounded.",
      "The series converges but its absolute values diverge: conditionally convergent."
    ],
    "trap": "Thinking \"terms go to $0$, so it converges\" applies to the absolute values too, and answering absolutely convergent. The harmonic series is the counterexample: terms go to $0$ yet it diverges.",
    "check": "The first four terms $-1+\\frac{1}{2}-\\frac{1}{3}+\\frac{1}{4}\\approx -0.583$; the partial sums swing back and forth around $-\\ln 2$ with shrinking amplitude."
  },
  "mob-tech-003": {
    "spot": "The inside of $e^{x^2}$ is $x^2$, and the $x$ in front is exactly half of $x^2$'s derivative $2x$: \"the inner derivative is right there beside it\" = substitution.",
    "why": "Integration by parts only gets messier ($e^{x^2}$ itself has no elementary antiderivative); after substituting $u=x^2$ only $\\frac{1}{2}\\int e^u du$ remains.",
    "steps": [
      "Let $u=x^2$, $du=2x\\,dx$, so $x\\,dx=\\frac{du}{2}$.",
      "$\\int xe^{x^2}dx=\\frac{1}{2}\\int e^udu=\\frac{1}{2}e^{u}+C$.",
      "Back to $x$: $\\frac{1}{2}e^{x^2}+C$, which differentiates back correctly.",
      "So the technique to use is substitution ($u$-substitution, $u=x^2$)."
    ],
    "trap": "Seeing a product of two functions and reflexively using integration by parts: with $u=x$, $dv=e^{x^2}dx$, you can't even find $v$.",
    "check": "Think in reverse: $\\frac{d}{dx}e^{x^2}=2xe^{x^2}$ (Chain Rule); substitution is just the Chain Rule run backwards."
  },
  "mob-trap-007": {
    "spot": "A partial derivative with respect to $x$, yet the expression only has $y$: in a partial derivative all other variables are constants, and $y^2$ is just a constant as far as $x$ is concerned.",
    "why": "A partial derivative means \"hold the other variables fixed and move only one\"; writing $2y$ out of habit means you differentiated with respect to $y$.",
    "steps": [
      "When differentiating with respect to $x$, $y$ is a constant, so $y^2$ is a constant too.",
      "The derivative of a constant is $0$: $\\frac{\\partial}{\\partial x}y^2=0$. Compare: when $y^2$ multiplies $x^2$, it's just a coefficient carried along.",
      "Writing $2y$ is the result of differentiating with respect to $y$, not $x$.",
      "The trap: treat $y$ as a constant; the answer is $0$, not $2y$."
    ],
    "trap": "Treating $y$ as a function of $x$, or differentiating with respect to $y$ outright, and getting $2y$.",
    "check": "Fix $y=3$: $y^2=9$ doesn't change however $x$ moves, so the slope is $0$."
  },
  "ode-sep-001": {
    "spot": "$y'=y$: the only functions equal to their own derivative are $Ce^x$ — separable, $\\frac{dy}{y}=dx$.",
    "why": "Separate and integrate each side once; or simply recognize $e^x$ as the only family \"unchanged by differentiation\".",
    "steps": [
      "Separate: $\\frac{dy}{y}=dx$; integrate: $\\ln|y|=x+C$.",
      "$y=Ae^x$; plug back in to confirm $y'=y$.",
      "$y(0)=1$: $A=1$.",
      "Answer: $y=e^x$."
    ],
    "trap": "Writing $y=e^x+C$ after integrating; $y(0)=1$ gives $C=0$, which happens to be right, but in this form $y'=e^x\\ne e^x+C$ — the constant must multiply.",
    "check": "$y(1)=e\\approx 2.718$, the same as the limit of $(1+\\frac{1}{n})^n$ — compound interest where \"the growth rate equals itself\"."
  },
  "ode-val-005": {
    "spot": "$y'=\\frac{y}{x}$: the right side is a function of $y$ times a function of $x$, so it's separable; $\\frac{dy}{y}=\\frac{dx}{x}$ integrates to $\\ln$ on both sides.",
    "why": "Both sides are $\\ln$, so exponentiating gives $y=Cx$: every solution is a line through the origin.",
    "steps": [
      "Separate: $\\frac{dy}{y}=\\frac{dx}{x}$; integrate: $\\ln|y|=\\ln|x|+C$, i.e. $y=Ax$.",
      "$y(1)=1$: $A=1$, $y=x$.",
      "Plug back in to confirm: $y'=1=\\frac{x}{x}$.",
      "$y(3)=3$."
    ],
    "trap": "Writing $\\ln y=\\ln x+C$ after integrating and then $y=x+C$: turning the constant inside the log into an added constant gives the wrong general solution ($y=x+C$ plugged back in gives $1\\ne\\frac{x+C}{x}$).",
    "check": "$y'=\\frac{y}{x}$ says \"the slope equals the slope of the line from the origin\", which only lines through the origin satisfy; the one through $(1,1)$ is $y=x$."
  },
  "tb-avg-001": {
    "spot": "Average value $=\\frac{1}{b-a}\\int_a^bf$; integrate $\\sqrt x$ on $[0,4]$ with the power rule, $\\frac{2}{3}x^{3/2}$, and $4^{3/2}=8$ is clean.",
    "why": "Apply the average value formula directly; the integral is just one power.",
    "steps": [
      "$\\int_0^4\\sqrt x\\,dx=\\frac{2}{3}\\cdot 4^{3/2}=\\frac{16}{3}$.",
      "Interval length $4$, average value $\\frac{16/3}{4}=\\frac{4}{3}$.",
      "Answer: $\\frac{4}{3}$."
    ],
    "trap": "Taking the average value to be the average of the endpoints, $\\frac{\\sqrt 0+\\sqrt 4}{2}=1$; or forgetting to divide by the interval length and answering $\\frac{16}{3}$.",
    "check": "$\\sqrt x$ is concave down, so its average value should exceed the endpoint average $1$ but stay below the maximum $2$; $\\frac{4}{3}$ is reasonable."
  },
  "vc-line-001": {
    "spot": "$C$ is the line segment from the origin to $(3,4)$, with length exactly $5$ (a $3$-$4$-$5$ right triangle): parametrize as $(3t,4t)$ and $ds=5\\,dt$.",
    "why": "A line integral with respect to arc length needs a parametrization to turn $ds$ into $|\\mathbf r'(t)|dt$; a straight line has constant speed, the simplest case.",
    "steps": [
      "$\\mathbf r(t)=(3t,4t)$, $0\\le t\\le 1$; $|\\mathbf r'|=\\sqrt{9+16}=5$.",
      "$\\int_Cx\\,ds=\\int_0^13t\\cdot 5\\,dt=15\\int_0^1t\\,dt$.",
      "$=\\frac{15}{2}$."
    ],
    "trap": "Forgetting $ds=5\\,dt$ and computing $\\int_0^13t\\,dt=\\frac{3}{2}$; or integrating with $dx$ instead, $\\int_0^3x\\,dx=\\frac{9}{2}$, which is the line integral with respect to $x$, not arc length.",
    "check": "The average of $x$ along the segment is $\\frac{3}{2}$; times the length $5$ gives $\\frac{15}{2}$."
  },
  "vc-line-002": {
    "spot": "The integrand $x^2+y^2$ is identically $4$ on the circle $x^2+y^2=4$ — substitute the curve's equation into the integrand first and it becomes a constant.",
    "why": "A constant times arc length needs neither a parametrization nor an integral; parametrizing works too, it's just the long way round.",
    "steps": [
      "On $C$, $x^2+y^2=4$, so the integrand is the constant $4$.",
      "Circumference $2\\pi\\cdot 2=4\\pi$.",
      "$\\int_C 4\\,ds=4\\cdot 4\\pi=16\\pi$."
    ],
    "trap": "When parametrizing, forgetting $ds=2\\,dt$ (a circle of radius $2$ has speed $2$) and computing $\\int_0^{2\\pi}4\\,dt=8\\pi$.",
    "check": "Value of a line integral $=$ average value $\\times$ length; here the average value is just $4$, and $16\\pi\\approx 50.27$."
  },
  "vc-line-003": {
    "spot": "Use $x$ as the parameter for the curve $y=x^2$, so $ds=\\sqrt{1+4x^2}\\,dx$; and the integrand $x$ is exactly $\\frac{1}{8}$ of the derivative of $1+4x^2$ — substitute $u=1+4x^2$.",
    "why": "$1+4x^2$ under the root with $x$ outside: \"the inner derivative is right beside it\", so one substitution finishes it — no trigonometric substitution needed.",
    "steps": [
      "$\\mathbf r(x)=(x,x^2)$, $|\\mathbf r'|=\\sqrt{1+(2x)^2}=\\sqrt{1+4x^2}$.",
      "$\\int_Cx\\,ds=\\int_0^1x\\sqrt{1+4x^2}\\,dx$; let $u=1+4x^2$, $x\\,dx=\\frac{du}{8}$, with $u$ running from $1$ to $5$.",
      "$\\frac{1}{8}\\int_1^5\\sqrt u\\,du=\\frac{1}{8}\\cdot\\frac{2}{3}(5^{3/2}-1)=\\frac{5\\sqrt 5-1}{12}$.",
      "Answer: $\\frac{5\\sqrt 5-1}{12}\\approx 0.849$."
    ],
    "trap": "Leaving out the root in $ds$ and computing $\\int_0^1x\\,dx=\\frac{1}{2}$; or forgetting to change the limits to $1$ through $5$ after substituting.",
    "check": "On $[0,1]$, $\\sqrt{1+4x^2}$ lies between $1$ and $\\sqrt 5\\approx 2.24$, so the answer should be between $\\frac{1}{2}$ and $\\frac{\\sqrt 5}{2}\\approx 1.12$."
  },
  "vc-line-004": {
    "spot": "The helix $(\\cos t,\\sin t,t)$: the velocity $(-\\sin t,\\cos t,1)$ has length $\\sqrt{\\sin^2t+\\cos^2t+1}=\\sqrt 2$, a constant — so $ds=\\sqrt 2\\,dt$; and $z=t$.",
    "why": "With constant speed the line integral is just $\\sqrt 2\\int z\\,dt$, a single power integral.",
    "steps": [
      "$|\\mathbf r'(t)|=\\sqrt{\\sin^2t+\\cos^2t+1}=\\sqrt 2$.",
      "$z=t$, so $\\int_Cz\\,ds=\\int_0^{2\\pi}t\\sqrt 2\\,dt$.",
      "$=\\sqrt 2\\cdot\\frac{(2\\pi)^2}{2}=2\\sqrt 2\\pi^2$."
    ],
    "trap": "Thinking $ds=dt$ (forgetting the speed $1$ in the $z$ direction) and getting $2\\pi^2$.",
    "check": "The average of $z$ along the curve is $\\pi$ and the total length is $2\\sqrt 2\\pi$; their product is $2\\sqrt 2\\pi^2\\approx 27.9$."
  },
  "vc-nab-008": {
    "spot": "$\\nabla^2$ is the Laplacian $f_{xx}+f_{yy}$; $x^2y^3$ is a product, so $y^3$ is a constant when differentiating in $x$, and $x^2$ is a constant when differentiating in $y$.",
    "why": "Find the two second partials at a general point, then plug in $(1,1)$; no mixed partial needed — the Laplacian only uses the two diagonal terms.",
    "steps": [
      "$f_{xx}=2y^3$.",
      "$f_{yy}=6x^2y$.",
      "At $(1,1)$: $f_{xx}=2$, $f_{yy}=6$.",
      "$\\nabla^2f=2+6=8$."
    ],
    "trap": "Treating $\\nabla^2$ as the gradient and taking its length, or also adding the mixed partial $f_{xy}=6xy^2$, which gives $14$.",
    "check": "Move only $x$: $f(x,1)=x^2$, second derivative $2$; move only $y$: $f(1,y)=y^3$, second derivative $6$ at $y=1$."
  }
};
