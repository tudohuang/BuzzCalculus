// Detail v2, English — batch 047. Translation of tools/content/detail/047.js (text only; claims live in the Chinese file).
module.exports = {
  "lec-01-m4": {
    "spot": "All four options define $f(0)$ as $0$; they differ only in the limit as $x\\to0$. Only $x\\sin\\frac{1}{x}$ is an $x$ going to $0$ times a bounded oscillation, so it can be squeezed.",
    "why": "Continuity means checking whether the limit equals the function value. Bounded times something going to zero is a one-line Squeeze Theorem; each of the other three fails in one spot.",
    "steps": [
      "Continuity at $0$ requires $\\lim_{x\\to0}f(x)=f(0)=0$. First $x\\sin\\frac{1}{x}$: $\\left|x\\sin\\frac{1}{x}\\right|\\le|x|$.",
      "$-|x|\\le x\\sin\\frac{1}{x}\\le|x|$ and both sides tend to $0$, so by the Squeeze Theorem the limit is $0=f(0)$: continuous.",
      "$\\sin\\frac{1}{x}$: it equals $1$ at $x=\\frac{1}{\\pi/2+2k\\pi}$ and $-1$ at $x=\\frac{1}{3\\pi/2+2k\\pi}$, and these points get arbitrarily close to $0$, so the limit does not exist.",
      "$\\frac{|x|}{x}$: right limit $1$, left limit $-1$, a jump discontinuity.",
      "$\\frac{1}{x^2}$ blows up to infinity near $0$, an infinite discontinuity.",
      "Answer: $f(x)=x\\sin\\frac{1}{x}$ ($x\\ne0$), $f(0)=0$ is the only one continuous at $0$."
    ],
    "trap": "Seeing $f(0)=0$ written in all four and thinking they are all defined and therefore continuous. Being defined is not continuity; the limit must also exist and equal $0$.",
    "check": "Plug in a small $x=0.001$: $|0.001\\sin 1000|\\le 0.001$, hugging $0$ indeed."
  },
  "lec-01-q2b": {
    "spot": "The numerator $\\sin x$ always stays between $-1$ and $1$ while the denominator $x\\to\\infty$: bounded over infinity — Squeeze Theorem.",
    "why": "$\\sin x$ has no limit at infinity, so you can't split the limit, and L'Hôpital's Rule doesn't apply (the numerator doesn't go to infinity). The Squeeze Theorem is the only clean route.",
    "steps": [
      "$-1\\le\\sin x\\le1$; for $x>0$ divide by $x$: $-\\frac{1}{x}\\le\\frac{\\sin x}{x}\\le\\frac{1}{x}$.",
      "Both bounds tend to $0$: $\\lim_{x\\to\\infty}\\frac{1}{x}=0$, $\\lim_{x\\to\\infty}\\left(-\\frac{1}{x}\\right)=0$.",
      "By the Squeeze Theorem, $\\lim_{x\\to\\infty}\\frac{\\sin x}{x}=0$."
    ],
    "trap": "Reciting $\\frac{\\sin x}{x}\\to1$ and answering $1$; that is the limit as $x\\to0$, and this problem has $x\\to\\infty$.",
    "check": "Plug in $x=10000$: $\\frac{\\sin 10000}{10000}$ has size at most $0.0001$."
  },
  "lec-01-q4b": {
    "spot": "$g$ is a rational function with quadratics on top and bottom, so the limit as $x\\to\\infty$ is the ratio of leading coefficients $\\frac{1}{1}$; both also share a factor $x-1$ you can cancel first.",
    "why": "A rational function with equal degrees only cares about leading coefficients at infinity; divide top and bottom by the highest power, no L'Hôpital's Rule needed.",
    "steps": [
      "Factor: $x^2-1=(x-1)(x+1)$, $x^2-3x+2=(x-1)(x-2)$; after cancelling, $g(x)=\\frac{x+1}{x-2}$ ($x\\ne1$).",
      "Divide top and bottom by $x$: $\\frac{1+\\frac{1}{x}}{1-\\frac{2}{x}}$, and $\\frac{1}{x}\\to0$, $\\frac{2}{x}\\to0$.",
      "So $\\lim_{x\\to\\infty}g(x)=\\frac{1}{1}=1$; the horizontal asymptote is $y=1$."
    ],
    "trap": "Confusing the limit as $x\\to1$ ($\\frac{2}{-1}=-2$) or the vertical asymptote $x=2$ with the horizontal asymptote; horizontal asymptotes only look at $x\\to\\pm\\infty$.",
    "check": "Plug in $x=1000$: $\\frac{1001}{998}\\approx1.003$, close to $1$."
  },
  "lec-02-m2": {
    "spot": "$\\sin x\\cos x$ is exactly the double-angle shape $\\frac{1}{2}\\sin 2x$; simplify first, then differentiate in one step.",
    "why": "The Product Rule works too, but gives $\\cos^2x-\\sin^2x$, which you then have to recognize as a double angle; rewriting as $\\frac{1}{2}\\sin2x$ first is fastest.",
    "steps": [
      "Double-angle formula: $\\sin x\\cos x=\\frac{1}{2}\\sin 2x$.",
      "Differentiate: $\\frac{d}{dx}\\left(\\frac{1}{2}\\sin2x\\right)=\\frac{1}{2}\\cdot2\\cos2x=\\cos2x$.",
      "Cross-check with the Product Rule: $\\cos x\\cdot\\cos x+\\sin x\\cdot(-\\sin x)=\\cos^2x-\\sin^2x=\\cos2x$. The answer is $\\cos 2x$."
    ],
    "trap": "Writing the derivative of a product as the product of derivatives: $(\\sin x)'(\\cos x)'=-\\sin x\\cos x$, which is wrong.",
    "check": "Near $x=0$, $\\sin x\\cos x\\approx x$, so the slope should be $1$; $\\cos0=1$ matches."
  },
  "lec-02-m3": {
    "spot": "The graph of $|x|$ has a V-shaped corner at the origin: no break (continuous), but the slopes on the two sides, $-1$ and $1$, differ (not differentiable).",
    "why": "Differentiability needs equal left and right derivatives, and computing the one-sided difference quotients is clearest; don't judge just from the impression of a corner.",
    "steps": [
      "Continuous: $\\lim_{x\\to0}|x|=0=f(0)$.",
      "Right derivative: $\\lim_{h\\to0^+}\\frac{|h|-0}{h}=1$.",
      "Left derivative: $\\lim_{h\\to0^-}\\frac{|h|-0}{h}=-1$.",
      "The one-sided derivatives differ, so $f'(0)$ does not exist. Conclusion: continuous but not differentiable."
    ],
    "trap": "Believing \"continuous implies differentiable\" or \"the derivative is $0$ at a minimum\" and choosing $f'(0)=0$; at a corner extremum the derivative doesn't even exist.",
    "check": "Only the reverse holds: differentiable implies continuous, but continuous does not imply differentiable, and $|x|$ is the standard counterexample."
  },
  "lec-02-q1c": {
    "spot": "The problem says \"by the definition of the derivative\": plugging $h=0$ into the difference quotient $\\frac{\\sqrt{a+h}-\\sqrt a}{h}$ gives $\\frac{0}{0}$, and the numerator is a difference of roots — multiply by the conjugate.",
    "why": "Multiplying the root difference by the conjugate $\\sqrt{a+h}+\\sqrt a$ turns it into $(a+h)-a=h$, which cancels the $h$ in the denominator.",
    "steps": [
      "$k'(a)=\\lim_{h\\to0}\\frac{\\sqrt{a+h}-\\sqrt a}{h}$; plugging in $h=0$ gives $\\frac{0}{0}$.",
      "Multiply top and bottom by $\\sqrt{a+h}+\\sqrt a$: the numerator becomes $(a+h)-a=h$, leaving $\\frac{1}{\\sqrt{a+h}+\\sqrt a}$.",
      "Now let $h\\to0$: $\\frac{1}{\\sqrt a+\\sqrt a}=\\frac{1}{2\\sqrt a}$.",
      "So $k'(a)=\\frac{1}{2\\sqrt a}$."
    ],
    "trap": "Multiplying only the numerator by the conjugate and not the denominator, or computing the numerator as $\\sqrt h$; top and bottom must be multiplied by the same expression.",
    "check": "Plug in $a=4$: $k'(4)=\\frac{1}{4}$, exactly the tangent slope of $y=\\sqrt x$ at $x=4$."
  },
  "lec-02-q1d": {
    "spot": "A tangent line needs just two things: the point $(4,\\sqrt4)=(4,2)$ and the slope $\\frac{1}{2\\sqrt4}=\\frac{1}{4}$; then use point-slope form.",
    "why": "Point-slope form $y=y_0+m(x-x_0)$ writes it in one step; no need to solve for the intercept separately.",
    "steps": [
      "Point: $y(4)=\\sqrt4=2$.",
      "Slope: $y'=\\frac{1}{2\\sqrt x}$, which is $\\frac{1}{4}$ at $x=4$.",
      "Point-slope: $y=2+\\frac{1}{4}(x-4)=\\frac{x}{4}+1$."
    ],
    "trap": "Leaving the slope as $\\frac{1}{2\\sqrt x}$ without plugging in, which gives a \"tangent line\" with a square root in it; the slope must be evaluated at $x=4$ to become a constant.",
    "check": "$\\sqrt x$ curves downward, so the tangent line should lie above the curve: at $x=9$ the tangent gives $3.25$ and the curve $3$."
  },
  "lec-02-q2c": {
    "spot": "$\\sin^3(2x)=\\left(\\sin2x\\right)^3$ is a three-layer composition: cube, then $\\sin$, then $2x$. The Chain Rule peels the three layers from outside in.",
    "why": "Each layer contributes one derivative factor, so nothing gets missed; writing the three layers separately is safer than doing it all at once.",
    "steps": [
      "The outer layer $u^3$ gives $3u^2$ with $u=\\sin2x$: $3\\sin^2(2x)\\cdot(\\sin2x)'$.",
      "The middle layer $\\sin$ gives $\\cos$ and the innermost $2x$ gives $2$: $(\\sin2x)'=2\\cos2x$.",
      "Multiply: $y'=3\\sin^2(2x)\\cdot2\\cos(2x)=6\\sin^2(2x)\\cos(2x)$."
    ],
    "trap": "Dropping the innermost $2$ and answering $3\\sin^2(2x)\\cos(2x)$, off by a factor of two.",
    "check": "For small $x$, $\\sin^3(2x)\\approx8x^3$ with derivative about $24x^2$; at $x=0.01$ the two are nearly identical."
  },
  "lec-03-m4": {
    "spot": "Derivative of the inverse function at $2$: first find which $x$ makes $x^3+x=2$ (try $x=1$), then take the reciprocal $\\frac{1}{f'(1)}$.",
    "why": "The inverse of $x^3+x$ can't be written down, but the inverse-function derivative only needs $f'$ at the corresponding point.",
    "steps": [
      "Solve $f(x)=2$: $1^3+1=2$, so $f^{-1}(2)=1$.",
      "$f'(x)=3x^2+1$, $f'(1)=4$.",
      "$(f^{-1})'(2)=\\frac{1}{f'(f^{-1}(2))}=\\frac{1}{f'(1)}=\\frac{1}{4}$."
    ],
    "trap": "Computing $\\frac{1}{f'(2)}=\\frac{1}{13}$ directly; $f'$ must be evaluated at $f^{-1}(2)=1$, not at $2$.",
    "check": "$f(1.0025)\\approx2.01$: the input grows by $0.0025$ and the output by $0.01$, so the inverse slope is about $\\frac{0.0025}{0.01}=\\frac{1}{4}$."
  },
  "lec-03-q1a": {
    "spot": "In $x^2+xy+y^2=7$, $y$ can't be solved for cleanly and there is a cross term $xy$: differentiate both sides with respect to $x$, using the Product Rule on $xy$.",
    "why": "Implicit differentiation only requires plugging in the point $(1,2)$ and solving one linear equation; no need to solve for $y$ first.",
    "steps": [
      "First confirm $(1,2)$ is on the curve: $1+2+4=7$.",
      "Differentiate both sides with respect to $x$: $2x+(y+xy')+2yy'=0$, so $y'=-\\frac{2x+y}{x+2y}$.",
      "Plug in $(1,2)$: $2+2+(1+4)y'=0$, $y'=-\\frac{4}{5}$. Cross-check by differentiating the upper branch $y=\\frac{-x+\\sqrt{28-3x^2}}{2}$ directly."
    ],
    "trap": "Differentiating $xy$ as $y'$ or $xy'$, missing the other half of the Product Rule, which gives something like $-\\frac{2}{5}$.",
    "check": "The curve is a tilted ellipse heading down and to the right near $(1,2)$, so a negative slope makes sense."
  },
  "lec-03-q3b": {
    "spot": "Inside $\\arcsin$ is $\\frac{x}{4}$: use $\\frac{1}{\\sqrt{1-u^2}}$ for the outer layer, multiply by $\\frac{1}{4}$ for the inner, then bring the $4$ inside the root.",
    "why": "After the Chain Rule, multiplying the $\\frac{1}{4}$ into the root $\\sqrt{1-\\frac{x^2}{16}}$ turns it into $\\sqrt{16-x^2}$, the simplest form.",
    "steps": [
      "$\\frac{d}{du}\\arcsin u=\\frac{1}{\\sqrt{1-u^2}}$, $u=\\frac{x}{4}$, $u'=\\frac{1}{4}$.",
      "$\\frac{1}{4}\\cdot\\frac{1}{\\sqrt{1-x^2/16}}=\\frac{1}{\\sqrt{16}\\sqrt{1-x^2/16}}=\\frac{1}{\\sqrt{16-x^2}}$.",
      "So the derivative is $\\frac{1}{\\sqrt{16-x^2}}$ ($|x|<4$)."
    ],
    "trap": "Forgetting the inner $\\frac{1}{4}$ and writing $\\frac{1}{\\sqrt{1-x^2/16}}=\\frac{4}{\\sqrt{16-x^2}}$, four times too big.",
    "check": "Near $x=0$, $\\arcsin\\frac{x}{4}\\approx\\frac{x}{4}$ with slope $\\frac{1}{4}$, matching $\\frac{1}{\\sqrt{16}}$."
  },
  "lec-03-q3d": {
    "spot": "$x+e^x=1$ is obviously $x=0$ ($0+e^0=1$), so the inverse-function derivative is just $\\frac{1}{f'(0)}$.",
    "why": "The inverse of $x+e^x$ has no elementary form, and the inverse-function derivative formula only needs $f'$ at the corresponding point.",
    "steps": [
      "Solve $f(x)=1$: $f(0)=0+1=1$, so $f^{-1}(1)=0$.",
      "$f'(x)=1+e^x$, $f'(0)=2$.",
      "$(f^{-1})'(1)=\\frac{1}{f'(0)}=\\frac{1}{2}$."
    ],
    "trap": "Plugging in the wrong point, $\\frac{1}{f'(1)}=\\frac{1}{1+e}$; the point to use is $f^{-1}(1)=0$.",
    "check": "$f(0.005)\\approx1.01$: the output moves $0.01$ while the input moves $0.005$, a ratio of $\\frac{1}{2}$."
  },
  "lec-03-q4a": {
    "spot": "The ladder has fixed length $5$: the foot's distance from the wall $x$ and the top's height $y$ satisfy $x^2+y^2=25$; differentiate in $t$ to convert $\\frac{dx}{dt}=1$ into $\\frac{dy}{dt}$.",
    "why": "The standard related rates routine: write the fixed geometric relation first, differentiate with respect to time, and only then plug in the current values.",
    "steps": [
      "When $x=3$, $y=\\sqrt{25-9}=4$.",
      "Differentiate in $t$: $2x\\frac{dx}{dt}+2y\\frac{dy}{dt}=0$, so $\\frac{dy}{dt}=-\\frac{x}{y}\\frac{dx}{dt}$.",
      "Plug in $x=3$, $y=4$, $\\frac{dx}{dt}=1$: $\\frac{dy}{dt}=-\\frac{3}{4}$. The minus sign means it slides down, at speed $\\frac{3}{4}$ m/s."
    ],
    "trap": "Plugging in numbers too early: substituting $x=3$ before differentiating makes $x$ a constant, and you lose the rate.",
    "check": "The farther the foot is from the wall, the faster the top slides: at $x=4$ the speed is $\\frac{4}{3}$, larger than at $x=3$."
  },
  "lec-04-m2": {
    "spot": "Rolle's theorem has three conditions: continuous on the closed interval, differentiable on the open interval, equal endpoint values. Check the four options one by one and find the only one that passes all three.",
    "why": "Each option breaks exactly one condition, so checking condition by condition is fastest; no graph needed.",
    "steps": [
      "$x^2$: a polynomial, continuous and differentiable everywhere, and $(-1)^2=1^2$.",
      "$|x|$: equal endpoints and continuous, but at $0$ the one-sided derivatives $-1$ and $1$ differ, so it is not differentiable.",
      "$x^3$: continuous and differentiable, but $f(-1)=-1\\ne1=f(1)$.",
      "$\\frac{1}{x}$: undefined at $0$ and blows up to infinity, so continuity fails.",
      "Only $x^2$ satisfies all three conditions; its horizontal tangent is at $c=0$."
    ],
    "trap": "Checking only the equal endpoint values and choosing $|x|$; it has a corner at $x=0$ and fails differentiability on the open interval.",
    "check": "Rolle's conclusion also matches: $x^2$ really has a point $c=0$ in $(-1,1)$ with $f'(c)=0$."
  },
  "lec-04-m3": {
    "spot": "All four statements claim something \"must\" happen for extrema or inflection points; try the standard counterexamples $x^4$, $x^3$, $|x|$ on each, and the one that survives is correct.",
    "why": "Counterexamples are the fastest way through concept questions like this: one counterexample kills a \"must\".",
    "steps": [
      "\"If $f''(c)=0$ then it must be an inflection point\": $x^4$ has $f''(0)=0$ at $0$, but it is concave up on both sides, no inflection.",
      "\"If $f'(c)=0$ there must be an extremum\": $x^3$ has derivative $0$ at $0$, but it is negative on the left and positive on the right, not an extremum.",
      "\"If there is an extremum then $f'(c)=0$\": $|x|$ has a local minimum at $0$, but the derivative doesn't exist.",
      "Second Derivative Test: if $f'(c)=0$ and $f''(c)<0$ then it is a local max, e.g. $-x^2$ at $0$. So this is the correct statement."
    ],
    "trap": "Treating a necessary condition as sufficient: $f'(c)=0$ is only necessary for an extremum of a differentiable function, and does not guarantee one.",
    "check": "The Second Derivative Test is itself a theorem: when $f'(c)=0$, near $c$, $f$ looks like $\\frac{1}{2}f''(c)(x-c)^2$, and a negative coefficient means it opens downward."
  },
  "lec-04-q1a": {
    "spot": "Absolute extrema of a polynomial on the closed interval $[-2,4]$: the only candidates are the critical points and the two endpoints; plug them all in and compare.",
    "why": "A continuous function on a closed interval always has a maximum, and it can only occur at a critical point or an endpoint; a table of values is the safest approach.",
    "steps": [
      "$f'(x)=3x^2-6x-9=3(x-3)(x+1)$; critical points $x=-1$ and $x=3$, both in the interval.",
      "Endpoints: $f(-2)=3$, $f(4)=-15$.",
      "Critical points: $f(-1)=10$, $f(3)=-22$.",
      "The largest of the four values is $10$ (at $x=-1$)."
    ],
    "trap": "Checking only critical points and forgetting the endpoints; or reporting the $x$-value $-1$ where $f'=0$ as the maximum, when the question wants the function value $10$.",
    "check": "Take two points near $x=-1$: both function values are smaller than $10$."
  },
  "lec-04-q3b": {
    "spot": "The numerator $x^2$ is one degree higher than the denominator $x-1$: do long division; the quotient is the slant asymptote and the remainder part tends to $0$.",
    "why": "The slant asymptote $y=mx+b$ is just the quotient from long division; one division is faster than finding $m=\\lim\\frac{f}{x}$ and $b=\\lim(f-mx)$ separately.",
    "steps": [
      "Long division: $\\frac{x^2}{x-1}=x+1+\\frac{1}{x-1}$.",
      "As $x\\to\\pm\\infty$, $\\frac{1}{x-1}\\to0$.",
      "So $f(x)-(x+1)\\to0$, and the slant asymptote is $y=x+1$."
    ],
    "trap": "Finding only the slope $m=1$ and writing $y=x$, missing the intercept $b=\\lim\\left(\\frac{x^2}{x-1}-x\\right)=1$.",
    "check": "Plug in $x=100$: $\\frac{10000}{99}\\approx101.01$, only $\\frac{1}{99}$ more than $x+1=101$."
  },
  "lec-04-q4a": {
    "spot": "You're given only $f'(x)=(x+2)(x-1)^2$: extrema depend on whether $f'$ changes sign across each root, and the squared factor $(x-1)^2$ doesn't change sign.",
    "why": "The First Derivative Test only needs signs, and the factors are already there, so just make a sign chart.",
    "steps": [
      "Roots of $f'$: $x=-2$ and $x=1$ (double root).",
      "Across $x=-2$: $f'<0$ on the left, $f'>0$ on the right; decreasing then increasing, a local min.",
      "Across $x=1$: $f'>0$ on both sides, no sign change, not an extremum.",
      "The local minimum is at $x=-2$."
    ],
    "trap": "Seeing $f'(1)=0$ and listing $x=1$ as an extremum too; $(x-1)^2\\ge0$ keeps $f'$ the same sign on both sides of $1$, so it's just a horizontal tangent.",
    "check": "The Second Derivative Test also works: $f''(-2)=(-3)^2=9>0$, concave up, so it really is a minimum."
  },
  "lec-05-q2b": {
    "spot": "After cutting out squares of side $x$, the box base has side $12-2x$ and height $x$: volume $V=x(12-2x)^2$, maximize on $0<x<6$.",
    "why": "Once it's a one-variable function, differentiate to find critical points and compare with the endpoints (volume $0$).",
    "steps": [
      "$V(x)=x(12-2x)^2$ with domain $0<x<6$.",
      "$V'=(12-2x)^2-4x(12-2x)=(12-2x)(12-6x)$; the root in the domain is $x=2$.",
      "As $x\\to0$ or $x\\to6$, $V\\to0$, so the max is at $x=2$: $V(2)=2\\cdot8^2=128$."
    ],
    "trap": "Including the root $x=6$ from $V'=0$; at $x=6$ the base has side $0$ and volume $0$, a minimum, not a maximum.",
    "check": "Take a point on each side of $x=2$: both volumes are less than $128$."
  },
  "lec-05-q4b": {
    "spot": "\"Estimate the error using differentials\": $dV=V'(r)\\,dr$, and $V=\\frac{4}{3}\\pi r^3$ gives $V'=4\\pi r^2$.",
    "why": "The differential linearizes a small error, needing just one multiplication instead of subtracting two sphere volumes.",
    "steps": [
      "$V=\\frac{4}{3}\\pi r^3$, $\\frac{dV}{dr}=4\\pi r^2$, which is $400\\pi$ at $r=10$.",
      "$dV=400\\pi\\times0.05=20\\pi\\approx62.8$ cm³.",
      "The answer is $20\\pi$ cubic cm."
    ],
    "trap": "Plugging the radius error straight into the volume formula, $\\frac{4}{3}\\pi(0.05)^3$, which gives a negligible number; the error must be multiplied by the derivative.",
    "check": "The actual difference $V(10.05)-V(10)\\approx63.15$ is very close to $20\\pi\\approx62.83$."
  },
  "lec-06-m1": {
    "spot": "The upper limit of integration is $x^2$, not $x$: besides the Fundamental Theorem of Calculus, multiply by the derivative of the upper limit, $2x$.",
    "why": "The Fundamental Theorem plus the Chain Rule gives $\\cos(x^2)\\cdot2x$ in one step, without evaluating the integral first.",
    "steps": [
      "Let $F(u)=\\int_0^u\\cos t\\,dt$, so $F'(u)=\\cos u$; the problem asks about $F(x^2)$.",
      "Chain Rule: $\\frac{d}{dx}F(x^2)=F'(x^2)\\cdot2x=\\cos(x^2)\\cdot2x$.",
      "Answer: $2x\\cos(x^2)$."
    ],
    "trap": "Writing just $\\cos(x^2)$ and forgetting to multiply by the derivative $2x$ of the upper limit $x^2$.",
    "check": "For small $x$ the integral is about $x^2$, with derivative about $2x$; at $x=0.01$ it is almost exactly $0.02$."
  },
  "lec-06-m3": {
    "spot": "The interval $[-1,1]$ is symmetric and the integrand $x^3\\cos x$ is odd (odd $\\times$ even): the answer is immediately $0$.",
    "why": "On a symmetric interval, check odd/even first; it saves three rounds of integration by parts.",
    "steps": [
      "$(-x)^3\\cos(-x)=-x^3\\cos x$, an odd function.",
      "The left and right halves have equal size and opposite sign.",
      "They add to $0$."
    ],
    "trap": "Grinding through integration by parts; over three rounds it's easy to slip on a sign and get a nonzero number.",
    "check": "The graph is symmetric about the origin: the part with $x>0$ is above the axis and the part with $x<0$ is below, cancelling exactly."
  },
  "lec-06-m4": {
    "spot": "The numerator $x$ is nearly the derivative $2x$ of the denominator $x^2+1$: substitute $u=x^2+1$ and it integrates to a log.",
    "why": "\"Numerator is a constant multiple of the denominator's derivative\" is the signal for $\\ln|u|$; one substitution finishes it.",
    "steps": [
      "$u=x^2+1$, $du=2x\\,dx$, so $x\\,dx=\\frac{1}{2}du$.",
      "$\\int\\frac{x}{x^2+1}dx=\\frac{1}{2}\\int\\frac{du}{u}=\\frac{1}{2}\\ln u+C$.",
      "$u=x^2+1>0$, so no absolute value is needed: $\\frac{1}{2}\\ln(x^2+1)+C$."
    ],
    "trap": "Seeing $x^2+1$ and thinking of $\\arctan x$; that formula is for a constant numerator. With an $x$ on top, use substitution.",
    "check": "Differentiate back: $\\frac{1}{2}\\cdot\\frac{2x}{x^2+1}=\\frac{x}{x^2+1}$."
  },
  "lec-06-q4a": {
    "spot": "The question asks for displacement, not distance traveled: integrate $v(t)$ directly, signs included, no absolute value.",
    "why": "Displacement $=\\int_0^5v\\,dt$, and even if the velocity changes sign you don't split it up; splitting is only needed for total distance.",
    "steps": [
      "Antiderivative: $\\int(t^2-2t-3)dt=\\frac{t^3}{3}-t^2-3t$.",
      "Evaluate from $0$ to $5$: $\\frac{125}{3}-25-15=\\frac{5}{3}$.",
      "Displacement $\\frac{5}{3}$ m."
    ],
    "trap": "Mixing up displacement and total distance: total distance splits at $t=3$ and takes absolute values, giving $9+\\frac{32}{3}=\\frac{59}{3}$, which is not this problem's answer.",
    "check": "Piecewise check: in the first three seconds it moves back $9$, in the last two it moves forward $\\frac{32}{3}$; net displacement $\\frac{32}{3}-9=\\frac{5}{3}$."
  },
  "lec-07-q3a": {
    "spot": "In $\\sin^3x\\cos^2x$ the $\\sin$ has an odd power: save one $\\sin x$ for $dx$, turn the rest into $\\sin^2x=1-\\cos^2x$, and substitute $u=\\cos x$.",
    "why": "Split one factor off the odd-power function to serve as $du$, and everything else becomes a polynomial in the other function. Least work.",
    "steps": [
      "$\\sin^3x\\cos^2x=(1-\\cos^2x)\\cos^2x\\cdot\\sin x$.",
      "$u=\\cos x$, $du=-\\sin x\\,dx$: the integral becomes $-\\int(u^2-u^4)du=-\\frac{u^3}{3}+\\frac{u^5}{5}+C$.",
      "Substitute back $u=\\cos x$: $-\\frac{\\cos^3x}{3}+\\frac{\\cos^5x}{5}+C$."
    ],
    "trap": "Dropping the minus sign in $du=-\\sin x\\,dx$ and getting $\\frac{\\cos^3x}{3}-\\frac{\\cos^5x}{5}$, off by an overall sign.",
    "check": "Differentiating back should give the original integrand."
  },
  "lec-09-m4": {
    "spot": "The triangle $0\\le y\\le x$, $0\\le x\\le1$ rotates about the $y$-axis, and the boundary is written as $y=x$: use cylindrical shells with radius $x$ and height $x$.",
    "why": "Rotating about the $y$-axis with $x$ as the variable, shells take one integral; washers would require rewriting the region in terms of $y$.",
    "steps": [
      "Shells: $V=\\int_0^12\\pi x\\cdot h(x)\\,dx$ with height $h(x)=x-0=x$.",
      "$V=2\\pi\\int_0^1x^2dx=2\\pi\\cdot\\frac{1}{3}$.",
      "$V=\\frac{2\\pi}{3}$."
    ],
    "trap": "Rotating about the wrong axis: about the $x$-axis you'd get $\\pi\\int_0^1x^2dx=\\frac{\\pi}{3}$.",
    "check": "Washer cross-check: outer radius $1$, inner radius $y$, $\\pi\\int_0^1(1-y^2)dy=\\frac{2\\pi}{3}$."
  },
  "lec-09-m5": {
    "spot": "Inside the root of the arc-length formula is $1+(f')^2$: a small piece of curve is replaced by a hypotenuse, using Pythagoras $\\sqrt{(\\Delta x)^2+(\\Delta y)^2}$ and then factoring out $\\Delta x$.",
    "why": "Arc length is the limit of polygonal-path lengths, and each segment is the hypotenuse of a right triangle; the other options aren't measuring length at all.",
    "steps": [
      "Cut $[a,b]$ into small pieces and approximate each piece of curve by a segment of length $\\sqrt{(\\Delta x)^2+(\\Delta y)^2}$.",
      "Factor out $\\Delta x$: $\\sqrt{1+\\left(\\frac{\\Delta y}{\\Delta x}\\right)^2}\\,\\Delta x$; as $\\Delta x\\to0$, $\\frac{\\Delta y}{\\Delta x}\\to f'(x)$.",
      "The limit of the total polygonal length is $\\int_a^b\\sqrt{1+(f')^2}dx$. For example, $y=x^2$ on $[0,1]$ has arc length longer than the chord $\\sqrt2$.",
      "So the integrand comes from approximating a small piece of curve by a segment of length $\\sqrt{(\\Delta x)^2+(\\Delta y)^2}=\\sqrt{1+(\\Delta y/\\Delta x)^2}\\,\\Delta x$."
    ],
    "trap": "Mixing up arc length with area and thinking $\\sqrt{1+(f')^2}$ is the derivative of area; the derivative of area is $f$ itself.",
    "check": "The line $y=x$ on $[0,1]$: $\\int_0^1\\sqrt{1+1}\\,dx=\\sqrt2$, exactly the segment length, so the formula checks out."
  },
  "lec-09-q1a": {
    "spot": "One parabola opens up and one opens down: solve for the intersections to get the limits, decide which is on top, and integrate top minus bottom.",
    "why": "With $x$ as the variable both curves are already in $y=$ form, so one integral does it.",
    "steps": [
      "Intersections: $x^2=2x-x^2\\Rightarrow2x(x-1)=0$, $x=0,1$.",
      "Take $x=\\frac{1}{2}$ in $(0,1)$: $2x-x^2=\\frac{3}{4}>\\frac{1}{4}=x^2$, so $2x-x^2$ is on top.",
      "Area $=\\int_0^1(2x-2x^2)dx=1-\\frac{2}{3}=\\frac{1}{3}$."
    ],
    "trap": "Integrating upside down, $\\int_0^1(2x^2-2x)dx=-\\frac{1}{3}$, a negative area.",
    "check": "A parabolic segment has $\\frac{2}{3}$ the area of its bounding rectangle: width $1$, maximum height gap $\\frac{1}{2}$, and $\\frac{2}{3}\\cdot\\frac{1}{2}=\\frac{1}{3}$."
  },
  "lec-10-m3": {
    "spot": "Multiply both sides of $r=2\\cos\\theta$ by $r$ and you get $r^2=x^2+y^2$ and $r\\cos\\theta=x$; convert to rectangular coordinates and complete the square.",
    "why": "Multiplying by one $r$ makes every term convertible, and completing the square shows the center and radius at a glance.",
    "steps": [
      "Multiply by $r$: $r^2=2r\\cos\\theta$, i.e. $x^2+y^2=2x$.",
      "Complete the square: $(x-1)^2+y^2=1$. The curve's points $x=2\\cos^2\\theta$, $y=2\\cos\\theta\\sin\\theta$ all satisfy it.",
      "At $\\theta=0$ it is at $(2,0)$, and at $\\theta=\\frac{\\pi}{2}$ it is at the origin: the diameter runs from $(0,0)$ to $(2,0)$.",
      "So it is the circle with center $(1,0)$ and radius $1$."
    ],
    "trap": "Seeing the coefficient $2$ and saying \"radius $2$, centered at the origin\"; that circle is $r=2$. The curve $r=2\\cos\\theta$ is a circle through the origin whose diameter is $2$.",
    "check": "As $\\theta$ goes from $0$ to $\\pi$ it traces this circle exactly once; the farthest point $r=2$ is at $\\theta=0$, the other end of the diameter."
  },
  "lec-10-m5": {
    "spot": "The spring force $F=kx$ grows as it stretches, so it's not constant: first find $k$ from $10=k\\cdot0.2$, then integrate $\\int_0^{0.3}kx\\,dx$.",
    "why": "Work by a variable force needs an integral; force times distance only works for a constant force.",
    "steps": [
      "$k=\\frac{10}{0.2}=50$ N/m.",
      "$W=\\int_0^{0.3}50x\\,dx=25\\times0.09$.",
      "$W=2.25$ J."
    ],
    "trap": "Using the constant-force formula $10\\times0.3=3$ J; the spring force grows gradually from $0$ to $15$ N, it is not $10$ N throughout.",
    "check": "The average force is $\\frac{0+15}{2}=7.5$ N; times the distance $0.3$ m gives $2.25$ J."
  },
  "lec-10-q1a": {
    "spot": "Tangent to a parametric curve: slope $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$, and the point of tangency comes from plugging $t=\\frac{\\pi}{2}$ into both $x(t)$ and $y(t)$.",
    "why": "No need to eliminate $t$: divide the two derivatives for the slope, then use point-slope form.",
    "steps": [
      "Point: $x=\\frac{\\pi}{2}-1$, $y=1-0=1$.",
      "$\\frac{dx}{dt}=1-\\cos t=1$, $\\frac{dy}{dt}=\\sin t=1$, slope $\\frac{1}{1}=1$.",
      "Point-slope: $y=1+\\left(x-\\frac{\\pi}{2}+1\\right)=x+2-\\frac{\\pi}{2}$."
    ],
    "trap": "Writing the point as $\\left(\\frac{\\pi}{2},1\\right)$ (treating $t$ as $x$), which gives $y=x+1-\\frac{\\pi}{2}$.",
    "check": "The tangent line should pass through $\\left(\\frac{\\pi}{2}-1,\\,1\\right)$ at the point of tangency."
  },
  "lec-10-q2a": {
    "spot": "Multiply both sides of $r=4\\sin\\theta$ by $r$: $r^2=x^2+y^2$ and $r\\sin\\theta=y$ turn it into $x^2+y^2=4y$; then complete the square.",
    "why": "Multiplying by $r$ gives every term a rectangular counterpart, and completing the square reads off the center and radius.",
    "steps": [
      "$r^2=4r\\sin\\theta$, i.e. $x^2+y^2=4y$.",
      "Complete the square: $x^2+(y-2)^2=4$. The curve's points $x=4\\sin\\theta\\cos\\theta$, $y=4\\sin^2\\theta$ all satisfy it.",
      "So it is the circle with center $(0,2)$ and radius $2$ (at $\\theta=\\frac{\\pi}{2}$ it reaches the top point $(0,4)$)."
    ],
    "trap": "Mixing up the roles of $\\sin$ and $\\cos$ and answering \"center $(2,0)$\"; $r\\sin\\theta$ is $y$, so the center is on the $y$-axis.",
    "check": "At $\\theta=0$, $r=0$ is the origin; at $\\theta=\\frac{\\pi}{2}$ it is at $(0,4)$. The diameter runs from $(0,0)$ to $(0,4)$: center $(0,2)$, radius $2$."
  },
  "lec-10-q3a": {
    "spot": "The work $2$ J for the first stretch is there to find $k$: $\\frac{1}{2}k(0.1)^2=2$; then integrate $\\int_{0.1}^{0.2}kx\\,dx$.",
    "why": "Spring work grows with the square of the stretch, so doubling the stretch doesn't double the work; the second stretch needs an integral.",
    "steps": [
      "$\\int_0^{0.1}kx\\,dx=\\frac{k}{2}(0.01)=2$, so $k=400$ N/m.",
      "$W=\\int_{0.1}^{0.2}400x\\,dx=200(0.04-0.01)$.",
      "$W=6$ J."
    ],
    "trap": "Thinking the same distance takes another $2$ J; or answering the total work $8$ J when the question asks for the additional work.",
    "check": "Stretching from $0$ to $0.2$ takes $8$ J in total, $4$ times the first stretch (ratio of squared stretches); subtract $2$ to get $6$."
  },
  "lec-10-q3c": {
    "spot": "Each small piece of the chain is lifted a different height: the piece $y$ m below the roof weighs $2\\cdot9.8\\,dy$ N and is lifted $y$ m.",
    "why": "Different parts move different distances, so slice and integrate; equivalently, the center of mass rises $10$ m.",
    "steps": [
      "A piece $dy$ weighs $2\\times9.8\\,dy=19.6\\,dy$ N and is lifted $y$ m.",
      "$W=\\int_0^{20}19.6\\,y\\,dy=19.6\\times\\frac{20^2}{2}$.",
      "$W=3920$ J."
    ],
    "trap": "Multiplying the whole chain's weight $392$ N by $20$ m to get $7840$ J; only the bottom end travels $20$ m, and the top barely moves.",
    "check": "The center of mass is at the midpoint, $10$ m below the roof: total weight $392$ N times $10$ m is also $3920$ J."
  },
  "lec-11-m4": {
    "spot": "$\\left(1+\\frac{2}{n}\\right)^n$ is a $1^\\infty$ form that looks just like $\\left(1+\\frac{a}{n}\\right)^n\\to e^a$ with $a=2$.",
    "why": "Applying the definition of $e$ is fastest; if unsure, take logs to get $n\\ln\\left(1+\\frac{2}{n}\\right)$ and check.",
    "steps": [
      "Take logs: $\\ln a_n=n\\ln\\left(1+\\frac{2}{n}\\right)=\\frac{\\ln(1+2/n)}{1/n}$.",
      "$\\ln(1+u)\\approx u$, so $n\\cdot\\frac{2}{n}\\to2$.",
      "Exponentiate: the limit $=e^2$."
    ],
    "trap": "Reading it as \"the base $\\to1$, so $1^n=1$\"; the base and the exponent change together, and $1^\\infty$ is an indeterminate form.",
    "check": "Plug in $n=1000$: $(1.002)^{1000}\\approx7.374$, close to $e^2\\approx7.389$."
  },
  "lec-11-m5": {
    "spot": "All four statements relate convergence, boundedness and monotonicity; remember the Monotone Convergence Theorem, and the other three fall to oscillating sequences like $(-1)^n$ and $\\frac{(-1)^n}{n}$.",
    "why": "Counterexamples are the fastest way through concept multiple-choice: one counterexample rules out a statement.",
    "steps": [
      "\"Bounded implies convergent\": $(-1)^n$ is bounded but jumps between $1$ and $-1$, so it doesn't converge.",
      "\"Divergent implies unbounded\": again $(-1)^n$, divergent yet bounded.",
      "\"Convergent implies monotonic\": $\\frac{(-1)^n}{n}\\to0$ but goes up and down, not monotonic.",
      "Monotonic and bounded implies convergent: e.g. $1-\\frac{1}{n}$ is increasing with upper bound $1$ and converges to $1$. The correct statement is \"a monotonic bounded sequence must converge\"."
    ],
    "trap": "Reading \"convergent implies bounded\" (true) backwards as \"bounded implies convergent\" (false).",
    "check": "The Monotone Convergence Theorem is a direct consequence of the completeness of the reals: an increasing sequence bounded above approaches its least upper bound."
  },
  "lec-11-q1b": {
    "spot": "$\\frac{\\ln n}{n}$ is $\\frac{\\infty}{\\infty}$, and logs grow slower than any first power: replace $n$ with a continuous $x$ and use L'Hôpital's Rule.",
    "why": "A sequence limit can borrow a function limit; one round of L'Hôpital's Rule turns $\\ln$ into $\\frac{1}{x}$.",
    "steps": [
      "Consider $\\frac{\\ln x}{x}$, which is $\\frac{\\infty}{\\infty}$ as $x\\to\\infty$.",
      "L'Hôpital's Rule: the numerator's derivative is $\\frac{1}{x}$, the denominator's is $1$.",
      "$\\frac{1/x}{1}\\to0$, so $\\lim\\frac{\\ln n}{n}=0$."
    ],
    "trap": "Thinking top and bottom both go to infinity so the answer is $1$; $\\frac{\\infty}{\\infty}$ is indeterminate, and you have to compare growth rates.",
    "check": "Plug in $n=10000$: $\\frac{\\ln10000}{10000}\\approx0.00092$, small indeed."
  },
  "lec-11-q4a": {
    "spot": "$\\left(1-\\frac{1}{n}\\right)^n$ is of the form $\\left(1+\\frac{a}{n}\\right)^n$ with $a=-1$, so the limit is $e^{-1}$.",
    "why": "Apply the $e^a$ definition directly; taking logs just confirms $n\\ln\\left(1-\\frac{1}{n}\\right)\\to-1$.",
    "steps": [
      "Take logs: $n\\ln\\left(1-\\frac{1}{n}\\right)$.",
      "$\\ln(1-u)\\approx-u$, so $n\\cdot\\left(-\\frac{1}{n}\\right)\\to-1$.",
      "Exponentiate: the limit $=e^{-1}=\\frac{1}{e}$."
    ],
    "trap": "Answering $1$ (because the base tends to $1$) or $e$ (dropping the minus sign).",
    "check": "Plug in $n=1000$: $0.999^{1000}\\approx0.3677$, close to $\\frac{1}{e}\\approx0.3679$."
  },
  "lec-12-m4": {
    "spot": "All four options are positive series: look at the dominant term of each general term — $\\frac{n}{n^2+1}$ is roughly $\\frac{1}{n}$ and diverges like the harmonic series; the others are smaller than a convergent $p$-series or geometric series.",
    "why": "The Limit Comparison Test only asks which known series the general term matches in order, faster than running the Integral Test on each.",
    "steps": [
      "$\\frac{n/(n^2+1)}{1/n}=\\frac{n^2}{n^2+1}\\to1$, so it behaves like $\\sum\\frac{1}{n}$; the harmonic series diverges.",
      "It diverges at a logarithmic rate: $\\int_1^N\\frac{x}{x^2+1}dx=\\frac{1}{2}\\ln\\frac{N^2+1}{2}$ grows without bound.",
      "$\\sum\\frac{1}{n^{1.1}}$: a $p$-series with $p=1.1>1$, convergent.",
      "$\\frac{1}{2^n+1}<\\frac{1}{2^n}$ and $\\frac{1}{n^2+1}<\\frac{1}{n^2}$, both bounded by convergent series.",
      "So the divergent one is $\\sum\\frac{n}{n^2+1}$."
    ],
    "trap": "Seeing $\\frac{n}{n^2+1}\\to0$ and concluding convergence; a general term tending to $0$ is only a necessary condition.",
    "check": "Even though $p=1.1$ is only slightly above $1$, it still converges; the boundary is exactly $p=1$."
  },
  "lec-12-q1a": {
    "spot": "The numerator is a sum of two terms over $6^n$: split into $\\left(\\frac{1}{2}\\right)^n+\\left(\\frac{1}{3}\\right)^n$, two geometric series.",
    "why": "After splitting, apply $\\frac{\\text{first term}}{1-r}$ to each; note the series starts at $n=1$.",
    "steps": [
      "$\\frac{3^n+2^n}{6^n}=\\left(\\frac{1}{2}\\right)^n+\\left(\\frac{1}{3}\\right)^n$.",
      "$\\sum_{n\\ge1}\\left(\\frac{1}{2}\\right)^n=\\frac{1/2}{1-1/2}=1$.",
      "$\\sum_{n\\ge1}\\left(\\frac{1}{3}\\right)^n=\\frac{1/3}{1-1/3}=\\frac{1}{2}$.",
      "Total $1+\\frac{1}{2}=\\frac{3}{2}$."
    ],
    "trap": "Using $\\frac{1}{1-r}$ (the formula starting at $n=0$) and getting $2+\\frac{3}{2}=\\frac{7}{2}$, which counts the two $n=0$ terms extra.",
    "check": "The first two terms $\\frac{5}{6}+\\frac{13}{36}\\approx1.19$, and the rest keep shrinking; a total of $1.5$ is reasonable."
  },
  "lec-13-m1": {
    "spot": "The alternating harmonic series: with absolute values it becomes the harmonic series (divergent), but the alternating version has terms decreasing to $0$ (convergent) — the standard example of conditional convergence.",
    "why": "Classifying convergence takes two questions: does the absolute-value series converge? If not, use the Alternating Series Test on the original.",
    "steps": [
      "Absolute values: $\\sum\\frac{1}{n}$ is the harmonic series, whose partial sums grow without bound like $\\ln N$, so it is not absolutely convergent.",
      "Alternating Series Test: $\\frac{1}{n}$ is decreasing and tends to $0$.",
      "So the original series converges (to $\\ln2$) while the absolute-value series diverges: conditionally convergent."
    ],
    "trap": "Seeing \"the harmonic series diverges\" and answering divergent; the alternating signs make neighboring terms cancel, and the original series converges.",
    "check": "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$ at $x=1$ is exactly this series, with sum $\\ln2$."
  },
  "lec-13-m5": {
    "spot": "It's an alternating series ($(-1)^n$ with $\\frac{1}{n!}$ decreasing to $0$): the truncation error is at most the first omitted term. The first 4 terms go up to $n=3$, so the next term is $n=4$.",
    "why": "The Alternating Series Estimation Theorem gives the bound directly; no need to compute the true sum $e^{-1}$.",
    "steps": [
      "First 4 terms: $1-1+\\frac{1}{2}-\\frac{1}{6}=\\frac{1}{3}$.",
      "$\\frac{1}{n!}$ decreases to $0$, so the error is $\\le$ the first omitted term $\\frac{1}{4!}$, and $4!=\\int_0^\\infty t^4e^{-t}dt=24$.",
      "Error bound $\\frac{1}{24}$."
    ],
    "trap": "Using the last kept term $\\frac{1}{3!}=\\frac{1}{6}$ as the bound; the right one is the next term $\\frac{1}{4!}$.",
    "check": "The actual error $e^{-1}-\\frac{1}{3}\\approx0.0345$ is indeed no more than $\\frac{1}{24}\\approx0.0417$."
  },
  "lec-13-q1a": {
    "spot": "$\\frac{(-1)^n}{\\sqrt n}$: in absolute value it's a $p$-series with $p=\\frac{1}{2}$ (divergent), while the alternating terms decrease to $0$ (convergent).",
    "why": "Check absolute convergence first, then the Alternating Series Test; two steps and it's classified.",
    "steps": [
      "Absolute values $\\sum\\frac{1}{\\sqrt n}$: $p=\\frac{1}{2}\\le1$, divergent; the integral $\\int_1^N\\frac{dx}{\\sqrt x}=2\\sqrt N-2$ grows without bound.",
      "Alternating Series Test: $\\frac{1}{\\sqrt{n+1}}<\\frac{1}{\\sqrt n}$, and $\\frac{1}{\\sqrt n}\\to0$.",
      "The original series converges and the absolute-value series diverges: conditionally convergent."
    ],
    "trap": "Seeing only $\\frac{1}{\\sqrt n}\\to0$ and calling it absolutely convergent; $p=\\frac{1}{2}$ is below $1$, so the absolute-value series diverges.",
    "check": "Compare: $\\sum\\frac{(-1)^n}{n^2}$ is absolutely convergent ($p=2>1$); here $p$ is too small."
  },
  "lec-14-m2": {
    "spot": "The coefficients are $n!$, which outgrow any $\\frac{1}{x^n}$: the ratio $\\frac{a_{n+1}}{a_n}=n+1\\to\\infty$, so the radius of convergence is $0$.",
    "why": "Factorial coefficients call for the Ratio Test; dividing consecutive terms leaves just $n+1$.",
    "steps": [
      "Ratio: $\\left|\\frac{(n+1)!\\,x^{n+1}}{n!\\,x^n}\\right|=(n+1)|x|$.",
      "For any $x\\ne0$, $(n+1)|x|\\to\\infty>1$ and the series diverges; it converges only at $x=0$.",
      "$R=\\lim\\left|\\frac{a_n}{a_{n+1}}\\right|=\\lim\\frac{1}{n+1}=0$."
    ],
    "trap": "Flipping the ratio and thinking $R=\\infty$; that is the case for $\\sum\\frac{x^n}{n!}$ ($e^x$).",
    "check": "Even at $x=0.01$, the $n$-th term $n!\\,(0.01)^n$ starts growing once $n>100$, so it can't converge."
  },
  "lec-14-q2a": {
    "spot": "Write $\\frac{x}{4+x^2}$ as $\\frac{x}{4}\\cdot\\frac{1}{1-(-x^2/4)}$: a geometric series with ratio $-\\frac{x^2}{4}$, converging when $\\frac{x^2}{4}<1$.",
    "why": "Expanding as a geometric series directly is easier than finding the general coefficient and running the Ratio Test.",
    "steps": [
      "$\\frac{x}{4+x^2}=\\frac{x}{4}\\cdot\\frac{1}{1+x^2/4}$.",
      "Expand: $\\sum_{n\\ge0}\\frac{(-1)^nx^{2n+1}}{4^{n+1}}$; checking at $x=1$, the sum is $\\frac{1}{5}$.",
      "The geometric series converges when $\\left|\\frac{x^2}{4}\\right|<1$, i.e. $|x|<2$: radius of convergence $2$."
    ],
    "trap": "Noticing $4+x^2$ is never $0$ for real numbers and concluding the radius is infinite; the complex points $\\pm2i$ are what block it.",
    "check": "At $x=2$ the ratio is $-1$ and the terms don't go to $0$, so the boundary really diverges."
  },
  "lec-15-m4": {
    "spot": "$\\sqrt{1+x}=(1+x)^{1/2}$ is a binomial expansion with $\\alpha=\\frac{1}{2}$: coefficients $1$, $\\alpha$, $\\frac{\\alpha(\\alpha-1)}{2}$.",
    "why": "Writing the binomial coefficients directly is faster than computing $f''(0)$ and dividing by $2!$, and you're less likely to forget the division.",
    "steps": [
      "$f(0)=1$, $f'(0)=\\frac{1}{2}$.",
      "$f''(0)=-\\frac{1}{4}$, so the quadratic coefficient is $\\frac{f''(0)}{2!}=-\\frac{1}{8}$ (that is, $\\frac{\\frac{1}{2}\\cdot(-\\frac{1}{2})}{2}$).",
      "Second-degree Maclaurin polynomial: $1+\\frac{x}{2}-\\frac{x^2}{8}$."
    ],
    "trap": "Forgetting to divide by $2!$ and writing $1+\\frac{x}{2}-\\frac{x^2}{4}$.",
    "check": "The error should be of cubic order: $\\frac{\\sqrt{1+x}-P_2(x)}{x^3}\\to\\frac{1}{16}$."
  },
  "lec-15-m5": {
    "spot": "$\\cos(x^2)$ is the known series of $\\cos u$ with $u$ replaced by $x^2$: $u^{2n}$ becomes $x^{4n}$, and the denominator $(2n)!$ stays put.",
    "why": "Substituting into a known series takes one step; differentiating $\\cos(x^2)$ repeatedly gets messier and messier.",
    "steps": [
      "$\\cos u=\\sum_{n\\ge0}\\frac{(-1)^nu^{2n}}{(2n)!}=1-\\frac{u^2}{2}+\\frac{u^4}{24}-\\cdots$.",
      "Substitute $u=x^2$: $\\cos(x^2)=1-\\frac{x^4}{2}+\\frac{x^8}{24}-\\cdots$; the powers become $4n$.",
      "So $\\cos(x^2)=\\sum\\frac{(-1)^nx^{4n}}{(2n)!}$; at $x=0.7$ the first four terms are already very accurate."
    ],
    "trap": "Changing the powers and also changing the denominator to $(4n)!$; the factorial comes from $\\cos u$ itself and doesn't change under substitution.",
    "check": "The coefficient of $x^2$ should be $0$ ($\\cos(x^2)$ is very flat near $0$), and the series only starts changing at $x^4$. Consistent."
  },
  "refine-derivatives-005": {
    "spot": "$\\frac{f'}{f}$ is exactly $(\\ln f)'$, and $f$ is a bunch of powers multiplied and divided: take logs to split it into three terms.",
    "why": "Logarithmic differentiation turns products and quotients into sums and differences, much faster than chaining the Quotient Rule and Product Rule.",
    "steps": [
      "$\\ln f=3\\ln(x+1)+5\\ln(x+3)-2\\ln(x+2)$.",
      "$\\frac{f'}{f}=\\frac{3}{x+1}+\\frac{5}{x+3}-\\frac{2}{x+2}$.",
      "Plug in $x=0$: $3+\\frac{5}{3}-1=\\frac{11}{3}$."
    ],
    "trap": "The $(x+2)^2$ in the denominator becomes a minus sign after taking logs; writing a plus gives $3+\\frac{5}{3}+1=\\frac{17}{3}$.",
    "check": "No need to compute $f(0)=\\frac{243}{4}$ and $f'(0)$ and divide; logarithmic differentiation gives the ratio directly."
  },
  "refine-derivatives-007": {
    "spot": "$f(x)=2x+\\arctan x$ equals $0$ at $0$: $g(0)=0$, so $g'(0)=\\frac{1}{f'(0)}$.",
    "why": "The inverse can't be written down, and the inverse-function derivative just needs the reciprocal of $f'$ at the corresponding point.",
    "steps": [
      "$f(0)=0+\\arctan0=0$, so $g(0)=0$.",
      "$f'(x)=2+\\frac{1}{1+x^2}$, $f'(0)=3$.",
      "$g'(0)=\\frac{1}{3}$."
    ],
    "trap": "Remembering the derivative of $\\arctan x$ as $\\frac{1}{\\sqrt{1-x^2}}$ (that's $\\arcsin$); at $0$ they happen to agree, but at another point it would be wrong.",
    "check": "$f(0.01)\\approx0.03$: the output moves $0.03$ while the input moves $0.01$, a ratio of $\\frac{1}{3}$."
  },
  "refine-derivatives-009": {
    "spot": "Curvature of a parametric curve: $\\kappa=\\frac{|x'y''-y'x''|}{(x'^2+y'^2)^{3/2}}$; at $t=\\frac{\\pi}{2}$ the point is $(0,1)$, an endpoint of the ellipse's minor axis.",
    "why": "For a parametric curve just apply the formula; at $t=\\frac{\\pi}{2}$ the four derivatives are all $0$ or $\\pm1$, $\\pm2$, so the arithmetic is clean.",
    "steps": [
      "$x'=-2\\sin t=-2$, $y'=\\cos t=0$.",
      "$x''=-2\\cos t=0$, $y''=-\\sin t=-1$.",
      "$\\kappa=\\frac{|(-2)(-1)-0\\cdot0|}{(4+0)^{3/2}}=\\frac{2}{8}=\\frac{1}{4}$."
    ],
    "trap": "Forgetting the $\\frac{3}{2}$ power in the denominator and getting $\\frac{2}{4}=\\frac{1}{2}$; or taking the radius of curvature $4$ as the curvature.",
    "check": "Use the upper half-ellipse $y=\\sqrt{1-x^2/4}$ instead: at $x=0$, $y'=0$, so the curvature is just $|y''(0)|=\\frac{1}{4}$."
  },
  "refine-integrals-022": {
    "spot": "The derivative $2x$ of the $x^2+1$ under the root is sitting right outside (up to a constant): substitute $u=x^2+1$.",
    "why": "After substituting only a power of $\\sqrt u$ is left, and changing the limits too means you never have to switch back to $x$.",
    "steps": [
      "$u=x^2+1$, $du=2x\\,dx$; $x=0\\to u=1$, $x=\\sqrt3\\to u=4$.",
      "Integral $=\\frac{1}{2}\\int_1^4\\sqrt u\\,du=\\frac{1}{3}u^{3/2}\\Big|_1^4$.",
      "$=\\frac{1}{3}(8-1)=\\frac{7}{3}$."
    ],
    "trap": "Changing the variable but not the limits, plugging $0$ to $\\sqrt3$ into $\\frac{1}{3}u^{3/2}$ and getting $\\frac{1}{3}\\cdot3^{3/2}$.",
    "check": "The integrand increases on $[0,\\sqrt3]$ with maximum $\\sqrt3\\cdot2\\approx3.46$, so the integral should be less than $\\sqrt3\\times3.46=6$."
  },
  "refine-integrals-030": {
    "spot": "The inflow rate $r(t)$ decreases over time, and the total is the rate integrated over time: $\\int_0^{10}50e^{-0.1t}dt$.",
    "why": "The rate isn't constant, so you can't just multiply by time; the integral of an exponential is one line.",
    "steps": [
      "Antiderivative: $\\int50e^{-0.1t}dt=-500e^{-0.1t}$.",
      "Evaluate from $0$ to $10$: $-500e^{-1}+500=500(1-e^{-1})\\approx316$ L.",
      "Answer: $500(1-e^{-1})$ L."
    ],
    "trap": "Multiplying the initial rate by the time: $50\\times10=500$ L, ignoring that the rate keeps dropping.",
    "check": "The rate falls from $50$ to $50e^{-1}\\approx18.4$, so the total should be between $184$ and $500$."
  },
  "refine-series-001": {
    "spot": "$\\sin\\frac{n\\pi}{2}$ cycles through $1,0,-1,0,\\dots$: the even terms vanish, leaving $1-\\frac{1}{3}+\\frac{1}{5}-\\cdots$, exactly the series for $\\arctan1$.",
    "why": "List the periodic coefficients first and recognize the Leibniz series; then you know the sum without any convergence test.",
    "steps": [
      "$n=1,2,3,4$: $\\sin\\frac{n\\pi}{2}=1,0,-1,0$, period $4$.",
      "The series becomes $\\sum_{k\\ge0}\\frac{(-1)^k}{2k+1}=1-\\frac{1}{3}+\\frac{1}{5}-\\cdots$.",
      "$\\arctan x=\\sum\\frac{(-1)^kx^{2k+1}}{2k+1}=\\int_0^x\\frac{dt}{1+t^2}$; plug in $x=1$.",
      "Sum $=\\arctan1=\\frac{\\pi}{4}$."
    ],
    "trap": "Seeing $\\frac{1}{n}$ and saying it diverges like the harmonic series; half the coefficients are $0$ and the rest alternate in sign, so it actually converges.",
    "check": "Partial sum $1-\\frac{1}{3}+\\frac{1}{5}\\approx0.867$, minus $\\frac{1}{7}$ gives $0.724$, and $\\frac{\\pi}{4}\\approx0.785$ sits in between."
  },
  "refine-series-017": {
    "spot": "$\\frac{(-1)^n}{\\ln n}$: in absolute value $\\frac{1}{\\ln n}>\\frac{1}{n}$, bigger than the harmonic series; but the alternating terms decrease to $0$.",
    "why": "The standard two steps: the Comparison Test shows the absolute-value series diverges, and the Alternating Series Test shows the original converges.",
    "steps": [
      "$\\ln n<n$, so $\\frac{1}{\\ln n}>\\frac{1}{n}$; $\\sum\\frac{1}{n}$ diverges, hence $\\sum\\frac{1}{\\ln n}$ diverges too: not absolutely convergent.",
      "Alternating Series Test: $\\ln n$ is increasing, so $\\frac{1}{\\ln n}$ is decreasing.",
      "$\\frac{1}{\\ln n}\\to0$ (slowly, but it really does tend to $0$): at $n=10^6$ it is about $0.072$.",
      "The original series converges and the absolute-value series diverges: conditionally convergent."
    ],
    "trap": "Thinking $\\frac{1}{\\ln n}$ doesn't tend to $0$ and declaring divergence; it does tend to $0$, just very slowly.",
    "check": "Compare with $\\frac{(-1)^n}{n}$: replacing the denominator with the slower $\\ln n$ makes the absolute-value series diverge even harder, but the Alternating Series Test still applies."
  },
  "refine-series-019": {
    "spot": "$1+\\frac{1}{n^2-1}=\\frac{n^2}{(n-1)(n+1)}=\\frac{n}{n-1}\\cdot\\frac{n}{n+1}$: two chains of fractions, each telescoping.",
    "why": "For an infinite product, first write each factor as ratios of neighbors; the partial product cancels down to its ends, then take the limit.",
    "steps": [
      "$1+\\frac{1}{n^2-1}=\\frac{n^2}{(n-1)(n+1)}$.",
      "Partial products $\\prod_{n=2}^N\\frac{n}{n-1}=N$ and $\\prod_{n=2}^N\\frac{n}{n+1}=\\frac{2}{N+1}$; multiplied, $P_N=\\frac{2N}{N+1}$. E.g. $N=3$: $\\frac{4}{3}\\cdot\\frac{9}{8}=\\frac{3}{2}$.",
      "As $N\\to\\infty$: $P_N\\to2$."
    ],
    "trap": "Looking only at the first chain $\\prod\\frac{n}{n-1}=N\\to\\infty$ and calling it divergent; the second chain's $\\frac{2}{N+1}$ cancels it.",
    "check": "Taking logs turns it into a series: $\\sum\\ln\\left(1+\\frac{1}{n^2-1}\\right)=\\ln2$."
  },
  "refine-series-037": {
    "spot": "The recursion $a_n=a_{n-1}+2$, $a_0=1$ is an arithmetic sequence $a_n=2n+1$: split $G(x)$ into two known series $2\\sum nx^n+\\sum x^n$.",
    "why": "Write the general term of the arithmetic sequence first, then use $\\sum x^n=\\frac{1}{1-x}$ and $\\sum nx^n=\\frac{x}{(1-x)^2}$; more direct than solving a generating-function equation from the recursion.",
    "steps": [
      "$a_n=1+2n$: it satisfies $a_0=1$ and $a_n-a_{n-1}=2$.",
      "$\\sum_{n\\ge0}\\left(\\frac{1}{2}\\right)^n=2$, $\\sum_{n\\ge0}n\\left(\\frac{1}{2}\\right)^n=\\frac{1/2}{(1/2)^2}=2$.",
      "$G\\left(\\frac{1}{2}\\right)=2\\cdot2+2=6$."
    ],
    "trap": "Writing the general term as $a_n=2n$ (forgetting $a_0=1$), which gives $G\\left(\\frac{1}{2}\\right)=4$.",
    "check": "Closed form $G(x)=\\frac{1+x}{(1-x)^2}$; at $x=\\frac{1}{2}$: $\\frac{3/2}{1/4}=6$."
  },
  "ser-004": {
    "spot": "$\\frac{(-1)^{n+1}}{n}$ is the alternating harmonic series: without the signs it is the divergent harmonic series; with them the terms decrease to $0$.",
    "why": "For alternating series always ask about absolute convergence first; if that fails, use the Alternating Series Test. Two steps settle it.",
    "steps": [
      "Absolute values $\\sum\\frac{1}{n}$ diverge: the partial sums grow like $\\ln N$.",
      "$\\frac{1}{n}$ is decreasing with limit $0$, so the Alternating Series Test applies.",
      "The original series converges (sum $\\ln 2$) while the absolute values diverge: conditionally convergent."
    ],
    "trap": "Thinking \"terms go to $0$ means absolutely convergent\"; absolute convergence depends on $\\sum\\frac{1}{n}$, which diverges.",
    "check": "The partial sums $1,\\ 0.5,\\ 0.83,\\ 0.58,\\dots$ close in on $\\ln2\\approx0.693$ from both sides."
  },
  "ser-005": {
    "spot": "$\\frac{n}{n^2+1}$ has a linear numerator and quadratic denominator, so overall it looks like $\\frac{1}{n}$: use the Limit Comparison Test with the harmonic series.",
    "why": "The ratio of the general term to $\\frac{1}{n}$ tends to $1$, so the Limit Comparison Test decides it in one step, no integral needed.",
    "steps": [
      "$\\frac{n/(n^2+1)}{1/n}=\\frac{n^2}{n^2+1}\\to1$, so it behaves like $\\sum\\frac{1}{n}$.",
      "The harmonic series diverges; the integral confirms it: $\\int_1^N\\frac{x}{x^2+1}dx=\\frac{1}{2}\\ln\\frac{N^2+1}{2}$ grows without bound.",
      "So the series diverges."
    ],
    "trap": "Seeing the general term go to $0$ and calling it convergent; $\\frac{1}{n}$ also goes to $0$, yet the harmonic series diverges.",
    "check": "For $n\\ge1$, $\\frac{n}{n^2+1}\\ge\\frac{1}{2n}$, so the direct Comparison Test also shows divergence."
  },
  "ser-013": {
    "spot": "$(-1)^n\\frac{n}{n+1}$: since $\\frac{n}{n+1}\\to1$, the terms bounce around $\\pm1$ and don't go to $0$ at all.",
    "why": "Do the $n$-th term test first: if the terms don't go to $0$ the series diverges outright, and the Alternating Series Test doesn't even apply.",
    "steps": [
      "$\\frac{n}{n+1}\\to1$.",
      "So the even terms of $a_n$ tend to $1$ and the odd terms to $-1$; $\\lim a_n$ is not $0$.",
      "By the $n$-th term test, the series diverges."
    ],
    "trap": "Seeing alternating signs and using the Alternating Series Test to claim convergence; that test requires terms decreasing to $0$, which fails here.",
    "check": "The partial sums bounce between near $0$ and near $-1$ (adding or subtracting almost $1$ each time), so they can't converge to a single number."
  },
  "ser-016": {
    "spot": "The general term has two kinds of factorial, $(n!)^2$ and $(2n)!$: dividing consecutive terms cancels most of them — Ratio Test.",
    "why": "Use the Ratio Test for factorial series; for the Comparison Test it's hard to find a suitable series to compare with.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)^2}{(2n+1)(2n+2)}=\\frac{n+1}{2(2n+1)}$.",
      "As $n\\to\\infty$: the ratio $\\to\\frac{1}{4}$.",
      "$\\frac{1}{4}<1$, so by the Ratio Test the series converges."
    ],
    "trap": "Writing $(2n+2)!$ divided by $(2n)!$ as just $2n+2$ and missing the $2n+1$; the ratio becomes $\\frac{n+1}{2}\\to\\infty$ and you wrongly conclude divergence.",
    "check": "$a_n=\\frac{1}{\\binom{2n}{n}}$ and $\\binom{2n}{n}\\ge2^n$, so $a_n\\le\\left(\\frac{1}{2}\\right)^n$; comparison with a geometric series also gives convergence."
  }
};
