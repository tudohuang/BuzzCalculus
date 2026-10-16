// Detail v2, English — batch 022. Translation of tools/content/detail/022.js (text only; claims live in the Chinese file).
module.exports = {
  "burst-boss-param-003": {
    "spot": "The denominator is $1+ax^2$ — absorb $a$ into the variable ($u=\\sqrt a\\,x$) and it becomes $\\frac{1}{1+u^2}$, which arctangent handles directly.",
    "why": "The problem carries a parameter, but you don't need to differentiate in $a$; one rescaling brings you back to the most standard $\\int_0^\\infty\\frac{du}{1+u^2}=\\frac{\\pi}{2}$.",
    "steps": [
      "Let $u=\\sqrt a\\,x$, $dx=\\frac{du}{\\sqrt a}$; the antiderivative is $\\frac{1}{\\sqrt a}\\arctan(\\sqrt a\\,x)$.",
      "The lower limit $x=0$ gives $0$; at the upper limit $x\\to\\infty$, $\\arctan\\to\\frac{\\pi}{2}$.",
      "So $I(a)=\\frac{\\pi}{2\\sqrt a}$."
    ],
    "trap": "Forgetting $dx=\\frac{du}{\\sqrt a}$ when rescaling, and writing $\\frac{\\pi}{2}$ or $\\frac{\\pi}{2a}$.",
    "check": "At $a=1$ it must reduce to $\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$."
  },
  "dm-int-006": {
    "spot": "The problem hands you $I'(t)=-2tI(t)$ — differentiating in the parameter produces $x e^{-x^2}$, which is exactly the derivative of $e^{-x^2}$; integration by parts turns it back into $I$ itself, giving a first-order differential equation.",
    "why": "Computing $\\int e^{-x^2}\\cos 2x\\,dx$ directly has no elementary antiderivative; treat $t$ as the variable and solve the ODE, and all you need is the starting value $I(0)=\\frac{\\sqrt\\pi}{2}$.",
    "steps": [
      "Starting value: $I(0)=\\int_0^\\infty e^{-x^2}dx=\\frac{\\sqrt\\pi}{2}$.",
      "Differentiate in $t$: $I'(t)=\\int_0^\\infty(-2x e^{-x^2})\\sin(2tx)\\,dx$, and $-2xe^{-x^2}$ is exactly the derivative of $e^{-x^2}$.",
      "Integrate by parts (the boundary term $e^{-x^2}\\sin 2tx$ is $0$ at both $0$ and $\\infty$): $I'(t)=-2t\\int_0^\\infty e^{-x^2}\\cos(2tx)\\,dx=-2tI(t)$. Checked at $t=1$.",
      "$\\frac{I'}{I}=-2t$; integrating gives $I(t)=I(0)e^{-t^2}=\\frac{\\sqrt\\pi}{2}e^{-t^2}$.",
      "Plug in $t=1$: $I(1)=\\frac{\\sqrt\\pi}{2e}$."
    ],
    "trap": "Using the whole-line value $\\int_{-\\infty}^\\infty e^{-x^2}dx=\\sqrt\\pi$ as the starting value gives $\\frac{\\sqrt\\pi}{e}$, twice too big; here the integral starts at $0$.",
    "check": "At $t=2$ the formula gives $\\frac{\\sqrt\\pi}{2}e^{-4}$, which matches direct integration."
  },
  "dm-int-007": {
    "spot": "$\\frac{1}{1-xy}$ with $0\\le xy<1$ — geometric series $\\sum(xy)^n$, and $\\iint(xy)^n$ splits into a product of two one-variable integrals, giving exactly $\\frac{1}{(n+1)^2}$.",
    "why": "Doing the inner integral directly gives $-\\frac{\\ln(1-x)}{x}$, and the outer one still needs an expansion; expand from the start and every term is one line.",
    "steps": [
      "On $[0,1)^2$, $\\frac{1}{1-xy}=\\sum_{n\\ge0}(xy)^n$ (all terms nonnegative, so term-by-term integration is allowed).",
      "Each term separates: $\\int_0^1\\!\\int_0^1x^ny^n\\,dx\\,dy=\\left(\\frac{1}{n+1}\\right)^2$.",
      "So the integral $=\\sum_{n\\ge0}\\frac{1}{(n+1)^2}=\\sum_{m\\ge1}\\frac{1}{m^2}=\\zeta(2)$.",
      "Cross-check another way: the inner integral is $\\int_0^1\\frac{dy}{1-xy}=-\\frac{\\ln(1-x)}{x}$ (checked at $x=\\frac12$), and the outer $\\int_0^1-\\frac{\\ln(1-x)}{x}dx$ is the same number.",
      "$\\zeta(2)=\\frac{\\pi^2}{6}$."
    ],
    "trap": "Computing $\\iint x^ny^n$ as $\\frac{1}{2n+2}$ (adding the two exponents) turns the series into the divergent harmonic series.",
    "check": "The integrand is $\\ge 1$, so the integral is at least $1$; $\\frac{\\pi^2}{6}\\approx1.645$ is reasonable."
  },
  "dm-int-009": {
    "spot": "The problem wants $I''=I$ — a second-order constant-coefficient equation with solution $Ae^t+Be^{-t}$; boundedness $|I|\\le\\frac{\\pi}{2}$ kills $e^t$, and $I(0)=\\frac\\pi2$ fixes the coefficient.",
    "why": "$\\frac{\\cos tx}{1+x^2}$ has no elementary antiderivative; differentiating twice in $t$ directly produces the divergent $\\int\\cos tx\\,dx$, so first rewrite $I'$ using $\\frac{x^2}{1+x^2}=1-\\frac{1}{1+x^2}$, then differentiate again.",
    "steps": [
      "Starting value $I(0)=\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$, and $|I(t)|\\le I(0)$.",
      "$I'(t)=-\\int_0^\\infty\\frac{x\\sin tx}{1+x^2}dx$. Split $\\frac{x}{1+x^2}=\\frac1x-\\frac{1}{x(1+x^2)}$ and use $\\int_0^\\infty\\frac{\\sin tx}{x}dx=\\frac{\\pi}{2}$ (for $t>0$): $I'(t)=-\\frac{\\pi}{2}+\\int_0^\\infty\\frac{\\sin tx}{x(1+x^2)}dx$.",
      "Differentiating that last integral in $t$ gives back exactly $\\frac{\\cos tx}{1+x^2}$, so $I''(t)=I(t)$.",
      "$I=Ae^t+Be^{-t}$; boundedness forces $A=0$, and $I(0)=\\frac\\pi2$ gives $B=\\frac\\pi2$: $I(t)=\\frac{\\pi}{2}e^{-t}$.",
      "Plug in $t=1$: $I(1)=\\frac{\\pi}{2e}$."
    ],
    "trap": "Not using boundedness and solving the second-order equation with only $I(0)=\\frac\\pi2$, so the coefficients can't be determined; or wrongly taking $\\frac{\\pi}{2}\\cosh t$, which blows up as $t\\to\\infty$.",
    "check": "At $t=2$ the formula gives $\\frac{\\pi}{2}e^{-2}$, which matches direct integration."
  },
  "dm-lim-012": {
    "spot": "You want $F(x)$ times $xe^{x^2}$ — that is, the leading term of $F$. Write $e^{-t^2}$ as $\\frac{-1}{2t}\\cdot(-2te^{-t^2})$, and one integration by parts peels off the leading term $\\frac{e^{-x^2}}{2x}$.",
    "why": "You could also apply L'Hôpital's Rule to $\\frac{F(x)}{e^{-x^2}/x}$, but integration by parts also gives the size of the remainder, so you get the error estimate for free.",
    "steps": [
      "$-2te^{-t^2}$ is the derivative of $e^{-t^2}$, so $e^{-t^2}=\\frac{-1}{2t}\\,(e^{-t^2})'$.",
      "Integrate by parts: $F(x)=\\frac{e^{-x^2}}{2x}-\\int_x^\\infty\\frac{e^{-t^2}}{2t^2}dt$. Checked at $x=1$.",
      "Remainder: for $t\\ge x$, $\\frac{1}{2t^2}\\le\\frac{1}{2x^2}$, so $0\\le\\int_x^\\infty\\frac{e^{-t^2}}{2t^2}dt\\le\\frac{F(x)}{2x^2}$, i.e. $F(x)=\\frac{e^{-x^2}}{2x}(1+O(x^{-2}))$. Checked at $x=2$.",
      "Rearranging gives $\\frac12\\cdot\\frac{1}{1+\\frac{1}{2x^2}}\\le xe^{x^2}F(x)\\le\\frac12$. Checked at $x=3$.",
      "Both sides squeeze to the same number: the limit is $\\frac12$."
    ],
    "trap": "Thinking $F(x)\\approx e^{-x^2}$ (plugging the lower limit into the integrand) gives a limit of $\\infty$; that misses the $\\frac{1}{2x}$ produced by integration by parts.",
    "check": "Cross-check with L'Hôpital's Rule: differentiate top and bottom of $\\frac{F(x)}{e^{-x^2}/x}$; the ratio is $\\frac{-e^{-x^2}}{-e^{-x^2}(2+x^{-2})}\\to\\frac12$."
  },
  "dm-seq-002": {
    "spot": "$x_{n+1}=\\sin x_n\\to0$ and the question asks for $\\sqrt n\\,x_n$ — look at the increments of $\\frac{1}{x_n^2}$: $\\frac{1}{\\sin^2x}-\\frac{1}{x^2}\\to\\frac13$. The increments tend to a constant, and the Stolz–Cesàro theorem turns $\\frac{1}{x_n^2}$ into $\\frac n3$.",
    "why": "$x_n$ has no closed form; after switching to $\\frac{1}{x_n^2}$, each step adds about $\\frac13$, and that is the one quantity you can average directly.",
    "steps": [
      "Taylor expansion: $\\sin x=x-\\frac{x^3}{6}+\\cdots$, so $\\frac{1}{\\sin^2x}-\\frac{1}{x^2}=\\frac{x^2-\\sin^2x}{x^2\\sin^2x}\\to\\frac13$.",
      "Since $x_n\\to0$, $\\frac{1}{x_{n+1}^2}-\\frac{1}{x_n^2}\\to\\frac13$.",
      "Stolz–Cesàro (the denominator $n$ increases strictly to $\\infty$): $\\lim\\frac{1/x_n^2}{n}=\\lim\\frac{1/x_{n+1}^2-1/x_n^2}{(n+1)-n}=\\frac13$.",
      "So $n x_n^2\\to3$ and $\\sqrt n\\,x_n\\to\\sqrt3$ (take the positive root since $x_n>0$)."
    ],
    "trap": "Thinking $\\sin x_n\\approx x_n$ means $x_n$ barely moves, so $\\sqrt n\\,x_n\\to\\infty$; in fact $x_n$ creeps toward $0$ at the rate $\\sqrt{3/n}$.",
    "check": "The increment of $\\frac{1}{x^2}$ is already very close to $\\frac13$ near $x=0.3$, so on average $\\frac{1}{x_n^2}\\approx\\frac n3$."
  },
  "dm-seq-006": {
    "spot": "$n$ terms summed and divided by $n^{3/2}$ — rewrite as $\\frac1n\\sum\\sqrt{\\frac kn}$, the right-endpoint Riemann sum of $\\sqrt x$ on $[0,1]$.",
    "why": "The Riemann sum lands on $\\int_0^1\\sqrt x\\,dx$ in one step; Stolz–Cesàro also works, but you have to handle the difference $(n+1)^{3/2}-n^{3/2}$.",
    "steps": [
      "$\\frac{\\sqrt k}{n^{3/2}}=\\frac1n\\sqrt{\\frac kn}$, so the whole expression is $\\frac1n\\sum_{k=1}^n\\sqrt{\\frac kn}$.",
      "As $n\\to\\infty$ the Riemann sum tends to $\\int_0^1\\sqrt x\\,dx=\\frac23$.",
      "Cross-check with Stolz–Cesàro: $\\frac{\\sqrt{n+1}}{(n+1)^{3/2}-n^{3/2}}\\to\\frac{1}{3/2}$.",
      "The limit is $\\frac23$."
    ],
    "trap": "Treating the denominator as $n^2$, or estimating the sum as $n\\sqrt n$, gives $0$ or $1$; the size of $\\sum\\sqrt k$ is $\\frac23n^{3/2}$, not $n\\cdot\\sqrt n$.",
    "check": "Squeeze: $\\int_0^n\\sqrt x\\,dx\\le\\sum_{k=1}^n\\sqrt k\\le\\int_1^{n+1}\\sqrt x\\,dx$, and both sides divided by $n^{3/2}$ tend to $\\frac23$."
  },
  "fd-limx-609": {
    "spot": "$n!$ together with $e^n$ and $n^{n+1/2}$ — this is exactly the ratio in Stirling's formula $n!\\sim\\sqrt{2\\pi n}\\left(\\frac ne\\right)^n$, so the limit is the constant in the square root, $\\sqrt{2\\pi}$.",
    "why": "To derive it instead of memorizing, write $n!$ as $\\int_0^\\infty t^ne^{-t}dt$; after substituting $t=n(1+u)$ the integrand concentrates at $u=0$, and approximating it by a Gaussian integral produces $\\sqrt{2\\pi}$.",
    "steps": [
      "$n!=\\int_0^\\infty t^ne^{-t}\\,dt$ (checked at $n=10$: $10!=3628800$).",
      "Substitute $t=n(1+u)$: $n!=n^{n+1}e^{-n}\\int_{-1}^\\infty\\left((1+u)e^{-u}\\right)^n du$, so the ratio we want $=\\sqrt n\\int_{-1}^\\infty\\left((1+u)e^{-u}\\right)^ndu$.",
      "Near $u=0$, $\\ln\\left((1+u)e^{-u}\\right)=\\ln(1+u)-u\\approx-\\frac{u^2}{2}$, so the integrand looks like $e^{-nu^2/2}$.",
      "Gaussian integral: $\\int_{-\\infty}^\\infty e^{-nu^2/2}du=\\sqrt{\\frac{2\\pi}{n}}$.",
      "Ratio $\\to\\sqrt n\\cdot\\sqrt{\\frac{2\\pi}{n}}=\\sqrt{2\\pi}$."
    ],
    "trap": "Remembering the denominator as $n^n$ (missing the $\\sqrt n$) makes the ratio $\\sqrt{2\\pi n}\\to\\infty$; putting $e^n$ on the wrong side gives $0$.",
    "check": "At $n=10$ the ratio $\\frac{10!\\,e^{10}}{10^{10.5}}\\approx2.528$ is slightly bigger than $\\sqrt{2\\pi}\\approx2.507$, within a factor of $e^{1/120}$ (Stirling's correction term)."
  },
  "td-int-002": {
    "spot": "$\\ln(a+b\\cos x)$ integrated over $[0,\\pi]$, and $5+3\\cos x$ can be written as a sum of squares: $(3+\\cos x)^2+\\sin^2x=2(5+3\\cos x)$ — the log splits into a constant plus a part that averages to $0$.",
    "why": "Differentiating in the parameter $a$ (Feynman's trick) also works, but then you have to fix a constant of integration; after factoring as $\\frac92\\left|1+\\frac{e^{ix}}{3}\\right|^2$, every Fourier term of the remaining part integrates to $0$ on $[0,\\pi]$.",
    "steps": [
      "Complete the square: $(3+\\cos x)^2+\\sin^2x=10+6\\cos x=2(5+3\\cos x)$.",
      "Factor out $9$: $5+3\\cos x=\\frac92\\left(1+\\frac23\\cos x+\\frac19\\right)$, and the bracket is $\\left|1+\\frac{e^{ix}}{3}\\right|^2$.",
      "$\\ln\\left|1+\\frac{e^{ix}}{3}\\right|^2=2\\sum_{n\\ge1}\\frac{(-1)^{n+1}}{n3^n}\\cos nx$, and each term has $\\int_0^\\pi\\cos nx\\,dx=0$, so this part integrates to $0$.",
      "What remains is the constant: $\\int_0^\\pi\\ln\\frac92\\,dx=\\pi\\ln\\frac92$."
    ],
    "trap": "Taking $\\int_0^\\pi\\ln(5+3\\cos x)$ to be $\\pi\\ln5$ (thinking $\\cos$ averages to $0$ so it can be dropped); but $\\ln$ is not linear, and the answer is $\\pi\\ln\\frac{5+\\sqrt{25-9}}{2}$.",
    "check": "The general formula $\\pi\\ln\\frac{a+\\sqrt{a^2-b^2}}{2}$ with $a=5,b=3$ gives $\\pi\\ln\\frac92$; the derivative from the Feynman route, $\\int_0^\\pi\\frac{dx}{5+3\\cos x}=\\frac{\\pi}{4}$, also matches."
  },
  "tr-bnd-009": {
    "spot": "Error of a second-degree Taylor polynomial — the Lagrange remainder uses the third derivative: $|R_2|\\le\\frac{M}{3!}|x-1|^3$, and every derivative of $e^x$ is $e^x$.",
    "why": "$e^x$ is increasing, so the max of the third derivative on $[1,1.5]$ is at the right endpoint; $M=e^{1.5}$ needs no extra search.",
    "steps": [
      "$f'''(x)=e^x$, increasing on $[1,1.5]$, with max $M=e^{1.5}$.",
      "Distance $|x-1|=0.5$, $|x-1|^3=\\frac18$; $3!=6$.",
      "Bound: $\\frac{e^{1.5}}{6}\\cdot\\frac18=\\frac{e^{3/2}}{48}$."
    ],
    "trap": "Using the second derivative or dividing by $2!$, writing $\\frac{e^{1.5}}{8}$; or taking $M$ to be $e^1$ (the left endpoint), which is not an upper bound.",
    "check": "The actual error $e^{1.5}-e(1+0.5+\\frac{0.25}{2})\\approx0.0757$ is indeed no more than the bound $\\approx0.0934$."
  },
  "tr-num-003": {
    "spot": "Every derivative of $\\sin x$ has absolute value $\\le1$, and the interval reaches at most $x=1$ — the Lagrange remainder becomes just $\\frac{1}{(n+1)!}$, so find the first $(n+1)!>10^6$.",
    "why": "No need to actually maximize the error function; the remainder bound depends only on the factorial, so just try values one by one.",
    "steps": [
      "$|R_n(x)|\\le\\frac{\\max|f^{(n+1)}|}{(n+1)!}x^{n+1}\\le\\frac{1}{(n+1)!}$ (for $0\\le x\\le1$).",
      "$n=8$: bound $\\frac{1}{9!}=\\frac{1}{362880}\\approx2.8\\times10^{-6}$, not enough. Also $P_8=P_7=x-\\frac{x^3}{6}+\\frac{x^5}{120}-\\frac{x^7}{5040}$, and its actual error at $x=1$ exceeds $10^{-6}$ too.",
      "$n=9$: bound $\\frac{1}{10!}=\\frac{1}{3628800}<10^{-6}$.",
      "The smallest degree is $n=9$."
    ],
    "trap": "Seeing $\\frac{1}{9!}\\approx2.8\\times10^{-6}$ and deciding it's close enough, picking $n=8$; or treating $n$ as the number of terms and answering $5$.",
    "check": "The actual error of $P_9$ at $x=1$ is $\\approx2.5\\times10^{-8}$, far below $10^{-6}$."
  },
  "der-004": {
    "spot": "$\\sqrt x$ is just $x^{1/2}$ — Power Rule: bring the exponent down and subtract one.",
    "why": "Once rewritten as a power it's one line; no need to go back to the definition of the derivative and rationalize.",
    "steps": [
      "$\\sqrt x=x^{1/2}$.",
      "Power Rule: $\\frac12x^{-1/2}$.",
      "Back to root form: $\\frac{1}{2\\sqrt x}$."
    ],
    "trap": "Getting $x^{3/2}$ when subtracting one from the exponent, or forgetting to multiply by $\\frac12$ and writing $\\frac{1}{\\sqrt x}$.",
    "check": "At $x=4$: tangent slope $\\frac{1}{2\\cdot2}=\\frac14$."
  },
  "exam-int-016": {
    "spot": "$\\ln x$ sits inside $\\cos$, and right next to it is $\\frac1x$ — the derivative of $\\ln x$. Substitute $u=\\ln x$.",
    "why": "The derivative of the inner function is already there, so after substitution only $\\int\\cos u\\,du$ is left; integration by parts would be a detour.",
    "steps": [
      "Let $u=\\ln x$, $du=\\frac{dx}{x}$.",
      "The integral becomes $\\int\\cos u\\,du=\\sin u+C$.",
      "Substitute back: $\\sin(\\ln x)+C$."
    ],
    "trap": "Integrating $\\frac1x$ on its own to $\\ln x$ and multiplying by the antiderivative of $\\cos$, writing $\\ln x\\cdot\\sin(\\ln x)$.",
    "check": "Check with a definite integral: $\\int_1^e\\frac{\\cos(\\ln x)}{x}dx=\\sin1$."
  },
  "fd-lim-012": {
    "spot": "$\\frac{\\sin 4x}{\\sin 2x}$, and $4x=2\\cdot2x$ — the double-angle formula splits the numerator into $2\\sin2x\\cos2x$, and the denominator cancels.",
    "why": "After canceling you have a continuous function, so just plug in $0$; using $\\sin u\\sim u$ also works and gives the same $\\frac{4x}{2x}$.",
    "steps": [
      "Double-angle formula: $\\sin4x=2\\sin2x\\cos2x$.",
      "Cancel $\\sin 2x$: the expression $=2\\cos 2x$.",
      "$x\\to0$: $2\\cos0=2$."
    ],
    "trap": "Treating $\\sin$ as linear and canceling to $\\sin\\frac{4x}{2x}=\\sin 2$.",
    "check": "Equivalent infinitesimals: $\\frac{\\sin4x}{\\sin2x}\\approx\\frac{4x}{2x}=2$."
  },
  "int-002": {
    "spot": "Basic antiderivative table: whose derivative is $\\cos x$? $\\sin x$.",
    "why": "This is a basic formula to know by reflex; no technique needed.",
    "steps": [
      "$(\\sin x)'=\\cos x$.",
      "Read it backwards: an antiderivative of $\\cos x$ is $\\sin x$, plus any constant $C$ (a constant differentiates to $0$).",
      "So $\\int\\cos x\\,dx=\\sin x+C$."
    ],
    "trap": "Mixing it up with the integral of $\\sin x$ and writing $-\\sin x$.",
    "check": "Check with a definite integral: $\\int_0^{\\pi/2}\\cos x\\,dx=\\sin\\frac\\pi2-\\sin0=1$."
  },
  "int-003": {
    "spot": "$x^{-1}$ — the one exception to the power rule ($\\frac{x^0}{0}$ is meaningless); the answer is a logarithm, with absolute value.",
    "why": "$\\ln|x|$ is also defined for $x<0$ and its derivative is still $\\frac1x$, so it covers both sides.",
    "steps": [
      "For $x>0$, $(\\ln x)'=\\frac1x$.",
      "For $x<0$, $(\\ln(-x))'=\\frac{-1}{-x}=\\frac1x$ as well (checked at $x=-2$).",
      "Together: $\\int\\frac1x\\,dx=\\ln|x|+C$."
    ],
    "trap": "Applying the power rule to get $\\frac{x^0}{0}$, or dropping the absolute value and writing just $\\ln x$ (undefined for $x<0$).",
    "check": "Check with a definite integral: $\\int_1^e\\frac{dx}{x}=\\ln e-\\ln1=1$."
  },
  "int-004": {
    "spot": "The exponent of $e$ is $3x$ (linear) — the antiderivative is still $e^{3x}$, just divided by the inner coefficient $3$.",
    "why": "The inner function is linear, so substituting $u=3x$ only produces the constant $\\frac13$; you can write it down directly.",
    "steps": [
      "Let $u=3x$, $du=3\\,dx$, so $dx=\\frac{du}{3}$.",
      "The integral becomes $\\frac13\\int e^udu=\\frac13e^u+C$; differentiating back, the $3$ from the Chain Rule exactly cancels the $\\frac13$.",
      "Answer: $\\frac13e^{3x}+C$."
    ],
    "trap": "Forgetting to divide by $3$, or multiplying by $3$ instead, writing $3e^{3x}$.",
    "check": "Check with a definite integral: $\\int_0^1e^{3x}dx=\\frac{e^3-1}{3}$."
  },
  "int-005": {
    "spot": "$e^{x^2}$ with an $x$ next to it — exactly the derivative of the inner $x^2$ (up to a factor $2$). Substitute $u=x^2$.",
    "why": "$e^{x^2}$ alone has no elementary antiderivative; this problem is doable only because of that $x$. When you see it, substitute.",
    "steps": [
      "Let $u=x^2$, $du=2x\\,dx$, so $x\\,dx=\\frac{du}{2}$.",
      "The integral becomes $\\frac12\\int e^udu=\\frac12e^u+C$.",
      "Substitute back: $\\frac12e^{x^2}+C$."
    ],
    "trap": "Forgetting the $\\frac12$ and writing $e^{x^2}$ (differentiating back gives an extra $2$).",
    "check": "Check with a definite integral: $\\int_0^1xe^{x^2}dx=\\frac{e-1}{2}$."
  },
  "int-006": {
    "spot": "The numerator $2x$ is exactly the derivative of the denominator $1+x^2$ — the $\\frac{f'}{f}$ pattern, which integrates to $\\ln|f|$.",
    "why": "When the numerator is the derivative of the denominator, no splitting and no trig substitution; and $1+x^2>0$, so even the absolute value can go.",
    "steps": [
      "$(1+x^2)'=2x$, which is the numerator.",
      "$\\int\\frac{f'}{f}=\\ln|f|+C$, and $1+x^2>0$: $\\ln(1+x^2)+C$.",
      "Answer: $\\ln(1+x^2)+C$."
    ],
    "trap": "Seeing $1+x^2$ and reflexively writing $\\arctan x$; that's the answer when the numerator is $1$.",
    "check": "Check with a definite integral: $\\int_0^1\\frac{2x}{1+x^2}dx=\\ln2$."
  },
  "int-007": {
    "spot": "$\\cos(x^2)$ multiplied by $x$ — the derivative of the inner $x^2$ (up to a factor $2$). Substitute $u=x^2$.",
    "why": "Same pattern as $\\int xe^{x^2}dx$; the outer function is just $\\cos$ instead.",
    "steps": [
      "Let $u=x^2$, $x\\,dx=\\frac{du}{2}$.",
      "The integral becomes $\\frac12\\int\\cos u\\,du=\\frac12\\sin u+C$.",
      "Substitute back: $\\frac12\\sin(x^2)+C$."
    ],
    "trap": "Dropping the $\\frac12$, or writing $\\sin(x^2)$ as $\\sin^2x$.",
    "check": "Check with a definite integral: $\\int_0^{\\sqrt{\\pi/2}}x\\cos(x^2)dx=\\frac12\\sin\\frac\\pi2=\\frac12$."
  },
  "int-020": {
    "spot": "The numerator $x^2$ is one third of $3x^2$, the derivative of the denominator $1+x^3$ — the $\\frac{f'}{f}$ pattern with a factor $\\frac13$.",
    "why": "No partial fractions needed (factoring $1+x^3$ leaves a quadratic factor to deal with); the logarithm finishes it in one line.",
    "steps": [
      "$(1+x^3)'=3x^2$, so $\\frac{x^2}{1+x^3}=\\frac13\\cdot\\frac{3x^2}{1+x^3}$.",
      "Antiderivative $\\frac13\\ln(1+x^3)$.",
      "Plug in the limits: $\\frac13(\\ln2-\\ln1)=\\frac{\\ln2}{3}$."
    ],
    "trap": "Forgetting the $\\frac13$ and answering $\\ln2$.",
    "check": "On $[0,1]$ the integrand lies between $0$ and $\\frac12$, so the answer $\\approx0.231$ is reasonable."
  },
  "int-029": {
    "spot": "$\\frac{1}{x^2+9}$: constant numerator, denominator of the form $x^2+a^2$ ($a=3$) — the arctangent pattern, $\\frac1a\\arctan\\frac xa$.",
    "why": "The numerator isn't the derivative of the denominator, so it's not a logarithm; the denominator doesn't factor over the reals, so it's not partial fractions either.",
    "steps": [
      "Factor out $9$: $\\frac{1}{x^2+9}=\\frac19\\cdot\\frac{1}{1+(x/3)^2}$.",
      "Let $u=\\frac x3$, $dx=3\\,du$: $\\frac19\\cdot3\\int\\frac{du}{1+u^2}=\\frac13\\arctan u+C$.",
      "Answer: $\\frac13\\arctan\\frac x3+C$."
    ],
    "trap": "Writing $\\arctan\\frac x3$ without the leading $\\frac13$, or writing $\\frac19\\arctan\\frac x3$ (forgetting $dx=3du$).",
    "check": "Check with a definite integral: $\\int_0^3\\frac{dx}{x^2+9}=\\frac13\\cdot\\frac\\pi4=\\frac{\\pi}{12}$."
  },
  "lim-002": {
    "spot": "$1-\\cos x$ over $x^2$ — the half-angle formula $1-\\cos x=2\\sin^2\\frac x2$ turns it into the standard limit $\\left(\\frac{\\sin(x/2)}{x/2}\\right)^2$.",
    "why": "It only uses $\\frac{\\sin u}{u}\\to1$; L'Hôpital's Rule needs two rounds, and the Taylor expansion $1-\\cos x\\approx\\frac{x^2}{2}$ is shorthand for the same thing.",
    "steps": [
      "Half-angle formula: $1-\\cos x=2\\sin^2\\frac x2$.",
      "$\\frac{2\\sin^2(x/2)}{x^2}=\\frac12\\left(\\frac{\\sin(x/2)}{x/2}\\right)^2$.",
      "The bracket tends to $1$, so the limit is $\\frac12$."
    ],
    "trap": "Stopping at $\\frac{1-\\cos x}{x}\\to0$ and concluding the whole thing is $0$, or treating the $\\frac x2$ in $2\\sin^2\\frac x2$ as $x$ and getting $2$.",
    "check": "Taylor expansion: $\\cos x=1-\\frac{x^2}{2}+\\cdots$, so $1-\\cos x\\approx\\frac{x^2}{2}$."
  },
  "lim-003": {
    "spot": "Plugging in $x=2$ gives $\\frac00$, and the numerator $x^2-4$ is a difference of squares containing the factor $(x-2)$.",
    "why": "For a polynomial $\\frac00$, factor and cancel the common factor first; L'Hôpital's Rule works too, but canceling is faster.",
    "steps": [
      "$x^2-4=(x-2)(x+2)$.",
      "Cancel for $x\\ne2$: the expression $=x+2$.",
      "Plug in $x=2$: $4$."
    ],
    "trap": "Seeing $\\frac00$ and saying the limit doesn't exist, or that it's $0$.",
    "check": "L'Hôpital's Rule: $\\frac{2x}{1}$ at $x=2$ is $4$."
  },
  "lim-004": {
    "spot": "A rational function as $x\\to\\infty$ with quadratic top and bottom — only the leading terms matter: $\\frac{3x^2}{2x^2}=\\frac32$.",
    "why": "When the degrees match, the limit is the ratio of leading coefficients; dividing top and bottom by $x^2$ is the rigorous version.",
    "steps": [
      "Divide top and bottom by $x^2$: $\\frac{3-\\frac1x+\\frac{7}{x^2}}{2+\\frac{5}{x^2}}$.",
      "As $x\\to\\infty$, both $\\frac1x$ and $\\frac{1}{x^2}$ tend to $0$.",
      "What's left is the ratio of leading coefficients, $\\frac32$."
    ],
    "trap": "Looking at the constant terms and writing $\\frac75$ (that's the answer for $x\\to0$).",
    "check": "At $x=1000$ it's already very close to $1.5$."
  },
  "rel-basic-003": {
    "spot": "$\\frac{e^{4x}-1}{x}$ as $x\\to0$ — this is the definition of the derivative of $e^{4x}$ at $0$, or use $e^u-1\\sim u$.",
    "why": "Once you recognize the derivative definition, the answer is $(e^{4x})'|_0=4$ with no limit work.",
    "steps": [
      "$\\frac{e^{4x}-1}{x}=\\frac{e^{4x}-e^0}{x-0}$, so the limit is the derivative of $f(x)=e^{4x}$ at $0$.",
      "$f'(x)=4e^{4x}$, $f'(0)=4$.",
      "Limit $=4$."
    ],
    "trap": "Remembering $\\frac{e^u-1}{u}\\to1$ but not making the denominator $4x$, answering $1$.",
    "check": "Equivalent infinitesimals: $e^{4x}-1\\approx4x$, so the ratio is $\\approx4$."
  },
  "rel-basic-005": {
    "spot": "A root minus one in the numerator and $\\frac00$ — multiply by the conjugate $\\sqrt{1+x}+1$ to clear the root from the numerator.",
    "why": "After rationalizing, $x$ cancels directly; you can also see it as the derivative of $\\sqrt{1+x}$ at $0$, which is $\\frac12$.",
    "steps": [
      "Multiply top and bottom by $\\sqrt{1+x}+1$: the numerator becomes $(1+x)-1=x$.",
      "Cancel $x$: the expression $=\\frac{1}{\\sqrt{1+x}+1}$.",
      "Plug in $x=0$: $\\frac{1}{1+1}=\\frac12$."
    ],
    "trap": "Multiplying by the wrong conjugate ($\\sqrt{1+x}-1$): the numerator becomes $(\\sqrt{1+x}-1)^2$ and it's still $\\frac00$.",
    "check": "Derivative definition: $(\\sqrt{1+x})'|_{0}=\\frac{1}{2\\sqrt1}=\\frac12$."
  },
  "ser-024": {
    "spot": "The general term $\\frac{1}{n\\ln n}$ is positive and decreasing, and $\\frac{1}{x\\ln x}$ has a ready-made antiderivative $\\ln(\\ln x)$ — Integral Test.",
    "why": "The Comparison Test has no good partner (it's smaller than $\\frac1n$ yet bigger than every $\\frac{1}{n^p}$ with $p>1$); the Integral Test just asks whether $\\ln\\ln x$ grows without bound.",
    "steps": [
      "$f(x)=\\frac{1}{x\\ln x}$ is positive and decreasing for $x\\ge2$.",
      "Let $u=\\ln x$: $\\int\\frac{dx}{x\\ln x}=\\ln(\\ln x)+C$.",
      "$\\int_2^M\\frac{dx}{x\\ln x}=\\ln\\ln M-\\ln\\ln2$, which grows without bound as $M$ increases (just very slowly).",
      "The integral diverges, so the series diverges."
    ],
    "trap": "Seeing the general term $\\to0$, or that it's smaller than $\\frac1n$, and declaring convergence; being smaller than the harmonic series doesn't mean convergence.",
    "check": "Compare $\\sum\\frac{1}{n(\\ln n)^2}$: its antiderivative is $-\\frac{1}{\\ln x}$, which is bounded, so that one converges."
  },
  "tb-tan-001": {
    "spot": "The tangent slope is the value of the derivative at that point: differentiate first, then plug in $x=2$.",
    "why": "Apply the Power Rule to each term of the polynomial; no need to go back to the limit definition.",
    "steps": [
      "Power Rule term by term: $(x^3)'=3x^2$, $(2x)'=2$.",
      "$y'=3x^2-2$.",
      "Plug in $x=2$: $3\\cdot4-2=10$."
    ],
    "trap": "Plugging $x=2$ into the original function to get $y=4$ and calling it the slope.",
    "check": "Secant slope approximation: $\\frac{y(2.001)-y(2)}{0.001}\\approx10$."
  },
  "exam-int-007": {
    "spot": "$\\sec^2x$ is exactly the derivative of $\\tan x$ — substitute $u=\\tan x$ and the whole thing becomes $\\int u\\,du$.",
    "why": "You could also substitute $u=\\sec x$ ($du=\\sec x\\tan x\\,dx$); the answers differ by a constant. Choosing $\\tan x$ matches the form of the standard answer.",
    "steps": [
      "Let $u=\\tan x$, $du=\\sec^2x\\,dx$.",
      "$\\int u\\,du=\\frac{u^2}{2}+C=\\frac{\\tan^2x}{2}+C$.",
      "Answer: $\\frac12\\tan^2x+C$."
    ],
    "trap": "Getting $\\frac12\\sec^2x$ from $u=\\sec x$ and thinking it's a different answer; in fact $\\sec^2x=1+\\tan^2x$, so they differ only by the constant $\\frac12$.",
    "check": "The answers from the two substitutions differ only by a constant."
  },
  "exam-int-015": {
    "spot": "$\\frac1x$ alongside $\\ln x$ — $\\frac1x$ is the derivative of $\\ln x$, so substitute $u=\\ln x$ and what's left is $\\int\\frac{du}{u}$.",
    "why": "The integrand is $\\frac{(\\ln x)'}{\\ln x}$, the $\\frac{f'}{f}$ pattern; a logarithm finishes it in one line.",
    "steps": [
      "Let $u=\\ln x$, $du=\\frac{dx}{x}$.",
      "$\\int\\frac{du}{u}=\\ln|u|+C$.",
      "Substitute back (for $x>1$, $\\ln x>0$): $\\ln(\\ln x)+C$. Derivative checked at $x=3$.",
      "Answer: $\\ln(\\ln x)+C$."
    ],
    "trap": "Splitting $\\frac{1}{x\\ln x}$ into $\\frac1x\\cdot\\frac{1}{\\ln x}$, integrating each separately and writing $\\ln x\\cdot\\ln(\\ln x)$.",
    "check": "Check with a definite integral: $\\int_e^{e^2}\\frac{dx}{x\\ln x}=\\ln2-\\ln1=\\ln2$."
  },
  "exam-int-018": {
    "spot": "The denominator is $x^4+1=(x^2)^2+1$, and the numerator $x$ is half the derivative of $x^2$ — substitute $u=x^2$ to get the arctangent pattern.",
    "why": "No need to factor $x^4+1$ into two quadratics for partial fractions; one substitution gets you to $\\int\\frac{du}{1+u^2}$.",
    "steps": [
      "Let $u=x^2$, $x\\,dx=\\frac{du}{2}$.",
      "The integral becomes $\\frac12\\int\\frac{du}{1+u^2}=\\frac12\\arctan u+C$.",
      "Substitute back: $\\frac12\\arctan(x^2)+C$."
    ],
    "trap": "Treating the numerator $x$ as the derivative of the denominator and writing $\\ln(x^4+1)$; the derivative of the denominator is $4x^3$.",
    "check": "Check with a definite integral: $\\int_0^1\\frac{x}{x^4+1}dx=\\frac12\\arctan1=\\frac\\pi8$."
  },
  "exam-int-024": {
    "spot": "The numerator $\\sin x$ is exactly the negative of the derivative of the denominator $1+\\cos x$ — the $-\\frac{f'}{f}$ pattern.",
    "why": "The logarithm finishes it in one line; the half-angle route via $\\tan\\frac x2$ also works but takes an extra step.",
    "steps": [
      "$(1+\\cos x)'=-\\sin x$, so $\\frac{\\sin x}{1+\\cos x}=-\\frac{(1+\\cos x)'}{1+\\cos x}$.",
      "Antiderivative $-\\ln(1+\\cos x)$.",
      "Plug in the limits: $-\\ln1+\\ln2=\\ln2$."
    ],
    "trap": "Dropping the minus sign and getting $-\\ln2$; the integrand is positive on the interval, so the answer must be positive.",
    "check": "Half-angle: $\\frac{\\sin x}{1+\\cos x}=\\tan\\frac x2$, and $\\int_0^{\\pi/2}\\tan\\frac x2dx=-2\\ln\\cos\\frac\\pi4=\\ln2$."
  },
  "int-013": {
    "spot": "$(\\ln x)^2$ by itself, with no ready-made antiderivative — integration by parts with $\\ln$ on the side you differentiate ($dv=dx$); each round lowers the power of $\\ln$ by one.",
    "why": "$\\ln$ gets simpler when differentiated, not when integrated; two rounds of integration by parts bring the power of $\\ln$ down to $0$.",
    "steps": [
      "$u=(\\ln x)^2$, $dv=dx$: $du=\\frac{2\\ln x}{x}dx$, $v=x$.",
      "$\\int(\\ln x)^2dx=x(\\ln x)^2-2\\int\\ln x\\,dx$.",
      "Once more: $\\int\\ln x\\,dx=x\\ln x-x$.",
      "Together: $x(\\ln x)^2-2x\\ln x+2x+C=x\\left((\\ln x)^2-2\\ln x+2\\right)+C$."
    ],
    "trap": "Forgetting the leading $-2$ in the second round, or applying the minus sign in $-(x\\ln x-x)$ only to the first term, turning $+2x$ into $-2x$.",
    "check": "Check with a definite integral: $\\int_1^e(\\ln x)^2dx=e(1-2+2)-1\\cdot2=e-2$."
  },
  "int-017": {
    "spot": "A polynomial $x$ times $\\sin x$ — integration by parts, letting $x$ get differentiated away.",
    "why": "Choosing $u=x$ makes it a constant after differentiating; choosing $u=\\sin x$ instead raises $x$ to $\\frac{x^2}{2}$ and makes things worse.",
    "steps": [
      "$u=x$, $dv=\\sin x\\,dx$: $du=dx$, $v=-\\cos x$.",
      "$\\int x\\sin x\\,dx=-x\\cos x+\\int\\cos x\\,dx=-x\\cos x+\\sin x+C$.",
      "Plug in the limits: $\\left(0+1\\right)-\\left(0+0\\right)=1$."
    ],
    "trap": "Writing $v=\\int\\sin x\\,dx$ as $+\\cos x$, which flips the sign of the whole answer to $-1$.",
    "check": "On $[0,\\frac\\pi2]$ the integrand lies between $0$ and $\\frac\\pi2$, and the answer $1$ is below the rectangle bound $\\frac{\\pi^2}{4}\\approx2.47$, so it's reasonable."
  },
  "lim-005": {
    "spot": "$\\frac{e^x-1}{x}$ — this is the definition of the derivative of $e^x$ at $0$.",
    "why": "$(e^x)'=e^x$, which is $1$ at $0$; this is where every $e^u-1\\sim u$ comes from.",
    "steps": [
      "$\\frac{e^x-1}{x}=\\frac{e^x-e^0}{x-0}$, so the limit is the derivative of $e^x$ at $0$.",
      "$(e^x)'=e^x$, which is $1$ at $0$.",
      "Limit $=1$."
    ],
    "trap": "Plugging in $x=0$, getting $\\frac00$, and saying the limit is $0$ or doesn't exist.",
    "check": "Taylor expansion $e^x=1+x+\\frac{x^2}{2}+\\cdots$, so $\\frac{e^x-1}{x}=1+\\frac x2+\\cdots$."
  },
  "lim-006": {
    "spot": "$\\ln(1+3x)$ as $x\\to0$: equivalent infinitesimals $\\ln(1+u)\\sim u$ with $u=3x$.",
    "why": "Substitute directly inside the ratio and you get $\\frac{3x}{x}$ in one step; it's also the derivative of $\\ln(1+3x)$ at $0$.",
    "steps": [
      "$\\frac{\\ln(1+3x)}{x}=3\\cdot\\frac{\\ln(1+3x)}{3x}$.",
      "$\\frac{\\ln(1+u)}{u}\\to1$.",
      "Limit $=3$."
    ],
    "trap": "Remembering $\\frac{\\ln(1+x)}{x}\\to1$ but not adjusting the coefficient, answering $1$.",
    "check": "Derivative definition: $(\\ln(1+3x))'|_0=\\frac{3}{1+0}=3$."
  },
  "ode-lin-007": {
    "spot": "$y'-2y=-4x$: first-order linear with constant coefficient $-2$ — integrating factor $e^{-2x}$.",
    "why": "You could also guess a particular solution $y_p=ax+b$ (the right side is linear) and add the homogeneous solution $Ce^{2x}$; the integrating factor is the general procedure that needs no guessing.",
    "steps": [
      "Multiply by $e^{-2x}$: the left side becomes $(ye^{-2x})'$, so $(ye^{-2x})'=-4xe^{-2x}$.",
      "Integration by parts gives $\\int-4xe^{-2x}dx=(2x+1)e^{-2x}+C$, so $y=2x+1+Ce^{2x}$.",
      "$y(0)=1+C=1$, so $C=0$.",
      "$y=2x+1$; plug back into the equation: $2-2(2x+1)=-4x$."
    ],
    "trap": "Taking the integrating factor as $e^{2x}$ (sign flipped), which gives the wrong exponential term.",
    "check": "Guess a particular solution $y=ax+b$: $a-2ax-2b=-4x$ gives $a=2$, $b=1$, the same as the answer."
  },
  "refine-integrals-016": {
    "spot": "$\\frac3n$ is the width and $1+\\frac{3k}{n}$ runs from $1$ to $4$ — the right-endpoint Riemann sum of $\\int_1^4u^2du$ (or $\\int_0^3(1+x)^2dx$).",
    "why": "Once you recognize the Riemann sum, just compute the definite integral; no need to expand with the $\\sum k^2$ formula.",
    "steps": [
      "The points $x_k=\\frac{3k}{n}$ split $[0,3]$ into $n$ pieces of width $\\frac3n$; the height is $f(x_k)=(1+x_k)^2$.",
      "Limit $=\\int_0^3(1+x)^2dx=\\left[\\frac{(1+x)^3}{3}\\right]_0^3=\\frac{64-1}{3}$.",
      "Answer: $21$."
    ],
    "trap": "Taking the interval as $[0,1]$ (seeing only $\\frac kn$) and computing $\\int_0^1(1+3x)^2dx=7$, missing the width $3$.",
    "check": "Switch to $u=1+x$: $\\int_1^4u^2du=\\frac{64-1}{3}=21$."
  },
  "si-set-002": {
    "spot": "A polynomial is differentiable everywhere, so the critical points are the solutions of $f'=0$; factor $4x$ out of $f'=4x^3-16x$ and then use the difference of squares.",
    "why": "One factorization shows all three roots; no numerical solving needed.",
    "steps": [
      "$f'(x)=4x^3-16x$.",
      "$4x^3-16x=4x(x-2)(x+2)$.",
      "All three roots make the derivative $0$.",
      "The critical points are $x=-2,0,2$."
    ],
    "trap": "After factoring out $4x$, solving only $x^2-4=0$ and missing $x=0$.",
    "check": "$f$ is even, so the critical points are symmetric about $0$; $x=0$ is a local max and $\\pm2$ are local mins."
  },
  "der-028": {
    "spot": "$\\arctan$ wrapped around $e^x$ — Chain Rule: outer derivative $\\frac{1}{1+u^2}$, times the inner derivative $e^x$.",
    "why": "Only one layer of composition, so apply $(\\arctan u)'=\\frac{u'}{1+u^2}$ directly.",
    "steps": [
      "$(\\arctan u)'=\\frac{1}{1+u^2}$.",
      "$u=e^x$, $u'=e^x$, $u^2=e^{2x}$.",
      "Result: $\\frac{e^x}{1+e^{2x}}$."
    ],
    "trap": "Forgetting to multiply by the inner $e^x$ and writing $\\frac{1}{1+e^{2x}}$; or writing $(e^x)^2$ as $e^{x^2}$.",
    "check": "Plug in $x=0$: $\\frac{1}{1+1}=\\frac12$."
  },
  "int-011": {
    "spot": "$\\frac{1}{x^2+4}$: denominator of the form $x^2+a^2$ ($a=2$), constant numerator — $\\frac1a\\arctan\\frac xa$.",
    "why": "The numerator isn't the derivative of the denominator and the denominator doesn't factor over the reals, so it's the arctangent pattern.",
    "steps": [
      "$\\frac{1}{x^2+4}=\\frac14\\cdot\\frac{1}{1+(x/2)^2}$.",
      "Let $u=\\frac x2$, $dx=2\\,du$: $\\frac14\\cdot2\\int\\frac{du}{1+u^2}=\\frac12\\arctan u+C$.",
      "Answer: $\\frac12\\arctan\\frac x2+C$."
    ],
    "trap": "Writing $\\frac14\\arctan\\frac x2$ (forgetting $dx=2du$) or $\\arctan\\frac x2$.",
    "check": "Check with a definite integral: $\\int_0^2\\frac{dx}{x^2+4}=\\frac12\\cdot\\frac\\pi4=\\frac\\pi8$."
  },
  "lim-024": {
    "spot": "$\\ln(1+x)-x$: the first-order term cancels exactly — you need the quadratic term of the Taylor expansion, $-\\frac{x^2}{2}$.",
    "why": "The denominator is $x^2$, so expanding to second order is enough; L'Hôpital's Rule takes two rounds, while the expansion gets there in one step.",
    "steps": [
      "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$.",
      "$\\ln(1+x)-x=-\\frac{x^2}{2}+O(x^3)$; divide by $x^2$: $-\\frac12+O(x)$.",
      "Limit $=-\\frac12$."
    ],
    "trap": "Substituting $\\ln(1+x)\\sim x$ directly to get $\\frac{0}{x^2}=0$; equivalent infinitesimals can't be used inside a difference.",
    "check": "One round of L'Hôpital's Rule: $\\frac{\\frac{1}{1+x}-1}{2x}=\\frac{-1}{2(1+x)}\\to-\\frac12$."
  },
  "lim-040": {
    "spot": "An $\\infty\\cdot0$ form, and the inside of $\\ln(1+\\frac2x)$ tends to $0$ — let $t=\\frac2x$ to get $2\\cdot\\frac{\\ln(1+t)}{t}$.",
    "why": "After the change of variable it's the standard limit $\\frac{\\ln(1+t)}{t}\\to1$; it's also the log version of $\\left(1+\\frac2x\\right)^x\\to e^2$.",
    "steps": [
      "Let $t=\\frac2x$, $x=\\frac2t$; $x\\to\\infty$ corresponds to $t\\to0^+$: the expression $=2\\cdot\\frac{\\ln(1+t)}{t}$.",
      "$\\frac{\\ln(1+t)}{t}\\to1$.",
      "Limit $=2$."
    ],
    "trap": "Seeing $\\ln(1+\\frac2x)\\to0$ and saying the whole thing is $0$, ignoring $x\\to\\infty$.",
    "check": "Compare $\\left(1+\\frac2x\\right)^x\\to e^2$; taking the log gives $2$."
  },
  "ode-lin-005": {
    "spot": "$y'=-y\\tan x$: the right side is $y$ times a function of $x$ only — separable, $\\frac{dy}{y}=-\\tan x\\,dx$.",
    "why": "$\\int-\\tan x\\,dx=\\ln|\\cos x|$ is one line, so after separating just exponentiate.",
    "steps": [
      "Separate: $\\frac{dy}{y}=-\\tan x\\,dx$.",
      "Integrate: $\\ln|y|=\\ln|\\cos x|+C$, since $(\\ln|\\cos x|)'=-\\tan x$.",
      "$y=A\\cos x$, $y(0)=A=2$.",
      "$y=2\\cos x$, which satisfies the equation when plugged back in."
    ],
    "trap": "Remembering $\\int\\tan x\\,dx$ as $\\ln|\\cos x|$ (missing the minus sign) and getting $y=\\frac{2}{\\cos x}$.",
    "check": "At $x=\\frac\\pi3$: $y=1$, $y'=-\\sqrt3$, and $-y\\tan\\frac\\pi3=-\\sqrt3$."
  },
  "ser-030": {
    "spot": "The general term has $n$ and $5^n$ — Ratio Test: the ratio of consecutive terms $\\frac{n}{n+1}\\cdot\\frac{|x-2|}{5}\\to\\frac{|x-2|}{5}$.",
    "why": "$\\frac{n}{n+1}\\to1$, so polynomial factors don't affect the radius; the radius depends only on $5^n$.",
    "steps": [
      "Coefficients $c_n=\\frac{1}{n5^n}$, ratio $\\frac{c_{n+1}}{c_n}=\\frac{n}{5(n+1)}$.",
      "$\\frac{n}{5(n+1)}\\to\\frac15$.",
      "Converges when $\\frac{|x-2|}{5}<1$, so the radius is $R=5$."
    ],
    "trap": "Mixing up the center $2$ with the radius and answering the endpoint $7$ of the interval of convergence; or inverting the ratio and getting $\\frac15$.",
    "check": "The Root Test agrees: $\\sqrt[n]{n5^n}=5\\sqrt[n]{n}\\to5$."
  },
  "ser-038": {
    "spot": "Know the Maclaurin series of $\\ln(1+x)$, $x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$, by heart; the $n$th coefficient is $\\frac{(-1)^{n+1}}{n}$.",
    "why": "It comes from integrating $\\frac{1}{1+x}=1-x+x^2-\\cdots$ term by term, which is faster than computing a third derivative.",
    "steps": [
      "$\\frac{1}{1+x}=\\sum(-1)^nx^n$ (for $|x|<1$).",
      "Integrate term by term: $\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$.",
      "Cross-check with the derivative formula: $f'''(x)=\\frac{2}{(1+x)^3}$, coefficient $\\frac{f'''(0)}{3!}=\\frac26=\\frac13$."
    ],
    "trap": "Flipping the sign and writing $-\\frac13$, or remembering $\\frac{x^n}{n}$ as $\\frac{x^n}{n!}$ and writing $\\frac16$.",
    "check": "At $x=0.1$: $\\ln1.1-(0.1-0.005)\\approx0.00031$, consistent with $\\frac{0.1^3}{3}\\approx0.00033$."
  },
  "si-set-013": {
    "spot": "A polynomial, so the critical points are the roots of $f'=0$; factor $4x^2$ out of $f'=4x^3-12x^2$.",
    "why": "After factoring you can read off the roots at a glance; $x=0$ is a double root but still a critical point.",
    "steps": [
      "$f'(x)=4x^3-12x^2$.",
      "$4x^3-12x^2=4x^2(x-3)$.",
      "Roots: $x=0$ (double) and $x=3$.",
      "The critical points are $x=0$ and $x=3$."
    ],
    "trap": "Canceling $x^2$ and keeping only $x=3$; or excluding $x=0$ because it isn't an extremum (the derivative doesn't change sign) — critical points only require $f'=0$.",
    "check": "On both sides of $x=0$, $f'$ is negative (not an extremum); around $x=3$ it goes from negative to positive (local min)."
  },
  "si-set-014": {
    "spot": "A quotient $\\frac{x}{x^2+1}$ with an always-positive denominator — after the Quotient Rule, only the numerator matters: $1-x^2=0$.",
    "why": "$x^2+1>0$, so it's differentiable everywhere with no points where the derivative fails to exist; critical points come only from the numerator being $0$.",
    "steps": [
      "Quotient Rule: $f'(x)=\\frac{(x^2+1)-x\\cdot2x}{(x^2+1)^2}=\\frac{1-x^2}{(x^2+1)^2}$.",
      "$1-x^2=0$: $x=\\pm1$.",
      "The critical points are $x=-1$ and $x=1$."
    ],
    "trap": "Writing the Quotient Rule numerator in the wrong order as $2x^2-(x^2+1)$; the roots are the same, but every later increasing/decreasing conclusion gets flipped.",
    "check": "$f$ is odd, so the critical points are symmetric; $x=1$ gives the maximum value $\\frac12$."
  },
  "si-set-016": {
    "spot": "$f'(x)=2\\cos x+1$; setting it to $0$ gives $\\cos x=-\\frac12$ — one angle each in the second and third quadrants of the unit circle.",
    "why": "A trig equation: look up the special angles and list every solution in $(0,2\\pi)$.",
    "steps": [
      "$f'(x)=2\\cos x+1$.",
      "$\\cos x=-\\frac12$; in $(0,2\\pi)$: $x=\\frac{2\\pi}{3}$ or $\\frac{4\\pi}{3}$.",
      "The critical points are $x=\\frac{2\\pi}{3}$ and $x=\\frac{4\\pi}{3}$."
    ],
    "trap": "Writing only $\\frac{2\\pi}{3}$ and missing the third-quadrant $\\frac{4\\pi}{3}$; or solving $\\cos x=\\frac12$ instead and getting $\\frac\\pi3,\\frac{5\\pi}{3}$.",
    "check": "$\\frac{2\\pi}{3}$ is a local max and $\\frac{4\\pi}{3}$ is a local min."
  },
  "tmpl-int-partialfrac-001": {
    "spot": "The denominator is two linear factors differing by $1$, $x(x+1)$ — partial fractions $\\frac1x-\\frac{1}{x+1}$, which integrate to a difference of logs.",
    "why": "The two factors differ by the constant $1$, so the coefficients are just $\\pm1$; no equations to solve.",
    "steps": [
      "$\\frac{1}{x(x+1)}=\\frac1x-\\frac{1}{x+1}$.",
      "Antiderivative $\\ln x-\\ln(x+1)=\\ln\\frac{x}{x+1}$.",
      "Plug in the limits: $\\ln\\frac23-\\ln\\frac12=\\ln\\frac43$."
    ],
    "trap": "Splitting it as $\\frac1x+\\frac{1}{x+1}$ (wrong sign) and getting $\\ln3$.",
    "check": "On $[1,2]$ the integrand lies between $\\frac16$ and $\\frac12$, and the answer $\\ln\\frac43\\approx0.288$ falls in between."
  },
  "exam-ser-017": {
    "spot": "The shape $\\frac{x^n}{n!}$ — this is the Maclaurin series of $e^x$ at $x=2$.",
    "why": "Once you recognize the series, write the sum directly; the Ratio Test can only tell you it converges, not what the sum is.",
    "steps": [
      "Every derivative of $e^x$ is $e^x$, which is $1$ at $0$, so $e^x=\\sum_{n\\ge0}\\frac{x^n}{n!}$.",
      "The series converges for every $x$: the ratio of consecutive terms $\\frac{x}{n+1}\\to0$.",
      "Plug in $x=2$: $\\sum\\frac{2^n}{n!}=e^2$."
    ],
    "trap": "Thinking it starts at $n=1$ and writing $e^2-1$; here it starts at $n=0$, so the first term is $1$.",
    "check": "The first six terms $1+2+2+\\frac43+\\frac23+\\frac{4}{15}\\approx7.27$, slightly less than $e^2\\approx7.39$."
  },
  "int-012": {
    "spot": "$\\sin^2x$, an even power — power-reduction formula $\\sin^2x=\\frac{1-\\cos2x}{2}$.",
    "why": "After reducing the power both terms have ready-made antiderivatives, and $\\cos2x$ integrates to exactly $0$ on $[0,\\frac\\pi2]$.",
    "steps": [
      "$\\sin^2x=\\frac{1-\\cos2x}{2}$.",
      "Antiderivative $\\frac x2-\\frac{\\sin2x}{4}$.",
      "Plug in the limits: $\\frac\\pi4-0=\\frac\\pi4$."
    ],
    "trap": "Writing $\\frac{\\sin^3x}{3}$ (applying the power rule as if $\\sin$ were $x$); differentiating back is missing a factor $\\cos x$.",
    "check": "Symmetry: $\\int_0^{\\pi/2}\\sin^2x=\\int_0^{\\pi/2}\\cos^2x$, and the two add up to $\\frac\\pi2$, so each is half."
  },
  "int-025": {
    "spot": "The region is a disk and the integrand is $x^2+y^2$ — both scream polar coordinates: $x^2+y^2=r^2$, $dA=r\\,dr\\,d\\theta$.",
    "why": "In Cartesian coordinates you have to deal with $\\sqrt{1-x^2}$ limits; in polar coordinates the region is the rectangle $[0,1]\\times[0,2\\pi]$.",
    "steps": [
      "Polar coordinates: integrand $r^2$, area element $r\\,dr\\,d\\theta$, so it's $\\int_0^{2\\pi}\\!\\int_0^1r^3\\,dr\\,d\\theta$.",
      "Inner: $\\int_0^1r^3dr=\\frac14$.",
      "Outer, multiply by $2\\pi$: $\\frac{2\\pi}{4}=\\frac\\pi2$."
    ],
    "trap": "Dropping the $r$ in $dA$ and computing $2\\pi\\int_0^1r^2dr=\\frac{2\\pi}{3}$.",
    "check": "Cross-check in Cartesian coordinates: integrate in $y$ from $-\\sqrt{1-x^2}$ to $\\sqrt{1-x^2}$ to get $2x^2\\sqrt{1-x^2}+\\frac23(1-x^2)^{3/2}$, then integrate in $x$."
  },
  "refine-series-012": {
    "spot": "One positive, two negatives: each group is $\\frac{1}{2k-1}-\\frac{1}{4k-2}-\\frac{1}{4k}$ — the first two terms give $\\frac{1}{2k-1}-\\frac{1}{2(2k-1)}=\\frac{1}{2(2k-1)}$, so each group is exactly half of a group of the original series.",
    "why": "Rearranging a conditionally convergent series can change its sum, so you can't just say it's still $\\ln2$; simplify each group of three and you see directly that it's $\\frac12$ of the original alternating harmonic series.",
    "steps": [
      "Group $k$: $\\frac{1}{2k-1}-\\frac{1}{4k-2}-\\frac{1}{4k}=\\frac{1}{4k-2}-\\frac{1}{4k}=\\frac12\\left(\\frac{1}{2k-1}-\\frac{1}{2k}\\right)$.",
      "The original series in pairs: $\\sum\\left(\\frac{1}{2k-1}-\\frac{1}{2k}\\right)=\\ln2$.",
      "The general term tends to $0$, so stopping partway through a group doesn't affect the limit; sum $=\\frac12\\ln2$."
    ],
    "trap": "Thinking every term is still there so the sum is unchanged, answering $\\ln2$; rearranging a conditionally convergent series can change the sum (Riemann rearrangement theorem).",
    "check": "General formula: $p$ positive terms per $q$ negative terms gives sum $=\\ln2+\\frac12\\ln\\frac pq$; $p=1,q=2$ gives $\\frac12\\ln2$."
  },
  "refine-derivatives-037": {
    "spot": "The right side is $x\\sin x$, and $\\sin x$ itself solves $y''+y=0$ — resonance, so the guess needs an extra factor of $x$: degree-$x^2$ polynomials times $\\cos x$ and $\\sin x$.",
    "why": "Without the extra $x$, the constant part of $(\\beta x+\\cdot)\\cos x$ is swallowed by the homogeneous solution and the equations can't be solved; the problem already gives the form, so substitute and match coefficients.",
    "steps": [
      "Let $P=\\alpha x^2+\\beta x$, $Q=\\gamma x^2+\\delta x$, $y=P\\cos x+Q\\sin x$. Then $y''+y=(P''+2Q')\\cos x+(Q''-2P')\\sin x$ (checked with $P=x^2$, $Q=0$).",
      "Substitute: the $\\cos x$ coefficient is $2\\alpha+2\\delta+4\\gamma x$ and the $\\sin x$ coefficient is $2\\gamma-2\\beta-4\\alpha x$; these must equal $0$ and $x$.",
      "Match coefficients: $\\gamma=0$, $-4\\alpha=1$, $\\beta=\\gamma=0$, $\\alpha+\\delta=0$, so $\\alpha=-\\frac14$, $\\delta=\\frac14$.",
      "Particular solution $y_p=-\\frac{x^2}{4}\\cos x+\\frac x4\\sin x$; it satisfies the equation when plugged back in."
    ],
    "trap": "Not multiplying by $x$ and guessing $(Ax+B)\\cos x+(Cx+D)\\sin x$: $B\\cos x$ and $D\\sin x$ are homogeneous solutions, and the coefficient equations become contradictory.",
    "check": "Adding any homogeneous solution $c_1\\cos x+c_2\\sin x$ still gives a solution; the residual is unchanged."
  },
  "refine-series-013": {
    "spot": "Four positives, one negative: the positive terms are used four times as fast as the negative ones — use the log asymptotics of harmonic numbers: the rearranged sum with $p$ positives per $q$ negatives is $\\ln2+\\frac12\\ln\\frac pq$.",
    "why": "Riemann rearrangement: the sum of a conditionally convergent series depends on the ratio at which positive and negative terms are used; count how many terms of each pile a partial sum uses, and compute the difference with $\\ln$ asymptotics.",
    "steps": [
      "Take $m$ groups: they use the first $4m$ positive terms $\\sum_{j\\le4m}\\frac{1}{2j-1}$ and the first $m$ negative terms $\\sum_{j\\le m}\\frac{1}{2j}$.",
      "Asymptotics: $\\sum_{j\\le N}\\frac{1}{2j-1}=\\frac12\\ln N+\\ln2+\\frac\\gamma2+o(1)$, $\\sum_{j\\le m}\\frac{1}{2j}=\\frac12\\ln m+\\frac\\gamma2+o(1)$. Check with the original series ($N=m$): the difference tends to $\\ln2$.",
      "$N=4m$: difference $=\\frac12\\ln(4m)+\\ln2-\\frac12\\ln m=\\ln2+\\ln2$.",
      "Cross-check by summing the groups directly: sum $=2\\ln2$."
    ],
    "trap": "Thinking rearrangement doesn't change the sum and answering $\\ln2$; or inverting the ratio ($\\frac14$) and getting $\\ln2-\\ln2=0$.",
    "check": "Formula $\\ln2+\\frac12\\ln\\frac pq$ with $p=4,q=1$."
  },
  "refine-series-015": {
    "spot": "Two positives, one negative, with terms $\\frac{1}{\\sqrt n}$ — each group is about $\\frac{2}{2\\sqrt m}-\\frac{1}{\\sqrt{2m}}=\\frac{1-1/\\sqrt2}{\\sqrt m}$, the same order as $\\frac{1}{\\sqrt m}$, and $\\sum\\frac{1}{\\sqrt m}$ diverges.",
    "why": "Positive terms are used twice as fast as negative ones, so each group carries an extra positive amount of size $\\frac{1}{\\sqrt m}$; for $\\frac1n$ that only shifts the sum by a $\\ln$, but for $\\frac{1}{\\sqrt n}$ it accumulates to infinity.",
    "steps": [
      "Group $m$: $\\frac{1}{\\sqrt{4m-3}}+\\frac{1}{\\sqrt{4m-1}}-\\frac{1}{\\sqrt{2m}}$. Multiplied by $\\sqrt m$ its limit is $1-\\frac{1}{\\sqrt2}>0$.",
      "Every group is positive (e.g. $m=1$ and $m=100$), so the Limit Comparison Test applies.",
      "$\\sum\\frac{1}{\\sqrt m}$ is a $p$-series with $p=\\frac12\\le1$, divergent: $\\int_1^M\\frac{dx}{\\sqrt x}=2\\sqrt M-2$ is unbounded.",
      "Limit comparison: the group sums diverge to $+\\infty$, so the rearranged series diverges."
    ],
    "trap": "Thinking the original series converges and rearranging only changes the order, so it still converges; a rearranged conditionally convergent series can diverge.",
    "check": "Compare two-positive-one-negative for $\\frac1n$: the group sums are only $O(m^{-2})$ and the series converges to $\\frac32\\ln2$; the difference is that the partial sums of $\\frac{1}{\\sqrt n}$ grow like $\\sqrt N$, not like $\\ln N$."
  },
  "cx-int-008": {
    "spot": "The numerator $x$ is half of $2x$, the derivative of the denominator $x^2+1$ — the $\\frac{f'}{f}$ pattern.",
    "why": "The logarithm finishes it in one line; don't reflexively write $\\arctan$ when you see $x^2+1$ (that's for a constant numerator).",
    "steps": [
      "$(x^2+1)'=2x$, so $\\frac{x}{x^2+1}=\\frac12\\cdot\\frac{2x}{x^2+1}$.",
      "Antiderivative $\\frac12\\ln(x^2+1)$.",
      "Plug in the limits: $\\frac12\\ln2$."
    ],
    "trap": "Forgetting the $\\frac12$ and answering $\\ln2$.",
    "check": "On $[0,1]$ the integrand lies between $0$ and $\\frac12$, so the answer $\\approx0.347$ is reasonable."
  },
  "fd-der-012": {
    "spot": "Derivative of a polynomial at a point: Power Rule term by term, then plug in $x=3$.",
    "why": "Find $f'(x)$ first and then plug in the value; that's the least error-prone way.",
    "steps": [
      "Differentiate term by term: $(x^2)'=2x$, $(4x)'=4$.",
      "$f'(x)=2x+4$.",
      "$f'(3)=6+4=10$."
    ],
    "trap": "Plugging into the original function to get $f(3)=21$.",
    "check": "Secant slope approximation: $\\frac{f(3.001)-f(3)}{0.001}\\approx10$."
  }
};
