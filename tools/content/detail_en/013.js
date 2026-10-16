// Detail v2, English — batch 013. Translation of tools/content/detail/013.js (text only; claims live in the Chinese file).
module.exports = {
  "exam-lim-008": {
    "spot": "A rational function as $x\\to\\infty$ with top and bottom both of highest degree $x^2$ — equal degrees, so look at the ratio of leading coefficients: $\\frac{1}{3}$.",
    "why": "Dividing top and bottom by $x^2$ crushes the lower-order terms to $0$ in one line; L'Hôpital's Rule would need two derivatives — the long way around.",
    "steps": [
      "Divide top and bottom by the highest power $x^2$: $\\frac{x^2+1}{3x^2-2x}=\\frac{1+\\frac{1}{x^2}}{3-\\frac{2}{x}}$.",
      "As $x\\to\\infty$, $\\frac{1}{x^2}\\to 0$ and $\\frac{2}{x}\\to 0$.",
      "What's left is the ratio of leading coefficients, $\\frac{1}{3}$."
    ],
    "trap": "Seeing only that both have highest degree $x^2$ and saying the limit is $1$, forgetting the denominator's leading coefficient is $3$.",
    "check": "Plug in $x=100$: $\\frac{10001}{29800}\\approx 0.3356$, close to $\\frac{1}{3}$."
  },
  "lim-015": {
    "spot": "$\\sec x-1$ over $x^2$: $\\sec x=\\frac{1}{\\cos x}$, so the numerator is really $\\frac{1-\\cos x}{\\cos x}$, and $1-\\cos x\\approx\\frac{x^2}{2}$ matches the $x^2$ in the denominator perfectly.",
    "why": "Once it's in terms of $\\cos$, apply $\\frac{1-\\cos x}{x^2}\\to\\frac{1}{2}$ directly; L'Hôpital's Rule would mean differentiating $\\sec x$ twice, with the expression getting longer each time.",
    "steps": [
      "Plug in $x=0$: the numerator is $\\sec 0-1=0$, a $\\frac{0}{0}$ form.",
      "Combine: $\\sec x-1=\\frac{1-\\cos x}{\\cos x}$.",
      "Split into two pieces: $\\frac{1-\\cos x}{x^2}\\to\\frac{1}{2}$, $\\frac{1}{\\cos x}\\to 1$.",
      "Multiply: $\\frac{1}{2}$."
    ],
    "trap": "Copying the signs of the $\\cos x$ expansion for $\\sec x$ and writing $1-\\frac{x^2}{2}$, which gives $-\\frac{1}{2}$. Since $\\sec x\\ge 1$, the numerator is positive and the answer must be positive.",
    "check": "Plug in $x=0.01$: the ratio is a bit more than $\\frac{1}{2}$ (the next term $\\frac{5}{24}x^2$ is positive)."
  },
  "dd-lin-001": {
    "spot": "$8.06$ sits right next to the perfect cube $8$: $\\sqrt[3]{8}=2$ is easy, so estimate with the tangent line to $f(x)=\\sqrt[3]{x}$ at $a=8$.",
    "why": "Linear approximation needs only two easy numbers, $f(8)$ and $f'(8)$; taking the cube root directly is impossible without a calculator.",
    "steps": [
      "Choose $f(x)=x^{1/3}$, $a=8$: $f(8)=2$.",
      "$f'(x)=\\frac{1}{3}x^{-2/3}$, $f'(8)=\\frac{1}{3}\\cdot\\frac{1}{4}=\\frac{1}{12}$.",
      "Tangent line: $L(x)=2+\\frac{1}{12}(x-8)$, with $\\Delta x=0.06$.",
      "So $\\sqrt[3]{8.06}\\approx 2+\\frac{0.06}{12}=2.005$."
    ],
    "trap": "Computing $f'(8)$ as $\\frac{1}{3}$ (forgetting to multiply by $8^{-2/3}=\\frac{1}{4}$), which gives $2.02$ — clearly too big.",
    "check": "The cube root is concave, so the tangent line lies above the curve and the estimate should be slightly larger than the true value: $\\sqrt[3]{8.06}\\approx 2.00498$."
  },
  "depth-int-003": {
    "spot": "The numerator $x$ is exactly half the derivative of the $1+x^2$ in the denominator — the standard substitution $u=1+x^2$.",
    "why": "The numerator matches the inner derivative, so after substituting only a power of $u$ remains; the trigonometric substitution $x=\\tan\\theta$ also works but takes a detour.",
    "steps": [
      "Let $u=1+x^2$, $du=2x\\,dx$, so $x\\,dx=\\frac{1}{2}du$.",
      "The integral becomes $\\frac{1}{2}\\int u^{-3/2}\\,du=\\frac{1}{2}\\cdot\\frac{u^{-1/2}}{-1/2}=-u^{-1/2}$.",
      "Back to $x$: $-\\frac{1}{\\sqrt{1+x^2}}+C$, and differentiating back gives the integrand."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ from $du=2x\\,dx$ and getting $-\\frac{2}{\\sqrt{1+x^2}}$, which differentiates back to twice the integrand.",
    "check": "The integrand is $0$ at $x=0$, so the antiderivative's slope at $0$ should be $0$."
  },
  "exam-der-009": {
    "spot": "Derivative of a quotient where simplifying the numerator produces $\\sin^2x+\\cos^2x$ — that's $1$, so the whole numerator becomes $-(1+\\sin x)$ and cancels one factor of the denominator.",
    "why": "Apply the Quotient Rule directly; the key is spotting the identity during simplification. No need to rewrite the function first.",
    "steps": [
      "Quotient Rule: $\\frac{(-\\sin x)(1+\\sin x)-\\cos x\\cdot\\cos x}{(1+\\sin x)^2}$.",
      "Expand the numerator: $-\\sin x-\\sin^2x-\\cos^2x=-\\sin x-1=-(1+\\sin x)$.",
      "Cancel one $1+\\sin x$: derivative $=-\\frac{1}{1+\\sin x}$."
    ],
    "trap": "Writing the Quotient Rule numerator in the wrong order ($fg'-f'g$), which flips the sign and gives $\\frac{1}{1+\\sin x}$.",
    "check": "At $x=0$ the answer gives $-1$, matching a direct numerical derivative."
  },
  "exam-der-020": {
    "spot": "$\\frac{e^x}{1+e^x}$ is the logistic function $\\sigma(x)$: $e^x$ appears on top and bottom, so the Quotient Rule numerator cancels down to a single $e^x$.",
    "why": "The Quotient Rule does it in one step; if you remember $\\sigma'=\\sigma(1-\\sigma)$, that also serves as a check.",
    "steps": [
      "Quotient Rule: $\\frac{e^x(1+e^x)-e^x\\cdot e^x}{(1+e^x)^2}$.",
      "Numerator: $e^x+e^{2x}-e^{2x}=e^x$.",
      "So the derivative $=\\frac{e^x}{(1+e^x)^2}$."
    ],
    "trap": "Writing $e^x\\cdot e^x$ in the numerator as $e^x$ (treating the product as unchanged), so the numerator becomes $e^{2x}$ and the answer turns into $\\frac{e^{2x}}{(1+e^x)^2}$.",
    "check": "Logistic property $\\sigma'=\\sigma(1-\\sigma)$; at $x=0$ it is $\\frac{1}{2}\\cdot\\frac{1}{2}=\\frac{1}{4}$."
  },
  "exam-int-010": {
    "spot": "The derivative of the denominator $1+x^{3/2}$ is $\\frac{3}{2}x^{1/2}$, and the numerator is exactly $\\sqrt{x}$ — the numerator is a constant times the denominator's derivative, so the answer is a logarithm.",
    "why": "Once you see \"numerator ∝ derivative of denominator\", go straight to $\\ln$; no need to think about substitutions like $x=t^2$.",
    "steps": [
      "Let $u=1+x^{3/2}$, $du=\\frac{3}{2}\\sqrt{x}\\,dx$, so $\\sqrt{x}\\,dx=\\frac{2}{3}du$.",
      "The integral becomes $\\frac{2}{3}\\int\\frac{du}{u}=\\frac{2}{3}\\ln|u|$.",
      "Back to $x$ (since $u>0$, no absolute value needed): $\\frac{2}{3}\\ln(1+x^{3/2})+C$."
    ],
    "trap": "Seeing that the numerator looks like the denominator's derivative and writing just $\\ln(1+x^{3/2})$, dropping the $\\frac{2}{3}$ — the numerator is $\\sqrt{x}$, not $\\frac{3}{2}\\sqrt{x}$.",
    "check": "At $x=1$ the integrand is $\\frac{1}{2}$, so the answer's derivative must also be $\\frac{1}{2}$."
  },
  "exam-lim-005": {
    "spot": "$1-\\cos(\\text{something})$ over a square — the standard equivalence $1-\\cos u\\approx\\frac{u^2}{2}$, here with $u=2x$.",
    "why": "One substitution of equivalent infinitesimals finishes it; the double-angle identity $1-\\cos 2x=2\\sin^2x$ is just as quick. Both are cleaner than L'Hôpital's Rule twice.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "Basic limit: $\\frac{1-\\cos u}{u^2}\\to\\frac{1}{2}$.",
      "Substitute $u=2x$: $1-\\cos 2x\\approx\\frac{(2x)^2}{2}=2x^2$ (also visible from $1-\\cos 2x=2\\sin^2x$).",
      "Divide by $x^2$ to get $2$."
    ],
    "trap": "Not squaring the $2x$ when substituting — writing $\\frac{2x}{2}$ or $\\frac{2x^2}{2}$ — and getting $1$.",
    "check": "Plug in $x=0.01$: the ratio is slightly less than $2$ (the next term is $-\\frac{2}{3}x^2$)."
  },
  "exam-lim-020": {
    "spot": "The numerator is $\\arcsin x$ minus the first term $x$ of its expansion, over $x^3$ — expand to the $x^3$ term and read off the coefficient.",
    "why": "Higher derivatives of $\\arcsin$ are hard, so three rounds of L'Hôpital's Rule get messy; integrating up the expansion of $\\frac{1}{\\sqrt{1-x^2}}$ is fastest.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "The derivative $\\frac{1}{\\sqrt{1-x^2}}=1+\\frac{x^2}{2}+\\cdots$ (binomial expansion).",
      "Integrate term by term: $\\arcsin x=x+\\frac{x^3}{6}+\\frac{3x^5}{40}+\\cdots$.",
      "Subtract $x$ and divide by $x^3$: the limit is $\\frac{1}{6}$."
    ],
    "trap": "Mixing it up with $\\sin x=x-\\frac{x^3}{6}+\\cdots$ and answering $-\\frac{1}{6}$. For $x>0$, $\\arcsin x$ is bigger than $x$, so the coefficient is positive.",
    "check": "Plug in $x=0.1$: $\\frac{\\arcsin 0.1-0.1}{0.001}\\approx 0.1674$, slightly more than $\\frac{1}{6}$."
  },
  "exam-ser-003": {
    "spot": "The coefficient $\\frac{1}{n}$ grows only polynomially, so the ratio and the root both tend to $1$; the center $2$ is just a shift and doesn't affect the radius.",
    "why": "The Ratio Test finishes in one line; the radius of a power series depends only on the coefficients, not on how $(x-2)$ is written.",
    "steps": [
      "Coefficients $a_n=\\frac{1}{n}$; by the ratio: $R=\\lim\\left|\\frac{a_n}{a_{n+1}}\\right|=\\lim\\frac{n+1}{n}$.",
      "$\\frac{n+1}{n}\\to 1$; the Root Test gives the same, $\\sqrt[n]{1/n}\\to 1$.",
      "So the radius of convergence is $R=1$ (the interval of convergence is centered at $2$: $|x-2|<1$)."
    ],
    "trap": "Taking the center $2$ as the radius, or seeing $x-2$ and answering the interval $(1,3)$ — the question asks for the radius, a single number.",
    "check": "Plugging in the endpoint $x=1$ gives the alternating harmonic series, which converges to $-\\ln 2$ — consistent with a boundary at radius $1$."
  },
  "gap-int-pf-005": {
    "spot": "The denominator is the square of a linear factor and the numerator is a constant — no partial fractions needed; treat it as $(x+1)^{-2}$ and use the power rule.",
    "why": "The derivative of $u=x+1$ is $1$, so the power rule does it in one step; this is not the logarithm shape.",
    "steps": [
      "Rewrite as a power: $\\frac{1}{(x+1)^2}=(x+1)^{-2}$; let $u=x+1$, $du=dx$.",
      "Power rule: $\\int u^{-2}\\,du=\\frac{u^{-1}}{-1}=-u^{-1}$.",
      "Back to $x$: $-\\frac{1}{x+1}+C$."
    ],
    "trap": "Seeing a linear denominator and writing $\\ln|x+1|$. That's the integral of $\\frac{1}{x+1}$; once it's squared it's a power, not a log.",
    "check": "At $x=0$ the integrand is $1$, so the answer's slope must also be $1$."
  },
  "hc-rad-010": {
    "spot": "Numerator $x$, and inside the root $x^4=(x^2)^2$ — let $u=x^2$; the $x\\,dx$ is absorbed exactly, leaving $\\frac{1}{\\sqrt{1-u^2}}$, an inverse sine.",
    "why": "After substitution it's the standard $\\arcsin$ form; numerical work or a trigonometric substitution would be slower.",
    "steps": [
      "Let $u=x^2$, $du=2x\\,dx$; the limits map $0\\to 0$, $1\\to 1$.",
      "The integral becomes $\\frac{1}{2}\\int_0^1\\frac{du}{\\sqrt{1-u^2}}$.",
      "$\\int_0^1\\frac{du}{\\sqrt{1-u^2}}=\\arcsin 1-\\arcsin 0=\\frac{\\pi}{2}$.",
      "Multiply by $\\frac{1}{2}$: $\\frac{\\pi}{4}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ from $du=2x\\,dx$ and answering $\\frac{\\pi}{2}$.",
    "check": "$\\sqrt{1-x^4}\\le 1$, so the integrand is $\\ge x$ and the integral is at least $\\int_0^1 x\\,dx=\\frac{1}{2}$; $\\frac{\\pi}{4}\\approx 0.785$ is reasonable."
  },
  "hc-usub-004": {
    "spot": "The denominator is $1+x^6=1+(x^3)^2$, and the numerator $x^2$ is $\\frac{1}{3}$ of the derivative of $x^3$ — let $u=x^3$ and it's an inverse tangent.",
    "why": "Seeing $x^6$ as the square of $x^3$, one substitution gets to $\\int\\frac{du}{1+u^2}$; factoring $1+x^6$ would be very painful.",
    "steps": [
      "Let $u=x^3$, $du=3x^2\\,dx$, so $x^2\\,dx=\\frac{1}{3}du$.",
      "The integral becomes $\\frac{1}{3}\\int\\frac{du}{1+u^2}=\\frac{1}{3}\\arctan u$.",
      "Back to $x$: $\\frac{1}{3}\\arctan(x^3)+C$."
    ],
    "trap": "Thinking the numerator is the denominator's derivative and writing $\\ln(1+x^6)$ — that would need the numerator to be $6x^5$; here the numerator is $x^2$, which pairs with $x^3$.",
    "check": "At $x=1$ the integrand is $\\frac{1}{2}$, so the answer's slope must also be $\\frac{1}{2}$."
  },
  "hc-usub-005": {
    "spot": "Everything revolves around $\\sqrt{1+x^4}$, and $\\frac{x^3}{\\sqrt{1+x^4}}$ is exactly half its derivative — let $u=\\sqrt{1+x^4}$ directly.",
    "why": "Setting $u$ equal to the whole root absorbs the root in the denominator and the $x^3$ in the numerator at once, leaving $\\frac{1}{1+u}$; with only $u=1+x^4$ you'd still have to deal with the root.",
    "steps": [
      "Let $u=\\sqrt{1+x^4}$, $du=\\frac{2x^3}{\\sqrt{1+x^4}}\\,dx$.",
      "So $\\frac{x^3\\,dx}{\\sqrt{1+x^4}}=\\frac{1}{2}du$, and the integral becomes $\\frac{1}{2}\\int\\frac{du}{1+u}=\\frac{1}{2}\\ln(1+u)$.",
      "Back to $x$: $\\frac{1}{2}\\ln\\left(1+\\sqrt{1+x^4}\\right)+C$."
    ],
    "trap": "Missing the $2$ in $du$ and writing $\\ln(1+\\sqrt{1+x^4})$, which differentiates back to twice the integrand.",
    "check": "The integrand is odd, so the antiderivative should be even: $F(1)=F(-1)$."
  },
  "hc-usub-007": {
    "spot": "Numerator $x^2$, and inside the root $x^6=(x^3)^2$ — let $u=x^3$, $x^2\\,dx=\\frac{1}{3}du$, leaving the standard $\\arcsin$ form.",
    "why": "Same trick as $\\int\\frac{x\\,dx}{\\sqrt{1-x^4}}$: the numerator is exactly the derivative of the thing being squared.",
    "steps": [
      "Let $u=x^3$, $du=3x^2\\,dx$; the limits map $0\\to 0$, $1\\to 1$.",
      "The integral becomes $\\frac{1}{3}\\int_0^1\\frac{du}{\\sqrt{1-u^2}}$.",
      "$\\int_0^1\\frac{du}{\\sqrt{1-u^2}}=\\arcsin 1=\\frac{\\pi}{2}$.",
      "Multiply by $\\frac{1}{3}$: $\\frac{\\pi}{6}$."
    ],
    "trap": "Dropping the $\\frac{1}{3}$ and answering $\\frac{\\pi}{2}$, or seeing that the denominator is $0$ at $x=1$ and assuming the integral diverges — it's a convergent improper integral.",
    "check": "The integrand is $\\ge x^2$, so the integral is at least $\\frac{1}{3}$; $\\frac{\\pi}{6}\\approx 0.524$ is reasonable."
  },
  "rel-adv-020": {
    "spot": "At $x=-1$, $\\frac{x^n}{n}$ becomes $\\frac{(-1)^n}{n}$: the alternating harmonic series — alternating signs make it converge, but in absolute value it's the harmonic series, which diverges.",
    "why": "An endpoint needs two separate questions: the Alternating Series Test decides whether it converges, and the harmonic series of absolute values decides whether it converges absolutely.",
    "steps": [
      "Substitute: $\\sum\\frac{(-1)^n}{n}=-1+\\frac{1}{2}-\\frac{1}{3}+\\cdots$.",
      "Alternating Series Test: $\\frac{1}{n}$ decreases to $0$, so the series converges (its sum is $-\\ln 2$).",
      "In absolute value it's the harmonic series $\\sum\\frac{1}{n}$: the partial sums are $\\ge\\int_1^{N+1}\\frac{dx}{x}=\\ln(N+1)$, which grows without bound, so it diverges.",
      "Convergent but not absolutely convergent: conditionally convergent."
    ],
    "trap": "Seeing $|x|=1$ on the boundary of the radius of convergence and saying \"diverges\", or checking only the Alternating Series Test and answering \"absolutely convergent\". Each endpoint has to be checked on its own.",
    "check": "Compare the other endpoint $x=1$: that's the harmonic series itself, which diverges; it's normal for the two endpoints to behave differently."
  },
  "tmpl-int-linear-power-001": {
    "spot": "A linear expression $2x+3$ to the fourth power — don't expand; let $u=2x+3$ and remember to divide by the inner slope $2$.",
    "why": "Expanding the fourth power means five terms; substitution takes one line.",
    "steps": [
      "Let $u=2x+3$, $du=2\\,dx$, $dx=\\frac{1}{2}du$.",
      "$\\frac{1}{2}\\int u^4\\,du=\\frac{1}{2}\\cdot\\frac{u^5}{5}=\\frac{u^5}{10}$.",
      "Back to $x$: $\\frac{(2x+3)^5}{10}+C$."
    ],
    "trap": "Forgetting to divide by the inner slope $2$ and writing $\\frac{(2x+3)^5}{5}$, which differentiates back to twice the integrand.",
    "check": "At $x=0$ the integrand is $3^4=81$, so the answer's slope must also be $81$."
  },
  "tmpl-int-linear-power-002": {
    "spot": "A linear expression $3x+1$ to the fifth power: let $u=3x+1$ and divide by the slope $3$.",
    "why": "Expanding the fifth power is too much work; for a power of a linear expression, substitution leaves just the power rule.",
    "steps": [
      "Let $u=3x+1$, $du=3\\,dx$, $dx=\\frac{1}{3}du$.",
      "$\\frac{1}{3}\\int u^5\\,du=\\frac{u^6}{18}$.",
      "Back to $x$: $\\frac{(3x+1)^6}{18}+C$."
    ],
    "trap": "Dividing only by $6$ and forgetting the $3$, giving $\\frac{(3x+1)^6}{6}$; or multiplying by $3$ instead and getting $\\frac{(3x+1)^6}{2}$.",
    "check": "At $x=0$ the integrand is $1$, so the answer's slope must also be $1$."
  },
  "tmpl-int-linear-power-004": {
    "spot": "A linear expression $4x+7$ to the sixth power: let $u=4x+7$, raise the power by one, then divide by $7$ and by the slope $4$.",
    "why": "Expanding the sixth power means seven terms; substitution does it in one step.",
    "steps": [
      "Let $u=4x+7$, $du=4\\,dx$, $dx=\\frac{1}{4}du$.",
      "$\\frac{1}{4}\\int u^6\\,du=\\frac{u^7}{28}$.",
      "Back to $x$: $\\frac{(4x+7)^7}{28}+C$."
    ],
    "trap": "Forgetting the inner slope $4$ and writing $\\frac{(4x+7)^7}{7}$, which differentiates back to four times the integrand.",
    "check": "At $x=-1$, $4x+7=3$, so the integrand is $3^6=729$ and the answer's slope must also be $729$."
  },
  "uni-int-005": {
    "spot": "$1+x^2$ under a root, multiplied by $x$ outside — $x$ is exactly half the derivative of $1+x^2$, so let $u=1+x^2$.",
    "why": "After substitution only a power $\\sqrt{u}$ remains; integration by parts or a trigonometric substitution would be a detour.",
    "steps": [
      "Let $u=1+x^2$, $du=2x\\,dx$, so $x\\,dx=\\frac{1}{2}du$.",
      "$\\frac{1}{2}\\int u^{1/2}\\,du=\\frac{1}{2}\\cdot\\frac{u^{3/2}}{3/2}=\\frac{u^{3/2}}{3}$.",
      "Back to $x$: $\\frac{(1+x^2)^{3/2}}{3}+C$."
    ],
    "trap": "Multiplying by $\\frac{3}{2}$ when you should divide by $\\frac{3}{2}$, giving $\\frac{3}{4}(1+x^2)^{3/2}$.",
    "check": "At $x=1$ the integrand is $\\sqrt{2}$, so the answer's slope must also be $\\sqrt{2}$."
  },
  "uni-int-009": {
    "spot": "The derivative of the denominator $x^2+x+1$ is $2x+1$ — exactly the numerator, so the answer is $\\ln$ of the denominator.",
    "why": "\"Numerator = derivative of denominator\" is the fastest log form; the denominator's discriminant is $<0$, so it can't be factored and partial fractions doesn't even apply.",
    "steps": [
      "Derivative of the denominator: $(x^2+x+1)'=2x+1$, which is the numerator.",
      "So $\\int\\frac{f'(x)}{f(x)}\\,dx=\\ln|f(x)|$; and $x^2+x+1=(x+\\frac{1}{2})^2+\\frac{3}{4}>0$, so the absolute value can go.",
      "Answer: $\\ln(x^2+x+1)+C$."
    ],
    "trap": "Rushing to complete the square for $\\arctan$ and mangling the numerator $2x+1$; when the numerator is exactly the denominator's derivative, there's no $\\arctan$ in the answer at all.",
    "check": "At $x=0$ the integrand is $1$, so the answer's slope must also be $1$."
  },
  "burst-boss3-int-002": {
    "spot": "The integrand is \"something in $x$ only\" times \"something in $y$ only\" over a square — the double integral splits into a product of two single integrals, each of the form $\\int_0^1 x^a(\\ln x)^k\\,dx$.",
    "why": "Differentiate $\\int_0^1x^a\\,dx=\\frac{1}{a+1}$ in $a$ $k$ times; each derivative adds one $\\ln x$, and the formula drops out. Grinding through integration by parts three times makes it easy to lose a minus sign.",
    "steps": [
      "Separate variables: $\\left(\\int_0^1 x(\\ln x)^2\\,dx\\right)\\left(\\int_0^1 y^2(\\ln y)^3\\,dy\\right)$.",
      "Parent formula $\\int_0^1x^a\\,dx=\\frac{1}{a+1}$; differentiating $k$ times in $a$ gives $\\int_0^1x^a(\\ln x)^k\\,dx=\\frac{(-1)^k k!}{(a+1)^{k+1}}$. With $a=1,k=2$: $\\frac{2}{2^3}=\\frac{1}{4}$.",
      "The second derivative is $\\frac{2}{(a+1)^3}$; one more gives $-\\frac{6}{(a+1)^4}$. With $a=2,k=3$: $\\frac{-6}{3^4}=-\\frac{2}{27}$.",
      "Multiply: $\\frac{1}{4}\\cdot\\left(-\\frac{2}{27}\\right)=-\\frac{1}{54}$."
    ],
    "trap": "Dropping the $(-1)^k$ and answering $\\frac{1}{54}$. On $(0,1)$, $\\ln y<0$, so $(\\ln y)^3$ is negative and the whole integral must be negative.",
    "check": "Sign check: $(\\ln x)^2\\ge 0$ and $(\\ln y)^3\\le 0$, so the answer must be negative, and small."
  },
  "db-opt-003": {
    "spot": "Open-top box: after cutting out $x$, the base is $(16-2x)\\times(10-2x)$ and the height is $x$, so the volume is a cubic in $x$ on the domain $0<x<5$ — differentiate to find critical points, then keep the one inside the domain.",
    "why": "Differentiating the cubic gives a quadratic that factors; the domain rules out one root immediately.",
    "steps": [
      "Volume $V(x)=x(16-2x)(10-2x)$, $0<x<5$ (the short side $10$ gets cut twice).",
      "Expand and differentiate: $V'(x)=12x^2-104x+160=4(3x-20)(x-2)$.",
      "Critical points $x=2$ or $x=\\frac{20}{3}$; $\\frac{20}{3}>5$ is outside the domain, leaving only $x=2$, and $V''(2)<0$ makes it a maximum.",
      "$V(2)=2\\cdot 12\\cdot 6=144$."
    ],
    "trap": "Using $x=\\frac{20}{3}$: then $10-2x<0$, so the width is negative and the resulting \"volume\" is meaningless.",
    "check": "Nearby points are both smaller: $V(1.9)$ and $V(2.1)$ are both below $144$."
  },
  "db-rr-003": {
    "spot": "Ladder, wall and ground form a right triangle with fixed hypotenuse $10$: differentiate $x^2+y^2=100$ with respect to time to convert $x'$ into $y'$.",
    "why": "The standard related rates routine: first write the relation that holds at all times, then differentiate in $t$; numbers go in only after differentiating.",
    "steps": [
      "When the base is $x=6$ from the wall, the height is $y=\\sqrt{100-36}=8$.",
      "Differentiate in $t$: $2xx'+2yy'=0$, so $y'=-\\frac{x}{y}x'$.",
      "Plug in $x=6$, $y=8$, $x'=1$: $y'=-\\frac{6}{8}=-\\frac{3}{4}$ (m/s, downward)."
    ],
    "trap": "Plugging in $x=6$ before differentiating, so the constant differentiates to $0$; or swapping $x,y$ and getting $-\\frac{8}{6}$.",
    "check": "The farther out the base, the faster the top falls: at $x=8$ the rate is $-\\frac{8}{6}$, more negative than $-\\frac{3}{4}$."
  },
  "dd-rr-009": {
    "spot": "The observer's distance is fixed at $50$ while the height changes: $\\tan\\theta=\\frac{h}{50}$; differentiating in time converts $h'$ into $\\theta'$.",
    "why": "Write $\\theta=\\arctan\\frac{h}{50}$ and use the Chain Rule directly; or use implicit differentiation $\\sec^2\\theta\\,\\theta'=\\frac{h'}{50}$ — equally fast.",
    "steps": [
      "$\\theta=\\arctan\\frac{h}{50}$, $\\frac{d\\theta}{dh}=\\frac{1/50}{1+(h/50)^2}$.",
      "At $h=50$, $\\frac{d\\theta}{dh}=\\frac{1/50}{2}=\\frac{1}{100}$.",
      "Multiply by $h'=3$: $\\theta'=\\frac{3}{100}$ rad/s."
    ],
    "trap": "Dropping the factor $\\frac{1}{1+(h/50)^2}$ and computing just $\\frac{3}{50}$; at $45^\\circ$ this factor is $\\frac{1}{2}$, so the answer is off by a factor of two.",
    "check": "Implicit version: at $h=50$, $\\theta=\\frac{\\pi}{4}$, $\\sec^2\\theta=2$, so $\\theta'=\\frac{3}{50\\cdot 2}$ — consistent."
  },
  "depth-der-004": {
    "spot": "Differentiate $x^2\\ln x$ three times: the $x^2$ side loses degree gradually while $\\ln x$ becomes $\\frac{1}{x}$ after one derivative — use the Product Rule each time; after the second round the $x^2$ has been used up.",
    "why": "After two rounds of the Product Rule only $2\\ln x+3$ is left, and the third derivative is immediate; no need for the Leibniz formula.",
    "steps": [
      "First: $(x^2\\ln x)'=2x\\ln x+x^2\\cdot\\frac{1}{x}=2x\\ln x+x$.",
      "Second: $(2x\\ln x+x)'=2\\ln x+2+1=2\\ln x+3$.",
      "Third: $(2\\ln x+3)'=\\frac{2}{x}$."
    ],
    "trap": "Thinking \"$x^2$ differentiated three times is gone\" and answering $0$ — that's only true for polynomials; $\\ln x$ always leaves something behind.",
    "check": "Check with the Leibniz formula: $x^2(\\ln x)'''+3\\cdot 2x(\\ln x)''+3\\cdot 2(\\ln x)'=\\frac{2}{x}-\\frac{6}{x}+\\frac{6}{x}=\\frac{2}{x}$."
  },
  "depth-ser-003": {
    "spot": "The denominator is a product of two linear factors that differ by $2$ — partial fractions turn it into a difference of reciprocals of consecutive odd numbers, and the series telescopes.",
    "why": "After splitting, the partial sum keeps only the first and last terms, so the limit is obvious; a Comparison Test would only show convergence, not the sum.",
    "steps": [
      "Split: $\\frac{1}{(2n-1)(2n+1)}=\\frac{1}{2}\\left(\\frac{1}{2n-1}-\\frac{1}{2n+1}\\right)$.",
      "The partial sum telescopes: $S_N=\\frac{1}{2}\\left(1-\\frac{1}{3}+\\frac{1}{3}-\\cdots-\\frac{1}{2N+1}\\right)=\\frac{1}{2}\\left(1-\\frac{1}{2N+1}\\right)$.",
      "As $N\\to\\infty$, the sum is $\\frac{1}{2}$."
    ],
    "trap": "Forgetting the leading $\\frac{1}{2}$ when splitting (the factors differ by $2$, not $1$) and answering $1$.",
    "check": "The first term alone is $\\frac{1}{3}$, and the rest are positive and shrink fast, so the sum should be somewhat more than $\\frac{1}{3}$."
  },
  "der-031": {
    "spot": "Partial derivative in $x$: hold $y$ constant; $e^{x^2+y^2}$ is the Chain Rule on $e^{(\\text{inner})}$, and the inner part contributes only $2x$ with respect to $x$.",
    "why": "A partial derivative is an ordinary derivative with the other variables frozen; the derivative of an exponential is itself times the inner derivative.",
    "steps": [
      "Inner part $x^2+y^2$, partial in $x$: $y^2$ is a constant, giving $2x$.",
      "The outer $e^u$ differentiates to $e^u$.",
      "Multiply: $\\frac{\\partial}{\\partial x}e^{x^2+y^2}=2xe^{x^2+y^2}$."
    ],
    "trap": "Differentiating the $y^2$ too and writing $(2x+2y)e^{x^2+y^2}$ — that adds the two components of the total differential together; it is not the partial derivative in $x$.",
    "check": "At $x=0$ (whatever $y$ is), the function is even in $x$, so the partial derivative must be $0$."
  },
  "der-033": {
    "spot": "Partial derivative in $x$ twice: in $x^2y$ the $y$ is a constant coefficient, and $\\sin x$ differentiates as usual — one term at a time.",
    "why": "Differentiating the two terms separately is most direct; $y$ just rides along as a coefficient.",
    "steps": [
      "Once: $f_x=2xy+\\cos x$.",
      "Again: $f_{xx}=2y-\\sin x$.",
      "So $\\frac{\\partial^2}{\\partial x^2}(x^2y+\\sin x)=2y-\\sin x$."
    ],
    "trap": "Losing the $y$ from $2xy$ in the second derivative and writing $2-\\sin x$; $y$ is constant with respect to $x$ and must stay.",
    "check": "$x^2y$ is quadratic in $x$, so its second partial has no $x$; only the $\\sin x$ term matters, and at $x=0$ the answer is $2y$."
  },
  "der-062": {
    "spot": "Wronskian: the first row holds the functions $x,\\ x^2$, the second row their derivatives $1,\\ 2x$; cross-multiply and subtract.",
    "why": "A $2\\times 2$ determinant for two functions — apply $y_1y_2'-y_1'y_2$ directly.",
    "steps": [
      "$W=\\begin{vmatrix}x & x^2\\\\ 1 & 2x\\end{vmatrix}$; derivatives $(x)'=1$, $(x^2)'=2x$.",
      "$W=x\\cdot 2x-1\\cdot x^2=2x^2-x^2$.",
      "So $W(x,x^2)=x^2$."
    ],
    "trap": "Cross-multiplying in the wrong order ($y_1'y_2-y_1y_2'$) and getting $-x^2$.",
    "check": "At $x=1$, $W=1\\ne 0$, so the two functions are linearly independent — reasonable ($x^2$ is not a constant multiple of $x$)."
  },
  "der-065": {
    "spot": "$y_1=1$ is a constant with derivative $0$ — the cross term of the determinant vanishes, leaving only $1\\cdot(\\ln x)'$.",
    "why": "When one function is constant, the Wronskian is just the derivative of the other function; nothing more to compute.",
    "steps": [
      "$W=\\begin{vmatrix}1 & \\ln x\\\\ 0 & \\frac{1}{x}\\end{vmatrix}$; $(\\ln x)'=\\frac{1}{x}$.",
      "Cross-multiply: $W=1\\cdot\\frac{1}{x}-0\\cdot\\ln x$; the second term vanishes because $(1)'=0$.",
      "So $W(1,\\ln x)=\\frac{1}{x}$."
    ],
    "trap": "Subtracting in the wrong order and getting $-\\frac{1}{x}$; or taking the derivative of the constant $1$ to be $1$.",
    "check": "$1$ and $\\ln x$ both solve $xy''+y'=0$, and Abel's formula says $W'=-\\frac{W}{x}$, which $\\frac{1}{x}$ satisfies exactly."
  },
  "exam-der-017": {
    "spot": "Outer $\\arctan$, inner $\\sqrt{x}$ — Chain Rule; the key is that when you plug into the outer derivative, $(\\sqrt{x})^2=x$.",
    "why": "Standard two-layer Chain Rule; after plugging into the outer derivative it simplifies to $1+x$ automatically.",
    "steps": [
      "Outer: $(\\arctan u)'=\\frac{1}{1+u^2}$, which is $\\frac{1}{1+x}$ when $u=\\sqrt{x}$.",
      "Inner: $(\\sqrt{x})'=\\frac{1}{2\\sqrt{x}}$.",
      "Multiply: $\\frac{1}{2\\sqrt{x}(1+x)}$."
    ],
    "trap": "Writing the outer derivative as $\\frac{1}{1+x^2}$ (forgetting that what's plugged in is $\\sqrt{x}$), giving $\\frac{1}{2\\sqrt{x}(1+x^2)}$.",
    "check": "At $x=1$: $\\frac{1}{2\\cdot 1\\cdot 2}=\\frac{1}{4}$."
  },
  "exam-int-004": {
    "spot": "$\\sqrt{x}$ times $\\ln x$: $\\ln x$ is hard to integrate but differentiates to $\\frac{1}{x}$ — integration by parts with $u=\\ln x$.",
    "why": "Put the log in $u$; after differentiating, $\\frac{1}{x}$ cancels against $x^{3/2}$ and only a power remains. Choosing the other way means integrating $\\ln x$ first, which only makes it messier.",
    "steps": [
      "$u=\\ln x$, $dv=\\sqrt{x}\\,dx$, so $du=\\frac{dx}{x}$, $v=\\frac{2}{3}x^{3/2}$.",
      "$\\int\\sqrt{x}\\ln x\\,dx=\\frac{2}{3}x^{3/2}\\ln x-\\int\\frac{2}{3}x^{3/2}\\cdot\\frac{1}{x}\\,dx=\\frac{2}{3}x^{3/2}\\ln x-\\frac{2}{3}\\int x^{1/2}\\,dx$.",
      "$\\frac{2}{3}\\int x^{1/2}\\,dx=\\frac{2}{3}\\cdot\\frac{2}{3}x^{3/2}=\\frac{4}{9}x^{3/2}$.",
      "Answer: $\\frac{2}{3}x^{3/2}\\ln x-\\frac{4}{9}x^{3/2}+C$."
    ],
    "trap": "Forgetting to actually integrate the remaining integral and writing $-\\frac{2}{3}x^{3/2}$ directly; differentiating back leaves a leftover term like $-\\frac{1}{3}\\sqrt{x}$.",
    "check": "At $x=1$, $\\ln 1=0$, so the integrand is $0$ and the answer's slope must also be $0$."
  },
  "exam-int-012": {
    "spot": "$e^{2x}$ times $\\sin x$: neither disappears under differentiation or integration — integrating by parts twice cycles back to the original integral, then solve for it.",
    "why": "Cyclic integration by parts is the standard move; it also yields the formula $\\int e^{ax}\\sin bx\\,dx=\\frac{e^{ax}(a\\sin bx-b\\cos bx)}{a^2+b^2}$.",
    "steps": [
      "First round (integrate $e^{2x}$): $I=\\frac{1}{2}e^{2x}\\sin x-\\frac{1}{2}\\int e^{2x}\\cos x\\,dx$.",
      "Second round: $\\int e^{2x}\\cos x\\,dx=\\frac{1}{2}e^{2x}\\cos x+\\frac{1}{2}I$.",
      "Substitute back: $I=\\frac{1}{2}e^{2x}\\sin x-\\frac{1}{4}e^{2x}\\cos x-\\frac{1}{4}I$, so $\\frac{5}{4}I=\\frac{e^{2x}(2\\sin x-\\cos x)}{4}$.",
      "$I=\\frac{e^{2x}(2\\sin x-\\cos x)}{5}+C$."
    ],
    "trap": "Swapping the roles of $u,dv$ in the second round (integrating the trig function instead), which loops straight back to $I=I$ and gets you nothing; integrate the same factor ($e^{2x}$) both times.",
    "check": "At $x=0$ the integrand is $0$, so the answer's slope must also be $0$."
  },
  "exam-int-013": {
    "spot": "Just a lone $\\arctan x$: an inverse trig function by itself means integration by parts with $dx$ as $dv$.",
    "why": "$\\arctan x$ differentiates to the rational function $\\frac{1}{1+x^2}$; multiplied by $x$ it becomes a log form, which is easy.",
    "steps": [
      "$u=\\arctan x$, $dv=dx$: $\\int\\arctan x\\,dx=x\\arctan x-\\int\\frac{x}{1+x^2}\\,dx$.",
      "The numerator $x$ is half the derivative of $1+x^2$: $\\int\\frac{x}{1+x^2}\\,dx=\\frac{1}{2}\\ln(1+x^2)$.",
      "Answer: $x\\arctan x-\\frac{1}{2}\\ln(1+x^2)+C$."
    ],
    "trap": "Treating $\\int\\frac{x}{1+x^2}\\,dx$ as $\\arctan x$; with an $x$ in the numerator it's a log, not an inverse tangent.",
    "check": "The answer's derivative at $x=1$ should equal $\\arctan 1=\\frac{\\pi}{4}$."
  },
  "exam-int-025": {
    "spot": "$\\ln x$ is $-\\infty$ at $x=0$ — the lower limit is a singular point, so use the antiderivative $x\\ln x-x$ and take the limit as $x\\to 0^+$.",
    "why": "The antiderivative is known; the only key point is the $0\\cdot\\infty$ limit at the boundary, $x\\ln x\\to 0$.",
    "steps": [
      "Antiderivative: $\\int\\ln x\\,dx=x\\ln x-x$ (integration by parts with $u=\\ln x$, $dv=dx$).",
      "Lower limit: $x\\ln x\\to 0$ ($x$ goes to $0$ faster than $\\ln x$ blows up), so $x\\ln x-x\\to 0$.",
      "Upper limit: $1\\cdot\\ln 1-1=-1$, so the integral $=-1-0=-1$."
    ],
    "trap": "Seeing $\\ln 0=-\\infty$ and declaring the integral divergent. For an improper integral, look at the limit: $x\\ln x\\to 0$, so the area is finite.",
    "check": "Look at the same area another way: the region between $y=\\ln x$ and the $x$-axis on $(0,1)$, flipped over, is the area under $x=e^y$ (for $y\\le 0$), which is exactly $1$."
  },
  "exam-int-026": {
    "spot": "Exponential decay with upper limit $\\infty$: the antiderivative of $e^{-2x}$ is $-\\frac{1}{2}e^{-2x}$, which tends to $0$ far out.",
    "why": "Write the improper integral as a limit and plug into the antiderivative; exponential decay is $0$ at infinity.",
    "steps": [
      "Antiderivative: $\\int e^{-2x}\\,dx=-\\frac{1}{2}e^{-2x}$.",
      "Upper limit $x\\to\\infty$: $-\\frac{1}{2}e^{-2x}\\to 0$; lower limit $x=0$: $-\\frac{1}{2}$.",
      "Integral $=0-(-\\frac{1}{2})=\\frac{1}{2}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ from the Chain Rule in the antiderivative and answering $1$; or subtracting the limits in the wrong order and answering $-\\frac{1}{2}$ (the integrand is positive, so the integral can't be negative).",
    "check": "Let $u=2x$: $\\frac{1}{2}\\int_0^\\infty e^{-u}\\,du=\\frac{1}{2}$ — consistent."
  },
  "exam-int-028": {
    "spot": "$x$ times $\\ln(1+x^2)$: $x\\,dx$ is half of $d(1+x^2)$ — first let $u=1+x^2$, leaving $\\int\\ln u\\,du$.",
    "why": "Substituting first and then handling $\\ln u$ avoids a layer of rational functions compared with integrating $x\\ln(1+x^2)$ by parts directly.",
    "steps": [
      "Let $u=1+x^2$, $du=2x\\,dx$; the limits become $x=0\\to u=1$, $x=1\\to u=2$. The integral becomes $\\frac{1}{2}\\int_1^2\\ln u\\,du$.",
      "$\\int\\ln u\\,du=u\\ln u-u$; plugging in the limits: $(2\\ln 2-2)-(0-1)=2\\ln 2-1$.",
      "Multiply by $\\frac{1}{2}$: $\\ln 2-\\frac{1}{2}$."
    ],
    "trap": "Forgetting to change the limits after substituting and computing $\\frac{1}{2}\\int_0^1\\ln u\\,du=-\\frac{1}{2}$ — the integrand is nonnegative, so a negative answer should set off alarms.",
    "check": "$0\\le\\ln(1+x^2)\\le\\ln 2$, so $0\\le$ the integral $\\le\\ln 2\\int_0^1x\\,dx=\\frac{\\ln 2}{2}$; $\\ln 2-\\frac{1}{2}\\approx 0.193$ falls inside."
  },
  "exam-int-029": {
    "spot": "Polynomial $x$ times trig $\\sin x$ — integration by parts with $u=x$, which disappears after one derivative.",
    "why": "$x$ differentiates to $1$, leaving $\\int\\cos x$, done immediately; choosing the other way only raises the power.",
    "steps": [
      "$u=x$, $dv=\\sin x\\,dx$: $\\int x\\sin x\\,dx=-x\\cos x+\\int\\cos x\\,dx=-x\\cos x+\\sin x$.",
      "Plug in the limits: at $\\pi$ it is $-\\pi\\cos\\pi+0=\\pi$, at $0$ it is $0$.",
      "Integral $=\\pi$."
    ],
    "trap": "Getting the sign of $-x\\cos x$ at $\\pi$ wrong: $\\cos\\pi=-1$, so $-\\pi\\cdot(-1)=+\\pi$; writing $-\\pi$ means a positive integrand gives a negative integral.",
    "check": "Symmetry trick: $\\int_0^\\pi x f(\\sin x)\\,dx=\\frac{\\pi}{2}\\int_0^\\pi f(\\sin x)\\,dx$, so the answer $=\\frac{\\pi}{2}\\cdot 2=\\pi$."
  },
  "exam-lim-002": {
    "spot": "The numerator is $\\ln(1+2x)$ minus $2x-2x^2$ — exactly the first two terms of the expansion of $\\ln(1+u)$ with $u=2x$ — over $x^3$: expand to the cubic term and read off the coefficient.",
    "why": "However many terms are subtracted, expand to the next one; L'Hôpital's Rule needs three derivatives, each with powers of $\\frac{1}{1+2x}$ — slow and error-prone.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "$\\ln(1+u)=u-\\frac{u^2}{2}+\\frac{u^3}{3}-\\cdots$, with cubic coefficient $\\frac{1}{3}$.",
      "Substitute $u=2x$: $\\ln(1+2x)=2x-2x^2+\\frac{8}{3}x^3-\\cdots$; removing the first two terms leaves $\\frac{8}{3}x^3$.",
      "Divide by $x^3$: the limit is $\\frac{8}{3}$."
    ],
    "trap": "Forgetting to include the $2^3$ in $u^3$ when substituting $u=2x$, and answering $\\frac{1}{3}$.",
    "check": "Plug in $x=0.01$: the ratio is slightly less than $\\frac{8}{3}$ (the next term $-\\frac{(2x)^4}{4}$ is negative)."
  },
  "exam-lim-006": {
    "spot": "The numerator is $\\sqrt{1+4x}$ minus $1+2x$ (the first two terms of its expansion), over $x^2$ — binomial expansion to the quadratic term.",
    "why": "The expansion gives the coefficient in one line; rationalizing also works, but you multiply by the conjugate and then still have a fraction to handle — longer.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "$\\sqrt{1+u}=1+\\frac{u}{2}-\\frac{u^2}{8}+\\cdots$.",
      "Substitute $u=4x$: $-\\frac{(4x)^2}{8}=-2x^2$, so the numerator is $\\approx-2x^2$.",
      "Divide by $x^2$: the limit is $-2$."
    ],
    "trap": "Not squaring the $4$ in the quadratic term, writing $-\\frac{4}{8}$, and answering $-\\frac{1}{2}$.",
    "check": "Plug in $x=0.01$: the ratio is slightly greater than $-2$ (the next term $+\\frac{(4x)^3}{16}$ is positive)."
  },
  "exam-multi-009": {
    "spot": "Divergence: differentiate the first component in $x$, the second in $y$, the third in $z$, then add — keep the positions lined up.",
    "why": "Divergence uses only the three \"diagonal\" partial derivatives; none of the cross partials are needed.",
    "steps": [
      "$\\frac{\\partial}{\\partial x}(x^2y)=2xy$.",
      "$\\frac{\\partial}{\\partial y}(y^2z)=2yz$.",
      "$\\frac{\\partial}{\\partial z}(z^2x)=2zx$.",
      "Add: $\\nabla\\cdot\\mathbf{F}=2xy+2yz+2zx$."
    ],
    "trap": "Misaligning the variables (e.g. differentiating the first component in $y$), which gives something like $x^2+y^2+z^2$ — that's a mismatch, not the divergence.",
    "check": "At $(1,1,1)$ each of the three terms gives $2$, so the divergence is $6$."
  },
  "gap-int-pf-001": {
    "spot": "The denominator $x^2-1=(x-1)(x+1)$ splits into two distinct linear factors — partial fractions, and both pieces are logarithms.",
    "why": "For distinct linear factors the cover-up method finds the coefficients in one line; don't confuse this with the inverse tangent from $\\frac{1}{x^2+1}$.",
    "steps": [
      "Factor: $x^2-1=(x-1)(x+1)$.",
      "Cover-up method: $\\frac{1}{x^2-1}=\\frac{1/2}{x-1}-\\frac{1/2}{x+1}$.",
      "Integrate term by term: $\\frac{1}{2}\\ln|x-1|-\\frac{1}{2}\\ln|x+1|+C$ (on $x>1$ the absolute values can be dropped)."
    ],
    "trap": "Reading it as $\\frac{1}{x^2+1}$ and writing $\\arctan x$; the sign is minus, so the denominator factors — it's logs, not inverse tangent.",
    "check": "At $x=2$ the integrand is $\\frac{1}{3}$, so the answer's slope must also be $\\frac{1}{3}$."
  },
  "gap-int-pf-002": {
    "spot": "The denominator is $x^2+x=x(x+1)$ and the numerator is exactly $x+1$ — cancel first, and only $\\frac{1}{x}$ is left.",
    "why": "If it cancels, cancel first; no need for partial fractions.",
    "steps": [
      "Factor the denominator: $x^2+x=x(x+1)$.",
      "Cancel $x+1$: $\\frac{x+1}{x(x+1)}=\\frac{1}{x}$.",
      "Integrate: $\\ln|x|+C$."
    ],
    "trap": "Thinking the numerator looks like the denominator's derivative and writing $\\ln(x^2+x)$ directly; but $(x^2+x)'=2x+1\\ne x+1$, so differentiating back doesn't match.",
    "check": "At $x=2$ the integrand is $\\frac{3}{6}=\\frac{1}{2}$, so the answer's slope must also be $\\frac{1}{2}$."
  },
  "gap-int-pf-004": {
    "spot": "The derivative of the denominator $x^2+3x+2$ is $2x+3$ — exactly the numerator, so it's $\\ln$ of the denominator; and the denominator also factors as $(x+1)(x+2)$.",
    "why": "\"Numerator = derivative of denominator\" finishes in one step; partial fractions also works (both coefficients are $1$) but takes an extra step.",
    "steps": [
      "Derivative of the denominator: $(x^2+3x+2)'=2x+3$, equal to the numerator.",
      "So the integral $=\\ln|x^2+3x+2|$; splitting with $(x+1)(x+2)$ gives $\\ln|x+1|+\\ln|x+2|$.",
      "Answer: $\\ln|x+1|+\\ln|x+2|+C$."
    ],
    "trap": "Going the partial fractions route and getting the coefficients wrong as $\\frac{1}{x+1}-\\frac{1}{x+2}$; cover-up: at $x=-1$ it's $\\frac{1}{1}=1$, at $x=-2$ it's $\\frac{-1}{-1}=1$ — both are $+1$.",
    "check": "At $x=0$ the integrand is $\\frac{3}{2}$, so the answer's slope must also be $\\frac{3}{2}$."
  },
  "gap-int-pf-006": {
    "spot": "The denominator $x^2+x-2=(x-1)(x+2)$ has distinct linear factors, and the numerator $3x+5$ is not the denominator's derivative — partial fractions, with coefficients from the cover-up method.",
    "why": "Cover-up method: cover one factor, plug in its root, and get one coefficient at a time; faster than solving a system.",
    "steps": [
      "Factor: $x^2+x-2=(x-1)(x+2)$.",
      "$A$: cover $x-1$, plug in $x=1$: $\\frac{3+5}{1+2}=\\frac{8}{3}$. $B$: cover $x+2$, plug in $x=-2$: $\\frac{-6+5}{-2-1}=\\frac{1}{3}$.",
      "So $\\frac{3x+5}{x^2+x-2}=\\frac{8/3}{x-1}+\\frac{1/3}{x+2}$.",
      "Integrate: $\\frac{8}{3}\\ln|x-1|+\\frac{1}{3}\\ln|x+2|+C$."
    ],
    "trap": "Losing the sign of $-2-1=-3$ in the denominator when computing $B$, which gives $B=-\\frac{1}{3}$.",
    "check": "After combining, the $x$ coefficient of the numerator is $A+B$, which must equal $3$: $\\frac{8}{3}+\\frac{1}{3}=3$."
  },
  "gap-ser-cond-001": {
    "spot": "$\\frac{(-1)^n}{n}$: alternating signs with size $\\frac{1}{n}$ — the alternating harmonic series, the classic \"convergent but not absolutely convergent\".",
    "why": "Two questions: take absolute values to check absolute convergence (harmonic series → no), then use the Alternating Series Test to check whether the series itself converges (yes).",
    "steps": [
      "Absolute values: $\\sum\\frac{1}{n}$ is the harmonic series, with partial sums $\\ge\\ln(N+1)$, unbounded — so not absolutely convergent.",
      "Alternating Series Test: $\\frac{1}{n}$ decreases monotonically and $\\to 0$, so the original series converges.",
      "The actual sum is $-\\ln 2$.",
      "Convergent but not absolutely convergent: conditionally convergent."
    ],
    "trap": "Saying it converges absolutely just because the terms go to $0$, or saying the whole thing diverges because the harmonic series does. The two questions must be asked separately.",
    "check": "Compare $\\sum\\frac{(-1)^n}{n^2}$: its absolute values form a p-series with $p=2$ — that one is absolutely convergent."
  },
  "gap-ser-end-002": {
    "spot": "At $x=1$, $\\frac{x^n}{n}$ becomes $\\frac{1}{n}$ — the harmonic series: the terms go to $0$ but the sum grows without bound.",
    "why": "The radius of convergence is $1$, so the endpoint has to be plugged in and checked separately; once you recognize the harmonic series, you're done.",
    "steps": [
      "Substitute: $\\sum\\frac{1^n}{n}=\\sum\\frac{1}{n}=1+\\frac{1}{2}+\\frac{1}{3}+\\cdots$.",
      "The terms do go to $0$, but that doesn't guarantee convergence.",
      "Integral Test: the partial sums are $\\ge\\int_1^{N+1}\\frac{dx}{x}=\\ln(N+1)$, which grows without bound in $N$.",
      "So it diverges at $x=1$."
    ],
    "trap": "\"The terms go to $0$, so it converges\" — that's only a necessary condition; the harmonic series is the textbook counterexample.",
    "check": "The other endpoint $x=-1$ gives the alternating harmonic series, which converges to $-\\ln 2$; the two endpoints behave differently."
  },
  "hc-der-009": {
    "spot": "Every two derivatives turn $\\cos(2x)$ back into itself times $-4$, and $12$ is even (in fact a multiple of $4$) — the $12$th derivative is $(-4)^6\\cos 2x$.",
    "why": "Spotting the periodic pattern finishes it in one step; you could also read it from the Taylor coefficient, but the pattern is more direct.",
    "steps": [
      "Two derivatives: $(\\cos 2x)''=-4\\cos 2x$.",
      "$12$ derivatives $=6$ rounds of \"differentiate twice\": $\\frac{d^{12}}{dx^{12}}\\cos 2x=(-4)^6\\cos 2x=4096\\cos 2x$.",
      "Plug in $x=0$: $4096\\cos 0=4096$."
    ],
    "trap": "Getting the sign wrong as $-4096$: an even power of $(-4)$ is positive; or writing the coefficient as $2\\cdot 12=24$ (adding the Chain Rule factors $2$ instead of multiplying them).",
    "check": "Taylor view: the coefficient of $x^{12}$ in $\\cos 2x$ is $\\frac{(-1)^6 2^{12}}{12!}$, and multiplying by $12!$ gives $2^{12}$."
  },
  "hc-ibp-002": {
    "spot": "$x^2$ times $\\cos 3x$: the polynomial is gone after two derivatives — tabular method (two rounds of integration by parts), carrying a $\\frac{1}{3}$ at every level.",
    "why": "The tabular method lays out two rounds of integration by parts in one chart, with alternating signs and no missed terms.",
    "steps": [
      "Differentiate column: $x^2,\\ 2x,\\ 2,\\ 0$; integrate column: $\\cos 3x\\to\\frac{\\sin 3x}{3}\\to-\\frac{\\cos 3x}{9}\\to-\\frac{\\sin 3x}{27}$.",
      "Multiply along the diagonals with signs $+,-,+$: $x^2\\cdot\\frac{\\sin 3x}{3}-2x\\cdot\\left(-\\frac{\\cos 3x}{9}\\right)+2\\cdot\\left(-\\frac{\\sin 3x}{27}\\right)$.",
      "Answer: $\\frac{x^2\\sin 3x}{3}+\\frac{2x\\cos 3x}{9}-\\frac{2\\sin 3x}{27}+C$."
    ],
    "trap": "Forgetting to divide by another $3$ at each integration in the integrate column and writing $x^2\\sin 3x+2x\\cos 3x-2\\sin 3x$; differentiating back leaves a pile of extra multiples of $3$.",
    "check": "At $x=0$ the integrand is $0$, so the answer's slope must also be $0$."
  },
  "hc-ibp-003": {
    "spot": "The polynomial $x^2$ times $e^x\\sin x$, which itself needs cyclic integration by parts — use the tabular method: differentiate $x^2$ down, integrate $e^x\\sin x$ three times (each integral has a closed form).",
    "why": "Treat $e^x\\sin x$ as one unit and integrate it repeatedly, and the table needs only three rows; breaking it into several rounds of cyclic integration by parts makes it easy to drop a sign.",
    "steps": [
      "First integral: $S_1=\\int e^x\\sin x\\,dx=\\frac{e^x(\\sin x-\\cos x)}{2}$.",
      "Integrate again: $S_2=\\int S_1=-\\frac{e^x\\cos x}{2}$; and again: $S_3=\\int S_2=-\\frac{e^x(\\sin x+\\cos x)}{4}$.",
      "Tabular method: $x^2S_1-2xS_2+2S_3=\\frac{x^2e^x(\\sin x-\\cos x)}{2}+xe^x\\cos x-\\frac{e^x(\\sin x+\\cos x)}{2}$.",
      "Tidy up: $\\frac{e^x\\left[(x^2-1)\\sin x+(2x-1-x^2)\\cos x\\right]}{2}+C$."
    ],
    "trap": "Not alternating the signs in the table (using plus for all three terms), so $-2xS_2$ becomes $+2xS_2$ and the coefficient of $\\cos x$ comes out wrong.",
    "check": "At $x=0$ the integrand is $0$, so the answer's slope must also be $0$."
  },
  "hc-ibp-006": {
    "spot": "$e^{2x}$ times $\\sin 3x$: neither differentiates away — cyclic type. Let $P=e^{2x}\\sin 3x$ and $Q=e^{2x}\\cos 3x$; their derivatives are linear combinations of each other, so build a combination whose derivative is $P$.",
    "why": "Integrating by parts twice and solving also works; viewing it as linear algebra in $P,Q$ is faster and gives the formula $\\frac{e^{ax}(a\\sin bx-b\\cos bx)}{a^2+b^2}$ directly.",
    "steps": [
      "$P'=2P+3Q$, $Q'=2Q-3P$.",
      "Take $2P-3Q$: $(2P-3Q)'=4P+6Q-6Q+9P=13P$.",
      "So $\\int P\\,dx=\\frac{2P-3Q}{13}=\\frac{e^{2x}(2\\sin 3x-3\\cos 3x)}{13}+C$."
    ],
    "trap": "Writing the denominator as $2+3=5$ or $2\\cdot 3$; the correct one is $a^2+b^2=4+9=13$.",
    "check": "At $x=0$ the integrand is $0$, so the answer's slope must also be $0$."
  },
  "hc-rad-001": {
    "spot": "Inside the root is $x^2-1$ (variable squared minus a constant) — secant substitution $x=\\sec\\theta$, $\\sqrt{x^2-1}=\\tan\\theta$.",
    "why": "After substituting, $\\sec\\theta\\tan\\theta$ cancels everything in the denominator except $\\cos\\theta$; other substitutions can't get rid of the root.",
    "steps": [
      "Let $x=\\sec\\theta$ ($0<\\theta<\\frac{\\pi}{2}$), $\\sqrt{x^2-1}=\\tan\\theta$, $dx=\\sec\\theta\\tan\\theta\\,d\\theta$.",
      "The integrand becomes $\\frac{\\sec\\theta\\tan\\theta}{\\sec^2\\theta\\tan\\theta}\\,d\\theta=\\cos\\theta\\,d\\theta$.",
      "$\\int\\cos\\theta\\,d\\theta=\\sin\\theta$; draw the triangle to go back to $x$: $\\sin\\theta=\\frac{\\tan\\theta}{\\sec\\theta}=\\frac{\\sqrt{x^2-1}}{x}$.",
      "Answer: $\\frac{\\sqrt{x^2-1}}{x}+C$."
    ],
    "trap": "Leaving out $dx=\\sec\\theta\\tan\\theta\\,d\\theta$ and taking $\\frac{1}{\\sec^2\\theta\\tan\\theta}$ as the integrand; after that, nothing you integrate will match.",
    "check": "At $x=2$ the integrand is $\\frac{1}{4\\sqrt{3}}$, and the answer's slope must be the same."
  },
  "hc-rad-005": {
    "spot": "$x^2-4$ under a root, divided by $x$, with the range starting at $2$ — secant substitution $x=2\\sec\\theta$, with new limits $\\theta=0$ to $\\frac{\\pi}{3}$.",
    "why": "After substituting it becomes $2\\tan^2\\theta$, which integrates in one go using $\\tan^2=\\sec^2-1$; changing the limits directly saves converting back to $x$.",
    "steps": [
      "Let $x=2\\sec\\theta$: $\\sqrt{x^2-4}=2\\tan\\theta$, $dx=2\\sec\\theta\\tan\\theta\\,d\\theta$, and the integrand becomes $\\frac{2\\tan\\theta}{2\\sec\\theta}\\cdot 2\\sec\\theta\\tan\\theta\\,d\\theta=2\\tan^2\\theta\\,d\\theta$.",
      "Change the limits: $x=2\\Rightarrow\\sec\\theta=1,\\ \\theta=0$; $x=4\\Rightarrow\\sec\\theta=2,\\ \\theta=\\frac{\\pi}{3}$.",
      "$\\int_0^{\\pi/3}2(\\sec^2\\theta-1)\\,d\\theta=\\left[2\\tan\\theta-2\\theta\\right]_0^{\\pi/3}=2\\sqrt{3}-\\frac{2\\pi}{3}$.",
      "Answer: $2\\sqrt{3}-\\frac{2\\pi}{3}$."
    ],
    "trap": "Plugging the $x$-limits $2,4$ into $\\theta$ after substituting, which gives a meaningless number; or computing the upper limit as $\\frac{\\pi}{6}$ ($\\cos\\theta=\\frac{1}{2}$ corresponds to $\\frac{\\pi}{3}$).",
    "check": "On $[2,4]$ the integrand increases from $0$ to $\\frac{\\sqrt{3}}{2}$, so the integral must lie between $0$ and $2\\cdot\\frac{\\sqrt{3}}{2}=\\sqrt{3}$; the answer is $\\approx 1.370$."
  },
  "hc-rad-006": {
    "spot": "Denominator $1+\\sin x$ — multiply top and bottom by the conjugate $1-\\sin x$; the denominator becomes $\\cos^2x$, which splits into $\\sec^2x-\\sec x\\tan x$, both basic antiderivatives.",
    "why": "After multiplying by the conjugate both terms are instantly recognizable; the universal substitution $t=\\tan\\frac{x}{2}$ also works but needs another change of variable.",
    "steps": [
      "Multiply by the conjugate: $\\frac{1}{1+\\sin x}=\\frac{1-\\sin x}{\\cos^2x}=\\sec^2x-\\sec x\\tan x$.",
      "Antiderivative: $\\tan x-\\sec x$.",
      "The upper limit needs a limit: $\\tan x-\\sec x=\\frac{\\sin x-1}{\\cos x}\\to 0$ (as $x\\to\\frac{\\pi}{2}^-$); lower limit $\\tan 0-\\sec 0=-1$.",
      "Integral $=0-(-1)=1$."
    ],
    "trap": "Plugging $\\tan\\frac{\\pi}{2}$ and $\\sec\\frac{\\pi}{2}$ in separately at the upper limit, getting $\\infty-\\infty$, and calling it divergent. Combine the two terms into $\\frac{\\sin x-1}{\\cos x}$ first, then take the limit.",
    "check": "Universal substitution $t=\\tan\\frac{x}{2}$: the integral becomes $\\int_0^1\\frac{2}{(1+t)^2}\\,dt=1$ — consistent."
  },
  "int-052": {
    "spot": "$x^2$ times $e^x$: the polynomial is gone after two derivatives, and $e^x$ stays $e^x$ however often you integrate — tabular method; the result is $e^x$ times a quadratic.",
    "why": "The tabular method handles two rounds of integration by parts in one chart; $e^x$ doesn't change, so you only need to get the signs right.",
    "steps": [
      "First round: $\\int x^2e^x\\,dx=x^2e^x-\\int 2xe^x\\,dx$.",
      "Second round: $\\int 2xe^x\\,dx=2xe^x-2e^x$.",
      "Combine: $x^2e^x-2xe^x+2e^x=e^x(x^2-2x+2)+C$."
    ],
    "trap": "Getting the sign of the last term wrong as $-2e^x$ (subtracting a negative without flipping the sign); differentiating back leaves a leftover like $-4e^x$.",
    "check": "At $x=1$ the integrand is $e$, so the answer's slope must also be $e$."
  },
  "int-060": {
    "spot": "The integrand is $\\sin(x-t)\\cos t$ with integration variable $t$ and $x$ held constant — product-to-sum splits the product, and one term integrates to zero over the symmetric range.",
    "why": "After product-to-sum both terms integrate directly; this is really the convolution of $\\sin$ and $\\cos$, and the Laplace transform $\\frac{s}{(s^2+1)^2}$ gives the same answer.",
    "steps": [
      "Product-to-sum: $\\sin(x-t)\\cos t=\\frac{1}{2}\\left[\\sin x+\\sin(x-2t)\\right]$.",
      "The first term is constant in $t$: $\\int_0^x\\frac{\\sin x}{2}\\,dt=\\frac{x\\sin x}{2}$.",
      "Second term: $\\int_0^x\\sin(x-2t)\\,dt=\\left[\\frac{\\cos(x-2t)}{2}\\right]_0^x=\\frac{\\cos(-x)-\\cos x}{2}=0$.",
      "So $F(x)=\\frac{x\\sin x}{2}$."
    ],
    "trap": "Treating the $x$ in $\\sin(x-t)$ as an integration variable too, or splitting $\\sin(x-t)$ into $\\sin x-\\sin t$; only the angle-sum or product-to-sum formulas are valid.",
    "check": "At $x=\\frac{\\pi}{2}$ the integrand is $\\cos^2t$, and $\\int_0^{\\pi/2}\\cos^2t\\,dt=\\frac{\\pi}{4}$; plugging into the answer also gives $\\frac{\\pi}{4}$."
  },
  "mob-gamma-001": {
    "spot": "$\\Gamma(1)$: in the definition $\\int_0^\\infty t^{s-1}e^{-t}\\,dt$ we get $t^0=1$, leaving just $\\int_0^\\infty e^{-t}\\,dt$.",
    "why": "This is the starting point of the whole recursion; going back to the definition is cleanest.",
    "steps": [
      "$s=1$: $t^{s-1}=t^0=1$, so $\\Gamma(1)=\\int_0^\\infty e^{-t}\\,dt$.",
      "The antiderivative $-e^{-t}$ tends to $0$ at $\\infty$ and equals $-1$ at $0$.",
      "$\\Gamma(1)=0-(-1)=1$."
    ],
    "trap": "Remembering $\\Gamma(n)=(n-1)!$ as $n!$: for $\\Gamma(1)$ both happen to give $1$ so you won't notice, but $\\Gamma(6)$ would come out as $720$.",
    "check": "Recursion: $\\Gamma(2)=1\\cdot\\Gamma(1)$, and $\\Gamma(2)=\\int_0^\\infty te^{-t}\\,dt$ is also $1$."
  },
  "mob-gamma-004": {
    "spot": "$\\frac{5}{2}$ is a half-integer — apply $\\Gamma(s+1)=s\\,\\Gamma(s)$ twice to step down to $\\Gamma(\\frac{1}{2})=\\sqrt{\\pi}$.",
    "why": "$\\Gamma(\\frac{1}{2})$ is the only non-integer value worth memorizing; every other half-integer follows by multiplying through the recursion.",
    "steps": [
      "$\\Gamma(\\frac{5}{2})=\\frac{3}{2}\\Gamma(\\frac{3}{2})$.",
      "$\\Gamma(\\frac{3}{2})=\\frac{1}{2}\\Gamma(\\frac{1}{2})$, and $\\Gamma(\\frac{1}{2})=2\\int_0^\\infty e^{-u^2}\\,du=\\sqrt{\\pi}$.",
      "$\\Gamma(\\frac{5}{2})=\\frac{3}{2}\\cdot\\frac{1}{2}\\sqrt{\\pi}=\\frac{3\\sqrt{\\pi}}{4}$."
    ],
    "trap": "Multiplying by the wrong parameter in the recursion: writing $\\frac{5}{2}\\cdot\\frac{3}{2}\\Gamma(\\frac{3}{2})$ and getting $\\frac{15\\sqrt{\\pi}}{8}$. In $\\Gamma(s+1)=s\\Gamma(s)$ you multiply by the smaller one.",
    "check": "$\\Gamma(2)=1$ and $\\Gamma(3)=2$, so $\\Gamma(\\frac{5}{2})$ should lie between them; $\\frac{3\\sqrt{\\pi}}{4}\\approx 1.329$."
  },
  "mob-gamma-005": {
    "spot": "A positive integer argument — $\\Gamma(n)=(n-1)!$, so $\\Gamma(6)=5!$.",
    "why": "Integer $\\Gamma$ is just the factorial shifted by one; the recursion $\\Gamma(s+1)=s\\Gamma(s)$ steps all the way down to $\\Gamma(1)=1$.",
    "steps": [
      "Recursion: $\\Gamma(6)=5\\,\\Gamma(5)$ (integration by parts: $\\int t^5e^{-t}=5\\int t^4e^{-t}$).",
      "All the way down: $\\Gamma(6)=5\\cdot 4\\cdot 3\\cdot 2\\cdot 1\\cdot\\Gamma(1)$, and $\\Gamma(1)=1$.",
      "$\\Gamma(6)=5\\cdot 4\\cdot 3\\cdot 2\\cdot 1=120$."
    ],
    "trap": "Remembering it as $\\Gamma(n)=n!$ and answering $6!=720$. You have to shift back by one.",
    "check": "Ratio of neighbors: $\\frac{\\Gamma(6)}{\\Gamma(5)}=5$, with $\\Gamma(5)=24$."
  }
};
