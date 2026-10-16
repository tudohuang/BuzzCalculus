// Detail v2, English — batch 029. Translation of tools/content/detail/029.js (text only; claims live in the Chinese file).
module.exports = {
  "lec-05-q1b": {
    "spot": "As $x\\to\\infty$ the numerator $\\ln x$ and the denominator $\\sqrt x$ both go to infinity — a $\\frac{\\infty}{\\infty}$ form; and it's a log against a power, so the question is which grows faster.",
    "why": "One application of L'Hôpital's Rule turns $\\ln x$ into $\\frac{1}{x}$; the log disappears and what's left is a pure power whose limit you can read off.",
    "steps": [
      "Numerator and denominator both tend to $\\infty$, so use L'Hôpital's Rule: $(\\ln x)'=\\frac{1}{x}$, $(\\sqrt x)'=\\frac{1}{2\\sqrt x}$.",
      "Divide and simplify: $\\frac{1/x}{1/(2\\sqrt x)}=\\frac{2\\sqrt x}{x}=\\frac{2}{\\sqrt x}$.",
      "$\\frac{2}{\\sqrt x}$ is only $0.002$ at $x=10^6$ and keeps shrinking.",
      "So the limit is $0$."
    ],
    "trap": "Seeing that both numerator and denominator grow and saying the limit is $1$ or $\\infty$. A log grows slower than any positive power, so the ratio must go to $0$.",
    "check": "Try a big number: at $x=10^6$, $\\frac{\\ln x}{\\sqrt x}\\approx\\frac{13.8}{1000}$, already close to $0$."
  },
  "lec-06-q3c": {
    "spot": "The integrand contains both $\\ln x$ and $\\frac{1}{x}$, and $\\frac{1}{x}$ is exactly the derivative of $\\ln x$: the classic $u=\\ln x$ substitution.",
    "why": "After substitution it becomes $\\int u^2\\,du$; forcing integration by parts is the long way around.",
    "steps": [
      "Let $u=\\ln x$, $du=\\frac{1}{x}\\,dx$.",
      "Change the limits too: $x=1\\Rightarrow u=0$, $x=e\\Rightarrow u=1$.",
      "The integral becomes $\\int_0^1 u^2\\,du=\\frac{1}{3}$.",
      "So the original integral $=\\frac{1}{3}$."
    ],
    "trap": "Changing the variable but not the limits, computing $\\int_1^e u^2\\,du=\\frac{e^3-1}{3}$.",
    "check": "The antiderivative $\\frac{(\\ln x)^3}{3}$ differentiates back to the integrand; plugging in the endpoints gives $\\frac{1}{3}-0$."
  },
  "lec-07-q3b": {
    "spot": "$\\tan^2x$ comes paired with $\\sec^2x$ — the derivative of $\\tan x$ — so $u=\\tan x$ turns everything into a polynomial.",
    "why": "The substitution does it in one step; rewriting $\\tan^2x$ as $\\sec^2x-1$ instead gives $\\sec^4x$, which is harder to integrate.",
    "steps": [
      "Let $u=\\tan x$, $du=\\sec^2x\\,dx$.",
      "Limits: $x=0\\Rightarrow u=0$, $x=\\frac{\\pi}{4}\\Rightarrow u=1$.",
      "$\\int_0^1 u^2\\,du=\\frac{1}{3}$.",
      "So the original integral $=\\frac{1}{3}$."
    ],
    "trap": "Not changing the upper limit and computing $\\int_0^{\\pi/4}u^2\\,du=\\frac{\\pi^3}{192}$.",
    "check": "The antiderivative $\\frac{\\tan^3x}{3}$ differentiates back correctly."
  },
  "lec-11-m3": {
    "spot": "Inside the $n$th root is $5n$: split it as $\\sqrt[n]{5}\\cdot\\sqrt[n]{n}$, both standard limits that tend to $1$.",
    "why": "Taking logs gives $\\frac{\\ln(5n)}{n}$; a log divided by $n$ goes to $0$, and exponentiating back gives $e^0=1$.",
    "steps": [
      "Take logs: $\\ln\\sqrt[n]{5n}=\\frac{\\ln 5+\\ln n}{n}$.",
      "$\\frac{\\ln 5}{n}\\to 0$, and $\\frac{\\ln n}{n}\\to 0$ (log is slower than $n$); at $n=10^6$ the whole thing is only about $1.5\\times 10^{-5}$.",
      "So $\\sqrt[n]{5n}=e^{\\ln(5n)/n}\\to e^0$.",
      "Limit $=e^0=1$."
    ],
    "trap": "Thinking that since $5n\\to\\infty$ inside, the answer is $\\infty$; this forgets it's an $n$th root, and the exponent $\\frac{1}{n}$ pushes it back to $1$.",
    "check": "At $n=1000$, $\\sqrt[n]{5n}\\approx 1.0085$, already close to $1$."
  },
  "lim-009": {
    "spot": "The linear terms of $\\sin x-x$ cancel and the denominator is $x^3$: expanding the Taylor series to the cubic term reveals the answer.",
    "why": "L'Hôpital's Rule would need three rounds; the Taylor expansion $\\sin x=x-\\frac{x^3}{6}+\\cdots$ gives the coefficient in one line.",
    "steps": [
      "$\\sin x=x-\\frac{x^3}{6}+\\frac{x^5}{120}-\\cdots$.",
      "Numerator $\\sin x-x=-\\frac{x^3}{6}+\\frac{x^5}{120}-\\cdots$.",
      "Divide by $x^3$; as $x\\to 0$ only $-\\frac{1}{6}$ is left."
    ],
    "trap": "Plugging in $\\sin x\\approx x$ to get $\\frac{0}{x^3}=0$ — the first-order approximation is too crude and cancels exactly the term you need.",
    "check": "Plug in $x=0.01$: the ratio is about $-0.16667$."
  },
  "lim-020": {
    "spot": "The linear terms of $\\arctan x-x$ cancel and the denominator is $x^3$: you need the $x^3$ coefficient of the Taylor series of $\\arctan x$.",
    "why": "Reading the coefficient from $\\arctan x=\\int_0^x\\frac{dt}{1+t^2}=x-\\frac{x^3}{3}+\\cdots$ is faster than three rounds of L'Hôpital's Rule.",
    "steps": [
      "$\\frac{1}{1+t^2}=1-t^2+t^4-\\cdots$; integrating term by term gives $\\arctan x=x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\cdots$.",
      "Numerator $\\arctan x-x=-\\frac{x^3}{3}+\\cdots$.",
      "Divide by $x^3$ and take the limit: $-\\frac{1}{3}$."
    ],
    "trap": "Remembering the expansion of $\\arctan x$ like that of $\\sin x$, with $-\\frac{x^3}{6}$, and answering $-\\frac{1}{6}$. The coefficients of $\\arctan$ are $\\frac{(-1)^k}{2k+1}$ — no factorials.",
    "check": "Plug in $x=0.01$: the ratio is about $-0.3333$."
  },
  "refine-derivatives-008": {
    "spot": "The Wronskian $W(f,g)=fg'-f'g$; $\\cosh$ and $\\sinh$ are each other's derivatives, so plugging in gives $\\cosh^2x-\\sinh^2x$.",
    "why": "Apply the definition directly; the last step uses the hyperbolic identity $\\cosh^2x-\\sinh^2x=1$, no need to expand exponentials.",
    "steps": [
      "$(\\cosh x)'=\\sinh x$, $(\\sinh x)'=\\cosh x$.",
      "$W=\\cosh x\\cdot\\cosh x-\\sinh x\\cdot\\sinh x=\\cosh^2x-\\sinh^2x$.",
      "The hyperbolic identity gives $W=1$, independent of $x$."
    ],
    "trap": "Writing the order backwards as $f'g-fg'$ and getting $-1$.",
    "check": "$W\\ne 0$, so $\\cosh x$ and $\\sinh x$ are linearly independent — they are exactly the two fundamental solutions of $y''=y$."
  },
  "refine-derivatives-010": {
    "spot": "To solve $x^3=10$, first write it as $f(x)=x^3-10=0$; Newton's method is one application of $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$.",
    "why": "Only one step is asked, so plugging into the formula is most direct; note $f$ is $x^3-10$, not $x^3$.",
    "steps": [
      "$f(x)=x^3-10$, $f'(x)=3x^2$.",
      "At $x_0=2$: $f(2)=-2$, $f'(2)=12$.",
      "$x_1=2-\\frac{-2}{12}=2+\\frac{1}{6}=\\frac{13}{6}$."
    ],
    "trap": "Flipping the sign to $x_0+\\frac{f}{f'}$ and getting $\\frac{11}{6}$ — a step in the wrong direction.",
    "check": "$\\sqrt[3]{10}\\approx 2.154$, and $\\frac{13}{6}\\approx 2.167$ — very close after one step."
  },
  "refine-integrals-003": {
    "spot": "You're given a formula for $\\int_0^x f(t)\\,dt$ and want $f$: Fundamental Theorem of Calculus — differentiate both sides in $x$.",
    "why": "$\\frac{d}{dx}\\int_0^x f(t)\\,dt=f(x)$, so $f$ is just the derivative of $x^2\\sin x$; no need to guess what $f$ looks like.",
    "steps": [
      "Differentiate both sides in $x$: $f(x)=(x^2\\sin x)'$.",
      "Product Rule: $f(x)=2x\\sin x+x^2\\cos x$.",
      "Plug in $x=\\frac{\\pi}{2}$: $\\sin=1$, $\\cos=0$, giving $f=2\\cdot\\frac{\\pi}{2}=\\pi$."
    ],
    "trap": "Plugging $\\frac{\\pi}{2}$ straight into $x^2\\sin x$ and getting $\\frac{\\pi^2}{4}$ — that's the value of the integral, not $f$.",
    "check": "Integrate the computed $f$ back: $\\int_0^{\\pi/2}f(t)\\,dt=\\frac{\\pi^2}{4}$, exactly the value of $x^2\\sin x$ at $\\frac{\\pi}{2}$."
  },
  "refine-series-059": {
    "spot": "$f(x)=x$ is odd, so there are only sine terms; $b_n=\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}x\\sin(nx)\\,dx$, and one integration by parts gives the general formula.",
    "why": "Computing the general formula $b_n=\\frac{2(-1)^{n+1}}{n}$ and then plugging in $n=3$ is no more work than computing $b_3$ alone, and lets you check against $b_1$.",
    "steps": [
      "The integrand $x\\sin(nx)$ is even: $b_n=\\frac{2}{\\pi}\\int_0^{\\pi}x\\sin(nx)\\,dx$.",
      "Integration by parts: $\\int_0^{\\pi}x\\sin(nx)\\,dx=\\left[-\\frac{x\\cos(nx)}{n}\\right]_0^{\\pi}+\\frac{1}{n}\\int_0^{\\pi}\\cos(nx)\\,dx=\\frac{\\pi(-1)^{n+1}}{n}$.",
      "So $b_n=\\frac{2(-1)^{n+1}}{n}$.",
      "$n=3$: $b_3=\\frac{2}{3}$."
    ],
    "trap": "Forgetting the alternating sign $(-1)^{n+1}$, or writing the leading $\\frac{1}{\\pi}$ as $\\frac{1}{2\\pi}$ and getting $\\frac{1}{3}$.",
    "check": "$b_n$ alternates in sign with size like $\\frac{1}{n}$: $b_1=2$, $b_2=-1$, $b_3=\\frac{2}{3}$."
  },
  "tb-lin-001": {
    "spot": "$25.2$ sits right next to the perfect square $25$: use the tangent-line approximation of $\\sqrt x$ at $a=25$.",
    "why": "$L(x)=f(a)+f'(a)(x-a)$, and both $\\sqrt{25}$ and $f'(25)$ are clean numbers.",
    "steps": [
      "$f(x)=\\sqrt x$, $f(25)=5$.",
      "$f'(x)=\\frac{1}{2\\sqrt x}$, $f'(25)=\\frac{1}{10}$.",
      "$\\sqrt{25.2}\\approx 5+\\frac{1}{10}\\cdot 0.2=5.02$."
    ],
    "trap": "Using $25.2$ instead of $0.2$ as $\\Delta x$, or forgetting the $\\frac{1}{2}$ in the derivative and getting $5.04$.",
    "check": "The true value is $\\sqrt{25.2}\\approx 5.01996$; $\\sqrt x$ bends downward, so the tangent line slightly overestimates — as expected."
  },
  "tmpl-int-linear-power-003": {
    "spot": "Inside the parentheses is the linear expression $5x+2$, cubed: a power of a linear expression — use the power rule and divide by the inner coefficient $5$.",
    "why": "Just let $u=5x+2$, $du=5\\,dx$; expanding into a quartic is slow and error-prone.",
    "steps": [
      "Let $u=5x+2$, $du=5\\,dx$, so $dx=\\frac{du}{5}$.",
      "$\\int u^3\\,\\frac{du}{5}=\\frac{u^4}{20}+C$.",
      "Back to $x$: $\\frac{(5x+2)^4}{20}+C$."
    ],
    "trap": "Forgetting to divide by the inner coefficient $5$ and writing $\\frac{(5x+2)^4}{4}$, which differentiates back $5$ times too large.",
    "check": "Differentiate back: $\\frac{4(5x+2)^3\\cdot 5}{20}=(5x+2)^3$."
  },
  "tmpl-int-linear-power-005": {
    "spot": "The integrand is the seventh power of the linear expression $2x+5$: raise the power by one, then divide by the inner coefficient $2$.",
    "why": "The substitution $u=2x+5$ does it in one step; a binomial expansion with eight terms isn't worth it.",
    "steps": [
      "Let $u=2x+5$, $du=2\\,dx$.",
      "$\\int u^7\\,\\frac{du}{2}=\\frac{u^8}{16}+C$.",
      "Back to $x$: $\\frac{(2x+5)^8}{16}+C$."
    ],
    "trap": "Writing just $\\frac{(2x+5)^8}{8}$, forgetting to divide by $2$; it differentiates back to $2(2x+5)^7$.",
    "check": "Differentiate back: $\\frac{8(2x+5)^7\\cdot 2}{16}=(2x+5)^7$."
  },
  "uni-der-017": {
    "spot": "Three nested $\\ln$s: the Chain Rule peels the onion three layers deep, multiplying by $\\frac{1}{\\text{inside}}$ at each layer.",
    "why": "Every layer is a $\\ln$, whose derivative is a reciprocal; just multiply them — no simplification tricks needed.",
    "steps": [
      "Outer layer: $\\frac{d}{dx}\\ln(\\ln(\\ln x))=\\frac{1}{\\ln(\\ln x)}\\cdot(\\ln(\\ln x))'$.",
      "Middle layer: $(\\ln(\\ln x))'=\\frac{1}{\\ln x}\\cdot\\frac{1}{x}$.",
      "Multiply: $\\frac{1}{x\\ln x\\,\\ln(\\ln x)}$ (domain $x>e$).",
      "So the answer is $\\frac{1}{x\\ln x\\,\\ln(\\ln x)}$."
    ],
    "trap": "Peeling only the outer layer and writing $\\frac{1}{\\ln(\\ln x)}$; or forgetting the innermost factor $\\frac{1}{x}$.",
    "check": "For $x>e$ all three factors are positive, so the derivative is positive: $\\ln(\\ln(\\ln x))$ is indeed increasing."
  },
  "cl-der-032": {
    "spot": "$\\sqrt{x^2+4x}$ behaves like $x$ as $x\\to+\\infty$, and the intercept $b=\\lim(\\sqrt{x^2+4x}-x)$ is an $\\infty-\\infty$ form: rationalize.",
    "why": "Multiplying by the conjugate $\\sqrt{x^2+4x}+x$ turns the difference of roots into $\\frac{4x}{\\cdots}$; dividing top and bottom by $x$ finishes it.",
    "steps": [
      "Slope: $\\frac{\\sqrt{x^2+4x}}{x}=\\sqrt{1+\\frac{4}{x}}\\to 1$.",
      "Intercept $b=\\lim(\\sqrt{x^2+4x}-x)$; multiply by the conjugate: $=\\lim\\frac{4x}{\\sqrt{x^2+4x}+x}$.",
      "Divide by $x$: $\\frac{4}{\\sqrt{1+4/x}+1}\\to\\frac{4}{2}=2$."
    ],
    "trap": "Thinking $\\sqrt{x^2+4x}\\approx x$ and saying $b=0$; or writing $\\sqrt{x^2+4x}\\approx x+4$ and getting $b=4$. The right approximation is $x+2$ (complete the square: $(x+2)^2-4$).",
    "check": "Completing the square: $x^2+4x=(x+2)^2-4$, so the root is about $x+2$."
  },
  "cl-lim-003": {
    "spot": "In $\\sin 2x-2\\sin x$ the linear terms $2x-2x$ cancel, and we want the $x^3$ coefficient: expand both $\\sin$s to the cubic term.",
    "why": "Taylor expansion reads off the $x^3$ coefficient directly; alternatively $\\sin 2x=2\\sin x\\cos x$ turns it into $2\\sin x(\\cos x-1)$, just as fast.",
    "steps": [
      "$\\sin 2x=2x-\\frac{(2x)^3}{6}+\\cdots=2x-\\frac{4}{3}x^3+\\cdots$.",
      "$2\\sin x=2x-\\frac{x^3}{3}+\\cdots$.",
      "Subtract: $-\\frac{4}{3}x^3+\\frac{1}{3}x^3=-x^3$.",
      "So $c=-1$."
    ],
    "trap": "Writing the cubic term of $\\sin 2x$ as just $-\\frac{2x^3}{6}$ (forgetting $2^3$), which gives $c=0$.",
    "check": "Another route: $2\\sin x(\\cos x-1)\\approx 2x\\cdot\\left(-\\frac{x^2}{2}\\right)=-x^3$."
  },
  "cl-ser-009": {
    "spot": "A series of the form $n^2r^n$ (with $r=\\frac{1}{4}$): start from the geometric series $\\sum r^n$ and differentiate-then-multiply-by-$r$ twice.",
    "why": "Each application of $r\\frac{d}{dr}$ brings out one more $n$; two of them give $\\sum n^2r^n=\\frac{r(1+r)}{(1-r)^3}$, then just plug in.",
    "steps": [
      "$\\sum_{n\\ge1} r^n=\\frac{r}{1-r}$; differentiate and multiply by $r$: $\\sum n r^n=\\frac{r}{(1-r)^2}$.",
      "Once more: $\\sum n^2r^n=r\\left(\\frac{r}{(1-r)^2}\\right)'=\\frac{r(1+r)}{(1-r)^3}$.",
      "Plug in $r=\\frac{1}{4}$: $\\frac{\\frac{1}{4}\\cdot\\frac{5}{4}}{\\frac{27}{64}}=\\frac{20}{27}$.",
      "So the sum is $\\frac{20}{27}$."
    ],
    "trap": "Stopping after one differentiation and answering $\\frac{r}{(1-r)^2}=\\frac{4}{9}$ — that's $\\sum\\frac{n}{4^n}$.",
    "check": "The first three terms $\\frac{1}{4}+\\frac{4}{16}+\\frac{9}{64}\\approx 0.64$; the tail bringing it to $0.74$ is reasonable."
  },
  "db-imp-002": {
    "spot": "Solving $x^2-xy+y^2=7$ for $y$ is a hassle and we only need the slope at one point: implicit differentiation, or $\\frac{dy}{dx}=-\\frac{F_x}{F_y}$.",
    "why": "$-\\frac{F_x}{F_y}$ is implicit differentiation packaged as a formula — just plug in the point; the Product Rule for the middle $-xy$ is already built into the partial derivatives.",
    "steps": [
      "Let $F=x^2-xy+y^2$; $F_x=2x-y$.",
      "$F_y=-x+2y$.",
      "At $(2,3)$: $F_x=1$, $F_y=4$.",
      "$\\frac{dy}{dx}=-\\frac{1}{4}$."
    ],
    "trap": "Differentiating $-xy$ as just $-y$, dropping $-xy'$, and getting $y'=\\frac{-(2x-y)}{2y}=-\\frac{1}{6}$.",
    "check": "The point $(2,3)$ is indeed on the curve: $4-6+9=7$."
  },
  "dd-new-002": {
    "spot": "Newton's method on $f(x)=x^2-2$ is approximating $\\sqrt 2$: the iteration simplifies to $x_{n+1}=\\frac{x_n}{2}+\\frac{1}{x_n}$.",
    "why": "Simplify the iteration first; then both steps involve clean fractions.",
    "steps": [
      "$x_{n+1}=x_n-\\frac{x_n^2-2}{2x_n}=\\frac{x_n}{2}+\\frac{1}{x_n}$.",
      "$x_1=\\frac{1}{2}+1=\\frac{3}{2}$.",
      "$x_2=\\frac{3}{4}+\\frac{2}{3}=\\frac{17}{12}$."
    ],
    "trap": "Iterating only once and handing in $\\frac{3}{2}$; the problem asks for $x_2$.",
    "check": "$\\frac{17}{12}\\approx 1.4167$, within $0.003$ of $\\sqrt2\\approx1.4142$."
  },
  "depth-der-007": {
    "spot": "The folium of Descartes $x^3+y^3=6xy$ can't be solved for $y$: implicit differentiation; the point $(3,3)$ lies on the symmetry axis $y=x$.",
    "why": "Use $-\\frac{F_x}{F_y}$ and plug in the point; at a point symmetric in $x,y$, $F_x=F_y$, so the slope must be $-1$.",
    "steps": [
      "Let $F=x^3+y^3-6xy$; $F_x=3x^2-6y$.",
      "$F_y=3y^2-6x$.",
      "At $(3,3)$: $F_x=27-18=9$, $F_y=9$.",
      "$\\frac{dy}{dx}=-\\frac{9}{9}=-1$."
    ],
    "trap": "Forgetting that $6xy$ needs the Product Rule and writing only $6y$ or only $6xy'$, which gives the wrong slope.",
    "check": "The point is on the curve: $27+27=54=6\\cdot 9$."
  },
  "depth-int-005": {
    "spot": "$x\\cdot e^x\\sin x$: a polynomial times the cycling $e^x\\sin x$. Have $\\int e^x\\sin x$ and $\\int e^x\\cos x$ ready, then integrate by parts on $x$.",
    "why": "Taking $u=x$ reduces the polynomial to a constant, and the leftover $e^x\\sin x$, $e^x\\cos x$ have ready-made antiderivatives; taking $u=e^x\\sin x$ instead makes things longer and longer.",
    "steps": [
      "Ready-made formulas: $\\int e^x\\sin x\\,dx=\\frac{e^x(\\sin x-\\cos x)}{2}$, $\\int e^x\\cos x\\,dx=\\frac{e^x(\\sin x+\\cos x)}{2}$.",
      "Integrate by parts with $u=x$, $dv=e^x\\sin x\\,dx$: $=\\frac{xe^x(\\sin x-\\cos x)}{2}-\\frac{1}{2}\\int e^x(\\sin x-\\cos x)\\,dx$.",
      "$\\int e^x(\\sin x-\\cos x)\\,dx=\\frac{e^x(\\sin x-\\cos x)}{2}-\\frac{e^x(\\sin x+\\cos x)}{2}=-e^x\\cos x$.",
      "Together: $\\frac{e^x\\left(x(\\sin x-\\cos x)+\\cos x\\right)}{2}+C$."
    ],
    "trap": "Dropping the minus sign on the second term and getting $\\frac{e^x(x(\\sin x-\\cos x)-\\cos x)}{2}$, which differentiates back with extra junk like $-e^x\\cos x$.",
    "check": "Differentiating the answer gives exactly $xe^x\\sin x$."
  },
  "depth-int-018": {
    "spot": "Denominator $(1+x^2)^2$, numerator $x^3=x^2\\cdot x$: keep one $x$ with $dx$, let $u=1+x^2$, and rewrite $x^2$ as $u-1$.",
    "why": "After substitution it becomes $\\frac{u-1}{u^2}=\\frac{1}{u}-\\frac{1}{u^2}$, and both pieces integrate directly; the trigonometric substitution $x=\\tan\\theta$ also works but is longer.",
    "steps": [
      "Let $u=1+x^2$, $du=2x\\,dx$, $x^2=u-1$; the limits $0\\to 1$ become $1\\to 2$.",
      "$\\frac{u-1}{u^2}=\\frac{1}{u}-\\frac{1}{u^2}$, with antiderivative $\\ln u+\\frac{1}{u}$.",
      "$\\frac{1}{2}\\left[\\ln u+\\frac{1}{u}\\right]_1^2=\\frac{1}{2}\\left(\\ln 2+\\frac{1}{2}-1\\right)$.",
      "The answer is $\\frac{\\ln 2}{2}-\\frac{1}{4}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ that comes from $dx=\\frac{du}{2x}$ and getting $\\ln 2-\\frac{1}{2}$.",
    "check": "The answer is about $0.0966$: the integrand is at most $\\frac{1}{4}$ on $[0,1]$ and very small near $0$, so this is reasonable."
  },
  "der-066": {
    "spot": "The Wronskian $W(f,g)=fg'-f'g$; $f=x^2$ and $g=x^3$ are both monomials, so plugging in lets the terms combine.",
    "why": "Just apply the definition of the $2\\times2$ determinant; there's no faster route.",
    "steps": [
      "$f=x^2$, $f'=2x$; $g=x^3$, $g'=3x^2$.",
      "$W=x^2\\cdot 3x^2-2x\\cdot x^3=3x^4-2x^4$.",
      "$W=x^4$."
    ],
    "trap": "Writing the determinant in the wrong order, $f'g-fg'$, and getting $-x^4$.",
    "check": "$W$ is not identically zero, so $x^2$ and $x^3$ are linearly independent — neither is a constant multiple of the other."
  },
  "exam-der-012": {
    "spot": "We want $\\frac{y'}{y}$ — which is exactly $(\\ln y)'$. Taking logs of $y=x^2e^x$ turns it into a sum: $2\\ln x+x$.",
    "why": "Logarithmic differentiation gives $\\frac{y'}{y}$ directly, without computing $y'$ first and dividing back.",
    "steps": [
      "$\\ln y=2\\ln x+x$.",
      "Differentiate both sides: $\\frac{y'}{y}=\\frac{2}{x}+1$.",
      "So $\\frac{y'}{y}=\\frac{2}{x}+1$."
    ],
    "trap": "Computing $y'=2xe^x+x^2e^x$ and stopping there, forgetting to divide by $y$.",
    "check": "Divide directly: $\\frac{2xe^x+x^2e^x}{x^2e^x}=\\frac{2}{x}+1$."
  },
  "exam-der-016": {
    "spot": "We want $(f^{-1})'(1)$, and the problem already tells you $f(0)=1$: the inverse function derivative is $\\frac{1}{f'(0)}$.",
    "why": "The inverse of $x+e^x$ can't be written down, but $(f^{-1})'(b)=\\frac{1}{f'(a)}$ only needs $f'(a)$.",
    "steps": [
      "$f(0)=0+1=1$, so $a=0$.",
      "$f'(x)=1+e^x$, $f'(0)=2$.",
      "$(f^{-1})'(1)=\\frac{1}{2}$."
    ],
    "trap": "Plugging in the wrong point: $\\frac{1}{f'(1)}=\\frac{1}{1+e}$. You need the point that gets sent to $1$, namely $0$.",
    "check": "$f'=1+e^x>0$, so $f$ is strictly increasing and its inverse exists and is differentiable."
  },
  "exam-lim-010": {
    "spot": "In $\\arctan(2x)-2x$ the linear terms cancel and the denominator is $x^3$: use $\\arctan u=u-\\frac{u^3}{3}$ with $u=2x$.",
    "why": "Taylor expansion reads off the $x^3$ coefficient directly; three rounds of L'Hôpital's Rule produce very messy fractions.",
    "steps": [
      "$\\arctan u=u-\\frac{u^3}{3}+\\cdots$.",
      "$u=2x$: $\\arctan(2x)-2x=-\\frac{8x^3}{3}+\\cdots$.",
      "Divide by $x^3$: the limit is $-\\frac{8}{3}$."
    ],
    "trap": "Forgetting that $u^3=8x^3$ when substituting $u=2x$, writing just $2x^3$, and getting $-\\frac{2}{3}$.",
    "check": "Plug in $x=0.01$: the ratio is about $-2.666$."
  },
  "exam-ser-002": {
    "spot": "The coefficient $\\frac{n!}{n^n}$ has a factorial: use the Ratio Test; the factorials in $\\frac{a_{n+1}}{a_n}$ cancel, leaving $\\left(\\frac{n}{n+1}\\right)^n$.",
    "why": "The Root Test would have to handle $\\sqrt[n]{n!}$ (needing Stirling); the Ratio Test is much cleaner.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)!}{(n+1)^{n+1}}\\cdot\\frac{n^n}{n!}=\\frac{n^n}{(n+1)^n}=\\left(\\frac{n}{n+1}\\right)^n$.",
      "$\\left(\\frac{n}{n+1}\\right)^n=\\frac{1}{\\left(1+\\frac{1}{n}\\right)^n}\\to\\frac{1}{e}$.",
      "Radius of convergence $R=\\frac{1}{1/e}=e$."
    ],
    "trap": "Thinking $\\frac{n}{n+1}\\to 1$ so the whole ratio $\\to 1$ and $R=1$ — forgetting it's raised to the $n$th power.",
    "check": "At $n=1000$ the ratio is about $0.3681$, very close to $\\frac{1}{e}\\approx0.3679$."
  },
  "exam-ser-010": {
    "spot": "$\\sin(x^2)$: take the expansion of $\\sin u$ and replace $u$ with $x^2$; $x^6$ comes from the $u^3$ term.",
    "why": "Substitute directly into the expansion; computing the sixth derivative $\\frac{f^{(6)}(0)}{6!}$ by brute force is exhausting.",
    "steps": [
      "$\\sin u=u-\\frac{u^3}{6}+\\frac{u^5}{120}-\\cdots$.",
      "$u=x^2$: $\\sin(x^2)=x^2-\\frac{x^6}{6}+\\frac{x^{10}}{120}-\\cdots$.",
      "The $x^6$ coefficient is $-\\frac{1}{6}$."
    ],
    "trap": "Using the $x^6$ coefficient of $\\sin x$ (which is $0$) as the answer, or taking the next coefficient $\\frac{1}{120}$ of $\\sin u$ — $x^6$ corresponds to $u^3$, not $u^5$.",
    "check": "Only odd powers of $u$ appear, so $\\sin(x^2)$ has only the terms $x^2,x^6,x^{10},\\dots$."
  },
  "exam-ser-011": {
    "spot": "$\\ln(1+x)$ is a standard expansion you should know by heart: $x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\cdots$, alternating signs, and the denominator is the power.",
    "why": "Integrating $\\frac{1}{1+x}=1-x+x^2-x^3+\\cdots$ term by term gives it, faster than computing the fourth derivative.",
    "steps": [
      "$(\\ln(1+x))'=\\frac{1}{1+x}=1-x+x^2-x^3+\\cdots$.",
      "The $x^3$ term has coefficient $-1$, which integrates to $-\\frac{x^4}{4}$.",
      "Cross-check: the fourth derivative is $f^{(4)}(x)=-\\frac{6}{(1+x)^4}$, and $\\frac{f^{(4)}(0)}{4!}=-\\frac{6}{24}$.",
      "So the $x^4$ coefficient is $-\\frac{1}{4}$."
    ],
    "trap": "Getting the sign wrong and writing $+\\frac{1}{4}$ (even-power terms are negative), or putting a factorial in the denominator and writing $-\\frac{1}{24}$.",
    "check": "At $x=0.1$, $\\ln 1.1$ and the first four terms $0.1-0.005+0.000333-0.000025$ differ by less than $10^{-5}$."
  },
  "hc-der-003": {
    "spot": "$e^{\\text{stuff}}$: the outer $e^u$ is its own derivative; multiply by the derivative of the inner $u=e^{2x}+x^2$.",
    "why": "One Chain Rule finishes it; the inner $e^{2x}$ itself needs another Chain Rule to bring out the $2$.",
    "steps": [
      "Outer: $(e^u)'=e^u\\cdot u'$, with $u=e^{2x}+x^2$.",
      "Inner: $u'=2e^{2x}+2x$.",
      "Together: $e^{e^{2x}+x^2}\\,(2e^{2x}+2x)$."
    ],
    "trap": "Differentiating $e^{2x}$ as $e^{2x}$ (dropping the $2$), giving $e^{e^{2x}+x^2}(e^{2x}+2x)$.",
    "check": "Plug in $x=0$: $e^{1}\\cdot(2+0)=2e$."
  },
  "hc-der-004": {
    "spot": "A high-order derivative at $x=0$: $\\frac{f^{(5)}(0)}{5!}$ is the $x^5$ coefficient of the Maclaurin series, and the $x^5$ term of $x^4e^{3x}$ comes only from $x^4\\cdot 3x$.",
    "why": "Reading the coefficient takes one step; the Leibniz formula also works, but you have to confirm only one term is nonzero.",
    "steps": [
      "$e^{3x}=1+3x+\\frac{9x^2}{2}+\\cdots$, so $x^4e^{3x}=x^4+3x^5+\\cdots$.",
      "The $x^5$ coefficient $=\\frac{f^{(5)}(0)}{5!}=3$.",
      "Cross-check with Leibniz: only the term with $x^4$ differentiated four times and $e^{3x}$ once is nonzero at $0$: $\\binom{5}{4}\\cdot 4!\\cdot 3=5\\cdot 24\\cdot 3$.",
      "So $f^{(5)}(0)=360$."
    ],
    "trap": "Reading off the coefficient $3$ and stopping, forgetting to multiply by $5!$.",
    "check": "By the same reasoning $f^{(4)}(0)=4!\\cdot 1=24$: the coefficient of $x^4$ is $1$."
  },
  "hc-der-008": {
    "spot": "$y=e^{xy}$ can't be solved for $y$, and we only need high-order derivatives at $x=0$: set $y=1+ax+bx^2+cx^3+\\cdots$, substitute back and compare coefficients; $y'''(0)=6c$.",
    "why": "Implicit differentiation three times makes the expressions explode; comparing coefficients is just addition at each step.",
    "steps": [
      "$xy=x+ax^2+bx^3+\\cdots$, $e^{xy}=1+xy+\\frac{(xy)^2}{2}+\\frac{(xy)^3}{6}+\\cdots$.",
      "Expand to $x^3$: $1+x+\\left(a+\\frac{1}{2}\\right)x^2+\\left(b+a+\\frac{1}{6}\\right)x^3$.",
      "Compare coefficients: $a=1$, $b=a+\\frac{1}{2}=\\frac{3}{2}$, $c=b+a+\\frac{1}{6}=\\frac{8}{3}$.",
      "$y'''(0)=3!\\cdot c=6\\cdot\\frac{8}{3}=16$."
    ],
    "trap": "Keeping $(xy)^2$ only up to $x^2$ and dropping the cross term $2ax^3\\cdot\\frac{1}{2}$; then $c$ is missing an $a$ and you get $10$.",
    "check": "Substitute $p=1+x+\\frac{3}{2}x^2+\\frac{8}{3}x^3$ back: the error $p-e^{xp}$ starts only at $x^4$ (the ratio tends to the constant $-\\frac{125}{24}$)."
  },
  "hc-der-010": {
    "spot": "High-order derivatives of $e^x\\sin x$: each derivative multiplies by $\\sqrt2$ and advances the phase by $\\frac{\\pi}{4}$, so $f^{(n)}(0)=2^{n/2}\\sin\\frac{n\\pi}{4}$.",
    "why": "$e^x\\sin x$ is the imaginary part of $e^{(1+i)x}$, and $(1+i)=\\sqrt2\\,e^{i\\pi/4}$; brute-force Leibniz would need ten terms.",
    "steps": [
      "$(e^x\\sin x)'=e^x(\\sin x+\\cos x)=\\sqrt2\\,e^x\\sin\\left(x+\\frac{\\pi}{4}\\right)$.",
      "Repeat $n$ times: $f^{(n)}(x)=2^{n/2}e^x\\sin\\left(x+\\frac{n\\pi}{4}\\right)$; check $n=2$ first: $f''(0)=2\\sin\\frac{\\pi}{2}=2$.",
      "$n=9$: $f^{(9)}(0)=2^{9/2}\\sin\\frac{9\\pi}{4}=16\\sqrt2\\cdot\\frac{\\sqrt2}{2}=16$."
    ],
    "trap": "Taking the factor per derivative as $2$ instead of $\\sqrt2$ and getting $2^9\\cdot\\frac{\\sqrt2}{2}=256\\sqrt2$.",
    "check": "$(1+i)^8=16$, so $f^{(9)}(0)$ equals $16$ times $f'(0)=1$."
  },
  "hc-ibp-005": {
    "spot": "$x\\cdot(\\arctan x)^2$: differentiate away $(\\arctan x)^2$ as $u$; the key is choosing $v=\\frac{x^2+1}{2}$ instead of $\\frac{x^2}{2}$, so it cancels with $\\frac{1}{1+x^2}$.",
    "why": "With $v=\\frac{1+x^2}{2}$ (integration constant $\\frac{1}{2}$), the remaining integral is just $\\int\\arctan x\\,dx$, with no fraction to split.",
    "steps": [
      "$u=(\\arctan x)^2$, $du=\\frac{2\\arctan x}{1+x^2}dx$; $dv=x\\,dx$, take $v=\\frac{x^2+1}{2}$.",
      "By parts: $\\frac{(x^2+1)(\\arctan x)^2}{2}-\\int\\frac{x^2+1}{2}\\cdot\\frac{2\\arctan x}{1+x^2}dx=\\frac{(x^2+1)(\\arctan x)^2}{2}-\\int\\arctan x\\,dx$.",
      "$\\int\\arctan x\\,dx=x\\arctan x-\\frac{1}{2}\\ln(1+x^2)$.",
      "Answer: $\\frac{(x^2+1)(\\arctan x)^2}{2}-x\\arctan x+\\frac{1}{2}\\ln(1+x^2)+C$."
    ],
    "trap": "Taking $v=\\frac{x^2}{2}$ works too, but produces $\\int\\frac{x^2\\arctan x}{1+x^2}dx$, which must be split again into $\\arctan x-\\frac{\\arctan x}{1+x^2}$ — easy to lose a term.",
    "check": "Differentiating the answer gives back $x(\\arctan x)^2$."
  },
  "lb-lp-001": {
    "spot": "The $L^2$ norm is square, integrate, take the square root: $\\|f\\|_2=\\left(\\int_0^1 x^2\\,dx\\right)^{1/2}$.",
    "why": "Just follow the definition and compute one polynomial integral.",
    "steps": [
      "$\\int_0^1 |x|^2\\,dx=\\frac{1}{3}$.",
      "Take the root: $\\|f\\|_2=\\sqrt{\\frac{1}{3}}=\\frac{1}{\\sqrt3}$.",
      "About $0.577$."
    ],
    "trap": "Forgetting the square root and answering $\\frac{1}{3}$ — that's $\\|f\\|_2^2$.",
    "check": "$\\|f\\|_2$ lies between $\\|f\\|_1=\\frac{1}{2}$ and $\\|f\\|_\\infty=1$, which makes sense."
  },
  "lec-09-q2b": {
    "spot": "The region is above the $x$-axis with $0\\le x\\le 2$, but it's rotated about the $y$-axis: use cylindrical shells, so you don't have to solve $y=2x-x^2$ for $x$.",
    "why": "The shell method $V=\\int 2\\pi x\\,f(x)\\,dx$ integrates directly in $x$; the disk method needs solving a quadratic and splitting into left and right branches.",
    "steps": [
      "Extent of the region: $2x-x^2=0$ gives $x=0,2$.",
      "Shell method: $V=\\int_0^2 2\\pi x(2x-x^2)\\,dx$.",
      "$\\int_0^2(2x^2-x^3)\\,dx=\\frac{16}{3}-4=\\frac{4}{3}$.",
      "$V=2\\pi\\cdot\\frac{4}{3}=\\frac{8\\pi}{3}$."
    ],
    "trap": "Using the disk formula for rotation about the $x$-axis, $\\pi\\int_0^2(2x-x^2)^2dx=\\frac{16\\pi}{15}$ — wrong axis.",
    "check": "Disk method cross-check: $x=1\\pm\\sqrt{1-y}$, and $V=\\pi\\int_0^1\\left[(1+\\sqrt{1-y})^2-(1-\\sqrt{1-y})^2\\right]dy$ also gives $\\frac{8\\pi}{3}$."
  },
  "lim-017": {
    "spot": "$e^x-e^{-x}=2\\sinh x$; its linear term $2x$ is cancelled by $-2x$ and the denominator is $x^3$: Taylor expand to the cubic term.",
    "why": "$\\sinh x=x+\\frac{x^3}{6}+\\cdots$ takes one line; L'Hôpital's Rule would take three rounds.",
    "steps": [
      "$e^x=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\cdots$, $e^{-x}=1-x+\\frac{x^2}{2}-\\frac{x^3}{6}+\\cdots$.",
      "Subtract: the even terms cancel, $e^x-e^{-x}=2x+\\frac{x^3}{3}+\\cdots$.",
      "Subtract $2x$ and divide by $x^3$: $\\frac{1}{3}$."
    ],
    "trap": "Thinking the $x^3$ terms of $e^x$ and $e^{-x}$ cancel and answering $0$; actually it's $\\frac{1}{6}-\\left(-\\frac{1}{6}\\right)=\\frac{1}{3}$.",
    "check": "Plug in $x=0.01$: the ratio is about $0.33334$."
  },
  "lm-rs-002": {
    "spot": "Dividing the top and bottom of $\\sum\\frac{k}{n^2+k^2}$ by $n^2$ produces $\\frac{1}{n}\\sum f\\left(\\frac{k}{n}\\right)$: a Riemann sum.",
    "why": "The Riemann sum turns directly into a definite integral, so there's no sum to estimate; $f(x)=\\frac{x}{1+x^2}$ integrates with one substitution.",
    "steps": [
      "$\\frac{k}{n^2+k^2}=\\frac{1}{n}\\cdot\\frac{k/n}{1+(k/n)^2}$.",
      "As $n\\to\\infty$, the sum tends to $\\int_0^1\\frac{x}{1+x^2}\\,dx$.",
      "The antiderivative is $\\frac{1}{2}\\ln(1+x^2)$, giving $\\frac{\\ln 2}{2}$."
    ],
    "trap": "Seeing $n^2$ in the denominator, thinking each term is $\\le\\frac{n}{n^2}$ and the whole thing tends to $0$ — but there are $n$ terms, and together they're not small.",
    "check": "$\\frac{\\ln 2}{2}\\approx 0.347$, between the minimum $0$ and the maximum $\\frac{1}{2}$ of $f$."
  },
  "refine-derivatives-012": {
    "spot": "Second derivative of a composition: $h'=f'(g)g'$ is a product, so differentiating again needs the Product Rule plus the Chain Rule, giving $h''=f''(g)(g')^2+f'(g)g''$.",
    "why": "Once the formula is memorized, it's just plugging in numbers; you don't need to know $f$ or $g$ themselves.",
    "steps": [
      "$h'(x)=f'(g(x))\\,g'(x)$.",
      "Differentiate again: $h''=f''(g)\\,(g')^2+f'(g)\\,g''$ (test this formula on $\\sin(x^2)$).",
      "Plug in $x=1$: $h''(1)=f''(2)\\cdot 3^2+f'(2)\\cdot(-1)=-2\\cdot 9+5\\cdot(-1)$.",
      "$h''(1)=-23$."
    ],
    "trap": "Dropping the square on $(g')^2$ and writing $f''(g)g'$: $-2\\cdot 3-5=-11$.",
    "check": "Verify with concrete functions: $g=3x-1-\\frac{(x-1)^2}{2}$ and $f=5(u-2)-(u-2)^2$ satisfy all the given values, and $h''(1)$ is again $-23$."
  },
  "refine-derivatives-017": {
    "spot": "The curve has the form $y=f(x)$: curvature formula $\\kappa=\\frac{|y''|}{(1+y'^2)^{3/2}}$; for $y=\\ln\\cos x$, $y'=-\\tan x$ and $y''=-\\sec^2x$ are both clean.",
    "why": "$1+\\tan^2x=\\sec^2x$ makes the denominator $|\\sec^3x|$, and everything simplifies to $|\\cos x|$.",
    "steps": [
      "$y'=-\\tan x$.",
      "$y''=-\\sec^2x$; at $\\frac{\\pi}{4}$: $y'=-1$, $y''=-2$.",
      "$\\kappa=\\frac{2}{(1+1)^{3/2}}=\\frac{2}{2\\sqrt2}=\\frac{\\sqrt2}{2}$."
    ],
    "trap": "Forgetting the $\\frac{3}{2}$ power in the denominator and writing $\\frac{|y''|}{1+y'^2}=1$.",
    "check": "After simplifying, $\\kappa=|\\cos x|$, and at $\\frac{\\pi}{4}$ that's exactly $\\frac{\\sqrt2}{2}$."
  },
  "refine-derivatives-018": {
    "spot": "$x$ is an implicit function of the parameter $a$: differentiate both sides of $x^3+ax-2=0$ with respect to $a$, remembering $ax$ is a product.",
    "why": "Implicit differentiation gives $x'=-\\frac{F_a}{F_x}$; the cubic formula is far too messy, so there's no need to solve for $x(a)$.",
    "steps": [
      "Let $F(x,a)=x^3+ax-2$ (below, $y$ stands for $a$). Partial derivative $F_a=x$.",
      "$F_x=3x^2+a$.",
      "$x'(a)=-\\frac{F_a}{F_x}=-\\frac{x}{3x^2+a}$; plugging in $a=1$, $x=1$: $-\\frac{1}{4}$."
    ],
    "trap": "When differentiating in $a$, writing the derivative of $ax$ as just $x$, dropping $a\\,x'$, and getting $x'=-\\frac{1}{3}$.",
    "check": "$(x,a)=(1,1)$ does satisfy the equation: $1+1-2=0$."
  },
  "refine-integrals-017": {
    "spot": "Let $u=x+1$: the inside of the root becomes clean, the $x$ in the numerator becomes $u-1$, and $dx=du$.",
    "why": "The substitution turns $\\frac{x}{\\sqrt{x+1}}$ into $\\frac{u-1}{\\sqrt u}=u^{1/2}-u^{-1/2}$, which the power rule integrates.",
    "steps": [
      "$u=x+1$, $du=dx$; $x=0\\to u=1$, $x=3\\to u=4$.",
      "The numerator $x=u-1$, so $g(u)=\\frac{u-1}{\\sqrt u}$.",
      "The answer is $g(u)=\\frac{u-1}{\\sqrt u}$."
    ],
    "trap": "Changing only the root and not the numerator, writing $g(u)=\\frac{x}{\\sqrt u}$ — an expression can't contain both $x$ and $u$.",
    "check": "Both integrals equal $\\frac{8}{3}$."
  },
  "tb-curv-001": {
    "spot": "Radius of curvature $R=\\frac{1}{\\kappa}=\\frac{(1+y'^2)^{3/2}}{|y''|}$; for $y=x^2$ at $x=1$, $y'=2$ and $y''=2$.",
    "why": "Apply the formula directly: compute the curvature, then take the reciprocal.",
    "steps": [
      "$y'=2x$, so $y'=2$ at $x=1$; $y''=2$.",
      "$\\kappa=\\frac{2}{(1+4)^{3/2}}=\\frac{2}{5\\sqrt5}$.",
      "$R=\\frac{1}{\\kappa}=\\frac{5\\sqrt5}{2}$."
    ],
    "trap": "Handing in the curvature $\\frac{2}{5\\sqrt5}$ instead of its reciprocal.",
    "check": "$R\\approx 5.59$, much larger than the radius of curvature $\\frac{1}{2}$ at the vertex $x=0$ — the parabola flattens out as you move away."
  },
  "tb-imp-003": {
    "spot": "$x^2y+y^3=10$ can't be solved for $y$, and we want the slope at a point: $\\frac{dy}{dx}=-\\frac{F_x}{F_y}$.",
    "why": "Just plug in the point; the Product Rule for $x^2y$ is already handled inside the partial derivatives.",
    "steps": [
      "$F=x^2y+y^3$, $F_x=2xy$.",
      "$F_y=x^2+3y^2$.",
      "At $(1,2)$: $F_x=4$, $F_y=1+12=13$.",
      "$\\frac{dy}{dx}=-\\frac{4}{13}$."
    ],
    "trap": "Differentiating $x^2y$ as just $2xy$, dropping $x^2y'$; the denominator becomes $12$ and you get $-\\frac{1}{3}$.",
    "check": "The point is on the curve: $1\\cdot 2+8=10$."
  },
  "uni-lim-005": {
    "spot": "$\\sqrt{1+x}-\\sqrt{1-x}$ is a mirror pair: even terms cancel, odd terms double. After subtracting $x$ the cubic term is left, so use the binomial expansion to $x^3$.",
    "why": "The coefficient $\\binom{1/2}{3}=\\frac{1}{16}$ of $(1+x)^{1/2}$ can be read off directly; rationalizing only handles the linear term and is powerless against the cubic one.",
    "steps": [
      "$\\sqrt{1+x}=1+\\frac{x}{2}-\\frac{x^2}{8}+\\frac{x^3}{16}-\\cdots$.",
      "$\\sqrt{1-x}$ replaces $x$ with $-x$; subtracting: $\\sqrt{1+x}-\\sqrt{1-x}=x+\\frac{x^3}{8}+\\cdots$.",
      "Subtract $x$ and divide by $x^3$: the limit is $\\frac{1}{8}$."
    ],
    "trap": "Thinking $\\sqrt{1+x}-\\sqrt{1-x}\\approx x$ cancels completely and answering $0$; the denominator is $x^3$, so the cubic term is the answer.",
    "check": "Plug in $x=0.01$: the ratio is about $0.125$."
  },
  "uni-lim-008": {
    "spot": "$(1+3x)^{1/x}\\to e^3$, and the question is how fast it approaches $e^3$: write it as $e^{\\ln(1+3x)/x}$ and expand the exponent to the linear term.",
    "why": "The exponent $\\frac{\\ln(1+3x)}{x}=3-\\frac{9x}{2}+\\cdots$, then use $e^{3+h}\\approx e^3(1+h)$; direct L'Hôpital's Rule would mean differentiating $(1+3x)^{1/x}$, which is messy.",
    "steps": [
      "$\\ln(1+3x)=3x-\\frac{9x^2}{2}+\\cdots$, so $\\frac{\\ln(1+3x)}{x}=3-\\frac{9x}{2}+\\cdots$.",
      "$(1+3x)^{1/x}=e^3\\cdot e^{-\\frac{9x}{2}+\\cdots}=e^3\\left(1-\\frac{9x}{2}+\\cdots\\right)$.",
      "Subtract $e^3$ and divide by $x$: $-\\frac{9e^3}{2}$."
    ],
    "trap": "Thinking $(1+3x)^{1/x}$ simply equals $e^3$, so the numerator is $0$ and the answer is $0$. It only approaches $e^3$, and the gap is of the same order as $x$.",
    "check": "The answer is about $-90.4$; plugging in $x=0.001$ gives a ratio of about $-90.2$ — right sign and size."
  },
  "ap-opt-002": {
    "spot": "Row to the point $x$ downstream on the far bank, then walk the remaining $8-x$: total time $T(x)=\\frac{\\sqrt{9+x^2}}{3}+\\frac{8-x}{5}$; minimize it.",
    "why": "Once it's a one-variable function, solving $T'(x)=0$ gives the answer; the diagonal comes from the Pythagorean theorem.",
    "steps": [
      "Rowing distance $\\sqrt{3^2+x^2}$ at speed $3$; walking $8-x$ at speed $5$.",
      "$T'(x)=\\frac{x}{3\\sqrt{9+x^2}}-\\frac{1}{5}$.",
      "$T'=0$: $5x=3\\sqrt{9+x^2}$; squaring gives $16x^2=81$, so $x=\\frac{9}{4}$.",
      "So land $\\frac{9}{4}$ km downstream."
    ],
    "trap": "Swapping the speeds (rowing at $5$, walking at $3$) gives something like $x=4$; rowing is slower, so you should row less.",
    "check": "$T\\left(\\frac{9}{4}\\right)=2.4$ hours, faster than rowing straight across and walking ($2.6$) or rowing all the way to the destination (about $2.85$)."
  },
  "burst-boss-int-009": {
    "spot": "$\\ln(1-x)$ has a ready-made power series $-\\sum\\frac{x^n}{n}$, and $\\int_0^1 x^n\\ln x\\,dx=-\\frac{1}{(n+1)^2}$ is a known formula: expand, integrate term by term, and get a numerical series that splits apart.",
    "why": "Direct integration by parts gets stuck on $\\ln 0$ at the endpoints; with the series every term is clean, and in the end only $\\zeta(2)=\\frac{\\pi^2}{6}$ remains.",
    "steps": [
      "$\\ln(1-x)=-\\sum_{n\\ge1}\\frac{x^n}{n}$, so $\\int_0^1\\ln x\\ln(1-x)\\,dx=-\\sum\\frac{1}{n}\\int_0^1 x^n\\ln x\\,dx$.",
      "$\\int_0^1 x^n\\ln x\\,dx=-\\frac{1}{(n+1)^2}$ (e.g. $n=3$).",
      "The integral $=\\sum_{n\\ge1}\\frac{1}{n(n+1)^2}$; partial fractions: $\\frac{1}{n(n+1)^2}=\\frac{1}{n}-\\frac{1}{n+1}-\\frac{1}{(n+1)^2}$.",
      "The first two pieces telescope to $1$, and the last is $\\frac{\\pi^2}{6}-1$: the total is $1-\\left(\\frac{\\pi^2}{6}-1\\right)$.",
      "The answer is $2-\\frac{\\pi^2}{6}$."
    ],
    "trap": "$\\sum\\frac{1}{(n+1)^2}$ starting from $n=1$ is $\\frac{\\pi^2}{6}-1$; taking it as $\\frac{\\pi^2}{6}$ gives $1-\\frac{\\pi^2}{6}<0$ — but the integral of a product of two negatives can't be negative.",
    "check": "$\\ln x$ and $\\ln(1-x)$ are both negative on $(0,1)$, so the product is positive; the answer is about $0.355>0$."
  },
  "burst-boss-int-014": {
    "spot": "$\\ln\\sin\\cdot\\ln\\cos$ is hard to integrate directly, but $\\ln\\sin+\\ln\\cos=\\ln\\frac{\\sin 2x}{2}$ and $\\ln\\sin-\\ln\\cos=\\ln\\tan x$ both have known integrals: use $ab=\\frac{(a+b)^2-(a-b)^2}{4}$.",
    "why": "Splitting the product into two squares reduces it to the known $\\int\\ln^2\\sin$ and $\\int\\ln^2\\tan$; mixed partial derivatives of the Beta function also work, but need the digamma function.",
    "steps": [
      "Let $S=\\ln\\sin x$, $C=\\ln\\cos x$; $SC=\\frac{(S+C)^2-(S-C)^2}{4}$.",
      "Known: $\\int_0^{\\pi/2}\\ln\\sin x\\,dx=-\\frac{\\pi}{2}\\ln 2$, $\\int_0^{\\pi/2}\\ln^2\\sin x\\,dx=\\frac{\\pi}{2}\\ln^2 2+\\frac{\\pi^3}{24}$.",
      "$S+C=\\ln\\sin 2x-\\ln 2$; with $t=2x$ and symmetry, $\\int_0^{\\pi/2}(S+C)^2dx=\\int_0^{\\pi/2}(\\ln\\sin t-\\ln 2)^2dt=2\\pi\\ln^2 2+\\frac{\\pi^3}{24}$.",
      "$S-C=\\ln\\tan x$, and it's known that $\\int_0^{\\pi/2}\\ln^2\\tan x\\,dx=\\frac{\\pi^3}{8}$.",
      "Subtract and divide by $4$: $\\frac{1}{4}\\left(2\\pi\\ln^22+\\frac{\\pi^3}{24}-\\frac{\\pi^3}{8}\\right)=\\frac{\\pi\\ln^22}{2}-\\frac{\\pi^3}{48}$.",
      "The answer is $\\frac{\\pi\\ln^2 2}{2}-\\frac{\\pi^3}{48}$."
    ],
    "trap": "Treating $\\int\\ln\\sin\\cdot\\ln\\cos$ as $\\int\\ln\\sin\\cdot\\int\\ln\\cos$ divided by $\\frac{\\pi}{2}$ and getting $\\frac{\\pi}{2}\\ln^2 2$ — an integral of a product doesn't split like that.",
    "check": "Both logs are negative, so the product is positive; the answer is about $0.109$, positive."
  },
  "burst-boss2-anti-002": {
    "spot": "$x^4$ times $\\sin x$: the polynomial becomes a constant after four derivatives, and the trig function never gets more complicated when integrated — the tabular method (repeated integration by parts).",
    "why": "The tabular method lays out all five rows at once; multiply with alternating signs. Writing out integration by parts four times by hand makes it easy to drop a sign.",
    "steps": [
      "Derivative column: $x^4,\\,4x^3,\\,12x^2,\\,24x,\\,24$; integral column: $-\\cos x,\\,-\\sin x,\\,\\cos x,\\,\\sin x,\\,-\\cos x$.",
      "Multiply along the diagonals with signs $+,-,+,-,+$: $-x^4\\cos x+4x^3\\sin x+12x^2\\cos x-24x\\sin x-24\\cos x$.",
      "Add $C$ and that's the answer."
    ],
    "trap": "Applying the alternating signs to the polynomial column and then flipping signs again in the integral column, ending up with something like $-x^4\\cos x-4x^3\\sin x+\\cdots$, which doesn't differentiate back.",
    "check": "Differentiating back gives exactly $x^4\\sin x$."
  },
  "burst-boss2-anti-003": {
    "spot": "$x^4\\cos x$: a polynomial with a trig function, and the polynomial vanishes after four derivatives — the tabular method.",
    "why": "One table with alternating-sign products is more reliable than writing out integration by parts four times.",
    "steps": [
      "Derivative column: $x^4,\\,4x^3,\\,12x^2,\\,24x,\\,24$; integral column: $\\sin x,\\,-\\cos x,\\,-\\sin x,\\,\\cos x,\\,\\sin x$.",
      "Multiply along the diagonals with signs $+,-,+,-,+$: $x^4\\sin x+4x^3\\cos x-12x^2\\sin x-24x\\cos x+24\\sin x$.",
      "Add $C$ and that's the answer."
    ],
    "trap": "The last term is often written as $-24\\sin x$: the fifth row's sign is $+$, and times $\\sin x$ from the integral column it should be $+24\\sin x$.",
    "check": "Differentiating back gives exactly $x^4\\cos x$."
  },
  "burst-boss2-lim-007": {
    "spot": "$\\sum_{k=1}^n\\frac{1}{n+k}=\\frac{1}{n}\\sum\\frac{1}{1+k/n}$ is the right-endpoint Riemann sum for $\\int_0^1\\frac{dx}{1+x}=\\ln 2$; multiplying by $n$ asks for the leading error term of the Riemann sum.",
    "why": "The leading error of a right-endpoint sum is $\\frac{f(1)-f(0)}{2n}$ (the trapezoid correction); you can also use $H_m\\approx\\ln m+\\gamma+\\frac{1}{2m}$ and get the same thing.",
    "steps": [
      "Limit of the Riemann sum: $\\int_0^1\\frac{dx}{1+x}=\\ln 2$.",
      "Right-endpoint sum $=\\int_0^1 f+\\frac{f(1)-f(0)}{2n}+O\\left(\\frac{1}{n^2}\\right)$, with $f=\\frac{1}{1+x}$: $\\frac{1}{2}\\left(\\frac{1}{2}-1\\right)=-\\frac{1}{4}$.",
      "Numerically: the sum $=H_{2n}-H_n=\\int_0^1\\frac{t^n-t^{2n}}{1-t}dt$; at $n=50$, $n(\\cdots-\\ln 2)\\approx-0.2488$, heading toward $-\\frac{1}{4}$.",
      "So the limit is $-\\frac{1}{4}$."
    ],
    "trap": "Thinking the sum equals $\\ln 2$ exactly, so the bracket is $0$ and the answer is $0$; or treating the right-endpoint sum as a left-endpoint sum, flipping the error's sign to get $+\\frac{1}{4}$.",
    "check": "$f$ is decreasing, so the right-endpoint sum underestimates; the bracket is negative, and a negative answer makes sense."
  },
  "burst-boss3-anti-001": {
    "spot": "$x^6e^{-3x}$: polynomial times exponential — the tabular method; each integration in the exponential column divides by another $-3$.",
    "why": "The polynomial is gone after six derivatives, so one table does it; integrating by parts six times by hand is exhausting and error-prone.",
    "steps": [
      "Integral column: $\\int e^{-3x}dx=-\\frac{e^{-3x}}{3}$, and each row down multiplies by another $-\\frac{1}{3}$.",
      "Multiply through the table (signs alternate, and combined with the integral column's own minus signs every term has the same sign): $-e^{-3x}\\left(\\frac{x^6}{3}+\\frac{6x^5}{9}+\\frac{30x^4}{27}+\\frac{120x^3}{81}+\\frac{360x^2}{243}+\\frac{720x}{729}+\\frac{720}{2187}\\right)$.",
      "After reducing: $-e^{-3x}\\left(\\frac{x^6}{3}+\\frac{2x^5}{3}+\\frac{10x^4}{9}+\\frac{40x^3}{27}+\\frac{40x^2}{27}+\\frac{80x}{81}+\\frac{80}{243}\\right)$.",
      "Add $C$ and that's the answer."
    ],
    "trap": "Forgetting to divide by another $-3$ at each step in the integral column (dividing by $3$ only once), so coefficients come out like $\\frac{6x^5}{3}$ and it doesn't differentiate back.",
    "check": "Constant-term check: $\\int_0^\\infty x^6e^{-3x}dx=\\frac{6!}{3^7}=\\frac{80}{243}$, exactly the constant term in the parentheses."
  },
  "burst-boss3-int-006": {
    "spot": "$x^3\\sin x$ on $[0,\\pi]$: find the antiderivative with the tabular method; at both ends $\\sin 0=\\sin\\pi=0$, so only the $\\cos$ terms survive.",
    "why": "The polynomial vanishes after three derivatives, so four rows of the table do it; with limits, all the $\\sin$ terms drop out, saving more work.",
    "steps": [
      "Table: $x^3,3x^2,6x,6$ paired with $-\\cos x,-\\sin x,\\cos x,\\sin x$, signs $+,-,+,-$.",
      "Antiderivative $F(x)=-x^3\\cos x+3x^2\\sin x+6x\\cos x-6\\sin x$.",
      "$F(\\pi)=\\pi^3-6\\pi$, $F(0)=0$.",
      "The answer is $\\pi^3-6\\pi$."
    ],
    "trap": "Not cancelling the minus sign of $\\cos\\pi=-1$ against the leading minus, getting $-\\pi^3+6\\pi<0$; but the integrand is nonnegative on $[0,\\pi]$, so the answer must be positive.",
    "check": "$\\pi^3-6\\pi\\approx 12.16>0$, consistent with a nonnegative integrand."
  },
  "burst-der-003": {
    "spot": "Differentiating $\\cosh(2x)$ twice gives itself times $4$: $(\\cosh 2x)''=4\\cosh 2x$, so even-order derivatives keep multiplying by $4$.",
    "why": "A cycle of period two, so write the general formula $f^{(2m)}=4^m\\cosh 2x$ directly; no expansion needed.",
    "steps": [
      "$f''=4\\cosh(2x)$.",
      "Multiply by $4$ every two orders: $f^{(18)}=4^9\\cosh(2x)=2^{18}\\cosh(2x)$.",
      "Plug in $x=0$, $\\cosh 0=1$: $2^{18}=262144$."
    ],
    "trap": "Thinking even orders produce $\\sinh$, which is $0$ at $0$. Even orders give $\\cosh$; only odd orders give $\\sinh$.",
    "check": "Maclaurin: $\\cosh 2x=\\sum\\frac{(2x)^{2m}}{(2m)!}$, and the $x^{18}$ coefficient times $18!$ is $2^{18}$."
  },
  "cl-der-023": {
    "spot": "The maximum directional derivative $=|\\nabla f|$: compute the three partial derivatives at $(1,1,0)$ and take the length.",
    "why": "The maximum occurs in the gradient direction, and its size is the gradient's length; no need to optimize over unit vectors.",
    "steps": [
      "$f_x=2xy$, which is $2$ at $(1,1,0)$.",
      "$f_y=x^2+ze^{yz}$, which is $1$ at that point.",
      "$f_z=ye^{yz}$, which is $1$ at that point.",
      "$\\nabla f=(2,1,1)$, $|\\nabla f|=\\sqrt{4+1+1}=\\sqrt6$."
    ],
    "trap": "Writing the maximum directional derivative as the sum of the gradient components, $2+1+1=4$; you need the vector's length.",
    "check": "$\\sqrt6\\approx 2.45$, larger than the derivative along any single axis (the largest is $2$)."
  },
  "cl-der-031": {
    "spot": "Mean Value Theorem: $f'(c)=\\frac{f(1)-f(0)}{1-0}$; $\\arctan 1=\\frac{\\pi}{4}$, and $f'(c)=\\frac{1}{1+c^2}$ can be solved for $c$ directly.",
    "why": "Write out the equation and solve; $\\frac{1}{1+c^2}=\\frac{\\pi}{4}$ solves in one step.",
    "steps": [
      "Secant slope: $\\frac{\\arctan 1-\\arctan 0}{1}=\\frac{\\pi}{4}$.",
      "$f'(x)=\\frac{1}{1+x^2}$.",
      "$\\frac{1}{1+c^2}=\\frac{\\pi}{4}\\Rightarrow c^2=\\frac{4}{\\pi}-1$; the positive root $c=\\sqrt{\\frac{4}{\\pi}-1}\\approx 0.523$ lies in $(0,1)$.",
      "The answer is $c=\\sqrt{\\frac{4}{\\pi}-1}$."
    ],
    "trap": "Writing $c^2=\\frac{\\pi}{4}-1$ (forgetting to take the reciprocal), which is negative and has no square root.",
    "check": "The tangent slope at $c\\approx 0.523$ is $\\approx 0.785=\\frac{\\pi}{4}$."
  },
  "cl-der-033": {
    "spot": "$\\arctan x\\to\\frac{\\pi}{2}$, so $x\\arctan x\\approx\\frac{\\pi}{2}x$; for the intercept $b=\\lim\\left(x\\arctan x-\\frac{\\pi}{2}x\\right)$, use $\\arctan x=\\frac{\\pi}{2}-\\arctan\\frac{1}{x}$.",
    "why": "That identity turns the $\\infty-\\infty$ into $-x\\arctan\\frac{1}{x}$, and since $\\arctan u\\approx u$ you see $-1$ at a glance.",
    "steps": [
      "For $x>0$, $\\arctan x=\\frac{\\pi}{2}-\\arctan\\frac{1}{x}$.",
      "So $x\\arctan x-\\frac{\\pi}{2}x=-x\\arctan\\frac{1}{x}$.",
      "Let $u=\\frac{1}{x}\\to 0^+$: $-\\frac{\\arctan u}{u}\\to-1$.",
      "$b=-1$."
    ],
    "trap": "Seeing $\\arctan x\\to\\frac{\\pi}{2}$ and saying $b=0$; $x$ times the tiny gap between $\\arctan x$ and $\\frac{\\pi}{2}$, which is $\\approx\\frac{1}{x}$, leaves exactly $-1$.",
    "check": "At $x=1000$, $x\\arctan x-\\frac{\\pi}{2}x\\approx-0.99999967$."
  },
  "cl-int-030": {
    "spot": "Moment of inertia about a diameter (take the $x$-axis): $I=\\iint\\sigma y^2\\,dA$; for a disk use polar coordinates with $y=r\\sin\\theta$.",
    "why": "In polar coordinates $r$ and $\\theta$ separate into a product of two one-dimensional integrals; you can also check against the formula $\\frac{1}{4}MR^2$.",
    "steps": [
      "$I=\\sigma\\int_0^{2\\pi}\\int_0^2 (r\\sin\\theta)^2\\,r\\,dr\\,d\\theta=3\\int_0^2 r^3dr\\int_0^{2\\pi}\\sin^2\\theta\\,d\\theta$.",
      "$\\int_0^{2\\pi}\\sin^2\\theta\\,d\\theta=\\pi$.",
      "$I=3\\cdot 4\\cdot\\pi=12\\pi$."
    ],
    "trap": "Using $\\frac{1}{2}MR^2=24\\pi$ for the perpendicular axis through the center — that's rotation about the central axis, not about a diameter.",
    "check": "Formula $\\frac{1}{4}MR^2$ with $M=3\\cdot 4\\pi=12\\pi$: $\\frac{1}{4}\\cdot 12\\pi\\cdot 4=12\\pi$."
  },
  "cl-lim-007": {
    "spot": "Factor $e^{\\sin x}$ out of $e^{\\tan x}-e^{\\sin x}$: $e^{\\sin x}\\left(e^{\\tan x-\\sin x}-1\\right)$, and $\\tan x-\\sin x\\sim\\frac{x^3}{2}$.",
    "why": "After factoring you only need $e^h-1\\sim h$ and the cubic term of $\\tan x-\\sin x$; expanding both $e^{\\cdots}$ to third order directly is tedious.",
    "steps": [
      "$e^{\\tan x}-e^{\\sin x}=e^{\\sin x}\\left(e^{\\tan x-\\sin x}-1\\right)$, and $e^{\\sin x}\\to 1$.",
      "$\\tan x=x+\\frac{x^3}{3}+\\cdots$, $\\sin x=x-\\frac{x^3}{6}+\\cdots$, with difference $\\frac{x^3}{2}$.",
      "As $h\\to 0$, $e^h-1\\sim h$, so the whole thing $\\sim\\frac{x^3}{2}$.",
      "$c=\\frac{1}{2}$."
    ],
    "trap": "Remembering the cubic term of $\\tan x$ as $-\\frac{x^3}{3}$ (mixing it up with $\\arctan$) and getting $c=-\\frac{1}{6}$.",
    "check": "Plug in $x=0.01$: the ratio is about $0.5$."
  }
};
