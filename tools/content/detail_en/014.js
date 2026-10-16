// Detail v2, English — batch 014. Translation of tools/content/detail/014.js (text only; claims live in the Chinese file).
module.exports = {
  "mob-gamma-008": {
    "spot": "The argument of $\\Gamma$ is the positive integer $4$: $\\Gamma(n)=(n-1)!$, so it reduces straight to a factorial.",
    "why": "Unwinding the recursion $\\Gamma(s+1)=s\\,\\Gamma(s)$ three times lands on $\\Gamma(1)=1$ — no need to actually compute $\\int_0^\\infty x^3e^{-x}\\,dx$.",
    "steps": [
      "Definition: $\\Gamma(4)=\\int_0^\\infty x^{3}e^{-x}\\,dx$; the base case is $\\Gamma(1)=\\int_0^\\infty e^{-x}\\,dx=1$.",
      "Integration by parts gives the recursion $\\Gamma(s+1)=s\\,\\Gamma(s)$, e.g. $\\Gamma(2)=1\\cdot\\Gamma(1)=1$.",
      "Unwind: $\\Gamma(4)=3\\,\\Gamma(3)=3\\cdot 2\\,\\Gamma(2)=3\\cdot 2\\cdot 1=6$."
    ],
    "trap": "Remembering $\\Gamma(n)$ as $n!$ and getting $\\Gamma(4)=24$. It's shifted by one: $\\Gamma(n)=(n-1)!$.",
    "check": "$\\Gamma(3)=2!=2$, and times $3$ gives exactly $6$ — the recursion agrees."
  },
  "ode-sep-007": {
    "spot": "The right side $1+y^2$ depends only on $y$ — separable; and $\\frac{dy}{1+y^2}$ is clearly the differential of $\\arctan y$.",
    "why": "After separating, integrate each side once and you're done; the initial value $y(0)=0$ makes the constant exactly $0$.",
    "steps": [
      "Separate: $\\frac{dy}{1+y^2}=dx$. The antiderivative of the left side is $\\arctan y$.",
      "Integrate both sides: $\\arctan y=x+C$; plugging in $y(0)=0$ gives $C=\\arctan 0=0$.",
      "So $y=\\tan x$; check: $y'=\\sec^2x=1+\\tan^2x=1+y^2$.",
      "The solution is $y(x)=\\tan x$ (for $|x|<\\frac{\\pi}{2}$)."
    ],
    "trap": "Integrating to $\\ln(1+y^2)$ — that's the antiderivative of $\\frac{2y}{1+y^2}$; with no $y$ in the numerator it's arctangent.",
    "check": "For small $x$, $y'\\approx 1$, so the solution should look like $y\\approx x$; $\\tan 0.01\\approx 0.0100003$."
  },
  "ode-sep-008": {
    "spot": "$y'=-2xy^2$ is \"a function of $x$ times a function of $y$\" — separable, and $\\frac{dy}{y^2}$ integrates to $-\\frac{1}{y}$.",
    "why": "After separating, both sides are power integrals: one step gives an implicit solution, then solve for $y$; no integrating factor needed.",
    "steps": [
      "Separate: $\\frac{dy}{y^2}=-2x\\,dx$; the left antiderivative is $-\\frac{1}{y}$, the right is $-x^2$.",
      "$-\\frac{1}{y}=-x^2+C$, i.e. $\\frac{1}{y}=x^2-C$; plug in $y(0)=1$: $1=-C$, $C=-1$.",
      "So $\\frac{1}{y}=x^2+1$, $y=\\frac{1}{1+x^2}$. Check: $y'=\\frac{-2x}{(1+x^2)^2}=-2x\\,y^2$.",
      "The solution is $y(x)=\\frac{1}{1+x^2}$."
    ],
    "trap": "Writing $\\int\\frac{dy}{y^2}$ as $\\ln y^2$ or $\\frac{1}{y}$ (dropping the minus sign) ends at $y=\\frac{1}{1-x^2}$ — plug it back in and the sign of $y'$ is wrong.",
    "check": "$y'=-2xy^2$ is negative for $x>0$, so the solution should fall from $1$ and stay positive: $y(1)=\\frac{1}{2}$."
  },
  "rel-hard-der-006": {
    "spot": "Parametric $x=t^2$, $y=t^3$ and you need the second derivative: $\\frac{d^2y}{dx^2}$ is \"differentiate $\\frac{dy}{dx}$ with respect to $t$, then divide by $\\frac{dx}{dt}$\" — not $\\frac{y''(t)}{x''(t)}$.",
    "why": "Here you could eliminate $t$ ($y=x^{3/2}$), but the parametric formula works for any parametric curve, so practice it the right way.",
    "steps": [
      "$\\frac{dx}{dt}=2t$, $\\frac{dy}{dt}=3t^2$, so $\\frac{dy}{dx}=\\frac{3t^2}{2t}=\\frac{3t}{2}$.",
      "Differentiate once more with respect to $x$: $\\frac{d^2y}{dx^2}=\\frac{\\frac{d}{dt}\\left(\\frac{3t}{2}\\right)}{\\frac{dx}{dt}}=\\frac{3/2}{2t}=\\frac{3}{4t}$.",
      "Plug in $t=2$: $\\frac{3}{8}$."
    ],
    "trap": "Writing the second derivative as $\\frac{y''(t)}{x''(t)}=\\frac{6t}{2}=3t$ and getting $6$. The denominator must be the first-order $\\frac{dx}{dt}$.",
    "check": "Eliminate the parameter: $y=x^{3/2}$, $y''=\\frac{3}{4}x^{-1/2}$; at $t=2$, $x=4$, which also gives $\\frac{3}{8}$."
  },
  "rel-hard-mv-010": {
    "spot": "The region is the standard tetrahedron (simplex) $x+y+z\\le 1$ and the integrand is the monomial $x^2yz$ — monomials over a simplex have a ready-made formula $\\frac{a!\\,b!\\,c!}{(a+b+c+3)!}$.",
    "why": "Integrating layer by layer works too, but every layer means expanding $(1-x-y)^k$; the simplex formula (Dirichlet integral) gives the answer in one line.",
    "steps": [
      "Formula: $\\iiint_{\\text{simplex}}x^ay^bz^c\\,dV=\\frac{a!\\,b!\\,c!}{(a+b+c+3)!}$. Test it on the simplest case $x$ first: $\\frac{1!}{4!}=\\frac{1}{24}$.",
      "Here $a=2$, $b=1$, $c=1$: numerator $2!\\cdot1!\\cdot1!=2$, denominator $(2+1+1+3)!=7!=5040$.",
      "So the integral $=\\frac{2}{5040}=\\frac{1}{2520}$."
    ],
    "trap": "Using $(a+b+c)!$ or $(a+b+c+2)!$ in the denominator, missing the $+3$ that comes from three dimensions; testing the simple $x$ case catches it.",
    "check": "Rough estimate: the simplex has volume $\\frac{1}{6}$ and $x^2yz$ there is on the order of less than $\\frac{1}{64}$, so an answer $\\approx 0.0004$ is reasonably tiny."
  },
  "rel-hard-ser-005": {
    "spot": "The denominator is a product of four consecutive integers — telescoping: $\\frac{1}{n(n+1)(n+2)(n+3)}=\\frac{1}{3}\\left[\\frac{1}{n(n+1)(n+2)}-\\frac{1}{(n+1)(n+2)(n+3)}\\right]$.",
    "why": "Full partial fractions gives four terms with messy coefficients; splitting into \"products that differ by one factor at the ends\" makes neighboring terms cancel directly.",
    "steps": [
      "Let $g(n)=\\frac{1}{n(n+1)(n+2)}$; then $g(n)-g(n+1)=\\frac{(n+3)-n}{n(n+1)(n+2)(n+3)}=\\frac{3}{n(n+1)(n+2)(n+3)}$.",
      "So the general term $=\\frac{1}{3}[g(n)-g(n+1)]$, and the partial sum telescopes down to $\\frac{1}{3}[g(1)-g(N+1)]$.",
      "$g(N+1)\\to 0$ and $g(1)=\\frac{1}{6}$, so the sum $=\\frac{1}{3}\\cdot\\frac{1}{6}=\\frac{1}{18}$."
    ],
    "trap": "Splitting into a two-term difference like $\\frac{1}{n}-\\frac{1}{n+3}$ — the coefficients won't work; or forgetting the leading $\\frac{1}{3}$ and answering $\\frac{1}{6}$.",
    "check": "The first term alone is $\\frac{1}{24}\\approx 0.0417$ and later terms shrink fast, so the total $\\frac{1}{18}\\approx 0.0556$ is only a bit larger than the first term."
  },
  "ser-039": {
    "spot": "The general term is $\\frac{(2x)^n}{n}$: treat $2x$ as one unit and it's $\\sum\\frac{u^n}{n}$, which converges for $|u|<1$.",
    "why": "The Ratio Test finishes it in one line; the $n$ in the denominator doesn't affect the radius, only the endpoints.",
    "steps": [
      "Ratio: $\\left|\\frac{a_{n+1}}{a_n}\\right|=\\frac{n}{n+1}\\,|2x|\\to|2x|$.",
      "Convergence needs $|2x|<1$, i.e. $|x|<\\frac{1}{2}$.",
      "So the radius of convergence is $R=\\frac{1}{2}$."
    ],
    "trap": "Looking only at the coefficient $\\frac{1}{n}$ and saying $R=1$, forgetting the $2^n$ inside $(2x)^n$; the radius gets divided by that $2$.",
    "check": "At $x=\\frac{1}{4}$ (inside the radius) the series is $\\sum\\frac{(1/2)^n}{n}=\\ln 2$, which converges."
  },
  "tb-arc-003": {
    "spot": "$y'=2x\\sqrt{x^2+1}$; square it and add one to get $4x^4+4x^2+1=(2x^2+1)^2$ — a perfect square planted by the textbook, so the root disappears entirely.",
    "why": "The arc length formula $\\int\\sqrt{1+(y')^2}\\,dx$ is usually hard to integrate; once you see the perfect square, only a polynomial integral is left.",
    "steps": [
      "$y'=\\frac{2}{3}\\cdot\\frac{3}{2}(x^2+1)^{1/2}\\cdot 2x=2x\\sqrt{x^2+1}$.",
      "$1+(y')^2=1+4x^2(x^2+1)=4x^4+4x^2+1=(2x^2+1)^2$.",
      "So $L=\\int_0^1(2x^2+1)\\,dx=\\frac{2}{3}+1=\\frac{5}{3}$."
    ],
    "trap": "Integrating $\\int\\sqrt{1+y'}$ directly (forgetting the square), or missing the perfect square and forcing a trig substitution — long and error-prone.",
    "check": "Arc length is at least the straight-line distance between the endpoints: $y(0)=\\frac{2}{3}$, $y(1)=\\frac{2}{3}2^{3/2}$, a distance of about $1.56$, less than $\\frac{5}{3}$."
  },
  "tb-lin-004": {
    "spot": "$16.32$ is very close to $16=2^4$, and $\\sqrt[4]{16}=2$ is easy — use the linear approximation $f(a)+f'(a)\\Delta x$ at $a=16$.",
    "why": "The tangent-line approximation needs only one derivative and its error is of order $\\Delta x^2$ — plenty for two decimal places.",
    "steps": [
      "$f(x)=x^{1/4}$, $f(16)=2$.",
      "$f'(x)=\\frac{1}{4}x^{-3/4}$, $f'(16)=\\frac{1}{4}\\cdot\\frac{1}{8}=\\frac{1}{32}$.",
      "$\\Delta x=0.32$: $\\sqrt[4]{16.32}\\approx 2+\\frac{0.32}{32}=2.01$."
    ],
    "trap": "Computing $f'(16)$ as $\\frac{1}{4}\\cdot 16^{-1/4}=\\frac{1}{8}$ (forgetting to subtract one from the exponent), which gives $2.04$.",
    "check": "$x^{1/4}$ is concave, so the tangent line lies above the curve and the true value is just slightly below $2.01$: $16.32^{1/4}\\approx 2.00988$."
  },
  "uni-der-019": {
    "spot": "Each derivative of $\\sin(2x)$ adds a factor of $2$, and the function cycles $\\sin\\to\\cos\\to-\\sin\\to-\\cos$ with period four — the fifth derivative has the shape of the first, times $2^5$.",
    "why": "The period-four cycle tells you the position at a glance, no need to differentiate five times; reading the $x^5$ coefficient of the Taylor series works too.",
    "steps": [
      "$\\frac{d}{dx}\\sin(2x)=2\\cos(2x)$, $\\frac{d^2}{dx^2}\\sin(2x)=-4\\sin(2x)$.",
      "The fourth derivative returns to $2^4\\sin(2x)$, so the fifth is $2^5\\cos(2x)=32\\cos(2x)$.",
      "Plug in $x=0$: $32\\cos 0=32$."
    ],
    "trap": "Miscounting the cycle (thinking the fifth derivative is $-\\cos$) and getting $-32$; or forgetting the Chain Rule factor $2^5$ and answering $1$.",
    "check": "Taylor: the $x^5$ coefficient of $\\sin(2x)$ is $\\frac{2^5}{5!}$; multiply back by $5!$ and you get $32$."
  },
  "uni-int-015": {
    "spot": "A polynomial $x$ times $\\ln(1+x)$ — differentiate the log, integrate the polynomial: the textbook LIATE setup for integration by parts.",
    "why": "Once $\\ln$ is differentiated into a rational function, the leftover $\\frac{x^2}{1+x}$ integrates after long division.",
    "steps": [
      "$u=\\ln(1+x)$, $dv=x\\,dx$: $\\int_0^1 x\\ln(1+x)\\,dx=\\left[\\frac{x^2}{2}\\ln(1+x)\\right]_0^1-\\frac{1}{2}\\int_0^1\\frac{x^2}{1+x}\\,dx$.",
      "Long division: $\\frac{x^2}{1+x}=x-1+\\frac{1}{1+x}$, so the integral $=\\frac{1}{2}-1+\\ln 2=\\ln 2-\\frac{1}{2}$.",
      "Combine: $\\frac{\\ln 2}{2}-\\frac{1}{2}\\left(\\ln 2-\\frac{1}{2}\\right)=\\frac{1}{4}$."
    ],
    "trap": "Choosing it the other way, $u=x$ and $dv=\\ln(1+x)\\,dx$, means integrating $\\ln(1+x)$ first — a detour where terms easily get lost.",
    "check": "On $[0,1]$ the integrand is at most $x\\cdot x$ (since $\\ln(1+x)\\le x$), so the integral is less than $\\frac{1}{3}$; $\\frac{1}{4}$ is reasonable."
  },
  "burst-boss-anti-001": {
    "spot": "$x^4$ times $e^x$: the polynomial differentiates down to $0$ and the exponential never changes when integrated — tabular method (repeated integration by parts); the coefficients are the derivatives of $x^4$ with alternating signs.",
    "why": "It takes four rounds of integration by parts; the tabular method lays them out in one row so you see the alternating signs all at once.",
    "steps": [
      "Table: $x^4$ differentiates to $4x^3,\\ 12x^2,\\ 24x,\\ 24$; $e^x$ integrates to $e^x$ every time.",
      "Multiply along the diagonals with alternating signs: $\\int x^4e^x\\,dx=e^x(x^4-4x^3+12x^2-24x+24)+C$.",
      "So the antiderivative is $e^x(x^4-4x^3+12x^2-24x+24)+C$."
    ],
    "trap": "Using all plus signs, $e^x(x^4+4x^3+\\cdots)$; differentiate it back and lots of extra terms appear. The signs must alternate $+,-,+,-,+$.",
    "check": "Plug in $x=0$: the bracket is $24=4!$, which matches $\\int_{-\\infty}^0x^4e^x\\,dx=4!$."
  },
  "burst-boss-anti-006": {
    "spot": "$(\\ln x)^4$ alone, with only the invisible $1\\,dx$ beside it — set $u=(\\ln x)^4$, $dv=dx$; each round of integration by parts lowers the power of $\\ln$ by one.",
    "why": "The recursion $I_n=x(\\ln x)^n-nI_{n-1}$ bottoms out after four rounds; substituting $x=e^t$ also works, but turns into $\\int t^4e^t\\,dt$ — the tabular method again.",
    "steps": [
      "By parts: $\\int(\\ln x)^n\\,dx=x(\\ln x)^n-n\\int(\\ln x)^{n-1}\\,dx$ (because $x\\cdot\\frac{n(\\ln x)^{n-1}}{x}$ cancels the $x$).",
      "Recurse all the way: $I_4=x(\\ln x)^4-4I_3$, $I_3=x(\\ln x)^3-3I_2$, $I_2=x(\\ln x)^2-2I_1$, $I_1=x\\ln x-x$.",
      "Substitute back: coefficients $1,\\,-4,\\,4\\cdot3,\\,-4\\cdot3\\cdot2,\\,4\\cdot3\\cdot2\\cdot1$, i.e. $x\\left[(\\ln x)^4-4(\\ln x)^3+12(\\ln x)^2-24\\ln x+24\\right]+C$.",
      "That's the answer."
    ],
    "trap": "Forgetting to carry the accumulated coefficient during the recursion, writing something like $-3(\\ln x)^2$; the coefficients should build up as $4,\\ 4\\cdot3,\\ 4\\cdot3\\cdot2$.",
    "check": "At $x=1$ (where $\\ln x=0$) the answer is $24$, and at $x=e$ it's $e(1-4+12-24+24)=9e$; the difference should equal $\\int_1^e(\\ln x)^4\\,dx$."
  },
  "burst-boss-int-015": {
    "spot": "Limits $0$ to $\\frac{\\pi}{2}$ with $\\ln(\\tan x)$ inside — substituting $u=\\ln(\\tan x)$ stretches the interval over the whole real line, giving $\\int_{-\\infty}^{\\infty}\\frac{u^2}{2\\cosh u}\\,du$.",
    "why": "There's nothing to do with $\\tan$ directly; once it's a $\\cosh$ integral, expand $\\frac{1}{\\cosh u}=2\\sum(-1)^ke^{-(2k+1)u}$ and integrate term by term to get the familiar alternating series $\\sum\\frac{(-1)^k}{(2k+1)^3}=\\frac{\\pi^3}{32}$.",
    "steps": [
      "Let $u=\\ln\\tan x$: $du=\\frac{\\sec^2x}{\\tan x}\\,dx=\\frac{2}{\\sin 2x}\\,dx$, and $\\sin 2x=\\frac{2\\tan x}{1+\\tan^2x}=\\frac{1}{\\cosh u}$, so $dx=\\frac{du}{2\\cosh u}$.",
      "The integral becomes $\\int_{-\\infty}^{\\infty}\\frac{u^2}{2\\cosh u}\\,du=\\int_0^{\\infty}\\frac{u^2}{\\cosh u}\\,du$ (even function).",
      "Expand $\\frac{1}{\\cosh u}=2\\sum_{k\\ge0}(-1)^ke^{-(2k+1)u}$ and use $\\int_0^\\infty u^2e^{-au}\\,du=\\frac{2}{a^3}$: the integral $=4\\sum_{k\\ge0}\\frac{(-1)^k}{(2k+1)^3}$.",
      "Known: $\\sum_{k\\ge0}\\frac{(-1)^k}{(2k+1)^3}=\\frac{\\pi^3}{32}$, so the answer $=4\\cdot\\frac{\\pi^3}{32}=\\frac{\\pi^3}{8}$."
    ],
    "trap": "Thinking that since $\\ln\\tan x$ is antisymmetric about $\\frac{\\pi}{4}$ on $[0,\\frac{\\pi}{2}]$, its square cancels too, and answering $0$. Only $\\ln\\tan x$ itself is antisymmetric; its square is symmetric and positive.",
    "check": "The integrand is nonnegative, so the answer must be positive; $\\frac{\\pi^3}{8}\\approx 3.876$."
  },
  "burst-boss-int-018": {
    "spot": "$\\int_0^{\\pi/2}\\sin^nx\\,dx$ with $n=14$ even — Wallis formula: $\\frac{(n-1)!!}{n!!}\\cdot\\frac{\\pi}{2}$; even powers carry the $\\frac{\\pi}{2}$.",
    "why": "Power-reduction would take seven rounds; the Wallis recursion $W_n=\\frac{n-1}{n}W_{n-2}$ just multiplies all the way down.",
    "steps": [
      "Recursion: $W_n=\\frac{n-1}{n}W_{n-2}$, starting from $W_0=\\frac{\\pi}{2}$.",
      "$W_{14}=\\frac{13}{14}\\cdot\\frac{11}{12}\\cdot\\frac{9}{10}\\cdot\\frac{7}{8}\\cdot\\frac{5}{6}\\cdot\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}$.",
      "$\\frac{135135}{645120}=\\frac{429}{2048}$; times $\\frac{\\pi}{2}$ gives $\\frac{429\\pi}{4096}$."
    ],
    "trap": "Forgetting the $\\frac{\\pi}{2}$ for an even power (that's the odd-power formula) and answering $\\frac{429}{2048}$.",
    "check": "$\\sin^{14}x\\le 1$ and is small over most of the interval; the answer $\\approx 0.329$ is much less than $\\frac{\\pi}{2}$."
  },
  "burst-boss-int-019": {
    "spot": "$\\int_0^{\\pi/2}\\sin^{15}x\\,dx$ with an odd power — Wallis formula $\\frac{(n-1)!!}{n!!}$; odd powers have no $\\pi$.",
    "why": "Multiply the recursion $W_n=\\frac{n-1}{n}W_{n-2}$ down to $W_1=1$; much faster than expanding $(1-\\cos^2x)^7$ and substituting.",
    "steps": [
      "Recursion: $W_n=\\frac{n-1}{n}W_{n-2}$, with the odd starting point $W_1=\\int_0^{\\pi/2}\\sin x\\,dx=1$.",
      "$W_{15}=\\frac{14}{15}\\cdot\\frac{12}{13}\\cdot\\frac{10}{11}\\cdot\\frac{8}{9}\\cdot\\frac{6}{7}\\cdot\\frac{4}{5}\\cdot\\frac{2}{3}=\\frac{645120}{2027025}$.",
      "Reduce (divide both by $315$): $\\frac{2048}{6435}$."
    ],
    "trap": "Following the even-power formula and multiplying by an extra $\\frac{\\pi}{2}$. The odd-power recursion bottoms out at $W_1=1$, with no $\\pi$.",
    "check": "$W_{15}$ should be a bit smaller than $W_{14}=\\frac{429\\pi}{4096}\\approx 0.329$: $\\frac{2048}{6435}\\approx 0.318$."
  },
  "burst-boss2-anti-001": {
    "spot": "$x^5$ times $e^{2x}$: the polynomial differentiates to $0$, and each integration of the exponential adds a factor $\\frac{1}{2}$ — tabular method; the $k$-th coefficient is $(-1)^k\\frac{(x^5)^{(k)}}{2^{k+1}}$.",
    "why": "Five rounds of integration by parts fit in one table, so the signs and the powers of $\\frac{1}{2}$ line up at a glance and nothing gets lost.",
    "steps": [
      "Left column, differentiate $x^5$: $5x^4,\\ 20x^3,\\ 60x^2,\\ 120x,\\ 120$; right column, integrate $e^{2x}$: $\\frac{e^{2x}}{2},\\ \\frac{e^{2x}}{4},\\ \\frac{e^{2x}}{8},\\ldots$",
      "Multiply along the diagonals with alternating signs: $e^{2x}\\left(\\frac{x^5}{2}-\\frac{5x^4}{4}+\\frac{20x^3}{8}-\\frac{60x^2}{16}+\\frac{120x}{32}-\\frac{120}{64}\\right)$.",
      "Simplified: $e^{2x}\\left(\\frac{x^5}{2}-\\frac{5x^4}{4}+\\frac{5x^3}{2}-\\frac{15x^2}{4}+\\frac{15x}{4}-\\frac{15}{8}\\right)+C$."
    ],
    "trap": "Forgetting that every integration in the right column divides by another $2$, and dividing by $2$ only once throughout; the coefficients won't match when you differentiate back.",
    "check": "Plug in $x=0$: the answer is $-\\frac{15}{8}$; since the antiderivative tends to $0$ at $-\\infty$, it should equal $\\int_{-\\infty}^0x^5e^{2x}\\,dx=-\\frac{5!}{2^6}$."
  },
  "burst-int-033": {
    "spot": "$\\int_0^{\\pi/2}\\sin^{12}x\\,dx$, an even power — Wallis: $\\frac{11!!}{12!!}\\cdot\\frac{\\pi}{2}$.",
    "why": "Multiply the recursion $W_n=\\frac{n-1}{n}W_{n-2}$ six times to reach $W_0=\\frac{\\pi}{2}$ — far less work than power-reduction.",
    "steps": [
      "Recursion: $W_n=\\frac{n-1}{n}W_{n-2}$, $W_0=\\frac{\\pi}{2}$.",
      "$\\frac{11\\cdot9\\cdot7\\cdot5\\cdot3\\cdot1}{12\\cdot10\\cdot8\\cdot6\\cdot4\\cdot2}=\\frac{10395}{46080}=\\frac{231}{1024}$.",
      "Multiply by $\\frac{\\pi}{2}$: $\\frac{231\\pi}{2048}$."
    ],
    "trap": "Leaving out the $\\frac{\\pi}{2}$ for an even power and answering $\\frac{231}{1024}$.",
    "check": "$W_{12}$ must be larger than $W_{14}=\\frac{429\\pi}{4096}$ (higher powers are smaller): $0.3544>0.3290$."
  },
  "burst-int-034": {
    "spot": "$\\int_0^{\\pi/2}\\cos^{13}x\\,dx$ — on $[0,\\frac{\\pi}{2}]$ the $\\cos$ and $\\sin$ integrals are equal (substitute $x\\to\\frac{\\pi}{2}-x$); odd power, so use Wallis $\\frac{12!!}{13!!}$.",
    "why": "Multiply the recursion six times down to $W_1=1$; faster than expanding $(1-\\sin^2x)^6\\cos x$ and integrating seven terms.",
    "steps": [
      "Symmetry: $\\int_0^{\\pi/2}\\cos^{13}x\\,dx=\\int_0^{\\pi/2}\\sin^{13}x\\,dx$.",
      "Wallis, odd case: $\\frac{12\\cdot10\\cdot8\\cdot6\\cdot4\\cdot2}{13\\cdot11\\cdot9\\cdot7\\cdot5\\cdot3}=\\frac{46080}{135135}$.",
      "Reduce (divide both by $45$): $\\frac{1024}{3003}$."
    ],
    "trap": "Multiplying by $\\frac{\\pi}{2}$ for an odd power too; or flipping the double factorials in the numerator and denominator, giving a number bigger than $1$.",
    "check": "$\\cos^{13}x\\le 1$ and is only large near $0$; the answer $\\approx 0.341$ lies in $(0,1)$."
  },
  "burst-int-038": {
    "spot": "$(\\ln x)^3$ with no other factor — set $u=(\\ln x)^3$, $dv=dx$; each round of integration by parts lowers the power of $\\ln$ by one, three rounds to the bottom.",
    "why": "$\\int(\\ln x)^n\\,dx=x(\\ln x)^n-n\\int(\\ln x)^{n-1}\\,dx$ saves the conversion step compared with switching to $\\int t^3e^t\\,dt$.",
    "steps": [
      "By parts: $\\int(\\ln x)^3\\,dx=x(\\ln x)^3-3\\int(\\ln x)^2\\,dx$.",
      "Continue: $\\int(\\ln x)^2\\,dx=x(\\ln x)^2-2\\int\\ln x\\,dx$, and $\\int\\ln x\\,dx=x\\ln x-x$.",
      "Substitute back: $x(\\ln x)^3-3\\left[x(\\ln x)^2-2x\\ln x+2x\\right]=x\\left[(\\ln x)^3-3(\\ln x)^2+6\\ln x-6\\right]+C$."
    ],
    "trap": "Writing the last term as $+6x$ (signs not alternating); after three rounds the constant term is $(-1)^3\\cdot3!=-6$.",
    "check": "Using the answer, $\\int_1^e(\\ln x)^3\\,dx$ comes out to $e(1-3+6-6)-(-6)=6-2e$."
  },
  "db-logd-004": {
    "spot": "Both the base $1+\\frac{1}{x}$ and the exponent $x$ vary with $x$ — \"a variable to a variable power\", so the only way is to take logs and then differentiate (logarithmic differentiation).",
    "why": "The power rule needs a constant exponent and the exponential rule needs a constant base; here neither is constant. Taking $\\ln$ brings the exponent down into a product.",
    "steps": [
      "$\\ln y=x\\ln\\left(1+\\frac{1}{x}\\right)$.",
      "Differentiate: $\\frac{y'}{y}=\\ln\\left(1+\\frac{1}{x}\\right)+x\\cdot\\frac{-1/x^2}{1+1/x}=\\ln\\left(1+\\frac{1}{x}\\right)-\\frac{1}{x+1}$.",
      "Multiply back by $y$: $y'=\\left(1+\\frac{1}{x}\\right)^x\\left[\\ln\\left(1+\\frac{1}{x}\\right)-\\frac{1}{x+1}\\right]$."
    ],
    "trap": "Treating it as a power rule: $x\\left(1+\\frac{1}{x}\\right)^{x-1}\\cdot\\left(-\\frac{1}{x^2}\\right)$ — only half the job, missing the $\\ln$ term from the exponent also changing.",
    "check": "$\\left(1+\\frac{1}{x}\\right)^x$ increases monotonically toward $e$, so the derivative should be positive for $x>1$."
  },
  "db-rr-004": {
    "spot": "In an inverted cone the radius is proportional to the water depth, $\\frac{r}{h}=\\frac{3}{6}$ — use similar triangles to eliminate $r$ first, so the volume depends only on $h$, then differentiate in time.",
    "why": "Without eliminating $r$ you'd have to handle both $\\frac{dr}{dt}$ and $\\frac{dh}{dt}$; substituting $r=\\frac{h}{2}$ first leaves a single equation.",
    "steps": [
      "Similar triangles: $r=\\frac{h}{2}$, so $V=\\frac{1}{3}\\pi r^2h=\\frac{\\pi h^3}{12}$.",
      "Differentiate in $t$: $\\frac{dV}{dt}=\\frac{\\pi h^2}{4}\\frac{dh}{dt}$.",
      "Plug in $h=4$, $\\frac{dV}{dt}=2$: $2=4\\pi\\frac{dh}{dt}$, $\\frac{dh}{dt}=\\frac{1}{2\\pi}$."
    ],
    "trap": "Flipping the ratio to $r=2h$, or plugging in $h=4$ before differentiating so the variable becomes a constant and the derivative becomes $0$.",
    "check": "At depth $4$ the water surface area is $\\pi r^2=4\\pi$, and the rise rate $=\\frac{\\text{inflow rate}}{\\text{surface area}}=\\frac{2}{4\\pi}$."
  },
  "dd-opt-010": {
    "spot": "The route is \"swim diagonally to a point on the far bank, then walk along the shore\": let the landing point be $x$ km from the point directly across; cost $5\\sqrt{1+x^2}+3(5-x)$ — a one-variable optimization.",
    "why": "Differentiating in $x$ and setting it to zero is most direct; the optimum in this kind of problem satisfies $\\sin\\theta=\\frac{\\text{land cost}}{\\text{water cost}}$, the same form as Snell's law.",
    "steps": [
      "$C(x)=5\\sqrt{1+x^2}+3(5-x)$, $0\\le x\\le 5$.",
      "$C'(x)=\\frac{5x}{\\sqrt{1+x^2}}-3=0\\Rightarrow 5x=3\\sqrt{1+x^2}\\Rightarrow 16x^2=9$, $x=\\frac{3}{4}$.",
      "Second derivative $C''=\\frac{5}{(1+x^2)^{3/2}}>0$, so it's a minimum.",
      "$C\\left(\\frac{3}{4}\\right)=5\\cdot\\frac{5}{4}+3\\cdot\\frac{17}{4}=\\frac{25+51}{4}=19$."
    ],
    "trap": "Swimming straight to the factory ($x=5$) or swimming straight across and then walking ($x=0$). The endpoints give only $20$ and about $25.5$, both more expensive than the interior $19$.",
    "check": "At the optimum $\\sin\\theta=\\frac{x}{\\sqrt{1+x^2}}=\\frac{3/4}{5/4}=\\frac{3}{5}$, exactly the cost ratio."
  },
  "dd-rr-011": {
    "spot": "\"Height always equals the base diameter\", $h=2r$ — substitute $r=\\frac{h}{2}$ into the cone volume first, so it depends only on $h$, then differentiate in time.",
    "why": "Same as the tank problem: eliminate $r$ first to leave one relation; otherwise you'd carry an extra $\\frac{dr}{dt}$.",
    "steps": [
      "$V=\\frac{1}{3}\\pi r^2h=\\frac{1}{3}\\pi\\frac{h^2}{4}h=\\frac{\\pi h^3}{12}$.",
      "$\\frac{dV}{dt}=\\frac{\\pi h^2}{4}\\frac{dh}{dt}$.",
      "Plug in $h=15$, $\\frac{dV}{dt}=10$: $\\frac{dh}{dt}=\\frac{10}{225\\pi/4}=\\frac{40}{225\\pi}=\\frac{8}{45\\pi}$."
    ],
    "trap": "Reading \"height equals diameter\" as \"height equals radius\", using $r=h$, which gives $V=\\frac{\\pi h^3}{3}$ and an answer four times too small.",
    "check": "Rise rate $=\\frac{\\text{volume flow rate}}{\\text{top cross-section area}}$: at $h=15$ the radius is $7.5$, giving $\\frac{10}{\\pi\\cdot 7.5^2}$."
  },
  "der-036": {
    "spot": "The Laplacian is $f_{xx}+f_{yy}$; $f=x^2+y^2$ is purely quadratic in each direction, so both second partials are the constant $2$.",
    "why": "Just compute the two second partials by definition and add; there's no faster route.",
    "steps": [
      "$f_x=2x$, $f_{xx}=2$.",
      "$f_y=2y$, $f_{yy}=2$.",
      "$\\nabla^2f=2+2=4$."
    ],
    "trap": "Confusing the Laplacian with the gradient and writing $(2x,2y)$; the Laplacian is a scalar, the sum of second partials.",
    "check": "The Laplacian of $|x|^2$ in $n$ dimensions is $2n$; in two dimensions that's $4$."
  },
  "der-043": {
    "spot": "$\\ln(xy)=\\ln x+\\ln y$, with total differential $dz=\\frac{dx}{x}+\\frac{dy}{y}$ — at $(1,2)$, $\\frac{0.02}{1}$ and $\\frac{-0.04}{2}$ cancel exactly.",
    "why": "The problem asks for an \"estimate\", so the total differential (linear approximation) does it in one line, without plugging into $\\ln$.",
    "steps": [
      "$z_x=\\frac{1}{x}$, $z_y=\\frac{1}{y}$.",
      "At $(1,2)$: $z_x=1$, $z_y=\\frac{1}{2}$.",
      "$\\Delta z\\approx 1\\cdot0.02+\\frac{1}{2}\\cdot(-0.04)=0$."
    ],
    "trap": "Dropping the minus sign in $dy=-0.04$ and getting $0.04$.",
    "check": "The actual change $\\ln(1.02\\cdot1.96)-\\ln 2=\\ln 0.9996\\approx-0.0004$ is indeed close to $0$ (the difference is second order)."
  },
  "der-046": {
    "spot": "The point $(1.02,1.97)$ is very close to the base point $(1,2)$, and $f(1,2)=5$ is easy — use the tangent plane $f+f_x\\Delta x+f_y\\Delta y$.",
    "why": "Linear approximation needs only two first partials; the exact value requires squaring two decimals, while the approximation is immediate.",
    "steps": [
      "$f(1,2)=1+4=5$; $f_x=2x=2$, $f_y=2y=4$.",
      "$\\Delta x=0.02$, $\\Delta y=-0.03$.",
      "$L=5+2(0.02)+4(-0.03)=5+0.04-0.12=4.92$."
    ],
    "trap": "Writing $\\Delta y$ as $+0.03$ and getting $5.16$.",
    "check": "The true value $1.02^2+1.97^2=4.9213$ differs from $4.92$ only by the second-order amount $0.02^2+0.03^2$."
  },
  "der-069": {
    "spot": "$u=x^2-y^2$, $v=2xy$ are exactly the real and imaginary parts of $z^2$ — the Cauchy-Riemann equations hold, so the Jacobian will be $|f'(z)|^2=|2z|^2$.",
    "why": "Computing the $2\\times2$ determinant directly is safest; recognizing $z^2$ tells you in advance the answer is $4(x^2+y^2)$.",
    "steps": [
      "$u_x=2x$, $u_y=-2y$.",
      "$v_x=2y$, $v_y=2x$.",
      "$\\det=u_xv_y-u_yv_x=4x^2+4y^2=4(x^2+y^2)$."
    ],
    "trap": "Dropping the minus sign of $u_y$ in the cross product and getting $4x^2-4y^2$.",
    "check": "At the origin the Jacobian is $0$: the derivative of $z^2$ at $z=0$ is $0$, so the map squashes area there."
  },
  "der-071": {
    "spot": "$x=r\\cos t$, $y=r\\sin t$ are polar coordinates — the familiar $dA=r\\,dr\\,d\\theta$ is exactly this Jacobian.",
    "why": "Compute the determinant by definition; the two terms add to $r(\\cos^2t+\\sin^2t)$.",
    "steps": [
      "$x_r=\\cos t$, $x_t=-r\\sin t$.",
      "$y_r=\\sin t$, $y_t=r\\cos t$.",
      "$\\det=\\cos t\\cdot r\\cos t-(-r\\sin t)\\sin t=r(\\cos^2t+\\sin^2t)=r$."
    ],
    "trap": "Mishandling the cross-term minus together with the minus in $-r\\sin t$, getting $r(\\cos^2t-\\sin^2t)=r\\cos 2t$.",
    "check": "Area of the disk of radius $1$:$\\int_0^{2\\pi}\\int_0^1 r\\,dr\\,dt=\\pi$, consistent with the Jacobian."
  },
  "der-072": {
    "spot": "$u=xy$, $v=\\frac{x}{y}$ — all partials are monomials, so just write the $2\\times2$ matrix and take the determinant.",
    "why": "There's no special structure to exploit, so the definition is fastest; remember that $\\frac{x}{y}$ differentiated in $y$ has a minus sign.",
    "steps": [
      "$u_x=y$, $u_y=x$.",
      "$v_x=\\frac{1}{y}$, $v_y=-\\frac{x}{y^2}$.",
      "$\\det=y\\cdot\\left(-\\frac{x}{y^2}\\right)-x\\cdot\\frac{1}{y}=-\\frac{x}{y}-\\frac{x}{y}=-\\frac{2x}{y}$."
    ],
    "trap": "Writing $v_y$ as $+\\frac{x}{y^2}$, so the two terms cancel to $0$.",
    "check": "The inverse map's Jacobian should be the reciprocal: for $x=\\sqrt{uv}$, $y=\\sqrt{u/v}$ the Jacobian is $-\\frac{1}{2v}=-\\frac{y}{2x}$, exactly the reciprocal of $-\\frac{2x}{y}$."
  },
  "der-074": {
    "spot": "Jacobian determinant of a composite map — Chain Rule: $\\det D(g\\circ f)=\\det Dg\\cdot\\det Df$; compute each and multiply.",
    "why": "You could compose into $(x+xy,\\ x-xy)$ first, but each determinant separately is one line, and since $g$ is linear, $\\det Dg$ is a constant.",
    "steps": [
      "$f=(x,xy)$: $Df=\\begin{pmatrix}1&0\\\\y&x\\end{pmatrix}$, $\\det Df=x$.",
      "$g=(u+v,u-v)$: $\\det Dg=1\\cdot(-1)-1\\cdot1=-2$.",
      "Cross-check by composing directly: $g\\circ f=(x+xy,\\ x-xy)$, determinant $=-2x$.",
      "At $(2,3)$: $-2\\cdot2=-4$."
    ],
    "trap": "Computing $\\det Dg$ as $1\\cdot1-1\\cdot1=0$ (forgetting that $u-v$ differentiated in $v$ is $-1$) and answering $0$.",
    "check": "The value $y=3$ is never used — the determinant $-2x$ depends only on $x$."
  },
  "der-086": {
    "spot": "The complex map $z\\mapsto z^2$ viewed as a plane map: $u=x^2-y^2$, $v=2xy$; for an analytic function the Jacobian is $|f'(z)|^2$.",
    "why": "$|f'(z)|^2=|2z|^2=4(x^2+y^2)$ gives the answer in one step; the $2\\times2$ determinant serves as a cross-check.",
    "steps": [
      "$(x+iy)^2=x^2-y^2+2xyi$, so $u=x^2-y^2$, $v=2xy$.",
      "Determinant: $u_xv_y-u_yv_x=2x\\cdot2x-(-2y)(2y)=4x^2+4y^2$.",
      "That is, $|f'(z)|^2=|2z|^2=4(x^2+y^2)$."
    ],
    "trap": "Thinking the Jacobian is $|f'(z)|=2|z|$, missing the square. The area scale factor is the square of the length scale factor.",
    "check": "At $z=1$ ($x=1,y=0$): $z^2$ stretches nearby lengths by a factor $2$, so areas by a factor $4$."
  },
  "exam-der-015": {
    "spot": "Both limits are functions of $x$ ($x^2$ and $x$) — Fundamental Theorem of Calculus plus the Chain Rule: plug in the upper limit times its derivative, minus the lower limit times its derivative.",
    "why": "The antiderivative of $\\ln(1+t^2)$ is ugly and you never need it; the Leibniz rule just replaces $t$ with the limits.",
    "steps": [
      "Let $F'(t)=\\ln(1+t^2)$; the integral $=F(x^2)-F(x)$.",
      "Upper limit: $\\frac{d}{dx}F(x^2)=\\ln(1+x^4)\\cdot2x$.",
      "Lower limit: $\\frac{d}{dx}F(x)=\\ln(1+x^2)$, which is subtracted.",
      "Answer: $2x\\ln(1+x^4)-\\ln(1+x^2)$."
    ],
    "trap": "Plugging in $x^2$ for the upper limit but forgetting to multiply by $(x^2)'=2x$, getting $\\ln(1+x^4)-\\ln(1+x^2)$.",
    "check": "At $x=1$ the limits coincide, but the derivative need not be $0$: $2\\ln2-\\ln2=\\ln2$."
  },
  "exam-multi-010": {
    "spot": "Only the $z$-component of the curl is needed: $(\\nabla\\times\\mathbf F)_z=\\frac{\\partial Q}{\\partial x}-\\frac{\\partial P}{\\partial y}$, which uses only the first two components $P=y^2$, $Q=z^2$.",
    "why": "No need to expand the whole $3\\times3$ determinant; the $z$-component involves only those two partials in the $xy$-plane.",
    "steps": [
      "$Q=z^2$ doesn't involve $x$, so $\\frac{\\partial Q}{\\partial x}=0$.",
      "$P=y^2$, $\\frac{\\partial P}{\\partial y}=2y$.",
      "$z$-component $=0-2y=-2y$."
    ],
    "trap": "Reversing the order to $\\frac{\\partial P}{\\partial y}-\\frac{\\partial Q}{\\partial x}$ and getting $2y$. Memory aid: the $z$-component is $Q_x-P_y$ (the same expression as in Green's theorem).",
    "check": "The full curl is $(-2z,\\,-2x,\\,-2y)$: each component is $-2$ times \"the variable of the next component\", a consistent symmetric pattern."
  },
  "exam-ser-019": {
    "spot": "$\\frac{1}{1-2x}$ is the geometric series $\\frac{1}{1-r}$ with $r$ replaced by $2x$: $\\sum(2x)^n$, so the coefficient of $x^n$ is $2^n$.",
    "why": "No need to differentiate four times and divide by $4!$; substitute into the geometric series and read off the coefficient.",
    "steps": [
      "$\\frac{1}{1-r}=\\sum_{n\\ge0}r^n$; substituting $r=2x$: $\\frac{1}{1-2x}=\\sum 2^nx^n$ (for $|x|<\\frac{1}{2}$).",
      "Coefficient of $x^4$ $=2^4=16$.",
      "Check the pattern with derivatives: $f^{(n)}(0)=n!\\cdot2^n$, e.g. $f''(0)=2!\\cdot2^2=8$; so the $x^4$ coefficient $=\\frac{4!\\cdot2^4}{4!}=16$."
    ],
    "trap": "Thinking the coefficient is $2$ or $8$ (multiplying by $2$ only once, or stopping at $x^3$); $(2x)^4=16x^4$ — the power applies to both.",
    "check": "The first few terms $1+2x+4x^2+8x^3+16x^4$ double each time."
  },
  "exam-ser-020": {
    "spot": "$\\sum\\frac{n}{3^n}$: $n$ times a geometric term $r^n$ — differentiate $\\sum r^n=\\frac{1}{1-r}$ once and multiply by $r$ to get $\\sum nr^n=\\frac{r}{(1-r)^2}$.",
    "why": "The Ratio Test only says it converges, not to what; differentiating a geometric series is the standard trick for sums like this.",
    "steps": [
      "$\\sum_{n\\ge0}r^n=\\frac{1}{1-r}$; differentiate: $\\sum nr^{n-1}=\\frac{1}{(1-r)^2}$.",
      "Multiply by $r$: $\\sum_{n\\ge1}nr^n=\\frac{r}{(1-r)^2}$.",
      "Plug in $r=\\frac{1}{3}$: $\\frac{1/3}{(2/3)^2}=\\frac{1/3}{4/9}=\\frac{3}{4}$."
    ],
    "trap": "Forgetting to multiply back by $r$ and using $\\frac{1}{(1-r)^2}=\\frac{9}{4}$ as the answer; that's $\\sum nr^{n-1}$.",
    "check": "The first few terms $\\frac{1}{3}+\\frac{2}{9}+\\frac{3}{27}+\\frac{4}{81}\\approx0.716$ are already close to $0.75$."
  },
  "gap-int-triple-002": {
    "spot": "Unit cube, and the integrand $x+y+z$ is symmetric in the three variables — the three terms have equal integrals, each $\\frac{1}{2}$.",
    "why": "Use symmetry and linearity instead of a real triple integral; each term is \"average value $\\frac{1}{2}$ times volume $1$\".",
    "steps": [
      "Linearity: $\\iiint(x+y+z)\\,dV=\\iiint x\\,dV+\\iiint y\\,dV+\\iiint z\\,dV$.",
      "Symmetry: each of the three equals $\\int_0^1x\\,dx\\cdot1\\cdot1=\\frac{1}{2}$.",
      "Total $\\frac{3}{2}$."
    ],
    "trap": "Computing only $\\iiint x\\,dV=\\frac{1}{2}$ and stopping. Each of the three variables contributes $\\frac{1}{2}$; add them up.",
    "check": "The average of $x+y+z$ over the cube is $\\frac{3}{2}$ (its value at the center), times volume $1$."
  },
  "gap-ser-lc-002": {
    "spot": "$\\frac{n+1}{n^3+1}$ has a degree-one numerator and a degree-three denominator, so for large $n$ it behaves like $\\frac{1}{n^2}$ — Limit Comparison Test against the $p=2$ series.",
    "why": "Direct comparison requires building an inequality; limit comparison only needs the limit of one ratio — clean.",
    "steps": [
      "Dominant terms: $\\frac{n+1}{n^3+1}\\approx\\frac{n}{n^3}=\\frac{1}{n^2}$.",
      "$\\sum\\frac{1}{n^2}$ is a $p$-series with $p=2>1$, so it converges.",
      "The limit of the ratio is the finite positive number $1$, so both behave the same: the original series converges."
    ],
    "trap": "Seeing $n$ in the numerator, thinking it's like $\\frac{1}{n}$ and calling it divergent; what matters is the difference of the top degrees, $3-1=2$.",
    "check": "Every term is at most $\\frac{2}{n^2}$ (since $n+1\\le2n$ and $n^3+1>n^3$), so it's dominated by a convergent series."
  },
  "hc-usub-003": {
    "spot": "The $x$ outside is exactly half the derivative of $1+x^2$ — substitute $u=1+x^2$ and the integral becomes $\\frac{1}{2}\\int(\\ln u)^2\\,du$.",
    "why": "Substitute first to absorb the $x$; what remains, $\\int(\\ln u)^2\\,du$, is a standard two-round integration by parts. Doing parts on the original is a mess.",
    "steps": [
      "$u=1+x^2$, $du=2x\\,dx$: $\\int x(\\ln(1+x^2))^2\\,dx=\\frac{1}{2}\\int(\\ln u)^2\\,du$.",
      "$\\int(\\ln u)^2\\,du=u\\left[(\\ln u)^2-2\\ln u+2\\right]+C$ (integration by parts twice).",
      "Back to $x$: $\\frac{1+x^2}{2}\\left[(\\ln(1+x^2))^2-2\\ln(1+x^2)+2\\right]+C$."
    ],
    "trap": "Forgetting the leading $\\frac{1}{2}$ after substituting, so the answer is twice too big; differentiating back gives $2x(\\ln(1+x^2))^2$.",
    "check": "Check a definite integral: $\\int_0^1x(\\ln(1+x^2))^2\\,dx=F(1)-F(0)=\\left[(\\ln2)^2-2\\ln2+2\\right]-1$."
  },
  "int-032": {
    "spot": "The region $1\\le x^2+y^2\\le4$ is an annulus and the integrand is $1$ — it's just asking for the annulus area: polar coordinates, or big disk minus small disk.",
    "why": "$\\iint1\\,dA$ is area; the annulus area $\\pi(2^2-1^2)$ needs no integration.",
    "steps": [
      "Polar coordinates: $\\int_0^{2\\pi}\\int_1^2r\\,dr\\,d\\theta$.",
      "$=2\\pi\\cdot\\frac{3}{2}=3\\pi$.",
      "Compare with area: $\\pi\\cdot4-\\pi\\cdot1=3\\pi$."
    ],
    "trap": "Forgetting the Jacobian factor $r$ in polar coordinates and getting $2\\pi\\cdot(2-1)=2\\pi$.",
    "check": "The annulus area must lie between zero and the outer disk's area $4\\pi$."
  },
  "ode-val-006": {
    "spot": "$y'=y\\sin x$ is separable (or first-order linear): $\\frac{dy}{y}=\\sin x\\,dx$, so the solution has the form $e^{\\int\\sin x}$.",
    "why": "Separation of variables is fastest; no need to write an integrating factor.",
    "steps": [
      "Separate: $\\ln|y|=-\\cos x+C$, $y=Ae^{-\\cos x}$.",
      "Plug in $y(0)=1$: $Ae^{-1}=1$, $A=e$, so $y=e^{1-\\cos x}$.",
      "$y(\\pi)=e^{1-\\cos\\pi}=e^{1+1}=e^2$."
    ],
    "trap": "Writing $\\int\\sin x\\,dx$ as $\\cos x$ (dropping the minus sign), which gives $y=e^{\\cos x-1}$ and the answer $e^{-2}$.",
    "check": "On $(0,\\pi)$, $\\sin x>0$, so $y$ increases the whole way and $y(\\pi)$ must exceed $1$: $e^2\\approx7.39$."
  },
  "refine-integrals-036": {
    "spot": "A vertical plate where pressure varies with depth — slice into horizontal strips; the strip width at depth $h$ shrinks linearly with $h$: $w(h)=2\\left(1-\\frac{h}{3}\\right)$, and force $=\\rho g\\int h\\,w(h)\\,dh$.",
    "why": "Pressure depends only on depth, so horizontal strips have uniform pressure; similar triangles give the width.",
    "steps": [
      "Similar triangles: width $2$ at the surface and $0$ at depth $3$, so $w(h)=2-\\frac{2h}{3}$.",
      "$F=9800\\int_0^3h\\left(2-\\frac{2h}{3}\\right)dh=9800\\left(9-6\\right)=9800\\cdot3$.",
      "$F=29400$ N."
    ],
    "trap": "Getting the width backwards as $w(h)=\\frac{2h}{3}$ (vertex up), which gives $9800\\cdot6=58800$. Here the base is at the surface, so it narrows with depth.",
    "check": "Force $=\\rho g\\times$ centroid depth $\\times$ area: the centroid is $1$ m below the surface and the area is $3$ m$^2$."
  },
  "rel-hard-int-017": {
    "spot": "$\\ln\\sin x+\\ln\\cos x=\\ln\\left(\\frac{\\sin2x}{2}\\right)$, and on $[0,\\frac{\\pi}{2}]$, $\\int\\ln\\sin x=\\int\\ln\\cos x$ — this is the classic $\\int_0^{\\pi/2}\\ln\\sin x\\,dx=-\\frac{\\pi}{2}\\ln2$, times $2$.",
    "why": "Using the double angle to write the sum as $\\ln\\sin2x-\\ln2$ gives a self-similar equation — exactly how the classic result is derived; no antiderivative needed (there isn't one to find anyway).",
    "steps": [
      "Symmetry $x\\to\\frac{\\pi}{2}-x$: $\\int_0^{\\pi/2}\\ln\\cos x\\,dx=\\int_0^{\\pi/2}\\ln\\sin x\\,dx=:I$; we want $2I$.",
      "Double angle: $2I=\\int_0^{\\pi/2}\\ln\\frac{\\sin2x}{2}\\,dx=\\int_0^{\\pi/2}\\ln\\sin2x\\,dx-\\frac{\\pi}{2}\\ln2$.",
      "Substitute $u=2x$: $\\int_0^{\\pi/2}\\ln\\sin2x\\,dx=\\frac{1}{2}\\int_0^{\\pi}\\ln\\sin u\\,du=I$. So $2I=I-\\frac{\\pi}{2}\\ln2$, $I=-\\frac{\\pi}{2}\\ln2$.",
      "The answer $=2I=-\\pi\\ln2$."
    ],
    "trap": "Thinking $\\int_0^{\\pi}\\ln\\sin u\\,du$ equals the $\\int_0^{\\pi/2}$ version, missing the factor of $2$; the equation becomes $2I=\\frac{I}{2}-\\cdots$ and the answer is wrong.",
    "check": "$\\sin x\\cos x\\le\\frac{1}{2}$, so the integrand is everywhere $\\le-\\ln2$ and the integral must be $\\le-\\frac{\\pi}{2}\\ln2$; $-\\pi\\ln2$ is more negative, which is consistent."
  },
  "rel-hard-mv-002": {
    "spot": "Unit disk with integrand $x^2y^2$ — in polar coordinates it splits into an $r$ part $r^5$ and an angle part $\\cos^2\\theta\\sin^2\\theta$: a product of two one-dimensional integrals.",
    "why": "In Cartesian coordinates you'd integrate powers of $\\sqrt{1-x^2}$ — painful; in polar coordinates the region is the rectangle $[0,1]\\times[0,2\\pi]$ and the variables separate.",
    "steps": [
      "$x^2y^2\\,dA=r^4\\cos^2\\theta\\sin^2\\theta\\cdot r\\,dr\\,d\\theta$.",
      "Angle: $\\cos^2\\theta\\sin^2\\theta=\\frac{\\sin^22\\theta}{4}$, and $\\int_0^{2\\pi}=\\frac{1}{4}\\cdot\\pi=\\frac{\\pi}{4}$.",
      "Multiply: $\\frac{1}{6}\\cdot\\frac{\\pi}{4}=\\frac{\\pi}{24}$."
    ],
    "trap": "Forgetting the Jacobian factor $r$, so the $r$ part becomes $\\int_0^1r^4\\,dr=\\frac{1}{5}$ and the answer $\\frac{\\pi}{20}$.",
    "check": "On the disk $x^2y^2\\le\\frac{1}{4}$ (since $xy\\le\\frac{x^2+y^2}{2}$), so the integral is at most $\\frac{\\pi}{4}$."
  },
  "rel-hard-mv-005": {
    "spot": "The Jacobian of $u=\\frac{x}{y}$, $v=xy$ at a point — find the general expression $\\frac{2x}{y}$ first, then plug in the point; safer than plugging in before differentiating.",
    "why": "All four partials are simple, so write the determinant directly; wait until after differentiating to plug in.",
    "steps": [
      "$u_x=\\frac{1}{y}$, $u_y=-\\frac{x}{y^2}$.",
      "$v_x=y$, $v_y=x$.",
      "$\\det=\\frac{1}{y}\\cdot x-\\left(-\\frac{x}{y^2}\\right)y=\\frac{2x}{y}$.",
      "Plug in $(2,1)$: $\\frac{4}{1}=4$."
    ],
    "trap": "Messing up the minus sign of $u_y$ together with the determinant's minus, getting $\\frac{x}{y}-\\frac{x}{y}=0$.",
    "check": "Swapping $u,v$ ($u=xy$, $v=\\frac{x}{y}$) swaps two rows of the determinant, so the result flips sign to $-\\frac{2x}{y}$."
  },
  "uni-der-016": {
    "spot": "Only the $z$-component of the curl, $Q_x-P_y$, is needed; it uses $P=xy$, $Q=yz$.",
    "why": "No need to expand the whole curl; the $z$-component only involves the cross partials of the first two components.",
    "steps": [
      "$Q=yz$ has no $x$: $Q_x=0$.",
      "$P=xy$: $P_y=x$.",
      "$z$-component $=0-x=-x$."
    ],
    "trap": "Computing $P_y-Q_x=x$ instead; or mistaking $Q_x$ for $z$ (differentiating in the wrong variable).",
    "check": "The full curl is $(-y,-z,-x)$, cyclically symmetric, and its $z$-component is $-x$."
  },
  "vc-nab-010": {
    "spot": "$f\\mathbf F=\\langle xy,\\ xz,\\ x^2\\rangle$ is easy to multiply out; or use the product rule $\\nabla\\cdot(f\\mathbf F)=\\nabla f\\cdot\\mathbf F+f\\,\\nabla\\cdot\\mathbf F$.",
    "why": "Both terms of the product rule are immediate: $\\nabla f=(1,0,0)$ and $\\nabla\\cdot\\mathbf F=0$.",
    "steps": [
      "$\\nabla\\cdot\\mathbf F=\\frac{\\partial y}{\\partial x}+\\frac{\\partial z}{\\partial y}+\\frac{\\partial x}{\\partial z}=0$.",
      "$\\nabla f\\cdot\\mathbf F=(1,0,0)\\cdot(y,z,x)=y$. Cross-check by multiplying out: $\\frac{\\partial(xy)}{\\partial x}+\\frac{\\partial(xz)}{\\partial y}+\\frac{\\partial(x^2)}{\\partial z}=y$.",
      "So the divergence $=y$, which is $2$ at $(1,2,3)$."
    ],
    "trap": "Thinking $\\nabla\\cdot(f\\mathbf F)=f\\,\\nabla\\cdot\\mathbf F$, missing $\\nabla f\\cdot\\mathbf F$, and answering $0$.",
    "check": "The answer depends only on $y$: at $(5,2,7)$ it's still $2$."
  },
  "burst-boss-int-012": {
    "spot": "The $\\int_0^1x^a(\\ln x)^n\\,dx$ pattern — substitute $x=e^{-t}$ to get $\\int_0^\\infty t^ne^{-(a+1)t}\\,dt$, with formula $\\frac{(-1)^nn!}{(a+1)^{n+1}}$.",
    "why": "Four rounds of integration by parts also work, but after the substitution it's a Gamma integral — one line.",
    "steps": [
      "Substitute $x=e^{-t}$: $\\ln x=-t$, $dx=-e^{-t}dt$, and the integral $=\\int_0^\\infty t^4e^{-4t}\\,dt$ (since $(-t)^4=t^4$).",
      "$\\int_0^\\infty t^ne^{-ct}\\,dt=\\frac{n!}{c^{n+1}}$: here $n=4$, $c=4$, giving $\\frac{24}{4^5}=\\frac{24}{1024}$.",
      "Reduce: $\\frac{3}{128}$."
    ],
    "trap": "Sign: $(\\ln x)^4$ is an even power, so the answer is positive; if you use $\\frac{(-1)^nn!}{\\cdots}$ but treat $n$ as odd, you pick up a spurious minus sign.",
    "check": "The integrand is nonnegative on $(0,1)$, so the answer must be positive and small: $\\frac{3}{128}\\approx0.023$."
  },
  "burst-int-013": {
    "spot": "The $\\int_0^\\pi x\\cdot g(\\sin x)\\,dx$ pattern — use the symmetry $x\\to\\pi-x$: $\\int_0^\\pi xg(\\sin x)\\,dx=\\frac{\\pi}{2}\\int_0^\\pi g(\\sin x)\\,dx$, which removes the $x$.",
    "why": "Integrating $x\\sin^8x$ by parts first requires an antiderivative of $\\sin^8$ — very long; symmetry replaces $x$ by the constant $\\frac{\\pi}{2}$ in one step.",
    "steps": [
      "Let $I=\\int_0^\\pi x\\sin^8x\\,dx$ and substitute $x\\to\\pi-x$: $I=\\int_0^\\pi(\\pi-x)\\sin^8x\\,dx$; adding the two gives $2I=\\pi\\int_0^\\pi\\sin^8x\\,dx$.",
      "$\\int_0^\\pi\\sin^8x\\,dx=2\\int_0^{\\pi/2}\\sin^8x\\,dx=2\\cdot\\frac{7\\cdot5\\cdot3\\cdot1}{8\\cdot6\\cdot4\\cdot2}\\cdot\\frac{\\pi}{2}=\\frac{35\\pi}{128}$.",
      "$I=\\frac{\\pi}{2}\\cdot\\frac{35\\pi}{128}=\\frac{35\\pi^2}{256}$."
    ],
    "trap": "The Wallis $\\frac{\\pi}{2}$ is for $[0,\\frac{\\pi}{2}]$; over $[0,\\pi]$ you must multiply by $2$. Miss that and you answer $\\frac{35\\pi^2}{512}$.",
    "check": "$\\sin^8x$ is symmetric about $\\frac{\\pi}{2}$, so its \"center of mass\" is at $\\frac{\\pi}{2}$, and $I$ is just that average position $\\frac{\\pi}{2}$ times the total area."
  },
  "int-058": {
    "spot": "$e^{2(x-t)}=e^{2x}e^{-2t}$ — pull the factor involving only $x$ out of the integral, leaving just $\\int_0^xte^{-2t}\\,dt$ in $t$.",
    "why": "After splitting it's an ordinary integration by parts; without splitting you might wrongly treat $x$ as a variable of integration.",
    "steps": [
      "$F(x)=e^{2x}\\int_0^xte^{-2t}\\,dt$.",
      "By parts: $\\int te^{-2t}\\,dt=-\\frac{t}{2}e^{-2t}-\\frac{1}{4}e^{-2t}$; from $0$ to $x$: $\\frac{1}{4}-\\frac{x}{2}e^{-2x}-\\frac{1}{4}e^{-2x}$.",
      "Multiply back by $e^{2x}$: $F(x)=\\frac{e^{2x}}{4}-\\frac{x}{2}-\\frac{1}{4}=\\frac{e^{2x}-2x-1}{4}$."
    ],
    "trap": "Treating $e^{2(x-t)}$ as depending only on $t$, or integrating in $x$, so the result has no $e^{2x}$. The variable of integration is $t$; inside, $x$ is a constant.",
    "check": "$F$ should satisfy $F'=2F+x$, $F(0)=0$ (differentiating the convolution)."
  },
  "int-059": {
    "spot": "$e^{-(x-t)}=e^{-x}e^{t}$ — pull $e^{-x}$ out of the integral, leaving $\\int_0^xt^2e^t\\,dt$: tabular method.",
    "why": "After splitting it's a polynomial times an exponential; the tabular method finishes after two derivatives.",
    "steps": [
      "$F(x)=e^{-x}\\int_0^xt^2e^t\\,dt$.",
      "Tabular method: $\\int t^2e^t\\,dt=e^t(t^2-2t+2)$; from $0$ to $x$: $e^x(x^2-2x+2)-2$.",
      "Multiply by $e^{-x}$: $F(x)=x^2-2x+2-2e^{-x}$."
    ],
    "trap": "Forgetting to subtract the lower-limit term at $t=0$, $e^0(0-0+2)=2$, so the answer lacks $-2e^{-x}$ and $F(0)\\ne0$.",
    "check": "$F$ satisfies $F'=-F+x^2$, $F(0)=0$."
  },
  "int-071": {
    "spot": "Product-to-sum turns $\\sin3x\\sin8x$ into $\\frac{\\cos5x-\\cos11x}{2}$ — a Frullani-type integral $\\int_0^\\infty\\frac{\\cos ax-\\cos bx}{x}\\,dx=\\ln\\frac{b}{a}$.",
    "why": "On its own, $\\int\\frac{\\cos ax}{x}$ diverges at $0$; only the difference converges. Frullani gives the value directly, no complex analysis needed.",
    "steps": [
      "Product-to-sum: $\\sin3x\\sin8x=\\frac{1}{2}[\\cos5x-\\cos11x]$.",
      "Where Frullani comes from: insert $e^{-sx}$ to make it absolutely convergent, $\\int_0^\\infty e^{-sx}\\frac{\\cos ax-\\cos bx}{x}\\,dx=\\frac{1}{2}\\ln\\frac{s^2+b^2}{s^2+a^2}$; e.g. $s=1$.",
      "$s\\to0^+$: $\\frac{1}{2}\\ln\\frac{b^2}{a^2}=\\ln\\frac{b}{a}=\\ln\\frac{11}{5}$.",
      "Multiply by the leading $\\frac{1}{2}$: the answer is $\\frac{1}{2}\\ln\\frac{11}{5}$."
    ],
    "trap": "Using the wrong product-to-sum formula, $\\frac{\\cos5x+\\cos11x}{2}$, which adds two divergent integrals; or answering $\\ln\\frac{11}{5}$ and missing the $\\frac{1}{2}$.",
    "check": "The smaller $s$, the closer the integral gets to the answer: at $s=0.2$, $\\frac{1}{2}\\cdot\\frac{1}{2}\\ln\\frac{121.04}{25.04}$ is already very close to $0.394$."
  },
  "burst-boss-anti-004": {
    "spot": "$x^3$ times $\\cos2x$: the polynomial differentiates to $0$ while the trig function cycles — tabular method, with an extra $\\frac{1}{2}$ for each integration.",
    "why": "Three rounds of integration by parts fit in one table, so the signs and the powers of $\\frac{1}{2}$ line up at a glance.",
    "steps": [
      "Left column: $x^3,\\ 3x^2,\\ 6x,\\ 6$; right column, integrate $\\cos2x$ repeatedly: $\\frac{\\sin2x}{2},\\ -\\frac{\\cos2x}{4},\\ -\\frac{\\sin2x}{8},\\ \\frac{\\cos2x}{16}$.",
      "Multiply along the diagonals with alternating $+,-,+,-$: $x^3\\frac{\\sin2x}{2}+3x^2\\frac{\\cos2x}{4}-6x\\frac{\\sin2x}{8}-6\\frac{\\cos2x}{16}$.",
      "Answer: $\\frac{x^3\\sin2x}{2}+\\frac{3x^2\\cos2x}{4}-\\frac{3x\\sin2x}{4}-\\frac{3\\cos2x}{8}+C$."
    ],
    "trap": "Getting tangled when the right column's own signs stack with the alternating signs (integrating $\\cos$ twice flips the sign); the second term is often written $-\\frac{3x^2\\cos2x}{4}$, and differentiating back won't match.",
    "check": "The integrand is odd, so the antiderivative should be even (up to a constant): $F(0.7)=F(-0.7)$."
  },
  "burst-int-004": {
    "spot": "The $\\int_0^1x^a\\ln x\\,dx$ pattern — integration by parts (differentiate away the $\\ln$) or use the formula $-\\frac{1}{(a+1)^2}$ directly.",
    "why": "One round of integration by parts and you're done; the boundary term is $0$ at both $0$ and $1$.",
    "steps": [
      "$u=\\ln x$, $dv=x^5dx$: $\\left[\\frac{x^6}{6}\\ln x\\right]_0^1-\\int_0^1\\frac{x^6}{6}\\cdot\\frac{1}{x}\\,dx$. Boundary term: at $x=1$, $\\ln1=0$; as $x\\to0^+$, $x^6\\ln x\\to0$.",
      "What remains is $-\\frac{1}{6}\\int_0^1x^5\\,dx=-\\frac{1}{6}\\cdot\\frac{1}{6}$.",
      "Answer: $-\\frac{1}{36}$."
    ],
    "trap": "Forgetting that $\\ln x$ is negative on $(0,1)$ and answering $\\frac{1}{36}$.",
    "check": "$\\ln x<0$ on $(0,1)$, so the integrand is negative throughout and the answer must be negative."
  },
  "burst-rec-004": {
    "spot": "$W_n$ and $W_{n-2}$ differ by two powers — write $\\sin^nx=\\sin^{n-1}x\\cdot\\sin x$ and integrate by parts once; $\\cos^2=1-\\sin^2$ regenerates $W_n$ itself.",
    "why": "This is the derivation of the Wallis recursion: integrate by parts, then solve a linear equation — no special formulas needed.",
    "steps": [
      "By parts: $u=\\sin^{n-1}x$, $dv=\\sin x\\,dx$; the boundary term $[-\\sin^{n-1}x\\cos x]_0^{\\pi/2}=0$, leaving $(n-1)\\int_0^{\\pi/2}\\sin^{n-2}x\\cos^2x\\,dx$.",
      "$\\cos^2x=1-\\sin^2x$: $W_n=(n-1)(W_{n-2}-W_n)$.",
      "Rearrange: $nW_n=(n-1)W_{n-2}$, so $\\frac{W_n}{W_{n-2}}=\\frac{n-1}{n}$."
    ],
    "trap": "Forgetting to move the $(n-1)W_n$ over, writing $W_n=(n-1)W_{n-2}$ with a ratio above $1$ — but higher powers of $\\sin^n$ are smaller, so the ratio must be less than $1$.",
    "check": "$n=2$: $W_2=\\frac{\\pi}{4}$, $W_0=\\frac{\\pi}{2}$, ratio $\\frac{1}{2}=\\frac{2-1}{2}$."
  },
  "burst-rec-006": {
    "spot": "$B_n=W_{2n+1}$ and $B_{n-1}=W_{2n-1}$ — exactly two powers apart, so apply the Wallis recursion $\\frac{W_m}{W_{m-2}}=\\frac{m-1}{m}$ with $m=2n+1$.",
    "why": "No need to rederive it: just plug the odd power into the known recursion ratio.",
    "steps": [
      "Wallis recursion (one integration by parts, $\\cos^2=1-\\sin^2$): $\\frac{W_m}{W_{m-2}}=\\frac{m-1}{m}$.",
      "Plug in $m=2n+1$: $\\frac{B_n}{B_{n-1}}=\\frac{2n}{2n+1}$.",
      "Answer: $\\frac{2n}{2n+1}$."
    ],
    "trap": "Treating $B_{n-1}$ as $W_{2n}$ (one power apart) and getting something other than $\\frac{2n}{2n+1}$; $2(n-1)+1=2n-1$, so they differ by two powers.",
    "check": "$n=1$: $B_1=\\int\\sin^3=\\frac{2}{3}$, $B_0=\\int\\sin=1$, ratio $\\frac{2}{3}$."
  },
  "der-055": {
    "spot": "$f=x^2+y^2$ is the squared distance, $\\ge0$ everywhere and $0$ only at the origin — obviously the lowest point; confirm with the second-derivative test.",
    "why": "The second-derivative test $D=f_{xx}f_{yy}-f_{xy}^2$ is the standard tool for classifying critical points; here the graph makes it obvious too.",
    "steps": [
      "$f_x=2x$, $f_y=2y$, both $0$ at $(0,0)$, so it's a critical point.",
      "$f_{xx}=2$, $f_{yy}=2$, $f_{xy}=0$, discriminant $D=2\\cdot2-0=4>0$.",
      "$D>0$ and $f_{xx}>0$: $(0,0)$ is a local min (in fact the absolute min)."
    ],
    "trap": "Stopping at $f_x=f_y=0$ without deciding whether it's a max, a min or a saddle point.",
    "check": "Any point near the origin gives a value larger than $f(0,0)=0$; e.g. $(0.1,-0.2)$ gives $0.05$."
  },
  "der-056": {
    "spot": "$f=x^2-y^2$ curves up along $x$ and down along $y$ — the two second partials have opposite signs: a saddle.",
    "why": "A discriminant $D<0$ immediately means a saddle point; you can also see one path rising and another falling.",
    "steps": [
      "$f_x=2x$, $f_y=-2y$, both $0$ at the origin.",
      "$f_{xx}=2$, $f_{yy}=-2$, $f_{xy}=0$, $D=2\\cdot(-2)-0=-4<0$.",
      "$D<0$: $(0,0)$ is a saddle point."
    ],
    "trap": "Seeing $f_{xx}=2>0$ and calling it a min without first checking the sign of the discriminant $D$.",
    "check": "Along the $x$-axis $f(0.1,0)=0.01>0$, along the $y$-axis $f(0,0.1)=-0.01<0$: the origin is neither highest nor lowest."
  },
  "dm-seq-005": {
    "spot": "$\\pi\\sqrt{n^2+n}$ and $\\pi n$ differ by only $\\pi\\left(\\frac{1}{2}-\\frac{1}{8n}+\\cdots\\right)$, and $\\sin^2$ has period $\\pi$ — so you can drop the integer multiple $\\pi n$ and look only at the small tail.",
    "why": "$\\sqrt{n^2+n}$ itself diverges, so plugging in directly is useless; use the periodicity of $\\sin^2$ to subtract $n\\pi$, and what's left has a limit.",
    "steps": [
      "$\\sqrt{n^2+n}-n=\\frac{n}{\\sqrt{n^2+n}+n}\\to\\frac{1}{2}$; the next term, as given in the problem, is $-\\frac{1}{8n}$.",
      "$\\sin^2$ has period $\\pi$: $\\sin^2\\left(\\pi\\sqrt{n^2+n}\\right)=\\sin^2\\left(\\pi\\left(\\sqrt{n^2+n}-n\\right)\\right)$.",
      "The argument tends to $\\frac{\\pi}{2}$, so the limit $=\\sin^2\\frac{\\pi}{2}=1$."
    ],
    "trap": "Treating $\\sqrt{n^2+n}$ as $n$ (forgetting the $\\frac{1}{2}$), thinking $\\sin^2(\\pi n)=0$, and answering $0$.",
    "check": "Plug in $n=100$: $\\sin^2(\\pi\\sqrt{10100})\\approx0.99998$, already very close to $1$."
  },
  "cx-der-001": {
    "spot": "Derivative of a polynomial at a point: power rule term by term, $(x^n)'=nx^{n-1}$, then plug in $x=2$.",
    "why": "Differentiating a polynomial term by term is fastest; no need for the limit definition.",
    "steps": [
      "$f'(x)=3x^2-2$.",
      "Plug in $x=2$: $3\\cdot4-2=10$.",
      "So $f'(2)=10$."
    ],
    "trap": "Plugging in $x=2$ first to get $f(2)=4$ and then differentiating (a constant's derivative is $0$), or writing the derivative of $-2x$ as $-2x$.",
    "check": "The secant slope $\\frac{f(2.01)-f(1.99)}{0.02}\\approx10$."
  }
};
