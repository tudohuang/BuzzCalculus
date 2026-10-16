// Detail v2, English — batch 037. Translation of tools/content/detail/037.js (text only; claims live in the Chinese file).
module.exports = {
  "tmpl-der-exp-004": {
    "spot": "The exponent isn't plain $x$ but $4x$: outer $e^u$, inner $u=4x$, and the Chain Rule spits out an extra $4$.",
    "why": "$e^u$ differentiates to itself, so the only job is multiplying by the inner derivative; rewriting as $(e^x)^{4}$ first is a detour.",
    "steps": [
      "Let $u=4x$; the derivative of the outer $e^u$ is $e^u$.",
      "The derivative of the inner $u=4x$ is $4$.",
      "Multiply (Chain Rule): $\\frac{d}{dx}e^{4x}=4e^{4x}$."
    ],
    "trap": "Writing just $e^{4x}$ and forgetting the inner derivative $4$; or pulling the $4$ down like a power and writing $4xe^{3x}$.",
    "check": "At $x=0$ the slope should be $4e^0=4$: near the origin $e^{4x}$ is about $1+4x$."
  },
  "tmpl-der-exp-005": {
    "spot": "The exponent isn't plain $x$ but $7x$: outer $e^u$, inner $u=7x$, and the Chain Rule spits out an extra $7$.",
    "why": "$e^u$ differentiates to itself, so the only job is multiplying by the inner derivative; rewriting as $(e^x)^{7}$ first is a detour.",
    "steps": [
      "Let $u=7x$; the derivative of the outer $e^u$ is $e^u$.",
      "The derivative of the inner $u=7x$ is $7$.",
      "Multiply (Chain Rule): $\\frac{d}{dx}e^{7x}=7e^{7x}$."
    ],
    "trap": "Writing just $e^{7x}$ and forgetting the inner derivative $7$; or pulling the $7$ down like a power and writing $7xe^{6x}$.",
    "check": "At $x=0$ the slope should be $7e^0=7$: near the origin $e^{7x}$ is about $1+7x$."
  },
  "tmpl-der-exp-006": {
    "spot": "The exponent isn't plain $x$ but $6x$: outer $e^u$, inner $u=6x$, and the Chain Rule spits out an extra $6$.",
    "why": "$e^u$ differentiates to itself, so the only job is multiplying by the inner derivative; rewriting as $(e^x)^{6}$ first is a detour.",
    "steps": [
      "Let $u=6x$; the derivative of the outer $e^u$ is $e^u$.",
      "The derivative of the inner $u=6x$ is $6$.",
      "Multiply (Chain Rule): $\\frac{d}{dx}e^{6x}=6e^{6x}$."
    ],
    "trap": "Writing just $e^{6x}$ and forgetting the inner derivative $6$; or pulling the $6$ down like a power and writing $6xe^{5x}$.",
    "check": "At $x=0$ the slope should be $6e^0=6$: near the origin $e^{6x}$ is about $1+6x$."
  },
  "tmpl-der-simple-power-002": {
    "spot": "The monomial $7x^{2}$: the coefficient $7$ stays put, and $x^{2}$ gets the Power Rule — bring the exponent $2$ down and lower the exponent by one.",
    "why": "Constant multiples factor out, and the rest is one step of the Power Rule; no need to expand $(x+h)^{2}$ from the definition.",
    "steps": [
      "Factor out the constant: $\\frac{d}{dx}(7x^{2})=7\\cdot\\frac{d}{dx}x^{2}$.",
      "Power Rule: $\\frac{d}{dx}x^{2}=2x$.",
      "Multiply: $7\\cdot 2x=14x$."
    ],
    "trap": "Bringing the exponent down but forgetting to subtract one, writing $14x^{2}$; or bringing the exponent down and losing the coefficient $7$, getting $2x$.",
    "check": "Plug in $x=1$: the derivative should be $7\\cdot 2=14$."
  },
  "tmpl-der-simple-power-003": {
    "spot": "The monomial $5x^{6}$: the coefficient $5$ stays put, and $x^{6}$ gets the Power Rule — bring the exponent $6$ down and lower the exponent by one.",
    "why": "Constant multiples factor out, and the rest is one step of the Power Rule; no need to expand $(x+h)^{6}$ from the definition.",
    "steps": [
      "Factor out the constant: $\\frac{d}{dx}(5x^{6})=5\\cdot\\frac{d}{dx}x^{6}$.",
      "Power Rule: $\\frac{d}{dx}x^{6}=6x^{5}$.",
      "Multiply: $5\\cdot 6x^{5}=30x^{5}$."
    ],
    "trap": "Bringing the exponent down but forgetting to subtract one, writing $30x^{6}$; or bringing the exponent down and losing the coefficient $5$, getting $6x^{5}$.",
    "check": "Plug in $x=1$: the derivative should be $5\\cdot 6=30$."
  },
  "tmpl-der-simple-power-004": {
    "spot": "The monomial $9x^{4}$: the coefficient $9$ stays put, and $x^{4}$ gets the Power Rule — bring the exponent $4$ down and lower the exponent by one.",
    "why": "Constant multiples factor out, and the rest is one step of the Power Rule; no need to expand $(x+h)^{4}$ from the definition.",
    "steps": [
      "Factor out the constant: $\\frac{d}{dx}(9x^{4})=9\\cdot\\frac{d}{dx}x^{4}$.",
      "Power Rule: $\\frac{d}{dx}x^{4}=4x^{3}$.",
      "Multiply: $9\\cdot 4x^{3}=36x^{3}$."
    ],
    "trap": "Bringing the exponent down but forgetting to subtract one, writing $36x^{4}$; or bringing the exponent down and losing the coefficient $9$, getting $4x^{3}$.",
    "check": "Plug in $x=1$: the derivative should be $9\\cdot 4=36$."
  },
  "tmpl-der-simple-power-005": {
    "spot": "The monomial $3x^{8}$: the coefficient $3$ stays put, and $x^{8}$ gets the Power Rule — bring the exponent $8$ down and lower the exponent by one.",
    "why": "Constant multiples factor out, and the rest is one step of the Power Rule; no need to expand $(x+h)^{8}$ from the definition.",
    "steps": [
      "Factor out the constant: $\\frac{d}{dx}(3x^{8})=3\\cdot\\frac{d}{dx}x^{8}$.",
      "Power Rule: $\\frac{d}{dx}x^{8}=8x^{7}$.",
      "Multiply: $3\\cdot 8x^{7}=24x^{7}$."
    ],
    "trap": "Bringing the exponent down but forgetting to subtract one, writing $24x^{8}$; or bringing the exponent down and losing the coefficient $3$, getting $8x^{7}$.",
    "check": "Plug in $x=1$: the derivative should be $3\\cdot 8=24$."
  },
  "tmpl-der-simple-power-006": {
    "spot": "The monomial $11x^{5}$: the coefficient $11$ stays put, and $x^{5}$ gets the Power Rule — bring the exponent $5$ down and lower the exponent by one.",
    "why": "Constant multiples factor out, and the rest is one step of the Power Rule; no need to expand $(x+h)^{5}$ from the definition.",
    "steps": [
      "Factor out the constant: $\\frac{d}{dx}(11x^{5})=11\\cdot\\frac{d}{dx}x^{5}$.",
      "Power Rule: $\\frac{d}{dx}x^{5}=5x^{4}$.",
      "Multiply: $11\\cdot 5x^{4}=55x^{4}$."
    ],
    "trap": "Bringing the exponent down but forgetting to subtract one, writing $55x^{5}$; or bringing the exponent down and losing the coefficient $11$, getting $5x^{4}$.",
    "check": "Plug in $x=1$: the derivative should be $11\\cdot 5=55$."
  },
  "tmpl-der-sin-002": {
    "spot": "Inside the sine is $3x$, not $x$: outer $\\sin u$, inner $u=3x$; after the outer derivative, multiply by the inner derivative $3$.",
    "why": "The Chain Rule does it in one step; expanding $\\sin(3x)$ with angle-addition formulas first only makes it longer.",
    "steps": [
      "The derivative of the outer $\\sin u$ is $\\cos u$.",
      "The derivative of the inner $u=3x$ is $3$.",
      "Multiply: $\\frac{d}{dx}\\sin(3x)=3\\cos(3x)$."
    ],
    "trap": "Writing $\\cos(3x)$ and dropping the $3$, or writing $-3\\cos(3x)$ — the minus sign only appears when differentiating $\\cos$.",
    "check": "Near $x=0$, $\\sin(3x)\\approx 3x$, so the slope should be $3$."
  },
  "tmpl-der-sin-003": {
    "spot": "Inside the sine is $4x$, not $x$: outer $\\sin u$, inner $u=4x$; after the outer derivative, multiply by the inner derivative $4$.",
    "why": "The Chain Rule does it in one step; expanding $\\sin(4x)$ with angle-addition formulas first only makes it longer.",
    "steps": [
      "The derivative of the outer $\\sin u$ is $\\cos u$.",
      "The derivative of the inner $u=4x$ is $4$.",
      "Multiply: $\\frac{d}{dx}\\sin(4x)=4\\cos(4x)$."
    ],
    "trap": "Writing $\\cos(4x)$ and dropping the $4$, or writing $-4\\cos(4x)$ — the minus sign only appears when differentiating $\\cos$.",
    "check": "Near $x=0$, $\\sin(4x)\\approx 4x$, so the slope should be $4$."
  },
  "tmpl-der-sin-004": {
    "spot": "Inside the sine is $5x$, not $x$: outer $\\sin u$, inner $u=5x$; after the outer derivative, multiply by the inner derivative $5$.",
    "why": "The Chain Rule does it in one step; expanding $\\sin(5x)$ with angle-addition formulas first only makes it longer.",
    "steps": [
      "The derivative of the outer $\\sin u$ is $\\cos u$.",
      "The derivative of the inner $u=5x$ is $5$.",
      "Multiply: $\\frac{d}{dx}\\sin(5x)=5\\cos(5x)$."
    ],
    "trap": "Writing $\\cos(5x)$ and dropping the $5$, or writing $-5\\cos(5x)$ — the minus sign only appears when differentiating $\\cos$.",
    "check": "Near $x=0$, $\\sin(5x)\\approx 5x$, so the slope should be $5$."
  },
  "tmpl-der-sin-005": {
    "spot": "Inside the sine is $6x$, not $x$: outer $\\sin u$, inner $u=6x$; after the outer derivative, multiply by the inner derivative $6$.",
    "why": "The Chain Rule does it in one step; expanding $\\sin(6x)$ with angle-addition formulas first only makes it longer.",
    "steps": [
      "The derivative of the outer $\\sin u$ is $\\cos u$.",
      "The derivative of the inner $u=6x$ is $6$.",
      "Multiply: $\\frac{d}{dx}\\sin(6x)=6\\cos(6x)$."
    ],
    "trap": "Writing $\\cos(6x)$ and dropping the $6$, or writing $-6\\cos(6x)$ — the minus sign only appears when differentiating $\\cos$.",
    "check": "Near $x=0$, $\\sin(6x)\\approx 6x$, so the slope should be $6$."
  },
  "tmpl-der-sin-006": {
    "spot": "Inside the sine is $7x$, not $x$: outer $\\sin u$, inner $u=7x$; after the outer derivative, multiply by the inner derivative $7$.",
    "why": "The Chain Rule does it in one step; expanding $\\sin(7x)$ with angle-addition formulas first only makes it longer.",
    "steps": [
      "The derivative of the outer $\\sin u$ is $\\cos u$.",
      "The derivative of the inner $u=7x$ is $7$.",
      "Multiply: $\\frac{d}{dx}\\sin(7x)=7\\cos(7x)$."
    ],
    "trap": "Writing $\\cos(7x)$ and dropping the $7$, or writing $-7\\cos(7x)$ — the minus sign only appears when differentiating $\\cos$.",
    "check": "Near $x=0$, $\\sin(7x)\\approx 7x$, so the slope should be $7$."
  },
  "tmpl-lim-direct-003": {
    "spot": "$3x+7$ is a linear polynomial, continuous everywhere; the limit as $x\\to 4$ is just $4$ plugged in.",
    "why": "Polynomials are continuous, so the limit equals the function value; no factoring or L'Hôpital's Rule — those are for $\\frac{0}{0}$.",
    "steps": [
      "Polynomials are continuous at every point, so $\\lim_{x\\to 4}(3x+7)=3\\cdot 4+7$.",
      "Compute: $12+7=19$.",
      "The limit is $19$."
    ],
    "trap": "Thinking a limit must \"approach\" and you can't just plug in, then doing a pile of manipulations; for a continuous function, plugging in is the answer.",
    "check": "Plug in a nearby point $x=4.01$: the value is $19+3\\cdot 0.01$, very close to $19$."
  },
  "tmpl-lim-direct-004": {
    "spot": "$2x+9$ is a linear polynomial, continuous everywhere; the limit as $x\\to 5$ is just $5$ plugged in.",
    "why": "Polynomials are continuous, so the limit equals the function value; no factoring or L'Hôpital's Rule — those are for $\\frac{0}{0}$.",
    "steps": [
      "Polynomials are continuous at every point, so $\\lim_{x\\to 5}(2x+9)=2\\cdot 5+9$.",
      "Compute: $10+9=19$.",
      "The limit is $19$."
    ],
    "trap": "Thinking a limit must \"approach\" and you can't just plug in, then doing a pile of manipulations; for a continuous function, plugging in is the answer.",
    "check": "Plug in a nearby point $x=5.01$: the value is $19+2\\cdot 0.01$, very close to $19$."
  },
  "tmpl-lim-direct-005": {
    "spot": "$8x+3$ is a linear polynomial, continuous everywhere; the limit as $x\\to 1$ is just $1$ plugged in.",
    "why": "Polynomials are continuous, so the limit equals the function value; no factoring or L'Hôpital's Rule — those are for $\\frac{0}{0}$.",
    "steps": [
      "Polynomials are continuous at every point, so $\\lim_{x\\to 1}(8x+3)=8\\cdot 1+3$.",
      "Compute: $8+3=11$.",
      "The limit is $11$."
    ],
    "trap": "Thinking a limit must \"approach\" and you can't just plug in, then doing a pile of manipulations; for a continuous function, plugging in is the answer.",
    "check": "Plug in a nearby point $x=1.01$: the value is $11+8\\cdot 0.01$, very close to $11$."
  },
  "tmpl-lim-direct-006": {
    "spot": "$4x+2$ is a linear polynomial, continuous everywhere; the limit as $x\\to 6$ is just $6$ plugged in.",
    "why": "Polynomials are continuous, so the limit equals the function value; no factoring or L'Hôpital's Rule — those are for $\\frac{0}{0}$.",
    "steps": [
      "Polynomials are continuous at every point, so $\\lim_{x\\to 6}(4x+2)=4\\cdot 6+2$.",
      "Compute: $24+2=26$.",
      "The limit is $26$."
    ],
    "trap": "Thinking a limit must \"approach\" and you can't just plug in, then doing a pile of manipulations; for a continuous function, plugging in is the answer.",
    "check": "Plug in a nearby point $x=6.01$: the value is $26+4\\cdot 0.01$, very close to $26$."
  },
  "tmpl-lim-factor-003": {
    "spot": "Plugging in $x=5$ gives $\\frac{0}{0}$, and the numerator $x^2-25$ is a difference of squares hiding the denominator's $x-5$.",
    "why": "Factor and cancel the factor that causes the $0$ — one line; L'Hôpital's Rule works too, but it's overkill.",
    "steps": [
      "Plug in directly: numerator $25-25=0$, denominator $5-5=0$, the $\\frac{0}{0}$ form.",
      "Difference of squares: $x^2-25=(x-5)(x+5)$.",
      "For $x\\ne 5$, cancel $x-5$, leaving $x+5$.",
      "$x+5$ is continuous; plugging in $x=5$ gives $10$."
    ],
    "trap": "Seeing $\\frac{0}{0}$ and saying the limit is $0$ or doesn't exist — $\\frac{0}{0}$ just means \"not done yet\".",
    "check": "Plug in a very close point: at $x=5.001$, $\\frac{x^2-25}{x-5}=10.001$."
  },
  "tmpl-lim-factor-005": {
    "spot": "Plugging in $x=6$ gives $\\frac{0}{0}$, and the numerator $x^2-36$ is a difference of squares hiding the denominator's $x-6$.",
    "why": "Factor and cancel the factor that causes the $0$ — one line; L'Hôpital's Rule works too, but it's overkill.",
    "steps": [
      "Plug in directly: numerator $36-36=0$, denominator $6-6=0$, the $\\frac{0}{0}$ form.",
      "Difference of squares: $x^2-36=(x-6)(x+6)$.",
      "For $x\\ne 6$, cancel $x-6$, leaving $x+6$.",
      "$x+6$ is continuous; plugging in $x=6$ gives $12$."
    ],
    "trap": "Seeing $\\frac{0}{0}$ and saying the limit is $0$ or doesn't exist — $\\frac{0}{0}$ just means \"not done yet\".",
    "check": "Plug in a very close point: at $x=6.001$, $\\frac{x^2-36}{x-6}=12.001$."
  },
  "tmpl-lim-factor-006": {
    "spot": "Plugging in $x=7$ gives $\\frac{0}{0}$, and the numerator $x^2-49$ is a difference of squares hiding the denominator's $x-7$.",
    "why": "Factor and cancel the factor that causes the $0$ — one line; L'Hôpital's Rule works too, but it's overkill.",
    "steps": [
      "Plug in directly: numerator $49-49=0$, denominator $7-7=0$, the $\\frac{0}{0}$ form.",
      "Difference of squares: $x^2-49=(x-7)(x+7)$.",
      "For $x\\ne 7$, cancel $x-7$, leaving $x+7$.",
      "$x+7$ is continuous; plugging in $x=7$ gives $14$."
    ],
    "trap": "Seeing $\\frac{0}{0}$ and saying the limit is $0$ or doesn't exist — $\\frac{0}{0}$ just means \"not done yet\".",
    "check": "Plug in a very close point: at $x=7.001$, $\\frac{x^2-49}{x-7}=14.001$."
  },
  "tmpl-lim-rational-001": {
    "spot": "$x\\to\\infty$ with linear numerator and denominator: look only at the leading terms $3x$ and $2x$; the constants $1$ and $5$ become negligible as $x$ grows.",
    "why": "Dividing top and bottom by $x$ turns the constants into $\\frac{1}{x}$ and $\\frac{5}{x}$, which go to $0$; plugging in $\\infty$ directly only gives the meaningless $\\frac{\\infty}{\\infty}$.",
    "steps": [
      "Divide numerator and denominator by $x$: $\\frac{3x+1}{2x+5}=\\frac{3+\\frac{1}{x}}{2+\\frac{5}{x}}$.",
      "As $x\\to\\infty$, $\\frac{1}{x}\\to 0$ and $\\frac{5}{x}\\to 0$.",
      "What's left is the ratio of leading coefficients, $\\frac{3}{2}$."
    ],
    "trap": "Comparing the constants too and writing $\\frac{1}{5}$; or thinking $\\frac{\\infty}{\\infty}=1$. For large $x$, the coefficients of $x$ decide the ratio.",
    "check": "Plug in $x=1000$: $\\frac{3001}{2005}$ is already very close to $\\frac{3}{2}$."
  },
  "tmpl-lim-rational-002": {
    "spot": "$x\\to\\infty$ with linear numerator and denominator: look only at the leading terms $5x$ and $4x$; the constants $2$ and $1$ become negligible as $x$ grows.",
    "why": "Dividing top and bottom by $x$ turns the constants into $\\frac{2}{x}$ and $\\frac{1}{x}$, which go to $0$; plugging in $\\infty$ directly only gives the meaningless $\\frac{\\infty}{\\infty}$.",
    "steps": [
      "Divide numerator and denominator by $x$: $\\frac{5x+2}{4x+1}=\\frac{5+\\frac{2}{x}}{4+\\frac{1}{x}}$.",
      "As $x\\to\\infty$, $\\frac{2}{x}\\to 0$ and $\\frac{1}{x}\\to 0$.",
      "What's left is the ratio of leading coefficients, $\\frac{5}{4}$."
    ],
    "trap": "Comparing the constants too and writing $\\frac{2}{1}$; or thinking $\\frac{\\infty}{\\infty}=1$. For large $x$, the coefficients of $x$ decide the ratio.",
    "check": "Plug in $x=1000$: $\\frac{5002}{4001}$ is already very close to $\\frac{5}{4}$."
  },
  "tmpl-lim-rational-003": {
    "spot": "$x\\to\\infty$ with linear numerator and denominator: look only at the leading terms $7x$ and $3x$; the constants $3$ and $2$ become negligible as $x$ grows.",
    "why": "Dividing top and bottom by $x$ turns the constants into $\\frac{3}{x}$ and $\\frac{2}{x}$, which go to $0$; plugging in $\\infty$ directly only gives the meaningless $\\frac{\\infty}{\\infty}$.",
    "steps": [
      "Divide numerator and denominator by $x$: $\\frac{7x+3}{3x+2}=\\frac{7+\\frac{3}{x}}{3+\\frac{2}{x}}$.",
      "As $x\\to\\infty$, $\\frac{3}{x}\\to 0$ and $\\frac{2}{x}\\to 0$.",
      "What's left is the ratio of leading coefficients, $\\frac{7}{3}$."
    ],
    "trap": "Comparing the constants too and writing $\\frac{3}{2}$; or thinking $\\frac{\\infty}{\\infty}=1$. For large $x$, the coefficients of $x$ decide the ratio.",
    "check": "Plug in $x=1000$: $\\frac{7003}{3002}$ is already very close to $\\frac{7}{3}$."
  },
  "tmpl-lim-rational-004": {
    "spot": "$x\\to\\infty$ with linear numerator and denominator: look only at the leading terms $2x$ and $5x$; the constants $9$ and $4$ become negligible as $x$ grows.",
    "why": "Dividing top and bottom by $x$ turns the constants into $\\frac{9}{x}$ and $\\frac{4}{x}$, which go to $0$; plugging in $\\infty$ directly only gives the meaningless $\\frac{\\infty}{\\infty}$.",
    "steps": [
      "Divide numerator and denominator by $x$: $\\frac{2x+9}{5x+4}=\\frac{2+\\frac{9}{x}}{5+\\frac{4}{x}}$.",
      "As $x\\to\\infty$, $\\frac{9}{x}\\to 0$ and $\\frac{4}{x}\\to 0$.",
      "What's left is the ratio of leading coefficients, $\\frac{2}{5}$."
    ],
    "trap": "Comparing the constants too and writing $\\frac{9}{4}$; or thinking $\\frac{\\infty}{\\infty}=1$. For large $x$, the coefficients of $x$ decide the ratio.",
    "check": "Plug in $x=1000$: $\\frac{2009}{5004}$ is already very close to $\\frac{2}{5}$."
  },
  "tmpl-lim-rational-005": {
    "spot": "$x\\to\\infty$ with linear numerator and denominator: look only at the leading terms $6x$ and $4x$; the constants $1$ and $7$ become negligible as $x$ grows.",
    "why": "Dividing top and bottom by $x$ turns the constants into $\\frac{1}{x}$ and $\\frac{7}{x}$, which go to $0$; plugging in $\\infty$ directly only gives the meaningless $\\frac{\\infty}{\\infty}$.",
    "steps": [
      "Divide numerator and denominator by $x$: $\\frac{6x+1}{4x+7}=\\frac{6+\\frac{1}{x}}{4+\\frac{7}{x}}$.",
      "As $x\\to\\infty$, $\\frac{1}{x}\\to 0$ and $\\frac{7}{x}\\to 0$.",
      "What's left is the ratio of leading coefficients, $\\frac{6}{4}$, which reduces to $\\frac{3}{2}$."
    ],
    "trap": "Comparing the constants too and writing $\\frac{1}{7}$; or thinking $\\frac{\\infty}{\\infty}=1$. For large $x$, the coefficients of $x$ decide the ratio.",
    "check": "Plug in $x=1000$: $\\frac{6001}{4007}$ is already very close to $\\frac{3}{2}$."
  },
  "tmpl-lim-rational-006": {
    "spot": "$x\\to\\infty$ with linear numerator and denominator: look only at the leading terms $9x$ and $6x$; the constants $2$ and $5$ become negligible as $x$ grows.",
    "why": "Dividing top and bottom by $x$ turns the constants into $\\frac{2}{x}$ and $\\frac{5}{x}$, which go to $0$; plugging in $\\infty$ directly only gives the meaningless $\\frac{\\infty}{\\infty}$.",
    "steps": [
      "Divide numerator and denominator by $x$: $\\frac{9x+2}{6x+5}=\\frac{9+\\frac{2}{x}}{6+\\frac{5}{x}}$.",
      "As $x\\to\\infty$, $\\frac{2}{x}\\to 0$ and $\\frac{5}{x}\\to 0$.",
      "What's left is the ratio of leading coefficients, $\\frac{9}{6}$, which reduces to $\\frac{3}{2}$."
    ],
    "trap": "Comparing the constants too and writing $\\frac{2}{5}$; or thinking $\\frac{\\infty}{\\infty}=1$. For large $x$, the coefficients of $x$ decide the ratio.",
    "check": "Plug in $x=1000$: $\\frac{9002}{6005}$ is already very close to $\\frac{3}{2}$."
  },
  "ap-kin-005": {
    "spot": "It asks for total distance, not displacement: $v(t)=t^2-4t+3=(t-1)(t-3)$ changes sign at $t=1$ and $t=3$, so you integrate $|v|$ and must split at those points.",
    "why": "Integrating $v$ directly only gives displacement, where the backward stretch cancels out; find the zeros of the velocity, split there, and take absolute values on each piece to get distance.",
    "steps": [
      "Factor: $v(t)=(t-1)(t-3)$, with zeros $t=1$ and $t=3$.",
      "On $[0,1]$, $v\\ge 0$: $\\int_0^1 v\\,dt=\\frac13-2+3=\\frac43$.",
      "On $[1,3]$, $v\\le 0$ (moving backward): $\\int_1^3 v\\,dt=-\\frac43$, so this stretch covers a distance of $\\frac43$.",
      "On $[3,4]$, $v\\ge 0$: $\\int_3^4 v\\,dt=\\frac43$.",
      "Total distance $\\frac43+\\frac43+\\frac43=4$."
    ],
    "trap": "Computing $\\int_0^4 v\\,dt=\\frac43$ directly — that's the displacement; the backward $\\frac43$ in the middle got cancelled.",
    "check": "The displacement $\\frac43$ can't exceed the distance $4$, and the two differ by exactly twice the backward stretch."
  },
  "app-005": {
    "spot": "Finding $\\sqrt2$ means solving $f(x)=x^2-2=0$; one step of Newton's method is $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$ with $x_0=1$.",
    "why": "Rewrite the square root as an equation and apply Newton's formula once; the problem asks for only one iteration, so no need to iterate to convergence.",
    "steps": [
      "Take $f(x)=x^2-2$, $f'(x)=2x$.",
      "Plug in $x_0=1$: $f(1)=-1$, $f'(1)=2$.",
      "$x_1=1-\\frac{-1}{2}=\\frac32$."
    ],
    "trap": "Turning the minus into a plus: $1+\\frac{-1}{2}=\\frac12$, even farther from $\\sqrt2$ — starting at $1$, Newton's method should move right.",
    "check": "$\\frac32=1.5$ is a bit bigger than $\\sqrt2\\approx 1.414$, and much closer than the starting point $1$."
  },
  "ch-inv-010": {
    "spot": "$\\tan(\\arcsin u)$ is a trig function of an inverse trig function: draw a right triangle to turn it into the algebraic $\\frac{u}{\\sqrt{1-u^2}}$, then use the Chain Rule with $u=x^2$.",
    "why": "Three layers of Chain Rule directly produces $\\sec^2(\\arcsin x^2)$, which still needs simplifying; converting the outer two layers to algebra first makes the derivative much cleaner.",
    "steps": [
      "Right triangle with $\\sin\\theta=u$: opposite $u$, hypotenuse $1$, adjacent $\\sqrt{1-u^2}$, so $\\tan(\\arcsin u)=\\frac{u}{\\sqrt{1-u^2}}$.",
      "Differentiate in $u$: $\\frac{d}{du}\\frac{u}{\\sqrt{1-u^2}}=\\frac{(1-u^2)+u^2}{(1-u^2)^{3/2}}=\\frac{1}{(1-u^2)^{3/2}}$.",
      "The derivative of the inner $u=x^2$ is $2x$; multiply and substitute $u^2=x^4$ back.",
      "Result: $\\frac{2x}{(1-x^4)^{3/2}}$."
    ],
    "trap": "Forgetting the inner $2x$, or substituting $u^2$ back as $x^2$ to get $(1-x^2)^{3/2}$; with $u=x^2$, $u^2=x^4$.",
    "check": "At $x=0$ the derivative should be $0$: $x^2$ is flat at the origin, so whatever is wrapped around it has slope $0$."
  },
  "ch-trap-007": {
    "spot": "Inside the $\\ln$ is a root of a fraction: use log rules first to turn the root into $\\frac12$ and the division into subtraction, then differentiate.",
    "why": "Split the $\\ln$ first and each term is just $\\frac{1}{1\\pm x}$; forcing the Chain Rule means differentiating a root and a quotient together, which is error-prone.",
    "steps": [
      "Log rules: $\\ln\\sqrt{\\frac{1+x}{1-x}}=\\frac12\\left[\\ln(1+x)-\\ln(1-x)\\right]$.",
      "Differentiate term by term: $\\frac12\\left[\\frac{1}{1+x}+\\frac{1}{1-x}\\right]$ ($-\\ln(1-x)$ differentiates to a plus sign).",
      "Common denominator: $\\frac12\\cdot\\frac{(1-x)+(1+x)}{1-x^2}=\\frac{1}{1-x^2}$.",
      "Answer: $\\frac{1}{1-x^2}$."
    ],
    "trap": "Getting the sign of the derivative of $-\\ln(1-x)$ wrong, writing $\\frac12\\left[\\frac{1}{1+x}-\\frac{1}{1-x}\\right]=\\frac{-x}{1-x^2}$; the inner $1-x$ has derivative $-1$, and two negatives make a positive.",
    "check": "At $x=0$ the function is $\\ln 1=0$ and nearby it's about $x$, so the slope should be $1$."
  },
  "cl-der-006": {
    "spot": "Each derivative of $xe^x$ adds one more $e^x$: $(xe^x)'=(x+1)e^x$, $(xe^x)''=(x+2)e^x$ — the pattern is that each derivative adds $1$ after the $x$.",
    "why": "You need the tenth derivative, so going one order at a time is too slow; differentiate two or three times to see the pattern $(x+n)e^x$, or use the Leibniz formula ($x$ can only be differentiated once) to get it in one step.",
    "steps": [
      "First: $(xe^x)'=e^x+xe^x=(x+1)e^x$.",
      "Second: $((x+1)e^x)'=(x+2)e^x$.",
      "Each derivative adds one more $e^x$, so $f^{(n)}(x)=(x+n)e^x$; the Leibniz formula also gives $x\\cdot e^x+n\\cdot 1\\cdot e^x$.",
      "$f^{(10)}(0)=(0+10)e^0=10$."
    ],
    "trap": "Thinking $e^x$ never changes no matter how often you differentiate, answering $f^{(10)}=xe^x$ and getting $0$ at $0$; every Product Rule step spits out an extra $e^x$.",
    "check": "Taylor expansion: $xe^x=\\sum\\frac{x^{k+1}}{k!}$, the coefficient of $x^{10}$ is $\\frac{1}{9!}$, and times $10!$ that gives $10$."
  },
  "cl-der-009": {
    "spot": "The angle between two curves = the angle between their tangent lines at the intersection; the line has slope $1$, the parabola has slope $2$ at $x=1$, so use $\\tan\\theta=\\left|\\frac{m_2-m_1}{1+m_1m_2}\\right|$.",
    "why": "A curve's direction is set by its tangent line; once you have the two slopes, the tangent-of-difference formula is fastest. Dot products also work but require computing lengths.",
    "steps": [
      "The line $y=x$ has slope $m_1=1$; for the parabola $y'=2x$, so at $x=1$ the slope is $m_2=2$.",
      "$\\tan\\theta=\\left|\\frac{2-1}{1+2\\cdot 1}\\right|=\\frac13$.",
      "Same thing another way: the tangent lines have inclination angles $\\arctan 2$ and $\\arctan 1$, and their difference is the angle between them.",
      "The acute angle is $\\theta=\\arctan\\frac13\\approx 0.322$."
    ],
    "trap": "Writing the denominator as $1-m_1m_2$, getting $\\tan\\theta=-1$ and answering $\\frac{\\pi}{4}$; the formula has $1+m_1m_2$.",
    "check": "$\\arctan\\frac13\\approx 0.32$ radians (about $18.4^\\circ$), between $0$ and $\\frac{\\pi}{2}$, so it is indeed acute."
  },
  "cl-int-004": {
    "spot": "Mean Value Theorem for integrals: $f(\\xi)=\\frac{1}{b-a}\\int_a^b f$. Compute the average first, then solve $\\xi^2=$ the average, taking the root in $[0,3]$.",
    "why": "The theorem only guarantees existence; to find the point, compute the average and solve back. $x^2$ is increasing on $[0,3]$, so there is only one solution.",
    "steps": [
      "$\\int_0^3 x^2\\,dx=9$.",
      "The average is $\\frac{9}{3}=3$.",
      "Solve $\\xi^2=3$ and take $\\xi=\\sqrt3$ in $[0,3]$ ($-\\sqrt3$ is not in the interval).",
      "$\\xi=\\sqrt3\\approx 1.732$."
    ],
    "trap": "Using $\\int_0^3 x^2\\,dx=9$ as the average and forgetting to divide by the length $3$, which gives $\\xi=3$; or using the endpoint average $\\frac{0+9}{2}$ as the average value.",
    "check": "$\\sqrt3\\approx 1.73$ lies to the right of the midpoint $1.5$: $x^2$ is convex, so its average is larger than its value at the midpoint, $2.25$."
  },
  "cl-int-005": {
    "spot": "The antiderivative of $\\frac1x$ is $\\ln x$, and the interval $[1,e]$ makes the $\\ln$ integrate to exactly $1$; the average is $\\frac{1}{e-1}$, then solve $\\frac{1}{\\xi}=$ the average.",
    "why": "The $\\xi$ in the Mean Value Theorem is found by solving $f(\\xi)=$ the average; $\\frac1x$ is strictly decreasing, so the solution is unique.",
    "steps": [
      "$\\int_1^e\\frac{dx}{x}=\\ln e-\\ln 1=1$.",
      "The interval has length $e-1$, so the average is $\\frac{1}{e-1}$.",
      "Solving $\\frac{1}{\\xi}=\\frac{1}{e-1}$ gives $\\xi=e-1\\approx 1.718$, which is in $[1,e]$.",
      "$\\xi=e-1$."
    ],
    "trap": "Forgetting to divide by the interval length, taking the average to be $1$, and getting $\\xi=1$ (an endpoint).",
    "check": "$e-1\\approx 1.718$ lies to the left of the midpoint $\\frac{1+e}{2}\\approx 1.859$: $\\frac1x$ is convex, so its average is larger than its value at the midpoint."
  },
  "cl-int-006": {
    "spot": "Water pressure changes with depth: at depth $y$ the pressure is $\\rho g\\,y$, a thin strip of width $2$ feels force $\\rho g\\,y\\cdot 2\\,dy$, and you integrate from the surface $y=0$ to the bottom $y=3$.",
    "why": "Pressure isn't constant, so you can't do pressure times area; slice into horizontal strips, each at a single depth, then add them up.",
    "steps": [
      "Strip at depth $y$: area $2\\,dy$, pressure $9800y$, force $9800\\cdot 2y\\,dy$.",
      "$F=\\int_0^3 19600\\,y\\,dy=19600\\cdot\\frac{9}{2}$.",
      "$F=88200$ N."
    ],
    "trap": "Multiplying the pressure at the bottom by the whole area: $9800\\cdot 3\\cdot 6=176400$, double the true value; the top edge feels pressure $0$.",
    "check": "Equivalent method: the average depth (depth of the centroid) $1.5$ m times the area $6$ square meters times $\\rho g$."
  },
  "cl-int-010": {
    "spot": "Hooke's law $F=kx$: first use \"$10$ N stretches it $0.04$ m\" to find $k$; work is $\\int kx\\,dx$, with limits from extension $0.06$ to $0.10$ m.",
    "why": "The spring force grows with extension, so work isn't force times distance; integrate $\\int kx\\,dx$, and convert to meters so you get joules.",
    "steps": [
      "$k=\\frac{10}{0.04}=250$ N per m.",
      "$W=\\int_{0.06}^{0.10}250x\\,dx=125\\left(0.10^2-0.06^2\\right)$.",
      "$125\\cdot 0.0064=0.8=\\frac45$ J."
    ],
    "trap": "Computing in centimeters directly: $k=2.5$, $\\int_6^{10}2.5x\\,dx=80$, in N cm, not joules (off by a factor of $100$).",
    "check": "The work lies between smallest force times distance and largest force times distance: $15\\cdot 0.04=0.6$ to $25\\cdot 0.04=1$."
  },
  "cl-lim-002": {
    "spot": "Both pieces are standard equivalents as $x\\to 0$: $\\ln(1+x^2)\\sim x^2$ and $1-\\cos 2x\\sim\\frac{(2x)^2}{2}=2x^2$; same order, so you can add them directly.",
    "why": "Both terms are positive and of order $x^2$, so nothing cancels; substitute the equivalents and add. Higher-order terms aren't needed here.",
    "steps": [
      "$\\ln(1+u)\\sim u$ with $u=x^2$: $\\ln(1+x^2)\\sim x^2$.",
      "$1-\\cos v\\sim\\frac{v^2}{2}$ with $v=2x$: $1-\\cos 2x\\sim 2x^2$.",
      "Add: $x^2+2x^2=3x^2$, so $c=3$."
    ],
    "trap": "Remembering $1-\\cos 2x$ as $\\sim\\frac{x^2}{2}$ (forgetting the $2$ inside the square), which gives $c=\\frac32$; $(2x)^2=4x^2$, and half of that is $2x^2$.",
    "check": "Plug in $x=0.01$: the ratio is about $2.99993$, very close to $3$."
  },
  "cl-lim-016": {
    "spot": "Numerator and denominator are both a linear term $+$ a bounded trig function: $\\sin x$ and $\\cos x$ stay between $-1$ and $1$, so they vanish after dividing by $x$.",
    "why": "L'Hôpital's Rule fails here (you get $\\frac{2-\\cos x}{3-\\sin x}$, which has no limit); dividing by $x$ plus bounded-times-vanishing settles it.",
    "steps": [
      "Divide by $x$: $\\frac{2-\\frac{\\sin x}{x}}{3+\\frac{\\cos x}{x}}$.",
      "$\\left|\\frac{\\sin x}{x}\\right|\\le\\frac1x\\to 0$, and likewise $\\frac{\\cos x}{x}$ goes to $0$.",
      "The limit is $\\frac23$."
    ],
    "trap": "Applying L'Hôpital's Rule to get $\\frac{2-\\cos x}{3-\\sin x}$, seeing it oscillate, and saying the limit doesn't exist; L'Hôpital failing doesn't mean the original limit doesn't exist.",
    "check": "Plug in $x=1000$: $\\frac{2000-\\sin 1000}{3000+\\cos 1000}$ differs from $\\frac23$ by less than a thousandth."
  },
  "cl-lim-017": {
    "spot": "Quadratics under the roots with $x\\to+\\infty$: $\\sqrt{9x^2+1}\\approx 3x$ and $\\sqrt{x^2+4}\\approx x$, and the ratio of dominant terms is the answer.",
    "why": "Divide top and bottom by $x$ (for $x>0$, $x=\\sqrt{x^2}$, so it can go inside the root), and the constants go to $0$; no L'Hôpital's Rule — differentiating the roots makes it messier.",
    "steps": [
      "For $x>0$, $x=\\sqrt{x^2}$; divide top and bottom: $\\frac{\\sqrt{9+\\frac{1}{x^2}}}{\\sqrt{1+\\frac{4}{x^2}}}$.",
      "$\\frac{1}{x^2}\\to 0$, $\\frac{4}{x^2}\\to 0$.",
      "The limit is $\\frac{\\sqrt9}{\\sqrt1}=3$."
    ],
    "trap": "Dropping the roots entirely and writing $\\frac{9x^2+1}{x^2+4}\\to 9$; the $9$ under the root comes out as $3$.",
    "check": "Plug in $x=100$: $\\frac{\\sqrt{90001}}{\\sqrt{10004}}\\approx 2.9995$."
  },
  "cl-lim-028": {
    "spot": "The floor function $\\lfloor u\\rfloor$ only jumps when $u$ crosses an integer; $u=x^2$ increases continuously from $0$ to $9$ on $(0,3)$, so just count the integers it passes.",
    "why": "$x^2$ is strictly increasing on $(0,3)$, so each integer value is passed exactly once and each time it really jumps by one; graphing piece by piece also works, but counting integers is fastest.",
    "steps": [
      "For $x\\in(0,3)$, $x^2\\in(0,9)$, continuous and strictly increasing.",
      "$\\lfloor x^2\\rfloor$ jumps when $x^2=k$ ($k$ an integer), that is, at $x=\\sqrt k$.",
      "The integers in $(0,9)$ are $1,2,\\dots,8$, corresponding to $x=1,\\sqrt2,\\dots,\\sqrt8$, all inside $(0,3)$.",
      "At $x=3$, $x^2=9$ is also an integer, but the endpoint isn't in the open interval, so it doesn't count. That's $8$ discontinuities."
    ],
    "trap": "Counting $x=3$ ($x^2=9$) too and answering $9$, or counting only integer values of $x$, $1,2$, and answering $2$; the jumps happen where $x^2$ hits an integer.",
    "check": "$\\sqrt8\\approx 2.83$ is the last jump point; the next one, $\\sqrt9=3$, falls just outside the interval."
  },
  "cl-lim-050": {
    "spot": "$n\\ln\\left(1+\\frac{0.06}{n}\\right)$ is of the form $\\infty\\cdot 0$; let $u=\\frac{0.06}{n}$, and it becomes $0.06\\cdot\\frac{\\ln(1+u)}{u}\\to 0.06$.",
    "why": "Recognizing the standard limit $\\frac{\\ln(1+u)}{u}\\to 1$ gives the denominator in one step; L'Hôpital's Rule in $n$ needs rewriting as a quotient first, which is slower.",
    "steps": [
      "Let $u=\\frac{0.06}{n}$: $n\\ln\\left(1+\\frac{0.06}{n}\\right)=0.06\\cdot\\frac{\\ln(1+u)}{u}$.",
      "As $n\\to\\infty$, $u\\to 0$ and $\\frac{\\ln(1+u)}{u}\\to 1$, so the denominator tends to $0.06$.",
      "$T_\\infty=\\frac{\\ln 2}{0.06}=\\frac{50\\ln 2}{3}\\approx 11.55$ years."
    ],
    "trap": "Thinking that as $n\\to\\infty$, $\\ln\\left(1+\\frac{0.06}{n}\\right)\\to 0$ so $T\\to\\infty$; there's a factor $n$ in front, and the product settles at $0.06$.",
    "check": "Compounding once a year gives $\\frac{\\ln 2}{\\ln 1.06}\\approx 11.9$ years; continuous compounding should be a bit faster."
  },
  "cl-ser-001": {
    "spot": "An alternating series whose terms in absolute value, $\\frac{1}{n^3}$, decrease to $0$: the error is at most the first omitted term, $\\frac{1}{(N+1)^3}$.",
    "why": "For alternating series estimates you only look at the next term; no need to compute the actual sum. Just solve $\\frac{1}{(N+1)^3}<5\\times 10^{-4}$.",
    "steps": [
      "Error $|S-S_N|\\le\\frac{1}{(N+1)^3}$; we need it $<5\\times 10^{-4}$, i.e. $(N+1)^3>2000$.",
      "$12^3=1728<2000$: at $N=11$ the next term is $\\frac{1}{1728}\\approx 5.8\\times 10^{-4}$, not small enough.",
      "$13^3=2197>2000$: at $N=12$ the next term is $\\frac{1}{2197}\\approx 4.6\\times 10^{-4}$, good enough.",
      "The smallest $N$ is $12$."
    ],
    "trap": "Solving $n^3>2000$ for $n=13$ and answering $13$: $13$ is the index of the next term; the partial sum only needs to go to $N=12$.",
    "check": "$\\sqrt[3]{2000}\\approx 12.6$, so $N+1$ is at least $13$."
  },
  "cl-ser-002": {
    "spot": "$\\sum\\frac{(-1)^k}{k!}$ is alternating with $\\frac{1}{k!}$ decreasing: stopping at $k=n$, the error is at most the next term $\\frac{1}{(n+1)!}$.",
    "why": "Just find the first $\\frac{1}{(n+1)!}<10^{-4}$, i.e. $(n+1)!>10000$; factorials grow fast, so listing a few finds it.",
    "steps": [
      "Error $\\le\\frac{1}{(n+1)!}$; we need $(n+1)!>10^4$.",
      "$7!=5040<10^4$: at $n=6$ the next term is $\\frac{1}{5040}\\approx 2\\times 10^{-4}$, not enough.",
      "$8!=40320>10^4$: at $n=7$ the next term is $\\frac{1}{40320}\\approx 2.5\\times 10^{-5}$, good enough.",
      "The smallest $n$ is $7$."
    ],
    "trap": "Giving the index of the next term, $8$, as the answer, or wrongly taking the error to be $\\frac{1}{n!}$ and answering $8$; stopping at $k=n$, the first omitted term is $k=n+1$.",
    "check": "Actual check: the partial sum up to $k=7$ is $\\approx 0.367857$, differing from $\\frac1e\\approx 0.367879$ by only $2.2\\times 10^{-5}$."
  },
  "cl-ser-010": {
    "spot": "$\\frac{1}{n\\,5^n}=\\frac{(1/5)^n}{n}$, which is $\\sum\\frac{x^n}{n}$ at $x=\\frac15$ — the power series of $-\\ln(1-x)$.",
    "why": "Recognize a known power series and plug in; the Ratio Test can only tell you it converges, not the sum.",
    "steps": [
      "Integrate $\\frac{1}{1-x}=\\sum_{n\\ge 0}x^n$ from $0$ to $x$: $-\\ln(1-x)=\\sum_{n\\ge 1}\\frac{x^n}{n}$ ($|x|<1$).",
      "Plug in $x=\\frac15$: the sum is $-\\ln\\frac45=\\ln\\frac54$.",
      "$\\ln\\frac54\\approx 0.2231$."
    ],
    "trap": "Dropping the minus sign and writing $\\ln\\frac45<0$ — a series of positive terms can't have a negative sum.",
    "check": "The first two terms $\\frac15+\\frac1{50}=0.22$ are already very close to $0.2231$, and below it."
  },
  "cl-ser-024": {
    "spot": "$n\\sqrt[10]{n}=n^{1+\\frac{1}{10}}=n^{1.1}$: a $p$-series with $p=1.1$, just barely more than the harmonic series.",
    "why": "Rewrite as $\\sum\\frac{1}{n^p}$ and apply the $p$-series test; it looks like the harmonic series, but $p>1$ means convergence, no matter how small the margin.",
    "steps": [
      "$n\\cdot n^{1/10}=n^{11/10}$, so the series is $\\sum\\frac{1}{n^{1.1}}$.",
      "Integral Test: $\\int_1^M x^{-1.1}dx=10\\left(1-M^{-0.1}\\right)$, bounded above by $10$.",
      "$p=1.1>1$, so the series converges."
    ],
    "trap": "Seeing how much it resembles $\\sum\\frac1n$ and saying it diverges; the extra $\\frac{1}{10}$ in the exponent pushes it over the $p=1$ threshold (it just converges very slowly).",
    "check": "The Integral Test bound $10$ is large, meaning the partial sums need very many terms to approach the limit, but they never blow up to infinity."
  },
  "cl-ser-026": {
    "spot": "The general term has both $n!$ and $n^n$: in the ratio, $n!$ reduces to $n+1$, leaving $\\left(\\frac{n}{n+1}\\right)^n$ — the standard form for $\\frac1e$.",
    "why": "Factorials with powers are cleanest with the Ratio Test: after cancelling, only a limit of the form $\\left(1+\\frac1n\\right)^{-n}$ remains; the Root Test would need Stirling's formula, which is more roundabout.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{3^{n+1}(n+1)!}{(n+1)^{n+1}}\\cdot\\frac{n^n}{3^n n!}=\\frac{3(n+1)\\,n^n}{(n+1)^{n+1}}$.",
      "Cancel one $n+1$: $=3\\left(\\frac{n}{n+1}\\right)^n$.",
      "$\\left(\\frac{n}{n+1}\\right)^n=\\frac{1}{\\left(1+\\frac1n\\right)^n}\\to\\frac1e$.",
      "The limit is $\\frac{3}{e}\\approx 1.104$."
    ],
    "trap": "Thinking $\\left(\\frac{n}{n+1}\\right)^n\\to 1$ (the base tends to $1$) and answering $3$; this is a $1^\\infty$ form, and the limit is $\\frac1e$.",
    "check": "$\\frac3e>1$, so $\\sum a_n$ diverges; at $n=1000$ the ratio is already about $1.1042$."
  },
  "cl-ser-032": {
    "spot": "As $n\\to\\infty$, $\\frac1n\\to 0$ and $e^{1/n}-1\\sim\\frac1n$: the term is of the same order as the harmonic series.",
    "why": "Use the Limit Comparison Test against $\\sum\\frac1n$; the ratio tends to $1$. Just knowing the terms go to $0$ can't decide convergence.",
    "steps": [
      "$e^u-1\\sim u$ (as $u\\to 0$), with $u=\\frac1n$.",
      "Limit comparison: $\\frac{e^{1/n}-1}{1/n}\\to 1$, a finite positive number.",
      "$\\sum\\frac1n$ diverges, so the original series diverges too."
    ],
    "trap": "Seeing the terms $e^{1/n}-1\\to 0$ and saying it converges; terms going to $0$ is only a necessary condition — the harmonic series is the counterexample.",
    "check": "$e^u-1>u$, so every term is bigger than $\\frac1n$, and the direct Comparison Test also gives divergence."
  },
  "cl-ser-048": {
    "spot": "$x=\\pi$ is the seam of the periodic extension: from the left $f(\\pi^-)=1+\\pi$, from the right it wraps around to the next period's $f(-\\pi^+)=0$, so the function jumps here.",
    "why": "Dirichlet's theorem: the Fourier series of a piecewise smooth function converges at a jump to the average of the left and right limits; no need to actually compute Fourier coefficients.",
    "steps": [
      "Left limit: as $x\\to\\pi^-$, $f=1+x\\to 1+\\pi$.",
      "Right limit: after extension, $\\pi^+$ corresponds to $-\\pi^+$, where $f=0$.",
      "It converges to the average $\\frac{(1+\\pi)+0}{2}=\\frac{1+\\pi}{2}$."
    ],
    "trap": "Plugging in $f(\\pi)$ directly: but the definition $x<\\pi$ doesn't include $\\pi$, and after extension $f(\\pi)=f(-\\pi)$ isn't necessarily the limit value either; at a jump, take the average.",
    "check": "$\\frac{1+\\pi}{2}\\approx 2.07$ lies between the one-sided limits $0$ and $4.14$, exactly at the midpoint."
  },
  "cx-avg-002": {
    "spot": "The average value is $\\frac{1}{b-a}\\int_a^b f$; $\\sin x$ on $[0,\\pi]$ is exactly one full arch, with area $2$.",
    "why": "The average of a continuous function is by definition the integral divided by the interval length, and the antiderivative of $\\sin x$ is ready-made; averaging the endpoint values is the wrong concept.",
    "steps": [
      "Average $=\\frac{1}{\\pi-0}\\int_0^\\pi\\sin x\\,dx$; the antiderivative is $-\\cos x$.",
      "$\\int_0^\\pi\\sin x\\,dx=[-\\cos x]_0^\\pi=1+1=2$.",
      "The interval length is $\\pi$, so the average is $\\frac{2}{\\pi}\\approx 0.637$."
    ],
    "trap": "Writing the antiderivative as $\\cos x$, getting $\\cos\\pi-\\cos 0=-2$ and a negative average; $\\sin x$ is nonnegative on this interval, so the average can't be negative.",
    "check": "The average should lie between the minimum $0$ and the maximum $1$."
  },
  "cx-lh-011": {
    "spot": "As $x\\to\\frac{\\pi}{2}$ the denominator is $\\left(\\frac{\\pi}{2}-x\\right)^2$: let $h=\\frac{\\pi}{2}-x\\to 0$, then $\\sin x=\\cos h$, and it becomes the familiar $\\frac{1-\\cos h}{h^2}$.",
    "why": "After the substitution it's the memorized standard limit $\\frac12$; L'Hôpital's Rule twice also works, but the substitution sees through it in one step.",
    "steps": [
      "Plug in $x=\\frac{\\pi}{2}$: numerator $1-1=0$, denominator $0$, the $\\frac{0}{0}$ form.",
      "Let $h=\\frac{\\pi}{2}-x$: $\\sin x=\\sin\\left(\\frac{\\pi}{2}-h\\right)=\\cos h$.",
      "$\\frac{1-\\cos h}{h^2}\\to\\frac12$ ($1-\\cos h\\sim\\frac{h^2}{2}$).",
      "The limit is $\\frac12$."
    ],
    "trap": "Applying L'Hôpital's Rule only once, getting $\\frac{-\\cos x}{-2(\\frac{\\pi}{2}-x)}$, which is still $\\frac{0}{0}$, and stopping to declare the limit doesn't exist; apply it once more.",
    "check": "Plug in $x=\\frac{\\pi}{2}-0.01$: the ratio is about $0.499996$."
  },
  "dd-inv-005": {
    "spot": "$\\tanh$ of $\\ln x$: since $e^{\\ln x}=x$, $\\tanh(\\ln x)$ simplifies to the rational function $\\frac{x^2-1}{x^2+1}$ before differentiating.",
    "why": "After simplifying, only one Quotient Rule is left; the Chain Rule directly gives $\\frac{\\operatorname{sech}^2(\\ln x)}{x}$, and then you still have to convert $\\operatorname{sech}$ back to $x$.",
    "steps": [
      "$\\tanh u=\\frac{e^u-e^{-u}}{e^u+e^{-u}}$; with $u=\\ln x$: $\\frac{x-\\frac1x}{x+\\frac1x}=\\frac{x^2-1}{x^2+1}$.",
      "Quotient Rule: $\\frac{2x(x^2+1)-(x^2-1)2x}{(x^2+1)^2}=\\frac{4x}{(x^2+1)^2}$.",
      "Answer: $\\frac{4x}{(x^2+1)^2}$ ($x>0$)."
    ],
    "trap": "Missing the inner derivative $\\frac1x$ of $\\ln x$ in the Chain Rule and writing just $\\operatorname{sech}^2(\\ln x)$.",
    "check": "At $x=1$, $\\ln x=0$; the slope of $\\tanh$ at $0$ is $1$, times the inner $\\frac11$ gives $1$."
  },
  "der-006": {
    "spot": "$x^2$ times $\\sin x$ is a product of two functions: Product Rule, \"derivative of the first times the second, plus the first times derivative of the second\".",
    "why": "Each factor is easy to differentiate, so the Product Rule finishes in one step; there's no way to simplify it into a single function first.",
    "steps": [
      "$(x^2)'=2x$, $(\\sin x)'=\\cos x$.",
      "Derivative of the first times the second: $2x\\cdot\\sin x$; first times derivative of the second: $x^2\\cdot\\cos x$.",
      "Add: $(x^2\\sin x)'=2x\\sin x+x^2\\cos x$."
    ],
    "trap": "Taking the derivative of a product to be the product of the derivatives: $2x\\cos x$ — the most common mistake.",
    "check": "Near $x=0$, $x^2\\sin x\\approx x^3$, so the slope should be $0$."
  },
  "der-011": {
    "spot": "$\\ln$ wrapped around $\\sin x$: the outer $\\ln u$ gives $\\frac1u$, the inner $\\sin x$ gives $\\cos x$.",
    "why": "The derivative of a log of a function is the inner derivative over the inner function — one Chain Rule step; the result is exactly $\\cot x$.",
    "steps": [
      "Outer: $(\\ln u)'=\\frac1u$; with $u=\\sin x$ this is $\\frac{1}{\\sin x}$.",
      "Inner: $(\\sin x)'=\\cos x$.",
      "Multiply: $\\frac{\\cos x}{\\sin x}=\\cot x$ (where $\\sin x>0$)."
    ],
    "trap": "Differentiating only the outer layer and writing $\\frac{1}{\\sin x}$, missing the inner $\\cos x$.",
    "check": "At $x=\\frac{\\pi}{2}$, $\\sin x$ reaches its maximum $1$, so $\\ln(\\sin x)$ is also at its maximum and the slope should be $0$."
  },
  "der-014": {
    "spot": "$\\frac{1+x}{1-x}=\\frac{\\tan\\frac{\\pi}{4}+\\tan\\theta}{1-\\tan\\frac{\\pi}{4}\\tan\\theta}$ is the tangent addition formula: $\\arctan\\frac{1+x}{1-x}=\\arctan x+\\frac{\\pi}{4}$ ($x<1$), off by a constant.",
    "why": "Once you spot the addition formula, the derivative is the same as that of $\\arctan x$; forcing the Chain Rule plus Quotient Rule gives the same result, just with a long simplification.",
    "steps": [
      "Let $x=\\tan\\theta$: $\\frac{1+\\tan\\theta}{1-\\tan\\theta}=\\tan\\left(\\theta+\\frac{\\pi}{4}\\right)$.",
      "So for $x<1$, $\\arctan\\frac{1+x}{1-x}=\\arctan x+\\frac{\\pi}{4}$, differing only by a constant.",
      "The constant differentiates away, giving $\\frac{1}{1+x^2}$ (on the piece $x>1$ the constant becomes $-\\frac{3\\pi}{4}$, same derivative)."
    ],
    "trap": "When differentiating the quotient with the Chain Rule, dropping the $(1-x)+(1+x)=2$ in the numerator, or miscomputing the denominator $(1-x)^2+(1+x)^2=2(1+x^2)$, so it never reduces to the clean $\\frac{1}{1+x^2}$.",
    "check": "At $x=0$ the derivative should be $1$: by brute-force Chain Rule, $\\frac{1}{1+1}\\cdot\\frac{2}{1}=1$."
  },
  "der-018": {
    "spot": "$\\ln\\left(x+\\sqrt{x^2-1}\\right)$ is exactly $\\cosh^{-1}x$; differentiating with the Chain Rule produces $x+\\sqrt{x^2-1}$ in the numerator, which cancels with the outside.",
    "why": "Following the Chain Rule, the inner derivative $1+\\frac{x}{\\sqrt{x^2-1}}$ over a common denominator is exactly $\\frac{x+\\sqrt{x^2-1}}{\\sqrt{x^2-1}}$, which cancels the denominator from the $\\ln$.",
    "steps": [
      "Derivative of the inner $u=x+\\sqrt{x^2-1}$: $1+\\frac{x}{\\sqrt{x^2-1}}=\\frac{\\sqrt{x^2-1}+x}{\\sqrt{x^2-1}}$.",
      "Multiply by the outer $\\frac1u$: $\\frac{1}{x+\\sqrt{x^2-1}}\\cdot\\frac{x+\\sqrt{x^2-1}}{\\sqrt{x^2-1}}$.",
      "Cancel to get $\\frac{1}{\\sqrt{x^2-1}}$ ($x>1$)."
    ],
    "trap": "Missing the inner $2x$ when differentiating the root, writing $\\frac{1}{2\\sqrt{x^2-1}}$, so nothing cancels.",
    "check": "For large $x$, $\\ln(x+\\sqrt{x^2-1})\\approx\\ln(2x)$, with slope about $\\frac1x$; at $x=100$ the two are nearly identical."
  },
  "der-020": {
    "spot": "Inside the $\\arctan$ is $\\sqrt x$: the outer gives $\\frac{1}{1+u^2}=\\frac{1}{1+x}$, the inner $\\sqrt x$ gives $\\frac{1}{2\\sqrt x}$.",
    "why": "A standard two-layer Chain Rule; $u^2=(\\sqrt x)^2=x$ keeps the denominator clean.",
    "steps": [
      "Outer: $(\\arctan u)'=\\frac{1}{1+u^2}$, which for $u=\\sqrt x$ is $\\frac{1}{1+x}$.",
      "Inner: $(\\sqrt x)'=\\frac{1}{2\\sqrt x}$.",
      "Multiply: $\\frac{1}{2\\sqrt x(1+x)}$."
    ],
    "trap": "Substituting into the outer as $\\frac{1}{1+\\sqrt x}$ (forgetting to square), or missing the inner $\\frac{1}{2\\sqrt x}$.",
    "check": "At $x=1$: the slope of $\\arctan$ at $1$ is $\\frac12$, times the slope of $\\sqrt x$ at $1$, $\\frac12$, gives $\\frac14$."
  },
  "gap-der-app-004": {
    "spot": "The normal line is perpendicular to the tangent: find the tangent slope of $y=x^2$ at $x=2$; the normal slope is its negative reciprocal.",
    "why": "Perpendicular lines have slopes multiplying to $-1$, so the normal needs no separate work — just take the negative reciprocal of the tangent slope.",
    "steps": [
      "$y'=2x$, so the tangent slope at $x=2$ is $4$.",
      "The normal is perpendicular to the tangent, so the slopes multiply to $-1$: the normal slope $m$ satisfies $m\\cdot 4=-1$.",
      "Normal slope $=-\\frac{1}{4}$."
    ],
    "trap": "Taking the reciprocal but forgetting the minus sign, answering $\\frac14$; or giving the tangent slope $4$ as the answer.",
    "check": "Tangent slope times normal slope should be $-1$."
  },
  "gap-tech-003": {
    "spot": "The integrand contains $e^{x^2}$, with an $x$ right beside it — that's half of $2x$, the derivative of $x^2$, the signal for the substitution $u=x^2$.",
    "why": "The inner derivative sitting right beside it is the hallmark of substitution; integration by parts would differentiate the $x$ away and leave $\\int e^{x^2}dx$, which can't be done.",
    "steps": [
      "Let $u=x^2$, $du=2x\\,dx$, so $x\\,dx=\\frac12 du$.",
      "$\\int xe^{x^2}dx=\\frac12\\int e^u du=\\frac12 e^{x^2}+C$.",
      "Answer: use substitution ($u$-substitution, with $u=x^2$)."
    ],
    "trap": "Seeing a product and reaching for integration by parts with $u=x$, $dv=e^{x^2}dx$ — then you're stuck, since $e^{x^2}$ has no elementary antiderivative.",
    "check": "Under $x\\to-x$ the integrand changes sign, and the antiderivative $\\frac12 e^{x^2}$ is even — consistent."
  },
  "int-016": {
    "spot": "The integrand is just $\\ln(1+x)$ with no other factor: classic integration by parts with $u=\\ln(1+x)$, $dv=dx$.",
    "why": "Differentiating the $\\ln$ gives a rational function that's easy to integrate; choosing $v=1+x$ (instead of $x$) makes $v\\,du$ simply $dx$ and saves a long division.",
    "steps": [
      "$u=\\ln(1+x)$, $du=\\frac{dx}{1+x}$; take $v=1+x$.",
      "$\\int\\ln(1+x)\\,dx=(1+x)\\ln(1+x)-\\int dx=(1+x)\\ln(1+x)-x$.",
      "Plug in the limits: $(2\\ln 2-1)-(0-0)=2\\ln 2-1\\approx 0.386$."
    ],
    "trap": "With $v=x$, writing $\\int\\frac{x}{1+x}dx$ as $\\ln(1+x)$ and missing the $1$ in $\\frac{x}{1+x}=1-\\frac{1}{1+x}$.",
    "check": "On $[0,1]$, $\\ln(1+x)$ is between $0$ and $\\ln 2\\approx 0.693$ and is concave, so the integral exceeds the trapezoid value $\\frac{\\ln 2}{2}$."
  },
  "lec-01-q4a": {
    "spot": "A rational function can only be discontinuous where the denominator is zero: solve $x^2-3x+2=0$. The numerator $x^2-1$ shares the factor $x-1$ with the denominator, but that only decides which kind of discontinuity it is.",
    "why": "A rational function is continuous everywhere on its domain, so you just find the zeros of the denominator; cancelling doesn't make an undefined point continuous.",
    "steps": [
      "Factor the denominator: $x^2-3x+2=(x-1)(x-2)$, zeros $x=1$ and $x=2$.",
      "$x=1$: after cancelling, $\\frac{x+1}{x-2}\\to -2$; the limit exists but $g(1)$ is undefined, so it's a removable discontinuity.",
      "$x=2$: numerator $3\\ne 0$, denominator $\\to 0$, an infinite discontinuity.",
      "Answer: the set of discontinuities is $\\{1,2\\}$."
    ],
    "trap": "Cancelling to $\\frac{x+1}{x-2}$ first and then looking for discontinuities, answering only $\\{2\\}$; before cancelling, $x=1$ isn't even in the domain.",
    "check": "Everywhere else the denominator is nonzero; e.g. at $x=0$, $g(0)=-\\frac12$ is defined."
  }
};
