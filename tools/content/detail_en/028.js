// Detail v2, English — batch 028. Translation of tools/content/detail/028.js (text only; claims live in the Chinese file).
module.exports = {
  "world-051": {
    "spot": "The integrand is $\\arctan(\\sqrt{x^2+2})$ divided by $\\sqrt{x^2+2}$ — this is Ahmed's integral. Put a parameter $t$ in front of the $\\sqrt{x^2+2}$ inside $\\arctan$; as $t\\to\\infty$ the $\\arctan$ becomes $\\frac{\\pi}{2}$ and the remaining integral can be computed.",
    "why": "Looking for an antiderivative goes nowhere. After parametrizing, differentiate in $t$: the $\\arctan$ disappears, leaving a rational function, and the symmetry $t\\mapsto\\frac{1}{t}$ makes the unknown integral show up on both sides of the equation.",
    "steps": [
      "Let $F(t)=\\int_0^1\\frac{\\arctan(t\\sqrt{x^2+2})}{(x^2+1)\\sqrt{x^2+2}}dx$; we want $A=F(1)$. As $t\\to\\infty$, $\\arctan\\to\\frac{\\pi}{2}$, and $\\int_0^1\\frac{dx}{(x^2+1)\\sqrt{x^2+2}}=\\frac{\\pi}{6}$, so $F(\\infty)=\\frac{\\pi}{2}\\cdot\\frac{\\pi}{6}=\\frac{\\pi^2}{12}$.",
      "Differentiate in $t$: $F'(t)=\\int_0^1\\frac{dx}{(x^2+1)(1+t^2(x^2+2))}$, and partial fractions give $\\frac{1}{1+t^2}\\left[\\frac{1}{x^2+1}-\\frac{t^2}{1+2t^2+t^2x^2}\\right]$.",
      "The second term integrates: $\\int_0^1\\frac{t^2\\,dx}{1+2t^2+t^2x^2}=\\frac{t}{\\sqrt{1+2t^2}}\\arctan\\frac{t}{\\sqrt{1+2t^2}}$. So $F'(t)=\\frac{1}{1+t^2}\\left[\\frac{\\pi}{4}-\\frac{t}{\\sqrt{1+2t^2}}\\arctan\\frac{t}{\\sqrt{1+2t^2}}\\right]$.",
      "$A=F(\\infty)-\\int_1^\\infty F'(t)\\,dt$. The first piece: $\\int_1^\\infty\\frac{\\pi/4}{1+t^2}dt=\\frac{\\pi}{4}\\cdot\\frac{\\pi}{4}=\\frac{\\pi^2}{16}$.",
      "In the second piece substitute $t=\\frac{1}{u}$: $\\frac{t}{\\sqrt{1+2t^2}}$ becomes $\\frac{1}{\\sqrt{u^2+2}}$, and the whole integral becomes $\\int_0^1\\frac{\\arctan\\frac{1}{\\sqrt{u^2+2}}}{(1+u^2)\\sqrt{u^2+2}}du$.",
      "Use $\\arctan\\frac{1}{a}=\\frac{\\pi}{2}-\\arctan a$: this piece equals $\\frac{\\pi}{2}\\cdot\\frac{\\pi}{6}-A=\\frac{\\pi^2}{12}-A$ — the unknown $A$ shows up again.",
      "Substitute back: $A=\\frac{\\pi^2}{12}-\\left[\\frac{\\pi^2}{16}-\\left(\\frac{\\pi^2}{12}-A\\right)\\right]$, i.e. $2A=\\frac{\\pi^2}{6}-\\frac{\\pi^2}{16}=\\frac{5\\pi^2}{48}$, so $A=\\frac{5\\pi^2}{96}$."
    ],
    "trap": "After the substitution in step five, forgetting the complementary relation between $\\arctan\\frac{1}{a}$ and $\\arctan a$ and trying to compute that piece as a new unknown. The whole point of this problem is to make $A$ appear on both sides and solve one equation.",
    "check": "Size: $\\sqrt{x^2+2}\\in[\\sqrt2,\\sqrt3]$, so $\\arctan$ lies between $0.95$ and $1.05$, and the integral is between $0.95\\cdot\\frac{\\pi}{6}$ and $1.05\\cdot\\frac{\\pi}{6}$; $\\frac{5\\pi^2}{96}\\approx 0.514$ is right inside."
  },
  "world-052": {
    "spot": "$\\ln(\\sin x)$ on $[0,\\frac{\\pi}{2}]$ has a ready-made Fourier series $-\\ln 2-\\sum\\frac{\\cos 2kx}{k}$; integrating its square is exactly Parseval's identity.",
    "why": "Differentiating the Beta function twice needs $\\psi'$, which is roundabout. Squaring the Fourier series, all cross terms integrate to $0$, leaving only $\\ln^2 2$ and $\\sum\\frac{1}{k^2}$.",
    "steps": [
      "First recall $\\int_0^{\\pi/2}\\ln(\\sin x)\\,dx=-\\frac{\\pi}{2}\\ln 2$, i.e. the constant term $-\\ln 2$ of the series times the interval length $\\frac{\\pi}{2}$.",
      "$\\ln(\\sin x)=-\\ln 2-\\sum_{k\\ge1}\\frac{\\cos 2kx}{k}$: the coefficients can be checked directly, $\\int_0^{\\pi/2}\\ln(\\sin x)\\cos 2kx\\,dx=-\\frac{1}{k}\\cdot\\frac{\\pi}{4}$.",
      "Square and integrate: the $\\cos 2kx$ are orthogonal to each other and to constants on $[0,\\frac{\\pi}{2}]$, so all cross terms are $0$; each $\\cos^2 2kx$ integrates to $\\frac{\\pi}{4}$.",
      "So $\\int_0^{\\pi/2}\\ln^2(\\sin x)\\,dx=\\frac{\\pi}{2}\\ln^2 2+\\frac{\\pi}{4}\\sum_{k\\ge1}\\frac{1}{k^2}$, and $\\sum\\frac{1}{k^2}=\\frac{\\pi^2}{6}$.",
      "Altogether: $\\frac{\\pi}{2}\\ln^2 2+\\frac{\\pi}{4}\\cdot\\frac{\\pi^2}{6}=\\frac{\\pi}{2}\\ln^2 2+\\frac{\\pi^3}{24}$."
    ],
    "trap": "Squaring only the constant term and answering $\\frac{\\pi}{2}\\ln^2 2$: that misses the $\\frac{\\pi}{4k^2}$ each $\\frac{\\cos 2kx}{k}$ contributes when squared, which add up to exactly $\\frac{\\pi^3}{24}$.",
    "check": "Cauchy-Schwarz: $\\int f^2\\ge\\frac{1}{\\pi/2}\\left(\\int f\\right)^2=\\frac{\\pi}{2}\\ln^2 2$, and the answer exceeds it by the positive $\\frac{\\pi^3}{24}$ — right direction."
  },
  "world-054": {
    "spot": "The interval is $[0,\\frac{\\pi}{2}]$ and the integrand has $\\cos$: substituting $x\\to\\frac{\\pi}{2}-x$ turns $\\cos$ into $\\sin$, giving the $\\ln^2(\\sin x)$ problem.",
    "why": "One symmetric substitution links the problem to a known result; then Parseval on the Fourier series of $\\ln(\\sin x)$ finishes it.",
    "steps": [
      "Let $x=\\frac{\\pi}{2}-s$: $\\cos x=\\sin s$, the limits $0\\leftrightarrow\\frac{\\pi}{2}$ swap and $dx=-ds$ flips them back, so $\\int_0^{\\pi/2}\\ln^2(\\cos x)\\,dx=\\int_0^{\\pi/2}\\ln^2(\\sin x)\\,dx$.",
      "$\\ln(\\sin x)=-\\ln 2-\\sum_{k\\ge1}\\frac{\\cos 2kx}{k}$, with coefficients $\\int_0^{\\pi/2}\\ln(\\sin x)\\cos 2kx\\,dx=-\\frac{\\pi}{4k}$.",
      "Parseval: the constant term contributes $\\frac{\\pi}{2}\\ln^2 2$, each $\\frac{\\cos 2kx}{k}$ contributes $\\frac{1}{k^2}\\cdot\\frac{\\pi}{4}$, and the cross terms integrate to $0$.",
      "Altogether $\\frac{\\pi}{2}\\ln^2 2+\\frac{\\pi}{4}\\cdot\\frac{\\pi^2}{6}=\\frac{\\pi}{2}\\ln^2 2+\\frac{\\pi^3}{24}$."
    ],
    "trap": "Thinking the series for $\\ln\\cos x$ differs from that of $\\ln\\sin x$ and redoing everything: in fact $\\ln\\cos x=-\\ln 2-\\sum\\frac{(-1)^k\\cos 2kx}{k}$, differing only in signs, which vanish after squaring.",
    "check": "Numerically about $2.0466$: $\\frac{\\pi}{2}(0.6931)^2\\approx 0.7547$ plus $\\frac{\\pi^3}{24}\\approx 1.2919$."
  },
  "world-063": {
    "spot": "Denominator $(1+x^2)^3$, integrated to $\\infty$: substitute $x=\\tan\\theta$, so $1+x^2$ becomes $\\sec^2\\theta$ and the problem becomes an integral of powers of $\\sin$ and $\\cos$.",
    "why": "Partial fractions with a triple repeated factor is tedious; the trigonometric substitution turns it into $\\int_0^{\\pi/2}\\sin^2\\theta\\cos^2\\theta\\,d\\theta$ in one step.",
    "steps": [
      "$x=\\tan\\theta$, $dx=\\sec^2\\theta\\,d\\theta$, and $x:0\\to\\infty$ corresponds to $\\theta:0\\to\\frac{\\pi}{2}$. The integrand $\\frac{\\tan^2\\theta}{\\sec^6\\theta}\\sec^2\\theta=\\sin^2\\theta\\cos^2\\theta$.",
      "Double angle: $\\sin^2\\theta\\cos^2\\theta=\\frac{\\sin^2 2\\theta}{4}=\\frac{1-\\cos 4\\theta}{8}$.",
      "$\\cos 4\\theta$ integrates to $0$ over $[0,\\frac{\\pi}{2}]$, leaving $\\frac{1}{8}\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{16}$."
    ],
    "trap": "Dropping $dx=\\sec^2\\theta\\,d\\theta$ in the substitution, so the integrand becomes $\\sin^2\\theta\\cos^4\\theta$ and you get $\\frac{\\pi}{32}$.",
    "check": "Beta function: $\\int_0^\\infty\\frac{x^2}{(1+x^2)^3}dx=\\frac{1}{2}B\\left(\\frac{3}{2},\\frac{3}{2}\\right)=\\frac{1}{2}\\cdot\\frac{\\pi}{8}$, again $\\frac{\\pi}{16}$."
  },
  "world-069": {
    "spot": "The denominator is a product of two different $x^2+a^2$: split $\\frac{1}{(1+x^2)(4+x^2)}$ into two $\\frac{1}{x^2+a^2}$, each integrating to $\\frac{\\pi}{2a}$.",
    "why": "Both factors are functions of $x^2$, so treating $x^2$ as one variable makes the partial fractions a one-liner; each piece is an $\\arctan$ type.",
    "steps": [
      "Partial fractions: $\\frac{1}{(1+x^2)(4+x^2)}=\\frac{1}{3}\\left(\\frac{1}{1+x^2}-\\frac{1}{4+x^2}\\right)$.",
      "$\\int_0^\\infty\\frac{dx}{x^2+a^2}=\\frac{\\pi}{2a}$: $a=1$ gives $\\frac{\\pi}{2}$, $a=2$ gives $\\frac{\\pi}{4}$.",
      "Subtract and divide by $3$: $\\frac{1}{3}\\left(\\frac{\\pi}{2}-\\frac{\\pi}{4}\\right)=\\frac{\\pi}{12}$."
    ],
    "trap": "Treating $\\int_0^\\infty\\frac{dx}{4+x^2}$ as $\\frac{\\pi}{2}$ too, so the two pieces cancel to $0$; with $a=2$ you must divide by $a$.",
    "check": "General formula $\\int_0^\\infty\\frac{dx}{(x^2+a^2)(x^2+b^2)}=\\frac{\\pi}{2ab(a+b)}$; $a=1$, $b=2$ gives $\\frac{\\pi}{12}$."
  },
  "world-083": {
    "spot": "Denominator $e^x+1$: dividing by $e^x$ gives $\\frac{e^{-x}}{1+e^{-x}}$, which expands as the alternating geometric series $\\sum(-1)^{n+1}e^{-nx}$; each term times $x$ is a Gamma integral.",
    "why": "There is no elementary antiderivative; expand and integrate term by term, and the answer lands on the alternating series $\\sum\\frac{(-1)^{n+1}}{n^2}$.",
    "steps": [
      "$\\frac{1}{e^x+1}=\\frac{e^{-x}}{1+e^{-x}}=\\sum_{n\\ge1}(-1)^{n+1}e^{-nx}$ (for $x>0$, $e^{-x}<1$).",
      "Integrate term by term: $\\int_0^\\infty xe^{-nx}\\,dx=\\frac{1}{n^2}$.",
      "So the integral $=\\sum_{n\\ge1}\\frac{(-1)^{n+1}}{n^2}=\\frac{\\pi^2}{6}-2\\cdot\\frac{\\pi^2}{24}=\\frac{\\pi^2}{12}$."
    ],
    "trap": "Confusing it with $\\int_0^\\infty\\frac{x}{e^x-1}dx=\\frac{\\pi^2}{6}$: with $+1$ in the denominator the series alternates and the answer is half as big.",
    "check": "$\\frac{x}{e^x+1}<\\frac{x}{e^x-1}$, so the answer must be less than $\\frac{\\pi^2}{6}$ — and it is exactly half of it."
  },
  "world-094": {
    "spot": "Denominator $1+x^4$, integrated from $0$ to $\\infty$: substituting $x\\to\\frac{1}{x}$ turns it into $\\int\\frac{x^2}{1+x^4}$; adding the two gives numerator $1+x^2$, and dividing by $x^2$ gives exactly $d\\left(x-\\frac{1}{x}\\right)$.",
    "why": "Brute-force partial fractions first needs $1+x^4$ factored as $(x^2+\\sqrt2x+1)(x^2-\\sqrt2x+1)$, with messy coefficients; the reciprocal symmetry reduces it to a single $\\frac{1}{u^2+2}$.",
    "steps": [
      "Substitute $x=\\frac{1}{s}$: $\\int_0^\\infty\\frac{dx}{1+x^4}=\\int_0^\\infty\\frac{s^2}{1+s^4}ds$. Call this value $I$.",
      "Add: $2I=\\int_0^\\infty\\frac{1+x^2}{1+x^4}dx$; dividing numerator and denominator by $x^2$ gives $\\frac{1+\\frac{1}{x^2}}{\\left(x-\\frac{1}{x}\\right)^2+2}$.",
      "Let $u=x-\\frac{1}{x}$, $du=\\left(1+\\frac{1}{x^2}\\right)dx$; $x:0\\to\\infty$ corresponds to $u:-\\infty\\to\\infty$: $2I=\\int_{-\\infty}^{\\infty}\\frac{du}{u^2+2}=\\frac{\\pi}{\\sqrt2}$.",
      "So $I=\\frac{\\pi}{2\\sqrt2}$."
    ],
    "trap": "Thinking $u=x-\\frac{1}{x}$ runs from $0$ to $\\infty$ and integrating over only half the real line, answering $\\frac{\\pi}{4\\sqrt2}$; as $x\\to 0^+$, $u\\to-\\infty$.",
    "check": "Bounds: on $[0,1]$, $\\frac{1}{1+x^4}\\le 1$; on $[1,\\infty)$ it is $\\le\\frac{1}{x^4}$, so $I<1+\\frac{1}{3}$; $\\frac{\\pi}{2\\sqrt2}\\approx 1.111$."
  },
  "world-097": {
    "spot": "$H_n$ times $x^n$, summed (here $x=\\frac{1}{2}$): $H_n=\\sum_{k\\le n}\\frac{1}{k}$ is a partial sum, and the generating function of partial sums is the original series divided by $1-x$.",
    "why": "Adding directly converges too slowly to see the answer; swapping the order of summation (or multiplying by $\\frac{1}{1-x}$) turns it into $-\\ln(1-x)$ in one step.",
    "steps": [
      "Swap the order: $\\sum_{n\\ge1}H_nx^n=\\sum_{k\\ge1}\\frac{1}{k}\\sum_{n\\ge k}x^n=\\sum_{k\\ge1}\\frac{1}{k}\\cdot\\frac{x^k}{1-x}$. At $x=\\frac{1}{2}$, $\\sum_{n\\ge k}\\frac{1}{2^n}=\\frac{2}{2^k}$.",
      "$\\sum_{k\\ge1}\\frac{x^k}{k}=-\\ln(1-x)$; at $x=\\frac{1}{2}$ this is $\\ln 2$.",
      "Multiply by $\\frac{1}{1-x}=2$: $\\sum\\frac{H_n}{2^n}=2\\ln 2$.",
      "Direct check: with $H_n=\\int_0^1\\frac{1-t^n}{1-t}dt$, summing the whole series indeed gives $2\\ln 2\\approx 1.386$."
    ],
    "trap": "Forgetting to divide by $1-x$ and answering $\\ln 2$: that is $\\sum\\frac{1}{n2^n}$, not $\\sum\\frac{H_n}{2^n}$.",
    "check": "The first three terms $\\frac{1}{2}+\\frac{3/2}{4}+\\frac{11/6}{8}\\approx 1.104$, and all later terms are positive, so the answer must be larger."
  },
  "world-098": {
    "spot": "$\\frac{x^2}{1+x^4}$ from $0$ to $\\infty$: substituting $x\\to\\frac{1}{x}$ turns it into exactly $\\frac{1}{1+x^4}$ — the two integrals are equal, and their sum has numerator $1+x^2$.",
    "why": "Reciprocal symmetry ties the two problems together; adding and dividing by $x^2$ gives the standard $u=x-\\frac{1}{x}$ form, with no need to factor the quartic.",
    "steps": [
      "Substitute $x=\\frac{1}{s}$: $\\frac{x^2}{1+x^4}dx$ becomes $\\frac{ds}{1+s^4}$, so $J=\\int_0^\\infty\\frac{x^2}{1+x^4}dx=\\int_0^\\infty\\frac{dx}{1+x^4}$.",
      "$2J=\\int_0^\\infty\\frac{1+x^2}{1+x^4}dx=\\int_0^\\infty\\frac{1+\\frac{1}{x^2}}{\\left(x-\\frac{1}{x}\\right)^2+2}dx$.",
      "Let $u=x-\\frac{1}{x}$, which runs over the whole real line: $2J=\\int_{-\\infty}^\\infty\\frac{du}{u^2+2}=\\frac{\\pi}{\\sqrt2}$.",
      "So $J=\\frac{\\pi}{2\\sqrt2}$."
    ],
    "trap": "Seeing $x^2$ in the numerator, assuming the integral is bigger or smaller than $\\int\\frac{dx}{1+x^4}$ and computing it separately the hard way; the reciprocal substitution says they are equal.",
    "check": "Beta formula $\\int_0^\\infty\\frac{x^{s-1}}{1+x^4}dx=\\frac{\\pi}{4\\sin(\\pi s/4)}$; $s=3$ gives $\\frac{\\pi}{4\\cdot\\frac{\\sqrt2}{2}}=\\frac{\\pi}{2\\sqrt2}$."
  },
  "burst-boss-der-001": {
    "spot": "A high-order derivative at $0$ $=$ the factorial of the order $\\times$ the Taylor coefficient. For the coefficients of $(\\ln(1+x))^2$ you don't need to multiply two series: its derivative is $\\frac{2\\ln(1+x)}{1+x}$, and dividing a series by $1+x$ turns the coefficients into alternating partial sums — the harmonic numbers $H_n$.",
    "why": "The Leibniz formula needs thirteen terms, each with factorials; with the coefficient formula $[x^n](\\ln(1+x))^2=(-1)^n\\frac{2H_{n-1}}{n}$, order twelve is just plugging in a number.",
    "steps": [
      "Principle: $f^{(12)}(0)=12!\\,a_{12}$, where $a_{12}$ is the coefficient of $x^{12}$. Differentiate once first: $\\frac{d}{dx}(\\ln(1+x))^2=\\frac{2\\ln(1+x)}{1+x}$.",
      "Multiply $\\ln(1+x)=\\sum\\frac{(-1)^{k+1}x^k}{k}$ by $\\frac{1}{1+x}=\\sum(-1)^mx^m$: the coefficient of $x^n$ is $(-1)^{n+1}\\left(1+\\frac12+\\cdots+\\frac1n\\right)=(-1)^{n+1}H_n$. Check at $x=\\frac12$: $\\sum(-1)^{n+1}H_n\\left(\\frac12\\right)^n=\\frac{\\ln 1.5}{1.5}$.",
      "Integrate back term by term (constant term $0$): $(\\ln(1+x))^2=\\sum_{n\\ge1}\\frac{2(-1)^{n+1}H_n}{n+1}x^{n+1}$, so $a_{12}=\\frac{2H_{11}}{12}$ (sign $(-1)^{12}=+$). Low-order check: $a_2=\\frac{2H_1}{2}=1$, i.e. $f''(0)=2$.",
      "$H_{11}=\\frac{83711}{27720}$.",
      "$f^{(12)}(0)=12!\\cdot\\frac{2H_{11}}{12}=2\\cdot 11!\\cdot H_{11}=2\\cdot 39916800\\cdot\\frac{83711}{27720}=241087680$."
    ],
    "trap": "Taking the coefficient of $(\\ln(1+x))^2$ to be the square of the coefficient of $\\ln(1+x)$, $\\frac{1}{144}$: squaring is a convolution, every pair $(k,12-k)$ contributes, and the total is a harmonic number.",
    "check": "Magnitude: $H_{11}\\approx 3.02$, so the answer is about $6\\cdot 11!\\approx 2.4\\times10^8$; even order, positive coefficient."
  },
  "burst-boss-der-002": {
    "spot": "Again a high-order derivative of $(\\ln(1+x))^2$ at $0$: use the coefficient formula $[x^n](\\ln(1+x))^2=(-1)^n\\frac{2H_{n-1}}{n}$; odd-order coefficients are negative.",
    "why": "The coefficients of the derivative $\\frac{2\\ln(1+x)}{1+x}$ are alternating harmonic numbers, and integrating back gives the general formula; the Leibniz formula would need twelve terms.",
    "steps": [
      "$\\frac{d}{dx}(\\ln(1+x))^2=\\frac{2\\ln(1+x)}{1+x}$, and $\\frac{\\ln(1+x)}{1+x}=\\sum(-1)^{n+1}H_nx^n$.",
      "Integrate back: the coefficient of $x^{11}$ is $a_{11}=\\frac{2(-1)^{11}H_{10}}{11}$, which is negative.",
      "$H_{10}=\\frac{7381}{2520}$.",
      "$f^{(11)}(0)=11!\\,a_{11}=-2\\cdot 10!\\cdot H_{10}=-2\\cdot 3628800\\cdot\\frac{7381}{2520}=-21257280$."
    ],
    "trap": "Losing the sign and answering $21257280$: the coefficients of $\\ln(1+x)$ alternate in sign, and after squaring the odd-power terms are negative (you can already see it in the cubic term $-x^3$).",
    "check": "Check the sign at low order: $(\\ln(1+x))^2=x^2-x^3+\\cdots$, so the third derivative at $0$ is $-6=3!\\cdot\\frac{-2H_2}{3}$; odd orders are indeed negative."
  },
  "burst-boss-der-003": {
    "spot": "$e^{x^2}$ and $\\cos x$ are both even with clean series: the coefficient of $x^{10}$ is the sum over the pairs of coefficients whose exponents add up to $10$.",
    "why": "The Leibniz formula would need ten derivatives of $e^{x^2}$, each with more terms; multiplying the series directly needs only six pairs.",
    "steps": [
      "$e^{x^2}=\\sum\\frac{x^{2j}}{j!}$, $\\cos x=\\sum\\frac{(-1)^mx^{2m}}{(2m)!}$; $x^{10}$ needs $j+m=5$: $a_{10}=\\sum_{m=0}^{5}\\frac{(-1)^m}{(5-m)!\\,(2m)!}$. Low-order check: $a_2=1-\\frac12=\\frac12$, $f''(0)=1$.",
      "The six terms: $\\frac{1}{120}-\\frac{1}{24\\cdot2}+\\frac{1}{6\\cdot24}-\\frac{1}{2\\cdot720}+\\frac{1}{1\\cdot40320}-\\frac{1}{3628800}$.",
      "Multiply by $10!=3628800$: $30240-75600+25200-2520+90-1=-22591$."
    ],
    "trap": "Writing the coefficient of $e^{x^2}$ as $\\frac{1}{(2j)!}$ (mixing it up with the $x^{2j}$ term of $e^x$): the $x^{2j}$ coefficient of $e^{x^2}$ is $\\frac{1}{j!}$.",
    "check": "The coefficient $\\frac{-22591}{10!}\\approx-0.0062$: the largest of the six terms, $-\\frac{1}{48}$, is mostly cancelled by $\\frac{1}{120}+\\frac{1}{144}$, leaving a small negative number."
  },
  "burst-boss-der-004": {
    "spot": "$e^x\\sin 2x$ is the imaginary part of $e^{(1+2i)x}$ — each derivative multiplies by $1+2i$, so the fourteenth derivative at $0$ is $\\mathrm{Im}(1+2i)^{14}$.",
    "why": "The Leibniz formula needs fifteen terms; the complex power needs only a few multiplications by repeated squaring.",
    "steps": [
      "$\\frac{d}{dx}e^x\\sin 2x=\\sqrt5e^x\\sin(2x+\\arctan 2)$: each derivative multiplies the amplitude by $\\sqrt5$ and adds $\\arctan 2$ to the phase — exactly multiplication by $1+2i$.",
      "$(1+2i)^2=-3+4i$ (the second derivative at $0$ is the imaginary part $4$), $(1+2i)^4=-7-24i$, $(1+2i)^8=-527+336i$.",
      "$(1+2i)^{12}=(-527+336i)(-7-24i)=11753+10296i$.",
      "$(1+2i)^{14}=(11753+10296i)(-3+4i)$, with imaginary part $=11753\\cdot4+10296\\cdot(-3)=16124$."
    ],
    "trap": "Taking the real part ($-76443$) by mismatching $\\sin$; $\\sin 2x$ corresponds to the imaginary part.",
    "check": "Its size cannot exceed the amplitude $5^7=78125$."
  },
  "burst-boss-der-007": {
    "spot": "$x^3$ times $\\sin 2x$: the sixteenth derivative at $0$ only sees the coefficient of $x^{16}$, and $x^3$ maps it to the $x^{13}$ term of $\\sin 2x$.",
    "why": "Only one term of the Leibniz formula survives (the one where $x^3$ is differentiated three times); reading the coefficient is more direct and you won't drop the $\\binom{16}{3}$.",
    "steps": [
      "$f^{(16)}(0)=16!\\,a_{16}$, and $a_{16}$ is the $x^{13}$ coefficient of $\\sin 2x$. Low-order check: $x^3\\sin 2x=2x^4+\\cdots$, so $\\frac{f(x)}{x^4}\\to 2$.",
      "$\\sin 2x=\\sum\\frac{(-1)^m(2x)^{2m+1}}{(2m+1)!}$; $x^{13}$ is $m=6$, with coefficient $\\frac{(-1)^6 2^{13}}{13!}=\\frac{8192}{13!}$.",
      "$16!\\cdot\\frac{8192}{13!}=16\\cdot15\\cdot14\\cdot8192=3360\\cdot8192=27525120$."
    ],
    "trap": "Reading the $x^{16}$ coefficient of $\\sin 2x$ (forgetting $x^3$ already takes three powers); even-power terms are $0$, so you answer $0$.",
    "check": "Only one Leibniz term remains: $\\binom{16}{3}\\cdot 3!\\cdot(\\sin 2x)^{(13)}(0)=560\\cdot6\\cdot2^{13}$, the same."
  },
  "burst-boss-der-008": {
    "spot": "$x^2$ times $\\cos 3x$: the eighteenth derivative only sees the coefficient of $x^{18}$, and $x^2$ pushes it to the $x^{16}$ term of $\\cos 3x$.",
    "why": "Reading the coefficient takes one term: $\\frac{18!}{16!}\\cdot 3^{16}$, no need to write out the Leibniz formula.",
    "steps": [
      "$f^{(18)}(0)=18!\\,a_{18}$, $a_{18}=[x^{16}]\\cos 3x$. Low-order check: $x^2\\cos 3x=x^2-\\frac92x^4+\\cdots$, $f''(0)=2$.",
      "$\\cos 3x=\\sum\\frac{(-1)^m(3x)^{2m}}{(2m)!}$; $x^{16}$ is $m=8$, with coefficient $\\frac{3^{16}}{16!}$ ($(-1)^8=+$), and $3^{16}=43046721$.",
      "$18!\\cdot\\frac{3^{16}}{16!}=18\\cdot17\\cdot43046721=306\\cdot43046721=13172296626$."
    ],
    "trap": "Forgetting the $3^{16}$ from $(3x)^{16}$ and answering $18\\cdot17=306$; or getting the sign wrong ($m=8$ is even, so positive).",
    "check": "Leibniz: $\\binom{18}{2}\\cdot2\\cdot(\\cos 3x)^{(16)}(0)=153\\cdot2\\cdot3^{16}$."
  },
  "burst-boss-der-009": {
    "spot": "$\\frac{x^2}{(1-x)^4}$: the coefficients of $\\frac{1}{(1-x)^4}$ are the binomial numbers $\\binom{n+3}{3}$, and $x^2$ just shifts the exponent by two.",
    "why": "Differentiating a rational function ten times means ten rounds of the Quotient Rule — hopeless; the negative-exponent binomial expansion gives the coefficients in one line.",
    "steps": [
      "$\\frac{1}{(1-x)^4}=\\sum_{n\\ge0}\\binom{n+3}{3}x^n$. Check at $x=\\frac12$: $\\sum\\binom{n+3}{3}2^{-n}=2^4=16$.",
      "The coefficient of $x^{10}$ $=\\frac{1}{(1-x)^4}$'s coefficient of $x^8$ $=\\binom{11}{3}=165$.",
      "$f^{(10)}(0)=10!\\cdot165=3628800\\cdot165=598752000$. Low-order check: $f''(0)=2!\\cdot\\binom{3}{3}=2$."
    ],
    "trap": "Taking $\\binom{10+3}{3}=286$ directly, forgetting that $x^2$ has shifted the exponent by two, so you need the $x^8$ coefficient.",
    "check": "Double-check $10!=1\\cdot2\\cdots10$, then multiply by $165$."
  },
  "burst-boss-der-010": {
    "spot": "$\\frac{x^3}{1+x^2}$ is a geometric series times $x^3$: $x^3-x^5+x^7-\\cdots$, odd powers only, all coefficients $\\pm1$.",
    "why": "The geometric series gives the $x^{15}$ coefficient directly, so the answer is $\\pm15!$; no Quotient Rule needed.",
    "steps": [
      "$\\frac{1}{1+x^2}=\\sum(-1)^kx^{2k}$, so $\\frac{x^3}{1+x^2}=\\sum(-1)^kx^{2k+3}$. Check at $x=\\frac12$.",
      "$x^{15}$: $2k+3=15$, $k=6$, coefficient $(-1)^6=1$. Low-order check: the coefficient of $x^3$ is $1$, $f'''(0)=6$.",
      "$f^{(15)}(0)=15!\\cdot1=1307674368000$."
    ],
    "trap": "Misreading the sign as negative: $k=6$ is even, so the $x^{15}$ term is positive ($x^3,-x^5,x^7,-x^9,x^{11},-x^{13},x^{15}$).",
    "check": "All even-order derivatives at $0$ are $0$ (odd function); only odd orders are nonzero, and $15$ is odd, so the answer is nonzero."
  },
  "burst-boss-ser-003": {
    "spot": "$\\sum H_nx^n$ at $x=\\frac12$: $H_n$ is a partial sum of $\\frac1k$, and the generating function of partial sums $=$ the original generating function divided by $1-x$.",
    "why": "After swapping the order of summation only $\\sum\\frac{x^k}{k}=-\\ln(1-x)$ remains, then divide by $1-x$; adding directly only shows the value creeping closer.",
    "steps": [
      "$\\sum_{n\\ge1}H_nx^n=\\sum_{k\\ge1}\\frac1k\\sum_{n\\ge k}x^n$, and at $x=\\frac12$, $\\sum_{n\\ge k}\\frac{1}{2^n}=\\frac{2}{2^k}$.",
      "So the sum $=2\\sum_{k\\ge1}\\frac{1}{k2^k}$, and $\\sum\\frac{x^k}{k}=-\\ln(1-x)$ equals $\\ln 2$ at $x=\\frac12$.",
      "The answer is $2\\ln 2$.",
      "Cross-check by summing the whole series directly using $H_n=\\int_0^1\\frac{1-t^n}{1-t}dt$."
    ],
    "trap": "Dropping the factor $\\frac{1}{1-x}=2$ and answering $\\ln 2$.",
    "check": "Each term $\\frac{H_n}{2^n}\\ge\\frac{1}{n2^n}$, strictly for $n\\ge2$, so the answer exceeds $\\ln 2$."
  },
  "burst-boss-ser-006": {
    "spot": "$\\frac{x^2e^{3x}}{1-x}$: $x^2$ is just a shift, and multiplying a series by $\\frac{1}{1-x}$ takes its partial sums — the $x^8$ coefficient $=e^{3x}$'s first seven coefficients added up ($x^0$ through $x^6$).",
    "why": "No convolution needed; just use the fact that dividing by $1-x$ means accumulating.",
    "steps": [
      "$x^8$ in $x^2\\cdot g(x)$ corresponds to the $x^6$ coefficient of $g$, where $g=\\frac{e^{3x}}{1-x}$.",
      "$\\frac{1}{1-x}\\sum b_kx^k=\\sum\\left(b_0+\\cdots+b_n\\right)x^n$, and for $e^{3x}$, $b_k=\\frac{3^k}{k!}$. Low-order check: the $x^1$ coefficient of $g$ is $1+3=4$ and the $x^2$ coefficient is $1+3+\\frac92=\\frac{17}{2}$.",
      "$\\sum_{k=0}^{6}\\frac{3^k}{k!}=1+3+\\frac92+\\frac92+\\frac{27}{8}+\\frac{81}{40}+\\frac{81}{80}$.",
      "Common denominator $80$: $\\frac{80+240+360+360+270+162+81}{80}=\\frac{1553}{80}$."
    ],
    "trap": "Taking only the $x^6$ coefficient $\\frac{729}{720}$ of $e^{3x}$, forgetting that $\\frac{1}{1-x}$ accumulates all earlier coefficients.",
    "check": "The partial sums approach $e^3\\approx 20.09$, and $\\frac{1553}{80}=19.41$ is a little smaller — reasonable."
  },
  "burst-boss2-der-006": {
    "spot": "The tenth derivative of $\\frac{1}{(1-x)^3}$ at $0$: the negative-exponent binomial coefficients are $\\binom{n+2}{2}$; just multiply by $10!$.",
    "why": "You can also differentiate directly: $\\frac{d^n}{dx^n}(1-x)^{-3}=\\frac{(n+2)!}{2}(1-x)^{-3-n}$ — both views give the same number.",
    "steps": [
      "$\\frac{1}{(1-x)^3}=\\sum\\binom{n+2}{2}x^n$; check at $x=\\frac12$: the sum is $2^3=8$.",
      "The coefficient of $x^{10}$ is $\\binom{12}{2}=66$.",
      "$f^{(10)}(0)=10!\\cdot66=3628800\\cdot66=239500800$."
    ],
    "trap": "Using $\\binom{10+3}{3}$ or $\\binom{12}{3}$: the coefficients of $(1-x)^{-k}$ are $\\binom{n+k-1}{k-1}$, so for $k=3$ the bottom is $2$.",
    "check": "Direct formula: $\\frac{12!}{2}$."
  },
  "burst-boss2-der-007": {
    "spot": "$\\frac{x^2}{(1-x)^5}$: the coefficients of $(1-x)^{-5}$ are $\\binom{n+4}{4}$, and the leading $x^2$ maps $x^{10}$ to $x^8$.",
    "why": "Reading the coefficient gets there in one step, far more reliable than ten rounds of the Quotient Rule.",
    "steps": [
      "$\\frac{1}{(1-x)^5}=\\sum\\binom{n+4}{4}x^n$; at $x=\\frac12$ the sum is $2^5=32$.",
      "We need the $x^8$ coefficient: $\\binom{12}{4}=495$.",
      "$f^{(10)}(0)=10!\\cdot495=1796256000$. Low-order check: $f''(0)=2!\\cdot1=2$."
    ],
    "trap": "Not accounting for the $x^2$ shift and using $\\binom{14}{4}=1001$.",
    "check": "Only the Leibniz term where $x^2$ is differentiated twice survives: $\\binom{10}{2}\\cdot2!\\cdot g^{(8)}(0)$, where $g=(1-x)^{-5}$ and $g^{(8)}(0)=8!\\binom{12}{4}=\\frac{12!}{4!}$."
  },
  "burst-boss2-der-008": {
    "spot": "$\\frac{x^4}{(1+x)^2}$: $(1+x)^{-2}=\\sum(-1)^n(n+1)x^n$; $x^4$ shifts by four, so $x^{16}$ corresponds to the $x^{12}$ coefficient $13$.",
    "why": "The coefficients of a negative square are just $\\pm(n+1)$, readable at a glance; the high-order derivative is then just times $16!$.",
    "steps": [
      "$\\frac{1}{(1+x)^2}=\\sum(-1)^n(n+1)x^n$; check at $x=\\frac12$: the sum is $\\frac{1}{1.5^2}=\\frac49$.",
      "$x^{16}$ in $x^4\\cdot g$ is the $x^{12}$ coefficient of $g$: $(-1)^{12}\\cdot13=13$.",
      "$f^{(16)}(0)=16!\\cdot13=20922789888000\\cdot13=271996268544000$."
    ],
    "trap": "Remembering the coefficient as $(-1)^n$ (that's $\\frac{1}{1+x}$) and dropping the $n+1$, answering $16!$.",
    "check": "Low-order check: $\\frac{x^4}{(1+x)^2}=x^4-2x^5+\\cdots$, so $\\frac{f}{x^4}\\to1$ and $f^{(4)}(0)=4!$, matching the formula $4!\\cdot(+1)$."
  },
  "burst-boss3-der-001": {
    "spot": "The twentieth derivative of $(\\ln(1+x))^2$: coefficient formula $[x^n](\\ln(1+x))^2=(-1)^n\\frac{2H_{n-1}}{n}$; $n=20$ is even, so positive.",
    "why": "The Leibniz formula needs twenty-one huge terms; the coefficient formula needs just one harmonic number $H_{19}$.",
    "steps": [
      "$\\frac{d}{dx}(\\ln(1+x))^2=\\frac{2\\ln(1+x)}{1+x}$, whose coefficients are the alternating harmonic numbers $2(-1)^{n+1}H_n$.",
      "Integrate back: $a_{20}=\\frac{2(-1)^{20}H_{19}}{20}=\\frac{H_{19}}{10}$.",
      "$f^{(20)}(0)=20!\\cdot\\frac{2H_{19}}{20}=2\\cdot19!\\cdot H_{19}$, with $19!=121645100408832000$.",
      "$H_{19}=\\frac{275295799}{77597520}$; multiplying gives $863130293635276800$."
    ],
    "trap": "Using $H_{20}$ instead of $H_{19}$: the coefficient is $\\frac{2H_{n-1}}{n}$ — integrating raises the exponent by one, so the harmonic index lags by one.",
    "check": "Magnitude: $H_{19}\\approx3.55$, so the answer is about $7.1\\cdot19!\\approx8.6\\times10^{17}$."
  },
  "burst-boss3-der-002": {
    "spot": "$\\frac{x^4}{(1-x)^7}$: the coefficients of $(1-x)^{-7}$ are $\\binom{n+6}{6}$; $x^4$ maps $x^{18}$ to $x^{14}$.",
    "why": "Reading the coefficient takes one binomial number $\\binom{20}{6}$, times $18!$.",
    "steps": [
      "$\\frac{1}{(1-x)^7}=\\sum\\binom{n+6}{6}x^n$; at $x=\\frac12$ the sum is $2^7=128$.",
      "The coefficient of $x^{14}$ is $\\binom{20}{6}=38760$.",
      "$18!=6402373705728000$.",
      "$f^{(18)}(0)=18!\\cdot38760=248156004834017280000$."
    ],
    "trap": "Using $\\binom{24}{6}$ (no shift) or $\\binom{20}{7}$ (writing the lower index of $(1-x)^{-7}$ as $7$).",
    "check": "Equivalent form: $\\frac{18!\\cdot20!}{6!\\cdot14!}$; magnitude about $2.5\\times10^{20}$."
  },
  "burst-boss3-der-003": {
    "spot": "$\\frac{x^5}{(1-x)^6}$: the coefficients of $(1-x)^{-6}$ are $\\binom{n+5}{5}$, and $x^5$ maps $x^{20}$ to $x^{15}$.",
    "why": "The negative-exponent binomial gives the coefficient in one line, faster than any differentiation method.",
    "steps": [
      "$\\frac{1}{(1-x)^6}=\\sum\\binom{n+5}{5}x^n$; at $x=\\frac12$ the sum is $2^6=64$.",
      "The coefficient of $x^{15}$ is $\\binom{20}{5}=15504$.",
      "$20!=2432902008176640000$.",
      "$f^{(20)}(0)=20!\\cdot15504=37719712734770626560000$."
    ],
    "trap": "Reading the $x^{20}$ coefficient $\\binom{25}{5}$, forgetting the $x^5$ shift.",
    "check": "Magnitude: $2.43\\times10^{18}\\times1.55\\times10^4\\approx3.77\\times10^{22}$."
  },
  "burst-boss3-der-004": {
    "spot": "$\\frac{x^3}{(1-x)^8}$: the coefficients of $(1-x)^{-8}$ are $\\binom{n+7}{7}$; $x^{16}$ corresponds to $x^{13}$.",
    "why": "The negative-exponent binomial coefficients are ready-made, so the sixteenth derivative is just $16!$ times one binomial number.",
    "steps": [
      "$\\frac{1}{(1-x)^8}=\\sum\\binom{n+7}{7}x^n$; at $x=\\frac12$ the sum is $2^8=256$.",
      "The coefficient of $x^{13}$ is $\\binom{20}{7}=77520$.",
      "$16!=20922789888000$; multiplying, $20922789888000\\cdot77520=1621934672117760000$."
    ],
    "trap": "Remembering the coefficients of $(1-x)^{-8}$ as $\\binom{n+8}{8}$ and getting $\\binom{21}{8}$; the coefficients of $(1-x)^{-k}$ are $\\binom{n+k-1}{k-1}$.",
    "check": "Low-order check: the coefficient of $x^3$ is $1$, so $f'''(0)=3!=6$."
  },
  "burst-boss3-der-005": {
    "spot": "The thirty-first derivative of $x^7e^{-x^2}$: $x^7$ maps $x^{31}$ to the $x^{24}$ term of $e^{-x^2}$, namely $\\frac{(-x^2)^{12}}{12!}$.",
    "why": "Only one term of the series survives, so the answer is $\\frac{31!}{12!}$; Leibniz or the Chain Rule thirty-one times is completely infeasible.",
    "steps": [
      "$e^{-x^2}=\\sum\\frac{(-1)^mx^{2m}}{m!}$, so $x^7e^{-x^2}=\\sum\\frac{(-1)^mx^{2m+7}}{m!}$. Low-order check: $\\frac{f}{x^7}\\to1$.",
      "$2m+7=31$, $m=12$: coefficient $\\frac{(-1)^{12}}{12!}=\\frac{1}{12!}$.",
      "$f^{(31)}(0)=\\frac{31!}{12!}=13\\cdot14\\cdots31$."
    ],
    "trap": "Taking the coefficient to be $\\frac{1}{24!}$ (reading $e^{-x^2}$ as $e^{-x}$ and taking its $x^{24}$ term); $x^{2m}$ goes with $\\frac{1}{m!}$.",
    "check": "Sign: $m=12$ is even, so the answer is positive; magnitude $\\frac{8.2\\times10^{33}}{4.8\\times10^8}\\approx1.7\\times10^{25}$."
  },
  "burst-boss3-der-006": {
    "spot": "$x^6\\cosh(x^2)$: $\\cosh u=\\sum\\frac{u^{2m}}{(2m)!}$, and $u=x^2$ gives $x^{4m}$; $x^6$ maps $x^{30}$ to $x^{24}$, so $m=6$.",
    "why": "Only one term of the series contributes, with coefficient $\\frac{1}{12!}$; differentiating thirty times directly is impossible.",
    "steps": [
      "$\\cosh(x^2)=\\sum\\frac{x^{4m}}{(2m)!}$ (all positive). Low-order check: $\\frac{\\cosh(x^2)-1}{x^4}\\to\\frac12$.",
      "$4m=30-6=24$, $m=6$: coefficient $\\frac{1}{12!}$.",
      "$f^{(30)}(0)=\\frac{30!}{12!}=13\\cdot14\\cdots30=553761949463615692800000$."
    ],
    "trap": "Treating $\\cosh$ like $\\cos$ and adding alternating signs: the coefficients of $\\cosh$ are all positive (here $m=6$ happens to be even so the sign coincides, but with odd $m$ you'd be wrong).",
    "check": "Magnitude: $\\frac{30!}{12!}\\approx\\frac{2.65\\times10^{32}}{4.79\\times10^8}\\approx5.5\\times10^{23}$."
  },
  "burst-boss3-der-007": {
    "spot": "$x^5\\sin(x^2)$: $\\sin(x^2)=\\sum\\frac{(-1)^mx^{4m+2}}{(2m+1)!}$; $x^5$ maps $x^{27}$ to $x^{22}$, and $4m+2=22$ gives $m=5$.",
    "why": "Only one term survives; $m=5$ is odd, so the answer is negative.",
    "steps": [
      "$\\sin u=\\sum\\frac{(-1)^mu^{2m+1}}{(2m+1)!}$, substitute $u=x^2$. Low-order check: $\\frac{x^5\\sin(x^2)}{x^7}\\to1$.",
      "$4m+2=22$, $m=5$: coefficient $\\frac{(-1)^5}{11!}=-\\frac{1}{11!}$.",
      "$f^{(27)}(0)=-\\frac{27!}{11!}=-12\\cdot13\\cdots27=-272789137666805760000$."
    ],
    "trap": "Forgetting the alternating sign and answering positive, or writing the denominator as $22!$ (the denominator for $\\sin$ is $(2m+1)!=11!$, not the power of $x$).",
    "check": "Magnitude: $\\frac{27!}{11!}\\approx\\frac{1.09\\times10^{28}}{3.99\\times10^7}\\approx2.73\\times10^{20}$."
  },
  "burst-boss3-der-008": {
    "spot": "$x^5\\cos(x^2)$: $\\cos(x^2)=\\sum\\frac{(-1)^mx^{4m}}{(2m)!}$; $x^{29}$ corresponds to $x^{24}$, $m=6$.",
    "why": "Read the coefficient from the series — just one term; $m=6$ is even, so positive.",
    "steps": [
      "$\\cos u=\\sum\\frac{(-1)^mu^{2m}}{(2m)!}$; substituting $u=x^2$ gives $x^{4m}$. Low-order check: $\\frac{1-\\cos(x^2)}{x^4}\\to\\frac12$.",
      "$4m=29-5=24$, $m=6$: coefficient $\\frac{(-1)^6}{12!}=\\frac{1}{12!}$.",
      "$f^{(29)}(0)=\\frac{29!}{12!}=13\\cdot14\\cdots29=18458731648787189760000$."
    ],
    "trap": "Writing the denominator as $24!$ (the power of $x$) instead of $(2m)!=12!$; the factorial in $\\cos$ follows the power of $u=x^2$.",
    "check": "Magnitude: $\\frac{29!}{12!}\\approx\\frac{8.84\\times10^{30}}{4.79\\times10^8}\\approx1.85\\times10^{22}$."
  },
  "burst-boss3-lim-003": {
    "spot": "$x^n$ tends to $0$ quickly on $[0,1)$, so the integral only lives in a strip of width about $\\frac1n$ next to $x=1$; there $\\frac{1}{1+x}\\approx\\frac12$, so $\\int\\approx\\frac{1}{2n}$, and multiplying by $n$ gives $\\frac12$.",
    "why": "The cleanest way to turn the boundary-layer intuition into a proof is one integration by parts: the main term $\\frac{1}{2(n+1)}$ pops out directly and the remainder is an order smaller.",
    "steps": [
      "By parts with $u=\\frac{1}{1+x}$, $dv=x^n\\,dx$: $\\int_0^1\\frac{x^n}{1+x}dx=\\frac{1}{2(n+1)}+\\frac{1}{n+1}\\int_0^1\\frac{x^{n+1}}{(1+x)^2}dx$.",
      "Remainder: $\\frac{1}{(1+x)^2}\\le1$, so $\\int_0^1\\frac{x^{n+1}}{(1+x)^2}dx\\le\\frac{1}{n+2}$; after multiplying by $\\frac{n}{n+1}$ it tends to $0$.",
      "Main term: $n\\cdot\\frac{1}{2(n+1)}\\to\\frac12$."
    ],
    "trap": "Taking the pointwise limit first: for $x<1$, $x^n\\to0$, so the integral $\\to0$ and the answer is $0$ — but there's a factor $n$ in front, and a $0\\cdot\\infty$ form requires comparing rates.",
    "check": "$n=100$: $n\\int_0^1\\frac{x^n}{1+x}dx\\approx0.4975$, approaching $\\frac12$ from below (error about $\\frac{1}{4n}$)."
  },
  "burst-boss3-param-006": {
    "spot": "Differentiate $\\frac{x^a-1}{\\ln x}$ in $a$: the $\\ln x$ is cancelled exactly by $\\frac{\\partial}{\\partial a}x^a=x^a\\ln x$ — Feynman's trick. Compute the integral itself first ($\\ln(a+1)$), then differentiate three times.",
    "why": "The integrand has no elementary antiderivative in $x$, but one derivative in $a$ turns it into $\\int_0^1x^a\\,dx$; rather than differentiating three times under the integral sign, get $\\ln(a+1)$ first and then differentiate.",
    "steps": [
      "$I(a)=\\int_0^1\\frac{x^a-1}{\\ln x}dx$, $I'(a)=\\int_0^1x^a\\,dx=\\frac{1}{a+1}$.",
      "$I(0)=0$, so $I(a)=\\ln(a+1)$.",
      "$Q(a)=I'''(a)$: $I'=\\frac{1}{a+1}$, $I''=-\\frac{1}{(a+1)^2}$, $I'''=\\frac{2}{(a+1)^3}$.",
      "So $Q(a)=\\frac{2}{(a+1)^3}$."
    ],
    "trap": "Getting the sign wrong on the third derivative and answering $-\\frac{2}{(a+1)^3}$: each derivative of $\\frac{1}{a+1}$ adds a minus sign, and two of them make it positive again.",
    "check": "Differentiating three times under the integral sign gives the same: $\\int_0^1x^a(\\ln x)^2dx=\\frac{2}{(a+1)^3}$."
  },
  "burst-der-004": {
    "spot": "$x^3e^x$: the coefficients of $e^x$ are $\\frac{1}{k!}$, and $x^3$ maps $x^{10}$ to $x^7$ — the answer is $\\frac{10!}{7!}$.",
    "why": "Only the Leibniz term where $x^3$ is differentiated three times survives; reading the coefficient is faster.",
    "steps": [
      "$x^3e^x=\\sum\\frac{x^{k+3}}{k!}$. Low-order check: $\\frac{x^3e^x}{x^3}\\to1$.",
      "$x^{10}$ corresponds to $k=7$, coefficient $\\frac{1}{7!}$.",
      "$f^{(10)}(0)=\\frac{10!}{7!}=10\\cdot9\\cdot8=720$."
    ],
    "trap": "Answering $10!$ or $\\frac{1}{7!}$: the first forgets the $x^3$ shift, the second forgets to multiply by $10!$ to turn the coefficient back into a derivative.",
    "check": "Leibniz: $\\binom{10}{3}\\cdot3!\\cdot(e^x)^{(7)}(0)=120\\cdot6=720$."
  },
  "burst-der-006": {
    "spot": "The derivative of $\\ln(1+x)$ is $\\frac{1}{1+x}$, and after that each derivative adds a minus sign and a factorial factor: $\\frac{d^n}{dx^n}\\ln(1+x)=\\frac{(-1)^{n-1}(n-1)!}{(1+x)^n}$.",
    "why": "The pattern is visible after two or three derivatives; just plug in $n=8$.",
    "steps": [
      "$f'=\\frac{1}{1+x}$, $f''=-\\frac{1}{(1+x)^2}$, which are $1$ and $-1$ at $0$.",
      "General formula: $f^{(n)}(0)=(-1)^{n-1}(n-1)!$; the coefficient view agrees: the $x^n$ coefficient of $\\ln(1+x)$ is $\\frac{(-1)^{n-1}}{n}$, times $n!$.",
      "$n=8$: $(-1)^7\\cdot7!=-5040$."
    ],
    "trap": "Answering $-8!$ or $+7!$: the factorial is $(n-1)!$, the sign is $(-1)^{n-1}$, and even orders are negative.",
    "check": "Even-order derivatives at $0$ are all negative: $f''(0)=-1$, $f^{(8)}(0)<0$."
  },
  "burst-der-007": {
    "spot": "$\\frac{1}{1-x}=1+x+x^2+\\cdots$ has all coefficients $1$: the $n$th derivative at $0$ is just $n!$.",
    "why": "Reading coefficients from the geometric series is fastest; differentiating directly just gives $\\frac{n!}{(1-x)^{n+1}}$.",
    "steps": [
      "$\\frac{d}{dx}\\frac{1}{1-x}=\\frac{1}{(1-x)^2}$, $\\frac{d^2}{dx^2}=\\frac{2}{(1-x)^3}$: each step multiplies by the next integer.",
      "General formula $\\frac{n!}{(1-x)^{n+1}}$, which is $n!$ at $0$.",
      "$n=12$: $12!=479001600$."
    ],
    "trap": "Confusing it with $\\frac{1}{1+x}$ and adding alternating signs; all derivatives of $\\frac{1}{1-x}$ are positive.",
    "check": "The coefficient is $1$: $\\frac{f^{(12)}(0)}{12!}=1$."
  },
  "burst-der-009": {
    "spot": "$x^4e^{-x}$: the coefficients of $e^{-x}$ are $\\frac{(-1)^k}{k!}$, and $x^4$ maps $x^{14}$ to $k=10$.",
    "why": "Reading the coefficient takes one term: $\\frac{14!}{10!}$ with sign $(-1)^{10}$.",
    "steps": [
      "$x^4e^{-x}=\\sum\\frac{(-1)^kx^{k+4}}{k!}$. Low-order check: $\\frac{f}{x^4}\\to1$.",
      "$k=14-4=10$, coefficient $\\frac{(-1)^{10}}{10!}=\\frac{1}{10!}$.",
      "$f^{(14)}(0)=\\frac{14!}{10!}=14\\cdot13\\cdot12\\cdot11=24024$."
    ],
    "trap": "Seeing $e^{-x}$ and putting a minus sign; $k=10$ is even, so $(-1)^{10}=+1$.",
    "check": "Leibniz: $\\binom{14}{4}\\cdot4!\\cdot(e^{-x})^{(10)}(0)=1001\\cdot24\\cdot1$."
  },
  "dx-calc-002": {
    "spot": "Both the base $\\ln x$ and the exponent $x$ vary: an $f(x)^{g(x)}$ form, so take logs first, $\\ln y=x\\ln(\\ln x)$, then differentiate.",
    "why": "Neither the power rule (fixed exponent) nor the exponential rule (fixed base) applies on its own; taking logs turns the power into a product, and the Product Rule handles it in one go.",
    "steps": [
      "$\\ln y=x\\ln(\\ln x)$ (for $x>1$, $\\ln x>0$).",
      "Differentiate both sides in $x$: $\\frac{y'}{y}=\\ln(\\ln x)+x\\cdot\\frac{1}{\\ln x}\\cdot\\frac1x=\\ln(\\ln x)+\\frac{1}{\\ln x}$.",
      "Multiply back by $y$: $y'=(\\ln x)^x\\left(\\ln(\\ln x)+\\frac{1}{\\ln x}\\right)$."
    ],
    "trap": "Treating it with the power rule, $x(\\ln x)^{x-1}\\cdot\\frac1x$, which misses the $\\ln(\\ln x)$ term coming from the varying exponent.",
    "check": "At $x=e$: $\\ln x=1$, $y=1$, and the derivative $=\\ln 1+1=1$."
  },
  "dx-calc-004": {
    "spot": "The curve $x^2+xy+y^2=3$ is implicit and we want the second derivative: use implicit differentiation twice, treating $y$ as a function of $x$ each time, then plug in $(1,1)$ and the known $y'$.",
    "why": "Solving for $y$ brings in a square root, and differentiating that twice is messy; the implicit expressions are short, and once $y'=-1$ is known at the point, the second differentiation is just plugging in numbers.",
    "steps": [
      "Differentiate once: $2x+y+xy'+2yy'=0$; at $(1,1)$: $3+3y'=0$, so $y'=-1$.",
      "Differentiate again: $2+y'+y'+xy''+2(y')^2+2yy''=0$.",
      "Plug in $(1,1)$ and $y'=-1$: $2-2+2+3y''=0$, so $y''=-\\frac23$.",
      "Compare with the explicit upper branch $y=\\frac{-x+\\sqrt{12-3x^2}}{2}$ (through $(1,1)$): its second derivative at $x=1$ is also $-\\frac23$."
    ],
    "trap": "Differentiating $2yy'$ as just $2yy''$ the second time, dropping $2(y')^2$, and getting $y''=-\\frac43$. $yy'$ is a product, so use the Product Rule.",
    "check": "$y''<0$ means the curve bends downward at $(1,1)$: the upper branch of an ellipse is concave down."
  },
  "dx-calc-005": {
    "spot": "$\\frac{1}{1-2x}$ is the geometric series $\\sum(2x)^n$: the coefficient of $x^5$ is $2^5$, and the fifth derivative $=5!\\cdot2^5$.",
    "why": "Reading the coefficient is one line; differentiating five times directly just adds a factor $2$ and the next integer each time.",
    "steps": [
      "$\\frac{1}{1-2x}=\\sum(2x)^n$, with $x^5$ coefficient $2^5=32$. Check at $x=0.2$.",
      "Differentiating directly agrees: $f^{(n)}(x)=\\frac{n!\\,2^n}{(1-2x)^{n+1}}$, e.g. $f''(0)=2!\\cdot4=8$.",
      "$f^{(5)}(0)=120\\cdot32=3840$."
    ],
    "trap": "Forgetting that the inner derivative $2$ multiplies in at every step and answering just $5!=120$; or multiplying it in only once and answering $240$.",
    "check": "Ratio $\\frac{f^{(5)}(0)}{f^{(4)}(0)}=5\\cdot2=10$: $f^{(4)}(0)=24\\cdot16=384$."
  },
  "hc-spec-005": {
    "spot": "$\\frac{x^5}{e^x-1}$ from $0$ to $\\infty$: expand $e^x-1$ in the denominator as $\\sum e^{-nx}$; each term is a Gamma integral — the answer is $\\Gamma(6)\\zeta(6)$.",
    "why": "There is no elementary antiderivative; after the geometric expansion, integrate term by term, and $5!$ and $\\zeta(6)=\\frac{\\pi^6}{945}$ are known values.",
    "steps": [
      "$\\frac{1}{e^x-1}=\\frac{e^{-x}}{1-e^{-x}}=\\sum_{n\\ge1}e^{-nx}$ ($x>0$).",
      "Term by term: $\\int_0^\\infty x^5e^{-nx}dx=\\frac{5!}{n^6}=\\frac{120}{n^6}$.",
      "The sum is $120\\,\\zeta(6)$, and $\\zeta(6)=\\sum\\frac{1}{n^6}=\\frac{\\pi^6}{945}$.",
      "$120\\cdot\\frac{\\pi^6}{945}=\\frac{8\\pi^6}{63}$."
    ],
    "trap": "Taking $\\Gamma(6)$ as $6!=720$ (it should be $5!=120$), making the answer six times too big.",
    "check": "$\\zeta(6)$ is very close to $1$, so the answer is just a bit more than $5!=120$: $\\frac{8\\pi^6}{63}\\approx 122.08$."
  },
  "int-068": {
    "spot": "$\\frac{\\cos ax-\\cos bx}{x}$ from $0$ to $\\infty$: two identical functions differing only by a scaling — the Frullani type, with answer $\\ln\\frac{b}{a}$.",
    "why": "Each term diverges on its own (like $\\frac{1}{x}$ near $0$), so you can't split them; after substituting $u=ax$ and $u=bx$ the two integrals differ only on a small piece $[a\\varepsilon,b\\varepsilon]$, and the whole answer lives there.",
    "steps": [
      "Cut off both ends: $\\int_\\varepsilon^R\\frac{\\cos 2x}{x}dx=\\int_{2\\varepsilon}^{2R}\\frac{\\cos u}{u}du$ and $\\int_\\varepsilon^R\\frac{\\cos 5x}{x}dx=\\int_{5\\varepsilon}^{5R}\\frac{\\cos u}{u}du$ ($\\frac{dx}{x}$ is scale-invariant). The difference leaves two small pieces: $\\int_{2\\varepsilon}^{5\\varepsilon}\\frac{\\cos u}{u}du-\\int_{2R}^{5R}\\frac{\\cos u}{u}du$.",
      "$R\\to\\infty$: by integration by parts, $\\int_{2R}^{5R}\\frac{\\cos u}{u}du$ is $O\\left(\\frac{1}{R}\\right)$ and tends to $0$.",
      "$\\varepsilon\\to 0$: on $[2\\varepsilon,5\\varepsilon]$, $\\cos u\\approx 1$, so the integral $\\approx\\int_{2\\varepsilon}^{5\\varepsilon}\\frac{du}{u}=\\ln\\frac{5}{2}$.",
      "So $\\int_0^\\infty\\frac{\\cos 2x-\\cos 5x}{x}dx=\\ln\\frac{5}{2}$; at $\\varepsilon=10^{-4}$ that small piece already differs from $\\ln\\frac{5}{2}$ by less than $10^{-6}$."
    ],
    "trap": "Getting it backwards as $\\ln\\frac{a}{b}=\\ln\\frac{2}{5}<0$. Check the sign: for small $x$, $\\cos 2x>\\cos 5x$, so the integrand is positive on the part that matters most, and the answer should be positive.",
    "check": "The integral up to $10$ plus the tail correction gives exactly $\\ln\\frac{5}{2}\\approx 0.916$."
  },
  "int-070": {
    "spot": "$\\frac{\\cos 3x-\\cos 9x}{x}$: the same $\\cos$ scaled two ways, subtracted and divided by $x$ — the Frullani type, answer $\\ln\\frac{9}{3}=\\ln 3$.",
    "why": "Each term behaves like $\\frac{1}{x}$ near $0$ and diverges, so you can't split them; after substitution only the small piece $[3\\varepsilon,9\\varepsilon]$ contributes.",
    "steps": [
      "$\\frac{dx}{x}$ is invariant under scaling: $\\int_\\varepsilon^R\\frac{\\cos 3x-\\cos 9x}{x}dx=\\int_{3\\varepsilon}^{9\\varepsilon}\\frac{\\cos u}{u}du-\\int_{3R}^{9R}\\frac{\\cos u}{u}du$.",
      "As $R\\to\\infty$ the tail piece is $O\\left(\\frac{1}{R}\\right)$ and vanishes.",
      "As $\\varepsilon\\to 0$, $\\cos u\\to 1$: $\\int_{3\\varepsilon}^{9\\varepsilon}\\frac{du}{u}=\\ln\\frac{9}{3}=\\ln 3$.",
      "The answer is $\\ln 3$; at $\\varepsilon=10^{-4}$ the small piece already differs from $\\ln 3$ by less than $10^{-6}$."
    ],
    "trap": "Thinking $\\ln\\frac{9}{3}$ should be written as $\\ln 9-\\ln 3$ and computing $\\int\\frac{\\cos 9x}{x}$ and $\\int\\frac{\\cos 3x}{x}$ separately: each of those diverges; only the difference is finite.",
    "check": "Only the frequency ratio matters: $\\cos 2x-\\cos 6x$ also has ratio $3$, and the answer is again $\\ln 3$."
  },
  "lx-hard-006": {
    "spot": "The numerator is $\\arcsin x$ minus $\\tan x$; both have linear term $x$, which cancels. The denominator is $x^3$, so expand to the cubic term and compare coefficients.",
    "why": "L'Hôpital's Rule would need three derivatives, and the higher derivatives of $\\arcsin$ and $\\tan$ are long; writing one line of each standard expansion shows $\\frac16-\\frac13$.",
    "steps": [
      "$\\arcsin x=x+\\frac{x^3}{6}+\\cdots$.",
      "$\\tan x=x+\\frac{x^3}{3}+\\cdots$.",
      "Subtract: $\\arcsin x-\\tan x=\\left(\\frac16-\\frac13\\right)x^3+\\cdots=-\\frac{x^3}{6}+\\cdots$; dividing by $x^3$ gives $-\\frac16$."
    ],
    "trap": "Remembering the cubic coefficient of $\\arcsin x$ as $-\\frac16$ (mixing it up with $\\sin x$) and getting $-\\frac12$. $\\arcsin$ grows faster than $x$, so its coefficient is positive.",
    "check": "Plug in $x=0.01$: the ratio is about $-0.16668$, very close to $-\\frac16$."
  },
  "lx-hard-007": {
    "spot": "$\\sqrt[n]{5}-\\sqrt[n+1]{5}=5^{1/n}-5^{1/(n+1)}$: the difference of one function $5^t$ at two very close points $\\frac1n$, $\\frac{1}{n+1}$ — Mean Value Theorem, difference $\\approx$ derivative $\\times$ gap.",
    "why": "The gap $\\frac1n-\\frac{1}{n+1}=\\frac{1}{n(n+1)}$ matches $n^2$ exactly, and the derivative of $5^t$ as $t\\to0$ is $\\ln5$; easier than expanding each and subtracting.",
    "steps": [
      "Gap: $\\frac1n-\\frac{1}{n+1}=\\frac{1}{n(n+1)}$.",
      "Mean Value Theorem: $5^{1/n}-5^{1/(n+1)}=5^{\\xi}\\ln5\\cdot\\frac{1}{n(n+1)}$ with $\\xi$ between $\\frac{1}{n+1}$ and $\\frac1n$, so $5^\\xi\\to1$.",
      "Multiply by $n^2$: $\\frac{n^2}{n(n+1)}\\cdot5^\\xi\\ln5\\to\\ln5$."
    ],
    "trap": "Thinking both roots tend to $1$, so the difference is $0$ and the limit is $0$ — the $n^2$ in front magnifies that tiny difference, so you need its rate, $\\frac{\\ln5}{n^2}$.",
    "check": "$n=1000$: $n^2(5^{1/n}-5^{1/(n+1)})\\approx1.6107$, a little above $\\ln5\\approx1.6094$."
  },
  "putnam-009": {
    "spot": "The denominator has a hard-to-integrate $1+x^3$, but next to it is $1+x^2$ and the range is $0$ to $\\infty$: substitute $x\\to\\frac{1}{x}$; the $1+x^2$ part is unchanged and $\\frac{1}{1+x^3}$ becomes $\\frac{x^3}{1+x^3}$.",
    "why": "Partial fractions would have to split $1+x^3$ and $1+x^2$ — long. After the reciprocal substitution, adding the two integrals gives $\\frac{1+x^3}{1+x^3}=1$, and $1+x^3$ disappears entirely — any exponent would work the same.",
    "steps": [
      "Substitute $x=\\frac{1}{s}$, $dx=-\\frac{ds}{s^2}$: $\\frac{1}{(1+\\frac{1}{s^2})(1+\\frac{1}{s^3})}\\cdot\\frac{1}{s^2}=\\frac{s^3}{(1+s^2)(1+s^3)}$, so $I=\\int_0^\\infty\\frac{x^3}{(1+x^2)(1+x^3)}dx$.",
      "Add the two forms: $2I=\\int_0^\\infty\\frac{1+x^3}{(1+x^2)(1+x^3)}dx=\\int_0^\\infty\\frac{dx}{1+x^2}$.",
      "$\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$, so $I=\\frac{\\pi}{4}$."
    ],
    "trap": "Dropping the $\\frac{1}{s^2}$ from $dx=-\\frac{ds}{s^2}$ in the substitution; then the result doesn't match the original form and the symmetry is invisible. That factor is exactly what turns the denominator $1+\\frac{1}{s^2}$ back into $1+s^2$.",
    "check": "The same trick works for $\\frac{1}{(1+x^2)(1+x^{5})}$, again giving $\\frac{\\pi}{4}$ — independent of the exponent."
  },
  "world-080": {
    "spot": "The denominator $1+x^2+x^4$ is a palindromic polynomial and the range is $0$ to $\\infty$: substituting $x\\to\\frac{1}{x}$ gives $\\frac{x^2}{1+x^2+x^4}$; add the two and divide by $x^2$ to get the $u=x-\\frac{1}{x}$ form.",
    "why": "You could factor it as $(x^2+x+1)(x^2-x+1)$ and use partial fractions, but that means completing the square twice; reciprocal symmetry goes straight to $\\int\\frac{du}{u^2+3}$.",
    "steps": [
      "Substitute $x=\\frac{1}{s}$: $I=\\int_0^\\infty\\frac{dx}{1+x^2+x^4}=\\int_0^\\infty\\frac{s^2}{1+s^2+s^4}ds$.",
      "Add and divide by $x^2$: $2I=\\int_0^\\infty\\frac{1+x^2}{1+x^2+x^4}dx=\\int_0^\\infty\\frac{1+\\frac{1}{x^2}}{\\left(x-\\frac{1}{x}\\right)^2+3}dx$.",
      "$u=x-\\frac{1}{x}$ runs from $-\\infty$ to $\\infty$: $2I=\\int_{-\\infty}^\\infty\\frac{du}{u^2+3}=\\frac{\\pi}{\\sqrt3}$.",
      "So $I=\\frac{\\pi}{2\\sqrt3}$."
    ],
    "trap": "$\\left(x-\\frac{1}{x}\\right)^2=x^2-2+\\frac{1}{x^2}$; when completing the square it's easy to write the constant as $+1$ instead of $+3$ and get $\\frac{\\pi}{2}$.",
    "check": "It is smaller than $\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$ (the denominator has an extra $x^4$): $\\frac{\\pi}{2\\sqrt3}\\approx 0.907<1.571$."
  },
  "exam-int-030": {
    "spot": "$(1-x)^5$ is the fifth power of a linear expression: substitute $u=1-x$; the interval $[0,1]$ flips but is still $[0,1]$, giving $\\int_0^1u^5du$.",
    "why": "Expanding into a six-term polynomial works too, but the substitution makes it a power integral in one step.",
    "steps": [
      "$u=1-x$, $du=-dx$; $x:0\\to1$ corresponds to $u:1\\to0$, and the minus sign flips the limits back: $\\int_0^1u^5du$.",
      "$\\int_0^1u^5du=\\frac{u^6}{6}\\Big|_0^1=\\frac16$.",
      "The answer is $\\frac16$."
    ],
    "trap": "Writing the antiderivative as $\\frac{(1-x)^6}{6}$, missing the inner minus sign; plugging in gives $0-\\frac16=-\\frac16$. The correct one is $-\\frac{(1-x)^6}{6}$.",
    "check": "The integrand decreases from $1$ to $0$ on $[0,1]$ and is nonnegative, so the integral is between $0$ and $1$, and less than $\\frac12$ (the curve is concave up and lies below the line $1-x$)."
  },
  "lec-05-m5": {
    "spot": "One step of Newton's method: $x_{n+1}=x_n-\\frac{f(x_n)}{f'(x_n)}$ with $f(x)=x^2-2$, $f'(x)=2x$, and $x_1=1$.",
    "why": "Where the tangent line meets the $x$-axis is the next approximation; you only need $f(1)$ and $f'(1)$.",
    "steps": [
      "$f(1)=1-2=-1$.",
      "$f'(x)=2x$, $f'(1)=2$.",
      "$x_2=1-\\frac{-1}{2}=\\frac32$."
    ],
    "trap": "Botching the minus-of-a-negative and answering $1-\\frac12=\\frac12$; $f(1)$ is negative, and subtracting a negative moves you right.",
    "check": "$\\sqrt2\\approx1.414$, and $x_2=1.5$ is closer to it than $x_1=1$; also $f(1.5)=0.25>0$, so the next step will pull back from the right."
  },
  "lec-10-m2": {
    "spot": "Converting polar $(r,\\theta)$ to rectangular: $x=r\\cos\\theta$, $y=r\\sin\\theta$. $\\theta=\\frac{\\pi}{3}$ is a special angle with $\\cos=\\frac12$, $\\sin=\\frac{\\sqrt3}{2}$.",
    "why": "Plugging into the conversion formulas gives the answer directly; no picture or equation solving needed.",
    "steps": [
      "$x=2\\cos\\frac{\\pi}{3}=2\\cdot\\frac12=1$.",
      "$y=2\\sin\\frac{\\pi}{3}=2\\cdot\\frac{\\sqrt3}{2}=\\sqrt3$.",
      "So the rectangular coordinates are $(1,\\sqrt3)$."
    ],
    "trap": "Swapping $\\cos$ and $\\sin$ and writing $(\\sqrt3,1)$ — that's the point for $\\theta=\\frac{\\pi}{6}$.",
    "check": "Convert back: $\\sqrt{1^2+(\\sqrt3)^2}=2$ and $\\arctan\\frac{\\sqrt3}{1}=\\frac{\\pi}{3}$, matching the original $(r,\\theta)$."
  },
  "refine-derivatives-002": {
    "spot": "$\\sqrt{4x+1}$ is a square root of a linear expression: Chain Rule, outer $\\frac{1}{2\\sqrt u}$ times inner $4$.",
    "why": "One step for the outer layer, one for the inner, then plug in $x=2$ ($4x+1=9$, a perfect square).",
    "steps": [
      "$f'(x)=\\frac{1}{2\\sqrt{4x+1}}\\cdot4=\\frac{2}{\\sqrt{4x+1}}$.",
      "$x=2$: $\\sqrt{9}=3$.",
      "$f'(2)=\\frac23$."
    ],
    "trap": "Dropping the inner $4$ and answering $\\frac{1}{2\\cdot3}=\\frac16$.",
    "check": "Difference quotient: $\\frac{\\sqrt{9.04}-3}{0.01}\\approx0.666$, consistent with $\\frac23$."
  },
  "refine-derivatives-003": {
    "spot": "The curve is given by a parameter $t$: $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$; compute each $t$-derivative as a number at $t=1$.",
    "why": "No need to eliminate $t$ and write $y(x)$ (that means solving a quadratic); parametric differentiation just divides.",
    "steps": [
      "$\\frac{dx}{dt}=2t+3$, which is $5$ at $t=1$.",
      "$\\frac{dy}{dt}=3t^2$, which is $3$ at $t=1$.",
      "$\\frac{dy}{dx}=\\frac35$."
    ],
    "trap": "Flipping numerator and denominator and answering $\\frac53$: we want $y$ with respect to $x$, so the rate of $y$ goes on top.",
    "check": "Moving $t$ from $1$ to $1.001$: $\\frac{\\Delta y}{\\Delta x}\\approx0.6$."
  },
  "refine-derivatives-004": {
    "spot": "$\\frac{x}{x^2+1}$ is a quotient: Quotient Rule $\\frac{u'v-uv'}{v^2}$; simplify the numerator to $1-x^2$, then plug in $x=2$.",
    "why": "The Quotient Rule does it in one go; simplifying the numerator first makes plugging in less error-prone.",
    "steps": [
      "$u=x$, $v=x^2+1$: $f'=\\frac{(x^2+1)-x\\cdot2x}{(x^2+1)^2}=\\frac{1-x^2}{(x^2+1)^2}$.",
      "$x=2$: numerator $1-4=-3$, denominator $5^2=25$.",
      "$f'(2)=-\\frac{3}{25}$."
    ],
    "trap": "Writing the numerator backwards as $uv'-u'v$ and getting $+\\frac{3}{25}$.",
    "check": "$f$ reaches its maximum $\\frac12$ at $x=1$ and decreases afterward, so $f'(2)$ should be negative."
  },
  "refine-series-053": {
    "spot": "$H_5$ is a sum of five fractions: the least common multiple of the denominators $1$ through $5$ is $60$, so one common denominator does it.",
    "why": "With the LCM as common denominator all numerators are integers, so the sum doesn't get messier as you go.",
    "steps": [
      "$H_5=1+\\frac12+\\frac13+\\frac14+\\frac15$; the LCM of the denominators is $60$.",
      "Common denominator: $\\frac{60+30+20+15+12}{60}$.",
      "Numerator $137$, so $H_5=\\frac{137}{60}\\approx2.283$."
    ],
    "trap": "Using $5!=120$ as the common denominator also works, but you must reduce at the end; adding the denominators directly ($\\frac{5}{15}$) is completely wrong.",
    "check": "$H_n\\approx\\ln n+0.5772$: $\\ln5+0.577\\approx2.187$, and adding the correction $\\frac{1}{2n}=0.1$ gives about $2.287$ — very close."
  },
  "cl-ser-008": {
    "spot": "A $\\sum nx^n$ form (with $x=\\frac25$): differentiate the geometric series and multiply by $x$, giving the formula $\\frac{x}{(1-x)^2}$.",
    "why": "Differentiating $\\sum x^n=\\frac{1}{1-x}$ in $x$ brings down the $n$; faster than shift-and-subtract.",
    "steps": [
      "$\\sum_{n\\ge0}x^n=\\frac{1}{1-x}$; differentiating gives $\\sum nx^{n-1}=\\frac{1}{(1-x)^2}$, and multiplying by $x$: $\\sum nx^n=\\frac{x}{(1-x)^2}$.",
      "Plug in $x=\\frac25$: $\\frac{2/5}{(3/5)^2}=\\frac25\\cdot\\frac{25}{9}=\\frac{10}{9}$.",
      "The answer is $\\frac{10}{9}$."
    ],
    "trap": "Remembering the formula as $\\frac{1}{(1-x)^2}$ (missing the factor $x$) and getting $\\frac{25}{9}$.",
    "check": "The first two terms $\\frac25+2\\cdot\\frac{4}{25}=0.72$, and more positive terms follow, so the answer must exceed $0.72$; $\\frac{10}{9}\\approx1.11$."
  },
  "exam-der-006": {
    "spot": "$\\ln\\left(\\sqrt{1+x^2}+x\\right)$ is $\\sinh^{-1}x$; even if you don't recognize it, after the Chain Rule the numerator turns out to be exactly $\\sqrt{1+x^2}+x$, which cancels with the denominator.",
    "why": "Just apply the Chain Rule honestly: over a common denominator, the numerator of $\\frac{x}{\\sqrt{1+x^2}}+1$ is identical to what's inside the $\\ln$ — that's why it simplifies.",
    "steps": [
      "Inner $u=\\sqrt{1+x^2}+x$, $u'=\\frac{x}{\\sqrt{1+x^2}}+1=\\frac{x+\\sqrt{1+x^2}}{\\sqrt{1+x^2}}$.",
      "$\\frac{u'}{u}=\\frac{x+\\sqrt{1+x^2}}{\\sqrt{1+x^2}}\\cdot\\frac{1}{\\sqrt{1+x^2}+x}$, and the factors cancel.",
      "So the derivative $=\\frac{1}{\\sqrt{1+x^2}}$."
    ],
    "trap": "Differentiating only the outer $\\ln$ and writing $\\frac{1}{\\sqrt{1+x^2}+x}$, missing the inner derivative.",
    "check": "At $x=0$ the derivative is $1$: $\\sinh^{-1}x\\approx x$ near the origin."
  },
  "exam-der-010": {
    "spot": "$x$ times $\\ln(1+x^2)$: Product Rule; the second factor is $\\ln$ of $1+x^2$, which adds a layer of Chain Rule.",
    "why": "Each rule is used once, and the two resulting terms don't need to be combined.",
    "steps": [
      "Product Rule: $(x)'\\ln(1+x^2)+x\\cdot\\left(\\ln(1+x^2)\\right)'$.",
      "Chain Rule: $\\left(\\ln(1+x^2)\\right)'=\\frac{2x}{1+x^2}$.",
      "Together: $\\ln(1+x^2)+\\frac{2x^2}{1+x^2}$."
    ],
    "trap": "Dropping the first Product Rule term $\\ln(1+x^2)$ and writing only $\\frac{2x^2}{1+x^2}$.",
    "check": "The function is odd, so its derivative should be even."
  },
  "exam-der-018": {
    "spot": "$\\ln(\\sec x+\\tan x)$: after the Chain Rule, the inner derivative $\\sec x\\tan x+\\sec^2x$ factors as $\\sec x$ times exactly $\\sec x+\\tan x$.",
    "why": "This is the antiderivative from $\\int\\sec x\\,dx$, so differentiating it must give $\\sec x$; the key step is pulling out the common factor.",
    "steps": [
      "Inner: $(\\sec x+\\tan x)'=\\sec x\\tan x+\\sec^2x=\\sec x(\\tan x+\\sec x)$.",
      "$\\frac{\\sec x(\\sec x+\\tan x)}{\\sec x+\\tan x}=\\sec x$.",
      "So the derivative $=\\sec x$."
    ],
    "trap": "Remembering $(\\sec x)'$ as $\\tan^2x$ or $\\sec x$, so nothing cancels; $(\\sec x)'=\\sec x\\tan x$ and $(\\tan x)'=\\sec^2x$.",
    "check": "$x=0$: $\\sec0=1$, and $\\ln(\\sec x+\\tan x)\\approx x$ near the origin, with slope $1$."
  },
  "exam-der-019": {
    "spot": "Write $\\frac{x}{\\sqrt{1+x^2}}$ as $x(1+x^2)^{-1/2}$: Product Rule plus Chain Rule, then factor out $(1+x^2)^{-3/2}$ to combine.",
    "why": "The Quotient Rule has to deal with the square of a root; negative exponents plus factoring are cleaner.",
    "steps": [
      "$\\left(x(1+x^2)^{-1/2}\\right)'=(1+x^2)^{-1/2}+x\\cdot\\left(-\\frac12\\right)(1+x^2)^{-3/2}\\cdot2x$.",
      "Factor out $(1+x^2)^{-3/2}$: $(1+x^2)^{-3/2}\\left[(1+x^2)-x^2\\right]$.",
      "The bracket is $1$: the derivative $=\\frac{1}{(1+x^2)^{3/2}}$."
    ],
    "trap": "Dropping the inner $2x$ in the Chain Rule, getting $(1+x^2)^{-1/2}-\\frac{x}{2}(1+x^2)^{-3/2}$, which doesn't simplify cleanly.",
    "check": "$\\frac{x}{\\sqrt{1+x^2}}$ is increasing and tends to $\\pm1$ at $\\pm\\infty$: the derivative is always positive, and its integral over the whole real line is $2$."
  },
  "exam-int-002": {
    "spot": "The numerator $x^3$ has higher degree than the denominator $1+x^2$: divide first, $\\frac{x^3}{1+x^2}=x-\\frac{x}{1+x^2}$, and the leftover $\\frac{x}{1+x^2}$ has numerator equal to half the derivative of the denominator.",
    "why": "Long division first for an improper fraction is the standard routine; the remainder's $x\\,dx$ matches $d(1+x^2)$ exactly, so no trigonometric substitution is needed.",
    "steps": [
      "Divide: $x^3=x(1+x^2)-x$, so $\\frac{x^3}{1+x^2}=x-\\frac{x}{1+x^2}$.",
      "$\\int x\\,dx=\\frac{x^2}{2}$; $\\int\\frac{x}{1+x^2}dx=\\frac12\\ln(1+x^2)$ (substitute $u=1+x^2$).",
      "So $\\int\\frac{x^3}{1+x^2}dx=\\frac{x^2}{2}-\\frac12\\ln(1+x^2)+C$."
    ],
    "trap": "Writing $\\int\\frac{x}{1+x^2}dx$ as $\\arctan x$ — that's $\\int\\frac{dx}{1+x^2}$. With an $x$ in the numerator, it's a $\\ln$.",
    "check": "Differentiate back: $x-\\frac{x}{1+x^2}=\\frac{x^3}{1+x^2}$."
  },
  "lec-02-q2b": {
    "spot": "$\\frac{x-1}{x+1}$ is a ratio of two linear expressions: Quotient Rule; in the numerator $(x+1)-(x-1)$ the $x$ cancels, leaving the constant $2$.",
    "why": "You could also rewrite it as $1-\\frac{2}{x+1}$ first and then differentiate — just as fast; the Quotient Rule is the most direct.",
    "steps": [
      "$u=x-1$, $v=x+1$, $u'=v'=1$.",
      "$y'=\\frac{(x+1)\\cdot1-(x-1)\\cdot1}{(x+1)^2}=\\frac{2}{(x+1)^2}$.",
      "The answer is $y'=\\frac{2}{(x+1)^2}$."
    ],
    "trap": "Writing the numerator in the wrong order, $uv'-u'v$, and getting $-\\frac{2}{(x+1)^2}$.",
    "check": "Rewrite as $1-\\frac{2}{x+1}$ and differentiate: $\\frac{2}{(x+1)^2}$, the same; it's always positive, so the function increases on each piece."
  }
};
