// Detail v2, English — batch 024. Translation of tools/content/detail/024.js (text only; claims live in the Chinese file).
module.exports = {
  "dd-inv-006": {
    "spot": "$\\ln$ wrapped around $\\cosh x$: the log-derivative rule is \"derivative of the inside over the inside\", and $(\\cosh x)'=\\sinh x$.",
    "why": "One layer of the Chain Rule and you're done; no need to rewrite $\\cosh x$ as exponentials and expand.",
    "steps": [
      "Chain Rule: $\\frac{d}{dx}\\ln u=\\frac{u'}{u}$, here with $u=\\cosh x$.",
      "$(\\cosh x)'=\\sinh x$ (not $-\\sinh x$ — hyperbolic functions have no minus sign here).",
      "So the derivative is $\\frac{\\sinh x}{\\cosh x}=\\tanh x$."
    ],
    "trap": "Following the trig habit and writing $(\\cosh x)'=-\\sinh x$, which gives $-\\tanh x$. The derivative of the hyperbolic $\\cosh$ has no minus sign.",
    "check": "At $x=0$, $\\cosh$ has its minimum, so the slope of $\\ln\\cosh x$ should be $0$, and $\\tanh 0=0$ matches."
  },
  "dd-invf-005": {
    "spot": "You want the derivative of the inverse at $1$, but $f$ can't be inverted: first find which $x$ gives $f(x)=1$ (by inspection, $x=0$), then use $g'(1)=\\frac{1}{f'(0)}$.",
    "why": "$e^x+2x=y$ has no elementary inverse, so the inverse-derivative formula is the only way; the key is plugging in the right point.",
    "steps": [
      "Find $f(a)=1$: $f(0)=e^0+0=1$, so $g(1)=0$.",
      "$f'(x)=e^x+2$, $f'(0)=3$.",
      "Inverse derivative: $g'(1)=\\frac{1}{f'(g(1))}=\\frac{1}{f'(0)}=\\frac{1}{3}$."
    ],
    "trap": "Plugging $x=1$ straight into $f'$ and getting $\\frac{1}{e+2}$ — you must plug in $g(1)=0$, not $1$.",
    "check": "Numerically: $f(0.001)\\approx 1.003$, so as $y$ goes from $1$ to $1.003$, $g$ moves only $0.001$ — slope about $\\frac{1}{3}$."
  },
  "dd-new-001": {
    "spot": "\"One iteration of Newton's method\" means applying $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$; you only need $f(2)$ and $f'(2)$.",
    "why": "Newton's method follows the tangent line down to the $x$-axis; one step is this single formula, no equation solving.",
    "steps": [
      "$f(2)=8-4-5=-1$.",
      "$f'(x)=3x^2-2$, $f'(2)=10$.",
      "$x_1=2-\\frac{-1}{10}=2.1=\\frac{21}{10}$."
    ],
    "trap": "Flipping the sign in the formula and writing $x_1=2+\\frac{f}{f'}=1.9$. Since $f(2)<0$ and $f$ is increasing, the root must be to the right of $2$.",
    "check": "$f(2.1)=0.061$ is much closer to $0$ than $f(2)=-1$, so the iteration really moves toward the root."
  },
  "dd-new-003": {
    "spot": "One Newton iteration: $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$; with $f=x^3-7$ you are approximating $\\sqrt[3]{7}$.",
    "why": "Just apply the tangent-line formula; the root here is $\\sqrt[3]{7}\\approx1.913$, so you can check the direction along the way.",
    "steps": [
      "$f(2)=8-7=1$.",
      "$f'(x)=3x^2$, $f'(2)=12$.",
      "$x_1=2-\\frac{1}{12}=\\frac{23}{12}$."
    ],
    "trap": "Computing $f'(2)$ as $3\\cdot 2=6$ (forgetting the square), which gives $2-\\frac{1}{6}=\\frac{11}{6}$.",
    "check": "$\\frac{23}{12}\\approx1.9167$ versus the true root $\\sqrt[3]{7}\\approx1.9129$ — one step is already accurate to two decimal places."
  },
  "depth-der-006": {
    "spot": "$\\ln(x+\\sqrt{x^2+4})$ has the inverse hyperbolic sine shape: after differentiating, the numerator becomes $\\sqrt{x^2+4}+x$, which cancels exactly with the outer $x+\\sqrt{x^2+4}$.",
    "why": "A straightforward Chain Rule is fastest; the key is to combine $1+\\frac{x}{\\sqrt{x^2+4}}$ over a common denominator so you can see the cancellation.",
    "steps": [
      "Chain Rule: the derivative is $\\frac{1}{x+\\sqrt{x^2+4}}\\cdot\\left(1+\\frac{x}{\\sqrt{x^2+4}}\\right)$.",
      "Common denominator: $1+\\frac{x}{\\sqrt{x^2+4}}=\\frac{\\sqrt{x^2+4}+x}{\\sqrt{x^2+4}}$.",
      "$\\sqrt{x^2+4}+x$ cancels top and bottom, leaving $\\frac{1}{\\sqrt{x^2+4}}$."
    ],
    "trap": "Differentiating only $\\sqrt{x^2+4}$ in the inner part and missing the derivative $1$ of $x$, which gives $\\frac{x}{\\sqrt{x^2+4}\\,(x+\\sqrt{x^2+4})}$ — it won't simplify cleanly.",
    "check": "Integrate back: $\\int\\frac{dx}{\\sqrt{x^2+4}}$ is exactly the standard formula $\\ln(x+\\sqrt{x^2+4})+C$; at $x=0$ the slope is $\\frac{1}{2}$."
  },
  "depth-der-012": {
    "spot": "$\\ln(x^2+y^2)=2\\ln r$ is the fundamental solution in the plane: the function $\\ln r$, which depends only on $r$, is harmonic, so its Laplacian is $0$ away from the origin.",
    "why": "Computing the two second partials and adding them is the safest route; the two terms come out as $\\frac{2(y^2-x^2)}{(x^2+y^2)^2}$ and its negative.",
    "steps": [
      "$\\frac{\\partial}{\\partial x}\\ln(x^2+y^2)=\\frac{2x}{x^2+y^2}$.",
      "Differentiate again (Quotient Rule): $\\frac{\\partial^2}{\\partial x^2}=\\frac{2(x^2+y^2)-4x^2}{(x^2+y^2)^2}=\\frac{2(y^2-x^2)}{(x^2+y^2)^2}$.",
      "By symmetry $\\frac{\\partial^2}{\\partial y^2}=\\frac{2(x^2-y^2)}{(x^2+y^2)^2}$, exactly the negative.",
      "Adding gives $\\Delta\\ln(x^2+y^2)=0$ (away from the origin)."
    ],
    "trap": "Thinking \"$\\ln$ differentiated twice is $-\\frac{1}{u^2}$\" and writing something like $\\Delta=-\\frac{2}{x^2+y^2}$. That's one-dimensional intuition; in two dimensions $\\ln r$ is harmonic (in three dimensions it's $\\frac{1}{r}$).",
    "check": "Check in polar coordinates: $\\Delta f=f''(r)+\\frac{1}{r}f'(r)$, and $f=2\\ln r$ gives $-\\frac{2}{r^2}+\\frac{2}{r^2}=0$."
  },
  "depth-der-018": {
    "spot": "A square root inside a square root: two layers of Chain Rule. The outer $\\sqrt{u}$ gives $\\frac{1}{2\\sqrt{u}}$, and the inner $x+\\sqrt{x}$ has derivative $1+\\frac{1}{2\\sqrt{x}}$.",
    "why": "A pure composition — peel it with the Chain Rule from the outside in; no need to square first or take logs.",
    "steps": [
      "Outer layer: $\\frac{d}{dx}\\sqrt{u}=\\frac{u'}{2\\sqrt{u}}$ with $u=x+\\sqrt{x}$.",
      "Inner layer: $u'=1+\\frac{1}{2\\sqrt{x}}$.",
      "Put together: $\\frac{1+\\frac{1}{2\\sqrt{x}}}{2\\sqrt{x+\\sqrt{x}}}$."
    ],
    "trap": "Differentiating only the $\\sqrt{x}$ in the inner part and missing the derivative $1$ of $x$, which gives $\\frac{1}{4\\sqrt{x}\\sqrt{x+\\sqrt{x}}}$.",
    "check": "Plug in $x=1$: $\\frac{1+\\frac{1}{2}}{2\\sqrt{2}}=\\frac{3}{4\\sqrt{2}}\\approx0.530$."
  },
  "depth-int-015": {
    "spot": "The denominator $1+x+x^2$ doesn't factor (discriminant $<0$) and the numerator is linear: split it into \"a multiple of the denominator's derivative\" plus \"a constant\". The first gives $\\ln$; the second, after completing the square, gives $\\arctan$.",
    "why": "This is the standard split for a rational function over an irreducible quadratic; partial fractions can't split it over the reals.",
    "steps": [
      "The denominator's derivative is $2x+1$, so $x=\\frac{1}{2}(2x+1)-\\frac{1}{2}$.",
      "First piece: $\\frac{1}{2}\\int_0^1\\frac{2x+1}{1+x+x^2}dx=\\frac{1}{2}\\ln(1+x+x^2)\\Big|_0^1=\\frac{\\ln 3}{2}$.",
      "Second piece, complete the square: $1+x+x^2=(x+\\frac{1}{2})^2+\\frac{3}{4}$, so $\\int_0^1\\frac{dx}{1+x+x^2}=\\frac{2}{\\sqrt3}\\left[\\arctan\\frac{2x+1}{\\sqrt3}\\right]_0^1=\\frac{2}{\\sqrt3}\\left(\\frac{\\pi}{3}-\\frac{\\pi}{6}\\right)=\\frac{\\pi}{3\\sqrt3}$.",
      "Combine: $\\frac{\\ln3}{2}-\\frac{1}{2}\\cdot\\frac{\\pi}{3\\sqrt3}=\\frac{\\ln 3}{2}-\\frac{\\pi}{6\\sqrt3}$."
    ],
    "trap": "Treating the whole thing as $\\frac{1}{2}\\ln(1+x+x^2)$ and stopping, answering $\\frac{\\ln3}{2}\\approx0.549$. That's the integral of $\\frac{x+\\frac12}{1+x+x^2}$ — it includes the extra constant piece.",
    "check": "Size estimate: on $[0,1]$ the integrand grows from $0$ to $\\frac{1}{3}$, so the integral should lie between $0$ and $\\frac{1}{3}$; the answer is about $0.247$."
  },
  "depth-lim-005": {
    "spot": "$\\tan x-x$ and $1-\\cos x$ both have the \"main term subtracted off\" form: take the first nonzero Taylor term of each, $x^3/3$ against $x\\cdot x^2/2$.",
    "why": "L'Hôpital's Rule would need three derivatives of a cubic denominator — messy. Equivalent infinitesimals settle it in one line.",
    "steps": [
      "$\\tan x=x+\\frac{x^3}{3}+\\cdots$, so $\\tan x-x\\sim\\frac{x^3}{3}$.",
      "$1-\\cos x\\sim\\frac{x^2}{2}$, so the denominator $x(1-\\cos x)\\sim\\frac{x^3}{2}$.",
      "Ratio: $\\frac{1/3}{1/2}=\\frac{2}{3}$."
    ],
    "trap": "Taking $\\tan x-x$ to be $\\frac{x^3}{6}$ (mixing it up with $x-\\sin x$), which gives $\\frac{1}{3}$.",
    "check": "Numerically: at $x=0.01$ the ratio is about $0.66670$."
  },
  "depth-ser-017": {
    "spot": "The coefficient is \"polynomial $\\div 5^n$\": the $n$th root of a polynomial tends to $1$, so the radius of convergence is set by $5^n$ alone.",
    "why": "The Ratio Test shows it in one line: the polynomial part's ratio tends to $1$, leaving only $\\frac{1}{5}$.",
    "steps": [
      "Ratio Test: $\\frac{a_{n+1}}{a_n}=\\frac{(n+1)^3+1}{n^3+1}\\cdot\\frac{1}{5}$.",
      "The polynomial ratio $\\frac{(n+1)^3+1}{n^3+1}\\to1$.",
      "So $\\frac{a_{n+1}}{a_n}\\to\\frac{1}{5}$ and the radius of convergence is $R=5$."
    ],
    "trap": "Thinking the $n^3$ shrinks the radius or turns it into something like $\\frac{5}{3}$. A polynomial factor only affects the endpoints, not the radius.",
    "check": "At $x=4$ (inside the radius) the series converges: $\\sum\\frac{n^3+1}{5^n}4^n$ is finite."
  },
  "gap-der-app-003": {
    "spot": "The ladder has fixed length $10$: $x^2+y^2=100$. Given the bottom's speed and asked for the top's speed, differentiate with respect to $t$ to tie $x'$ and $y'$ together.",
    "why": "Standard related rates: write the relation, differentiate, then plug in numbers. Plugging in $x=6$ first freezes the variable.",
    "steps": [
      "When $x=6$, the top is at height $y=\\sqrt{100-36}=8$.",
      "Differentiate $x^2+y^2=100$ with respect to $t$: $2xx'+2yy'=0$, so $y'=-\\frac{x}{y}x'$.",
      "Plug in: $y'=-\\frac{6}{8}\\cdot2=-\\frac{3}{2}$ (the top slides down)."
    ],
    "trap": "Dropping the minus sign and answering $\\frac{3}{2}$. When the bottom is pulled outward the top must move down, so $y'$ has to be negative.",
    "check": "Finite-difference check: as $x$ goes from $6$ to $6.002$ ($\\Delta t=0.001$), $y$ changes by about $-0.0015$."
  },
  "gap-der-ode-005": {
    "spot": "$y'=y(1-y)$ is the logistic equation: it's separable, and the left side splits by partial fractions as $\\frac{1}{y(1-y)}=\\frac{1}{y}+\\frac{1}{1-y}$.",
    "why": "After separating, both sides integrate directly; the initial value $\\frac{1}{2}$ makes the constant come out as $1$.",
    "steps": [
      "Separate: $\\frac{dy}{y(1-y)}=dx$, with partial fractions $\\frac{1}{y(1-y)}=\\frac{1}{y}+\\frac{1}{1-y}$.",
      "Integrate: $\\ln\\frac{y}{1-y}=x+C$, i.e. $\\frac{y}{1-y}=Ae^x$, $y=\\frac{1}{1+A^{-1}e^{-x}}$. The initial value $y(0)=\\frac{1}{2}$ gives $A=1$.",
      "Check the equation: the derivative of $y=\\frac{1}{1+e^{-x}}$ equals $y(1-y)$.",
      "So $y=\\frac{1}{1+e^{-x}}$."
    ],
    "trap": "Forgetting the minus sign when integrating the partial fraction $\\frac{1}{1-y}$, writing $\\ln y+\\ln(1-y)$, and ending up with the wrong shape $y(1-y)=Ce^x$.",
    "check": "Long-term behavior: the logistic solution approaches the carrying capacity $1$."
  },
  "gap-der-param-002": {
    "spot": "$\\frac{dy}{dx}$ for parametric equations: $\\frac{dy/dt}{dx/dt}$ — differentiate each with respect to $t$, then divide.",
    "why": "No need to eliminate $t$ to get $y=\\pm\\sqrt{1-x^2}$ (and then split into cases); the parametric formula gives it directly.",
    "steps": [
      "$\\frac{dy}{dt}=\\cos t$.",
      "$\\frac{dx}{dt}=-\\sin t$.",
      "Divide: $\\frac{dy}{dx}=\\frac{\\cos t}{-\\sin t}=-\\cot t$."
    ],
    "trap": "Putting it upside down as $\\frac{dx/dt}{dy/dt}=-\\tan t$.",
    "check": "Geometry: on the unit circle at $t=\\frac{\\pi}{4}$, the point $(\\frac{\\sqrt2}{2},\\frac{\\sqrt2}{2})$ has tangent slope $-1$."
  },
  "hd-010": {
    "spot": "Both the base and the exponent contain $x$: for $x^{x^2}$ neither the power rule nor the exponential rule applies. Take logs, $\\ln y=x^2\\ln x$, then differentiate.",
    "why": "Logarithmic differentiation brings the exponent down as a product, which the Product Rule can handle.",
    "steps": [
      "Write $y=e^{x^2\\ln x}$.",
      "Derivative of the exponent (Product Rule): $(x^2\\ln x)'=2x\\ln x+x$.",
      "So $y'=x^{x^2}(2x\\ln x+x)$."
    ],
    "trap": "Using the power rule to write $x^2\\cdot x^{x^2-1}$, or using only the exponential rule to write $x^{x^2}\\ln x\\cdot 2x$ — each misses half.",
    "check": "Plug in $x=1$: $y'=1\\cdot(0+1)=1$."
  },
  "lm-rs-008": {
    "spot": "In the sum, $n$ and $k$ appear as $\\frac{k}{n}$: pull a $\\frac{1}{n}$ out of $\\frac{n}{(n+k)^2}$ and you have a Riemann sum.",
    "why": "The sum has no closed form directly; as a Riemann sum it becomes an easy definite integral.",
    "steps": [
      "Rewrite: $\\frac{n}{(n+k)^2}=\\frac{1}{n}\\cdot\\frac{1}{(1+k/n)^2}$.",
      "So the sum is the right-endpoint Riemann sum of $f(x)=\\frac{1}{(1+x)^2}$ on $[0,1]$, and the limit is $\\int_0^1\\frac{dx}{(1+x)^2}$.",
      "$\\int_0^1\\frac{dx}{(1+x)^2}=\\left[-\\frac{1}{1+x}\\right]_0^1=1-\\frac{1}{2}=\\frac{1}{2}$."
    ],
    "trap": "Not pulling out $\\frac1n$, noting each term $\\frac{n}{(n+k)^2}\\to0$, and concluding the sum is $0$. The number of terms $n$ is growing too — you need the Riemann sum to see the limit.",
    "check": "Size: $\\frac{1}{(1+x)^2}$ lies between $\\frac{1}{4}$ and $1$ on $[0,1]$, so the integral is between those two numbers."
  },
  "mob-bessel-007": {
    "spot": "Divide Bessel's equation $x^2y''+xy'+(x^2-\\nu^2)y=0$ by $x^2$: the coefficient of $y'$ is $\\frac{1}{x}$ and the coefficient of $y$ is $\\frac{x^2-\\nu^2}{x^2}$ — they blow up at $0$, but in a \"just controllable\" way.",
    "why": "To decide whether a singular point is regular, check only whether $xP(x)$ and $x^2Q(x)$ are analytic at $0$; that is exactly the condition for a Frobenius series to work.",
    "steps": [
      "Standard form $y''+P(x)y'+Q(x)y=0$: $P=\\frac{1}{x}$, $Q=\\frac{x^2-\\nu^2}{x^2}$. Neither is analytic at $x=0$, so $0$ is a singular point. For example with $\\nu=2$, $Q$ blows up near $0$.",
      "Multiply by $x$ and $x^2$: $xP=1$ and $x^2Q=x^2-\\nu^2$, both polynomials (analytic).",
      "So $x=0$ is a regular singular point ($\\text{regular singular point}$), and you can use a Frobenius series $x^r\\sum a_nx^n$ with indicial equation $r^2=\\nu^2$."
    ],
    "trap": "Seeing the coefficients blow up at $0$ and calling it an \"irregular singular point\". It's irregular only if they still blow up after multiplying by $x$ and $x^2$.",
    "check": "For $\\nu=\\frac{1}{2}$ a solution is $\\frac{\\sin x}{\\sqrt x}$, which behaves like $x^{1/2}$ near $0$ — exactly the Frobenius index $r=\\frac{1}{2}$."
  },
  "mob-bessel-010": {
    "spot": "Bessel functions solve $x^2y''+xy'+(x^2-\\nu^2)y=0$; the highest derivative is $y''$, so it's a second-order ordinary differential equation. It's the radial equation you get from separating variables in cylindrical coordinates.",
    "why": "To ask \"what kind of equation\", look at the highest derivative: Bessel's equation contains $y''$ and nothing higher.",
    "steps": [
      "The highest derivative in Bessel's equation $x^2y''+xy'+(x^2-\\nu^2)y=0$ is $y''$: second order, linear, with variable coefficients.",
      "Example: the $\\nu=\\frac{1}{2}$ solution $y=\\frac{\\sin x}{\\sqrt x}$ really satisfies this second-order equation (after dividing by $x^2$, $y''=-\\frac{y'}{x}-\\left(1-\\frac{1}{4x^2}\\right)y$).",
      "So the answer is: a second-order ordinary differential equation ($\\text{second-order ODE}$)."
    ],
    "trap": "Answering \"partial differential equation\" because Bessel functions often show up in PDE problems. They solve the radial ODE left after separating variables.",
    "check": "A second-order equation has a two-dimensional solution space: the two independent solutions $\\frac{\\sin x}{\\sqrt x}$ and $\\frac{\\cos x}{\\sqrt x}$ both satisfy the same equation."
  },
  "mob-nabla-004": {
    "spot": "Directional derivative $D_{\\mathbf u}f=\\nabla f\\cdot\\mathbf u$, and the direction $\\frac{(1,1)}{\\sqrt2}$ is already a unit vector.",
    "why": "A gradient dot product finishes it in one line; no need to take a limit from the definition.",
    "steps": [
      "$\\nabla(x^2+y^2)=(2x,2y)$, which is $(2,2)$ at $(1,1)$.",
      "Dot product: $(2,2)\\cdot\\frac{(1,1)}{\\sqrt2}=\\frac{4}{\\sqrt2}=2\\sqrt2$.",
      "Check with the definition: moving a distance $h$ in that direction, the derivative of $f(1+\\frac{h}{\\sqrt2},1+\\frac{h}{\\sqrt2})$ with respect to $h$ at $0$ is the directional derivative."
    ],
    "trap": "Forgetting to normalize the direction (or dividing an already-unit vector by $\\sqrt2$ again), answering $4$ or $2$.",
    "check": "The $(1,1)$ direction is exactly the gradient direction, so the directional derivative equals the gradient's length $|(2,2)|=2\\sqrt2$, the largest over all directions."
  },
  "mob-wallis-002": {
    "spot": "$\\int_0^{\\pi/2}\\sin$ to an odd power: Wallis' formula $\\frac{(n-1)!!}{n!!}$, and odd powers carry no $\\frac{\\pi}{2}$. For $n=3$ it's $\\frac{2}{3}$.",
    "why": "You could also write $\\sin^3=\\sin(1-\\cos^2)$ and substitute $u=\\cos x$, but Wallis is one line.",
    "steps": [
      "Reduce: $\\int_0^{\\pi/2}\\sin^3x\\,dx=\\frac{2}{3}\\int_0^{\\pi/2}\\sin x\\,dx$.",
      "$\\int_0^{\\pi/2}\\sin x\\,dx=1$.",
      "So the answer is $\\frac{2}{3}$."
    ],
    "trap": "Multiplying by $\\frac{\\pi}{2}$ for an odd power too, answering $\\frac{\\pi}{3}$.",
    "check": "Check by substitution: $u=\\cos x$, $\\int_0^1(1-u^2)\\,du=1-\\frac{1}{3}=\\frac{2}{3}$."
  },
  "mob-wallis-005": {
    "spot": "$\\cos^2$ on $[0,\\frac{\\pi}{2}]$: $\\cos^2$ and $\\sin^2$ have equal integrals over this interval and add up to $1$, so each gets half.",
    "why": "The symmetry argument doesn't even need the power-reduction formula; Wallis for even powers, $\\frac{1}{2}\\cdot\\frac{\\pi}{2}$, gives the same result.",
    "steps": [
      "$\\int_0^{\\pi/2}\\cos^2x\\,dx=\\int_0^{\\pi/2}\\sin^2x\\,dx$ (substitute $x\\to\\frac{\\pi}{2}-x$).",
      "Their sum is $\\int_0^{\\pi/2}1\\,dx=\\frac{\\pi}{2}$.",
      "So each is $\\frac{\\pi}{4}$."
    ],
    "trap": "Writing the power reduction as $\\cos^2x=\\frac{1-\\cos2x}{2}$ (wrong sign). Here the answer happens not to change, but on another interval it would be wrong.",
    "check": "Power-reduction check: $\\cos^2x=\\frac{1+\\cos 2x}{2}$, and $\\cos 2x$ integrates to $0$ on $[0,\\frac{\\pi}{2}]$, leaving $\\frac{1}{2}\\cdot\\frac{\\pi}{2}$."
  },
  "mob-wallis-009": {
    "spot": "$\\cos$ to the first power: just use the antiderivative $\\sin x$; the $n=1$ case of Wallis is $1$.",
    "why": "The antiderivative is right there; no reduction needed.",
    "steps": [
      "$\\int\\cos x\\,dx=\\sin x+C$.",
      "Plug in the limits: $\\sin\\frac{\\pi}{2}-\\sin0=1$.",
      "So the answer is $1$."
    ],
    "trap": "Writing the antiderivative as $-\\sin x$ (mixing it up with the integral of $\\sin$) and answering $-1$. $\\cos$ is positive on this interval, so the integral can't be negative.",
    "check": "Symmetry: $\\int_0^{\\pi/2}\\cos x\\,dx=\\int_0^{\\pi/2}\\sin x\\,dx=1$."
  },
  "ode-val-004": {
    "spot": "$y'=y^2$ is separable: $\\frac{dy}{y^2}=dx$, which integrates to $-\\frac{1}{y}=x+C$.",
    "why": "Separating variables gives an exact formula; a numerical solution would have to worry about the blow-up at $x=1$.",
    "steps": [
      "Separate and integrate: $-\\frac{1}{y}=x+C$; $y(0)=1$ gives $C=-1$, so $y=\\frac{1}{1-x}$.",
      "Check the equation: $\\left(\\frac{1}{1-x}\\right)'=\\frac{1}{(1-x)^2}=y^2$.",
      "$y\\left(\\frac{1}{2}\\right)=\\frac{1}{1-\\frac12}=2$."
    ],
    "trap": "Integrating $\\int\\frac{dy}{y^2}$ as $\\frac{1}{y}$ (missing the minus sign), which gives $y=\\frac{1}{1+x}$ and $y(\\frac12)=\\frac{2}{3}$. With $y'>0$ the solution should be increasing.",
    "check": "The solution blows up at $x=1$; $\\frac{1}{2}$ comes before the blow-up, and $y$ growing from $1$ to $2$ fits $y'=y^2>0$."
  },
  "putnam-005": {
    "spot": "$\\int_0^{\\pi/2}$ with an arbitrary power of $\\tan x$: substituting $x\\to\\frac{\\pi}{2}-x$ turns $\\tan$ into $\\cot=\\frac{1}{\\tan}$, and the original plus the new integral add up to $1$.",
    "why": "The exponent $\\sqrt2$ makes direct integration hopeless; the King property makes the exponent irrelevant.",
    "steps": [
      "Let $I=\\int_0^{\\pi/2}\\frac{dx}{1+\\tan^{\\sqrt2}x}$. Substitute $x\\to\\frac{\\pi}{2}-x$: $I=\\int_0^{\\pi/2}\\frac{dx}{1+\\cot^{\\sqrt2}x}=\\int_0^{\\pi/2}\\frac{\\tan^{\\sqrt2}x}{\\tan^{\\sqrt2}x+1}dx$.",
      "Add the two forms; the integrand becomes $1$: $2I=\\frac{\\pi}{2}$.",
      "So $I=\\frac{\\pi}{4}$."
    ],
    "trap": "Trying to substitute $u=\\tan x$ and grind it out, getting stuck at $\\int\\frac{du}{(1+u^{\\sqrt2})(1+u^2)}$.",
    "check": "With the exponent replaced by $1$ it should also be $\\frac{\\pi}{4}$."
  },
  "rel-adv-006": {
    "spot": "Directional derivative $=\\nabla f\\cdot\\mathbf u$; $(2,-1,2)$ has length $3$, so dividing by $3$ gives a unit vector.",
    "why": "Gradient first, then dot product — much faster than taking a limit along the direction.",
    "steps": [
      "$f=x^2y+yz$: $f_x=2xy$, which is $4$ at $(1,2,3)$.",
      "$f_y=x^2+z=1+3=4$, $f_z=y=2$. So $\\nabla f=(4,4,2)$.",
      "Dot product: $\\frac{(4,4,2)\\cdot(2,-1,2)}{3}=\\frac{8-4+4}{3}=\\frac{8}{3}$."
    ],
    "trap": "Forgetting to divide by $3$ (the length of the direction vector) and answering $8$.",
    "check": "Move a distance $h$ along the direction: the derivative of $f(1+\\frac{2h}{3},2-\\frac{h}{3},3+\\frac{2h}{3})$ at $h=0$."
  },
  "rel-hard-der-002": {
    "spot": "The Wronskian $W(f,g)=fg'-f'g$, here with $f=\\sin x$ and $g=\\cos x$; plug in $x=0$ in one line.",
    "why": "The whole expression is actually identically $-\\sin^2x-\\cos^2x=-1$, independent of $x$.",
    "steps": [
      "$W=\\sin x\\cdot(\\cos x)'-(\\sin x)'\\cos x=-\\sin^2x-\\cos^2x$.",
      "$\\sin^2+\\cos^2=1$, so $W\\equiv-1$.",
      "At $x=0$: $W=0\\cdot0-1\\cdot1=-1$."
    ],
    "trap": "Reversing the order to $f'g-fg'$ and answering $1$. The Wronskian is $\\begin{vmatrix}f&g\\\\f'&g'\\end{vmatrix}$.",
    "check": "$W\\ne0$ means $\\sin$ and $\\cos$ are linearly independent — exactly a fundamental set of solutions for $y''+y=0$."
  },
  "rel-hard-der-005": {
    "spot": "Parametric: $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$, and both derivatives are $1\\pm\\frac{1}{t^2}$.",
    "why": "You could also eliminate $t$ ($x^2-y^2=4$), but the parametric formula is more direct.",
    "steps": [
      "$\\frac{dx}{dt}=1-\\frac{1}{t^2}$, which is $\\frac{3}{4}$ at $t=2$.",
      "$\\frac{dy}{dt}=1+\\frac{1}{t^2}$, which is $\\frac{5}{4}$ at $t=2$.",
      "Divide: $\\frac{5/4}{3/4}=\\frac{5}{3}$."
    ],
    "trap": "Putting it upside down and answering $\\frac{3}{5}$.",
    "check": "Implicit check: $x^2-y^2=4$ gives $\\frac{dy}{dx}=\\frac{x}{y}$; at $t=2$, $x=\\frac{5}{2}$ and $y=\\frac{3}{2}$."
  },
  "td-lim-004": {
    "spot": "$(1+x)^x$ has a variable base and a variable exponent: write it as $e^{x\\ln(1+x)}$. The exponent is $x\\ln(1+x)=x^2-\\frac{x^3}{2}+\\cdots$; then expand $e^u$.",
    "why": "The denominator is $x^3$, so L'Hôpital's Rule needs three derivatives, each requiring logarithmic differentiation of $(1+x)^x$. Taylor expansion only needs terms up to the cube.",
    "steps": [
      "$x\\ln(1+x)=x\\left(x-\\frac{x^2}{2}+\\cdots\\right)=x^2-\\frac{x^3}{2}+O(x^4)$.",
      "$e^u=1+u+O(u^2)$ and $u^2=O(x^4)$, so $(1+x)^x=1+x\\ln(1+x)+O(x^4)=1+x^2-\\frac{x^3}{2}+O(x^4)$ ($\\frac{u^2}{2}$ only contributes at $x^4$).",
      "The numerator is $=-\\frac{x^3}{2}+O(x^4)$; dividing by $x^3$ gives $-\\frac{1}{2}$."
    ],
    "trap": "Treating $(1+x)^x$ by the binomial theorem as $1+x\\cdot x$ and stopping, taking the cubic term as $0$, so the limit comes out $0$.",
    "check": "Numerically: at $x=0.01$ the ratio is about $-0.492$ (the next term $\\frac{5x}{6}$ hasn't vanished yet)."
  },
  "uni-der-008": {
    "spot": "$\\frac{2x}{1-x^2}$ is the double-angle formula for $\\tan 2\\theta$ (with $x=\\tan\\theta$): its $\\arctan$ is $2\\arctan x$ (up to a constant), with derivative $\\frac{2}{1+x^2}$.",
    "why": "Recognizing the double-angle formula saves a pile of Quotient Rule work; brute force also works, but you have to simplify $(1-x^2)^2+4x^2=(1+x^2)^2$.",
    "steps": [
      "Chain Rule: the derivative is $\\frac{1}{1+u^2}\\cdot u'$ with $u=\\frac{2x}{1-x^2}$, $u'=\\frac{2(1+x^2)}{(1-x^2)^2}$.",
      "$1+u^2=\\frac{(1-x^2)^2+4x^2}{(1-x^2)^2}=\\frac{(1+x^2)^2}{(1-x^2)^2}$.",
      "Multiply and cancel: $\\frac{(1-x^2)^2}{(1+x^2)^2}\\cdot\\frac{2(1+x^2)}{(1-x^2)^2}=\\frac{2}{1+x^2}$."
    ],
    "trap": "Recognizing $2\\arctan x$ but not daring to use it because it \"only holds for $|x|<1$\". Away from $x=\\pm1$ the two differ only by a constant ($\\pm\\pi$), so the derivatives are still equal.",
    "check": "It also works past $x=1$: at $x=2$ both derivatives are $\\frac{2}{5}$."
  },
  "uni-der-011": {
    "spot": "$x^2+xy+y^2=3$ can't be solved neatly for $y(x)$: use implicit differentiation, with the Product Rule on the $xy$ term.",
    "why": "Implicit differentiation doesn't require solving for $y$; at the point, $x=y=1$ keeps the numbers clean.",
    "steps": [
      "Differentiate both sides with respect to $x$: $2x+(y+xy')+2yy'=0$.",
      "Solve for $y'$: $y'=-\\frac{2x+y}{x+2y}$. At $(1,1)$: $-\\frac{3}{3}=-1$.",
      "Check: near $(1,1)$ the upper branch is $y=\\frac{-x+\\sqrt{12-3x^2}}{2}$, and its derivative at $x=1$ is also $-1$."
    ],
    "trap": "Differentiating $xy$ as just $y'$ or $xy'$ (missing one Product Rule term), which gives something like $y'=-\\frac{2}{3}$.",
    "check": "The curve is symmetric about $y=x$, and $(1,1)$ lies on the axis of symmetry, so the tangent must be perpendicular to $y=x$: slope $-1$."
  },
  "uni-der-013": {
    "spot": "Maximize $xy$ on the ellipse $x^2+4y^2=8$: the sum of $x^2$ and $4y^2=(2y)^2$ is fixed, so AM-GM, $x^2+(2y)^2\\ge2\\cdot x\\cdot 2y$, gives the upper bound directly.",
    "why": "Faster than Lagrange multipliers, and the equality condition $x=2y$ tells you where the maximum is.",
    "steps": [
      "AM-GM: $8=x^2+(2y)^2\\ge 4xy$, so $xy\\le2$.",
      "Equality holds when $x=2y$: substituting gives $8y^2=8$, so $y=1$, $x=2$, which is indeed on the ellipse.",
      "Check by parametrizing: $x=2\\sqrt2\\cos t$, $y=\\sqrt2\\sin t$, $xy=2\\sin2t$, with maximum $2$ at $t=\\frac{\\pi}{4}$."
    ],
    "trap": "Using $x^2+y^2\\ge2xy$ but forgetting the coefficient $4$, getting a wrong bound like $xy\\le4$ (equality can't even be attained).",
    "check": "$t=\\frac{\\pi}{4}$ is a critical point: $\\frac{d}{dt}(2\\sin 2t)=0$."
  },
  "uni-lim-009": {
    "spot": "The Taylor expansions of $\\cosh x$ and $\\cos x$ differ only in sign: $1+\\frac{x^2}{2}$ versus $1-\\frac{x^2}{2}$, so the difference is $x^2$.",
    "why": "Expanding to second order is enough since the constants cancel; L'Hôpital's Rule needs two derivatives and gives the same $\\frac{\\cosh0+\\cos0}{2}$.",
    "steps": [
      "$\\cosh x=1+\\frac{x^2}{2}+O(x^4)$.",
      "$\\cos x=1-\\frac{x^2}{2}+O(x^4)$.",
      "Subtract: $x^2+O(x^4)$; dividing by $x^2$ gives $1$."
    ],
    "trap": "Thinking $\\cosh$ and $\\cos$ have the same expansion, so the difference is $0$. The hyperbolic version has all positive coefficients.",
    "check": "Numerically: at $x=0.1$, $\\frac{\\cosh0.1-\\cos0.1}{0.01}\\approx1.0000$."
  },
  "uni-ser-005": {
    "spot": "$e^x\\cos x$ is the real part of $e^{(1+i)x}$: the coefficient of $x^6$ is $\\frac{\\mathrm{Re}(1+i)^6}{6!}$, and $(1+i)^2=2i$.",
    "why": "Multiplying the two series directly means adding a seven-term convolution; the complex exponential takes one line.",
    "steps": [
      "$(1+i)^2=2i$, so $(1+i)^6=(2i)^3=-8i$, with real part $0$. Check in polar form: $(1+i)^6=8\\left(\\cos\\frac{6\\pi}{4}+i\\sin\\frac{6\\pi}{4}\\right)$.",
      "So the coefficient of $x^6$ is $=\\frac{0}{720}=0$. Equivalently, each derivative of $e^x\\cos x$ multiplies by $\\sqrt2$ and adds $\\frac{\\pi}{4}$ to the phase; after six the phase is $\\frac{3\\pi}{2}$, and the value at $0$ is $8\\cos\\frac{3\\pi}{2}=0$.",
      "Convolution check: $\\sum_{k=0}^{6}\\frac{1}{(6-k)!}\\cdot[\\cos\\text{'s }x^k\\text{ coefficient}]=\\frac{1}{720}-\\frac{1}{2\\cdot24}+\\frac{1}{24\\cdot2}-\\frac{1}{720}=0$."
    ],
    "trap": "Taking only the constant term of $\\cos x$ times the $\\frac{x^6}{6!}$ of $e^x$, answering $\\frac{1}{720}$ and missing the other three cross terms.",
    "check": "Numerically: the sixth derivative of $e^x\\cos x$ at $0$ is $0$, so the coefficient of $x^6$ is $0$."
  },
  "world-022": {
    "spot": "Split $\\frac{1}{n(2n+1)}$ by partial fractions into $\\frac{1}{n}-\\frac{2}{2n+1}=2\\left(\\frac{1}{2n}-\\frac{1}{2n+1}\\right)$ — that's the tail of the alternating harmonic series $1-\\frac12+\\frac13-\\cdots$.",
    "why": "It doesn't telescope, but after pairing it's exactly the series for $\\ln 2$, so the answer involves $\\ln2$.",
    "steps": [
      "Partial fractions: $\\frac{1}{n(2n+1)}=\\frac{1}{n}-\\frac{2}{2n+1}=2\\left(\\frac{1}{2n}-\\frac{1}{2n+1}\\right)$.",
      "$\\sum_{n\\ge1}\\left(\\frac{1}{2n}-\\frac{1}{2n+1}\\right)=\\frac12-\\frac13+\\frac14-\\cdots=1-\\ln2$ (the alternating harmonic series $=\\ln2$ minus its first term $1$, with the sign flipped).",
      "Multiply by $2$: $2-2\\ln2$."
    ],
    "trap": "Splitting into $\\sum\\frac{1}{n}-\\sum\\frac{2}{2n+1}$ and summing each separately — both diverge, so you can't split it that way.",
    "check": "Size: the first term is $\\frac13$ and the total is about $0.614$, a bit more than $\\frac13+\\frac{1}{10}$."
  },
  "world-042": {
    "spot": "The coefficient $\\frac{(3n)!}{(n!)^3}$ is all factorials: use the Ratio Test, where dividing factorials leaves just a few linear factors.",
    "why": "The ratio $\\frac{a_{n+1}}{a_n}$ simplifies to a rational function whose limit is obvious; taking $n$th roots would need Stirling, which is much more work.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(3n+3)(3n+2)(3n+1)}{(n+1)^3}$. Check with $n=2$: $\\frac{9!/6!}{(3!/2!)^3}=\\frac{504}{27}$, and the formula gives $\\frac{9\\cdot8\\cdot7}{27}$.",
      "As $n\\to\\infty$: numerator and denominator are both cubic, with leading-coefficient ratio $\\frac{27}{1}=27$.",
      "Radius of convergence $R=\\frac{1}{27}$."
    ],
    "trap": "Writing $\\frac{(3n+3)!}{(3n)!}$ as the single factor $3n+3$, so the ratio tends to $0$ and you wrongly conclude the radius is infinite.",
    "check": "The ratio creeps up toward $27$ from below: at $n=100$, $\\frac{303\\cdot302\\cdot301}{101^3}\\approx26.73$."
  },
  "world-066": {
    "spot": "For the limit of a product, take logs to turn it into a sum: $\\sum\\ln\\left(1+\\frac{k^2}{n^3}\\right)$. Since $\\frac{k^2}{n^3}\\le\\frac{1}{n}\\to0$, $\\ln(1+u)\\approx u$.",
    "why": "Logs turn the product into a sum; every term is small, so the total error of the first-order approximation $\\ln(1+u)\\approx u$ goes to $0$.",
    "steps": [
      "$\\ln(1+u)=u+O(u^2)$, and $u=\\frac{k^2}{n^3}\\le\\frac1n$.",
      "The total error is $\\sum O\\!\\left(\\frac{k^4}{n^6}\\right)=O\\!\\left(\\frac{1}{n}\\right)\\to0$, so $\\ln P_n\\to\\lim\\sum\\frac{k^2}{n^3}=\\lim\\frac{1}{n}\\sum\\left(\\frac{k}{n}\\right)^2$.",
      "Riemann sum: $\\frac1n\\sum\\left(\\frac kn\\right)^2\\to\\int_0^1x^2dx=\\frac13$.",
      "So the product $\\to e^{1/3}$."
    ],
    "trap": "Seeing every factor $\\to1$ and saying the product $\\to1$. The number of factors is growing too; a $1^\\infty$ form needs logs.",
    "check": "Exact sum: $\\sum k^2=\\frac{n(n+1)(2n+1)}{6}$, and divided by $n^3$ it tends to $\\frac{1}{3}$."
  },
  "ap-rr-006": {
    "spot": "Given the rate of change of area, asked for the rate of change of radius: differentiate $A=\\pi r^2$ with respect to $t$, $\\frac{dA}{dt}=2\\pi r\\frac{dr}{dt}$.",
    "why": "Standard related rates: relation → differentiate with respect to $t$ → plug in numbers.",
    "steps": [
      "$A=\\pi r^2$, $\\frac{dA}{dr}=2\\pi r$, which is $4\\pi$ at $r=2$.",
      "$\\frac{dA}{dt}=2\\pi r\\frac{dr}{dt}$: $8=4\\pi\\frac{dr}{dt}$.",
      "So $\\frac{dr}{dt}=\\frac{2}{\\pi}\\ \\text{cm/s}$."
    ],
    "trap": "Using the derivative $2\\pi$ of the circumference $2\\pi r$ as $\\frac{dA}{dr}$, getting $\\frac{4}{\\pi}$.",
    "check": "Units: $\\frac{\\text{cm}^2/\\text{s}}{\\text{cm}}=\\text{cm/s}$; the value is about $0.637$."
  },
  "app-003": {
    "spot": "Curvature of a graph $\\kappa=\\frac{|y''|}{(1+y'^2)^{3/2}}$, and the radius of curvature is its reciprocal; at the origin $y'=0$, so the denominator is $1$.",
    "why": "At the vertex $y'=0$, the formula collapses to $\\kappa=|y''|$ — one line.",
    "steps": [
      "$y'=2x$, which is $0$ at the origin.",
      "$y''=2$.",
      "$\\kappa=\\frac{2}{(1+0)^{3/2}}=2$, radius of curvature $R=\\frac{1}{\\kappa}=\\frac{1}{2}$."
    ],
    "trap": "Giving the curvature $2$ instead of the radius of curvature, i.e. forgetting the reciprocal.",
    "check": "The lower half of the osculating circle $x^2+(y-\\frac12)^2=\\frac14$, $y=\\frac12-\\sqrt{\\frac14-x^2}$, also has second derivative $2$ at the origin."
  },
  "burst-boss-anti-005": {
    "spot": "$x^4$ times $(\\ln x)^2$: integration by parts lowers the power of $\\ln$ ($u=(\\ln x)^k$, $dv=x^4dx$); after two rounds the $\\ln$ is gone.",
    "why": "Differentiating $\\ln$ gives $\\frac1x$, which times $x^5$ brings you back to the $x^4$ form. Choosing $u=x^4$ instead would require integrating $(\\ln x)^2$, which is harder.",
    "steps": [
      "First round: $\\int x^4\\ln^2x\\,dx=\\frac{x^5}{5}\\ln^2x-\\frac{2}{5}\\int x^4\\ln x\\,dx$.",
      "Second round: $\\int x^4\\ln x\\,dx=\\frac{x^5}{5}\\ln x-\\frac{x^5}{25}$.",
      "Combine: $\\frac{x^5\\ln^2x}{5}-\\frac{2x^5\\ln x}{25}+\\frac{2x^5}{125}+C$.",
      "Differentiate back to check."
    ],
    "trap": "Not distributing the minus sign from the second integration by parts, so the constant-type term comes out as $-\\frac{2x^5}{125}$.",
    "check": "Cross-check with a definite integral: $\\int_0^1x^4\\ln^2x\\,dx=\\frac{2}{125}$ (general formula $\\frac{2}{(n+1)^3}$)."
  },
  "burst-boss-int-005": {
    "spot": "The numerator $x^2$ is the derivative of the $x^3$ inside the denominator (up to a factor $3$): substitute $u=x^3$, and $1+x^6=1+u^2$.",
    "why": "After substitution it's just $\\arctan$; no need for the general $\\frac{\\pi}{n\\sin}$ formula.",
    "steps": [
      "$u=x^3$, $du=3x^2dx$: $\\int_0^\\infty\\frac{x^2dx}{1+x^6}=\\frac13\\int_0^\\infty\\frac{du}{1+u^2}$.",
      "$\\int_0^\\infty\\frac{du}{1+u^2}=\\frac{\\pi}{2}$.",
      "So the answer is $\\frac{\\pi}{6}$."
    ],
    "trap": "Forgetting the factor $\\frac{1}{3}$ after substituting, answering $\\frac{\\pi}{2}$.",
    "check": "The general formula $\\int_0^\\infty\\frac{x^{m-1}}{1+x^n}dx=\\frac{\\pi}{n\\sin(m\\pi/n)}$ with $m=3,n=6$ gives $\\frac{\\pi}{6\\sin(\\pi/2)}$."
  },
  "burst-boss-int-007": {
    "spot": "The numerator $x$ is half the derivative of $x^2$, and the denominator is $1+x^4=1+(x^2)^2$: substitute $u=x^2$ to get $\\arctan$.",
    "why": "One substitution reaches the standard form; splitting $1+x^4$ by partial fractions is far more tedious.",
    "steps": [
      "$u=x^2$, $du=2x\\,dx$: the integral $=\\frac12\\int_0^\\infty\\frac{du}{1+u^2}$.",
      "$\\int_0^\\infty\\frac{du}{1+u^2}=\\frac{\\pi}{2}$.",
      "So $\\frac{\\pi}{4}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ and answering $\\frac{\\pi}{2}$.",
    "check": "The antiderivative $\\frac12\\arctan x^2$ differentiates back correctly."
  },
  "burst-boss-lim-006": {
    "spot": "The numerator is $\\arctan x$ minus the first three terms of its Taylor expansion: the first remaining term is $-\\frac{x^7}{7}$.",
    "why": "Read the coefficient straight off the alternating series $\\arctan x=x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\frac{x^7}{7}+\\cdots$; L'Hôpital's Rule would need seven derivatives.",
    "steps": [
      "$\\arctan x=\\sum_{k\\ge0}\\frac{(-1)^kx^{2k+1}}{2k+1}$, from integrating $\\frac{1}{1+x^2}=\\sum(-1)^kx^{2k}$ term by term.",
      "The numerator is $=-\\frac{x^7}{7}+\\frac{x^9}{9}-\\cdots$. Check via the derivative: the numerator's derivative is $\\frac{1}{1+x^2}-1+x^2-x^4=-\\frac{x^6}{1+x^2}$.",
      "So the numerator is $=-\\int_0^x\\frac{t^6}{1+t^2}dt$; divided by $x^7$, at $x=0.01$ it is already $0.99999$ times $-\\frac17$. The limit is $-\\frac{1}{7}$."
    ],
    "trap": "Getting the sign wrong as $+\\frac{x^7}{7}$ and answering $\\frac{1}{7}$. The $\\arctan$ series alternates, so the fourth term is negative.",
    "check": "Using the integral form at $x=0.1$: $-\\frac{1}{x^7}\\int_0^{x}\\frac{t^6}{1+t^2}dt\\approx-0.1418$, close to $-\\frac17\\approx-0.1429$."
  },
  "burst-boss-lim-008": {
    "spot": "The \"next term\" of $(1+\\frac1x)^x\\to e$: write it as $e^{x\\ln(1+1/x)}$; the exponent is $=1-\\frac{1}{2x}+\\cdots$, so $(1+\\frac1x)^x\\approx e\\left(1-\\frac{1}{2x}\\right)$.",
    "why": "Multiplying by $x$ asks for the first-order error term; expanding the exponent is cleaner than applying L'Hôpital's Rule to $\\infty\\cdot0$.",
    "steps": [
      "Let $h=\\frac1x$: $x\\ln(1+\\frac1x)=\\frac{\\ln(1+h)}{h}=1-\\frac{h}{2}+O(h^2)$.",
      "$e^{1-h/2+O(h^2)}=e\\left(1-\\frac{h}{2}+O(h^2)\\right)$, so $(1+h)^{1/h}-e=-\\frac{e}{2}h+O(h^2)$.",
      "Multiply by $x=\\frac1h$: the limit is $-\\frac{e}{2}$."
    ],
    "trap": "Seeing $(1+\\frac1x)^x\\to e$, saying the bracket $\\to0$ and so the whole thing $\\to0$. $\\infty\\cdot0$ is an indeterminate form.",
    "check": "Numerically: at $x=1000$, $1000\\left((1.001)^{1000}-e\\right)\\approx-1.358$, while $-\\frac{e}{2}\\approx-1.359$."
  },
  "burst-boss-ser-002": {
    "spot": "The $\\sum n^2r^n$ type: differentiate the geometric series $\\sum r^n$ twice with respect to $r$ (multiplying by $r$ each time) to get $\\frac{r(1+r)}{(1-r)^3}$, with $r=\\frac13$.",
    "why": "This is the standard trick for \"polynomial × geometric\"; no need to force a telescoping split.",
    "steps": [
      "$\\sum_{n\\ge1}nr^n=\\frac{r}{(1-r)^2}$ (differentiate the geometric series, then multiply by $r$).",
      "Differentiate with respect to $r$ again and multiply by $r$: $\\sum n^2r^n=r\\frac{d}{dr}\\frac{r}{(1-r)^2}=\\frac{r(1+r)}{(1-r)^3}$.",
      "$r=\\frac13$: $\\frac{\\frac13\\cdot\\frac43}{\\frac{8}{27}}=\\frac{4}{9}\\cdot\\frac{27}{8}=\\frac32$."
    ],
    "trap": "Remembering the formula as $\\frac{r}{(1-r)^3}$ (missing the $1+r$), which gives $\\frac{9}{8}$.",
    "check": "First few terms: $\\frac13+\\frac49+\\frac{9}{27}+\\frac{16}{81}\\approx1.296$; the remaining tail bringing it to $1.5$ is reasonable."
  },
  "burst-boss2-anti-004": {
    "spot": "$(\\ln x)^5$ on its own: integrate by parts with $u=(\\ln x)^5$, $dv=dx$. Each round lowers the power of $\\ln$ by one and adds a coefficient, giving $\\int\\ln^nx\\,dx=x\\ln^nx-n\\int\\ln^{n-1}x\\,dx$.",
    "why": "Apply the reduction formula five times; the coefficients are $5,20,60,120,120$ ($\\frac{5!}{k!}$), with alternating signs.",
    "steps": [
      "Reduction: $I_n=x\\ln^nx-nI_{n-1}$. Check with $n=5$.",
      "Unroll five levels: $I_5=x\\ln^5x-5x\\ln^4x+20x\\ln^3x-60x\\ln^2x+120x\\ln x-120x$. The coefficients are $\\frac{5!}{k!}$.",
      "Differentiate back: all the middle terms cancel in pairs, leaving only $\\ln^5x$.",
      "So $\\int\\ln^5x\\,dx=x(\\ln^5x-5\\ln^4x+20\\ln^3x-60\\ln^2x+120\\ln x-120)+C$."
    ],
    "trap": "Not alternating the signs (writing all plus signs), or using coefficients $5,4,3,2,1$ instead of the cumulative products $5,20,60,120,120$.",
    "check": "Definite integral: $\\int_0^1\\ln^5x\\,dx=-5!=-120$; the antiderivative gives $-120$ at $x=1$ and tends to $0$ as $0^+$."
  },
  "burst-boss2-anti-005": {
    "spot": "Polynomial times $\\arctan x$: integrate by parts with $u=\\arctan x$ (its derivative is rational), then handle the leftover $\\frac{x^6}{1+x^2}$ by long division.",
    "why": "Choosing $u=x^5$ would mean integrating $\\arctan$, which only makes things worse; letting $\\arctan$ disappear under differentiation is the right path.",
    "steps": [
      "By parts: $\\int x^5\\arctan x\\,dx=\\frac{x^6}{6}\\arctan x-\\frac16\\int\\frac{x^6}{1+x^2}dx$.",
      "Long division: $\\frac{x^6}{1+x^2}=x^4-x^2+1-\\frac{1}{1+x^2}$.",
      "Integrate: $\\frac{x^5}{5}-\\frac{x^3}{3}+x-\\arctan x$, then multiply by $-\\frac16$: $-\\frac{x^5}{30}+\\frac{x^3}{18}-\\frac{x}{6}+\\frac{\\arctan x}{6}$.",
      "Differentiate back to check."
    ],
    "trap": "Dropping the final $-\\frac{1}{1+x^2}$ in the long division, so the $\\frac{\\arctan x}{6}$ term goes missing.",
    "check": "Cross-check with a definite integral: $\\int_0^1x^5\\arctan x\\,dx$ matches the answer's value at $1$ minus its value at $0$."
  },
  "burst-boss2-int-012": {
    "spot": "$x\\sin^2x$: first reduce the power with $\\sin^2x=\\frac{1-\\cos2x}{2}$; then $\\frac{x}{2}$ integrates directly and $x\\cos2x$ needs one integration by parts.",
    "why": "Integrating by parts without reducing first means integrating the antiderivative of $\\sin^2$ times $x$ — an extra layer. After reduction every piece is a standard form.",
    "steps": [
      "Reduce: $x\\sin^2x=\\frac{x}{2}-\\frac{x\\cos2x}{2}$.",
      "$\\int_0^{\\pi/2}\\frac{x}{2}dx=\\frac{\\pi^2}{16}$.",
      "By parts: $\\int x\\cos2x\\,dx=\\frac{x\\sin2x}{2}+\\frac{\\cos2x}{4}$, which on $[0,\\frac{\\pi}{2}]$ gives $-\\frac14-\\frac14=-\\frac12$.",
      "Combine: $\\frac{\\pi^2}{16}-\\frac12\\cdot\\left(-\\frac12\\right)=\\frac{\\pi^2}{16}+\\frac14$."
    ],
    "trap": "Thinking $\\int_0^{\\pi/2}x\\cos2x\\,dx$ is $0$ (since $\\cos2x$ averages to zero on this interval) and missing the $\\frac14$; once you multiply by $x$ the symmetry is gone.",
    "check": "Size: $\\sin^2x\\le1$, so the integral is $<\\int_0^{\\pi/2}x\\,dx=\\frac{\\pi^2}{8}\\approx1.23$; the answer is about $0.867$."
  },
  "burst-boss2-lim-002": {
    "spot": "The numerator is $\\frac{x}{\\tan x}$ minus the first two terms of its expansion: what you need is the $x^4$ coefficient of $x\\cot x=1-\\frac{x^2}{3}-\\frac{x^4}{45}-\\cdots$.",
    "why": "L'Hôpital's Rule would need four derivatives, each with a quotient; Taylor expansion reads the coefficient directly.",
    "steps": [
      "$\\frac{\\tan x}{x}=1+\\frac{x^2}{3}+\\frac{2x^4}{15}+\\cdots$.",
      "Take the reciprocal: $\\frac{1}{1+a}=1-a+a^2$ with $a=\\frac{x^2}{3}+\\frac{2x^4}{15}$; the $x^4$ coefficient is $=-\\frac{2}{15}+\\frac19=-\\frac{1}{45}$.",
      "So the numerator $\\sim-\\frac{x^4}{45}$, and the limit is $-\\frac{1}{45}$."
    ],
    "trap": "Using only $1-a$ for the reciprocal and missing the $\\frac{x^4}{9}$ from $a^2$, which gives $-\\frac{2}{15}$.",
    "check": "Numerically: at $x=0.1$ the ratio is about $-0.0222$, and $-\\frac{1}{45}\\approx-0.0222$."
  },
  "burst-boss2-lim-004": {
    "spot": "$\\ln(\\cos x)+\\frac{x^2}{2}$: the main term $-\\frac{x^2}{2}$ has been subtracted off, so you need the $x^4$ coefficient of $\\ln\\cos x$ — apply $\\ln(1+u)$ with $u=\\cos x-1$, and remember the $-\\frac{u^2}{2}$ term.",
    "why": "Expanding to fourth order is enough; four rounds of L'Hôpital's Rule is too long.",
    "steps": [
      "$u=\\cos x-1=-\\frac{x^2}{2}+\\frac{x^4}{24}+\\cdots$.",
      "$\\ln(1+u)=u-\\frac{u^2}{2}+\\cdots$ and $u^2=\\frac{x^4}{4}+\\cdots$, so the $x^4$ coefficient is $=\\frac{1}{24}-\\frac18=-\\frac{1}{12}$.",
      "The limit is $-\\frac{1}{12}$."
    ],
    "trap": "Using only $\\ln(1+u)\\approx u$, which gives $\\frac{1}{24}$ — even the sign is wrong.",
    "check": "Another route: $(\\ln\\cos x)'=-\\tan x=-x-\\frac{x^3}{3}-\\cdots$, which integrates to $-\\frac{x^2}{2}-\\frac{x^4}{12}$."
  },
  "burst-boss3-anti-002": {
    "spot": "$x^5$ times $\\sin2x$: polynomial times trig, so integrate by parts with $u=x^5$ and keep lowering the degree (the tabular method). $\\sin$ and $\\cos$ alternate, and the coefficient picks up a factor $\\frac12$ each time.",
    "why": "The tabular method (repeated integration by parts) finishes in six rows; choosing the wrong $u$ makes the powers grow instead.",
    "steps": [
      "Tabular method: differentiate column $x^5,5x^4,20x^3,60x^2,120x,120$; integrate column $-\\frac{\\cos2x}{2},-\\frac{\\sin2x}{4},\\frac{\\cos2x}{8},\\frac{\\sin2x}{16},-\\frac{\\cos2x}{32},-\\frac{\\sin2x}{64}$.",
      "Multiply with alternating signs $+,-,+,-,+,-$: $-\\frac{x^5\\cos2x}{2}+\\frac{5x^4\\sin2x}{4}+\\frac{20x^3\\cos2x}{8}-\\frac{60x^2\\sin2x}{16}-\\frac{120x\\cos2x}{32}+\\frac{120\\sin2x}{64}$.",
      "Simplify the coefficients: $\\frac{20}{8}=\\frac52$, $\\frac{60}{16}=\\frac{15}{4}$, $\\frac{120}{32}=\\frac{15}{4}$, $\\frac{120}{64}=\\frac{15}{8}$.",
      "Differentiate back to check."
    ],
    "trap": "Forgetting to divide by $2$ when integrating $\\sin2x$ (writing $-\\cos2x$), so every later coefficient is off by a power of $2$.",
    "check": "Cross-check with a definite integral: $\\int_0^1x^5\\sin2x\\,dx$ equals the difference of the antiderivative at the endpoints."
  },
  "burst-boss3-anti-004": {
    "spot": "Polynomial times $\\arctan x$: $u=\\arctan x$, $dv=x^6dx$, leaving $\\frac{x^7}{1+x^2}$ for long division. With an odd power the division leaves $\\frac{x}{1+x^2}$, which integrates to $\\ln(1+x^2)$.",
    "why": "$\\arctan$ differentiates to a rational function, so after parts only long division remains. Unlike the even-power version, the remainder here gives a logarithm, not $\\arctan$.",
    "steps": [
      "By parts: $\\int x^6\\arctan x\\,dx=\\frac{x^7}{7}\\arctan x-\\frac17\\int\\frac{x^7}{1+x^2}dx$.",
      "Long division: $\\frac{x^7}{1+x^2}=x^5-x^3+x-\\frac{x}{1+x^2}$.",
      "Integrate: $\\frac{x^6}{6}-\\frac{x^4}{4}+\\frac{x^2}{2}-\\frac12\\ln(1+x^2)$, then multiply by $-\\frac17$: $-\\frac{x^6}{42}+\\frac{x^4}{28}-\\frac{x^2}{14}+\\frac{\\ln(1+x^2)}{14}$.",
      "Differentiate back to check."
    ],
    "trap": "Integrating the remainder $\\frac{x}{1+x^2}$ as $\\arctan x$ (confusing it with the even-power version); its antiderivative is $\\frac12\\ln(1+x^2)$.",
    "check": "Cross-check with a definite integral: $\\int_0^1x^6\\arctan x\\,dx$ equals the difference of the antiderivative at the endpoints."
  },
  "burst-boss3-anti-005": {
    "spot": "Polynomial times $\\ln(1+x)$: $u=\\ln(1+x)$, $dv=x^6dx$, leaving $\\frac{x^7}{1+x}$ — long division (or write it as $\\frac{x^7+1-1}{1+x}$).",
    "why": "The log differentiates to a rational function; $x^7+1$ is divisible by $x+1$, so the division is very regular.",
    "steps": [
      "By parts: $\\int x^6\\ln(1+x)\\,dx=\\frac{x^7}{7}\\ln(1+x)-\\frac17\\int\\frac{x^7}{1+x}dx$.",
      "Long division: $\\frac{x^7}{1+x}=x^6-x^5+x^4-x^3+x^2-x+1-\\frac{1}{1+x}$.",
      "Integrate and multiply by $-\\frac17$: $-\\frac{x^7}{49}+\\frac{x^6}{42}-\\frac{x^5}{35}+\\frac{x^4}{28}-\\frac{x^3}{21}+\\frac{x^2}{14}-\\frac{x}{7}+\\frac{\\ln(1+x)}{7}$.",
      "Differentiate back to check."
    ],
    "trap": "Not alternating the signs in the long division, or dropping the final $-\\frac{1}{1+x}$ and losing the $\\frac{\\ln(1+x)}{7}$.",
    "check": "Cross-check with a definite integral: $\\int_0^1x^6\\ln(1+x)\\,dx$ equals the difference of the antiderivative at the endpoints."
  },
  "burst-boss3-int-007": {
    "spot": "$x^4\\sin x$: polynomial times trig, four integrations by parts via the tabular method. Evaluating at $0$ and $\\pi$, every $\\sin$ term is $0$, leaving only the $\\cos$ terms.",
    "why": "The tabular method writes it all at once; the endpoints $\\sin0=\\sin\\pi=0$ kill half the terms immediately.",
    "steps": [
      "Tabular method: antiderivative $=-x^4\\cos x+4x^3\\sin x+12x^2\\cos x-24x\\sin x-24\\cos x$.",
      "At $\\pi$: $\\cos\\pi=-1$, giving $\\pi^4-12\\pi^2+24$.",
      "At $0$: only $-24\\cos0=-24$ remains. Subtract: $\\pi^4-12\\pi^2+24-(-24)=\\pi^4-12\\pi^2+48$."
    ],
    "trap": "Forgetting that at the lower limit $0$, $-24\\cos 0=-24$ is not zero, and answering $\\pi^4-12\\pi^2+24$.",
    "check": "Size: $\\int_0^\\pi x^4\\sin x\\,dx$ is about $26.97$: $\\pi^4\\approx97.41$, $12\\pi^2\\approx118.44$, and $97.41-118.44+48=26.97$."
  },
  "burst-boss3-lim-009": {
    "spot": "The main term $-\\frac{x^2}{6}$ of $\\ln\\frac{\\sin x}{x}$ has been subtracted off: you need its $x^4$ coefficient. Write $\\frac{\\sin x}{x}=1+u$ with $u=-\\frac{x^2}{6}+\\frac{x^4}{120}$, and remember $-\\frac{u^2}{2}$.",
    "why": "Taylor expansion to fourth order is enough; four rounds of L'Hôpital's Rule with a log of a quotient each time is a mess.",
    "steps": [
      "$u=\\frac{\\sin x}{x}-1=-\\frac{x^2}{6}+\\frac{x^4}{120}+\\cdots$.",
      "$\\ln(1+u)=u-\\frac{u^2}{2}$, $u^2=\\frac{x^4}{36}$, so the $x^4$ coefficient is $=\\frac{1}{120}-\\frac{1}{72}=-\\frac{1}{180}$.",
      "The limit is $-\\frac{1}{180}$."
    ],
    "trap": "Using only $\\ln(1+u)\\approx u$, which gives $\\frac{1}{120}$.",
    "check": "Another route: $\\left(\\ln\\frac{\\sin x}{x}\\right)'=\\cot x-\\frac1x=-\\frac{x}{3}-\\frac{x^3}{45}-\\cdots$, which integrates to $-\\frac{x^2}{6}-\\frac{x^4}{180}$."
  },
  "burst-boss3-lim-010": {
    "spot": "$\\ln\\cosh x$ minus its main term $\\frac{x^2}{2}$: $u=\\cosh x-1=\\frac{x^2}{2}+\\frac{x^4}{24}$, $\\ln(1+u)=u-\\frac{u^2}{2}$.",
    "why": "Same trick as for $\\ln\\cos x$; the hyperbolic version only flips the sign of the $x^2$ term, and the $x^4$ coefficient is, surprisingly, the same $-\\frac{1}{12}$.",
    "steps": [
      "$\\cosh x-1=\\frac{x^2}{2}+\\frac{x^4}{24}+\\cdots$.",
      "$u^2=\\frac{x^4}{4}+\\cdots$, so the $x^4$ coefficient is $=\\frac{1}{24}-\\frac{1}{8}=-\\frac{1}{12}$.",
      "The limit is $-\\frac{1}{12}$."
    ],
    "trap": "Seeing that the $\\cosh$ coefficients are all positive and assuming the answer is $+\\frac{1}{24}$, forgetting the contribution of $-\\frac{u^2}{2}$.",
    "check": "Another route: $(\\ln\\cosh x)'=\\tanh x=x-\\frac{x^3}{3}+\\cdots$, which integrates to $\\frac{x^2}{2}-\\frac{x^4}{12}$."
  },
  "burst-boss3-lim-012": {
    "spot": "A $1^\\infty$ form: base $\\frac{x}{\\sin x}\\to1$, exponent $\\frac{1}{x^2}\\to\\infty$. Take logs: $\\ln\\frac{x}{\\sin x}\\approx\\frac{x^2}{6}$, and multiplying by $\\frac{1}{x^2}$ gives $\\frac16$.",
    "why": "Always take logs for $1^\\infty$; first order of $\\frac{x}{\\sin x}=1+\\frac{x^2}{6}+\\cdots$ is enough.",
    "steps": [
      "$\\frac{x}{\\sin x}=1+\\frac{x^2}{6}+O(x^4)$.",
      "$\\ln\\frac{x}{\\sin x}\\sim\\frac{x^2}{6}$; multiplying by $\\frac{1}{x^2}$, the log tends to $\\frac16$.",
      "So the original limit is $e^{1/6}$."
    ],
    "trap": "Seeing the base tend to $1$ and answering $1$. $1^\\infty$ is an indeterminate form.",
    "check": "Numerically: at $x=0.05$ the value is about $1.1814$, and $e^{1/6}\\approx1.1814$."
  },
  "burst-der-002": {
    "spot": "Higher derivatives of $\\sin(3x)$ repeat with period $4$: each derivative multiplies by $3$ and adds $\\frac{\\pi}{2}$ to the phase, so $f^{(n)}(x)=3^n\\sin\\left(3x+\\frac{n\\pi}{2}\\right)$.",
    "why": "You can't take 15 derivatives one at a time; the periodicity gives the answer in one line.",
    "steps": [
      "General rule: $\\frac{d}{dx}\\sin(3x+\\varphi)=3\\sin\\left(3x+\\varphi+\\frac{\\pi}{2}\\right)$.",
      "So $f^{(15)}(0)=3^{15}\\sin\\frac{15\\pi}{2}$; $\\frac{15\\pi}{2}=7\\pi+\\frac{\\pi}{2}$, so $\\sin=-1$.",
      "$3^{15}=14348907$, so the answer is $-14348907$."
    ],
    "trap": "Using $15\\bmod4=3$ but remembering the third derivative of $\\sin$ as $+\\cos$, which gives $+14348907$. The cycle is $\\sin\\to\\cos\\to-\\sin\\to-\\cos$.",
    "check": "Via Taylor coefficients: the $x^{15}$ term of $\\sin3x$ is $\\frac{(-1)^7(3x)^{15}}{15!}$; multiplying by $15!$ gives $-3^{15}$."
  },
  "burst-int-014": {
    "spot": "$\\int_0^{\\pi/2}\\sin^{10}x$: Wallis for even powers, $\\frac{9}{10}\\cdot\\frac{7}{8}\\cdot\\frac{5}{6}\\cdot\\frac{3}{4}\\cdot\\frac12\\cdot\\frac{\\pi}{2}$.",
    "why": "Reducing the power five times would expand into a long string of multiple-angle $\\cos$ terms; Wallis is a one-line product.",
    "steps": [
      "Reduction formula: $I_n=\\frac{n-1}{n}I_{n-2}$. Check with $n=10$.",
      "Reduce all the way to $I_0=\\frac{\\pi}{2}$: $\\frac{9\\cdot7\\cdot5\\cdot3\\cdot1}{10\\cdot8\\cdot6\\cdot4\\cdot2}=\\frac{945}{3840}=\\frac{63}{256}$.",
      "Multiply by $\\frac{\\pi}{2}$: $\\frac{63\\pi}{512}$."
    ],
    "trap": "Forgetting the final factor $\\frac{\\pi}{2}$ for an even power and answering $\\frac{63}{256}$.",
    "check": "Size: $\\sin^{10}x$ is only sizable near $\\frac{\\pi}{2}$; the integral is about $0.387$, much smaller than $\\int\\sin^2=\\frac{\\pi}{4}$."
  },
  "burst-int-030": {
    "spot": "$\\ln x$ times $\\frac{1}{1+x}$ on $[0,1]$: expand $\\frac{1}{1+x}=\\sum(-1)^nx^n$ and integrate term by term, using $\\int_0^1x^n\\ln x\\,dx=-\\frac{1}{(n+1)^2}$ for each term.",
    "why": "There's no elementary antiderivative ($\\mathrm{Li}_2$ shows up); after expanding you get an alternating $\\frac{1}{n^2}$ series, and the answer is half of $\\zeta(2)$.",
    "steps": [
      "$\\int_0^1x^n\\ln x\\,dx=-\\frac{1}{(n+1)^2}$. Check with $n=3$.",
      "Term by term: $\\int_0^1\\frac{\\ln x}{1+x}dx=-\\sum_{n\\ge1}\\frac{(-1)^{n-1}}{n^2}$.",
      "The alternating sum $\\sum\\frac{(-1)^{n-1}}{n^2}=\\left(1-\\frac{2}{4}\\right)\\zeta(2)=\\frac{\\pi^2}{12}$.",
      "So the answer is $-\\frac{\\pi^2}{12}$."
    ],
    "trap": "Using $\\zeta(2)=\\frac{\\pi^2}{6}$ for the alternating sum and answering $-\\frac{\\pi^2}{6}$. The denominator is $1+x$ (alternating), not $1-x$.",
    "check": "Sign: $\\ln x<0$ on $(0,1)$, so the integral should be negative; its size is about $-0.822$."
  },
  "burst-int-040": {
    "spot": "$x^3\\arctan x$: $u=\\arctan x$, $dv=x^3dx$. Writing the antiderivative as $\\frac{x^4-1}{4}$ (adding a constant) makes the rational function after parts cancel directly.",
    "why": "Choose $v=\\frac{x^4-1}{4}$; then $\\frac{x^4-1}{1+x^2}=x^2-1$ and you skip long division entirely.",
    "steps": [
      "By parts ($v=\\frac{x^4-1}{4}$): $\\int x^3\\arctan x\\,dx=\\frac{(x^4-1)\\arctan x}{4}-\\frac14\\int\\frac{x^4-1}{1+x^2}dx$.",
      "$\\frac{x^4-1}{1+x^2}=x^2-1$.",
      "$-\\frac14\\left(\\frac{x^3}{3}-x\\right)=-\\frac{x^3}{12}+\\frac{x}{4}$. So the answer is $\\frac{(x^4-1)\\arctan x}{4}-\\frac{x^3}{12}+\\frac x4+C$.",
      "Differentiate back to check."
    ],
    "trap": "Using $v=\\frac{x^4}{4}$ also works, but the long division often drops the $\\frac{1}{1+x^2}$ term, losing the $-\\frac{\\arctan x}{4}$.",
    "check": "Definite integral: for $\\int_0^1x^3\\arctan x\\,dx$, the $\\arctan$ term is $0$ at $x=1$, leaving $-\\frac1{12}+\\frac14=\\frac16$."
  },
  "db-chain-011": {
    "spot": "$\\tan^3(2x)$ has three layers: cube, $\\tan$, $2x$. Chain Rule from the outside in: $3\\tan^2(2x)\\cdot\\sec^2(2x)\\cdot2$.",
    "why": "A pure composition — peel it layer by layer with the Chain Rule; no need to rewrite as $\\sin^3/\\cos^3$ and use the Quotient Rule.",
    "steps": [
      "Outermost $u^3$: $3\\tan^2(2x)\\cdot(\\tan2x)'$.",
      "Middle and inner layers: $(\\tan2x)'=\\sec^2(2x)\\cdot2$.",
      "Combine: $6\\tan^2(2x)\\sec^2(2x)=\\frac{6\\tan^2(2x)}{\\cos^2(2x)}$."
    ],
    "trap": "Missing the innermost $2$ and answering $3\\tan^2(2x)\\sec^2(2x)$.",
    "check": "Plug in $x=\\frac{\\pi}{8}$: $\\tan\\frac{\\pi}{4}=1$, $\\sec^2\\frac{\\pi}{4}=2$, so the derivative is $=12$."
  }
};
