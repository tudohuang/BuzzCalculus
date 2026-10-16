// Detail v2, English — batch 048. Translation of tools/content/detail/048.js (text only; claims live in the Chinese file).
module.exports = {
  "ser-018": {
    "spot": "The absolute value of the general term $\\frac{(-1)^n}{n^2}$ is $\\frac{1}{n^2}$, which is exactly the $p$-series with $p=2$.",
    "why": "Try absolute convergence first: once the series of absolute values converges you get the strongest conclusion right away, while the Alternating Series Test only gives the weaker \"converges\".",
    "steps": [
      "Take absolute values: $\\left|\\frac{(-1)^n}{n^2}\\right|=\\frac{1}{n^2}$.",
      "$\\sum\\frac{1}{n^2}$ is a $p$-series with $p=2>1$, so it converges (its sum is $\\frac{\\pi^2}{6}$).",
      "The original series of course converges too, with sum $-\\frac{\\pi^2}{12}$; but the question asks how it converges.",
      "The series of absolute values converges, so the original series converges absolutely."
    ],
    "trap": "Seeing $(-1)^n$ and jumping straight to the Alternating Series Test, answering \"conditionally convergent\". That test only says it converges; whether it is \"absolute\" depends on $\\sum\\frac{1}{n^2}$.",
    "check": "The sum of absolute values $\\frac{\\pi^2}{6}\\approx1.645$ is finite, so absolute convergence holds."
  },
  "si-int-004": {
    "spot": "$\\sum\\frac{x^n}{n}$ is a power series with coefficients $\\frac{1}{n}$: the Ratio Test gives the radius, and the two endpoints $x=\\pm1$ turn into the harmonic series and the alternating harmonic series.",
    "why": "The Ratio Test only covers the open interval; at the endpoints the ratio limit is exactly $1$ and tells you nothing, so you must plug them in and test each one.",
    "steps": [
      "Ratio: $\\left|\\frac{x^{n+1}/(n+1)}{x^n/n}\\right|=|x|\\cdot\\frac{n}{n+1}\\to|x|$, so the radius of convergence is $R=1$.",
      "$x=1$: the series becomes $\\sum\\frac{1}{n}$, the harmonic series, which diverges; its partial sums keep growing like $\\ln n$.",
      "$x=-1$: the series becomes $\\sum\\frac{(-1)^n}{n}$, the alternating harmonic series; the terms decrease to $0$, and it converges to $-\\ln 2$.",
      "Left endpoint included, right endpoint excluded: the interval of convergence is $[-1,1)$."
    ],
    "trap": "Computing only the radius and writing $(-1,1)$, or treating both ends the same and writing $[-1,1]$; in fact $x=1$ gives the harmonic series, which diverges.",
    "check": "Inside the interval the series equals $-\\ln(1-x)$: at $x=-1$ it gives the finite value $-\\ln 2$, and as $x\\to1^-$ it blows up to infinity, consistent with the endpoint results."
  },
  "si-set-001": {
    "spot": "$f(x)=x^3-3x$ is a polynomial, differentiable everywhere, so critical points can only come from $f'(x)=0$.",
    "why": "A polynomial has no points where the derivative fails to exist, so you only need to solve the single equation $f'(x)=0$.",
    "steps": [
      "$f'(x)=3x^2-3$.",
      "$3x^2-3=3(x-1)(x+1)=0$, giving $x=1$ or $x=-1$.",
      "Write both: the set of critical points is $\\{-1,1\\}$."
    ],
    "trap": "Solving $x^2=1$ and writing only $x=1$, missing the negative root $x=-1$.",
    "check": "$f(-1)=2$ is a local max and $f(1)=-2$ is a local min, so both points really are turning points. Makes sense."
  },
  "tmpl-der-prod-xexp-001": {
    "spot": "$x^2$ times $e^{3x}$: a product of two factors, so use the Product Rule; the derivative of $e^{3x}$ picks up an extra $3$ from the Chain Rule.",
    "why": "Each term of the Product Rule is easy, and factoring out $e^{3x}$ at the end keeps it tidy; no need to expand into another form.",
    "steps": [
      "$(x^2)'=2x$.",
      "$(e^{3x})'=3e^{3x}$ (the Chain Rule brings out the inner $3$).",
      "Product Rule: $2x\\,e^{3x}+x^2\\cdot3e^{3x}=(2x+3x^2)e^{3x}$."
    ],
    "trap": "Forgetting the Chain Rule and writing $(e^{3x})'$ as $e^{3x}$, which gives $(2x+x^2)e^{3x}$.",
    "check": "Plug in $x=0$: both terms contain $x$, so the derivative should be $0$."
  },
  "tmpl-der-prod-xexp-002": {
    "spot": "$x^3$ times $e^{2x}$: a product of two factors, so use the Product Rule; the derivative of $e^{2x}$ picks up an extra $2$ from the Chain Rule.",
    "why": "Each term of the Product Rule is easy, and factoring out $e^{2x}$ at the end keeps it tidy; no need to expand into another form.",
    "steps": [
      "$(x^3)'=3x^2$.",
      "$(e^{2x})'=2e^{2x}$ (the Chain Rule brings out the inner $2$).",
      "Product Rule: $3x^2e^{2x}+x^3\\cdot2e^{2x}=(3x^2+2x^3)e^{2x}$."
    ],
    "trap": "Forgetting the Chain Rule and writing $(e^{2x})'$ as $e^{2x}$, which gives $(3x^2+x^3)e^{2x}$.",
    "check": "At $x=1$: $(3+2)e^2=5e^2\\approx36.9$."
  },
  "tmpl-der-prod-xexp-003": {
    "spot": "$x^4$ times $e^{5x}$: a product of two factors, so use the Product Rule; the derivative of $e^{5x}$ picks up an extra $5$ from the Chain Rule.",
    "why": "Each term of the Product Rule is easy, and factoring out $e^{5x}$ at the end keeps it tidy; no need to expand into another form.",
    "steps": [
      "$(x^4)'=4x^3$.",
      "$(e^{5x})'=5e^{5x}$ (the Chain Rule brings out the inner $5$).",
      "Product Rule: $4x^3e^{5x}+x^4\\cdot5e^{5x}=(4x^3+5x^4)e^{5x}$."
    ],
    "trap": "Forgetting the Chain Rule and writing $(e^{5x})'$ as $e^{5x}$, which gives $(4x^3+x^4)e^{5x}$.",
    "check": "At $x=1$: $(4+5)e^5=9e^5$."
  },
  "tmpl-der-prod-xexp-004": {
    "spot": "$x^2$ times $e^{7x}$: a product of two factors, so use the Product Rule; the derivative of $e^{7x}$ picks up an extra $7$ from the Chain Rule.",
    "why": "Each term of the Product Rule is easy, and factoring out $e^{7x}$ at the end keeps it tidy; no need to expand into another form.",
    "steps": [
      "$(x^2)'=2x$.",
      "$(e^{7x})'=7e^{7x}$ (the Chain Rule brings out the inner $7$).",
      "Product Rule: $2x\\,e^{7x}+x^2\\cdot7e^{7x}=(2x+7x^2)e^{7x}$."
    ],
    "trap": "Forgetting the Chain Rule and writing $(e^{7x})'$ as $e^{7x}$, which gives $(2x+x^2)e^{7x}$.",
    "check": "Plug in $x=0$: both terms contain $x$, so the derivative should be $0$."
  },
  "tmpl-der-prod-xexp-005": {
    "spot": "$x^5$ times $e^{3x}$: a product of two factors, so use the Product Rule; the derivative of $e^{3x}$ picks up an extra $3$ from the Chain Rule.",
    "why": "Each term of the Product Rule is easy, and factoring out $e^{3x}$ at the end keeps it tidy; no need to expand into another form.",
    "steps": [
      "$(x^5)'=5x^4$.",
      "$(e^{3x})'=3e^{3x}$ (the Chain Rule brings out the inner $3$).",
      "Product Rule: $5x^4e^{3x}+x^5\\cdot3e^{3x}=(5x^4+3x^5)e^{3x}$."
    ],
    "trap": "Forgetting the Chain Rule and writing $(e^{3x})'$ as $e^{3x}$, which gives $(5x^4+x^5)e^{3x}$.",
    "check": "At $x=1$: $(5+3)e^3=8e^3$."
  },
  "tmpl-lim-trig-001": {
    "spot": "As $x\\to0$ the numerator is $\\sin(3x)$ and the denominator is $2x$: build the standard form $\\frac{\\sin(3x)}{3x}\\to1$.",
    "why": "Rewriting as $\\frac{\\sin u}{u}$ finishes it in one line, more directly than L'Hôpital's Rule, and shows the answer is just the coefficient ratio $\\frac{3}{2}$.",
    "steps": [
      "Rewrite: $\\frac{\\sin(3x)}{2x}=\\frac{\\sin(3x)}{3x}\\cdot\\frac{3}{2}$.",
      "As $x\\to0$, $u=3x\\to0$, so $\\frac{\\sin u}{u}\\to1$.",
      "So the limit is $1\\cdot\\frac{3}{2}=\\frac{3}{2}$."
    ],
    "trap": "Thinking $\\sin(3x)$ and $x$ cancel directly to give $\\frac{\\sin 3}{2}$, or flipping the coefficient ratio and answering $\\frac{2}{3}$.",
    "check": "For small angles $\\sin(3x)\\approx3x$; plugging in $x=0.001$ should give something very close to $1.5$."
  },
  "tmpl-lim-trig-002": {
    "spot": "As $x\\to0$ the numerator is $\\sin(5x)$ and the denominator is $4x$: build the standard form $\\frac{\\sin(5x)}{5x}\\to1$.",
    "why": "Rewriting as $\\frac{\\sin u}{u}$ finishes it in one line, more directly than L'Hôpital's Rule, and shows the answer is just the coefficient ratio $\\frac{5}{4}$.",
    "steps": [
      "Rewrite: $\\frac{\\sin(5x)}{4x}=\\frac{\\sin(5x)}{5x}\\cdot\\frac{5}{4}$.",
      "As $x\\to0$, $u=5x\\to0$, so $\\frac{\\sin u}{u}\\to1$.",
      "So the limit is $1\\cdot\\frac{5}{4}=\\frac{5}{4}$."
    ],
    "trap": "Thinking $\\sin(5x)$ and $x$ cancel directly to give $\\frac{\\sin 5}{4}$, or flipping the coefficient ratio and answering $\\frac{4}{5}$.",
    "check": "For small angles $\\sin(5x)\\approx5x$; plugging in $x=0.001$ should give something very close to $1.25$."
  },
  "tmpl-lim-trig-003": {
    "spot": "As $x\\to0$ the numerator is $\\sin(7x)$ and the denominator is $3x$: build the standard form $\\frac{\\sin(7x)}{7x}\\to1$.",
    "why": "Rewriting as $\\frac{\\sin u}{u}$ finishes it in one line, more directly than L'Hôpital's Rule, and shows the answer is just the coefficient ratio $\\frac{7}{3}$.",
    "steps": [
      "Rewrite: $\\frac{\\sin(7x)}{3x}=\\frac{\\sin(7x)}{7x}\\cdot\\frac{7}{3}$.",
      "As $x\\to0$, $u=7x\\to0$, so $\\frac{\\sin u}{u}\\to1$.",
      "So the limit is $1\\cdot\\frac{7}{3}=\\frac{7}{3}$."
    ],
    "trap": "Thinking $\\sin(7x)$ and $x$ cancel directly to give $\\frac{\\sin 7}{3}$, or flipping the coefficient ratio and answering $\\frac{3}{7}$.",
    "check": "For small angles $\\sin(7x)\\approx7x$; plugging in $x=0.001$ should give something very close to $2.333$."
  },
  "tmpl-lim-trig-004": {
    "spot": "As $x\\to0$ the numerator is $\\sin(2x)$ and the denominator is $9x$: build the standard form $\\frac{\\sin(2x)}{2x}\\to1$.",
    "why": "Rewriting as $\\frac{\\sin u}{u}$ finishes it in one line, more directly than L'Hôpital's Rule, and shows the answer is just the coefficient ratio $\\frac{2}{9}$.",
    "steps": [
      "Rewrite: $\\frac{\\sin(2x)}{9x}=\\frac{\\sin(2x)}{2x}\\cdot\\frac{2}{9}$.",
      "As $x\\to0$, $u=2x\\to0$, so $\\frac{\\sin u}{u}\\to1$.",
      "So the limit is $1\\cdot\\frac{2}{9}=\\frac{2}{9}$."
    ],
    "trap": "Thinking $\\sin(2x)$ and $x$ cancel directly to give $\\frac{\\sin 2}{9}$, or flipping the coefficient ratio and answering $\\frac{9}{2}$.",
    "check": "For small angles $\\sin(2x)\\approx2x$; plugging in $x=0.001$ should give something very close to $0.2222$."
  },
  "tmpl-lim-trig-005": {
    "spot": "As $x\\to0$ the numerator is $\\sin(6x)$ and the denominator is $5x$: build the standard form $\\frac{\\sin(6x)}{6x}\\to1$.",
    "why": "Rewriting as $\\frac{\\sin u}{u}$ finishes it in one line, more directly than L'Hôpital's Rule, and shows the answer is just the coefficient ratio $\\frac{6}{5}$.",
    "steps": [
      "Rewrite: $\\frac{\\sin(6x)}{5x}=\\frac{\\sin(6x)}{6x}\\cdot\\frac{6}{5}$.",
      "As $x\\to0$, $u=6x\\to0$, so $\\frac{\\sin u}{u}\\to1$.",
      "So the limit is $1\\cdot\\frac{6}{5}=\\frac{6}{5}$."
    ],
    "trap": "Thinking $\\sin(6x)$ and $x$ cancel directly to give $\\frac{\\sin 6}{5}$, or flipping the coefficient ratio and answering $\\frac{5}{6}$.",
    "check": "For small angles $\\sin(6x)\\approx6x$; plugging in $x=0.001$ should give something very close to $1.2$."
  },
  "cl-der-011": {
    "spot": "The angle between two curves is the angle between their tangent lines at the intersection: $y=x^2$ has slope $2$ at $(1,1)$, and the upper branch of $x=y^2$ is $y=\\sqrt{x}$ with slope $\\frac{1}{2}$.",
    "why": "With both slopes in hand, $\\tan\\theta=\\left|\\frac{m_1-m_2}{1+m_1m_2}\\right|$ gives the acute angle in one step, one detour shorter than a dot product followed by an inverse cosine.",
    "steps": [
      "$y=x^2$: $y'=2x$, so at $x=1$ the slope is $m_1=2$.",
      "The branch of $x=y^2$ through $(1,1)$ is $y=\\sqrt{x}$: $y'=\\frac{1}{2\\sqrt{x}}$, slope $m_2=\\frac{1}{2}$.",
      "$\\tan\\theta=\\left|\\frac{2-\\frac{1}{2}}{1+2\\cdot\\frac{1}{2}}\\right|=\\frac{3/2}{2}=\\frac{3}{4}$.",
      "Acute angle $\\theta=\\arctan\\frac{3}{4}\\approx0.6435$ radians."
    ],
    "trap": "Forgetting that the denominator is $1+m_1m_2$, or subtracting inclination angles but using the wrong line, e.g. getting only $\\arctan2\\approx1.107$.",
    "check": "The inclination angles are $\\arctan2$ and $\\arctan\\frac12$; their difference should be the angle between the curves."
  },
  "cl-der-015": {
    "spot": "$f$ is piecewise, with its value at $x=0$ given separately, and the formula for $x\\neq0$ makes no sense at $0$: $f'(0)$ can only be found from the definition of the derivative.",
    "why": "If you first differentiate for $x\\neq0$ and then let $x\\to0$, you hit $\\cos\\frac1x$, which has no limit. That only shows $f'$ is discontinuous, not that $f'(0)$ fails to exist.",
    "steps": [
      "Definition: $f'(0)=\\lim_{h\\to0}\\frac{f(h)-f(0)}{h}=\\lim_{h\\to0}\\frac{h^2\\sin\\frac1h}{h}=\\lim_{h\\to0}h\\sin\\frac1h$.",
      "Squeeze Theorem: $\\left|h\\sin\\frac1h\\right|\\le|h|$, and both bounds $\\pm|h|$ go to $0$.",
      "For example, at $h=0.001$ the absolute value of the difference quotient is at most $0.001$.",
      "So $f'(0)=0$."
    ],
    "trap": "Computing $f'(x)=2x\\sin\\frac1x-\\cos\\frac1x$ first, letting $x\\to0$, seeing $\\cos\\frac1x$ oscillate, and declaring that $f'(0)$ does not exist.",
    "check": "$f$ is trapped between $\\pm x^2$, and both $\\pm x^2$ have horizontal tangent lines at $0$, so the tangent slope of $f$ at $0$ can only be $0$."
  },
  "cl-der-019": {
    "spot": "A family of lines $y=cx-c^2$ with parameter $c$: the envelope must satisfy both $F=0$ and $\\frac{\\partial F}{\\partial c}=0$.",
    "why": "Setting the partial derivative with respect to the parameter to zero is exactly \"the intersection of neighboring lines\"; eliminating $c$ gives the envelope directly, with no need to draw a pile of lines and trace the outline.",
    "steps": [
      "Differentiate with respect to $c$: $\\frac{\\partial}{\\partial c}(cx-c^2)=x-2c=0$, so $c=\\frac{x}{2}$.",
      "Substitute back: $y=\\frac{x}{2}\\cdot x-\\frac{x^2}{4}=\\frac{x^2}{4}$, so the envelope is the parabola $y=\\frac{x^2}{4}$.",
      "At $x=3$, $c=\\frac{3}{2}$ and $y=\\frac{9}{4}$."
    ],
    "trap": "Treating $c$ as a fixed number and plugging in an arbitrary line (e.g. $c=1$ gives $y=2$); that is just one line of the family, not the envelope.",
    "check": "The envelope's tangent slope at $x=3$ is $\\frac{x}{2}=\\frac32$, exactly the slope of the line with $c=\\frac32$, so they are tangent."
  },
  "cl-der-024": {
    "spot": "$e^x\\ge kx$ must hold for all $x$: the largest $k$ corresponds to the line $y=kx$ just touching $y=e^x$, with the tangent line passing through the origin.",
    "why": "Read the inequality as \"a convex function lies above all its tangent lines\" and just find the tangent through the origin; separating variables into $\\frac{e^x}{x}$ forces you to handle positive and negative sides separately.",
    "steps": [
      "The tangent to $y=e^x$ at $x=a$ is $y=e^a+e^a(x-a)$; passing through the origin needs $e^a(1-a)=0$, so $a=1$ and the slope is $e$.",
      "With $k=e$, $g(x)=e^x-ex$ has minimum value $0$ at $x=1$ ($g'(1)=0$, $g''>0$), so $e^x\\ge ex$ holds everywhere.",
      "Make $k$ a bit larger, say $k=3$: at $x=1$ we get $e^1<3$, and the inequality breaks.",
      "$k<0$ fails too (as $x\\to-\\infty$, $kx\\to\\infty$); so the largest value is $k=e$."
    ],
    "trap": "Thinking that since $e^x>0$ any $k$ works, or checking only the single point $x=0$; some also put the point of tangency at $x=0$ and answer $k=1$.",
    "check": "Try another point: at $x=2$, $e^2\\approx7.39\\ge2e\\approx5.44$."
  },
  "cl-int-011": {
    "spot": "The denominator $x+\\sqrt{x^2+1}$ times $\\sqrt{x^2+1}-x$ is exactly $1$: after rationalizing, the integrand becomes $\\sqrt{x^2+1}-x$.",
    "why": "Rationalizing turns the fraction into a subtraction in one step, leaving $\\int\\sqrt{x^2+1}\\,dx$, a standard integral with a known formula; substituting directly is messier.",
    "steps": [
      "$\\frac{1}{x+\\sqrt{x^2+1}}=\\sqrt{x^2+1}-x$ (because $(x^2+1)-x^2=1$).",
      "$\\int\\sqrt{x^2+1}\\,dx=\\frac{1}{2}\\left(x\\sqrt{x^2+1}+\\ln\\left(x+\\sqrt{x^2+1}\\right)\\right)+C$.",
      "From $0$ to $1$: $\\frac{1}{2}\\left(\\sqrt2+\\ln(1+\\sqrt2)\\right)$.",
      "Subtract $\\int_0^1x\\,dx=\\frac12$: the answer is $\\frac{\\sqrt2+\\ln(1+\\sqrt2)}{2}-\\frac12\\approx0.648$."
    ],
    "trap": "Dropping the $\\ln$ term from $\\int\\sqrt{x^2+1}\\,dx$, or forgetting to subtract $\\frac12$, which gives $\\approx1.148$.",
    "check": "The integrand decreases from $1$ to $\\frac{1}{1+\\sqrt2}\\approx0.414$, so the integral should lie between the two."
  },
  "cl-int-012": {
    "spot": "Both $\\sqrt{x}=x^{1/2}$ and $\\sqrt[4]{x}=x^{1/4}$ appear: let $u=x^{1/4}$ and both roots disappear at once.",
    "why": "Substituting with the least common multiple $4$ of the root indices turns the integrand straight into a rational function; substituting only for $\\sqrt{x}$ still leaves a root.",
    "steps": [
      "Let $x=u^4$, $dx=4u^3\\,du$, $\\sqrt{x}=u^2$; as $x$ goes from $0$ to $1$, $u$ also goes from $0$ to $1$.",
      "The integral becomes $\\int_0^1\\frac{4u^3}{u^2(1+u)}\\,du=4\\int_0^1\\frac{u}{1+u}\\,du$.",
      "$\\frac{u}{1+u}=1-\\frac{1}{1+u}$, which integrates to $1-\\ln2$.",
      "So the answer is $4(1-\\ln2)\\approx1.227$."
    ],
    "trap": "Dropping the $4$ in $dx=4u^3\\,du$ and answering $1-\\ln2\\approx0.307$.",
    "check": "The integrand is at most $\\frac{1}{\\sqrt x}$, and $\\int_0^1\\frac{dx}{\\sqrt x}=2$; it is also at least $\\frac{1}{2\\sqrt x}$, so the integral is at least $1$."
  },
  "cl-int-013": {
    "spot": "$x^3=x^2\\cdot x$, and $x\\,dx$ is exactly half the derivative of $1+x^2$: let $u=1+x^2$ and write the leftover $x^2$ as $u-1$.",
    "why": "Splitting off $x\\,dx$ for the substitution turns the whole integral into a sum of powers of $u$; integration by parts also works but takes two rounds.",
    "steps": [
      "Let $u=1+x^2$, so $x\\,dx=\\frac{du}{2}$ and $x^2=u-1$; $x:0\\to1$ corresponds to $u:1\\to2$.",
      "The integral becomes $\\frac12\\int_1^2(u-1)u^{1/3}\\,du=\\frac12\\int_1^2\\left(u^{4/3}-u^{1/3}\\right)du$.",
      "Antiderivative: $\\frac12\\left(\\frac37u^{7/3}-\\frac34u^{4/3}\\right)$.",
      "Evaluate at $u=2$ and $u=1$ and subtract: $\\frac12\\left(2^{4/3}\\cdot\\frac{3}{28}+\\frac{9}{28}\\right)=\\frac{3\\sqrt[3]{2}}{28}+\\frac{9}{56}$."
    ],
    "trap": "Forgetting to replace $x^2$ with $u-1$ and treating all of $x^3\\,dx$ as $\\frac{du}{2}$, which loses a factor.",
    "check": "The integrand lies between $x^3$ and $\\sqrt[3]{2}\\,x^3$, so the integral should be between $\\frac14$ and $\\frac{\\sqrt[3]2}{4}\\approx0.315$."
  },
  "cl-int-014": {
    "spot": "The denominator is $3+5\\cos x$, a constant plus a linear expression in $\\cos x$: the classic case for the half-angle substitution $t=\\tan\\frac{x}{2}$, which turns it into a rational function.",
    "why": "The half-angle substitution turns both $\\cos x$ and $dx$ into rational expressions in $t$; for denominators of the form \"constant plus linear trig term\" there is no more direct route.",
    "steps": [
      "$t=\\tan\\frac x2$: $\\cos x=\\frac{1-t^2}{1+t^2}$, $dx=\\frac{2\\,dt}{1+t^2}$; $x:0\\to\\frac\\pi2$ corresponds to $t:0\\to1$.",
      "$3+5\\cos x=\\frac{8-2t^2}{1+t^2}$, so the integral becomes $\\int_0^1\\frac{2\\,dt}{8-2t^2}=\\int_0^1\\frac{dt}{4-t^2}$.",
      "$\\frac{1}{4-t^2}=\\frac14\\left(\\frac{1}{2-t}+\\frac{1}{2+t}\\right)$, with antiderivative $\\frac14\\ln\\frac{2+t}{2-t}$.",
      "At $t=1$: $\\frac14\\ln3\\approx0.275$."
    ],
    "trap": "Getting the coefficients of the denominator $8-2t^2$ wrong (e.g. not multiplying out $3(1+t^2)$), or writing the $\\frac14$ in the partial fractions as $\\frac12$ and answering $\\frac{\\ln3}{2}$.",
    "check": "On $[0,\\frac\\pi2]$ the denominator drops from $8$ to $3$, so the integral should be between $\\frac{\\pi}{16}$ and $\\frac{\\pi}{6}$."
  },
  "cl-int-015": {
    "spot": "The denominator is $4+5\\sin x$, a constant plus a linear expression in $\\sin x$: use the half-angle substitution $t=\\tan\\frac{x}{2}$ to get a rational function.",
    "why": "The half-angle substitution turns both $\\sin x$ and $dx$ into rational expressions in $t$; after that it is ordinary partial fractions.",
    "steps": [
      "$t=\\tan\\frac x2$: $\\sin x=\\frac{2t}{1+t^2}$, $dx=\\frac{2\\,dt}{1+t^2}$; $x:0\\to\\frac\\pi2$ corresponds to $t:0\\to1$.",
      "$4+5\\sin x=\\frac{4t^2+10t+4}{1+t^2}$, so the integral becomes $\\int_0^1\\frac{dt}{2t^2+5t+2}=\\int_0^1\\frac{dt}{(2t+1)(t+2)}$.",
      "Partial fractions: $\\frac{1}{(2t+1)(t+2)}=\\frac13\\left(\\frac{2}{2t+1}-\\frac{1}{t+2}\\right)$, with antiderivative $\\frac13\\ln\\frac{2t+1}{t+2}$.",
      "At $t=1$ we get $\\frac13\\ln1=0$, at $t=0$ we get $\\frac13\\ln\\frac12$; the difference is $\\frac{\\ln2}{3}\\approx0.231$."
    ],
    "trap": "Dropping the numerator $2$ in $\\frac{2}{2t+1}$, or forgetting to subtract the lower-limit term $\\ln\\frac12$ at $t=0$.",
    "check": "On $[0,\\frac\\pi2]$ the denominator rises from $4$ to $9$, so the integral should be between $\\frac{\\pi}{18}$ and $\\frac{\\pi}{8}$."
  },
  "cl-int-016": {
    "spot": "$x^n$ times $e^x$: integration by parts lowers the power of $x^n$ by one while $e^x$ stays the same, which naturally produces a recursion between $I_n$ and $I_{n-1}$.",
    "why": "Running the recursion up from $I_0$ takes only four subtractions, and is less error-prone than doing four rounds of integration by parts on $x^4e^x$ directly.",
    "steps": [
      "$u=x^n$, $dv=e^x\\,dx$: $I_n=\\Big[x^ne^x\\Big]_0^1-n\\int_0^1x^{n-1}e^x\\,dx=e-nI_{n-1}$ (for $n\\ge1$).",
      "$I_0=\\int_0^1e^x\\,dx=e-1$, $I_1=e-(e-1)=1$.",
      "$I_2=e-2\\cdot1=e-2$, $I_3=e-3(e-2)=6-2e$.",
      "$I_4=e-4(6-2e)=9e-24\\approx0.4645$."
    ],
    "trap": "Getting the sign of the recursion backwards as $I_n=e+nI_{n-1}$, or evaluating the boundary term $\\Big[x^ne^x\\Big]_0^1$ as $e-1$.",
    "check": "On $[0,1]$ the integrand lies between $x^4$ and $e\\,x^4$, so the integral should be between $\\frac15$ and $\\frac e5\\approx0.544$."
  },
  "cl-int-017": {
    "spot": "The problem says not to compute the integral: $\\frac{\\sin x}{x}$ is decreasing on $(0,\\frac\\pi2]$, falling from $1$ to $\\frac2\\pi$, so bound it by max and min times the interval length.",
    "why": "$\\frac{\\sin x}{x}$ has no elementary antiderivative, so the estimate $m(b-a)\\le\\int f\\le M(b-a)$ is the only way.",
    "steps": [
      "$\\left(\\frac{\\sin x}{x}\\right)'=\\frac{x\\cos x-\\sin x}{x^2}<0$ (because $\\tan x>x$), so the function is decreasing.",
      "The maximum approaches $1$ (as $x\\to0^+$), and the minimum is $\\frac{2}{\\pi}$ (at $x=\\frac\\pi2$).",
      "Multiply by the interval length $\\frac\\pi2$: $\\frac2\\pi\\cdot\\frac\\pi2=1<I<1\\cdot\\frac\\pi2$; the function is not constant, so the inequalities are strict.",
      "So $1<I<\\frac{\\pi}{2}$."
    ],
    "trap": "Taking the minimum as $\\sin\\frac\\pi2=1$ (forgetting to divide by $x$), which gives a wrong range like $\\frac\\pi2<I$.",
    "check": "The actual value is $I\\approx1.371$, which indeed lies between $1$ and $\\frac\\pi2\\approx1.571$."
  },
  "cl-int-019": {
    "spot": "An inverted triangular gate with its base along the water surface: the width of each horizontal strip at depth $y$ shrinks linearly with $y$, while the pressure $\\rho g\\,y$ grows with depth, so an integral is needed to multiply the two.",
    "why": "Pressure changes with depth, so you cannot multiply the area by a single depth; slice into horizontal strips, each with constant pressure, and add them up as an integral.",
    "steps": [
      "Depth $y$ runs from $0$ (surface) to $3$ (vertex); similar triangles give the width $w(y)=4\\cdot\\frac{3-y}{3}$.",
      "The force on a strip is $dF=\\rho g\\cdot y\\cdot w(y)\\,dy$, so $F=9800\\int_0^3y\\cdot\\frac{4(3-y)}{3}\\,dy$.",
      "$\\int_0^3\\frac43(3y-y^2)\\,dy=\\frac43\\left(\\frac{27}{2}-9\\right)=6$, so $F=9800\\times6=58800$ newtons."
    ],
    "trap": "Using the width for an upright triangle ($w=\\frac{4y}{3}$, vertex on top), which gives $9800\\times12=117600$.",
    "check": "Using the centroid: area $6$, centroid depth $1$ (one third of the height from the base), $F=9800\\times1\\times6$, the same."
  },
  "cl-int-020": {
    "spot": "The region lies between $y=x$ (top) and $y=x^2$ (bottom) for $x\\in[0,1]$: the centroid is $\\bar y=\\frac{1}{A}\\int\\frac{f^2-g^2}{2}\\,dx$.",
    "why": "With vertical strips, each strip's midpoint height is $\\frac{f+g}{2}$, and times its length $f-g$ that is exactly $\\frac{f^2-g^2}{2}$; no need to switch to integrating in $y$.",
    "steps": [
      "Intersections at $x=0,1$; area $A=\\int_0^1(x-x^2)\\,dx=\\frac16$.",
      "Moment $M_x=\\int_0^1\\frac{x^2-x^4}{2}\\,dx=\\frac12\\left(\\frac13-\\frac15\\right)=\\frac{1}{15}$.",
      "$\\bar y=\\frac{M_x}{A}=\\frac{1/15}{1/6}=\\frac25$."
    ],
    "trap": "Writing the moment as $\\int(x-x^2)^2/2$ or forgetting the $\\frac12$, which gives a value like $\\frac45$ that lies outside the region.",
    "check": "The region sits in $y\\in[0,1]$, and at $\\bar x=\\frac12$ the bounds are $\\frac14$ and $\\frac12$; $\\bar y=0.4$ falls inside."
  },
  "cl-int-021": {
    "spot": "A triangle rotated about the $y$-axis, with boundaries easiest to write as functions of $x$: the base is $x\\in[1,3]$ and the top edge is the hypotenuse $y=3-x$, so use cylindrical shells.",
    "why": "Shells take a single integral; washers require writing $x$ as a function of $y$ and subtracting the hollow of inner radius $1$, which is more roundabout.",
    "steps": [
      "The hypotenuse passes through $(3,0)$ and $(1,2)$: $y=3-x$; at $x$ the triangle has height $3-x$.",
      "Shells: $V=2\\pi\\int_1^3x(3-x)\\,dx$.",
      "$V=2\\pi\\cdot\\frac{10}{3}=\\frac{20\\pi}{3}$."
    ],
    "trap": "Writing the shell radius as $x-1$ (as if rotating about $x=1$), which gives $2\\pi\\cdot\\frac43=\\frac{8\\pi}{3}$.",
    "check": "Pappus's theorem: area $2$, centroid $\\bar x=\\frac{1+3+1}{3}=\\frac53$, so $V=2\\pi\\cdot\\frac53\\cdot2$."
  },
  "cl-int-022": {
    "spot": "The right side $\\frac{y^2+xy}{x^2}=\\left(\\frac yx\\right)^2+\\frac yx$ depends only on $\\frac yx$: a homogeneous equation, so let $v=\\frac yx$.",
    "why": "For a homogeneous equation, substituting $y=vx$ makes it separable; treating it as a Bernoulli equation also works, but the homogeneous substitution is quicker to see.",
    "steps": [
      "$y=vx$, $y'=v+xv'$; substituting gives $v+xv'=v^2+v$, i.e. $xv'=v^2$.",
      "Separate: $\\frac{dv}{v^2}=\\frac{dx}{x}$, $-\\frac1v=\\ln x+C$; $v(1)=\\frac12$ gives $C=-2$.",
      "$v=\\frac{1}{2-\\ln x}$, $y=\\frac{x}{2-\\ln x}$; plugging back into the original equation confirms it.",
      "$y(e)=\\frac{e}{2-1}=e$."
    ],
    "trap": "After substituting, forgetting the $v$ in $y'=v+xv'$ and writing $xv'=v^2+v$, which integrates to something completely different.",
    "check": "The initial value is $y(1)=\\frac12$, and $y'>0$ makes $y$ keep growing; by $x=e$ it reaches $e\\approx2.718$, a reasonable direction."
  },
  "cl-int-023": {
    "spot": "Eliminating $C$ from the family $y=Cx^2$ gives slope $y'=\\frac{2y}{x}$; the orthogonal trajectories have the negative reciprocal slope $-\\frac{x}{2y}$.",
    "why": "First eliminate the parameter to get the family's differential equation, then replace the slope with its negative reciprocal to get a separable equation; finding perpendicular lines on each parabola one at a time never produces a whole curve.",
    "steps": [
      "$y=Cx^2$, $y'=2Cx$, and $C=\\frac{y}{x^2}$, so $y'=\\frac{2y}{x}$.",
      "Orthogonal trajectories: $\\frac{dy}{dx}=-\\frac{x}{2y}$; separating gives $2y\\,dy=-x\\,dx$, i.e. $y^2+\\frac{x^2}{2}=K$ (a family of ellipses).",
      "Through $(1,1)$: $K=1+\\frac12=\\frac32$.",
      "To hit the $x$-axis set $y=0$: $\\frac{x^2}{2}=\\frac32$, and the positive intersection is $x=\\sqrt3$."
    ],
    "trap": "Forgetting to eliminate $C$ and integrating the negative reciprocal $-\\frac{1}{2Cx}$ of $y'=2Cx$ directly, leaving the parameter in the result.",
    "check": "At $(1,1)$ the two curves have slopes $2$ and $-\\frac12$, whose product is $-1$, so they really are perpendicular."
  },
  "der-017": {
    "spot": "$e^{x^2}$ times $\\cos(3x)$: Product Rule, and each factor needs the Chain Rule (giving $2x$ and $3$).",
    "why": "The Product Rule splits the problem into two standard Chain Rule computations, and factoring out $e^{x^2}$ at the end is tidiest.",
    "steps": [
      "$(e^{x^2})'=2x\\,e^{x^2}$.",
      "$(\\cos3x)'=-3\\sin3x$.",
      "Together: $2x\\,e^{x^2}\\cos3x-3e^{x^2}\\sin3x=e^{x^2}\\left(2x\\cos3x-3\\sin3x\\right)$."
    ],
    "trap": "Forgetting the minus sign in the derivative of $\\cos$, or dropping the inner $3$, and writing $e^{x^2}(2x\\cos3x+\\sin3x)$.",
    "check": "At $x=0$ both terms are $0$ ($2x=0$, $\\sin0=0$), so the derivative should be $0$."
  },
  "exam-ser-009": {
    "spot": "$e^{2x}$ is just $e^u=\\sum\\frac{u^n}{n!}$ with $u$ replaced by $2x$: the coefficient of $x^5$ is $\\frac{2^5}{5!}$.",
    "why": "Substituting into the known expansion avoids computing a fifth derivative.",
    "steps": [
      "$e^{2x}=\\sum_{n\\ge0}\\frac{(2x)^n}{n!}=\\sum\\frac{2^n}{n!}x^n$.",
      "$n=5$: $\\frac{2^5}{5!}=\\frac{32}{120}$.",
      "Reducing gives $\\frac{4}{15}$."
    ],
    "trap": "Writing only $\\frac{1}{5!}$ and forgetting the $2^5$, or writing $\\frac{2}{5!}$.",
    "check": "Using the fifth derivative: $\\frac{d^5}{dx^5}e^{2x}=32e^{2x}$, which is $32$ at $0$; dividing by $5!$ gives the same."
  },
  "lec-01-q1c": {
    "spot": "As $x\\to\\infty$ both $\\sqrt{x^2+x}$ and $x$ blow up, an $\\infty-\\infty$ form with a square root: multiply by the conjugate to rationalize.",
    "why": "Rationalizing turns the difference into a fraction, and dividing top and bottom by $x$ reveals the limit; plugging in directly only gives an indeterminate form.",
    "steps": [
      "Multiply by $\\frac{\\sqrt{x^2+x}+x}{\\sqrt{x^2+x}+x}$: $\\sqrt{x^2+x}-x=\\frac{x}{\\sqrt{x^2+x}+x}$.",
      "Divide numerator and denominator by $x$ ($x>0$): $\\frac{1}{\\sqrt{1+\\frac1x}+1}$.",
      "As $x\\to\\infty$, $\\frac1x\\to0$, so the limit is $\\frac{1}{1+1}=\\frac12$."
    ],
    "trap": "Thinking $\\sqrt{x^2+x}\\approx x$ so the difference is $0$; actually $\\sqrt{x^2+x}\\approx x+\\frac12$.",
    "check": "Plug in a big number $x=10000$: $\\sqrt{100010000}-10000\\approx0.49999$."
  },
  "lec-01-q3a": {
    "spot": "A three-piece function that is continuous everywhere: it can only break at the seams $x=1$ and $x=2$; each seam gives one equation, and the two equations determine $a$ and $b$.",
    "why": "Each piece is a polynomial and continuous on its own, so you only need the values on both sides of each seam to match; solving the $x=2$ equation first, which involves only $b$, is fastest.",
    "steps": [
      "$x=2$: the middle piece $4+b$ must equal the right piece $4\\cdot2-1=7$, so $b=3$.",
      "$x=1$: the left-piece limit $a+3$ must equal the middle piece $1+b=4$.",
      "$a+3=4$, giving $a=1$."
    ],
    "trap": "Handling $x=1$ first and writing the middle value as $1+b$ while forgetting $b$ is not solved yet, or using $4x+1$ by mistake at $x=2$ to get $b=5$, $a=3$.",
    "check": "With $a=1,b=3$: the left piece gives $4$ at $1$, the middle piece gives $4$ at $1$, the middle piece gives $7$ at $2$, and the right piece gives $7$ at $2$, so everything connects."
  },
  "lec-02-q3a": {
    "spot": "A piecewise function differentiable at the seam $x=1$: it must first be continuous, then the left and right derivatives must agree; $a$ is the slope of the right piece and is fixed directly by the derivative condition.",
    "why": "Differentiable implies continuous, but the $a$ asked for here only needs the equal-slopes condition; the continuity condition is left for $b$.",
    "steps": [
      "Left derivative: $(x^2)'=2x$, which is $2$ at $x=1$.",
      "Continuity requires $1=a+b$; the derivative of the right piece $ax+b$ is $a$ everywhere, so the right derivative is $a$.",
      "Left and right derivatives agree: $a=2$ (and so $b=-1$; the right piece $2x-1$ is exactly the tangent line of $x^2$ at $x=1$)."
    ],
    "trap": "Stopping at continuity $1=a+b$ and thinking there are infinitely many solutions; or computing the left derivative as the value of $x^2$ at $1$, namely $1$.",
    "check": "The line $y=2x-1$ that joins on is exactly the parabola's tangent line at $(1,1)$, so the seam is smooth. Makes sense."
  },
  "lec-02-q3b": {
    "spot": "The problem says \"by definition\": $f$ is given separately at $0$, so compute the difference quotient $\\frac{f(h)-0}{h}=h\\sin\\frac1h$, then use the Squeeze Theorem.",
    "why": "The derivative formula for $x\\neq0$ has no limit at $0$, so you cannot plug $0$ into it; the definition plus $|\\sin|\\le1$ squeezes it to $0$ in one step.",
    "steps": [
      "$f'(0)=\\lim_{h\\to0}\\frac{h^2\\sin\\frac1h-0}{h}=\\lim_{h\\to0}h\\sin\\frac1h$.",
      "$-|h|\\le h\\sin\\frac1h\\le|h|$, and both sides go to $0$.",
      "For example, at $h=0.0001$ the absolute value of the difference quotient is at most $0.0001$.",
      "Squeeze Theorem: $f'(0)=0$."
    ],
    "trap": "Using $f'(x)=2x\\sin\\frac1x-\\cos\\frac1x$, letting $x\\to0$, seeing $\\cos\\frac1x$ oscillate, and saying the derivative does not exist.",
    "check": "$|f(x)|\\le x^2$, and $x^2$ has derivative $0$ at $0$; the squeezed $f$ must also have a horizontal tangent at $0$."
  },
  "lec-02-q4c": {
    "spot": "It asks for \"total distance\", not \"displacement\": $v(t)=3t^2-12t+9=3(t-1)(t-3)$ changes sign at $t=1$ and $t=3$, so split into pieces and take absolute values.",
    "why": "Displacement $s(4)-s(0)$ cancels out the backward motion; cut at the turning points, compute $|\\Delta s|$ on each piece, and add.",
    "steps": [
      "$v(t)=s'(t)=3t^2-12t+9=3(t-1)(t-3)$, with turning points $t=1,3$.",
      "$s(0)=0$, $s(1)=4$, $s(3)=0$, $s(4)=4$.",
      "Distances on the three pieces: $|4-0|+|0-4|+|4-0|=4+4+4$.",
      "Total distance $12$ m."
    ],
    "trap": "Computing $s(4)-s(0)=4$ directly; that is displacement, not distance.",
    "check": "Total distance is never less than the displacement $|s(4)-s(0)|=4$; $12\\ge4$."
  },
  "lec-03-q2a": {
    "spot": "Both the base and the exponent contain $x$: $x^x$ is neither a power function nor an exponential function, so take logs first, then differentiate.",
    "why": "Logarithmic differentiation brings the exponent down into the product $x\\ln x$, and then the Product Rule does the job; forcing $(x^n)'=nx^{n-1}$ or $(a^x)'=a^x\\ln a$ each gets only half of it.",
    "steps": [
      "$\\ln y=x\\ln x$.",
      "Differentiate both sides with respect to $x$: $\\frac{y'}{y}=\\ln x+1$.",
      "$y'=x^x(\\ln x+1)$."
    ],
    "trap": "Treating it as a power function to get $x\\cdot x^{x-1}=x^x$, or as an exponential to get $x^x\\ln x$; the correct answer is the sum of the two.",
    "check": "At $x=1$, $y'=1\\cdot(0+1)=1$."
  },
  "lec-03-q3c": {
    "spot": "Outer $\\arctan u$, inner $u=\\frac1x$: Chain Rule, $\\frac{1}{1+u^2}$ times $-\\frac{1}{x^2}$.",
    "why": "Two steps of the Chain Rule simplify to $-\\frac{1}{1+x^2}$; you can also see it at a glance from $\\arctan\\frac1x=\\frac\\pi2-\\arctan x$.",
    "steps": [
      "Outer: $\\frac{d}{du}\\arctan u=\\frac{1}{1+u^2}=\\frac{1}{1+\\frac{1}{x^2}}=\\frac{x^2}{x^2+1}$.",
      "Inner: $\\left(\\frac1x\\right)'=-\\frac{1}{x^2}$.",
      "Multiply: $\\frac{x^2}{x^2+1}\\cdot\\left(-\\frac{1}{x^2}\\right)=-\\frac{1}{1+x^2}$."
    ],
    "trap": "Forgetting the inner derivative and answering $\\frac{1}{1+\\frac{1}{x^2}}$, or dropping the minus sign.",
    "check": "For $x>0$, $\\arctan\\frac1x=\\frac\\pi2-\\arctan x$, so of course the derivative is $-\\frac{1}{1+x^2}$."
  },
  "lec-04-q1b": {
    "spot": "Absolute extrema on the closed interval $[-1,5]$: the candidates are the two endpoints, the points where $g'=0$, and the cusp $x=0$ caused by $x^{2/3}$ (where $g'$ does not exist).",
    "why": "The closed interval method just plugs in every candidate and compares; missing the cusp where $g'$ does not exist, or an endpoint, can miss the true maximum.",
    "steps": [
      "$g(x)=5x^{2/3}-x^{5/3}$, $g'(x)=\\frac{10}{3}x^{-1/3}-\\frac53x^{2/3}=\\frac{5(2-x)}{3x^{1/3}}$.",
      "$g'=0$ at $x=2$; $g'$ does not exist at $x=0$.",
      "Values: $g(-1)=1\\cdot6=6$, $g(0)=0$, $g(2)=3\\sqrt[3]{4}\\approx4.76$, $g(5)=0$.",
      "The largest is at the left endpoint, $g(-1)=6$."
    ],
    "trap": "Looking only at $x=2$ where $g'=0$ and answering $3\\sqrt[3]4\\approx4.76$, missing the left endpoint $x=-1$.",
    "check": "$(-1)^{2/3}=\\left((-1)^2\\right)^{1/3}=1$, so $g(-1)=1\\cdot6$; on the left $x^{2/3}$ is positive and $5-x$ is at its largest, so the endpoint winning makes sense."
  },
  "lec-05-q1d": {
    "spot": "As $x\\to\\infty$ the base $1+\\frac3x\\to1$ and the exponent $x\\to\\infty$: a $1^\\infty$ form, matching the definition of $e$, $\\left(1+\\frac{a}{x}\\right)^x\\to e^a$.",
    "why": "Recognizing the standard form of $e^a$ gives the answer in one step; if unsure, take logs and it becomes $x\\ln(1+\\frac3x)\\to3$.",
    "steps": [
      "Take logs: $\\ln\\left(1+\\frac3x\\right)^x=x\\ln\\left(1+\\frac3x\\right)$.",
      "$x\\ln\\left(1+\\frac3x\\right)=\\frac{\\ln(1+3/x)}{1/x}\\to3$ ($\\ln(1+u)\\approx u$).",
      "Exponentiate back: the limit is $e^3\\approx20.09$."
    ],
    "trap": "Thinking the base goes to $1$ so the answer is $1$; $1^\\infty$ is an indeterminate form.",
    "check": "Plug in $x=100000$: $\\left(1.00003\\right)^{100000}$ should be very close to $e^3$."
  },
  "lec-05-q3c": {
    "spot": "Distance from a point $(x,x^2)$ on the parabola to $(0,3)$: minimize the squared distance $x^2+(x^2-3)^2$; it depends only on $x^2$, so let $u=x^2$ and it becomes a quadratic.",
    "why": "The squared distance drops the root and has its extremum at the same place; with $u=x^2$ it is an upward-opening quadratic, which has a minimum you can find by completing the square.",
    "steps": [
      "$d^2=x^2+(x^2-3)^2=u+(u-3)^2$, with $u=x^2\\ge0$.",
      "Differentiate in $u$: $1+2(u-3)=0$, so $u=\\frac52$ (within the range $u\\ge0$).",
      "$d^2=\\frac52+\\frac14=\\frac{11}{4}$.",
      "Shortest distance $\\frac{\\sqrt{11}}{2}\\approx1.658$ (at $x=\\pm\\sqrt{5/2}$)."
    ],
    "trap": "Going by intuition to the vertex $(0,0)$ and answering distance $3$; the point $(0,3)$ is high enough inside the parabola's opening that the nearest points are actually off to the sides.",
    "check": "It is smaller than the distance $3$ to the vertex, and also smaller than the distance $\\sqrt5\\approx2.236$ to the point $(1,1)$ at $x=1$."
  },
  "lec-05-q4c": {
    "spot": "Newton's method iteration $x_{n+1}=x_n-\\frac{f(x_n)}{f'(x_n)}$ with $f(x)=x^2-5$, $f'(x)=2x$; take two steps from $x_1=2$.",
    "why": "After simplifying to $x_{n+1}=\\frac12\\left(x_n+\\frac{5}{x_n}\\right)$, compute with exact fractions and there is no decimal rounding error.",
    "steps": [
      "Iteration: $x-\\frac{x^2-5}{2x}=\\frac12\\left(x+\\frac5x\\right)$.",
      "$x_2=\\frac12\\left(2+\\frac52\\right)=\\frac94$.",
      "$x_3=\\frac12\\left(\\frac94+\\frac{20}{9}\\right)=\\frac12\\cdot\\frac{161}{36}=\\frac{161}{72}$."
    ],
    "trap": "Writing the formula as $x_n+\\frac{f}{f'}$ (wrong sign), or handing in $x_2$, i.e. $\\frac94$, as the answer.",
    "check": "$\\frac{161}{72}\\approx2.23611$, already within $10^{-4}$ of $\\sqrt5\\approx2.23607$, and for a convex function Newton's method approaches from above."
  },
  "lec-06-m5": {
    "spot": "The shape $\\frac1n\\sum_{i=1}^n g\\!\\left(\\frac in\\right)$: width $\\frac1n$, right endpoints $\\frac in$, so it is a Riemann sum for $\\int_0^1(1+x)^2\\,dx$.",
    "why": "Recognizing a Riemann sum turns it into a definite integral computed in one line; expanding $\\sum\\left(1+\\frac in\\right)^2$ by brute force with the sum-of-squares formula takes several more steps.",
    "steps": [
      "$\\Delta x=\\frac1n$, $x_i=\\frac in$, function $(1+x)^2$: the limit is $\\int_0^1(1+x)^2\\,dx$.",
      "Let $u=1+x$: $\\int_1^2u^2\\,du=\\frac{8-1}{3}$.",
      "So the limit is $\\frac73$."
    ],
    "trap": "Reading it as $\\int_1^2(1+x)^2\\,dx$ (taking $1+\\frac in$ as $x$ and then adding $1$ again), which gives $\\frac{19}{3}$.",
    "check": "On $[0,1]$ the integrand rises from $1$ to $4$, so the integral should be between $1$ and $4$, and the right-endpoint sums will be slightly larger than the limit."
  },
  "lec-06-q1b": {
    "spot": "$[0,2]$ split into $n$ equal parts with right endpoints: $\\Delta x=\\frac2n$, $x_i=\\frac{2i}{n}$; the sum contains $\\sum i^2$, so use the sum-of-squares formula.",
    "why": "Pull every constant out of the sum, leaving only $\\sum_{i=1}^n i^2=\\frac{n(n+1)(2n+1)}{6}$, and it becomes a rational expression in $n$.",
    "steps": [
      "$R_n=\\sum_{i=1}^n\\frac2n\\left(\\frac{2i}{n}\\right)^2=\\frac{8}{n^3}\\sum_{i=1}^n i^2$.",
      "$\\sum_{i=1}^n i^2=\\frac{n(n+1)(2n+1)}{6}$; for example, at $n=4$ it is $1+4+9+16=30$.",
      "$R_n=\\frac{8}{n^3}\\cdot\\frac{n(n+1)(2n+1)}{6}=\\frac{4(n+1)(2n+1)}{3n^2}$."
    ],
    "trap": "Writing $\\Delta x$ as $\\frac1n$, or $x_i$ as $\\frac in$, which makes the expression off by a factor of $8$ or $4$.",
    "check": "As $n\\to\\infty$, $R_n\\to\\frac83=\\int_0^2x^2\\,dx$."
  },
  "lec-06-q2b": {
    "spot": "Both limits of integration are functions of $x$ ($x^2$ and $x$): Fundamental Theorem of Calculus plus the Chain Rule, $f(\\text{upper limit})\\cdot(\\text{upper limit})'-f(\\text{lower limit})\\cdot(\\text{lower limit})'$.",
    "why": "$\\frac{\\sin t}{t}$ has no elementary antiderivative, so you cannot integrate first and then differentiate; the Fundamental Theorem means you never have to integrate at all.",
    "steps": [
      "$\\frac{d}{dx}\\int_x^{x^2}f(t)\\,dt=f(x^2)\\cdot2x-f(x)\\cdot1$, where $f(t)=\\frac{\\sin t}{t}$.",
      "$f(x^2)\\cdot2x=\\frac{\\sin(x^2)}{x^2}\\cdot2x=\\frac{2\\sin(x^2)}{x}$.",
      "Subtract $\\frac{\\sin x}{x}$: $\\frac{2\\sin(x^2)-\\sin x}{x}$."
    ],
    "trap": "Forgetting to multiply by the derivative $2x$ of the upper limit and answering $\\frac{\\sin(x^2)}{x^2}-\\frac{\\sin x}{x}$.",
    "check": "At $x=1$ the two limits coincide and the integral is $0$, but the derivative is $\\frac{2\\sin1-\\sin1}{1}=\\sin1$."
  },
  "lec-06-q3d": {
    "spot": "$\\sqrt{2x+1}$ in the denominator and $x$ in the numerator: let $u=2x+1$ and write $x$ as $\\frac{u-1}{2}$, so the integrand becomes powers of $u$.",
    "why": "Substituting for the whole inside of the root lets the $x$ in the numerator be written in $u$ too; integration by parts also works but adds a layer.",
    "steps": [
      "$u=2x+1$, $dx=\\frac{du}{2}$, $x=\\frac{u-1}{2}$; $x:0\\to4$ corresponds to $u:1\\to9$.",
      "$\\frac{u-1}{4\\sqrt u}=\\frac14\\left(u^{1/2}-u^{-1/2}\\right)$, with antiderivative $\\frac14\\left(\\frac23u^{3/2}-2u^{1/2}\\right)$.",
      "Evaluate: $\\frac14\\left[(18-6)-\\left(\\frac23-2\\right)\\right]=\\frac14\\cdot\\frac{40}{3}=\\frac{10}{3}$."
    ],
    "trap": "Changing variables but not the limits, and plugging $u=4$ and $u=0$ back in; or dropping the $\\frac12$ from $dx$.",
    "check": "On $[0,4]$ the integrand rises from $0$ to $\\frac43$, so the integral should be less than $4\\cdot\\frac43$."
  },
  "lec-06-q4b": {
    "spot": "It asks for \"total distance traveled\": $v(t)=t^2-2t-3=(t-3)(t+1)$ goes from negative to positive at $t=3$, so cut at $t=3$ and take absolute values on each piece.",
    "why": "Integrating $\\int_0^5v\\,dt$ directly gives displacement, where the backward motion gets subtracted; cutting at the sign change gives distance.",
    "steps": [
      "$v(t)=(t-3)(t+1)$: negative on $[0,3)$, positive on $(3,5]$.",
      "$\\int_0^3v\\,dt=9-9-9=-9$, so this stretch covers $9$ m.",
      "$\\int_3^5v\\,dt=\\frac{32}{3}$.",
      "Total distance $9+\\frac{32}{3}=\\frac{59}{3}$ m."
    ],
    "trap": "Computing $\\int_0^5v\\,dt=\\frac53$ directly; that is displacement.",
    "check": "Total distance is at least the absolute value of the displacement, $\\frac53$."
  },
  "lec-07-m1": {
    "spot": "The polynomial $x$ times $e^x$: integration by parts with $u=x$ (becomes a constant when differentiated) and $dv=e^x\\,dx$ (unchanged when integrated).",
    "why": "Choosing $u=x$ eliminates $x$ in one round; choosing $u=e^x$ instead raises the power of $x$ and makes it harder and harder.",
    "steps": [
      "$u=x$, $dv=e^x\\,dx$, so $du=dx$ and $v=e^x$.",
      "$\\int xe^x\\,dx=xe^x-\\int e^x\\,dx=xe^x-e^x+C$.",
      "Tidy up: $(x-1)e^x+C$."
    ],
    "trap": "Integrating the two factors separately to get $\\frac{x^2}{2}e^x$; or writing the minus sign in integration by parts as a plus, giving $(x+1)e^x$.",
    "check": "Differentiate back: $e^x+(x-1)e^x=xe^x$."
  },
  "lec-07-m3": {
    "spot": "Under the root is \"a constant squared minus $x^2$\": $\\sqrt{4-x^2}=\\sqrt{2^2-x^2}$, which calls for $x=2\\sin\\theta$.",
    "why": "$x=2\\sin\\theta$ makes $4-4\\sin^2\\theta=4\\cos^2\\theta$, so the root comes out; $\\tan$ suits a plus sign and $\\sec$ suits $x^2-a^2$.",
    "steps": [
      "Let $x=2\\sin\\theta$: $4-x^2=4\\cos^2\\theta$, and the root is $2\\cos\\theta$.",
      "$dx=2\\cos\\theta\\,d\\theta$, so the integrand becomes $\\frac{2\\cos\\theta\\,d\\theta}{2\\cos\\theta}=d\\theta$, and the integral is $\\arcsin\\frac x2+C$.",
      "So the most suitable substitution is $x=2\\sin\\theta$."
    ],
    "trap": "Seeing a root and picking $x=2\\tan\\theta$, which is meant for $\\sqrt{4+x^2}$; choosing $u=4-x^2$ fails because the numerator lacks an $x$ to make $du$.",
    "check": "The result $\\arcsin\\frac x2$ has derivative $\\frac12=\\frac{1}{\\sqrt4}$ at $x=0$, which matches."
  },
  "lec-07-q3c": {
    "spot": "In $\\tan^3x\\sec x$ the power of $\\tan$ is odd: keep one $\\sec x\\tan x$ as $d(\\sec x)$ and turn the remaining $\\tan^2x$ into $\\sec^2x-1$.",
    "why": "With an odd power of $\\tan$, let $u=\\sec x$ and the whole integral becomes a polynomial in $u$; $u=\\tan x$ would need $\\sec^2x$, and there is only one $\\sec x$ here.",
    "steps": [
      "Rewrite: $\\tan^3x\\sec x=\\tan^2x\\cdot\\sec x\\tan x=(\\sec^2x-1)\\sec x\\tan x$.",
      "Let $u=\\sec x$, $du=\\sec x\\tan x\\,dx$; $x:0\\to\\frac\\pi4$ corresponds to $u:1\\to\\sqrt2$.",
      "The integral becomes $\\int_1^{\\sqrt2}(u^2-1)\\,du$.",
      "$\\left[\\frac{u^3}3-u\\right]_1^{\\sqrt2}=\\left(\\frac{2\\sqrt2}{3}-\\sqrt2\\right)-\\left(\\frac13-1\\right)=\\frac{2-\\sqrt2}{3}$."
    ],
    "trap": "Not changing the limits and plugging $0$ and $\\frac\\pi4$ into the antiderivative in $u$; or computing $\\sec\\frac\\pi4$ as $\\frac{\\sqrt2}{2}$.",
    "check": "On $[0,\\frac\\pi4]$ the integrand rises from $0$ to $\\sqrt2$; the integral is about $0.195$, less than $\\frac\\pi4\\cdot\\sqrt2$."
  },
  "lec-07-q3d": {
    "spot": "In $\\sin^2x\\cos^2x$ both powers are even: first combine into $\\frac14\\sin^22x$, then use the power-reduction formula $\\sin^2\\theta=\\frac{1-\\cos2\\theta}{2}$.",
    "why": "With even powers there is no odd power to save for a substitution, so double-angle power reduction is the only way; what remains is $\\cos4x$, which runs through a whole number of periods on $[0,\\pi]$.",
    "steps": [
      "$\\sin x\\cos x=\\frac12\\sin2x$, so $\\sin^2x\\cos^2x=\\frac14\\sin^22x$.",
      "Power reduction: $\\frac14\\sin^22x=\\frac{1-\\cos4x}{8}$.",
      "$\\cos4x$ runs through two full periods on $[0,\\pi]$, so its integral is $0$.",
      "What is left is $\\int_0^\\pi\\frac18\\,dx=\\frac\\pi8$."
    ],
    "trap": "Writing $\\sin^22x$ as $\\frac{1-\\cos2x}{2}$ during power reduction (not doubling the angle), or dropping the $\\frac14$ and answering $\\frac\\pi2$.",
    "check": "The average value of $\\sin^2x\\cos^2x$ is $\\frac18$, times the length $\\pi$."
  },
  "lec-07-q4a": {
    "spot": "$\\sqrt{4-x^2}$ is \"a constant squared minus $x^2$\", and the problem specifies $x=2\\sin\\theta$: the root becomes $2\\cos\\theta$.",
    "why": "Trigonometric substitution removes the root, leaving $\\cos^2\\theta$ to integrate by power reduction; this is also exactly the area of a quarter circle, a handy way to check the answer.",
    "steps": [
      "$x=2\\sin\\theta$, $dx=2\\cos\\theta\\,d\\theta$, $\\sqrt{4-4\\sin^2\\theta}=2\\cos\\theta$; $x:0\\to2$ corresponds to $\\theta:0\\to\\frac\\pi2$.",
      "The integral becomes $\\int_0^{\\pi/2}4\\cos^2\\theta\\,d\\theta$.",
      "$4\\cos^2\\theta=2+2\\cos2\\theta$, which integrates to $\\Big[2\\theta+\\sin2\\theta\\Big]_0^{\\pi/2}=\\pi$."
    ],
    "trap": "Changing variables but forgetting to replace $dx$ with $2\\cos\\theta\\,d\\theta$, which gives $\\int_0^{\\pi/2}2\\cos\\theta\\,d\\theta=2$.",
    "check": "The region is a quarter circle of radius $2$, with area $\\frac14\\pi\\cdot2^2$."
  },
  "lec-08-m1": {
    "spot": "Denominator $x^2(x-1)$: $x$ is a repeated (double) factor and $x-1$ is a linear factor; a repeated factor needs terms from the first power up to the highest power.",
    "why": "The double factor $x^2$ needs the two terms $\\frac Ax+\\frac{B}{x^2}$; without $\\frac Ax$ you generally cannot match the numerator, and three unknowns for three coefficients is exactly right.",
    "steps": [
      "Set $\\frac{x+1}{x^2(x-1)}=\\frac Ax+\\frac B{x^2}+\\frac C{x-1}$.",
      "Clear denominators and compare: $x+1=Ax(x-1)+B(x-1)+Cx^2$; $x=0$ gives $B=-1$, $x=1$ gives $C=2$, and comparing $x^2$ coefficients gives $A=-2$.",
      "So the right setup is $\\frac Ax+\\frac B{x^2}+\\frac C{x-1}$."
    ],
    "trap": "Writing only $\\frac{A}{x^2}+\\frac{B}{x-1}$, missing the $\\frac Ax$ term, and then being unable to solve for the coefficients.",
    "check": "Plug $x=2$ into the actual decomposition: the left side is $\\frac{3}{4}$, the right side is $-1-\\frac14+2=\\frac34$."
  },
  "lec-08-q1a": {
    "spot": "The denominator $x^2-2x-3=(x-3)(x+1)$ factors into two distinct linear factors, and the numerator has lower degree: split by partial fractions into two $\\ln$ terms.",
    "why": "With distinct linear factors, the cover-up method reads off the coefficients by plugging in roots, faster than solving a system for undetermined coefficients.",
    "steps": [
      "$\\frac{5x-3}{(x-3)(x+1)}=\\frac{A}{x-3}+\\frac{B}{x+1}$; plugging in $x=3$ gives $A=\\frac{12}{4}=3$, and $x=-1$ gives $B=\\frac{-8}{-4}=2$.",
      "Integrate: $3\\ln|x-3|+2\\ln|x+1|+C$.",
      "For $-1<x<3$, $|x-3|=3-x$ and $|x+1|=x+1$: $3\\ln(3-x)+2\\ln(x+1)+C$."
    ],
    "trap": "Writing $\\ln(3-x)$ as $\\ln(x-3)$, which is not even defined for $-1<x<3$; or plugging in the wrong root in the cover-up method and swapping $A$ and $B$.",
    "check": "Differentiate back: $-\\frac{3}{3-x}+\\frac{2}{x+1}=\\frac{3}{x-3}+\\frac{2}{x+1}$, which is the original integrand."
  },
  "lec-08-q1b": {
    "spot": "The denominator $x^2(x-1)$ has the repeated factor $x^2$: set up partial fractions as $\\frac Ax+\\frac B{x^2}+\\frac C{x-1}$.",
    "why": "After splitting, every piece is a standard $\\ln$ or power-function integral, and the interval $[2,3]$ avoids $x=0,1$.",
    "steps": [
      "$\\frac{1}{x^2(x-1)}=-\\frac1x-\\frac1{x^2}+\\frac1{x-1}$ ($x=0$ gives $B=-1$, $x=1$ gives $C=1$, comparing $x^2$ coefficients gives $A=-1$).",
      "Antiderivative $-\\ln x+\\frac1x+\\ln(x-1)=\\ln\\frac{x-1}{x}+\\frac1x$.",
      "From $2$ to $3$: $\\left(\\ln\\frac23+\\frac13\\right)-\\left(\\ln\\frac12+\\frac12\\right)=\\ln\\frac43-\\frac16$."
    ],
    "trap": "Integrating $\\frac{-1}{x^2}$ as $-\\frac1x$ (sign error), which gives $\\ln\\frac43+\\frac16$.",
    "check": "On $[2,3]$ the integrand falls from $\\frac14$ to $\\frac1{18}$, and the integral, about $0.121$, lies between the two."
  },
  "lec-08-q1c": {
    "spot": "Denominator $(x+1)(x^2+1)$: the linear factor gets a constant $\\frac A{x+1}$, and the irreducible quadratic factor gets a linear numerator $\\frac{Bx+C}{x^2+1}$.",
    "why": "First read off $A$ using $x=-1$; subtracting from the numerator then reveals $Bx+C$, and the result is exactly two $\\ln$ terms.",
    "steps": [
      "Plug in $x=-1$: $A=\\frac{2-1+1}{1+1}=1$.",
      "$2x^2+x+1-(x^2+1)=x^2+x=x(x+1)$, so $\\frac{Bx+C}{x^2+1}=\\frac{x}{x^2+1}$.",
      "Integrate: $\\ln(x+1)+\\frac12\\ln(x^2+1)+C$ ($x>-1$)."
    ],
    "trap": "Giving the quadratic factor only a constant $\\frac{B}{x^2+1}$ and running into a contradiction; or forgetting the $\\frac12$ in $\\int\\frac{x}{x^2+1}dx$.",
    "check": "Differentiating back should give the original integrand."
  },
  "lec-09-q1b": {
    "spot": "$x=y^2$ is a sideways parabola, and the line can be written $x=y+2$: with both in terms of $y$, integrating in $y$ as \"right minus left\" is cleanest.",
    "why": "Integrating in $x$ means that on the left part $x\\in[0,1]$ both bounds are the parabola, while on the right part one bound switches to the line, so you need two pieces.",
    "steps": [
      "Intersections: $y^2=y+2$, so $y=-1$ or $y=2$.",
      "The right boundary is the line $x=y+2$ and the left boundary is $x=y^2$: $A=\\int_{-1}^2\\left(y+2-y^2\\right)dy$.",
      "$\\left[\\frac{y^2}2+2y-\\frac{y^3}3\\right]_{-1}^2=\\frac{10}{3}-\\left(-\\frac76\\right)=\\frac92$."
    ],
    "trap": "Integrating in $x$ from $0$ to $4$ as just $\\int(\\sqrt x-(x-2))dx$, ignoring that for $x\\in[0,1]$ the lower bound is $-\\sqrt x$, not the line.",
    "check": "Parabolic segment formula: $\\frac{|a|(\\beta-\\alpha)^3}{6}=\\frac{1\\cdot3^3}{6}=\\frac92$."
  },
  "lec-09-q2c": {
    "spot": "The region $0\\le y\\le2x-x^2$ ($x\\in[0,2]$) rotated about the vertical line $x=-1$: the top and bottom boundaries are functions of $x$ and the axis is vertical, so use cylindrical shells with radius $x+1$.",
    "why": "Shells use $y=2x-x^2$ directly as the shell height; washers would require solving the parabola as $x=1\\pm\\sqrt{1-y}$, which is much messier.",
    "steps": [
      "The shell radius is the distance $x+1$ to the axis $x=-1$, and the shell height is $2x-x^2$: $V=2\\pi\\int_0^2(x+1)(2x-x^2)\\,dx$.",
      "$\\int_0^2\\left(-x^3+x^2+2x\\right)dx=-4+\\frac83+4=\\frac83$.",
      "$V=2\\pi\\cdot\\frac83=\\frac{16\\pi}{3}$."
    ],
    "trap": "Writing the radius as $x$ (as if rotating about the $y$-axis), which gives $2\\pi\\cdot\\frac43=\\frac{8\\pi}{3}$; or writing it as $x-1$.",
    "check": "Pappus's theorem: area $\\frac43$, centroid $\\bar x=1$ at distance $2$ from the axis, so $V=2\\pi\\cdot2\\cdot\\frac43$."
  },
  "lec-09-q4b": {
    "spot": "A solid with known cross-sections: slicing perpendicular to the $x$-axis gives squares whose side is the chord length $2\\sqrt{4-x^2}$ of the disk at $x$.",
    "why": "Once the cross-sectional area $A(x)$ is written down, the volume is $\\int A(x)\\,dx$; this is not a solid of revolution, so shells and washers do not apply.",
    "steps": [
      "At $x$, the chord of the base runs from $y=-\\sqrt{4-x^2}$ to $\\sqrt{4-x^2}$, so the side length is $2\\sqrt{4-x^2}$.",
      "Cross-sectional area $A(x)=\\left(2\\sqrt{4-x^2}\\right)^2=4(4-x^2)$.",
      "$V=\\int_{-2}^{2}4(4-x^2)\\,dx=4\\left(16-\\frac{16}{3}\\right)=\\frac{128}{3}$."
    ],
    "trap": "Using the half-chord $\\sqrt{4-x^2}$ as the side, which makes the answer $4$ times too small: $\\frac{32}{3}$.",
    "check": "The solid fits in a $4\\times4\\times4$ box, so the volume should be less than $64$; it should also be larger than the inscribed cone-like shape."
  },
  "lec-10-q1c": {
    "spot": "Arc length of a parametric curve is $\\int\\sqrt{x'^2+y'^2}\\,dt$; for the cycloid, $(1-\\cos t)^2+\\sin^2t=2-2\\cos t=4\\sin^2\\frac t2$, and the half-angle formula makes the root come out cleanly.",
    "why": "Without rewriting as $4\\sin^2\\frac t2$ the root cannot be integrated; on $[0,2\\pi]$, $\\sin\\frac t2\\ge0$, so no absolute value needs handling.",
    "steps": [
      "$x'=1-\\cos t$, $y'=\\sin t$, $x'^2+y'^2=2-2\\cos t$.",
      "Half-angle: $2-2\\cos t=4\\sin^2\\frac t2$, so the speed is $2\\sin\\frac t2$.",
      "$L=\\int_0^{2\\pi}2\\sin\\frac t2\\,dt=\\Big[-4\\cos\\frac t2\\Big]_0^{2\\pi}=4+4=8$."
    ],
    "trap": "Taking the root as $2\\sin\\frac t2$ but then cancelling with the period of $\\cos t$ during integration, or getting $\\cos\\pi=-1$ wrong at the upper limit, and ending up with $0$.",
    "check": "One arch spans $2\\pi\\approx6.28$ with height $2$, so the arc length should exceed the base $2\\pi$ but be shorter than going around three sides of the rectangle, $2\\pi+4$."
  }
};
