// Detail v2, English — batch 032. Translation of tools/content/detail/032.js (text only; claims live in the Chinese file).
module.exports = {
  "cl-lim-034": {
    "spot": "A recursion $a_{n+1}=g(a_n)$ and the problem only asks for the limit: if the limit $L$ exists, take limits on both sides to get $L=g(L)$, and solve for the fixed point first.",
    "why": "The fixed-point equation gives the candidates in one line; then compare $a_{n+1}-3$ with $a_n-3$ to confirm the sequence really converges there.",
    "steps": [
      "Let the limit be $L$: $L=\\frac{4L+3}{L+2}$, which rearranges to $L^2-2L-3=(L-3)(L+1)=0$.",
      "$a_1=1>0$, and plugging a positive number into $\\frac{4a+3}{a+2}$ gives a positive number, so every term is positive and $L=-1$ is impossible.",
      "Convergence: $a_{n+1}-3=\\frac{a_n-3}{a_n+2}$. Since $a_n>0$, the distance to $3$ shrinks to less than half at every step.",
      "So $a_n\\to 3$."
    ],
    "trap": "Keeping $-1$ as an answer after solving the quadratic, or picking one root without checking signs. Every term is positive, so the limit cannot be negative.",
    "check": "Compute the first few terms: $a_2=\\frac{7}{3}\\approx 2.33$, $a_3=\\frac{37}{13}\\approx 2.85$, heading toward $3$."
  },
  "cl-lim-044": {
    "spot": "Under the root is a sum of exponential terms, and $5^n$ grows fastest — factor out $5^n$, and what remains has $n\\left(\\frac{4}{5}\\right)^n\\to 0$.",
    "why": "Under an $n$-th root, \"the largest base wins\". After factoring out the dominant term you are left with $(1+\\text{small})^{1/n}\\to 1$, no logarithms needed.",
    "steps": [
      "Factor out $5^n$: $\\sqrt[n]{5^n+n4^n}=5\\left(1+n\\left(\\frac{4}{5}\\right)^n\\right)^{1/n}$.",
      "Exponential decay beats linear growth: $n\\left(\\frac{4}{5}\\right)^n\\to 0$.",
      "The bracket tends to $1$, and its $n$-th root still tends to $1$, so the limit is $5$."
    ],
    "trap": "Seeing the extra $n$ in $n\\cdot 4^n$ and thinking it beats $5^n$. The $n$ is only a polynomial factor; it cannot stop the exponential decay of $\\left(\\frac{4}{5}\\right)^n$.",
    "check": "Squeeze: $5^n\\le 5^n+n4^n\\le (n+1)5^n$. Taking $n$-th roots gives $5\\le a_n\\le 5\\sqrt[n]{n+1}$, and the right side also tends to $5$."
  },
  "cl-ser-044": {
    "spot": "$x^2$ is even and $\\cos 3x$ is even, so the product is even — fold the integral to $\\frac{2}{\\pi}\\int_0^{\\pi}$, then integrate by parts twice on $x^2$.",
    "why": "Polynomial times trig means integration by parts. Folding the even function makes the lower limit $0$, which halves the evaluation work.",
    "steps": [
      "Even function: $a_3=\\frac{2}{\\pi}\\int_0^{\\pi}x^2\\cos 3x\\,dx$.",
      "Integrate by parts twice; the antiderivative is $\\frac{x^2\\sin 3x}{3}+\\frac{2x\\cos 3x}{9}-\\frac{2\\sin 3x}{27}$.",
      "Evaluate: every $\\sin$ term is $0$ at both $0$ and $\\pi$, leaving only $\\frac{2\\pi\\cos 3\\pi}{9}=-\\frac{2\\pi}{9}$.",
      "$a_3=\\frac{2}{\\pi}\\cdot\\left(-\\frac{2\\pi}{9}\\right)=-\\frac{4}{9}$."
    ],
    "trap": "Taking $\\cos 3\\pi$ as $1$ at the upper limit and getting $+\\frac{4}{9}$. In fact $\\cos 3\\pi=-1$; the coefficient signs alternate as $(-1)^n$.",
    "check": "General formula $a_n=\\frac{4(-1)^n}{n^2}$: $n=3$ gives $-\\frac{4}{9}$, and $n=1$ gives $-4$."
  },
  "cx-app-007": {
    "spot": "With a wall, you only fence three sides: the two sides perpendicular to the wall are $x$ each, and the side parallel to it is $40-2x$ — the area is a quadratic in $x$.",
    "why": "Writing the area in one variable and optimizing is the safest route. Using \"a square maximizes area\" fails here because there are only three sides.",
    "steps": [
      "Area $A(x)=x(40-2x)=40x-2x^2$, with $0<x<20$.",
      "$A'(x)=40-4x=0$ gives $x=10$.",
      "$A''=-4<0$, so it is a maximum.",
      "Maximum area $A(10)=10\\cdot 20=200$ square meters."
    ],
    "trap": "Using the four-sided \"square is best\" rule: a square with side $\\frac{40}{3}$ only has area $\\frac{1600}{9}\\approx 178$. Against a wall, the best shape has the long side twice the short side.",
    "check": "Compare another point: at $x=9$, $9\\cdot 22=198$, which is less than $200$."
  },
  "cx-app-008": {
    "spot": "The product of $x$ and $\\frac{4}{x}$ is the constant $4$ — AM-GM gives the lower bound $2\\sqrt 4$ directly; or differentiate and find the critical point.",
    "why": "When the product is fixed, the sum is smallest when the two terms are equal, and $x=\\frac{4}{x}$ gives $x=2$ in one line.",
    "steps": [
      "$f'(x)=1-\\frac{4}{x^2}=0$; with $x>0$ this gives $x=2$.",
      "$f''(x)=\\frac{8}{x^3}>0$, so it is a local min.",
      "Minimum value $f(2)=2+2=4$."
    ],
    "trap": "Handing in $x=2$ as the answer. The problem asks for the minimum value $f(2)=4$, not where it occurs.",
    "check": "AM-GM: $x+\\frac{4}{x}\\ge 2\\sqrt{x\\cdot\\frac{4}{x}}=4$. Plugging in $x=1$ gives $5$, which is bigger than $4$."
  },
  "cx-curve-003": {
    "spot": "An inflection point is where the second derivative changes sign. The second derivative of $xe^{-x}$ will be \"a polynomial times $e^{-x}$\", and $e^{-x}$ is always positive, so only the polynomial's root matters.",
    "why": "$e^{-x}$ is never $0$, so the sign is decided entirely by the linear factor in front; its root is the sign change.",
    "steps": [
      "$f'(x)=(1-x)e^{-x}$.",
      "$f''(x)=(x-2)e^{-x}$, which is $0$ at $x=2$.",
      "Confirm the sign change: for $x<2$, $f''<0$ (concave down); for $x>2$, $f''>0$ (concave up).",
      "The inflection point is at $x=2$."
    ],
    "trap": "Taking $x=1$, where $f'=0$, as the inflection point. That is the max; inflection points come from $f''$.",
    "check": "The $y$-value at the inflection point, $f(2)=2e^{-2}\\approx 0.27$, sits to the right of the max $f(1)=e^{-1}\\approx 0.37$, on the descending part."
  },
  "cx-ftc-003": {
    "spot": "The upper limit is $x$ and the integrand has no $x$ — the Fundamental Theorem of Calculus gives $F'(x)=e^{x^2}$ directly. No need (and no way) to integrate first.",
    "why": "$e^{t^2}$ has no elementary antiderivative, so any \"integrate, then differentiate\" route is dead. The Fundamental Theorem does it in one step.",
    "steps": [
      "Fundamental Theorem: $F'(x)=e^{x^2}$.",
      "The upper limit is just $x$ (not a function like $x^2$), so there is no inner derivative to multiply.",
      "Plug in $x=1$: $F'(1)=e^{1}=e$."
    ],
    "trap": "Trying to find an antiderivative of $e^{t^2}$, or writing $e^{x^2}-e^0$. The theorem just plugs the upper limit into the integrand; there is no term subtracted for the lower limit.",
    "check": "Difference quotient: $\\frac{F(1.001)-F(1)}{0.001}=\\frac{1}{0.001}\\int_1^{1.001}e^{t^2}dt$ should be very close to $e\\approx 2.718$."
  },
  "cx-mvt-001": {
    "spot": "The MVT point $c$ satisfies $f'(c)=\\frac{f(b)-f(a)}{b-a}$: compute the secant slope, then solve $f'(c)$ equals it.",
    "why": "$f'(x)=2x$ is linear, so solving takes one step.",
    "steps": [
      "Secant slope: $\\frac{f(2)-f(0)}{2-0}=\\frac{4}{2}=2$.",
      "$f'(c)=2c=2$ gives $c=1$, which lies in $(0,2)$.",
      "So $c=1$."
    ],
    "trap": "Giving the secant slope $2$ as the answer. The problem asks for the location $c$ where the tangent slope equals it.",
    "check": "For a parabola, the MVT point is exactly the midpoint: $\\frac{0+2}{2}=1$."
  },
  "cx-ode-003": {
    "spot": "The right side of $y'=y^2$ involves only $y$ — separable: $\\frac{dy}{y^2}=dx$.",
    "why": "After separating, just integrate each side. It is not linear, so an integrating factor does not apply.",
    "steps": [
      "Separate and integrate: $\\int y^{-2}dy=\\int dx$ gives $-\\frac{1}{y}=x+C$.",
      "Use $y(0)=1$: $-1=C$.",
      "$-\\frac{1}{y}=x-1$, so $y=\\frac{1}{1-x}$.",
      "Answer: $y=\\frac{1}{1-x}$ (the solution lives only on $x<1$)."
    ],
    "trap": "Writing $\\int y^{-2}dy$ as $\\frac{1}{y}$ and losing the minus sign, which gives $y=\\frac{1}{x+1}$. Differentiating that back gives $-y^2$, off by a sign from the equation.",
    "check": "At $x=0.5$: $y=2$, and $y'=\\frac{1}{(1-0.5)^2}=4=y^2$."
  },
  "cx-seq-003": {
    "spot": "Both the base and the exponent depend on $n$: $n^{1/n}=e^{\\frac{\\ln n}{n}}$, so the question becomes the limit of $\\frac{\\ln n}{n}$.",
    "why": "Taking logs brings the exponent down, leaving \"log versus linear\", and you know at a glance which grows faster.",
    "steps": [
      "Rewrite: $n^{1/n}=e^{\\frac{\\ln n}{n}}$.",
      "$\\ln n$ grows more slowly than $n$: $\\frac{\\ln n}{n}\\to 0$ (for example at $n=10^6$ it is only about $1.4\\times 10^{-5}$).",
      "The exponential is continuous, so $a_n\\to e^0=1$."
    ],
    "trap": "Thinking \"huge $n$, $n$-th root\" sends $n^{1/n}\\to\\infty$ or $0$. It actually rises to $3^{1/3}\\approx 1.44$ and then slowly comes back down to $1$.",
    "check": "$n=1000$: $1000^{1/1000}\\approx 1.0069$, already very close to $1$."
  },
  "cx-ser-003": {
    "spot": "Consecutive terms have a fixed ratio $\\frac{2}{3}$: a geometric series, convergent since $|r|<1$. Note it starts at $n=1$, so the first term is $\\frac{2}{3}$, not $1$.",
    "why": "A geometric series has the closed form $\\frac{\\text{first term}}{1-r}$, no partial sums needed.",
    "steps": [
      "First term $a=\\frac{2}{3}$, ratio $r=\\frac{2}{3}$.",
      "Sum $=\\frac{a}{1-r}=\\frac{2/3}{1/3}=2$.",
      "Answer: $2$."
    ],
    "trap": "Using $\\frac{1}{1-r}=3$ directly: that is the sum starting from $n=0$, which counts the extra $0$-th term $1$.",
    "check": "The sum from $n=0$ is $3$; subtract the $0$-th term $1$ and you get exactly $2$."
  },
  "db-chain-001": {
    "spot": "Inside the $\\sin$ is not plain $x$ but $3x^2$ — a composite function, so after differentiating the outside you multiply by the inner derivative.",
    "why": "Chain Rule: outer $\\sin u\\to\\cos u$, then multiply by $u'=6x$.",
    "steps": [
      "Outer: $\\frac{d}{du}\\sin u=\\cos u$, with $u=3x^2$.",
      "Inner: $\\frac{d}{dx}3x^2=6x$.",
      "Multiply: $6x\\cos(3x^2)$."
    ],
    "trap": "Writing only the outer part $\\cos(3x^2)$ and forgetting to multiply by the inner derivative $6x$.",
    "check": "At $x=0$ the slope should be $0$ ($3x^2$ is flat at the origin)."
  },
  "dd-inv-007": {
    "spot": "The hyperbolic function has $\\ln x$ inside: $\\sinh u=\\frac{e^u-e^{-u}}{2}$ and $e^{\\ln x}=x$ — simplify to $\\frac{x-\\frac{1}{x}}{2}$ first, then differentiate.",
    "why": "After simplifying it is a rational expression, which is quicker to differentiate than going through the Chain Rule $\\cosh(\\ln x)\\cdot\\frac{1}{x}$ and simplifying; the result is the same.",
    "steps": [
      "$\\sinh(\\ln x)=\\frac{e^{\\ln x}-e^{-\\ln x}}{2}=\\frac{1}{2}\\left(x-\\frac{1}{x}\\right)$.",
      "Differentiate: $\\frac{1}{2}\\left(1+\\frac{1}{x^2}\\right)$.",
      "Answer: $\\frac{1}{2}\\left(1+\\frac{1}{x^2}\\right)$."
    ],
    "trap": "Using the Chain Rule but writing only $\\cosh(\\ln x)$, forgetting the inner factor $\\frac{1}{x}$.",
    "check": "Chain Rule comparison: $\\cosh(\\ln x)\\cdot\\frac{1}{x}=\\frac{x+1/x}{2x}$, the same as the answer."
  },
  "dd-kin-001": {
    "spot": "Velocity from a position function: velocity is $s'(t)$. Differentiate the polynomial term by term, then plug in $t=3$.",
    "why": "Velocity is by definition the derivative of position; there is no other shortcut.",
    "steps": [
      "$v(t)=s'(t)=3t^2-18t+24$.",
      "Plug in $t=3$: $27-54+24=-3$.",
      "Velocity $-3$ (the minus sign means it is moving backward)."
    ],
    "trap": "Giving the position $s(3)=18$ as the velocity, or giving the speed $3$ and dropping the minus sign.",
    "check": "$v=3(t-2)(t-4)$, and $t=3$ lies between the two roots, so the velocity is indeed negative."
  },
  "dd-mar-001": {
    "spot": "\"Marginal cost\" means $C'(q)$: differentiate the cubic term by term, then plug in $q=50$.",
    "why": "Marginal quantity = derivative. $C(51)-C(50)$ also estimates it, but only approximately.",
    "steps": [
      "$C'(q)=0.03q^2-1.2q+13$.",
      "Plug in $q=50$: $75-60+13=28$.",
      "Marginal cost: $28$."
    ],
    "trap": "Carrying the fixed cost $100$ into the derivative, or computing the average cost $\\frac{C(50)}{50}$ instead.",
    "check": "Difference estimate: $C(51)-C(50)\\approx 28.9$, close to the derivative $28$ (the extra comes from the second-order curvature term)."
  },
  "fd-serx-203": {
    "spot": "The coefficient is $\\frac{1}{2^n}$, so the whole series is $\\sum\\left(\\frac{x}{2}\\right)^n$ — a geometric series with ratio $\\frac{x}{2}$.",
    "why": "A geometric series converges exactly when $|r|<1$, which reads off $|x|<2$ directly. The Ratio Test works too, but this is faster.",
    "steps": [
      "Rewrite: $\\frac{x^n}{2^n}=\\left(\\frac{x}{2}\\right)^n$.",
      "Converges $\\iff\\left|\\frac{x}{2}\\right|<1\\iff|x|<2$; at $x=2$ every term is $1$, so it diverges.",
      "Ratio Test comparison: $\\frac{a_n}{a_{n+1}}=\\frac{2^{n+1}}{2^n}=2$, so the radius of convergence is $2$."
    ],
    "trap": "Taking the $\\frac{1}{2}$ in the coefficient as the radius and answering $\\frac{1}{2}$. The radius comes from the reciprocal direction of the coefficient ratio; $\\frac{1}{2^n}$ gives $2$.",
    "check": "At $x=1$ (inside the radius) the sum is $\\frac{1/2}{1-1/2}=1$, finite."
  },
  "fd-serx-207": {
    "spot": "The numerator is a sum of two exponentials and the denominator is $6^n$ — split into two geometric series: $\\left(\\frac{1}{3}\\right)^n+\\left(\\frac{1}{2}\\right)^n$.",
    "why": "After splitting, apply $\\frac{a}{1-r}$ to each. Both converge, so you may add them separately.",
    "steps": [
      "Split: $\\frac{2^n+3^n}{6^n}=\\left(\\frac{1}{3}\\right)^n+\\left(\\frac{1}{2}\\right)^n$.",
      "$\\sum_{n\\ge 1}\\left(\\frac{1}{3}\\right)^n=\\frac{1/3}{2/3}=\\frac{1}{2}$.",
      "$\\sum_{n\\ge 1}\\left(\\frac{1}{2}\\right)^n=1$.",
      "Total: $\\frac{1}{2}+1=\\frac{3}{2}$."
    ],
    "trap": "Using the $n=0$ formula $\\frac{1}{1-r}$ and getting $\\frac{3}{2}+2=\\frac{7}{2}$, which counts two extra first terms of $1$.",
    "check": "First two terms: $\\frac{5}{6}+\\frac{13}{36}\\approx 1.19$, heading toward $1.5$ without passing it."
  },
  "gx-011": {
    "spot": "The polyline is straight on each piece, and $x=1$ sits in the middle of the first piece from $(0,1)$ to $(2,3)$ — the derivative is that piece's slope.",
    "why": "A line's derivative equals its slope everywhere; just make sure the point is not at the corner ($x=2$).",
    "steps": [
      "$x=1$ is inside $[0,2]$, not a corner, so the derivative exists.",
      "Slope of the first piece: $\\frac{3-1}{2-0}=1$.",
      "So $f'(1)=1$."
    ],
    "trap": "Reading off the function value $f(1)=2$. The problem asks for the slope, not the height.",
    "check": "The first piece is the line $y=x+1$, whose derivative is $1$."
  },
  "gx-012": {
    "spot": "$x=3$ sits in the middle of the second piece from $(2,3)$ to $(4,1)$ — the derivative is that piece's slope, and it goes down, so it is negative.",
    "why": "A line segment's derivative is its slope; $x=3$ is not at the corner $x=2$, so you can read it directly.",
    "steps": [
      "$x=3$ is inside $[2,4]$, so the derivative exists.",
      "Slope of the second piece: $\\frac{1-3}{4-2}=-1$.",
      "So $f'(3)=-1$."
    ],
    "trap": "Mixing up the order in the slope fraction (writing $\\frac{3-1}{4-2}$) and losing the minus sign.",
    "check": "The second piece is the line $y=-x+5$, through $(2,3)$ and $(4,1)$; its derivative is $-1$."
  },
  "int-008": {
    "spot": "$3x^2$ is exactly the derivative of $x^3$ — the antiderivative is visible at a glance; just evaluate at the limits.",
    "why": "The Power Rule in reverse, and the Fundamental Theorem of Calculus finishes in one step.",
    "steps": [
      "Antiderivative: $x^3$.",
      "Evaluate: $1^3-0^3=1$.",
      "Answer: $1$."
    ],
    "trap": "Writing the antiderivative as $x^3+C$ and leaving $C$ in the answer. In a definite integral the $C$ cancels.",
    "check": "On $[0,1]$, $3x^2$ is between $0$ and $3$, so an average of $1$ is reasonable (the endpoint average is $1.5$, and a convex function comes out lower)."
  },
  "lec-02-q4b": {
    "spot": "\"At rest\" means velocity $v(t)=s'(t)=0$, not position $s(t)=0$. $s'$ is a quadratic; just factor it.",
    "why": "The times when velocity is zero are the roots of the derivative. Setting position to zero finds when it is at the origin, which is a different question.",
    "steps": [
      "$v(t)=3t^2-12t+9$.",
      "Factor: $3(t^2-4t+3)=3(t-1)(t-3)$.",
      "Roots $t=1$ and $t=3$, both satisfying $t\\ge 0$.",
      "Answer: it is at rest at $t=1$ s and $t=3$ s, the set $\\{1,3\\}$."
    ],
    "trap": "Solving $s(t)=0$ to get $t=0,3$: those are the times the particle is at the origin, not when it is at rest.",
    "check": "Between $t=1$ and $t=3$ the velocity is negative (moving backward), and it turns around once at each end, consistent with being at rest there."
  },
  "lec-11-q1c": {
    "spot": "As $n\\to\\infty$, $\\frac{1}{n}\\to 0$ — let $x=\\frac{1}{n}$, so $n\\sin\\frac{1}{n}=\\frac{\\sin x}{x}$, the most classic limit of all.",
    "why": "The substitution turns \"$\\infty\\cdot 0$\" into $\\frac{\\sin x}{x}$, and you use $\\lim_{x\\to 0}\\frac{\\sin x}{x}=1$ directly.",
    "steps": [
      "Let $x=\\frac{1}{n}$: $n\\sin\\frac{1}{n}=\\frac{\\sin x}{x}$.",
      "$\\lim_{x\\to 0^+}\\frac{\\sin x}{x}=1$.",
      "So the limit is $1$."
    ],
    "trap": "Thinking \"$\\sin\\frac{1}{n}\\to 0$, so the whole thing is $0$\" — it is an $\\infty\\cdot 0$ indeterminate form; you cannot look at just one factor.",
    "check": "$n=10$: $10\\sin 0.1\\approx 0.9983$, already very close to $1$."
  },
  "lm-sq-008": {
    "spot": "The numerator $\\cos x$ keeps oscillating in $[-1,1]$ while the denominator $\\ln x\\to\\infty$ — \"bounded over infinity\", so use the Squeeze Theorem.",
    "why": "The oscillating numerator has no limit, and L'Hôpital's Rule makes it worse with $-x\\sin x$. The Squeeze Theorem only needs an upper bound.",
    "steps": [
      "For $x>1$, $\\left|\\frac{\\cos x}{\\ln x}\\right|\\le\\frac{1}{\\ln x}$.",
      "$\\frac{1}{\\ln x}\\to 0$, just very slowly: at $x=10^{10}$ it is about $0.043$.",
      "Squeeze: $-\\frac{1}{\\ln x}\\le\\frac{\\cos x}{\\ln x}\\le\\frac{1}{\\ln x}$, both sides tend to $0$, so the limit is $0$."
    ],
    "trap": "Using L'Hôpital's Rule, getting $\\lim(-x\\sin x)$, which does not exist, and concluding the original limit does not exist. When the L'Hôpital limit fails to exist, you can conclude nothing.",
    "check": "At $x=10^{6}$: $\\left|\\frac{\\cos x}{\\ln x}\\right|\\le\\frac{1}{13.8}\\approx 0.072$, indeed shrinking."
  },
  "mob-trap-001": {
    "spot": "Inside the $\\sin$ is $3x$, not $x$ — a composite function, so after the outer derivative you must multiply by the inner derivative $3$.",
    "why": "Chain Rule: $\\frac{d}{dx}\\sin(u)=\\cos u\\cdot u'$. Writing $\\cos 3x$ out of habit is exactly forgetting $u'$.",
    "steps": [
      "The outer $\\sin u$ becomes $\\cos u$, and the inner $u=3x$ has derivative $3$.",
      "Correct answer: $3\\cos 3x$.",
      "Writing just $\\cos 3x$ is off by a factor of three.",
      "Answer: the main trap is forgetting the Chain Rule's inner factor $3$."
    ],
    "trap": "Writing $\\cos 3x$: at $x=0$ it gives slope $1$, but the actual slope is $3$.",
    "check": "Numerical slope: near the origin $\\sin 3x$ looks like $3x$, slope $3$."
  },
  "refine-integrals-040": {
    "spot": "The integrand is a product of two kinds of functions: the polynomial $x$ and the inverse trig $\\arctan x$ — and $\\arctan x$ differentiates to the rational function $\\frac{1}{1+x^2}$.",
    "why": "Choose $u=\\arctan x$ so it differentiates away, and $dv=x\\,dx$ integrates to $\\frac{x^2}{2}$, leaving a rational integral. Substitution has no inner derivative to work with.",
    "steps": [
      "Let $u=\\arctan x$, $dv=x\\,dx$: $du=\\frac{dx}{1+x^2}$, $v=\\frac{x^2}{2}$.",
      "What remains is $\\int\\frac{x^2}{2(1+x^2)}dx=\\frac{1}{2}\\int\\left(1-\\frac{1}{1+x^2}\\right)dx$.",
      "Putting it together: $\\frac{x^2+1}{2}\\arctan x-\\frac{x}{2}+C$.",
      "Answer: integration by parts (with $u=\\arctan x$)."
    ],
    "trap": "Choosing it the other way, $u=x$ and $dv=\\arctan x\\,dx$: you would first need to integrate $\\arctan x$, which is more roundabout.",
    "check": "Definite integral check: $\\int_0^1x\\arctan x\\,dx=\\frac{\\pi}{4}-\\frac{1}{2}\\approx 0.285$."
  },
  "tb-tan-003": {
    "spot": "Tangent slope = $f'(0)$; $xe^x$ is a product, so use the Product Rule.",
    "why": "The Product Rule in one line: $(xe^x)'=e^x+xe^x$, and at $0$ the second term vanishes.",
    "steps": [
      "$f'(x)=e^x+xe^x=(1+x)e^x$.",
      "Plug in $x=0$: $(1+0)e^0=1$.",
      "Slope $1$."
    ],
    "trap": "Differentiating only one factor and writing $xe^x$, which gives slope $0$ at $0$.",
    "check": "Near the origin $xe^x\\approx x+x^2$, whose leading slope is $1$."
  },
  "td-der-003": {
    "spot": "$x$ times $\\ln(1+x)$ — Product Rule, and the second factor also needs the Chain Rule (the inner $1+x$ has derivative $1$).",
    "why": "Both factors contain $x$, so it has to be the Product Rule: derivative of the first times the second, plus the first times the derivative of the second.",
    "steps": [
      "$(x)'=1$, $\\left(\\ln(1+x)\\right)'=\\frac{1}{1+x}$.",
      "Product Rule: $1\\cdot\\ln(1+x)+x\\cdot\\frac{1}{1+x}$.",
      "Answer: $\\ln(1+x)+\\frac{x}{1+x}$."
    ],
    "trap": "Multiplying the two factors' derivatives and getting $\\frac{1}{1+x}$.",
    "check": "At $x=0$: $\\ln 1+0=0$. Near the origin the function looks like $x^2$, so the slope really is $0$."
  },
  "td-der-004": {
    "spot": "Inside the $\\ln$ is $5+3\\cos x$ — the Chain Rule for logs: $\\frac{u'}{u}$.",
    "why": "$(\\ln u)'=\\frac{u'}{u}$ does it in one step; the numerator is the inner derivative $-3\\sin x$.",
    "steps": [
      "Inner $u=5+3\\cos x$, $u'=-3\\sin x$.",
      "$\\frac{u'}{u}=\\frac{-3\\sin x}{5+3\\cos x}$.",
      "Answer: $-\\frac{3\\sin x}{5+3\\cos x}$."
    ],
    "trap": "Forgetting the minus sign in the derivative of $\\cos x$ and writing $\\frac{3\\sin x}{5+3\\cos x}$.",
    "check": "At $x=0$ the function reaches its max $\\ln 8$, so the derivative should be $0$."
  },
  "world-001": {
    "spot": "Top and bottom are both $\\sin(\\text{multiple}\\cdot x)$ with $x\\to 0$: for small angles $\\sin kx\\approx kx$, so the ratio is the ratio of the coefficients.",
    "why": "Rewrite as $\\frac{\\sin 5x}{5x}\\cdot\\frac{3x}{\\sin 3x}\\cdot\\frac{5}{3}$; each of the two ratios tends to $1$. No need for L'Hôpital's Rule.",
    "steps": [
      "$\\frac{\\sin 5x}{5x}\\to 1$.",
      "$\\frac{3x}{\\sin 3x}\\to 1$.",
      "What remains is the coefficient ratio $\\frac{5}{3}$."
    ],
    "trap": "Cancelling the $\\sin$ to get $\\frac{5x}{3x}$ is the right idea, but writing $\\frac{\\sin 5}{\\sin 3}$ or $\\frac{3}{5}$ is wrong.",
    "check": "$x=0.01$: $\\frac{\\sin 0.05}{\\sin 0.03}\\approx 1.6664$, close to $\\frac{5}{3}$."
  },
  "ap-eco-003": {
    "spot": "What must be minimized is the \"average cost\" $\\frac{C(x)}{x}=\\frac{100}{x}+4+x$, not $C(x)$ itself — divide by $x$ first, then differentiate.",
    "why": "$\\frac{100}{x}$ and $x$ have a fixed product, so differentiating gives $x^2=100$ at once. Differentiating $C$ directly finds no minimum.",
    "steps": [
      "Average cost $\\bar C(x)=\\frac{100}{x}+4+x$.",
      "$\\bar C'(x)=-\\frac{100}{x^2}+1=0$ gives $x=10$.",
      "$\\bar C''=\\frac{200}{x^3}>0$, so it is a minimum.",
      "The average cost is smallest at $x=10$ (where the average cost is $24$)."
    ],
    "trap": "Differentiating the total cost, $C'(x)=4+2x=0$, which gives a negative $x$. The problem wants the average cost.",
    "check": "Marginal cost equals average cost: $C'(10)=24=\\bar C(10)$."
  },
  "ap-kin-001": {
    "spot": "Velocity is $s'(t)$; $s'$ is a quadratic, so factor it and take the smaller root.",
    "why": "Velocity zero = derivative zero. The problem asks for the \"earliest\" time, so take the smaller of the two roots.",
    "steps": [
      "$v(t)=3t^2-12t+9=3(t-1)(t-3)$.",
      "Roots $t=1$ and $t=3$; the earliest is $t=1$.",
      "Answer: $t=1$ s."
    ],
    "trap": "Solving $s(t)=0$ to get $t=0$: that is when it is at the origin, and the velocity there is actually $9$.",
    "check": "At $t=0.5$ the velocity is positive, at $t=1.5$ it is negative, so $t=1$ is exactly where it turns around."
  },
  "ap-kin-006": {
    "spot": "Given velocity, asked for distance — integrate the velocity; the upper limit is the moment it stops, $v=0$.",
    "why": "Displacement $=\\int v\\,dt$. The velocity stays positive until it stops, so distance equals displacement.",
    "steps": [
      "Stops when $30-6t=0$, at $t=5$ s.",
      "Distance $=\\int_0^5(30-6t)\\,dt=\\left[30t-3t^2\\right]_0^5=150-75$.",
      "It slides $75$ m."
    ],
    "trap": "Using \"velocity times time\", $30\\times 5=150$: the velocity is decreasing, so use the average velocity $15$, or just integrate.",
    "check": "The $v$–$t$ graph is a triangle with area $\\frac{1}{2}\\cdot 5\\cdot 30=75$."
  },
  "ch-inv-003": {
    "spot": "Three layers: $\\ln$ wraps $\\cosh$ wraps $\\sin x$ — multiply derivatives from the outside in; $\\frac{\\sinh}{\\cosh}$ combines into $\\tanh$.",
    "why": "The outer log gives $\\frac{u'}{u}$; the derivative of $u=\\cosh(\\sin x)$ is $\\sinh(\\sin x)\\cos x$, and dividing gives exactly $\\tanh$.",
    "steps": [
      "Outermost: $(\\ln u)'=\\frac{u'}{u}$, with $u=\\cosh(\\sin x)=\\frac{e^{\\sin x}+e^{-\\sin x}}{2}$.",
      "Middle and inner layers: $u'=\\sinh(\\sin x)\\cdot\\cos x$.",
      "Divide: $\\frac{\\sinh(\\sin x)}{\\cosh(\\sin x)}\\cos x=\\cos x\\tanh(\\sin x)$."
    ],
    "trap": "Forgetting the innermost derivative $\\cos x$ of $\\sin x$ and writing only $\\tanh(\\sin x)$.",
    "check": "At $x=0$: $\\tanh 0=0$, so the derivative should be $0$; $\\cosh$ is smallest at $0$, so the function is flat there."
  },
  "ch-inv-012": {
    "spot": "The outer layer is $\\operatorname{arsinh}$, with $\\left(\\operatorname{arsinh}u\\right)'=\\frac{1}{\\sqrt{1+u^2}}$; inside are two more layers $\\sin(x^2)$, so chain the derivatives.",
    "why": "Once you remember the derivative of $\\operatorname{arsinh}$, it is just one Chain Rule. Rewriting as $\\ln(u+\\sqrt{1+u^2})$ and differentiating also works, just longer.",
    "steps": [
      "Outer: $\\frac{d}{du}\\operatorname{arsinh}u=\\frac{1}{\\sqrt{1+u^2}}$ ($\\operatorname{arsinh}u=\\ln(u+\\sqrt{1+u^2})$).",
      "Inner $u=\\sin(x^2)$: $u'=2x\\cos(x^2)$.",
      "Multiply: $\\frac{2x\\cos(x^2)}{\\sqrt{1+\\sin^2(x^2)}}$."
    ],
    "trap": "Confusing it with $\\arcsin$ and writing $\\frac{1}{\\sqrt{1-u^2}}$. The hyperbolic version has a plus sign.",
    "check": "At $x=0$ the derivative is $0$ (the factor $2x$)."
  },
  "ch-mix-005": {
    "spot": "$\\sqrt x$ times $\\arctan(x^2)$: the outside is the Product Rule, and the second factor has $x^2$ inside, needing the Chain Rule.",
    "why": "Sort out the \"product\" first, then the \"composition\": each rule used once, and you are least likely to drop a term.",
    "steps": [
      "$(\\sqrt x)'=\\frac{1}{2\\sqrt x}$.",
      "$\\left(\\arctan(x^2)\\right)'=\\frac{2x}{1+x^4}$.",
      "Product Rule: $\\frac{\\arctan(x^2)}{2\\sqrt x}+\\sqrt x\\cdot\\frac{2x}{1+x^4}=\\frac{\\arctan(x^2)}{2\\sqrt x}+\\frac{2x^{3/2}}{1+x^4}$."
    ],
    "trap": "Writing the derivative of $\\arctan(x^2)$ as $\\frac{1}{1+x^2}$ — the square is in the wrong place and the inner $2x$ is missing.",
    "check": "At $x=1$: $\\frac{\\pi/4}{2}+\\frac{2}{2}=\\frac{\\pi}{8}+1\\approx 1.39$."
  },
  "ch-mix-006": {
    "spot": "$\\ln x$ times $\\sin(\\ln x)$: Product Rule, and the inner $\\ln x$ of the second factor gives a $\\frac{1}{x}$ — both terms carry $\\frac{1}{x}$, so it can be factored out.",
    "why": "One Product Rule and one Chain Rule, then factor out the common $\\frac{1}{x}$ for a clean answer.",
    "steps": [
      "$(\\ln x)'=\\frac{1}{x}$, $\\left(\\sin(\\ln x)\\right)'=\\frac{\\cos(\\ln x)}{x}$.",
      "Product Rule: $\\frac{\\sin(\\ln x)}{x}+\\ln x\\cdot\\frac{\\cos(\\ln x)}{x}$.",
      "Combine: $\\frac{\\sin(\\ln x)+\\ln x\\cos(\\ln x)}{x}$."
    ],
    "trap": "Stopping at $\\cos(\\ln x)$ for the derivative of $\\sin(\\ln x)$ and forgetting the $\\frac{1}{x}$.",
    "check": "At $x=1$: $\\ln 1=0$, so the derivative $=\\sin 0+0=0$."
  },
  "cl-lim-012": {
    "spot": "Pull $\\tan x$ out of the numerator $\\tan x-\\sin x$ to get $\\tan x(1-\\cos x)$, and the denominator contains $1-\\cos 2x$ — replace everything with equivalent infinitesimals of order $x^3$.",
    "why": "Equivalent infinitesimals: $\\tan x\\sim x$, $1-\\cos x\\sim\\frac{x^2}{2}$, $1-\\cos 2x\\sim 2x^2$. L'Hôpital's Rule would take three rounds and is easy to botch.",
    "steps": [
      "Numerator: $\\tan x-\\sin x=\\tan x(1-\\cos x)\\sim x\\cdot\\frac{x^2}{2}=\\frac{x^3}{2}$.",
      "Denominator: $x(1-\\cos 2x)\\sim x\\cdot 2x^2=2x^3$.",
      "Divide: $\\frac{1/2}{2}=\\frac{1}{4}$."
    ],
    "trap": "Replacing both $\\tan x$ and $\\sin x$ by $x$, so the numerator becomes $0$ and the limit looks like $0$. In a difference, first-order replacement cancels the real dominant term.",
    "check": "Plug in $x=0.01$ directly: the ratio is about $0.2500$."
  },
  "cl-lim-015": {
    "spot": "$\\ln\\cos 3x$: $\\cos 3x\\to 1$, so $\\ln(1+(\\cos 3x-1))\\sim\\cos 3x-1\\sim-\\frac{9x^2}{2}$; the denominator $\\sin^2 2x\\sim 4x^2$.",
    "why": "Two layers of equivalent infinitesimals ($\\ln(1+u)\\sim u$, $1-\\cos u\\sim\\frac{u^2}{2}$) applied in a row are cleaner than differentiating $\\ln\\cos$ twice with L'Hôpital's Rule.",
    "steps": [
      "$\\cos 3x-1\\sim-\\frac{9x^2}{2}$.",
      "$\\ln\\cos 3x\\sim\\cos 3x-1\\sim-\\frac{9x^2}{2}$.",
      "$\\sin^2 2x\\sim 4x^2$.",
      "Divide: $\\frac{-9/2}{4}=-\\frac{9}{8}$."
    ],
    "trap": "Writing $1-\\cos 3x$ as $\\frac{3x^2}{2}$ (forgetting to square the $3$), which gives $-\\frac{3}{8}$.",
    "check": "Plug in $x=0.01$: about $-1.125$."
  },
  "cl-lim-023": {
    "spot": "Base $\\to 1$, exponent $\\to\\infty$: a $1^\\infty$ form. Taking logs turns it into the limit of $x\\ln\\frac{x+a}{x-a}$.",
    "why": "The standard move for $1^\\infty$ is $e^{\\lim(\\text{exponent})\\cdot(\\text{base}-1)}$; find the exponent's limit $2a$ and match it to $6$.",
    "steps": [
      "Take the base $-1$:$\\frac{x+a}{x-a}-1=\\frac{2a}{x-a}$.",
      "Multiply by the exponent: $x\\cdot\\frac{2a}{x-a}\\to 2a$, so the limit is $e^{2a}$ (check with $a=3$: $x\\ln\\frac{x+3}{x-3}\\to 6$).",
      "$e^{2a}=e^6$, so $a=3$."
    ],
    "trap": "Treating $\\left(\\frac{x+a}{x-a}\\right)^x$ like $\\left(1+\\frac{a}{x}\\right)^x$, getting $e^a$ and answering $a=6$. The $a$ appears in both numerator and denominator, so it is really $e^{2a}$.",
    "check": "With $a=3$ and $x=1000$ plugged in directly: within a tenth of a percent of $e^6\\approx 403$."
  },
  "cl-lim-024": {
    "spot": "The piecewise function has two seams, $x=1$ and $x=3$, and two unknowns $a,b$ — each seam's left and right limits being equal gives one equation; solve them together.",
    "why": "Continuity just means the two sides match at each seam. Two linear equations; eliminating $b$ is quickest.",
    "steps": [
      "$x=1$: the left side is $1+1=2$, the right side is $a+b$, so $a+b=2$.",
      "$x=3$: the left side is $3a+b$, the right side is $3^2=9$, so $3a+b=9$.",
      "Subtract: $2a=7$, so $a=\\frac{7}{2}$ and $b=-\\frac{3}{2}$.",
      "Answer: $a=\\frac{7}{2}$."
    ],
    "trap": "Handling only one seam, or using $f(3)=3$ at $x=3$ (reading $x^2$ as $x$).",
    "check": "The middle piece $y=\\frac{7}{2}x-\\frac{3}{2}$ is $2$ at $x=1$ and $9$ at $x=3$, so both ends connect."
  },
  "cl-lim-032": {
    "spot": "At $x=1$ the numerator is $\\sin\\pi=0$ and the denominator is $0$: a $\\frac{0}{0}$ form, and the value to fill in is this limit.",
    "why": "One round of L'Hôpital's Rule: numerator derivative $\\pi\\cos\\pi x$, denominator $2x$, plug in $1$. Or set $x=1+h$ and use $\\sin(\\pi+\\pi h)=-\\sin\\pi h$.",
    "steps": [
      "At $x=1$: numerator and denominator are both $0$.",
      "L'Hôpital's Rule: $\\frac{\\pi\\cos\\pi x}{2x}$ at $x=1$ is $\\frac{-\\pi}{2}$.",
      "Define $f(1)=-\\frac{\\pi}{2}$."
    ],
    "trap": "Assuming $\\sin\\pi x\\sim\\pi x$ and getting $\\frac{\\pi}{2}$. That equivalence holds only as $x\\to 0$; as $x\\to 1$, $\\cos\\pi=-1$ brings in a minus sign.",
    "check": "Plug in $x=1.001$: about $-1.570$, consistent with $-\\frac{\\pi}{2}\\approx -1.5708$."
  },
  "cx-app-010": {
    "spot": "Shortest distance from a point to a curve: minimize the squared distance $(x-\\frac{3}{2})^2+(\\sqrt x)^2$; the root disappears and you get a quadratic.",
    "why": "The square root is increasing, so minimizing the squared distance is equivalent, and you avoid differentiating a root.",
    "steps": [
      "Squared distance $d^2=\\left(x-\\frac{3}{2}\\right)^2+x$.",
      "Differentiate: $2\\left(x-\\frac{3}{2}\\right)+1=2x-2=0$, so $x=1$.",
      "The second derivative is $2>0$, so it is a minimum.",
      "The nearest point has $x=1$, i.e. $(1,1)$."
    ],
    "trap": "Thinking the nearest point is directly above, at $x=\\frac{3}{2}$. The connecting segment must be perpendicular to the tangent line, not to the $x$-axis.",
    "check": "At $x=1$, $d^2=\\frac{1}{4}+1=\\frac{5}{4}$, smaller than the value $\\frac{3}{2}$ at $x=\\frac{3}{2}$."
  },
  "cx-lh-009": {
    "spot": "As $x\\to 0$, the first-order terms of the numerator $x\\cos x-\\sin x$ cancel and the denominator is $x^3$ — expand the numerator in a Taylor series up to $x^3$.",
    "why": "One Taylor expansion shows the $x^3$ coefficient. L'Hôpital's Rule works too, but takes three rounds, each with a Product Rule.",
    "steps": [
      "$x\\cos x=x-\\frac{x^3}{2}+\\cdots$.",
      "$\\sin x=x-\\frac{x^3}{6}+\\cdots$.",
      "Subtract: $-\\frac{1}{2}+\\frac{1}{6}=-\\frac{1}{3}$.",
      "The limit is $-\\frac{1}{3}$."
    ],
    "trap": "Expanding only to first order: the numerator becomes $x-x=0$, and you think the limit is $0$.",
    "check": "Plug in $x=0.1$: about $-0.3330$."
  },
  "cx-ser-007": {
    "spot": "The coefficient $n!$ grows faster than any exponential — the ratio $\\frac{(n+1)!}{n!}=n+1\\to\\infty$, which no $x\\ne 0$ can survive.",
    "why": "For factorial coefficients the Ratio Test is the most direct, because the consecutive ratio is just $n+1$.",
    "steps": [
      "Ratio: $\\left|\\frac{(n+1)!\\,x^{n+1}}{n!\\,x^n}\\right|=(n+1)|x|$.",
      "However small $x\\ne 0$ is, for large enough $n$ we get $(n+1)|x|>1$: e.g. with $x=0.01$ and $n=200$ it is already $2.01$, so the terms do not go to $0$.",
      "It converges only at $x=0$; the radius of convergence is $R=\\lim\\frac{1}{n+1}=0$."
    ],
    "trap": "Flipping the coefficient and thinking of $\\frac{x^n}{n!}$ (that is $e^x$, radius $\\infty$), answering $\\infty$.",
    "check": "Compute one term: at $x=0.1$ the $30$th term is $30!\\cdot 0.1^{30}\\approx 265$; the terms are not going to $0$, they are growing."
  },
  "cx-smid-009": {
    "spot": "You want a coefficient of $\\cos(x^2)$: no need to differentiate four times — just replace $u$ with $x^2$ in $\\cos u=1-\\frac{u^2}{2}+\\cdots$.",
    "why": "Substituting into a known series gives the $x^4$ term in one line; differentiating $\\cos(x^2)$ four times is very messy.",
    "steps": [
      "$\\cos u=1-\\frac{u^2}{2}+\\frac{u^4}{24}-\\cdots$.",
      "Substitute $u=x^2$: $\\cos(x^2)=1-\\frac{x^4}{2}+\\frac{x^8}{24}-\\cdots$, so the $x^4$ coefficient is $-\\frac{1}{2}$.",
      "Answer: $-\\frac{1}{2}$."
    ],
    "trap": "Confusing it with the $x^4$ coefficient $\\frac{1}{24}$ of $\\cos x$. After substituting $x^2$, it is the original $u^2$ term that becomes $x^4$.",
    "check": "$x=0.3$: $\\cos 0.09\\approx 1-\\frac{0.0081}{2}$, with error only of order $x^8$."
  },
  "db-def-003": {
    "spot": "$\\frac{f(x)-f(1)}{x-1}$ with $f(1)=1^1=1$ — this is the definition of the derivative of $x^x$ at $x=1$.",
    "why": "Once you recognize the derivative definition, logarithmic differentiation gives $(x^x)'=x^x(\\ln x+1)$, faster than grinding out the limit.",
    "steps": [
      "$f(x)=x^x$, $f(1)=1$, and the limit asked for $=f'(1)$.",
      "Logarithmic differentiation: $(x^x)'=x^x(\\ln x+1)$.",
      "Plug in $1$: $1\\cdot(0+1)=1$."
    ],
    "trap": "Treating it as a power function, $x\\cdot x^{x-1}=x^x$, which also happens to give $1$ at $1$ — the right answer by the wrong method, which breaks at any other point.",
    "check": "Difference quotient at $x=1.001$: about $1.001$."
  },
  "db-itrig-006": {
    "spot": "Inside the $\\tanh$ is $x^2$: $(\\tanh u)'=\\operatorname{sech}^2u=\\frac{1}{\\cosh^2u}$, then multiply by the inner $2x$.",
    "why": "The same shape of formula as for $\\tan$, just with $\\sec$ replaced by $\\operatorname{sech}$; one Chain Rule.",
    "steps": [
      "$\\tanh u=\\frac{e^{2u}-1}{e^{2u}+1}$, with derivative $\\frac{1}{\\cosh^2u}=\\frac{4}{(e^u+e^{-u})^2}$.",
      "Inner: $(x^2)'=2x$.",
      "Multiply: $\\frac{2x}{\\cosh^2(x^2)}$."
    ],
    "trap": "Forgetting the $2x$, or writing $\\operatorname{sech}^2$ as $\\sec^2$.",
    "check": "At $x=0$ the derivative is $0$ (the factor $2x$)."
  },
  "db-lin-002": {
    "spot": "$28$ is very close to the perfect cube $27$ — use the linear approximation $f(a)+f'(a)(x-a)$ at $a=27$.",
    "why": "$\\sqrt[3]{27}=3$ and $f'(27)=\\frac{1}{27}$ are both easy to compute; one step finishes it.",
    "steps": [
      "$f(x)=x^{1/3}$, $f(27)=3$.",
      "$f'(x)=\\frac{1}{3}x^{-2/3}$, $f'(27)=\\frac{1}{3\\cdot 9}=\\frac{1}{27}$.",
      "$\\sqrt[3]{28}\\approx 3+\\frac{1}{27}=\\frac{82}{27}\\approx 3.037$."
    ],
    "trap": "Computing $f'(27)$ as $\\frac{1}{3}\\cdot 27^{-1/3}=\\frac{1}{9}$ and getting $3.11$. The exponent is $-\\frac{2}{3}$.",
    "check": "The true value is $\\sqrt[3]{28}\\approx 3.0366$; the cube root is concave, so the tangent-line estimate is slightly high."
  },
  "db-mot-003": {
    "spot": "Velocity is $s'(t)$, and $e^{-t}\\sin t$ is a product — Product Rule, then plug in $t=\\frac{\\pi}{2}$ ($\\cos=0$, $\\sin=1$).",
    "why": "After the Product Rule, factor out $e^{-t}$; at the special angle only one term survives.",
    "steps": [
      "$s'(t)=-e^{-t}\\sin t+e^{-t}\\cos t=e^{-t}(\\cos t-\\sin t)$.",
      "Plug in $t=\\frac{\\pi}{2}$: $e^{-\\pi/2}(0-1)$.",
      "Velocity $-e^{-\\pi/2}\\approx -0.208$."
    ],
    "trap": "Forgetting the minus sign in the derivative of $e^{-t}$ and getting $+e^{-\\pi/2}$.",
    "check": "A negative velocity makes sense: after $\\frac{\\pi}{2}$, $\\sin t$ starts decreasing and $e^{-t}$ is decaying too, so the position must be going down."
  },
  "db-rr-002": {
    "spot": "Related rates: $A=s^2$; differentiating in time gives $\\frac{dA}{dt}=2s\\frac{ds}{dt}$. Area $100$ tells you $s=10$ at this moment.",
    "why": "Write the relation between the variables first, differentiate with respect to $t$, and only then plug in the current values; plugging in first loses the rate of change.",
    "steps": [
      "When the area is $100$, the side is $s=10$.",
      "$\\frac{dA}{dt}=2s\\cdot\\frac{ds}{dt}$.",
      "Substitute: $2\\cdot 10\\cdot 0.5=10$."
    ],
    "trap": "Plugging in $A=100$ before differentiating and getting $0$; or plugging the area $100$ in as the side length and getting $100$.",
    "check": "Differences: the side goes $10\\to 10.005$ (in $0.01$ s), the area grows by about $0.1$, i.e. $10$ per second."
  },
  "db-rr-010": {
    "spot": "Given the volume, asked for the rate of change of surface area: use $V=27$ to find the current side $s=3$, then differentiate $S=6s^2$.",
    "why": "Surface area depends only on the side, $\\frac{dS}{dt}=12s\\frac{ds}{dt}$; the volume is only there to pin down the current $s$.",
    "steps": [
      "$s^3=27$, so $s=3$.",
      "$S=6s^2$, $\\frac{dS}{dt}=12s\\frac{ds}{dt}$.",
      "Substitute $s=3$, $\\frac{ds}{dt}=1$: $12\\cdot 3=36$."
    ],
    "trap": "Computing the rate of change of volume, $3s^2\\frac{ds}{dt}=27$, which answers the wrong question.",
    "check": "Differences: as $s$ goes from $3$ to $3.001$, $S$ grows by about $0.036$, i.e. about $36$ per second."
  },
  "db-tan-002": {
    "spot": "Tangent line $y=f(1)+f'(1)(x-1)$; the $y$-intercept comes from $x=0$: $f(1)-f'(1)$.",
    "why": "The intercept needs just two numbers, $f(1)$ and $f'(1)$. Here $f'(1)=0$, so the tangent line is horizontal.",
    "steps": [
      "$f(1)=e^{-1}$.",
      "$f'(x)=(1-x)e^{-x}$, $f'(1)=0$.",
      "Horizontal tangent: $y=\\frac{1}{e}$, intercept $\\frac{1}{e}$."
    ],
    "trap": "Giving $f(0)=0$ (the curve's intercept) instead of the tangent line's intercept.",
    "check": "$x=1$ is the max of $xe^{-x}$, so the tangent is horizontal at height $e^{-1}\\approx 0.368$."
  },
  "db-tay-003": {
    "spot": "$\\frac{1}{1-x}=\\sum x^n$, every coefficient is $1$; coefficient $=\\frac{f^{(n)}(0)}{n!}$, so $f^{(7)}(0)=7!$.",
    "why": "Reading the coefficient off a known series and multiplying by $n!$ is far faster than differentiating seven times.",
    "steps": [
      "Geometric series: $\\frac{1}{1-x}=1+x+x^2+\\cdots$ ($|x|<1$), e.g. at $x=0.3$.",
      "Pattern $f^{(n)}(x)=\\frac{n!}{(1-x)^{n+1}}$: the second derivative at $0$ is $2!=2$.",
      "The $x^7$ coefficient is $1=\\frac{f^{(7)}(0)}{7!}$, so $f^{(7)}(0)=7!=5040$."
    ],
    "trap": "Taking the coefficient $1$ itself as $f^{(7)}(0)$ and forgetting to multiply by $7!$.",
    "check": "Compute $7!$ with the $\\Gamma$ integral: $\\int_0^\\infty t^7e^{-t}dt=5040$."
  },
  "db-tay-005": {
    "spot": "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\cdots$; the $x^4$ coefficient $-\\frac{1}{4}$ times $4!$ is $f^{(4)}(0)$.",
    "why": "Reading the series coefficient and multiplying by the factorial is fastest; you can also differentiate four times, with pattern $f^{(n)}=\\frac{(-1)^{n-1}(n-1)!}{(1+x)^n}$.",
    "steps": [
      "$f'=\\frac{1}{1+x}$, $f''=-\\frac{1}{(1+x)^2}$.",
      "$f'''=\\frac{2}{(1+x)^3}$.",
      "$f^{(4)}=-\\frac{6}{(1+x)^4}$.",
      "Plug in $0$: $-6$ (compare with the coefficient: $-\\frac{1}{4}\\cdot 24=-6$)."
    ],
    "trap": "Giving the coefficient $-\\frac{1}{4}$ as the answer, or flipping the sign to get $6$.",
    "check": "The coefficient $-\\frac{1}{4}$ can be seen from the series of $\\ln(1+x)=\\int_0^x\\frac{dt}{1+t}$; at $x=0.1$, truncating at the fourth power is already very accurate."
  },
  "dd-inv-001": {
    "spot": "$\\frac{x}{\\sqrt{1+x^2}}$ is exactly $\\sin(\\arctan x)$ — the whole expression simplifies to $\\arctan x$, no need to force the Chain Rule through $\\arcsin$.",
    "why": "Draw a right triangle: opposite $x$, adjacent $1$, hypotenuse $\\sqrt{1+x^2}$. After simplifying, the derivative takes one line.",
    "steps": [
      "Let $\\theta=\\arctan x$; then $\\sin\\theta=\\frac{x}{\\sqrt{1+x^2}}$.",
      "$\\theta\\in\\left(-\\frac{\\pi}{2},\\frac{\\pi}{2}\\right)$, so $\\arcsin$ gives back $\\theta$: the expression $=\\arctan x$.",
      "Derivative: $\\frac{1}{1+x^2}$."
    ],
    "trap": "Forcing the Chain Rule, making errors in $\\sqrt{1-\\frac{x^2}{1+x^2}}$ and the Quotient Rule, and never simplifying to $\\frac{1}{1+x^2}$.",
    "check": "At $x=0$ the derivative is $1$; at $x=1$ it is $\\frac{1}{2}$."
  },
  "dd-invf-001": {
    "spot": "Derivative of the inverse at $3$: first find which $x$ gives $f(x)=3$ (try small integers: $x=1$), then use $g'(3)=\\frac{1}{f'(1)}$.",
    "why": "You cannot find a formula for the inverse, but the derivative formula only needs the value of $f'$ at the matching point.",
    "steps": [
      "$f(1)=1+1+1=3$, so $g(3)=1$.",
      "$f'(x)=3x^2+1$, $f'(1)=4$.",
      "$g'(3)=\\frac{1}{f'(1)}=\\frac{1}{4}$."
    ],
    "trap": "Using the wrong point: $\\frac{1}{f'(3)}=\\frac{1}{28}$. The point to use is $g(3)=1$.",
    "check": "Differences: $f(1.001)\\approx 3.004$, so as $g$'s input goes from $3$ to $3.004$ its output rises only $0.001$, slope about $\\frac{1}{4}$."
  },
  "dd-invf-002": {
    "spot": "Need $f(x)=1$: the constant term is exactly $1$, so $x=0$; then use $g'(1)=\\frac{1}{f'(0)}$.",
    "why": "You cannot solve for the inverse, but its derivative only needs $f'$ at $x=0$, and at $x=0$ only the linear coefficient survives.",
    "steps": [
      "$f(0)=1$, so $g(1)=0$.",
      "$f'(x)=5x^4+6x^2+7$, $f'(0)=7$.",
      "$g'(1)=\\frac{1}{7}$."
    ],
    "trap": "Plugging in $x=1$: $\\frac{1}{f'(1)}=\\frac{1}{18}$. The point to use is the $x=0$ that satisfies $f(x)=1$.",
    "check": "$f'>0$ everywhere, so $f$ is strictly increasing and the inverse exists and is unique."
  },
  "dd-pw-003": {
    "spot": "\"Differentiable everywhere\" at the junction $x=1$ needs two conditions: the values match (continuity) and the slopes match (left and right derivatives equal). The slope condition gives $a$ directly.",
    "why": "The line's slope is just $a$ and the parabola's slope at $1$ is $2$; compare and you are done. $b$ then comes from continuity.",
    "steps": [
      "Right-side slope: $(x^2)'=2x$, which is $2$ at $1$.",
      "The left-side line has slope $a$; differentiability requires $a=2$.",
      "Continuity: $a+b=1$, so $b=-1$; the tangent line $y=2x-1$ joins the parabola exactly.",
      "Answer: $a=2$."
    ],
    "trap": "Using only the continuity condition $a+b=1$ and thinking it cannot be solved, or taking $f(1)=1$ as $a$.",
    "check": "The left piece $2x-1$ is exactly the tangent line to $x^2$ at $x=1$, so the seam is smooth."
  },
  "fd-serx-303": {
    "spot": "Coefficient $\\frac{1}{n\\,4^n}$: the exponential part $4^n$ sets the radius, and the polynomial factor $n$ has $n$-th root tending to $1$, so it does not matter.",
    "why": "Ratio Test: the ratio of consecutive coefficients $\\frac{(n+1)4^{n+1}}{n\\,4^n}\\to 4$. The $n$ only affects whether the endpoints converge.",
    "steps": [
      "Coefficient ratio: $\\frac{a_n}{a_{n+1}}=\\frac{(n+1)4^{n+1}}{n\\,4^n}=\\frac{4(n+1)}{n}$.",
      "At $x=4$ it is the harmonic series $\\sum\\frac{1}{n}$, which diverges; at $x=-4$ it is the alternating harmonic series, which converges — endpoints do not change the radius.",
      "$R=\\lim\\frac{4(n+1)}{n}=4$."
    ],
    "trap": "Seeing $n$ in the denominator and thinking the radius becomes something depending on $n$, like $\\frac{4}{n}$. The radius is always a single number.",
    "check": "Root Test comparison: $\\sqrt[n]{n\\,4^n}=4\\sqrt[n]{n}\\to 4$."
  },
  "fd-serx-304": {
    "spot": "$(-1)^n$ is only a sign and disappears under absolute values; the radius is set by $5^n$, and $n$ does not matter.",
    "why": "Ratio Test on absolute values: $\\frac{(n+1)5^{n+1}}{n\\,5^n}\\to 5$. The alternating sign only affects the endpoints.",
    "steps": [
      "Take absolute values: $\\left|\\frac{(-1)^nx^n}{n\\,5^n}\\right|=\\frac{|x|^n}{n\\,5^n}$.",
      "Coefficient ratio $\\frac{5(n+1)}{n}\\to 5$.",
      "Endpoints: $x=5$ gives the alternating harmonic series (converges), $x=-5$ gives the harmonic series (diverges); the radius is unchanged.",
      "Radius of convergence $R=5$."
    ],
    "trap": "Thinking $(-1)^n$ flips the sign of the radius or makes it $-5$. A radius is always a nonnegative number.",
    "check": "Inside the radius at $x=1$: the sum is $-\\ln\\left(1+\\frac{1}{5}\\right)\\approx -0.182$, finite."
  }
};
