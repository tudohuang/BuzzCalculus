// Detail v2, English — batch 038. Translation of tools/content/detail/038.js (text only; claims live in the Chinese file).
module.exports = {
  "lec-03-q1b": {
    "spot": "In the curve $x^2+xy+y^2=7$ the variables $x$, $y$ are tangled together and there is a cross term $xy$ — use implicit differentiation and plug in $(1,2)$ directly to get the slope.",
    "why": "Solving for $y$ in terms of $x$ means taking a square root and picking a branch; differentiating both sides with respect to $x$ and plugging in the point only leaves a linear equation to solve.",
    "steps": [
      "First confirm the point is on the curve: $1+2+4=7$.",
      "Differentiate both sides with respect to $x$; $xy$ needs the Product Rule: $2x+\\left(y+xy'\\right)+2yy'=0$.",
      "Rearrange to $y'=-\\frac{2x+y}{x+2y}$ and plug in $(1,2)$: $y'=-\\frac{4}{5}$.",
      "Point-slope form: $y=2-\\frac{4}{5}(x-1)=\\frac{14-4x}{5}$."
    ],
    "trap": "Differentiating $xy$ as just $y'$ (dropping the $y$ term from the Product Rule) gives $2x+y'+2yy'=0$ and slope $-\\frac{2}{5}$, so the whole tangent line is wrong.",
    "check": "The tangent line must pass through $(1,2)$: plugging in $x=1$ gives $y=2$."
  },
  "lec-04-m5": {
    "spot": "$xe^{-x}$ is a product, so its derivative has the form \"polynomial $\\times e^{-x}$\"; $e^{-x}$ is always positive, so the sign depends entirely on the polynomial part.",
    "why": "The increasing interval is where $f'>0$. Factor out the always-positive exponential and you only have one linear factor to sign-check.",
    "steps": [
      "Product Rule: $f'(x)=e^{-x}-xe^{-x}=(1-x)e^{-x}$.",
      "$e^{-x}>0$, so $f'>0\\iff 1-x>0\\iff x<1$; at $x=1$ the derivative is $0$.",
      "For $x>1$, $f'<0$ and the function decreases.",
      "So $f$ is increasing on $(-\\infty,1)$."
    ],
    "trap": "Reading the sign of $f'$ backwards and answering $(1,\\infty)$; there $f'<0$ and the function is actually going down.",
    "check": "$f(0)=0$, $f(1)=e^{-1}\\approx 0.37$, $f(2)=2e^{-2}\\approx 0.27$: it rises until $x=1$ and then falls."
  },
  "lec-04-q3d": {
    "spot": "A rational function whose numerator degree is one higher than the denominator: long-divide first to get $x+1+\\frac{1}{x-1}$, and only the $\\frac{1}{x-1}$ term contributes to the second derivative.",
    "why": "Applying the Quotient Rule twice to $\\frac{x^2}{x-1}$ gets messy fast. After long division the linear part has second derivative $0$, so $f''$ is visible at a glance.",
    "steps": [
      "Long division: $\\frac{x^2}{x-1}=x+1+\\frac{1}{x-1}$.",
      "The second derivative of $x+1$ is $0$; the second derivative of $\\frac{1}{x-1}$ is $\\frac{2}{(x-1)^3}$.",
      "$\\frac{2}{(x-1)^3}>0\\iff x>1$; for $x<1$ it is negative (concave down).",
      "So $f$ is concave up on $(1,\\infty)$ ($x=1$ is not in the domain)."
    ],
    "trap": "Looking only at the numerator $2>0$ of $f''$ and saying it is concave up everywhere, answering $(-\\infty,1)\\cup(1,\\infty)$; the denominator $(x-1)^3$ is negative for $x<1$.",
    "check": "Near $x=0$: $f(-1)=-\\frac{1}{2}$, $f(0)=0$, $f(\\frac{1}{2})=-\\frac{1}{2}$. The midpoint is higher than the ends, so it really is concave down there and not part of the answer."
  },
  "lec-06-q2a": {
    "spot": "$F(x)=\\int_1^x(\\cdots)dt$ has upper limit $x$ and the integrand has no $x$ in it — the Fundamental Theorem of Calculus just replaces $t$ with $x$.",
    "why": "$\\sqrt{1+t^3}$ has no elementary antiderivative, so integrating first and then differentiating goes nowhere; the Fundamental Theorem lets you skip integration entirely.",
    "steps": [
      "Fundamental Theorem of Calculus: $F'(x)=\\sqrt{1+x^3}$.",
      "Plug in $x=2$: $\\sqrt{1+8}=\\sqrt 9$.",
      "So $F'(2)=3$."
    ],
    "trap": "Thinking you must compute $F(2)$ first, or also plugging in the lower limit $1$ and subtracting; the lower limit is a constant and contributes nothing to the derivative.",
    "check": "Near $x=2$, each extra $0.01$ adds roughly $0.01\\times 3$ to $F$."
  },
  "lec-06-q2c": {
    "spot": "You are told that \"the integral of $f$ equals $x\\sin x$\" and you want $f$ itself — differentiate both sides with respect to $x$; the Fundamental Theorem turns the left side into $f(x)$.",
    "why": "No need to guess what $f$ looks like; differentiating both sides of an integral equation is the most direct way to free $f$.",
    "steps": [
      "Left side: $\\frac{d}{dx}\\int_0^xf(t)\\,dt=f(x)$; right side by the Product Rule: $\\sin x+x\\cos x$.",
      "So $f(x)=\\sin x+x\\cos x$; integrating it back really does give $x\\sin x$.",
      "Plug in $x=\\frac{\\pi}{2}$: $\\sin\\frac{\\pi}{2}+\\frac{\\pi}{2}\\cos\\frac{\\pi}{2}=1+0=1$."
    ],
    "trap": "Plugging $\\frac{\\pi}{2}$ straight into $x\\sin x$ to get $\\frac{\\pi}{2}$; that is the value of the integral, not of $f$.",
    "check": "At $x=0$ both sides are $0$, so the condition is consistent; and $f(\\frac{\\pi}{2})$ lies within the range of $\\sin$."
  },
  "lec-11-q1a": {
    "spot": "$\\sqrt{n^2+n}-n$ is \"a square root minus something of nearly the same size\", an $\\infty-\\infty$ form — multiply by the conjugate to rationalize.",
    "why": "Rationalizing turns the difference into a sum in the denominator and leaves $n$ on top; dividing through by $n$ then makes the limit obvious.",
    "steps": [
      "Multiply by $\\frac{\\sqrt{n^2+n}+n}{\\sqrt{n^2+n}+n}$: the numerator becomes $(n^2+n)-n^2=n$.",
      "Divide top and bottom by $n$: $\\frac{1}{\\sqrt{1+\\frac{1}{n}}+1}$.",
      "$\\sqrt{1+\\frac{1}{n}}\\to 1$, so the limit is $\\frac{1}{1+1}=\\frac{1}{2}$."
    ],
    "trap": "Seeing $\\sqrt{n^2+n}\\approx n$ and saying the difference is $0$; the small $n$ inside the root contributes $\\frac{1}{2}$ and can't just be dropped.",
    "check": "$n=100$: $\\sqrt{10100}-100\\approx 0.4988$, closing in on $\\frac{1}{2}$."
  },
  "lec-11-q2d": {
    "spot": "All three grow by \"multiplying in one more factor each step\": $2^n$ multiplies by $2$, $n!$ by $n+1$, and every factor of $n^n$ is $n$ — compare what gets multiplied at each step to rank them.",
    "why": "Looking at the ratio of consecutive terms is the most intuitive: the one whose ratio keeps growing must leave the one with a fixed ratio behind.",
    "steps": [
      "Each step multiplies $\\frac{n!}{2^n}$ by $\\frac{n+1}{2}$; for $n\\ge 2$ this factor exceeds $1$ and keeps growing, so $\\frac{2^n}{n!}\\to 0$.",
      "$\\frac{n!}{n^n}=\\frac{1}{n}\\cdot\\frac{2}{n}\\cdots\\frac{n}{n}\\le\\frac{1}{n}$, so $\\frac{n!}{n^n}\\to 0$.",
      "The order already shows for small $n$: at $n=5$, $32<120<3125$.",
      "So from slowest to fastest: $2^n\\ll n!\\ll n^n$."
    ],
    "trap": "Thinking \"exponentials are the fastest\" and putting $2^n$ after $n!$; an exponential with a fixed base loses to the factorial, because the factorial's multiplier keeps getting bigger.",
    "check": "$n=10$: $2^{10}=1024$, $10!=3628800$, $10^{10}$ — each gap is much bigger than the last."
  },
  "lec-11-q4b": {
    "spot": "$\\left(1+\\frac{3}{n}\\right)^{2n}$: the base tends to $1$ and the exponent to infinity, a $1^\\infty$ form — use $\\left(1+\\frac{a}{n}\\right)^n\\to e^a$.",
    "why": "Split the exponent as $\\left[\\left(1+\\frac{3}{n}\\right)^n\\right]^2$ and use the definition of $e$ directly — no logarithms needed.",
    "steps": [
      "Standard limit: $\\left(1+\\frac{3}{n}\\right)^n\\to e^3$.",
      "The exponent has an extra $2$: $\\left(1+\\frac{3}{n}\\right)^{2n}=\\left[\\left(1+\\frac{3}{n}\\right)^n\\right]^2$; with logs it is $2n\\ln\\left(1+\\frac{3}{n}\\right)\\to 6$.",
      "So the limit is $\\left(e^3\\right)^2=e^6$."
    ],
    "trap": "Thinking the base tends to $1$ so the answer is $1$; or remembering $e^3$ but forgetting the square outside.",
    "check": "Plug in $n=1000$: $1.003^{2000}\\approx 399.8$, while $e^6\\approx 403.4$."
  },
  "lec-12-q3a": {
    "spot": "The denominator is $2^n+n$; the big part is $2^n$, and adding $n$ only makes the term smaller — compare directly with the geometric series $\\sum\\frac{1}{2^n}$ as an upper bound.",
    "why": "The Comparison Test finishes it in one line; the Ratio Test also works but costs an extra limit.",
    "steps": [
      "$2^n+n>2^n$, so $0<\\frac{1}{2^n+n}<\\frac{1}{2^n}$.",
      "$\\sum_{n\\ge1}\\frac{1}{2^n}$ is a geometric series with ratio $\\frac{1}{2}$ and sum $1$.",
      "Comparison Test: the original series converges, and its sum is less than $1$."
    ],
    "trap": "Seeing $n$ in the denominator, thinking of the harmonic series $\\sum\\frac{1}{n}$ and calling it divergent; the dominant term in the denominator is $2^n$, not $n$.",
    "check": "The first two terms give $\\frac{1}{3}+\\frac{1}{6}=\\frac{1}{2}$, and later terms decay even faster than $\\frac{1}{2^n}$."
  },
  "lec-13-q2a": {
    "spot": "A polynomial $n^2$ over an exponential $2^n$: the exponential dominates and the ratio of consecutive terms is a clean expression — use the Ratio Test.",
    "why": "The Ratio Test reduces $2^n$ to the constant $\\frac{1}{2}$, the polynomial part's ratio tends to $1$, and you immediately get the limit $\\frac{1}{2}<1$.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)^2/2^{n+1}}{n^2/2^n}=\\frac{(n+1)^2}{2n^2}$.",
      "As $n\\to\\infty$ the ratio tends to $\\frac{1}{2}$.",
      "$\\frac{1}{2}<1$, so the Ratio Test gives convergence (the sum is actually $6$)."
    ],
    "trap": "Seeing the numerator $n^2\\to\\infty$, thinking the terms don't go to $0$ and calling it divergent; the denominator $2^n$ grows much faster.",
    "check": "At $n=20$ a term is only $\\frac{400}{2^{20}}\\approx 0.0004$, already tiny."
  },
  "lec-13-q2b": {
    "spot": "There is a factorial $n!$ and a $3^n$: dividing consecutive terms collapses the factorial to $n+1$ — a textbook Ratio Test problem.",
    "why": "Factorials are hard to compare with other series directly; the Ratio Test turns $\\frac{n!}{(n+1)!}$ into $\\frac{1}{n+1}$, showing in one step that the ratio tends to $0$.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{3^{n+1}/(n+1)!}{3^n/n!}=\\frac{3}{n+1}$.",
      "The ratio tends to $0$.",
      "$0<1$, so the Ratio Test gives convergence; this is exactly the Taylor series of $e^3$, so the sum is $e^3$."
    ],
    "trap": "Seeing the first few terms $1,3,4.5,4.5,3.375$ grow and concluding divergence; from $n\\ge3$ on, each term is multiplied by something less than $1$.",
    "check": "$e^3\\approx 20.09$ is finite, consistent with convergence."
  },
  "lim-016": {
    "spot": "$x+\\frac{1}{2}$ is exactly the first two terms of the expansion of $\\sqrt{x^2+x}$, so the leftover difference is of order $\\frac{1}{x}$, and multiplying by $x$ makes it finite — rationalize using all of $x+\\frac{1}{2}$ as the conjugate.",
    "why": "Pairing with $x+\\frac{1}{2}$ as the conjugate makes the numerator's difference of squares the constant $-\\frac{1}{4}$, faster than a second-order Taylor expansion.",
    "steps": [
      "$\\sqrt{x^2+x}-\\left(x+\\frac{1}{2}\\right)=\\frac{(x^2+x)-\\left(x+\\frac{1}{2}\\right)^2}{\\sqrt{x^2+x}+x+\\frac{1}{2}}$.",
      "Numerator: $(x^2+x)-\\left(x^2+x+\\frac{1}{4}\\right)=-\\frac{1}{4}$.",
      "Multiply by $x$ and divide top and bottom by $x$: $\\frac{-1}{4\\left(\\sqrt{1+\\frac{1}{x}}+1+\\frac{1}{2x}\\right)}$.",
      "As $x\\to\\infty$ the denominator $\\to 4(1+1)=8$, so the limit is $-\\frac{1}{8}$."
    ],
    "trap": "Thinking $\\sqrt{x^2+x}\\approx x+\\frac{1}{2}$ makes the bracket $0$ and answering $0$; the bracket is $-\\frac{1}{8x}$, and multiplying by $x$ leaves a constant.",
    "check": "Plug in $x=100$: $-\\frac{100}{4\\left(\\sqrt{10100}+100.5\\right)}\\approx -0.1248$."
  },
  "lim-018": {
    "spot": "In the numerator $\\sin x-x\\cos x$ the linear terms $x-x$ cancel, and the denominator is $x^3$ — a Taylor expansion up to the $x^3$ term settles it.",
    "why": "Expanding to the cubic term shows the coefficient in one step; L'Hôpital's Rule also works, but you must recheck the form each time, and expansion is harder to get wrong.",
    "steps": [
      "$\\sin x=x-\\frac{x^3}{6}+O(x^5)$.",
      "$x\\cos x=x\\left(1-\\frac{x^2}{2}+O(x^4)\\right)=x-\\frac{x^3}{2}+O(x^5)$.",
      "Subtract: $\\left(x-\\frac{x^3}{6}\\right)-\\left(x-\\frac{x^3}{2}\\right)=\\frac{x^3}{3}$.",
      "Divide by $x^3$: the limit is $\\frac{1}{3}$."
    ],
    "trap": "Using only $\\sin x\\approx x$ and $\\cos x\\approx 1$, getting a numerator of $0$ and answering $0$; once the linear terms cancel, the cubic terms decide the answer.",
    "check": "Plug in $x=0.1$: $\\frac{\\sin 0.1-0.1\\cos 0.1}{0.001}\\approx 0.3332$."
  },
  "lm-fl-002": {
    "spot": "As $x\\to 0^-$, $\\left\\lfloor\\frac{1}{x}\\right\\rfloor$ shoots to negative infinity, but it differs from $\\frac{1}{x}$ by less than $1$ — squeeze with $s-1<\\lfloor s\\rfloor\\le s$, and flip the inequalities when multiplying by the negative $x$.",
    "why": "The floor function jumps, so L'Hôpital's Rule is useless; the Squeeze Theorem swaps it for continuous bounds — just remember that $x<0$ reverses the inequalities.",
    "steps": [
      "Take $s=\\frac{1}{x}$: $\\frac{1}{x}-1<\\left\\lfloor\\frac{1}{x}\\right\\rfloor\\le\\frac{1}{x}$. For example, at $x=-0.3$, $\\frac{1}{x}\\approx -3.33$ and the floor is $-4$.",
      "Multiply by $x<0$, which reverses the inequalities: $1\\le x\\left\\lfloor\\frac{1}{x}\\right\\rfloor<1-x$.",
      "On the right $1-x\\to 1$; the left side is always $1$.",
      "Squeeze Theorem: the limit is $1$."
    ],
    "trap": "Forgetting that $x$ is negative when multiplying by $x$, so the inequalities aren't flipped and you get an upside-down squeeze like $1-x<\\cdots\\le 1$; or reading it as \"$0\\cdot\\infty=0$\" and answering $0$.",
    "check": "Plug in $x=-0.07$: $\\frac{1}{x}\\approx -14.29$, the floor is $-15$, and the product is $1.05$."
  },
  "lm-fl-005": {
    "spot": "The inner $\\frac{\\sin x}{x}$ tends to $1$, but from below (always slightly less than $1$) — the floor function jumps at the integer $1$, so what matters is which side you come from.",
    "why": "The floor function is discontinuous, so you can't move the limit inside; first establish that $\\frac{\\sin x}{x}$ lies in $(0,1)$, and then the floor is always $0$.",
    "steps": [
      "For $x\\ne0$, $|\\sin x|<|x|$ (the derivative of $x-\\sin x$ is $1-\\cos x\\ge0$), so $\\frac{\\sin x}{x}<1$ on both sides.",
      "For $x$ near $0$, $\\frac{\\sin x}{x}$ is also positive and very close to $1$.",
      "So $0<\\frac{\\sin x}{x}<1$, and $\\left\\lfloor\\frac{\\sin x}{x}\\right\\rfloor=0$ throughout a neighborhood of $0$; the limit is $0$."
    ],
    "trap": "Computing $\\frac{\\sin x}{x}\\to 1$ first and then taking the floor, answering $\\lfloor 1\\rfloor=1$; the floor function is discontinuous at integers, so the limit can't be moved inside.",
    "check": "Plug in $x=0.001$: $\\frac{\\sin x}{x}\\approx 0.99999983$, and its floor is still $0$."
  },
  "lm-fl-006": {
    "spot": "The inner $\\frac{\\tan x}{x}$ tends to $1$ and is always slightly greater than $1$ — approaching the integer $1$ from above, so the floor is always $1$.",
    "why": "The floor function jumps at integers; the key is which side of the integer $\\frac{\\tan x}{x}$ sits on within $[1,2)$, not its limit value itself.",
    "steps": [
      "For $0<|x|<\\frac{\\pi}{2}$, $|\\tan x|>|x|$ (the derivative of $\\tan x-x$ is $\\sec^2x-1>0$), and $\\frac{\\tan x}{x}$ is even, so it exceeds $1$ on both sides.",
      "Also $\\frac{\\tan x}{x}\\to 1$, so near $0$ it is less than $2$.",
      "So $1<\\frac{\\tan x}{x}<2$, and $\\left\\lfloor\\frac{\\tan x}{x}\\right\\rfloor=1$ throughout a neighborhood of $0$; the limit is $1$."
    ],
    "trap": "Here \"take the limit, then the floor\" happens to give $1$ too, but that's luck; the same method on $\\left\\lfloor\\frac{\\sin x}{x}\\right\\rfloor$ wrongly gives $1$ (the correct answer is $0$).",
    "check": "Plug in $x=0.001$: $\\frac{\\tan x}{x}\\approx 1.00000033$, whose floor is $1$."
  },
  "lm-rs-013": {
    "spot": "Each term has denominator $n^2+k$ with $k$ at most $n$ — $k$ is tiny compared with $n^2$. So each of the $n$ terms is about $\\frac{1}{n^2}$, and the total is about $\\frac{1}{n}$.",
    "why": "It looks like a Riemann sum but isn't (each term is of order $\\frac{1}{n^2}$, not $\\frac{1}{n}$); squeezing with the largest and smallest terms is cleanest.",
    "steps": [
      "$1\\le k\\le n$, so $\\frac{1}{n^2+n}\\le\\frac{1}{n^2+k}\\le\\frac{1}{n^2+1}$.",
      "Add the $n$ terms: $\\frac{n}{n^2+n}=\\frac{1}{n+1}\\le\\sum\\le\\frac{n}{n^2+1}$.",
      "The upper bound $\\frac{n}{n^2+1}<\\frac{1}{n}$ becomes arbitrarily small for large $n$; the lower bound $\\frac{1}{n+1}>0$.",
      "Squeeze Theorem: the limit is $0$."
    ],
    "trap": "Forcing a Riemann sum, writing $\\frac{1}{n}\\sum\\frac{1}{1+k/n}$ and getting $\\ln 2$; but the denominator is $n^2+k$, not $n(n+k)$, so after pulling out $\\frac{1}{n}$ there is still an extra $\\frac{1}{n}$.",
    "check": "At $n=1000$ both bounds lie between $\\frac{1}{1001}$ and $\\frac{1000}{1000001}$, about $0.001$."
  },
  "lm-sq-001": {
    "spot": "$\\sin\\frac{1}{x}$ oscillates wildly but stays in $[-1,1]$, and the factor in front, $\\sqrt{|x|}\\to 0$ — bounded times something going to zero: use the Squeeze Theorem.",
    "why": "$\\sin\\frac{1}{x}$ has no limit itself, so you can't split it into a product of two limits; bounding the absolute value kills the oscillation most cleanly.",
    "steps": [
      "$\\left|\\sin\\frac{1}{x}\\right|\\le 1$, so $\\left|\\sqrt{|x|}\\sin\\frac{1}{x}\\right|\\le\\sqrt{|x|}$.",
      "$\\sqrt{|x|}\\to 0$: for example, at $|x|=10^{-4}$ it is only $0.01$.",
      "Squeeze Theorem: $-\\sqrt{|x|}\\le\\cdots\\le\\sqrt{|x|}$, both sides tend to $0$, so the limit is $0$."
    ],
    "trap": "Seeing that $\\sin\\frac{1}{x}$ has no limit and concluding the whole limit doesn't exist; the factor in front goes to $0$ and flattens the oscillation with it.",
    "check": "Plug in $x=10^{-6}$: the value has size at most $\\sqrt{10^{-6}}=0.001$."
  },
  "lm-sq-007": {
    "spot": "$\\frac{\\sin x}{x}\\to 1$ does not go to $0$, so near $0$ the whole expression behaves like $\\sin\\frac{1}{x}$, oscillating between $-1$ and $1$ — find two paths giving different values.",
    "why": "Unlike $x\\sin\\frac{1}{x}$, the front factor doesn't flatten the oscillation; to prove nonexistence, take two sequences that tend to different values.",
    "steps": [
      "The front factor tends to $1$.",
      "Take $x_k=\\frac{1}{\\frac{\\pi}{2}+2k\\pi}\\to 0$: $\\sin\\frac{1}{x_k}=1$, so the expression tends to $1$.",
      "Take $y_k=\\frac{1}{\\frac{3\\pi}{2}+2k\\pi}\\to 0$: $\\sin\\frac{1}{y_k}=-1$, so the expression tends to $-1$.",
      "The two paths approach different values $1$ and $-1$, so the limit does not exist."
    ],
    "trap": "Mixing it up with $x\\sin\\frac{1}{x}$ and answering $0$ because it's \"bounded times something\"; the Squeeze Theorem needs the front factor to go to $0$, and here it goes to $1$.",
    "check": "At points as close as $x=0.001$ and $x=0.0011$, the values of $\\sin\\frac{1}{x}$ can differ a lot — it never settles down."
  },
  "mob-nabla-008": {
    "spot": "$\\nabla\\cdot\\nabla f$: first take the gradient (first partials as a vector), then the divergence (differentiate each component again in its own coordinate) — the result is the sum of the second partials in each coordinate.",
    "why": "Unpacking the two operators layer by layer shows it is $f_{xx}+f_{yy}+f_{zz}$, which is exactly the Laplacian.",
    "steps": [
      "Take $f=x^2y+y^3$ as an example: the gradient is $\\nabla f=(f_x,f_y)=(2xy,\\ x^2+3y^2)$.",
      "The divergence differentiates the first component in $x$ and the second in $y$: $\\nabla\\cdot\\nabla f=f_{xx}+f_{yy}=2y+6y$.",
      "In general $\\nabla\\cdot\\nabla f=\\frac{\\partial^2 f}{\\partial x^2}+\\frac{\\partial^2 f}{\\partial y^2}+\\frac{\\partial^2 f}{\\partial z^2}$, written $\\nabla^2 f$ or $\\Delta f$.",
      "So $\\nabla\\cdot\\nabla f$ is called the Laplacian ($\\nabla^2 f$)."
    ],
    "trap": "Confusing it with $\\nabla\\times\\nabla f$ (the curl, always zero) or $\\nabla(\\nabla\\cdot\\vec F)$; the divergence of a gradient is a scalar, the sum of second partials.",
    "check": "For $f=x^2+y^2+z^2$ every second partial is $2$, so the Laplacian is $6$."
  },
  "mob-trap-009": {
    "spot": "Plugging in and getting $\\frac{0}{0}$ only says \"top and bottom are both shrinking\" — not which shrinks faster. It's an indeterminate form; you need to simplify, use a Taylor expansion or L'Hôpital's Rule to get an answer.",
    "why": "The same $\\frac{0}{0}$ can produce any value with a different example, so it isn't a number by itself and needs further analysis.",
    "steps": [
      "$\\frac{\\sin x}{x}$ is $\\frac{0}{0}$ and its limit is $1$.",
      "$\\frac{x^2}{\\sin x}$ is also $\\frac{0}{0}$, yet its limit is $0$; $\\frac{1-\\cos x}{x^2}$ gives $\\frac{1}{2}$.",
      "$\\frac{x}{x^3}$ even blows up to infinity: at $x=0.01$ it is already $10^4$.",
      "So $\\frac{0}{0}$ is an indeterminate form; it doesn't automatically equal $0$ or $1$ — simplify first, then evaluate."
    ],
    "trap": "Seeing a $0$ in the numerator and answering $0$, or seeing \"both are $0$\" and cancelling to $1$; both treat an indeterminate form as a definite number.",
    "check": "Same $\\frac{0}{0}$ form: $\\frac{\\sin 2x}{x}$ gives $2$ and $\\frac{\\sin x}{2x}$ gives $\\frac{1}{2}$."
  },
  "mob-trap-011": {
    "spot": "$\\nabla\\times(\\nabla f)$: each component of the curl is a difference of two mixed partials, like $f_{yx}-f_{xy}$; as long as $f$ is smooth enough the mixed partials are equal, so it is always zero.",
    "why": "No need to compute all three components; recognize that \"the curl is a difference of mixed partials\", apply equality of mixed partials, and you get the zero vector in a second.",
    "steps": [
      "Take $f=x^2y^3$ as an example: $f_x=2xy^3$, $f_y=3x^2y^2$.",
      "The $z$ component of the curl is $\\frac{\\partial f_y}{\\partial x}-\\frac{\\partial f_x}{\\partial y}$: both terms are $6xy^2$.",
      "So the $z$ component is $0$; the other two components are likewise differences of mixed partials.",
      "Now take $f=xz^2$ and look at the $y$ component: $\\frac{\\partial f_x}{\\partial z}-\\frac{\\partial f_z}{\\partial x}=2z-2z=0$. Conclusion: $\\nabla\\times(\\nabla f)$ is always the zero vector — a gradient field is always curl-free."
    ],
    "trap": "Grinding out all three components and making an error halfway that gives something nonzero; or confusing it with $\\nabla\\cdot\\nabla f$ (the Laplacian, generally not zero).",
    "check": "Same with $f=\\sin(xy)$: $f_x=y\\cos(xy)$, $f_y=x\\cos(xy)$, and differentiating each in the other variable gives $\\cos(xy)-xy\\sin(xy)$ both times."
  },
  "refine-integrals-006": {
    "spot": "The integrand is a broken line, each piece straight — the definite integral is signed area, so cut it into triangles and rectangles; the last piece crosses the $x$-axis at $x=5$.",
    "why": "Geometric areas are done at a glance, without writing out the piecewise function and integrating; just remember area below the $x$-axis counts as negative.",
    "steps": [
      "$[0,2]$: the triangle from $(0,0)$ to $(2,2)$, area $\\frac{1}{2}\\cdot2\\cdot2=2$.",
      "$[2,4]$: a rectangle of height $2$, area $4$.",
      "$[4,6]$: the line $f=10-2x$, zero at $x=5$; the triangle above gives $+1$ and the one below $-1$, which cancel.",
      "Total $2+4+0=6$."
    ],
    "trap": "Adding both triangles in the last piece as positive to get $2+4+1+1=8$; that is total area, not the definite integral.",
    "check": "On the whole interval $f$ stays between $-2$ and $2$ over a length of $6$, so the integral lies between $-12$ and $12$, with clearly more positive part."
  },
  "refine-integrals-011": {
    "spot": "$y=\\sqrt{4-(x-3)^2}$ is the upper half of the circle $(x-3)^2+y^2=4$, and the interval $[1,5]$ runs exactly from its leftmost to rightmost point — it's the area of a semicircle.",
    "why": "The problem explicitly says to use the area interpretation; recognizing the semicircle saves a trigonometric substitution.",
    "steps": [
      "Square both sides: $(x-3)^2+y^2=4$, center $(3,0)$, radius $2$; $y\\ge0$ is the upper half.",
      "At $x=1$ and $x=5$ the radicand is $0$ — exactly the left and right endpoints of the circle — so the interval covers the whole upper semicircle.",
      "Semicircle area $\\frac{1}{2}\\pi\\cdot2^2=2\\pi$."
    ],
    "trap": "Computing the whole circle $4\\pi$, or taking the radius as $4$ to get $8\\pi$; the square root gives only the upper half, and the radius is $\\sqrt4=2$.",
    "check": "The semicircle's area must lie between the inscribed triangle $\\frac{1}{2}\\cdot4\\cdot2=4$ and the bounding rectangle $4\\cdot2=8$; $2\\pi\\approx 6.28$."
  },
  "refine-integrals-037": {
    "spot": "The exponent $x^3$ differentiates to $3x^2$, and there is an $x^2$ sitting right in front — the inner derivative is right there, a standard $u$-substitution.",
    "why": "Let $u=x^3$; the whole $x^2\\,dx$ becomes $\\frac{1}{3}du$ and the integrand becomes $e^u$. Integration by parts would only push the degree higher.",
    "steps": [
      "Let $u=x^3$, $du=3x^2\\,dx$, so $x^2\\,dx=\\frac{1}{3}du$.",
      "$\\int x^2e^{x^3}dx=\\frac{1}{3}\\int e^u\\,du=\\frac{1}{3}e^{x^3}+C$.",
      "So the most direct method is $u$-substitution (change of variables)."
    ],
    "trap": "Seeing a product and reaching for integration by parts with $dv=e^{x^3}dx$, which can't be integrated; $e^{x^3}$ alone has no elementary antiderivative — it needs the $x^2$ beside it for the substitution.",
    "check": "Differentiate back: $\\frac{d}{dx}\\frac{1}{3}e^{x^3}=\\frac{1}{3}\\cdot3x^2e^{x^3}$, exactly the original integrand."
  },
  "refine-integrals-038": {
    "spot": "A rational function whose denominator $x^2+x-2=(x+2)(x-1)$ factors into two distinct linear factors, with numerator of lower degree — partial fractions.",
    "why": "The numerator $x+5$ isn't a multiple of the denominator's derivative $2x+1$, so $u$-substitution is messy; splitting into two $\\frac{A}{x-a}$ pieces makes each one integrate to a logarithm.",
    "steps": [
      "Factor the denominator: $x^2+x-2=(x+2)(x-1)$.",
      "Set $\\frac{x+5}{(x+2)(x-1)}=\\frac{A}{x-1}+\\frac{B}{x+2}$; by the cover-up method $A=\\frac{1+5}{3}=2$, $B=\\frac{-2+5}{-3}=-1$.",
      "Integrate: $2\\ln|x-1|-\\ln|x+2|+C$.",
      "So the most direct method is partial fractions."
    ],
    "trap": "Trying the substitution $u=x^2+x-2$; the numerator $x+5$ isn't a multiple of $2x+1$, so forcing it leaves a leftover piece that still has to be split.",
    "check": "Recombine to check: $2(x+2)-(x-1)=x+5$, which matches the numerator."
  },
  "refine-limits-011": {
    "spot": "As $x\\to0$ the numerator $1-\\cos 4x$ is second-order small and so is the denominator $x\\tan3x$ — use the equivalent infinitesimals $1-\\cos u\\sim\\frac{u^2}{2}$ and $\\tan u\\sim u$.",
    "why": "Two standard substitutions give $\\frac{8x^2}{3x^2}$ at once, much faster than applying L'Hôpital's Rule twice.",
    "steps": [
      "$1-\\cos4x=2\\sin^2 2x\\sim\\frac{(4x)^2}{2}=8x^2$.",
      "$\\tan3x\\sim3x$, so the denominator $x\\tan3x\\sim3x^2$.",
      "Divide: $\\frac{8x^2}{3x^2}=\\frac{8}{3}$."
    ],
    "trap": "Replacing $1-\\cos4x$ with $(4x)^2=16x^2$ and forgetting to divide by $2$, getting $\\frac{16}{3}$.",
    "check": "Plug in $x=0.01$: $\\frac{1-\\cos0.04}{0.01\\tan0.03}\\approx 2.666$."
  },
  "refine-limits-012": {
    "spot": "Numerator and denominator are products of trig functions, and as $x\\to0$ each is equivalent to its angle: $\\sin x\\sim x$, $\\sin3x\\sim3x$, $\\tan2x\\sim2x$.",
    "why": "In a product, equivalent infinitesimals can be swapped one factor at a time, giving the coefficient ratio in one line; L'Hôpital's Rule would mean a pile of Product Rule work.",
    "steps": [
      "Numerator $\\sin x\\sin3x\\sim x\\cdot3x=3x^2$.",
      "Denominator $x\\tan2x\\sim x\\cdot2x=2x^2$.",
      "Divide: $\\frac{3x^2}{2x^2}=\\frac{3}{2}$."
    ],
    "trap": "Swapping only partly, e.g. replacing $\\sin3x$ by $x$ (dropping the coefficient $3$) to get $\\frac{1}{2}$; every angle's coefficient has to come along.",
    "check": "Plug in $x=0.01$: the value is about $1.4994$, close to $\\frac{3}{2}$."
  },
  "refine-limits-013": {
    "spot": "$\\sqrt{4x^2+x}-2x$: the root's leading term is exactly $2x$, an $\\infty-\\infty$ form — multiply by the conjugate to rationalize.",
    "why": "After rationalizing the numerator is just $x$ and the denominator is a sum of two things of size $2x$; dividing by $x$ shows $\\frac{1}{4}$.",
    "steps": [
      "Multiply by $\\frac{\\sqrt{4x^2+x}+2x}{\\sqrt{4x^2+x}+2x}$: the numerator becomes $(4x^2+x)-4x^2=x$.",
      "Divide top and bottom by $x$: $\\frac{1}{\\sqrt{4+\\frac{1}{x}}+2}$.",
      "As $x\\to\\infty$: $\\frac{1}{2+2}=\\frac{1}{4}$."
    ],
    "trap": "When dividing by $x$, forgetting that inside the root you divide by $x^2$, writing $\\sqrt{4x+1}$ and getting $0$; or just saying $\\sqrt{4x^2+x}\\approx2x$ and answering $0$.",
    "check": "Plug in $x=1000$: $\\sqrt{4001000}-2000\\approx 0.24998$."
  },
  "refine-limits-014": {
    "spot": "Numerator and denominator are both \"square root minus a number\" and both become $0$ at $x=2$ — multiply each by its own conjugate, and a common factor $x-2$ appears in both.",
    "why": "Rationalizing both lets $x-2$ cancel, and the rest can be evaluated directly; L'Hôpital's Rule works too, but rationalizing is less prone to coefficient errors.",
    "steps": [
      "Numerator times its conjugate: $(\\sqrt{x+7}-3)(\\sqrt{x+7}+3)=x-2$.",
      "Denominator times its conjugate: $(\\sqrt{x+2}-2)(\\sqrt{x+2}+2)=x-2$.",
      "Cancel $x-2$: the expression $=\\frac{\\sqrt{x+2}+2}{\\sqrt{x+7}+3}$.",
      "Plug in $x=2$: $\\frac{2+2}{3+3}=\\frac{2}{3}$."
    ],
    "trap": "Rationalizing only the numerator, so the denominator is still $\\sqrt{x+2}-2\\to0$, and concluding the limit is infinite; both need handling for $x-2$ to cancel.",
    "check": "Cross-check with L'Hôpital's Rule: $\\frac{1/(2\\sqrt9)}{1/(2\\sqrt4)}=\\frac{1/6}{1/4}=\\frac{2}{3}$."
  },
  "refine-limits-015": {
    "spot": "The denominator has an absolute value $|x-2|$ and it's a right-hand limit $x\\to2^+$ — drop the absolute value using $x>2$ first, then factor and cancel.",
    "why": "The absolute value has different formulas on the two sides of $x=2$, so you must pick a side before simplifying; the numerator $x^2-4$ conveniently contains $x-2$.",
    "steps": [
      "For $x>2$, $|x-2|=x-2$.",
      "Cancel: $\\frac{x^2-4}{x-2}=x+2$.",
      "As $x\\to2^+$: $x+2\\to4$."
    ],
    "trap": "Ignoring \"right-hand\" and saying the absolute value flips the sign, answering $-4$; that's the left-hand limit. The two sides differ, so the two-sided limit actually doesn't exist.",
    "check": "From the left it is $-(x+2)\\to-4$, the mirror of $4$ on the right — exactly what the absolute value does."
  },
  "refine-limits-016": {
    "spot": "As $x\\to3^+$, $x$ lies in $(3,4)$, so the floor $\\lfloor x\\rfloor$ is fixed at $3$ — the numerator is simply $x-3$.",
    "why": "The floor function is constant on each interval between integers; once you know which interval the one-sided approach lives in, you can replace it, no limit tricks needed.",
    "steps": [
      "For $3<x<4$, $\\lfloor x\\rfloor=3$; for example at $x=3.25$, $x-3$ lies in $(0,1)$.",
      "The numerator $x-\\lfloor x\\rfloor=x-3$, so for $x>3$ nearby the expression is identically $\\frac{x-3}{x-3}=1$.",
      "The right-hand limit is $1$."
    ],
    "trap": "Treating $\\lfloor x\\rfloor$ as an approximation of $x$ and getting stuck on $\\frac{0}{0}$, or using the left-side value $\\lfloor x\\rfloor=2$; from the left the numerator tends to $1$ and the denominator to $0^-$, which blows up to negative infinity.",
    "check": "Plug in $x=3.01$: $\\frac{3.01-3}{0.01}=1$."
  },
  "refine-limits-017": {
    "spot": "Numerator and denominator are sums of exponentials, and the largest base is $3$ — divide top and bottom by $3^n$ and $(\\frac{2}{3})^n$ disappears.",
    "why": "Dividing by the dominant term is the standard move for \"several exponentials added together\", leaving a ratio of constants; the $3^{n+1}$ in the denominator leaves behind a factor $3$.",
    "steps": [
      "Divide top and bottom by $3^n$: $\\frac{1+(\\frac{2}{3})^n}{3-(\\frac{2}{3})^n}$.",
      "$\\frac{2}{3}<1$, so $(\\frac{2}{3})^n\\to0$.",
      "The limit is $\\frac{1+0}{3-0}=\\frac{1}{3}$."
    ],
    "trap": "Treating $3^{n+1}$ and $3^n$ as \"the same size\" and cancelling to get $1$; $3^{n+1}=3\\cdot3^n$, and the extra $3$ stays in the denominator.",
    "check": "$n=10$: $\\frac{59049+1024}{177147-1024}\\approx 0.3411$, heading toward $\\frac{1}{3}$."
  },
  "refine-limits-018": {
    "spot": "In $\\ln(n^2+1)$ the $n^2$ dominates: factor out $n^2$ and the log turns multiplication into addition, $\\ln n^2=2\\ln n$, while the leftover $\\ln(1+\\frac{1}{n^2})\\to0$.",
    "why": "Log properties turn the numerator into $2\\ln n$ plus a tail going to $0$, even less work than L'Hôpital's Rule.",
    "steps": [
      "$\\ln(n^2+1)=\\ln n^2+\\ln\\left(1+\\frac{1}{n^2}\\right)=2\\ln n+\\ln\\left(1+\\frac{1}{n^2}\\right)$.",
      "Divide by $\\ln n$: $2+\\frac{\\ln(1+1/n^2)}{\\ln n}$, and the second term tends to $0$.",
      "The limit is $2$."
    ],
    "trap": "Thinking \"$\\ln$ grows so slowly\" that top and bottom are about the same, answering $1$; the square inside the log becomes a factor of $2$.",
    "check": "Plug in $n=100$: $\\frac{\\ln10001}{\\ln100}\\approx 2.00002$."
  },
  "refine-limits-019": {
    "spot": "The base $1+3x\\to1$ and the exponent $\\frac{1}{2x}\\to\\infty$, a $1^\\infty$ form — take logs, or rewrite as $(1+3x)^{\\frac{1}{3x}}\\to e$.",
    "why": "Taking logs brings the exponent down to $\\frac{\\ln(1+3x)}{2x}$, and $\\ln(1+u)\\sim u$ gives $\\frac{3}{2}$ in one step.",
    "steps": [
      "Take logs: $\\ln y=\\frac{\\ln(1+3x)}{2x}$.",
      "$\\ln(1+3x)\\sim3x$, so $\\ln y\\to\\frac{3x}{2x}=\\frac{3}{2}$.",
      "Undo the log: the limit is $e^{3/2}$."
    ],
    "trap": "Answering $1$ because the base tends to $1$; or multiplying the $3$ and the $2$ to get $e^6$. The correct exponent is $3$ divided by $2$.",
    "check": "Plug in $x=0.001$: $1.003^{500}\\approx 4.475$, while $e^{1.5}\\approx 4.482$."
  },
  "refine-limits-020": {
    "spot": "$\\frac{x+2}{x-1}\\to1$ with exponent $x\\to\\infty$, a $1^\\infty$ form — write the base as $1+\\frac{3}{x-1}$ and it's a variant of the definition of $e$.",
    "why": "After splitting off $1+\\frac{3}{x-1}$, the exponents $x$ and $x-1$ are of the same size, giving $e^3$ directly; taking logs also works with the same steps.",
    "steps": [
      "$\\frac{x+2}{x-1}=1+\\frac{3}{x-1}$.",
      "Take logs: $x\\ln\\left(1+\\frac{3}{x-1}\\right)\\sim x\\cdot\\frac{3}{x-1}\\to3$.",
      "The limit is $e^3$."
    ],
    "trap": "Answering $1$ because the base tends to $1$; or splitting top and bottom as $\\left(1+\\frac{2}{x}\\right)^x\\big/\\left(1-\\frac{1}{x}\\right)^x=\\frac{e^2}{e^{-1}}$ but losing the minus sign and getting $e$.",
    "check": "The split version: $\\frac{e^2}{e^{-1}}=e^3$, so both routes agree."
  },
  "refine-limits-021": {
    "spot": "The leading terms on top and bottom are both $x^2$, and the $\\sin x$, $\\cos x$ beside them are bounded — divide by $x^2$, and bounded over $x^2$ vanishes.",
    "why": "Dividing by the highest power does it in one step; L'Hôpital's Rule gets worse here, and after the second application you get an oscillating expression with no limit.",
    "steps": [
      "Divide by $x^2$: $\\frac{1+\\frac{\\sin x}{x^2}}{2+\\frac{\\cos x}{x^2}}$.",
      "$\\left|\\frac{\\sin x}{x^2}\\right|\\le\\frac{1}{x^2}$ and $\\left|\\frac{\\cos x}{x^2}\\right|\\le\\frac{1}{x^2}$; for example, at $x=1000$ the bound is only $10^{-6}$.",
      "So the limit is $\\frac{1+0}{2+0}=\\frac{1}{2}$."
    ],
    "trap": "Applying L'Hôpital's Rule twice to get $\\frac{2+\\cos x}{4-\\sin x}$, which keeps oscillating at infinity, and wrongly concluding the limit doesn't exist; L'Hôpital failing doesn't mean the limit doesn't exist.",
    "check": "Plug in $x=100$: $\\frac{10000+\\sin100}{20000+\\cos100}\\approx 0.49998$."
  },
  "refine-limits-022": {
    "spot": "The numerator is a floor $\\lfloor5x\\rfloor$: it differs from $5x$ by at most $1$, and dividing by $x$ crushes that gap to $0$.",
    "why": "The floor function can't be differentiated; squeezing with $5x-1<\\lfloor5x\\rfloor\\le5x$ is the safest route.",
    "steps": [
      "For every real $s$, $s-1<\\lfloor s\\rfloor\\le s$; take $s=5x$. For example, at $x=2.3$, $5x=11.5$ and the floor is $11$.",
      "Divide by $x>0$: $5-\\frac{1}{x}<\\frac{\\lfloor5x\\rfloor}{x}\\le5$.",
      "The left side $5-\\frac{1}{x}\\to5$, and the right side is always $5$.",
      "Squeeze Theorem: the limit is $5$."
    ],
    "trap": "Thinking the floor keeps \"eating\" a chunk and answering something smaller than $5$; it loses at most $1$ each time, and after dividing by $x$ that effect goes to $0$.",
    "check": "Plug in $x=100.13$: $5x=500.65$, the floor is $500$, and dividing by $100.13$ gives about $4.9935$."
  },
  "refine-limits-023": {
    "spot": "$a_n-4$ simplifies to the clean fraction $-\\frac{9}{n+2}$, which decreases in size with $n$ — solve $\\frac{9}{n+2}<0.007$ to get the threshold.",
    "why": "Writing the error as an exact expression and solving is more reliable than trying numbers; since the error decreases monotonically, every $n$ past the threshold works automatically.",
    "steps": [
      "$a_n-4=\\frac{4n-1-4(n+2)}{n+2}=-\\frac{9}{n+2}$, so $|a_n-4|=\\frac{9}{n+2}$.",
      "$\\frac{9}{n+2}<0.007\\iff n+2>\\frac{9}{0.007}\\approx1285.71\\iff n>1283.71$.",
      "Check the boundary: at $n=1283$, $\\frac{9}{1285}\\approx0.00700389$ is not small enough; at $n=1284$, $\\frac{9}{1286}\\approx0.0069984$ works.",
      "The error decreases with $n$, so the smallest $N=1284$."
    ],
    "trap": "Solving $n>1283.71$ and rounding to $1283$; you need strictly greater, so round up to $1284$. Or forgetting to subtract $2$ and answering $1286$.",
    "check": "At $N=1284$, $a_N=\\frac{5135}{1286}\\approx3.9930$, just under $0.007$ away from $4$."
  },
  "refine-limits-024": {
    "spot": "$f$ is a line with slope $-\\frac{1}{3}$: $|f(x)-L|$ is exactly $\\frac{1}{3}|x-6|$ — the error is proportional to the distance, so $\\delta=3\\varepsilon$.",
    "why": "For a linear function the error can be written exactly, no estimating needed; the largest $\\delta$ comes from solving the equality.",
    "steps": [
      "$f(x)-2=2-\\frac{x}{3}=-\\frac{x-6}{3}$, so $|f(x)-2|=\\frac{|x-6|}{3}$.",
      "$\\frac{|x-6|}{3}<0.02\\iff|x-6|<0.06$.",
      "So the largest $\\delta$ is $0.06$; at $x=6\\pm0.06$ the error just touches $0.02$, and any larger it exceeds it."
    ],
    "trap": "Taking $\\delta=\\varepsilon=0.02$ (ignoring the slope), or dividing the wrong way to get $\\frac{0.02}{3}$; the slope's absolute value is less than $1$, so $\\delta$ should be larger than $\\varepsilon$.",
    "check": "Take $x=6.05$ (inside the range): the error is $\\frac{0.05}{3}\\approx0.0167<0.02$."
  },
  "refine-limits-025": {
    "spot": "Under the root is $5^n$ plus a smaller $n\\cdot3^n$ — factor out the dominant $5^n$, and the rest $\\left(1+n(\\frac{3}{5})^n\\right)^{1/n}\\to1$.",
    "why": "The limit of an $n$-th root only sees the largest base; after factoring out $5^n$ a squeeze finishes it, with no messy log estimates.",
    "steps": [
      "Factor out $5^n$: $\\sqrt[n]{5^n+n3^n}=5\\left(1+n\\left(\\frac{3}{5}\\right)^n\\right)^{1/n}$.",
      "$n\\left(\\frac{3}{5}\\right)^n\\to0$ (exponential decay beats $n$).",
      "So $1\\le\\left(1+n(\\frac{3}{5})^n\\right)^{1/n}\\le 2^{1/n}$ (for large $n$ the bracket is less than $2$), and both sides tend to $1$.",
      "The limit is $5$."
    ],
    "trap": "Splitting the root as $\\sqrt[n]{5^n}+\\sqrt[n]{n3^n}=5+3=8$; roots don't distribute over addition.",
    "check": "Plug in $n=20$: $\\left(5^{20}+20\\cdot3^{20}\\right)^{1/20}\\approx 5.0018$."
  },
  "refine-series-008": {
    "spot": "The condensed term $2^ka_{2^k}=2^k\\cdot(2^k)^{-3/2}$: the two powers of $2^k$ combine to $2^{-k/2}$ — a geometric sequence with ratio $2^{-1/2}$.",
    "why": "Combining with exponent rules reads off the ratio directly, without computing the first few terms and dividing.",
    "steps": [
      "$a_{2^k}=\\frac{1}{(2^k)^{3/2}}=2^{-3k/2}$.",
      "Multiply by $2^k$: $2^k\\cdot2^{-3k/2}=2^{-k/2}=\\left(\\frac{1}{\\sqrt2}\\right)^k$.",
      "Dividing consecutive terms gives the ratio $\\frac{1}{\\sqrt2}$ (less than $1$, so the original series converges)."
    ],
    "trap": "Forgetting the $2^k$ in front and giving the ratio of $a_{2^k}$ alone, $2^{-3/2}=\\frac{1}{2\\sqrt2}$, as the answer.",
    "check": "In general a condensed $p$-series has ratio $2^{1-p}$; plugging in $p=\\frac{3}{2}$ gives $2^{-1/2}$."
  },
  "refine-series-024": {
    "spot": "The summand $\\frac{1}{2^m3^n}$ is \"something in $m$ only\" times \"something in $n$ only\" — the double sum splits straight into a product of two geometric series.",
    "why": "A separable double sum of positive terms factors into a product, and each geometric series takes one line.",
    "steps": [
      "$\\sum_m\\sum_n\\frac{1}{2^m3^n}=\\left(\\sum_{m\\ge1}\\frac{1}{2^m}\\right)\\left(\\sum_{n\\ge1}\\frac{1}{3^n}\\right)$.",
      "$\\sum_{m\\ge1}\\frac{1}{2^m}=1$, $\\sum_{n\\ge1}\\frac{1}{3^n}=\\frac{1/3}{1-1/3}=\\frac{1}{2}$.",
      "Multiply: $1\\cdot\\frac{1}{2}=\\frac{1}{2}$."
    ],
    "trap": "Starting the geometric series at $0$ to get $2\\cdot\\frac{3}{2}=3$; the problem starts at $m=1$, $n=1$.",
    "check": "The first term $\\frac{1}{6}$ is already a third of the total; the sum is bigger than $\\frac{1}{6}$ and less than $1$."
  },
  "refine-series-032": {
    "spot": "$a_n=2^n+3^n$ is a sum of two geometric sequences, so the generating function is two geometric series: $\\frac{1}{1-2x}+\\frac{1}{1-3x}$.",
    "why": "The generating function of $r^n$ is $\\frac{1}{1-rx}$, and sums just add; at $x=\\frac16$ both ratios are less than $1$, so plugging in is safe.",
    "steps": [
      "$\\sum2^nx^n=\\frac{1}{1-2x}$ and $\\sum3^nx^n=\\frac{1}{1-3x}$, so $G(x)=\\frac{1}{1-2x}+\\frac{1}{1-3x}$.",
      "Plug in $x=\\frac{1}{6}$: $\\frac{1}{1-\\frac13}+\\frac{1}{1-\\frac12}=\\frac{3}{2}+2$.",
      "So $G\\left(\\frac{1}{6}\\right)=\\frac{7}{2}$."
    ],
    "trap": "Thinking the generating function is $\\frac{1}{1-5x}$ (merging $2+3$ into one ratio); $2^n+3^n\\ne5^n$.",
    "check": "The first three terms give $2+\\frac{5}{6}+\\frac{13}{36}\\approx3.19$ and the remaining tail is small, so a total of $3.5$ is reasonable."
  },
  "refine-series-054": {
    "spot": "$H_{3n}-H_n=\\sum_{k=n+1}^{3n}\\frac{1}{k}$: from $n$ to $3n$ there are $2n$ terms, each of order $\\frac{1}{n}$ — a Riemann sum for $\\int_1^3\\frac{dx}{x}$.",
    "why": "Pulling out $\\frac{1}{n}$ gives a Riemann sum of $\\frac{1}{x}$ on $[1,3]$; alternatively use $H_n\\approx\\ln n+\\gamma$, where the constant $\\gamma$ cancels.",
    "steps": [
      "$H_{3n}-H_n=\\sum_{k=n+1}^{3n}\\frac{1}{k}=\\frac{1}{n}\\sum_{k=n+1}^{3n}\\frac{1}{k/n}$.",
      "$\\frac{k}{n}$ runs from just above $1$ to $3$ in steps of $\\frac{1}{n}$, so this is a Riemann sum for $\\int_1^3\\frac{1}{x}dx$.",
      "Another route: $H_m=\\ln m+\\gamma+o(1)$, and subtracting gives $\\ln3n-\\ln n=\\ln3$.",
      "The limit is $\\ln3$."
    ],
    "trap": "Thinking the difference of two divergent harmonic numbers is still infinite, or that \"$2n$ extra terms\" means the answer is $2$; each term is only of order $\\frac{1}{n}$, and $2n$ of them add up to a finite $\\ln3$.",
    "check": "$n=4$: $\\frac15+\\frac16+\\cdots+\\frac1{12}\\approx1.0156$, already near $\\ln3\\approx1.0986$ (a right-endpoint sum runs low)."
  },
  "refine-series-064": {
    "spot": "$x^n$ behaves completely differently for $x<1$, $x=1$ and $x>1$ — find the limit function piece by piece first; it's a step function, then integrate.",
    "why": "The pointwise limit is piecewise constant, so the integral is just rectangle areas; the single point $x=1$ doesn't affect the integral.",
    "steps": [
      "$0\\le x<1$: $x^n\\to0$, so $f(x)=0$. For example, at $x=\\frac12$, $n=60$ the term is already below $10^{-15}$.",
      "$x=1$: $f(1)=\\frac{1}{2}$; $1<x\\le2$: $x^n\\to\\infty$, so $f(x)=1$.",
      "$\\int_0^2f=0\\cdot1+1\\cdot1=1$ (the single point $x=1$ doesn't matter)."
    ],
    "trap": "Thinking that since every $f_n$ is continuous the limit is too, and integrating some constant like $\\frac{1}{2}$; the limit function jumps at $x=1$, which also shows the convergence is not uniform.",
    "check": "For large $n$, $\\int_0^2f_n$ is also very close to $1$, e.g. at $n=60$."
  },
  "refine-series-070": {
    "spot": "The partial sums jump between $1$ and $0$: $S_1=1,S_2=0,S_3=1,\\ldots$ — on average half are $1$ and half are $0$.",
    "why": "The Cesàro sum is the average of the partial sums; count the $1$s separately for odd and even $N$ and it falls out.",
    "steps": [
      "$S_k=\\frac{1-(-1)^k}{2}$: $1$ for odd $k$, $0$ for even $k$.",
      "$N=2n$: among the first $N$ partial sums there are $n$ copies of $1$, average $\\frac{n}{2n}=\\frac12$.",
      "$N=2n+1$: there are $n+1$ copies of $1$, average $\\frac{n+1}{2n+1}$, which exceeds $\\frac12$ by $\\frac{1}{2(2n+1)}$.",
      "Both tend to $\\frac{1}{2}$, so the Cesàro sum is $\\frac{1}{2}$."
    ],
    "trap": "Averaging the terms instead of the partial sums, computing $\\frac{1-1+1-\\cdots}{N}\\to0$; you average the $S_k$, not the $a_k$.",
    "check": "$N=5$: $\\frac{1+0+1+0+1}{5}=0.6$; $N=6$: $\\frac{3}{6}=0.5$ — converging to $\\frac12$."
  },
  "refine-series-078": {
    "spot": "$a_n$ is itself something raised to the $n$-th power, so the $n$-th root peels it off — leaving $\\frac{2+(-1)^n}{5}$, which takes only two values depending on parity.",
    "why": "The limit superior is the largest subsequential limit; once the root removes the exponent, you only need to check the even and odd cases.",
    "steps": [
      "$\\sqrt[n]{a_n}=\\frac{2+(-1)^n}{5}$.",
      "$n$ even: $\\frac{2+1}{5}=\\frac35$; $n$ odd: $\\frac{2-1}{5}=\\frac15$.",
      "The only subsequential limits are $\\frac15$ and $\\frac35$; the largest is $\\frac35$, so the limit superior is $\\frac35$."
    ],
    "trap": "Saying the problem has no answer because $\\lim\\sqrt[n]{a_n}$ doesn't exist, or averaging the two values to get $\\frac25$; the limit superior takes the largest subsequential limit.",
    "check": "The Root Test uses the limit superior $\\frac35<1$, so $\\sum a_n$ converges; the even terms $\\left(\\frac35\\right)^n$ can themselves be summed."
  },
  "ser-010": {
    "spot": "$(-1)^n$ alternates and $\\frac{1}{\\sqrt n}$ decreases to $0$ — the Alternating Series Test gives convergence; but the absolute values form a $p$-series with $p=\\frac12\\le1$, which diverges.",
    "why": "Showing \"conditionally convergent\" takes two things: the series converges (Alternating Series Test) and the series of absolute values diverges ($p$-series). Both are required.",
    "steps": [
      "$b_n=\\frac{1}{\\sqrt n}$ is decreasing (negative derivative) and tends to $0$.",
      "Alternating Series Test: $\\sum\\frac{(-1)^n}{\\sqrt n}$ converges.",
      "The absolute values $\\sum\\frac{1}{\\sqrt n}$ form a $p$-series with $p=\\frac12$; the corresponding integral $\\int_1^R x^{-1/2}dx=2\\sqrt R-2$ grows without bound in $R$, so it diverges.",
      "Convergent but not absolutely convergent, so it is conditionally convergent."
    ],
    "trap": "Running only the Alternating Series Test and answering \"absolutely convergent\"; or seeing that $\\frac{1}{\\sqrt n}$ sums to infinity and calling the original series divergent. The alternating signs make it converge; only the absolute values diverge.",
    "check": "$\\frac{1}{\\sqrt n}\\ge\\frac1n$, and even the harmonic series diverges, so $\\sum\\frac1{\\sqrt n}$ certainly diverges."
  },
  "ser-011": {
    "spot": "The numerator $2^n+n$ has two parts — split into $\\sum\\left(\\frac23\\right)^n$ (geometric) and $\\sum\\frac{n}{3^n}$ (derivative-of-geometric type) and compute them separately.",
    "why": "You may split only because both parts converge; $\\sum nx^n=\\frac{x}{(1-x)^2}$ comes from differentiating the geometric series and multiplying by $x$.",
    "steps": [
      "$\\sum_{n\\ge1}\\left(\\frac23\\right)^n=\\frac{2/3}{1-2/3}=2$.",
      "$\\sum_{n\\ge1}nx^n=\\frac{x}{(1-x)^2}$; plug in $x=\\frac13$: $\\frac{1/3}{4/9}=\\frac34$.",
      "Total $2+\\frac34=\\frac{11}{4}$."
    ],
    "trap": "Starting the geometric series at $n=0$ to get $\\frac{1}{1-2/3}=3$, making the total $\\frac{15}{4}$; this one starts at $n=1$.",
    "check": "The first two terms give $1+\\frac{6}{9}=\\frac53$, and later terms keep shrinking, so a total of $2.75$ is reasonable."
  },
  "si-set-011": {
    "spot": "A polynomial is differentiable everywhere, so critical points come only from $f'=0$; $f'=3x^2-12$ becomes a difference of squares after factoring out $3$.",
    "why": "A polynomial has no points where the derivative fails to exist, so you only solve the one equation $f'(x)=0$.",
    "steps": [
      "$f'(x)=3x^2-12=3(x-2)(x+2)$.",
      "$f'(x)=0\\iff x=\\pm2$.",
      "So the critical points are $x=-2$ and $x=2$ (a local max of $16$ and a local min of $-16$, respectively)."
    ],
    "trap": "Solving $3x^2=12$ and keeping only the positive root $x=2$, missing $x=-2$; or taking the roots of $f(x)=0$, namely $0,\\pm2\\sqrt3$, as critical points.",
    "check": "$f'$ goes from positive to negative around $-2$ and from negative to positive around $2$, so both are genuine turning points."
  },
  "tmpl-der-chain-exp-002": {
    "spot": "The exponent of $e$ isn't just $x$ but $3x^3$ — Chain Rule: copy the outer $e^u$, then multiply by the derivative of the inner $3x^3$.",
    "why": "The derivative of $e^u$ is itself, so the only work is differentiating the inner part; expanding or taking logs is a detour.",
    "steps": [
      "Let $u=3x^3$; outer layer $\\frac{d}{du}e^u=e^u$.",
      "Inner layer $u'=9x^2$.",
      "Multiply: $\\frac{d}{dx}e^{3x^3}=9x^2e^{3x^3}$."
    ],
    "trap": "Forgetting to multiply by the inner derivative and answering $e^{3x^3}$; or bringing the exponent down like a power, writing $3x^3e^{3x^3-1}$.",
    "check": "At $x=0$ the inner derivative is $0$, so the whole derivative should be $0$."
  },
  "tmpl-der-chain-exp-003": {
    "spot": "The exponent is $5x^2$, not $x$ — Chain Rule: $e^u$ differentiates to $e^u$, then multiply by $(5x^2)'$.",
    "why": "The outer $e^u$ is its own derivative, so the only real computation is the derivative of the inner $5x^2$.",
    "steps": [
      "Let $u=5x^2$; outer layer $\\frac{d}{du}e^u=e^u$.",
      "Inner layer $u'=10x$.",
      "Multiply: $\\frac{d}{dx}e^{5x^2}=10xe^{5x^2}$."
    ],
    "trap": "Writing just $e^{5x^2}$ without the $10x$, or multiplying by only $5$ (forgetting that $x^2$ also needs differentiating) to get $5e^{5x^2}$.",
    "check": "$e^{5x^2}$ is even, so its derivative should be odd: the values at $x$ and $-x$ are negatives of each other."
  },
  "tmpl-der-chain-exp-004": {
    "spot": "The exponent is $x^4$ (the coefficient $1$ is just a template leftover) — Chain Rule: copy $e^u$ and multiply by $(x^4)'=4x^3$.",
    "why": "The outer $e^u$ is its own derivative, so the whole problem is just differentiating the inner power.",
    "steps": [
      "Let $u=x^4$; outer layer $\\frac{d}{du}e^u=e^u$.",
      "Inner layer $u'=4x^3$.",
      "Multiply: $\\frac{d}{dx}e^{x^4}=4x^3e^{x^4}$."
    ],
    "trap": "Differentiating all of $e^{x^4}$ as if it were the power $x^4$ and stopping at $4x^3$; the outer $e^{x^4}$ doesn't disappear.",
    "check": "At $x=1$ the derivative is $4e\\approx10.87$."
  },
  "tmpl-der-chain-exp-005": {
    "spot": "The exponent is $4x^3$ — Chain Rule: the outer $e^u$ stays, multiplied by the derivative of the inner $4x^3$, which is $12x^2$.",
    "why": "$e^u$ is its own derivative, so you only need to differentiate the inner part correctly and multiply it on.",
    "steps": [
      "Let $u=4x^3$; outer layer $\\frac{d}{du}e^u=e^u$.",
      "Inner layer $u'=12x^2$.",
      "Multiply: $\\frac{d}{dx}e^{4x^3}=12x^2e^{4x^3}$."
    ],
    "trap": "Differentiating the inner part only halfway, writing $4x^2e^{4x^3}$ or $3x^2e^{4x^3}$; both the coefficient $4$ and the power $3$ must be multiplied in.",
    "check": "The derivative is $x^2$ times something positive, so it is positive everywhere except $x=0$, and the function increases throughout."
  },
  "tmpl-der-chain-logpoly-001": {
    "spot": "Inside the $\\ln$ is not just $x$ but $x^2+4$ — Chain Rule: $\\frac{1}{\\text{inside}}$ times the derivative of the inside.",
    "why": "The derivative of $\\ln u$ is $\\frac{u'}{u}$, done in one step; the inside is always positive, so the domain is no concern.",
    "steps": [
      "Let $u=x^2+4$; outer layer $\\frac{d}{du}\\ln u=\\frac{1}{u}$.",
      "Inner layer $u'=2x$.",
      "Multiply: $\\frac{2x}{x^2+4}$."
    ],
    "trap": "Writing just $\\frac{1}{x^2+4}$ without the $2x$; or writing $\\frac{1}{2x}$ (putting the inner derivative in the wrong place).",
    "check": "$\\ln(x^2+4)$ is smallest at $x=0$, so the derivative at $0$ should be $0$."
  },
  "tmpl-der-chain-logpoly-002": {
    "spot": "$\\ln$ wraps $x^2+9$ — Chain Rule $\\frac{u'}{u}$: copy the inside into the denominator and put its derivative on top.",
    "why": "The Chain Rule for logs has only one shape, $\\frac{u'}{u}$; once you spot $u$, you can write the answer.",
    "steps": [
      "Let $u=x^2+9$; outer layer $\\frac{d}{du}\\ln u=\\frac{1}{u}$.",
      "Inner layer $u'=2x$.",
      "Multiply: $\\frac{2x}{x^2+9}$."
    ],
    "trap": "Splitting $\\ln(x^2+9)$ into $\\ln x^2+\\ln9$; logs split products, not sums.",
    "check": "At $x=3$ the derivative is $\\frac{6}{18}=\\frac13$."
  },
  "tmpl-der-chain-logpoly-003": {
    "spot": "$\\ln(x^2+3)$: the outer layer is $\\ln$ and the inner one is quadratic — Chain Rule gives $\\frac{(x^2+3)'}{x^2+3}$.",
    "why": "The derivative of $\\ln u$ is $\\frac{u'}{u}$, so you only differentiate the inside once.",
    "steps": [
      "Let $u=x^2+3$; outer layer $\\frac{d}{du}\\ln u=\\frac{1}{u}$.",
      "Inner layer $u'=2x$ (the constant $3$ drops out).",
      "Multiply: $\\frac{2x}{x^2+3}$."
    ],
    "trap": "Forgetting the inner derivative and answering $\\frac{1}{x^2+3}$; or differentiating the constant $3$ as $3$ and writing the numerator as $2x+3$.",
    "check": "At $x=1$ the derivative is $\\frac{2}{4}=\\frac12$."
  },
  "tmpl-der-chain-logpoly-004": {
    "spot": "$\\ln$ wraps $x^2+7$ — Chain Rule: $\\frac{1}{x^2+7}$ times $2x$.",
    "why": "The derivative of a log is \"derivative of the inside over the inside\", done in one step with no Quotient Rule.",
    "steps": [
      "Let $u=x^2+7$; outer layer $\\frac{d}{du}\\ln u=\\frac{1}{u}$.",
      "Inner layer $u'=2x$.",
      "Multiply: $\\frac{2x}{x^2+7}$."
    ],
    "trap": "Writing only $\\frac{1}{x^2+7}$ and forgetting the inside still needs differentiating.",
    "check": "The original function is even, so its derivative is odd: the values at $x$ and $-x$ are negatives of each other."
  },
  "tmpl-der-chain-logpoly-005": {
    "spot": "$\\ln(x^2+5)$: outer $\\ln$, inner $x^2+5$ — Chain Rule $\\frac{u'}{u}$.",
    "why": "For the log Chain Rule, once you spot $u$ the derivative is $\\frac{u'}{u}$; the inside is always positive, so the domain is fine.",
    "steps": [
      "Let $u=x^2+5$; outer layer $\\frac{d}{du}\\ln u=\\frac{1}{u}$.",
      "Inner layer $u'=2x$.",
      "Multiply: $\\frac{2x}{x^2+5}$."
    ],
    "trap": "Differentiating $\\ln(x^2+5)$ as if it were $\\ln x^2+\\ln5$, getting $\\frac{2}{x}$; logs can't be split over addition.",
    "check": "At $x=\\sqrt5$ the derivative is $\\frac{2\\sqrt5}{10}=\\frac{1}{\\sqrt5}$, which is also the derivative's maximum value."
  }
};
