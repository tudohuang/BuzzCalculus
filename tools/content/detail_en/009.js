// Detail v2, English — batch 009. Translation of tools/content/detail/009.js (text only; claims live in the Chinese file).
module.exports = {
  "dd-rr-013": {
    "spot": "You're given the rate of change of the side, $\\frac{ds}{dt}=2$, and asked for the rate of change of the volume — both change with time, linked by $V=s^3$: related rates, differentiate in $t$ with the Chain Rule.",
    "why": "Writing $V$ as a function of $s$ and then differentiating in $t$ is most direct; plugging in $s=10$ before differentiating wipes out the variable and gives $0$.",
    "steps": [
      "Relation between volume and side: $V=s^3$.",
      "Differentiate both sides in $t$ (Chain Rule): $\\frac{dV}{dt}=3s^2\\frac{ds}{dt}$.",
      "Plug in $s=10$, $\\frac{ds}{dt}=2$: $\\frac{dV}{dt}=3\\cdot 100\\cdot 2=600$ cubic centimeters per second."
    ],
    "trap": "Plugging $s=10$ into $V=s^3$ first to get $1000$ and then differentiating, which gives $0$; or forgetting to multiply by $\\frac{ds}{dt}$ and answering $300$.",
    "check": "Rough estimate: one second later the side is $12$ and the volume goes from $1000$ to $1728$, an average of $728$ per second; the instantaneous rate $600$ is smaller, which makes sense (the volume grows faster and faster)."
  },
  "depth-int-008": {
    "spot": "The denominator has both $x$ and $\\ln x$: $\\frac{1}{x}$ is exactly the derivative of $\\ln x$, so the integrand is \"$(\\ln x)^{-1/2}$ times its inner derivative\" — substitute $u=\\ln x$.",
    "why": "After substituting, only the power integral of $u^{-1/2}$ is left; integration by parts would just make a bigger mess.",
    "steps": [
      "Let $u=\\ln x$, $du=\\frac{1}{x}dx$.",
      "The integral becomes $\\int u^{-1/2}\\,du$.",
      "Power rule: $\\int u^{-1/2}du=2u^{1/2}+C$.",
      "Back to $x$: $2\\sqrt{\\ln x}+C$."
    ],
    "trap": "Computing $\\int u^{-1/2}du$ as $\\frac{1}{2}u^{1/2}$ (after raising the exponent, forgetting that dividing by $\\frac{1}{2}$ means multiplying by $2$).",
    "check": "Differentiate back: $\\frac{d}{dx}2\\sqrt{\\ln x}=\\frac{2}{2\\sqrt{\\ln x}}\\cdot\\frac{1}{x}$, exactly the integrand."
  },
  "depth-int-010": {
    "spot": "The denominator has $\\sqrt{x}$, and the other factor is $1+\\sqrt{x}$: $\\frac{1}{\\sqrt{x}}$ is exactly twice the derivative of $\\sqrt{x}$ — substitute $u=1+\\sqrt{x}$ (or $u=\\sqrt{x}$).",
    "why": "Once the root is gone it becomes $\\int\\frac{2}{u}du$; without substituting you can't see it's a logarithm.",
    "steps": [
      "Let $u=1+\\sqrt{x}$, $du=\\frac{1}{2\\sqrt{x}}dx$, so $\\frac{dx}{\\sqrt{x}}=2\\,du$.",
      "The integral becomes $\\int\\frac{2}{u}du$.",
      "$\\int\\frac{2}{u}du=2\\ln|u|+C$.",
      "Back to $x$ (since $1+\\sqrt{x}>0$, the absolute value can go): $2\\ln(1+\\sqrt{x})+C$."
    ],
    "trap": "Forgetting the $2$ in $\\frac{dx}{\\sqrt{x}}=2\\,du$ and answering $\\ln(1+\\sqrt{x})$.",
    "check": "Differentiate back: $2\\cdot\\frac{1}{1+\\sqrt{x}}\\cdot\\frac{1}{2\\sqrt{x}}$, exactly the integrand."
  },
  "gap-der-ode-003": {
    "spot": "Of the form $y'+P(x)y=Q(x)$ with constant $P=1$: a first-order linear equation; multiply by the integrating factor $e^{\\int 1\\,dx}=e^x$ to turn the left side into $(e^xy)'$.",
    "why": "The integrating factor collapses the left side into a single derivative in one step; guessing a particular solution plus the homogeneous solution also works but takes two parts to combine.",
    "steps": [
      "Multiply by $e^x$: $e^xy'+e^xy=(e^xy)'$, and the right side becomes $e^x\\cdot e^x=e^{2x}$.",
      "Integrate both sides: $e^xy=\\frac{e^{2x}}{2}+C$.",
      "Initial value $y(0)=0$: $0=\\frac{1}{2}+C$, so $C=-\\frac{1}{2}$.",
      "$y=e^{-x}\\cdot\\frac{e^{2x}-1}{2}=\\frac{e^x-e^{-x}}{2}$ (which is $\\sinh x$)."
    ],
    "trap": "Forgetting $C$ after integrating and writing $y=\\frac{e^x}{2}$: it satisfies the equation but $y(0)=\\frac{1}{2}\\ne 0$.",
    "check": "Substitute back: $y'+y=\\frac{e^x+e^{-x}}{2}+\\frac{e^x-e^{-x}}{2}=e^x$, and $y(0)=0$."
  },
  "gap-int-polar-002": {
    "spot": "Area enclosed by a polar curve: the formula $A=\\frac{1}{2}\\int r^2\\,d\\theta$. $r=\\sin\\theta$ traces exactly one loop for $0\\le\\theta\\le\\pi$ — it's actually a circle of diameter $1$.",
    "why": "Integrating with the formula is the safest; recognizing the circle gives a one-line check.",
    "steps": [
      "$A=\\frac{1}{2}\\int_0^{\\pi}\\sin^2\\theta\\,d\\theta$.",
      "Power reduction: $\\sin^2\\theta=\\frac{1-\\cos 2\\theta}{2}$.",
      "$\\int_0^\\pi\\frac{1-\\cos 2\\theta}{2}d\\theta=\\frac{\\pi}{2}$ ($\\cos 2\\theta$ integrates to $0$ over a full period).",
      "$A=\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{4}$."
    ],
    "trap": "Integrating from $0$ to $2\\pi$: from $\\pi$ to $2\\pi$, $r=\\sin\\theta$ retraces the same circle, doubling the answer to $\\frac{\\pi}{2}$.",
    "check": "In Cartesian coordinates $r=\\sin\\theta$ is $x^2+\\left(y-\\frac{1}{2}\\right)^2=\\frac{1}{4}$, a circle of radius $\\frac{1}{2}$, with area $\\pi\\cdot\\frac{1}{4}$."
  },
  "gap-tech-004": {
    "spot": "The integrand is \"polynomial $x$ × $\\ln x$\": $\\ln x$ has no easy antiderivative on its own, but its derivative $\\frac{1}{x}$ is clean — let $\\ln x$ be $u$ and integrate by parts.",
    "why": "Substituting $u=\\ln x$ produces $e^{2u}u$, which still needs integration by parts; integrating by parts directly finishes in one round.",
    "steps": [
      "Take $u=\\ln x$, $dv=x\\,dx$: $du=\\frac{dx}{x}$, $v=\\frac{x^2}{2}$.",
      "$\\int x\\ln x\\,dx=\\frac{x^2}{2}\\ln x-\\int\\frac{x^2}{2}\\cdot\\frac{1}{x}dx=\\frac{x^2}{2}\\ln x-\\frac{x^2}{4}+C$.",
      "So the technique to use is integration by parts."
    ],
    "trap": "Choosing it the other way, $u=x$ and $dv=\\ln x\\,dx$: you'd need to integrate $\\ln x$ first, and the new integral $\\int(x\\ln x-x)dx$ is harder than the original. By the LIATE order, logs come first as $u$."
  },
  "gap-tech-005": {
    "spot": "The coefficient is $\\left(\\frac{n}{n+1}\\right)^n$ — the whole term is \"something to the $n$-th power\", so taking the $n$-th root makes the exponent vanish: Root Test.",
    "why": "The Ratio Test would have to deal with something like $\\frac{(n+1)^{2n+1}}{n^n(n+2)^{n+1}}$; the Root Test leaves just $\\frac{n}{n+1}|x|$ after taking the root.",
    "steps": [
      "Take the $n$-th root: $\\sqrt[n]{\\left|\\left(\\frac{n}{n+1}\\right)^nx^n\\right|}=\\frac{n}{n+1}|x|$.",
      "As $n\\to\\infty$: $\\frac{n}{n+1}\\to 1$, so the limit is $|x|$; it converges for $|x|<1$, radius of convergence $1$.",
      "At the endpoints $x=\\pm1$, the terms have absolute value $\\left(\\frac{n}{n+1}\\right)^n\\to\\frac{1}{e}\\ne 0$; the general term doesn't go to $0$, so it diverges.",
      "So the technique to use is the Root Test."
    ],
    "trap": "Seeing $\\left(\\frac{n}{n+1}\\right)^n\\to\\frac{1}{e}$ and treating the coefficient as a constant with radius $e$ — the radius comes from the limit of the $n$-th root of the coefficient, and $\\left(\\frac{1}{e}\\right)^{1/n}\\to 1$."
  },
  "hc-usub-001": {
    "spot": "Under the root is $1+x^2$, and the numerator $x^3=x^2\\cdot x$: split off one $x\\,dx$ for $du$ and write the remaining $x^2$ as $u-1$ — substitute $u=1+x^2$.",
    "why": "Trigonometric substitution $x=\\tan\\theta$ also works but produces $\\tan^3\\theta\\sec\\theta$; $u=1+x^2$ turns it straight into power integrals.",
    "steps": [
      "Let $u=1+x^2$, $du=2x\\,dx$, $x^2=u-1$.",
      "$\\int\\frac{x^2\\cdot x\\,dx}{\\sqrt{1+x^2}}=\\int\\frac{u-1}{2\\sqrt{u}}du=\\frac{1}{2}\\int\\left(u^{1/2}-u^{-1/2}\\right)du$.",
      "$=\\frac{1}{2}\\left(\\frac{2}{3}u^{3/2}-2u^{1/2}\\right)=\\frac{1}{3}u^{3/2}-u^{1/2}+C$.",
      "Substitute back: $\\frac{(1+x^2)^{3/2}}{3}-\\sqrt{1+x^2}+C$."
    ],
    "trap": "Replacing only the root and not rewriting $x^2$ as $u-1$, leaving an integral with $x$ and $u$ mixed together.",
    "check": "Differentiating back should give $\\frac{x^3}{\\sqrt{1+x^2}}$."
  },
  "hc-usub-006": {
    "spot": "Under the root is $1+e^x$, and outside it is multiplied by exactly $e^x$ — its derivative: substitute $u=1+e^x$.",
    "why": "After substituting, only $\\int\\sqrt{u}\\,du$ is left; integration by parts isn't needed at all here.",
    "steps": [
      "Let $u=1+e^x$, $du=e^x\\,dx$.",
      "The integral becomes $\\int\\sqrt{u}\\,du$.",
      "$\\int u^{1/2}du=\\frac{2}{3}u^{3/2}+C$.",
      "Substitute back: $\\frac{2}{3}(1+e^x)^{3/2}+C$."
    ],
    "trap": "Writing the power integral as $\\frac{3}{2}u^{3/2}$: the exponent goes up to $\\frac{3}{2}$, so the coefficient is divided by $\\frac{3}{2}$, i.e. multiplied by $\\frac{2}{3}$.",
    "check": "Differentiate back: $\\frac{2}{3}\\cdot\\frac{3}{2}(1+e^x)^{1/2}\\cdot e^x$."
  },
  "hc-usub-008": {
    "spot": "Denominator $(1+x^2)^3$, numerator $x^3=x^2\\cdot x$: $x\\,dx$ goes to $du$ and $x^2=u-1$ — substitute $u=1+x^2$, and for a definite integral remember to change the limits.",
    "why": "After substituting you get powers $u^{-2}$, $u^{-3}$; doing partial fractions directly with a triple repeated factor in the denominator is painful.",
    "steps": [
      "Let $u=1+x^2$, $du=2x\\,dx$; $x=0\\to u=1$, $x=1\\to u=2$.",
      "$\\int_0^1\\frac{x^3}{(1+x^2)^3}dx=\\frac{1}{2}\\int_1^2\\frac{u-1}{u^3}du=\\frac{1}{2}\\int_1^2\\left(u^{-2}-u^{-3}\\right)du$.",
      "Antiderivative $-\\frac{1}{u}+\\frac{1}{2u^2}$; at $2$ it's $-\\frac{3}{8}$, at $1$ it's $-\\frac{1}{2}$, so the difference is $\\frac{1}{8}$.",
      "Multiply by $\\frac{1}{2}$: the answer is $\\frac{1}{16}$."
    ],
    "trap": "Changing the variable but not the limits, plugging $0$ and $1$ into the $u$-antiderivative, and getting the wrong number.",
    "check": "The integrand is increasing on $[0,1]$ with maximum $\\frac{1}{8}$ at $x=1$, so the area must be less than $\\frac{1}{8}$; $\\frac{1}{16}$ is reasonable."
  },
  "hc-usub-009": {
    "spot": "The numerator $\\sin x\\cos x$ is exactly half the derivative of $\\sin^2x$, and the denominator only involves $\\sin^2x$ — substitute $u=\\sin^2x$ (or $u=1+\\sin^2x$).",
    "why": "After substituting it's the power integral $\\int\\frac{du}{2(1+u)^2}$; rewriting with double-angle formulas would only scramble the denominator.",
    "steps": [
      "Let $u=\\sin^2x$, $du=2\\sin x\\cos x\\,dx$; $x=0\\to u=0$, $x=\\frac{\\pi}{2}\\to u=1$.",
      "The integral becomes $\\frac{1}{2}\\int_0^1\\frac{du}{(1+u)^2}$.",
      "$\\int_0^1\\frac{du}{(1+u)^2}=\\left[-\\frac{1}{1+u}\\right]_0^1=-\\frac{1}{2}+1=\\frac{1}{2}$.",
      "Multiply by $\\frac{1}{2}$ to get $\\frac{1}{4}$."
    ],
    "trap": "Missing the $2$ in $du=2\\sin x\\cos x\\,dx$ and answering $\\frac{1}{2}$.",
    "check": "The integrand is at most $\\frac{1}{2}$, the interval has length $\\frac{\\pi}{2}$, and it's $0$ at both ends: $\\frac{1}{4}$ is the right size."
  },
  "hc-usub-010": {
    "spot": "The exponent is $x^3$ and outside there's $x^2$ — the derivative of $x^3$ (up to a factor $3$): substitute $u=x^3$; then $\\frac{e^u}{1+e^u}$ has \"the derivative of the denominator on top\" and integrates to a log.",
    "why": "Both layers are \"numerator is the derivative of the denominator (or inner function)\", so just substitute in succession; no need to expand $e^{x^3}$.",
    "steps": [
      "Let $u=x^3$, $du=3x^2\\,dx$; limits $0\\to 0$, $1\\to 1$.",
      "The integral becomes $\\frac{1}{3}\\int_0^1\\frac{e^u}{1+e^u}du$.",
      "The antiderivative of $\\frac{e^u}{1+e^u}$ is $\\ln(1+e^u)$.",
      "$\\frac{1}{3}\\left[\\ln(1+e)-\\ln 2\\right]=\\frac{1}{3}\\ln\\frac{1+e}{2}$."
    ],
    "trap": "Evaluating the lower limit as $\\ln(1+e^0)=0$: $e^0=1$, so the lower limit gives $\\ln 2$, not $0$.",
    "check": "The value is about $0.2067$; the integrand stays between $0$ and $0.74$ on $[0,1]$, so this is reasonable."
  },
  "mob-nabla-001": {
    "spot": "$\\nabla\\cdot$ is divergence: differentiate each component with respect to \"its own\" coordinate and add. In the vector field $\\langle x,y,z\\rangle$, each component is its own coordinate.",
    "why": "Compute the three terms from the definition and you're done; no theorems needed.",
    "steps": [
      "$\\nabla\\cdot\\langle P,Q,R\\rangle=\\frac{\\partial P}{\\partial x}+\\frac{\\partial Q}{\\partial y}+\\frac{\\partial R}{\\partial z}$.",
      "$\\frac{\\partial x}{\\partial x}=1$, $\\frac{\\partial y}{\\partial y}=1$, $\\frac{\\partial z}{\\partial z}=1$.",
      "Add them to get $3$."
    ],
    "trap": "Mixing up divergence and gradient and answering the vector $\\langle 1,1,1\\rangle$: divergence is a scalar.",
    "check": "Geometric meaning: for a field pointing outward from the origin, the outflow per unit volume is $3$ everywhere (in $n$ dimensions it's $n$)."
  },
  "mob-nabla-005": {
    "spot": "Curl applied to a gradient: every component of $\\nabla\\times(\\nabla f)$ is \"a difference of two mixed partials\", e.g. $f_{zy}-f_{yz}$ — mixed partials can be taken in either order, so everything cancels.",
    "why": "Writing out one component reveals the structure; no need to pick an actual $f$ and compute.",
    "steps": [
      "$\\nabla f=\\langle f_x,f_y,f_z\\rangle$; the $x$-component of the curl is $\\frac{\\partial f_z}{\\partial y}-\\frac{\\partial f_y}{\\partial z}=f_{zy}-f_{yz}$.",
      "As long as the second partials of $f$ are continuous, mixed partials commute (Clairaut's theorem): $f_{zy}=f_{yz}$. For example, $f=x^2yz^3$.",
      "The other two components, $f_{xz}-f_{zx}$ and $f_{yx}-f_{xy}$, are likewise $0$.",
      "So $\\nabla\\times(\\nabla f)=\\mathbf{0}$."
    ],
    "trap": "Confusing it with $\\nabla\\cdot(\\nabla f)=\\nabla^2 f$ (the Laplacian) — that one is generally not $0$.",
    "check": "Physical intuition: a gradient field is conservative, so the work around any closed loop is $0$ — there's no rotation."
  },
  "rel-adv-009": {
    "spot": "The exponent is $x^2$ and in front $x^3=x^2\\cdot x$: split off $x\\,dx$ for $du$; after substituting $u=x^2$ it becomes $\\frac{1}{2}\\int ue^u\\,du$, then integrate by parts once.",
    "why": "Integrating by parts directly with $dv=xe^{x^2}dx$ also works, but substituting first reduces it to the most standard $\\int ue^u du$, which is harder to get wrong.",
    "steps": [
      "Let $u=x^2$, $du=2x\\,dx$: $\\int x^2e^{x^2}\\,x\\,dx=\\frac{1}{2}\\int ue^u\\,du$.",
      "Integration by parts: $\\int ue^u\\,du=ue^u-\\int e^u du=(u-1)e^u+C$.",
      "Multiply by $\\frac{1}{2}$ and go back to $x$: $\\frac{e^{x^2}(x^2-1)}{2}+C$."
    ],
    "trap": "Trying to hand all of $x^3$ to $du$ — $du=2x\\,dx$ only absorbs one $x$; the remaining $x^2$ must be rewritten in terms of $u$.",
    "check": "Differentiate back: $xe^{x^2}(x^2-1)+xe^{x^2}=x^3e^{x^2}$."
  },
  "rel-adv-010": {
    "spot": "Inside the $\\ln$ is $1+x^2$, and outside there's $x$ — its derivative (up to a factor $2$): substitute $u=1+x^2$, leaving $\\frac{1}{2}\\int\\ln u\\,du$.",
    "why": "Substituting first and then integrating $\\ln u$ means remembering just one formula; integrating by parts directly with $u=\\ln(1+x^2)$ also works but costs an extra rational-function integral.",
    "steps": [
      "Let $u=1+x^2$, $du=2x\\,dx$: the integral becomes $\\frac{1}{2}\\int\\ln u\\,du$.",
      "$\\int\\ln u\\,du=u\\ln u-u+C$ (integration by parts).",
      "Multiply by $\\frac{1}{2}$ and substitute back: $\\frac{(1+x^2)\\ln(1+x^2)}{2}-\\frac{1+x^2}{2}+C$."
    ],
    "trap": "Writing $\\int\\ln u\\,du$ as $\\frac{1}{u}$ — that's the derivative of $\\ln u$, not its antiderivative.",
    "check": "Differentiate back: $x\\ln(1+x^2)+x-x=x\\ln(1+x^2)$."
  },
  "rel-adv-018": {
    "spot": "Top degree $n^2$ in the numerator, $n^3$ in the denominator: the general term looks like $\\frac{3}{n}$ — the same order as the harmonic series, so use the Limit Comparison Test.",
    "why": "For a series of rational functions, only the difference in top degrees matters; a difference of one puts it in the harmonic-series family, which diverges.",
    "steps": [
      "Keep the top-degree terms: $\\frac{3n^2+1}{n^3+n}\\approx\\frac{3n^2}{n^3}=\\frac{3}{n}$, and compare with $b_n=\\frac{1}{n}$.",
      "Limit comparison: $\\lim\\frac{a_n}{b_n}=3$, a finite positive number, so the two series converge or diverge together.",
      "$\\sum\\frac{1}{n}$ is the harmonic series ($p=1$), which diverges. You can also see directly that $a_n>\\frac{1}{n}$.",
      "So this series diverges."
    ],
    "trap": "Seeing the general term go to $0$ and assuming convergence: $a_n\\to 0$ is only a necessary condition — $\\frac{1}{n}$ also goes to $0$ yet diverges.",
    "check": "The partial sums grow slowly like $3\\ln N$, with no upper bound."
  },
  "uni-int-013": {
    "spot": "The numerator degree $3$ is higher than the denominator degree $2$: do long division first, $\\frac{x^3}{1+x^2}=x-\\frac{x}{1+x^2}$; in the leftover term the numerator is half the derivative of the denominator.",
    "why": "After long division both terms integrate at a glance; substituting $u=1+x^2$ also works but then you have to split $\\frac{u-1}{u}$.",
    "steps": [
      "Long division: $x^3=x(1+x^2)-x$, so $\\frac{x^3}{1+x^2}=x-\\frac{x}{1+x^2}$.",
      "$\\int_0^1x\\,dx=\\frac{1}{2}$.",
      "$\\int_0^1\\frac{x}{1+x^2}dx=\\left[\\frac{1}{2}\\ln(1+x^2)\\right]_0^1=\\frac{\\ln 2}{2}$.",
      "Subtract: $\\frac{1}{2}-\\frac{\\ln 2}{2}$."
    ],
    "trap": "Skipping the long division and treating it as the $\\frac{1}{2}\\ln(1+x^2)$ type — the numerator is $x^3$, not $x$, so it doesn't match the denominator's derivative.",
    "check": "The value is about $0.153$; the integrand rises from $0$ to $\\frac{1}{2}$ on $[0,1]$, so the area should be below $\\frac{1}{4}$ — reasonable."
  },
  "uni-int-020": {
    "spot": "The denominator is an irreducible quadratic (discriminant $1-4<0$) and the numerator is a constant: complete the square into \"square + constant\" and go for $\\arctan$.",
    "why": "The denominator doesn't factor over the reals, so partial fractions won't work; after completing the square apply $\\int\\frac{du}{u^2+a^2}=\\frac{1}{a}\\arctan\\frac{u}{a}$ directly.",
    "steps": [
      "Complete the square: $x^2+x+1=\\left(x+\\frac{1}{2}\\right)^2+\\frac{3}{4}$, $a=\\frac{\\sqrt3}{2}$.",
      "Antiderivative $\\frac{2}{\\sqrt3}\\arctan\\frac{2x+1}{\\sqrt3}$.",
      "Upper limit: $\\arctan\\sqrt3=\\frac{\\pi}{3}$; lower limit: $\\arctan\\frac{1}{\\sqrt3}=\\frac{\\pi}{6}$.",
      "$\\frac{2}{\\sqrt3}\\left(\\frac{\\pi}{3}-\\frac{\\pi}{6}\\right)=\\frac{\\pi}{3\\sqrt3}$."
    ],
    "trap": "Forgetting the factor $\\frac{1}{a}=\\frac{2}{\\sqrt3}$ in front and answering $\\frac{\\pi}{6}$.",
    "check": "The integrand falls from $1$ to $\\frac{1}{3}$, so the area should be between $\\frac{1}{3}$ and $1$; $\\frac{\\pi}{3\\sqrt3}\\approx 0.605$."
  },
  "uni-ser-019": {
    "spot": "The coefficient $\\frac{1}{\\sqrt n}$ is a power of $n$: the ratio of consecutive terms $\\sqrt{\\frac{n}{n+1}}\\to 1$ — the Ratio Test gives the radius directly.",
    "why": "The Ratio Test finishes in one line; power-type coefficients don't affect the radius, only the endpoints.",
    "steps": [
      "$a_n=\\frac{1}{\\sqrt n}$, $\\left|\\frac{a_{n+1}}{a_n}\\right|=\\sqrt{\\frac{n}{n+1}}$.",
      "As $n\\to\\infty$ this ratio tends to $1$.",
      "Radius of convergence $R=\\frac{1}{1}=1$."
    ],
    "trap": "Using the limit of the coefficient, $\\frac{1}{\\sqrt n}\\to 0$, as the ratio and answering $R=\\infty$ — you have to compare consecutive terms.",
    "check": "Endpoints: $x=1$ gives a p-series with $p=\\frac{1}{2}$, which diverges; $x=-1$ gives an alternating series, which converges. The radius itself is $1$."
  },
  "ap-work-002": {
    "spot": "The spring force $F=kx$ changes with the stretch: work by a variable force needs the integral $W=\\int F\\,dx$, with limits from stretch $0.1$ to $0.3$.",
    "why": "The force isn't constant, so \"force × distance\" doesn't work; integrating $kx$ gives a difference of $\\frac{1}{2}kx^2$.",
    "steps": [
      "Hooke's law: $F(x)=200x$ ($x$ is the stretch, in meters).",
      "$W=\\int_{0.1}^{0.3}200x\\,dx=\\left[100x^2\\right]_{0.1}^{0.3}$.",
      "$100(0.09-0.01)=8$ joules."
    ],
    "trap": "Integrating from $0$ to $0.3$ and getting $9$: the problem starts pulling from an existing stretch of $0.1$, so the lower limit is $0.1$.",
    "check": "Average force $\\frac{20+60}{2}=40$ newtons times distance $0.2$ m also gives $8$ (the force is linear, so the trapezoid is exact)."
  },
  "app-002": {
    "spot": "A rectangle inscribed in an ellipse, symmetric about both axes: parametrize the vertex as $(3\\cos\\theta,2\\sin\\theta)$ and the area becomes the one-variable function $12\\sin 2\\theta$.",
    "why": "After parametrizing, one double-angle formula reveals the max; substituting $y=2\\sqrt{1-\\frac{x^2}{9}}$ means differentiating with a square root.",
    "steps": [
      "First-quadrant vertex $(3\\cos\\theta,2\\sin\\theta)$, $0<\\theta<\\frac{\\pi}{2}$; the rectangle's sides are $6\\cos\\theta$ and $4\\sin\\theta$.",
      "Area $A=24\\sin\\theta\\cos\\theta=12\\sin 2\\theta$.",
      "The max of $\\sin 2\\theta$ is $1$, at $\\theta=\\frac{\\pi}{4}$; there $A'=24\\cos 2\\theta=0$.",
      "Maximum area $12$ (vertex at $\\left(\\frac{3}{\\sqrt2},\\sqrt2\\right)$)."
    ],
    "trap": "Computing only the first-quadrant piece $xy$ and getting $3$: the rectangle spans all four quadrants, with sides $2x$ and $2y$.",
    "check": "General formula: for an ellipse with semi-axes $a,b$, the largest inscribed rectangle has area $2ab=2\\cdot3\\cdot2=12$."
  },
  "burst-boss-anti-007": {
    "spot": "Polynomial $x^2$ times $\\arctan x$: $\\arctan x$ is hard to integrate but differentiates to the clean $\\frac{1}{1+x^2}$ — integrate by parts with $\\arctan x$ as $u$, leaving a rational function.",
    "why": "Inverse trig functions come second in LIATE, so differentiate them away as $u$; the leftover $\\frac{x^3}{1+x^2}$ integrates after long division.",
    "steps": [
      "$u=\\arctan x$, $dv=x^2dx$: $du=\\frac{dx}{1+x^2}$, $v=\\frac{x^3}{3}$.",
      "$\\int x^2\\arctan x\\,dx=\\frac{x^3}{3}\\arctan x-\\frac{1}{3}\\int\\frac{x^3}{1+x^2}dx$.",
      "Long division: $\\frac{x^3}{1+x^2}=x-\\frac{x}{1+x^2}$, which integrates to $\\frac{x^2}{2}-\\frac{1}{2}\\ln(1+x^2)$.",
      "Altogether: $\\frac{x^3}{3}\\arctan x-\\frac{x^2}{6}+\\frac{1}{6}\\ln(1+x^2)+C$."
    ],
    "trap": "Sign error in the last term: expanding $-\\frac{1}{3}\\left(\\frac{x^2}{2}-\\frac{1}{2}\\ln(1+x^2)\\right)$ makes the $\\ln$ term positive.",
    "check": "Differentiating back should give $x^2\\arctan x$."
  },
  "burst-boss-anti-009": {
    "spot": "Polynomial $x^2$ times $\\ln(1+x^2)$: let the $\\ln$ be $u$, which differentiates to $\\frac{2x}{1+x^2}$, leaving $\\frac{x^4}{1+x^2}$ — the numerator degree is higher, and long division produces an $\\arctan$.",
    "why": "Putting the log as $u$ is the only split that simplifies; substituting $u=1+x^2$ would leave a square root.",
    "steps": [
      "$u=\\ln(1+x^2)$, $dv=x^2dx$: $du=\\frac{2x}{1+x^2}dx$, $v=\\frac{x^3}{3}$.",
      "$\\int=\\frac{x^3}{3}\\ln(1+x^2)-\\frac{2}{3}\\int\\frac{x^4}{1+x^2}dx$.",
      "Long division: $\\frac{x^4}{1+x^2}=x^2-1+\\frac{1}{1+x^2}$.",
      "Integrate: $\\frac{x^3}{3}-x+\\arctan x$.",
      "Altogether: $\\frac{x^3}{3}\\ln(1+x^2)-\\frac{2x^3}{9}+\\frac{2x}{3}-\\frac{2}{3}\\arctan x+C$."
    ],
    "trap": "Dropping the $-1$ in the long division and writing $x^2+\\frac{1}{1+x^2}$: $x^2(1+x^2)=x^4+x^2$, so the extra $x^2$ must be subtracted back.",
    "check": "Differentiating back should give $x^2\\ln(1+x^2)$."
  },
  "burst-int-012": {
    "spot": "$\\ln(\\sin x)$ on $[0,\\frac{\\pi}{2}]$ has a classic Fourier expansion $\\ln\\sin x=-\\ln2-\\sum_{k\\ge1}\\frac{\\cos 2kx}{k}$; after squaring, orthogonality leaves only the diagonal terms — and out pops $\\sum\\frac{1}{k^2}=\\frac{\\pi^2}{6}$.",
    "why": "Integration by parts goes in circles; the Fourier series turns the square into \"constant squared + sum of squared coefficients\", and orthogonality kills all the cross terms.",
    "steps": [
      "Expansion: $\\ln\\sin x=-\\ln2-\\sum_{k=1}^{\\infty}\\frac{\\cos 2kx}{k}$ ($0<x<\\pi$). First check its average: $\\int_0^{\\pi/2}\\ln\\sin x\\,dx=-\\frac{\\pi}{2}\\ln2$.",
      "Square: $(\\ln\\sin x)^2=\\ln^22+2\\ln2\\sum\\frac{\\cos 2kx}{k}+\\left(\\sum\\frac{\\cos 2kx}{k}\\right)^2$. On $[0,\\frac{\\pi}{2}]$, $\\int\\cos 2kx\\,dx=0$, so the middle term vanishes.",
      "Orthogonality: for $k\\ne j$, $\\int_0^{\\pi/2}\\cos 2kx\\cos 2jx\\,dx=0$; for $k=j$ it's $\\frac{\\pi}{4}$.",
      "So the last term integrates to $\\frac{\\pi}{4}\\sum\\frac{1}{k^2}=\\frac{\\pi}{4}\\cdot\\frac{\\pi^2}{6}=\\frac{\\pi^3}{24}$.",
      "Add the constant term $\\ln^22\\cdot\\frac{\\pi}{2}$: the answer is $\\frac{\\pi}{2}\\ln^22+\\frac{\\pi^3}{24}$."
    ],
    "trap": "Assuming something like $\\int(\\ln\\sin x)^2=\\left(\\int\\ln\\sin x\\right)^2$ and answering $\\frac{\\pi^2\\ln^22}{4}$ — the integral of a square isn't the square of the integral, and the difference is exactly the $\\frac{\\pi^3}{24}$ piece.",
    "check": "The value is about $2.0466$; $\\frac{\\pi}{2}\\ln^22\\approx 0.755$ is only the constant term's contribution — the oscillating part contributes more."
  },
  "burst-rec-010": {
    "spot": "The integrand $x^n(1-x)=x^n-x^{n+1}$ is two powers: just expand and integrate term by term; no recursion needed.",
    "why": "After expanding, both terms are $\\int_0^1x^mdx=\\frac{1}{m+1}$; a recursion or the Beta function is overkill here.",
    "steps": [
      "Expand: $x^n(1-x)=x^n-x^{n+1}$.",
      "Term by term: $\\int_0^1x^ndx=\\frac{1}{n+1}$, $\\int_0^1x^{n+1}dx=\\frac{1}{n+2}$.",
      "Common denominator: $\\frac{1}{n+1}-\\frac{1}{n+2}=\\frac{1}{(n+1)(n+2)}$."
    ],
    "trap": "Combining the fractions into something other than $\\frac{1}{(n+1)(n+2)}$, e.g. $\\frac{2n+3}{(n+1)(n+2)}$ (treating the minus as a plus).",
    "check": "$n=0$: $\\int_0^1(1-x)dx=\\frac{1}{2}$, and the formula gives $\\frac{1}{1\\cdot2}$."
  },
  "cx-arc-005": {
    "spot": "Arc length of $y=\\cosh x$: $1+(y')^2=1+\\sinh^2x=\\cosh^2x$, so the root comes right off — the catenary is one of the few curves with a clean arc-length integral.",
    "why": "The hyperbolic identity $\\cosh^2-\\sinh^2=1$ removes the root in one step; grinding it out in exponential form also works, but you'd have to spot the perfect square yourself.",
    "steps": [
      "$y'=\\sinh x$, arc length $L=\\int_0^1\\sqrt{1+\\sinh^2x}\\,dx$.",
      "$1+\\sinh^2x=\\cosh^2x$, so $\\sqrt{1+\\sinh^2x}=\\cosh x$.",
      "$L=\\int_0^1\\cosh x\\,dx=\\sinh 1-\\sinh 0=\\sinh 1$."
    ],
    "trap": "Dropping the $1+$ from the arc-length formula and integrating $\\sqrt{(y')^2}=\\sinh x$, getting $\\cosh 1-1$.",
    "check": "Arc length is at least the straight-line distance between the endpoints: $\\sqrt{1+(\\cosh1-1)^2}\\approx 1.14$, and $\\sinh1\\approx 1.175$."
  },
  "cx-exam-005": {
    "spot": "$\\tan x=\\frac{\\sin x}{\\cos x}$, and the numerator $\\sin x$ is minus the derivative of the denominator $\\cos x$ — substitute $u=\\cos x$; the antiderivative is $-\\ln|\\cos x|$.",
    "why": "Rewritten as $\\frac{\\sin x}{\\cos x}$ it's \"the denominator's derivative on top\", giving a log in one step.",
    "steps": [
      "$\\int\\tan x\\,dx=\\int\\frac{\\sin x}{\\cos x}dx=-\\ln|\\cos x|+C$.",
      "Plug in the limits: $-\\ln\\cos\\frac{\\pi}{4}+\\ln\\cos0=-\\ln\\frac{1}{\\sqrt2}=\\frac{1}{2}\\ln 2$.",
      "Answer: $\\frac{\\ln 2}{2}$."
    ],
    "trap": "Remembering $\\int\\tan x\\,dx$ as $\\sec^2x$ — that's the derivative of $\\tan x$.",
    "check": "$\\tan x$ rises from $0$ to $1$ on $[0,\\frac{\\pi}{4}]$ and is convex, so the area should be less than the triangle $\\frac{1}{2}\\cdot\\frac{\\pi}{4}\\approx 0.39$; $\\frac{\\ln2}{2}\\approx 0.347$."
  },
  "cx-trig-002": {
    "spot": "The denominator is $(1+x^2)^{3/2}$ — a root of $1+x^2$: substitute $x=\\tan\\theta$, and $1+\\tan^2\\theta=\\sec^2\\theta$ removes the root.",
    "why": "After trigonometric substitution only $\\int\\cos\\theta\\,d\\theta$ is left; the substitution $u=1+x^2$ is missing a factor of $x$ and doesn't apply.",
    "steps": [
      "Let $x=\\tan\\theta$, $dx=\\sec^2\\theta\\,d\\theta$; $x=0\\to\\theta=0$, $x=1\\to\\theta=\\frac{\\pi}{4}$.",
      "$(1+\\tan^2\\theta)^{3/2}=\\sec^3\\theta$, so the integral becomes $\\int_0^{\\pi/4}\\frac{\\sec^2\\theta}{\\sec^3\\theta}d\\theta=\\int_0^{\\pi/4}\\cos\\theta\\,d\\theta$.",
      "$\\sin\\frac{\\pi}{4}-\\sin0=\\frac{1}{\\sqrt2}$."
    ],
    "trap": "Using the wrong triangle when converting back to $x$: the antiderivative is $\\sin\\theta=\\frac{x}{\\sqrt{1+x^2}}$, not $\\frac{1}{\\sqrt{1+x^2}}$.",
    "check": "The antiderivative $\\frac{x}{\\sqrt{1+x^2}}$ differentiates back to the integrand, and its value at $1$ is $\\frac{1}{\\sqrt2}$."
  },
  "db-chain-004": {
    "spot": "Outer $\\ln$, inner $\\cos x$: Chain Rule — the outer layer gives $\\frac{1}{\\cos x}$, the inner gives $-\\sin x$.",
    "why": "A standard one-line Chain Rule; after multiplying it simplifies to $-\\tan x$.",
    "steps": [
      "Outer: $\\frac{d}{du}\\ln u=\\frac{1}{u}$, $u=\\cos x$.",
      "Inner: $\\frac{d}{dx}\\cos x=-\\sin x$.",
      "Multiply: $\\frac{-\\sin x}{\\cos x}=-\\tan x$."
    ],
    "trap": "Losing the minus sign of the inner derivative and answering $\\tan x$.",
    "check": "At $x=0$, $\\ln\\cos x$ is at a max ($\\cos$ is largest), so the derivative should be $0$: $-\\tan0=0$."
  },
  "db-ftc-002": {
    "spot": "The upper limit is $x^2$, not $x$: Fundamental Theorem of Calculus plus the Chain Rule — plug the upper limit into the integrand, then multiply by its derivative $2x$.",
    "why": "No need to compute the integral first; the FTC gives $F'(x)=\\sin(x^2)\\cdot 2x$ directly.",
    "steps": [
      "Let $G(u)=\\int_0^u\\sin t\\,dt$, so $G'(u)=\\sin u$ and $F(x)=G(x^2)$.",
      "Chain Rule: $F'(x)=\\sin(x^2)\\cdot 2x$.",
      "Plug in $x=1$: $F'(1)=2\\sin 1$."
    ],
    "trap": "Forgetting to multiply by the derivative of the upper limit, $2x$, and answering $\\sin 1$.",
    "check": "Integrate directly: $F(x)=1-\\cos(x^2)$, $F'(x)=2x\\sin(x^2)$, the same at $1$."
  },
  "db-inv-003": {
    "spot": "Derivative of the inverse function at $3$: first find which $x$ gives $f(x)=3$ (try $x=1$: $1+1+1=3$), then use $(f^{-1})'(3)=\\frac{1}{f'(1)}$.",
    "why": "A fifth-degree equation can't be solved to write the inverse explicitly; the inverse-derivative formula only needs $f'$ at the corresponding point.",
    "steps": [
      "$f(1)=1+1+1=3$, so $f^{-1}(3)=1$.",
      "$f'(x)=5x^4+3x^2+1$, $f'(1)=9$.",
      "$(f^{-1})'(3)=\\frac{1}{f'(1)}=\\frac{1}{9}$."
    ],
    "trap": "Plugging in the wrong point: computing $\\frac{1}{f'(3)}=\\frac{1}{433}$. You plug in $f^{-1}(3)=1$, not $3$.",
    "check": "Numerically: $f(1.001)\\approx 3.009$, so when $y$ increases by $0.009$, $x$ increases by $0.001$ — slope about $\\frac{1}{9}$."
  },
  "db-logd-002": {
    "spot": "Both the base and the exponent contain $x$ ($(x+1)^{x^2}$): neither the Power Rule nor the exponential rule applies — use logarithmic differentiation.",
    "why": "Taking $\\ln$ brings the exponent down into the product $x^2\\ln(x+1)$, then use the Product Rule; forcing $nx^{n-1}$ misses half the answer.",
    "steps": [
      "Let $y=(x+1)^{x^2}$ and take logs: $\\ln y=x^2\\ln(x+1)$.",
      "Differentiate both sides: $\\frac{y'}{y}=2x\\ln(x+1)+\\frac{x^2}{x+1}$.",
      "Multiply back by $y$: $y'=(x+1)^{x^2}\\left(2x\\ln(x+1)+\\frac{x^2}{x+1}\\right)$."
    ],
    "trap": "Treating it as a power function to get $x^2(x+1)^{x^2-1}$, or as an exponential to get $(x+1)^{x^2}\\ln(x+1)\\cdot2x$ — each is only half right; the correct answer is exactly their sum.",
    "check": "Correct answer = the Power Rule half + the exponential-rule half."
  },
  "db-opt-002": {
    "spot": "Fixed area, minimize the perimeter: use the area to eliminate one side, $P(x)=2\\left(x+\\frac{100}{x}\\right)$, and minimize a one-variable function.",
    "why": "Differentiating to find critical points is the safest; the AM-GM inequality $x+\\frac{100}{x}\\ge 2\\sqrt{100}$ is also one line, with the same answer.",
    "steps": [
      "Let the sides be $x$ and $\\frac{100}{x}$; perimeter $P(x)=2x+\\frac{200}{x}$, $x>0$.",
      "$P'(x)=2-\\frac{200}{x^2}=0\\Rightarrow x=10$.",
      "$P''(x)=\\frac{400}{x^3}>0$, so it's a minimum.",
      "A $10\\times10$ square, with perimeter $40$."
    ],
    "trap": "Forgetting the perimeter is twice the sum, finding the min $20$ of $x+\\frac{100}{x}$, and handing that in.",
    "check": "AM-GM: $x+\\frac{100}{x}\\ge 2\\sqrt{100}=20$, so the perimeter is $\\ge 40$; trying nearby $x=9$ gives a larger perimeter."
  },
  "db-par-002": {
    "spot": "Parametric $x(t)$, $y(t)$ asking for $\\frac{dy}{dx}$: differentiate both in $t$ and divide, $\\frac{dy}{dx}=\\frac{y'(t)}{x'(t)}$.",
    "why": "No need to eliminate $t$ and write $y(x)$ (that brings in $2x\\sqrt{1-x^2}$ and sign issues).",
    "steps": [
      "$\\frac{dx}{dt}=-\\sin t$, $\\frac{dy}{dt}=2\\cos 2t$.",
      "At $t=\\frac{\\pi}{6}$: $\\frac{dx}{dt}=-\\frac{1}{2}$, $\\frac{dy}{dt}=2\\cos\\frac{\\pi}{3}=1$.",
      "$\\frac{dy}{dx}=\\frac{1}{-1/2}=-2$."
    ],
    "trap": "Flipping it upside down to $\\frac{x'(t)}{y'(t)}=-\\frac{1}{2}$.",
    "check": "Eliminating $t$: $y=2x\\sqrt{1-x^2}$, whose derivative at $x=\\cos\\frac{\\pi}{6}=\\frac{\\sqrt3}{2}$ is also $-2$."
  },
  "db-tan-004": {
    "spot": "Use the tangent line at $x=4$ to estimate the value at $x=4.4$: linear approximation $L(x)=f(4)+f'(4)(x-4)$, and $\\sqrt4=2$ is easy.",
    "why": "The tangent line is the first-order approximation; just plug in. No need to actually compute $\\sqrt{4.4}$.",
    "steps": [
      "$f(4)=2$, $f'(x)=\\frac{1}{2\\sqrt x}$, $f'(4)=\\frac{1}{4}$.",
      "Tangent line: $L(x)=2+\\frac{1}{4}(x-4)$.",
      "$L(4.4)=2+\\frac{0.4}{4}=2.1$."
    ],
    "trap": "Giving $\\sqrt{4.4}\\approx 2.0976$ as the answer — the problem wants the $y$-value on the tangent line.",
    "check": "$\\sqrt x$ is concave, so the tangent line lies above the curve: $2.1$ is a bit larger than the true value $\\sqrt{4.4}$."
  },
  "dd-imp-005": {
    "spot": "In $\\sqrt x+\\sqrt y=4$, $y$ isn't solved for: implicit differentiation — treat $y$ as a function of $x$, so differentiating $\\sqrt y$ needs a factor $y'$.",
    "why": "Solving $y=(4-\\sqrt x)^2$ and differentiating also works, but implicit differentiation gives $y'=-\\sqrt{\\frac{y}{x}}$ in one line, and plugging in the point is fastest.",
    "steps": [
      "Differentiate both sides in $x$: $\\frac{1}{2\\sqrt x}+\\frac{1}{2\\sqrt y}y'=0$.",
      "Solve: $y'=-\\frac{\\sqrt y}{\\sqrt x}$.",
      "At $(4,4)$: $y'=-\\frac{2}{2}=-1$."
    ],
    "trap": "Forgetting the factor $y'$ when differentiating $\\sqrt y$, so you can't solve for $y'$ (or think $y'=0$).",
    "check": "The curve is symmetric about $y=x$, and $(4,4)$ is on that axis, so the tangent must be perpendicular to $y=x$: slope $-1$."
  },
  "dd-invf-003": {
    "spot": "With $g=f^{-1}$, find $g'(0)$: first find $a$ with $f(a)=0$ ($a=0$, since $0+\\sin0=0$), then use $g'(0)=\\frac{1}{f'(0)}$.",
    "why": "$x+\\sin x=y$ can't be solved for $x$, so the inverse can't be written down; the formula only needs $f'$ at the corresponding point.",
    "steps": [
      "$f(0)=0+\\sin0=0$, so $g(0)=0$.",
      "$f'(x)=1+\\cos x$, $f'(0)=2$.",
      "$g'(0)=\\frac{1}{f'(g(0))}=\\frac{1}{2}$."
    ],
    "trap": "Thinking $g'=\\frac{1}{f'}$ is evaluated at the same $x$ — it only works here because both points happen to be $0$; on another problem it fails. Plug in $g(0)$.",
    "check": "$f(0.01)\\approx 0.02$, so $f$ has slope about $2$ near $0$ and the inverse has slope about $\\frac{1}{2}$."
  },
  "dd-kin-002": {
    "spot": "The height is a downward-opening quadratic: the max is at the vertex, i.e. the moment the velocity $h'(t)=0$.",
    "why": "Setting the velocity to $0$ finds the time in one step; completing the square, $-5(t-4)^2+81$, also shows the answer directly.",
    "steps": [
      "$h'(t)=-10t+40$.",
      "$h'(t)=0\\Rightarrow t=4$ s.",
      "$h(4)=-80+160+1=81$ m."
    ],
    "trap": "Answering with the time $4$, or computing the max height as $80$ and forgetting the initial height $1$.",
    "check": "Completing the square: $-5(t-4)^2+81$, vertex $(4,81)$."
  },
  "depth-der-001": {
    "spot": "In $x^{x^2}$ both the base and the exponent contain $x$: logarithmic differentiation, $\\ln y=x^2\\ln x$.",
    "why": "The Power Rule and the exponential rule each need one side to be constant; taking logs turns it into a Product Rule problem.",
    "steps": [
      "$y=x^{x^2}$, $\\ln y=x^2\\ln x$.",
      "Differentiate: $\\frac{y'}{y}=2x\\ln x+x^2\\cdot\\frac{1}{x}=2x\\ln x+x$.",
      "$y'=x^{x^2}(2x\\ln x+x)$."
    ],
    "trap": "Treating it as a power function to get $x^2\\cdot x^{x^2-1}=x^{x^2+1}$ — that's only the \"$x$\" term of the answer, missing $2x\\ln x$.",
    "check": "At $x=1$: $y=1$ and $\\frac{y'}{y}=0+1=1$, so $y'(1)=1$."
  },
  "depth-der-013": {
    "spot": "Divergence $\\nabla\\cdot\\langle P,Q,R\\rangle=P_x+Q_y+R_z$: each component is differentiated only in \"its own\" variable — note $Q=x^2z$ has no $y$ at all, and $R=xy^2$ has no $z$.",
    "why": "Compute the three terms from the definition; spotting first which components lack their variable makes two terms $0$ immediately.",
    "steps": [
      "$P=xyz$: $\\frac{\\partial P}{\\partial x}=yz$.",
      "$Q=x^2z$ has no $y$: $\\frac{\\partial Q}{\\partial y}=0$; $R=xy^2$ has no $z$: $\\frac{\\partial R}{\\partial z}=0$.",
      "Add: $\\nabla\\cdot\\mathbf F=yz$."
    ],
    "trap": "Differentiating in the wrong variable, e.g. differentiating $Q$ in $x$ to get $2xz$ and adding it in — divergence is $P$ in $x$, $Q$ in $y$, $R$ in $z$.",
    "check": "At the point $(1,2,3)$: $yz=6$; directly from the definition, $P_x=yz=6$, $Q_y=0$, $R_z=0$ — consistent."
  },
  "depth-int-006": {
    "spot": "$e^{ax}$ times $\\cos bx$: integrating by parts twice \"loops back to the original\" — call the original integral $I$ and solve a linear equation.",
    "why": "Neither factor gets simpler under differentiation or integration, so you have to rely on the loop; alternatively, guess $e^{2x}(A\\cos3x+B\\sin3x)$ and use undetermined coefficients.",
    "steps": [
      "First integration by parts ($u=\\cos3x$, $dv=e^{2x}dx$): $I=\\frac{1}{2}e^{2x}\\cos3x+\\frac{3}{2}\\int e^{2x}\\sin3x\\,dx$.",
      "Second integration by parts ($u=\\sin3x$): $\\int e^{2x}\\sin3x\\,dx=\\frac{1}{2}e^{2x}\\sin3x-\\frac{3}{2}I$.",
      "Substitute back: $I=\\frac{1}{2}e^{2x}\\cos3x+\\frac{3}{4}e^{2x}\\sin3x-\\frac{9}{4}I$, so $\\frac{13}{4}I=\\frac{e^{2x}}{4}(2\\cos3x+3\\sin3x)$.",
      "$I=\\frac{e^{2x}(2\\cos3x+3\\sin3x)}{13}+C$."
    ],
    "trap": "Switching the choice of $u$ on the second round (letting $e^{2x}$ be $u$), which loops back to $I=I$ and gives nothing. Choose the same type as $u$ both times.",
    "check": "Differentiating back should give $e^{2x}\\cos3x$; the denominator $13=2^2+3^2$ is the signature of this kind of integral."
  },
  "depth-int-013": {
    "spot": "The numerator $\\sec^2x$ is exactly the derivative of the denominator $1+\\tan x$: \"the denominator's derivative on top\" → antiderivative $\\ln|1+\\tan x|$.",
    "why": "Substituting $u=1+\\tan x$ turns it into $\\int\\frac{du}{u}$ in one step; rewriting in $\\sin$, $\\cos$ only makes it messier.",
    "steps": [
      "Let $u=1+\\tan x$, $du=\\sec^2x\\,dx$.",
      "The integral becomes $\\int\\frac{du}{u}=\\ln|u|+C$.",
      "Substitute back: $\\ln|1+\\tan x|+C$."
    ],
    "trap": "Integrating $\\sec^2x$ to $\\tan x$ first and then dividing by the denominator, getting $\\frac{\\tan x}{1+\\tan x}$ — integrals can't be split up like that.",
    "check": "Differentiate back: $\\frac{\\sec^2x}{1+\\tan x}$."
  },
  "depth-int-016": {
    "spot": "Polynomial $x$ times $\\cos x$: integrate by parts with $x$ as $u$ (it disappears after one derivative) and $\\cos x$ as $dv$.",
    "why": "$x$ becomes a constant after differentiating, so one round of integration by parts finishes it; choosing the other way raises the power.",
    "steps": [
      "$u=x$, $dv=\\cos x\\,dx$: $\\int x\\cos x\\,dx=x\\sin x-\\int\\sin x\\,dx=x\\sin x+\\cos x+C$.",
      "Upper limit $\\frac{\\pi}{2}$: $\\frac{\\pi}{2}\\cdot1+0=\\frac{\\pi}{2}$; lower limit $0$: $0+1=1$.",
      "Subtract: $\\frac{\\pi}{2}-1$."
    ],
    "trap": "Skipping the lower limit because it's $0$: $\\cos 0=1$, not $0$, and dropping it gives $\\frac{\\pi}{2}$.",
    "check": "$\\frac{\\pi}{2}-1\\approx 0.571$; the integrand's max on the interval is about $0.56$ and the interval length is $1.57$, so the size is reasonable."
  },
  "depth-int-017": {
    "spot": "$\\frac{\\ln(1+x)}{x}$ has no elementary antiderivative, but the Taylor series of $\\ln(1+x)$ divided by $x$ is all powers — integrate term by term to get a recognizable series.",
    "why": "When there's no antiderivative, switch to a series; on $[0,1]$ you can integrate term by term, and the result is the alternating $\\sum\\frac{(-1)^{n+1}}{n^2}$.",
    "steps": [
      "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$; divide by $x$: $1-\\frac{x}{2}+\\frac{x^2}{3}-\\cdots=\\sum_{n\\ge1}\\frac{(-1)^{n+1}x^{n-1}}{n}$.",
      "Term by term: $\\int_0^1x^{n-1}dx=\\frac{1}{n}$, so the integral $=\\sum_{n\\ge1}\\frac{(-1)^{n+1}}{n^2}$.",
      "The alternating Basel series: $\\sum\\frac{(-1)^{n+1}}{n^2}=\\left(1-\\frac{2}{4}\\right)\\sum\\frac{1}{n^2}=\\frac{1}{2}\\cdot\\frac{\\pi^2}{6}$.",
      "Answer: $\\frac{\\pi^2}{12}$."
    ],
    "trap": "Treating the alternating series as $\\sum\\frac{1}{n^2}=\\frac{\\pi^2}{6}$: the even terms are subtracted, so you must remove twice the sum of the even terms.",
    "check": "The integrand decreases from $1$ to $\\ln2\\approx 0.69$, so the integral should be between the two; $\\frac{\\pi^2}{12}\\approx 0.822$."
  },
  "depth-int-027": {
    "spot": "$\\frac{1}{\\sqrt{1-x^2}}$ is just the derivative of $\\arcsin x$ (the integrand blows up at the upper limit $1$, so it's an improper integral, but it converges).",
    "why": "Recognizing a standard derivative ends it in one line; the trigonometric substitution $x=\\sin\\theta$ gives the same thing.",
    "steps": [
      "$\\frac{d}{dx}\\arcsin x=\\frac{1}{\\sqrt{1-x^2}}$.",
      "The upper limit is a singular point, so take a limit: $\\lim_{b\\to1^-}\\arcsin b=\\frac{\\pi}{2}$.",
      "$\\arcsin1-\\arcsin0=\\frac{\\pi}{2}$."
    ],
    "trap": "Seeing the denominator equal $0$ at the upper limit and declaring divergence — a $\\frac{1}{\\sqrt{1-x}}$-type singularity is integrable (exponent $\\frac{1}{2}<1$).",
    "check": "Geometrically: after substituting $x=\\sin\\theta$ the integrand becomes $1$, and $\\theta$ runs from $0$ to $\\frac{\\pi}{2}$, a length of exactly $\\frac{\\pi}{2}$."
  },
  "depth-lim-009": {
    "spot": "The Taylor expansions of $\\sinh x$ and $\\sin x$ both start with $x$, and the second terms are $\\pm\\frac{x^3}{6}$; the denominator is $x^3$ — after subtracting the linear terms cancel, so look at the $x^3$ coefficient.",
    "why": "L'Hôpital's Rule would need three rounds; the expansion shows $\\frac{x^3}{6}+\\frac{x^3}{6}$ in one line.",
    "steps": [
      "$\\sinh x=x+\\frac{x^3}{6}+\\cdots$, $\\sin x=x-\\frac{x^3}{6}+\\cdots$.",
      "Subtract: $\\sinh x-\\sin x=\\frac{x^3}{3}+O(x^5)$ (no even-power terms).",
      "Divide by $x^3$ to get $\\frac{1}{3}$."
    ],
    "trap": "Writing the expansion of $\\sinh x$ as the alternating $x-\\frac{x^3}{6}$ too, so the two cancel to $0$ — the coefficients of $\\sinh$ are all positive.",
    "check": "Plug in $x=0.1$: the ratio is about $0.33333$, very close to $\\frac{1}{3}$ (the next term is of order $x^4$)."
  },
  "depth-lim-011": {
    "spot": "$\\cos x\\approx 1-\\frac{x^2}{2}$ is close to $1$, so inside the $\\ln$ is \"$1+$ something small\" — use $\\ln(1+u)\\approx u$ and expand two layers.",
    "why": "Expanding two layers finishes it in one line; one round of L'Hôpital's Rule gives $\\frac{-\\tan x}{2x}$, which still needs more work.",
    "steps": [
      "$\\cos x=1+u$, with $u=-\\frac{x^2}{2}+\\frac{x^4}{24}-\\cdots$.",
      "$\\ln(1+u)=u-\\frac{u^2}{2}+\\cdots$; $u^2$ is of order $x^4$, negligible compared to $x^2$: $\\ln\\cos x\\approx -\\frac{x^2}{2}$.",
      "Divide by $x^2$ to get $-\\frac{1}{2}$."
    ],
    "trap": "Treating $\\ln\\cos x$ as $\\cos(\\ln x)$, or writing $\\ln\\cos x\\approx\\ln 1=0$ and getting $0$ — you must expand to the $x^2$ term.",
    "check": "Plug in $x=0.1$: $\\frac{\\ln\\cos0.1}{0.01}\\approx -0.50084$, close to $-\\frac{1}{2}$."
  },
  "depth-ser-014": {
    "spot": "The denominator is a product of three consecutive integers $n(n+1)(n+2)$: split it into \"a difference of products of two consecutive ones\", which telescopes.",
    "why": "$\\frac{1}{n(n+1)(n+2)}=\\frac{1}{2}\\left(\\frac{1}{n(n+1)}-\\frac{1}{(n+1)(n+2)}\\right)$ leaves only the first term; full three-term partial fractions also work but need pairing up.",
    "steps": [
      "Split: $\\frac{1}{n(n+1)(n+2)}=\\frac{1}{2}\\left(\\frac{1}{n(n+1)}-\\frac{1}{(n+1)(n+2)}\\right)$.",
      "The partial sums telescope: $S_N=\\frac{1}{2}\\left(\\frac{1}{1\\cdot2}-\\frac{1}{(N+1)(N+2)}\\right)$.",
      "$N\\to\\infty$: $S=\\frac{1}{2}\\cdot\\frac{1}{2}=\\frac{1}{4}$."
    ],
    "trap": "Dropping the $\\frac{1}{2}$ in front when splitting and answering $\\frac{1}{2}$.",
    "check": "The first term alone is $\\frac{1}{6}\\approx 0.167$; adding $\\frac{1}{24}$ already gives $0.208$, and the rest keep shrinking, so a total of $0.25$ is reasonable."
  },
  "exam-multi-006": {
    "spot": "An iterated integral with the inner one in $y$ from $0$ to $x$: integrate the inner one first treating $x$ as a constant, get a function of $x$ only, then do the outer one.",
    "why": "The order is already set up and the limits are simple, so just go in order; no need to switch the order of integration.",
    "steps": [
      "Inner: $\\int_0^x(x+y)\\,dy=xy+\\frac{y^2}{2}\\Big|_0^x=x^2+\\frac{x^2}{2}=\\frac{3x^2}{2}$.",
      "Outer: $\\int_0^1\\frac{3x^2}{2}dx=\\frac{1}{2}$.",
      "Answer: $\\frac{1}{2}$."
    ],
    "trap": "Integrating $x$ too in the inner $y$-integral, getting a mess like $\\frac{x^2}{2}+\\frac{y^2}{2}$.",
    "check": "The region is the triangle $0\\le y\\le x\\le1$ (area $\\frac{1}{2}$), and the average of $x+y$ over it is $1$, so the integral $=1\\cdot\\frac{1}{2}$."
  },
  "gap-int-pf-003": {
    "spot": "The denominator is a product of two distinct linear factors $x$ and $x+2$: partial fractions $\\frac{A}{x}+\\frac{B}{x+2}$, each integrating to a log.",
    "why": "For distinct linear factors, the cover-up method gives the coefficients in a second; no completing the square needed.",
    "steps": [
      "Cover-up: $A=\\frac{1}{0+2}=\\frac{1}{2}$, $B=\\frac{1}{-2}=-\\frac{1}{2}$.",
      "Integrate term by term: $\\frac{1}{2}\\ln|x|-\\frac{1}{2}\\ln|x+2|+C$.",
      "Combine: $\\frac{1}{2}\\left(\\ln|x|-\\ln|x+2|\\right)+C=\\frac{1}{2}\\ln\\left|\\frac{x}{x+2}\\right|+C$."
    ],
    "trap": "Dropping the coefficient $\\frac{1}{2}$: $\\frac{1}{x}-\\frac{1}{x+2}=\\frac{2}{x(x+2)}$, so the extra $2$ has to be divided back out.",
    "check": "Differentiating back should give $\\frac{1}{x(x+2)}$."
  },
  "gap-int-pf-007": {
    "spot": "The denominator $x^2+5x+6=(x+2)(x+3)$ factors into distinct linear factors and the numerator has lower degree: partial fractions, with the cover-up method for the coefficients.",
    "why": "After factoring, both terms are of the $\\frac{1}{x+c}$ type and integrate straight to logs; completing the square toward $\\arctan$ is the wrong direction (the discriminant is greater than $0$).",
    "steps": [
      "Factor: $x^2+5x+6=(x+2)(x+3)$.",
      "Cover-up: $A=\\frac{-2+4}{-2+3}=2$, $B=\\frac{-3+4}{-3+2}=-1$.",
      "Integrate: $2\\ln|x+2|-\\ln|x+3|+C$."
    ],
    "trap": "Plugging the wrong value into the cover-up: for $A$ you plug in the value that makes $x+2=0$, namely $x=-2$, not $x=2$.",
    "check": "Differentiating back should give $\\frac{x+4}{x^2+5x+6}$."
  },
  "gx-055": {
    "spot": "$y=x^2$ is above the $x$-axis on all of $[0,2]$: the area is just the integral $\\int_0^2x^2dx$, no splitting needed.",
    "why": "The function doesn't change sign, so the definite integral equals the area.",
    "steps": [
      "Area $=\\int_0^2x^2\\,dx$.",
      "Antiderivative $\\frac{x^3}{3}$.",
      "$\\frac{8}{3}-0=\\frac{8}{3}$."
    ],
    "trap": "Writing the antiderivative as $2x$ (differentiating instead of integrating), getting $4$.",
    "check": "It's less than half of the bounding rectangle $2\\times4=8$ (the curve is convex), and $\\frac{8}{3}$ is exactly one third."
  },
  "gx-057": {
    "spot": "$\\sin x$ on $[0,\\pi]$ is exactly one arch, entirely above the $x$-axis: the area is just $\\int_0^\\pi\\sin x\\,dx$.",
    "why": "The function doesn't change sign, so integrate directly; plug both ends into the antiderivative $-\\cos x$.",
    "steps": [
      "$\\int_0^\\pi\\sin x\\,dx=\\left[-\\cos x\\right]_0^\\pi$.",
      "$-\\cos\\pi-(-\\cos0)=1+1=2$.",
      "Area $2$."
    ],
    "trap": "Getting the sign backwards as $\\cos\\pi-\\cos0=-2$: the antiderivative is $-\\cos x$.",
    "check": "The arch has width $\\pi$ and height $1$, so its area is less than the rectangle $\\pi$ and more than the triangle $\\frac{\\pi}{2}$: $2$ lands in between."
  },
  "hc-ibp-007": {
    "spot": "Polynomial $x^3$ times $\\ln x$: with $\\ln x$ as $u$ it differentiates to $\\frac{1}{x}$, and times $\\frac{x^4}{4}$ it's back to a plain power — one round of integration by parts finishes it.",
    "why": "Putting the log as $u$ is the standard routine; letting $x^3$ be $u$ means you'd need to integrate $\\ln x$ first, and it keeps getting worse.",
    "steps": [
      "$u=\\ln x$, $dv=x^3dx$: $du=\\frac{dx}{x}$, $v=\\frac{x^4}{4}$.",
      "$\\int x^3\\ln x\\,dx=\\frac{x^4}{4}\\ln x-\\int\\frac{x^3}{4}dx$.",
      "$=\\frac{x^4}{4}\\ln x-\\frac{x^4}{16}+C$."
    ],
    "trap": "Writing the last term as $\\frac{x^4}{4}$: $\\int\\frac{x^3}{4}dx=\\frac{x^4}{16}$.",
    "check": "Differentiate back: $x^3\\ln x+\\frac{x^3}{4}-\\frac{x^3}{4}=x^3\\ln x$."
  },
  "hc-ibp-009": {
    "spot": "$x^2$ times $\\cos x$: polynomial of degree $2$ → integrate by parts twice (each round lowers the power of $x$ by one); the tabular method lays it all out at once.",
    "why": "The tabular method multiplies $x^2\\to2x\\to2\\to0$ against $\\cos\\to\\sin\\to-\\cos\\to-\\sin$ crosswise, making it harder to lose a sign than writing out two rounds.",
    "steps": [
      "Tabular method: $\\int x^2\\cos x\\,dx=x^2\\sin x+2x\\cos x-2\\sin x+C$.",
      "Upper limit $\\frac{\\pi}{2}$: $\\frac{\\pi^2}{4}\\cdot1+0-2=\\frac{\\pi^2}{4}-2$.",
      "Lower limit $0$: all three terms are $0$.",
      "Answer: $\\frac{\\pi^2}{4}-2$."
    ],
    "trap": "A sign error in the second round, writing $x^2\\sin x-2x\\cos x+2\\sin x$; plugging in the upper limit then gives $\\frac{\\pi^2}{4}+2$.",
    "check": "$\\frac{\\pi^2}{4}-2\\approx 0.467$; the integrand is nonnegative, so the answer is positive and smaller than $\\frac{\\pi}{2}\\cdot\\max\\approx 0.86$."
  },
  "hc-rad-002": {
    "spot": "A quadratic denominator with discriminant $4-20<0$ that won't factor, and a constant numerator: complete the square to $(x+1)^2+4$ and go for $\\arctan$.",
    "why": "The denominator has no real roots, so partial fractions can't split it; after completing the square apply $\\int\\frac{du}{u^2+a^2}=\\frac{1}{a}\\arctan\\frac{u}{a}$.",
    "steps": [
      "Complete the square: $x^2+2x+5=(x+1)^2+2^2$.",
      "Let $u=x+1$, $a=2$: $\\int\\frac{du}{u^2+4}=\\frac{1}{2}\\arctan\\frac{u}{2}+C$.",
      "Substitute back: $\\frac{1}{2}\\arctan\\frac{x+1}{2}+C$."
    ],
    "trap": "Forgetting the $\\frac{1}{a}$ in front, or not dividing by $a$ inside, and writing $\\arctan(x+1)$.",
    "check": "Differentiating back should give $\\frac{1}{x^2+2x+5}$."
  },
  "hc-rad-003": {
    "spot": "The denominator $x^3-x=x(x-1)(x+1)$ is three distinct linear factors and the numerator has lower degree: partial fractions, with the cover-up method giving each of the three coefficients in a second.",
    "why": "For distinct linear factors the cover-up method is fastest; no system of equations to solve.",
    "steps": [
      "Factor: $x^3-x=x(x-1)(x+1)$.",
      "Cover-up: $A=\\frac{0+1}{(-1)(1)}=-1$, $B=\\frac{1+1}{1\\cdot2}=1$, $C=\\frac{1+1}{(-1)(-2)}=1$.",
      "Integrate term by term: $-\\ln|x|+\\ln|x-1|+\\ln|x+1|+C$.",
      "That is, $\\ln\\left|\\frac{x^2-1}{x}\\right|+C$."
    ],
    "trap": "Getting the sign of $C$'s denominator wrong: at $x=-1$, $x(x-1)=(-1)(-2)=2$, which is positive.",
    "check": "Differentiating back should give $\\frac{x^2+1}{x^3-x}$."
  },
  "hc-rad-004": {
    "spot": "$x^4-1=(x^2-1)(x^2+1)$ is a difference of squares: first split into $\\frac{1}{2}\\left(\\frac{1}{x^2-1}-\\frac{1}{x^2+1}\\right)$, then split the first term into two linear pieces; the second term is an $\\arctan$.",
    "why": "Treating $x^2$ as a single unit and splitting once is much faster than setting up partial fractions with four unknowns.",
    "steps": [
      "Treat $x^2$ as the variable: $\\frac{1}{(x^2-1)(x^2+1)}=\\frac{1}{2}\\left(\\frac{1}{x^2-1}-\\frac{1}{x^2+1}\\right)$.",
      "$\\frac{1}{x^2-1}=\\frac{1}{2}\\left(\\frac{1}{x-1}-\\frac{1}{x+1}\\right)$.",
      "So $\\frac{1}{x^4-1}=\\frac{1}{4}\\left(\\frac{1}{x-1}-\\frac{1}{x+1}\\right)-\\frac{1}{2}\\cdot\\frac{1}{x^2+1}$; integrate term by term.",
      "Answer: $\\frac{1}{4}\\ln\\left|\\frac{x-1}{x+1}\\right|-\\frac{1}{2}\\arctan x+C$."
    ],
    "trap": "Writing the coefficient of the $\\arctan$ term as $-1$ or $-\\frac{1}{4}$: the outer $\\frac{1}{2}$ multiplies it only once.",
    "check": "Differentiating back should give $\\frac{1}{x^4-1}$."
  },
  "hc-usub-002": {
    "spot": "The exponent is $x^2$ and in front $x^5=(x^2)^2\\cdot x$: split off $x\\,dx$ and substitute $u=x^2$, leaving $\\frac{1}{2}\\int u^2e^u\\,du$ — then integrate by parts with the tabular method.",
    "why": "Substituting first turns the odd power $x^5$ into $u^2$, and the tabular method finishes in two lines; integrating by parts directly in $x$ would take three rounds.",
    "steps": [
      "Let $u=x^2$, $du=2x\\,dx$: $\\int x^4e^{x^2}\\,x\\,dx=\\frac{1}{2}\\int u^2e^u\\,du$.",
      "Tabular method: $\\int u^2e^u\\,du=(u^2-2u+2)e^u+C$.",
      "Multiply by $\\frac{1}{2}$ and substitute back: $\\frac{e^{x^2}(x^4-2x^2+2)}{2}+C$."
    ],
    "trap": "Not alternating the signs in the tabular method and writing $(u^2+2u+2)e^u$.",
    "check": "Differentiating back should give $x^5e^{x^2}$."
  }
};
