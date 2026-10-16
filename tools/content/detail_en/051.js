// Detail v2, English — batch 051. Translation of tools/content/detail/051.js (text only; claims live in the Chinese file).
module.exports = {
  "refine-series-022": {
    "spot": "The exponent $(-1)^{n+1}$ makes the factors alternate between $\\frac{n+1}{n}$ and $\\frac{n}{n+1}$; bundling neighbors in pairs gives $\\frac{2k}{2k-1}\\cdot\\frac{2k}{2k+1}$, exactly the shape of the Wallis product.",
    "why": "One at a time, the factors jump around between $2$ and $\\frac23$ and you cannot see a limit; paired up they become the familiar $\\prod\\frac{4k^2}{4k^2-1}$, which the product formula for sine gives directly.",
    "steps": [
      "$n=2k-1$ (odd) gives $\\frac{2k}{2k-1}$ and $n=2k$ (even) gives $\\left(\\frac{2k+1}{2k}\\right)^{-1}=\\frac{2k}{2k+1}$; one pair multiplies to $\\frac{4k^2}{4k^2-1}$.",
      "Put $x=\\frac{\\pi}{2}$ into the sine product formula $\\frac{\\sin x}{x}=\\prod_{k\\ge1}\\left(1-\\frac{x^2}{k^2\\pi^2}\\right)$: $\\frac{2}{\\pi}=\\prod_{k\\ge1}\\left(1-\\frac{1}{4k^2}\\right)=\\prod_{k\\ge1}\\frac{4k^2-1}{4k^2}$.",
      "Take reciprocals: the first $2N$ factors $\\prod_{k=1}^{N}\\frac{4k^2}{4k^2-1}\\to\\frac{\\pi}{2}$.",
      "With an odd number of factors there is one extra $\\frac{2N+2}{2N+1}\\to1$, so the limit does not change. The product $=\\frac{\\pi}{2}$."
    ],
    "trap": "Thinking the alternating exponent makes the factors cancel in pairs to $1$; in fact the first pair is already $2\\cdot\\frac23=\\frac43\\ne1$, and every pair is a bit larger than $1$.",
    "check": "The first four factors give $2\\cdot\\frac23\\cdot\\frac43\\cdot\\frac45=\\frac{64}{45}\\approx1.42$; the partial products with an even number of factors climb slowly from below toward $\\frac{\\pi}{2}\\approx1.571$."
  },
  "refine-series-026": {
    "spot": "The summand depends only on $m+n$: collect the terms with $m+n=k$ and the double sum becomes a single sum, with exactly $k-1$ pairs $(m,n)$ for each $k\\ge2$.",
    "why": "A positive series can be regrouped freely; grouping along the diagonals $m+n=k$ is much cleaner than summing over $n$ first (which leaves an awkward tail).",
    "steps": [
      "Group by $k=m+n$: $k=2$ has only $(1,1)$, $k=3$ has $(1,2),(2,1)$, and so on, so the sum $=\\sum_{k\\ge2}\\frac{k-1}{k\\,2^k}$.",
      "Split: $\\frac{k-1}{k\\,2^k}=\\frac{1}{2^k}-\\frac{1}{k\\,2^k}$.",
      "Geometric: $\\sum_{k\\ge2}\\frac{1}{2^k}=\\frac12$.",
      "$\\sum_{k\\ge1}\\frac{x^k}{k}=-\\ln(1-x)$ is $\\ln 2$ at $x=\\frac12$; remove the $k=1$ term $\\frac12$: $\\sum_{k\\ge2}\\frac{1}{k\\,2^k}=\\ln2-\\frac12$.",
      "Sum $=\\frac12-\\left(\\ln2-\\frac12\\right)=1-\\ln 2$."
    ],
    "trap": "Counting $k$ pairs for each $k$ (including $m=0$ or $n=0$) turns the sum into $\\sum_{k\\ge2}\\frac{1}{2^k}=\\frac12$.",
    "check": "The first two terms give $\\frac18+\\frac1{12}\\approx0.208$ and each later term roughly halves, so a total of $1-\\ln2\\approx0.307$ is reasonable."
  },
  "refine-series-030": {
    "spot": "In $n$ it is a geometric series with ratio $-\\frac1k$, so each $k$ has a closed form; but the problem sums over $k$ first, so to swap the order you must first confirm absolute convergence.",
    "why": "Summing over $k$ first, as written, gives an alternating sum of $\\zeta(n)-1$, which is hard; after swapping, each $k$ is a geometric series, and telescoping finishes it.",
    "steps": [
      "The double sum of absolute values: $\\sum_{k\\ge2}\\sum_{n\\ge2}k^{-n}=\\sum_{k\\ge2}\\frac{1}{k(k-1)}=1<\\infty$, so the order of summation can be swapped.",
      "Fix $k$: $\\sum_{n\\ge2}\\left(-\\frac1k\\right)^n=\\frac{1/k^2}{1+1/k}=\\frac{1}{k(k+1)}$.",
      "Telescoping: $\\frac{1}{k(k+1)}=\\frac1k-\\frac1{k+1}$, which summed from $k=2$ gives $\\frac12$."
    ],
    "trap": "Writing the ratio as $\\frac1k$ without the minus sign gives $\\frac{1}{k(k-1)}$ for each row and the answer $1$ (that is the sum of the absolute-value series).",
    "check": "Look row by row in $n$: the $n=2$ row is $\\frac{\\pi^2}{6}-1\\approx0.645$, the $n=3$ row subtracts about $0.202$, and the alternating sum lands between $0.443$ and $0.645$, so $\\frac12$ is reasonable."
  },
  "refine-series-040": {
    "spot": "A linear recurrence $a_{n+1}=2a_n+n$ plus \"evaluate the power series at $\\frac13$\" — a classic generating function problem; $\\frac13<\\frac12$ sits right inside the region of convergence.",
    "why": "A generating function turns the recurrence into an algebraic equation in one go, with no need to guess the general term; guessing $a_n=2^n-n-1$ and splitting into three series also works, and makes a good check.",
    "steps": [
      "Let $A(x)=\\sum_{n\\ge0}a_nx^n$. Multiply the recurrence by $x^{n+1}$ and sum: $A(x)-a_0=2xA(x)+\\sum_{n\\ge0}nx^{n+1}=2xA(x)+\\frac{x^2}{(1-x)^2}$.",
      "With $a_0=0$, solve: $A(x)=\\frac{x^2}{(1-x)^2(1-2x)}$, convergent for $|x|<\\frac12$; expanding the first few terms gives $a_2=1$ and $a_3=4$, matching the recurrence.",
      "Set $x=\\frac13$: $\\frac{1/9}{(4/9)(1/3)}=\\frac34$.",
      "Compare with the general term $a_n=2^n-n-1$ (which satisfies the recurrence): $\\sum\\frac{2^n-n-1}{3^n}=3-\\frac34-\\frac32=\\frac34$."
    ],
    "trap": "Writing $\\sum nx^{n+1}$ as $\\frac{x}{(1-x)^2}$ (one factor of $x$ short) gives $A(x)=\\frac{x}{(1-x)^2(1-2x)}$, which evaluates to $\\frac94$.",
    "check": "The first few terms $\\frac19+\\frac4{27}+\\frac{11}{81}\\approx0.395$; later terms are of order $\\left(\\frac23\\right)^n$ and slowly fill in up to $0.75$."
  },
  "refine-series-045": {
    "spot": "$\\sum_{k\\le n}\\frac1{k^2}-\\frac{\\pi^2}{6}$ is minus the tail, $-\\sum_{k>n}\\frac1{k^2}$, and $\\frac1n-\\frac1{2n^2}$ are exactly the first two terms of the tail's expansion — the problem is asking for the coefficient of the third term.",
    "why": "The Euler-Maclaurin expansion of the tail (integral plus endpoint correction plus the $B_2$ correction) goes straight to order $\\frac1{n^3}$; multiplying by $n^3$ leaves only that coefficient.",
    "steps": [
      "The bracket $=\\frac1n-\\frac1{2n^2}-\\sum_{k>n}\\frac1{k^2}$; the tail lies between $\\frac1{n+1}$ and $\\frac1n$, with leading term $\\frac1n$.",
      "Euler-Maclaurin (with $f(x)=\\frac1{x^2}$): $\\sum_{k>n}f(k)=\\int_n^\\infty f\\,dx-\\frac{f(n)}{2}-\\frac{B_2}{2!}f'(n)+\\cdots=\\frac1n-\\frac1{2n^2}+\\frac1{6n^3}-\\frac1{30n^5}+\\cdots$.",
      "So the bracket $=-\\frac{1}{6n^3}+O\\!\\left(\\frac1{n^5}\\right)$, and after multiplying by $n^3$ it lies between $-\\frac16$ and $-\\frac16+\\frac1{30n^2}$.",
      "The limit is $-\\frac16$."
    ],
    "trap": "Getting the sign of the endpoint correction wrong (writing the tail as $\\frac1n+\\frac1{2n^2}+\\cdots$) leaves the bracket of order $\\frac1{n^2}$, and after multiplying by $n^3$ you think it diverges.",
    "check": "Direct computation at $n=3$: $1+\\frac14+\\frac19-\\frac{\\pi^2}{6}+\\frac13-\\frac1{18}\\approx-0.00605$; times $27$ gives $-0.163$, already close to $-\\frac16$."
  },
  "refine-series-050": {
    "spot": "$c_k=\\binom{2k}{k}\\frac1{4^k}$ satisfies $c_k=c_{k-1}\\cdot\\frac{2k-1}{2k}$, and the partial sums have the closed form $\\sum_{k=0}^{n}c_k=(2n+1)c_n$; add $c_n\\sim\\frac1{\\sqrt{\\pi n}}$ and you are done.",
    "why": "Using Stirling term by term and then an integral comparison also works, but the partial sum telescopes exactly to $(2n+1)c_n$, so a single asymptotic is enough and there is no summation error to manage.",
    "steps": [
      "Ratio: $\\frac{c_k}{c_{k-1}}=\\frac{(2k)(2k-1)}{k^2\\cdot4}=\\frac{2k-1}{2k}$.",
      "Telescoping: $(2k+1)c_k-(2k-1)c_{k-1}=c_{k-1}\\left[\\frac{(2k+1)(2k-1)}{2k}-(2k-1)\\right]=c_{k-1}\\cdot\\frac{2k-1}{2k}=c_k$, so $\\sum_{k=0}^{n}c_k=(2n+1)c_n$ ($n=2$: $1+\\frac12+\\frac38=5\\cdot\\frac38$).",
      "Wallis: $c_n=\\frac2\\pi\\int_0^{\\pi/2}\\sin^{2n}t\\,dt$, and $\\sqrt{\\pi n}\\,c_n\\to1$ (it lies between $1-\\frac1{8n}$ and $1$).",
      "$\\frac{(2n+1)c_n}{\\sqrt n}\\sim\\frac{2n+1}{\\sqrt n\\cdot\\sqrt{\\pi n}}\\to\\frac{2}{\\sqrt\\pi}$."
    ],
    "trap": "Seeing $c_k\\sim\\frac1{\\sqrt{\\pi k}}$ and treating $\\sum_{k\\le n}\\frac1{\\sqrt k}$ as $\\sqrt n$ gives $\\frac{1}{\\sqrt\\pi}$; in fact $\\int_0^n\\frac{dx}{\\sqrt x}=2\\sqrt n$.",
    "check": "$n=2$: the partial sum $\\frac{15}{8}$ divided by $\\sqrt2$ is about $1.33$, larger than the limit $\\frac2{\\sqrt\\pi}\\approx1.128$; the extra $1$ in $(2n+1)$ compared with $2n$ is exactly why small $n$ comes out high."
  },
  "refine-series-056": {
    "spot": "$H_n$ is the partial sum of $\\frac1k$, and \"generating function of partial sums $=$ original generating function $\\div(1-x)$\"; $\\frac{(-1)^{n+1}}{2^n}$ is just evaluating at $x=-\\frac12$ and flipping the sign.",
    "why": "Splitting $H_n$ into a double sum and swapping also works, but $\\sum H_nx^n=\\frac{-\\ln(1-x)}{1-x}$ comes from a Cauchy product in one step, so plugging in directly is fastest.",
    "steps": [
      "$\\sum_{n\\ge1}H_nx^n=\\left(\\sum_{k\\ge1}\\frac{x^k}{k}\\right)\\left(\\sum_{j\\ge0}x^j\\right)=\\frac{-\\ln(1-x)}{1-x}$ for $|x|<1$.",
      "$(-1)^{n+1}=-(-1)^n$, so the sum we want $=-\\sum H_n\\left(-\\frac12\\right)^n$.",
      "Substitute: $\\frac{-\\ln(3/2)}{3/2}=-\\frac23\\ln\\frac32$; flipping the sign gives $\\frac23\\ln\\frac32$."
    ],
    "trap": "Forgetting that $(-1)^{n+1}$ has one more minus sign than $(-1)^n$ and answering $-\\frac23\\ln\\frac32\\approx-0.270$; the first term $\\frac12$ is positive, so that cannot be right.",
    "check": "The first three terms give $\\frac12-\\frac{3/2}{4}+\\frac{11/6}{8}\\approx0.354$; subtracting the fourth term $\\frac{25/12}{16}\\approx0.130$ gives $0.224$. The alternating sum lies between these two, so $0.270$ is reasonable."
  },
  "refine-series-061": {
    "spot": "The denominator $n^2+1$ is exactly the $1+n^2$ in the Fourier coefficients of $\\cosh x$, and the sign $(-1)^n$ comes from $\\cos(n\\pi)$; the problem wants the value of the series at $x=0$.",
    "why": "Compute the coefficients, evaluate at a point of continuity, and you \"read off\" the series sum from a known function; $\\sum\\frac{(-1)^{n+1}}{n^2+1}$ itself has no elementary summation tool.",
    "steps": [
      "$\\cosh x$ is even, so only cosine terms appear; integrating by parts twice: $a_n=\\frac1\\pi\\int_{-\\pi}^{\\pi}\\cosh x\\cos nx\\,dx=\\frac{2(-1)^n\\sinh\\pi}{\\pi(1+n^2)}$.",
      "$a_0=\\frac1\\pi\\int_{-\\pi}^{\\pi}\\cosh x\\,dx=\\frac{2\\sinh\\pi}{\\pi}$, so the constant term is $\\frac{a_0}{2}=\\frac{\\sinh\\pi}{\\pi}$.",
      "The periodic extension is continuous ($\\cosh(-\\pi)=\\cosh\\pi$), so the series converges at $x=0$ to $\\cosh0=1$: $1=\\frac{\\sinh\\pi}{\\pi}\\left[1+2\\sum_{n\\ge1}\\frac{(-1)^n}{1+n^2}\\right]$.",
      "Solve: $\\sum\\frac{(-1)^n}{n^2+1}=\\frac12\\left(\\frac{\\pi}{\\sinh\\pi}-1\\right)$; the sum we want is its negative, $\\frac12\\left(1-\\frac{\\pi}{\\sinh\\pi}\\right)$."
    ],
    "trap": "The problem has $(-1)^{n+1}$ while the coefficients have $(-1)^n$; forgetting to flip the sign gives $\\frac12\\left(\\frac{\\pi}{\\sinh\\pi}-1\\right)\\approx-0.364$. The first term $\\frac12$ is positive, so the sum cannot be negative.",
    "check": "An alternating series' sum lies between consecutive partial sums: $\\frac12-\\frac15=0.3$ and $\\frac12-\\frac15+\\frac1{10}=0.4$, and $0.364$ falls in between."
  },
  "refine-series-066": {
    "spot": "Every term is bounded by $\\frac1{2^n}$, so the convergence is uniform and you can integrate term by term; after integrating, $\\frac{\\sin(n\\pi/2)}{n}$ keeps only odd terms with alternating signs, which is the $\\arctan$ series.",
    "why": "Summing the series first to $\\frac{2\\cos x-1}{5-4\\cos x}$ and then integrating also works, but that integral needs the Weierstrass substitution; term-by-term integration lands directly on the familiar $\\arctan$ series.",
    "steps": [
      "Weierstrass M-test: $\\left|\\frac{\\cos nx}{2^n}\\right|\\le\\frac1{2^n}$ and $\\sum\\frac1{2^n}$ converges, so the convergence is uniform and term-by-term integration is allowed.",
      "$\\int_0^{\\pi/2}\\cos nx\\,dx=\\frac{\\sin(n\\pi/2)}{n}$.",
      "$\\sin\\frac{n\\pi}{2}$ is $0$ for even $n$ and $(-1)^j$ for $n=2j+1$. The sum $=\\sum_{j\\ge0}\\frac{(-1)^j}{(2j+1)\\,2^{2j+1}}=\\frac12-\\frac{1}{3\\cdot8}+\\frac{1}{5\\cdot32}-\\cdots$.",
      "This is $\\arctan y=\\sum_{j\\ge0}\\frac{(-1)^jy^{2j+1}}{2j+1}$ at $y=\\frac12$: the answer is $\\arctan\\frac12$."
    ],
    "trap": "Thinking every term contributes $\\frac1n$ (treating all of $\\sin\\frac{n\\pi}{2}$ as $1$) gives $\\sum\\frac{1}{n2^n}=\\ln2\\approx0.693$.",
    "check": "Sum first instead: $\\sum\\frac{\\cos nx}{2^n}=\\frac{2\\cos x-1}{5-4\\cos x}$, and numerically integrating $\\int_0^{\\pi/2}$ also gives $0.4636$."
  },
  "refine-series-072": {
    "spot": "$\\frac{n}{n+1}=1-\\frac1{n+1}$: split into \"the divergent $1-1+1-\\cdots$ whose Cesaro sum is known\" minus \"a genuinely convergent alternating series\".",
    "why": "Cesaro summation is linear, and the Cesaro sum of a convergent series is just its sum; after splitting, compute each part separately, which is easier than averaging the partial sums directly.",
    "steps": [
      "Split: $(-1)^{n+1}\\frac{n}{n+1}=(-1)^{n+1}-\\frac{(-1)^{n+1}}{n+1}$.",
      "The partial sums of $1-1+1-\\cdots$ are $1,0,1,0,\\dots$; the average of the first $2N$ is exactly $\\frac12$, so the Cesaro sum is $\\frac12$.",
      "$\\sum_{n\\ge1}\\frac{(-1)^{n+1}}{n+1}=\\frac12-\\frac13+\\frac14-\\cdots=1-\\ln2$ converges, so its Cesaro sum is that value.",
      "By linearity: Cesaro sum $=\\frac12-(1-\\ln2)=\\ln2-\\frac12$."
    ],
    "trap": "Getting the sign wrong in the third step: $\\frac12-\\frac13+\\cdots$ is $1-\\ln2$ (positive); writing $\\ln2-1$ gives the answer $\\frac32-\\ln2\\approx0.807$.",
    "check": "The partial sums $\\frac12,-\\frac16,\\frac7{12},\\dots$: the odd-indexed ones head to $\\ln2$ and the even-indexed ones to $\\ln2-1$, and their average is exactly $\\ln2-\\frac12\\approx0.193$."
  },
  "refine-series-076": {
    "spot": "The term $n\\cos\\frac{2n\\pi}{3}$ does not tend to $0$, so the series diverges; the problem specifies the Abel sum: find the sum function for $|x|<1$, then let $x\\to1^-$. The $nx^n$ suggests using $\\sum nz^n=\\frac{z}{(1-z)^2}$.",
    "why": "Writing $\\cos n\\theta$ as $\\mathrm{Re}\\,e^{in\\theta}$ gives the sum function in closed form at once; averaging the partial sums does not work, because partial sums that grow linearly make even the Cesaro average diverge.",
    "steps": [
      "With $z=xe^{i\\theta}$, take the real part of $\\sum nz^n=\\frac{z}{(1-z)^2}$: $\\sum_{n\\ge1}n\\cos(n\\theta)x^n=\\frac{x\\left[(1+x^2)\\cos\\theta-2x\\right]}{(1-2x\\cos\\theta+x^2)^2}$.",
      "$\\theta=\\frac{2\\pi}{3}$, $\\cos\\theta=-\\frac12$: the sum function $=\\frac{x\\left(-\\frac{1+x^2}{2}-2x\\right)}{(1+x+x^2)^2}$.",
      "$x\\to1^-$: numerator $\\to-1-2=-3$, denominator $\\to9$, so the Abel sum is $-\\frac13$."
    ],
    "trap": "Doing things in the wrong order: setting $x=1$ first and then summing gives the divergent $-\\frac12-1+3-2-\\frac52+6-\\cdots$; the Abel sum sums for $|x|<1$ first and takes the limit only at the end.",
    "check": "General formula: the Abel sum of $\\sum n\\cos n\\theta$ is $=-\\frac{1}{4\\sin^2(\\theta/2)}$; at $\\theta=\\frac{2\\pi}{3}$, $\\sin^2\\frac\\pi3=\\frac34$, giving $-\\frac13$."
  },
  "cl-der-042": {
    "spot": "A family of lines with parameter $t$, and the question is about the envelope: solve $F=0$ and $\\frac{\\partial F}{\\partial t}=0$ together and eliminate $t$.",
    "why": "Each point of the envelope is the limit of intersections of neighboring lines, and that condition is exactly $\\partial_tF=0$; guessing \"it's a circular arc\" from intuition has no basis, and is wrong.",
    "steps": [
      "$F=\\frac{x}{\\cos t}+\\frac{y}{\\sin t}-1$, $\\partial_tF=\\frac{x\\sin t}{\\cos^2t}-\\frac{y\\cos t}{\\sin^2t}=0$, i.e. $\\frac{x}{\\cos^3t}=\\frac{y}{\\sin^3t}$.",
      "Call the common value $\\lambda$ and substitute into $F=0$: $\\lambda(\\cos^2t+\\sin^2t)=1$, so $x=\\cos^3t$, $y=\\sin^3t$ (the astroid $x^{2/3}+y^{2/3}=1$).",
      "$x=\\frac18$: $\\cos^3t=\\frac18$, $\\cos t=\\frac12$, $t=\\frac\\pi3$.",
      "$y=\\sin^3\\frac\\pi3=\\left(\\frac{\\sqrt3}{2}\\right)^3=\\frac{3\\sqrt3}{8}$."
    ],
    "trap": "Using the wrong power with $x^{2/3}+y^{2/3}=1$: from $y^{2/3}=\\frac34$, writing $y=\\left(\\frac34\\right)^{2/3}\\approx0.825$; the correct value is $\\left(\\frac34\\right)^{3/2}$.",
    "check": "$\\left(\\frac18\\right)^{2/3}+\\left(\\frac{3\\sqrt3}{8}\\right)^{2/3}=\\frac14+\\frac34=1$, so the point is on the astroid."
  },
  "cl-der-046": {
    "spot": "The curve is the intersection of two surfaces, a sphere and a plane, so its tangent direction is perpendicular to both normal vectors: it is $\\nabla F\\times\\nabla G$.",
    "why": "No need to parametrize the curve (a tilted circle); one cross product of the two gradients gives the tangent vector.",
    "steps": [
      "First check that the point is on both surfaces: $1+4+1=6$ and $1-2+1=0$.",
      "$\\nabla F=(2x,2y,2z)=(2,-4,2)$, $\\nabla G=(1,1,1)$.",
      "Cross product $(-4\\cdot1-2\\cdot1,\\ 2\\cdot1-2\\cdot1,\\ 2\\cdot1-(-4)\\cdot1)=(-6,0,6)\\parallel(-1,0,1)$; its dot product with both normal vectors is $0$.",
      "Tangent line $(1-s,\\,-2,\\,1+s)$; at $x=0$, $s=1$ and $z=2$."
    ],
    "trap": "Using only the sphere's normal $(2,-4,2)$ as the direction: the line $(1+2s,-2-4s,1+2s)$ reaches $x=0$ at $s=-\\frac12$, giving $z=0$ — that is the normal line, not the tangent line.",
    "check": "The point $(0,-2,2)$ also lies on the plane $x+y+z=0$ (the tangent line lies in the plane, as it should)."
  },
  "refine-derivatives-046": {
    "spot": "$y$ is the inverse function of $x=ye^y$, and the derivatives of $x(y)=ye^y$ at $y=0$ are immediate: $x'=1$, $x''=2$, $x'''=3$.",
    "why": "The third-derivative formula for inverse functions needs only $x',x'',x'''$; brute-forcing three implicit differentiations means handling a pile of products of $y'$, and terms get lost easily.",
    "steps": [
      "$x(y)=ye^y$: $x'=(1+y)e^y$, $x''=(2+y)e^y$, $x'''=(3+y)e^y$, which at $y=0$ are $1,2,3$.",
      "Inverse function: $y'=\\frac1{x'}$, $y''=-\\frac{x''}{x'^3}$, $y'''=\\frac{3x''^2-x'x'''}{x'^5}$ (test it with $x=e^y$, $y=\\ln x$: the formula gives $\\frac{2}{x^3}$, which is exactly $(\\ln x)'''$).",
      "Plug in: $y'''(0)=\\frac{3\\cdot2^2-1\\cdot3}{1^5}=9$."
    ],
    "trap": "Carrying the first-order reciprocal relation over to higher orders and thinking $y'''=\\frac{1}{x'''}=\\frac13$.",
    "check": "Plug $y=x-x^2+\\frac32x^3$ (with $\\frac{9}{3!}=\\frac32$) back into $ye^y-x$: the error starts only at $x^4$ (coefficient $\\frac83$), so everything through third order matches."
  },
  "refine-derivatives-048": {
    "spot": "$\\prod\\left(1-\\frac{x^2}{n^2}\\right)$ is the product expansion of $\\frac{\\sin\\pi x}{\\pi x}$; $\\frac{f'}{f}$ is just $(\\ln f)'$, and taking logs turns the product into a sum.",
    "why": "Once you recognize the closed form of $f$, the logarithmic derivative is one line; the term-by-term $\\sum\\frac{-2x}{n^2-x^2}$ cannot be summed in closed form on its own.",
    "steps": [
      "$f(x)=\\frac{\\sin\\pi x}{\\pi x}$ (check at $x=\\frac13$: $\\sum\\ln\\left(1-\\frac{1}{9n^2}\\right)=\\ln\\frac{\\sin(\\pi/3)}{\\pi/3}$).",
      "$\\frac{f'}{f}=(\\ln\\sin\\pi x-\\ln\\pi x)'=\\pi\\cot\\pi x-\\frac1x$, which also equals the term-by-term $\\sum\\frac{-2x}{n^2-x^2}$.",
      "$x=\\frac13$: $\\pi\\cot\\frac\\pi3-3=\\frac{\\pi}{\\sqrt3}-3$."
    ],
    "trap": "Taking the logarithmic derivative of only $\\sin\\pi x$ and forgetting the $-\\frac1x$ from the denominator $\\pi x$ gives $\\frac{\\pi}{\\sqrt3}\\approx1.814$.",
    "check": "Term by term, every $\\frac{-2x}{n^2-x^2}$ is negative, and the answer $\\approx-1.186$ is negative too; the first term $\\frac{-2/3}{8/9}=-0.75$ already accounts for most of it."
  },
  "refine-derivatives-049": {
    "spot": "$h=f(x^2)$ is a composite and you need its fourth derivative; with each use of the Chain Rule, the second derivative $2$ of the inner $x^2$ brings out extra terms, so derive the general form $h''''=12f''+48x^2f'''+16x^4f''''$ first, then plug in.",
    "why": "The general form needs only four differentiations, tidying up each time, and plugging in numbers at the end loses no terms; setting $x=1+t$ and comparing the $t^4$ coefficient is another route, handy as a check.",
    "steps": [
      "$h'=2xf'(x^2)$, $h''=2f'+4x^2f''$ (test with $f=e^s$: $\\left(e^{x^2}\\right)''=e^{x^2}(2+4x^2)$).",
      "Twice more: $h'''=12xf''+8x^3f'''$, $h''''=12f''+48x^2f'''+16x^4f''''$ (test once with $f=e^s$ and once with $f=s^4$).",
      "$x=1$: $12\\cdot(-1)+48\\cdot3+16\\cdot1=148$."
    ],
    "trap": "Treating $h''''$ as $(2x)^4f''''=16f''''$ gives only $16$ — missing the $12f''$ and $48x^2f'''$ produced by the inner second derivative.",
    "check": "Expansion method: $x=1+t$, $s=2t+t^2$; the $t^4$ coefficient of $f(1+s)$ is $-\\frac12+6+\\frac23=\\frac{37}{6}$, and times $4!$ that is also $148$."
  },
  "refine-derivatives-050": {
    "spot": "One derivative turns $\\ln(1+x^2)$ into the rational function $\\frac{2x}{1+x^2}$; the remaining three are derivatives of rational functions, which you can push to a closed form and then set $x=1$.",
    "why": "You could also split it into $\\ln(x+i)+\\ln(x-i)$ and use $(x\\pm i)^{-4}$, but complex powers need care; differentiating rational functions step by step is the least error-prone.",
    "steps": [
      "$\\frac{d}{dx}\\ln(1+x^2)=\\frac{2x}{1+x^2}$.",
      "Quotient Rule: $\\left(\\frac{2x}{1+x^2}\\right)'=\\frac{2(1-x^2)}{(1+x^2)^2}$.",
      "Twice more: $\\frac{d^2}{dx^2}\\frac{2(1-x^2)}{(1+x^2)^2}=\\frac{-12(x^4-6x^2+1)}{(1+x^2)^4}$.",
      "$x=1$: $\\frac{-12(1-6+1)}{16}=3$."
    ],
    "trap": "On the complex route, computing $(1+i)^4$ as $4$: actually $(1+i)^2=2i$ and $(2i)^2=-4$; with the sign wrong you answer $-3$.",
    "check": "Complex splitting: $\\frac{d^4}{dx^4}\\ln(x\\pm i)=-\\frac{6}{(x\\pm i)^4}$ and $(1\\pm i)^4=-4$, so each term gives $\\frac64$, total $3$."
  },
  "refine-derivatives-051": {
    "spot": "One derivative of $\\arctan x$ is $\\frac{1}{1+x^2}$, so the fifth derivative $=$ the fourth derivative of $\\frac{1}{1+x^2}$, done as two second derivatives.",
    "why": "Derivatives of rational functions have closed forms and every step can be checked; the complex split $\\frac{1}{1+x^2}=\\mathrm{Im}\\frac{1}{x-i}$ is faster, so keep it as a check.",
    "steps": [
      "$(\\arctan x)'=\\frac{1}{1+x^2}$.",
      "$\\left(\\frac{1}{1+x^2}\\right)''=\\frac{6x^2-2}{(1+x^2)^3}$.",
      "Twice more: $\\left(\\frac{6x^2-2}{(1+x^2)^3}\\right)''=\\frac{24(5x^4-10x^2+1)}{(1+x^2)^5}$.",
      "$x=1$: $\\frac{24(5-10+1)}{32}=-3$."
    ],
    "trap": "Thinking that since $\\arctan$ is increasing all its derivatives are positive, and answering $3$; higher derivatives change sign, and $5-10+1=-4$.",
    "check": "Complex method: $\\frac{1}{1+x^2}=\\mathrm{Im}\\frac{1}{x-i}$, whose fourth derivative is $24\\,\\mathrm{Im}(x-i)^{-5}$; $(1-i)^5=-4+4i$ and $\\mathrm{Im}\\frac{1}{-4+4i}=-\\frac18$, times $24$ gives $-3$."
  },
  "refine-derivatives-052": {
    "spot": "$y=e^{\\arcsin x}$ satisfies $\\sqrt{1-x^2}\\,y'=y$; one more derivative gives a second-order equation with polynomial coefficients, and differentiating it $n$ times at $x=0$ leaves just two terms — a recursion for the derivatives.",
    "why": "Differentiating seven times directly is hopeless; differentiate the equation $n$ times with the Leibniz rule and set $x=0$, every term carrying $x$ vanishes, and the odd orders multiply up step by step.",
    "steps": [
      "$y'=\\frac{y}{\\sqrt{1-x^2}}$, so at $x=0$, $y'(0)=1$.",
      "Differentiate $\\sqrt{1-x^2}\\,y'=y$ once more and multiply by $\\sqrt{1-x^2}$: $(1-x^2)y''-xy'-y=0$.",
      "Differentiate $n$ times with Leibniz: $(1-x^2)y^{(n+2)}-(2n+1)xy^{(n+1)}-(n^2+1)y^{(n)}=0$; at $x=0$, $y^{(n+2)}(0)=(n^2+1)\\,y^{(n)}(0)$. $n=1$: $y'''(0)=2$.",
      "$y^{(5)}(0)=10\\cdot2=20$, $y^{(7)}(0)=26\\cdot20=520$."
    ],
    "trap": "Writing the recursion coefficient as $n^2$ (missing the $+1$ coming from the $-y$ term) gives $y'''=1$, $y^{(5)}=9$, $y^{(7)}=225$.",
    "check": "The even orders start from $y(0)=1$: $y''(0)=(0+1)\\cdot1=1$, matching direct numerical differentiation."
  },
  "refine-derivatives-054": {
    "spot": "The Gaussian-times-cosine integral has the closed form $I(a)=\\frac{\\sqrt\\pi}{2}e^{-a^2/4}$; with it, $I''(2)$ is just an ordinary second derivative.",
    "why": "Differentiating twice under the integral sign gives $-\\int x^2e^{-x^2}\\cos ax\\,dx$, which still has to be computed; using \"one derivative + integration by parts\" to get $I'=-\\frac a2I$ and the closed form is fastest.",
    "steps": [
      "Differentiate under the integral sign: $I'(a)=-\\int_0^\\infty xe^{-x^2}\\sin ax\\,dx$; integrating by parts on $xe^{-x^2}$ gives $I'(a)=-\\frac a2I(a)$ (checked at $a=2$).",
      "Solve $I'=-\\frac a2I$ with $I(0)=\\frac{\\sqrt\\pi}{2}$: $I(a)=\\frac{\\sqrt\\pi}{2}e^{-a^2/4}$.",
      "Differentiate twice: $I''(a)=\\frac{\\sqrt\\pi}{2}e^{-a^2/4}\\left(\\frac{a^2}{4}-\\frac12\\right)$.",
      "$a=2$: $\\frac{\\sqrt\\pi}{2}e^{-1}\\cdot\\frac12=\\frac{\\sqrt\\pi}{4e}$."
    ],
    "trap": "In the second derivative, keeping only the squared term from the exponent and missing the $-\\frac12$ from the Product Rule gives $\\frac{\\sqrt\\pi}{2}e^{-1}\\cdot1=\\frac{\\sqrt\\pi}{2e}$.",
    "check": "Computing $I''(2)=-\\int_0^\\infty x^2e^{-x^2}\\cos2x\\,dx$ numerically also gives $\\approx0.163$."
  },
  "refine-derivatives-055": {
    "spot": "Newton's method for $\\sin x$ is $x_{n+1}=x_n-\\tan x_n$; near $\\pi$, $\\tan(\\pi+e)=\\tan e$, so the error recursion becomes $e_{n+1}=e_n-\\tan e_n$, and $\\tan e-e$ starts at the cubic term.",
    "why": "Newton's method usually converges quadratically (with coefficient $\\frac{f''}{2f'}$), but here $f''(\\pi)=-\\sin\\pi=0$, so the quadratic term vanishes and you need the cubic term to get a nonzero limit.",
    "steps": [
      "$x_{n+1}=x_n-\\frac{\\sin x_n}{\\cos x_n}$; let $x_n=\\pi+e_n$. Period $\\pi$ gives $\\tan(\\pi+e_n)=\\tan e_n$, so $e_{n+1}=e_n-\\tan e_n$.",
      "$\\tan e=e+\\frac{e^3}{3}+O(e^5)$, so $e_{n+1}=-\\frac{e_n^3}{3}+O(e_n^5)$.",
      "$\\frac{e_{n+1}}{e_n^3}\\to-\\frac13$."
    ],
    "trap": "Applying the quadratic convergence formula, seeing $\\frac{e_{n+1}}{e_n^2}\\to\\frac{f''(\\pi)}{2f'(\\pi)}=0$, and thinking the answer is $0$; or dropping the minus sign and answering $\\frac13$.",
    "check": "Numerically: with $e_0=0.1$, $e_1=0.1-\\tan0.1\\approx-0.000335$, ratio $\\approx-0.335$."
  },
  "refine-derivatives-056": {
    "spot": "$\\frac{f(x)+f(y)}{1+f(x)f(y)}$ is the addition formula for $\\tanh$; differentiate in $y$ and set $y=0$, and the functional equation becomes the differential equation $f'=f'(0)(1-f^2)$.",
    "why": "Guessing $\\tanh$ from the shape of the addition formula is quick, but the coefficient is fixed only by $f'(0)=2$; turning it into a separable differential equation produces the answer and the coefficient together.",
    "steps": [
      "$x=y=0$: $f(0)=\\frac{2f(0)}{1+f(0)^2}$, so $f(0)\\in\\{0,\\pm1\\}$. If $f(0)=\\pm1$, taking $y=0$ gives $f(x)=\\frac{f(x)\\pm1}{1\\pm f(x)}=\\pm1$, a constant, contradicting $f'(0)=2$; so $f(0)=0$.",
      "Differentiate in $y$ and set $y=0$ (using $f(0)=0$): $f'(x)=f'(0)\\left(1-f(x)^2\\right)=2\\left(1-f(x)^2\\right)$.",
      "Solve $f'=2(1-f^2)$ with $f(0)=0$: $f=\\tanh2x$, which does satisfy the original equation.",
      "$f(\\ln2)=\\tanh(2\\ln2)=\\frac{4-\\frac14}{4+\\frac14}=\\frac{15}{17}$."
    ],
    "trap": "Recognizing $\\tanh$ and writing $f=\\tanh x$, dropping the coefficient from $f'(0)=2$, gives $\\tanh\\ln2=\\frac35$.",
    "check": "Use the addition formula itself as a doubling formula: $f\\left(\\frac{\\ln2}{2}\\right)=\\tanh\\ln2=\\frac35$, so $f(\\ln2)=\\frac{2\\cdot\\frac35}{1+\\frac9{25}}=\\frac{15}{17}$, and $|f|<1$."
  },
  "refine-derivatives-060": {
    "spot": "A product $xy^2z^3$ with a sum-of-squares constraint: after taking logs, the Lagrange conditions give $x^2:y^2:z^2=1:2:3$, so the sum of squares $9$ is split in proportion to the exponents.",
    "why": "You could also use AM-GM, splitting $9=x^2+\\frac{y^2}{2}+\\frac{y^2}{2}+\\frac{z^2}{3}+\\frac{z^2}{3}+\\frac{z^2}{3}$ into six parts; Lagrange multipliers tell you directly how big each part should be.",
    "steps": [
      "Maximize $\\ln x+2\\ln y+3\\ln z$: $\\frac1x=2\\lambda x$, $\\frac2y=2\\lambda y$, $\\frac3z=2\\lambda z$, so $x^2:y^2:z^2=1:2:3$.",
      "Split $9$ into six parts of $\\frac32$ each: $x^2=\\frac32$, $y^2=3$, $z^2=\\frac92$.",
      "Maximum value $\\sqrt{\\frac32}\\cdot3\\cdot\\left(\\frac92\\right)^{3/2}=\\frac{81\\sqrt3}{4}$."
    ],
    "trap": "Applying the ratio to $x:y:z$ (taking $x:y:z=1:2:3$) gives a point whose product is only about $28.7$, not the maximum.",
    "check": "Compare with another point on the sphere: $x^2=1$, $y^2=3$, $z^2=5$ gives $3\\cdot5^{3/2}\\approx33.5$, smaller than $\\frac{81\\sqrt3}{4}\\approx35.07$."
  },
  "refine-integrals-020": {
    "spot": "The axis of rotation is the slanted line $y=x$, and the region's upper boundary is the axis itself; slicing perpendicular to the axis, the radius is the distance from a point on the parabola to $y=x$, namely $\\frac{x-x^2}{\\sqrt2}$.",
    "why": "The disk method in the coordinate along the axis, $u=\\frac{x+y}{\\sqrt2}$, is the most direct; Pappus's theorem (area times distance traveled by the centroid) gives an independent check.",
    "steps": [
      "For the point $(x,x^2)$ on the parabola: distance to the axis $r=\\frac{x-x^2}{\\sqrt2}$, position along the axis $u=\\frac{x+x^2}{\\sqrt2}$, $du=\\frac{1+2x}{\\sqrt2}dx$.",
      "$V=\\int\\pi r^2\\,du=\\frac{\\pi}{2\\sqrt2}\\int_0^1(x-x^2)^2(1+2x)\\,dx$.",
      "Expand $(x-x^2)^2(1+2x)=x^2-3x^4+2x^5$; the integral is $\\frac13-\\frac35+\\frac13=\\frac1{15}$.",
      "$V=\\frac{\\pi}{2\\sqrt2}\\cdot\\frac1{15}=\\frac{\\pi}{30\\sqrt2}=\\frac{\\pi\\sqrt2}{60}$."
    ],
    "trap": "Using $dx$ directly as the thickness (forgetting the stretch factor $\\frac{1+2x}{\\sqrt2}$ along the axis) gives $\\frac\\pi2\\int_0^1(x-x^2)^2dx=\\frac{\\pi}{60}$.",
    "check": "Pappus: area $\\frac16$, centroid $\\left(\\frac12,\\frac25\\right)$, distance to the axis $\\frac{1/10}{\\sqrt2}$, and $V=2\\pi\\cdot\\frac{1}{10\\sqrt2}\\cdot\\frac16$ is the same."
  },
  "refine-series-004": {
    "spot": "Product-to-sum turns $\\sin n\\sin2n$ into $\\frac{\\cos n-\\cos3n}{2}$, and both pieces are special cases of $\\sum\\frac{\\cos nx}{n}=-\\ln\\left(2\\sin\\frac x2\\right)$, with $x=1$ and $x=3$ both inside $(0,2\\pi)$.",
    "why": "There is no ready formula for a series of products; once split into single frequencies, each is the real part of $-\\ln(1-e^{ix})$.",
    "steps": [
      "Product-to-sum: $\\sin n\\sin2n=\\frac{\\cos n-\\cos3n}{2}$; the two series $\\sum\\frac{\\cos kn}{n}$ each converge by Dirichlet's test, so they can be computed separately.",
      "$\\sum\\frac{\\cos nx}{n}=\\mathrm{Re}\\left[-\\ln(1-e^{ix})\\right]=-\\ln\\left|1-e^{ix}\\right|=-\\ln\\left(2\\sin\\frac x2\\right)$ for $0<x<2\\pi$. At $x=1$:",
      "$x=3$: $\\sum\\frac{\\cos3n}{n}=-\\ln\\left(2\\sin\\frac32\\right)$.",
      "Sum $=\\frac12\\left[-\\ln\\left(2\\sin\\frac12\\right)+\\ln\\left(2\\sin\\frac32\\right)\\right]=\\frac12\\ln\\frac{\\sin(3/2)}{\\sin(1/2)}$."
    ],
    "trap": "Remembering $|1-e^{ix}|=2\\sin\\frac x2$ as $2\\sin x$ gives $\\frac12\\ln\\frac{\\sin3}{\\sin1}\\approx-0.89$, which even has the wrong sign.",
    "check": "The first two terms give $\\sin1\\sin2+\\frac{\\sin2\\sin4}{2}\\approx0.765-0.344=0.421$, after which signs are mixed; a sum of $\\approx0.366$ is reasonable."
  },
  "refine-series-005": {
    "spot": "The triple-angle identity reduces $\\sin^3n$ to $\\frac{3\\sin n-\\sin3n}{4}$, and both pieces are special cases of $\\sum\\frac{\\sin nx}{n}=\\frac{\\pi-x}{2}$, with $x=1$ and $x=3$ both inside $(0,2\\pi)$.",
    "why": "There is no direct series formula for a cube; after reducing the power, each piece is the Fourier series of a sawtooth wave, so just plug in.",
    "steps": [
      "Triple angle: $\\sin^3n=\\frac{3\\sin n-\\sin3n}{4}$; the two series $\\sum\\frac{\\sin kn}{n}$ each converge by Dirichlet's test.",
      "For $0<x<2\\pi$, $\\sum\\frac{\\sin nx}{n}=\\frac{\\pi-x}{2}$: $x=1$ gives $\\frac{\\pi-1}{2}$ and $x=3$ gives $\\frac{\\pi-3}{2}$.",
      "Sum $=\\frac14\\left[\\frac{3(\\pi-1)}{2}-\\frac{\\pi-3}{2}\\right]=\\frac14\\cdot\\frac{2\\pi}{2}=\\frac\\pi4$."
    ],
    "trap": "Swapping the triple-angle coefficients to $\\frac{3\\sin3n-\\sin n}{4}$ gives $\\frac{\\pi-4}{4}\\approx-0.215$.",
    "check": "Recombine the two series numerically: $\\frac34\\sum\\frac{\\sin n}{n}-\\frac14\\sum\\frac{\\sin3n}{n}\\approx0.785$."
  },
  "refine-series-007": {
    "spot": "The denominator $n+1$ does not line up with the frequency of $\\sin n$; shifting the index to $m=n+1$ makes the numerator $\\sin(m-1)$, and the angle-sum formula splits it back into the two known series $\\sum\\frac{\\sin m}{m}$ and $\\sum\\frac{\\cos m}{m}$.",
    "why": "After the shift every denominator is a plain $m$, and both Fourier series $\\frac{\\pi-x}{2}$ and $-\\ln\\left(2\\sin\\frac x2\\right)$ can be evaluated directly at $x=1$.",
    "steps": [
      "$m=n+1$: the sum $=\\sum_{m\\ge2}\\frac{\\sin(m-1)}{m}$; the $m=1$ term is $\\sin0=0$, so it can be added to start from $m=1$.",
      "Angle sum: $\\sin(m-1)=\\sin m\\cos1-\\cos m\\sin1$; both series converge by Dirichlet's test, so they can be separated.",
      "Substitute $\\sum\\frac{\\sin m}{m}=\\frac{\\pi-1}{2}$ and $\\sum\\frac{\\cos m}{m}=-\\ln\\left(2\\sin\\frac12\\right)$.",
      "Sum $=\\cos1\\cdot\\frac{\\pi-1}{2}+\\sin1\\cdot\\ln\\left(2\\sin\\frac12\\right)$."
    ],
    "trap": "Writing the angle-sum formula as $\\sin m\\cos1+\\cos m\\sin1$ (that is $\\sin(m+1)$) flips the sign of the correction term and gives about $0.614$.",
    "check": "The main part is $\\cos1\\cdot\\frac{\\pi-1}{2}\\approx0.579$ and the correction is small ($2\\sin\\frac12\\approx0.959$ is close to $1$), so the sum $\\approx0.543$."
  },
  "refine-series-014": {
    "spot": "Rearranged as \"two positives, one negative\": $K$ groups use $2K$ positive terms but only $K$ negative ones, so compared with the first $2K$ terms of the original series there are $K$ extra positive terms $\\frac{1}{4j-3}$ ($K<j\\le2K$) — and that extra block sums to a value tending to $\\frac14\\ln2$.",
    "why": "Rearranging a conditionally convergent series can change its sum (Riemann rearrangement theorem); write the rearranged partial sum as \"original partial sum + an extra block\", and an integral comparison gives the limit of the extra block.",
    "steps": [
      "The positive terms are $\\frac{1}{4j-3}$ and the negative terms $\\frac{1}{4j-1}$. The first $K$ groups $=L_{2K}+\\sum_{j=K+1}^{2K}\\frac{1}{4j-3}$, where $L_{2K}$ is the sum of the first $2K$ terms of the original series.",
      "$L_{2K}\\to\\frac\\pi4$.",
      "The $K$ extra terms lie between $\\int_{K+1}^{2K+1}\\frac{dx}{4x-3}$ and $\\int_K^{2K}\\frac{dx}{4x-3}=\\frac14\\ln\\frac{8K-3}{4K-3}$, and both $\\to\\frac14\\ln2$.",
      "Partial sums within a group differ by amounts $\\to0$ (the terms tend to $0$), so the sum $=\\frac\\pi4+\\frac14\\ln2$."
    ],
    "trap": "Thinking a rearrangement only changes the order, so the sum is still $\\frac\\pi4\\approx0.785$; a conditionally convergent series cannot be freely rearranged.",
    "check": "In general, $p$ positive terms per $q$ negative terms gives sum $=\\frac\\pi4+\\frac14\\ln\\frac pq$; $p=2$, $q=1$ is exactly this problem."
  },
  "refine-series-023": {
    "spot": "$1+\\frac1{n^3}=\\frac{(n+1)(n^2-n+1)}{n^3}$, and $n^2-n+1=\\left(n-\\frac12\\right)^2+\\frac34$ — that is the shape of $\\cosh\\pi y=\\prod_{n\\ge1}\\left(1+\\frac{y^2}{(n-1/2)^2}\\right)$ with $y=\\frac{\\sqrt3}{2}$.",
    "why": "The reflection formula for the $\\Gamma$ function is the orthodox route; splitting into \"a $\\cosh$ product\" times \"a Wallis-type product\" needs only two familiar product formulas.",
    "steps": [
      "Rewrite: $1+\\frac1{n^3}=\\frac{n^2-n+1}{(n-\\frac12)^2}\\cdot\\frac{(n+1)(n-\\frac12)^2}{n^3}$, with $n^2-n+1=\\left(n-\\frac12\\right)^2+\\frac34$.",
      "The first block is $\\prod\\left(1+\\frac{3/4}{(n-\\frac12)^2}\\right)=\\cosh\\frac{\\sqrt3\\pi}{2}$.",
      "The first $N$ terms of the second block: $\\prod\\frac{n+1}{n}=N+1$ and $\\prod\\frac{(n-\\frac12)^2}{n^2}=c_N^2$, where $c_N=\\prod_{n\\le N}\\frac{2n-1}{2n}\\sim\\frac1{\\sqrt{\\pi N}}$; the product $\\frac{N+1}{\\pi N}\\to\\frac1\\pi$.",
      "Multiply: $\\prod\\left(1+\\frac1{n^3}\\right)=\\frac{1}{\\pi}\\cosh\\frac{\\sqrt3\\pi}{2}$."
    ],
    "trap": "Multiplying the $(1+\\frac1n)$ factors on their own to get $N+1\\to\\infty$ and concluding the whole product diverges; they have to be paired with the $\\frac{1}{\\pi N}$ from $\\frac{(n-1/2)^2}{n^2}$ to cancel.",
    "check": "The first two factors give $2\\cdot\\frac98=2.25$; each later factor is slightly above $1$ and the product converges fast, so $\\frac{\\cosh(\\sqrt3\\pi/2)}{\\pi}\\approx2.429$ is reasonable."
  },
  "refine-series-027": {
    "spot": "For fixed $m$, $\\frac{m!\\,n!}{(m+n+2)!}$ telescopes in $n$: it equals $b_n-b_{n+1}$ with $b_n=\\frac{m!\\,n!}{(m+1)(m+n+1)!}$. The inner sum is $\\frac1{(m+1)^2}$, and the outer sum is just $\\zeta(2)$.",
    "why": "A Dirichlet integral can turn the whole double sum into $\\int_0^1\\frac{-\\ln x}{1-x}dx$, but then you must handle an improper integral; telescoping uses only factorial algebra.",
    "steps": [
      "$b_n-b_{n+1}=\\frac{m!\\,n!}{(m+1)(m+n+2)!}\\big[(m+n+2)-(n+1)\\big]=\\frac{m!\\,n!}{(m+n+2)!}$.",
      "So $\\sum_{n\\ge0}\\frac{m!\\,n!}{(m+n+2)!}=b_0=\\frac{m!}{(m+1)(m+1)!}=\\frac{1}{(m+1)^2}$. Check $m=0,1,2$: $1,\\frac14,\\frac19$.",
      "Outer sum: $\\sum_{m\\ge0}\\frac{1}{(m+1)^2}=\\frac{\\pi^2}{6}$."
    ],
    "trap": "Treating $(m+n+2)!$ as the $(m+n+1)!$ of the Beta function makes the inner sum $\\frac1m$, so the outer sum is the harmonic series and you think it diverges.",
    "check": "Dirichlet integral version: the sum $=\\int_0^1\\frac{-\\ln x}{1-x}dx$, which numerically is also $1.6449$."
  },
  "refine-series-028": {
    "spot": "The denominator $m+n+2$ ties the two indices together; writing $\\frac1{m+n+2}=\\int_0^1x^{m+n+1}dx$ separates them, and $\\sum\\frac{x^m}{m}$ and $\\sum\\frac{x^n}{n}$ are each $-\\ln(1-x)$.",
    "why": "The integral representation turns the coupled denominator into the product $x^m\\cdot x^n$, so the double sum factors directly into a square; partial fractions cannot split cleanly in both indices.",
    "steps": [
      "$\\frac{1}{m+n+2}=\\int_0^1x^{m+n+1}\\,dx$.",
      "Positive terms can be swapped: the sum $=\\int_0^1x\\left(\\sum\\frac{x^m}{m}\\right)\\left(\\sum\\frac{x^n}{n}\\right)dx=\\int_0^1x\\ln^2(1-x)\\,dx$ (using $\\sum\\frac{x^n}{n}=-\\ln(1-x)$, checked at $x=\\frac12$).",
      "$u=1-x$ gives $\\int_0^1(1-u)\\ln^2u\\,du$; then $u=e^{-t}$: $\\int_0^1u^a\\ln^2u\\,du=\\int_0^\\infty t^2e^{-(a+1)t}dt=\\frac{2}{(a+1)^3}$, which is $2$ for $a=0$ and $\\frac14$ for $a=1$.",
      "Sum $=2-\\frac14=\\frac74$."
    ],
    "trap": "Remembering the formula as $\\frac{2}{(a+1)^2}$ makes $\\int_0^1u\\ln^2u\\,du$ come out as $\\frac12$, giving $\\frac32$.",
    "check": "The single term $m=n=1$ is $\\frac14$, and $(1,2)$ and $(2,1)$ are $\\frac1{10}$ each; the terms behave like $\\frac{1}{mn(m+n)}$, so convergence is slow, building up gradually to $1.75$."
  },
  "refine-series-031": {
    "spot": "The inner $\\sum_k k^{-2n}=\\zeta(2n)-1$ is hard to sum directly; after swapping the order, the sum over $n$ is $\\sum\\frac{y^n}{n}=-\\ln(1-y)$ with $y=\\frac{1}{k^2}$.",
    "why": "A positive series can be summed in either order; after swapping, adding up $-\\ln\\left(1-\\frac1{k^2}\\right)$ is the log of a telescoping product.",
    "steps": [
      "Swap the order and fix $k$: $\\sum_{n\\ge1}\\frac{(1/k^2)^n}{n}=-\\ln\\left(1-\\frac1{k^2}\\right)$.",
      "$1-\\frac1{k^2}=\\frac{k-1}{k}\\cdot\\frac{k+1}{k}$, so the product of the first $K$ factors telescopes to $\\frac{K+1}{2K}\\to\\frac12$.",
      "Sum $=-\\ln\\frac12=\\ln2$."
    ],
    "trap": "Getting the telescoping product as $\\frac{K+1}{K}\\to1$ (missing the $\\frac12$ left over from the $\\frac{k-1}{k}$ chain) gives $0$.",
    "check": "The $n=1$ term is $\\zeta(2)-1\\approx0.645$, and adding $n=2$, $\\frac{\\zeta(4)-1}{2}\\approx0.041$, already reaches $0.686$, close to $\\ln2\\approx0.693$."
  },
  "refine-series-036": {
    "spot": "The generating function of $\\binom{2n}{n}$ is $\\frac{1}{\\sqrt{1-4t}}$; an extra $\\frac1n$ means \"divide by $t$ and integrate from $0$\", and $\\frac1{8^n}$ means evaluating at $x=\\frac18$ (inside the radius of convergence $\\frac14$).",
    "why": "Dividing coefficients by $n$ corresponds to integrating, a standard generating function move; the substitution $s=\\sqrt{1-4t}$ turns the integral into a rational function.",
    "steps": [
      "$\\sum_{n\\ge0}\\binom{2n}{n}t^n=\\frac{1}{\\sqrt{1-4t}}$ (coefficients $1,2,6,20,\\dots$).",
      "Drop the constant term, divide by $t$, and integrate: $\\sum_{n\\ge1}\\binom{2n}{n}\\frac{x^n}{n}=\\int_0^x\\frac{1}{t}\\left(\\frac{1}{\\sqrt{1-4t}}-1\\right)dt$.",
      "$s=\\sqrt{1-4t}$, $t=\\frac{1-s^2}{4}$: the integrand becomes $-\\frac{2}{1+s}ds$, and the integral $=2\\ln\\frac{2}{1+\\sqrt{1-4x}}$.",
      "$x=\\frac18$: $\\sqrt{1/2}=\\frac{1}{\\sqrt2}$ and $\\frac{2}{1+1/\\sqrt2}=2\\sqrt2(\\sqrt2-1)=4-2\\sqrt2$. Sum $=2\\ln(4-2\\sqrt2)$."
    ],
    "trap": "Forgetting the $\\frac1n$ and plugging straight into the generating function gives $\\frac{1}{\\sqrt{1/2}}-1=\\sqrt2-1\\approx0.414$.",
    "check": "The first three terms give $\\frac28+\\frac{6}{2\\cdot64}+\\frac{20}{3\\cdot512}\\approx0.310$ and the later terms are tiny, so a sum of $\\approx0.3167$ is reasonable."
  },
  "refine-series-041": {
    "spot": "Derangement numbers divided by $n!$ — the exponential generating function $D(x)=\\sum D_n\\frac{x^n}{n!}$; multiplying the recurrence $D_{n+1}=n(D_n+D_{n-1})$ by $\\frac{x^n}{n!}$ and summing gives a first-order differential equation.",
    "why": "In an exponential generating function, a factor $n$ in the coefficients corresponds to multiplying by $x$ and differentiating, so the recurrence becomes a separable equation in one step; finding a general formula for $D_n$ and then summing is a detour.",
    "steps": [
      "Left side: $\\sum D_{n+1}\\frac{x^n}{n!}=D'(x)$; right side: $\\sum nD_n\\frac{x^n}{n!}=xD'$ and $\\sum nD_{n-1}\\frac{x^n}{n!}=xD$. This gives $(1-x)D'=xD$.",
      "Separate variables: $\\frac{D'}{D}=\\frac{x}{1-x}=-1+\\frac{1}{1-x}$ with $D(0)=1$, so $D(x)=\\frac{e^{-x}}{1-x}$ for $|x|<1$.",
      "The coefficients match: $\\frac{D_2}{2!}=\\frac12$, $\\frac{D_3}{3!}=\\frac26=\\frac13$.",
      "The sum we want $=D\\left(\\frac12\\right)=\\frac{e^{-1/2}}{1/2}=2e^{-1/2}$."
    ],
    "trap": "When separating variables, computing $\\int\\frac{x}{1-x}dx$ as $-\\ln(1-x)$ (missing the $-x$) gives $D=\\frac{1}{1-x}$ and the answer $2$ — that is the generating function for all permutations, $n!$.",
    "check": "The first four terms give $1+\\frac18+\\frac1{24}+\\frac{3}{128}\\approx1.190$; since $\\frac{D_n}{n!}\\le\\frac12$, the rest is at most $\\frac1{32}$, so $1.213$ is reasonable."
  },
  "refine-series-042": {
    "spot": "Summing $t_n$ divided by $n!$ — the exponential generating function $T(x)=\\sum t_n\\frac{x^n}{n!}$; the $n$ in the recurrence $t_{n+1}=t_n+nt_{n-1}$ corresponds to multiplying by $x$ in the exponential version.",
    "why": "Multiplying the recurrence by $\\frac{x^n}{n!}$ and summing gives $T'=(1+x)T$, solved in one line; the requested sum is just $T(1)$.",
    "steps": [
      "$\\sum t_{n+1}\\frac{x^n}{n!}=T'$, $\\sum t_n\\frac{x^n}{n!}=T$, $\\sum nt_{n-1}\\frac{x^n}{n!}=x\\sum t_{n-1}\\frac{x^{n-1}}{(n-1)!}=xT$. This gives $T'=(1+x)T$.",
      "$T(0)=1$: $T(x)=e^{x+x^2/2}$, convergent for all $x$; the coefficients $t_2=2$ and $t_3=4$ match.",
      "The sum we want $=T(1)=e^{3/2}$."
    ],
    "trap": "Turning $\\sum nt_{n-1}\\frac{x^n}{n!}$ into $xT'$ gives $(1-x)T'=T$ and $T=\\frac{1}{1-x}$, which blows up at $x=1$.",
    "check": "The first six terms give $1+1+1+\\frac46+\\frac{10}{24}+\\frac{26}{120}\\approx4.30$, approaching $e^{1.5}\\approx4.48$."
  },
  "refine-series-046": {
    "spot": "The bracket is $\\ln n!$ minus the main part of Stirling's formula, and what is left is exactly the next term of the Stirling series, $\\frac{1}{12n}$; multiplying by $n$ asks for that coefficient.",
    "why": "Euler-Maclaurin applied to $\\ln x$ directly gives the asymptotic expansion of $\\ln n!$, with the correction coefficient set by $B_2=\\frac16$, so no separate error estimate is needed.",
    "steps": [
      "$\\ln n!=\\sum_{k\\le n}\\ln k$; the Euler-Maclaurin main term is $\\int_1^n\\ln x\\,dx=n\\ln n-n+1$, plus the endpoint term $\\frac{\\ln n}{2}$.",
      "Stirling fixes the constant as $\\frac12\\ln2\\pi$, and the next term is $\\frac{B_2}{2}\\cdot\\frac1n$: $\\ln n!=\\left(n+\\frac12\\right)\\ln n-n+\\frac12\\ln2\\pi+\\frac{1}{12n}-\\frac{1}{360n^3}+\\cdots$ (squeeze checked using $n!=\\int_0^\\infty t^ne^{-t}dt$).",
      "The bracket $=\\frac{1}{12n}+O\\!\\left(\\frac1{n^3}\\right)$; multiplying by $n$ gives $\\frac{1}{12}$."
    ],
    "trap": "Remembering the correction term as $\\frac{1}{12n^2}$ (mixing it up with the harmonic number expansion) and, after multiplying by $n$, thinking the limit is $0$.",
    "check": "$n=1$: $0-0+1-\\frac12\\ln2\\pi\\approx0.0811$, already close to $\\frac1{12}\\approx0.0833$."
  },
  "refine-series-047": {
    "spot": "The bracket is the asymptotic expansion of $H_n$ minus its first three terms $\\ln n$, $\\gamma$, $\\frac1{2n}$; the leading remaining term is set by $B_2$: $-\\frac{1}{12n^2}$.",
    "why": "Euler-Maclaurin with $f(x)=\\frac1x$ gives the coefficient at every order at once; multiplying by $n^2$ keeps only the coefficient of $\\frac1{n^2}$.",
    "steps": [
      "$H_n=\\int_0^1\\frac{1-t^n}{1-t}dt$ (check at $n=3$: $1+\\frac12+\\frac13$).",
      "Euler-Maclaurin: the correction term is $\\frac{B_2}{2!}f'(n)$ with $f'(n)=-\\frac1{n^2}$, so $H_n=\\ln n+\\gamma+\\frac{1}{2n}-\\frac{1}{12n^2}+\\frac{1}{120n^4}-\\cdots$ ($\\gamma\\approx0.5772156649$).",
      "The bracket $=-\\frac1{12n^2}+O\\!\\left(\\frac1{n^4}\\right)$; multiplying by $n^2$ gives $-\\frac1{12}$."
    ],
    "trap": "Remembering the sign of $\\frac{1}{2n}$ backwards (thinking $H_n\\approx\\ln n+\\gamma-\\frac1{2n}$) leaves the bracket of order $\\frac1n$, and after multiplying by $n^2$ you think it diverges.",
    "check": "$n=1$: $1-0-\\gamma-\\frac12\\approx-0.0772$, already close to $-\\frac1{12}\\approx-0.0833$."
  },
  "refine-series-051": {
    "spot": "In $\\left(\\frac kn\\right)^n$ only the terms with $k$ near $n$ are not small; setting $j=n-k$ gives $\\left(1-\\frac jn\\right)^n\\approx e^{-j}$, and the next-order correction is $e^{-j}\\cdot\\left(-\\frac{j^2}{2n}\\right)$.",
    "why": "Expand each term to order $\\frac1n$ and add: the main part $\\sum e^{-j}=\\frac{e}{e-1}$ exactly cancels the constant the problem subtracts, leaving $\\frac{1}{2n}\\sum j^2e^{-j}$.",
    "steps": [
      "$j=n-k$: $\\sum_{k=1}^n\\left(\\frac kn\\right)^n=\\sum_{j=0}^{n-1}\\left(1-\\frac jn\\right)^n$.",
      "$n\\ln\\left(1-\\frac jn\\right)=-j-\\frac{j^2}{2n}-O\\!\\left(\\frac{j^3}{n^2}\\right)$, so $\\left(1-\\frac jn\\right)^n=e^{-j}\\left(1-\\frac{j^2}{2n}\\right)+O\\!\\left(\\frac{j^4e^{-j}}{n^2}\\right)$ ($j=3$: correction coefficient $-\\frac92$).",
      "The main part $\\sum_{j\\ge0}e^{-j}=\\frac{e}{e-1}$ cancels; the truncated part $j\\ge n$ is exponentially small, and the errors add up to $O\\!\\left(\\frac1{n^2}\\right)$.",
      "$\\sum j^2y^j=\\frac{y(1+y)}{(1-y)^3}$; with $y=e^{-1}$: $\\sum j^2e^{-j}=\\frac{e(e+1)}{(e-1)^3}$.",
      "The limit of the bracket times $n$ $=\\frac12\\sum j^2e^{-j}=\\frac{e(e+1)}{2(e-1)^3}$."
    ],
    "trap": "Expanding only to $e^{-j}$ and thinking the error is exponentially small, so the limit is $0$; or forgetting the $\\frac12$ and answering $\\frac{e(e+1)}{(e-1)^3}\\approx1.99$.",
    "check": "Direct computation at $n=20000$ gives $0.99610$, differing from $\\frac{e(e+1)}{2(e-1)^3}\\approx0.99615$ by only $O\\!\\left(\\frac1n\\right)$."
  },
  "refine-series-052": {
    "spot": "The main term $\\frac{1}{\\sqrt{\\pi n}}$ is known; for the next order use Stirling with the factor $1+\\frac{1}{12m}$: the numerator $(2n)!$ contributes $\\frac1{24n}$ and the denominator $(n!)^2$ contributes two $\\frac1{12n}$.",
    "why": "Stirling's correction terms are multiplicative factors, so in a ratio they simply add and subtract; much easier than estimating the next order with the Wallis integral.",
    "steps": [
      "$m!=\\sqrt{2\\pi m}\\left(\\frac me\\right)^m\\left(1+\\frac1{12m}+O\\!\\left(\\frac{1}{m^2}\\right)\\right)$ (check at $m=10$: the ratio is slightly above $1+\\frac1{120}$).",
      "$\\binom{2n}{n}\\frac1{4^n}=\\frac{(2n)!}{(n!)^24^n}=\\frac{\\sqrt{4\\pi n}}{2\\pi n}\\cdot\\frac{1+\\frac1{24n}}{\\left(1+\\frac1{12n}\\right)^2}$, and the leading factor is exactly $\\frac{1}{\\sqrt{\\pi n}}$.",
      "$\\frac{1+\\frac1{24n}}{(1+\\frac1{12n})^2}=1+\\frac1{24n}-\\frac{2}{12n}+O\\!\\left(\\frac1{n^2}\\right)=1-\\frac1{8n}+\\cdots$; the squeeze is checked with the Wallis integral.",
      "The limit is $-\\frac18$."
    ],
    "trap": "Counting the correction for the denominator $(n!)^2$ only once as $\\frac{1}{12n}$ (forgetting the square) gives $\\frac1{24}-\\frac1{12}=-\\frac1{24}$.",
    "check": "$n=4$: $4\\left(\\sqrt{4\\pi}\\cdot\\frac{70}{256}-1\\right)\\approx-0.123$, already close to $-\\frac18$."
  },
  "refine-series-057": {
    "spot": "Only the even indices $H_{2n}$, with weight $\\frac1{4^n}=\\left(\\frac12\\right)^{2n}$: use $\\frac{g(x)+g(-x)}{2}$ to filter the even-power terms out of $g(x)=\\sum H_mx^m$, at $x=\\frac12$.",
    "why": "$g(x)=\\frac{-\\ln(1-x)}{1-x}$ is a known closed form, so the even/odd filter needs just two evaluations; handling $H_{2n}$ directly means splitting it into two strands of harmonic numbers, which is much messier.",
    "steps": [
      "$g(x)=\\sum_{m\\ge1}H_mx^m=\\frac{-\\ln(1-x)}{1-x}$ (the Cauchy product $\\sum\\frac{x^k}{k}\\cdot\\sum x^j$).",
      "$g\\left(\\frac12\\right)=\\frac{\\ln2}{1/2}=2\\ln2$ and $g\\left(-\\frac12\\right)=\\frac{-\\ln(3/2)}{3/2}=-\\frac23\\ln\\frac32$.",
      "The even-power terms $=\\frac{g(\\frac12)+g(-\\frac12)}{2}=\\ln2-\\frac13\\ln\\frac32$."
    ],
    "trap": "Seeing $\\frac1{4^n}$ and plugging in $x=\\frac14$, getting $g\\left(\\frac14\\right)=\\frac43\\ln\\frac43\\approx0.384$ — but the index is $2n$, which corresponds to $x^{2n}$.",
    "check": "The first two terms give $\\frac{3/2}{4}+\\frac{25/12}{16}\\approx0.505$ and later terms shrink quickly, so a sum of $\\approx0.558$ is reasonable."
  },
  "refine-series-058": {
    "spot": "$\\frac{1}{n(n+1)(n+2)}$ splits into a difference of two neighboring $\\frac{1}{n(n+1)}$-type terms; paired with $H_n=\\sum_{k\\le n}\\frac1k$, swapping the order of summation makes every inner sum telescope.",
    "why": "When $H_n$ comes with a telescoping weight, swapping the order $\\sum_n\\sum_{k\\le n}=\\sum_k\\sum_{n\\ge k}$ turns the inner sum into something simple like $\\frac1k$, and the outer sum is a familiar series.",
    "steps": [
      "Split: $\\frac{1}{n(n+1)(n+2)}=\\frac12\\left[\\frac{1}{n(n+1)}-\\frac{1}{(n+1)(n+2)}\\right]$; both pieces converge when paired with $H_n$.",
      "$\\sum\\frac{H_n}{n(n+1)}=\\sum_k\\frac1k\\sum_{n\\ge k}\\frac{1}{n(n+1)}=\\sum_k\\frac1k\\cdot\\frac1k=\\frac{\\pi^2}{6}$.",
      "$\\sum\\frac{H_n}{(n+1)(n+2)}=\\sum_k\\frac1k\\sum_{n\\ge k}\\frac{1}{(n+1)(n+2)}=\\sum_k\\frac{1}{k(k+1)}=1$.",
      "Sum $=\\frac12\\left(\\frac{\\pi^2}{6}-1\\right)=\\frac{\\pi^2}{12}-\\frac12$."
    ],
    "trap": "Dropping the $\\frac12$ in front of the split gives $\\frac{\\pi^2}{6}-1\\approx0.645$.",
    "check": "The first three terms give $\\frac16+\\frac{3/2}{24}+\\frac{11/6}{60}\\approx0.260$, and the rest fill in to $0.3225$, which is reasonable."
  },
  "refine-series-062": {
    "spot": "$\\frac{1}{(n^2+1)^2}$ has the shape of a derivative of $\\frac{1}{n^2+a^2}$ in $a$: $\\frac{\\partial}{\\partial a}\\frac{1}{n^2+a^2}=-\\frac{2a}{(n^2+a^2)^2}$; and $\\sum\\frac{1}{n^2+a^2}$ has a closed form from Fourier series.",
    "why": "Differentiating with respect to a parameter reduces the squared denominator back to a known series; hunting for a Fourier source of $\\frac{1}{(n^2+1)^2}$ directly costs an extra integral.",
    "steps": [
      "From the Fourier series of $\\cosh ax$: $\\sum_{n\\ge1}\\frac{1}{n^2+a^2}=\\frac{\\pi a\\coth(\\pi a)-1}{2a^2}$ (below, $u$ stands for $a$).",
      "Differentiate term by term in $a$ (uniformly convergent for $a$ away from $0$): $\\sum\\frac{1}{(n^2+a^2)^2}=-\\frac{1}{2a}\\frac{d}{da}\\left[\\frac{\\pi a\\coth(\\pi a)-1}{2a^2}\\right]$.",
      "$\\frac{d}{da}\\left[\\frac{\\pi\\coth\\pi a}{2a}-\\frac{1}{2a^2}\\right]=-\\frac{\\pi\\coth\\pi a}{2a^2}-\\frac{\\pi^2}{2a\\sinh^2\\pi a}+\\frac1{a^3}$; at $a=1$, multiplying by $-\\frac12$ gives $\\frac{\\pi\\coth\\pi}{4}+\\frac{\\pi^2}{4\\sinh^2\\pi}-\\frac12$."
    ],
    "trap": "Using the $\\sum_{n\\in\\mathbb Z}$ version but forgetting to subtract the $n=0$ term $1$ and divide by $2$ gives about $1.614$.",
    "check": "The first three terms give $\\frac14+\\frac1{25}+\\frac1{100}=0.30$ and the rest is less than $\\sum_{n\\ge4}\\frac1{n^4}$, so $0.3068$ is reasonable."
  },
  "refine-series-063": {
    "spot": "$\\sin^2n=\\frac{1-\\cos2n}{2}$ splits the series into $\\sum\\frac1{n^2}$ minus $\\sum\\frac{\\cos2n}{n^2}$; the latter is $\\sum\\frac{\\cos n\\theta}{n^2}=\\frac{\\pi^2}{6}-\\frac{\\pi\\theta}{2}+\\frac{\\theta^2}{4}$ at $\\theta=2$ (which lies in $[0,2\\pi]$).",
    "why": "After reducing the power, each piece is a known Fourier polynomial, so just plug in; estimating $\\sin^2n$ directly has no pattern to exploit.",
    "steps": [
      "Reduce the power: $\\frac{\\sin^2n}{n^2}=\\frac12\\left(\\frac1{n^2}-\\frac{\\cos2n}{n^2}\\right)$.",
      "$\\theta=2$: $\\sum\\frac{\\cos2n}{n^2}=\\frac{\\pi^2}{6}-\\pi+1$.",
      "Sum $=\\frac12\\left[\\frac{\\pi^2}{6}-\\left(\\frac{\\pi^2}{6}-\\pi+1\\right)\\right]=\\frac{\\pi-1}{2}$."
    ],
    "trap": "Misremembering the Fourier polynomial as $\\frac{\\pi^2}{6}-\\pi\\theta+\\frac{\\theta^2}{4}$ gives $\\frac{2\\pi-1}{2}\\approx2.64$, larger than $\\sum\\frac1{n^2}$ itself, which is impossible.",
    "check": "Numerical recombination: $\\frac12\\left(\\sum\\frac1{n^2}-\\sum\\frac{\\cos2n}{n^2}\\right)\\approx1.0708$; curiously, it equals $\\sum\\frac{\\sin n}{n}$."
  },
  "refine-series-067": {
    "spot": "Differentiating $\\sum\\frac{\\sin nx}{n^3}$ term by term gives $\\sum\\frac{\\cos nx}{n^2}$, which is dominated by $\\sum\\frac1{n^2}$ and converges uniformly, so term-by-term differentiation is legitimate; what remains is a known Fourier polynomial.",
    "why": "After differentiating term by term you just evaluate $\\frac{\\pi^2}{6}-\\frac{\\pi\\theta}{2}+\\frac{\\theta^2}{4}$; finding the closed form of $g$ itself (a cubic polynomial) and then differentiating is a detour.",
    "steps": [
      "Differentiate term by term: $\\left(\\frac{\\sin nx}{n^3}\\right)'=\\frac{\\cos nx}{n^2}$, and $\\left|\\frac{\\cos nx}{n^2}\\right|\\le\\frac{1}{n^2}$ with $\\sum\\frac1{n^2}$ convergent, so the convergence is uniform and $g'(x)=\\sum\\frac{\\cos nx}{n^2}$.",
      "For $0\\le\\theta\\le2\\pi$, $\\sum\\frac{\\cos n\\theta}{n^2}=\\frac{\\pi^2}{6}-\\frac{\\pi\\theta}{2}+\\frac{\\theta^2}{4}$ (checked at $\\theta=1$).",
      "$\\theta=\\frac\\pi3$: $\\frac{\\pi^2}{6}-\\frac{\\pi^2}{6}+\\frac{\\pi^2}{36}=\\frac{\\pi^2}{36}$."
    ],
    "trap": "When differentiating, just swapping $\\sin$ for $\\cos$ and forgetting to multiply by $n$, ending up with $\\sum\\frac{\\cos(n\\pi/3)}{n^3}$.",
    "check": "$\\cos\\frac{n\\pi}{3}$ cycles through $\\frac12,-\\frac12,-1,-\\frac12,\\frac12,1$; the first three terms give $\\frac12-\\frac18-\\frac19\\approx0.264$, and adding the rest gives $0.274$."
  },
  "refine-series-069": {
    "spot": "$a_n^3=\\frac{\\cos^3(2n\\pi/3)}{n}$, whose coefficients cycle through $-\\frac18,-\\frac18,1$ with average $\\frac14$; after removing the average, what is left is exactly $\\frac34\\cos\\frac{2n\\pi}{3}$.",
    "why": "After subtracting $\\frac14\\sum\\frac1n$, the bracket becomes $\\frac34\\sum\\frac{\\cos(2n\\pi/3)}{n}$, which is exactly the Fourier series of $-\\ln\\left(2\\sin\\frac\\theta2\\right)$, so just plug in.",
    "steps": [
      "$\\cos\\frac{2\\pi}{3}=\\cos\\frac{4\\pi}{3}=-\\frac12$ and $\\cos2\\pi=1$, so $\\cos^3$ runs through $-\\frac18,-\\frac18,1$ with average $\\frac14\\ne0$, and $\\sum a_n^3$ diverges like $\\frac14\\sum\\frac1n$.",
      "$\\cos^3\\frac{2n\\pi}{3}-\\frac14$ runs through $-\\frac38,-\\frac38,\\frac34$, which is exactly $=\\frac34\\cos\\frac{2n\\pi}{3}$; the bracket $\\to\\frac34\\sum\\frac{\\cos(2n\\pi/3)}{n}$.",
      "$\\sum\\frac{\\cos n\\theta}{n}=-\\ln\\left(2\\sin\\frac\\theta2\\right)$; at $\\theta=\\frac{2\\pi}{3}$: $-\\ln\\left(2\\cdot\\frac{\\sqrt3}{2}\\right)=-\\frac{\\ln3}{2}$.",
      "Answer $=\\frac34\\cdot\\left(-\\frac{\\ln3}{2}\\right)=-\\frac38\\ln3$."
    ],
    "trap": "Thinking the average of $\\cos^3$ is $0$ like that of $\\cos$ and not subtracting $\\frac14$; or subtracting it but forgetting to multiply by $\\frac34$ and answering $-\\frac{\\ln3}{2}$.",
    "check": "Triple-angle check: $\\cos^3\\theta=\\frac{3\\cos\\theta+\\cos3\\theta}{4}$, and for $\\theta=\\frac{2n\\pi}{3}$ we have $\\cos3\\theta=1$, giving exactly $\\frac34\\cos\\theta+\\frac14$."
  },
  "refine-series-073": {
    "spot": "The partial sums $S_{2m}=-\\frac12H_m\\to-\\infty$ and $S_{2m+1}\\to+\\infty$, but the average of neighbors $\\frac12(H_{2m+1}-H_m)\\to\\frac12\\ln2$ — Cesaro averaging pulls the two strands back to the middle.",
    "why": "Pairing terms gives clean formulas for the partial sums, and the limit of the average is visible at a glance; averaging all the partial sums directly hides the pattern.",
    "steps": [
      "Pair up: $H_{2k-1}-H_{2k}=-\\frac{1}{2k}$, so $S_{2m}=-\\frac12H_m$ (checked with $H_n=\\int_0^1\\frac{1-t^n}{1-t}dt$).",
      "$S_{2m+1}=S_{2m}+H_{2m+1}$, so the neighbor average is $\\frac{S_{2m}+S_{2m+1}}{2}=\\frac12(H_{2m+1}-H_m)$; and $H_{2m+1}-H_m=\\sum_{j=m+1}^{2m+1}\\frac1j$ lies between $\\ln2$ and $\\ln2+\\frac1{m+1}$.",
      "The Cesaro average $=$ the average of these pair averages (plus a remainder of $O\\!\\left(\\frac{\\ln N}{N}\\right)$) $\\to\\frac{\\ln2}{2}$. The Abel sum agrees: $\\sum(-1)^{n+1}H_nx^n=\\frac{\\ln(1+x)}{1+x}\\to\\frac{\\ln2}{2}$."
    ],
    "trap": "Seeing $S_{2m}=-\\frac12H_m\\to-\\infty$ and declaring that the Cesaro sum does not exist; the odd and even strands diverge in opposite directions at the same rate, and their average converges.",
    "check": "Numerically: the average of the partial sums over the first two million terms is $0.34657$, matching $\\frac{\\ln2}{2}\\approx0.34657$."
  },
  "refine-series-077": {
    "spot": "The partial sum $S_{2k}=\\ln\\frac{1\\cdot3\\cdots(2k-1)}{2\\cdot4\\cdots(2k)}$ is the log of a Wallis ratio; adding half of $\\ln(2k+1)$ (the neighbor average) makes it converge to $\\frac12\\ln\\frac2\\pi$.",
    "why": "When the Cesaro sum exists the Abel sum equals it, and for the Cesaro average you only need the average of neighboring partial sums; the power series $\\sum(-1)^{n+1}x^n\\ln n$ has no easy closed form.",
    "steps": [
      "$S_{2k}=\\sum_{j=1}^{k}\\ln\\frac{2j-1}{2j}$ and $S_{2k+1}=S_{2k}+\\ln(2k+1)$ (example: $\\ln1-\\ln2+\\ln3-\\ln4=\\ln\\frac38$).",
      "Neighbor average $S_{2k}+\\frac12\\ln(2k+1)$; telescope $\\frac12\\ln(2k+1)=\\sum_{j\\le k}\\frac12\\ln\\frac{2j+1}{2j-1}$ and each term combines into $\\frac12\\ln\\left(1-\\frac{1}{4j^2}\\right)$.",
      "Wallis: $\\prod\\left(1-\\frac1{4j^2}\\right)=\\frac2\\pi$.",
      "The neighbor average $\\to\\frac12\\ln\\frac2\\pi$, so the Cesaro sum exists and the Abel sum is the same: $\\frac12\\ln\\frac2\\pi$."
    ],
    "trap": "Getting the sign backwards and answering $\\frac12\\ln\\frac\\pi2\\approx0.226$; every term of $S_{2k}$ is negative, so the average cannot be positive.",
    "check": "Equivalent statement: $\\sum(-1)^{n+1}\\ln n=-\\eta'(0)$, and $\\eta'(0)=\\frac12\\ln\\frac\\pi2$, giving $\\frac12\\ln\\frac2\\pi\\approx-0.226$."
  },
  "refine-series-080": {
    "spot": "The coefficient $(2+\\sin n)^n$ is already \"something to the $n$-th power\" — taking the $n$-th root leaves $2+\\sin n$, so use the Root Test (Cauchy-Hadamard), and the question becomes the limsup of $\\sin n$.",
    "why": "The ratio $\\frac{(2+\\sin(n+1))^{n+1}}{(2+\\sin n)^n}$ jumps around with no limit, so the Ratio Test is useless; the Root Test uses the limsup and always applies.",
    "steps": [
      "$\\sqrt[n]{|a_n|}=2+\\sin n$.",
      "$\\pi$ is irrational, so the remainders of $n$ modulo $2\\pi$ are dense in $[0,2\\pi)$, and $\\sin n$ gets arbitrarily close to $1$ (for example $\\sin33\\approx0.99991$), while $2+\\sin n<3$. The limsup $=3$.",
      "Cauchy-Hadamard: $R=\\frac{1}{\\limsup\\sqrt[n]{|a_n|}}=\\frac13$."
    ],
    "trap": "Using the liminf or the average: taking the smallest $2+\\sin n\\to1$ gives $R=1$, or the average $2$ gives $R=\\frac12$; the radius of convergence is determined by the limsup.",
    "check": "For $|x|<\\frac13$, $\\left|(2+\\sin n)x\\right|\\le3|x|<1$, so every term is dominated by a convergent geometric series; for $|x|>\\frac13$, infinitely many terms have $(2+\\sin n)|x|>1$, so the terms do not tend to $0$."
  },
  "burst-boss2-param-001": {
    "spot": "$e^{-ax}\\sin bx$ is \"exponential times trig\": integrating by parts twice loops back to the original integral; faster is to see it as the imaginary part of $e^{-(a-bi)x}$ and integrate once.",
    "why": "The complex exponential compresses two integrations by parts into the single integral $\\int_0^\\infty e^{-(a-bi)x}dx=\\frac{1}{a-bi}$; convergence needs $a>0$.",
    "steps": [
      "For $a>0$, $\\int_0^\\infty e^{-(a-bi)x}dx=\\frac{1}{a-bi}=\\frac{a+bi}{a^2+b^2}$; the real part is the $\\cos$ integral, $\\frac{a}{a^2+b^2}$.",
      "Take the imaginary part; the corresponding real antiderivative is $\\frac{e^{-ax}(-a\\sin bx-b\\cos bx)}{a^2+b^2}$.",
      "Plug in the limits: it is $0$ as $x\\to\\infty$ and $-\\frac{b}{a^2+b^2}$ at $x=0$. $F(a,b)=\\frac{b}{a^2+b^2}$."
    ],
    "trap": "Taking the real part instead and answering $\\frac{a}{a^2+b^2}$ — that is the integral of $\\cos bx$.",
    "check": "With $a=2$, $b=3$ it is $\\frac3{13}$; with $b=0$, $\\sin0=0$, so the integral should be $0$ too."
  },
  "burst-boss2-param-002": {
    "spot": "$e^{-ax}\\cos bx$ is \"exponential times trig\": see it as the real part of $e^{-(a-bi)x}$ and integrate once, with no need to integrate by parts twice.",
    "why": "The complex exponential compresses two integrations by parts into $\\int_0^\\infty e^{-(a-bi)x}dx=\\frac{1}{a-bi}$; convergence needs $a>0$.",
    "steps": [
      "For $a>0$, $\\int_0^\\infty e^{-(a-bi)x}dx=\\frac{1}{a-bi}=\\frac{a+bi}{a^2+b^2}$.",
      "Take the real part; the corresponding real antiderivative is $\\frac{e^{-ax}(b\\sin bx-a\\cos bx)}{a^2+b^2}$.",
      "Plug in the limits: it is $0$ as $x\\to\\infty$ and $-\\frac{a}{a^2+b^2}$ at $x=0$. $F(a,b)=\\frac{a}{a^2+b^2}$."
    ],
    "trap": "Taking the imaginary part instead and answering $\\frac{b}{a^2+b^2}$ — that is the integral of $\\sin bx$.",
    "check": "With $b=0$ it is $\\int_0^\\infty e^{-ax}dx=\\frac1a$; $a=2$ gives $\\frac12$."
  },
  "lec-20-q3b": {
    "spot": "The problem gives the area formula $A=\\frac12\\oint(x\\,dy-y\\,dx)$ and the parametrization, so just convert $dx$, $dy$ to $dt$ and substitute.",
    "why": "The ellipse's parametrization turns $x\\,dy-y\\,dx$ into the constant $ab\\,dt$, so the integral is immediate; in rectangular coordinates $\\int2b\\sqrt{1-x^2/a^2}\\,dx$ would still need a trigonometric substitution.",
    "steps": [
      "$dx=-a\\sin t\\,dt$, $dy=b\\cos t\\,dt$.",
      "$x\\,dy-y\\,dx=ab\\cos^2t\\,dt+ab\\sin^2t\\,dt=ab\\,dt$.",
      "$A=\\frac12\\int_0^{2\\pi}ab\\,dt=\\pi ab$."
    ],
    "trap": "Forgetting the $\\frac12$ in front and answering $2\\pi ab$; or mishandling the minus sign on $y\\,dx$ so the two terms cancel to $0$.",
    "check": "With $a=b=2$ it is a circle of radius $2$, with area $4\\pi$."
  },
  "lec-19-m5": {
    "spot": "The substitution $x=au$, $y=bv$ stretches the ellipse $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}\\le1$ into the unit disk $u^2+v^2\\le1$, and the areas differ only by the Jacobian $ab$.",
    "why": "The unit disk's area $\\pi$ is known, so multiplying by the Jacobian gives the answer; integrating directly in the $xy$-plane means dealing with square roots and a trigonometric substitution.",
    "steps": [
      "Jacobian: $\\frac{\\partial(x,y)}{\\partial(u,v)}=\\begin{vmatrix}a&0\\\\0&b\\end{vmatrix}=ab$.",
      "Region: $\\frac{(au)^2}{a^2}+\\frac{(bv)^2}{b^2}=u^2+v^2\\le1$, the unit disk, with area $\\pi$.",
      "Area $=\\iint_{u^2+v^2\\le1}ab\\,du\\,dv=\\pi ab$."
    ],
    "trap": "Forgetting to multiply by the Jacobian and answering the unit disk's $\\pi$; or remembering the unit disk's area as $2\\pi$ and getting $2\\pi ab$.",
    "check": "With $a=2$, $b=3$ the area is $6\\pi$; with $a=b$ it reduces to the circle area $\\pi a^2$."
  }
};
