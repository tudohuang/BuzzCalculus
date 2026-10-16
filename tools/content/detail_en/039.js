// Detail v2, English — batch 039. Translation of tools/content/detail/039.js (text only; claims live in the Chinese file).
module.exports = {
  "tmpl-der-power-001": {
    "spot": "The polynomial $3x^5-4x$ has just two terms, each \"a constant times a power\" — use the Power Rule term by term.",
    "why": "The derivative of a sum is the sum of the derivatives; for each term just bring the exponent down, multiply, and lower the exponent by one. No limit definition needed.",
    "steps": [
      "Split into two terms and differentiate each: $3x^5$ and $-4x$.",
      "Power Rule: $(3x^5)'=3\\cdot 5x^{4}=15x^4$.",
      "Linear term: $(-4x)'=-4$.",
      "Put together: $15x^4-4$."
    ],
    "trap": "Bringing the exponent down but forgetting to lower it, writing $15x^5-4$; or differentiating $-4x$ as $-4x^0\\cdot 0=0$.",
    "check": "Plug in $x=1$: slope $15-4=11$."
  },
  "tmpl-der-power-002": {
    "spot": "$2x^6-7x$ is one monomial minus another — Power Rule term by term, bringing each exponent down.",
    "why": "Differentiating a polynomial only needs linearity plus the Power Rule; expanding or using the limit definition is a detour.",
    "steps": [
      "Split into $2x^6$ and $-7x$ and differentiate each.",
      "$(2x^6)'=2\\cdot 6x^{5}=12x^5$.",
      "$(-7x)'=-7$.",
      "Answer: $12x^5-7$."
    ],
    "trap": "Not multiplying the coefficient by the exponent, writing $2x^5-7$.",
    "check": "Plug in $x=1$: $12-7=5$."
  },
  "tmpl-der-power-003": {
    "spot": "$6x^3-5x$: a cubic term plus a linear term — Power Rule term by term.",
    "why": "Every term has the form $cx^n$, so the Power Rule gives the derivative in one step.",
    "steps": [
      "Split into $6x^3$ and $-5x$.",
      "$(6x^3)'=6\\cdot 3x^{2}=18x^2$.",
      "$(-5x)'=-5$.",
      "Answer: $18x^2-5$."
    ],
    "trap": "Multiplying the exponent into the coefficient but not lowering it, getting $18x^3-5$.",
    "check": "Plug in $x=0$: only the linear term's slope $-5$ remains."
  },
  "tmpl-der-power-004": {
    "spot": "Both terms of $4x^7-9x$ are a constant times a power — Power Rule term by term.",
    "why": "Linearity lets you handle the two terms separately; apply $(x^n)'=nx^{n-1}$ to each.",
    "steps": [
      "Split into $4x^7$ and $-9x$.",
      "$(4x^7)'=4\\cdot 7x^{6}=28x^6$.",
      "$(-9x)'=-9$.",
      "Answer: $28x^6-9$."
    ],
    "trap": "Lowering the exponent without bringing it down as a factor, writing $4x^6-9$.",
    "check": "Plug in $x=1$: $28-9=19$."
  },
  "tmpl-der-power-005": {
    "spot": "$8x^4-3x$: a quartic term plus a linear term — Power Rule term by term.",
    "why": "Term-by-term differentiation of a polynomial is the most direct; each term only changes its coefficient and exponent.",
    "steps": [
      "Split into $8x^4$ and $-3x$.",
      "$(8x^4)'=8\\cdot 4x^{3}=32x^3$.",
      "$(-3x)'=-3$.",
      "Answer: $32x^3-3$."
    ],
    "trap": "Treating $-3x$ as a constant and differentiating it to $0$, getting $32x^3$.",
    "check": "Plug in $x=1$: $32-3=29$."
  },
  "tmpl-der-quotient-shift-002": {
    "spot": "In $\\frac{x}{x+3}$ top and bottom are both linear, and the numerator is just the denominator minus $3$ — first rewrite it as $1-\\frac{3}{x+3}$.",
    "why": "After the split you only differentiate $\\frac{1}{x+3}$: one less numerator to simplify than with the Quotient Rule, and no chance of getting the order backwards.",
    "steps": [
      "$\\frac{x}{x+3}=\\frac{(x+3)-3}{x+3}=1-\\frac{3}{x+3}$.",
      "$\\left(-\\frac{3}{x+3}\\right)'=\\frac{3}{(x+3)^2}$, and the constant $1$ has derivative $0$.",
      "Answer: $\\frac{3}{(x+3)^2}$."
    ],
    "trap": "Writing the Quotient Rule numerator backwards as $x\\cdot 1-(x+3)\\cdot 1$, getting $-\\frac{3}{(x+3)^2}$ — off by a minus sign.",
    "check": "At $x=0$ the slope is $\\frac{3}{9}=\\frac13$; the function climbs toward $1$, so the derivative is positive."
  },
  "tmpl-der-quotient-shift-003": {
    "spot": "$\\frac{x}{x+5}$: the numerator is the denominator minus $5$ — rewrite as $1-\\frac{5}{x+5}$, then differentiate.",
    "why": "After splitting you only differentiate one $\\frac{c}{x+a}$, faster than the Quotient Rule and harder to get the sign wrong.",
    "steps": [
      "$\\frac{x}{x+5}=1-\\frac{5}{x+5}$.",
      "$\\left(-\\frac{5}{x+5}\\right)'=\\frac{5}{(x+5)^2}$.",
      "Answer: $\\frac{5}{(x+5)^2}$."
    ],
    "trap": "Reversing the order in the Quotient Rule numerator, getting $-\\frac{5}{(x+5)^2}$.",
    "check": "At $x=0$ the slope is $\\frac{5}{25}=\\frac15$."
  },
  "tmpl-der-quotient-shift-004": {
    "spot": "$\\frac{x}{x+7}$: the numerator is $7$ less than the denominator — rewrite as $1-\\frac{7}{x+7}$.",
    "why": "A constant minus a simple fraction leaves only $\\frac{1}{x+7}$ to differentiate, cleaner than the Quotient Rule.",
    "steps": [
      "$\\frac{x}{x+7}=1-\\frac{7}{x+7}$.",
      "$\\left(-\\frac{7}{x+7}\\right)'=\\frac{7}{(x+7)^2}$.",
      "Answer: $\\frac{7}{(x+7)^2}$."
    ],
    "trap": "Thinking that since top and bottom both start with $x$ they cancel to the constant $\\frac{1}{7}$, and answering $0$ for the derivative.",
    "check": "At $x=0$ the slope is $\\frac{7}{49}=\\frac17$."
  },
  "tmpl-der-quotient-shift-005": {
    "spot": "$\\frac{x}{x+4}$: the numerator is $4$ less than the denominator — rewrite as $1-\\frac{4}{x+4}$.",
    "why": "After the split you only differentiate $-\\frac{4}{x+4}$ and the answer comes out in one step, skipping the Quotient Rule's numerator subtraction.",
    "steps": [
      "$\\frac{x}{x+4}=1-\\frac{4}{x+4}$.",
      "$\\left(-\\frac{4}{x+4}\\right)'=\\frac{4}{(x+4)^2}$.",
      "Answer: $\\frac{4}{(x+4)^2}$."
    ],
    "trap": "Differentiating top and bottom separately to get $\\frac{1}{1}=1$ — the derivative of a quotient is not the quotient of the derivatives.",
    "check": "At $x=0$ the slope is $\\frac{4}{16}=\\frac14$."
  },
  "tmpl-int-definite-power-002": {
    "spot": "The integrand $4x$ is a single power and the lower limit is $0$ — find the antiderivative with the Power Rule and only plug in the upper limit.",
    "why": "Fundamental Theorem of Calculus: the antiderivative $2x^2$ is $0$ at $0$, so the lower limit contributes nothing.",
    "steps": [
      "Antiderivative $\\frac{4x^2}{2}=2x^2$.",
      "Plug in the upper limit $3$: $2\\cdot 9=18$; the lower limit $0$ gives $0$.",
      "Answer: $18$."
    ],
    "trap": "Dividing by the old exponent $1$ to get $4x^2$, which gives $36$.",
    "check": "The region is a triangle with base $3$ and height $12$, area $\\frac{3\\cdot 12}{2}=18$."
  },
  "tmpl-int-definite-power-003": {
    "spot": "$5x^3$ is a constant times a power and the interval starts at $0$ — Power Rule plus the Fundamental Theorem.",
    "why": "The antiderivative $\\frac{5x^4}{4}$ is $0$ at $0$, so only the upper limit $2$ matters.",
    "steps": [
      "Antiderivative $\\frac{5x^4}{4}$.",
      "Upper limit: $\\frac{5\\cdot 16}{4}=20$; the lower limit $0$ gives $0$.",
      "Answer: $20$."
    ],
    "trap": "Dividing by the old exponent $3$ to get $\\frac{5\\cdot 16}{3}=\\frac{80}{3}$.",
    "check": "On $[0,2]$ the integrand lies between $0$ and $40$, so the integral should be less than $2\\cdot 40=80$ and greater than $0$."
  },
  "tmpl-int-definite-power-004": {
    "spot": "$2x^2$ integrated from $0$ to $4$ — Power Rule gives the antiderivative $\\frac{2x^3}{3}$, and the lower limit $0$ contributes $0$.",
    "why": "A single monomial takes the Power Rule directly, no substitution needed.",
    "steps": [
      "Antiderivative $\\frac{2x^3}{3}$.",
      "Plug in the upper limit $4$: $\\frac{2\\cdot 64}{3}=\\frac{128}{3}$.",
      "Answer: $\\frac{128}{3}$."
    ],
    "trap": "Using the old exponent when plugging in, computing $4^2=16$, and getting $\\frac{32}{3}$.",
    "check": "The area under a parabola is one third of the bounding rectangle $4\\times 32$."
  },
  "tmpl-int-definite-power-005": {
    "spot": "The coefficient $6$ in $6x^5$ is exactly the new exponent — the antiderivative is just $x^6$.",
    "why": "The Power Rule's division by $6$ cancels the coefficient, so plugging in $1$ gives the answer at a glance.",
    "steps": [
      "Antiderivative $\\frac{6x^6}{6}=x^6$.",
      "The upper limit $1$ gives $1$, the lower limit $0$ gives $0$.",
      "Answer: $1$."
    ],
    "trap": "Dividing by the old exponent $5$ to get $\\frac65$.",
    "check": "On $[0,1]$ the integrand never exceeds $6$ and is small over most of the interval, so an integral of $1$ is reasonable."
  },
  "tmpl-int-exp-def-001": {
    "spot": "The exponent of $e^{3x}$ is the linear $3x$ — the antiderivative is $\\frac{e^{3x}}{3}$, then plug in the limits.",
    "why": "Reverse Chain Rule: the inner coefficient is $3$, so divide by $3$; no need to actually substitute.",
    "steps": [
      "Antiderivative $\\frac{e^{3x}}{3}$.",
      "Upper limit $\\frac{e^3}{3}$, lower limit $\\frac{e^0}{3}=\\frac13$.",
      "Subtract to get $\\frac{e^3-1}{3}$."
    ],
    "trap": "Assuming the lower limit $0$ contributes $0$ — $e^0=1$, so you must subtract $\\frac13$; otherwise you answer $\\frac{e^3}{3}$.",
    "check": "On $[0,1]$ the integrand lies between $1$ and $e^3\\approx 20.1$, and the integral, about $6.36$, falls in that range."
  },
  "tmpl-int-exp-def-002": {
    "spot": "The exponent of $e^{2x}$ is $2x$ — antiderivative $\\frac{e^{2x}}{2}$, and the lower limit $0$ gives $\\frac12$, not $0$.",
    "why": "When the exponent is linear, just divide by its coefficient; faster than letting $u=2x$ and changing the limits.",
    "steps": [
      "Antiderivative $\\frac{e^{2x}}{2}$.",
      "Upper limit $\\frac{e^4}{2}$, lower limit $\\frac12$.",
      "Subtract to get $\\frac{e^4-1}{2}$."
    ],
    "trap": "Forgetting to divide by $2$ and answering $e^4-1$.",
    "check": "The integrand is increasing, so the integral lies between $2\\cdot 1$ and $2\\cdot e^4$."
  },
  "tmpl-int-exp-def-003": {
    "spot": "$e^{4x}$ — the exponent is linear, so the antiderivative is $\\frac{e^{4x}}{4}$.",
    "why": "Reverse Chain Rule: divide by the inner coefficient $4$ to get the antiderivative in one step.",
    "steps": [
      "Antiderivative $\\frac{e^{4x}}{4}$.",
      "Upper limit $\\frac{e^4}{4}$, lower limit $\\frac14$.",
      "Subtract to get $\\frac{e^4-1}{4}$."
    ],
    "trap": "Multiplying by the coefficient instead of dividing, getting $4(e^4-1)$.",
    "check": "On $[0,1]$ the integrand lies between $1$ and $e^4$, and the integral, about $13.4$, falls in that range."
  },
  "tmpl-int-exp-def-004": {
    "spot": "$e^{5x}$ integrated from $0$ to $1$ — antiderivative $\\frac{e^{5x}}{5}$.",
    "why": "A linear exponent means dividing by its coefficient — no substitution, no integration by parts.",
    "steps": [
      "Antiderivative $\\frac{e^{5x}}{5}$.",
      "Upper limit $\\frac{e^5}{5}$, lower limit $\\frac15$.",
      "Subtract to get $\\frac{e^5-1}{5}$."
    ],
    "trap": "Treating the lower limit as $0$ and not subtracting, answering $\\frac{e^5}{5}$.",
    "check": "On $[0,1]$ the integrand lies between $1$ and $e^5$, and the integral, about $29.5$, falls in that range."
  },
  "tmpl-int-exp-def-005": {
    "spot": "$e^{2x}$ integrated from $0$ to $3$ — antiderivative $\\frac{e^{2x}}{2}$, and the upper limit gives $e^6$.",
    "why": "Reverse Chain Rule: divide by $2$; note that plugging in the upper limit gives $e^{2\\cdot 3}$.",
    "steps": [
      "Antiderivative $\\frac{e^{2x}}{2}$.",
      "Upper limit $\\frac{e^6}{2}$, lower limit $\\frac12$.",
      "Subtract to get $\\frac{e^6-1}{2}$."
    ],
    "trap": "Plugging in only $e^3$ at the upper limit (forgetting the factor $2$), getting $\\frac{e^3-1}{2}$.",
    "check": "The integrand is increasing, so the integral lies between $3\\cdot 1$ and $3e^6$."
  },
  "tmpl-int-linear-001": {
    "spot": "The integrand $2x$ is a line through the origin — antiderivative $x^2$, or just compute the triangle's area.",
    "why": "Integrating a linear function is a trapezoid or triangle area; the Power Rule and geometry are equally fast.",
    "steps": [
      "Antiderivative $\\frac{2x^2}{2}=x^2$.",
      "The upper limit $3$ gives $9$, the lower limit $0$ gives $0$.",
      "Answer: $9$."
    ],
    "trap": "Forgetting to divide by $2$ in the antiderivative, writing $2x^2$ and answering $18$.",
    "check": "Triangle with base $3$ and height $6$: area $9$."
  },
  "tmpl-int-linear-002": {
    "spot": "$4x$ is a line through the origin, integrated from $0$ to $2$ — antiderivative $2x^2$.",
    "why": "The Power Rule gives the antiderivative in one step, and the lower limit $0$ contributes nothing.",
    "steps": [
      "Antiderivative $\\frac{4x^2}{2}=2x^2$.",
      "The upper limit $2$ gives $8$.",
      "Answer: $8$."
    ],
    "trap": "Treating the integral as \"upper limit times the integrand\": $2\\cdot 4\\cdot 2=16$, twice too big.",
    "check": "Triangle with base $2$ and height $8$: area $8$."
  },
  "tmpl-int-linear-003": {
    "spot": "$6x$ integrated from $0$ to $5$ — a triangle under a line, antiderivative $3x^2$.",
    "why": "For a linear function, the Power Rule and the triangle area both take seconds and check each other.",
    "steps": [
      "Antiderivative $\\frac{6x^2}{2}=3x^2$.",
      "The upper limit $5$ gives $75$.",
      "Answer: $75$."
    ],
    "trap": "Forgetting to square when plugging in the upper limit, computing $3\\cdot 5=15$.",
    "check": "Triangle with base $5$ and height $30$: area $75$."
  },
  "tmpl-int-linear-004": {
    "spot": "$3x$ integrated from $0$ to $4$ — antiderivative $\\frac{3x^2}{2}$.",
    "why": "Find the antiderivative with the Power Rule; the lower limit $0$ gives $0$, so only the upper limit is left.",
    "steps": [
      "Antiderivative $\\frac{3x^2}{2}$.",
      "Plug in the upper limit $4$: $\\frac{3\\cdot 16}{2}=24$.",
      "Answer: $24$."
    ],
    "trap": "Writing the antiderivative as $3x^2$ without dividing by $2$, getting $48$.",
    "check": "Triangle with base $4$ and height $12$: area $24$."
  },
  "tmpl-int-linear-005": {
    "spot": "$8x$ integrated from $0$ to $3$ — antiderivative $4x^2$.",
    "why": "Use the Power Rule directly on a linear function, or see it as a triangle under a line.",
    "steps": [
      "Antiderivative $\\frac{8x^2}{2}=4x^2$.",
      "The upper limit $3$ gives $36$.",
      "Answer: $36$."
    ],
    "trap": "Thinking $\\int 8x\\,dx=8$ and multiplying by the interval length to get $24$ — the integrand isn't constant.",
    "check": "Triangle with base $3$ and height $24$: area $36$."
  },
  "tmpl-int-linear-006": {
    "spot": "$5x$ integrated from $0$ to $6$ — antiderivative $\\frac{5x^2}{2}$.",
    "why": "The Power Rule gives the antiderivative in one step, and the lower limit $0$ contributes nothing.",
    "steps": [
      "Antiderivative $\\frac{5x^2}{2}$.",
      "Plug in the upper limit $6$: $\\frac{5\\cdot 36}{2}=90$.",
      "Answer: $90$."
    ],
    "trap": "Forgetting to divide by $2$ in the antiderivative, getting $180$.",
    "check": "Triangle with base $6$ and height $30$: area $90$."
  },
  "tmpl-int-sin-def-002": {
    "spot": "$\\sin(5x)$ has inner coefficient $5$ — antiderivative $-\\frac{\\cos 5x}{5}$; $5$ is odd, so $\\cos 5\\pi=-1$.",
    "why": "Reverse Chain Rule: divide by $5$, then plug in the limits — one line shorter than substituting $u=5x$.",
    "steps": [
      "Antiderivative $-\\frac{\\cos 5x}{5}$.",
      "Upper limit: $-\\frac{\\cos 5\\pi}{5}=\\frac15$; lower limit: $-\\frac{\\cos 0}{5}=-\\frac15$.",
      "$\\frac15-\\left(-\\frac15\\right)=\\frac25$."
    ],
    "trap": "Thinking any $\\sin$-type integral over $[0,\\pi]$ is $2$, or forgetting to divide by $5$.",
    "check": "Of the five half-arches, four cancel in sign, leaving one half-arch $\\int_0^{\\pi/5}\\sin 5x\\,dx$."
  },
  "tmpl-int-sin-def-003": {
    "spot": "$\\sin(7x)$ has odd inner coefficient $7$ — antiderivative $-\\frac{\\cos 7x}{7}$, and $\\cos 7\\pi=-1$.",
    "why": "Divide by the inner coefficient to get the antiderivative; an odd multiple of $\\pi$ makes the cosine value obvious.",
    "steps": [
      "Antiderivative $-\\frac{\\cos 7x}{7}$.",
      "Upper limit $\\frac17$, lower limit $-\\frac17$.",
      "Subtract to get $\\frac27$."
    ],
    "trap": "Getting the antiderivative's sign wrong, writing $\\frac{\\cos 7x}{7}$ and answering $-\\frac27$.",
    "check": "Of the seven half-arches, six cancel, leaving the area of one half-arch."
  },
  "tmpl-int-sin-def-004": {
    "spot": "$\\sin(9x)$ has odd inner coefficient $9$ — antiderivative $-\\frac{\\cos 9x}{9}$, and $\\cos 9\\pi=-1$.",
    "why": "Reverse Chain Rule: divide by $9$, plug in the limits, done.",
    "steps": [
      "Antiderivative $-\\frac{\\cos 9x}{9}$.",
      "Upper limit $\\frac19$, lower limit $-\\frac19$.",
      "Subtract to get $\\frac29$."
    ],
    "trap": "Taking $\\cos 9\\pi$ as $1$ so the limits cancel and answering $0$ (that only happens for even multiples).",
    "check": "Of the nine half-arches, eight cancel, leaving the area of one half-arch."
  },
  "tmpl-lim-cos-square-003": {
    "spot": "$1-\\cos(5x)$ over $x^2$ — the standard form $\\frac{1-\\cos u}{u^2}\\to\\frac12$ with $u=5x$.",
    "why": "Build $u^2=25x^2$ and use the standard limit; L'Hôpital's Rule needs two rounds and is slower.",
    "steps": [
      "$1-\\cos 5x\\approx\\frac{(5x)^2}{2}$, i.e. $\\frac{1-\\cos 5x}{(5x)^2}\\to\\frac12$.",
      "$\\frac{1-\\cos 5x}{x^2}=25\\cdot\\frac{1-\\cos 5x}{(5x)^2}$.",
      "The limit is $25\\cdot\\frac12=\\frac{25}{2}$."
    ],
    "trap": "Pulling out only $5$ without squaring it, getting $\\frac52$.",
    "check": "At $x=0.01$ the ratio is slightly below $12.5$."
  },
  "tmpl-lim-cos-square-004": {
    "spot": "$1-\\cos(6x)$ over $x^2$ — the standard form $\\frac{1-\\cos u}{u^2}\\to\\frac12$ with $u=6x$.",
    "why": "The equivalent infinitesimal $1-\\cos u\\sim\\frac{u^2}{2}$ does it in one step, no need for L'Hôpital's Rule twice.",
    "steps": [
      "$\\frac{1-\\cos 6x}{(6x)^2}\\to\\frac12$.",
      "$\\frac{1-\\cos 6x}{x^2}=36\\cdot\\frac{1-\\cos 6x}{(6x)^2}$.",
      "The limit is $36\\cdot\\frac12=18$."
    ],
    "trap": "Multiplying by $6$ without squaring, getting $3$.",
    "check": "At $x=0.01$ the ratio is slightly below $18$."
  },
  "tmpl-lim-log-ratio-002": {
    "spot": "A ratio of two $\\ln(1+\\text{small})$ terms — $\\ln(1+u)\\sim u$, so just look at $\\frac{7x}{2x}$.",
    "why": "Equivalent infinitesimals do it in one step; L'Hôpital's Rule also works but costs an extra derivative of a composite function.",
    "steps": [
      "$\\frac{\\ln(1+u)}{u}\\to 1$, with $u=7x$ and $u=2x$ respectively.",
      "Rewrite: $\\frac{\\ln(1+7x)}{\\ln(1+2x)}=\\frac{\\ln(1+7x)}{7x}\\cdot\\frac{2x}{\\ln(1+2x)}\\cdot\\frac72$.",
      "The limit is $\\frac72$."
    ],
    "trap": "Treating the ratio as $\\ln\\frac{1+7x}{1+2x}$ and getting $\\ln 1=0$.",
    "check": "At $x=0.001$ the ratio is about $3.49$, approaching $3.5$ from below."
  },
  "tmpl-lim-log-ratio-003": {
    "spot": "$\\frac{\\ln(1+3x)}{\\ln(1+8x)}$ is $\\frac00$, and both are $\\ln(1+\\text{small})$ — replace with $\\frac{3x}{8x}$.",
    "why": "Equivalent infinitesimals leave the coefficient ratio directly — no expansion, no L'Hôpital's Rule.",
    "steps": [
      "$\\frac{\\ln(1+u)}{u}\\to 1$.",
      "Rewrite: $\\frac{\\ln(1+3x)}{3x}\\cdot\\frac{8x}{\\ln(1+8x)}\\cdot\\frac38$.",
      "The limit is $\\frac38$."
    ],
    "trap": "Writing the coefficient ratio upside down as $\\frac83$.",
    "check": "At $x=0.001$ the ratio is about $0.376$, approaching $0.375$."
  },
  "tmpl-lim-log-ratio-004": {
    "spot": "Top and bottom are both $\\ln(1+cx)$ — $\\ln(1+u)\\sim u$, giving the ratio $\\frac{9x}{4x}$.",
    "why": "Equivalent infinitesimals give the coefficient ratio in one step, less work than L'Hôpital's Rule.",
    "steps": [
      "$\\frac{\\ln(1+u)}{u}\\to 1$.",
      "Rewrite: $\\frac{\\ln(1+9x)}{9x}\\cdot\\frac{4x}{\\ln(1+4x)}\\cdot\\frac94$.",
      "The limit is $\\frac94$."
    ],
    "trap": "Thinking a ratio of $\\ln$ terms simplifies to $\\ln\\frac94$.",
    "check": "At $x=0.001$ the ratio is about $2.244$, approaching $2.25$ from below."
  },
  "tmpl-lim-sin-ratio-001": {
    "spot": "Top and bottom are both $\\sin(cx)$ with $x\\to 0$ — build $\\frac{\\sin u}{u}\\to 1$ for each, leaving the coefficient ratio $\\frac35$.",
    "why": "The equivalent infinitesimal $\\sin u\\sim u$ gives the answer in one step; L'Hôpital's Rule works too, with one more derivative.",
    "steps": [
      "$\\frac{\\sin 3x}{3x}\\to 1$ and $\\frac{\\sin 5x}{5x}\\to 1$.",
      "Rewrite: $\\frac{\\sin 3x}{\\sin 5x}=\\frac{\\sin 3x}{3x}\\cdot\\frac{5x}{\\sin 5x}\\cdot\\frac35$.",
      "The limit is $\\frac35$."
    ],
    "trap": "Cancelling the $\\sin$, thinking $\\frac{\\sin 3x}{\\sin 5x}=\\frac{3x}{5x}$ holds for all $x$ — it only holds in the limit.",
    "check": "At $x=0.001$ the ratio is about $0.6000$."
  },
  "tmpl-lim-sin-ratio-003": {
    "spot": "$\\frac{\\sin 7x}{\\sin 3x}$ is $\\frac00$ as $x\\to 0$ — build $\\frac{\\sin u}{u}$, leaving $\\frac73$.",
    "why": "Each $\\sin$ is equivalent to its own argument, so the coefficient ratio is the answer.",
    "steps": [
      "$\\frac{\\sin 7x}{7x}\\to 1$ and $\\frac{\\sin 3x}{3x}\\to 1$.",
      "Rewrite: $\\frac{\\sin 7x}{7x}\\cdot\\frac{3x}{\\sin 3x}\\cdot\\frac73$.",
      "The limit is $\\frac73$."
    ],
    "trap": "Flipping the coefficient ratio and answering $\\frac37$.",
    "check": "At $x=0.001$ the ratio is about $2.3333$."
  },
  "tmpl-lim-sin-ratio-004": {
    "spot": "$\\frac{\\sin 2x}{\\sin 9x}$ — top and bottom are both $\\sin(cx)$, and equivalent infinitesimals give $\\frac{2x}{9x}$.",
    "why": "$\\sin u\\sim u$ leaves the coefficient ratio directly, faster than L'Hôpital's Rule.",
    "steps": [
      "$\\frac{\\sin 2x}{2x}\\to 1$ and $\\frac{\\sin 9x}{9x}\\to 1$.",
      "Rewrite: $\\frac{\\sin 2x}{2x}\\cdot\\frac{9x}{\\sin 9x}\\cdot\\frac29$.",
      "The limit is $\\frac29$."
    ],
    "trap": "Seeing $\\frac00$ and answering $1$ or $0$.",
    "check": "At $x=0.001$ the ratio is about $0.2223$."
  },
  "tmpl-lim-sin-ratio-005": {
    "spot": "$\\frac{\\sin 6x}{\\sin 5x}$ — build $\\frac{\\sin u}{u}$ top and bottom, leaving the coefficient ratio $\\frac65$.",
    "why": "Equivalent infinitesimals do it in one step, no expansion needed.",
    "steps": [
      "$\\frac{\\sin 6x}{6x}\\to 1$ and $\\frac{\\sin 5x}{5x}\\to 1$.",
      "Rewrite: $\\frac{\\sin 6x}{6x}\\cdot\\frac{5x}{\\sin 5x}\\cdot\\frac65$.",
      "The limit is $\\frac65$."
    ],
    "trap": "Treating $\\frac{\\sin 6x}{\\sin 5x}$ as $\\sin\\frac65$.",
    "check": "At $x=0.001$ the ratio is about $1.2000$."
  },
  "tmpl-ser-geo-tail-002": {
    "spot": "A geometric series with ratio $\\frac14$, but starting at $n=2$ — the first term is $\\frac{1}{16}$.",
    "why": "Use $\\frac{\\text{first term}}{1-r}$, where the first term is the one you actually start with, not $1$ or $\\frac14$.",
    "steps": [
      "First term $\\left(\\frac14\\right)^2=\\frac{1}{16}$, ratio $r=\\frac14$; $|r|<1$, so it converges.",
      "Sum $=\\frac{1/16}{1-1/4}=\\frac{1}{12}$.",
      "Answer: $\\frac{1}{12}$."
    ],
    "trap": "Using $\\frac{1}{1-r}=\\frac43$ directly (that's for starting at $n=0$).",
    "check": "The sum from $n=0$ is $\\frac43$; subtract the first two terms $1+\\frac14$."
  },
  "tmpl-ser-geo-tail-003": {
    "spot": "Ratio $\\frac15$, starting at $n=2$ — the first term is $\\frac{1}{25}$.",
    "why": "A geometric series sums to the first term over $1-r$; the key is which term it starts at.",
    "steps": [
      "First term $\\left(\\frac15\\right)^2=\\frac{1}{25}$, ratio $\\frac15$.",
      "Sum $=\\frac{1/25}{1-1/5}=\\frac{1}{20}$.",
      "Answer: $\\frac{1}{20}$."
    ],
    "trap": "Using $\\frac15$ as the first term and getting $\\frac14$ (that's for starting at $n=1$).",
    "check": "The sum from $n=0$ is $\\frac54$; subtract the first two terms $1+\\frac15$."
  },
  "tmpl-ser-geo-tail-004": {
    "spot": "Ratio $\\frac16$, starting at $n=2$ — the first term is $\\frac{1}{36}$.",
    "why": "Use the geometric series formula with the $n=2$ term as the first term.",
    "steps": [
      "First term $\\left(\\frac16\\right)^2=\\frac{1}{36}$, ratio $\\frac16$.",
      "Sum $=\\frac{1/36}{1-1/6}=\\frac{1}{30}$.",
      "Answer: $\\frac{1}{30}$."
    ],
    "trap": "Using $\\frac{1}{1-r}=\\frac65$ without subtracting the first two terms.",
    "check": "The sum from $n=0$ is $\\frac65$; subtract $1+\\frac16$."
  },
  "tmpl-ser-radius-geo-001": {
    "spot": "$\\frac{x^n}{3^n}=\\left(\\frac{x}{3}\\right)^n$ is really a geometric series with ratio $\\frac{x}{3}$.",
    "why": "A geometric series converges exactly when the ratio has absolute value less than $1$ — more direct than the Ratio Test.",
    "steps": [
      "$\\frac{x^n}{3^n}=\\left(\\frac x3\\right)^n$, ratio $\\frac x3$.",
      "For $|x|<3$ the ratio is less than $1$ and the series converges; e.g. $x=2.9$ has a finite sum.",
      "At $x=3$ every term is $1$, which doesn't tend to $0$, so it diverges.",
      "The radius of convergence is $3$."
    ],
    "trap": "Writing the radius as $\\frac13$ — that's the $n$-th root of the coefficient $\\frac{1}{3^n}$; the radius is its reciprocal.",
    "check": "Ratio Test: the ratio of consecutive terms is $\\frac{|x|}{3}$, and less than $1$ means $|x|<3$."
  },
  "tmpl-ser-radius-geo-002": {
    "spot": "$\\frac{x^n}{5^n}=\\left(\\frac x5\\right)^n$ — a geometric series with ratio $\\frac x5$.",
    "why": "A geometric series converges exactly when the ratio has absolute value less than $1$, so the radius can be read off at a glance.",
    "steps": [
      "$\\frac{x^n}{5^n}=\\left(\\frac x5\\right)^n$.",
      "It converges for $|x|<5$; e.g. at $x=4$ the sum is $4$.",
      "At $x=5$ every term is $1$, so it diverges.",
      "The radius of convergence is $5$."
    ],
    "trap": "Answering $\\frac15$, mistaking the root of the coefficient for the radius.",
    "check": "Ratio Test: the ratio of consecutive terms is $\\frac{|x|}{5}$."
  },
  "tmpl-ser-radius-geo-003": {
    "spot": "$\\frac{x^n}{6^n}=\\left(\\frac x6\\right)^n$ — a geometric series with ratio $\\frac x6$.",
    "why": "Once you see it's geometric, the convergence condition $\\left|\\frac x6\\right|<1$ gives the radius directly.",
    "steps": [
      "$\\frac{x^n}{6^n}=\\left(\\frac x6\\right)^n$.",
      "It converges for $|x|<6$; e.g. at $x=3$ the sum is $1$.",
      "At $x=6$ every term is $1$, so it diverges.",
      "The radius of convergence is $6$."
    ],
    "trap": "Answering $\\frac16$.",
    "check": "Ratio Test: the ratio of consecutive terms is $\\frac{|x|}{6}$."
  },
  "tmpl-ser-radius-geo-004": {
    "spot": "$\\frac{x^n}{7^n}=\\left(\\frac x7\\right)^n$ — a geometric series with ratio $\\frac x7$.",
    "why": "A geometric series converges exactly when the ratio has absolute value less than $1$, so the radius is $7$.",
    "steps": [
      "$\\frac{x^n}{7^n}=\\left(\\frac x7\\right)^n$.",
      "It converges for $|x|<7$; e.g. at $x=3.5$ the sum is $1$.",
      "At $x=7$ every term is $1$, so it diverges.",
      "The radius of convergence is $7$."
    ],
    "trap": "Answering $\\frac17$.",
    "check": "Ratio Test: the ratio of consecutive terms is $\\frac{|x|}{7}$."
  },
  "ap-opt-001": {
    "spot": "Fixed volume, minimize surface area — use the volume to eliminate the height $h$, so the surface area becomes a function of $r$ alone, then optimize.",
    "why": "Two variables and one constraint: eliminate one and it's single-variable optimization; Lagrange multipliers would be overkill here.",
    "steps": [
      "$\\pi r^2h=54\\pi$, so $h=\\frac{54}{r^2}$.",
      "Surface area $S=2\\pi r^2+2\\pi rh=2\\pi r^2+\\frac{108\\pi}{r}$.",
      "$S'=4\\pi r-\\frac{108\\pi}{r^2}=0$ gives $r^3=27$.",
      "$S''=4\\pi+\\frac{216\\pi}{r^3}>0$, so it's a minimum.",
      "Base radius $r=3$ (then $h=6=2r$)."
    ],
    "trap": "Using only the lateral area $2\\pi rh$ and forgetting the top and bottom, which gives no minimum at all (larger $r$ always makes it smaller).",
    "check": "At $r=3$, $S=54\\pi$; nearby values $r=2.9$ and $r=3.1$ both give more."
  },
  "ch-mix-001": {
    "spot": "$x^2$ times a three-layer composition $\\sin(e^{3x})$ — Product Rule on the outside, then the Chain Rule twice inside the second term.",
    "why": "First separate \"multiplied\" from \"nested\": the Product Rule splits it into two terms, and the nested part is peeled layer by layer so you don't lose the $3$.",
    "steps": [
      "Product Rule: $(x^2)'\\sin(e^{3x})+x^2\\left(\\sin(e^{3x})\\right)'$; the first term is $2x\\sin(e^{3x})$.",
      "Innermost layer: $(e^{3x})'=3e^{3x}$.",
      "Middle layer: $\\left(\\sin(e^{3x})\\right)'=\\cos(e^{3x})\\cdot 3e^{3x}$.",
      "Put together: $2x\\sin(e^{3x})+3x^2e^{3x}\\cos(e^{3x})$."
    ],
    "trap": "Peeling only one layer with the Chain Rule, writing $x^2\\cos(e^{3x})\\cdot e^{3x}$ and losing the factor $3$.",
    "check": "Plug in $x=0$: the first term has an $x$ and the second an $x^2$, so the derivative is $0$."
  },
  "cl-der-014": {
    "spot": "The problem already gives $\\tan\\psi=\\frac{r}{dr/d\\theta}$ — just compute $r$ and $\\frac{dr}{d\\theta}$ at $\\theta=\\frac{\\pi}{2}$, then pick the angle in $(0,\\pi)$.",
    "why": "Using the polar formula for the angle between the radius and the tangent directly saves a lot compared with converting to Cartesian, finding the tangent slope and then the angle.",
    "steps": [
      "At $\\theta=\\frac{\\pi}{2}$, $r=1+\\cos\\frac{\\pi}{2}=1$.",
      "$\\frac{dr}{d\\theta}=-\\sin\\theta$, which equals $-1$ at $\\frac{\\pi}{2}$.",
      "$\\tan\\psi=\\frac{1}{-1}=-1$.",
      "In $(0,\\pi)$ the angle with tangent $-1$ is in the second quadrant: $\\psi=\\frac{3\\pi}{4}$."
    ],
    "trap": "Taking the arctangent directly to get $-\\frac{\\pi}{4}$, which isn't in the required $(0,\\pi)$.",
    "check": "The answer lies between $\\frac{\\pi}{2}$ and $\\pi$, where tangent is negative, consistent with $\\frac{dr}{d\\theta}<0$."
  },
  "cl-der-022": {
    "spot": "$e^x=3x$ can't be solved exactly, and the question is \"how many\" — let $g(x)=e^x-3x$ and check whether its minimum is positive or negative.",
    "why": "$g$ is convex with a single local minimum; if that minimum is below $0$ and both ends go to infinity, there are exactly two roots.",
    "steps": [
      "$g'(x)=e^x-3=0$ at $x=\\ln 3$.",
      "$g''(x)=e^x>0$, so $\\ln 3$ is the only local minimum.",
      "$g(\\ln 3)=3-3\\ln 3<0$.",
      "Both sides are positive: $g(0)=1>0$, $g(2)=e^2-6>0$, so there is one root on each side.",
      "The number of real roots is $2$."
    ],
    "trap": "Stopping after finding one root (say between $0$ and $1$) and missing the other one near $1.5$.",
    "check": "$g(1)=e-3<0$, so the sign changes once on $(0,1)$ and once on $(1,2)$."
  },
  "cl-der-029": {
    "spot": "Cauchy's Mean Value Theorem says the \"ratio of average rates of change\" of two functions equals the \"ratio of derivatives\" — the right side is a number, and the left side simplifies to an expression in $c$ alone.",
    "why": "$\\frac{2c}{3c^2}$ simplifies to $\\frac{2}{3c}$, turning it into a linear equation you can solve directly.",
    "steps": [
      "Right side: $\\frac{f(2)-f(1)}{g(2)-g(1)}=\\frac{4-1}{8-1}=\\frac37$.",
      "Left side: $\\frac{f'(c)}{g'(c)}=\\frac{2c}{3c^2}=\\frac{2}{3c}$.",
      "$\\frac{2}{3c}=\\frac37$ gives $c=\\frac{14}{9}\\approx 1.556$, which lies in $(1,2)$.",
      "Answer: $c=\\frac{14}{9}$."
    ],
    "trap": "Applying the Mean Value Theorem to $f$ and $g$ separately to get $c=\\frac32$ and $c=\\sqrt{7/3}$, then trying to force a common $c$ — Cauchy's $c$ is a different point.",
    "check": "Plug back in: $\\frac{2\\cdot 14/9}{3(14/9)^2}$ should equal $\\frac37$."
  },
  "cl-lim-004": {
    "spot": "Under the root is $x+\\sqrt{x}$, and as $x\\to 0^+$, $\\sqrt x$ is much bigger than $x$ — factor out the dominant $\\sqrt x$.",
    "why": "Comparing small quantities: $x=\\sqrt x\\cdot\\sqrt x$ is one order higher than $\\sqrt x$ and can be ignored; no Taylor expansion needed.",
    "steps": [
      "$x+\\sqrt x=\\sqrt x\\,(1+\\sqrt x)$.",
      "Take the root: $\\sqrt{x+\\sqrt x}=x^{1/4}\\sqrt{1+\\sqrt x}$.",
      "$\\sqrt{1+\\sqrt x}\\to 1$, so $\\frac{\\sqrt{x+\\sqrt x}}{x^{1/4}}\\to 1$, i.e. $c=1$.",
      "The exponent is $k=\\frac14$."
    ],
    "trap": "Thinking $x$ is the leading term and answering $k=\\frac12$ — near $0$, the lower the power, the bigger the term.",
    "check": "With $k=\\frac12$ instead, the ratio blows up to infinity rather than approaching a constant."
  },
  "cl-lim-029": {
    "spot": "$2^{1/x}$ shoots to infinity as $x\\to 0^+$ and drops to $0$ as $x\\to 0^-$ — you must compute the two sides separately.",
    "why": "Let $u=\\frac1x$; the two sides become limits as $u\\to\\pm\\infty$, and in each you check whether $2^u$ dominates or vanishes.",
    "steps": [
      "Let $u=\\frac1x$: $g=\\frac{2^u-1}{2^u+1}$.",
      "$x\\to 0^+$ means $u\\to\\infty$: divide top and bottom by $2^u$ to get $\\frac{1-2^{-u}}{1+2^{-u}}\\to 1$.",
      "$x\\to 0^-$ means $u\\to-\\infty$: $2^u\\to 0$, giving $\\frac{0-1}{0+1}=-1$.",
      "The jump is $1-(-1)=2$."
    ],
    "trap": "Computing only the right-hand limit, or treating $x\\to 0^-$ as also giving $2^{1/x}\\to\\infty$, and getting a jump of $0$.",
    "check": "Plug in $x=\\pm 0.05$: $2^{\\pm 20}$ makes the function values very close to $1$ and $-1$ respectively."
  },
  "cl-lim-030": {
    "spot": "$\\lfloor x\\rfloor+\\lfloor -x\\rfloor$: at non-integers each floor \"loses a bit\" and the sum is always $-1$; at integers it is exactly $0$.",
    "why": "The value that repairs a removable discontinuity is the limit, so you only need the values on both sides of $2$ — no need to draw the whole graph.",
    "steps": [
      "For $1<x<2$: $\\lfloor x\\rfloor=1$, $\\lfloor -x\\rfloor=-2$, sum $-1$.",
      "For $2<x<3$: $\\lfloor x\\rfloor=2$, $\\lfloor -x\\rfloor=-3$, sum $-1$.",
      "Both one-sided limits are $-1$, but $f(2)=2+(-2)=0$, so it's a removable discontinuity.",
      "Redefine $f(2)$ as $-1$ and it becomes continuous."
    ],
    "trap": "Thinking $\\lfloor -x\\rfloor=-\\lfloor x\\rfloor$, so $f\\equiv 0$ and it's already continuous — that only holds at integers.",
    "check": "Take $x=2.5$: $\\lfloor 2.5\\rfloor=2$, $\\lfloor -2.5\\rfloor=-3$, sum $-1$."
  },
  "cl-lim-033": {
    "spot": "The denominator has $|x|$, so as $x\\to 0$ you must split into positive and negative sides; top and bottom both contain $x-1$, which can be cancelled first.",
    "why": "Cancel first to get $\\frac{x/|x|}{x+1}$; on the two sides $\\frac{x}{|x|}$ is $\\pm 1$, so the one-sided limits can be read off immediately.",
    "steps": [
      "$x^2-x=x(x-1)$ and $x^2-1=(x-1)(x+1)$; cancel $x-1$.",
      "$x\\to 0^+$: $\\frac{x}{|x|}=1$, limit $\\frac{1}{1}=1$.",
      "$x\\to 0^-$: $\\frac{x}{|x|}=-1$, limit $-1$.",
      "The jump is $1-(-1)=2$."
    ],
    "trap": "Treating $|x|$ as $x$ and cancelling, concluding it's continuous at $0$ with a jump of $0$.",
    "check": "Plug in $x=\\pm 0.01$: the values are about $0.990$ and $-1.010$, a difference of about $2$."
  },
  "cl-lim-035": {
    "spot": "The recursion $a_{n+1}=a_n(2-3a_n)$ is Newton's method for the reciprocal $\\frac13$ — watch how the error $1-3a_n$ evolves.",
    "why": "The error squares at every step, which gives a closed form; that is more direct than just proving monotone and bounded, and shows the limit faster.",
    "steps": [
      "$1-3a_{n+1}=1-6a_n+9a_n^2=(1-3a_n)^2$.",
      "$1-3a_1=0.7$, so $1-3a_n=0.7^{2^{n-1}}$; e.g. $a_2=0.17$ matches.",
      "$0.7^{2^{n-1}}\\to 0$, so $a_n=\\frac{1-0.7^{2^{n-1}}}{3}\\to\\frac13$."
    ],
    "trap": "Solving the fixed-point equation $L=L(2-3L)$ to get $L=0$ or $\\frac13$ without deciding which one; the squaring error shows it is $\\frac13$.",
    "check": "At $n=6$ the error is already only $0.7^{32}\\approx 1.1\\times 10^{-5}$."
  },
  "cl-lim-039": {
    "spot": "The numerator is $\\sum_{k=1}^{n}\\sqrt[3]{k}$ and the denominator $n\\cdot n^{1/3}$ — after dividing, it is $\\frac1n\\sum\\left(\\frac kn\\right)^{1/3}$, a Riemann sum.",
    "why": "The Riemann sum turns straight into the integral $\\int_0^1x^{1/3}dx$, with no need to estimate the size of $\\sum\\sqrt[3]{k}$.",
    "steps": [
      "$\\frac{\\sum\\sqrt[3]{k}}{n\\sqrt[3]{n}}=\\frac1n\\sum_{k=1}^{n}\\left(\\frac kn\\right)^{1/3}$.",
      "This is the right-endpoint Riemann sum of $x^{1/3}$ on $[0,1]$, so the limit is $\\int_0^1 x^{1/3}dx$.",
      "Alternatively, the Stolz–Cesàro theorem: $\\frac{\\sqrt[3]{n+1}}{(n+1)^{4/3}-n^{4/3}}\\to\\frac34$.",
      "The limit is $\\frac34$."
    ],
    "trap": "Estimating every term as $\\sqrt[3]{n}$, so the numerator is $\\approx n\\sqrt[3]n$ and the answer $1$ — the early terms are much smaller.",
    "check": "$\\sum k^{1/3}\\approx\\frac34n^{4/3}$; compare with the integral $\\int_0^n t^{1/3}dt$."
  },
  "cl-lim-045": {
    "spot": "The base tends to $1$ and the exponent $n\\to\\infty$ — a $1^\\infty$ form; take logs to get $n\\ln(\\cdots)$.",
    "why": "The standard approach for $1^\\infty$: $\\ln(1+u)\\sim u$, and the limit $L$ of the exponent gives the answer $e^L$.",
    "steps": [
      "Base $=1+\\frac{4n-1}{n^2-n+2}$.",
      "Take logs: $n\\ln\\left(1+\\frac{4n-1}{n^2-n+2}\\right)\\sim\\frac{n(4n-1)}{n^2-n+2}\\to 4$.",
      "The limit is $e^4$."
    ],
    "trap": "Seeing the base $\\to 1$ and saying $1^n=1$.",
    "check": "At $n=1000$ it is already very close to $e^4\\approx 54.6$."
  },
  "cl-ser-003": {
    "spot": "An alternating series whose terms decrease to $0$ — the error is at most the first omitted term, so find the first term below $10^{-4}$.",
    "why": "The alternating series estimate only needs you to compare term sizes, not to estimate the whole remainder.",
    "steps": [
      "The $k=2$ term: $\\frac{1}{2!\\cdot 5\\cdot 2^5}=\\frac{1}{320}$, far bigger than $10^{-4}$.",
      "The $k=3$ term: $\\frac{1}{3!\\cdot 7\\cdot 2^7}=\\frac{1}{5376}\\approx 1.86\\times 10^{-4}$, still bigger than $10^{-4}$, so it can't be dropped.",
      "The $k=4$ term: $\\frac{1}{4!\\cdot 9\\cdot 2^9}=\\frac{1}{110592}<10^{-4}$, so it can be dropped.",
      "Take $k=0,1,2,3$: $4$ terms in all."
    ],
    "trap": "Seeing that the $4$th term $\\frac1{5376}$ is already \"small\" and dropping it, keeping only $3$ terms; the error bound $1.86\\times 10^{-4}$ isn't good enough.",
    "check": "The sum of the first four terms $\\frac12-\\frac1{24}+\\frac1{320}-\\frac1{5376}$ does differ from the true value by less than $10^{-4}$."
  },
  "cl-ser-004": {
    "spot": "$\\frac{1}{1+x^4}$ is $\\frac{1}{1-u}$ with $u=-x^4$ — expand, integrate term by term to get an alternating decreasing series, and see which term first drops below $10^{-4}$.",
    "why": "$\\frac{1}{1+x^4}$ has no convenient antiderivative; a power series plus the alternating series estimate is the least work.",
    "steps": [
      "$\\frac{1}{1+x^4}=1-x^4+x^8-\\cdots$, valid for $|x|<1$.",
      "Integrate term by term: $\\frac13-\\frac{(1/3)^5}{5}+\\frac{(1/3)^9}{9}-\\cdots=\\frac13-\\frac1{1215}+\\frac1{177147}-\\cdots$.",
      "The second term $\\frac1{1215}\\approx 8.2\\times 10^{-4}$ can't be dropped; the third, $\\approx 5.6\\times 10^{-6}$, can.",
      "Approximation: $\\frac13-\\frac1{1215}=\\frac{404}{1215}$."
    ],
    "trap": "Keeping only the first term $\\frac13$, with an error of about $8.2\\times 10^{-4}$, more than allowed.",
    "check": "Compared with numerical integration, the difference is less than $10^{-4}$ (the true value is slightly larger, since the next term is positive)."
  },
  "cl-ser-005": {
    "spot": "First convert $18^\\circ$ to $\\frac{\\pi}{10}\\approx 0.314$, which is small — the series for $\\sin x$ is alternating and decreasing, and its terms shrink very fast.",
    "why": "The series only works in radians; the alternating series estimate means we only compare each term with $10^{-4}$.",
    "steps": [
      "$18^\\circ=\\frac{\\pi}{10}$ radians.",
      "$\\frac{x^3}{6}$ at $x=\\frac{\\pi}{10}$ is about $0.00517$, so it can't be dropped.",
      "$\\frac{x^5}{120}\\approx 2.6\\times 10^{-5}<10^{-4}$, so it can be dropped.",
      "Approximation: $\\frac{\\pi}{10}-\\frac{(\\pi/10)^3}{6}=\\frac{\\pi}{10}-\\frac{\\pi^3}{6000}$."
    ],
    "trap": "Plugging $x=18$ straight into the series, or keeping only the single term $\\frac{\\pi}{10}$, with an error of about $0.005$.",
    "check": "It differs from the true value $\\sin 18^\\circ=\\frac{\\sqrt5-1}{4}$ by about $2.5\\times 10^{-5}$."
  },
  "cl-ser-011": {
    "spot": "There is a $2n+1$ in the denominator and the signs alternate — this is the series for $\\arctan x$, $\\sum\\frac{(-1)^nx^{2n+1}}{2n+1}$, with $3^n$ corresponding to $x^2=\\frac13$.",
    "why": "Recognize the power series of a known function and plug in a specific $x$ to get a closed form — much faster than grinding partial sums.",
    "steps": [
      "$\\arctan x=\\sum_{n\\ge 0}\\frac{(-1)^nx^{2n+1}}{2n+1}$; take $x=\\frac{1}{\\sqrt3}$.",
      "$x^{2n+1}=\\frac{1}{\\sqrt3}\\cdot\\frac{1}{3^n}$, so the sum $=\\sqrt3\\arctan\\frac1{\\sqrt3}$.",
      "$\\arctan\\frac1{\\sqrt3}=\\frac{\\pi}{6}$, so the sum $=\\frac{\\sqrt3\\,\\pi}{6}=\\frac{\\pi}{2\\sqrt3}$."
    ],
    "trap": "Mistaking it for the series of $\\ln(1+x)$, or forgetting to multiply back by $\\sqrt3$ and answering $\\frac{\\pi}{6}$.",
    "check": "Add up the series directly and compare."
  },
  "cl-ser-012": {
    "spot": "Over a common denominator, $1+\\frac{1}{n(n+2)}$ is $\\frac{(n+1)^2}{n(n+2)}$ — the log turns products and quotients into sums and differences, giving a telescoping series.",
    "why": "After telescoping, only the first and last terms of the partial sum survive and the limit is immediate; a comparison test could only show convergence, not the value.",
    "steps": [
      "$1+\\frac{1}{n(n+2)}=\\frac{n^2+2n+1}{n(n+2)}=\\frac{(n+1)^2}{n(n+2)}$.",
      "Take logs: term $=\\ln\\frac{n+1}{n}-\\ln\\frac{n+2}{n+1}=c_n-c_{n+1}$, where $c_n=\\ln\\frac{n+1}{n}$.",
      "The sum of the first $N$ terms $=c_1-c_{N+1}=\\ln 2-\\ln\\frac{N+2}{N+1}$, and $c_{N+1}\\to 0$.",
      "The total is $\\ln 2$."
    ],
    "trap": "Using $\\ln(1+u)\\approx u$ and computing $\\sum\\frac{1}{n(n+2)}=\\frac34$ instead — that's only an approximation, not the answer.",
    "check": "$\\ln 2\\approx 0.693$, slightly less than $\\sum\\frac1{n(n+2)}=\\frac34$, consistent with $\\ln(1+u)<u$."
  }
};
