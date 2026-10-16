// Detail v2, English — batch 002. Translation of tools/content/detail/002.js (text only; claims live in the Chinese file).
module.exports = {
  "burst-int-010": {
    "spot": "The exponent has $x^2$ and the power in front is odd, $x^5=x^4\\cdot x$: the extra $x$ is exactly what you need for $d(x^2)$, so $u=x^2$ turns it into a Gamma function.",
    "why": "Integration by parts takes two rounds, each time rebuilding $xe^{-x^2}$; one substitution lands on $\\Gamma(3)=2!$, which you just look up.",
    "steps": [
      "Let $u=x^2$, $du=2x\\,dx$, so $x^5\\,dx=x^4\\cdot x\\,dx=u^2\\cdot\\frac{du}{2}$.",
      "Limits: $x=0\\to u=0$, $x\\to\\infty\\to u\\to\\infty$, so the integral becomes $\\frac{1}{2}\\int_0^\\infty u^2e^{-u}\\,du$.",
      "$\\int_0^\\infty u^2e^{-u}\\,du=\\Gamma(3)=2!=2$.",
      "Multiply by $\\frac{1}{2}$: the answer is $\\frac{1}{2}\\cdot 2=1$."
    ],
    "trap": "You can also write $x^5$ as $u^{5/2}$ and $dx$ as $\\frac{du}{2\\sqrt{u}}$, but many people drop the $\\frac{1}{2}$ from $\\frac{du}{2x}$ and get $\\Gamma(3)=2$.",
    "check": "The antiderivative $-\\frac{1}{2}(x^4+2x^2+2)e^{-x^2}$ is $-1$ at $0$ and $0$ at $\\infty$; the difference is exactly $1$."
  },
  "putnam-012": {
    "spot": "The numerator is the same function $\\arctan$ evaluated at $2x$ and at $x$, divided by $x$ — a Frullani-type integral. Write the difference as an integral over a parameter $t$; after dividing by $x$ it becomes easy to integrate.",
    "why": "Splitting into $\\int\\frac{\\arctan 2x}{x}-\\int\\frac{\\arctan x}{x}$ gives two divergent pieces; as a double integral with the order swapped, the inner integral is the standard $\\int\\frac{dx}{1+t^2x^2}$.",
    "steps": [
      "$\\arctan(2x)-\\arctan x=\\int_1^2\\frac{\\partial}{\\partial t}\\arctan(tx)\\,dt=\\int_1^2\\frac{x}{1+t^2x^2}\\,dt$.",
      "Divide by $x$: the integrand $=\\int_1^2\\frac{dt}{1+t^2x^2}$, so the original integral $=\\int_1^2\\int_0^\\infty\\frac{dx}{1+t^2x^2}\\,dt$ (the integrand is positive, so swapping the order is allowed).",
      "Inner: let $s=tx$, $\\int_0^\\infty\\frac{dx}{1+t^2x^2}=\\frac{1}{t}\\cdot\\frac{\\pi}{2}$.",
      "Outer: $\\int_1^2\\frac{\\pi}{2t}\\,dt=\\frac{\\pi}{2}\\ln 2$."
    ],
    "trap": "Applying the Frullani formula $(f(0)-f(\\infty))\\ln\\frac{b}{a}$ with $a,b$ swapped gives $-\\frac{\\pi}{2}\\ln 2$. The integrand is positive everywhere ($\\arctan 2x>\\arctan x$), so the answer must be positive.",
    "check": "$\\frac{\\pi}{2}\\ln 2\\approx 1.089>0$, consistent with a positive integrand; at $x=1$ the integrand is $\\arctan 2-\\frac{\\pi}{4}\\approx 0.32$."
  },
  "rel-boss-009": {
    "spot": "$z=0$ is a pole of order four of $\\frac{e^z}{z^4}$, and everyone knows the expansion of $e^z$ — the residue is the $\\frac{1}{z}$ coefficient of the Laurent series, i.e. the $z^3$ coefficient of $e^z$.",
    "why": "The higher-order pole formula needs three derivatives and a division by $3!$; expanding $e^z$ lets you read the coefficient off directly, with no factorial slips.",
    "steps": [
      "$e^z=1+z+\\frac{z^2}{2}+\\frac{z^3}{6}+\\frac{z^4}{24}+\\cdots$; the cubic coefficient is $\\frac{1}{3!}=\\frac{1}{6}$.",
      "Divide by $z^4$: $\\frac{e^z}{z^4}=\\frac{1}{z^4}+\\frac{1}{z^3}+\\frac{1}{2z^2}+\\frac{1}{6z}+\\frac{1}{24}+\\cdots$.",
      "Residue $=\\frac{1}{z}$ coefficient $=\\frac{1}{6}$. Check with the contour $z=e^{it}$: $\\frac{1}{2\\pi}\\int_0^{2\\pi}e^{\\cos t}\\cos(\\sin t-3t)\\,dt$ is exactly this coefficient."
    ],
    "trap": "Grabbing the wrong term: taking the constant term $\\frac{1}{24}$ (the $z^4$ coefficient of $e^z$) as the residue. The residue is the $z^{-1}$ term, which corresponds to $z^{4-1}=z^3$ in $e^z$.",
    "check": "Formula method: for a pole of order four, residue $=\\frac{1}{3!}\\left.\\frac{d^3}{dz^3}e^z\\right|_{z=0}=\\frac{1}{6}$. Both routes agree."
  },
  "rel-hard-cpx-001": {
    "spot": "$\\frac{\\sin z}{z^4}$: the numerator $\\sin z$ itself has a zero at $0$, so this is really a pole of order three. The residue is the $z^3$ coefficient in the expansion of $\\sin z$.",
    "why": "Expanding $\\sin z=z-\\frac{z^3}{6}+\\cdots$ gives the coefficient in one line; the higher-order pole formula makes you find the order first and then differentiate two or three times.",
    "steps": [
      "$\\sin z=z-\\frac{z^3}{6}+\\frac{z^5}{120}-\\cdots$; the $z^3$ coefficient is $-\\frac{1}{6}$.",
      "Divide by $z^4$: $\\frac{\\sin z}{z^4}=\\frac{1}{z^3}-\\frac{1}{6z}+\\frac{z}{120}-\\cdots$.",
      "Residue $=\\frac{1}{z}$ coefficient $=-\\frac{1}{6}$. Contour check with $z=e^{it}$: $\\frac{1}{2\\pi}\\int_0^{2\\pi}\\mathrm{Re}\\left(\\sin(e^{it})e^{-3it}\\right)dt$ equals it."
    ],
    "trap": "Approximating $\\sin z$ by just $z$ gives $\\frac{1}{z^3}$, so you think there is no $\\frac{1}{z}$ term and the residue is $0$. The residue hides in the next term, $-\\frac{z^3}{6}$.",
    "check": "Formula method (pole of order three): $\\frac{1}{2!}\\left.\\frac{d^2}{dz^2}\\left(z^3\\cdot\\frac{\\sin z}{z^4}\\right)\\right|_{0}=\\frac{1}{2}\\left.\\frac{d^2}{dz^2}\\frac{\\sin z}{z}\\right|_0=\\frac{1}{2}\\cdot\\left(-\\frac{1}{3}\\right)=-\\frac{1}{6}$."
  },
  "rel-hard-cpx-007": {
    "spot": "The denominator $\\sin^2 z$ has a double zero at $0$ and the numerator $z$ cancels one order — leaving a simple pole. The residue at a simple pole is just $\\lim z f(z)$.",
    "why": "Once you count the order of the pole, the residue is a single limit $\\left(\\frac{z}{\\sin z}\\right)^2\\to 1$; expanding $\\csc^2 z$ by brute force works too, but needs one more series to remember.",
    "steps": [
      "$\\sin^2 z=z^2\\left(1-\\frac{z^2}{6}+\\cdots\\right)^2$ is a double zero; near $0$, $\\frac{z}{\\sin^2 z}$ behaves like $\\frac{z}{z^2}=\\frac{1}{z}$: a simple pole.",
      "Simple pole: $\\mathrm{Res}=\\lim_{z\\to 0}z\\cdot\\frac{z}{\\sin^2 z}=\\lim_{z\\to 0}\\left(\\frac{z}{\\sin z}\\right)^2$.",
      "$\\frac{z}{\\sin z}\\to 1$, so the residue $=1^2=1$."
    ],
    "trap": "Seeing that numerator and denominator both vanish at $0$ and concluding it is a removable singularity with residue $0$. The denominator has a double zero and the numerator only a simple one; they don't fully cancel.",
    "check": "Expansion check: $\\frac{z^2}{\\sin^2 z}=1+\\frac{z^2}{3}+\\cdots$, so $\\frac{z}{\\sin^2 z}=\\frac{1}{z}+\\frac{z}{3}+\\cdots$, and the $\\frac{1}{z}$ coefficient is indeed $1$."
  },
  "world-057": {
    "spot": "Denominator $1+x^2$, range $0$ to $\\infty$: substituting $x=\\tan\\theta$ turns $\\frac{dx}{1+x^2}$ straight into $d\\theta$, and $\\ln(1+\\tan^2\\theta)=-2\\ln\\cos\\theta$, which lands on the classic integral $\\int_0^{\\pi/2}\\ln\\cos\\theta\\,d\\theta$.",
    "why": "Feynman's trick with the parameter $\\ln(1+a^2x^2)$ needs partial fractions; the trigonometric substitution turns it into a known integral in one line.",
    "steps": [
      "Let $x=\\tan\\theta$, $dx=\\sec^2\\theta\\,d\\theta$, $1+x^2=\\sec^2\\theta$: $\\frac{\\ln(1+x^2)}{1+x^2}dx=\\ln(\\sec^2\\theta)\\,d\\theta=-2\\ln\\cos\\theta\\,d\\theta$.",
      "The upper limit $x\\to\\infty$ maps to $\\theta\\to\\frac{\\pi}{2}$: the integral $=-2\\int_0^{\\pi/2}\\ln\\cos\\theta\\,d\\theta$.",
      "Write $I=\\int_0^{\\pi/2}\\ln\\cos\\theta\\,d\\theta=\\int_0^{\\pi/2}\\ln\\sin\\theta\\,d\\theta$ (by symmetry). Adding: $2I=\\int_0^{\\pi/2}\\ln\\frac{\\sin 2\\theta}{2}\\,d\\theta=I-\\frac{\\pi}{2}\\ln 2$ (the integral of $\\sin 2\\theta$ over $[0,\\frac{\\pi}{2}]$ is the same as for $\\sin\\theta$).",
      "Solve: $I=-\\frac{\\pi}{2}\\ln 2$.",
      "The integral $=-2\\cdot\\left(-\\frac{\\pi}{2}\\ln 2\\right)=\\pi\\ln 2$."
    ],
    "trap": "Seeing $\\ln\\cos\\theta$ blow up to $-\\infty$ at $\\theta=\\frac{\\pi}{2}$ and concluding the integral diverges. $\\ln$ blows up very slowly and is still integrable near the endpoint.",
    "check": "$\\pi\\ln 2\\approx 2.18$; the integrand is always positive, and the $\\int_0^1$ part is only about $0.43$, so most of it comes from the long tail $x>1$ — reasonable."
  },
  "depth-der-015": {
    "spot": "$\\frac{1-x^2}{1+x^2}$ is the half-angle (Weierstrass) form of $\\cos 2\\theta$ with $x=\\tan\\theta$. When you see it, simplify the function first, then differentiate.",
    "why": "Using the Chain Rule on $\\arccos$ directly runs into $\\sqrt{1-u^2}=\\frac{2|x|}{1+x^2}$, where the absolute value is easy to get wrong; rewriting as $2\\arctan x$ takes one line.",
    "steps": [
      "Let $x=\\tan\\theta$: $\\frac{1-\\tan^2\\theta}{1+\\tan^2\\theta}=\\cos 2\\theta$.",
      "For $x>0$, $\\theta\\in(0,\\frac{\\pi}{2})$, so $2\\theta\\in(0,\\pi)$ lies in the range of $\\arccos$, hence $\\arccos(\\cos 2\\theta)=2\\theta=2\\arctan x$.",
      "Differentiate: $\\frac{d}{dx}2\\arctan x=\\frac{2}{1+x^2}$."
    ],
    "trap": "Forcing the Chain Rule and writing $\\sqrt{1-u^2}=\\sqrt{\\frac{4x^2}{(1+x^2)^2}}$ as just $\\frac{2x}{1+x^2}$. Since the problem gives $x>0$ that happens to be right here; for $x<0$ it is $\\frac{-2x}{1+x^2}$ and the derivative becomes $-\\frac{2}{1+x^2}$.",
    "check": "At $x=1$: the function value is $\\arccos 0=\\frac{\\pi}{2}=2\\arctan 1$ and the derivative is $\\frac{2}{2}=1$."
  },
  "depth-int-011": {
    "spot": "The numerator is $x^2=x\\cdot x$, and $\\frac{x}{(1+x^2)^2}$ integrates on sight (the inner derivative is right there). Keep one $x$, pair the other $x$ with the denominator — integration by parts.",
    "why": "Splitting into $\\frac{1}{1+x^2}-\\frac{1}{(1+x^2)^2}$ also works, but the second piece needs a trigonometric substitution; one round of parts lowers the power.",
    "steps": [
      "Take $u=x$, $dv=\\frac{x}{(1+x^2)^2}dx$; then $v=-\\frac{1}{2(1+x^2)}$.",
      "By parts: $\\int\\frac{x^2}{(1+x^2)^2}dx=-\\frac{x}{2(1+x^2)}+\\int\\frac{dx}{2(1+x^2)}$.",
      "What's left is $\\frac{1}{2}\\arctan x$, so the answer $=\\frac{1}{2}\\arctan x-\\frac{x}{2(1+x^2)}+C$."
    ],
    "trap": "After splitting, treating $\\int\\frac{dx}{(1+x^2)^2}$ with the power rule and getting $-\\frac{1}{1+x^2}$ — that integrates with respect to $1+x^2$, not $x$; the inner derivative $2x$ is missing.",
    "check": "Definite integral $\\int_0^1$: plugging into the answer gives $\\frac{\\pi}{8}-\\frac{1}{4}\\approx 0.143$, matching numerical integration."
  },
  "der-060": {
    "spot": "The Wronskian is $W(f,g)=\\begin{vmatrix}f&g\\\\f'&g'\\end{vmatrix}=fg'-f'g$. $\\cos$ and $\\sin$ are each other's derivatives (up to a sign), so the product becomes $\\cos^2+\\sin^2$.",
    "why": "Just plug into the determinant; remember the order is \"functions in the first row, derivatives in the second\" and the sign won't flip.",
    "steps": [
      "$f=\\cos x$, $g=\\sin x$, $f'=-\\sin x$, $g'=\\cos x$.",
      "$W=fg'-f'g=\\cos x\\cdot\\cos x-(-\\sin x)\\sin x=\\cos^2x+\\sin^2x$.",
      "$\\cos^2x+\\sin^2x=1$: it is $1$ for every $x$ (nonzero, so the two functions are linearly independent)."
    ],
    "trap": "Writing the determinant in the wrong order, $f'g-fg'$, and getting $-1$.",
    "check": "At $x=0$: $W=\\cos 0\\cdot\\cos 0-0=1$."
  },
  "exam-lim-012": {
    "spot": "Base $1+\\frac{2}{x}\\to 1$, exponent $3x\\to\\infty$: a $1^\\infty$ form. Take logs to get \"$\\infty\\cdot 0$\", then use $\\ln(1+u)\\approx u$.",
    "why": "The formula $\\left(1+\\frac{a}{x}\\right)^{bx}\\to e^{ab}$ is fastest, but the log step is where that formula comes from — if you misremember it, you can rebuild it.",
    "steps": [
      "Base tends to $1$, exponent tends to $\\infty$: $1^\\infty$ is an indeterminate form, not $1$.",
      "Take logs: $\\ln y=3x\\ln\\left(1+\\frac{2}{x}\\right)$. With $\\ln(1+u)\\approx u$ and $u=\\frac{2}{x}$, $\\ln y\\approx 3x\\cdot\\frac{2}{x}=6$.",
      "$y\\to e^6$."
    ],
    "trap": "Seeing the base tend to $1$ and saying $1^\\infty=1$. $1^\\infty$ is indeterminate: the tiny amount by which the base exceeds $1$ gets amplified by the huge exponent.",
    "check": "At $x=1000$: $(1.002)^{3000}\\approx e^{5.988}\\approx 398.6$, slightly below $e^6\\approx 403.4$, approaching from below."
  },
  "exam-lim-007": {
    "spot": "Inside the brackets, $\\sqrt{1+\\frac{3}{x}}$ minus $1+\\frac{3}{2x}$ — exactly the first two terms of its Taylor expansion; multiplying by $x^2$ asks for the coefficient of the third term (the $\\frac{1}{x^2}$ term).",
    "why": "Rationalizing leaves the $\\frac{3}{2x}$ term messy; setting $u=\\frac{3}{x}$ and using the expansion of $\\sqrt{1+u}$ does it in one go.",
    "steps": [
      "Brackets $\\to 0$, $x^2\\to\\infty$: an $\\infty\\cdot 0$ form.",
      "$\\sqrt{1+u}=1+\\frac{u}{2}-\\frac{u^2}{8}+\\cdots$.",
      "Substitute $u=\\frac{3}{x}$: brackets $=-\\frac{1}{8}\\cdot\\frac{9}{x^2}+O\\!\\left(\\frac{1}{x^3}\\right)$.",
      "Multiply by $x^2$: the limit $=-\\frac{9}{8}$."
    ],
    "trap": "Expanding only to first order ($\\sqrt{1+u}\\approx 1+\\frac{u}{2}$) makes the brackets $0$ and you wrongly answer $0$; or misremembering the $u^2$ coefficient as $-\\frac{1}{4}$ gives $-\\frac{9}{4}$.",
    "check": "At $x=100$: $10000\\left(\\sqrt{1.03}-1.015\\right)\\approx -1.108$, close to $-1.125$ and slightly above it (the next term $+\\frac{27}{16x}$ is positive)."
  },
  "gap-ser-end-001": {
    "spot": "The power series $\\sum\\frac{x^n}{n}$ has radius of convergence $1$, and the question asks about the endpoint $x=-1$: plugging in gives the alternating harmonic series. At endpoints, always check \"the series itself\" and \"its absolute values\" separately.",
    "why": "The Ratio Test gives $1$ at an endpoint and can't decide; at endpoints you must plug in and use the Alternating Series Test and the $p$-series test separately.",
    "steps": [
      "Plug in $x=-1$: $\\sum_{n=1}^\\infty\\frac{(-1)^n}{n}=-1+\\frac{1}{2}-\\frac{1}{3}+\\cdots$.",
      "Absolute values give $\\sum\\frac{1}{n}$: the harmonic series ($p=1$) diverges — its partial sums always exceed $\\int_1^{N+1}\\frac{dx}{x}=\\ln(N+1)$. So it is not absolutely convergent.",
      "The series alternates, and $\\frac{1}{n}$ decreases to $0$: the Alternating Series Test says it converges (to $-\\ln 2$).",
      "Convergent but not absolutely convergent: at $x=-1$ it converges conditionally."
    ],
    "trap": "Knowing $x=1$ gives the divergent harmonic series and declaring both endpoints divergent. At $x=-1$ the alternating signs cancel each other and the series converges.",
    "check": "$\\ln(1+x)=\\sum\\frac{(-1)^{n+1}x^n}{n}$, so $\\sum\\frac{x^n}{n}=-\\ln(1-x)$; at $x=-1$ this gives $-\\ln 2$, a finite value."
  },
  "hc-spec-006": {
    "spot": "$x^{\\text{even}}e^{-ax^2}$ integrated from $0$ to $\\infty$: a Gaussian moment; substituting $u=ax^2$ lands on $\\Gamma\\!\\left(\\frac{m+1}{2}\\right)$. Here $m=4$, $a=2$.",
    "why": "You could also differentiate $\\int e^{-ax^2}$ twice with respect to $a$, but constants get lost easily; one substitution gives $\\Gamma\\!\\left(\\frac{5}{2}\\right)$ directly.",
    "steps": [
      "Let $u=2x^2$: $x^4=\\frac{u^2}{4}$, $dx=\\frac{du}{2\\sqrt{2u}}$, and the integrand becomes $\\frac{u^{3/2}e^{-u}}{8\\sqrt{2}}$.",
      "$\\int_0^\\infty u^{3/2}e^{-u}\\,du=\\Gamma\\!\\left(\\frac{5}{2}\\right)=\\frac{3}{2}\\cdot\\frac{1}{2}\\sqrt{\\pi}=\\frac{3\\sqrt{\\pi}}{4}$.",
      "Combine: $\\frac{3\\sqrt{\\pi}}{4}\\cdot\\frac{1}{8\\sqrt{2}}=\\frac{3\\sqrt{\\pi}}{32\\sqrt{2}}$."
    ],
    "trap": "Using the whole-real-line formula $\\int_{-\\infty}^{\\infty}x^4e^{-ax^2}dx=\\frac{3\\sqrt{\\pi}}{4a^{5/2}}$ and forgetting the problem only integrates half of it — the answer comes out twice as large.",
    "check": "Numerically about $0.1175$; matches the $\\int_{-\\infty}^\\infty$ formula divided by $2$: $\\frac{1}{2}\\cdot\\frac{3\\sqrt{\\pi}}{4\\cdot 2^{5/2}}$."
  },
  "int-035": {
    "spot": "All limits are constants and the integrand $r^2\\cdot r$ has no $\\theta$: the double integral splits into a product of two single integrals. The extra $r$ is the polar area element.",
    "why": "No need to convert back to rectangular coordinates; after separating, the $\\theta$ half just multiplies by $2\\pi$.",
    "steps": [
      "The integrand $r^3$ does not depend on $\\theta$: $\\int_0^{2\\pi}\\int_0^1 r^3\\,dr\\,d\\theta=\\left(\\int_0^{2\\pi}d\\theta\\right)\\left(\\int_0^1 r^3\\,dr\\right)$.",
      "$\\int_0^1 r^3\\,dr=\\frac{1}{4}$.",
      "Multiply: $2\\pi\\cdot\\frac{1}{4}=\\frac{\\pi}{2}$."
    ],
    "trap": "Seeing polar coordinates and reflexively multiplying by another $r$, computing $\\int r^4\\,dr=\\frac{1}{5}$ and getting $\\frac{2\\pi}{5}$. The problem already includes the $r$ from $r\\,dr\\,d\\theta$.",
    "check": "This is $\\iint_{x^2+y^2\\le 1}(x^2+y^2)\\,dA$; in rectangular coordinates it is also $\\frac{\\pi}{2}$."
  },
  "int-040": {
    "spot": "A polynomial times $e^{-x}$ integrated from $0$ to $\\infty$: this is $\\Gamma(2)=1!$. If you don't want to rely on Gamma, do one round of integration by parts.",
    "why": "In parts, differentiate $x$ away and integrate $e^{-x}$; after one round there is no $x$ left. The other choice gets worse each time.",
    "steps": [
      "$u=x$, $dv=e^{-x}dx$: $\\int xe^{-x}dx=-xe^{-x}+\\int e^{-x}dx=-(x+1)e^{-x}+C$.",
      "Upper limit: as $x\\to\\infty$, $(x+1)e^{-x}\\to 0$ (exponentials beat polynomials); at the lower limit $x=0$ it is $-1$.",
      "$0-(-1)=1$."
    ],
    "trap": "Botching the lower limit: $-(0+1)e^0=-1$, so the difference is $0-(-1)=+1$; flipping the sign gives $-1$, but the integrand is always positive, so the answer cannot be negative.",
    "check": "$\\Gamma(n+1)=n!$, $\\Gamma(2)=1!=1$; both routes agree."
  },
  "int-065": {
    "spot": "The numerator is the same function $e^{-tx}$ at $t=3$ and $t=7$, divided by $x$: Frullani type. $\\frac{e^{-3x}-e^{-7x}}{x}=\\int_3^7 e^{-tx}\\,dt$; swap the order and it is easy.",
    "why": "Split into two integrals, each diverges at $x=0$ (like $\\frac{1}{x}$); written as a double integral and swapped, the inner one is just $\\int_0^\\infty e^{-tx}dx=\\frac{1}{t}$.",
    "steps": [
      "$\\frac{e^{-3x}-e^{-7x}}{x}=\\int_3^7 e^{-tx}\\,dt$ (integrating $e^{-tx}$ in $t$ gives $-\\frac{e^{-tx}}{x}$).",
      "Swap the order (the integrand is positive): the integral $=\\int_3^7\\int_0^\\infty e^{-tx}\\,dx\\,dt$, and the inner part $=\\frac{1}{t}$.",
      "$\\int_3^7\\frac{dt}{t}=\\ln 7-\\ln 3=\\ln\\frac{7}{3}$."
    ],
    "trap": "Remembering the Frullani formula backwards and answering $\\ln\\frac{3}{7}<0$. Since $e^{-3x}>e^{-7x}$, the integrand is always positive and so is the answer: the slower-decaying one ($a=3$) goes in the denominator.",
    "check": "$\\ln\\frac{7}{3}\\approx 0.847>0$; as $x\\to 0^+$ the integrand tends to $7-3=4$, so it does not blow up."
  },
  "rel-hard-cpx-006": {
    "spot": "Denominator $(z-1)^2$: $z=1$ is a double pole and the numerator $e^z$ is analytic there. Residue at a double pole $=\\left.\\frac{d}{dz}\\left[(z-1)^2f(z)\\right]\\right|_{z=1}$.",
    "why": "You could also expand $e^z=e\\cdot e^{z-1}$ in powers of $z-1$, but the formula only needs one derivative of $e^z$ — the shortest route.",
    "steps": [
      "$(z-1)^2f(z)=e^z$ is analytic and nonzero at $z=1$, so it really is a double pole.",
      "Double-pole formula: $\\mathrm{Res}=\\left.\\frac{d}{dz}e^z\\right|_{z=1}=e$.",
      "Expansion check: $e^z=e\\left(1+(z-1)+\\frac{(z-1)^2}{2}+\\cdots\\right)$; after dividing by $(z-1)^2$, the coefficient of $\\frac{1}{z-1}$ is $e$. The contour $z=1+e^{it}$ gives the same value."
    ],
    "trap": "Thinking the residue is just \"the numerator's value at the pole\", $e^1=e$ — here the number happens to match, but the reasoning is wrong: for $\\frac{e^{2z}}{(z-1)^2}$ the numerator value is $e^2$, while the true residue is the derivative $2e^2$.",
    "check": "Compare: the residue of $\\frac{e^{2z}}{(z-1)^2}$ is $\\left.\\frac{d}{dz}e^{2z}\\right|_1=2e^2$, not $e^2$."
  },
  "burst-boss-param-002": {
    "spot": "The $x$ in $xe^{-ax}$ can be produced by differentiating with respect to $a$: $\\frac{\\partial}{\\partial a}e^{-ax}=-xe^{-ax}$. First compute the easy $\\int_0^\\infty e^{-ax}dx$, then differentiate in $a$.",
    "why": "Integration by parts works too, but differentiating with respect to the parameter handles the whole family $\\int x^ne^{-ax}$ at once; this problem is just $n=1$.",
    "steps": [
      "$J(a)=\\int_0^\\infty e^{-ax}\\,dx=\\frac{1}{a}$ ($a>0$).",
      "Differentiate in $a$: $J'(a)=\\int_0^\\infty(-x)e^{-ax}\\,dx=-I(a)$.",
      "$J'(a)=-\\frac{1}{a^2}$, so $I(a)=\\frac{1}{a^2}$."
    ],
    "trap": "Forgetting the minus sign that $\\frac{\\partial}{\\partial a}e^{-ax}$ brings out and getting $I(a)=-\\frac{1}{a^2}$. The integrand is always positive, so the answer cannot be negative.",
    "check": "At $a=1$ it is $\\int_0^\\infty xe^{-x}dx=\\Gamma(2)=1$, matching $\\frac{1}{1^2}$."
  },
  "cx-curve-007": {
    "spot": "Inflection points are where $f''$ changes sign. $f=\\frac{x}{x^2+1}$ is odd, so $x=0$ must be one; then check whether the numerator of $f''$ has other roots.",
    "why": "Solving $f''=0$ is not enough; you must confirm the sign really changes on both sides of each root — here the numerator is $2x(x^2-3)$, three simple roots, and all of them change sign.",
    "steps": [
      "$f'=\\frac{(x^2+1)-x\\cdot 2x}{(x^2+1)^2}=\\frac{1-x^2}{(x^2+1)^2}$.",
      "Differentiate again and simplify: $f''=\\frac{2x(x^2-3)}{(x^2+1)^3}$.",
      "The denominator is always positive, so $f''=0\\Leftrightarrow x=0,\\ \\pm\\sqrt{3}$.",
      "The signs are: negative on $(-\\infty,-\\sqrt{3})$, positive on $(-\\sqrt{3},0)$, negative on $(0,\\sqrt{3})$, positive on $(\\sqrt{3},\\infty)$: the sign changes at all three points, so there are $3$ inflection points."
    ],
    "trap": "Taking the points $x=\\pm 1$ where $f'=0$ (the max and min) as inflection points and answering $2$. Extrema come from $f'$, concavity from $f''$.",
    "check": "An odd function's inflection points come in symmetric pairs, plus the origin: $1+2=3$, so an odd count makes sense."
  },
  "cx-exam-001": {
    "spot": "The numerator is a difference of two square roots and $x=0$ gives $\\frac{0}{0}$: multiply by the conjugate; the difference of squares clears the roots and cancels the $x$ in the denominator.",
    "why": "This is really the derivative of $g(x)=\\sqrt{1+x}-\\sqrt{1-x}$ at $0$, but rationalizing needs no derivative formulas and shows the $x$ cancelling in one step.",
    "steps": [
      "Plug in $x=0$: numerator $1-1=0$, denominator $0$, so it is $\\frac{0}{0}$.",
      "Multiply by the conjugate $\\sqrt{1+x}+\\sqrt{1-x}$: the numerator becomes $(1+x)-(1-x)=2x$, and the expression $=\\frac{2}{\\sqrt{1+x}+\\sqrt{1-x}}$.",
      "Now plug in $x=0$ directly: $\\frac{2}{1+1}=1$."
    ],
    "trap": "Writing the rationalized numerator as $(1+x)-(1-x)=x$ (dropping the $2$) and answering $\\frac{1}{2}$.",
    "check": "Derivative view: $g'(0)=\\frac{1}{2}+\\frac{1}{2}=1$, consistent."
  },
  "cx-sa-002": {
    "spot": "$y=\\sqrt{4-x^2}$ is the upper semicircle of radius $2$; rotating about the $x$-axis gives a whole sphere. Key fact: for a circle $y\\sqrt{1+y'^2}$ always equals the radius, so the integrand is constant.",
    "why": "Plugging into $S=2\\pi\\int y\\sqrt{1+y'^2}\\,dx$ you see all the roots cancel; you can compute it without memorizing the sphere's area.",
    "steps": [
      "$y'=\\frac{-x}{\\sqrt{4-x^2}}$, $1+y'^2=\\frac{4}{4-x^2}$.",
      "$y\\sqrt{1+y'^2}=\\sqrt{4-x^2}\\cdot\\frac{2}{\\sqrt{4-x^2}}=2$, a constant.",
      "$S=2\\pi\\int_{-2}^{2}2\\,dx=2\\pi\\cdot 2\\cdot 4=16\\pi$."
    ],
    "trap": "Forgetting the arc-length factor and computing $2\\pi\\int_{-2}^2 y\\,dx=2\\pi\\cdot 2\\pi=4\\pi^2$ — that is the semicircle's area times $2\\pi$, not a surface area.",
    "check": "Sphere area $4\\pi r^2=4\\pi\\cdot 4=16\\pi$."
  },
  "db-ext-001": {
    "spot": "Maximum of a continuous function on the closed interval $[0,2]$: the only candidates are critical points inside the interval and the two endpoints; plug them all in and compare.",
    "why": "No need to decide max vs. min — just compare values; the maximum often sits at an endpoint, which the second derivative test can't see.",
    "steps": [
      "$f'(x)=3x^2-3=0\\Rightarrow x=\\pm 1$; only $x=1$ is in $[0,2]$.",
      "Plug in the candidates: $f(0)=0$, $f(1)=-2$, $f(2)=8-6=2$.",
      "The largest is $f(2)=2$ (the critical point $x=1$ is actually the minimum)."
    ],
    "trap": "Stopping at the critical point $x=1$ and answering $-2$ — that is the minimum. On a closed interval you must always compare the endpoints.",
    "check": "$f$ is increasing on $(1,2)$ ($f'>0$), so a maximum at the right endpoint makes sense."
  },
  "ch-mix-010": {
    "spot": "The whole bracket to the $5$th power, with $\\sin^2x$ inside: three layers of Chain Rule — $(\\cdot)^5$, $1+(\\cdot)^2$, $\\sin x$. Peel from the outside in.",
    "why": "Expanding $(1+\\sin^2x)^5$ is asking for trouble; the Chain Rule gives one factor per layer, then you multiply.",
    "steps": [
      "Outer layer: $\\frac{d}{du}u^5=5u^4$, $u=1+\\sin^2x$.",
      "Middle and inner layers: $\\frac{d}{dx}(1+\\sin^2x)=2\\sin x\\cos x$.",
      "Multiply: $5(1+\\sin^2x)^4\\cdot 2\\sin x\\cos x=10\\sin x\\cos x(1+\\sin^2x)^4$."
    ],
    "trap": "Peeling only two layers: writing $(\\sin^2x)'$ as $2\\sin x$ (missing the $\\cos x$), or as $\\cos^2x$.",
    "check": "At $x=\\frac{\\pi}{4}$: $\\sin x\\cos x=\\frac{1}{2}$, $1+\\sin^2x=\\frac{3}{2}$, derivative $=10\\cdot\\frac{1}{2}\\cdot\\frac{81}{16}=\\frac{405}{16}$."
  },
  "cx-ode-001": {
    "spot": "$y'=3y$: the rate of change is proportional to the quantity itself — the defining equation of exponential growth. The solution must be $Ce^{3x}$; use $y(0)$ to find $C$.",
    "why": "Separating variables $\\frac{dy}{y}=3\\,dx$ is the derivation, but once you recognize this type you write the answer directly and only plug in the initial value.",
    "steps": [
      "Separate variables: $\\frac{dy}{y}=3\\,dx\\Rightarrow\\ln|y|=3x+c\\Rightarrow y=Ce^{3x}$.",
      "Plug in $y(0)=2$: $Ce^0=C=2$.",
      "$y=2e^{3x}$."
    ],
    "trap": "Putting the constant outside as $y=e^{3x}+1$ (to force $y(0)=2$): its derivative is $3e^{3x}\\ne 3y$. The integration constant lives at the $\\ln$ level, so after exponentiating it becomes a multiplied constant.",
    "check": "Substitute back: $y'=6e^{3x}=3\\cdot 2e^{3x}=3y$, and $y(0)=2$."
  },
  "cx-rev-004": {
    "spot": "The region lies between the $y$-axis and the curve $x=\\sqrt{y}$ for $y$ from $0$ to $1$, rotated about the $y$-axis: each slice at height $y$ is a disk of radius $\\sqrt{y}$ — integrate in $y$.",
    "why": "For a region against the $y$-axis rotated about the $y$-axis, disks in $y$ are the most direct; shells require figuring out that the shell height is $1-x^2$.",
    "steps": [
      "Write the curve as $x=\\sqrt{y}$: the disk at height $y$ has radius $\\sqrt{y}$ and area $\\pi y$.",
      "$V=\\pi\\int_0^1 y\\,dy=\\frac{\\pi}{2}$.",
      "Cross-check with shells: the shell at $x$ has height $1-x^2$, $V=2\\pi\\int_0^1x(1-x^2)\\,dx=2\\pi\\left(\\frac{1}{2}-\\frac{1}{4}\\right)=\\frac{\\pi}{2}$."
    ],
    "trap": "Using disks but integrating in $x$: $\\pi\\int_0^1 x^2\\,dx=\\frac{\\pi}{3}$. Disks for rotation about the $y$-axis are horizontal, their thickness is $dy$, and the radius must be written as a function of $y$.",
    "check": "This solid fits inside a cylinder of radius $1$ and height $1$ (volume $\\pi$) and fills half of it: $\\frac{\\pi}{2}<\\pi$."
  },
  "dd-par-001": {
    "spot": "Both $x$ and $y$ are given in terms of $t$: the slope of a parametric curve is $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$ — differentiate each in $t$ and divide.",
    "why": "Eliminating $t$ to write $y(x)$ means solving a quadratic, which is messy and has two branches; dividing directly is cleanest.",
    "steps": [
      "$\\frac{dx}{dt}=2t-1$, $\\frac{dy}{dt}=3t^2-3$.",
      "$\\frac{dy}{dx}=\\frac{3t^2-3}{2t-1}$.",
      "Plug in $t=2$: $\\frac{12-3}{4-1}=\\frac{9}{3}=3$."
    ],
    "trap": "Stopping at $\\frac{dy}{dt}=9$, or flipping the fraction to $\\frac{dx/dt}{dy/dt}=\\frac{1}{3}$.",
    "check": "Numerically: as $t$ goes from $2$ to $2.001$, $\\frac{\\Delta y}{\\Delta x}=\\frac{0.009006}{0.003001}\\approx 3.001$."
  },
  "lm-sq-002": {
    "spot": "$\\cos\\frac{1}{x^2}$ oscillates wildly near $0$, but it is bounded (between $-1$ and $1$), and it is multiplied by $x$, which tends to $0$: \"bounded times something going to zero\" — Squeeze Theorem.",
    "why": "L'Hôpital's Rule and algebraic simplification do nothing for an oscillating term; the Squeeze Theorem needs only the single fact $|\\cos|\\le 1$.",
    "steps": [
      "$\\left|\\cos\\frac{1}{x^2}\\right|\\le 1$, so $\\left|x\\cos\\frac{1}{x^2}\\right|\\le|x|$.",
      "That is, $-|x|\\le x\\cos\\frac{1}{x^2}\\le|x|$, and both sides tend to $0$.",
      "Squeeze Theorem: the limit $=0$."
    ],
    "trap": "Seeing $\\cos\\frac{1}{x^2}$ oscillate and answering \"does not exist\". Oscillation by itself is harmless; what matters is whether some factor squeezes the amplitude to zero — here $x$ does.",
    "check": "At $x=0.001$: $|x\\cos(10^6)|\\le 0.001$, already hugging $0$."
  },
  "ode-h2-006": {
    "spot": "Second-order homogeneous with constant coefficients, $y''-y=0$: the characteristic equation $r^2-1=0$ has two distinct real roots $\\pm 1$, so the solution is $Ae^x+Be^{-x}$; use the two initial values to find $A$ and $B$.",
    "why": "Watch the minus sign: $y''-y$ gives exponentials, only $y''+y$ gives trig functions; check the sign before writing the general solution.",
    "steps": [
      "Characteristic equation $r^2-1=0$, $r=\\pm 1$.",
      "General solution $y=Ae^x+Be^{-x}$, $y'=Ae^x-Be^{-x}$.",
      "Initial values: $y(0)=A+B=2$, $y'(0)=A-B=0$, so $A=B=1$.",
      "$y=e^x+e^{-x}$ (that is, $2\\cosh x$)."
    ],
    "trap": "Treating $y''-y=0$ as $y''+y=0$, writing $A\\cos x+B\\sin x$ and getting $2\\cos x$. Substituting back gives $y''-y=-4\\cos x\\ne 0$.",
    "check": "$y$ is even and $y(0)=2$ is its minimum, consistent with $y'(0)=0$; also $y''(0)=y(0)=2>0$."
  },
  "an-sup-005": {
    "spot": "$x+\\frac{1}{x}$, where the product of the two terms is the constant $1$: the standard AM-GM setup, with the minimum when the two terms are equal ($x=1$).",
    "why": "Differentiating to find the extremum also works, but AM-GM gives the lower bound and where it is attained in one line; the infimum is the minimum.",
    "steps": [
      "$x+\\frac{1}{x}-2=\\left(\\sqrt{x}-\\frac{1}{\\sqrt{x}}\\right)^2\\ge 0$, so every element is $\\ge 2$.",
      "Equality holds when $\\sqrt{x}=\\frac{1}{\\sqrt{x}}$, i.e. $x=1$: $1+1=2$ really is in the set.",
      "$2$ is a lower bound and is attained, so $\\inf S=\\min S=2$."
    ],
    "trap": "Thinking the infimum must be at the boundary: as $x\\to 0^+$, $x\\to 0$, so you answer $0$ — but $\\frac{1}{x}$ blows up to $\\infty$ at the same time. Both ends shoot upward; the lowest point is in the middle.",
    "check": "The values at $x=0.9$ and $x=1.1$ are both slightly above $2$; $x=1$ is the bottom of the valley."
  },
  "cx-arc-003": {
    "spot": "$x=3\\cos t$, $y=3\\sin t$ is a circle of radius $3$, and $t$ running over $\\frac{\\pi}{2}$ is a quarter circle. Parametric arc length is $\\int\\sqrt{x'^2+y'^2}\\,dt$, and on a circle the speed is the constant $3$.",
    "why": "In the arc length formula the root becomes $9(\\sin^2t+\\cos^2t)=9$, so the integrand is constant; no need to rewrite as $y(x)$.",
    "steps": [
      "$x'=-3\\sin t$, $y'=3\\cos t$.",
      "Speed $\\sqrt{9\\sin^2t+9\\cos^2t}=3$.",
      "$L=\\int_0^{\\pi/2}3\\,dt=\\frac{3\\pi}{2}$."
    ],
    "trap": "Forgetting the square root and computing $\\int_0^{\\pi/2}9\\,dt=\\frac{9\\pi}{2}$.",
    "check": "A quarter of the circumference $2\\pi\\cdot 3=6\\pi$ is $\\frac{3\\pi}{2}$."
  },
  "lm-os-001": {
    "spot": "One-sided limit $x\\to 0^+$: first see where the exponent $-\\frac{1}{x}$ goes. $x$ is a tiny positive number, $\\frac{1}{x}\\to+\\infty$, so the exponent $\\to-\\infty$.",
    "why": "L'Hôpital's Rule doesn't apply (it's not a quotient); tracking where the exponent goes is fastest. The two sides must be checked separately.",
    "steps": [
      "$x\\to 0^+$: $-\\frac{1}{x}\\to-\\infty$ (e.g. at $x=0.01$ it is $-100$).",
      "$e^u\\to 0$ as $u\\to-\\infty$, so $e^{-1/x}\\to 0$.",
      "The right-hand limit $=0$."
    ],
    "trap": "Ignoring the side: from the left, $x\\to 0^-$, $-\\frac{1}{x}\\to+\\infty$ and $e^{-1/x}$ blows up. The problem asks only for the right side, so the answer is $0$; the two-sided limit would not exist.",
    "check": "At $x=0.1$, $e^{-10}\\approx 4.5\\times 10^{-5}$ is already tiny; at $x=-0.1$, $e^{10}\\approx 22026$ — the two sides are very different."
  },
  "vc-nab-006": {
    "spot": "\"Maximum directional derivative\" is the length of the gradient $|\\nabla f|$, in the gradient's direction. No need to set up a unit vector and optimize.",
    "why": "$D_{\\mathbf{u}}f=\\nabla f\\cdot\\mathbf{u}=|\\nabla f|\\cos\\theta$ is largest at $\\theta=0$ — one dot-product formula and you're done.",
    "steps": [
      "$\\nabla f=(2xy,\\ x^2,\\ 1)$.",
      "At $(1,2,0)$: $\\nabla f=(4,1,1)$.",
      "Maximum directional derivative $=|\\nabla f|=\\sqrt{16+1+1}=\\sqrt{18}=3\\sqrt{2}$."
    ],
    "trap": "Adding the gradient components $4+1+1=6$, or forgetting the square root and answering $18$.",
    "check": "Along the unit vector $\\frac{(4,1,1)}{3\\sqrt{2}}$ the directional derivative $=\\frac{16+1+1}{3\\sqrt{2}}=3\\sqrt{2}$; another direction such as $(1,0,0)$ gives only $4<3\\sqrt{2}\\approx 4.24$."
  },
  "vc-surf-002": {
    "spot": "The surface is the side of the cylinder $x^2+y^2=4$, and the integrand is exactly $x^2+y^2$ — identically $4$ on the surface. Pull out the constant; what's left is the lateral area.",
    "why": "You don't really need to parametrize and integrate, but the parametrization $(2\\cos\\theta,2\\sin\\theta,z)$ confirms $dS=2\\,d\\theta\\,dz$.",
    "steps": [
      "On the surface $x^2+y^2=4$. Parametrize $x=2\\cos\\theta$, $y=2\\sin\\theta$.",
      "$\\mathbf{r}_\\theta\\times\\mathbf{r}_z=(2\\cos\\theta,2\\sin\\theta,0)$ has length $2$: $dS=2\\,d\\theta\\,dz$. Lateral area $=2\\cdot 2\\pi\\cdot 3=12\\pi$.",
      "$\\iint_S 4\\,dS=4\\cdot 12\\pi=48\\pi$."
    ],
    "trap": "After parametrizing, writing $dS$ as $d\\theta\\,dz$ (missing the radius $2$) and getting $24\\pi$.",
    "check": "Lateral area $2\\pi rh=2\\pi\\cdot 2\\cdot 3=12\\pi$; times $4$ gives $48\\pi$."
  },
  "vc-green-001": {
    "spot": "$\\oint x\\,dy-y\\,dx$ is Green's Theorem's signature expression: $\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}=1-(-1)=2$, so it equals \"twice the area\".",
    "why": "Doing the line integral along all three sides means three parametrizations; Green's Theorem turns it into an area, and the triangle's area is immediate.",
    "steps": [
      "$P=-y$, $Q=x$: $\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}=1+1=2$.",
      "Green's Theorem (counterclockwise): $\\oint x\\,dy-y\\,dx=\\iint_D 2\\,dA=2\\cdot\\text{area}$.",
      "Triangle area $\\frac{1}{2}\\cdot 2\\cdot 3=3$, so the answer $=6$."
    ],
    "trap": "Forgetting the factor $2$ and answering $3$ (just the area). It is $\\frac{1}{2}\\oint x\\,dy-y\\,dx$ that equals the area.",
    "check": "Direct computation: the two sides on the axes contribute $0$ ($dy=0$ when $y=0$, $dx=0$ when $x=0$); on the hypotenuse $(2-2t,3t)$ the integrand $=6\\,dt$, which integrates to $6$."
  },
  "vc-stokes-005": {
    "spot": "Flux of a curl through a surface with a boundary (the upper hemisphere's boundary is the equator): Stokes' Theorem swaps it for a line integral around the boundary, and $\\mathbf{F}=\\langle -y,x,0\\rangle$ around the unit circle is the simplest line integral there is.",
    "why": "Integrating directly on the sphere requires the normal vector and $dS$; on the equator the integrand simplifies to the constant $1$.",
    "steps": [
      "$\\nabla\\times\\mathbf{F}=(0,0,\\ \\partial_x x-\\partial_y(-y))=(0,0,2)$.",
      "Stokes: upward normal means the boundary runs counterclockwise viewed from above. Equator $x=\\cos t$, $y=\\sin t$, $t:0\\to 2\\pi$.",
      "$-y\\,dx+x\\,dy=(\\sin^2t+\\cos^2t)\\,dt=dt$, so the integral $=2\\pi$."
    ],
    "trap": "Going the wrong way (clockwise around the equator) and getting $-2\\pi$. With the normal pointing up, the right-hand fingers curl counterclockwise along the boundary (viewed from above).",
    "check": "Directly on the sphere: $\\nabla\\times\\mathbf{F}\\cdot\\mathbf{n}=2z=2\\cos\\varphi$, $dS=\\sin\\varphi\\,d\\varphi\\,d\\theta$, and $2\\pi\\int_0^{\\pi/2}2\\cos\\varphi\\sin\\varphi\\,d\\varphi=2\\pi$."
  },
  "int-042": {
    "spot": "Under the root is $1+x^3$, and outside sits $x^2$ — its derivative (up to the constant $3$). The inner derivative is right there: substitute $u=1+x^3$.",
    "why": "\"A function times the derivative of its inside\" is the signal for substitution; no need for parts or expanding.",
    "steps": [
      "$u=1+x^3$, $du=3x^2dx$, so $x^2dx=\\frac{du}{3}$.",
      "$\\int\\frac{1}{3}u^{1/2}du=\\frac{1}{3}\\cdot\\frac{2}{3}u^{3/2}=\\frac{2}{9}u^{3/2}$.",
      "Back to $x$: $\\frac{2}{9}(1+x^3)^{3/2}+C$."
    ],
    "trap": "Forgetting the $\\frac{1}{3}$ from $du=3x^2dx$ and getting $\\frac{2}{3}(1+x^3)^{3/2}$; differentiating back gives an extra factor of $3$.",
    "check": "$\\int_0^2$: $\\frac{2}{9}(27-1)=\\frac{52}{9}$, matching numerical integration."
  },
  "exam-der-005": {
    "spot": "Three factors $x^2$, $e^{-x}$, $\\sin x$ multiplied: the three-factor Product Rule $(uvw)'=u'vw+uv'w+uvw'$ — differentiate one at a time and copy the rest.",
    "why": "Grouping in pairs and applying the Product Rule twice works too, but cycling through the three factors is hardest to mess up; $e^{-x}$ can be factored out at the end.",
    "steps": [
      "Individual derivatives: $(x^2)'=2x$, $(e^{-x})'=-e^{-x}$, $(\\sin x)'=\\cos x$.",
      "Differentiate each in turn: $2x\\,e^{-x}\\sin x-x^2e^{-x}\\sin x+x^2e^{-x}\\cos x$.",
      "Factor out $e^{-x}$: $e^{-x}\\left(2x\\sin x-x^2\\sin x+x^2\\cos x\\right)$."
    ],
    "trap": "Dropping the minus sign in the derivative of $e^{-x}$, so the middle term becomes $+x^2e^{-x}\\sin x$.",
    "check": "Cross-check with logarithmic differentiation: $\\frac{f'}{f}=\\frac{2}{x}-1+\\cot x$; multiplying back by $f$ gives the three terms above."
  },
  "int-033": {
    "spot": "The region is the disk $x^2+y^2\\le 4$: polar coordinates. The integrand $x^2=r^2\\cos^2\\theta$, together with the area element's $r$, separates into $r$ and $\\theta$.",
    "why": "In rectangular coordinates you'd integrate $x^2\\sqrt{4-x^2}$, which needs a trigonometric substitution; in polar it's a product of two single integrals. Symmetry also works: $\\iint x^2=\\iint y^2=\\frac{1}{2}\\iint r^2$.",
    "steps": [
      "$\\iint x^2\\,dA=\\int_0^{2\\pi}\\int_0^2 r^2\\cos^2\\theta\\cdot r\\,dr\\,d\\theta=\\left(\\int_0^{2\\pi}\\cos^2\\theta\\,d\\theta\\right)\\left(\\int_0^2 r^3\\,dr\\right)$.",
      "$\\int_0^{2\\pi}\\cos^2\\theta\\,d\\theta=\\pi$ (the average of $\\cos^2$ over a full turn is $\\frac{1}{2}$).",
      "Multiply: $\\pi\\cdot 4=4\\pi$."
    ],
    "trap": "Forgetting the area element's $r$, computing $\\int_0^2 r^2\\,dr=\\frac{8}{3}$ and getting $\\frac{8\\pi}{3}$.",
    "check": "Rectangular: integrating in $y$ first gives $2x^2\\sqrt{4-x^2}$; integrating that in $x$ from $-2$ to $2$ also gives $4\\pi$."
  },
  "ig-num-003": {
    "spot": "Left endpoint sum: each piece uses the height at its left point. $[0,2]$ in $4$ pieces of width $\\frac{1}{2}$, sample points $0,\\frac{1}{2},1,\\frac{3}{2}$ — not the right end $2$.",
    "why": "A Riemann sum is just adding by definition: list the sample points, compute the heights, multiply by the width. Three steps, no confusion.",
    "steps": [
      "$\\Delta x=\\frac{2-0}{4}=\\frac{1}{2}$, left endpoints $0,\\frac{1}{2},1,\\frac{3}{2}$.",
      "Sum of heights: $0+\\frac{1}{4}+1+\\frac{9}{4}=\\frac{7}{2}$.",
      "Multiply by the width: $\\frac{1}{2}\\cdot\\frac{7}{2}=\\frac{7}{4}$."
    ],
    "trap": "Including the right end $2$ ($\\frac{1}{2},1,\\frac{3}{2},2$) — that is the right endpoint sum $\\frac{15}{4}$; or forgetting to multiply by $\\Delta x$ and answering $\\frac{7}{2}$.",
    "check": "$x^2$ is increasing on $[0,2]$, so the left sum must underestimate: $\\frac{7}{4}<\\int_0^2x^2dx=\\frac{8}{3}$."
  },
  "lim-025": {
    "spot": "$x$ and $y$ appear only through the product $xy$: let $u=xy$; as $(x,y)\\to(0,0)$, $u\\to 0$, and it becomes the one-variable $\\frac{\\sin u}{u}$.",
    "why": "Trying paths can only prove a limit doesn't exist, never that it does; a single substitution covers every way of approaching at once.",
    "steps": [
      "$|xy|\\le\\frac{x^2+y^2}{2}$, so $u=xy\\to 0$ as $(x,y)\\to(0,0)$.",
      "Standard limit: $\\lim_{u\\to 0}\\frac{\\sin u}{u}=1$.",
      "So the limit $=1$ (the function is undefined on the axes where $xy=0$; the limit only looks at points in the domain)."
    ],
    "trap": "Trying a few paths like $y=x$, $y=2x$, getting $1$ each time, and concluding. Paths can only disprove; this works because the whole expression depends on $(x,y)$ only through $u=xy$.",
    "check": "Along $y=x$: $\\frac{\\sin x^2}{x^2}\\to 1$; along $y=x^2$: $\\frac{\\sin x^3}{x^3}\\to 1$, consistent with the conclusion."
  },
  "lm-rs-004": {
    "spot": "The shape $\\frac{1}{n}\\sum_{k=1}^n f\\!\\left(\\frac{k}{n}\\right)$: $\\frac{1}{n}$ is the width and $\\frac{k}{n}$ are sample points on $[0,1]$. When you see it, turn it into $\\int_0^1 f(x)\\,dx$; here $f=\\sqrt{x}$.",
    "why": "$\\sum\\sqrt{k}$ has no closed form, so summing directly goes nowhere; the Riemann sum is the only route.",
    "steps": [
      "$\\Delta x=\\frac{1}{n}$, $x_k=\\frac{k}{n}$ (right endpoints), $f(x)=\\sqrt{x}$. For example, with $n=4$ the sum is slightly above the integral ($\\sqrt{x}$ is increasing, so right endpoints overestimate).",
      "As $n\\to\\infty$: the sum $\\to\\int_0^1\\sqrt{x}\\,dx$.",
      "$\\int_0^1x^{1/2}dx=\\left[\\frac{2}{3}x^{3/2}\\right]_0^1=\\frac{2}{3}$."
    ],
    "trap": "Missing the $\\frac{1}{n}$ in front and arguing that $\\sum\\sqrt{k/n}$ has $n$ terms each up to $1$, so it diverges. The $\\frac{1}{n}$ is exactly the width; it turns the sum into an average.",
    "check": "The average height of $\\sqrt{x}$ on $[0,1]$, $\\frac{2}{3}$, lies between $0$ and $1$ and is below $\\sqrt{\\frac{1}{2}}\\approx 0.707$ (for a concave function the average is less than the midpoint value)."
  },
  "si-int-014": {
    "spot": "Two layers of $\\ln$: each $\\ln$ requires its inside to be $>0$. The outer one needs $\\ln x>0$, the inner one needs $x>0$; take the intersection.",
    "why": "Listing conditions from the outside in is least likely to miss one; the outer condition $\\ln x>0$ is stricter than the inner, so the intersection is just that.",
    "steps": [
      "The inner $\\ln x$ needs $x>0$.",
      "The outer $\\ln(\\ln x)$ needs $\\ln x>0$. $\\ln$ is increasing and $\\ln 1=0$, so $\\ln x>0\\Leftrightarrow x>1$.",
      "$x>1$ already includes $x>0$; the domain is $(1,\\infty)$, open, not including $1$."
    ],
    "trap": "Writing only the inner condition and getting $(0,\\infty)$; or writing $[1,\\infty)$ — but $\\ln(\\ln 1)=\\ln 0$ is undefined.",
    "check": "$x=e$ is in the domain: $\\ln(\\ln e)=\\ln 1=0$; $x=0.5$ is not: $\\ln 0.5<0$, so the outer $\\ln$ can't be taken."
  },
  "an-en-001": {
    "spot": "$a_n-2$ simplifies cleanly to $-\\frac{5}{n+3}$: solve the inequality $\\frac{5}{n+3}<0.01$ and take the smallest integer.",
    "why": "Once the error is a single fraction, epsilon-N is just solving one inequality; plugging in numbers is guessing, not finding the minimum.",
    "steps": [
      "$a_n-2=\\frac{2n+1-2(n+3)}{n+3}=\\frac{-5}{n+3}$, so $|a_n-2|=\\frac{5}{n+3}$.",
      "$\\frac{5}{n+3}<0.01\\Leftrightarrow n+3>500\\Leftrightarrow n>497$.",
      "At $n=497$ it equals $0.01$ exactly (not strictly less), so the smallest $N=498$; $\\frac{5}{n+3}$ is decreasing, so it keeps holding from there on."
    ],
    "trap": "Solving $n+3\\ge 500$ and answering $N=497$: the problem asks for the strict inequality $<0.01$, and $n=497$ only reaches $=0.01$.",
    "check": "$a_{498}=\\frac{997}{501}\\approx 1.99002$, which differs from $2$ by $0.00998<0.01$."
  },
  "an-int-002": {
    "spot": "Darboux upper sum: take the supremum of $f$ on each piece. $x^2$ is increasing on $[0,1]$, so each piece's maximum is at its right endpoint — the upper sum equals the right endpoint Riemann sum.",
    "why": "For a monotone function you don't have to find each $\\sup$; just take endpoints: right for increasing, left for decreasing.",
    "steps": [
      "Partition points $0,\\frac{1}{4},\\frac{1}{2},\\frac{3}{4},1$, each piece of width $\\frac{1}{4}$; $f$ is increasing, so the maxima are at the right endpoints $\\frac{1}{4},\\frac{1}{2},\\frac{3}{4},1$.",
      "Heights: $\\frac{1}{16}+\\frac{4}{16}+\\frac{9}{16}+\\frac{16}{16}=\\frac{30}{16}$.",
      "$U_4=\\frac{1}{4}\\cdot\\frac{30}{16}=\\frac{15}{32}$."
    ],
    "trap": "Using left endpoints and getting $\\frac{1}{4}\\cdot\\frac{14}{16}=\\frac{7}{32}$ — that is the lower sum.",
    "check": "The upper sum must be $\\ge$ the integral $\\frac{1}{3}$, and upper minus lower sum $=\\frac{1}{4}(f(1)-f(0))=\\frac{1}{4}$."
  },
  "an-sup-001": {
    "spot": "$1-\\frac{1}{n}$ increases with $n$, is always less than $1$, and gets arbitrarily close to $1$: the supremum is $1$, but it is not attained.",
    "why": "Proving a $\\sup$ takes two things: it is an upper bound, and no smaller upper bound exists; for an increasing sequence the $\\sup$ is its limit.",
    "steps": [
      "Every term $1-\\frac{1}{n}<1$: $1$ is an upper bound.",
      "No $1-\\varepsilon$ is an upper bound: take $n>\\frac{1}{\\varepsilon}$ and you get $1-\\frac{1}{n}>1-\\varepsilon$ (e.g. for $\\varepsilon=0.01$ take $n=101$).",
      "So $\\sup S=1$ (the limit as $n\\to\\infty$), but $1\\notin S$, and $S$ has no largest element."
    ],
    "trap": "Thinking the $\\sup$ must be the largest number in the set, and saying it doesn't exist because there is no largest element. The $\\sup$ is only the least upper bound; it need not be attained.",
    "check": "The smallest element of $S$ is $0$ (at $n=1$), and the least upper bound is $1$: every element lies in $[0,1)$."
  },
  "an-sup-006": {
    "spot": "$\\frac{n}{2^n}$: the numerator grows linearly, the denominator exponentially, so it tends to $0$ eventually; but the first few terms need not be decreasing. For the $\\sup$, look at the beginning, not the limit.",
    "why": "Check when the ratio of consecutive terms $\\frac{a_{n+1}}{a_n}=\\frac{n+1}{2n}$ is $\\le 1$; that tells you where the sequence starts decreasing, and the maximum must come before that.",
    "steps": [
      "First few terms: $a_1=\\frac{1}{2}$, $a_2=\\frac{2}{4}=\\frac{1}{2}$, $a_3=\\frac{3}{8}$.",
      "Ratio $\\frac{a_{n+1}}{a_n}=\\frac{n+1}{2n}$: equal to $1$ at $n=1$, $<1$ for $n\\ge 2$. So from $a_2$ on it decreases all the way.",
      "The maximum is $a_1=a_2=\\frac{1}{2}$, so $\\sup S=\\frac{1}{2}$, and it is attained."
    ],
    "trap": "Seeing $\\frac{n}{2^n}\\to 0$ and answering $0$. $0$ is the infimum (a limit, not attained); the supremum is at the start of the sequence.",
    "check": "Every term is $\\le\\frac{1}{2}$: at $n=4$ it is $\\frac{1}{4}$, at $n=10$ about $0.0098$."
  },
  "cx-curve-004": {
    "spot": "Numerator and denominator are both quadratic: as $x\\to\\pm\\infty$ only the leading terms $\\frac{2x^2}{x^2}$ matter, so the horizontal asymptote is the ratio of leading coefficients.",
    "why": "Long division $\\frac{2x^2+1}{x^2+3}=2-\\frac{5}{x^2+3}$ gives both the asymptote and which side the curve approaches from — an extra layer of safety over memorizing the coefficient ratio.",
    "steps": [
      "Long division: $\\frac{2x^2+1}{x^2+3}=2-\\frac{5}{x^2+3}$.",
      "As $x\\to\\pm\\infty$, $\\frac{5}{x^2+3}\\to 0$.",
      "Both one-sided limits are $2$: the horizontal asymptote is $y=2$."
    ],
    "trap": "Taking the ratio of constant terms $\\frac{1}{3}$ as the answer — that is $y(0)$, which is about $x\\to 0$, not $x\\to\\infty$.",
    "check": "The subtracted $\\frac{5}{x^2+3}$ is always positive, so the curve stays below $y=2$ and approaches it from below."
  },
  "der-025": {
    "spot": "Partial derivative with respect to $x$: treat $y$ entirely as a constant. Outer $\\ln u$, inner $u=x^2+y^2$ — one layer of Chain Rule.",
    "why": "A partial derivative is an ordinary derivative plus one rule, \"the other variables stay fixed\"; no new formulas needed.",
    "steps": [
      "Inner part in $x$: $\\frac{\\partial}{\\partial x}(x^2+y^2)=2x$ ($y^2$ is a constant and differentiates to zero).",
      "Outer: $\\frac{d}{du}\\ln u=\\frac{1}{u}$.",
      "Multiply: $\\frac{2x}{x^2+y^2}$."
    ],
    "trap": "Also differentiating $y^2$ to $2y$ and getting $\\frac{2x+2y}{x^2+y^2}$ — that treats $y$ as a function of $x$ (implicit differentiation), not a partial derivative.",
    "check": "Symmetry: $\\frac{\\partial}{\\partial y}$ should give $\\frac{2y}{x^2+y^2}$, which is exactly what you get by swapping $x,y$."
  },
  "gap-int-polar-001": {
    "spot": "$r=2$ is constant: a circle. $\\theta$ from $0$ to $\\frac{\\pi}{2}$ is a quarter circle. Polar area formula $A=\\frac{1}{2}\\int r^2\\,d\\theta$.",
    "why": "The formula comes from the sector area $\\frac{1}{2}r^2\\Delta\\theta$; here you can even check it against the quarter-circle area directly.",
    "steps": [
      "$A=\\frac{1}{2}\\int_0^{\\pi/2}r^2\\,d\\theta$, $r^2=4$.",
      "$A=\\frac{1}{2}\\cdot 4\\cdot\\frac{\\pi}{2}=\\pi$.",
      "Compare: a circle of radius $2$ has area $4\\pi$, and a quarter of that is $\\pi$."
    ],
    "trap": "Writing $\\int r\\,d\\theta=\\int_0^{\\pi/2}2\\,d\\theta$, which here also happens to give $\\pi$ — but that is arc length. With $r=3$ it shows: arc length $\\frac{3\\pi}{2}$, area $\\frac{9\\pi}{4}$.",
    "check": "Quarter circle with $r=3$: the area formula gives $\\frac{9\\pi}{4}$, matching $\\frac{1}{4}\\pi\\cdot 9$; while $\\int r\\,d\\theta$ gives $\\frac{3\\pi}{2}$, which is different."
  },
  "int-026": {
    "spot": "The region is a rectangle (all limits constant) and the integrand $xy$ is \"a function of $x$ times a function of $y$\": the double integral splits into a product of two single integrals.",
    "why": "You can integrate $y$ then $x$, but after separating, both are one-line integrals with no intermediate expression to carry.",
    "steps": [
      "Inner integral in $y$ first ($x$ constant): $\\int_0^3 xy\\,dy=\\frac{9}{2}x$.",
      "Equivalent to separating: $\\left(\\int_0^2x\\,dx\\right)\\left(\\int_0^3y\\,dy\\right)=2\\cdot\\frac{9}{2}$.",
      "$2\\cdot\\frac{9}{2}=9$."
    ],
    "trap": "Mismatching limits: $dy$ is inner, so $y$ runs $0$ to $3$ and $x$ runs $0$ to $2$. Swapping them happens to give the same result here, but with a non-symmetric integrand (e.g. $xy^2$) it would be wrong.",
    "check": "The average of $xy$ over the rectangle is $\\bar{x}\\bar{y}=1\\cdot\\frac{3}{2}$; times the area $6$ gives $9$."
  },
  "tb-mvt-003": {
    "spot": "Mean Value Theorem: find $c$ with $f'(c)$ equal to the secant slope. For $f=\\frac{1}{x}$ the derivative $-\\frac{1}{c^2}$ is easy to solve; afterward check that $c$ is in the interval.",
    "why": "Two steps by definition: compute the secant slope, then solve $f'(c)=$ slope; if you get two roots, the interval eliminates one.",
    "steps": [
      "Secant slope: $\\frac{f(4)-f(1)}{4-1}=\\frac{\\frac{1}{4}-1}{3}=-\\frac{1}{4}$.",
      "$f'(c)=-\\frac{1}{c^2}=-\\frac{1}{4}\\Rightarrow c^2=4\\Rightarrow c=\\pm 2$.",
      "Only $c=2$ is in $(1,4)$."
    ],
    "trap": "Solving $c^2=4$, writing $c=\\pm 2$ and stopping. The Mean Value Theorem's $c$ lies in the open interval $(1,4)$, so $-2$ must be discarded.",
    "check": "For $\\frac{1}{x}$ the mean value point is exactly the geometric mean of the endpoints $\\sqrt{ab}$: $\\sqrt{1\\cdot 4}=2$."
  },
  "vc-cons-002": {
    "spot": "$\\mathbf{F}=\\langle e^x\\sin y,\\ e^x\\cos y\\rangle$: the two components are clearly the partial derivatives of $e^x\\sin y$ in $x$ and $y$ — a conservative field with potential $f=e^x\\sin y$, so the line integral is just end value minus start value.",
    "why": "The problem doesn't give the path's shape — a hint that the answer is path-independent; the potential method avoids parametrizing.",
    "steps": [
      "Check it's conservative: $\\frac{\\partial P}{\\partial y}=e^x\\cos y=\\frac{\\partial Q}{\\partial x}$.",
      "Potential $f=e^x\\sin y$: $f_x=e^x\\sin y$, $f_y=e^x\\cos y$, exactly $\\mathbf{F}$.",
      "$\\int_C\\mathbf{F}\\cdot d\\mathbf{r}=f\\left(0,\\frac{\\pi}{2}\\right)-f(0,0)=1-0=1$."
    ],
    "trap": "Not noticing the field is conservative, picking a path to parametrize and dropping the $dy$ term; or writing the potential as $e^x\\cos y$ (using $Q$ as the potential).",
    "check": "Along the straight line $x=0$, $y=t$: $\\mathbf{F}\\cdot d\\mathbf{r}=e^0\\cos t\\,dt$, and $\\int_0^{\\pi/2}\\cos t\\,dt=1$."
  },
  "an-int-004": {
    "spot": "The Darboux lower sum takes the infimum on each piece; $\\frac{1}{x}$ is decreasing on $[1,2]$, so each piece's minimum is at its right endpoint.",
    "why": "For a monotone function, take endpoints directly: when decreasing, the lower sum uses right endpoints and the upper sum left endpoints; no need to find each $\\inf$.",
    "steps": [
      "Partition points $1,1.2,1.4,1.6,1.8,2$, width $\\frac{1}{5}$; $f$ is decreasing, so use right endpoints $1.2,1.4,1.6,1.8,2$.",
      "Each term is $\\frac{1}{5}\\cdot\\frac{1}{1+k/5}=\\frac{1}{5+k}$: e.g. $\\frac{1}{5}\\cdot\\frac{1}{1.2}=\\frac{1}{6}$.",
      "$L_5=\\frac{1}{6}+\\frac{1}{7}+\\frac{1}{8}+\\frac{1}{9}+\\frac{1}{10}\\approx 0.6456$."
    ],
    "trap": "Using left endpoints out of habit from increasing functions and getting $\\frac{1}{5}+\\frac{1}{6}+\\cdots+\\frac{1}{9}\\approx 0.7456$ — that is the upper sum.",
    "check": "The lower sum must be below $\\int_1^2\\frac{dx}{x}=\\ln 2\\approx 0.693$ and the upper sum above it."
  },
  "an-ls-001": {
    "spot": "$(-1)^n$ splits the sequence into two subsequences: even terms $\\frac{n}{n+1}\\to 1$, odd terms $-\\frac{n}{n+1}\\to-1$. The $\\limsup$ is the largest of the subsequential limits.",
    "why": "The whole sequence has no limit, but the even and odd parts each converge; the $\\limsup$ just compares the two subsequential limits.",
    "steps": [
      "Even terms $n=2m$: $\\frac{2m}{2m+1}\\to 1$.",
      "Odd terms $n=2m+1$: $-\\frac{2m+1}{2m+2}\\to-1$.",
      "The only subsequential limits are $1$ and $-1$; the $\\limsup$ takes the larger: $1$."
    ],
    "trap": "Saying the $\\limsup$ doesn't exist because the $\\lim$ doesn't. A bounded sequence always has a $\\limsup$.",
    "check": "Every term is $<1$, but even terms get arbitrarily close to $1$ (about $0.999$ at $n=1000$)."
  },
  "an-ls-002": {
    "spot": "$(-1)^n$ jumps between $\\pm 1$ and $\\frac{1}{n}\\to 0$ is just a small perturbation: odd terms $\\to-1$, even terms $\\to 1$. The $\\liminf$ is the smallest subsequential limit.",
    "why": "Splitting odd and even is most direct; the perturbation $\\frac{1}{n}$ doesn't change the subsequential limits, only whether they are approached from above or below.",
    "steps": [
      "Odd terms $n=2m-1$: $-1+\\frac{1}{2m-1}\\to-1$.",
      "Even terms $n=2m$: $1+\\frac{1}{2m}\\to 1$.",
      "$\\liminf=\\min\\{-1,1\\}=-1$."
    ],
    "trap": "Thinking the $\\liminf$ can't be $-1$ because $-1$ is not the value of any term (every term is greater than $-1$). The $\\liminf$ is in the sense of limits and need not be attained.",
    "check": "Every term is $>-1$, but the odd terms get arbitrarily close to $-1$."
  },
  "an-uc-002": {
    "spot": "The derivative of $\\sqrt{x}$ blows up near $0$, but the change in function values is tamed by the square root: $|\\sqrt{x}-\\sqrt{y}|\\le\\sqrt{|x-y|}$, so a single $\\delta=\\varepsilon^2$ works on the whole interval.",
    "why": "Proving the inequality directly gives a uniform $\\delta$; judging by \"bounded derivative\" fails near $0$, because that is only a sufficient condition.",
    "steps": [
      "For $x,y\\ge 0$: $(\\sqrt{x}-\\sqrt{y})^2\\le|\\sqrt{x}-\\sqrt{y}|(\\sqrt{x}+\\sqrt{y})=|x-y|$.",
      "Take square roots: $|\\sqrt{x}-\\sqrt{y}|\\le\\sqrt{|x-y|}$.",
      "Given $\\varepsilon>0$, take $\\delta=\\varepsilon^2$: $|x-y|<\\delta\\Rightarrow|\\sqrt{x}-\\sqrt{y}|<\\varepsilon$, and $\\delta$ doesn't depend on the location (e.g. $\\varepsilon=0.1$, $\\delta=0.01$ works at every $x$).",
      "So $\\sqrt{x}$ is uniformly continuous on $[0,\\infty)$."
    ],
    "trap": "Seeing that the derivative of $\\sqrt{x}$ is unbounded near $0$ and declaring it \"not uniformly continuous\". A bounded derivative is only a sufficient condition; even at the origin, where $\\sqrt{x}$ is steepest, the largest change is just $\\sqrt{\\delta}$.",
    "check": "The worst case is at the origin: at $x=0$, $y=\\delta$ the difference is $\\sqrt{\\delta}$, exactly hitting the bound; farther from the origin the difference is smaller."
  },
  "an-uf-002": {
    "spot": "$x^n$ only causes trouble near $x=1$; the interval $\\left[0,\\frac{1}{2}\\right]$ is far from $1$. For uniform convergence, check whether $\\sup|f_n-0|$ tends to $0$.",
    "why": "Uniform convergence means exactly that the $\\sup$ error $\\to 0$; $x^n$ is increasing, so the $\\sup$ is at the right endpoint — one line.",
    "steps": [
      "Pointwise limit: for $0\\le x\\le\\frac{1}{2}$, $x^n\\to 0$, so the limit function is $f=0$.",
      "$x^n$ is increasing on $\\left[0,\\frac{1}{2}\\right]$, so $\\sup|x^n-0|=\\left(\\frac{1}{2}\\right)^n$.",
      "$\\left(\\frac{1}{2}\\right)^n\\to 0$: the $\\sup$ error tends to $0$, so $x^n$ converges uniformly to $0$ on $\\left[0,\\frac{1}{2}\\right]$."
    ],
    "trap": "Remembering that \"$x^n$ is not uniformly convergent on $[0,1]$\" and carrying it over. The failure comes from $x\\to 1$ (the $\\sup$ stays near $1$); cut away the neighborhood of $1$ and the problem disappears.",
    "check": "Compare $[0,1)$: take $x=1-\\frac{1}{n}$, then $x^n\\to\\frac{1}{e}$, so the $\\sup$ does not tend to $0$; on $\\left[0,\\frac{1}{2}\\right]$ no such points exist."
  },
  "gap-der-param-005": {
    "spot": "Speed = length of the velocity vector $\\left(\\frac{dx}{dt},\\frac{dy}{dt}\\right)$. $x=3t$, $y=4t$ is uniform straight-line motion with velocity $(3,4)$ — a 3-4-5 right triangle.",
    "why": "The problem already gives the formula; you just compute the two derivatives and plug them in.",
    "steps": [
      "$\\frac{dx}{dt}=3$, $\\frac{dy}{dt}=4$.",
      "Sum of squares: $9+16=25$.",
      "Square root: speed $=\\sqrt{25}=5$."
    ],
    "trap": "Adding the components to get $7$, or forgetting the square root and answering $25$.",
    "check": "From $t=0$ to $t=1$ it moves from $(0,0)$ to $(3,4)$, a distance of $5$ in one unit of time: speed $5$."
  },
  "lb-con-004": {
    "spot": "Only the integral of the single function $f_3$ is asked: $f_3(x)=3xe^{-3x^2}$ is continuous, so its Lebesgue integral is the ordinary Riemann integral. $x^2$ in the exponent with $x$ in front — substitute $u=3x^2$.",
    "why": "Don't be scared by $d\\mu$: for a continuous function on a closed interval the two integrals agree, so use the Fundamental Theorem of Calculus.",
    "steps": [
      "$f_3(x)=3xe^{-3x^2}$. Let $u=3x^2$, $du=6x\\,dx$, so $3x\\,dx=\\frac{du}{2}$.",
      "$\\int_0^1 3xe^{-3x^2}dx=\\left[-\\frac{1}{2}e^{-3x^2}\\right]_0^1=-\\frac{1}{2}e^{-3}+\\frac{1}{2}$.",
      "Answer: $\\frac{1-e^{-3}}{2}\\approx 0.4751$."
    ],
    "trap": "Dropping the $\\frac{1}{2}$ in the substitution ($du=6x\\,dx$, not $3x\\,dx$) and getting $1-e^{-3}$.",
    "check": "In general $\\int_0^1 f_n=\\frac{1-e^{-n}}{2}$; at $n=3$ this is slightly below the limit $\\frac{1}{2}$."
  },
  "lb-con-006": {
    "spot": "The problem says explicitly that \"the sequence is increasing\", and $f_n\\ge 0$: all the conditions of the Monotone Convergence Theorem are met, so the limit can move inside the integral.",
    "why": "The Monotone Convergence Theorem only needs increasing and nonnegative, not uniform convergence; here you can also compute $\\int_0^1x^{1/n}dx=\\frac{n}{n+1}$ directly to compare.",
    "steps": [
      "Pointwise limit: for $x\\in(0,1]$, $x^{1/n}\\to 1$; at $x=0$ it is $0$, but a single point has measure $0$.",
      "Increasing: for $0<x<1$, $x^{1/(n+1)}>x^{1/n}$.",
      "Monotone Convergence Theorem: $\\lim\\int_0^1 f_n\\,d\\mu=\\int_0^1 1\\,d\\mu=1$.",
      "Direct check: $\\int_0^1x^{1/n}dx=\\frac{n}{n+1}\\to 1$."
    ],
    "trap": "Seeing the limit function jump at $x=0$ ($0$ versus $1$), concluding the convergence isn't uniform, and therefore that limit and integral can't be swapped. The Monotone Convergence Theorem doesn't need uniform convergence at all.",
    "check": "Each $\\int f_n=\\frac{n}{n+1}<1$, increasing toward $1$ from below, consistent with an increasing sequence."
  }
};
