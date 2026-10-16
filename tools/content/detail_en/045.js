// Detail v2, English — batch 045. Translation of tools/content/detail/045.js (text only; claims live in the Chinese file).
module.exports = {
  "dm-ser-006": {
    "spot": "The denominator $n^2+1$ doesn't factor over the reals (its roots are $\\pm i$), so telescoping won't work. But the Fourier cosine coefficients of $\\cosh x$ have exactly $n^2+1$ in the denominator, and plugging in $x=\\pi$, $\\cos n\\pi=(-1)^n$ cancels the $(-1)^n$ in the coefficients.",
    "why": "The Fourier series named in the problem produces $\\frac{1}{n^2+1}$ on its own; just pick a point where the signs disappear, and the series sum equals a known function value.",
    "steps": [
      "$\\cosh x$ is even, so only cosine terms appear. Constant term $\\frac{a_0}{2}=\\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi}\\cosh x\\,dx=\\frac{\\sinh\\pi}{\\pi}$.",
      "Integration by parts twice: $a_n=\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi}\\cosh x\\cos nx\\,dx=\\frac{2\\sinh\\pi\\,(-1)^n}{\\pi(n^2+1)}$.",
      "After periodic extension, $\\cosh x$ has equal values at both ends of $x=\\pi$ and is continuous, so the series converges to $\\cosh\\pi$; $(-1)^n\\cos n\\pi=1$, so $\\cosh\\pi=\\frac{\\sinh\\pi}{\\pi}+\\frac{2\\sinh\\pi}{\\pi}\\sum_{n\\ge1}\\frac{1}{n^2+1}$.",
      "Solve for the sum: $\\sum_{n\\ge1}\\frac{1}{n^2+1}=\\frac{\\pi\\coth\\pi-1}{2}=\\frac{1}{2}\\left(\\pi\\cdot\\frac{e^{\\pi}+e^{-\\pi}}{e^{\\pi}-e^{-\\pi}}-1\\right)\\approx1.0767$."
    ],
    "trap": "Plugging in $x=0$: that gives the alternating sum $\\sum\\frac{(-1)^n}{n^2+1}$, not what's asked; or treating $\\coth\\pi$ as $1$ and answering $\\frac{\\pi-1}{2}\\approx1.0708$, off in the third digit.",
    "check": "The first four terms give $\\frac12+\\frac15+\\frac1{10}+\\frac1{17}\\approx0.859$, and the tail is about $\\int_{4.5}^{\\infty}\\frac{dx}{x^2}\\approx0.22$; together about $1.08$, matching $1.0767$."
  },
  "dx-thm-004": {
    "spot": "The cubic $x^3+x-3=0$ has no nice root, and the problem specifies Newton's method, two steps from $x_0=1$: just apply $x_{k+1}=x_k-\\frac{f(x_k)}{f'(x_k)}$ repeatedly.",
    "why": "Each Newton step needs only two numbers, $f$ and $f'$. Write $f'$ down first and compute $f(x_k)$ and $f'(x_k)$ separately at each step, so the fractions don't get tangled.",
    "steps": [
      "$f(x)=x^3+x-3$, $f'(x)=3x^2+1$.",
      "Step one: $f(1)=-1$, $f'(1)=4$, $x_1=1-\\frac{-1}{4}=\\frac54$.",
      "At $x_1=\\frac54$: $f=\\frac{125}{64}+\\frac54-3=\\frac{13}{64}$, $f'=\\frac{75}{16}+1=\\frac{91}{16}$.",
      "Step two: $\\frac{13/64}{91/16}=\\frac{1}{28}$, $x_2=\\frac54-\\frac{1}{28}=\\frac{34}{28}=\\frac{17}{14}$."
    ],
    "trap": "Lazily reusing $f'(x_0)=4$ as the denominator in step two: $x_2=\\frac54-\\frac{13/64}{4}=\\frac{307}{256}\\approx1.199$ — that's the simplified Newton method, not Newton's method.",
    "check": "The true root is about $1.2134$: $f(1.213)<0<f(\\frac{17}{14})$, so $x_2\\approx1.2143$ approaches from the right, off by less than $0.001$ ($f$ is convex here, so Newton's method converges from above)."
  },
  "fd-limx-604": {
    "spot": "The base $\\frac{(1+\\frac1n)^n}{e}\\to1$ and the exponent $n\\to\\infty$: a $1^\\infty$ form. And the gap between $(1+\\frac1n)^n$ and $e$ is of order $\\frac1n$, so multiplying by the exponent $n$ leaves exactly a finite value.",
    "why": "For $1^\\infty$, always take logs first, turning it into \"$0\\cdot\\infty$\"; expanding $\\ln(1+\\frac1n)$ to the second term reveals that $-\\frac{1}{2n}$.",
    "steps": [
      "Take logs: $\\ln a_n=n\\left(n\\ln(1+\\tfrac1n)-1\\right)=n^2\\ln(1+\\tfrac1n)-n$.",
      "Taylor expansion $\\ln(1+\\frac1n)=\\frac1n-\\frac{1}{2n^2}+\\frac{1}{3n^3}-\\cdots$; multiply by $n^2$ and subtract $n$: $-\\frac12+\\frac{1}{3n}-\\cdots\\to-\\frac12$.",
      "So $\\ln a_n\\to-\\frac12$, and the original limit $=e^{-1/2}$."
    ],
    "trap": "Thinking $(1+\\frac1n)^n\\to e$, so the bracket $\\to1$ and the answer is $1$: this ignores that the bracket approaches $1$ at rate $\\frac{1}{2n}$, which the $n$-th power amplifies into exactly $e^{-1/2}$.",
    "check": "Plug in $n=1000$: about $0.6067$, very close to $e^{-1/2}\\approx0.6065$."
  },
  "fd-limx-605": {
    "spot": "$\\arctan\\frac{x}{x+1}\\to\\arctan1=\\frac\\pi4$, so the bracket $\\to0$ while multiplied by $x\\to\\infty$; and the bracket is a difference of two arctangents, which the difference formula combines into one.",
    "why": "The difference formula turns $\\frac\\pi4-\\arctan\\frac{x}{x+1}$ into $\\arctan\\frac{1}{2x+1}$, then $\\arctan u\\approx u$ finishes it in one line — cleaner than L'Hôpital's Rule on the whole expression.",
    "steps": [
      "$\\tan(A-B)=\\frac{1-\\frac{x}{x+1}}{1+\\frac{x}{x+1}}=\\frac{1}{2x+1}$, and both angles lie in $(0,\\frac\\pi2)$, so $\\frac\\pi4-\\arctan\\frac{x}{x+1}=\\arctan\\frac{1}{2x+1}$.",
      "$u=\\frac{1}{2x+1}\\to0$, and $\\frac{\\arctan u}{u}\\to1$.",
      "So $x\\arctan\\frac{1}{2x+1}$ has the same limit as $\\frac{x}{2x+1}$, namely $\\frac12$."
    ],
    "trap": "Saying \"$\\arctan\\frac{x}{x+1}\\to\\frac\\pi4$, the bracket is $0$, so the limit is $0$\": $0\\cdot\\infty$ is an indeterminate form and can't be judged that way.",
    "check": "$x=100$: $100\\arctan\\frac{1}{201}\\approx0.4975$, heading toward $\\frac12$."
  },
  "fd-serb-601": {
    "spot": "The denominator $3n+1$ in $\\frac{(-1)^n}{3n+1}$ is the power you get by integrating $x^{3n}$: the series is the geometric series $\\sum(-x^3)^n$ integrated from $0$ to $1$.",
    "why": "\"Alternating sign + linear denominator\" means write the denominator as $\\int_0^1x^{3n}dx$; the alternating geometric series sums to $\\frac{1}{1+x^3}$, and the whole problem becomes one rational-function integral.",
    "steps": [
      "$\\frac{1}{3n+1}=\\int_0^1x^{3n}dx$.",
      "Swap sum and integral (the endpoint $x=1$ is justified by Abel's theorem): $\\sum_{n\\ge0}(-1)^nx^{3n}=\\frac{1}{1+x^3}$, so the sum $=\\int_0^1\\frac{dx}{1+x^3}$.",
      "Partial fractions: $1+x^3=(1+x)(x^2-x+1)$, $\\frac{1}{1+x^3}=\\frac{1/3}{1+x}+\\frac{-\\frac13x+\\frac23}{x^2-x+1}$.",
      "Antiderivative: $\\frac13\\ln(1+x)-\\frac16\\ln(x^2-x+1)+\\frac{1}{\\sqrt3}\\arctan\\frac{2x-1}{\\sqrt3}$.",
      "Evaluate from $0$ to $1$: the $\\ln$ terms give $\\frac13\\ln2$, and the arctangent going from $-\\frac\\pi6$ to $\\frac\\pi6$ gives $\\frac{1}{\\sqrt3}\\cdot\\frac\\pi3$. Sum $=\\frac{\\ln2}{3}+\\frac{\\pi}{3\\sqrt3}$."
    ],
    "trap": "The arctangent endpoints are $\\pm\\frac\\pi6$; taking only the upper one $\\frac\\pi6$ gives $\\frac{\\ln2}{3}+\\frac{\\pi}{6\\sqrt3}\\approx0.533$, half the $\\pi$ term missing.",
    "check": "Alternating-series bracketing: the first two terms give $1-\\frac14=0.75$, the first three $0.75+\\frac17\\approx0.893$, and the answer $\\approx0.836$ is in between."
  },
  "fd-serb-602": {
    "spot": "The two factors of $n(n+2)$ differ by $2$, so it splits as $\\frac12(\\frac1n-\\frac1{n+2})$; but with the alternating sign in front, you get two alternating harmonic series offset by two terms.",
    "why": "Direct telescoping is scrambled by $(-1)^{n+1}$. Instead subtract two series that each sum to $\\ln2$: the $\\ln2$'s cancel completely, leaving only the first two offset terms.",
    "steps": [
      "Partial fractions: $\\frac{1}{n(n+2)}=\\frac12\\left(\\frac1n-\\frac{1}{n+2}\\right)$.",
      "First series: $\\sum_{n\\ge1}\\frac{(-1)^{n+1}}{n}=\\ln2$.",
      "Second series: let $m=n+2$; $(-1)^{n+1}=(-1)^{m-1}$, so it's the $\\ln2$ series without the terms $m=1,2$: $\\ln2-1+\\frac12=\\ln2-\\frac12$.",
      "Subtracting gives $\\frac12$; times $\\frac12$: sum $=\\frac14$."
    ],
    "trap": "Ignoring the alternating sign and telescoping as usual leaves $\\frac12(1+\\frac12)=\\frac34$, which is the sum of $\\sum\\frac{1}{n(n+2)}$ (no signs).",
    "check": "Alternating-series bracketing: $\\frac13-\\frac18\\approx0.208$, plus $\\frac1{15}$ gives $0.275$, and $\\frac14$ is in between."
  },
  "fd-serb-603": {
    "spot": "Numerator $n$, denominator $(2n+1)!$: write $n$ as $\\frac12[(2n+1)-1]$; the first piece cancels a factor of the factorial, leaving $\\frac{1}{(2n)!}$ — even and odd factorials are exactly the series for $\\cosh 1$ and $\\sinh 1$.",
    "why": "A series with a factorial in the denominator is almost always some member of the $e^x$ family at a point; shaping the numerator into a factor of the denominator is more direct than running the Ratio Test and then guessing the sum.",
    "steps": [
      "$n=\\frac12[(2n+1)-1]$ and $(2n+1)!=(2n+1)\\cdot(2n)!$, so $\\frac{n}{(2n+1)!}=\\frac12\\left(\\frac{1}{(2n)!}-\\frac{1}{(2n+1)!}\\right)$.",
      "$\\sum_{n\\ge1}\\frac{1}{(2n)!}=\\cosh1-1$ (removing the $n=0$ term $1$).",
      "$\\sum_{n\\ge1}\\frac{1}{(2n+1)!}=\\sinh1-1$ (removing the $n=0$ term $1$).",
      "Sum $=\\frac12[(\\cosh1-1)-(\\sinh1-1)]=\\frac12(\\cosh1-\\sinh1)=\\frac{1}{2e}$."
    ],
    "trap": "Dropping the $\\frac12$ when splitting gives $\\frac1e\\approx0.368$, exactly twice the correct value.",
    "check": "The first three terms $\\frac16+\\frac{2}{120}+\\frac{3}{5040}\\approx0.18393$, versus $\\frac{1}{2e}\\approx0.18394$; the remaining terms are below $10^{-5}$."
  },
  "fd-serb-606": {
    "spot": "The denominator $4n^4+1$ has the shape of the Sophie Germain identity $a^4+4b^4$, so it factors as $(2n^2-2n+1)(2n^2+2n+1)$; the difference of the two factors, $4n$, is proportional to the numerator $n$.",
    "why": "For a series with a quartic denominator to telescope, the key is that the two factors are \"one step apart\": $2n^2+2n+1$ is $2n^2-2n+1$ with $n$ replaced by $n+1$.",
    "steps": [
      "Complete the square: $4n^4+1=(2n^2+1)^2-(2n)^2=(2n^2-2n+1)(2n^2+2n+1)$.",
      "The factors differ by $4n$: $\\frac{n}{4n^4+1}=\\frac14\\left(\\frac{1}{2n^2-2n+1}-\\frac{1}{2n^2+2n+1}\\right)$.",
      "Let $g(n)=2n^2-2n+1$; then $g(n+1)=2n^2+2n+1$, and the general term is $\\frac14\\left(\\frac{1}{g(n)}-\\frac{1}{g(n+1)}\\right)$.",
      "Telescoping leaves the first term: $\\frac14\\cdot\\frac{1}{g(1)}=\\frac14\\cdot\\frac11=\\frac14$."
    ],
    "trap": "Treating $4n^4+1$ as unfactorable and only proving convergence with the Comparison Test, which can't give the sum; or forcing the approximation $(2n^2+1)^2$, which only gives an estimate.",
    "check": "The first term is $\\frac15=0.2$, the second $\\frac{2}{65}\\approx0.031$, and later terms shrink fast, so a total of $0.25$ is reasonable."
  },
  "fd-serb-607": {
    "spot": "The coefficient contains $(2n)!$, $n!$ and $n^n$: factorials with $n^n$ call for the ratio method, and after canceling, $\\left(\\frac{n}{n+1}\\right)^n\\to\\frac1e$ appears.",
    "why": "The root method would have to handle $\\sqrt[n]{(2n)!}$, which needs Stirling; the ratio method cancels most of the factorials, leaving one familiar $e$-type limit.",
    "steps": [
      "$\\frac{a_{n+1}}{a_n}=\\frac{(2n+2)(2n+1)}{n+1}\\cdot\\frac{n^n}{(n+1)^{n+1}}=\\frac{2(2n+1)}{n+1}\\left(\\frac{n}{n+1}\\right)^n$.",
      "$\\frac{2(2n+1)}{n+1}\\to4$, and $\\left(\\frac{n}{n+1}\\right)^n=\\left(1+\\frac1n\\right)^{-n}\\to\\frac1e$.",
      "The ratio $\\to\\frac4e$, so the radius of convergence is the reciprocal, $R=\\frac e4\\approx0.68$."
    ],
    "trap": "Treating $\\frac{n^n}{(n+1)^{n+1}}$ as $\\frac{1}{n+1}$ (thinking $(\\frac{n}{n+1})^n\\to1$): the ratio $\\to4$ and you answer $R=\\frac14$.",
    "check": "Stirling estimates $a_n\\approx\\sqrt2\\left(\\frac4e\\right)^n$: at $n=10$, $a_{10}=\\frac{20!}{10!\\,10^{10}}\\approx67.0$, versus $\\sqrt2(\\frac4e)^{10}\\approx67.4$, only $0.5\\%$ apart — the growth rate really is $\\frac4e$."
  },
  "fd-serx-501": {
    "spot": "There's a $2^n$ in the denominator and a rational factor $\\frac{n+2}{n(n+1)}$ in front: first split by partial fractions into $\\frac2n-\\frac{1}{n+1}$; each piece paired with $\\frac{1}{2^n}$ is a series for $-\\ln(1-x)$ at $x=\\frac12$.",
    "why": "$\\sum\\frac{x^n}{n}=-\\ln(1-x)$ is the standard tool for \"$\\frac1n$ times geometric\"; split into partial fractions first so each piece matches it.",
    "steps": [
      "Partial fractions: $\\frac{n+2}{n(n+1)}=\\frac2n-\\frac{1}{n+1}$.",
      "$\\sum_{n\\ge1}\\frac{1}{n2^n}=-\\ln(1-\\tfrac12)=\\ln2$.",
      "$\\sum_{n\\ge1}\\frac{1}{(n+1)2^n}=2\\sum_{m\\ge2}\\frac{1}{m2^m}=2\\left(\\ln2-\\tfrac12\\right)$.",
      "Sum $=2\\ln2-(2\\ln2-1)=1$."
    ],
    "trap": "In step three, treating $\\frac{1}{(n+1)2^n}$ as $\\frac{1}{(n+1)2^{n+1}}$ and missing the factor $2$: you get $2\\ln2-(\\ln2-\\frac12)=\\ln2+\\frac12\\approx1.19$.",
    "check": "A positive series climbs up from below: the first three terms $\\frac34+\\frac16+\\frac{5}{96}\\approx0.969$, not far from $1$."
  },
  "fd-serx-503": {
    "spot": "The denominator is a product of three consecutive integers $(n+1)(n+2)(n+3)$, and the numerator $n$ can be rewritten as $(n+3)-3$, splitting into reciprocals of two \"consecutive-integer products\", each of which telescopes.",
    "why": "Reciprocals of consecutive-integer products have ready-made telescoping formulas — much less work than a three-term partial fraction decomposition.",
    "steps": [
      "$n=(n+3)-3$: $\\frac{n}{(n+1)(n+2)(n+3)}=\\frac{1}{(n+1)(n+2)}-\\frac{3}{(n+1)(n+2)(n+3)}$.",
      "$\\frac{1}{(n+1)(n+2)}=\\frac{1}{n+1}-\\frac{1}{n+2}$; telescoping from $n=1$ leaves $\\frac12$.",
      "$\\frac{1}{k(k+1)(k+2)}=\\frac12\\left(\\frac{1}{k(k+1)}-\\frac{1}{(k+1)(k+2)}\\right)$; telescoping from $k=2$ leaves $\\frac12\\cdot\\frac{1}{2\\cdot3}=\\frac{1}{12}$.",
      "Sum $=\\frac12-3\\cdot\\frac1{12}=\\frac14$."
    ],
    "trap": "In step two, starting the telescoping at $\\frac{1}{1\\cdot2}$ and writing $\\sum_{n\\ge1}\\frac{1}{(n+1)(n+2)}$ as $1$: you get $1-\\frac14=\\frac34$.",
    "check": "Every term is smaller than $\\frac{1}{(n+1)(n+2)}$, so the sum must be less than $\\frac12$; $\\frac14$ fits."
  },
  "fd-serx-505": {
    "spot": "Numerator $n^4$, denominator $n!$: write $n^4$ as a combination of falling factorials $n$, $n(n-1)$, $n(n-1)(n-2)$, $n(n-1)(n-2)(n-3)$; each piece cancels against $n!$ to give $\\sum\\frac{1}{m!}=e$.",
    "why": "$\\frac{n(n-1)\\cdots(n-j+1)}{n!}=\\frac{1}{(n-j)!}$, so you only need the falling-factorial coefficients $1,7,6,1$ of $n^4$; the answer is their sum times $e$.",
    "steps": [
      "$n^4=n+7n(n-1)+6n(n-1)(n-2)+n(n-1)(n-2)(n-3)$ (Stirling numbers of the second kind).",
      "Each piece: $\\sum_{n\\ge j}\\frac{n(n-1)\\cdots(n-j+1)}{n!}=\\sum_{m\\ge0}\\frac{1}{m!}=e$, e.g. $j=2$ and $j=4$.",
      "Sum $=(1+7+6+1)e=15e\\approx40.77$."
    ],
    "trap": "Thinking $\\sum\\frac{n^k}{n!}=e$ holds for every $k$ (only $k=1$ works), or replacing $n^4$ with just $n(n-1)(n-2)(n-3)$ and dropping the lower terms — both answer $e$.",
    "check": "The first five terms $1+8+13.5+10.67+5.21\\approx38.4$, and the sixth is $\\frac{1296}{720}=1.8$, heading toward $40.8$."
  },
  "lb-lp-002": {
    "spot": "The $L^3$ norm is $\\left(\\int_0^1|f|^3dx\\right)^{1/3}$; $f=x$ is nonnegative on $[0,1]$, so just integrate $x^3$.",
    "why": "The definition is itself a power-function integral, and nothing is faster than computing it directly; the only thing to watch is the final $\\frac13$ power.",
    "steps": [
      "$\\int_0^1x^3dx=\\frac14$.",
      "Take the cube root: $\\|f\\|_3=\\left(\\frac14\\right)^{1/3}=4^{-1/3}\\approx0.630$.",
      "General $p$: $\\|x\\|_p=\\left(\\frac{1}{p+1}\\right)^{1/p}$; plugging in $p=3$ gives the same number."
    ],
    "trap": "Forgetting the $\\frac13$ power and answering $\\frac14$; or writing $\\left(\\int_0^1x\\,dx\\right)^3=\\frac18$.",
    "check": "$\\|f\\|_1=\\frac12<\\|f\\|_3\\approx0.63<\\|f\\|_\\infty=1$: the larger $p$ is, the closer to the maximum — the order is right."
  },
  "lec-03-q1d": {
    "spot": "The curve $x^2+xy+y^2=7$ is implicit and you need the second derivative: first get the numerical value of $y'$ by implicit differentiation, then differentiate again and immediately plug in $x=1,y=2$ — no need to simplify a general formula for $y''$.",
    "why": "The general second-order implicit formula is long and easy to miscopy; the earlier you plug in the point and the value of $y'$, the less arithmetic.",
    "steps": [
      "Differentiate in $x$: $2x+y+xy'+2yy'=0$, $y'=-\\frac{2x+y}{x+2y}$; at $(1,2)$, $y'=-\\frac45$.",
      "Differentiate in $x$ again ($y$ and $y'$ are both functions of $x$): $2+2y'+2(y')^2+(x+2y)y''=0$.",
      "Plug in $x=1$, $y=2$, $y'=-\\frac45$: $2-\\frac85+\\frac{32}{25}+5y''=0$, i.e. $\\frac{42}{25}+5y''=0$, so $y''=-\\frac{42}{125}$.",
      "Explicit check: solve for the branch through $(1,2)$, $y=\\frac{-x+\\sqrt{28-3x^2}}{2}$, differentiate twice and evaluate at $x=1$."
    ],
    "trap": "In the second differentiation, differentiating $(y^2)'=2yy'$ into just $2yy''$ and missing $2(y')^2$: you get $y''=-\\frac{2-\\frac85}{5}=-\\frac{2}{25}$.",
    "check": "The curve is an ellipse and $(1,2)$ is on its upper half, where the curve bends downward, so $y''<0$ makes sense."
  },
  "lec-05-q3d": {
    "spot": "For \"nearest point\", switch to the squared distance $D(x)=x^2+(x^2-a)^2$; the problem asks when the nearest point \"splits from the origin into a left and a right point\", i.e. when $x=0$ stops being the only critical point.",
    "why": "Squared distance has no square root and differentiates cleanly; the critical value is when the second factor of $D'(x)=2x(2x^2+1-2a)$ gets real roots.",
    "steps": [
      "$D'(x)=2x+4x(x^2-a)=2x(2x^2+1-2a)$ (checked with $a=0.8$).",
      "For $a\\le\\frac12$, $2x^2+1-2a>0$ ($x\\ne0$), so $D'$ has the sign of $x$ and $D$ is minimized at $x=0$: the nearest point is the origin. For example, at $a=\\frac12$, $D'=4x^3$.",
      "For $a>\\frac12$, there are new points $x=\\pm\\sqrt{a-\\frac12}$ where $D=a-\\frac14$, smaller than $D(0)=a^2$ (the difference is $(a-\\frac12)^2>0$). With $a=1$: $\\frac34<1$.",
      "So the critical value is $a_0=\\frac12$."
    ],
    "trap": "Writing the squared distance as just $(x^2-a)^2$, missing the horizontal part $x^2$, makes it look like the nearest point leaves the origin as soon as $a>0$, giving $a_0=0$.",
    "check": "The radius of curvature of the parabola $y=x^2$ at its vertex is $\\frac{(1+4x^2)^{3/2}}{2}\\Big|_{x=0}=\\frac12$: as long as $(0,a)$ hasn't passed the center of the osculating circle, the origin is the nearest point."
  },
  "lec-18-q4b": {
    "spot": "Objective $f=z$ with two constraints (the plane $x+y+z=1$ and the cylinder $x^2+y^2=2$); the third component of the gradient equation $(0,0,1)=\\lambda(1,1,1)+\\mu(2x,2y,0)$ directly gives $\\lambda=1$.",
    "why": "The two-multiplier system looks like five unknowns, but the third component eliminates $\\lambda$ first, and the first two immediately become symmetric, $x=y$ — one less layer of trig than parametrizing the ellipse and differentiating.",
    "steps": [
      "$\\nabla g=(1,1,1)$, $\\nabla h=(2x,2y,0)$; third component: $1=\\lambda\\cdot1+\\mu\\cdot0$, so $\\lambda=1$.",
      "First two components: $0=1+2\\mu x$, $0=1+2\\mu y$, so $x=y=-\\frac{1}{2\\mu}$.",
      "Substitute into the cylinder: $2x^2=2$, $x=y=\\pm1$; the plane gives $z=1-x-y$: $(1,1)$ gives $z=-1$, $(-1,-1)$ gives $z=3$.",
      "The maximum is $3$ (minimum $-1$)."
    ],
    "trap": "Using only the plane constraint: $\\nabla z=\\lambda(1,1,1)$ has no solution and you get stuck; or writing $z=1+x+y$ from the plane, which puts the maximum at $(1,1)$.",
    "check": "Parametrize $x=\\sqrt2\\cos t$, $y=\\sqrt2\\sin t$: $z=1-2\\sin(t+\\frac\\pi4)$, maximum $1+2=3$."
  },
  "lm-os-003": {
    "spot": "As $x\\to0^+$ the exponent $\\frac1x$ shoots to $+\\infty$, and the denominator $1+e^{1/x}$ blows up with it; the problem asks only for the right-hand limit.",
    "why": "For expressions with $e^{1/x}$, just decide which infinity $\\frac1x$ goes to, and you know whether the exponential blows up or vanishes — no L'Hôpital's Rule needed.",
    "steps": [
      "Let $u=\\frac1x$: $x\\to0^+$ corresponds to $u\\to+\\infty$, and the expression becomes $\\frac{1}{1+e^{u}}$.",
      "$e^u\\to\\infty$, so $\\frac{1}{1+e^u}\\to0$.",
      "The right-hand limit is $0$."
    ],
    "trap": "Not separating sides: as $x\\to0^-$, $e^{1/x}\\to0$ and the limit is $1$. Carrying the left result over and answering $1$, or answering \"does not exist\" because the sides differ — but the problem only asks for the right-hand limit.",
    "check": "$x=0.1$: $e^{10}\\approx22026$, so the value is about $0.000045$, already very close to $0$."
  },
  "lm-pr-002": {
    "spot": "Over a common denominator, the factor $1+\\frac{1}{n(n+2)}$ has numerator $n^2+2n+1=(n+1)^2$, so the whole factor becomes $\\frac{n+1}{n}\\cdot\\frac{n+1}{n+2}$ — two ratios of consecutive integers, which telescope.",
    "why": "For an infinite product, first try \"write each factor as a ratio of neighboring terms\"; the partial products cancel massively. Taking logs and summing a series is a detour.",
    "steps": [
      "$1+\\frac{1}{n(n+2)}=\\frac{(n+1)^2}{n(n+2)}=\\frac{n+1}{n}\\cdot\\frac{n+1}{n+2}$.",
      "$\\prod_{n=1}^N\\frac{n+1}{n}=N+1$, $\\prod_{n=1}^N\\frac{n+1}{n+2}=\\frac{2}{N+2}$, so the partial product is $P_N=\\frac{2(N+1)}{N+2}$. Check: $P_1=\\frac43$, and $P_N$ times the next factor is exactly $P_{N+1}$.",
      "$P_N=\\frac{2(N+1)}{N+2}\\to2$."
    ],
    "trap": "Thinking that since every factor exceeds $1$, infinitely many of them must diverge; in fact $\\sum\\frac{1}{n(n+2)}$ converges, so the product converges to a finite value.",
    "check": "The first two factors give $\\frac43\\cdot\\frac98=\\frac32$, the same as the formula $P_2=\\frac{2\\cdot3}{4}$."
  },
  "lm-pr-003": {
    "spot": "$1-\\frac{2}{n(n+1)}=\\frac{n^2+n-2}{n(n+1)}=\\frac{(n-1)(n+2)}{n(n+1)}$: numerator and denominator are both products of integers offset by one, so it telescopes.",
    "why": "Split the factor into two strands, $\\frac{n-1}{n}\\cdot\\frac{n+2}{n+1}$; each strand's partial product keeps only its ends — more direct than taking logs and estimating a series.",
    "steps": [
      "$1-\\frac{2}{n(n+1)}=\\frac{(n-1)(n+2)}{n(n+1)}=\\frac{n-1}{n}\\cdot\\frac{n+2}{n+1}$.",
      "From $n=2$ to $N$: $\\prod\\frac{n-1}{n}=\\frac1N$, $\\prod\\frac{n+2}{n+1}=\\frac{N+2}{3}$, so the partial product is $P_N=\\frac{N+2}{3N}$. Check: $P_2=\\frac23$, and multiplying by the next factor gives $P_{N+1}$.",
      "$P_N=\\frac{N+2}{3N}\\to\\frac13$."
    ],
    "trap": "Starting the product at $n=1$: the $n=1$ factor is $1-1=0$, making the whole product $0$; the problem starts at $n=2$ precisely to avoid it.",
    "check": "$P_3=\\frac23\\cdot\\frac56=\\frac59$, and the formula gives $\\frac{5}{9}$, consistent."
  },
  "lm-pr-005": {
    "spot": "The angle $\\frac{\\pi}{2^{n+1}}$ halves each time and every factor is a $\\cos$ — exactly a Viete-type product, built by repeated use of the double-angle formula $\\sin2\\theta=2\\sin\\theta\\cos\\theta$.",
    "why": "Multiply by the $\\sin$ of the smallest angle and the double-angle formula eats the whole chain of $\\cos$'s one by one — much faster than taking logs and summing a series.",
    "steps": [
      "$\\cos\\theta=\\frac{\\sin2\\theta}{2\\sin\\theta}$.",
      "Let $\\theta_n=\\frac{\\pi}{2^{n+1}}$, so $2\\theta_n=\\theta_{n-1}$; the partial product telescopes to $P_N=\\frac{\\sin\\frac\\pi2}{2^N\\sin\\frac{\\pi}{2^{N+1}}}=\\frac{1}{2^N\\sin\\frac{\\pi}{2^{N+1}}}$. Check: $P_1=\\cos\\frac\\pi4$, and $P_N$ times the next factor gives $P_{N+1}$.",
      "$u=\\frac{\\pi}{2^{N+1}}\\to0$ and $\\sin u\\approx u$, so $2^N\\sin\\frac{\\pi}{2^{N+1}}\\to\\frac\\pi2$.",
      "$P_N\\to\\frac{1}{\\pi/2}=\\frac2\\pi$."
    ],
    "trap": "Seeing that every factor is less than $1$ and saying the product tends to $0$; but $1-\\cos\\frac{\\pi}{2^{n+1}}\\approx\\frac{\\pi^2}{2\\cdot4^{n+1}}$ is summable, so the product settles at a positive number.",
    "check": "The first three factors give $0.7071\\cdot0.9239\\cdot0.9808\\approx0.641$, and $\\frac2\\pi\\approx0.637$, approached from above."
  },
  "lm-rc-005": {
    "spot": "The recursion $\\frac12\\left(a_n+\\frac{2}{a_n}\\right)$ is exactly Newton's method iteration $x-\\frac{x^2-2}{2x}$ for solving $x^2-2=0$, so the limit can only be $\\sqrt2$.",
    "why": "First prove it's monotonic and bounded so the limit exists, then plug $L$ into the recursion and solve; recognizing Newton's method also tells you it converges very fast.",
    "steps": [
      "Newton's method: $x-\\frac{x^2-2}{2x}=\\frac12\\left(x+\\frac2x\\right)$.",
      "AM-GM: $a_{n+1}-\\sqrt2=\\frac{(a_n-\\sqrt2)^2}{2a_n}\\ge0$; also $a_{n+1}-a_n=\\frac{2-a_n^2}{2a_n}\\le0$. Starting from $a_1=2$ it decreases and stays $\\ge\\sqrt2$, so it converges.",
      "The limit $L$ satisfies $L=\\frac12\\left(L+\\frac2L\\right)$, i.e. $L^2=2$; all terms are positive, so $L=\\sqrt2$."
    ],
    "trap": "Solving $L^2=2$ as $L=\\pm\\sqrt2$ without filtering; every term is above $\\sqrt2$, so the limit can't be $-\\sqrt2$.",
    "check": "$a_2=\\frac32$, $a_3=\\frac{17}{12}\\approx1.41667$, $a_4=\\frac{577}{408}\\approx1.414216$: the number of correct digits roughly doubles each step."
  },
  "lm-rs-012": {
    "spot": "The shape $\\frac1n\\sum_{k=1}^{n}f\\left(\\frac kn\\right)$: $\\frac1n$ is the width and $\\frac kn$ are the partition points of $[0,1]$ — a Riemann sum with $f(x)=\\frac{1}{1+x^3}$.",
    "why": "This kind of sum has no closed form; recognize the Riemann sum and switch to an integral. What remains is partial fractions for $\\frac{1}{1+x^3}$.",
    "steps": [
      "Limit $=\\int_0^1\\frac{dx}{1+x^3}$; $f$ decreases from $1$ to $\\frac12$, so the integral must lie between them.",
      "Partial fractions: $\\frac{1}{1+x^3}=\\frac{1/3}{1+x}+\\frac{-\\frac13x+\\frac23}{x^2-x+1}$.",
      "Antiderivative: $\\frac13\\ln(1+x)-\\frac16\\ln(x^2-x+1)+\\frac{1}{\\sqrt3}\\arctan\\frac{2x-1}{\\sqrt3}$.",
      "Evaluate from $0$ to $1$: $\\frac13\\ln2+\\frac{1}{\\sqrt3}\\left(\\frac\\pi6+\\frac\\pi6\\right)=\\frac{\\ln2}{3}+\\frac{\\pi}{3\\sqrt3}\\approx0.8356$."
    ],
    "trap": "Evaluating the arctangent only at the upper limit, $\\frac\\pi6$, and missing the lower limit's $-\\frac\\pi6$: you get $\\frac{\\ln2}{3}+\\frac{\\pi}{6\\sqrt3}\\approx0.533$.",
    "check": "The midpoint value is $f(\\frac12)=\\frac89\\approx0.889$, and $f$ falls from $1$ to $\\frac12$, first concave then convex; the integral $0.836$ lies between $\\frac12$ and $\\frac89$. Reasonable."
  },
  "lx-con-004": {
    "spot": "The denominator $x-2\\to0$, yet the problem says the limit exists: the numerator must also be $0$ at $x=2$, otherwise it's \"nonzero over zero\" and blows up.",
    "why": "\"Limit exists + denominator tends to $0$\" forces the numerator to vanish at that point; one equation solves for $a$, with no need for L'Hôpital's Rule first.",
    "steps": [
      "The numerator must vanish at $x=2$: $4+2a-10=0$, $a=3$.",
      "Then the numerator factors as $(x-2)(x+5)$, and the factor $x-2$ cancels.",
      "The limit $=\\lim_{x\\to2}(x+5)=7$ does exist, so $a=3$."
    ],
    "trap": "Confusing the limit value with $a$ and answering $7$; the problem asks for the $a$ that makes the limit exist.",
    "check": "Try a different $a$ (e.g. $a=2$): the numerator at $x=2$ is $-2\\ne0$, and the expression diverges as $x\\to2$, so $a=3$ is the only choice."
  },
  "refine-derivatives-035": {
    "spot": "You need the sixth derivative, but each time you differentiate $x^3\\ln x$, the power in front of $\\ln x$ drops by one; after four derivatives $\\ln x$ is gone, leaving just $\\frac6x$, and two more derivatives are a power-function job.",
    "why": "The Leibniz formula would need seven terms; differentiating until $\\ln x$ disappears leaves just derivatives of $\\frac{c}{x^k}$, much faster.",
    "steps": [
      "First: $(x^3\\ln x)'=3x^2\\ln x+x^2$.",
      "Second $6x\\ln x+5x$, third $6\\ln x+11$, fourth $\\frac6x$.",
      "Two more: $\\left(\\frac6x\\right)'=-\\frac{6}{x^2}$, $\\left(\\frac6x\\right)''=\\frac{12}{x^3}$.",
      "At $x=1$: $12$."
    ],
    "trap": "Getting the sign wrong in the last two derivatives: $\\left(\\frac6x\\right)''$ is $+\\frac{12}{x^3}$; writing $-\\frac{12}{x^3}$ gives $-12$.",
    "check": "The Leibniz formula at $x=1$: $(\\ln x)^{(m)}=\\frac{(-1)^{m-1}(m-1)!}{x^m}$, and only the terms with $k\\le3$ survive: $-120+6\\cdot3\\cdot24-15\\cdot6\\cdot6+20\\cdot6\\cdot2=12$."
  },
  "refine-derivatives-045": {
    "spot": "$f$ is an infinite product and you want $\\frac{f'}{f}$ — that's the logarithmic derivative: take $\\ln$ to turn the product into a sum, then differentiate term by term.",
    "why": "Applying the Product Rule directly to the product gives infinitely many terms; $\\frac{f'}{f}=(\\ln f)'$ turns each factor's contribution into a sum, and at $x=1$ it telescopes.",
    "steps": [
      "Take logs: $\\ln f(x)=\\sum_{n\\ge1}\\left[\\ln\\left(1+\\frac xn\\right)-\\frac xn\\right]$.",
      "Differentiate term by term: $\\frac{f'(x)}{f(x)}=\\sum_{n\\ge1}\\left(\\frac{1}{n+x}-\\frac1n\\right)$; each term is of order $\\frac{1}{n^2}$, so it converges.",
      "At $x=1$: $\\frac{1}{n+1}-\\frac1n$ telescopes, with partial sums $\\frac{1}{N+1}-1\\to-1$."
    ],
    "trap": "Dropping the contribution of the factor $e^{-x/n}$ leaves only $\\sum\\frac{1}{n+1}$, which looks divergent; it's precisely the $-\\frac1n$ term that makes it converge.",
    "check": "Numerically differentiating the series for $\\ln f$ at $x=1$ gives a result within one ten-thousandth of $-1$."
  },
  "refine-limits-061": {
    "spot": "The numerator is the central binomial coefficient $\\binom{2n}{n}$ and the denominator is $4^n$: $\\binom{2n}{n}$ is smaller than $4^n$ by a factor of $\\sqrt{\\pi n}$, which multiplying by $\\sqrt n$ exactly cancels — a textbook use of Stirling's formula.",
    "why": "The rough bound $\\binom{2n}{n}\\le4^n$ can't see the $\\frac{1}{\\sqrt{\\pi n}}$; replacing the three factorials with Stirling cancels the exponential parts completely, leaving only the polynomial correction.",
    "steps": [
      "Stirling: $n!\\approx\\sqrt{2\\pi n}\\left(\\frac ne\\right)^n$, with relative error about $\\frac{1}{12n}$ (e.g. $n=50$).",
      "Substitute: $\\binom{2n}{n}=\\frac{(2n)!}{(n!)^2}\\approx\\frac{\\sqrt{4\\pi n}\\,(2n/e)^{2n}}{2\\pi n\\,(n/e)^{2n}}=\\frac{4^n}{\\sqrt{\\pi n}}$.",
      "Another route (Wallis): $\\frac{\\binom{2n}{n}}{4^n}=\\frac2\\pi\\int_0^{\\pi/2}\\sin^{2n}x\\,dx$, and $\\sqrt m\\int_0^{\\pi/2}\\sin^mx\\,dx\\to\\sqrt{\\frac\\pi2}$.",
      "Multiply by $\\sqrt n$: $\\frac{\\sqrt n}{\\sqrt{\\pi n}}=\\frac{1}{\\sqrt\\pi}$; the Wallis route also gives $\\frac2\\pi\\cdot\\frac{\\sqrt{\\pi/2}}{\\sqrt2}=\\frac{1}{\\sqrt\\pi}$."
    ],
    "trap": "Using only a rough bound like $\\binom{2n}{n}\\le4^n$, the conclusion becomes \"$\\sqrt n\\cdot$ something bounded $\\to\\infty$\"; you can't afford to lose any of the correction factor $\\frac{1}{\\sqrt{\\pi n}}$.",
    "check": "$n=10$: $\\binom{20}{10}=184756$, $\\frac{\\sqrt{10}\\cdot184756}{4^{10}}\\approx0.5572$, slightly below $\\frac{1}{\\sqrt\\pi}\\approx0.5642$, a relative error of about $\\frac{1}{8n}$."
  },
  "refine-limits-062": {
    "spot": "Three Gamma functions with arguments $2n$, $n$, $n+\\frac12$, plus $4^n$: exactly the combination in Legendre's duplication formula $\\Gamma(n)\\Gamma(n+\\frac12)=2^{1-2n}\\sqrt\\pi\\,\\Gamma(2n)$ — the ratio doesn't depend on $n$ at all.",
    "why": "Stirling also works, but the duplication formula cancels $\\Gamma(2n)$ and $4^n$ completely in one step; you don't even need to take a limit.",
    "steps": [
      "Duplication formula at $n=1$: $\\Gamma(1)\\Gamma(\\frac32)=\\frac{\\sqrt\\pi}{2}=2^{-1}\\sqrt\\pi\\,\\Gamma(2)$.",
      "General $n$: $\\Gamma(n)\\Gamma(n+\\frac12)=2^{1-2n}\\sqrt\\pi\\,\\Gamma(2n)$ (checked for several $n$ using $\\Gamma(s)=\\int_0^\\infty t^{s-1}e^{-t}dt$).",
      "Substitute: ratio $=\\frac{\\Gamma(2n)}{4^n\\cdot2^{1-2n}\\sqrt\\pi\\,\\Gamma(2n)}=\\frac{1}{2\\sqrt\\pi}$, the same for every $n$.",
      "The limit of a constant sequence is that constant: $\\frac{1}{2\\sqrt\\pi}\\approx0.2821$."
    ],
    "trap": "Using Stirling but dropping the correction $\\Gamma(n+\\frac12)\\approx\\Gamma(n)\\sqrt n$, gaining or losing a $\\sqrt n$, and wrongly concluding the limit is $0$ or $\\infty$.",
    "check": "Compute directly at $n=1$: $\\frac{\\Gamma(2)}{4\\,\\Gamma(1)\\Gamma(\\frac32)}=\\frac{1}{4\\cdot\\frac{\\sqrt\\pi}{2}}=\\frac{1}{2\\sqrt\\pi}$."
  },
  "refine-limits-063": {
    "spot": "$a_{n+1}=\\frac{a_n}{1+a_n^2}$ makes $a_n$ decrease slowly to $0$, and the question is about $\\sqrt n\\,a_n$: look at $\\frac{1}{a_n^2}$ instead, which grows by about $2$ each step — a sequence whose differences tend to a constant calls for Stolz.",
    "why": "Estimating $a_n$ directly is hard; the difference of the inverse squares, $\\frac{1}{a_{n+1}^2}-\\frac{1}{a_n^2}=2+a_n^2\\to2$, immediately gives $\\frac{1}{a_n^2}\\sim2n$.",
    "steps": [
      "$a_n>0$ and $\\frac{a_n}{1+a_n^2}<a_n$, so it is decreasing and bounded below; the limit $L=\\frac{L}{1+L^2}$ can only be $0$.",
      "Inverse square: $\\frac{1}{a_{n+1}^2}=\\frac{(1+a_n^2)^2}{a_n^2}=\\frac{1}{a_n^2}+2+a_n^2$.",
      "$a_n\\to0$, so the difference $2+a_n^2\\to2$; Stolz: $\\frac{1/a_n^2}{n}\\to2$, i.e. $n\\,a_n^2\\to\\frac12$.",
      "$\\sqrt n\\,a_n\\to\\frac{1}{\\sqrt2}=\\frac{\\sqrt2}{2}$."
    ],
    "trap": "Seeing $a_{n+1}\\approx a_n-a_n^3$ and guessing $a_n\\sim\\frac1n$, concluding $\\sqrt n\\,a_n\\to0$; the actual decay is $\\frac{1}{\\sqrt{2n}}$, which only the inverse square reveals.",
    "check": "The continuous version $\\frac{da}{dn}=-a^3$ has solution $a=\\frac{1}{\\sqrt{2n+C}}$, which also gives $\\sqrt n\\,a\\to\\frac{1}{\\sqrt2}$."
  },
  "refine-limits-064": {
    "spot": "$x_{n+1}=x_n+\\frac{1}{x_n^2}$ makes $x_n$ grow slowly to infinity; the problem asks about $\\frac{x_n^3}{n}$, a hint to look at how much $x_n^3$ grows each step.",
    "why": "$x_{n+1}^3-x_n^3=3+\\frac{3}{x_n^3}+\\frac{1}{x_n^6}\\to3$; the differences tend to a constant, so Stolz gives the limit directly.",
    "steps": [
      "$x_n$ is increasing; if it were bounded, the limit $L$ would satisfy $L=L+\\frac{1}{L^2}$, impossible, so $x_n\\to\\infty$.",
      "Expand the cube: $x_{n+1}^3=x_n^3+3+\\frac{3}{x_n^3}+\\frac{1}{x_n^6}$.",
      "As $x_n\\to\\infty$ the difference $\\to3$.",
      "Stolz: $\\frac{x_n^3}{n}\\to3$."
    ],
    "trap": "Looking at the differences of $x_n$ itself, $\\frac{1}{x_n^2}\\to0$, or of its square, $\\frac{2}{x_n}+\\cdots\\to0$, won't reveal the growth rate; pick the power that makes the differences constant — here the cube.",
    "check": "The continuous version $\\frac{dx}{dn}=\\frac{1}{x^2}$ has solution $x^3=3n+C$, consistent."
  },
  "refine-limits-065": {
    "spot": "$\\int_0^{\\pi/2}\\sin^nx\\,dx$ is the Wallis integral, with recursion $I_n=\\frac{n-1}{n}I_{n-2}$; multiplied by $\\sqrt n$ and asked for a limit, look for a combination independent of $n$: $nI_nI_{n-1}=\\frac\\pi2$.",
    "why": "Estimating the integral directly needs Laplace's method; the invariant $nI_nI_{n-1}$ from the recursion plus a monotone squeeze needs no estimates at all.",
    "steps": [
      "Integration by parts: $I_n=\\frac{n-1}{n}I_{n-2}$.",
      "So $nI_nI_{n-1}=(n-1)I_{n-1}I_{n-2}$ is invariant and equals $1\\cdot I_1I_0=\\frac\\pi2$.",
      "$I_n$ is decreasing: $I_n\\le I_{n-1}\\le I_{n-2}=\\frac{n}{n-1}I_n$, which squeezes $\\frac{I_{n-1}}{I_n}\\to1$.",
      "So $nI_n^2\\to\\frac\\pi2$ and $\\sqrt n\\,I_n\\to\\sqrt{\\frac\\pi2}$."
    ],
    "trap": "Thinking $\\sin^nx\\to0$ (except at $x=\\frac\\pi2$) so the integral $\\to0$, and answering $0$: the integral does $\\to0$, but at rate $\\frac{1}{\\sqrt n}$, which the $\\sqrt n$ exactly cancels.",
    "check": "$n=4$: $I_4=\\frac{3\\pi}{16}$, $\\sqrt4\\cdot\\frac{3\\pi}{16}\\approx1.178$, below $\\sqrt{\\pi/2}\\approx1.253$; being low for small $n$ is normal."
  },
  "refine-limits-066": {
    "spot": "The integrand $\\frac{x^n}{1+x^n}$ is not $0$ only on a short stretch where $x$ is near $1$, of width about $\\frac1n$, and multiplying by $n$ scales it right back up — use $t=x^n$ to spread that stretch out.",
    "why": "The substitution $t=x^n$ makes $dx=\\frac1n t^{1/n-1}dt$, so the $n$ in front is absorbed automatically, leaving monotone convergence of $t^{1/n}\\to1$; estimating the integrand directly would need case splitting, which is a hassle.",
    "steps": [
      "$t=x^n$: $n\\int_0^1\\frac{x^n}{1+x^n}dx=\\int_0^1\\frac{t^{1/n}}{1+t}dt$ (checked with $n=5$).",
      "$t^{1/n}$ increases to $1$ on $[0,1]$, and the monotone convergence theorem lets the limit move inside the integral: limit $=\\int_0^1\\frac{dt}{1+t}$.",
      "$\\int_0^1\\frac{dt}{1+t}=\\ln2$."
    ],
    "trap": "Seeing only that the integrand $\\to0$ pointwise (for $x<1$) and saying the integral $\\to0$, so the whole limit is $0$: this ignores the factor $n$ in front.",
    "check": "$n=50$: numerically about $0.677$, short of $\\ln2\\approx0.693$ by about $\\frac{\\pi^2}{12n}\\approx0.016$."
  },
  "refine-limits-067": {
    "spot": "$\\sum_{k=1}^n\\frac{n}{n^2+k^2}=\\frac1n\\sum\\frac{1}{1+(k/n)^2}$ is the right-endpoint Riemann sum for $\\int_0^1\\frac{dx}{1+x^2}=\\frac\\pi4$; the problem wants the error times $n$, i.e. the first term of the Riemann-sum error.",
    "why": "The leading error term of a right-endpoint sum versus the integral is $\\frac{f(1)-f(0)}{2n}$ (compare with the trapezoid sum), so you only need $f$ at the two endpoints, not an expansion of the whole sum.",
    "steps": [
      "Rewrite: $\\frac{n}{n^2+k^2}=\\frac1n\\cdot\\frac{1}{1+(k/n)^2}$, with $f(x)=\\frac{1}{1+x^2}$.",
      "Integral: $\\int_0^1\\frac{dx}{1+x^2}=\\frac\\pi4$.",
      "Right-endpoint sum $R_n=T_n+\\frac{f(1)-f(0)}{2n}$, and the trapezoid sum $T_n=\\frac\\pi4+O\\left(\\frac{1}{n^2}\\right)$; $f(1)-f(0)=-\\frac12$, so $R_n=\\frac\\pi4-\\frac{1}{4n}+O\\left(\\frac{1}{n^2}\\right)$.",
      "$n\\left(\\frac\\pi4-R_n\\right)\\to\\frac14$."
    ],
    "trap": "Stopping at \"the Riemann sum $\\to\\frac\\pi4$\", saying the bracket $\\to0$, and answering $0$ after multiplying by $n$; or flipping the sign of the correction and answering $-\\frac14$ ($f$ is decreasing, so the right-endpoint sum is too small and the bracket is positive).",
    "check": "$n=2$: $R_2=\\frac25+\\frac28=0.65$, and $2\\left(\\frac\\pi4-0.65\\right)\\approx0.271$, already close to $0.25$."
  },
  "refine-limits-068": {
    "spot": "$\\sin n+\\cos n$ is a sine plus a cosine of the same frequency, which combine into $\\sqrt2\\sin\\left(n+\\frac\\pi4\\right)$; the lim sup asks for \"the largest value approached infinitely often\".",
    "why": "After combining, the upper bound $\\sqrt2$ is visible at a glance; all that's left is to explain why integers $n$ make $\\sin(n+\\frac\\pi4)$ close to $1$ infinitely often ($\\pi$ is irrational).",
    "steps": [
      "Combine: $\\sin x+\\cos x=\\sqrt2\\sin\\left(x+\\frac\\pi4\\right)$.",
      "So every term is $\\le\\sqrt2$, with equality only when $x+\\frac\\pi4=\\frac\\pi2+2k\\pi$.",
      "$\\pi$ is irrational, so $n\\bmod2\\pi$ is dense in $[0,2\\pi)$: infinitely many integers $n$ fall in any small neighborhood of $\\frac\\pi4+2k\\pi$, and those terms get arbitrarily close to $\\sqrt2$. For example, $n=7$ already reaches $1.411$.",
      "The lim sup is $\\sqrt2$."
    ],
    "trap": "Thinking the lim sups of $\\sin n$ and $\\cos n$ are each $1$ and answering $2$; the two can't both be near $1$ at the same time.",
    "check": "$n=7$: $\\sin7+\\cos7\\approx1.411$, very close to $\\sqrt2\\approx1.414$, and it never exceeds it."
  },
  "refine-limits-069": {
    "spot": "$\\sqrt{n^2+n}$ is very close to $n+\\frac12$; and $\\sin^2$ has period $\\pi$, so you can first subtract $n\\pi$ from the angle and look only at $\\pi\\left(\\sqrt{n^2+n}-n\\right)$.",
    "why": "The angle itself goes to infinity, which shows nothing about the limit; after subtracting $n\\pi$ using periodicity, what's left is an \"$\\infty-\\infty$\" that rationalizing handles.",
    "steps": [
      "Periodicity: $\\sin^2(\\theta-n\\pi)=\\sin^2\\theta$, so $\\sin^2\\left(\\pi\\sqrt{n^2+n}\\right)=\\sin^2\\left(\\pi(\\sqrt{n^2+n}-n)\\right)$.",
      "Rationalize: $\\sqrt{n^2+n}-n=\\frac{n}{\\sqrt{n^2+n}+n}\\to\\frac12$.",
      "Limit $=\\sin^2\\frac\\pi2=1$."
    ],
    "trap": "Treating $\\sqrt{n^2+n}$ as $n$, thinking it's $\\sin^2(n\\pi)=0$, and answering $0$; this ignores the difference that tends to $\\frac12$.",
    "check": "Try $n=100$: $\\sqrt{10100}-100\\approx0.49876$, very close to one half, and $\\sin^2(0.49876\\pi)\\approx0.99998$."
  },
  "refine-limits-071": {
    "spot": "The base $\\frac{n+2^{1/n}}{n+3^{1/n}}\\to1$ and the exponent is $n^2$: a $1^\\infty$ form. Numerator and denominator differ only by $2^{1/n}-3^{1/n}\\approx\\frac{\\ln2-\\ln3}{n}$; dividing by $n$ again makes it order $\\frac{1}{n^2}$, exactly matching the exponent $n^2$.",
    "why": "After taking logs, $\\ln(1+u)\\approx u$ turns the log difference into $\\frac{2^{1/n}-3^{1/n}}{n}$, and $a^{1/n}\\approx1+\\frac{\\ln a}{n}$ reads off the leading term.",
    "steps": [
      "Take logs: $n^2\\ln\\frac{n+2^{1/n}}{n+3^{1/n}}=n^2\\left[\\ln\\left(1+\\frac{2^{1/n}}{n}\\right)-\\ln\\left(1+\\frac{3^{1/n}}{n}\\right)\\right]$.",
      "$\\ln(1+u)-\\ln(1+v)=(u-v)+O(u^2-v^2)$; $u-v=\\frac{2^{1/n}-3^{1/n}}{n}$, while $u^2-v^2$ is of order $\\frac{1}{n^3}$. The main term is $n^2(u-v)=n\\left(2^{1/n}-3^{1/n}\\right)\\to\\ln2-\\ln3$.",
      "So the log $\\to\\ln\\frac23$.",
      "Limit $=e^{\\ln(2/3)}=\\frac23$."
    ],
    "trap": "Treating both $2^{1/n}$ and $3^{1/n}$ as $1$, so the base is $1$, and answering $1$; the difference is small, but times the exponent $n^2$ it's a finite value.",
    "check": "Computing directly at $n=20$ already gives a value between $0.65$ and $0.68$."
  },
  "refine-limits-072": {
    "spot": "$\\sin x$ is increasing near $\\frac\\pi6$, and $|\\sin x-\\frac12|<0.1$ means $0.4<\\sin x<0.6$; the interval you get from $\\arcsin$ is not symmetric, so $\\delta$ must be the distance to the nearer side of $\\frac\\pi6$.",
    "why": "Finding the largest $\\delta$ means solving the inequality, measuring both sides, and taking the smaller; the derivative estimate $\\frac{0.1}{\\cos(\\pi/6)}$ is only an approximation, not the maximum.",
    "steps": [
      "$\\sin x$ is increasing on $(0,\\frac\\pi2)$: $0.4<\\sin x<0.6\\iff\\arcsin0.4<x<\\arcsin0.6$.",
      "Distance on the left: $\\frac\\pi6-\\arcsin0.4\\approx0.11208$; on the right: $\\arcsin0.6-\\frac\\pi6\\approx0.11990$.",
      "Take the smaller: $\\delta_{\\max}=\\frac\\pi6-\\arcsin0.4$."
    ],
    "trap": "Using the tangent-line approximation $\\delta\\approx\\frac{0.1}{\\cos(\\pi/6)}=\\frac{0.2}{\\sqrt3}\\approx0.1155$: bigger than the $0.1121$ allowed on the left, so some $x$ on the left would have error above $0.1$.",
    "check": "At $x=\\frac\\pi6-\\delta$, $\\sin x$ is exactly $0.4$ (the boundary); any bigger and it's out."
  },
  "refine-series-035": {
    "spot": "The generating function of the Catalan numbers has the closed form $C(x)=\\frac{1-\\sqrt{1-4x}}{2x}$; $\\sum\\frac{C_n}{5^n}$ is just $C\\left(\\frac15\\right)$, and $\\frac15<\\frac14$ is inside the radius of convergence.",
    "why": "Adding Catalan numbers directly is slow; the generating function satisfies $xC^2-C+1=0$, so evaluating at a point only needs a quadratic equation, then picking the right root.",
    "steps": [
      "The recursion $C_{n+1}=\\sum_{k=0}^{n}C_kC_{n-k}$ gives $C(x)=1+xC(x)^2$. $C(x)=\\frac{1-\\sqrt{1-4x}}{2x}$ is indeed a root (checked at $x=\\frac15$).",
      "Of the two roots, $\\frac{1+\\sqrt{1-4x}}{2x}$ blows up as $x\\to0$; $C(0)=C_0=1$, so take the one with the minus sign.",
      "$C_n\\sim\\frac{4^n}{\\sqrt\\pi\\,n^{3/2}}$, so the radius of convergence is $\\frac14$ and $x=\\frac15$ is inside.",
      "$C\\left(\\frac15\\right)=\\frac{1-\\sqrt{1/5}}{2/5}=\\frac52\\left(1-\\frac{1}{\\sqrt5}\\right)=\\frac{5-\\sqrt5}{2}\\approx1.382$."
    ],
    "trap": "Taking the wrong root $\\frac{1+\\sqrt{1-4x}}{2x}$ gives $\\frac{5+\\sqrt5}{2}\\approx3.618$; it blows up as $x\\to0$, so it can't be $C(x)$.",
    "check": "The first six terms $1+\\frac15+\\frac{2}{25}+\\frac{5}{125}+\\frac{14}{625}+\\frac{42}{3125}\\approx1.356$, and the tail is positive, so the answer $1.382$ is reasonable."
  },
  "sg-est-008": {
    "spot": "$\\sin x-\\left(x-\\frac{x^3}{6}\\right)$ is the actual error of the third-degree Taylor polynomial of $\\sin$; it is positive and increasing on $[0,1]$, so the maximum is at the right endpoint $x=1$.",
    "why": "The problem asks for the actual maximum error, not a remainder bound; prove the error function is monotonic and the endpoint value is the answer, with no interior critical points to find.",
    "steps": [
      "Let $g(x)=\\sin x-x+\\frac{x^3}{6}$; $g'(x)=\\cos x-1+\\frac{x^2}{2}$, $g'(0)=0$.",
      "$g''(x)=x-\\sin x\\ge0$, so $g'\\ge0$ and $g$ is increasing; also $g(0)=0$, so $g\\ge0$ and its absolute value is $g$ itself.",
      "Maximum $g(1)=\\sin1-\\frac56\\approx0.00814$."
    ],
    "trap": "Giving the Lagrange remainder bound $\\frac{1}{5!}=\\frac{1}{120}\\approx0.00833$ as the answer; that's an upper bound, not the actual maximum.",
    "check": "$0.00814$ is slightly less than the next term $\\frac{x^5}{120}$ at $x=1$, which is $0.00833$; an alternating series' error is always smaller than the next term."
  },
  "sg-est-009": {
    "spot": "$e^x-\\left(1+x+\\frac{x^2}{2}\\right)$ is the error of the second-degree Taylor polynomial; the remaining terms $\\frac{x^3}{6}+\\frac{x^4}{24}+\\cdots$ are all positive and increasing for $x\\ge0$, so the maximum is at $x=1$.",
    "why": "When the error function is monotonic, the endpoint value is the answer; the remainder bound $\\frac{e}{6}$ would overestimate by more than double.",
    "steps": [
      "$g(x)=e^x-1-x-\\frac{x^2}{2}$, $g'(x)=e^x-1-x\\ge0$, and $g(0)=0$: $g$ is nonnegative and increasing on $[0,1]$.",
      "The maximum is at the right endpoint: $g(1)$.",
      "$g(1)=e-\\frac52\\approx0.2183$."
    ],
    "trap": "Answering with the Lagrange remainder bound $\\frac{e}{3!}\\approx0.453$: that's only an upper bound; the problem wants the actual maximum error.",
    "check": "The error is exactly $\\frac1{3!}+\\frac1{4!}+\\frac1{5!}+\\cdots$: the first three terms already give $0.2167$, and the rest is under $0.002$."
  },
  "tr-bnd-004": {
    "spot": "The problem specifies the Lagrange remainder; a second-degree polynomial needs the third derivative $f'''(x)=\\frac{2}{(1+x)^3}$, which decreases on $[0,\\frac12]$, so its maximum is at the left end $x=0$.",
    "why": "The error bound $\\frac{M}{3!}|x|^3$ only needs $M$; checking the monotonicity of $|f'''|$ first lets you take an endpoint directly, with no separate extremum hunt.",
    "steps": [
      "$f'(x)=\\frac{1}{1+x}$; differentiate twice more: $f'''(x)=\\frac{2}{(1+x)^3}$.",
      "$\\frac{2}{(1+x)^3}$ decreases in $x$, so $M=f'''(0)=2$.",
      "Bound $=\\frac{M}{3!}\\left(\\frac12\\right)^3=\\frac{2}{6}\\cdot\\frac18=\\frac{1}{24}$."
    ],
    "trap": "Taking $M$ as the value at the right end $x=\\frac12$, $\\frac{16}{27}$, gives $\\frac{1}{81}\\approx0.0123$, which is even smaller than the actual error $0.0305$ — not an upper bound at all.",
    "check": "The actual error $\\ln1.5-\\left(\\frac12-\\frac18\\right)\\approx0.0305$ is indeed less than $\\frac1{24}\\approx0.0417$."
  },
  "tr-bnd-006": {
    "spot": "Second-degree Taylor polynomial of $\\cos x$, estimated with the third derivative as specified: $f'''(x)=\\sin x$ increases on $[0,0.3]$, so $M=\\sin0.3$, not the crude $1$.",
    "why": "On a small interval, using the actual maximum for $M$ makes the bound much tighter; $M=1$ is also valid but more than three times looser.",
    "steps": [
      "$f'(x)=-\\sin x$; differentiate twice more: $f'''(x)=\\sin x$.",
      "$\\sin x$ increases on $[0,0.3]$ (derivative $\\cos x>0$), so $M=\\sin0.3\\approx0.2955$.",
      "Bound $=\\frac{M}{3!}(0.3)^3=\\sin0.3\\cdot\\frac{0.027}{6}=\\sin0.3\\cdot\\frac{9}{2000}\\approx0.00133$."
    ],
    "trap": "Habitually taking $M=1$ gives $\\frac{0.027}{6}=0.0045$: still an upper bound, but not the \"maximum\" the problem specifies; or writing $(0.3)^3$ as $(0.3)^2$.",
    "check": "The actual error $\\cos0.3-(1-0.045)\\approx0.000336$ falls within the bound $0.00133$."
  },
  "tr-bnd-007": {
    "spot": "The first-degree Taylor polynomial of $\\sqrt{1+x}$ is the linear approximation $1+\\frac x2$; the remainder uses $f''(x)=-\\frac14(1+x)^{-3/2}$, whose absolute value decreases in $x$, with maximum at $x=0$.",
    "why": "The error bound $\\frac{M}{2!}x^2$ only needs $M$; once you see $|f''|$ is decreasing, take the left endpoint directly.",
    "steps": [
      "$f''(x)=-\\frac14(1+x)^{-3/2}$.",
      "$|f''|$ is decreasing, so $M=|f''(0)|=\\frac14$.",
      "Bound $=\\frac{M}{2!}(0.2)^2=\\frac{1/4}{2}\\cdot0.04=0.005=\\frac{1}{200}$."
    ],
    "trap": "Using $|f''|=\\frac14(1.2)^{-3/2}\\approx0.190$ at the right end $x=0.2$ gives $0.0038$: smaller than the actual error $0.00455$, so not an upper bound.",
    "check": "The actual error $1.1-\\sqrt{1.2}\\approx0.00455$ is within $0.005$, and quite close to it."
  },
  "tr-bnd-008": {
    "spot": "The fourth derivative of $\\frac{1}{1-x}$, $\\frac{24}{(1-x)^5}$, increases on $[0,0.2]$ (it grows as you approach the singularity $x=1$), so $M$ must be taken at the right end $x=0.2$.",
    "why": "The $M$ in the error bound goes where $|f^{(4)}|$ is largest; here the derivative grows to the right — the opposite of the common \"largest at the left end\".",
    "steps": [
      "$f''(x)=\\frac{2}{(1-x)^3}$; differentiate twice more: $f^{(4)}(x)=\\frac{24}{(1-x)^5}$.",
      "Increasing, so $M=\\frac{24}{0.8^5}\\approx73.24$.",
      "Bound $=\\frac{M}{4!}(0.2)^4=\\frac{0.0016}{0.8^5}=\\frac{5}{1024}\\approx0.00488$."
    ],
    "trap": "Habitually taking $M=24$ at $x=0$ makes the bound $0.2^4=0.0016$, smaller than the actual error $0.002$, so not an upper bound.",
    "check": "The actual error $\\frac{1}{0.8}-(1+0.2+0.04+0.008)=0.002$ is within the bound $0.00488$."
  },
  "tr-err-006": {
    "spot": "The interval $[-\\frac12,\\frac12]$ is symmetric, but the error $e^x-T_2(x)\\approx\\frac{x^3}{6}$ has an odd leading term, so it is negative at one end and positive at the other, with different sizes; compare the two endpoints for the maximum absolute value.",
    "why": "The error function $g$ has derivative $e^x-1-x\\ge0$, so $g$ is monotonic and the maximum absolute value must be at an endpoint — just compare two numbers.",
    "steps": [
      "$g(x)=e^x-1-x-\\frac{x^2}{2}$, $g'(x)=e^x-1-x\\ge0$, $g(0)=0$: $g$ is increasing, negative on the left and positive on the right.",
      "Left end: $|g(-\\frac12)|=\\frac58-e^{-1/2}\\approx0.01847$.",
      "Right end: $g(\\frac12)=e^{1/2}-\\frac{13}{8}\\approx0.02372$.",
      "The right end is larger, so the maximum error $=e^{1/2}-\\frac{13}{8}$."
    ],
    "trap": "Assuming a symmetric interval gives a symmetric error and computing only the left end, answering $\\frac58-e^{-1/2}$; or just using the leading term $\\frac{(1/2)^3}{6}\\approx0.0208$ as the answer.",
    "check": "The leading term $\\frac{x^3}{6}=0.0208$ sits between the two ends: the right end gets an extra positive $\\frac{x^4}{24}$, which cancels some of the left end, so right is bigger than left."
  },
  "tr-err-007": {
    "spot": "You want the actual error, not a bound: subtract the value of the second-degree polynomial $1+\\frac x2-\\frac{x^2}{8}$ at $x=0.2$ directly from $\\sqrt{1.2}$.",
    "why": "The actual error needs only two numbers, the true value and the approximation; the remainder bound would only give a larger upper bound.",
    "steps": [
      "Coefficients: $f'(0)=\\frac12$, $f''(0)=-\\frac14$; dividing by $2!$ gives $T_2(x)=1+\\frac x2-\\frac{x^2}{8}$.",
      "$T_2(0.2)=1+0.1-0.005=1.095=\\frac{219}{200}$.",
      "Actual error $=\\sqrt{1.2}-1.095=\\sqrt{\\frac65}-\\frac{219}{200}\\approx0.000445$."
    ],
    "trap": "Forgetting to divide the quadratic term by $2!$ and using $-\\frac{x^2}{4}$: $T_2(0.2)=1.09$, and the error becomes about $0.0054$.",
    "check": "The next term $\\frac{x^3}{16}=0.0005$ is the same order as the actual error $0.000445$, and slightly larger — reasonable."
  },
  "tr-err-008": {
    "spot": "$\\arctan x=x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\cdots$, so the third-degree Taylor polynomial is $x-\\frac{x^3}{3}$; the actual error is the true value minus the polynomial's value.",
    "why": "The series coefficients come straight from integrating the geometric series for $\\frac{1}{1+x^2}$, no repeated differentiation needed; the actual error takes only two numbers.",
    "steps": [
      "$\\frac{d}{dx}\\arctan x=\\frac{1}{1+x^2}=\\sum(-1)^nx^{2n}$; integrating term by term gives $\\arctan x=\\sum\\frac{(-1)^nx^{2n+1}}{2n+1}$ (checked at $x=\\frac12$).",
      "$T_3(\\frac12)=\\frac12-\\frac{1}{24}=\\frac{11}{24}\\approx0.458333$.",
      "Actual error $=\\arctan\\frac12-\\frac{11}{24}\\approx0.005314$."
    ],
    "trap": "Reading \"third degree\" as three nonzero terms $x-\\frac{x^3}{3}+\\frac{x^5}{5}$, making the error about $0.00094$ (and of the opposite sign); third degree means up to the power $x^3$.",
    "check": "Alternating series: the error is between $0$ and the next term $\\frac{(1/2)^5}{5}=0.00625$."
  },
  "tr-num-002": {
    "spot": "Every derivative of $e^x$ is $e^x$, whose maximum on $[0,1]$ is $e$; for the error bound $\\frac{e}{(n+1)!}$ just check when the factorial exceeds $e\\times10^4$.",
    "why": "The Lagrange remainder turns the error over the whole interval into one number depending only on $n$; trying $n$ one by one is simpler than finding the worst $x$.",
    "steps": [
      "$|R_n(x)|\\le\\frac{e\\cdot1^{n+1}}{(n+1)!}$, worst at $x=1$.",
      "$n=6$: $\\frac{e}{7!}=\\frac{e}{5040}\\approx0.00054$, not enough; the actual error at $x=1$ is also $0.000226$, so it really isn't enough.",
      "$n=7$: $\\frac{e}{8!}=\\frac{e}{40320}\\approx0.000067<10^{-4}$.",
      "Smallest degree $n=7$."
    ],
    "trap": "Writing the denominator of the error bound as $n!$ instead of $(n+1)!$: you'd think the bound at $n=7$, $\\frac{e}{5040}\\approx0.00054$, is still not enough, and go one more degree to answer $8$.",
    "check": "For $n=7$ the actual error at $x=1$ is about $0.000028$, far below $10^{-4}$."
  },
  "tr-num-004": {
    "spot": "All derivatives of $\\cos x$ have absolute value $\\le1$, and the right end of the interval, $\\frac\\pi4\\approx0.785$, is less than $1$, so the error bound $\\frac{(\\pi/4)^{n+1}}{(n+1)!}$ drops fast.",
    "why": "The derivatives share the common bound $1$, so the remainder bound is just a power over a factorial; try $n$ one by one, with no need to maximize each derivative.",
    "steps": [
      "$|R_n(x)|\\le\\frac{(\\pi/4)^{n+1}}{(n+1)!}$, worst at the right end $x=\\frac\\pi4$.",
      "$n=5$: $\\frac{(\\pi/4)^6}{720}\\approx0.00033$, not enough. $\\cos$ has no odd terms, so $T_5=T_4$, and the actual error at $\\frac\\pi4$ is also $0.00032$.",
      "$n=6$: $\\frac{(\\pi/4)^7}{5040}\\approx0.000037<10^{-4}$.",
      "Smallest degree $n=6$."
    ],
    "trap": "Taking the right end of the interval as $1$ and testing $\\frac{1}{(n+1)!}<10^{-4}$: at $n=6$, $\\frac{1}{5040}$ is still not enough, so you answer $7$.",
    "check": "The actual error of $T_6(\\frac\\pi4)$ is only about $0.0000036$, comfortably passing."
  },
  "tr-num-006": {
    "spot": "The series $\\sum\\frac{(-1)^{k+1}x^k}{k}$ for $\\ln(1+x)$ at $x=\\frac12$ is alternating and decreasing, so the error is less than the next term; but the problem asks about the actual error, so the borderline degree has to be actually computed.",
    "why": "The next term $\\frac{(1/2)^{n+1}}{n+1}$ is only an upper bound, and at $n=6$ it is just slightly above $10^{-3}$; only the actual difference between the true value and the polynomial decides it correctly.",
    "steps": [
      "$\\ln(1+x)=\\sum_{k\\ge1}\\frac{(-1)^{k+1}x^k}{k}$; at $x=\\frac12$ it converges to $\\ln1.5$.",
      "$n=5$: $T_5(\\frac12)=\\frac12-\\frac18+\\frac1{24}-\\frac1{64}+\\frac1{160}\\approx0.40729$, actual error about $0.00183>10^{-3}$.",
      "$n=6$: subtract $\\frac{1}{384}$ more, $T_6(\\frac12)\\approx0.40469$, actual error about $0.00078<10^{-3}$.",
      "Smallest degree $n=6$."
    ],
    "trap": "Using only the next term $\\frac{(1/2)^7}{7}\\approx0.00112$ as the criterion, you'd think $n=6$ isn't enough and answer $7$; the problem asks about the actual error, which at $n=6$ is only $0.00078$.",
    "check": "An alternating series' error is less than the next term: at $n=6$ the error $0.00078$ is indeed less than $0.00112$."
  },
  "ch-nest-015": {
    "spot": "The outer layer is $\\cos$, and inside, $(\\ln x)^x$ has $x$ in both base and exponent — neither the power rule nor the exponential rule applies; first rewrite as $e^{x\\ln(\\ln x)}$ or take logs.",
    "why": "Variable base and variable exponent always means take logs, then differentiate; forcing $(u^n)'=nu^{n-1}u'$ misses the half where the exponent changes.",
    "steps": [
      "Let $u=(\\ln x)^x=e^{x\\ln(\\ln x)}$ ($x>1$).",
      "$\\ln u=x\\ln(\\ln x)$; Product Rule: $\\frac{u'}{u}=\\ln(\\ln x)+x\\cdot\\frac{1}{\\ln x}\\cdot\\frac1x=\\ln(\\ln x)+\\frac{1}{\\ln x}$.",
      "So $u'=(\\ln x)^x\\left(\\ln(\\ln x)+\\frac{1}{\\ln x}\\right)$.",
      "Chain Rule for the outer layer: $\\frac{d}{dx}\\cos u=-\\sin u\\cdot u'=-\\sin\\left((\\ln x)^x\\right)(\\ln x)^x\\left(\\ln(\\ln x)+\\frac{1}{\\ln x}\\right)$."
    ],
    "trap": "Treating $(\\ln x)^x$ as a power function and writing $x(\\ln x)^{x-1}\\cdot\\frac1x$: only the $\\frac{1}{\\ln x}$ term remains, and $\\ln(\\ln x)$ is lost.",
    "check": "At $x=e$: $\\ln x=1$, so $u=1$, $u'=0+1=1$, and the derivative $=-\\sin1\\approx-0.841$."
  },
  "ch-pow-010": {
    "spot": "The base $\\sin(x^2)$ and the exponent $\\cos x$ both vary with $x$ — logarithmic differentiation; and the base contains $x^2$, so after taking logs you need the Chain Rule once more.",
    "why": "Variable base with variable exponent can only be handled by taking logs (or writing it as $e^{\\cos x\\ln\\sin(x^2)}$); the power rule and the exponential rule each cover only half.",
    "steps": [
      "Take logs: $\\ln y=\\cos x\\cdot\\ln\\sin(x^2)$.",
      "Inner part: $\\frac{d}{dx}\\ln\\sin(x^2)=\\frac{\\cos(x^2)\\cdot2x}{\\sin(x^2)}$.",
      "Product Rule: $\\frac{y'}{y}=-\\sin x\\ln\\sin(x^2)+\\cos x\\cdot\\frac{2x\\cos(x^2)}{\\sin(x^2)}$.",
      "Multiply back by $y$: $y'=(\\sin x^2)^{\\cos x}\\left(-\\sin x\\ln\\sin(x^2)+\\frac{2x\\cos x\\cos(x^2)}{\\sin(x^2)}\\right)$."
    ],
    "trap": "Missing the inner $2x$ of $\\sin(x^2)$ and writing $\\frac{\\cos(x^2)}{\\sin(x^2)}$; or using only the power rule to get $\\cos x(\\sin x^2)^{\\cos x-1}\\cdot2x\\cos x^2$, which misses the term from the changing exponent.",
    "check": "At $x=\\sqrt{\\pi/2}$, $\\sin(x^2)=1$ is the maximum of the base: the $\\ln$ term and $\\cos(x^2)$ are both $0$, so the derivative is $0$ — reasonable."
  },
  "cl-lim-008": {
    "spot": "Both sides start with $x$: $\\sin(\\sin x)\\approx x$ and $x\\sqrt[3]{1-x^2}\\approx x$, so you need the first term of the difference that doesn't cancel — Taylor-expand both sides to $x^5$.",
    "why": "L'Hôpital's Rule would need five derivatives; with the Taylor expansions lined up side by side, you see right away which order differs first.",
    "steps": [
      "$\\sin(\\sin x)=\\sin x-\\frac{\\sin^3x}{6}+\\frac{\\sin^5x}{120}-\\cdots=x-\\frac{x^3}{3}+\\frac{x^5}{10}+O(x^7)$.",
      "$x(1-x^2)^{1/3}=x\\left(1-\\frac{x^2}{3}-\\frac{x^4}{9}-\\cdots\\right)=x-\\frac{x^3}{3}-\\frac{x^5}{9}+O(x^7)$.",
      "Subtract: the $x$ and $x^3$ terms cancel, and the $x^5$ coefficient is $\\frac1{10}+\\frac19=\\frac{19}{90}\\ne0$.",
      "So $k=5$ (with $c=\\frac{19}{90}$)."
    ],
    "trap": "Expanding only to $x^3$, seeing $x-\\frac{x^3}{3}$ on both sides, stopping, and answering $k=3$; equal $x^3$ coefficients mean you must expand further.",
    "check": "$x=0.1$: the difference divided by $0.1^5$ is about $0.211$, matching $\\frac{19}{90}\\approx0.2111$."
  },
  "cl-lim-037": {
    "spot": "$x_{n+1}=\\ln(1+x_n)$ makes $x_n$ decrease slowly to $0$ (since $\\ln(1+x)<x$), and the question is about $n\\,x_n$ — look at how much $\\frac{1}{x_n}$ grows each step.",
    "why": "$\\frac{1}{\\ln(1+x)}-\\frac1x\\to\\frac12$, so the differences of the reciprocals tend to a constant, and Stolz directly gives $\\frac{1}{n x_n}\\to\\frac12$.",
    "steps": [
      "For $x>0$, $\\ln(1+x)<x$: $x_n$ is decreasing and bounded below by $0$; the limit $L=\\ln(1+L)$ can only be $0$.",
      "$\\ln(1+x)=x-\\frac{x^2}{2}+\\cdots$, so $\\frac{1}{\\ln(1+x)}-\\frac1x\\to\\frac12$, i.e. $\\frac{1}{x_{n+1}}-\\frac{1}{x_n}\\to\\frac12$.",
      "Stolz: $\\frac{1/x_n}{n}\\to\\frac12$, so $n\\,x_n\\to2$."
    ],
    "trap": "Looking at the differences of $x_n$ itself, $x_n-\\ln(1+x_n)\\approx\\frac{x_n^2}{2}\\to0$, tells you nothing about the rate, or you guess $1$ by feel; switch to the reciprocal, whose differences are constant.",
    "check": "The continuous version $\\frac{dx}{dn}=-\\frac{x^2}{2}$ has solution $x=\\frac{2}{n+C}$, which also gives $n\\,x\\to2$."
  },
  "cl-lim-047": {
    "spot": "For large $n$, $(1-x^2)^n$ is not $0$ only near $x=0$, with width about $\\frac{1}{\\sqrt n}$ — exactly scaled back up by the $\\sqrt n$ in front; and $(1-x^2)^n\\approx e^{-nx^2}$, so after substitution it's a Gaussian integral.",
    "why": "Rescale the main region to normal size with $t=\\sqrt n\\,x$ and the integrand converges to $e^{-t^2}$; the Beta function also works but then needs Gamma asymptotics.",
    "steps": [
      "Substitute $t=\\sqrt n\\,x$: $\\sqrt n\\int_0^1(1-x^2)^ndx=\\int_0^{\\sqrt n}\\left(1-\\frac{t^2}{n}\\right)^ndt$ (checked with $n=9$).",
      "$\\left(1-\\frac{t^2}{n}\\right)^n\\le e^{-t^2}$, and it $\\to e^{-t^2}$ pointwise; dominated convergence moves the limit inside the integral.",
      "Limit $=\\int_0^\\infty e^{-t^2}dt=\\frac{\\sqrt\\pi}{2}$."
    ],
    "trap": "Seeing $(1-x^2)^n\\to0$ (for $x>0$) and answering $0$; or linearizing $(1-x^2)^n$ as $1-nx^2$, which only holds when $x$ is much smaller than $\\frac{1}{\\sqrt n}$.",
    "check": "At $n=100$ the exact value $\\sqrt{100}\\cdot\\frac{(200)!!}{(201)!!}\\approx0.8829$ is already close to $\\frac{\\sqrt\\pi}{2}\\approx0.8862$."
  },
  "cl-ser-016": {
    "spot": "The numerator is the harmonic number $H_n$ and the denominator is $n2^n$: $\\sum H_nx^n=-\\frac{\\ln(1-x)}{1-x}$ is a known generating function, and dividing by $x$ then integrating produces the $\\frac1n$ — you need $\\sum\\frac{H_n}{n}x^n$ at $x=\\frac12$.",
    "why": "Series with harmonic numbers are almost always handled by generating functions; after integrating, the dilogarithm $\\mathrm{Li}_2$ appears, and $x=\\frac12$ is exactly a special point where it has a closed form.",
    "steps": [
      "$\\sum_{n\\ge1}H_nx^n=\\frac{1}{1-x}\\sum_{n\\ge1}\\frac{x^n}{n}=-\\frac{\\ln(1-x)}{1-x}$; at $x=\\frac12$ this is $2\\ln2$ ($H_n=\\int_0^1\\frac{1-t^n}{1-t}dt$).",
      "Divide by $x$ and integrate from $0$ to $x$: $\\sum\\frac{H_n}{n}x^n=\\int_0^x\\frac{-\\ln(1-t)}{t(1-t)}dt$, then split $\\frac{1}{t(1-t)}=\\frac1t+\\frac{1}{1-t}$.",
      "Two pieces: $\\int_0^{1/2}\\frac{-\\ln(1-t)}{1-t}dt=\\frac12\\ln^22$; $\\int_0^{1/2}\\frac{-\\ln(1-t)}{t}dt=\\mathrm{Li}_2\\left(\\frac12\\right)=\\sum\\frac{1}{n^22^n}$.",
      "Special value: $\\mathrm{Li}_2\\left(\\frac12\\right)=\\frac{\\pi^2}{12}-\\frac{\\ln^22}{2}$.",
      "Add: $\\frac{\\pi^2}{12}-\\frac{\\ln^22}{2}+\\frac{\\ln^22}{2}=\\frac{\\pi^2}{12}\\approx0.8225$."
    ],
    "trap": "Keeping only the $\\frac1t$ piece of the partial fractions and answering $\\mathrm{Li}_2\\left(\\frac12\\right)\\approx0.5822$, missing the $\\frac12\\ln^22$.",
    "check": "The first three terms $\\frac12+\\frac{3/2}{8}+\\frac{11/6}{24}\\approx0.764$, and the positive terms slowly add up to $0.8225$ — reasonable."
  },
  "cl-ser-041": {
    "spot": "The coefficient $\\frac{(3n)!}{(n!)^3}$ is all factorials — use the ratio method for the radius; but at the endpoints the ratio $\\to1$ and the ratio method fails, so you need to know how fast the endpoint terms $b_n$ decay (like $\\frac1n$).",
    "why": "The radius takes one line with the ratio method; at the endpoints you need Raabe's (Gauss's) test or Stirling to get $b_n\\sim\\frac{c}{n}$, which is what separates \"positive series diverges, alternating series converges\".",
    "steps": [
      "Ratio: $\\frac{a_{n+1}}{a_n}=\\frac{(3n+1)(3n+2)(3n+3)}{(n+1)^3}\\to27$, radius $R=\\frac{1}{27}$.",
      "Endpoint terms $b_n=\\frac{a_n}{27^n}$: $\\frac{b_{n+1}}{b_n}=\\frac{(3n+1)(3n+2)}{9(n+1)^2}=1-\\frac1n+O\\left(\\frac{1}{n^2}\\right)$, and the Raabe number $n\\left(1-\\frac{b_{n+1}}{b_n}\\right)\\to1$.",
      "Stirling gives $b_n\\sim\\frac{\\sqrt3}{2\\pi n}$ (at $n=10$, $n\\,b_n\\approx0.270$, already close to $\\frac{\\sqrt3}{2\\pi}\\approx0.276$). At $x=\\frac{1}{27}$, $\\sum b_n$ is of the same order as $\\sum\\frac1n$ and diverges.",
      "$x=-\\frac{1}{27}$: $\\sum(-1)^nb_n$; the ratio $\\frac{(3n+1)(3n+2)}{9(n+1)^2}<1$, so $b_n$ is decreasing, and $b_n\\to0$, so the Alternating Series Test gives convergence.",
      "The interval of convergence is $\\left[-\\frac{1}{27},\\frac{1}{27}\\right)$, closed on the left and open on the right: the left endpoint converges, the right diverges."
    ],
    "trap": "Looking only at \"$b_n\\to0$\" at the endpoints and saying both converge, answering $\\left[-\\frac1{27},\\frac1{27}\\right]$; $b_n\\to0$ is enough only for the alternating end — at the positive end you need the decay rate, and order $\\frac1n$ diverges.",
    "check": "A Raabe number of exactly $1$ is the borderline case, so Stirling's $b_n\\sim\\frac{c}{n}$ is needed to finish; the positive end diverges like the harmonic series and the alternating end converges by Leibniz, consistent with the answer."
  },
  "cl-ser-050": {
    "spot": "$f(x)=x(\\pi-|x|)$ is odd, so only sine coefficients; on $[0,\\pi]$ it is $x(\\pi-x)$, whose coefficients are of order $\\frac{1}{n^3}$, and squared that's $\\frac{1}{n^6}$ — exactly a sixth-power sum from Parseval.",
    "why": "Parseval replaces $\\sum b_n^2$ with $\\frac1\\pi\\int f^2$; the coefficients are nonzero only for odd $n$, so you get the odd-term $\\sum\\frac{1}{n^6}$ directly.",
    "steps": [
      "Odd function: $b_n=\\frac2\\pi\\int_0^\\pi x(\\pi-x)\\sin nx\\,dx$; integrating by parts twice gives $\\int_0^\\pi x(\\pi-x)\\sin nx\\,dx=\\frac{2(1-(-1)^n)}{n^3}$.",
      "Odd $n$: $b_n=\\frac{8}{\\pi n^3}$; even $n$: $b_n=0$ (e.g. $n=3$).",
      "Left side of Parseval: $\\frac1\\pi\\int_{-\\pi}^{\\pi}f^2dx=\\frac2\\pi\\int_0^\\pi x^2(\\pi-x)^2dx=\\frac2\\pi\\cdot\\frac{\\pi^5}{30}=\\frac{\\pi^4}{15}$.",
      "Right side $\\sum b_n^2=\\frac{64}{\\pi^2}\\sum_{k\\ge1}\\frac{1}{(2k-1)^6}$; setting them equal: $\\sum_{k\\ge1}\\frac{1}{(2k-1)^6}=\\frac{\\pi^4}{15}\\cdot\\frac{\\pi^2}{64}=\\frac{\\pi^6}{960}$."
    ],
    "trap": "Misremembering Parseval's constant as $\\frac{1}{2\\pi}\\int f^2=\\sum b_n^2$ halves the answer to $\\frac{\\pi^6}{1920}$; test the constant on a simple $f$ first.",
    "check": "The first term alone is $1$, the second $\\frac{1}{729}\\approx0.00137$, and the total $\\approx1.00145$ is just a bit more than $1$ — it matches."
  },
  "dd-log-010": {
    "spot": "The power tower $x^{x^x}$: the outermost base $x$ and exponent $x^x$ both vary, so take logs; then you run into $(x^x)'$, which needs logarithmic differentiation again.",
    "why": "Both layers have variable base and exponent, so you can only take logs layer by layer; with $(x^x)'=x^x(\\ln x+1)$ memorized, the outer layer is just the Product Rule.",
    "steps": [
      "Take logs: $\\ln y=x^x\\ln x$.",
      "Inner layer: $(x^x)'=x^x(\\ln x+1)$.",
      "Product Rule: $(x^x\\ln x)'=x^x(\\ln x+1)\\ln x+\\frac{x^x}{x}=x^x\\left(\\ln x(\\ln x+1)+\\frac1x\\right)$.",
      "Multiply back by $y$: $y'=x^{x^x}\\cdot x^x\\left(\\ln x(\\ln x+1)+\\frac1x\\right)$."
    ],
    "trap": "Reading $x^{x^x}$ as $(x^x)^x=x^{x^2}$: that's a different function, with derivative $x^{x^2}(2x\\ln x+x)$. A power tower is evaluated from the top down.",
    "check": "At $x=1$: $y'=1\\cdot1\\cdot(0+1)=1$."
  },
  "dm-app-002": {
    "spot": "Volume of revolution about the $x$-axis: the disk method gives $V=\\pi\\int_1^\\infty y^2dx=\\pi\\int_1^\\infty\\frac{dx}{x^2}$, and the improper integral of $\\frac{1}{x^2}$ converges.",
    "why": "The disk cross-section $\\pi y^2$ makes the integrand $\\frac{1}{x^2}$ ($p=2>1$, convergent); the surface area is of order $\\frac1x$ ($p=1$) and diverges — the difference is that square.",
    "steps": [
      "Disk method: $V=\\pi\\int_1^\\infty\\left(\\frac1x\\right)^2dx$.",
      "$\\int_1^b\\frac{dx}{x^2}=1-\\frac1b\\to1$.",
      "$V=\\pi\\cdot1=\\pi$."
    ],
    "trap": "Being spooked by the divergent surface area into thinking the volume is infinite too; or using $\\pi\\int y\\,dx$ (missing the square), which gives the divergent $\\pi\\int_1^\\infty\\frac{dx}{x}$.",
    "check": "The surface-area integrand $\\frac{2\\pi}{x}\\sqrt{1+\\frac{1}{x^4}}\\ge\\frac{2\\pi}{x}$, and integrating to $100$ already exceeds $2\\pi\\ln100$, so it really diverges; the volume, however, stops at $\\pi$."
  },
  "dm-app-003": {
    "spot": "$|\\sin t|$ has fixed sign on each $[k\\pi,(k+1)\\pi]$, and shifting $e^{-t}$ by $\\pi$ multiplies it by $e^{-\\pi}$ — the integrals over the pieces form a geometric series with ratio $e^{-\\pi}$.",
    "why": "An integral of an absolute value must be cut at the zeros; periodicity combined with exponential decay makes the pieces differ only by a factor, so you don't compute them one by one.",
    "steps": [
      "Piece $0$: $\\int_0^\\pi e^{-t}\\sin t\\,dt=\\frac{1+e^{-\\pi}}{2}$ (integration by parts twice).",
      "Piece $k$: let $t=s+k\\pi$; $|\\sin t|=\\sin s$ and $e^{-t}=e^{-k\\pi}e^{-s}$, so it equals $e^{-k\\pi}\\cdot\\frac{1+e^{-\\pi}}{2}$ (e.g. $k=1$).",
      "Sum the geometric series: $\\frac{1+e^{-\\pi}}{2}\\cdot\\frac{1}{1-e^{-\\pi}}=\\frac{1+e^{-\\pi}}{2(1-e^{-\\pi})}\\approx0.5452$."
    ],
    "trap": "Taking the displacement $\\int_0^\\infty e^{-t}\\sin t\\,dt=\\frac12$ as the distance; distance integrates $|v|$, so the negative pieces must be flipped to positive.",
    "check": "The distance $\\approx0.545$ exceeds the displacement $\\frac12$, and the first piece, $\\approx0.522$, makes up most of it."
  }
};
