// Detail v2, English — batch 019. Translation of tools/content/detail/019.js (text only; claims live in the Chinese file).
module.exports = {
  "tmpl-lim-factor-002": {
    "spot": "Plugging in $x=3$ gives $\\frac{0}{0}$, and the numerator $x^2-9$ is a difference of squares that hides the denominator's $x-3$.",
    "why": "Factor and cancel the factor causing the $0$, and it is one line; L'Hôpital's Rule works too, but it is overkill.",
    "steps": [
      "Plug in directly: numerator $9-9=0$, denominator $3-3=0$ — a $\\frac{0}{0}$ form.",
      "Difference of squares: $x^2-9=(x-3)(x+3)$.",
      "For $x\\ne 3$, cancel $x-3$ to leave $x+3$.",
      "$x+3$ is continuous; plugging in $x=3$ gives $6$."
    ],
    "trap": "Seeing $\\frac{0}{0}$ and saying the limit is $0$ or does not exist — $\\frac{0}{0}$ only means \"not done yet\".",
    "check": "Plug in a very close point: at $x=3.001$, $\\frac{x^2-9}{x-3}=6.001$."
  },
  "world-004": {
    "spot": "The derivative of $\\arctan x$ is a must-know formula; to derive it, let $y=\\arctan x$, rewrite as $\\tan y=x$, and use implicit differentiation.",
    "why": "The safest route for an inverse function's derivative is to switch to $\\tan y=x$, differentiate both sides, then use $\\sec^2 y=1+\\tan^2 y$ to get back to $x$.",
    "steps": [
      "Differentiate $\\tan y=x$ with respect to $x$: $\\sec^2 y\\cdot y'=1$.",
      "$\\sec^2 y=1+\\tan^2 y=1+x^2$.",
      "So $y'=\\frac{1}{1+x^2}$."
    ],
    "trap": "Mixing it up with the $\\frac{1}{\\sqrt{1-x^2}}$ of $\\arcsin x$ and writing $\\frac{1}{\\sqrt{1+x^2}}$.",
    "check": "At $x=0$ the tangent slope of $\\arctan$ is $1$ (near the origin $\\arctan x\\approx x$)."
  },
  "world-009": {
    "spot": "$\\frac{1}{n\\,3^n}=\\frac{(1/3)^n}{n}$, which is $\\sum\\frac{x^n}{n}$ at $x=\\frac13$ — the power series of $-\\ln(1-x)$.",
    "why": "Recognize a known power series and plug in; forcing the Ratio Test only tells you it converges, not the sum.",
    "steps": [
      "Integrate the geometric series $\\frac{1}{1-x}=\\sum_{n\\ge 0}x^n$ from $0$ to $x$ to get $-\\ln(1-x)=\\sum_{n\\ge 1}\\frac{x^n}{n}$ (for $|x|<1$).",
      "$x=\\frac13$ is inside the interval of convergence, so the sum is $-\\ln\\frac23$.",
      "$-\\ln\\frac23=\\ln\\frac32\\approx 0.405$."
    ],
    "trap": "Plugging in as $\\ln(1-\\frac13)=\\ln\\frac23$, losing the minus sign and getting a negative number — a series of positive terms cannot have a negative sum.",
    "check": "The first two terms $\\frac13+\\frac1{18}\\approx 0.389$ are already close to $0.405$, and smaller than it."
  },
  "app-008": {
    "spot": "Shortest distance from a point to a line — there is a ready formula $\\frac{|ax_0+by_0-c|}{\\sqrt{a^2+b^2}}$; to practice calculus, minimize $x^2+y^2$ along the line.",
    "why": "The formula is one line; with calculus, substitute $y=\\frac{10-3x}{4}$ into the squared distance and minimize a one-variable function.",
    "steps": [
      "On the line $y=\\frac{10-3x}{4}$, the squared distance is $g(x)=x^2+\\left(\\frac{10-3x}{4}\\right)^2$.",
      "$g'(x)=2x-\\frac{3}{2}\\cdot\\frac{10-3x}{4}=0$ gives $x=\\frac65$, $y=\\frac85$.",
      "$g\\left(\\frac65\\right)=\\frac{36}{25}+\\frac{64}{25}=4$.",
      "Shortest distance $\\sqrt{4}=2$."
    ],
    "trap": "Forgetting the square root in the formula's denominator and writing $\\frac{10}{25}=\\frac25$.",
    "check": "Formula: $\\frac{|0+0-10|}{\\sqrt{9+16}}=\\frac{10}{5}=2$."
  },
  "cx-rev-002": {
    "spot": "Rotating about the $x$-axis, with the region touching the $x$-axis — every cross-section is a solid disk of radius $y=x^2$.",
    "why": "Disk method $V=\\pi\\int y^2\\,dx$ integrates directly; the shell method would need solving for $x$ as $\\sqrt y$, which is more work.",
    "steps": [
      "Disk area $\\pi y^2=\\pi(x^2)^2=\\pi x^4$.",
      "$V=\\pi\\int_0^1 x^4\\,dx$.",
      "$V=\\frac{\\pi}{5}$."
    ],
    "trap": "Not squaring the radius, computing $\\pi\\int_0^1 x^2\\,dx=\\frac{\\pi}{3}$.",
    "check": "Much smaller than the enclosing cylinder (radius $1$, height $1$, volume $\\pi$) — reasonable."
  },
  "cx-ser-002": {
    "spot": "$\\frac{1}{n^2}$ is the standard $p$-series with $p=2$.",
    "why": "For a $p$-series just compare $p$ with $1$: $p>1$ converges, no other test needed.",
    "steps": [
      "$p$-series $\\sum\\frac{1}{n^p}$: converges for $p>1$, diverges for $p\\le 1$. Here $p=2$.",
      "Integral Test: $\\int_1^\\infty\\frac{1}{x^2}\\,dx=1$ is finite, so the series converges.",
      "Answer: converges (the sum is $\\frac{\\pi^2}{6}$)."
    ],
    "trap": "Thinking \"the general term goes to $0$, so it converges\", or lumping it in with the divergent $\\sum\\frac1n$.",
    "check": "The partial sums are bounded: $\\sum\\frac{1}{n^2}\\le 1+\\int_1^\\infty\\frac{dx}{x^2}=2$."
  },
  "db-itrig-001": {
    "spot": "$\\arcsin$ wraps $\\frac x2$: outer formula $\\frac{1}{\\sqrt{1-u^2}}$, and the inner part gives $\\frac12$.",
    "why": "One step of the Chain Rule; at the end, push the $\\frac12$ into the root to tidy up to $\\frac{1}{\\sqrt{4-x^2}}$.",
    "steps": [
      "Let $u=\\frac x2$: $\\frac{d}{dx}\\arcsin u=\\frac{1}{\\sqrt{1-u^2}}\\cdot\\frac12$.",
      "$\\frac12\\cdot\\frac{1}{\\sqrt{1-\\frac{x^2}{4}}}=\\frac{1}{2\\sqrt{\\frac{4-x^2}{4}}}=\\frac{1}{\\sqrt{4-x^2}}$.",
      "Answer: $\\frac{1}{\\sqrt{4-x^2}}$."
    ],
    "trap": "Forgetting the inner $\\frac12$ and writing $\\frac{1}{\\sqrt{1-x^2/4}}=\\frac{2}{\\sqrt{4-x^2}}$, off by a factor of two.",
    "check": "At $x=0$, $\\arcsin\\frac x2\\approx\\frac x2$, so the slope should be $\\frac12$."
  },
  "dd-def-005": {
    "spot": "The shape $\\frac{f(3+h)-f(3)}{h}$ with $f=\\ln$ — this is the derivative of $\\ln x$ at $x=3$; no need to actually compute a limit.",
    "why": "Recognize the definition of the derivative and apply $(\\ln x)'=\\frac1x$; forcing L'Hôpital's Rule is really differentiating $\\ln$ anyway.",
    "steps": [
      "$\\lim_{h\\to0}\\frac{\\ln(3+h)-\\ln 3}{h}=f'(3)$, with $f(x)=\\ln x$.",
      "$f'(x)=\\frac1x$; at $x=3$ this is $\\frac13$.",
      "Limit $=\\frac13$."
    ],
    "trap": "Splitting the numerator wrongly, as $\\ln h$ or $\\ln(3+h)-\\ln 3=\\ln h$, and getting nowhere.",
    "check": "Plug in $h=0.001$: $\\frac{\\ln 3.001-\\ln 3}{0.001}\\approx 0.33328$."
  },
  "dd-lin-002": {
    "spot": "$101$ is right next to the perfect square $100$: use the tangent line of $f(x)=\\sqrt x$ at $a=100$.",
    "why": "Expanding at an easy point leaves only a second-order error; computing the square root by hand is too slow.",
    "steps": [
      "$f(100)=10$, $f'(x)=\\frac{1}{2\\sqrt x}$, $f'(100)=\\frac{1}{20}$.",
      "Tangent line $L(x)=10+\\frac{1}{20}(x-100)$.",
      "$L(101)=10+\\frac{1}{20}=10.05$."
    ],
    "trap": "Forgetting the $\\frac12$ in the derivative, using $\\frac{1}{\\sqrt{100}}=\\frac{1}{10}$, and getting $10.1$.",
    "check": "The true value is $\\sqrt{101}\\approx 10.0499$; the tangent lies above a concave function, so the estimate is slightly high. It matches."
  },
  "dd-pw-001": {
    "spot": "$\\sqrt{x^2}=|x|$ — near $x=-3$, $|x|=-x$, a straight line with slope $-1$.",
    "why": "Rewriting as $|x|$ and splitting into cases is less sign-error-prone than computing $\\frac{x}{\\sqrt{x^2}}$ with the Chain Rule.",
    "steps": [
      "$\\sqrt{x^2}=|x|$, not $x$.",
      "For $x<0$, $|x|=-x$, with derivative $-1$.",
      "Chain Rule comparison: $\\frac{2x}{2\\sqrt{x^2}}=\\frac{x}{|x|}$, which is $-1$ at $x=-3$."
    ],
    "trap": "Simplifying $\\sqrt{x^2}$ straight to $x$ and getting derivative $1$.",
    "check": "Moving a bit right of $x=-3$ makes the value smaller: $f(-2.9)=2.9<f(-3)=3$, so the function is decreasing and the slope is negative."
  },
  "dd-rr-012": {
    "spot": "East and north are perpendicular, so the distance between the cars is the hypotenuse of a right triangle; both legs grow at constant rates, so the distance is itself a linear function of $t$.",
    "why": "Write out $s(t)$ and differentiate; related rates via $s\\,s'=x\\,x'+y\\,y'$ also works and gives the same result.",
    "steps": [
      "After $t$ hours, $x=60t$, $y=80t$, and $s=\\sqrt{(60t)^2+(80t)^2}=100t$.",
      "Related rates: $s\\,s'=x\\,x'+y\\,y'=120\\cdot 60+160\\cdot 80=20000$.",
      "$s'=\\frac{20000}{200}=100$ km/h."
    ],
    "trap": "Simply adding the speeds to get $140$; the cars move at right angles, so you need the Pythagorean theorem.",
    "check": "The speeds also form a $3:4:5$ triangle: $\\sqrt{60^2+80^2}=100$; when separating at constant velocities, the rate of change of distance does not change over time."
  },
  "fd-serx-201": {
    "spot": "The factors of the denominator $n(n+3)$ differ by $3$ — after partial fractions it is a telescoping series where terms cancel three apart.",
    "why": "Split into $\\frac13\\left(\\frac1n-\\frac1{n+3}\\right)$; only the first three positive terms survive.",
    "steps": [
      "$\\frac{1}{n(n+3)}=\\frac13\\left(\\frac1n-\\frac1{n+3}\\right)$.",
      "When summing, every $\\frac1k$ from $\\frac14$ on is canceled by a later $-\\frac1k$, leaving $1+\\frac12+\\frac13=\\frac{11}{6}$.",
      "Sum $=\\frac13\\cdot\\frac{11}{6}=\\frac{11}{18}$."
    ],
    "trap": "Assuming, as with $\\frac{1}{n(n+1)}$, that only the first term survives, and answering $\\frac13$.",
    "check": "First term $\\frac14$, first two terms $\\frac14+\\frac1{10}=0.35$; the total $\\approx 0.611$ is bigger than these partial sums, which makes sense."
  },
  "fd-serx-202": {
    "spot": "The denominator is two consecutive odd numbers $(2n+1)(2n+3)$, differing by $2$ — after partial fractions, neighboring terms cancel.",
    "why": "A telescoping series leaves only the first term; no need to establish convergence before summing.",
    "steps": [
      "$\\frac{1}{(2n+1)(2n+3)}=\\frac12\\left(\\frac1{2n+1}-\\frac1{2n+3}\\right)$.",
      "Starting from $n=1$: $\\frac12\\left(\\frac13-\\frac15+\\frac15-\\frac17+\\cdots\\right)$, leaving only $\\frac13$.",
      "Sum $=\\frac12\\cdot\\frac13=\\frac16$."
    ],
    "trap": "Starting from the $n=0$ habit, taking the surviving first term as $1$, and answering $\\frac12$.",
    "check": "The first term is $\\frac{1}{15}\\approx 0.067$ and the total is $\\frac16\\approx 0.167$; later terms decay quickly, so the size is reasonable."
  },
  "int-009": {
    "spot": "$x$ times $\\ln x$: $\\ln x$ has no easy antiderivative, but its derivative is $\\frac1x$ — integration by parts with $u=\\ln x$.",
    "why": "Let $\\ln x$ get differentiated away, leaving the polynomial $\\frac1x\\cdot\\frac{x^2}{2}=\\frac x2$; the other choice gets messier with each step.",
    "steps": [
      "$u=\\ln x$, $dv=x\\,dx$, so $du=\\frac1x\\,dx$, $v=\\frac{x^2}{2}$.",
      "$\\int x\\ln x\\,dx=\\frac{x^2}{2}\\ln x-\\int\\frac{x^2}{2}\\cdot\\frac1x\\,dx$.",
      "$\\int\\frac x2\\,dx=\\frac{x^2}{4}$.",
      "Result: $\\frac{x^2}{2}\\ln x-\\frac{x^2}{4}+C$."
    ],
    "trap": "Choosing $u=x$, $dv=\\ln x\\,dx$, which forces you to integrate $\\ln x$ first — a long detour.",
    "check": "Differentiate back: $x\\ln x+\\frac x2-\\frac x2=x\\ln x$."
  },
  "int-014": {
    "spot": "The numerator degree $3$ exceeds the denominator's $2$ — do long division first; the leftover $\\frac{x}{x^2+1}$ has a numerator that is exactly half the denominator's derivative.",
    "why": "An improper rational function always gets divided first; after dividing, both terms integrate at a glance.",
    "steps": [
      "Long division: $\\frac{x^3}{x^2+1}=x-\\frac{x}{x^2+1}$.",
      "$\\int x\\,dx=\\frac{x^2}{2}$.",
      "$\\int\\frac{x}{x^2+1}\\,dx=\\frac12\\ln(x^2+1)$ (let $u=x^2+1$).",
      "Result: $\\frac{x^2}{2}-\\frac12\\ln(x^2+1)+C$."
    ],
    "trap": "Substituting $u=x^2+1$ directly without replacing $x^2=u-1$, or skipping the division and treating it as a $\\ln$ type, writing something like $\\ln(x^2+1)$.",
    "check": "Differentiate back: $x-\\frac{x}{x^2+1}=\\frac{x^3}{x^2+1}$."
  },
  "int-015": {
    "spot": "$e^x$ times $\\sin x$: both functions return to themselves (up to sign) after two derivatives — integrate by parts twice and the original integral comes back around.",
    "why": "Once it comes back, solve the equation for it; more systematic than guessing the form of the antiderivative.",
    "steps": [
      "First round of parts ($u=\\sin x$, $dv=e^x dx$): $I=e^x\\sin x-\\int e^x\\cos x\\,dx$.",
      "Second round ($u=\\cos x$): $\\int e^x\\cos x\\,dx=e^x\\cos x+\\int e^x\\sin x\\,dx=e^x\\cos x+I$.",
      "$I=e^x\\sin x-e^x\\cos x-I$, so moving terms over gives $2I=e^x(\\sin x-\\cos x)$.",
      "$I=\\frac{e^x(\\sin x-\\cos x)}{2}+C$."
    ],
    "trap": "Swapping the roles of $u$ and $dv$ in the second round (letting $u=e^x$ instead), which gives the identity $I=I$ — a full lap for nothing.",
    "check": "Differentiate back: $\\frac{e^x(\\sin x-\\cos x)+e^x(\\cos x+\\sin x)}{2}=e^x\\sin x$."
  },
  "int-018": {
    "spot": "The numerator $\\sin x$ is exactly the derivative of the denominator $1+\\cos x$, up to a minus sign — the $\\int\\frac{u'}{u}$ type.",
    "why": "Let $u=1+\\cos x$ and it becomes $-\\int\\frac{du}{u}$ in one step; no half-angle formulas needed.",
    "steps": [
      "$u=1+\\cos x$, $du=-\\sin x\\,dx$.",
      "$\\int\\frac{\\sin x}{1+\\cos x}\\,dx=-\\int\\frac{du}{u}=-\\ln|u|$.",
      "$1+\\cos x\\ge 0$, so the result is $-\\ln(1+\\cos x)+C$."
    ],
    "trap": "Missing the minus sign in $du=-\\sin x\\,dx$ and writing $\\ln(1+\\cos x)$.",
    "check": "Another route: $\\frac{\\sin x}{1+\\cos x}=\\tan\\frac x2$, and $\\int\\tan\\frac x2\\,dx=-2\\ln|\\cos\\frac x2|$; since $1+\\cos x=2\\cos^2\\frac x2$, the two differ only by a constant."
  },
  "lim-007": {
    "spot": "As $x\\to0$, $\\tan(4x)\\approx 4x$ and $\\sin(2x)\\approx 2x$ — a ratio of two \"small-angle\" functions, so only the ratio of the angles matters.",
    "why": "Build the two standard limits $\\frac{\\tan u}{u}$ and $\\frac{\\sin v}{v}$, both tending to $1$; one fewer differentiation than L'Hôpital's Rule.",
    "steps": [
      "Rewrite: $\\frac{\\tan 4x}{\\sin 2x}=\\frac{\\tan 4x}{4x}\\cdot\\frac{2x}{\\sin 2x}\\cdot\\frac{4x}{2x}$.",
      "The first two factors both $\\to 1$.",
      "What is left is $\\frac{4x}{2x}=2$."
    ],
    "trap": "Thinking $\\tan$ and $\\sin$ cannot be compared directly because they are different, or flipping the coefficient ratio to $\\frac12$.",
    "check": "At $x=0.001$ the ratio is about $2.000012$."
  },
  "lim-037": {
    "spot": "A root minus $1$ giving $\\frac00$ — rationalize (multiply by the conjugate $\\sqrt{1+4x}+1$), or recognize it as the derivative of $\\sqrt{1+4x}$ at $0$.",
    "why": "After multiplying by the conjugate, the $x$ cancels directly; no differentiation needed.",
    "steps": [
      "Multiply by $\\frac{\\sqrt{1+4x}+1}{\\sqrt{1+4x}+1}$: the numerator becomes $(1+4x)-1=4x$.",
      "Cancel $x$: $\\frac{4}{\\sqrt{1+4x}+1}$.",
      "Plug in $x=0$: $\\frac{4}{2}=2$."
    ],
    "trap": "Multiplying only the numerator by the conjugate and not the denominator, or computing $(\\sqrt{1+4x})^2$ as $1+16x^2$.",
    "check": "As a derivative: $\\frac{d}{dx}\\sqrt{1+4x}=\\frac{2}{\\sqrt{1+4x}}$, which is $2$ at $x=0$."
  },
  "lm-os-002": {
    "spot": "The exponent $-\\frac{1}{x^2}$ rushes to $-\\infty$ from both sides as $x\\to0$ — no need to split left and right; $e^{-\\infty}=0$.",
    "why": "The outer $e^u$ is continuous, so find the limit of the exponent first and plug it in; the $x^2$ makes both sides agree.",
    "steps": [
      "Let $u=-\\frac{1}{x^2}$; as $x\\to0$, $x^2\\to0^+$, so $u\\to-\\infty$. For example, at $x=0.1$, $u=-100$.",
      "As $u\\to-\\infty$, $e^u$ goes $\\to0$: at $x=0.1$ it is already $e^{-100}$.",
      "The limit is $0$."
    ],
    "trap": "Treating it like $e^{-1/x}$ and splitting sides, thinking the right side $\\to0$ and the left side $\\to\\infty$, and answering \"does not exist\" — the square makes both sides the same sign.",
    "check": "Left-right symmetric: at $x=\\pm 0.2$ both give $e^{-25}\\approx 1.4\\times 10^{-11}$."
  },
  "lm-os-006": {
    "spot": "The base tends to $0$ and the exponent $\\frac{1}{\\ln x}$ tends to $0$: a $0^0$ form — after taking $\\ln$, the $\\ln x$ cancels exactly with the $\\ln x$ in the denominator.",
    "why": "When the variable is in both base and exponent, always rewrite as $e^{(\\cdots)\\ln(\\cdots)}$; here you do not even need a limit, since the exponent is identically $1$.",
    "steps": [
      "$x^{1/\\ln x}=e^{\\frac{1}{\\ln x}\\cdot\\ln x}$.",
      "The exponent is $\\frac{\\ln x}{\\ln x}=1$ (for $0<x<1$, $\\ln x\\ne0$).",
      "So the function is identically $e$, and the limit $=e$."
    ],
    "trap": "Seeing $0^{\\text{something}}$ and answering $0$, or seeing the exponent $\\to0$ and answering $1$ — $0^0$ is an indeterminate form.",
    "check": "Check at any point: at $x=0.5$, $0.5^{1/\\ln 0.5}=e$."
  },
  "lm-rs-014": {
    "spot": "In the denominator $n^2+k$, $k$ is at most $n$, an order of magnitude smaller than $n^2$ — Squeeze Theorem: replace the denominator with $n^2$ and $n^2+n$.",
    "why": "The $k$ perturbation in the denominator keeps it from being a standard Riemann sum; squeezing it between two computable sums is cleaner than forcing it into an integral.",
    "steps": [
      "$n^2\\le n^2+k\\le n^2+n$, so $\\sum\\frac{k}{n^2+n}\\le S_n\\le\\sum\\frac{k}{n^2}$.",
      "$\\sum_{k=1}^{n}k=\\frac{n(n+1)}{2}$: upper bound $\\frac{n+1}{2n}$, lower bound $\\frac{n(n+1)/2}{n(n+1)}=\\frac12$.",
      "Both bounds tend to $\\frac12$, so the limit $=\\frac12$ (which is $\\int_0^1 x\\,dx$)."
    ],
    "trap": "Treating $k$ as the same order as $n^2$, or writing $\\frac1n\\sum\\frac{k/n}{1+k/n}$ and getting $\\int_0^1\\frac{x}{1+x}dx=1-\\ln2$ — the $k$ in the denominator is really $\\frac{k}{n^2}$, not $\\frac kn$.",
    "check": "For $n=1$ the sum is $\\frac12$, for $n=2$ it is $\\frac15+\\frac13\\approx 0.533$ — both near $\\frac12$, and squeezed between $\\frac12$ and $\\frac{n+1}{2n}$."
  },
  "mob-conv-010": {
    "spot": "The general term $\\frac{n+1}{3n+2}$ has equal degrees on top and bottom, so it tends to $\\frac13$, not $0$ — the $n$-th term test settles divergence directly.",
    "why": "When the general term does not tend to $0$, no other test is needed; this is the first thing to check.",
    "steps": [
      "$\\lim_{n\\to\\infty}\\frac{n+1}{3n+2}=\\frac13$.",
      "$\\frac13\\ne0$, so the series must diverge: the sum of the first $N$ terms is at least on the order of $\\frac{N}{3}$, since every term exceeds $\\frac13$.",
      "Answer: diverges."
    ],
    "trap": "Reaching for the Ratio Test: the ratio $\\to1$ is inconclusive and you are stuck; or thinking \"every term is less than $1$\" means it converges.",
    "check": "The first $100$ terms already sum to more than $33$: every term is $>\\frac13$."
  },
  "mob-tech-004": {
    "spot": "A polynomial $x$ times $\\ln x$ — differentiating $\\ln x$ gives something simple like $\\frac1x$; textbook integration by parts.",
    "why": "Choose $u=\\ln x$ so the log gets differentiated away; substitution has no trace of $u'$ to work with.",
    "steps": [
      "$u=\\ln x$ differentiates down to $\\frac1x$, and $dv=x\\,dx$ integrates to $\\frac{x^2}{2}$ — nothing gets worse.",
      "$\\int x\\ln x\\,dx=\\frac{x^2}{2}\\ln x-\\int\\frac x2\\,dx=\\frac{x^2}{2}\\ln x-\\frac{x^2}{4}+C$.",
      "Answer: integration by parts."
    ],
    "trap": "Trying the substitution $u=\\ln x$: $du=\\frac{dx}{x}$, but there is no $\\frac1x$ in the integrand, and you end up with an extra $x^2=e^{2u}$.",
    "check": "Differentiating back works: $x\\ln x+\\frac x2-\\frac x2=x\\ln x$."
  },
  "mob-trap-002": {
    "spot": "Inside the $\\cos$ is $3x$, not $x$ — the integral must be divided by the inner coefficient $3$.",
    "why": "Reverse Chain Rule: differentiating $\\sin 3x$ produces an extra $3$, so integration has to divide it out first.",
    "steps": [
      "$\\frac{d}{dx}\\sin 3x=3\\cos 3x$, with an extra $3$.",
      "So $\\int\\cos 3x\\,dx=\\frac{\\sin 3x}{3}+C$.",
      "Answer: divide by the inner coefficient $3$; forgetting makes it three times too big."
    ],
    "trap": "Writing $\\sin 3x+C$; its derivative is $3\\cos 3x$, three times too big.",
    "check": "Definite-integral check: $\\int_0^{\\pi/6}\\cos 3x\\,dx=\\frac13$."
  },
  "mob-trap-010": {
    "spot": "$\\sec x\\tan x$ is exactly the $(\\sec x)'$ line of the derivative table — read it backwards and the antiderivative is $\\sec x$.",
    "why": "Just recognize the formula; rewriting as $\\frac{\\sin x}{\\cos^2x}$ and substituting also works, but takes the long way.",
    "steps": [
      "$\\sec x=\\frac{1}{\\cos x}$, $(\\sec x)'=\\frac{\\sin x}{\\cos^2 x}=\\sec x\\tan x$.",
      "So $\\int\\sec x\\tan x\\,dx=\\sec x+C$.",
      "Answer: $\\sec x$ (the trap is reaching for the formulas for $\\tan x$ or $\\sec^2 x$)."
    ],
    "trap": "Mixing it up with $(\\tan x)'=\\sec^2 x$ and answering $\\tan x$ or $\\frac{\\sec^2 x}{2}$.",
    "check": "Definite integral: $\\int_0^{\\pi/3}\\sec x\\tan x\\,dx=\\sec\\frac\\pi3-\\sec 0=2-1=1$."
  },
  "ode-val-001": {
    "spot": "$y'=y$: the derivative equals the function itself — the defining property of $e^x$.",
    "why": "Separate variables, $\\frac{dy}{y}=dx$, integrate in one step, then use the initial value to fix the constant.",
    "steps": [
      "Separate variables: $\\int\\frac{dy}{y}=\\int dx$, $\\ln|y|=x+C$, $y=Ae^x$.",
      "$y(0)=A=1$, so $y=e^x$.",
      "$y(1)=e\\approx 2.718$."
    ],
    "trap": "Dropping the constant after integrating, or writing $y=e^x+C$ and getting $C=0$ from the initial value — right by luck this time, but wrong when $y(0)=2$ (it should be $2e^x$).",
    "check": "Rough Euler's method estimate: $n$ steps of size $\\frac1n$ give $(1+\\frac1n)^n$, about $2.717$ for $n=1000$, approaching $e$."
  },
  "refine-integrals-010": {
    "spot": "$\\int(2f+1)$ — split by linearity into $2\\int f+\\int 1$; read $\\int f$ off the graph as the signed area of the triangles.",
    "why": "No need to write the equation of each segment; counting area from the picture is fastest.",
    "steps": [
      "On $[0,4]$ it is a triangle with base $4$ and height $2$, area $+4$.",
      "On $[4,6]$ it is below the $x$-axis, base $2$, height $2$, signed area $-2$; so $\\int_0^6 f=2$.",
      "$\\int_0^6 1\\,dx=6$ (the interval length).",
      "$2\\cdot 2+6=10$."
    ],
    "trap": "Forgetting to integrate the $+1$ and getting $4$; or counting the area below the $x$-axis as positive, so $\\int f=6$ and the answer is $18$.",
    "check": "The average of $2f+1$ on $[0,6]$ is $\\frac{10}{6}$, between the minimum $-3$ and the maximum $5$."
  },
  "refine-series-011": {
    "spot": "$\\sum\\frac{1}{n^2}$ converges — the original series converges absolutely, not conditionally.",
    "why": "The Riemann rearrangement theorem only threatens conditionally convergent series; an absolutely convergent series keeps the same sum under any rearrangement.",
    "steps": [
      "Take absolute values: $\\sum\\frac{1}{n^2}=\\frac{\\pi^2}{6}$ is finite, so the original series converges absolutely.",
      "The positive part (reciprocals of odd squares) and the negative part (reciprocals of even squares) each converge: $\\frac{\\pi^2}{8}$ and $\\frac{\\pi^2}{24}$.",
      "Rearranging only changes the order in which positive and negative terms are used, and both piles get used up: sum $=\\frac{\\pi^2}{8}-\\frac{\\pi^2}{24}=\\frac{\\pi^2}{12}$."
    ],
    "trap": "Confusing it with the rearrangement of $\\sum\\frac{(-1)^{n+1}}{n}$ (\"two positives, one negative\" makes the sum $\\frac32\\ln2$) and thinking the sum changes.",
    "check": "$\\frac{\\pi^2}{12}\\approx 0.822$, between the first two partial sums $1$ and $1-\\frac14=0.75$."
  },
  "rel-basic-012": {
    "spot": "$x$ times $\\ln x$ — Product Rule; at $x=1$, $\\ln 1=0$ makes one term vanish.",
    "why": "Product Rule, compute each of the two terms once; before plugging in, notice $\\ln 1=0$ to save work.",
    "steps": [
      "$(x\\ln x)'=1\\cdot\\ln x+x\\cdot\\frac1x=\\ln x+1$.",
      "Plug in $x=1$: $\\ln 1+1=0+1$.",
      "Answer: $1$."
    ],
    "trap": "Differentiating only one factor, writing $(x\\ln x)'=\\frac1x\\cdot 1$ or $\\ln x$, and getting $0$ at $x=1$.",
    "check": "Secant: $\\frac{1.001\\ln 1.001-0}{0.001}\\approx 1.0005$."
  },
  "si-int-002": {
    "spot": "An even root — the inside must be $\\ge0$: solve $4-x^2\\ge0$.",
    "why": "The domain is a single inequality; the quadratic inequality opens straight up to $|x|\\le2$.",
    "steps": [
      "Need $4-x^2\\ge0$, that is, $x^2\\le4$.",
      "$x^2\\le4\\iff -2\\le x\\le2$.",
      "At the endpoints the inside is $0$, and $\\sqrt0=0$ is defined, so include both: the domain is $[-2,2]$."
    ],
    "trap": "Solving only $x\\le2$ and writing $(-\\infty,2]$, or leaving the endpoints out and writing $(-2,2)$.",
    "check": "The graph is the upper half circle of radius $2$, running exactly from $-2$ to $2$."
  },
  "si-int-003": {
    "spot": "The only taboo for a fraction is a denominator equal to $0$: remove the point where $x-3=0$.",
    "why": "No roots, no logs — just remove one point.",
    "steps": [
      "Denominator $x-3=0\\iff x=3$.",
      "Every other point is defined, for example $x=2$ and $x=4$.",
      "The domain is $(-\\infty,3)\\cup(3,\\infty)$, that is, all real numbers except $3$."
    ],
    "trap": "Writing $(3,\\infty)$, mistaking \"denominator nonzero\" for \"denominator positive\".",
    "check": "$x=3$ is a vertical asymptote: the two sides shoot off to $\\pm\\infty$."
  },
  "si-int-016": {
    "spot": "Asking where a cubic is increasing — look at the sign of $f'(x)=3x^2-6x=3x(x-2)$; the critical points $0$ and $2$ cut the number line into three pieces.",
    "why": "An upward-opening quadratic is positive outside its two roots, so no need to test each piece.",
    "steps": [
      "$f'(x)=3x^2-6x=3x(x-2)$.",
      "Zeros at $x=0$ and $x=2$.",
      "Outside the roots $f'>0$, between them $f'<0$.",
      "Increasing on: $(-\\infty,0)\\cup(2,\\infty)$."
    ],
    "trap": "Giving the middle piece $(0,2)$, where $f'<0$, as the answer.",
    "check": "$f(0)=0$ is a local max and $f(2)=-4$ a local min, matching \"increase, decrease, increase\"."
  },
  "si-set-019": {
    "spot": "Inflection points are where $f''$ changes sign; for a cubic, $f''$ is linear with only one root.",
    "why": "A linear $f''$ always changes sign at its root, so no extra check is needed.",
    "steps": [
      "$f'(x)=3x^2-12x+9$.",
      "$f''(x)=6x-12$, zero at $x=2$.",
      "Sign change: concave down for $x<2$, concave up for $x>2$.",
      "The only inflection point has $x$-coordinate $2$."
    ],
    "trap": "Solving $f'=0$ to get $x=1,3$ and calling the extrema inflection points.",
    "check": "A cubic's graph is symmetric about its inflection point: the midpoint of the two critical points $1$ and $3$ is exactly $2$."
  },
  "tb-area-001": {
    "spot": "The parabola $y=x^2$ and the line $y=2x$ enclose a region — find the intersections for the limits, then \"top minus bottom\".",
    "why": "One integral in $x$ suffices; the line is on top and the parabola below, and they never switch on the whole of $[0,2]$.",
    "steps": [
      "Intersections: $x^2=2x\\iff x=0,2$.",
      "On $(0,2)$, $2x>x^2$ (for example at $x=1$: $2>1$).",
      "$A=\\int_0^2(2x-x^2)\\,dx=4-\\frac83=\\frac43$."
    ],
    "trap": "Flipping top and bottom to get $-\\frac43$, or integrating only $\\int_0^2 x^2\\,dx=\\frac83$ and forgetting to subtract.",
    "check": "A parabolic segment has $\\frac23$ the area of its bounding rectangle: $2x-x^2$ peaks at $1$ on $[0,2]$, the rectangle is $2\\times 1$, and $\\frac23\\cdot 2=\\frac43$."
  },
  "tb-area-004": {
    "spot": "$y=x$ and $y=x^3$ meet at $0$ and $1$ in the first quadrant; in between, $x>x^3$.",
    "why": "Top minus bottom, integrate directly; restricting to the first quadrant leaves only $[0,1]$, so $[-1,0]$ is not needed.",
    "steps": [
      "Intersections: $x=x^3\\iff x=0,\\pm1$; in the first quadrant take $[0,1]$.",
      "For $0<x<1$, $x>x^3$.",
      "$A=\\int_0^1(x-x^3)\\,dx=\\frac12-\\frac14=\\frac14$."
    ],
    "trap": "Thinking $x^3$ is bigger, flipping top and bottom, and getting $-\\frac14$; or taking the signed integral $0$ over all of $[-1,1]$ as the area.",
    "check": "Smaller than the triangle under $y=x$ (area $\\frac12$), and roughly half of it — reasonable."
  },
  "tb-avg-003": {
    "spot": "Average value of a function on an interval $=\\frac{1}{b-a}\\int_a^b f$; here the interval length happens to be $1$.",
    "why": "Apply the formula directly; the antiderivative of $\\frac{1}{x^2}$ is $-\\frac1x$.",
    "steps": [
      "$\\int_1^2\\frac{1}{x^2}\\,dx=\\left[-\\frac1x\\right]_1^2=-\\frac12+1=\\frac12$.",
      "Divide by the interval length $2-1=1$.",
      "Average value $\\frac12$."
    ],
    "trap": "Averaging the endpoint values, $\\frac{1+\\frac14}{2}=\\frac58$ — that is not the average value of the function.",
    "check": "The average must lie between the minimum $\\frac14$ and the maximum $1$, and $\\frac{1}{x^2}=\\frac12$ is attained at $x=\\sqrt2\\in[1,2]$ (Mean Value Theorem for integrals)."
  },
  "tb-imp-001": {
    "spot": "The circle $x^2+y^2=13$ cannot be solved for a single $y(x)$ — use implicit differentiation, treating $y$ as a function of $x$.",
    "why": "Implicit differentiation gives $\\frac{dy}{dx}=-\\frac xy$ in one line, faster than splitting into $\\sqrt{13-x^2}$ and differentiating, and no sign to choose.",
    "steps": [
      "Differentiate both sides with respect to $x$: $2x+2y\\,y'=0$.",
      "$y'=-\\frac{x}{y}$.",
      "At $(2,3)$: $y'=-\\frac23$."
    ],
    "trap": "Forgetting to multiply by $y'$ when differentiating $y^2$, writing $2x+2y=0$, and being unable to find $y'$.",
    "check": "The tangent is perpendicular to the radius: the radius has slope $\\frac32$, and times $-\\frac23$ that gives $-1$."
  },
  "tb-lin-002": {
    "spot": "$1.02$ is right next to $1$: the tangent line of $f(x)=x^{10}$ at $a=1$, i.e. $(1+h)^{10}\\approx 1+10h$.",
    "why": "Expanding near $1$, the derivative of the power is immediate; a full binomial expansion is too slow.",
    "steps": [
      "$f(1)=1$, $f'(x)=10x^9$, $f'(1)=10$.",
      "Tangent line $L(x)=1+10(x-1)$.",
      "$L(1.02)=1+10\\cdot0.02=1.2$."
    ],
    "trap": "Forgetting to multiply by the derivative and estimating $1.02^{10}$ as $1+0.02=1.02$; or writing $1.02\\times 10=10.2$.",
    "check": "The true value is $1.02^{10}\\approx 1.219$; $x^{10}$ is concave up, so the tangent lies below and the estimate is low. It matches."
  },
  "tb-lin-003": {
    "spot": "$3.98$ is right next to the perfect square $4$: use the tangent line of $\\sqrt x$ at $a=4$.",
    "why": "Expand at an easy point; it is only $-0.02$ away, so the error is a tiny second-order amount.",
    "steps": [
      "$f(4)=2$, $f'(4)=\\frac{1}{2\\sqrt4}=\\frac14$.",
      "Tangent line $L(x)=2+\\frac14(x-4)$.",
      "$L(3.98)=2-\\frac{0.02}{4}=1.995$."
    ],
    "trap": "Losing the minus sign in $x-4=-0.02$ and getting $2.005$.",
    "check": "The true value is $\\sqrt{3.98}\\approx 1.99499$, slightly below the estimate (the tangent lies above a concave function)."
  },
  "tb-mvt-001": {
    "spot": "Mean Value Theorem: find $c$ such that the tangent slope $f'(c)=3c^2$ equals the secant slope $\\frac{f(2)-f(1)}{2-1}$.",
    "why": "The secant slope is a number, so solve one quadratic equation and pick the root in $(1,2)$.",
    "steps": [
      "Secant slope $\\frac{8-1}{2-1}=7$.",
      "$3c^2=7$, $c=\\pm\\sqrt{\\frac73}$.",
      "Only the positive root $\\sqrt{\\frac73}\\approx 1.528$ lies in $(1,2)$."
    ],
    "trap": "Also listing the negative root $-\\sqrt{\\frac73}$; or computing the secant slope as $f(2)-f(1)$ divided by $2$.",
    "check": "$c\\approx1.528$ is a bit right of the interval's midpoint, because $x^3$ gets steeper to the right."
  },
  "tb-opt-001": {
    "spot": "Fixed perimeter, maximize area — one side $x$, the other $12-x$, and the area is a downward-opening quadratic.",
    "why": "One-variable maximization; the conclusion is a square ($x=6$).",
    "steps": [
      "$2(x+y)=24\\Rightarrow y=12-x$, $A(x)=x(12-x)$, $0<x<12$.",
      "$A'(x)=12-2x=0\\Rightarrow x=6$.",
      "$A''=-2<0$, so it is a maximum.",
      "Maximum area $6\\cdot6=36$."
    ],
    "trap": "Treating the perimeter $24$ as the sum of two sides, writing $y=24-x$, and getting $144$.",
    "check": "Complete the square: $x(12-x)=36-(x-6)^2\\le 36$."
  },
  "tb-rev-001": {
    "spot": "Rotating about the $x$-axis, region touching the $x$-axis — disk method with radius $y=x+1$; the solid is actually a frustum of a cone.",
    "why": "$V=\\pi\\int_0^1 (x+1)^2\\,dx$ integrates directly; the frustum formula can confirm the answer.",
    "steps": [
      "$V=\\pi\\int_0^1(x+1)^2\\,dx$.",
      "$\\int_0^1(x+1)^2\\,dx=\\left[\\frac{(x+1)^3}{3}\\right]_0^1=\\frac{8-1}{3}=\\frac73$.",
      "$V=\\frac{7\\pi}{3}$."
    ],
    "trap": "Expanding $(x+1)^2$ as $x^2+1$, missing the $2x$, and getting $\\frac{4\\pi}{3}$.",
    "check": "Frustum formula $\\frac{\\pi h}{3}(R^2+Rr+r^2)=\\frac{\\pi}{3}(4+2+1)$."
  },
  "tb-rev-003": {
    "spot": "$y=2x$ rotated about the $x$-axis: disk method with radius $2x$; the solid is a cone with base radius $2$ and height $1$.",
    "why": "The disk method is one line; the cone formula $\\frac13\\pi r^2h$ confirms the answer exactly.",
    "steps": [
      "$V=\\pi\\int_0^1(2x)^2\\,dx=4\\pi\\int_0^1 x^2\\,dx$.",
      "$4\\pi\\cdot\\frac13=\\frac{4\\pi}{3}$.",
      "Answer: $\\frac{4\\pi}{3}$."
    ],
    "trap": "Dropping the coefficient when squaring the radius, writing $(2x)^2$ as $2x^2$, and getting $\\frac{2\\pi}{3}$.",
    "check": "Cone volume $\\frac13\\pi r^2h=\\frac13\\pi\\cdot4\\cdot1$."
  },
  "td-der-002": {
    "spot": "Just a polynomial times the constant $\\frac18$ — Power Rule term by term; the constant $3$ differentiates away.",
    "why": "Pull the constant multiple out and multiply at the end; the algebra stays cleanest.",
    "steps": [
      "$\\frac{d}{dx}(35x^4-30x^2+3)=140x^3-60x$.",
      "Multiply by $\\frac18$: $\\frac{140x^3-60x}{8}=\\frac{35x^3-15x}{2}$.",
      "Answer: $\\frac{35x^3-15x}{2}$."
    ],
    "trap": "Forgetting to multiply by $\\frac18$, or differentiating the constant $3$ to $3$.",
    "check": "At $x=1$: near $1$, the derivative is $\\frac{35-15}{2}=10$."
  },
  "tmpl-der-chain-exp-001": {
    "spot": "The exponent of $e$ is $2x^2$, not $x$ — Chain Rule: the outer $e^u$ stays the same, and the inner $2x^2$ gives $4x$.",
    "why": "The Chain Rule for $e^u$ is just \"itself times the inner derivative\", done in one step.",
    "steps": [
      "Let $u=2x^2$, $u'=4x$.",
      "$\\frac{d}{dx}e^{u}=e^u\\cdot u'=4x\\,e^{2x^2}$.",
      "Answer: $4x\\,e^{2x^2}$."
    ],
    "trap": "Using the Power Rule to bring the exponent down, writing $2x^2\\,e^{2x^2-1}$ — $e^u$ is not $x^n$.",
    "check": "At $x=0$ the inner derivative is $0$, so the slope is $0$ ($e^{2x^2}$ has its minimum at $0$)."
  },
  "tmpl-der-quotient-shift-001": {
    "spot": "$\\frac{x}{x+2}$ has linear top and bottom — Quotient Rule; or split it first as $1-\\frac{2}{x+2}$, which is faster.",
    "why": "Splitting into a constant minus a simple fraction means you only differentiate $\\frac{1}{x+2}$, skipping the Quotient Rule's numerator cleanup.",
    "steps": [
      "$\\frac{x}{x+2}=1-\\frac{2}{x+2}$.",
      "$\\frac{d}{dx}\\left(-\\frac{2}{x+2}\\right)=\\frac{2}{(x+2)^2}$.",
      "Answer: $\\frac{2}{(x+2)^2}$."
    ],
    "trap": "Reversing the order in the Quotient Rule numerator: $\\frac{x\\cdot1-(x+2)\\cdot1}{(x+2)^2}=\\frac{-2}{(x+2)^2}$, off by a sign.",
    "check": "$\\frac{x}{x+2}$ is increasing for $x>-2$ (climbing toward $1$), so the derivative should be positive."
  },
  "tmpl-int-power-002": {
    "spot": "A single power $x^4$ times a constant — Power Rule: raise the exponent by one and divide by the new exponent.",
    "why": "Pull out the constant $10$; $\\int x^4dx=\\frac{x^5}{5}$.",
    "steps": [
      "$\\int x^4\\,dx=\\frac{x^5}{5}$.",
      "Multiply by $10$: $10\\cdot\\frac{x^5}{5}=2x^5$.",
      "Result: $2x^5+C$."
    ],
    "trap": "Dividing by the old exponent $4$ and getting $\\frac{10}{4}x^5$.",
    "check": "Differentiate back: $(2x^5)'=10x^4$."
  },
  "tmpl-int-power-003": {
    "spot": "A single power $x^5$ times the constant $3$ — Power Rule: the exponent becomes $6$, divide by $6$.",
    "why": "Pull out the constant, leaving the standard $\\int x^5dx$.",
    "steps": [
      "$\\int x^5\\,dx=\\frac{x^6}{6}$.",
      "Multiply by $3$: $\\frac{3x^6}{6}=\\frac{x^6}{2}$.",
      "Result: $\\frac{x^6}{2}+C$."
    ],
    "trap": "Dividing by the old exponent $5$ to get $\\frac35x^6$, whose derivative is $\\frac{18}{5}x^5$.",
    "check": "Differentiate back: $\\left(\\frac{x^6}{2}\\right)'=3x^5$."
  },
  "tmpl-int-power-004": {
    "spot": "A single power $x^3$ times the constant $12$ — Power Rule: the exponent becomes $4$, divide by $4$.",
    "why": "Pull out the constant; $12$ is divisible by $4$.",
    "steps": [
      "$\\int x^3\\,dx=\\frac{x^4}{4}$.",
      "Multiply by $12$: $\\frac{12x^4}{4}=3x^4$.",
      "Result: $3x^4+C$."
    ],
    "trap": "Dividing by the old exponent $3$ and getting $4x^4$.",
    "check": "Differentiate back: $(3x^4)'=12x^3$."
  },
  "tmpl-int-power-005": {
    "spot": "A single power $x^6$ times the constant $7$ — Power Rule: the exponent becomes $7$, divide by $7$, and the coefficient simplifies to $1$.",
    "why": "Pull out the constant; the $7$ cancels the new exponent $7$.",
    "steps": [
      "$\\int x^6\\,dx=\\frac{x^7}{7}$.",
      "Multiply by $7$: $7\\cdot\\frac{x^7}{7}=x^7$.",
      "Result: $x^7+C$."
    ],
    "trap": "Dividing by the old exponent $6$ and getting $\\frac76x^7$.",
    "check": "Differentiate back: $(x^7)'=7x^6$."
  },
  "tmpl-int-sin-def-001": {
    "spot": "$\\sin(3x)$ has inner coefficient $3$ — the antiderivative is $-\\frac{\\cos 3x}{3}$; then plug in the limits.",
    "why": "Reverse Chain Rule, divide by $3$; $\\cos 3\\pi=-1$ is immediate.",
    "steps": [
      "Antiderivative $-\\frac{\\cos 3x}{3}$.",
      "Upper limit: $-\\frac{\\cos 3\\pi}{3}=\\frac13$; lower limit: $-\\frac{\\cos 0}{3}=-\\frac13$.",
      "$\\frac13-\\left(-\\frac13\\right)=\\frac23$."
    ],
    "trap": "Thinking the integral of $\\sin$ over $[0,\\pi]$ is always $2$; or forgetting to divide by $3$ and getting $2$.",
    "check": "$[0,\\pi]$ holds one and a half periods: of the three half-arches $+\\frac23-\\frac23+\\frac23$, two cancel, leaving the area of one half-arch, $\\frac23$."
  },
  "tmpl-lim-cos-square-002": {
    "spot": "$1-\\cos(4x)$ over $x^2$ — the standard form $\\frac{1-\\cos u}{u^2}\\to\\frac12$, with $u=4x$.",
    "why": "Build $u^2=16x^2$ and use the standard limit; or Taylor-expand $1-\\cos u\\approx\\frac{u^2}{2}$. L'Hôpital's Rule would take two rounds.",
    "steps": [
      "$1-\\cos 4x\\approx\\frac{(4x)^2}{2}=8x^2$ (first term of the Taylor expansion).",
      "$\\frac{1-\\cos 4x}{x^2}=16\\cdot\\frac{1-\\cos 4x}{(4x)^2}$.",
      "Limit $16\\cdot\\frac12=8$."
    ],
    "trap": "Pulling out the coefficient $4$ without squaring it, getting $4\\cdot\\frac12=2$.",
    "check": "At $x=0.01$ the ratio is about $7.9989$."
  },
  "tmpl-lim-log-ratio-001": {
    "spot": "A ratio of two $\\ln(1+\\text{small})$ — $\\ln(1+u)\\approx u$, so only the ratio of the small quantities $\\frac{2x}{5x}$ matters.",
    "why": "Equivalent infinitesimals finish it in one step; L'Hôpital's Rule also works: $\\frac{2/(1+2x)}{5/(1+5x)}\\to\\frac25$.",
    "steps": [
      "$\\frac{\\ln(1+u)}{u}\\to 1$.",
      "Rewrite: $\\frac{\\ln(1+2x)}{\\ln(1+5x)}=\\frac{\\ln(1+2x)}{2x}\\cdot\\frac{5x}{\\ln(1+5x)}\\cdot\\frac25$.",
      "Limit $\\frac25$."
    ],
    "trap": "Treating $\\frac{\\ln(1+2x)}{\\ln(1+5x)}$ as $\\ln\\frac{1+2x}{1+5x}$ and getting $\\ln 1=0$.",
    "check": "At $x=0.001$ the ratio is about $0.4006$, heading toward $0.4$."
  },
  "tmpl-ser-geo-tail-001": {
    "spot": "A geometric series with ratio $\\frac12$, but starting at $n=2$ — the first term is $\\frac14$, not $\\frac12$.",
    "why": "Use $\\frac{\\text{first term}}{1-r}$; the first term must be the term the sum actually starts with.",
    "steps": [
      "First term $\\left(\\frac12\\right)^2=\\frac14$, ratio $r=\\frac12$.",
      "Sum $=\\frac{1/4}{1-1/2}=\\frac12$.",
      "Answer: $\\frac12$."
    ],
    "trap": "Using the $n=0$ formula $\\frac{1}{1-r}=2$, or using $\\frac12$ as the first term and getting $1$.",
    "check": "The total from $n=0$ is $2$; subtract the first two terms $1+\\frac12$."
  },
  "uni-int-006": {
    "spot": "$\\sin^5x$ comes with a $\\cos x$, which is exactly the derivative of $\\sin x$ — let $u=\\sin x$.",
    "why": "After substitution it is $\\int u^5\\,du$; power-reduction formulas are not needed at all.",
    "steps": [
      "$u=\\sin x$, $du=\\cos x\\,dx$.",
      "$\\int u^5\\,du=\\frac{u^6}{6}$.",
      "Result: $\\frac{\\sin^6x}{6}+C$."
    ],
    "trap": "Seeing a fifth power and reaching for power reduction or splitting off $\\sin^4x\\sin x$ — the long way around.",
    "check": "Definite integral: $\\int_0^{\\pi/2}\\sin^5x\\cos x\\,dx=\\frac16$."
  },
  "world-002": {
    "spot": "$\\frac{2^x-1}{x}=\\frac{2^x-2^0}{x-0}$ — this is the derivative of $2^x$ at $x=0$.",
    "why": "Recognize the definition of the derivative and use $(a^x)'=a^x\\ln a$; no L'Hôpital's Rule needed.",
    "steps": [
      "$\\lim_{x\\to0}\\frac{2^x-2^0}{x}=f'(0)$, with $f(x)=2^x$.",
      "$f'(x)=2^x\\ln2$.",
      "$f'(0)=\\ln2\\approx 0.693$."
    ],
    "trap": "Writing the derivative of $2^x$ as $x\\,2^{x-1}$ (Power Rule in the wrong place) and getting $0$ at $0$.",
    "check": "At $x=0.001$ the ratio is about $0.6934$."
  },
  "burst-int-039": {
    "spot": "$x^4$ times $\\ln x$ — the same type as $x\\ln x$: integration by parts, letting $\\ln x$ be differentiated away.",
    "why": "$u=\\ln x$ differentiates to $\\frac1x$, and times $\\frac{x^5}{5}$ leaves $\\frac{x^4}{5}$; one round of parts finishes it.",
    "steps": [
      "$u=\\ln x$, $dv=x^4dx$: $du=\\frac{dx}{x}$, $v=\\frac{x^5}{5}$.",
      "$\\int x^4\\ln x\\,dx=\\frac{x^5}{5}\\ln x-\\int\\frac{x^4}{5}\\,dx$.",
      "$\\int\\frac{x^4}{5}\\,dx=\\frac{x^5}{25}$.",
      "Result: $\\frac{x^5\\ln x}{5}-\\frac{x^5}{25}+C$."
    ],
    "trap": "Dividing the second term by $5$ only once and writing $\\frac{x^5}{5}$.",
    "check": "Definite integral: $\\int_1^2 x^4\\ln x\\,dx=\\frac{32\\ln2}{5}-\\frac{31}{25}$."
  },
  "cx-cont-002": {
    "spot": "A piecewise function continuous at the junction $x=2$ — the two pieces must have equal values at $x=2$: $2a+1=4$.",
    "why": "The left piece is for $x\\le2$ (including the junction), and the right piece's limit must match it; plugging in both gives one linear equation.",
    "steps": [
      "Right-hand limit: $\\lim_{x\\to2^+}x^2=4$.",
      "Left-hand limit = function value: $a\\cdot2+1=2a+1$.",
      "$2a+1=4\\Rightarrow a=\\frac32$."
    ],
    "trap": "Writing the equation as $2a+1=2^2$ and then rearranging wrong to get $a=\\frac52$; or setting the derivatives of the two pieces equal (that is the condition for differentiability).",
    "check": "Plug back in: with $a=\\frac32$, the left piece has value $4$ at $x=2$, joining $x^2$ exactly."
  },
  "cx-cont-005": {
    "spot": "A piecewise function continuous at the junction $x=1$ — the left piece's limit $1+b$ must equal the right piece's value $3\\cdot1-1=2$.",
    "why": "Continuity means left limit, right limit and function value all agree; here that becomes one linear equation.",
    "steps": [
      "Right piece (including $x=1$): $f(1)=3-1=2$.",
      "Left-hand limit: $\\lim_{x\\to1^-}(x^2+b)=1+b$.",
      "$1+b=2\\Rightarrow b=1$."
    ],
    "trap": "Plugging into the right piece as $3x$, forgetting the $-1$, and getting $b=2$.",
    "check": "Plug back in: with $b=1$, the left piece $x^2+1$ equals $2$ at $x=1$, joining the right piece."
  }
};
