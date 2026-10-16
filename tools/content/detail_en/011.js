// Detail v2, English — batch 011. Translation of tools/content/detail/011.js (text only; claims live in the Chinese file).
module.exports = {
  "burst-int-020": {
    "spot": "$\\sin^8x$ is an even power on the whole interval $[0,\\pi]$ — the graph is symmetric about $x=\\frac{\\pi}{2}$, so fold it into twice $[0,\\frac{\\pi}{2}]$, the home turf of the Wallis formula.",
    "why": "Power-reduction would take three rounds and produce a long string of cosines; the Wallis recursion $I_n=\\frac{n-1}{n}I_{n-2}$ just multiplies down.",
    "steps": [
      "Symmetry: $\\sin(\\pi-x)=\\sin x$, so $\\int_0^\\pi\\sin^8x\\,dx=2\\int_0^{\\pi/2}\\sin^8x\\,dx$.",
      "Wallis recursion: $I_n=\\int_0^{\\pi/2}\\sin^nx\\,dx=\\frac{n-1}{n}I_{n-2}$, e.g. $I_8=\\frac{7}{8}I_6$.",
      "Go all the way down to $I_0=\\frac{\\pi}{2}$: $I_8=\\frac{7}{8}\\cdot\\frac{5}{6}\\cdot\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{105}{384}\\cdot\\frac{\\pi}{2}=\\frac{35\\pi}{256}$.",
      "Multiply back by $2$: $\\int_0^\\pi\\sin^8x\\,dx=2\\cdot\\frac{35\\pi}{256}=\\frac{35\\pi}{128}$."
    ],
    "trap": "Applying Wallis directly, getting $\\frac{35\\pi}{256}$, and stopping — the Wallis formula gives the value on $[0,\\frac{\\pi}{2}]$; on $[0,\\pi]$ you must multiply by $2$.",
    "check": "$0\\le\\sin^8x\\le 1$, so the integral lies between $0$ and $\\pi$; and a high power only has real weight near $\\frac{\\pi}{2}$, so it should be much less than $\\pi$: $\\frac{35\\pi}{128}\\approx 0.86$."
  },
  "burst-int-022": {
    "spot": "$\\cos^8x$, an even power on $[0,\\frac{\\pi}{2}]$ — exactly the original form of the Wallis formula; on this interval $\\cos$ and $\\sin$ have the same integral.",
    "why": "Power-reduction would take three rounds and expand out to $\\cos 8x$; the Wallis recursion $I_n=\\frac{n-1}{n}I_{n-2}$ is one line of multiplication.",
    "steps": [
      "Let $x=\\frac{\\pi}{2}-u$: $\\cos x=\\sin u$ and the limits swap, so $\\int_0^{\\pi/2}\\cos^8x\\,dx=\\int_0^{\\pi/2}\\sin^8u\\,du$.",
      "The recursion $I_n=\\frac{n-1}{n}I_{n-2}$ comes from integrating by parts with $\\cos^nx$ split as $\\cos^{n-1}x\\cdot\\cos x$, e.g. $I_8=\\frac{7}{8}I_6$.",
      "Even powers go all the way down to $I_0=\\frac{\\pi}{2}$: $I_8=\\frac{7}{8}\\cdot\\frac{5}{6}\\cdot\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{105}{384}\\cdot\\frac{\\pi}{2}$.",
      "Reduce: $\\frac{105\\pi}{768}=\\frac{35\\pi}{256}$."
    ],
    "trap": "Forgetting the final $\\frac{\\pi}{2}$ for even powers (only odd powers end with $1$), getting $\\frac{35}{128}$.",
    "check": "The higher the power, the smaller the integral: $I_8<I_6=\\frac{5\\pi}{32}$."
  },
  "burst-int-023": {
    "spot": "The power of $\\sin$ is odd, $3$ — keep one $\\sin x$ for $dx$, write the rest as $\\sin^2x=1-\\cos^2x$, and $u=\\cos x$ turns it into a polynomial integral.",
    "why": "Splitting off one factor of an odd power as the differential is more direct than using the Beta function; the whole problem reduces to the two terms $u^6-u^8$.",
    "steps": [
      "Split: $\\sin^3x\\cos^6x=(1-\\cos^2x)\\cos^6x\\cdot\\sin x$.",
      "Let $u=\\cos x$, $du=-\\sin x\\,dx$; $x:0\\to\\frac{\\pi}{2}$ corresponds to $u:1\\to 0$, and the minus sign flips the limits back: the integral $=\\int_0^1(u^6-u^8)\\,du$.",
      "$\\int_0^1(u^6-u^8)\\,du=\\frac{1}{7}-\\frac{1}{9}=\\frac{2}{63}$."
    ],
    "trap": "Dropping the minus sign in $du=-\\sin x\\,dx$ without flipping the limits gives $-\\frac{2}{63}$; the integrand is nonnegative on $[0,\\frac{\\pi}{2}]$, so the answer cannot be negative.",
    "check": "Integrating the original numerically gives exactly $\\frac{2}{63}\\approx 0.0317$."
  },
  "burst-int-024": {
    "spot": "Both $\\sin$ and $\\cos$ have even powers — no odd power to split off for a substitution. But replacing $\\sin^2x=1-\\cos^2x$ leaves two pure even powers of $\\cos$, each handled by Wallis.",
    "why": "With both powers even, substitution goes nowhere; after splitting into $\\cos^6x-\\cos^8x$ both terms are Wallis values you know by heart, no Beta function needed.",
    "steps": [
      "Rewrite: $\\sin^2x\\cos^6x=(1-\\cos^2x)\\cos^6x=\\cos^6x-\\cos^8x$.",
      "Wallis: $\\int_0^{\\pi/2}\\cos^6x\\,dx=\\frac{5}{6}\\cdot\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{5\\pi}{32}$.",
      "Similarly $\\int_0^{\\pi/2}\\cos^8x\\,dx=\\frac{7}{8}\\cdot\\frac{5\\pi}{32}=\\frac{35\\pi}{256}$.",
      "Subtract: $\\frac{5\\pi}{32}-\\frac{35\\pi}{256}=\\frac{40\\pi-35\\pi}{256}=\\frac{5\\pi}{256}$."
    ],
    "trap": "Multiplying two Wallis values ($\\int\\sin^2\\cdot\\int\\cos^6$) to get $\\frac{\\pi}{4}\\cdot\\frac{5\\pi}{32}$ — the integral of a product is not the product of the integrals.",
    "check": "General formula $\\frac{(m-1)!!\\,(n-1)!!}{(m+n)!!}\\cdot\\frac{\\pi}{2}$ (for $m,n$ both even): $\\frac{1\\cdot 15}{384}\\cdot\\frac{\\pi}{2}$, the same."
  },
  "burst-int-031": {
    "spot": "The inside is $2x$ — let $u=2x$; the interval $[0,\\frac{\\pi}{2}]$ stretches to $[0,\\pi]$, leaving $\\sin^4u$ integrated over a full half-period.",
    "why": "Substituting first and then using symmetry and Wallis avoids a pile of coefficients from applying power-reduction twice to $\\sin^4(2x)$.",
    "steps": [
      "Let $u=2x$, $dx=\\frac{du}{2}$, and $x:0\\to\\frac{\\pi}{2}$ corresponds to $u:0\\to\\pi$: the integral $=\\frac{1}{2}\\int_0^\\pi\\sin^4u\\,du$.",
      "Symmetry: $\\int_0^\\pi\\sin^4u\\,du=2\\int_0^{\\pi/2}\\sin^4u\\,du=2\\cdot\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{3\\pi}{8}$.",
      "Multiply by $\\frac{1}{2}$: $\\frac{1}{2}\\cdot\\frac{3\\pi}{8}=\\frac{3\\pi}{16}$."
    ],
    "trap": "Forgetting $dx=\\frac{du}{2}$ after substituting, answering $\\frac{3\\pi}{8}$; or leaving the upper limit at $\\frac{\\pi}{2}$ instead of changing it to $\\pi$, getting $\\frac{3\\pi}{32}$.",
    "check": "$\\sin^4(2x)$ runs through exactly one full hump on $[0,\\frac{\\pi}{2}]$, so its average equals the average of $\\sin^4$, $\\frac{3}{8}$: $\\frac{3}{8}\\cdot\\frac{\\pi}{2}=\\frac{3\\pi}{16}$."
  },
  "burst-int-032": {
    "spot": "$\\sin$ and $\\cos$ have the same power, $6$ — first combine into $(\\sin x\\cos x)^6=\\frac{\\sin^6 2x}{64}$, turning two functions into one.",
    "why": "Both powers are even, so substitution goes nowhere; the double-angle formula collapses the product into a single $\\sin^6$, and Wallis finishes it.",
    "steps": [
      "Double angle: $\\sin x\\cos x=\\frac{1}{2}\\sin 2x$, so $\\sin^6x\\cos^6x=\\frac{1}{64}\\sin^6 2x$.",
      "Let $u=2x$: $\\int_0^{\\pi/2}\\sin^6 2x\\,dx=\\frac{1}{2}\\int_0^\\pi\\sin^6u\\,du=\\int_0^{\\pi/2}\\sin^6u\\,du$ (folding by symmetry doubles, cancelling the half).",
      "Wallis: $\\int_0^{\\pi/2}\\sin^6u\\,du=\\frac{5}{6}\\cdot\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{5\\pi}{32}$.",
      "Divide by $64$: $\\frac{5\\pi}{32\\cdot 64}=\\frac{5\\pi}{2048}$."
    ],
    "trap": "Writing the double angle as $\\sin x\\cos x=\\sin 2x$ (missing the $\\frac{1}{2}$) makes the answer $64$ times too big: $\\frac{5\\pi}{32}$.",
    "check": "Integrating the original numerically agrees with $\\frac{5\\pi}{2048}\\approx 0.00767$; $\\sin x\\cos x\\le\\frac{1}{2}$, so its sixth power is at most $\\frac{1}{64}$, and a tiny integral makes sense."
  },
  "burst-int-035": {
    "spot": "The power of $\\cos$ is odd, $5$ — keep one $\\cos x$ for $dx$, write $\\cos^4x=(1-\\sin^2x)^2$, and $u=\\sin x$ turns it into a polynomial.",
    "why": "Both powers are odd, so split the smaller one, $\\cos^5$, which expands to only three terms; splitting $\\sin^9$ would mean expanding a fourth power, twice as many terms.",
    "steps": [
      "Split: $\\sin^9x\\cos^5x=\\sin^9x(1-\\sin^2x)^2\\cos x$.",
      "Let $u=\\sin x$, $du=\\cos x\\,dx$, $u:0\\to 1$: the integral $=\\int_0^1u^9(1-u^2)^2\\,du=\\int_0^1(u^9-2u^{11}+u^{13})\\,du$.",
      "Term by term: $\\frac{1}{10}-\\frac{2}{12}+\\frac{1}{14}=\\frac{42-70+30}{420}=\\frac{2}{420}=\\frac{1}{210}$."
    ],
    "trap": "Dropping the middle term $-2u^2$ when expanding $(1-u^2)^2$ gives $\\frac{1}{10}+\\frac{1}{14}=\\frac{6}{35}$, more than thirty times too big.",
    "check": "Beta function: $\\frac{1}{2}B(5,3)=\\frac{1}{2}\\cdot\\frac{4!\\,2!}{7!}=\\frac{1}{2}\\cdot\\frac{48}{5040}=\\frac{1}{210}$, the same."
  },
  "burst-int-036": {
    "spot": "A polynomial $x^3$ times an exponential $e^{2x}$ — each integration by parts lowers the power of $x$ by one, and after three rounds the polynomial is gone; the tabular method (derivative column, integral column, alternating signs) does it all at once.",
    "why": "The tabular method compresses three rounds of integration by parts into one table, with no rewriting of $u$ and $dv$ each time; differentiating $e^{2x}$ instead would never make it go away.",
    "steps": [
      "Derivative column: $x^3,\\ 3x^2,\\ 6x,\\ 6,\\ 0$; integral column: each integration of $e^{2x}$ adds a factor $\\frac{1}{2}$: $\\frac{e^{2x}}{2},\\ \\frac{e^{2x}}{4},\\ \\frac{e^{2x}}{8},\\ \\frac{e^{2x}}{16}$.",
      "Multiply diagonally with alternating signs: $x^3\\cdot\\frac{e^{2x}}{2}-3x^2\\cdot\\frac{e^{2x}}{4}+6x\\cdot\\frac{e^{2x}}{8}-6\\cdot\\frac{e^{2x}}{16}$.",
      "Simplify: $\\int x^3e^{2x}\\,dx=e^{2x}\\left(\\frac{x^3}{2}-\\frac{3x^2}{4}+\\frac{3x}{4}-\\frac{3}{8}\\right)+C$."
    ],
    "trap": "Not alternating the signs and writing all pluses, giving $e^{2x}(\\frac{x^3}{2}+\\frac{3x^2}{4}+\\frac{3x}{4}+\\frac{3}{8})$; differentiating back does not match.",
    "check": "Differentiating the answer should give exactly $x^3e^{2x}$."
  },
  "burst-int-041": {
    "spot": "A polynomial $x^3$ times $e^{-x}$ — tabular method: derivative column $x^3\\to 3x^2\\to 6x\\to 6$; in the integral column $e^{-x}$ flips sign with each integration, and the coefficients line up as $1,3,6,6$.",
    "why": "The tabular method does all three rounds of parts at once; the signs from $e^{-x}$ cancel the alternating signs, so every term has the same sign and the result is tidy.",
    "steps": [
      "Integral column: $-e^{-x},\\ e^{-x},\\ -e^{-x},\\ e^{-x}$ (each integration multiplies by $-1$).",
      "Multiply diagonally with alternating signs: $x^3(-e^{-x})-3x^2(e^{-x})+6x(-e^{-x})-6(e^{-x})$; every term is negative.",
      "Factor out $-e^{-x}$: $\\int x^3e^{-x}\\,dx=-e^{-x}(x^3+3x^2+6x+6)+C$."
    ],
    "trap": "The table's alternating signs stack with the minus sign of $e^{-x}$ itself, and it is easy to end up with $-e^{-x}(x^3-3x^2+6x-6)$; differentiating back produces a pile of extra terms.",
    "check": "$\\int_0^\\infty x^3e^{-x}\\,dx=3!=6$: the answer is $0$ at $\\infty$ and $-6$ at $0$, so the difference is $6$."
  },
  "burst-rec-003": {
    "spot": "$(1-x)^2$ has only three terms — expand to $x^n-2x^{n+1}+x^{n+2}$; each term is $\\int_0^1x^m\\,dx=\\frac{1}{m+1}$, then combine over a common denominator.",
    "why": "Expanding and integrating directly is fastest; the Beta function $B(n+1,3)$ is also correct, but then you still have to write out factorials and cancel.",
    "steps": [
      "Expand: $x^n(1-x)^2=x^n-2x^{n+1}+x^{n+2}$.",
      "Term by term: $I_n=\\frac{1}{n+1}-\\frac{2}{n+2}+\\frac{1}{n+3}$.",
      "Common denominator: the numerator is $(n+2)(n+3)-2(n+1)(n+3)+(n+1)(n+2)=2$.",
      "So $I_n=\\frac{2}{(n+1)(n+2)(n+3)}$."
    ],
    "trap": "Expanding $(1-x)^2$ as $1-x^2$, or dropping the coefficient $2$ of $-2x$, giving $\\frac{1}{n+1}-\\frac{1}{n+3}$.",
    "check": "$n=0$: $\\int_0^1(1-x)^2\\,dx=\\frac{1}{3}$; the formula gives $\\frac{2}{1\\cdot 2\\cdot 3}=\\frac{1}{3}$."
  },
  "burst-rec-008": {
    "spot": "You need a recursion linking $J_n$ to $J_{n-1}$ — $x^n$ times $e^x$; integrate by parts once on $x^n$ and the power drops by exactly one.",
    "why": "Only differentiating $u=x^n$ lowers the power; differentiating $e^x$ instead leaves the power unchanged and the recursion never connects.",
    "steps": [
      "Integration by parts with $u=x^n$, $dv=e^x\\,dx$: $J_n=\\left[x^ne^x\\right]_0^1-n\\int_0^1x^{n-1}e^x\\,dx$.",
      "Boundary term: $x=1$ gives $e$, $x=0$ gives $0$ (for $n\\ge 1$); the remaining integral is exactly $J_{n-1}$.",
      "So $J_n=e-n\\,J_{n-1}$; the coefficient of $J_{n-1}$ is $-n$."
    ],
    "trap": "Writing just $n$ and losing the minus sign — the integration by parts formula is $uv-\\int v\\,du$, and that minus is the minus sign in the answer.",
    "check": "$J_0=e-1$, $J_1=e-1\\cdot J_0=1$: computing $\\int_0^1xe^x\\,dx=1$ directly agrees."
  },
  "db-ext-011": {
    "spot": "Inflection points are where $f''$ changes sign; after differentiating $f=x^2e^{-x}$ twice, the $e^{-x}$ stays and is always positive, so the sign change depends only on the quadratic in front.",
    "why": "Factor out $e^{-x}$ and solve the quadratic with the formula in one line; no need to actually graph $f$.",
    "steps": [
      "$f'=(2x-x^2)e^{-x}$; differentiate again: $f''=(2-2x)e^{-x}-(2x-x^2)e^{-x}=(x^2-4x+2)e^{-x}$.",
      "$e^{-x}>0$, so $f''=0$ depends only on $x^2-4x+2=0$: $x=2\\pm\\sqrt 2$.",
      "Both roots are simple, so $f''$ really does change sign across each (e.g. around $2+\\sqrt2\\approx 3.414$, negative on the left, positive on the right); both are inflection points.",
      "The larger one is $x=2+\\sqrt 2$."
    ],
    "trap": "Taking the points where $f'=0$ ($x=0$, $x=2$, the extrema) as inflection points and answering $2$. Inflection points come from the second derivative.",
    "check": "The larger inflection point should lie to the right of the local max at $x=2$ (past the hilltop the curve switches from concave down to concave up): $2+\\sqrt2>2$."
  },
  "db-ftc-003": {
    "spot": "Both limits move with $x$ ($x$ and $2x$) — Fundamental Theorem of Calculus plus Chain Rule: plug in the upper limit times its derivative, minus the lower limit plugged in times its derivative.",
    "why": "$e^{-t^2}$ has no elementary antiderivative, so integrating first and then differentiating goes nowhere; the Leibniz rule never needs the integral at all.",
    "steps": [
      "General formula: $\\frac{d}{dx}\\int_{a(x)}^{b(x)}g(t)\\,dt=g(b(x))\\,b'(x)-g(a(x))\\,a'(x)$.",
      "Upper limit $2x$: $e^{-(2x)^2}\\cdot 2=2e^{-4x^2}$; lower limit $x$: $e^{-x^2}\\cdot 1$. So $F'(x)=2e^{-4x^2}-e^{-x^2}$.",
      "Plug in $x=1$: $F'(1)=2e^{-4}-e^{-1}$."
    ],
    "trap": "Forgetting to multiply by the upper limit's derivative $2$, getting $e^{-4}-e^{-1}$; or writing $e^{-4x^2}$ as $e^{-2x^2}$ (forgetting to square all of $2x$).",
    "check": "$F'(1)\\approx 0.0366-0.3679<0$: the integrand is decreasing, so as the interval $[x,2x]$ shifts right it covers smaller values, and $F$ decreasing near $x=1$ makes sense."
  },
  "db-ftc-004": {
    "spot": "The upper limit is $\\sqrt x$, not $x$ — on top of the Fundamental Theorem of Calculus you must multiply by the upper limit's derivative $\\frac{1}{2\\sqrt x}$.",
    "why": "$\\cos(t^2)$ (a Fresnel integral) has no elementary antiderivative, so the only route is the Fundamental Theorem plus the Chain Rule.",
    "steps": [
      "Fundamental Theorem: $\\frac{d}{du}\\int_0^u\\cos(t^2)\\,dt=\\cos(u^2)$; here $u=\\sqrt x$, so $\\cos(u^2)=\\cos x$.",
      "Chain Rule: multiply by $\\frac{du}{dx}=\\frac{1}{2\\sqrt x}$ to get $F'(x)=\\frac{\\cos x}{2\\sqrt x}$.",
      "Plug in $x=1$: $F'(1)=\\frac{\\cos 1}{2}$."
    ],
    "trap": "Stopping at $\\cos(\\sqrt x^{\\,2})=\\cos x$ and forgetting to multiply by $\\frac{1}{2\\sqrt x}$, answering $\\cos 1$.",
    "check": "Numerically differentiating $F$ at $x=1$ agrees with $\\frac{\\cos 1}{2}\\approx 0.270$."
  },
  "db-lin-006": {
    "spot": "\"Use differentials to estimate the error\": $\\Delta V\\approx V'(r)\\,\\Delta r$. The derivative of a sphere's volume with respect to the radius is exactly the surface area $4\\pi r^2$.",
    "why": "Linear approximation is a single multiplication; actually computing $V(10.1)-V(10)$ means expanding a cube, and the problem asks for differentials anyway.",
    "steps": [
      "$V=\\frac{4}{3}\\pi r^3$, $dV=4\\pi r^2\\,dr$.",
      "Plug in $r=10$: $4\\pi\\cdot 100=400\\pi$.",
      "Multiply by the maximum error $dr=0.1$: $dV=400\\pi\\cdot 0.1=40\\pi$."
    ],
    "trap": "Using $dV=4\\pi r^2$ but forgetting to multiply by $dr$, answering $400\\pi$; or giving the relative error $1\\%$ as the answer.",
    "check": "The actual increase $V(10.1)-V(10)\\approx 126.9$ is a bit more than $40\\pi\\approx 125.7$ — the neglected $dr^2$ and $dr^3$ terms are small."
  },
  "db-lin-007": {
    "spot": "A cube's surface area is $S=6s^2$; \"use differentials to estimate the error\" means $dS=S'(s)\\,ds$.",
    "why": "Linear approximation is one multiplication; computing $S(2.01)-S(2)$ directly also works, but the problem wants the differential estimate.",
    "steps": [
      "$S=6s^2$, $dS=12s\\,ds$.",
      "Plug in $s=2$: $12\\cdot 2=24$.",
      "Multiply by $ds=0.01$: $dS=24\\cdot 0.01=0.24$."
    ],
    "trap": "Writing the surface area as $s^2$ (one face only) or $s^3$ (that is the volume), which gives $0.04$ and $0.12$ respectively.",
    "check": "The actual increase $S(2.01)-S(2)=0.2406$ differs from $0.24$ by only $6\\,ds^2=0.0006$."
  },
  "db-par-004": {
    "spot": "Both $x$ and $y$ are given in terms of a parameter $t$ — $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$, no need to eliminate $t$ first.",
    "why": "Here you could eliminate to get $y=x\\ln x$, but the parametric quotient is one line and you never have to think about the domain.",
    "steps": [
      "$\\frac{dx}{dt}=e^t$.",
      "$\\frac{dy}{dt}=e^t+te^t$ (Product Rule).",
      "Divide: $\\frac{dy}{dx}=\\frac{e^t(1+t)}{e^t}=1+t$; plugging in $t=1$ gives $2$."
    ],
    "trap": "Computing $\\frac{dy}{dx}$ as $\\frac{dx/dt}{dy/dt}$ (upside down), getting $\\frac{1}{2}$.",
    "check": "Eliminate $t$: $t=\\ln x$, $y=x\\ln x$, $y'=\\ln x+1$; $t=1$ corresponds to $x=e$, and $y'(e)=2$."
  },
  "dd-rr-008": {
    "spot": "You are given the rate of change of the area and want the rate of change of the radius — differentiate $A=4\\pi r^2$ with respect to time, and the Chain Rule links the two rates.",
    "why": "The standard related rates routine: write the relation, differentiate in $t$, and only then plug in numbers; plugging in $r=5$ before differentiating turns $r$ into a constant.",
    "steps": [
      "Sphere surface area $A=4\\pi r^2$; differentiate in $t$: $\\frac{dA}{dt}=8\\pi r\\frac{dr}{dt}$.",
      "Plug in $r=5$, $\\frac{dA}{dt}=-1$: $-1=40\\pi\\frac{dr}{dt}$.",
      "$\\frac{dr}{dt}=-\\frac{1}{40\\pi}$; the question asks for the rate of shrinking, so take the magnitude: $\\frac{1}{40\\pi}$ cm/min."
    ],
    "trap": "Differentiating the volume formula $V=\\frac{4}{3}\\pi r^3$ (the problem gives surface area), getting $\\frac{1}{100\\pi}$.",
    "check": "Size: a sphere of radius $5$ has surface area about $314$; losing $1$ square cm per minute should shrink the radius only slightly: $\\frac{1}{40\\pi}\\approx 0.008$."
  },
  "depth-der-011": {
    "spot": "The Hessian determinant is $f_{xx}f_{yy}-f_{xy}^2$; $f=x^2y+y^3$ is a polynomial, so the three second partials can be written down at a glance.",
    "why": "For a $2\\times 2$, filling in the formula directly is fastest; no need to find or classify critical points first.",
    "steps": [
      "$f_x=2xy$, $f_{xx}=2y$, which is $2$ at $(1,1)$.",
      "$f_y=x^2+3y^2$, $f_{yy}=6y$, which is $6$ at $(1,1)$.",
      "Mixed partial $f_{xy}=\\frac{\\partial}{\\partial y}(2xy)=2x$, which is $2$ at $(1,1)$.",
      "$\\det H=2\\cdot 6-2^2=8$."
    ],
    "trap": "Writing the mixed partial as $0$ (thinking $x^2y$ is differentiated in $x$ and $y$ \"separately\"), getting $12$.",
    "check": "At a general point the determinant is $2y\\cdot 6y-4x^2=12y^2-4x^2$; at $(1,1)$ that is $8$."
  },
  "depth-der-014": {
    "spot": "The $z$-component of the curl uses only the first two components: $(\\nabla\\times\\mathbf F)_z=\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}$; the third component $z$ plays no part.",
    "why": "Only one component is needed, so no need to expand the full 3x3 determinant; just remember \"$Q$ in $x$ minus $P$ in $y$\".",
    "steps": [
      "$P=x^2y$, $Q=xy^2$. $\\frac{\\partial Q}{\\partial x}=y^2$.",
      "$\\frac{\\partial P}{\\partial y}=x^2$.",
      "Subtract: $(\\nabla\\times\\mathbf F)_z=y^2-x^2$."
    ],
    "trap": "Reversing the order to $\\frac{\\partial P}{\\partial y}-\\frac{\\partial Q}{\\partial x}=x^2-y^2$, off by a sign.",
    "check": "Green's Theorem: on the unit square, $\\oint P\\,dx+Q\\,dy$ should equal $\\iint(y^2-x^2)\\,dA=\\frac{1}{3}-\\frac{1}{3}=0$."
  },
  "depth-int-007": {
    "spot": "$\\sqrt x$ appears both inside $\\arctan$ and in the denominator — the $\\frac{1}{\\sqrt x}$ in the denominator is exactly $2\\,d(\\sqrt x)$, so $u=\\sqrt x$ leaves just $2\\int\\arctan u\\,du$.",
    "why": "Substituting first clears the root, and what remains, $\\arctan u$ times $1$ by parts, is a standard problem; integrating by parts without substituting gets tangled in the roots.",
    "steps": [
      "Let $u=\\sqrt x$, $du=\\frac{dx}{2\\sqrt x}$, so $\\frac{dx}{\\sqrt x}=2\\,du$: the integral $=2\\int\\arctan u\\,du$.",
      "Integration by parts, differentiating $\\arctan u$ and integrating $1$: $\\int\\arctan u\\,du=u\\arctan u-\\int\\frac{u}{1+u^2}\\,du=u\\arctan u-\\frac{1}{2}\\ln(1+u^2)$.",
      "Multiply by $2$ and substitute back $u=\\sqrt x$ ($u^2=x$): $2\\sqrt x\\arctan\\sqrt x-\\ln(1+x)+C$.",
      "So $\\int\\frac{\\arctan\\sqrt x}{\\sqrt x}\\,dx=2\\sqrt x\\arctan\\sqrt x-\\ln(1+x)+C$."
    ],
    "trap": "Forgetting the $2$ in $dx=2u\\,du$ after substituting, which halves the answer: $\\sqrt x\\arctan\\sqrt x-\\frac{1}{2}\\ln(1+x)$.",
    "check": "Differentiating the answer should give back $\\frac{\\arctan\\sqrt x}{\\sqrt x}$."
  },
  "depth-int-021": {
    "spot": "$\\sin^4x$ is an even power — apply power-reduction twice to get a constant plus a few cosines; over whole periods the cosines all integrate to $0$, leaving only the constant.",
    "why": "On $[0,\\pi]$ both $\\cos 2x$ and $\\cos 4x$ run through whole periods, so after expanding you see at a glance that only the constant survives; Wallis works too, but you have to remember to fold in half first.",
    "steps": [
      "$\\sin^2x=\\frac{1-\\cos 2x}{2}$; squaring: $\\sin^4x=\\frac{1-2\\cos 2x+\\cos^22x}{4}$.",
      "Reduce once more with $\\cos^22x=\\frac{1+\\cos 4x}{2}$: $\\sin^4x=\\frac{3}{8}-\\frac{1}{2}\\cos 2x+\\frac{1}{8}\\cos 4x$.",
      "On $[0,\\pi]$ the integrals of $\\cos 2x$ and $\\cos 4x$ are both $0$.",
      "Only the constant remains: $\\frac{3}{8}\\cdot\\pi=\\frac{3\\pi}{8}$."
    ],
    "trap": "Thinking the average of $\\sin^4x=(\\sin^2x)^2$ is $(\\frac{1}{2})^2=\\frac{1}{4}$ and answering $\\frac{\\pi}{4}$ — the average of a square is not the square of the average.",
    "check": "Wallis: $2\\cdot\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{3\\pi}{8}$, the same."
  },
  "depth-int-028": {
    "spot": "A polynomial times $\\ln x$ — integrate by parts so that $\\ln x$ gets differentiated (it becomes $\\frac{1}{x}$, which cancels against the polynomial) and $x^2$ gets integrated.",
    "why": "LIATE order: the logarithm is the one to differentiate; integrating $\\ln x$ instead only makes things worse.",
    "steps": [
      "$u=\\ln x$, $dv=x^2\\,dx$: $\\int x^2\\ln x\\,dx=\\frac{x^3}{3}\\ln x-\\int\\frac{x^3}{3}\\cdot\\frac{1}{x}\\,dx=\\frac{x^3}{3}\\ln x-\\frac{x^3}{9}$.",
      "The lower limit $0$ is a singular point: $\\lim_{x\\to 0^+}x^3\\ln x=0$ (the polynomial beats the logarithm).",
      "Evaluate at the limits: $\\left(0-\\frac{1}{9}\\right)-0=-\\frac{1}{9}$."
    ],
    "trap": "Thinking a negative answer means a mistake — $\\ln x<0$ on $(0,1)$, so the integrand is negative throughout and the answer should be negative.",
    "check": "Parameter trick: differentiating $\\int_0^1x^a\\,dx=\\frac{1}{a+1}$ with respect to $a$ gives $\\int_0^1x^a\\ln x\\,dx=-\\frac{1}{(a+1)^2}$, and $a=2$ gives $-\\frac{1}{9}$."
  },
  "depth-lim-003": {
    "spot": "$x\\to 0$ with denominator $x^2$ — expand the numerator to second order; $e^{\\sin x}$ is a composition, so treat $\\sin x$ as $u$ in $e^u=1+u+\\frac{u^2}{2}+\\cdots$, then substitute $u=x+O(x^3)$ back.",
    "why": "Substituting Taylor expansions through second order shows the answer; L'Hôpital's Rule would mean differentiating $e^{\\sin x}$ twice, and the Chain Rule plus Product Rule make it easy to drop a term.",
    "steps": [
      "$e^u=1+u+\\frac{u^2}{2}+O(u^3)$ with $u=\\sin x$: $e^{\\sin x}=1+\\sin x+\\frac{\\sin^2x}{2}+O(x^3)$.",
      "$\\sin x=x-\\frac{x^3}{6}+\\cdots$ differs from $x$ only at third order, so $\\sin x-x$ is negligible compared with $x^2$; $\\sin^2x=x^2+O(x^4)$.",
      "Numerator $=e^{\\sin x}-1-x=\\frac{x^2}{2}+O(x^3)$; dividing by $x^2$ gives $\\frac{1}{2}$."
    ],
    "trap": "Using $\\sin x\\approx x$ to write $e^{\\sin x}\\approx e^x$ and then taking the quadratic term of $e^x-1-x$ — it happens to work here, but with $x^3$ in the denominator it would fail, because the cubic term of $\\sin x$ comes into play.",
    "check": "Plug in a small $x=0.001$: $\\frac{e^{\\sin x}-1-x}{x^2}\\approx 0.5$."
  },
  "depth-lim-012": {
    "spot": "$(1+\\cdots)^{1/x}\\to e$, and the problem subtracts $e$ and divides by $x$ — it wants \"how fast it approaches $e$\", so the exponent $\\frac{\\ln(1+x+x^2)}{x}$ must be expanded to first order.",
    "why": "For a variable power, take logs first to turn it into an exponent, then expand; applying L'Hôpital's Rule directly means differentiating $(1+x+x^2)^{1/x}$, and the logarithmic differentiation gets long.",
    "steps": [
      "Rewrite: $(1+x+x^2)^{1/x}=\\exp\\left(\\frac{\\ln(1+x+x^2)}{x}\\right)$.",
      "$\\ln(1+w)=w-\\frac{w^2}{2}+\\cdots$ with $w=x+x^2$: $\\ln(1+x+x^2)=x+x^2-\\frac{x^2}{2}+O(x^3)=x+\\frac{x^2}{2}+O(x^3)$.",
      "So the exponent $=1+\\frac{x}{2}+O(x^2)$, and $\\exp=e\\cdot e^{x/2+O(x^2)}=e\\left(1+\\frac{x}{2}+O(x^2)\\right)$.",
      "Subtract $e$ and divide by $x$: $\\frac{e\\cdot\\frac{x}{2}}{x}\\to\\frac{e}{2}$."
    ],
    "trap": "Seeing only the $(1+x)^{1/x}$ part and borrowing the result $\\frac{(1+x)^{1/x}-e}{x}\\to-\\frac{e}{2}$, answering $-\\frac{e}{2}$ — the $x^2$ changes the log's quadratic term from $-\\frac{1}{2}$ to $+\\frac{1}{2}$.",
    "check": "Comparison case $\\frac{(1+x)^{1/x}-e}{x}\\to-\\frac{e}{2}$: the extra $x^2$ contributes $+x$ in the exponent, which pushes $-\\frac{e}{2}$ to exactly $-\\frac{e}{2}+e=\\frac{e}{2}$."
  },
  "depth-ser-005": {
    "spot": "$\\cos(x^2)$ — no actual differentiation needed: replace $z$ by $x^2$ in $\\cos z=1-\\frac{z^2}{2}+\\frac{z^4}{24}-\\cdots$, and $z^4$ is $x^8$.",
    "why": "Substituting into a known series reads off the coefficient in one line; differentiating $\\cos(x^2)$ eight times is not something you can finish on an exam.",
    "steps": [
      "$\\cos z=1-\\frac{z^2}{2}+\\frac{z^4}{24}-\\cdots$; the coefficient of $z^4$ is $\\frac{1}{4!}=\\frac{1}{24}$.",
      "Substitute $z=x^2$: $\\cos(x^2)=1-\\frac{x^4}{2}+\\frac{x^8}{24}-\\cdots$; only powers that are multiples of $4$ appear.",
      "$x^8$ comes from $z^4=(x^2)^4$, with coefficient $\\frac{1}{24}$."
    ],
    "trap": "Thinking $x^8$ corresponds to the $8$-th term of the $\\cos$ series and answering $\\frac{1}{8!}=\\frac{1}{40320}$ — $x^8=(x^2)^4$, so you need the coefficient of $z^4$.",
    "check": "Converted to a derivative: $f^{(8)}(0)=8!\\cdot\\frac{1}{24}=1680$, a positive integer, which makes sense."
  },
  "depth-ser-013": {
    "spot": "Alternating sign $(-1)^n$ with an even factorial $(2n)!$ — exactly the shape of $\\cos x=\\sum\\frac{(-1)^nx^{2n}}{(2n)!}$, here with $x=1$.",
    "why": "Recognize the known series and read off the value; grinding partial sums only gives an approximation and never reveals $\\cos 1$.",
    "steps": [
      "$\\cos x=1-\\frac{x^2}{2!}+\\frac{x^4}{4!}-\\cdots=\\sum_{n=0}^\\infty\\frac{(-1)^nx^{2n}}{(2n)!}$, as the Taylor coefficients of $\\cos$ show; for example the coefficient of $x^4$ is $\\frac{1}{24}$.",
      "Each term in the problem is $\\frac{(-1)^n}{(2n)!}=\\frac{(-1)^n\\cdot 1^{2n}}{(2n)!}$, which is the case $x=1$.",
      "So the sum is $\\cos 1$. The first six terms $1-\\frac{1}{2}+\\frac{1}{24}-\\frac{1}{720}+\\frac{1}{40320}-\\frac{1}{3628800}$ already agree with $\\cos 1$."
    ],
    "trap": "Confusing it with $\\sum\\frac{(-1)^n}{(2n+1)!}=\\sin 1$: even factorials mean $\\cos$, odd factorials mean $\\sin$.",
    "check": "The first two terms give $1-\\frac{1}{2}=\\frac{1}{2}$, and adding $\\frac{1}{24}$ gives $0.5417$; an alternating series' sum lies between consecutive partial sums, and $\\cos 1\\approx 0.5403$ is between $0.5$ and $0.5417$."
  },
  "depth-ser-018": {
    "spot": "Alternating sign with an odd factorial $(2n+1)!$ — exactly $\\sin x=\\sum\\frac{(-1)^nx^{2n+1}}{(2n+1)!}$, here with $x=1$.",
    "why": "Recognize the known series and read off the value; partial sums only give an approximation, not a closed form.",
    "steps": [
      "$\\sin x=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\cdots$; for example the coefficient of $x^3$ is $-\\frac{1}{6}$.",
      "Each term in the problem is $\\frac{(-1)^n}{(2n+1)!}=\\frac{(-1)^n\\cdot 1^{2n+1}}{(2n+1)!}$, the case $x=1$.",
      "So the sum is $\\sin 1$. The first six terms $1-\\frac{1}{6}+\\frac{1}{120}-\\frac{1}{5040}+\\frac{1}{362880}-\\frac{1}{39916800}$ already agree with $\\sin 1$."
    ],
    "trap": "Reading $(2n+1)!$ as $(2n)!$ and answering $\\cos 1$; or dropping the alternating sign, which gives $\\sinh 1$.",
    "check": "An alternating series' sum lies between consecutive partial sums: $1-\\frac{1}{6}\\approx 0.833<\\sin 1\\approx 0.841<0.833+\\frac{1}{120}$."
  },
  "der-051": {
    "spot": "The Hessian of a quadratic polynomial is a constant matrix — $f_{xx}=2$, $f_{yy}=2$, $f_{xy}=1$, no point to plug in at all.",
    "why": "Fill in $f_{xx}f_{yy}-f_{xy}^2$ directly; the second partials of a quadratic are just its coefficients, no need to compute first derivatives first.",
    "steps": [
      "$f_{xx}=2$, $f_{yy}=2$.",
      "$f_x=2x+y$; differentiating in $y$: $f_{xy}=1$.",
      "$\\det H=2\\cdot 2-1^2=3$."
    ],
    "trap": "Taking the coefficient $1$ of the $xy$ term as an off-diagonal entry and dividing it by $2$ (the quadratic-form matrix convention), getting $f_{xy}=\\frac{1}{2}$ and determinant $\\frac{15}{4}$ — the Hessian holds second partials, not the quadratic-form matrix.",
    "check": "$\\det H>0$ and $f_{xx}>0$, so $f$ is an upward-opening bowl; indeed $x^2+xy+y^2=(x+\\frac{y}{2})^2+\\frac{3}{4}y^2\\ge 0$."
  },
  "gap-int-triple-001": {
    "spot": "The integrand $xyz$ factors into three single-variable pieces and the region is a box — the triple integral splits directly into a product of three identical single-variable integrals.",
    "why": "Separable integrand on a box: just multiply; integrating layer by layer gives the same result but repeats the work twice.",
    "steps": [
      "Separable: $\\int_0^1\\int_0^1\\int_0^1xyz\\,dz\\,dy\\,dx=\\left(\\int_0^1x\\,dx\\right)\\left(\\int_0^1y\\,dy\\right)\\left(\\int_0^1z\\,dz\\right)$.",
      "Each one is $\\int_0^1x\\,dx=\\frac{1}{2}$.",
      "Multiply: $\\left(\\frac{1}{2}\\right)^3=\\frac{1}{8}$."
    ],
    "trap": "Thinking the triple integral means three $\\frac{1}{2}$'s added together, answering $\\frac{3}{2}$; separable means multiply.",
    "check": "The average of $xyz$ over the box is $\\left(\\frac{1}{2}\\right)^3$, the box has volume $1$, so the integral equals the average."
  },
  "gap-int-triple-003": {
    "spot": "The integrand is $1$ — the triple integral is a volume; the region is the tetrahedron bounded by the coordinate planes and the plane $x+y+z=1$.",
    "why": "The cone formula $\\frac{1}{3}\\times$ base area $\\times$ height does it in one line; computing it as an integral confirms how to set the limits.",
    "steps": [
      "Innermost in $z$: $0\\le z\\le 1-x-y$, which gives the height $1-x-y$.",
      "In $y$: $0\\le y\\le 1-x$, $\\int_0^{1-x}(1-x-y)\\,dy=\\frac{(1-x)^2}{2}$ (the area of a right triangle).",
      "In $x$: $\\int_0^1\\frac{(1-x)^2}{2}\\,dx=\\frac{1}{6}$."
    ],
    "trap": "Setting all limits from $0$ to $1$ (a box) gives $1$; restricting only the upper limit of $z$ while keeping $y$ from $0$ to $1$ is also wrong.",
    "check": "Cone formula: the base is a right triangle with legs $1$, area $\\frac{1}{2}$; the height is $1$; volume $\\frac{1}{3}\\cdot\\frac{1}{2}\\cdot 1=\\frac{1}{6}$."
  },
  "gap-int-triple-004": {
    "spot": "The upper limits nest: $z\\le y\\le x\\le 1$ — integrate in order from the inside out, each upper limit being the next outer variable; the region is the \"sorted\" tetrahedron $0\\le z\\le y\\le x\\le 1$.",
    "why": "The order is already set up; integrate once per layer from the inside out, and each layer is a one-line polynomial.",
    "steps": [
      "Innermost: $\\int_0^y1\\,dz=y$.",
      "Middle: $\\int_0^xy\\,dy=\\frac{x^2}{2}$.",
      "Outer: $\\int_0^1\\frac{x^2}{2}\\,dx=\\frac{1}{6}$."
    ],
    "trap": "Replacing the inner upper limits by $1$ before doing the outer integrals, getting $\\int_0^1\\int_0^1\\int_0^1=1$.",
    "check": "In the unit box the three coordinates can be ordered in $3!=6$ equally likely ways, each taking up $\\frac{1}{6}$ of the volume."
  },
  "gap-int-triple-006": {
    "spot": "$x^2+y^2+z^2\\le 4$ is a solid ball of radius $2$ — the volume formula $\\frac{4}{3}\\pi r^3$, or add up spherical shells in spherical coordinates.",
    "why": "For a spherically symmetric region, spherical coordinates reduce the triple integral to a single integral in $r$; Cartesian coordinates bring a pile of square roots.",
    "steps": [
      "A spherical shell of radius $r$ has area $4\\pi r^2$ and thickness $dr$: volume $=\\int_0^24\\pi r^2\\,dr$.",
      "Equivalent to the formula $\\frac{4}{3}\\pi\\cdot 2^3=\\frac{32\\pi}{3}$.",
      "Check with a different slicing: horizontal disks, where the cross-section at height $z$ has squared radius $4-z^2$; $\\int_{-2}^2\\pi(4-z^2)\\,dz$ also gives $\\frac{32\\pi}{3}$."
    ],
    "trap": "Seeing $\\le 4$ and taking the radius as $4$, getting $\\frac{256\\pi}{3}$; $4$ is the radius squared.",
    "check": "The ball's volume is less than the circumscribed cube's (side $4$, volume $64$), roughly half of it: $\\frac{32\\pi}{3}\\approx 33.5$."
  },
  "gap-ser-root-001": {
    "spot": "The coefficient $\\frac{3^n}{n^2}$ contains $3^n$ — the $n$-th root or the ratio both turn it into $3$, and the polynomial $n^2$ under an $n$-th root tends to $1$, not affecting the radius.",
    "why": "For an exponential-times-polynomial coefficient, the Ratio or Root Test is one line; the polynomial factor only affects convergence at the endpoints, not the radius.",
    "steps": [
      "Ratio: $\\left|\\frac{a_{n+1}}{a_n}\\right|=\\frac{3^{n+1}/(n+1)^2}{3^n/n^2}=3\\cdot\\frac{n^2}{(n+1)^2}$.",
      "As $n\\to\\infty$, $\\frac{n^2}{(n+1)^2}\\to 1$, so the ratio tends to $3$.",
      "The radius of convergence is the reciprocal: $R=\\frac{1}{3}$."
    ],
    "trap": "Taking the ratio limit $3$ directly as the radius; the radius is $\\frac{1}{L}$.",
    "check": "At $x=\\frac{1}{3}$ the series becomes $\\sum\\frac{1}{n^2}$ (convergent); the polynomial factor only changes endpoint behavior, and the radius is still $\\frac{1}{3}$."
  },
  "gap-ser-root-002": {
    "spot": "The coefficient is \"something to the $n$-th power\", $\\left(\\frac{n}{n+1}\\right)^n$ — the Root Test strips off the outer $n$-th power directly.",
    "why": "The Root Test gives $\\frac{n}{n+1}$ in one step; the Ratio Test means dividing $n$-th powers of two different bases, much more trouble.",
    "steps": [
      "$\\sqrt[n]{|a_n|}=\\frac{n}{n+1}$.",
      "As $n\\to\\infty$, $\\frac{n}{n+1}\\to 1$.",
      "Radius of convergence $R=\\frac{1}{1}=1$."
    ],
    "trap": "Seeing $\\left(\\frac{n}{n+1}\\right)^n\\to\\frac{1}{e}$ and thinking the radius is $e$; the coefficients themselves tend to $\\frac{1}{e}$, but after the $n$-th root they tend to $1$.",
    "check": "The Ratio Test agrees: the coefficients tend to the nonzero constant $\\frac{1}{e}$, so the ratio of consecutive coefficients tends to $1$."
  },
  "gap-ser-taylor-002": {
    "spot": "The derivatives of $\\cos x$ at $0$ cycle through $1,0,-1,0,1$ — only even-power terms, so the degree-four polynomial has just three terms.",
    "why": "Just recall the derivative cycle of $\\cos$ once; nothing to compute beyond factorials.",
    "steps": [
      "$f(0)=1$, $f'(0)=-\\sin 0=0$, $f''(0)=-\\cos 0=-1$.",
      "$f'''(0)=\\sin 0=0$, $f^{(4)}(0)=\\cos 0=1$; coefficient $\\frac{f^{(4)}(0)}{4!}=\\frac{1}{24}$.",
      "$P_4(x)=1-\\frac{x^2}{2}+\\frac{x^4}{24}$."
    ],
    "trap": "Forgetting the minus sign on $\\frac{x^2}{2!}$ and writing $1+\\frac{x^2}{2}+\\frac{x^4}{24}$ (that is $\\cosh x$).",
    "check": "The error starts at $x^6$: $\\frac{\\cos x-P_4(x)}{x^6}\\to-\\frac{1}{720}$."
  },
  "gx-056": {
    "spot": "The region enclosed by the two curves $y=x$ and $y=x^2$ — first solve for the intersections to get the limits, then integrate \"top minus bottom\".",
    "why": "Integrating in $x$ is most direct: on $[0,1]$ the line stays above the parabola, so one integral does it.",
    "steps": [
      "Intersections: $x=x^2\\Rightarrow x=0$ or $x=1$.",
      "On $(0,1)$, $x>x^2$ (e.g. $x=\\frac{1}{2}$: $\\frac{1}{2}>\\frac{1}{4}$), so the line is on top.",
      "Area $=\\int_0^1(x-x^2)\\,dx=\\frac{1}{2}-\\frac{1}{3}=\\frac{1}{6}$."
    ],
    "trap": "Flipping top and bottom to get $\\int_0^1(x^2-x)\\,dx=-\\frac{1}{6}$; an area cannot be negative.",
    "check": "Integrating in $y$ also works: right boundary $x=\\sqrt y$, left boundary $x=y$, $\\int_0^1(\\sqrt y-y)\\,dy=\\frac{2}{3}-\\frac{1}{2}=\\frac{1}{6}$."
  },
  "gx-058": {
    "spot": "$\\frac{1}{1+x^2}$ is the derivative of $\\arctan x$ — the area under the curve is just a difference of antiderivative values.",
    "why": "Recognizing a standard derivative finishes it in one step; no substitution needed.",
    "steps": [
      "$\\frac{d}{dx}\\arctan x=\\frac{1}{1+x^2}$.",
      "The curve is above the $x$-axis, so area $=\\int_0^1\\frac{dx}{1+x^2}=\\arctan 1-\\arctan 0$.",
      "$\\arctan 1=\\frac{\\pi}{4}$, so the area $=\\frac{\\pi}{4}$."
    ],
    "trap": "Using $\\ln(1+x^2)$ as the antiderivative and getting $\\ln 2$ — that is the antiderivative of $\\frac{2x}{1+x^2}$; it needs $2x$ in the numerator.",
    "check": "The curve drops from $1$ to $\\frac{1}{2}$, so the area should be between $\\frac{1}{2}$ and $1$: $\\frac{\\pi}{4}\\approx 0.785$."
  },
  "hc-der-005": {
    "spot": "A high-order derivative at $x=0$ — read it from the Taylor coefficient: the series of $x^2\\sin x$ is the series of $\\sin x$ multiplied through by $x^2$, so the $x^7$ coefficient comes from the $x^5$ term of $\\sin x$.",
    "why": "Differentiating seven times means the Product Rule over and over; reading the series coefficient and multiplying by $7!$ takes two lines.",
    "steps": [
      "$\\sin x=x-\\frac{x^3}{6}+\\frac{x^5}{120}-\\cdots$; multiply by $x^2$: $x^2\\sin x=x^3-\\frac{x^5}{6}+\\frac{x^7}{120}-\\cdots$.",
      "So the coefficient of $x^7$ is $a_7=\\frac{1}{120}$.",
      "$f^{(7)}(0)=7!\\,a_7=\\frac{5040}{120}=42$."
    ],
    "trap": "Giving the coefficient $\\frac{1}{120}$ as the answer, or multiplying by $5!$ instead of $7!$. The factorial to multiply by is that of the power of $x$ itself, $7!$.",
    "check": "Leibniz rule: only the second derivative $2$ of $x^2$ is nonzero at $0$, so $(x^2\\sin x)^{(7)}(0)=\\binom{7}{2}\\cdot 2\\cdot\\sin^{(5)}(0)=21\\cdot 2\\cdot 1=42$."
  },
  "lm-rs-006": {
    "spot": "The sum contains $\\frac{1}{\\sqrt{n^2+k^2}}$ — factor out $n$ to get $\\frac{1}{n}\\cdot\\frac{1}{\\sqrt{1+(k/n)^2}}$, a standard Riemann sum with $\\frac{k}{n}\\to x$ and $\\frac{1}{n}\\to dx$.",
    "why": "The $n$-term sum has no closed form; rewritten as a Riemann sum, its limit is a definite integral.",
    "steps": [
      "Factor out $n$: $\\frac{1}{\\sqrt{n^2+k^2}}=\\frac{1}{n}\\cdot\\frac{1}{\\sqrt{1+(k/n)^2}}$.",
      "As $k=1,\\dots,n$, the points $x=\\frac{k}{n}$ fill $(0,1]$, so the limit $=\\int_0^1\\frac{dx}{\\sqrt{1+x^2}}$.",
      "Antiderivative $\\ln\\left(x+\\sqrt{1+x^2}\\right)$ (that is, $\\operatorname{arsinh}x$); evaluate at $1$ minus at $0$: $\\ln(1+\\sqrt2)-\\ln 1$."
    ],
    "trap": "Integrating $\\frac{1}{\\sqrt{1+x^2}}$ as $\\arctan x$ and getting $\\frac{\\pi}{4}$ — $\\arctan$ goes with $\\frac{1}{1+x^2}$, which has no square root.",
    "check": "On $[0,1]$ the integrand drops from $1$ to $\\frac{1}{\\sqrt2}$, so the integral lies between them: $\\ln(1+\\sqrt2)\\approx 0.881$."
  },
  "mob-limtrap-006": {
    "spot": "The numerator already subtracts $1+\\frac{x}{2}$ — exactly the first two terms of the Taylor expansion of $\\sqrt{1+x}$, so what remains is the quadratic coefficient.",
    "why": "The binomial expansion of $(1+x)^{1/2}$ reads off the $x^2$ coefficient in one line; L'Hôpital's Rule would need two derivatives, and rationalizing would need to be done twice.",
    "steps": [
      "$(1+x)^{1/2}=1+\\frac{1}{2}x+\\frac{\\frac{1}{2}\\left(-\\frac{1}{2}\\right)}{2}x^2+\\cdots$.",
      "The quadratic coefficient is $\\frac{f''(0)}{2}=\\frac{-1/4}{2}=-\\frac{1}{8}$.",
      "Numerator $=-\\frac{x^2}{8}+O(x^3)$; dividing by $x^2$: the limit is $-\\frac{1}{8}$."
    ],
    "trap": "Computing the binomial coefficient as $\\frac{\\frac{1}{2}\\cdot\\frac{1}{2}}{2}=\\frac{1}{8}$, missing the minus sign in $\\frac{1}{2}-1=-\\frac{1}{2}$.",
    "check": "$\\sqrt{1+x}$ is concave, so the curve lies below its tangent line $1+\\frac{x}{2}$; the numerator is less than $0$ and the limit must be negative."
  },
  "mob-lm-003": {
    "spot": "Fixed sum, maximize the product, and the three variables are fully symmetric — Lagrange multipliers give $yz=xz=xy$, i.e. all three equal; AM-GM gets there in one step.",
    "why": "For a symmetric \"fixed sum, maximize product\" problem, AM-GM is one line; Lagrange multipliers mean setting up and solving four equations.",
    "steps": [
      "Lagrange: $\\nabla(xyz)=\\lambda\\nabla(x+y+z)$ gives $yz=xz=xy=\\lambda$, and for positive values this forces $x=y=z$.",
      "Substitute into the constraint: $3x=12$, so $x=y=z=4$.",
      "Maximum value $4\\cdot 4\\cdot 4=64$; AM-GM, $xyz\\le\\left(\\frac{x+y+z}{3}\\right)^3=4^3$, guarantees it is the maximum."
    ],
    "trap": "Solving $x=y=z=4$ and answering $4$ (the coordinate of the critical point), forgetting that the question asks for the value of $xyz$.",
    "check": "Try other positive triples with sum $12$; the products are all smaller: $3\\cdot 4\\cdot 5=60$, $2\\cdot 5\\cdot 5=50$."
  },
  "mob-lm-004": {
    "spot": "Fixed product $xy$, minimize the sum of squares — $x^2+y^2\\ge 2xy$ gives the lower bound directly, with equality at $x=y$.",
    "why": "One inequality settles it in one line; Lagrange multipliers also lead to $x=y$, but with more equations to set up.",
    "steps": [
      "$x^2+y^2-2xy=(x-y)^2\\ge 0$, so $x^2+y^2\\ge 2xy=16$.",
      "Equality needs $x=y$, and together with $xy=8$: $x=y=2\\sqrt2$. Alternatively substitute $y=\\frac{8}{x}$; $g(x)=x^2+\\frac{64}{x^2}$ has zero derivative at $x=2\\sqrt2$.",
      "Minimum value $g(2\\sqrt 2)=8+8=16$."
    ],
    "trap": "Giving the minimizer $x=2\\sqrt2$ as the answer, or taking the square root of $x^2+y^2$ (the distance to the origin, $4$).",
    "check": "Try another point with $xy=8$, e.g. $(2,4)$: $4+16=20>16$."
  },
  "mob-lm-005": {
    "spot": "The constraint $x+2y=6$ is linear — solve for $y=\\frac{6-x}{2}$ and substitute, turning it into maximizing a one-variable cubic.",
    "why": "With a linear constraint, substituting to eliminate a variable is least work; Lagrange multipliers add a $\\lambda$ and give the same result.",
    "steps": [
      "Substitute: $g(x)=x^2\\cdot\\frac{6-x}{2}=3x^2-\\frac{x^3}{2}$, $0<x<6$.",
      "$g'(x)=6x-\\frac{3x^2}{2}=\\frac{3x}{2}(4-x)$; the only critical point in $(0,6)$ is $x=4$.",
      "$g''(4)=6-12<0$, so it is a maximum; then $y=1$, and the value is $g(4)=16\\cdot 1=16$."
    ],
    "trap": "Treating the variables as symmetric and splitting evenly with $x=2y$ or $x=y$, getting $x=y=2$ and value $8$; $x^2y$ weights $x$ more heavily, so an even split is wrong.",
    "check": "Weighted AM-GM: $x+2y=\\frac{x}{2}+\\frac{x}{2}+2y\\ge 3\\sqrt[3]{\\frac{x^2y}{2}}$, so $x^2y\\le 2\\cdot 8=16$, with equality at $\\frac{x}{2}=2y=2$."
  },
  "mob-lm-006": {
    "spot": "$x^2+y^2+z^2$ is the squared distance to the origin and the constraint is the plane $x+y+z=3$ — this is the squared distance from the origin to the plane.",
    "why": "The point-to-plane distance formula does it in one line; Lagrange multipliers give $2x=2y=2z=\\lambda$, which also leads to $x=y=z$.",
    "steps": [
      "Lagrange: $\\nabla(x^2+y^2+z^2)=\\lambda(1,1,1)$, $2x=2y=2z$, so $x=y=z$.",
      "Substitute back: $3x=3$, $x=y=z=1$.",
      "Minimum value $1+1+1=3$."
    ],
    "trap": "Computing the distance $\\frac{3}{\\sqrt3}=\\sqrt3$ and stopping — the question asks for the sum of squares, so square it to get $3$.",
    "check": "Cauchy-Schwarz: $(x+y+z)^2\\le 3(x^2+y^2+z^2)$, so $x^2+y^2+z^2\\ge\\frac{9}{3}=3$; the distance formula $\\left(\\frac{3}{\\sqrt3}\\right)^2$ also gives $3$."
  },
  "rel-adv-005": {
    "spot": "$u=x^2-y^2$, $v=2xy$ are exactly the real and imaginary parts of $(x+iy)^2$ — the Jacobian of such a map is $|f'|^2=4(x^2+y^2)$; if you don't remember that, just compute the $2\\times 2$ determinant.",
    "why": "All four partial derivatives are linear, so filling in the determinant directly is fastest.",
    "steps": [
      "$u_x=2x$, $u_y=-2y$.",
      "$v_x=2y$, $v_y=2x$.",
      "$\\det=u_xv_y-u_yv_x=4x^2+4y^2$.",
      "Plug in $(1,2)$: $4(1+4)=20$."
    ],
    "trap": "Getting the sign of the cross term wrong, computing $u_xv_y+u_yv_x=4x^2-4y^2$ and getting $-12$.",
    "check": "The determinant is positive everywhere except the origin: this map preserves orientation, so the value should be positive."
  },
  "rel-adv-017": {
    "spot": "$e^{x^2}$ — replace $u$ by $x^2$ in $e^u=\\sum\\frac{u^k}{k!}$; $x^6=(x^2)^3$ corresponds to $k=3$.",
    "why": "Substituting into a known series reads off the coefficient in one line; differentiating $e^{x^2}$ six times means a mountain of Product Rule.",
    "steps": [
      "$e^u=1+u+\\frac{u^2}{2}+\\frac{u^3}{6}+\\cdots$; the coefficient of $u^3$ is $\\frac{1}{3!}=\\frac{1}{6}$.",
      "Substitute $u=x^2$: $e^{x^2}=1+x^2+\\frac{x^4}{2}+\\frac{x^6}{6}+\\cdots$, with only even-power terms.",
      "The coefficient of $x^6$ is $\\frac{1}{6}$."
    ],
    "trap": "Thinking $x^6$ corresponds to the $6$-th term of the $e^x$ series and answering $\\frac{1}{720}$; $x^6=(x^2)^3$, so you need $u^3$.",
    "check": "Converted to a derivative: $\\frac{d^6}{dx^6}e^{x^2}\\Big|_0=6!\\cdot\\frac{1}{6}=120$, an integer, which makes sense."
  },
  "rel-boss-012": {
    "spot": "The region is a ball and the integrand is $x^2+y^2+z^2=r^2$ — both depend only on $r$, so in spherical coordinates the angular part integrates straight to $4\\pi$.",
    "why": "A spherically symmetric integrand on a ball: spherical coordinates turn the triple integral into a single integral in $r$; Cartesian coordinates get tangled in square-root limits.",
    "steps": [
      "Spherical coordinates: $dV=r^2\\sin\\varphi\\,dr\\,d\\varphi\\,d\\theta$, and the angular part is $\\int_0^{2\\pi}\\int_0^\\pi\\sin\\varphi\\,d\\varphi\\,d\\theta=4\\pi$.",
      "The integrand $r^2$ times the $r^2$ from the volume element: $4\\pi\\int_0^2r^4\\,dr$.",
      "$4\\pi\\cdot\\frac{32}{5}=\\frac{128\\pi}{5}$."
    ],
    "trap": "Dropping the $r^2$ of the volume element and integrating just $r^2$, getting $4\\pi\\cdot\\frac{8}{3}=\\frac{32\\pi}{3}$ (that is the ball's volume).",
    "check": "$r^2\\le 4$, so the integral is less than $4\\times$ the volume $\\frac{32\\pi}{3}$; and the average of $r^2$ is $\\frac{3}{5}\\cdot 4$, giving exactly $\\frac{12}{5}\\cdot\\frac{32\\pi}{3}=\\frac{128\\pi}{5}$."
  },
  "rel-hard-der-007": {
    "spot": "Directional derivative $=\\nabla f\\cdot\\mathbf u$; the direction $\\frac{(1,2,2)}{3}$ has length exactly $1$, so no normalizing needed.",
    "why": "Gradient dotted with a unit vector is one line; check the direction vector's length first so you don't have to divide again.",
    "steps": [
      "$\\nabla(xyz)=(yz,xz,xy)$, which at $(1,1,1)$ is $(1,1,1)$.",
      "$\\left|\\frac{(1,2,2)}{3}\\right|=\\frac{\\sqrt{1+4+4}}{3}=1$, already a unit vector.",
      "Dot product: $(1,1,1)\\cdot\\frac{(1,2,2)}{3}=\\frac{5}{3}$."
    ],
    "trap": "Dotting with $(1,2,2)$ without dividing by $3$, getting $5$; the directional derivative needs a unit vector.",
    "check": "Walk along the line $(1,1,1)+t\\frac{(1,2,2)}{3}$; the derivative of $f$ in $t$ at $t=0$ is the directional derivative."
  },
  "rel-hard-der-009": {
    "spot": "This is the classic \"rotation field\" $\\frac{(-y,x)}{x^2+y^2}$ — its circulation around the origin is $2\\pi$, but away from the origin its curl is $0$ everywhere; the point $(1,0,0)$ is not the origin.",
    "why": "Just compute $\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}$; the two Quotient Rule results look exactly alike and subtract to $0$.",
    "steps": [
      "$Q=\\frac{x}{x^2+y^2}$: $\\frac{\\partial Q}{\\partial x}=\\frac{(x^2+y^2)-2x^2}{(x^2+y^2)^2}=\\frac{y^2-x^2}{(x^2+y^2)^2}$.",
      "$P=\\frac{-y}{x^2+y^2}$: $\\frac{\\partial P}{\\partial y}=\\frac{-(x^2+y^2)+2y^2}{(x^2+y^2)^2}=\\frac{y^2-x^2}{(x^2+y^2)^2}$.",
      "Subtract: the $z$-component of the curl $=0$ (whenever $(x,y)\\ne(0,0)$), so at $(1,0,0)$ it is $0$ too."
    ],
    "trap": "Remembering \"circulation $2\\pi$ once around the origin\" and assuming the curl is nonzero, estimating it as circulation divided by enclosed area — the circulation comes from the singularity at the origin; away from it the curl is $0$ everywhere.",
    "check": "Try a point far from the origin, $(2,3)$: the two partial derivatives are again equal."
  },
  "rel-hard-int-001": {
    "spot": "$x^5e^{-2x}$ integrated from $0$ to $\\infty$ — the Gamma function shape: $\\int_0^\\infty x^ne^{-ax}\\,dx=\\frac{n!}{a^{n+1}}$.",
    "why": "The formula is one line; integration by parts would take five rounds.",
    "steps": [
      "Let $t=2x$: $x=\\frac{t}{2}$, $dx=\\frac{dt}{2}$, and the integral $=\\frac{1}{2^6}\\int_0^\\infty t^5e^{-t}\\,dt$.",
      "$\\int_0^\\infty t^5e^{-t}\\,dt=\\Gamma(6)=5!=120$.",
      "$\\frac{120}{64}=\\frac{15}{8}$."
    ],
    "trap": "Writing the denominator as $2^5$ (matching the power of $x$) instead of $2^6$, getting $\\frac{15}{4}$; the $dx=\\frac{dt}{2}$ from the substitution contributes one more $2$.",
    "check": "Integrating the original numerically gives $1.875$."
  },
  "rel-hard-int-018": {
    "spot": "The denominator is $(x^2+a^2)^2$ with $a=2$ — trigonometric substitution $x=2\\tan\\theta$ turns $x^2+4$ into $4\\sec^2\\theta$, and the whole integral becomes $\\int\\cos^2\\theta$.",
    "why": "The trigonometric substitution cancels the denominator, and the remaining $\\cos^2\\theta$ over $[0,\\frac{\\pi}{2}]$ is $\\frac{\\pi}{4}$ at a glance; partial fractions don't help here (the denominator doesn't factor over the reals).",
    "steps": [
      "$x=2\\tan\\theta$, $dx=2\\sec^2\\theta\\,d\\theta$, $x^2+4=4\\sec^2\\theta$; $x:0\\to\\infty$ corresponds to $\\theta:0\\to\\frac{\\pi}{2}$.",
      "The integral $=\\int_0^{\\pi/2}\\frac{2\\sec^2\\theta}{16\\sec^4\\theta}\\,d\\theta=\\frac{1}{8}\\int_0^{\\pi/2}\\cos^2\\theta\\,d\\theta$.",
      "$\\int_0^{\\pi/2}\\cos^2\\theta\\,d\\theta=\\frac{\\pi}{4}$, so the integral $=\\frac{\\pi}{32}$."
    ],
    "trap": "Recalling $\\int_0^\\infty\\frac{dx}{x^2+a^2}=\\frac{\\pi}{2a}$ and squaring it, getting $\\frac{\\pi^2}{16}$ — the square is in the denominator, not on the value of the integral.",
    "check": "General formula $\\frac{\\pi}{4a^3}$, and $a=2$ gives $\\frac{\\pi}{32}$; you can also differentiate $\\int_0^\\infty\\frac{dx}{x^2+a}=\\frac{\\pi}{2\\sqrt a}$ with respect to $a$ and take the negative at $a=4$."
  },
  "rel-hard-lim-007": {
    "spot": "$x$ and $y$ appear only through the product $xy$ — let $u=xy$; as $(x,y)\\to(0,0)$, $u\\to 0$, and the two-variable limit becomes the one-variable $\\frac{1-\\cos u}{u^2}$.",
    "why": "The whole expression is a function of $u=xy$, so after substituting there is no path issue to worry about; just note the function is undefined where $xy=0$, so the limit is taken within the domain.",
    "steps": [
      "Let $u=xy$; $|u|\\le\\frac{x^2+y^2}{2}\\to 0$.",
      "$1-\\cos u=\\frac{u^2}{2}-\\frac{u^4}{24}+\\cdots$.",
      "So $\\frac{1-\\cos u}{u^2}\\to\\frac{1}{2}$."
    ],
    "trap": "Worrying that a two-variable limit needs many paths, trying $y=x$, getting $\\frac{1}{2}$, and declaring the limit exists — one path cannot prove existence; substituting $u=xy$ handles all paths at once.",
    "check": "Plug in a point near the origin, $(0.1,0.2)$: $u=0.02$, and the value is very close to $\\frac{1}{2}$."
  },
  "rel-hard-lim-010": {
    "spot": "$(1+\\frac{1}{n})^n$ minus $e$ plus $\\frac{e}{2n}$, times $n^2$ — the first-order correction is already cancelled, so you want the second-order coefficient of the expansion. Let $h=\\frac{1}{n}$ and expand $\\frac{\\ln(1+h)}{h}$ to $h^2$.",
    "why": "Taking logs and expanding to second order is the systematic approach; differentiating $(1+h)^{1/h}$ twice for L'Hôpital's Rule is nearly impossible to get right.",
    "steps": [
      "Let $h=\\frac{1}{n}$: $(1+h)^{1/h}=\\exp\\left(\\frac{\\ln(1+h)}{h}\\right)$, and $\\frac{\\ln(1+h)}{h}=1-\\frac{h}{2}+\\frac{h^2}{3}-\\cdots$.",
      "So $(1+h)^{1/h}=e\\cdot\\exp\\left(-\\frac{h}{2}+\\frac{h^2}{3}+O(h^3)\\right)$; expanding $e^w=1+w+\\frac{w^2}{2}$: $1-\\frac{h}{2}+\\frac{h^2}{3}+\\frac{h^2}{8}=1-\\frac{h}{2}+\\frac{11}{24}h^2$.",
      "$(1+h)^{1/h}-e+\\frac{eh}{2}=\\frac{11e}{24}h^2+O(h^3)$; multiplying by $n^2=\\frac{1}{h^2}$: the limit is $\\frac{11e}{24}$."
    ],
    "trap": "Expanding $e^w$ only as $1+w$, missing the $\\frac{h^2}{8}$ contributed by $\\frac{w^2}{2}$, and getting $\\frac{e}{3}$.",
    "check": "Plug in a large $n=1000$: $n^2\\left((1+\\frac{1}{n})^n-e+\\frac{e}{2n}\\right)\\approx 1.245$, matching $\\frac{11e}{24}\\approx 1.246$."
  },
  "rel-hard-mv-001": {
    "spot": "The triangular region $x,y\\ge 0$, $x+y\\le 1$ with the monomial integrand $x^2y$ — integrate in $y$ first up to $1-x$, leaving a Beta-type integral of $x^2(1-x)^2$.",
    "why": "Integrating in $y$ first is easiest since $y$ appears only to the first power; the remaining $\\int_0^1x^2(1-x)^2\\,dx$ is quick by expanding or by Beta.",
    "steps": [
      "Inner: $\\int_0^{1-x}x^2y\\,dy=\\frac{x^2(1-x)^2}{2}$.",
      "Expand $x^2(1-x)^2=x^2-2x^3+x^4$; $\\int_0^1=\\frac{1}{3}-\\frac{1}{2}+\\frac{1}{5}=\\frac{1}{30}$.",
      "Multiply by $\\frac{1}{2}$: $\\frac{1}{60}$."
    ],
    "trap": "Treating the region as the unit square with all limits from $0$ to $1$, getting $\\frac{1}{3}\\cdot\\frac{1}{2}=\\frac{1}{6}$.",
    "check": "Dirichlet formula: $\\iint x^ay^b\\,dA=\\frac{a!\\,b!}{(a+b+2)!}=\\frac{2\\cdot 1}{120}=\\frac{1}{60}$."
  },
  "rel-hard-mv-003": {
    "spot": "The unit ball with integrand $x^2+y^2+z^2=r^2$ — everything depends only on $r$; in spherical coordinates the angles integrate to $4\\pi$, leaving $\\int_0^1r^2\\cdot r^2\\,dr$.",
    "why": "Spherical symmetry means spherical coordinates; in Cartesian coordinates the limits are nested square roots.",
    "steps": [
      "Angular part: $\\int_0^{2\\pi}\\int_0^\\pi\\sin\\varphi\\,d\\varphi\\,d\\theta=4\\pi$.",
      "Radial: the integrand $r^2$ times the volume element's $r^2$, $\\int_0^1r^4\\,dr=\\frac{1}{5}$.",
      "Multiply: $4\\pi\\cdot\\frac{1}{5}=\\frac{4\\pi}{5}$."
    ],
    "trap": "Forgetting the $r^2$ in the volume element and integrating $\\int_0^1r^2\\,dr$, getting $\\frac{4\\pi}{3}$ — that is the ball's volume, not this integral.",
    "check": "$r^2\\le 1$, so the integral must be less than the volume $\\frac{4\\pi}{3}$; the average of $r^2$ is $\\frac{3}{5}$, and $\\frac{3}{5}\\cdot\\frac{4\\pi}{3}=\\frac{4\\pi}{5}$."
  },
  "rel-hard-mv-009": {
    "spot": "A disk region with an integrand depending only on $x^2+y^2=r^2$ — polar coordinates: $(r^2)^2=r^4$, times the $r$ from the area element.",
    "why": "A circle with a radial function calls for polar coordinates, which split the double integral into angle times radius; Cartesian coordinates would mean expanding a fourth power and dealing with square-root limits.",
    "steps": [
      "Polar coordinates: $dA=r\\,dr\\,d\\theta$, integrand $r^4$, together $r^5$.",
      "$\\int_0^2r^5\\,dr=\\frac{64}{6}=\\frac{32}{3}$.",
      "Multiply by the angle $2\\pi$: $\\frac{64\\pi}{3}$."
    ],
    "trap": "Dropping the $r$ of the area element and integrating only $r^4$, getting $2\\pi\\cdot\\frac{32}{5}=\\frac{64\\pi}{5}$.",
    "check": "$(x^2+y^2)^2\\le 16$, so the integral is less than $16\\times$ the disk's area $4\\pi$."
  },
  "rel-hard-ser-004": {
    "spot": "$\\sin(x^2)$ — replace $u$ by $x^2$ in $\\sin u=u-\\frac{u^3}{6}+\\frac{u^5}{120}-\\cdots$; $x^{10}=(x^2)^5$ corresponds to $u^5$.",
    "why": "Substituting into a known series reads off the coefficient in one line; differentiating ten times is out of the question.",
    "steps": [
      "The $u^5$ coefficient of $\\sin u$ is $\\frac{1}{5!}=\\frac{1}{120}$.",
      "Substitute $u=x^2$: $\\sin(x^2)=x^2-\\frac{x^6}{6}+\\frac{x^{10}}{120}-\\cdots$, with powers $2,6,10,\\dots$.",
      "The coefficient of $x^{10}$ is $\\frac{1}{120}$."
    ],
    "trap": "Thinking $x^{10}$ corresponds to the $10$-th power term of $\\sin$ (there are no even powers, so answering $0$), or using $\\frac{1}{10!}$ — you need $u^5$.",
    "check": "The $x^{10}$ coefficient is positive: the coefficients of $\\sin u$ alternate plus, minus, plus over $u,u^3,u^5$, so $u^5$ is positive."
  },
  "rel-hard-ser-008": {
    "spot": "The denominator $4n^2-1=(2n-1)(2n+1)$ is a product of two factors differing by $2$ — split with partial fractions, and neighboring terms telescope.",
    "why": "After splitting, the partial sum has a closed form and the limit is obvious; a Comparison Test can only show convergence, not find the sum.",
    "steps": [
      "Partial fractions: $\\frac{1}{4n^2-1}=\\frac{1}{2}\\left(\\frac{1}{2n-1}-\\frac{1}{2n+1}\\right)$.",
      "The partial sum telescopes: $S_N=\\frac{1}{2}\\left(1-\\frac{1}{2N+1}\\right)$.",
      "As $N\\to\\infty$: $S=\\frac{1}{2}$."
    ],
    "trap": "Dropping the $\\frac{1}{2}$ in front of the partial fractions and answering $1$.",
    "check": "The first three terms $\\frac{1}{3}+\\frac{1}{15}+\\frac{1}{35}\\approx 0.429$; the remaining tail is small, so approaching $0.5$ makes sense."
  }
};
