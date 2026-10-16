// Detail v2, English — batch 017. Translation of tools/content/detail/017.js (text only; claims live in the Chinese file).
module.exports = {
  "dm-seq-010": {
    "spot": "The problem already writes $n^{1/n}$ as $e^{(\\ln n)/n}$, and the factor in front is exactly $\\frac{n}{\\ln n}$ — the reciprocal of the exponent. Let $u=\\frac{\\ln n}{n}$ and the whole expression is $\\frac{e^u-1}{u}$.",
    "why": "After switching to $u$ it becomes the most basic $\\frac{e^u-1}{u}\\to 1$; applying L'Hôpital's Rule in $n$ directly drags in the derivative of $n^{1/n}$ and gets messier and messier.",
    "steps": [
      "Let $u=\\frac{\\ln n}{n}$; then $n^{1/n}-1=e^{u}-1$ and $\\frac{n}{\\ln n}=\\frac{1}{u}$, so the expression $=\\frac{e^u-1}{u}$.",
      "As $n\\to\\infty$, $u=\\frac{\\ln n}{n}\\to 0^+$ (logs grow much more slowly than linear); e.g. at $n=10^6$, $u\\approx 1.4\\times 10^{-5}$.",
      "$e^u=1+u+\\frac{u^2}{2}+\\cdots$, so $\\frac{e^u-1}{u}=1+\\frac{u}{2}+\\cdots\\to 1$.",
      "The limit is $1$."
    ],
    "trap": "Seeing $n^{1/n}\\to 1$, saying $n^{1/n}-1\\to 0$ and the whole thing is $0$ — but the front factor $\\frac{n}{\\ln n}\\to\\infty$; this is an $\\infty\\cdot 0$ indeterminate form, and you can't take the limits separately.",
    "check": "Plug in $n=1000$: $\\frac{1000}{\\ln 1000}(1000^{1/1000}-1)\\approx 1.0035$, slightly above $1$, which is exactly the correction $\\frac{u}{2}\\approx 0.0035$."
  },
  "gp-010": {
    "spot": "The broken line passes through $(0,0),(1,2),(2,2),(3,0)$ and stays entirely above the $x$-axis — the integral is the area under it: two triangles plus a rectangle (together a trapezoid).",
    "why": "The graph is made of line segments, so geometric area is faster than writing a formula for each piece and integrating; the formulas are only for confirmation.",
    "steps": [
      "$[0,1]$: $f=2x$, a triangle with base $1$ and height $2$, area $1$.",
      "$[1,2]$: $f=2$, a rectangle with base $1$ and height $2$, area $2$.",
      "$[2,3]$: $f=6-2x$, again a triangle with base $1$ and height $2$, area $1$.",
      "Total $1+2+1=4$."
    ],
    "trap": "Treating the whole shape as a triangle with base $3$ and height $2$, getting $3$ — the top is a flat plateau, so it's a trapezoid.",
    "check": "Trapezoid formula: top $1$, bottom $3$, height $2$, area $\\frac{1}{2}(1+3)\\cdot 2=4$."
  },
  "gp-012": {
    "spot": "The question asks for $x\\to 1^-$, so look only at the piece left of $x=1$: the line $(0,0)\\to(1,2)$; the right-hand value $f=3$ has nothing to do with the left-hand limit.",
    "why": "A one-sided limit only uses the formula on that side; write the equation of the left line and plug in $x=1$.",
    "steps": [
      "The left line passes through $(0,0)$ and $(1,2)$, slope $2$, so $f(x)=2x$ (for $0\\le x<1$).",
      "As $x$ approaches $1$ from the left: $f(x)=2x\\to 2$.",
      "On the right, $f=3$ gives the right-hand limit $3$, which differs from the left-hand limit $2$, so $x=1$ is a jump discontinuity.",
      "The left-hand limit is $2$."
    ],
    "trap": "Seeing $f(1)=3$ and answering $3$ — that's the function value (and the right-hand limit); the left-hand limit only uses the left line.",
    "check": "Plug in $x=0.999$: $f=1.998$, very close to $2$."
  },
  "gx-016": {
    "spot": "The signed area under a velocity graph is displacement; the broken line crosses the horizontal axis at $t=6$, so the piece on $[6,8]$ is below the axis and counts as negative.",
    "why": "Everything is line segments, so adding and subtracting triangle and rectangle areas is fastest; the question asks for displacement, not distance, so the area below the axis is subtracted.",
    "steps": [
      "$[0,2]$: $v=2t$, triangle area $\\frac{1}{2}\\cdot 2\\cdot 4=4$.",
      "$[2,4]$: $v=4$, rectangle area $2\\cdot 4=8$.",
      "$[4,6]$: $v=12-2t$, falling from $4$ to $0$, triangle area $4$.",
      "$[6,8]$: the same line keeps going down to $-4$, a triangle below the axis, signed area $-4$.",
      "Displacement $=4+8+4-4=12$."
    ],
    "trap": "Adding the piece below the axis as well, getting $20$ — that's the total distance, not the displacement.",
    "check": "Total distance $20$, displacement $12$; the difference $8$ is exactly twice the area below the axis."
  },
  "gx-038": {
    "spot": "The curve is given with parameter $t$ and you want the tangent slope — $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$: differentiate each with respect to $t$ and divide.",
    "why": "No need to eliminate $t$ and write $y$ as a function of $x$ (which would also mean choosing the sign of a root); dividing the parametric derivatives is cleanest.",
    "steps": [
      "$\\frac{dx}{dt}=-2\\sin t$.",
      "$\\frac{dy}{dt}=\\cos t$.",
      "$\\frac{dy}{dx}=\\frac{\\cos t}{-2\\sin t}=-\\frac{1}{2}\\cot t$.",
      "Plug in $t=\\frac{\\pi}{4}$: $\\cot\\frac{\\pi}{4}=1$, slope $-\\frac{1}{2}$."
    ],
    "trap": "Flipping it upside down as $\\frac{dx/dt}{dy/dt}=-2\\tan t$, getting $-2$.",
    "check": "Implicit differentiation: $\\frac{x^2}{4}+y^2=1$ gives $\\frac{dy}{dx}=-\\frac{x}{4y}$; plugging in the point $(\\sqrt{2},\\frac{\\sqrt{2}}{2})$ gives $-\\frac{1}{2}$."
  },
  "gx-040": {
    "spot": "Area enclosed by a polar curve: $A=\\frac{1}{2}\\int r^2\\,d\\theta$; $r=2\\cos\\theta$ traces exactly one full loop for $0\\le\\theta\\le\\pi$.",
    "why": "Apply the polar area formula directly; reduce $\\cos^2$ with the double-angle formula and it integrates.",
    "steps": [
      "$A=\\frac{1}{2}\\int_0^{\\pi}(2\\cos\\theta)^2\\,d\\theta=\\int_0^{\\pi}2\\cos^2\\theta\\,d\\theta$.",
      "Double angle: $2\\cos^2\\theta=1+\\cos 2\\theta$.",
      "$\\int_0^{\\pi}(1+\\cos 2\\theta)\\,d\\theta=\\pi+0=\\pi$.",
      "The area is $\\pi$."
    ],
    "trap": "Assuming $\\theta$ must run from $0$ to $2\\pi$, getting $2\\pi$ — this curve completes one loop on $[0,\\pi]$, and $[\\pi,2\\pi]$ traces it again.",
    "check": "Multiply both sides of $r=2\\cos\\theta$ by $r$: $x^2+y^2=2x$, i.e. $(x-1)^2+y^2=1$, a circle of radius $1$ with area $\\pi\\cdot 1^2$."
  },
  "gx-043": {
    "spot": "Tangent slope of the parametric curve $x=t^2$, $y=t^3-3t$: $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$. Two values of $t$ ($\\pm\\sqrt{3}$) pass through the crossing point, and the problem specifies $t=\\sqrt{3}$.",
    "why": "At a self-crossing the curve has two tangent lines, and only the parametric form tells you which branch you're on; eliminating $t$ mixes the two branches together.",
    "steps": [
      "$\\frac{dx}{dt}=2t$.",
      "$\\frac{dy}{dt}=3t^2-3$.",
      "$\\frac{dy}{dx}=\\frac{3t^2-3}{2t}$.",
      "Plug in $t=\\sqrt{3}$: $\\frac{9-3}{2\\sqrt{3}}=\\frac{6}{2\\sqrt{3}}=\\sqrt{3}$."
    ],
    "trap": "Plugging in the other branch $t=-\\sqrt{3}$ (same point $(3,0)$), getting $-\\sqrt{3}$ — a crossing point has two slopes, so check which $t$ the problem specifies.",
    "check": "$t=\\pm\\sqrt{3}$ both give $x=3$, $y=0$, so it is indeed the same crossing point."
  },
  "gx-053": {
    "spot": "The question asks where the graph is concave down — look at the sign of the second derivative: concave down where $f''<0$. $f$ is an even-degree polynomial and $f''$ is quadratic, so solve one quadratic inequality.",
    "why": "Concavity is decided by $f''$, not by $f'$ (increasing/decreasing); guessing inflection points from a picture is unreliable, algebra is the safest.",
    "steps": [
      "$f'(x)=4x^3-12x$, $f''(x)=12x^2-12=12(x^2-1)$.",
      "$f''=0$ at $x=\\pm 1$; these two points are inflection points.",
      "Test the middle with $x=0$: $f''(0)=-12<0$; test outside with $x=2$: $f''(2)=36>0$.",
      "So the interval where it is concave down is $(-1,1)$."
    ],
    "trap": "Solving $f'<0$ and getting the decreasing intervals $(-\\infty,-\\sqrt{3})\\cup(0,\\sqrt{3})$ — that's increasing/decreasing; concavity needs $f''$.",
    "check": "$x=0$ is a hilltop (local max), and near a hilltop the graph should be concave down."
  },
  "gx-054": {
    "spot": "Concave up means $f''>0$; $(\\sin x)''=-\\sin x$, so just find where $\\sin x<0$ — the half-period with the trough.",
    "why": "The second derivative of this trig function is itself with a minus sign, so just read off the sign of sine; no need to sketch and guess.",
    "steps": [
      "$f'(x)=\\cos x$, $f''(x)=-\\sin x$.",
      "$f''>0\\iff\\sin x<0$; in $(0,2\\pi)$ that's $\\pi<x<2\\pi$.",
      "At the endpoint $x=\\pi$, $f''=0$; it is an inflection point.",
      "So the interval where it is concave up is $(\\pi,2\\pi)$."
    ],
    "trap": "Confusing concave up with increasing, solving $\\cos x>0$ and getting $(0,\\frac{\\pi}{2})\\cup(\\frac{3\\pi}{2},2\\pi)$.",
    "check": "The trough $x=\\frac{3\\pi}{2}$ is a local min, and near a local min the graph must be concave up."
  },
  "lb-sim-002": {
    "spot": "On $[0,1]$, $\\lfloor 3x\\rfloor$ takes only the three values $0,1,2$ — a simple function, so the integral is \"each value times the measure of its piece\", summed.",
    "why": "The integral of a simple function is the definition itself, no limits needed; each piece has length $\\frac{1}{3}$.",
    "steps": [
      "On $[0,\\frac{1}{3})$, $\\lfloor 3x\\rfloor=0$; on $[\\frac{1}{3},\\frac{2}{3})$ it $=1$; on $[\\frac{2}{3},1)$ it $=2$ (the single point $x=1$ has measure $0$ and doesn't matter).",
      "Each piece has measure $\\frac{1}{3}$.",
      "Integral $=0\\cdot\\frac{1}{3}+1\\cdot\\frac{1}{3}+2\\cdot\\frac{1}{3}=1$."
    ],
    "trap": "Integrating $\\lfloor 3x\\rfloor$ as if it were $3x$, getting $\\frac{3}{2}$ — taking the integer part chops off the fractional part on every piece.",
    "check": "$\\lfloor 3x\\rfloor=3x-\\{3x\\}$, and the fractional part averages $\\frac{1}{2}$: $\\frac{3}{2}-\\frac{1}{2}=1$."
  },
  "lm-fl-007": {
    "spot": "The numerator has the floor $\\lfloor 3x\\rfloor$, which differs from $3x$ by at most $1$ — trapped between $3x-1$ and $3x$; after dividing by $x$ both sides tend to $3$: Squeeze Theorem.",
    "why": "The floor function has no handy algebraic formula, but its upper and lower bounds are tight; squeezing is the standard move.",
    "steps": [
      "For all $x$: $3x-1<\\lfloor 3x\\rfloor\\le 3x$.",
      "For $x>0$ divide by $x$: $3-\\frac{1}{x}<\\frac{\\lfloor 3x\\rfloor}{x}\\le 3$.",
      "The lower bound $3-\\frac{1}{x}\\to 3$, and the upper bound is $3$.",
      "By the Squeeze Theorem the limit is $3$."
    ],
    "trap": "Thinking the floor makes the function jump around so the limit doesn't exist — the size of the jumps is $\\frac{1}{x}$, which keeps shrinking.",
    "check": "Plug in $x=100.5$: $\\lfloor 301.5\\rfloor=301$, $\\frac{301}{100.5}\\approx 2.995$, very close to $3$."
  },
  "lm-os-004": {
    "spot": "On the two sides of $0$, $\\frac{1}{x}$ shoots to $+\\infty$ on one and $-\\infty$ on the other, and $\\arctan$ has different horizontal asymptotes at the two ends — split into left and right limits first.",
    "why": "The outer $\\arctan$ is continuous, so once you know where $\\frac{1}{x}$ goes you can move the limit inside; the two sides go opposite ways, so compute them separately.",
    "steps": [
      "$x\\to 0^+$: $\\frac{1}{x}\\to+\\infty$, $\\arctan\\frac{1}{x}\\to\\frac{\\pi}{2}$.",
      "$x\\to 0^-$: $\\frac{1}{x}\\to-\\infty$, $\\arctan\\frac{1}{x}\\to-\\frac{\\pi}{2}$.",
      "The left and right limits differ by $\\pi$, so the two-sided limit does not exist."
    ],
    "trap": "Looking only at the right side and writing $\\frac{\\pi}{2}$, or treating both $\\arctan(\\pm\\infty)$ as $\\frac{\\pi}{2}$.",
    "check": "Plug in $x=\\pm 0.001$: $\\arctan(\\pm 1000)\\approx\\pm 1.5698$, one positive and one negative."
  },
  "lm-os-007": {
    "spot": "Base $x\\to 0^+$ and exponent $\\sin x\\to 0$: a $0^0$ form — take logs to get $\\sin x\\cdot\\ln x$, then split it as $\\frac{\\sin x}{x}\\cdot x\\ln x$.",
    "why": "The variable is in both the base and the exponent, so logs are the only way; after pulling out $\\frac{\\sin x}{x}\\to 1$, what's left is the familiar $x\\ln x\\to 0$.",
    "steps": [
      "$x^{\\sin x}=e^{\\sin x\\,\\ln x}$.",
      "$\\sin x\\ln x=\\frac{\\sin x}{x}\\cdot x\\ln x$, and $\\frac{\\sin x}{x}\\to 1$.",
      "$x\\ln x\\to 0$ ($x$ goes to $0$ faster than $\\ln x$ goes to $-\\infty$); e.g. at $x=10^{-6}$ it is only $-1.4\\times 10^{-5}$.",
      "The exponent $\\to 0$, so the limit $=e^0=1$."
    ],
    "trap": "Seeing the base $\\to 0$ and answering $0$ — the exponent is also going to $0$; $0^0$ is an indeterminate form, and you need logs to see who wins.",
    "check": "Plug in $x=0.001$: $0.001^{\\sin 0.001}\\approx e^{-0.0069}\\approx 0.993$, close to $1$."
  },
  "lm-rc-002": {
    "spot": "The recursion $a_{n+1}=\\sqrt{6+a_n}$: if the limit exists, taking limits on both sides gives $L=\\sqrt{6+L}$ — first confirm the sequence is monotone and bounded, then solve this equation.",
    "why": "Increasing and bounded above guarantees convergence, then the fixed-point equation gives the answer in one step; no need to find a formula for the general term.",
    "steps": [
      "$a_1=\\sqrt{6}\\approx 2.449<3$; if $a_n<3$ then $a_{n+1}<\\sqrt{6+3}=3$. So every term is less than $3$.",
      "$a_2=\\sqrt{6+\\sqrt{6}}\\approx 2.907>a_1$; when $a_n<3$, $6+a_n>a_n^2$, so $a_{n+1}>a_n$ and the sequence is increasing.",
      "Increasing and bounded above, so it converges to some $L$; taking limits gives $L=\\sqrt{6+L}$, and squaring: $L^2-L-6=(L-3)(L+2)=0$.",
      "$a_n>0$, so $L=3$."
    ],
    "trap": "Keeping both roots $3$ and $-2$ after squaring — a square root is never negative; $-2$ is an extra root introduced by squaring.",
    "check": "One more term: $a_3=\\sqrt{6+\\sqrt{6+\\sqrt{6}}}\\approx 2.984$, closing in on $3$."
  },
  "lm-rc-004": {
    "spot": "$a_{n+1}=\\sqrt{1+a_n}$ is another \"root of itself\" recursion: once it's monotone and bounded, the limit satisfies $L=\\sqrt{1+L}$.",
    "why": "As with all recursions of this kind, first guarantee convergence, then solve the fixed-point equation; here the quadratic gives the golden ratio.",
    "steps": [
      "Bounded above by $2$: $a_1=1<2$, and if $a_n<2$ then $a_{n+1}<\\sqrt{3}<2$.",
      "Increasing: $a_2=\\sqrt{2}>1$; and when $a_n<\\frac{1+\\sqrt{5}}{2}$, $1+a_n>a_n^2$, so $a_{n+1}>a_n$.",
      "Take limits: $L=\\sqrt{1+L}\\Rightarrow L^2-L-1=0\\Rightarrow L=\\frac{1\\pm\\sqrt{5}}{2}$.",
      "$a_n>0$, so take the positive root $L=\\frac{1+\\sqrt{5}}{2}\\approx 1.618$."
    ],
    "trap": "Including the negative root $\\frac{1-\\sqrt{5}}{2}\\approx-0.618$ as an answer — every term of the sequence is a positive square root.",
    "check": "$a_3=\\sqrt{1+\\sqrt{2}}\\approx 1.554$, $a_4\\approx 1.598$, climbing steadily toward $1.618$."
  },
  "lm-sq-005": {
    "spot": "$\\sin\\frac{1}{x}$ oscillates wildly near $0$ and has no limit itself, but it is trapped between $\\pm 1$; the factor in front, $\\frac{1-\\cos x}{x}\\to 0$ — \"tends to $0$ times bounded\".",
    "why": "The oscillating part has no limit, and L'Hôpital's Rule won't help; bound it with absolute values, then you only need to show the other factor tends to $0$.",
    "steps": [
      "$|\\sin\\frac{1}{x}|\\le 1$, so $\\left|\\frac{1-\\cos x}{x}\\sin\\frac{1}{x}\\right|\\le\\left|\\frac{1-\\cos x}{x}\\right|$.",
      "$1-\\cos x\\approx\\frac{x^2}{2}$, so $\\frac{1-\\cos x}{x}\\approx\\frac{x}{2}$.",
      "Hence $\\frac{1-\\cos x}{x}\\to 0$, and the upper bound tends to $0$.",
      "Squeeze: the limit is $0$."
    ],
    "trap": "Seeing that $\\sin\\frac{1}{x}$ has no limit and saying the whole thing doesn't exist — a bounded oscillation times a factor tending to $0$ still gives $0$.",
    "check": "Plug in $x=0.01$: the upper bound $\\frac{1-\\cos 0.01}{0.01}\\approx 0.005$, and the whole expression can't exceed it in size."
  },
  "lx-con-002": {
    "spot": "You need to fill in a value to make $f$ continuous at $0$ — $c$ must equal $\\lim_{x\\to 0}\\frac{\\sin 3x}{x}$, a variant of $\\frac{\\sin u}{u}\\to 1$.",
    "why": "Continuity means \"the limit equals the function value\"; adjust the denominator to $3x$ and you can use the standard limit.",
    "steps": [
      "Continuity requires $c=f(0)=\\lim_{x\\to 0}\\frac{\\sin 3x}{x}$.",
      "Adjust the denominator: $\\frac{\\sin 3x}{x}=3\\cdot\\frac{\\sin 3x}{3x}$.",
      "$\\frac{\\sin u}{u}\\to 1$ ($u=3x\\to 0$), so the limit is $3$.",
      "$c=3$."
    ],
    "trap": "Thinking $\\frac{\\sin 3x}{x}\\to 1$ and taking $c=1$ — the angle is $3x$, so the denominator must be $3x$ to give $1$.",
    "check": "Plug in $x=0.01$: $\\frac{\\sin 0.03}{0.01}\\approx 2.99955$."
  },
  "lx-con-005": {
    "spot": "$\\frac{|x-4|}{x-4}$ is just the sign of $x-4$: $1$ on the right, $-1$ on the left. Both one-sided limits exist but differ — a textbook jump.",
    "why": "Classifying a discontinuity depends on two things: whether the one-sided limits exist and whether they are equal. Computing the two one-sided limits settles it.",
    "steps": [
      "$x>4$: $|x-4|=x-4$, the function value is $1$, right-hand limit $1$.",
      "$x<4$: $|x-4|=-(x-4)$, the function value is $-1$, left-hand limit $-1$.",
      "Both one-sided limits exist but differ by $2$, so no choice of $f(4)$ can join them.",
      "So it is a jump discontinuity."
    ],
    "trap": "Seeing the denominator is $0$ at $x=4$ and calling it an infinite discontinuity — the function only takes the values $\\pm 1$ and never blows up.",
    "check": "A removable discontinuity needs equal one-sided limits; here $1\\ne-1$, so it is not removable."
  },
  "lx-con-006": {
    "spot": "It says outright \"one step of Newton's method\" — the formula $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$ only needs two numbers, $f(\\frac{1}{2})$ and $f'(\\frac{1}{2})$.",
    "why": "Newton's method uses the tangent line to find the next approximate root; one iteration is pure algebra, the key is not to botch the fractions.",
    "steps": [
      "$f(\\frac{1}{2})=\\frac{1}{8}-2+1=-\\frac{7}{8}$.",
      "$f'(x)=3x^2-4$, $f'(\\frac{1}{2})=\\frac{3}{4}-4=-\\frac{13}{4}$.",
      "$\\frac{f(x_0)}{f'(x_0)}=\\frac{-7/8}{-13/4}=\\frac{7}{26}$.",
      "$x_1=\\frac{1}{2}-\\frac{7}{26}=\\frac{13-7}{26}=\\frac{3}{13}\\approx 0.2308$."
    ],
    "trap": "Writing $x_0+\\frac{f}{f'}$ (wrong sign), getting $\\frac{1}{2}+\\frac{7}{26}=\\frac{10}{13}$, farther from the root.",
    "check": "$f(\\frac{3}{13})>0$ and $f(0.26)<0$: the true root lies between $\\frac{3}{13}$ and $0.26$, so one iteration already gets very close."
  },
  "lx-sq-002": {
    "spot": "The numerator contains the oscillating $3\\sin x$, but it is trapped between $\\pm 3$, negligible next to $2x$ — squeeze with $-3\\le 3\\sin x\\le 3$.",
    "why": "L'Hôpital's Rule gives $2+3\\cos x$, which has no limit, but that does not mean the original limit fails to exist; the Squeeze Theorem is the right tool.",
    "steps": [
      "For large $x$, $x+5>0$, and $-3\\le 3\\sin x\\le 3$ gives $\\frac{2x-3}{x+5}\\le\\frac{2x+3\\sin x}{x+5}\\le\\frac{2x+3}{x+5}$.",
      "Lower bound: $\\frac{2x-3}{x+5}\\to 2$.",
      "Upper bound: $\\frac{2x+3}{x+5}\\to 2$.",
      "Squeeze: the limit is $2$."
    ],
    "trap": "Using L'Hôpital's Rule, finding that $\\lim(2+3\\cos x)$ doesn't exist, and concluding the original limit doesn't exist — L'Hôpital's Rule only helps when the limit of the ratio of derivatives exists.",
    "check": "Plug in $x=1000$: $\\frac{2000+3\\sin 1000}{1005}\\approx 1.993$, off from $2$ by only about $\\frac{10}{1005}$."
  },
  "lx-sq-005": {
    "spot": "The numerator $\\cos(x^2)$ always oscillates within $[-1,1]$ and the denominator $x^2\\to\\infty$ — \"bounded over infinity\": Squeeze Theorem.",
    "why": "$\\cos(x^2)$ has no limit, so you can't split it; trap it between $\\pm\\frac{1}{x^2}$, both of which tend to $0$.",
    "steps": [
      "$-1\\le\\cos(x^2)\\le 1$, so $-\\frac{1}{x^2}\\le\\frac{\\cos(x^2)}{x^2}\\le\\frac{1}{x^2}$.",
      "Upper bound $\\frac{1}{x^2}\\to 0$.",
      "Lower bound $-\\frac{1}{x^2}\\to 0$; by the Squeeze Theorem the limit is $0$."
    ],
    "trap": "Saying the limit doesn't exist because $\\cos(x^2)$ keeps oscillating — the amplitude is crushed to $0$ by $\\frac{1}{x^2}$.",
    "check": "Plug in $x=100$: $|\\frac{\\cos 10000}{10000}|\\le 0.0001$."
  },
  "td-ser-002": {
    "spot": "Outer $e^u$, inner $u=2\\arcsin x$, both with familiar expansions — expand $\\arcsin x$ through $x^5$, substitute into $e^u=\\sum\\frac{u^k}{k!}$, and collect only the $x^5$ terms.",
    "why": "Differentiating five times directly is nearly hopeless; $u$ has only odd powers, so only $k=1,3,5$ contribute to $x^5$, and collecting them is quick.",
    "steps": [
      "$\\arcsin x=x+\\frac{x^3}{6}+\\frac{3x^5}{40}+\\cdots$, so $u=2\\arcsin x=2x+\\frac{x^3}{3}+\\frac{3x^5}{20}+\\cdots$.",
      "$k=1$: the $x^5$ coefficient of $u$ itself is $\\frac{3}{20}$.",
      "$k=3$: $u^3=(2x)^3+3(2x)^2\\cdot\\frac{x^3}{3}+\\cdots=8x^3+4x^5+\\cdots$; dividing by $3!$ gives the $x^5$ coefficient $\\frac{4}{6}=\\frac{2}{3}$.",
      "$k=5$: $u^5=32x^5+\\cdots$; dividing by $5!$ gives $\\frac{32}{120}=\\frac{4}{15}$.",
      "Total $\\frac{3}{20}+\\frac{2}{3}+\\frac{4}{15}=\\frac{9+40+16}{60}=\\frac{65}{60}=\\frac{13}{12}$."
    ],
    "trap": "Computing only the $k=5$ term $\\frac{(2x)^5}{5!}$ and getting $\\frac{4}{15}$ — lower powers $u^k$ also produce $x^5$ when multiplied out.",
    "check": "Another route: $y=e^{2\\arcsin x}$ satisfies $(1-x^2)y''=xy'+4y$, giving the coefficient recursion $a_{n+2}=\\frac{n^2+4}{(n+1)(n+2)}a_n$; from $a_1=2$ we get $a_3=\\frac{5}{3}$ and $a_5=\\frac{13}{20}\\cdot\\frac{5}{3}=\\frac{13}{12}$."
  },
  "vc-cons-003": {
    "spot": "For the plane vector field $\\langle P,Q\\rangle$ to be conservative, the condition is $\\frac{\\partial P}{\\partial y}=\\frac{\\partial Q}{\\partial x}$; compute both sides and match coefficients to get $a$.",
    "why": "On the whole plane (simply connected), equal mixed partials is equivalent to being conservative, so there's no need to actually find a potential function.",
    "steps": [
      "$P=axy$: $\\frac{\\partial P}{\\partial y}=ax$.",
      "$Q=x^2+2y$: $\\frac{\\partial Q}{\\partial x}=2x$.",
      "We need $ax=2x$ for all $x$, so $a=2$."
    ],
    "trap": "Writing the condition backwards as $\\frac{\\partial P}{\\partial x}=\\frac{\\partial Q}{\\partial y}$, getting $ay=2$, which can't be solved for a constant.",
    "check": "With $a=2$ the potential function is $\\varphi=x^2y+y^2$: $\\varphi_x=2xy=P$, $\\varphi_y=x^2+2y=Q$."
  },
  "vc-div-002": {
    "spot": "Flux out of a closed surface (the unit sphere) — the Divergence Theorem turns it into a volume integral; $\\nabla\\cdot\\mathbf{F}=3(x^2+y^2+z^2)=3r^2$ depends only on the radius, so spherical shells finish it in one layer.",
    "why": "The surface integral directly would mean integrating $x^4+y^4+z^4$ over the sphere; the divergence is just $3r^2$, and with spherical shells $4\\pi r^2\\,dr$ it takes one line.",
    "steps": [
      "$\\nabla\\cdot\\mathbf{F}=3x^2+3y^2+3z^2=3r^2$.",
      "Divergence Theorem: flux $=\\iiint_{r\\le 1}3r^2\\,dV$; the spherical shell volume element is $dV=4\\pi r^2\\,dr$.",
      "$\\int_0^1 3r^2\\cdot 4\\pi r^2\\,dr=12\\pi\\cdot\\frac{1}{5}=\\frac{12\\pi}{5}$."
    ],
    "trap": "Treating the divergence as the constant $3$ times the volume of the ball, getting $4\\pi$ — the divergence is $3r^2$, smaller toward the center.",
    "check": "Directly: on the sphere $\\mathbf{F}\\cdot\\mathbf{n}=x^4+y^4+z^4$, and each term's surface integral is $2\\pi\\int_0^{\\pi}\\cos^4\\varphi\\sin\\varphi\\,d\\varphi=\\frac{4\\pi}{5}$; three terms give $\\frac{12\\pi}{5}$."
  },
  "vc-green-002": {
    "spot": "$\\oint P\\,dx+Q\\,dy$ around a closed plane curve (the unit circle) — Green's Theorem, and the integrand $Q_x-P_y$ is exactly the constant $2$, so the answer is $2\\times$ the area.",
    "why": "When the curl is constant, the double integral is just area, easier than parametrizing the line integral.",
    "steps": [
      "$Q=x+y$: $Q_x=1$; $P=x-y$: $P_y=-1$.",
      "$Q_x-P_y=1-(-1)=2$.",
      "The unit disk has area $\\pi$.",
      "$\\oint=\\iint 2\\,dA=2\\pi$."
    ],
    "trap": "Computing $P_y-Q_x=-2$ and getting $-2\\pi$ — Green's Theorem uses $Q_x-P_y$, and the order matters.",
    "check": "Parametrize directly with $x=\\cos t$, $y=\\sin t$: the integrand simplifies to $1$, and integrating from $0$ to $2\\pi$ gives $2\\pi$."
  },
  "vc-nab-001": {
    "spot": "$\\frac{1}{\\sqrt{x^2+y^2+z^2}}=\\frac{1}{r}$ is the 3D (Newtonian) potential, harmonic away from the origin — its Laplacian should come out $0$.",
    "why": "If you remember the result you can answer instantly; to verify, use $\\frac{\\partial^2}{\\partial x^2}r^{-1}=\\frac{3x^2-r^2}{r^5}$, and summing the three terms gives numerator $3r^2-3r^2$.",
    "steps": [
      "At $(1,2,2)$, $r=3$. The $x$ direction: $\\frac{3x^2-r^2}{r^5}=\\frac{3-9}{243}=-\\frac{2}{81}$.",
      "The $y$ direction: $\\frac{3\\cdot 4-9}{243}=\\frac{1}{81}$.",
      "The $z$ direction is likewise $\\frac{1}{81}$.",
      "Sum: $-\\frac{2}{81}+\\frac{1}{81}+\\frac{1}{81}=0$."
    ],
    "trap": "Confusing the 2D harmonic function $\\ln r$ with the 3D $\\frac{1}{r}$, or computing the second partial in only one direction and stopping.",
    "check": "General formula: $\\nabla^2 f(r)=f''+\\frac{2}{r}f'$; for $f=\\frac{1}{r}$, $\\frac{2}{r^3}-\\frac{2}{r^3}=0$."
  },
  "vc-nab-003": {
    "spot": "$\\frac{\\langle x,y,z\\rangle}{r}$ is the unit radial field $\\hat{\\mathbf{r}}$; its divergence is $\\frac{2}{r}$ — at $(2,1,2)$, $r=3$.",
    "why": "Differentiate term by term with $\\frac{\\partial}{\\partial x}\\frac{x}{r}=\\frac{r^2-x^2}{r^3}$; the three terms add to $\\frac{3r^2-r^2}{r^3}=\\frac{2}{r}$, faster than expanding the whole expression.",
    "steps": [
      "$\\frac{\\partial}{\\partial x}\\frac{x}{r}=\\frac{r^2-x^2}{r^3}$; at $(2,1,2)$: $\\frac{9-4}{27}=\\frac{5}{27}$.",
      "The $y$ term: $\\frac{9-1}{27}=\\frac{8}{27}$.",
      "The $z$ term: $\\frac{9-4}{27}=\\frac{5}{27}$.",
      "Total $\\frac{18}{27}=\\frac{2}{3}$, which is $\\frac{2}{r}$."
    ],
    "trap": "Thinking that since a unit vector field has fixed length its divergence is $0$ — the directions spread out, and the divergence is $\\frac{2}{r}$.",
    "check": "Formula $\\nabla\\cdot(f(r)\\,\\mathbf{r})=3f+rf'$; $f=\\frac{1}{r}$ gives $\\frac{3}{r}-\\frac{1}{r}=\\frac{2}{r}$, and $r=3$ gives $\\frac{2}{3}$."
  },
  "vc-nab-005": {
    "spot": "$\\nabla\\cdot(\\nabla\\times\\mathbf{F})$ — the divergence of a curl is identically $0$ for any field with continuous second partials; you don't even need to look at $\\mathbf{F}$.",
    "why": "This follows directly from mixed partials commuting; to verify, compute the curl, and the six terms of the divergence cancel in pairs.",
    "steps": [
      "First component of the curl: $R_y-Q_z=2x^2y-1$.",
      "Second component: $P_z-R_x=xy-2xy^2$.",
      "Third component: $Q_x-P_y=1-xz$.",
      "Divergence: $4xy+(x-4xy)+(-x)=0$."
    ],
    "trap": "Getting the sign of a curl component backwards (e.g. writing the second component as $R_x-P_z$), so the divergence doesn't cancel to $0$.",
    "check": "The structural reason: the divergence contains $R_{yx}-R_{xy}$, $Q_{zx}-Q_{xz}$, $P_{zy}-P_{yz}$; mixed partials commute, so each pair is $0$."
  },
  "vc-nab-012": {
    "spot": "$\\mathbf{F}=\\langle -y^2,x^2,0\\rangle$ has no $z$ component and doesn't involve $z$ — the curl has only the $z$ component $Q_x-P_y$, so you compute just one number.",
    "why": "The curl of a planar field has only the vertical component; no need to expand the full 3-by-3 determinant.",
    "steps": [
      "The $x$ and $y$ components are $R_y-Q_z$ and $P_z-R_x$: with $R=0$ and $P,Q$ free of $z$, both are $0$; the $z$ component $Q_x-P_y$: $Q_x=2x$, $P_y=-2y$.",
      "$\\nabla\\times\\mathbf{F}=\\langle 0,0,2x+2y\\rangle$.",
      "At $(1,2,0)$: $2+4=6$, magnitude $6$."
    ],
    "trap": "Computing $P_y$ as $2y$ (dropping the minus sign), getting $2x-2y=-2$, magnitude $2$.",
    "check": "The curl has only one component, so its magnitude is the absolute value of that component; $2x+2y$ is positive throughout the first quadrant, so taking the absolute value doesn't flip the sign."
  },
  "vc-rec-002": {
    "spot": "The keywords are \"plane\" + \"closed curve\" + \"convert to a double integral\" — when these three appear together it's Green's Theorem: $\\oint_C P\\,dx+Q\\,dy=\\iint_D(Q_x-P_y)\\,dA$.",
    "why": "Stokes' Theorem is the version for surfaces in space, and the Divergence Theorem is about flux; turning circulation in the plane into a region integral is exactly Green's Theorem.",
    "steps": [
      "Example: $\\oint(-y\\,dx+x\\,dy)$ around the unit circle, parametrized directly, gives $2\\pi$.",
      "The Green's Theorem integrand is $Q_x-P_y=1-(-1)=2$.",
      "$\\iint 2\\,dA=2\\pi$, the same as the line integral — this is exactly what Green's Theorem does.",
      "Answer: Green's Theorem."
    ],
    "trap": "Answering Stokes' Theorem — it is the 3D generalization of Green's Theorem; the problem is about a plane curve, so the standard answer is Green's Theorem.",
    "check": "Memory aid: Green (circulation in the plane) → Stokes (circulation in space) → Divergence Theorem (flux through a closed surface), from lower to higher dimension."
  },
  "db-lin-008": {
    "spot": "$1.1$ is very close to $1$, and $\\arctan 1=\\frac{\\pi}{4}$ and $\\arctan'(1)=\\frac{1}{2}$ are both easy numbers — use the linear approximation at $a=1$.",
    "why": "For linear approximation, pick a point where the function value and derivative are known exactly and that is close to the target; $x=1$ is perfect.",
    "steps": [
      "$f(1)=\\arctan 1=\\frac{\\pi}{4}$.",
      "$f'(x)=\\frac{1}{1+x^2}$, $f'(1)=\\frac{1}{2}$.",
      "$L(x)=\\frac{\\pi}{4}+\\frac{1}{2}(x-1)$; plug in $x=1.1$: $\\frac{\\pi}{4}+\\frac{1}{2}\\cdot 0.1=\\frac{\\pi}{4}+\\frac{1}{20}\\approx 0.8354$."
    ],
    "trap": "Misremembering $\\arctan'(x)$ as $\\frac{1}{\\sqrt{1-x^2}}$ (that's $\\arcsin$), whose denominator is $0$ at $x=1$.",
    "check": "The true value $\\arctan 1.1\\approx 0.8330$ is slightly below the approximation: $\\arctan$ is concave down at $x=1$, so the tangent line lies above the curve."
  },
  "db-opt-008": {
    "spot": "You want to minimize the distance $\\sqrt{x^2+y^2}$ with $y=\\frac{1}{x}$ — minimize the squared distance $x^2+\\frac{1}{x^2}$ instead; without the root it's easier to differentiate.",
    "why": "The square root is increasing, so distance and squared distance are minimized at the same point; dropping the root makes the derivative much cleaner.",
    "steps": [
      "Squared distance $D(x)=x^2+\\frac{1}{x^2}$, $D'(x)=2x-\\frac{2}{x^3}$.",
      "$D'=0\\Rightarrow x^4=1\\Rightarrow x=1$ ($x>0$).",
      "$D''(1)=2+6=8>0$, so it is a minimum.",
      "Shortest distance $\\sqrt{D(1)}=\\sqrt{2}$."
    ],
    "trap": "Getting $D(1)=2$ and stopping — that's the squared distance; you still need the square root.",
    "check": "AM-GM: $x^2+\\frac{1}{x^2}\\ge 2$, with equality at $x=1$; any other point, such as $(2,\\frac{1}{2})$, has distance $\\sqrt{4.25}$, indeed larger."
  },
  "dd-nest-003": {
    "spot": "Three square roots nested one inside the next — peel them with the Chain Rule from the outside in; each layer $\\sqrt{u}$ contributes a factor $\\frac{1}{2\\sqrt{u}}$.",
    "why": "Going layer by layer with the Chain Rule is the hardest way to miss something; each of the three layers contributes a $\\frac{1}{2}$, so the overall coefficient is $\\frac{1}{8}$.",
    "steps": [
      "Outermost layer: $\\frac{d}{dx}\\sqrt{1+v}=\\frac{v'}{2\\sqrt{1+v}}$, where $v=\\sqrt{1+\\sqrt{x}}$.",
      "Middle layer: $v'=\\frac{1}{2\\sqrt{1+\\sqrt{x}}}\\cdot(\\sqrt{x})'$.",
      "Innermost layer: $(\\sqrt{x})'=\\frac{1}{2\\sqrt{x}}$.",
      "Multiply the three factors: $\\frac{1}{8\\sqrt{x}\\sqrt{1+\\sqrt{x}}\\sqrt{1+\\sqrt{1+\\sqrt{x}}}}$."
    ],
    "trap": "Peeling only the outer layer and stopping, writing $\\frac{1}{2\\sqrt{1+\\sqrt{1+\\sqrt{x}}}}$ — the derivatives of the two inner layers must be multiplied in too.",
    "check": "Plug in $x=1$: $\\frac{1}{8\\cdot 1\\cdot\\sqrt{2}\\cdot\\sqrt{1+\\sqrt{2}}}\\approx 0.0569$."
  },
  "dm-int-005": {
    "spot": "$\\ln(1+e^{-x})$ is $\\ln(1+w)$ with $w=e^{-x}$, and $0<w\\le 1$ — expand as a power series and integrate term by term; each term gives $\\int_0^\\infty e^{-nx}dx=\\frac{1}{n}$.",
    "why": "The integrand has no elementary antiderivative; after expanding, every term is an exponential, and term-by-term integration turns the problem into the known series $\\sum\\frac{(-1)^{n+1}}{n^2}$.",
    "steps": [
      "$\\ln(1+e^{-x})=\\sum_{n\\ge 1}\\frac{(-1)^{n+1}}{n}e^{-nx}$ (for $x>0$, $e^{-x}<1$).",
      "Integrate term by term: $\\int_0^{\\infty}e^{-nx}\\,dx=\\frac{1}{n}$; e.g. $n=3$ gives $\\frac{1}{3}$.",
      "So the integral $=\\sum_{n\\ge 1}\\frac{(-1)^{n+1}}{n^2}$.",
      "The alternating version of $\\zeta(2)$: $\\sum\\frac{(-1)^{n+1}}{n^2}=\\left(1-\\frac{2}{2^2}\\right)\\frac{\\pi^2}{6}=\\frac{\\pi^2}{12}$."
    ],
    "trap": "Treating the alternating series as $\\sum\\frac{1}{n^2}=\\frac{\\pi^2}{6}$ — with alternating signs the value is only half.",
    "check": "Numerically $\\frac{\\pi^2}{12}\\approx 0.822$, between $0$ and $\\int_0^{\\infty}e^{-x}dx=1$ (since $\\ln(1+w)<w$)."
  },
  "dx-bio-001": {
    "spot": "\"When is the concentration highest\" — differentiate $C(t)$ and set $C'(t)=0$; it's a difference of two exponentials, which rearranges to $e^{0.6t}=4$, then take logs.",
    "why": "Both terms are of the form $e^{-kt}$; after setting the derivative to $0$, move them to opposite sides and divide, combining the exponents into one and solving for $t$ in a single step.",
    "steps": [
      "$C'(t)=8\\left(-0.2e^{-0.2t}+0.8e^{-0.8t}\\right)$.",
      "$C'=0\\Rightarrow 0.2e^{-0.2t}=0.8e^{-0.8t}\\Rightarrow e^{0.6t}=4$.",
      "$t=\\frac{\\ln 4}{0.6}\\approx 2.31$ hours; here $C''<0$, so it is indeed a maximum.",
      "Answer: $t=\\frac{\\ln 4}{0.6}$."
    ],
    "trap": "After reaching $e^{0.6t}=4$, writing $t=\\frac{4}{0.6}$ (forgetting the log), or dropping the $-0.2$ when differentiating $e^{-0.2t}$.",
    "check": "Take one time on each side: the concentrations at $t=2$ and $t=2.6$ are both lower than at $t\\approx 2.31$."
  },
  "dx-bio-002": {
    "spot": "$P=\\frac{9}{1+8e^{-0.4t}}$ is logistic growth; the fastest growth ($P'$ largest) is at the inflection point $P''=0$, and for a logistic curve the inflection point is at $P=\\frac{K}{2}$.",
    "why": "Remember \"growth is fastest at half the carrying capacity\", and you only need to solve $8e^{-0.4t}=1$; computing $P''$ by brute force is long.",
    "steps": [
      "Logistic: $P'=rP\\left(1-\\frac{P}{K}\\right)$ with $r=0.4$, $K=9$; this is quadratic in $P$, maximized at $P=\\frac{K}{2}=4.5$.",
      "$P=4.5\\iff 1+8e^{-0.4t}=2\\iff e^{0.4t}=8$.",
      "$t=\\frac{\\ln 8}{0.4}\\approx 5.20$ years, where $P''=0$ (inflection point).",
      "Answer: $t=\\frac{\\ln 8}{0.4}$."
    ],
    "trap": "Solving $P'=0$ — a logistic curve keeps growing and $P'$ is always greater than $0$; what you want is the maximum of $P'$, i.e. $P''=0$.",
    "check": "Compare growth rates before and after: at $t=4$ and $t=6.5$, $P'$ is smaller than at $t\\approx 5.2$."
  },
  "dx-eco-004": {
    "spot": "Profit $=$ revenue $-$ cost, which works out to a downward-opening quadratic — set the derivative to $0$ (marginal revenue $=$ marginal cost).",
    "why": "A quadratic has only one critical point and it must be the maximum; setting $P'=0$ gets there in one step.",
    "steps": [
      "$P(x)=x(90-0.5x)-(20x+300)=70x-0.5x^2-300$.",
      "$P'(x)=70-x$.",
      "$P'=0\\Rightarrow x=70$; $P''=-1<0$, so it is a maximum.",
      "Quantity $x=70$."
    ],
    "trap": "Maximizing only the revenue $R(x)$: setting $R'=90-x=0$ gives $x=90$ — forgetting to subtract cost.",
    "check": "Marginal revenue $R'(70)=90-70=20$, exactly equal to marginal cost $C'=20$."
  },
  "dx-eng-002": {
    "spot": "A rectangle inscribed in a circle of diameter $30$: the diagonal is the diameter, $w^2+h^2=900$ — substitute $h^2=900-w^2$ into the strength $wh^2$ to get a one-variable optimization.",
    "why": "The strength contains exactly $h^2$, which can be replaced directly by $900-w^2$, so no square root ever appears.",
    "steps": [
      "Strength $S=wh^2=w(900-w^2)=900w-w^3$.",
      "$S'(w)=900-3w^2$.",
      "$S'=0\\Rightarrow w^2=300\\Rightarrow w=10\\sqrt{3}\\approx 17.3$; $S''=-6w<0$, so it is a maximum.",
      "The strongest beam has width $10\\sqrt{3}$ cm."
    ],
    "trap": "Using the radius $15$ as the diagonal, writing $w^2+h^2=225$, and getting $w=5\\sqrt{3}$.",
    "check": "Here the height is $h=\\sqrt{600}$, so the height-to-width ratio is $\\sqrt{2}$ — the well-known optimal ratio in woodworking."
  },
  "fd-limx-608": {
    "spot": "Top and bottom are both $\\ln(\\cos kx)$, and both are $\\ln 1=0$ as $x\\to 0$ — use $\\cos u\\approx 1-\\frac{u^2}{2}$ and $\\ln(1+w)\\approx w$ to get $\\ln\\cos kx\\approx-\\frac{k^2x^2}{2}$.",
    "why": "After swapping in equivalent infinitesimals the ratio is just $\\frac{k^2}{m^2}$; L'Hôpital's Rule means differentiating $\\ln\\cos$ and then still handling $\\frac{\\tan}{\\tan}$.",
    "steps": [
      "$\\ln\\cos 2x\\approx-\\frac{(2x)^2}{2}=-2x^2$.",
      "$\\ln\\cos 3x\\approx-\\frac{(3x)^2}{2}=-\\frac{9}{2}x^2$.",
      "Ratio $\\frac{-2x^2}{-\\frac{9}{2}x^2}=\\frac{4}{9}$.",
      "The limit is $\\frac{4}{9}$."
    ],
    "trap": "Thinking the ratio is $\\frac{2}{3}$ (looking only at the first power of the angle) — $\\ln\\cos kx$ is proportional to $k^2$.",
    "check": "One round of L'Hôpital's Rule: $\\frac{-2\\tan 2x}{-3\\tan 3x}\\to\\frac{2\\cdot 2}{3\\cdot 3}=\\frac{4}{9}$."
  },
  "gp-005": {
    "spot": "\"Total distance\" — integrate $|v|$; the velocity changes from positive to negative at $t=2$ and only returns to $0$ at $t=6$, so the area below the axis is taken as positive.",
    "why": "The broken-line graph splits into three triangles; adding the absolute values of their areas is fastest.",
    "steps": [
      "$[0,2]$: $v=4-2t$, triangle above the axis with area $\\frac{1}{2}\\cdot 2\\cdot 4=4$.",
      "$[2,5]$: $v=-\\frac{2}{3}(t-2)$, triangle below the axis, signed area $-3$.",
      "$[5,6]$: $v=2(t-6)$, from $-2$ back to $0$, signed area $-1$.",
      "Distance $=4+3+1=8$."
    ],
    "trap": "Adding the signed areas directly to get $4-3-1=0$ — that's the displacement (it ends up back at the start), not the distance.",
    "check": "Displacement $0$ means it ends where it started: forward $4$, back $4$, total distance $8$ is reasonable."
  },
  "gx-044": {
    "spot": "The astroid $x=\\cos^3t$, $y=\\sin^3t$: $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$; numerator and denominator share $3\\sin t\\cos t$, which cancels, leaving $-\\tan t$.",
    "why": "Dividing the parametric derivatives and cancelling gives the very simple $-\\tan t$; eliminating $t$ gives $x^{2/3}+y^{2/3}=1$ and then implicit differentiation, a detour.",
    "steps": [
      "$\\frac{dx}{dt}=-3\\cos^2t\\sin t$.",
      "$\\frac{dy}{dt}=3\\sin^2t\\cos t$.",
      "Divide and cancel $3\\sin t\\cos t$: $\\frac{dy}{dx}=-\\frac{\\sin t}{\\cos t}=-\\tan t$.",
      "Plug in $t=\\frac{\\pi}{6}$: $-\\tan\\frac{\\pi}{6}=-\\frac{1}{\\sqrt{3}}$."
    ],
    "trap": "Differentiating $\\cos^3t$ but dropping the inner $-\\sin t$, writing $3\\cos^2t$, and ending with a wrong form like $-\\tan^2 t$.",
    "check": "Implicit differentiation of $x^{2/3}+y^{2/3}=1$: $\\frac{dy}{dx}=-\\left(\\frac{y}{x}\\right)^{1/3}=-\\frac{\\sin t}{\\cos t}$, the same result."
  },
  "lm-rc-006": {
    "spot": "$a_{n+1}=\\frac{1}{2}\\left(a_n+\\frac{3}{a_n}\\right)$ \"averages $a$ and $\\frac{3}{a}$\" — the Babylonian square-root method (Newton's method for $x^2=3$); the limit satisfies $L=\\frac{1}{2}(L+\\frac{3}{L})$.",
    "why": "AM-GM guarantees that from the second term on every term is $\\ge\\sqrt{3}$ and the sequence decreases, so it converges; the fixed-point equation gives $L^2=3$ directly.",
    "steps": [
      "$a_2=\\frac{1}{2}(1+3)=2$; from then on AM-GM gives $a_{n+1}\\ge\\sqrt{a_n\\cdot\\frac{3}{a_n}}=\\sqrt{3}$.",
      "When $a_n\\ge\\sqrt{3}$, $\\frac{3}{a_n}\\le a_n$, so $a_{n+1}\\le a_n$: decreasing and bounded below, hence convergent.",
      "Take limits: $L=\\frac{1}{2}(L+\\frac{3}{L})\\Rightarrow L=\\frac{3}{L}\\Rightarrow L^2=3$.",
      "All terms are positive, so $L=\\sqrt{3}$."
    ],
    "trap": "Writing $L=\\pm\\sqrt{3}$ from $L^2=3$ without choosing — starting from a positive number, every term is positive.",
    "check": "$a_4=\\frac{97}{56}\\approx 1.73214$, off from $\\sqrt{3}\\approx 1.73205$ by only $10^{-4}$; Newton's method converges very fast."
  },
  "lm-st-006": {
    "spot": "$\\frac{1}{n}\\sum_{k=1}^n k^{1/k}$ is the average of the first $n$ terms of the sequence $k^{1/k}$ — a Cesàro mean: the sequence converges to $1$, so the average also converges to $1$.",
    "why": "No need to compute the sum; once you know $k^{1/k}\\to 1$, the average tends to the same limit.",
    "steps": [
      "$k^{1/k}=e^{(\\ln k)/k}$, and $\\frac{\\ln k}{k}\\to 0$; e.g. at $k=10^6$ it is only $1.4\\times 10^{-5}$.",
      "So $k^{1/k}\\to e^0=1$.",
      "Every term lies between $1$ and $e^{1/e}\\approx 1.445$, and the contribution of finitely many early terms, divided by $n$, tends to $0$.",
      "Cesàro means preserve the limit, so the answer is $1$."
    ],
    "trap": "Thinking the larger early terms (like $3^{1/3}\\approx 1.44$) push the average above $1$ — finitely many terms get diluted away by $\\frac{1}{n}$.",
    "check": "The lower bound is clear: every term $k^{1/k}\\ge 1$, so the average is $\\ge 1$; the limit can't be less than $1$."
  },
  "lx-hard-002": {
    "spot": "A difference of roots of different orders over $x^2$: the linear terms cancel (both sides start $1+x$) — expand binomially through $x^2$ and look at the difference of the quadratic terms.",
    "why": "Rationalizing a mix of cube and square roots is painful, and L'Hôpital's Rule needs two rounds; the binomial expansion shows the coefficients at a glance.",
    "steps": [
      "$(1+3x)^{1/3}=1+\\frac{1}{3}(3x)+\\frac{\\frac{1}{3}(-\\frac{2}{3})}{2}(3x)^2+\\cdots=1+x-x^2+\\cdots$.",
      "$(1+2x)^{1/2}=1+\\frac{1}{2}(2x)+\\frac{\\frac{1}{2}(-\\frac{1}{2})}{2}(2x)^2+\\cdots=1+x-\\frac{x^2}{2}+\\cdots$.",
      "Subtract: the linear terms cancel, leaving $-x^2+\\frac{x^2}{2}=-\\frac{x^2}{2}$.",
      "Divide by $x^2$: the limit is $-\\frac{1}{2}$."
    ],
    "trap": "Expanding only to the linear term, seeing $(1+x)-(1+x)=0$, and saying the limit is $0$ — the denominator is $x^2$, so expand through the quadratic term.",
    "check": "Plug in $x=0.001$: the numerator is about $-5.0\\times 10^{-7}$, and dividing by $10^{-6}$ gives about $-0.5$."
  },
  "lx-hard-005": {
    "spot": "The base $\\frac{2x+5}{2x-1}\\to 1$ and the exponent $3x\\to\\infty$ — a $1^\\infty$ form: write it as $\\left(1+\\frac{6}{2x-1}\\right)^{3x}$, and the limit is $e^{\\lim 3x\\cdot\\frac{6}{2x-1}}$.",
    "why": "Standard $1^\\infty$ formula: $\\lim(1+a)^b=e^{\\lim ab}$ (with $a\\to 0$); computing the limit of $ab$ is faster than taking logs and using L'Hôpital's Rule.",
    "steps": [
      "$\\frac{2x+5}{2x-1}=1+\\frac{6}{2x-1}$.",
      "Exponent times the deviation: $3x\\cdot\\frac{6}{2x-1}=\\frac{18x}{2x-1}\\to 9$.",
      "Confirm with logs: $3x\\ln\\frac{2x+5}{2x-1}\\to 9$.",
      "The limit $=e^9$."
    ],
    "trap": "Seeing the base $\\to 1$ and saying $1^{\\infty}=1$ — how fast the base approaches $1$ is in a tug-of-war with how fast the exponent grows, and you have to compute it.",
    "check": "Plug in $x=10^4$: $\\left(\\frac{20005}{19999}\\right)^{30000}\\approx e^{8.999}$, very close to $e^9\\approx 8103$."
  },
  "lx-seq-004": {
    "spot": "$a_{n+1}=\\frac{1}{2}\\left(a_n+\\frac{5}{a_n}\\right)$ averages $a$ and $\\frac{5}{a}$ — the Babylonian square-root method; the limit satisfies $L=\\frac{5}{L}$.",
    "why": "AM-GM gives the lower bound $\\sqrt{5}$ and the sequence keeps decreasing, so it converges; the fixed-point equation gives $L^2=5$ in one step.",
    "steps": [
      "$a_2=\\frac{1}{2}(3+\\frac{5}{3})=\\frac{7}{3}$; AM-GM gives $a_{n+1}\\ge\\sqrt{5}$.",
      "When $a_n\\ge\\sqrt{5}$, $\\frac{5}{a_n}\\le a_n$, so $a_{n+1}\\le a_n$: decreasing and bounded below, hence convergent.",
      "Take limits: $L=\\frac{1}{2}(L+\\frac{5}{L})\\Rightarrow L^2=5$.",
      "All terms are positive, so $L=\\sqrt{5}\\approx 2.236$."
    ],
    "trap": "Taking limits as $L=\\frac{1}{2}L+\\frac{5}{2}$ (treating $\\frac{5}{a_n}$ as $5$), getting $L=5$.",
    "check": "$a_3=\\frac{47}{21}\\approx 2.2381$, off from $\\sqrt{5}\\approx 2.2361$ by only $0.002$."
  },
  "vc-flux-001": {
    "spot": "$\\oint\\mathbf{F}\\cdot\\mathbf{n}\\,ds$ is the flux out of a closed curve — the flux form of Green's Theorem: $\\iint\\nabla\\cdot\\mathbf{F}\\,dA$, and $\\nabla\\cdot\\langle x,y\\rangle=2$ is constant.",
    "why": "The divergence is constant, so the double integral is $2\\times$ the area; you can also see directly that $\\mathbf{F}\\cdot\\mathbf{n}=1$ on the unit circle.",
    "steps": [
      "$\\nabla\\cdot\\mathbf{F}=\\frac{\\partial x}{\\partial x}+\\frac{\\partial y}{\\partial y}=2$.",
      "The unit disk has area $\\pi$.",
      "Flux $=\\iint 2\\,dA=2\\pi$."
    ],
    "trap": "Using the circulation form $Q_x-P_y=0-0=0$ and getting $0$ — that's circulation along the tangent; the question asks for flux along the normal.",
    "check": "Directly: on the unit circle the outward normal is $\\mathbf{n}=\\langle\\cos t,\\sin t\\rangle$, $\\mathbf{F}\\cdot\\mathbf{n}=\\cos^2t+\\sin^2t=1$, times the circumference $2\\pi$."
  },
  "vc-green-003": {
    "spot": "A closed line integral around a square's boundary would need four separate pieces — use Green's Theorem instead: $Q_x-P_y=2x-2y$, which cancels exactly when integrated over a square symmetric about $x=y$.",
    "why": "One double integral replaces four line integrals, and symmetry shows the answer is $0$ at a glance.",
    "steps": [
      "$Q=x^2$: $Q_x=2x$; $P=y^2$: $P_y=2y$.",
      "$\\iint_{[0,1]^2}2x\\,dA=1$, $\\iint 2y\\,dA=1$.",
      "Subtract to get $0$."
    ],
    "trap": "Thinking \"the integrand isn't $0$, so the integral can't be $0$\" — $2x-2y$ is positive on half the square and negative on the other half, and they cancel by symmetry.",
    "check": "Walk the four sides directly: bottom $y=0$ gives $0$, right side $x=1$ gives $\\int_0^1 1\\,dy=1$, top $y=1$ traversed right to left gives $-1$, left side $x=0$ gives $0$; total $0$."
  },
  "vc-green-004": {
    "spot": "The boundary of the square $[0,1]^2$, counterclockwise — Green's Theorem turns four line integrals into one double integral, with $Q_x-P_y=2x-x=x$.",
    "why": "The integrand is just $x$, and integrating it over the unit square gives the average value of $x$, $\\frac{1}{2}$.",
    "steps": [
      "$Q=x^2$: $Q_x=2x$; $P=xy$: $P_y=x$.",
      "$Q_x-P_y=x$.",
      "$\\iint_{[0,1]^2}x\\,dA=\\int_0^1\\int_0^1 x\\,dx\\,dy=\\frac{1}{2}$."
    ],
    "trap": "Writing the integrand backwards as $P_y-Q_x=-x$ and getting $-\\frac{1}{2}$ — counterclockwise goes with $Q_x-P_y$.",
    "check": "Walk the four sides directly: bottom $y=0$ gives $0$, right side $x=1$ gives $\\int_0^1 1\\,dy=1$, top $y=1$ traversed right to left gives $-\\int_0^1 x\\,dx=-\\frac{1}{2}$, left side gives $0$; total $\\frac{1}{2}$."
  },
  "vc-green-005": {
    "spot": "Circulation around the unit circle, with $Q_x-P_y=3x^2+3y^2=3r^2$ depending only on the radius — after Green's Theorem, use polar coordinates.",
    "why": "The integrand is a multiple of $r^2$ and the region is a disk, so the polar integral is one line; parametrizing directly means integrating $\\sin^4+\\cos^4$.",
    "steps": [
      "$Q=x^3$: $Q_x=3x^2$; $P=-y^3$: $P_y=-3y^2$.",
      "$Q_x-P_y=3(x^2+y^2)=3r^2$.",
      "Polar coordinates: $\\int_0^{2\\pi}\\int_0^1 3r^2\\cdot r\\,dr\\,d\\theta=2\\pi\\cdot\\frac{3}{4}=\\frac{3\\pi}{2}$."
    ],
    "trap": "Forgetting the $r$ in the polar area element, computing $\\int 3r^2\\,dr$ and getting $2\\pi\\cdot 1=2\\pi$.",
    "check": "Parametrize directly: the integrand becomes $\\sin^4t+\\cos^4t$, and integrating once around also gives $\\frac{3\\pi}{2}$."
  },
  "vc-green-008": {
    "spot": "$P=xy^2$, $Q=x^2y+x$: in $Q_x-P_y$ the $2xy$ terms cancel exactly, leaving $1$ — after Green's Theorem the answer is just the area of the circle.",
    "why": "The curl is the constant $1$, so the double integral equals the area $9\\pi$; parametrizing directly means dealing with a pile of trig powers.",
    "steps": [
      "$Q_x=2xy+1$.",
      "$P_y=2xy$.",
      "$Q_x-P_y=1$, so $\\oint=$ the area of the disk of radius $3$, which is $9\\pi$."
    ],
    "trap": "Taking the radius to be $9$ (from seeing $x^2+y^2=9$), and computing the area as $81\\pi$.",
    "check": "Parametrizing directly with $x=3\\cos t$, $y=3\\sin t$ and integrating once around also gives $9\\pi$."
  },
  "vc-stokes-001": {
    "spot": "A closed curve in space (the unit circle in the plane $z=0$) — Stokes' Theorem: convert to the flux of the curl through the disk; $\\nabla\\times\\mathbf{F}=\\langle 0,0,2\\rangle$ is constant.",
    "why": "The curl is constant and the disk's normal is $\\mathbf{k}$, so the flux $=2\\times$ the area; even easier than parametrizing.",
    "steps": [
      "The $z$ component of the curl: $Q_x-P_y=1-(-1)=2$.",
      "The $x$ and $y$ components: $R=z$ doesn't involve $x,y$, and $P,Q$ don't involve $z$, so both are $0$.",
      "The disk's normal is $\\mathbf{k}$ (counterclockwise goes with upward), so the flux $=2\\times\\pi$."
    ],
    "trap": "Thinking the $z$ component also contributes — in the plane $z=0$, $dz=0$, and its curl is $0$ anyway.",
    "check": "Parametrize directly: $-y\\,dx+x\\,dy$ on the unit circle becomes $\\sin^2t+\\cos^2t=1$, and integrating once around gives $2\\pi$."
  },
  "vc-stokes-006": {
    "spot": "Circulation around a horizontal circle ($z=3$, radius $2$) — Stokes' Theorem, with constant curl $\\langle 0,0,-2\\rangle$; the curl of the $z^2$ term is $0$, so it doesn't matter at all.",
    "why": "Constant curl times the disk's area is the answer; note that $\\langle y,-x\\rangle$ is a clockwise-rotating field, so the result is negative.",
    "steps": [
      "The $z$ component of the curl: $Q_x-P_y=-1-1=-2$.",
      "$R=z^2$ involves only $z$, so its partials with respect to $x,y$ are both $0$.",
      "Counterclockwise as seen from above goes with normal $\\mathbf{k}$; the disk has area $4\\pi$.",
      "Circulation $=-2\\cdot 4\\pi=-8\\pi$."
    ],
    "trap": "Seeing \"counterclockwise\" and assuming the answer is positive, or computing $Q_x-P_y$ as $-1+1=0$.",
    "check": "Parametrize directly with $x=2\\cos t$, $y=2\\sin t$, $z=3$: $\\mathbf{F}\\cdot\\mathbf{r}'=-4\\sin^2t-4\\cos^2t=-4$, and integrating once around gives $-8\\pi$."
  },
  "vc-surf-003": {
    "spot": "The surface is written as $z=f(x,y)$, so the area element is $dS=\\sqrt{1+f_x^2+f_y^2}\\,dA=\\sqrt{1+4r^2}\\,dA$; the projection is the unit disk — polar coordinates, where $r\\,dr$ pairs perfectly with $1+4r^2$ for a substitution.",
    "why": "$\\sqrt{1+4x^2+4y^2}$ is hard to integrate in Cartesian coordinates; the extra $r$ from polar coordinates lets $u=1+4r^2$ finish it in one substitution.",
    "steps": [
      "$f_x=2x$, $f_y=2y$, $\\sqrt{1+4x^2+4y^2}=\\sqrt{1+4r^2}$.",
      "$z\\le 1$ corresponds to $r\\le 1$; area $=\\int_0^{2\\pi}\\int_0^1\\sqrt{1+4r^2}\\,r\\,dr\\,d\\theta$.",
      "Let $u=1+4r^2$: $\\int\\sqrt{1+4r^2}\\,r\\,dr=\\frac{(1+4r^2)^{3/2}}{12}$.",
      "Multiply by $2\\pi$: $\\frac{2\\pi(5\\sqrt{5}-1)}{12}=\\frac{\\pi(5\\sqrt{5}-1)}{6}$."
    ],
    "trap": "Dropping the $r$ in polar coordinates and integrating $\\int_0^1\\sqrt{1+4r^2}\\,dr$ — both harder and wrong.",
    "check": "The area is $\\approx 5.33$, larger than the disk below it, $\\pi\\approx 3.14$ (the surface is tilted), which is reasonable."
  },
  "dm-int-008": {
    "spot": "The integrand $\\frac{x-1}{\\ln x}$ has no elementary antiderivative, but the problem tells you it equals $\\int_0^1 x^s\\,ds$ — make it a double integral and switch the order to integrate in $x$ first.",
    "why": "Integrating $x^s$ in $x$ is just the power rule, $\\frac{1}{s+1}$, and the remaining integral is $\\ln 2$; attacking it head-on goes nowhere.",
    "steps": [
      "$\\int_0^1 x^t\\,dt=\\frac{x-1}{\\ln x}$ (using $t$ as the parameter here).",
      "The integral $=\\int_0^1\\int_0^1 x^t\\,dt\\,dx$; the integrand is nonnegative, so the order can be switched. Integrate in $x$ first: $\\int_0^1 x^t\\,dx=\\frac{1}{t+1}$.",
      "$\\int_0^1\\frac{dt}{t+1}=\\ln 2$.",
      "Answer: $\\ln 2$."
    ],
    "trap": "After switching the order, integrating $x^t$ to $\\frac{x^{t+1}}{t+1}$ but forgetting to apply the limits, or writing $\\int\\frac{dt}{t+1}$ as $\\ln 1=0$.",
    "check": "On $[0,1]$ the integrand rises from $0$ to $1$, and the average value $\\ln 2\\approx 0.693$ sits a bit above the middle, which is reasonable."
  },
  "lx-seq-005": {
    "spot": "$x_{n+1}=\\sin x_n$ slowly tends to $0$, and the question is about $nx_n^2$ — look at how much $\\frac{1}{x_n^2}$ grows each step: $\\frac{1}{\\sin^2x}-\\frac{1}{x^2}\\to\\frac{1}{3}$, then apply the Stolz–Cesàro theorem.",
    "why": "Finding $x_n$ directly is impossible; computing the per-step increment of the reciprocal square lets you say $\\frac{1}{x_n^2}\\approx\\frac{n}{3}$.",
    "steps": [
      "$0<\\sin x<x$ (for $x>0$), so $x_n$ is decreasing and bounded below by $0$; the limit $L$ satisfies $L=\\sin L$, so it must be $0$.",
      "Increment $\\frac{1}{x_{n+1}^2}-\\frac{1}{x_n^2}=\\frac{1}{\\sin^2x_n}-\\frac{1}{x_n^2}$; $\\sin^2x=x^2-\\frac{x^4}{3}+\\cdots$, so the increment $\\to\\frac{1}{3}$.",
      "Stolz–Cesàro: $\\frac{1/x_n^2}{n}\\to\\frac{1}{3}$, i.e. $nx_n^2\\to 3$."
    ],
    "trap": "Seeing $x_n\\to 0$, calling $nx_n^2$ an $\\infty\\cdot 0$ form, and guessing $0$ or $1$ — you need the decay rate of $x_n$, which is $\\sqrt{3/n}$.",
    "check": "Confirm by expanding: $\\frac{1}{\\sin^2x}-\\frac{1}{x^2}=\\frac{x^2-\\sin^2x}{x^2\\sin^2x}\\approx\\frac{x^4/3}{x^4}$."
  },
  "int-045": {
    "spot": "The integrand has $\\ln x$ and also $\\frac{1}{x}$ — $\\frac{dx}{x}$ is exactly $d(\\ln x)$, so let $u=\\ln x$ to get $\\int u^2\\,du$.",
    "why": "\"A function times its derivative\" is the signal for substitution; integration by parts would only be a detour here.",
    "steps": [
      "Let $u=\\ln x$, $du=\\frac{dx}{x}$.",
      "$\\int\\frac{(\\ln x)^2}{x}\\,dx=\\int u^2\\,du=\\frac{u^3}{3}+C$.",
      "Back to $x$: $\\frac{(\\ln x)^3}{3}+C$."
    ],
    "trap": "Thinking $\\int(\\ln x)^2\\,dx$ needs integration by parts and treating $\\frac{1}{x}$ as a separate factor, which only gets more complicated.",
    "check": "Definite integral: $\\int_1^e\\frac{(\\ln x)^2}{x}\\,dx=\\frac{1^3}{3}-0=\\frac{1}{3}$."
  },
  "exam-int-011": {
    "spot": "The numerator $x$ is, up to a constant, the derivative $-2x$ of $4-x^2$ under the root — let $u=4-x^2$.",
    "why": "The numerator is exactly the inner derivative, so substitution finishes in one step; the trigonometric substitution $x=2\\sin\\theta$ also works but takes a detour.",
    "steps": [
      "Let $u=4-x^2$, $du=-2x\\,dx$, so $x\\,dx=-\\frac{1}{2}du$.",
      "$\\int\\frac{x\\,dx}{\\sqrt{4-x^2}}=-\\frac{1}{2}\\int u^{-1/2}\\,du=-u^{1/2}+C$.",
      "Back to $x$: $-\\sqrt{4-x^2}+C$ (check the derivative on $-2<x<2$)."
    ],
    "trap": "Dropping the minus sign of $-\\frac{1}{2}$ and answering $+\\sqrt{4-x^2}$; differentiating back is off by a sign.",
    "check": "Definite integral: $\\int_0^1\\frac{x\\,dx}{\\sqrt{4-x^2}}=-\\sqrt{3}-(-2)=2-\\sqrt{3}$."
  },
  "exam-int-017": {
    "spot": "The numerator $2x+3$ is exactly the derivative of the denominator $x^2+3x+5$ — $\\int\\frac{f'}{f}\\,dx=\\ln|f|$.",
    "why": "The numerator is the denominator's derivative, so the log comes out in one step; no need to complete the square or use partial fractions.",
    "steps": [
      "$(x^2+3x+5)'=2x+3$, exactly the numerator.",
      "The discriminant $9-20<0$, so the denominator is always positive and the absolute value can be dropped.",
      "$\\int\\frac{2x+3}{x^2+3x+5}\\,dx=\\ln(x^2+3x+5)+C$."
    ],
    "trap": "Seeing a quadratic denominator and completing the square for an arctangent, taking a long detour.",
    "check": "Definite integral: $\\int_0^1\\frac{2x+3}{x^2+3x+5}\\,dx=\\ln 9-\\ln 5=\\ln\\frac{9}{5}$."
  },
  "exam-int-019": {
    "spot": "The denominator has $\\sqrt{x}$ and also $1+x=1+(\\sqrt{x})^2$ — let $u=\\sqrt{x}$, so $\\frac{dx}{\\sqrt{x}}=2\\,du$, and what's left, $\\frac{1}{1+u^2}$, is an arctangent.",
    "why": "$\\frac{dx}{\\sqrt{x}}$ is exactly $2\\,d(\\sqrt{x})$, so one substitution removes the root.",
    "steps": [
      "Let $u=\\sqrt{x}$, $du=\\frac{dx}{2\\sqrt{x}}$, so $\\frac{dx}{\\sqrt{x}}=2\\,du$.",
      "$\\int\\frac{dx}{\\sqrt{x}(1+x)}=\\int\\frac{2\\,du}{1+u^2}=2\\arctan u+C$.",
      "Back-substitute: $2\\arctan\\sqrt{x}+C$."
    ],
    "trap": "Forgetting the coefficient $2$ from $dx=2u\\,du$ and answering $\\arctan\\sqrt{x}$.",
    "check": "Definite integral: $\\int_1^3\\frac{dx}{\\sqrt{x}(1+x)}=2\\left(\\frac{\\pi}{3}-\\frac{\\pi}{4}\\right)=\\frac{\\pi}{6}$."
  }
};
