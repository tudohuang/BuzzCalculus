// Detail v2, English — batch 008. Translation of tools/content/detail/008.js (text only; claims live in the Chinese file).
module.exports = {
  "dd-imp-002": {
    "spot": "You can't solve $x^3+y^3=6xy$ for $y=\\cdots$, and you only need the slope at one point $(3,3)$ — implicit differentiation, then plug the point in right away; no need to simplify into a general formula.",
    "why": "Write it as $F(x,y)=0$ and use $\\frac{dy}{dx}=-\\frac{F_x}{F_y}$: just evaluate the two partial derivatives at the point. Much faster than forcing out $y$.",
    "steps": [
      "First check the point is on the curve: $27+27=54=6\\cdot 3\\cdot 3$.",
      "Let $F(x,y)=x^3+y^3-6xy$. Partial in $x$ (treat $y$ as a constant): $F_x=3x^2-6y$; at $(3,3)$ this is $27-18=9$.",
      "Partial in $y$: $F_y=3y^2-6x$; at $(3,3)$ this is $27-18=9$.",
      "$\\frac{dy}{dx}=-\\frac{F_x}{F_y}=-\\frac{9}{9}=-1$."
    ],
    "trap": "Forgetting the Product Rule on $6xy$ and writing just $6y$ (dropping $6x\\,y'$). The denominator then loses a term and the slope comes out wrong.",
    "check": "The curve is symmetric about $y=x$, and $(3,3)$ sits right on that axis, so the tangent must be perpendicular to $y=x$ — slope $-1$, of course."
  },
  "der-012": {
    "spot": "Numerator $\\ln x$, denominator $x^2+1$: one function divided by another — go straight to the Quotient Rule.",
    "why": "Rewriting as the product $\\ln x\\cdot(x^2+1)^{-1}$ also works, but needs an extra Chain Rule step; the Quotient Rule does it in one go.",
    "steps": [
      "Quotient Rule: $\\left(\\frac{u}{v}\\right)'=\\frac{u'v-uv'}{v^2}$ with $u=\\ln x$, $v=x^2+1$.",
      "$u'v=\\frac{x^2+1}{x}$, $uv'=2x\\ln x$.",
      "Subtract and divide by $v^2=(x^2+1)^2$: $\\frac{\\frac{x^2+1}{x}-2x\\ln x}{(x^2+1)^2}$."
    ],
    "trap": "Writing the numerator backwards as $uv'-u'v$ flips the sign of the whole answer. Mnemonic: \"low d-high minus high d-low.\"",
    "check": "Plug in $x=1$: $\\ln 1=0$, so the answer becomes $\\frac{2}{4}=\\frac{1}{2}$, matching the numerical derivative."
  },
  "dm-seq-009": {
    "spot": "An integral of $\\tan^n x$, and the problem hands you $I_n+I_{n-2}$ — split off $\\tan^2x=\\sec^2x-1$ to get a recursion; for the limit of $nI_n$, trap it using the fact that $I_n$ is decreasing.",
    "why": "$I_n$ has no closed form, so you can't compute it directly; the recursion plus monotonicity gives upper and lower bounds, and the Squeeze Theorem finishes it.",
    "steps": [
      "$\\tan^n x+\\tan^{n-2}x=\\tan^{n-2}x\\sec^2x$; with $u=\\tan x$: $\\int_0^1 u^{n-2}\\,du=\\frac{1}{n-1}$.",
      "On $[0,\\frac{\\pi}{4}]$ we have $0\\le\\tan x\\le 1$, so higher powers are smaller: $I_{n+2}\\le I_n\\le I_{n-2}$.",
      "Upper bound: $2I_n\\le I_n+I_{n-2}=\\frac{1}{n-1}$, i.e. $I_n\\le\\frac{1}{2(n-1)}$.",
      "Lower bound: $2I_n\\ge I_n+I_{n+2}=\\frac{1}{n+1}$, i.e. $I_n\\ge\\frac{1}{2(n+1)}$.",
      "Multiply by $n$: $\\frac{n}{2(n+1)}\\le nI_n\\le\\frac{n}{2(n-1)}$. Both sides tend to $\\frac{1}{2}$, so by the Squeeze Theorem the limit is $\\frac{1}{2}$."
    ],
    "trap": "Seeing $I_n\\to 0$ and concluding $nI_n\\to 0$ — this is an $\\infty\\cdot 0$ form; you need to see that $I_n$ is of the same order as $\\frac{1}{n}$.",
    "check": "For $n=13$, $13\\,I_{13}\\approx 0.50$ or so, sitting between $\\frac{13}{28}$ and $\\frac{13}{24}$."
  },
  "dx-thm-001": {
    "spot": "\"Instantaneous velocity equals average velocity\" is exactly the Mean Value Theorem's $s'(c)=\\frac{s(2)-s(0)}{2-0}$: compute the average velocity first, then solve $s'(t)=$ that number.",
    "why": "The Mean Value Theorem only guarantees existence; to find the actual $c$ you solve an equation. Here $s'$ is quadratic, so the quadratic formula gives it directly.",
    "steps": [
      "Average velocity: $s(2)=200-80+60=180$, $s(0)=0$, so $\\frac{180}{2}=90$.",
      "$s'(t)=100t-30t^2+30$; set it equal to $90$: $30t^2-100t+60=0$, i.e. $3t^2-10t+6=0$.",
      "Quadratic formula: $t=\\frac{10\\pm\\sqrt{100-72}}{6}=\\frac{5\\pm\\sqrt{7}}{3}$.",
      "$\\frac{5+\\sqrt{7}}{3}\\approx 2.55$ is outside $[0,2]$, so discard it; keep $t=\\frac{5-\\sqrt{7}}{3}\\approx 0.785$."
    ],
    "trap": "Handing in both roots. The Mean Value Theorem's $c$ must lie in the interval $(0,2)$; $\\frac{5+\\sqrt{7}}{3}$ doesn't count.",
    "check": "Plug back in: $s'(0.785)\\approx 90$."
  },
  "lec-18-q2b": {
    "spot": "Only the edge $x=3$ is asked about — substitute $x=3$ and the two-variable function becomes a one-variable function of $y$; find its max on $[0,2]$.",
    "why": "On a boundary edge you don't need a system of partial derivatives; after substituting you get a straight line, and its slope tells you which end is the max.",
    "steps": [
      "Substitute $x=3$: $f(3,y)=9-6y+2y=9-4y$.",
      "The derivative in $y$ is $-4<0$, so the function decreases all the way across $[0,2]$.",
      "So the max is at the left end $y=0$: $f(3,0)=9$ (the right end gives $f(3,2)=1$)."
    ],
    "trap": "Solving $\\frac{d}{dy}f(3,y)=0$, finding no critical point, and concluding there's no max — the max of a function on a segment can be at an endpoint.",
    "check": "The two endpoint values are $9$ and $1$; take the larger."
  },
  "ode-h2-003": {
    "spot": "$y''-2y'+y=0$ is constant-coefficient and homogeneous, and the characteristic equation $r^2-2r+1=(r-1)^2$ has a repeated root — write the solution as $(A+Bx)e^{x}$; the second solution gets an extra factor of $x$.",
    "why": "Constant-coefficient linear equations mean characteristic equations; with a repeated root, writing only $Ae^x$ loses a solution and you can't match two initial conditions.",
    "steps": [
      "Characteristic equation $r^2-2r+1=0$, $r=1$ (repeated).",
      "General solution $y=(A+Bx)e^{x}$. From $y(0)=1$, $A=1$.",
      "$y'=(A+B+Bx)e^x$, and $y'(0)=A+B=0$, so $B=-1$.",
      "$y=(1-x)e^{x}$; it satisfies the equation when substituted back."
    ],
    "trap": "For a repeated root, writing just $y=Ae^x+Be^x$: that's really only one solution $(A+B)e^x$, and the two initial conditions $y(0)=1$, $y'(0)=0$ then contradict each other.",
    "check": "$y'(0)=0$ and $y''(0)=2y'(0)-y(0)=-1<0$, so $x=0$ is a local max; indeed $(1-x)e^x$ is maximized at $0$."
  },
  "ode-lin-006": {
    "spot": "$y'+\\frac{y}{x}$ is exactly $\\frac{(xy)'}{x}$ — the integrating factor is $x$; multiply through and the left side becomes $(xy)'$.",
    "why": "Standard method for first-order linear equations; here the integrating factor $e^{\\int\\frac{1}{x}dx}=x$ is so clean you can see it without the formula.",
    "steps": [
      "Multiply both sides by $x$: $xy'+y=\\frac{1}{x}$; the left side is $(xy)'$.",
      "Integrate: $xy=\\ln x+C$ (for $x>0$).",
      "$y(1)=0$: $1\\cdot 0=\\ln 1+C$, so $C=0$.",
      "$y=\\frac{\\ln x}{x}$. Check: $y'+\\frac{y}{x}=\\frac{1}{x^2}$."
    ],
    "trap": "Getting the integrating factor as $e^{1/x}$, or forgetting to multiply the right side by $x$ — then $\\frac{1}{x^2}$ stays on the right and integrates to $-\\frac{1}{x}$.",
    "check": "At $x=e$, $y=\\frac{1}{e}$; in the equation $y'(e)=0$ and $\\frac{y}{e}=\\frac{1}{e^2}$, exactly the right side."
  },
  "sg-est-004": {
    "spot": "You need an upper bound for $\\sum_{n=11}^{\\infty}\\frac{1}{n^2}$: for a decreasing function each term $\\frac{1}{n^2}$ is less than $\\int_{n-1}^{n}\\frac{dx}{x^2}$, so integrate starting from $10$.",
    "why": "The series itself needs $\\frac{\\pi^2}{6}$ minus the first ten terms; the integral bound gives a good enough estimate in one line.",
    "steps": [
      "$\\frac{1}{x^2}$ is decreasing, so $\\frac{1}{n^2}\\le\\int_{n-1}^{n}\\frac{dx}{x^2}$.",
      "Sum from $n=11$ to infinity: the little intervals on the right piece together into $\\int_{10}^{\\infty}\\frac{dx}{x^2}$.",
      "$\\int_{10}^{\\infty}\\frac{dx}{x^2}=\\left[-\\frac{1}{x}\\right]_{10}^{\\infty}=\\frac{1}{10}$."
    ],
    "trap": "Integrating from $11$ to $\\infty$ gives $\\frac{1}{11}$ — that's a lower bound, not an upper bound.",
    "check": "The actual tail is about $0.0952$, between $\\frac{1}{11}\\approx 0.0909$ and $\\frac{1}{10}$."
  },
  "sg-est-007": {
    "spot": "\"The fourth partial sum\" just means add the first four terms: $1-\\frac{1}{3}+\\frac{1}{5}-\\frac{1}{7}$, over a common denominator; the $\\frac{\\pi}{4}$ is a distraction.",
    "why": "A partial sum is a finite sum — just add; you don't need the sum of the series.",
    "steps": [
      "First four terms: $n=1,2,3,4$ give $1,-\\frac{1}{3},\\frac{1}{5},-\\frac{1}{7}$.",
      "$1-\\frac{1}{3}=\\frac{2}{3}$, $\\frac{1}{5}-\\frac{1}{7}=\\frac{2}{35}$.",
      "Common denominator $105$: $\\frac{70}{105}+\\frac{6}{105}=\\frac{76}{105}$."
    ],
    "trap": "Flipping the signs of $(-1)^{n+1}$ and getting $-\\frac{76}{105}$; the first term, $n=1$, is positive.",
    "check": "For an alternating series, the even partial sums are below the total: $\\frac{76}{105}\\approx 0.724<\\frac{\\pi}{4}\\approx 0.785$, and the gap is less than the next term $\\frac{1}{9}$."
  },
  "sg-est-010": {
    "spot": "$n^2+n=n(n+1)$ is a product of consecutive numbers — partial fractions give $\\frac{1}{n}-\\frac{1}{n+1}$, which telescopes.",
    "why": "A telescoping series has a closed-form partial sum, so just take the limit; the Comparison Test only says it converges, not what the sum is.",
    "steps": [
      "$\\frac{1}{n^2+n}=\\frac{1}{n}-\\frac{1}{n+1}$.",
      "Partial sum $S_N=\\left(1-\\frac{1}{2}\\right)+\\left(\\frac{1}{2}-\\frac{1}{3}\\right)+\\cdots=1-\\frac{1}{N+1}$.",
      "As $N\\to\\infty$: the sum is $1$."
    ],
    "trap": "Thinking every term is tiny so the sum is tiny, or writing the last piece of $S_N$ as $\\frac{1}{N}$, which gives the wrong limit form.",
    "check": "First two terms: $\\frac{1}{2}+\\frac{1}{6}=\\frac{2}{3}=1-\\frac{1}{3}$, matching $S_2=1-\\frac{1}{3}$."
  },
  "uni-int-018": {
    "spot": "The $x$ in the integrand is exactly half the derivative of $x^2$ — let $u=x^2$, $x\\,dx=\\frac{du}{2}$, and the exponential becomes $e^{-u}$.",
    "why": "When the inner derivative is sitting right there, substitute; integration by parts would only take the long way around.",
    "steps": [
      "Let $u=x^2$, $du=2x\\,dx$; $x:0\\to\\infty$ corresponds to $u:0\\to\\infty$.",
      "$\\frac{1}{2}\\int_0^\\infty e^{-u}\\,du=\\frac{1}{2}\\left[-e^{-u}\\right]_0^\\infty=\\frac{1}{2}$.",
      "So the integral $=\\frac{1}{2}$."
    ],
    "trap": "Confusing it with the Gaussian integral $\\int_0^\\infty e^{-x^2}dx=\\frac{\\sqrt{\\pi}}{2}$. The extra $x$ actually makes it much easier.",
    "check": "The antiderivative $-\\frac{1}{2}e^{-x^2}$ differentiates back to exactly the integrand."
  },
  "an-ca-002": {
    "spot": "Recursion $a_{n+1}=\\frac{1}{3-a_n}$: first show it's monotone and bounded so it converges, then the limit $L$ satisfies $L=\\frac{1}{3-L}$; of the two roots, pick the one in range.",
    "why": "Solving the recursion for a general term is messy; the Monotone Convergence Theorem plus the fixed-point equation only needs one quadratic.",
    "steps": [
      "The first few terms $0,\\frac{1}{3},\\frac{3}{8},\\dots$ increase. Induction: if $0\\le a_n\\le 1$, then $3-a_n\\in[2,3]$, so $a_{n+1}\\in[\\frac{1}{3},\\frac{1}{2}]$ — bounded.",
      "Increasing: $g(t)=\\frac{1}{3-t}$ is increasing on $[0,1]$, so $a_1<a_2$ gives $a_{n}<a_{n+1}$ all the way down.",
      "Monotone and bounded, so it converges; the limit $L$ satisfies $L=\\frac{1}{3-L}$, i.e. $L^2-3L+1=0$, $L=\\frac{3\\pm\\sqrt{5}}{2}$.",
      "$\\frac{3+\\sqrt{5}}{2}\\approx 2.618$ is outside $[0,1]$, so discard it; $L=\\frac{3-\\sqrt{5}}{2}\\approx 0.382$."
    ],
    "trap": "Writing down both roots of the quadratic, or taking the larger root $\\frac{3+\\sqrt{5}}{2}$ — the sequence starts at $0$ and never exceeds $\\frac{1}{2}$.",
    "check": "$L$ is a fixed point: $\\frac{1}{3-L}=L$, and $|g'(L)|=L^2\\approx 0.146<1$, so it's attracting."
  },
  "an-ed-003": {
    "spot": "Invert $|x^3-1|<0.03$ into an interval for $x$: $(0.97^{1/3},\\,1.03^{1/3})$; $\\delta$ is the smaller of the distances from $1$ to the two endpoints.",
    "why": "$x^3$ is convex near $1$, so the distances on the two sides differ; you must compute both and take the smaller, not just one side.",
    "steps": [
      "$0.97<x^3<1.03$; since $x^3$ is increasing, this is equivalent to $0.97^{1/3}<x<1.03^{1/3}$.",
      "Right-side distance: $1.03^{1/3}-1\\approx 0.009902$.",
      "Left-side distance: $1-0.97^{1/3}\\approx 0.010101$, larger than the right side.",
      "Take $\\delta$ to be the smaller, right-side distance: $\\delta=1.03^{1/3}-1$."
    ],
    "trap": "Taking the left-side distance $1-0.97^{1/3}$: then at $x=1+0.0101$, $x^3\\approx 1.0306$, already past $1.03$.",
    "check": "At $x=1+\\delta$, exactly $x^3=1.03$ — right on the boundary."
  },
  "an-ed-004": {
    "spot": "Invert $|x^2+x-2|<0.1$: $x^2+x$ is increasing near $1$, so solve $x^2+x=1.9$ and $x^2+x=2.1$ for the two endpoints; $\\delta$ is the distance to the side closer to $1$.",
    "why": "A quadratic grows at different rates on the two sides; the rough estimate $|x-1||x+2|<0.1$ doesn't give the largest $\\delta$.",
    "steps": [
      "Right endpoint: $x^2+x=2.1$, $x=\\frac{-1+\\sqrt{9.4}}{2}$, distance from $1$ is $\\frac{\\sqrt{9.4}-3}{2}\\approx 0.03297$.",
      "Left endpoint: $x^2+x=1.9$, $x=\\frac{-1+\\sqrt{8.6}}{2}$, distance is $\\frac{3-\\sqrt{8.6}}{2}\\approx 0.03371$.",
      "The right side is closer (the function grows faster to the right), so the right side determines $\\delta$.",
      "$\\delta=\\frac{\\sqrt{9.4}-3}{2}$."
    ],
    "trap": "Taking the left side's $0.0337$: on the right, at $x=1.0337$, $x^2+x\\approx 2.102$, out of range.",
    "check": "At $x=1+\\delta$, $f(x)$ just touches $2.1$."
  },
  "an-int-005": {
    "spot": "The bound $\\frac{f(1)-f(2)}{n}$ is given; just compute $f(1)-f(2)=\\frac{1}{2}$ and find the smallest integer with $\\frac{1/2}{n}<10^{-3}$.",
    "why": "The problem hands you the error bound, so you don't actually compute a lower sum; the key point is the strict inequality.",
    "steps": [
      "$f(1)-f(2)=1-\\frac{1}{2}=\\frac{1}{2}$.",
      "We need $\\frac{1}{2n}<10^{-3}$, i.e. $n>500$.",
      "At $n=500$ it equals $10^{-3}$ exactly, which isn't \"less than\"; the smallest is $n=501$."
    ],
    "trap": "Answering $500$: $\\frac{1}{1000}$ is not less than $10^{-3}$; a strict inequality needs one more.",
    "check": "The actual error of the lower sum is even smaller: at $n=501$ it's far below the bound — the bound is just a guarantee."
  },
  "an-uc-003": {
    "spot": "$\\sin(x^2)$ is bounded and continuous, but oscillates faster as $x$ grows — find two sequences of points whose distance goes to $0$ while the function values always differ by $1$; that breaks uniform continuity.",
    "why": "Bounded doesn't mean uniformly continuous; a counterexample pair of sequences is the most direct way to disprove uniform continuity, cleaner than estimating the derivative (the unbounded derivative $2x\\cos x^2$ is only a hint).",
    "steps": [
      "Take $x_n=\\sqrt{2n\\pi+\\frac{\\pi}{2}}$, $y_n=\\sqrt{2n\\pi}$; then $\\sin x_n^2=1$ and $\\sin y_n^2=0$.",
      "Their distance $x_n-y_n=\\frac{\\pi/2}{x_n+y_n}\\to 0$.",
      "For $\\varepsilon=\\frac{1}{2}$, however small $\\delta$ is, there are points with $|x_n-y_n|<\\delta$ but $|f(x_n)-f(y_n)|=1$.",
      "So $\\sin(x^2)$ is not uniformly continuous on $[0,\\infty)$."
    ],
    "trap": "\"Bounded and continuous, so uniformly continuous\" — boundedness has nothing to do with it. $\\sin x$ is uniformly continuous because its derivative is bounded; the derivative of $\\sin(x^2)$, $2x\\cos(x^2)$, is unbounded.",
    "check": "At $n=100$ the two points differ by only about $0.031$, yet the function values differ by $1$."
  },
  "an-uc-004": {
    "spot": "The interval $(0,1]$ is only missing its left endpoint $0$, and $x\\sin\\frac{1}{x}\\to 0$ — define $f(0)=0$ and you have a continuous function on a closed interval, automatically uniformly continuous.",
    "why": "On a bounded open interval, \"the endpoint limits exist\" ⇔ uniformly continuous; no need to estimate $|f(x)-f(y)|$.",
    "steps": [
      "$|x\\sin\\frac{1}{x}|\\le x$, so by the Squeeze Theorem $\\lim_{x\\to 0^+}x\\sin\\frac{1}{x}=0$.",
      "Define $F(0)=0$ and $F(x)=x\\sin\\frac{1}{x}$ for $0<x\\le 1$; $F$ is continuous on the closed interval $[0,1]$.",
      "A continuous function on a closed bounded interval is uniformly continuous (Heine–Cantor theorem), and restricting back to $(0,1]$ keeps it uniformly continuous.",
      "So $f$ is uniformly continuous on $(0,1]$."
    ],
    "trap": "Seeing $\\sin\\frac{1}{x}$ oscillate infinitely at the origin and calling it not uniformly continuous — the factor $x$ out front squeezes the amplitude to $0$, so the oscillation is harmless.",
    "check": "Compare with $\\sin\\frac{1}{x}$ alone: it has no limit at $0^+$, and it really isn't uniformly continuous; the whole difference is that $x$."
  },
  "dd-par-004": {
    "spot": "Tangent slope of a polar curve $r=f(\\theta)$: write it parametrically as $x=r\\cos\\theta$, $y=r\\sin\\theta$ with parameter $\\theta$, then $\\frac{dy}{dx}=\\frac{dy/d\\theta}{dx/d\\theta}$.",
    "why": "$\\frac{dr}{d\\theta}$ is not the slope; once converted to parametric form, always use the parametric derivative formula.",
    "steps": [
      "$x=(1+\\cos\\theta)\\cos\\theta$, $y=(1+\\cos\\theta)\\sin\\theta$. At $\\theta=\\frac{\\pi}{2}$: $r=1$, $r'=-\\sin\\theta=-1$.",
      "$\\frac{dy}{d\\theta}=r'\\sin\\theta+r\\cos\\theta=-1\\cdot 1+1\\cdot 0=-1$.",
      "$\\frac{dx}{d\\theta}=r'\\cos\\theta-r\\sin\\theta=0-1=-1$.",
      "$\\frac{dy}{dx}=\\frac{-1}{-1}=1$."
    ],
    "trap": "Taking $\\frac{dr}{d\\theta}=-1$ as the slope and answering $-1$.",
    "check": "That point is $(0,1)$, where the cardioid heads down and to the left (both $x$ and $y$ decrease as $\\theta$ increases), so a positive slope makes sense."
  },
  "fd-limx-607": {
    "spot": "An $\\infty-\\infty$ form, both denominators quadratic in $x$ — combine into $\\frac{\\sin^2x-x^2}{x^2\\sin^2x}$; the denominator is of order $x^4$, so expand the numerator to $x^4$.",
    "why": "After combining, L'Hôpital's Rule would need four rounds; the Taylor expansion $\\sin^2x=x^2-\\frac{x^4}{3}+\\cdots$ does it in one line.",
    "steps": [
      "Common denominator: $\\frac{1}{x^2}-\\frac{1}{\\sin^2x}=\\frac{\\sin^2x-x^2}{x^2\\sin^2x}$.",
      "Denominator: $\\sin^2x\\sim x^2$, so $x^2\\sin^2x\\sim x^4$.",
      "Numerator: $\\sin^2x=\\frac{1-\\cos 2x}{2}=x^2-\\frac{x^4}{3}+\\cdots$, so $\\sin^2x-x^2\\sim-\\frac{x^4}{3}$.",
      "Divide: the limit $=-\\frac{1}{3}$."
    ],
    "trap": "Thinking $\\sin x\\approx x$ so the two terms cancel to $0$ — the difference is of order $x^4$, the same order as the denominator, so it doesn't vanish.",
    "check": "$|\\sin x|<|x|$, so $\\frac{1}{\\sin^2x}>\\frac{1}{x^2}$ and the difference is negative, consistent with the sign of $-\\frac{1}{3}$."
  },
  "lb-sim-006": {
    "spot": "$\\left\\lfloor\\frac{1}{x}\\right\\rfloor$ is a step function: it equals $k$ on $\\left(\\frac{1}{k+1},\\frac{1}{k}\\right]$. The integral $=\\sum k\\times$ (interval length).",
    "why": "The Lebesgue integral of a simple function is just the sum of \"value × measure of the set\"; find the interval for each step.",
    "steps": [
      "Split $[\\frac{1}{5},1]$ into $(\\frac{1}{2},1]$, $(\\frac{1}{3},\\frac{1}{2}]$, $(\\frac{1}{4},\\frac{1}{3}]$, $(\\frac{1}{5},\\frac{1}{4}]$, with values $1,2,3,4$ (the single point $\\frac{1}{5}$ has measure zero).",
      "Each piece: $k\\left(\\frac{1}{k}-\\frac{1}{k+1}\\right)=\\frac{1}{k+1}$.",
      "Add: $\\frac{1}{2}+\\frac{1}{3}+\\frac{1}{4}+\\frac{1}{5}$.",
      "Common denominator $60$: $\\frac{30+20+15+12}{60}=\\frac{77}{60}$."
    ],
    "trap": "Integrating $\\lfloor\\frac{1}{x}\\rfloor$ as if it were $\\frac{1}{x}$, getting $\\ln 5\\approx 1.609$.",
    "check": "$\\lfloor\\frac{1}{x}\\rfloor\\le\\frac{1}{x}$, so the answer must be less than $\\ln 5$: $\\frac{77}{60}\\approx 1.283$."
  },
  "lm-st-001": {
    "spot": "$\\frac{1}{\\sqrt{n}}\\sum\\frac{1}{\\sqrt{k}}$ can be rewritten as $\\frac{1}{n}\\sum\\frac{1}{\\sqrt{k/n}}$ — a Riemann sum for $\\int_0^1\\frac{dx}{\\sqrt{x}}$.",
    "why": "Distributing the $\\sqrt{n}$ into each term reveals the $\\frac{k}{n}$ structure; alternatively, squeeze with integrals to get $\\sum\\frac{1}{\\sqrt k}\\approx 2\\sqrt{n}$.",
    "steps": [
      "$\\frac{1}{\\sqrt{n}}\\cdot\\frac{1}{\\sqrt{k}}=\\frac{1}{n}\\cdot\\frac{1}{\\sqrt{k/n}}$.",
      "This is the right-endpoint Riemann sum of $f(x)=\\frac{1}{\\sqrt{x}}$ on $[0,1]$ (an improper integral, but integrable).",
      "To be rigorous, squeeze with integrals: $2\\sqrt{n+1}-2\\le\\sum_{k=1}^n\\frac{1}{\\sqrt{k}}\\le 2\\sqrt{n}-1$; dividing by $\\sqrt{n}$, both sides tend to $2$.",
      "So the limit is $2$."
    ],
    "trap": "Seeing $\\frac{1}{\\sqrt{n}}\\to 0$ and saying the limit is $0$ — the sum itself diverges like $2\\sqrt{n}$, so the product is finite and nonzero.",
    "check": "At $n=1$ the ratio is $1$; at $n=4$ it's $\\frac{1+0.707+0.577+0.5}{2}\\approx 1.39$, slowly climbing toward $2$."
  },
  "mob-limtrap-008": {
    "spot": "The whole expression depends only on $r=\\sqrt{x^2+y^2}$ — turn it into the one-variable limit of $r\\sin\\frac{1}{r}$ as $r\\to 0^+$: bounded times something going to zero.",
    "why": "When it depends only on $r$, there's no need to try different paths; $|\\sin|\\le 1$ squeezes it directly.",
    "steps": [
      "Let $r=\\sqrt{x^2+y^2}$; $(x,y)\\to(0,0)$ is equivalent to $r\\to 0^+$.",
      "$|r\\sin\\frac{1}{r}|\\le r$.",
      "$r\\to 0$, so by the Squeeze Theorem the limit is $0$."
    ],
    "trap": "Seeing $\\sin\\frac{1}{r}$ oscillate and saying the limit doesn't exist — the $r$ in front squeezes the amplitude to zero.",
    "check": "At $r=0.001$ the value is at most $0.001$ in size."
  },
  "ode-h2-008": {
    "spot": "Characteristic equation $r^2-4r+13=0$ has discriminant $16-52<0$ — complex roots $2\\pm 3i$, so write the solution as $e^{2x}(A\\cos 3x+B\\sin 3x)$.",
    "why": "With complex roots, use the real part as the exponent and the imaginary part as the frequency directly; no need to go through $e^{(2+3i)x}$.",
    "steps": [
      "$r=\\frac{4\\pm\\sqrt{16-52}}{2}=2\\pm 3i$.",
      "General solution $y=e^{2x}(A\\cos 3x+B\\sin 3x)$. $y(0)=A=0$.",
      "That leaves $y=Be^{2x}\\sin 3x$; $y'(0)=3B=3$, so $B=1$.",
      "$y=e^{2x}\\sin 3x$; it satisfies the equation when substituted back."
    ],
    "trap": "Swapping the real and imaginary parts and writing $e^{3x}\\sin 2x$. The exponent uses the real part $2$; the trig functions use the imaginary part $3$.",
    "check": "At $x=\\frac{\\pi}{3}$, $\\sin\\pi=0$, so the solution should cross the $x$-axis."
  },
  "sg-est-003": {
    "spot": "$H_n\\approx\\ln n+\\gamma$ (with $\\gamma\\approx 0.5772$): solving $\\ln n+0.5772\\approx 5$ gives $n\\approx e^{4.42}\\approx 83$; then confirm exactly that $H_{82}<5<H_{83}$.",
    "why": "Adding term by term up to $83$ is too slow; the asymptotic formula locates the answer, then you compute precisely at the boundary.",
    "steps": [
      "$\\ln n\\approx 5-0.5772=4.4228$, $n\\approx e^{4.4228}\\approx 83.3$, so the answer is near $83$.",
      "An exact form: $H_n=\\int_0^1\\frac{1-x^n}{1-x}\\,dx$ (expand into $1+x+\\cdots+x^{n-1}$ and integrate term by term).",
      "$H_{82}\\approx 4.9900<5$.",
      "$H_{83}\\approx 5.0021>5$, so the first time it exceeds $5$ is $n=83$."
    ],
    "trap": "Using only $H_n\\approx\\ln n$ (forgetting $\\gamma$) and getting $n\\approx e^5\\approx 148$, off by almost a factor of two.",
    "check": "Add the correction term $\\frac{1}{2n}$: $\\ln 83+0.5772+\\frac{1}{166}\\approx 5.002$, agreeing with the exact computation."
  },
  "sg-est-005": {
    "spot": "The error bound $\\frac{1}{2N^2}$ is given; just solve $\\frac{1}{2N^2}<10^{-3}$, i.e. $N^2>500$.",
    "why": "Given an error bound, it's just solving an inequality; $\\sqrt{500}\\approx 22.4$, then round up.",
    "steps": [
      "$\\frac{1}{2N^2}<10^{-3}\\iff N^2>500$.",
      "$22^2=484<500$, not enough; $23^2=529>500$.",
      "The smallest is $N=23$."
    ],
    "trap": "Rounding $\\sqrt{500}\\approx 22.4$ to $22$ — the error bound there is about $0.00103$, still not small enough.",
    "check": "The actual tail $\\sum_{n>23}\\frac{1}{n^3}$ is even smaller than the bound, so it's indeed less than $10^{-3}$."
  },
  "an-sr-004": {
    "spot": "Rearranging a conditionally convergent series: each group is \"two positive terms, one negative term\". Write the partial sum of the first $3m$ terms as a combination of harmonic numbers $H$, then use $H_n\\approx\\ln n+\\gamma$.",
    "why": "The Riemann rearrangement theorem only says the sum can change; to get the exact value, express the partial sums with $H_n$ — the $\\gamma$'s cancel and a difference of $\\ln$'s remains.",
    "steps": [
      "The first $m$ groups contain the positive terms $1,\\frac{1}{3},\\dots,\\frac{1}{4m-1}$ and the negative terms $\\frac{1}{2},\\dots,\\frac{1}{2m}$. Each group is $\\frac{1}{4n-3}+\\frac{1}{4n-1}-\\frac{1}{2n}$.",
      "Sum of positive terms $=H_{4m}-\\frac{1}{2}H_{2m}$ (odd reciprocals = all of them minus the even ones); sum of negative terms $=\\frac{1}{2}H_m$.",
      "Partial sum $=H_{4m}-\\frac{1}{2}H_{2m}-\\frac{1}{2}H_m\\approx\\ln 4m-\\frac{1}{2}\\ln 2m-\\frac{1}{2}\\ln m$ (the coefficient of $\\gamma$ is $1-\\frac{1}{2}-\\frac{1}{2}=0$).",
      "$=2\\ln 2-\\frac{1}{2}\\ln 2=\\frac{3}{2}\\ln 2$."
    ],
    "trap": "Assuming rearranging doesn't change the sum and answering $\\ln 2$ — that only holds for absolutely convergent series.",
    "check": "General formula: the rearrangement with $p$ positive and $q$ negative terms per group sums to $\\ln 2+\\frac{1}{2}\\ln\\frac{p}{q}$; $p=2,q=1$ gives exactly $\\frac{3}{2}\\ln 2\\approx 1.04$."
  },
  "an-uf-005": {
    "spot": "$nxe^{-nx^2}$: for fixed $x$ the exponential beats $n$, so it converges pointwise to $0$; but the peak location $x=\\frac{1}{\\sqrt{2n}}$ moves toward $0$ while the peak height $\\sqrt{\\frac{n}{2}}e^{-1/2}$ grows — uniform convergence is about the $\\sup$.",
    "why": "Uniform convergence ⇔ $\\sup|f_n-0|\\to 0$; computing the max is more direct than hunting for a counterexample sequence.",
    "steps": [
      "Pointwise: at $x=0$, $f_n=0$; for $x>0$, $e^{-nx^2}$ decays faster than $n$ grows, so $f_n(x)\\to 0$.",
      "Find the max: $f_n'(x)=n e^{-nx^2}(1-2nx^2)=0$ gives $x=\\frac{1}{\\sqrt{2n}}\\in[0,1]$.",
      "Peak value $f_n\\left(\\frac{1}{\\sqrt{2n}}\\right)=\\sqrt{\\frac{n}{2}}\\,e^{-1/2}$.",
      "$\\sup|f_n|=\\sqrt{\\frac{n}{2}}e^{-1/2}\\to\\infty$, not $0$, so the convergence is not uniform."
    ],
    "trap": "Checking only that the pointwise limit is $0$ and calling it uniform; or plugging in $x=1$ for the max — the max isn't at the endpoint but ever closer to $0$.",
    "check": "At $n=100$ the peak is about $4.29$, nowhere near $0$."
  },
  "der-001": {
    "spot": "A polynomial — use the Power Rule $(x^n)'=nx^{n-1}$ term by term; constants differentiate to zero.",
    "why": "Differentiating a polynomial is just the Power Rule plus linearity; no other tools needed.",
    "steps": [
      "$(x^5)'=5x^4$.",
      "$(-3x^2)'=-6x$.",
      "$(7)'=0$; altogether $5x^4-6x$."
    ],
    "trap": "Differentiating the constant $7$ to $7$ or $1$; the derivative of a constant is $0$.",
    "check": "Plug in $x=1$: $5-6=-1$."
  },
  "der-002": {
    "spot": "A sum of two basic trig functions — use each formula: $(\\sin x)'=\\cos x$, $(\\cos x)'=-\\sin x$.",
    "why": "The derivative of a sum is the sum of the derivatives; go term by term.",
    "steps": [
      "$(\\sin x)'=\\cos x$.",
      "$(\\cos x)'=-\\sin x$ (watch the minus sign).",
      "Altogether $\\cos x-\\sin x$."
    ],
    "trap": "Dropping the minus sign in the derivative of $\\cos x$ and writing $\\cos x+\\sin x$.",
    "check": "At $x=\\frac{\\pi}{4}$, $\\sin x+\\cos x$ is at its max, so the derivative should be $0$."
  },
  "exam-int-005": {
    "spot": "$\\frac{1}{x}$ is exactly the derivative of $\\ln x$ — let $u=\\ln x$ and the integral becomes $\\int u\\,du$.",
    "why": "\"A function times its own derivative\" is an instant substitution; integration by parts also works but goes the long way.",
    "steps": [
      "Let $u=\\ln x$, $du=\\frac{dx}{x}$.",
      "$\\int u\\,du=\\frac{u^2}{2}+C$.",
      "Substitute back: $\\frac{(\\ln x)^2}{2}+C$."
    ],
    "trap": "Writing $\\ln(x^2)/2$ or $\\ln|\\ln x|$ — it's the square of $\\ln x$, not the log of $x^2$.",
    "check": "Differentiate back: $\\frac{2\\ln x}{2}\\cdot\\frac{1}{x}=\\frac{\\ln x}{x}$."
  },
  "int-001": {
    "spot": "A single power — the Power Rule in reverse: add one to the exponent, then divide by the new exponent.",
    "why": "The most basic antiderivative formula, $\\int x^n dx=\\frac{x^{n+1}}{n+1}+C$.",
    "steps": [
      "$\\int x^2\\,dx=\\frac{x^3}{3}$.",
      "Multiply by the coefficient $6$: $6\\cdot\\frac{x^3}{3}=2x^3$.",
      "So $\\int 6x^2\\,dx=2x^3+C$."
    ],
    "trap": "Raising the exponent but forgetting to divide, writing $6x^3$.",
    "check": "Differentiate back: $(2x^3)'=6x^2$."
  },
  "der-038": {
    "spot": "A ratio of two polynomials — Quotient Rule, then expand and tidy up the numerator.",
    "why": "Long division into $x+1+\\frac{2}{x-1}$ also works, but the Quotient Rule lands directly in the answer's form.",
    "steps": [
      "$u=x^2+1$, $v=x-1$, $u'=2x$, $v'=1$.",
      "Numerator $u'v-uv'=2x(x-1)-(x^2+1)=x^2-2x-1$.",
      "$\\frac{x^2-2x-1}{(x-1)^2}$."
    ],
    "trap": "When expanding the numerator, applying the minus sign of $-(x^2+1)$ only to $x^2$, getting $x^2-2x+1$.",
    "check": "Differentiate the long-division form $x+1+\\frac{2}{x-1}$: $1-\\frac{2}{(x-1)^2}$, which should be the same."
  },
  "der-039": {
    "spot": "$\\sin^2x=(\\sin x)^2$ is \"a square wrapped around $\\sin$\" — Chain Rule: outer $2u$, inner $\\cos x$.",
    "why": "One Chain Rule step; you could also write it as $\\frac{1-\\cos 2x}{2}$ and differentiate, same result.",
    "steps": [
      "The outer $u^2$ has derivative $2u=2\\sin x$.",
      "The inner $\\sin x$ has derivative $\\cos x$.",
      "Multiply: $2\\sin x\\cos x$."
    ],
    "trap": "Writing $2\\sin x$ (forgetting the inner part) or $\\cos^2x$ (carrying the square along).",
    "check": "$2\\sin x\\cos x=\\sin 2x$, the same as differentiating $\\frac{1-\\cos 2x}{2}$."
  },
  "exam-der-003": {
    "spot": "$\\ln x$ divided by $x$ — Quotient Rule; the numerator $\\ln x$ differentiates to $\\frac{1}{x}$, which times $x$ is exactly $1$, so the result is clean.",
    "why": "Quotient Rule, or the Product Rule on $\\ln x\\cdot x^{-1}$, both work; the Quotient Rule is one step.",
    "steps": [
      "$u=\\ln x$, $v=x$, $u'=\\frac{1}{x}$, $v'=1$.",
      "Numerator $u'v-uv'=\\frac{1}{x}\\cdot x-\\ln x=1-\\ln x$.",
      "Divide by $v^2=x^2$: $\\frac{1-\\ln x}{x^2}$."
    ],
    "trap": "Reversing the numerator order and getting $\\frac{\\ln x-1}{x^2}$.",
    "check": "$\\frac{\\ln x}{x}$ is maximized at $x=e$, so the derivative must be $0$ there."
  },
  "int-027": {
    "spot": "The numerator $x$ is half the derivative $2x$ of the denominator $1+x^2$ — an $\\int\\frac{f'}{f}=\\ln|f|$ type.",
    "why": "When the numerator is a multiple of the denominator's derivative, it's a log; don't think $\\arctan$ (that's when the numerator is a constant).",
    "steps": [
      "Let $u=1+x^2$, $du=2x\\,dx$, $x\\,dx=\\frac{du}{2}$.",
      "$\\int\\frac{1}{u}\\cdot\\frac{du}{2}=\\frac{1}{2}\\ln|u|$.",
      "Since $1+x^2>0$, the answer is $\\frac{1}{2}\\ln(1+x^2)+C$."
    ],
    "trap": "Seeing $1+x^2$ and writing $\\arctan x$ — that's $\\int\\frac{dx}{1+x^2}$, with no $x$ on top.",
    "check": "Differentiate back: $\\frac{1}{2}\\cdot\\frac{2x}{1+x^2}=\\frac{x}{1+x^2}$."
  },
  "lim-026": {
    "spot": "Cubic on top, quadratic on the bottom, and $\\frac{x^2}{x^2+y^2}\\le 1$ — split it as $\\frac{x^2}{x^2+y^2}\\cdot y$: bounded times something going to zero.",
    "why": "Trying paths can only prove a limit doesn't exist; proving it exists needs a squeeze, and here $\\frac{x^2}{x^2+y^2}$ is a ready-made bounded factor.",
    "steps": [
      "$\\left|\\frac{x^2y}{x^2+y^2}\\right|=\\frac{x^2}{x^2+y^2}\\cdot|y|\\le|y|$.",
      "Checking along any line $y=mx$ also gives $0$, e.g. $y=2x$: $\\frac{2x^3}{5x^2}=\\frac{2x}{5}\\to 0$.",
      "$|y|\\to 0$, so by the Squeeze Theorem the limit is $0$."
    ],
    "trap": "Trying a few lines, getting $0$ each time, and concluding — agreeing paths don't prove the limit exists; finish with a squeeze.",
    "check": "In polar coordinates: $r\\cos^2\\theta\\sin\\theta$, at most $r$ in size."
  },
  "ode-p2-004": {
    "spot": "The right side is linear, $2x$, and $0$ is not a characteristic root — guess the particular solution $y_p=Ax+B$; then see whether the initial conditions make the homogeneous part vanish entirely.",
    "why": "Undetermined coefficients is fastest for a polynomial right side; the initial conditions happen to match the particular solution, so the homogeneous coefficients are just $0$.",
    "steps": [
      "Characteristic equation $r^2-3r+2=(r-1)(r-2)$; homogeneous solution $c_1e^x+c_2e^{2x}$.",
      "Substitute $y_p=Ax+B$: $-3A+2Ax+2B=2x$, giving $A=1$, $B=\\frac{3}{2}$.",
      "$y=c_1e^x+c_2e^{2x}+x+\\frac{3}{2}$; $y(0)=\\frac{3}{2}$ gives $c_1+c_2=0$ and $y'(0)=1$ gives $c_1+2c_2=0$, so $c_1=c_2=0$.",
      "$y=x+\\frac{3}{2}$."
    ],
    "trap": "Forgetting to substitute $y_p''$ and $y_p'$ when finding the particular solution, using only $2y_p=2x$ to get $y_p=x$ and missing $B=\\frac{3}{2}$.",
    "check": "A line has second derivative $0$: $-3\\cdot 1+2(x+\\frac{3}{2})=2x$, as required."
  },
  "si-int-005": {
    "spot": "Increasing intervals of a cubic — look at the sign of $f'(x)=3x^2-3$; the critical points $\\pm 1$ cut the number line into three pieces.",
    "why": "Increasing ⇔ positive derivative; the sign of a quadratic is clear from which way it opens.",
    "steps": [
      "$f'(x)=3x^2-3=3(x-1)(x+1)$, zeros at $x=\\pm 1$.",
      "It opens upward, so it's positive outside the roots: $f'>0$ for $x<-1$ or $x>1$.",
      "On the middle piece $(-1,1)$, $f'<0$: decreasing.",
      "Increasing intervals: $(-\\infty,-1)\\cup(1,\\infty)$."
    ],
    "trap": "Giving $(-1,1)$, where $f'<0$, as the answer, or merging the two pieces into one, $(-\\infty,\\infty)$.",
    "check": "$f(-1)=2$ is a local max and $f(1)=-2$ is a local min, matching \"increase, decrease, increase\"."
  },
  "lec-09-q4c": {
    "spot": "\"Cross-sections perpendicular to the $x$-axis\" have a known shape — volume $=\\int A(x)\\,dx$; the side of the equilateral triangle is the disk's chord length at $x$, $2\\sqrt{4-x^2}$.",
    "why": "Method of cross-sections: write the area of each slice first, then integrate along $x$.",
    "steps": [
      "At $x$, the chord length is $s=2\\sqrt{4-x^2}$.",
      "Equilateral triangle area $\\frac{\\sqrt{3}}{4}s^2=\\frac{\\sqrt{3}}{4}\\cdot 4(4-x^2)=\\sqrt{3}(4-x^2)$.",
      "$\\int_{-2}^{2}(4-x^2)\\,dx=16-\\frac{16}{3}=\\frac{32}{3}$.",
      "$V=\\frac{32\\sqrt{3}}{3}\\approx 18.48$."
    ],
    "trap": "Using the half-chord $\\sqrt{4-x^2}$ as the side length; the volume comes out four times too small.",
    "check": "Compare: with square cross-sections the volume is $\\int 4(4-x^2)=\\frac{128}{3}$; the equilateral triangle ratio is $\\frac{\\sqrt{3}}{4}$, consistent."
  },
  "ode-lin-002": {
    "spot": "$y'-y=e^x$ is first-order linear with integrating factor $e^{-x}$; multiplying through turns the right side into exactly $1$.",
    "why": "The right side $e^x$ has the same form as the homogeneous solution, so undetermined coefficients would need the guess $Axe^x$; the integrating factor produces that $x$ naturally in one step.",
    "steps": [
      "Multiply by $e^{-x}$: $(e^{-x}y)'=e^{-x}y'-e^{-x}y=1$.",
      "Integrate: $e^{-x}y=x+C$.",
      "$y(0)=0$: $C=0$, so $y=xe^x$.",
      "Check: $y'-y=(1+x)e^x-xe^x=e^x$."
    ],
    "trap": "Guessing $y_p=Ae^x$ with undetermined coefficients: the left side becomes $0$ and you can't solve for $A$ — when the right side matches a homogeneous solution, multiply by $x$.",
    "check": "$y(0)=0$ and $y'(0)=y(0)+e^0=1$."
  },
  "ode-p2-003": {
    "spot": "$y''+4y=8$: the right side is a constant, so the particular solution is the constant $y_p=2$; the homogeneous part, with $r=\\pm 2i$, gives $\\cos 2x$, $\\sin 2x$.",
    "why": "For a constant right side, just guess a constant; no need for variation of parameters.",
    "steps": [
      "Particular solution: $4y_p=8$, $y_p=2$.",
      "Homogeneous: $r^2+4=0$, $r=\\pm 2i$; general solution $y=2+c_1\\cos 2x+c_2\\sin 2x$.",
      "$y(0)=2+c_1=0$, so $c_1=-2$; $y'(0)=2c_2=0$, so $c_2=0$.",
      "$y=2-2\\cos 2x$; it satisfies the equation when substituted back."
    ],
    "trap": "Applying the initial conditions to the homogeneous part only, getting $c_1=0$ and writing $y=2$ — that fails $y(0)=0$.",
    "check": "$y=4\\sin^2x\\ge 0$: it starts at $0$ and goes up to at most $4$."
  },
  "ser-008": {
    "spot": "The coefficients contain $n!$ — the ratio $\\frac{(n+1)!}{n!}=n+1$ grows without bound; the radius of convergence is the limit of its reciprocal.",
    "why": "Factorials call for the Ratio Test, which is cleaner than the Root Test (where $\\sqrt[n]{n!}$ would need Stirling).",
    "steps": [
      "$\\left|\\frac{a_{n+1}x^{n+1}}{a_nx^n}\\right|=(n+1)|x|$.",
      "As long as $x\\ne 0$, $(n+1)|x|\\to\\infty>1$: diverges.",
      "It converges only at $x=0$, so $R=\\lim\\frac{1}{n+1}=0$."
    ],
    "trap": "Inverting the ratio to $\\frac{a_n}{a_{n+1}}\\to 0$ and then taking a reciprocal, getting $R=\\infty$ (that's for $\\sum\\frac{x^n}{n!}$).",
    "check": "Compare with $e^x=\\sum\\frac{x^n}{n!}$, which has $R=\\infty$: whether $n!$ is in the denominator or numerator gives exactly opposite results."
  },
  "si-int-011": {
    "spot": "The inside of $\\ln$ must be positive: $4-x^2>0$.",
    "why": "The domain of a logarithm depends only on its argument being positive; solve one quadratic inequality.",
    "steps": [
      "We need $4-x^2>0$, i.e. $x^2<4$.",
      "At $x=\\pm 2$ the argument is $0$ — not allowed; for $|x|>2$ it's negative.",
      "Domain: $(-2,2)$."
    ],
    "trap": "Writing the closed interval $[-2,2]$ — $\\ln 0$ is undefined.",
    "check": "At $0$, $f(0)=\\ln 4$ is defined."
  },
  "si-set-017": {
    "spot": "Inflection points mean $f''$ changes sign: $f''(x)=12x^2-12$ has zeros $\\pm 1$; then confirm the sign really changes on both sides.",
    "why": "$f''=0$ only gives candidates; it must change sign to count. Here the roots are simple, so the sign definitely changes.",
    "steps": [
      "$f''(x)=12x^2-12=12(x-1)(x+1)$, zeros $\\pm 1$.",
      "On $(-1,1)$, $f''<0$ (concave down).",
      "For $|x|>1$, $f''>0$ (concave up), so the sign changes at both points.",
      "The inflection points have $x$-coordinates $\\{-1,1\\}$."
    ],
    "trap": "Solving $f'(x)=4x^3-12x=0$ to get $0,\\pm\\sqrt{3}$ — those are extreme points, not inflection points.",
    "check": "$f$ is even, so inflection points must come in symmetric pairs."
  },
  "ode-p2-005": {
    "spot": "$y''+y'=1$: characteristic roots $0$ and $-1$, and the constant right side collides with $r=0$ — guess $Ax$ for the particular solution, not a constant.",
    "why": "You could also set $v=y'$ to reduce the order to $v'+v=1$; both are fast. With undetermined coefficients, just remember: if it collides with a root, multiply by $x$.",
    "steps": [
      "Characteristic equation $r^2+r=0$, $r=0,-1$; homogeneous solution $c_1+c_2e^{-x}$.",
      "The constant collides with the root $0$, so guess $y_p=Ax$: $0+A=1$, $A=1$.",
      "$y=c_1+c_2e^{-x}+x$. $y(0)=c_1+c_2=0$ and $y'(0)=-c_2+1=0$, so $c_2=1$, $c_1=-1$.",
      "$y=x-1+e^{-x}$; it checks out when substituted back."
    ],
    "trap": "Guessing $y_p=A$ (a constant): substituting gives $0=1$, a contradiction. A constant is itself a homogeneous solution, so multiply by $x$.",
    "check": "For large $x$, $e^{-x}\\to 0$ and $y\\approx x-1$; slope $1$ gives exactly $y'=1$, $y''=0$."
  },
  "ode-sep-006": {
    "spot": "$y'=y(1-y)$ has only $y$ on the right — separable, and it's the logistic equation; use partial fractions $\\frac{1}{y(1-y)}=\\frac{1}{y}+\\frac{1}{1-y}$.",
    "why": "After separating, partial fractions integrate to $\\ln\\frac{y}{1-y}$, and the initial value $\\frac{1}{2}$ makes the constant exactly $0$.",
    "steps": [
      "Separate: $\\frac{dy}{y(1-y)}=dx$, with $\\frac{1}{y(1-y)}=\\frac{1}{y}+\\frac{1}{1-y}$.",
      "Integrate: $\\ln\\frac{y}{1-y}=x+C$. $y(0)=\\frac{1}{2}$ gives $\\ln 1=C$, so $C=0$.",
      "$\\frac{y}{1-y}=e^x$, which solves to $y=\\frac{e^x}{1+e^x}=\\frac{1}{1+e^{-x}}$.",
      "It satisfies the equation when substituted back."
    ],
    "trap": "Writing the second partial fraction as $-\\frac{1}{1-y}$, which integrates to $\\ln(y(1-y))$, and everything after that is wrong.",
    "check": "As $x\\to\\infty$, $y\\to 1$ (the carrying capacity); as $x\\to-\\infty$, $y\\to 0$."
  },
  "ser-001": {
    "spot": "Of the form $\\frac{1}{n^p}$ with $p=2>1$ — a p-series, converges right away.",
    "why": "The p-series is the standard benchmark for comparisons; just remember $p>1$ converges. The reason is the Integral Test.",
    "steps": [
      "$\\frac{1}{x^2}$ is positive and decreasing, so the Integral Test applies.",
      "$\\int_1^\\infty\\frac{dx}{x^2}=1$, finite.",
      "So the series converges (in fact the sum is $\\frac{\\pi^2}{6}\\approx 1.645$)."
    ],
    "trap": "Confusing it with $\\sum\\frac{1}{n}$ and saying it diverges; $p=1$ is the cutoff, and $p=2$ already converges.",
    "check": "The sum is less than $1+\\int_1^\\infty\\frac{dx}{x^2}=2$."
  },
  "ser-027": {
    "spot": "$e^{2x}$ is just $e^u$ with $u=2x$: the coefficient of $x^4$ $=\\frac{2^4}{4!}$.",
    "why": "Substitute into a known expansion; no need to compute a fourth derivative.",
    "steps": [
      "$e^u=\\sum\\frac{u^n}{n!}$; with $u=2x$: $e^{2x}=\\sum\\frac{2^n}{n!}x^n$.",
      "$n=4$: $\\frac{2^4}{4!}=\\frac{16}{24}$.",
      "Reduce: $\\frac{2}{3}$."
    ],
    "trap": "Writing just $\\frac{1}{4!}$ or $\\frac{2}{4!}$, forgetting that the $2$ in $(2x)^4$ is also raised to the fourth power.",
    "check": "By the Taylor formula: $\\frac{f^{(4)}(0)}{4!}=\\frac{16}{24}$."
  },
  "fd-int-016": {
    "spot": "The antiderivative of $\\cos x$ is $\\sin x$, and $\\sin 0=\\sin\\pi=0$.",
    "why": "Fundamental Theorem of Calculus, one step.",
    "steps": [
      "Antiderivative: $\\sin x$.",
      "$\\sin\\pi-\\sin 0=0-0$.",
      "The integral $=0$ (positive on the first half, negative on the second; the areas cancel)."
    ],
    "trap": "Treating the integral as area and answering $2$ — that's $\\int_0^\\pi|\\cos x|\\,dx$.",
    "check": "Symmetry: $\\cos(\\pi-x)=-\\cos x$, so the two halves cancel exactly."
  },
  "fd-ser-005": {
    "spot": "$\\frac{7}{10^n}$ is a geometric series with first term ($n=0$) $7$ and ratio $\\frac{1}{10}$.",
    "why": "Geometric series formula $\\frac{a}{1-r}$; note that starting at $n=0$ the first term is $7$.",
    "steps": [
      "First term $a=7$, ratio $r=\\frac{1}{10}$; $|r|<1$, so it converges.",
      "$\\frac{7}{1-\\frac{1}{10}}=\\frac{7}{9/10}=\\frac{70}{9}$.",
      "The sum is $\\frac{70}{9}$."
    ],
    "trap": "Taking the first term to be $\\frac{7}{10}$ (as if it started at $n=1$), getting $\\frac{7}{9}$.",
    "check": "The repeating decimal $7.777\\ldots=\\frac{70}{9}$ — it matches."
  },
  "fd-ser-006": {
    "spot": "$\\frac{5}{2^n}$ starting at $n=1$ — geometric, first term $\\frac{5}{2}$, ratio $\\frac{1}{2}$.",
    "why": "Geometric formula $\\frac{\\text{first term}}{1-r}$; the first term depends on the starting $n$.",
    "steps": [
      "First term $\\frac{5}{2}$, ratio $\\frac{1}{2}$.",
      "$\\frac{5/2}{1-1/2}=5$.",
      "The sum is $5$."
    ],
    "trap": "Using $5$ (the $n=0$ value) as the first term and getting $10$.",
    "check": "$\\frac{1}{2}+\\frac{1}{4}+\\cdots=1$; times $5$ gives $5$."
  },
  "fd-ser-016": {
    "spot": "$\\frac{4}{7^n}$ is a geometric series starting at $n=0$, first term $4$, ratio $\\frac{1}{7}$.",
    "why": "The ratio has absolute value less than one, so apply the geometric series formula $\\frac{a}{1-r}$ directly — just read off the first term carefully.",
    "steps": [
      "First term $4$, ratio $\\frac{1}{7}$.",
      "$\\frac{4}{1-\\frac{1}{7}}=\\frac{4}{6/7}=\\frac{28}{6}=\\frac{14}{3}$.",
      "The sum is $\\frac{14}{3}$."
    ],
    "trap": "Taking the first term as $\\frac{4}{7}$ and getting $\\frac{2}{3}$.",
    "check": "The first term $4$ plus a little more: $\\frac{14}{3}\\approx 4.67$ is reasonable."
  },
  "world-055": {
    "spot": "$\\cos x\\,dx$ is exactly $d(\\sin x)$ — let $u=\\sin x$ and it becomes $\\int_0^1\\ln u\\,du$.",
    "why": "Substitute first to get rid of the trig; the remaining $\\ln u$ integral is the standard result $u\\ln u-u$.",
    "steps": [
      "Let $u=\\sin x$, $du=\\cos x\\,dx$; $x:0\\to\\frac{\\pi}{2}$ corresponds to $u:0\\to 1$.",
      "$\\int\\ln u\\,du=u\\ln u-u$ (integration by parts).",
      "$[u\\ln u-u]_0^1=(0-1)-\\lim_{u\\to 0^+}(u\\ln u-u)=-1-0$.",
      "The integral $=-1$."
    ],
    "trap": "Thinking $\\ln 0$ blows up so the integral diverges — $u\\ln u\\to 0$, and the improper integral converges.",
    "check": "$\\ln(\\sin x)\\le 0$, so a negative integral makes sense."
  },
  "cx-avg-001": {
    "spot": "Average value $=\\frac{1}{b-a}\\int_a^b f$; here the interval has length $3$.",
    "why": "Apply the definition of the average value of a function directly.",
    "steps": [
      "$\\int_0^3x^2\\,dx=\\frac{27}{3}=9$.",
      "Divide by the interval length $3$: $\\frac{9}{3}=3$.",
      "The average value is $3$."
    ],
    "trap": "Averaging the endpoints, $\\frac{f(0)+f(3)}{2}=4.5$ — that only works for linear functions.",
    "check": "Mean Value Theorem: $c^2=3$, $c=\\sqrt{3}\\in[0,3]$."
  },
  "cx-ftc-006": {
    "spot": "The integrand is $f'$ — Fundamental Theorem of Calculus: $\\int_0^5 f'=f(5)-f(0)$; no need to differentiate and then integrate.",
    "why": "Use the FTC directly and skip the differentiation.",
    "steps": [
      "$\\int_0^5f'(x)\\,dx=f(5)-f(0)$.",
      "$f(5)=25+15=40$, $f(0)=0$.",
      "The integral $=40$."
    ],
    "trap": "Integrating $f$ itself, getting $\\int_0^5(x^2+3x)\\,dx=\\frac{475}{6}$.",
    "check": "$f'=2x+3$ is a line, so it's a trapezoid with area $\\frac{3+13}{2}\\cdot 5=40$."
  },
  "cx-mvt-006": {
    "spot": "$\\sin 0=\\sin\\pi=0$: the endpoints are at the same height — Rolle's Theorem guarantees a $c$ with $f'(c)=\\cos c=0$.",
    "why": "Rolle's Theorem's $c$ comes from solving $f'(c)=0$.",
    "steps": [
      "Endpoints: $\\sin 0=\\sin\\pi=0$, so the hypothesis holds.",
      "$f'(c)=\\cos c=0$.",
      "The only solution in $(0,\\pi)$ is $c=\\frac{\\pi}{2}$."
    ],
    "trap": "Answering $\\frac{3\\pi}{2}$ or $0$ — $c$ must be in the open interval $(0,\\pi)$.",
    "check": "$\\frac{\\pi}{2}$ is exactly the highest point of $\\sin x$."
  },
  "cx-rev-007": {
    "spot": "Revolving about the $x$-axis with the curve as the radius — disk method $V=\\pi\\int y^2\\,dx=\\pi\\int_0^1e^{2x}\\,dx$.",
    "why": "The axis of revolution is the same as the integration variable's axis, so the disk method is the most direct.",
    "steps": [
      "$V=\\pi\\int_0^1(e^x)^2\\,dx=\\pi\\int_0^1e^{2x}\\,dx$.",
      "$\\int_0^1e^{2x}\\,dx=\\frac{e^2-1}{2}$.",
      "$V=\\frac{\\pi(e^2-1)}{2}\\approx 10.04$."
    ],
    "trap": "Forgetting to square, writing $\\pi\\int e^x\\,dx=\\pi(e-1)$.",
    "check": "It lies between the cylinders of radius $1$ and radius $e$: $\\pi<V<\\pi e^2$."
  },
  "db-ftc-001": {
    "spot": "The derivative of $F(x)=\\int_0^x g(t)\\,dt$ is just $g(x)$ — Fundamental Theorem of Calculus; it doesn't matter that $e^{-t^2}$ has no elementary antiderivative.",
    "why": "Part 1 of the FTC gives $F'$ directly; you don't need to (and can't) compute the integral first.",
    "steps": [
      "$F'(x)=e^{-x^2}$.",
      "Plug in $x=1$: $e^{-1}$.",
      "$F'(1)=e^{-1}\\approx 0.368$."
    ],
    "trap": "Thinking you must compute the integral before differentiating, and getting stuck because $e^{-t^2}$ can't be integrated.",
    "check": "A difference quotient for $F'(1)$: $\\frac{F(1.001)-F(1)}{0.001}\\approx 0.368$."
  },
  "db-imp-001": {
    "spot": "You can't solve $y^3+xy=6$ for $y$, and only the slope at $(5,1)$ is asked — implicit differentiation, then plug in the point.",
    "why": "$\\frac{dy}{dx}=-\\frac{F_x}{F_y}$; just evaluate the two partials at the point.",
    "steps": [
      "Check the point is on the curve: $1+5=6$.",
      "$F=y^3+xy-6$: $F_x=y=1$, $F_y=3y^2+x=3+5=8$.",
      "$\\frac{dy}{dx}=-\\frac{1}{8}$."
    ],
    "trap": "Dropping the $x\\,y'$ term when differentiating $xy$; the denominator becomes $3y^2=3$ and you get $-\\frac{1}{3}$.",
    "check": "Move a little to the right along the tangent: at $x=5.01$, $y\\approx 1-0.00125$, and $y^3+xy\\approx 6$."
  },
  "dd-rr-002": {
    "spot": "Area $A=\\pi r^2$; differentiating in time gives $\\frac{dA}{dt}=2\\pi r\\frac{dr}{dt}$ — related rates, plug in $r=10$, $\\frac{dr}{dt}=2$.",
    "why": "Write the relation between the quantities first, differentiate with respect to $t$, and only then plug in numbers.",
    "steps": [
      "$A=\\pi r^2$, $\\frac{dA}{dr}=2\\pi r$.",
      "$\\frac{dA}{dt}=2\\pi r\\cdot\\frac{dr}{dt}$. At $r=10$, $2\\pi\\cdot 10=20\\pi$.",
      "Multiply by $\\frac{dr}{dt}=2$: $40\\pi\\approx 125.7$ square centimeters per second."
    ],
    "trap": "Plugging in $r=10$ first to get $A=100\\pi$ and then differentiating, which gives $0$ — differentiate first, then substitute.",
    "check": "One second later the radius is $12$: the area grows by $44\\pi$, a bit more than the instantaneous $40\\pi$ on average (the area grows at an increasing rate)."
  }
};
