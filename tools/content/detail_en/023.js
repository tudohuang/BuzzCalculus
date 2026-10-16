// Detail v2, English — batch 023. Translation of tools/content/detail/023.js (text only; claims live in the Chinese file).
module.exports = {
  "fd-ser-008": {
    "spot": "The numerator is always $3$ and the denominator is $4^n$: each term is $\\frac{1}{4}$ times the previous one, so it's a geometric series — just read off the first term and the ratio.",
    "why": "Geometric series have the ready-made formula $\\frac{a}{1-r}$, so there's no need to compute partial sums and take a limit; the only thing to watch is that the first term is at $n=1$.",
    "steps": [
      "The first term ($n=1$) is $a=\\frac{3}{4}$, and the ratio is $r=\\frac{1}{4}$.",
      "$|r|=\\frac{1}{4}<1$, so the series converges with sum $\\frac{a}{1-r}=\\frac{3/4}{3/4}$.",
      "So $\\sum_{n=1}^{\\infty}\\frac{3}{4^n}=1$."
    ],
    "trap": "Taking the first term to be $3$ (as if it started at $n=0$) and getting $\\frac{3}{1-1/4}=4$; starting at $n=0$ adds an extra term $3$.",
    "check": "The first three terms give $\\frac{3}{4}+\\frac{3}{16}+\\frac{3}{64}=\\frac{63}{64}$, already very close to $1$, approaching from below."
  },
  "lec-02-q4a": {
    "spot": "You're given position $s(t)$ and asked for acceleration: acceleration is the second derivative of position, so just differentiate twice.",
    "why": "Differentiate once for velocity $v(t)$, again for $a(t)$; a polynomial just needs the Power Rule term by term, no tricks.",
    "steps": [
      "Velocity $v(t)=s'(t)=3t^2-12t+9$.",
      "Acceleration $a(t)=v'(t)=6t-12$.",
      "So $a(t)=6t-12$ (m/s^2)."
    ],
    "trap": "Stopping after one derivative and calling the velocity $3t^2-12t+9$ the acceleration.",
    "check": "At $t=2$, $a=0$: the vertex of the velocity $3t^2-12t+9$ is exactly at $t=2$, where velocity is neither increasing nor decreasing."
  },
  "lec-06-m2": {
    "spot": "The integrand is a polynomial and the limits are concrete numbers: find the antiderivative $x^3-x^2$, plug in the limits and subtract.",
    "why": "A polynomial's antiderivative comes straight from the Power Rule term by term, and the Fundamental Theorem of Calculus finishes it in one step; no Riemann sums needed.",
    "steps": [
      "Antiderivative: $\\int(3x^2-2x)\\,dx=x^3-x^2+C$.",
      "Upper limit $2$: $8-4=4$; lower limit $0$: $0$.",
      "Subtract: $4-0=4$."
    ],
    "trap": "Writing the antiderivative as $6x-2$ (that's the derivative, not the integral), or forgetting to divide by $3$ in the antiderivative of $3x^2$ and writing $3x^3$.",
    "check": "Split it: $\\int_0^2 3x^2\\,dx=8$, $\\int_0^2 2x\\,dx=4$, and the difference is $4$."
  },
  "lec-06-q1c": {
    "spot": "$n$ equal pieces with right endpoints: width $\\frac{2}{n}$, the $k$th point is $\\frac{2k}{n}$, and $\\sum k^2$ appears in the sum — use the sum-of-squares formula to turn it into a rational function of $n$, then take the limit.",
    "why": "The problem wants you to compute from the definition; the sum-of-squares formula turns the $n$-term sum into a closed form, so the limit is one line; then compare with $\\int_0^2x^2\\,dx$.",
    "steps": [
      "$\\Delta x=\\frac{2}{n}$, $x_k=\\frac{2k}{n}$, $R_n=\\sum_{k=1}^{n}\\left(\\frac{2k}{n}\\right)^2\\cdot\\frac{2}{n}=\\frac{8}{n^3}\\sum_{k=1}^{n}k^2$.",
      "Sum-of-squares formula: $\\sum_{k=1}^{n}k^2=\\frac{n(n+1)(2n+1)}{6}$ (e.g. $n=3$: $1+4+9=14$).",
      "So $R_n=\\frac{8}{n^3}\\cdot\\frac{n(n+1)(2n+1)}{6}=\\frac{4(n+1)(2n+1)}{3n^2}$.",
      "$n\\to\\infty$: top and bottom are both of order $n^2$, and the ratio tends to $\\frac{4\\cdot 2}{3}=\\frac{8}{3}$, matching $\\int_0^2x^2\\,dx$."
    ],
    "trap": "Forgetting the width $\\Delta x=\\frac{2}{n}$, or writing $x_k$ as $\\frac{k}{n}$ (that's the partition of $[0,1]$), and getting a wrong value like $\\frac{1}{3}$.",
    "check": "$x^2$ is increasing, so the right-endpoint sum overestimates: at $n=3$, $R_3=\\frac{4\\cdot4\\cdot7}{27}\\approx 4.15$, bigger than $\\frac{8}{3}$."
  },
  "refine-integrals-033": {
    "spot": "The average value is the integral divided by the interval length: $\\frac{1}{b-a}\\int_a^b f(x)\\,dx$, and here the interval has length $2$.",
    "why": "This formula is the definition of a function's average value; you can't just average the endpoint values $f(1)$ and $f(3)$ — that only works for straight lines.",
    "steps": [
      "Antiderivative $\\int 6x^2\\,dx=2x^3+C$.",
      "$\\int_1^3 6x^2\\,dx=2\\cdot27-2\\cdot1=52$.",
      "Divide by the interval length $3-1=2$: average value $=26$."
    ],
    "trap": "Averaging the endpoints, $\\frac{f(1)+f(3)}{2}=\\frac{6+54}{2}=30$; the parabola curves, so the endpoint average comes out too big.",
    "check": "The average must lie between the min $f(1)=6$ and the max $f(3)=54$, and by the Mean Value Theorem for integrals some $c=\\sqrt{13/3}\\approx 2.08$ actually attains $26$."
  },
  "ap-gro-006": {
    "spot": "Doubling means $e^{0.02t}=2$: the unknown is in the exponent, so take the natural log of both sides to bring it down.",
    "why": "Taking $\\ln$ of an exponential equation linearizes it in one step; you don't need the initial population, because doubling time only depends on the ratio.",
    "steps": [
      "Let $P(t)=P_0e^{0.02t}$. Doubling: $P_0e^{0.02t}=2P_0$, i.e. $e^{0.02t}=2$.",
      "Take $\\ln$ of both sides: $0.02t=\\ln 2$.",
      "$t=\\frac{\\ln 2}{0.02}=50\\ln 2\\approx 34.7$ years."
    ],
    "trap": "Solving to get $t=\\frac{2}{0.02}=100$: treating $e^{0.02t}=2$ as $0.02t=2$ and skipping the logarithm.",
    "check": "Rule of 70: at a growth rate of $2\\%$, doubling takes about $\\frac{70}{2}=35$ years, consistent with $34.7$."
  },
  "app-004": {
    "spot": "Radius of curvature: $R=\\frac{(1+y'^2)^{3/2}}{|y''|}$. For $y=e^x$, the first and second derivatives at $x=0$ are both $1$, so just plug in.",
    "why": "The curve is in the form $y=f(x)$, so use this formula directly with no parametrization; $e^x$ is its own derivative every time, which makes it easiest.",
    "steps": [
      "$y'=e^x$, $y''=e^x$, both equal $1$ at $x=0$.",
      "Curvature $\\kappa=\\frac{|y''|}{(1+y'^2)^{3/2}}=\\frac{1}{2^{3/2}}$.",
      "The radius of curvature is the reciprocal: $R=2^{3/2}=2\\sqrt{2}$."
    ],
    "trap": "Dropping the $\\frac{3}{2}$ power in the formula and getting $\\frac{1+1}{1}=2$; or taking the curvature $\\frac{1}{2\\sqrt2}$ as the radius.",
    "check": "The radius of curvature is always $\\ge\\frac{1}{|y''|}=1$ (the numerator $(1+y'^2)^{3/2}\\ge 1$); $2\\sqrt2\\approx 2.83$ fits, and the tangent slope $1$ enlarges it by a factor of $2^{3/2}$."
  },
  "app-009": {
    "spot": "A cylinder inscribed in the unit sphere: radius $r$ and height $h$ are tied by $r^2+\\left(\\frac{h}{2}\\right)^2=1$. Use it to write the volume as a function of the single variable $h$, then maximize.",
    "why": "With $h$ as the variable, $r^2=1-\\frac{h^2}{4}$ has no square root, and $V=\\pi\\left(1-\\frac{h^2}{4}\\right)h$ is a cubic polynomial — the cleanest to differentiate.",
    "steps": [
      "Look at a cross-section: the cylinder's half-height $\\frac{h}{2}$, its radius $r$, and the sphere's radius $1$ form a right triangle, so $r^2=1-\\frac{h^2}{4}$.",
      "$V(h)=\\pi r^2h=\\pi\\left(h-\\frac{h^3}{4}\\right)$, $0<h<2$.",
      "$V'(h)=0$: $1-\\frac{3h^2}{4}=0$, $h=\\frac{2}{\\sqrt3}$; $V''<0$, so it's a maximum.",
      "Then $r^2=1-\\frac{1}{3}=\\frac{2}{3}$, and $V=\\pi\\cdot\\frac{2}{3}\\cdot\\frac{2}{\\sqrt3}=\\frac{4\\pi}{3\\sqrt3}$."
    ],
    "trap": "Writing the constraint as $r^2+h^2=1$ (forgetting it's the half-height $\\frac{h}{2}$) gives $h=\\frac{1}{\\sqrt3}$ and $V=\\frac{2\\pi}{3\\sqrt3}$, exactly half.",
    "check": "The proportion is reasonable: the max volume is $\\frac{1}{\\sqrt3}\\approx 58\\%$ of the sphere's volume $\\frac{4\\pi}{3}$; and it beats the volume $\\frac{3\\pi}{4}$ of the cylinder with $h=1$."
  },
  "cl-int-009": {
    "spot": "Moment of inertia is the sum of mass times squared distance to the axis: a small piece $dx$ has mass $\\lambda(x)\\,dx$ and distance $x$ from $x=0$, so $I=\\int_0^2x^2\\lambda(x)\\,dx$.",
    "why": "The density isn't uniform, so you can't use the uniform-rod formula $\\frac{1}{3}ML^2$; slice it into small pieces and write the integral, and what's left is a polynomial integral.",
    "steps": [
      "$I=\\int_0^2x^2(1+x)\\,dx=\\int_0^2(x^2+x^3)\\,dx$.",
      "Antiderivative $\\frac{x^3}{3}+\\frac{x^4}{4}$.",
      "Plug in $x=2$: $\\frac{8}{3}+4=\\frac{20}{3}$ kg m^2."
    ],
    "trap": "Forgetting to square the distance and computing $\\int_0^2x(1+x)\\,dx=\\frac{14}{3}$ (that's the first moment about the end).",
    "check": "The rod's total mass is $M=\\int_0^2(1+x)\\,dx=4$; if it were uniform, $\\frac{1}{3}ML^2=\\frac{16}{3}$. This rod is heavier at the far end, so its moment of inertia should exceed $\\frac{16}{3}$, and it does."
  },
  "cx-app-004": {
    "spot": "The ladder has fixed length $5$, with the bottom $x$ from the wall and the top at height $y$: $x^2+y^2=25$. You know $x'$ and want $y'$ — differentiating in time ties the two rates together.",
    "why": "The standard related rates routine: write the relation that always holds, differentiate in $t$, then plug in the current values; plugging in numbers before differentiating freezes the variables.",
    "steps": [
      "When the bottom is $3$ from the wall, the top is at height $y=\\sqrt{25-9}=4$.",
      "Differentiate $x^2+y^2=25$ in $t$: $2x\\frac{dx}{dt}+2y\\frac{dy}{dt}=0$, so $\\frac{dy}{dt}=-\\frac{x}{y}\\frac{dx}{dt}$.",
      "Plug in $x=3$, $y=4$, $\\frac{dx}{dt}=1$: $\\frac{dy}{dt}=-\\frac{3}{4}$; the minus sign means downward.",
      "The sliding speed is the magnitude: $\\frac{3}{4}$ m/s."
    ],
    "trap": "Assuming the top and bottom move at the same speed and answering $1$; the ratio of the two speeds is $\\frac{x}{y}$, which changes with position.",
    "check": "Move the bottom from $3$ to $3.01$: the top drops from $4$ to about $3.9925$, a drop of about $0.0075$, exactly $\\frac{3}{4}$ of $0.01$."
  },
  "cx-app-009": {
    "spot": "Cut an $x\\times x$ square from each corner: the base becomes $(12-2x)\\times(12-2x)$ with height $x$, so $V=x(12-2x)^2$; maximize on $0<x<6$.",
    "why": "Once it's a one-variable function, differentiate to find critical points; $V'$ factors as $(12-2x)(12-6x)$, so there's no need to expand the cubic.",
    "steps": [
      "$V(x)=x(12-2x)^2$, domain $0<x<6$.",
      "Product Rule: $V'=(12-2x)^2-4x(12-2x)=(12-2x)(12-6x)$.",
      "$V'=0$: $x=6$ (the box is flat, volume $0$) or $x=2$; around $x=2$, $V'$ goes from positive to negative, so it's a maximum.",
      "$V(2)=2\\cdot 8^2=128$."
    ],
    "trap": "Writing the base side as $12-x$ (cutting only one corner's worth), which gives $V=x(12-x)^2$; both the location and the size of the max come out wrong.",
    "check": "Try neighboring integers: $x=1$ gives $100$ and $x=3$ gives $108$, both less than $128$."
  },
  "cx-arc-001": {
    "spot": "Differentiating $y=\\frac{2}{3}x^{3/2}$ gives $y'=\\sqrt{x}$, whose square is exactly $x$: in the arc length formula $1+y'^2=1+x$, so the radicand is linear and integrates directly.",
    "why": "The arc length formula $\\int\\sqrt{1+y'^2}\\,dx$ usually can't be integrated; the coefficient $\\frac{2}{3}$ here is chosen specifically to make the radicand clean.",
    "steps": [
      "$y'=\\frac{2}{3}\\cdot\\frac{3}{2}x^{1/2}=\\sqrt{x}$.",
      "$1+y'^2=1+x$, so the arc length is $L=\\int_0^3\\sqrt{1+x}\\,dx$.",
      "Antiderivative $\\frac{2}{3}(1+x)^{3/2}$.",
      "Plug in the limits: $\\frac{2}{3}(4^{3/2}-1)=\\frac{2}{3}\\cdot 7=\\frac{14}{3}$."
    ],
    "trap": "At the lower limit writing $(1+0)^{3/2}=0$ instead of $1$, which gives $\\frac{16}{3}$.",
    "check": "Arc length is at least the straight-line distance between the endpoints: from $(0,0)$ to $(3,2\\sqrt3)$ it's $\\sqrt{21}\\approx 4.58$, and $\\frac{14}{3}\\approx 4.67$ is slightly bigger, which is reasonable."
  },
  "cx-ode-004": {
    "spot": "$y'=\\frac{x}{y}$: the right side is a function of $x$ only divided by a function of $y$ only, so it's separable — move $y$ to the left, keep $x$ on the right, and integrate each side.",
    "why": "A separable equation integrates directly to an implicit solution, then the initial condition fixes the constant; no integrating factor needed.",
    "steps": [
      "Separate: $y\\,dy=x\\,dx$; integrating gives $\\frac{y^2}{2}=\\frac{x^2}{2}+C$, i.e. $y^2=x^2+C'$.",
      "$y(0)=2$: $4=0+C'$, $C'=4$; take the positive root for $y$: $y=\\sqrt{x^2+4}$.",
      "Plug back in to confirm: $y'=\\frac{x}{\\sqrt{x^2+4}}=\\frac{x}{y}$.",
      "$y(2)=\\sqrt{4+4}=2\\sqrt2$."
    ],
    "trap": "Dropping the $\\frac{1}{2}$ or the constant when integrating and writing $y=x+2$, which gives $y(2)=4$; or taking the negative root and getting $-2\\sqrt2$ (inconsistent with $y(0)=2>0$).",
    "check": "$y^2-x^2$ should be the constant $4$ (the solution curve is a hyperbola): at $x=2$, $8-4=4$."
  },
  "db-mot-001": {
    "spot": "Velocity is $s'(t)$, and the derivative of a cubic is a quadratic: set $v=0$ and solve the quadratic, which also factors.",
    "why": "Zero velocity means $s'(t)=0$; factoring $3$ out of $3t^2-12t+9$ leaves $(t-1)(t-3)$, so no quadratic formula needed.",
    "steps": [
      "$v(t)=s'(t)=3t^2-12t+9$.",
      "Factor: $3t^2-12t+9=3(t-1)(t-3)$.",
      "$v=0$ at $t=1$ and $t=3$; the larger is $t=3$."
    ],
    "trap": "Solving $s(t)=0$ (position zero) instead and getting $t=0$ or $t=3$ — it happens to include $3$, but it answers a different question.",
    "check": "Around $t=3$ the velocity goes from negative to positive (the particle turns around there), so it really is the instant it stops."
  },
  "db-newt-001": {
    "spot": "One Newton's method step: $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$. Here $f(x)=x^2-2$, $f'(x)=2x$, plug in $x_0=1$.",
    "why": "Newton's method draws the tangent line at $x_0$ and finds its zero; apply the formula directly — one step needs just two numbers.",
    "steps": [
      "$f(1)=1-2=-1$.",
      "$f'(x)=2x$, $f'(1)=2$.",
      "$x_1=1-\\frac{-1}{2}=\\frac{3}{2}$."
    ],
    "trap": "Writing the minus sign in the formula as a plus: $1+\\frac{-1}{2}=\\frac{1}{2}$, which moves further away from $\\sqrt2$.",
    "check": "$\\sqrt2\\approx 1.414$, and $x_1=1.5$ is much closer than $x_0=1$; one more step gives $x_2=\\frac{17}{12}\\approx 1.4167$, even more accurate."
  },
  "db-rr-001": {
    "spot": "Given the rate of change of the radius, asked for the rate of change of the volume: differentiate $V=\\frac{4}{3}\\pi r^3$ in time, and the Chain Rule brings out $\\frac{dr}{dt}$.",
    "why": "Related rates: $\\frac{dV}{dt}=\\frac{dV}{dr}\\cdot\\frac{dr}{dt}$, and $\\frac{dV}{dr}=4\\pi r^2$ is exactly the sphere's surface area.",
    "steps": [
      "$\\frac{dV}{dr}=4\\pi r^2$.",
      "$\\frac{dV}{dt}=4\\pi r^2\\cdot\\frac{dr}{dt}$.",
      "Plug in $r=3$, $\\frac{dr}{dt}=2$: $4\\pi\\cdot 9\\cdot 2=72\\pi$ cm^3/s."
    ],
    "trap": "Forgetting to multiply by $\\frac{dr}{dt}=2$ and answering $36\\pi$; or plugging $r=3$ into $V$ to get $36\\pi$ and calling it the rate.",
    "check": "The radius grows from $3$ to $3.002$ (over $0.001$ s), the volume increases by about $0.0720\\pi$, and dividing by $0.001$ gives $72\\pi$."
  },
  "dd-mar-002": {
    "spot": "Marginal revenue is just $R'(q)$. Expand $R=q(60-0.5q)$ to $60q-0.5q^2$ first, then differentiate.",
    "why": "Expanded, it's a quadratic and the Power Rule does it in one line; the Product Rule works too, but expanding makes it harder to drop a term.",
    "steps": [
      "$R(q)=60q-0.5q^2$.",
      "$R'(q)=60-q$.",
      "$q=20$: $R'(20)=40$."
    ],
    "trap": "Plugging $q=20$ into $R$ itself to get $1000$ (that's total revenue), or computing average revenue $\\frac{R}{q}=50$.",
    "check": "Selling item number $21$ brings in about $R(21)-R(20)=39.5$ more, very close to the marginal revenue $40$."
  },
  "depth-der-016": {
    "spot": "Numerator $(\\ln x)^2$, denominator $x$: derivative of a quotient. The numerator needs the Chain Rule; the derivative of $(\\ln x)^2$ is $2\\ln x\\cdot\\frac{1}{x}$.",
    "why": "The Quotient Rule is most direct; you could also write it as $(\\ln x)^2x^{-1}$ and use the Product Rule with the same result, but the Quotient Rule saves a common-denominator step.",
    "steps": [
      "Derivative of the numerator: $\\left((\\ln x)^2\\right)'=\\frac{2\\ln x}{x}$.",
      "Quotient Rule: $\\frac{\\frac{2\\ln x}{x}\\cdot x-(\\ln x)^2\\cdot 1}{x^2}$.",
      "Simplify: $\\frac{2\\ln x-(\\ln x)^2}{x^2}$."
    ],
    "trap": "Reversing the order in the Quotient Rule numerator ($f g'-f'g$) and getting $\\frac{(\\ln x)^2-2\\ln x}{x^2}$, off by a sign.",
    "check": "At $x=e^2$, $\\ln x=2$ and the numerator is $2\\cdot 2-4=0$: the original function $\\frac{(\\ln x)^2}{x}$ has a max at $x=e^2$, so the derivative should be $0$ there."
  },
  "gap-der-app-005": {
    "spot": "$4.04$ is very close to the perfect square $4$: estimate with the tangent line of $f(x)=\\sqrt{x}$ at $x=4$, where $f(4)=2$ and $f'(4)=\\frac{1}{4}$ are both easy numbers.",
    "why": "Linear approximation $f(a+h)\\approx f(a)+f'(a)h$ needs only one function value and one derivative value; choosing $a=4$ makes both integers or simple fractions.",
    "steps": [
      "$f(x)=\\sqrt{x}$, $a=4$: $f(4)=2$.",
      "$f'(x)=\\frac{1}{2\\sqrt x}$, $f'(4)=\\frac{1}{4}$.",
      "$h=0.04$: $\\sqrt{4.04}\\approx 2+\\frac{1}{4}\\cdot 0.04=2.01$."
    ],
    "trap": "Computing the derivative as $\\frac{1}{\\sqrt x}$ (missing the $\\frac{1}{2}$) and getting $2.02$.",
    "check": "$\\sqrt x$ is concave, so the tangent line lies above the curve and the estimate is slightly high: the true value $\\sqrt{4.04}\\approx 2.00998$ is a hair below $2.01$."
  },
  "gap-der-app-007": {
    "spot": "Curvature formula $\\kappa=\\frac{|y''|}{(1+y'^2)^{3/2}}$: for $y=x^2$ at the vertex $x=0$ the slope is $0$, so the denominator is exactly $1$ and the curvature is just $|y''|$.",
    "why": "At a point with a horizontal tangent, the curvature formula reduces to $|y''|$, so you only need the second derivative; no osculating circle needed.",
    "steps": [
      "$y'=2x$, which is $0$ at $x=0$.",
      "$y''=2$.",
      "$\\kappa=\\frac{|2|}{(1+0)^{3/2}}=2$."
    ],
    "trap": "Mixing up curvature and radius of curvature and answering $\\frac{1}{2}$ (that's the radius of the osculating circle).",
    "check": "Curvature is largest at the vertex and decreases outward: at $x=1$, $\\kappa=\\frac{2}{5^{3/2}}\\approx 0.18$, much less than $2$."
  },
  "gap-tech-006": {
    "spot": "The denominator $x^2-1$ factors as $(x-1)(x+1)$ — two distinct linear factors with a constant numerator: split the rational function into $\\frac{A}{x-1}+\\frac{B}{x+1}$ and integrate each to a logarithm.",
    "why": "When the denominator factors into distinct linear factors, partial fractions is the most direct route; the trig substitution $x=\\sec\\theta$ also works, but takes a long detour back to logarithms.",
    "steps": [
      "Factor: $x^2-1=(x-1)(x+1)$, and set $\\frac{1}{x^2-1}=\\frac{A}{x-1}+\\frac{B}{x+1}$.",
      "Cover-up method: $A=\\frac{1}{1+1}=\\frac{1}{2}$, $B=\\frac{1}{-1-1}=-\\frac{1}{2}$, so $\\frac{1}{x^2-1}=\\frac{1}{2}\\left(\\frac{1}{x-1}-\\frac{1}{x+1}\\right)$.",
      "Integrate each to a logarithm: $\\int\\frac{dx}{x^2-1}=\\frac{1}{2}\\ln\\left|\\frac{x-1}{x+1}\\right|+C$.",
      "So the technique to use is partial fractions."
    ],
    "trap": "Confusing it with $\\frac{1}{x^2+1}$ and writing $\\arctan x$: one sign makes the difference — $x^2+1$ doesn't factor, so that's arctangent; $x^2-1$ factors, so it's logarithms.",
    "check": "Check with a definite integral: $\\int_2^3\\frac{dx}{x^2-1}=\\frac{1}{2}\\ln\\frac{3}{2}\\approx 0.203$."
  },
  "hd-011": {
    "spot": "$\\ln$ wrapped around $\\tan$ wrapped around $\\frac{x}{2}$: three layers, so the Chain Rule peels three layers; afterwards $\\sin\\frac{x}{2}\\cos\\frac{x}{2}$ appears, and the double-angle formula collapses it to $\\sin x$.",
    "why": "Applying the Chain Rule directly is fastest; the key is recognizing $2\\sin\\frac{x}{2}\\cos\\frac{x}{2}=\\sin x$ at the end — without simplifying you're left with a long mess.",
    "steps": [
      "The outer $\\ln u$ gives $\\frac{1}{\\tan(x/2)}$; the middle $\\tan$ gives $\\sec^2\\frac{x}{2}$; the inner layer gives $\\frac{1}{2}$.",
      "$\\frac{1}{\\tan(x/2)}\\cdot\\frac{1}{\\cos^2(x/2)}=\\frac{\\cos(x/2)}{\\sin(x/2)}\\cdot\\frac{1}{\\cos^2(x/2)}=\\frac{1}{\\sin(x/2)\\cos(x/2)}$.",
      "Multiply by $\\frac{1}{2}$ and the denominator becomes $2\\sin\\frac{x}{2}\\cos\\frac{x}{2}=\\sin x$: the derivative is $\\frac{1}{\\sin x}=\\csc x$."
    ],
    "trap": "Forgetting to multiply by $\\frac{1}{2}$, the derivative of the inner $\\frac{x}{2}$, and getting $\\frac{2}{\\sin x}$.",
    "check": "Read it backwards: this is exactly the formula $\\int\\csc x\\,dx=\\ln\\left|\\tan\\frac{x}{2}\\right|+C$. At $x=\\frac{\\pi}{2}$, $\\csc=1$."
  },
  "lec-03-q2d": {
    "spot": "A base-$2$ logarithm with $x^3$ inside: first use log rules to bring the power down and change base to the natural log, $y=\\frac{3\\ln x}{\\ln 2}$; what's left is a constant multiple of $\\ln x$.",
    "why": "Simplify first, then differentiate — no Chain Rule at all; the Chain Rule directly also works, but you need to remember $(\\log_2u)'=\\frac{u'}{u\\ln 2}$ and then cancel $x^2$.",
    "steps": [
      "Log rule: $\\log_2(x^3)=3\\log_2x$.",
      "Change of base: $3\\log_2x=\\frac{3}{\\ln 2}\\ln x$, and $\\frac{3}{\\ln 2}$ is a constant.",
      "$y'=\\frac{3}{\\ln 2}\\cdot\\frac{1}{x}=\\frac{3}{x\\ln 2}$."
    ],
    "trap": "Treating $\\log_2$ as the natural log and answering $\\frac{3}{x}$, missing the change-of-base factor $\\frac{1}{\\ln 2}$.",
    "check": "At $x=2$ the slope is $\\frac{3}{2\\ln 2}\\approx 2.16$; going from $x=2$ to $2.01$, $\\log_2(x^3)$ increases from $3$ by about $0.0216$."
  },
  "mob-nabla-003": {
    "spot": "$\\Delta$ is the Laplacian $\\frac{\\partial^2}{\\partial x^2}+\\frac{\\partial^2}{\\partial y^2}+\\frac{\\partial^2}{\\partial z^2}$; in $x^2+y^2+z^2$ the three variables are completely separate, and each term has a second derivative only in its own variable.",
    "why": "The function is a sum of three one-variable squares, so all mixed terms vanish; compute the three second partial derivatives separately and add.",
    "steps": [
      "Differentiate twice in $x$: $\\frac{\\partial}{\\partial x}=2x$, $\\frac{\\partial^2}{\\partial x^2}=2$ (treating $y^2$, $z^2$ as constants).",
      "Likewise $y$ and $z$ each give $2$.",
      "Add: $\\Delta(x^2+y^2+z^2)=2+2+2=6$."
    ],
    "trap": "Treating $\\Delta$ as the gradient $\\nabla$ and answering $(2x,2y,2z)$; or adding only the first partial derivatives to get $2x+2y+2z$.",
    "check": "General formula: $\\Delta(r^2)=2n$, where $n$ is the dimension; in three dimensions that's $6$, while in two dimensions $x^2+y^2$ gives $4$."
  },
  "mob-nabla-006": {
    "spot": "Divergence applied to curl: expanding $\\nabla\\cdot(\\nabla\\times\\mathbf F)$, every mixed second partial derivative appears twice with opposite signs — mixed partials can be taken in either order, so everything cancels.",
    "why": "No need to pick a specific $\\mathbf F$; write out the three components of the curl, take the divergence, and equality of mixed partials proves it in one go.",
    "steps": [
      "$\\mathbf F=(P,Q,R)$, $\\nabla\\times\\mathbf F=(R_y-Q_z,\\ P_z-R_x,\\ Q_x-P_y)$. For example, the curl of $\\mathbf F=(0,0,xy)$ is $(x,-y,0)$.",
      "Take the divergence: $(R_y-Q_z)_x+(P_z-R_x)_y+(Q_x-P_y)_z=R_{yx}-Q_{zx}+P_{zy}-R_{xy}+Q_{xz}-P_{yz}$.",
      "Mixed partials commute (e.g. for $f=x^2y^3$: $f_{xy}=f_{yx}=6xy^2$), so $R_{yx}=R_{xy}$, $Q_{zx}=Q_{xz}$, $P_{zy}=P_{yz}$.",
      "The six terms cancel in pairs: $\\nabla\\cdot(\\nabla\\times\\mathbf F)=0$."
    ],
    "trap": "Confusing it with $\\nabla\\times(\\nabla f)=\\mathbf 0$ and answering the zero vector: divergence gives a scalar, so the answer is the number $0$.",
    "check": "Try $\\mathbf F=(y^2z,0,0)$: the curl is $(0,y^2,-2yz)$, and the divergence is $2y-2y=0$."
  },
  "rel-hard-der-010": {
    "spot": "$e^{x+y}$ differentiated in $x$ or in $y$ is still itself (the inner derivative is $1$): both second partial derivatives equal $e^{x+y}$.",
    "why": "The Laplacian is just $f_{xx}+f_{yy}$; the exponential is unchanged by differentiation and the Chain Rule's inner factor is $1$, so it's immediate.",
    "steps": [
      "$f_x=e^{x+y}$, $f_{xx}=e^{x+y}$.",
      "$f_y=e^{x+y}$, $f_{yy}=e^{x+y}$.",
      "$\\Delta f=2e^{x+y}$, which at $(0,0)$ is $2e^0=2$."
    ],
    "trap": "Computing only one term, $f_{xx}=1$, and stopping; or treating $\\Delta$ as the gradient and answering $(1,1)$.",
    "check": "Compare $e^{ax+by}$: $\\Delta=(a^2+b^2)e^{ax+by}$, and $a=b=1$ gives $2$."
  },
  "uni-der-018": {
    "spot": "The outer layer is $\\exp$, the inner is $(\\ln x)^3$, and inside that is $\\ln x$: three layers. The exponential's derivative is itself, times the derivative of the exponent.",
    "why": "Apply $\\frac{d}{dx}e^{g(x)}=e^{g(x)}g'(x)$ once and you're done; the derivative of $g=(\\ln x)^3$ takes one more Power Rule plus Chain Rule.",
    "steps": [
      "Outer: $\\left(e^{g}\\right)'=e^{g}\\cdot g'$, with $g=(\\ln x)^3$.",
      "$g'=3(\\ln x)^2\\cdot\\frac{1}{x}$.",
      "Multiply: $\\frac{3(\\ln x)^2e^{(\\ln x)^3}}{x}$."
    ],
    "trap": "Forgetting to multiply by $\\frac{1}{x}$, the derivative of the innermost $\\ln x$, and writing $3(\\ln x)^2e^{(\\ln x)^3}$.",
    "check": "At $x=1$, $\\ln x=0$ and the derivative is $0$: near $x=1$ the function looks like $e^{(x-1)^3}$, very flat."
  },
  "uni-ser-007": {
    "spot": "The coefficient $\\frac{n^2}{5^n}$ is a polynomial $\\times$ an exponential: the exponential part $5^n$ sets the radius of convergence and $n^2$ doesn't matter — it's $5$ at a glance; confirm with the Ratio Test.",
    "why": "In the Ratio Test $\\frac{5^{n+1}}{5^n}=5$ is constant and $\\frac{n^2}{(n+1)^2}\\to 1$ disappears; the Root Test also works, but you need to know $\\sqrt[n]{n^2}\\to 1$ separately.",
    "steps": [
      "$a_n=\\frac{n^2}{5^n}$, $\\left|\\frac{a_n}{a_{n+1}}\\right|=\\frac{n^2}{5^n}\\cdot\\frac{5^{n+1}}{(n+1)^2}=5\\cdot\\frac{n^2}{(n+1)^2}$.",
      "$\\frac{n^2}{(n+1)^2}\\to 1$.",
      "Radius of convergence $R=\\lim\\left|\\frac{a_n}{a_{n+1}}\\right|=5$."
    ],
    "trap": "Computing the ratio the other way, $\\left|\\frac{a_{n+1}}{a_n}\\right|\\to\\frac{1}{5}$, and taking that as the radius; the reciprocal of that limit is $R$.",
    "check": "At $x=4$ (inside the radius) the general term $n^2(0.8)^n$ tends to $0$ and the series converges to $180$; at $x=5$ the general term is $n^2$, which diverges."
  },
  "world-028": {
    "spot": "The coefficients are the central binomial coefficients $\\binom{2n}{n}$, which grow roughly like $4^n$: the radius of convergence should be $\\frac{1}{4}$. Ratios of factorials cancel heavily, so use the Ratio Test.",
    "why": "The ratio $\\frac{\\binom{2n+2}{n+1}}{\\binom{2n}{n}}$ simplifies to $\\frac{2(2n+1)}{n+1}$, a simple rational expression; the Root Test would need Stirling, a detour.",
    "steps": [
      "$\\frac{\\binom{2n+2}{n+1}}{\\binom{2n}{n}}=\\frac{(2n+2)(2n+1)}{(n+1)^2}=\\frac{2(2n+1)}{n+1}$. For example $n=2$: $\\frac{\\binom{6}{3}}{\\binom{4}{2}}=\\frac{20}{6}=\\frac{10}{3}$.",
      "$n\\to\\infty$: $\\frac{2(2n+1)}{n+1}\\to 4$.",
      "Ratio Test: converges when $|x|\\cdot 4<1$, so the radius of convergence is $R=\\frac{1}{4}$."
    ],
    "trap": "Thinking $\\binom{2n}{n}$ grows polynomially like $n^2$ and answering $1$; it actually grows exponentially, $\\binom{2n}{n}\\approx\\frac{4^n}{\\sqrt{\\pi n}}$.",
    "check": "At $x=\\frac{1}{4}$ this series is the expansion of $\\frac{1}{\\sqrt{1-4x}}$ sitting right at its singularity: the radius $\\frac{1}{4}$ is exactly where $1-4x=0$."
  },
  "ap-eco-002": {
    "spot": "Revenue $R=px=(120-2x)x$ is a downward-opening quadratic: maximizing means $R'(x)=0$, or just find the vertex of the parabola.",
    "why": "A quadratic has only one critical point, and it must be the maximum (negative leading coefficient), so no second-derivative test needed.",
    "steps": [
      "$R(x)=120x-2x^2$.",
      "$R'(x)=120-4x=0$, $x=30$.",
      "$R''=-4<0$, so revenue is maximized at $x=30$ ($R(30)=1800$)."
    ],
    "trap": "Solving $p=0$ ($x=60$) instead: that's where the price drops to zero and revenue is zero too; the max revenue is exactly halfway between the two zeros $0$ and $60$.",
    "check": "The parabola $R=2x(60-x)$ has zeros at $0$ and $60$, so the vertex is at the midpoint $30$."
  },
  "ap-gro-003": {
    "spot": "The solution of $y'=ky$ is $y=y_0e^{kt}$: growing from $50$ to $400$ is a factor of $8$, and $8=2^3$ with time $3$ — it doubles exactly once per unit of time.",
    "why": "Exponential growth depends only on the factor: take the log of $e^{3k}=8$ to solve for $k$; no need to solve the differential equation again.",
    "steps": [
      "Solution: $y=50e^{kt}$ (it satisfies $y'=ky$).",
      "$y(3)=400$: $50e^{3k}=400$, $e^{3k}=8$.",
      "$3k=\\ln 8=3\\ln 2$, $k=\\ln 2$."
    ],
    "trap": "Thinking linearly and computing $\\frac{400-50}{3}$, or forgetting to take the log and writing $k=\\frac{8}{3}$.",
    "check": "$k=\\ln 2$ means doubling once per unit of time: $50\\to100\\to200\\to400$, exactly three steps."
  },
  "ap-kin-003": {
    "spot": "The highest point is the instant when velocity is zero: $h'(t)=20-10t=0$; find the time, then plug it back into $h(t)$.",
    "why": "$h(t)$ is a downward-opening parabola, so its vertex is the maximum; using the derivative to find the vertex is most direct.",
    "steps": [
      "$v(t)=h'(t)=20-10t$.",
      "$v=0$: $t=2$ s.",
      "$h(2)=40-20=20$ m."
    ],
    "trap": "Answering $t=2$ (that's the time it reaches the top), or solving $h(t)=0$ to get $t=4$ (that's when it lands).",
    "check": "Energy conservation: initial speed $20$, gravitational acceleration $10$, max height $\\frac{v_0^2}{2g}=\\frac{400}{20}=20$."
  },
  "ap-kin-004": {
    "spot": "Given velocity and a starting point, asked for position at a given time: position = starting point + the integral of velocity from $0$ to $2$ (the displacement).",
    "why": "The Fundamental Theorem of Calculus $s(2)=s(0)+\\int_0^2v(t)\\,dt$ does it in one step; finding the general $s(t)$ and then the constant also works, but takes an extra step.",
    "steps": [
      "Displacement $\\int_0^2(6t^2-4t+1)\\,dt$, with antiderivative $2t^3-2t^2+t$.",
      "Plug in $t=2$: $16-8+2=10$, so the displacement is $10$.",
      "$s(2)=s(0)+10=2+10=12$."
    ],
    "trap": "Forgetting to add the starting position $s(0)=2$ and answering $10$; that's only the displacement.",
    "check": "$s(t)=2t^3-2t^2+t+2$ satisfies $s(0)=2$ and $s'=v$; plugging in $t=2$ gives $12$."
  },
  "app-001": {
    "spot": "Given the rate of change of volume, asked for the rate of change of the radius: differentiate $V=\\frac{4}{3}\\pi r^3$ in time, $\\frac{dV}{dt}=4\\pi r^2\\frac{dr}{dt}$, and solve for $\\frac{dr}{dt}$.",
    "why": "Related rates just ties two rates together with the Chain Rule; $4\\pi r^2$ is the surface area, so the inflation rate divided by the surface area is how fast the radius grows.",
    "steps": [
      "$\\frac{dV}{dr}=4\\pi r^2$, which is $100\\pi$ at $r=5$.",
      "$\\frac{dV}{dt}=4\\pi r^2\\frac{dr}{dt}$: $100=100\\pi\\cdot\\frac{dr}{dt}$.",
      "$\\frac{dr}{dt}=\\frac{1}{\\pi}$ cm/s."
    ],
    "trap": "Dividing by $V$ itself: $\\frac{100}{\\frac{4}{3}\\pi\\cdot125}$, which is not the derivative.",
    "check": "The bigger the radius, the slower the same inflation rate makes it grow: at $r=10$ it's only $\\frac{1}{4\\pi}$, a quarter of the rate at $r=5$."
  },
  "app-011": {
    "spot": "Ladder $13$, bottom $12$ from the wall: a $5$-$12$-$13$ right triangle, so the top is at height $5$. Differentiating $x^2+y^2=169$ in time ties the two rates together.",
    "why": "The standard related rates routine; recognizing the $5$-$12$-$13$ triangle gives the current height without a square root.",
    "steps": [
      "At $x=12$ the top is at height $y=\\sqrt{169-144}=5$.",
      "$2x\\frac{dx}{dt}+2y\\frac{dy}{dt}=0$, $\\frac{dy}{dt}=-\\frac{x}{y}\\frac{dx}{dt}$.",
      "Plug in $x=12$, $y=5$, $\\frac{dx}{dt}=5$: $\\frac{dy}{dt}=-\\frac{12}{5}\\cdot 5=-12$.",
      "Sliding speed $12$ ft/s."
    ],
    "trap": "Flipping the ratio to $\\frac{y}{x}$: $\\frac{5}{12}\\cdot5=\\frac{25}{12}$. The farther the bottom is from the wall and the lower the top, the faster the top actually falls.",
    "check": "The top moves faster than the bottom because the ladder is already steeply tilted (height only $5$): the ratio $\\frac{x}{y}=\\frac{12}{5}>1$."
  },
  "burst-boss-anti-008": {
    "spot": "A polynomial $x^4$ times $\\arctan x$: differentiating $\\arctan x$ gives the rational function $\\frac{1}{1+x^2}$, so make it $u$ in integration by parts; split the leftover $\\frac{x^5}{1+x^2}$ by long division.",
    "why": "Inverse trig functions have no convenient antiderivative but differentiate cleanly, so by the LIATE priority they go in $u$; substitution has no usable inner function here.",
    "steps": [
      "$u=\\arctan x$, $dv=x^4\\,dx$: $du=\\frac{dx}{1+x^2}$, $v=\\frac{x^5}{5}$.",
      "$\\int x^4\\arctan x\\,dx=\\frac{x^5}{5}\\arctan x-\\frac{1}{5}\\int\\frac{x^5}{1+x^2}\\,dx$.",
      "Long division: $\\frac{x^5}{1+x^2}=x^3-x+\\frac{x}{1+x^2}$.",
      "Integrate: $\\int\\frac{x^5}{1+x^2}\\,dx=\\frac{x^4}{4}-\\frac{x^2}{2}+\\frac{1}{2}\\ln(1+x^2)$.",
      "Together: $\\frac{x^5}{5}\\arctan x-\\frac{x^4}{20}+\\frac{x^2}{10}-\\frac{\\ln(1+x^2)}{10}+C$."
    ],
    "trap": "Applying the $\\frac{1}{5}$ after integration by parts only to the first term, or dropping the remainder $\\frac{x}{1+x^2}$ in the long division so the log term disappears.",
    "check": "Differentiate the answer: all the polynomial and log terms must cancel, leaving only $x^4\\arctan x$."
  },
  "burst-boss-anti-010": {
    "spot": "$x^3$ times $\\ln(1+x^2)$: the log differentiates to the rational function $\\frac{2x}{1+x^2}$, so make it $u$ in integration by parts; the resulting $\\frac{x^5}{1+x^2}$ needs long division.",
    "why": "Putting the log in $u$ is the standard choice for integration by parts; substituting $w=x^2$ first also works (giving $\\frac{1}{2}\\int w\\ln(1+w)\\,dw$), but you still end up doing integration by parts.",
    "steps": [
      "$u=\\ln(1+x^2)$, $dv=x^3\\,dx$: $du=\\frac{2x}{1+x^2}dx$, $v=\\frac{x^4}{4}$.",
      "$\\int x^3\\ln(1+x^2)\\,dx=\\frac{x^4}{4}\\ln(1+x^2)-\\frac{1}{2}\\int\\frac{x^5}{1+x^2}\\,dx$.",
      "Long division: $\\frac{x^5}{1+x^2}=x^3-x+\\frac{x}{1+x^2}$, which integrates to $\\frac{x^4}{4}-\\frac{x^2}{2}+\\frac{1}{2}\\ln(1+x^2)$.",
      "Multiply by $-\\frac{1}{2}$ and combine: $\\frac{x^4}{4}\\ln(1+x^2)-\\frac{x^4}{8}+\\frac{x^2}{4}-\\frac{\\ln(1+x^2)}{4}+C$."
    ],
    "trap": "Dropping the Chain Rule factor $2x$ in $du$ and writing $\\frac{1}{1+x^2}$, which throws every later integral off by a factor.",
    "check": "Differentiating back should leave only $x^3\\ln(1+x^2)$; you can also look at $\\int_0^1$: numerical integration and the answer evaluated between the endpoints both give $\\frac{1}{8}$."
  },
  "burst-boss2-anti-006": {
    "spot": "A rational function whose numerator degree $5$ exceeds the denominator degree $2$: do long division first to split it into a polynomial plus a proper fraction, and the proper fraction $\\frac{x}{1+x^2}$ is exactly the log pattern.",
    "why": "An improper fraction can't be integrated directly; after long division every term is a basic form. You could also substitute $u=x^2$ to get $\\frac{1}{2}\\int\\frac{u^2}{1+u}\\,du$, but you'd still have to divide in the end.",
    "steps": [
      "Long division: $x^5=(x^2+1)(x^3-x)+x$, so $\\frac{x^5}{1+x^2}=x^3-x+\\frac{x}{1+x^2}$.",
      "First two terms: $\\int(x^3-x)\\,dx=\\frac{x^4}{4}-\\frac{x^2}{2}$.",
      "Remainder: the numerator $x$ is half the derivative of the denominator $1+x^2$, so $\\int\\frac{x}{1+x^2}\\,dx=\\frac{1}{2}\\ln(1+x^2)$.",
      "Together: $\\frac{x^4}{4}-\\frac{x^2}{2}+\\frac{1}{2}\\ln(1+x^2)+C$."
    ],
    "trap": "Integrating the remainder to $\\arctan x$: that's for a numerator of $1$; with numerator $x$ you need the logarithm.",
    "check": "Definite integral $\\int_0^1$: the answer gives $\\frac{1}{4}-\\frac{1}{2}+\\frac{\\ln 2}{2}\\approx 0.0966$, matching numerical integration."
  },
  "burst-boss2-int-013": {
    "spot": "$\\sin x\\cos x$ is immediately $\\frac{1}{2}\\sin 2x$; what's left, $x\\sin 2x$, is polynomial times trig — one round of integration by parts.",
    "why": "Using the double-angle formula first merges the two trig functions into one, so integration by parts is needed only once; doing parts directly means handling the antiderivative of $\\sin^2x$, which is messier.",
    "steps": [
      "$x\\sin x\\cos x=\\frac{1}{2}x\\sin 2x$.",
      "By parts: $u=x$, $dv=\\sin 2x\\,dx$, $\\int x\\sin 2x\\,dx=-\\frac{x\\cos 2x}{2}+\\frac{\\sin 2x}{4}$.",
      "Plug in the limits: at $\\frac{\\pi}{2}$ it's $-\\frac{\\pi}{4}\\cos\\pi+0=\\frac{\\pi}{4}$, at $0$ it's $0$.",
      "Multiply by the leading $\\frac{1}{2}$: $\\frac{\\pi}{8}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ from the double-angle formula and answering $\\frac{\\pi}{4}$.",
    "check": "Symmetry: $\\sin x\\cos x$ is symmetric about $x=\\frac{\\pi}{4}$, so $\\int_0^{\\pi/2}x\\sin x\\cos x\\,dx=\\frac{\\pi}{4}\\int_0^{\\pi/2}\\sin x\\cos x\\,dx=\\frac{\\pi}{4}\\cdot\\frac{1}{2}$."
  },
  "burst-boss2-int-014": {
    "spot": "$x^2$ times $\\sin x$: each differentiation lowers the polynomial's degree by one, so two rounds of integration by parts differentiate $x^2$ away (the tabular method is fastest).",
    "why": "Let $x^2$ be $u$ and differentiate down while $\\sin x$ integrates up; after two rounds only a constant times a trig function is left. The opposite choice makes the degree keep rising.",
    "steps": [
      "Tabular method: $x^2\\to 2x\\to 2\\to 0$; $\\sin x\\to-\\cos x\\to-\\sin x\\to\\cos x$, with signs $+,-,+$.",
      "Antiderivative: $-x^2\\cos x+2x\\sin x+2\\cos x$.",
      "At $\\pi$: $\\pi^2+0-2$; at $0$: $0+0+2$.",
      "Subtract: $(\\pi^2-2)-2=\\pi^2-4$."
    ],
    "trap": "Assuming everything is $0$ at the lower limit and forgetting $2\\cos 0=2$, answering $\\pi^2-2$.",
    "check": "Size check: $x^2\\sin x\\le\\pi^2\\sin x$, so the integral is at most $2\\pi^2\\approx 19.7$; $\\pi^2-4\\approx 5.87$ is positive and within range."
  },
  "burst-boss2-lim-003": {
    "spot": "$\\frac{1}{\\sin x}$ minus $\\frac{1}{x}$ and $\\frac{x}{6}$, divided by $x^3$: this asks for the $x^3$ coefficient in the expansion of $\\csc x$. The first two terms are subtracted off, so expand to the next term.",
    "why": "L'Hôpital's Rule would need three or more rounds on a fraction — very messy; write $\\sin x=x(1-w)$ and use $\\frac{1}{1-w}=1+w+w^2+\\cdots$ to get the coefficient in two lines.",
    "steps": [
      "$\\sin x=x\\left(1-w\\right)$, where $w=\\frac{x^2}{6}-\\frac{x^4}{120}+\\cdots$.",
      "$\\frac{1}{\\sin x}=\\frac{1}{x}\\left(1+w+w^2+\\cdots\\right)$, up to $x^4$: $w=\\frac{x^2}{6}-\\frac{x^4}{120}$, $w^2=\\frac{x^4}{36}+\\cdots$.",
      "Coefficient of $x^4$: $\\frac{1}{36}-\\frac{1}{120}=\\frac{10-3}{360}=\\frac{7}{360}$, so $\\frac{1}{\\sin x}=\\frac{1}{x}+\\frac{x}{6}+\\frac{7x^3}{360}+\\cdots$.",
      "Subtract $\\frac{1}{x}+\\frac{x}{6}$ and divide by $x^3$: the limit is $\\frac{7}{360}$."
    ],
    "trap": "Expanding $\\frac{1}{1-w}$ only to $1+w$ and missing the $\\frac{x^4}{36}$ from $w^2$, which gives $-\\frac{1}{120}$ — even the sign is wrong.",
    "check": "Plug in $x=0.05$: the ratio is about $0.019449$, very close to $\\frac{7}{360}\\approx 0.019444$."
  },
  "burst-boss3-anti-006": {
    "spot": "The numerator $x^7$ has higher degree than the denominator $1+x^2$: long division first; and there are only odd powers — the quotient is $x^5-x^3+x$ and the remainder is $-\\frac{x}{1+x^2}$.",
    "why": "After long division every term is a basic form; remember that the quotient of $\\frac{x^{2m+1}}{1+x^2}$ is odd powers with alternating signs, and the sign of the remainder depends on whether $m$ is odd or even.",
    "steps": [
      "Long division: $x^7=(1+x^2)(x^5-x^3+x)-x$, so $\\frac{x^7}{1+x^2}=x^5-x^3+x-\\frac{x}{1+x^2}$.",
      "Polynomial part: $\\frac{x^6}{6}-\\frac{x^4}{4}+\\frac{x^2}{2}$.",
      "Remainder: $\\int\\frac{x}{1+x^2}\\,dx=\\frac{1}{2}\\ln(1+x^2)$, with a minus sign in front.",
      "Together: $\\frac{x^6}{6}-\\frac{x^4}{4}+\\frac{x^2}{2}-\\frac{1}{2}\\ln(1+x^2)+C$."
    ],
    "trap": "Getting the remainder's sign wrong as $+\\frac{x}{1+x^2}$ (copying the pattern from the $x^5$ problem), which makes the log term positive.",
    "check": "Differentiate back: $x^5-x^3+x-\\frac{x}{1+x^2}$ over a common denominator is exactly $\\frac{x^7}{1+x^2}$."
  },
  "burst-boss3-int-001": {
    "spot": "The integrand is a part with only $x$ times a part with only $y$, and both ranges are $[0,\\infty)$: the double integral splits directly into a product of two one-variable integrals, each of the form $\\int_0^\\infty t^ke^{-at}\\,dt=\\frac{k!}{a^{k+1}}$.",
    "why": "Separable integrand plus a rectangular region means you can split it without worrying about order of integration; each piece is a standard Gamma-type integral.",
    "steps": [
      "Split: $\\left(\\int_0^\\infty x^3e^{-2x}\\,dx\\right)\\left(\\int_0^\\infty y^4e^{-3y}\\,dy\\right)$.",
      "$\\int_0^\\infty x^3e^{-2x}\\,dx=\\frac{3!}{2^4}=\\frac{6}{16}=\\frac{3}{8}$.",
      "$\\int_0^\\infty y^4e^{-3y}\\,dy=\\frac{4!}{3^5}=\\frac{24}{243}=\\frac{8}{81}$.",
      "Multiply: $\\frac{3}{8}\\cdot\\frac{8}{81}=\\frac{3}{81}=\\frac{1}{27}$."
    ],
    "trap": "Writing the denominator power as $a^k$ instead of $a^{k+1}$: $\\frac{6}{8}\\cdot\\frac{24}{81}=\\frac{2}{9}$. When substituting $u=at$, $dt=\\frac{du}{a}$ divides by one more $a$.",
    "check": "Simplest case of the formula $\\int_0^\\infty t^ke^{-at}dt=\\frac{k!}{a^{k+1}}$: $k=0$, $a=2$ gives $\\frac{1}{2}$."
  },
  "burst-boss3-lim-001": {
    "spot": "First maximize over $x$, then let $n\\to\\infty$. $x^n(1-x)$ is a peak squeezed toward $1$; differentiating puts the peak at $x=\\frac{n}{n+1}$, and plugging back in produces $\\left(1-\\frac{1}{n+1}\\right)^{n+1}$, the standard form for $\\frac{1}{e}$.",
    "why": "The supremum is attained inside the closed interval, so maximizing with derivatives is most direct; at the endpoints $x=0,1$ the function is $0$, so they don't matter.",
    "steps": [
      "$\\frac{d}{dx}x^n(1-x)=x^{n-1}\\left(n-(n+1)x\\right)$, which is $0$ at $x=\\frac{n}{n+1}$ (e.g. for $n=5$ the peak is at $\\frac{5}{6}$).",
      "Max value: $\\left(\\frac{n}{n+1}\\right)^n\\cdot\\frac{1}{n+1}$; times $n$ gives $\\left(\\frac{n}{n+1}\\right)^{n+1}$.",
      "$\\left(\\frac{n}{n+1}\\right)^{n+1}=\\left(1-\\frac{1}{n+1}\\right)^{n+1}\\to e^{-1}$."
    ],
    "trap": "Thinking $\\left(\\frac{n}{n+1}\\right)^n\\to 1$ (since the base tends to $1$) and answering $1$; this is a $1^\\infty$ form, and the limit is $\\frac{1}{e}$.",
    "check": "At $n=1000$, $\\left(\\frac{1000}{1001}\\right)^{1001}\\approx 0.36770$, close to $\\frac{1}{e}\\approx 0.36788$, approaching from below."
  },
  "burst-boss3-lim-002": {
    "spot": "Same type as $n\\sup x^n(1-x)$, except $(1-x)$ is squared and the factor in front is $n^2$: differentiate to find the peak at $x=\\frac{n}{n+2}$, and plugging back in produces $\\left(1-\\frac{2}{n+2}\\right)^n\\to e^{-2}$.",
    "why": "The max is in the interior, so differentiation locates it directly; after plugging back in, split into a $1^\\infty$ part and a rational part and take each limit separately.",
    "steps": [
      "$\\frac{d}{dx}x^n(1-x)^2=x^{n-1}(1-x)\\left(n(1-x)-2x\\right)$, with interior critical point $x=\\frac{n}{n+2}$ ($\\frac{6}{8}$ when $n=6$).",
      "Plug back in: $1-x=\\frac{2}{n+2}$, so $n^2\\sup=\\left(\\frac{n}{n+2}\\right)^n\\cdot\\frac{4n^2}{(n+2)^2}$.",
      "$\\left(\\frac{n}{n+2}\\right)^n=\\left(1-\\frac{2}{n+2}\\right)^n\\to e^{-2}$, and $\\frac{4n^2}{(n+2)^2}\\to 4$.",
      "Limit $=\\frac{4}{e^2}$."
    ],
    "trap": "Copying the peak from the previous problem as $\\frac{n}{n+1}$; plugging in gives $\\left(\\frac{n}{n+1}\\right)^n\\frac{n^2}{(n+1)^2}\\to\\frac{1}{e}$, missing a factor of $\\frac{4}{e}$.",
    "check": "At $n=1000$ the value is about $0.5402$, close to $\\frac{4}{e^2}\\approx 0.5413$."
  },
  "burst-boss3-lim-011": {
    "spot": "The numerator is $\\sqrt{1+x}$ minus $1+\\frac{x}{2}-\\frac{x^2}{8}$ — exactly the first three terms of the binomial expansion; the denominator is $x^3$, so the answer is just the coefficient of $x^3$.",
    "why": "L'Hôpital's Rule would differentiate a square root three times; the binomial series writes down the $x^3$ coefficient $\\binom{1/2}{3}$ in one line.",
    "steps": [
      "Plug in $x=0$: the numerator is $1-1=0$, a $\\frac{0}{0}$ form.",
      "Binomial series $(1+x)^{1/2}=\\sum\\binom{1/2}{k}x^k$; the first three terms $1+\\frac{x}{2}-\\frac{x^2}{8}$ match what the problem subtracts.",
      "Coefficient of $x^3$: $\\binom{1/2}{3}=\\frac{\\frac{1}{2}\\cdot(-\\frac{1}{2})\\cdot(-\\frac{3}{2})}{3!}=\\frac{3/8}{6}=\\frac{1}{16}$.",
      "Subtract the first three terms and divide by $x^3$: the limit is $\\frac{1}{16}$."
    ],
    "trap": "Forgetting to divide by $3!$ and getting $\\frac{3}{8}$; or getting the sign of $(-\\frac{1}{2})(-\\frac{3}{2})$ wrong and getting $-\\frac{1}{16}$.",
    "check": "Plug in $x=0.01$: the ratio is about $0.06211$, slightly less than $\\frac{1}{16}=0.0625$; the gap is exactly the $\\frac{5}{128}\\cdot 0.01\\approx 0.00039$ contributed by the next term $-\\frac{5}{128}x^4$."
  },
  "burst-rec-009": {
    "spot": "$x^n(1+x)=x^n+x^{n+1}$: multiplied out it's two power functions, each handled by $\\int_0^1x^m\\,dx=\\frac{1}{m+1}$.",
    "why": "It's labeled as a recursion, but this problem doesn't need recursion at all; expanding gives the closed form directly.",
    "steps": [
      "$x^n(1+x)=x^n+x^{n+1}$.",
      "$\\int_0^1x^n\\,dx=\\frac{1}{n+1}$, $\\int_0^1x^{n+1}\\,dx=\\frac{1}{n+2}$.",
      "$K_n=\\frac{1}{n+1}+\\frac{1}{n+2}$."
    ],
    "trap": "Writing the power rule results as $\\frac{1}{n}$ and $\\frac{1}{n+1}$ (forgetting to add one to the exponent), off by one.",
    "check": "$n=0$: $\\int_0^1(1+x)\\,dx=\\frac{3}{2}$, and the formula gives $1+\\frac{1}{2}$."
  },
  "cl-int-018": {
    "spot": "The moment of inertia about the $y$-axis is $\\iint x^2\\,dA$: the integrand involves only $x$, so integrate in $y$ first — at $x$ the triangle's height is $2-x$, and the double integral becomes $\\int_0^2x^2(2-x)\\,dx$.",
    "why": "Integrating in $y$ first just multiplies by the height, reducing it to a one-variable integral in one step; integrating in $x$ first gives $\\frac{(2-y)^3}{3}$, which also works but needs an extra substitution.",
    "steps": [
      "Triangle: $0\\le x\\le 2$, $0\\le y\\le 2-x$ (the hypotenuse is $x+y=2$). Inner: $\\int_0^{2-x}x^2\\,dy=x^2(2-x)$.",
      "$\\int_0^2(2x^2-x^3)\\,dx$, with antiderivative $\\frac{2x^3}{3}-\\frac{x^4}{4}$.",
      "Plug in $x=2$: $\\frac{16}{3}-4=\\frac{4}{3}$."
    ],
    "trap": "Writing the height as $2$ (treating it as a square) and getting $\\int_0^2 2x^2\\,dx=\\frac{16}{3}$; or using $y^2$ instead of $x^2$ (that's the moment about the $x$-axis — this triangle happens to be symmetric so the value is the same, but the concept is wrong).",
    "check": "Switch the order of integration: integrating in $x$ first gives $\\frac{(2-y)^3}{3}$, and then integrating in $y$ also gives $\\frac{4}{3}$."
  },
  "cl-lim-022": {
    "spot": "The denominator $x^2\\to 0$ but the limit is the finite $8$: the numerator must also be $0$ at $x=0$, which forces $a=1$. Then $\\frac{1-\\cos bx}{x^2}$ is a standard form that tends to $\\frac{b^2}{2}$.",
    "why": "First use the fact that denominator going to zero with a finite limit forces the numerator to zero too, to find $a$; then $1-\\cos u\\approx\\frac{u^2}{2}$ gives $b$ in one line.",
    "steps": [
      "The numerator at $0$ is $a-\\cos 0=a-1$, which must be $0$, or else the limit is infinite: $a=1$.",
      "$1-\\cos bx\\approx\\frac{(bx)^2}{2}$, so $\\frac{1-\\cos bx}{x^2}\\to\\frac{b^2}{2}$.",
      "$\\frac{b^2}{2}=8$, $b^2=16$, and $b>0$ gives $b=4$.",
      "$a+b=1+4=5$."
    ],
    "trap": "Remembering $\\frac{b^2}{2}$ as $b^2$ or $\\frac{b}{2}$, giving $b=2\\sqrt2$ or $b=16$.",
    "check": "Plug back in $a=1$, $b=4$: at $x=0.01$ the ratio is about $7.9989$, close to $8$."
  },
  "cl-lim-040": {
    "spot": "The numerator is the sum of squares of the first $n$ odd numbers, of order about $n^3$: use $\\sum(2k-1)^2=4\\sum k^2-4\\sum k+n$ to get a closed form, then just look at the $n^3$ coefficient.",
    "why": "With the closed form you just compare leading terms; you could also view it as a Riemann sum or use Stolz–Cesàro, but the formula is least error-prone.",
    "steps": [
      "$(2k-1)^2=4k^2-4k+1$, so the sum $=4\\cdot\\frac{n(n+1)(2n+1)}{6}-4\\cdot\\frac{n(n+1)}{2}+n$.",
      "This simplifies to $\\frac{n(2n-1)(2n+1)}{3}$ ($n=3$: $1+9+25=35$).",
      "The leading term is $\\frac{4n^3}{3}$; divided by $n^3$ it tends to $\\frac{4}{3}$."
    ],
    "trap": "Thinking the sum of squares of $n$ odd numbers is about the same as $\\sum k^2\\approx\\frac{n^3}{3}$ and answering $\\frac{1}{3}$; the odd numbers are about $2k$, so the squares are $4$ times bigger.",
    "check": "Riemann sum view: $\\frac{1}{n}\\sum\\left(\\frac{2k-1}{n}\\right)^2$ is the midpoint sum for $\\frac{1}{2}\\int_0^2x^2\\,dx=\\frac{4}{3}$."
  },
  "cx-app-003": {
    "spot": "Given $\\frac{dV}{dt}$, asked for $\\frac{dr}{dt}$: differentiating $V=\\frac{4}{3}\\pi r^3$ in $t$ gives $\\frac{dV}{dt}=4\\pi r^2\\frac{dr}{dt}$; solve for it.",
    "why": "Related rates is just the Chain Rule; $4\\pi r^2$ is the surface area, so the rate of volume increase divided by the surface area is the rate of radius increase.",
    "steps": [
      "$\\frac{dV}{dr}=4\\pi r^2$, which is $16\\pi$ at $r=2$.",
      "$8=16\\pi\\cdot\\frac{dr}{dt}$.",
      "$\\frac{dr}{dt}=\\frac{8}{16\\pi}=\\frac{1}{2\\pi}$."
    ],
    "trap": "Dividing by $V$ itself at $r=2$, which is $\\frac{32\\pi}{3}$, and answering $\\frac{3}{4\\pi}$; you divide by $\\frac{dV}{dr}$, not $V$.",
    "check": "Check the numbers: $\\frac{dr}{dt}\\approx 0.159$; multiplying by the surface area $16\\pi\\approx 50.3$ gives back exactly $8$."
  },
  "cx-app-005": {
    "spot": "In a conical tank $r$ and $h$ are tied by $r=\\frac{h}{2}$: first rewrite $V=\\frac{1}{3}\\pi r^2h$ in terms of $h$ alone as $\\frac{\\pi h^3}{12}$, then differentiate in time.",
    "why": "Eliminate $r$ before differentiating and only one rate is left; if you differentiate with both $r$ and $h$ as variables, you also have to deal with $\\frac{dr}{dt}$.",
    "steps": [
      "$V=\\frac{1}{3}\\pi\\left(\\frac{h}{2}\\right)^2h=\\frac{\\pi h^3}{12}$.",
      "$\\frac{dV}{dt}=\\frac{\\pi h^2}{4}\\frac{dh}{dt}$; at $h=2$, $\\frac{dV}{dh}=\\pi$.",
      "$3=\\pi\\frac{dh}{dt}$, $\\frac{dh}{dt}=\\frac{3}{\\pi}$."
    ],
    "trap": "Treating $r$ as a constant and differentiating $V=\\frac{1}{3}\\pi r^2h$ in $h$ to get $\\frac{dV}{dh}=\\frac{\\pi}{3}$, answering $\\frac{9}{\\pi}$. As the water rises, the surface radius changes too.",
    "check": "The water surface area is $\\pi r^2=\\pi$ (with $r=1$), so the rate the level rises is the flow rate divided by the surface area: $\\frac{3}{\\pi}$."
  },
  "db-ext-007": {
    "spot": "Mean Value Theorem: find $c$ with $f'(c)$ equal to the secant slope $\\frac{f(4)-f(1)}{4-1}$. The endpoint values of $\\sqrt x$ are integers, and the secant slope is $\\frac{1}{3}$.",
    "why": "Just set up $f'(c)=\\frac{f(b)-f(a)}{b-a}$ and solve; with the derivative of $\\sqrt x$ being $\\frac{1}{2\\sqrt c}$, it's only a linear equation.",
    "steps": [
      "Secant slope: $\\frac{\\sqrt4-\\sqrt1}{4-1}=\\frac{1}{3}$.",
      "$f'(c)=\\frac{1}{2\\sqrt c}=\\frac{1}{3}$, $\\sqrt c=\\frac{3}{2}$.",
      "$c=\\frac{9}{4}$, which is indeed in $(1,4)$."
    ],
    "trap": "Stopping at $\\sqrt c=\\frac{3}{2}$ and forgetting to square; or using $\\frac{1}{\\sqrt c}=\\frac{1}{3}$ (missing the $\\frac{1}{2}$) to get $c=9$, which is outside the interval.",
    "check": "$\\sqrt x$ is concave, so $c$ should be left of the midpoint $2.5$: $2.25<2.5$."
  },
  "db-ext-010": {
    "spot": "Inflection points are where $f''$ changes sign: for a quartic, $f''$ is the quadratic $12x^2-12$ with zeros $\\pm 1$; then confirm it really changes sign on both sides.",
    "why": "$f''=0$ only gives candidates; $12(x-1)(x+1)$ has simple roots at $\\pm1$, so it must change sign, and both are inflection points.",
    "steps": [
      "$f'=4x^3-12x$, $f''=12x^2-12$.",
      "$f''=12(x-1)(x+1)=0$: $x=\\pm1$.",
      "Around $x=1$: $f''(0.9)<0$, $f''(1.1)>0$, so the concavity changes and it's an inflection point; the one with $x>0$ is $x=1$."
    ],
    "trap": "Solving $f'=0$ (critical points $x=0,\\pm\\sqrt3$) and answering $\\sqrt3$; that's an extremum, not an inflection point.",
    "check": "$f$ is even, so inflection points come in symmetric pairs: $-1$ is one too, and $f''(-1)=0$."
  },
  "db-inv-002": {
    "spot": "For $(f^{-1})'(1)$ you first need to know what $f$ sends to $1$: $f(0)=0+e^0=1$, so $f^{-1}(1)=0$; then take $\\frac{1}{f'(0)}$.",
    "why": "The inverse of $x+e^x$ can't be written down, so you have to use the inverse derivative formula $(f^{-1})'(b)=\\frac{1}{f'(f^{-1}(b))}$; the key is spotting $f(0)=1$.",
    "steps": [
      "$f(0)=1$, so $f^{-1}(1)=0$.",
      "$f'(x)=1+e^x$, $f'(0)=2$.",
      "$(f^{-1})'(1)=\\frac{1}{f'(0)}=\\frac{1}{2}$."
    ],
    "trap": "Computing $\\frac{1}{f'(1)}=\\frac{1}{1+e}$ directly: the derivative must be evaluated at $f^{-1}(1)=0$, not at $1$.",
    "check": "Invert numerically: $f(0.01)\\approx 1.02005$, so as the input of $f^{-1}$ goes from $1$ to $1.02005$, the output increases by only $0.01$ — a slope of about $\\frac{1}{2}$."
  },
  "db-itrig-005": {
    "spot": "A product of hyperbolic functions: $(\\sinh x)'=\\cosh x$, $(\\cosh x)'=\\sinh x$; the Product Rule gives $\\cosh^2x+\\sinh^2x$, which the hyperbolic double-angle formula collapses to $\\cosh 2x$.",
    "why": "You could also rewrite with $\\sinh x\\cosh x=\\frac{1}{2}\\sinh 2x$ first and differentiate to get $\\cosh 2x$ in one step; both routes are short — the key is remembering that hyperbolic derivatives have no minus sign.",
    "steps": [
      "Product Rule: $(\\sinh x\\cosh x)'=\\cosh x\\cdot\\cosh x+\\sinh x\\cdot\\sinh x$.",
      "$\\cosh^2x+\\sinh^2x=\\cosh 2x$ (expand using $\\cosh x=\\frac{e^x+e^{-x}}{2}$).",
      "So the derivative is $\\cosh 2x$."
    ],
    "trap": "Following the trig habit and writing $(\\cosh x)'$ as $-\\sinh x$, which gives $\\cosh^2x-\\sinh^2x=1$.",
    "check": "Other route: $\\sinh x\\cosh x=\\frac{1}{2}\\sinh 2x$, which differentiates to $\\cosh 2x$; at $x=0$ the slope is $1$."
  },
  "db-newt-002": {
    "spot": "One Newton's method step: $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$. At $x_0=2$, $f(2)=-1$ and $f'(2)=10$, both integers.",
    "why": "Newton's method follows the tangent line down to the $x$-axis; you only need the values of $f$ and $f'$ at $x_0$.",
    "steps": [
      "$f(2)=8-4-5=-1$.",
      "$f'(x)=3x^2-2$, $f'(2)=10$.",
      "$x_1=2-\\frac{-1}{10}=2.1$."
    ],
    "trap": "Flipping the sign in the formula and getting $1.9$; or computing $f'(2)$ as $3\\cdot 2^2=12$ (missing the $-2$) and getting $2+\\frac{1}{12}$.",
    "check": "The true root is about $2.0946$ (this is the example Newton himself used), and $x_1=2.1$ is already very close: $f(2.1)=0.061$, much smaller than $f(2)=-1$."
  },
  "db-par-003": {
    "spot": "Slope of a parametric curve: $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$. Here $x'(t)=1-\\cos t$ and $y'(t)=\\sin t$, both equal to $1$ at $t=\\frac{\\pi}{2}$.",
    "why": "For a cycloid, $y$ can't be written explicitly as a function of $x$, so you must differentiate parametrically; just divide the two derivatives.",
    "steps": [
      "$\\frac{dx}{dt}=1-\\cos t$, which is $1$ at $\\frac{\\pi}{2}$.",
      "$\\frac{dy}{dt}=\\sin t$, which is $1$ at $\\frac{\\pi}{2}$.",
      "$\\frac{dy}{dx}=\\frac{1}{1}=1$."
    ],
    "trap": "Flipping numerator and denominator to $\\frac{dx/dt}{dy/dt}$; here it happens to also give $1$, but at another $t$ it's wrong (e.g. at $t=\\frac{\\pi}{3}$ the correct value is $\\sqrt3$).",
    "check": "In general $\\frac{\\sin t}{1-\\cos t}=\\cot\\frac{t}{2}$, and at $t=\\frac{\\pi}{2}$, $\\cot\\frac{\\pi}{4}=1$."
  },
  "db-tan-008": {
    "spot": "A horizontal tangent means $y'=0$; the cubic's derivative $3x^2-6x$ factors as $3x$ times something, so the roots are visible at a glance.",
    "why": "Horizontal tangent = zero slope, so solve $y'=0$ directly; factoring out the common factor beats the quadratic formula.",
    "steps": [
      "$y'=3x^2-6x=3x(x-2)$.",
      "$y'=0$: $x=0$ or $x=2$.",
      "The one with $x>0$ is $x=2$ (point of tangency $(2,-3)$)."
    ],
    "trap": "Solving $y=0$ (where the curve meets the $x$-axis), which has nothing to do with horizontal tangents.",
    "check": "$x=2$ is a local min: $y'$ goes from negative to positive across it, so the tangent is exactly horizontal there."
  },
  "dd-imp-006": {
    "spot": "$y^3+xy=10$ can't be solved for $y$ in a simple form: implicit differentiation — treat $y$ as a function of $x$, differentiate both sides in $x$, and use the Product Rule on $xy$.",
    "why": "Implicit differentiation directly gives the formula $-\\frac{F_x}{F_y}$ for $y'$, needing only the point's coordinates; forcing out an explicit solution of the cubic is long and ugly.",
    "steps": [
      "First confirm the point is on the curve: $2^3+1\\cdot2=10$.",
      "Differentiate both sides in $x$: $3y^2y'+(y+xy')=0$, which rearranges to $y'=-\\frac{y}{3y^2+x}$ (i.e. $-\\frac{F_x}{F_y}$).",
      "Plug in $(1,2)$: $y'=-\\frac{2}{12+1}=-\\frac{2}{13}$."
    ],
    "trap": "Differentiating $xy$ as only $xy'$ or only $y$ (missing half of the Product Rule), which gives wrong values like $-\\frac{2}{12}$ or $-\\frac{0}{13}$.",
    "check": "Writing $y$ explicitly in terms of $x$ via the cubic formula and differentiating numerically at $x=1$ also gives slope $-\\frac{2}{13}\\approx-0.1538$."
  }
};
