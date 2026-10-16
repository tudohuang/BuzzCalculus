// Detail v2, English — batch 033. Translation of tools/content/detail/033.js (text only; claims live in the Chinese file).
module.exports = {
  "gap-tech-001": {
    "spot": "As $x\\to\\infty$, both $\\sqrt{x^2+3x}$ and $x$ blow up, so the difference is an $\\infty-\\infty$ form. A square root minus something is begging you to multiply by the conjugate.",
    "why": "Multiplying by $\\sqrt{x^2+3x}+x$ turns the numerator into a difference of squares that cancels $x^2$, leaving $\\frac{3x}{\\sqrt{x^2+3x}+x}$; numerator and denominator are the same order, so the limit is visible at a glance. Direct substitution and L'Hôpital's Rule both get stuck on $\\infty-\\infty$.",
    "steps": [
      "Multiply by the conjugate: the numerator becomes $(\\sqrt{x^2+3x}-x)(\\sqrt{x^2+3x}+x)=x^2+3x-x^2=3x$.",
      "So $\\sqrt{x^2+3x}-x=\\frac{3x}{\\sqrt{x^2+3x}+x}$.",
      "Divide top and bottom by $x$: $\\frac{3}{\\sqrt{1+3/x}+1}\\to\\frac{3}{2}$.",
      "So the technique here is to rationalize (multiply by the conjugate), and the limit is $\\frac{3}{2}$."
    ],
    "trap": "Thinking $\\sqrt{x^2+3x}\\approx x$, so the difference is $0$. In fact $\\sqrt{x^2+3x}\\approx x+\\frac{3}{2}$, and that small leftover is exactly the answer.",
    "check": "Plug in $x=1000$: $\\sqrt{1003000}-1000\\approx 1.4989$, very close to $1.5$."
  },
  "gx-037": {
    "spot": "The curve is given in terms of $t$ and the question asks for $\\frac{dy}{dx}$: the slope of parametric equations is the ratio of the two $t$-derivatives.",
    "why": "Eliminating $t$ gives $y=\\pm x^{3/2}$, and then you have to pick a branch; $\\frac{dy/dt}{dx/dt}$ directly avoids branches.",
    "steps": [
      "$\\frac{dx}{dt}=2t$, which is $4$ at $t=2$.",
      "$\\frac{dy}{dt}=3t^2$, which is $12$ at $t=2$.",
      "$\\frac{dy}{dx}=\\frac{12}{4}=3$."
    ],
    "trap": "Dividing the derivatives the wrong way round: $\\frac{dx/dt}{dy/dt}=\\frac{1}{3}$.",
    "check": "Eliminate $t$: the branch through $t=2$ is $y=x^{3/2}$, whose slope at $x=4$ is $\\frac{3}{2}\\sqrt 4=3$, consistent."
  },
  "lm-nr-001": {
    "spot": "$n$ appears both in the base and in the root index: $\\sqrt[n]{n}=n^{1/n}$ is \"a variable to a variable power\", so take logs to bring the exponent down.",
    "why": "After taking logs you get $\\frac{\\ln n}{n}$, the familiar \"log is slower than polynomial\". Staring at $n^{1/n}$ directly leaves you stuck on whether \"base grows\" or \"exponent shrinks\" wins.",
    "steps": [
      "$n^{1/n}=e^{\\frac{\\ln n}{n}}$.",
      "$\\frac{\\ln n}{n}\\to 0$: by L'Hôpital's Rule, $\\frac{1/x}{1}=\\frac{1}{x}\\to 0$.",
      "The exponential is continuous, so $n^{1/n}\\to e^0=1$."
    ],
    "trap": "Seeing \"root of infinity\" and calling $\\infty^0$ equal to $\\infty$, or simply $0$. $\\infty^0$ is an indeterminate form; you need logs to decide it.",
    "check": "Plug in $n=10^6$: $n^{1/n}=e^{13.8/10^6}\\approx 1.0000138$, already very close to $1$."
  },
  "lm-sq-004": {
    "spot": "$\\sin x$ keeps swinging between $-1$ and $1$ with no limit, but the denominator $x\\to\\infty$: bounded over infinity, so use the Squeeze Theorem.",
    "why": "L'Hôpital's Rule would need $\\frac{\\cos x}{1}$, whose limit does not exist, so it fails. The Squeeze Theorem does it in one line.",
    "steps": [
      "$-1\\le\\sin x\\le 1$, so for $x>0$, $-\\frac{1}{x}\\le\\frac{\\sin x}{x}\\le\\frac{1}{x}$.",
      "The squeezing bounds $\\pm\\frac{1}{x}\\to 0$.",
      "Squeeze Theorem: $\\frac{\\sin x}{x}\\to 0$."
    ],
    "trap": "Confusing it with $\\lim_{x\\to 0}\\frac{\\sin x}{x}=1$ and answering $1$. That one is $x\\to 0$; this one is $x\\to\\infty$.",
    "check": "Plug in $x=1000$: $\\left|\\frac{\\sin 1000}{1000}\\right|\\le 0.001$, essentially $0$."
  },
  "lx-app-003": {
    "spot": "\"Long-run steady state\" means $t\\to\\infty$. The only thing that changes in the formula is $e^{-0.4t}$, and with a negative exponent it decays to $0$.",
    "why": "No derivatives needed; you only need $e^{-kt}\\to 0$ (for $k>0$).",
    "steps": [
      "Long run $=t\\to\\infty$; at the start $C(0)=0$, and it rises from there.",
      "$k=0.4>0$, so $e^{-0.4t}\\to 0$.",
      "$C(t)=12(1-e^{-0.4t})\\to 12(1-0)=12$ mg/L."
    ],
    "trap": "Plugging in $t=0$ and getting $0$ (that is the starting concentration), or working $0.4$ into the answer as $12\\times 0.4$.",
    "check": "At $t=20$ hours: $C=12(1-e^{-8})\\approx 11.996$, already hugging $12$ and never exceeding it."
  },
  "mob-tech-020": {
    "spot": "$x^x$ has $x$ in both the base and the exponent: it is neither a power function $x^n$ nor an exponential $a^x$, so neither formula applies.",
    "why": "Taking logs, $\\ln y=x\\ln x$, brings the exponent down and leaves an ordinary product to differentiate. That is logarithmic differentiation.",
    "steps": [
      "Take logs: $\\ln y=x\\ln x$.",
      "Differentiate both sides: $\\frac{y'}{y}=\\ln x+1$.",
      "Multiply back by $y$: $y'=x^x(\\ln x+1)$.",
      "So the technique is logarithmic differentiation."
    ],
    "trap": "Treating it as a power function, $x\\cdot x^{x-1}=x^x$, or as an exponential, $x^x\\ln x$ — each catches only half; the correct answer is exactly their sum.",
    "check": "At $x=1$: $y'=1\\cdot(0+1)=1$, matching the numerical derivative."
  },
  "tb-curv-003": {
    "spot": "$x=\\frac{\\pi}{2}$ is a crest of $\\sin x$: there $y'=0$, so the denominator of the curvature formula becomes $1$.",
    "why": "Curvature $\\kappa=\\frac{|y''|}{(1+y'^2)^{3/2}}$; with a horizontal tangent only $|y''|$ is left. The radius of curvature is $\\frac{1}{\\kappa}$.",
    "steps": [
      "$y'=\\cos x$, which is $0$ at $\\frac{\\pi}{2}$.",
      "$y''=-\\sin x$, which is $-1$ at $\\frac{\\pi}{2}$.",
      "$\\kappa=\\frac{|-1|}{(1+0)^{3/2}}=1$, so the radius of curvature is $R=\\frac{1}{\\kappa}=1$."
    ],
    "trap": "Forgetting to take the reciprocal, or keeping the minus sign of $y''=-1$ and answering $-1$. The radius of curvature is a length, so it is always positive.",
    "check": "Near the crest $\\sin x\\approx 1-\\frac{(x-\\pi/2)^2}{2}$, which bends exactly like the radius-$1$ circle $y=\\sqrt{1-u^2}\\approx 1-\\frac{u^2}{2}$."
  },
  "world-020": {
    "spot": "Denominator $n!$, numerator a polynomial in $n$: split $n^2$ into $n(n-1)+n$ so it cancels against $n!$, turning back into $\\sum\\frac{1}{k!}=e$.",
    "why": "Both $n(n-1)$ and $n$ cancel against the factorial, so each piece becomes the series for $e$. The Ratio Test alone only tells you it converges, not the value.",
    "steps": [
      "Split: $n^2=n(n-1)+n$.",
      "$\\sum_{n\\ge 2}\\frac{n(n-1)}{n!}=\\sum_{n\\ge 2}\\frac{1}{(n-2)!}=e$.",
      "$\\sum_{n\\ge 1}\\frac{n}{n!}=\\sum_{n\\ge 1}\\frac{1}{(n-1)!}=e$.",
      "Together: $e+e=2e\\approx 5.4366$."
    ],
    "trap": "Cancelling only one $n$: after $\\frac{n^2}{n!}=\\frac{n}{(n-1)!}$, thinking it is already $e$ and missing the $n$ still left in the numerator.",
    "check": "First four terms: $1+2+\\frac{9}{6}+\\frac{16}{24}\\approx 5.17$; the remaining positive terms push it up toward $5.44$."
  },
  "ap-rr-001": {
    "spot": "The lamp, the person, and the tip of the shadow form two similar triangles: use the similarity ratio to write \"the position of the shadow's tip\" as a multiple of the person's position, then differentiate in time.",
    "why": "The similarity ratio gives the linear relation $s=\\frac{5}{3}x$, so differentiating just multiplies by a constant. No need to find the shadow length and add it back.",
    "steps": [
      "Let the person be $x$ from the lamppost and the shadow's tip be $s$ from it. Similar triangles: $\\frac{5}{s}=\\frac{2}{s-x}$, i.e. $5(s-x)=2s$.",
      "Solve: $s=\\frac{5}{3}x$.",
      "Differentiate in time: $\\frac{ds}{dt}=\\frac{5}{3}\\cdot\\frac{dx}{dt}=\\frac{5}{3}\\cdot 1.5=2.5$ m/s."
    ],
    "trap": "Computing the rate of change of the shadow length $s-x=\\frac{2}{3}x$, which is $1$ m/s. The problem asks for the speed of the shadow's tip, so you must add the person's own $1.5$.",
    "check": "Tip speed $=$ person's speed $+$ rate the shadow lengthens: $1.5+\\frac{2}{3}\\cdot 1.5=2.5$."
  },
  "ap-rr-003": {
    "spot": "North and east are perpendicular, so the distance between the ships is the hypotenuse of a right triangle. And since both speeds are constant and they start together from the same place, the distance itself is a multiple of $t$.",
    "why": "$D=\\sqrt{(30t)^2+(40t)^2}=50t$, so you do not even need implicit differentiation.",
    "steps": [
      "After $t$ hours the ships have gone $30t$ and $40t$, so the distance is $D=\\sqrt{900t^2+1600t^2}=50t$.",
      "At $t=1$: the ships are at $(0,30)$ and $(40,0)$, distance $50$; legs $30$, $40$, hypotenuse $50$.",
      "$\\frac{dD}{dt}=50$, independent of $t$, so at $t=1$ it is also $50$ km/h."
    ],
    "trap": "Adding the speeds to get $70$. The ships separate in perpendicular directions, so combine them with the Pythagorean theorem.",
    "check": "Implicit differentiation gives the same: $D\\,D'=x\\,x'+y\\,y'$, so $50D'=30\\cdot 30+40\\cdot 40=2500$ and $D'=50$."
  },
  "ch-inv-002": {
    "spot": "Three layers: $\\arctan$ outside, $\\sinh$ in the middle, $x^3$ inside. And $1+\\sinh^2u=\\cosh^2u$ lets the $\\arctan$ denominator cancel against the derivative of $\\sinh$.",
    "why": "Peel off the layers with the Chain Rule, then simplify with the hyperbolic identity; only $\\frac{3x^2}{\\cosh(x^3)}$ is left.",
    "steps": [
      "Outer: $(\\arctan w)'=\\frac{1}{1+w^2}$, with $w=\\sinh(x^3)$.",
      "Middle and inner: $\\frac{d}{dx}\\sinh(x^3)=\\cosh(x^3)\\cdot 3x^2$.",
      "Together: $\\frac{3x^2\\cosh(x^3)}{1+\\sinh^2(x^3)}$, and $1+\\sinh^2u=\\cosh^2u$ reduces it to $\\frac{3x^2}{\\cosh(x^3)}$."
    ],
    "trap": "Dropping the innermost $3x^2$ and writing $\\frac{1}{\\cosh(x^3)}$.",
    "check": "At $x=0$ the derivative is $0$ (near $0$ the function behaves like $x^3$, very flat), and the formula also gives $0$."
  },
  "ch-inv-004": {
    "spot": "$\\arctan$ outside, $\\tanh x$ inside: two layers, and the inner derivative is $\\operatorname{sech}^2x=\\frac{1}{\\cosh^2x}$.",
    "why": "Straight Chain Rule: the outer layer gives $\\frac{1}{1+\\tanh^2x}$, the inner gives $\\frac{1}{\\cosh^2x}$, and their product is the form of the answer.",
    "steps": [
      "Outer: $\\frac{1}{1+w^2}$, with $w=\\tanh x$.",
      "Inner: $(\\tanh x)'=\\frac{1}{\\cosh^2x}$.",
      "Multiply: $\\frac{1}{(1+\\tanh^2x)\\cosh^2x}$."
    ],
    "trap": "Remembering $(\\tanh x)'$ as $1-\\tanh x$, or as $\\sec^2x$ (that one belongs to $\\tan x$).",
    "check": "Simplified, it is actually $\\frac{1}{\\cosh^2x+\\sinh^2x}=\\frac{1}{\\cosh 2x}$; at $x=0$ it equals $1$."
  },
  "ch-inv-005": {
    "spot": "$\\sinh$ outside, $\\arctan$ in the middle, $x^2$ inside: three layers, each contributing one factor from the outside in.",
    "why": "There is nothing to simplify first, so multiplying the three Chain Rule factors directly is fastest.",
    "steps": [
      "Outer: $(\\sinh w)'=\\cosh w$, with $w=\\arctan(x^2)$.",
      "Middle: $(\\arctan u)'=\\frac{1}{1+u^2}$ with $u=x^2$, giving $\\frac{1}{1+x^4}$.",
      "Inner: $2x$; multiplying all three gives $\\frac{2x\\cosh(\\arctan x^2)}{1+x^4}$."
    ],
    "trap": "Writing the middle denominator as $1+x^2$: the derivative of $\\arctan$ takes its argument $x^2$, and squaring that gives $x^4$.",
    "check": "At $x=1$: $\\frac{2\\cosh(\\pi/4)}{2}=\\cosh\\frac{\\pi}{4}\\approx 1.324$."
  },
  "ch-mix-003": {
    "spot": "Numerator and denominator are each a composite function: the frame is a quotient, and inside, $\\sin(x^3)$ and $\\cos(x^2)$ each need the Chain Rule.",
    "why": "Set up the frame with the Quotient Rule $\\frac{f'g-fg'}{g^2}$ first, then compute $f'$ and $g'$ separately; that way no term gets lost.",
    "steps": [
      "$f=\\sin(x^3)$: $f'=3x^2\\cos(x^3)$.",
      "$g=\\cos(x^2)$: $g'=-2x\\sin(x^2)$.",
      "Quotient Rule: $\\frac{3x^2\\cos(x^3)\\cos(x^2)-\\sin(x^3)\\cdot(-2x\\sin(x^2))}{\\cos^2(x^2)}$; the two minus signs make a plus."
    ],
    "trap": "Mishandling the minus sign of $g'$ together with the minus in the Quotient Rule, leaving a minus on the second term.",
    "check": "At $x=0.5$, compare the formula with a numerical derivative."
  },
  "ch-mix-007": {
    "spot": "The frame is a fraction divided by $x$, and the numerator $\\tan\\sqrt x$ is a two-layer composite: Quotient Rule plus one Chain Rule.",
    "why": "You could also write it as $x^{-1}\\tan\\sqrt x$ and use the Product Rule, with the same result; the Quotient Rule gives the answer's arrangement directly.",
    "steps": [
      "Numerator's derivative: $(\\tan\\sqrt x)'=\\sec^2\\sqrt x\\cdot\\frac{1}{2\\sqrt x}$.",
      "Quotient Rule: $\\frac{x\\cdot\\frac{\\sec^2\\sqrt x}{2\\sqrt x}-\\tan\\sqrt x}{x^2}$.",
      "$\\frac{x}{2\\sqrt x}=\\frac{\\sqrt x}{2}$, so the derivative $=\\frac{\\frac{\\sqrt x}{2\\cos^2\\sqrt x}-\\tan\\sqrt x}{x^2}$."
    ],
    "trap": "Missing the inner $\\frac{1}{2\\sqrt x}$ and writing the first numerator term as $x\\sec^2\\sqrt x$.",
    "check": "At $x=1$: $\\frac{\\frac{1}{2}\\sec^21-\\tan 1}{1}\\approx 1.713-1.557=0.155$."
  },
  "ch-mix-008": {
    "spot": "A product of two functions, $e^{x^2}$ and $\\ln(\\sin x)$, each a two-layer composite — Product Rule on the outside, one Chain Rule inside each.",
    "why": "The Product Rule splits the problem into two small Chain Rules, each with only two layers.",
    "steps": [
      "$(e^{x^2})'=2xe^{x^2}$.",
      "$(\\ln\\sin x)'=\\frac{\\cos x}{\\sin x}$.",
      "Product Rule: $2xe^{x^2}\\ln(\\sin x)+e^{x^2}\\cdot\\frac{\\cos x}{\\sin x}$."
    ],
    "trap": "Writing $(\\ln\\sin x)'$ as $\\frac{1}{\\sin x}$ and forgetting the inner $\\cos x$.",
    "check": "At $x=\\frac{\\pi}{2}$: $\\ln 1=0$ and $\\cos=0$, so both terms are $0$ and the derivative is $0$."
  },
  "ch-mix-009": {
    "spot": "A fraction with numerator $\\sqrt{1+x^2}$ and denominator $\\sin 2x$, each a two-layer composite — Quotient Rule plus two Chain Rules.",
    "why": "Write the frame $\\frac{f'g-fg'}{g^2}$ first, then fill in the two Chain Rules, and the order never gets mixed up.",
    "steps": [
      "$f=\\sqrt{1+x^2}$: $f'=\\frac{x}{\\sqrt{1+x^2}}$.",
      "$g=\\sin 2x$: $g'=2\\cos 2x$.",
      "Quotient Rule: $\\frac{\\frac{x}{\\sqrt{1+x^2}}\\sin 2x-2\\sqrt{1+x^2}\\cos 2x}{\\sin^22x}$."
    ],
    "trap": "Forgetting the inner $2$ in $g'$ and writing $\\cos 2x$.",
    "check": "At $x=\\frac{\\pi}{4}$: $\\cos\\frac{\\pi}{2}=0$ and $\\sin\\frac{\\pi}{2}=1$, so the derivative $=\\frac{\\pi/4}{\\sqrt{1+\\pi^2/16}}\\approx 0.618$."
  },
  "ch-mix-012": {
    "spot": "$\\cos^2(\\cdot)$ is \"a square on the outside of $\\cos$\", which in turn wraps $\\ln(1+x^2)$: four layers, peeled from the outside in.",
    "why": "The outermost layer is the square, giving $2\\cos(\\cdot)$, then $-\\sin(\\cdot)$, then $\\frac{1}{1+x^2}$, and finally $2x$.",
    "steps": [
      "Square layer: $(w^2)'=2w$, with $w=\\cos(\\ln(1+x^2))$.",
      "$\\cos$ layer: $-\\sin(\\ln(1+x^2))$.",
      "$\\ln$ layer and innermost layer: $\\frac{2x}{1+x^2}$.",
      "Multiply: $-\\frac{4x\\cos(\\ln(1+x^2))\\sin(\\ln(1+x^2))}{1+x^2}$."
    ],
    "trap": "Differentiating $\\cos^2u$ as if it were $\\cos(u^2)$, with the order reversed.",
    "check": "It can also be written $-\\frac{2x\\sin(2\\ln(1+x^2))}{1+x^2}$ (double angle); the two agree."
  },
  "ch-nest-013": {
    "spot": "$\\tan(\\sin(\\cos(\\ln x)))$ is a four-layer nesting doll: from outside in, $\\tan$, $\\sin$, $\\cos$, $\\ln$, each contributing one factor.",
    "why": "There is no room to simplify; it is a Chain Rule endurance test. Write one factor per layer, then multiply.",
    "steps": [
      "$\\tan$ layer: $\\sec^2(\\sin(\\cos\\ln x))=\\frac{1}{\\cos^2(\\sin(\\cos\\ln x))}$.",
      "$\\sin$ layer: $\\cos(\\cos\\ln x)$.",
      "$\\cos$ layer and $\\ln$ layer: $-\\sin(\\ln x)\\cdot\\frac{1}{x}$.",
      "Multiply: $-\\frac{\\cos(\\cos\\ln x)\\sin(\\ln x)}{x\\cos^2(\\sin(\\cos\\ln x))}$."
    ],
    "trap": "Forgetting the innermost $\\frac{1}{x}$, or losing the minus sign from the $\\cos$ layer.",
    "check": "At $x=1$: $\\ln 1=0$ and $\\sin 0=0$, so the derivative $=0$."
  },
  "cl-der-017": {
    "spot": "Asked for the center of curvature: from the point on the curve, go along the normal toward the concave side a distance equal to the radius of curvature. The formula $X=x-\\frac{y'(1+y'^2)}{y''}$ needs only $y'$ and $y''$.",
    "why": "You could compute the radius of curvature and then find the normal vector, but the formula packages the direction and the length at once.",
    "steps": [
      "$y'=2x$, which is $2$ at $x=1$; $y''=2$.",
      "$1+y'^2=5$.",
      "$X=1-\\frac{2\\cdot 5}{2}=-4$."
    ],
    "trap": "Flipping the sign to get $x+\\frac{y'(1+y'^2)}{y''}=6$. At $(1,1)$ the parabola slopes up to the right, so the concave side (inward normal) points up and to the left, and $X$ must get smaller.",
    "check": "The distance from the center to $(1,1)$ should equal the radius of curvature $\\frac{5^{3/2}}{2}$: $Y=1+\\frac{5}{2}=3.5$, and $\\sqrt{25+6.25}=\\frac{5\\sqrt5}{2}$."
  },
  "cl-der-018": {
    "spot": "You need the $Y$ of the center of curvature: the formula is $Y=y+\\frac{1+y'^2}{y''}$. Every derivative of $e^x$ at $0$ is $1$, so plugging in is as clean as it gets.",
    "why": "$y''>0$ means the curve is concave up, so the center is above the point and $Y$ adds a positive amount.",
    "steps": [
      "$y'=y''=e^x$, both equal to $1$ at $x=0$.",
      "$1+y'^2=2$.",
      "$Y=1+\\frac{2}{1}=3$."
    ],
    "trap": "Remembering the sign backwards as $Y=y-\\frac{1+y'^2}{y''}=-1$, which puts the center below the curve; with $y''>0$ the curve is concave up, so the center must be above. Or forgetting to add $y$ itself and answering $2$.",
    "check": "$X=0-\\frac{1\\cdot 2}{1}=-2$; the distance from the center $(-2,3)$ to $(0,1)$ is $2\\sqrt2$, equal to the radius of curvature $\\frac{2^{3/2}}{1}$."
  },
  "cl-int-032": {
    "spot": "A circle revolved once around an axis that does not cross it: a torus. The distance from the center to the axis is $3$ and the circumference is $2\\pi$ — Pappus's theorem, just multiply.",
    "why": "Pappus: surface area $=$ curve length $\\times$ distance traveled by the centroid. The surface-of-revolution integral would need upper and lower semicircles; it works, but is much longer.",
    "steps": [
      "Curve length: the circumference of a radius-$1$ circle, $2\\pi$.",
      "The centroid (the center) is $3$ from the $y$-axis, so one revolution travels $2\\pi\\cdot 3=6\\pi$.",
      "Surface area $=2\\pi\\cdot 6\\pi=12\\pi^2\\approx 118.4$. With the parametrization $x=3+\\cos t$ and arc-length element $dt$: $\\int_0^{2\\pi}2\\pi(3+\\cos t)\\,dt$ agrees."
    ],
    "trap": "Computing the volume $2\\pi^2Rr^2=6\\pi^2$ instead; or swapping the radius $1$ and the distance $3$, using some wrong combination other than circumference times path $2\\pi$ with $6\\pi$, e.g. $4\\pi r^2\\cdot R=12\\pi$.",
    "check": "The torus area formula $4\\pi^2Rr$ with $R=3$, $r=1$ gives $12\\pi^2$."
  },
  "cx-cont-003": {
    "spot": "At $x=0$, $\\frac{\\sin 3x}{x}$ is $\\frac{0}{0}$. For continuity, $k$ must equal the limit as $x\\to 0$, and $\\frac{\\sin 3x}{3x}\\to 1$.",
    "why": "Rearranging into the standard limit $\\frac{\\sin u}{u}\\to 1$ finishes in one line, no L'Hôpital's Rule needed.",
    "steps": [
      "Continuity condition: $k=f(0)=\\lim_{x\\to 0}\\frac{\\sin 3x}{x}$.",
      "Rearrange: $\\frac{\\sin 3x}{x}=3\\cdot\\frac{\\sin 3x}{3x}$, and $\\frac{\\sin u}{u}\\to 1$.",
      "So $k=3$."
    ],
    "trap": "Seeing $\\sin$ and assuming the limit is $1$, forgetting the $3$ in $3x$.",
    "check": "Plug in $x=0.01$: $\\frac{\\sin 0.03}{0.01}\\approx 2.99955$."
  },
  "cx-exam-008": {
    "spot": "The shape $\\frac{1}{n}x^n$: this is $-\\ln(1-x)=\\sum\\frac{x^n}{n}$ evaluated at $x=\\frac{1}{2}$.",
    "why": "Once you recognize the power series, just plug in. The partial sums have no closed form, and the Ratio Test only decides convergence.",
    "steps": [
      "$\\frac{1}{1-x}=\\sum_{n\\ge 0}x^n$; integrate both sides from $0$ to $x$: $-\\ln(1-x)=\\sum_{n\\ge 1}\\frac{x^n}{n}$.",
      "$\\frac{1}{n2^n}=\\frac{x^n}{n}$ with $x=\\frac{1}{2}$, inside the interval of convergence $|x|<1$, so it is valid to plug in.",
      "Plug in $x=\\frac{1}{2}$: $\\sum\\frac{1}{n2^n}=-\\ln\\frac{1}{2}=\\ln 2\\approx 0.693$."
    ],
    "trap": "Remembering it as $\\ln(1-x)$, missing a minus sign, and answering $-\\ln 2$. A series of positive terms cannot be negative.",
    "check": "First three terms: $\\frac{1}{2}+\\frac{1}{8}+\\frac{1}{24}\\approx 0.667$; adding more positive terms approaches $0.693$."
  },
  "cx-hl-006": {
    "spot": "$x^{1/x}-1$: $x^{1/x}=e^{\\ln x/x}$ and $\\frac{\\ln x}{x}\\to 0$ — use $e^u-1\\approx u$ to replace it with $\\frac{\\ln x}{x}$.",
    "why": "One equivalent-infinitesimal swap turns the numerator into $x\\cdot\\frac{\\ln x}{x}=\\ln x$, which cancels the denominator directly. L'Hôpital's Rule would require differentiating $x^{1/x}$, which is messy.",
    "steps": [
      "$x^{1/x}=e^{u}$, with $u=\\frac{\\ln x}{x}\\to 0$.",
      "$e^u-1\\sim u$: $\\frac{e^u-1}{u}\\to 1$.",
      "So the numerator $x(x^{1/x}-1)\\sim x\\cdot\\frac{\\ln x}{x}=\\ln x$, and the ratio $\\to 1$. The error is about $\\frac{\\ln x}{2x}$, so convergence is slow; for large $x$ the value sits between $1$ and $1+\\frac{\\ln x}{x}$."
    ],
    "trap": "Thinking $x^{1/x}\\to 1$, so the numerator is $x\\cdot 0=0$. This is an $\\infty\\cdot 0$ indeterminate form; you must see how fast $x^{1/x}-1$ shrinks.",
    "check": "Plug in $x=10^4$: the ratio is about $1.00046$, slightly above $1$, matching $1+\\frac{\\ln x}{2x}$."
  },
  "cx-hm-004": {
    "spot": "You need the $100$th derivative at $0$: the Taylor series of $x\\sin x$ is easy to write, and $f^{(100)}(0)=100!\\times(x^{100}\\text{ coefficient})$.",
    "why": "Differentiating a hundred times is hopeless. Multiply the series of $\\sin x$ by $x$ and find the $x^{100}$ term. The Leibniz rule also works.",
    "steps": [
      "$x\\sin x=\\sum_{k\\ge 0}\\frac{(-1)^kx^{2k+2}}{(2k+1)!}$. For example, the $x^2$ coefficient $1$ corresponds to $f''(0)=2$.",
      "$x^{100}$: $2k+2=100$ gives $k=49$, coefficient $\\frac{(-1)^{49}}{99!}=-\\frac{1}{99!}$.",
      "$f^{(100)}(0)=100!\\cdot\\left(-\\frac{1}{99!}\\right)=-100$. (Leibniz: $f^{(n)}(0)=n\\sin^{(n-1)}(0)$, and $\\sin^{(99)}(0)=-1$.)"
    ],
    "trap": "Getting the coefficient right but forgetting to multiply by $100!$, answering $-\\frac{1}{99!}$; or flipping the sign and answering $100$.",
    "check": "The same pattern for small $n$: $f^{(4)}(0)=4\\sin'''(0)=-4$, which matches the $x^4$ coefficient $-\\frac{1}{6}$ times $4!$."
  },
  "cx-ser-008": {
    "spot": "$\\sum\\frac{1}{n!}$ starting from $n=0$: this is the Taylor series of $e^x$ at $x=1$.",
    "why": "Recognize the series as the definition and write $e$ directly; no need to estimate partial sums.",
    "steps": [
      "$e^x=\\sum_{n\\ge 0}\\frac{x^n}{n!}$ (converges for all $x$).",
      "Plug in $x=1$: each term $\\frac{1^n}{n!}=\\frac{1}{n!}$ is exactly the problem's term, including the $1$ at $n=0$.",
      "Plug in $x=1$: $\\sum_{n\\ge 0}\\frac{1}{n!}=e\\approx 2.718$."
    ],
    "trap": "Thinking it starts at $n=1$ and answering $e-1$. The problem's $n=0$ term is $\\frac{1}{0!}=1$.",
    "check": "First five terms: $1+1+\\frac{1}{2}+\\frac{1}{6}+\\frac{1}{24}\\approx 2.708$, very close to $2.718$."
  },
  "db-chain-005": {
    "spot": "$\\cos(\\sin(x^2))$: three layers, $\\cos$ outside, $\\sin$ in the middle, $x^2$ inside.",
    "why": "The Chain Rule gives one factor per layer from the outside in: $-\\sin(\\cdot)$, $\\cos(\\cdot)$, $2x$.",
    "steps": [
      "Outer: $-\\sin(\\sin(x^2))$.",
      "Middle and inner: $(\\sin(x^2))'=2x\\cos(x^2)$.",
      "Multiply: $-2x\\sin(\\sin(x^2))\\cos(x^2)$."
    ],
    "trap": "Getting the argument of the outer derivative wrong, writing $-\\sin(x^2)$. The outer layer must keep the whole $\\sin(x^2)$.",
    "check": "At $x=0$ the derivative is $0$ (an even function is horizontal at the origin)."
  },
  "db-chain-007": {
    "spot": "$\\arctan$ outside, $e^{2x}$ inside: two layers, and after substituting, the $\\arctan$ denominator is $1+e^{4x}$.",
    "why": "Straight Chain Rule: $\\frac{1}{1+u^2}\\cdot u'$, with $u=e^{2x}$ and $u'=2e^{2x}$.",
    "steps": [
      "Outer: $\\frac{1}{1+(e^{2x})^2}=\\frac{1}{1+e^{4x}}$.",
      "Inner: $(e^{2x})'=2e^{2x}$.",
      "Multiply: $\\frac{2e^{2x}}{1+e^{4x}}$."
    ],
    "trap": "Writing $(e^{2x})^2$ as $e^{4x^2}$ or $e^{2x^2}$. The exponent law is $(e^a)^2=e^{2a}$.",
    "check": "At $x=0$: $\\frac{2}{2}=1$, matching the numerical derivative."
  },
  "db-chain-008": {
    "spot": "Numerator $x$, denominator $\\sqrt{1-x^2}$: Quotient Rule, with one more Chain Rule for the root in the denominator; after combining fractions, $(1-x^2)^{3/2}$ appears.",
    "why": "After combining the numerator, the $x^2$ cancels exactly and the result is very clean. Writing it as $x(1-x^2)^{-1/2}$ and using the Product Rule works too.",
    "steps": [
      "$(\\sqrt{1-x^2})'=\\frac{-x}{\\sqrt{1-x^2}}$.",
      "Quotient Rule: $\\frac{\\sqrt{1-x^2}-x\\cdot\\frac{-x}{\\sqrt{1-x^2}}}{1-x^2}=\\frac{\\frac{1-x^2+x^2}{\\sqrt{1-x^2}}}{1-x^2}$.",
      "The numerator simplifies to $1$, giving $\\frac{1}{(1-x^2)^{3/2}}$."
    ],
    "trap": "Dropping the minus sign in the denominator's derivative and getting $\\frac{1-2x^2}{(1-x^2)^{3/2}}$.",
    "check": "At $x=0$ the derivative is $1$: near the origin $\\frac{x}{\\sqrt{1-x^2}}\\approx x$."
  },
  "db-def-005": {
    "spot": "It has the shape $\\frac{f(1+h)-f(1)}{h}$, and $\\frac{\\pi}{4}=\\arctan 1$: this is the definition of the derivative of $\\arctan$ at $x=1$.",
    "why": "Once you recognize the derivative definition, use the formula $\\frac{1}{1+x^2}$ directly; grinding out the limit is the long way round.",
    "steps": [
      "$\\arctan 1=\\frac{\\pi}{4}$, so the expression is $\\frac{f(1+h)-f(1)}{h}$ with $f=\\arctan$.",
      "The limit $=f'(1)$, and $(\\arctan x)'=\\frac{1}{1+x^2}$.",
      "$f'(1)=\\frac{1}{2}$."
    ],
    "trap": "Remembering the derivative as $\\frac{1}{\\sqrt{1-x^2}}$ (that is $\\arcsin$), which even blows up at $x=1$.",
    "check": "Plug in $h=0.001$: $\\frac{\\arctan 1.001-\\pi/4}{0.001}\\approx 0.49975$."
  },
  "db-itrig-004": {
    "spot": "$\\arctan$ outside, $\\sqrt{x^2+1}$ inside: two layers. The $\\arctan$ denominator $1+u^2$ with $u^2=x^2+1$ becomes $x^2+2$.",
    "why": "Straight Chain Rule: outer $\\frac{1}{1+u^2}$, inner $\\frac{x}{\\sqrt{x^2+1}}$; replace $u^2$ when multiplying and the simplification is done.",
    "steps": [
      "Outer: $\\frac{1}{1+u^2}$ with $u=\\sqrt{x^2+1}$, $u^2=x^2+1$, so the denominator $=x^2+2$.",
      "Inner: $(\\sqrt{x^2+1})'=\\frac{x}{\\sqrt{x^2+1}}$.",
      "Multiply: $\\frac{x}{(x^2+2)\\sqrt{x^2+1}}$."
    ],
    "trap": "Writing the denominator as $1+\\sqrt{x^2+1}$ or $1+(x^2+1)^{1/2}$, forgetting that the argument is squared in the derivative of $\\arctan$.",
    "check": "At $x=0$ the derivative is $0$: the function is even, so it is horizontal at the origin."
  },
  "db-lin-005": {
    "spot": "$0.98$ is very close to $1$, and $1^5=1$ is easy: do a linear approximation of $f(x)=x^5$ at $x=1$.",
    "why": "$f(a+\\Delta)\\approx f(a)+f'(a)\\Delta$ needs only one derivative; expanding $0.98^5$ directly takes five multiplications.",
    "steps": [
      "$f(x)=x^5$, $a=1$: $f(1)=1$.",
      "$f'(x)=5x^4$, $f'(1)=5$.",
      "$\\Delta=-0.02$: $f(0.98)\\approx 1+5\\cdot(-0.02)=0.9$."
    ],
    "trap": "Getting the sign of $\\Delta$ wrong and computing $1.1$. Since $0.98<1$, its fifth power must be less than $1$.",
    "check": "The true value $0.98^5\\approx 0.9039$; the approximation $0.9$ is slightly low ($x^5$ is concave up, so the tangent line lies below)."
  },
  "db-mot-004": {
    "spot": "\"Marginal cost\" is the derivative of the cost function, $C'(x)$, evaluated at $x=20$.",
    "why": "Just differentiate the polynomial term by term; no need to compute $C(21)-C(20)$.",
    "steps": [
      "$C'(x)=0.03x^2-1.2x+13$.",
      "Term by term at $x=20$: $0.03\\cdot 400=12$, $1.2\\cdot 20=24$.",
      "At $x=20$: $0.03\\cdot 400-1.2\\cdot 20+13=12-24+13=1$."
    ],
    "trap": "Plugging into $C(20)$ itself (total cost $100$) instead of the derivative.",
    "check": "Difference approximation: $C(20.01)-C(20)\\approx 0.01\\times 1$."
  },
  "db-tan-005": {
    "spot": "Write the tangent line, then set $y=0$ to find the $x$-intercept — the same move as Newton's method: $x=a-\\frac{f(a)}{f'(a)}$.",
    "why": "Point-slope form needs only the point of tangency and the slope; setting $y=0$ solves it in one line.",
    "steps": [
      "Point of tangency: $f(2)=4-2=2$.",
      "Slope: $f'(2)=4$.",
      "Tangent line $y=2+4(x-2)$; set $y=0$: $x=2-\\frac{2}{4}=\\frac{3}{2}$."
    ],
    "trap": "Finding the $y$-intercept instead ($y=-6$ when $x=0$), or solving for the curve's own root $\\sqrt 2$.",
    "check": "$\\frac{3}{2}$ is exactly the first Newton's method step toward $\\sqrt 2\\approx 1.414$ starting from $2$, and it is closer to the root than $2$."
  },
  "db-tan-007": {
    "spot": "It asks for the normal line, not the tangent line: the normal slope is the negative reciprocal of the tangent slope, $-\\frac{1}{f'(a)}$; then set $x=0$.",
    "why": "Find the tangent slope $2$, take the negative reciprocal $-\\frac{1}{2}$, and plug $x=0$ into point-slope form.",
    "steps": [
      "Tangent slope: $f'(1)=2$.",
      "Normal slope: $-\\frac{1}{2}$; normal line $y=1-\\frac{1}{2}(x-1)$.",
      "Set $x=0$: $y=1+\\frac{1}{2}=\\frac{3}{2}$."
    ],
    "trap": "Using the tangent line and getting the $y$-intercept $-1$; or taking only the reciprocal for the normal slope without the minus sign, getting $\\frac{1}{2}$.",
    "check": "The normal line passes through the concave side of the parabola $y=x^2$, so an intercept of $\\frac{3}{2}$, above $(1,1)$, makes sense; the normal direction $(-2,1)$ and the tangent direction $(1,2)$ have dot product $0$."
  },
  "dd-inv-002": {
    "spot": "$\\frac{x}{1+\\sqrt{1+x^2}}$ looks like the half-angle formula $\\tan\\frac{\\theta}{2}=\\frac{\\tan\\theta}{1+\\sec\\theta}$: let $x=\\tan\\theta$, and the whole expression is $\\frac{\\theta}{2}=\\frac{1}{2}\\arctan x$.",
    "why": "Simplify first and the derivative takes one line; the direct Chain Rule means differentiating a fraction with a root and then simplifying a long mess.",
    "steps": [
      "Let $x=\\tan\\theta$ ($-\\frac{\\pi}{2}<\\theta<\\frac{\\pi}{2}$); then $\\sqrt{1+x^2}=\\sec\\theta$.",
      "$\\frac{\\tan\\theta}{1+\\sec\\theta}=\\frac{\\sin\\theta}{1+\\cos\\theta}=\\tan\\frac{\\theta}{2}$, so the expression $=\\frac{\\theta}{2}=\\frac{1}{2}\\arctan x$.",
      "Differentiate: $\\frac{1}{2(1+x^2)}$."
    ],
    "trap": "Missing the simplification and differentiating by brute force, then cancelling the $\\sqrt{1+x^2}$ terms wrongly at the end, often getting $\\frac{1}{1+x^2}$ — missing a factor of $\\frac{1}{2}$.",
    "check": "At $x=0$: $\\frac{1}{2}$, matching the numerical derivative."
  },
  "dd-invf-004": {
    "spot": "It asks for the derivative of $g=f^{-1}$ at $7$, but $f^{-1}$ cannot be written down: use the inverse derivative $g'(b)=\\frac{1}{f'(a)}$, finding the $a$ with $f(a)=7$ first.",
    "why": "$f(x)=(x+1)^3-1$, so you can see $f(1)=7$; no cubic formula needed.",
    "steps": [
      "Find $a$: $f(1)=1+3+3=7$, so $g(7)=1$.",
      "$f'(x)=3x^2+6x+3=3(x+1)^2$, $f'(1)=12$.",
      "$g'(7)=\\frac{1}{f'(1)}=\\frac{1}{12}$."
    ],
    "trap": "Plugging $7$ straight into $f'$ to get $\\frac{1}{f'(7)}=\\frac{1}{192}$. The point to use is $g(7)=1$.",
    "check": "The inverse can actually be written: $g(y)=\\sqrt[3]{y+1}-1$, whose derivative at $7$ is $\\frac{1}{3}\\cdot 8^{-2/3}=\\frac{1}{12}$."
  },
  "dd-log-004": {
    "spot": "$x^{1/x}$ has $x$ in both the base and the exponent: logarithmic differentiation, $\\ln y=\\frac{\\ln x}{x}$.",
    "why": "After taking logs you have the simple quotient $\\frac{\\ln x}{x}$; differentiate and multiply back by $y$. Neither the power rule nor the exponential rule applies directly.",
    "steps": [
      "$\\ln y=\\frac{\\ln x}{x}$.",
      "Differentiate: $\\frac{y'}{y}=\\frac{\\frac{1}{x}\\cdot x-\\ln x}{x^2}=\\frac{1-\\ln x}{x^2}$.",
      "$y'=x^{1/x}\\cdot\\frac{1-\\ln x}{x^2}$."
    ],
    "trap": "Treating it as a power function: $\\frac{1}{x}\\cdot x^{1/x-1}$ — the exponent $\\frac{1}{x}$ is changing too, so the $\\ln x$ term is lost.",
    "check": "At $x=e$ the derivative is $0$: $x^{1/x}$ has its maximum at $x=e$."
  },
  "dd-nest-006": {
    "spot": "$\\sin(\\cos(\\tan x))$: three layers, $\\sin$ outside, $\\cos$ in the middle, $\\tan$ inside.",
    "why": "Three Chain Rule factors: $\\cos(\\cdot)$, $-\\sin(\\cdot)$, $\\sec^2x$.",
    "steps": [
      "Outer: $\\cos(\\cos(\\tan x))$.",
      "Middle: $-\\sin(\\tan x)$; inner: $\\sec^2x=\\frac{1}{\\cos^2x}$.",
      "Multiply: $-\\frac{\\cos(\\cos(\\tan x))\\sin(\\tan x)}{\\cos^2x}$."
    ],
    "trap": "Missing the minus sign from the middle layer, or writing the inner $(\\tan x)'$ as $\\sec x$.",
    "check": "At $x=0$: $\\sin(\\tan 0)=0$, so the derivative is $0$."
  },
  "dd-nest-007": {
    "spot": "The cube root of a whole fraction: outer $u^{1/3}$, inner $\\frac{x+1}{x-1}$ is a quotient — power Chain Rule plus the Quotient Rule.",
    "why": "The outer layer gives $\\frac{1}{3}u^{-2/3}$, and the inner quotient's derivative $\\frac{(x-1)-(x+1)}{(x-1)^2}=\\frac{-2}{(x-1)^2}$ is clean; multiply them for the answer.",
    "steps": [
      "Inner: $\\left(\\frac{x+1}{x-1}\\right)'=\\frac{-2}{(x-1)^2}$.",
      "Outer: $\\frac{1}{3}u^{-2/3}$.",
      "Multiply: $-\\frac{2}{3\\left(\\frac{x+1}{x-1}\\right)^{2/3}(x-1)^2}$."
    ],
    "trap": "Computing the quotient's numerator as $(x-1)+(x+1)=2x$, which gives a plus sign and an extra $x$.",
    "check": "At $x=2$: $u=3$, so the derivative $=-\\frac{2}{3\\cdot 3^{2/3}}\\approx -0.32$; the function is decreasing for $x>1$, so the sign is right."
  },
  "dd-nest-008": {
    "spot": "$e^{e^{\\sin x}}$: a power tower with three layers — outer $e^{(\\cdot)}$, middle $e^{(\\cdot)}$, inner $\\sin x$.",
    "why": "The derivative of $e^u$ is itself times $u'$; just keep multiplying down the layers.",
    "steps": [
      "Outer: $e^{e^{\\sin x}}\\cdot(e^{\\sin x})'$.",
      "Middle and inner: $(e^{\\sin x})'=e^{\\sin x}\\cos x$.",
      "Multiply: $e^{e^{\\sin x}}e^{\\sin x}\\cos x$."
    ],
    "trap": "Differentiating $e^{e^{\\sin x}}$ as if it were $e^{e\\sin x}$, getting $e\\cos x\\,e^{e\\sin x}$.",
    "check": "At $x=0$: $e^{1}\\cdot 1\\cdot 1=e$."
  },
  "dd-par-002": {
    "spot": "Parametric equations: $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$; evaluate each derivative at $t=\\frac{\\pi}{6}$, then divide.",
    "why": "Eliminating $t$ to get $y=2x\\sqrt{1-x^2}$ also works, but you have to check the branch; the parametric formula is direct.",
    "steps": [
      "$\\frac{dx}{dt}=-\\sin t$, which is $-\\frac{1}{2}$ at $\\frac{\\pi}{6}$.",
      "$\\frac{dy}{dt}=2\\cos 2t$, which at $\\frac{\\pi}{6}$ is $2\\cos\\frac{\\pi}{3}=1$.",
      "$\\frac{dy}{dx}=\\frac{1}{-1/2}=-2$."
    ],
    "trap": "Forgetting the inner $2$ in $\\frac{dy}{dt}$, getting $\\cos\\frac{\\pi}{3}$ and answering $-1$; or dropping the minus sign in the derivative of $\\cos$ and answering $2$.",
    "check": "Eliminate $t$: $y=2x\\sqrt{1-x^2}$ (at $t=\\frac{\\pi}{6}$, $x=\\frac{\\sqrt3}{2}$), and the slope there is also $-2$."
  },
  "dd-pw-004": {
    "spot": "The pieces join at $x=4$, and the function must be \"differentiable everywhere\": at the junction it must be both continuous (equal values) and differentiable (equal slopes) — two equations for $a,b$.",
    "why": "Use equal slopes to get $a$, then equal values to get $b$; continuity alone cannot determine two unknowns.",
    "steps": [
      "Equal slopes: $a=(\\sqrt x)'\\big|_{x=4}=\\frac{1}{2\\sqrt 4}=\\frac{1}{4}$.",
      "Equal values: $4a+b=\\sqrt 4=2$.",
      "$b=2-4\\cdot\\frac{1}{4}=1$."
    ],
    "trap": "Using only the continuity condition $4a+b=2$ and picking $a$ arbitrarily; or evaluating the slope at the wrong point to get $\\frac{1}{2}$, giving $b=0$.",
    "check": "The line $y=\\frac{x}{4}+1$ is exactly the tangent line to $\\sqrt x$ at $x=4$, and its value at $x=0$ is precisely $b$."
  },
  "dd-rr-006": {
    "spot": "The plane's altitude is fixed at $2$ while its horizontal position $x$ changes, and the straight-line distance $s$ is the hypotenuse: $s^2=x^2+4$; differentiate implicitly in time.",
    "why": "$s\\,s'=x\\,x'$ links $s'$ to the known $x'=500$ in one line; no need to write $x$ as a function of $t$.",
    "steps": [
      "When $s=5$, $x=\\sqrt{25-4}=\\sqrt{21}$.",
      "Differentiate $s^2=x^2+4$: $s\\frac{ds}{dt}=x\\frac{dx}{dt}$.",
      "$\\frac{ds}{dt}=\\frac{\\sqrt{21}}{5}\\cdot 500=100\\sqrt{21}\\approx 458$ km/h."
    ],
    "trap": "Taking $x$ to be $5$ as well (mixing up straight-line and horizontal distance), getting $500$.",
    "check": "The distance cannot change faster than the plane's speed $500$, and the farther the plane goes, the closer it gets to $500$; $458$ is reasonable."
  },
  "dx-bio-003": {
    "spot": "$Q$ is a function of $r$, and $r$ is a function of time: related rates, $\\frac{dQ}{dt}=\\frac{dQ}{dr}\\cdot\\frac{dr}{dt}$.",
    "why": "The Chain Rule connects them directly. \"Shrinking\" means $\\frac{dr}{dt}=-0.01$; keep the minus sign.",
    "steps": [
      "$\\frac{dQ}{dr}=4kr^3=0.08r^3$.",
      "At $r=0.5$: $0.08\\cdot 0.125=0.01$; it is \"shrinking\", so $\\frac{dr}{dt}=-0.01$.",
      "$\\frac{dQ}{dt}=0.01\\cdot(-0.01)=-0.0001$ cubic cm/min."
    ],
    "trap": "Forgetting that \"shrinking\" is negative and answering $0.0001$; or differentiating $r^4$ as $4r^4$.",
    "check": "Difference approximation: as $r$ goes from $0.5$ to $0.49$, $Q$ changes by about $-0.0000985$, close to $-0.0001$."
  },
  "dx-eco-001": {
    "spot": "The elasticity formula is given: $E=-\\frac{p\\,q'(p)}{q(p)}$. Just compute $q(5)$ and $q'(5)$ and substitute.",
    "why": "Pure formula substitution; the key is getting $q'$ and the minus sign right.",
    "steps": [
      "$q(5)=500-100=400$.",
      "$q'(p)=-8p$, $q'(5)=-40$.",
      "$E=-\\frac{5\\cdot(-40)}{400}=0.5$."
    ],
    "trap": "Dropping the minus sign in front of the formula and answering $-0.5$, or swapping $p$ and $q$ to compute $\\frac{400\\cdot 40}{5}$.",
    "check": "$E<1$ means inelastic: a $1\\%$ price rise ($5\\to 5.05$) cuts demand by only about $0.5\\%$."
  },
  "dx-eco-003": {
    "spot": "Marginal cost $=C'(x)$; the fixed cost $800$ disappears when you differentiate.",
    "why": "Differentiate the polynomial term by term and evaluate at $x=20$.",
    "steps": [
      "$C'(x)=0.06x^2-3.6x+60$.",
      "Term by term at $x=20$: $0.06\\cdot 400=24$, $3.6\\cdot 20=72$.",
      "At $x=20$: $24-72+60=12$ dollars per unit."
    ],
    "trap": "Computing the average cost $\\frac{C(20)}{20}$, or differentiating $1.8x^2$ as $1.8x$.",
    "check": "The cost of producing one more unit, $C(21)-C(20)\\approx 12$."
  },
  "dx-eng-004": {
    "spot": "$x=0$ is the lowest point of the catenary: $y'=\\sinh 0=0$, so the curvature formula's denominator becomes $1$, leaving only $|y''|$.",
    "why": "Curvature $\\kappa=\\frac{|y''|}{(1+y'^2)^{3/2}}$; with a horizontal tangent only the second derivative matters.",
    "steps": [
      "$y'=\\sinh x$, which is $0$ at $0$.",
      "$y''=\\cosh x$, which is $1$ at $0$.",
      "$\\kappa=\\frac{1}{(1+0)^{3/2}}=1$."
    ],
    "trap": "Remembering the derivative of $\\cosh$ as $-\\sinh x$ (mixing it up with $\\cos$). At this point it happens not to matter, but at any other point it is wrong.",
    "check": "At a general point the curvature is $\\frac{1}{\\cosh^2x}$, largest at $0$, where it equals $1$."
  },
  "fd-serx-401": {
    "spot": "The numerator $2n+1$ is exactly $(n+1)^2-n^2$: $\\frac{2n+1}{n^2(n+1)^2}=\\frac{1}{n^2}-\\frac{1}{(n+1)^2}$, a telescoping series.",
    "why": "After splitting, neighboring terms cancel and only the first term survives. Partial fractions into four terms also works, but spotting the difference of squares is faster.",
    "steps": [
      "$(n+1)^2-n^2=2n+1$, so $\\frac{2n+1}{n^2(n+1)^2}=\\frac{1}{n^2}-\\frac{1}{(n+1)^2}$.",
      "Partial sum $S_N=1-\\frac{1}{(N+1)^2}$.",
      "$N\\to\\infty$: $S_N\\to 1$."
    ],
    "trap": "Splitting into an incorrect form like $\\frac{1}{n}-\\frac{1}{n+1}$. Always recombine to check the split.",
    "check": "The first term is $\\frac{3}{4}$, and the first two give $\\frac{3}{4}+\\frac{5}{36}=\\frac{8}{9}=1-\\frac{1}{9}$, matching the partial-sum formula."
  },
  "fd-serx-402": {
    "spot": "$\\frac{n+1}{2^n}=(n+1)x^n$ at $x=\\frac{1}{2}$, and $\\sum_{n\\ge 0}(n+1)x^n$ is exactly $\\frac{1}{(1-x)^2}$, the derivative of $\\frac{1}{1-x}$.",
    "why": "Term-by-term differentiation of the power series absorbs the $n+1$. Finding the partial sums directly needs the shift-and-subtract trick, which is longer.",
    "steps": [
      "$\\frac{1}{1-x}=\\sum_{n\\ge 0}x^n$; differentiate: $\\frac{1}{(1-x)^2}=\\sum_{n\\ge 1}nx^{n-1}=\\sum_{n\\ge 0}(n+1)x^n$.",
      "The problem's term $\\frac{n+1}{2^n}=(n+1)x^n$ with $x=\\frac{1}{2}$, inside $|x|<1$.",
      "Plug in $x=\\frac{1}{2}$: $\\frac{1}{(1/2)^2}=4$."
    ],
    "trap": "Thinking it is $\\sum nx^n=\\frac{x}{(1-x)^2}=2$ and missing the $+1$ part, $\\sum\\frac{1}{2^n}=2$.",
    "check": "Split it: $\\sum\\frac{n}{2^n}=2$ and $\\sum_{n\\ge 0}\\frac{1}{2^n}=2$, total $4$."
  },
  "fd-serx-403": {
    "spot": "The numerator $2n+1$ is linear and the denominator is $3^n$: split into $2\\sum\\frac{n}{3^n}+\\sum\\frac{1}{3^n}$, one a $\\sum nx^n$ and one geometric.",
    "why": "$\\sum nx^n=\\frac{x}{(1-x)^2}$ is the standard result of differentiating a geometric series; after splitting, apply one formula to each piece.",
    "steps": [
      "$\\sum_{n\\ge 1}nx^n=\\frac{x}{(1-x)^2}$; at $x=\\frac{1}{3}$: $\\frac{1/3}{4/9}=\\frac{3}{4}$.",
      "$\\sum_{n\\ge 1}\\frac{1}{3^n}=\\frac{1/3}{1-1/3}=\\frac{1}{2}$.",
      "Total: $2\\cdot\\frac{3}{4}+\\frac{1}{2}=2$."
    ],
    "trap": "Starting the geometric part at $n=0$ to get $\\frac{3}{2}$ and answering $3$. The problem starts at $n=1$.",
    "check": "First three terms: $1+\\frac{5}{9}+\\frac{7}{27}\\approx 1.81$; the remaining positive terms bring it close to $2$."
  },
  "fd-serx-404": {
    "spot": "The coefficient is all factorials, $\\frac{(2n)!}{(n!)^2}$: ratios of factorials cancel heavily, so use the Ratio Test for the radius of convergence.",
    "why": "After cancelling, $\\frac{a_{n+1}}{a_n}$ is just $\\frac{(2n+1)(2n+2)}{4(n+1)^2}$. The Root Test on factorials would need Stirling's formula, which is far more trouble.",
    "steps": [
      "$a_n=\\frac{(2n)!}{(n!)^2 4^n}$, $\\frac{a_{n+1}}{a_n}=\\frac{(2n+2)(2n+1)}{(n+1)^2\\cdot 4}=\\frac{2n+1}{2n+2}$. Example: $a_1=\\frac{1}{2}$, $a_2=\\frac{3}{8}$, ratio $\\frac{3}{4}$.",
      "$\\frac{a_{n+1}}{a_n}\\to 1$.",
      "Radius of convergence $R=\\frac{1}{1}=1$."
    ],
    "trap": "Looking only at the growth $\\frac{(2n)!}{(n!)^2}\\approx 4^n$ and forgetting the $4^n$ in the denominator, answering $\\frac{1}{4}$.",
    "check": "This series is actually $\\frac{1}{\\sqrt{1-x}}-1$, which blows up at $x=1$, so the radius is exactly $1$; at $x=0.5$ the two sides agree."
  },
  "fd-serx-405": {
    "spot": "$(-1)^{n+1}n^2/2^n=-n^2y^n$ with $y=-\\frac{1}{2}$: plug the negative $y$ into the power series $\\sum n^2y^n=\\frac{y(1+y)}{(1-y)^3}$.",
    "why": "Absorbing the alternating sign into the negative $y$ turns it into the standard $\\sum n^2y^n$; splitting into odd and even terms would be messy.",
    "steps": [
      "$\\sum_{n\\ge 1}n^2y^n=\\frac{y(1+y)}{(1-y)^3}$ ($|y|<1$). Check at $y=\\frac{1}{3}$: $\\frac{\\frac13\\cdot\\frac43}{\\frac{8}{27}}=\\frac{3}{2}$.",
      "Plug in $y=-\\frac{1}{2}$: $\\frac{-\\frac12\\cdot\\frac12}{\\left(\\frac32\\right)^3}=-\\frac{1}{4}\\cdot\\frac{8}{27}=-\\frac{2}{27}$.",
      "$(-1)^{n+1}=-(-1)^n$, so the original sum $=-\\left(-\\frac{2}{27}\\right)=\\frac{2}{27}$."
    ],
    "trap": "Forgetting that $(-1)^{n+1}$ and $(-1)^n$ differ by a sign, answering $-\\frac{2}{27}$.",
    "check": "For an alternating series, the first-two-term partial sum $\\frac{1}{2}-1=-\\frac{1}{2}$ and the first term $\\frac{1}{2}$ bracket the sum; the answer $\\approx 0.074$ is in between."
  },
  "fd-serx-502": {
    "spot": "$\\frac{n^3}{4^n}=n^3x^n$ at $x=\\frac{1}{4}$: apply \"differentiate, then multiply by $x$\" to $\\frac{1}{1-x}$ three times to get $\\sum n^3x^n$.",
    "why": "Each application of the operator $x\\frac{d}{dx}$ adds one factor of $n$; the formula is $\\sum n^3x^n=\\frac{x(1+4x+x^2)}{(1-x)^4}$.",
    "steps": [
      "$\\sum n^2x^n=\\frac{x(1+x)}{(1-x)^3}$; one more $x\\frac{d}{dx}$ gives $\\frac{x(1+4x+x^2)}{(1-x)^4}$.",
      "Plug in $x=\\frac{1}{4}$: numerator $\\frac{1}{4}\\left(1+1+\\frac{1}{16}\\right)=\\frac{33}{64}$, denominator $\\left(\\frac{3}{4}\\right)^4=\\frac{81}{256}$.",
      "$\\frac{33}{64}\\cdot\\frac{256}{81}=\\frac{132}{81}=\\frac{44}{27}\\approx 1.63$."
    ],
    "trap": "Misremembering the $n^3$ formula as a half-right form like $\\frac{x(1+x)}{(1-x)^4}$. If unsure, redo $x\\frac{d}{dx}$ starting from $\\frac{1}{1-x}$.",
    "check": "First three terms: $\\frac{1}{4}+\\frac{8}{16}+\\frac{27}{64}\\approx 1.17$, followed by positive terms such as $\\frac{64}{256}$, so a sum around $1.6$ is reasonable."
  },
  "fd-serx-604": {
    "spot": "Split the numerator $n+1$: $\\frac{n}{n!}=\\frac{1}{(n-1)!}$ cancels with the factorial, and $\\frac{1}{n!}$ is the series for $e$ missing its $n=0$ term.",
    "why": "It splits into two recognizable series for $e$; the Ratio Test could only tell you it converges.",
    "steps": [
      "$\\sum_{n\\ge 1}\\frac{n}{n!}=\\sum_{n\\ge 1}\\frac{1}{(n-1)!}=e$.",
      "$\\sum_{n\\ge 1}\\frac{1}{n!}=e-1$ (missing $\\frac{1}{0!}=1$).",
      "Total: $2e-1\\approx 4.437$."
    ],
    "trap": "Writing the second part as $e$ even though it starts at $n=1$, answering $2e$.",
    "check": "First four terms: $2+\\frac{3}{2}+\\frac{4}{6}+\\frac{5}{24}\\approx 4.375$; adding more positive terms approaches $4.437$."
  },
  "fd-serx-605": {
    "spot": "Quadratic numerator over $n!$: write $n^2+n+1$ as $n(n-1)+2n+1$, so every piece cancels with the factorial into a series for $e$.",
    "why": "Using the falling factorials $n(n-1)$ and $n$ as a basis gives the cleanest cancellation; splitting off $n^2$ directly needs a second split.",
    "steps": [
      "$n^2+n+1=n(n-1)+2n+1$.",
      "$\\sum_{n\\ge 1}\\frac{n(n-1)}{n!}=e$ (the $n=1$ term is $0$), $\\sum_{n\\ge 1}\\frac{2n}{n!}=2e$, $\\sum_{n\\ge 1}\\frac{1}{n!}=e-1$.",
      "Total: $e+2e+e-1=4e-1\\approx 9.873$."
    ],
    "trap": "Counting the constant term $1$ as if it started at $n=0$, giving $e$, and answering $4e$.",
    "check": "First three terms: $3+\\frac{7}{2}+\\frac{13}{6}\\approx 8.67$; adding more positive terms up to $9.87$ is reasonable."
  },
  "gap-tech-002": {
    "spot": "The numerator is $e^{2x}$ minus $1+2x$ — exactly the first two terms of its Taylor expansion; the denominator $x^2$ tells you to expand to the second-order term.",
    "why": "One line of expansion shows the $x^2$ coefficient. L'Hôpital's Rule needs two rounds, checking each time that it is still $\\frac{0}{0}$.",
    "steps": [
      "Plug in $x=0$: a $\\frac{0}{0}$ form.",
      "$e^{2x}=1+2x+2x^2+\\frac{4}{3}x^3+\\cdots$; subtracting $1+2x$ leaves $2x^2+\\cdots$.",
      "Divide by $x^2$ to get the limit $2$; so the technique is Taylor expansion."
    ],
    "trap": "Expanding only to first order, $e^{2x}\\approx 1+2x$, getting $\\frac{0}{x^2}$ and thinking the limit is $0$. Expand until the first nonzero term after the subtraction.",
    "check": "Plug in $x=0.01$: $\\frac{e^{0.02}-1.02}{0.0001}\\approx 2.013$, close to $2$."
  },
  "gp-002": {
    "spot": "$g(x)=\\int_0^xf(t)\\,dt$ and the question asks for $g'$: by the Fundamental Theorem of Calculus $g'(x)=f(x)$ — no integration needed, just read $f(3)$ off the graph.",
    "why": "Computing the area and then differentiating is wasted work; $g'=f$ gets there in one step.",
    "steps": [
      "Fundamental Theorem of Calculus: $g'(3)=f(3)$.",
      "$x=3$ lies on the segment over $(2,4)$, from $(2,4)$ to $(4,0)$, with slope $-2$: $f(x)=4-2(x-2)$.",
      "$f(3)=4-2=2$."
    ],
    "trap": "Computing $g(3)=\\int_0^3f\\,dt=4+3=7$ (the area) instead of $f(3)$.",
    "check": "$(3,2)$ is the midpoint of the segment $(2,4)$–$(4,0)$, so its height is the average of the endpoints, $\\frac{4+0}{2}=2$."
  },
  "gp-006": {
    "spot": "A polyline is continuous everywhere, but at a corner where the left and right slopes differ it is not differentiable. The interior corners are just the two vertices $(1,2)$ and $(3,-2)$.",
    "why": "Each straight segment is differentiable in its interior, so just count the \"vertices where the slope changes\"; the endpoints $0$ and $4$ are not in the open interval.",
    "steps": [
      "Slopes: $(0,0)\\to(1,2)$ is $2$; $(1,2)\\to(3,-2)$ is $-2$; $(3,-2)\\to(4,0)$ is $2$.",
      "$x=1$: left slope $2$, right slope $-2$, different, so not differentiable; $x=3$: left $-2$, right $2$, also not differentiable.",
      "Every other point is inside a straight segment, so differentiable. The number of non-differentiable points is $2$."
    ],
    "trap": "Counting the endpoints $x=0$ and $x=4$ too and answering $4$. The problem asks about the open interval $(0,4)$.",
    "check": "$4$ vertices minus the two endpoints $=2$."
  }
};
