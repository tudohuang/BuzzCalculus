// Detail v2, English — batch 041. Translation of tools/content/detail/041.js (text only; claims live in the Chinese file).
module.exports = {
  "refine-limits-032": {
    "spot": "A factor $\\frac{1}{n^3}$ in front and $\\sum_{k=1}^{n}k(k+1)$ inside: polynomial sums have closed forms, and $k(k+1)$ even telescopes via products of three consecutive integers, giving a cubic in $n$.",
    "why": "Write the sum in closed form first; then the limit is just \"cubic over cubic, compare leading coefficients\". Viewing it as a Riemann sum also works and makes a good check.",
    "steps": [
      "Telescoping: $k(k+1)=\\frac{k(k+1)(k+2)-(k-1)k(k+1)}{3}$ — subtracting consecutive terms leaves exactly this.",
      "So summing from $k=1$ to $n$ everything telescopes: $\\sum_{k=1}^{n}k(k+1)=\\frac{n(n+1)(n+2)}{3}$.",
      "Divide by $n^3$: $\\frac{n(n+1)(n+2)}{3n^3}=\\frac{1}{3}\\left(1+\\frac{1}{n}\\right)\\left(1+\\frac{2}{n}\\right)\\to\\frac{1}{3}$."
    ],
    "trap": "Keeping only the $k^2$ part but misremembering $\\sum k^2$ as $\\frac{n^3}{2}$, answering $\\frac{1}{2}$; actually $\\sum k^2\\sim\\frac{n^3}{3}$, and $\\sum k$ is only of order $n^2$, contributing nothing to the limit.",
    "check": "Riemann sum: $\\frac{1}{n}\\sum\\frac{k}{n}\\cdot\\frac{k+1}{n}\\to\\int_0^1x^2\\,dx=\\frac{1}{3}$."
  },
  "refine-limits-033": {
    "spot": "Base $1+\\sin 2x\\to1$, exponent $\\cot x\\to\\infty$: a standard $1^\\infty$ form. Taking logs gives $\\cot x\\cdot\\ln(1+\\sin 2x)$, and multiplying two equivalent infinitesimals finishes it.",
    "why": "Plugging in a $1^\\infty$ form directly makes it look like $1$; taking logs brings the exponent down into an $\\infty\\cdot0$ form, and equivalent infinitesimals are the least error-prone route.",
    "steps": [
      "Write it as $e^{\\cot x\\ln(1+\\sin 2x)}$; only the limit of the exponent is needed.",
      "$x\\to0$: $\\ln(1+\\sin 2x)\\sim\\sin 2x\\sim 2x$, $\\cot x\\sim\\frac{1}{x}$.",
      "Exponent $\\to\\frac{1}{x}\\cdot 2x=2$.",
      "So the limit is $e^2$."
    ],
    "trap": "Seeing the base tend to $1$ and answering $1$; $1^\\infty$ is indeterminate, and an exponent growing fast enough pushes it to $e^2$.",
    "check": "At $x=0.001$: $(1.002)^{\\cot 0.001}\\approx e^{1.998}\\approx 7.37$, close to $e^2\\approx7.389$."
  },
  "refine-limits-034": {
    "spot": "A difference of two $\\sin$ terms whose arguments $\\sqrt{x+1}$ and $\\sqrt{x}$ get closer and closer: sum-to-product turns the difference into \"a bounded $\\cos$\" times \"the $\\sin$ of a tiny angle\".",
    "why": "$\\sin\\sqrt{x}$ has no limit itself, so you can't split this into a difference of two limits; after sum-to-product, use the Squeeze Theorem — one factor bounded, the other tending to $0$.",
    "steps": [
      "Sum-to-product: $\\sin\\sqrt{x+1}-\\sin\\sqrt{x}=2\\cos\\frac{\\sqrt{x+1}+\\sqrt{x}}{2}\\sin\\frac{\\sqrt{x+1}-\\sqrt{x}}{2}$.",
      "Rationalize: $\\sqrt{x+1}-\\sqrt{x}=\\frac{1}{\\sqrt{x+1}+\\sqrt{x}}\\to0$.",
      "Using $|\\cos|\\le1$ and $|\\sin u|\\le|u|$: the absolute value of the whole expression is $\\le\\frac{1}{\\sqrt{x+1}+\\sqrt{x}}$.",
      "The bound $\\frac{1}{\\sqrt{x+1}+\\sqrt{x}}<\\frac{1}{2\\sqrt x}$ tends to $0$, so by the Squeeze Theorem the limit is $0$."
    ],
    "trap": "Thinking that since $\\sin\\sqrt{x}$ keeps oscillating the limit doesn't exist; the two oscillations are in sync, and after subtracting the amplitude is squeezed to $0$.",
    "check": "Mean Value Theorem: the difference $=\\cos\\sqrt{c}\\cdot\\frac{1}{2\\sqrt{c}}$ with $c$ between $x$ and $x+1$; at $x=10^6$ its absolute value is at most $0.0005$."
  },
  "refine-limits-035": {
    "spot": "A sum of $n$ terms, where the denominator of each term $\\frac{1}{\\sqrt{n^2+k}}$ only ranges between $n^2+1$ and $n^2+n$ — all nearly equal, so squeeze with the largest and smallest term.",
    "why": "This is not a Riemann sum ($k$ is too small compared with $n^2$); every term is about $\\frac{1}{n}$, and the Squeeze Theorem just needs two easy bounds.",
    "steps": [
      "For $1\\le k\\le n$: $\\frac{1}{\\sqrt{n^2+n}}\\le\\frac{1}{\\sqrt{n^2+k}}\\le\\frac{1}{\\sqrt{n^2+1}}$.",
      "Add the $n$ terms: $\\frac{n}{\\sqrt{n^2+n}}\\le\\text{sum}\\le\\frac{n}{\\sqrt{n^2+1}}$.",
      "Both sides tend to $1$.",
      "Squeeze: the limit is $1$."
    ],
    "trap": "Forcing a Riemann sum, writing $\\frac{1}{n}\\sum\\frac{1}{\\sqrt{1+k/n^2}}$ and turning it into $\\int_0^1\\frac{dx}{\\sqrt{1+x}}=2\\sqrt2-2$; but $\\frac{k}{n^2}$ is not $\\frac{k}{n}$ — the sample points all pile up at $0$.",
    "check": "At $n=4$ the lower bound $\\frac{4}{\\sqrt{20}}\\approx0.894$ and the upper bound $\\frac{4}{\\sqrt{17}}\\approx0.970$ already pin it tightly near $1$."
  },
  "refine-limits-036": {
    "spot": "Two floor functions $\\lfloor\\frac{1}{x}\\rfloor$, $\\lfloor\\frac{2}{x}\\rfloor$ with $x^2$ in front: a floor differs from its argument by less than $1$, so squeeze with $t-1<\\lfloor t\\rfloor\\le t$.",
    "why": "Floor functions can't be differentiated or expanded; the only tool is that they are within $1$ of $t$, and after multiplying by $x$ that error becomes $x\\to0$.",
    "steps": [
      "$\\frac{1}{x}-1<\\left\\lfloor\\frac{1}{x}\\right\\rfloor\\le\\frac{1}{x}$; multiplying by $x>0$: $1-x<x\\left\\lfloor\\frac{1}{x}\\right\\rfloor\\le1$.",
      "Similarly $2-x<x\\left\\lfloor\\frac{2}{x}\\right\\rfloor\\le2$.",
      "Multiply the two (both positive for $x<1$): $(1-x)(2-x)<x^2\\left\\lfloor\\frac{1}{x}\\right\\rfloor\\left\\lfloor\\frac{2}{x}\\right\\rfloor\\le2$.",
      "The lower bound tends to $2$ and the upper bound is $2$, so by the Squeeze Theorem the limit is $2$."
    ],
    "trap": "Seeing that floor functions jump and saying the limit doesn't exist; the jumps are only of size $1$, and multiplying by $x$ squeezes them to $0$, so the squeeze still works.",
    "check": "At $x=0.3$: $\\lfloor 3.33\\rfloor=3$, $\\lfloor 6.67\\rfloor=6$, and $0.09\\cdot18=1.62$, which lies between $(1-0.3)(2-0.3)=1.19$ and $2$."
  },
  "refine-limits-037": {
    "spot": "Numerator $n^2$, denominator $(n+k)^3$, degrees differ by $1$: pulling out $n^3$ gives $\\frac{1}{n}\\sum\\frac{1}{(1+k/n)^3}$, a standard Riemann sum.",
    "why": "$k$ runs from $1$ to $n$ and what appears is $\\frac{k}{n}$ — a right-endpoint sum on $[0,1]$. Convert straight to an integral; no closed form for the sum needed.",
    "steps": [
      "Pull $n^3$ out of the denominator: $\\frac{n^2}{(n+k)^3}=\\frac{1}{n}\\cdot\\frac{1}{(1+k/n)^3}$.",
      "Sum $=\\frac{1}{n}\\sum_{k=1}^{n}f\\!\\left(\\frac{k}{n}\\right)$ with $f(x)=\\frac{1}{(1+x)^3}$, which tends to $\\int_0^1\\frac{dx}{(1+x)^3}$ as $n\\to\\infty$.",
      "$\\int_0^1\\frac{dx}{(1+x)^3}=\\left[-\\frac{1}{2(1+x)^2}\\right]_0^1=-\\frac{1}{8}+\\frac{1}{2}=\\frac{3}{8}$."
    ],
    "trap": "Writing the limits as $1$ to $2$ while still using $\\frac{1}{(1+x)^3}$ — shifting twice — and getting $\\frac{5}{72}$; $\\frac{k}{n}$ runs over $[0,1]$ and the integrand is $\\frac{1}{(1+x)^3}$.",
    "check": "Substituting $u=1+x$: $\\int_1^2u^{-3}\\,du$ is also $\\frac{3}{8}$."
  },
  "refine-limits-038": {
    "spot": "$\\frac{1}{n\\sqrt n}$ in front and $\\sqrt{n+2k}$ inside: pulling $n$ out of the root cancels the $\\sqrt n$, leaving $\\frac{1}{n}\\sum\\sqrt{1+2\\cdot\\frac{k}{n}}$, a Riemann sum.",
    "why": "A sum of square roots has no closed form, so the only way is to treat it as a Riemann sum and convert to an integral.",
    "steps": [
      "$\\sqrt{n+2k}=\\sqrt n\\sqrt{1+\\frac{2k}{n}}$, so the expression $=\\frac{1}{n}\\sum_{k=1}^{n}\\sqrt{1+\\frac{2k}{n}}$.",
      "It tends to $\\int_0^1\\sqrt{1+2x}\\,dx$.",
      "$\\left[\\frac{(1+2x)^{3/2}}{3}\\right]_0^1=\\frac{3\\sqrt3-1}{3}$."
    ],
    "trap": "Forgetting to divide by the inner $2$ in the antiderivative, writing $\\frac{2}{3}(1+2x)^{3/2}$, which doubles the answer to $\\frac{2(3\\sqrt3-1)}{3}$.",
    "check": "The integrand lies between $1$ and $\\sqrt3$, so the integral should be between $1$ and $1.732$; $\\frac{3\\sqrt3-1}{3}\\approx1.399$."
  },
  "refine-limits-039": {
    "spot": "$a_{n+1}=\\frac{a_n}{2}+\\frac{3}{a_n}=\\frac12\\left(a_n+\\frac{6}{a_n}\\right)$: this is Newton's method for $x^2-6$, and also \"the average of $a_n$ and $\\frac{6}{a_n}$\" — the limit must be $\\sqrt6$.",
    "why": "Setting the limit to $L$ and solving the fixed-point equation needs convergence first — an AM-GM lower bound plus a proof of decrease is more solid than just solving the equation.",
    "steps": [
      "This recursion is Newton's method for $x^2-6=0$: $x-\\frac{x^2-6}{2x}=\\frac{x}{2}+\\frac{3}{x}$.",
      "AM-GM: $a_{n+1}=\\frac12\\left(a_n+\\frac{6}{a_n}\\right)\\ge\\sqrt6$, so from $a_2=\\frac72$ on every term is $\\ge\\sqrt6$.",
      "When $a_n\\ge\\sqrt6$, $a_{n+1}-a_n=\\frac{6-a_n^2}{2a_n}\\le0$: decreasing and bounded below, so it converges.",
      "The limit $L$ satisfies $L=\\frac{L}{2}+\\frac{3}{L}$, i.e. $L^2=6$; all terms are positive, so $L=\\sqrt6$."
    ],
    "trap": "Solving the fixed-point equation to get $L=\\pm\\sqrt6$ without filtering, or solving it without proving convergence; since $a_1=1>0$ every term is positive, so the negative root is impossible.",
    "check": "Compute: $a_2=3.5$, $a_3=\\frac{3.5}{2}+\\frac{3}{3.5}\\approx2.607$, already heading toward $\\sqrt6\\approx2.449$."
  },
  "refine-limits-040": {
    "spot": "$a_{n+1}=\\frac{1}{2+a_n}$: the function $g(x)=\\frac{1}{2+x}$ has slope of absolute value at most $\\frac14$ for $x\\ge0$ — a contraction, so it must converge to its unique fixed point.",
    "why": "The sequence swings up and down ($g$ is decreasing), so it isn't monotone and the monotone-bounded argument is awkward; the contraction directly guarantees convergence.",
    "steps": [
      "$g'(x)=-\\frac{1}{(2+x)^2}$, and $|g'(x)|\\le\\frac14$ for $x\\ge0$.",
      "All terms lie in $[0,\\frac12]$, so $|a_{n+1}-L|\\le\\frac14|a_n-L|$: the error shrinks to at most a quarter each step, so it converges.",
      "Fixed point: $L=\\frac{1}{2+L}$, i.e. $L^2+2L-1=0$, $L=-1\\pm\\sqrt2$; the terms are nonnegative, so take $\\sqrt2-1$.",
      "The limit is $\\sqrt2-1$."
    ],
    "trap": "Keeping $-1-\\sqrt2$ from the quadratic, or writing $L=\\frac{-2+\\sqrt8}{2}$ and mis-simplifying to $\\sqrt2-2$; the terms all lie in $[0,\\frac12]$, so the answer must too.",
    "check": "Compute: $0,\\ \\frac12,\\ \\frac25,\\ \\frac{5}{12}\\approx0.4167$ — the convergents of the continued fraction of $\\sqrt2$, straddling $\\sqrt2-1\\approx0.4142$."
  },
  "refine-limits-041": {
    "spot": "$\\sqrt{k^2+k}$ lies between $k$ and $k+\\frac12$ (since $(k+\\frac12)^2=k^2+k+\\frac14$): replace the root by two easy-to-sum linear expressions, and the sum is of order $\\frac{n^2}{2}$.",
    "why": "A sum of square roots has no closed form, but each term differs from $k$ by less than $\\frac12$; those errors add up to only $\\frac{n}{2}$, which vanishes after dividing by $n^2$.",
    "steps": [
      "$k<\\sqrt{k^2+k}<k+\\frac12$.",
      "Add up: $\\frac{n(n+1)}{2}<\\sum_{k=1}^{n}\\sqrt{k^2+k}<\\frac{n(n+1)}{2}+\\frac{n}{2}$.",
      "Divide by $n^2$: both sides tend to $\\frac12$.",
      "Squeeze: the limit is $\\frac12$."
    ],
    "trap": "Thinking $\\sqrt{k^2+k}\\approx k+\\frac12$ adds a bit to the answer; that $\\frac12$ added $n$ times is only $\\frac{n}{2}$, which over $n^2$ tends to $0$.",
    "check": "As a Riemann sum: $\\frac{1}{n}\\sum\\frac{k}{n}\\sqrt{1+\\frac1k}$ with $\\sqrt{1+\\frac1k}\\to1$, the same as $\\int_0^1x\\,dx=\\frac12$."
  },
  "refine-limits-042": {
    "spot": "$\\frac{1}{n}\\sum_{k=1}^{n}a_k$ is the average of the first $n$ terms, and $a_k=\\left(1+\\frac1k\\right)^k\\to e$: the averages of a convergent sequence (Cesàro means) converge to the same limit.",
    "why": "The sum of $\\left(1+\\frac1k\\right)^k$ has no closed form; the Cesàro theorem lets us look only at the limit of a single term.",
    "steps": [
      "Single term: $\\left(1+\\frac1k\\right)^k=e^{k\\ln(1+1/k)}$, and $k\\ln(1+\\frac1k)\\to1$.",
      "So $a_k\\to e$.",
      "Cesàro: if $a_k\\to L$ then $\\frac{a_1+\\cdots+a_n}{n}\\to L$ (the finitely many early terms are diluted by $n$, and every later term is close to $L$).",
      "The limit is $e$."
    ],
    "trap": "Confusing the average with the sum, thinking $\\sum a_k$ diverges and answering $\\infty$; there's a $\\frac1n$ in front.",
    "check": "The sequence climbs from $a_1=2$ toward $e$, so the average is a bit less than $e$ but more than $2$: $a_{10}\\approx2.594$."
  },
  "refine-limits-043": {
    "spot": "A product $\\prod\\left(1+\\frac{2k-1}{n^2}\\right)$ with every factor close to $1$: take logs to get a sum, with $\\ln(1+u)\\approx u$; and $\\sum(2k-1)=n^2$ cancels the denominator exactly.",
    "why": "For the limit of a product, taking logs to get a sum is smoothest; to show the quadratic terms $\\frac{u^2}{2}$ still add up to something tending to $0$, squeeze with $u-\\frac{u^2}{2}\\le\\ln(1+u)\\le u$.",
    "steps": [
      "$\\ln P_n=\\sum_{k=1}^{n}\\ln\\left(1+u_k\\right)$ with $u_k=\\frac{2k-1}{n^2}$; and $u-\\frac{u^2}{2}<\\ln(1+u)<u$.",
      "Linear terms: $\\sum(2k-1)=n^2$ (sum of odd numbers), so $\\sum u_k=1$.",
      "Quadratic terms: $\\sum(2k-1)^2=\\frac{n(4n^2-1)}{3}$, which divided by $n^4$ is about $\\frac{4}{3n}\\to0$.",
      "So $1-\\frac{2}{3n}<\\ln P_n<1$, hence $\\ln P_n\\to1$ and $P_n\\to e$."
    ],
    "trap": "Expanding the product, keeping only first-order terms and writing $1+\\sum u_k=2$; $\\prod(1+u_k)$ is not $1+\\sum u_k$ — the cross terms also add up to $O(1)$, and only taking logs is clean.",
    "check": "When all $u_k$ are equal it's just $\\left(1+\\frac1n\\right)^n\\to e$; this problem just distributes the $1$ unevenly among the factors."
  },
  "refine-limits-045": {
    "spot": "In each term $e^{k/n^2}-1$ the exponent $\\frac{k}{n^2}\\le\\frac1n$ is small, so $e^u-1\\approx u$; and $\\sum\\frac{k}{n^2}=\\frac{n+1}{2n}\\to\\frac12$.",
    "why": "The exponential sum does have a closed form via a geometric series, but squeezing with $u<e^u-1<ue^u$ takes just two lines.",
    "steps": [
      "For $u>0$, $u<e^u-1<ue^u$.",
      "$u=\\frac{k}{n^2}\\le\\frac1n$, so $\\frac{k}{n^2}<e^{k/n^2}-1<\\frac{k}{n^2}e^{1/n}$.",
      "Add up: $\\frac{n+1}{2n}<\\text{sum}<e^{1/n}\\frac{n+1}{2n}$.",
      "Squeeze: the limit is $\\frac12$."
    ],
    "trap": "Thinking \"every term tends to $0$, so the sum tends to $0$\"; the number of terms $n$ is growing too, so you have to look at the size of the sum, not single terms.",
    "check": "Closed form: $\\sum_{k=1}^{n}r^k-n=\\frac{r(r^n-1)}{r-1}-n$ with $r=e^{1/n^2}$; at $n=100$ it is already about $0.505$."
  },
  "refine-series-009": {
    "spot": "Condensation means replacing $n$ by $2^k$ and multiplying by $2^k$: the $2^k$ cancels the $n=2^k$ in the denominator, $\\ln 2^k=k\\ln2$, and what's left is $\\frac{1}{k^2\\ln^22}$ — a p-series with $p=2$.",
    "why": "Just substitute by the definition; after condensation it's a constant multiple of $\\zeta(2)=\\frac{\\pi^2}{6}$, nothing more to do.",
    "steps": [
      "$a_{2^k}=\\frac{1}{2^k(\\ln 2^k)^2}=\\frac{1}{2^k k^2\\ln^2 2}$.",
      "Multiply by $2^k$: $2^ka_{2^k}=\\frac{1}{k^2\\ln^22}$.",
      "$\\sum_{k=1}^\\infty\\frac{1}{k^2}=\\frac{\\pi^2}{6}$.",
      "So the condensed series sums to $\\frac{\\pi^2}{6\\ln^22}$."
    ],
    "trap": "Writing $(\\ln 2^k)^2$ as $\\ln^2(2)\\cdot k$ with only one factor of $k$, getting a harmonic series and concluding divergence.",
    "check": "Numerically about $\\frac{1.645}{0.4805}\\approx3.42$; it also shows the original series $\\sum\\frac{1}{n\\ln^2n}$ converges (condensation preserves convergence)."
  },
  "refine-series-038": {
    "spot": "Fibonacci coefficients times $\\left(\\frac13\\right)^n$: this is the generating function $\\sum F_nx^n=\\frac{x}{1-x-x^2}$ evaluated at $x=\\frac13$.",
    "why": "Use the recurrence $F_{n+2}=F_{n+1}+F_n$ to cancel $G(x)$ against its own shifts; one algebraic equation gives the generating function, shorter than splitting Binet's formula into two geometric series.",
    "steps": [
      "Let $G(x)=\\sum_{n\\ge0}F_nx^n$. Multiply the recurrence by $x^{n+2}$ and sum: $G-x=x\\,G+x^2G$ ($F_0=0$, $F_1=1$).",
      "Solve: $G(x)=\\frac{x}{1-x-x^2}$, convergent for $|x|<\\frac{\\sqrt5-1}{2}\\approx0.618$, and $\\frac13$ is inside.",
      "Plug in $x=\\frac13$: $\\frac{1/3}{1-\\frac13-\\frac19}=\\frac{1/3}{5/9}=\\frac35$.",
      "Summing term by term with Binet's formula $F_n=\\frac{\\varphi^n-\\psi^n}{\\sqrt5}$ gives the same."
    ],
    "trap": "Plugging in $x=3$ instead of $\\frac13$: $\\frac{3}{1-3-9}=-\\frac{3}{11}$; the problem divides by $3^n$.",
    "check": "The first few terms $0+\\frac13+\\frac19+\\frac{2}{27}+\\frac{3}{81}+\\frac{5}{243}\\approx0.576$, then it keeps climbing to $0.6$."
  },
  "refine-series-043": {
    "spot": "The identity holds for every positive integer $n$ and there is only one unknown $c$: plug in the simplest case $n=1$; or recall $\\sum k^3=\\left(\\frac{n(n+1)}{2}\\right)^2$ and expand.",
    "why": "One unknown needs one equation, and $n=1$ is fastest; expanding the formula confirms it holds for all $n$.",
    "steps": [
      "Plug in $n=1$: the left side is $1$, the right side $\\frac14+\\frac12+c$.",
      "Solve: $c=1-\\frac34=\\frac14$.",
      "Confirm: $\\left(\\frac{n(n+1)}{2}\\right)^2=\\frac{n^4}{4}+\\frac{n^3}{2}+\\frac{n^2}{4}$.",
      "And the difference of consecutive terms is exactly $n^3$, so the formula holds for all $n$, with $c=\\frac14$."
    ],
    "trap": "Confusing it with $\\sum k^2=\\frac{n^3}{3}+\\frac{n^2}{2}+\\frac{n}{6}$ and answering $\\frac16$.",
    "check": "At $n=2$: $1+8=9$, and the right side is $4+4+\\frac14\\cdot4=9$."
  },
  "refine-series-048": {
    "spot": "The sum contains $2^k$ and the denominator is $n^2 2^n$ — the same order as the last term: in $\\frac{a_n}{b_n}$ both go to infinity, so use the Stolz theorem and look at the ratio of consecutive differences.",
    "why": "A geometrically weighted sum is dominated by its last few terms; Stolz replaces the sum by a single term and one ratio finishes it. The closed form also works but is longer — use it as a check.",
    "steps": [
      "Let $a_n=\\sum_{k=1}^{n}k^22^k$, $b_n=n^22^n$; $b_n$ increases strictly to $\\infty$, so Stolz applies.",
      "$a_{n+1}-a_n=(n+1)^22^{n+1}$, $b_{n+1}-b_n=(n+1)^22^{n+1}-n^22^n$.",
      "Ratio $=\\frac{2(n+1)^2}{2(n+1)^2-n^2}\\to\\frac{2}{2-1}=2$.",
      "Stolz gives the original limit as $2$ too."
    ],
    "trap": "Thinking only the last term $n^22^n$ dominates and answering $1$; the second-to-last, third-to-last, ... terms contribute $\\frac12,\\frac14,\\dots$ times as much, adding up to one more copy: $1+\\frac12+\\frac14+\\cdots=2$ in total.",
    "check": "Closed form $\\sum_{k=1}^{n}k^22^k=2^{n+1}(n^2-2n+3)-6$ (consecutive differences are exactly $n^22^n$); divided by $n^22^n$ it tends to $2$."
  },
  "refine-series-060": {
    "spot": "We want the sum of reciprocals of odd squares, and the Fourier series contains exactly $\\frac{\\cos(2k-1)x}{(2k-1)^2}$: find a point where every $\\cos$ equals $1$ — that's $x=0$.",
    "why": "$|x|$ is continuous at $x=0$, so the Fourier series converges there to the function value $0$; plugging in gives a linear equation for the desired sum.",
    "steps": [
      "At $x=0$, $\\cos 0=1$, and the series becomes $\\frac{\\pi}{2}-\\frac{4}{\\pi}S$ with $S=\\sum\\frac{1}{(2k-1)^2}$.",
      "$f(0)=|0|=0$, and $f$ is continuous at $0$ and piecewise smooth, so the series converges to $0$: $\\frac{\\pi}{2}-\\frac{4}{\\pi}S=0$.",
      "Solve: $S=\\frac{\\pi^2}{8}$."
    ],
    "trap": "Dropping the coefficient $\\frac{4}{\\pi}$ when solving and writing $S=\\frac{\\pi}{2}$; it should be $S=\\frac{\\pi}{2}\\cdot\\frac{\\pi}{4}=\\frac{\\pi^2}{8}$.",
    "check": "Consistent with $\\zeta(2)$: the even terms give $\\frac14\\cdot\\frac{\\pi^2}{6}$, so the odd terms $=\\frac{\\pi^2}{6}\\cdot\\frac34=\\frac{\\pi^2}{8}$."
  },
  "refine-series-071": {
    "spot": "$\\cos\\frac{2n\\pi}{3}$ has period $3$: $-\\frac12,-\\frac12,1$ repeating, so the partial sums are periodic too, and the Cesàro sum is the average of the partial sums over one period.",
    "why": "The partial sums don't converge, so only their average can be used; for a periodic sequence the average is just one period's worth.",
    "steps": [
      "$n=1,2,3$: $\\cos\\frac{2\\pi}{3}=-\\frac12$, $\\cos\\frac{4\\pi}{3}=-\\frac12$, $\\cos2\\pi=1$, then it repeats.",
      "Partial sums $S_1=-\\frac12$, $S_2=-1$, $S_3=0$; every three terms it returns to $0$, so $S_n$ cycles through $-\\frac12,-1,0$.",
      "$\\frac{S_1+\\cdots+S_N}{N}$ tends to the average over one period: $\\frac{-\\frac12-1+0}{3}=-\\frac12$."
    ],
    "trap": "Averaging the terms instead of the partial sums: $\\frac{-\\frac12-\\frac12+1}{3}=0$, answer $0$; Cesàro averages the partial sums $S_n$, not the terms.",
    "check": "Abel sum: $\\sum\\cos\\frac{2n\\pi}{3}x^n=\\frac{-\\frac x2-\\frac{x^2}{2}+x^3}{1-x^3}$, which also tends to $-\\frac12$ as $x\\to1^-$ (if a series is Cesàro summable, its Abel sum is the same)."
  },
  "refine-series-074": {
    "spot": "The coefficients $(-1)^n(n+1)$ come from differentiating the sum of $(-x)^n$: $\\sum(-1)^n(n+1)x^n=\\frac{d}{dx}\\sum(-1)^nx^{n+1}=\\frac{d}{dx}\\frac{x}{1+x}$.",
    "why": "A power series can be differentiated term by term for $|x|<1$; find the closed form first, then let $x\\to1^-$. The closed form is continuous at $x=1$, so just plug in.",
    "steps": [
      "$\\sum_{n\\ge0}(-1)^nx^{n+1}=\\frac{x}{1+x}$ (geometric, $|x|<1$).",
      "Differentiate term by term: $\\sum(-1)^n(n+1)x^n=\\frac{d}{dx}\\frac{x}{1+x}=\\frac{1}{(1+x)^2}$.",
      "$x\\to1^-$: $\\frac{1}{(1+x)^2}\\to\\frac14$."
    ],
    "trap": "Using $\\frac{1}{(1-x)^2}$ (the version without alternating signs), which diverges as $x\\to1^-$; the alternating signs make the denominator $1+x$.",
    "check": "Cesàro works too: the averages of the partial sums $1,-1,2,-2,3,\\dots$ don't converge, but averaging once more ($(C,2)$) gives $\\frac14$; or add $S=1-2+3-\\cdots$ to a shifted copy of itself: $2S=1-1+1-\\cdots=\\frac12$."
  },
  "rel-basic-009": {
    "spot": "$e^{2x}$ is an exponential with a linear inner function $2x$: the Chain Rule puts the inner derivative $2$ in front.",
    "why": "The outer $e^u$ is its own derivative; just remember to multiply by the inner derivative, then plug in $x=0$.",
    "steps": [
      "The outer $e^u$ has derivative $e^u$; the inner $u=2x$ has derivative $2$.",
      "Chain Rule: $\\frac{d}{dx}e^{2x}=e^{2x}\\cdot2$.",
      "Plug in $x=0$: $2e^0=2$."
    ],
    "trap": "Forgetting to multiply by the inner $2$ and answering $1$.",
    "check": "Difference quotient: $\\frac{e^{0.002}-1}{0.001}\\approx2.002$."
  },
  "ser-009": {
    "spot": "The coefficient $\\frac1n$ only changes things polynomially and doesn't affect the geometric growth rate: the ratio $\\frac{a_{n+1}}{a_n}=\\frac{n}{n+1}\\to1$, so the radius is $1$.",
    "why": "The Ratio Test is most direct for power series; the reciprocal of the limit of the coefficient ratio is the radius of convergence.",
    "steps": [
      "$\\left|\\frac{x^{n+1}/(n+1)}{x^n/n}\\right|=\\frac{n}{n+1}|x|$.",
      "As $n\\to\\infty$, $\\frac{n}{n+1}\\to1$, so it converges for $|x|<1$ and diverges for $|x|>1$.",
      "Radius of convergence $R=1$."
    ],
    "trap": "Mixing up endpoint behavior ($x=1$ diverges, $x=-1$ converges) with the radius; the radius only asks for the threshold on $|x|$, and the answer is $1$.",
    "check": "This is the expansion of $-\\ln(1-x)$; $\\ln$ blows up at $x=1$, and the nearest singularity is exactly distance $1$ from the center."
  },
  "ser-014": {
    "spot": "$\\sum\\frac{n}{2^n}$ is \"$n$ times geometric\": exactly $\\sum nx^n=\\frac{x}{(1-x)^2}$ at $x=\\frac12$.",
    "why": "For arithmetic-times-geometric series, either shift-and-subtract or differentiating the geometric series gets there in one step.",
    "steps": [
      "$\\sum_{n\\ge1}x^n=\\frac{x}{1-x}$; differentiate both sides and multiply by $x$: $\\sum nx^n=\\frac{x}{(1-x)^2}$.",
      "Plug in $x=\\frac12$: $\\frac{1/2}{1/4}=2$.",
      "So the sum is $2$."
    ],
    "trap": "Forgetting to multiply back by $x$ after differentiating, using $\\frac{1}{(1-x)^2}$ and getting $4$.",
    "check": "Shift and subtract: $S-\\frac S2=\\frac12+\\frac14+\\cdots=1$, so $S=2$."
  },
  "ser-017": {
    "spot": "Coefficient $\\frac{n^2}{3^n}$: $n^2$ is polynomial and doesn't affect the radius; what decides it is $3^n$ — the answer must be $3$.",
    "why": "In the Ratio Test, $\\frac{(n+1)^2}{n^2}\\to1$ drops out automatically, leaving $\\frac{|x|}{3}$.",
    "steps": [
      "Ratio: $\\frac{(n+1)^2|x|^{n+1}/3^{n+1}}{n^2|x|^n/3^n}=\\frac{(n+1)^2}{n^2}\\cdot\\frac{|x|}{3}$.",
      "$\\frac{(n+1)^2}{n^2}\\to1$, so the limit is $\\frac{|x|}{3}$; it converges when this is $<1$, i.e. $|x|<3$.",
      "Radius of convergence $R=3$."
    ],
    "trap": "Writing the ratio upside down and getting $R=\\frac13$; the coefficient divides by $3^n$, so $x$ can be as large as $3$.",
    "check": "Root Test: $\\sqrt[n]{\\frac{n^2}{3^n}}=\\frac{n^{2/n}}{3}\\to\\frac13$, reciprocal $3$."
  },
  "si-set-004": {
    "spot": "The second derivative of a cubic is linear, with exactly one zero, and a linear function always changes sign at its zero — so there is exactly one inflection point.",
    "why": "An inflection point needs $f''$ to change sign; for a cubic, the root of $f''=0$ is the answer, no further check needed.",
    "steps": [
      "$f'(x)=3x^2-6x$, $f''(x)=6x-6$.",
      "$f''(x)=0$ only at $x=1$.",
      "For $x<1$, $f''<0$ (concave down); for $x>1$, $f''>0$ (concave up) — it does change sign.",
      "The only inflection point has $x$-coordinate $1$, so the answer is the set $\\{1\\}$."
    ],
    "trap": "Taking the points where $f'=0$, $x=0,2$ (the extrema), as inflection points.",
    "check": "A cubic's inflection point is the midpoint of its two critical points: $\\frac{0+2}{2}=1$."
  },
  "si-set-012": {
    "spot": "$xe^{-x}$ is a product, differentiable everywhere, so critical points come only from $f'=0$; and $e^{-x}$ is never zero, leaving the linear factor $1-x$.",
    "why": "After the Product Rule, factor out $e^{-x}$ and the equation is immediately linear.",
    "steps": [
      "$f'(x)=e^{-x}-xe^{-x}=(1-x)e^{-x}$.",
      "$e^{-x}>0$, so $f'=0$ only at $x=1$; $f$ is differentiable everywhere, so there are no points where the derivative fails to exist.",
      "The only critical point is $x=1$, so the answer is the set $\\{1\\}$."
    ],
    "trap": "Skipping the Product Rule, writing $f'=-e^{-x}$ and concluding there are no critical points; or also including $x=0$ (a zero of the function).",
    "check": "$x=1$ is the maximum, $\\frac1e$: $f'>0$ to the left and $f'<0$ to the right."
  },
  "tb-curv-002": {
    "spot": "The curve is given as $y=f(x)$: curvature $\\kappa=\\frac{|y''|}{(1+y'^2)^{3/2}}$, and the radius of curvature is its reciprocal — you only need the first and second derivatives at $x=1$.",
    "why": "For the graph of a function, apply the formula directly; no need to convert to parametric form.",
    "steps": [
      "$y'=3x^2$, $y''=6x$; at $x=1$: $y'=3$, $y''=6$.",
      "$\\kappa=\\frac{6}{(1+9)^{3/2}}=\\frac{6}{10\\sqrt{10}}$.",
      "$R=\\frac1\\kappa=\\frac{10\\sqrt{10}}{6}=\\frac{5\\sqrt{10}}{3}$."
    ],
    "trap": "Forgetting the $\\frac32$ power in the denominator and writing $\\frac{1+9}{6}=\\frac53$.",
    "check": "$R\\approx5.27$: near $x=1$, $y=x^3$ is steep with slope $3$ and looks fairly straight, so a large radius makes sense."
  },
  "tb-newt-001": {
    "spot": "One step of Newton's method: $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$; here $x_0=2$ is used to approximate $\\sqrt5$.",
    "why": "Apply the formula directly; $f(2)=-1$ and $f'(2)=4$ are both integers, so it's one line.",
    "steps": [
      "Newton's method: draw the tangent line $y=f(x_0)+f'(x_0)(x-x_0)$ at $x_0$; where it crosses the $x$-axis is $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$.",
      "$f(2)=4-5=-1$, $f'(x)=2x$, $f'(2)=4$.",
      "$x_1=2-\\frac{-1}{4}=\\frac94$."
    ],
    "trap": "Getting the sign wrong and writing $2-\\frac14=\\frac74$; $f(2)$ is negative, so $x_1$ should move to the right.",
    "check": "$\\sqrt5\\approx2.236$ and $\\frac94=2.25$ is already very close, approaching from the right (for a convex function, Newton's method is always to the right of the root after the first step)."
  },
  "tb-newt-002": {
    "spot": "One step of Newton's method: $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$, using $x_0=1$ to approximate $\\sqrt[3]2$.",
    "why": "Apply the formula directly; $f(1)=-1$, $f'(1)=3$.",
    "steps": [
      "Newton's method: the tangent line at $x_0$ crosses the $x$-axis at $x_1=x_0-\\frac{f(x_0)}{f'(x_0)}$; for $x^3-2$ this simplifies to $\\frac{2x^3+2}{3x^2}$.",
      "$f(1)=1-2=-1$, $f'(x)=3x^2$, $f'(1)=3$.",
      "$x_1=1-\\frac{-1}{3}=\\frac43$."
    ],
    "trap": "Flipping the sign to $x_0+\\frac{f(x_0)}{f'(x_0)}$, which gives $\\frac23$ — even farther from the root.",
    "check": "$\\sqrt[3]2\\approx1.26$; $\\frac43\\approx1.333$ is to the right of the root and much closer than $x_0=1$."
  },
  "tmpl-ser-arith-geo-002": {
    "spot": "Numerator $n$ is arithmetic, denominator $7^n$ is geometric: arithmetic times geometric, so shift and subtract — $S-\\frac{S}{7}$ leaves a pure geometric series.",
    "why": "Shift-and-subtract eliminates the $n$ in one line; alternatively plug $x=\\frac17$ into $\\sum nx^n=\\frac{x}{(1-x)^2}$.",
    "steps": [
      "$S=\\frac17+\\frac{2}{7^2}+\\frac{3}{7^3}+\\cdots$, $\\frac S7=\\frac{1}{7^2}+\\frac{2}{7^3}+\\cdots$.",
      "Subtract: $\\frac67S=\\frac17+\\frac{1}{7^2}+\\cdots=\\frac{1/7}{1-1/7}=\\frac16$.",
      "$S=\\frac16\\cdot\\frac76=\\frac{7}{36}$."
    ],
    "trap": "Starting the geometric part at $n=0$, writing $\\frac{1}{1-1/7}=\\frac76$, and getting $S=\\frac{49}{36}$.",
    "check": "The formula $\\frac{x}{(1-x)^2}$ at $x=\\frac17$: $\\frac{1/7}{36/49}=\\frac{7}{36}\\approx0.194$; the first term $\\frac17\\approx0.143$ is already most of it."
  },
  "tmpl-ser-arith-geo-003": {
    "spot": "Numerator $n$ is arithmetic, denominator $8^n$ is geometric: arithmetic times geometric, so shift and subtract — $S-\\frac{S}{8}$ leaves a pure geometric series.",
    "why": "Shift-and-subtract eliminates the $n$ in one line; alternatively plug $x=\\frac18$ into $\\sum nx^n=\\frac{x}{(1-x)^2}$.",
    "steps": [
      "$S=\\frac18+\\frac{2}{8^2}+\\frac{3}{8^3}+\\cdots$, $\\frac S8=\\frac{1}{8^2}+\\frac{2}{8^3}+\\cdots$.",
      "Subtract: $\\frac78S=\\frac18+\\frac{1}{8^2}+\\cdots=\\frac{1/8}{1-1/8}=\\frac17$.",
      "$S=\\frac17\\cdot\\frac87=\\frac{8}{49}$."
    ],
    "trap": "Starting the geometric part at $n=0$, writing $\\frac{1}{1-1/8}=\\frac87$, and getting $S=\\frac{64}{49}$.",
    "check": "The formula $\\frac{x}{(1-x)^2}$ at $x=\\frac18$: $\\frac{1/8}{49/64}=\\frac{8}{49}\\approx0.163$; the first term $\\frac18=0.125$ is already most of it."
  },
  "tmpl-ser-arith-geo-004": {
    "spot": "Numerator $n$ is arithmetic, denominator $9^n$ is geometric: arithmetic times geometric, so shift and subtract — $S-\\frac{S}{9}$ leaves a pure geometric series.",
    "why": "Shift-and-subtract eliminates the $n$ in one line; alternatively plug $x=\\frac19$ into $\\sum nx^n=\\frac{x}{(1-x)^2}$.",
    "steps": [
      "$S=\\frac19+\\frac{2}{9^2}+\\frac{3}{9^3}+\\cdots$, $\\frac S9=\\frac{1}{9^2}+\\frac{2}{9^3}+\\cdots$.",
      "Subtract: $\\frac89S=\\frac19+\\frac{1}{9^2}+\\cdots=\\frac{1/9}{1-1/9}=\\frac18$.",
      "$S=\\frac18\\cdot\\frac98=\\frac{9}{64}$."
    ],
    "trap": "Starting the geometric part at $n=0$, writing $\\frac{1}{1-1/9}=\\frac98$, and getting $S=\\frac{81}{64}$.",
    "check": "The formula $\\frac{x}{(1-x)^2}$ at $x=\\frac19$: $\\frac{1/9}{64/81}=\\frac{9}{64}\\approx0.141$; the first term $\\frac19\\approx0.111$ is already most of it."
  },
  "tmpl-ser-arith-geo-005": {
    "spot": "Numerator $n$ is arithmetic, denominator $10^n$ is geometric: arithmetic times geometric, so shift and subtract — $S-\\frac{S}{10}$ leaves a pure geometric series.",
    "why": "Shift-and-subtract eliminates the $n$ in one line; alternatively plug $x=\\frac{1}{10}$ into $\\sum nx^n=\\frac{x}{(1-x)^2}$.",
    "steps": [
      "$S=0.1+0.02+0.003+\\cdots$, $\\frac{S}{10}=0.01+0.002+\\cdots$.",
      "Subtract: $\\frac{9}{10}S=0.1+0.01+\\cdots=\\frac19$.",
      "$S=\\frac19\\cdot\\frac{10}{9}=\\frac{10}{81}$."
    ],
    "trap": "Starting the geometric part at $n=0$, writing $\\frac{1}{1-1/10}=\\frac{10}{9}$, and getting $S=\\frac{100}{81}$.",
    "check": "Just look at the decimals: $0.1+0.02+0.003+0.0004+\\cdots=0.12345\\ldots$, and $\\frac{10}{81}=0.123456\\ldots$."
  },
  "world-003": {
    "spot": "The standard form $\\left(1+\\frac{a}{x}\\right)^x$ with $a=3$: base tends to $1$, exponent to $\\infty$, and the answer is $e^a$.",
    "why": "Taking logs turns $1^\\infty$ into $x\\ln\\left(1+\\frac3x\\right)$, and $\\ln(1+u)\\sim u$ finishes it in one step.",
    "steps": [
      "After $\\ln$: $x\\ln\\left(1+\\frac3x\\right)$; let $u=\\frac3x\\to0$, so $\\ln(1+u)\\sim u$.",
      "So $x\\ln\\left(1+\\frac3x\\right)\\to x\\cdot\\frac3x=3$.",
      "The limit is $e^3$."
    ],
    "trap": "Seeing $1+\\frac3x\\to1$ and answering $1$, or misremembering it as $3e$.",
    "check": "Substitute $x=3m$: $\\left(1+\\frac1m\\right)^{3m}=\\left[\\left(1+\\frac1m\\right)^m\\right]^3\\to e^3$."
  },
  "world-008": {
    "spot": "Numerator $\\tan x-x$, denominator $x-\\sin x$: both are \"function minus its linear term\", each starting at $x^3$ — expand to third order and compare coefficients.",
    "why": "L'Hôpital's Rule would need three rounds and gets messier each time; both expansions are standard, and comparing coefficients gives the answer.",
    "steps": [
      "$\\tan x=x+\\frac{x^3}{3}+\\cdots$, so $\\tan x-x\\sim\\frac{x^3}{3}$.",
      "$\\sin x=x-\\frac{x^3}{6}+\\cdots$, so $x-\\sin x\\sim\\frac{x^3}{6}$.",
      "Ratio $\\to\\frac{1/3}{1/6}=2$."
    ],
    "trap": "Misremembering the cubic coefficient of $\\tan x$ as $\\frac16$ (same as $\\sin$) and answering $1$.",
    "check": "At $x=0.1$: $\\frac{0.000334672}{0.000166583}\\approx2.009$."
  },
  "world-021": {
    "spot": "Denominator $n!$, numerator the polynomial $n^3$: write $n^3$ as a combination of falling factorials $n(n-1)(n-2)$, $n(n-1)$, $n$; each piece cancels against $n!$ and turns back into the series for $e$.",
    "why": "Plugging in numbers shows no pattern; after splitting into falling factorials each piece is $\\sum\\frac{1}{m!}=e$, and adding the coefficients gives the answer.",
    "steps": [
      "$n^3=n(n-1)(n-2)+3n(n-1)+n$.",
      "Cancel: $\\frac{n(n-1)(n-2)}{n!}=\\frac{1}{(n-3)!}$, $\\frac{n(n-1)}{n!}=\\frac{1}{(n-2)!}$, $\\frac{n}{n!}=\\frac{1}{(n-1)!}$ (the first few terms, where there are too few factors, are $0$ anyway).",
      "Each of the three pieces is $\\sum_{m\\ge0}\\frac{1}{m!}=e$: total $=e+3e+e=5e$.",
      "Another route: $\\left(x\\frac{d}{dx}\\right)^3e^x=(x^3+3x^2+x)e^x$, which at $x=1$ is exactly $\\sum\\frac{n^3}{n!}$."
    ],
    "trap": "Splitting as $n^2\\cdot\\frac{n}{n!}=\\frac{n^2}{(n-1)!}$ and then treating $n^2$ as $(n-1)^2$, losing part of the coefficients and getting $2e$ or $4e$.",
    "check": "First few terms: $1+4+4.5+2.667+1.042+0.3+\\cdots\\approx13.5$, and $5e\\approx13.59$."
  },
  "ap-mix-001": {
    "spot": "The salt only changes through outflow: outflow rate $5$ L/min times concentration $\\frac{S}{100}$ gives $S'=-\\frac{S}{20}$ — first-order linear, exponential decay.",
    "why": "Pure water in, equal rate out, so the volume stays at $100$ L; the equation is separable and the solution is $S_0e^{-t/20}$.",
    "steps": [
      "$\\frac{dS}{dt}=-5\\cdot\\frac{S}{100}=-\\frac{S}{20}$, $S(0)=20$.",
      "Separate variables: $S(t)=20e^{-t/20}$.",
      "$t=20$: $S=20e^{-1}\\approx7.36$ kg."
    ],
    "trap": "Assuming $5\\%$ of the original salt leaves each minute, a linear decrease giving $20-20\\cdot0.05\\cdot20=0$; the concentration is changing, so less and less salt leaves.",
    "check": "$20$ minutes is exactly one time constant, leaving $\\frac1e\\approx36.8\\%$."
  },
  "ap-rr-002": {
    "spot": "The lamp, the person and the tip of the shadow form two similar triangles: the shadow length $s$ is proportional to the person's distance $x$ from the lamppost, with a constant that doesn't depend on time.",
    "why": "First use similar triangles to write $s$ as a linear function of $x$, then differentiate in time; you don't need to know how far away the person currently is.",
    "steps": [
      "Similar triangles: $\\frac{4}{x+s}=\\frac{1.6}{s}$, so $4s=1.6x+1.6s$ and $s=\\frac{1.6}{2.4}x=\\frac23x$.",
      "Differentiate in $t$: $\\frac{ds}{dt}=\\frac23\\frac{dx}{dt}$.",
      "$\\frac{dx}{dt}=1.2$, so $\\frac{ds}{dt}=\\frac23\\cdot1.2=0.8$ m/s."
    ],
    "trap": "Computing the speed of the shadow's tip, $\\frac{d(x+s)}{dt}=1.2+0.8=2$ m/s; the question asks for the rate of change of the shadow's length.",
    "check": "The shadow's tip should move at $\\frac{4}{4-1.6}\\cdot1.2=2$; subtracting the person's $1.2$ leaves exactly $0.8$."
  },
  "ch-inv-001": {
    "spot": "$\\arcsin$ of $\\tanh$ of $x^2$: a three-layer Chain Rule. The key is $\\sqrt{1-\\tanh^2u}=\\operatorname{sech}u$, which cancels one factor of $\\tanh'u=\\operatorname{sech}^2u$.",
    "why": "Differentiate layer by layer from the outside in, then simplify with the hyperbolic identity $1-\\tanh^2=\\operatorname{sech}^2$; the answer comes out very clean.",
    "steps": [
      "Outer: $\\frac{d}{du}\\arcsin u=\\frac{1}{\\sqrt{1-u^2}}$, $u=\\tanh(x^2)$.",
      "Middle $\\frac{d}{dv}\\tanh v=\\operatorname{sech}^2v$, inner $(x^2)'=2x$.",
      "$1-\\tanh^2(x^2)=\\operatorname{sech}^2(x^2)$, so $\\frac{\\operatorname{sech}^2(x^2)\\cdot2x}{\\operatorname{sech}(x^2)}=\\frac{2x}{\\cosh(x^2)}$.",
      "Altogether: $\\frac{2x}{\\cosh(x^2)}$."
    ],
    "trap": "Leaving both $\\operatorname{sech}^2$ and $\\frac{1}{\\sqrt{1-\\tanh^2}}$ unsimplified is also correct, but people often write $\\sqrt{\\operatorname{sech}^2}$ as $\\operatorname{sech}^2$ here, leaving an extra $\\operatorname{sech}$.",
    "check": "At $x=0$ the derivative is $0$ (an even function is flat at the origin); for large $x$, $\\frac{2x}{\\cosh x^2}\\to0$ ($\\tanh$ saturates and $\\arcsin$ approaches $\\frac\\pi2$)."
  },
  "ch-inv-006": {
    "spot": "$\\tanh$ of $\\ln$ of $1+x^2$: a three-layer Chain Rule, multiplying three factors from outside in: $\\operatorname{sech}^2$, $\\frac{1}{1+x^2}$, $2x$.",
    "why": "Each layer is a memorized derivative; multiplying them in order is the least likely to miss anything.",
    "steps": [
      "Outer: $(\\tanh u)'=\\operatorname{sech}^2u=\\frac{1}{\\cosh^2u}$, $u=\\ln(1+x^2)$.",
      "Middle: $(\\ln w)'=\\frac1w$, $w=1+x^2$; inner $w'=2x$.",
      "Multiply: $\\frac{2x}{(1+x^2)\\cosh^2\\left(\\ln(1+x^2)\\right)}$."
    ],
    "trap": "Misremembering the derivative of $\\tanh$ as $1-\\tanh$ or $\\operatorname{sech}u$ (missing the square).",
    "check": "Simplify and verify: $\\tanh(\\ln w)=\\frac{w^2-1}{w^2+1}$, and differentiating that gives the same expression."
  },
  "ch-nest-001": {
    "spot": "$\\sin$ of $\\cos$ of $\\tan$ of $x^2$: a four-layer Chain Rule, one factor per layer, four factors multiplied.",
    "why": "More layers just means more factors; write them down from the outside in, copying each inner part unchanged, and nothing gets lost.",
    "steps": [
      "Outermost: $\\cos(\\cos(\\tan x^2))$.",
      "Second layer: $\\cos v$ has derivative $-\\sin v$ with $v=\\tan x^2$, giving $-\\sin(\\tan x^2)$.",
      "Third layer: $\\tan w$ has derivative $\\sec^2w=\\frac{1}{\\cos^2w}$ with $w=x^2$; innermost $2x$.",
      "Multiply: $-2x\\cos(\\cos(\\tan x^2))\\sin(\\tan x^2)\\sec^2(x^2)$."
    ],
    "trap": "Dropping the minus sign from differentiating $\\cos$, or forgetting the $2x$ from the last layer.",
    "check": "At $x=0$: $x^2$ is flat at the origin, so the whole chain is multiplied by $2x=0$ and the derivative must be $0$."
  },
  "ch-nest-003": {
    "spot": "$\\ln$ of $\\sin$ of $\\sqrt{x^2+1}$: the derivative of $\\ln$ puts $\\sin$ in the denominator, which pairs with $\\cos$ to make $\\cot$; the innermost $\\sqrt{x^2+1}$ has derivative $\\frac{x}{\\sqrt{x^2+1}}$.",
    "why": "Log derivative: $(\\ln g)'=\\frac{g'}{g}$, then the Chain Rule on $g=\\sin\\sqrt{x^2+1}$.",
    "steps": [
      "$\\frac{d}{dx}\\ln g=\\frac{g'}{g}$, $g=\\sin\\sqrt{x^2+1}$.",
      "$g'=\\cos\\sqrt{x^2+1}\\cdot\\frac{x}{\\sqrt{x^2+1}}$.",
      "Divide: $\\frac{x\\cos\\sqrt{x^2+1}}{\\sqrt{x^2+1}\\,\\sin\\sqrt{x^2+1}}$."
    ],
    "trap": "Missing the $x$ in the numerator of the derivative of $\\sqrt{x^2+1}$ (or writing $\\frac{1}{2\\sqrt{x^2+1}}$ and forgetting to multiply by $2x$).",
    "check": "At $x=0$: $\\sqrt{x^2+1}$ is flat at the origin, so the derivative is $0$."
  },
  "ch-nest-004": {
    "spot": "$\\arctan$ of $e^{(\\cdot)}$ of $\\sin$ of $x^2$: in the derivative of $\\arctan$, $\\frac{1}{1+u^2}$, we have $u^2=e^{2\\sin x^2}$.",
    "why": "Multiply the four Chain Rule factors in order; the only thing to watch is that $u^2$ is $e^{2\\sin x^2}$, not $e^{\\sin^2x^2}$.",
    "steps": [
      "Outer $\\frac{1}{1+u^2}$ with $u=e^{\\sin x^2}$, so $u^2=e^{2\\sin x^2}$.",
      "$u'=e^{\\sin x^2}\\cdot\\cos x^2\\cdot2x$.",
      "Multiply: $\\frac{2xe^{\\sin x^2}\\cos x^2}{1+e^{2\\sin x^2}}$."
    ],
    "trap": "Writing $\\left(e^{\\sin x^2}\\right)^2$ as $e^{\\sin^2x^2}$ or $e^{(\\sin x^2)^2}$.",
    "check": "At $x=0$: the inner $x^2$ is flat, so the derivative is $0$."
  },
  "ch-nest-008": {
    "spot": "$\\ln$ of $\\ln$ of $\\sin^2x+2$: two rounds of $(\\ln g)'=\\frac{g'}{g}$, stacking two factors in the denominator, $\\ln(\\sin^2x+2)$ and $\\sin^2x+2$.",
    "why": "Two log layers in a row, each contributing a denominator; the innermost $\\sin^2x$ has derivative $2\\sin x\\cos x$.",
    "steps": [
      "Outer: $\\frac{1}{\\ln(\\sin^2x+2)}$ times the derivative of $\\ln(\\sin^2x+2)$.",
      "$\\frac{d}{dx}\\ln(\\sin^2x+2)=\\frac{2\\sin x\\cos x}{\\sin^2x+2}$.",
      "Multiply: $\\frac{2\\sin x\\cos x}{(\\sin^2x+2)\\ln(\\sin^2x+2)}$."
    ],
    "trap": "Writing the derivative of $\\sin^2x$ as $2\\sin x$ (missing the inner $\\cos x$) or as $\\cos^2 x$.",
    "check": "$\\sin^2x$ has extrema at both $x=0$ and $x=\\frac\\pi2$, so the whole function must have derivative $0$ at those two points."
  },
  "ch-nest-009": {
    "spot": "Square root of $\\sin$ of square root of $\\cos$ of $x^2$: a five-layer Chain Rule. Each of the two roots gives a $\\frac{1}{2\\sqrt{\\ }}$, $\\cos$ gives a minus sign, and $x^2$ gives $2x$.",
    "why": "With many layers, write them one at a time: $\\frac{1}{2\\sqrt A}\\cdot\\cos B\\cdot\\frac{1}{2\\sqrt C}\\cdot(-\\sin x^2)\\cdot2x$; at the end the $2$ and the $4$ reduce to $\\frac{1}{2}$.",
    "steps": [
      "Outer $\\sqrt{A}$ with $A=\\sin\\sqrt{\\cos x^2}$: gives $\\frac{1}{2\\sqrt{\\sin\\sqrt{\\cos x^2}}}$.",
      "$A'=\\cos\\sqrt{\\cos x^2}\\cdot\\left(\\sqrt{\\cos x^2}\\right)'$, and $\\left(\\sqrt{\\cos x^2}\\right)'=\\frac{-\\sin x^2\\cdot2x}{2\\sqrt{\\cos x^2}}$.",
      "Multiply: $\\frac{2x}{4}=\\frac{x}{2}$, giving $-\\frac{x\\cos\\sqrt{\\cos x^2}\\,\\sin x^2}{2\\sqrt{\\sin\\sqrt{\\cos x^2}}\\sqrt{\\cos x^2}}$ (where $\\cos x^2>0$)."
    ],
    "trap": "Taking only one $\\frac12$ for the two roots, making the answer twice as big; or dropping the minus sign from differentiating $\\cos$.",
    "check": "As $x$ grows slightly, $\\cos x^2$ decreases and the whole chain decreases with it, so the derivative should be negative for $x>0$."
  },
  "ch-pow-001": {
    "spot": "Both base and exponent contain $x$: for $(\\sin x)^{\\tan x}$ neither the power rule nor the exponential rule applies directly — use logarithmic differentiation.",
    "why": "After taking $\\ln$ it becomes the product $\\tan x\\ln\\sin x$; use the Product Rule, then multiply back by the original function.",
    "steps": [
      "$\\ln y=\\tan x\\,\\ln\\sin x$ ($\\sin x>0$ for $0<x<\\pi$).",
      "Product Rule: $\\frac{y'}{y}=\\sec^2x\\,\\ln\\sin x+\\tan x\\cdot\\frac{\\cos x}{\\sin x}=\\frac{\\ln\\sin x}{\\cos^2x}+1$.",
      "$y'=(\\sin x)^{\\tan x}\\left(\\frac{\\ln\\sin x}{\\cos^2x}+1\\right)$."
    ],
    "trap": "Differentiating as a power, $\\tan x(\\sin x)^{\\tan x-1}\\cos x$, which only gives the $+1$ part and misses $\\frac{\\ln\\sin x}{\\cos^2x}$.",
    "check": "Check at $x=\\frac\\pi4$: $\\ln\\sin x=-\\frac12\\ln2$ and $\\sec^2x=2$, so $\\frac{y'}{y}=1-\\ln2\\approx0.307$."
  },
  "cl-der-016": {
    "spot": "Given $\\tan\\psi=\\frac{r}{dr/d\\theta}$, you only need $r$ and $r'$ at $\\theta=\\frac{2\\pi}{3}$; the cardioid also has the neat result $\\psi=\\frac\\theta2$.",
    "why": "Plugging into the formula is fastest; the half-angle identity $\\frac{1-\\cos\\theta}{\\sin\\theta}=\\tan\\frac\\theta2$ explains why the answer is exactly $\\frac{\\theta}{2}$.",
    "steps": [
      "$r=1-\\cos\\frac{2\\pi}{3}=\\frac32$.",
      "$\\frac{dr}{d\\theta}=\\sin\\theta$, which at $\\frac{2\\pi}{3}$ is $\\frac{\\sqrt3}{2}$.",
      "$\\tan\\psi=\\frac{3/2}{\\sqrt3/2}=\\sqrt3$.",
      "$0<\\psi<\\pi$ and $\\tan\\psi>0$, so $\\psi=\\frac\\pi3$."
    ],
    "trap": "Using the formula upside down, $\\tan\\psi=\\frac{r'}{r}=\\frac{1}{\\sqrt3}$, which gives $\\frac\\pi6$.",
    "check": "Half-angle formula: $\\frac{1-\\cos\\theta}{\\sin\\theta}=\\tan\\frac\\theta2$, so on the cardioid $\\psi=\\frac\\theta2=\\frac\\pi3$."
  },
  "cl-der-021": {
    "spot": "The envelope of a family of curves $F(x,y,c)=0$: solve $F=0$ and $\\frac{\\partial F}{\\partial c}=0$ together and eliminate the parameter $c$.",
    "why": "Each point of the envelope is a limit of intersections of neighboring curves, which is exactly the condition $\\partial_cF=0$; eliminating $c$ gives the equation.",
    "steps": [
      "$F=(x-c)^2+y^2-\\frac{c^2}{2}$, $\\frac{\\partial F}{\\partial c}=-2(x-c)-c=0$, giving $c=2x$.",
      "Substitute back into $F=0$: $x^2+y^2-2x^2=0$, i.e. $y^2=x^2$.",
      "The envelope is $y=\\pm x$, so $k=1$."
    ],
    "trap": "Taking the partial derivative in $x$ or $y$ only (that finds tangent lines to the circles) — that doesn't give the envelope; you must differentiate with respect to the parameter $c$.",
    "check": "Geometry: the distance from the center $(c,0)$ to the line $y=x$ is $\\frac{|c|}{\\sqrt2}$, exactly the radius $\\frac{|c|}{\\sqrt2}$, so every circle is tangent to this line."
  },
  "cl-der-036": {
    "spot": "The normal plane is the plane whose normal vector is the tangent vector: the three components of $\\mathbf r'(1)$ are the coefficients of $x,y,z$, matching the $1,2,3$ in the problem.",
    "why": "Find the point and the tangent vector, write the point-normal form, and $D$ falls out; no need for the tangent line equation.",
    "steps": [
      "$\\mathbf r'(t)=(1,2t,3t^2)$, which at $t=1$ is $(1,2,3)$.",
      "The point of tangency is $\\mathbf r(1)=(1,1,1)$.",
      "Normal plane $1(x-1)+2(y-1)+3(z-1)=0$, i.e. $x+2y+3z=1+2+3=6$."
    ],
    "trap": "Confusing it with the tangent line, or using $(1,2,3)$ (the tangent vector) as the point and getting $D=1+4+9=14$.",
    "check": "Plugging the point $(1,1,1)$ into $x+2y+3z$ must give $D$."
  },
  "cl-lim-005": {
    "spot": "A difference of two square roots whose insides differ only by $\\tan x$ versus $\\sin x$: rationalizing moves the difference to the numerator as $\\tan x-\\sin x$, which is a third-order infinitesimal.",
    "why": "Expanding the root difference directly needs two Taylor series; after rationalizing the denominator tends to $2$, and the order is decided entirely by $\\tan x-\\sin x=\\tan x(1-\\cos x)\\sim\\frac{x^3}{2}$.",
    "steps": [
      "Rationalize: $\\sqrt{1+\\tan x}-\\sqrt{1+\\sin x}=\\frac{\\tan x-\\sin x}{\\sqrt{1+\\tan x}+\\sqrt{1+\\sin x}}$.",
      "$\\tan x-\\sin x=\\tan x(1-\\cos x)\\sim x\\cdot\\frac{x^2}{2}=\\frac{x^3}{2}$.",
      "The denominator $\\to2$, so the whole expression $\\sim\\frac{x^3}{4}$, $c=\\frac14$.",
      "So $k=3$."
    ],
    "trap": "Using $\\tan x\\sim x$ and $\\sin x\\sim x$ and subtracting to get $0$, then concluding first order or being unable to tell; equivalent infinitesimals can't be used inside sums and differences.",
    "check": "At $x=0.01$: the difference is about $2.5\\times10^{-7}$, and dividing by $x^3=10^{-6}$ gives about $0.25$ — exactly third order with coefficient $\\frac14$."
  },
  "cl-lim-006": {
    "spot": "$1$ minus a product of three $\\cos$ terms: each $\\cos kx\\approx1-\\frac{k^2x^2}{2}$, so to second order the product just needs the three $\\frac{k^2}{2}$ added up.",
    "why": "Expanding the product to second order, all cross terms are fourth order or higher and can be dropped; so $c=\\frac{1+4+9}{2}$ — faster than L'Hôpital's Rule on a triple product.",
    "steps": [
      "$1-\\cos kx\\sim\\frac{k^2x^2}{2}$: $k=1,2,3$ give $\\frac12,2,\\frac92$.",
      "$(1-a)(1-b)(1-c)=1-(a+b+c)+\\text{(higher order)}$, so $1-\\cos x\\cos2x\\cos3x\\sim\\left(\\frac12+2+\\frac92\\right)x^2=7x^2$.",
      "$c=7$."
    ],
    "trap": "Thinking the $1-\\prod$ of a product means multiplying: $\\frac12\\cdot2\\cdot\\frac92=\\frac92$; to second order they add, not multiply.",
    "check": "At $x=0.01$: $\\frac{1-\\cos0.01\\cos0.02\\cos0.03}{0.0001}\\approx6.999$."
  },
  "cl-lim-013": {
    "spot": "Both roots are $1+x+\\cdots$ — the linear terms are identical and cancel; the denominator $x^2$ tells you to expand to second order and compare coefficients.",
    "why": "With $(1+u)^\\alpha=1+\\alpha u+\\frac{\\alpha(\\alpha-1)}{2}u^2$ it takes two lines; the equivalence $\\sim1+x$ cancels everything on both sides and hides the answer.",
    "steps": [
      "$\\sqrt{1+2x}=1+x-\\frac{x^2}{2}+\\cdots$ ($\\alpha=\\frac12$, $u=2x$: $\\frac{\\frac12\\cdot(-\\frac12)}{2}\\cdot4=-\\frac12$).",
      "$\\sqrt[3]{1+3x}=1+x-x^2+\\cdots$ ($\\alpha=\\frac13$, $u=3x$: $\\frac{\\frac13\\cdot(-\\frac23)}{2}\\cdot9=-1$).",
      "Subtract: $-\\frac12-(-1)=\\frac12$."
    ],
    "trap": "Expanding only to first order — both are $1+x$ — and concluding the limit is $0$.",
    "check": "At $x=0.01$: numerator $\\approx1.0099505-1.0099016=0.0000489$, divided by $0.0001$ gives about $0.49$."
  },
  "cl-lim-014": {
    "spot": "Two $\\ln$ terms added, with insides $1+x+x^2$ and $1-x+x^2$ — differing only in the middle sign: combine into one $\\ln$ first; the product is $(1+x^2)^2-x^2=1+x^2+x^4$.",
    "why": "After combining, the linear terms vanish automatically, leaving $\\ln(1+x^2+x^4)\\sim x^2$; expanding each separately requires going to second order and watching the cross terms.",
    "steps": [
      "$\\ln a+\\ln b=\\ln ab$, and $(1+x+x^2)(1-x+x^2)=1+x^2+x^4$.",
      "$\\ln(1+u)\\sim u$ with $u=x^2+x^4\\sim x^2$.",
      "So $\\frac{\\ln(1+x^2+x^4)}{x^2}\\to1$."
    ],
    "trap": "Applying $\\ln(1+u)\\sim u$ separately with only $u=x+x^2$ and $u=-x+x^2$, adding to get $2x^2$ and answering $2$; this misses the two $-\\frac{x^2}{2}$ terms coming from $-\\frac{u^2}{2}$.",
    "check": "Expanding each to second order: $\\left(x+x^2-\\frac{x^2}{2}\\right)+\\left(-x+x^2-\\frac{x^2}{2}\\right)=x^2$, also giving $1$."
  },
  "cl-lim-018": {
    "spot": "The numerator has an oscillating term $x^2\\sin\\frac1x$: it is one order smaller than $x$ and gets squeezed to $0$; dividing top and bottom by $x$ makes this clear.",
    "why": "L'Hôpital's Rule fails here (the resulting $\\cos\\frac1x$ has no limit), but that doesn't mean the original limit doesn't exist; dividing by $x$ and then squeezing is the right way.",
    "steps": [
      "Divide through by $x$: $\\frac{x\\sin\\frac1x+3}{\\frac{\\sin x}{x}}$.",
      "$\\left|x\\sin\\frac1x\\right|\\le|x|\\to0$, so by the Squeeze Theorem $x\\sin\\frac1x\\to0$; and $\\frac{\\sin x}{x}\\to1$.",
      "Limit $=\\frac{0+3}{1}=3$."
    ],
    "trap": "Using L'Hôpital's Rule to get $\\frac{2x\\sin\\frac1x-\\cos\\frac1x+3}{\\cos x}$, seeing $\\cos\\frac1x$ oscillate and declaring the limit doesn't exist; L'Hôpital only gives a conclusion when the limit of the ratio of derivatives exists.",
    "check": "Plug in a very small $x$: at $x=0.001$ the value is within $3\\pm0.002$."
  },
  "cl-lim-021": {
    "spot": "$\\sqrt{x^2-x+1}-ax-b\\to0$ says that $y=ax+b$ is a slant asymptote: $a=\\lim\\frac{\\sqrt{x^2-x+1}}{x}$, $b=\\lim\\left(\\sqrt{x^2-x+1}-ax\\right)$.",
    "why": "First get the slope by dividing by $x$, then rationalize to get the intercept; or complete the square, $\\sqrt{(x-\\frac12)^2+\\frac34}\\approx x-\\frac12$, and see it at a glance.",
    "steps": [
      "Divide by $x$: $\\frac{\\sqrt{x^2-x+1}}{x}\\to1$, so $a=1$.",
      "Rationalize: $\\sqrt{x^2-x+1}-x=\\frac{-x+1}{\\sqrt{x^2-x+1}+x}\\to-\\frac12$, so $b=-\\frac12$.",
      "$a+b=1-\\frac12=\\frac12$."
    ],
    "trap": "Treating the denominator after rationalizing as $x$ instead of $2x$, giving $b=-1$ and $a+b=0$.",
    "check": "Complete the square: $x^2-x+1=\\left(x-\\frac12\\right)^2+\\frac34$, so for large $x$ the root is $\\approx x-\\frac12$."
  },
  "cl-lim-025": {
    "spot": "For $f$ to be continuous at $0$, $k$ must equal $\\lim_{x\\to0}(1+\\sin3x)^{\\cot x}$: base tends to $1$, exponent $\\cot x\\to\\infty$ — a $1^\\infty$ form.",
    "why": "Taking logs gives $\\cot x\\ln(1+\\sin3x)$, and multiplying two equivalent infinitesimals finishes it.",
    "steps": [
      "Continuous $\\Leftrightarrow k=\\lim_{x\\to0}f(x)$; write it as $e^{\\cot x\\ln(1+\\sin3x)}$.",
      "$\\ln(1+\\sin3x)\\sim\\sin3x\\sim3x$, $\\cot x\\sim\\frac1x$, so the exponent $\\to3$.",
      "$k=e^3$."
    ],
    "trap": "Setting $k=1$ because the base tends to $1$; or checking only the right-hand limit — here both sides give $e^3$ (for $x<0$, $\\cot x$ and $\\ln(1+\\sin 3x)$ both change sign).",
    "check": "Left and right limits agree: approaching from the left also gives $e^3$."
  },
  "cl-lim-031": {
    "spot": "$x^{2n}$ blows up for $|x|>1$ and tends to $0$ for $|x|<1$: $f(x)$ is piecewise constant, $1$ on one side of $1$ and $-1$ on the other.",
    "why": "Take the limit in $n$ first to write $f$ as a piecewise function, and the jump is obvious; for the case greater than $1$, divide top and bottom by $x^{2n}$.",
    "steps": [
      "$|x|>1$: dividing by $x^{2n}$ gives $\\frac{1-x^{-2n}}{1+x^{-2n}}\\to1$.",
      "$|x|<1$: $x^{2n}\\to0$, so $f(x)=\\frac{0-1}{0+1}=-1$.",
      "So $f(1^+)=1$ and $f(1^-)=-1$, a jump of $1-(-1)=2$."
    ],
    "trap": "Plugging in $x=1$ to get $f(1)=0$ and using it to compute a jump of $1$; the jump depends on the two one-sided limits, not on the value $f(1)$.",
    "check": "$f(x)$ is really $\\operatorname{sgn}(|x|-1)$, jumping from $-1$ to $1$ at $x=1$."
  },
  "cl-lim-048": {
    "spot": "$nx^{n-1}$ is the derivative of $x^n$, its integral over $[0,1]$ is always $1$, and its mass piles up at $x=1$: the limit is the value of $\\frac{1}{2+x}$ at $x=1$.",
    "why": "Integration by parts turns $nx^{n-1}dx$ into $d(x^n)$; the boundary term gives $\\frac13$ and the remaining integral is squeezed to $0$ by $\\frac{1}{n+1}$ — no need to actually compute the integral.",
    "steps": [
      "Integration by parts: $\\int_0^1\\frac{d(x^n)}{2+x}=\\left[\\frac{x^n}{2+x}\\right]_0^1+\\int_0^1\\frac{x^n}{(2+x)^2}dx=\\frac13+\\int_0^1\\frac{x^n}{(2+x)^2}dx$.",
      "$\\frac{1}{(2+x)^2}\\le\\frac14$, so the remaining integral is $\\le\\frac14\\int_0^1x^n\\,dx=\\frac{1}{4(n+1)}$.",
      "$\\frac{1}{4(n+1)}\\to0$, so by the Squeeze Theorem the limit is $\\frac13$."
    ],
    "trap": "Seeing $x^{n-1}\\to0$ (for $x<1$) and concluding the whole integral tends to $0$; the factor $n$ in front restores the mass, since $\\int_0^1nx^{n-1}dx=1$ always.",
    "check": "At $n=50$ the integral is already about $0.3335$, just a hair above $\\frac13$."
  },
  "cl-ser-006": {
    "spot": "$33=32\\cdot\\left(1+\\frac1{32}\\right)$ and $\\sqrt[5]{32}=2$: $\\sqrt[5]{33}=2\\left(1+\\frac{1}{32}\\right)^{1/5}$, and the binomial series with small $u=\\frac1{32}$ converges fast.",
    "why": "Pulling out the nearest fifth power makes $u$ small; from the second term on the series alternates with decreasing terms, so the error is less than the first omitted term and you can see at once where to stop.",
    "steps": [
      "$\\sqrt[5]{33}=2\\left(1+u\\right)^{1/5}$, $u=\\frac{1}{32}$.",
      "$(1+u)^{1/5}=1+\\frac{u}{5}-\\frac{2}{25}u^2+\\frac{6}{125}u^3-\\cdots$; after multiplying by $2$ the terms are $2$, $\\frac{1}{80}$, $-\\frac{1}{6400}$, $+\\frac{12}{125\\cdot32^3}$.",
      "The third term $\\frac{1}{6400}\\approx1.56\\times10^{-4}$ exceeds $10^{-4}$ and can't be dropped; the fourth is about $2.9\\times10^{-6}$, so stop there.",
      "Take three terms: $2+\\frac{1}{80}-\\frac{1}{6400}=\\frac{12879}{6400}$."
    ],
    "trap": "Taking only two terms, $2+\\frac1{80}=\\frac{161}{80}$, with error about $1.53\\times10^{-4}$, which exceeds the requirement; or comparing the second term $\\frac{1}{80}$ with $10^{-4}$ and stopping after one term.",
    "check": "Against the true value: $\\frac{12879}{6400}-\\sqrt[5]{33}$ is less than $10^{-5}$ in absolute value, while the two-term version is off by more than $10^{-4}$."
  },
  "cl-ser-007": {
    "spot": "$\\frac{\\sin x}{x}$ has no elementary antiderivative, but its power series $1-\\frac{x^2}{3!}+\\frac{x^4}{5!}-\\cdots$ can be integrated term by term; the result is an alternating series, with error less than the first dropped term.",
    "why": "The alternating-series error bound is the simplest: compute until a term drops below $10^{-4}$ and keep everything before it.",
    "steps": [
      "Integrate term by term: $\\int_0^1\\frac{\\sin x}{x}dx=\\sum_{n\\ge0}\\frac{(-1)^n}{(2n+1)\\,(2n+1)!}=1-\\frac{1}{18}+\\frac{1}{600}-\\frac{1}{35280}+\\cdots$.",
      "The third term $\\frac{1}{600}\\approx1.7\\times10^{-3}$ can't be dropped; the fourth $\\frac{1}{35280}\\approx2.8\\times10^{-5}<10^{-4}$, so stop.",
      "Take the first three terms: $1-\\frac{1}{18}+\\frac{1}{600}=\\frac{1800-100+3}{1800}=\\frac{1703}{1800}$."
    ],
    "trap": "Forgetting the extra division by $2n+1$ from integrating, using $\\frac{1}{3!}$, $\\frac{1}{5!}$ directly as the integrated coefficients and getting $1-\\frac16+\\frac1{120}$.",
    "check": "Against numerical integration: $\\int_0^1\\frac{\\sin x}{x}dx\\approx0.946083$ and $\\frac{1703}{1800}\\approx0.946111$, a difference of $2.8\\times10^{-5}$."
  }
};
