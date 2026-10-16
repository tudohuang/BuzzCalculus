// Detail v2, English — batch 000-pilot. Translation of tools/content/detail/000-pilot.js (text only; claims live in the Chinese file).
module.exports = {
  "lim-010": {
    "spot": "The numerator is $e^{2x}$ minus $1+2x$ — exactly the first two terms of its Taylor expansion; the denominator is $x^2$. \"An exponential with its first few terms subtracted\" is telling you to expand to the next term.",
    "why": "L'Hôpital's Rule works too (twice), but one line of expansion shows the answer, and shows directly that the numerator is the same order as $x^2$.",
    "steps": [
      "Plug in $x=0$ first: numerator $e^0-1-0=0$, denominator $0$ — the form is $\\frac{0}{0}$, so you can't just substitute.",
      "Put $u=2x$ into $e^u=1+u+\\frac{u^2}{2}+\\frac{u^3}{6}+\\cdots$: $e^{2x}=1+2x+2x^2+\\frac{4}{3}x^3+\\cdots$.",
      "Subtracting $1+2x$ wipes out the constant and linear terms, leaving $e^{2x}-1-2x=2x^2+\\frac{4}{3}x^3+\\cdots$.",
      "Divide by $x^2$: $\\frac{e^{2x}-1-2x}{x^2}=2+\\frac{4}{3}x+\\cdots\\to 2$."
    ],
    "trap": "Expanding only to first order ($e^{2x}\\approx 1+2x$) gives $\\frac{0}{x^2}$, and you conclude the limit is $0$. Expand up to \"the first nonzero term left after subtracting\".",
    "check": "Try $x=0.01$: $\\frac{e^{0.02}-1-0.02}{0.0001}\\approx 2.013$, close to $2$ and slightly above $2$ — by exactly the size of the next term $\\frac{4}{3}x$."
  },
  "mob-limtrap-005": {
    "spot": "The numerator is $e^x$ minus $1+x+\\frac{x^2}{2}$ (the first three terms), over $x^3$: subtract that many terms, expand to the next one — here up to $x^3$.",
    "why": "L'Hôpital's Rule needs three rounds, checking each time that it's still $\\frac{0}{0}$; one line of expansion shows the $x^3$ coefficient.",
    "steps": [
      "Plugging in $x=0$ gives $\\frac{0}{0}$.",
      "$e^x=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}+\\frac{x^4}{24}+\\cdots$.",
      "Remove the first three terms: numerator $=\\frac{x^3}{6}+\\frac{x^4}{24}+\\cdots$.",
      "Divide by $x^3$: $\\frac{1}{6}+\\frac{x}{24}+\\cdots\\to\\frac{1}{6}$."
    ],
    "trap": "Wrong coefficient: the $x^3$ coefficient is $\\frac{1}{3!}=\\frac{1}{6}$, not $\\frac{1}{3}$.",
    "check": "At $x=0.01$ the ratio is about $0.16708$, a bit above $\\frac{1}{6}\\approx 0.16667$ (the next term $\\frac{x}{24}$ is positive)."
  },
  "db-ext-012": {
    "spot": "It asks for a \"local minimum point\": find where $f'(x)=0$, then check whether the derivative goes \"from negative to positive\" there. If $f'$ has a squared factor like $x^2$, that point is usually not an extremum — that's the trap here.",
    "why": "The second derivative test fails at $x=0$ ($f''(0)=0$); reading the sign of $f'$ is the most direct and settles both critical points at once.",
    "steps": [
      "$f'(x)=4x^3-12x^2=4x^2(x-3)$.",
      "Critical points: $4x^2(x-3)=0 \\Rightarrow x=0$ or $x=3$.",
      "Around $x=0$: $4x^2\\ge 0$ and $x-3<0$, so $f'$ is negative on both sides of $0$ — the function keeps going down; not an extremum.",
      "Around $x=3$: $f'<0$ on the left, $f'>0$ on the right — down then up, a local minimum.",
      "So the only local minimum point is $x=3$ (minimum value $f(3)=81-108=-27$)."
    ],
    "trap": "Seeing $f'(0)=0$ and calling $x=0$ an extremum too. A zero derivative is only a candidate; check for a sign change. An even-power factor like $x^2$ doesn't change the sign of the derivative.",
    "check": "$f(2.9)$ and $f(3.1)$ are both larger than $f(3)=-27$, so $3$ really is a valley; and $f(-0.1)>f(0)>f(0.1)$, so $0$ is just a flat spot."
  },
  "lm-sq-006": {
    "spot": "As $x\\to 0$, $\\frac{1}{x}$ blows up, while the outer $\\sin$ is bounded and keeps oscillating — and there's no factor in front squeezing it to $0$. For a \"bounded, oscillating, nothing squeezing it\" limit, use two paths that force two different values.",
    "why": "To prove a limit doesn't exist, plugging in a few small numbers proves nothing; picking two sequences that both go to $0$ but keep the function at different constants is the cleanest.",
    "steps": [
      "As $x\\to 0$, $u=\\frac{1}{x}\\to\\infty$, and $\\sin u$ swings between $[-1,1]$ infinitely often; e.g. $x=\\frac{1}{201\\pi}$ is already very close to $0$, and the function value there is $0$.",
      "Take $x_n=\\frac{1}{\\frac{\\pi}{2}+2n\\pi}\\to 0$: $\\sin\\frac{1}{x_n}=\\sin\\left(\\frac{\\pi}{2}+2n\\pi\\right)=1$, so along this sequence the limit is $1$.",
      "Take $y_n=\\frac{1}{\\frac{3\\pi}{2}+2n\\pi}\\to 0$: $\\sin\\frac{1}{y_n}=-1$, so along this sequence the limit is $-1$.",
      "Both sequences go to $0$, yet the function values sit at $1$ and $-1$, always $2$ apart; so $\\lim_{x\\to 0}\\sin\\frac{1}{x}$ does not exist."
    ],
    "trap": "Confusing it with $x\\sin\\frac{1}{x}$: there the $x$ in front squeezes the bounded $\\sin$ to $0$, and the Squeeze Theorem gives $0$. Here there's no $x$, and squeezing only gives $-1\\le\\sin\\frac{1}{x}\\le 1$ — no limit.",
    "check": "$x=\\frac{1}{100\\pi}$ and $x=\\frac{1}{100.5\\pi}$ differ by less than $10^{-5}$, yet one gives $0$ and the other $1$ — the closer to $0$, the faster it swings; it never settles."
  },
  "an-sup-002": {
    "spot": "$(-1)^n$ splits the set in two: even terms positive, odd terms negative. For the infimum only the negative half matters, and $-(1+\\frac{1}{n})$ is most negative at $n=1$.",
    "why": "The infimum isn't necessarily a limit; if the set has a smallest element, $\\inf$ is that element — finding the minimum first is more reliable than computing $\\liminf$ first.",
    "steps": [
      "Split by parity: even $n$ gives $1+\\frac{1}{n}>0$, odd $n$ gives $-(1+\\frac{1}{n})<0$. The first few terms are $-2,\\ \\frac{3}{2},\\ -\\frac{4}{3},\\ \\frac{5}{4},\\dots$",
      "The positive half can't be smaller than the negative one, so look only at odd terms: $-(1+\\frac{1}{n})$ climbs toward $-1$ as $n$ grows, and for $n\\ge 2$ they're all bigger than $-2$.",
      "So $-2$ is a lower bound, and it's actually attained at $n=1$: it's the smallest element, $\\inf S=\\min S=-2$."
    ],
    "trap": "Answering $-1$: that's the limit of the odd terms (the $\\liminf$), not the infimum. $-(1+\\frac{1}{n})$ climbs from $-2$ up to $-1$; the lowest point is at the start, not at the limit.",
    "check": "$\\inf S$ must be $\\le$ every number in the set, and $\\le\\liminf$: $-2<-1$, consistent."
  },
  "dm-seq-004": {
    "spot": "$\\binom{2n}{n}=\\frac{(2n)!}{(n!)^2}$ divided by $4^n$, times $\\sqrt{n}$: the \"exponential part\" of the factorials cancels $4^n$ exactly, and the whole answer comes from the square-root factor in Stirling's formula.",
    "why": "The Wallis product works too, but you first have to rewrite $\\binom{2n}{n}4^{-n}$ as an integral; Stirling plugs straight into the three factorials and simplifies in one line.",
    "steps": [
      "Stirling: $n!\\sim\\sqrt{2\\pi n}\\left(\\frac{n}{e}\\right)^n$ (at $n=10$ the error is already under $1\\%$).",
      "Numerator $(2n)!\\sim\\sqrt{4\\pi n}\\left(\\frac{2n}{e}\\right)^{2n}$, denominator $(n!)^2\\sim 2\\pi n\\left(\\frac{n}{e}\\right)^{2n}$.",
      "Divide: $e^{2n}$ cancels, $\\frac{(2n)^{2n}}{n^{2n}}=4^n$, and the root part is $\\frac{\\sqrt{4\\pi n}}{2\\pi n}=\\frac{1}{\\sqrt{\\pi n}}$, giving $\\binom{2n}{n}\\sim\\frac{4^n}{\\sqrt{\\pi n}}$.",
      "Multiply by $\\sqrt{n}\\,4^{-n}$: $4^n$ and $\\sqrt{n}$ both cancel, leaving $\\frac{1}{\\sqrt{\\pi}}$."
    ],
    "trap": "Remembering Stirling only as $\\left(\\frac{n}{e}\\right)^n$ and dropping $\\sqrt{2\\pi n}$: you get $\\binom{2n}{n}\\approx 4^n$, and after multiplying by $\\sqrt{n}$ you think the limit is $\\infty$. The entire answer comes from that root factor.",
    "check": "Compare with the Wallis integral $\\binom{2n}{n}4^{-n}=\\frac{2}{\\pi}\\int_0^{\\pi/2}\\sin^{2n}x\\,dx$: at $n=3$ it's exactly $\\frac{20}{64}$; at $n=400$, $\\sqrt{n}\\binom{2n}{n}4^{-n}\\approx 0.5640$, approaching $\\frac{1}{\\sqrt{\\pi}}\\approx 0.5642$ from below."
  },
  "lx-eps-001": {
    "spot": "$f$ is a line, so $|f(x)-L|$ turns straight into \"slope $\\times|x-x_0|$\". For a line, $\\delta$ is just $\\varepsilon$ divided by the slope.",
    "why": "For a general function you first have to bound $|f(x)-L|$ to find $\\delta$; a line needs no bounding — one equation solves for $\\delta$, and it's the largest one.",
    "steps": [
      "$|f(x)-L|=|3x+1-7|=|3x-6|=3|x-2|$.",
      "We need $3|x-2|<0.06$, i.e. $|x-2|<\\frac{0.06}{3}=0.02$.",
      "Any bigger fails: if $\\delta>0.02$, then $x=2.02$ is in range and $|f(x)-L|$ equals exactly $0.06$, which isn't strictly less. So the largest $\\delta$ is $0.02$."
    ],
    "trap": "Taking $\\delta=\\varepsilon=0.06$ directly: you forgot that slope $3$ triples the error — at $x=2.05$, $|f(x)-L|=0.15$, way over.",
    "check": "$x=2.019$ (within $0.02$ of $2$): $|3(2.019)+1-7|=0.057<0.06$, it holds."
  },
  "an-en-004": {
    "spot": "It asks for the \"smallest $N$\", so no rough estimates: simplify $|a_n-3|$ exactly into an expression in $n$, confirm it's decreasing, then solve the inequality and round to an integer.",
    "why": "The estimate $|a_n-3|\\approx\\frac{3}{n}$ only gives \"a large enough $N$\"; the problem wants the minimum, and being off by one or two is wrong.",
    "steps": [
      "Common denominator: $a_n-3=\\frac{3n^2+1-3n^2-3n}{n^2+n}=\\frac{1-3n}{n^2+n}$, so $|a_n-3|=\\frac{3n-1}{n^2+n}$.",
      "$\\frac{3n-1}{n^2+n}$ decreases with $n$ (roughly $\\frac{3}{n}$), so once some $n$ satisfies $<10^{-3}$, every later one does too.",
      "Solve $\\frac{3n-1}{n^2+n}<\\frac{1}{1000}$: $n^2-2999n+1000>0$, with larger root $n=\\frac{2999+\\sqrt{2999^2-4000}}{2}\\approx 2998.67$.",
      "The first integer above $2998.67$ is $2999$: $n=2998$ falls just short, $n=2999$ works."
    ],
    "trap": "Using $|a_n-3|\\approx\\frac{3}{n}$ and solving $\\frac{3}{n}<10^{-3}$ gives $N=3001$; the real numerator is $3n-1$ and the denominator has an extra $+n$, so the error is a bit smaller than $\\frac{3}{n}$ and the threshold comes earlier, at $2999$.",
    "check": "The size matches: $\\frac{3}{N}$ is exactly $10^{-3}$ at $N=3000$, and the exact answer lands right next to it."
  },
  "an-ca-001": {
    "spot": "$H_{2n}-H_n=\\frac{1}{n+1}+\\cdots+\\frac{1}{2n}$: exactly $n$ terms, each about $\\frac{1}{n}$ in size — \"$n$ terms, each about $\\frac{1}{n}$\" is what a Riemann sum looks like.",
    "why": "You could also subtract using $H_n=\\ln n+\\gamma+o(1)$, but that requires knowing $\\gamma$ exists; the Riemann sum needs only one definite integral.",
    "steps": [
      "After subtracting, only the back half remains: $H_{2n}-H_n=\\sum_{k=1}^{n}\\frac{1}{n+k}$ (e.g. for $n=3$ it's $\\frac14+\\frac15+\\frac16$).",
      "Pull $\\frac{1}{n}$ out of each term: $\\frac{1}{n+k}=\\frac{1}{n}\\cdot\\frac{1}{1+k/n}$, so the sum is the right-endpoint Riemann sum of $f(x)=\\frac{1}{1+x}$ on $[0,1]$.",
      "As $n\\to\\infty$ the Riemann sum tends to the definite integral: $\\int_0^1\\frac{dx}{1+x}=\\ln 2$."
    ],
    "trap": "\"$H_{2n}$ and $H_n$ both diverge, so the difference is $\\infty-\\infty$\", or \"every term goes to $0$, so the sum goes to $0$\" — both wrong: the number of terms $n$ grows while each term $\\frac{1}{n}$ shrinks, and they balance out to a finite value.",
    "check": "$f=\\frac{1}{1+x}$ is decreasing, so the right-endpoint sum runs low: at $n=3$, $\\frac14+\\frac15+\\frac16\\approx 0.617$, below $\\ln 2\\approx 0.693$."
  },
  "lx-hard-008": {
    "spot": "Inside the $\\ln$ is $\\cos 3x$, which near $0$ is $1$ plus something small: $\\ln(1+u)\\approx u$, and $u=\\cos 3x-1$ is the same order as $x^2$ — a perfect match for the $x^2$ in the denominator.",
    "why": "L'Hôpital's Rule means differentiating $\\ln(\\cos 3x)$ twice, with fractions getting longer each time; chaining two familiar expansions takes two lines.",
    "steps": [
      "Plug in $x=0$: $\\ln(\\cos 0)=\\ln 1=0$, and the denominator is $0$ too — $\\frac{0}{0}$ form.",
      "$\\cos 3x=1-\\frac{(3x)^2}{2}+\\cdots=1-\\frac{9}{2}x^2+\\cdots$, so $u=\\cos 3x-1\\approx-\\frac{9}{2}x^2$.",
      "$\\ln(1+u)=u-\\frac{u^2}{2}+\\cdots$, and $u^2$ is of order $x^4$, negligible next to $x^2$: $\\ln(\\cos 3x)\\approx u$.",
      "Divide by $x^2$: $\\frac{\\ln(\\cos 3x)}{x^2}\\to-\\frac{9}{2}$."
    ],
    "trap": "Writing $(3x)^2$ as $3x^2$ gives $-\\frac{3}{2}$; forgetting the $\\frac{1}{2}$ in the $\\cos$ expansion gives $-9$.",
    "check": "A negative answer makes sense: $\\cos 3x<1$, and $\\ln$ of a number below $1$ is negative. At $x=0.01$ you get about $-4.5007$."
  },
  "db-def-001": {
    "spot": "$(2+h)^3-8$ over $h$, and $8=2^3$: this is $\\frac{f(2+h)-f(2)}{h}$ with $f(x)=x^3$ — the problem is really asking for $f'(2)$.",
    "why": "Once you recognize the derivative definition, no expanding needed — just use $(x^3)'=3x^2$; expanding only does the same thing over again.",
    "steps": [
      "Match the definition: $f(x)=x^3$, $a=2$, $f(2)=8$, so the limit is $f'(2)$.",
      "$f'(x)=3x^2$, $f'(2)=12$.",
      "Confirm by expanding: $(2+h)^3-8=12h+6h^2+h^3$; dividing by $h$ gives $12+6h+h^2\\to 12$."
    ],
    "trap": "Answering $8$: that's $f(2)$, not $f'(2)$. Or plugging in $h=0$, getting $\\frac{0}{0}$, and thinking it can't be computed — $\\frac{0}{0}$ is exactly what a derivative definition should look like.",
    "check": "$h=0.01$: $\\frac{2.01^3-8}{0.01}=12.0601$; the extra $0.06$ is the $6h$."
  },
  "der-032": {
    "spot": "Partial derivative with respect to $y$: treat $x$ as a constant throughout. Outer layer $\\arctan$, inner layer $\\frac{y}{x}$ — one application of the Chain Rule.",
    "why": "Write the outer derivative $\\frac{1}{1+u^2}$, multiply by the inner $\\frac{1}{x}$, then simplify; no need for implicit differentiation or polar coordinates.",
    "steps": [
      "Outer: $\\frac{d}{du}\\arctan u=\\frac{1}{1+u^2}$, with $u=\\frac{y}{x}$.",
      "Inner: $x$ is constant, so $\\frac{\\partial}{\\partial y}\\frac{y}{x}=\\frac{1}{x}$.",
      "Multiply and simplify: $\\frac{1}{1+y^2/x^2}\\cdot\\frac{1}{x}=\\frac{x^2}{x^2+y^2}\\cdot\\frac{1}{x}=\\frac{x}{x^2+y^2}$."
    ],
    "trap": "Forgetting the inner $\\frac{1}{x}$ gives $\\frac{x^2}{x^2+y^2}$; differentiating with respect to $x$ instead gives $-\\frac{y}{x^2+y^2}$.",
    "check": "$\\arctan\\frac{y}{x}$ is the polar angle $\\theta$. At $(1,0)$, a small step $dy$ in the $y$ direction turns the angle by about $dy$, so the partial derivative should be $1$: $\\frac{1}{1+0}=1$."
  },
  "der-064": {
    "spot": "The Wronskian is the determinant $\\begin{vmatrix}f&g\\\\f'&g'\\end{vmatrix}=fg'-f'g$. Both functions carry $e^x$, so the product leaves $e^{2x}$ times something very simple.",
    "why": "Plugging into $fg'-f'g$ is fastest; differentiate $xe^x$ with the Product Rule, and the two $xe^{2x}$ terms cancel on their own.",
    "steps": [
      "$f=e^x$, $f'=e^x$; $g=xe^x$, $g'=e^x+xe^x=(1+x)e^x$.",
      "Substitute: $W=e^x\\cdot(1+x)e^x-e^x\\cdot xe^x=(1+x)e^{2x}-xe^{2x}$.",
      "The $xe^{2x}$ terms cancel: $W=e^{2x}$."
    ],
    "trap": "Reversing the order to $f'g-fg'$ gives $-e^{2x}$. Memory aid: the determinant's first row is the functions, the second row their derivatives; main diagonal minus the other diagonal.",
    "check": "$e^x$ and $xe^x$ are two solutions of $y''-2y'+y=0$; Abel's formula says $W$ must satisfy $W'=2W$, and $W(0)=1\\ne 0$ (the solutions are linearly independent). $e^{2x}$ passes both."
  },
  "gap-der-ode-004": {
    "spot": "$y''+y=0$ is a constant-coefficient homogeneous equation with purely imaginary characteristic roots $\\pm i$ — the solution must be a combination of $\\cos x$ and $\\sin x$, and the initial conditions fix the two coefficients.",
    "why": "The characteristic equation turns the differential equation into an algebraic one; the initial condition $y(0)$ controls the $\\cos$ coefficient and $y'(0)$ controls the $\\sin$ coefficient, one at a time.",
    "steps": [
      "Characteristic equation $r^2+1=0$, $r=\\pm i$, general solution $y=A\\cos x+B\\sin x$ ($\\cos x$ and $\\sin x$ each satisfy $y''+y=0$).",
      "$y(0)=A\\cos 0+B\\sin 0=A=0$.",
      "$y'=-A\\sin x+B\\cos x$, $y'(0)=B=1$.",
      "So $y=\\sin x$; plugging back in, the equation and both initial conditions hold."
    ],
    "trap": "Matching the conditions to the wrong coefficients and writing $\\cos x$: $\\cos 0=1$, which doesn't match $y(0)=0$.",
    "check": "Think of a spring: starting from equilibrium $y=0$ with speed $1$, after a quarter period it reaches the farthest point $y=1$."
  },
  "der-041": {
    "spot": "You're given a point and two small increments $dx$, $dy$, and asked to \"estimate\" $\\Delta f$: use the total differential $df=f_x\\,dx+f_y\\,dy$ with the partial derivatives evaluated at $(2,1)$.",
    "why": "The total differential just multiplies and adds two partial derivatives — no need for the exact value of $f(2.01,0.98)-f(2,1)$ (that needs expanding, and the problem wants the linear estimate anyway).",
    "steps": [
      "$f=x^2y$: $f_x=2xy$, $f_y=x^2$.",
      "At $(2,1)$: $f_x=2\\cdot2\\cdot1=4$, $f_y=2^2=4$.",
      "$df=4(0.01)+4(-0.02)=0.04-0.08=-0.04$."
    ],
    "trap": "Dropping the minus sign in $dy=-0.02$ gives $0.04+0.08=0.12$; or swapping $f_x$ and $f_y$ (here both happen to be $4$, but in another problem it would be wrong).",
    "check": "The exact value $f(2.01,0.98)-f(2,1)=2.01^2(0.98)-4\\approx-0.0407$ differs from the estimate $-0.04$ only by second-order terms."
  },
  "der-084": {
    "spot": "The integrand is $\\frac{1}{z-a}$ and the integral is already divided by $2\\pi i$: this is the standard form of the Cauchy integral formula (with $f\\equiv 1$) / winding number. Just decide whether $a=1$ lies inside the circle $|z|=2$.",
    "why": "The Cauchy integral formula gives $f(1)=1$ directly, with no parametrizing and integrating a complex function; the real integrals below just unpack it as a check.",
    "steps": [
      "The only singularity is $z=1$. On the circle $z=2e^{it}$, $|z-1|^2=5-4\\cos t\\ge 1$, so the path avoids the singularity; and $|1|<2$, so the singularity is inside the circle.",
      "Cauchy integral formula ($f(z)=1$, $a=1$): $\\frac{1}{2\\pi i}\\oint\\frac{f(z)}{z-1}\\,dz=f(1)=1$. Actually substituting $z=2e^{it}$: the integrand becomes $\\frac{1}{2\\pi}\\cdot\\frac{4-2\\cos t-2i\\sin t}{5-4\\cos t}\\,dt$, and the imaginary part cancels out.",
      "The answer $1$ is the number of times the circle winds around $z=1$, independent of the radius: with $|z|=3$, the real part $\\frac{9-3\\cos t}{10-6\\cos t}$ also averages to $1$."
    ],
    "trap": "Answering $2\\pi i$: that's $\\oint\\frac{dz}{z-1}$ itself, but the problem has already divided by $2\\pi i$.",
    "check": "Try the opposite: if the circle were $|z|=\\frac{1}{2}$, then $z=1$ is outside and the integral should be $0$ — parametrizing confirms the real part averages to $0$."
  },
  "ode-h2-002": {
    "spot": "$y''+y=0$: second-order, constant coefficients, homogeneous, characteristic roots $\\pm i$, so the solution is a combination of $\\cos x$ and $\\sin x$; the two initial conditions fix exactly two coefficients.",
    "why": "The characteristic equation is the standard method for constant-coefficient linear equations; the values and derivatives of $\\cos$, $\\sin$ at $0$ are all $0$ or $1$, so the coefficients can be read off directly.",
    "steps": [
      "Characteristic equation $r^2+1=0$, $r=\\pm i$, general solution $y=A\\cos x+B\\sin x$.",
      "$y(0)=A=1$.",
      "$y'(0)=-A\\sin 0+B\\cos 0=B=0$.",
      "So $y=\\cos x$; plugging back in, the equation and the initial conditions hold."
    ],
    "trap": "Seeing $y''+y=0$ and reflexively writing $\\sin x$: $\\sin 0=0$, which doesn't match $y(0)=1$. This one is \"released from rest at the farthest point\", so it's $\\cos$.",
    "check": "A spring released from rest at $y=1$ swings to the other end $y=-1$ after half a period $\\pi$."
  },
  "depth-int-026": {
    "spot": "$x^3=x^2\\cdot x$, and $x\\,dx$ is exactly $\\frac{1}{2}d(x^2)$: substitute $u=x^2$, the $x^2$ in the exponent becomes $u$, and the integral becomes $\\int u e^{-u}\\,du$ (the Gamma function $\\Gamma(2)$).",
    "why": "Integration by parts directly also works, but you first have to split $x^3$ into $x^2\\cdot xe^{-x^2}$; one substitution turns it into the familiar $\\int_0^\\infty ue^{-u}\\,du=1$.",
    "steps": [
      "Let $u=x^2$, $du=2x\\,dx$: $x^3e^{-x^2}\\,dx=x^2e^{-x^2}\\cdot x\\,dx=\\frac{1}{2}ue^{-u}\\,du$, with limits $0\\to 0$ and $\\infty\\to\\infty$.",
      "$\\int_0^\\infty ue^{-u}\\,du$: integration by parts gives the antiderivative $-(u+1)e^{-u}$, and from $0$ to $\\infty$ that's $0-(-1)=1$.",
      "Multiply by the $\\frac{1}{2}$ in front: the answer is $\\frac{1}{2}$."
    ],
    "trap": "Forgetting the $\\frac{1}{2}$ that comes from $du=2x\\,dx$ and answering $1$.",
    "check": "The same trick in general: $\\int_0^\\infty x^{2k+1}e^{-x^2}dx=\\frac{k!}{2}$. $k=1$ is this problem's $\\frac{1}{2}$; $k=2$ ($x^5$) should give $1$."
  },
  "ode-h2-007": {
    "spot": "$y''+9y=0$: characteristic roots $\\pm 3i$, so the solution is a combination of $\\cos 3x$ and $\\sin 3x$. Note that $y'(0)$ picks up an extra inner factor of $3$.",
    "why": "Same characteristic-equation method as $y''+y=0$, just with frequency $3$; each initial condition still fixes one coefficient.",
    "steps": [
      "$r^2+9=0$, $r=\\pm 3i$, general solution $y=A\\cos 3x+B\\sin 3x$.",
      "$y(0)=A=0$, leaving $y=B\\sin 3x$.",
      "$y'=3B\\cos 3x$, $y'(0)=3B=3$, so $B=1$.",
      "$y=\\sin 3x$; plugging back in, the equation, $y(0)=0$ and $y'(0)=3$ all hold."
    ],
    "trap": "Taking $y'(0)=3$ to mean $B=3$ and writing $3\\sin 3x$: its $y'(0)=9$ — the Chain Rule's $3$ got counted twice.",
    "check": "The period of $\\sin 3x$ is $\\frac{2\\pi}{3}$, matching the frequency $3$ from $r=\\pm 3i$."
  },
  "lb-con-005": {
    "spot": "It asks for $\\lim\\int$, not $\\int\\lim$. $nx^n$ can be integrated for every $n$, so integrate first, then take the limit.",
    "why": "The pointwise limit on $[0,1)$ is $0$, but the convergence isn't uniform and there's no integrable dominating function, so limit and integral can't be swapped; honestly integrating first is safest.",
    "steps": [
      "$\\int_0^1 nx^n\\,dx=n\\cdot\\frac{x^{n+1}}{n+1}\\Big|_0^1=\\frac{n}{n+1}$.",
      "The mass all crowds near $x=1$: $\\int_0^{0.9}nx^n\\,dx=\\frac{n}{n+1}0.9^{n+1}\\to 0$, while at every $x<1$, $nx^n\\to 0$.",
      "$\\frac{n}{n+1}\\to 1$."
    ],
    "trap": "Taking the pointwise limit first: for $x<1$, $nx^n\\to 0$, so you think the answer is $\\int_0^1 0=0$. All the integral's mass is squeezed into an ever-narrower strip next to $x=1$, invisible pointwise.",
    "check": "At $n=9$ the integral is $0.9$, already close to $1$."
  },
  "rel-hard-int-007": {
    "spot": "Limits $0$ to $\\frac{\\pi}{2}$, and $\\sin$ and $\\cos$ both to even powers: use $\\cos^2x=1-\\sin^2x$ to get pure powers of $\\sin$, then apply the Wallis recursion.",
    "why": "Reducing powers with half-angle formulas means expanding $(1-\\cos 2x)^2(1+\\cos 2x)$ and reducing again — lots of terms; Wallis needs just two recursion steps.",
    "steps": [
      "$\\sin^4x\\cos^2x=\\sin^4x(1-\\sin^2x)=\\sin^4x-\\sin^6x$.",
      "Wallis: $I_n=\\int_0^{\\pi/2}\\sin^nx\\,dx=\\frac{n-1}{n}I_{n-2}$, $I_0=\\frac{\\pi}{2}$. So $I_4=\\frac{3}{4}\\cdot\\frac{1}{2}\\cdot\\frac{\\pi}{2}=\\frac{3\\pi}{16}$.",
      "$I_6=\\frac{5}{6}I_4=\\frac{5}{6}\\cdot\\frac{3\\pi}{16}=\\frac{5\\pi}{32}$.",
      "Subtract: $\\frac{3\\pi}{16}-\\frac{5\\pi}{32}=\\frac{6\\pi-5\\pi}{32}=\\frac{\\pi}{32}$."
    ],
    "trap": "For even powers, Wallis ends by multiplying by $I_0=\\frac{\\pi}{2}$ (odd powers end with $I_1=1$); forget that factor and you get $\\frac{3}{8}-\\frac{5}{16}=\\frac{1}{16}$.",
    "check": "The integrand's maximum is at $\\sin^2x=\\frac{2}{3}$, equal to $\\frac{4}{27}$; the integral can't exceed $\\frac{\\pi}{2}\\cdot\\frac{4}{27}\\approx 0.233$, and $\\frac{\\pi}{32}\\approx 0.098$ is within range."
  },
  "lb-con-003": {
    "spot": "$nx$ times $e^{-nx^2}$: the $x\\,dx$ pairs with the $x^2$ in the exponent, so substituting $u=nx^2$ computes each $\\int_0^1 f_n$ exactly; then let $n\\to\\infty$.",
    "why": "The pointwise limit is $0$ everywhere, but $f_n$ has a spike at $x=\\frac{1}{\\sqrt{2n}}$ that gets taller and narrower, so the limit can't be moved inside the integral; only integrating first shows the spike's area.",
    "steps": [
      "Substitute $u=nx^2$, $du=2nx\\,dx$: the antiderivative is $-\\frac{1}{2}e^{-nx^2}$.",
      "$\\int_0^1 nxe^{-nx^2}\\,dx=\\frac{1}{2}\\left(1-e^{-n}\\right)$.",
      "The spike: the maximum is at $x=\\frac{1}{\\sqrt{2n}}$, with height $\\sqrt{\\frac{n}{2}}\\,e^{-1/2}$ going to infinity; but for fixed $x>0$, $f_n(x)\\to 0$.",
      "$e^{-n}\\to 0$, so $\\lim\\int_0^1 f_n=\\frac{1}{2}$."
    ],
    "trap": "Taking the pointwise limit $0$ first and then integrating, answering $0$. Here $\\int\\lim=0$ while $\\lim\\int=\\frac{1}{2}$; the difference is exactly the area the spike carries off.",
    "check": "At $n=10$ the integral is already $\\frac{1-e^{-10}}{2}\\approx 0.49998$, very close to $\\frac{1}{2}$."
  },
  "dm-int-001": {
    "spot": "Denominator $x^2$, target $\\frac{\\sin x}{x}$: integration by parts integrates $\\frac{1}{x^2}$ into $-\\frac{1}{x}$ while differentiating $\\sin^2x$ into $\\sin 2x$ — landing right in the Dirichlet integral.",
    "why": "Splitting with $\\sin^2x=\\frac{1-\\cos 2x}{2}$ gives two integrals that each diverge; integration by parts lowers the power by one, and the boundary term is $0$.",
    "steps": [
      "By parts: $u=\\sin^2x$, $dv=\\frac{dx}{x^2}$, $du=2\\sin x\\cos x\\,dx=\\sin 2x\\,dx$, $v=-\\frac{1}{x}$.",
      "Boundary term $\\left[-\\frac{\\sin^2x}{x}\\right]_0^\\infty=0$: as $x\\to 0^+$, $\\frac{\\sin^2x}{x}\\approx x\\to 0$; as $x\\to\\infty$, it's held down by $\\frac{1}{x}$.",
      "What's left is $\\int_0^\\infty\\frac{\\sin 2x}{x}\\,dx$. Let $t=2x$: $\\frac{dx}{x}=\\frac{dt}{t}$, no extra constant, so it equals $\\int_0^\\infty\\frac{\\sin t}{t}\\,dt=\\frac{\\pi}{2}$.",
      "So $\\int_0^\\infty\\frac{\\sin^2x}{x^2}\\,dx=\\frac{\\pi}{2}$. Numerically, integrating up to $200$ already lands within $\\frac{1}{200}$ below $\\frac{\\pi}{2}$ (the tail is $\\le\\int_{200}^\\infty\\frac{dx}{x^2}$)."
    ],
    "trap": "Multiplying by an extra $2$ when substituting $t=2x$ (thinking $\\int\\frac{\\sin 2x}{x}dx=2\\int\\frac{\\sin t}{t}dt$) and answering $\\pi$. $\\frac{dx}{x}$ is unchanged by scaling: $\\int_0^\\infty\\frac{\\sin ax}{x}dx$ is $\\frac{\\pi}{2}$ for every $a>0$.",
    "check": "The size is reasonable: the integrand is $\\le 1$ (on $[0,1]$) and $\\le\\frac{1}{x^2}$ (on $[1,\\infty)$), so the integral is $<1+1=2$; and the piece on $[0,1]$ alone is nearly $0.9$."
  },
  "cx-seq-001": {
    "spot": "Numerator and denominator are both quadratic in $n$ with the same top degree: the limit is the ratio of leading coefficients; the $+n$ in the numerator and the $+2$ in the denominator are bit players.",
    "why": "Divide through by the top power $n^2$: every bit player becomes $\\frac{c}{n}$ or $\\frac{c}{n^2}$ and goes to $0$ — done in one line, no L'Hôpital's Rule needed.",
    "steps": [
      "Divide top and bottom by $n^2$: $a_n=\\frac{3+\\frac{1}{n}}{1+\\frac{2}{n^2}}$.",
      "$\\frac{1}{n}\\to 0$ and $\\frac{2}{n^2}\\to 0$, so the numerator goes to $3$ and the denominator to $1$.",
      "Limit $=\\frac{3}{1}=3$."
    ],
    "trap": "Seeing the extra $+n$ in the numerator and thinking the numerator is \"bigger\" so it diverges — what matters is the top degree, and both sides are $n^2$.",
    "check": "$n=100$: $\\frac{30100}{10002}\\approx 3.0094$, a bit above $3$ (the numerator's $+n$ matters more than the denominator's $+2$)."
  },
  "cx-smid-007": {
    "spot": "The coefficient $a_n=\\frac{1}{n\\,3^n}$ contains $3^n$: the geometric part sets the radius, and a polynomial factor like $\\frac{1}{n}$ doesn't affect it. The answer is visibly $3$; confirm with the Ratio Test.",
    "why": "The Ratio Test is smoothest for \"exponential × polynomial\" coefficients: the ratio of $3^n$ is the constant $3$, and the ratio of $n$ goes to $1$.",
    "steps": [
      "$a_n=\\frac{1}{n\\,3^n}$; compute $\\left|\\frac{a_n}{a_{n+1}}\\right|=\\frac{(n+1)3^{n+1}}{n\\,3^n}=3\\cdot\\frac{n+1}{n}$.",
      "$\\frac{n+1}{n}\\to 1$, so the polynomial factor's effect disappears.",
      "$R=\\lim\\left|\\frac{a_n}{a_{n+1}}\\right|=3$."
    ],
    "trap": "Computing $\\lim\\left|\\frac{a_{n+1}}{a_n}\\right|=\\frac{1}{3}$ and calling it the radius: that's $\\frac{1}{R}$. Get the fraction the right way up: the radius is the limit of $\\left|\\frac{a_n}{a_{n+1}}\\right|$.",
    "check": "This series is actually $-\\ln\\left(1-\\frac{x}{3}\\right)$, which blows up at $x=3$, so the radius is exactly $3$; inside the radius, e.g. at $x=-2$, the sum is $-\\ln\\frac{5}{3}$."
  },
  "tr-val-001": {
    "spot": "Every derivative of $e^x$ is still $e^x$, equal to $1$ at $0$: the Taylor coefficients are just $\\frac{1}{k!}$. \"Third order\" means up to $x^3$ — four terms.",
    "why": "No need to differentiate one by one: remember $e^x=\\sum\\frac{x^k}{k!}$, cut off at $k=3$, then plug in $x=1$.",
    "steps": [
      "$f^{(k)}(0)=e^0=1$, so the coefficients are $\\frac{1}{k!}$.",
      "$T_3(x)=1+x+\\frac{x^2}{2}+\\frac{x^3}{6}$; its difference from $e^x$ starts at $\\frac{x^4}{24}$.",
      "$T_3(1)=1+1+\\frac{1}{2}+\\frac{1}{6}=\\frac{6+6+3+1}{6}=\\frac{16}{6}=\\frac{8}{3}$."
    ],
    "trap": "Writing only three terms $1+x+\\frac{x^2}{2}$ (that's second order) gives $\\frac{5}{2}$; using $k$ instead of $k!$ in the denominator gives $1+1+\\frac12+\\frac13=\\frac{17}{6}$.",
    "check": "$T_3(1)$ approximates $e\\approx 2.718$: the dropped terms are all positive, so $\\frac{8}{3}\\approx 2.667$ should be below $e$, by about $\\frac{1}{24}+\\frac{1}{120}+\\cdots\\approx 0.05$."
  },
  "uni-ser-015": {
    "spot": "The $n\\cdot y^n$ type: polynomial $n$ times geometric $y^n$, so use $\\sum ny^n=\\frac{y}{(1-y)^2}$. Fold the alternating sign $(-1)^{n+1}$ into $y=-\\frac{1}{2}$.",
    "why": "The formula comes from differentiating a geometric series, so you just plug in one $y$; computing partial sums by brute force means dealing with oscillation, and the limit is hard to see.",
    "steps": [
      "Rewrite: $(-1)^{n+1}\\frac{n}{2^n}=-n\\left(-\\frac{1}{2}\\right)^n$.",
      "Differentiate both sides of $\\sum_{n\\ge 0}y^n=\\frac{1}{1-y}$ and multiply by $y$: $\\sum_{n\\ge 1}ny^n=\\frac{y}{(1-y)^2}$ ($|y|<1$).",
      "Plug in $y=-\\frac{1}{2}$: $\\frac{-1/2}{(3/2)^2}=-\\frac{2}{9}$.",
      "There's still a minus sign in front: the original series $=\\frac{2}{9}$."
    ],
    "trap": "Forgetting the alternating sign and plugging in $y=\\frac{1}{2}$ gives $\\frac{1/2}{1/4}=2$; folding $(-1)^{n+1}$ into $(-1)^n$ and losing the outer minus sign gives $-\\frac{2}{9}$.",
    "check": "Partial sums of an alternating series jump to both sides of the limit: $S_3=0.375$ above, $S_4=0.125$ below, and $\\frac{2}{9}\\approx 0.222$ sits between them."
  },
  "depth-ser-019": {
    "spot": "You only need the $x^4$ coefficient: square $\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\cdots$ and keep only the pairs whose degrees add to $4$ — no need to expand everything.",
    "why": "Differentiating $(\\ln(1+x))^2$ four times and dividing by $4!$ is tedious; $\\ln(1+x)$ has no constant term, so only three pairs can make $x^4$.",
    "steps": [
      "$\\ln(1+x)=x-\\frac{x^2}{2}+\\frac{x^3}{3}-\\frac{x^4}{4}+\\cdots$.",
      "Pairs with degrees adding to $4$: $x\\cdot\\frac{x^3}{3}$ (in both orders) and $\\left(-\\frac{x^2}{2}\\right)^2$; $-\\frac{x^4}{4}$ would need a constant term to pair with, but $\\ln(1+x)$ has none.",
      "$x^4$ coefficient $=\\frac{2}{3}+\\frac{1}{4}=\\frac{11}{12}$, i.e. $(\\ln(1+x))^2=x^2-x^3+\\frac{11}{12}x^4-\\cdots$."
    ],
    "trap": "Counting the cross term $x\\cdot\\frac{x^3}{3}$ only once (forgetting the factor $2$) gives $\\frac{1}{3}+\\frac{1}{4}=\\frac{7}{12}$.",
    "check": "Plug in $x=0.1$: $(\\ln 1.1)^2$ and $x^2-x^3+\\frac{11}{12}x^4$ agree to within $10^{-5}$ (the next term is $-\\frac{5}{6}x^5$)."
  },
  "an-uf-004": {
    "spot": "$f_n(x)=\\frac{nx}{1+n^2x^2}$ depends on $x$ only through $t=nx$: it's $g(t)=\\frac{t}{1+t^2}$ squeezed horizontally, with the height unchanged. The maximum is just the maximum of $g$.",
    "why": "$1+t^2\\ge 2t$ (AM-GM) gives $g\\le\\frac{1}{2}$ in one line, no differentiating; and it shows at a glance that the $\\sup$ doesn't depend on $n$.",
    "steps": [
      "Let $t=5x$; $x\\in[0,1]$ corresponds to $t\\in[0,5]$: $f_5(x)=\\frac{t}{1+t^2}$.",
      "$1+t^2\\ge 2t$, so $\\frac{t}{1+t^2}\\le\\frac{1}{2}$, with equality at $t=1$.",
      "$t=1$ means $x=\\frac{1}{5}$, which is inside $[0,1]$, so it's actually attained: $\\sup|f_5|=f_5(\\frac{1}{5})=\\frac{1}{2}$."
    ],
    "trap": "Assuming the maximum is at an endpoint and plugging in $x=1$ to get $\\frac{5}{26}$; or answering $0$ because of pointwise convergence to $0$. In fact the $\\sup$ is $\\frac{1}{2}$ for every $n$ — which is exactly why the convergence isn't uniform.",
    "check": "Confirm by differentiating: $f_5'(\\frac{1}{5})=0$, and the endpoint value $f_5(1)=\\frac{5}{26}$ is smaller than $\\frac{1}{2}$."
  },
  "an-uf-003": {
    "spot": "$x$ times $e^{-nx^2}$: one pushes up, the other pulls down, so there must be a peak in between. Differentiate in $x$ to find the critical point, then compare with the endpoints.",
    "why": "The function is smooth and the interval is closed, so the maximum is at a critical point or an endpoint; here there's only one critical point, so a quick comparison finishes it.",
    "steps": [
      "$f_8(x)=8xe^{-8x^2}$, $f_8'(x)=8e^{-8x^2}+8x\\cdot(-16x)e^{-8x^2}=8(1-16x^2)e^{-8x^2}$.",
      "$f_8'=0$: $x^2=\\frac{1}{16}$, $x=\\frac{1}{4}\\in[0,1]$; the derivative is positive on the left and negative on the right, so it's the maximum.",
      "$f_8(\\frac{1}{4})=8\\cdot\\frac{1}{4}\\cdot e^{-8/16}=2e^{-1/2}\\approx 1.213$; the endpoint values $f_8(0)=0$ and $f_8(1)=8e^{-8}$ are much smaller."
    ],
    "trap": "Missing the Chain Rule's $-16x$ when differentiating $e^{-8x^2}$, which puts the critical point somewhere else. Another common mistake is seeing \"converges pointwise to $0$\" and answering $0$ — the $\\sup$ isn't $0$; it even grows with $n$.",
    "check": "General $n$: the peak is at $x=\\frac{1}{\\sqrt{2n}}$, with height $\\sqrt{\\frac{n}{2}}\\,e^{-1/2}$. For $n=8$ that's exactly $2e^{-1/2}$."
  }
};
