// Detail v2, English — batch 021. Translation of tools/content/detail/021.js (text only; claims live in the Chinese file).
module.exports = {
  "fd-limx-603": {
    "spot": "Base $\\frac{\\tan x}{x}\\to1$, exponent $\\frac{1}{x^2}\\to\\infty$: a $1^\\infty$ form. Take logs first to get $\\frac{\\ln(\\tan x/x)}{x^2}$.",
    "why": "You cannot apply L'Hôpital's Rule directly to a power form. After taking logs, the Taylor expansion $x+\\frac{x^3}{3}$ of $\\tan x$ gives the leading term of the numerator in one line.",
    "steps": [
      "The base tends to $1$ and the exponent to infinity: set $L=\\lim\\frac{\\ln(\\tan x/x)}{x^2}$; the answer is $e^L$.",
      "$\\tan x=x+\\frac{x^3}{3}+O(x^5)$, so $\\frac{\\tan x}{x}=1+\\frac{x^2}{3}+O(x^4)$.",
      "$\\ln(1+u)\\approx u$ with $u=\\frac{x^2}{3}$: $L=\\lim\\frac{x^2/3}{x^2}=\\frac13$.",
      "So the limit is $e^{1/3}$."
    ],
    "trap": "Seeing the base tend to $1$ and answering $1$: $1^\\infty$ is an indeterminate form, and a fast-growing exponent amplifies the tiny amount by which the base exceeds $1$.",
    "check": "Plug in $x=0.01$: $\\left(\\frac{\\tan x}{x}\\right)^{1/x^2}\\approx1.3956$, and $e^{1/3}\\approx1.3956$."
  },
  "fd-serb-605": {
    "spot": "$4^n=2^{2n}$ together with the $2n+1$ in the denominator: this is the odd-power series $\\sum\\frac{y^{2n+1}}{2n+1}$ at $y=\\frac12$, which equals $\\frac12\\ln\\frac{1+y}{1-y}$.",
    "why": "Only odd powers, with the power in the denominator: $\\ln(1+y)-\\ln(1-y)$ cancels the even terms and doubles the odd ones, giving exactly this shape.",
    "steps": [
      "Rewrite: $\\frac{1}{(2n+1)4^n}=2\\cdot\\frac{(1/2)^{2n+1}}{2n+1}$.",
      "$\\ln(1+y)-\\ln(1-y)=2\\sum_{n\\ge0}\\frac{y^{2n+1}}{2n+1}$, so $\\sum\\frac{y^{2n+1}}{2n+1}=\\frac12\\ln\\frac{1+y}{1-y}$.",
      "Plug in $y=\\frac12$: $\\frac12\\ln\\frac{3/2}{1/2}=\\frac12\\ln3$.",
      "Multiply back by $2$: the sum is $\\ln 3$."
    ],
    "trap": "Seeing $\\frac{1}{4^n}$ and applying $\\sum\\frac{x^n}{n}=-\\ln(1-x)$ to get $\\ln\\frac43$: the denominator is $2n+1$, not $n$, and $n$ starts at $0$.",
    "check": "The first three terms $1+\\frac1{12}+\\frac1{80}\\approx1.0958$ are already very close to $\\ln3\\approx1.0986$, and since all terms are positive the partial sum can only be below the total."
  },
  "fd-serx-406": {
    "spot": "First split $\\frac{1}{n(n+1)}$ into $\\frac1n-\\frac1{n+1}$; with the $\\frac{1}{2^n}$ attached, it becomes two known power series $\\sum\\frac{x^n}{n}$ and $\\sum\\frac{x^n}{n+1}$ at $x=\\frac12$.",
    "why": "With the $2^n$ weights it no longer telescopes, but both series can be written straight from $-\\ln(1-x)=\\sum\\frac{x^n}{n}$.",
    "steps": [
      "Partial fractions: $\\frac{1}{n(n+1)}=\\frac1n-\\frac1{n+1}$.",
      "$\\sum_{n\\ge1}\\frac{x^n}{n}=-\\ln(1-x)$; $x=\\frac12$ gives $\\ln2$.",
      "$\\sum_{n\\ge1}\\frac{x^n}{n+1}=\\frac1x\\left(-\\ln(1-x)-x\\right)$; $x=\\frac12$ gives $2\\ln2-1$.",
      "Subtract: $\\ln2-(2\\ln2-1)=1-\\ln2$."
    ],
    "trap": "After splitting, expecting it to telescope like $\\sum\\frac{1}{n(n+1)}$ and leave only the first term, giving $\\frac12$: each term is multiplied by a different $\\frac{1}{2^n}$, so nothing cancels.",
    "check": "The first term is $\\frac14$ and the rest are positive; the sum $1-\\ln2\\approx0.307$ is a bit more than $\\frac14$. Reasonable."
  },
  "gap-der-param-003": {
    "spot": "Parametric $x=t$, $y=t^2$: the second derivative is $\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)\\div\\frac{dx}{dt}$. Here $x=t$, so it is really just $y=x^2$.",
    "why": "The most common slip with parametric second derivatives is differentiating in $t$ and forgetting to divide by $\\frac{dx}{dt}$ again. Following the formula step by step is safest.",
    "steps": [
      "$\\frac{dy}{dt}=2t$, $\\frac{dx}{dt}=1$, so $\\frac{dy}{dx}=2t$.",
      "$\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)=\\frac{d}{dt}(2t)=2$.",
      "Divide by $\\frac{dx}{dt}=1$: $\\frac{d^2y}{dx^2}=2$."
    ],
    "trap": "Writing $\\frac{y''(t)}{x''(t)}=\\frac{2}{0}$ and concluding it does not exist: the second derivative is not a ratio of two second derivatives.",
    "check": "Eliminate the parameter: $y=x^2$, whose second derivative is $2$."
  },
  "ig-num-002": {
    "spot": "Midpoint Rule with $n=4$: $\\Delta x=\\frac14$; add the function values at the midpoints $\\frac18,\\frac38,\\frac58,\\frac78$ and multiply by $\\Delta x$.",
    "why": "The problem specifies the Midpoint Rule, so use $M_n=\\Delta x\\sum f(\\text{midpoint})$; do not answer with the true value $\\frac13$.",
    "steps": [
      "$\\Delta x=\\frac{1-0}{4}=\\frac14$, midpoints $\\frac18,\\frac38,\\frac58,\\frac78$.",
      "Squares: $\\frac{1}{64},\\frac{9}{64},\\frac{25}{64},\\frac{49}{64}$, summing to $\\frac{84}{64}$.",
      "Multiply by $\\Delta x$: $\\frac14\\cdot\\frac{84}{64}=\\frac{21}{64}$."
    ],
    "trap": "Using the left endpoints $0,\\frac14,\\frac12,\\frac34$ and getting $\\frac{7}{32}$: that is the left Riemann sum, not the Midpoint Rule.",
    "check": "True value $\\frac13\\approx0.333$; the Midpoint Rule gives $0.328$, slightly less: $x^2$ is concave up, so the Midpoint Rule underestimates."
  },
  "ig-num-008": {
    "spot": "Midpoint Rule with $n=2$ on $[0,2]$: $\\Delta x=1$, midpoints $\\frac12$ and $\\frac32$.",
    "why": "Only two pieces, so just evaluate at the midpoints; no need to find the true value first.",
    "steps": [
      "$\\Delta x=\\frac{2-0}{2}=1$, midpoints $\\frac12,\\frac32$.",
      "$f\\left(\\frac12\\right)=\\frac18$, $f\\left(\\frac32\\right)=\\frac{27}{8}$.",
      "$M_2=1\\cdot\\left(\\frac18+\\frac{27}{8}\\right)=\\frac{28}{8}=\\frac72$."
    ],
    "trap": "Taking $\\Delta x$ as $\\frac12$ (thinking the interval has length $1$) and getting $\\frac74$.",
    "check": "True value $\\int_0^2x^3\\,dx=4$; $x^3$ is concave up on $[0,2]$, so the Midpoint Rule's $3.5$ underestimates — right direction."
  },
  "ig-num-010": {
    "spot": "$f(x)=\\frac1x$ on $[1,2]$ has $f''=\\frac{2}{x^3}>0$, concave up. The Midpoint Rule effectively replaces the curve with the tangent line at the midpoint, and the curve lies entirely above that tangent.",
    "why": "The direction of the Midpoint Rule's error depends only on concavity: concave up underestimates, concave down overestimates. No need to compute.",
    "steps": [
      "$f''(x)=\\frac{2}{x^3}>0$, concave up on $[1,2]$.",
      "On each piece, the midpoint rectangle has the same area as the trapezoid under the tangent line through the midpoint; a concave-up curve lies above its tangent, so each piece comes up a little short.",
      "Actually computing: $M_4=\\frac14\\left(\\frac{1}{1.125}+\\frac{1}{1.375}+\\frac{1}{1.625}+\\frac{1}{1.875}\\right)\\approx0.6912<\\ln2\\approx0.6931$.",
      "Answer: underestimate."
    ],
    "trap": "Carrying over the Trapezoidal Rule's conclusion and saying overestimate: for concave up the Trapezoidal Rule overestimates and the Midpoint Rule underestimates — exactly opposite.",
    "check": "The Trapezoidal Rule $T_4\\approx0.6970$ is above the true value and the Midpoint Rule below, so the true value is bracketed."
  },
  "int-010": {
    "spot": "Odd power of $\\sin$: give one $\\sin x$ to $d(\\cos x)$, write the remaining $\\sin^2x=1-\\cos^2x$, and substitute $u=\\cos x$ to get a polynomial.",
    "why": "For an odd power, pulling one factor out and substituting is fastest. The power-reduction identity $\\sin^3x=\\frac{3\\sin x-\\sin3x}{4}$ also works, but you have to remember it.",
    "steps": [
      "$\\sin^3x=(1-\\cos^2x)\\sin x$.",
      "Let $u=\\cos x$, $du=-\\sin x\\,dx$: the integral becomes $-\\int(1-u^2)\\,du$.",
      "$-\\left(u-\\frac{u^3}{3}\\right)=-\\cos x+\\frac{\\cos^3x}{3}$.",
      "So $\\int\\sin^3x\\,dx=-\\cos x+\\frac{\\cos^3x}{3}+C$."
    ],
    "trap": "Using the power rule to write $\\frac{\\sin^4x}{4}$: its derivative is $\\sin^3x\\cos x$, with an extra $\\cos x$.",
    "check": "Check with a definite integral: $\\int_0^\\pi\\sin^3x\\,dx=\\left(1-\\frac13\\right)-\\left(-1+\\frac13\\right)=\\frac43$."
  },
  "int-019": {
    "spot": "There is a $\\sqrt x$ in the denominator: let $u=\\sqrt x$ ($x=u^2$, $dx=2u\\,du$) to remove the root and get a rational function.",
    "why": "The numerator is not the derivative of the denominator, so the log form fails. Once the root is gone, $\\frac{2u}{1+u}$ splits with one long division.",
    "steps": [
      "Let $u=\\sqrt x$, $x=u^2$, $dx=2u\\,du$.",
      "The integral becomes $\\int\\frac{2u}{1+u}\\,du=\\int\\left(2-\\frac{2}{1+u}\\right)du$.",
      "$=2u-2\\ln(1+u)$; substitute back $u=\\sqrt x$.",
      "So the answer is $2\\sqrt x-2\\ln(1+\\sqrt x)+C$."
    ],
    "trap": "Writing $\\ln(1+\\sqrt x)$ directly: its derivative is $\\frac{1}{2\\sqrt x(1+\\sqrt x)}$, with an extra $\\frac{1}{2\\sqrt x}$.",
    "check": "Definite integral: $\\int_0^1\\frac{dx}{1+\\sqrt x}=2-2\\ln2\\approx0.614$."
  },
  "int-022": {
    "spot": "The integrand is $1$: $\\iint_D1\\,dA$ is just the area of $D$, and $D$ is the right triangle with vertices $(0,0),(2,0),(0,2)$.",
    "why": "A double integral of the constant $1$ is just an area; even as iterated-integral practice it takes one line.",
    "steps": [
      "Fix $x$; $y$ runs from $0$ to $2-x$, so the inner integral gives the length $2-x$.",
      "Outer: $\\int_0^2(2-x)\\,dx=4-2=2$.",
      "Matches the triangle's area $\\frac12\\cdot2\\cdot2=2$; the answer is $2$."
    ],
    "trap": "Writing the inner upper limit as $2$ and getting the square's area $4$.",
    "check": "Triangle area formula: $\\frac12\\cdot$ base $\\cdot$ height $=\\frac12\\cdot2\\cdot2$."
  },
  "lb-sim-003": {
    "spot": "On $[0,1)$, $\\lfloor5x\\rfloor$ breaks into five pieces, constant $0,1,2,3,4$: a simple function, so the integral is the sum of value times measure over the pieces.",
    "why": "The Lebesgue integral of a simple function is a weighted sum; the single endpoint $x=1$ has measure $0$ and does not matter.",
    "steps": [
      "For $x\\in\\left[\\frac k5,\\frac{k+1}5\\right)$, $\\lfloor5x\\rfloor=k$, $k=0,1,2,3,4$; each piece has measure $\\frac15$.",
      "Integral $=\\frac15(0+1+2+3+4)=\\frac{10}{5}$.",
      "Answer $2$ (in general $\\int_0^1\\lfloor nx\\rfloor\\,d\\mu=\\frac{n-1}{2}$)."
    ],
    "trap": "Taking the values to be $1$ through $5$ and getting $3$: the first piece $\\left[0,\\frac15\\right)$ has value $0$.",
    "check": "$\\lfloor5x\\rfloor=5x-\\{5x\\}$, and the fractional part averages $\\frac12$: $\\int_0^15x\\,dx-\\frac12=\\frac52-\\frac12=2$."
  },
  "lb-sim-004": {
    "spot": "$\\lfloor4x\\rfloor$ takes $0,1,2,3$ on four pieces; squared that is $0,1,4,9$: a simple function, so multiply each value by the measure $\\frac14$ and add.",
    "why": "Square on each piece first, then take the weighted average; simple functions need no limits at all.",
    "steps": [
      "For $x\\in\\left[\\frac k4,\\frac{k+1}4\\right)$, $\\lfloor4x\\rfloor^2=k^2$; each piece has measure $\\frac14$.",
      "Weighted sum: $\\frac14(0+1+4+9)=\\frac{14}{4}$.",
      "Answer $\\frac72$."
    ],
    "trap": "Integrating first and then squaring: $\\left(\\frac{0+1+2+3}{4}\\right)^2=\\frac94$. The average of the squares is not the square of the average.",
    "check": "Sum-of-squares formula: $\\frac14\\sum_{k=0}^{3}k^2=\\frac14\\cdot\\frac{3\\cdot4\\cdot7}{6}=\\frac{14}{4}$."
  },
  "lm-nr-004": {
    "spot": "$\\sqrt[n]{n!}$ against $n$: after taking logs it is $-\\frac1n\\sum\\ln\\frac kn$, a Riemann sum.",
    "why": "The $n$th root of a factorial is hard to estimate directly. Logs turn the product into a sum, and dividing by $n$ gives exactly a Riemann sum for $\\int_0^1\\ln x\\,dx$.",
    "steps": [
      "$\\ln\\frac{n}{\\sqrt[n]{n!}}=\\ln n-\\frac1n\\sum_{k=1}^n\\ln k=-\\frac1n\\sum_{k=1}^n\\ln\\frac kn$ (e.g. both sides agree for $n=3$).",
      "This is a Riemann sum for $-\\int_0^1\\ln x\\,dx$, and $\\int_0^1\\ln x\\,dx=-1$.",
      "The log tends to $1$, so the original limit is $e$."
    ],
    "trap": "Estimating $n!$ as $n^n$, thinking $\\sqrt[n]{n!}\\approx n$ and the limit is $1$: in fact $n!\\approx\\left(\\frac ne\\right)^n\\sqrt{2\\pi n}$, and the missing $e^n$ leaves $e$ after the $n$th root.",
    "check": "$n=10$: $\\frac{10}{\\sqrt[10]{3628800}}\\approx2.21$, slowly climbing toward $e\\approx2.718$."
  },
  "lm-rc-001": {
    "spot": "Recursion $a_{n+1}=\\sqrt{2+a_n}$: monotone and bounded means convergent, and the limit $L$ satisfies the fixed-point equation $L=\\sqrt{2+L}$.",
    "why": "You must establish convergence before solving for the fixed point. It increases and is capped by $2$, so the Monotone Convergence Theorem settles it in one sentence.",
    "steps": [
      "Increasing: $a_2=\\sqrt{2+\\sqrt2}>\\sqrt2=a_1$, and $a_n<a_{n+1}$ implies $a_{n+1}<a_{n+2}$.",
      "Bounded above: $a_n<2$ implies $a_{n+1}<\\sqrt{2+2}=2$. So it converges.",
      "$L=\\sqrt{2+L}\\Rightarrow L^2-L-2=0\\Rightarrow L=2$ or $-1$; all terms are positive, so discard $-1$.",
      "The limit is $2$."
    ],
    "trap": "Keeping both roots of the quadratic, or solving without first checking convergence: $-1$ cannot be the limit of a positive sequence.",
    "check": "In fact $a_n=2\\cos\\frac{\\pi}{2^{n+1}}$: $a_1=2\\cos\\frac\\pi4=\\sqrt2$, $a_2=2\\cos\\frac\\pi8=\\sqrt{2+\\sqrt2}$, tending to $2\\cos0=2$."
  },
  "lm-rc-007": {
    "spot": "$a_{n+1}=\\cos a_n$: fixed-point iteration, with limit the solution of $\\cos L=L$; $|\\cos'x|=|\\sin x|\\le\\sin1<1$ guarantees a contraction.",
    "why": "$\\cos L=L$ has no closed-form solution, so it must be found numerically. The contraction mapping theorem guarantees convergence and uniqueness at once, and the answer does not depend on the starting point.",
    "steps": [
      "$\\cos$ maps $[0,1]$ into $[\\cos1,1]\\subset[0,1]$; the start $\\frac12$ is inside, so every later term stays in $[0,1]$.",
      "On $[0,1]$, $|\\cos'x|=|\\sin x|\\le\\sin1\\approx0.84<1$: a contraction, so the sequence converges to the unique fixed point.",
      "Solve $\\cos L-L=0$ with Newton's method: starting from $0.75$, one step lands near $0.73911$.",
      "The limit is $L\\approx0.7390851332$, satisfying $\\cos L=L$."
    ],
    "trap": "Calculator in degree mode: repeatedly pressing $\\cos$ settles near $0.99985$, the solution of $\\cos L^\\circ=L$.",
    "check": "The sequence jumps back and forth across the limit: $a_2=\\cos0.5\\approx0.878$ is above, $a_3\\approx0.639$ is below."
  },
  "mob-nabla-010": {
    "spot": "Circulation form $\\oint_CP\\,dx+Q\\,dy=\\iint_D\\left(\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}\\right)dA$: the integrand is the curl in the plane.",
    "why": "Circulation is about flowing around along the tangent direction, which corresponds to curl; only the flux form (along the normal) uses the divergence $\\frac{\\partial P}{\\partial x}+\\frac{\\partial Q}{\\partial y}$.",
    "steps": [
      "Example $P=-y$, $Q=x$: $\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}=1-(-1)=2$.",
      "Compute the circulation directly along the unit circle $x=\\cos t$, $y=\\sin t$: $\\int_0^{2\\pi}(\\sin^2t+\\cos^2t)\\,dt=2\\pi$.",
      "The area integral $\\iint 2\\,dA=2\\cdot\\pi$; the two sides agree.",
      "Answer: the scalar curl (the 2D curl, i.e. the $z$-component of the 3D curl) $\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}$."
    ],
    "trap": "Choosing the divergence $\\frac{\\partial P}{\\partial x}+\\frac{\\partial Q}{\\partial y}$: in the example above the divergence is $0$, yet the circulation is clearly $2\\pi$.",
    "check": "The rotational field $(-y,x)$ turns counterclockwise at every point, so the circulation is a positive $2\\pi$; for the radial field $(x,y)$, the curl is $0$ and the circulation is $0$ too."
  },
  "mob-tech-006": {
    "spot": "Inside the root is $a^2-x^2$: let $x=a\\sin\\theta$ and use $1-\\sin^2\\theta=\\cos^2\\theta$ to take the root.",
    "why": "The substitution $u=a^2-x^2$ needs an $x$ in the numerator, and there is none. A trigonometric substitution turns the whole integrand into $1$.",
    "steps": [
      "$x=a\\sin\\theta$: $\\sqrt{a^2-a^2\\sin^2\\theta}=a\\cos\\theta$.",
      "$dx=a\\cos\\theta\\,d\\theta$, so the integrand becomes $\\frac{a\\cos\\theta}{a\\cos\\theta}=1$ and the integral is $\\theta=\\arcsin\\frac xa$.",
      "Check with $a=2$: $\\int_0^1\\frac{dx}{\\sqrt{4-x^2}}=\\arcsin\\frac12=\\frac\\pi6$.",
      "Answer: trigonometric substitution ($x=a\\sin\\theta$)."
    ],
    "trap": "Setting $u=a^2-x^2$: $du=-2x\\,dx$, but there is no $x$ in the numerator, so the substitution does not go through.",
    "check": "$\\left(\\arcsin\\frac x2\\right)'$ at $x=1$ is $\\frac{1}{\\sqrt3}$, the same as $\\frac{1}{\\sqrt{4-1}}$."
  },
  "mob-tech-010": {
    "spot": "The problem names $f(x)+f(1-x)$: the substitution $x\\to1-x$ gives $\\int_0^1f(x)\\,dx=\\int_0^1f(1-x)\\,dx$, and adding the two leaves only that sum.",
    "why": "The integrand itself may have no formula for its antiderivative, but the paired sum is simple; this trick needs no antiderivative at all.",
    "steps": [
      "Substitute $x\\to1-x$: $\\int_0^1f(x)\\,dx=\\int_0^1f(1-x)\\,dx$ (the limits flip and the minus sign cancels).",
      "Add the two: $2I=\\int_0^1\\left[f(x)+f(1-x)\\right]dx$.",
      "Example: $f(x)=\\frac{x^2}{x^2+(1-x)^2}$, $f(x)+f(1-x)=1$, so $I=\\frac12$.",
      "Answer: King's property (the symmetric substitution $x\\to a+b-x$, then add)."
    ],
    "trap": "Forcing out an antiderivative of $\\frac{x^2}{x^2+(1-x)^2}$: you get a string of $\\arctan$ and $\\ln$ terms, a lot of work and easy to get wrong.",
    "check": "It works on a general interval $[a,b]$ too: $\\int_0^{\\pi/2}\\sin^2x\\,dx=\\int_0^{\\pi/2}\\cos^2x\\,dx$, and their sum is $\\frac\\pi2$, so each is $\\frac\\pi4$."
  },
  "mob-tech-017": {
    "spot": "$\\int_0^{\\pi/2}\\sin^nx\\,dx$ with a general power $n$: integration by parts lowers $n$ to $n-2$, giving the recursion $W_n=\\frac{n-1}{n}W_{n-2}$.",
    "why": "Power-reduction identities need several layers of expansion and blow up for large $n$; the recursion just steps down to $W_0=\\frac\\pi2$ or $W_1=1$.",
    "steps": [
      "$u=\\sin^{n-1}x$, $dv=\\sin x\\,dx$; the boundary terms are $0$ at both $0$ and $\\frac\\pi2$. Using $\\cos^2=1-\\sin^2$ gives $W_n=(n-1)(W_{n-2}-W_n)$.",
      "Rearrange: $W_n=\\frac{n-1}{n}W_{n-2}$.",
      "Starting values $W_0=\\frac\\pi2$, $W_1=1$; for example $W_4=\\frac34\\cdot\\frac12\\cdot\\frac\\pi2=\\frac{3\\pi}{16}$.",
      "Answer: the Wallis recursion (reduction formula)."
    ],
    "trap": "Forgetting the final factor $\\frac\\pi2$ for even powers, or multiplying by an extra $\\frac\\pi2$ for odd powers: writing $W_4$ as $\\frac38$ or $W_5$ as $\\frac{8\\pi}{30}$.",
    "check": "$\\int_0^{\\pi/2}\\sin^nx\\,dx=\\int_0^{\\pi/2}\\cos^nx\\,dx$, so the same recursion works for $\\cos^n$."
  },
  "mob-trap-012": {
    "spot": "In $B(a,b)=\\frac{\\Gamma(a)\\Gamma(b)}{\\Gamma(a+b)}$, the part most often written wrong is the denominator: it is $\\Gamma$ evaluated at $a+b$, not $\\Gamma(a)+\\Gamma(b)$ and not $\\Gamma(ab)$.",
    "why": "Checking with a pair of small integers shows what the denominator must be — more reliable than rote memory.",
    "steps": [
      "Take $a=2$, $b=3$: $B(2,3)=\\int_0^1x(1-x)^2\\,dx=\\frac1{12}$.",
      "$\\Gamma(n)=(n-1)!$: $\\frac{\\Gamma(2)\\Gamma(3)}{\\Gamma(5)}=\\frac{1\\cdot2}{24}=\\frac1{12}$, which matches.",
      "Wrong denominators: $\\Gamma(ab)=\\Gamma(6)=120$ gives $\\frac1{60}$; $\\Gamma(a)+\\Gamma(b)=3$ gives $\\frac23$. Neither works.",
      "Answer: the trap is in the denominator, which must be $\\Gamma(a+b)$."
    ],
    "trap": "Writing the denominator as $\\Gamma(ab)$ or $\\Gamma(a)+\\Gamma(b)$; or treating $\\Gamma(n)$ as $n!$ (off by one).",
    "check": "$B(1,1)=\\int_0^11\\,dx=1$, and $\\frac{\\Gamma(1)\\Gamma(1)}{\\Gamma(2)}=\\frac{1\\cdot1}{1}=1$."
  },
  "ode-lin-008": {
    "spot": "$y'+y=\\sin x$ is first-order linear: the integrating factor $e^{\\int1\\,dx}=e^x$ turns the left side into $(e^xy)'$.",
    "why": "With the nonhomogeneous term $\\sin x$, separation of variables fails; the integrating factor makes the equation directly integrable in one step.",
    "steps": [
      "Multiply by $e^x$: $(e^xy)'=e^x\\sin x$.",
      "$\\int e^x\\sin x\\,dx=\\frac{e^x(\\sin x-\\cos x)}{2}+C$.",
      "$y=\\frac{\\sin x-\\cos x}{2}+Ce^{-x}$; $y(0)=-\\frac12+C=0$, $C=\\frac12$.",
      "$y=\\frac{\\sin x-\\cos x+e^{-x}}{2}$."
    ],
    "trap": "Forgetting $Ce^{-x}$ and writing only the steady-state solution $\\frac{\\sin x-\\cos x}{2}$: it equals $-\\frac12$ at $x=0$, which fails the initial condition.",
    "check": "Substitute back: $y'+y=\\sin x$ holds at every point."
  },
  "ode-val-003": {
    "spot": "Rearrange $y'=x+y$ to $y'-y=x$: first-order linear with integrating factor $e^{-x}$.",
    "why": "The right side has both $y$ and $x$, so it cannot be separated; the integrating factor for a linear equation is the standard procedure.",
    "steps": [
      "Multiply by $e^{-x}$: $(e^{-x}y)'=xe^{-x}$.",
      "$\\int xe^{-x}\\,dx=-(x+1)e^{-x}+C$, so $y=-(x+1)+Ce^x$.",
      "$y(0)=-1+C=1$, $C=2$: $y=2e^x-x-1$.",
      "$y(1)=2e-2$."
    ],
    "trap": "Writing only the homogeneous solution $y=Ce^x$ with $C=1$ and getting $y(1)=e$: the particular solution $-x-1$ is missing.",
    "check": "$y''=1+y'>0$, so the solution is concave up; one Euler step $y(1)\\approx1+1\\cdot(0+1)=2$ should underestimate, and indeed $2<3.44$."
  },
  "refine-integrals-032": {
    "spot": "$\\int_0^1tf(t)\\,dt$ is a constant independent of $x$: call it $c$, so $f(x)=x+c$, then plug this form back in to solve for $c$.",
    "why": "Differentiating the equation would kill $c$ and lose a condition; naming the constant and requiring consistency is fastest.",
    "steps": [
      "Let $c=\\int_0^1tf(t)\\,dt$; then $f(x)=x+c$.",
      "Plug back in: $c=\\int_0^1t(t+c)\\,dt=\\frac13+\\frac c2$.",
      "Solving gives $\\frac c2=\\frac13$, $c=\\frac23$.",
      "$f(1)=1+\\frac23=\\frac53$."
    ],
    "trap": "Taking $f(t)$ as just $t$ when computing $c$, giving $c=\\frac13$ and $f(1)=\\frac43$: $f$ itself contains $c$.",
    "check": "Consistency: $\\int_0^1t\\left(t+\\frac23\\right)dt=\\frac13+\\frac13=\\frac23$, exactly $c$."
  },
  "rel-hard-lim-008": {
    "spot": "The expression depends only on $x^2+y^2$: let $u=x^2+y^2\\to0^+$, and it becomes the one-variable $\\frac{e^u-1}{u}$.",
    "why": "The function depends only on the distance, so every direction is the same and there are no paths to test; what remains is the derivative of $e^u$ at $0$.",
    "steps": [
      "$(x,y)\\to(0,0)$ is equivalent to $u=x^2+y^2\\to0^+$.",
      "$\\frac{e^u-1}{u}$ is the difference quotient of $e^u$ at $0$, with limit $(e^u)'|_{u=0}=1$.",
      "So the limit is $1$."
    ],
    "trap": "Thinking every two-variable limit must be checked path by path and getting stuck trying $y=mx$, $y=x^2$ one by one; this one depends only on $x^2+y^2$, and one substitution finishes it.",
    "check": "At $u=0.0001$, $\\frac{e^u-1}{u}\\approx1.00005$."
  },
  "sg-est-002": {
    "spot": "The alternating harmonic series $\\sum\\frac{(-1)^{n+1}}{n}$ satisfies the Alternating Series Test: with $n$ terms, the error is at most the first omitted term $\\frac{1}{n+1}$.",
    "why": "The alternating-series error bound only needs the next term; you do not need to know the sum is $\\ln2$.",
    "steps": [
      "$|S-S_n|\\le a_{n+1}=\\frac{1}{n+1}$.",
      "Need $\\frac1{n+1}<0.01$, i.e. $n+1>100$. $n=99$ gives exactly $0.01$, which is not less than.",
      "$n=100$ gives $\\frac1{101}<0.01$, which works.",
      "Take at least $100$ terms."
    ],
    "trap": "Solving $\\frac1{n+1}\\le0.01$ with equality allowed and answering $99$: the problem asks for strictly less than.",
    "check": "The sum is $\\ln2=\\int_0^1\\frac{dx}{1+x}$; needing a hundred terms just to guarantee two decimal places means very slow convergence."
  },
  "si-int-020": {
    "spot": "Quotient $\\frac{\\ln x}{x}$: by the Quotient Rule $f'=\\frac{1-\\ln x}{x^2}$. The denominator is always positive, so only the sign of the numerator $1-\\ln x$ matters.",
    "why": "With $x^2>0$ in the denominator, the sign is decided entirely by $1-\\ln x$, one inequality to solve; do not forget the domain $x>0$.",
    "steps": [
      "$f'(x)=\\frac{\\frac1x\\cdot x-\\ln x}{x^2}=\\frac{1-\\ln x}{x^2}$.",
      "$f'>0\\iff\\ln x<1\\iff x<e$; the numerator changes sign at $x=e$.",
      "Check both sides: increasing at $x=2$, decreasing at $x=3$.",
      "The domain is $x>0$, so the answer: increasing on $(0,e)$."
    ],
    "trap": "Forgetting $\\ln x$ is defined only for $x>0$ and writing $(-\\infty,e)$.",
    "check": "$f(1)=0<f(e)=\\frac1e$, so it does go up on $(1,e)$."
  },
  "tb-arc-002": {
    "spot": "The derivative of $y=\\frac{x^2}{2}$ is $x$: the arc length is $\\int_0^1\\sqrt{1+x^2}\\,dx$, the standard $\\sqrt{1+x^2}$ integral.",
    "why": "Choosing $\\frac{x^2}{2}$ is exactly what makes $1+(y')^2=1+x^2$ clean. Use $x=\\sinh t$ or the known formula $\\frac{x\\sqrt{1+x^2}+\\ln(x+\\sqrt{1+x^2})}{2}$.",
    "steps": [
      "$y'=x$, arc length $L=\\int_0^1\\sqrt{1+x^2}\\,dx$.",
      "Antiderivative $\\frac{x\\sqrt{1+x^2}+\\ln\\left(x+\\sqrt{1+x^2}\\right)}{2}$.",
      "Value at $1$ minus value at $0$: $\\frac{\\sqrt2+\\ln(1+\\sqrt2)}{2}$.",
      "Answer $\\frac{\\sqrt2+\\ln(1+\\sqrt2)}{2}\\approx1.148$."
    ],
    "trap": "Putting $y$ instead of $y'$ in the arc length formula: $\\int_0^1\\sqrt{1+\\frac{x^4}{4}}\\,dx$ is the length of a different curve.",
    "check": "The arc length must exceed the chord length $\\sqrt{1+\\frac14}\\approx1.118$ and be shorter than the broken line $1+\\frac12$."
  },
  "tr-bnd-001": {
    "spot": "Lagrange remainder $|R_2(x)|\\le\\frac{M}{3!}|x|^3$; the third derivative of $e^x$ is still $e^x$, whose maximum on $[0,1]$ is $e$.",
    "why": "$e^x$ is increasing, so its maximum is at the right endpoint and $M$ is immediate.",
    "steps": [
      "$f'''(x)=e^x$.",
      "$e^x$ is increasing, so on $[0,1]$, $M=e^1=e$.",
      "Error bound $\\frac{e}{3!}\\cdot1^3=\\frac e6$."
    ],
    "trap": "Using $f'''(0)=1$ as $M$ and getting $\\frac16\\approx0.167$: the actual error $e-2.5\\approx0.218$ is bigger, so this is not a bound.",
    "check": "The actual error $e-\\left(1+1+\\frac12\\right)\\approx0.218$ is indeed within the bound $\\frac e6\\approx0.453$."
  },
  "tr-bnd-002": {
    "spot": "The remainder of a third-degree polynomial uses the fourth derivative: $|R_3|\\le\\frac{M}{4!}|x|^4$. The fourth derivative of $e^x$ is still $e^x$, with maximum $e$ on $[0,1]$.",
    "why": "Every derivative of $e^x$ is the same and increasing, so take $M$ at the right endpoint.",
    "steps": [
      "$f^{(4)}(x)=e^x$.",
      "$M=\\max_{[0,1]}e^x=e$.",
      "Error bound $\\frac{e}{4!}\\cdot1^4=\\frac{e}{24}$."
    ],
    "trap": "Writing $3!$ in the denominator (following the degree $3$) and getting $\\frac e6$: the remainder for a third-degree polynomial is $\\frac{f^{(4)}(c)}{4!}x^4$.",
    "check": "The actual error $e-\\frac83\\approx0.0516$ is within $\\frac{e}{24}\\approx0.113$."
  },
  "tr-bnd-003": {
    "spot": "The fourth derivative of $\\sin x$ comes back to $\\sin x$; on $[0,1]$, $\\sin$ is increasing, so $M=\\sin1$. Remainder $\\frac{M}{4!}|x|^4$.",
    "why": "The problem specifies $M$ as the maximum on $[0,1]$, not the rough estimate $|\\sin|\\le1$.",
    "steps": [
      "$(\\sin x)''=-\\sin x$, and two more derivatives bring it back to $\\sin x$: $f^{(4)}=\\sin x$.",
      "$\\sin$ is increasing on $[0,1]$ ($\\cos x>0$), so $M=\\sin1$.",
      "Error bound $\\frac{\\sin1}{4!}\\cdot1^4=\\frac{\\sin1}{24}$."
    ],
    "trap": "Using $|\\sin|\\le1$ to get $\\frac1{24}$: a valid bound, but not the $M$ the problem specifies.",
    "check": "The actual error $\\sin1-\\frac56\\approx0.0081$ is within $\\frac{\\sin1}{24}\\approx0.035$."
  },
  "tr-bnd-005": {
    "spot": "The third derivative of $e^{-x}$ is $-e^{-x}$, whose absolute value $e^{-x}$ is decreasing: on $\\left[0,\\frac12\\right]$ the maximum is at the left endpoint $x=0$, so $M=1$.",
    "why": "A decreasing function has its maximum at the left endpoint; do not reach for the right endpoint out of habit.",
    "steps": [
      "$f'''(x)=-e^{-x}$, $|f'''|=e^{-x}$.",
      "$e^{-x}$ is decreasing, so $M=e^0=1$.",
      "Error bound $\\frac{1}{3!}\\left(\\frac12\\right)^3=\\frac1{48}$."
    ],
    "trap": "Taking $M$ at the right endpoint, $e^{-1/2}$, and getting $\\frac{e^{-1/2}}{48}\\approx0.0126$: smaller than the actual error $0.0185$, so not a bound.",
    "check": "$T_2\\left(\\frac12\\right)=1-\\frac12+\\frac18=\\frac58$, and the actual error $\\frac58-e^{-1/2}\\approx0.0185<\\frac1{48}\\approx0.0208$."
  },
  "tr-err-001": {
    "spot": "The question wants the actual error, not a bound: compute $T_3(1)=1+1+\\frac12+\\frac16=\\frac83$ directly and subtract it from $e$.",
    "why": "The true value $e$ is known, so subtracting directly is most precise; the Lagrange remainder only gives a range.",
    "steps": [
      "$T_3(x)=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}$, $T_3(1)=\\frac83$.",
      "$e>\\frac83$ (all remaining terms are positive), so the error is $e-\\frac83$.",
      "$|e-T_3(1)|=e-\\frac83\\approx0.0516$."
    ],
    "trap": "Handing in the Lagrange bound $\\frac{e}{24}$: the question asks how far off it actually is, not how far off it could be at most.",
    "check": "The remainder is $\\frac{e^c}{24}$ with $c\\in(0,1)$, so the actual error lies between $\\frac1{24}$ and $\\frac e{24}$."
  },
  "tr-err-002": {
    "spot": "The third-degree Taylor polynomial of $\\sin x$ is $x-\\frac{x^3}{6}$; the actual error is just $\\sin\\frac12$ minus $T_3\\left(\\frac12\\right)$.",
    "why": "The problem asks for the actual error, so compute the difference directly; the Taylor series alternates and decreases, so the sign is obvious too.",
    "steps": [
      "$T_3\\left(\\frac12\\right)=\\frac12-\\frac{1}{48}=\\frac{23}{48}$.",
      "The next nonzero term $+\\frac{x^5}{120}$ is positive, so $\\sin\\frac12>\\frac{23}{48}$.",
      "Actual error $\\sin\\frac12-\\frac{23}{48}\\approx0.000259$."
    ],
    "trap": "Writing $\\frac{x^3}{3!}$ as $\\frac{x^3}{3}$, giving $T_3\\left(\\frac12\\right)=\\frac{11}{24}$ and an error almost eighty times too large.",
    "check": "The error is roughly the next term $\\frac{(1/2)^5}{120}=\\frac{1}{3840}\\approx0.00026$, and slightly less than it."
  },
  "tr-num-005": {
    "spot": "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$ at $x=\\frac12$ is an alternating, decreasing series: the error is at most the next term $\\frac{(1/2)^{n+1}}{n+1}$.",
    "why": "The alternating-series bound is the simplest and here gives the same number as the Lagrange remainder; try $n$ upward from small values.",
    "steps": [
      "$n=3$: next term $\\frac{(1/2)^4}{4}=\\frac1{64}\\approx0.0156>0.01$, not guaranteed.",
      "And $n=3$ really is not enough: $T_3\\left(\\frac12\\right)=\\frac5{12}$, $\\frac5{12}-\\ln\\frac32\\approx0.0112$.",
      "$n=4$: $\\frac{(1/2)^5}{5}=\\frac1{160}\\approx0.00625<0.01$, which works (actual error $0.0044$).",
      "The smallest degree is $4$."
    ],
    "trap": "Seeing $T_3\\left(\\frac12\\right)\\approx0.417$ close to $\\ln1.5\\approx0.405$ and assuming $n=3$ suffices: the difference is $0.0112$, still above $0.01$.",
    "check": "$T_4\\left(\\frac12\\right)=\\frac5{12}-\\frac1{64}\\approx0.4010$, within $0.005$ of $\\ln1.5\\approx0.4055$."
  },
  "tr-val-004": {
    "spot": "Just recall the coefficients of $\\ln(1+x)$: $x-\\frac{x^2}{2}+\\frac{x^3}{3}$, then plug in $x=\\frac12$.",
    "why": "This comes from integrating the geometric series $\\frac1{1+x}$ term by term; the coefficients are $\\frac{(-1)^{k+1}}{k}$, with no extra factorial to divide by.",
    "steps": [
      "$f(0)=0$, $f'(0)=1$, $f''(0)=-1$, $f'''(0)=2$: coefficients $1,-\\frac12,\\frac{2}{3!}=\\frac13$.",
      "$T_3(x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}$.",
      "$T_3\\left(\\frac12\\right)=\\frac{12-3+1}{24}=\\frac{10}{24}=\\frac5{12}$."
    ],
    "trap": "Dividing the already-correct coefficient $\\frac13$ by $3!$ again, writing $\\frac{x^3}{18}$; or treating $\\frac{x^3}{3}$ as $\\frac{x^3}{3!}$ and getting $\\frac{19}{48}$.",
    "check": "$\\ln1.5\\approx0.4055$; an alternating series stopped on a positive term overestimates, and $\\frac5{12}\\approx0.4167$ is above."
  },
  "tr-val-006": {
    "spot": "The Taylor series of $\\frac1{1-x}$ is the geometric series $1+x+x^2+x^3+\\cdots$: $T_3$ takes the first four terms.",
    "why": "No derivatives needed; the geometric series coefficients are all $1$.",
    "steps": [
      "$T_3(x)=1+x+x^2+x^3$.",
      "Plug in $0.2$: $1+0.2+0.04+0.008=1.248$.",
      "$1.248=\\frac{156}{125}$."
    ],
    "trap": "Answering with the true value $\\frac1{0.8}=1.25$: $T_3$ stops at $x^3$ and misses $\\frac{x^4}{1-x}=0.002$.",
    "check": "The true value minus $T_3$ is exactly the geometric tail $\\frac{x^4}{1-x}$."
  },
  "tr-val-007": {
    "spot": "No need to differentiate $e^{-x^2}$ repeatedly: substitute $u=-x^2$ into $e^u=1+u+\\frac{u^2}{2}+\\cdots$; up to $x^4$ that is $1-x^2+\\frac{x^4}{2}$.",
    "why": "Four derivatives of $e^{-x^2}$ are tedious; substituting into a known series takes one line.",
    "steps": [
      "$e^u=1+u+\\frac{u^2}{2}+\\cdots$; with $u=-x^2$: $T_4(x)=1-x^2+\\frac{x^4}{2}$.",
      "Plug in $x=\\frac12$: $1-\\frac14+\\frac{1}{32}$.",
      "$=\\frac{32-8+1}{32}=\\frac{25}{32}$."
    ],
    "trap": "Writing $\\frac{u^2}{2}$ as $\\frac{x^4}{4!}$ (out of the habit of dividing the fourth-degree term by $4!$) and getting $1-\\frac14+\\frac1{384}$.",
    "check": "$e^{-1/4}\\approx0.7788$, $\\frac{25}{32}=0.78125$; the gap is smaller than the next term $\\frac{(1/2)^6}{6}$."
  },
  "vc-surf-001": {
    "spot": "On the upper hemisphere $z=\\sqrt{1-x^2-y^2}$ the area element is $dS=\\frac{1}{z}\\,dA$: multiplied by the integrand $z$ it cancels, leaving just the area of the projected disk.",
    "why": "Faster than spherical coordinates with $\\int\\cos\\varphi\\sin\\varphi$; the cancellation of $z$ and $\\frac1z$ is the point of this problem.",
    "steps": [
      "$dS=\\sqrt{1+z_x^2+z_y^2}\\,dA$; at $(0.6,0)$, $z_x=-\\frac{0.6}{0.8}=-0.75$ and $\\sqrt{1+0.75^2}=\\frac{1}{0.8}=\\frac1z$.",
      "In general $1+\\frac{x^2+y^2}{z^2}=\\frac{z^2+x^2+y^2}{z^2}=\\frac1{z^2}$, so $z\\,dS=dA$.",
      "The integral becomes the area of the unit disk: $\\iint_{x^2+y^2\\le1}dA=\\pi$."
    ],
    "trap": "Treating $dS$ as $dA$ and computing $\\iint\\sqrt{1-x^2-y^2}\\,dA=\\frac{2\\pi}{3}$: that is the volume of the hemisphere.",
    "check": "Spherical coordinates: $z=\\cos\\varphi$, $dS=\\sin\\varphi\\,d\\varphi\\,d\\theta$, $2\\pi\\int_0^{\\pi/2}\\cos\\varphi\\sin\\varphi\\,d\\varphi=\\pi$."
  },
  "an-ls-003": {
    "spot": "$\\sin n$ is always $\\le1$, and because $\\pi$ is irrational, the remainders of $n$ modulo $2\\pi$ are dense in $[0,2\\pi)$: infinitely many $n$ make $\\sin n$ arbitrarily close to $1$.",
    "why": "The limit superior is the largest subsequential limit; it does not need to actually hit $1$, only to approach it infinitely often.",
    "steps": [
      "Upper bound: $\\sin n\\le1$, so $\\limsup\\le1$.",
      "$\\{n\\bmod2\\pi\\}$ is dense, so infinitely many $n$ land near $\\frac\\pi2$: e.g. $n=8$, $n=33$.",
      "For any $\\varepsilon>0$, $\\sin n>1-\\varepsilon$ holds infinitely often, so the limit superior is $1$."
    ],
    "trap": "Thinking that since $n$ never exactly equals $\\frac\\pi2+2k\\pi$, the limit superior is less than $1$: it only has to be approached infinitely often, not reached.",
    "check": "Likewise the limit inferior is $-1$: $\\sin 11\\approx-1.00$."
  },
  "an-sr-003": {
    "spot": "The bound is already given as $\\frac{1}{\\ln N}$: solve $\\frac1{\\ln N}<0.1$, i.e. $N>e^{10}$.",
    "why": "The Integral Test tail estimate turns the problem into solving an inequality; the key point is that $e^{10}\\approx22026.47$ is not an integer, so round up.",
    "steps": [
      "$\\left(-\\frac1{\\ln x}\\right)'=\\frac{1}{x(\\ln x)^2}$, so $\\int_N^\\infty\\frac{dx}{x(\\ln x)^2}=\\frac1{\\ln N}$.",
      "$\\frac1{\\ln N}<0.1\\iff\\ln N>10\\iff N>e^{10}\\approx22026.47$.",
      "$N=22026$ is not enough; $N=22027$ works.",
      "The smallest $N$ is $22027$."
    ],
    "trap": "Rounding $e^{10}\\approx22026.47$ down to $22026$: there $\\frac1{\\ln N}$ is still slightly above $0.1$.",
    "check": "Extremely slow convergence: over twenty thousand terms just to guarantee an error of $0.1$, because the tail shrinks only like $\\frac1{\\ln N}$."
  },
  "an-sup-008": {
    "spot": "Look at the continuous version $g(x)=x^{1/x}$: $\\ln g=\\frac{\\ln x}{x}$ is maximized at $x=e$, so among integers you only need to compare $n=2$ and $n=3$.",
    "why": "For the maximum of an integer sequence, find the peak of the continuous function first, then compare the integers on either side of it.",
    "steps": [
      "$\\left(\\frac{\\ln x}{x}\\right)'=\\frac{1-\\ln x}{x^2}$: increasing for $x<e$, decreasing for $x>e$.",
      "$e$ lies between $2$ and $3$: compare $\\sqrt2\\approx1.414$ and $\\sqrt[3]3\\approx1.442$.",
      "Decreasing for $n\\ge3$, and $n=1$ gives $1$: the maximum is at $n=3$, and the supremum is that maximum $\\sqrt[3]{3}$.",
      "$\\sup S=3^{1/3}$."
    ],
    "trap": "Answering with the continuous maximum $e^{1/e}\\approx1.4447$: $e$ is not a natural number, so that value is never attained and is not the supremum.",
    "check": "For large $n$, $n^{1/n}\\to1$; e.g. $1000^{1/1000}\\approx1.007$, far below $\\sqrt[3]3$."
  },
  "an-uc-005": {
    "spot": "The smallest Lipschitz constant of a differentiable function is $\\sup|f'|$ (Mean Value Theorem): find the largest absolute value of $f'=\\frac{1-x^2}{(1+x^2)^2}$.",
    "why": "The Mean Value Theorem gives $|f(x)-f(y)|\\le\\sup|f'|\\cdot|x-y|$, and near where the derivative is largest the difference quotients approach it, so nothing smaller works.",
    "steps": [
      "$f'(x)=\\frac{1-x^2}{(1+x^2)^2}$.",
      "Critical points of $f'$: $x=0,\\pm\\sqrt3$, with $f'(0)=1$, $f'(\\pm\\sqrt3)=-\\frac18$; as $|x|\\to\\infty$, $f'\\to0$.",
      "So $\\sup|f'|=1$, attained at $x=0$.",
      "The smallest Lipschitz constant is $1$."
    ],
    "trap": "Answering with the maximum of $f$ itself, $\\frac12$ (at $x=1$): the Lipschitz constant controls slopes, not function values.",
    "check": "The difference quotient $\\frac{f(h)-f(0)}{h}=\\frac{1}{1+h^2}$ approaches $1$ as $h\\to0$, so $1$ cannot be lowered."
  },
  "burst-boss-int-013": {
    "spot": "$x^a(\\ln x)^k$ on $[0,1]$: substitute $x=e^{-u}$ to get $\\int_0^\\infty u^ke^{-(a+1)u}\\,du$, a Gamma-type integral equal to $\\frac{k!}{(a+1)^{k+1}}$.",
    "why": "Integration by parts would take five rounds. After substitution it is one line — or differentiate $\\int_0^1x^a\\,dx=\\frac1{a+1}$ five times in $a$, equally fast.",
    "steps": [
      "$x=e^{-u}$: $\\ln x=-u$, $dx=-e^{-u}du$, and $x:0\\to1$ corresponds to $u:\\infty\\to0$; $(\\ln x)^5=-u^5$.",
      "$\\int_0^\\infty u^5e^{-3u}\\,du=\\frac{5!}{3^6}=\\frac{120}{729}$.",
      "Attach the minus sign and reduce: $-\\frac{120}{729}=-\\frac{40}{243}$."
    ],
    "trap": "Dropping the minus sign: $\\ln x$ is negative on $(0,1)$ and its fifth power is still negative, so the answer must be negative. Or writing $3^5$ in the denominator and getting $-\\frac{40}{81}$.",
    "check": "Differentiating in the parameter: $\\frac{d^5}{da^5}\\frac{1}{a+1}=-\\frac{120}{(a+1)^6}$, and $a=2$ gives $-\\frac{120}{729}$."
  },
  "db-ftc-006": {
    "spot": "The integrand contains the upper limit's $x$: expand $(x-t)$ and pull $x$ outside the integral before applying the Fundamental Theorem of Calculus.",
    "why": "The Fundamental Theorem only handles integrands without $x$; just substituting $t=x$ misses the contribution of $x$ itself.",
    "steps": [
      "$F(x)=x\\int_0^xe^t\\,dt-\\int_0^xte^t\\,dt$.",
      "Product Rule plus the Fundamental Theorem: $F'(x)=\\int_0^xe^t\\,dt+xe^x-xe^x=e^x-1$.",
      "In fact $F(x)=e^x-x-1$, whose derivative is exactly $e^x-1$.",
      "$F'(1)=e-1$."
    ],
    "trap": "Just replacing $t$ with $x$: $(x-x)e^x=0$, giving $F'=0$. That is wrong when the integrand contains $x$.",
    "check": "$F''(x)=e^x$ is exactly the original integrand's weight at $t=x$: it takes two derivatives to fully peel off $(x-t)$."
  },
  "db-par-006": {
    "spot": "Cycloid in parametric form: $\\frac{dy}{dx}=\\frac{\\sin t}{1-\\cos t}$; for the second derivative, differentiate that in $t$ and then divide by $\\frac{dx}{dt}=1-\\cos t$.",
    "why": "The parametric second-derivative formula is $\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)\\big/\\frac{dx}{dt}$, and neither step can be skipped.",
    "steps": [
      "$\\frac{dx}{dt}=1-\\cos t$, $\\frac{dy}{dt}=\\sin t$.",
      "$\\frac{d}{dt}\\left(\\frac{\\sin t}{1-\\cos t}\\right)=\\frac{\\cos t-1}{(1-\\cos t)^2}=-\\frac{1}{1-\\cos t}$.",
      "Divide by $\\frac{dx}{dt}$: $\\frac{d^2y}{dx^2}=-\\frac{1}{(1-\\cos t)^2}$.",
      "At $t=\\frac\\pi2$: $\\cos t=0$, so the value is $-1$."
    ],
    "trap": "Using $\\frac{y''(t)}{x''(t)}=\\frac{\\cos t}{\\sin t}$, which gives $0$ at $t=\\frac\\pi2$: the second derivative is not a ratio of two second derivatives.",
    "check": "Each arch of the cycloid is concave down, so the second derivative is negative everywhere; the top of the arch $t=\\pi$ gives $-\\frac14$."
  },
  "dd-imp-004": {
    "spot": "The variable appears in both base and exponent: take $\\ln$ of both sides of $x^y=y^x$ to get $y\\ln x=x\\ln y$, then differentiate implicitly.",
    "why": "Neither the power rule nor the exponential rule applies when both base and exponent vary; taking logs turns it into a product.",
    "steps": [
      "The point $(2,4)$ is on the curve: $4\\ln2=2\\ln4$.",
      "$F=y\\ln x-x\\ln y$: $F_x=\\frac yx-\\ln y$, $F_y=\\ln x-\\frac xy$; at $(2,4)$ these are $2-2\\ln2$ and $\\ln2-\\frac12$.",
      "$\\frac{dy}{dx}=-\\frac{F_x}{F_y}=\\frac{2\\ln2-2}{\\ln2-\\frac12}$.",
      "Multiply top and bottom by $2$: $\\frac{4\\ln2-4}{2\\ln2-1}\\approx-3.18$."
    ],
    "trap": "Applying the power rule to $x^y$ and writing $yx^{y-1}$: that treats $y$ as a constant and ignores that the exponent varies too.",
    "check": "A negative slope makes sense: the branch of $x^y=y^x$ other than $y=x$ passes through $(2,4)$ and $(4,2)$, heading down to the right."
  },
  "dd-rr-010": {
    "spot": "Parallel resistors: $\\frac1R=\\frac1{R_1}+\\frac1{R_2}$; differentiating in time ties the three rates together: $\\frac{R'}{R^2}=\\frac{R_1'}{R_1^2}+\\frac{R_2'}{R_2^2}$.",
    "why": "Differentiating the reciprocal relation directly is cleanest; writing $R$ as $\\frac{R_1R_2}{R_1+R_2}$ and using the Quotient Rule also works but is longer.",
    "steps": [
      "At this moment $R=\\frac{80\\cdot100}{180}=\\frac{400}{9}$.",
      "$R_1'=0.3$, $R_2'=-0.2$ (a decrease carries a minus sign): $\\frac{0.3}{6400}-\\frac{0.2}{10000}=0.000026875$.",
      "$R'=R^2\\cdot0.000026875=\\frac{160000}{81}\\cdot0.000026875=\\frac{43}{810}$."
    ],
    "trap": "Plugging in $+0.2$ even though $R_2$ is decreasing, giving $\\frac{160000}{81}\\cdot\\frac{0.3}{6400}+\\cdots\\approx0.132$; or just adding the two rates and saying $0.1$.",
    "check": "Write both resistances as functions of time and differentiate directly in $t$."
  },
  "dx-rr-003": {
    "spot": "North-south distance $60-15t$, east-west distance $20t$: the distance between the ships is $D=\\sqrt{(60-15t)^2+(20t)^2}$; differentiate at $t=2$.",
    "why": "The ships move in perpendicular directions, so write both components in terms of $t$ and Pythagoras gives the distance.",
    "steps": [
      "$t=2$: north-south gap $30$, east-west gap $40$, distance $50$.",
      "$DD'=(60-15t)(-15)+(20t)(20)$.",
      "$D'=\\frac{30\\cdot(-15)+40\\cdot20}{50}=\\frac{350}{50}=7$."
    ],
    "trap": "Using $+15$ even though the north-south gap is shrinking, getting $\\frac{450+800}{50}=25$.",
    "check": "The distance is smallest at $t=1.44$ (where the derivative is zero) and grows afterwards, so the rate at $t=2$ is positive."
  },
  "fd-limx-606": {
    "spot": "Factor $e^x$ out of the numerator $e^{\\tan x}-e^x$: it becomes $e^x\\cdot\\frac{e^{u}-1}{u}$, where $u=\\tan x-x$ is exactly the denominator.",
    "why": "With L'Hôpital's Rule directly, the denominator $\\sec^2x-1$ is still $0$ and it takes three rounds; factoring out $e^x$ sees through it in one step.",
    "steps": [
      "$e^{\\tan x}-e^x=e^x\\left(e^{\\tan x-x}-1\\right)$.",
      "Let $u=\\tan x-x\\to0$; then $\\frac{e^u-1}{u}\\to1$.",
      "So the limit $=e^0\\cdot1=1$."
    ],
    "trap": "Writing $e^{\\tan x}-e^x$ as $e^{\\tan x-x}$: a misused exponent law, giving $\\frac{e^u}{u}\\to\\infty$.",
    "check": "Mean Value Theorem: $\\frac{e^{\\tan x}-e^x}{\\tan x-x}=e^\\xi$ with $\\xi$ between $x$ and $\\tan x$; at $x=0.1$ it is about $1.10$."
  },
  "lb-lp-005": {
    "spot": "$\\|f\\|_2=\\left(\\int_0^1|f|^2\\right)^{1/2}$, and $|f|^2=x^{-2/3}$: the exponent $\\frac23<1$, so the improper integral converges.",
    "why": "Follow the definition: square, integrate, take the root. The key is checking that $x^{-2/3}$ is integrable near $0$.",
    "steps": [
      "$|f|^2=x^{-2/3}$.",
      "$\\int_0^1x^{-2/3}\\,dx=\\left[3x^{1/3}\\right]_0^1=3$.",
      "Take the root: $\\|f\\|_2=\\sqrt3$."
    ],
    "trap": "Forgetting the final root and answering $3$; or integrating $\\int x^{-1/3}=\\frac32$ (that is the $L^1$ norm).",
    "check": "$f$ is unbounded near $0$ (not in $L^\\infty$) yet is in $L^2$: $2\\cdot\\frac13<1$."
  },
  "lb-sim-007": {
    "spot": "$\\lfloor x\\rfloor$ is the constant $k$ on each $[k,k+1)$, and $x-\\lfloor x\\rfloor=x-k$: split into three pieces, each $k\\int_k^{k+1}(x-k)\\,dx=\\frac k2$.",
    "why": "Integer points have measure $0$; after cutting at the integers, each piece is an ordinary integral of a linear function.",
    "steps": [
      "$[0,1)$: $\\lfloor x\\rfloor=0$, contributing $0$.",
      "$[1,2)$: $\\int_1^2(x-1)\\,dx=\\frac12$; $[2,3)$: $\\int_2^32(x-2)\\,dx=1$.",
      "Total $0+\\frac12+1=\\frac32$."
    ],
    "trap": "Treating $x-\\lfloor x\\rfloor$ as $x$ and computing $\\int\\lfloor x\\rfloor x$: the second piece becomes $\\frac32$ and the third $5$, for a total of $\\frac{13}{2}$.",
    "check": "On each piece the fractional part averages $\\frac12$ and the integer parts are $0,1,2$: $\\frac12(0+1+2)=\\frac32$."
  },
  "lm-rc-003": {
    "spot": "The fixed point of $a_{n+1}=1+\\frac1{a_n}$ satisfies $L=1+\\frac1L$, i.e. $L^2-L-1=0$: the golden ratio. The sequence is the Fibonacci ratios $1,2,\\frac32,\\frac53,\\frac85,\\ldots$",
    "why": "The sequence jumps up and down and is not monotone, but $g(x)=1+\\frac1x$ has $|g'|=\\frac1{x^2}\\le\\frac49<1$ on $[\\frac32,2]$, so it is a contraction and converges.",
    "steps": [
      "First terms: $1,2,\\frac32,\\frac53,\\frac85$, all in $[1,2]$, and from the third term on in $[\\frac32,2]$.",
      "On $[\\frac32,2]$, $|g'(x)|=\\frac1{x^2}\\le\\frac49$: a contraction mapping, so the sequence converges.",
      "$L=1+\\frac1L\\Rightarrow L^2-L-1=0\\Rightarrow L=\\frac{1\\pm\\sqrt5}{2}$; the terms are positive, so take the positive root.",
      "The limit is $\\frac{1+\\sqrt5}{2}\\approx1.618$."
    ],
    "trap": "Taking the negative root $\\frac{1-\\sqrt5}{2}\\approx-0.618$: starting from $1$, every term is $\\ge1$, so it cannot approach a negative number.",
    "check": "$\\frac{8}{5}=1.6$ and $\\frac{13}{8}=1.625$ close in on $1.618$ alternately from either side."
  },
  "lm-st-002": {
    "spot": "$H_n-\\ln n$: the difference between each term $\\frac1k$ and $\\int_k^{k+1}\\frac{dx}{x}$ is positive and the differences have a bounded sum — monotone and bounded, with limit the Euler constant $\\gamma$.",
    "why": "Both pieces diverge, so you cannot take their limits separately. Writing the difference as a series of rectangle minus area under the curve is what reveals convergence.",
    "steps": [
      "$c_k=\\frac1k-\\ln\\left(1+\\frac1k\\right)=\\frac1k-\\int_k^{k+1}\\frac{dx}{x}>0$.",
      "$c_k<\\frac1k-\\frac1{k+1}$, which telescopes to at most $1$: $\\sum c_k$ converges.",
      "$H_n-\\ln n=\\sum_{k=1}^nc_k+\\ln\\frac{n+1}{n}$, and the last term tends to $0$.",
      "The limit is $\\gamma=\\sum_{k\\ge1}c_k\\approx0.5772156649$."
    ],
    "trap": "Thinking the difference of two divergent things must diverge, or that since $H_n\\approx\\ln n$ the difference tends to $0$: it tends to a positive constant.",
    "check": "$n=10$: $H_{10}-\\ln10=\\frac{7381}{2520}-\\ln10\\approx0.626$, about $\\gamma+\\frac1{2n}$."
  },
  "lm-st-004": {
    "spot": "$\\frac1n\\sum_{k=1}^n a_k$ is the average of the first $n$ terms, and $a_k=\\cos\\frac1k\\to1$: the average tends to the same limit (Cesàro).",
    "why": "This is not a Riemann sum (it has $\\frac1k$, not $\\frac kn$). Viewed as an average, the deviation of the first few terms gets diluted by $\\frac1n$.",
    "steps": [
      "$\\cos\\frac1k\\to\\cos0=1$.",
      "Deviation $1-\\cos\\frac1k\\le\\frac{1}{2k^2}$.",
      "The total deviation $\\sum\\frac{1}{2k^2}=\\frac{\\pi^2}{12}$ is finite, so divided by $n$ it tends to $0$.",
      "So the average tends to $1$."
    ],
    "trap": "Treating it as the Riemann sum $\\int_0^1\\cos x\\,dx=\\sin1\\approx0.84$: $\\frac1k$ is not $\\frac kn$, not a partition point.",
    "check": "The average differs from $1$ by at most $\\frac{\\pi^2}{12n}$, under $0.01$ at $n=100$."
  },
  "refine-limits-070": {
    "spot": "$\\frac{(3n)!}{(2n)!}=(2n+1)(2n+2)\\cdots(3n)$ is a product of $n$ numbers: take logs and divide each by $n$ to get a Riemann sum for $\\int_2^3\\ln x\\,dx$.",
    "why": "The $n$th root of a product divided by $n$: after logs it is exactly $\\frac1n\\sum\\ln\\left(2+\\frac jn\\right)$. No need for Stirling.",
    "steps": [
      "$\\ln$ of the expression $=\\frac1n\\sum_{j=1}^n\\ln(2n+j)-\\ln n=\\frac1n\\sum_{j=1}^n\\ln\\left(2+\\frac jn\\right)$ (e.g. both sides agree for $n=2$).",
      "Riemann sum $\\to\\int_2^3\\ln x\\,dx=[x\\ln x-x]_2^3=3\\ln3-2\\ln2-1$.",
      "Exponentiate back: $e^{3\\ln3-2\\ln2-1}=\\frac{27}{4e}$."
    ],
    "trap": "Using the rough estimate $n!\\approx n^n$ and getting $\\frac{27}{4}$: this misses the $e^{-n}$ in Stirling; dividing the $e$ factors of $(3n)!$ and $(2n)!$ still leaves one $e^{-n}$.",
    "check": "Stirling: the $n$th root of $\\frac{(3n/e)^{3n}}{(2n/e)^{2n}}$ is $\\frac{27n}{4e}$; dividing by $n$ gives the same."
  },
  "td-int-001": {
    "spot": "$\\frac{1}{1+x^2}$ paired with $\\cos(3x)$: $\\frac1{1+x^2}$ is the cosine transform of $e^{-t}$, so in reverse $\\int_0^\\infty\\frac{\\cos(ax)}{1+x^2}\\,dx=\\frac\\pi2e^{-a}$.",
    "why": "There is no elementary antiderivative. Contour integration has to switch to $e^{3iz}$ to kill the large semicircle in the upper half-plane, while the cosine-transform pair gets there in one step.",
    "steps": [
      "$\\int_0^\\infty e^{-t}\\cos(xt)\\,dt=\\frac1{1+x^2}$ (e.g. $x=2$ gives $\\frac15$).",
      "Inverse cosine transform: $e^{-a}=\\frac2\\pi\\int_0^\\infty\\frac{\\cos(ax)}{1+x^2}\\,dx$; at $a=0$ this is exactly $\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac\\pi2$.",
      "$I(a)=\\frac\\pi2e^{-a}$ also satisfies $I''=I$, $I(0)=\\frac\\pi2$, and is bounded, consistent with the derivation by differentiating under the integral sign.",
      "$a=3$: $\\frac{\\pi}{2}e^{-3}\\approx0.0782$."
    ],
    "trap": "Using $\\frac{\\cos 3z}{1+z^2}$ directly in a contour integral: $\\cos3z$ blows up exponentially in the upper half-plane, so the large semicircle does not tend to $0$; use $e^{3iz}$ and take the real part.",
    "check": "Larger $a$ means faster oscillation and more cancellation: $0.078$ at $a=3$ is far below $\\frac\\pi2$ at $a=0$."
  },
  "td-int-003": {
    "spot": "$\\frac{e^{-5x}-e^{-2x}}{x}$: a difference of two exponentials divided by $x$, a Frullani integral; it can also be written as $-\\int_2^5e^{-tx}\\,dt$ and the order of integration swapped.",
    "why": "Split into two integrals, each diverges ($\\infty-\\infty$); written as a parametric integral with the order swapped, all that remains is $\\int\\frac{dt}{t}$.",
    "steps": [
      "$\\frac{e^{-5x}-e^{-2x}}{x}=-\\int_2^5e^{-tx}\\,dt$.",
      "Swap the order: $\\int_0^\\infty e^{-tx}\\,dx=\\frac1t$ (e.g. $t=3$).",
      "$-\\int_2^5\\frac{dt}{t}=-\\ln\\frac52=\\ln\\frac25$.",
      "Answer $\\ln\\frac25\\approx-0.916$."
    ],
    "trap": "Flipping numerator and denominator in the Frullani formula $\\ln\\frac ba$ and getting $\\ln\\frac52$: $e^{-5x}<e^{-2x}$, so the integrand is negative everywhere and the answer must be negative.",
    "check": "The integrand tends to $-3$ as $x\\to0$ and is negative everywhere, so the integral is negative."
  },
  "tr-num-001": {
    "spot": "It must be accurate on all of $[0,1]$: the Lagrange remainder $\\frac{e^c}{(n+1)!}x^{n+1}$ is worst at $x=1$ with $c\\to1$, giving the bound $\\frac{e}{(n+1)!}$.",
    "why": "Every derivative of $e^x$ is $e^x$, so $M=e$ is immediate; what remains is trying values of $n$.",
    "steps": [
      "$n=5$: $\\frac{e}{6!}=\\frac{e}{720}\\approx0.0038>0.001$, not guaranteed.",
      "And $n=5$ really is not enough: $e-T_5(1)\\approx0.0016>0.001$.",
      "$n=6$: $\\frac{e}{7!}=\\frac{e}{5040}\\approx0.00054<0.001$, which works.",
      "The smallest degree is $n=6$."
    ],
    "trap": "Writing $n!$ instead of $(n+1)!$ in the remainder: requiring $\\frac{e}{n!}<0.001$ gives $n=7$, one degree more than needed.",
    "check": "The actual error at $n=6$ is $e-T_6(1)\\approx0.00023$, within the bound."
  },
  "vc-green-006": {
    "spot": "Area formula $A=\\frac12\\oint x\\,dy-y\\,dx$; plugging in the ellipse $x=3\\cos t$, $y=2\\sin t$ makes the integrand the constant $6$.",
    "why": "Green's Theorem turns area into a line integral around the boundary; after substituting the parametrization, $\\cos^2+\\sin^2=1$ reduces everything to a constant.",
    "steps": [
      "$dx=-3\\sin t\\,dt$, $dy=2\\cos t\\,dt$.",
      "$x\\,dy-y\\,dx=(6\\cos^2t+6\\sin^2t)\\,dt=6\\,dt$.",
      "$A=\\frac12\\int_0^{2\\pi}6\\,dt=6\\pi$."
    ],
    "trap": "Forgetting the leading $\\frac12$ and getting $12\\pi$.",
    "check": "Ellipse area $\\pi ab=\\pi\\cdot3\\cdot2$."
  },
  "vc-stokes-004": {
    "spot": "The closed triangle lies in the plane $x+y+z=1$: use Stokes' Theorem to compute the surface integral of $\\nabla\\times\\mathbf F$ instead. The curl is $-2(z,x,y)$, and its dot product with the normal is constant on the plane.",
    "why": "Doing it directly means parametrizing three edges; after Stokes the integrand is the constant $-2$ on the plane, so just multiply by the projected area.",
    "steps": [
      "$\\mathbf F=(y^2,z^2,x^2)$, $\\nabla\\times\\mathbf F=(-2z,-2x,-2y)$.",
      "The orientation $(1,0,0)\\to(0,1,0)\\to(0,0,1)$ determines the normal by the right-hand rule: edge vectors $(-1,1,0)\\times(-1,0,1)=(1,1,1)$; $\\mathbf n\\,dS=(1,1,1)\\,dx\\,dy$.",
      "Dot product $-2(x+y+z)=-2$ (since $x+y+z=1$ on the plane).",
      "Projected triangle $x,y\\ge0$, $x+y\\le1$: $\\iint-2\\,dA=-2\\cdot\\frac12=-1$."
    ],
    "trap": "Taking the normal as $(-1,-1,-1)$ and getting $+1$: the direction of traversal must match the normal by the right-hand rule.",
    "check": "Directly along the three edges: the first, $(1-t,t,0)$, gives $\\int_0^1-t^2\\,dt=-\\frac13$; the three are symmetric, for a total of $-1$."
  }
};
