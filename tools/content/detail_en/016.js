// Detail v2, English — batch 016. Translation of tools/content/detail/016.js (text only; claims live in the Chinese file).
module.exports = {
  "vc-work-003": {
    "spot": "The path is $y=x$, a curve you can parametrize by $x$ directly: replace both $y$ and $dy$ with $x$, and the line integral becomes an ordinary definite integral.",
    "why": "The curve is already in the form $y=f(x)$, so no separate parametrization is needed; no need to test for a conservative field either ($\\langle x^2,xy\\rangle$ is not conservative).",
    "steps": [
      "On $C$, $y=x$, so $dy=dx$, and $x$ runs from $0$ to $1$.",
      "Substitute: $x^2\\,dx+x\\cdot x\\,dx=2x^2\\,dx$.",
      "$\\int_0^1 2x^2\\,dx=\\frac{2}{3}$.",
      "Answer: $\\frac{2}{3}$."
    ],
    "trap": "Integrating only the $x^2\\,dx$ term and forgetting that $xy\\,dy$ must also be rewritten in $x$, giving $\\frac{1}{3}$.",
    "check": "$\\langle x^2,xy\\rangle$ is not conservative ($\\frac{\\partial}{\\partial x}(xy)=y\\ne 0=\\frac{\\partial}{\\partial y}x^2$), so a different path gives a different answer; along $y=x^2$ you get $\\frac{1}{3}+\\frac{2}{5}$."
  },
  "ap-work-003": {
    "spot": "Different pieces of the chain are lifted different distances: the piece at depth $y$ only needs to be lifted $y$ m. This is the work integral \"slice into small pieces, weight times distance for each, then add up\".",
    "why": "The chain's center of mass is $5$ m deep, so \"total weight times rise of the center of mass\" also works; but the slicing integral works for any shape.",
    "steps": [
      "The piece from depth $y$ to $y+dy$: mass $2\\,dy$ kg, weight $2\\cdot 10\\,dy=20\\,dy$ N.",
      "This piece is lifted $y$ m, so the work is $20y\\,dy$.",
      "$W=\\int_0^{10}20y\\,dy=10y^2\\Big|_0^{10}=1000$.",
      "Answer: $1000$ J."
    ],
    "trap": "Multiplying the whole chain's weight $200$ N by the full length $10$ m to get $2000$: the top part barely needs to be lifted at all.",
    "check": "Center-of-mass method: total weight $200$ N, center of mass $5$ m deep, $200\\times 5=1000$. Matches."
  },
  "ch-mix-002": {
    "spot": "$e^{2x}$ times $\\cos\\sqrt{x}$: a product on the outside, and each factor has its own inner layer — Product Rule, with the Chain Rule inside each term.",
    "why": "Writing the Product Rule skeleton first and differentiating each factor separately makes it harder to drop a term than doing it all at once.",
    "steps": [
      "First factor: $(e^{2x})'=2e^{2x}$.",
      "Second factor: $(\\cos\\sqrt{x})'=-\\sin\\sqrt{x}\\cdot\\frac{1}{2\\sqrt{x}}$.",
      "Product Rule: $2e^{2x}\\cos\\sqrt{x}+e^{2x}\\cdot\\left(-\\frac{\\sin\\sqrt{x}}{2\\sqrt{x}}\\right)$.",
      "Answer: $2e^{2x}\\cos\\sqrt{x}-\\frac{e^{2x}\\sin\\sqrt{x}}{2\\sqrt{x}}$."
    ],
    "trap": "Differentiating $\\cos\\sqrt{x}$ but forgetting the inner factor $\\frac{1}{2\\sqrt{x}}$, so the second term becomes $-e^{2x}\\sin\\sqrt{x}$.",
    "check": "Plug in $x=1$: $2e^2\\cos 1-\\frac{e^2\\sin 1}{2}\\approx 4.88$, consistent with the secant slope."
  },
  "cx-cont-001": {
    "spot": "The numerator $x^2-9$ is also $0$ at $x=3$: a $\\frac{0}{0}$ form, and the numerator factors to give $x-3$. Continuity means $k$ must equal this limit.",
    "why": "Continuity means $f(3)=\\lim_{x\\to 3}f(x)$; the limit falls out after one cancellation, no L'Hôpital's Rule needed.",
    "steps": [
      "Continuity requires $k=f(3)=\\lim_{x\\to 3}\\frac{x^2-9}{x-3}$.",
      "Factor: $x^2-9=(x-3)(x+3)$; for $x\\ne 3$ cancel to get $x+3$.",
      "$\\lim_{x\\to 3}(x+3)=6$.",
      "So $k=6$."
    ],
    "trap": "Plugging $x=3$ straight into the expression, getting $\\frac{0}{0}$, and concluding $k=0$ or that there is no solution.",
    "check": "At $x=3.001$, $\\frac{x^2-9}{x-3}=6.001$, indeed close to $6$."
  },
  "cx-exam-004": {
    "spot": "Both the base and the exponent contain $x$: $x^x$ is neither a power function nor an exponential function. Rewrite it as $e^{x\\ln x}$ (or take logs) before differentiating.",
    "why": "Using $nx^{n-1}$ or $a^x\\ln a$ each gets only half of it; once written as $e^{x\\ln x}$ it is an ordinary Chain Rule problem.",
    "steps": [
      "$x^x=e^{x\\ln x}$.",
      "Chain Rule: $(x^x)'=e^{x\\ln x}\\cdot(x\\ln x)'=x^x(\\ln x+1)$.",
      "Plug in $x=1$: $1^1\\cdot(0+1)=1$.",
      "Answer: $1$."
    ],
    "trap": "Treating it as a power function and writing $x\\cdot x^{x-1}=x^x$, which also happens to give $1$ at $x=1$ — right answer by luck, wrong method. At $x=2$ it breaks (correct: $4(\\ln 2+1)$, wrong: $4$).",
    "check": "At $x=2$: $4(\\ln 2+1)\\approx 6.77$ comes from the same formula, showing the formula isn't just a lucky match at $x=1$."
  },
  "cx-exam-006": {
    "spot": "The polynomial $x^2$ times $e^x$: $x^2$ disappears after two derivatives, and $e^x$ stays itself no matter how often you integrate — integration by parts twice (or the tabular method).",
    "why": "Let the polynomial be the part you differentiate so its degree drops to $0$; choosing the other way makes the degree climb.",
    "steps": [
      "Tabular method: $x^2\\to 2x\\to 2\\to 0$ paired with repeated integrals of $e^x$, signs $+,-,+$, gives $\\int x^2e^x\\,dx=(x^2-2x+2)e^x+C$.",
      "Upper limit $x=1$: $(1-2+2)e=e$.",
      "Lower limit $x=0$: $(0-0+2)\\cdot 1=2$.",
      "Subtract: $e-2\\approx 0.718$."
    ],
    "trap": "Losing the minus sign in the second integration by parts and writing $(x^2-2x-2)e^x$; the result becomes $-e+2$, which is negative — but the integrand is clearly positive.",
    "check": "Rough estimate: $0\\le x^2e^x\\le e$ with most of the area near the right end; $0.718$ lies between $\\frac{1}{3}$ and $\\frac{e}{3}\\cdot 2$, reasonable."
  },
  "cx-king-001": {
    "spot": "The interval $[0,\\frac{\\pi}{2}]$ plus a denominator $\\sin x+\\cos x$: under $x\\to\\frac{\\pi}{2}-x$, $\\sin$ and $\\cos$ swap and the denominator stays the same — the classic signal for the symmetry substitution (King's rule).",
    "why": "Brute force means splitting the numerator into a multiple of the denominator plus a multiple of its derivative; doable but slow. The symmetry substitution finishes in two lines.",
    "steps": [
      "Let $I=\\int_0^{\\pi/2}\\frac{\\sin x}{\\sin x+\\cos x}dx$; substituting $x\\to\\frac{\\pi}{2}-x$ gives $I=\\int_0^{\\pi/2}\\frac{\\cos x}{\\cos x+\\sin x}dx$.",
      "Add the two: the integrand becomes $1$, so $2I=\\int_0^{\\pi/2}1\\,dx=\\frac{\\pi}{2}$.",
      "So $I=\\frac{\\pi}{4}$."
    ],
    "trap": "Trying $u=\\sin x+\\cos x$, but the numerator $\\sin x$ is not $u'=\\cos x-\\sin x$, so the substitution doesn't go through cleanly and you get stuck.",
    "check": "The integrand rises from $0$ to $1$ and is point-symmetric about the midpoint $\\frac{\\pi}{4}$, so its average height is $\\frac{1}{2}$ and the area is $\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{4}$."
  },
  "cx-lh-002": {
    "spot": "$x-\\sin x$ is what's left of the Taylor series of $\\sin x$ after \"removing the first term\", and the denominator is exactly $x^3$ — the answer is the coefficient of the $x^3$ term.",
    "why": "L'Hôpital's Rule needs three rounds; the Taylor series gives $x-\\sin x=\\frac{x^3}{6}-\\cdots$ in one line and you read off the coefficient.",
    "steps": [
      "$\\sin x=x-\\frac{x^3}{6}+\\frac{x^5}{120}-\\cdots$.",
      "$x-\\sin x=\\frac{x^3}{6}-\\frac{x^5}{120}+\\cdots$.",
      "Divide by $x^3$: $\\frac{1}{6}-\\frac{x^2}{120}+\\cdots\\to\\frac{1}{6}$."
    ],
    "trap": "Using the first-order approximation $\\sin x\\approx x$, the numerator becomes $0$ and you conclude the limit is $0$: the denominator is $x^3$, so you must expand through the $x^3$ term.",
    "check": "L'Hôpital's Rule three times: $\\frac{1-\\cos x}{3x^2}\\to\\frac{\\sin x}{6x}\\to\\frac{\\cos x}{6}\\to\\frac{1}{6}$."
  },
  "cx-pf-001": {
    "spot": "The denominator is a product of two distinct linear factors $(x+1)(x+2)$ and the numerator is a constant: split into partial fractions $\\frac{A}{x+1}+\\frac{B}{x+2}$, each integrating to a $\\ln$.",
    "why": "The two factors differ by $1$, so the coefficients are just $\\pm 1$; substitution or trigonometric substitution would be a detour.",
    "steps": [
      "$\\frac{1}{(x+1)(x+2)}=\\frac{1}{x+1}-\\frac{1}{x+2}$ (cover-up method: $x=-1$ gives $A=1$, $x=-2$ gives $B=-1$).",
      "Antiderivative: $\\ln(x+1)-\\ln(x+2)=\\ln\\frac{x+1}{x+2}$.",
      "Apply the limits: $\\ln\\frac{2}{3}-\\ln\\frac{1}{2}=\\ln\\frac{4}{3}$.",
      "Answer: $\\ln\\frac{4}{3}\\approx 0.288$."
    ],
    "trap": "Treating $\\ln\\frac{1}{2}$ at the lower limit as $0$ (thinking the log is $0$ at $x=0$), getting $\\ln\\frac{2}{3}<0$ — but the integrand is positive.",
    "check": "On $[0,1]$ the integrand lies between $\\frac{1}{6}$ and $\\frac{1}{2}$, and $0.288$ falls in that range."
  },
  "cx-pf-002": {
    "spot": "$x^2-1=(x-1)(x+1)$ factors into two distinct linear factors, and the interval $[2,3]$ avoids $\\pm 1$: use partial fractions and integrate each piece to a $\\ln$.",
    "why": "It looks like $\\frac{1}{1+x^2}$ but with the opposite sign, so it is not $\\arctan$; if it factors, use partial fractions.",
    "steps": [
      "$\\frac{1}{x^2-1}=\\frac{1}{2}\\left(\\frac{1}{x-1}-\\frac{1}{x+1}\\right)$.",
      "Antiderivative: $\\frac{1}{2}\\ln\\frac{x-1}{x+1}$.",
      "Apply the limits: $\\frac{1}{2}\\left(\\ln\\frac{2}{4}-\\ln\\frac{1}{3}\\right)=\\frac{1}{2}\\ln\\frac{3}{2}$.",
      "Answer: $\\frac{1}{2}\\ln\\frac{3}{2}\\approx 0.203$."
    ],
    "trap": "Seeing $x^2$ and $1$ and reaching for $\\arctan$, writing $\\arctan 3-\\arctan 2$: that is the integral of $\\frac{1}{x^2+1}$.",
    "check": "On $[2,3]$ the integrand falls from $\\frac{1}{3}$ to $\\frac{1}{8}$, and the answer $0.203$ lies between them."
  },
  "cx-smid-006": {
    "spot": "The coefficient has both $n!$ and $n^n$: dividing consecutive terms cancels almost all the factorials, leaving only $\\left(\\frac{n}{n+1}\\right)^n$ — Ratio Test, and $e$ will show up.",
    "why": "The Root Test would require handling $\\sqrt[n]{n!}$, which needs Stirling's formula; with the Ratio Test, after cancelling you get a familiar limit.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)!}{(n+1)^{n+1}}\\cdot\\frac{n^n}{n!}=\\frac{n^n}{(n+1)^n}=\\left(\\frac{n}{n+1}\\right)^n$.",
      "$\\left(\\frac{n}{n+1}\\right)^n=\\frac{1}{(1+\\frac{1}{n})^n}\\to\\frac{1}{e}$.",
      "The radius of convergence is the reciprocal of the ratio limit: $R=\\frac{1}{1/e}=e$."
    ],
    "trap": "Thinking $\\left(\\frac{n}{n+1}\\right)^n\\to 1$ (the base tends to $1$, so treat it as $1$) and getting $R=1$: this is a $1^\\infty$ form, and the limit is $\\frac{1}{e}$.",
    "check": "At $n=1000$, $\\left(\\frac{n}{n+1}\\right)^n\\approx 0.3681$, very close to $\\frac{1}{e}\\approx 0.3679$."
  },
  "cx-smid-008": {
    "spot": "$nx^{n-1}$ is exactly the derivative of $x^n$: this series is the geometric series $\\sum x^n$ differentiated term by term.",
    "why": "Term-by-term differentiation is valid inside the radius of convergence, and differentiating $\\frac{1}{1-x}$ once gives a closed form; adding partial sums directly needs the shift-and-subtract trick, which is messier.",
    "steps": [
      "For $|x|<1$, $\\sum_{n=0}^{\\infty}x^n=\\frac{1}{1-x}$; differentiating term by term gives $\\sum_{n=1}^{\\infty}nx^{n-1}=\\frac{1}{(1-x)^2}$.",
      "$x=\\frac{1}{3}$ is inside the interval of convergence; plug in: $\\frac{1}{(2/3)^2}=\\frac{9}{4}$.",
      "Answer: $\\frac{9}{4}$."
    ],
    "trap": "Plugging $\\frac{1}{3}$ straight into the geometric series $\\frac{1}{1-x}$ and getting $\\frac{3}{2}$: forgetting that the coefficient $n$ means one extra derivative.",
    "check": "The first three terms give $1+\\frac{2}{3}+\\frac{3}{9}=2$; adding the remaining positive terms, $2.25$, a bit above $2$, is reasonable."
  },
  "cx-smid-011": {
    "spot": "The general term is $(n!)^2$ over $(2n)!$, all factorials: dividing consecutive terms reduces to a ratio of polynomials — Ratio Test.",
    "why": "Ratios of factorials cancel neatly; the Comparison Test would first require estimating the size of $\\binom{2n}{n}$, a detour.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{((n+1)!)^2}{(2n+2)!}\\cdot\\frac{(2n)!}{(n!)^2}=\\frac{(n+1)^2}{(2n+1)(2n+2)}$.",
      "Numerator and denominator are both quadratic, with leading coefficients $1$ and $4$: the limit is $\\frac{1}{4}$.",
      "The ratio limit is $\\frac{1}{4}<1$, so by the Ratio Test the series converges."
    ],
    "trap": "Cancelling $(2n)!$ as if it were $2\\cdot n!$ or $(n!)^2$, getting a ratio that tends to $1$ or even $n$, and wrongly calling the test inconclusive or the series divergent.",
    "check": "The first few terms $\\frac{1}{2},\\frac{4}{24},\\frac{36}{720}$ shrink to roughly a quarter or less each time, like a geometric series with ratio $\\frac{1}{4}$."
  },
  "cx-trig-001": {
    "spot": "$\\sqrt{1-x^2}$ is the upper half of the unit circle, and $x$ from $0$ to $1$ is the quarter circle in the first quadrant.",
    "why": "Geometrically it is just $\\frac{\\pi}{4}$; to compute it, use the trigonometric substitution $x=\\sin\\theta$, which turns the root into $\\cos\\theta$.",
    "steps": [
      "Let $x=\\sin\\theta$, $dx=\\cos\\theta\\,d\\theta$, $\\sqrt{1-x^2}=\\cos\\theta$, with $\\theta$ from $0$ to $\\frac{\\pi}{2}$.",
      "The integral becomes $\\int_0^{\\pi/2}\\cos^2\\theta\\,d\\theta=\\int_0^{\\pi/2}\\frac{1+\\cos 2\\theta}{2}d\\theta$.",
      "$\\left[\\frac{\\theta}{2}+\\frac{\\sin 2\\theta}{4}\\right]_0^{\\pi/2}=\\frac{\\pi}{4}$.",
      "Answer: $\\frac{\\pi}{4}$, exactly the area of a quarter unit circle."
    ],
    "trap": "Forgetting to replace $dx$ with $\\cos\\theta\\,d\\theta$ after substituting, integrating only $\\cos\\theta$ and getting $1$.",
    "check": "The quarter circle sits inside the square of side $1$ and contains the triangle below the diagonal: $\\frac{1}{2}<\\frac{\\pi}{4}<1$."
  },
  "cx-trig-003": {
    "spot": "$\\sqrt{a^2-x^2}$ in the denominator with $a=2$: this is the shape of the derivative of $\\arcsin$, just with radius $2$ instead of $1$.",
    "why": "If you remember $\\int\\frac{dx}{\\sqrt{a^2-x^2}}=\\arcsin\\frac{x}{a}+C$ it's one step; if not, derive it once with $x=2\\sin\\theta$.",
    "steps": [
      "Let $x=2\\sin\\theta$, $dx=2\\cos\\theta\\,d\\theta$, $\\sqrt{4-x^2}=2\\cos\\theta$.",
      "The integral becomes $\\int\\frac{2\\cos\\theta}{2\\cos\\theta}d\\theta=\\theta+C$.",
      "Back-substitute $\\theta=\\arcsin\\frac{x}{2}$; check by differentiating: $\\frac{1}{\\sqrt{1-x^2/4}}\\cdot\\frac{1}{2}=\\frac{1}{\\sqrt{4-x^2}}$.",
      "Answer: $\\arcsin\\frac{x}{2}+C$."
    ],
    "trap": "Writing $\\arcsin x+C$: its derivative is $\\frac{1}{\\sqrt{1-x^2}}$, not $\\frac{1}{\\sqrt{4-x^2}}$.",
    "check": "At $x=0$ the derivative is $\\frac{1}{2}$, matching the integrand $\\frac{1}{\\sqrt{4}}$."
  },
  "db-chain-002": {
    "spot": "A root inside a root: $\\sqrt{1+\\sqrt{x}}$ is two nested functions — Chain Rule from the outside in.",
    "why": "Each layer is $\\sqrt{u}$ with derivative $\\frac{u'}{2\\sqrt{u}}$; just apply it twice.",
    "steps": [
      "Outer layer: $(\\sqrt{u})'=\\frac{1}{2\\sqrt{u}}$, with $u=1+\\sqrt{x}$.",
      "Inner layer: $u'=\\frac{1}{2\\sqrt{x}}$.",
      "Multiply: $\\frac{1}{2\\sqrt{1+\\sqrt{x}}}\\cdot\\frac{1}{2\\sqrt{x}}=\\frac{1}{4\\sqrt{x}\\sqrt{1+\\sqrt{x}}}$.",
      "Answer: $\\frac{1}{4\\sqrt{x}\\sqrt{1+\\sqrt{x}}}$."
    ],
    "trap": "Differentiating only the outer layer and forgetting to multiply by $\\frac{1}{2\\sqrt{x}}$, giving $\\frac{1}{2\\sqrt{1+\\sqrt{x}}}$.",
    "check": "At $x=1$: $\\frac{1}{4\\sqrt{2}}\\approx 0.177$."
  },
  "db-chain-003": {
    "spot": "The exponent of $e$ is $\\sin(2x)$, and inside $\\sin$ is $2x$: three nested layers, so the Chain Rule multiplies three factors from the outside in.",
    "why": "$e^u$ differentiates to itself, so you just multiply by the derivative of the exponent; the exponent $\\sin 2x$ is itself one more Chain Rule step.",
    "steps": [
      "Outer layer: $(e^u)'=e^u$, with $u=\\sin 2x$.",
      "Derivative of the exponent: $(\\sin 2x)'=2\\cos 2x$.",
      "Multiply: $e^{\\sin 2x}\\cdot 2\\cos 2x$.",
      "Answer: $2\\cos(2x)\\,e^{\\sin 2x}$."
    ],
    "trap": "Dropping the innermost $2$ and writing $\\cos(2x)e^{\\sin 2x}$.",
    "check": "At $x=0$: $2\\cos 0\\cdot e^0=2$."
  },
  "db-def-002": {
    "spot": "The shape is $\\frac{f(a+h)-f(a)}{h}$, and $\\frac{1}{2}=\\cos\\frac{\\pi}{3}$: this is the derivative definition for $\\cos x$ at $\\frac{\\pi}{3}$.",
    "why": "Once you recognize the derivative definition, use $(\\cos x)'=-\\sin x$; expanding with the angle-sum formula also works but needs two extra standard limits.",
    "steps": [
      "$\\cos\\frac{\\pi}{3}=\\frac{1}{2}$, so the limit is the derivative of $f(x)=\\cos x$ at $a=\\frac{\\pi}{3}$.",
      "$(\\cos x)'=-\\sin x$.",
      "Plug in $\\frac{\\pi}{3}$: $-\\sin\\frac{\\pi}{3}=-\\frac{\\sqrt{3}}{2}$.",
      "Answer: $-\\frac{\\sqrt{3}}{2}$."
    ],
    "trap": "Forgetting the minus sign in the derivative of $\\cos$ and answering $\\frac{\\sqrt{3}}{2}$; or mixing up $\\sin\\frac{\\pi}{3}$ and $\\sin\\frac{\\pi}{6}$ and answering $-\\frac{1}{2}$.",
    "check": "Near $\\frac{\\pi}{3}$, $\\cos$ is decreasing (on its way from $1$ down to $0$), so the slope must be negative."
  },
  "db-def-008": {
    "spot": "The numerator is $\\tan x-1=\\tan x-\\tan\\frac{\\pi}{4}$ and the denominator is $x-\\frac{\\pi}{4}$: the \"$x\\to a$\" form of the derivative definition, with function $\\tan x$ and $a=\\frac{\\pi}{4}$.",
    "why": "Just use $(\\tan x)'=\\sec^2x$; L'Hôpital's Rule also works, but it is really computing the same derivative.",
    "steps": [
      "$\\tan\\frac{\\pi}{4}=1$, so this is the derivative of $\\tan x$ at $\\frac{\\pi}{4}$.",
      "$(\\tan x)'=\\sec^2x=\\frac{1}{\\cos^2x}$.",
      "$\\cos\\frac{\\pi}{4}=\\frac{\\sqrt{2}}{2}$; squared that's $\\frac{1}{2}$, reciprocal $2$.",
      "Answer: $2$."
    ],
    "trap": "Remembering $\\sec^2$ as $\\sec$ and answering $\\sqrt{2}$.",
    "check": "Another form: $1+\\tan^2\\frac{\\pi}{4}=1+1=2$. Matches."
  },
  "db-ext-002": {
    "spot": "Minimum of a continuous function on the closed interval $[\\frac{1}{2},3]$: find the critical points inside, then compare with the two endpoints — the closed interval method.",
    "why": "On a closed interval, extreme values occur only at critical points or endpoints, so comparing three values is enough; no second derivative test needed.",
    "steps": [
      "$f'(x)=1-\\frac{1}{x^2}$; setting it to $0$ gives $x=1$ ($x=-1$ is not in the interval).",
      "Value at the critical point: $f(1)=2$.",
      "Endpoints: $f(\\frac{1}{2})=\\frac{5}{2}$, $f(3)=\\frac{10}{3}$.",
      "The smallest of the three values is $2$."
    ],
    "trap": "Finding the critical point $x=1$ and answering $1$: the question asks for the minimum value $f(1)$, not where it occurs.",
    "check": "AM-GM: for $x>0$, $x+\\frac{1}{x}\\ge 2$, with equality at $x=1$, and $1$ is in the interval."
  },
  "db-imp-003": {
    "spot": "$x$ and $y$ are tangled up in $xe^y$ and $ye^x$, so you can't solve for $y=f(x)$: implicit differentiation — differentiate both sides with respect to $x$, multiplying by $y'$ wherever $y$ appears.",
    "why": "You only need the slope at one point, so after implicit differentiation plug in $(0,1)$ right away and solve for $y'$; that's the least work.",
    "steps": [
      "First confirm $(0,1)$ is on the curve: $0\\cdot e+1\\cdot e^0=1$.",
      "Differentiate both sides with respect to $x$: $e^y+xe^yy'+y'e^x+ye^x=0$.",
      "Plug in $x=0,y=1$: $e+0+y'\\cdot 1+1=0$.",
      "Solve: $y'=-(e+1)\\approx -3.718$."
    ],
    "trap": "Forgetting the Product Rule on $ye^x$ and writing only $y'e^x$, missing the $ye^x$ term (which equals $1$ at the point), and getting $y'=-e$.",
    "check": "With $F(x,y)=xe^y+ye^x$: $y'=-\\frac{F_x}{F_y}$, $F_x(0,1)=e+1$, $F_y(0,1)=0\\cdot e+1=1$."
  },
  "db-lin-003": {
    "spot": "$0.05$ is very close to $0$, and $e^0=1$ and $(e^x)'=1$ are easy at $0$: use the tangent line approximation at $a=0$.",
    "why": "Linear approximation replaces the curve with its tangent line; choose the base point where both the function value and derivative are clean.",
    "steps": [
      "$f(x)=e^x$, $f(0)=1$, $f'(0)=1$.",
      "Tangent line $L(x)=f(0)+f'(0)x=1+x$.",
      "$e^{0.05}\\approx L(0.05)=1.05$."
    ],
    "trap": "Choosing the base point $x=1$, so the approximation becomes $e+e(x-1)$; that's too far from $0.05$ and the error is much larger.",
    "check": "The true value is $e^{0.05}\\approx 1.05127$, with error about $\\frac{0.05^2}{2}=0.00125$: $e^x$ curves upward, so the tangent line slightly underestimates."
  },
  "db-tay-001": {
    "spot": "You want the fifth derivative at $0$, and the function is $x^2$ times $e^x$, whose Taylor series you know well: write the Maclaurin series, read off the $x^5$ coefficient, and multiply by $5!$.",
    "why": "Differentiating five times directly is tedious; $x^2e^x=\\sum\\frac{x^{n+2}}{n!}$ shows the $x^5$ term at a glance.",
    "steps": [
      "$e^x=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\cdots$; multiply by $x^2$: $x^2+x^3+\\frac{x^4}{2}+\\frac{x^5}{6}+\\cdots$.",
      "Maclaurin coefficient: $\\frac{f^{(5)}(0)}{5!}=\\frac{1}{6}$.",
      "$f^{(5)}(0)=\\frac{120}{6}=20$."
    ],
    "trap": "Reading the $x^5$ coefficient $\\frac{1}{6}$ and taking it as the answer, forgetting to multiply by $5!$.",
    "check": "Leibniz rule: of the derivatives of $x^2$, only the second is nonzero, so $f^{(5)}(0)=\\binom{5}{2}\\cdot 2\\cdot e^0=10\\cdot 2=20$."
  },
  "dd-def-003": {
    "spot": "The numerator is $\\sin(\\frac{\\pi}{6}+h)-\\frac{1}{2}$, and $\\sin\\frac{\\pi}{6}=\\frac{1}{2}$: this is the derivative definition for $\\sin x$ at $\\frac{\\pi}{6}$.",
    "why": "Recognize the derivative definition, use $(\\sin x)'=\\cos x$ and plug in; no need to expand the angle-sum formula.",
    "steps": [
      "$\\sin\\frac{\\pi}{6}=\\frac{1}{2}$, so the limit is the derivative of $\\sin x$ at $\\frac{\\pi}{6}$.",
      "$(\\sin x)'=\\cos x$.",
      "$\\cos\\frac{\\pi}{6}=\\frac{\\sqrt{3}}{2}$."
    ],
    "trap": "Misremembering $\\cos\\frac{\\pi}{6}$ as $\\frac{1}{2}$ (that's $\\cos\\frac{\\pi}{3}$).",
    "check": "The difference quotient at $h=0.001$ is about $0.8658$, close to $\\frac{\\sqrt{3}}{2}\\approx 0.8660$."
  },
  "dd-def-004": {
    "spot": "$\\tan\\frac{\\pi}{4}=1$, and the numerator is $\\tan(\\frac{\\pi}{4}+h)-\\tan\\frac{\\pi}{4}$: the derivative definition for $\\tan x$ at $\\frac{\\pi}{4}$.",
    "why": "Just use $(\\tan x)'=\\sec^2x$; the angle-sum formula also works, but means handling an extra fraction.",
    "steps": [
      "$\\tan\\frac{\\pi}{4}=1$, so this is the derivative of $\\tan x$ at $\\frac{\\pi}{4}$.",
      "$(\\tan x)'=\\sec^2x$.",
      "$\\sec^2\\frac{\\pi}{4}=\\frac{1}{(\\sqrt{2}/2)^2}=2$."
    ],
    "trap": "Remembering the derivative of $\\tan$ as $\\sec x$ or $\\sec x\\tan x$ and answering $\\sqrt{2}$.",
    "check": "Angle-sum formula: $\\tan(\\frac{\\pi}{4}+h)=\\frac{1+\\tan h}{1-\\tan h}$; subtracting $1$ gives $\\frac{2\\tan h}{1-\\tan h}$, and dividing by $h$ tends to $2$."
  },
  "dd-kin-005": {
    "spot": "The position is the fraction $\\frac{t}{t^2+1}$ and velocity is its derivative: Quotient Rule.",
    "why": "Numerator and denominator are both simple, so one Quotient Rule step does it; rewriting as $t(t^2+1)^{-1}$ and using the Product Rule also works but needs an extra common-denominator step.",
    "steps": [
      "Quotient Rule: $v(t)=\\frac{1\\cdot(t^2+1)-t\\cdot 2t}{(t^2+1)^2}=\\frac{1-t^2}{(t^2+1)^2}$.",
      "Plug in $t=2$: $\\frac{1-4}{25}=-\\frac{3}{25}$.",
      "Velocity $-\\frac{3}{25}$ (the minus sign means it is moving back)."
    ],
    "trap": "Reversing the order in the Quotient Rule numerator to $t\\cdot 2t-(t^2+1)$, giving $+\\frac{3}{25}$.",
    "check": "$s(2)=0.4$, $s(2.01)\\approx 0.39880$: the position decreases, so the velocity is indeed negative, about $-0.12$."
  },
  "dd-log-001": {
    "spot": "Both the base and exponent of $x^{2x}$ contain $x$: logarithmic differentiation (or write it as $e^{2x\\ln x}$).",
    "why": "Neither the power rule nor the exponential rule applies directly; after taking logs it becomes the product $2x\\ln x$, which is easy to differentiate.",
    "steps": [
      "Take logs: $\\ln y=2x\\ln x$.",
      "Differentiate both sides: $\\frac{y'}{y}=2\\ln x+2x\\cdot\\frac{1}{x}=2(\\ln x+1)$.",
      "Multiply back by $y$: $y'=x^{2x}\\cdot 2(\\ln x+1)$.",
      "Answer: $2x^{2x}(\\ln x+1)$."
    ],
    "trap": "Treating it as a power function and writing $2x\\cdot x^{2x-1}$, missing the $\\ln x$ term.",
    "check": "At $x=1$: $2\\cdot 1\\cdot(0+1)=2$."
  },
  "dd-mar-004": {
    "spot": "You want the minimum of the \"average cost\" $\\frac{C(q)}{q}$, not of $C$: divide by $q$ first, then differentiate with respect to $q$ to find the extremum.",
    "why": "The average cost $0.5q+20+\\frac{800}{q}$ is a linear term plus a reciprocal term; one derivative gives a unique critical point.",
    "steps": [
      "Average cost $A(q)=\\frac{C(q)}{q}=0.5q+20+\\frac{800}{q}$.",
      "$A'(q)=0.5-\\frac{800}{q^2}=0$ gives $q^2=1600$, $q=40$.",
      "$A''(q)=\\frac{1600}{q^3}>0$, so it is a minimum.",
      "$A(40)=20+20+20=60$."
    ],
    "trap": "Answering with the quantity $q=40$; or differentiating $C(q)$ directly and setting it to $0$, getting a negative $q$ and getting stuck.",
    "check": "At minimum average cost, marginal cost equals average cost: $C'(40)=0.5\\cdot 2\\cdot 40+20=60$."
  },
  "dd-opt-008": {
    "spot": "Revenue $R=pq$ and $q$ is linear in $p$: substituting makes $R$ a downward-opening quadratic in $p$, whose vertex is the maximum.",
    "why": "To maximize a quadratic in one variable, set the derivative to $0$ (or complete the square) — one step.",
    "steps": [
      "$R(p)=p(1000-20p)=1000p-20p^2$.",
      "$R'(p)=1000-40p=0$ gives $p=25$.",
      "$R''=-40<0$, so it is indeed a maximum; the price is $25$."
    ],
    "trap": "Answering with the maximum revenue $R(25)=12500$: the question asks for the price.",
    "check": "The quadratic's roots are $p=0$ and $p=50$, and the vertex is right in the middle at $25$."
  },
  "dd-opt-014": {
    "spot": "\"Minimum average cost\" again: $C(q)$ divided by $q$ is exactly the quadratic $q^2-6q+15$, whose vertex is the minimum.",
    "why": "After dividing by $q$ you have an upward-opening parabola; completing the square or setting the derivative to $0$ takes one step.",
    "steps": [
      "Average cost $A(q)=\\frac{q^3-6q^2+15q}{q}=q^2-6q+15$.",
      "$A'(q)=2q-6=0$, $q=3$.",
      "$A(3)=9-18+15=6$."
    ],
    "trap": "Looking for extrema of $C(q)$: $C'(q)=3q^2-12q+15=3((q-2)^2+1)>0$ has no critical points, so you conclude there is no minimum.",
    "check": "Complete the square: $q^2-6q+15=(q-3)^2+6\\ge 6$."
  },
  "fd-serx-305": {
    "spot": "The numerator is $n!$ and the denominator is only $10^n$: factorials eventually beat any exponential, so the general term does not tend to $0$.",
    "why": "The Ratio Test cancels most cleanly: $\\frac{a_{n+1}}{a_n}=\\frac{n+1}{10}$, which is clearly greater than $1$ eventually.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)!}{10^{n+1}}\\cdot\\frac{10^n}{n!}=\\frac{n+1}{10}$.",
      "From $n\\ge 10$ on, the ratio exceeds $1$, and the ratio itself tends to infinity: from then on the terms keep growing.",
      "The general term does not tend to $0$ (ratio limit $>1$), so the series diverges."
    ],
    "trap": "Seeing the first few terms $0.1,0.02,0.006,\\ldots$ shrinking and concluding convergence: the first $9$ terms do shrink, but from term $10$ on they keep growing.",
    "check": "$a_{20}=\\frac{20!}{10^{20}}\\approx 0.024$ is still small, but $a_{25}=\\frac{25!}{10^{25}}\\approx 1.55$ is already above $1$ and only gets bigger."
  },
  "fd-serx-306": {
    "spot": "The numerator is the root difference $\\sqrt{n+1}-\\sqrt{n}$ and the denominator is $\\sqrt{n}\\sqrt{n+1}$: splitting gives exactly $\\frac{1}{\\sqrt{n}}-\\frac{1}{\\sqrt{n+1}}$, a telescoping series.",
    "why": "The Comparison Test can only show convergence, not give the sum; writing each term as a difference of consecutive terms leaves only the first and last in the partial sum.",
    "steps": [
      "$\\frac{\\sqrt{n+1}-\\sqrt{n}}{\\sqrt{n}\\sqrt{n+1}}=\\frac{1}{\\sqrt{n}}-\\frac{1}{\\sqrt{n+1}}$.",
      "The partial sums cancel: $S_N=1-\\frac{1}{\\sqrt{N+1}}$.",
      "As $N\\to\\infty$, $\\frac{1}{\\sqrt{N+1}}\\to 0$, so the sum is $1$."
    ],
    "trap": "Seeing $\\sqrt{n}$ in the denominator, thinking of the $p$-series with $p=\\frac{1}{2}$, and calling it divergent: the general term is actually about $\\frac{1}{2n^{3/2}}$.",
    "check": "Convergence is slow: $S_{99}=1-\\frac{1}{10}=0.9$."
  },
  "gx-013": {
    "spot": "$f$ is piecewise linear, so the integral is the area under the broken line: split into two trapezoids, each \"(top + bottom) times height over two\".",
    "why": "The graph is made of line segments, so geometric area is faster than writing a piecewise formula and integrating; the formula is only for checking.",
    "steps": [
      "On $[0,2]$ it rises from height $1$ to $3$: trapezoid area $\\frac{1+3}{2}\\cdot 2=4$ (the line is $1+x$).",
      "On $[2,4]$ it falls from $3$ back to $1$: likewise $\\frac{3+1}{2}\\cdot 2=4$ (the line is $5-x$).",
      "Total $4+4=8$."
    ],
    "trap": "Looking only at the peak and using the triangle $\\frac{1}{2}\\cdot 4\\cdot 3=6$: forgetting the rectangle of height $1$ underneath the broken line.",
    "check": "Another way to cut it: a $4\\times 1$ rectangle on the bottom plus a triangle $\\frac{1}{2}\\cdot 4\\cdot 2$ on top, $4+4=8$."
  },
  "gx-014": {
    "spot": "$g(4)=\\int_0^4 f$ is a signed area: the broken line crosses the $x$-axis, and the part below the $x$-axis counts as negative.",
    "why": "Cutting at the vertices gives three pieces, each a rectangle or triangle; adding with signs is the most direct.",
    "steps": [
      "$[0,1]$: a rectangle of height $2$, area $2$.",
      "$[1,3]$: a straight line from $2$ down to $-2$ ($4-2x$), crossing the axis at $x=2$; the triangles above and below cancel, integral $0$.",
      "$[3,4]$: rising from $-2$ back to $0$ ($2x-8$), a triangle below the axis, area $-\\frac{1}{2}\\cdot 1\\cdot 2=-1$.",
      "$g(4)=2+0-1=1$."
    ],
    "trap": "Adding the area below the axis as positive too, getting $2+2+1=5$: that is the \"total area\", not the integral.",
    "check": "$g$ reaches its maximum $3$ at $x=2$ (where $f$ changes from positive to negative), then decreases all the way to $g(4)=1$."
  },
  "gx-021": {
    "spot": "The piecewise function breaks at $x=2$, and $f(2)$ belongs to the \"$x\\ge 2$\" piece: look at the endpoint of the right-hand line at $x=2$ (the filled dot).",
    "why": "The question asks for a function value, not a limit; just decide which piece $x=2$ belongs to and plug into that formula.",
    "steps": [
      "The $x\\ge 2$ piece passes through $(2,4)$ and $(4,2)$ with slope $-1$: $f(x)=6-x$.",
      "The $x<2$ piece is $f(x)=x$, which tends to $2$ as you approach $2$ — that is only the left-hand limit, not $f(2)$.",
      "$x=2$ belongs to the second piece, so $f(2)=6-2=4$."
    ],
    "trap": "Seeing the endpoint $(2,2)$ of the line to the left of $x=2$ and answering $2$: that is an open dot ($x<2$ excludes $2$), only the left-hand limit.",
    "check": "The right-hand limit $\\lim_{x\\to 2^+}(6-x)=4$ equals $f(2)$, while the left-hand limit $2$ differs — $f$ is right-continuous at $2$ but not continuous."
  },
  "int-023": {
    "spot": "The inner integral has upper limit $x$: integrate in $y$ first (treating $x$ as a constant), get a function of $x$, then integrate in $x$.",
    "why": "Following the given order is smooth; switching the order of integration also works, but there's no need here.",
    "steps": [
      "Inner: $\\int_0^x xy\\,dy=x\\cdot\\frac{y^2}{2}\\Big|_0^x=\\frac{x^3}{2}$.",
      "Outer: $\\int_0^1\\frac{x^3}{2}dx=\\frac{1}{8}$.",
      "Answer: $\\frac{1}{8}$."
    ],
    "trap": "Using $1$ as the upper limit of the inner integral, getting $\\int_0^1\\int_0^1xy=\\frac{1}{4}$: the region is actually the triangle $0\\le y\\le x\\le 1$, only half of the square.",
    "check": "Switch the order: $\\int_0^1\\int_y^1xy\\,dx\\,dy=\\int_0^1\\frac{y(1-y^2)}{2}dy=\\frac{1}{8}$."
  },
  "lm-fl-003": {
    "spot": "$x\\to 2^-$ means approaching from the left: $x$ is in $[1,2)$, where the floor function is constantly $1$.",
    "why": "The floor function is a staircase; the left-hand limit only depends on the height of the step to the left, not on $x=2$ itself.",
    "steps": [
      "As $x$ approaches $2$ from the left, we always have $1\\le x<2$.",
      "On $[1,2)$, $\\lfloor x\\rfloor=1$, a constant.",
      "The left-hand limit is $1$."
    ],
    "trap": "Plugging in $\\lfloor 2\\rfloor=2$ directly: that is the function value, and also the right-hand limit, but the left-hand limit is $1$.",
    "check": "Compare: $\\lim_{x\\to 2^+}\\lfloor x\\rfloor=2$; left and right differ, so the two-sided limit does not exist."
  },
  "lm-fl-004": {
    "spot": "$\\lfloor x\\rfloor$ and $x$ differ by less than $1$, and dividing by $x$, which tends to infinity, wipes out the difference: Squeeze Theorem.",
    "why": "The floor function can't be differentiated or expanded directly, but the squeeze $x-1<\\lfloor x\\rfloor\\le x$ always works.",
    "steps": [
      "$x-1<\\lfloor x\\rfloor\\le x$; for $x>0$ divide by $x$: $\\frac{x-1}{x}<\\frac{\\lfloor x\\rfloor}{x}\\le 1$.",
      "The lower bound $\\frac{x-1}{x}=1-\\frac{1}{x}\\to 1$, and the upper bound is $1$.",
      "Squeeze: the limit is $1$."
    ],
    "trap": "Treating $\\lfloor x\\rfloor$ as an integer constant independent of $x$, getting $\\frac{\\text{constant}}{x}\\to 0$.",
    "check": "At $x=1000.9$, $\\frac{1000}{1000.9}\\approx 0.9991$, close to $1$."
  },
  "lx-app-004": {
    "spot": "$\\left(1+\\frac{0.05}{n}\\right)^n$: the base tends to $1$ and the exponent to infinity, a $1^\\infty$ form, matching $\\left(1+\\frac{r}{n}\\right)^n\\to e^r$.",
    "why": "This is a variant of the definition of $e$, so apply $e^r$ directly; to derive it, take logs and use $\\ln(1+u)\\approx u$.",
    "steps": [
      "Take logs: $n\\ln\\left(1+\\frac{0.05}{n}\\right)\\to 0.05$ (since $\\ln(1+u)\\sim u$).",
      "So $\\left(1+\\frac{0.05}{n}\\right)^n\\to e^{0.05}$.",
      "The final amount is $10000e^{0.05}\\approx 10512.71$ dollars."
    ],
    "trap": "Thinking $1+\\frac{0.05}{n}\\to 1$, and $1$ to any power is still $1$, so the answer is $10000$ dollars.",
    "check": "Monthly compounding ($n=12$) gives about $10511.62$ dollars, slightly less than continuous compounding and slightly more than simple interest $10500$."
  },
  "lx-sq-001": {
    "spot": "$\\cos\\frac{5}{x}$ oscillates wildly as $x\\to 0$ and has no limit, but it is always trapped between $\\pm 1$, and it is multiplied by $x^2$, which tends to $0$: Squeeze Theorem.",
    "why": "You can't split it as $\\lim x^2\\cdot\\lim\\cos\\frac{5}{x}$ (the latter doesn't exist); bounded times something tending to $0$ calls for the Squeeze Theorem.",
    "steps": [
      "$-1\\le\\cos\\frac{5}{x}\\le 1$; multiply by $x^2\\ge 0$: $-x^2\\le x^2\\cos\\frac{5}{x}\\le x^2$.",
      "Both bounds $\\pm x^2\\to 0$.",
      "Squeeze: the limit is $0$."
    ],
    "trap": "Splitting with the product law, seeing that $\\lim\\cos\\frac{5}{x}$ doesn't exist, and declaring the whole limit nonexistent.",
    "check": "At $x=0.001$, $|x^2\\cos\\frac{5}{x}|\\le 10^{-6}$, very close to $0$."
  },
  "mob-tech-005": {
    "spot": "The denominator $x^2-1=(x-1)(x+1)$ splits into two distinct linear factors and the numerator is a constant: the standard setup for partial fractions of a rational function.",
    "why": "It looks like $\\frac{1}{x^2+1}$ but with a minus sign, so $\\arctan$ doesn't apply; the trigonometric substitution $x=\\sec\\theta$ works but is much slower.",
    "steps": [
      "Factor and split: $\\frac{1}{x^2-1}=\\frac{1}{2}\\left(\\frac{1}{x-1}-\\frac{1}{x+1}\\right)$.",
      "Integrate each to a log: $\\frac{1}{2}\\ln\\left|\\frac{x-1}{x+1}\\right|+C$, which differentiates back correctly.",
      "So the technique to use is partial fractions."
    ],
    "trap": "Seeing $x^2$ and $1$ and reflexively using $\\arctan x$: that is for $\\frac{1}{x^2+1}$, and one sign makes it a completely different integral.",
    "check": "In reverse: $\\frac{1}{x-1}-\\frac{1}{x+1}=\\frac{2}{x^2-1}$; over a common denominator it is indeed twice the original."
  },
  "tb-avg-002": {
    "spot": "\"The average value of a function on an interval\" is the integral divided by the interval length: $\\frac{1}{b-a}\\int_a^bf$.",
    "why": "Apply the average value formula directly; the integral of $\\cos x$ is $\\sin x$, one step.",
    "steps": [
      "$\\int_0^{\\pi/2}\\cos x\\,dx=\\sin\\frac{\\pi}{2}-\\sin 0=1$.",
      "Interval length $\\frac{\\pi}{2}$.",
      "Average value $\\frac{1}{\\pi/2}=\\frac{2}{\\pi}\\approx 0.637$."
    ],
    "trap": "Using the average of the endpoint values $\\frac{\\cos 0+\\cos\\frac{\\pi}{2}}{2}=\\frac{1}{2}$: that only works for straight lines.",
    "check": "$\\cos x$ is concave down on $[0,\\frac{\\pi}{2}]$, so its average should exceed the endpoint average $\\frac{1}{2}$; $0.637$ is reasonable."
  },
  "vc-cons-001": {
    "spot": "Only the start and end points are given, no path: a hint that $\\mathbf{F}$ is conservative. Check $\\frac{\\partial}{\\partial y}(2xy+1)=2x=\\frac{\\partial}{\\partial x}x^2$ — it holds.",
    "why": "For a conservative field the line integral only depends on the potential difference; find $f$, plug in the two endpoints, no parametrization needed.",
    "steps": [
      "Cross partials: $\\frac{\\partial P}{\\partial y}=2x$, $\\frac{\\partial Q}{\\partial x}=2x$, equal, so the field is conservative.",
      "Find the potential: integrating $f_x=2xy+1$ gives $f=x^2y+x+g(y)$; $f_y=x^2$ gives $g'=0$. So $f=x^2y+x$.",
      "$f(1,2)-f(0,0)=(2+1)-0=3$.",
      "Computing directly along the line $(t,2t)$ also gives $3$: $\\int_0^1[(4t^2+1)+t^2\\cdot 2]dt=3$."
    ],
    "trap": "When finding the potential, integrating $2xy$ to $x^2y$ and then adding another $x^2y$ from integrating $Q=x^2$, getting $f=2x^2y+x$ and answering $5$.",
    "check": "Take another path (along the $x$-axis to $(1,0)$, then straight up): $\\int_0^1 1\\,dx+\\int_0^2 1\\,dy=1+2=3$."
  },
  "vc-cons-004": {
    "spot": "Only the endpoints $(1,1)\\to(2,2)$ are given: test for conservative first. $\\frac{\\partial}{\\partial y}y^2=2y=\\frac{\\partial}{\\partial x}(2xy+3y^2)$ holds, so find a potential.",
    "why": "For a conservative field only the potential difference between endpoints matters; no need to pick and parametrize a path.",
    "steps": [
      "Both cross partials are $2y$, so the field is conservative.",
      "Potential $f=xy^2+y^3$: $f_x=y^2$, $f_y=2xy+3y^2$.",
      "$f(2,2)-f(1,1)=(8+8)-(1+1)=14$.",
      "Check along the line $x=y=1+t$: the integrand is $6(1+t)^2$, integral $14$."
    ],
    "trap": "When integrating $Q$ for the potential, integrating $3y^2$ to $3y^3$, getting $f=xy^2+3y^3$, and the answer becomes $28$.",
    "check": "Another path: first along $y=1$ to $(2,1)$, $\\int_1^2 1\\,dx=1$; then up along $x=2$, $\\int_1^2(4y+3y^2)dy=6+7=13$; total $14$."
  },
  "vc-nab-009": {
    "spot": "$\\nabla^2f=f_{xx}+f_{yy}$; the second partials of $x^3y$ and $xy^3$ cancel each other — this $f$ is actually harmonic, so the answer is $0$ at every point.",
    "why": "Computing the general expression $6xy-6xy=0$ and then plugging in is easier than crunching numbers at $(5,7)$ directly.",
    "steps": [
      "$f_{xx}=\\frac{\\partial^2}{\\partial x^2}(x^3y-xy^3)=6xy$; at $(5,7)$ fix $y=7$: $f_x=21x^2-343$, and differentiating again gives $210$.",
      "$f_{yy}=-6xy$; fix $x=5$: $f_y=125-15y^2$, and differentiating again gives $-210$.",
      "Add: $6xy-6xy=0$."
    ],
    "trap": "Treating $\\nabla^2$ as the gradient and computing the value of $(f_x,f_y)=(3x^2y-y^3,\\,x^3-3xy^2)$.",
    "check": "Try another point $(1,2)$: $f_{xx}=12$, $f_{yy}=-12$, which also cancel."
  },
  "vc-work-004": {
    "spot": "The path $y=x^2$ can be parametrized by $x$ directly: replace $y$ with $x^2$ and $dy$ with $2x\\,dx$, giving a one-variable definite integral.",
    "why": "$\\langle y^2,x^2\\rangle$ is not conservative ($2y\\ne 2x$), so you must compute along the given curve.",
    "steps": [
      "On $C$, $y=x^2$, $dy=2x\\,dx$, and $x$ runs from $0$ to $1$.",
      "$y^2dx=x^4dx$, $x^2dy=x^2\\cdot 2x\\,dx=2x^3dx$.",
      "$\\int_0^1(x^4+2x^3)dx=\\frac{1}{5}+\\frac{1}{2}=\\frac{7}{10}$.",
      "Answer: $\\frac{7}{10}$."
    ],
    "trap": "Not replacing $dy$ with $2x\\,dx$ and treating it as $dx$, so the second term becomes $\\int x^2dx=\\frac{1}{3}$, total $\\frac{8}{15}$.",
    "check": "The field is not conservative, so changing the path changes the result: along $y=x$ you get $\\int_0^1 2x^2dx=\\frac{2}{3}$, not $\\frac{7}{10}$."
  },
  "ap-gro-004": {
    "spot": "Newton's law of cooling: the temperature difference $T-20$ decays exponentially. In $10$ min the difference goes from $80$ to $40$ — exactly one half-life, so after $20$ min it halves again.",
    "why": "Once you see \"the difference halves every $10$ min\", you don't actually need to solve for $k$.",
    "steps": [
      "$T(t)=20+80e^{-kt}$ satisfies $T'=-k(T-20)$.",
      "$T(10)=60$: $80e^{-10k}=40$, $e^{-10k}=\\frac{1}{2}$, $k=\\frac{\\ln 2}{10}$.",
      "At $t=20$: difference $80\\cdot\\left(\\frac{1}{2}\\right)^2=20$, so $T=40$."
    ],
    "trap": "Assuming the temperature itself drops linearly: down $40$ degrees in $10$ min, so another $10$ min reaches $20$ degrees. It is the difference that decays, and proportionally.",
    "check": "The temperature never drops below room temperature $20$, and it cools more and more slowly: down $40$ degrees in the first $10$ min, only $20$ degrees in the next $10$ min."
  },
  "ap-gro-005": {
    "spot": "The difference went from $80$ to $40$ in $4$ min: half-life $4$ min. The target difference $10=\\frac{80}{8}$ means halving three times.",
    "why": "The ratio of differences is a power of $2$, so counting half-lives is faster than solving a log equation.",
    "steps": [
      "Difference $T-20=80\\left(\\frac{1}{2}\\right)^{t/4}$; at $t=4$, $T=60$, which checks out.",
      "For $T=30$ the difference is $10$: $\\left(\\frac{1}{2}\\right)^{t/4}=\\frac{1}{8}=\\left(\\frac{1}{2}\\right)^3$.",
      "$\\frac{t}{4}=3$, $t=12$ min."
    ],
    "trap": "Using the temperature instead of the difference for the ratio: taking $\\frac{30}{100}$ as the decay amount and getting $t=4\\log_2\\frac{10}{3}\\approx 6.9$.",
    "check": "Newton's law of cooling: $T'=-k(T-20)$ with $k=\\frac{\\ln 2}{4}$."
  },
  "ch-nest-002": {
    "spot": "Four nested layers: $e^{(\\cdot)}$ wraps $\\sin$ wraps $\\ln$ wraps $x^2+1$. Chain Rule from the outside in, one factor per layer.",
    "why": "Writing out the four factors layer by layer and multiplying is the hardest way to miss one; no need for logarithms.",
    "steps": [
      "Outermost $e^u$: its derivative is still $e^{\\sin(\\ln(x^2+1))}$.",
      "$\\sin v$ gives $\\cos(\\ln(x^2+1))$.",
      "$\\ln w$ and the innermost layer: $(\\ln(x^2+1))'=\\frac{2x}{x^2+1}$.",
      "Multiply the four factors: $\\frac{2x\\cos(\\ln(x^2+1))\\,e^{\\sin(\\ln(x^2+1))}}{x^2+1}$."
    ],
    "trap": "Dropping the innermost $2x$ and writing $\\frac{\\cos(\\ln(x^2+1))e^{\\sin(\\ln(x^2+1))}}{x^2+1}$.",
    "check": "At $x=0$ the derivative is $0$: the outer factor $2x$ makes it vanish ($x^2+1$ has a horizontal tangent at $0$)."
  },
  "cx-ftc-004": {
    "spot": "Differentiating \"an integral with upper limit $x^2$\": Fundamental Theorem of Calculus plus the Chain Rule — plug the upper limit into the integrand, then multiply by the derivative of the upper limit.",
    "why": "No need to integrate first; $\\frac{d}{dx}\\int_a^{g(x)}f(t)dt=f(g(x))g'(x)$ does it in one step.",
    "steps": [
      "Let $F(u)=\\int_0^u\\sin t\\,dt$; then $F'(u)=\\sin u$.",
      "We want the derivative of $F(x^2)$: $F'(x^2)\\cdot(x^2)'=\\sin(x^2)\\cdot 2x$.",
      "Check: $\\int_0^{x^2}\\sin t\\,dt=1-\\cos(x^2)$, whose derivative is $2x\\sin(x^2)$."
    ],
    "trap": "Plugging in the upper limit but forgetting to multiply by $(x^2)'=2x$, answering $\\sin(x^2)$.",
    "check": "At $x=1$: $2\\sin 1\\approx 1.683$."
  },
  "cx-hl-002": {
    "spot": "$x^2\\ln(1+\\frac{1}{x})$ is an $\\infty\\cdot 0$ form, and subtracting it from $x$ makes $\\infty-\\infty$: let $u=\\frac{1}{x}$ and expand $\\ln(1+u)$ as a Taylor series through $u^2$.",
    "why": "After switching to $u\\to 0^+$ it is the familiar $\\frac{u-\\ln(1+u)}{u^2}$, and the Taylor series gives the coefficient in one line; L'Hôpital's Rule also works but needs a common denominator first.",
    "steps": [
      "Let $u=\\frac{1}{x}$: $x-x^2\\ln(1+\\frac{1}{x})=\\frac{1}{u}-\\frac{\\ln(1+u)}{u^2}=\\frac{u-\\ln(1+u)}{u^2}$.",
      "$\\ln(1+u)=u-\\frac{u^2}{2}+\\frac{u^3}{3}-\\cdots$, so $u-\\ln(1+u)=\\frac{u^2}{2}-\\frac{u^3}{3}+\\cdots$.",
      "Divide by $u^2$ and let $u\\to 0^+$: $\\frac{1}{2}$."
    ],
    "trap": "Using the first-order approximation $\\ln(1+\\frac{1}{x})\\approx\\frac{1}{x}$ and getting $x-x=0$: you need to expand through the $\\frac{1}{x^2}$ term to see the answer.",
    "check": "At $x=100$, $x-x^2\\ln(1.01)\\approx 0.4967$, close to $\\frac{1}{2}-\\frac{1}{300}$."
  },
  "cx-lh-001": {
    "spot": "$e^x-1-x$ is exactly the Taylor series of $e^x$ minus its first two terms, and the denominator is $x^2$: the answer is the $x^2$ coefficient $\\frac{1}{2!}$.",
    "why": "The Taylor series gives the coefficient in one line; L'Hôpital's Rule takes two rounds — it works, but slower.",
    "steps": [
      "$e^x=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\cdots$.",
      "$e^x-1-x=\\frac{x^2}{2}+\\frac{x^3}{6}+\\cdots$; dividing by $x^2$ gives $\\frac{1}{2}+\\frac{x}{6}+\\cdots$.",
      "The limit is $\\frac{1}{2}$."
    ],
    "trap": "Applying L'Hôpital's Rule once to get $\\frac{e^x-1}{2x}$, then plugging in $0$ and thinking it's $0$: that's still $\\frac{0}{0}$, so apply it again.",
    "check": "L'Hôpital's Rule twice: $\\frac{e^x-1}{2x}\\to\\frac{e^x}{2}\\to\\frac{1}{2}$."
  },
  "cx-ode-006": {
    "spot": "Constant coefficients, homogeneous, second order: write the characteristic equation $r^2-3r+2=0$; two distinct real roots give two exponential solutions.",
    "why": "Solutions of constant-coefficient linear equations are always combinations of $e^{rx}$; substituting turns the differential equation into a quadratic.",
    "steps": [
      "$r^2-3r+2=(r-1)(r-2)=0$, $r=1,2$; general solution $y=Ae^x+Be^{2x}$.",
      "$y(0)=A+B=0$, $y'(0)=A+2B=1$, giving $B=1$, $A=-1$.",
      "$y=e^{2x}-e^x$, which satisfies the equation when substituted back."
    ],
    "trap": "Getting a sign wrong in the characteristic equation, $r^2+3r+2=0$, which gives $r=-1,-2$ and the solution $e^{-x}-e^{-2x}$.",
    "check": "$y(0)=0$ and $y'(0)=2-1=1$; both initial conditions hold."
  },
  "cx-seq-005": {
    "spot": "$\\frac{1}{2}\\left(a_n+\\frac{2}{a_n}\\right)$ is Newton's method iteration for $x^2=2$: if it converges, the limit $L$ must satisfy $L=\\frac{1}{2}(L+\\frac{2}{L})$.",
    "why": "Standard approach for limits of recursive sequences: assume convergence, take limits on both sides, solve the equation, then use the sign to pick the root.",
    "steps": [
      "First few terms: $a_2=\\frac{3}{2}$, $a_3=\\frac{17}{12}$, quickly approaching $1.4142$.",
      "Take limits: $L=\\frac{1}{2}(L+\\frac{2}{L})$, which simplifies to $L^2=2$.",
      "All $a_n>0$, so $L=\\sqrt{2}$, not $-\\sqrt{2}$."
    ],
    "trap": "Solving $L^2=2$ and writing $L=\\pm\\sqrt{2}$: every term of the sequence is positive, so discard the negative root.",
    "check": "AM-GM: $a_{n+1}=\\frac{1}{2}(a_n+\\frac{2}{a_n})\\ge\\sqrt{2}$, so from the second term on the sequence stays above $\\sqrt{2}$ and approaches it from above."
  },
  "db-def-004": {
    "spot": "$h\\to 0$ and the numerator at $h=0$ is $1-1=0$: this is the derivative definition of $f(h)=e^{3h}-e^{-2h}$ at $0$ (with $f(0)=0$).",
    "why": "Recognize it as a derivative, differentiate, and plug in $0$; splitting into two $\\frac{e^{ah}-1}{h}$ pieces also works with the same result.",
    "steps": [
      "$f(h)=e^{3h}-e^{-2h}$, $f(0)=0$, so the limit is $f'(0)$.",
      "$f'(h)=3e^{3h}+2e^{-2h}$.",
      "$f'(0)=3+2=5$."
    ],
    "trap": "Dropping the minus sign in the derivative of $e^{-2h}$, getting $3-2=1$.",
    "check": "Split it: $\\frac{e^{3h}-1}{h}\\to 3$ and $\\frac{e^{-2h}-1}{h}\\to -2$, $3-(-2)=5$."
  },
  "db-def-006": {
    "spot": "$\\ln e=1$, and the numerator is $\\ln(e+h)-\\ln e$: this is the derivative definition for $\\ln x$ at $x=e$.",
    "why": "Recognize the derivative definition; plug $e$ into $(\\ln x)'=\\frac{1}{x}$ and you're done.",
    "steps": [
      "$\\ln e=1$, so the limit is the derivative of $\\ln x$ at $e$.",
      "$(\\ln x)'=\\frac{1}{x}$.",
      "Plug in $x=e$: $\\frac{1}{e}\\approx 0.368$."
    ],
    "trap": "Thinking it's the derivative of $\\ln$ at $1$ and answering $1$: the base point is $e$, not $1$.",
    "check": "Difference quotient at $h=0.001$: $\\frac{\\ln(e+0.001)-1}{0.001}\\approx 0.3678$."
  },
  "db-tay-002": {
    "spot": "$\\sin(x^2)$: replace $u$ with $x^2$ in the Taylor series of $\\sin u$, which doubles every power. For $f^{(6)}(0)$, read the $x^6$ coefficient and multiply by $6!$.",
    "why": "Differentiating six times directly is a nightmare; after substituting, the $x^6$ term is just $-\\frac{(x^2)^3}{6}$.",
    "steps": [
      "$\\sin u=u-\\frac{u^3}{6}+\\cdots$; with $u=x^2$: $\\sin(x^2)=x^2-\\frac{x^6}{6}+\\frac{x^{10}}{120}-\\cdots$.",
      "$\\frac{f^{(6)}(0)}{6!}=-\\frac{1}{6}$.",
      "$f^{(6)}(0)=720\\cdot\\left(-\\frac{1}{6}\\right)=-120$."
    ],
    "trap": "Taking the coefficient $-\\frac{1}{6}$ as the answer, or multiplying by $3!$ instead of $6!$ (confusing the power of $u$ with the power of $x$).",
    "check": "The expansion has only $x^2,x^6,x^{10},\\ldots$, so $f'(0)$ through $f^{(5)}(0)$ are all $0$ except $f''(0)=2$."
  },
  "dd-nest-004": {
    "spot": "A $\\ln$ inside a $\\ln$, with $x^2+4$ innermost: three-layer Chain Rule, and each $\\ln$ layer gives \"$\\frac{1}{\\text{inside}}$\".",
    "why": "Apply $(\\ln u)'=\\frac{u'}{u}$ twice, and the innermost layer gives $2x$.",
    "steps": [
      "Outer layer: $(\\ln u)'=\\frac{u'}{u}$, with $u=\\ln(x^2+4)$.",
      "$u'=\\frac{2x}{x^2+4}$.",
      "Divide: $\\frac{2x}{(x^2+4)\\ln(x^2+4)}$."
    ],
    "trap": "Writing only $\\frac{1}{\\ln(x^2+4)}$ and forgetting the inner $\\frac{2x}{x^2+4}$.",
    "check": "At $x=0$: the derivative is $0$ (the numerator $2x$ vanishes), because $x^2+4$ has its minimum at $0$."
  },
  "dd-opt-002": {
    "spot": "Two unknowns (base side $x$, height $h$) and one constraint (volume $32000$): use the constraint to eliminate $h$, turning surface area into a one-variable function, then minimize.",
    "why": "After eliminating $h$, $S=x^2+\\frac{128000}{x}$, and one derivative gives a unique critical point.",
    "steps": [
      "$x^2h=32000$, $h=\\frac{32000}{x^2}$; open top: $S=x^2+4xh=x^2+\\frac{128000}{x}$.",
      "$S'=2x-\\frac{128000}{x^2}=0$, $x^3=64000$, $x=40$.",
      "$S''=2+\\frac{256000}{x^3}>0$, so it is a minimum; here $h=20$.",
      "$S=1600+3200=4800$."
    ],
    "trap": "Computing as if the box had a lid, $S=2x^2+4xh$, getting base side $\\sqrt[3]{32000}\\approx 31.7$ and area about $6034$.",
    "check": "For the most economical open square-based box, the height is half the base side: $20=\\frac{40}{2}$."
  },
  "dd-opt-011": {
    "spot": "Cut out small squares of side $x$: the base becomes $24-2x$ and the height is $x$, so the volume is $V=x(24-2x)^2$, maximized on $0<x<12$.",
    "why": "Maximizing a one-variable cubic: set the derivative to $0$, then check the endpoints (where the volume is $0$).",
    "steps": [
      "$V(x)=x(24-2x)^2$, $0<x<12$.",
      "$V'(x)=(24-2x)^2-4x(24-2x)=(24-2x)(24-6x)$.",
      "The only critical point in $(0,12)$ is $x=4$; at both ends $V=0$, so it is the maximum.",
      "$V(4)=4\\cdot 16^2=1024$."
    ],
    "trap": "Taking the other critical point $x=12$, which gives volume $0$; or writing the base as $24-x$ (cutting only one side).",
    "check": "Nearby points are smaller: $V(3)=972$, $V(5)=980$."
  }
};
