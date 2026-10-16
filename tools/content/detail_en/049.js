// Detail v2, English — batch 049. Translation of tools/content/detail/049.js (text only; claims live in the Chinese file).
module.exports = {
  "lec-10-q2b": {
    "spot": "Intersections of the two polar curves $r=3\\cos\\theta$ and $r=1+\\cos\\theta$: at the same $\\theta$ the two values of $r$ are equal, so set the two expressions equal and solve for $\\cos\\theta$.",
    "why": "The origin is a point both curves pass through at different values of $\\theta$, so setting the $r$'s equal misses it; but the problem asks exactly for the intersections other than the origin, so solving the equation is enough.",
    "steps": [
      "Set $3\\cos\\theta=1+\\cos\\theta$, giving $2\\cos\\theta=1$, $\\cos\\theta=\\frac{1}{2}$.",
      "So $\\theta=\\pm\\frac{\\pi}{3}$, and the two intersection points are symmetric about the polar axis.",
      "Plug into either equation: $r=3\\cos\\frac{\\pi}{3}=\\frac{3}{2}$, and the other gives $1+\\frac{1}{2}=\\frac{3}{2}$ as well."
    ],
    "trap": "Stopping after solving $\\cos\\theta=\\frac{1}{2}$ and giving $\\theta=\\frac{\\pi}{3}$ as the answer; the problem wants the value of $r$, not the angle.",
    "check": "The circle $r=3\\cos\\theta$ has diameter $3$, so the $r$ of an intersection must be between $0$ and $3$; $\\frac{3}{2}$ makes sense."
  },
  "lec-10-q2d": {
    "spot": "Total length of the cardioid $r=1+\\cos\\theta$: the polar arc length formula $\\int\\sqrt{r^2+(r')^2}\\,d\\theta$, and $2+2\\cos\\theta=4\\cos^2\\frac{\\theta}{2}$ makes the root come out completely.",
    "why": "The half-angle formula turns the root into $2\\left|\\cos\\frac{\\theta}{2}\\right|$, an ordinary trig integral; attacking the expression under the root head-on gets stuck.",
    "steps": [
      "$r'=-\\sin\\theta$, $r^2+(r')^2=1+2\\cos\\theta+\\cos^2\\theta+\\sin^2\\theta=2+2\\cos\\theta$.",
      "Half-angle: $2+2\\cos\\theta=4\\cos^2\\frac{\\theta}{2}$, so $\\sqrt{\\cdots}=2\\left|\\cos\\frac{\\theta}{2}\\right|$.",
      "One full loop is $0\\le\\theta\\le2\\pi$; $\\cos\\frac{\\theta}{2}$ changes sign at $\\theta=\\pi$, so use symmetry, take the upper half and multiply by $2$: $L=2\\int_0^{\\pi}2\\cos\\frac{\\theta}{2}\\,d\\theta$.",
      "$\\int_0^{\\pi}2\\cos\\frac{\\theta}{2}\\,d\\theta=\\Big[4\\sin\\frac{\\theta}{2}\\Big]_0^{\\pi}=4$, so $L=8$."
    ],
    "trap": "Taking the root as $2\\cos\\frac{\\theta}{2}$ and integrating straight from $0$ to $2\\pi$: on the second half $\\cos\\frac{\\theta}{2}<0$ cancels the first half and you get $0$.",
    "check": "The farthest point of the cardioid is at distance $2$ from the origin, so its perimeter should be longer than a circle of radius $1$ ($2\\pi\\approx6.28$) and shorter than a circle of radius $2$ ($4\\pi$); $8$ falls in between."
  },
  "lec-10-q3b": {
    "spot": "Work to pump out water: each layer is lifted a different height (the bottom layer $4$ m, the top layer barely at all), so slice the water into thin layers and add them up.",
    "why": "The center of mass of the full tank is in the middle, so \"total weight times rise of the center of mass\" also works, but slicing and integrating works for any shape, and the two methods check each other.",
    "steps": [
      "Let $y$ be the height above the bottom of the tank, $0\\le y\\le4$; the layer at height $y$ with thickness $dy$ has volume $\\pi\\cdot1^2\\,dy$ and weight $1000\\cdot9.8\\cdot\\pi\\,dy=9800\\pi\\,dy$ newtons.",
      "This layer must be lifted to the top of the tank, a distance of $4-y$.",
      "$W=\\int_0^4 9800\\pi(4-y)\\,dy=9800\\pi\\Big[4y-\\frac{y^2}{2}\\Big]_0^4=9800\\pi\\cdot8$.",
      "$W=78400\\pi$ J."
    ],
    "trap": "Writing the lift distance as $y$ (the height measured from the bottom). Getting the same $9800\\pi\\cdot8$ here is a coincidence; it fails when the water is not lifted to the top or the tank is not full.",
    "check": "Total mass $1000\\cdot4\\pi$ kg, center of mass lifted from height $2$ to $4$: $4000\\pi\\cdot9.8\\cdot2=78400\\pi$, the same."
  },
  "lec-10-q4a": {
    "spot": "The region bounded by the parabola $y=4-x^2$ and the $x$-axis: top boundary $4-x^2$, bottom boundary $0$, intersections at $x=\\pm2$; the plate's $\\bar y=\\frac{1}{A}\\int\\frac{1}{2}f(x)^2\\,dx$.",
    "why": "Slice into vertical strips in $x$: each strip's center of mass is at half its height, so the moment is $\\frac{1}{2}f^2$; slicing in $y$ means solving $x=\\pm\\sqrt{4-y}$, which is more hassle.",
    "steps": [
      "Area $A=\\int_{-2}^{2}(4-x^2)\\,dx=\\frac{32}{3}$.",
      "Moment about the $x$-axis $M_x=\\int_{-2}^{2}\\frac{1}{2}(4-x^2)^2\\,dx=\\frac{1}{2}\\int_{-2}^{2}(16-8x^2+x^4)\\,dx$.",
      "$\\int_{-2}^{2}(16-8x^2+x^4)\\,dx=64-\\frac{128}{3}+\\frac{64}{5}=\\frac{512}{15}$, so $M_x=\\frac{256}{15}$.",
      "$\\bar y=\\frac{M_x}{A}=\\frac{256/15}{32/3}=\\frac{8}{5}$."
    ],
    "trap": "Writing the moment as $\\int y\\,dA$ and replacing $y$ directly with $4-x^2$ (the top of the strip), missing the $\\frac{1}{2}$ and getting $\\frac{16}{5}$.",
    "check": "The region is narrow on top and wide at the bottom, so the center of mass should be below half the height, $2$, but above $0$; $1.6$ makes sense."
  },
  "lec-11-m2": {
    "spot": "The fate of the geometric sequence $\\{r^n\\}$ depends entirely on how $|r|$ compares with $1$: less than $1$ shrinks to $0$, greater than $1$ blows up, and the two boundary cases with absolute value $1$, $r=1$ and $r=-1$, must be checked separately.",
    "why": "Cutting the real line into four pieces, $|r|<1$, $r=1$, $r=-1$, $|r|>1$, and checking each is more reliable than memorizing the result, and no boundary gets missed.",
    "steps": [
      "$|r|<1$: $|r|^n\\to0$, so $r^n\\to0$, convergent (negative $r$ too, e.g. $(-0.9)^n$).",
      "$r=1$: $1^n=1$ is a constant sequence, converging to $1$.",
      "$r=-1$: $(-1)^n$ jumps between $1$ and $-1$; the odd and even subsequences have different limits, so it diverges.",
      "$|r|>1$: $|r|^n\\to\\infty$, divergent.",
      "Together, the sequence converges if and only if $-1<r\\le1$."
    ],
    "trap": "Writing $|r|<1$ and missing the constant sequence $r=1$; or writing $-1\\le r\\le1$ and including $r=-1$, which keeps jumping back and forth.",
    "check": "One endpoint converges and the other does not: $r=1$ stays at $1$, while $r=-1$ jumps between $\\pm1$ forever."
  },
  "lec-11-q1d": {
    "spot": "$(3^n+4^n)^{1/n}$: of the two terms $4^n$ grows fastest, so factor it out, and the leftover $\\left(\\frac{3}{4}\\right)^n$ disappears.",
    "why": "After factoring out the largest term, the bracket is squeezed between $1$ and $2$, and the $n$-th root of both goes to $1$; taking logs and using L'Hôpital's Rule is a detour.",
    "steps": [
      "Factor out $4^n$: $(3^n+4^n)^{1/n}=4\\left(1+\\left(\\frac{3}{4}\\right)^n\\right)^{1/n}$.",
      "Squeeze: $1\\le1+\\left(\\frac{3}{4}\\right)^n\\le2$, so $1\\le\\left(1+\\left(\\frac{3}{4}\\right)^n\\right)^{1/n}\\le2^{1/n}\\to1$.",
      "So the limit is $4\\cdot1=4$."
    ],
    "trap": "Splitting $(3^n+4^n)^{1/n}$ into $3+4=7$; powers do not distribute over addition.",
    "check": "Plug in $n=20$: $(3^{20}+4^{20})^{1/20}\\approx4.0002$, already very close to $4$."
  },
  "lec-11-q3c": {
    "spot": "The recursion $a_{n+1}=\\sqrt{2+a_n}$, with convergence already guaranteed by the problem (increasing and bounded above), so taking limits on both sides, the limit $L$ satisfies $L=\\sqrt{2+L}$.",
    "why": "Convergence is given, so all that is left is to solve the fixed-point equation and use \"every term is positive\" to discard the negative root.",
    "steps": [
      "Let $L=\\lim a_n$ and take limits on both sides of the recursion: $L=\\sqrt{2+L}$.",
      "Square: $L^2-L-2=0$, $(L-2)(L+1)=0$, so $L=2$ or $-1$.",
      "Every term is a square root, so $a_n>0$ and the limit cannot be negative; hence $L=2$."
    ],
    "trap": "Keeping both roots after squaring, or writing $L=-1$; squaring creates extraneous roots, so go back and filter with $a_n>0$.",
    "check": "$a_1=\\sqrt2\\approx1.414$, $a_2=\\sqrt{2+\\sqrt2}\\approx1.848$, already closing in on $2$ while staying below $2$."
  },
  "lec-11-q4c": {
    "spot": "$\\left(\\frac{n+1}{n-1}\\right)^n$: the base goes to $1$ and the exponent to $\\infty$, a $1^\\infty$ form; writing the base as $1+\\frac{2}{n-1}$ gives a variant of the definition of $e$.",
    "why": "For $1^\\infty$ forms you either build $\\left(1+\\frac{a}{m}\\right)^m\\to e^a$ or take logs; here the first fits neatly, so build it directly.",
    "steps": [
      "$\\frac{n+1}{n-1}=1+\\frac{2}{n-1}$.",
      "Let $m=n-1$: $\\left(1+\\frac{2}{m}\\right)^{m+1}=\\left(1+\\frac{2}{m}\\right)^m\\cdot\\left(1+\\frac{2}{m}\\right)$.",
      "The second factor goes to $1$, so the limit is $e^2$."
    ],
    "trap": "Seeing the base go to $1$ and saying $1^\\infty=1$; the base and exponent move at the same time, so you cannot take their limits separately.",
    "check": "Divide top and bottom by $n$: $\\frac{(1+1/n)^n}{(1-1/n)^n}\\to\\frac{e}{e^{-1}}=e^2$, the same answer by another route."
  },
  "lec-11-q4d": {
    "spot": "$\\left(1+\\frac{1}{n^2}\\right)^n$ is also a $1^\\infty$ form, but the base has $\\frac{1}{n^2}$ while the exponent is only $n$: $n\\cdot\\frac{1}{n^2}\\to0$, so the exponent cannot keep up.",
    "why": "Taking logs gives $n\\ln\\left(1+\\frac{1}{n^2}\\right)\\approx\\frac{1}{n}$, which visibly goes to $0$; clearer than forcing the definition of $e$.",
    "steps": [
      "Take logs: $\\ln a_n=n\\ln\\left(1+\\frac{1}{n^2}\\right)$.",
      "Use $\\ln(1+u)\\le u$: $0<n\\ln\\left(1+\\frac{1}{n^2}\\right)\\le\\frac{1}{n}\\to0$.",
      "So $\\ln a_n\\to0$ and $a_n\\to e^0=1$."
    ],
    "trap": "Applying $\\left(1+\\frac{1}{m}\\right)^m\\to e$ and answering $e$; here the base has denominator $n^2$ but the exponent is only $n$, so it does not form $e$.",
    "check": "Plug in $n=100$: $(1.0001)^{100}\\approx1.01$, very close to $1$."
  },
  "lec-12-m2": {
    "spot": "This is about the direction of the $n$-th term test: convergence always implies $a_n\\to0$, but $a_n\\to0$ does not imply convergence (the harmonic series is the counterexample).",
    "why": "Using the difference of partial sums $a_n=S_n-S_{n-1}$ proves the forward direction in one line; the reverse direction only needs one counterexample.",
    "steps": [
      "If $\\sum a_n=S$ converges, then $a_n=S_n-S_{n-1}\\to S-S=0$.",
      "The converse fails: $\\frac{1}{n}\\to0$, but $\\sum\\frac{1}{n}$ diverges (its partial sums are about $\\ln N$).",
      "So \"if $\\sum a_n$ converges, then $\\lim a_n=0$\" is the correct statement; its converse is false."
    ],
    "trap": "Choosing \"if $\\lim a_n=0$ then the series converges\": that reverses the direction of the test, and the harmonic series refutes it immediately.",
    "check": "The $n$-th term test can only prove divergence: if the terms do not go to $0$ the series must diverge; if they do go to $0$, it says nothing."
  },
  "lec-12-q1c": {
    "spot": "$\\frac{1}{n^2-1}=\\frac{1}{(n-1)(n+1)}$, two factors that differ by $2$: after partial fractions it is a telescoping series that cancels every other term.",
    "why": "After splitting, the partial sums keep only a few terms at the ends, which is far more direct than finding another test and then estimating the sum.",
    "steps": [
      "$\\frac{1}{n^2-1}=\\frac{1}{2}\\left(\\frac{1}{n-1}-\\frac{1}{n+1}\\right)$.",
      "Starting from $n=2$, the positive terms are $1,\\frac{1}{2},\\frac{1}{3},\\dots$ and the negative terms are $\\frac{1}{3},\\frac{1}{4},\\dots$: they cancel with a gap of one, leaving only $1+\\frac{1}{2}$.",
      "Sum $=\\frac{1}{2}\\left(1+\\frac{1}{2}\\right)=\\frac{3}{4}$."
    ],
    "trap": "Assuming, as with $\\frac{1}{n(n+1)}$, that only the first term survives and answering $\\frac{1}{2}$; splitting with a gap of $2$ leaves two terms.",
    "check": "The first term is $\\frac{1}{3}$ and the second $\\frac{1}{8}$, already $0.458$ together; the total $0.75$ is larger than that and smaller than $1$."
  },
  "lec-12-q1d": {
    "spot": "Every term is $\\left(\\frac{x-1}{2}\\right)^n$: a geometric series with ratio $\\frac{x-1}{2}$, and the range $-1<x<3$ is exactly $\\left|\\frac{x-1}{2}\\right|<1$.",
    "why": "Once you recognize a geometric series, apply $\\frac{\\text{first term}}{1-\\text{ratio}}$ directly, with no term-by-term work.",
    "steps": [
      "$\\frac{(x-1)^n}{2^n}=\\left(\\frac{x-1}{2}\\right)^n$; the first term ($n=0$) is $1$ and the ratio is $q=\\frac{x-1}{2}$.",
      "$|q|<1\\iff|x-1|<2\\iff-1<x<3$, so it converges on the given range.",
      "Sum $=\\frac{1}{1-\\frac{x-1}{2}}=\\frac{2}{2-(x-1)}=\\frac{2}{3-x}$."
    ],
    "trap": "Simplifying the denominator $2-(x-1)$ as $1-x$, which gives $\\frac{2}{1-x}$.",
    "check": "Plug in $x=1$: every term except the first is $0$, so the sum is $1$; $\\frac{2}{3-1}=1$ matches."
  },
  "lec-12-q2b": {
    "spot": "$\\frac{1}{n\\ln n}$ is positive and decreasing, and $\\frac{1}{x\\ln x}$ has the ready-made antiderivative $\\ln(\\ln x)$: a textbook Integral Test problem.",
    "why": "It is smaller than $\\frac{1}{n}$, so comparing with the harmonic series decides nothing; the Integral Test computes the answer directly.",
    "steps": [
      "$f(x)=\\frac{1}{x\\ln x}$ is positive, continuous and decreasing for $x\\ge2$ (the denominator increases).",
      "Let $u=\\ln x$: $\\int\\frac{dx}{x\\ln x}=\\int\\frac{du}{u}=\\ln(\\ln x)$.",
      "$\\int_2^{b}\\frac{dx}{x\\ln x}=\\ln(\\ln b)-\\ln(\\ln2)$, which goes to infinity as $b\\to\\infty$ (just very slowly).",
      "The improper integral diverges, so by the Integral Test the series diverges."
    ],
    "trap": "Seeing that $\\frac{1}{n\\ln n}$ is smaller than $\\frac{1}{n}$ and concluding that \"smaller than a divergent series\" converges; the Comparison Test only concludes something when you are smaller than a convergent series.",
    "check": "The partial sums grow like $\\ln(\\ln N)$: even $N=10^8$ gives only about $3.6$, but there is no upper bound."
  },
  "lec-12-q2c": {
    "spot": "$ne^{-n^2}$ is exactly a sample of $xe^{-x^2}$, and $xe^{-x^2}$ has antiderivative $-\\frac{1}{2}e^{-x^2}$: the Integral Test finishes it in one line.",
    "why": "The integrand carries the derivative of its inner function, so after substitution the integral is finite; the Ratio Test also works, but the Integral Test is more direct.",
    "steps": [
      "$f(x)=xe^{-x^2}$, $f'(x)=(1-2x^2)e^{-x^2}<0$ (for $x\\ge1$), so it is positive and decreasing.",
      "$\\int_1^{\\infty}xe^{-x^2}\\,dx=\\Big[-\\frac{1}{2}e^{-x^2}\\Big]_1^{\\infty}=\\frac{1}{2e}$, finite.",
      "The integral converges, so by the Integral Test the series converges."
    ],
    "trap": "Seeing a factor of $n$ in front and thinking the terms grow; $e^{-n^2}$ decays so fast that $n$ cannot pull it back.",
    "check": "The first term is $e^{-1}\\approx0.368$, the second $2e^{-4}\\approx0.037$, and the rest are negligible; the total is about $0.405$, finite."
  },
  "lec-12-q2d": {
    "spot": "The error bound is already given as $\\int_n^{\\infty}x^{-3}\\,dx$: it equals $\\frac{1}{2n^2}$, and requiring it to be $\\le0.005$ is just solving an inequality.",
    "why": "The problem specifies the integral remainder estimate, so what you want is the smallest $n$ for which the bound passes, not the $n$ for which the actual error just passes.",
    "steps": [
      "$\\int_n^{\\infty}x^{-3}\\,dx=\\Big[-\\frac{1}{2x^2}\\Big]_n^{\\infty}=\\frac{1}{2n^2}$.",
      "$\\frac{1}{2n^2}\\le0.005\\iff n^2\\ge100\\iff n\\ge10$.",
      "At $n=9$ the bound is $\\frac{1}{162}\\approx0.0062>0.005$, not enough, so the smallest is $n=10$."
    ],
    "trap": "Treating $\\le$ as $<$ and getting $n=11$; or using $\\int_{n+1}^{\\infty}$ (that is a lower bound for the remainder, not an upper bound) and getting $n=9$. The problem says $\\le$, and at $n=10$ the bound equals exactly $0.005$, which passes.",
    "check": "The actual $R_{10}=\\sum_{k\\ge11}\\frac{1}{k^3}\\approx0.0045$, indeed within the bound $0.005$."
  },
  "lec-12-q3b": {
    "spot": "$\\frac{n+1}{n^3-n+5}$ has a degree-one numerator and degree-three denominator: for large $n$ it behaves like $\\frac{n}{n^3}=\\frac{1}{n^2}$, so use the Limit Comparison Test against the $p=2$ series.",
    "why": "The $-n$ in the denominator makes a direct comparison inequality awkward to write; the Limit Comparison Test only looks at the dominant terms, which is clean.",
    "steps": [
      "The denominator $n^3-n+5$ is positive for all $n\\ge1$ (it is $5$ at $n=1$), so this is a series of positive terms.",
      "Compare with $b_n=\\frac{1}{n^2}$: $\\frac{a_n}{b_n}=\\frac{n^3+n^2}{n^3-n+5}\\to1$.",
      "$\\sum\\frac{1}{n^2}$ is a $p$-series with $p=2>1$, so it converges; by the Limit Comparison Test the original series converges too."
    ],
    "trap": "Seeing $n+1$ in the numerator, comparing with $\\frac{1}{n}$, getting a ratio that goes to $0$, and then concluding from the divergence of the harmonic series; a ratio of $0$ against a divergent series gives no conclusion.",
    "check": "Computing partial sums, they settle around $1.13$, which is finite."
  },
  "lec-12-q3c": {
    "spot": "$\\sin\\frac{1}{n}$: the angle $\\frac{1}{n}\\to0$ and $\\sin u\\approx u$, so the terms are the same size as $\\frac{1}{n}$ — the harmonic series in disguise.",
    "why": "The terms really do go to $0$, so the $n$-th term test is useless; the Limit Comparison Test ties it to the harmonic series and settles it in one step.",
    "steps": [
      "For $n\\ge1$, $0<\\frac{1}{n}\\le1<\\pi$, so $\\sin\\frac{1}{n}>0$: a series of positive terms.",
      "Compare with $\\frac{1}{n}$: $\\frac{\\sin(1/n)}{1/n}\\to1$ (this is just $\\lim_{u\\to0}\\frac{\\sin u}{u}=1$).",
      "$\\sum\\frac{1}{n}$ diverges, so $\\sum\\sin\\frac{1}{n}$ diverges too."
    ],
    "trap": "Seeing $\\sin\\frac{1}{n}\\to0$ and saying it converges; terms going to $0$ is only a necessary condition.",
    "check": "Contrast with $\\sum\\sin\\frac{1}{n^2}$: that one is the same order as $\\frac{1}{n^2}$ and converges; the whole difference is how fast the angle goes to $0$."
  },
  "lec-12-q4d": {
    "spot": "$\\ln\\frac{n}{n+1}=\\ln n-\\ln(n+1)$: the log turns the quotient into a difference, and the partial sums cancel all the way down to $-\\ln(N+1)$.",
    "why": "A telescoping series has an explicit formula for its partial sums, so looking at their limit directly is cleanest; no comparison test is needed.",
    "steps": [
      "$\\ln\\frac{n}{n+1}=\\ln n-\\ln(n+1)$.",
      "Partial sum $S_N=(\\ln1-\\ln2)+(\\ln2-\\ln3)+\\cdots+(\\ln N-\\ln(N+1))=-\\ln(N+1)$.",
      "As $N\\to\\infty$, $-\\ln(N+1)\\to-\\infty$; the partial sums have no limit, so the series diverges."
    ],
    "trap": "Seeing $\\ln\\frac{n}{n+1}\\to\\ln1=0$ and saying it converges; terms going to $0$ does not guarantee convergence, and here the partial sums plainly run off to $-\\infty$.",
    "check": "Another route: the ratio of $\\ln\\frac{n}{n+1}$ to $-\\frac{1}{n}$ goes to $1$, so it diverges along with the harmonic series."
  },
  "lec-13-m2": {
    "spot": "$\\frac{n!}{n^n}$ has both a factorial and $n^n$: in the ratio, $(n+1)!$ over $n!$ leaves $n+1$, and the remaining $\\left(\\frac{n}{n+1}\\right)^n$ is the reciprocal of the definition of $e$.",
    "why": "Factorials paired with $n^n$ go smoothest with the Ratio Test; after cancelling, only a single $1^\\infty$ limit remains.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)!}{(n+1)^{n+1}}\\cdot\\frac{n^n}{n!}=\\frac{(n+1)n^n}{(n+1)^{n+1}}=\\left(\\frac{n}{n+1}\\right)^n$.",
      "$\\left(\\frac{n}{n+1}\\right)^n=\\frac{1}{\\left(1+\\frac{1}{n}\\right)^n}\\to\\frac{1}{e}$.",
      "So $L=e^{-1}$ (less than $1$, so the series converges)."
    ],
    "trap": "Treating $\\left(\\frac{n}{n+1}\\right)^n$ as $1^n=1$ and thinking the Ratio Test fails; the base and the exponent move together, and the limit is $\\frac{1}{e}$.",
    "check": "$\\frac{1}{e}\\approx0.368<1$, so the Ratio Test gives convergence, consistent with the intuition that $\\frac{n!}{n^n}$ decays quickly."
  },
  "lec-13-m4": {
    "spot": "$(-1)^n\\frac{n}{n+1}$ alternates, but $\\frac{n}{n+1}\\to1$, so the absolute values of the terms do not go to $0$: the $n$-th term test kills it immediately.",
    "why": "The Alternating Series Test requires the terms to go to $0$, and that first condition fails here, so use the cheapest test first, the $n$-th term test.",
    "steps": [
      "$\\left|a_n\\right|=\\frac{n}{n+1}\\to1$.",
      "So $a_n=(-1)^n\\frac{n}{n+1}$ jumps back and forth near $1$ and $-1$; $\\lim a_n$ does not exist, let alone equal $0$.",
      "The terms do not go to $0$, so by the $n$-th term test the series diverges."
    ],
    "trap": "Seeing $(-1)^n$ and applying the Alternating Series Test to say it converges; that test requires $b_n\\to0$, but here $b_n\\to1$.",
    "check": "The partial sums swing back and forth near the two values $1-\\ln2\\approx0.31$ and $-\\ln2\\approx-0.69$, never settling down."
  },
  "lec-13-q1c": {
    "spot": "The signs of $\\frac{\\cos n}{n^2}$ follow no pattern (it is not an alternating series), but $|\\cos n|\\le1$, so in absolute value it is held down by $\\frac{1}{n^2}$.",
    "why": "When the signs jump around irregularly the Alternating Series Test does not apply; look straight at the series of absolute values: if the Comparison Test shows it converges, the series converges absolutely.",
    "steps": [
      "$\\left|\\frac{\\cos n}{n^2}\\right|\\le\\frac{1}{n^2}$.",
      "$\\sum\\frac{1}{n^2}=\\frac{\\pi^2}{6}$ converges, so by the Comparison Test $\\sum\\left|\\frac{\\cos n}{n^2}\\right|$ converges.",
      "The series of absolute values converges, so the original series converges absolutely (its sum is actually $\\frac{\\pi^2}{6}-\\frac{\\pi}{2}+\\frac{1}{4}\\approx0.324$)."
    ],
    "trap": "Thinking $\\cos n$ alternates in sign and using the Alternating Series Test, which at best gives \"converges\", and then answering conditionally convergent.",
    "check": "Absolute convergence is stronger than convergence: once the series of absolute values is shown to converge, you no longer care how the signs of $\\cos n$ are arranged."
  },
  "lec-13-q1d": {
    "spot": "An alternating sign $(-1)^n$ with $\\frac{n}{n^2+1}$: in absolute value it is the same order as $\\frac{1}{n}$, so the series of absolute values diverges and only the alternation can make it converge — the typical look of conditional convergence.",
    "why": "Decide the two questions separately: compare the series of absolute values with the harmonic series using the Limit Comparison Test; for the original series use the Alternating Series Test, which only needs decreasing terms that go to zero.",
    "steps": [
      "Absolute values: $\\frac{n/(n^2+1)}{1/n}=\\frac{n^2}{n^2+1}\\to1$, so it shares the fate of the harmonic series and $\\sum|a_n|$ diverges.",
      "Decreasing: $f(x)=\\frac{x}{x^2+1}$, $f'(x)=\\frac{1-x^2}{(x^2+1)^2}\\le0$ (for $x\\ge1$).",
      "Goes to zero: $\\frac{n}{n^2+1}\\to0$, so the Alternating Series Test says the original series converges.",
      "The original series converges and the series of absolute values diverges: conditionally convergent."
    ],
    "trap": "Passing the Alternating Series Test and answering \"absolutely convergent\"; absolute convergence needs a separate check of $\\sum\\frac{n}{n^2+1}$, which diverges like the harmonic series.",
    "check": "The original series sums to about $-0.27$, finite; but $\\sum_{n\\le1000}\\frac{n}{n^2+1}$ already exceeds $6$ and keeps growing."
  },
  "lec-13-q2d": {
    "spot": "$\\frac{n^n}{n!}$ is the previous problem's $\\frac{n!}{n^n}$ turned upside down: the ratio becomes $\\left(1+\\frac{1}{n}\\right)^n\\to e>1$.",
    "why": "Factorials with $n^n$ call for the Ratio Test, and after cancelling it is the definition of $e$; in fact the terms themselves are $\\ge1$, so the $n$-th term test also settles it.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)^{n+1}}{(n+1)!}\\cdot\\frac{n!}{n^n}=\\frac{(n+1)^n}{n^n}=\\left(1+\\frac{1}{n}\\right)^n$.",
      "$\\left(1+\\frac{1}{n}\\right)^n\\to e\\approx2.718>1$.",
      "The ratio limit is greater than $1$, so by the Ratio Test the series diverges."
    ],
    "trap": "Computing the ratio as $\\left(\\frac{n}{n+1}\\right)^n\\to\\frac{1}{e}$ (upside down), which flips the conclusion to convergent.",
    "check": "Look at the terms directly: $\\frac{n^n}{n!}=\\frac{n}{1}\\cdot\\frac{n}{2}\\cdots\\frac{n}{n}\\ge1$, so the terms do not even go to $0$; it must diverge."
  },
  "lec-13-q3b": {
    "spot": "$\\frac{(-1)^{n+1}}{n^3}$ is alternating and decreasing to $0$: the error $|S-S_n|$ is at most the next term $b_{n+1}=\\frac{1}{(n+1)^3}$.",
    "why": "The alternating series error estimate only looks at the first term you drop, simpler and tighter than the integral estimate.",
    "steps": [
      "Alternating series estimate: $|S-S_n|\\le b_{n+1}=\\frac{1}{(n+1)^3}$.",
      "We need $\\frac{1}{(n+1)^3}<0.01$, i.e. $(n+1)^3>100$.",
      "$n=3$: $\\frac{1}{64}\\approx0.0156$, not enough; $n=4$: $\\frac{1}{125}=0.008$ passes, so $n$ must be at least $4$."
    ],
    "trap": "Using $b_n$ instead of $b_{n+1}$: solving $\\frac{1}{n^3}<0.01$ gives $n=5$, one term too many.",
    "check": "The actual error $|S-S_4|$ is about $0.0051$, indeed less than $0.01$."
  },
  "lec-13-q3c": {
    "spot": "$S_4$ is just the first four terms $1-\\frac{1}{8}+\\frac{1}{27}-\\frac{1}{64}$; the least common multiple of the denominators $1,8,27,64$ is $8\\cdot27\\cdot8=1728$.",
    "why": "A finite sum of only four terms: just put everything over a common denominator; $1728=2^6\\cdot3^3$ accommodates both $64$ and $27$.",
    "steps": [
      "$S_4=1-\\frac{1}{8}+\\frac{1}{27}-\\frac{1}{64}$ (signs set by $(-1)^{n+1}$, starting positive).",
      "Over the common denominator $1728$: $\\frac{1728-216+64-27}{1728}$.",
      "$1728-216+64-27=1549$, so $S_4=\\frac{1549}{1728}$."
    ],
    "trap": "Getting the signs backwards and starting negative, which gives $-\\frac{1549}{1728}$; or converting $\\frac{1}{27}$ to $\\frac{27}{1728}$ and $\\frac{1}{64}$ to $\\frac{64}{1728}$ (numerators swapped).",
    "check": "Partial sums of an alternating series bracket the true value: $S_4<S<S_3$, with $S\\approx0.9015$ and $S_4\\approx0.8964$."
  },
  "lec-14-q2b": {
    "spot": "$\\frac{1}{1+x}=\\sum(-1)^nx^n$ is a geometric series with ratio $-x$, and integrating term by term turns $x^n$ into $\\frac{x^{n+1}}{n+1}$: the $x^4$ comes from the $n=3$ term.",
    "why": "Integrating a known geometric series term by term lets you read off the coefficient directly; differentiating $\\ln(1+x)$ four times to get $\\frac{f^{(4)}(0)}{4!}$ is more work.",
    "steps": [
      "$\\frac{1}{1+x}=1-x+x^2-x^3+\\cdots$; the coefficient of $x^3$ is $-1$.",
      "Integrate term by term (constant $0$, since $\\ln1=0$): $\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\cdots$.",
      "$-x^3$ integrates to $-\\frac{x^4}{4}$, so the coefficient of $x^4$ is $-\\frac{1}{4}$."
    ],
    "trap": "Forgetting to divide by the new power when integrating and answering $-1$; or not letting the sign follow $(-1)^n$ and answering $\\frac{1}{4}$.",
    "check": "The pattern is $\\ln(1+x)=\\sum_{n\\ge1}\\frac{(-1)^{n+1}x^n}{n}$: all even-power terms are negative, so $x^4$ has coefficient $-\\frac{1}{4}$."
  },
  "lec-14-q3a": {
    "spot": "In $\\sum\\frac{n}{2^n}$ the $n$ multiplies $x^n$, which is exactly $x\\frac{d}{dx}x^n=nx^n$: differentiate the geometric series once, multiply by $x$, and plug in $x=\\frac{1}{2}$.",
    "why": "An extra factor of $n$ in the coefficients is the fingerprint of differentiation; differentiating $\\frac{1}{1-x}$ gives a closed form, faster than the shift-and-subtract trick.",
    "steps": [
      "$\\sum_{n\\ge0}x^n=\\frac{1}{1-x}$ ($|x|<1$); differentiate both sides: $\\sum_{n\\ge1}nx^{n-1}=\\frac{1}{(1-x)^2}$.",
      "Multiply by $x$: $\\sum_{n\\ge1}nx^n=\\frac{x}{(1-x)^2}$.",
      "Plug in $x=\\frac{1}{2}$: $\\frac{1/2}{(1/2)^2}=2$."
    ],
    "trap": "Forgetting to multiply back by $x$ after differentiating and plugging into $\\frac{1}{(1-x)^2}$, which gives $4$.",
    "check": "The first four terms are $\\frac{1}{2}+\\frac{2}{4}+\\frac{3}{8}+\\frac{4}{16}=1.625$, and the rest keep shrinking, so a total of $2$ makes sense."
  },
  "lec-14-q3c": {
    "spot": "In $\\sum\\frac{1}{n2^n}$ the $n$ is in the denominator, the fingerprint of $\\int x^{n-1}\\,dx=\\frac{x^n}{n}$: integrating the geometric series term by term gives $-\\ln(1-x)$; plug in $x=\\frac{1}{2}$.",
    "why": "Coefficients divided by $n$ signal integration; recognize it as the expansion of $-\\ln(1-x)$ and the answer comes out in one step.",
    "steps": [
      "$\\sum_{n\\ge1}x^{n-1}=\\frac{1}{1-x}$; integrate from $0$ to $x$: $\\sum_{n\\ge1}\\frac{x^n}{n}=\\int_0^x\\frac{dt}{1-t}=-\\ln(1-x)$.",
      "Check one point: at $x=0.3$ the series sum equals $-\\ln0.7$.",
      "Plug in $x=\\frac{1}{2}$: $-\\ln\\frac{1}{2}=\\ln2$."
    ],
    "trap": "Dropping the minus sign after integrating and writing $\\ln(1-x)$, which gives $-\\ln2$ — a series of positive terms cannot have a negative sum.",
    "check": "The first term is $\\frac{1}{2}$ and the second $\\frac{1}{8}$, so the first two give $0.625$; $\\ln2\\approx0.693$ is a bit larger, which makes sense."
  },
  "lec-15-m2": {
    "spot": "$f(x)=x^2e^x$ and you need a high-order derivative at $0$: multiply the series of $e^x$ by $x^2$; the coefficient of $x^{10}$ is $\\frac{f^{(10)}(0)}{10!}$.",
    "why": "Differentiating ten times directly snowballs; as a power series you only need one coefficient, or with the Leibniz formula only one term survives.",
    "steps": [
      "$x^2e^x=x^2\\sum_{n\\ge0}\\frac{x^n}{n!}=\\sum_{n\\ge0}\\frac{x^{n+2}}{n!}$.",
      "$x^{10}$ corresponds to $n=8$, with coefficient $\\frac{1}{8!}$.",
      "Taylor coefficient $\\frac{f^{(10)}(0)}{10!}=\\frac{1}{8!}$, so $f^{(10)}(0)=\\frac{10!}{8!}=10\\cdot9=90$."
    ],
    "trap": "Taking the coefficient $\\frac{1}{8!}$ as the answer, or writing $\\frac{1}{10!}$; the coefficient must be multiplied back by $10!$ to get the derivative value.",
    "check": "Leibniz formula: only the term that differentiates $x^2$ twice is nonzero at $0$, giving $\\binom{10}{2}\\cdot2\\cdot e^0=45\\cdot2=90$."
  },
  "lec-15-q3d": {
    "spot": "$\\frac{(-1)^{n+1}}{n\\,3^n}$ is exactly what $\\ln(1+x)=\\sum\\frac{(-1)^{n+1}x^n}{n}$ looks like at $x=\\frac{1}{3}$.",
    "why": "An alternating sign plus $n$ in the denominator is the signature of the $\\ln(1+x)$ expansion; recognize it and plug in, no need to add term by term.",
    "steps": [
      "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots=\\sum_{n\\ge1}\\frac{(-1)^{n+1}x^n}{n}$, for $|x|<1$.",
      "Let $x=\\frac{1}{3}$: $\\frac{x^n}{n}=\\frac{1}{n\\,3^n}$, and the signs match too.",
      "Sum $=\\ln\\left(1+\\frac{1}{3}\\right)=\\ln\\frac{4}{3}$."
    ],
    "trap": "Using $-\\ln(1-x)$ instead and answering $\\ln\\frac{3}{2}$; the alternating sign corresponds to $\\ln(1+x)$.",
    "check": "The first two terms give $\\frac{1}{3}-\\frac{1}{18}\\approx0.278$, and the third adds back $\\frac{1}{81}$; $\\ln\\frac{4}{3}\\approx0.2877$ sits in between."
  },
  "lec-15-q4d": {
    "spot": "The error bound is already given as $\\frac{3}{(n+1)!}$: making it less than $10^{-3}$ means finding the smallest $n$ with $(n+1)!>3000$, which a factorial table settles.",
    "why": "The problem specifies the bound from Taylor's inequality, so you compare the bound, not the actual error; trying values of $n$ one by one is fastest.",
    "steps": [
      "We need $\\frac{3}{(n+1)!}<0.001$, i.e. $(n+1)!>3000$.",
      "$6!=720<3000$, $7!=5040>3000$.",
      "At $n+1=6$ ($n=5$) the bound $\\frac{3}{720}\\approx0.0042$ is not enough; at $n+1=7$, $\\frac{3}{5040}\\approx0.0006$ passes, so $n=6$."
    ],
    "trap": "Finding that $(n+1)!$ must be $7!$ and answering $7$, forgetting that the question asks for $n$, not $n+1$.",
    "check": "The actual error $e-T_6(1)\\approx0.00023$ is indeed less than $10^{-3}$."
  },
  "lim-035": {
    "spot": "In $\\frac{\\sin5x}{\\sin2x}$ both top and bottom are $\\sin(\\text{linear expression})$ going to $0$: turn each into $\\frac{\\sin u}{u}\\to1$.",
    "why": "Multiplying and dividing by $5x$ and $2x$ leaves just the coefficient ratio, even less work than L'Hôpital's Rule.",
    "steps": [
      "Rewrite: $\\frac{\\sin5x}{\\sin2x}=\\frac{\\sin5x}{5x}\\cdot\\frac{2x}{\\sin2x}\\cdot\\frac{5x}{2x}$.",
      "As $x\\to0$ the first two factors both go to $1$.",
      "The limit is $\\frac{5}{2}$."
    ],
    "trap": "Cancelling the $\\sin$ and answering $\\frac{5x}{2x}$ happens to be right, but writing $\\frac{\\sin5}{\\sin2}$ is wrong.",
    "check": "L'Hôpital's Rule: $\\frac{5\\cos5x}{2\\cos2x}\\to\\frac{5}{2}$, the same."
  },
  "refine-derivatives-013": {
    "spot": "The Wronskian is $W(y_1,y_2)=y_1y_2'-y_1'y_2$, and $y_1=e^x\\cos x$, $y_2=e^x\\sin x$ share the factor $e^x$: every term brings out $e^{2x}$, leaving $\\cos^2+\\sin^2$.",
    "why": "Computing the two-by-two determinant from the definition is most direct; factor out $e^{2x}$ first, and the remaining trig expression collapses by $\\cos^2x+\\sin^2x=1$.",
    "steps": [
      "$y_1'=e^x(\\cos x-\\sin x)$.",
      "$y_2'=e^x(\\sin x+\\cos x)$.",
      "$W=y_1y_2'-y_1'y_2=e^{2x}\\left[\\cos x(\\sin x+\\cos x)-(\\cos x-\\sin x)\\sin x\\right]$.",
      "Inside the bracket the cross terms $\\pm\\sin x\\cos x$ cancel, leaving $\\cos^2x+\\sin^2x=1$, so $W=e^{2x}$."
    ],
    "trap": "Writing the determinant in the wrong order as $y_1'y_2-y_1y_2'$, which gives $-e^{2x}$.",
    "check": "$W$ is never $0$, so the two solutions are linearly independent — they are, after all, the two fundamental solutions of $y''-2y'+2y=0$."
  },
  "refine-derivatives-015": {
    "spot": "$\\frac{f'}{f}$ is the derivative of $\\ln f$, and $f$ is a product of five linear factors: taking logs turns the product into a sum, and each factor contributes $\\frac{1}{x+k}$.",
    "why": "Logarithmic differentiation means no five-term Product Rule expansion; expanding the polynomial and then differentiating is very error-prone.",
    "steps": [
      "$\\ln f(x)=\\sum_{k=1}^{5}\\ln(x+k)$, so $\\frac{f'(x)}{f(x)}=\\sum_{k=1}^{5}\\frac{1}{x+k}$.",
      "Plug in $x=0$: $1+\\frac{1}{2}+\\frac{1}{3}+\\frac{1}{4}+\\frac{1}{5}$.",
      "Over the common denominator $60$: $\\frac{60+30+20+15+12}{60}=\\frac{137}{60}$."
    ],
    "trap": "Computing $f'(0)$ and $f(0)=120$ separately and getting $f'(0)=274$ wrong, or writing $\\frac{1}{4}$ as $\\frac{12}{60}$ when finding the common denominator.",
    "check": "You can also compute directly: $f(0)=5!=120$, $f'(0)=274$, and dividing gives $\\frac{274}{120}=\\frac{137}{60}$."
  },
  "refine-derivatives-019": {
    "spot": "The point on the curve $xy^2=16$ closest to the origin: in the squared distance $x^2+y^2$ the $y^2$ can be replaced directly by $\\frac{16}{x}$, giving a one-variable extremum problem.",
    "why": "Minimizing the squared distance instead of the distance avoids the root; the constraint solves neatly for $y^2$, so Lagrange multipliers are unnecessary.",
    "steps": [
      "$d^2=x^2+y^2=x^2+\\frac{16}{x}=g(x)$, $x>0$.",
      "$g'(x)=2x-\\frac{16}{x^2}=0\\Rightarrow x^3=8\\Rightarrow x=2$.",
      "$g''(x)=2+\\frac{32}{x^3}>0$, so this is a minimum; here $y^2=8$ and $d^2=4+8=12$.",
      "Shortest distance $\\sqrt{12}=2\\sqrt3$."
    ],
    "trap": "Stopping at $d^2=12$ and forgetting the square root; or miswriting $y^2=\\frac{16}{x}$ as $y=\\frac{16}{x}$.",
    "check": "Take any point on the curve, say $(1,4)$: its distance $\\sqrt{17}\\approx4.12$ is farther than $2\\sqrt3\\approx3.46$, as expected."
  },
  "refine-integrals-002": {
    "spot": "Both limits of $F(x)=\\int_x^{3x}\\frac{dt}{1+t^2}$ contain $x$: Fundamental Theorem of Calculus with the Chain Rule; the upper limit gives $f(3x)\\cdot3$ and the lower limit gives $-f(x)\\cdot1$.",
    "why": "No need to integrate to $\\arctan$ first; differentiate with respect to the variable limits directly and plug in $x=1$.",
    "steps": [
      "$F'(x)=\\frac{1}{1+(3x)^2}\\cdot3-\\frac{1}{1+x^2}\\cdot1$.",
      "Plug in $x=1$: $\\frac{3}{10}-\\frac{1}{2}=-\\frac{1}{5}$.",
      "$F'(1)=-\\frac{1}{5}$."
    ],
    "trap": "Forgetting the Chain Rule factor $3$ for the upper limit $3x$, which gives $\\frac{1}{10}-\\frac{1}{2}=-\\frac{2}{5}$.",
    "check": "Numerical difference quotient: $\\frac{F(1.001)-F(0.999)}{0.002}$ is about $-0.2$."
  },
  "refine-integrals-004": {
    "spot": "The upper limit of $\\int_0^{x^2}f(t)\\,dt=x^3$ is $x^2$: differentiate both sides in $x$; the left side, by the Fundamental Theorem plus the Chain Rule, gives $f(x^2)\\cdot2x$.",
    "why": "No need to find a formula for $f$ first; one differentiation gives $f(x^2)$, and to get $f(4)$ just plug in $x=2$.",
    "steps": [
      "Differentiate both sides in $x$: $f(x^2)\\cdot2x=3x^2$.",
      "For $x>0$ we can cancel: $f(x^2)=\\frac{3x}{2}$, i.e. $f(t)=\\frac{3}{2}\\sqrt t$.",
      "For $f(4)$ set $x^2=4$, $x=2$: $f(4)=\\frac{3\\cdot2}{2}=3$."
    ],
    "trap": "Plugging in $x=4$ instead of $x=2$, which gives $f(16)=6$; the argument of $f$ is $x^2$, not $x$.",
    "check": "Plug back: $\\int_0^{4}\\frac{3}{2}\\sqrt t\\,dt=\\left[t^{3/2}\\right]_0^4=8=2^3$, matching $x^3$ at $x=2$."
  },
  "refine-integrals-008": {
    "spot": "The maximum of $g(x)=\\int_0^xf$ occurs where $g'=f$ changes from positive to negative: the piecewise-linear $f$ crosses the $x$-axis on the segment from $(3,1)$ to $(4,-1)$.",
    "why": "Whether $g$ increases or decreases is decided entirely by the sign of $f$; find the zeros of $f$ and compute $g$ from areas, with no need to write a formula for $g$.",
    "steps": [
      "Pieces: on $[0,1]$, $f=2t-1$ (turns from negative to positive at $t=\\frac{1}{2}$); on $[1,3]$, $f=1$; on $[3,4]$, $f=7-2t$ (turns from positive to negative at $t=\\frac{7}{2}$).",
      "So $g$ decreases on $[0,\\frac{1}{2}]$, increases on $[\\frac{1}{2},\\frac{7}{2}]$, and decreases on $[\\frac{7}{2},4]$; the candidates for the maximum are $x=\\frac{7}{2}$ and the endpoint $x=0$.",
      "$\\int_0^1(2t-1)\\,dt=0$ (the negative and positive triangles cancel), and $\\int_1^3 1\\,dt=2$.",
      "$\\int_3^{7/2}(7-2t)\\,dt=\\frac{1}{2}\\cdot\\frac{1}{2}\\cdot1=\\frac{1}{4}$.",
      "$g\\left(\\frac{7}{2}\\right)=0+2+\\frac{1}{4}=\\frac{9}{4}$, larger than $g(0)=0$, so the maximum is $\\frac{9}{4}$."
    ],
    "trap": "Assuming $g$ is largest at the right endpoint $x=4$ and computing $g(4)=2$; on the last half-unit $f<0$, so after $\\frac{7}{2}$, $g$ is already falling.",
    "check": "$g(4)=\\frac{9}{4}-\\frac{1}{4}=2$, indeed less than $\\frac{9}{4}$."
  },
  "refine-integrals-018": {
    "spot": "The region $0\\le y\\le\\sqrt x$ rotated about the $y$-axis, with cylindrical shells specified: slice vertical strips in $x$; the radius is $x$ and the height is $\\sqrt x$.",
    "why": "Rotating about the $y$-axis while integrating in $x$, the shell height is just the function value; the disk method would require inverting to $x=y^2$ and subtracting two pieces.",
    "steps": [
      "The strip at $x$ with width $dx$ sweeps out a shell about the $y$-axis: radius $x$, circumference $2\\pi x$.",
      "The shell height is the height of the region at $x$, $\\sqrt x-0=\\sqrt x$.",
      "So $h(x)=2\\pi x\\sqrt x$ (that is, $2\\pi x^{3/2}$)."
    ],
    "trap": "Writing the height as $4-\\sqrt x$ (the piece outside the region) or the radius as $\\sqrt x$; the region lies below the curve, and the radius is the distance $x$ to the $y$-axis.",
    "check": "With washers in $y$: outer radius $4$, inner radius $y^2$, $\\int_0^2\\pi(16-y^4)\\,dy=\\frac{128\\pi}{5}$, the same as with shells."
  },
  "refine-integrals-023": {
    "spot": "$y=x^3-3x$ and $y=x$ are both odd functions, with symmetric intersections $x=0,\\pm2$: the two pieces have equal area, so compute the $[0,2]$ piece and multiply by $2$.",
    "why": "The two pieces have top and bottom swapped, so integrating straight from $-2$ to $2$ cancels to $0$; using symmetry and computing just one piece is easiest.",
    "steps": [
      "Intersections: $x^3-3x=x\\Rightarrow x^3-4x=x(x-2)(x+2)=0$, so $x=0,\\pm2$.",
      "On $(0,2)$, $x$ is on top: for example at $x=1$, $1>-2$; the difference is $x-(x^3-3x)=4x-x^3$.",
      "$\\int_0^2(4x-x^3)\\,dx=8-4=4$.",
      "By symmetry the $[-2,0]$ piece is also $4$, for a total area of $8$."
    ],
    "trap": "Computing $\\int_{-2}^{2}(4x-x^3)\\,dx$ directly, which is $0$ because the integrand is odd; area requires taking each piece as positive.",
    "check": "Integrating the absolute value over all of $[-2,2]$ (split at $0$) also gives $8$."
  },
  "refine-integrals-026": {
    "spot": "The inner integral is $e^{y^2}$ with respect to $y$: no elementary antiderivative, so it cannot be done. The region $\\frac{x}{3}\\le y\\le1$, $0\\le x\\le3$ is a triangle; after switching the order of integration, the inner integral is a constant integrated in $x$.",
    "why": "Switching the order produces an extra factor $3y$, exactly a multiple of the derivative of $y^2$, giving the substitutable $\\int ye^{y^2}\\,dy$.",
    "steps": [
      "Region: $0\\le x\\le3$, $\\frac{x}{3}\\le y\\le1$, which is the triangle $0\\le y\\le1$, $0\\le x\\le3y$.",
      "Switch the order: $\\int_0^1\\int_0^{3y}e^{y^2}\\,dx\\,dy=\\int_0^13ye^{y^2}\\,dy$.",
      "Let $u=y^2$: $\\int_0^13ye^{y^2}\\,dy=\\frac{3}{2}\\Big[e^{y^2}\\Big]_0^1=\\frac{3}{2}(e-1)$."
    ],
    "trap": "Writing the upper bound for $x$ as $\\frac{y}{3}$ when switching the order, which gives $\\frac{1}{6}(e-1)$; solving $y=\\frac{x}{3}$ the other way round gives $x=3y$.",
    "check": "Grinding out the original order (numerically for the inner integral) also gives $\\frac{3}{2}(e-1)\\approx2.577$."
  },
  "refine-series-006": {
    "spot": "The term is $\\frac{(-1)^{n+1}}{n}\\cdot\\frac{n+1}{n+2}$: partial fractions split $\\frac{n+1}{n(n+2)}$ into $\\frac{1}{2}\\left(\\frac{1}{n}+\\frac{1}{n+2}\\right)$, and both pieces are alternating harmonic series.",
    "why": "The Abel test in the problem only guarantees convergence, not the sum; splitting into the known $\\ln2$ and a shifted copy of it lets you compute the sum.",
    "steps": [
      "$\\frac{n+1}{n(n+2)}=\\frac{1}{2}\\left(\\frac{1}{n}+\\frac{1}{n+2}\\right)$.",
      "First piece: $\\sum_{n\\ge1}\\frac{(-1)^{n+1}}{n}=\\ln2$.",
      "Second piece, with $m=n+2$: $\\sum_{n\\ge1}\\frac{(-1)^{n+1}}{n+2}=\\sum_{m\\ge3}\\frac{(-1)^{m+1}}{m}=\\ln2-1+\\frac{1}{2}=\\ln2-\\frac{1}{2}$.",
      "Together: $\\frac{1}{2}\\left(\\ln2+\\ln2-\\frac{1}{2}\\right)=\\ln2-\\frac{1}{4}$."
    ],
    "trap": "Losing track of signs in the shift: with $m=n+2$, $(-1)^{n+1}=(-1)^{m-1}=(-1)^{m+1}$ is unchanged, but when removing the first two terms people write $\\ln2-1-\\frac{1}{2}$.",
    "check": "The factors $\\frac{n+1}{n+2}$ are all less than $1$, and the first term is discounted the most ($1$ becomes $\\frac{2}{3}$), so the answer $\\ln2-\\frac{1}{4}\\approx0.443$ being smaller than $\\ln2\\approx0.693$ makes sense."
  },
  "refine-series-018": {
    "spot": "$\\frac{2n+1}{n(n+1)}$ splits into exactly $\\frac{1}{n}+\\frac{1}{n+1}$: with the alternating sign, the $\\frac{1}{n+1}$ in neighboring terms cancel each other.",
    "why": "After partial fractions it is telescoping, so the partial sums keep only the ends; more direct than splitting into two alternating harmonic series and adding.",
    "steps": [
      "$\\frac{2n+1}{n(n+1)}=\\frac{1}{n}+\\frac{1}{n+1}$.",
      "Partial sums: $\\left(1+\\frac{1}{2}\\right)-\\left(\\frac{1}{2}+\\frac{1}{3}\\right)+\\left(\\frac{1}{3}+\\frac{1}{4}\\right)-\\cdots=1+(-1)^{N+1}\\frac{1}{N+1}$.",
      "As $N\\to\\infty$, $\\frac{1}{N+1}\\to0$, so the sum is $1$."
    ],
    "trap": "Splitting into $\\sum\\frac{(-1)^{n+1}}{n}+\\sum\\frac{(-1)^{n+1}}{n+1}$ and treating the second as $\\ln2$ too, giving $2\\ln2$; the second is actually $1-\\ln2$.",
    "check": "Another route: $\\ln2+(1-\\ln2)=1$."
  },
  "refine-series-020": {
    "spot": "$\\prod(1+x^{2^n})$ with exponents $1,2,4,8,\\dots$: after multiplying by $(1-x)$, the difference-of-squares formula cancels in a chain; $x=\\frac{1}{3}$.",
    "why": "Infinite products have no general formula, but the chain $(1-x)(1+x)=1-x^2$, $(1-x^2)(1+x^2)=1-x^4$ gives the partial products a closed form.",
    "steps": [
      "$(1-x)(1+x)(1+x^2)(1+x^4)=1-x^8$; in general $(1-x)\\prod_{n=0}^{N}(1+x^{2^n})=1-x^{2^{N+1}}$.",
      "So the partial product $=\\frac{1-x^{2^{N+1}}}{1-x}$; for $|x|<1$, $x^{2^{N+1}}\\to0$, and the product $=\\frac{1}{1-x}$.",
      "Plug in $x=\\frac{1}{3}$: $\\frac{1}{1-1/3}=\\frac{3}{2}$."
    ],
    "trap": "Thinking an infinite product must diverge because every factor is greater than $1$; the factors $1+3^{-2^n}$ approach $1$ extremely fast, so the product is finite.",
    "check": "The meaning behind it: every positive integer is written uniquely as a sum of distinct powers of $2$, so the expansion is exactly $\\sum x^k=\\frac{1}{1-x}$."
  },
  "refine-series-029": {
    "spot": "The double sum $\\sum_{n\\ge1}\\sum_{k\\ge n}3^{-k}$: the inner sum is a geometric series starting at $3^{-n}$, which can be put in closed form first.",
    "why": "The inner geometric series has a formula, and after that the outer sum is geometric too; or switch the order and see each $k$ counted $k$ times, and the two routes check each other.",
    "steps": [
      "Inner: $\\sum_{k\\ge n}\\frac{1}{3^k}=\\frac{3^{-n}}{1-\\frac{1}{3}}=\\frac{3}{2}\\cdot3^{-n}$.",
      "Outer: $\\frac{3}{2}\\sum_{n\\ge1}3^{-n}=\\frac{3}{2}\\cdot\\frac{1}{2}=\\frac{3}{4}$.",
      "So the double sum is $\\frac{3}{4}$."
    ],
    "trap": "Taking the first term of the inner sum as $\\frac{1}{3}$ (starting from $k=1$), so every $n$ gives $\\frac{1}{2}$ and the outer sum diverges.",
    "check": "Switch the order: $3^{-k}$ is counted for $n=1,\\dots,k$, that is $k$ times, and $\\sum\\frac{k}{3^k}=\\frac{1/3}{(2/3)^2}=\\frac{3}{4}$."
  },
  "refine-series-033": {
    "spot": "The coefficient of $x^{10}$ $=$ the number of nonnegative integer solutions of $a+2b+5c=10$: at most two $5$-coins, so count the three cases by $c$.",
    "why": "The generating function just packages a counting problem; you only need one coefficient, so counting solutions directly is faster than multiplying out three series.",
    "steps": [
      "Each factor is $\\frac{1}{1-x^d}=1+x^d+x^{2d}+\\cdots$, so in the product the coefficient of $x^{10}$ is the number of solutions of $a+2b+5c=10$ ($a,b,c\\ge0$).",
      "$c=0$: $a+2b=10$, $b=0,1,\\dots,5$, $6$ ways.",
      "$c=1$: $a+2b=5$, $b=0,1,2$, $3$ ways.",
      "$c=2$: $a+2b=0$, only $1$ way.",
      "Total $6+3+1=10$."
    ],
    "trap": "For $c=1$, counting $b$ in $a+2b=5$ from $0$ to $5$, or missing the $c=2$ case (two $5$-coins).",
    "check": "List them: $5{+}5$; $3$ ways like $5{+}2{+}2{+}1$; $6$ ways without a $5$-coin; $10$ ways in all."
  },
  "refine-series-068": {
    "spot": "$a_n$ jumps to $\\frac{1}{n}$ at perfect squares and is $\\frac{1}{n^2}$ elsewhere: $n\\,a_n$ is always $1$ at the squares and $\\frac{1}{n}\\to0$ elsewhere.",
    "why": "$\\limsup$ only cares about the largest value approached infinitely often; split the sequence into the square and non-square subsequences, take each limit, and the larger one is the answer.",
    "steps": [
      "First confirm convergence: the square terms $\\frac{1}{k^2}$ sum to $\\frac{\\pi^2}{6}$, and the remaining $\\frac{1}{n^2}$ also total at most $\\frac{\\pi^2}{6}$, so the sum is finite.",
      "When $n=k^2$, $n\\,a_n=k^2\\cdot\\frac{1}{k^2}=1$; this subsequence is constantly $1$.",
      "For non-squares, $n\\,a_n=n\\cdot\\frac{1}{n^2}=\\frac{1}{n}\\to0$.",
      "The only subsequential limits are $1$ and $0$, the larger being $1$, so $\\limsup n\\,a_n=1$ (and since $n\\,a_n$ does not go to $0$, this shows the \"decreasing\" hypothesis cannot be dropped)."
    ],
    "trap": "Seeing that the vast majority of $n\\,a_n$ go to $0$ and answering $0$ — that is the $\\liminf$; the squares are sparse, but there are infinitely many of them.",
    "check": "This sequence is not decreasing (e.g. $a_3=\\frac{1}{9}<a_4=\\frac{1}{4}$), so it does not contradict the theorem."
  },
  "ser-012": {
    "spot": "The denominator of $\\frac{1}{n(n+1)}$ is two consecutive integers differing by $1$: partial fractions give $\\frac{1}{n}-\\frac{1}{n+1}$, which telescopes.",
    "why": "The reciprocal of a product of neighboring factors cancels as soon as you split it, and the partial sum is just $1-\\frac{1}{N+1}$.",
    "steps": [
      "$\\frac{1}{n(n+1)}=\\frac{1}{n}-\\frac{1}{n+1}$.",
      "Partial sum $S_N=\\left(1-\\frac{1}{2}\\right)+\\left(\\frac{1}{2}-\\frac{1}{3}\\right)+\\cdots=1-\\frac{1}{N+1}$.",
      "$N\\to\\infty$: $S_N\\to1$."
    ],
    "trap": "Splitting as $\\frac{1}{n}+\\frac{1}{n+1}$ (wrong sign), which turns it into the sum of two divergent series.",
    "check": "The first term alone is $\\frac{1}{2}$, the first three give $\\frac{3}{4}$, and it keeps creeping toward $1$."
  },
  "ser-019": {
    "spot": "The two factors of $\\frac{1}{n(n+2)}$ differ by $2$: split into $\\frac{1}{2}\\left(\\frac{1}{n}-\\frac{1}{n+2}\\right)$, which cancels every other term and leaves two leading terms.",
    "why": "For a telescoping series look straight at the partial sums; with a gap of $2$, remember the $\\frac{1}{2}$ in front and the two terms left over.",
    "steps": [
      "$\\frac{1}{n(n+2)}=\\frac{1}{2}\\left(\\frac{1}{n}-\\frac{1}{n+2}\\right)$.",
      "After the positive terms $1,\\frac{1}{2},\\frac{1}{3},\\dots$ cancel against the negative terms $\\frac{1}{3},\\frac{1}{4},\\dots$, what is left is $1+\\frac{1}{2}=\\frac{3}{2}$.",
      "Multiply by $\\frac{1}{2}$: the sum is $\\frac{3}{4}$."
    ],
    "trap": "Forgetting the coefficient $\\frac{1}{2}$ in front and answering $\\frac{3}{2}$; or keeping only $1$ and answering $\\frac{1}{2}$.",
    "check": "Each term is smaller than $\\frac{1}{n(n+1)}$, and that series sums to $1$; $\\frac{3}{4}<1$ makes sense."
  },
  "si-set-005": {
    "spot": "$f(x)=\\sin x+\\cos x$ is differentiable everywhere, so the critical points are where $f'(x)=\\cos x-\\sin x=0$, i.e. $\\tan x=1$.",
    "why": "For a differentiable function, critical points only come from the derivative being zero; on $[0,2\\pi]$, $\\tan x=1$ has exactly two solutions.",
    "steps": [
      "$f'(x)=\\cos x-\\sin x$.",
      "$\\cos x=\\sin x\\iff\\tan x=1$ (when $\\cos x=0$, $\\sin x=\\pm1$, so they cannot be equal); the solutions are $x=\\frac{\\pi}{4}+k\\pi$.",
      "The ones in $[0,2\\pi]$ are $\\frac{\\pi}{4}$ and $\\frac{5\\pi}{4}$.",
      "So the set of critical points is $\\left\\{\\frac{\\pi}{4},\\frac{5\\pi}{4}\\right\\}$."
    ],
    "trap": "Writing only $\\frac{\\pi}{4}$ and missing $\\frac{5\\pi}{4}$, which comes from the period $\\pi$; or writing the solutions of $\\tan x=1$ as $\\frac{\\pi}{4}+2k\\pi$.",
    "check": "$f(x)=\\sqrt2\\sin\\left(x+\\frac{\\pi}{4}\\right)$: the maximum $\\sqrt2$ is at $\\frac{\\pi}{4}$ and the minimum $-\\sqrt2$ at $\\frac{5\\pi}{4}$, exactly these two points."
  },
  "tmpl-int-partialfrac-002": {
    "spot": "The denominator of $\\frac{1}{x(x+2)}$ is two linear factors differing by $2$: partial fractions $\\frac{1}{2}\\left(\\frac{1}{x}-\\frac{1}{x+2}\\right)$, which integrate to logs.",
    "why": "A rational function with two distinct linear factors splits by partial fractions into two $\\ln$ terms; completing the square for an inverse trig form or substituting is the long way around.",
    "steps": [
      "$\\frac{1}{x(x+2)}=\\frac{1}{2}\\left(\\frac{1}{x}-\\frac{1}{x+2}\\right)$.",
      "Antiderivative $\\frac{1}{2}\\ln\\frac{x}{x+2}$ (on $[1,3]$, $x>0$, so no absolute values needed).",
      "Apply the limits: $\\frac{1}{2}\\left(\\ln\\frac{3}{5}-\\ln\\frac{1}{3}\\right)=\\frac{1}{2}\\ln\\frac{9}{5}$.",
      "So the integral is $\\frac{1}{2}\\ln\\frac{9}{5}\\approx0.294$."
    ],
    "trap": "Dropping the $\\frac{1}{2}$ in the partial fractions, which gives $\\ln\\frac{9}{5}\\approx0.588$, exactly double.",
    "check": "On $[1,3]$ the integrand falls from $\\frac{1}{3}$ to $\\frac{1}{15}$ over an interval of length $2$: the integral should be between $\\frac{2}{15}$ and $\\frac{2}{3}$."
  },
  "tmpl-int-partialfrac-003": {
    "spot": "The denominator of $\\frac{1}{x(x+1)}$ is the neighboring linear factors $x$ and $x+1$: partial fractions $\\frac{1}{x}-\\frac{1}{x+1}$, with coefficients exactly $1$.",
    "why": "For neighboring factors there are no coefficients to solve for, and the integral is directly $\\ln\\frac{x}{x+1}$.",
    "steps": [
      "$\\frac{1}{x(x+1)}=\\frac{1}{x}-\\frac{1}{x+1}$.",
      "Antiderivative $\\ln\\frac{x}{x+1}$ (on $[2,4]$, $x>0$).",
      "Apply the limits: $\\ln\\frac{4}{5}-\\ln\\frac{2}{3}=\\ln\\frac{4\\cdot3}{5\\cdot2}=\\ln\\frac{6}{5}$.",
      "So the integral is $\\ln\\frac{6}{5}\\approx0.182$."
    ],
    "trap": "Losing the minus sign on $\\ln\\frac{2}{3}$ at the lower limit, which gives $\\ln\\frac{4}{5}+\\ln\\frac{2}{3}=\\ln\\frac{8}{15}<0$; the integral of a positive function cannot be negative.",
    "check": "On $[2,4]$ the integrand falls from $\\frac{1}{6}$ to $\\frac{1}{20}$ over an interval of length $2$: the integral should be between $\\frac{1}{10}$ and $\\frac{1}{3}$."
  },
  "tmpl-int-partialfrac-004": {
    "spot": "The two factors in the denominator of $\\frac{1}{x(x+3)}$ differ by $3$: partial fractions $\\frac{1}{3}\\left(\\frac{1}{x}-\\frac{1}{x+3}\\right)$, where the coefficient in front is the reciprocal of the difference.",
    "why": "Distinct linear factors split into two logs, and the integral is done in one step; the difference is $3$, so remember to multiply by $\\frac{1}{3}$.",
    "steps": [
      "$\\frac{1}{x(x+3)}=\\frac{1}{3}\\left(\\frac{1}{x}-\\frac{1}{x+3}\\right)$.",
      "Antiderivative $\\frac{1}{3}\\ln\\frac{x}{x+3}$ (on $[1,5]$, $x>0$).",
      "Apply the limits: $\\frac{1}{3}\\left(\\ln\\frac{5}{8}-\\ln\\frac{1}{4}\\right)=\\frac{1}{3}\\ln\\frac{5}{2}$.",
      "So the integral is $\\frac{1}{3}\\ln\\frac{5}{2}\\approx0.305$."
    ],
    "trap": "Writing the partial fraction coefficient as $1$ instead of $\\frac{1}{3}$, which makes the answer $\\ln\\frac{5}{2}\\approx0.916$, three times too big.",
    "check": "On $[1,5]$ the integrand falls from $\\frac{1}{4}$ to $\\frac{1}{40}$ over an interval of length $4$: the integral should be between $\\frac{1}{10}$ and $1$."
  },
  "cl-der-013": {
    "spot": "The angle between two curves is the angle between their tangent lines at the intersection; both are circles, and a tangent is perpendicular to the radius, so you can also look at the angle between the two radii (normal vectors).",
    "why": "Use implicit differentiation to get the two tangent slopes, then apply $\\tan\\theta=\\left|\\frac{m_1-m_2}{1+m_1m_2}\\right|$; the dot product of the vectors from the centers to the intersection is another quick route.",
    "steps": [
      "First circle: $2x+2yy'=0$, $y'=-\\frac{x}{y}$, so at $(1,\\sqrt3)$, $m_1=-\\frac{1}{\\sqrt3}$.",
      "Second circle: $2(x-2)+2yy'=0$, $y'=-\\frac{x-2}{y}$, so at the intersection $m_2=\\frac{1}{\\sqrt3}$.",
      "$\\tan\\theta=\\left|\\frac{m_1-m_2}{1+m_1m_2}\\right|=\\frac{2/\\sqrt3}{1-1/3}=\\sqrt3$.",
      "Acute angle $\\theta=\\arctan\\sqrt3=\\frac{\\pi}{3}$."
    ],
    "trap": "Treating the tangent slopes themselves as angles and subtracting, or stopping at the angle $\\frac{\\pi}{6}$ that the tangent lines make with the $x$-axis.",
    "check": "Normal vectors $(1,\\sqrt3)$ and $(-1,\\sqrt3)$: $\\cos\\theta=\\frac{-1+3}{2\\cdot2}=\\frac{1}{2}$, so $\\theta=\\frac{\\pi}{3}$."
  },
  "cl-der-020": {
    "spot": "In the family of lines $\\frac{x}{a}+\\frac{y}{1-a}=1$ the parameter $a$ appears in both denominators: a point on the envelope is where the partial derivative with respect to $a$ is also $0$; fixing $x=\\frac{1}{9}$, this is the same as finding the line in the family that makes $y$ largest.",
    "why": "With $x$ fixed, solving for $y$ gives a one-variable function of $a$, and finding its extremum in $a$ is the envelope condition; no need to derive the equation of the whole envelope first.",
    "steps": [
      "Fix $x=\\frac{1}{9}$ and solve: $y=(1-a)\\left(1-\\frac{1}{9a}\\right)$.",
      "Envelope condition $\\frac{\\partial}{\\partial a}=0$: $\\frac{dy}{da}=-1+\\frac{1}{9a^2}=0$, so $a=\\frac{1}{3}$.",
      "Substitute back: $y=\\left(1-\\frac{1}{3}\\right)\\left(1-\\frac{1}{3}\\right)=\\frac{4}{9}$.",
      "In general the envelope is $\\sqrt x+\\sqrt y=1$: $\\sqrt{\\frac{1}{9}}+\\sqrt{\\frac{4}{9}}=\\frac{1}{3}+\\frac{2}{3}=1$."
    ],
    "trap": "Misremembering the envelope as $x+y=1$ (one particular line of the family) and answering $\\frac{8}{9}$; the envelope is the curve every line touches, not one of the lines.",
    "check": "The line with $a=\\frac{1}{3}$ does pass through $\\left(\\frac{1}{9},\\frac{4}{9}\\right)$: $\\frac{1/9}{1/3}+\\frac{4/9}{2/3}=\\frac{1}{3}+\\frac{2}{3}=1$."
  },
  "cl-der-025": {
    "spot": "Both sides of $\\ln(1+x)\\ge\\frac{kx}{1+x}$ are $0$ at $x=0$: rearrange into $g(x)=(1+x)\\ln(1+x)-kx\\ge0$; starting from $g(0)=0$, it must not head downward right at the start.",
    "why": "Starting from the endpoint where equality holds and looking at the sign of the derivative is cleaner than handling the fractional inequality directly; the largest $k$ is pinned down by the slope as $x\\to0^+$.",
    "steps": [
      "For $x>0$, $1+x>0$, so the inequality is equivalent to $g(x)=(1+x)\\ln(1+x)-kx\\ge0$, with $g(0)=0$.",
      "$g'(x)=\\ln(1+x)+1-k$; $g'(0)=1-k$.",
      "If $k\\le1$: $g'(x)\\ge\\ln(1+x)>0$, so $g$ is increasing and $g(x)>0$ holds.",
      "If $k>1$: $g'(0)<0$, so for small $x$, $g(x)<0$ and the inequality fails. For example $k=1.1$, $x=0.01$.",
      "So the largest value is $k=1$; it is the infimum of $\\frac{(1+x)\\ln(1+x)}{x}$, reached as $x\\to0^+$."
    ],
    "trap": "Plugging in a single point such as $x=1$ and getting $k\\le2\\ln2\\approx1.386$; the tightest constraint actually comes from $x\\to0^+$.",
    "check": "$k=1$ is the well-known inequality $\\ln(1+x)\\ge\\frac{x}{1+x}$; at $x=1$: $\\ln2\\approx0.693\\ge0.5$."
  },
  "cl-der-026": {
    "spot": "$\\sin x\\ge ax$ on $\\left(0,\\frac{\\pi}{2}\\right]$ is equivalent to $a\\le\\frac{\\sin x}{x}$: the largest $a$ is the minimum of $\\frac{\\sin x}{x}$ on the interval; $\\sin x$ is concave, so the chord lies below the curve.",
    "why": "Separate out the parameter to turn it into a minimum problem, then show $\\frac{\\sin x}{x}$ is decreasing, so the minimum is at the right endpoint $x=\\frac{\\pi}{2}$.",
    "steps": [
      "At $x=0$ both sides are $0$; for $x>0$ the condition is $a\\le\\frac{\\sin x}{x}$.",
      "$\\left(\\frac{\\sin x}{x}\\right)'=\\frac{x\\cos x-\\sin x}{x^2}$.",
      "The numerator $h(x)=x\\cos x-\\sin x$ has $h(0)=0$ and $h'(x)=-x\\sin x<0$, so $h<0$ and $\\frac{\\sin x}{x}$ is decreasing.",
      "The minimum is at $x=\\frac{\\pi}{2}$: $\\frac{1}{\\pi/2}=\\frac{2}{\\pi}$, so the largest value is $a=\\frac{2}{\\pi}$."
    ],
    "trap": "Using $\\lim_{x\\to0}\\frac{\\sin x}{x}=1$ and answering $a=1$; that is the maximum, but the condition must hold at every point of the interval, so the minimum is what sets the limit.",
    "check": "Geometrically, $y=\\frac{2}{\\pi}x$ is the chord joining $(0,0)$ and $\\left(\\frac{\\pi}{2},1\\right)$, and the concave $\\sin x$ lies above it; at the midpoint $x=\\frac{\\pi}{4}$: $\\frac{\\sqrt2}{2}>\\frac{1}{2}$."
  },
  "cl-der-030": {
    "spot": "$f$ is piecewise with its value at $x=0$ given separately, and $\\sin\\frac{1}{x}$ oscillates wildly near $0$: $f'(0)$ can only be computed from the definition, not by finding $f'(x)$ and taking a limit.",
    "why": "For $x\\ne0$, $f'(x)$ contains $-2\\cos\\frac{1}{x}$, which has no limit, but that does not mean $f'(0)$ fails to exist; in the definition, the oscillating term is squeezed to $0$ by the factor $x$.",
    "steps": [
      "Definition: $f'(0)=\\lim_{x\\to0}\\frac{f(x)-f(0)}{x}=\\lim_{x\\to0}\\frac{x+2x^2\\sin(1/x)}{x}=\\lim_{x\\to0}\\left(1+2x\\sin\\frac{1}{x}\\right)$.",
      "Squeeze Theorem: $\\left|2x\\sin\\frac{1}{x}\\right|\\le2|x|\\to0$.",
      "So $f'(0)=1$."
    ],
    "trap": "Computing $f'(x)=1+4x\\sin\\frac{1}{x}-2\\cos\\frac{1}{x}$ first, seeing it has no limit at $0$, and saying $f'(0)$ does not exist; a derivative can exist without the derivative function being continuous.",
    "check": "Interestingly, $f'(0)=1>0$, yet $f$ is not increasing near $0$: $f'(x)$ keeps taking negative values around $-1$ arbitrarily close to $0$."
  },
  "cl-der-034": {
    "spot": "Second derivative of a parametric curve: $\\frac{d^2y}{dx^2}=\\frac{\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)}{\\frac{dx}{dt}}$; the denominator is $\\frac{dx}{dt}$, not another $\\frac{d^2x}{dt^2}$.",
    "why": "First find $\\frac{dy}{dx}$ as a function of $t$, then differentiate in $t$ and divide by $x'(t)$; using $\\frac{y''(t)}{x''(t)}$ directly is wrong.",
    "steps": [
      "$x'(t)=e^t(\\cos t-\\sin t)$, $y'(t)=e^t(\\sin t+\\cos t)$.",
      "$\\frac{dy}{dx}=\\frac{\\sin t+\\cos t}{\\cos t-\\sin t}$ (the $e^t$ cancels).",
      "Differentiate in $t$: $\\frac{d}{dt}\\frac{\\sin t+\\cos t}{\\cos t-\\sin t}=\\frac{(\\cos t-\\sin t)^2+(\\sin t+\\cos t)^2}{(\\cos t-\\sin t)^2}=\\frac{2}{(\\cos t-\\sin t)^2}$, which is $2$ at $t=0$.",
      "Divide by $x'(0)=1$: $\\frac{d^2y}{dx^2}\\Big|_{t=0}=\\frac{2}{1}=2$."
    ],
    "trap": "Computing $\\frac{y''(0)}{x''(0)}$: $y''(t)=2e^t\\cos t$ and $x''(t)=-2e^t\\sin t$, so at $t=0$ the denominator is $0$ and you would think it does not exist.",
    "check": "The general formula is $\\frac{d^2y}{dx^2}=\\frac{2}{e^t(\\cos t-\\sin t)^3}$, and plugging in $t=0$ gives $2$."
  },
  "cl-der-035": {
    "spot": "$f(x,y)=e^x\\cos y$ is a function of $x$ times a function of $y$: the second-order Taylor polynomial is just $e^x\\approx1+x+\\frac{x^2}{2}$ times $\\cos y\\approx1-\\frac{y^2}{2}$, keeping terms of degree two or less.",
    "why": "When the function separates, multiplying the one-variable expansions is faster than computing $f_x,f_y,f_{xx},f_{xy},f_{yy}$ one by one, and you are less likely to miss a cross term.",
    "steps": [
      "$e^x=1+x+\\frac{x^2}{2}+\\cdots$, $\\cos y=1-\\frac{y^2}{2}+\\cdots$ ($\\cos y$ has no linear term).",
      "Multiply and keep up to degree two: $T_2=1+x+\\frac{x^2}{2}-\\frac{y^2}{2}$ ($x\\cdot y^2$ and the like are degree three, dropped; the cross term is $f_{xy}(0,0)=-e^0\\sin0=0$).",
      "Plug in $(0.2,0.4)$: $1+0.2+0.02-0.08=1.14$."
    ],
    "trap": "Getting the sign of the $y^2$ term wrong as $+\\frac{y^2}{2}$, which gives $1.30$; the second-order coefficient of $\\cos y$ is negative.",
    "check": "The true value $e^{0.2}\\cos0.4\\approx1.125$ differs from $T_2=1.14$ by about $0.015$, the size of the third-order terms."
  }
};
