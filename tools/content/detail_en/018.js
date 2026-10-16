// Detail v2, English — batch 018. Translation of tools/content/detail/018.js (text only; claims live in the Chinese file).
module.exports = {
  "exam-int-020": {
    "spot": "The numerator $x^2$ is the derivative $3x^2$ of $1+x^3$ (inside the root) up to the constant $3$: \"the inside's derivative sits outside\" is the signal for substitution.",
    "why": "Let $u=1+x^3$ and the whole problem becomes the power integral $\\int u^{-1/2}\\,du$; no trig substitution or integration by parts needed.",
    "steps": [
      "Let $u=1+x^3$, $du=3x^2\\,dx$, so $x^2\\,dx=\\frac{1}{3}du$.",
      "The integral becomes $\\frac{1}{3}\\int u^{-1/2}\\,du=\\frac{1}{3}\\cdot 2u^{1/2}=\\frac{2}{3}\\sqrt{u}$.",
      "Back to $x$: $\\frac{2}{3}\\sqrt{1+x^3}+C$."
    ],
    "trap": "Forgetting the $\\frac{1}{3}$ that comes from $du$ and writing $2\\sqrt{1+x^3}$; differentiating back gives an extra factor of $3$.",
    "check": "Differentiate back: $\\frac{2}{3}\\cdot\\frac{3x^2}{2\\sqrt{1+x^3}}=\\frac{x^2}{\\sqrt{1+x^3}}$, the same as the integrand."
  },
  "int-041": {
    "spot": "The numerator $x^3$ is one quarter of $4x^3$, the derivative of the denominator $1+x^4$: numerator = derivative of denominator means the answer is a $\\ln$.",
    "why": "$\\int\\frac{u'}{u}=\\ln|u|$ finishes it in one step; no partial fractions needed.",
    "steps": [
      "Let $u=1+x^4$, $du=4x^3\\,dx$, so $x^3\\,dx=\\frac{1}{4}du$.",
      "The integral becomes $\\frac{1}{4}\\int\\frac{du}{u}=\\frac{1}{4}\\ln|u|$.",
      "Since $1+x^4>0$, drop the absolute value: $\\frac{1}{4}\\ln(1+x^4)+C$."
    ],
    "trap": "Seeing $1+x^4$ and thinking $\\arctan$, writing $\\frac{1}{2}\\arctan(x^2)$ — that is the answer to $\\int\\frac{x}{1+x^4}dx$.",
    "check": "Plug in $x=1$: the integrand is $\\frac{1}{2}$, and the derivative of the answer is $\\frac{4}{4\\cdot 2}=\\frac{1}{2}$. They match."
  },
  "int-043": {
    "spot": "The denominator has both $\\sqrt{1+x^2}$ and $1+\\sqrt{1+x^2}$, and $\\frac{x}{\\sqrt{1+x^2}}$ is exactly the derivative of $\\sqrt{1+x^2}$: take the whole $1+\\sqrt{1+x^2}$ as $u$.",
    "why": "With $u=1+\\sqrt{1+x^2}$ all that is left is $\\int\\frac{du}{u}$; using $x=\\tan\\theta$ instead takes a long detour.",
    "steps": [
      "Let $u=1+\\sqrt{1+x^2}$, $du=\\frac{x}{\\sqrt{1+x^2}}\\,dx$.",
      "Split the integrand as $\\frac{x}{\\sqrt{1+x^2}}\\cdot\\frac{1}{1+\\sqrt{1+x^2}}$, which is $\\frac{du}{u}$.",
      "$\\int\\frac{du}{u}=\\ln u$, and $u>0$, so the answer is $\\ln\\left(1+\\sqrt{1+x^2}\\right)+C$."
    ],
    "trap": "Taking just $u=\\sqrt{1+x^2}$ also works, but many people cancel $\\sqrt{1+x^2}$ wrongly in the $du$ step and end up with something like $\\int\\frac{u\\,du}{1+u}$, with an extra $u$.",
    "check": "Plug in $x=1$: the integrand is $\\frac{1}{\\sqrt 2(1+\\sqrt 2)}\\approx 0.293$, and the derivative of the answer gives the same number."
  },
  "int-044": {
    "spot": "$e^{x^2}$ appears in both numerator and denominator, with an extra $x$ outside: $x e^{x^2}$ is exactly half the derivative of $1+e^{x^2}$.",
    "why": "Let $u=1+e^{x^2}$ and it becomes $\\frac{1}{2}\\int\\frac{du}{u}$ directly; taking only $u=x^2$ would need a second substitution.",
    "steps": [
      "Let $u=1+e^{x^2}$, $du=2x e^{x^2}\\,dx$, so $x e^{x^2}\\,dx=\\frac{1}{2}du$.",
      "The integral becomes $\\frac{1}{2}\\int\\frac{du}{u}=\\frac{1}{2}\\ln u$.",
      "Substitute back: $\\frac{1}{2}\\ln\\left(1+e^{x^2}\\right)+C$."
    ],
    "trap": "Dropping the $\\frac{1}{2}$ and writing $\\ln(1+e^{x^2})$; its derivative is $\\frac{2xe^{x^2}}{1+e^{x^2}}$, twice too big.",
    "check": "Plug in $x=1$: the integrand is $\\frac{e}{1+e}\\approx 0.731$, and so is the derivative of the answer."
  },
  "int-046": {
    "spot": "The numerator $2x$ is the derivative of the bracket $1+x^2$: \"inside's derivative multiplied outside\", so $u=1+x^2$ leaves just $u^{-3}$.",
    "why": "After substitution it is a plain power integral; change the limits to the $u$ range at the same time and you never have to switch back to $x$.",
    "steps": [
      "Let $u=1+x^2$, $du=2x\\,dx$; $x=0\\to u=1$, $x=1\\to u=2$.",
      "The integral becomes $\\int_1^2 u^{-3}\\,du$, with antiderivative $-\\frac{1}{2u^2}$.",
      "Evaluate at the limits: $-\\frac{1}{8}+\\frac{1}{2}=\\frac{3}{8}$.",
      "Answer: $\\frac{3}{8}$."
    ],
    "trap": "Changing the variable but not the limits, plugging $0$ and $1$ into $-\\frac{1}{2u^2}$ and getting a weird result with $0$ in the denominator.",
    "check": "On $[0,1]$ the integrand stays between $0$ and about $0.52$, so an area of $0.375$ is reasonable."
  },
  "lim-033": {
    "spot": "$x$ and $y$ only appear through the combination $x+y$: let $t=x+y$ and the two-variable limit becomes the one-variable $\\frac{e^t-1}{t}$.",
    "why": "The whole expression depends only on $t=x+y$, and as $(x,y)\\to(0,0)$ we have $t\\to 0$ no matter the direction of approach; no need to check path by path.",
    "steps": [
      "Let $t=x+y$; as $(x,y)\\to(0,0)$, $t\\to 0$.",
      "The expression $=\\frac{e^t-1}{t}$, and plugging in $t=0$ gives $\\frac{0}{0}$.",
      "This is exactly the derivative of $e^t$ at $0$: $\\lim_{t\\to 0}\\frac{e^t-1}{t}=e^0=1$.",
      "Answer: $1$."
    ],
    "trap": "Thinking a two-variable limit always means trying lines $y=mx$ one by one. Here, along $y=-x$ the denominator is always $0$, so the function is undefined on that line; the right statement is that $t\\to 0$ when approaching within the domain.",
    "check": "Plug in $x=y=0.005$: $t=0.01$, and $\\frac{e^{0.01}-1}{0.01}\\approx 1.005$."
  },
  "ser-037": {
    "spot": "$\\frac{1}{n(\\ln n)^2}$: the denominator is $n$ times a power of $\\ln n$ — a \"logarithmic $p$-series\", made for the Integral Test, since $\\frac{1}{x\\ln x}$ belongs to the family of derivatives of $\\ln(\\ln x)$.",
    "why": "The Ratio and Root Tests both give a limit of $1$ here and decide nothing; for the integral, $u=\\ln x$ turns it into $\\int\\frac{du}{u^2}$.",
    "steps": [
      "$f(x)=\\frac{1}{x(\\ln x)^2}$ is positive and decreasing for $x\\ge 2$, so the Integral Test applies.",
      "Let $u=\\ln x$, $du=\\frac{dx}{x}$: $\\int\\frac{dx}{x(\\ln x)^2}=\\int\\frac{du}{u^2}=-\\frac{1}{\\ln x}$.",
      "$\\int_2^X\\frac{dx}{x(\\ln x)^2}=\\frac{1}{\\ln 2}-\\frac{1}{\\ln X}$, which tends to $\\frac{1}{\\ln 2}$ as $X\\to\\infty$ — finite.",
      "The integral converges, so the series converges."
    ],
    "trap": "Mixing it up with $\\sum\\frac{1}{n\\ln n}$: that integral gives $\\ln(\\ln x)\\to\\infty$ and diverges; this one has one extra power and converges.",
    "check": "Compare with the $p$-series intuition: the power of $(\\ln n)^p$ is $p=2>1$, so it converges."
  },
  "tmpl-int-usub-poly-001": {
    "spot": "The bracket holds $x^2+1$, and the $x$ outside is exactly half its derivative $2x$: substitute $u=x^2+1$.",
    "why": "Expanding $(x^2+1)^3$ and integrating term by term works too, but substitution takes one line and does not care how high the power is.",
    "steps": [
      "Let $u=x^2+1$, $du=2x\\,dx$, so $x\\,dx=\\frac{1}{2}du$.",
      "The integral becomes $\\frac{1}{2}\\int u^3\\,du=\\frac{1}{2}\\cdot\\frac{u^4}{4}=\\frac{u^4}{8}$.",
      "Substitute back: $\\frac{(x^2+1)^4}{8}+C$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ and writing $\\frac{(x^2+1)^4}{4}$; its derivative is twice too big.",
    "check": "Plug in $x=1$: the integrand is $1\\cdot 2^3=8$, and the derivative of the answer is $\\frac{4\\cdot 2^3\\cdot 2}{8}=8$."
  },
  "der-040": {
    "spot": "Both the base and the exponent contain $x$ ($x^{\\ln x}$): neither the Power Rule nor the exponential rule applies, so take logs first.",
    "why": "Logarithmic differentiation brings the exponent down as $(\\ln x)^2$; after that it is an ordinary Chain Rule.",
    "steps": [
      "Let $y=x^{\\ln x}$ and take logs: $\\ln y=\\ln x\\cdot\\ln x=(\\ln x)^2$.",
      "Differentiate both sides with respect to $x$: $\\frac{y'}{y}=2\\ln x\\cdot\\frac{1}{x}$.",
      "Multiply by $y$: $y'=x^{\\ln x}\\cdot\\frac{2\\ln x}{x}$."
    ],
    "trap": "Treating $\\ln x$ as a constant and using the Power Rule: $\\ln x\\cdot x^{\\ln x-1}$ — that is only half the job, missing a factor of $2$.",
    "check": "Plug in $x=e$: $y=e^1=e$, and the formula gives $e\\cdot\\frac{2}{e}=2$; the secant slope is also close to $2$."
  },
  "int-031": {
    "spot": "The inner integral runs in $x$ from $y$ to $1$ and the integrand is just $x^2$: integrating the inner one first gives a polynomial in $y$, so just do it.",
    "why": "The inner integral is easy as is, so no need to switch the order; switching ($\\int_0^1\\int_0^x x^2\\,dy\\,dx=\\int_0^1 x^3dx$) is a good check.",
    "steps": [
      "Inner: $\\int_y^1 x^2\\,dx=\\frac{1}{3}-\\frac{y^3}{3}=\\frac{1-y^3}{3}$.",
      "Outer: $\\int_0^1\\frac{1-y^3}{3}\\,dy=\\frac{1}{3}\\left(1-\\frac{1}{4}\\right)$.",
      "$=\\frac{1}{3}\\cdot\\frac{3}{4}=\\frac{1}{4}$."
    ],
    "trap": "Evaluating the inner integral as $\\frac{y^3}{3}-\\frac{1}{3}$ (lower minus upper) and getting $-\\frac{1}{4}$; the integrand is nonnegative, so the answer cannot be negative.",
    "check": "Switch the order: the region is $0\\le y\\le x\\le 1$, and $\\int_0^1 x^2\\cdot x\\,dx=\\frac{1}{4}$ — the same."
  },
  "int-038": {
    "spot": "$x$ times $\\cos x$: polynomial times trig, the standard integration by parts — differentiate the polynomial, integrate the trig.",
    "why": "With $u=x$, one derivative makes it a constant and the leftover $\\int\\sin x$ is immediate; the other choice raises the power.",
    "steps": [
      "$u=x$, $dv=\\cos x\\,dx$, so $du=dx$, $v=\\sin x$.",
      "$\\int x\\cos x\\,dx=x\\sin x-\\int\\sin x\\,dx$.",
      "$-\\int\\sin x\\,dx=\\cos x$, so the answer is $x\\sin x+\\cos x+C$."
    ],
    "trap": "Mixing up the minus sign of $\\int\\sin x\\,dx=-\\cos x$ with the minus in front and writing $x\\sin x-\\cos x$; differentiating back gives an extra $2\\sin x$.",
    "check": "Plug in $x=\\pi$: the integrand is $-\\pi$, and the derivative of the answer is also $-\\pi$."
  },
  "int-048": {
    "spot": "The denominator $\\sqrt{1-x^2}$ is \"$1$ minus a square\": the trig substitution $x=\\sin\\theta$ turns the root into $\\cos\\theta$.",
    "why": "After substitution, $dx=\\cos\\theta\\,d\\theta$ cancels the denominator exactly, leaving $\\int\\sin^2\\theta$, which the half-angle formula handles.",
    "steps": [
      "Let $x=\\sin t$, $dx=\\cos t\\,dt$, $\\sqrt{1-x^2}=\\cos t$; $x:0\\to 1$ corresponds to $t:0\\to\\frac{\\pi}{2}$.",
      "The integral becomes $\\int_0^{\\pi/2}\\frac{\\sin^2 t}{\\cos t}\\cos t\\,dt=\\int_0^{\\pi/2}\\sin^2 t\\,dt$.",
      "Half-angle: $\\int_0^{\\pi/2}\\frac{1-\\cos 2t}{2}dt=\\frac{\\pi}{4}-0$.",
      "Answer: $\\frac{\\pi}{4}$."
    ],
    "trap": "Seeing that the upper limit $x=1$ makes the denominator $0$ and concluding the integral diverges; it is a convergent improper integral, and the singularity disappears after substitution.",
    "check": "The average of $\\sin^2$ over a quarter period is $\\frac{1}{2}$; times the length $\\frac{\\pi}{2}$ gives $\\frac{\\pi}{4}\\approx 0.785$."
  },
  "int-050": {
    "spot": "$\\frac{1}{x\\sqrt{x^2-1}}$ is \"a square minus $1$\" with an extra $x$ outside: exactly the derivative of $\\operatorname{arcsec} x$, or use $x=\\sec\\theta$.",
    "why": "Recognize the inverse-trig derivative and just plug in the limits; the trig substitution $x=\\sec\\theta$ turns the whole integrand into $1$, which is also fast.",
    "steps": [
      "Let $x=\\sec\\theta$, $dx=\\sec\\theta\\tan\\theta\\,d\\theta$, $\\sqrt{x^2-1}=\\tan\\theta$.",
      "The integrand becomes $\\frac{\\sec\\theta\\tan\\theta}{\\sec\\theta\\tan\\theta}=1$; equivalently, $\\frac{d}{dx}\\arccos\\frac{1}{x}=\\frac{1}{x\\sqrt{x^2-1}}$.",
      "Limits: $x=1\\to\\theta=0$, $x=2\\to\\theta=\\frac{\\pi}{3}$ (because $\\cos\\frac{\\pi}{3}=\\frac{1}{2}$).",
      "Integral $=\\frac{\\pi}{3}-0=\\frac{\\pi}{3}$."
    ],
    "trap": "Getting the upper limit for $\\theta$ as $\\frac{\\pi}{6}$ (treating $\\sec\\theta=2$ as $\\sin\\theta=\\frac{1}{2}$).",
    "check": "Numerical integration gives about $1.047$, which is $\\frac{\\pi}{3}$."
  },
  "int-051": {
    "spot": "$(x^2+4)^{3/2}$ is \"a square plus $2^2$\" to the three-halves power: trig substitution $x=2\\tan\\theta$ turns $x^2+4$ into $4\\sec^2\\theta$.",
    "why": "There is no ready-made $u'$ for a substitution; after the trig substitution only $\\int\\cos\\theta\\,d\\theta$ is left.",
    "steps": [
      "Let $x=2\\tan\\theta$, $dx=2\\sec^2\\theta\\,d\\theta$, $(x^2+4)^{3/2}=8\\sec^3\\theta$.",
      "The integral becomes $\\int\\frac{2\\sec^2\\theta}{8\\sec^3\\theta}d\\theta=\\frac{1}{4}\\int\\cos\\theta\\,d\\theta=\\frac{1}{4}\\sin\\theta$.",
      "Draw the triangle: $\\tan\\theta=\\frac{x}{2}$, hypotenuse $\\sqrt{x^2+4}$, so $\\sin\\theta=\\frac{x}{\\sqrt{x^2+4}}$.",
      "Answer: $\\frac{x}{4\\sqrt{x^2+4}}+C$."
    ],
    "trap": "Switching back to $x$ with $\\sin\\theta=\\frac{x}{2}$ (treating $\\tan$ as $\\sin$), getting $\\frac{x}{8}$, whose derivative is completely wrong.",
    "check": "Plug in $x=0$: the integrand is $\\frac{1}{8}$, and the derivative of the answer is $\\frac{1}{4\\cdot 2}=\\frac{1}{8}$."
  },
  "int-053": {
    "spot": "$x^2$ times $\\sin x$: polynomial times trig, so integrate by parts twice — each round lowers the polynomial's degree by one.",
    "why": "Choosing $u=x^2$ twice brings it down to a constant; the tabular method (derivative column $x^2,2x,2,0$, integral column with alternating $\\pm$) does it in one go.",
    "steps": [
      "First round: $u=x^2$, $v=-\\cos x$: $\\int x^2\\sin x\\,dx=-x^2\\cos x+\\int 2x\\cos x\\,dx$.",
      "Second round: $\\int 2x\\cos x\\,dx=2x\\sin x-\\int 2\\sin x\\,dx=2x\\sin x+2\\cos x$.",
      "Together: $-x^2\\cos x+2x\\sin x+2\\cos x+C$."
    ],
    "trap": "Losing the minus sign in the second round and ending with $-2\\cos x$; differentiating back gives an extra $4\\sin x$.",
    "check": "Plug in $x=\\frac{\\pi}{2}$: the integrand is $\\frac{\\pi^2}{4}$, and the derivative of the answer is also $\\frac{\\pi^2}{4}\\approx 2.47$."
  },
  "int-055": {
    "spot": "$x$ times $(\\ln x)^2$: integration by parts with a $\\ln$, so let the $\\ln$ part be $u$ and differentiate it — each derivative lowers the power of $\\ln$ by one.",
    "why": "$(\\ln x)^2$ has no easy antiderivative, but its derivative is $\\frac{2\\ln x}{x}$, which combines with $x^2$ into $x\\ln x$; one more round of parts finishes it.",
    "steps": [
      "$u=(\\ln x)^2$, $dv=x\\,dx$: $du=\\frac{2\\ln x}{x}dx$, $v=\\frac{x^2}{2}$.",
      "$\\int x(\\ln x)^2dx=\\frac{x^2}{2}(\\ln x)^2-\\int x\\ln x\\,dx$.",
      "Parts again: $\\int x\\ln x\\,dx=\\frac{x^2}{2}\\ln x-\\frac{x^2}{4}$.",
      "Together: $\\frac{x^2(\\ln x)^2}{2}-\\frac{x^2\\ln x}{2}+\\frac{x^2}{4}+C$."
    ],
    "trap": "Not distributing the minus sign after the second round and writing $-\\frac{x^2}{4}$; differentiating back gives an extra $-x$.",
    "check": "Plug in $x=e$: the integrand is $e\\cdot 1=e$, and the derivative of the answer is also $e$."
  },
  "int-056": {
    "spot": "$x$ times $\\arctan x$: $\\arctan$ itself is hard to integrate, but its derivative is the rational function $\\frac{1}{1+x^2}$, so make it $u$ in integration by parts.",
    "why": "Once $\\arctan$ is differentiated away, what remains is $\\frac{x^2}{1+x^2}=1-\\frac{1}{1+x^2}$, integrated in one line.",
    "steps": [
      "$u=\\arctan x$, $v=\\frac{x^2}{2}$: $\\int_0^1 x\\arctan x\\,dx=\\left[\\frac{x^2}{2}\\arctan x\\right]_0^1-\\frac{1}{2}\\int_0^1\\frac{x^2}{1+x^2}dx$.",
      "First term: $\\frac{1}{2}\\cdot\\frac{\\pi}{4}=\\frac{\\pi}{8}$.",
      "$\\frac{x^2}{1+x^2}=1-\\frac{1}{1+x^2}$, so $\\int_0^1\\frac{x^2}{1+x^2}dx=1-\\frac{\\pi}{4}$.",
      "Answer: $\\frac{\\pi}{8}-\\frac{1}{2}\\left(1-\\frac{\\pi}{4}\\right)=\\frac{\\pi}{4}-\\frac{1}{2}$."
    ],
    "trap": "Forgetting to multiply $1-\\frac{\\pi}{4}$ by $\\frac{1}{2}$ at the end, getting $\\frac{3\\pi}{8}-1\\approx 0.178$.",
    "check": "$\\frac{\\pi}{4}-\\frac{1}{2}\\approx 0.285$; the integrand grows from $0$ to $0.785$ on $[0,1]$, so an area below $0.39$ is reasonable."
  },
  "int-061": {
    "spot": "Interval $[0,\\frac{\\pi}{2}]$ and integrand $\\frac{\\sin^3}{\\sin^3+\\cos^3}$: substituting $x\\to\\frac{\\pi}{2}-x$ swaps $\\sin$ and $\\cos$ — the signature of a symmetry integral.",
    "why": "Integrating directly is nearly hopeless; add the original to the swapped version, the numerator matches the denominator, and the sum is $\\int 1$.",
    "steps": [
      "Let $I=\\int_0^{\\pi/2}\\frac{\\sin^3x}{\\sin^3x+\\cos^3x}dx$; substituting $x\\to\\frac{\\pi}{2}-x$ gives $I=\\int_0^{\\pi/2}\\frac{\\cos^3x}{\\cos^3x+\\sin^3x}dx$.",
      "Add the two; the integrand becomes $1$: $2I=\\int_0^{\\pi/2}1\\,dx=\\frac{\\pi}{2}$.",
      "So $I=\\frac{\\pi}{4}$."
    ],
    "trap": "Factoring the denominator $\\sin^3+\\cos^3$ and grinding away until you get stuck; the power $3$ does not matter at all — with any power the answer is $\\frac{\\pi}{4}$.",
    "check": "At $x=\\frac{\\pi}{4}$ the integrand is exactly $\\frac{1}{2}$, and it is antisymmetric about that point, so its average is $\\frac{1}{2}$."
  },
  "int-062": {
    "spot": "Interval $[0,1]$, denominator $e^x+e^{1-x}$: substituting $x\\to 1-x$ swaps $e^x$ and $e^{1-x}$ and leaves the denominator unchanged.",
    "why": "Same trick as $\\frac{\\sin^n}{\\sin^n+\\cos^n}$: add the original and the swapped version, and the integrand becomes $1$.",
    "steps": [
      "Let $I=\\int_0^1\\frac{e^x}{e^x+e^{1-x}}dx$; substituting $x\\to 1-x$ gives $I=\\int_0^1\\frac{e^{1-x}}{e^{1-x}+e^x}dx$.",
      "Add: $\\frac{e^x+e^{1-x}}{e^x+e^{1-x}}=1$, so $2I=\\int_0^1 1\\,dx=1$.",
      "$I=\\frac{1}{2}$."
    ],
    "trap": "Multiplying top and bottom by $e^x$ to get $\\frac{e^{2x}}{e^{2x}+e}$ and substituting also works, but many people get the $\\ln$ limits wrong; the symmetry method needs no computation at all.",
    "check": "At $x=\\frac{1}{2}$ the integrand equals $\\frac{1}{2}$, and it is antisymmetric about that point."
  },
  "ser-036": {
    "spot": "$\\frac{2^n}{3^n+n}$: the denominator is bigger than $3^n$, so every term is less than $\\left(\\frac{2}{3}\\right)^n$ — compare directly with a geometric series.",
    "why": "The Comparison Test settles it in one line; the Ratio Test works too, but handling $\\frac{3^n+n}{3^{n+1}+n+1}$ is messier.",
    "steps": [
      "$3^n+n>3^n$, so $0<\\frac{2^n}{3^n+n}<\\frac{2^n}{3^n}=\\left(\\frac{2}{3}\\right)^n$.",
      "$\\sum\\left(\\frac{2}{3}\\right)^n$ is a geometric series with ratio $\\frac{2}{3}<1$; it converges, with sum $2$.",
      "By the Comparison Test, the original series converges."
    ],
    "trap": "Seeing exponentials on top and bottom, expecting the ratio to be something other than $\\frac{2}{3}$ and grinding through it; the extra $n$ in the denominator is no match for $3^n$.",
    "check": "Ratio Test: $\\frac{a_{n+1}}{a_n}\\to\\frac{2}{3}<1$, same conclusion."
  },
  "der-048": {
    "spot": "A quadratic in two variables: setting both partial derivatives to $0$ gives a linear system with a unique critical point; then the Hessian determinant confirms a minimum.",
    "why": "A quadratic has just one critical point; discriminant $f_{xx}f_{yy}-f_{xy}^2>0$ with $f_{xx}>0$ means a global minimum. Completing the square also works, but the cross term makes it messier with two variables.",
    "steps": [
      "$f_x=6x+2y-8$, $f_y=2x+4y-6$.",
      "Solve $6x+2y=8$, $2x+4y=6$: $x=1$, $y=1$.",
      "$f_{xx}=6$, $f_{yy}=4$, $f_{xy}=2$: $6\\cdot 4-2^2=20>0$ and $f_{xx}>0$, so it is a minimum (for a quadratic, the global minimum).",
      "Minimum value $f(1,1)=3+2+2-8-6=-7$."
    ],
    "trap": "Stopping at $(1,1)$ and answering \"the minimum is at $(1,1)$\"; the question asks for the minimum value, so plug back in to get $-7$.",
    "check": "Try a nearby point $(1.1,0.9)$: $f\\approx -6.97$, which is bigger than $-7$."
  },
  "der-049": {
    "spot": "$x^2+2x$ and $y^2-4y$ are separate with no cross term: complete the square in each, and the minimum point is visible at a glance.",
    "why": "Completing the square is faster than solving the partial-derivative system, and it proves the minimum is global at the same time.",
    "steps": [
      "Complete the square: $x^2+2x=(x+1)^2-1$, $y^2-4y=(y-2)^2-4$.",
      "So $f=(x+1)^2+(y-2)^2+2$, with minimum $2$ at $x=-1$, $y=2$.",
      "Check with partial derivatives: $f_x=2x+2=0$ gives $x=-1$.",
      "The $x$-coordinate of the minimum point is $-1$."
    ],
    "trap": "Getting the sign backwards when completing the square, writing $(x-1)^2$ and answering $x=1$.",
    "check": "$f(-1,2)=1+4-2-8+7=2$, which is exactly the constant term after completing the square."
  },
  "der-052": {
    "spot": "In $f=x^4+y^4$ the two variables are completely separate: the mixed partial $f_{xy}=0$, so the Hessian determinant is just $f_{xx}\\cdot f_{yy}$.",
    "why": "No cross term means a diagonal matrix, and the determinant is simply the product of the two second partials.",
    "steps": [
      "$f_{xx}=12x^2$, $f_{yy}=12y^2$.",
      "$f_x=4x^3$ has no $y$, so $f_{xy}=0$.",
      "At $(1,1)$: $f_{xx}=12$, $f_{yy}=12$, $f_{xy}=0$.",
      "$\\det H=12\\cdot 12-0^2=144$."
    ],
    "trap": "Treating the Hessian determinant as $f_{xx}+f_{yy}$ (that is the Laplacian) and getting $24$.",
    "check": "$144>0$ and $f_{xx}>0$ mean $f$ is an upward bowl near $(1,1)$, consistent with the shape of $x^4+y^4$."
  },
  "der-054": {
    "spot": "Only one term $-4xy$ different from $x^4+y^4$: the pure second partials do not change, and the cross term only contributes $f_{xy}=-4$.",
    "why": "Hessian determinant $f_{xx}f_{yy}-f_{xy}^2$; $-4xy$ is a bilinear term and only affects the mixed partial.",
    "steps": [
      "$f_x=4x^3-4y$, $f_y=4y^3-4x$.",
      "$f_{xx}=12x^2$, $f_{yy}=12y^2$, $f_{xy}=-4$.",
      "At $(1,1)$: $12\\cdot 12-(-4)^2=144-16$.",
      "Answer: $128$."
    ],
    "trap": "Writing $f_{xy}^2$ as $f_{xy}$ and computing $144-(-4)=148$.",
    "check": "$(1,1)$ is in fact a critical point ($f_x=f_y=0$); the determinant is $>0$ and $f_{xx}>0$, so it is a local minimum."
  },
  "der-070": {
    "spot": "$r,s$ reach $x,y$ only through $u,v$: write $r,s$ directly in terms of $x,y$ first — $r=2x$, $s=x^2-y^2$ — which is faster than multiplying two Jacobian matrices.",
    "why": "After substituting, every partial derivative is obvious; $\\frac{\\partial(r,s)}{\\partial(u,v)}\\cdot\\frac{\\partial(u,v)}{\\partial(x,y)}$ serves as a check.",
    "steps": [
      "$r=u+v=(x+y)+(x-y)=2x$; $s=uv=(x+y)(x-y)=x^2-y^2$.",
      "$r_x=2$, $r_y=0$; $s_x=2x$, $s_y=-2y$.",
      "Determinant $r_xs_y-r_ys_x=2\\cdot(-2y)-0\\cdot 2x=-4y$."
    ],
    "trap": "Subtracting the diagonals in the wrong order: $r_ys_x-r_xs_y=4y$.",
    "check": "Chain check: $\\frac{\\partial(r,s)}{\\partial(u,v)}=1\\cdot u-1\\cdot v=u-v=2y$, $\\frac{\\partial(u,v)}{\\partial(x,y)}=1\\cdot(-1)-1\\cdot 1=-2$, product $-4y$."
  },
  "int-047": {
    "spot": "$y=\\sqrt{4-x^2}$ is the upper half of the circle of radius $2$, and $x$ runs from $0$ to $2$: the area is a quarter circle.",
    "why": "Recognize the shape and use $\\frac{1}{4}\\pi r^2$ directly; the trig substitution $x=2\\sin\\theta$ works too, but is much slower.",
    "steps": [
      "Squaring $y=\\sqrt{4-x^2}$ gives $x^2+y^2=4$ with $y\\ge 0$: the upper half circle of radius $2$.",
      "$x$ goes from $0$ to $2$, so only the quarter circle in the first quadrant.",
      "Answer: $\\pi$."
    ],
    "trap": "Treating it as a half circle and answering $2\\pi$; the interval is only $[0,2]$, a quarter.",
    "check": "A quarter circle should be bigger than the inscribed triangle (area $2$) and smaller than the enclosing square (area $4$): $\\pi\\approx 3.14$."
  },
  "cx-lim-002": {
    "spot": "Plugging in $x=4$ gives $\\frac{0}{0}$, and the numerator $x^2-16$ is a difference of squares: factor and cancel with the $x-4$ in the denominator.",
    "why": "A polynomial $\\frac{0}{0}$ always has the common factor $(x-4)$; canceling is the most direct route, no L'Hôpital's Rule needed.",
    "steps": [
      "Plug in $x=4$: numerator $16-16=0$, denominator $0$.",
      "$x^2-16=(x-4)(x+4)$; cancel $x-4$ to leave $x+4$.",
      "Plug in $x=4$: $4+4=8$."
    ],
    "trap": "Seeing $\\frac{0}{0}$ and saying the limit does not exist or equals $0$; $\\frac{0}{0}$ just means \"not done yet\".",
    "check": "Plug in $x=4.01$: $\\frac{16.0801-16}{0.01}=8.01$."
  },
  "cx-lim-003": {
    "spot": "$x\\to\\infty$ with linear numerator and denominator: a rational function of equal degrees, so the limit is the ratio of leading coefficients $\\frac{5}{1}$.",
    "why": "Divide top and bottom by $x$; every constant term turns into something going to $0$. More direct than L'Hôpital's Rule.",
    "steps": [
      "Divide top and bottom by $x$: $\\frac{5+\\frac{3}{x}}{1-\\frac{2}{x}}$.",
      "As $x\\to\\infty$, $\\frac{3}{x}\\to 0$ and $\\frac{2}{x}\\to 0$.",
      "Limit $=\\frac{5}{1}=5$."
    ],
    "trap": "Taking the ratio of constant terms $\\frac{3}{-2}$ as the answer — that is the value at $x\\to 0$, not $x\\to\\infty$.",
    "check": "Plug in $x=1000$: $\\frac{5003}{998}\\approx 5.013$."
  },
  "cx-lim-004": {
    "spot": "Inside the $\\sin$ is $3x$, but the denominator is just $x$: build the standard form $\\frac{\\sin 3x}{3x}$ and put a $3$ outside.",
    "why": "Use $\\lim_{u\\to 0}\\frac{\\sin u}{u}=1$; it is off only by a constant factor, so no L'Hôpital's Rule needed.",
    "steps": [
      "$\\frac{\\sin 3x}{x}=3\\cdot\\frac{\\sin 3x}{3x}$.",
      "Let $u=3x\\to 0$: $\\frac{\\sin u}{u}\\to 1$.",
      "Limit $=3\\cdot 1=3$."
    ],
    "trap": "Treating $\\frac{\\sin 3x}{x}$ as $1$ or $\\frac{1}{3}$; the multiple inside the angle comes out as a factor, not a divisor.",
    "check": "For small angles $\\sin 3x\\approx 3x$; plug in $x=0.01$: $\\frac{\\sin 0.03}{0.01}\\approx 2.9996$."
  },
  "fd-der-002": {
    "spot": "An ordinary polynomial: apply the Power Rule term by term; the constant term differentiates to $0$.",
    "why": "Differentiation is linear, so handle each term on its own.",
    "steps": [
      "$(3x^2)'=6x$.",
      "$(-5x)'=-5$, $(1)'=0$.",
      "Together: $6x-5$."
    ],
    "trap": "Differentiating the constant $1$ to $1$ and writing $6x-4$.",
    "check": "The vertex is where $f'(x)=0$, at $x=\\frac{5}{6}$, matching the parabola vertex formula $-\\frac{b}{2a}=\\frac{5}{6}$."
  },
  "fd-der-003": {
    "spot": "$\\cos$ wrapped around $3x$: the outer $\\cos$ becomes $-\\sin$, and the inner part gives a $3$.",
    "why": "One step of the Chain Rule: outer derivative times inner derivative.",
    "steps": [
      "Outer: $(\\cos u)'=-\\sin u$.",
      "Inner: $(3x)'=3$.",
      "Multiply: $-3\\sin 3x$."
    ],
    "trap": "Dropping the minus sign to get $3\\sin 3x$, or dropping the inner $3$ to get $-\\sin 3x$.",
    "check": "Plug in $x=0$: $\\cos 3x$ is at its peak at $0$, so the slope should be $0$; $-3\\sin 0=0$."
  },
  "fd-der-004": {
    "spot": "$e^{-x}$: an exponential with inner function $-x$, so the Chain Rule gives a factor of $-1$.",
    "why": "The derivative of $e^u$ is itself times $u'$, and here $u'=-1$.",
    "steps": [
      "$(e^u)'=e^u\\cdot u'$.",
      "$u=-x$, $u'=-1$.",
      "So $\\frac{d}{dx}e^{-x}=-e^{-x}$."
    ],
    "trap": "Thinking exponentials do not change under differentiation and writing $e^{-x}$, missing the minus sign.",
    "check": "$e^{-x}$ is decreasing, so its derivative should be negative everywhere."
  },
  "fd-der-005": {
    "spot": "$x$ times $\\ln x$: a product of two functions, so use the Product Rule.",
    "why": "One application of the Product Rule; $x\\cdot\\frac{1}{x}$ simplifies neatly to $1$.",
    "steps": [
      "$(x)'\\ln x=\\ln x$.",
      "$x\\,(\\ln x)'=x\\cdot\\frac{1}{x}=1$.",
      "Together: $\\ln x+1$."
    ],
    "trap": "Thinking the derivative of a product is the product of the derivatives: $1\\cdot\\frac{1}{x}=\\frac{1}{x}$.",
    "check": "$x\\ln x$ has its minimum at $x=\\frac{1}{e}$, where the derivative is $\\ln\\frac{1}{e}+1=0$. It matches."
  },
  "fd-der-011": {
    "spot": "$\\sin$ with $x^2$ inside: the outer $\\sin$ becomes $\\cos$ (inside unchanged), then multiply by the inner derivative $2x$.",
    "why": "One step of the Chain Rule; do not confuse $\\sin(x^2)$ with $\\sin^2 x$.",
    "steps": [
      "Outer: $(\\sin u)'=\\cos u$, keeping $u=x^2$.",
      "Inner: $(x^2)'=2x$.",
      "Multiply: $2x\\cos(x^2)$."
    ],
    "trap": "Differentiating it as $\\sin^2 x$ and writing $2\\sin x\\cos x$.",
    "check": "Plug in $x=0$: near $0$, $\\sin(x^2)$ behaves like $x^2$, slope $0$; the formula gives $0$."
  },
  "fd-int-002": {
    "spot": "A linear polynomial: use the power antiderivative $\\int x^n=\\frac{x^{n+1}}{n+1}$ term by term.",
    "why": "Integration is linear, so integrate each term separately.",
    "steps": [
      "$\\int 2x\\,dx=x^2$.",
      "$\\int 1\\,dx=x$.",
      "Answer: $x^2+x+C$."
    ],
    "trap": "Integrating the constant $1$ to $0$ or $1$, losing the $x$.",
    "check": "Differentiating back gives $2x+1$, the same as the integrand."
  },
  "fd-int-009": {
    "spot": "$\\frac{1}{\\cos^2x}=\\sec^2x$, which is exactly the derivative of $\\tan x$ — a memorized formula read backwards.",
    "why": "Recognize $\\sec^2$ as $(\\tan x)'$; no substitution needed.",
    "steps": [
      "$\\frac{1}{\\cos^2x}=\\sec^2x$.",
      "$(\\tan x)'=\\sec^2x$.",
      "Answer: $\\tan x+C$."
    ],
    "trap": "Thinking $\\int\\frac{1}{\\cos^2x}$ is something like $\\frac{1}{\\cos x}$ or $-\\frac{1}{\\cos x}$, treating it as a power integral.",
    "check": "Plug in $x=0$: the integrand is $1$, and the slope of $\\tan$ at $0$ is also $1$."
  },
  "fd-int-013": {
    "spot": "$x\\sqrt x$ is really the single power $x^{3/2}$: combine exponents first, then use the power antiderivative.",
    "why": "Once combined into $x^{3/2}$ it is a one-line Power Rule; no integration by parts needed.",
    "steps": [
      "$x\\sqrt x=x^1\\cdot x^{1/2}=x^{3/2}$.",
      "$\\int x^{3/2}dx=\\frac{x^{5/2}}{5/2}=\\frac{2}{5}x^{5/2}$.",
      "Answer: $\\frac{2}{5}x^{5/2}+C$."
    ],
    "trap": "Integrating $x$ and $\\sqrt x$ separately and multiplying, getting $\\frac{x^2}{2}\\cdot\\frac{2}{3}x^{3/2}$ — integrals do not split over products.",
    "check": "Plug in $x=4$: the integrand is $4\\cdot 2=8$, and the derivative of the answer is also $8$."
  },
  "fd-lim-003": {
    "spot": "Plugging in $x=3$ gives $\\frac{0}{0}$: the numerator $x^2-x-6$ must have the factor $(x-3)$, so factor and cancel.",
    "why": "A polynomial $\\frac{0}{0}$ is a hint that there is a common factor; factoring is less error-prone than L'Hôpital's Rule.",
    "steps": [
      "Plug in $x=3$: numerator $9-3-6=0$.",
      "$x^2-x-6=(x-3)(x+2)$; cancel to leave $x+2$.",
      "Plug in $x=3$: $3+2=5$."
    ],
    "trap": "Factoring as $(x+3)(x-2)$ (signs swapped); then nothing cancels and you are stuck.",
    "check": "L'Hôpital's Rule: the numerator's derivative $2x-1$ is $5$ at $x=3$, the denominator's derivative is $1$ — the same."
  },
  "fd-lim-004": {
    "spot": "Plugging in $x=-2$ gives $\\frac{0}{0}$; the numerator $x^2-4$ is a difference of squares containing $(x+2)$.",
    "why": "Factor the difference of squares, cancel with the denominator, and plug in what is left.",
    "steps": [
      "Plug in $x=-2$: numerator $4-4=0$, denominator $0$.",
      "$x^2-4=(x-2)(x+2)$; cancel to leave $x-2$.",
      "Plug in $x=-2$: $-2-2=-4$."
    ],
    "trap": "After canceling to $x-2$, forgetting that $x$ is negative and computing $2-2=0$ or $4$.",
    "check": "Plug in $x=-1.99$: $\\frac{3.9601-4}{0.01}=-3.99$."
  },
  "fd-lim-005": {
    "spot": "$\\sin 7x$ over $2x$: build $\\frac{\\sin 7x}{7x}$ and the constant $\\frac{7}{2}$ is left over.",
    "why": "Standard limit $\\frac{\\sin u}{u}\\to 1$; just pull out the factor.",
    "steps": [
      "$\\frac{\\sin 7x}{2x}=\\frac{7}{2}\\cdot\\frac{\\sin 7x}{7x}$.",
      "As $u=7x\\to 0$, $\\frac{\\sin u}{u}\\to 1$.",
      "Limit $=\\frac{7}{2}$."
    ],
    "trap": "Flipping the coefficients and answering $\\frac{2}{7}$.",
    "check": "Plug in $x=0.001$: the ratio is about $3.49997$."
  },
  "fd-lim-006": {
    "spot": "Near $0$, $\\tan 2x$ is about as big as $2x$: build $\\frac{\\tan 2x}{2x}$ and put a $2$ outside.",
    "why": "$\\frac{\\tan u}{u}=\\frac{\\sin u}{u}\\cdot\\frac{1}{\\cos u}\\to 1$, the same machinery as for $\\sin$.",
    "steps": [
      "$\\frac{\\tan 2x}{x}=2\\cdot\\frac{\\tan 2x}{2x}$.",
      "$\\frac{\\tan u}{u}=\\frac{\\sin u}{u}\\cdot\\frac{1}{\\cos u}\\to 1\\cdot 1$.",
      "Limit $=2$."
    ],
    "trap": "Rewriting $\\tan 2x$ as $2\\tan x$ — that is not the double-angle formula; the limit happens to come out the same here, but on other problems it will be wrong.",
    "check": "Plug in $x=0.001$: the ratio is about $2.0000027$, slightly above $2$ (since $\\tan u>u$)."
  },
  "fd-lim-007": {
    "spot": "$x\\to\\infty$ with linear top and bottom: a rational function of equal degrees, so look at the leading coefficient ratio $\\frac{4}{2}$.",
    "why": "Divide top and bottom by $x$; every constant term goes to $0$.",
    "steps": [
      "Divide by $x$: $\\frac{4+\\frac{1}{x}}{2+\\frac{7}{x}}$.",
      "$\\frac{1}{x}\\to 0$, $\\frac{7}{x}\\to 0$.",
      "Limit $=\\frac{4}{2}=2$."
    ],
    "trap": "Taking the ratio of constant terms $\\frac{1}{7}$ as the answer — that is the value as $x\\to 0$.",
    "check": "Plug in $x=10^4$: $\\frac{40001}{20007}\\approx 1.9993$."
  },
  "fd-lim-008": {
    "spot": "$x\\to\\infty$ with quadratics on top and bottom: equal degrees, so the limit is the ratio of the $x^2$ coefficients, $\\frac{1}{3}$.",
    "why": "Divide top and bottom by $x^2$ and all lower-degree terms vanish.",
    "steps": [
      "Divide by $x^2$: $\\frac{1+\\frac{5}{x}}{3+\\frac{1}{x^2}}$.",
      "$\\frac{5}{x}\\to 0$, $\\frac{1}{x^2}\\to 0$.",
      "Limit $=\\frac{1}{3}$."
    ],
    "trap": "Getting distracted by the $5x$ in the numerator and thinking the answer involves $5$; as $x\\to\\infty$ only the highest-degree terms matter.",
    "check": "Plug in $x=1000$: $\\frac{1005000}{3000001}\\approx 0.335$, close to $\\frac{1}{3}$."
  },
  "fd-lim-009": {
    "spot": "$\\frac{e^{5x}-1}{x}$: the standard form \"exponential minus $1$ over $x$\", with an extra factor of $5$ inside.",
    "why": "Use $\\lim_{u\\to 0}\\frac{e^u-1}{u}=1$ and pull the factor out; it is also just the derivative of $e^{5x}$ at $0$.",
    "steps": [
      "$\\frac{e^{5x}-1}{x}=5\\cdot\\frac{e^{5x}-1}{5x}$.",
      "$\\frac{e^u-1}{u}\\to 1$.",
      "Limit $=5$."
    ],
    "trap": "Thinking $e^{5x}-1\\approx 5$, or simply declaring that $\\frac{0}{0}$ does not exist; the correct approximation is $e^{5x}-1\\approx 5x$.",
    "check": "It is the derivative of $e^{5x}$ at $x=0$: $5e^0=5$."
  },
  "fd-lim-010": {
    "spot": "$\\frac{\\ln(1+4x)}{x}$: the standard form $\\ln(1+u)\\approx u$ with $u=4x$.",
    "why": "Build $\\frac{\\ln(1+u)}{u}\\to 1$ and pull the factor out; it is also the derivative of $\\ln(1+4x)$ at $0$.",
    "steps": [
      "$\\frac{\\ln(1+4x)}{x}=4\\cdot\\frac{\\ln(1+4x)}{4x}$.",
      "$\\frac{\\ln(1+u)}{u}\\to 1$.",
      "Limit $=4$."
    ],
    "trap": "Splitting it up wildly, like $\\ln(1+4x)\\approx\\ln 4+\\ln x$; $\\ln$ does not split over addition.",
    "check": "It is the derivative of $\\ln(1+4x)$ at $0$: $\\frac{4}{1+0}=4$."
  },
  "fd-lim-011": {
    "spot": "Numerator $\\sqrt x-3$, denominator $x-9$: $x-9=(\\sqrt x-3)(\\sqrt x+3)$, so view the denominator as a difference of squares and cancel.",
    "why": "Faster than multiplying by the conjugate: factor $x-9$ directly and cancel $\\sqrt x-3$.",
    "steps": [
      "Plug in $x=9$: numerator $3-3=0$, denominator $0$ — it is $\\frac{0}{0}$.",
      "$x-9=(\\sqrt x-3)(\\sqrt x+3)$; cancel to leave $\\frac{1}{\\sqrt x+3}$.",
      "Plug in $x=9$: $\\frac{1}{3+3}=\\frac{1}{6}$."
    ],
    "trap": "After canceling, writing $\\sqrt x-3$ instead of $\\sqrt x+3$ and getting a $0$ denominator again.",
    "check": "This is the derivative of $\\sqrt x$ at $x=9$: $\\frac{1}{2\\sqrt 9}=\\frac{1}{6}$."
  },
  "fd-ser-009": {
    "spot": "A finite sum up to $n=4$, and a geometric sequence with ratio $2$: add the five terms directly, or use $\\frac{2^5-1}{2-1}$.",
    "why": "With so few terms, adding directly is safest; the formula serves as a check.",
    "steps": [
      "List the terms: $2^0,2^1,2^2,2^3,2^4=1,2,4,8,16$.",
      "Add: $1+2+4+8+16=31$.",
      "Check with the geometric formula: $\\frac{2^5-1}{2-1}=31$. Answer: $31$."
    ],
    "trap": "Starting from $n=1$ and missing $2^0=1$, getting $30$.",
    "check": "In binary: $11111_2=31$."
  },
  "fd-ser-011": {
    "spot": "$\\left(\\frac{9}{10}\\right)^n$ is a geometric series with ratio $\\frac{9}{10}$, whose absolute value is less than $1$.",
    "why": "For a geometric series only the ratio matters: $|r|<1$ converges, $|r|\\ge 1$ diverges.",
    "steps": [
      "Ratio $r=\\frac{9}{10}$.",
      "$|r|<1$, and the sum $=\\frac{9/10}{1-9/10}=9$, a finite number.",
      "So the series converges."
    ],
    "trap": "Seeing a ratio very close to $1$ and assuming divergence; as long as it is strictly less than $1$ the series converges, just more slowly.",
    "check": "The first fifty terms sum to about $8.95$, approaching $9$."
  },
  "fd-ser-012": {
    "spot": "$\\left(\\frac{3}{2}\\right)^n$: a geometric series with ratio $\\frac{3}{2}>1$; the terms themselves keep growing.",
    "why": "The $n$-th term does not go to $0$, so the $n$-th term test (Divergence Test) settles divergence immediately.",
    "steps": [
      "Ratio $r=\\frac{3}{2}>1$.",
      "The terms $\\left(\\frac{3}{2}\\right)^n$ keep growing and do not go to $0$ (the $20$-th term already exceeds $3000$).",
      "The terms do not go to $0$, so the series diverges."
    ],
    "trap": "Forcing the geometric formula $\\frac{r}{1-r}=-3$ and getting a negative \"sum\"; the formula only holds for $|r|<1$.",
    "check": "The first ten terms already sum to more than $100$, and every term is positive and growing."
  },
  "fd-ser-013": {
    "spot": "The general term $\\frac{1}{n^3}$ has the form $\\frac{1}{n^p}$: a $p$-series with power $p=3$, greater than one.",
    "why": "A $p$-series $\\sum\\frac{1}{n^p}$ converges if and only if $p>1$; the Integral Test proves it.",
    "steps": [
      "$\\frac{1}{x^3}$ is positive and decreasing for $x\\ge 1$, so the Integral Test applies.",
      "$\\int_1^\\infty\\frac{dx}{x^3}=\\left[-\\frac{1}{2x^2}\\right]_1^\\infty=\\frac{1}{2}$, finite.",
      "The integral is finite, so the series converges (sum about $1.202$)."
    ],
    "trap": "Remembering the $p$-series condition as $p\\ge 1$; $p=1$ is the harmonic series, which diverges.",
    "check": "The sum is bigger than the first term $1$ and smaller than $1+\\int_1^\\infty\\frac{dx}{x^3}=1.5$."
  },
  "int-030": {
    "spot": "$\\sin^3x$ times $\\cos x$: $\\cos x$ is exactly the derivative of $\\sin x$, so $u=\\sin x$ leaves just $u^3$.",
    "why": "A single (odd) power of $\\cos$ serves as $du$, much faster than power-reduction formulas.",
    "steps": [
      "Let $u=\\sin x$, $du=\\cos x\\,dx$; $x:0\\to\\frac{\\pi}{2}$ corresponds to $u:0\\to 1$.",
      "The integral becomes $\\int_0^1 u^3\\,du=\\frac{1}{4}$.",
      "Answer: $\\frac{1}{4}$."
    ],
    "trap": "Keeping the limits $0$ and $\\frac{\\pi}{2}$ after substituting, getting $\\frac{(\\pi/2)^4}{4}\\approx 1.52$.",
    "check": "The antiderivative $\\frac{\\sin^4x}{4}$ is $\\frac{1}{4}$ at $\\frac{\\pi}{2}$ and $0$ at $0$."
  },
  "lim-001": {
    "spot": "The most basic trig limit, $\\frac{\\sin x}{x}$; plugging in $0$ gives $\\frac{0}{0}$.",
    "why": "Geometrically, use the Squeeze Theorem: $\\cos x\\le\\frac{\\sin x}{x}\\le 1$. Using L'Hôpital's Rule would be circular (the derivative of $\\sin$ itself relies on this limit).",
    "steps": [
      "For $0<x<\\frac{\\pi}{2}$, comparing areas in the unit circle gives $\\cos x\\le\\frac{\\sin x}{x}\\le 1$.",
      "As $x\\to 0$, $\\cos x\\to 1$.",
      "Squeeze: the limit $=1$."
    ],
    "trap": "Thinking $\\frac{0}{0}$ means $0$ or \"does not exist\".",
    "check": "Plug in $x=0.01$: $\\frac{\\sin 0.01}{0.01}\\approx 0.99998$."
  },
  "mob-conv-006": {
    "spot": "There is an $n!$ in the denominator: factorials grow faster than any exponential like $2^n$, a textbook Ratio Test case.",
    "why": "Divide consecutive terms and the factorials cancel down to $n+1$; the ratio limit is obvious.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{2^{n+1}}{(n+1)!}\\cdot\\frac{n!}{2^n}=\\frac{2}{n+1}$.",
      "As $n\\to\\infty$, $\\frac{2}{n+1}\\to 0$.",
      "The ratio limit is $0<1$, so the series converges (its sum is actually $e^2-1$)."
    ],
    "trap": "Seeing exponential growth $2^n$ in the numerator and assuming divergence; the $n!$ in the denominator grows faster.",
    "check": "It is $e^x=\\sum\\frac{x^n}{n!}$ at $x=2$ minus the $n=0$ term: $e^2-1\\approx 6.39$."
  },
  "rel-basic-004": {
    "spot": "$\\frac{\\ln(1+2x)}{x}$: the standard form $\\ln(1+u)\\approx u$ with $u=2x$.",
    "why": "Build $\\frac{\\ln(1+u)}{u}\\to 1$ and pull out the factor $2$.",
    "steps": [
      "$\\frac{\\ln(1+2x)}{x}=2\\cdot\\frac{\\ln(1+2x)}{2x}$.",
      "$\\frac{\\ln(1+u)}{u}\\to 1$.",
      "Limit $=2$."
    ],
    "trap": "Putting the factor in the wrong place and answering $\\frac{1}{2}$.",
    "check": "It is the derivative of $\\ln(1+2x)$ at $0$: $\\frac{2}{1}=2$."
  },
  "rel-basic-013": {
    "spot": "A definite integral of the single power $x^2$: antiderivative $\\frac{x^3}{3}$, then plug in the limits.",
    "why": "Fundamental Theorem of Calculus, one step.",
    "steps": [
      "Antiderivative: $\\frac{x^3}{3}$.",
      "Plug in the limits: $\\frac{1}{3}-0$.",
      "Answer: $\\frac{1}{3}$."
    ],
    "trap": "Writing the antiderivative as $\\frac{x^3}{2}$ or $2x$ (mixing up integration and differentiation).",
    "check": "The curve $x^2$ lies below the diagonal on $[0,1]$, so the area is smaller than that triangle's (area $\\frac{1}{2}$)."
  },
  "rel-basic-014": {
    "spot": "$\\sin x$ on $[0,\\pi]$ is exactly one full arch: antiderivative $-\\cos x$, then plug in the limits.",
    "why": "Fundamental Theorem of Calculus; $\\sin$ is positive on this whole interval, so the answer is the area of the arch.",
    "steps": [
      "Antiderivative: $-\\cos x$.",
      "$-\\cos\\pi-(-\\cos 0)=1+1$.",
      "Answer: $2$."
    ],
    "trap": "Using $\\cos x$ as the antiderivative (missing the minus) and getting $-2$; the area is above the $x$-axis, so it cannot be negative.",
    "check": "The arch has height $1$ and width $\\pi$, so the area lies between the inscribed triangle $\\frac{\\pi}{2}$ and the enclosing rectangle $\\pi$."
  },
  "rel-basic-015": {
    "spot": "$e^{2x}$: there is a factor $2$ in the exponent, so the antiderivative is divided by $2$.",
    "why": "Reverse Chain Rule: $\\int e^{ax}dx=\\frac{1}{a}e^{ax}$; differentiating back shows why you divide by the factor.",
    "steps": [
      "Antiderivative: $\\frac{1}{2}e^{2x}$.",
      "Plug in the limits: $\\frac{e^2}{2}-\\frac{1}{2}=\\frac{e^2-1}{2}$.",
      "Answer: $\\frac{e^2-1}{2}\\approx 3.19$."
    ],
    "trap": "Forgetting to divide by $2$ and getting $e^2-1\\approx 6.39$; or treating the lower-limit value $e^0$ as $0$ and getting $\\frac{e^2}{2}$.",
    "check": "On $[0,1]$ the integrand grows from $1$ to $e^2\\approx 7.39$, so an area of about $3.19$ is reasonable."
  },
  "tmpl-der-simple-power-001": {
    "spot": "A constant times a single power, $4x^3$: Power Rule — bring the exponent down and lower it by one.",
    "why": "The constant $4$ stays put; only $x^3$ gets differentiated.",
    "steps": [
      "$(x^3)'=3x^2$.",
      "Multiply by the constant $4$: $4\\cdot 3x^2=12x^2$.",
      "Answer: $12x^2$."
    ],
    "trap": "Not lowering the exponent and writing $12x^3$.",
    "check": "At $x=1$: the secant $\\frac{4(1.001)^3-4}{0.001}\\approx 12.01$."
  },
  "tmpl-der-sin-001": {
    "spot": "$\\sin$ wrapped around $2x$: the outer part becomes $\\cos 2x$, the inner part gives a $2$.",
    "why": "A composite function means the Chain Rule: outer derivative times inner derivative, in one step.",
    "steps": [
      "Outer: $(\\sin u)'=\\cos u$.",
      "Inner: $(2x)'=2$.",
      "Multiply: $2\\cos 2x$."
    ],
    "trap": "Dropping the inner $2$ and writing $\\cos 2x$.",
    "check": "Plug in $x=0$: $\\sin 2x\\approx 2x$, slope $2$; the formula gives $2\\cos 0=2$."
  },
  "tmpl-lim-direct-002": {
    "spot": "$5x+4$ is a polynomial, continuous everywhere: the limit is just the value.",
    "why": "For a continuous function the limit equals the function value; no technique needed.",
    "steps": [
      "A polynomial is continuous at $x=2$.",
      "Plug in $x=2$: $5\\cdot 2+4=14$.",
      "Answer: $14$."
    ],
    "trap": "Thinking a \"limit\" always needs some special method; if you can plug in directly and do not get $\\frac{0}{0}$, you are done.",
    "check": "Plug in $x=2.01$: $14.05$, very close to $14$."
  }
};
