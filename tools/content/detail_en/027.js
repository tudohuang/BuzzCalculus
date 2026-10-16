// Detail v2, English — batch 027. Translation of tools/content/detail/027.js (text only; claims live in the Chinese file).
module.exports = {
  "burst-boss-lim-003": {
    "spot": "The numerator is $\\ln(1+x)$ minus the first three terms of its own Taylor expansion, and the denominator is $x^4$: the answer is the $x^4$ coefficient of the expansion.",
    "why": "The first three terms are already gone, so the first surviving term $-\\frac{x^4}{4}$ is the answer; brute-force L'Hôpital's Rule needs four rounds, each one $\\frac00$.",
    "steps": [
      "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\cdots$, so the numerator leaves $-\\frac{x^4}{4}+\\frac{x^5}{5}-\\cdots$.",
      "A cleaner view: the derivative of the numerator is $\\frac{1}{1+x}-1+x-x^2=-\\frac{x^3}{1+x}$, so one round of L'Hôpital's Rule turns the numerator into something simple.",
      "L'Hôpital's Rule: $\\lim_{x\\to0}\\frac{-x^3/(1+x)}{4x^3}=\\lim_{x\\to0}\\frac{-1}{4(1+x)}=-\\frac14$."
    ],
    "trap": "Remembering the $x^4$ coefficient of $\\ln(1+x)$ as $+\\frac14$ (reading the alternating sign off by one) gives the answer $\\frac14$.",
    "check": "Plug $x=0.01$ into the original expression: about $-0.248$, very close to $-\\frac14$."
  },
  "burst-boss-ser-005": {
    "spot": "$(\\ln(1+x))^2$ is a product of two known series: the $x^6$ coefficient $=\\sum_{j+k=6}$ of products of coefficients, and $\\frac{1}{jk}$ splits into partial fractions.",
    "why": "Differentiating six times is exhausting; the Cauchy product plus $\\frac{1}{j(6-j)}=\\frac16\\left(\\frac1j+\\frac1{6-j}\\right)$ turns the whole sum into a harmonic number.",
    "steps": [
      "$\\ln(1+x)=\\sum_{k\\ge1}\\frac{(-1)^{k+1}}{k}x^k$; in the product, the sign of $x^jx^k$ is $(-1)^{j+k}=+1$ (since $j+k=6$ is even).",
      "So the coefficient is $\\sum_{j=1}^{5}\\frac{1}{j(6-j)}$; split it with $\\frac{1}{j(6-j)}=\\frac16\\left(\\frac1j+\\frac1{6-j}\\right)$.",
      "Each $\\frac1j$ appears twice: coefficient $=\\frac{2}{6}H_5=\\frac13\\cdot\\frac{137}{60}$.",
      "$\\frac{137}{180}$."
    ],
    "trap": "Thinking the squared alternating series still alternates, and subtracting some terms; $j+k=6$ is fixed and even, so every term is positive.",
    "check": "General formula: the $x^n$ coefficient $=\\frac{2(-1)^nH_{n-1}}{n}$; at $n=6$ it gives $\\frac{2H_5}{6}$."
  },
  "burst-boss2-der-001": {
    "spot": "Differentiating $e^x\\sin x$ once gives $\\sqrt2\\,e^x\\sin\\left(x+\\frac{\\pi}{4}\\right)$ — same shape, just multiplied by $\\sqrt2$ with phase shifted by $\\frac{\\pi}{4}$. Differentiating 21 times just repeats this 21 times.",
    "why": "The Leibniz formula would need 22 terms; once you see that each derivative rotates by $45^\\circ$ and scales by $\\sqrt2$, it is one step.",
    "steps": [
      "$(e^x\\sin x)'=e^x(\\sin x+\\cos x)=\\sqrt2\\,e^x\\sin\\left(x+\\frac{\\pi}{4}\\right)$.",
      "Apply the same rule repeatedly: the $n$-th derivative is $2^{n/2}e^x\\sin\\left(x+\\frac{n\\pi}{4}\\right)$.",
      "$n=21$, $x=0$: $2^{21/2}\\sin\\frac{21\\pi}{4}$, and $\\frac{21\\pi}{4}=4\\pi+\\frac{5\\pi}{4}$, $\\sin\\frac{5\\pi}{4}=-\\frac{1}{\\sqrt2}$.",
      "$2^{10}\\sqrt2\\cdot\\left(-\\frac{1}{\\sqrt2}\\right)=-1024$."
    ],
    "trap": "Using the phase $\\frac{n\\pi}{2}$ (as if it rotated $90^\\circ$ each time like $\\sin$ alone), or forgetting the $\\sqrt2$ scaling, and getting a small number like $\\pm1$.",
    "check": "You can also view it as $\\operatorname{Im}(1+i)^{21}$: $(1+i)^{4}=-4$, so $(1+i)^{21}=(-4)^5(1+i)=-1024-1024i$, imaginary part $-1024$."
  },
  "burst-boss2-der-002": {
    "spot": "Each derivative of $e^x\\cos x$ multiplies by $\\sqrt2$ and adds $\\frac{\\pi}{4}$ to the phase: $\\frac{d^n}{dx^n}e^x\\cos x=2^{n/2}e^x\\cos\\left(x+\\frac{n\\pi}{4}\\right)$.",
    "why": "Much faster than a 21-term Leibniz expansion: one periodic rule, plug in $n=20$ and you are done.",
    "steps": [
      "$(e^x\\cos x)'=e^x(\\cos x-\\sin x)=\\sqrt2\\,e^x\\cos\\left(x+\\frac{\\pi}{4}\\right)$.",
      "So the $n$-th derivative is $2^{n/2}e^x\\cos\\left(x+\\frac{n\\pi}{4}\\right)$.",
      "$n=20$: $2^{10}\\cos(5\\pi)=1024\\cdot(-1)$.",
      "The answer is $-1024$."
    ],
    "trap": "Seeing an even order and assuming you are back to the original function, so the answer is a positive $1024$; actually $20$ steps rotate by $5\\pi$, and the cosine is $-1$.",
    "check": "$\\operatorname{Re}(1+i)^{20}=\\operatorname{Re}(-4)^5=-1024$; the two methods agree."
  },
  "burst-boss2-int-002": {
    "spot": "$(\\ln x)^2$ with $\\frac{1}{1+x^3}$: $(\\ln x)^2$ comes down from differentiating $x^{s-1}$ twice in $s$, and $\\int_0^\\infty\\frac{x^{s-1}}{1+x^3}dx$ has a formula.",
    "why": "Finding an antiderivative directly is hopeless; compute the parametrized Mellin integral $\\frac{\\pi}{3\\sin(\\pi s/3)}$ first, then differentiating twice in $s$ is pure trig differentiation.",
    "steps": [
      "Formula: $I(s)=\\int_0^\\infty\\frac{x^{s-1}}{1+x^3}dx=\\frac{\\pi}{3\\sin(\\pi s/3)}$, $0<s<3$ (e.g. it holds at $s=1$ and $s=\\frac32$).",
      "$\\frac{\\partial^2}{\\partial s^2}x^{s-1}=x^{s-1}(\\ln x)^2$, so the integral we want $=I''(1)$.",
      "$I(s)=\\frac{\\pi}{3}\\csc\\frac{\\pi s}{3}$, $I''=\\frac{\\pi^3}{27}\\csc\\theta(\\cot^2\\theta+\\csc^2\\theta)$; at $\\theta=\\frac{\\pi}{3}$, $\\csc\\theta=\\frac{2}{\\sqrt3}$ and $\\cot^2\\theta+\\csc^2\\theta=\\frac53$.",
      "$I''(1)=\\frac{\\pi^3}{27}\\cdot\\frac{2}{\\sqrt3}\\cdot\\frac53=\\frac{10\\pi^3}{81\\sqrt3}$."
    ],
    "trap": "Stopping after one derivative (that gives $\\int\\frac{\\ln x}{1+x^3}=I'(1)=-\\frac{2\\pi^2}{27}$), or dropping the $\\cot^2$ term in the second derivative of $\\csc$.",
    "check": "The integrand is nonnegative, and the answer, about $2.21$, is positive; numerical integration gives the same number."
  },
  "burst-boss2-int-003": {
    "spot": "$\\sqrt x\\,dx$ has exactly the shape of $d\\left(x^{3/2}\\right)$, and the denominator is $1+x^3=1+\\left(x^{3/2}\\right)^2$.",
    "why": "After substituting $u=x^{3/2}$ it is the standard $\\arctan$ integral; no partial fractions needed.",
    "steps": [
      "Let $u=x^{3/2}$, $du=\\frac32\\sqrt x\\,dx$.",
      "$x^3=u^2$, so the integral becomes $\\frac23\\int_0^\\infty\\frac{du}{1+u^2}$.",
      "$\\frac23\\cdot\\frac{\\pi}{2}=\\frac{\\pi}{3}$."
    ],
    "trap": "Forgetting the factor $\\frac23$ in the substitution and writing the answer as $\\frac{\\pi}{2}$.",
    "check": "Integrating the original numerically also gives $\\frac{\\pi}{3}\\approx1.047$."
  },
  "burst-boss2-int-004": {
    "spot": "$\\int_0^\\infty\\frac{x^{\\text{power}}}{1+x^2}$: let $t=x^2$ and it becomes the standard form $\\int_0^\\infty\\frac{t^{p-1}}{1+t}dt=\\frac{\\pi}{\\sin p\\pi}$.",
    "why": "$x^{1/3}$ blocks both partial fractions and trigonometric substitution; converting to $\\frac{t^{p-1}}{1+t}$ and using the reflection formula gets there in one step.",
    "steps": [
      "Let $t=x^2$, $dx=\\frac{dt}{2\\sqrt t}$, $x^{1/3}=t^{1/6}$: the integral $=\\frac12\\int_0^\\infty\\frac{t^{-1/3}}{1+t}dt$.",
      "This is $\\int_0^\\infty\\frac{t^{p-1}}{1+t}dt=\\frac{\\pi}{\\sin p\\pi}$ with $p=\\frac23$ (at $p=\\frac12$ it is the familiar $\\pi$).",
      "$\\sin\\frac{2\\pi}{3}=\\frac{\\sqrt3}{2}$, so the integral $=\\frac12\\cdot\\frac{\\pi}{\\sqrt3/2}=\\frac{\\pi}{\\sqrt3}$."
    ],
    "trap": "After substituting, taking the power as $t^{1/6}$ and forgetting the $t^{-1/2}$ from $dx$, then plugging $p=\\frac76$ into the formula (which is even outside the range $0<p<1$).",
    "check": "The answer $\\approx1.81$ is larger than $\\int_0^\\infty\\frac{dx}{1+x^2}=\\frac{\\pi}{2}$, which makes sense: the part with $x>1$ is magnified by $x^{1/3}$."
  },
  "burst-boss2-int-005": {
    "spot": "$\\arctan x$ and $\\frac{dx}{1+x^2}$ appear together: let $x=\\tan\\theta$, so $\\arctan x$ becomes $\\theta$ and $\\frac{dx}{1+x^2}$ becomes $d\\theta$.",
    "why": "After the substitution only $\\int_0^{\\pi/2}\\theta\\cot\\theta\\,d\\theta$ remains, and one integration by parts lands on the familiar $\\int_0^{\\pi/2}\\ln\\sin\\theta=-\\frac{\\pi}{2}\\ln2$.",
    "steps": [
      "$x=\\tan\\theta$: $\\frac{dx}{1+x^2}=d\\theta$, $\\frac{\\arctan x}{x}=\\frac{\\theta}{\\tan\\theta}$, and the integral becomes $\\int_0^{\\pi/2}\\theta\\cot\\theta\\,d\\theta$.",
      "By parts: $u=\\theta$, $dv=\\cot\\theta\\,d\\theta$, $v=\\ln\\sin\\theta$; the boundary term $\\theta\\ln\\sin\\theta$ is $0$ at both ends.",
      "What remains is $-\\int_0^{\\pi/2}\\ln\\sin\\theta\\,d\\theta=\\frac{\\pi}{2}\\ln2$.",
      "The answer is $\\frac{\\pi\\ln2}{2}$."
    ],
    "trap": "Remembering $\\int_0^{\\pi/2}\\ln\\sin\\theta$ as $+\\frac{\\pi}{2}\\ln2$ gives a negative answer — but the integrand is positive everywhere.",
    "check": "The answer $\\approx1.089$ is positive and matches numerical integration."
  },
  "burst-boss2-int-006": {
    "spot": "The denominator of $\\left(\\frac{\\sin x}{x}\\right)^2$ is $x^2$: one integration by parts (integrating $\\frac{1}{x^2}$ to $-\\frac1x$) turns it into the Dirichlet integral $\\int_0^\\infty\\frac{\\sin 2x}{x}dx$.",
    "why": "The square itself has no elementary antiderivative; integration by parts reduces it to the known $\\int_0^\\infty\\frac{\\sin u}{u}du=\\frac{\\pi}{2}$.",
    "steps": [
      "By parts: $u=\\sin^2x$, $dv=\\frac{dx}{x^2}$, $v=-\\frac1x$; the boundary term $-\\frac{\\sin^2x}{x}$ is $0$ at both $0$ and $\\infty$.",
      "$(\\sin^2x)'=2\\sin x\\cos x=\\sin2x$, leaving $\\int_0^\\infty\\frac{\\sin2x}{x}dx$.",
      "Let $u=2x$: $\\frac{\\sin2x}{x}dx=\\frac{\\sin u}{u}du$; and $\\int_0^\\infty\\frac{\\sin u}{u}du=\\int_0^\\infty\\frac{dt}{1+t^2}=\\frac{\\pi}{2}$ (write $\\frac1u$ as $\\int_0^\\infty e^{-ut}dt$ and swap the order).",
      "The answer is $\\frac{\\pi}{2}$."
    ],
    "trap": "Thinking the substitution $u=2x$ adds a factor of $2$, getting $\\pi$ or $\\frac{\\pi}{4}$; $\\frac{\\sin 2x}{x}dx$ becomes exactly $\\frac{\\sin u}{u}du$, with no extra factor.",
    "check": "Numerically, $\\int_0^{40}$ is already a bit less than the answer, and the tail $\\int_{40}^\\infty\\frac{\\sin^2x}{x^2}dx\\le\\frac{1}{40}$, which pins down $\\frac{\\pi}{2}$."
  },
  "burst-boss2-int-008": {
    "spot": "On $[0,1)$, $\\frac{1}{1-x}$ expands as $\\sum x^n$, and each term $\\int_0^1x^n(\\ln x)^3dx=-\\frac{6}{(n+1)^4}$ has a closed form.",
    "why": "Expand and integrate term by term, and the whole problem becomes $-6\\zeta(4)$; finding an antiderivative is simply impossible.",
    "steps": [
      "$\\frac{1}{1-x}=\\sum_{n\\ge0}x^n$, so the integral $=\\sum_{n\\ge0}\\int_0^1x^n(\\ln x)^3dx$.",
      "$\\int_0^1x^n(\\ln x)^3dx=-\\frac{3!}{(n+1)^4}$ (let $x=e^{-t}$ to get $-\\int_0^\\infty t^3e^{-(n+1)t}dt$); e.g. $n=2$ gives $-\\frac{6}{81}$.",
      "Add up: $-6\\sum_{m\\ge1}\\frac{1}{m^4}=-6\\cdot\\frac{\\pi^4}{90}$.",
      "$-\\frac{6\\pi^4}{90}=-\\frac{\\pi^4}{15}$."
    ],
    "trap": "$(\\ln x)^3$ is negative on $(0,1)$; forgetting the minus sign gives $+\\frac{\\pi^4}{15}$. Or writing $3!$ as $3$.",
    "check": "The integrand is negative throughout $(0,1)$, and the answer $\\approx-6.49$ is negative."
  },
  "burst-boss2-int-009": {
    "spot": "Another $\\frac{(\\ln x)^m}{1-x}$: expand $\\frac{1}{1-x}=\\sum x^n$; each term is $\\int_0^1x^n(\\ln x)^5dx=-\\frac{5!}{(n+1)^6}$, and the whole thing $=-120\\zeta(6)$.",
    "why": "Geometric series plus $\\int_0^1x^n(\\ln x)^m=\\frac{(-1)^mm!}{(n+1)^{m+1}}$ turns the integral directly into a $\\zeta$ value.",
    "steps": [
      "$\\int_0^1\\frac{(\\ln x)^5}{1-x}dx=\\sum_{n\\ge0}\\int_0^1x^n(\\ln x)^5dx$.",
      "Each term $=-\\frac{120}{(n+1)^6}$; e.g. $n=0$: $\\int_0^1(\\ln x)^5dx=-120$.",
      "$\\zeta(6)=\\frac{\\pi^6}{945}$.",
      "$-120\\cdot\\frac{\\pi^6}{945}=-\\frac{8\\pi^6}{63}$."
    ],
    "trap": "Misremembering $\\zeta(6)$ as $\\frac{\\pi^6}{540}$ or $\\frac{\\pi^6}{90}$; the denominators of $\\zeta(2),\\zeta(4),\\zeta(6)$ are $6,90,945$.",
    "check": "The answer $\\approx-122.1$ is slightly larger in absolute value than $-120$, because $\\zeta(6)$ is only a little bigger than $1$."
  },
  "burst-boss2-int-010": {
    "spot": "The denominator is $1+x$ (not $1-x$): expand $\\frac{1}{1+x}=\\sum(-1)^nx^n$ and integrate term by term to get the alternating $\\eta(4)=\\sum\\frac{(-1)^{n+1}}{n^4}$.",
    "why": "Same trick as the $\\frac{1}{1-x}$ problem, just with alternating signs; $\\eta(4)=\\left(1-2^{-3}\\right)\\zeta(4)$ links straight back to $\\pi^4$.",
    "steps": [
      "$\\int_0^1\\frac{(\\ln x)^3}{1+x}dx=\\sum_{n\\ge0}(-1)^n\\int_0^1x^n(\\ln x)^3dx=\\sum_{n\\ge0}(-1)^n\\cdot\\frac{-6}{(n+1)^4}$.",
      "So the integral $=-6\\,\\eta(4)$, where $\\eta(4)=\\sum_{m\\ge1}\\frac{(-1)^{m+1}}{m^4}$.",
      "$\\eta(4)=\\frac78\\cdot\\frac{\\pi^4}{90}=\\frac{7\\pi^4}{720}$.",
      "$-6\\cdot\\frac{7\\pi^4}{720}=-\\frac{7\\pi^4}{120}$."
    ],
    "trap": "Ignoring the alternating signs and computing $-6\\zeta(4)=-\\frac{\\pi^4}{15}$; that is the answer for $\\frac{1}{1-x}$.",
    "check": "$\\frac{1}{1+x}<\\frac{1}{1-x}$, so the answer's absolute value should be smaller than $\\frac{\\pi^4}{15}$: $5.68<6.49$."
  },
  "burst-boss2-int-011": {
    "spot": "$\\frac{(\\ln x)^5}{1+x}$: expand $\\frac{1}{1+x}$ as an alternating geometric series; each term is $\\int_0^1x^n(\\ln x)^5=-\\frac{120}{(n+1)^6}$, and the whole thing $=-120\\,\\eta(6)$.",
    "why": "The alternating version of $\\zeta$: $\\eta(6)=\\left(1-2^{-5}\\right)\\zeta(6)$, then use $\\zeta(6)=\\frac{\\pi^6}{945}$.",
    "steps": [
      "$\\int_0^1\\frac{(\\ln x)^5}{1+x}dx=\\sum_{n\\ge0}(-1)^n\\cdot\\frac{-120}{(n+1)^6}$.",
      "$\\eta(6)=\\sum\\frac{(-1)^{m+1}}{m^6}=\\frac{31}{32}\\zeta(6)$ (the even terms are $\\frac{1}{64}\\zeta(6)$, subtracted twice).",
      "$\\eta(6)=\\frac{31\\pi^6}{30240}$.",
      "$-120\\cdot\\frac{31\\pi^6}{30240}=-\\frac{31\\pi^6}{252}$."
    ],
    "trap": "Writing $\\eta(s)=(1-2^{1-s})\\zeta(s)$ as $(1-2^{-s})\\zeta(s)$, which gives $\\frac{63}{64}$ instead of $\\frac{31}{32}$.",
    "check": "The answer $\\approx-118.3$ is a little smaller in size than the $\\frac{1}{1-x}$ version's $-122.1$, which makes sense."
  },
  "burst-boss2-lim-005": {
    "spot": "The numerator is $\\int_0^xe^{-t^2}dt$ minus the first two terms of its Taylor expansion, $x-\\frac{x^3}{3}$, and the denominator is $x^5$: it asks for the $x^5$ coefficient.",
    "why": "Expanding $e^{-t^2}$ and integrating term by term is fastest; L'Hôpital's Rule also works and removes the integral in one round.",
    "steps": [
      "$e^{-t^2}=1-t^2+\\frac{t^4}{2}-\\cdots$; integrating term by term: $\\int_0^xe^{-t^2}dt=x-\\frac{x^3}{3}+\\frac{x^5}{10}-\\cdots$.",
      "Or one round of L'Hôpital's Rule: the numerator's derivative is $e^{-x^2}-1+x^2$, the denominator's is $5x^4$.",
      "$e^{-x^2}-1+x^2\\approx\\frac{x^4}{2}$, so the limit $=\\frac{1/2}{5}=\\frac{1}{10}$."
    ],
    "trap": "Forgetting to divide by $5$ when integrating $\\frac{t^4}{2}$, and writing the answer as $\\frac12$.",
    "check": "Plug $x=0.1$ into the original: about $0.0999$."
  },
  "burst-boss2-lim-009": {
    "spot": "$\\sum\\frac{1}{\\sqrt{n^2+k^2}}=\\frac1n\\sum f\\left(\\frac kn\\right)$ with $f(x)=\\frac{1}{\\sqrt{1+x^2}}$: a right-endpoint Riemann sum whose integral is $\\ln(1+\\sqrt2)$; multiplying by $n$ asks for the leading error term.",
    "why": "The leading error of a right-endpoint Riemann sum is $\\frac{f(1)-f(0)}{2n}$ (the trapezoid correction); multiply by $n$ and that is the answer.",
    "steps": [
      "$\\frac{1}{\\sqrt{n^2+k^2}}=\\frac1n\\cdot\\frac{1}{\\sqrt{1+(k/n)^2}}$, so the sum $=\\frac1n\\sum_{k=1}^nf\\left(\\frac kn\\right)$.",
      "$\\int_0^1\\frac{dx}{\\sqrt{1+x^2}}=\\ln\\left(x+\\sqrt{1+x^2}\\right)\\Big|_0^1=\\ln(1+\\sqrt2)$.",
      "Right-endpoint sum $=\\int_0^1f+\\frac{f(1)-f(0)}{2n}+O\\left(\\frac{1}{n^2}\\right)$, with $f(1)=\\frac{1}{\\sqrt2}$ and $f(0)=1$.",
      "Multiply by $n$ and take the limit: $\\frac{f(1)-f(0)}{2}=\\frac{1}{2}\\left(\\frac{1}{\\sqrt2}-1\\right)$."
    ],
    "trap": "Writing the error as $\\frac{f(0)-f(1)}{2n}$ (that is the left-endpoint sum) flips the sign and gives $\\frac{1-1/\\sqrt2}{2}$.",
    "check": "$f$ is decreasing, so the right-endpoint sum is below the integral and the limit should be negative: about $-0.146$."
  },
  "burst-boss2-param-006": {
    "spot": "$x^a(\\ln x)^5$: each $\\ln x$ comes down from differentiating $x^a$ once in $a$ — differentiate $\\int_0^1x^adx=\\frac{1}{a+1}$ five times in $a$.",
    "why": "Five rounds of integration by parts mean handling the boundary at $x\\to0$ each time; differentiating $(a+1)^{-1}$ five times is just the Power Rule.",
    "steps": [
      "$\\frac{\\partial}{\\partial a}x^a=x^a\\ln x$, so $\\frac{\\partial^5}{\\partial a^5}x^a=x^a(\\ln x)^5$.",
      "$\\int_0^1x^adx=\\frac{1}{a+1}$.",
      "Differentiate $(a+1)^{-1}$ five times: $(-1)(-2)(-3)(-4)(-5)(a+1)^{-6}=-\\frac{120}{(a+1)^6}$.",
      "So $F(a)=-\\frac{120}{(a+1)^6}$."
    ],
    "trap": "The sign: an odd number of derivatives leaves a minus sign, and $(\\ln x)^5<0$ on $(0,1)$, so the answer must be negative; writing $+\\frac{120}{(a+1)^6}$ is wrong.",
    "check": "$a=0$: $\\int_0^1(\\ln x)^5dx=-5!=-120$, and the formula gives $-\\frac{120}{1}$."
  },
  "burst-boss2-ser-001": {
    "spot": "$\\zeta(4)$: use the Fourier series of $x^2$ on $[-\\pi,\\pi]$; its coefficients $\\frac{4(-1)^n}{n^2}$ squared are exactly $\\frac{16}{n^4}$ — Parseval's identity.",
    "why": "Parseval turns $\\sum a_n^2$ into $\\frac1\\pi\\int f^2$, and $\\int_{-\\pi}^{\\pi}x^4dx$ is immediate.",
    "steps": [
      "$x^2=\\frac{\\pi^2}{3}+\\sum_{n\\ge1}\\frac{4(-1)^n}{n^2}\\cos nx$; the constant coefficient is $a_0=\\frac1\\pi\\int_{-\\pi}^{\\pi}x^2dx=\\frac{2\\pi^2}{3}$, and $a_n=\\frac{4(-1)^n}{n^2}$ (e.g. $n=3$).",
      "Parseval: $\\frac1\\pi\\int_{-\\pi}^{\\pi}x^4dx=\\frac{a_0^2}{2}+\\sum a_n^2$, and the left side $=\\frac{2\\pi^4}{5}$.",
      "$\\frac{2\\pi^4}{5}=\\frac{2\\pi^4}{9}+16\\sum\\frac{1}{n^4}$, so $\\sum\\frac{1}{n^4}=\\frac{1}{16}\\left(\\frac{2\\pi^4}{5}-\\frac{2\\pi^4}{9}\\right)$.",
      "The answer is $\\frac{\\pi^4}{90}$."
    ],
    "trap": "Writing the constant term in Parseval as $a_0^2$ instead of $\\frac{a_0^2}{2}$ subtracts $\\frac{2\\pi^4}{9}$ twice and gives a negative number.",
    "check": "The first three terms $1+\\frac1{16}+\\frac1{81}\\approx1.075$ are already very close to $1.0823$."
  },
  "burst-boss2-ser-003": {
    "spot": "The alternating version of $\\sum\\frac{1}{n^4}$: pull out the even terms, $\\eta(4)=\\zeta(4)-2\\cdot\\frac{1}{2^4}\\zeta(4)$.",
    "why": "The alternating sum links straight back to the known $\\zeta(4)=\\frac{\\pi^4}{90}$ — no need to redo the Fourier argument.",
    "steps": [
      "Sum of the even terms: $\\sum\\frac{1}{(2m)^4}=\\frac{1}{16}\\zeta(4)$.",
      "Alternating sum $=$ everything $-2\\times$ even terms $=\\left(1-\\frac{2}{16}\\right)\\zeta(4)=\\frac78\\zeta(4)$.",
      "$\\frac78\\cdot\\frac{\\pi^4}{90}=\\frac{7\\pi^4}{720}$."
    ],
    "trap": "Subtracting the even terms only once (that gives the odd-term sum $\\frac{15}{16}\\zeta(4)$); the alternating sum turns the even terms from plus to minus, so subtract them twice.",
    "check": "An alternating series sits between its partial sums: $1-\\frac1{16}<$ answer $<1$."
  },
  "burst-boss2-ser-004": {
    "spot": "$\\sum\\frac{(-1)^{n+1}}{n^6}$ is $\\eta(6)$: alternating sum $=\\zeta(6)$ minus twice the even terms $=\\left(1-2^{-5}\\right)\\zeta(6)$.",
    "why": "As long as you remember $\\zeta(6)=\\frac{\\pi^6}{945}$, the alternating version is just a factor of $\\frac{31}{32}$.",
    "steps": [
      "$\\zeta(6)=\\frac{\\pi^6}{945}$.",
      "Even terms $\\sum\\frac{1}{(2m)^6}=\\frac{1}{64}\\zeta(6)$, so the alternating sum $=\\left(1-\\frac{2}{64}\\right)\\zeta(6)=\\frac{31}{32}\\zeta(6)$.",
      "$\\frac{31}{32}\\cdot\\frac{\\pi^6}{945}=\\frac{31\\pi^6}{30240}$."
    ],
    "trap": "Using $1-\\frac{1}{64}$ (subtracting once) gives $\\frac{63}{64}\\zeta(6)$ — that is the sum of the odd terms.",
    "check": "Alternating series: $1-\\frac{1}{64}<$ answer $<1$; it is about $0.9855$."
  },
  "burst-boss2-ser-007": {
    "spot": "$H_n$ is the partial sum of $1,\\frac12,\\frac13,\\dots$: $\\sum H_nx^n$ is $-\\ln(1-x)$ times $\\frac{1}{1-x}$ (multiplying by $\\frac{1}{1-x}$ takes partial sums).",
    "why": "Memorize the generating function $\\sum H_nx^n=\\frac{-\\ln(1-x)}{1-x}$ and plug in $x=\\frac13$; adding terms by hand converges too slowly.",
    "steps": [
      "$-\\ln(1-x)=\\sum_{k\\ge1}\\frac{x^k}{k}$; e.g. at $x=\\frac13$, $\\sum\\frac{1}{k3^k}=\\ln\\frac32$.",
      "Multiply by $\\frac{1}{1-x}=\\sum x^m$: the coefficient of $x^n$ is $\\sum_{k\\le n}\\frac1k=H_n$, so $\\sum H_nx^n=\\frac{-\\ln(1-x)}{1-x}$.",
      "Plug in $x=\\frac13$: $\\frac{-\\ln(2/3)}{2/3}=\\frac32\\ln\\frac32$."
    ],
    "trap": "Forgetting to divide by $1-x$ and writing just $-\\ln(1-x)=\\ln\\frac32$; that is $\\sum\\frac{1}{n3^n}$, not $\\sum\\frac{H_n}{3^n}$.",
    "check": "The first three terms $\\frac13+\\frac{3/2}{9}+\\frac{11/6}{27}\\approx0.568$ are a bit below the answer $0.608$, which makes sense."
  },
  "burst-boss2-ser-008": {
    "spot": "$\\sum\\frac{H_n}{4^n}$ is $\\sum H_nx^n$ at $x=\\frac14$: the generating function $\\frac{-\\ln(1-x)}{1-x}$.",
    "why": "$H_n$ is a partial sum, and multiplying by $\\frac{1}{1-x}$ produces partial sums; just plug in — no double sum needed.",
    "steps": [
      "$\\sum_{k\\ge1}\\frac{x^k}{k}=-\\ln(1-x)$; at $x=\\frac14$ it is $\\ln\\frac43$.",
      "Multiplying by $\\frac{1}{1-x}$ turns the coefficients into partial sums $H_n$: $\\sum H_nx^n=\\frac{-\\ln(1-x)}{1-x}$.",
      "$x=\\frac14$: $\\frac{\\ln(4/3)}{3/4}=\\frac43\\ln\\frac43$."
    ],
    "trap": "Using $\\frac{-\\ln(1-x)}{x}$ or multiplying by $(1-x)$ gives $\\frac34\\ln\\frac43$; the denominator is $1-x=\\frac34$, so divide.",
    "check": "The first two terms $\\frac14+\\frac{3/2}{16}\\approx0.344$; the answer $\\approx0.384$ is a little larger, which makes sense."
  },
  "burst-boss3-int-008": {
    "spot": "$x^3e^{-2x}\\cos3x$: $e^{-2x}\\cos3x=\\operatorname{Re}e^{-(2-3i)x}$, and with $x^3$ this is $\\int_0^\\infty x^ne^{-sx}dx=\\frac{n!}{s^{n+1}}$ with $s=2-3i$.",
    "why": "Three rounds of integration by parts plus two more to loop back would be very long; the Gamma formula with complex $s$ leaves just the fourth power of one complex number.",
    "steps": [
      "$\\int_0^\\infty x^3e^{-sx}dx=\\frac{3!}{s^4}$ (for real $s$, e.g. $s=2$ gives $\\frac{6}{16}$; it also holds for complex $s$ with real part $>0$).",
      "$s=2-3i$: $s^2=4-12i-9=-5-12i$.",
      "$s^4=(-5-12i)^2=25+120i-144=-119+120i$, $|s^4|^2=119^2+120^2=28561$.",
      "$\\frac{6}{s^4}=\\frac{6(-119-120i)}{28561}$, with real part $-\\frac{714}{28561}$."
    ],
    "trap": "Using the conjugate $s=2+3i$ is also fine, but forgetting to multiply by the conjugate when taking the reciprocal and writing $\\frac{6}{-119}$ gets the real part wrong.",
    "check": "Numerically integrating the original gives about $-0.0250$, consistent with $-\\frac{714}{28561}$."
  },
  "burst-boss3-int-009": {
    "spot": "$x^3e^{-2x}\\sin3x$: $\\sin3x$ is the imaginary part of $e^{3ix}$, so the whole integral is $\\operatorname{Im}\\frac{3!}{(2-3i)^4}$.",
    "why": "The $\\cos$ and $\\sin$ versions come from the same complex number $\\frac{6}{(2-3i)^4}$; compute it once and you get both the real and imaginary parts.",
    "steps": [
      "$\\int_0^\\infty x^3e^{-sx}dx=\\frac{6}{s^4}$; take $s=2-3i$, so $e^{-sx}=e^{-2x}(\\cos3x+i\\sin3x)$.",
      "$(2-3i)^2=-5-12i$, $(2-3i)^4=-119+120i$.",
      "$\\frac{6}{-119+120i}=\\frac{6(-119-120i)}{28561}$.",
      "Imaginary part $-\\frac{720}{28561}$."
    ],
    "trap": "Assuming the $\\sin$ part is positive (the integrand starts out positive) and writing $+\\frac{720}{28561}$; the later negative lobes are magnified by $x^3$, and the total is negative.",
    "check": "Numerically it is about $-0.0252$; the negative sign is right."
  },
  "burst-boss3-int-010": {
    "spot": "Polynomial times exponential times cosine: view $\\cos2x$ as the real part of $e^{2ix}$, so the whole integrand is the real part of $x^4e^{-(1-2i)x}$, and the Gamma formula $\\int_0^\\infty x^ne^{-sx}dx=\\frac{n!}{s^{n+1}}$ applies directly.",
    "why": "Integration by parts would take four rounds, each dragging trig functions along; the Gamma formula plus one complex fifth power is much cleaner.",
    "steps": [
      "$\\int_0^\\infty x^4e^{-sx}dx=\\frac{24}{s^5}$ (at $s=1$ it is just $4!=24$).",
      "$(1-2i)^2=-3-4i$, $(1-2i)^4=9+24i-16=-7+24i$.",
      "$(1-2i)^5=(-7+24i)(1-2i)=-7+14i+24i+48=41+38i$, and $41^2+38^2=3125$.",
      "$\\frac{24}{41+38i}=\\frac{24(41-38i)}{3125}$, with real part $\\frac{984}{3125}$."
    ],
    "trap": "Getting the exponent off by one between $n!$ and $s^{n+1}$ and writing $\\frac{24}{s^4}$; $3125=5^5=|s|^{10}$ is a reminder that it is a fifth power.",
    "check": "$|1-2i|^{10}=5^5=3125$, so the denominator matches."
  },
  "burst-boss3-int-011": {
    "spot": "$x^4e^{-x}\\sin2x=\\operatorname{Im}\\,x^4e^{-(1-2i)x}$: the answer is the imaginary part of $\\frac{24}{(1-2i)^5}$.",
    "why": "Same complex number as the $\\cos$ version; the Gamma formula is more reliable than four rounds of integration by parts.",
    "steps": [
      "$\\int_0^\\infty x^4e^{-sx}dx=\\frac{4!}{s^5}$, $s=1-2i$.",
      "$(1-2i)^5=41+38i$ (first $(1-2i)^2=-3-4i$, square again to get $-7+24i$, then multiply by $1-2i$).",
      "$\\frac{24}{41+38i}=\\frac{24(41-38i)}{41^2+38^2}=\\frac{984-912i}{3125}$.",
      "Imaginary part $-\\frac{912}{3125}$."
    ],
    "trap": "Forgetting the minus sign from the conjugate when taking the reciprocal, and writing $+\\frac{912}{3125}$.",
    "check": "Real part squared plus imaginary part squared should equal $\\left|\\frac{24}{s^5}\\right|^2=\\frac{576}{3125}$."
  },
  "burst-boss3-lim-007": {
    "spot": "The upper limit $x\\to0$, and the subtracted $\\frac32x$ is exactly the integrand's value at $t=0$ times $x$: expand the integrand to the $t^2$ term and you have the answer.",
    "why": "The integrand $\\frac{e^{t^2}-\\cos t}{t^2}=\\frac32+\\frac{11}{24}t^2+\\cdots$; after integrating, the $x^3$ coefficient is the limit. L'Hôpital's Rule does the same thing.",
    "steps": [
      "$e^{t^2}=1+t^2+\\frac{t^4}{2}+\\cdots$, $\\cos t=1-\\frac{t^2}{2}+\\frac{t^4}{24}-\\cdots$; subtracting gives $\\frac32t^2+\\frac{11}{24}t^4+\\cdots$.",
      "Divide by $t^2$ and integrate: $\\int_0^x\\left(\\frac32+\\frac{11}{24}t^2\\right)dt=\\frac32x+\\frac{11}{72}x^3$.",
      "Check with L'Hôpital's Rule: $\\lim\\frac{\\frac{e^{x^2}-\\cos x}{x^2}-\\frac32}{3x^2}=\\frac{11/24}{3}=\\frac{11}{72}$."
    ],
    "trap": "Taking the $+\\frac{1}{24}$ coefficient of the $t^4$ term of $\\cos t$ as still $+$ after the subtraction gives $\\frac12+\\frac1{24}$, and the answer becomes $\\frac{13}{72}$.",
    "check": "The answer is about $0.153$; plugging a very small $x$ into the original gives the same number."
  },
  "burst-boss3-lim-008": {
    "spot": "The leading term of $\\frac{1}{x^3}\\int_0^x\\sin(t^2)dt$ is $\\frac13$; subtract it and divide by $x^4$: it asks for the coefficient coming from integrating the second term of the expansion of $\\sin(t^2)$.",
    "why": "$\\sin(t^2)=t^2-\\frac{t^6}{6}+\\cdots$ integrated term by term takes one line; L'Hôpital's Rule would mean repeatedly differentiating a quotient involving an integral — messy.",
    "steps": [
      "$\\sin(t^2)=t^2-\\frac{t^6}{6}+\\cdots$.",
      "Integrate term by term: $\\int_0^x\\sin(t^2)dt=\\frac{x^3}{3}-\\frac{x^7}{42}+\\cdots$.",
      "Divide by $x^3$ and subtract $\\frac13$: $-\\frac{x^4}{42}+\\cdots$ remains; divide by $x^4$ to get $-\\frac{1}{42}$."
    ],
    "trap": "Forgetting to divide by $7$ when integrating $\\frac{t^6}{6}$, and writing the answer as $-\\frac16$.",
    "check": "Plugging in $x=0.3$ gives about $-0.0238$, consistent with $-\\frac1{42}\\approx-0.0238$."
  },
  "burst-boss3-param-001": {
    "spot": "$F(a)$ itself is the familiar $\\int_0^\\infty e^{-ax}\\sin(3x)dx=\\frac{3}{a^2+9}$; to get $F''$ just differentiate this rational function twice.",
    "why": "Integrate first, then differentiate: differentiating twice under the integral sign gives $\\int x^2e^{-ax}\\sin3x$, which is harder.",
    "steps": [
      "$F(a)=\\frac{3}{a^2+9}$ (the imaginary part of $\\frac{1}{a-3i}$).",
      "$F'(a)=-\\frac{6a}{(a^2+9)^2}$.",
      "$F''(a)=-\\frac{6}{(a^2+9)^2}+\\frac{24a^2}{(a^2+9)^3}=\\frac{18a^2-54}{(a^2+9)^3}$.",
      "Simplify: $F''(a)=\\frac{18(a^2-3)}{(a^2+9)^3}$."
    ],
    "trap": "In the second quotient-rule step, missing the Chain Rule when differentiating the denominator $(a^2+9)^2$ with respect to $a$ (the factor $2(a^2+9)\\cdot2a$) and stopping at $-\\frac{6}{(a^2+9)^2}$.",
    "check": "$F''(a)=\\int_0^\\infty x^2e^{-ax}\\sin3x\\,dx$: at $a=2$ both sides equal $\\frac{18}{2197}$."
  },
  "burst-boss3-param-002": {
    "spot": "$x^2e^{-ax}$: each $x$ can be pulled down by differentiating in $a$, $x^2e^{-ax}=\\frac{\\partial^2}{\\partial a^2}e^{-ax}$.",
    "why": "First compute $\\int_0^\\infty e^{-ax}\\cos x=\\frac{a}{a^2+1}$, then differentiate twice in $a$; easier than two rounds of integration by parts (each needing its own loop back).",
    "steps": [
      "$\\int_0^\\infty e^{-ax}\\cos x\\,dx=\\frac{a}{a^2+1}$.",
      "$\\frac{\\partial^2}{\\partial a^2}e^{-ax}=x^2e^{-ax}$, so $G(a)=\\frac{d^2}{da^2}\\frac{a}{a^2+1}$.",
      "First derivative: $\\frac{1-a^2}{(a^2+1)^2}$.",
      "Second derivative: $\\frac{2a^3-6a}{(a^2+1)^3}=\\frac{2(a^3-3a)}{(a^2+1)^3}$."
    ],
    "trap": "Thinking $\\frac{\\partial}{\\partial a}e^{-ax}=xe^{-ax}$ (missing the minus sign); with two derivatives the signs cancel, but on a one-derivative problem the sign comes out wrong.",
    "check": "$a=1$: $G(1)=\\frac{2(1-3)}{8}=-\\frac12$, and numerical integration also gives $-\\frac12$."
  },
  "burst-boss3-param-003": {
    "spot": "$x^3e^{-ax}\\sin x$: start from $\\int_0^\\infty e^{-ax}\\sin x=\\frac{1}{a^2+1}$; each extra $x$ is one more $-\\frac{\\partial}{\\partial a}$.",
    "why": "Three rounds of integration by parts with cycling trig functions make sign errors easy; differentiating $\\frac{1}{a^2+1}$ three times is just rational-function differentiation.",
    "steps": [
      "$\\int_0^\\infty e^{-ax}\\sin x\\,dx=\\frac{1}{a^2+1}$.",
      "$x^3e^{-ax}=-\\frac{\\partial^3}{\\partial a^3}e^{-ax}$, so $H=-\\frac{d^3}{da^3}\\frac{1}{a^2+1}$. Differentiate once first (with the minus sign): $\\frac{2a}{(a^2+1)^2}$, which is $\\int xe^{-ax}\\sin x$.",
      "Two derivatives remain (an even number, so no sign change): $H=\\frac{d^2}{da^2}\\frac{2a}{(a^2+1)^2}$. The first of them is $\\frac{2-6a^2}{(a^2+1)^3}$.",
      "Once more: $\\frac{24a^3-24a}{(a^2+1)^4}=\\frac{24a(a^2-1)}{(a^2+1)^4}$."
    ],
    "trap": "Dropping the overall sign $(-1)^3$ from the three derivatives gives $-\\frac{24a(a^2-1)}{(a^2+1)^4}$; for large $a$ the integrand is positive at small $x$, so the answer should be positive.",
    "check": "$a=2$: $\\frac{24\\cdot2\\cdot3}{625}=\\frac{144}{625}$, matching numerical integration."
  },
  "burst-boss3-param-005": {
    "spot": "$x^a(\\ln x)^6$: $(\\ln x)^6$ comes down from differentiating $x^a$ six times in $a$, and the generating integral is $\\int_0^1x^adx=\\frac{1}{a+1}$.",
    "why": "Differentiating $(a+1)^{-1}$ six times is just the Power Rule, a product $(-1)(-2)\\cdots(-6)=720$; six rounds of integration by parts is far too long.",
    "steps": [
      "$\\frac{\\partial}{\\partial a}x^a=x^a\\ln x$; six derivatives give $x^a(\\ln x)^6$.",
      "$\\int_0^1x^adx=\\frac{1}{a+1}$.",
      "Differentiate $(a+1)^{-1}$ six times: coefficient $(-1)(-2)(-3)(-4)(-5)(-6)=720$, exponent becomes $-7$.",
      "$C(a)=\\frac{720}{(a+1)^7}$."
    ],
    "trap": "Writing the power as $(a+1)^6$ (thinking six derivatives add six to the exponent); the correct exponent is $-1-6=-7$.",
    "check": "Plug in $a=0$: $\\int_0^1(\\ln x)^6dx=6!=720$, and the formula also gives $720$."
  },
  "burst-boss3-ser-001": {
    "spot": "$\\sum\\frac{n^k}{2^n}$: shift $n$ by one ($n\\to m+1$) and expand $(m+1)^k$ with the binomial theorem to get a recursion in terms of lower powers.",
    "why": "Applying $x\\frac{d}{dx}$ six times is error-prone; the recursion $S_k=\\sum_{j<k}\\binom kjT_j$ is just addition at each step.",
    "steps": [
      "Let $S_k=\\sum_{n\\ge1}\\frac{n^k}{2^n}$ and $T_0=\\sum_{m\\ge0}\\frac{1}{2^m}=2$. Shifting $n=m+1$: $S_k=\\frac12\\sum_j\\binom kjT_j$; rearranging gives $S_k=\\sum_{j<k}\\binom kjT_j$ (with $T_j=S_j$ for $j\\ge1$).",
      "$S_1=2$, $S_2=2+2\\cdot2=6$, $S_3=2+3\\cdot2+3\\cdot6=26$.",
      "$S_4=2+4\\cdot2+6\\cdot6+4\\cdot26=150$, $S_5=2+5\\cdot2+10\\cdot6+10\\cdot26+5\\cdot150=1082$.",
      "$S_6=2+6\\cdot2+15\\cdot6+20\\cdot26+15\\cdot150+6\\cdot1082=9366$."
    ],
    "trap": "Taking $T_0$ to be $S_0=\\sum_{n\\ge1}\\frac{1}{2^n}=1$, which misses the $m=0$ term and makes the whole recursion too small.",
    "check": "$S_k$ is twice the ordered Bell numbers: $1,3,13,75,541,4683$ times $2$, and the last one is exactly $9366$."
  },
  "burst-boss3-ser-005": {
    "spot": "$\\frac{H_n}{n}x^n$: $\\sum H_nx^n=\\frac{-\\ln(1-x)}{1-x}$ is known, and the extra $\\frac1n$ means divide by $x$ and integrate from $0$ to $x$.",
    "why": "Turn the series into an integral, then split with partial fractions $\\frac{1}{t(1-t)}=\\frac1t+\\frac{1}{1-t}$ into a dilogarithm and a $\\ln^2$; at $x=\\frac12$ they cancel neatly.",
    "steps": [
      "$\\sum\\frac{H_n}{n}x^n=\\int_0^x\\frac{-\\ln(1-t)}{t(1-t)}dt$, and we want $x=\\frac12$.",
      "Split: $\\frac{1}{t(1-t)}=\\frac1t+\\frac{1}{1-t}$.",
      "$\\int_0^{1/2}\\frac{-\\ln(1-t)}{1-t}dt=\\frac12\\ln^2(1-t)\\Big|$ evaluated between the limits $=\\frac12\\ln^22$.",
      "$\\int_0^{1/2}\\frac{-\\ln(1-t)}{t}dt=\\mathrm{Li}_2\\left(\\frac12\\right)=\\frac{\\pi^2}{12}-\\frac12\\ln^22$.",
      "The two $\\ln^22$ terms cancel: the answer is $\\frac{\\pi^2}{12}$."
    ],
    "trap": "Thinking $\\mathrm{Li}_2\\left(\\frac12\\right)=\\frac{\\pi^2}{12}$ is the answer and then adding an extra $\\frac12\\ln^22$, getting $\\frac{\\pi^2}{12}+\\frac12\\ln^22$.",
    "check": "The first three terms $\\frac12+\\frac{3/2}{8}+\\frac{11/6}{24}\\approx0.764$; the answer $\\approx0.822$ is a bit larger."
  },
  "burst-boss3-ser-006": {
    "spot": "The coefficients of $(\\ln(1+x))^2$ have a formula: one derivative gives $\\frac{2\\ln(1+x)}{1+x}$, and multiplying by $\\frac{1}{1+x}$ produces (alternating) partial sums — harmonic numbers.",
    "why": "The Cauchy product for $x^{20}$ has 19 terms; the formula $x^n$ coefficient $=\\frac{2(-1)^nH_{n-1}}{n}$ reduces it to $\\frac{H_{19}}{10}$ in one step.",
    "steps": [
      "$\\frac{d}{dx}(\\ln(1+x))^2=\\frac{2\\ln(1+x)}{1+x}$.",
      "Cauchy product: $x^n$ coefficient $=\\sum_{j+k=n}\\frac{(-1)^{j+k}}{jk}=\\frac{(-1)^n}{n}\\sum_{j=1}^{n-1}\\left(\\frac1j+\\frac1{n-j}\\right)=\\frac{2(-1)^nH_{n-1}}{n}$ (check at $n=4$: $\\frac13+\\frac14+\\frac13$).",
      "$n=20$: coefficient $=\\frac{2H_{19}}{20}=\\frac{H_{19}}{10}$; $H_{19}=\\int_0^1\\frac{1-t^{19}}{1-t}dt=\\frac{275295799}{77597520}$.",
      "The answer is $\\frac{275295799}{775975200}$."
    ],
    "trap": "Using $H_{20}$ (summing $j$ from $1$ to $n$); but $j+k=20$ with $k\\ge1$, so $j$ goes up to $19$ at most.",
    "check": "$H_{19}\\approx3.548$; divided by $10$ that is about $0.355$."
  },
  "burst-boss3-ser-007": {
    "spot": "$\\frac{e^{2x}}{(1-x)^3}$ is a product of two known series: $e^{2x}=\\sum\\frac{2^k}{k!}x^k$ and $\\frac{1}{(1-x)^3}=\\sum\\binom{m+2}{2}x^m$, so the $x^{18}$ coefficient is a 19-term convolution.",
    "why": "Differentiating 18 times is out of the question; the Cauchy product writes the coefficient as a finite sum of rational numbers.",
    "steps": [
      "The $x^m$ coefficient of $\\frac{1}{(1-x)^3}$ is $\\binom{m+2}{2}=\\frac{(m+1)(m+2)}{2}$ (differentiate $\\frac{1}{1-x}$ twice and divide by $2$).",
      "So the $x^{18}$ coefficient $=\\sum_{k=0}^{18}\\frac{2^k}{k!}\\cdot\\frac{(19-k)(20-k)}{2}$; the first three terms are $190+2\\cdot171+2\\cdot153$.",
      "Adding all 19 terms over a common denominator gives $\\frac{111165691613818}{97692469875}\\approx1137.9$; you can check numerically with the Cauchy integral formula on the circle of radius $\\frac12$ (in real form: $e^{2r\\cos t}\\rho^{-3}\\cos(2r\\sin t+3\\varphi-18t)$, where $\\rho,\\varphi$ are the modulus and negative argument of $1-re^{it}$)."
    ],
    "trap": "Remembering the coefficients of $\\frac{1}{(1-x)^3}$ as $\\binom{m+3}{3}$ or $m^2$; the cube corresponds to $\\binom{m+2}{2}$.",
    "check": "All terms are positive, and the first three, $190+342+306=838$, already make up most of it, so a total of $\\approx1138$ is reasonable."
  },
  "burst-boss3-ser-008": {
    "spot": "$\\frac{e^{2x}}{(1-x)^4}$: convolve the coefficients $\\frac{2^k}{k!}$ of $e^{2x}$ with the coefficients $\\binom{m+3}{3}$ of $\\frac{1}{(1-x)^4}$; the $x^{16}$ coefficient is a finite sum of 17 terms.",
    "why": "The Cauchy product is the only practical approach: every term is a simple rational number, so just add them up.",
    "steps": [
      "The $x^m$ coefficient of $\\frac{1}{(1-x)^4}$ $=\\binom{m+3}{3}=\\frac{(m+1)(m+2)(m+3)}{6}$ (differentiate $\\frac{1}{1-x}$ three times and divide by $3!$).",
      "The $x^{16}$ coefficient $=\\sum_{k=0}^{16}\\frac{2^k}{k!}\\binom{19-k}{3}$; the first two terms are $\\binom{19}{3}=969$ and $2\\binom{18}{3}=1632$.",
      "Adding all 17 terms gives $\\frac{1094053506107}{212837625}\\approx5140.3$; check with the Cauchy integral formula on the circle of radius $\\frac12$, with the integrand changed to $\\rho^{-4}$ and phase $4\\varphi-16t$."
    ],
    "trap": "Using $\\binom{m+4}{4}$ for the fourth power; the coefficients of $\\frac{1}{(1-x)^{p}}$ are $\\binom{m+p-1}{p-1}$.",
    "check": "All terms are positive, and the first two, $969+1632$, are already more than half, so a total of about $5140$ is reasonable."
  },
  "burst-int-027": {
    "spot": "Under $x\\to\\frac1x$, $\\frac{1}{1+x^4}$ becomes $\\frac{x^2}{1+x^4}$: the two integrals are equal, and their sum $\\frac{1+x^2}{1+x^4}$, divided through by $x^2$, is a perfect setup for $u=x-\\frac1x$.",
    "why": "Partial fractions would require splitting $1+x^4$ into two quadratics, which is tedious; the symmetry trick turns it into $\\int\\frac{du}{u^2+2}$ in two lines.",
    "steps": [
      "Let $x=\\frac1t$: $\\int_0^\\infty\\frac{dx}{1+x^4}=\\int_0^\\infty\\frac{t^2}{1+t^4}dt$.",
      "Add: $2I=\\int_0^\\infty\\frac{1+x^2}{1+x^4}dx=\\int_0^\\infty\\frac{1+1/x^2}{x^2+1/x^2}dx$. Let $u=x-\\frac1x$, $du=\\left(1+\\frac1{x^2}\\right)dx$, $x^2+\\frac1{x^2}=u^2+2$.",
      "$u$ runs from $-\\infty$ to $\\infty$: $2I=\\int_{-\\infty}^{\\infty}\\frac{du}{u^2+2}=\\frac{\\pi}{\\sqrt2}$.",
      "$I=\\frac{\\pi}{2\\sqrt2}$."
    ],
    "trap": "After substituting, thinking $u$ runs from $0$ to $\\infty$, losing half and getting $\\frac{\\pi}{4\\sqrt2}$; as $x\\to0^+$, $u=x-\\frac1x\\to-\\infty$.",
    "check": "The general formula $\\int_0^\\infty\\frac{dx}{1+x^n}=\\frac{\\pi/n}{\\sin(\\pi/n)}$ at $n=4$ gives $\\frac{\\pi/4}{\\sqrt2/2}$."
  },
  "db-ftc-005": {
    "spot": "Both limits are functions of $x$ ($x^2$ and $x^3$): Fundamental Theorem of Calculus with the Chain Rule — plug in the upper limit times its derivative, minus the lower limit plugged in times its derivative.",
    "why": "The antiderivative of $\\sqrt{1+t^2}$ is ugly; the Leibniz rule needs no integration at all.",
    "steps": [
      "$F'(x)=\\sqrt{1+(x^3)^2}\\cdot3x^2-\\sqrt{1+(x^2)^2}\\cdot2x$.",
      "$x=1$: $\\sqrt2\\cdot3-\\sqrt2\\cdot2$.",
      "$F'(1)=\\sqrt2$."
    ],
    "trap": "Forgetting to multiply by the derivatives of the limits and writing $\\sqrt{1+1}-\\sqrt{1+1}=0$.",
    "check": "$F(1)=\\int_1^1=0$, but $F'(1)$ need not be $0$; numerical differentiation also gives $\\sqrt2\\approx1.414$."
  },
  "db-inv-007": {
    "spot": "You need $(f^{-1})'(e)$: first find $a$ with $ae^a=e$ — clearly $a=1$.",
    "why": "The inverse of $xe^x$ is the Lambert $W$ function, which has no elementary formula; $(f^{-1})'(b)=\\frac{1}{f'(a)}$ only needs $a$.",
    "steps": [
      "$f(1)=1\\cdot e^1=e$, so $a=1$.",
      "$f'(x)=(1+x)e^x$, $f'(1)=2e$.",
      "$(f^{-1})'(e)=\\frac{1}{2e}$."
    ],
    "trap": "Plugging $e$ into $f'$: $\\frac{1}{f'(e)}=\\frac{1}{(1+e)e^e}$. $e$ is the output; the point to plug in is $a=1$.",
    "check": "For $x>0$, $f'=(1+x)e^x>0$, so $f$ is strictly increasing and the inverse exists."
  },
  "db-inv-008": {
    "spot": "The target value $1+\\frac{\\pi}{4}$ looks exactly like $\\tan\\frac{\\pi}{4}+\\frac{\\pi}{4}$: $a=\\frac{\\pi}{4}$.",
    "why": "$\\tan x+x$ has no elementary inverse; the inverse derivative only needs $\\frac{1}{f'(a)}$.",
    "steps": [
      "$f\\left(\\frac{\\pi}{4}\\right)=1+\\frac{\\pi}{4}$, so $a=\\frac{\\pi}{4}$.",
      "$f'(x)=\\sec^2x+1$, $f'\\left(\\frac{\\pi}{4}\\right)=2+1=3$.",
      "$(f^{-1})'\\left(1+\\frac{\\pi}{4}\\right)=\\frac13$."
    ],
    "trap": "Computing $\\sec^2\\frac{\\pi}{4}$ as $1$ (treating $\\sec$ like the square of $\\cos$), which gives $f'=2$ and the answer $\\frac12$.",
    "check": "$f'=\\sec^2x+1\\ge2>0$, so the function is strictly increasing on $|x|<\\frac{\\pi}{2}$."
  },
  "db-tan-009": {
    "spot": "A horizontal tangent means $y'=0$; in the derivative of $y=x^2\\ln x$ you can factor out $x$: $x(2\\ln x+1)$.",
    "why": "After the Product Rule, factor; $x>0$ means the factor $x$ can never be $0$, leaving only $2\\ln x+1=0$.",
    "steps": [
      "$y'=2x\\ln x+x=x(2\\ln x+1)$.",
      "The domain is $x>0$, so we need $2\\ln x+1=0$, $\\ln x=-\\frac12$.",
      "$x=e^{-1/2}=\\frac{1}{\\sqrt e}$."
    ],
    "trap": "Including $x=0$ as well — $\\ln x$ is undefined at $0$, so that is not a point on the curve.",
    "check": "$e^{-1/2}\\approx0.607$, and there $y$ reaches its minimum value $-\\frac{1}{2e}$."
  },
  "dx-calc-001": {
    "spot": "Both the base $x$ and the exponent $\\sin x$ vary — a variable raised to a variable power: take $\\ln$ first.",
    "why": "The Power Rule needs a constant exponent and the exponential rule needs a constant base; when both move, only logarithmic differentiation works.",
    "steps": [
      "$y=x^{\\sin x}$, $\\ln y=\\sin x\\ln x$.",
      "Differentiate both sides: $\\frac{y'}{y}=\\cos x\\ln x+\\frac{\\sin x}{x}$.",
      "Multiply back by $y$: $y'=x^{\\sin x}\\left(\\cos x\\ln x+\\frac{\\sin x}{x}\\right)$."
    ],
    "trap": "Treating it with the Power Rule and writing $\\sin x\\cdot x^{\\sin x-1}$ — that is only the second term of the answer, missing the $\\cos x\\ln x$ piece from the changing exponent.",
    "check": "At $x=\\frac{\\pi}{2}$: $\\cos=0$, so the derivative is just $\\left(\\frac{\\pi}{2}\\right)^1\\cdot\\frac{1}{\\pi/2}=1$."
  },
  "dx-calc-007": {
    "spot": "You need the derivative of the inverse function $g$ at $4$: first solve $f(a)=4$; trying $x=1$ in $x^5+x^3+2x$ gives $1+1+2=4$.",
    "why": "The inverse of a quintic polynomial cannot be written down; $g'(4)=\\frac{1}{f'(1)}$ needs only one point.",
    "steps": [
      "$f(1)=4$, so $g(4)=1$.",
      "$f'(x)=5x^4+3x^2+2$, $f'(1)=10$.",
      "$g'(4)=\\frac{1}{10}$."
    ],
    "trap": "Plugging $x=4$ into $f'$: $\\frac{1}{f'(4)}=\\frac{1}{1330}$. $4$ is an output of $f$, not an input.",
    "check": "$f'=5x^4+3x^2+2\\ge2>0$, so $f$ is strictly increasing and $g$ exists and is differentiable."
  },
  "gx-018": {
    "spot": "You are given the graph of $f'$ and asked for a value of $f$: $f(4)=f(0)+\\int_0^4f'(x)dx$, and the integral is the signed area under the broken line.",
    "why": "No need to find $f$ — just count area: one rectangle and a pair of triangles whose positive and negative parts cancel.",
    "steps": [
      "$[0,2]$: $f'=2$, area $2\\times2=4$.",
      "$[2,4]$: $f'$ drops linearly from $2$ to $-2$, i.e. $f'=2-2(x-2)$; it crosses zero at $x=3$, and the triangles above and below each have area $1$, canceling to $0$.",
      "$f(4)=1+4+0=5$."
    ],
    "trap": "Counting the triangle below the $x$-axis as positive area too, giving $f(4)=7$.",
    "check": "$f$ has its maximum at $x=3$ (where $f'$ changes from positive to negative), $f(3)=1+4+1=6$, then drops by $1$ to $5$."
  },
  "hc-spec-010": {
    "spot": "$J_0(x)=\\sum_{k\\ge0}\\frac{(-1)^k}{(k!)^2}\\left(\\frac x2\\right)^{2k}$ has only even powers; $x^8$ corresponds to $k=4$.",
    "why": "Just read the coefficient off the Bessel function's series; no need to solve the differential equation.",
    "steps": [
      "$x^8=x^{2k}$, $k=4$, sign $(-1)^4=+1$.",
      "Coefficient $=\\frac{1}{(4!)^2\\cdot2^8}=\\frac{1}{576\\cdot256}$.",
      "$576\\cdot256=147456$, so the answer is $\\frac{1}{147456}$."
    ],
    "trap": "Forgetting the $2^{2k}$ in $\\left(\\frac x2\\right)^{2k}$, or writing $(k!)^2$ as $(2k)!$, which gives $\\frac{1}{40320}$.",
    "check": "Using the integral representation $J_0(x)=\\frac1\\pi\\int_0^\\pi\\cos(x\\sin\\theta)d\\theta$: the $x^8$ coefficient $=\\frac{1}{8!\\,\\pi}\\int_0^\\pi\\sin^8\\theta\\,d\\theta$."
  },
  "hd-005": {
    "spot": "A higher derivative at $x=0$ $=$ Taylor coefficient $\\times n!$; $\\frac{1}{1+x^2}=1-x^2+x^4-\\cdots$ is a geometric series, so read the coefficient off directly.",
    "why": "Differentiating the quotient four times would explode; the geometric series gives the $x^4$ coefficient $1$ in one line.",
    "steps": [
      "$\\frac{1}{1+x^2}=\\sum(-x^2)^n=1-x^2+x^4-\\cdots$ ($|x|<1$); exactly: $\\frac{1}{1+x^2}-(1-x^2)=\\frac{x^4}{1+x^2}$.",
      "So the $x^4$ coefficient is $1$ (the value at $0$ of $\\frac{x^4}{1+x^2}$ divided by $x^4$).",
      "$f^{(4)}(0)=4!\\cdot1=24$."
    ],
    "trap": "Thinking $f^{(4)}(0)$ is just the coefficient $1$, forgetting to multiply by $4!$.",
    "check": "By the same reasoning, the second derivative should be $2!\\cdot(-1)=-2$."
  },
  "int-067": {
    "spot": "The shape $\\frac{f(ax)-f(bx)}{x}$ with $f(t)=e^{-t}$, $f(0)=1$, $f(\\infty)=0$: a Frullani integral.",
    "why": "Integrated separately, each term diverges; write $\\frac{e^{-2x}-e^{-8x}}{x}$ as $\\int_2^8e^{-tx}dt$ and swap the order of integration to get $\\ln\\frac82$ right away.",
    "steps": [
      "$\\frac{e^{-2x}-e^{-8x}}{x}=\\int_2^8e^{-tx}dt$.",
      "Swap the order: $\\int_2^8\\left(\\int_0^\\infty e^{-tx}dx\\right)dt=\\int_2^8\\frac{dt}{t}$.",
      "$\\int_2^8\\frac{dt}{t}=\\ln4$."
    ],
    "trap": "Writing $\\ln\\frac28=-\\ln4$; since $e^{-2x}>e^{-8x}$, the integrand is positive and the answer must be positive.",
    "check": "Frullani's formula: $(f(0)-f(\\infty))\\ln\\frac ba=(1-0)\\ln\\frac82$."
  },
  "int-073": {
    "spot": "Use product-to-sum on $\\sin x\\sin4x$ to get $\\frac{\\cos3x-\\cos5x}{2}$, and it becomes a Frullani integral of the form $\\frac{\\cos ax-\\cos bx}{x}$.",
    "why": "After product-to-sum it is a difference of two cosines over $x$, so apply $\\int_0^\\infty\\frac{\\cos ax-\\cos bx}{x}dx=\\ln\\frac ba$ directly.",
    "steps": [
      "$\\sin x\\sin4x=\\frac{\\cos3x-\\cos5x}{2}$.",
      "Frullani (with $f=\\cos$, $f(0)=1$, and $f$ averaging $0$ at infinity): $\\int_0^\\infty\\frac{\\cos3x-\\cos5x}{x}dx=\\ln\\frac53=\\int_3^5\\frac{dt}{t}$.",
      "Multiply by $\\frac12$: the answer is $\\frac12\\ln\\frac53$."
    ],
    "trap": "Writing the product-to-sum as $\\frac{\\cos5x-\\cos3x}{2}$ (sign flipped), which makes the answer the negative $\\frac12\\ln\\frac35$.",
    "check": "$\\frac12\\ln\\frac53\\approx0.255$ is positive: for small $x$ the integrand is $\\approx4x>0$, and the main contribution comes from the early part."
  },
  "lx-der-004": {
    "spot": "$\\frac{\\sec(\\frac{\\pi}{4}+h)-\\sec\\frac{\\pi}{4}}{h}$: $\\sqrt2=\\sec\\frac{\\pi}{4}$, so this is the limit definition of the derivative of $\\sec$ at $\\frac{\\pi}{4}$.",
    "why": "Recognizing the derivative definition means you never have to deal with $\\frac00$; just plug into $(\\sec x)'=\\sec x\\tan x$.",
    "steps": [
      "$\\sec\\frac{\\pi}{4}=\\sqrt2$, so the limit $=(\\sec)'\\left(\\frac{\\pi}{4}\\right)$.",
      "$(\\sec x)'=\\sec x\\tan x$.",
      "$\\sec\\frac{\\pi}{4}\\tan\\frac{\\pi}{4}=\\sqrt2\\cdot1=\\sqrt2$."
    ],
    "trap": "Remembering $(\\sec x)'$ as $\\sec^2x$ (mixing it up with $\\tan$) and getting $2$.",
    "check": "The difference quotient with $h=0.001$ is about $1.4163$, very close to $\\sqrt2$."
  },
  "lx-der-005": {
    "spot": "$\\frac{e^{2+h}-e^2}{h}$ is the limit definition of the derivative of $e^x$ at $x=2$.",
    "why": "The derivative of $e^x$ is itself, so just plug in $2$; or factor out $e^2$ to get $e^2\\cdot\\frac{e^h-1}{h}\\to e^2$.",
    "steps": [
      "Factor out $e^2$: $\\frac{e^{2+h}-e^2}{h}=e^2\\cdot\\frac{e^h-1}{h}$.",
      "$\\lim_{h\\to0}\\frac{e^h-1}{h}=1$.",
      "The answer is $e^2$."
    ],
    "trap": "Treating it as a Chain Rule for $e^x$ with exponent $2+h$ and multiplying by an extra $2$, getting $2e^2$.",
    "check": "Numerically $e^2\\approx7.389$, and the difference quotient approaches this number for small $h$."
  },
  "lx-hard-003": {
    "spot": "$\\ln(x+3)-\\ln x=\\ln\\left(1+\\frac3x\\right)$, and multiplying by $x$ gives $\\infty\\cdot0$: substitute $u=\\frac1x$ to get $\\frac{\\ln(1+3u)}{u}$.",
    "why": "After combining the logs, $\\ln(1+\\varepsilon)\\approx\\varepsilon$ shows $x\\cdot\\frac3x=3$ in one step.",
    "steps": [
      "$x(\\ln(x+3)-\\ln x)=x\\ln\\left(1+\\frac3x\\right)$.",
      "Let $u=\\frac1x\\to0^+$: $\\frac{\\ln(1+3u)}{u}\\to3$.",
      "The answer is $3$."
    ],
    "trap": "Seeing $\\ln(x+3)-\\ln x\\to0$ and saying the whole thing is $0$; the factor $x\\to\\infty$, so it is the indeterminate form $\\infty\\cdot0$.",
    "check": "Plug in $x=1000$: $1000\\ln1.003\\approx2.9955$, approaching $3$."
  },
  "putnam-003": {
    "spot": "A product of $n$ factors under an $n$-th root: after taking $\\ln$ it is $\\frac1n\\sum\\ln\\left(1+\\frac kn\\right)$, a Riemann sum.",
    "why": "Logs turn the product into a sum and the $\\frac1n$ power into an average; the Riemann sum converges to $\\int_0^1\\ln(1+x)dx$.",
    "steps": [
      "$\\ln P_n=\\frac1n\\sum_{k=1}^n\\ln\\left(1+\\frac kn\\right)\\to\\int_0^1\\ln(1+x)dx$.",
      "$\\int_0^1\\ln(1+x)dx=\\left[(1+x)\\ln(1+x)-x\\right]_0^1=2\\ln2-1$.",
      "$P_n\\to e^{2\\ln2-1}=\\frac4e$."
    ],
    "trap": "Computing the integral as $\\int_0^1\\ln x\\,dx$, or forgetting the $-x$ term and getting $e^{2\\ln2}=4$.",
    "check": "The answer $\\approx1.47$ lies within the range $(1,2]$ of each factor, which makes sense."
  },
  "rel-hard-cpx-010": {
    "spot": "Residue $=$ the coefficient of $z^{-1}$ in the Laurent expansion: after expanding, the numerator starts at $z^4$, and dividing by $z^5$ gives exactly $z^{-1}$.",
    "why": "$z=0$ looks like a pole of order five, but once $\\frac{z^2}{2}$ is subtracted the numerator starts at $z^4$, so it is actually a simple pole; reading off the coefficient is fastest.",
    "steps": [
      "$1-\\cos z=\\frac{z^2}{2}-\\frac{z^4}{24}+\\frac{z^6}{720}-\\cdots$.",
      "Numerator $=-\\frac{z^4}{24}+\\frac{z^6}{720}-\\cdots$; dividing by $z^5$: $-\\frac{1}{24z}+\\frac{z}{720}-\\cdots$.",
      "The $z^{-1}$ coefficient: residue $=-\\frac{1}{24}$."
    ],
    "trap": "Taking the leading term of the numerator $1-\\cos z-\\frac{z^2}{2}\\approx0$ to be $z^2$ (not noticing that $\\frac{z^2}{2}$ has been subtracted), and then applying the order-five pole formula — very error-prone.",
    "check": "For a simple pole, the residue $=\\lim_{z\\to0}z\\cdot f(z)$; numerically this is also $-\\frac{1}{24}\\approx-0.0417$."
  },
  "rel-hard-int-009": {
    "spot": "$\\frac{\\cos4x-\\cos10x}{x}$: the Frullani form $\\frac{f(ax)-f(bx)}{x}$ with $f=\\cos$.",
    "why": "Each term diverges separately; Frullani's formula gives $\\ln\\frac ba$ directly without touching the oscillatory integrals.",
    "steps": [
      "$\\frac{\\cos4x-\\cos10x}{x}=\\int_4^{10}\\sin(tx)\\,dt$.",
      "Swap the order and use the Abel value $\\frac1t$ of $\\int_0^\\infty\\sin(tx)dx$ (that is, $\\lim_{\\varepsilon\\to0}\\int_0^\\infty e^{-\\varepsilon x}\\sin(tx)dx$).",
      "$\\int_4^{10}\\frac{dt}{t}=\\ln\\frac{10}{4}=\\ln\\frac52$."
    ],
    "trap": "Writing $\\ln\\frac{4}{10}$; for small $x$, $\\cos4x>\\cos10x$, so the integrand starts out positive and the answer is positive.",
    "check": "The answer is about $0.916$, positive."
  },
  "world-016": {
    "spot": "A difference of two cosines over $x$, with frequencies $2$ and $3$: a Frullani integral, answer $\\ln\\frac{3}{2}$.",
    "why": "$\\int_0^\\infty\\frac{\\cos ax-\\cos bx}{x}dx=\\ln\\frac ba$ finishes it in one step; splitting it runs into two divergent integrals.",
    "steps": [
      "Write it as a parameter integral: $\\frac{\\cos2x-\\cos3x}{x}=\\int_2^3\\sin(tx)\\,dt$.",
      "Swap the order; the inner $\\int_0^\\infty\\sin(tx)dx$ takes its Abel value $\\frac1t$.",
      "$\\int_2^3\\frac{dt}{t}=\\ln\\frac32$."
    ],
    "trap": "Splitting it into $\\int\\frac{\\cos2x}{x}-\\int\\frac{\\cos3x}{x}$; each diverges at $0$, and you get nowhere.",
    "check": "$\\ln1.5\\approx0.405$, positive."
  },
  "world-017": {
    "spot": "$\\frac{1}{1+x^3}$: $1+x^3=(1+x)(x^2-x+1)$; partial fractions give a $\\ln$ piece and an $\\arctan$ piece, and the $\\ln$ parts cancel at $\\infty$.",
    "why": "Partial fractions are the most direct route; you can also memorize $\\int_0^\\infty\\frac{dx}{1+x^n}=\\frac{\\pi/n}{\\sin(\\pi/n)}$ to check the answer.",
    "steps": [
      "$\\frac{1}{1+x^3}=\\frac{1/3}{1+x}+\\frac{-\\frac13x+\\frac23}{x^2-x+1}$.",
      "Antiderivative $F=\\frac13\\ln(1+x)-\\frac16\\ln(x^2-x+1)+\\frac{1}{\\sqrt3}\\arctan\\frac{2x-1}{\\sqrt3}$.",
      "$x\\to\\infty$: the $\\ln$ part $\\frac16\\ln\\frac{(1+x)^2}{x^2-x+1}\\to0$ and $\\arctan\\to\\frac{\\pi}{2}$, giving $\\frac{\\pi}{2\\sqrt3}$; $x=0$: $\\frac{1}{\\sqrt3}\\arctan\\left(-\\frac{1}{\\sqrt3}\\right)=-\\frac{\\pi}{6\\sqrt3}$.",
      "Subtract: $\\frac{\\pi}{2\\sqrt3}+\\frac{\\pi}{6\\sqrt3}=\\frac{2\\pi}{3\\sqrt3}$."
    ],
    "trap": "Treating the lower-limit $\\arctan\\left(-\\frac{1}{\\sqrt3}\\right)$ as $0$, which gives only $\\frac{\\pi}{2\\sqrt3}$.",
    "check": "The general formula gives $\\frac{\\pi/3}{\\sin(\\pi/3)}=\\frac{2\\pi}{3\\sqrt3}\\approx1.209$."
  },
  "world-031": {
    "spot": "$\\frac{x}{\\sinh x}=\\frac{2xe^{-x}}{1-e^{-2x}}$: the denominator has a geometric-series shape, and after expanding, each term is $\\int_0^\\infty xe^{-(2k+1)x}dx=\\frac{1}{(2k+1)^2}$.",
    "why": "There is no elementary antiderivative; expand into a $\\sum$ and integrate term by term to get the sum of reciprocal odd squares, $\\frac{\\pi^2}{8}$.",
    "steps": [
      "$\\frac{1}{\\sinh x}=\\frac{2e^{-x}}{1-e^{-2x}}=2\\sum_{k\\ge0}e^{-(2k+1)x}$.",
      "Term by term: $\\int_0^\\infty xe^{-(2k+1)x}dx=\\frac{1}{(2k+1)^2}$ (e.g. $k=1$ gives $\\frac19$).",
      "The integral $=2\\sum_{k\\ge0}\\frac{1}{(2k+1)^2}=2\\cdot\\frac{\\pi^2}{8}$.",
      "The answer is $\\frac{\\pi^2}{4}$."
    ],
    "trap": "Forgetting the leading $2$ in the expansion of $\\frac{1}{\\sinh x}$ and getting $\\frac{\\pi^2}{8}$; or remembering the odd-square sum as $\\frac{\\pi^2}{6}$.",
    "check": "Since $\\sinh x<\\frac{e^x}{2}$, the integrand is everywhere larger than $2xe^{-x}$, so the answer must exceed $\\int_0^\\infty2xe^{-x}dx=2$; $\\frac{\\pi^2}{4}\\approx2.467$ fits."
  },
  "world-034": {
    "spot": "$\\sum\\frac{H_n}{n\\,2^n}$: start from the generating function $\\sum H_nx^n=\\frac{-\\ln(1-x)}{1-x}$; the $\\frac1n$ means divide by $x$ and integrate.",
    "why": "Turn the series into $\\int_0^{1/2}\\frac{-\\ln(1-t)}{t(1-t)}dt$; after partial fractions one piece is $\\frac12\\ln^22$ and the other is $\\mathrm{Li}_2\\left(\\frac12\\right)$, and at $\\frac12$ the two $\\ln^22$ terms cancel exactly.",
    "steps": [
      "$\\sum_{n\\ge1}\\frac{H_n}{n}x^n=\\int_0^x\\frac{1}{t}\\cdot\\frac{-\\ln(1-t)}{1-t}dt$.",
      "Partial fractions $\\frac{1}{t(1-t)}=\\frac1t+\\frac1{1-t}$: the second piece is $\\int_0^{1/2}\\frac{-\\ln(1-t)}{1-t}dt=\\frac12\\ln^22$.",
      "The first piece is $\\mathrm{Li}_2\\left(\\frac12\\right)=\\frac{\\pi^2}{12}-\\frac12\\ln^22$.",
      "Add: $\\frac{\\pi^2}{12}$."
    ],
    "trap": "Remembering $\\mathrm{Li}_2\\left(\\frac12\\right)$ as $\\frac{\\pi^2}{12}$ (missing the $-\\frac12\\ln^22$), then adding the second piece to get $\\frac{\\pi^2}{12}+\\frac12\\ln^22$.",
    "check": "The answer is $\\approx0.822$; the first two terms $\\frac12+\\frac{3}{16}=0.6875$ already make up most of it."
  }
};
