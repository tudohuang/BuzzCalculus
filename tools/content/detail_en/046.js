// Detail v2, English — batch 046. Translation of tools/content/detail/046.js (text only; claims live in the Chinese file).
module.exports = {
  "dm-seq-008": {
    "spot": "A product raised to the power $\\frac{1}{n}$ with factors $1+\\frac{k^2}{n^2}$: take logs and it becomes $\\frac{1}{n}\\sum\\ln\\left(1+\\left(\\frac{k}{n}\\right)^2\\right)$, exactly a Riemann sum of $\\ln(1+x^2)$ on $[0,1]$.",
    "why": "There is no ready-made limit tool for products. Logs turn the product into a sum and the power $\\frac{1}{n}$ into the Riemann-sum width; one integration by parts finishes it.",
    "steps": [
      "Let $P_n$ be the product. Then $\\ln P_n=\\frac{1}{n}\\sum_{k=1}^{n}\\ln\\left(1+\\frac{k^2}{n^2}\\right)\\to\\int_0^1\\ln(1+x^2)\\,dx$.",
      "Integration by parts ($u=\\ln(1+x^2)$, $dv=dx$): $\\int_0^1\\ln(1+x^2)\\,dx=\\Big[x\\ln(1+x^2)\\Big]_0^1-\\int_0^1\\frac{2x^2}{1+x^2}\\,dx=\\ln 2-\\int_0^1\\frac{2x^2}{1+x^2}\\,dx$.",
      "$\\frac{2x^2}{1+x^2}=2-\\frac{2}{1+x^2}$, which integrates to $2-2\\arctan 1=2-\\frac{\\pi}{2}$.",
      "So $\\ln P_n\\to\\ln 2-2+\\frac{\\pi}{2}$.",
      "Exponentiate: $\\lim P_n=e^{\\ln 2-2+\\pi/2}=2e^{\\pi/2-2}$."
    ],
    "trap": "Forgetting to exponentiate at the end and answering $\\ln 2-2+\\frac{\\pi}{2}\\approx 0.264$; or dropping the boundary term $\\Big[x\\ln(1+x^2)\\Big]_0^1=\\ln 2$ in the integration by parts.",
    "check": "Every factor $1+\\frac{k^2}{n^2}$ lies between $1$ and $2$, so the $n$-th root of the product should also be between $1$ and $2$; $2e^{\\pi/2-2}\\approx 1.302$ is reasonable."
  },
  "dm-ser-005": {
    "spot": "The denominator $4n^2-1=(2n-1)(2n+1)$, so the first power $\\frac{1}{4n^2-1}$ splits into a difference of two terms; squaring gives two sums of reciprocal odd squares plus a telescoping cross term.",
    "why": "Partial fractions of $\\frac{1}{(4n^2-1)^2}$ directly means solving for four coefficients. Split the first power, then square: each of the three pieces is a known series.",
    "steps": [
      "$\\frac{1}{4n^2-1}=\\frac{1}{2}\\left(\\frac{1}{2n-1}-\\frac{1}{2n+1}\\right)$. Squaring: $\\frac{1}{(4n^2-1)^2}=\\frac{1}{4}\\left(\\frac{1}{(2n-1)^2}+\\frac{1}{(2n+1)^2}-\\frac{2}{(2n-1)(2n+1)}\\right)$.",
      "Sum of reciprocal odd squares: $\\sum_{n\\ge1}\\frac{1}{(2n-1)^2}=\\zeta(2)-\\frac{1}{4}\\zeta(2)=\\frac{3}{4}\\cdot\\frac{\\pi^2}{6}=\\frac{\\pi^2}{8}$.",
      "$\\sum_{n\\ge1}\\frac{1}{(2n+1)^2}$ is the same list missing its first term $1$: $\\frac{\\pi^2}{8}-1$.",
      "The cross term telescopes: $\\sum\\frac{2}{(2n-1)(2n+1)}=\\sum\\left(\\frac{1}{2n-1}-\\frac{1}{2n+1}\\right)=1$.",
      "Combine: $\\frac{1}{4}\\left(\\frac{\\pi^2}{8}+\\frac{\\pi^2}{8}-1-1\\right)=\\frac{\\pi^2}{16}-\\frac{1}{2}$."
    ],
    "trap": "Writing $\\sum_{n\\ge1}\\frac{1}{(2n+1)^2}$ as $\\frac{\\pi^2}{8}$ too, forgetting it starts at $3$ and is missing the $1$; the answer comes out too big by $\\frac{1}{4}$.",
    "check": "The first term $\\frac{1}{9}\\approx 0.111$ is most of the total and the next one, $\\frac{1}{225}$, is tiny; $\\frac{\\pi^2}{16}-\\frac{1}{2}\\approx 0.1169$ is just a bit more than the first term. Consistent."
  },
  "fd-limx-601": {
    "spot": "$\\sin(\\tan x)$ and $\\tan(\\sin x)$ are the same two functions composed in opposite orders. Both start $x+\\cdots$, so the early terms keep cancelling; the $x^7$ in the denominator tells you the difference only shows up at the seventh power.",
    "why": "L'Hôpital's Rule would need seven derivatives, each a Chain Rule mess. Expanding both compositions to $x^7$ and subtracting is the safe route.",
    "steps": [
      "Have the two expansions ready: $\\tan x=x+\\frac{x^3}{3}+\\frac{2x^5}{15}+\\frac{17x^7}{315}+\\cdots$, $\\sin x=x-\\frac{x^3}{6}+\\frac{x^5}{120}-\\frac{x^7}{5040}+\\cdots$.",
      "Substitute $\\tan x$ into the expansion of $\\sin$ and collect up to $x^7$: $\\sin(\\tan x)=x+\\frac{x^3}{6}-\\frac{x^5}{40}-\\frac{55x^7}{1008}+\\cdots$.",
      "The other way, substitute $\\sin x$ into the expansion of $\\tan$: $\\tan(\\sin x)=x+\\frac{x^3}{6}-\\frac{x^5}{40}-\\frac{107x^7}{5040}+\\cdots$.",
      "Subtract: the $x$, $x^3$, $x^5$ terms all cancel, leaving $\\left(-\\frac{55}{1008}+\\frac{107}{5040}\\right)x^7=-\\frac{168}{5040}x^7=-\\frac{x^7}{30}$.",
      "Divide by $x^7$: the limit is $-\\frac{1}{30}$."
    ],
    "trap": "Expanding only to $x^5$, seeing a difference of $0$, and concluding the limit is $0$. The denominator is $x^7$; the early cancellation is the whole design, so you must go to $x^7$.",
    "check": "Plug in $x=0.05$: the ratio is about $-0.0334$, very close to $-\\frac{1}{30}\\approx -0.0333$."
  },
  "fd-limx-602": {
    "spot": "Both factors of the numerator $\\sin x\\arctan x$ start with $x+\\cdots$, so their product's $x^2$ is exactly what gets subtracted; the $x^4$ denominator says expand each to $x^3$.",
    "why": "Multiplying two cubic expansions and picking out the $x^4$ coefficient is far faster than differentiating four times with L'Hôpital's Rule.",
    "steps": [
      "$\\sin x=x-\\frac{x^3}{6}+\\cdots$, $\\arctan x=x-\\frac{x^3}{3}+\\cdots$.",
      "Multiply up to $x^4$: $x^2+\\left(-\\frac{1}{3}-\\frac{1}{6}\\right)x^4+\\cdots=x^2-\\frac{x^4}{2}+\\cdots$.",
      "Subtract $x^2$ and divide by $x^4$: the limit is $-\\frac{1}{2}$."
    ],
    "trap": "Counting only one cross term (say only $x\\cdot(-\\frac{x^3}{3})$) and getting $-\\frac{1}{3}$; when you multiply out, both cross terms count.",
    "check": "Plug in $x=0.1$: the ratio is about $-0.497$, close to $-\\frac{1}{2}$."
  },
  "fd-limx-610": {
    "spot": "The numerator composes $\\tan$ and $\\sin$ in opposite orders; the denominator does the same with their inverses $\\arctan$ and $\\arcsin$. Both sides cancel all the way up to $x^7$, so you are comparing two $x^7$ coefficients.",
    "why": "L'Hôpital's Rule goes nowhere here. Expand top and bottom to $x^7$ and look at the lowest nonzero term.",
    "steps": [
      "Numerator: from the previous problem, $\\tan(\\sin x)-\\sin(\\tan x)=\\frac{x^7}{30}+\\cdots$.",
      "Denominator expansions: $\\arcsin x=x+\\frac{x^3}{6}+\\frac{3x^5}{40}+\\cdots$, $\\arctan x=x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\cdots$; composing, $\\arctan(\\arcsin x)=x-\\frac{x^3}{6}+\\frac{13x^5}{120}-\\frac{173x^7}{5040}+\\cdots$.",
      "The other order: $\\arcsin(\\arctan x)=x-\\frac{x^3}{6}+\\frac{13x^5}{120}-\\frac{341x^7}{5040}+\\cdots$, with the same first three terms.",
      "Denominator $=\\left(-\\frac{173}{5040}+\\frac{341}{5040}\\right)x^7=\\frac{168}{5040}x^7=\\frac{x^7}{30}$.",
      "Top and bottom are both $\\frac{x^7}{30}+\\cdots$, so the ratio tends to $1$."
    ],
    "trap": "Expanding only to $x^3$ or $x^5$, getting $0$ on both top and bottom, and either giving up on a $\\frac{0}{0}$ or answering $0$; the difference only appears at $x^7$.",
    "check": "Both $x^7$ coefficients are $\\frac{168}{5040}$, the very same number, so the ratio is a clean $1$."
  },
  "fd-serc-601": {
    "spot": "The general term has $H_n$ and looks like $\\frac{x^n}{n}$: $\\sum H_nx^n=\\frac{-\\ln(1-x)}{1-x}$ is a known generating function; divide by $x$ and integrate to get $\\sum\\frac{H_n}{n}x^n$, then plug in $x=-1$.",
    "why": "$H_n$ has no closed form, so you cannot sum directly. As a power series, the sum becomes a $\\ln$-type integral whose two pieces are standard values.",
    "steps": [
      "$\\frac{1}{1-x}$ times $-\\ln(1-x)=\\sum\\frac{x^k}{k}$ accumulates the coefficients into $H_n$: $\\sum_{n\\ge1}H_nx^n=\\frac{-\\ln(1-x)}{1-x}$ (at $x=\\frac{1}{2}$ this gives $2\\ln 2$; check using $H_n=\\int_0^1\\frac{1-t^n}{1-t}dt$).",
      "Divide by $x$ and integrate from $0$ to $x$: $\\sum\\frac{H_n}{n}x^n=\\int_0^x\\frac{-\\ln(1-t)}{t(1-t)}\\,dt$.",
      "Plug in $x=-1$ (the alternating series converges, so Abel's theorem allows the endpoint), then let $t=-s$: the sum $=-\\sum\\frac{H_n}{n}(-1)^n=\\int_0^1\\frac{\\ln(1+s)}{s(1+s)}\\,ds$.",
      "Split $\\frac{1}{s(1+s)}=\\frac{1}{s}-\\frac{1}{1+s}$: $\\int_0^1\\frac{\\ln(1+s)}{s}ds=\\frac{\\pi^2}{12}$ and $\\int_0^1\\frac{\\ln(1+s)}{1+s}ds=\\frac{\\ln^2 2}{2}$.",
      "Subtract: $\\frac{\\pi^2}{12}-\\frac{\\ln^2 2}{2}$."
    ],
    "trap": "Remembering $\\sum H_nx^n$ as $-\\ln(1-x)$ (missing the $1-x$ in the denominator). That is the generating function of $\\sum\\frac{x^n}{n}$, not of the harmonic numbers.",
    "check": "Summing the series directly with the integral formula for $H_n$ also gives $\\frac{\\pi^2}{12}-\\frac{\\ln^2 2}{2}\\approx 0.582$."
  },
  "fd-serc-602": {
    "spot": "$\\frac{H_n}{n+1}x^{n+1}$ is exactly $H_nx^n$ integrated once, and the $2^n$ hints at plugging in $x=\\frac{1}{2}$ at the end: start from $\\sum H_nx^n=\\frac{-\\ln(1-x)}{1-x}$ and integrate.",
    "why": "The $n+1$ in the denominator is precisely the factor integration produces, so one integration matches it; and the antiderivative of $\\frac{-\\ln(1-x)}{1-x}$ is a clean $\\frac{1}{2}\\ln^2(1-x)$.",
    "steps": [
      "Generating function: $\\sum_{n\\ge1}H_nx^n=\\frac{-\\ln(1-x)}{1-x}$ ($\\frac{1}{1-x}$ times $\\sum\\frac{x^k}{k}$ accumulates the coefficients into $H_n$).",
      "Integrate from $0$ to $x$: $\\sum\\frac{H_n}{n+1}x^{n+1}=\\int_0^x\\frac{-\\ln(1-t)}{1-t}dt=\\frac{1}{2}\\ln^2(1-x)$.",
      "The sum $=\\sum\\frac{H_n}{(n+1)2^n}=2\\sum\\frac{H_n}{n+1}\\left(\\frac{1}{2}\\right)^{n+1}$; plug in $x=\\frac{1}{2}$.",
      "$2\\cdot\\frac{1}{2}\\ln^2\\frac{1}{2}=\\ln^2 2$."
    ],
    "trap": "Forgetting the extra factor $2$ when plugging in $x=\\frac{1}{2}$: the series has $\\frac{1}{2^n}$ but the integral gives $\\left(\\frac{1}{2}\\right)^{n+1}$, a factor of two apart, so you would answer $\\frac{\\ln^2 2}{2}$.",
    "check": "Summing the series directly with the integral formula for $H_n$ gives $\\ln^2 2\\approx 0.480$."
  },
  "fd-serc-603": {
    "spot": "$\\frac{\\sin n}{n}$ is $\\sum\\frac{\\sin n\\theta}{n}$ at $\\theta=1$ — the Fourier series of $\\frac{\\pi-\\theta}{2}$, or the imaginary part of $-\\ln(1-e^{i\\theta})$.",
    "why": "The series converges only conditionally and adding terms one by one is slow. Get a closed form from the fast-converging version $\\sum\\frac{r^n\\sin n}{n}$, then let $r\\to1$.",
    "steps": [
      "For $0<r<1$: $\\sum\\frac{r^n\\sin n}{n}$ is the imaginary part of $-\\ln(1-re^{i})$, which equals $\\arctan\\frac{r\\sin 1}{1-r\\cos 1}$ (check with $r=0.9$).",
      "$r\\to1^-$ (Dirichlet's test guarantees the original series converges, and Abel's theorem connects the limit): $\\arctan\\frac{\\sin 1}{1-\\cos 1}$.",
      "Half-angle: $\\frac{\\sin 1}{1-\\cos 1}=\\cot\\frac{1}{2}=\\tan\\left(\\frac{\\pi}{2}-\\frac{1}{2}\\right)$, so the angle is $\\frac{\\pi-1}{2}$.",
      "So $\\sum\\frac{\\sin n}{n}=\\frac{\\pi-1}{2}$."
    ],
    "trap": "Thinking that $|\\sin n|\\le1$ means comparing with $\\sum\\frac{1}{n}$ shows divergence, or forcing a comparison with $\\sin n\\approx n$. The series converges conditionally; the Comparison Test does not apply.",
    "check": "The formula $\\frac{\\pi-\\theta}{2}$ gives $\\frac{\\pi}{2}$ as $\\theta\\to0^+$ and $0$ at $\\theta=\\pi$ (where every term $\\sin n\\pi=0$). Both ends check out."
  },
  "fd-serc-604": {
    "spot": "$\\cos n$ paired with $\\frac{1}{2^n}$: view $\\cos n$ as the real part of $e^{in}$, and the whole thing is a geometric series with ratio $z=\\frac{e^{i}}{2}$.",
    "why": "A geometric series has a one-line formula, and taking the real part just means rationalizing the denominator. Much easier than forcing a recursion with product-to-sum identities.",
    "steps": [
      "$\\sum_{n\\ge1}\\frac{\\cos n}{2^n}=\\operatorname{Re}\\sum z^n=\\operatorname{Re}\\frac{z}{1-z}$, with $z=\\frac{\\cos1+i\\sin1}{2}$; $|z|=\\frac{1}{2}<1$, so it converges.",
      "$\\frac{z}{1-z}=\\frac{e^{i}}{2-e^{i}}$; multiply top and bottom by $2-e^{-i}$. The denominator is $|2-e^{i}|^2=4-4\\cos1+1=5-4\\cos1$.",
      "Numerator $e^{i}(2-e^{-i})=2e^{i}-1$, with real part $2\\cos1-1$.",
      "So the sum is $\\frac{2\\cos1-1}{5-4\\cos1}$."
    ],
    "trap": "Writing the denominator as $(1-\\cos1)^2+\\sin^2 1$, forgetting the $\\frac{1}{2}$ in the ratio. Write $z$ as $\\frac{e^i}{2}$ before rationalizing and you won't drop it.",
    "check": "The answer is only $\\approx0.028$: $\\cos2$, $\\cos3$, $\\cos4$ are all negative, so the first four terms $0.270-0.104-0.124-0.041\\approx0.0015$ nearly cancel, and the later positive terms add a little."
  },
  "fd-serx-603": {
    "spot": "The denominator $n(n+1)$ splits into $\\frac{1}{n}-\\frac{1}{n+1}$; with the $3^n$ this is the power series $\\sum\\frac{x^n}{n}$ and $\\sum\\frac{x^n}{n+1}$ at $x=\\frac{1}{3}$.",
    "why": "Both pieces can be written with $-\\ln(1-x)$, which is cleaner than estimating partial sums.",
    "steps": [
      "$\\frac{1}{n(n+1)}=\\frac{1}{n}-\\frac{1}{n+1}$, so the sum $=\\sum\\frac{x^n}{n}-\\sum\\frac{x^n}{n+1}$ with $x=\\frac{1}{3}$.",
      "$\\sum_{n\\ge1}\\frac{x^n}{n}=-\\ln(1-x)=\\ln\\frac{3}{2}$.",
      "$\\sum_{n\\ge1}\\frac{x^n}{n+1}=\\frac{1}{x}\\left(-\\ln(1-x)-x\\right)=3\\left(\\ln\\frac{3}{2}-\\frac{1}{3}\\right)=3\\ln\\frac{3}{2}-1$.",
      "Subtract: $\\ln\\frac{3}{2}-3\\ln\\frac{3}{2}+1=1-2\\ln\\frac{3}{2}$."
    ],
    "trap": "$\\sum\\frac{x^n}{n+1}$ starts at $n=1$; after reindexing it is $\\frac{1}{x}\\sum_{m\\ge2}\\frac{x^m}{m}$, so you must subtract the $m=1$ term $x$. Skip that and you get $-2\\ln\\frac{3}{2}$, a negative number.",
    "check": "The first term is $\\frac{1}{6}\\approx0.167$ and the answer $1-2\\ln1.5\\approx0.189$ is only slightly more. Reasonable."
  },
  "lec-19-q4a": {
    "spot": "$u=x+y$, $v=x-y$ is a linear map, and linear maps send vertices to vertices and edges to edges — plug in the four vertices and you know the shape of the image.",
    "why": "A linear map sends lines to lines, so the four vertices determine the image. No need to solve inequalities edge by edge.",
    "steps": [
      "$(0,0)\\mapsto(0,0)$, $(1,1)\\mapsto(2,0)$.",
      "$(2,0)\\mapsto(2,2)$, $(1,-1)\\mapsto(0,2)$.",
      "In the $uv$-plane the four sides are $v=0$, $u=2$, $v=2$, $u=0$, enclosing a square; the original edge $y=x$ goes to $v=0$, $x+y=2$ goes to $u=2$, and so on.",
      "So the image is $S=[0,2]\\times[0,2]$, i.e. $0\\le u\\le2$, $0\\le v\\le2$."
    ],
    "trap": "Seeing $x$ from $0$ to $2$ and $y$ from $-1$ to $1$ in the original region and writing the image as $[-2,2]\\times[-2,2]$. Plug in vertices, not ranges.",
    "check": "Areas match: $R$ is a square of side $\\sqrt2$, area $2$; the map's area factor is $\\left|\\det\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}\\right|=2$, and the image has area $4=2\\times2$."
  },
  "lm-pr-004": {
    "spot": "$n^2+n=n(n+1)$ and $n^2+n-2=(n-1)(n+2)$: top and bottom both factor into products of nearby integers, which cancel all along the product — a telescoping product.",
    "why": "Taking logs and estimating a series works but is a detour; after factoring, the partial product has a closed form.",
    "steps": [
      "Factor: $\\frac{n^2+n}{n^2+n-2}=\\frac{n}{n-1}\\cdot\\frac{n+1}{n+2}$.",
      "$\\prod_{n=2}^{N}\\frac{n}{n-1}=N$ (telescoping) and $\\prod_{n=2}^{N}\\frac{n+1}{n+2}=\\frac{3}{N+2}$. The partial product is $P_N=\\frac{3N}{N+2}$; e.g. $N=4$: $\\frac{6}{4}\\cdot\\frac{12}{10}\\cdot\\frac{20}{18}=2=\\frac{3\\cdot4}{6}$.",
      "As $N\\to\\infty$: $\\frac{3N}{N+2}\\to3$."
    ],
    "trap": "Telescoping only half (say only the $\\frac{n}{n-1}$ chain) and concluding the product diverges to infinity; the other chain $\\frac{n+1}{n+2}$ pulls it back.",
    "check": "Summing the logs should also give $\\ln3$."
  },
  "refine-limits-073": {
    "spot": "Write $\\sqrt[n]{1+x^n}-1$ as $e^{\\ln(1+x^n)/n}-1\\approx\\frac{\\ln(1+x^n)}{n}$, which already uses up one $\\frac{1}{n}$; the remaining $\\int_0^1\\ln(1+x^n)dx$ squeezes out another $\\frac{1}{n}$ via $t=x^n$.",
    "why": "The integrand differs from $1$ only when $x$ is near $1$. Substituting $t=x^n$ stretches that small stretch out into the fixed integral $\\int_0^1\\frac{\\ln(1+t)}{t}dt$.",
    "steps": [
      "$\\sqrt[n]{1+x^n}-1=e^{u}-1$ with $u=\\frac{\\ln(1+x^n)}{n}\\le\\frac{\\ln2}{n}$; $e^u-1=u+O(u^2)$, and the squared term integrates to $O\\left(\\frac{1}{n^3}\\right)$, which vanishes after multiplying by $n^2$.",
      "So we only need $n^2\\cdot\\frac{1}{n}\\int_0^1\\ln(1+x^n)\\,dx$. Let $t=x^n$: $\\int_0^1\\ln(1+x^n)dx=\\frac{1}{n}\\int_0^1\\ln(1+t)\\,t^{1/n-1}dt$ (check with $n=7$).",
      "$t^{1/n}\\to1$, so the integral tends to $\\int_0^1\\frac{\\ln(1+t)}{t}dt=\\sum\\frac{(-1)^{k+1}}{k^2}=\\frac{\\pi^2}{12}$.",
      "The two factors of $\\frac{1}{n}$ exactly cancel the $n^2$: the limit $=\\frac{\\pi^2}{12}$."
    ],
    "trap": "Seeing only $\\sqrt[n]{1+x^n}\\to1$ and saying the integral minus $1$ is of size $\\frac{1}{n}$, so times $n^2$ it diverges. In fact the integrand departs noticeably from $1$ only within a width $\\frac{1}{n}$ where $x$ is near $1$, so the total is of size $\\frac{1}{n^2}$.",
    "check": "Numerical integration at $n=200$: $n^2(\\cdots)\\approx0.81$, heading toward $\\frac{\\pi^2}{12}\\approx0.822$."
  },
  "refine-limits-074": {
    "spot": "$\\sqrt[n]{k}=e^{\\ln k/n}$ is close to $1$ for all $k\\le n$, with average $1+\\frac{\\ln n!}{n^2}+\\cdots$; then the whole thing is raised to the $n$ — a classic $(1+\\frac{a_n}{n})^n$, and you need $\\ln n!\\approx n\\ln n-n$ to pin down $a_n$.",
    "why": "A $1^\\infty$ form depends on the exact size of $n\\cdot(\\text{average}-1)$. A first-order expansion plus Stirling's formula is exactly enough; the errors are of size $\\frac{\\ln^2 n}{n}$ and vanish.",
    "steps": [
      "$\\sqrt[n]{k}=1+\\frac{\\ln k}{n}+O\\left(\\frac{\\ln^2 n}{n^2}\\right)$, so the average is $\\frac{1}{n}\\sum\\sqrt[n]{k}=1+\\frac{\\ln n!}{n^2}+O\\left(\\frac{\\ln^2 n}{n^2}\\right)$.",
      "Stirling: $n!\\approx\\sqrt{2\\pi n}\\,n^ne^{-n}$, so $\\ln n!=n\\ln n-n+O(\\ln n)$ and the average $=1+\\frac{\\ln n-1}{n}+O\\left(\\frac{\\ln^2 n}{n^2}\\right)$.",
      "Log of the $n$-th power: $n\\ln(\\text{average})=\\ln n-1+O\\left(\\frac{\\ln^2 n}{n}\\right)$, and the error tends to $0$.",
      "So $\\frac{1}{n}(\\text{average})^n=e^{n\\ln(\\text{average})-\\ln n}\\to e^{-1}$."
    ],
    "trap": "Seeing the average $\\to1$ and saying $(\\text{average})^n\\to1$, so the answer is $0$. A $1^\\infty$ form doesn't work that way: the extra $\\frac{\\ln n-1}{n}$ above $1$ makes the $n$-th power grow like $\\frac{n}{e}$.",
    "check": "Another approximation: replace the sum with $\\int_0^n x^{1/n}dx=\\frac{n^{1+1/n}}{1+1/n}$; the whole expression becomes $\\left(\\frac{n}{n+1}\\right)^n$, which also tends to $e^{-1}$."
  },
  "refine-limits-075": {
    "spot": "$\\left(1+\\frac{1}{k}\\right)^k=\\frac{(k+1)^k}{k^k}$, so in the product most of the top and bottom cancel, leaving $\\frac{(n+1)^n}{n!}$; an $n!$ together with $\\sqrt n$ and $e^n$ smells like Stirling's formula.",
    "why": "First telescope down to an expression in $n!$, then Stirling's formula handles $e^n$, $n^n$ and $\\sqrt n$ in one go.",
    "steps": [
      "$\\prod_{k=1}^n\\left(1+\\frac{1}{k}\\right)^k=\\frac{2^1\\cdot3^2\\cdots(n+1)^n}{1^1\\cdot2^2\\cdots n^n}=\\frac{(n+1)^n}{n!}$; e.g. $n=3$: $2\\cdot\\frac{9}{4}\\cdot\\frac{64}{27}=\\frac{4^3}{3!}$.",
      "So the expression $=\\frac{e^n\\,n!}{(n+1)^n\\sqrt n}$.",
      "Stirling: $n!\\sim\\sqrt{2\\pi n}\\,n^ne^{-n}$; substituting gives $\\sqrt{2\\pi}\\left(\\frac{n}{n+1}\\right)^n$.",
      "$\\left(\\frac{n}{n+1}\\right)^n\\to e^{-1}$, so the limit $=\\frac{\\sqrt{2\\pi}}{e}$."
    ],
    "trap": "Thinking $\\left(1+\\frac{1}{k}\\right)^k\\to e$ makes each factor $\\to1$ and the product bounded, so the answer is $0$. Actually $\\frac{e}{(1+1/k)^k}\\approx1+\\frac{1}{2k}$, and the product grows like $\\sqrt n$, which is why we divide by $\\sqrt n$.",
    "check": "At $n=30$ the expression is about $0.940$, slightly above the limit $\\frac{\\sqrt{2\\pi}}{e}\\approx0.922$ and still coming down."
  },
  "refine-limits-076": {
    "spot": "The exponent $(-1)^{k+1}$ makes the factors alternately multiply and divide: $\\frac{2}{1}\\cdot\\frac{2}{3}\\cdot\\frac{4}{3}\\cdot\\frac{4}{5}\\cdots$ — grouped in pairs, this is the Wallis product.",
    "why": "After pairing, each group is $\\frac{4m^2}{4m^2-1}$ and the Wallis formula gives the value directly; no need to estimate an alternating series.",
    "steps": [
      "Pair term $2m-1$ with term $2m$: $\\left(1+\\frac{1}{2m-1}\\right)\\left(1+\\frac{1}{2m}\\right)^{-1}=\\frac{2m}{2m-1}\\cdot\\frac{2m}{2m+1}=\\frac{4m^2}{4m^2-1}$.",
      "Wallis: $\\prod_{m\\ge1}\\frac{4m^2}{4m^2-1}=\\frac{\\pi}{2}$ (check via logs).",
      "A partial product with an odd number of factors has just one extra $1+\\frac{1}{2m+1}\\to1$, so the limit is the same; the log of the original product is the alternating series $\\sum(-1)^{k+1}\\ln\\left(1+\\frac{1}{k}\\right)$.",
      "So the product $=\\frac{\\pi}{2}$."
    ],
    "trap": "Multiplying by the second factor in each pair too (ignoring the exponent $-1$), which gives the divergent $\\prod\\frac{2m+1}{2m-1}$. The alternating exponent is the whole point.",
    "check": "The first four factors give $2\\cdot\\frac{2}{3}\\cdot\\frac{4}{3}\\cdot\\frac{4}{5}=\\frac{128}{90}\\approx1.42$, already near $\\frac{\\pi}{2}\\approx1.571$ and climbing from below."
  },
  "refine-limits-077": {
    "spot": "A whole row of binomial coefficients multiplied together and then taking the $n^2$-th root: rewrite the product as $\\prod k^{2k-n-1}$, and its log divided by $n^2$ is a Riemann sum of $(2x-1)\\ln x$.",
    "why": "Applying Stirling to each $\\binom{n}{k}$ is messy. Written as powers of $k$, the $\\ln n$ part cancels completely and only one integral remains.",
    "steps": [
      "Each $k$ appears $n+1$ times in the numerators $n!$ and $2(n-k+1)$ times in total in the denominators $k!$ and $(n-k)!$, so $\\prod_{k=0}^n\\binom{n}{k}=\\prod_{k=1}^n k^{2k-n-1}$; e.g. $n=4$: $1\\cdot4\\cdot6\\cdot4\\cdot1=2^{-1}\\cdot3\\cdot4^3$.",
      "Take logs and divide by $n^2$: $\\frac{1}{n^2}\\sum(2k-n-1)\\ln k$. Since $\\sum_{k=1}^n(2k-n-1)=0$, you can replace $\\ln k$ with $\\ln\\frac{k}{n}$ without changing the value.",
      "So it $=\\frac{1}{n}\\sum\\left(\\frac{2k}{n}-1-\\frac{1}{n}\\right)\\ln\\frac{k}{n}\\to\\int_0^1(2x-1)\\ln x\\,dx$.",
      "Integration by parts: $\\Big[(x^2-x)\\ln x\\Big]_0^1-\\int_0^1(x-1)dx=0+\\frac{1}{2}=\\frac{1}{2}$.",
      "So the expression $\\to e^{1/2}=\\sqrt e$."
    ],
    "trap": "Missing that $\\sum(2k-n-1)=0$ and estimating $\\ln k$ by $\\ln n$, which creates a fake divergent term of size $\\ln n$; or stopping at $\\frac{1}{2}$ and forgetting to exponentiate.",
    "check": "The largest middle coefficient is about $\\frac{2^n}{\\sqrt n}$, so roughly $\\ln\\prod\\binom{n}{k}$ is of size $n^2$ (each $\\ln\\binom{n}{k}\\le n\\ln2$); the $n^2$-th root lands between $1$ and $2$, and $\\sqrt e\\approx1.65$ is reasonable."
  },
  "refine-limits-078": {
    "spot": "$\\left(1-\\frac{x}{n}\\right)^n$ tends to $e^{-x}$, so the integral tends to $\\int_0^\\infty e^{-x/2}dx=2$. Multiplying by $n$ asks for the next-order correction, so expand $\\left(1-\\frac{x}{n}\\right)^n$ to the $\\frac{1}{n}$ term.",
    "why": "Expanding $\\ln\\left(1-\\frac{x}{n}\\right)^n=-x-\\frac{x^2}{2n}+\\cdots$ gives the correction term right away, and the correction times $e^{-x/2}$ integrates as a gamma integral in one line.",
    "steps": [
      "$\\left(1-\\frac{x}{n}\\right)^n=e^{n\\ln(1-x/n)}=e^{-x-\\frac{x^2}{2n}-\\cdots}=e^{-x}\\left(1-\\frac{x^2}{2n}+O\\left(\\frac{1}{n^2}\\right)\\right)$.",
      "Multiply by $e^{x/2}$ and integrate: the main term is $\\int_0^\\infty e^{-x/2}dx=2$.",
      "Correction term: $-\\frac{1}{2n}\\int_0^\\infty x^2e^{-x/2}dx=-\\frac{1}{2n}\\cdot16=-\\frac{8}{n}$.",
      "So the integral $=2-\\frac{8}{n}+O\\left(\\frac{1}{n^2}\\right)$, and after multiplying by $n$ the limit is $-8$."
    ],
    "trap": "Using only $\\left(1-\\frac{x}{n}\\right)^n\\approx e^{-x}$ and thinking the integral minus $2$ is $0$, or looking only at the cut-off tail $\\int_n^\\infty$ (exponentially small, nowhere near $\\frac{1}{n}$). The real $\\frac{1}{n}$ comes from $-\\frac{x^2}{2n}$.",
    "check": "Integrating directly at $n=400$: $n(\\cdots)\\approx-7.84$, above $-8$ and approaching from above."
  },
  "refine-limits-079": {
    "spot": "$\\sum_{k=1}^n\\frac{1}{n+k}=H_{2n}-H_n$ is a Riemann sum for $\\ln2$; the problem already subtracts $\\ln2$ and $-\\frac{1}{4n}$, so multiplying by $n^2$ asks for the $\\frac{1}{n^2}$ term — use the asymptotic expansion of harmonic numbers to the third term.",
    "why": "Riemann-sum error estimates only see order $\\frac{1}{n}$; $H_m=\\ln m+\\gamma+\\frac{1}{2m}-\\frac{1}{12m^2}+\\cdots$ goes straight to $\\frac{1}{m^2}$, then just subtract.",
    "steps": [
      "$\\sum_{k=1}^n\\frac{1}{n+k}=H_{2n}-H_n$.",
      "Harmonic expansion: $H_m=\\ln m+\\gamma+\\frac{1}{2m}-\\frac{1}{12m^2}+O\\left(\\frac{1}{m^4}\\right)$ (at $m=50$, $m^2$ times the error is about $-\\frac{1}{12}$).",
      "Subtract; $\\gamma$ cancels: $H_{2n}-H_n=\\ln2+\\frac{1}{4n}-\\frac{1}{2n}-\\frac{1}{48n^2}+\\frac{1}{12n^2}=\\ln2-\\frac{1}{4n}+\\frac{1}{16n^2}+\\cdots$.",
      "What remains in the parentheses is $\\frac{1}{16n^2}+O\\left(\\frac{1}{n^4}\\right)$; times $n^2$ gives $\\frac{1}{16}$."
    ],
    "trap": "The correction term for $H_{2n}$ needs $m=2n$: $\\frac{1}{12(2n)^2}=\\frac{1}{48n^2}$, not $\\frac{1}{12n^2}$. Get it wrong and you get $0$.",
    "check": "Compute directly at $n=30$: $n^2(\\cdots)\\approx0.0625$, which is $\\frac{1}{16}$."
  },
  "refine-limits-080": {
    "spot": "$\\binom{n}{k}^{-1}$ is large only at the ends: $k=0,n$ give $2$, and $k=1,n-1$ give $\\frac{1}{n}$ each; the middle coefficients are so big their reciprocals are nearly $0$. Subtracting $2$ and multiplying by $n$ asks about exactly the $k=1,n-1$ terms.",
    "why": "No summation formula needed: bound each part separately — compute the ends exactly and squash the middle with the smallest reciprocal as an upper bound.",
    "steps": [
      "$k=0$ and $k=n$: $1+1=2$, exactly cancelled by the $-2$ in the problem.",
      "$k=1$ and $k=n-1$: $\\frac{1}{n}$ each, $\\frac{2}{n}$ together; times $n$ that is $2$.",
      "$k=2$ and $k=n-2$: together $\\frac{4}{n(n-1)}$, which tends to $0$ after multiplying by $n$.",
      "$3\\le k\\le n-3$: each term is $\\le\\binom{n}{3}^{-1}=\\frac{6}{n(n-1)(n-2)}$, with $n-5$ terms; times $n$ this also tends to $0$.",
      "So $n\\left(\\sum\\binom{n}{k}^{-1}-2\\right)\\to2$."
    ],
    "trap": "Bounding all $n-3$ middle terms by $\\binom{n}{2}^{-1}$: after multiplying by $n$ the bound is still $2$, not $0$. Pull out the two $k=2$ terms separately and bound the rest with $\\binom{n}{3}^{-1}$.",
    "check": "Writing the sum as an integral via $\\binom{n}{k}^{-1}=(n+1)\\int_0^1t^k(1-t)^{n-k}dt$, at $n=50$ you get $n(\\cdots)$ about $2.08$, approaching $2$ from above."
  },
  "td-int-005": {
    "spot": "$3x^2+2xy+2y^2\\le1$ is a quadratic form $\\le1$: the $xy$ cross term means the ellipse is tilted, and the area depends only on the determinant of the matrix $\\begin{pmatrix}3&1\\\\1&2\\end{pmatrix}$.",
    "why": "After a rotation removes the cross term, you have $\\lambda_1u^2+\\lambda_2v^2\\le1$ with area $\\frac{\\pi}{\\sqrt{\\lambda_1\\lambda_2}}=\\frac{\\pi}{\\sqrt{\\det}}$; no need to actually find the rotation angle.",
    "steps": [
      "Symmetric matrix $A=\\begin{pmatrix}3&1\\\\1&2\\end{pmatrix}$, $\\det A=6-1=5>0$; both eigenvalues are positive, so it is an ellipse.",
      "Eigenvalues $\\lambda=\\frac{5\\pm\\sqrt5}{2}$, whose product is $\\det A=5$.",
      "Rotation preserves area: $\\lambda_1u^2+\\lambda_2v^2\\le1$ has semi-axes $\\frac{1}{\\sqrt{\\lambda_1}}$ and $\\frac{1}{\\sqrt{\\lambda_2}}$, so the area is $\\frac{\\pi}{\\sqrt{\\lambda_1\\lambda_2}}$.",
      "So the area $=\\frac{\\pi}{\\sqrt5}$."
    ],
    "trap": "Putting the full cross-term coefficient $2$ off the diagonal, writing $\\begin{pmatrix}3&2\\\\2&2\\end{pmatrix}$, which gives determinant $2$ and the answer $\\frac{\\pi}{\\sqrt2}$. The $2xy$ is split between the two off-diagonal entries, $1$ each.",
    "check": "Slice directly: for fixed $x$ solve the quadratic inequality in $y$; the chord length is $\\frac{\\sqrt{8-20x^2}}{2}$ for $x^2\\le\\frac{2}{5}$, and integrating also gives $\\frac{\\pi}{\\sqrt5}$."
  },
  "der-003": {
    "spot": "$e^x$ times $\\ln x$, both basic functions you can differentiate — Product Rule.",
    "why": "There is no shortcut for a product; the Product Rule does it in one line.",
    "steps": [
      "$(e^x)'=e^x$, $(\\ln x)'=\\frac{1}{x}$.",
      "Product Rule: $(fg)'=f'g+fg'=e^x\\ln x+e^x\\cdot\\frac{1}{x}$.",
      "Answer: $e^x\\ln x+\\frac{e^x}{x}$."
    ],
    "trap": "Writing the derivative of a product as the product of derivatives, $e^x\\cdot\\frac{1}{x}$, and missing the $e^x\\ln x$ term.",
    "check": "At $x=1$: $\\ln1=0$, so the derivative should be $e$."
  },
  "der-005": {
    "spot": "$\\ln$ wraps $1+x^2$, a composition — outer $\\ln u$, inner $u=1+x^2$: Chain Rule.",
    "why": "The outer layer gives $\\frac{1}{u}$, multiply by the inner derivative $2x$, done in one line.",
    "steps": [
      "Outer: $(\\ln u)'=\\frac{1}{u}=\\frac{1}{1+x^2}$.",
      "Inner: $(1+x^2)'=2x$.",
      "Multiply: $\\frac{2x}{1+x^2}$."
    ],
    "trap": "Differentiating only the outer layer and forgetting the inner derivative, answering $\\frac{1}{1+x^2}$.",
    "check": "$\\ln(1+x^2)$ is even, so its derivative should be odd and equal $0$ at $x=0$."
  },
  "der-007": {
    "spot": "$\\arctan x$ is the inverse of $\\tan$; memorize the formula, and if you forget, rederive it from $y=\\arctan x\\Rightarrow\\tan y=x$ with implicit differentiation.",
    "why": "Implicit differentiation takes two lines and also settles the easily-confused denominator.",
    "steps": [
      "Let $y=\\arctan x$, so $\\tan y=x$. Differentiate both sides with respect to $x$: $\\sec^2y\\cdot y'=1$.",
      "$\\sec^2y=1+\\tan^2y=1+x^2$.",
      "So $y'=\\frac{1}{1+x^2}$."
    ],
    "trap": "Mixing it up with $\\arcsin x$'s $\\frac{1}{\\sqrt{1-x^2}}$, writing $\\frac{1}{1-x^2}$ or adding a square root.",
    "check": "The tangent slope of $\\arctan$ at $0$ is $1$, and it is always increasing, so the derivative is always positive."
  },
  "lec-01-m2": {
    "spot": "Inside $\\sin$ is $3x$ but the denominator is only $x$: build the standard form $\\frac{\\sin 3x}{3x}$ and put a $3$ outside.",
    "why": "$\\lim_{u\\to0}\\frac{\\sin u}{u}=1$ only applies when the inside of $\\sin$ matches the denominator; match them first, then use it.",
    "steps": [
      "$\\frac{\\sin3x}{x}=3\\cdot\\frac{\\sin3x}{3x}$.",
      "Let $u=3x\\to0$: $\\frac{\\sin u}{u}\\to1$.",
      "So the limit is $3$."
    ],
    "trap": "Applying $\\frac{\\sin x}{x}\\to1$ directly and answering $1$, or putting the $3$ in the denominator and answering $\\frac{1}{3}$.",
    "check": "Plug in $x=0.01$: $\\frac{\\sin0.03}{0.01}\\approx2.9996$."
  },
  "lec-02-q2a": {
    "spot": "A product of two polynomials where, once multiplied out, a pair of terms cancels; expanding first is faster than the Product Rule.",
    "why": "After expanding only two terms are left, and term-by-term differentiation can't go wrong; the Product Rule works too but needs an extra simplification.",
    "steps": [
      "Expand: $(x^2+1)(x^3-x)=x^5-x^3+x^3-x=x^5-x$.",
      "Differentiate term by term: $5x^4-1$.",
      "So $y'=5x^4-1$."
    ],
    "trap": "Writing the derivative of the product as the product of the derivatives: $2x(3x^2-1)=6x^3-2x$. Wrong.",
    "check": "Redo it with the Product Rule: $2x(x^3-x)+(x^2+1)(3x^2-1)$, which simplifies to $5x^4-1$ as well."
  },
  "lec-04-q3a": {
    "spot": "Vertical asymptotes of a rational function are where the denominator is zero and the numerator isn't: the denominator $x-1$ is zero at $x=1$.",
    "why": "A vertical asymptote is where the function blows up; a zero denominator with a nonzero numerator is the most direct sign.",
    "steps": [
      "Denominator $x-1=0\\Rightarrow x=1$.",
      "The numerator at $x=1$ is $1\\ne0$, so nothing cancels and $|f|$ blows up near $x=1$.",
      "So $c=1$."
    ],
    "trap": "Taking $x=0$, where the numerator is zero, as the asymptote; that is a zero of the function, not an asymptote.",
    "check": "It goes to $+\\infty$ from the right and $-\\infty$ from the left; it shoots off on both sides."
  },
  "lec-05-m2": {
    "spot": "As $x\\to\\infty$, $x$ grows and $e^{-x}$ shrinks: an $\\infty\\cdot0$ form. Written as $\\frac{x}{e^x}$ it becomes $\\frac{\\infty}{\\infty}$, ready for L'Hôpital's Rule.",
    "why": "Exponentials grow faster than any polynomial, and one round of L'Hôpital's Rule differentiates the $x$ in the numerator away.",
    "steps": [
      "Rewrite: $xe^{-x}=\\frac{x}{e^x}$, a $\\frac{\\infty}{\\infty}$ form.",
      "L'Hôpital's Rule: differentiate top and bottom once to get $\\frac{1}{e^x}\\to0$.",
      "So the limit is $0$."
    ],
    "trap": "Seeing $\\infty\\cdot0$ and answering $1$ or \"does not exist\". Rewrite it as a fraction first, then decide which part grows faster.",
    "check": "Plug in $x=20$: $20e^{-20}\\approx4\\times10^{-8}$, tiny."
  },
  "lec-05-m3": {
    "spot": "$4.1$ is very close to $4$, and $\\sqrt4=2$ is easy — use the tangent line at $x=4$: $L(x)=f(4)+f'(4)(x-4)$.",
    "why": "Linear approximation needs just one function value and one derivative value; no actual square root required.",
    "steps": [
      "$f(4)=2$, $f'(x)=\\frac{1}{2\\sqrt x}$, $f'(4)=\\frac{1}{4}$.",
      "$L(x)=2+\\frac{1}{4}(x-4)$.",
      "Plug in $x=4.1$: $2+\\frac{0.1}{4}=2.025$."
    ],
    "trap": "Computing $f'(4)$ as $\\frac{1}{2}$ (forgetting the root in the denominator), which gives $2.05$.",
    "check": "$\\sqrt x$ curves downward, so the tangent line lies above the curve and the estimate is a bit larger than the true value $\\sqrt{4.1}\\approx2.0248$."
  },
  "lec-07-m4": {
    "spot": "$\\sin^2x$ is an even power that you can't integrate directly; lower the power with the half-angle formula $\\sin^2x=\\frac{1-\\cos2x}{2}$.",
    "why": "After reducing, it's a constant minus a cosine, and a cosine integrates to $0$ over a whole number of periods.",
    "steps": [
      "Half-angle: $\\sin^2x=\\frac{1-\\cos2x}{2}$.",
      "$\\int_0^\\pi\\frac{1}{2}dx=\\frac{\\pi}{2}$, $\\int_0^\\pi\\cos2x\\,dx=0$.",
      "So the integral $=\\frac{\\pi}{2}$."
    ],
    "trap": "Writing the antiderivative of $\\sin^2x$ as $\\frac{\\sin^3x}{3}$, which gives $0$ after plugging in the limits.",
    "check": "$\\sin^2$ and $\\cos^2$ have equal integrals on $[0,\\pi]$ and add up to $\\pi$, so each is half."
  },
  "lec-07-m5": {
    "spot": "$\\tan x=\\frac{\\sin x}{\\cos x}$, and the numerator $\\sin x$ is the derivative of the denominator $\\cos x$ up to a minus sign — a $\\frac{u'}{u}$ form, which integrates to a $\\ln$.",
    "why": "The substitution $u=\\cos x$ turns the integral into $-\\int\\frac{du}{u}$ in one step.",
    "steps": [
      "$\\tan x=\\frac{\\sin x}{\\cos x}$; let $u=\\cos x$, $du=-\\sin x\\,dx$.",
      "$\\int\\tan x\\,dx=-\\int\\frac{du}{u}=-\\ln|u|+C=-\\ln|\\cos x|+C$.",
      "So the antiderivative is $-\\ln|\\cos x|+C$ (on an interval where $\\cos x>0$ it is just $-\\ln\\cos x$)."
    ],
    "trap": "Dropping the minus sign and writing $\\ln\\cos x$, or confusing the antiderivative of $\\tan x$ with its derivative $\\sec^2x$.",
    "check": "It can also be written $\\ln|\\sec x|$: $-\\ln\\cos x=\\ln\\frac{1}{\\cos x}$, the same thing."
  },
  "lec-09-m1": {
    "spot": "$y=x$ and $y=x^2$ meet at $x=0$ and $x=1$; on $(0,1)$ the line is on top, so the area is the integral of top minus bottom.",
    "why": "Both curves are given as $y=f(x)$, so integrating in $x$ is the most direct.",
    "steps": [
      "Intersections: $x=x^2\\Rightarrow x=0,1$.",
      "On $(0,1)$, $x>x^2$; e.g. $x=\\frac{1}{2}$.",
      "Area $\\int_0^1(x-x^2)dx=\\frac{1}{2}-\\frac{1}{3}=\\frac{1}{6}$."
    ],
    "trap": "Computing only $\\int_0^1x^2dx=\\frac{1}{3}$ or $\\int_0^1x\\,dx=\\frac{1}{2}$, forgetting the region is between two curves.",
    "check": "The triangle under the line has area $\\frac{1}{2}$; subtract the $\\frac{1}{3}$ under the parabola and you get exactly $\\frac{1}{6}$."
  },
  "lec-09-m3": {
    "spot": "Average value $=\\frac{1}{b-a}\\int_a^bf$; the interval has length $\\pi$ and the integral of $\\sin x$ over $[0,\\pi]$ is $2$.",
    "why": "The average-value formula just spreads the total area evenly over the interval length; apply it directly.",
    "steps": [
      "$\\int_0^\\pi\\sin x\\,dx=[-\\cos x]_0^\\pi=2$.",
      "Interval length $\\pi-0=\\pi$.",
      "Average value $\\frac{2}{\\pi}$."
    ],
    "trap": "Forgetting to divide by the interval length and answering $2$; or thinking the positive and negative parts of $\\sin$ cancel to an average of $0$ (that is $[0,2\\pi]$).",
    "check": "$\\frac{2}{\\pi}\\approx0.64$ lies between the minimum $0$ and maximum $1$ of $\\sin$."
  },
  "lec-10-m1": {
    "spot": "Both $x$ and $y$ are given in terms of $t$: $\\frac{dy}{dx}=\\frac{dy/dt}{dx/dt}$.",
    "why": "No need to eliminate $t$ and solve $y=x^{3/2}$ (and worry about signs); just divide the parametric derivatives.",
    "steps": [
      "$\\frac{dx}{dt}=2t$, $\\frac{dy}{dt}=3t^2$.",
      "Divide: $\\frac{3t^2}{2t}$.",
      "Simplify to $\\frac{3t}{2}$ ($t\\ne0$)."
    ],
    "trap": "Dividing upside down: $\\frac{dx/dt}{dy/dt}=\\frac{2}{3t}$.",
    "check": "For $t>0$ the curve is $y=x^{3/2}$, and $\\frac{dy}{dx}=\\frac{3}{2}x^{1/2}=\\frac{3}{2}t$. Consistent."
  },
  "lec-12-m5": {
    "spot": "$\\frac{1}{n^p}$ is positive and decreasing, so it converges or diverges together with $\\int_1^\\infty\\frac{dx}{x^p}$ — the Integral Test.",
    "why": "The integral $\\int_1^\\infty x^{-p}dx$ has a closed form, so convergence is visible at a glance; faster than comparing case by case.",
    "steps": [
      "$p>1$: $\\int_1^\\infty x^{-p}dx=\\frac{1}{p-1}$ is finite; e.g. $p=2$ gives $1$, $p=1.5$ gives $2$.",
      "$p=1$: $\\int_1^R\\frac{dx}{x}=\\ln R\\to\\infty$; the harmonic series diverges.",
      "For $p<1$, $\\frac{1}{n^p}\\ge\\frac{1}{n}$, bigger than the harmonic series, so it diverges too.",
      "So the series converges exactly when $p>1$."
    ],
    "trap": "Thinking $p=1$ also converges (since $\\frac{1}{n}\\to0$). Terms going to $0$ doesn't guarantee convergence; the harmonic series is the counterexample.",
    "check": "$p=1$ is the boundary: $\\sum\\frac{1}{n}$ diverges while $\\sum\\frac{1}{n^{1.01}}$ converges, so the answer must be the strict $p>1$."
  },
  "lec-13-m3": {
    "spot": "A Ratio Test limit of $L=1$ is exactly the borderline: both convergent and divergent series can give $L=1$.",
    "why": "Comparing two familiar series shows right away that $L=1$ carries no information.",
    "steps": [
      "$\\sum\\frac{1}{n}$ diverges: $\\frac{a_{n+1}}{a_n}=\\frac{n}{n+1}\\to1$.",
      "$\\sum\\frac{1}{n^2}$ converges: $\\frac{a_{n+1}}{a_n}=\\left(\\frac{n}{n+1}\\right)^2\\to1$.",
      "Same $L=1$, one converges and one diverges, so the test is inconclusive; use a different test."
    ],
    "trap": "Thinking $L=1$ means \"just barely converges\" or \"just barely diverges\"; only $L<1$ and $L>1$ give a conclusion.",
    "check": "You need a finer tool instead, such as the Integral Test, the Comparison Test, or Raabe's test."
  },
  "lec-14-m4": {
    "spot": "$\\frac{1}{1+x^2}=\\frac{1}{1-(-x^2)}$ is the sum of a geometric series with ratio $r=-x^2$.",
    "why": "Substitute $r=-x^2$ into the known $\\frac{1}{1-r}=\\sum r^n$; no need to compute Taylor coefficients derivative by derivative.",
    "steps": [
      "$\\frac{1}{1-r}=\\sum_{n\\ge0}r^n$ for $|r|<1$.",
      "Substitute $r=-x^2$: when $|x|<1$, $|r|<1$, and $\\frac{1}{1+x^2}=\\sum(-x^2)^n=\\sum(-1)^nx^{2n}$ (check with $x=\\frac{1}{2}$).",
      "So $\\frac{1}{1+x^2}=\\sum_{n=0}^{\\infty}(-1)^nx^{2n}=1-x^2+x^4-\\cdots$."
    ],
    "trap": "Substituting $r=-x$ and getting $\\sum(-1)^nx^n$, which is $\\frac{1}{1+x}$; or dropping the alternating sign and writing $\\sum x^{2n}$, which is $\\frac{1}{1-x^2}$.",
    "check": "Integrating term by term gives $\\arctan x=x-\\frac{x^3}{3}+\\cdots$, matching the known expansion."
  },
  "rel-basic-001": {
    "spot": "$\\sin5x$ divided by $x$: the inside of $\\sin$ is $5x$, so the denominator must be made $5x$ to use $\\frac{\\sin u}{u}\\to1$.",
    "why": "Building the standard form takes one line; no L'Hôpital's Rule needed.",
    "steps": [
      "$\\frac{\\sin5x}{x}=5\\cdot\\frac{\\sin5x}{5x}$.",
      "$u=5x\\to0$, $\\frac{\\sin u}{u}\\to1$.",
      "So the limit $=5$."
    ],
    "trap": "Answering $1$ directly, forgetting to pull the coefficient inside $\\sin$ out front.",
    "check": "Plug in $x=0.01$: $\\frac{\\sin0.05}{0.01}\\approx4.998$."
  },
  "rel-basic-019": {
    "spot": "Starting at $n=0$, each term is the previous one times $\\frac{1}{2}$: a geometric series with first term $1$ and ratio $\\frac{1}{2}$.",
    "why": "A geometric series with $|r|<1$ has the formula $\\frac{\\text{first term}}{1-r}$; no partial sums needed.",
    "steps": [
      "The first term ($n=0$) is $\\left(\\frac{1}{2}\\right)^0=1$, ratio $r=\\frac{1}{2}$, and $|r|<1$ so it converges.",
      "Sum $=\\frac{1}{1-\\frac{1}{2}}=2$.",
      "So the answer is $2$."
    ],
    "trap": "Taking the first term to be $\\frac{1}{2}$ (as if it started at $n=1$) and answering $1$.",
    "check": "Partial sum $1+\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}=1.875$; each term covers half the remaining distance, heading to $2$."
  },
  "rel-basic-024": {
    "spot": "It starts at $n=1$: the first term is $\\frac{1}{3}$, not $1$, and the ratio is $\\frac{1}{3}$.",
    "why": "Apply $\\frac{\\text{first term}}{1-r}$ directly, but read the first term off the starting index.",
    "steps": [
      "First term ($n=1$): $\\frac{1}{3}$; ratio $r=\\frac{1}{3}$.",
      "Sum $=\\frac{1/3}{1-1/3}=\\frac{1/3}{2/3}=\\frac{1}{2}$.",
      "So the answer is $\\frac{1}{2}$."
    ],
    "trap": "Using $\\frac{1}{1-r}$ and getting $\\frac{3}{2}$; that is the sum from $n=0$, which includes the extra $n=0$ term $1$.",
    "check": "The sum from $n=0$ is $\\frac{3}{2}$; subtract the first term $1$ and you get exactly $\\frac{1}{2}$."
  },
  "ser-003": {
    "spot": "$\\left(\\frac{1}{3}\\right)^n$ starting at $n=0$: a geometric series with first term $1$ and ratio $\\frac{1}{3}$.",
    "why": "A ratio with absolute value less than one converges; use $\\frac{\\text{first term}}{1-r}$ directly, no partial sums needed.",
    "steps": [
      "First term $\\left(\\frac{1}{3}\\right)^0=1$, ratio $\\frac{1}{3}$.",
      "Sum $=\\frac{1}{1-\\frac{1}{3}}=\\frac{3}{2}$.",
      "So the answer is $\\frac{3}{2}$."
    ],
    "trap": "Taking the first term to be $\\frac{1}{3}$ and getting $\\frac{1}{2}$ — that is the sum starting at $n=1$.",
    "check": "The first three terms $1+\\frac{1}{3}+\\frac{1}{9}\\approx1.444$ are already close to $1.5$."
  },
  "ser-006": {
    "spot": "The general term has both $n!$ and $n^n$: dividing consecutive terms cancels almost all of the factorial, leaving $\\left(\\frac{n}{n+1}\\right)^n$ — the Ratio Test.",
    "why": "For series with factorials the Ratio Test is cleanest; here the ratio limit is $\\frac{1}{e}$, clearly less than $1$.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(n+1)!}{(n+1)^{n+1}}\\cdot\\frac{n^n}{n!}=\\frac{n^n}{(n+1)^n}=\\left(\\frac{n}{n+1}\\right)^n$.",
      "$\\left(\\frac{n}{n+1}\\right)^n=\\frac{1}{(1+1/n)^n}\\to\\frac{1}{e}$.",
      "$\\frac{1}{e}<1$, so by the Ratio Test the series converges."
    ],
    "trap": "Seeing only $\\frac{n}{n+1}\\to1$ and declaring the Ratio Test inconclusive; don't forget the $n$-th power outside, which makes the limit $\\frac{1}{e}$.",
    "check": "Intuitively $\\frac{n!}{n^n}=\\frac{1}{n}\\cdot\\frac{2}{n}\\cdots\\frac{n}{n}\\le\\frac{2}{n^2}$ (for $n\\ge2$), so comparison with the convergent $\\sum\\frac{2}{n^2}$ also gives convergence."
  },
  "ser-007": {
    "spot": "$\\frac{3^n}{n!}$ is exactly a term of $e^x=\\sum\\frac{x^n}{n!}$ at $x=3$, just missing the $n=0$ term.",
    "why": "Recognize the Taylor series of the exponential and write the answer down; no tests or sum estimates needed.",
    "steps": [
      "$e^x=\\sum_{n=0}^\\infty\\frac{x^n}{n!}$; at $x=3$: $\\sum_{n=0}^\\infty\\frac{3^n}{n!}=e^3$.",
      "The problem starts at $n=1$, missing the $n=0$ term $\\frac{3^0}{0!}=1$.",
      "So the sum $=e^3-1$ (check with $n!=\\int_0^\\infty t^ne^{-t}dt$)."
    ],
    "trap": "Forgetting that the index starts at $n=1$ and answering $e^3$.",
    "check": "The first three terms $3+\\frac{9}{2}+\\frac{27}{6}=12$, and the answer $e^3-1\\approx19.09$; the later terms are still sizable but decay quickly."
  },
  "tmpl-ser-geometric-001": {
    "spot": "$\\frac{1}{2^n}$ starting at $n=0$: a geometric series with first term $1$ and ratio $\\frac{1}{2}$.",
    "why": "The ratio has absolute value less than $1$, so use $\\frac{a}{1-r}$ directly.",
    "steps": [
      "First term $a=\\frac{1}{2^0}=1$, ratio $r=\\frac{1}{2}$.",
      "$\\frac{a}{1-r}=\\frac{1}{1-\\frac{1}{2}}=2$.",
      "So the sum is $2$."
    ],
    "trap": "Writing the first term as $\\frac{1}{2}$ (as if it started at $n=1$) and getting $1$.",
    "check": "Partial sum $1+\\frac{1}{2}+\\frac{1}{4}=1.75$, climbing toward $2$."
  },
  "tmpl-ser-geometric-002": {
    "spot": "$\\frac{3}{4^n}$ starting at $n=0$: a geometric series with first term $3$ and ratio $\\frac{1}{4}$.",
    "why": "Pull out the constant $3$; what's left is the standard geometric series $\\sum\\frac{1}{4^n}$, so use $\\frac{a}{1-r}$.",
    "steps": [
      "First term $a=\\frac{3}{4^0}=3$, ratio $r=\\frac{1}{4}$.",
      "$\\frac{a}{1-r}=\\frac{3}{1-\\frac{1}{4}}=\\frac{3}{3/4}=4$.",
      "So the sum is $4$."
    ],
    "trap": "Forgetting the coefficient $3$ and computing only $\\sum\\frac{1}{4^n}=\\frac{4}{3}$; or taking the first term to be $\\frac{3}{4}$ and getting $1$.",
    "check": "The first two terms give $3+\\frac{3}{4}=3.75$, and the rest $\\frac{3}{16}+\\cdots=0.25$ brings it to $4$."
  },
  "tmpl-ser-geometric-003": {
    "spot": "$\\frac{2}{5^n}$ starting at $n=0$: a geometric series with first term $2$ and ratio $\\frac{1}{5}$.",
    "why": "The ratio $\\frac{1}{5}$ is less than $1$, so $\\frac{a}{1-r}$ gets it in one step.",
    "steps": [
      "First term $a=\\frac{2}{5^0}=2$, ratio $r=\\frac{1}{5}$.",
      "$\\frac{a}{1-r}=\\frac{2}{1-\\frac{1}{5}}=\\frac{2}{4/5}=\\frac{5}{2}$.",
      "So the sum is $\\frac{5}{2}$."
    ],
    "trap": "Taking the first term to be $\\frac{2}{5}$ and getting $\\frac{1}{2}$; it starts at $n=0$, so the first term is just the coefficient $2$.",
    "check": "The first two terms give $2+0.4=2.4$; adding $0.08$ and so on approaches $2.5$."
  },
  "tmpl-ser-geometric-004": {
    "spot": "$\\frac{5}{3^n}$ starting at $n=0$: a geometric series with first term $5$ and ratio $\\frac{1}{3}$.",
    "why": "A convergent geometric series uses $\\frac{a}{1-r}$ directly; no partial sums needed.",
    "steps": [
      "First term $a=\\frac{5}{3^0}=5$, ratio $r=\\frac{1}{3}$.",
      "$\\frac{a}{1-r}=\\frac{5}{1-\\frac{1}{3}}=\\frac{5}{2/3}=\\frac{15}{2}$.",
      "So the sum is $\\frac{15}{2}$."
    ],
    "trap": "Computing $\\frac{5}{2/3}$ as $\\frac{10}{3}$ (fraction division flipped the wrong way); dividing by $\\frac{2}{3}$ means multiplying by $\\frac{3}{2}$.",
    "check": "The first three terms $5+\\frac{5}{3}+\\frac{5}{9}\\approx7.22$, approaching $7.5$."
  },
  "tmpl-ser-geometric-005": {
    "spot": "$\\frac{4}{6^n}$ starting at $n=0$: a geometric series with first term $4$ and ratio $\\frac{1}{6}$.",
    "why": "The ratio $\\frac{1}{6}$ is small, so the series converges fast and the formula $\\frac{a}{1-r}$ gives the answer directly.",
    "steps": [
      "First term $a=\\frac{4}{6^0}=4$, ratio $r=\\frac{1}{6}$.",
      "$\\frac{a}{1-r}=\\frac{4}{1-\\frac{1}{6}}=\\frac{4}{5/6}=\\frac{24}{5}$.",
      "So the sum is $\\frac{24}{5}$."
    ],
    "trap": "Taking the first term to be $\\frac{4}{6}$ and getting $\\frac{4}{5}$; it starts at $n=0$.",
    "check": "The first two terms give $4+\\frac{2}{3}\\approx4.67$, and the answer $4.8$ is only a little more."
  },
  "cl-der-003": {
    "spot": "$31^\\circ$ is just $1^\\circ$ from $30^\\circ$, and $\\sin30^\\circ$, $\\cos30^\\circ$ are familiar values — use $\\sin(a+\\Delta)\\approx\\sin a+\\cos a\\cdot\\Delta$, but convert $\\Delta$ to radians.",
    "why": "A differential estimate needs one function value and one derivative value; the formula $(\\sin x)'=\\cos x$ only holds in radians.",
    "steps": [
      "$a=\\frac{\\pi}{6}$: $\\sin a=\\frac{1}{2}$, $\\cos a=\\frac{\\sqrt3}{2}$.",
      "$\\Delta=1^\\circ=\\frac{\\pi}{180}$ radians.",
      "$\\sin31^\\circ\\approx\\frac{1}{2}+\\frac{\\sqrt3}{2}\\cdot\\frac{\\pi}{180}=\\frac{1}{2}+\\frac{\\sqrt3\\pi}{360}$."
    ],
    "trap": "Plugging in $\\Delta=1$ (degrees) directly and getting $\\frac{1}{2}+\\frac{\\sqrt3}{2}\\approx1.37$, bigger than $1$ — obviously impossible.",
    "check": "The estimate is $\\approx0.5151$ and the true value $\\sin31^\\circ\\approx0.5150$; $\\sin$ curves downward here, so the tangent line is slightly high."
  },
  "cl-der-004": {
    "spot": "$f(0)=0$ and $f(\\sqrt3)=3\\sqrt3-3\\sqrt3=0$, equal endpoint values — Rolle's theorem guarantees some $f'(c)=0$ inside; solve and keep the one in the interval.",
    "why": "Rolle's $c$ is a zero of the derivative: solve $3x^2-3=0$ and check the range.",
    "steps": [
      "Endpoints: $f(0)=0$, $f(\\sqrt3)=0$, so Rolle's theorem applies.",
      "$f'(x)=3x^2-3=0\\Rightarrow x=\\pm1$.",
      "Only $x=1$ lies in $(0,\\sqrt3)$, so $c=1$."
    ],
    "trap": "Listing $c=-1$ as well; $-1$ is not in $[0,\\sqrt3]$.",
    "check": "$c=1$ is the lowest point of $f$ on the interval: $f(1)=-2$, lower than the $0$ at both ends."
  },
  "cl-der-005": {
    "spot": "Quadratic over linear, one degree higher on top — there's a slant asymptote; do polynomial division, and the quotient is the asymptote.",
    "why": "After dividing, the remainder over $x-1$ tends to $0$, and you read $b$ straight off the quotient $2x+b$.",
    "steps": [
      "Long division: $2x^2+3x-1=(x-1)(2x+5)+4$.",
      "So $y=2x+5+\\frac{4}{x-1}$, and $\\frac{4}{x-1}\\to0$ as $x\\to\\pm\\infty$.",
      "Slant asymptote $y=2x+5$, $b=5$."
    ],
    "trap": "Getting the slope $2$ from the leading coefficients and then taking $b$ to be the numerator constant $-1$ or $3$; $b$ has to come from $\\lim(y-2x)$.",
    "check": "Check at $x=1000$: $y-2x\\approx5.004$, indeed close to $5$."
  },
  "cl-der-007": {
    "spot": "Counting real roots of a cubic: check whether the local max and local min of $f(x)=x^3-3x+1$ have opposite signs — one positive and one negative means three roots.",
    "why": "Compute the function values at the critical points, combine with the end behavior, and the Intermediate Value Theorem counts the roots; no need to actually solve the cubic.",
    "steps": [
      "$f'(x)=3x^2-3=0\\Rightarrow x=\\pm1$.",
      "Local max $f(-1)=3>0$, local min $f(1)=-1<0$.",
      "Ends: $f(-2)=-1<0$, $f(2)=3>0$. So there is a sign change in each of $(-2,-1)$, $(-1,1)$, $(1,2)$.",
      "Each piece is monotonic with exactly one root, so there are $3$ real roots."
    ],
    "trap": "Knowing only that a cubic has \"at least one real root\" and answering $1$; you need the signs of the extreme values to know how many.",
    "check": "The three roots are about $-1.88$, $0.35$, $1.53$, and their sum should be minus the $x^2$ coefficient, $0$."
  },
  "cl-der-008": {
    "spot": "The derivative of $r=e^\\theta$ is still $e^\\theta$, so $\\frac{r}{dr/d\\theta}=1$ regardless of $\\theta$ — the logarithmic spiral makes the same angle everywhere.",
    "why": "The problem already gives $\\tan\\psi=\\frac{r}{dr/d\\theta}$; plugging in gives a constant.",
    "steps": [
      "$\\frac{dr}{d\\theta}=e^\\theta$, which is $e$ at $\\theta=1$.",
      "$\\tan\\psi=\\frac{e}{e}=1$.",
      "$0<\\psi<\\pi$ and $\\tan\\psi=1$, so $\\psi=\\frac{\\pi}{4}$."
    ],
    "trap": "Computing $\\tan\\psi$ as $\\frac{dr/d\\theta}{r}$ (upside down). It happens to be $1$ here too, but on a different spiral it would be wrong.",
    "check": "At $\\theta=2$ it is also $\\frac{e^2}{e^2}=1$: that is where the name equiangular spiral comes from."
  },
  "cl-int-003": {
    "spot": "Step size $h=0.5$ from $x=0$ to $x=1$ is exactly two steps: each step is $y_{k+1}=y_k+h\\,f(x_k,y_k)$ with $f=y-x^2$.",
    "why": "Euler's method steps forward using only the slope at the current point; apply the formula twice.",
    "steps": [
      "Step one: $x_0=0$, $y_0=1$, slope $1-0=1$, $y_1=1+0.5\\cdot1=1.5$.",
      "Step two: $x_1=0.5$, $y_1=1.5$, slope $1.5-0.25=1.25$, $y_2=1.5+0.5\\cdot1.25=2.125$.",
      "So $y(1)\\approx2.125=\\frac{17}{8}$."
    ],
    "trap": "Using $x_2=1$ for the slope in step two ($1.5-1=0.5$) and getting $1.75$; Euler's method uses the step's starting point $x_1=0.5$.",
    "check": "The exact solution is $y=x^2+2x+2-e^x$, with $y(1)=5-e\\approx2.28$; with a large step Euler's method underestimates a bit. Reasonable."
  },
  "cl-int-007": {
    "spot": "An arc-length problem with a deliberately designed shape like $(x^2+2)^{3/2}$: $1+(y')^2$ will be a perfect square, so the square root disappears.",
    "why": "The arc-length formula $\\int\\sqrt{1+(y')^2}dx$ is usually hard to integrate; the coefficients here were chosen so the square shows up when you expand.",
    "steps": [
      "$y'=\\frac{1}{3}\\cdot\\frac{3}{2}(x^2+2)^{1/2}\\cdot2x=x\\sqrt{x^2+2}$.",
      "$1+(y')^2=1+x^2(x^2+2)=x^4+2x^2+1=(x^2+1)^2$.",
      "Arc length $=\\int_0^1(x^2+1)dx=\\frac{1}{3}+1=\\frac{4}{3}$."
    ],
    "trap": "Remembering the formula as $\\int\\sqrt{1+y'}\\,dx$, or integrating $y$ itself; you need the derivative squared, plus one, under a square root.",
    "check": "The straight segment between the endpoints has length $\\sqrt{1+(y(1)-y(0))^2}\\approx1.29$; the arc should be a bit longer, and $\\frac{4}{3}\\approx1.33$ is reasonable."
  },
  "cl-int-008": {
    "spot": "The right side of $\\frac{dh}{dt}=-0.2\\sqrt h$ involves only $h$ — separable: move $\\sqrt h$ to the left and integrate both sides.",
    "why": "After separating, the left side is $h^{-1/2}$, which integrates to $2\\sqrt h$; the solution is a clean linear decrease in $\\sqrt h$.",
    "steps": [
      "Separate: $\\frac{dh}{\\sqrt h}=-0.2\\,dt$. Integrate: $2\\sqrt h=-0.2t+C$.",
      "$h(0)=4$: $2\\cdot2=C$, $C=4$, so $\\sqrt h=2-0.1t$ and $h(t)=(2-0.1t)^2$.",
      "$t=10$: $\\sqrt h=2-1=1$, so $h(10)=1$ m."
    ],
    "trap": "Forgetting to square at the end and answering the value of $\\sqrt h$; or integrating $\\int h^{-1/2}dh$ as $\\frac{1}{2}\\sqrt h$, which gives $\\sqrt h=2-0.4t$ and a tank that empties before ten minutes.",
    "check": "At $t=20$, $\\sqrt h=0$ and the water has just run out; ten minutes is exactly half the time, so $\\sqrt h$ is halved and the depth is a quarter."
  },
  "der-008": {
    "spot": "Numerator $x$ and denominator $x+1$ are both linear — use the Quotient Rule, or rewrite as $1-\\frac{1}{x+1}$, which is faster.",
    "why": "After rewriting as $1-\\frac{1}{x+1}$ you only differentiate $(x+1)^{-1}$, one less simplification than the Quotient Rule.",
    "steps": [
      "Rewrite: $\\frac{x}{x+1}=1-\\frac{1}{x+1}$.",
      "$\\left(-\\frac{1}{x+1}\\right)'=\\frac{1}{(x+1)^2}$.",
      "So the derivative $=\\frac{1}{(x+1)^2}$."
    ],
    "trap": "Reversing the order in the Quotient Rule numerator: $\\frac{x\\cdot1-(x+1)\\cdot1}{(x+1)^2}=\\frac{-1}{(x+1)^2}$, off by a sign.",
    "check": "$\\frac{x}{x+1}$ is increasing on $x>-1$, so the derivative should be positive."
  },
  "der-010": {
    "spot": "$\\sin(x^2)$ times $e^{-x}$: the outside is the Product Rule, and both $\\sin(x^2)$ and $e^{-x}$ need the Chain Rule.",
    "why": "Differentiate the two factors separately, apply the Product Rule, then factor out $e^{-x}$.",
    "steps": [
      "$(\\sin x^2)'=\\cos(x^2)\\cdot2x$.",
      "$(e^{-x})'=-e^{-x}$.",
      "Product Rule: $2x\\cos(x^2)e^{-x}-\\sin(x^2)e^{-x}=e^{-x}\\left(2x\\cos(x^2)-\\sin(x^2)\\right)$."
    ],
    "trap": "Dropping the minus sign in the derivative of $e^{-x}$ and writing $e^{-x}$, or differentiating $\\sin(x^2)$ to $\\cos(x^2)$ without the factor $2x$.",
    "check": "At $x=0$: $2\\cdot0\\cdot1-0=0$; near $0$ the function looks like $x^2$, so the tangent is horizontal."
  },
  "der-015": {
    "spot": "$\\ln\\left(x+\\sqrt{1+x^2}\\right)$ is the inverse hyperbolic sine; even if you don't recognize it, the Chain Rule with outer $\\ln$ and the inner part simplifies cleanly.",
    "why": "After the Chain Rule, $\\sqrt{1+x^2}+x$ appears in the numerator and cancels the denominator.",
    "steps": [
      "Inner derivative: $\\left(x+\\sqrt{1+x^2}\\right)'=1+\\frac{x}{\\sqrt{1+x^2}}=\\frac{\\sqrt{1+x^2}+x}{\\sqrt{1+x^2}}$.",
      "Chain Rule: $\\frac{1}{x+\\sqrt{1+x^2}}\\cdot\\frac{\\sqrt{1+x^2}+x}{\\sqrt{1+x^2}}$, and the matching factors cancel.",
      "So the derivative $=\\frac{1}{\\sqrt{1+x^2}}$."
    ],
    "trap": "Differentiating only the outer layer to get $\\frac{1}{x+\\sqrt{1+x^2}}$ and forgetting the inner derivative.",
    "check": "At $x=0$ the derivative is $1$, matching the slope of $\\sinh^{-1}$ at the origin."
  },
  "der-019": {
    "spot": "$(x^2+1)^5$: outer fifth power, inner $x^2+1$ — Chain Rule, don't expand.",
    "why": "Expanding goes all the way to $x^{10}$; the Chain Rule is one line.",
    "steps": [
      "Outer: $(u^5)'=5u^4$.",
      "Inner: $(x^2+1)'=2x$.",
      "Multiply: $5(x^2+1)^4\\cdot2x=10x(x^2+1)^4$."
    ],
    "trap": "Forgetting the inner derivative $2x$ and answering $5(x^2+1)^4$.",
    "check": "$(x^2+1)^5$ is even, so its derivative is odd and equals $0$ at $x=0$."
  }
};
