// Detail v2, English — batch 025. Translation of tools/content/detail/025.js (text only; claims live in the Chinese file).
module.exports = {
  "db-ext-006": {
    "spot": "You're given a function and the interval $[0,2]$ and asked for \"the $c$ from the Mean Value Theorem\": solve $f'(c)=$ secant slope, then keep the root that lies inside the interval.",
    "why": "The Mean Value Theorem only guarantees $c$ exists; to actually find it you have to write the equation and solve it. $f'$ is quadratic, so it solves right away.",
    "steps": [
      "Secant slope: $\\frac{f(2)-f(0)}{2-0}=\\frac{8-0}{2}=4$.",
      "$f'(x)=3x^2$.",
      "Solve $3c^2=4$: $c=\\pm\\frac{2}{\\sqrt 3}$.",
      "Only the positive one is in $(0,2)$: $c=\\frac{2}{\\sqrt 3}\\approx 1.155$."
    ],
    "trap": "Listing both roots, or giving $-\\frac{2}{\\sqrt 3}$ — it isn't in $(0,2)$, so it doesn't count.",
    "check": "Plug back in: $f'\\left(\\frac{2}{\\sqrt 3}\\right)=3\\cdot\\frac{4}{3}=4$, exactly the secant slope."
  },
  "db-ext-008": {
    "spot": "The interval is $[1,e]$, and both ends are easy: $\\ln 1=0$, $\\ln e=1$. Also $f'(x)=\\frac{1}{x}$ solves in one step.",
    "why": "Write $f'(c)=\\frac{f(e)-f(1)}{e-1}$ and solve for $c$ — one step.",
    "steps": [
      "Secant slope: $\\frac{\\ln e-\\ln 1}{e-1}=\\frac{1}{e-1}$.",
      "$f'(x)=\\frac{1}{x}$.",
      "$\\frac{1}{c}=\\frac{1}{e-1}$, so $c=e-1\\approx 1.718$.",
      "$1<1.718<e$, so it's in the interval: the answer is $c=e-1$."
    ],
    "trap": "Getting to $\\frac{1}{c}=\\frac{1}{e-1}$ and giving the slope $\\frac{1}{e-1}\\approx 0.58$ as the answer — it isn't even in the interval $[1,e]$.",
    "check": "The tangent slope at $c=e-1$ is $\\frac{1}{e-1}$, the same as the slope of the line joining the endpoints."
  },
  "db-imp-006": {
    "spot": "$xy=4$ can be solved directly as $y=\\frac{4}{x}$; even with implicit differentiation, the second derivative just means differentiating the first-derivative equation once more.",
    "why": "Implicit differentiation twice is the general method; here the curve can also be written explicitly, which lets you check the answer.",
    "steps": [
      "Differentiate with respect to $x$: $y+xy'=0$, so $y'=-\\frac{y}{x}$; at $(2,2)$, $y'=-1$.",
      "Differentiate $y+xy'=0$ again: $y'+y'+xy''=0$, i.e. $y''=-\\frac{2y'}{x}$.",
      "At $(2,2)$: $y''=-\\frac{2\\cdot(-1)}{2}=1$."
    ],
    "trap": "Treating $y'$ as a constant on the second differentiation and missing the $y'$ that the Product Rule produces from $xy'$, which gives $y''=-\\frac{y'}{x}=\\frac{1}{2}$.",
    "check": "Explicitly $y=\\frac{4}{x}$, $y''=\\frac{8}{x^3}$, and $x=2$ gives $1$."
  },
  "db-imp-008": {
    "spot": "$x^2y+xy^3=2$ can't be solved for $y$, and you only need the slope at one point: use implicit differentiation, or directly $\\frac{dy}{dx}=-\\frac{F_x}{F_y}$.",
    "why": "$-\\frac{F_x}{F_y}$ is implicit differentiation already rearranged — just plug in the point, no need to isolate $y'$.",
    "steps": [
      "Let $F=x^2y+xy^3$; $F_x=2xy+y^3$.",
      "$F_y=x^2+3xy^2$.",
      "At $(1,1)$: $F_x=3$, $F_y=4$.",
      "$\\frac{dy}{dx}=-\\frac{F_x}{F_y}=-\\frac{3}{4}$."
    ],
    "trap": "Forgetting the Chain Rule when differentiating $xy^3$, writing $y^3+3xy^2$ (missing the factor $y'$) — then you can't isolate $y'$.",
    "check": "The point $(1,1)$ really is on the curve: $1+1=2$."
  },
  "db-inv-004": {
    "spot": "You need $(f^{-1})'(2\\pi)$ but can't write $f^{-1}$: first find which $a$ gives $f(a)=2\\pi$ — at $a=\\pi$ the $\\sin$ in $2a+\\sin a$ vanishes, giving exactly $2\\pi$.",
    "why": "The inverse derivative $(f^{-1})'(b)=\\frac{1}{f'(a)}$ needs only $a$ and $f'(a)$; you never have to find the inverse.",
    "steps": [
      "Find $a$: $f(\\pi)=2\\pi+\\sin\\pi=2\\pi$, so $a=\\pi$.",
      "$f'(x)=2+\\cos x$, $f'(\\pi)=2-1=1$.",
      "$(f^{-1})'(2\\pi)=\\frac{1}{f'(\\pi)}=1$."
    ],
    "trap": "Plugging $2\\pi$ straight into $f'$: $\\frac{1}{f'(2\\pi)}=\\frac{1}{3}$. You must plug in the point that gets sent to $2\\pi$, namely $\\pi$.",
    "check": "$f'=2+\\cos x\\ge 1>0$, so $f$ is strictly increasing and the inverse exists and is differentiable."
  },
  "db-inv-005": {
    "spot": "Find $(f^{-1})'(1)$: $x+\\ln x=1$ is solved at a glance by $x=1$ (since $\\ln 1=0$).",
    "why": "You can't write the inverse, but $(f^{-1})'(b)=\\frac{1}{f'(a)}$ only needs the $a$ with $f(a)=b$.",
    "steps": [
      "$f(1)=1+\\ln 1=1$, so $a=1$.",
      "$f'(x)=1+\\frac{1}{x}$, $f'(1)=2$.",
      "$(f^{-1})'(1)=\\frac{1}{2}$."
    ],
    "trap": "Stopping at $f'(1)=2$ and forgetting that the inverse's derivative is the reciprocal.",
    "check": "$f$ is increasing for $x>0$: $f'(x)=1+\\frac{1}{x}>0$, so the inverse exists."
  },
  "db-inv-006": {
    "spot": "Find $(f^{-1})'(5)$: to solve $x^3+3x+1=5$, try $x=1$ and it works, $1+3+1=5$.",
    "why": "$(f^{-1})'(5)=\\frac{1}{f'(1)}$; the inverse of a cubic can't be written out, so this is the only practical route.",
    "steps": [
      "$f(1)=5$, so $a=1$.",
      "$f'(x)=3x^2+3$, $f'(1)=6$.",
      "$(f^{-1})'(5)=\\frac{1}{6}$."
    ],
    "trap": "Plugging $5$ into $f'$: $\\frac{1}{f'(5)}=\\frac{1}{78}$. $5$ is an output of $f$, not an input.",
    "check": "$f'=3x^2+3>0$, so $f$ is strictly increasing and $f(a)=5$ has the single solution $a=1$."
  },
  "db-inv-009": {
    "spot": "Find $(f^{-1})'(0)$: every term of $x^3+2x+\\sin x$ is $0$ at $x=0$, so $f(0)=0$.",
    "why": "The inverse derivative only needs $\\frac{1}{f'(a)}$; once you find $a=0$ you're done.",
    "steps": [
      "$f(0)=0$, so $a=0$.",
      "$f'(x)=3x^2+2+\\cos x$, $f'(0)=3$.",
      "$(f^{-1})'(0)=\\frac{1}{3}$."
    ],
    "trap": "Forgetting $\\cos 0=1$ and writing $f'(0)=2$, which gives $\\frac{1}{2}$.",
    "check": "$f'(x)=3x^2+2+\\cos x\\ge 1>0$, so $f$ is strictly increasing and the inverse is differentiable."
  },
  "db-itrig-008": {
    "spot": "Outer $\\arctan$, inner $\\sinh x$: after the Chain Rule the denominator is $1+\\sinh^2x$, which is exactly $\\cosh^2x$.",
    "why": "The Chain Rule gives it in one step; the real thing to see is that the hyperbolic identity $\\cosh^2x-\\sinh^2x=1$ simplifies the answer.",
    "steps": [
      "$\\frac{d}{du}\\arctan u=\\frac{1}{1+u^2}$.",
      "Inner layer $u=\\sinh x$, $u'=\\cosh x$, so the derivative is $\\frac{\\cosh x}{1+\\sinh^2x}$.",
      "$1+\\sinh^2x=\\cosh^2x$.",
      "Cancel one $\\cosh x$: $\\frac{1}{\\cosh x}$."
    ],
    "trap": "Misapplying the trig identity $1+\\tan^2=\\sec^2$ as $1+\\sinh^2x=\\cosh x$, or remembering the hyperbolic identity as $\\cosh^2x+\\sinh^2x=1$.",
    "check": "At $x=0$: $\\sinh$ has slope $1$ and $\\arctan$ has slope $1$ at $0$, so together $1=\\frac{1}{\\cosh 0}$."
  },
  "db-logd-005": {
    "spot": "Both the base $x$ and the exponent $e^x$ vary: \"a variable to a variable power\" — take $\\ln$ first, then differentiate.",
    "why": "The power rule only works when the exponent is constant, the exponential rule only when the base is constant; with both varying, only logarithmic differentiation works.",
    "steps": [
      "Let $y=x^{e^x}$ and take logs: $\\ln y=e^x\\ln x$.",
      "Differentiate both sides, Product Rule on the right: $\\frac{y'}{y}=e^x\\ln x+\\frac{e^x}{x}$.",
      "Multiply back by $y$: $y'=x^{e^x}\\left(e^x\\ln x+\\frac{e^x}{x}\\right)$."
    ],
    "trap": "Using the power rule to write $e^x\\cdot x^{e^x-1}$ — that only gets the $\\frac{e^x}{x}$ half of the answer and misses $e^x\\ln x$.",
    "check": "Plug in $x=1$: $\\ln 1=0$, so the answer becomes $1\\cdot(0+e)=e$."
  },
  "db-newt-004": {
    "spot": "Newton's method: $x_{n+1}=x_n-\\frac{f(x_n)}{f'(x_n)}$ with $f=x^2-2$, $f'=2x$, iterating twice from $1$.",
    "why": "The problem specifies the method, so apply the formula twice; fractions are clearer than decimals.",
    "steps": [
      "$x_1=1-\\frac{1-2}{2}=\\frac{3}{2}$.",
      "$f\\left(\\frac{3}{2}\\right)=\\frac{9}{4}-2=\\frac{1}{4}$, $f'\\left(\\frac{3}{2}\\right)=3$.",
      "$x_2=\\frac{3}{2}-\\frac{1/4}{3}=\\frac{3}{2}-\\frac{1}{12}=\\frac{17}{12}$."
    ],
    "trap": "Writing the formula's minus as a plus: $x_1=1+\\frac{-1}{2}=\\frac{1}{2}$, moving further and further away.",
    "check": "$\\frac{17}{12}\\approx 1.4167$, only $0.0025$ away from $\\sqrt 2\\approx 1.4142$."
  },
  "db-par-007": {
    "spot": "The curve is given by a parameter $t$: $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$, the ratio of the two $t$-derivatives.",
    "why": "No need to eliminate $t$; both derivatives are one line, then plug in $t=2$.",
    "steps": [
      "$\\frac{dx}{dt}=1-\\frac{1}{t^2}$, which is $\\frac{3}{4}$ at $t=2$.",
      "$\\frac{dy}{dt}=1+\\frac{1}{t^2}$, which is $\\frac{5}{4}$ at $t=2$.",
      "$\\frac{dy}{dx}=\\frac{5/4}{3/4}=\\frac{5}{3}$."
    ],
    "trap": "Swapping numerator and denominator: $\\frac{dx/dt}{dy/dt}=\\frac{3}{5}$.",
    "check": "Eliminate $t$: $x^2-y^2=4$, upper branch $y=\\sqrt{x^2-4}$; at $t=2$, $x=\\frac{5}{2}$ and the slope is $\\frac{5/2}{3/2}=\\frac{5}{3}$."
  },
  "db-rr-006": {
    "spot": "One car heads north, one east: the distance is the hypotenuse of a right triangle, and both legs are proportional to $t$, so the distance itself is proportional to $t$.",
    "why": "Writing $D(t)=\\sqrt{(60t)^2+(80t)^2}=100t$ directly is fastest; $2DD'=2xx'+2yy'$ also works but needs an extra computation of $D$.",
    "steps": [
      "After $t$ hours, one has gone $60t$ north and the other $80t$ east.",
      "Distance $D=\\sqrt{(60t)^2+(80t)^2}=\\sqrt{10000t^2}=100t$.",
      "$\\frac{dD}{dt}=100$ at every moment, so also $100$ at $t=1$."
    ],
    "trap": "Adding the two speeds to get $140$. The distance is a hypotenuse, so the speeds combine by Pythagoras.",
    "check": "After $1$ hour the cars are $100$ km apart ($60$, $80$, $100$ is a 3-4-5 right triangle)."
  },
  "db-tay-004": {
    "spot": "A high-order derivative at $0$, $f^{(5)}(0)$: don't differentiate five times — read the $x^5$ coefficient off the Taylor series of $\\arctan x$ and multiply by $5!$.",
    "why": "$\\arctan x=x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\cdots$ is easy to remember; differentiating five times makes the expression longer and longer.",
    "steps": [
      "$\\frac{1}{1+x^2}=1-x^2+x^4-\\cdots$; integrating term by term gives $\\arctan x=x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\cdots$.",
      "The coefficient of $x^5$ is $\\frac{1}{5}$.",
      "Coefficient $=\\frac{f^{(5)}(0)}{5!}$, so $f^{(5)}(0)=\\frac{120}{5}=24$."
    ],
    "trap": "Thinking the coefficient is the derivative and answering $\\frac{1}{5}$ — forgetting to multiply by $5!$.",
    "check": "$f^{(5)}(0)$ equals the fourth derivative of $\\frac{1}{1+x^2}$ at $0$, i.e. its $x^4$ coefficient $1$ times $4!=24$."
  },
  "db-tay-006": {
    "spot": "High-order derivative of $e^{x^2}$ at $0$: substitute $u=x^2$ into the expansion of $e^u$, read the $x^4$ coefficient, and multiply by $4!$.",
    "why": "Differentiating four times produces a pile of polynomials in $x$ times $e^{x^2}$; the expansion takes one line.",
    "steps": [
      "$e^{x^2}=1+x^2+\\frac{x^4}{2}+\\frac{x^6}{6}+\\cdots$.",
      "The $x^4$ coefficient $\\frac{1}{2}=\\frac{f^{(4)}(0)}{4!}$.",
      "$f^{(4)}(0)=12$."
    ],
    "trap": "Writing the $x^4$ coefficient as $\\frac{1}{4!}$ (copying the $x^4$ term of $e^x$), which gives $1$. After substituting $u=x^2$, the $x^4$ comes from $\\frac{u^2}{2!}$.",
    "check": "$f$ is even, so all odd-order derivatives at $0$ are $0$; the second derivative is $=2\\cdot 1=2$, matching the $x^2$ coefficient $1$ times $2!$."
  },
  "depth-der-002": {
    "spot": "In $(\\sin x)^{\\cos x}$ both the base and the exponent vary with $x$: use logarithmic differentiation.",
    "why": "The power rule and the exponential rule each handle only one varying side; after taking $\\ln$ you get the product $\\cos x\\ln\\sin x$, which the Product Rule handles.",
    "steps": [
      "Let $y=(\\sin x)^{\\cos x}$, so $\\ln y=\\cos x\\,\\ln\\sin x$.",
      "Product Rule: $\\frac{y'}{y}=-\\sin x\\ln\\sin x+\\cos x\\cdot\\frac{\\cos x}{\\sin x}$.",
      "$\\frac{\\cos x}{\\sin x}=\\cot x$; multiply back by $y$: $y'=(\\sin x)^{\\cos x}\\left(-\\sin x\\ln\\sin x+\\cos x\\cot x\\right)$."
    ],
    "trap": "Missing the inner $\\cos x$ when differentiating $\\ln\\sin x$ and writing $\\frac{1}{\\sin x}$, so the second term becomes $\\frac{\\cos x}{\\sin x}$ instead of $\\cos x\\cot x$.",
    "check": "Plug in $x=\\frac{\\pi}{2}$: $\\sin=1$, $\\cos=0$, both terms are $0$, so the derivative is $0$."
  },
  "depth-der-008": {
    "spot": "$x$ and $y$ are both given in terms of $t$: the parametric slope is $\\frac{dy/dt}{dx/dt}$, and the $e^t$ cancels completely.",
    "why": "Both derivatives carry a factor $e^t$ before dividing; cancel to get $1+t$, then plug in $t=0$.",
    "steps": [
      "$\\frac{dx}{dt}=e^t$.",
      "$\\frac{dy}{dt}=e^t+te^t=(1+t)e^t$.",
      "$\\frac{dy}{dx}=1+t$, which is $1$ at $t=0$."
    ],
    "trap": "Forgetting the Product Rule when differentiating $te^t$ and writing just $te^t$, so $\\frac{dy}{dx}=t$, which is $0$ at $0$.",
    "check": "Eliminate $t$: $t=\\ln x$, $y=x\\ln x$; $t=0$ corresponds to $x=1$, and $y'=\\ln x+1=1$."
  },
  "depth-der-010": {
    "spot": "You need the \"second\" derivative of an inverse: differentiate $(f^{-1})'=\\frac{1}{f'(f^{-1})}$ once more to get $(f^{-1})''=-\\frac{f''}{(f')^3}$, evaluated at the point $0$ where $f(0)=1$.",
    "why": "The inverse can't be written out, so the formula is the only way; it needs just two numbers, $f'(0)$ and $f''(0)$.",
    "steps": [
      "$f(0)=e^0+0=1$, so $f^{-1}(1)=0$.",
      "Let $g=f^{-1}$, $g'(y)=\\frac{1}{f'(g(y))}$. Differentiate again: $g''=-\\frac{f''(g)\\,g'}{f'(g)^2}=-\\frac{f''(g)}{f'(g)^3}$.",
      "$f'(0)=1+0=1$, $f''(x)=e^x+2$, $f''(0)=3$.",
      "$(f^{-1})''(1)=-\\frac{3}{1^3}=-3$."
    ],
    "trap": "Thinking $(f^{-1})''=\\frac{1}{f''}$ and getting $\\frac{1}{3}$; or, when differentiating $g'$, missing the $g'$ that the Chain Rule brings out, so the denominator is only squared (here $f'(0)=1$ hides the difference, but on another problem it would be wrong).",
    "check": "$g(1+h)\\approx h-\\frac{3}{2}h^2$: with $h=0.01$, $f(0.00985)\\approx 1.0100$, which indeed lands back at $1.01$."
  },
  "depth-int-002": {
    "spot": "A rational function whose numerator degree $5$ exceeds the denominator's $3$: long-divide first. And the leftover $\\frac{x^2}{1+x^3}$ has a numerator that is exactly one third of the denominator's derivative.",
    "why": "One long division removes the improper fraction, and the rest is a substitution giving $\\ln$; no need to factor $1+x^3$ for partial fractions.",
    "steps": [
      "$x^5=x^2(1+x^3)-x^2$, so $\\frac{x^5}{1+x^3}=x^2-\\frac{x^2}{1+x^3}$.",
      "$\\int x^2\\,dx=\\frac{x^3}{3}$.",
      "Let $u=1+x^3$, $du=3x^2\\,dx$: $\\int\\frac{x^2}{1+x^3}dx=\\frac{1}{3}\\ln|1+x^3|$.",
      "Combine: $\\frac{x^3}{3}-\\frac{1}{3}\\ln|1+x^3|+C$."
    ],
    "trap": "Skipping the long division and setting $u=1+x^3$ directly: $x^5\\,dx=\\frac{1}{3}(u-1)\\,du$ actually works too, but many people forget to replace $x^3$ by $u-1$ and stop at $\\frac{1}{3}\\ln u$.",
    "check": "Plug in $x=1$: the integrand is $\\frac{1}{2}$, and the derivative of the answer is $1-\\frac{1}{2}=\\frac{1}{2}$."
  },
  "depth-int-023": {
    "spot": "Area enclosed by the polar curve $r=1+\\cos\\theta$ (a cardioid): use $\\frac{1}{2}\\int r^2\\,d\\theta$ with $\\theta$ going once around, $0$ to $2\\pi$.",
    "why": "The polar area element is the sector $\\frac{1}{2}r^2\\,d\\theta$; in Cartesian coordinates you'd have to deal with a quartic curve.",
    "steps": [
      "$A=\\frac{1}{2}\\int_0^{2\\pi}(1+\\cos\\theta)^2\\,d\\theta$.",
      "Expand: $1+2\\cos\\theta+\\cos^2\\theta$. Over a full turn, $\\int\\cos\\theta=0$, $\\int\\cos^2\\theta=\\pi$, $\\int 1=2\\pi$.",
      "The integral is $=2\\pi+0+\\pi=3\\pi$.",
      "Multiply by $\\frac{1}{2}$: $A=\\frac{3\\pi}{2}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ and answering $3\\pi$; or integrating only from $0$ to $\\pi$ without multiplying by $2$, getting $\\frac{3\\pi}{4}$.",
    "check": "The cardioid fits inside the circle of radius $2$ (area $4\\pi$) and contains the right half of the unit circle (area $\\frac{\\pi}{2}$): $\\frac{3\\pi}{2}\\approx 4.71$ is in between."
  },
  "depth-lim-001": {
    "spot": "The numerator is $\\sin x$ minus the first three terms of its expansion, $x-\\frac{x^3}{6}+\\frac{x^5}{120}$, and the denominator is $x^7$: whatever you subtract up to, look at the next term — here $x^7$.",
    "why": "L'Hôpital's Rule would need seven derivatives; the expansion reads off the $x^7$ coefficient $-\\frac{1}{7!}$ in one line.",
    "steps": [
      "$\\sin x=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\frac{x^7}{7!}+\\cdots$.",
      "Numerator $=\\sin x-x+\\frac{x^3}{6}-\\frac{x^5}{120}=-\\frac{x^7}{5040}+\\cdots$.",
      "Divide by $x^7$: the limit is $-\\frac{1}{5040}$."
    ],
    "trap": "Getting the sign wrong: the $\\sin$ expansion alternates, so the $x^7$ term is negative; answering $\\frac{1}{5040}$ is wrong.",
    "check": "Plug in $x=0.1$: the ratio is about $-0.000198$, consistent with $-\\frac{1}{5040}\\approx -0.000198$."
  },
  "depth-lim-002": {
    "spot": "The numerator is $\\ln(1+x)$ minus the first four terms of its expansion, and the denominator is $x^5$: you need exactly the $x^5$ coefficient of $\\ln(1+x)$.",
    "why": "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\frac{x^5}{5}-\\cdots$ is immediate; five rounds of L'Hôpital's Rule is too long.",
    "steps": [
      "$\\ln(1+x)=\\int_0^x\\frac{dt}{1+t}$; integrate $\\frac{1}{1+t}=1-t+t^2-t^3+\\frac{t^4}{1+t}$ term by term.",
      "So the numerator is $=\\int_0^x\\frac{t^4}{1+t}dt$; with $t=xu$ this equals $x^5\\int_0^1\\frac{u^4}{1+xu}du$.",
      "Divide by $x^5$; as $x\\to 0$ what remains is $\\int_0^1u^4\\,du=\\frac{1}{5}$ (which is the $x^5$ coefficient of the expansion)."
    ],
    "trap": "Thinking the coefficients of $\\ln(1+x)$ are $\\frac{1}{n!}$ like those of $e^x$, and answering $\\frac{1}{120}$. The coefficients of $\\ln(1+x)$ are $\\frac{(-1)^{n+1}}{n}$.",
    "check": "Plug in $x=0.01$: the integral is about $0.19835$, slightly less than $\\frac{1}{5}$, and the gap is exactly the next term $\\frac{x}{6}\\approx 0.0017$."
  },
  "depth-lim-004": {
    "spot": "Near $0$, $\\cos x$ and $\\sqrt{1-x^2}$ are both $1-\\frac{x^2}{2}+\\cdots$, so the first two terms cancel; the denominator $x^4$ tells you to compare $x^4$ coefficients.",
    "why": "Writing both expansions to $x^4$ and subtracting is fastest; four rounds of L'Hôpital's Rule with a square root gets messy.",
    "steps": [
      "$\\cos x=1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\cdots$.",
      "$\\sqrt{1-u}=1-\\frac{u}{2}-\\frac{u^2}{8}-\\cdots$; substitute $u=x^2$: $\\sqrt{1-x^2}=1-\\frac{x^2}{2}-\\frac{x^4}{8}-\\cdots$.",
      "Subtract: the $x^4$ coefficient is $\\frac{1}{24}+\\frac{1}{8}=\\frac{1}{6}$.",
      "Divide by $x^4$: the limit is $\\frac{1}{6}$."
    ],
    "trap": "Writing the quadratic term of $\\sqrt{1-u}$ as $+\\frac{u^2}{8}$, so the difference is $\\frac{1}{24}-\\frac{1}{8}=-\\frac{1}{12}$. The binomial coefficient is $\\binom{1/2}{2}=-\\frac{1}{8}$, and multiplying by $(-u)^2$ keeps it negative.",
    "check": "Plug in $x=0.1$: the ratio is about $0.1667$."
  },
  "depth-lim-008": {
    "spot": "$\\arcsin x$ and $\\arctan x$ are both $x+\\cdots$, so the linear terms cancel; the denominator $x^3$ tells you to compare cubic terms.",
    "why": "Both cubic coefficients, $\\frac{1}{6}$ and $-\\frac{1}{3}$, are easy to remember — just subtract. Three rounds of L'Hôpital's Rule would hit higher derivatives of a square root.",
    "steps": [
      "$\\arcsin x=x+\\frac{x^3}{6}+\\cdots$ (by integrating $\\frac{1}{\\sqrt{1-x^2}}=1+\\frac{x^2}{2}+\\cdots$).",
      "$\\arctan x=x-\\frac{x^3}{3}+\\cdots$.",
      "Subtract: $\\frac{1}{6}+\\frac{1}{3}=\\frac{1}{2}$.",
      "The limit is $\\frac{1}{2}$."
    ],
    "trap": "Remembering both cubic coefficients as $\\pm\\frac{1}{6}$ (confusing them with $\\sin$), which gives $\\frac{1}{3}$.",
    "check": "Plug in $x=0.1$: the ratio is about $0.5$."
  },
  "depth-ser-001": {
    "spot": "The numerator is a quadratic in $n$ and the denominator is $3^n$: split into $\\sum\\frac{n^2}{3^n}+\\sum\\frac{n}{3^n}$ and apply the formulas for $\\sum nr^n$ and $\\sum n^2r^n$.",
    "why": "Both sums come from differentiating the geometric series $\\sum r^n$; that's faster than shifting and subtracting by hand.",
    "steps": [
      "$\\sum_{n\\ge1}nr^n=\\frac{r}{(1-r)^2}$; $r=\\frac{1}{3}$ gives $\\frac{3}{4}$.",
      "$\\sum_{n\\ge1}n^2r^n=\\frac{r(1+r)}{(1-r)^3}$; $r=\\frac{1}{3}$ gives $\\frac{3}{2}$.",
      "Add: $\\frac{3}{2}+\\frac{3}{4}=\\frac{9}{4}$."
    ],
    "trap": "Dropping the $(1+r)$ from the $\\sum n^2r^n$ formula and writing $\\frac{r}{(1-r)^3}=\\frac{9}{8}$, so the total becomes $\\frac{15}{8}$.",
    "check": "The first three terms $\\frac{2}{3}+\\frac{6}{9}+\\frac{12}{27}\\approx 1.78$ are already approaching $2.25$ and still growing."
  },
  "depth-ser-002": {
    "spot": "The general term is \"a polynomial in $n$ times a geometric term with ratio $\\frac{1}{4}$\": $\\frac{n^2}{4^n}=n^2r^n$, so apply the $\\sum n^2r^n$ formula directly.",
    "why": "This formula comes from differentiating $\\sum r^n$ twice (multiplying by $r$ each time); memorizing it beats deriving it on the spot.",
    "steps": [
      "Formula: $\\sum_{n\\ge1}n^2r^n=\\frac{r(1+r)}{(1-r)^3}$.",
      "Plug in $r=\\frac{1}{4}$: numerator $\\frac{1}{4}\\cdot\\frac{5}{4}=\\frac{5}{16}$, denominator $\\left(\\frac{3}{4}\\right)^3=\\frac{27}{64}$.",
      "$\\frac{5}{16}\\cdot\\frac{64}{27}=\\frac{20}{27}$."
    ],
    "trap": "Misusing the $\\sum n r^n$ formula $\\frac{r}{(1-r)^2}=\\frac{4}{9}$ for $n^2$.",
    "check": "The first two terms give $\\frac{1}{4}+\\frac{4}{16}=0.5$, the remaining tail is about $0.24$, so a total of $0.74$ is reasonable."
  },
  "depth-ser-004": {
    "spot": "Coefficient of $e^{3x}$: substitute $u=3x$ into $e^u=\\sum\\frac{u^n}{n!}$; the $x^7$ coefficient is $\\frac{3^7}{7!}$.",
    "why": "Substituting into a known expansion is faster than computing a seventh derivative, and you won't forget the factor $3^7$.",
    "steps": [
      "$e^{3x}=\\sum_{n\\ge0}\\frac{3^nx^n}{n!}$; equivalently $f^{(7)}(x)=3^7e^{3x}$ and the coefficient is $\\frac{f^{(7)}(0)}{7!}$.",
      "$3^7=2187$, $7!=5040$.",
      "Divide top and bottom of $\\frac{2187}{5040}$ by $9$: $\\frac{243}{560}$."
    ],
    "trap": "Writing only $\\frac{3}{7!}$ or $\\frac{1}{7!}$, forgetting that the whole $3x$ is raised to the seventh power.",
    "check": "$\\frac{243}{560}\\approx 0.434$; the coefficients of $e^{3x}$ peak around $n\\approx 3$ and then shrink fast, so a value below $1$ at $n=7$ is reasonable."
  },
  "depth-ser-006": {
    "spot": "$\\frac{\\sin x}{x}$: divide the whole $\\sin x$ expansion by $x$, lowering each term by one degree; the $x^6$ term comes from the $x^7$ term of $\\sin x$.",
    "why": "Just divide the known series by $x$; no need for high-order derivatives of $\\frac{\\sin x}{x}$ (which also needs a definition at $0$).",
    "steps": [
      "$\\sin x=x-\\frac{x^3}{6}+\\frac{x^5}{120}-\\frac{x^7}{5040}+\\cdots$.",
      "Divide by $x$: $\\frac{\\sin x}{x}=1-\\frac{x^2}{6}+\\frac{x^4}{120}-\\frac{x^6}{5040}+\\cdots$.",
      "The $x^6$ coefficient is $-\\frac{1}{5040}$."
    ],
    "trap": "Thinking the $x^6$ coefficient comes from the \"sixth term\" of $\\sin x$, or using $\\frac{1}{6!}$. $\\sin x$ has only odd powers; after dividing by $x$, $x^6$ corresponds to the $x^7$ coefficient $-\\frac{1}{7!}$.",
    "check": "Sign check: the coefficients $1,-\\frac{1}{6},\\frac{1}{120},-\\frac{1}{5040}$ alternate, so the fourth one is negative."
  },
  "depth-ser-007": {
    "spot": "Only even factorials $\\frac{1}{(2n)!}$: this is the $e^x$ expansion keeping only the even terms, i.e. $\\cosh 1=\\frac{e+e^{-1}}{2}$.",
    "why": "In $e^1+e^{-1}$ the odd terms cancel and the even terms double; dividing by $2$ leaves exactly the even terms. No separate estimate needed.",
    "steps": [
      "$e^x=\\sum\\frac{x^k}{k!}$, $e^{-x}=\\sum\\frac{(-1)^kx^k}{k!}$.",
      "Add and divide by $2$: the odd terms vanish, $\\frac{e^x+e^{-x}}{2}=\\sum\\frac{x^{2n}}{(2n)!}=\\cosh x$.",
      "Plug in $x=1$: $\\sum_{n\\ge0}\\frac{1}{(2n)!}=\\frac{e+e^{-1}}{2}$ (writing $(2n)!$ as $\\int_0^\\infty t^{2n}e^{-t}dt$, the numbers check out too)."
    ],
    "trap": "Seeing factorials and answering $e$. That's the sum of all the $\\frac{1}{k!}$; here you only take half the terms.",
    "check": "$1+\\frac{1}{2}+\\frac{1}{24}\\approx 1.5417$ versus $\\cosh 1\\approx 1.5431$ — the gap is about the next term $\\frac{1}{720}$."
  },
  "depth-ser-008": {
    "spot": "$\\frac{n}{3^{n+1}}=\\frac{1}{3}\\cdot\\frac{n}{3^n}$: pull out the extra $\\frac{1}{3}$ first, leaving $\\sum nr^n$.",
    "why": "After pulling out the constant, apply $\\frac{r}{(1-r)^2}$ directly.",
    "steps": [
      "$\\sum\\frac{n}{3^{n+1}}=\\frac{1}{3}\\sum\\frac{n}{3^n}$.",
      "$\\sum_{n\\ge1}nr^n=\\frac{r}{(1-r)^2}$ with $r=\\frac{1}{3}$: $\\frac{1/3}{4/9}=\\frac{3}{4}$.",
      "Multiply by $\\frac{1}{3}$: $\\frac{1}{4}$."
    ],
    "trap": "Treating $\\frac{1}{3^{n+1}}$ as $\\frac{1}{3^n}$ and answering $\\frac{3}{4}$.",
    "check": "The first term is $\\frac{1}{9}\\approx 0.111$ and the second $\\frac{2}{27}\\approx 0.074$, so a total of $0.25$ is reasonable."
  },
  "depth-ser-009": {
    "spot": "The coefficient $\\binom{2n}{n}$ is a ratio of factorials: use the Ratio Test, and the ratio of consecutive terms becomes a rational function of $n$.",
    "why": "Factorials cancel massively under the Ratio Test; the Root Test would need Stirling's formula.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(2n+2)!}{((n+1)!)^2}\\cdot\\frac{(n!)^2}{(2n)!}=\\frac{(2n+2)(2n+1)}{(n+1)^2}$.",
      "As $n\\to\\infty$ this ratio $\\to 4$.",
      "Radius of convergence $R=\\frac{1}{4}$."
    ],
    "trap": "Flipping the ratio (using $\\frac{a_n}{a_{n+1}}$ and then taking the reciprocal again), answering $4$. The ratio's limit is $L$; the radius is $\\frac{1}{L}$.",
    "check": "$\\binom{2n}{n}$ grows roughly like $4^n$ (at $n=10$ it's $184756$, while $4^{10}\\approx 10^6$), so you need $|x|<\\frac{1}{4}$ to keep it in check."
  },
  "depth-ser-010": {
    "spot": "The coefficient is $\\frac{(n!)^2}{(2n)!}3^n$, all factorials and powers: use the Ratio Test, and the factorials reduce to a rational function of $n$.",
    "why": "The Ratio Test removes the factorials in one step; the Root Test would require estimating $((2n)!)^{1/n}$, which is a hassle.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)^2}{(2n+2)(2n+1)}\\cdot 3$.",
      "As $n\\to\\infty$: $\\to\\frac{3}{4}$.",
      "Radius of convergence $R=\\frac{4}{3}$."
    ],
    "trap": "Forgetting that $3^n$ also contributes a factor $3$, getting a ratio of $\\frac{1}{4}$ and radius $4$.",
    "check": "The coefficient is $\\frac{3^n}{\\binom{2n}{n}}$, and $\\binom{2n}{n}$ grows roughly like $4^n$, so the coefficient is about $\\left(\\frac{3}{4}\\right)^n$ and the radius is $\\frac{4}{3}$ — consistent."
  },
  "depth-ser-012": {
    "spot": "$\\frac{n^2}{2^{n+1}}=\\frac{1}{2}\\cdot n^2\\left(\\frac{1}{2}\\right)^n$: pull out $\\frac{1}{2}$, then apply $\\sum n^2r^n$.",
    "why": "$\\sum n^2r^n=\\frac{r(1+r)}{(1-r)^3}$ is ready to use; with $r=\\frac{1}{2}$ the denominator is $\\frac{1}{8}$, easy to compute.",
    "steps": [
      "$\\sum\\frac{n^2}{2^{n+1}}=\\frac{1}{2}\\sum\\frac{n^2}{2^n}$.",
      "$r=\\frac{1}{2}$: $\\frac{\\frac{1}{2}\\cdot\\frac{3}{2}}{\\frac{1}{8}}=6$.",
      "Multiply by $\\frac{1}{2}$: $3$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ you pulled out and answering $6$.",
    "check": "The first four terms $\\frac{1}{4}+\\frac{4}{8}+\\frac{9}{16}+\\frac{16}{32}=1.8125$, still climbing toward $3$."
  },
  "depth-ser-016": {
    "spot": "$n^3r^n$ with $r=\\frac{1}{3}$: apply $r\\frac{d}{dr}$ to the geometric series three times to get the formula $\\sum n^3r^n=\\frac{r(1+4r+r^2)}{(1-r)^4}$.",
    "why": "Each extra factor of $n$ is one round of \"differentiate, then multiply by $r$\"; using the formula after three rounds is fastest.",
    "steps": [
      "Apply $r\\frac{d}{dr}$ once more to $\\sum n^2r^n=\\frac{r(1+r)}{(1-r)^3}$.",
      "Plug in $r=\\frac{1}{3}$: numerator $\\frac{1}{3}\\left(1+\\frac{4}{3}+\\frac{1}{9}\\right)=\\frac{22}{27}$, denominator $\\left(\\frac{2}{3}\\right)^4=\\frac{16}{81}$.",
      "$\\frac{22}{27}\\cdot\\frac{81}{16}=\\frac{33}{8}$."
    ],
    "trap": "Thinking the formula is $\\frac{r(1+r)^2}{(1-r)^4}$ (misremembering $1+4r+r^2$), which gives $3$.",
    "check": "The first three terms $\\frac{1}{3}+\\frac{8}{9}+1\\approx 2.22$, the fourth $\\frac{64}{81}\\approx 0.79$, so a total of $4.125$ is reasonable."
  },
  "dx-tan-001": {
    "spot": "Where the tangent line meets the $x$-axis: compute the point of tangency $(2,y(2))$ and slope $y'(2)$, set $y=0$ in the tangent line and solve for $x$, which gives $x=2-\\frac{y(2)}{y'(2)}$.",
    "why": "This is exactly one step of Newton's method; using the formula saves a step over writing out the full tangent line and solving.",
    "steps": [
      "Point of tangency: $y(2)=\\frac{2}{5}$.",
      "$y'=\\frac{(x^2+1)-2x^2}{(x^2+1)^2}=\\frac{1-x^2}{(x^2+1)^2}$, $y'(2)=-\\frac{3}{25}$.",
      "Tangent line $y=\\frac{2}{5}-\\frac{3}{25}(x-2)$; set $y=0$: $x-2=\\frac{2/5}{3/25}=\\frac{10}{3}$.",
      "$x=2+\\frac{10}{3}=\\frac{16}{3}$, so the intersection is $\\left(\\frac{16}{3},0\\right)$."
    ],
    "trap": "Reversing the order in the Quotient Rule numerator, getting $y'(2)=+\\frac{3}{25}$, which sends the intersection to $2-\\frac{10}{3}=-\\frac{4}{3}$.",
    "check": "The point of tangency is above the $x$-axis and the tangent slopes downward, so the intersection should be to the right of $x=2$: $\\frac{16}{3}>2$."
  },
  "exam-multi-004": {
    "spot": "The $H$ (Hessian) determinant of a two-variable function at a point: compute the three second partials $f_{xx},f_{yy},f_{xy}$, plug in $(1,1)$, and form $f_{xx}f_{yy}-f_{xy}^2$.",
    "why": "Partial derivatives of a polynomial are mechanical; and $(1,1)$ is a critical point, so this determinant is the second-derivative test discriminant.",
    "steps": [
      "$f_x=3x^2-3y$, $f_y=3y^2-3x$.",
      "$f_{xx}=6x$, $f_{yy}=6y$, both $6$ at $(1,1)$.",
      "$f_{xy}=\\frac{\\partial}{\\partial y}(3x^2-3y)=-3$.",
      "$\\det\\begin{pmatrix}6&-3\\\\-3&6\\end{pmatrix}=36-9=27$."
    ],
    "trap": "Computing the cross term as $(-3)\\cdot(-3)$ and then forgetting it's subtracted, writing $36+9=45$.",
    "check": "$(1,1)$ is a critical point ($f_x=f_y=0$), the determinant is $>0$ and $f_{xx}>0$, so it's a local min."
  },
  "exam-multi-008": {
    "spot": "$u=x^2-y^2$, $v=2xy$ are exactly the real and imaginary parts of $(x+iy)^2$: for the Jacobian, compute the four partials and arrange them in a $2\\times 2$.",
    "why": "Using the definition $u_xv_y-u_yv_x$ gets it in one step; no need for polar coordinates.",
    "steps": [
      "$u_x=2x$, $u_y=-2y$.",
      "$v_x=2y$, $v_y=2x$.",
      "$\\frac{\\partial(u,v)}{\\partial(x,y)}=u_xv_y-u_yv_x=4x^2+4y^2=4(x^2+y^2)$."
    ],
    "trap": "Sign error in the cross term: $u_yv_x=(-2y)(2y)=-4y^2$, and subtracting it adds $4y^2$; writing $4x^2-4y^2$ is wrong.",
    "check": "At $(1,0)$: $u_x=2$, $v_y=2$, cross term $0$, determinant $4=4(1+0)$."
  },
  "gap-der-app-001": {
    "spot": "Sphere volume $V=\\frac{4}{3}\\pi r^3$ with a changing radius: differentiate with respect to $t$ using the Chain Rule, $\\frac{dV}{dt}=4\\pi r^2\\frac{dr}{dt}$.",
    "why": "The standard related-rates moves: write the relation, differentiate with respect to time, plug in current values.",
    "steps": [
      "$\\frac{dV}{dr}=4\\pi r^2$ (which happens to be the surface area).",
      "Chain Rule: $\\frac{dV}{dt}=4\\pi r^2\\cdot\\frac{dr}{dt}$.",
      "Plug in $r=3$, $\\frac{dr}{dt}=2$: $4\\pi\\cdot 9\\cdot 2=72\\pi$."
    ],
    "trap": "Plugging in $r=3$ first to get $V=36\\pi$ and then differentiating with respect to $t$, which gives $0$. Differentiate first, plug in numbers last.",
    "check": "$72\\pi\\approx 226$; the surface area $36\\pi\\approx 113$ times a thickness growing by $2$ per unit time — it matches."
  },
  "gap-ser-taylor-001": {
    "spot": "The Maclaurin series of $\\sin x$ has only odd powers, with coefficients $\\frac{(-1)^k}{(2k+1)!}$: $x^5$ is the third term, with a plus sign.",
    "why": "Read it off the memorized expansion; or use $\\frac{f^{(5)}(0)}{5!}$, where the fifth derivative of $\\sin$ is $\\cos$.",
    "steps": [
      "$\\sin x=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\cdots$.",
      "Differentiating $\\sin$ five times gives $\\cos x$, which is $1$ at $0$; $5!=120$.",
      "The coefficient is $\\frac{1}{120}$."
    ],
    "trap": "Getting the sign wrong and thinking the $x^5$ term is negative; or writing $\\frac{1}{5}$ and forgetting the factorial.",
    "check": "Plug in $x=0.1$: $\\frac{\\sin x-x+x^3/6}{x^5}\\approx 0.00833$."
  },
  "hc-spec-009": {
    "spot": "The coefficient $\\frac{(3n)!}{(n!)^3}$ is a ratio of factorials: use the Ratio Test. $(3n+3)!$ has three more factors than $(3n)!$, and $((n+1)!)^3$ has an extra $(n+1)^3$.",
    "why": "The Ratio Test cancels the factorials down to three linear factors over $(n+1)^3$, so the limit is obvious.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(3n+3)(3n+2)(3n+1)}{(n+1)^3}$.",
      "Numerator and denominator are both cubic, with leading-coefficient ratio $\\frac{27}{1}$: the limit is $27$.",
      "Radius of convergence $\\frac{1}{27}$."
    ],
    "trap": "Writing only the single factor $(3n+1)$ (thinking $(3n+3)!$ has just one more factor than $(3n)!$), which gives $\\frac{3n+1}{(n+1)^3}\\to 0$ and wrongly suggests an infinite radius.",
    "check": "The coefficients for $n=0,1,2$ are $1,6,90$, with consecutive ratios $6,15$ climbing toward $27$."
  },
  "hd-002": {
    "spot": "Fourth derivative at $0$: substitute $u=x^2$ into the expansion of $e^u$ for $e^{x^2}$, read the $x^4$ coefficient $\\frac{1}{2!}$, and multiply by $4!$.",
    "why": "Differentiating four times directly produces something like $(16x^4+48x^2+12)e^{x^2}$; the expansion needs no differentiation.",
    "steps": [
      "$e^{x^2}=1+x^2+\\frac{x^4}{2!}+\\cdots$.",
      "$\\frac{f^{(4)}(0)}{4!}=\\frac{1}{2}$.",
      "$f^{(4)}(0)=\\frac{24}{2}=12$."
    ],
    "trap": "Reading the $x^4$ coefficient as $\\frac{1}{4!}$ and answering $1$.",
    "check": "The direct fourth derivative $(16x^4+48x^2+12)e^{x^2}$ is $12$ at $0$."
  },
  "hd-003": {
    "spot": "Sixth derivative at $0$: $e^{x^2}=\\sum\\frac{x^{2k}}{k!}$, and $x^6$ is the $k=3$ term with coefficient $\\frac{1}{3!}$; then multiply by $6!$.",
    "why": "Differentiating six times is impractical; reading the coefficient takes one division.",
    "steps": [
      "$e^{x^2}=1+x^2+\\frac{x^4}{2}+\\frac{x^6}{6}+\\cdots$.",
      "$\\frac{f^{(6)}(0)}{6!}=\\frac{1}{6}$, $6!=720$.",
      "$f^{(6)}(0)=\\frac{720}{6}=120$."
    ],
    "trap": "Taking the $x^6$ coefficient as $\\frac{1}{6!}$ and answering $1$; $x^6=(x^2)^3$ comes from $\\frac{u^3}{3!}$.",
    "check": "The pattern $f^{(2k)}(0)=\\frac{(2k)!}{k!}$: $k=2$ gives $12$, $k=3$ gives $120$."
  },
  "hd-004": {
    "spot": "Tenth derivative of $x\\sin x$ at $0$: $x\\sin x=x^2-\\frac{x^4}{3!}+\\cdots$, and $x^{10}$ comes from the $x^9$ term $\\frac{x^9}{9!}$ of $\\sin x$.",
    "why": "The Leibniz formula works too, but reading the coefficient from the expansion and multiplying by $10!$ takes one line.",
    "steps": [
      "$x\\sin x=\\sum_k\\frac{(-1)^kx^{2k+2}}{(2k+1)!}$; $x^{10}$ corresponds to $k=4$, with coefficient $\\frac{(+1)}{9!}$.",
      "$\\frac{f^{(10)}(0)}{10!}=\\frac{1}{9!}$.",
      "$f^{(10)}(0)=\\frac{10!}{9!}=10$."
    ],
    "trap": "The sign for $k=4$ is $(-1)^4=+1$; misreading it as negative gives $-10$.",
    "check": "Leibniz formula: $(x\\sin x)^{(10)}=x\\sin^{(10)}x+10\\sin^{(9)}x$, which at $0$ leaves $10\\cos 0=10$."
  },
  "hd-007": {
    "spot": "Seventh derivative of $\\arctan x$ at $0$: take the $x^7$ coefficient $-\\frac{1}{7}$ of the expansion $x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\frac{x^7}{7}+\\cdots$ and multiply by $7!$.",
    "why": "Formulas for higher derivatives of $\\arctan$ are messy; the expansion comes from integrating $\\frac{1}{1+x^2}$ term by term, in one line.",
    "steps": [
      "$\\frac{1}{1+x^2}=\\sum(-1)^kx^{2k}$; integrating gives $\\arctan x=\\sum\\frac{(-1)^kx^{2k+1}}{2k+1}$.",
      "The $x^7$ coefficient ($k=3$): $-\\frac{1}{7}$.",
      "$f^{(7)}(0)=-\\frac{1}{7}\\cdot 5040=-720$."
    ],
    "trap": "Forgetting the alternating sign and answering $+720$; or forgetting to multiply by $7!$ and answering $-\\frac{1}{7}$.",
    "check": "For $\\arctan x$, $f^{(2k+1)}(0)=(-1)^k(2k)!$: $k=3$ gives $-6!=-720$."
  },
  "hd-008": {
    "spot": "The expansion of $\\tan x$ can't be read off a simple formula: use $\\tan'=1+\\tan^2$ to generate the coefficients one after another recursively.",
    "why": "Long division of $\\frac{\\sin x}{\\cos x}$ out to $x^7$ is error-prone; each recursive step needs just one multiplication.",
    "steps": [
      "Let $\\tan x=x+a_3x^3+a_5x^5+a_7x^7+\\cdots$, with $(\\tan x)'=1+\\tan^2x$.",
      "Match $x^2$ coefficients: $3a_3=1$, $a_3=\\frac{1}{3}$; match $x^4$: $5a_5=2a_3$, $a_5=\\frac{2}{15}$.",
      "Match $x^6$: the $x^6$ coefficient of $\\tan^2x$ is $2a_5+a_3^2=\\frac{4}{15}+\\frac{1}{9}=\\frac{17}{45}$, so $7a_7=\\frac{17}{45}$.",
      "$a_7=\\frac{17}{315}$."
    ],
    "trap": "Computing only $2a_5$ for the $x^6$ coefficient of $\\tan^2x$ and missing $a_3^2$, which gives $\\frac{4}{105}$.",
    "check": "$\\tan 0.5\\approx 0.546302$; the expansion through $x^7$ gives $0.5+0.041667+0.004167+0.000422\\approx 0.546256$, very close."
  },
  "hd-012": {
    "spot": "$\\tan^2x=\\sec^2x-1=(\\tan x)'-1$: differentiate the expansion of $\\tan x$ once, subtract $1$, and read the coefficient.",
    "why": "Faster than squaring the $\\tan x$ expansion yourself, and you can't miss a cross term.",
    "steps": [
      "$(\\tan x)'=\\sec^2x=1+\\tan^2x$, so $\\tan^2x=(\\tan x)'-1$.",
      "$\\tan x=x+\\frac{x^3}{3}+\\frac{2x^5}{15}+\\cdots$; differentiate: $1+x^2+\\frac{2}{3}x^4+\\cdots$.",
      "After subtracting $1$, the $x^4$ coefficient is $\\frac{2}{3}$."
    ],
    "trap": "When squaring by hand, counting the cross term of $\\left(\\frac{x^3}{3}\\right)$ and $x$ only once, getting $\\frac{1}{3}$. The cross term must be multiplied by $2$.",
    "check": "Squaring directly: $(x+\\frac{x^3}{3})^2=x^2+\\frac{2}{3}x^4+\\cdots$, the same."
  },
  "lec-07-q2a": {
    "spot": "$n=0$: $\\sin^0x=1$, so the integral is just the length of the interval.",
    "why": "$I_0$ is the starting point of the reduction formula $I_n=\\frac{n-1}{n}I_{n-2}$ and has to be computed directly.",
    "steps": [
      "$\\sin^0x=1$ (wherever $\\sin x\\neq 0$; the endpoint doesn't affect the integral).",
      "$I_0=\\int_0^{\\pi/2}1\\,dx=\\frac{\\pi}{2}$.",
      "The answer is $\\frac{\\pi}{2}$."
    ],
    "trap": "Confusing it with $I_1=\\int_0^{\\pi/2}\\sin x\\,dx=1$.",
    "check": "The recursion gives $I_2=\\frac{1}{2}I_0=\\frac{\\pi}{4}$, the same as computing $\\int_0^{\\pi/2}\\sin^2x\\,dx$ directly."
  },
  "lec-08-q4b": {
    "spot": "$n=0$: $x^0=1$, leaving $\\int_0^\\infty e^{-x}dx$; the antiderivative $-e^{-x}$ tends to $0$ at infinity.",
    "why": "$I_0$ is the starting point of the recursion $I_n=nI_{n-1}$; write the improper integral as $\\lim_{t\\to\\infty}\\int_0^t$ and take the limit.",
    "steps": [
      "$\\int_0^te^{-x}dx=\\left[-e^{-x}\\right]_0^t=1-e^{-t}$.",
      "As $t\\to\\infty$, $e^{-t}\\to 0$.",
      "$I_0=1$."
    ],
    "trap": "Plugging in the limits in the wrong order, getting $e^{-t}-1\\to -1$; the integral of a positive function can't be negative.",
    "check": "The recursion gives $I_1=1\\cdot I_0=1$, and computing $\\int_0^\\infty xe^{-x}dx$ directly also gives $1$."
  },
  "lec-16-q1a": {
    "spot": "Distance from a point to a plane: use $\\frac{|ax_0+by_0+cz_0-d|}{\\sqrt{a^2+b^2+c^2}}$; the normal vector $(2,-1,2)$ has length exactly $3$.",
    "why": "The formula projects the vector from a point on the plane to your point onto the normal; no need to find the foot of the perpendicular.",
    "steps": [
      "Plug in $Q(1,2,3)$: $2\\cdot1-2+2\\cdot3-5=1$.",
      "$|\\vec n|=\\sqrt{4+1+4}=3$.",
      "Distance $\\frac{|1|}{3}=\\frac{1}{3}$."
    ],
    "trap": "Forgetting to subtract $5$ (the plane written as $2x-y+2z-5=0$), so the numerator comes out $6$ and the answer $2$.",
    "check": "The foot of the perpendicular $Q-\\frac{1}{9}(2,-1,2)=\\left(\\frac{7}{9},\\frac{19}{9},\\frac{25}{9}\\right)$ plugged back into the plane gives exactly $5$."
  },
  "lec-17-q3b": {
    "spot": "Directional derivative $=\\nabla T\\cdot\\vec u$, and $(3,4)$ is not a unit vector: divide by its length $5$ first.",
    "why": "The definition is the gradient dotted with a unit vector; forget to normalize and you're off by a factor of five.",
    "steps": [
      "$T_x=-2x$, which is $-4$ at $(2,1)$.",
      "$T_y=-4y$, which is $-4$ at $(2,1)$.",
      "$\\vec u=\\left(\\frac{3}{5},\\frac{4}{5}\\right)$.",
      "$D_uT=-4\\cdot\\frac{3}{5}-4\\cdot\\frac{4}{5}=-\\frac{28}{5}$."
    ],
    "trap": "Dotting with $(3,4)$ directly and getting $-28$.",
    "check": "The size of a directional derivative can't exceed the gradient's length $|\\nabla T|=4\\sqrt 2\\approx 5.66$: $5.6$ doesn't."
  },
  "lec-18-q2a": {
    "spot": "Interior critical points: solve $f_x=0$, $f_y=0$. $f_y=-2x+2$ involves only $x$, giving $x=1$ at a glance.",
    "why": "Solve the one-variable equation first, then substitute into the other.",
    "steps": [
      "$f_x=2x-2y$, $f_y=-2x+2$.",
      "$f_y=0\\Rightarrow x=1$; substituting into $f_x=0\\Rightarrow y=1$. The critical point $(1,1)$ is inside the rectangle.",
      "$f(1,1)=1-2+2=1$."
    ],
    "trap": "Getting a sign wrong in the function value at the critical point: $-2xy$ at $(1,1)$ is $-2$; writing $+2$ gives $5$.",
    "check": "Along the diagonal $y=x$: $f(x,x)=-x^2+2x$ has its maximum $1$ at $x=1$."
  },
  "lec-19-m4": {
    "spot": "The base is a disk and the height is $x^2+y^2=r^2$: switch to polar coordinates; the integrand becomes $r^2$ and the area element $r\\,dr\\,d\\theta$.",
    "why": "A disk with $x^2+y^2$ is the signature case for polar coordinates; in Cartesian coordinates you'd need limits involving $\\sqrt{1-x^2}$, which is much more work.",
    "steps": [
      "$V=\\int_0^{2\\pi}\\int_0^1r^2\\cdot r\\,dr\\,d\\theta$.",
      "The $\\theta$ integral gives $2\\pi$.",
      "$V=2\\pi\\cdot\\frac{1}{4}=\\frac{\\pi}{2}$."
    ],
    "trap": "Dropping the $r$ in the area element and integrating $\\int_0^1r^2\\,dr=\\frac{1}{3}$, which gives $\\frac{2\\pi}{3}$.",
    "check": "The solid sits inside the cylinder of height $1$ (volume $\\pi$) and is bowl-shaped, so half of that is reasonable."
  },
  "lec-19-q2a": {
    "spot": "The region is an annulus and the integrand is $\\frac{1}{x^2+y^2}=\\frac{1}{r^2}$: use polar coordinates; after multiplying by $r$ you're left with $\\frac{1}{r}$.",
    "why": "In polar coordinates the annulus is the rectangle $1\\le r\\le 2$, $0\\le\\theta\\le 2\\pi$ — all limits are constants.",
    "steps": [
      "$\\iint_D\\frac{dA}{x^2+y^2}=\\int_0^{2\\pi}\\int_1^2\\frac{1}{r^2}\\,r\\,dr\\,d\\theta$.",
      "$\\int_1^2\\frac{dr}{r}=\\ln 2$.",
      "Multiply by $2\\pi$: $2\\pi\\ln 2$."
    ],
    "trap": "Forgetting the $r$ in $r\\,dr$ and integrating $\\int_1^2r^{-2}dr=\\frac{1}{2}$, which gives $\\pi$.",
    "check": "On the annulus the integrand is between $\\frac{1}{4}$ and $1$, and the annulus has area $3\\pi$: the answer $\\approx 4.36$ lies between $\\frac{3\\pi}{4}$ and $3\\pi$."
  },
  "lec-20-q2c": {
    "spot": "The field is conservative and the curve is \"any curve\": the line integral depends only on the endpoints. Find a potential $f$ with $\\nabla f=\\mathbf F$; the answer is $f(1,2,3)-f(0,0,0)$.",
    "why": "With a potential you never need to parametrize the curve; path independence is exactly what conservative means.",
    "steps": [
      "$f_x=2xy\\Rightarrow f=x^2y+g(y,z)$; $f_y=x^2+g_y=x^2+2yz\\Rightarrow g=y^2z+h(z)$; $f_z=y^2$ gives $h'=0$. So $f=x^2y+y^2z$.",
      "$f(1,2,3)=2+12=14$, $f(0,0,0)=0$.",
      "$\\int_C\\mathbf F\\cdot d\\mathbf r=14$."
    ],
    "trap": "Counting the $x^2$ term twice in the potential, writing $f=x^2y+x^2y+y^2z$ and answering $16$. After integrating one component, only add the parts that haven't appeared yet.",
    "check": "Integrate directly along the line $(t,2t,3t)$: $\\mathbf F\\cdot\\mathbf r'=42t^2$, and $\\int_0^1 42t^2\\,dt=14$."
  },
  "lm-rs-010": {
    "spot": "The shape $\\frac{1}{n}\\sum f\\left(\\frac{k}{n}\\right)$: dividing top and bottom by $n^2$ gives $\\frac{(k/n)^2}{1+(k/n)^2}$, a Riemann sum for $\\int_0^1\\frac{x^2}{1+x^2}dx$.",
    "why": "Once you see the sum as an integral, splitting $\\frac{x^2}{1+x^2}=1-\\frac{1}{1+x^2}$ finishes it; the sum itself has no closed form.",
    "steps": [
      "$\\frac{k^2}{n^2+k^2}=\\frac{(k/n)^2}{1+(k/n)^2}$ with $x_k=\\frac{k}{n}$, $\\Delta x=\\frac{1}{n}$.",
      "The limit is $\\int_0^1\\frac{x^2}{1+x^2}dx$; split it as $1-\\frac{1}{1+x^2}$.",
      "$\\int_0^1\\left(1-\\frac{1}{1+x^2}\\right)dx=1-\\arctan 1=1-\\frac{\\pi}{4}$."
    ],
    "trap": "Reading it as $\\int_0^1\\frac{1}{1+x^2}dx=\\frac{\\pi}{4}$, missing the $x^2$ in the numerator.",
    "check": "The integrand increases from $0$ to $\\frac{1}{2}$ on $[0,1]$, so the area $\\approx 0.215$ is less than $\\frac{1}{2}$."
  },
  "mob-bessel-001": {
    "spot": "$J_0(x)=\\sum_{k\\ge0}\\frac{(-1)^k}{(k!)^2}\\left(\\frac{x}{2}\\right)^{2k}$: plug in $x=0$; every term with $k\\ge1$ has a factor of $x$, so only the constant term survives.",
    "why": "A power series at its center equals its constant term; no summing required.",
    "steps": [
      "$J_0(x)=1-\\frac{x^2}{4}+\\frac{x^4}{64}-\\cdots$.",
      "The $k=0$ term is $\\frac{1}{(0!)^2}=1$; all the others are $0$ at $x=0$.",
      "The integral form $J_0(x)=\\frac{1}{\\pi}\\int_0^\\pi\\cos(x\\sin\\theta)\\,d\\theta$ agrees: at $x=0$ the integrand is identically $1$, so $J_0(0)=1$."
    ],
    "trap": "Confusing it with $J_1$ and thinking Bessel functions are all $0$ at $0$. Only $J_0(0)=1$; for $n\\ge1$, $J_n(0)$ is $0$.",
    "check": "The integral form of $J_0(x)$ at $x=0.01$ is about $0.999975$, close to $1$."
  },
  "mob-bessel-002": {
    "spot": "$J_1(x)=\\sum_{k\\ge0}\\frac{(-1)^k}{k!(k+1)!}\\left(\\frac{x}{2}\\right)^{2k+1}$: every term has at least one factor of $x$, so they all vanish at $0$.",
    "why": "A series for an odd function has no constant term, so its value at the center is $0$.",
    "steps": [
      "$J_1(x)=\\frac{x}{2}-\\frac{x^3}{16}+\\cdots$; the lowest power is $x^1$.",
      "Another view: $J_1=-J_0'$, and $J_0=1-\\frac{x^2}{4}+\\cdots$ is even, so its slope at $0$ is $0$.",
      "Integral form $J_1(x)=\\frac{1}{\\pi}\\int_0^\\pi\\cos(\\theta-x\\sin\\theta)\\,d\\theta$; at $x=0$ it's $\\frac{1}{\\pi}\\int_0^\\pi\\cos\\theta\\,d\\theta=0$."
    ],
    "trap": "Thinking $J_1(0)=1$ (carrying over the result for $J_0$).",
    "check": "$J_0'=-J_1$: verify this relation at $x=0.7$ using the integral forms."
  },
  "mob-bessel-003": {
    "spot": "In the $J_0$ series $\\sum\\frac{(-1)^k}{(k!)^2}\\left(\\frac{x}{2}\\right)^{2k}$, $x^2$ is the $k=1$ term.",
    "why": "Just read the second term of the series; you can also verify by matching coefficients in Bessel's equation $xy''+y'+xy=0$.",
    "steps": [
      "$k=1$: $\\frac{-1}{(1!)^2}\\left(\\frac{x}{2}\\right)^2=-\\frac{x^2}{4}$.",
      "Check with the equation: let $J_0=1+ax^2+\\cdots$; the $x^1$ coefficient in $xy''+y'+xy=0$ gives $2a+2a+1=0$, so $a=-\\frac{1}{4}$.",
      "Numerical check with the integral form: $\\frac{J_0(x)-1}{x^2}\\to-\\frac{1}{4}$."
    ],
    "trap": "Forgetting the $\\frac{1}{4}$ from $\\left(\\frac{x}{2}\\right)^2$ and answering $-1$.",
    "check": "Near $0$, $J_0$ is a downward-opening parabola ($J_0''(0)=-\\frac{1}{2}<0$), so a negative coefficient makes sense."
  },
  "mob-bessel-004": {
    "spot": "In the $J_1$ series $\\sum\\frac{(-1)^k}{k!(k+1)!}\\left(\\frac{x}{2}\\right)^{2k+1}$, $x^1$ is the $k=0$ term.",
    "why": "Just read the first term; you can also derive it from $J_1=-J_0'$ and $J_0=1-\\frac{x^2}{4}$.",
    "steps": [
      "$k=0$: $\\frac{1}{0!\\,1!}\\cdot\\frac{x}{2}=\\frac{x}{2}$.",
      "Compare: $-J_0'=-\\frac{d}{dx}\\left(1-\\frac{x^2}{4}\\right)=\\frac{x}{2}$.",
      "Numerical check with the integral form: $\\frac{J_1(x)}{x}\\to\\frac{1}{2}$."
    ],
    "trap": "Thinking the leading coefficient is $1$ (like for $\\sin x$), forgetting the $\\frac{1}{2}$ in $\\left(\\frac{x}{2}\\right)$.",
    "check": "$J_1'(0)=\\frac{1}{2}$: differentiate the integral form at $0$."
  },
  "mob-limtrap-003": {
    "spot": "Numerator $1-\\cos x-\\frac{x^2}{2}$: the leading term of $1-\\cos x$ is exactly $\\frac{x^2}{2}$, which has been subtracted off, so look at the $x^4$ term.",
    "why": "The expansion reads off the $x^4$ coefficient in one line; L'Hôpital's Rule would need four derivatives.",
    "steps": [
      "$\\cos x=1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\cdots$, so $1-\\cos x=\\frac{x^2}{2}-\\frac{x^4}{24}+\\cdots$.",
      "Subtract $\\frac{x^2}{2}$: the numerator is $=-\\frac{x^4}{24}+\\cdots$.",
      "Divide by $x^4$: the limit is $-\\frac{1}{24}$."
    ],
    "trap": "Sign error: $1-\\cos x$ flips all the signs of $\\cos$, so the $x^4$ term is $-\\frac{1}{24}$, not $+\\frac{1}{24}$.",
    "check": "Plug in $x=0.1$: the ratio is about $-0.04166$."
  }
};
