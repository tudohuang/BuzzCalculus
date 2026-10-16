// Detail v2, English — batch 042. Translation of tools/content/detail/042.js (text only; claims live in the Chinese file).
module.exports = {
  "cl-ser-013": {
    "spot": "The denominator $n(n+1)$ splits as $\\frac{1}{n}-\\frac{1}{n+1}$, and $\\frac{1}{2^n}$ is $x^n$ at $x=\\frac{1}{2}$ — each half is a relative of $\\sum\\frac{x^n}{n}=-\\ln(1-x)$.",
    "why": "A straight telescoping cancellation fails (the $2^n$ gets in the way), so split into partial fractions first, then use the power series for $-\\ln(1-x)$; both sums have closed forms.",
    "steps": [
      "Partial fractions: $\\frac{1}{n(n+1)}=\\frac{1}{n}-\\frac{1}{n+1}$.",
      "First sum: $\\sum_{n\\ge1}\\frac{(1/2)^n}{n}=-\\ln\\left(1-\\frac{1}{2}\\right)=\\ln 2$.",
      "Second sum: $\\sum_{n\\ge1}\\frac{x^n}{n+1}=\\frac{1}{x}\\sum_{n\\ge1}\\frac{x^{n+1}}{n+1}=\\frac{1}{x}\\left(-\\ln(1-x)-x\\right)$; plugging in $x=\\frac{1}{2}$ gives $2\\left(\\ln 2-\\frac{1}{2}\\right)=2\\ln 2-1$.",
      "Subtract: $\\ln 2-(2\\ln 2-1)=1-\\ln 2$."
    ],
    "trap": "Treating the second sum $\\sum\\frac{x^n}{n+1}$ as $\\ln 2$ too, so the difference comes out $0$. With denominator $n+1$ you must multiply by $x$ and then divide by $x$, and the $n=0$ term $x$ is missing.",
    "check": "The first three terms give $\\frac{1}{4}+\\frac{1}{24}+\\frac{1}{96}\\approx 0.302$, and the rest are tiny — consistent with $1-\\ln 2\\approx 0.307$."
  },
  "cl-ser-014": {
    "spot": "There is a $2n+1$ in the denominator and $9^n=3^{2n}$ — only odd powers $\\left(\\frac{1}{3}\\right)^{2n+1}$ appear, exactly the shape of $\\frac{1}{2}\\ln\\frac{1+x}{1-x}=\\sum\\frac{x^{2n+1}}{2n+1}$.",
    "why": "Only after rewriting $9^n$ as $\\left(\\frac{1}{3}\\right)^{2n}$ do you see an odd-power series; if you read it as $\\sum\\frac{x^n}{2n+1}$ at $x=\\frac{1}{9}$, there is no ready-made formula.",
    "steps": [
      "Rewrite the general term: $\\frac{1}{(2n+1)9^n}=3\\cdot\\frac{(1/3)^{2n+1}}{2n+1}$.",
      "$\\sum_{n\\ge0}x^{2n}=\\frac{1}{1-x^2}$; integrating term by term gives $\\sum\\frac{x^{2n+1}}{2n+1}=\\frac{1}{2}\\ln\\frac{1+x}{1-x}$ (for $|x|<1$). Check its derivative at $x=\\frac{1}{2}$.",
      "Plug in $x=\\frac{1}{3}$: $\\frac{1}{2}\\ln\\frac{4/3}{2/3}=\\frac{1}{2}\\ln 2$.",
      "Multiply back by $3$: the sum is $=\\frac{3}{2}\\ln 2$."
    ],
    "trap": "Stopping at $\\sum\\frac{(1/3)^{2n+1}}{2n+1}=\\frac{1}{2}\\ln 2$ and forgetting the factor $3$ in front of the general term, answering $\\frac{1}{2}\\ln 2\\approx 0.347$.",
    "check": "The first three terms $1+\\frac{1}{27}+\\frac{1}{405}\\approx 1.0395$ are just short of $\\frac{3}{2}\\ln 2\\approx 1.0397$."
  },
  "cl-ser-020": {
    "spot": "The tail of a geometric series has the closed form $\\frac{x^{N+1}}{1-x}$: uniform convergence asks whether its maximum over the interval goes to $0$, and the key is whether the interval touches or approaches $x=\\pm1$.",
    "why": "Pointwise convergence only needs $|x|<1$; uniform convergence looks at the worst $x$ on the whole interval, and the tail blows up as $x\\to1^-$, so the interval must stay a fixed distance away from $\\pm1$.",
    "steps": [
      "Tail: $\\sum_{n>N}x^n=\\frac{x^{N+1}}{1-x}$ (e.g. with $x=\\frac{1}{2}$, $N=3$).",
      "On $\\left[-\\frac{1}{2},\\frac{1}{2}\\right]$: $|x|^{N+1}\\le\\left(\\frac{1}{2}\\right)^{N+1}$ and $1-x\\ge\\frac{1}{2}$, so the tail is $\\le\\left(\\frac{1}{2}\\right)^N\\to 0$ — uniform convergence.",
      "On $(-1,1)$ or $[0,1)$: as $x\\to1^-$, $\\frac{x^{N+1}}{1-x}\\to\\infty$, so the maximum has no finite bound at all (with $N=10$ and $x=0.999$ it is already nearly a thousand).",
      "On $[-1,0]$: at $x=-1$ the partial sums jump $1,0,1,0,\\dots$, so the series diverges at that point.",
      "So of the four intervals, only $\\left[-\\frac{1}{2},\\frac{1}{2}\\right]$ gives uniform convergence."
    ],
    "trap": "Thinking that \"converges at every point of $(-1,1)$\" means uniform convergence. Uniform convergence needs the worst $x$ to be pushed down too, and the closer $x$ is to $1$ the more terms you need — there is no common $N$.",
    "check": "The Weierstrass M-test agrees: on $\\left[-\\frac{1}{2},\\frac{1}{2}\\right]$, $|x^n|\\le\\left(\\frac{1}{2}\\right)^n$, and $\\sum\\left(\\frac{1}{2}\\right)^n=2$ converges."
  },
  "cl-ser-029": {
    "spot": "The ratio $\\frac{a_{n+1}}{a_n}=\\frac{3n+4}{3n+9}$ tends to $1$, so the Ratio Test is inconclusive; the quantity $n\\left(\\frac{a_n}{a_{n+1}}-1\\right)$ the problem asks for is Raabe's quantity — flip the ratio, subtract $1$, multiply by $n$.",
    "why": "The ratio is a ratio of linear terms with limit exactly $1$, so all you can do is measure how far it is from $1$; flipping and subtracting leaves something of size $\\frac{\\text{constant}}{n}$, and multiplying by $n$ leaves a single number.",
    "steps": [
      "First confirm the Ratio Test fails: $\\frac{3n+4}{3n+9}\\to 1$.",
      "Flip and subtract $1$: $\\frac{a_n}{a_{n+1}}-1=\\frac{3n+9}{3n+4}-1=\\frac{5}{3n+4}$.",
      "Multiply by $n$ and take the limit: $\\frac{5n}{3n+4}\\to\\frac{5}{3}$."
    ],
    "trap": "Not flipping the ratio and computing $n\\left(\\frac{a_{n+1}}{a_n}-1\\right)=-\\frac{5n}{3n+9}\\to-\\frac{5}{3}$ — the sign comes out completely backwards.",
    "check": "$\\frac{5}{3}>1$, so Raabe's test says the series converges; this matches $a_n$ behaving roughly like $n^{-5/3}$ ($p=\\frac{5}{3}>1$)."
  },
  "cl-ser-039": {
    "spot": "The general term is $\\frac{t^n}{n^2}$ with $t=2x+1$: the Ratio Test gives $|t|<1$, and at the endpoints $\\left|\\frac{t^n}{n^2}\\right|=\\frac{1}{n^2}$ is exactly the $p=2$ series.",
    "why": "For a power series, first use the Ratio Test to get the open interval, then check each endpoint separately; here both endpoints are controlled by $\\frac{1}{n^2}$, which is the easiest case.",
    "steps": [
      "Ratio: $\\left|\\frac{t^{n+1}/(n+1)^2}{t^n/n^2}\\right|=|t|\\frac{n^2}{(n+1)^2}\\to|t|$, so it converges for $|2x+1|<1$.",
      "$|2x+1|<1$ means $-1<x<0$: at $x=-1$, $t=-1$; at $x=0$, $t=1$.",
      "$x=0$ ($t=1$): $\\sum\\frac{1}{n^2}$ converges.",
      "$x=-1$ ($t=-1$): the absolute series of $\\sum\\frac{(-1)^n}{n^2}$ is $\\sum\\frac{1}{n^2}$, so it converges absolutely.",
      "Both endpoints converge, so the interval of convergence is $[-1,0]$."
    ],
    "trap": "Taking radius $1$ and center $0$ and writing $|x|<1$, or skipping the endpoints and writing $(-1,0)$. Converting the radius in $t=2x+1$ back to $x$ means dividing by $2$, and the center is $-\\frac{1}{2}$.",
    "check": "The center $-\\frac{1}{2}$ of $[-1,0]$ is exactly where $2x+1=0$, and the radius $\\frac{1}{2}$ matches too."
  },
  "cl-ser-040": {
    "spot": "$(x+3)^n$ paired with $4^n$: radius $4$, center $-3$. There is also a $\\sqrt n$ in the denominator, so one endpoint becomes the alternating $\\frac{(-1)^n}{\\sqrt n}$ and the other becomes $\\frac{1}{\\sqrt n}$ — they behave differently.",
    "why": "The Ratio Test only gives the open interval; the $\\sqrt n$ at the endpoints is $p=\\frac{1}{2}$, so you must handle one endpoint with the Alternating Series Test and the other with the $p$-series test.",
    "steps": [
      "Ratio: $\\frac{|x+3|}{4}\\sqrt{\\frac{n}{n+1}}\\to\\frac{|x+3|}{4}$, radius $4$, open interval $(-7,1)$.",
      "$x=1$: $x+3=4$, general term $\\frac{(-1)^n4^n}{\\sqrt n\\,4^n}=\\frac{(-1)^n}{\\sqrt n}$.",
      "$\\frac{1}{\\sqrt n}$ decreases to $0$, so by the Alternating Series Test it converges at $x=1$.",
      "$x=-7$: $x+3=-4$, general term $\\frac{(-1)^n(-4)^n}{\\sqrt n\\,4^n}=\\frac{1}{\\sqrt n}$, which diverges just like $\\int_1^\\infty\\frac{dx}{\\sqrt x}$ (integrating up to $10000$ already gives $198$).",
      "The interval of convergence is $(-7,1]$: the right endpoint converges, the left endpoint diverges."
    ],
    "trap": "Missing that $(-1)^n$ and $(-4)^n$ cancel, thinking $x=-7$ is also alternating, and writing $[-7,1]$. In fact $(-1)^n(-4)^n=4^n$ — every minus sign is gone.",
    "check": "The midpoint $\\frac{-7+1}{2}=-3$ is exactly where $x+3=0$, and the length $8$ is twice the radius $4$."
  },
  "cl-ser-043": {
    "spot": "$e^x\\cos x$ is a product of two familiar Maclaurin series, and you only need the $x^5$ coefficient — pair $x^0,x^2,x^4$ from $\\cos x$ with $x^5,x^3,x^1$ from $e^x$ and add the three products.",
    "why": "Differentiating $e^x\\cos x$ five times and plugging in $0$ makes it easy to drop terms; multiplying series, you only pick pairs whose degrees add to $5$ — three products and you're done.",
    "steps": [
      "$e^x=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\frac{x^4}{24}+\\frac{x^5}{120}+\\cdots$.",
      "$\\cos x=1-\\frac{x^2}{2}+\\frac{x^4}{24}-\\cdots$, even powers only.",
      "Pairs: $1\\cdot\\frac{1}{120}$, $\\left(-\\frac{1}{2}\\right)\\cdot\\frac{1}{6}=-\\frac{1}{12}$, $\\frac{1}{24}\\cdot 1=\\frac{1}{24}$.",
      "Add: $\\frac{1}{120}-\\frac{10}{120}+\\frac{5}{120}=-\\frac{4}{120}=-\\frac{1}{30}$."
    ],
    "trap": "Taking only $1\\cdot\\frac{x^5}{120}$ and getting $\\frac{1}{120}$, missing the cross terms $x^2\\cdot x^3$ and $x^4\\cdot x$; or remembering the $x^2$ coefficient of $\\cos x$ as $+\\frac{1}{2}$.",
    "check": "The $n$-th derivative of $e^x\\cos x$ at $0$ is $2^{n/2}\\cos\\frac{n\\pi}{4}$; $n=5$ gives $-4$, and dividing by $5!=120$ gives exactly $-\\frac{1}{30}$."
  },
  "db-chain-006": {
    "spot": "Inside the $\\ln$ is $\\sqrt{x^2+4}-x$: the Chain Rule puts $\\frac{x}{\\sqrt{x^2+4}}-1$ in the numerator, which over a common denominator is exactly $-\\frac{\\sqrt{x^2+4}-x}{\\sqrt{x^2+4}}$ and cancels with the denominator.",
    "why": "The Chain Rule with outer $\\frac{1}{u}$ and inner $u'$ is the most direct route; once you see the same factor on top and bottom, the result collapses to one term.",
    "steps": [
      "Inner derivative: $\\frac{d}{dx}\\left(\\sqrt{x^2+4}-x\\right)=\\frac{x}{\\sqrt{x^2+4}}-1$.",
      "Outer $\\ln u$ gives $\\frac{1}{u}$: derivative $=\\frac{\\frac{x}{\\sqrt{x^2+4}}-1}{\\sqrt{x^2+4}-x}$.",
      "Combine the numerator: $=\\frac{x-\\sqrt{x^2+4}}{\\sqrt{x^2+4}}$; cancelling with the denominator $\\sqrt{x^2+4}-x$ leaves $-1$.",
      "So the derivative is $-\\frac{1}{\\sqrt{x^2+4}}$."
    ],
    "trap": "Doing only the outer layer and writing $\\frac{1}{\\sqrt{x^2+4}-x}$, forgetting the inner derivative; or writing the derivative of $\\sqrt{x^2+4}$ as $\\frac{1}{2\\sqrt{x^2+4}}$ and dropping the $2x$.",
    "check": "$(\\sqrt{x^2+4}-x)(\\sqrt{x^2+4}+x)=4$, so the function is $\\ln 4-\\ln(\\sqrt{x^2+4}+x)$, and a derivative of $\\frac{1}{\\sqrt{x^2+4}}$ with a minus sign makes sense."
  },
  "db-imp-004": {
    "spot": "$\\cos y=x$ defines $y$ implicitly, and you only need the slope at one point: differentiate both sides with respect to $x$, attach a $y'$ to the $y$ part, and plug in the point.",
    "why": "No need to solve for $y=\\arccos x$ and recall the inverse-trig derivative; implicit differentiation gives $y'=-\\frac{1}{\\sin y}$ in one line, then plug in $y=\\frac{\\pi}{3}$.",
    "steps": [
      "The point is on the curve: $\\cos\\frac{\\pi}{3}=\\frac{1}{2}$.",
      "Differentiate both sides with respect to $x$: $-\\sin y\\cdot y'=1$, so $y'=-\\frac{1}{\\sin y}$.",
      "Plug in $y=\\frac{\\pi}{3}$: $\\sin\\frac{\\pi}{3}=\\frac{\\sqrt3}{2}$, so $y'=-\\frac{2}{\\sqrt3}$."
    ],
    "trap": "Dropping the minus sign when differentiating $\\cos y$ and getting $+\\frac{2}{\\sqrt3}$, or plugging in $\\cos y=\\frac{1}{2}$ where $\\sin y$ belongs and getting $-2$.",
    "check": "With $y=\\arccos x$, $\\frac{d}{dx}\\arccos x=-\\frac{1}{\\sqrt{1-x^2}}$ at $x=\\frac{1}{2}$ is also $-\\frac{2}{\\sqrt3}$."
  },
  "db-rr-005": {
    "spot": "The lamp, the person, and the tip of the shadow form two similar triangles: shadow length $s$ over total length $x+s$ equals height over lamp height $\\frac{1.8}{5.4}=\\frac{1}{3}$. Write $s$ as a multiple of $x$ first, then differentiate with respect to time.",
    "why": "Similar triangles give the linear relation $s=\\frac{x}{2}$, so after differentiating the rates differ only by a constant factor — simpler than setting up an implicit equation.",
    "steps": [
      "Similarity ratio: $\\frac{s}{x+s}=\\frac{1.8}{5.4}=\\frac{1}{3}$.",
      "Solve $3s=x+s$, i.e. $s=\\frac{x}{2}$ (plug back into the ratio to confirm).",
      "Differentiate with respect to $t$: $\\frac{ds}{dt}=\\frac{1}{2}\\frac{dx}{dt}$.",
      "$\\frac{dx}{dt}=1.5$, so $\\frac{ds}{dt}=0.75$ m/s."
    ],
    "trap": "Computing the speed of the shadow's tip instead, $\\frac{d(x+s)}{dt}=1.5+0.75=2.25$. The question asks for the rate of change of the shadow's length, not how fast the tip moves away from the lamppost.",
    "check": "The tip's speed should be $1.5\\cdot\\frac{5.4}{5.4-1.8}=2.25$; subtracting the person's $1.5$ leaves exactly the shadow's $0.75$."
  },
  "dd-grw-003": {
    "spot": "Half-life $8$ days, initial mass $40$ g: the mass is $40\\cdot2^{-t/8}$, the decay rate is its derivative in $t$, and $t=8$ is exactly one half-life, leaving $20$ g.",
    "why": "Writing the model in base $2$ is most direct; differentiating brings out the two factors $\\ln 2$ and $-\\frac{1}{8}$. No need to convert to $e^{-kt}$ and solve for $k$ first.",
    "steps": [
      "Model: $m(t)=40\\cdot 2^{-t/8}$, $m(8)=20$.",
      "Differentiate: $m'(t)=40\\cdot2^{-t/8}\\cdot\\ln 2\\cdot\\left(-\\frac{1}{8}\\right)=-5\\ln 2\\cdot 2^{-t/8}$.",
      "Plug in $t=8$: $m'(8)=-5\\ln2\\cdot\\frac{1}{2}=-2.5\\ln 2\\approx-1.733$ g/day."
    ],
    "trap": "Using the average rate $\\frac{20-40}{8}=-2.5$ as the answer and missing the $\\ln 2$; or applying the Power Rule and writing $\\frac{d}{dt}2^{-t/8}$ as $-\\frac{t}{8}2^{-t/8-1}$.",
    "check": "For exponential decay the rate is $=-km$; with $k=\\frac{\\ln2}{8}$ and $m=20$ you get $-\\frac{20\\ln 2}{8}$, the same."
  },
  "dd-imp-003": {
    "spot": "$e^{xy}=x+y$ can't be solved for $y$, and you only need the slope at $(0,1)$: implicit differentiation, with the Product Rule on the $xy$ on the left.",
    "why": "For an implicit equation, differentiating both sides in $x$ and plugging in the point is fastest; at $x=0$ the $xy'$ term vanishes, so there is almost nothing to solve.",
    "steps": [
      "The point is on the curve: $e^{0}=1=0+1$.",
      "Let $F=e^{xy}-x-y$: $F_x=ye^{xy}-1$, $F_y=xe^{xy}-1$.",
      "$y'=-\\frac{F_x}{F_y}=\\frac{1-ye^{xy}}{xe^{xy}-1}$; at $(0,1)$: $\\frac{1-1}{0-1}=0$."
    ],
    "trap": "Differentiating $e^{xy}$ as just $e^{xy}\\cdot y$ or $e^{xy}\\cdot xy'$, dropping half of the Product Rule; at this point that gives a wrong number like $y'=-1$.",
    "check": "Plug $(0,1)$ directly into $e^{xy}(y+xy')=1+y'$: $1\\cdot(1+0)=1+y'$, which again gives $y'=0$."
  },
  "dd-imp-008": {
    "spot": "$x^3+y^3=9xy$ (the folium of Descartes) can't be solved for $y$: implicit differentiation, Product Rule on the $9xy$ on the right, then plug in $(2,4)$.",
    "why": "Using $y'=-\\frac{F_x}{F_y}$ and plugging in the point is cleanest — no need to simplify a general formula. First confirm the point is on the curve.",
    "steps": [
      "The point is on the curve: $8+64=72=9\\cdot2\\cdot4$.",
      "$F=x^3+y^3-9xy$: $F_x=3x^2-9y$, $F_y=3y^2-9x$.",
      "At $(2,4)$: $F_x=12-36=-24$, $F_y=48-18=30$.",
      "$y'=-\\frac{-24}{30}=\\frac{4}{5}$."
    ],
    "trap": "Differentiating $9xy$ as just $9y$ or $9xy'$, taking only half; if you drop the right side's contribution to $y'$ entirely, you get $-\\frac{x^2}{y^2}=-\\frac{1}{4}$.",
    "check": "The slope $\\frac{4}{5}$ is positive: near $(2,4)$, $y$ increases as $x$ increases, matching this part of the folium heading up and to the right; plugging back into the implicit derivative, both sides agree."
  },
  "dd-inv-008": {
    "spot": "Numerator $\\sinh x$, denominator $1+\\cosh x$: the Quotient Rule produces $\\cosh^2x-\\sinh^2x$ in the numerator, exactly the shape of the identity $=1$.",
    "why": "Expand with the Quotient Rule in one step, then $\\cosh^2-\\sinh^2=1$ turns the numerator into $1+\\cosh x$, which cancels once with the denominator.",
    "steps": [
      "Quotient Rule: $\\frac{\\cosh x(1+\\cosh x)-\\sinh x\\cdot\\sinh x}{(1+\\cosh x)^2}$.",
      "Use $\\cosh^2x-\\sinh^2x=1$: the numerator is $=\\cosh x+1$.",
      "Cancel one factor of $1+\\cosh x$: derivative $=\\frac{1}{1+\\cosh x}$."
    ],
    "trap": "Treating hyperbolic functions like trig functions and using $\\cos^2+\\sin^2=1$, i.e. writing $\\cosh^2x+\\sinh^2x=1$ — then the numerator doesn't cancel.",
    "check": "$\\frac{\\sinh x}{1+\\cosh x}=\\tanh\\frac{x}{2}$, and its derivative $\\frac{1}{2}\\,\\mathrm{sech}^2\\frac{x}{2}=\\frac{1}{1+\\cosh x}$ — consistent."
  },
  "der-013": {
    "spot": "Both the base $x$ and the exponent $\\sin x$ vary: it's neither the Power Rule nor the exponential rule, so take logs to bring the exponent down.",
    "why": "$x^{\\sin x}=e^{\\sin x\\ln x}$; after taking logs you have the product $\\sin x\\ln x$, which the Product Rule handles. Forcing any single rule gets you only half the answer.",
    "steps": [
      "Take logs: $\\ln y=\\sin x\\,\\ln x$.",
      "Differentiate both sides: $\\frac{y'}{y}=\\cos x\\ln x+\\frac{\\sin x}{x}$.",
      "Multiply back by $y$: $y'=x^{\\sin x}\\left(\\cos x\\ln x+\\frac{\\sin x}{x}\\right)$."
    ],
    "trap": "Using the Power Rule to write $\\sin x\\cdot x^{\\sin x-1}$ (only the $\\frac{\\sin x}{x}$ half is right), or the exponential rule to write $x^{\\sin x}\\ln x\\cos x$ (only the other half is right).",
    "check": "At $x=1$, $\\ln 1=0$, so the answer reduces to $1\\cdot\\sin 1$."
  },
  "dm-int-004": {
    "spot": "$(\\ln x)^2$ with $\\int_0^1$: substitute $x=e^{-u}$ to turn $\\ln x$ into $-u$ and the interval into $[0,\\infty)$, then expand $\\frac{1}{1+e^{-2u}}$ as a geometric series; every term is a $\\Gamma$-type integral $\\int u^2e^{-au}du$.",
    "why": "$\\frac{(\\ln x)^2}{1+x^2}$ has no elementary antiderivative; in terms of $u$ every term is $\\int_0^\\infty u^2e^{-au}du=\\frac{2}{a^3}$, so the whole integral becomes a known alternating series.",
    "steps": [
      "Substitute $x=e^{-u}$, $dx=-e^{-u}du$: $\\int_0^1\\frac{(\\ln x)^2}{1+x^2}dx=\\int_0^\\infty\\frac{u^2e^{-u}}{1+e^{-2u}}du$.",
      "Expand $\\frac{1}{1+e^{-2u}}=\\sum_{n\\ge0}(-1)^ne^{-2nu}$; the integrand becomes $\\sum(-1)^nu^2e^{-(2n+1)u}$.",
      "$\\Gamma$-type: $\\int_0^\\infty u^2e^{-au}du=\\frac{2}{a^3}$ (e.g. with $a=3$).",
      "Integrate term by term: $2\\sum_{n\\ge0}\\frac{(-1)^n}{(2n+1)^3}$, and $\\sum\\frac{(-1)^n}{(2n+1)^3}=\\frac{\\pi^3}{32}$.",
      "So the integral is $=2\\cdot\\frac{\\pi^3}{32}=\\frac{\\pi^3}{16}$."
    ],
    "trap": "Dropping the $(-1)^n$ when expanding $\\frac{1}{1+e^{-2u}}$, which gives $2\\sum\\frac{1}{(2n+1)^3}=\\frac{7}{4}\\zeta(3)\\approx2.10$ — larger than the correct $\\frac{\\pi^3}{16}\\approx1.94$.",
    "check": "Integrating the original numerically also gives $\\frac{\\pi^3}{16}\\approx1.938$."
  },
  "dm-int-010": {
    "spot": "There is an $x$ in the numerator, the interval is $[0,\\pi]$, and the denominator only involves $\\sin x$: under $x\\mapsto\\pi-x$, $\\sin x$ is unchanged, so adding the original to the substituted version turns $x$ into the constant $\\pi$.",
    "why": "Integrating $\\frac{x}{1+\\sin x}$ by parts directly gets messy; the reflection $x\\mapsto\\pi-x$ turns the $x$ in the numerator into $\\pi$, and the remaining $\\int\\frac{dx}{1+\\sin x}$ falls out with a half-angle substitution.",
    "steps": [
      "Substitute $x\\mapsto\\pi-x$: $I=\\int_0^\\pi\\frac{\\pi-x}{1+\\sin x}dx$.",
      "Add the two: $2I=\\pi\\int_0^\\pi\\frac{dx}{1+\\sin x}$.",
      "Half-angle substitution $t=\\tan\\frac{x}{2}$: $1+\\sin x=\\frac{(1+t)^2}{1+t^2}$, $dx=\\frac{2dt}{1+t^2}$, and the integral becomes $\\int_0^\\infty\\frac{2dt}{(1+t)^2}=2$.",
      "$I=\\frac{\\pi\\cdot2}{2}=\\pi$."
    ],
    "trap": "Getting $2I=2\\pi$ after adding but forgetting to divide by $2$, answering $2\\pi$. The reflection $x\\mapsto\\pi-x$ is what makes twice $I$ simple.",
    "check": "On $[0,\\pi]$ the integrand lies between $\\frac{x}{2}$ and $x$, so $I$ lies between $\\frac{\\pi^2}{4}\\approx2.47$ and $\\frac{\\pi^2}{2}\\approx4.93$, and $\\pi$ is in that range."
  },
  "dm-int-012": {
    "spot": "$x^{-x}=e^{-x\\ln x}$: expand the exponential as a series, and every term is $\\int_0^1x^k(\\ln x)^kdx$; substituting $x=e^{-u}$ makes these $\\Gamma$-type integrals, which produce $\\frac{1}{(k+1)^{k+1}}$.",
    "why": "$x^{-x}$ has no elementary antiderivative; after expanding as $\\sum\\frac{(-x\\ln x)^k}{k!}$ and integrating term by term, the $k!$ is cancelled exactly by the $\\Gamma$ function, leaving $n^{-n}$.",
    "steps": [
      "Rewrite: $x^{-x}=e^{-x\\ln x}=\\sum_{k\\ge0}\\frac{(-1)^k(x\\ln x)^k}{k!}$.",
      "Substitute $x=e^{-u/(k+1)}$: $\\int_0^1x^k(\\ln x)^kdx=\\frac{(-1)^kk!}{(k+1)^{k+1}}$ (e.g. with $k=2$, $k=3$).",
      "So the $k$-th term integrates to $=\\frac{1}{(k+1)^{k+1}}$; with $n=k+1$: $\\int_0^1x^{-x}dx=\\sum_{n\\ge1}n^{-n}$.",
      "The two are equal, so the ratio is $1$."
    ],
    "trap": "Losing the sign of $(\\ln x)^k$ when integrating term by term and thinking the series alternates, $\\sum(-1)^{n+1}n^{-n}$ (that is the answer for $\\int_0^1x^xdx$).",
    "check": "Both sides are numerically $1.29129\\ldots$: $1+\\frac{1}{4}+\\frac{1}{27}+\\frac{1}{256}+\\cdots$."
  },
  "dm-ser-003": {
    "spot": "The problem hands you $\\arctan\\frac{1}{2n^2}=\\arctan(2n+1)-\\arctan(2n-1)$: the $\\arctan(2n-1)$ in neighboring terms cancel — a telescoping series.",
    "why": "A telescoping sum leaves only the first and last pieces, so the partial sum has the closed form $\\arctan(2N+1)-\\arctan1$; take the limit, no need to estimate each term.",
    "steps": [
      "Verify the identity (subtraction formula: $\\frac{(2n+1)-(2n-1)}{1+(4n^2-1)}=\\frac{1}{2n^2}$).",
      "Partial sum: $S_N=\\arctan(2N+1)-\\arctan 1$; for example, at $N=3$ it is $=\\arctan7-\\frac{\\pi}{4}$.",
      "As $N\\to\\infty$: $\\arctan(2N+1)\\to\\frac{\\pi}{2}$.",
      "Sum $=\\frac{\\pi}{2}-\\frac{\\pi}{4}=\\frac{\\pi}{4}$."
    ],
    "trap": "Remembering only $\\arctan(2N+1)\\to\\frac{\\pi}{2}$ and answering $\\frac{\\pi}{2}$, forgetting to subtract the leftover $\\arctan 1=\\frac{\\pi}{4}$ from the first term.",
    "check": "The first three terms $\\arctan\\frac12+\\arctan\\frac18+\\arctan\\frac1{18}\\approx0.644$ are already approaching $\\frac{\\pi}{4}\\approx0.785$ but still below it."
  },
  "dm-ser-004": {
    "spot": "$4n^2-1=(2n-1)(2n+1)$: partial fractions give $\\frac{1}{2n-1}-\\frac{2}{2n}+\\frac{1}{2n+1}$, with denominators alternating odd, even, odd — like the alternating harmonic series.",
    "why": "Each of the three fractions diverges on its own, so you can't sum them separately; pair them into partial sums of the alternating harmonic series and use $\\ln2=1-\\frac12+\\frac13-\\cdots$ for the limit.",
    "steps": [
      "Partial fractions: $\\frac{1}{n(4n^2-1)}=\\frac{1}{2n-1}-\\frac{2}{2n}+\\frac{1}{2n+1}$.",
      "Pair into two groups: $\\sum\\left(\\frac{1}{2n-1}-\\frac{1}{2n}\\right)=1-\\frac12+\\frac13-\\cdots=\\ln2$.",
      "The other group: $\\sum\\left(\\frac{1}{2n+1}-\\frac{1}{2n}\\right)=-\\frac12+\\frac13-\\frac14+\\cdots=\\ln2-1$.",
      "Add: $\\ln2+(\\ln2-1)=2\\ln2-1$."
    ],
    "trap": "Splitting into three separate series and summing each; $\\sum\\frac{1}{2n-1}$ and the others diverge, you hit \"$\\infty-\\infty$\" and get stuck. Pair them inside the partial sums first.",
    "check": "The first term $\\frac{1}{3}$ and second term $\\frac{1}{30}$ add to about $0.367$, close to but slightly below $2\\ln2-1\\approx0.386$."
  },
  "dx-eng-003": {
    "spot": "The curve has the form $y=f(x)$ and the question is about the single point $x=1$: radius of curvature $R=\\frac{(1+y'^2)^{3/2}}{|y''|}$, so you only need the two numbers $y'(1)$ and $y''(1)$.",
    "why": "For an explicit function use $\\kappa=\\frac{|y''|}{(1+y'^2)^{3/2}}$ directly — no parametrization needed; the radius is its reciprocal.",
    "steps": [
      "$y'=3x^2-2$, $y''=6x$; at $x=1$: $y'=1$, $y''=6$.",
      "Curvature $\\kappa=\\frac{6}{(1+1^2)^{3/2}}=\\frac{6}{2\\sqrt2}=\\frac{3\\sqrt2}{2}$.",
      "Radius of curvature $R=\\frac{1}{\\kappa}=\\frac{2\\sqrt2}{6}=\\frac{\\sqrt2}{3}\\approx0.471$."
    ],
    "trap": "Dropping the $\\frac{3}{2}$ power and writing $R=\\frac{1+y'^2}{|y''|}=\\frac{1}{3}$; or handing in the curvature $\\frac{3\\sqrt2}{2}$ as the radius.",
    "check": "Curvature times radius of curvature must equal $1$."
  },
  "fd-serb-608": {
    "spot": "Numerator $(-1)^{n+1}$, denominator $n\\cdot3^n$: this is $\\ln(1+x)=\\sum\\frac{(-1)^{n+1}x^n}{n}$ at $x=\\frac{1}{3}$.",
    "why": "Recognizing the Maclaurin series of $\\ln(1+x)$ and plugging in is exact, better than estimating partial sums, and convergence is automatic ($|x|<1$).",
    "steps": [
      "$\\ln(1+x)=\\sum_{n\\ge1}\\frac{(-1)^{n+1}x^n}{n}$, $|x|<1$ (check once with $x=\\frac{1}{2}$).",
      "Here the general term is $=\\frac{(-1)^{n+1}(1/3)^n}{n}$, matching $x=\\frac{1}{3}$.",
      "Plug in: $\\ln\\left(1+\\frac{1}{3}\\right)=\\ln\\frac{4}{3}$."
    ],
    "trap": "Using $-\\ln(1-x)=\\sum\\frac{x^n}{n}$ and ignoring the alternating sign, answering $\\ln\\frac{3}{2}\\approx0.405$.",
    "check": "The sum of an alternating series lies between consecutive partial sums: $\\frac13-\\frac1{18}<\\ln\\frac43<\\frac13-\\frac1{18}+\\frac1{81}$."
  },
  "gap-der-app-002": {
    "spot": "Given $r$ and $\\frac{dr}{dt}$, asked for $\\frac{dA}{dt}$: differentiate the area $A=\\pi r^2$ with respect to time — related rates.",
    "why": "Differentiate the relation $A=\\pi r^2$ first to get $\\frac{dA}{dt}=2\\pi r\\frac{dr}{dt}$, then plug in numbers; plugging in $r=5$ first freezes a changing quantity into a constant.",
    "steps": [
      "$A=\\pi r^2$; differentiating in $r$ gives $2\\pi r$.",
      "Chain Rule: $\\frac{dA}{dt}=2\\pi r\\cdot\\frac{dr}{dt}$.",
      "Plug in $r=5$, $\\frac{dr}{dt}=0.2$: $10\\pi\\cdot0.2=2\\pi$."
    ],
    "trap": "Plugging in $r=5$ first to get $A=25\\pi$, then differentiating to get $0$; or forgetting to multiply by $\\frac{dr}{dt}$ and answering $10\\pi$.",
    "check": "One second later the radius is about $5.2$, and the area has grown by $\\pi(5.2^2-5^2)=2.04\\pi$, very close to $2\\pi$."
  },
  "gap-der-param-004": {
    "spot": "$x$ and $y$ are both functions of $t$, and you want $\\frac{dy}{dx}$ at $t=2$: parametric differentiation, $\\frac{dy/dt}{dx/dt}$.",
    "why": "With parametric equations you don't need to eliminate $t$; dividing the two $t$-derivatives gives the slope, then plug in $t=2$.",
    "steps": [
      "$\\frac{dy}{dt}=3t^2$, $\\frac{dx}{dt}=2t$.",
      "Divide: $\\frac{dy}{dx}=\\frac{3t^2}{2t}=\\frac{3t}{2}$.",
      "Plug in $t=2$: $\\frac{3\\cdot2}{2}=3$."
    ],
    "trap": "Flipping numerator and denominator to $\\frac{dx/dt}{dy/dt}=\\frac{2t}{3t^2}$, which gives $\\frac{1}{3}$ at $t=2$.",
    "check": "For $t>0$, eliminate $t$: $y=(x-1)^{3/2}$; $t=2$ corresponds to $x=5$, and $\\frac{3}{2}\\sqrt{4}=3$."
  },
  "gap-tech-007": {
    "spot": "$x=t^2$, $y=t^3$ — both $x$ and $y$ are given by a third variable $t$: these are parametric equations.",
    "why": "Parametric differentiation uses $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$, with no need to eliminate $t$ and solve for $y$ in terms of $x$ (which would also mean dealing with the sign of $t$).",
    "steps": [
      "Differentiate in $t$: $\\frac{dy}{dt}=3t^2$.",
      "$\\frac{dx}{dt}=2t$.",
      "Divide: $\\frac{dy}{dx}=\\frac{3t^2}{2t}=\\frac{3t}{2}$.",
      "So the technique to use is parametric differentiation."
    ],
    "trap": "Eliminating $t$ to write $y=x^{3/2}$ and then differentiating: this only holds for $t>0$; the $t<0$ branch becomes $y=-x^{3/2}$, which is easy to miss.",
    "check": "For $t>0$, $y=x^{3/2}$ and $\\frac{dy}{dx}=\\frac32\\sqrt x=\\frac{3t}{2}$, matching parametric differentiation (e.g. at $x=4$, $t=2$)."
  },
  "gp-014": {
    "spot": "Trapezoidal rule with $n=2$ on $[0,1]$: $h=\\frac{1}{2}$, sample $f(0)$, $f\\left(\\frac{1}{2}\\right)$, $f(1)$, with weight $2$ on the middle point.",
    "why": "Just plug into the trapezoidal formula $T=\\frac{h}{2}[f_0+2f_1+f_2]$; and since $y=x^2$ is concave up, you know in advance it will overestimate.",
    "steps": [
      "$h=\\frac{1-0}{2}=\\frac{1}{2}$; samples: $f(0)=0$, $f\\left(\\frac12\\right)=\\frac14$, $f(1)=1$.",
      "$T=\\frac{h}{2}\\left[f(0)+2f\\left(\\frac12\\right)+f(1)\\right]=\\frac14\\left(0+\\frac12+1\\right)$.",
      "$T=\\frac{3}{8}$."
    ],
    "trap": "Forgetting to multiply the middle point by $2$, getting $\\frac14\\left(0+\\frac14+1\\right)=\\frac{5}{16}$; or using $h$ instead of $\\frac{h}{2}$ in front, getting $\\frac{3}{4}$.",
    "check": "The true value is $\\int_0^1x^2dx=\\frac13$; $y=x^2$ is concave up, so the trapezoids lie above the curve, and $\\frac38>\\frac13$ is the right direction."
  },
  "gx-039": {
    "spot": "The cycloid is given in terms of a parameter $t$ and you want the tangent slope at $t=\\frac{2\\pi}{3}$: $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}=\\frac{\\sin t}{1-\\cos t}$.",
    "why": "Dividing the parametric derivatives is fastest; $\\frac{\\sin t}{1-\\cos t}$ simplifies to $\\cot\\frac{t}{2}$ by the half-angle formulas, which makes plugging in cleaner.",
    "steps": [
      "$\\frac{dy}{dt}=\\sin t$, $\\frac{dx}{dt}=1-\\cos t$.",
      "$\\frac{dy}{dx}=\\frac{\\sin t}{1-\\cos t}=\\cot\\frac{t}{2}$.",
      "Plug in $t=\\frac{2\\pi}{3}$: $\\cot\\frac{\\pi}{3}=\\frac{1}{\\sqrt3}$."
    ],
    "trap": "Writing $\\frac{dx/dt}{dy/dt}$ and getting $\\sqrt3$; or computing $1-\\cos\\frac{2\\pi}{3}$ as $\\frac12$ (since $\\cos\\frac{2\\pi}{3}=-\\frac12$, it is $\\frac32$).",
    "check": "$t=\\frac{2\\pi}{3}$ is left of the top of the arch at $t=\\pi$, so the curve is still rising: the slope should be positive and less than $1$ — it is."
  },
  "ig-num-005": {
    "spot": "Simpson's rule with $n=2$ on $[0,1]$: $h=\\frac12$, weights $1,4,1$; the integrand $x^3$ is a cubic, and Simpson's rule is exact for it.",
    "why": "Apply $S=\\frac{h}{3}[f_0+4f_1+f_2]$ directly; and since Simpson's rule has no error for polynomials of degree three or less, the answer must equal the true value $\\frac14$ — a built-in check.",
    "steps": [
      "$h=\\frac12$; $f(0)=0$, $f\\left(\\frac12\\right)=\\frac18$, $f(1)=1$.",
      "$S=\\frac{h}{3}\\left[0+4\\cdot\\frac18+1\\right]=\\frac16\\cdot\\frac32$.",
      "$S=\\frac14$."
    ],
    "trap": "Using the coefficient $\\frac{h}{2}$ (from the trapezoidal rule) or forgetting to multiply the middle point by $4$: the first gives $\\frac38$, the second $\\frac{3}{16}$.",
    "check": "The true value is $\\int_0^1x^3dx=\\frac14$; Simpson's rule is exact for cubics."
  },
  "ig-num-006": {
    "spot": "Simpson's rule with $n=4$ on $[0,2]$: $h=\\frac12$, five points $0,\\frac12,1,\\frac32,2$, weights $1,4,2,4,1$; $x^3$ is a cubic, so the result equals the true value.",
    "why": "Just plug in with weights $1,4,2,4,1$; Simpson's rule has no error on cubics, so you can compare directly with the true value $4$.",
    "steps": [
      "Function values: $0$, $\\frac18$, $1$, $\\frac{27}{8}$, $8$.",
      "Weighted sum: $0+4\\cdot\\frac18+2\\cdot1+4\\cdot\\frac{27}{8}+8=24$.",
      "$S=\\frac{h}{3}\\cdot24=\\frac{1}{6}\\cdot24=4$."
    ],
    "trap": "Using weights $1,2,4,2,1$ (odd and even positions swapped): the weighted sum becomes $0+\\frac14+4+\\frac{27}{4}+8=19$, giving $\\frac{19}{6}$.",
    "check": "The true value is $\\int_0^2x^3dx=\\frac{2^4}{4}=4$ — consistent."
  },
  "lb-con-002": {
    "spot": "$f_3(x)=9xe^{-3x}$ is \"$x$ times an exponential\": integrate by parts so the $x$ gets differentiated away.",
    "why": "Polynomial times exponential calls for integration by parts; with $u=x$ one differentiation kills it. No series or substitution needed.",
    "steps": [
      "Set $n=3$: $f_3(x)=9xe^{-3x}$.",
      "Integration by parts gives the antiderivative $-3xe^{-3x}-e^{-3x}$.",
      "Evaluate: $(-3e^{-3}-e^{-3})-(0-1)=1-4e^{-3}\\approx0.8009$."
    ],
    "trap": "Dropping the $-e^{0}$ term at the lower limit (thinking the whole antiderivative is $0$ at $x=0$), which gives $-4e^{-3}$ — even the sign is wrong.",
    "check": "The general formula $\\int_0^1f_n=1-(n+1)e^{-n}$ gives exactly $1-4e^{-3}$ at $n=3$, and it is less than $1$."
  },
  "lec-01-q2c": {
    "spot": "There is a floor function $\\lfloor\\frac1x\\rfloor$ and you are given $t-1<\\lfloor t\\rfloor\\le t$: substitute $t=\\frac1x$ into the inequality, multiply by $x$, and use the Squeeze Theorem.",
    "why": "You can't take a limit straight through the floor function; the Squeeze Theorem only needs bounds, and the bounds $1-x$ and $1$ both tend to $1$. Careful: multiplying by $x<0$ flips the inequality.",
    "steps": [
      "$t=\\frac1x$: $\\frac1x-1<\\left\\lfloor\\frac1x\\right\\rfloor\\le\\frac1x$; for $x>0$ multiply by $x$: $1-x<x\\left\\lfloor\\frac1x\\right\\rfloor\\le1$ (e.g. at $x=0.3$, $0.3\\cdot3=0.9$).",
      "For $x<0$, multiplying by $x$ flips the inequalities: $1\\le x\\left\\lfloor\\frac1x\\right\\rfloor<1-x$ (e.g. at $x=-0.3$, $\\lfloor-3.33\\rfloor=-4$ and the product is $1.2$).",
      "The bounds on both sides tend to $1$: $\\lim_{x\\to0}(1-x)=1$.",
      "Squeeze Theorem: both one-sided limits are $1$, so the limit is $1$."
    ],
    "trap": "Seeing $x\\to0$ times something and declaring the limit $0$; but $\\left\\lfloor\\frac1x\\right\\rfloor$ is unbounded and grows as fast as $x$ shrinks, so the product actually tends to $1$.",
    "check": "Take $x=0.01$: $\\lfloor100\\rfloor=100$, product exactly $1$; take $x=0.03$: $\\lfloor33.3\\rfloor=33$, product $0.99$."
  },
  "lec-02-q3d": {
    "spot": "Differentiating $f(x)=x^2\\sin\\frac1x$ produces $-\\cos\\frac1x$: with no factor of $x$ in front to damp it, it keeps oscillating between $\\pm1$ near $0$.",
    "why": "To decide $\\lim f'(x)$, compute $f'(x)$ first and look at each term; find two sequences of points tending to $0$ along which $f'$ tends to different values, and the limit doesn't exist.",
    "steps": [
      "For $x\\ne0$: $f'(x)=2x\\sin\\frac1x-\\cos\\frac1x$.",
      "The first term is bounded by $2|x|$, so it tends to $0$.",
      "Second term: at $x=\\frac{1}{2k\\pi}$, $f'\\approx-1$; at $x=\\frac{1}{(2k+1)\\pi}$, $f'\\approx+1$.",
      "Both sequences tend to $0$ but $f'$ tends to different values, so $\\lim_{x\\to0}f'(x)$ does not exist (even though $f'(0)=\\lim\\frac{f(h)}{h}=\\lim h\\sin\\frac1h=0$ exists)."
    ],
    "trap": "Since $f'(0)=0$ exists, assuming $\\lim_{x\\to0}f'(x)$ is $0$ too. A derivative existing at a point doesn't mean the derivative function is continuous there.",
    "check": "$f$ is differentiable at $0$: the difference quotient $h\\sin\\frac1h$ is squeezed by $|h|$ to $0$; but $f'$ itself doesn't converge near $0$."
  },
  "lec-02-q4d": {
    "spot": "\"Speed increasing\" is not \"acceleration positive\": speed $|v|$ increases when $v$ and $a$ have the same sign, so make a sign chart of $v=3(t-1)(t-3)$ and $a=6t-12$ together.",
    "why": "Looking only at $a>0$ wrongly includes $2<t<3$ (where $v<0$ and the speed is decreasing); the same-sign test is what matches $\\frac{d}{dt}v^2=2va>0$.",
    "steps": [
      "$v=s'=3t^2-12t+9=3(t-1)(t-3)$, $a=s''=6t-12$.",
      "$1<t<2$: $v<0$, $a<0$, same sign — speeding up.",
      "$2<t<3$: $v<0$, $a>0$, opposite signs — slowing down; $0<t<1$: $v>0$, $a<0$, also slowing down.",
      "$t>3$: $v>0$, $a>0$ — speeding up. So the speeding-up intervals are $(1,2)\\cup(3,\\infty)$."
    ],
    "trap": "Thinking \"$a>0$ means speeding up\" and answering $(2,\\infty)$: for $2<t<3$, $a>0$ but $v<0$ — the particle is moving backward and slowing down.",
    "check": "Look directly at the derivative of speed squared, $\\frac{d}{dt}v^2=2va$: positive at $t=1.5$, negative at $t=2.5$."
  },
  "lec-03-q1c": {
    "spot": "Horizontal tangents on an implicit curve: the numerator $F_x=2x+y$ of $y'=-\\frac{F_x}{F_y}$ must be $0$, giving $y=-2x$; substitute back into the curve.",
    "why": "A horizontal tangent only needs the numerator to vanish — no need to solve for all of $y'$. Substitute back into the original equation to get $x$, then confirm the denominator $F_y\\ne0$.",
    "steps": [
      "$F=x^2+xy+y^2$: $F_x=2x+y$, $F_y=x+2y$, $y'=-\\frac{2x+y}{x+2y}$.",
      "Horizontal tangent: $2x+y=0$, i.e. $y=-2x$; substituting: $x^2-2x^2+4x^2=3x^2$.",
      "$3x^2=7$, $x=\\pm\\sqrt{\\frac73}$.",
      "The denominator $x+2y=-3x\\ne0$, so both points work; the answer set is $\\left\\{\\sqrt{\\frac73},-\\sqrt{\\frac73}\\right\\}$."
    ],
    "trap": "Setting the denominator $x+2y=0$ (that's for vertical tangents), getting $y=-\\frac{x}{2}$, $x=\\pm\\sqrt{\\frac{28}{3}}$, and mistaking the vertical-tangent points for horizontal ones.",
    "check": "At $x=\\sqrt{\\frac73}$, $y=-2\\sqrt{\\frac73}$, $F_x=2x+y=0$, so the slope is indeed $0$."
  },
  "lec-05-q1e": {
    "spot": "$\\frac1x-\\frac1{\\sin x}$ is an $\\infty-\\infty$ form: combine into $\\frac{\\sin x-x}{x\\sin x}$; the numerator is third-order small, the denominator second-order small.",
    "why": "After combining, the Taylor expansion $\\sin x=x-\\frac{x^3}{6}+\\cdots$ shows at a glance that the numerator is $\\approx-\\frac{x^3}{6}$ and the denominator $\\approx x^2$; applying L'Hôpital's Rule twice also works, but it's slower.",
    "steps": [
      "Combine: $\\frac1x-\\frac1{\\sin x}=\\frac{\\sin x-x}{x\\sin x}$.",
      "Numerator: $\\sin x-x\\approx-\\frac{x^3}{6}$.",
      "So the whole expression is $\\approx\\frac{-x^3/6}{x^2}=-\\frac{x}{6}$.",
      "$-\\frac{x}{6}\\to0$, so the limit is $0$."
    ],
    "trap": "Assuming $\\infty-\\infty$ is just $0$, or doesn't exist, without computing. Here the answer happens to be $0$, but the similar $\\frac1{x^2}-\\frac1{\\sin^2x}$ gives $-\\frac13$ — you can't guess.",
    "check": "Take $x=0.001$: $\\frac1x-\\frac1{\\sin x}\\approx-0.000167$, which is exactly $-\\frac{x}{6}$."
  },
  "lec-06-q2d": {
    "spot": "The numerator is an integral with variable upper limit $\\int_0^x\\sin(t^2)dt$ and the denominator is $x^3$, both tending to $0$: a $\\frac00$ form. Use L'Hôpital's Rule, differentiating the numerator with the Fundamental Theorem of Calculus.",
    "why": "The integral has no elementary form, but L'Hôpital's Rule only needs its derivative $\\sin(x^2)$; then $\\sin u\\approx u$ finishes it.",
    "steps": [
      "Fundamental Theorem of Calculus: $\\frac{d}{dx}\\int_0^x\\sin(t^2)dt=\\sin(x^2)$.",
      "L'Hôpital's Rule: limit $=\\lim\\frac{\\sin(x^2)}{3x^2}$.",
      "$\\frac{\\sin(x^2)}{x^2}\\to1$, so the limit is $\\frac13$."
    ],
    "trap": "Writing the numerator's derivative as $\\sin(t^2)$, or multiplying by an extra $2x$ (treating it as $\\int_0^{x^2}$), getting a wrong number like $\\frac23$.",
    "check": "$\\sin(t^2)\\approx t^2$, so the integral is $\\approx\\frac{x^3}{3}$; at $x=0.1$ the ratio is already very close to $\\frac13$."
  },
  "lec-07-q4b": {
    "spot": "The integrand contains $\\sqrt{x^2+9}=\\sqrt{x^2+3^2}$: trigonometric substitution $x=3\\tan\\theta$ turns the root into $3\\sec\\theta$.",
    "why": "With $\\sqrt{x^2+a^2}$ and $x^2$ in the denominator, the tangent substitution reduces it to $\\frac{\\cos\\theta}{\\sin^2\\theta}$, which $u=\\sin\\theta$ integrates in one step.",
    "steps": [
      "$x=3\\tan\\theta$, $dx=3\\sec^2\\theta\\,d\\theta$, $\\sqrt{x^2+9}=3\\sec\\theta$: the integrand is $=\\frac{3\\sec^2\\theta}{9\\tan^2\\theta\\cdot3\\sec\\theta}=\\frac{1}{9}\\frac{\\cos\\theta}{\\sin^2\\theta}$.",
      "Integrate: $\\frac19\\int\\frac{\\cos\\theta}{\\sin^2\\theta}d\\theta=-\\frac{1}{9\\sin\\theta}+C$.",
      "Back to $x$: in the right triangle the opposite side is $x$, the adjacent side $3$, the hypotenuse $\\sqrt{x^2+9}$, so $\\sin\\theta=\\frac{x}{\\sqrt{x^2+9}}$.",
      "Answer: $-\\frac{\\sqrt{x^2+9}}{9x}+C$."
    ],
    "trap": "Writing $\\sin\\theta$ as $\\frac{x}{3}$ when converting back to $x$ (that's $\\tan\\theta$) and getting $-\\frac{1}{3x}$; read the hypotenuse $\\sqrt{x^2+9}$ off the triangle.",
    "check": "Differentiate the answer: at $x=4$ it should equal the original integrand $\\frac{1}{16\\cdot5}=\\frac{1}{80}$."
  },
  "lec-08-m2": {
    "spot": "$\\frac{1}{\\sqrt x}$ is unbounded at $x=0$: an improper integral, so replace the lower limit by $t$ and let $t\\to0^+$; the exponent $\\frac12<1$, so it converges.",
    "why": "An integral that is unbounded at an endpoint is only defined as a limit; the antiderivative $2\\sqrt x$ is continuous at $0$, so the limit can be evaluated directly.",
    "steps": [
      "Antiderivative: $\\int x^{-1/2}dx=2\\sqrt x$.",
      "$\\int_t^1\\frac{dx}{\\sqrt x}=2-2\\sqrt t$.",
      "$t\\to0^+$: $2-2\\sqrt t\\to2$."
    ],
    "trap": "Declaring divergence just because the integrand is unbounded at $0$; $\\int_0^1x^{-p}dx$ converges for $p<1$.",
    "check": "$\\int_0^1x^{-p}dx=\\frac{1}{1-p}$; $p=\\frac12$ gives $2$."
  },
  "lec-08-m3": {
    "spot": "$\\frac{1}{x^2}$ is unbounded at $x=0$, which is inside the interval $[-1,1]$: you must split at $0$ into two improper integrals, and if either diverges, the whole thing diverges.",
    "why": "Plugging the endpoints into the antiderivative $-\\frac1x$ is wrong (there is an unbounded point in between, so the Fundamental Theorem of Calculus doesn't apply); after splitting, $\\int_0^1\\frac{dx}{x^2}$ is the divergent case $p=2\\ge1$.",
    "steps": [
      "Split: $\\int_{-1}^1=\\int_{-1}^0+\\int_0^1$; and $\\int_t^1\\frac{dx}{x^2}=\\frac1t-1$.",
      "As $t\\to0^+$, $\\frac1t-1\\to\\infty$ ($t=0.001$ already gives $999$).",
      "Plugging in directly, $\\left[-\\frac1x\\right]_{-1}^1=-2$, is wrong: a positive integrand can't integrate to a negative number.",
      "The right half diverges, so the whole integral diverges — no value exists."
    ],
    "trap": "Not noticing that $x=0$ is in the interval and computing $\\left[-\\frac1x\\right]_{-1}^{1}$ to get $-2$.",
    "check": "By symmetry the left half $\\int_{-1}^{-t}\\frac{dx}{x^2}$ is also $\\frac1t-1$ and blows up too."
  },
  "lec-08-m5": {
    "spot": "All four are $\\int_1^\\infty$: look at how fast the integrand decays as $x\\to\\infty$ — like $\\frac{1}{x^2}$ or faster converges, and only $\\frac{1}{\\sqrt{x+1}}\\sim x^{-1/2}$ decays too slowly.",
    "why": "Convergence on an infinite interval depends only on the order of the tail; compare with $p$-integrals using the Comparison Test — no need to actually compute each one.",
    "steps": [
      "The antiderivative $2\\sqrt{x+1}$ of $\\frac{1}{\\sqrt{x+1}}$ is unbounded: up to $9999$ it is already $200-2\\sqrt2$ and keeps growing — divergent.",
      "$\\frac{1}{x^2+1}\\le\\frac{1}{x^2}$, convergent, value $\\frac{\\pi}{4}$.",
      "$\\frac{\\sin^2x}{x^2}\\le\\frac{1}{x^2}$, convergent, with value less than $\\int_1^\\infty\\frac{dx}{x^2}=1$.",
      "For $x\\ge1$, $e^{-x^2}\\le e^{-x}$, convergent.",
      "So the divergent one is $\\int_1^\\infty\\frac{dx}{\\sqrt{x+1}}$."
    ],
    "trap": "Thinking the oscillating $\\sin^2x$ makes it diverge; it is bounded by $\\frac{1}{x^2}$ and converges absolutely.",
    "check": "For $x\\ge1$, $\\frac{1}{\\sqrt{x+1}}\\ge\\frac{1}{\\sqrt{2x}}$; compared with the $p=\\frac12$ integral, it indeed diverges (e.g. at $x=4$)."
  },
  "lec-08-q2a": {
    "spot": "$\\ln x$ times $x^{-2}$, integrated to infinity: integrate by parts so $\\ln x$ is differentiated into $\\frac1x$, then check the upper limit $\\frac{\\ln t}{t}\\to0$.",
    "why": "$\\ln x$ has no nice antiderivative but becomes simple when differentiated; integration by parts with $u=\\ln x$, $dv=x^{-2}dx$ gives the antiderivative in one go.",
    "steps": [
      "Integration by parts: antiderivative $-\\frac{\\ln x}{x}-\\frac1x$.",
      "Lower limit $x=1$: $-0-1=-1$.",
      "Upper limit $t\\to\\infty$: $\\frac{\\ln t}{t}\\to0$, $\\frac1t\\to0$ (at $t=10^6$ already below $0.00002$).",
      "Integral $=0-(-1)=1$ (substituting $x=e^u$ gives $\\int_0^\\infty ue^{-u}du$, also $1$)."
    ],
    "trap": "Choosing the parts backwards: with $u=x^{-2}$, $dv=\\ln x\\,dx$, you get an integral of $x\\ln x-x$ times $x^{-3}$, which only gets messier.",
    "check": "The integrand peaks near $x=e^{1/2}$ and its tail looks like $\\frac{\\ln x}{x^2}$; integrating up to a finite $1000$ already gives close to $1$."
  },
  "lec-08-q2c": {
    "spot": "The antiderivative of $\\frac{1}{1+x^2}$ is $\\arctan x$, with limits $\\pm\\frac{\\pi}{2}$ at the two ends; both ends are infinite, so split into two halves that must each converge.",
    "why": "Recognizing the derivative of $\\arctan$ is fastest; the range is the whole real line, so the formal definition splits it into $\\int_{-\\infty}^0+\\int_0^\\infty$, and you can add only if both halves converge.",
    "steps": [
      "$\\frac{d}{dx}\\arctan x=\\frac{1}{1+x^2}$.",
      "$\\int_0^\\infty\\frac{dx}{1+x^2}=\\lim_{t\\to\\infty}\\arctan t=\\frac{\\pi}{2}$.",
      "$\\int_{-\\infty}^0\\frac{dx}{1+x^2}=0-\\lim_{t\\to-\\infty}\\arctan t=\\frac{\\pi}{2}$.",
      "Add: $\\frac{\\pi}{2}+\\frac{\\pi}{2}=\\pi$."
    ],
    "trap": "Concluding from $\\lim_{t\\to\\infty}\\int_{-t}^t$ alone; for $\\int_{-\\infty}^\\infty x\\,dx$ that would give $0$, but that integral actually diverges — so each half must converge on its own.",
    "check": "Split another way: $[-1,1]$ contributes $\\frac{\\pi}{2}$ and each tail $\\frac{\\pi}{4}$, which also totals $\\pi$."
  },
  "lec-08-q2d": {
    "spot": "$(x-1)^{-2/3}$ is unbounded at $x=1$, and $1$ is inside $[0,3]$: split into the two improper integrals $\\int_0^1+\\int_1^3$; the exponent $\\frac23<1$, so both converge.",
    "why": "The antiderivative $3(x-1)^{1/3}$ is continuous at $x=1$, so both limits can be plugged in directly; but you still need to split and confirm each piece converges — you can't just plug in $0$ and $3$ in one shot.",
    "steps": [
      "Left piece ($x<1$): write it as $(1-x)^{-2/3}$, antiderivative $-3(1-x)^{1/3}$: $\\int_0^t=3-3(1-t)^{1/3}$ (e.g. $t=0.9$).",
      "$t\\to1^-$: left piece $=3$.",
      "Right piece: $\\int_t^3(x-1)^{-2/3}dx=3\\sqrt[3]{2}-3(t-1)^{1/3}$ (e.g. $t=1.1$); as $t\\to1^+$ it gives $3\\sqrt[3]{2}$.",
      "Both pieces converge; the total is $3+3\\sqrt[3]{2}\\approx6.78$."
    ],
    "trap": "Treating $(-1)^{1/3}$ as \"undefined\" over the reals and thinking the left piece can't be computed; or declaring divergence because the integrand is unbounded — the exponent $\\frac23<1$ converges.",
    "check": "The pieces are $3$ and $3\\sqrt[3]{2}\\approx3.78$: the right piece, over an interval of length $2$, is bigger than the left one over length $1$ — makes sense."
  },
  "lec-08-q3a": {
    "spot": "The numerator $2+\\cos x$ oscillates between $1$ and $3$ and never gets near $0$: the integrand is at least $\\frac1x$, and $\\int_1^\\infty\\frac{dx}{x}$ diverges.",
    "why": "An oscillating numerator with a positive lower bound lets you bound from below with the Comparison Test; comparing with the $p=1$ harmonic-type integral settles divergence in one step.",
    "steps": [
      "$-1\\le\\cos x\\le1$, so $2+\\cos x\\ge1$.",
      "For $x\\ge1$, $\\frac{2+\\cos x}{x}\\ge\\frac1x>0$ (compared up to $10000$).",
      "$\\int_1^b\\frac{dx}{x}=\\ln b\\to\\infty$.",
      "Comparison Test: the smaller integral already diverges, so the original diverges."
    ],
    "trap": "Thinking the oscillation of $\\cos x$ makes positives and negatives cancel, as in the conditionally convergent $\\int\\frac{\\cos x}{x}dx$; here the numerator is always positive — nothing cancels.",
    "check": "On average $2+\\cos x$ is about $2$, so the integral grows roughly like $2\\ln b$, without bound."
  },
  "lec-08-q3b": {
    "spot": "The leading term of the denominator $x^3+x+1$ is $x^3$: the integrand is smaller than $\\frac{1}{x^3}$, and $\\int_1^\\infty\\frac{dx}{x^3}$ is the convergent case $p=3>1$.",
    "why": "The question is only about convergence, so don't actually integrate (the partial fractions are ugly); one upper bound by $\\frac{1}{x^3}$ settles it.",
    "steps": [
      "For $x>0$, $x^3+x+1>x^3$, so $0<\\frac{1}{x^3+x+1}<\\frac{1}{x^3}$.",
      "$\\int_1^\\infty\\frac{dx}{x^3}=\\frac12$, convergent.",
      "Comparison Test: the original converges (and is less than $\\frac12$)."
    ],
    "trap": "Using a backwards inequality like $\\frac{1}{x^3+x+1}>\\frac{1}{x^3}$, or comparing with $\\frac1x$ ($\\frac{1}{x^3+x+1}<\\frac1x$ is true but $\\int\\frac{dx}{x}$ diverges, so it proves nothing).",
    "check": "The actual value is a bit over $0.2$ — indeed a finite positive number."
  },
  "lec-08-q3c": {
    "spot": "The $\\sqrt x$ in the denominator makes the integrand unbounded at $x=0$, but the numerator $e^x$ is bounded by $e$ on $[0,1]$: compare with $\\frac{e}{\\sqrt x}$, exponent $\\frac12<1$.",
    "why": "$\\frac{e^x}{\\sqrt x}$ has no elementary antiderivative; since only convergence is asked, the Comparison Test replaces the bounded $e^x$ with the constant $e$, leaving a standard $p$-integral.",
    "steps": [
      "For $0<x\\le1$, $e^x\\le e$, so $\\frac{e^x}{\\sqrt x}\\le\\frac{e}{\\sqrt x}$ (e.g. $x=0.5$).",
      "$\\int_0^1\\frac{e}{\\sqrt x}dx=e\\cdot2=2e$, convergent.",
      "Comparison Test: the original converges, with value between $2$ and $2e$."
    ],
    "trap": "Declaring divergence because the integrand is unbounded at $0$; the improper integral of $x^{-1/2}$ near $0$ converges ($p<1$).",
    "check": "The lower bound works too: $e^x\\ge1$, so the integral is $\\ge\\int_0^1\\frac{dx}{\\sqrt x}=2$; the finite value is about $2.93$."
  },
  "lec-08-q3d": {
    "spot": "The integrand contains $\\frac1x$ and $\\ln x$: $\\frac{dx}{x}$ is exactly $d(\\ln x)$, so $u=\\ln x$ turns it into the $p$-integral $\\int\\frac{du}{u^p}$.",
    "why": "After substitution it is exactly $\\int_{\\ln2}^\\infty u^{-p}du$, so the convergence condition $p>1$ applies directly; the lower limit $\\ln 2>0$ introduces no new singularity.",
    "steps": [
      "$u=\\ln x$, $du=\\frac{dx}{x}$.",
      "The integral becomes $\\int_{\\ln2}^{\\infty}\\frac{du}{u^p}$ (with $p=2$ integrated up to $10$, both sides agree).",
      "$p=2>1$ converges: $\\int_{\\ln2}^\\infty\\frac{du}{u^2}=\\frac{1}{\\ln2}$.",
      "$p=1$ diverges: $\\int_2^b\\frac{dx}{x\\ln x}=\\ln\\ln b-\\ln\\ln2$ is unbounded; $p<1$ is even larger and diverges too. So the convergent $p$ are $(1,\\infty)$."
    ],
    "trap": "Seeing $x$ in the denominator and assuming it must diverge like $\\frac1x$, or answering $p\\ge1$; at $p=1$ you get $\\ln\\ln x$, which grows extremely slowly but still diverges.",
    "check": "How slow is the divergence at $p=1$? Up to $10000$ it is only about $2.6$, but it has no upper bound."
  },
  "lec-09-q2d": {
    "spot": "The axis of rotation is $y=1$, and the vertex $(1,1)$ of the parabola $y=2x-x^2$ just touches it: the region lies below the axis, and slices perpendicular to the $x$-axis are washers with outer radius $1$ and inner radius $1-(2x-x^2)=(1-x)^2$.",
    "why": "Rotating about a horizontal axis with the region described in $x$, the washer method is most direct; radii are always distances to $y=1$, not the height of the curve.",
    "steps": [
      "The region spans $0\\le x\\le2$, and its highest point $y(1)=1$ lies right on the axis.",
      "Outer radius (to the $x$-axis) $=1$; inner radius (to the curve) $=1-(2x-x^2)=(1-x)^2$.",
      "$V=\\pi\\int_0^2\\left[1-(1-x)^4\\right]dx$, where $\\int_0^2(1-x)^4dx=\\frac25$.",
      "$V=\\pi\\left(2-\\frac25\\right)=\\frac{8\\pi}{5}$."
    ],
    "trap": "Using radius $2x-x^2$ out of habit from rotating about the $x$-axis, getting $\\pi\\int_0^2(2x-x^2)^2dx=\\frac{16\\pi}{15}$; or swapping inner and outer radii and getting a negative volume.",
    "check": "Pappus's theorem: area $\\frac43$, centroid height $\\frac25$, distance to the axis $\\frac35$, volume $2\\pi\\cdot\\frac35\\cdot\\frac43=\\frac{8\\pi}{5}$."
  },
  "lec-10-q1b": {
    "spot": "Second derivative for parametric equations: first get $\\frac{dy}{dx}=\\frac{\\sin t}{1-\\cos t}$, then differentiate it in $t$ and divide by $\\frac{dx}{dt}$ — you divide again the second time.",
    "why": "$\\frac{d^2y}{dx^2}=\\frac{\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)}{dx/dt}$; using $\\frac{d^2y/dt^2}{d^2x/dt^2}$ is the wrong formula.",
    "steps": [
      "$\\frac{dx}{dt}=1-\\cos t$, $\\frac{dy}{dt}=\\sin t$, $\\frac{dy}{dx}=\\frac{\\sin t}{1-\\cos t}$.",
      "Differentiate in $t$: $\\frac{\\cos t(1-\\cos t)-\\sin^2t}{(1-\\cos t)^2}=\\frac{\\cos t-1}{(1-\\cos t)^2}=-\\frac{1}{1-\\cos t}$.",
      "Divide again by $\\frac{dx}{dt}=1-\\cos t$: $\\frac{d^2y}{dx^2}=-\\frac{1}{(1-\\cos t)^2}$."
    ],
    "trap": "Stopping at $\\frac{d}{dt}\\left(\\frac{dy}{dx}\\right)=-\\frac{1}{1-\\cos t}$ and forgetting to divide by $\\frac{dx}{dt}$; or using $\\frac{y''(t)}{x''(t)}=\\frac{\\cos t}{\\sin t}$.",
    "check": "At the top of the arch, $t=\\pi$: $1-\\cos\\pi=2$, so $\\frac{d^2y}{dx^2}=-\\frac14<0$ — concave down, consistent with the cycloid's arch."
  },
  "lec-10-q2c": {
    "spot": "A region bounded by two polar curves: first solve $3\\cos\\theta=1+\\cos\\theta$ for the intersections $\\theta=\\pm\\frac{\\pi}{3}$, then the area is $\\frac12\\int(r_{\\text{outer}}^2-r_{\\text{inner}}^2)d\\theta$.",
    "why": "Polar area adds up sectors, so between two curves it is outer squared minus inner squared; the region is symmetric top to bottom, so compute half and multiply by $2$.",
    "steps": [
      "Intersections: $3\\cos\\theta=1+\\cos\\theta$, $\\cos\\theta=\\frac12$, $\\theta=\\pm\\frac{\\pi}{3}$.",
      "Area $A=\\frac12\\int_{-\\pi/3}^{\\pi/3}\\left[9\\cos^2\\theta-(1+\\cos\\theta)^2\\right]d\\theta=\\int_0^{\\pi/3}(8\\cos^2\\theta-2\\cos\\theta-1)d\\theta$.",
      "Antiderivative: $3\\theta+2\\sin2\\theta-2\\sin\\theta$.",
      "At $\\frac{\\pi}{3}$: $\\pi+\\sqrt3-\\sqrt3=\\pi$."
    ],
    "trap": "Writing $\\frac12\\int(r_{\\text{outer}}-r_{\\text{inner}})^2d\\theta$ — subtracting before squaring; or forgetting the $\\frac12$ in front and answering $2\\pi$.",
    "check": "The area $\\pi\\approx3.14$ is less than the area $\\frac{9\\pi}{4}\\approx7.07$ of the circle $r=3\\cos\\theta$ — reasonable."
  },
  "lec-10-q4c": {
    "spot": "A quarter disk is symmetric about the line $y=x$, so $\\bar x=\\bar y$; $\\bar x=\\frac{1}{A}\\int_0^r x\\sqrt{r^2-x^2}\\,dx$, and the integral yields to the substitution $u=r^2-x^2$.",
    "why": "The centroid formula $\\bar x=\\frac{\\int x\\,dA}{A}$ with vertical strips $dA=\\sqrt{r^2-x^2}dx$ is most direct; the $x$ in $x\\sqrt{r^2-x^2}$ is exactly the $du$ the $u$-substitution needs.",
    "steps": [
      "Area $A=\\frac{\\pi r^2}{4}$.",
      "Moment: $\\int_0^rx\\sqrt{r^2-x^2}dx=\\left[-\\frac13(r^2-x^2)^{3/2}\\right]_0^r=\\frac{r^3}{3}$.",
      "$\\bar x=\\frac{r^3/3}{\\pi r^2/4}=\\frac{4r}{3\\pi}$."
    ],
    "trap": "Forgetting to divide by the area and answering $\\frac{r^3}{3}$; or using the full disk's area $\\pi r^2$ and getting $\\frac{r}{3\\pi}$.",
    "check": "$\\frac{4}{3\\pi}\\approx0.42$: the centroid sits a little left of $\\frac{r}{2}$, because the disk is taller — heavier — on the side near the $y$-axis."
  },
  "lec-13-q2e": {
    "spot": "Numerator $\\left(1+\\frac1n\\right)^{n^2}$, denominator $3^n$ — the whole term is built from $n$-th powers: taking the $n$-th root lowers $n^2$ to $n$, leaving the limit that defines $e$.",
    "why": "The Ratio Test would have to handle $\\frac{(1+\\frac{1}{n+1})^{(n+1)^2}}{(1+\\frac1n)^{n^2}}$, which is messy; the Root Test strips the powers in one step.",
    "steps": [
      "Take the $n$-th root: $\\sqrt[n]{a_n}=\\frac{\\left(1+\\frac1n\\right)^n}{3}$.",
      "$\\left(1+\\frac1n\\right)^n\\to e$, so $\\sqrt[n]{a_n}\\to\\frac{e}{3}$.",
      "$\\frac{e}{3}\\approx0.906<1$; by the Root Test, it converges."
    ],
    "trap": "Treating $\\left(1+\\frac1n\\right)^{n^2}$ as tending to $e$ and thinking $a_n\\approx\\frac{e}{3^n}$; it is actually of order $e^n$, so you must take the root before comparing with $3$.",
    "check": "$\\frac{e}{3}$ is only slightly less than $1$, so it converges but the terms take a long time to get small; at $n=20$ the general term is still about $0.07$."
  },
  "lec-13-q4a": {
    "spot": "Alternating $p$-series $\\sum\\frac{(-1)^n}{n^p}$: conditionally convergent means it converges but the absolute series $\\sum\\frac{1}{n^p}$ diverges, so you need both the Alternating Series Test and the $p$-series test.",
    "why": "The absolute series is a $p$-series, divergent for $p\\le1$; the Alternating Series Test needs $\\frac{1}{n^p}$ decreasing to $0$, which requires $p>0$. The answer is where both conditions hold.",
    "steps": [
      "$p>1$: $\\sum\\frac{1}{n^p}$ converges (e.g. $p=2$) — absolute convergence, not conditional.",
      "$0<p\\le1$: $\\frac{1}{n^p}$ decreases to $0$, so the Alternating Series Test gives convergence (e.g. $p=\\frac12$).",
      "But the absolute series diverges: e.g. for $p=\\frac12$, $\\int_1^{10000}\\frac{dx}{\\sqrt x}=198$ and keeps growing.",
      "$p\\le0$: $|a_n|=n^{-p}\\ge1$, the general term doesn't go to $0$ — divergent. So the conditionally convergent $p$ are $(0,1]$."
    ],
    "trap": "Excluding $p=1$ and answering $(0,1)$: $p=1$ is the alternating harmonic series, which converges to $-\\ln2$ while the harmonic series diverges — the textbook example of conditional convergence.",
    "check": "At $p=1$ the alternating harmonic series $\\sum\\frac{(-1)^n}{n}=-\\ln 2$ indeed converges."
  },
  "lec-14-q1d": {
    "spot": "General term $\\frac{(2x-1)^n}{\\sqrt n}$: let $t=2x-1$; it converges for $|t|<1$. At the endpoints $t=\\pm1$ the denominator $\\sqrt n$ is $p=\\frac12$, so one endpoint converges (alternating) and the other diverges.",
    "why": "The Ratio Test gives the open interval, and the endpoints must always be checked; a denominator like $\\sqrt n$ with $p\\le1$ is exactly what makes the two endpoints differ.",
    "steps": [
      "Ratio: $|2x-1|\\sqrt{\\frac{n}{n+1}}\\to|2x-1|$; convergence needs $|2x-1|<1$.",
      "$|2x-1|<1$ means $0<x<1$: at $x=0$, $t=-1$; at $x=1$, $t=1$.",
      "$x=1$: $\\sum\\frac{1}{\\sqrt n}$, $p=\\frac12$, diverges ($\\int_1^{10000}\\frac{dx}{\\sqrt x}=198$ has no upper bound).",
      "$x=0$: $\\sum\\frac{(-1)^n}{\\sqrt n}$; $\\frac{1}{\\sqrt n}$ decreases to $0$, so it converges by the Alternating Series Test. The interval of convergence is $[0,1)$."
    ],
    "trap": "Writing the radius of convergence as $1$ (forgetting the coefficient $2$ in $2x$) and getting a wrong interval around $(-1,1)$; or calling both endpoints convergent and writing $[0,1]$.",
    "check": "Center $\\frac12$ (where $2x-1=0$), radius $\\frac12$ — the midpoint and half-length of $[0,1)$ both match."
  },
  "lec-14-q3b": {
    "spot": "$\\sum n^2x^n$ at $x=\\frac12$: start from $\\sum x^n=\\frac{1}{1-x}$; each \"differentiate then multiply by $x$\" multiplies the coefficients by another $n$, so doing it twice gives $n^2$.",
    "why": "$n^2$ blocks a direct geometric series; the operator $x\\frac{d}{dx}$ turns $x^n$ into exactly $nx^n$, so two applications match, then plug in $x=\\frac12$.",
    "steps": [
      "First time: $x\\frac{d}{dx}\\frac{1}{1-x}=\\frac{x}{(1-x)^2}=\\sum nx^n$.",
      "Second time: $x\\frac{d}{dx}\\frac{x}{(1-x)^2}=\\frac{x(1+x)}{(1-x)^3}=\\sum n^2x^n$.",
      "Plug in $x=\\frac12$: $\\frac{\\frac12\\cdot\\frac32}{\\frac18}=6$."
    ],
    "trap": "Applying $x\\frac{d}{dx}$ only once and getting $\\sum\\frac{n}{2^n}=2$; or forgetting to multiply by $x$ after differentiating, so the coefficient gains an $n$ but the power drops to $x^{n-1}$, and the value is off by a factor of $2$.",
    "check": "The first five terms $\\frac12+1+\\frac98+1+\\frac{25}{32}\\approx4.41$, and the remaining terms are still sizable, so a total of $6$ is reasonable."
  },
  "lec-14-q3d": {
    "spot": "Denominator $2n+1$ with alternating sign $(-1)^n$: this is $\\arctan x=\\sum\\frac{(-1)^nx^{2n+1}}{2n+1}$; $3^n=(\\sqrt3)^{2n}$ corresponds to $x=\\frac{1}{\\sqrt3}$.",
    "why": "Recognize the $\\arctan$ series and rewrite $3^n$ in the form $x^{2n}$; plugging in gives $\\arctan\\frac{1}{\\sqrt3}=\\frac{\\pi}{6}$, off only by a factor of $\\sqrt3$.",
    "steps": [
      "The derivative of $\\arctan x$ is $\\frac{1}{1+x^2}=\\sum(-1)^nx^{2n}$; integrating term by term gives $\\arctan x=\\sum\\frac{(-1)^nx^{2n+1}}{2n+1}$.",
      "$x=\\frac{1}{\\sqrt3}$: $x^{2n+1}=\\frac{1}{3^n\\sqrt3}$.",
      "So $\\frac{1}{\\sqrt3}\\sum\\frac{(-1)^n}{(2n+1)3^n}=\\arctan\\frac{1}{\\sqrt3}=\\frac{\\pi}{6}$.",
      "Multiply by $\\sqrt3$: $\\frac{\\sqrt3\\pi}{6}=\\frac{\\pi}{2\\sqrt3}$."
    ],
    "trap": "Plugging in $x=\\frac13$ and getting a wrong value like $\\arctan\\frac13$; $3^n$ corresponds to $x^{2n}$, so $x=\\frac{1}{\\sqrt3}$, not $\\frac13$.",
    "check": "The first two terms give $1-\\frac19\\approx0.889$ and the first three $\\approx0.911$, bracketing $\\frac{\\pi}{2\\sqrt3}\\approx0.907$."
  },
  "lec-14-q4d": {
    "spot": "$\\frac{n^2}{n!}$: $n^2=n(n-1)+n$, and each piece cancels with $n!$ to give $\\frac{1}{(n-2)!}$ and $\\frac{1}{(n-1)!}$ — both shifted $e$ series.",
    "why": "Series with factorial denominators almost always reduce back to $e^x=\\sum\\frac{x^n}{n!}$; splitting $n^2$ into the falling factorial $n(n-1)$ plus $n$ makes the cancellation cleanest.",
    "steps": [
      "Split: $n^2=n(n-1)+n$.",
      "Cancel: $\\frac{n(n-1)}{n!}=\\frac{1}{(n-2)!}$, $\\frac{n}{n!}=\\frac{1}{(n-1)!}$ (e.g. $n=5$).",
      "In generating-function terms: $\\sum\\frac{n(n-1)x^n}{n!}=x^2e^x$ and $\\sum\\frac{nx^n}{n!}=xe^x$, i.e. $x\\frac{d}{dx}\\left(xe^x\\right)=(x^2+x)e^x$.",
      "Plug in $x=1$: $e+e=2e$."
    ],
    "trap": "Writing $\\frac{n^2}{n!}=\\frac{n}{(n-1)!}$ and then treating it as $\\sum\\frac{1}{(n-2)!}=e$, missing the $+1$ in $n=(n-1)+1$ and answering $e$.",
    "check": "The first seven terms $1+2+\\frac32+\\frac23+\\frac{5}{24}+\\frac{1}{20}+\\frac{49}{5040}\\approx5.435$ match $2e\\approx5.437$."
  },
  "lec-15-q1c": {
    "spot": "Error bound for a second-degree Taylor polynomial: Taylor's inequality $|R_2|\\le\\frac{M}{3!}|x-a|^3$, so compute $f'''$ and take its maximum on $[4,4.1]$.",
    "why": "$f'''(x)=\\frac38x^{-5/2}$ is decreasing on the interval, so its maximum is at the left end $x=4$; plug that into the formula for the bound.",
    "steps": [
      "$f'=\\frac12x^{-1/2}$, $f''=-\\frac14x^{-3/2}$, $f'''=\\frac38x^{-5/2}$.",
      "$f'''$ is decreasing, so $M=f'''(4)=\\frac38\\cdot\\frac{1}{32}=\\frac{3}{256}$.",
      "$|R_2|\\le\\frac{3/256}{6}(0.1)^3=\\frac{1}{512000}\\approx1.95\\times10^{-6}$."
    ],
    "trap": "Using $\\frac{M}{2!}$ (the error of a degree-two polynomial is a third-order term, so the denominator is $3!$), or taking $M=f'''(4.1)$ (the minimum, not the maximum) — then the bound isn't guaranteed.",
    "check": "The actual error $\\sqrt{4.1}-\\left(2+\\frac{0.1}{4}-\\frac{0.01}{64}\\right)\\approx1.92\\times10^{-6}$ is positive and within the bound."
  },
  "lec-15-q2d": {
    "spot": "$\\frac1{x^2}-\\frac1{\\sin^2x}$ is an $\\infty-\\infty$ form: combine into $\\frac{\\sin^2x-x^2}{x^2\\sin^2x}$; the denominator is of order $x^4$, so expand the numerator to $x^4$.",
    "why": "L'Hôpital's Rule would take four rounds — very tedious; the Taylor expansion $\\sin^2x=x^2-\\frac{x^4}{3}+\\cdots$ shows the numerator's leading term in one line.",
    "steps": [
      "Combine: $\\frac{\\sin^2x-x^2}{x^2\\sin^2x}$.",
      "$\\sin^2x=x^2-\\frac{x^4}{3}+O(x^6)$, so the numerator is $\\approx-\\frac{x^4}{3}$.",
      "Denominator: $x^2\\sin^2x\\approx x^4$.",
      "Limit $=-\\frac13$."
    ],
    "trap": "Using $\\sin x\\approx x$ to first order only, so the numerator becomes $0$ and you answer $0$; the denominator is fourth-order small, so the numerator must be expanded to fourth order too.",
    "check": "$|\\sin x|<|x|$, so $\\frac1{\\sin^2x}>\\frac1{x^2}$ and the difference is negative; at $x=0.01$ it is already about $-0.3333$."
  },
  "lec-15-q3b": {
    "spot": "Integrating the series of $e^{-x^2}$ term by term gives the alternating series $\\sum\\frac{(-1)^n}{n!(2n+1)}$ with decreasing terms: the error is at most the first omitted term, so stop at the first term below $0.001$.",
    "why": "The alternating series estimate needs no maximum of a remainder — just the next term; much simpler than a Taylor remainder bound.",
    "steps": [
      "$e^{-x^2}=\\sum\\frac{(-1)^nx^{2n}}{n!}$, and $\\int_0^1x^{2n}dx=\\frac{1}{2n+1}$.",
      "The $n=4$ term: $\\frac{1}{4!\\cdot9}=\\frac{1}{216}\\approx0.0046$, still bigger than $0.001$ — keep it.",
      "The $n=5$ term: $\\frac{1}{5!\\cdot11}=\\frac{1}{1320}\\approx0.00076<0.001$ — cut off here.",
      "Take $n=0$ through $4$: $1-\\frac13+\\frac1{10}-\\frac1{42}+\\frac1{216}=\\frac{5651}{7560}\\approx0.7475$."
    ],
    "trap": "Deciding $\\frac{1}{216}$ is already small and stopping at four terms, getting $1-\\frac13+\\frac1{10}-\\frac1{42}\\approx0.743$ with an error of about $0.0046$ — over the requirement.",
    "check": "The actual value $\\int_0^1e^{-x^2}dx\\approx0.7468$ differs from the estimate by less than $\\frac{1}{1320}$."
  }
};
