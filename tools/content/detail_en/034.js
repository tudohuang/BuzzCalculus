// Detail v2, English — batch 034. Translation of tools/content/detail/034.js (text only; claims live in the Chinese file).
module.exports = {
  "gp-008": {
    "spot": "The graph shows $f'$, not $f$: a local minimum is where $f'$ changes from negative to positive, i.e. where this line crosses the $x$-axis.",
    "why": "$f'$ is a line, so its zero takes one line to find; no need to integrate back to $f$ and look for a vertex.",
    "steps": [
      "Slope $\\frac{5-(-3)}{4-0}=2$, intercept $-3$, so $f'(x)=2x-3$.",
      "Zero: $2x-3=0\\Rightarrow x=\\frac{3}{2}$.",
      "To the left $f'<0$ ($f$ decreasing), to the right $f'>0$ ($f$ increasing): negative to positive, so it is a local min.",
      "The local minimum is at $x=\\frac{3}{2}$."
    ],
    "trap": "Treating the graph as the graph of $f$ and picking the lowest point of the line, answering $x=0$; the graph shows $f'$, not $f$.",
    "check": "Integrating back gives $f=x^2-3x+C$, a parabola with vertex at $\\frac{3}{2}$, lower than both endpoints."
  },
  "gp-009": {
    "spot": "The graph is a piecewise-linear $f'$ that crosses the $x$-axis twice ($x=1$, $x=3$): a local max is the zero where it goes from positive to negative.",
    "why": "Extrema depend only on the direction of the sign change of $f'$; no need to integrate to get $f$.",
    "steps": [
      "On $[0,2]$, $f'=2x-2$ with zero $x=1$; on $[2,4]$, $f'=6-2x$ with zero $x=3$.",
      "$x=1$: $f'$ goes from negative to positive, a local min.",
      "$x=3$: $f'$ goes from positive to negative, a local max.",
      "The local maximum is at $x=3$."
    ],
    "trap": "Seeing the peak of $f'$ at $x=2$ and answering $2$: that is where $f$ grows fastest (an inflection point), not a max.",
    "check": "From $x=1$ to $x=3$, $f'$ is positive throughout, so $f$ climbs by $2$ (the triangle's area); $x=3$ is higher than $x=1$, as expected."
  },
  "gp-013": {
    "spot": "The dashed line is the tangent at $x=2$, and two points on it are given: $f'(2)$ is just the slope of this line, whatever $f$ itself looks like.",
    "why": "Tangent slope $=$ derivative, and a slope from two points is one line of work.",
    "steps": [
      "Geometric meaning of the derivative: $f'(2)$ equals the slope of the tangent line at $x=2$.",
      "Points $(0,-1)$, $(5,9)$: slope $\\frac{9-(-1)}{5-0}=\\frac{10}{5}=2$.",
      "So $f'(2)=2$."
    ],
    "trap": "Reading off the height of the point of tangency ($y=3$) as the answer; the question asks for the slope, not $f(2)$.",
    "check": "The tangent line $y=2x-1$ does pass through both given points, and the point of tangency is $(2,3)$."
  },
  "lec-18-m2": {
    "spot": "You are given three numbers $f_{xx}$, $f_{yy}$, $f_{xy}$: apply the second derivative test with $D=f_{xx}f_{yy}-f_{xy}^2$. And $f_{xx}$, $f_{yy}$ having opposite signs already gives it away.",
    "why": "One computation of the discriminant classifies the point; checking the sign of $D$ is faster than checking direction by direction.",
    "steps": [
      "$D=f_{xx}f_{yy}-f_{xy}^2=(2)(-2)-0^2=-4$.",
      "$D<0$ means a saddle point; no need to look at the sign of $f_{xx}$.",
      "Intuition: like $f=x^2-y^2$, it curves up along the $x$ direction ($x^2>0$) and down along the $y$ direction ($-y^2<0$).",
      "So the point is a saddle point."
    ],
    "trap": "Looking only at $f_{xx}=2>0$ and calling it a local min; check $D$ first, and when $D<0$ the sign of $f_{xx}$ means nothing.",
    "check": "When $f_{xx}$ and $f_{yy}$ have opposite signs, $D$ is always negative ($f_{xy}^2\\ge 0$ only makes it more negative), so it must be a saddle point."
  },
  "lec-19-m1": {
    "spot": "The region is a rectangle and the integrand $xy$ splits into $x$ times $y$: just multiply two single-variable integrals.",
    "why": "For a separable function on a rectangle, Fubini's theorem turns it into a product of two one-dimensional integrals, and the order of integration doesn't matter.",
    "steps": [
      "Inner, in $y$: $\\int_0^2 xy\\,dy=x\\cdot\\frac{y^2}{2}\\Big|_0^2=2x$.",
      "Outer: $\\int_0^1 2x\\,dx=1$.",
      "Or split directly: $\\int_0^1x\\,dx\\cdot\\int_0^2y\\,dy=\\frac{1}{2}\\cdot 2=1$."
    ],
    "trap": "Integrating $x$ away too during the inner $y$-integral, or plugging the upper limit $2$ into the wrong variable, giving something like $\\frac{1}{4}$.",
    "check": "The average of $xy$ over $[0,1]\\times[0,2]$ is $\\frac{1}{2}\\cdot 1=\\frac{1}{2}$; times the area $2$ gives $1$."
  },
  "lm-fl-001": {
    "spot": "There is a floor function $\\lfloor\\cdot\\rfloor$: the standard move is $t-1<\\lfloor t\\rfloor\\le t$, then multiply by $x>0$ and squeeze.",
    "why": "$\\lfloor\\frac{1}{x}\\rfloor$ jumps around, so you can't just take the limit; the Squeeze Theorem replaces it with two continuous expressions.",
    "steps": [
      "For any $t$: $t-1<\\lfloor t\\rfloor\\le t$. Example: $x=0.3$, $\\frac{1}{x}=3.33\\ldots$, $\\lfloor\\frac{1}{x}\\rfloor=3$.",
      "Take $t=\\frac{1}{x}$ and multiply through by $x>0$ (inequalities keep direction): $1-x<x\\lfloor\\frac{1}{x}\\rfloor\\le 1$.",
      "The lower bound $1-x\\to 1$ and the upper bound is $1$: by the Squeeze Theorem the limit is $1$."
    ],
    "trap": "\"$x\\to 0$ times anything is $0$\": $\\lfloor\\frac{1}{x}\\rfloor$ goes to infinity, so this is a $0\\cdot\\infty$ form and you can't just say $0$.",
    "check": "$x=0.007$: $\\frac{1}{x}=142.86$, $\\lfloor\\cdot\\rfloor=142$, product $0.994$, already close to $1$."
  },
  "lm-nr-002": {
    "spot": "Inside the $n$-th root is a sum of exponentials: the largest base $3^n$ dominates, and after factoring it out the rest under the $n$-th root tends to $1$.",
    "why": "Factor out the largest term and squeeze, and $\\sqrt[n]{\\cdot}$ becomes $3\\cdot(\\text{something tending to }1\\text{ })$ in one line.",
    "steps": [
      "Factor out $3^n$: $\\sqrt[n]{2^n+3^n}=3\\left(1+(\\tfrac{2}{3})^n\\right)^{1/n}$.",
      "Squeeze: $1\\le 1+(\\frac{2}{3})^n\\le 2$, so $3\\le\\sqrt[n]{2^n+3^n}\\le 3\\cdot 2^{1/n}$.",
      "$2^{1/n}\\to 1$, so the upper bound also tends to $3$.",
      "Limit $=3$."
    ],
    "trap": "Thinking $\\sqrt[n]{a+b}=\\sqrt[n]{a}+\\sqrt[n]{b}$ and getting $2+3=5$.",
    "check": "$n=20$: $(2^{20}+3^{20})^{1/20}\\approx 3.0000$; $(\\frac{2}{3})^{20}$ is only about three ten-thousandths."
  },
  "lm-sq-003": {
    "spot": "$\\sin\\frac{1}{x^2}$ and $\\cos\\frac{1}{x}$ oscillate wildly near $0$ but stay between $-1$ and $1$; in front is $x^3$, which tends to $0$ — bounded times something going to zero, so squeeze.",
    "why": "The oscillating factors have no limit, so you can't split and take limits separately; an absolute-value bound is cleanest.",
    "steps": [
      "The product of the two oscillating factors is still bounded: $\\left|\\sin\\frac{1}{x^2}\\cos\\frac{1}{x}\\right|\\le 1$.",
      "So $|f(x)|\\le|x|^3$. Example: at $x=0.1$, $|f|\\le 0.001$.",
      "$|x|^3\\to 0$, so by the Squeeze Theorem the limit is $0$."
    ],
    "trap": "Splitting with the product law into $\\lim x^3\\cdot\\lim\\sin\\frac{1}{x^2}\\cdot\\lim\\cos\\frac{1}{x}$: the last two limits don't exist, and you wrongly conclude the whole limit doesn't exist.",
    "check": "$x=0.01$: the bound is only $10^{-6}$, and the function value is even smaller."
  },
  "lx-app-005": {
    "spot": "\"Terminal velocity\" is the limit as $t\\to\\infty$; the only changing part of the formula is $e^{-0.18t}$, which tends to $0$.",
    "why": "A negative exponential decays to $0$, and the constant left over is the answer; no technique needed.",
    "steps": [
      "Velocity $v(t)=55-55e^{-0.18t}$: the constant $55$ minus a term that dies out.",
      "$-0.18t\\to-\\infty$, so $e^{-0.18t}\\to 0$.",
      "$v(t)=55(1-e^{-0.18t})\\to 55(1-0)=55$ m/s."
    ],
    "trap": "Plugging in $t=0$ and getting $0$ — that is the speed right at the jump; or giving the decay rate $0.18$ as the answer.",
    "check": "At $t=30$ s it is already $55(1-e^{-5.4})\\approx 54.75$, close to $55$ but never above it."
  },
  "lx-app-006": {
    "spot": "\"After charging for a while\" $=t\\to\\infty$; plugging in $\\tau=0.25$ gives $e^{-4t}$, which decays to $0$.",
    "why": "The time constant only controls how fast it charges, not the final value; just take the limit.",
    "steps": [
      "$\\frac{t}{\\tau}=4t$, so $V(t)=9(1-e^{-4t})$.",
      "$e^{-4t}\\to 0$.",
      "$V\\to 9$ volts."
    ],
    "trap": "Plugging $\\tau=0.25$ in as $e^{-0.25t}$ (multiplying instead of dividing): the limit is still $9$, but any charging time you compute will be off by a factor of sixteen.",
    "check": "After $4\\tau=1$ s the voltage is about $9(1-e^{-4})\\approx 8.84$, already charged to $98\\%$."
  },
  "lx-app-007": {
    "spot": "Numerator and denominator are both degree one and it splits into $\\frac{2400}{x}+18$: the fixed-cost term gets spread thin to $0$ by production.",
    "why": "After splitting, the limit is obvious; you can also say it's the ratio of leading coefficients $\\frac{18}{1}$.",
    "steps": [
      "Split: $\\bar C(x)=\\frac{2400}{x}+18$.",
      "$\\frac{2400}{x}\\to 0$.",
      "The average cost tends to $18$ dollars per unit."
    ],
    "trap": "Thinking the average cost tends to $0$ as production grows: only the fixed cost gets spread out; the variable cost of $18$ dollars per unit never goes away.",
    "check": "At $2400$ units the average cost is $19$ dollars, only $1$ more than $18$."
  },
  "mob-tech-014": {
    "spot": "$\\nabla\\cdot\\mathbf F$ and $\\nabla\\times\\mathbf F$ use the same symbol $\\nabla$: divergence is its dot product with $\\mathbf F$, curl is the cross product.",
    "why": "Treat $\\nabla=(\\partial_x,\\partial_y,\\partial_z)$ as a vector you can dot and cross, and you don't need to memorize the divergence and curl formulas.",
    "steps": [
      "$\\nabla=\\left(\\frac{\\partial}{\\partial x},\\frac{\\partial}{\\partial y},\\frac{\\partial}{\\partial z}\\right)$; $\\nabla\\cdot\\mathbf F=P_x+Q_y+R_z$ is a scalar.",
      "Example: $\\mathbf F=(x^2,xy,0)$, $\\nabla\\cdot\\mathbf F=2x+x=3x$.",
      "Curl is a vector; for example $\\mathbf F=(-y,x,0)$ has $z$-component $Q_x-P_y=1-(-1)=2$ (a field rotating about the $z$-axis).",
      "So the operator is $\\nabla$ (nabla), i.e. vector calculus."
    ],
    "trap": "Writing the divergence as the vector $(P_x,Q_y,R_z)$: a dot product gives a scalar, the sum of three terms, not a vector.",
    "check": "Gradient $\\nabla f$, divergence $\\nabla\\cdot\\mathbf F$ and curl $\\nabla\\times\\mathbf F$ are three uses of the same operator; moreover $\\nabla\\times\\nabla f=\\mathbf 0$ and $\\nabla\\cdot(\\nabla\\times\\mathbf F)=0$."
  },
  "td-lim-001": {
    "spot": "A product of $n$ factors, each of the form $1+(\\text{small})$: take logs to turn it into a sum, then use $\\ln(1+u)\\approx u$.",
    "why": "There is no handy limit theorem for products; the logarithm turns it into the summable $\\sum\\frac{k}{n^2}$.",
    "steps": [
      "Take logs: $\\ln P_n=\\sum_{k=1}^n\\ln\\left(1+\\frac{k}{n^2}\\right)$, and $u-\\frac{u^2}{2}\\le\\ln(1+u)\\le u$ for $u\\ge 0$.",
      "Main term: $\\sum_{k=1}^n\\frac{k}{n^2}=\\frac{n(n+1)}{2n^2}=\\frac{n+1}{2n}\\to\\frac{1}{2}$.",
      "Error: $\\sum\\frac{k^2}{2n^4}=\\frac{(n+1)(2n+1)}{12n^3}$, roughly $\\frac{1}{6n}$, which tends to $0$.",
      "So $\\ln P_n\\to\\frac{1}{2}$ and the limit is $=e^{1/2}$."
    ],
    "trap": "Seeing that each factor tends to $1$ and concluding the product tends to $1$: the number of factors $n$ is growing too; this is a $1^\\infty$ form.",
    "check": "$n=10$: $1.01\\times1.02\\times\\cdots\\times1.10\\approx 1.70$, a bit above $e^{1/2}\\approx 1.649$ (for small $n$ the main term $\\frac{n+1}{2n}$ runs high)."
  },
  "ch-inv-007": {
    "spot": "Outer $\\arccos$, inner $e^{-x^2}$: both layers produce a minus sign — the derivative of $\\arccos$ has one, and the chain on $e^{-x^2}$ brings $-2x$.",
    "why": "Multiply layer by layer from the outside in with the Chain Rule; tracking each minus sign separately is the safest way.",
    "steps": [
      "Outer: $(\\arccos u)'=-\\frac{1}{\\sqrt{1-u^2}}$.",
      "Inner: $(e^{-x^2})'=-2xe^{-x^2}$; and $u^2=e^{-2x^2}$.",
      "Multiply; the two minus signs cancel: $\\frac{2xe^{-x^2}}{\\sqrt{1-e^{-2x^2}}}$."
    ],
    "trap": "Remembering only the minus sign from $\\arccos$ or only the one from the inner layer, so the answer is off by a sign.",
    "check": "For $x>0$, $e^{-x^2}$ is decreasing and $\\arccos$ is decreasing too; two decreasing functions composed give an increasing one, so the derivative should be positive."
  },
  "ch-inv-008": {
    "spot": "Three nested layers: $\\ln$ wrapping $\\arctan$ wrapping $e^x$. Each layer's derivative contributes one factor; multiply them.",
    "why": "Copy down the Chain Rule from the outside in: $\\frac{1}{\\arctan e^x}\\cdot\\frac{1}{1+e^{2x}}\\cdot e^x$, with nothing to simplify.",
    "steps": [
      "Outermost $\\ln u$: $\\frac{1}{u}=\\frac{1}{\\arctan e^x}$.",
      "Middle $\\arctan w$: $\\frac{1}{1+w^2}$, with $w=e^x$ so $w^2=e^{2x}$.",
      "Innermost $(e^x)'=e^x$.",
      "Multiply: $\\frac{e^x}{(1+e^{2x})\\arctan(e^x)}$."
    ],
    "trap": "Writing the middle denominator as $1+e^x$, forgetting that it is $w^2=e^{2x}$.",
    "check": "Plug in $x=0$: $e^0=1$, $\\arctan 1=\\frac{\\pi}{4}$, and the answer is $\\frac{1}{2\\cdot\\frac{\\pi}{4}}=\\frac{2}{\\pi}$."
  },
  "ch-inv-009": {
    "spot": "Outer $\\arctan$, inner $\\ln(\\cosh x)$: the derivative of $\\ln\\cosh$ is $\\frac{\\sinh x}{\\cosh x}=\\tanh x$, the hyperbolic version of $\\ln\\cos$.",
    "why": "Two layers of Chain Rule; recognizing $(\\ln\\cosh x)'=\\tanh x$ saves you from expanding into exponentials.",
    "steps": [
      "Inner: $\\cosh x=\\frac{e^x+e^{-x}}{2}$, $(\\ln\\cosh x)'=\\frac{\\sinh x}{\\cosh x}=\\tanh x$.",
      "Outer: $(\\arctan u)'=\\frac{1}{1+u^2}$, $u=\\ln\\cosh x$.",
      "Multiply: $\\frac{\\tanh x}{1+(\\ln\\cosh x)^2}$."
    ],
    "trap": "Remembering $(\\ln\\cosh x)'$ as $-\\tanh x$ (copying the minus sign from $(\\ln\\cos x)'=-\\tan x$): the derivative of hyperbolic cosine is $+\\sinh$, with no minus sign.",
    "check": "The original function is even, so its derivative is odd and equals $0$ at $x=0$."
  },
  "ch-inv-011": {
    "spot": "The exponent of $e$ is $\\arctan(\\ln x)$: three layers $e^u\\to\\arctan\\to\\ln$, and the outer $e^u$ stays as is.",
    "why": "Chain Rule from the outside in: $e^{\\arctan\\ln x}\\cdot\\frac{1}{1+\\ln^2x}\\cdot\\frac{1}{x}$.",
    "steps": [
      "The outer $e^u$ is its own derivative: $e^{\\arctan(\\ln x)}$.",
      "Middle and inner: $(\\arctan(\\ln x))'=\\frac{1}{1+(\\ln x)^2}\\cdot\\frac{1}{x}$.",
      "Multiply: $\\frac{e^{\\arctan(\\ln x)}}{x(1+(\\ln x)^2)}$."
    ],
    "trap": "Dropping the innermost $\\frac{1}{x}$ and writing only $\\frac{e^{\\arctan\\ln x}}{1+\\ln^2x}$.",
    "check": "$x=1$: $\\ln 1=0$, answer $=\\frac{e^0}{1\\cdot 1}=1$."
  },
  "ch-mix-011": {
    "spot": "A whole quotient raised to the third power: the outer chain gives $3u^2$, and the inside is the quotient $\\frac{1+e^x}{1-e^x}$, so use the Quotient Rule.",
    "why": "Chain Rule first, then Quotient Rule; the quotient's numerator simplifies to $2e^x$, far cleaner than expanding the cube.",
    "steps": [
      "Outer: $(u^3)'=3u^2u'$, $u=\\frac{1+e^x}{1-e^x}$.",
      "Quotient Rule: numerator $e^x(1-e^x)-(1+e^x)(-e^x)=2e^x$, so $u'=\\frac{2e^x}{(1-e^x)^2}$.",
      "Multiply: $3u^2\\cdot\\frac{2e^x}{(1-e^x)^2}=\\frac{6e^x}{(1-e^x)^2}\\left(\\frac{1+e^x}{1-e^x}\\right)^2$."
    ],
    "trap": "Forgetting the minus sign in $(1-e^x)'=-e^x$, so the numerator comes out as $e^x(1-e^x)-e^x(1+e^x)=-2e^{2x}$.",
    "check": "$u'=\\frac{2e^x}{(1-e^x)^2}>0$ and $u^2\\ge 0$, so the derivative is never negative."
  },
  "ch-nest-006": {
    "spot": "A tower of three $e$'s with $\\sin x$ at the bottom: each layer $e^u$ copies itself when differentiated, and at the end you multiply by $\\cos x$.",
    "why": "Peel the Chain Rule layer by layer: each peel just copies that layer down, no simplification needed.",
    "steps": [
      "Outermost: $\\left(e^{e^{e^{\\sin x}}}\\right)'=e^{e^{e^{\\sin x}}}\\cdot\\left(e^{e^{\\sin x}}\\right)'$.",
      "Second layer: $\\left(e^{e^{\\sin x}}\\right)'=e^{e^{\\sin x}}\\cdot\\left(e^{\\sin x}\\right)'$.",
      "Third layer: $\\left(e^{\\sin x}\\right)'=e^{\\sin x}\\cos x$.",
      "Multiply the four factors: $e^{e^{e^{\\sin x}}}\\,e^{e^{\\sin x}}\\,e^{\\sin x}\\cos x$."
    ],
    "trap": "Thinking \"$e^u$ doesn't change when differentiated\" and writing only $e^{e^{e^{\\sin x}}}\\cos x$, dropping the two middle layers.",
    "check": "$x=0$: $\\sin 0=0$, answer $=e^{e}\\cdot e\\cdot 1\\cdot 1=e^{e+1}$."
  },
  "ch-nest-010": {
    "spot": "$\\sin$ nested four deep: each peeled layer produces one $\\cos$, and the bracket inside has one fewer $\\sin$ each time.",
    "why": "Copy the Chain Rule four times from the outside in and you're done; memorizing doesn't help, writing it in order keeps you from missing a layer.",
    "steps": [
      "Outermost: $\\cos(\\sin(\\sin(\\sin x)))\\cdot(\\sin(\\sin(\\sin x)))'$.",
      "Second layer: $\\cos(\\sin(\\sin x))\\cdot(\\sin(\\sin x))'$.",
      "Last two layers: $(\\sin(\\sin x))'=\\cos(\\sin x)\\cos x$.",
      "Multiply the four $\\cos$ factors."
    ],
    "trap": "Writing $\\cos(\\cos(\\cos(\\cos x)))$: differentiating replaces only the outermost layer with $\\cos$ and leaves the inside untouched; it doesn't change every layer.",
    "check": "Near $x=0$ each layer has $\\sin u\\approx u$, so the whole function is $\\approx x$ and the derivative at $x=0$ is $1$."
  },
  "ch-nest-011": {
    "spot": "Three layers: $e^u$, a square root, $\\ln(1+x^2)$. The root gives $\\frac{1}{2\\sqrt{\\cdot}}$, the innermost gives $2x$ — and the $2$ cancels.",
    "why": "Multiply the Chain Rule factors; cancel $\\frac{1}{2}\\cdot 2x$ right away and the answer is already in simplest form.",
    "steps": [
      "Outermost $e^u$: stays as $e^{\\sqrt{\\ln(1+x^2)}}$.",
      "Root: $\\frac{1}{2\\sqrt{\\ln(1+x^2)}}$; innermost $(\\ln(1+x^2))'=\\frac{2x}{1+x^2}$.",
      "Cancel the $2$: $\\left(\\sqrt{\\ln(1+x^2)}\\right)'=\\frac{x}{(1+x^2)\\sqrt{\\ln(1+x^2)}}$.",
      "Multiply by $e^{\\sqrt{\\ln(1+x^2)}}$."
    ],
    "trap": "Not cancelling the root's $\\frac{1}{2}$ against the inner $2x$, or dropping the $\\frac{1}{2}$ entirely, making the answer twice too big.",
    "check": "For small $x$, $\\sqrt{\\ln(1+x^2)}\\approx x$, so the function is $\\approx e^x$ and the derivative should be close to $1$."
  },
  "ch-nest-012": {
    "spot": "$\\ln(1+\\sqrt{1+\\sqrt{1+x}})$: one $\\ln$ outside, two roots inside; each root gives a $\\frac{1}{2\\sqrt{\\cdot}}$, and the two $\\frac12$ multiply to $\\frac14$.",
    "why": "Three layers of Chain Rule; line up the factors from outside in, and each of the three factors in the denominator matches one layer.",
    "steps": [
      "Outermost: $\\frac{1}{1+\\sqrt{1+\\sqrt{1+x}}}$.",
      "Middle: $\\left(\\sqrt{1+\\sqrt{1+x}}\\right)'=\\frac{1}{2\\sqrt{1+\\sqrt{1+x}}}\\cdot(\\sqrt{1+x})'$.",
      "Innermost: $(\\sqrt{1+x})'=\\frac{1}{2\\sqrt{1+x}}$.",
      "Multiply; the denominator is $4\\sqrt{1+x}\\sqrt{1+\\sqrt{1+x}}\\left(1+\\sqrt{1+\\sqrt{1+x}}\\right)$."
    ],
    "trap": "Writing only one $\\frac{1}{2}$, so the denominator gets $2$ instead of $4$.",
    "check": "Plug in $x=0$: the two roots are $1$ and $\\sqrt2$ in turn, and the answer is $\\frac{1}{4\\sqrt2\\,(1+\\sqrt2)}\\approx 0.0732$."
  },
  "ch-pow-003": {
    "spot": "Both the base $\\ln x$ and the exponent $\\tan x$ contain $x$: the variable is in the base and the exponent, so use logarithmic differentiation.",
    "why": "Neither the power rule (constant exponent) nor the exponential rule (constant base) applies; $\\ln y=\\tan x\\cdot\\ln(\\ln x)$ is a product, easy to differentiate.",
    "steps": [
      "Take logs: $\\ln y=\\tan x\\cdot\\ln(\\ln x)$ (for $x>1$).",
      "Product Rule: $\\frac{y'}{y}=\\sec^2x\\,\\ln(\\ln x)+\\tan x\\cdot\\frac{1}{x\\ln x}$.",
      "Multiply back by $y$: $y'=(\\ln x)^{\\tan x}\\left(\\frac{\\ln(\\ln x)}{\\cos^2x}+\\frac{\\tan x}{x\\ln x}\\right)$."
    ],
    "trap": "Using the power rule to write $\\tan x\\,(\\ln x)^{\\tan x-1}\\cdot\\frac{1}{x}$: that only covers the \"base is changing\" half and misses the $\\ln(\\ln x)\\sec^2x$ term from the changing exponent.",
    "check": "$x=e$: $\\ln x=1$, $y=1$, the first term has $\\ln 1=0$, and the answer reduces to $\\frac{\\tan e}{e}$."
  },
  "ch-pow-004": {
    "spot": "$(1+x^2)^{1/x}$: $x$ in both base and exponent; taking logs gives $\\ln y=\\frac{\\ln(1+x^2)}{x}$, a quotient.",
    "why": "Logarithmic differentiation brings the exponent down; after that it's just one Quotient Rule.",
    "steps": [
      "$\\ln y=\\frac{\\ln(1+x^2)}{x}$.",
      "Quotient Rule: $\\frac{y'}{y}=\\frac{\\frac{2x}{1+x^2}\\cdot x-\\ln(1+x^2)}{x^2}=\\frac{\\frac{2x^2}{1+x^2}-\\ln(1+x^2)}{x^2}$.",
      "Multiply back by $y$."
    ],
    "trap": "Forgetting to multiply back by $y=(1+x^2)^{1/x}$ after logarithmic differentiation, handing in only $\\frac{y'}{y}$.",
    "check": "$x=1$: $y=2$, $\\frac{y'}{y}=1-\\ln 2$, so $y'=2(1-\\ln 2)\\approx 0.614$."
  },
  "ch-pow-005": {
    "spot": "The outer layer is $e^u$, and the inner $u=x^x$ is the classic case with $x$ in both base and exponent: $(x^x)'=x^x(\\ln x+1)$.",
    "why": "The outer chain copies itself; the inner part uses logarithmic differentiation (or rewrite as $e^{x\\ln x}$).",
    "steps": [
      "Rewrite the inner part as $x^x=e^{x\\ln x}$, and $(x\\ln x)'=\\ln x+1$.",
      "So $(x^x)'=e^{x\\ln x}(\\ln x+1)=x^x(\\ln x+1)$.",
      "The outer $e^u$ stays as is: $(e^{x^x})'=e^{x^x}\\cdot x^x(\\ln x+1)$."
    ],
    "trap": "Writing $(x^x)'$ as $x\\cdot x^{x-1}=x^x$ (power rule) or $x^x\\ln x$ (exponential rule): each is only half right; the correct answer is their sum.",
    "check": "At $x=\\frac{1}{e}$, $\\ln x+1=0$ and the derivative is $0$ (the minimum point of $x^x$); at $x=1$ the derivative is $e$."
  },
  "ch-pow-006": {
    "spot": "$x^{e^x}$: both the base $x$ and the exponent $e^x$ vary; take logs, $\\ln y=e^x\\ln x$.",
    "why": "Logarithmic differentiation turns it into the product $e^x\\ln x$; two terms of the Product Rule and you're done.",
    "steps": [
      "$\\ln y=e^x\\ln x$.",
      "Product Rule: $\\frac{y'}{y}=e^x\\ln x+\\frac{e^x}{x}$.",
      "Multiply back by $y$: $y'=x^{e^x}e^x\\left(\\ln x+\\frac{1}{x}\\right)$."
    ],
    "trap": "Using the power rule to write $e^x\\,x^{e^x-1}$: that is only the \"base is changing\" term (exactly the $\\frac{e^x}{x}$ half of the answer), missing $e^x\\ln x$.",
    "check": "Plug in $x=1$: $y=1$ and $\\frac{y'}{y}=e(0+1)=e$, so the derivative is $e$."
  },
  "ch-pow-007": {
    "spot": "$(\\cos x)^{\\ln x}$: $x$ in both base and exponent; take logs, $\\ln y=\\ln x\\cdot\\ln(\\cos x)$.",
    "why": "Logarithmic differentiation gives a product; the second piece $(\\ln\\cos x)'=-\\tan x$ is a familiar one.",
    "steps": [
      "$\\ln y=\\ln x\\cdot\\ln(\\cos x)$ (for $0<x<\\frac{\\pi}{2}$).",
      "Product Rule: $\\frac{y'}{y}=\\frac{\\ln(\\cos x)}{x}+\\ln x\\cdot\\frac{-\\sin x}{\\cos x}$.",
      "Multiply back by $y$: $y'=(\\cos x)^{\\ln x}\\left(\\frac{\\ln\\cos x}{x}-\\ln x\\tan x\\right)$."
    ],
    "trap": "Dropping the inner $-\\sin x$ in $(\\ln\\cos x)'$ and writing $\\frac{1}{\\cos x}$.",
    "check": "$x=1$: $\\ln 1=0$, $y=1$, and the answer reduces to $\\ln(\\cos 1)\\approx -0.616$."
  },
  "ch-pow-008": {
    "spot": "$(\\arctan x)^x$: $x$ in both base and exponent — take logs, $\\ln y=x\\ln(\\arctan x)$.",
    "why": "Logarithmic differentiation gives a product; the $\\ln(\\arctan x)$ in the second term needs one more Chain Rule.",
    "steps": [
      "$\\ln y=x\\ln(\\arctan x)$ (for $x>0$).",
      "Chain Rule: $(\\ln\\arctan x)'=\\frac{1}{\\arctan x}\\cdot\\frac{1}{1+x^2}$.",
      "Product Rule: $\\frac{y'}{y}=\\ln(\\arctan x)+\\frac{x}{(1+x^2)\\arctan x}$.",
      "Multiply back by $y=(\\arctan x)^x$."
    ],
    "trap": "Writing $(\\ln\\arctan x)'$ as $\\frac{1}{\\arctan x}$, missing the $\\frac{1}{1+x^2}$.",
    "check": "Plug in $x=1$: $y=\\frac{\\pi}{4}$, and the derivative is $\\frac{\\pi}{4}\\ln\\frac{\\pi}{4}+\\frac{1}{2}\\approx 0.310$."
  },
  "ch-pow-009": {
    "spot": "$(\\sqrt x)^{\\sqrt x}$: base and exponent are the same $\\sqrt x$; after taking logs, $\\ln\\sqrt x=\\frac12\\ln x$, giving $\\frac{\\sqrt x}{2}\\ln x$.",
    "why": "Logarithmic differentiation; rewrite $\\ln\\sqrt x$ as $\\frac12\\ln x$ first and the Product Rule is clean.",
    "steps": [
      "$\\ln y=\\sqrt x\\cdot\\ln\\sqrt x=\\frac{\\sqrt x}{2}\\ln x$.",
      "Product Rule: $\\frac{y'}{y}=\\frac{1}{4\\sqrt x}\\ln x+\\frac{\\sqrt x}{2}\\cdot\\frac{1}{x}=\\frac{\\ln x}{4\\sqrt x}+\\frac{1}{2\\sqrt x}$.",
      "Multiply back by $y=(\\sqrt x)^{\\sqrt x}$."
    ],
    "trap": "Writing $(\\sqrt x)'$ as $\\frac{1}{\\sqrt x}$ and losing the $\\frac12$, so the first term becomes $\\frac{\\ln x}{2\\sqrt x}$.",
    "check": "$\\frac{\\ln x}{4}+\\frac12=0$, i.e. $x=e^{-2}$, gives derivative $0$ ($u^u$ is smallest at $u=\\sqrt x=\\frac1e$); at $x=1$ it is $\\frac12$."
  },
  "cx-hi-001": {
    "spot": "The denominator is $(1+x^2)^2$: a power of $1+x^2$ signals the trigonometric substitution $x=\\tan\\theta$, since $1+\\tan^2\\theta=\\sec^2\\theta$.",
    "why": "After substituting, the integrand becomes $\\cos^2\\theta$, which a half-angle formula finishes off; partial fractions can't split $1+x^2$ over the reals.",
    "steps": [
      "$x=\\tan\\theta$, $dx=\\sec^2\\theta\\,d\\theta$, $(1+x^2)^2=\\sec^4\\theta$; $x:0\\to\\infty$ corresponds to $\\theta:0\\to\\frac{\\pi}{2}$.",
      "The integrand becomes $\\frac{\\sec^2\\theta}{\\sec^4\\theta}=\\cos^2\\theta=\\frac{1+\\cos 2\\theta}{2}$.",
      "$\\int_0^{\\pi/2}\\frac{1+\\cos 2\\theta}{2}\\,d\\theta=\\frac{\\pi}{4}+0=\\frac{\\pi}{4}$.",
      "So the original integral $=\\frac{\\pi}{4}$."
    ],
    "trap": "Treating it as $\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$ and forgetting the square; or forgetting the $\\sec^2\\theta$ from $dx$ after substituting and getting $\\int\\cos^4\\theta$.",
    "check": "$\\frac{1}{(1+x^2)^2}\\le\\frac{1}{1+x^2}$, so the answer must be less than $\\frac{\\pi}{2}$; the antiderivative $\\frac{x}{2(1+x^2)}+\\frac{\\arctan x}{2}$ tends to $\\frac{\\pi}{4}$ at infinity."
  },
  "db-chain-009": {
    "spot": "$\\ln$ inside $\\ln$, with $x^2+2$ inside that: three layers of chain, and each $\\ln$ gives a reciprocal.",
    "why": "Copy the Chain Rule layer by layer from the outside in: $\\frac{1}{\\ln(x^2+2)}\\cdot\\frac{1}{x^2+2}\\cdot 2x$, no expanding needed.",
    "steps": [
      "Outer: $(\\ln u)'=\\frac{1}{u}$, $u=\\ln(x^2+2)$.",
      "Middle and inner: $(\\ln(x^2+2))'=\\frac{2x}{x^2+2}$.",
      "Multiply: $\\frac{2x}{(x^2+2)\\ln(x^2+2)}$."
    ],
    "trap": "Differentiating only one $\\ln$ and writing $\\frac{1}{\\ln(x^2+2)}$; or mistaking $\\ln(\\ln u)$ for $(\\ln u)^2$.",
    "check": "The original function is even, so the derivative at $x=0$ must be $0$; the answer is indeed $0$ at $x=0$."
  },
  "db-chain-010": {
    "spot": "A root inside a root inside a root: every layer is $\\sqrt{x+\\text{inner}}$, with exactly the same derivative pattern — $\\frac{1+(\\text{inner})'}{2\\sqrt{\\cdot}}$.",
    "why": "Write the Chain Rule recursively three times; computing each layer's derivative from the inside out first, then substituting, keeps it tidy.",
    "steps": [
      "Innermost: $(\\sqrt x)'=\\frac{1}{2\\sqrt x}$.",
      "Middle: $\\left(\\sqrt{x+\\sqrt x}\\right)'=\\frac{1+\\frac{1}{2\\sqrt x}}{2\\sqrt{x+\\sqrt x}}$.",
      "Outermost: $\\frac{1+\\left(\\sqrt{x+\\sqrt x}\\right)'}{2\\sqrt{x+\\sqrt{x+\\sqrt x}}}$.",
      "Substitute the middle result to get the answer."
    ],
    "trap": "Dropping the $1$ in $\\left(x+\\sqrt{\\cdots}\\right)'$ and writing only the derivative of the inner root.",
    "check": "For large $x$ the function is $\\approx\\sqrt x$, so the derivative should be close to $\\frac{1}{2\\sqrt x}$; at $x=10000$ that is about $0.005$."
  },
  "db-ext-009": {
    "spot": "\"The $c$ satisfying the Mean Value Theorem\": compute the average slope between the endpoints, solve $f'(c)=$ that slope, then keep the root inside $(1,3)$.",
    "why": "$f$ is a polynomial, so $f'(c)=12$ is a quadratic equation; just solve it.",
    "steps": [
      "Average slope: $\\frac{f(3)-f(1)}{3-1}=\\frac{24-0}{2}=12$.",
      "$f'(c)=3c^2-1=12\\Rightarrow c^2=\\frac{13}{3}$.",
      "$c=\\pm\\sqrt{\\frac{13}{3}}\\approx\\pm 2.08$; only the positive root lies in $(1,3)$.",
      "$c=\\sqrt{\\frac{13}{3}}$."
    ],
    "trap": "Handing in both roots, or using $\\frac{f(3)-f(1)}{3}$ (wrong interval length) and getting $c^2=3$.",
    "check": "$\\sqrt{13/3}\\approx 2.08$, near the midpoint $2$ but to the right of it, because $f'$ is increasing and the slope $12$ is bigger than $f'(2)=11$."
  },
  "db-tay-007": {
    "spot": "$\\frac{1}{1+x^2}$ is the geometric series $\\frac{1}{1-u}$ with $u=-x^2$: the coefficient of $x^6$ times $6!$ is $f^{(6)}(0)$.",
    "why": "Differentiating the quotient six times directly blows up; reading the Maclaurin coefficient $a_6=\\frac{f^{(6)}(0)}{6!}$ backwards takes one line.",
    "steps": [
      "$\\frac{1}{1+x^2}=1-x^2+x^4-x^6+\\cdots$; cutting off at $x^6$, the remainder is exactly $\\frac{x^8}{1+x^2}$.",
      "The coefficient of $x^6$ is $a_6=-1$, and $a_6=\\frac{f^{(6)}(0)}{6!}$.",
      "$f^{(6)}(0)=-1\\cdot 720=-720$."
    ],
    "trap": "Giving the coefficient $-1$ as the answer and forgetting to multiply by $6!$; or using $3!$ (because it is $(x^2)^3$) and getting $-6$.",
    "check": "Same trick for the second derivative: $a_2=-1$, $f''(0)=-1\\cdot 2!=-2$, matching direct differentiation."
  },
  "dm-int-011": {
    "spot": "The integrand has $\\ln x$ and $\\frac{dx}{1+x^2}$ on $[0,\\infty)$: $x\\mapsto\\frac1x$ leaves $\\frac{dx}{1+x^2}$ unchanged and flips the sign of $\\ln x$, so the two halves split at $1$ cancel.",
    "why": "This integral has no elementary antiderivative; the symmetric substitution shows the total is $0$ without computing either half.",
    "steps": [
      "Split into $[0,1]$ and $[1,\\infty)$. On the second half let $x=\\frac1u$, $dx=-\\frac{du}{u^2}$, $\\ln x=-\\ln u$.",
      "So $\\int_1^\\infty\\frac{\\ln x}{1+x^2}dx=-\\int_0^1\\frac{\\ln u}{1+u^2}du$.",
      "The two halves have the same size and opposite signs (the first half is negative, about $-0.916$).",
      "They add to $0$."
    ],
    "trap": "Seeing $\\ln x$ tend to $-\\infty$ near $0$ and calling it divergent; the singularity of $\\ln x$ is integrable ($\\int_0^1\\ln x\\,dx=-1$), and the tail $\\frac{\\ln x}{x^2}$ is integrable too.",
    "check": "The substitution sends $[1,50]$ to $[\\frac{1}{50},1]$: the integrals over the two finite intervals are exact negatives of each other, as confirmed numerically in the step above."
  },
  "dm-seq-003": {
    "spot": "$n\\int_0^1x^n f(x)\\,dx$: for large $n$, $x^n$ is essentially $0$ except near $x=1$, and $n\\int_0^1x^n\\,dx\\to 1$ — the integral only \"sees\" $f(1)$.",
    "why": "Write $f(x)$ as $f(1)+[f(x)-f(1)]$: the first part is computed exactly, the second is pushed to $0$ using $|f(x)-f(1)|\\le C(1-x)$; this is easier to make rigorous than substituting $x=1-\\frac tn$.",
    "steps": [
      "Main part: $n\\int_0^1x^n\\,dx=\\frac{n}{n+1}\\to 1$.",
      "Difference: $f(x)-f(1)=\\frac{1}{1+x^2}-\\frac12=\\frac{(1-x)(1+x)}{2(1+x^2)}$, and $\\frac{1+x}{2(1+x^2)}<1$, so $|f(x)-f(1)|\\le 1-x$.",
      "Error term: $n\\int_0^1x^n(1-x)\\,dx=\\frac{n}{(n+1)(n+2)}\\to 0$.",
      "So the limit $=f(1)\\cdot 1=\\frac12$."
    ],
    "trap": "Seeing $x^n\\to 0$ (for $x<1$) and saying the integral tends to $0$ so the limit is $0$: the factor $n$ in front exactly compensates; this is a $0\\cdot\\infty$ form.",
    "check": "Actual computation at $n=50$: $50\\int_0^1\\frac{x^{50}}{1+x^2}dx\\approx 0.4998$, already very close to $\\frac12$."
  },
  "dm-ser-001": {
    "spot": "The problem gives $\\frac{1}{\\binom{2n}{n}}=(2n+1)\\int_0^1t^n(1-t)^n\\,dt$: move the sum inside the integral, and it becomes the power series $\\sum(2n+1)u^n$ in $u=t(1-t)$, which has a closed form.",
    "why": "There is no direct summation formula for reciprocals of central binomial coefficients; the integral representation turns $t^n(1-t)^n$ into a geometric-type series, and $u\\le\\frac14$ guarantees we can swap sum and integral.",
    "steps": [
      "Check the integral representation, e.g. $n=3$: $\\binom{6}{3}=20$, $7\\int_0^1t^3(1-t)^3dt=\\frac{1}{20}$.",
      "Power series: $\\sum_{n\\ge1}(2n+1)u^n=\\frac{2u}{(1-u)^2}+\\frac{u}{1-u}=\\frac{u(3-u)}{(1-u)^2}$; example $u=0.2$.",
      "Swap sum and integral: $S=\\int_0^1\\frac{u(3-u)}{(1-u)^2}dt$, $u=t(1-t)$; split as $-1-\\frac{1}{1-u}+\\frac{2}{(1-u)^2}$.",
      "$1-u=t^2-t+1$: $\\int_0^1\\frac{dt}{t^2-t+1}=\\frac{2\\sqrt3\\pi}{9}$, $\\int_0^1\\frac{dt}{(t^2-t+1)^2}=\\frac23+\\frac{4\\sqrt3\\pi}{27}$.",
      "Combine: $S=-1-\\frac{2\\sqrt3\\pi}{9}+\\frac43+\\frac{8\\sqrt3\\pi}{27}=\\frac13+\\frac{2\\sqrt3\\pi}{27}\\approx 0.7364$."
    ],
    "trap": "Starting the power series at $n=0$, which adds the extra term $(2\\cdot0+1)u^0=1$ and makes the answer too big by $1$.",
    "check": "The first six terms $\\frac12+\\frac16+\\frac1{20}+\\frac1{70}+\\frac1{252}+\\frac1{924}\\approx 0.7361$; it's a positive series, so the partial sum is slightly below the answer."
  },
  "dx-calc-003": {
    "spot": "$x^3+y^3=6xy$ can't be solved for $y$: use implicit differentiation, and remember $6xy$ needs the Product Rule.",
    "why": "Differentiate both sides with respect to $x$ and collect $y'$ on one side; plugging in the numbers only at the point is the least work.",
    "steps": [
      "First confirm the point is on the curve: $27+27=54=6\\cdot3\\cdot3$.",
      "Differentiate: $3x^2+3y^2y'=6y+6xy'$, so $y'=\\frac{2y-x^2}{y^2-2x}$.",
      "At $(3,3)$: $y'=\\frac{6-9}{9-6}=-1$."
    ],
    "trap": "Differentiating $6xy$ as just $6xy'$ and missing $6y$: you get $27+27y'=18y'$, so $y'=-3$.",
    "check": "Using the parametrization $x=\\frac{6t}{1+t^3}$, $y=\\frac{6t^2}{1+t^3}$ ($t=1$ gives $(3,3)$) and computing $\\frac{dy/dt}{dx/dt}$ also gives $-1$."
  },
  "dx-eco-002": {
    "spot": "Demand is exponential, $q=1200e^{-0.05p}$: $q'=-0.05q$, and in the elasticity formula $q$ cancels completely, leaving $0.05p$.",
    "why": "The logarithmic derivative of an exponential is constant, so the elasticity is just $=0.05p$; you don't even need the $1200$.",
    "steps": [
      "$q'(p)=1200\\cdot(-0.05)e^{-0.05p}=-0.05\\,q(p)$.",
      "$E=-\\frac{p\\,q'}{q}=-\\frac{p(-0.05q)}{q}=0.05p$.",
      "$p=30$: $E=1.5$."
    ],
    "trap": "Dropping the minus sign in front of the formula and answering $-1.5$; or computing $q(30)$ and $q'(30)$ numerically and then dividing, which just invites arithmetic errors.",
    "check": "A $1\\%$ price increase ($30\\to30.3$) cuts demand by about $1.5\\%$: $e^{-0.015}\\approx 0.985$."
  },
  "dx-rr-001": {
    "spot": "Conical tank: the water surface radius and depth stay in a fixed ratio $r=\\frac{3}{6}h=\\frac h2$; eliminate $r$ first so the volume depends on $h$ alone, then differentiate with respect to $t$.",
    "why": "Use similar triangles to eliminate $r$ first; otherwise you have to handle $\\frac{dr}{dt}$ and $\\frac{dh}{dt}$ together.",
    "steps": [
      "Similar triangles: $r=\\frac h2$, $V=\\frac13\\pi r^2h=\\frac{\\pi h^3}{12}$.",
      "Differentiate with respect to $t$: $\\frac{dV}{dt}=\\frac{\\pi h^2}{4}\\frac{dh}{dt}$.",
      "$h=4$: $\\frac{\\pi\\cdot16}{4}=4\\pi$, so $2=4\\pi\\frac{dh}{dt}$.",
      "$\\frac{dh}{dt}=\\frac{2}{4\\pi}=\\frac{1}{2\\pi}\\approx 0.159$ m/min."
    ],
    "trap": "Inverting the ratio to $r=2h$, which gives $V=\\frac{4\\pi h^3}{3}$ and $\\frac{dh}{dt}=\\frac{1}{32\\pi}$; or plugging in $h=4$ before differentiating and getting $0$.",
    "check": "Rate of rise $=$ inflow rate $\\div$ surface area: at $h=4$, $r=2$, area $4\\pi$, and $\\frac{2}{4\\pi}$ agrees."
  },
  "dx-rr-002": {
    "spot": "The perpendicular distance from the radar to the runway, $500$, is fixed while the plane's distance $x$ along the runway changes: a right triangle, and the angle $\\theta$ between the line of sight and the runway satisfies $\\tan\\theta=\\frac{500}{x}$.",
    "why": "Write the angle as $\\theta=\\arctan\\frac{500}{x}$ and chain to $t$; done in one step.",
    "steps": [
      "$\\theta=\\arctan\\frac{500}{x}$, $\\frac{d\\theta}{dx}=-\\frac{500}{x^2+500^2}$.",
      "$x=500$: $\\frac{d\\theta}{dx}=-\\frac{500}{500000}=-\\frac{1}{1000}$.",
      "Chain with $\\frac{dx}{dt}=200$: $\\frac{d\\theta}{dt}=-0.2$ rad/s."
    ],
    "trap": "Measuring the wrong angle (the one with the perpendicular, $\\tan\\theta=\\frac{x}{500}$) and getting $+0.2$: as the plane flies away this angle should shrink, so the sign must be negative.",
    "check": "When the plane is directly opposite, $\\theta=90^\\circ$, and far away $\\theta\\to0$, so $\\theta$ is decreasing; $x=500$ is $45^\\circ$, $\\cos^2\\theta=\\frac12$, $|\\dot\\theta|=\\frac12\\cdot\\frac{200}{500}=0.2$."
  },
  "dx-tan-002": {
    "spot": "\"Draw a tangent line from the origin\": the point of tangency is unknown, so call it $(a,\\ln a)$, write the tangent line, require it to pass through the origin, and solve for $a$.",
    "why": "Parametrizing the point of tangency is the standard way to draw a tangent from an outside point; guessing the tangent line first and then hunting for the point is roundabout.",
    "steps": [
      "Tangent line: $y-\\ln a=\\frac1a(x-a)$.",
      "Through the origin: $0-\\ln a=\\frac1a(0-a)=-1$, so $\\ln a=1$.",
      "$a=e$, and the tangent line is $y=\\frac xe$."
    ],
    "trap": "Just taking the tangent at $x=1$ (where $\\ln x$ crosses the $x$-axis), $y=x-1$: it passes through $(0,-1)$, not the origin.",
    "check": "$\\ln x$ is concave, so the tangent line lies above the curve: $\\ln x\\le\\frac xe$, with equality only at $x=e$."
  },
  "dx-thm-002": {
    "spot": "$28$ is close to the perfect cube $27$: linearize $f(x)=\\sqrt[3]x$ at $a=27$, where $f(27)=3$ and $f'(27)$ is easy too.",
    "why": "With a perfect cube as the base point, the function value and derivative are simple fractions; one line by hand.",
    "steps": [
      "$f(27)=3$; $f'(x)=\\frac{1}{3}x^{-2/3}$.",
      "$27^{2/3}=9$, so $f'(27)=\\frac{1}{3\\cdot9}=\\frac1{27}$.",
      "$L(x)=3+\\frac{1}{27}(x-27)$, $L(28)=3+\\frac1{27}=\\frac{82}{27}$."
    ],
    "trap": "Computing $27^{-2/3}$ as $\\frac13$, or as $\\frac19$ while dropping the leading $\\frac13$, and getting $3\\frac13$ or $3\\frac19$.",
    "check": "$\\sqrt[3]{x}$ is concave, so the tangent line lies above it, and $\\frac{82}{27}\\approx 3.0370$ is slightly more than the true value $3.0366$."
  },
  "dx-thm-003": {
    "spot": "\"Estimate the error with differentials\": $dV=V'(r)\\,dr$ with $r=10$, $dr=0.05$.",
    "why": "The differential gives a first-order approximation, so you don't need to cube anything for $V(10.05)-V(10)$.",
    "steps": [
      "Volume $V=\\frac43\\pi r^3$, differential $dV=V'(r)\\,dr=4\\pi r^2\\,dr$ (exactly surface area times thickness).",
      "$r=10$: $V'(10)=400\\pi$.",
      "$dV=400\\pi\\times0.05=20\\pi\\approx 62.8$ cubic cm."
    ],
    "trap": "Dropping the $3$ that comes down from the power in $V'$, writing $\\frac43\\pi r^2$ and getting $\\frac{20\\pi}{3}$.",
    "check": "The actual difference $V(10.05)-V(10)\\approx 63.1$ is slightly more than $20\\pi$ ($V$ curves upward), off by less than $1$."
  },
  "dx-thm-005": {
    "spot": "$x^{2/3}=(\\sqrt[3]x)^2$: the exponent $\\frac23<1$, so it is continuous at $0$ but the derivative $\\frac23x^{-1/3}$ blows up at $0$, with opposite signs on the two sides — a cusp.",
    "why": "Differentiability depends on the one-sided limits of the difference quotient $\\frac{f(h)-f(0)}{h}=h^{-1/3}$; they go to $+\\infty$ and $-\\infty$ respectively.",
    "steps": [
      "Continuous: $\\lim_{x\\to0}x^{2/3}=0=f(0)$.",
      "Right-hand difference quotient $\\frac{h^{2/3}}{h}=h^{-1/3}$: $10$ at $h=10^{-3}$, $100$ at $h=10^{-6}$, heading to $+\\infty$.",
      "The left-hand difference quotient heads to $-\\infty$; e.g. $-10$ at $h=-10^{-3}$.",
      "The difference quotient has no finite limit, so it is continuous but not differentiable at $x=0$ (the graph has a cusp at the origin)."
    ],
    "trap": "Applying the power rule to write $f'(0)=\\frac23\\cdot0^{-1/3}$ and stopping there, or saying \"$=0$\": $0^{-1/3}$ doesn't exist, and the rule doesn't apply at this point.",
    "check": "Compare with $x^{4/3}$: the difference quotient $h^{1/3}\\to0$, so it is differentiable at $0$; only an exponent greater than $1$ makes the graph smooth at the origin."
  },
  "fd-serb-604": {
    "spot": "Numerator $n^2$, denominator $n!$, alternating sign: split $n^2$ as $n(n-1)+n$, cancel against $n!$, and each piece is a series for $e^{-1}$.",
    "why": "$\\frac{n(n-1)}{n!}=\\frac{1}{(n-2)!}$, $\\frac{n}{n!}=\\frac{1}{(n-1)!}$, and shifting the index brings you back to $\\sum\\frac{(-1)^m}{m!}=e^{-1}$; faster than differentiating a generating function twice.",
    "steps": [
      "$\\frac{n^2}{n!}=\\frac{1}{(n-2)!}+\\frac{1}{(n-1)!}$ (for $n\\ge2$); example $n=5$: $\\frac{25}{120}=\\frac16+\\frac1{24}$.",
      "Second piece: $\\sum_{n\\ge1}\\frac{(-1)^{n+1}}{(n-1)!}=\\sum_{m\\ge0}\\frac{(-1)^m}{m!}=e^{-1}$ (look at the first seven terms).",
      "First piece: $\\sum_{n\\ge2}\\frac{(-1)^{n+1}}{(n-2)!}=-\\sum_{m\\ge0}\\frac{(-1)^m}{m!}=-e^{-1}$.",
      "Add: $-e^{-1}+e^{-1}=0$."
    ],
    "trap": "When shifting the index in the first piece, losing the minus sign in $(-1)^{n+1}=(-1)^{m+3}=-(-1)^m$, so the two pieces have the same sign and you get $\\frac2e$.",
    "check": "The first eight terms $1-2+\\frac32-\\frac23+\\frac{5}{24}-\\frac1{20}+\\frac{49}{5040}-\\frac{64}{40320}\\approx -0.0002$, indeed heading to $0$."
  },
  "fd-serx-504": {
    "spot": "Odd numbers $2n+1$ in the denominator, alternating sign, times $3^{-n}$: this is the shape of $\\arctan y=\\sum\\frac{(-1)^ny^{2n+1}}{2n+1}$ with $y^2=\\frac13$.",
    "why": "$\\frac{1}{3^n}=y^{2n}$, missing just one $y$; supply the $\\frac{1}{\\sqrt3}$ and it is $\\arctan\\frac1{\\sqrt3}=\\frac\\pi6$.",
    "steps": [
      "Take $y=\\frac{1}{\\sqrt3}$: $y^{2n+1}=\\frac{1}{\\sqrt3\\cdot3^n}$.",
      "So the series $=\\sqrt3\\sum\\frac{(-1)^ny^{2n+1}}{2n+1}=\\sqrt3\\arctan\\frac1{\\sqrt3}$.",
      "$=\\sqrt3\\cdot\\frac\\pi6=\\frac{\\sqrt3\\pi}{6}\\approx 0.9069$."
    ],
    "trap": "Treating $\\frac1{3^n}$ as $y^n$ and taking $y=\\frac13$, getting something like $\\arctan\\frac13$; in the $\\arctan$ series the power of $y$ is $2n+1$.",
    "check": "The first three terms give $1-\\frac19+\\frac1{45}\\approx 0.911$; it's an alternating series, so the answer lies between consecutive partial sums."
  },
  "fd-serx-601": {
    "spot": "$\\sum\\frac{1}{n^{8}}$ with an even exponent: Euler's formula for even zeta values $\\zeta(2k)=\\frac{(-1)^{k+1}B_{2k}(2\\pi)^{2k}}{2(2k)!}$ gives a rational multiple of $\\pi^8$ directly.",
    "why": "Even $\\zeta$ values have a closed form, odd ones don't; with an even power, apply the formula, with $B_8=-\\frac1{30}$.",
    "steps": [
      "$k=4$: $\\zeta(8)=\\frac{\\frac1{30}\\cdot2^8\\pi^8}{2\\cdot8!}$, where $8!=40320$.",
      "Coefficient: $\\frac{256}{30\\cdot2\\cdot40320}=\\frac1{9450}$.",
      "The same formula with $k=2$ gives $\\zeta(4)=\\frac{\\pi^4}{90}$ ($B_4=-\\frac1{30}$), a handy check that you copied the formula correctly.",
      "So $\\zeta(8)=\\frac{\\pi^8}{9450}\\approx 1.00408$."
    ],
    "trap": "Thinking $\\zeta(8)=\\zeta(2)^4=\\frac{\\pi^8}{1296}$: $\\zeta$ is not multiplicative like that; that number is about $7.3$, far bigger than $1.004$.",
    "check": "The first two terms $1+\\frac1{256}\\approx1.0039$ are almost everything; the answer is just a bit more."
  },
  "gp-001": {
    "spot": "$g(4)=\\int_0^4f$ is the area under the broken line, and the broken line $(0,0)\\to(2,4)\\to(4,0)$ encloses a triangle with the $x$-axis.",
    "why": "Geometric area at a glance; no need to write a piecewise function.",
    "steps": [
      "Left piece $f=2t$ ($0\\le t\\le2$), area $4$.",
      "Right piece $f=8-2t$ ($2\\le t\\le4$), area $4$.",
      "Together it is a triangle with base $4$ and height $4$: $\\frac12\\cdot4\\cdot4=8$."
    ],
    "trap": "Forgetting the triangle's $\\frac12$ and answering $16$; or reading $g(4)$ as $f(4)=0$.",
    "check": "The average height of $f$ on $[0,4]$ is $2$; times the width $4$ gives $8$."
  },
  "gp-003": {
    "spot": "$g''=f'$: the concavity of $g$ is set by whether $f$ rises or falls, so the inflection point of $g$ is where $f$ turns — the vertex of the broken line, $x=2$.",
    "why": "The Fundamental Theorem of Calculus gives $g'=f$, and differentiating again gives $g''=f'$; you can read the graph without integrating to get $g$.",
    "steps": [
      "$g'=f$, $g''=f'$. $f$ has slope $2$ on $(0,2)$ and slope $-2$ on $(2,4)$.",
      "Integrating explicitly: for $x\\le2$, $g=x^2$ (concave up); for $x\\ge2$, $g=8x-x^2-8$ (concave down); they match at $x=2$.",
      "Concavity changes at $x=2$, so the inflection point is $x=2$."
    ],
    "trap": "Looking for where $f=0$ ($x=0$ or $4$): that is where $g'=0$, which gives critical points of $g$, not inflection points.",
    "check": "An inflection point is also an extremum of $g'$: $g'=f$ is largest at $x=2$, where $g$ grows fastest."
  },
  "gp-004": {
    "spot": "It asks for \"displacement\": $\\int_0^6v\\,dt$ is signed area — above the axis counts positive, below counts negative; just add.",
    "why": "The piecewise-linear velocity graph splits into three triangles; adding their signed areas is faster than writing a piecewise function.",
    "steps": [
      "$[0,2]$: $v=4-2t$, a triangle above the axis, area $+4$.",
      "$[2,5]$: $v=-\\frac23(t-2)$, a triangle below the axis with base $3$ and height $2$, area $-3$.",
      "$[5,6]$: $v=2(t-6)$, area $-1$.",
      "Displacement $=4-3-1=0$."
    ],
    "trap": "Adding all areas as positive to get $8$ — that is total distance, not displacement.",
    "check": "Forward $4$, back $3+1=4$, ending at the start, so a displacement of $0$ makes sense."
  },
  "gp-011": {
    "spot": "$g'=f$: the maximum of $g$ is where $f$ changes from positive to negative. The broken line crosses the $x$-axis at $x=3$ on the segment $(2,2)\\to(4,-2)$.",
    "why": "Use the sign change of $f$ to find the candidate, then count areas to get $g$; compare with the endpoints too.",
    "steps": [
      "Middle segment $f=6-2x$, zero at $x=3$; $f>0$ before and $f<0$ after, so $g$ switches from increasing to decreasing at $x=3$.",
      "$g(3)$: rectangle $2\\times2=4$ plus triangle $\\frac12\\cdot1\\cdot2=1$.",
      "Endpoints: $g(0)=0$, $g(6)=4+1-1-4=0$, both less than $5$.",
      "Maximum $g(3)=5$."
    ],
    "trap": "Thinking the max is at $x=2$ where $f$ starts to drop and answering $g(2)=4$: while $f$ is falling but still positive, $g$ keeps increasing.",
    "check": "Whether $g$ rises or falls depends only on the sign of $f$: positive on $[0,3]$, negative on $[3,6]$, so $g$ rises then falls, and the max must be at $x=3$."
  },
  "lm-os-008": {
    "spot": "As $x\\to0^+$, the base $\\sin x\\to0$ and the exponent $\\tan x\\to0$: a $0^0$ form; take logs to get $\\tan x\\ln\\sin x$.",
    "why": "Always take logs first for exponential indeterminate forms; $\\tan x\\ln\\sin x\\approx x\\ln x$, and $x\\ln x\\to0$ is a standard result.",
    "steps": [
      "$\\ln y=\\tan x\\cdot\\ln\\sin x=\\frac{\\sin x\\ln\\sin x}{\\cos x}$.",
      "Let $u=\\sin x\\to0^+$: $u\\ln u\\to0$, and the denominator $\\cos x\\to1$.",
      "So $\\ln y\\to0$ and $y\\to e^0=1$."
    ],
    "trap": "Answering $0$ because the base tends to $0$, or answering $1$ because the exponent tends to $0$ without justification: $0^0$ is an indeterminate form, and you need $x\\ln x\\to0$ to conclude.",
    "check": "$x=0.01$: $(\\sin 0.01)^{\\tan 0.01}\\approx e^{0.01\\ln0.01}\\approx0.955$, slowly climbing toward $1$."
  },
  "lm-st-005": {
    "spot": "$\\sum_{k=1}^n\\ln k$ is a sum of the increasing function $\\ln x$ at integer points: squeeze it with the integral $\\int_1^n\\ln x\\,dx=n\\ln n-n+1$.",
    "why": "$\\ln(n!)$ has no closed form, but we only need the main term $n\\ln n$; comparing with an integral gives upper and lower bounds, lighter than bringing out Stirling's formula.",
    "steps": [
      "Antiderivative: $\\int\\ln x\\,dx=x\\ln x-x$, so $\\int_1^n\\ln x\\,dx=n\\ln n-n+1$.",
      "$\\ln x$ is increasing: $\\int_1^n\\ln x\\,dx\\le\\sum_{k=1}^n\\ln k\\le\\int_1^n\\ln x\\,dx+\\ln n$. Example $n=10$: $\\ln(10!)=\\ln 3628800\\approx15.10$, between $14.03$ and $16.33$.",
      "Divide by $n\\ln n$: the lower bound is $1-\\frac{1}{\\ln n}+\\frac{1}{n\\ln n}$ and the upper bound adds $\\frac1n$; both $\\to1$, though $\\frac1{\\ln n}$ goes to zero very slowly.",
      "By the Squeeze Theorem the limit $=1$."
    ],
    "trap": "Using only $\\ln k\\le\\ln n$ to get \"$\\le1$\" and declaring the limit is $1$: an upper bound alone isn't enough; you also need a lower bound tending to $1$.",
    "check": "At $n=10$ the ratio is only $\\frac{15.10}{23.03}\\approx0.66$: the error behaves like $\\frac1{\\ln n}$, so convergence is very slow, but it is heading the right way."
  },
  "lx-app-010": {
    "spot": "$\\frac n2\\sin\\frac{2\\pi}{n}$: let $t=\\frac{2\\pi}{n}\\to0$, and the expression becomes $\\pi\\cdot\\frac{\\sin t}{t}$, a standard limit.",
    "why": "Once it's $\\frac{\\sin t}{t}\\to1$ you're done; geometrically, this is polygons approximating a circle.",
    "steps": [
      "$n=\\frac{2\\pi}{t}$: $\\frac n2\\sin\\frac{2\\pi}n=\\frac{\\pi}{t}\\sin t=\\pi\\cdot\\frac{\\sin t}{t}$.",
      "$\\frac{\\sin t}{t}\\to1$.",
      "The area tends to $\\pi$ (the area of the unit circle)."
    ],
    "trap": "Seeing $\\sin\\frac{2\\pi}{n}\\to0$ and saying the area tends to $0$: the $n$ in front goes to infinity, so it is an $\\infty\\cdot0$ form.",
    "check": "Regular hexagon: $3\\sin60^\\circ\\approx2.598$; at $n=100$, $\\approx3.1395$, approaching $\\pi$ from below."
  },
  "lx-app-011": {
    "spot": "Each bounce height is multiplied by $0.6$: a geometric series; and each bounce goes \"up and back down\", so its distance counts twice.",
    "why": "Count the first $2$ m drop separately; after that every height is traveled twice, and a geometric series sum finishes it.",
    "steps": [
      "Bounce heights $1.2,\\ 0.72,\\ 0.432,\\ldots$, first term $1.2$, ratio $0.6$: sum $=\\frac{1.2}{1-0.6}=3$.",
      "Each height is traveled once up and once down: $2\\times3=6$.",
      "Add the first drop of $2$: total distance $8$ m."
    ],
    "trap": "Forgetting that each bounce goes up and comes back down, and computing $\\frac{2}{1-0.6}=5$.",
    "check": "The first four legs $2+2.4+1.44+0.864\\approx6.70$, still growing but never above $8$."
  },
  "lx-app-012": {
    "spot": "$\\left(1-\\frac1n\\right)^n$: base tends to $1$, exponent to infinity, a $1^\\infty$ form — just the definition of $e$ with a different sign.",
    "why": "Take logs, $n\\ln(1-\\frac1n)\\to-1$, or just remember $\\left(1+\\frac an\\right)^n\\to e^a$ with $a=-1$.",
    "steps": [
      "For a $1^\\infty$ form take logs first: $\\ln\\left(1-\\frac1n\\right)^n=n\\ln\\left(1-\\frac1n\\right)$.",
      "Use $\\ln(1-u)\\approx-u$ (with $u=\\frac1n$), so $n\\ln\\left(1-\\frac1n\\right)\\to-1$.",
      "So the limit is $=e^{-1}\\approx0.368$ times the original amount."
    ],
    "trap": "\"Each time you pour out only a little, so the number of times doesn't matter\" and answering $1$; or \"pouring out $\\frac1n$ a total of $n$ times empties it\" and answering $0$. For a $1^\\infty$ form both intuitions are wrong.",
    "check": "$n=10$: $0.9^{10}\\approx0.349$, a bit less than $\\frac1e$, and it creeps up toward it as $n$ grows."
  },
  "lx-hard-004": {
    "spot": "Base $\\cos\\sqrt x\\to1$, exponent $\\frac1x\\to\\infty$: a $1^\\infty$ form. $\\cos\\sqrt x\\approx1-\\frac x2$, so the log is roughly $\\frac{-x/2}{x}$.",
    "why": "After taking logs, use the leading Taylor terms $\\cos u\\approx1-\\frac{u^2}{2}$ and $\\ln(1+w)\\approx w$; cleaner than L'Hôpital's Rule.",
    "steps": [
      "Take logs: $\\ln y=\\frac{\\ln\\cos\\sqrt x}{x}$.",
      "$\\cos\\sqrt x=1-\\frac x2+O(x^2)$, $\\ln\\cos\\sqrt x\\approx-\\frac x2$, so the ratio $\\to-\\frac12$.",
      "Limit $=e^{-1/2}\\approx0.6065$."
    ],
    "trap": "Answering $1$ because the base tends to $1$: $1^\\infty$ is an indeterminate form.",
    "check": "$x=0.01$: $(\\cos0.1)^{100}\\approx0.6058$, already very close to $0.6065$."
  },
  "lx-seq-002": {
    "spot": "The continued fraction goes on forever, and beneath the first denominator is the whole $x$ again: self-similar, so write $x=1+\\frac1x$.",
    "why": "For a self-similar infinite expression, set up an equation \"whole $=$ itself\"; faster than computing a string of convergents.",
    "steps": [
      "$x=1+\\frac1x\\Rightarrow x^2-x-1=0$.",
      "Roots $\\frac{1\\pm\\sqrt5}{2}$; every layer is $1+$ a positive number, so $x\\ge1$; take the positive root.",
      "$x=\\frac{1+\\sqrt5}{2}\\approx1.618$, the golden ratio."
    ],
    "trap": "Handing in both roots, or picking the negative root $\\frac{1-\\sqrt5}2$; every truncation is positive, so the limit can't be negative.",
    "check": "The convergents are ratios of Fibonacci numbers $\\frac{13}{8},\\frac{21}{13},\\ldots$, alternately trapping the answer."
  },
  "lx-seq-003": {
    "spot": "Recursion $R_{n+1}=1+\\frac{2}{1+R_n}$: if the limit exists, take the limit on both sides to get $R=1+\\frac2{1+R}$, a quadratic equation.",
    "why": "The fixed-point equation gives the limit directly; the sequence is bounded and converges alternately, so just take the positive root.",
    "steps": [
      "$R=1+\\frac{2}{1+R}\\Rightarrow R(1+R)=(1+R)+2\\Rightarrow R^2=3$.",
      "Resistance is positive, so take $R=\\sqrt3$.",
      "So $\\lim R_n=\\sqrt3\\approx1.732$."
    ],
    "trap": "Forgetting a term when multiplying both sides by $(1+R)$ and writing $R^2=2$; or mistaking $R_1=1$ as part of the limit.",
    "check": "Computing: $R_1=1,\\ R_2=2,\\ R_3=\\frac53,\\ R_4=\\frac74,\\ R_5=\\frac{19}{11}$, alternating above and below $\\sqrt3$."
  }
};
