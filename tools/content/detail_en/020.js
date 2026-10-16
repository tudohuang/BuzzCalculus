// Detail v2, English — batch 020. Translation of tools/content/detail/020.js (text only; claims live in the Chinese file).
module.exports = {
  "cx-int-004": {
    "spot": "Denominator $1+x^2$, numerator the constant $1$ — that is exactly the derivative of $\\arctan x$, so just recall it. To derive it, substitute $x=\\tan\\theta$ and use $1+\\tan^2\\theta=\\sec^2\\theta$.",
    "why": "The numerator is not the derivative of the denominator (that would be $2x$), so this is not a log form. One trigonometric substitution turns the whole integrand into $1$.",
    "steps": [
      "Let $x=\\tan\\theta$, so $dx=\\sec^2\\theta\\,d\\theta$, and $1+\\tan^2\\theta=\\sec^2\\theta$.",
      "The integrand becomes $\\frac{\\sec^2\\theta}{\\sec^2\\theta}=1$, so the integral is $\\theta+C$.",
      "Back to $x$: $\\theta=\\arctan x$, and indeed $(\\arctan x)'=\\frac{1}{1+x^2}$.",
      "So $\\int\\frac{1}{1+x^2}\\,dx=\\arctan x+C$."
    ],
    "trap": "Seeing the denominator and writing $\\ln(1+x^2)$: its derivative is $\\frac{2x}{1+x^2}$, with an extra $2x$.",
    "check": "Check with a definite integral: $\\int_0^1\\frac{dx}{1+x^2}=\\arctan 1=\\frac{\\pi}{4}$."
  },
  "dd-nest-001": {
    "spot": "$\\sin$ nested three deep: a triple composition. Peel it with the Chain Rule from the outside in, multiplying by one $\\cos(\\text{inside})$ per layer.",
    "why": "No products, no quotients, only composition, so the Chain Rule is the only tool. The key is to keep each layer's inside exactly as it is.",
    "steps": [
      "The outer $\\sin(\\square)$ gives $\\cos(\\sin(\\sin x))$, times the derivative of the inside $\\sin(\\sin x)$.",
      "The middle layer $\\sin(\\sin x)$ has derivative $\\cos(\\sin x)\\cdot\\cos x$.",
      "Put together: $\\cos(\\sin(\\sin x))\\cdot\\cos(\\sin x)\\cdot\\cos x$."
    ],
    "trap": "Stopping after one layer, writing $\\cos(\\sin(\\sin x))$, or stopping at $\\cos(\\sin x)$ and missing the innermost $\\cos x$.",
    "check": "Plug in $x=0$: all three $\\cos$ factors are $\\cos 0=1$, so the derivative is $1$."
  },
  "dd-rr-001": {
    "spot": "Ladder, wall and ground form a right triangle with fixed hypotenuse $5$: $x^2+y^2=25$. Given the speed of the bottom, asked for the speed of the top — differentiate in time to tie $x'$ and $y'$ together.",
    "why": "Standard related rates: write the relation, differentiate with respect to $t$, then plug in numbers. Plugging in $x=3$ before differentiating freezes the variable.",
    "steps": [
      "When the bottom is $3$ from the wall, the top is at height $y=\\sqrt{25-9}=4$.",
      "Differentiate $x^2+y^2=25$ with respect to $t$: $2xx'+2yy'=0$, so $y'=-\\frac{x}{y}x'$.",
      "Plug in $x=3$, $y=4$, $x'=1$: $y'=-\\frac{3}{4}$; the minus sign means downward.",
      "The question asks how fast it falls, so take the magnitude: $\\frac{3}{4}$ m/s."
    ],
    "trap": "Assuming both ends move at the same speed and answering $1$. In fact $y'=-\\frac{x}{y}x'$: the farther the bottom is from the wall, the faster the top drops.",
    "check": "Move the bottom from $3$ to $3.01$: the top drops from $4$ to about $3.9925$, a drop of about $0.0075$, exactly $\\frac{3}{4}$ times $0.01$."
  },
  "dd-rr-005": {
    "spot": "Lamp, person and tip of the shadow form two similar triangles. With the person at distance $x$ from the lamp and shadow length $s$, $\\frac{s}{1.8}=\\frac{x+s}{6}$ — use similarity to get a linear relation between $s$ and $x$, then differentiate in time.",
    "why": "The relation is linear, so after differentiating $s'$ is a fixed multiple of $x'$, independent of where the person is. You never need the current distance.",
    "steps": [
      "Similar triangles: $\\frac{s}{1.8}=\\frac{x+s}{6}$. For example, at $x=7$, $s=3$ both sides equal $\\frac{5}{3}$.",
      "Cross-multiply: $6s=1.8x+1.8s$, $4.2s=1.8x$, $s=\\frac{3}{7}x$.",
      "Differentiate with respect to $t$: $s'=\\frac{3}{7}x'$.",
      "Plug in $x'=1.5$: $s'=\\frac{3}{7}\\cdot 1.5=\\frac{9}{14}$ m/s."
    ],
    "trap": "Computing the speed of the shadow's tip $(x+s)'=\\frac{10}{7}\\cdot 1.5=\\frac{15}{7}$; the question asks for the rate of change of the shadow length $s$.",
    "check": "The shadow grows more slowly than the walking speed $1.5$, which makes sense: the person is only $0.3$ times the lamp's height."
  },
  "depth-int-019": {
    "spot": "The numerator $x$ is exactly half the derivative of the $1+x^2$ in the denominator — substitute $u=1+x^2$, integrate, then deal with the upper limit $\\infty$.",
    "why": "One substitution gives $\\frac{1}{2}\\int u^{-2}du$. The improper integral just needs the antiderivative to have a limit at $\\infty$.",
    "steps": [
      "Let $u=1+x^2$, $du=2x\\,dx$: $\\int\\frac{x}{(1+x^2)^2}dx=\\frac{1}{2}\\int u^{-2}du=-\\frac{1}{2(1+x^2)}+C$.",
      "Upper limit: as $x\\to\\infty$, $-\\frac{1}{2(1+x^2)}\\to 0$.",
      "Lower limit: at $x=0$ it is $-\\frac{1}{2}$.",
      "Subtract: $0-\\left(-\\frac{1}{2}\\right)=\\frac{1}{2}$."
    ],
    "trap": "Forgetting the $2$ in $du=2x\\,dx$ after substituting, and getting $1$.",
    "check": "The integrand is nonnegative for $x\\ge 0$, and up to $1$ it already gives $\\frac{1}{4}$, so a total of $\\frac{1}{2}$ is reasonable."
  },
  "der-021": {
    "spot": "Partial derivative in $x$: treat $y$ as a constant throughout. The first term $x^2y$ is a constant times $x^2$; the second, $\\sin(xy)$, is a composition, and the Chain Rule brings out the inner derivative in $x$, which is $y$.",
    "why": "A partial derivative is just an ordinary derivative with the other variables frozen. Product and Chain Rules apply as usual; $y$ is just a number.",
    "steps": [
      "$\\frac{\\partial}{\\partial x}(x^2y)=2xy$ ($y$ is a coefficient).",
      "$\\frac{\\partial}{\\partial x}\\sin(xy)=\\cos(xy)\\cdot\\frac{\\partial}{\\partial x}(xy)=y\\cos(xy)$.",
      "Add: $2xy+y\\cos(xy)$."
    ],
    "trap": "Differentiating $\\sin(xy)$ to $\\cos(xy)$ and stopping, missing the inner $y$; or differentiating $y$ too and picking up an extra $x\\cos(xy)$.",
    "check": "Fix $y=1$: the function becomes $x^2+\\sin x$ with derivative $2x+\\cos x$, matching the answer at $y=1$."
  },
  "gap-tech-008": {
    "spot": "In the denominator $x^4+y^2$, $x$ is to the fourth power and $y$ squared — unbalanced powers. Lines $y=kx$ reveal nothing, but along the parabola $y=x^2$ numerator and denominator have the same order: this is asking you to compare limits along different paths.",
    "why": "Polar coordinates fail here (the angular part does not converge uniformly as $r\\to 0$). Finding two paths with different limits is the fastest proof that the limit does not exist.",
    "steps": [
      "Along the line $y=x$: $\\frac{x^3}{x^4+x^2}=\\frac{x}{x^2+1}\\to 0$; every line $y=kx$ tends to $0$.",
      "Along the parabola $y=x^2$: $\\frac{x^4}{x^4+x^4}=\\frac{1}{2}$.",
      "The two paths give different values ($0$ and $\\frac{1}{2}$), so the limit does not exist.",
      "So the technique here is the path test: find two paths with different limits."
    ],
    "trap": "Trying only lines $y=kx$, getting $0$ every time, and declaring the limit is $0$ — lines are not enough; match the powers in the denominator and pick $y=x^2$.",
    "check": "Along $y=x^2$ with $x=0.01$: the value is exactly $\\frac{1}{2}$, no matter how close to the origin."
  },
  "ig-num-009": {
    "spot": "The problem says concave up. The Trapezoidal Rule joins points on the curve with chords, and a concave-up curve lies entirely below its chords, so every trapezoid exceeds the area under the curve.",
    "why": "The sign of $f''$ tells you the direction of the error; no need to finish the Trapezoidal Rule and compare with $\\ln 2$.",
    "steps": [
      "$f(x)=\\frac{1}{x}$, $f''(x)=\\frac{2}{x^3}>0$ throughout $[1,2]$, so it is concave up.",
      "Concave up means the chord lies above the curve: e.g. the value at the midpoint $1.5$ is less than the average of the endpoint values.",
      "Actually compute with $n=4$, $h=0.25$: $T_4=\\frac{0.25}{2}\\left(1+2\\left(\\frac{1}{1.25}+\\frac{1}{1.5}+\\frac{1}{1.75}\\right)+\\frac{1}{2}\\right)\\approx 0.6970$, larger than $\\ln 2\\approx 0.6931$.",
      "So the Trapezoidal Rule overestimates."
    ],
    "trap": "Mixing it up with the Midpoint Rule: for concave up, the Midpoint Rule underestimates and the Trapezoidal Rule overestimates — opposite directions.",
    "check": "For the same problem the Midpoint Rule $M_4$ is indeed below $\\ln 2$, so the two rules bracket the true value."
  },
  "int-024": {
    "spot": "Inner upper limit $1-x$: the region is the right triangle $x+y\\le 1$. Integrate in $y$ first with $x$ held constant; the inner result is a clean polynomial.",
    "why": "The order is already set and all limits are polynomials, so just integrate in order. Switching to polar would make the hypotenuse $x+y=1$ awkward.",
    "steps": [
      "Inner: $\\int_0^{1-x}(x+y)\\,dy=x(1-x)+\\frac{(1-x)^2}{2}=\\frac{1-x^2}{2}$.",
      "Outer: $\\int_0^1\\frac{1-x^2}{2}dx=\\frac{1}{2}\\left(1-\\frac{1}{3}\\right)=\\frac{1}{3}$.",
      "So the answer is $\\frac{1}{3}$."
    ],
    "trap": "Taking the inner upper limit as $1$ (the whole square) and computing $\\int_0^1\\int_0^1(x+y)=1$.",
    "check": "Centroid method: the triangle has area $\\frac{1}{2}$ and centroid $\\left(\\frac{1}{3},\\frac{1}{3}\\right)$, so $x+y$ averages $\\frac{2}{3}$; the product is $\\frac{1}{3}$."
  },
  "int-028": {
    "spot": "A lone $\\ln x$ with nothing to pair it with — $\\ln x$ has no direct antiderivative, but its derivative is $\\frac{1}{x}$. Take $dx$ as $dv$ and integrate by parts.",
    "why": "With $dv=dx$ we get $v=x$, which multiplies with $du=\\frac{dx}{x}$ to give $1$. Done in one pass.",
    "steps": [
      "Take $u=\\ln x$, $dv=dx$: $du=\\frac{1}{x}dx$, $v=x$.",
      "$\\int\\ln x\\,dx=x\\ln x-\\int x\\cdot\\frac{1}{x}dx=x\\ln x-\\int 1\\,dx$.",
      "So $\\int\\ln x\\,dx=x\\ln x-x+C$."
    ],
    "trap": "Taking the antiderivative of $\\ln x$ to be $\\frac{1}{x}$ (that is its derivative) — wrong direction.",
    "check": "Definite integral: $\\int_1^{e}\\ln x\\,dx=(e-e)-(0-1)=1$."
  },
  "lb-lp-003": {
    "spot": "The $L^1$ norm is $\\int|f|$. On $[0,\\pi]$, $\\sin x\\ge 0$, so the absolute value just drops and you have a basic definite integral.",
    "why": "Check the sign first, then remove the absolute value. No need to split this interval.",
    "steps": [
      "$\\|f\\|_1=\\int_0^\\pi|\\sin x|\\,dx$, and $\\sin x\\ge 0$ on $[0,\\pi]$.",
      "So $\\|f\\|_1=\\int_0^\\pi\\sin x\\,dx=\\left[-\\cos x\\right]_0^\\pi$.",
      "$=-\\cos\\pi+\\cos 0=1+1=2$."
    ],
    "trap": "Confusing the norm with the squared norm and computing $\\int_0^\\pi\\sin^2x\\,dx=\\frac{\\pi}{2}$ (that is $\\|f\\|_2^2$).",
    "check": "The curve has height at most $1$ and width $\\pi$, so the area should be less than $\\pi\\approx 3.14$; $2$ is reasonable."
  },
  "lim-021": {
    "spot": "The numerator is $\\tan x$ minus $x$ — exactly its first Taylor term removed. The denominator $x^3$ tells you to expand to the cubic term.",
    "why": "L'Hôpital's Rule would need three rounds, and higher derivatives of $\\tan$ get messy. One line of expansion shows the coefficient.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "$\\tan x=x+\\frac{x^3}{3}+\\frac{2x^5}{15}+\\cdots$.",
      "Subtracting $x$ leaves $\\frac{x^3}{3}+\\cdots$; divided by $x^3$ it tends to $\\frac{1}{3}$."
    ],
    "trap": "Remembering the cubic coefficient of $\\tan x$ as that of $\\sin x$, $-\\frac{1}{6}$, or as $\\frac{1}{6}$; the cubic coefficient of $\\tan x$ is $+\\frac{1}{3}$.",
    "check": "Plug in $x=0.01$: the ratio is about $0.33335$, slightly above $\\frac{1}{3}$ (the next term $\\frac{2}{15}x^2$ is positive)."
  },
  "lm-nr-003": {
    "spot": "As $n\\to\\infty$, $\\sqrt[n]{7}\\to 1$, so the whole thing is $\\infty\\cdot 0$. Move $n$ to the denominator with $h=\\frac{1}{n}$ and you get $\\frac{7^h-1}{h}$ — the derivative of $7^x$ at $0$.",
    "why": "After switching to $h\\to 0^+$ it is a derivative definition, and $\\ln 7$ is immediate; no separate L'Hôpital's Rule needed.",
    "steps": [
      "Let $h=\\frac{1}{n}$: $n\\left(\\sqrt[n]{7}-1\\right)=\\frac{7^h-1}{h}$, and $n\\to\\infty$ corresponds to $h\\to 0^+$.",
      "$\\frac{7^h-1}{h}$ is the derivative definition of $7^x$ at $x=0$; $(7^x)'=7^x\\ln 7$, which is $\\ln 7$ at $0$.",
      "So the limit is $\\ln 7$."
    ],
    "trap": "Seeing $\\sqrt[n]{7}\\to 1$ and saying the whole thing is $n\\cdot 0=0$. This is the indeterminate form $\\infty\\cdot 0$; you cannot take the limits separately.",
    "check": "Plug in $n=1000$: $1000(7^{0.001}-1)\\approx 1.9478$, close to $\\ln 7\\approx 1.9459$."
  },
  "mob-trap-003": {
    "spot": "Denominator $x^2+1$, numerator $1$: the numerator is not the derivative of the denominator (that would need $2x$), so this is not the $\\ln$ form. The denominator is square plus one — the shape of $\\arctan$.",
    "why": "$\\int\\frac{u'}{u}=\\ln|u|$ only works when the numerator is exactly the derivative of the denominator. Here the $2x$ is missing, so go with $\\arctan$.",
    "steps": [
      "The derivative of the denominator is $2x$, not the numerator's $1$.",
      "If you force $\\ln(x^2+1)$, differentiating back gives $\\frac{2x}{x^2+1}$, not the original.",
      "Correct: $(\\arctan x)'=\\frac{1}{x^2+1}$, so $\\int\\frac{dx}{x^2+1}=\\arctan x+C$.",
      "The main trap: writing a logarithm. This one is arctangent, not $\\ln$."
    ],
    "trap": "Writing $\\ln(x^2+1)+C$: over $\\int_0^1$ that gives $\\ln 2\\approx 0.693$, while the correct value is $\\frac{\\pi}{4}\\approx 0.785$.",
    "check": "Compare numerically: $\\int_0^1\\frac{dx}{x^2+1}$ equals $\\arctan 1$, not $\\ln 2$."
  },
  "ode-sep-005": {
    "spot": "The right side $e^{-y}$ depends only on $y$: separable. Move $e^{-y}$ over to get $e^{y}dy=dx$.",
    "why": "After separating, both sides are basic integrals; then $y(0)=0$ fixes the constant. No integrating factor needed.",
    "steps": [
      "Separate: $e^{y}\\,dy=dx$; integrating both sides gives $e^{y}=x+C$.",
      "Plug in $y(0)=0$: $e^0=0+C$, $C=1$, so $e^{y}=1+x$.",
      "Take logs: $y=\\ln(1+x)$. Check by substituting back: $y'=\\frac{1}{1+x}=e^{-\\ln(1+x)}=e^{-y}$.",
      "So $y(x)=\\ln(1+x)$."
    ],
    "trap": "Leaving $e^{-y}$ on the right and integrating against $dx$, getting something like $y=e^{-y}x$ — integrating before the variables are fully separated.",
    "check": "$y'=e^{-y}>0$, so the solution should increase, and grow more slowly as $y$ gets larger — exactly what $\\ln(1+x)$ does."
  },
  "refine-integrals-013": {
    "spot": "Symmetric interval $[-2,2]$; split the integrand in two. $x\\cos(x^2)$ is odd (integral $0$), and $\\sqrt{4-x^2}$ is the upper half of a circle of radius $2$ (read off the area).",
    "why": "Neither piece needs an antiderivative: the odd part by symmetry, the semicircle by geometry. Much faster than a trigonometric substitution for $\\sqrt{4-x^2}$.",
    "steps": [
      "$x\\cos(x^2)$ changes sign under $x\\to -x$, so it is odd and integrates to $0$ over a symmetric interval.",
      "$y=\\sqrt{4-x^2}$ is the upper semicircle of radius $2$, with area $\\frac{1}{2}\\pi\\cdot 2^2=2\\pi$.",
      "Add: $0+2\\pi=2\\pi$."
    ],
    "trap": "Using the full circle's area $4\\pi$, or discarding $\\sqrt{4-x^2}$ as odd too (it is even).",
    "check": "The semicircle's area should lie between the inscribed triangle $4$ and the bounding rectangle $8$: $2\\pi\\approx 6.28$."
  },
  "refine-integrals-024": {
    "spot": "Both curves are written as $x=\\cdots y$: $x=2y^2$ is a parabola opening right, $x=y+3$ is a line — integrate in $y$, right minus left, and one integral does it.",
    "why": "Integrating in $x$ would split the parabola into upper and lower branches and need several pieces; in $y$ it is a single expression.",
    "steps": [
      "Intersections: $2y^2=y+3$, $2y^2-y-3=(2y-3)(y+1)=0$, so $y=-1$ or $y=\\frac{3}{2}$.",
      "Between the intersections the line is on the right: e.g. at $y=0$, $3>0$.",
      "Area $=\\int_{-1}^{3/2}\\left(y+3-2y^2\\right)dy=\\frac{125}{24}$."
    ],
    "trap": "Integrating in $x$ out of habit with top minus bottom in the form $y=x^2$, covering only one branch of the parabola and losing a big chunk of area.",
    "check": "Parabolic segment formula: $\\frac{|a|(\\beta-\\alpha)^3}{6}=\\frac{2\\cdot(5/2)^3}{6}=\\frac{125}{24}$."
  },
  "refine-limits-044": {
    "spot": "For every $x$ in $[0,1)$, $x^n\\to 0$, so the integrand tends pointwise to $1$, and it is bounded by $1$ — estimate the gap directly: $1-\\frac{1}{1+x^n}=\\frac{x^n}{1+x^n}\\le x^n$.",
    "why": "You cannot just move the limit inside the integral and call it done. Squeezing with $\\int_0^1x^n\\,dx=\\frac{1}{n+1}$ justifies it.",
    "steps": [
      "$0<\\frac{1}{1+x^n}\\le 1$, so the integral is $\\le 1$.",
      "The gap $1-\\frac{1}{1+x^n}=\\frac{x^n}{1+x^n}\\le x^n$, so after integrating the gap is $\\le\\frac{1}{n+1}$.",
      "So $1-\\frac{1}{n+1}\\le\\int_0^1\\frac{dx}{1+x^n}\\le 1$.",
      "Squeeze Theorem: the lower bound $1-\\frac{1}{n+1}\\to 1$, so the limit is $1$."
    ],
    "trap": "Noticing the integrand is $\\frac{1}{2}$ at $x=1$ and thinking it pulls the answer down; a single point does not affect the integral.",
    "check": "At $n=9$ the integral already exceeds $0.9$."
  },
  "rel-basic-022": {
    "spot": "The coefficient is a pure exponential $3^n$: $3^nx^n=(3x)^n$, so the whole thing is a geometric series with ratio $3x$.",
    "why": "A geometric series converges $\\iff$ the ratio has absolute value less than $1$ — more direct than the Ratio Test.",
    "steps": [
      "$\\sum 3^nx^n=\\sum(3x)^n$, ratio $3x$; the Ratio Test agrees: $\\frac{3^{n+1}}{3^n}=3$.",
      "Converges $\\iff|3x|<1\\iff|x|<\\frac{1}{3}$. At $x=\\frac{1}{3}$ every term is $1$, so it diverges.",
      "Radius of convergence $R=\\frac{1}{3}$."
    ],
    "trap": "Taking the ratio $3$ as the radius; the radius is its reciprocal $\\frac{1}{3}$.",
    "check": "At $x=0.3$ (inside the radius) the series sums to $\\frac{1}{1-0.9}=10$."
  },
  "sg-est-006": {
    "spot": "Each term is $\\frac{1}{3}$ of the previous one: a geometric series with first term $\\frac{2}{3}$ and ratio $\\frac{1}{3}$, whose partial sums climb toward $1$.",
    "why": "Geometric series have the closed form $\\frac{a}{1-r}$; no need to guess the limit from a picture.",
    "steps": [
      "First term $a=\\frac{2}{3}$, ratio $r=\\frac{1}{3}$.",
      "The partial sums match: $S_4=\\frac{2}{3}+\\frac{2}{9}+\\frac{2}{27}+\\frac{2}{81}=\\frac{80}{81}\\approx 0.988$.",
      "Sum $\\frac{a}{1-r}=\\frac{2/3}{2/3}=1$."
    ],
    "trap": "Applying the formula from $n=0$ with first term $2$ and getting $3$; this series starts at $n=1$.",
    "check": "$S_n=1-\\frac{1}{3^n}$, so the partial sums always fall a bit short of $1$: $S_4=1-\\frac{1}{81}$."
  },
  "sg-est-011": {
    "spot": "Only the third partial sum is needed: add the first three terms $n=1,2,3$, watching the alternating signs.",
    "why": "A finite sum — no convergence test or formula required.",
    "steps": [
      "$n=1$: $+1$; $n=2$: $-\\frac{1}{4}$; $n=3$: $+\\frac{1}{9}$.",
      "Common denominator $36$: $\\frac{36-9+4}{36}=\\frac{31}{36}$.",
      "$S_3=\\frac{31}{36}$."
    ],
    "trap": "Forgetting the alternation and adding everything: $1+\\frac{1}{4}+\\frac{1}{9}=\\frac{49}{36}$.",
    "check": "The full series sums to $\\frac{\\pi^2}{12}\\approx 0.822$; the alternating-series error is less than the next term $\\frac{1}{16}$, and $S_3\\approx 0.861$ fits."
  },
  "si-int-012": {
    "spot": "Even root: the radicand must be $\\ge 0$ (equal to $0$ is fine), so solve $x^2-1\\ge 0$.",
    "why": "Just one condition, one quadratic inequality. The parabola opens upward, so the answer lies outside the two roots.",
    "steps": [
      "Need $x^2-1\\ge 0$; at the roots $x=\\pm 1$ it equals $0$, which is allowed.",
      "Between the roots (e.g. $x=0$) it is negative, not allowed; outside the roots it is positive.",
      "The domain is $(-\\infty,-1]\\cup[1,\\infty)$, including the endpoints $\\pm 1$."
    ],
    "trap": "Writing open intervals and dropping $\\pm 1$ — $\\sqrt{0}=0$ is defined; or solving it backwards as $[-1,1]$.",
    "check": "Plug in $x=-2$: $\\sqrt{3}$ is defined, so the left piece really is in the domain."
  },
  "si-int-013": {
    "spot": "Root in the denominator: the radicand must be $\\ge 0$, and the denominator cannot be $0$; together that is the strict inequality $x-2>0$.",
    "why": "Intersect the two conditions; the denominator condition excludes $x=2$.",
    "steps": [
      "The root needs $x-2\\ge 0$, i.e. $x\\ge 2$.",
      "Denominator $\\sqrt{x-2}\\ne 0$, so $x\\ne 2$.",
      "The domain is $(2,\\infty)$, open at the left end."
    ],
    "trap": "Looking only at the root and writing $[2,\\infty)$, forgetting the denominator is $0$ at $x=2$.",
    "check": "As $x$ approaches $2$ from the right the function blows up, so $2$ is a boundary not in the domain."
  },
  "si-int-015": {
    "spot": "For a rational function the domain only requires the denominator not to be $0$:$x^2-4=(x-2)(x+2)\\ne 0$, removing two points.",
    "why": "No roots, no logs — the only restriction is the zeros of the denominator.",
    "steps": [
      "The denominator $x^2-4=(x-2)(x+2)$ vanishes at $x=\\pm 2$.",
      "Everywhere else the denominator is not $0$; e.g. at $x=0$, $f(0)=-\\frac{1}{4}$.",
      "The domain is $(-\\infty,-2)\\cup(-2,2)\\cup(2,\\infty)$, i.e. all reals except $\\pm 2$."
    ],
    "trap": "Confusing it with a square-root problem and writing $|x|>2$, throwing away $(-2,2)$; a negative denominator is fine.",
    "check": "$x=1$ is in the middle piece: $f(1)=-\\frac{1}{3}$, defined."
  },
  "si-int-017": {
    "spot": "Product $xe^x$: after the Product Rule, factor out $e^x$ to get $f'(x)=(1+x)e^x$. Since $e^x$ is always positive, the sign depends only on $1+x$.",
    "why": "With the always-positive factor pulled out, only a linear factor is left, and the cutoff $-1$ is obvious.",
    "steps": [
      "$f'(x)=e^x+xe^x=(1+x)e^x$.",
      "$e^x>0$, so $f'(x)>0\\iff x>-1$; at $x=-1$, $f'=0$.",
      "Increasing on $(-1,\\infty)$."
    ],
    "trap": "Looking only at the sign of $x$ and thinking it increases only for $x>0$, forgetting the extra $e^x$ term from the Product Rule.",
    "check": "$x=-1$ is the lowest point: $f(-1)=-\\frac{1}{e}$, and values on both sides are larger."
  },
  "si-int-018": {
    "spot": "An even quartic with $f'(x)=4x^3-4x=4x(x-1)(x+1)$: three critical points $-1,0,1$ cut the line into four pieces with alternating signs.",
    "why": "Three linear factors, so the sign flips at each root. Starting from the far right (positive) and moving left is fastest.",
    "steps": [
      "$f'(x)=4x^3-4x=4x(x-1)(x+1)$, with zeros $-1,0,1$.",
      "Positive for $x>1$; negative on $(0,1)$; positive on $(-1,0)$; negative for $x<-1$.",
      "Decreasing on $(-\\infty,-1)\\cup(0,1)$."
    ],
    "trap": "Catching only $(0,1)$, or including $(-1,0)$ as well; check all four pieces one by one.",
    "check": "The graph is W-shaped: two valleys $f(\\pm 1)=-1$ and a middle peak $f(0)=0$. The two stretches heading down into the valleys are where it decreases."
  },
  "si-set-018": {
    "spot": "Inflection points are where $f''$ changes sign. Every derivative of $xe^{-x}$ is a linear factor times $e^{-x}$, so the sign of $f''$ depends only on that linear factor.",
    "why": "$e^{-x}$ is always positive, so zeros and signs come from the linear factor; no transcendental equation to solve.",
    "steps": [
      "$f'(x)=(1-x)e^{-x}$, $f''(x)=(x-2)e^{-x}$.",
      "$f''(x)=0\\iff x=2$.",
      "For $x<2$, $f''<0$ (concave down); for $x>2$, $f''>0$ (concave up), so the sign does change.",
      "There is exactly one inflection point: $x=2$."
    ],
    "trap": "Taking $x=1$, where $f'=0$ (a local max), as the inflection point.",
    "check": "There is only one linear factor, so there cannot be a second inflection point."
  },
  "tb-arc-001": {
    "spot": "A function like $\\frac{x^4}{8}+\\frac{1}{4x^2}$, two terms with carefully matched coefficients — the classic arc length setup: $1+(y')^2$ becomes a perfect square and the root disappears.",
    "why": "The square root in the arc length formula usually cannot be integrated; the key here is spotting the perfect square, not brute force.",
    "steps": [
      "$y'=\\frac{x^3}{2}-\\frac{1}{2x^3}$.",
      "$(y')^2=\\frac{x^6}{4}-\\frac{1}{2}+\\frac{1}{4x^6}$; adding $1$ flips the middle $-\\frac{1}{2}$ to $+\\frac{1}{2}$: $1+(y')^2=\\left(\\frac{x^3}{2}+\\frac{1}{2x^3}\\right)^2$.",
      "So $L=\\int_1^2\\left(\\frac{x^3}{2}+\\frac{1}{2x^3}\\right)dx=\\left[\\frac{x^4}{8}-\\frac{1}{4x^2}\\right]_1^2$.",
      "$=\\left(2-\\frac{1}{16}\\right)-\\left(\\frac{1}{8}-\\frac{1}{4}\\right)=\\frac{31}{16}+\\frac{1}{8}=\\frac{33}{16}$."
    ],
    "trap": "After removing the root, getting the sign of the second antiderivative term wrong: $\\int\\frac{1}{2x^3}dx=-\\frac{1}{4x^2}$, not $+$.",
    "check": "Arc length is at least the straight-line distance between the endpoints: from $\\left(1,\\frac{3}{8}\\right)$ to $\\left(2,\\frac{33}{16}\\right)$ is about $1.97$, and $\\frac{33}{16}\\approx 2.06$ is slightly longer. Reasonable."
  },
  "tb-area-002": {
    "spot": "One parabola opening up, one opening down, both symmetric about the $y$-axis: find the intersections; in between $8-x^2$ is on top, so integrate top minus bottom once.",
    "why": "Both are of the form $y=\\cdots x$ with a fixed top/bottom order, so integrating in $x$ is simplest; symmetry even lets you compute just half.",
    "steps": [
      "Intersections: $x^2=8-x^2$, $x^2=4$, $x=\\pm 2$.",
      "$8-x^2$ is on top in between: e.g. at $x=0$, $8>0$. The height difference is $8-2x^2$.",
      "Area $=\\int_{-2}^2(8-2x^2)dx=32-\\frac{32}{3}=\\frac{64}{3}$."
    ],
    "trap": "Writing the height difference as $8-x^2-x$, or forgetting to subtract twice and computing $\\int_{-2}^2(8-x^2)dx=\\frac{80}{3}$ (the whole area under the top curve).",
    "check": "Symmetry: the right half $\\int_0^2(8-2x^2)dx=\\frac{32}{3}$, times $2$, agrees."
  },
  "tb-imp-004": {
    "spot": "$x^3+y^3=9$ is awkward to solve for $y$: differentiate both sides implicitly in $x$; $y^3$ gives $3y^2y'$.",
    "why": "Implicit differentiation gives $y'$ as $-\\frac{x^2}{y^2}$ in one line, then plug in the point; no need to solve $y=\\sqrt[3]{9-x^3}$ first.",
    "steps": [
      "First check the point is on the curve: $1+8=9$.",
      "Differentiate in $x$: $3x^2+3y^2y'=0$, so $y'=-\\frac{x^2}{y^2}$.",
      "Plug in $(1,2)$: $y'=-\\frac{1}{4}$."
    ],
    "trap": "Differentiating $y^3$ to $3y^2$ and dropping $y'$, so the equation cannot be solved for $y'$ at all.",
    "check": "Make $x$ a bit bigger and $x^3$ grows, so $y^3$ must shrink — negative slope, right direction."
  },
  "tb-lh-004": {
    "spot": "Difference of two exponentials over $x$; plugging in $0$ gives $\\frac{0}{0}$. Split the numerator as $(4^x-1)-(2^x-1)$, and each piece is a derivative definition.",
    "why": "After splitting, use $\\lim\\frac{a^x-1}{x}=\\ln a$ directly. One round of L'Hôpital's Rule also works and gives the same $\\ln 4-\\ln 2$.",
    "steps": [
      "Plug in $x=0$: numerator $1-1=0$, form $\\frac{0}{0}$.",
      "Split into $\\frac{4^x-1}{x}-\\frac{2^x-1}{x}$; the pieces tend to $\\ln 4$ and $\\ln 2$.",
      "$\\ln 4-\\ln 2=\\ln 2$."
    ],
    "trap": "Thinking $\\frac{d}{dx}4^x=x\\cdot 4^{x-1}$ (treating the exponential as a power function), which gives a nonsense value at $0$.",
    "check": "Verify with L'Hôpital's Rule: the derivative of the numerator at $0$ is $\\ln 4-\\ln 2$."
  },
  "tb-mvt-002": {
    "spot": "Mean Value Theorem: find $c$ with $f'(c)$ equal to the secant slope $\\frac{f(1)-f(0)}{1-0}=e-1$. Since $f'=e^x$, take a log to solve.",
    "why": "The derivative of $e^x$ is still $e^x$, so the equation $e^c=e-1$ just needs a $\\ln$.",
    "steps": [
      "Secant slope $\\frac{e^1-e^0}{1-0}=e-1$.",
      "$f'(c)=e^c=e-1$, so $c=\\ln(e-1)\\approx 0.541$.",
      "Check $c$ lies in $(0,1)$: $1<e-1<e$.",
      "$c=\\ln(e-1)$."
    ],
    "trap": "Writing the secant slope as $e$ (forgetting to subtract $f(0)=1$), getting $c=1$, which is an endpoint and not allowed.",
    "check": "$c\\approx 0.54$ is just right of the midpoint: $e^x$ is concave up, so the slope only catches up with the average in the right half."
  },
  "tb-opt-002": {
    "spot": "The two numbers sum to $20$: use $y=20-x$ to write the sum of squares as a quadratic in one variable. It opens upward, so the vertex is the minimum.",
    "why": "A quadratic can be handled by differentiating or completing the square; one derivative gives $x=10$.",
    "steps": [
      "$S(x)=x^2+(20-x)^2$, $S'(x)=4x-40$.",
      "$S'=0$ gives $x=10$; $S''=4>0$, so it is a minimum.",
      "$S(10)=100+100=200$."
    ],
    "trap": "Thinking the numbers should be as far apart as possible (e.g. $0$ and $20$ give $400$) — that is the direction of the maximum; the sum of squares is smallest when the numbers are equal.",
    "check": "Try another pair, e.g. $9$ and $11$: $81+121=202>200$."
  },
  "tmpl-ser-arith-geo-001": {
    "spot": "Numerator $n$ (arithmetic) times $\\frac{1}{6^n}$ (geometric): an arithmetic-times-geometric series. Use $\\sum nx^n=\\frac{x}{(1-x)^2}$ with $x=\\frac{1}{6}$.",
    "why": "That formula comes from differentiating the geometric series $\\frac{1}{1-x}$ and multiplying by $x$ — faster than shift-and-subtract.",
    "steps": [
      "$\\sum_{n\\ge 0}x^n=\\frac{1}{1-x}$; differentiating gives $\\sum nx^{n-1}=\\frac{1}{(1-x)^2}$.",
      "Multiply both sides by $x$: $\\sum_{n\\ge 1}nx^n=\\frac{x}{(1-x)^2}$ ($|x|<1$).",
      "Plug in $x=\\frac{1}{6}$: $\\frac{1/6}{(5/6)^2}=\\frac{6}{25}$."
    ],
    "trap": "Forgetting to multiply by $x$ and using $\\frac{1}{(1-x)^2}=\\frac{36}{25}$ — that is $\\sum nx^{n-1}$.",
    "check": "The first two terms give $\\frac{1}{6}+\\frac{2}{36}\\approx 0.222$; the total $0.24$ is a bit larger. Reasonable."
  },
  "tr-val-002": {
    "spot": "The Taylor series of $\\sin x$ has only odd terms: the fifth-degree polynomial is $x-\\frac{x^3}{6}+\\frac{x^5}{120}$; plug in $x=1$.",
    "why": "If you know the series, there is no need to take derivatives one by one; the derivatives of $\\sin$ cycle every four, so the coefficients come right out.",
    "steps": [
      "The derivatives of $\\sin x$ at $0$ are $0,1,0,-1,0,1$ in order; all even-degree terms are $0$.",
      "$T_5(x)=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}=x-\\frac{x^3}{6}+\\frac{x^5}{120}$.",
      "Plug in $x=1$: $1-\\frac{1}{6}+\\frac{1}{120}=\\frac{120-20+1}{120}=\\frac{101}{120}$."
    ],
    "trap": "Reading fifth-degree as five nonzero terms and expanding all the way to $x^9$; fifth-degree means degree up to $5$.",
    "check": "Compare with $\\sin 1\\approx 0.84147$: $\\frac{101}{120}\\approx 0.84167$, an error smaller than $\\frac{1}{7!}$."
  },
  "uni-int-011": {
    "spot": "Polynomial $x^2$ times $\\ln x$: differentiating $\\ln x$ gives $\\frac{1}{x}$, which eats one $x$ — let $\\ln x$ be $u$ and $x^2dx$ be $dv$.",
    "why": "The other way round, with $x^2$ as $u$, you would have to integrate $\\ln x$ first and things get worse. $\\ln$ goes to $u$ first.",
    "steps": [
      "$u=\\ln x$, $dv=x^2dx$: $du=\\frac{dx}{x}$, $v=\\frac{x^3}{3}$.",
      "$\\int x^2\\ln x\\,dx=\\frac{x^3}{3}\\ln x-\\int\\frac{x^3}{3}\\cdot\\frac{1}{x}dx=\\frac{x^3}{3}\\ln x-\\int\\frac{x^2}{3}dx$.",
      "$=\\frac{x^3\\ln x}{3}-\\frac{x^3}{9}+C$."
    ],
    "trap": "Integrating the leftover $\\int\\frac{x^2}{3}dx$ as $\\frac{x^3}{3}$, forgetting to divide by $3$; the correct result is $\\frac{x^3}{9}$.",
    "check": "Definite integral: $\\int_1^2x^2\\ln x\\,dx=\\frac{8\\ln 2}{3}-\\frac{7}{9}\\approx 1.071$."
  },
  "world-006": {
    "spot": "The two linear factors $3n-2$ and $3n+1$ in the denominator differ by $3$: partial fractions turn each term into one term minus the next — a telescoping sum.",
    "why": "The Comparison Test only says it converges, not what the sum is. After splitting, everything in the middle cancels and the sum is visible.",
    "steps": [
      "$\\frac{1}{(3n-2)(3n+1)}=\\frac{1}{3}\\left(\\frac{1}{3n-2}-\\frac{1}{3n+1}\\right)$ (the factor $\\frac{1}{3}$ comes from the factors differing by $3$).",
      "The $-\\frac{1}{3n+1}$ of term $n$ cancels the $\\frac{1}{3(n+1)-2}=\\frac{1}{3n+1}$ of term $n+1$, so the partial sum is $S_N=\\frac{1}{3}\\left(1-\\frac{1}{3N+1}\\right)$.",
      "As $N\\to\\infty$: $S_N\\to\\frac{1}{3}$."
    ],
    "trap": "Forgetting the factor $\\frac{1}{3}$ in the partial fractions and getting $1$.",
    "check": "The first term alone is $\\frac{1}{4}$, and the rest are small positive terms, so the sum is a bit more than $\\frac{1}{4}$."
  },
  "world-050": {
    "spot": "$x^3$ times $\\ln x$ with lower limit $0$: integrate by parts first ($\\ln x$ as $u$), then handle the limit of $x^4\\ln x$ as $x\\to 0^+$.",
    "why": "$\\ln x$ blows up near $0$, but $x^4$ overpowers it, so the improper integral converges; just take the limit of the antiderivative.",
    "steps": [
      "Integration by parts: $\\int x^3\\ln x\\,dx=\\frac{x^4}{4}\\ln x-\\frac{x^4}{16}+C$.",
      "Upper limit $x=1$: $0-\\frac{1}{16}=-\\frac{1}{16}$.",
      "Lower limit $x\\to 0^+$: $x^4\\ln x\\to 0$ (the polynomial beats the log).",
      "So the integral $=-\\frac{1}{16}-0=-\\frac{1}{16}$."
    ],
    "trap": "Seeing $\\ln 0$ and declaring the integral divergent; it is multiplied by $x^4$, and the limit is $0$.",
    "check": "On $(0,1)$, $\\ln x<0$ and $x^3>0$, so the integrand is negative; a negative answer makes sense."
  },
  "an-sr-001": {
    "spot": "The error bound $\\frac{1}{\\sqrt{N+1}}$ is already given; just solve $\\frac{1}{\\sqrt{N+1}}<0.1$, noting the inequality is strict.",
    "why": "For an alternating series the error is less than the first omitted term, so just solve the inequality; no need to compute partial sums.",
    "steps": [
      "$\\frac{1}{\\sqrt{N+1}}<0.1\\iff\\sqrt{N+1}>10\\iff N+1>100$.",
      "At $N=99$ the bound equals $0.1$ exactly, which is not less than; only at $N=100$ is it strictly below $0.1$.",
      "The smallest $N$ is $100$."
    ],
    "trap": "Solving $N+1\\ge 100$ and getting $N=99$; there the error bound is $0.1$ itself, not less than it.",
    "check": "Conditionally convergent series converge slowly: needing a hundred terms to push the error below $0.1$ is reasonable."
  },
  "ap-mix-002": {
    "spot": "Rate of change of salt $Q$ $=$ in $-$ out: in is $0.5\\times 4=2$, out is $\\frac{Q}{100}\\times 4$ — the first-order linear equation $Q'=2-\\frac{Q}{25}$.",
    "why": "Inflow and outflow rates match, so the volume stays $100$ and the equation is first-order linear with constant coefficients; the solution is equilibrium $\\times(1-e^{-t/25})$.",
    "steps": [
      "In: $2$ kg/min; out: concentration $\\frac{Q}{100}$ at flow $4$: $Q'=2-\\frac{Q}{25}$, $Q(0)=0$.",
      "Equilibrium $Q=50$; the solution is $Q(t)=50\\left(1-e^{-t/25}\\right)$, which satisfies the equation and initial value when substituted back.",
      "Plug in $t=25$: $Q=50\\left(1-e^{-1}\\right)\\approx 31.6$ kg."
    ],
    "trap": "Taking the salt to be just the inflow $2\\times 25=50$ kg, forgetting salt is flowing out at the same time.",
    "check": "The result should be below the equilibrium $50$ (the tank's final concentration is $0.5$), and below the $50$ you would get with inflow only."
  },
  "ap-work-004": {
    "spot": "Pumping work: slice the water into thin horizontal layers. Each layer weighs the same, but must be lifted a different distance — the layer at height $y$ goes up $4-y$.",
    "why": "Different layers are lifted different distances, so you cannot just do weight $\\times$ height; integrate over slices, or use the center of mass.",
    "steps": [
      "Layer at height $y$: area $\\pi\\cdot 2^2=4\\pi$, weight $10^4\\cdot 4\\pi\\,dy$, lifted a distance $4-y$ to the top.",
      "$W=\\int_0^4 10^4\\cdot 4\\pi(4-y)\\,dy$, where $\\int_0^4(4-y)dy=8$.",
      "$W=4\\pi\\cdot 10^4\\cdot 8=320000\\pi$ J."
    ],
    "trap": "Multiplying the total weight by the full height $4$ to get $640000\\pi$; the bottom and top layers travel different distances.",
    "check": "Center of mass: total weight $10^4\\cdot 16\\pi$, center in the middle at distance $2$ from the top, work $=320000\\pi$."
  },
  "burst-int-005": {
    "spot": "Form $\\int_0^1x^m(\\ln x)^k$: substitute $x=e^{-t}$. Then $\\ln x$ becomes $-t$, the interval $[0,1]$ becomes $[0,\\infty)$, and everything turns into $\\int t^ke^{-(m+1)t}dt$, with answer $\\frac{k!}{(m+1)^{k+1}}$ up to sign.",
    "why": "Integration by parts would take two rounds plus boundary terms as $x\\to 0^+$; after the substitution it is a Gamma integral.",
    "steps": [
      "Let $x=e^{-t}$: $dx=-e^{-t}dt$, $\\ln x=-t$, $x^4=e^{-4t}$; $x:0\\to 1$ corresponds to $t:\\infty\\to 0$.",
      "$(\\ln x)^2=t^2$, and the minus sign is absorbed by swapping the limits, giving $\\int_0^\\infty t^2e^{-5t}dt$.",
      "Let $s=5t$: $=\\frac{1}{5^3}\\int_0^\\infty s^2e^{-s}ds=\\frac{2}{125}$.",
      "So the answer is $\\frac{2}{125}$."
    ],
    "trap": "Remembering the power as $(m+1)^k$ and getting $\\frac{2}{25}$; the exponent is one higher because $dt$ also becomes $\\frac{ds}{5}$.",
    "check": "The integrand is nonnegative, so the answer is positive; $(\\ln x)^2$ is an even power, so no minus sign."
  },
  "burst-int-006": {
    "spot": "The $\\int_0^1x^m(\\ln x)^k$ form again ($m=2$, $k=3$): substitute $x=e^{-t}$ to get a Gamma integral. $k$ is odd, so $(\\ln x)^3=-t^3$ brings a minus sign.",
    "why": "Integration by parts would take three rounds; after substitution it is one line: $-\\frac{3!}{3^4}$.",
    "steps": [
      "Let $x=e^{-t}$: $x^2=e^{-2t}$, $(\\ln x)^3=-t^3$, $dx=-e^{-t}dt$.",
      "$\\int_0^\\infty t^3e^{-t}dt=3!=6$.",
      "Let $s=3t$: $\\int_0^\\infty t^3e^{-3t}dt=\\frac{6}{3^4}=\\frac{2}{27}$.",
      "Attach the minus sign: $-\\frac{2}{27}$."
    ],
    "trap": "Dropping the minus sign: on $(0,1)$, $\\ln x<0$, and its cube is still negative, so the answer must be negative.",
    "check": "The integrand is $\\le 0$ on $(0,1)$, so the answer is negative."
  },
  "db-imp-005": {
    "spot": "Second derivative on the circle $x^2+y^2=25$: first implicit differentiation gives $y'=-\\frac{x}{y}$; differentiate that once more with the Quotient Rule and substitute $y'$ back in.",
    "why": "On a circle it simplifies nicely: $y''=-\\frac{x^2+y^2}{y^3}=-\\frac{25}{y^3}$, then plug in the point in one step.",
    "steps": [
      "$2x+2yy'=0$, $y'=-\\frac{x}{y}$; at $(3,4)$ it is $-\\frac{3}{4}$.",
      "$y''=-\\frac{y-xy'}{y^2}=-\\frac{y+x^2/y}{y^2}=-\\frac{x^2+y^2}{y^3}=-\\frac{25}{y^3}$.",
      "Plug in $y=4$: $y''=-\\frac{25}{64}$."
    ],
    "trap": "Treating $y$ as a constant when differentiating $-\\frac{x}{y}$ and getting $-\\frac{1}{y}=-\\frac{1}{4}$; $y$ is a function of $x$, so use the Quotient Rule.",
    "check": "The point $(3,4)$ is on the upper semicircle, which is concave down, so the second derivative should be negative."
  },
  "db-opt-004": {
    "spot": "Shortest distance from a point to a curve: minimize the squared distance $D(x)=(x-3)^2+(\\sqrt{x})^2$ — squaring removes the root and leaves a quadratic.",
    "why": "Distance and squared distance are minimized at the same point, and squaring avoids differentiating a root; also $y^2=x$ conveniently cancels the $\\sqrt{x}$.",
    "steps": [
      "$D(x)=(x-3)^2+x$, $x\\ge 0$.",
      "$D'(x)=2(x-3)+1=0$, $x=\\frac{5}{2}$; the parabola opens upward, so this is the minimum.",
      "$D\\left(\\frac{5}{2}\\right)=\\frac{1}{4}+\\frac{5}{2}=\\frac{11}{4}$, distance $\\frac{\\sqrt{11}}{2}$."
    ],
    "trap": "Forgetting the square root at the end and answering $\\frac{11}{4}$ (the squared distance).",
    "check": "Shorter than the distance to an arbitrary curve point $(3,\\sqrt{3})$, which is $\\sqrt{3}\\approx 1.73$: $\\frac{\\sqrt{11}}{2}\\approx 1.66$."
  },
  "db-opt-006": {
    "spot": "Rectangle inscribed in a circle with vertices on the circle: parametrize a vertex by angle $\\theta$ as $(\\cos\\theta,\\sin\\theta)$; area $4\\cos\\theta\\sin\\theta=2\\sin 2\\theta$.",
    "why": "Writing the area in terms of the angle avoids roots, and the double-angle formula shows the max $2$ at a glance.",
    "steps": [
      "First-quadrant vertex $(\\cos\\theta,\\sin\\theta)$, length $2\\cos\\theta$, width $2\\sin\\theta$, area $A=4\\cos\\theta\\sin\\theta=2\\sin 2\\theta$.",
      "$\\sin 2\\theta$ is at most $1$, at $\\theta=\\frac{\\pi}{4}$; the derivative is $0$ there.",
      "Maximum area $2$ (a square with side $\\sqrt{2}$)."
    ],
    "trap": "Writing the vertex as $(x,y)$ but the area as $xy$, missing the factor $4$ (the sides are $2x$ and $2y$), and getting $\\frac{1}{2}$.",
    "check": "Smaller than the circle's area $\\pi\\approx 3.14$, as it should be."
  },
  "db-rr-007": {
    "spot": "Fixed height $40$, changing horizontal distance $x$, and the string length $L$ as hypotenuse: $L^2=x^2+40^2$; differentiate in time to link $L'$ and $x'$.",
    "why": "Write Pythagoras, differentiate, then plug in. When the string is $50$, the horizontal distance is $30$ (a 3-4-5 triangle).",
    "steps": [
      "When $L=50$, $x=\\sqrt{2500-1600}=30$.",
      "$L=\\sqrt{x^2+1600}$, $\\frac{dL}{dx}=\\frac{x}{L}$, which is $\\frac{3}{5}$ at $x=30$.",
      "$L'=\\frac{x}{L}\\cdot x'=\\frac{3}{5}\\cdot 2=\\frac{6}{5}$ m/s."
    ],
    "trap": "Thinking the string is let out at the kite's horizontal speed $2$; only the fraction $\\frac{x}{L}$ of the horizontal motion lengthens the string.",
    "check": "The string speed must be less than the kite's speed $2$: $\\frac{6}{5}<2$."
  },
  "dd-imp-007": {
    "spot": "Split $\\ln(xy)$ into $\\ln x+\\ln y$ first, then differentiate implicitly; the whole equation becomes just $\\frac{1}{x}+\\frac{y'}{y}+y'=0$.",
    "why": "Use the log property first to avoid a Product Rule on $xy$ that you then divide back out. $y$ cannot be solved for, so implicit differentiation is the way.",
    "steps": [
      "The point $(1,1)$ is on the curve: $\\ln 1+1=1$.",
      "$\\ln x+\\ln y+y=1$; differentiate in $x$: $\\frac{1}{x}+\\frac{y'}{y}+y'=0$. The partial derivatives with respect to $x$ and $y$ are $\\frac{1}{x}$ and $\\frac{1}{y}+1$.",
      "Plug in $(1,1)$: $1+y'+y'=0$, $y'=-\\frac{1}{2}$."
    ],
    "trap": "Differentiating $\\ln y$ to $\\frac{1}{y}$ and dropping $y'$, so the equation becomes $1+1+y'=0$ and you get $-2$.",
    "check": "Take a small step along the tangent to $(1.01,\\,0.995)$; the left side is still about $1$."
  },
  "dd-inv-003": {
    "spot": "The Product Rule on $x\\arcsin x$ produces $\\frac{x}{\\sqrt{1-x^2}}$, and the derivative of $\\sqrt{1-x^2}$ is exactly $-\\frac{x}{\\sqrt{1-x^2}}$ — the two terms are designed to cancel.",
    "why": "When $\\arcsin$ comes paired with $\\sqrt{1-x^2}$, expect a cancellation; this is also exactly the answer to $\\int\\arcsin x\\,dx$.",
    "steps": [
      "$(x\\arcsin x)'=\\arcsin x+\\frac{x}{\\sqrt{1-x^2}}$.",
      "$\\left(\\sqrt{1-x^2}\\right)'=\\frac{-2x}{2\\sqrt{1-x^2}}=-\\frac{x}{\\sqrt{1-x^2}}$.",
      "Add them: the fraction terms cancel, leaving $\\arcsin x$."
    ],
    "trap": "Missing the inner $-2x$ when differentiating $\\sqrt{1-x^2}$ and writing $\\frac{1}{2\\sqrt{1-x^2}}$, so nothing cancels.",
    "check": "At $x=0$ the derivative is $\\arcsin 0=0$: the original function is flat near $0$."
  },
  "dd-log-008": {
    "spot": "Products, quotients and roots all piled together: use logarithmic differentiation. Products and quotients become sums and differences, powers become coefficients, and each of the three factors is differentiated once.",
    "why": "The Quotient Rule plus the Product Rule would fill a page; after taking $\\ln$, each factor contributes a single term $\\frac{\\text{coefficient}}{\\text{factor}}$.",
    "steps": [
      "$\\ln f=2\\ln(x+1)+\\frac{1}{2}\\ln(x-1)-4\\ln(x+3)$ ($x>1$).",
      "Differentiate both sides in $x$: $\\frac{f'}{f}=\\frac{2}{x+1}+\\frac{1}{2(x-1)}-\\frac{4}{x+3}$.",
      "Multiply back by $f$: $f'=\\frac{(x+1)^2\\sqrt{x-1}}{(x+3)^4}\\left(\\frac{2}{x+1}+\\frac{1}{2(x-1)}-\\frac{4}{x+3}\\right)$."
    ],
    "trap": "Forgetting to multiply back by $f$ at the end and giving $\\frac{f'}{f}$ as the answer.",
    "check": "At $x=5$: the bracket is $\\frac{2}{6}+\\frac{1}{8}-\\frac{4}{8}<0$, so the function is decreasing there."
  },
  "dd-opt-004": {
    "spot": "Shortest distance from a point to the parabola $y=x^2$: the squared distance $x^2+(x^2-3)^2$ contains only $x^2$, so $u=x^2$ turns it into a quadratic.",
    "why": "Square to remove the root, then set $u=x^2$ to drop the quartic to a quadratic; completing the square or differentiating takes one step.",
    "steps": [
      "$D=x^2+(x^2-3)^2$; let $u=x^2\\ge 0$: $D=u+(u-3)^2$.",
      "$\\frac{dD}{du}=1+2(u-3)=0$, $u=\\frac{5}{2}$ ($x=\\pm\\sqrt{5/2}$).",
      "$D=\\frac{5}{2}+\\frac{1}{4}=\\frac{11}{4}$, distance $\\frac{\\sqrt{11}}{2}$."
    ],
    "trap": "Looking only at the vertex $x=0$ and answering $3$; the parabola curves up toward $(0,3)$ on both sides, and points there are closer.",
    "check": "Much shorter than the vertex distance $3$: $\\frac{\\sqrt{11}}{2}\\approx 1.66$."
  },
  "dd-opt-006": {
    "spot": "Cylinder inscribed in a sphere: half-height $h$, radius $r$ and the sphere's radius form a right triangle $r^2+h^2=9$. Writing the volume $V=\\pi r^2\\cdot 2h$ in terms of $h$ avoids roots.",
    "why": "With $h$ as the variable, $V=2\\pi h(9-h^2)$ is a cubic polynomial, easier to differentiate than the $\\sqrt{9-r^2}$ you get using $r$.",
    "steps": [
      "$V(h)=\\pi(9-h^2)\\cdot 2h=2\\pi(9h-h^3)$, $0<h<3$.",
      "$V'(h)=2\\pi(9-3h^2)=0$, $h=\\sqrt{3}$; $V''<0$, so it is a maximum.",
      "$r^2=9-3=6$, height $2\\sqrt{3}$: $V=\\pi\\cdot 6\\cdot 2\\sqrt{3}=12\\sqrt{3}\\pi$."
    ],
    "trap": "Taking the cylinder's height as $h$ (not $2h$) while still using $r^2+h^2=9$, which makes the cylinder reach only to the center, giving $6\\sqrt{3}\\pi$.",
    "check": "It should be less than the sphere's volume $36\\pi$: $12\\sqrt{3}\\pi\\approx 20.8\\pi$, about $58\\%$."
  },
  "dd-opt-007": {
    "spot": "Poster area fixed at $xy=384$, printed area $(x-8)(y-12)$ ($8$ off left and right combined, $12$ off top and bottom): eliminate a variable with $y=\\frac{384}{x}$, then differentiate.",
    "why": "The constraint is a product; substituting gives $480-12x-\\frac{3072}{x}$, and one derivative solves for $x$.",
    "steps": [
      "Width $x$, height $\\frac{384}{x}$: $P(x)=(x-8)\\left(\\frac{384}{x}-12\\right)=480-12x-\\frac{3072}{x}$.",
      "$P'(x)=-12+\\frac{3072}{x^2}=0$, $x^2=256$, $x=16$; $P''<0$, so it is a maximum.",
      "Width $16$, height $24$, printed area $8\\times 12=96$ square cm."
    ],
    "trap": "Subtracting the margin on one side only, writing $(x-4)(y-6)$, which makes the answer too big.",
    "check": "Try another width, say $x=12$ (height $32$): $4\\times 20=80<96$."
  },
  "dd-opt-012": {
    "spot": "Norman window: a rectangle of width $2r$ and height $h$ topped by a semicircle of radius $r$. The perimeter is only three sides plus the arc, $2h+2r+\\pi r=10$; use it to eliminate $h$.",
    "why": "After substitution the area is a quadratic in $r$, $10r-\\left(2+\\frac{\\pi}{2}\\right)r^2$, and its vertex is the maximum.",
    "steps": [
      "$h=\\frac{10-(2+\\pi)r}{2}$, area $A=2rh+\\frac{\\pi r^2}{2}=10r-\\left(2+\\frac{\\pi}{2}\\right)r^2$.",
      "$A'(r)=10-(4+\\pi)r=0$, $r=\\frac{10}{4+\\pi}$.",
      "$A=10r-\\frac{4+\\pi}{2}r^2=\\frac{100}{4+\\pi}-\\frac{50}{4+\\pi}=\\frac{50}{4+\\pi}$."
    ],
    "trap": "Counting the rectangle's top edge (covered by the semicircle) in the perimeter, writing $2h+4r+\\pi r=10$.",
    "check": "At the optimum $h=r$: the rectangle's height equals the semicircle's radius, the classic result for this problem."
  },
  "dd-opt-013": {
    "spot": "The rectangle's diagonal is the log's diameter: $w^2+h^2=900$. The target $wh^2$ lets you replace $h^2$ by $900-w^2$, giving a cubic in $w$.",
    "why": "Using $w$ as the variable avoids roots completely; using $h$ would bring in $\\sqrt{900-h^2}$.",
    "steps": [
      "$S(w)=w(900-w^2)=900w-w^3$, $0<w<30$.",
      "$S'(w)=900-3w^2=0$, $w=10\\sqrt{3}$; $S''<0$, so it is a maximum.",
      "$h^2=900-300=600$, $S=10\\sqrt{3}\\cdot 600=6000\\sqrt{3}$."
    ],
    "trap": "Using the radius $15$ as the diagonal and writing $w^2+h^2=225$, which makes the answer off by a factor of $8$.",
    "check": "The best ratio is $h:w=\\sqrt{2}:1$, taller than wide — strength goes with the square of the height, so of course you make it tall."
  },
  "dd-par-003": {
    "spot": "Slope of a parametric curve: $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$. Both components are $e^t$ times a trig function, and after the Product Rule the $e^t$ cancels.",
    "why": "No need to eliminate $t$ to get $y(x)$; divide the two derivatives and the common factor $e^t$ disappears.",
    "steps": [
      "$\\frac{dx}{dt}=e^t(\\cos t-\\sin t)$, which is $-e^{\\pi/2}$ at $t=\\frac{\\pi}{2}$.",
      "$\\frac{dy}{dt}=e^t(\\sin t+\\cos t)$, which is $e^{\\pi/2}$ at $t=\\frac{\\pi}{2}$.",
      "Divide: $\\frac{dy}{dx}=\\frac{e^{\\pi/2}}{-e^{\\pi/2}}=-1$."
    ],
    "trap": "Flipping numerator and denominator to compute $\\frac{dx/dt}{dy/dt}$; here it happens to also be $-1$, but in general it is wrong.",
    "check": "The general formula $\\frac{\\sin t+\\cos t}{\\cos t-\\sin t}$ at $\\frac{\\pi}{2}$ gives $\\frac{1}{-1}$."
  },
  "dd-rr-004": {
    "spot": "The water in an inverted cone is also a cone, and its surface radius is proportional to its depth, $r=\\frac{h}{2}$ — use similarity to write $V$ in terms of $h$ alone, then differentiate in time.",
    "why": "Eliminate $r$ before differentiating so you do not have both $r'$ and $h'$; $V=\\frac{\\pi h^3}{12}$ needs just one Chain Rule.",
    "steps": [
      "Similarity: $\\frac{r}{h}=\\frac{2}{4}$, $r=\\frac{h}{2}$; $V=\\frac{1}{3}\\pi\\left(\\frac{h}{2}\\right)^2h=\\frac{\\pi h^3}{12}$.",
      "$V'=\\frac{\\pi h^2}{4}h'$; at $h=2$, $\\frac{dV}{dh}=\\pi$.",
      "$3=\\pi h'$, $h'=\\frac{3}{\\pi}$ m/min."
    ],
    "trap": "Treating $r$ as the constant $2$ (the tank's top radius) and differentiating $V=\\frac{4\\pi}{3}h$, getting $\\frac{9}{4\\pi}$.",
    "check": "At depth $2$ the water surface has area $\\pi\\cdot 1^2=\\pi$, with $3$ flowing in per minute, so the rise rate $=\\frac{3}{\\text{surface area}}$."
  },
  "dd-rr-007": {
    "spot": "The rope, the dock height $6$ and the boat's horizontal distance $x$ to the dock form a right triangle: $L^2=x^2+36$. Pulling in the rope means $L'=-2$; the question asks for $x'$.",
    "why": "Differentiating in time gives $LL'=xx'$; plug in $x=8$, $L=10$ and solve in one step. The boat moves faster than the rope is pulled because the rope is slanted.",
    "steps": [
      "At $x=8$, $L=\\sqrt{64+36}=10$.",
      "$L=\\sqrt{x^2+36}$, $\\frac{dL}{dx}=\\frac{x}{L}=\\frac{4}{5}$.",
      "$L'=\\frac{x}{L}x'$: $-2=\\frac{4}{5}x'$, $x'=-\\frac{5}{2}$; the boat approaches at $\\frac{5}{2}$ m/s."
    ],
    "trap": "Thinking the boat moves at the rope speed $2$; the rope is slanted, so the horizontal speed is divided by $\\frac{x}{L}$.",
    "check": "The boat must be faster than the rope: $\\frac{5}{2}>2$."
  },
  "depth-int-009": {
    "spot": "Inside the $\\sin$ is $\\ln x$: substitute $x=e^u$ so $\\ln x$ becomes $u$ and $dx=e^udu$ — giving the classic $\\int e^u\\sin u\\,du$.",
    "why": "After substitution it is exponential times trig; integrating by parts twice loops back to the original, and solving that equation gives the answer. Integrating $\\sin(\\ln x)$ by parts directly also works, but the substitution makes the structure clearer.",
    "steps": [
      "Let $x=e^u$: $dx=e^u\\,du$, $\\int\\sin(\\ln x)\\,dx=\\int e^u\\sin u\\,du$.",
      "Two rounds of integration by parts loop back: $\\int e^u\\sin u\\,du=\\frac{e^u(\\sin u-\\cos u)}{2}+C$.",
      "Back to $x$: $e^u=x$, $u=\\ln x$, giving $\\frac{x\\left(\\sin(\\ln x)-\\cos(\\ln x)\\right)}{2}+C$."
    ],
    "trap": "Forgetting $dx=e^u\\,du$ in the substitution, ending up with $\\int\\sin u\\,du=-\\cos(\\ln x)$.",
    "check": "Definite integral: $\\int_1^{e}\\sin(\\ln x)\\,dx=\\frac{e(\\sin 1-\\cos 1)+1}{2}$."
  },
  "dm-seq-001": {
    "spot": "The recursion $a_{n+1}=a_n+\\frac{1}{a_n}$ makes $a_n$ hard to handle directly; squaring gives $a_{n+1}^2=a_n^2+2+\\frac{1}{a_n^2}$, roughly adding $2$ each step, so $a_n^2\\approx 2n$.",
    "why": "Squaring turns the recursion into addition, so the $n$ steps can be summed; the Squeeze Theorem then controls the extra $\\frac{1}{a_k^2}$.",
    "steps": [
      "Square it out: $\\left(a+\\frac{1}{a}\\right)^2=a^2+2+\\frac{1}{a^2}$.",
      "Sum $n-1$ steps: $a_n^2=1+2(n-1)+\\sum_{k=1}^{n-1}\\frac{1}{a_k^2}\\ge 2n-1$, so $a_n\\to\\infty$.",
      "Upper bound: $a_k^2\\ge 2k-1\\ge k$, so $\\sum_{k=1}^{n-1}\\frac{1}{a_k^2}\\le\\sum_{k=1}^{n-1}\\frac{1}{k}\\le 1+\\ln n$, giving $a_n^2\\le 2n+\\ln n$.",
      "Squeeze: $\\frac{2n-1}{n}\\le\\frac{a_n^2}{n}\\le\\frac{2n+\\ln n}{n}$, and both sides tend to $2$.",
      "So $\\frac{a_n}{\\sqrt{n}}\\to\\sqrt{2}$."
    ],
    "trap": "Thinking the sum of the $\\frac{1}{a_n^2}$ changes the limit; it only grows like $\\ln n$, which vanishes after dividing by $n$.",
    "check": "Compute up to $n=4$: $a_4=\\frac{29}{10}$, $\\frac{a_4}{\\sqrt{4}}=1.45$, already close to $\\sqrt{2}\\approx 1.414$."
  }
};
